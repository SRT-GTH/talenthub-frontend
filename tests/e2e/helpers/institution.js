/**
 * Shared steps for the institution onboarding specs.
 */
import { expect } from '@playwright/test';
import { pickOption, uniqueSuffix, uniquePhone, OTP_BYPASS } from './onboarding.js';

/**
 * Registers a new institution on staging: details, contact, emailed code
 * (staging bypass 123456), agreements, activation. Ends logged in as the new
 * institution admin on the template guide.
 */
export async function registerInstitution(page) {
  const id = uniqueSuffix().slice(-7);
  const legalName = `E2E Test College ${id}`;
  const email = `e2e.institution.${id}@example.com`;

  // 1. Institution
  await page.goto('/onboarding/institution/your-institution');
  await page.getByPlaceholder('e.g. Accra Technical College').fill(legalName);
  await page.getByPlaceholder('e.g. ATC (if different)').fill(`ETC ${id}`);
  await pickOption(page, 'Select institution type', 'University');
  await pickOption(page, 'Select region');
  await pickOption(page, 'Select district');
  await page.getByRole('button', { name: /save & continue/i }).click();
  await page.getByRole('button', { name: /continue to contact details/i }).click();
  await page.waitForURL('**/onboarding/institution/contact');

  // 2. Contact + emailed code
  await page.getByPlaceholder('e.g. Kwame Mensah').fill('Kwame Registrar');
  await page.getByPlaceholder('e.g. Registrar').fill('Registrar');
  await page
    .locator('input[type="tel"]')
    .first()
    .pressSequentially(uniquePhone('24'), { delay: 40 });
  await page.getByPlaceholder('e.g. kwame@atc.edu.gh').fill(email);
  await page.getByPlaceholder('Min. 8 characters').fill('Inst@12345!');
  await page.getByPlaceholder('Re-enter password').fill('Inst@12345!');
  await page.locator('form button[type="submit"]').last().click();

  const firstDigit = page.getByLabel('Digit 1 of 6');
  await expect(firstDigit).toBeVisible({ timeout: 90_000 });
  await firstDigit.click();
  await page.keyboard.type(OTP_BYPASS, { delay: 120 });
  await page.getByRole('button', { name: /verify email/i }).click();
  await page
    .getByRole('button', { name: /continue to activate account/i })
    .click({ timeout: 60_000 });
  await page.waitForURL('**/onboarding/institution/activate');

  // 3. Review shows the captured details; accept the agreements; activate
  await expect(page.getByText(legalName).first()).toBeVisible();
  await expect(page.getByText(email).first()).toBeVisible();
  const boxes = page.locator('main input[type="checkbox"]');
  await expect(boxes.first()).toBeAttached();
  const count = await boxes.count();
  for (let i = 0; i < count; i += 1) {
    const box = boxes.nth(i);
    if (!(await box.isChecked())) await box.evaluate((el) => el.click());
  }

  const registered = page.waitForResponse(
    (r) => r.url().includes('/auth/register-organization-with-contact'),
    { timeout: 120_000 }
  );
  await page.getByRole('button', { name: /activate institution account/i }).click();
  const res = await registered;
  const body = await res.json().catch(() => ({}));
  expect(res.status(), JSON.stringify(body).slice(0, 300)).toBeLessThan(300);
  expect(body.session?.accessToken, 'login session returned').toBeTruthy();

  await page.getByRole('button', { name: /i'm ready/i }).click({ timeout: 30_000 });
  await page.waitForURL('**/onboarding/institution/template-guide');
  const token = await page.evaluate(() => localStorage.getItem('th:auth-token'));
  expect(token, 'admin logged in').toBeTruthy();
  const org = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem('th:institution-org') || 'null')
  );
  expect(org?.id, 'organization stored for bulk upload').toBeTruthy();
  return { id, legalName, email, org };
}

/** Reads a Playwright download as text. */
export async function downloadText(download) {
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks)
    .toString('utf8')
    .replace(/^\uFEFF/, '');
}
