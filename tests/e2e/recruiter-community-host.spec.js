import { test, expect as baseExpect } from '@playwright/test';

// The dev server is shared with other sessions and the first load of a lazy route is slow: give every check room.
const expect = baseExpect.configure({ timeout: 30_000 });
test.beforeEach(() => {
  test.slow();
  test.setTimeout(240_000);
});

/*
 * Recruiter Community · Host a company club — Figma file OHG2xsfCCskT8xEn356njv, canvas "Recruiter - Community Engagement"
 * 10026:36840, section "RECRUITER · COMMUNITY · Host a company club" (RC-CC02 … RC-CC17b).
 * The same pages as the talent create flow, read as recruiter from the `/recruiter/community…` path (wiki/recruiter-community-host.md).
 */
const WIZARD = '/recruiter/community/create?cat=software-engineering';
const OWNER = '/recruiter/community/agritech-innovators-ghana/manage';

const norm = (s) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ');
// Polls: a lazy route first shows the "Loading your dashboard" splash.
const expectTexts = async (page, texts) => {
  for (const text of texts) {
    await expect
      .poll(async () => norm(await page.locator('body').innerText()), {
        message: `"${text}" is on the page`,
        timeout: 45_000,
      })
      .toContain(norm(text));
  }
};
// API 401s come from the signed-out recruiter shell in a headless run (no /api stub): not errors of these screens.
const isNoise = (text) =>
  /401|500|Unauthorized|Internal Server Error|UNAVAILABLE|\/api\/|\[api\]|\.api\]|talentHomeState/i.test(
    text
  );
const open = async (page, path) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error' && !isNoise(m.text())) errors.push(m.text());
  });
  await page.addInitScript(() => {
    localStorage.setItem('gth:hide-demo', '1');
    localStorage.setItem('gth:ui-style-chosen', '1');
    localStorage.setItem('gth:ui-style', 'focused');
  });
  await page.goto(path, { waitUntil: 'load' });
  await expect(
    page
      .getByRole('dialog')
      .or(page.getByRole('heading', { level: 1 }))
      .first()
  ).toBeVisible({ timeout: 90_000 });
  return errors;
};

test('wizard · basics (RC-CC02): club copy, drawn draft, name hint', async ({ page }) => {
  const errors = await open(page, `${WIZARD}&step=basics&demo=1`);
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Host a company club' })).toBeVisible();
  await expectTexts(page, [
    'Club name',
    'Name is free. People will find it as #AgritechInnovatorsGhana.',
    'What’s it about?',
    'A real photo of your people works best · JPG or PNG · up to 5 MB',
    'Your draft saves as you go',
    'Next: who can join',
  ]);
  await expect(dialog.getByLabel('Club name', { exact: false }).first()).toHaveValue(
    'Agritech Innovators Ghana'
  );
  expect(errors).toEqual([]);
});

test('wizard · name taken (RC-CC02b): error, existing club, free names, no company names', async ({
  page,
}) => {
  const errors = await open(page, `${WIZARD}&step=basics&state=name-taken`);
  await expectTexts(page, [
    'That name is taken. Pick another name, or join the one that exists.',
    'Data Science Ghana already exists',
    'Try a narrower name, like “Data Science Ghana · Tamale”.',
    'Free names you could use',
    'Women in Data Ghana',
    'No company names',
    'View Data Science Ghana',
  ]);
  await page.getByRole('button', { name: 'Women in Data Ghana' }).click();
  await expect(page.getByRole('dialog').getByRole('textbox').first()).toHaveValue(
    'Women in Data Ghana'
  );
  expect(errors).toEqual([]);
});

test('wizard · who can join (RC-CC03) and house rules (RC-CC04)', async ({ page }) => {
  const errors = await open(page, `${WIZARD}&step=who&demo=1`);
  await expectTexts(page, [
    'Who can join?',
    'Anyone on GTH can find it and join.',
    'Who it’s for',
    'Where are your people?',
    'You can change this later in Settings',
    'Next: house rules',
  ]);
  await page.getByRole('button', { name: 'Next: house rules' }).click();
  await expect(page).toHaveURL(/step=rules/);
  await expectTexts(page, [
    'GTH rules · always on',
    'No paid job ads or pay-to-apply',
    'Your rules · 2 of 5',
    'Share sources for prices and data',
    'Add a rule',
    'Rules show to everyone before they join',
  ]);
  expect(errors).toEqual([]);
});

test('wizard · review (RC-CC05): company-club agreement, submit goes to the recruiter owner page', async ({
  page,
}) => {
  const errors = await open(page, `${WIZARD}&step=review&demo=1`);
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Check and submit' })).toBeVisible();
  await expectTexts(page, [
    'GTH checks new clubs within 24 hours.',
    'I agree to the GTH club guidelines for company clubs. No paid placements, no fees to join, and I’ll act on reports within 48 hours.',
    'Just you so far',
    'Agriculture · All of Ghana',
  ]);
  await dialog.getByRole('button', { name: 'Submit for review' }).click();
  await expect(page).toHaveURL(/\/recruiter\/community\/agritech-innovators-ghana\/manage/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 90_000 });
  await expectTexts(page, ['Under review · usually within 24 hours']);
  expect(errors).toEqual([]);
});

test('wizard · not ready (RC-CC12): company eligibility copy, Not now stays in recruiter community', async ({
  page,
}) => {
  const errors = await open(page, `${WIZARD}&state=not-ready`);
  await expectTexts(page, [
    'Almost ready to start a club',
    'Company-hosted clubs need a verified employer and a named owner. Two more things and you’re set.',
    'Profile at least 60% complete',
    'Yours is 45%. Add your education and one skill.',
    'You can draft a club and invite friends.',
    'Your company can host up to 3 clubs at a time',
  ]);
  await page.getByRole('button', { name: 'Not now' }).click();
  await expect(page).toHaveURL(/\/recruiter\/community$/);
  expect(errors).toEqual([]);
});

test('owner states (RC-CC06, 07, 11, 16b, 17b): banner, sticker and hero actions per status', async ({
  page,
}) => {
  const errors = await open(page, `${OWNER}?state=under-review&rail=collapsed`);
  await expectTexts(page, [
    'Under review · usually within 24 hours',
    'Invite co-moderators',
    'Only you can see this page until it’s live',
    'Draft a welcome post now (e.g. “Welcome to the Silver Rock Design Circle”). It goes out the moment GTH approves your club.',
    'All clubs',
  ]);
  await page.goto(`${OWNER}?state=waiting-mentor&rail=collapsed`);
  await expectTexts(page, [
    'Approved. One step left: a verified mentor',
    'Invite another mentor',
    'Your welcome post is saved and goes out when the club opens.',
  ]);
  await page.goto(`${OWNER}?state=needs-change&rail=collapsed`);
  await expectTexts(page, ['Needs a change before it goes live', 'Ask GTH a question']);
  await page.goto(`${OWNER}?state=transfer-pending&rail=collapsed`);
  await expectTexts(page, ['Waiting for Adjoa to accept ownership', 'Cancel transfer']);
  await page.goto(`${OWNER}?state=archived&rail=collapsed`);
  await expectTexts(page, [
    'Archived on 20 Oct 2026',
    'Restore club',
    'This club is archived',
    'Old posts stay readable. Restore it to let members post again.',
  ]);
  expect(errors).toEqual([]);
});

test('owner live (RC-CC08): toast, owner name, Invite people opens the dialog', async ({
  page,
}) => {
  const errors = await open(page, `${OWNER}?state=live&toast=live&rail=collapsed`);
  await expectTexts(page, ['Agritech Innovators Ghana is live · +100 pts', 'Joel Adade Kofie']);
  await page.getByRole('button', { name: 'Invite people' }).first().click();
  await expect(page.getByRole('dialog', { name: /Invite people to #Agritech/ })).toBeVisible();
  await expect(page).toHaveURL(/modal=invite/);
  expect(errors).toEqual([]);
});

test('dialogs · invite (RC-CC09) and mentor (RC-CC13)', async ({ page }) => {
  const errors = await open(page, `${OWNER}?state=live&modal=invite&rail=collapsed`);
  await expect(page.getByRole('dialog').getByRole('textbox').first()).toHaveValue(
    'gth.gh/c/agritech-innovators'
  );
  await expectTexts(page, [
    'Invite link',
    'People you may know',
    'Talents under 18 only get invites from people they follow, and their parent can see which clubs they join.',
  ]);
  await page.getByRole('button', { name: 'Done' }).click();
  await expect(page).not.toHaveURL(/modal=invite/);
  await page.goto(`${OWNER}?state=waiting-mentor&modal=mentor&rail=collapsed`);
  await expectTexts(page, [
    'Who counts as a verified mentor',
    'Suggested for Agriculture',
    'Only people who meet all three show here',
  ]);
  await page.getByRole('dialog').getByRole('button', { name: 'Invite' }).first().click();
  expect(errors).toEqual([]);
});

test('manage (RC-CC10, 14, 15): reports, requests and settings tabs', async ({ page }) => {
  const errors = await open(page, `${OWNER}?state=live&modal=manage&tab=reports&rail=collapsed`);
  const dialog = page.getByRole('dialog');
  await expectTexts(page, [
    'Spam or scam',
    'Reported by 3 members · 1 h ago',
    'Joel Adade Kofie · Owner',
    'Adjoa Boateng · Verified teacher',
    'Owners act on reports within 48 hours',
  ]);
  await dialog.getByRole('button', { name: 'Keep post' }).click();
  await expect(dialog.getByText('No open reports')).toBeVisible();
  await page.goto(`${OWNER}?state=live&modal=manage&tab=requests&requests=3&rail=collapsed`);
  await expectTexts(page, [
    '3 people want to join',
    'Kojo Serwaa · 14–17',
    'Only for “Request to join” clubs',
  ]);
  await page.getByRole('button', { name: 'Approve all' }).click();
  // With no request left the Requests tab is no longer listed (the dialog falls back to Reports).
  await expect(page.getByRole('dialog').getByRole('tab', { name: /^Requests/ })).toHaveCount(0);
  await page.goto(`${OWNER}?state=live&modal=manage&tab=settings&requests=3&rail=collapsed`);
  await expectTexts(page, [
    'Archive club',
    'Make it read-only and hide it from search. Restore within 90 days.',
    'Only the owner sees Settings',
  ]);
  expect(errors).toEqual([]);
});

test('transfer (RC-CC16) and archive (RC-CC17): club copy, both end in the drawn state', async ({
  page,
}) => {
  const errors = await open(page, `${OWNER}?state=live&modal=transfer&rail=collapsed`);
  await expectTexts(page, [
    'Who should own it?',
    'Because the club is open to ages 14 and up.',
    'I understand I can’t undo this once Adjoa accepts.',
  ]);
  await page.getByRole('button', { name: 'Send transfer request' }).click();
  await expect(page).toHaveURL(/state=transfer-pending/);
  await expectTexts(page, ['Waiting for Adjoa to accept ownership']);
  await page.goto(`${OWNER}?state=live&modal=archive&rail=collapsed`);
  await expectTexts(page, [
    'Archive #Agritech Innovators Ghana?',
    'I understand members will lose the ability to post.',
    'Thinking of leaving? Transfer it instead',
  ]);
  await page.getByText('I understand members will lose the ability to post.').click();
  await page.getByRole('dialog').getByRole('button', { name: 'Archive club' }).click();
  await expect(page).toHaveURL(/state=archived/);
  await expectTexts(page, ['Restore club']);
  expect(errors).toEqual([]);
});

test('talent create wizard is unchanged (/community/create keeps community copy and links)', async ({
  page,
}) => {
  await open(page, '/community/create?cat=software-engineering&step=basics&demo=1');
  await expect(
    page.getByRole('dialog').getByRole('heading', { name: 'Start a community' })
  ).toBeVisible();
  await expectTexts(page, ['Community name']);
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page).toHaveURL(/\/community(\?|$)/);
});
