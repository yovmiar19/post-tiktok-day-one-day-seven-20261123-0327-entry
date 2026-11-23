// Day one, day seven — the hand-in program for the post-tiktok bounty.
// This program does exactly one thing: it copies VIDEO.json from the
// repository root into the output directory, where the gate reads it to
// find the TikTok video. The video itself is the entry — the house reads
// its views and interactions from TikTok, not from anything this program
// writes.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });

const source = join(botDir, 'VIDEO.json');
const target = join(outputDir, 'VIDEO.json');

// Read it first so a malformed VIDEO.json fails here with a clear error
// instead of handing the gate a broken file.
try {
  const parsed = JSON.parse(readFileSync(source, 'utf8')) as unknown;
  if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { url?: unknown }).url !== 'string') {
    throw new Error('VIDEO.json must be an object with a string "url" field');
  }
  copyFileSync(source, target);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Could not copy VIDEO.json from ${botDir}: ${message}`);
  process.exit(1);
}
