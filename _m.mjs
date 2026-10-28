import { chromium } from '@playwright/test';
const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1728,height:1117}})).newPage();
await p.goto('http://127.0.0.1:5199/'+process.argv[2],{waitUntil:'networkidle'});
console.log(await p.evaluate(()=>{const m=document.querySelector('main#main');const r=m.getBoundingClientRect();const c=getComputedStyle(m);return [r.x,r.width,c.paddingLeft,c.paddingRight,m.scrollHeight>m.clientHeight, m.offsetWidth-m.clientWidth].join(' ')}));await b.close();
