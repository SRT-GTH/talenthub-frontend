// Fetch Figma REST node JSON + 2x PNGs for Playful frames (cached; token read at runtime, never printed).
//   node scripts/figma-fetch.mjs [--frame=ID | --all] [--images]
import fs from 'node:fs';
import path from 'node:path';
import { FILE_KEY, PLAYFUL_DIR, getToken, nodeJsonPath, parseStructure } from '../tests/playful/lib/figma.mjs';

const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.split('=')[1];
const token = getToken();
if (!token) {
  console.error('No Figma token (set FIGMA_TOKEN or .mcp.json FIGMA_ACCESS_TOKEN).');
  process.exit(2);
}
const ids = arg('frame') ? arg('frame').split(',') : Object.keys(parseStructure());
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function api(url) {
  for (let i = 0; i < 4; i++) {
    const r = await fetch(url, { headers: { 'X-Figma-Token': token } });
    if (r.status === 429) {
      const ra = Number(r.headers.get('retry-after') || 30);
      if (ra > 600) throw new Error(`Figma REST rate limit: Retry-After ${ra}s (~${Math.round(ra / 3600)}h) - blocked; stopping. Already-cached frames still work. Re-run later (cached files are skipped).`);
      const wait = Math.min(ra, 120);
      console.error(`429 rate-limited; waiting ${wait}s`);
      await sleep(wait * 1000);
      continue;
    }
    if (!r.ok) throw new Error(`Figma API ${r.status} for ${url.split('?')[0]} (token invalid/expired or no file access?)`);
    return r;
  }
  throw new Error('rate-limited repeatedly; stopping (not hammering)');
}
fs.mkdirSync(path.dirname(nodeJsonPath('0:0')), { recursive: true });
const todo = ids.filter((id) => !fs.existsSync(nodeJsonPath(id)));
for (let i = 0; i < todo.length; i += 5) {
  const batch = todo.slice(i, i + 5);
  const j = await (await api(`https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${batch.join(',')}&geometry=paths`)).json();
  for (const id of batch) fs.writeFileSync(nodeJsonPath(id), JSON.stringify({ nodes: { [id]: j.nodes[id] } }));
  console.log('nodes cached', batch.join(','));
}
if (process.argv.includes('--images')) {
  const dir = path.join(PLAYFUL_DIR, 'figma-images');
  fs.mkdirSync(dir, { recursive: true });
  const need = ids.filter((id) => !fs.existsSync(path.join(dir, id.replace(':', '_') + '.png')));
  for (let i = 0; i < need.length; i += 10) {
    const batch = need.slice(i, i + 10);
    const j = await (await api(`https://api.figma.com/v1/images/${FILE_KEY}?ids=${batch.join(',')}&format=png&scale=2`)).json();
    for (const id of batch) {
      const buf = Buffer.from(await (await fetch(j.images[id])).arrayBuffer());
      fs.writeFileSync(path.join(dir, id.replace(':', '_') + '.png'), buf);
    }
    console.log('images', batch.join(','));
  }
}
