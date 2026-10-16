/**
 * Invited parent (flow B) against staging, starting from the parent notice
 * email link (/onboarding/parent-invited?token=<ward token>).
 *
 * Needs ward tokens: run `node C:/Backups/make_wards.js` first. It bulk-imports
 * two minors with parent emails into the e2e test institution and writes
 * their tokens to C:/Backups/parent_wards.json (read from the DB: email does
 * not send from Render yet). Override the path with PARENT_WARDS_FILE.
 *
 *   npx playwright test tests/e2e/parent-invited.spec.js --project=chromium --headed
 */
import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import { watchApi, pickOption, uniquePhone } from './helpers/onboarding.js';

const WARDS_FILE = process.env.PARENT_WARDS_FILE || 'C:/Backups/parent_wards.json';
const wards = fs.existsSync(WARDS_FILE)
  ? JSON.parse(fs.readFileSync(WARDS_FILE, 'utf8')).wards
  : [];

test.use({
  viewport: { width: 1440, height: 900 },
  launchOptions: { slowMo: 250 },
  video: 'on',
  actionTimeout: 45_000,
});
test.describe.configure({ mode: 'serial' });

// The demo navigator bar is fixed over the footer buttons; hide it in tests.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const s = document.createElement('style');
      s.textContent = '[data-demo-navigator]{display:none!important}';
      document.head.appendChild(s);
    });
  });
});

/** Identity → contact → security → link ward → consent. */
async function completeSignUp(page, ward, email) {
  // Identity: the parent name the ward gave is pre-filled.
  await page.waitForURL('**/onboarding/parent-invited-identity');
  const [first, ...rest] = ward.parentName.split(' ');
  await expect(page.getByPlaceholder('e.g. Abena')).toHaveValue(first);
  await expect(page.getByPlaceholder('e.g. Mensah')).toHaveValue(rest.join(' '));
  const main = page.locator('main');
  await main.getByRole('button', { name: 'Father', exact: true }).click();
  await main.getByRole('button', { name: 'Male', exact: true }).click();
  await page.getByPlaceholder('Day').fill('4');
  await pickOption(page, 'Month', 'April');
  await page.getByPlaceholder('Year').fill('1980');
  await main.getByRole('button', { name: /Ghanaian/ }).click();
  await page.locator('form button[type="submit"]').last().click();

  // Ghana Card step only when VITE_PARENT_ID_VERIFICATION=true (it is optional:
  // skip it). Run the spec with the same value the app is built with.
  if (process.env.VITE_PARENT_ID_VERIFICATION === 'true') {
    await page.waitForURL('**/onboarding/parent-invited-verification');
    await expect(
      page.getByLabel('Parent onboarding steps').getByText('Verification').first()
    ).toBeAttached();
    await page.getByText('Continue without verification').click();
  }
  await page.waitForURL('**/onboarding/parent-invited-contact');
  await expect(page.getByText(/your notice was sent to/i)).toBeVisible();
  await page
    .locator('input[type="tel"]')
    .first()
    .pressSequentially(uniquePhone('24'), { delay: 40 });
  await page.getByTestId('parent-email').fill(email);
  await page.locator('form button[type="submit"]').last().click();

  await page.waitForURL('**/onboarding/parent-invited-security');
  await page.getByPlaceholder('Create a password').fill('Parent@1234');
  await page.getByPlaceholder('Repeat your password').fill('Parent@1234');
  await page
    .getByRole('button', { name: /^continue/i })
    .last()
    .click();

  // Link ward: the real ward from the token.
  await page.waitForURL('**/onboarding/parent-invited-link-ward');
  await expect(page.getByTestId('link-ward-name')).toHaveText(ward.wardName);
  await expect(page.getByText('E2E Test College 2749862').first()).toBeVisible();
  await page.getByRole('button', { name: /confirm & continue/i }).click();

  await page.waitForURL('**/onboarding/parent-invited-consent');
  await expect(
    page.getByText(`${ward.wardName}'s account is already active`, { exact: false })
  ).toBeVisible();
  for (const text of [
    'I understand my ward has immediate platform access.',
    'I have read and accept the Parent Rights Policy.',
    'I consent to Ghana Talent Hub processing my data.',
  ]) {
    await page.getByRole('checkbox').filter({ hasText: text }).click();
  }
  const created = page.waitForResponse((r) => r.url().includes('/parent-ward/create-account'), {
    timeout: 90_000,
  });
  await page.getByTestId('activate-parent').click();
  const res = await created;
  const body = await res.json().catch(() => ({}));
  expect(res.status(), JSON.stringify(body).slice(0, 300)).toBeLessThan(300);
  await page.waitForURL('**/onboarding/parent-done');
  await expect(page.getByTestId('done-ward-name')).toHaveText(ward.wardName);
  return body.data || body;
}

test('invited parent with the invited email: account, link, signed in', async ({ page }) => {
  test.skip(wards.length < 2, `run make_wards.js first (${WARDS_FILE})`);
  test.setTimeout(5 * 60_000);
  watchApi(page);
  const ward = wards[0];

  await page.goto(`/onboarding/parent-invited?token=${ward.token}`);
  await expect(page.getByTestId('invite-ward-name')).toHaveText(ward.wardName, { timeout: 90_000 });
  // The token is dropped from the address bar once the invite has loaded.
  await expect(page).toHaveURL(/\/onboarding\/parent-invited$/);
  await expect(page.getByText(`Active — ${ward.wardName}`)).toBeVisible();
  await page.getByTestId('create-parent-account').click();

  const res = await completeSignUp(page, ward, ward.parentEmail);
  expect(res.loginRequired).toBe(false);
  expect(res.session?.accessToken, 'signed in').toBeTruthy();
  const token = await page.evaluate(() => localStorage.getItem('th:auth-token'));
  expect(token, 'token stored').toBeTruthy();
  await expect(page.getByRole('button', { name: /go to parent dashboard/i })).toBeVisible();

  // The new parent sees the ward through the signed-in API.
  const wardsRes = await page.request.get('/api/parent-ward/wards', {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(wardsRes.status()).toBe(200);
  expect(JSON.stringify(await wardsRes.json())).toContain(ward.wardName.split(' ')[0]);
});

test('parent opts out with the link, no account', async ({ page }) => {
  test.skip(wards.length < 2, `run make_wards.js first (${WARDS_FILE})`);
  test.setTimeout(3 * 60_000);
  watchApi(page);
  const ward = wards[1];

  await page.goto(`/onboarding/parent-invited?token=${ward.token}`);
  await expect(page.getByTestId('invite-ward-name')).toHaveText(ward.wardName, { timeout: 90_000 });
  await page.getByTestId('open-opt-out').click();
  await page
    .getByRole('dialog')
    .getByRole('textbox')
    .first()
    .fill('I do not want my child on the platform yet.');
  const optOut = page.waitForResponse((r) => r.url().includes('/parent-ward/opt-out-with-token'));
  await page.getByTestId('confirm-opt-out').click();
  const res = await optOut;
  expect(res.status(), await res.text()).toBeLessThan(300);
  await expect(page.getByTestId('opt-out-done')).toBeVisible();
  await page.getByRole('button', { name: 'Close', exact: true }).first().click();

  // Welcome now shows the paused state and the opt-out button is disabled.
  await expect(page.getByTestId('invite-opted-out')).toBeVisible();
  await expect(page.getByTestId('open-opt-out')).toBeDisabled();

  // Reloading from the email link reads the paused status from the backend.
  await page.goto(`/onboarding/parent-invited?token=${ward.token}`);
  await expect(page.getByTestId('invite-opted-out')).toBeVisible({ timeout: 60_000 });
});

test('invited parent with a different email: account, then log in', async ({ page }) => {
  test.skip(wards.length < 2, `run make_wards.js first (${WARDS_FILE})`);
  test.setTimeout(5 * 60_000);
  watchApi(page);
  const ward = wards[1];
  const other = ward.parentEmail.replace('e2e.parent.', 'e2e.parent.other.');

  await page.goto(`/onboarding/parent-invited?token=${ward.token}`);
  await expect(page.getByTestId('invite-ward-name')).toHaveText(ward.wardName, { timeout: 90_000 });
  await page.getByTestId('create-parent-account').click();

  const res = await completeSignUp(page, ward, other);
  expect(res.loginRequired).toBe(true);
  expect(res.session ?? null).toBe(null);
  await expect(page.getByTestId('done-login-note')).toContainText(other);
  await page.getByRole('button', { name: /log in to your account/i }).click();
  await page.waitForURL('**/login');
});

test('a bad link shows an error and no actions', async ({ page }) => {
  await page.goto('/onboarding/parent-invited?token=' + 'f'.repeat(64));
  await expect(page.getByTestId('api-error')).toHaveText(/this link is not valid/i, {
    timeout: 90_000,
  });
  await expect(page.getByTestId('create-parent-account')).toBeDisabled();
  await expect(page.getByTestId('open-opt-out')).toBeDisabled();
});
