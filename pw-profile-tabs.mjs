import { chromium } from 'playwright';
const OUT = process.env.OUT;
const tabs = (process.env.TABS || 'overview,skills,experience,portfolio,certs,about').split(',');
const styles = (process.env.STYLES || 'playful,focused').split(',');
const widths = (process.env.WIDTHS || '1728').split(',').map(Number);
const H = { overview: 1803, skills: 1698, experience: 1636, portfolio: 1595, certs: 1283, about: 1532 };
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH });
for (const style of styles) for (const w of widths) for (const tab of tabs) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w === 1728 ? H[tab] - 52 : 900 } });
  await ctx.addInitScript((st) => { localStorage.setItem('gth:ui-style', st); localStorage.setItem('gth:ui-style-chosen', '1'); localStorage.setItem('gth:hide-demo', '1'); }, style);
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
  page.on('pageerror', (e) => errs.push('PAGEERR ' + e.message.slice(0, 200)));
  await page.goto('http://127.0.0.1:5199/profile' + (tab === 'overview' ? '' : '?tab=' + tab), { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const file = OUT + '/' + tab + '-' + style + '-' + w + '.png';
  await page.screenshot({ path: file, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(file.split('/').pop(), 'overflowX', overflow, errs.length ? errs : '');
  await ctx.close();
}
await browser.close();
