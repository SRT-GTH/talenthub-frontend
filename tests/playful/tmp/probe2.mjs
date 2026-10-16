import { chromium } from '@playwright/test';
import * as F from '../flow.js';
const which = process.argv[2];
const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH });
const ctx = await b.newContext({ viewport: { width: 1728, height: 1065 } });
await ctx.addInitScript(() => { localStorage.setItem('gth:ui-style','playful'); localStorage.setItem('gth:ui-style-chosen','1'); localStorage.setItem('gth:hide-demo','1'); });
const page = await ctx.newPage();
page.on('pageerror', e => console.log('PAGEERR', e.message.slice(0,200)));
const t0 = Date.now();
try { await F[which](page); } catch (e) { console.log('ERR', e.message.split('\n')[0]); }
console.log('secs', (Date.now()-t0)/1000);
console.log(await page.evaluate(() => [...document.querySelectorAll('button')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.textContent.trim().slice(0,30)).filter(Boolean).join(' | ')));
console.log((await page.evaluate(() => document.body.innerText)).slice(-700));
await page.screenshot({ path: `tests/playful/tmp/${which}.png` });
await b.close();
