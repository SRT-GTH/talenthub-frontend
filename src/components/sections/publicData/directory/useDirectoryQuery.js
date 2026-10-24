import { useCallback, useEffect, useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';

const log = debug('useDirectoryQuery');

/*
 * useDirectoryQuery — runs one of the mock endpoints of data/directoryData.js and exposes the three states every directory screen draws.
 *   fetcher  fn(params) -> Promise<{ data, meta }>
 *   params   plain object; the query re-runs when its JSON changes
 *   forced   the `?state=` URL value: 'loading' keeps the skeleton (the 8.x loading frames), 'error' shows the section error
 * Returns { status: 'loading' | 'ready' | 'error', data, error, retry }. `retry` re-runs the query (and, for a forced error, the caller clears
 * `?state=error`, which is why the page passes its own onRetry).
 */
export const useDirectoryQuery = (fetcher, params, forced = null) => {
  const [result, setResult] = useState({ status: 'loading', data: null, error: null, key: null });
  const [attempt, setAttempt] = useState(0);
  const key = JSON.stringify(params);
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    let cancelled = false;
    if (forced === 'loading') {
      log('forced loading');
      setResult({ status: 'loading', data: null, error: null, key: 'forced' });
      return undefined;
    }
    if (forced === 'error') {
      log('forced error');
      setResult({ status: 'error', data: null, error: new Error('forced'), key: 'forced' });
      return undefined;
    }
    log('fetch', key, 'attempt', attempt);
    setResult({ status: 'loading', data: null, error: null, key });
    fetcherRef
      .current(JSON.parse(key))
      .then((res) => {
        if (cancelled) return;
        log('ready');
        setResult({ status: 'ready', data: res.data, error: null, key });
      })
      .catch((error) => {
        if (cancelled) return;
        log('error', error?.status ?? error?.message);
        setResult({ status: 'error', data: null, error, key });
      });
    return () => {
      cancelled = true;
    };
  }, [key, forced, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  // a result that belongs to older params (or to a forced state) is never shown for the new ones
  const stale = !forced && result.key !== key;
  return stale ? { status: 'loading', data: null, error: null, retry } : { ...result, retry };
};
