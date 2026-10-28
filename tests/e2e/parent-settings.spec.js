import { test, expect as baseExpect } from '@playwright/test';

// The dev server is shared with other sessions and the first load of a lazy route is slow: give every check room.
const expect = baseExpect.configure({ timeout: 15_000 });
test.beforeEach(() => test.slow());

/*
 * /parent/settings — Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 11 Settings and account" 10057:67440.
 * 1) every frame's URL shows that frame's copy verbatim (the strings are the `characters` of the Figma text nodes);
 * 2) the interactions behind the frames work (section nav, switches, devices, log out, close account with the CLOSE word).
 */
const SETTINGS = '/parent/settings';
const HEAD = ['Settings', 'Manage your account, privacy and how GTH works for you.'];
const NAV = [
  'Account',
  'Your roles',
  'Notifications',
  'Accessibility',
  'Language and data',
  'Security and sign-in',
  'Data and account',
  'Log out',
];

const FRAMES = [
  {
    code: 'PS-01',
    url: SETTINGS,
    texts: [
      ...HEAD,
      ...NAV,
      'Personal details',
      'This is how you appear to your wards and to GTH.',
      'Account type',
      'Parent · mother of Abena and Elliot',
      'You also have a career profile. Manage both in Your roles.',
      'Profile photo',
      'Your wards see this photo when they link with you.',
      'Change photo',
      'Cancel',
      'Save changes',
    ],
    labels: ['Full name', 'Email', 'Phone', 'Date of birth', 'Region', 'City or town'],
    values: {
      'Full name': 'Emma Mensah',
      Email: 'emma.mensah@gmail.com',
      Phone: '+233 24 555 0192',
      'Date of birth': '08 / 02 / 1984',
      Region: 'Greater Accra',
      'City or town': 'Accra · Ayawaso',
    },
  },
  {
    code: 'PS-02',
    url: `${SETTINGS}?tab=roles`,
    texts: [
      ...HEAD,
      'When I sign in, open',
      'You can switch any time from your profile card.',
      'Parent view',
      'Now',
      'Opens on your wards, approvals and notifications.',
      'My career',
      'Opens on your own talent home and matches.',
      'The space I used last',
      'Picks up where you left off.',
      'Ask me each time',
      'Shows the switch menu after you sign in.',
      'Keep your spaces separate',
      'Hide that I’m a parent on my career profile',
      'Recruiters never see your wards. This also hides the word “parent”.',
      'Show career updates in Parent view',
      'A small count on the switch menu, like “2 new”.',
      'Show ward approvals in My career',
      'Approvals also reach you by WhatsApp and SMS.',
      'Let my wards see I’m learning too',
      'They see a small “Mum is learning too” card on their home.',
      'Wards linked to you',
      'Each ward has their own controls. Changes for one don’t affect the other.',
      '2 linked · 1 pending',
      'Abena Mensah · Daughter, 16 · Elliot Mensah · Son, 15',
      'Manage',
    ],
  },
  {
    code: 'PS-03',
    url: `${SETTINGS}?tab=notifications`,
    texts: [
      ...HEAD,
      'What we tell you about',
      'Pick where each update reaches you. SMS and WhatsApp may use a little data or airtime.',
      'Update',
      'In GTH',
      'Email',
      'SMS',
      'WhatsApp',
      'Approvals needed',
      'Certificates, teacher evaluations and payments over your limit.',
      'Milestones your wards share',
      'Badges, finished courses and other wins they send you.',
      'Flags and corrections',
      'When a ward fixes something you flagged.',
      'Ward activity',
      'Assessments, courses and clubs they join.',
      'Link requests',
      'A child asks to link with you, or accepts your request.',
      'Turning 18',
      'A month before a ward turns 18.',
      'News from GTH',
      'New features and events. About once a month.',
      'Quiet hours',
      'We hold everything except payment approvals until quiet hours end.',
      'Quiet hours on',
      'Every day',
      '10:00 pm',
      'to',
      '7:00 am',
      'Weekly summary',
      'Your wards’ week',
      'What Abena and Elliot did this week, every Sunday at 6 pm on WhatsApp.',
      'Turn everything off for 24 hours',
      'Save changes',
    ],
  },
  {
    code: 'PS-04',
    url: `${SETTINGS}?tab=security`,
    texts: [
      ...HEAD,
      'Sign-in',
      'Password',
      'Last changed 3 months ago.',
      'Change password',
      'Two-step verification',
      'On',
      'We text a 6-digit code to +233 24 ••• 0192 when you sign in on a new device.',
      'Sign in with Google',
      'emma.mensah@gmail.com',
      'Disconnect',
      'Where you are logged in',
      'If you do not recognise a device, log it out and change your password.',
      'Chrome on Windows',
      'This device',
      'Accra · active now',
      'GTH app on Android',
      'Accra · 2 days ago',
      'Safari on iPad',
      'Accra · 3 weeks ago',
      'Log out of all other devices',
    ],
  },
  {
    code: 'PS-05',
    url: `${SETTINGS}?tab=data`,
    texts: [
      ...HEAD,
      'Your data',
      'You own it. Download a copy any time.',
      'Download my data',
      'Your details, approvals, flags and the evaluations you wrote, as a ZIP. Ready within 24 hours.',
      'Request download',
      'Ward progress report',
      'A PDF of each ward’s progress this term, for school meetings.',
      'Download PDF',
      'Take a break',
      'Pause non-urgent notifications',
      'We stop everything except payment approvals for up to 30 days.',
      'Close my parent account',
      'Your wards keep their accounts and data. Your flags and evaluations stay on their profiles.',
      'Opt-outs you set are lifted and your wards are told. My career is not affected.',
      'Download your data first if you want to keep a copy.',
      'Close parent account',
    ],
  },
  {
    code: 'PS-06',
    url: `${SETTINGS}?modal=logout`,
    texts: [
      'Log out of GTH?',
      'You’ll still get approval messages on WhatsApp and SMS, so nothing is missed.',
      'Stay',
    ],
  },
  {
    code: 'PS-06b',
    url: `${SETTINGS}?state=logged-out`,
    texts: [
      'You’re logged out',
      'See you soon, Emma',
      'Approvals will still reach you on WhatsApp and SMS. Log back in any time to see your wards.',
      'Log in again',
    ],
  },
  {
    code: 'PS-07',
    url: `${SETTINGS}?tab=data&modal=close-account&confirm=CLO`,
    texts: [
      'Close your parent account?',
      'Abena and Elliot keep their accounts. Here’s what happens.',
      'Your link to both wards ends, and they’re told.',
      'Payments over the limit go to a GTH safety reviewer instead of you.',
      'Evaluations you wrote stay on their profiles.',
      'My career stays open. Close it separately if you want.',
      'Keep my account',
    ],
    labels: ['Type CLOSE to confirm'],
  },
  {
    code: 'PS-07b',
    url: `${SETTINGS}?state=closed`,
    texts: [
      'Parent account closed',
      'Your parent account is closed',
      'Go to My career',
      'Undo within 30 days',
    ],
  },
];

for (const frame of FRAMES) {
  test(`${frame.code} ${frame.url} shows its Figma copy`, async ({ page }) => {
    await page.goto(frame.url);
    for (const text of frame.texts) {
      await expect(
        page.getByText(text, { exact: true }).filter({ visible: true }).first(),
        text
      ).toBeVisible();
    }
    for (const [label, value] of Object.entries(frame.values ?? {})) {
      await expect(page.getByLabel(label).first(), label).toHaveValue(value);
    }
    for (const label of frame.labels ?? []) {
      await expect(page.getByLabel(label).first(), label).toBeVisible();
    }
  });
}

test('PS-06 / PS-07 dialogs name themselves and the close word gates the button', async ({
  page,
}) => {
  await page.goto(`${SETTINGS}?tab=data&modal=close-account&confirm=CLO`);
  const dialog = page.getByRole('dialog', { name: 'Close your parent account?' });
  await expect(dialog).toBeVisible();
  const close = dialog.getByRole('button', { name: 'Close parent account' });
  await expect(close).toBeDisabled();
  await dialog.getByLabel('Type CLOSE to confirm').fill('CLOSE');
  await expect(close).toBeEnabled();
});

test('section nav switches the tab and keeps the URL in step', async ({ page }) => {
  await page.goto(SETTINGS);
  const nav = page.getByRole('navigation', { name: 'Settings sections' });
  for (const [label, tab, heading] of [
    ['Your roles', 'roles', 'When I sign in, open'],
    ['Notifications', 'notifications', 'What we tell you about'],
    ['Security and sign-in', 'security', 'Where you are logged in'],
    ['Data and account', 'data', 'Take a break'],
    ['Account', 'account', 'Personal details'],
  ]) {
    await nav.getByRole('link', { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`tab=${tab}`));
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
  }
  // Accessibility / Language and data have no parent frame: the page stays where it is.
  await nav.getByRole('link', { name: 'Accessibility' }).click();
  await expect(page.getByRole('heading', { name: 'Personal details' })).toBeVisible();
});

test('the "Your roles" link and "Manage" go where their labels say', async ({ page }) => {
  await page.goto(SETTINGS);
  await page.getByRole('button', { name: 'Your roles' }).click();
  await expect(page).toHaveURL(/tab=roles/);
  await page.getByRole('button', { name: 'Manage' }).click();
  await expect(page).toHaveURL(/\/parent\/wards$/);
});

test('roles: a radio card selects and a switch flips', async ({ page }) => {
  await page.goto(`${SETTINGS}?tab=roles`);
  const mine = page.getByRole('radio', { name: /^My career/ });
  await expect(mine).toHaveAttribute('aria-checked', 'false');
  await mine.click();
  await expect(mine).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('radio', { name: /^Parent view/ })).toHaveAttribute(
    'aria-checked',
    'false'
  );
  const sw = page.getByRole('switch', { name: 'Show career updates in Parent view' });
  await expect(sw).toHaveAttribute('aria-checked', 'false');
  await sw.click();
  await expect(sw).toHaveAttribute('aria-checked', 'true');
});

test('notifications: a matrix box toggles and the quiet hours picker changes', async ({ page }) => {
  await page.goto(`${SETTINGS}?tab=notifications`);
  const box = page.getByRole('checkbox', { name: 'Approvals needed: SMS' });
  await expect(box).toHaveAttribute('aria-checked', 'false');
  await box.click();
  await expect(box).toHaveAttribute('aria-checked', 'true');
  await page.getByLabel('Quiet hours start').selectOption('9:00 pm');
  await expect(page.getByText('9:00 pm', { exact: true }).first()).toBeVisible();
});

test('security: logging a device out removes its row, "all other devices" removes the rest', async ({
  page,
}) => {
  await page.goto(`${SETTINGS}?tab=security`);
  await page.getByRole('button', { name: 'Log out Safari on iPad' }).click();
  await expect(page.getByText('Safari on iPad', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Log out of all other devices' }).click();
  await expect(page.getByText('GTH app on Android', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Chrome on Windows', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Log out of all other devices' })).toHaveCount(0);
});

test('log out: nav → confirm → logged out; Stay and Esc keep you in', async ({ page }) => {
  await page.goto(SETTINGS);
  const nav = page.getByRole('navigation', { name: 'Settings sections' });
  await nav.getByRole('button', { name: 'Log out' }).click();
  await expect(page).toHaveURL(/modal=logout/);
  await page.getByRole('button', { name: 'Stay' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await nav.getByRole('button', { name: 'Log out' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await nav.getByRole('button', { name: 'Log out' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Log out' }).click();
  await expect(page).toHaveURL(/state=logged-out/);
  await expect(page.getByText('See you soon, Emma')).toBeVisible();
  await page.getByRole('button', { name: 'Log in again' }).click();
  await expect(page).toHaveURL(/\/login/);
});

test('close account: Data → dialog → type CLOSE → closed; Undo returns to Data', async ({
  page,
}) => {
  await page.goto(`${SETTINGS}?tab=data`);
  await page.getByRole('button', { name: 'Close parent account' }).click();
  await expect(page).toHaveURL(/modal=close-account/);
  const dialog = page.getByRole('dialog', { name: 'Close your parent account?' });
  await dialog.getByRole('button', { name: 'Keep my account' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Close parent account' }).click();
  await page.getByLabel('Type CLOSE to confirm').fill('CLOSE');
  await page.getByRole('dialog').getByRole('button', { name: 'Close parent account' }).click();
  await expect(page).toHaveURL(/state=closed/);
  await expect(page.getByText('Your parent account is closed')).toBeVisible();
  await page.getByRole('button', { name: 'Undo within 30 days' }).click();
  await expect(page).toHaveURL(/tab=data/);
  await expect(page.getByRole('heading', { name: 'Take a break' })).toBeVisible();
});

test('no console errors and no sideways scroll at phone width', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.setViewportSize({ width: 390, height: 844 });
  for (const url of [
    SETTINGS,
    `${SETTINGS}?tab=roles`,
    `${SETTINGS}?tab=notifications`,
    `${SETTINGS}?tab=security`,
    `${SETTINGS}?tab=data`,
    `${SETTINGS}?state=logged-out`,
    `${SETTINGS}?state=closed`,
  ]) {
    await page.goto(url);
    await expect(page.getByRole('heading').first()).toBeVisible();
    const over = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(over, url).toBeLessThanOrEqual(0);
  }
  expect(errors, errors.join('\n')).toEqual([]);
});
