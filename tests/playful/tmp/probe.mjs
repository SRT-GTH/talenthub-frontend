import { chromium } from '@playwright/test';
import { settle, open, clickText, say } from '../helpers.js';
const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH });
const ctx = await b.newContext({ viewport: { width: 1728, height: 1065 } });
await ctx.addInitScript(() => { localStorage.setItem('gth:ui-style','playful'); localStorage.setItem('gth:ui-style-chosen','1'); localStorage.setItem('gth:hide-demo','1'); });
const page = await ctx.newPage();
const dump = async (tag) => {
  const t = await page.evaluate(() => [...document.querySelectorAll('button,[role=button]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.textContent.trim().slice(0,40)).filter(Boolean));
  const m = await page.evaluate(() => { const c=document.querySelector('[role=log]')||document.body; return c.innerText.slice(-600); });
  console.log('--',tag,'\nBUTTONS',JSON.stringify(t),'\nTEXT',JSON.stringify(m));
};
await open(page); await dump('welcome');
await clickText(page, 'Tell me more about GTH', { last: true }); await dump('faq');
await clickText(page, "I think I'm ready now", {wait:3500}); await dump('ready'); await page.screenshot({path:'tests/playful/tmp/p0.png'});
await clickText(page, 'Sounds great'); await dump('edu0');
await page.screenshot({ path: 'tests/playful/tmp/p1.png' });
await b.close();
