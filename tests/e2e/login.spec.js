/**
 * Login against staging: phone and email, then the emailed code
 * (staging bypass 123456). Needs an active account; defaults to the one the
 * adult onboarding spec created. Override with E2E_LOGIN_EMAIL /
 * E2E_LOGIN_PHONE (9 digits) / E2E_LOGIN_PASSWORD.
 *
 *   npx playwright test tests/e2e/login.spec.js --project=chromium --headed
 */
import { test, expect } from '@playwright/test';
import { watchApi, OTP_BYPASS } from './helpers/onboarding.js';

const ACCOUNT = {
  email: process.env.E2E_LOGIN_EMAIL || 'e2e.adult.1792062380018971@example.com',
  phone: process.env.E2E_LOGIN_PHONE || '242420519',
  password: process.env.E2E_LOGIN_PASSWORD || 'Test@12345!',
};

test.use({
  viewport: { width: 1440, height: 900 },
  launchOptions: { slowMo: 300 },
  video: 'on',
  actionTimeout: 45_000,
});

const enterCodeAndLand = async (page) => {
  const first = page.getByLabel('Digit 1 of 6');
  await expect(first).toBeVisible({ timeout: 90_000 });
  await first.click();
  await page.keyboard.type(OTP_BYPASS, { delay: 120 });
  await page.waitForURL('**/profile/engagement', { timeout: 60_000 });
  const token = await page.evaluate(() => localStorage.getItem('th:auth-token'));
  expect(token, 'access token stored').toBeTruthy();
};

test('logs in with a phone number', async ({ page }) => {
  test.setTimeout(4 * 60_000);
  watchApi(page);
  await page.goto('/login');
  const phoneTab = page.getByRole('tab', { name: 'Phone Number' });
  if (await phoneTab.isVisible().catch(() => false)) await phoneTab.click();
  await page.locator('#login-phone').pressSequentially(ACCOUNT.phone, { delay: 40 });
  await page.locator('#login-password').fill(ACCOUNT.password);
  await page.getByRole('button', { name: /^continue/i }).click();
  await enterCodeAndLand(page);
});

test('logs in with an email', async ({ page }) => {
  test.setTimeout(4 * 60_000);
  watchApi(page);
  await page.goto('/login');
  await page.getByRole('tab', { name: 'Email' }).click();
  await page.locator('#login-email').fill(ACCOUNT.email);
  await page.locator('#login-password').fill(ACCOUNT.password);
  await page.getByRole('button', { name: /^continue/i }).click();
  await enterCodeAndLand(page);
});

test('wrong password shows the error toast', async ({ page }) => {
  test.setTimeout(3 * 60_000);
  await page.goto('/login');
  await page.getByRole('tab', { name: 'Email' }).click();
  await page.locator('#login-email').fill(ACCOUNT.email);
  await page.locator('#login-password').fill('not-the-password');
  await page.getByRole('button', { name: /^continue/i }).click();
  // The toast renders twice (phone-size inline + desktop panel); assert the visible one.
  await expect(
    page.locator('[role="alert"]:visible').filter({ hasText: 'Incorrect Email Or Password' })
  ).toBeVisible({ timeout: 90_000 });
});
