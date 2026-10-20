import { useEffect, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { STREAK_CHANGED, fetchStreak } from '../../../services/streak.api.js';

const log = debug('useLiveStreak');

/*
 * The signed-in talent's streak (GET /streak), shared by the nav pill, the pop-up and /streak: one request, cached for
 * a minute, refreshed when a learning action happens (STREAK_CHANGED from notifyStreakActivity) or the tab regains focus.
 * Returns { status: off | loading | ready | error, data, reload }.
 */
const TTL_MS = 60 * 1000;
let cache = { data: null, at: 0, pending: null };
const listeners = new Set();

const publish = () => listeners.forEach((fn) => fn(cache.data));

export const reloadStreak = async ({ force = true } = {}) => {
  if (!force && cache.data && Date.now() - cache.at < TTL_MS) return cache.data;
  if (cache.pending) return cache.pending;
  cache.pending = fetchStreak()
    .then((data) => {
      cache = { data, at: Date.now(), pending: null };
      publish();
      return data;
    })
    .catch((err) => {
      cache.pending = null;
      log('load failed', err?.response?.status || err?.message);
      throw err;
    });
  return cache.pending;
};

/** Put a server answer straight into the cache (after a save). */
export const patchStreak = (patch) => {
  if (!cache.data) return;
  cache = { ...cache, data: { ...cache.data, ...patch } };
  publish();
};

export const useLiveStreak = ({ enabled = true } = {}) => {
  const [data, setData] = useState(enabled ? cache.data : null);
  const [status, setStatus] = useState(!enabled ? 'off' : cache.data ? 'ready' : 'loading');

  useEffect(() => {
    if (!enabled) return undefined;
    const onData = (next) => {
      setData(next);
      setStatus('ready');
    };
    listeners.add(onData);
    reloadStreak({ force: false }).catch(() => setStatus((s) => (s === 'ready' ? s : 'error')));
    const refresh = () => reloadStreak().catch(() => {});
    const onFocus = () => reloadStreak({ force: false }).catch(() => {});
    window.addEventListener(STREAK_CHANGED, refresh);
    window.addEventListener('focus', onFocus);
    return () => {
      listeners.delete(onData);
      window.removeEventListener(STREAK_CHANGED, refresh);
      window.removeEventListener('focus', onFocus);
    };
  }, [enabled]);

  return { status: enabled ? status : 'off', data: enabled ? data : null, reload: reloadStreak };
};
