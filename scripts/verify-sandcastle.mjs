#!/usr/bin/env node
import { existsSync } from 'node:fs';

const required = [
  '.sandcastle/prompt.md',
  '.sandcastle/.env.example',
  '.sandcastle/main.mts',
  '.sandcastle/Dockerfile',
];

for (const file of required) {
  if (!existsSync(file)) {
    console.error(`Missing ${file}`);
    process.exit(1);
  }
}

console.log('Sandcastle is configured (Docker provider).');
console.log('Copy .sandcastle/.env.example → .sandcastle/.env before running agents.');
console.log('Run agents with: pnpm sandcastle:run');
