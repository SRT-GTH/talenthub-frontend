import { useEffect, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { XP_CHANGED, fetchXpSummary } from '../../../services/xp.api.js';

const log = debug('useLiveXp');

/*
 * The signed-in talent's XP total and level (GET /xp), shared by the game / lab headers, the sidebar level card and home:
 * one request, cached for a minute, refreshed on XP_CHANGED (notifyXpChanged after a ranked game or a finished lab) and when
 * the tab regains focus. Returns { status: off | loading | ready | error, data, reload }.
 *   useLiveXp({ enabled })   enabled = false for demo frames (`?demo=1`, `?f=`), which keep their drawn numbers
 */
const TTL_MS = 60 * 1000;
let cache = { data: null, at: 0, pending: null };
const listeners = new Set();
const publish = () => listeners.forEach((fn) => fn(cache.data));

export const reloadXp = async ({ force = true } = {}) => {
  if (!force && cache.data && Date.now() - cache.at < TTL_MS) return cache.data;
  if (cache.pending) return cache.pending;
  cache.pending = fetchXpSummary()
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

export const useLiveXp = ({ enabled = true } = {}) => {
  const [data, setData] = useState(enabled ? cache.data : null);
  const [status, setStatus] = useState(!enabled ? 'off' : cache.data ? 'ready' : 'loading');

  useEffect(() => {
    if (!enabled) return undefined;
    const onData = (d) => {
      setData(d);
      setStatus('ready');
    };
    listeners.add(onData);
    reloadXp({ force: false })
      .then(onData)
      .catch(() => setStatus((s) => (cache.data ? s : 'error')));
    const refresh = () => reloadXp().catch(() => {});
    window.addEventListener(XP_CHANGED, refresh);
    window.addEventListener('focus', refresh);
    return () => {
      listeners.delete(onData);
      window.removeEventListener(XP_CHANGED, refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [enabled]);

  return { status, data, reload: reloadXp };
};

/** "1,240 XP" */
export const formatXp = (n) => `${Number(n || 0).toLocaleString('en-GB')} XP`;
