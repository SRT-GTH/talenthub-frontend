import { defineConfig, devices } from '@playwright/test';

// Dedicated e2e port: 5173 is the day-to-day dev port and may be serving a
// different app (reuseExistingServer would then silently test the wrong site).
const PORT = Number(process.env.E2E_PORT ?? 5199);
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  snapshotPathTemplate: '{testDir}/.visual-baseline/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // The suites draw the Figma sample screens signed out. Since ADR-15 a signed-out visitor of a protected page is sent
    // to /login, except in demo modes; this dev-only flag (src/utils/sampleMode.js) keeps the suites on the sample pages.
    storageState: {
      cookies: [],
      origins: [{ origin: BASE_URL, localStorage: [{ name: 'gth:demo', value: '1' }] }],
    },
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
