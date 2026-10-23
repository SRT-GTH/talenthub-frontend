import { test, expect } from '@playwright/test';

/*
 * Grafana Faro wiring. Needs a dev server built with VITE_FARO_URL, so it
 * only runs when that is set, e.g.:
 *   E2E_PORT=5198 VITE_FARO_URL=http://127.0.0.1:5198/faro-collect npx playwright test faro.spec
 * The collector is mocked by the test.
 */

test.skip(!process.env.VITE_FARO_URL, 'VITE_FARO_URL not set');

const b64url = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const fakeJwt = `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url({ sub: 'faro-user', entityType: 'talent', exp: 4102444800 })}.sig`;

test('RUM: API calls carry traceparent and each page reports page_data', async ({ page }) => {
  const traceparents = [];
  const payloads = [];
  await page.route('**/faro-collect**', async (route) => {
    try {
      payloads.push(route.request().postDataJSON());
    } catch {
      /* not JSON */
    }
    return route.fulfill({ status: 202, body: '' });
  });
  await page.route('**/api/**', (route) => {
    const tp = route.request().headers().traceparent;
    if (tp) traceparents.push(tp);
    return route.fulfill({
      status: 404,
      contentType: 'application/json',
      headers: { 'Server-Timing': 'total;dur=120, action;desc="settings.overview";dur=110' },
      body: JSON.stringify({ success: false }),
    });
  });
  await page.addInitScript((token) => {
    localStorage.setItem('th:auth-token', token);
    localStorage.setItem('th:user-profile', JSON.stringify({ id: 'faro-user', entityType: 'talent', firstName: 'F', lastName: 'R' }));
  }, fakeJwt);

  await page.goto('/settings');

  await expect.poll(() => traceparents.length, { timeout: 20_000 }).toBeGreaterThan(0);
  expect(traceparents[0]).toMatch(/^00-[0-9a-f]{32}-[0-9a-f]{16}-0[01]$/);

  const pageData = () =>
    payloads
      .flatMap((p) => p?.measurements || [])
      .find((m) => m.type === 'page_data' && m.context?.path === '/settings');
  await expect.poll(() => Boolean(pageData()), { timeout: 20_000 }).toBe(true);
  const m = pageData();
  expect(m.values.api_calls).toBeGreaterThan(0);
  expect(m.values.time_to_data).toBeGreaterThan(0);
  expect(m.values.backend_ms).toBeGreaterThan(0);

  // The ?perf=1 panel is not shown just because RUM is on.
  await expect(page.locator('[data-perf-pill]')).toHaveCount(0);
});
