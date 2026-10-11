// @ts-check
import { test, expect } from '@playwright/test';

/*
 * Responsive gate — wiki/responsive-plan.md §6 (definition of done).
 *
 * Every concrete route is loaded at each width and must satisfy:
 *   1. no page-level horizontal scroll
 *   2. no visible element sticking out past the right edge (unless it sits
 *      inside its own horizontal scroller / clipping box)
 *   3. no visible text under 12px
 *   4. no interactive control under 24px in its smaller dimension (WCAG 2.5.8
 *      hard floor; the 44px goal is tracked as a warning, not a failure)
 *
 * Narrow the matrix while iterating:
 *   RESPONSIVE_WIDTHS=320,375 RESPONSIVE_GREP=recruiter npm run test:e2e -- responsive
 */

import { ROUTES, DEFAULT_WIDTHS, probe } from './helpers/responsive.js';

const WIDTHS = process.env.RESPONSIVE_WIDTHS
  ? process.env.RESPONSIVE_WIDTHS.split(',').map(Number)
  : DEFAULT_WIDTHS;
// `root` is an alias for '/' (Git Bash rewrites a bare '/' in env vars).
const GREP = process.env.RESPONSIVE_GREP === 'root' ? '/' : process.env.RESPONSIVE_GREP || '';

for (const width of WIDTHS) {
  test.describe(`@${width}px`, () => {
    test.use({
      viewport: { width, height: width >= 1024 ? 900 : width >= 768 ? 1024 : 700 },
      hasTouch: width < 768,
      isMobile: width < 768,
    });

    for (const route of ROUTES) {
      if (GREP && !(route === GREP || (GREP !== '/' && route.includes(GREP)))) continue;
      test(route, async ({ page }, testInfo) => {
        await page.addInitScript(() => {
          try {
            window.localStorage.setItem('gth:hide-demo', '1');
          } catch {
            /* ignore */
          }
        });
        await page.goto(route, { waitUntil: 'load' });
        await page.waitForSelector('[data-route-fallback]', { state: 'detached', timeout: 20000 });
        await page.waitForTimeout(700);
        const { violations, warnings } = await page.evaluate(probe, { width });
        if (warnings.length)
          testInfo.annotations.push({ type: 'warning', description: warnings.join('; ') });
        expect(violations, `${route} @${width}px`).toEqual([]);
      });
    }
  });
}
