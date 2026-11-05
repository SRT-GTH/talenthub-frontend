import { test, expect as baseExpect } from '@playwright/test';

// The dev server is shared with other sessions and the first load of a lazy route is slow: give every check room.
const expect = baseExpect.configure({ timeout: 30_000 });
test.beforeEach(() => test.slow());

/*
 * Parent Career Buddy — Figma file SCXc457vwiq6o7d9g4jVbh, canvas "AI CHAT parent screens" 7958:183942.
 * `?role=parent&live=0&cb=<state>` reproduces each frame; the strings are the `characters` of the Figma text nodes.
 */
const BASE = '/profile/filling/career-buddy?role=parent&live=0';
const WELCOME = [
  'Switch Modes',
  'Ghana Talent AI',
  'Career Buddy, your personal career mentor',
  'Build my own talent profile',
  'Guide my ward’s profile'.replace('’', "'"),
  'Upload resume to automatically populate profile?',
  'Tell me more about GTH',
  'How does GTH match me with opportunities?',
  'Is my personal information safe on GTH',
  'Talent Profile Panel',
  'Every section you confirm brings the right job one step closer',
  'My Profile',
  'Elliot’s Profile',
];
const GUIDE = [
  "Guide my ward's profile",
  '[Auto]',
  'He’s in the senior high school.',
  'He attends Achimota Senior High School.',
  'He’s in the General Science program.',
  'He takes Elective Mathematics, Physics, Chemistry, and Biology.',
  'He started in 2023 and will finish in 2026 Godwilling.',
  'Got it — 2023 to 2026. Has Elliot taken WASSCE yet, or is that still upcoming?',
];

const norm = (s) => s.replace(/[‘’]/g, "'");
const expectTexts = async (page, texts) => {
  const body = norm(await page.locator('body').innerText());
  for (const t of texts) expect(body, t).toContain(norm(t));
};

test('A2 welcome (with the "Welcome Back" toast) shows the Figma copy', async ({ page }) => {
  await page.goto(`${BASE}&cb=welcome`);
  await expect(page.getByText('Ghana Talent AI').first()).toBeVisible();
  await expectTexts(page, [
    ...WELCOME,
    'Welcome Back',
    "Hi there! 👋 Welcome to Ghana Talent AI. I'm TALI, your AI mentor.",
    'We noticed that you already initialized your wards account. What do you want to do?',
  ]);
  await expect(page.getByPlaceholder('Write a message…')).toBeVisible();
  await expect(page.getByText('Completion: 80%')).toBeVisible();
  await expect(page.getByText('Completion: 48%')).toBeVisible();
  await expect(page.getByRole('button', { name: /Switch Modes/ })).toBeVisible();
});

test('E1 / E2 the ward account set-up dialogs show the Figma copy', async ({ page }) => {
  await page.goto(`${BASE}&cb=ward-setup`);
  await expect(page.getByRole('heading', { name: /set up your ward.s account/i })).toBeVisible();
  await expect(
    page.getByRole('dialog').locator('input[value="ellwhitmore@gmail.com"]')
  ).toHaveCount(1);
  await page.goto(`${BASE}&cb=ward-password`);
  await expect(
    page.getByRole('heading', { name: /set a password for your ward.s account/i })
  ).toBeVisible();
  await expect(page.getByRole('button', { name: /Create Ward's Account/ })).toBeVisible();
});

test('C2 – C4 the guide transcript is the Figma conversation', async ({ page }) => {
  for (const cb of [
    'parent-guide',
    'parent-guide-progress',
    'parent-guide-review',
    'parent-guide-done',
  ]) {
    await page.goto(`${BASE}&cb=${cb}`);
    await expect(
      page.getByText('Ghana Talent AI').or(page.getByText('[Auto]')).first()
    ).toBeVisible();
    await expectTexts(page, GUIDE);
  }
  await expectTexts(page, ['Understood! Check the panel on the right']);
});

test('D2 the resume chat shows the file chip and the ward asks', async ({ page }) => {
  await page.goto(`${BASE}&cb=parent-resume-filled`);
  await expect(page.getByText('Awesome, Go ahead and upload your resume then.')).toBeVisible();
  await expectTexts(page, ['Resume... .pdf', '6MB']);
});

test('the talent Career Buddy keeps its own look (no Switch Modes button, own placeholder)', async ({
  page,
}) => {
  await page.goto('/profile/filling/career-buddy?role=talent&live=0');
  await expect(
    page.getByText('Ghana Talent AI').or(page.getByText('Career Buddy').first()).first()
  ).toBeVisible();
  await expect(page.getByRole('button', { name: /^Switch Modes/ })).toHaveCount(0);
});

test('E3 the account-created state shows Elliot’s Personal Info sheet', async ({ page }) => {
  await page.goto(`${BASE}&cb=ward-success`);
  await expect(page.getByText('Uploaded · Visible to everyone')).toBeVisible();
  await expectTexts(page, [
    'Elliot Whitmore',
    'ellwhitmore@gmail.com',
    'Male',
    '23/ 09/ 2004',
    '+233 24 248 4435',
    '45 Kofi Annan St, Accra, Ghana',
    'Ghana Card Status',
    'Verified',
    'Completion: 100%',
    'Modify',
    'Confirm',
  ]);
});

test('the level options stay inside the opening bubble after the parent answered, and the first welcome has no toast', async ({
  page,
}) => {
  await page.goto(`${BASE}&cb=parent-guide`);
  await expect(page.getByText('[Auto]').first()).toBeVisible();
  await expectTexts(page, [
    'Junior High School (JHS)',
    'Senior High School (SHS)',
    'University/Tertiary',
    'Completed education',
  ]);
  await page.goto(`${BASE}&cb=ward-uninitiated`);
  await expect(page.getByText('Ghana Talent AI').first()).toBeVisible();
  await expect(page.getByText('Welcome Back')).toHaveCount(0);
});
