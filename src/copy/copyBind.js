import { debug } from '../utils/debug.js';
import { at, fromStoredText, keepEdges } from './copySections.js';
import {
  fillTerms,
  getCopyState,
  loadCopyBundle,
  refreshCopyViews,
  subscribeCopy,
} from './copyBundle.js';

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
    if (!parent || typeof parent !== 'object' || Object.isFrozen(parent)) return;
    const k = f.dataPath[f.dataPath.length - 1];
    const v = values[f.path];
    try {
      if (typeof v === 'string' && v.trim()) {
        const text = keepEdges(f.original, fillTerms(fromStoredText(v), state.terms));
        parent[k] = text;
        f.lastWritten = text;
      } else if (f.lastWritten !== undefined) {
        // Only put back what this module changed: live data written over the defaults since then stays.
        if (parent[k] === f.lastWritten) parent[k] = f.original;
        f.lastWritten = undefined;
      }
    } catch {
      /* a read-only object: leave it */
    }
  });
};

/** Write the published text again (a data module swapped its objects, e.g. talentJobsData.applyJobsData). */
export const reapplyBoundCopy = () => {
  const state = getCopyState();
  bound.forEach((s) => {
    s.fields.forEach((f) => {
      f.lastWritten = undefined;
    });
    applyTo(s, state);
  });
};

export const bindCopy = (...sections) => {
  const state = getCopyState();
  let added = 0;
  sections.forEach((s) => {
    if (bound.has(s.key)) return;
    if (s.fields.some((f) => f.dataPath.length < 2)) {
      throw new Error(`bindCopy ${s.id}: every field must sit inside an exported object or array`);
    }
    bound.set(s.key, s);
    applyTo(s, state);
    added += 1;
  });
  // Pages already on screen show the text of files bound after their first render.
  if (added && subscribed) refreshCopyViews();
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
