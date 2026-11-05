import { test, expect as baseExpect } from '@playwright/test';

// The dev server is shared with other sessions and the first load of a lazy route is slow: give every check room.
const expect = baseExpect.configure({ timeout: 15_000 });
test.beforeEach(() => test.slow());

/*
 * /parent/wallets — Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 08 Ward wallets" 10057:66889 (wiki/parent-wallets.md).
 * 1) every frame's URL shows that frame's copy verbatim (the strings are the `characters` of the Figma text nodes);
 * 2) the interactions behind the frames work (approve, decline + undo, limits, top-up, Elliot's wallet, the ward page's Wallet tab).
 */
const W = '/parent/wallets';
const FRAMES = [
  {
    code: 'PWa-01',
    url: W,
    texts: [
      'Ward wallets',
      'Abena wants to pay GHS 90.00',
      'Python Basics · GTH Academy · asked 2 h ago · expires in 46 h',
      'Your limits',
      'Not until 18',
      'Elliot hasn’t opened a wallet',
    ],
  },
  {
    code: 'PWa-02',
    url: `${W}?modal=approve`,
    texts: [
      'Approve GHS 90.00 for Abena?',
      'Python Basics on GTH Academy · 6 weeks · certificate',
      'Abena’s balance GHS 85.00 + 50 Cycles',
      'GHS 125 of GHS 200',
      'Abena is told straight away. If you decline, you can add a note.',
      'Approve payment',
    ],
  },
  {
    code: 'PWa-02c',
    url: `${W}?modal=approve-error`,
    texts: [
      'Your approval didn’t go through',
      'We couldn’t reach GTH, so nothing was paid. Try again, or reply YES to the WhatsApp message we sent.',
    ],
  },
  {
    code: 'PWa-03',
    url: `${W}?toast=approved`,
    texts: [
      'Payment approved',
      'Abena paid GHS 65 from her balances and 50 Cycles. She’s been told.',
      'View receipt',
      'You approved GHS 90.00 · Python Basics',
      'GTH Academy · paid just now · Abena is enrolled',
      'Balance GHS 0.00 · 130 Cycles',
    ],
  },
  {
    code: 'PWa-04',
    url: `${W}?modal=decline`,
    texts: [
      'Decline Abena’s GHS 90 payment?',
      'Nothing is charged. Abena is told straight away, with your note if you add one.',
      'Let’s talk first',
      'Too expensive',
      'Optional · up to 200 characters.',
      'Decline payment',
    ],
  },
  {
    code: 'PWa-04b',
    url: `${W}?toast=declined`,
    texts: [
      'Payment declined',
      'Undo',
      'You declined GHS 90.00 · Python Basics',
      'Nothing was charged · your note was sent to Abena',
    ],
  },
  {
    code: 'PWa-07',
    url: `${W}?view=expired`,
    texts: [
      'Request expired · GHS 90.00 Python Basics',
      'No answer within 48 hours, so nothing was charged. Abena can ask again.',
    ],
  },
  {
    code: 'PWa-05',
    url: `${W}?modal=limits`,
    texts: [
      'Abena’s limits',
      'Payments above your limit wait for your OK. Abena is told when limits change.',
      'Most parents use GHS 50',
      'Resets on the 1st',
      'Withdrawals to mobile money unlock at 18. This is set by GTH, not by you.',
      'Save limits',
    ],
  },
  {
    code: 'PWa-05b',
    url: `${W}?toast=limits-saved`,
    texts: ['Abena’s limits are saved', 'Ask me above GHS 50 · GHS 200 a month. She’s been told.'],
  },
  {
    code: 'PWa-06',
    url: `${W}?modal=topup`,
    texts: [
      'Top up Abena’s wallet',
      'Money goes to her Starter wallet straight away. She’ll see who sent it.',
      'Her balance will be GHS 135.00',
      'You’ll approve on your phone',
      'Send GHS 50.00',
    ],
  },
  {
    code: 'PWa-06b',
    url: `${W}?modal=topup-phone`,
    texts: [
      'Approve on your phone',
      'We sent a GHS 50.00 request to MTN MoMo 024 ••• 0192. Enter your MoMo PIN on your phone to finish.',
      'Waiting for MoMo… this usually takes under a minute',
      'Cancel top up',
      'I’ve approved it',
    ],
  },
  {
    code: 'PWa-06c',
    url: `${W}?toast=topup-done`,
    texts: [
      'GHS 50.00 sent to Abena',
      'Her balance is now GHS 135.00. She can see your note.',
      'Balance GHS 135.00',
    ],
  },
  {
    code: 'PWa-06d',
    url: `${W}?modal=topup-error`,
    texts: [
      'Top up didn’t go through',
      'MTN MoMo declined the GHS 50.00 request. No money left your account.',
      'Common reasons',
      'Wrong PIN, not enough balance, or the request timed out after 2 minutes.',
    ],
  },
  {
    code: 'PWa-08',
    url: `${W}?modal=open-wallet`,
    texts: [
      'Elliot wants a Starter wallet',
      'Ask me above GHS 50 · up to GHS 200 a month',
      'No withdrawals until he turns 18',
      'You can close it any time',
      'Open Elliot’s wallet',
    ],
  },
  {
    code: 'PWa-08b',
    url: `${W}?toast=elliot-open`,
    texts: [
      'Elliot’s wallet is open',
      'He’s been told. He can turn his 60 Cycles into GHS 6 for a course.',
      'Elliot’s Starter wallet',
    ],
  },
];

for (const f of FRAMES) {
  test(`${f.code} shows its Figma copy`, async ({ page }) => {
    await page.goto(f.url);
    for (const text of f.texts) {
      await expect(page.getByText(text, { exact: false }).first()).toBeVisible();
    }
  });
}

test('approve pays from the balance and Cycles and shows the toast', async ({ page }) => {
  await page.goto(W);
  await page.getByRole('button', { name: 'Approve', exact: true }).click();
  await page.getByRole('button', { name: 'Approve payment' }).click();
  await expect(page.getByText('Payment approved').first()).toBeVisible();
  await expect(page.getByText('Balance GHS 0.00 · 130 Cycles')).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('decline takes a note, and Undo brings the request back', async ({ page }) => {
  await page.goto(W);
  await page.getByRole('button', { name: 'Decline', exact: true }).click();
  await page.getByRole('radio', { name: 'Too expensive' }).click();
  await page.getByRole('button', { name: 'Decline payment' }).click();
  await expect(page.getByText('You declined GHS 90.00 · Python Basics')).toBeVisible();
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page.getByText('Abena wants to pay GHS 90.00')).toBeVisible();
});

test('limits reject a bad amount and save a good one', async ({ page }) => {
  await page.goto(`${W}?modal=limits`);
  await page.getByLabel('Monthly limit (GHS)').fill('0');
  await page.getByRole('button', { name: 'Save limits' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByLabel('Monthly limit (GHS)').fill('300');
  await page.getByRole('button', { name: 'Save limits' }).click();
  await expect(page.getByText('GHS 300.00')).toBeVisible();
});

test('top up goes through the phone step and raises the balance', async ({ page }) => {
  await page.goto(`${W}?modal=topup`);
  await page.getByRole('radio', { name: 'GHS 100' }).click();
  await page.getByRole('button', { name: 'Send GHS 100.00' }).click();
  await expect(page.getByRole('heading', { name: 'Approve on your phone' })).toBeVisible();
  await page.getByRole('button', { name: 'I’ve approved it' }).click();
  await expect(page.getByText('Balance GHS 185.00')).toBeVisible();
});

test('Elliot’s card opens his wallet', async ({ page }) => {
  await page.goto(W);
  await page.getByRole('button', { name: /Elliot hasn’t opened a wallet/ }).click();
  await page.getByRole('button', { name: 'Open Elliot’s wallet' }).click();
  await expect(page.getByText('Elliot’s wallet is open').first()).toBeVisible();
});

test('the ward page Wallet tab shares the store', async ({ page }) => {
  await page.goto('/parent/wards/abena?tab=wallet');
  await page.getByRole('button', { name: 'Decide' }).click();
  await page.getByRole('button', { name: 'Approve payment' }).click();
  await expect(page.getByText('Approved · paid just now')).toBeVisible();
});
