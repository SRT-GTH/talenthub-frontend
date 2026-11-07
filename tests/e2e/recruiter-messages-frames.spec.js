import { test, expect as baseExpect } from '@playwright/test';

// The dev server is shared and the first load of a lazy route is slow: give every check room.
const expect = baseExpect.configure({ timeout: 30_000 });
test.beforeEach(() => test.slow());

/*
 * Recruiter - Messages (Figma file OHG2xsfCCskT8xEn356njv, canvas 10124:23474, R-MSG-01 … R-MSG-11): the recruiter inbox on /recruiter/messages.
 * Every frame opens by URL with mock data (see wiki/recruiter-messages-inbox.md).
 */
const BASE = '/recruiter/messages';

test('R-MSG-01 / 09 / 02: All, Unread and Applicants filters', async ({ page }) => {
  await page.goto(BASE);
  await expect(page.getByRole('heading', { name: 'Messages', level: 1 })).toBeVisible();
  await expect(page.getByText('Meets 5 of 5 screening rules')).toBeVisible();
  await page.goto(`${BASE}?tab=unread`);
  await expect(page.getByText('Tuesday at 14:00 works for me.').first()).toBeVisible();
  await page.goto(`${BASE}?tab=applicants`);
  await expect(page.getByText(/Eleanor can’t see this card/)).toBeVisible();
});

test('R-MSG-08 / 11 / 02b: empty states and no conversation selected', async ({ page }) => {
  await page.goto(`${BASE}?tab=applicants&inbox=none`);
  await expect(page.getByText('No applications yet')).toBeVisible();
  await expect(page.getByText('Your 2 active jobs are live')).toBeVisible();
  await page.goto(`${BASE}?inbox=empty`);
  await expect(page.getByText('Start your first conversation')).toBeVisible();
  await page.goto(`${BASE}?conversation=none`);
  await expect(page.getByText('Select a conversation')).toBeVisible();
});

test('R-MSG-04 / 05 / 06 / 07: archive, archived view and unarchive toasts', async ({ page }) => {
  await page.goto(`${BASE}?tab=applicants&toast=archived`);
  await expect(
    page.getByText('Find it with the archive button next to search').first()
  ).toBeVisible();
  await page.goto(`${BASE}?archived=1`);
  await expect(page.getByText('This conversation is archived')).toBeVisible();
  await page.getByRole('button', { name: 'Unarchive' }).click();
  await expect(page.getByText('Moved back to your inbox').first()).toBeVisible();
  await page.goto(`${BASE}?archived=1&inbox=empty`);
  await expect(page.getByText('Nothing archived')).toBeVisible();
});

test('archiving from the thread menu removes the row and offers Undo', async ({ page }) => {
  await page.goto(`${BASE}?menu=thread`);
  await page.getByRole('menuitem', { name: 'Archive conversation' }).click();
  await expect(page.getByText('Conversation with Ama Boateng archived').first()).toBeVisible();
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page.getByText('Ama Boateng').first()).toBeVisible();
});

test('responsive: no horizontal scroll at 320 and 390, thread opens as its own screen', async ({
  page,
}) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 800 });
    for (const url of [BASE, `${BASE}?thread=open`, `${BASE}?archived=1`, `${BASE}?inbox=empty`]) {
      await page.goto(url);
      await expect(page.locator('main input:visible').first()).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, `${url} at ${width}px`).toBeLessThanOrEqual(1);
    }
  }
});
