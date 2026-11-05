import { test, expect as baseExpect } from '@playwright/test';

// The dev server is shared with other sessions and the first load of a lazy route is slow: give every check room.
const expect = baseExpect.configure({ timeout: 30_000 });
test.beforeEach(() => test.slow());

/*
 * Recruiter Career Buddy — Figma file OHG2xsfCCskT8xEn356njv, canvas "Recruiter - AI Chat" 7958:160771.
 * `?role=recruiter&live=0&cb=<state>` reproduces each frame (wiki/recruiter-ai-chat.md); the strings are the `characters` of the Figma text nodes.
 */
const BASE = '/profile/filling/career-buddy?role=recruiter&live=0';

const norm = (s) => s.replace(/[‘’]/g, "'").replace(/\s+/g, ' ');
const expectTexts = async (page, texts) => {
  const body = norm(await page.locator('body').innerText());
  for (const text of texts) expect(body, `"${text}" is on the page`).toContain(norm(text));
};
const open = async (page, cb, extra = '') => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.addInitScript(() => {
    localStorage.setItem('gth:hide-demo', '1');
    localStorage.setItem('gth:ui-style-chosen', '1');
    localStorage.setItem('gth:ui-style', 'focused');
  });
  await page.goto(`${BASE}&cb=${cb}${extra}`, { waitUntil: 'load' });
  // Below lg only one pane shows: the panel heading on desktop, the composer on a phone.
  await expect(
    page.getByRole('heading', { name: 'Recruiter Panel' }).or(page.getByRole('textbox')).first()
  ).toBeVisible();
  return errors;
};

test('landing: hero, three setup chips under the bubble, three FAQ chips, talent trail', async ({
  page,
}) => {
  const errors = await open(page, 'landing');
  await expectTexts(page, [
    'Switch Modes',
    'Ghana Talent AI',
    '— AI-powered talent guidance and mentorship hub.',
    'Your lifelong digital mentor — from SHS to career success',
    'Career Buddy, your personal recruitment assistant',
    'Post Your First Job',
    'Complete Company Profile',
    'Upload KYB/KYC Documents (Optional) - Build trust with a verified badge',
    'Tell me more about GTH',
    'How does GTH match me with competent employees?',
    'Is my personal information safe on GTH',
    'Everything you need to manage your hiring, in one panel.',
    'Company Info.',
    'Completion: 80%',
    'Personal Info',
    'Pitch',
  ]);
  await expect(page.getByPlaceholder('Write a message…')).toBeVisible();
  expect(errors).toEqual([]);
});

test('welcome toast greets the recruiter on one line', async ({ page }) => {
  await open(page, 'welcome');
  await expect(page.getByRole('status').getByText('Welcome Back,')).toBeVisible();
  await expect(page.getByRole('status').getByText('Mr.Whitmore')).toBeVisible();
});

test('company profile: the whole Q&A, then the panel in view and edit mode', async ({ page }) => {
  await open(page, 'company-review');
  await expectTexts(page, [
    'Congratulations! Your company profile is now 100% complete!',
    'Go ahead and modify or confirm on the recruiter panel.',
    'Completion: 100%',
    'Profile Photo',
    'Silver Rock Technologies Ltd',
    'info.srtsghana@silverrocktech.com',
    '+233 24 248 4435',
    '10 Jungle Road, East Legon, Accra, Ghana',
    'Mobile App Development, UIUX Design',
    'Modify',
    'Confirm',
  ]);
  await open(page, 'company-edit');
  await expectTexts(page, [
    'Change Photo',
    'Company size',
    'Employees',
    'Upload your KYB/KYC document',
  ]);
  await expect(page.getByLabel('Name')).toHaveValue('Silver Rock Technologies Ltd');
  await page.getByLabel('Name').fill('Silver Rock Technologies Ghana Ltd');
  await page.getByRole('button', { name: 'Update' }).click();
  await expectTexts(page, ['Silver Rock Technologies Ghana Ltd']);
});

test('company confirmed: the thread goes on to the first post', async ({ page }) => {
  await open(page, 'company-edit-continued');
  await expectTexts(page, [
    'Company Profile Confirmed',
    'That’s awesome. Now do you want to set up your first post',
    'Why not?',
  ]);
});

test('KYB/KYC: a file uploading above the composer, then verified', async ({ page }) => {
  await open(page, 'kyb-uploading');
  await expectTexts(page, [
    'Upload KYB/KYC Documents - Get verified to start posting jobs',
    'SRT KYC Docum... .pdf',
    '4.5MB / 6MB',
  ]);
  await expect(page.getByRole('progressbar', { name: /Uploading SRT KYC/ })).toBeVisible();
  await open(page, 'kyb-verified');
  await expectTexts(page, ['That’s wonderful. You have been successfully verified', 'Of course']);
});

test('post a job: the three ways, then Manual Creation and the form modal', async ({ page }) => {
  await open(page, 'post-job-options');
  await expectTexts(page, [
    'Straight to business. I like that!',
    'File Upload',
    'Conversation with AI',
    'Manual Creation',
  ]);
  await expect(page.getByPlaceholder('Curious about any of these?')).toBeVisible();
  await open(page, 'post-job-manual');
  await expectTexts(page, ['Fill Form']);
  await page.getByRole('button', { name: /Fill Form/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expectTexts(page, ['Let’s build your job post.', 'BASIC INFORMATION', 'Post Job']);
});

test('job form modal states by URL: scrolled body and the Experience Level menu', async ({
  page,
}) => {
  await open(page, 'post-job-form', '&jobform=level-menu');
  await expect(page.getByRole('dialog')).toBeVisible();
  for (const band of ['1-5', '6-10', '11-20', '20+']) {
    await expect(page.getByText(band, { exact: true }).first()).toBeVisible();
  }
});

test('conversation with AI: transcript, then the fallback form', async ({ page }) => {
  await open(page, 'post-job-chat-transcript');
  await expectTexts(page, [
    'Awesome! Let’s have a conversation about this role.',
    'Perfect! A Digital Marketing Specialist — great role.',
  ]);
  await open(page, 'post-job-chat-fallback');
  await expectTexts(page, [
    'Let’s fill this in manually.',
    'We had a little trouble understanding your last answer',
  ]);
});

test('confirmation dialog, then the success toast and the follow-up message', async ({ page }) => {
  await open(page, 'post-job-confirm');
  await expectTexts(page, ['Confirm Job Posting', 'Confirm & Post Job', 'Go back and edit']);
  await open(page, 'post-job-success');
  await expectTexts(page, [
    'Job posted successfully',
    'Awesome—congratulations on publishing your first job post!',
  ]);
});

test('file upload: uploading chip, the extraction reply, and the review modal', async ({
  page,
}) => {
  await open(page, 'post-job-upload');
  await expectTexts(page, [
    'Perfect! Upload your job description document',
    'Marketing j... .pdf',
    '5MB / 8MB',
  ]);
  await open(page, 'post-job-uploaded');
  await expectTexts(page, ['Review & Post Job', 'We need a Digital Marketing Specialist']);
  await open(page, 'post-job-upload-review');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expectTexts(page, ['Marketing Manager']);
});

test('interactive: a chip starts a fresh thread without the welcome bubble', async ({ page }) => {
  const errors = await open(page, 'landing');
  await page.getByRole('button', { name: 'Post Your First Job' }).click();
  await expectTexts(page, ['Straight to business. I like that!']);
  await expect(page.getByPlaceholder('Curious about any of these?')).toBeVisible();
  await expect(page.getByText('Hi there! 👋 Welcome to Ghana Talent AI')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('no sideways scroll at phone width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await open(page, 'landing');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
