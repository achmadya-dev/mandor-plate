import { defineConfig, devices } from '@playwright/test';

const repoRoot = '../..';

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.mjs',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 60_000,
  use: {
    ...devices['Desktop Chrome'],
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : [
        {
          command: 'pnpm --filter @mandor-plate/api start:prod',
          url: 'http://127.0.0.1:3001/docs',
          cwd: repoRoot,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
        {
          command: 'pnpm --filter @mandor-plate/web start',
          url: 'http://127.0.0.1:3000/auth/sign-in',
          cwd: repoRoot,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      ],
});
