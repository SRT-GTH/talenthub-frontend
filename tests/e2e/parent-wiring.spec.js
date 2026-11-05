import { test, expect as baseExpect } from '@playwright/test';

// The dev server is shared with other sessions and the first load of a lazy route is slow: give every check room.
const expect = baseExpect.configure({ timeout: 30_000 });
test.beforeEach(() => test.slow());

/*
 * Cross-flow wiring of the parent screens: buttons that used to only log, now that the screens they point at are built
 * (To review → Ward wallets, My wards ↔ Link a ward, Link a ward → Opt out, ward page → Evaluate / Report, Notifications → Settings, sidebar and top bar).
 */

test('To review: the payment "Decide" opens the Ward wallets approve dialog', async ({ page }) => {
  await page.goto('/parent/review?tab=payments');
  await page.getByRole('button', { name: 'Decide' }).first().click();
  await expect(page).toHaveURL(/\/parent\/wallets\?modal=approve/);
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('My wards: "Link another ward" opens the link flow', async ({ page }) => {
  await page.goto('/parent/wards');
  await page.getByRole('button', { name: /Link another ward/ }).click();
  await expect(page).toHaveURL(/\/parent\/link-ward/);
});

test('My wards: a good link code lands on the "Kwesi accepted your request" toast', async ({
  page,
}) => {
  await page.goto('/parent/wards?toast=accepted');
  await expect(page.getByText('Kwesi accepted your request').first()).toBeVisible();
  await expect(
    page.getByText('He now has the same controls as Abena and Elliot.').first()
  ).toBeVisible();
  await expect(page.getByText('Mother · 3 wards linked').first()).toBeVisible();
});

test('Ward linked automatically: "Opt out" opens the opt-out dialog on that ward', async ({
  page,
}) => {
  await page.goto('/parent?modal=ward-linked');
  await page
    .getByRole('dialog')
    .getByRole('button', { name: /Opt out/ })
    .click();
  await expect(page).toHaveURL(/\/parent\/wards\/[a-z]+\?modal=opt-out/);
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('Ward page: Evaluate opens the Evaluate flow', async ({ page }) => {
  await page.goto('/parent/wards/abena');
  await page
    .getByRole('button', { name: /^Evaluate/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/parent\/evaluate/);
});

test('Ward page, Crew tab: "Report a concern" opens the report dialog', async ({ page }) => {
  await page.goto('/parent/wards/abena?tab=crew');
  await page.getByRole('button', { name: 'Report a concern' }).first().click();
  await expect(page).toHaveURL(/modal=report/);
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('Notifications: "Notification settings" opens Settings → Notifications', async ({ page }) => {
  await page.goto('/parent/notifications');
  await page.getByRole('link', { name: 'Notification settings' }).click();
  await expect(page).toHaveURL(/\/parent\/settings\?tab=notifications/);
});

test('Sidebar note and the top bar "Parent view" chip', async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 1000 });
  await page.goto('/parent');
  await page.getByRole('link', { name: '1 payment waits for you →' }).click();
  await expect(page).toHaveURL(/\/parent\/review\?tab=payments/);
  await page
    .getByRole('button', { name: /^Parent view$/ })
    .first()
    .click();
  await expect(page.getByRole('menu', { name: 'Switch space' })).toBeVisible();
});

test('Home: "Send Abena a note" opens the milestone she shared', async ({ page }) => {
  await page.goto('/parent');
  await page.getByRole('link', { name: /Send Abena a note/ }).click();
  await expect(page).toHaveURL(/\/parent\/notifications\/milestone/);
});
