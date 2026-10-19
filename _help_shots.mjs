import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
const OUT = process.env.OUT;
const BASE = 'http://127.0.0.1:5199';
mkdirSync(OUT, { recursive: true });
// jobs: "name|url|style|w|h|actions"
const jobs = JSON.parse(process.env.JOBS);
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });
for (const j of jobs) {
  const ctx = await browser.newContext({ viewport: { width: j.w, height: j.h } });
  await ctx.addInitScript((style) => {
    localStorage.setItem('gth:hide-demo', '1');
    localStorage.setItem('gth:ui-style-chosen', '1');
    localStorage.setItem('gth:ui-style', style);
  }, j.style);
  const page = await ctx.newPage();
  const logs = [];
  page.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && !/401|Failed to load resource|Future Flag|\[api\]/.test(m.text())) logs.push(m.type() + ': ' + m.text().slice(0, 200)); });
  page.on('pageerror', (e) => logs.push('pageerror: ' + e.message.slice(0, 200)));
  await page.goto(BASE + j.url, { waitUntil: 'load' });
  try { await page.waitForSelector('[data-route-fallback]', { state: 'detached', timeout: 20000 }); } catch {}
  await page.waitForTimeout(1200);
  for (const a of j.actions ?? []) {
    if (a.type) { await page.locator(a.sel).first().click(); await page.keyboard.type(a.type, { delay: 40 }); }
    if (a.click) await page.locator(a.click).first().click();
    if (a.press) await page.keyboard.press(a.press);
    await page.waitForTimeout(500);
  }
  await page.evaluate(() => document.activeElement?.blur?.());
  await page.waitForTimeout(150);
  const file = join(OUT, `${j.name}.png`);
  await page.screenshot({ path: file, fullPage: !!j.full });
  const info = await page.evaluate(() => ({ url: location.pathname + location.search, ui: document.documentElement.getAttribute('data-ui-style'), sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  console.log(j.name, JSON.stringify(info), logs.length ? logs.join(' | ') : 'console clean');
  await ctx.close();
}
await browser.close();
