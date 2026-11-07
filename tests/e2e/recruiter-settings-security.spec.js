import { test, expect } from '@playwright/test';

/*
 * Recruiter Settings & Account - security area (SR-13/14/16/17/18/23/24/25/26/27). Dev server http://127.0.0.1:5199.
 * Every frame reproduces from a fresh load of its URL; the flows are driven through the page.
 */
test.use({ baseURL: 'http://127.0.0.1:5199', viewport: { width: 1440, height: 900 } });
test.describe.configure({ retries: 1 });

const go = async (page, url) => {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'Settings', level: 1 })).toBeVisible({
    timeout: 30000,
  });
};

test('SR-13 security tab renders the three cards', async ({ page }) => {
  await go(page, '/recruiter/settings?tab=security');
  for (const t of [
    'Sign-in',
    'Last changed 3 months ago',
    'Required for Admins · code by SMS to •••• 3456',
    'Single sign-on (Google Workspace)',
    'silverrock.tech',
    'Where you’re signed in',
    'MacBook Pro · Chrome',
    'This device',
    'Danger zone',
    'Leave Silver Rock Technology',
    'Delete my recruiter account',
  ])
    await expect(page.getByText(t, { exact: true })).toBeVisible();
  await expect(
    page.getByRole('switch', { name: 'Single sign-on (Google Workspace)' })
  ).toBeChecked();
});

test('SR-23 change password validates and confirms', async ({ page }) => {
  await go(page, '/recruiter/settings?tab=security&modal=change-password');
  const dlg = page.getByRole('dialog', { name: 'Change password' });
  await expect(dlg.getByText('You’ll stay signed in on this device.')).toBeVisible();
  await expect(dlg.getByText('Strong · 12+ characters with a number and symbol')).toBeVisible();
  const update = dlg.getByRole('button', { name: 'Update password' });
  await expect(update).toBeEnabled();
  await dlg.getByLabel('Confirm new password').fill('different');
  await expect(update).toBeDisabled();
  await expect(dlg.getByText('The two passwords don’t match')).toBeVisible();
  await dlg.getByLabel('Confirm new password').fill('N3w-Secure#2');
  await update.click();
  await expect(page).toHaveURL(/toast=password-updated/);
  await expect(page.getByText('Success - Password updated').first()).toBeVisible();
});

test('SR-24 two-step code needs six digits', async ({ page }) => {
  await go(page, '/recruiter/settings?tab=security');
  await page.getByRole('button', { name: 'Manage' }).click();
  await expect(page).toHaveURL(/modal=two-step/);
  const dlg = page.getByRole('dialog', { name: 'Enter the 6-digit code' });
  await expect(
    dlg.getByText('We sent a code to •••• 3456. It expires in 5 minutes.')
  ).toBeVisible();
  await expect(dlg.getByText(/Resend code in 0:4\d/)).toBeVisible();
  const verify = dlg.getByRole('button', { name: 'Verify' });
  await expect(verify).toBeDisabled();
  await dlg.getByLabel('Digit 5 of 6').fill('1');
  await dlg.getByLabel('Digit 6 of 6').fill('7');
  await expect(verify).toBeEnabled();
  await verify.click();
  await expect(page).not.toHaveURL(/modal=two-step/);
  await expect(page.getByText('Success - Two-step verification confirmed').first()).toBeVisible();
});

test('SR-25 device log out removes the row and shows the toast', async ({ page }) => {
  await go(page, '/recruiter/settings?tab=security&toast=device-logged-out');
  await expect(page.getByText('Success - Logged out of Windows · Edge').first()).toBeVisible();
  await expect(page.getByText('Kumasi · that device needs to sign in again').first()).toBeVisible();
  await expect(page.getByText('Windows · Edge', { exact: true })).toBeVisible();
  await go(page, '/recruiter/settings?tab=security');
  await page.getByRole('button', { name: 'Log out iPhone 14 · GTH app' }).click();
  await expect(page).toHaveURL(/removed=iphone-gth-app/);
  await expect(page.getByText('iPhone 14 · GTH app', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Success - Logged out of iPhone 14 · GTH app').first()).toBeVisible();
});

test('SR-26 delete needs the typed word (in the URL), then logs out', async ({ page }) => {
  await go(page, '/recruiter/settings?tab=security&modal=delete-account');
  const dlg = page.getByRole('dialog', { name: 'Delete your recruiter account?' });
  await expect(dlg.getByText('You’re the only Admin')).toBeVisible();
  const del = dlg.getByRole('button', { name: 'Delete account' });
  await expect(del).toBeDisabled();
  await dlg.getByLabel('Type DELETE to confirm').fill('DELETE');
  await expect(page).toHaveURL(/confirm=DELETE/);
  await expect(del).toBeEnabled();
  await dlg.getByRole('button', { name: 'Go to Team and roles' }).click();
  await expect(page).toHaveURL(/tab=team/);
  await go(page, '/recruiter/settings?tab=security&modal=delete-account&confirm=DELETE');
  await page.getByRole('dialog').getByRole('button', { name: 'Delete account' }).click();
  await expect(page).toHaveURL(/state=logged-out/);
  await expect(page.getByRole('heading', { name: 'You’re logged out, Joel.' })).toBeVisible();
});

test('SR-17 / SR-18 language and data, export toast', async ({ page }) => {
  await go(page, '/recruiter/settings?tab=language');
  for (const t of [
    'App language',
    'Twi, Ga, Ewe, Dagbani, Hausa',
    'Coming soon',
    'Hiring Assistant language',
    'Candidate data',
    'Keep candidate data for',
    'Export candidates',
    'Download my data',
    'Pause hiring',
  ])
    await expect(page.getByText(t, { exact: true }).first()).toBeVisible();
  await page.getByRole('combobox', { name: 'Keep candidate data for' }).click();
  await page.getByRole('option', { name: '24 months' }).click();
  await expect(page.getByRole('combobox', { name: 'Keep candidate data for' })).toContainText(
    '24 months'
  );
  await page.getByRole('button', { name: 'Export CSV' }).click();
  await expect(page).toHaveURL(/toast=export-requested/);
  await expect(page.getByText('Success - Your export is being prepared').first()).toBeVisible();
  await go(page, '/recruiter/settings?tab=language&toast=export-requested');
  await expect(
    page.getByText('We’ll email joel.kofie@silverrock.tech in about 10 minutes')
  ).toBeVisible();
});

test('SR-14 profile menu, SR-16 log out, SR-27 logged out', async ({ page }) => {
  await go(page, '/recruiter/settings?tab=security&menu=open');
  const menu = page.getByRole('menu', { name: 'Profile menu' });
  for (const t of [
    'Kwame Asante',
    'k.asante89@silverrocktech.com',
    'Profile 100%',
    'Top Recruiter',
    'View my recruiter profile',
    'Preview as talent',
    'View applicants',
    'Saved talents',
    'Help and support',
    'Send feedback',
    'Invite a friend',
    '+50pts',
    'Keyboard: ↑ ↓ to move, Esc to close',
  ])
    await expect(menu.getByText(t, { exact: true })).toBeVisible();
  await expect(menu.getByText('Switch', { exact: false })).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(page).not.toHaveURL(/menu=open/);
  await page.getByRole('button', { name: /Profile menu/ }).click();
  await page.getByRole('menuitem', { name: 'Language, English (GH)' }).click();
  await expect(page).toHaveURL(/tab=language/);
  await page.getByRole('button', { name: /Profile menu/ }).click();
  await page.getByRole('menuitem', { name: 'Log out' }).click();
  await expect(page).toHaveURL(/modal=logout/);
  const dlg = page.getByRole('dialog', { name: 'Log out of GTH?' });
  await expect(
    dlg.getByText('Your hiring streak and drafts are saved. Candidates can still message you.')
  ).toBeVisible();
  await dlg.getByRole('button', { name: 'Stay' }).click();
  await expect(page).not.toHaveURL(/modal=logout/);
  await page.getByRole('button', { name: /Profile menu/ }).click();
  await page.getByRole('menuitem', { name: 'Log out' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Log out' }).click();
  await expect(page).toHaveURL(/state=logged-out/);
  await expect(page.getByText('Your drafts, notes and hiring streak are saved.')).toBeVisible();
  await expect(page.getByText('Not Joel? Use a different account')).toBeVisible();
  await expect(
    page.getByText('On a shared computer? Close this browser window too.')
  ).toBeVisible();
  await page.getByRole('button', { name: 'Log back in' }).click();
  await expect(page).toHaveURL(/\/login/);
});

test('no horizontal overflow at 320 / 390 / 1024', async ({ page }) => {
  for (const w of [320, 390, 1024]) {
    await page.setViewportSize({ width: w, height: 800 });
    for (const u of [
      '/recruiter/settings?tab=security',
      '/recruiter/settings?tab=language',
      '/recruiter/settings?state=logged-out',
    ]) {
      await page.goto(u, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1200);
      const over = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(over, `${u} @${w}`).toBeLessThanOrEqual(0);
    }
  }
});
