import { test, expect as baseExpect } from '@playwright/test';

// The dev server is shared and the first load of a lazy route is slow: give every check room.
const expect = baseExpect.configure({ timeout: 30_000 });
test.beforeEach(() => test.slow());

/*
 * Recruiter onboarding (Figma file OHG2xsfCCskT8xEn356njv, canvas "Recruiter - Onboarding Screens" 7356:96249, R00–R09): every Figma state opens by URL
 * (`?state=` seeds, see utils/frameSeed.js and wiki/onboarding-redesign.md) with mock data and no route guards.
 */
const BASE = '/onboarding/recruiter';

test('R00: the recruiter role selected, and its loader', async ({ page }) => {
  await page.goto('/get-started?role=recruiter');
  await expect(page.getByRole('button', { name: /Continue As A Recruiter/ })).toBeEnabled();
  await page.goto('/get-started?role=recruiter&state=loading');
  await expect(page.getByRole('button', { name: /Setting things up/i })).toBeVisible();
});

test('R01 / R02: profile states and the verification modals', async ({ page }) => {
  await page.goto(`${BASE}/profile?state=filled`);
  await expect(page.getByLabel('Full Name')).toHaveValue('Kwame Asante');
  await expect(page.getByRole('button', { name: /Continue/ })).toBeEnabled();
  await page.goto(`${BASE}/profile?state=error`);
  await expect(page.getByText(/already registered/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /Continue/ })).toBeDisabled();
  await page.goto(`${BASE}/profile?state=otp-wrong`);
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText('3 attempts remaining')).toBeVisible();
  await page.goto(`${BASE}/profile?state=verified`);
  await expect(page.getByRole('button', { name: /Continue To Organisation/ })).toBeVisible();
});

test('R03: dedicated and freelance selected', async ({ page }) => {
  await page.goto(`${BASE}/type?state=freelance`);
  await expect(page.getByRole('button', { name: /Continue As Freelance/i })).toBeVisible();
  await page.goto(`${BASE}/type?state=dedicated`);
  await expect(page.getByRole('button', { name: /Continue As Dedicated Recruiter/ })).toBeVisible();
});

test('R04: search results, fuzzy match, not found, selected and request sent (mock directory)', async ({
  page,
}) => {
  await page.goto(`${BASE}/organisation?state=results`);
  await expect(page.getByText('MTN Ghana Foundation')).toBeVisible();
  await page.goto(`${BASE}/organisation?state=fuzzy`);
  await expect(page.getByText(/Did you mean Silver Rock Technologies/)).toBeVisible();
  await page.goto(`${BASE}/organisation?state=notfound`);
  await expect(page.getByText('No organisation called “Kente Labs Ghana” yet')).toBeVisible();
  await page.goto(`${BASE}/organisation?state=selected`);
  await expect(page.getByText('Ama Owusu').first()).toBeVisible();
  await page.goto(`${BASE}/organisation?state=sent`);
  await expect(page.getByRole('dialog').getByText('Request sent.')).toBeVisible();
});

test('R04b: create organisation default, filled, error and created', async ({ page }) => {
  await page.goto(`${BASE}/organisation/create?state=filled`);
  await expect(page.getByLabel('Organisation Legal Name')).toHaveValue('Kente Labs Ghana Limited');
  await page.goto(`${BASE}/organisation/create?state=error`);
  await expect(page.getByText('Please select an industry')).toBeVisible();
  await page.goto(`${BASE}/organisation/create?state=created`);
  await expect(page.getByRole('dialog').getByText('Organisation created.')).toBeVisible();
});

test('R05–R09: plan, payment, preferences, review and done states', async ({ page }) => {
  await page.goto(`${BASE}/plan?state=enterprise`);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.goto(`${BASE}/payment?state=declined`);
  await expect(
    page.getByText('Your bank declined this card. Try another card or pay with Mobile Money.')
  ).toBeVisible();
  await page.goto(`${BASE}/payment?state=momo-awaiting`);
  await expect(page.getByText('Approve on your phone.')).toBeVisible();
  await page.goto(`${BASE}/payment?state=success`);
  await expect(page.getByText('Payment successful.')).toBeVisible();
  await page.goto(`${BASE}/preferences?state=error`);
  await expect(page.getByText('Choose at least one hiring scope to continue')).toBeVisible();
  await page.goto(`${BASE}/review?state=accepted`);
  await expect(
    page.getByRole('button', { name: /Complete|Create|Activate|Continue/i }).first()
  ).toBeVisible();
  await page.goto(`${BASE}/done?variant=admin`);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('responsive: no horizontal scroll at 320 and 390 on the seeded frames', async ({ page }) => {
  const urls = [
    `${BASE}/profile?state=error`,
    `${BASE}/organisation?state=results`,
    `${BASE}/organisation/create?state=filled`,
    `${BASE}/payment?state=momo-filled`,
    `${BASE}/preferences?state=filled`,
  ];
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 800 });
    for (const url of urls) {
      await page.goto(url);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, `${url} at ${width}px`).toBeLessThanOrEqual(1);
    }
  }
});
