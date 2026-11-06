import { test, expect as baseExpect } from '@playwright/test';

// The dev server is shared with other sessions and the first load of a lazy route is slow: give every check room.
const expect = baseExpect.configure({ timeout: 30_000 });
test.beforeEach(() => test.slow());

/*
 * Recruiter Community · My network — Figma file OHG2xsfCCskT8xEn356njv, canvas "Recruiter - Community Engagement" 10026:36840,
 * frames RC-NW01 … RC-NW11 (wiki/recruiter-community-network.md). The same pages as the talent My circle serve both audiences:
 * `/recruiter/community?view=circle…` and `/recruiter/community/people/:id…` are the recruiter. Strings are Figma `characters`.
 */
const B = '/recruiter/community';

const norm = (s) => s.replace(/[‘’]/g, "'").replace(/\s+/g, ' ');
const expectTexts = async (page, texts) => {
  const body = norm(await page.locator('body').innerText());
  for (const text of texts) expect(body, `"${text}" is on the page`).toContain(norm(text));
};
const toastText = (page, text) => page.getByRole('status').getByText(text);
const IGNORED = /\[api\]|\[talentHome\.api\]|status code|Failed to load resource|favicon/;
// Cold lazy routes show a loader first (body text ~40 characters): reload once if the page's h1 is still missing.
const settle = async (page) => {
  const h1 = page.locator('h1').first();
  if (!(await h1.isVisible({ timeout: 25_000 }).catch(() => false)))
    await page.reload().catch(() => page.goto(page.url()));
  await expect(h1).toBeVisible({ timeout: 60_000 });
};
const go = async (page, url) => {
  await page.goto(url, { waitUntil: 'load' });
  await settle(page);
};
const open = async (page, url) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error' && !IGNORED.test(m.text())) errors.push(m.text());
  });
  await page.addInitScript(() => {
    localStorage.setItem('gth:hide-demo', '1');
    localStorage.setItem('gth:ui-style-chosen', '1');
    localStorage.setItem('gth:ui-style', 'focused');
  });
  await go(page, url);
  return errors;
};

test('RC-NW01 discover: Clubs | My network switch, invitations preview, six people, right rail', async ({
  page,
}) => {
  const errors = await open(page, `${B}?view=circle&rail=collapsed`);
  await expect(page.getByRole('heading', { level: 1, name: 'Your network' })).toBeVisible();
  await expectTexts(page, [
    'Clubs',
    'My network',
    'Recruiters, hiring managers and mentors you work with. Talent follow your company page instead.',
    'Discover',
    'Invitations · 3',
    'Network · 128',
    'Following · 46',
    'See all 3',
    '“Hi Joel, I saw your portfolio review event in UX & Product Design Ghana. Would be great to swap notes on hiring juniors.”',
    'People to link up with',
    'Based on your clubs, industry and open roles',
    'Abena Owusu',
    'Kwame Boateng',
    'Verified mentor',
    'You both build dashboards with Python.',
    'Tip from Hiring Assistant',
    'Recruiters who host events and answer questions get 3× more replies to invites.',
    '2 of 4 done · +20 pts each',
    'Add your company page',
    'Link up with 5 people',
    'Mentors and hiring partners',
    'Mentor · Data Science Ghana',
  ]);
  await expect(page.getByPlaceholder('Search recruiters, mentors and companies')).toBeVisible();
  // The talent copy never leaks into the recruiter screen.
  const body = await page.locator('body').innerText();
  expect(body).not.toContain('Your circle');
  expect(body).not.toContain('Tip from Buddy');
  expect(errors).toEqual([]);
});

test('RC-NW02/03 link up: add a note, send, the card turns into "Link-up sent" with Undo', async ({
  page,
}) => {
  const errors = await open(page, `${B}?view=circle&rail=collapsed`);
  await page.getByRole('button', { name: 'Link up' }).first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Why link up with Abena?' })).toBeVisible();
  await dialog.getByRole('button', { name: 'Help me write it' }).click();
  await expect(dialog.getByRole('textbox')).toHaveValue(
    'Hi Abena, we both recruit in Data Science Ghana. Would you like to co-host a CV clinic next month?'
  );
  await dialog.getByRole('button', { name: 'Send link-up' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(toastText(page, 'Link-up sent to Abena')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Link-up sent' })).toBeVisible();
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page.getByRole('button', { name: 'Link-up sent' })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('RC-NW02 / RC-NW03 frames by URL: the drawn note and the sent state', async ({ page }) => {
  await open(page, `${B}?view=circle&modal=connect&person=abena-owusu&draft=1&rail=collapsed`);
  await expectTexts(page, ['Why link up with Abena?', 'Data analyst intern · mPharma · 12 mutual']);
  await expect(page.getByRole('dialog').getByRole('textbox')).toHaveValue(
    'Hi Abena, we both recruit in Data Science Ghana. Would you like to co-host a CV clinic next month?'
  );
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await go(page, `${B}?view=circle&state=sent&rail=collapsed`);
  await expect(toastText(page, 'Link-up sent to Abena')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Link-up sent' })).toBeVisible();
});

test('RC-NW04 invitations: Received / Sent, Say hi for Nana Yaw, accept Esi', async ({ page }) => {
  const errors = await open(page, `${B}?view=circle&tab=invitations&state=accepted&rail=collapsed`);
  await expectTexts(page, [
    'Received · 3',
    'Sent · 2',
    'Manage',
    'Nana Yaw is now in your network',
    'In your network',
    'Say hi',
    '“Happy to share our interview scorecards.”',
    'Requests you ignore aren’t shown to the sender. They expire after 3 months.',
    '15 in your network know them · 1 week ago',
  ]);
  await page.getByRole('button', { name: 'Accept' }).first().click();
  await expect(toastText(page, 'Esi is now in your network')).toBeVisible();
  await page.getByRole('button', { name: 'Sent · 2' }).click();
  await expect(page.getByText('Akosua Mensah')).toBeVisible();
  expect(errors).toEqual([]);
});

test('RC-NW05 connections: "Linked up" rows, the … menu (Esc closes), Remove from network', async ({
  page,
}) => {
  const errors = await open(page, `${B}?view=circle&tab=circle&menu=yaw-darko&rail=collapsed`);
  await expectTexts(page, [
    '128 people in your network',
    'Recently added',
    'Region',
    'Skills',
    'Clubs',
    'Linked up 2 days ago',
    'Linked up 1 month ago',
    'View profile',
    'Mute their posts',
    'Remove from network',
    'Report',
  ]);
  await expect(page.getByRole('menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await page.getByRole('button', { name: 'More for Esi Quaye' }).click();
  await page.getByRole('menuitem', { name: 'Remove from network' }).click();
  await expect(toastText(page, 'Esi was removed from your network')).toBeVisible();
  expect(errors).toEqual([]);
});

test('RC-NW06 talent profile (connected): Invite to apply, no Endorse, recommendation is blocked and explained', async ({
  page,
}) => {
  const errors = await open(page, `${B}/people/yaw-darko?rail=collapsed`);
  await expect(page.getByRole('heading', { level: 1, name: 'Yaw Darko' })).toBeVisible();
  await expectTexts(page, [
    '1st',
    'UX design student at Ashesi · Product design, user research',
    '8 in your network know them · Abena, Efua and 6 others',
    '214 in their network',
    'In your network',
    'Endorse skills you have seen Yaw use',
    'Verified · Skills Lab',
    '12 endorsements · including Kwame Boateng (mentor)',
    'You have in common',
    'You both know · 8',
    'See all 8',
    'Verified mentor · Hubtel',
    'Write a recommendation',
  ]);
  await expect(page.getByRole('button', { name: /^Invite to apply:/ })).toHaveCount(4);
  await expect(
    page.getByRole('button', {
      name: /^Endorse (Figma|User research|Prototyping|Design thinking)$/,
    })
  ).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Follow' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Write a recommendation' }).click();
  const dialog = page.getByRole('dialog', { name: 'Recruiters can’t write recommendations' });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByText(
      'Recommendations come from people who worked or studied with Yaw. It keeps them honest for every employer.'
    )
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('RC-NW06b not connected (2nd): Link up · Follow · Message and the locked note', async ({
  page,
}) => {
  const errors = await open(page, `${B}/people/yaw-darko?state=not-connected&rail=collapsed`);
  await expectTexts(page, ['2nd', 'Link up with Yaw to endorse their skills']);
  await expect(page.getByRole('button', { name: 'Link up' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Follow' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Message', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Link up' }).click();
  await expect(
    page.getByRole('dialog').getByRole('heading', { name: 'Why link up with Yaw?' })
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test('RC-NW07 / RC-NW08 recruiter alternatives: the explanation, Save to list, Invite to apply', async ({
  page,
}) => {
  const errors = await open(page, `${B}/people/yaw-darko?modal=endorse&rail=collapsed`);
  const dialog = page.getByRole('dialog', { name: 'Recruiters can’t endorse skills' });
  await expect(dialog).toBeVisible();
  await expectTexts(page, [
    'Endorsements come from classmates, teammates and verified mentors so talent and employers can trust them.',
    'What you can do instead',
    'Invite Yaw to apply to a live role, save them to a list, or add a private note for your team.',
  ]);
  await dialog.getByRole('button', { name: 'Save to list' }).click();
  await expect(toastText(page, 'Yaw saved to your list')).toBeVisible();
  await go(page, `${B}/people/yaw-darko?modal=recommend&rail=collapsed`);
  await expect(
    page.getByRole('dialog', { name: 'Recruiters can’t write recommendations' })
  ).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: 'Invite to apply' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(toastText(page, 'Choose a live role to invite Yaw to apply')).toBeVisible();
  expect(errors).toEqual([]);
});

test('RC-NW09 feed "From your network": wins, update, mentor post, like toggles', async ({
  page,
}) => {
  const errors = await open(page, `${B}?view=circle&tab=feed&rail=collapsed`);
  await expect(page.getByRole('heading', { level: 1, name: 'From your network' })).toBeVisible();
  await expectTexts(page, [
    'Hiring news and events from recruiters and mentors in your network.',
    'Abena got verified in Python',
    'Passed the Skills Lab assessment · Top 15% this month',
    'Congratulate',
    'Yaw Darko started a UX design internship at Hubtel',
    'Say congrats',
    'Three questions I ask every junior PM candidate.',
    'Tip from Hiring Assistant',
  ]);
  await page.getByRole('button', { name: 'Say congrats' }).click();
  await expect(toastText(page, 'You congratulated Yaw')).toBeVisible();
  expect(errors).toEqual([]);
});

test('RC-NW10 under-18 talent: hidden from recruiters, explained, nothing to link up with as a recruiter', async ({
  page,
}) => {
  const errors = await open(page, `${B}?view=circle&state=minor&rail=collapsed`);
  await expectTexts(page, [
    'Hidden from recruiters',
    'Recruiters can’t see, connect with or message talent under 18. This view is what talent see.',
    'Invitations · 1',
    'Network · 9',
    'Following · 2',
    'Classmates you may know',
    'From Achimota School and your clubs',
    'Kwesi Ofori',
    'Ama Kumi',
    'In your SQL study group.',
    'Verified mentors to follow',
    'Checked by GTH: Ghana Card, safeguarding course and references',
    'Under-18 talent are hidden from recruiter networking.',
    'Classmates on GTH',
    'Shared with your parent',
    'This view is what a 15-year-old talent sees. Recruiters can’t see, connect with or message under-18 talent.',
    '1 of 4 done · +20 pts each',
    'Follow 1 hiring partner',
  ]);
  expect(errors).toEqual([]);
});

test('RC-NW11 empty (new talent): Start your network, three ways in, four people, Join a club goes to Clubs', async ({
  page,
}) => {
  const errors = await open(page, `${B}?view=circle&state=empty&rail=collapsed`);
  await expectTexts(page, [
    'Start your network',
    'Connect with other recruiters, hiring managers and mentors. Talent can follow your company page.',
    'Find classmates',
    'Add your company page to see people from it',
    'Join a club',
    'Meet people who share your interests',
    'Invite a friend',
    'Share your GTH link on WhatsApp',
    'People to link up with',
    'A few people to start with',
    'Network · 0',
    'Following · 0',
    '0 of 4 done · +20 pts each',
    'Start with 3 people you already know. Classmates say yes most often.',
  ]);
  await page.getByRole('button', { name: /Join a club/ }).click();
  await expect(page).toHaveURL(/\/recruiter\/community$/);
  expect(errors).toEqual([]);
});

test('talent screens are unchanged: My circle and Yaw Darko still draw the talent copy', async ({
  page,
}) => {
  const errors = await open(page, '/community?view=circle&state=sent&rail=collapsed');
  await expectTexts(page, ['Your circle', 'Tip from Buddy', 'Communities', 'My circle']);
  await go(page, '/community/people/yaw-darko?rail=collapsed');
  await expect(page.getByRole('heading', { level: 1, name: 'Yaw Darko' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Endorse Figma' })).toBeVisible();
  expect(errors).toEqual([]);
});
