/**
 * perf — opt-in page load timing for the browser.
 *
 * Turn it on with `?perf=1` (remembered in localStorage until `?perf=0`) or
 * build with VITE_PERF_PANEL=1. When it is off, nothing is recorded and the
 * panel code is never downloaded.
 *
 * For each page (pathname) it keeps:
 *   - every API call made through the axios client: method, url, status,
 *     start/end relative to the page start, and the backend's Server-Timing
 *     breakdown (route action, db, auth, slowest calls);
 *   - script/stylesheet chunks fetched while the page loaded;
 *   - "time to data": from the page start (navigation, or the click that
 *     changed route) to the last API response, once the page has gone quiet.
 *
 * The first page starts at 0 (the browser's navigation start), so its time
 * includes downloading the HTML and JS.
 */

const STORAGE_KEY = 'th:perf';
const SETTLE_MS = 600; // no call in flight for this long = the page has its data
const MAX_PAGES = 12;
const MAX_CALLS = 200;

const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

let enabledCache = null;

/** Is timing on? Reads ?perf=1 / ?perf=0 once and remembers the choice. */
export function perfEnabled() {
  if (enabledCache !== null) return enabledCache;
  let on = false;
  try {
    if (import.meta.env?.VITE_PERF_PANEL === '1') on = true;
    const q = new URLSearchParams(window.location.search).get('perf');
    if (q === '1' || q === 'true') {
      localStorage.setItem(STORAGE_KEY, '1');
      on = true;
    } else if (q === '0' || q === 'false') {
      localStorage.removeItem(STORAGE_KEY);
      on = false;
    } else if (localStorage.getItem(STORAGE_KEY) === '1') {
      on = true;
    }
  } catch {
    // storage blocked: only the query param / env decide
  }
  enabledCache = on;
  return on;
}

// Real-user monitoring (observability/faro.js) receives each settled page.
let rumSink = null;

export function setRumSink(fn) {
  rumSink = typeof fn === 'function' ? fn : null;
}

/** Record calls when the panel is on or RUM wants the page timings. */
const recording = () => perfEnabled() || rumSink !== null;

export function disablePerf() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  enabledCache = false;
  emit();
}

/**
 * Parse a Server-Timing header:
 *   total;dur=905, action;desc="settings.overview";dur=880, db;desc="9 queries";dur=612
 * → [{ name, dur, desc }]
 */
export function parseServerTiming(header) {
  if (!header || typeof header !== 'string') return [];
  return header
    .split(',')
    .map((part) => {
      const [name, ...params] = part.trim().split(';');
      if (!name) return null;
      const entry = { name: name.trim(), dur: null, desc: '' };
      for (const p of params) {
        const eq = p.indexOf('=');
        if (eq < 0) continue;
        const key = p.slice(0, eq).trim().toLowerCase();
        let val = p.slice(eq + 1).trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1).replace(/\\"/g, '"');
        if (key === 'dur') entry.dur = Number(val);
        else if (key === 'desc') entry.desc = val;
      }
      return entry;
    })
    .filter(Boolean);
}

/** Server-Timing entries → { totalMs, action, dbMs, dbDesc, authMs, authDesc, slowest[] } */
export function summarizeServer(entries) {
  if (!entries?.length) return null;
  const by = (n) => entries.find((e) => e.name === n);
  const total = by('total');
  const action = by('action');
  const db = by('db');
  const auth = by('auth');
  return {
    totalMs: total?.dur ?? null,
    action: action?.desc || '',
    actionMs: action?.dur ?? null,
    dbMs: db?.dur ?? null,
    dbDesc: db?.desc || '',
    authMs: auth?.dur ?? null,
    authDesc: auth?.desc || '',
    slowest: entries
      .filter((e) => /^slow\d+$/.test(e.name))
      .map((e) => ({ name: e.desc, ms: e.dur })),
  };
}

// ---------------------------------------------------------------------------
// store

let pages = [];
let current = null;
let seq = 0;
let settleTimer = null;
let version = 0;
const listeners = new Set();

function emit() {
  version += 1;
  for (const fn of listeners) {
    try {
      fn();
    } catch {
      /* a broken listener must not break the app */
    }
  }
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getPages() {
  return pages;
}

/** Changes on every update; the panel's useSyncExternalStore snapshot. */
export function getVersion() {
  return version;
}

export function clearPerf() {
  pages = current ? [current] : [];
  if (current) {
    current.calls = [];
    current.chunks = [];
    current.settledAt = null;
  }
  emit();
}

function newPage(path, start) {
  const page = {
    id: ++seq,
    path,
    start,
    calls: [],
    chunks: [],
    inFlight: 0,
    settledAt: null, // ms from page start to the last response, once quiet
    nav: null,
  };
  pages = [page, ...pages].slice(0, MAX_PAGES);
  current = page;
  return page;
}

/** Called by the panel on every route change (before the page's own effects). */
export function markNavigation(path) {
  if (!recording()) return;
  if (current && current.path === path) return;
  // The very first page starts at navigation start, so it includes HTML + JS.
  newPage(path, current ? now() : 0);
  if (current.start === 0) current.nav = readNavigationTiming();
  emit();
}

function pageFor(path) {
  if (!current || current.path !== path) markNavigation(path);
  return current;
}

function scheduleSettle(page) {
  clearTimeout(settleTimer);
  if (page.inFlight > 0) return;
  settleTimer = setTimeout(() => {
    if (page.inFlight > 0 || !page.calls.length) return;
    const last = Math.max(...page.calls.map((c) => c.end ?? 0));
    page.settledAt = last;
    collectChunks(page);
    if (perfEnabled()) logPage(page);
    if (rumSink && !page.reported) {
      page.reported = true;
      try {
        rumSink(page);
      } catch {
        /* RUM must never break the app */
      }
    }
    emit();
  }, SETTLE_MS);
}

// ---------------------------------------------------------------------------
// axios hooks

/** request interceptor: stamp the start time. */
export function perfRequest(config) {
  if (!recording() || !config) return config;
  const page =
    (config.__perf && pages.find((p) => p.id === config.__perf.page)) ||
    pageFor(window.location.pathname);
  page.inFlight += 1;
  page.settledAt = null;
  // A retry after a token refresh keeps its original start time.
  if (!config.__perf) config.__perf = { page: page.id, at: now() };
  return config;
}

/**
 * response / error interceptor: record the call. With `retrying` (a 401 that
 * will be retried after a token refresh) the call is not recorded yet; the
 * retry's response records it once, from the original start.
 */
export function perfResponse(
  responseOrError,
  isError = false,
  { retrying = false, counted = false } = {}
) {
  if (!recording()) return;
  const response = isError ? responseOrError?.response : responseOrError;
  const config = isError ? responseOrError?.config : responseOrError?.config;
  const stamp = config?.__perf;
  if (!stamp) return;
  const page = pages.find((p) => p.id === stamp.page);
  if (!page) return;
  if (!counted) page.inFlight = Math.max(0, page.inFlight - 1);
  if (retrying) return;
  const end = now();
  const headers = response?.headers || {};
  const st =
    (typeof headers.get === 'function' ? headers.get('server-timing') : null) ||
    headers['server-timing'];
  const server = summarizeServer(parseServerTiming(st));
  const call = {
    method: (config.method || 'get').toUpperCase(),
    url: stripBase(config.url || ''),
    params: config.params ? new URLSearchParams(config.params).toString() : '',
    status: response?.status ?? (isError ? 'ERR' : '?'),
    start: stamp.at - page.start,
    end: end - page.start,
    ms: end - stamp.at,
    server,
    requestId: headers['x-request-id'] || '',
  };
  page.calls = [...page.calls, call].slice(-MAX_CALLS);
  scheduleSettle(page);
  emit();
}

function stripBase(url) {
  return url.replace(/^https?:\/\/[^/]+/, '').replace(/^\/api(?=\/)/, '');
}

// ---------------------------------------------------------------------------
// browser timing

function readNavigationTiming() {
  try {
    const [n] = performance.getEntriesByType('navigation');
    if (!n) return null;
    return {
      ttfb: Math.round(n.responseStart),
      domContentLoaded: Math.round(n.domContentLoadedEventEnd),
      load: Math.round(n.loadEventEnd) || null,
      transferKb: n.transferSize ? Math.round(n.transferSize / 1024) : null,
    };
  } catch {
    return null;
  }
}

/** Script/style chunks fetched between the page start and the last response. */
function collectChunks(page) {
  try {
    const until = page.start + (page.settledAt ?? 0) + 50;
    page.chunks = performance
      .getEntriesByType('resource')
      .filter(
        (r) =>
          (r.initiatorType === 'script' ||
            r.initiatorType === 'link' ||
            /\.(js|css|mjs)(\?|$)/.test(r.name)) &&
          r.startTime >= page.start - 5 &&
          r.startTime <= until
      )
      .map((r) => ({
        name: r.name.split('/').pop().split('?')[0],
        start: r.startTime - page.start,
        ms: r.duration,
        kb: r.transferSize ? Math.round(r.transferSize / 1024) : 0,
      }));
  } catch {
    page.chunks = [];
  }
}

function logPage(page) {
  if (typeof console === 'undefined' || !console.groupCollapsed) return;
  console.groupCollapsed(
    `%c[perf] ${page.path} — data in ${Math.round(page.settledAt)}ms (${page.calls.length} calls)`,
    'color:#0a7d4f;font-weight:600'
  );
  console.table(
    page.calls.map((c) => ({
      call: `${c.method} ${c.url}`,
      status: c.status,
      startMs: Math.round(c.start),
      ms: Math.round(c.ms),
      serverMs: c.server?.totalMs ?? '',
      action: c.server?.action ?? '',
      db: c.server?.dbMs != null ? `${c.server.dbMs}ms ${c.server.dbDesc}` : '',
      network: c.server?.totalMs != null ? Math.round(c.ms - c.server.totalMs) : '',
    }))
  );
  console.groupEnd();
}

/** For the panel's "copy" button and for tests. */
export function exportPerf() {
  return pages.map((p) => {
    const copy = { ...p };
    delete copy.inFlight;
    return copy;
  });
}

export const _internal = {
  reset() {
    pages = [];
    current = null;
    seq = 0;
    enabledCache = null;
    clearTimeout(settleTimer);
    rumSink = null;
  },
};
