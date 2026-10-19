import { chromium } from '@playwright/test';
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH });
const page = await (await browser.newContext({ viewport: { width: 1728, height: 1065 } })).newPage();
await page.addInitScript(() => { localStorage.setItem('gth:hide-demo','1'); localStorage.setItem('gth:ui-style-chosen','1'); localStorage.setItem('gth:ui-style',process.env.S||'playful'); });
await page.goto(process.env.U); await page.waitForTimeout(2500);
console.log(JSON.stringify(await page.evaluate(() => { const el = document.querySelector('[role=dialog][aria-label=Help]'); if(!el) return 'none'; const r=el.getBoundingClientRect(); return { box:[r.x,r.y,r.width,r.height], kids: [...el.children].map(c=>Math.round(c.getBoundingClientRect().height*10)/10), btn:[...el.querySelectorAll('button')].map(b=>Math.round(b.getBoundingClientRect().height)) }; })));
await browser.close();
