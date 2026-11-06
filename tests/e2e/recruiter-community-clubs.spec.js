import { test, expect as baseExpect } from '@playwright/test';

// The dev server is shared with other sessions and the first load of a lazy route is slow: give every check room.
const expect = baseExpect.configure({ timeout: 30_000 });
test.beforeEach(() => test.slow());
// Other sessions edit files under the shared dev server (HMR full reloads): one retry absorbs that.
test.describe.configure({ retries: 1 });

/*
 * Recruiter Community · Clubs — Figma file OHG2xsfCCskT8xEn356njv, canvas 10026:36840, section "RECRUITER · COMMUNITY · Clubs"
 * (RC-C01 … RC-C17). The same pages as the talent Community served at `/recruiter/community…` with recruiter copy
 * (wiki/recruiter-community-clubs.md). Strings are the `characters` of the Figma text nodes.
 */
const BASE = '/recruiter/community';
const CLUB = `${BASE}/frontend-devs-ghana`;

const norm = (s) => s.replace(/[‘’]/g, "'").replace(/\s+/g, ' ');
const expectTexts = async (page, texts) => {
  const body = norm(await page.locator('body').innerText());
  for (const text of texts) expect(body, `"${text}" is on the page`).toContain(norm(text));
};
// Some counters are drawn with CSS generated content (data-count): read those too.
const expectCounts = async (page, counts) => {
  for (const count of counts)
    await expect(page.locator(`[data-count="${count}"]`).first()).toBeAttached();
};

const open = async (page, url, ready) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  // The dashboard shell polls the (unauthenticated here) API: 401s are not Community errors.
  page.on('console', (m) => {
    if (
      m.type() === 'error' &&
      !/Failed to load resource|\[api\]|dynamically imported module|talentHome\.api/.test(m.text())
    )
      errors.push(m.text());
  });
  await page.addInitScript(() => {
    localStorage.setItem('gth:hide-demo', '1');
    localStorage.setItem('gth:ui-style-chosen', '1');
    localStorage.setItem('gth:ui-style', 'focused');
  });
  await page.goto(url, { waitUntil: 'load' });
  // includeHidden: with a dialog open the page behind it is aria-hidden.
  await expect(
    page.getByRole('heading', { level: 1, name: ready, includeHidden: true })
  ).toBeAttached();
  return errors;
};

test('RC-C01 browse: hire-focused header, Host a company club, open-role picks', async ({
  page,
}) => {
  const errors = await open(page, BASE, 'Find your future hires');
  await expectTexts(page, [
    '10 clubs',
    'Join clubs where talent with the skills you hire for are active. Share roles, host events and answer questions.',
    'Picked for your open roles',
    'Based on your open roles: Senior UX Designer, Product Designer',
    'Fits your open roles',
    "You're in",
    'Top match for you',
    'Event this week',
    'Software Engineering Ghana',
    'First-Gen Scholars',
  ]);
  await expect(page.getByPlaceholder('Search clubs…')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Host a company club' }).first()).toHaveAttribute(
    'href',
    `${BASE}/create`
  );
  // A card opens its club inside the recruiter tree, not the talent one.
  await expect(page.getByRole('link', { name: 'Frontend Devs Ghana' })).toHaveAttribute(
    'href',
    `${BASE}/frontend-devs-ghana`
  );
  expect(errors).toEqual([]);
});

test('RC-C02 filtered by Software engineering, Joined menu open with club copy', async ({
  page,
}) => {
  const errors = await open(
    page,
    `${BASE}?menu=joined&cat=software-engineering`,
    'Find your future hires'
  );
  await expectTexts(page, ['Showing 3 clubs in', 'Software engineering', '· Clear']);
  const menu = page.getByRole('menu');
  await expect(menu.getByRole('menuitem', { name: 'Open club' })).toBeVisible();
  await expect(menu.getByRole('menuitem', { name: 'Mute notifications' })).toBeVisible();
  await expect(menu.getByRole('menuitem', { name: 'Leave club' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await page.getByRole('button', { name: '· Clear' }).click();
  await expect(page).not.toHaveURL(/cat=/);
  expect(errors).toEqual([]);
});

test('RC-C03 all clubs: Clubs you recruit in + the Host a company club tile', async ({ page }) => {
  const errors = await open(page, `${BASE}?view=all`, 'Find your future hires');
  await expectTexts(page, [
    'Clubs you recruit in',
    '1 joined',
    'All clubs',
    'Bring people together around a skill, a place or a cause. GTH checks it within 24 hours.',
    'or request one: 25 asks opens it',
    'Trades & Vocational Skills',
    'Young Founders Hub',
  ]);
  await expect(page.getByRole('link', { name: 'Host a company club' }).last()).toHaveAttribute(
    'href',
    `${BASE}/create`
  );
  expect(errors).toEqual([]);
});

test('RC-C04 preview: Join club joins inside the recruiter tree and greets with the house rules', async ({
  page,
}) => {
  const errors = await open(page, CLUB, '#Frontend Devs Ghana');
  await expectTexts(page, [
    'All clubs',
    'Software · Public',
    '1,240 members',
    '2 events this month',
    'Michael, Abigail + 3 people you know',
    "You're previewing this club",
    'Join to post, react, comment and see member-only resources.',
    'About this club',
    'Related clubs',
    'Trending this week',
    'Case study',
  ]);
  await expect(page.getByRole('link', { name: 'All clubs' })).toHaveAttribute('href', BASE);
  await page.getByRole('button', { name: 'Join club' }).click();
  await expect(page).toHaveURL(new RegExp(`${CLUB}\\?.*joined=1`));
  await expect(page).toHaveURL(/welcome=1/);
  await expectTexts(page, [
    'Before you post: 3 house rules',
    "You're in! Say hi to 1,239 frontend devs",
    '+10 pts',
    'You + 1,239 others',
  ]);
  await expect(page.getByRole('button', { name: 'Share club' })).toBeVisible();
  await page.getByRole('button', { name: 'Got it' }).click();
  await expect(page).not.toHaveURL(/welcome=1/);
  expect(errors).toEqual([]);
});

test('RC-C06 feed: Hiring filter, role / update / event composer, Case study posts', async ({
  page,
}) => {
  const errors = await open(page, `${CLUB}?joined=1`, '#Frontend Devs Ghana');
  await expectTexts(page, [
    'Share a role, a hiring update or an event…',
    'Event',
    'Share a role',
    'Hiring update',
    'Samuel Boateng',
    'Yaa Asantewaa',
    'Case study',
    'Newest',
  ]);
  for (const chip of ['All', 'Hiring', 'Updates', 'Questions', 'Resources']) {
    await expect(page.getByRole('button', { name: chip, exact: true })).toBeVisible();
  }
  // "Hiring" is a real filter: neither drawn post is a hiring post, so the feed shows its empty card.
  await page.getByRole('button', { name: 'Hiring', exact: true }).click();
  await expect(page.getByText('No posts yet. Be the first!')).toBeVisible();
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.getByText('Samuel Boateng')).toBeVisible();
  expect(errors).toEqual([]);
});

test('RC-C07 post + comments: the open post, its thread and a new comment as the recruiter', async ({
  page,
}) => {
  const errors = await open(page, `${CLUB}/post/yaa-first-pr`, '#Frontend Devs Ghana');
  await expectTexts(page, [
    'Yaa Asantewaa',
    'Well done Yaa! First of many.',
    'Congrats sis. What stack is the team on?',
    'View 4 replies',
    'View 10 more comments',
  ]);
  await expect(page.getByLabel('Congrats Yaa! What was the PR about?')).toHaveValue(
    'Congrats Yaa! What was the PR about?'
  );
  await page.getByRole('button', { name: 'Post', exact: true }).click();
  await expect(page.getByText('Joel Adade Kofie').last()).toBeVisible();
  expect(errors).toEqual([]);
});

test('RC-C08 / C10 / C17 dialogs: Case study kind, report copy, leave club', async ({ page }) => {
  let errors = await open(page, `${CLUB}?joined=1&modal=create`, '#Frontend Devs Ghana');
  const create = page.getByRole('dialog');
  await expect(create.getByText('Create a post')).toBeVisible();
  await expectTexts(page, [
    'Update',
    'Case study',
    'Question',
    'Resource',
    'silverrock.tech/careers',
    'Your first 2 posts are checked by a moderator',
  ]);
  await page.keyboard.press('Escape');
  await expect(create).toBeHidden();
  expect(errors).toEqual([]);

  errors = await open(page, `${CLUB}?joined=1&modal=report`, '#Frontend Devs Ghana');
  await expect(page.getByRole('dialog').getByText('Report this post')).toBeVisible();
  await expect(page.getByRole('radio', { name: /Not safe for a career club/ })).toBeVisible();
  await expectTexts(page, [
    'Help us keep #Frontend Devs Ghana safe. Reports are anonymous.',
    'Samuel won’t know who reported',
  ]);

  errors = await open(page, `${CLUB}?joined=1&modal=leave`, '#Frontend Devs Ghana');
  await expectTexts(page, [
    'Leave #Frontend Devs Ghana?',
    'You’ll stop seeing posts and event invites from this club',
    'Just too many notifications? Mute it instead.',
  ]);
  await page.getByRole('button', { name: 'Leave club' }).click();
  await expect(page).not.toHaveURL(/joined=1/);
  await expect(page.getByRole('button', { name: 'Join club' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('RC-C11 / C12 About and Members: club rules, Link up, In your network', async ({ page }) => {
  let errors = await open(page, `${CLUB}?joined=1&tab=about`, '#Frontend Devs Ghana');
  await expectTexts(page, [
    'What this club is for',
    'Frontend, careers and learning. Recruiters may share roles with the “Hiring” tag only.',
    'Recruiters: share roles with the “Share a role” post type. Up to 2 hiring posts per week, and roles must show pay or say “unpaid”.',
    'GTH Club Team',
    'English · Twi welcome',
  ]);
  expect(errors).toEqual([]);

  errors = await open(page, `${CLUB}?joined=1&tab=members`, '#Frontend Devs Ghana');
  await expectTexts(page, [
    'Link up',
    'In your network',
    'HR Lead · Silver Rock Technology',
    'Show more members',
  ]);
  await expect(page.getByPlaceholder('Search 1,240 members')).toBeVisible();
  // One button reads "Follow" in the Figma frame and turns into "In your network" on click.
  await page.getByRole('button', { name: 'Follow', exact: true }).click();
  await expect(page.getByRole('button', { name: 'In your network' })).toHaveCount(2);
  expect(errors).toEqual([]);
});

test('RC-C13 / C14 pending review and empty feed', async ({ page }) => {
  let errors = await open(page, `${CLUB}?joined=1&pending=1`, '#Frontend Devs Ghana');
  await expectTexts(page, [
    'Posted! It’ll go live after a quick check',
    'Only you can see this for now. A moderator usually checks new members’ posts within an hour.',
    'Joel Adade Kofie',
    'Edit',
  ]);
  expect(errors).toEqual([]);

  errors = await open(
    page,
    `${BASE}/agritech-innovators-ghana?joined=1&state=empty`,
    '#Agritech Innovators Ghana'
  );
  await expectTexts(page, [
    'You + 23 others',
    'No posts yet. Be the first!',
    'The first post sets the tone. Founding members who post this week get a Founding Voice badge.',
    'Write the first post',
  ]);
  expect(errors).toEqual([]);
});

test('RC-C15 loading and RC-C16 no results: Start it yourself / Request this club', async ({
  page,
}) => {
  let errors = await open(page, `${BASE}?state=loading`, 'Find your future hires');
  await expect(page.getByText('Finding clubs that fit your open roles…')).toBeVisible();
  await expect(page.getByLabel('Loading clubs')).toHaveAttribute('aria-busy', 'true');
  expect(errors).toEqual([]);

  errors = await open(page, `${BASE}?q=blockchain`, 'Find your future hires');
  await expectTexts(page, [
    'No club for “blockchain” yet',
    'Start it yourself and become its first moderator, or ask GTH to open it. When 25 people ask, we open it.',
    '14 of 25 people have asked',
    'Closest clubs',
    'Young Founders Hub',
  ]);
  await expect(page.getByRole('link', { name: 'Start it yourself' })).toHaveAttribute(
    'href',
    `${BASE}/create`
  );
  await expect(page.getByRole('button', { name: 'Clear search' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Request this club' }).click();
  await expect(page.getByText('15 of 25 people have asked')).toBeVisible();
  expect(errors).toEqual([]);
});

test('RC-C09 milestone share: verified-employer copy, Esc closes', async ({ page }) => {
  const errors = await open(page, `${BASE}?modal=milestone`, 'Find your future hires');
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText('Milestone unlocked!')).toBeVisible();
  await expectTexts(page, [
    '+50 pts',
    'Your company is verified. Tell your clubs you’re hiring? Recruiter posts with a role get 3× more views.',
    'A club',
    'Joel Adade Kofie',
    'Silver Rock Technology is now a verified employer',
    'No thanks, keep it private',
  ]);
  await expect(dialog.getByRole('textbox')).toHaveValue(
    'Silver Rock Technology is now a verified employer on GTH. We’re hiring designers and engineers in Accra this quarter. Ask me anything!'
  );
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  expect(errors).toEqual([]);
});

test('talent Community is unchanged: same pages, talent copy and links', async ({ page }) => {
  const errors = await open(page, '/community?demo=1', 'Find your people');
  await expectTexts(page, ['10 communities', 'Picked for you', 'Based on your skills']);
  await expect(page.getByRole('link', { name: 'Frontend Devs Ghana' })).toHaveAttribute(
    'href',
    '/community/frontend-devs-ghana'
  );
  await open(page, '/community/frontend-devs-ghana?joined=1&demo=1', '#Frontend Devs Ghana');
  await expectTexts(page, ['Invite friends', 'About this community', 'Achievement']);
  await expectCounts(page, ['1,240']);
  expect(errors).toEqual([]);
});
