// Finds decorative graphics (SVG / images / background art) that are visible on desktop but
// hidden (display:none / zero size / removed) on phones. The owner wants decor kept on mobile
// (scaled down), so every hit is a bug to fix.
//   node scripts/decor-audit.mjs [--only=recruiter] [--width=360]
import { chromium } from '@playwright/test';
import { ROUTES } from '../tests/e2e/helpers/responsive.js';

const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];
const only = arg('only') === 'root' ? '/' : (arg('only') ?? '');
const WIDTH = Number(arg('width') ?? 360);
const BASE = process.env.AUDIT_BASE ?? 'http://127.0.0.1:5199';
const routes = ROUTES.filter((r) => (only === '/' ? r === '/' : r.includes(only)));

// Runs in page: returns decor candidates with a stable signature + visibility.
const collect = () => {
  const sig = (el) => {
    const cls = (el.getAttribute('class') || '').replace(/\s+/g, ' ').trim();
    const path = [];
    for (let p = el, i = 0; p && p !== document.body && i < 3; p = p.parentElement, i += 1) {
      path.push(
        `${p.tagName.toLowerCase()}.${(p.getAttribute('class') || '').split(' ').slice(0, 3).join('.')}`
      );
    }
    return `${el.tagName.toLowerCase()}|${cls.slice(0, 120)}|${path.slice(1).join('<')}`;
  };
  // Real decorative art only: not inside interactive controls (those are functional icons that
  // legitimately disappear with their desktop-only parent), and either big (>= 40px) or
  // absolutely positioned/pointer-events:none backdrop art.
  const isDecor = (el) => {
    const tag = el.tagName.toLowerCase();
    if (
      el.closest(
        'button, a, label, input, select, nav, [role="button"], [role="tab"], [role="menuitem"]'
      )
    )
      return false;
    const hiddenA11y = el.getAttribute('aria-hidden') === 'true' || el.getAttribute('alt') === '';
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const big = r.width >= 40 || r.height >= 40;
    let floating =
      cs.position === 'absolute' || cs.position === 'fixed' || cs.pointerEvents === 'none';
    for (
      let p = el.parentElement, i = 0;
      p && p !== document.body && i < 3;
      p = p.parentElement, i += 1
    ) {
      const pcs = getComputedStyle(p);
      if (pcs.position === 'absolute' || pcs.pointerEvents === 'none') floating = true;
    }
    if (tag === 'img' || tag === 'svg') return hiddenA11y && (big || floating);
    if (cs.pointerEvents === 'none' && cs.backgroundImage !== 'none') return true;
    return false;
  };
  const out = new Map();
  for (const el of document.body.querySelectorAll('*')) {
    if (!isDecor(el)) continue;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    // ignore ancestors that are decor too (keep the outermost hidden one)
    let ancestorDecorHidden = false;
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      if (getComputedStyle(p).display === 'none') ancestorDecorHidden = true;
    }
    const visible =
      r.width > 1 &&
      r.height > 1 &&
      cs.display !== 'none' &&
      cs.visibility !== 'hidden' &&
      cs.opacity !== '0';
    out.set(sig(el), { visible, hiddenByAncestor: ancestorDecorHidden, w: Math.round(r.width) });
  }
  return [...out.entries()];
};

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH || undefined,
});
const run = async (width) => {
  const ctx = await browser.newContext({
    viewport: { width, height: 800 },
    isMobile: width < 768,
    hasTouch: width < 768,
  });
  await ctx.addInitScript(() => {
    localStorage.setItem('gth:hide-demo', '1');
    localStorage.setItem('gth:ui-style-chosen', '1');
  });
  const page = await ctx.newPage();
  const result = {};
  for (const route of routes) {
    try {
      await page.goto(BASE + route, { waitUntil: 'load', timeout: 30000 });
      await page.waitForSelector('[data-route-fallback]', { state: 'detached', timeout: 20000 });
    } catch (error) {
      console.log(`SKIP ${route} (${String(error.message).slice(0, 60)})`);
      continue;
    }
    await page.waitForTimeout(600);
    result[route] = new Map(await page.evaluate(collect));
  }
  await ctx.close();
  return result;
};

const desktop = await run(1440);
const phone = await run(WIDTH);
await browser.close();

let total = 0;
for (const route of routes) {
  if (!desktop[route] || !phone[route]) continue;
  const lost = [];
  for (const [sig, d] of desktop[route]) {
    if (!d.visible) continue;
    const p = phone[route].get(sig);
    if (!p || !p.visible) lost.push({ sig, missing: !p });
  }
  if (!lost.length) continue;
  total += lost.length;
  console.log(`\n${route}  (${lost.length} decor hidden at ${WIDTH}px)`);
  for (const l of lost.slice(0, 8))
    console.log(`   ${l.missing ? 'NOT RENDERED' : 'hidden      '}  ${l.sig.slice(0, 190)}`);
}
console.log(`\n${total} decorative elements visible on desktop but hidden/absent at ${WIDTH}px`);
