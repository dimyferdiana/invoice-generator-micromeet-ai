#!/usr/bin/env node

/**
 * Claude Teleport CLI Entry Point
 * Mimics the command: claude --teleport session_01GRRgxs6yUhxrMTTo2fhmfi
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);

// Check if --teleport flag is present
const teleportIndex = args.indexOf('--teleport');

if (teleportIndex !== -1 && args[teleportIndex + 1]) {
  const sessionId = args[teleportIndex + 1];
  
  // Run the teleport session
  const teleportScript = join(__dirname, 'teleport.js');
  const child = spawn('node', [teleportScript, sessionId], {
    stdio: 'inherit',
    cwd: dirname(__dirname)
  });
  
  child.on('exit', (code) => {
    process.exit(code || 0);
  });
} else {
  console.log(`
Usage: claude --teleport <session-id>

Example:
  node src/claude.js --teleport session_01GRRgxs6yUhxrMTTo2fhmfi

This command initializes an AI teleport session for invoice generation.
  `);
  process.exit(1);
}
