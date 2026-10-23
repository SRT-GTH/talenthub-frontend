import { test, expect } from '@playwright/test';

/*
 * ?perf=1 load-time panel: API calls made by the page show up with the
 * backend's Server-Timing breakdown. All API traffic is mocked; every call
 * answers 404 (unknown endpoints must not be mocked as success, the app
 * expects real shapes) but carries a Server-Timing header like the gateway's.
 */

const b64url = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const fakeJwt = `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url({
  sub: 'perf-user',
  entityType: 'talent',
  exp: 4102444800,
})}.sig`;

const SERVER_TIMING =
  'total;dur=180, action;desc="settings.overview";dur=170, auth;desc="2 calls";dur=20, db;desc="9 queries";dur=120, slow1;desc="profile.model.find";dur=60';

async function mockApi(page) {
  await page.route('**/api/**', (route) =>
    route.fulfill({
      status: 404,
      contentType: 'application/json',
      headers: { 'Server-Timing': SERVER_TIMING, 'X-Request-ID': 'req-123' },
      body: JSON.stringify({ success: false, message: 'mocked' }),
    })
  );
}

async function signIn(page) {
  await page.addInitScript((token) => {
    localStorage.setItem('th:auth-token', token);
    localStorage.setItem(
      'th:user-profile',
      JSON.stringify({ id: 'perf-user', entityType: 'talent', firstName: 'Perf', lastName: 'Tester' })
    );
  }, fakeJwt);
}

test('panel is absent without ?perf=1', async ({ page }) => {
  await mockApi(page);
  await signIn(page);
  await page.goto('/settings');
  await page.waitForTimeout(1500);
  await expect(page.locator('[data-perf-pill]')).toHaveCount(0);
});

test('?perf=1 shows page timing with the Server-Timing breakdown', async ({ page }) => {
  await mockApi(page);
  await signIn(page);
  await page.goto('/settings?perf=1');

  const pill = page.locator('[data-perf-pill]');
  await expect(pill).toBeVisible();
  await expect(pill).toContainText(/calls/);
  await expect(pill).not.toContainText('· 0 calls', { timeout: 10_000 });

  await pill.click();
  const panel = page.locator('[data-perf-panel]');
  await expect(panel).toBeVisible();
  const row = panel.locator('[data-perf-call]').filter({ hasText: '/settings/overview' }).first();
  await expect(row).toBeVisible();
  await row.click();
  const detail = panel.locator('[data-perf-detail]').first();
  await expect(detail).toContainText('settings.overview');
  await expect(detail).toContainText('9 queries');
  await expect(detail).toContainText('profile.model.find');
  await expect(detail).toContainText('req-123');

  // It stays on across reloads until ?perf=0.
  await page.reload();
  await expect(page.locator('[data-perf-pill]')).toBeVisible();
  await page.goto('/settings?perf=0');
  await page.waitForTimeout(1000);
  await expect(page.locator('[data-perf-pill]')).toHaveCount(0);
});

test('a route change starts a new page in the panel', async ({ page }) => {
  await mockApi(page);
  await signIn(page);
  await page.goto('/settings?perf=1');
  await expect(page.locator('[data-perf-pill]')).not.toContainText('· 0 calls', { timeout: 10_000 });
  await page.evaluate(() => {
    window.history.pushState({}, '', '/community');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await page.locator('[data-perf-pill]').click();
  const options = page.locator('[data-perf-panel] select option');
  await expect(options.filter({ hasText: '/community' })).toHaveCount(1, { timeout: 10_000 });
  expect(await options.count()).toBeGreaterThanOrEqual(2);
});
