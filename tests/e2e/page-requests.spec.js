import { test, expect } from '@playwright/test';

/*
 * Request shape of the slow pages: what each one asks the API for, and when.
 * API traffic is mocked; unknown endpoints answer 404 (the app expects real
 * shapes, so nothing is mocked as an empty success).
 */

const b64url = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const fakeJwt = `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url({
  sub: 'req-user',
  entityType: 'talent',
  exp: 4102444800,
})}.sig`;

async function signIn(page) {
  await page.addInitScript((token) => {
    localStorage.setItem('th:auth-token', token);
    localStorage.setItem(
      'th:user-profile',
      JSON.stringify({ id: 'req-user', entityType: 'talent', firstName: 'Req', lastName: 'Tester' })
    );
  }, fakeJwt);
}

const notFound = (route) =>
  route.fulfill({
    status: 404,
    contentType: 'application/json',
    body: JSON.stringify({ success: false }),
  });

test('community page: posts and members start with the detail, not after it', async ({ page }) => {
  const log = [];
  await page.route('**/api/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    log.push({ at: Date.now(), event: 'request', path });
    if (path === '/api/community/design') {
      await new Promise((r) => setTimeout(r, 1200));
      log.push({ at: Date.now(), event: 'detail-done', path });
    }
    return notFound(route);
  });
  await signIn(page);
  await page.goto('/community/design');

  await expect
    .poll(() => log.some((e) => e.event === 'detail-done'), { timeout: 15_000 })
    .toBe(true);
  const detailDone = log.find((e) => e.event === 'detail-done').at;
  const startedBefore = (p) =>
    log.some((e) => e.event === 'request' && e.path === p && e.at < detailDone);
  expect(startedBefore('/api/community/design/posts')).toBe(true);
  expect(startedBefore('/api/community/design/members')).toBe(true);
});

test('the full catalogue is read once across community pages; /community asks for one section', async ({ page }) => {
  let fullReads = 0;
  let sectionReads = 0;
  await page.route('**/api/**', (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === '/api/community') {
      if (url.search) sectionReads += 1;
      else fullReads += 1;
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, communities: [], total: 0, nextOffset: null, catalogueTotal: 0, basedOn: [] }),
      });
    }
    return notFound(route);
  });
  await signIn(page);
  await page.goto('/community');
  await expect.poll(() => sectionReads, { timeout: 15_000 }).toBe(1);
  expect(fullReads).toBe(0);

  // Two community pages ("Related communities" uses the full catalogue): read once, then cached.
  for (const slug of ['design', 'stem']) {
    await page.evaluate((path) => {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, `/community/${slug}`);
    await page.waitForTimeout(1500);
  }
  expect(fullReads).toBe(1);
});

test('settings page asks for the overview once', async ({ page }) => {
  let overviewReads = 0;
  await page.route('**/api/**', (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/api/settings/overview') overviewReads += 1;
    return notFound(route);
  });
  await signIn(page);
  await page.goto('/settings');
  await expect.poll(() => overviewReads, { timeout: 15_000 }).toBeGreaterThan(0);
  await page.waitForTimeout(2500);
  expect(overviewReads).toBe(1);
});
