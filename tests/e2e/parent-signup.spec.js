/**
 * Self-serve parent sign-up (flow A) and parent log-in, against staging.
 * Creates a throwaway e2e.parent.<timestamp>@example.com account. Staging accepts the
 * code 123456 while the backend's test bypass is on (contact code and log-in code).
 *
 *   npx playwright test tests/e2e/parent-signup.spec.js --workers=1
 */
import { test, expect } from '@playwright/test';
import { watchApi, uniquePhone } from './helpers/onboarding.js';

test.use({ viewport: { width: 1440, height: 900 }, actionTimeout: 45_000 });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const s = document.createElement('style');
      s.textContent = '[data-demo-navigator]{display:none!important}';
      document.head.appendChild(s);
    });
  });
});

const pick = async (page, label, option) => {
  await page.getByText(label).first().click();
  await page.getByRole('option', { name: option, exact: true }).first().click();
};

test('self-serve parent: sign up, wrong code, account created, log in', async ({ page }) => {
  test.setTimeout(5 * 60_000);
  watchApi(page);
  const email = `e2e.parent.${Date.now()}@example.com`;
  const password = 'Test@12345!';

  await page.goto('/onboarding/parent-welcome');
  await page.getByRole('button', { name: /create my parent account/i }).click();

  // Identity (kept in the sign-up draft, sent with the account).
  await page.waitForURL('**/onboarding/parent-identity');
  await page.getByPlaceholder('Enter your first name').fill('Esi');
  await page.getByPlaceholder('Enter your last name').fill('Probe');
  await pick(page, 'Select your relationship', 'Mother');
  await pick(page, 'Select your Gender', 'Female');
  await pick(page, 'Select your Nationality', 'Ghanaian');
  await page.getByPlaceholder('DD-MM-YYYY').fill('04-04-1980');
  await page.locator('button[type="submit"]').last().click();
  await page
    .getByRole('dialog')
    .getByRole('button')
    .filter({ hasText: /continue|verification/i })
    .last()
    .click();

  await page.waitForURL('**/onboarding/parent-verification');
  await page.getByText(/continue without verification/i).click();

  // Contact: a real code (POST /auth/contact-verification/send + verify).
  await page.waitForURL('**/onboarding/parent-contact');
  await page.locator('input[type="tel"]').first().fill(uniquePhone('24'));
  await page.getByPlaceholder('you@example.com').fill(email);
  const sent = page.waitForResponse((r) => r.url().includes('/auth/contact-verification/send'));
  await page.getByRole('button', { name: /send verification code/i }).click();
  expect((await sent).status()).toBeLessThan(300);
  const dialog = page.getByRole('dialog');
  await dialog.locator('input').first().focus();
  await page.keyboard.type('000000');
  const wrong = page.waitForResponse((r) => r.url().includes('/contact-verification/verify'));
  await dialog.getByRole('button', { name: /verify & continue/i }).click();
  expect((await wrong).status()).toBe(400);
  await expect(dialog.getByText('4 attempts remaining')).toBeVisible();
  for (let i = 0; i < 6; i++) await page.keyboard.press('Backspace');
  await dialog.locator('input').first().focus();
  await page.keyboard.type('123456');
  await dialog.getByRole('button', { name: /verify & continue/i }).click();
  await dialog
    .getByRole('button')
    .filter({ hasText: /continue/i })
    .last()
    .click();

  await page.waitForURL('**/onboarding/parent-security');
  await page.locator('input[type="password"]').nth(0).fill(password);
  await page.locator('input[type="password"]').nth(1).fill(password);
  await page.locator('button[type="submit"]').last().click();
  await page
    .getByRole('dialog')
    .getByRole('button')
    .filter({ hasText: /link ward/i })
    .last()
    .click();

  await page.waitForURL('**/onboarding/parent-link-ward');
  await page.getByRole('button', { name: /confirm & continue/i }).click();

  // Review shows the parent's own answers, then creates the account.
  await page.waitForURL('**/onboarding/parent-review');
  // Desktop shows the field grid (the definition rows are the phone layout).
  await expect(page.getByText('Esi', { exact: true }).last()).toBeVisible();
  await expect(page.getByText(email).last()).toBeVisible();
  for (const t of ['I understand my ward', 'I have read and accept', 'I consent to Ghana']) {
    await page.getByText(t).first().click();
  }
  const registered = page.waitForResponse((r) => r.url().includes('/auth/register'), {
    timeout: 90_000,
  });
  await page.getByRole('button', { name: /accept all three/i }).click();
  const reg = await registered;
  expect(reg.status(), (await reg.text()).slice(0, 300)).toBeLessThan(300);
  await page.waitForURL('**/onboarding/parent-done');
  await expect(page.getByTestId('done-login-note')).toContainText(email);

  // Log in: wrong password shows the error, then the emailed code signs in.
  await page.getByRole('button', { name: /log in to your account/i }).click();
  await page.waitForURL('**/onboarding/parent-login?email=*');
  await page.getByPlaceholder('Enter Your Password').fill('not-the-password');
  await page.getByRole('button', { name: /enter your details/i }).click();
  await expect(page.getByText(/incorrect email, phone number or password/i)).toBeVisible({
    timeout: 60_000,
  });
  await page.getByPlaceholder('Enter Your Password').fill(password);
  await page.getByRole('button', { name: /enter your details/i }).click();
  await page.getByLabel('Digit 1 of 6').focus();
  await page.keyboard.type('123456');
  await page.waitForURL(/\/parent(\?|$)/, { timeout: 60_000 });
  const token = await page.evaluate(() => localStorage.getItem('th:auth-token'));
  expect(token, 'signed in').toBeTruthy();
});
