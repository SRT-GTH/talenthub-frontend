import { defineConfig, devices } from '@playwright/test';

// Dedicated e2e port: 5173 is the day-to-day dev port and may be serving a
// different app (reuseExistingServer would then silently test the wrong site).
const PORT = Number(process.env.E2E_PORT ?? 5199);
const BASE_URL = `http://127.0.0.1:${PORT}`;

// Optional: keep the heavy test output off the system drive (screenshots, traces, the HTML report).
// E2E_OUTPUT_DIR holds test-results + playwright-report; E2E_BASELINE_DIR holds the desktop-visual baselines.
const OUT = process.env.E2E_OUTPUT_DIR?.replaceAll('\\', '/');
const BASELINES =
  process.env.E2E_BASELINE_DIR?.replaceAll('\\', '/') || '{testDir}/.visual-baseline';

export default defineConfig({
  testDir: './tests/e2e',
  snapshotPathTemplate: `${BASELINES}/{arg}{ext}`,
  outputDir: OUT ? `${OUT}/test-results` : undefined,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never', outputFolder: OUT ? `${OUT}/playwright-report` : undefined }],
    ['list'],
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Optional: point at an already-installed Chromium instead of the
    // revision bundled with this Playwright version.
    launchOptions: { executablePath: process.env.PW_CHROMIUM_PATH || undefined },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
