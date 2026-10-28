import { test, expect as baseExpect } from '@playwright/test';

// The dev server is shared with other sessions and the first load of a lazy route is slow: give every check room.
const expect = baseExpect.configure({ timeout: 15_000 });
test.beforeEach(() => test.slow());

/*
 * Parent Ask Buddy — Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 13 Ask Buddy" 10089:2105 (PB-01 … PB-05).
 * Every frame's URL shows that frame's copy verbatim; the buttons walk the states.
 */
const COMMON = [
  'Career Buddy',
  'Online · replies in seconds',
  'Today',
  'Hi Emma. I can explain what Abena and Elliot see on GTH, what needs your approval, and how to keep them safe.',
  'Can Abena apply for paid jobs yet?',
  'Buddy can make mistakes. Your chats stay private from your wards and recruiters.',
];
const FRAMES = [
  {
    code: 'PB-01',
    phase: 'thinking',
    texts: ['Thinking', 'Abena’s profile', 'Rules for under-18s'],
  },
  {
    code: 'PB-02',
    phase: 'working',
    texts: [
      'Working on it',
      'Checking what Abena can apply for',
      'Read Abena’s profile',
      'Checking GTH rules for under-18s',
      'Writing your answer',
      'Step 2 of 3',
    ],
  },
  {
    code: 'PB-03',
    phase: 'writing',
    texts: [
      'Good question. Abena can volunteer and take unpaid internships now. Paid jobs open when she turns 18.',
    ],
  },
  {
    code: 'PB-04',
    phase: 'slow',
    texts: ['Still working', 'This one takes longer: checking 3 wards’ activity', '12 s'],
  },
  {
    code: 'PB-05',
    phase: 'stopped',
    texts: [
      'Good question. Abena can volunteer and take unpaid',
      'You stopped this answer',
      'Continue',
      'Try again',
      'What needs my approval?',
      'How does opting out work?',
      'Explain Abena’s wallet',
    ],
  },
];

for (const f of FRAMES) {
  test(`${f.code} /parent?buddy=${f.phase} shows its Figma copy`, async ({ page }) => {
    await page.goto(`/parent?buddy=${f.phase}`);
    const panel = page.getByRole('dialog', { name: 'Career Buddy' });
    await expect(panel).toBeVisible();
    for (const text of [...COMMON, ...f.texts]) {
      await expect(
        panel.getByText(text, { exact: true }).filter({ visible: true }).first(),
        text
      ).toBeVisible();
    }
    if (['working', 'writing', 'slow'].includes(f.phase)) {
      await expect(panel.getByRole('button', { name: /Stop generating/ })).toBeVisible();
    }
    await expect(
      panel.getByPlaceholder('Ask about your wards, approvals or safety…')
    ).toBeVisible();
  });
}

test('the suggestions are only visible after an answer was stopped', async ({ page }) => {
  await page.goto('/parent?buddy=working');
  await expect(page.getByRole('button', { name: 'What needs my approval?' })).toBeHidden();
  await page.goto('/parent?buddy=stopped');
  await expect(page.getByRole('button', { name: 'What needs my approval?' })).toBeVisible();
});

test('Stop, Continue and Try again move between the states; Esc stops, then closes', async ({
  page,
}) => {
  await page.goto('/parent?buddy=working');
  await page.getByRole('button', { name: /Stop generating/ }).click();
  await expect(page).toHaveURL(/buddy=stopped/);
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page).toHaveURL(/buddy=thinking/);
  await page.goto('/parent?buddy=stopped');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page).toHaveURL(/buddy=writing/);
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/buddy=stopped/);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('the Ask Buddy button opens the panel; a sent question starts the thinking state', async ({
  page,
}) => {
  await page.goto('/parent');
  await page
    .getByRole('button', { name: /Ask Buddy/ })
    .first()
    .click();
  await expect(page).toHaveURL(/buddy=open/);
  const panel = page.getByRole('dialog', { name: 'Career Buddy' });
  await expect(panel).toBeVisible();
  await panel.getByPlaceholder('Ask about your wards, approvals or safety…').fill('Hello');
  await panel.getByRole('button', { name: 'Send' }).click();
  await expect(page).toHaveURL(/buddy=(thinking|working|writing)/);
  await panel.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
