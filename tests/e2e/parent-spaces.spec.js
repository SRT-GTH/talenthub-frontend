import { test, expect as baseExpect } from '@playwright/test';

// The dev server is shared with other sessions and the first load of a lazy route is slow: give every check room.
const expect = baseExpect.configure({ timeout: 15_000 });
test.beforeEach(() => test.slow());

/*
 * Parent who is also a talent — Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 12 Parent who is also a talent" 10057:67476 (the parent-side frames).
 * PD-02 the switch-space menu over the home, PD-04 "Build your own career profile" (no career profile yet), PN-02 the bell panel with both spaces.
 */
const visible = (page, text) =>
  page.getByText(text, { exact: true }).filter({ visible: true }).first();

test('PD-02 /parent?menu=switch shows the switch-space menu copy', async ({ page }) => {
  await page.goto('/parent?menu=switch');
  const menu = page.getByRole('menu', { name: 'Switch space' });
  await expect(menu).toBeVisible();
  for (const text of [
    'SWITCH SPACE',
    'Parent view',
    'Abena and Elliot · 2 wards linked',
    'My career',
    'Discoverable · 5 of 9 · 18 matches',
    '2 new',
    'Each space keeps its own data. Your wards never see your career profile, and recruiters don’t see your wards.',
  ]) {
    await expect(menu.getByText(text, { exact: true }), text).toBeVisible();
  }
  await expect(menu.getByRole('menuitemradio', { name: /^Parent view/ })).toHaveAttribute(
    'aria-checked',
    'true'
  );
});

test('the profile card opens the menu; Esc closes; My career goes to the talent home', async ({
  page,
}) => {
  await page.goto('/parent');
  await page.getByRole('button', { name: 'Switch space' }).click();
  await expect(page).toHaveURL(/menu=switch/);
  await expect(page.getByRole('menu', { name: 'Switch space' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await page.getByRole('button', { name: 'Switch space' }).click();
  await page.getByRole('menuitemradio', { name: /^My career/ }).click();
  await expect(page).toHaveURL(/\/home\?as=emma/);
});

test('PD-04 shows the no-career sidebar card and the build dialog', async ({ page }) => {
  await page.goto('/parent?career=none&modal=career-profile');
  const dialog = page.getByRole('dialog', { name: 'Build your own career profile' });
  await expect(dialog).toBeVisible();
  for (const text of [
    'GTH works for you too. Learn new skills, get them verified and get matched to roles. It’s a separate space, so your wards never see it.',
    'Career Buddy guides you · about 10 minutes',
    'Parent view stays exactly as it is',
    'Switch spaces any time from your profile card',
  ]) {
    await expect(dialog.getByText(text, { exact: true }), text).toBeVisible();
  }
  await expect(dialog.getByRole('button', { name: 'Not now' })).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Start with Career Buddy' })).toBeVisible();
  await dialog.getByRole('button', { name: 'Not now' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  for (const text of ['Your own career', 'Learn, get verified and get matched']) {
    await expect(visible(page, text), text).toBeVisible();
  }
  // No career profile: no switch menu (the chevron is not a button).
  await expect(page.getByRole('button', { name: 'Switch space' })).toHaveCount(0);
});

test('the "Build my profile" card button opens the dialog', async ({ page }) => {
  await page.goto('/parent?career=none');
  await page.getByRole('button', { name: /Build my profile/ }).click();
  await expect(page).toHaveURL(/modal=career-profile/);
  await expect(page.getByRole('dialog', { name: 'Build your own career profile' })).toBeVisible();
});

test('PN-02 /parent?notif=open&spaces=both lists both spaces and filters them', async ({
  page,
}) => {
  await page.goto('/parent?notif=open&spaces=both');
  const panel = page.getByRole('dialog', { name: 'Notifications' });
  await expect(panel).toBeVisible();
  for (const text of [
    'All · 7',
    'Parent · 5',
    'My career · 2',
    'New match: Junior Data Analyst',
    'Ecobank · Accra · 3 h',
    '2 recruiters found you',
    'Ecobank and mPharma · 1 h',
    'Abena wanted you to see this',
    'Elliot linked to your account',
  ]) {
    await expect(panel.getByText(text, { exact: true }), text).toBeVisible();
  }
  await expect(panel.getByRole('listitem')).toHaveCount(7);
  await panel.getByRole('button', { name: 'My career · 2' }).click();
  await expect(panel.getByRole('listitem')).toHaveCount(2);
  await panel.getByRole('button', { name: /^Parent · 5/ }).click();
  await expect(panel.getByRole('listitem')).toHaveCount(5);
  await panel.getByRole('button', { name: 'All · 7' }).click();
  await expect(panel.getByRole('listitem')).toHaveCount(7);
});

test('without ?spaces=both the bell panel is the PN-01 one (no filters)', async ({ page }) => {
  await page.goto('/parent?notif=open');
  const panel = page.getByRole('dialog', { name: 'Notifications' });
  await expect(panel.getByRole('listitem')).toHaveCount(5);
  await expect(panel.getByRole('button', { name: 'All · 7' })).toHaveCount(0);
});

/*
 * TC-01 / TC-02 — the talent home of a parent who is also a talent: `/home?as=emma` (Emma's Discoverable home) and `&menu=switch`.
 */
test('TC-01 /home?as=emma is Emma’s talent home, not Kofi’s', async ({ page }) => {
  await page.goto('/home?as=emma');
  for (const text of [
    'MILESTONE 1 OF 3 UNLOCKED',
    'Emma Mensah',
    'Banking to data analytics · Accra',
    'Parent view · 4 to review →',
    'Junior Data Analyst',
    'Ecobank · Accra · Hybrid',
    'Credit Risk Analyst',
    'Fidelity Bank · Accra · On-site',
    'Data Analyst (part-time)',
    'mPharma · Remote · Ghana',
    'Recruiters filter by projects. Add your loan-default dashboard from Power BI Basics, with a screenshot.',
    'You’re in My career',
    'Your wards and their data stay in Parent view. They can’t see this space.',
    'Back to Parent view',
    'Opportunities',
    'Clubs',
    'gth.com/talent/emma-mensah',
  ]) {
    await expect(visible(page, text), text).toBeVisible();
  }
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Emma');
  await expect(page.getByText('Kofi')).toHaveCount(0);
});

test('Back to Parent view and the sidebar link return to the parent home', async ({ page }) => {
  await page.goto('/home?as=emma');
  await page.getByRole('button', { name: 'Back to Parent view' }).click();
  await expect(page).toHaveURL(/\/parent$/);
  await page.goto('/home?as=emma');
  await page.getByRole('button', { name: 'Parent view · 4 to review →' }).click();
  await expect(page).toHaveURL(/\/parent$/);
});

test('TC-02 the talent home switch menu shows My career as current', async ({ page }) => {
  await page.goto('/home?as=emma&menu=switch');
  const menu = page.getByRole('menu', { name: 'Switch space' });
  await expect(menu).toBeVisible();
  await expect(menu.getByText('4 to review', { exact: true })).toBeVisible();
  await expect(menu.getByRole('menuitemradio', { name: /^My career/ })).toHaveAttribute(
    'aria-checked',
    'true'
  );
  await expect(page.getByText('You’re in My career')).toHaveCount(0);
  await menu.getByRole('menuitemradio', { name: /^Parent view/ }).click();
  await expect(page).toHaveURL(/\/parent$/);
});

test('Kofi’s Discoverable home is unchanged without ?as=emma', async ({ page }) => {
  await page.goto('/home?state=discoverable');
  await expect(visible(page, 'Kofi Agyekum')).toBeVisible();
  await expect(visible(page, 'Junior Frontend Developer')).toBeVisible();
  await expect(visible(page, 'Job Postings')).toBeVisible();
  await expect(page.getByText('Emma')).toHaveCount(0);
  await expect(page.getByText('You’re in My career')).toHaveCount(0);
});
