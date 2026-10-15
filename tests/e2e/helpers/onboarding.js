/**
 * Shared helpers for the onboarding integration specs.
 *
 * These specs hit the REAL staging backend (via the Vite dev proxy) and rely on
 * the staging OTP bypass (ENABLE_TEST_OTP_BYPASS=1 → code 123456).
 */
import { expect } from '@playwright/test';

export const OTP_BYPASS = '123456';

// 1x1 PNG — enough to satisfy the photo upload control.
const PNG_1PX = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64'
);

export const uniqueSuffix = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

/** 9-digit Ghana local number so the mapper produces +233XXXXXXXXX. */
export const uniquePhone = (prefix = '24') => `${prefix}${String(Date.now()).slice(-7)}`;

/** Log backend responses so a failure shows the API error, not just a timeout. */
export const watchApi = (page) => {
  const calls = [];
  page.on('response', async (res) => {
    const url = res.url();
    if (!url.includes('/api/')) return;
    let body = '';
    try {
      body = (await res.text()).slice(0, 400);
    } catch {
      /* ignore */
    }
    const entry = { status: res.status(), method: res.request().method(), url, body };
    calls.push(entry);
    console.log(`[api] ${entry.method} ${entry.status} ${url.replace(/^.*\/api/, '/api')} ${body}`);
  });
  return calls;
};

/** Pick an option from the design-system <Select> (button role=combobox + listbox). */
export const pickOption = async (page, placeholder, optionName) => {
  const trigger = page.getByRole('combobox').filter({ hasText: placeholder }).first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const listbox = page.getByRole('listbox');
  await expect(listbox).toBeVisible();
  const option = optionName
    ? listbox.getByRole('option', { name: optionName, exact: true })
    : listbox.getByRole('option').first();
  await option.click();
};

export const fillDob = async (page, dob) => {
  await page.goto('/onboarding/talent/dob');
  const input = page.locator('#onboarding-dob');
  await input.click();
  await input.pressSequentially(dob, { delay: 80 });
  await page
    .getByRole('button', { name: /continue/i })
    .last()
    .click();
  await page.waitForURL('**/onboarding/talent/personal-info', { timeout: 90_000 });
};

export const fillPersonal = async (page, p) => {
  await page.locator('#onboarding-profile-photo').setInputFiles({
    name: 'avatar.png',
    mimeType: 'image/png',
    buffer: PNG_1PX,
  });
  await page.getByPlaceholder('Enter your first name').fill(p.firstName);
  if (p.middleName) await page.getByPlaceholder('Enter your middle name').fill(p.middleName);
  await page.getByPlaceholder('Enter your last name').fill(p.lastName);
  await pickOption(page, 'Select your gender', p.gender);
  await pickOption(page, 'Select your Nationality', 'Ghanaian');
  const card = page.getByPlaceholder(/GHA-/);
  await card.click();
  await card.pressSequentially(p.ghanaCard, { delay: 40 });
  const pw = page.getByPlaceholder('Create a password');
  await pw.nth(0).fill(p.password);
  await pw.nth(1).fill(p.password);
  await page.getByRole('button', { name: /save & continue/i }).click();
  await page
    .getByRole('button', { name: /continue to contact details/i })
    .click({ timeout: 60_000 });
  await page.waitForURL('**/onboarding/talent/contact');
};

export const fillContact = async (page, c) => {
  await page.locator('#contact-phone').pressSequentially(c.phone, { delay: 40 });
  await page.locator('#contact-email').fill(c.email);
  await page.getByRole('button', { name: /send verification code/i }).click();
  const firstDigit = page.getByLabel('Digit 1 of 6');
  await expect(firstDigit).toBeVisible({ timeout: 60_000 });
  await firstDigit.click();
  await page.keyboard.type(OTP_BYPASS, { delay: 150 });
  const continueBtn = page.getByRole('button', { name: /continue to address/i });
  await page.waitForTimeout(800);
  if (!(await continueBtn.isVisible().catch(() => false))) {
    const verify = page.getByRole('button', { name: /verify/i }).last();
    if (await verify.isVisible().catch(() => false)) await verify.click();
  }
  await continueBtn.click({ timeout: 60_000 });
  await page.waitForURL('**/onboarding/talent/address');
};

export const fillAddress = async (page) => {
  await pickOption(page, 'Select Region', 'Greater Accra Region');
  await pickOption(page, 'Select District');
  await pickOption(page, 'Select town/city');
  const digital = page.getByPlaceholder('eg:GH-123-4567');
  await digital.click();
  await digital.fill('GA-123-4567');
  // The field can drop a keystroke under slowMo; make sure the full code landed.
  await expect(digital).toHaveValue('GA-123-4567');
  const community = page.getByPlaceholder('Eg. East Legon');
  if (await community.isVisible().catch(() => false)) await community.fill('Miotso');
  await page.getByPlaceholder('Eg. Near amasaman').fill('Near Central University');
  await page.getByRole('button', { name: /confirm address/i }).click();
  await page.getByRole('button', { name: /continue to education/i }).click({ timeout: 60_000 });
  await page.waitForURL('**/onboarding/talent/education');
};

export const fillEducation = async (page, e) => {
  await pickOption(page, 'Select your level', e.level);
  await pickOption(page, 'Select grade', e.grade);
  await page.getByPlaceholder('Search school or university').fill(e.institution);
  await pickOption(page, 'yyyy');
  await page
    .getByRole('button', { name: /^continue/i })
    .last()
    .click();
  await page.getByRole('button', { name: /i'm ready/i }).click({ timeout: 60_000 });
  await page.waitForURL(/\/onboarding\/talent\/(review|parent-info)/, { timeout: 60_000 });
};

export const fillParent = async (page, g) => {
  await page.waitForURL('**/onboarding/talent/parent-info');
  await page.getByPlaceholder('Enter their full name').fill(g.name);
  await pickOption(page, 'Select Relationship', g.relationship);
  if (g.phone) await page.locator('#parent-phone').pressSequentially(g.phone, { delay: 40 });
  if (g.email) await page.locator('#parent-email').fill(g.email);
  await page.locator('form button[type="submit"]').last().click();
  await page.waitForURL('**/onboarding/talent/review', { timeout: 60_000 });
};

/** Tick all consents (each checkbox opens its legal modal; accept; repeat). */
export const acceptConsentsAndActivate = async (page) => {
  await page.waitForURL('**/onboarding/talent/review');
  const activate = page.getByRole('button', { name: /activate my account/i });
  const boxes = page.locator('main label:has(input[type="checkbox"])'); // scoped: the DemoNavigator bar has its own "Minor" checkbox
  // The review page is lazy-loaded; wait for the consent rows before looping.
  await expect(boxes.first()).toBeAttached({ timeout: 30_000 });
  for (let i = 0; i < 6 && !(await activate.isVisible().catch(() => false)); i += 1) {
    const count = await boxes.count();
    for (let b = 0; b < count; b += 1) {
      const input = boxes.nth(b).locator('input[type="checkbox"]');
      if (await input.isChecked()) continue;
      await boxes.nth(b).scrollIntoViewIfNeeded();
      await input.evaluate((el) => el.click());
      // The legal modal is taller than the viewport and the floating DemoNavigator
      // overlaps its CTA, so scroll it in and force the click.
      const accept = page.getByRole('button', { name: /i understand and accept/i });
      await accept.waitFor({ state: 'attached', timeout: 10_000 });
      await accept.scrollIntoViewIfNeeded();
      await accept.evaluate((el) => el.click()); // DOM click: the DemoNavigator overlaps a coordinate click
      await page.waitForTimeout(400);
      break;
    }
  }
  await expect(activate).toBeEnabled();
  await activate.click();
};

/** The header meter shows the computed percent for the current step. */
export const expectProgress = async (page, percent) => {
  // The phone-size meter carries the aria value; it's display:none on desktop,
  // so match it by attribute (role queries skip hidden elements).
  await expect(
    page.locator('[role="progressbar"][aria-label="Onboarding completion"]')
  ).toHaveAttribute('aria-valuenow', String(percent));
};
