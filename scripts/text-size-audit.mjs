// Text-size report for phones: where does readable copy get smaller than it should?
//   node scripts/text-size-audit.mjs [--widths=320,375] [--only=recruiter] [--min=14]
// Flags paragraph-like text (>= 40 chars) under --min px (default 14) and lists the
// smallest sizes per route. Complements the gate (which only enforces the 12px floor).
import { chromium } from '@playwright/test';
import { ROUTES } from '../tests/e2e/helpers/responsive.js';

const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];
const widths = (arg('widths') ?? '320').split(',').map(Number);
const only = arg('only') === 'root' ? '/' : (arg('only') ?? '');
const MIN = Number(arg('min') ?? 14);
const BASE = process.env.AUDIT_BASE ?? 'http://127.0.0.1:5199';
const routes = ROUTES.filter((r) => (only === '/' ? r === '/' : r.includes(only)));

const probe = (min) => {
  const out = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const n = walker.currentNode;
    const text = n.nodeValue.replace(/\s+/g, ' ').trim();
    if (text.length < 40) continue;
    const el = n.parentElement;
    if (!el || el.closest('svg, [aria-hidden="true"], script, style')) continue;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (r.width === 0 || r.height === 0 || cs.visibility === 'hidden' || cs.display === 'none')
      continue;
    const fs = parseFloat(cs.fontSize);
    if (fs < min) out.set(text.slice(0, 48), fs);
  }
  return [...out.entries()];
};

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH || undefined,
});
let flagged = 0;
for (const width of widths) {
  const ctx = await browser.newContext({
    viewport: { width, height: 700 },
    hasTouch: true,
    isMobile: true,
  });
  await ctx.addInitScript(() => localStorage.setItem('gth:hide-demo', '1'));
  const page = await ctx.newPage();
  for (const route of routes) {
    try {
      await page.goto(BASE + route, { waitUntil: 'load', timeout: 30000 });
      await page.waitForSelector('[data-route-fallback]', { state: 'detached', timeout: 20000 });
    } catch (error) {
      console.log(`SKIP ${route} (${String(error.message).slice(0, 60)})`);
      continue;
    }
    await page.waitForTimeout(500);
    const found = await page.evaluate(probe, MIN);
    if (found.length) {
      flagged += found.length;
      console.log(`@${width} ${route}  (${found.length})`);
      for (const [t, fs] of found.slice(0, 4)) console.log(`    ${fs}px  "${t}"`);
    }
  }
  await ctx.close();
}
await browser.close();
console.log(`\n${flagged} paragraph-like text nodes under ${MIN}px`);
