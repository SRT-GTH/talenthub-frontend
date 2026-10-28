import { chromium } from '@playwright/test';
const [,, path, out, action] = process.argv;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1728, height: 1117 } });
await ctx.addInitScript(() => localStorage.setItem('gth:hide-demo','1'));
const p = await ctx.newPage();
const errs=[]; p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://127.0.0.1:5199/'+path, { waitUntil: 'networkidle' });
if (action) { try { await eval(`(async()=>{${action}})()`) } catch(e){ console.log('action err',e.message)} }
await p.waitForTimeout(500);
await p.screenshot({ path: out, fullPage: false });
const m = await p.evaluate(() => {
  const root = document.querySelector('main#main'); const res=[];
  const scopes=[root,...document.querySelectorAll('[role=dialog],[role=alertdialog]')].filter(Boolean);
  for (const s of scopes) {
    const w = document.createTreeWalker(s, NodeFilter.SHOW_TEXT);
    let n; const seen=new Set();
    while ((n=w.nextNode())) { const t=n.textContent.trim(); if(!t) continue; const el=n.parentElement; if(seen.has(el)) continue; seen.add(el);
      const c=getComputedStyle(el), r=el.getBoundingClientRect();
      res.push([t.slice(0,48), c.fontSize, c.fontWeight, c.letterSpacing, c.lineHeight, c.color.replace(/ /g,''), Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)].join(' | ')); }
  } for(const i of document.querySelectorAll('main#main input,main#main textarea')){const c=getComputedStyle(i),r=i.getBoundingClientRect();res.push(['INPUT',c.fontSize,c.fontWeight,c.letterSpacing,c.color,Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height),c.borderColor,c.boxShadow].join(' | '))} return res; });
console.log(m.join('\n')); console.log('ERRS',errs.slice(0,5));
await b.close();
