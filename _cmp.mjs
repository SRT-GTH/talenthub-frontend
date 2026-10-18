import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.env.OUT;
fs.mkdirSync(OUT, { recursive: true });
// [style, figmaId, query]
const S = [
  ['playful', '7522:104', ''], ['playful', '7523:227', '?view=course'], ['playful', '7524:306', '?view=lesson'],
  ['playful', '7525:382', '?view=complete'], ['playful', '7525:937', '?view=certificates'], ['playful', '7527:625', '?view=recommended'],
  ['playful', '7527:1080', '?empty=1'], ['playful', '7527:1427', '?loading=1'], ['playful', '7536:972', '?view=course&toast=saved'],
  ['playful', '7536:1505', '?tab=saved'], ['playful', '7536:1892', '?tab=saved&empty=1'], ['playful', '7537:1245', '?quick=question'],
  ['playful', '7537:1563', '?quick=correct'], ['playful', '7537:1887', '?quick=wrong'], ['playful', '7537:2214', '?quick=passed'],
  ['playful', '7537:2527', '?quick=retry'], ['playful', '7538:1631', '?view=explore'], ['playful', '7538:2064', '?view=explore&ex=category'],
  ['playful', '7538:2488', '?view=explore&ex=search'], ['playful', '7538:2872', '?view=explore&ex=none'],
  ['focused', '8110:10737', ''], ['focused', '8110:11212', '?view=course'], ['focused', '8110:11625', '?view=lesson'],
  ['focused', '8110:12020', '?view=complete'], ['focused', '8110:12546', '?view=certificates'], ['focused', '8110:12904', '?view=recommended'],
  ['focused', '8110:13310', '?empty=1'], ['focused', '8110:13617', '?loading=1'], ['focused', '8110:15698', '?view=course&toast=saved'],
  ['focused', '8110:16121', '?tab=saved'], ['focused', '8110:16470', '?tab=saved&empty=1'], ['focused', '8110:17354', '?quick=question'],
  ['focused', '8110:17644', '?quick=correct'], ['focused', '8110:17940', '?quick=wrong'], ['focused', '8110:18239', '?quick=passed'],
  ['focused', '8110:18522', '?quick=retry'], ['focused', '8110:19619', '?view=explore'], ['focused', '8110:20029', '?view=explore&ex=category'],
  ['focused', '8110:20429', '?view=explore&ex=search'], ['focused', '8110:20769', '?view=explore&ex=none'],
];
const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH });
for (const [style, id, query] of S) {
  const f = `${OUT}/${id.replace(':', '_')}.png`;
  if (fs.existsSync(f)) continue;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const ctx = await b.newContext({ viewport: { width: 1728, height: 1065 } });
      await ctx.addInitScript((s) => { localStorage.setItem('gth:hide-demo', '1'); localStorage.setItem('gth:ui-style', s); localStorage.setItem('gth:ui-style-chosen', '1'); }, style);
      const p = await ctx.newPage();
      await p.goto('http://127.0.0.1:5199/learning' + query, { waitUntil: 'load' });
      await p.waitForSelector('[data-route-fallback]', { state: 'detached', timeout: 20000 }).catch(() => {});
      await p.waitForTimeout(2000);
      await p.screenshot({ path: f });
      await ctx.close();
      console.log('shot', id, style, query);
      break;
    } catch (e) { console.log('retry', id, String(e.message).slice(0, 60)); }
  }
}
await b.close();
