/**
 * Minor talent onboarding (under 18) — parent step, then activation.
 *
 *   npx playwright test tests/e2e/onboarding-minor.spec.js --project=chromium --headed
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
  fillParent,
  acceptConsentsAndActivate,
} from './helpers/onboarding.js';

test.use({
  viewport: { width: 1440, height: 900 },
  launchOptions: { slowMo: 350 },
  video: 'on',
  screenshot: 'on',
  trace: 'retain-on-failure',
  actionTimeout: 45_000,
});

test('minor signs up with parent details and activates', async ({ page }) => {
  test.setTimeout(6 * 60_000);
  watchApi(page);
  const id = uniqueSuffix();

  await fillDob(page, '10-05-2010');
  await fillPersonal(page, {
    firstName: 'Akosua',
    lastName: `Minor${id.slice(-5)}`,
    gender: 'Female',
    ghanaCard: `8${id.slice(-8)}2`,
    password: 'Test@12345!',
  });
  await fillContact(page, { phone: uniquePhone('54'), email: `e2e.minor.${id}@example.com` });
  await fillAddress(page);
  await fillEducation(page, {
    level: 'Senior High School (SHS)',
    grade: 'SHS 3',
    institution: 'Accra Academy',
  });
  await fillParent(page, {
    name: 'Ama Mensah',
    relationship: 'Mother',
    phone: uniquePhone('20'),
    email: `e2e.parent.${id}@example.com`,
  });
  const activated = page.waitForResponse((r) => r.url().includes('/onboarding/activate'), {
    timeout: 120_000,
  });
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
