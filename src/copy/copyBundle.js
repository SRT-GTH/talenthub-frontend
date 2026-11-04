import api from '../services/api.js';
import { debug } from '../utils/debug.js';

const log = debug('copyBundle');

/*
 * copyBundle — the published site copy the public pages show (backend GET /api/copy/bundle, platformCopy.bundle):
 *   { version, blocks: { [copyKey]: { [fieldPath]: text } }, terms: { assistant: { name, short }, ... } }
 * The frontend's own text is the default; `blocks` only holds what staff changed and published. Fetched once per page load and
 * again when the tab comes back after a minute (the backend caches it for 60 s too).
 * Staff preview: a page opened with `?copyPreview=<token>` (Site copy → Preview) gets the drafts instead of the published text.
 */

const REFRESH_MS = 60 * 1000;
let state = { loaded: false, version: null, preview: false, blocks: {}, terms: {} };
let inflight = null;
let fetchedAt = 0;
const subs = new Set();

const previewToken = () => {
  try {
    return new URLSearchParams(window.location.search).get('copyPreview');
  } catch {
    return null;
  }
};

const notify = () => subs.forEach((fn) => fn());

export const loadCopyBundle = ({ force = false } = {}) => {
  if (inflight) return inflight;
  if (!force && state.loaded && Date.now() - fetchedAt < REFRESH_MS) return Promise.resolve(state);
  const token = previewToken();
  inflight = api
    .get('/copy/bundle', { params: token ? { preview: token } : {} })
    .then((res) => {
      const b = res?.data ?? res;
      fetchedAt = Date.now();
      if (b && !b.unchanged) {
        state = {
          loaded: true,
          version: b.version ?? null,
          preview: Boolean(b.preview),
          blocks: b.blocks ?? {},
          terms: b.terms ?? {},
        };
        log('loaded', {
          version: state.version,
          preview: state.preview,
          blocks: Object.keys(state.blocks).length,
        });
        notify();
      }
      return state;
    })
    .catch((e) => {
      // The page keeps its own text when the copy service is unreachable.
      log('bundle unavailable, using the built-in text', e?.message);
      fetchedAt = Date.now();
      return state;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
};

export const subscribeCopy = (fn) => {
  subs.add(fn);
  if (subs.size === 1 && typeof window !== 'undefined') {
    window.addEventListener('focus', onFocus);
  }
  return () => {
    subs.delete(fn);
    if (subs.size === 0 && typeof window !== 'undefined')
      window.removeEventListener('focus', onFocus);
  };
};

function onFocus() {
  loadCopyBundle();
}

export const getCopyState = () => state;

const TOKEN_RE = /\{([a-z][a-zA-Z0-9]*)(?:\.(name|short|plural))?\}/g;

/** Replace {assistant}, {assistant.short}, {community.plural} with the published product names. */
export const fillTerms = (text, terms = state.terms) => {
  if (typeof text !== 'string' || !text.includes('{')) return text;
  return text.replace(TOKEN_RE, (all, key, form) => {
    const t = terms?.[key];
    if (!t) return all;
    if (form === 'short') return t.short || t.name;
    if (form === 'plural') return t.plural || t.name;
    return t.name;
  });
};
