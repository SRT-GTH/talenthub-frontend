// Style audit: Figma REST node styles (fills/strokes/radius/effects/opacity/typography) vs computed DOM styles.
// styleAuditInPage runs in the browser (must stay self-contained); compareStyles runs in Node.
import { SAFARI_BAR, norm, flatten } from './figma.mjs';

export function styleAuditInPage() {
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
    const c = (typeof el.className === 'string' ? el.className : '').split(/\s+/).filter(Boolean).slice(0, 4);
    if (c.length) s += '.' + c.join('.');
    return s.slice(0, 110);
  };
  const out = [];
  let order = 0;
  for (const el of document.body.querySelectorAll('*')) {
    const tag = el.tagName.toLowerCase();
    if (['script', 'style', 'path', 'defs', 'g', 'circle', 'rect', 'line', 'polyline', 'polygon', 'use', 'stop', 'lineargradient', 'clippath'].includes(tag)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const isInput = tag === 'input' || tag === 'textarea';
    const t = N(isInput ? el.value || el.placeholder : el.textContent);
    const deep = t && t.length < 400 && (isInput || ![...el.children].some((c) => N(c.textContent) === t));
    out.push({
      o: order++, sel: sel(el), x: r.left, y: r.top, w: r.width, h: r.height,
      bg: cs.backgroundColor, bgImg: cs.backgroundImage === 'none' ? '' : cs.backgroundImage, bgClip: cs.webkitBackgroundClip || cs.backgroundClip,
      bw: [cs.borderTopWidth, cs.borderRightWidth, cs.borderBottomWidth, cs.borderLeftWidth].map(parseFloat),
      bs: [cs.borderTopStyle, cs.borderRightStyle, cs.borderBottomStyle, cs.borderLeftStyle],
      bc: [cs.borderTopColor, cs.borderRightColor, cs.borderBottomColor, cs.borderLeftColor],
      rad: [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius].map(parseFloat),
      sh: cs.boxShadow === 'none' ? '' : cs.boxShadow, filter: cs.filter === 'none' ? '' : cs.filter,
      op: parseFloat(cs.opacity), ov: cs.overflowX + '/' + cs.overflowY,
      color: cs.color, fill: cs.webkitTextFillColor, ff: cs.fontFamily, fs: parseFloat(cs.fontSize), fw: cs.fontWeight,
      lh: cs.lineHeight, ls: cs.letterSpacing, ta: cs.textAlign, td: cs.textDecorationLine, tt: cs.textTransform,
      t: deep ? t : null,
    });
  }
  return out;
}

// ---------- colour helpers ----------
export function parseColor(s) {
  if (!s) return null;
  let m = s.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.%]+))?\s*\)/);
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] == null ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : +m[4] };
  m = s.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/);
  if (m) return { r: +m[1] * 255, g: +m[2] * 255, b: +m[3] * 255, a: m[4] == null ? 1 : +m[4] };
  return null;
}
const figColor = (c, extra = 1) => (c ? { r: c.r * 255, g: c.g * 255, b: c.b * 255, a: (c.a ?? 1) * extra } : null);
const colEq = (a, b, tolA = 0.02) => a && b && Math.abs(a.r - b.r) <= 1.01 && Math.abs(a.g - b.g) <= 1.01 && Math.abs(a.b - b.b) <= 1.01 && Math.abs(a.a - b.a) <= tolA;
const hex = (c) => (c ? `rgba(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)},${Math.round(c.a * 100) / 100})` : 'none');
const r2 = (n) => Math.round(n * 100) / 100;

const visPaints = (arr) => (arr || []).filter((p) => p.visible !== false && (p.opacity ?? 1) > 0);

function splitShadows(s) {
  // split top-level commas
  const out = [];
  let depth = 0, cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
function parseShadow(str) {
  const inset = /\binset\b/.test(str);
  const col = parseColor((str.match(/rgba?\([^)]*\)|color\([^)]*\)/) || [])[0]);
  const nums = str.replace(/rgba?\([^)]*\)|color\([^)]*\)/g, '').replace('inset', '').trim().split(/\s+/).map(parseFloat).filter((n) => !isNaN(n));
  return { inset, x: nums[0] || 0, y: nums[1] || 0, blur: nums[2] || 0, spread: nums[3] || 0, col };
}
function parseDropFilter(f) {
  const out = [];
  for (const m of f.matchAll(/drop-shadow\(([^)]*\)[^)]*|[^)]*)\)/g)) out.push(parseShadow(m[1]));
  return out;
}
function gradStops(img) {
  const m = img.match(/linear-gradient\((.*)\)/);
  if (!m) return null;
  const angle = (m[1].match(/^\s*(-?[\d.]+)deg/) || [])[1];
  const cols = [...m[1].matchAll(/rgba?\([^)]*\)|color\([^)]*\)/g)].map((x) => parseColor(x[0]));
  return { angle: angle == null ? null : +angle, cols };
}
function figGradAngle(p, w, h) {
  const hp = p.gradientHandlePositions;
  if (!hp || hp.length < 2) return null;
  const dx = (hp[1].x - hp[0].x) * w, dy = (hp[1].y - hp[0].y) * h;
  let a = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
  return ((a % 360) + 360) % 360;
}

export function compareStyles(root, els, offsetY) {
  const mism = []; // {prop, cat, node, nodeId, figma, app, sel}
  const unmatchedShapes = [];
  const counts = { colour: 0, radius: 0, shadow: 0, stroke: 0, opacity: 0, typography: 0, gradient: 0 };
  const add = (cat, prop, n, figma, app, sel) => {
    counts[cat] = (counts[cat] || 0) + 1;
    mism.push({ cat, prop, node: n.name, nodeId: n.id, figma, app, sel });
  };
  const nodes = flatten(root).filter((n) => !n.hidden && n.ay >= SAFARI_BAR && n.type !== 'text');
  let matchedShapes = 0, totalShapes = 0;
  // shapes
  for (const n of nodes) {
    const rn = n.rest;
    if (!rn || n.w < 2 || n.h < 2) continue;
    const fills = visPaints(rn.fills), strokes = visPaints(rn.strokes), effects = (rn.effects || []).filter((e) => e.visible !== false);
    const rad = rn.cornerRadius || (rn.rectangleCornerRadii || []).some((v) => v) ;
    if (!fills.length && !strokes.length && !effects.length && !rad) continue;
    if (['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'LINE', 'REGULAR_POLYGON'].includes(rn.type) && !(n.w > 20 && n.h > 20)) continue; // glyph-level icon paths
    totalShapes++;
    const ty = n.ay - offsetY;
    let best = null;
    for (const e of els) {
      const ix = Math.max(0, Math.min(n.ax + n.w, e.x + e.w) - Math.max(n.ax, e.x));
      const iy = Math.max(0, Math.min(ty + n.h, e.y + e.h) - Math.max(ty, e.y));
      const inter = ix * iy;
      if (!inter) continue;
      const iou = inter / (n.w * n.h + e.w * e.h - inter);
      const areaRatio = Math.abs(e.w * e.h - n.w * n.h) / (n.w * n.h);
      if (iou < 0.85 || areaRatio > 0.1) continue;
      if (!best || iou > best.iou + 0.02 || (Math.abs(iou - best.iou) <= 0.02 && e.o > best.e.o)) best = { iou, e };
    }
    if (!best) {
      unmatchedShapes.push({ node: n.name, nodeId: n.id, type: rn.type, box: [Math.round(n.ax), Math.round(ty), Math.round(n.w), Math.round(n.h)] });
      continue;
    }
    matchedShapes++;
    const e = best.e;
    // opacity
    if (rn.opacity != null && Math.abs(rn.opacity - e.op) > 0.02) add('opacity', 'opacity', n, rn.opacity, e.op, e.sel);
    // fill
    const topFill = fills[fills.length - 1];
    if (topFill?.type === 'SOLID') {
      const f = figColor(topFill.color, topFill.opacity ?? 1);
      const d = parseColor(e.bg);
      if (!d || d.a === 0 ? f.a > 0.02 : !colEq(f, d)) add('colour', 'fill', n, hex(f), hex(d), e.sel);
    } else if (topFill?.type?.startsWith('GRADIENT_LINEAR')) {
      const g = gradStops(e.bgImg);
      if (!g) add('gradient', 'fill-gradient', n, 'linear gradient', e.bgImg ? e.bgImg.slice(0, 50) : 'none', e.sel);
      else {
        const fa = figGradAngle(topFill, n.w, n.h);
        if (g.angle != null && fa != null && Math.abs(((g.angle - fa + 540) % 360) - 180) > 4) add('gradient', 'gradient-angle', n, r2(fa) + 'deg', g.angle + 'deg', e.sel);
        const fc = topFill.gradientStops.map((s) => figColor(s.color, topFill.opacity ?? 1));
        if (fc.length !== g.cols.length) add('gradient', 'gradient-stop-count', n, fc.length, g.cols.length, e.sel);
        else fc.forEach((c, i) => { if (!colEq(c, g.cols[i], 0.03)) add('colour', `gradient-stop-${i}`, n, hex(c), hex(g.cols[i]), e.sel); });
      }
    }
    // stroke
    if (strokes.length && rn.strokeWeight) {
      const s = strokes[strokes.length - 1];
      const iw = rn.individualStrokeWeights;
      const want = iw ? [iw.top, iw.right, iw.bottom, iw.left] : [rn.strokeWeight, rn.strokeWeight, rn.strokeWeight, rn.strokeWeight];
      want.forEach((w, i) => {
        if (Math.abs(w - (e.bs[i] === 'none' ? 0 : e.bw[i])) > 0.6) add('stroke', 'border-width-' + ['top', 'right', 'bottom', 'left'][i], n, w, e.bs[i] === 'none' ? 0 : e.bw[i], e.sel);
      });
      if (s.type === 'SOLID' && e.bw[0] > 0) {
        const f = figColor(s.color, s.opacity ?? 1), d = parseColor(e.bc[0]);
        if (!colEq(f, d)) add('colour', 'border-colour', n, hex(f), hex(d), e.sel);
      }
      if ((rn.strokeDashes || []).length && !/dashed|dotted/.test(e.bs.join(' '))) add('stroke', 'dashed', n, 'dashed', e.bs[0], e.sel);
    } else if (!strokes.length && e.bw.some((w, i) => w > 0 && e.bs[i] !== 'none' && (parseColor(e.bc[i])?.a ?? 0) > 0)) {
      add('stroke', 'extra-border', n, 'none', e.bw.join('/'), e.sel);
    }
    // radius
    const cap = Math.min(n.w, n.h) / 2;
    const wantR = rn.rectangleCornerRadii || Array(4).fill(rn.cornerRadius || 0);
    wantR.forEach((r, i) => {
      const w = Math.min(r, cap), d = Math.min(e.rad[i] || 0, cap);
      if (Math.abs(w - d) > 1.01) add('radius', 'radius-' + ['tl', 'tr', 'br', 'bl'][i], n, r2(w), r2(d), e.sel);
    });
    // shadows
    const figSh = effects.filter((x) => x.type === 'DROP_SHADOW' || x.type === 'INNER_SHADOW').map((x) => ({ inset: x.type === 'INNER_SHADOW', x: x.offset.x, y: x.offset.y, blur: x.radius, spread: x.spread || 0, col: figColor(x.color) }));
    const domSh = [...(e.sh ? splitShadows(e.sh).map(parseShadow) : []), ...(e.filter ? parseDropFilter(e.filter) : [])];
    if (figSh.length !== domSh.length) add('shadow', 'shadow-count', n, figSh.map((s) => `${s.inset ? 'inset ' : ''}${s.x} ${s.y} ${r2(s.blur)} ${r2(s.spread)} ${hex(s.col)}`).join(' | ') || 'none', domSh.map((s) => `${s.inset ? 'inset ' : ''}${s.x} ${s.y} ${s.blur} ${s.spread} ${hex(s.col)}`).join(' | ') || 'none', e.sel);
    else figSh.forEach((s, i) => {
      const d = domSh.find((q) => q.inset === s.inset && Math.abs(q.x - s.x) <= 1 && Math.abs(q.y - s.y) <= 1 && Math.abs(q.blur - s.blur) <= 1.5 && Math.abs(q.spread - s.spread) <= 1 && colEq(s.col, q.col, 0.03));
      if (!d) add('shadow', 'shadow-' + i, n, `${s.inset ? 'inset ' : ''}${s.x} ${s.y} ${r2(s.blur)} ${r2(s.spread)} ${hex(s.col)}`, e.sh || e.filter, e.sel);
    });
  }
  // text
  const texts = flatten(root).filter((n) => n.type === 'text' && !n.hidden && n.ay >= SAFARI_BAR && n.rest?.style && norm(n.name));
  const used = new Set();
  let matchedText = 0;
  for (const n of texts) {
    const want = norm(n.name);
    let best = null;
    for (const e of els) {
      if (e.t !== want || used.has(e.o)) continue;
      const d = Math.hypot(e.x - n.ax, e.y - (n.ay - offsetY));
      if (!best || d < best.d) best = { d, e };
    }
    if (!best) continue;
    used.add(best.e.o);
    matchedText++;
    const e = best.e, st = n.rest.style;
    const label = { name: n.name.slice(0, 40), id: n.id };
    const tadd = (cat, prop, f, a) => add(cat, prop, { name: label.name, id: label.id }, f, a, e.sel);
    const fam = e.ff.split(',')[0].replace(/["']/g, '').trim();
    if (st.fontFamily && norm(fam) !== norm(st.fontFamily)) tadd('typography', 'font-family (fallback?)', st.fontFamily, e.ff.slice(0, 50));
    if (Math.abs(st.fontSize - e.fs) > 0.51) tadd('typography', 'font-size', st.fontSize, e.fs);
    if (Math.abs(st.fontWeight - parseInt(e.fw, 10)) > 0) tadd('typography', 'font-weight', st.fontWeight, e.fw);
    const lh = parseFloat(e.lh);
    if (!isNaN(lh) && st.lineHeightPx && Math.abs(st.lineHeightPx - lh) > 1.01) tadd('typography', 'line-height', r2(st.lineHeightPx), lh);
    const ls = parseFloat(e.ls) || 0;
    if (Math.abs((st.letterSpacing || 0) - ls) > 0.25) tadd('typography', 'letter-spacing', r2(st.letterSpacing || 0), ls);
    const ta = { LEFT: 'left', CENTER: 'center', RIGHT: 'right', JUSTIFIED: 'justify' }[st.textAlignHorizontal];
    if (ta && ta !== e.ta && !(ta === 'left' && e.ta === 'start') && !(ta === 'right' && e.ta === 'end')) tadd('typography', 'text-align', ta, e.ta);
    const tdw = { UNDERLINE: 'underline', STRIKETHROUGH: 'line-through' }[st.textDecoration] || 'none';
    if (!e.td.includes(tdw) && !(tdw === 'none' && e.td === 'none')) tadd('typography', 'text-decoration', tdw, e.td);
    const ttw = { UPPER: 'uppercase', LOWER: 'lowercase', TITLE: 'capitalize' }[st.textCase] || 'none';
    if (ttw !== e.tt && !(ttw === 'none' && e.tt === 'none')) tadd('typography', 'text-transform', ttw, e.tt);
    const f0 = visPaints(n.rest.fills)[0];
    if (f0?.type === 'SOLID') {
      const f = figColor(f0.color, f0.opacity ?? 1);
      const d = parseColor(e.fill && e.fill !== 'rgba(0, 0, 0, 0)' ? e.fill : e.color) || parseColor(e.color);
      const gradText = e.bgClip === 'text' && e.bgImg;
      if (!gradText && !colEq(f, d, 0.03)) add('colour', 'text-colour', { name: label.name, id: label.id }, hex(f), hex(d), e.sel);
    } else if (f0?.type?.startsWith('GRADIENT') && !(e.bgClip === 'text' && e.bgImg)) {
      add('gradient', 'text-gradient', { name: label.name, id: label.id }, 'gradient fill', hex(parseColor(e.color)), e.sel);
    }
    // mixed runs: count override segments (informational)
    const ov = n.rest.characterStyleOverrides;
    if (ov && ov.some((v) => v)) counts.mixedRuns = (counts.mixedRuns || 0) + 1;
  }
  const byProp = {};
  for (const m of mism) (byProp[m.prop] ||= []).push(m);
  const total = Object.values(counts).reduce((a, b) => a + b, 0) - (counts.mixedRuns || 0);
  const parts = Object.entries(counts).filter(([k, v]) => v && k !== 'mixedRuns').map(([k, v]) => `${k}:${v}`);
  return {
    summaryLine: `${total} style mismatches (${parts.join(' ') || 'none'}); shapes ${matchedShapes}/${totalShapes} matched`,
    counts,
    shapes: { total: totalShapes, matched: matchedShapes },
    textStyleMatched: matchedText,
    unmatchedShapes: unmatchedShapes.slice(0, 80),
    unmatchedShapesCount: unmatchedShapes.length,
    mismatches: mism,
    byProp: Object.fromEntries(Object.entries(byProp).map(([k, v]) => [k, v.length])),
  };
}
