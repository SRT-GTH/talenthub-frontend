import { chromium } from 'playwright';
const exe = process.env.PW_CHROMIUM_PATH;
const [,, style, url, w, h, out] = process.argv;
const browser = await chromium.launch({ executablePath: exe });
const ctx = await browser.newContext({ viewport: { width: +w, height: +h } });
await ctx.addInitScript((s) => {
  localStorage.setItem('gth:ui-style', s);
  localStorage.setItem('gth:ui-style-chosen', '1');
  localStorage.setItem('gth:hide-demo', '1');
}, style);
const page = await ctx.newPage();
const logs = [];
page.on('console', (m) => { if (['error','warning'].includes(m.type())) logs.push(m.type()+': '+m.text().slice(0,200)); });
page.on('pageerror', (e) => logs.push('pageerror: '+e.message.slice(0,200)));
await page.goto('http://127.0.0.1:5199'+url, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: out, fullPage: false });
console.log(JSON.stringify(logs));
await browser.close();
