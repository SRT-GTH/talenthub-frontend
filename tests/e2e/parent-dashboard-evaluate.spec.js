// @ts-check
import { test, expect } from '@playwright/test';
import { probe } from './helpers/responsive.js';

/*
 * Parent dashboard (canvas 01), My wards and ward page (canvas 02), Evaluate my child (canvas 07) and the Help article (canvas 10):
 *   1. responsive gate: the project's own `probe` (no sideways scroll, nothing past the right edge, text >= 12px, controls >= 24px) at five widths;
 *   2. behaviour: every dashboard button that has a built page goes there; the evaluate flow runs start -> questions -> submitted; the unlink flow lands on the list without Elliot.
 * The other parent canvases (flags, link a ward, review, opt out, help) are covered by the shared responsive route list in helpers/responsive.js.
 * Narrow it while iterating: PARENT_WIDTHS=1440 npx playwright test parent-dashboard-evaluate
 */
const WIDTHS = process.env.PARENT_WIDTHS
  ? process.env.PARENT_WIDTHS.split(',').map(Number)
  : [320, 375, 768, 1024, 1440];

const ROUTES = [
  '/parent',
  '/parent?state=caught-up',
  '/parent?state=offline',
  '/parent?state=first',
  '/parent?state=none',
  '/parent?state=loading',
  '/parent?state=error',
  '/parent/wards?unlinked=elliot',
  '/parent/wards/abena?tab=evaluations',
  '/parent/wards/abena?tab=wallet',
  '/parent/wards/abena?tab=activity',
  '/parent/wards/abena?tab=crew',
  '/parent/wards/abena?modal=visibility',
  '/parent/wards/abena?notice=turning18',
  '/parent/wards/elliot?modal=unlink',
  '/parent/evaluate',
  '/parent/evaluate?state=resume',
  '/parent/evaluate?state=none',
  '/parent/evaluate/questions',
  '/parent/evaluate/questions?state=academic',
  '/parent/evaluate/questions?state=none',
  '/parent/evaluate/questions?state=blocked',
  '/parent/evaluate/questions?state=discard',
  '/parent/evaluate/result',
  '/parent/evaluate/result?state=reviewed',
  '/parent/evaluate/result?state=outcome',
  '/parent/evaluate/result?state=auto',
  '/parent/evaluate/result?state=turned18',
  '/parent/help/opting-out',
];

const prepare = async (page) => {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem('gth:hide-demo', '1');
      window.localStorage.setItem('gth:ui-style-chosen', '1');
    } catch {
      /* ignore */
    }
  });
};

for (const width of WIDTHS) {
  test.describe(`parent canvases @${width}px`, () => {
    test.use({
      viewport: { width, height: width >= 1024 ? 900 : width >= 768 ? 1024 : 700 },
      hasTouch: width < 768,
      isMobile: width < 768,
    });
    for (const route of ROUTES) {
      test(route, async ({ page }, testInfo) => {
        await prepare(page);
        await page.goto(route, { waitUntil: 'load' });
        await page.waitForSelector('[data-route-fallback]', { state: 'detached', timeout: 30000 });
        await page.waitForTimeout(900);
        const { violations, warnings } = await page.evaluate(probe, { width });
        if (warnings.length)
          testInfo.annotations.push({ type: 'warning', description: warnings.join('; ') });
        expect(violations, `${route} @${width}px`).toEqual([]);
      });
    }
  });
}

test.describe('parent dashboard links', () => {
  test.use({ viewport: { width: 1728, height: 1117 } });
  // [start url, the control's name, how to find it, the path it must open]
  const link = (name) => (p) => p.getByRole('link', { name });
  const LINKS = [
    ['/parent', 'Review now', link('Review now'), '/parent/review'],
    ['/parent', 'Evaluate my child', link('Evaluate my child'), '/parent/evaluate'],
    ['/parent', 'Link a ward', link('Link a ward'), '/parent/link-ward'],
    ['/parent', 'Abena tab', (p) => p.getByRole('tab', { name: /Abena/ }), '/parent/wards/abena'],
    [
      '/parent',
      'Elliot tab',
      (p) => p.getByRole('tab', { name: /Elliot/ }),
      '/parent/wards/elliot',
    ],
    ['/parent', 'All wards', link('All wards'), '/parent/wards'],
    ['/parent', 'Open Elliot', link(/Open Elliot/), '/parent/wards/elliot'],
    ['/parent', 'Remind Kwesi', link(/Remind Kwesi/), '/parent/link-ward'],
    ['/parent', 'To review (4)', link(/To review \(4\)/), '/parent/review'],
    ['/parent', 'Decide', link('Decide'), '/parent/review'],
    ['/parent', 'Help icon', (p) => p.getByRole('button', { name: 'Help' }), '/parent/help'],
    ['/parent?state=none', 'Find my ward', link('Find my ward'), '/parent/link-ward'],
    ['/parent?state=error', 'Open Help', link('Open Help'), '/parent/help'],
  ];
  for (const [start, label, find, path] of LINKS) {
    test(`${start}: ${label} -> ${path}`, async ({ page }) => {
      await prepare(page);
      await page.goto(start, { waitUntil: 'load' });
      await page.waitForSelector('main#main h1', { timeout: 30000 });
      await find(page).first().click();
      await expect(page).toHaveURL(new RegExp(`${path.replace(/\//g, '\\/')}(\\?|$)`));
    });
  }
});

test.describe('parent evaluate and unlink flows', () => {
  test.use({ viewport: { width: 1728, height: 1117 } });

  test('start evaluation -> question -> submitted', async ({ page }) => {
    await prepare(page);
    await page.goto('/parent/evaluate', { waitUntil: 'load' });
    await page.getByRole('radio', { name: /Elliot/ }).click();
    await page.getByRole('button', { name: 'Start evaluation' }).click();
    await expect(page).toHaveURL(/\/parent\/evaluate\/questions/);
    // the mock questions arrive answered, so the empty-answer error is checked on the "nothing chosen" state
    await page.goto('/parent/evaluate/questions?state=none', { waitUntil: 'load' });
    await page.getByRole('button', { name: 'Next question' }).click();
    await expect(page.getByText('Please select a response before continuing')).toBeVisible();
    // choosing an option then moving on through the mock questions reaches the submitted screen
    for (let i = 0; i < 30; i += 1) {
      const radio = page.getByRole('radio').first();
      if (await radio.isVisible().catch(() => false)) await radio.click();
      const next = page.getByRole('button', { name: /Next question|Submit/ });
      await next.click();
      if (/\/evaluate\/result/.test(page.url())) break;
    }
    await expect(page).toHaveURL(/\/parent\/evaluate\/result/);
  });

  test('a blocked word in the note disables Next', async ({ page }) => {
    await prepare(page);
    await page.goto('/parent/evaluate/questions', { waitUntil: 'load' });
    await page.getByRole('textbox').fill('she is stupid');
    await expect(page.getByRole('button', { name: 'Next question' })).toBeDisabled();
  });

  test('discard evaluation leaves the flow', async ({ page }) => {
    await prepare(page);
    await page.goto('/parent/evaluate/questions?state=discard', { waitUntil: 'load' });
    await page.getByRole('dialog').getByRole('button', { name: 'Discard evaluation' }).click();
    await expect(page).toHaveURL(/\/parent\/evaluate$/);
  });

  test('unlink Elliot -> list without Elliot and the toast', async ({ page }) => {
    await prepare(page);
    await page.goto('/parent/wards/elliot?modal=unlink', { waitUntil: 'load' });
    await page
      .getByRole('dialog')
      .getByRole('button', { name: /Unlink Elliot/ })
      .click();
    await expect(page).toHaveURL(/\/parent\/wards\?unlinked=elliot/);
    // the toast that closed with the ward page fades out as a clone for 140 ms, so take the first match
    await expect(page.getByText('Elliot is no longer linked').first()).toBeVisible();
    await expect(page.getByText('Elliot Mensah')).toHaveCount(0);
  });

  test('help topic opens the article and Related opens the report dialog', async ({ page }) => {
    await prepare(page);
    await page.goto('/parent/help', { waitUntil: 'load' });
    await page
      .locator('main#main')
      .getByRole('button', { name: /Opting out and privacy/ })
      .click();
    await expect(page).toHaveURL(/\/parent\/help\/opting-out/);
    await page.getByRole('link', { name: /Report a safety concern/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
