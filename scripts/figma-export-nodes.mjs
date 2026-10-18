// Export specific Figma nodes (icons, illustrations, images) as SVG or PNG via ONE REST images call.
// Costs API quota — batch every id you need into ONE call and reuse the cached output.
//   node scripts/figma-export-nodes.mjs --format=svg|png [--scale=2] --out=<dir> <nodeId> [<nodeId>...]
// Writes <dir>/<nodeId with ':'->'_'>.<ext>. Token: FIGMA_TOKEN env or .mcp.json (never printed).
import fs from 'node:fs';
import path from 'node:path';
import { FILE_KEY, getToken } from '../tests/playful/lib/figma.mjs';

const args = process.argv.slice(2);
const opt = (n, d) => args.find((a) => a.startsWith(`--${n}=`))?.split('=')[1] ?? d;
const ids = args.filter((a) => !a.startsWith('--'));
const format = opt('format', 'svg');
const scale = opt('scale', '2');
const out = opt('out');
if (!ids.length || !out) {
  console.error(
    'usage: node scripts/figma-export-nodes.mjs --format=svg|png [--scale=2] --out=<dir> <nodeId>...'
  );
  process.exit(2);
}
const token = getToken();
if (!token) {
  console.error('No Figma token (set FIGMA_TOKEN).');
  process.exit(2);
}
fs.mkdirSync(out, { recursive: true });
const todo = ids.filter(
  (id) => !fs.existsSync(path.join(out, id.replace(':', '_') + '.' + format))
);
for (let i = 0; i < todo.length; i += 40) {
  const batch = todo.slice(i, i + 40);
  const url = `https://api.figma.com/v1/images/${FILE_KEY}?ids=${batch.join(',')}&format=${format}${format === 'png' ? `&scale=${scale}` : '&svg_include_id=false&svg_simplify_stroke=true'}`;
  const r = await fetch(url, { headers: { 'X-Figma-Token': token } });
  if (!r.ok) {
    const ra = r.headers.get('retry-after');
    console.error(
      `Figma images API ${r.status}${ra ? ` (Retry-After ${ra}s)` : ''} — stopping, not retrying.`
    );
    process.exit(1);
  }
  const j = await r.json();
  for (const id of batch) {
    const u = j.images?.[id];
    if (!u) {
      console.log('no render for', id);
      continue;
    }
    const buf = Buffer.from(await (await fetch(u)).arrayBuffer());
    fs.writeFileSync(path.join(out, id.replace(':', '_') + '.' + format), buf);
    console.log('exported', id, `${buf.length}B`);
  }
}
console.log('done', ids.length - todo.length, 'already cached');
