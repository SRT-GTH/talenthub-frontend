// Fast local responsive sweep (same probe as the CI gate, one browser, no runner overhead).
//   node scripts/responsive-audit.mjs                    # all routes, all widths
//   node scripts/responsive-audit.mjs --widths=320 --only=recruiter
// Env: AUDIT_BASE (default http://127.0.0.1:5199), PW_CHROMIUM_PATH (optional).
import { chromium } from '@playwright/test';
import { ROUTES, DEFAULT_WIDTHS, probe } from '../tests/e2e/helpers/responsive.js';

const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];
const widths = arg('widths') ? arg('widths').split(',').map(Number) : DEFAULT_WIDTHS;
// `--only=root` targets just '/' (Git Bash rewrites a bare '/' argument).
const only = arg('only') === 'root' ? '/' : (arg('only') ?? '');
const BASE = process.env.AUDIT_BASE ?? 'http://127.0.0.1:5199';
const routes = ROUTES.filter((r) => (only === '/' ? r === '/' : r.includes(only)));

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH || undefined,
});
let failing = 0;
let total = 0;
await Promise.all(
  widths.map(async (width) => {
    const ctx = await browser.newContext({
      viewport: { width, height: width >= 1024 ? 900 : width >= 768 ? 1024 : 700 },
      hasTouch: width < 768,
      isMobile: width < 768,
    });
    await ctx.addInitScript(() => localStorage.setItem('gth:hide-demo', '1'));
    const page = await ctx.newPage();
    for (const route of routes) {
      total += 1;
      try {
        await page.goto(BASE + route, { waitUntil: 'load', timeout: 30000 });
        await page.waitForSelector('[data-route-fallback]', { state: 'detached', timeout: 20000 });
        await page.waitForTimeout(500);
        const { violations, warnings } = await page.evaluate(probe, { width });
        if (violations.length) {
          failing += 1;
          console.log(`FAIL @${width} ${route}\n    ${violations.join('\n    ')}`);
        } else if (warnings.length && process.argv.includes('--warn')) {
          console.log(`warn @${width} ${route}: ${warnings.join('; ')}`);
        }
      } catch (e) {
        failing += 1;
        console.log(`ERR  @${width} ${route}: ${String(e.message).slice(0, 100)}`);
      }
    }
    await ctx.close();
  })
);
await browser.close();
console.log(`\n${total - failing}/${total} route×width combos pass`);
process.exit(failing ? 1 : 0);
