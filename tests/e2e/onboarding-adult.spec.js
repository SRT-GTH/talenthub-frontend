/**
 * Adult talent onboarding — full integration run against staging.
 *
 * Run headed so the flow can be watched:
 *   npx playwright test tests/e2e/onboarding-adult.spec.js --project=chromium --headed
 */
import { test, expect } from '@playwright/test';
import {
  watchApi,
  uniqueSuffix,
  uniquePhone,
  fillDob,
  fillPersonal,
  fillContact,
  fillAddress,
  fillEducation,
  acceptConsentsAndActivate,
  expectProgress,
} from './helpers/onboarding.js';

test.use({
  viewport: { width: 1440, height: 900 },
  launchOptions: { slowMo: 350 },
  video: 'on',
  screenshot: 'on',
  trace: 'retain-on-failure',
  actionTimeout: 45_000,
});

test('adult signs up end-to-end and activates', async ({ page }) => {
  test.setTimeout(6 * 60_000);
  watchApi(page);
  const id = uniqueSuffix();

  await fillDob(page, '10-05-2004');
  await expectProgress(page, 29);
  await fillPersonal(page, {
    firstName: 'Kwame',
    middleName: 'E2E',
    lastName: `Adult${id.slice(-5)}`,
    gender: 'Male',
    ghanaCard: `7${id.slice(-8)}1`,
    password: 'Test@12345!',
  });
  await expectProgress(page, 43);
  await fillContact(page, { phone: uniquePhone('24'), email: `e2e.adult.${id}@example.com` });
  await expectProgress(page, 57);
  await fillAddress(page);
  await expectProgress(page, 71);
  await fillEducation(page, {
    level: 'University (Degree)',
    grade: 'Year 3',
    institution: 'Central University',
  });
  // Review shows the captured data from the backend summary (not mock data).
  await page.waitForURL('**/onboarding/talent/review');
  await expect(page.getByText('Central University').first()).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText('Kwame').first()).toBeVisible();
  const activated = page.waitForResponse((r) => r.url().includes('/onboarding/activate'), {
    timeout: 120_000,
  });
  await expectProgress(page, 86);
  await acceptConsentsAndActivate(page);
  const res = await activated;
  expect(res.status(), await res.text()).toBeLessThan(300);
  await page
    .getByRole('button', { name: /continue/i })
    .last()
    .click({ timeout: 30_000 });
  await page.waitForURL('**/login');
  await page.waitForTimeout(1500);
});
