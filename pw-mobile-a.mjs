import { chromium } from '@playwright/test';
const [, , width = '390', style = 'focused', ...paths] = process.argv;
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });
const ctx = await browser.newContext({ viewport: { width: +width, height: 800 }, hasTouch: true, isMobile: +width < 768 });
await ctx.addInitScript((st) => { localStorage.setItem('gth:hide-demo', '1'); localStorage.setItem('gth:ui-style-chosen', '1'); localStorage.setItem('gth:ui-style', st); }, style);
const page = await ctx.newPage();
for (const p of paths) {
  await page.goto('http://127.0.0.1:5199' + p, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const r = await page.evaluate(() => {
    const root = document.querySelector('h1')?.closest('div')?.parentElement ?? document.body;
    const out = { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, small: [], wide: [] };
    const scopes = [...document.querySelectorAll('h1')].map((h) => h.parentElement?.parentElement).filter(Boolean);
    const scope = scopes[0] || document.body;
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    while (walker.nextNode()) {
      const n = walker.currentNode; const t = n.textContent.trim(); if (!t) continue;
      const el = n.parentElement; const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      const fs = parseFloat(cs.fontSize);
      if (fs < 12 && !seen.has(t)) { seen.add(t); out.small.push(`${fs}px "${t.slice(0, 30)}"`); }
    }
    scope.querySelectorAll('*').forEach((el) => { const b = el.getBoundingClientRect(); if (b.width > 0 && b.right > document.documentElement.clientWidth + 1) out.wide.push((el.className?.toString?.() || el.tagName).slice(0, 60) + ' r=' + Math.round(b.right)); });
    out.wide = out.wide.slice(0, 5);
    return out;
  });
  console.log(width, style, p, JSON.stringify(r));
}
await browser.close();
