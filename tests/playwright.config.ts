import { defineConfig, devices } from '@playwright/test'

const BUILDER_PORT = process.env.BUILDER_PORT || '5173'
const DASHBOARD_PORT = process.env.DASHBOARD_PORT || '5175'
const EXECUTOR_PORT = process.env.EXECUTOR_PORT || '5174'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL || `http://localhost:${BUILDER_PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Firefox disabled - install with: cd tests && npx playwright install firefox
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: process.env.CI
    ? undefined
    : [
        {
          name: 'builder',
          command: 'pnpm --filter @task-process/builder dev',
          url: `http://localhost:${BUILDER_PORT}`,
          reuseExistingServer: true,
          cwd: '..',
        },
        {
          name: 'dashboard',
          command: 'pnpm --filter @task-process/dashboard dev',
          url: `http://localhost:${DASHBOARD_PORT}`,
          reuseExistingServer: true,
          cwd: '..',
        },
        {
          name: 'executor',
          command: 'pnpm --filter @task-process/executor dev',
          url: `http://localhost:${EXECUTOR_PORT}`,
          reuseExistingServer: true,
          cwd: '..',
        },
      ],
})
