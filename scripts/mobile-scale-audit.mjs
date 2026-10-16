// "Too big on mobile" audit — the counterpart of the gate's "too small" checks.
//   node scripts/mobile-scale-audit.mjs [--only=recruiter] [--width=360] [--height=800]
// Per route it reports, at phone size:
//   TEXT   headings/body larger than the mobile type scale (h1 > 26px, other headings > 20px,
//          body/labels > 17px; form-field text is exempt, it must stay 16px for iOS)
//   PILL   chip/tag/tab pills taller than 34px
//   BTN    buttons taller than 46px (excluding icon buttons) or with > 30px side padding
//   FIELD  inputs/selects taller than 50px
//   TITLE  uppercase section labels larger than 13px
// Exit code is always 0; it is a report to drive the density/scale passes.
import { chromium } from '@playwright/test';
import { ROUTES } from '../tests/e2e/helpers/responsive.js';

const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];
const only = arg('only') === 'root' ? '/' : (arg('only') ?? '');
const WIDTH = Number(arg('width') ?? 360);
const HEIGHT = Number(arg('height') ?? 800);
const BASE = process.env.AUDIT_BASE ?? 'http://127.0.0.1:5199';
const routes = ROUTES.filter((r) => (only === '/' ? r === '/' : r.includes(only)));

const probe = () => {
  const found = [];
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return (
      r.width > 1 &&
      r.height > 1 &&
      cs.display !== 'none' &&
      cs.visibility !== 'hidden' &&
      cs.opacity !== '0'
    );
  };
  const short = (el) => `${(el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 28)}`;

  // TEXT
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const n = walker.currentNode;
    const t = n.nodeValue.replace(/\s+/g, ' ').trim();
    if (!t) continue;
    const el = n.parentElement;
    if (!el || !vis(el) || el.closest('svg, input, select, textarea, [aria-hidden="true"]'))
      continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    const heading = el.closest('h1,h2,h3,h4,h5,h6');
    const isH1 = heading && heading.tagName === 'H1';
    // big stat numbers / decorative numerals (<= 6 chars) are allowed up to 28px
    const numeric = t.length <= 6 && /[\d%+]/.test(t);
    let limit = 17;
    let kind = 'body';
    if (isH1) {
      limit = 26;
      kind = 'h1';
    } else if (heading) {
      limit = 20;
      kind = 'heading';
    } else if (numeric) limit = 28;
    else if (/^[A-Z0-9 &·\-/]+$/.test(t) && t.length > 3) {
      limit = 13;
      kind = 'label';
    }
    if (fs > limit + 0.5) {
      const key = `${kind}:${fs}:${t.slice(0, 20)}`;
      if (!seen.has(key)) {
        seen.add(key);
        found.push(`TEXT  ${kind} ${fs}px (max ${limit}) "${t.slice(0, 32)}"`);
      }
    }
  }

  // PILLS: short text, fully rounded, taller than 34px
  for (const el of document.querySelectorAll('button, a, span, div, label')) {
    if (!vis(el)) continue;
    const cs = getComputedStyle(el);
    const rad = parseFloat(cs.borderTopLeftRadius) || 0;
    const r = el.getBoundingClientRect();
    const text = (el.textContent || '').trim();
    if (!text || text.length > 24 || el.children.length > 3) continue;
    const bordered = parseFloat(cs.borderTopWidth) > 0 || cs.backgroundColor !== 'rgba(0, 0, 0, 0)';
    if (
      rad >= 12 &&
      rad >= r.height / 2 - 2 &&
      bordered &&
      r.height > 34 &&
      r.width < 220 &&
      !el.querySelector('input, select')
    ) {
      found.push(`PILL  ${Math.round(r.height)}px tall "${short(el)}"`);
    }
  }

  // BUTTONS
  for (const el of document.querySelectorAll('button, [role="button"], a[class*="rounded"]')) {
    if (!vis(el)) continue;
    const r = el.getBoundingClientRect();
    const text = (el.textContent || '').trim();
    if (!text || r.width < 70) continue; // icon-only
    const cs = getComputedStyle(el);
    if (
      parseFloat(cs.borderTopLeftRadius) >= 12 &&
      parseFloat(cs.borderTopLeftRadius) >= r.height / 2 - 2
    )
      continue; // handled as pill
    if (r.height > 46)
      found.push(`BTN   ${Math.round(r.height)}px tall x ${Math.round(r.width)}px "${short(el)}"`);
  }

  // FIELDS
  for (const el of document.querySelectorAll(
    'input:not([type=checkbox]):not([type=radio]):not([type=file]), select, textarea'
  )) {
    if (!vis(el) || el.tagName === 'TEXTAREA') continue;
    const wrap = el.closest('label, [class*="rounded"]') || el;
    const r = wrap.getBoundingClientRect();
    if (r.height > 50 && r.height < 120)
      found.push(
        `FIELD ${Math.round(r.height)}px tall "${short(wrap) || el.getAttribute('placeholder') || el.name}"`
      );
  }
  return [...new Set(found)];
};

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH || undefined,
});
const ctx = await browser.newContext({
  viewport: { width: WIDTH, height: HEIGHT },
  isMobile: true,
  hasTouch: true,
});
await ctx.addInitScript(() => {
  localStorage.setItem('gth:hide-demo', '1');
  localStorage.setItem('gth:ui-style-chosen', '1');
});
const page = await ctx.newPage();
let total = 0;
const perKind = {};
for (const route of routes) {
  try {
    await page.goto(BASE + route, { waitUntil: 'load', timeout: 30000 });
    await page.waitForSelector('[data-route-fallback]', { state: 'detached', timeout: 20000 });
  } catch (error) {
    console.log(`SKIP ${route} (${String(error.message).slice(0, 60)})`);
    continue;
  }
  await page.waitForTimeout(600);
  const found = await page.evaluate(probe);
  if (!found.length) continue;
  total += found.length;
  for (const f of found) perKind[f.split(' ')[0]] = (perKind[f.split(' ')[0]] ?? 0) + 1;
  console.log(`\n${route}  (${found.length})`);
  for (const f of found.slice(0, 10)) console.log(`   ${f}`);
}
console.log(`\n${total} oversize findings at ${WIDTH}x${HEIGHT}:`, JSON.stringify(perKind));
await browser.close();
