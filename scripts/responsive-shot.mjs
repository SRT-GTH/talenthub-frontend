// Screenshot helper for visually reviewing a route at phone/tablet widths.
//   node scripts/responsive-shot.mjs --route=/recruiter/home --widths=320,375 --out=/some/dir [--full]
// Writes <out>/<route-slug>-<width>.png. Env: AUDIT_BASE, PW_CHROMIUM_PATH.
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';

const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];
const routes = (arg('route') ?? '/').split(',');
const widths = (arg('widths') ?? '320').split(',').map(Number);
const out = arg('out') ?? '.';
const full = process.argv.includes('--full');
const BASE = process.env.AUDIT_BASE ?? 'http://127.0.0.1:5199';
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH || undefined,
});
for (const width of widths) {
  const ctx = await browser.newContext({
    viewport: { width, height: width >= 1024 ? 900 : width >= 768 ? 1024 : 700 },
    hasTouch: width < 768,
    isMobile: width < 768,
  });
  await ctx.addInitScript(() => localStorage.setItem('gth:hide-demo', '1'));
  const page = await ctx.newPage();
  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: 'load' });
    await page.waitForSelector('[data-route-fallback]', { state: 'detached', timeout: 20000 });
    await page.waitForTimeout(700);
    const file = join(out, `${route.replace(/\W+/g, '_')}-${width}.png`);
    await page.screenshot({ path: file, fullPage: full });
    console.log(file);
  }
  await ctx.close();
}
await browser.close();
