// @ts-check
import { test, expect } from '@playwright/test';

/*
 * Parent dashboard flows — flags and corrections, opt out and restore, Help and guides
 * (wiki/parent-flags.md, wiki/parent-opt-out.md). Mock data, state in the URL and an in-memory store, so every
 * test starts from a fresh page load. Visual baselines for the same URLs come from desktop-visual.spec.js
 * (the routes are registered in helpers/responsive.js); accessibility checks are in parent-a11y.spec.js.
 *
 *   npx playwright test parent-flows
 */
test.describe.configure({ timeout: 120_000 });

/** @param {import('@playwright/test').Page} page @param {string} route */
const open = async (page, route) => {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 60_000 });
};
const flagsChip = (/** @type {import('@playwright/test').Page} */ page) =>
  page.getByRole('navigation', { name: 'Abena sections' }).getByRole('link', { name: /^Flags/ });

test.describe('flags and corrections', () => {
  test('flag a field: short note errors, a valid note sends, Undo reverts', async ({ page }) => {
    await open(page, '/parent/wards/abena?tab=profile');
    await expect(flagsChip(page)).toHaveText(/Flags\s*2/);

    await page.getByRole('button', { name: 'Flag Region' }).click();
    const dialog = page.getByRole('dialog', { name: 'Flag “Region”' });
    await expect(dialog).toBeVisible();

    await dialog.getByRole('textbox', { name: /What’s wrong/ }).fill('abc');
    await dialog.getByRole('button', { name: 'Send flag to Abena' }).click();
    await expect(dialog.getByRole('alert')).toContainText(
      'Add a little more so Abena knows what to fix'
    );
    await expect(dialog).toBeVisible();

    await dialog.getByRole('radio', { name: 'Critical' }).click();
    await dialog
      .getByRole('textbox', { name: /What’s wrong/ })
      .fill('Region should be Ashanti, not Greater Accra.');
    await dialog.getByRole('button', { name: 'Send flag to Abena' }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('status').filter({ hasText: 'Flag sent to Abena' })).toBeVisible();
    await expect(flagsChip(page)).toHaveText(/Flags\s*3/);
    await expect(page.getByText('Flagged by you').first()).toBeVisible();

    await page.getByRole('button', { name: 'Undo' }).click();
    await expect(flagsChip(page)).toHaveText(/Flags\s*2/);
  });

  test('Esc closes the flag dialog and focus returns to the Flag button', async ({ page }) => {
    await open(page, '/parent/wards/abena?tab=profile');
    const trigger = page.getByRole('button', { name: 'Flag School' });
    await trigger.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(page).not.toHaveURL(/modal=/);
  });

  test('To review → Check → Approve fix updates the queue and the Flags chip', async ({ page }) => {
    await open(page, '/parent/wards/abena?tab=profile');
    await page.getByRole('link', { name: 'To review' }).first().click();
    await expect(page.getByText('Date of birth was corrected')).toBeVisible();
    await expect(page.getByText('4 waiting')).toBeVisible();

    await page.getByRole('link', { name: 'Check' }).click();
    const dialog = page.getByRole('dialog', { name: /Abena fixed/ });
    await expect(dialog).toContainText('12 March 2009');
    await expect(dialog).toContainText('12 March 2010');
    await dialog.getByRole('button', { name: 'Approve fix' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Fix approved' })).toBeVisible();
    await expect(flagsChip(page)).toHaveText(/Flags\s*1/);

    await page.getByRole('link', { name: 'To review' }).first().click();
    // the approved correction no longer waits for the parent (the empty-state wording belongs to the To review page)
    await expect(page.getByText('Date of birth was corrected')).toHaveCount(0);
    await expect(page.getByText('3 waiting')).toBeVisible();
  });

  test('Flag again turns the row into Re-reviewing', async ({ page }) => {
    await open(page, '/parent/wards/abena?tab=flags');
    await page.getByRole('button', { name: 'Review fix' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Flag again' }).click();
    const dialog = page.getByRole('dialog', { name: 'Flag “Date of birth” again' });
    await dialog
      .getByRole('textbox', { name: /still wrong/ })
      .fill('The month should be May, not March.');
    await dialog.getByRole('button', { name: 'Send flag again' }).click();
    await expect(
      page.getByRole('region', { name: 'Flags' }).getByText('Re-reviewing')
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Review fix' })).toHaveCount(0);
  });

  test('frame URLs reproduce their state on a fresh load', async ({ page }) => {
    await open(page, '/parent/wards/abena?tab=profile&toast=flag-sent');
    await expect(page.getByRole('status').filter({ hasText: 'Flag sent to Abena' })).toBeVisible();
    await expect(flagsChip(page)).toHaveText(/Flags\s*3/);

    await open(page, '/parent/wards/abena?tab=flags&toast=fix-approved');
    await expect(page.getByRole('status').filter({ hasText: 'Fix approved' })).toBeVisible();
    await expect(flagsChip(page)).toHaveText(/Flags\s*1/);

    await open(page, '/parent/wards/abena/flags?modal=recheck&flag=dob');
    await expect(page).toHaveURL(/tab=flags/);
    await expect(page.getByRole('dialog', { name: /Abena fixed/ })).toBeVisible();
  });

  test('another ward has no flags UI and falls back to its overview', async ({ page }) => {
    await open(page, '/parent/wards/elliot?tab=flags');
    await expect(page.getByRole('region', { name: 'Flags' })).toHaveCount(0);
    await expect(
      page.getByRole('navigation', { name: 'Elliot sections' }).locator('a[aria-current="page"]')
    ).toContainText('Overview');
  });
});

test.describe('opt out and restore', () => {
  test('opt out, see the paused page, then restore', async ({ page }) => {
    await open(page, '/parent/wards/abena');
    await page.getByRole('button', { name: 'Opt out', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Opt Abena out of GTH?' });
    await expect(dialog).toContainText('Why are you opting her out?');

    const confirm = dialog.getByRole('button', { name: 'Opt out Abena' });
    await expect(confirm).toBeDisabled();
    await dialog.getByRole('radio', { name: 'Too young' }).click();
    await dialog
      .getByRole('textbox', { name: /Anything else/ })
      .fill('She is only 16 and I want to review first.');
    await dialog.getByText('I understand Abena will be told her access is paused.').click();
    await expect(confirm).toBeEnabled();
    await confirm.click();

    await expect(page.getByText('Abena’s access is paused')).toBeVisible();
    await expect(
      page.getByText(/Opted out by you today, \d\d:\d\d · reason: Too young/)
    ).toBeVisible();
    await expect(page).toHaveURL(/state=opted-out/);
    await expect(page.getByRole('button', { name: 'Evaluate Abena' })).toHaveCount(0);
    await expect(page.getByRole('navigation', { name: 'Abena sections' })).toHaveCount(0);

    await page.getByRole('button', { name: 'Restore access' }).click();
    const restore = page.getByRole('dialog', { name: 'Restore Abena’s access?' });
    await restore.getByRole('button', { name: 'Not now' }).click();
    await expect(page.getByText('Abena’s access is paused')).toBeVisible();

    await page.getByRole('button', { name: 'Restore access' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Restore access' }).click();
    await expect(page.getByRole('button', { name: 'Evaluate Abena' })).toBeVisible();
    await expect(
      page.getByRole('status').filter({ hasText: 'Abena’s access is back' })
    ).toBeVisible();
    await expect(page).not.toHaveURL(/state=/);
  });

  test('the wording follows the ward (Elliot: he / him / his)', async ({ page }) => {
    await open(page, '/parent/wards/elliot');
    await page.getByRole('button', { name: 'Opt out', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Opt Elliot out of GTH?' });
    await expect(dialog).toContainText('He’ll lose access');
    await expect(dialog).toContainText('Why are you opting him out?');
    await dialog.getByText(/I understand Elliot will be told his access is paused/).click();
    await dialog.getByRole('button', { name: 'Opt out Elliot' }).click();
    await expect(page.getByText(/his profile is hidden and his data is kept/)).toBeVisible();
  });

  test('frame URLs reproduce their state on a fresh load', async ({ page }) => {
    await open(page, '/parent/wards/abena?state=opted-out');
    await expect(
      page.getByText(/Opted out by you today, 15:20 · reason: Safety concerns/)
    ).toBeVisible();

    await open(page, '/parent/wards/abena?state=opted-out&modal=restore');
    await expect(page.getByRole('dialog', { name: 'Restore Abena’s access?' })).toBeVisible();

    await open(page, '/parent/wards/abena?toast=access-restored');
    await expect(
      page.getByRole('status').filter({ hasText: 'Abena’s access is back' })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Evaluate Abena' })).toBeVisible();

    await open(page, '/parent/wards/abena?modal=opt-out&reason=safety&ack=1');
    const dialog = page.getByRole('dialog', { name: 'Opt Abena out of GTH?' });
    await expect(dialog.getByRole('radio', { name: 'Safety concerns' })).toBeChecked();
    await expect(dialog.getByRole('button', { name: 'Opt out Abena' })).toBeEnabled();
  });
});

test.describe('report a concern and Help and guides', () => {
  test('Help page: six topics, search filters them, the report flow hands off to opt-out', async ({
    page,
  }) => {
    await open(page, '/parent/help');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Help and guides');
    await expect(page.getByRole('link', { name: 'Help and guides' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    await expect(
      page
        .getByRole('list')
        .filter({ has: page.getByRole('button', { name: /Opting out and privacy/ }) })
        .getByRole('listitem')
    ).toHaveCount(6);

    const search = page.getByRole('textbox', { name: 'Search help' });
    await search.fill('wallet');
    await expect(page.getByRole('button', { name: /Starter wallets and limits/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Opting out and privacy/ })).toHaveCount(0);
    await search.fill('zzzz');
    await expect(page.getByText('No topics match your search.')).toBeVisible();
    await search.fill('');

    await page.getByRole('button', { name: 'Report a concern' }).click();
    const report = page.getByRole('dialog', { name: 'Report a safety concern' });
    await expect(report.getByRole('radio', { name: 'Abena' })).toBeChecked();
    await expect(report.getByRole('button', { name: 'Send report' })).toBeDisabled();
    await report
      .getByRole('textbox', { name: /Tell us more/ })
      .fill('A person asked her for her phone number in a club.');
    await report.getByRole('button', { name: 'Send report' }).click();

    const sent = page.getByRole('dialog', { name: 'Thank you, Emma. We’re on it.' });
    await expect(sent).toContainText('GTH-S-4821');
    await sent.getByRole('button', { name: 'Opt Abena out' }).click();
    await expect(page).toHaveURL(/\/parent\/wards\/abena\?.*modal=opt-out/);
    await expect(page.getByRole('dialog', { name: 'Opt Abena out of GTH?' })).toBeVisible();
  });

  test('a report about "Someone else" offers no opt-out', async ({ page }) => {
    await open(page, '/parent/help?modal=report-sent&about=else');
    const sent = page.getByRole('dialog', { name: 'Thank you, Emma. We’re on it.' });
    await expect(sent).toBeVisible();
    await expect(sent.getByText('While you wait')).toHaveCount(0);
    await expect(sent.getByRole('button', { name: /Opt .* out/ })).toHaveCount(0);
    await sent.getByRole('button', { name: 'Done' }).click();
    await expect(sent).toBeHidden();
  });

  test('the ward page hosts the same report dialogs', async ({ page }) => {
    await open(page, '/parent/wards/abena?state=opted-out');
    await page.getByRole('button', { name: 'Report a concern' }).click();
    const report = page.getByRole('dialog', { name: 'Report a safety concern' });
    await report.getByRole('radio', { name: 'Elliot' }).click();
    await report
      .getByRole('textbox', { name: /Tell us more/ })
      .fill('Someone keeps messaging him.');
    await report.getByRole('button', { name: 'Send report' }).click();
    const sent = page.getByRole('dialog', { name: 'Thank you, Emma. We’re on it.' });
    // the report is about Elliot, but this page can only opt Abena out
    await expect(sent.getByRole('button', { name: /Opt .* out/ })).toHaveCount(0);
  });
});
