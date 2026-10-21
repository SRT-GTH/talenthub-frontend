// Shared Figma helpers: XML structure tree (geometry only) + optional REST node JSON (full fidelity).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const HERE = path.dirname(fileURLToPath(import.meta.url));
export const PLAYFUL_DIR = path.resolve(HERE, '..');
export const FILE_KEY = 'Bin8roWL8sloyc36IgFMuT';
export const SAFARI_BAR = 52;

const ATTR = /([\w-]+)="([^"]*)"/g;
const unesc = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");

/** Parse the one-element-per-line structure XML into { frames: {id: node} }. Coordinates become absolute within each top-level frame. */
export function parseStructure(file = path.join(PLAYFUL_DIR, 'figma-structure.xml')) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const frames = {};
  const stack = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('</')) {
      stack.pop();
      continue;
    }
    const m = t.match(/^<([\w-]+)\s(.*?)(\/?)>$/);
    if (!m) continue;
    const attrs = {};
    for (const a of m[2].matchAll(ATTR)) attrs[a[1]] = unesc(a[2]);
    const parent = stack[stack.length - 1];
    const node = {
      type: m[1],
      id: attrs.id,
      name: attrs.name,
      x: parseFloat(attrs.x),
      y: parseFloat(attrs.y),
      w: parseFloat(attrs.width),
      h: parseFloat(attrs.height),
      hidden: attrs.hidden === 'true' || !!(parent && parent.hidden),
      children: [],
    };
    if (parent) {
      parent.children.push(node);
      if (parent.isFrameRoot) {
        node.ax = node.x;
        node.ay = node.y;
      } else {
        node.ax = parent.ax + node.x;
        node.ay = parent.ay + node.y;
      }
    }
    if (m[1] === 'frame' && parent && parent.type === 'section') {
      node.isFrameRoot = true;
      node.ax = 0;
      node.ay = 0;
      frames[node.id] = node;
    }
    if (m[3] !== '/') stack.push(node);
  }
  return frames;
}

// parent.isFrameRoot children use ax = x (frame root has ax=0): handled above because root ax=0 anyway.

export function flatten(node, out = []) {
  out.push(node);
  for (const c of node.children) flatten(c, out);
  return out;
}

/** Visible text nodes of a frame, excluding the Safari toolbar mock. */
export function visibleTexts(frame) {
  return flatten(frame).filter(
    (n) => n.type === 'text' && !n.hidden && n.ay >= SAFARI_BAR && n.w > 0 && n.h > 0
  );
}

export function nodeJsonPath(id) {
  return path.join(PLAYFUL_DIR, 'figma-nodes', id.replace(':', '_') + '.json');
}

/** REST node JSON -> same shape as parseStructure nodes (adds fills/strokes/effects/style when present). */
export function loadRestFrame(id) {
  const p = nodeJsonPath(id);
  if (!fs.existsSync(p)) return null;
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const root = j.nodes?.[id]?.document;
  if (!root) return null;
  const ob = root.absoluteBoundingBox;
  const walk = (n, hiddenAbove) => {
    const bb = n.absoluteBoundingBox || { x: ob.x, y: ob.y, width: 0, height: 0 };
    const hidden = hiddenAbove || n.visible === false;
    const node = {
      type: (n.type || '').toLowerCase(),
      rest: n,
      id: n.id,
      name: n.type === 'TEXT' ? n.characters : n.name,
      ax: bb.x - ob.x,
      ay: bb.y - ob.y,
      w: bb.width,
      h: bb.height,
      hidden,
      children: [],
    };
    node.x = node.ax;
    node.y = node.ay;
    for (const c of n.children || []) node.children.push(walk(c, hidden));
    return node;
  };
  return walk(root, false);
}

export function getToken() {
  if (process.env.FIGMA_TOKEN) return process.env.FIGMA_TOKEN;
  // `.mcp.json` now references ${FIGMA_ACCESS_TOKEN} instead of holding the secret, so read the env var.
  const fromEnv = process.env.FIGMA_ACCESS_TOKEN;
  if (fromEnv && !fromEnv.startsWith('${')) return fromEnv;
  try {
    const j = JSON.parse(fs.readFileSync(path.resolve(PLAYFUL_DIR, '../../.mcp.json'), 'utf8'));
    for (const s of Object.values(j.mcpServers || {})) {
      const v = s.env?.FIGMA_ACCESS_TOKEN;
      if (v && !String(v).startsWith('${')) return v; // ignore the ${VAR} placeholder
    }
  } catch {}
  return null;
}

export const norm = (s) =>
  (s || '')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, '...')
    .replace(/[–—−]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
