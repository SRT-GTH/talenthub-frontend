import { test, expect } from '@playwright/test';

/*
 * /community asks the API for one section at a time (GET /api/community is paged) instead of the
 * whole catalogue. The API is mocked: it pages a 30-community catalogue the way the backend does.
 */

const b64url = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const fakeJwt = `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url({ sub: 'browse-user', entityType: 'talent', exp: 4102444800 })}.sig`;

const CATALOGUE = Array.from({ length: 30 }, (_, i) => ({
  id: `id${i + 1}`,
  slug: `community-${i + 1}`,
  name: i === 6 ? 'Fashion Makers' : `Community ${i + 1}`,
  description: 'A place to learn together',
  categories: [i % 2 ? 'design' : 'stem'],
  topics: [],
  memberCount: 300 - i,
  isMember: i === 0,
  recommendation: { score: 0, reasons: [] },
}));

function page(url) {
  const p = new URL(url).searchParams;
  const q = (p.get('q') || '').toLowerCase();
  const category = p.get('category');
  const excludeJoined = p.get('excludeJoined') === 'true';
  const limit = Number(p.get('limit') || 100);
  const offset = Number(p.get('offset') || 0);
  const matching = CATALOGUE.filter(
    (c) =>
      (!q || c.name.toLowerCase().includes(q)) &&
      (!category || c.categories.includes(category)) &&
      !(excludeJoined && c.isMember)
  );
  const communities = matching.slice(offset, offset + limit);
  const next = offset + communities.length;
  return {
    success: true,
    communities,
    total: matching.length,
    nextOffset: next < matching.length ? next : null,
    catalogueTotal: CATALOGUE.length,
    basedOn: [],
    ...(offset === 0 ? { mine: CATALOGUE.filter((c) => c.isMember) } : {}),
    ...(matching.length === 0 ? { closest: CATALOGUE.filter((c) => !c.isMember).slice(0, 3) } : {}),
  };
}

async function setup(page_) {
  const requests = [];
  await page_.route('**/api/**', (route) => {
    const url = route.request().url();
    if (new URL(url).pathname === '/api/community') {
      requests.push(Object.fromEntries(new URL(url).searchParams));
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(page(url)) });
    }
    return route.fulfill({ status: 404, contentType: 'application/json', body: '{"success":false}' });
  });
  await page_.addInitScript((token) => {
    localStorage.setItem('th:auth-token', token);
    localStorage.setItem('th:user-profile', JSON.stringify({ id: 'browse-user', entityType: 'talent', firstName: 'B', lastName: 'U' }));
  }, fakeJwt);
  return requests;
}

const card = (p, slug) => p.locator(`a[href="/community/${slug}"]`).first();

test('default view asks for the 8 picked communities, not the whole catalogue', async ({ page: p }) => {
  const requests = await setup(p);
  await p.goto('/community');
  await expect(card(p, 'community-2')).toBeVisible({ timeout: 15_000 });
  expect(requests[0]).toMatchObject({ excludeJoined: 'true', limit: '8' });
  await expect(card(p, 'community-1')).toBeVisible(); // joined: "Your communities"
  await expect(card(p, 'community-10')).toHaveCount(0); // beyond the 8 picked
});

test('"All communities" loads a page at a time with Show more', async ({ page: p }) => {
  const requests = await setup(p);
  await p.goto('/community?view=all');
  const more = p.locator('[data-browse-more]');
  await expect(more).toBeVisible({ timeout: 15_000 });
  await expect(more).toContainText('24 of 29');
  await expect(card(p, 'community-26')).toHaveCount(0);
  await more.click();
  await expect(card(p, 'community-30')).toBeVisible();
  await expect(more).toHaveCount(0);
  expect(requests.map((r) => r.offset || '0')).toEqual(['0', '24']);
});

test('search runs on the server, debounced, and no match shows closest suggestions', async ({ page: p }) => {
  const requests = await setup(p);
  await p.goto('/community?q=fashion');
  await expect(card(p, 'community-7')).toBeVisible({ timeout: 15_000 });
  await expect(card(p, 'community-2')).toHaveCount(0);
  expect(requests.some((r) => r.q === 'fashion')).toBe(true);

  await p.goto('/community?q=zzzz');
  await expect(card(p, 'community-2')).toBeVisible({ timeout: 15_000 }); // a closest suggestion
  expect(requests.filter((r) => r.q === 'zzzz')).toHaveLength(1);
});
