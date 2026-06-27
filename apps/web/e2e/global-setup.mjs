import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../..',
);

export default async function globalSetup() {
  if (process.env.PLAYWRIGHT_SKIP_SETUP) {
    return;
  }

  execSync('pnpm --filter @mandor-plate/shared build', {
    cwd: repoRoot,
    stdio: 'inherit',
  });
  execSync('pnpm --filter @mandor-plate/api migration:run', {
    cwd: repoRoot,
    stdio: 'inherit',
  });
  execSync('pnpm --filter @mandor-plate/api seed:run', {
    cwd: repoRoot,
    stdio: 'inherit',
  });
}
