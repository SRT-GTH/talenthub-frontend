import { loadRestFrame, flatten, parseStructure } from '../lib/figma.mjs';
const S = parseStructure();
for (const id of process.argv.slice(2)) {
  const r = loadRestFrame(id) || S[id];
  const name = S[id]?.name;
  console.log('=====', id, name, loadRestFrame(id) ? '(REST)' : '(XML only)');
  const t = flatten(r).filter(n => n.type==='text' && !n.hidden && n.ay>=224 && n.w>0);
  console.log(t.filter(n=>n.ax<1100 && n.ay>=224).map(n=>`[${Math.round(n.ax)},${Math.round(n.ay-52)}] ${n.name.replace(/\n/g,'\n').slice(0,70)}`).join('\n'));
  console.log('  PANEL:', t.filter(n=>n.ax>=1100).map(n=>n.name.replace(/\n/g,'\n').slice(0,40)).join(' | '));
}
