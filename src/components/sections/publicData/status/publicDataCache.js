import { debug } from '../../../../utils/debug.js';
import { OFFLINE_COPY, OFFLINE_DEMO_TIME } from './data/statusData.js';

const log = debug('publicDataCache');

/*
 * publicDataCache — the last good payload per key, kept in localStorage so a dropped connection can still show "cached data" (Figma 8.9.3e).
 * Every storage access is wrapped in try/catch (private windows, blocked storage, quota): failures degrade to "no cache", never throw.
 *
 * API
 *   saveCache(key, payload)            -> boolean   stores { payload, savedAt: Date.now() } under "gth-public-data:<key>"
 *   loadCache(key)                     -> { payload, savedAt } | null
 *   clearCache(key)
 *   fetchWithCache(key, loader)        -> Promise<{ payload, savedAt, stale }>   runs loader(); success is saved (stale:false);
 *                                         failure falls back to the cached copy (stale:true) or rethrows when there is none
 *   formatCacheTime(savedAt)           -> "09:12"  (24h, GMT as the page says "GMT"; no savedAt -> the drawn demo time)
 *   offlineFreshness(savedAt)          -> { label: "Offline · showing cached data from 09:12" }   the stale variant of the freshness pill
 *                                         (pass it as PublicDataFrame `freshness`; the grey pill styling needs the REQUEST in the report)
 *   latestSavedAt()                    -> the newest savedAt across every cached key (null when nothing is cached); the frame's
 *                                         offline pill and banner use it, so they show when the data on screen was saved
 *   offlineBannerText(savedAt)         -> "You’re offline. Showing data saved at 09:12 today, …"
 * Only aggregated, public, already-suppressed payloads may be cached: never personal data.
 */

const PREFIX = 'gth-public-data:';

export const saveCache = (key, payload) => {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify({ payload, savedAt: Date.now() }));
    log('save', key);
    return true;
  } catch (error) {
    log('save failed', key, error?.message);
    return false;
  }
};

export const loadCache = (key) => {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.savedAt !== 'number') return null;
    return { payload: parsed.payload, savedAt: parsed.savedAt };
  } catch (error) {
    log('load failed', key, error?.message);
    return null;
  }
};

export const clearCache = (key) => {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch (error) {
    log('clear failed', key, error?.message);
  }
};

export const fetchWithCache = async (key, loader) => {
  try {
    const payload = await loader();
    saveCache(key, payload);
    return { payload, savedAt: Date.now(), stale: false };
  } catch (error) {
    const cached = loadCache(key);
    log('loader failed', key, cached ? 'serving cache' : 'no cache');
    if (cached) return { ...cached, stale: true };
    throw error;
  }
};

export const formatCacheTime = (savedAt) => {
  if (savedAt === undefined || savedAt === null) return OFFLINE_DEMO_TIME;
  const date = new Date(savedAt);
  if (Number.isNaN(date.getTime())) return OFFLINE_DEMO_TIME;
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }).format(date);
};

export const latestSavedAt = () => {
  try {
    let latest = null;
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (!key || !key.startsWith(PREFIX)) continue;
      const savedAt = JSON.parse(window.localStorage.getItem(key) || 'null')?.savedAt;
      if (typeof savedAt === 'number' && (latest === null || savedAt > latest)) latest = savedAt;
    }
    return latest;
  } catch {
    return null;
  }
};

// savedAt 'none' = a real drop with nothing cached: copy without a time (undefined keeps the drawn demo time for ?state=offline).
export const offlineFreshness = (savedAt) => ({
  tone: 'offline',
  label:
    savedAt === 'none'
      ? OFFLINE_COPY.freshnessNoCache
      : OFFLINE_COPY.freshness.replace('{time}', formatCacheTime(savedAt)),
});

export const offlineBannerText = (savedAt) =>
  savedAt === 'none'
    ? OFFLINE_COPY.bannerNoCache
    : OFFLINE_COPY.banner.replace('{time}', formatCacheTime(savedAt));
