// Figma-vs-app geometry/copy audit for Playful Career Buddy.
//   node scripts/figma-geometry-audit.mjs --frame=7873:53961 [--width=1728] [--shots] [--no-style] [--no-diff]
//   node scripts/figma-geometry-audit.mjs --all | --section=Educational
// Figma data: tests/playful/figma-structure.xml (geometry; instance internals are NOT in it) and, when cached by
// `npm run audit:figma:fetch`, REST JSON in tests/playful/figma-nodes/ (adds instance text + styles).
// App states: tests/playful/states.js. Reports: tests/playful/reports/<frame>.json + SUMMARY.md.
// Exit code 1 if any frame has unmatched copy or >2px layout mismatches (unreachable frames are listed, not failed).
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { chromium } from '@playwright/test';
import { PLAYFUL_DIR, SAFARI_BAR, parseStructure, flatten, norm, loadRestFrame } from '../tests/playful/lib/figma.mjs';
import { settle } from '../tests/playful/helpers.js';
import { states } from '../tests/playful/states.js';
import { styleAuditInPage, compareStyles } from '../tests/playful/lib/style.mjs';

const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.split('=')[1];
const has = (n) => process.argv.includes(`--${n}`);
const BASE = process.env.AUDIT_BASE ?? 'http://127.0.0.1:5199';
const WIDTH = Number(arg('width') ?? 1728);
const REPORTS = path.join(PLAYFUL_DIR, 'reports');
const SHOTS = path.join(PLAYFUL_DIR, 'shots');
fs.mkdirSync(REPORTS, { recursive: true });
const structure = parseStructure();

let ids = Object.keys(states);
if (arg('frame')) ids = arg('frame').split(',');
else if (arg('section')) {
  const s = arg('section').toLowerCase();
  ids = ids.filter((i) => `${states[i].group} ${states[i].label}`.toLowerCase().includes(s));
}
ids = ids.filter((id) => structure[id]);

// ---- in-page: find DOM element per Figma text ----
function domMatch({ targets, offsetY, norms }) {
  const N = (s) =>
    (s || '')
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/…/g, '...')
      .replace(/[–—−]/g, '-')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  const sel = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    const c = (typeof el.className === 'string' ? el.className : '').split(/\s+/).filter(Boolean).slice(0, 3);
    if (c.length) s += '.' + c.join('.');
    return s.slice(0, 90);
  };
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width <= 2 || r.height <= 2) return false; // also drops sr-only (1x1) copies
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0;
  };
  const all = [...document.body.querySelectorAll('*')].filter((e) => !['script', 'style', 'svg', 'path'].includes(e.tagName.toLowerCase()));
  const cands = [];
  for (const el of all) {
    const isInput = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
    const t = N(isInput ? el.value || el.placeholder : el.textContent);
    if (!t || t.length > 400) continue;
    if (!isInput && [...el.children].some((c) => N(c.textContent) === t)) continue; // deepest only
    if (!vis(el)) continue;
    if (isInput) {
      const r = el.getBoundingClientRect();
      const cs0 = getComputedStyle(el);
      const lh0 = parseFloat(cs0.lineHeight) || parseFloat(cs0.fontSize) * 1.2;
      const tw = Math.min(r.width, t.length * parseFloat(cs0.fontSize) * 0.5);
      cands.push({ t, x: r.left + parseFloat(cs0.paddingLeft) + parseFloat(cs0.borderLeftWidth), y: r.top + (r.height - lh0) / 2, w: tw, h: lh0, lines: 1, lh: lh0, sel: sel(el), raw: t, input: true });
      continue;
    }
    const range = document.createRange();
    range.selectNodeContents(el);
    const rects = [...range.getClientRects()].filter((r) => r.width > 0.5);
    if (!rects.length) continue;
    const l = Math.min(...rects.map((r) => r.left));
    const tp = Math.min(...rects.map((r) => r.top));
    const rr = Math.max(...rects.map((r) => r.right));
    const b = Math.max(...rects.map((r) => r.bottom));
    const lineTops = new Set(rects.map((r) => Math.round(r.top / 4)));
    const cs = getComputedStyle(el);
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
    cands.push({ t, x: l, y: tp, w: rr - l, h: b - tp, lines: lineTops.size, lh, sel: sel(el), raw: el.textContent.trim().slice(0, 80) });
  }
  const used = new Set();
  const out = [];
  const order = targets.map((t, i) => i).sort((a, b) => targets[a].y - targets[b].y);
  for (const i of order) {
    const g = targets[i];
    const want = norms[i];
    let best = null;
    cands.forEach((c, ci) => {
      if (used.has(ci) || !(c.t === want || (targets[i].trunc && c.t.startsWith(want)))) return;
      const d = Math.hypot(c.x - g.x, c.y - (g.y - offsetY));
      if (!best || d < best.d) best = { d, ci };
    });
    if (best) {
      used.add(best.ci);
      const c = cands[best.ci];
      out[i] = { x: c.x, y: c.y, w: c.w, h: c.h, lines: c.lines, lh: c.lh, sel: c.sel };
    } else {
      const ws = new Set(want.split(' '));
      let h = null;
      cands.forEach((c, ci) => {
        if (used.has(ci)) return;
        const cw = new Set(c.t.split(' '));
        const inter = [...ws].filter((w) => cw.has(w)).length;
        const dice = (2 * inter) / (ws.size + cw.size);
        const d = Math.hypot(c.x - g.x, c.y - (g.y - offsetY));
        const score = dice - Math.min(d, 600) / 3000;
        if (dice >= 0.5 && (!h || score > h.score)) h = { score, c };
      });
      out[i] = { missing: true, near: h ? h.c.raw : null };
    }
  }
  return out;
}

function containerBoxes({ boxes, offsetY }) {
  const els = [...document.body.querySelectorAll('*')];
  const res = {};
  for (const [name, b] of Object.entries(boxes)) {
    let best = null;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.width < 50 || r.height < 50) continue;
      const d = Math.abs(r.left - b.x) + Math.abs(r.top - (b.y - offsetY)) + Math.abs(r.width - b.w) + Math.abs(r.height - b.h);
      if (!best || d < best.d) best = { d, r, el };
    }
    res[name] = best && {
      x: best.r.left, y: best.r.top, w: best.r.width, h: best.r.height, d: best.d,
      sel: best.el.tagName.toLowerCase() + '.' + (typeof best.el.className === 'string' ? best.el.className.split(/\s+/).slice(0, 3).join('.') : ''),
    };
  }
  return res;
}

const median = (a) => (a.length ? [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)] : 0);
const r1 = (n) => Math.round(n * 10) / 10;

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });
const summary = [];
let failed = false;
for (const id of ids) {
  const st = states[id];
  const rep = { id, label: st.label, group: st.group, width: WIDTH };
  const rest = loadRestFrame(id);
  const tree = rest || structure[id];
  const fileId = id.replace(':', '_');
  if (st.unreachable) {
    rep.unreachable = true;
    rep.reason = st.reason;
    fs.writeFileSync(path.join(REPORTS, fileId + '.json'), JSON.stringify(rep, null, 1));
    summary.push(rep);
    console.log(`${id} ${st.label}: UNREACHABLE - ${st.reason}`);
    continue;
  }
  for (let attempt = 0; attempt < 3; attempt++) {
  delete rep.error;
  const ctx = await browser.newContext({ viewport: { width: WIDTH, height: 1117 - SAFARI_BAR } });
  await ctx.addInitScript((chosen) => {
    localStorage.setItem('gth:ui-style', 'playful');
    if (chosen) localStorage.setItem('gth:ui-style-chosen', '1');
    localStorage.setItem('gth:hide-demo', '1');
  }, !st.vibeModal);
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text().slice(0, 160)));
  try {
    await page.goto(BASE + (st.route || '/profile/filling/career-buddy'), { waitUntil: 'load', timeout: 30000 });
    await page.waitForSelector('[data-route-fallback]', { state: 'detached', timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(800);
    await st.setup(page);
    await settle(page, 300);
    await page.waitForTimeout(700);
    const comp = !!st.component;
    const minY = comp ? -1 : SAFARI_BAR;
    const texts = flatten(tree).filter((n) => n.type === 'text' && !n.hidden && n.ay >= minY && n.w > 0 && n.h > 0 && norm(n.name));
    let ox = 0, oy = 0;
    if (comp) {
      const bb = await page.locator(st.component).first().boundingBox();
      ox = bb?.x ?? 0; oy = bb?.y ?? 0;
    }
    const targets = texts.map((t) => ({ x: t.ax + ox, y: t.ay + oy + (comp ? SAFARI_BAR : 0), w: t.w, h: t.h, trunc: !rest && norm(t.name).length >= 39 }));
    const norms = texts.map((t) => norm(t.name));
    let m = await page.evaluate(domMatch, { targets, offsetY: SAFARI_BAR, norms });
    const dys = texts.map((t, i) => (m[i] && !m[i].missing ? m[i].y + m[i].h / 2 - ((t.ay + (comp ? oy + SAFARI_BAR : 0)) - SAFARI_BAR + t.h / 2) : null)).filter((v) => v != null);
    const medDy = median(dys);
    rep.offset = { fixed: SAFARI_BAR, medianDy: r1(medDy), derived: r1(SAFARI_BAR - medDy) };
    const offsetY = SAFARI_BAR - Math.round(medDy);
    m = await page.evaluate(domMatch, { targets, offsetY, norms });
    rep.offsetUsed = offsetY;
    const matched = [], unmatched = [], layout = [], fontMetric = [];
    texts.forEach((t, i) => {
      const d = m[i];
      if (!d || d.missing) return unmatched.push({ text: t.name, figma: { x: r1((t.ax + ox)), y: r1((t.ay + (comp ? oy + SAFARI_BAR : 0)) - offsetY) }, closestDom: d?.near ?? null });
      // Figma text boxes can be wider than the glyphs (centre/right aligned): take the best of left/centre/right alignment.
      const fxL = t.ax + ox;
      const dxs = [d.x - fxL, d.x + d.w / 2 - (fxL + t.w / 2), d.x + d.w - (fxL + t.w)];
      const dx = dxs.reduce((a, b) => (Math.abs(b) < Math.abs(a) ? b : a));
      const dy = d.y + d.h / 2 - ((t.ay + (comp ? oy + SAFARI_BAR : 0)) - offsetY + t.h / 2);
      const figLines = Math.max(1, Math.round(t.h / d.lh));
      const dLines = d.lines - figLines;
      const wPct = t.w ? ((d.w - t.w) / t.w) * 100 : 0;
      const row = { text: t.name.slice(0, 60), sel: d.sel, dx: r1(dx), dy: r1(dy), dh: r1(d.h - t.h), wPct: r1(wPct), lines: dLines ? `dom ${d.lines} vs figma ~${figLines}` : undefined };
      matched.push(row);
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2 || dLines) layout.push(row);
      if (Math.abs(wPct) > 6) fontMetric.push({ ...row, severe: Math.abs(wPct) > 15 });
    });
    rep.counts = { figmaTexts: texts.length, matched: matched.length, unmatched: unmatched.length, layoutMismatch: layout.length, fontMetric: fontMetric.length, widthOver15: fontMetric.filter((f) => f.severe).length };
    rep.worstLayoutPx = r1(Math.max(0, ...layout.map((r) => Math.max(Math.abs(r.dx), Math.abs(r.dy)))));
    rep.unmatched = unmatched;
    rep.layout = layout.sort((a, b) => Math.max(Math.abs(b.dx), Math.abs(b.dy)) - Math.max(Math.abs(a.dx), Math.abs(a.dy)));
    rep.fontMetric = fontMetric;
    rep.medianDx = r1(median(matched.map((r) => r.dx)));
    const boxes = { chatPane: { x: 0, y: 224, w: 1112, h: 893 }, panel: { x: 1112, y: 224, w: 616, h: 893 }, topBar: { x: 0, y: 53, w: 1728, h: 90 } };
    const found = await page.evaluate(containerBoxes, { boxes, offsetY });
    rep.containers = Object.fromEntries(Object.entries(found).map(([k, v]) => [k, { figma: boxes[k], app: v && { x: r1(v.x), y: r1(v.y + offsetY), w: r1(v.w), h: r1(v.h), sel: v.sel } }]));
    if (rest && !has('no-style')) {
      const data = await page.evaluate(styleAuditInPage, { offsetY });
      rep.style = compareStyles(rest, data, offsetY);
    } else rep.style = { skipped: rest ? 'disabled' : 'no REST node JSON cached (npm run audit:figma:fetch)' };
    rep.consoleErrors = consoleErrors.slice(0, 5);
    const shotPath = path.join(SHOTS, fileId + '-app.png');
    if (has('shots') || fs.existsSync(path.join(PLAYFUL_DIR, 'figma-images', fileId + '.png'))) {
      fs.mkdirSync(SHOTS, { recursive: true });
      await page.screenshot({ path: shotPath });
      rep.shot = path.relative(process.cwd(), shotPath);
    }
    if (!has('no-diff') && rep.shot && fs.existsSync(path.join(PLAYFUL_DIR, 'figma-images', fileId + '.png'))) {
      const maskPath = path.join(SHOTS, fileId + '-mask.json');
      const boxes = [...texts.map((t) => [t.ax, t.ay - SAFARI_BAR, t.w, t.h]), ...m.filter((d) => d && !d.missing).map((d) => [d.x, d.y, d.w, d.h])];
      fs.writeFileSync(maskPath, JSON.stringify(boxes));
      const py = spawnSync('python', ['-I', path.join(PLAYFUL_DIR, 'lib', 'imgdiff.py'), path.join(PLAYFUL_DIR, 'figma-images', fileId + '.png'), shotPath, path.join(REPORTS, fileId + '-diff.png'), maskPath], { encoding: 'utf8' });
      try { rep.imageDiff = JSON.parse(py.stdout); } catch { rep.imageDiff = { error: (py.stderr || py.stdout || '').slice(0, 200) }; }
    } else rep.imageDiff = { skipped: 'no Figma PNG in tests/playful/figma-images (Figma REST API blocked/not fetched)' };
    if (rep.counts.unmatched || rep.counts.layoutMismatch) failed = true;
    if (rep.style?.counts && (rep.style.counts.colour || rep.style.counts.radius || rep.style.counts.shadow)) failed = true;
    if (rep.imageDiff?.maskedPct > 1.5) failed = true;
  } catch (e) {
    rep.error = String(e.message || e).split('\n')[0];
  }
  await ctx.close();
  if (!rep.error) break;
  console.log(`  retry ${attempt + 1} after: ${rep.error}`);
  }
  if (rep.error) failed = true;
  fs.writeFileSync(path.join(REPORTS, fileId + '.json'), JSON.stringify(rep, null, 1));
  summary.push(rep);
  const c = rep.counts;
  console.log(`${id} ${st.label}: ${rep.error ? 'ERROR ' + rep.error : `${c.matched}/${c.figmaTexts} matched, ${c.unmatched} unmatched, ${c.layoutMismatch} layout>2px (worst ${rep.worstLayoutPx}px), ${c.widthOver15} width>15%, offset ${rep.offsetUsed}`}`);
  for (const u of rep.unmatched || []) console.log(`    MISSING "${u.text}"${u.closestDom ? `  ~ dom: "${u.closestDom}"` : ''}`);
  for (const l of (rep.layout || []).slice(0, 8)) console.log(`    LAYOUT "${l.text}" dx=${l.dx} dy=${l.dy} ${l.lines || ''} [${l.sel}]`);
  if (rep.style?.summaryLine) console.log('    STYLE ' + rep.style.summaryLine);
  if (rep.imageDiff?.maskedPct != null) console.log(`    IMAGE diff ${rep.imageDiff.pct}% (text-masked ${rep.imageDiff.maskedPct}%)`);
}
await browser.close();

const all = fs.readdirSync(REPORTS).filter((f) => /^\d+_\d+\.json$/.test(f)).map((f) => JSON.parse(fs.readFileSync(path.join(REPORTS, f), 'utf8')));
all.sort((a, b) => (a.group || '').localeCompare(b.group || '') || a.id.localeCompare(b.id));
const lines = ['# Playful audit summary', '', `Updated ${new Date().toISOString()}. Per-frame JSON alongside; run: npm run audit:figma -- --all`, '', '| frame | group | label | texts matched | unmatched | layout>2px | worst px | width>15% | style mismatches | img diff % (text-masked) |', '|---|---|---|---|---|---|---|---|---|---|'];
for (const r of all)
  lines.push(
    r.unreachable ? `| ${r.id} | ${r.group} | ${r.label} | - | - | - | - | - | UNREACHABLE: ${r.reason} | - |`
    : r.error ? `| ${r.id} | ${r.group} | ${r.label} | - | - | - | - | - | ERROR ${r.error} | - |`
    : `| ${r.id} | ${r.group} | ${r.label} | ${r.counts.matched}/${r.counts.figmaTexts} | ${r.counts.unmatched} | ${r.counts.layoutMismatch} | ${r.worstLayoutPx} | ${r.counts.widthOver15} | ${r.style?.summaryLine || r.style?.skipped || ''} | ${r.imageDiff?.pct != null ? `${r.imageDiff.pct} (${r.imageDiff.maskedPct})` : '-'} |`
  );
const sumPath = path.join(REPORTS, 'SUMMARY.md');
fs.writeFileSync(sumPath, lines.join('\n') + '\n');
console.log('summary ->', path.relative(process.cwd(), sumPath));
process.exit(failed ? 1 : 0);
