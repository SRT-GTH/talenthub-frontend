// @ts-check
import { test, expect } from '@playwright/test';
import { ROUTES } from './helpers/responsive.js';

/*
 * Desktop must not change while we make the site responsive (wiki/responsive-plan.md §3.1):
 * at >= 1024px every route has to match its baseline.
 *
 *   npm run test:visual:update   # (re)create baselines — do this on a known-good build
 *   npm run test:visual          # compare
 *
 * Baselines live in tests/e2e/.visual-baseline (git-ignored; they are large
 * and machine-specific, so CI should generate them from the base branch).
 */
const WIDTHS = (process.env.VISUAL_WIDTHS || '1024,1440').split(',').map(Number);
// `root` is an alias for '/' (Git Bash rewrites a bare '/' in env vars).
const GREP = process.env.RESPONSIVE_GREP === 'root' ? '/' : process.env.RESPONSIVE_GREP || '';

for (const width of WIDTHS) {
  test.describe(`desktop @${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });
    for (const route of new Set(ROUTES)) {
      if (GREP && !(route === GREP || (GREP !== '/' && route.includes(GREP)))) continue;
      test(route, async ({ page }) => {
        await page.addInitScript(() => {
          try {
            window.localStorage.setItem('gth:hide-demo', '1');
            // Baselines are the Focused look; Playful must never change them.
            window.localStorage.setItem('gth:ui-style', 'focused');
            window.localStorage.setItem('gth:ui-style-chosen', '1');
          } catch {
            /* ignore */
          }
        });
        await page.goto(route, { waitUntil: 'load' });
        await page.waitForSelector('[data-route-fallback]', { state: 'detached', timeout: 20000 });
        await page.waitForTimeout(900);
        await expect(page).toHaveScreenshot(`${route.replace(/\W+/g, '_')}-${width}.png`, {
          animations: 'disabled',
          caret: 'hide',
          maxDiffPixelRatio: Number(process.env.VISUAL_TOL ?? 0.015),
        });
      });
    }
  });
}
