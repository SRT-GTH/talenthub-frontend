// Mobile density report: how many cards fit on a standard phone screen?
//   node scripts/density-audit.mjs [--only=recruiter] [--width=360] [--height=800] [--target=2.5]
// For each route it finds the outermost "card-like" blocks (rounded + bordered/shadowed/filled,
// nearly full width), takes the median height and divides the free viewport height (screen minus
// pinned top/bottom chrome) by it. Routes below --target are flagged: the owner wants ~2.5 cards
// visible at once on a standard screen, not one huge card plus a sliver.
import { chromium } from '@playwright/test';
import { ROUTES } from '../tests/e2e/helpers/responsive.js';

const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];
const only = arg('only') === 'root' ? '/' : (arg('only') ?? '');
const WIDTH = Number(arg('width') ?? 360);
const HEIGHT = Number(arg('height') ?? 800);
const TARGET = Number(arg('target') ?? 2.5);
const BASE = process.env.AUDIT_BASE ?? 'http://127.0.0.1:5199';
const routes = ROUTES.filter((r) => (only === '/' ? r === '/' : r.includes(only)));

const probe = () => {
  const H = window.innerHeight;
  const W = window.innerWidth;
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return (
      r.width > 0 &&
      r.height > 0 &&
      cs.visibility !== 'hidden' &&
      cs.display !== 'none' &&
      cs.opacity !== '0'
    );
  };
  // pinned chrome
  let top = 0;
  let bottom = 0;
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.position !== 'sticky' && cs.position !== 'fixed') continue;
    if (cs.pointerEvents === 'none' || el.matches('[data-demo-navigator]')) continue;
    const r = el.getBoundingClientRect();
    if (r.width < W * 0.6 || r.height < 24 || r.height > H * 0.5) continue;
    if (r.top < H / 2 && r.top <= 4) top += r.height;
    else if (r.bottom >= H - 4) bottom += r.height;
  }
  const isCardLike = (el) => {
    const cs = getComputedStyle(el);
    const rad = parseFloat(cs.borderTopLeftRadius) || 0;
    const hasBorder = parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none';
    const hasShadow = cs.boxShadow !== 'none';
    const hasBg = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none';
    return rad >= 8 && (hasBorder || hasShadow || hasBg);
  };
  const cards = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el) || !isCardLike(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < W * 0.72 || r.height < 70 || r.height > 700) continue;
    if (['BUTTON', 'INPUT', 'LABEL', 'A', 'SELECT', 'TEXTAREA'].includes(el.tagName)) continue;
    // outermost only
    let nested = false;
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      if (cards.includes(p)) nested = true;
    }
    if (!nested) cards.push(el);
  }
  const hs = cards.map((c) => c.getBoundingClientRect().height).sort((a, b) => a - b);
  const median = hs.length ? hs[Math.floor(hs.length / 2)] : 0;
  return {
    n: hs.length,
    median: Math.round(median),
    free: Math.round(H - top - bottom),
    top: Math.round(top),
    bottom: Math.round(bottom),
  };
};

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH || undefined,
});
const ctx = await browser.newContext({
  viewport: { width: WIDTH, height: HEIGHT },
  isMobile: true,
  hasTouch: true,
});
await ctx.addInitScript(() => localStorage.setItem('gth:hide-demo', '1'));
const page = await ctx.newPage();
let low = 0;
for (const route of routes) {
  try {
    await page.goto(BASE + route, { waitUntil: 'load', timeout: 30000 });
    await page.waitForSelector('[data-route-fallback]', { state: 'detached', timeout: 20000 });
  } catch (error) {
    console.log(`SKIP ${route} (${String(error.message).slice(0, 60)})`);
    continue;
  }
  await page.waitForTimeout(600);
  const r = await page.evaluate(probe);
  if (r.n < 2) continue; // not a card list
  const per = r.free / r.median;
  const flag = per < TARGET ? 'LOW ' : 'ok  ';
  if (per < TARGET) low += 1;
  console.log(
    `${flag} ${per.toFixed(1)} cards/screen  (median ${r.median}px, n=${r.n}, free ${r.free}px)  ${route}`
  );
}
await browser.close();
console.log(`\n${low} card-list routes below ${TARGET} cards per screen at ${WIDTH}x${HEIGHT}`);
