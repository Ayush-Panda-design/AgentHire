#!/usr/bin/env node
/**
 * agenthire CLI
 *
 * Usage:
 *   agenthire connect --token <cliToken>
 *
 * Run from inside the project folder you want the AI agent to work on.
 * Calls the AgentHire server, authenticates via the single-use CLI token
 * minted after a Razorpay payment, then drops into a readline REPL.
 * Each instruction is sent to the server's Gemini-powered agent endpoint;
 * write_file tool calls are applied to the real local filesystem.
 */

import { program } from 'commander';
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { createPatch } from 'diff';

// ---------------------------------------------------------------------------
// Config — points at the local dev server by default; override with env var.
// ---------------------------------------------------------------------------
const API_BASE = process.env.AGENTHIRE_API_URL || 'http://localhost:5000/api';

// ---------------------------------------------------------------------------
// Safety denylist — the CLI NEVER writes to these, no matter what the agent
// says. A simple hardcoded check is the right scope for a demo build.
// ---------------------------------------------------------------------------
const DENY_WRITE_PATTERNS = [
  /^\.env$/,
  /^\.env\./,
  /\.env$/,
  /^\.git\//,
  /\/\.git\//,
  /^node_modules\//,
  /\/node_modules\//,
];

function isDenied(filePath) {
  const normalised = filePath.replace(/\\/g, '/').replace(/^\.\//, '');
  return DENY_WRITE_PATTERNS.some((re) => re.test(normalised));
}

// ---------------------------------------------------------------------------
// File collection — reads every top-level file in cwd that isn't denied or
// huge, and sends their contents to the server with each instruction so the
// model has full project context.
// ---------------------------------------------------------------------------
const MAX_FILE_BYTES = 50_000; // 50 KB per file — keep payloads sane for demo
const MAX_FILES = 30;

function collectFiles(dir) {
  const results = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    if (results.length >= MAX_FILES) break;
    if (entry.name.startsWith('.')) continue;
    if (entry.name === 'node_modules') continue;

    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      // One level of recursion for src/ subdirectories
      const sub = collectFiles(fullPath);
      results.push(...sub.slice(0, MAX_FILES - results.length));
    } else if (entry.isFile()) {
      if (isDenied(relPath)) continue;
      try {
        const stat = fs.statSync(fullPath);
        if (stat.size > MAX_FILE_BYTES) continue;
        const content = fs.readFileSync(fullPath, 'utf-8');
        results.push({ path: relPath, content });
      } catch {
        // skip unreadable files silently
      }
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Approval gate — fires before writing a "sensitive-looking" file (Phase 5b).
// Controlled with a readline prompt; returns true if the user approves.
// ---------------------------------------------------------------------------
const SENSITIVE_PATTERNS = [/config/i, /auth/i, /payment/i, /secret/i, /key/i, /token/i];

function looksRisky(filePath) {
  return SENSITIVE_PATTERNS.some((re) => re.test(filePath));
}

async function promptApproval(rl, filePath) {
  console.log('\n' + '─'.repeat(60));
  console.log('  ⚠  APPROVAL REQUIRED');
  console.log('─'.repeat(60));
  console.log(`  File   : ${filePath}`);
  console.log('  Risk   : HIGH — file matches a sensitive pattern (auth/config/payment/keys)');
  console.log('  The agent wants to write to this file.');
  console.log('─'.repeat(60));
  return new Promise((resolve) => {
    rl.question('  Approve? [y/N] ', (answer) => {
      resolve(answer.trim().toLowerCase() === 'y');
    });
  });
}

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------
async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

// ---------------------------------------------------------------------------
// Main agent loop
// ---------------------------------------------------------------------------
async function runAgentLoop(instruction, sessionToken, rl) {
  const cwd = process.cwd();
  const files = collectFiles(cwd);

  if (files.length === 0) {
    console.log('  (No files found in current directory — the agent will work blind.)');
  } else {
    console.log(`  Reading ${files.length} file(s) from ${cwd} …`);
  }

  let history = null;
  let toolResults = null;
  let filesChangedSoFar = [];
  let rounds = 0;
  const MAX_ROUNDS = 3;

  while (rounds < MAX_ROUNDS) {
    rounds++;

    const payload = {
      instruction,
      ...(history ? { history, toolResults, filesChangedSoFar } : { files }),
    };

    console.log(`  Thinking${rounds > 1 ? ` (round ${rounds})` : ''}…`);
    const { ok, body } = await apiFetch('/agent/run', {
      method: 'POST',
      headers: { Authorization: `Bearer ${sessionToken}` },
      body: JSON.stringify(payload),
    });

    if (!ok) {
      console.error(`\n  ✗ Agent error: ${body.error || 'Unknown error'}`);
      if (body.detail) console.error(`    ${body.detail}`);
      return;
    }

    if (body.done) {
      // Final summary from the model
      console.log('\n' + '─'.repeat(60));
      console.log('  ✓ Agent response:');
      console.log('─'.repeat(60));
      console.log(body.message.trim().split('\n').map((l) => `  ${l}`).join('\n'));
      if (body.filesChangedSoFar?.length) {
        console.log('\n  Files written: ' + body.filesChangedSoFar.join(', '));
      }
      console.log('─'.repeat(60) + '\n');
      return;
    }

    // The model wants to call one or more tools
    const calls = body.toolCalls || [];
    history = body.history;
    filesChangedSoFar = body.filesChangedSoFar || [];
    toolResults = [];

    for (const call of calls) {
      const { name, args } = call;

      if (name === 'write_file') {
        const relPath = (args.path || '').replace(/\\/g, '/').replace(/^\.\//, '');
        const content = args.content || '';

        if (isDenied(relPath)) {
          console.log(`  ✗ Blocked write to denied path: ${relPath}`);
          toolResults.push({ name, args, result: `DENIED: ${relPath} is on the write denylist` });
          continue;
        }

        if (looksRisky(relPath)) {
          const approved = await promptApproval(rl, relPath);
          if (!approved) {
            console.log(`  ✗ Write to ${relPath} rejected by user.`);
            toolResults.push({ name, args, result: `REJECTED: User declined to write ${relPath}` });
            continue;
          }
        }

        const absPath = path.join(cwd, relPath);
        const dir = path.dirname(absPath);

        // Print a before/after diff when rewriting an existing file
        let before = null;
        try {
          before = fs.readFileSync(absPath, 'utf-8');
        } catch {
          // new file — no before
        }

        try {
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(absPath, content, 'utf-8');
          console.log(`  ✓ Written: ${relPath}`);

          if (before !== null) {
            const patch = createPatch(relPath, before, content, 'before', 'after');
            const lines = patch.split('\n').slice(4); // skip patch header
            const diffLines = lines.filter((l) => l.startsWith('+') || l.startsWith('-') || l.startsWith('@'));
            if (diffLines.length > 0 && diffLines.length <= 60) {
              console.log('\n  Diff:');
              for (const line of diffLines) {
                const colour = line.startsWith('+') ? '\x1b[32m' : line.startsWith('-') ? '\x1b[31m' : '\x1b[36m';
                console.log(`  ${colour}${line}\x1b[0m`);
              }
              console.log();
            }
          }

          if (!filesChangedSoFar.includes(relPath)) filesChangedSoFar.push(relPath);
          toolResults.push({ name, args, result: 'ok' });
        } catch (err) {
          console.error(`  ✗ Failed to write ${relPath}: ${err.message}`);
          toolResults.push({ name, args, result: `ERROR: ${err.message}` });
        }

      } else if (name === 'list_files') {
        const list = files.map((f) => f.path).join('\n');
        toolResults.push({ name, args, result: list || '(empty)' });

      } else if (name === 'read_file') {
        const relPath = (args.path || '').replace(/\\/g, '/');
        const f = files.find((x) => x.path === relPath);
        toolResults.push({ name, args, result: f ? f.content : `File not found: ${relPath}` });

      } else {
        toolResults.push({ name, args, result: `Unknown tool: ${name}` });
      }
    }
  }

  console.log('\n  (Reached max agent rounds — loop stopped. The agent may need a more specific instruction.)');
}

// ---------------------------------------------------------------------------
// Commander CLI definition
// ---------------------------------------------------------------------------
program
  .name('agenthire')
  .description('AgentHire CLI — connect a local project to a hired AI employee')
  .version('1.0.0');

program
  .command('connect')
  .description('Activate a hired AI employee and start an interactive REPL in the current folder')
  .requiredOption('--token <cliToken>', 'Single-use CLI token from the AgentHire payment success page')
  .action(async (opts) => {
    console.log('\n  AgentHire CLI  •  Connecting…\n');

    // Step 1: Activate the CLI token → get a short-lived session JWT
    const { ok, body } = await apiFetch('/hires/activate', {
      method: 'POST',
      body: JSON.stringify({ cliToken: opts.token }),
    });

    if (!ok) {
      console.error(`  ✗ Activation failed: ${body.error || 'Unknown error'}`);
      console.error('  Make sure your token is valid, unused, and that the server is running.\n');
      process.exit(1);
    }

    const sessionToken = body.token;
    const { employee, hireId } = body;

    console.log(`  ✓ Connected to: ${employee.name} (${employee.roleTitle})`);
    console.log(`  Hire ID       : ${hireId}`);
    console.log(`  Working dir   : ${process.cwd()}`);
    console.log('\n  Type an instruction and press Enter. Type "exit" to quit.\n');

    // Step 2: Drop into a simple readline REPL
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    const ask = () => {
      rl.question(`  [${employee.name}] > `, async (raw) => {
        const instruction = raw.trim();
        if (!instruction) {
          ask();
          return;
        }
        if (instruction.toLowerCase() === 'exit' || instruction.toLowerCase() === 'quit') {
          console.log('\n  Disconnected. Goodbye!\n');
          rl.close();
          process.exit(0);
        }

        try {
          await runAgentLoop(instruction, sessionToken, rl);
        } catch (err) {
          console.error(`\n  ✗ Unexpected error: ${err.message}\n`);
        }
        ask();
      });
    };

    ask();
  });

program.parseAsync(process.argv).catch((err) => {
  console.error('CLI error:', err.message);
  process.exit(1);
});
