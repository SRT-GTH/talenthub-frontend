import api from '../services/api.js';
import { debug } from '../utils/debug.js';

const log = debug('copyBundle');

/*
 * copyBundle — the published site copy the public pages and portals show (backend GET /api/copy/bundle, platformCopy.bundle):
 *   { version, blocks: { [copyKey]: { [fieldPath]: text } }, terms: { assistant: { name, short }, ... } }
 * The frontend's own text is the default; `blocks` only holds what staff changed and published. The last bundle is kept in this
 * browser (localStorage) so a page opens with it at once; a fresh one is fetched on each page load and when the tab comes back
 * after a minute (the backend caches it for 60 s too).
 * Staff preview: a page opened with `?copyPreview=<token>` (Site copy → Preview) gets the drafts instead, and never stores them.
 */

const REFRESH_MS = 60 * 1000;
const CACHE_KEY = 'gth:copy-bundle';
const subs = new Set();
let inflight = null;
let fetchedAt = 0;

export const copyPreviewToken = () => {
  try {
    return new URLSearchParams(window.location.search).get('copyPreview');
  } catch {
    return null;
  }
};

/** True on a page opened by Site copy → Preview (the portals then show their sample data, not a signed-in account). */
export const isCopyPreview = () => Boolean(copyPreviewToken());

const readCache = () => {
  if (isCopyPreview()) return null;
  try {
    const c = JSON.parse(window.localStorage.getItem(CACHE_KEY) || 'null');
    return c && typeof c === 'object' ? c : null;
  } catch {
    return null;
  }
};

const cached = typeof window !== 'undefined' ? readCache() : null;
let state = {
  loaded: false,
  version: cached?.version ?? null,
  preview: false,
  blocks: cached?.blocks ?? {},
  terms: cached?.terms ?? {},
};

const notify = () => subs.forEach((fn) => fn());

export const loadCopyBundle = ({ force = false } = {}) => {
  if (inflight) return inflight;
  if (!force && state.loaded && Date.now() - fetchedAt < REFRESH_MS) return Promise.resolve(state);
  const token = copyPreviewToken();
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
        if (!state.preview) {
          try {
            window.localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ version: state.version, blocks: state.blocks, terms: state.terms })
            );
          } catch {
            /* storage full or blocked: the page still works */
          }
        }
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
      // The page keeps its own (or the last saved) text when the copy service is unreachable.
      log('bundle unavailable, using the built-in text', e?.message);
      fetchedAt = Date.now();
      return state;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
};

function onFocus() {
  loadCopyBundle();
}

// While anything listens: check for newly published copy every minute the tab is visible (a preview never changes, so it doesn't poll).
let timer = null;
const tick = () => {
  if (document.visibilityState === 'visible') loadCopyBundle();
};

export const subscribeCopy = (fn) => {
  subs.add(fn);
  if (subs.size === 1 && typeof window !== 'undefined') {
    window.addEventListener('focus', onFocus);
    if (!isCopyPreview()) timer = window.setInterval(tick, REFRESH_MS);
  }
  return () => {
    subs.delete(fn);
    if (subs.size === 0 && typeof window !== 'undefined') {
      window.removeEventListener('focus', onFocus);
      window.clearInterval(timer);
      timer = null;
    }
  };
};

export const getCopyState = () => state;

const TOKEN_RE = /\{([a-z][a-zA-Z0-9]*)(?:\.(name|short|plural))?\}/g;

/** Replace {assistant}, {assistant.short}, {community.plural} with the published product names (other {words} stay). */
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
