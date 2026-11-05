import { test, expect as baseExpect } from '@playwright/test';

// The dev server is shared with other sessions and the first load of a lazy route is slow: give every check room.
const expect = baseExpect.configure({ timeout: 15_000 });
test.beforeEach(() => test.slow());

/*
 * /parent/link-ward — Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 04 Link a ward" 10057:1093.
 * 1) every frame's URL shows that frame's copy verbatim (the strings are the `characters` of the Figma text nodes);
 * 2) the interactions behind the frames work (search, send, cancel, link code outcomes, institution dialog, PW-09).
 */
const LINK = '/parent/link-ward';
const FORM = 'name=Kwesi%20Mensah&dob=04062011&rel=nephew';
const TITLE = 'Link another ward';
const SUBTITLE = 'Search by your ward’s name and date of birth. They’ll need to accept.';
const FORM_TEXTS = [
  TITLE,
  SUBTITLE,
  'As they wrote it on GTH',
  'DD / MM / YYYY',
  'Relationship',
  'Son',
  'Daughter',
  'Nephew',
  'Niece',
  'Ward',
  'Younger sibling',
];
// The two field labels carry a "*" (an aria-hidden span), so they are checked by label, not by exact text.
const FORM_LABELS = ['Ward’s full name', 'Date of birth'];
const CODE_TEXTS = [
  'Enter your link code',
  'Your child can find a 6-character code in their GTH Settings › Parent or guardian. Codes last 24 hours.',
  'Cancel',
];

const FRAMES = [
  {
    code: 'PW-07',
    url: `${LINK}?${FORM}`,
    texts: [
      ...FORM_TEXTS,
      '1 match',
      'Kwesi M. · 15',
      'JHS 3 · Accra · joined 2 Oct',
      'Send link request',
    ],
  },
  {
    code: 'PW-07c',
    url: `${LINK}?${FORM}&result=none`,
    texts: [
      ...FORM_TEXTS,
      'No match yet',
      'We couldn’t find Kwesi Mensah born 04/06/2011',
      'Check the spelling matches what he used on GTH, or ask him for a link code. If he isn’t on GTH yet, invite him by SMS.',
      'Invite by SMS',
      'I have a link code',
    ],
  },
  {
    code: 'PW-08',
    url: `${LINK}?step=sent`,
    texts: [
      TITLE,
      'Request sent to Kwesi',
      'He’ll get a notification and an SMS. Once he accepts, he appears in My wards and you’ll get the same controls as for Abena and Elliot.',
      'Pending link · expires in 14 days',
      'Back to My wards',
      'Cancel request',
    ],
  },
  {
    code: 'PW-07b',
    url: `${LINK}?${FORM}&modal=code&code=K7M4`,
    texts: [...CODE_TEXTS, 'Link ward'],
  },
  {
    code: 'PW-07e',
    url: `${LINK}?${FORM}&modal=code-error&code=K7M4Q2`,
    texts: [
      ...CODE_TEXTS,
      'That code didn’t work',
      'Check the 6 characters with your child and try again. 2 tries left, then linking pauses for 15 minutes.',
      'Try again',
    ],
  },
  {
    code: 'PW-07f',
    url: `${LINK}?${FORM}&modal=code-expired&code=K7M4Q2`,
    texts: [
      ...CODE_TEXTS,
      'This code has expired',
      'Codes last 24 hours. Ask your child to make a new one in Settings › Parent or guardian.',
      'Enter a new code',
    ],
  },
  {
    code: 'PW-07d',
    url: `${LINK}?${FORM}&modal=institution`,
    texts: [
      'Caring for 100 or more children?',
      'Parent accounts are for families. Orphanages, boarding houses and schools register as an institution to manage many children safely.',
      'Upload a whole roster at once',
      'Staff accounts with the right access',
      'Guardian consent handled for you',
      'Keep as a parent',
      'Register an institution',
    ],
  },
  {
    code: 'PW-09',
    url: '/parent?modal=ward-linked',
    texts: [
      'Elliot linked to your account',
      'He signed up with your phone number, so he was linked automatically.',
      'Elliot Mensah · Son',
      '15 · SHS 1 · Achimota School',
      'Elliot can use guidance, assessments and volunteer roles. He can’t apply for paid work or message recruiters. If you have concerns, you can opt him out at any time.',
      'Opt out',
      'See Elliot',
    ],
  },
];

test.describe('Link a ward: every Figma frame shows its copy verbatim', () => {
  for (const f of FRAMES) {
    test(`${f.code} ${f.url}`, async ({ page }) => {
      await page.goto(f.url);
      for (const t of f.texts) {
        await expect(page.getByText(t, { exact: true }).first(), `"${t}"`).toBeVisible();
      }
      if (f.texts.includes(TITLE) && f.texts.includes(SUBTITLE)) {
        for (const l of FORM_LABELS) {
          await expect(page.getByLabel(l), `label "${l}"`).toBeVisible();
        }
      }
    });
  }

  test('PW-07b shows the drawn code K7M4 in the boxes', async ({ page }) => {
    await page.goto(`${LINK}?${FORM}&modal=code&code=K7M4`);
    const boxes = page.getByRole('group', { name: 'Link code' }).locator('input');
    await expect(boxes).toHaveCount(6);
    const values = await boxes.evaluateAll((els) => els.map((e) => e.value).join(''));
    expect(values).toBe('K7M4');
  });
});

test.describe('Link a ward: the flows behind the frames work', () => {
  test('typing the child finds a match, Send shows the sent card, Cancel returns', async ({
    page,
  }) => {
    await page.goto(LINK);
    await expect(page.getByText('1 match')).toHaveCount(0);
    await page.getByLabel('Ward’s full name').fill('kwesi  Mensah');
    await page.getByLabel('Date of birth').fill('04062011');
    await expect(page.getByLabel('Date of birth')).toHaveValue('04 / 06 / 2011');
    await expect(page.getByText('1 match')).toBeVisible();
    await page.getByRole('button', { name: 'Send link request' }).click();
    await expect(page.getByText('Request sent to Kwesi')).toBeVisible();
    await page.getByRole('button', { name: 'Cancel request' }).click();
    await expect(page.getByLabel('Ward’s full name')).toHaveValue('kwesi  Mensah');
  });

  test('an unknown child shows No match yet and the link code button opens the dialog', async ({
    page,
  }) => {
    await page.goto(`${LINK}?name=Esi%20Boateng&dob=04062011`);
    await expect(page.getByText('No match yet')).toBeVisible();
    await page.getByRole('button', { name: 'I have a link code' }).click();
    await expect(page.getByRole('dialog', { name: 'Enter your link code' })).toBeVisible();
  });

  test('code outcomes: wrong, expired, retry clears, good code links', async ({ page }) => {
    await page.goto(`${LINK}?modal=code`);
    await expect(page.getByLabel('Character 1 of 6')).toBeFocused();
    await page.keyboard.type('k7m4q2');
    await page.getByRole('button', { name: 'Link ward' }).click();
    await expect(page.getByText('That code didn’t work')).toBeVisible();
    await page.getByRole('button', { name: 'Try again' }).click();
    await page.keyboard.type('k7m4e0');
    await page.getByRole('button', { name: 'Link ward' }).click();
    await expect(page.getByText('This code has expired')).toBeVisible();
    await page.getByRole('button', { name: 'Enter a new code' }).click();
    await page.keyboard.type('zz11aa');
    await page.getByRole('button', { name: 'Link ward' }).click();
    await expect(page).toHaveURL(/\/parent\/wards\?toast=accepted/);
  });

  test('an incomplete code does nothing and Esc closes the dialog', async ({ page }) => {
    await page.goto(`${LINK}?modal=code`);
    await expect(page.getByLabel('Character 1 of 6')).toBeFocused();
    await page.keyboard.type('abc');
    await page.getByRole('button', { name: 'Link ward' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('institution dialog: Keep closes, Register goes to institution onboarding', async ({
    page,
  }) => {
    await page.goto(`${LINK}?modal=institution`);
    await page.getByRole('button', { name: 'Keep as a parent' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await page.goto(`${LINK}?modal=institution`);
    await page.getByRole('button', { name: 'Register an institution' }).click();
    await expect(page).toHaveURL(/\/onboarding\/institution\/guidelines/);
  });

  test('PW-09 closes and "See Elliot" opens his ward page', async ({ page }) => {
    await page.goto('/parent?modal=ward-linked');
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await page.goto('/parent?modal=ward-linked');
    await page.getByRole('link', { name: 'See Elliot' }).click();
    await expect(page).toHaveURL(/\/parent\/wards\/elliot/);
  });
});
