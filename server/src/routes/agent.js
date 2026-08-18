import { Router } from 'express';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import AIEmployee from '../models/AIEmployee.js';
import { requireCliAuth } from '../middleware/requireCliAuth.js';
import { connectDB } from '../config/db.js';
import {
  getAvailableGeminiKeys,
  hasGeminiApiKeys,
  isQuotaError,
  markGeminiKeyExhausted,
  maskApiKey,
} from '../config/geminiKeys.js';

const router = Router();

// Primary model + fallbacks when one is overloaded (503/429).
// Override with GEMINI_MODEL in server/.env — see https://ai.google.dev/gemini-api/docs/models
const GEMINI_MODEL_FALLBACKS = [
  process.env.GEMINI_MODEL,
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
].filter(Boolean);

const MAX_RETRIES_PER_MODEL = 3;
const MAX_FILE_CHARS = 20000; // small per-file size cap for the demo

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableGeminiError(err) {
  const msg = String(err?.message || err).toLowerCase();
  return (
    msg.includes('503')
    || msg.includes('429')
    || msg.includes('high demand')
    || msg.includes('unavailable')
    || msg.includes('overloaded')
    || msg.includes('resource exhausted')
  );
}

function getModelChain() {
  return [...new Set(GEMINI_MODEL_FALLBACKS)];
}

const toolDeclarations = [
  {
    name: 'list_files',
    description: 'List the files available in the current project directory.',
    parameters: { type: SchemaType.OBJECT, properties: {} },
  },
  {
    name: 'read_file',
    description: 'Read the full contents of a file by path. Not usually needed since file contents are pre-loaded, but available for completeness.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        path: { type: SchemaType.STRING, description: 'Relative file path' },
      },
      required: ['path'],
    },
  },
  {
    name: 'write_file',
    description: 'Write the complete new contents of a file. Always pass the FULL file content, not a diff or partial snippet.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        path: { type: SchemaType.STRING, description: 'Relative file path to write' },
        content: { type: SchemaType.STRING, description: 'The complete new file content' },
      },
      required: ['path', 'content'],
    },
  },
];

function buildModel(employee, modelName, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: modelName,
    systemInstruction:
      `You are ${employee.roleTitle}, an AI software engineer working for AgentHire. ` +
      `You have been given the contents of a real local project directory belonging to a client. ` +
      `The client will give you a task in plain English. ` +
      `CRITICAL: If the client is just saying hello, asking a general question, or gives a vague instruction like "fix this" without context, DO NOT call any tools. Reply directly in plain text asking for clarification. ` +
      `If the client gives a specific coding task, decide which file(s) need to change and call ` +
      `the write_file function with the COMPLETE new content of each file you change (never a partial diff). ` +
      `Keep changes minimal and scoped to the task. When you are done, reply with a short plain-text summary ` +
      `of what you changed and why (no further function calls).`,
    tools: [{ functionDeclarations: toolDeclarations }],
  });
}

async function generateWithRetry(employee, contents) {
  const models = getModelChain();
  let lastError;

  for (const modelName of models) {
    for (const apiKey of getAvailableGeminiKeys()) {
      for (let attempt = 0; attempt < MAX_RETRIES_PER_MODEL; attempt++) {
        try {
          const model = buildModel(employee, modelName, apiKey);
          const result = await model.generateContent({ contents });
          return { result, modelUsed: modelName };
        } catch (err) {
          lastError = err;

          if (isQuotaError(err)) {
            markGeminiKeyExhausted(apiKey);
            console.warn(
              `agent: key ${maskApiKey(apiKey)} quota exceeded — trying next key…`,
            );
            break;
          }

          if (!isRetryableGeminiError(err)) throw err;

          const delay = Math.min(1000 * 2 ** attempt, 8000);
          console.warn(
            `agent: ${modelName} busy with key ${maskApiKey(apiKey)} `
            + `(attempt ${attempt + 1}/${MAX_RETRIES_PER_MODEL}), retry in ${delay}ms…`,
          );
          await sleep(delay);
        }
      }
    }
    console.warn(`agent: ${modelName} unavailable — trying next model…`);
  }

  throw lastError;
}

// ---------------------------------------------------------------------------
// POST /api/agent/run
//
// First call:      { instruction, files: [{ path, content }] }
// Continuation:     { instruction, history, toolResults: [{ name, args, result }], filesChangedSoFar }
//
// Response:         { done, message?, toolCalls?, history, filesChangedSoFar }
// ---------------------------------------------------------------------------
router.post('/run', requireCliAuth, async (req, res) => {
  try {
    if (!hasGeminiApiKeys()) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
    }

    await connectDB();
    const { instruction, files, history, toolResults, filesChangedSoFar } = req.body;

    if (!instruction) {
      return res.status(400).json({ error: 'instruction is required' });
    }

    const employee = await AIEmployee.findById(req.hire.employee);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found for this hire' });
    }

    let contents;
    const changedSoFar = Array.isArray(filesChangedSoFar) ? [...filesChangedSoFar] : [];

    if (Array.isArray(history) && history.length > 0) {
      // Continuing a previous round: append the tool results as a
      // function-response turn, then ask the model to proceed.
      contents = [...history];
      if (Array.isArray(toolResults) && toolResults.length > 0) {
        contents.push({
          role: 'user',
          parts: toolResults.map((tr) => ({
            functionResponse: {
              name: tr.name,
              response: { result: tr.result ?? 'ok' },
            },
          })),
        });
        for (const tr of toolResults) {
          if (tr.name === 'write_file' && tr.args?.path && !changedSoFar.includes(tr.args.path)) {
            changedSoFar.push(tr.args.path);
          }
        }
      }
    } else {
      // First turn: seed the conversation with the pre-read project files.
      const safeFiles = Array.isArray(files) ? files : [];
      const fileBlock = safeFiles
        .map((f) => `--- ${f.path} ---\n${String(f.content).slice(0, MAX_FILE_CHARS)}`)
        .join('\n\n');

      contents = [
        {
          role: 'user',
          parts: [
            {
              text:
                `Here are the contents of the project directory:\n\n${fileBlock || '(no files found)'}\n\n` +
                `Task from the client: ${instruction}`,
            },
          ],
        },
      ];
    }

    const { result, modelUsed } = await generateWithRetry(employee, contents);
    const response = result.response;

    const functionCalls = typeof response.functionCalls === 'function' ? response.functionCalls() : null;

    // Record the model's turn (including any function calls) in history so
    // the next round can continue the conversation correctly.
    const modelParts = response.candidates?.[0]?.content?.parts || [{ text: response.text() }];
    const updatedHistory = [...contents, { role: 'model', parts: modelParts }];

    if (functionCalls && functionCalls.length > 0) {
      return res.json({
        done: false,
        toolCalls: functionCalls.map((fc) => ({ name: fc.name, args: fc.args })),
        history: updatedHistory,
        filesChangedSoFar: changedSoFar,
        modelUsed,
      });
    }

    // No function call — final text turn. Log the activity on the Hire doc.
    const message = response.text();
    req.hire.activityLog.push({
      timestamp: new Date(),
      instruction,
      agentReply: message,
      filesChanged: changedSoFar,
    });
    await req.hire.save();

    res.json({
      done: true,
      message,
      filesChangedSoFar: changedSoFar,
      modelUsed,
    });
  } catch (err) {
    console.error('agent run error:', err);
    res.status(500).json({ error: 'Agent run failed', detail: err.message });
  }
});

export default router;
