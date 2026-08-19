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

const GEMINI_MODEL_FALLBACKS = [
  process.env.GEMINI_MODEL,
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
].filter(Boolean);

const MAX_RETRIES_PER_MODEL = 3;
const MAX_FILE_CHARS = 20000;
const GENERATION_CONFIG = { maxOutputTokens: 8192, temperature: 0.2 };

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

const writeFileTool = {
  name: 'write_file',
  description: 'Write the complete new contents of a file. Always pass the FULL file content, not a diff.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      path: { type: SchemaType.STRING, description: 'Relative file path to write' },
      content: { type: SchemaType.STRING, description: 'The complete new file content' },
    },
    required: ['path', 'content'],
  },
};

function extractFunctionCalls(response) {
  if (typeof response.functionCalls === 'function') {
    const calls = response.functionCalls();
    if (calls?.length) {
      return calls.map((fc) => ({ name: fc.name, args: fc.args || {} }));
    }
  }

  const parts = response.candidates?.[0]?.content?.parts || [];
  return parts
    .filter((part) => part.functionCall)
    .map((part) => ({
      name: part.functionCall.name,
      args: part.functionCall.args || {},
    }));
}

function extractResponseText(response) {
  try {
    const text = response.text?.();
    if (text?.trim()) return text.trim();
  } catch {
    // no text part — expected when the model only returns tool calls
  }

  const parts = response.candidates?.[0]?.content?.parts || [];
  return parts
    .filter((part) => typeof part.text === 'string' && !part.thought)
    .map((part) => part.text)
    .join('')
    .trim();
}

function parseFileEditsFromText(text) {
  if (!text?.trim()) return [];

  const edits = [];
  const blockRe = /FILE:\s*([^\n\r]+)\s*\r?\n```[^\n]*\r?\n([\s\S]*?)```/gi;
  let match = blockRe.exec(text);
  while (match) {
    edits.push({
      path: match[1].trim().replace(/^\.\//, ''),
      content: match[2].replace(/\s+$/, ''),
    });
    match = blockRe.exec(text);
  }
  return edits;
}

function parseSummaryFromText(text) {
  const match = text.match(/SUMMARY:\s*(.+)/is);
  return match ? match[1].trim() : '';
}

function normalizeWriteCalls(calls) {
  return calls
    .filter((fc) => fc.name === 'write_file')
    .map((fc) => ({
      name: 'write_file',
      args: {
        path: String(fc.args?.path || '').replace(/^\.\//, ''),
        content: String(fc.args?.content ?? ''),
      },
    }))
    .filter((fc) => fc.args.path && fc.args.content);
}

function buildToolModel(employee, modelName, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: GENERATION_CONFIG,
    systemInstruction:
      `You are ${employee.roleTitle}, an AI software engineer working for AgentHire. ` +
      `Project files are provided in the user message. ` +
      `For coding/styling tasks (CSS, HTML, JS changes), you MUST call write_file with the COMPLETE updated file content. ` +
      `Do not reply with only text when a file edit is requested — call write_file first. ` +
      `For greetings with no task, reply briefly without tools.`,
    tools: [{ functionDeclarations: [writeFileTool] }],
  });
}

function buildTextEditModel(employee, modelName, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: GENERATION_CONFIG,
    systemInstruction:
      `You are ${employee.roleTitle}, an AI software engineer working for AgentHire. ` +
      `When a file must change, respond ONLY using this format:\n\n` +
      `FILE: relative/path.ext\n` +
      '```\n' +
      '(complete new file content)\n' +
      '```\n\n' +
      `SUMMARY: one sentence describing the change\n\n` +
      `For greetings or questions with no edits, respond with only:\n` +
      `SUMMARY: your reply`,
  });
}

async function generateWithRetry(employee, contents) {
  const models = getModelChain();
  let lastError;

  for (const modelName of models) {
    for (const apiKey of getAvailableGeminiKeys()) {
      for (let attempt = 0; attempt < MAX_RETRIES_PER_MODEL; attempt++) {
        try {
          const model = buildToolModel(employee, modelName, apiKey);
          const result = await model.generateContent({ contents });
          return { result, modelUsed: modelName, apiKey };
        } catch (err) {
          lastError = err;

          if (isQuotaError(err)) {
            markGeminiKeyExhausted(apiKey);
            console.warn(`agent: key ${maskApiKey(apiKey)} quota exceeded — trying next key…`);
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

async function generateTextEditsFallback(employee, contents, modelName, apiKey) {
  const model = buildTextEditModel(employee, modelName, apiKey);
  const fallbackContents = [
    ...contents,
    {
      role: 'user',
      parts: [{
        text: 'Apply the client task now. Output every changed file using the FILE:/```/SUMMARY: format.',
      }],
    },
  ];
  const result = await model.generateContent({ contents: fallbackContents });
  const text = extractResponseText(result.response);
  return {
    text,
    edits: parseFileEditsFromText(text),
    summary: parseSummaryFromText(text),
  };
}

async function resolveAgentTurn(employee, contents) {
  const { result, modelUsed, apiKey } = await generateWithRetry(employee, contents);
  const response = result.response;

  let functionCalls = normalizeWriteCalls(extractFunctionCalls(response));
  let message = extractResponseText(response);
  let modelParts = response.candidates?.[0]?.content?.parts;

  if (functionCalls.length === 0 && !message) {
    console.warn(`agent: empty tool response from ${modelUsed}, trying text-edit fallback…`);
    const fallback = await generateTextEditsFallback(employee, contents, modelUsed, apiKey);
    if (fallback.edits.length > 0) {
      functionCalls = fallback.edits.map((edit) => ({
        name: 'write_file',
        args: { path: edit.path, content: edit.content },
      }));
      message = fallback.summary;
      modelParts = [{ text: fallback.text }];
    } else {
      message = fallback.summary || fallback.text || '';
      modelParts = [{ text: message }];
    }
  }

  if (!modelParts?.length) {
    modelParts = functionCalls.length > 0
      ? functionCalls.map((fc) => ({ functionCall: { name: fc.name, args: fc.args } }))
      : [{ text: message || '' }];
  }

  return { functionCalls, message, modelParts, modelUsed };
}

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
      const safeFiles = Array.isArray(files) ? files : [];
      const fileBlock = safeFiles
        .map((f) => `--- ${f.path} ---\n${String(f.content).slice(0, MAX_FILE_CHARS)}`)
        .join('\n\n');

      contents = [{
        role: 'user',
        parts: [{
          text:
            `Here are the contents of the project directory:\n\n${fileBlock || '(no files found)'}\n\n` +
            `Task from the client: ${instruction}`,
        }],
      }];
    }

    const { functionCalls, message, modelParts, modelUsed } = await resolveAgentTurn(employee, contents);
    const updatedHistory = [...contents, { role: 'model', parts: modelParts }];

    if (functionCalls.length > 0) {
      return res.json({
        done: false,
        toolCalls: functionCalls,
        history: updatedHistory,
        filesChangedSoFar: changedSoFar,
        modelUsed,
      });
    }

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
