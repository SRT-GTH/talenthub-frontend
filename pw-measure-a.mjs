import { chromium } from '@playwright/test';
const [, , style = 'focused', ...paths] = process.argv;
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });
const ctx = await browser.newContext({ viewport: { width: 1728, height: 1700 } });
await ctx.addInitScript((st) => { localStorage.setItem('gth:hide-demo', '1'); localStorage.setItem('gth:ui-style-chosen', '1'); localStorage.setItem('gth:ui-style', st); }, style);
const page = await ctx.newPage();
for (const p of paths) {
  await page.goto('http://127.0.0.1:5199' + p, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const r = await page.evaluate(() => [...document.querySelectorAll('section[aria-label], nav[aria-label="Settings sections"], h1')].map((e) => { const b = e.getBoundingClientRect(); return `${e.getAttribute('aria-label') || e.tagName}: x${Math.round(b.x)} y${Math.round(b.y)} w${Math.round(b.width)} h${Math.round(b.height)}`; }));
  console.log(p + '\n  ' + r.join('\n  '));
}
await browser.close();
