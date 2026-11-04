import { debug } from '../utils/debug.js';
import { at, fromStoredText } from './copySections.js';
import { fillTerms, getCopyState, loadCopyBundle, subscribeCopy } from './copyBundle.js';

const log = debug('copyBind');

/*
 * bindCopy(...sections) — the published site copy written straight into the sections' own data objects (the portals' nav lists,
 * home card texts …), so every component and helper that reads them shows it without changes of its own. Each field keeps its
 * original; a field with no published text goes back to it. Applied at once from the last bundle this browser saw (copyBundle keeps
 * it), and again when a newer bundle arrives — components pick that up on their next render. A staff preview (`?copyPreview=`)
 * waits for its bundle before the app renders (main.jsx), so the preview always shows the drafts.
 * A field's path must end inside an object or array (a top-level string export can't be rewritten).
 */
const bound = new Map();
let subscribed = false;

const applyTo = (section, state) => {
  const values = state.blocks?.[section.key] ?? {};
  section.fields.forEach((f) => {
    const parent = at(section.data, f.dataPath.slice(0, -1));
    if (!parent || typeof parent !== 'object') return;
    const v = values[f.path];
    parent[f.dataPath[f.dataPath.length - 1]] =
      typeof v === 'string' && v.trim() ? fillTerms(fromStoredText(v), state.terms) : f.original;
  });
};

export const bindCopy = (...sections) => {
  const state = getCopyState();
  sections.forEach((s) => {
    if (bound.has(s.key)) return;
    if (s.fields.some((f) => f.dataPath.length < 2)) {
      throw new Error(`bindCopy ${s.id}: every field must sit inside an exported object or array`);
    }
    bound.set(s.key, s);
    applyTo(s, state);
  });
  if (!subscribed && typeof window !== 'undefined') {
    subscribed = true;
    subscribeCopy(() => {
      const next = getCopyState();
      bound.forEach((s) => applyTo(s, next));
      log('applied', { sections: bound.size, version: next.version });
    });
    loadCopyBundle();
  }
};
