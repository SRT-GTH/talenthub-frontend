import { chromium } from '@playwright/test';
const BASE = 'http://127.0.0.1:5199';
const OUT = 'C:/Users/gsito/AppData/Local/Temp/claude/c--Users-gsito-OneDrive-Desktop-MY-CODES-SilverRockTech-talenthub-frontend/0d863bce-5422-4bbc-b2f9-7d1c316f55a2/scratchpad/shots';
import fs from 'node:fs';
fs.mkdirSync(OUT, { recursive: true });
const [, , width = '1728', height = '1087', style = 'focused', ...paths] = process.argv;
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });
const ctx = await browser.newContext({ viewport: { width: +width, height: +height } });
await ctx.addInitScript((st) => {
  localStorage.setItem('gth:hide-demo', '1');
  localStorage.setItem('gth:ui-style-chosen', '1');
  localStorage.setItem('gth:ui-style', st);
}, style);
const page = await ctx.newPage();
const logs = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) logs.push(m.type() + ': ' + m.text().slice(0, 200)); });
for (const p of paths) {
  await page.goto(BASE + p, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const name = p.replace(/[^a-z0-9]+/gi, '_') + '_' + style + '_' + width;
  await page.screenshot({ path: OUT + '/' + name + '.png', fullPage: false });
  const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h: document.documentElement.scrollHeight, ui: document.documentElement.dataset.uiStyle }));
  console.log(name, JSON.stringify(m));
}
console.log(logs.join('\n'));
await browser.close();
