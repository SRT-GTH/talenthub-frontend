import { chromium } from 'playwright';
const OUT = process.env.OUT;
const steps = (process.env.STEPS || 'pick,customise,text,post,banner,making,ready,error').split(',');
const styles = (process.env.STYLES || 'focused,playful').split(',');
const widths = (process.env.WIDTHS || '1728x1065').split(',');
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH });
for (const style of styles) for (const wh of widths) {
  const [w, h] = wh.split('x').map(Number);
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript((s) => { localStorage.setItem('gth:ui-style', s); localStorage.setItem('gth:ui-style-chosen', '1'); localStorage.setItem('gth:hide-demo','1'); }, style);
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
  page.on('pageerror', (e) => errs.push('PAGEERR ' + e.message.slice(0, 200)));
  for (const st of steps) {
    await page.goto(`http://127.0.0.1:5199/profile?card=${st}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(st === 'making' ? 1300 : 500);
    await page.screenshot({ path: `${OUT}/${style}-${st}-${w}.png` });
  }
  console.log(style, wh, 'errors:', errs.length, errs.slice(0, 4));
  await ctx.close();
}
await browser.close();
