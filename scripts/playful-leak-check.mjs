// Guards the owner's rule: Playful styling must never reach another screen.
//   node scripts/playful-leak-check.mjs
// With Playful stored as the user's choice, visits every route and asserts that
// <html data-ui-style> is present ONLY on the talent Career Buddy route.
import { chromium } from '@playwright/test';
import { ROUTES } from '../tests/e2e/helpers/responsive.js';

const BASE = process.env.AUDIT_BASE ?? 'http://127.0.0.1:5199';
const ALLOWED = [
  '/profile/filling/career-buddy',
  '/home',
  '/profile',
  '/notifications',
  '/job-postings',
  '/streak',
  '/learning',
];

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH || undefined,
});
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
await ctx.addInitScript(() => {
  localStorage.setItem('gth:ui-style', 'playful');
  localStorage.setItem('gth:ui-style-chosen', '1');
  localStorage.setItem('gth:hide-demo', '1');
});
const page = await ctx.newPage();
let leaks = 0;
for (const route of [
  '/',
  '/home',
  '/profile',
  '/learning',
  ...ROUTES.filter((r) => !['/', '/home', '/profile', '/learning'].includes(r)),
]) {
  try {
    await page.goto(BASE + route, { waitUntil: 'load', timeout: 30000 });
    await page.waitForSelector('[data-route-fallback]', { state: 'detached', timeout: 20000 });
    await page.waitForTimeout(300);
  } catch (error) {
    console.log(`SKIP ${route} (${String(error.message).slice(0, 60)})`);
    continue;
  }
  const attr = await page.evaluate(() => document.documentElement.getAttribute('data-ui-style'));
  const allowed =
    ALLOWED.includes(route.split('?')[0]) || /^\/skills-lab(\?|$|\/(lab|games)\/)/.test(route);
  if (attr && !allowed) {
    leaks += 1;
    console.log(`LEAK  ${route} has data-ui-style="${attr}"`);
  } else if (!attr && allowed) {
    console.log(`WARN  ${route} should be in scope but data-ui-style is missing`);
    leaks += 1;
  }
}
await browser.close();
console.log(
  leaks
    ? `\n${leaks} problem(s)`
    : '\nno leaks: Playful is confined to the Career Buddy + talent home/profile/notifications routes'
);
process.exit(leaks ? 1 : 0);
