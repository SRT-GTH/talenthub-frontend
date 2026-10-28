import { test, expect as baseExpect } from '@playwright/test';

// The dev server is shared with other sessions and the first load of a lazy route is slow: give every check room.
const expect = baseExpect.configure({ timeout: 15_000 });
test.beforeEach(() => test.slow());

/*
 * /parent/review — Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 06 To review and approvals" 10057:66783.
 * 1) every frame's URL must show that frame's copy verbatim (strings below are the `characters` of the Figma text nodes, curly quotes and typos included);
 * 2) the real interactions behind the frames must work (approve / undo, decline note rule, hide, flag a trait, rail toggle, tabs).
 */
const REVIEW = '/parent/review';
const NOTE = 'She%20leads%20her%20church%20youth%20group%20every%20Sunday.';

const CERT_ROW = [
  'Certificate · Intro to Python',
  'Abena · Ghana Code Club · issued 30 Sep · hidden from her profile until you decide',
];
const EVAL_ROW = [
  'Teacher evaluation from Mr Owusu',
  'Elliot · Achimota · Elliot sees it only if you approve',
];
const FIX_ROW = ['Date of birth was corrected', 'Abena · you flagged it 14 Oct'];
const PAY_ROW = [
  'Payment request · GHS 90.00',
  'Abena · Python Basics · GTH Academy · expires in 46 h',
];
const HEAD = ['To review', 'A few things need your OK. Everything else just keeps you informed.'];
const TABS = ['All', 'Certificates', 'Evaluations', 'Corrections', 'Payments'];

const FRAMES = [
  {
    code: 'PR-01',
    url: REVIEW,
    texts: [
      ...HEAD,
      '4 waiting',
      ...CERT_ROW,
      ...EVAL_ROW,
      ...FIX_ROW,
      ...PAY_ROW,
      'Decide',
      'Check',
    ],
  },
  {
    code: 'PR-07',
    url: `${REVIEW}?tab=certificates`,
    texts: [...HEAD, '4 waiting', ...CERT_ROW, 'Review'],
  },
  { code: 'PR-08', url: `${REVIEW}?tab=corrections`, texts: [...HEAD, ...FIX_ROW, 'Check'] },
  { code: 'PR-09', url: `${REVIEW}?tab=payments`, texts: [...HEAD, ...PAY_ROW, 'Decide'] },
  {
    code: 'PR-01c',
    url: `${REVIEW}?rail=collapsed`,
    texts: [...HEAD, '4 waiting', ...CERT_ROW, ...EVAL_ROW, ...FIX_ROW, ...PAY_ROW],
  },
  {
    code: 'PR-02',
    url: `${REVIEW}?tab=certificates&modal=certificate`,
    texts: [
      'Abena’s certificate',
      'Intro to Python · Ghana Code Club · issued 30 Sep 2026',
      'Certificate of Completion',
      'Awarded to Abena Mensah · 6-week Python club · signed by K. Adjei',
      'Open full file (PDF, 420 KB)',
      'Self-reported · not verified by GTH',
      'If you approve, it appears on Abena’s profile with the self-reported label. If you decline, tell her why so she can fix it.',
      'Decline with a note',
      'Approve',
    ],
  },
  {
    code: 'PR-06',
    url: `${REVIEW}?toast=certificate-approved`,
    texts: [
      '3 waiting',
      'Certificate approved',
      'Intro to Python now shows on Abena’s profile as self-reported.',
      'Undo',
      ...EVAL_ROW,
      ...FIX_ROW,
      ...PAY_ROW,
    ],
  },
  {
    code: 'PR-02b',
    label: 'Note to Abena',
    url: `${REVIEW}?tab=certificates&modal=decline&reason=blurry`,
    texts: [
      'Decline Abena’s certificate?',
      'It stays hidden from her profile. Tell her why so she can upload a better copy.',
      'File is blurry',
      'Not her name',
      'Not from a real course',
      'Other',
      'At least 10 characters. Abena sees this note.',
      'Cancel',
      'Decline and send note',
    ],
  },
  {
    code: 'PR-03',
    url: `${REVIEW}?tab=evaluations`,
    texts: [
      'Mr Kwabena Owusu evaluated Elliot',
      'Teacher · Achimota School · submitted 16 Oct · not anonymous',
      'How does Elliot work with others?',
      'Takes the lead in group work and makes sure quieter classmates are heard.',
      'Strongest subject strengths',
      'Physics and Elective Maths. Very good at explaining solutions.',
      'Where could he grow?',
      'Finishing written work on time; he rushes write-ups.',
      'Would you recommend him for a science programme?',
      'Yes, strongly.',
      'Approve · send to Elliot',
      'Don’t show Elliot',
    ],
  },
  {
    code: 'PR-03c',
    url: `${REVIEW}?toast=evaluation-sent`,
    texts: [
      '3 waiting',
      'Sent to Elliot',
      'He’ll review Mr Owusu’s evaluation before it shows on his profile.',
      'Undo',
      ...CERT_ROW,
      ...FIX_ROW,
      ...PAY_ROW,
    ],
  },
  {
    code: 'PR-03b',
    url: `${REVIEW}?tab=evaluations&modal=hide`,
    texts: [
      'Don’t show this to Elliot?',
      'The evaluation is deleted. Elliot never sees it, and Mr Owusu isn’t told why.',
      'Tip: if only one answer is the problem, approve it and Elliot can flag that answer himself.',
      'Keep reviewing',
    ],
  },
  {
    code: 'PR-04',
    url: `${REVIEW}?view=assessment`,
    texts: [
      'Personality profile · Abena · completed 12 Oct',
      'The Architect',
      'Plans before building, spots risks early, likes clear structure. Shown to recruiters only in broad groups.',
      'Conscientiousness',
      '88th percentile',
      'Openness',
      '72th percentile',
      'Agreeableness',
      '64th percentile',
      'Extraversion',
      '41th percentile',
    ],
  },
  {
    code: 'PR-04b',
    label: 'What makes you think so?',
    url: `${REVIEW}?view=assessment&modal=flag-result&trait=extraversion&reason=not-her&note=${NOTE}`,
    texts: [
      'Flag “Extraversion · 41st percentile”',
      'Scores can’t be changed, but a flag asks Abena to check it and our team to look. It’s hidden from recruiters while flagged.',
      'Doesn’t sound like her',
      'She rushed the test',
      'At least 10 characters. Abena sees this note.',
      'Abena can retake the personality profile after 90 days. The new result replaces this one.',
      'Cancel',
      'Send flag',
    ],
  },
  {
    code: 'PR-05',
    url: `${REVIEW}?state=caught-up`,
    texts: [
      'To review',
      'You’re all caught up',
      'We’ll message you on WhatsApp when something needs your OK. Most weeks, nothing will.',
      'Back to Home',
    ],
  },
];

test.describe('To review: every Figma frame shows its copy verbatim', () => {
  for (const f of FRAMES) {
    test(`${f.code} ${f.url}`, async ({ page }) => {
      await page.goto(f.url);
      await expect(page.getByRole('heading', { level: 1, name: 'To review' })).toBeVisible();
      for (const t of f.texts) {
        await expect(page.getByText(t, { exact: true }).first(), `"${t}"`).toBeVisible();
      }
      // Every frame draws the five tabs; a tab's accessible name is its label plus the count chip ("All 4"), so match the start.
      for (const t of TABS) {
        await expect(
          page.getByRole('link', { name: new RegExp(`^${t}(\\s|$)`) }),
          `tab "${t}"`
        ).toBeVisible();
      }
      // The note field's label carries a "*" (an aria-hidden span), so it is checked by label, not by exact text.
      if (f.label) await expect(page.getByLabel(f.label), `label "${f.label}"`).toBeVisible();
    });
  }

  test('PR-02b prefilled note is the drawn value', async ({ page }) => {
    await page.goto(
      `${REVIEW}?tab=certificates&modal=decline&reason=blurry&note=The%20photo%20is%20blurry.%20Please%20scan%20it%20again%20in%20good%20light.`
    );
    await expect(page.getByLabel('Note to Abena')).toHaveValue(
      'The photo is blurry. Please scan it again in good light.'
    );
  });

  test('PR-04b prefilled note is the drawn value', async ({ page }) => {
    await page.goto(`${REVIEW}?view=assessment&modal=flag-result&trait=extraversion&note=${NOTE}`);
    await expect(page.getByLabel('What makes you think so?')).toHaveValue(
      'She leads her church youth group every Sunday.'
    );
  });

  test('PR-05 draws a 0 on every tab', async ({ page }) => {
    await page.goto(`${REVIEW}?state=caught-up`);
    for (const t of TABS) {
      await expect(page.getByRole('link', { name: new RegExp(`^${t}\\s*0$`) })).toBeVisible();
    }
  });
});

test.describe('To review: the flows behind the frames work', () => {
  test('tabs filter the queue and keep the counts', async ({ page }) => {
    await page.goto(REVIEW);
    await expect(page.locator('main ul > li')).toHaveCount(4);
    await page.getByRole('link', { name: /^Certificates/ }).click();
    await expect(page.locator('main ul > li')).toHaveCount(1);
    await page.getByRole('link', { name: /^Payments/ }).click();
    await expect(page.locator('main ul > li')).toHaveCount(1);
    await page.getByRole('link', { name: /^All/ }).click();
    await expect(page.locator('main ul > li')).toHaveCount(4);
  });

  test('approve a certificate, then Undo restores it', async ({ page }) => {
    await page.goto(`${REVIEW}?tab=certificates`);
    await page.getByRole('button', { name: 'Review' }).click();
    await page.getByRole('button', { name: 'Approve', exact: true }).click();
    await expect(page.getByText('Certificate approved')).toBeVisible();
    await expect(page.getByText('3 waiting')).toBeVisible();
    await page.getByRole('button', { name: 'Undo' }).click();
    await expect(page.getByText('4 waiting')).toBeVisible();
    await expect(page).not.toHaveURL(/done=/);
  });

  test('decline needs a note of 10 characters, then the row leaves', async ({ page }) => {
    await page.goto(`${REVIEW}?tab=certificates&modal=decline`);
    await page.getByLabel('Note to Abena').fill('blur');
    await page.getByRole('button', { name: 'Decline and send note' }).click();
    await expect(page.getByText('Add a little more so Abena knows what to fix.')).toBeVisible();
    await page.getByLabel('Note to Abena').fill('The name on it is not hers.');
    await page.getByRole('button', { name: 'Decline and send note' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.locator('main ul > li')).toHaveCount(0);
  });

  test('approve an evaluation, and the hide confirm can be cancelled', async ({ page }) => {
    await page.goto(`${REVIEW}?tab=evaluations`);
    await page.getByRole('button', { name: 'Don’t show Elliot' }).click();
    await page.getByRole('button', { name: 'Keep reviewing' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await page.getByRole('button', { name: 'Approve · send to Elliot' }).click();
    await expect(page.getByText('Sent to Elliot')).toBeVisible();
    await expect(page.getByText('3 waiting')).toBeVisible();
  });

  test('flag a trait: the link becomes "Flagged"', async ({ page }) => {
    await page.goto(`${REVIEW}?view=assessment`);
    await page.getByRole('button', { name: 'Flag' }).nth(3).click();
    await page.getByLabel('What makes you think so?').fill('She leads her church youth group.');
    await page.getByRole('button', { name: 'Send flag' }).click();
    await expect(page.getByRole('button', { name: 'Flagged' })).toBeDisabled();
  });

  test('Check opens the re-review dialog on the ward page', async ({ page }) => {
    await page.goto(`${REVIEW}?tab=corrections`);
    await page.getByRole('link', { name: 'Check' }).click();
    await expect(page).toHaveURL(/\/parent\/wards\/abena\?tab=flags&modal=recheck&flag=dob/);
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('the sidebar collapses to the rail and expands again', async ({ page }) => {
    await page.goto(REVIEW);
    await page.getByRole('button', { name: 'Collapse sidebar' }).click();
    await expect(page).toHaveURL(/rail=collapsed/);
    await expect(page.getByLabel('Parent navigation (collapsed)')).toBeVisible();
    await page.getByRole('button', { name: 'Expand sidebar' }).click();
    await expect(page.getByLabel('Parent navigation', { exact: true })).toBeVisible();
  });
});
