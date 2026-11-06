import { test, expect as baseExpect } from '@playwright/test';

// The dev server is shared and the first load of a lazy route is slow: give every check room.
const expect = baseExpect.configure({ timeout: 30_000 });
test.beforeEach(() => test.slow());

/*
 * Recruiter screening flow (Figma file OHG2xsfCCskT8xEn356njv, canvas "Recruiter - Job Postings" 10103:59491, frames JS-01 … JS-14): every state opens by URL on
 * /recruiter/job-screening (keys in the header of JobScreeningSection.jsx, wiki/recruiter-job-screening-flow.md) with mock data and no route guards.
 */
const BASE = '/recruiter/job-screening?job=senior-ux-designer';

test('JS-01 / JS-02: add-skill search, then the skill joins the criteria and the funnel drops', async ({
  page,
}) => {
  await page.goto(`${BASE}&skillSearch=Pro`);
  const popover = page.getByRole('dialog', { name: 'Add skill' });
  await expect(popover.getByText('FROM THIS POSTING')).toBeVisible();
  await expect(popover.getByText('SUGGESTED')).toBeVisible();
  await expect(popover.getByText('Add “Pro” as a custom skill')).toBeVisible();
  await popover.getByRole('button', { name: /Prototyping/ }).click();
  await expect(page).toHaveURL(/skills=prototyping/);
  await expect(page).not.toHaveURL(/skillSearch/);
  await expect(page.getByText('−8 · updated just now')).toBeVisible();
  await page.goto(`${BASE}&skills=prototyping`);
  await expect(page.getByText('Prototyping', { exact: true })).toBeVisible();
});

test('JS-03: education level on, the level dropdown with its check', async ({ page }) => {
  await page.goto(`${BASE}&education=on&dropdown=education-level`);
  const menu = page.getByRole('listbox', { name: 'Minimum education level' });
  await expect(menu.getByText('MINIMUM LEVEL')).toBeVisible();
  await expect(menu.getByRole('option', { name: /Bachelor’s degree/ })).toHaveAttribute(
    'aria-selected',
    'true'
  );
  await menu.getByRole('option', { name: /Master’s degree/ }).click();
  await expect(page).toHaveURL(/educationLevel=masters/);
});

test('JS-04: Apply & Filter Pool opens the processing dialog and lands on the results', async ({
  page,
}) => {
  await page.goto(`${BASE}&run=processing&checked=80`);
  await expect(page.getByText('Screening 128 applicants…')).toBeVisible();
  await expect(page.getByText('80 of 128 checked')).toBeVisible();
  await page.goto(BASE);
  await page.getByRole('button', { name: 'Apply & Filter Pool' }).click();
  await expect(page).toHaveURL(/run=processing/);
  await expect(page.getByRole('heading', { name: 'Screening results' })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page).toHaveURL(/results=meet/);
});

test('JS-05 / JS-06: results — meet all criteria, then close matches', async ({ page }) => {
  await page.goto(`${BASE}&results=meet`);
  await expect(page.getByRole('heading', { name: 'Screening results' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Move 46 to Pipeline' })).toBeVisible();
  await expect(page.getByText('Showing 7 of 46 · all selected')).toBeVisible();
  await page.getByRole('tab', { name: /Close match/ }).click();
  await expect(page).toHaveURL(/results=close/);
  await expect(page.getByText('Experience 4 yrs (needs 5+)')).toBeVisible();
  await expect(page.getByText('Showing 4 of 19 close matches')).toBeVisible();
});

test('JS-07: adjust criteria drawer with a live count, Cancel discards, Apply keeps', async ({
  page,
}) => {
  await page.goto(`${BASE}&results=meet&drawer=adjust&adjExperience=4plus&adjLocation=off`);
  const drawer = page.getByRole('dialog', { name: 'Adjust criteria' });
  await expect(drawer.getByText('5–10 years → changed to 4+ years')).toBeVisible();
  await expect(drawer.getByText('61', { exact: true })).toBeVisible();
  await expect(
    drawer.getByText('+15 compared with now (46) · 4 from Close match, 11 from Don’t meet')
  ).toBeVisible();
  await drawer.getByRole('button', { name: 'Apply changes' }).click();
  await expect(page.getByRole('button', { name: 'Move 61 to Pipeline' })).toBeVisible();
  await page.getByRole('button', { name: 'Adjust criteria' }).first().click();
  await page
    .getByRole('dialog', { name: 'Adjust criteria' })
    .getByRole('button', { name: 'Cancel' })
    .click();
  await expect(page.getByRole('button', { name: 'Move 46 to Pipeline' })).toBeVisible();
});

test('JS-08 / JS-09: no one meets all criteria, and a posting with no applicants yet', async ({
  page,
}) => {
  await page.goto(`${BASE}&results=none`);
  await expect(page.getByText('No one meets all 5 criteria yet')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Move 0 to Pipeline' })).toBeDisabled();
  await page.getByRole('button', { name: 'Review close matches (7)' }).click();
  await expect(page).toHaveURL(/results=close/);
  await page.goto('/recruiter/job-screening?job=product-designer&results=waiting');
  await expect(page.getByText('No applicants to screen yet')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Invite 24 matching talents' }).first()
  ).toBeVisible();
});

test('JS-10 / JS-11: confirm the move, land on the pipeline with the hand-off toast', async ({
  page,
}) => {
  await page.goto(`${BASE}&results=meet&modal=move`);
  const dialog = page.getByRole('dialog', { name: 'Move 46 applicants to Screening?' });
  await expect(dialog.getByText('The 82 who didn’t qualify')).toBeVisible();
  await dialog.getByText('Mark as not progressed and send a kind message').click();
  await expect(page).toHaveURL(/unq=reject/);
  await dialog.getByRole('button', { name: 'Move 46 to Pipeline' }).click();
  await expect(page).toHaveURL(/\/recruiter\/application-pipeline\?handoff=46/);
  await expect(
    page.getByRole('status').getByText('Success - 46 applicants moved to Screening')
  ).toBeVisible();
});

test('JS-12 / JS-13: save the criteria as a template, then the saved toast and chip', async ({
  page,
}) => {
  await page.goto(`${BASE}&modal=save-template`);
  const dialog = page.getByRole('dialog', { name: 'Save screening criteria' });
  await expect(dialog.getByLabel(/Name/)).toHaveValue('Senior design screening');
  await expect(dialog.getByText('Location: Accra or Remote')).toBeVisible();
  await dialog.getByRole('button', { name: 'Save criteria' }).click();
  await expect(page).toHaveURL(/toast=saved/);
  await expect(
    page.getByRole('status').getByText('Success - Screening criteria saved')
  ).toBeVisible();
  await expect(page.getByText('Saved as “Senior design screening”')).toBeVisible();
});

test('JS-14: load saved criteria dropdown', async ({ page }) => {
  await page.goto(`${BASE}&dropdown=saved-criteria`);
  const menu = page.getByRole('menu', { name: 'Load saved criteria' });
  await expect(menu.getByText('SAVED BY YOUR TEAM')).toBeVisible();
  await expect(menu.getByText('You · 5 rules · used on 2 jobs')).toBeVisible();
  await menu.getByRole('menuitem', { name: /Graduate intake screening/ }).click();
  await expect(page.getByText('Saved as “Graduate intake screening”')).toBeVisible();
});

test('the two base frames are untouched without the job key', async ({ page }) => {
  await page.goto('/recruiter/job-screening');
  await expect(page.getByText('1,420')).toBeVisible();
  await expect(page.getByText('Load saved criteria')).toHaveCount(0);
});

test('responsive: no horizontal scroll at 320 and 390 on the flow states', async ({ page }) => {
  const urls = [
    `${BASE}&skillSearch=Pro`,
    `${BASE}&education=on&dropdown=education-level`,
    `${BASE}&results=meet`,
    `${BASE}&results=close`,
    `${BASE}&results=none`,
    `${BASE}&results=meet&drawer=adjust&adjExperience=4plus`,
    `${BASE}&results=meet&modal=move`,
    `${BASE}&modal=save-template`,
  ];
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 800 });
    for (const url of urls) {
      await page.goto(url);
      await expect(page.getByText('Senior UX Designer').first()).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, `${url} at ${width}px`).toBeLessThanOrEqual(1);
    }
  }
});
