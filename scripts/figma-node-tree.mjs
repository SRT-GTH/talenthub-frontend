// Print a styled tree for a CACHED Figma node (no API call). Cache: tests/playful/figma-nodes/<id>.json
//   node scripts/figma-node-tree.mjs <frameId> [maxDepth=6] [--find=<substring of node name/text>] [--from=<nodeId>]
// Per node: type, id, name, size @ position (relative to the frame), layout (flex dir/gap/padding),
// fills / strokes / radius / effects, and for TEXT: characters + font + size + weight + lh + colour.
import fs from 'node:fs';
import path from 'node:path';
import { PLAYFUL_DIR } from '../tests/playful/lib/figma.mjs';

const args = process.argv.slice(2);
const frameId = args.find((a) => !a.startsWith('--'));
const depthMax = Number(args.filter((a) => !a.startsWith('--'))[1] ?? 6);
const find = args
  .find((a) => a.startsWith('--find='))
  ?.slice(7)
  ?.toLowerCase();
const from = args.find((a) => a.startsWith('--from='))?.slice(7);
if (!frameId) {
  console.error(
    'usage: node scripts/figma-node-tree.mjs <frameId> [maxDepth] [--find=text] [--from=nodeId]'
  );
  process.exit(2);
}
const file = path.join(PLAYFUL_DIR, 'figma-nodes', frameId.replace(':', '_') + '.json');
const root = JSON.parse(fs.readFileSync(file, 'utf8')).nodes[frameId].document;
const ox = root.absoluteBoundingBox?.x ?? 0;
const oy = root.absoluteBoundingBox?.y ?? 0;
const hex = (c, o = 1) => {
  if (!c) return '';
  const h = (v) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, '0');
  const a = (c.a ?? 1) * o;
  return `#${h(c.r)}${h(c.g)}${h(c.b)}${a < 0.995 ? ' @' + a.toFixed(2) : ''}`;
};
const paint = (p) => {
  if (p.visible === false) return '';
  if (p.type === 'SOLID') return hex(p.color, p.opacity ?? 1);
  if (p.type?.startsWith('GRADIENT'))
    return `${p.type.toLowerCase()}(${(p.gradientStops || []).map((s) => hex(s.color) + ' ' + Math.round(s.position * 100) + '%').join(', ')})`;
  return p.type === 'IMAGE' ? 'IMAGE' : p.type;
};
const describe = (n) => {
  const b = n.absoluteBoundingBox;
  const bits = [`${n.type} ${n.id} ${JSON.stringify((n.name || '').slice(0, 50))}`];
  if (b)
    bits.push(
      `${+b.width.toFixed(1)}x${+b.height.toFixed(1)} @${+(b.x - ox).toFixed(1)},${+(b.y - oy).toFixed(1)}`
    );
  if (n.layoutMode && n.layoutMode !== 'NONE') {
    bits.push(
      `flex:${n.layoutMode === 'HORIZONTAL' ? 'row' : 'col'} gap:${n.itemSpacing ?? 0} pad:${n.paddingTop ?? 0}/${n.paddingRight ?? 0}/${n.paddingBottom ?? 0}/${n.paddingLeft ?? 0} align:${n.primaryAxisAlignItems ?? ''}/${n.counterAxisAlignItems ?? ''}`
    );
  }
  const fills = (n.fills || []).map(paint).filter(Boolean);
  if (fills.length && n.type !== 'TEXT') bits.push('fill:' + fills.join('+'));
  const strokes = (n.strokes || []).map(paint).filter(Boolean);
  if (strokes.length)
    bits.push(
      `stroke:${strokes.join('+')} ${n.strokeWeight ?? ''}${n.strokeAlign ? ' ' + n.strokeAlign : ''}`
    );
  if (n.cornerRadius) bits.push('r:' + n.cornerRadius);
  else if (n.rectangleCornerRadii) bits.push('r:' + n.rectangleCornerRadii.join('/'));
  const fx = (n.effects || [])
    .filter((e) => e.visible !== false)
    .map(
      (e) =>
        `${e.type} ${e.offset ? `${e.offset.x},${e.offset.y}` : ''} blur${e.radius} ${hex(e.color)}`
    );
  if (fx.length) bits.push('fx:' + fx.join(' | '));
  if (n.opacity != null && n.opacity < 1) bits.push('opacity:' + n.opacity);
  if (n.clipsContent) bits.push('clip');
  if (n.type === 'TEXT') {
    const s = n.style || {};
    bits.push(`"${(n.characters || '').replace(/\n/g, '\\n')}"`);
    bits.push(
      `${s.fontFamily} ${s.fontWeight} ${s.fontSize}px lh:${s.lineHeightPx ? +s.lineHeightPx.toFixed(1) : ''} ls:${s.letterSpacing ? +s.letterSpacing.toFixed(2) : 0}${s.textCase && s.textCase !== 'ORIGINAL' ? ' ' + s.textCase : ''}${s.italic ? ' italic' : ''}${s.textDecoration && s.textDecoration !== 'NONE' ? ' ' + s.textDecoration : ''} color:${fills.join('+')}`
    );
    if (n.characterStyleOverrides?.some((v) => v)) bits.push('MIXED-RUNS');
  }
  return bits.join('  ');
};
const matches = (n) =>
  !find ||
  (n.name || '').toLowerCase().includes(find) ||
  (n.characters || '').toLowerCase().includes(find);
const hasMatch = (n) => matches(n) || (n.children || []).some(hasMatch);
let start = root;
if (from) {
  const stack = [root];
  start = null;
  while (stack.length) {
    const n = stack.pop();
    if (n.id === from) {
      start = n;
      break;
    }
    (n.children || []).forEach((c) => stack.push(c));
  }
  if (!start) {
    console.error('node not found in frame: ' + from);
    process.exit(1);
  }
}
const walk = (n, d) => {
  if (d > depthMax || n.visible === false) return;
  if (!find || hasMatch(n)) console.log('  '.repeat(d) + describe(n));
  (n.children || []).forEach((c) => walk(c, d + 1));
};
walk(start, 0);
