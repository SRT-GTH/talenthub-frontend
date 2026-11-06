import { useCallback, useEffect, useRef, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { agencyOverview } from '../../../services/agency.api.js';

const log = debug('useAgencyOverview');

/*
 * Live agency overview (GET /api/agency/overview, backend services/agency.service.js). Same contract as Theme 8's
 * useOverviewData so the agency pages can swap it in: { status, overview, retry, forced }.
 *   status 'loading' (first load or ?state=loading) · 'error' · 'zero' · 'suppressed' (1-4 talents) · 'ready'
 * Groups of 1-4 talents arrive from the server as 0 with suppressed: true; the components print them "<5".
 * A filter change keeps the previous numbers on screen until the new ones arrive (no skeleton flash).
 * ?state=zero|suppressed|error|loading still forces a designed frame in development.
 */

const FORCED = ['loading', 'error', 'zero', 'suppressed'];
// Placeholder while the first answer loads: the full shape, so every card can draw its skeleton.
const EMPTY = {
  count: 0,
  state: 'loading',
  hero: { eyebrow: '', count: 0, label: '', change: null, note: '', noteShort: '', series: [] },
  kpis: {
    placements: { count: 0, sub: '', subShort: '' },
    scholarships: { value: '', sub: '', subShort: '' },
    partners: { count: 0, sub: '', subShort: '' },
    today: { value: '', sub: '' },
  },
  regions: [],
  interests: { aside: '', rows: [] },
  education: [],
  ages: [],
  medianAge: null,
  capabilities: [],
  gender: [],
  breakdowns: {},
  today: [],
};

const filterKey = (f) =>
  ['region', 'edu', 'interest', 'age', 'gender'].map((k) => f?.[k] || '').join('|');

/* `load` defaults to the agency endpoint; the public /data overview passes publicOverview (same shape). */
export const useAgencyOverview = (filters, state, update, load = agencyOverview) => {
  const key = filterKey(filters);
  const [res, setRes] = useState({ overview: null, error: null, key: null });
  const [attempt, setAttempt] = useState(0);
  const latest = useRef(key);

  useEffect(() => {
    latest.current = key;
    let live = true;
    const [region, edu, interest, age, gender] = key.split('|');
    load({ region, edu, interest, age, gender })
      .then((overview) => {
        if (live && latest.current === key) setRes({ overview, error: null, key });
      })
      .catch((err) => {
        log.error('overview failed', err?.response?.status || err?.message);
        if (live && latest.current === key) setRes((r) => ({ ...r, error: err, key }));
      });
    return () => {
      live = false;
    };
  }, [key, attempt, load]);

  const forcedState = import.meta.env.DEV && FORCED.includes(state) ? state : null;
  const overview = res.overview || EMPTY;
  let status = 'ready';
  if (forcedState === 'loading' || (!res.overview && !res.error)) status = 'loading';
  else if (res.error && !res.overview) status = 'error';
  else if (forcedState === 'zero' || overview.state === 'zero') status = 'zero';
  else if (forcedState === 'suppressed' || overview.state === 'suppressed') status = 'suppressed';
  else if (forcedState === 'error') status = 'error';

  const retry = useCallback(() => {
    if (update && state === 'error') update({ state: null }, { replace: true });
    setRes((r) => ({ ...r, error: null }));
    setAttempt((n) => n + 1);
  }, [update, state]);

  return { status, overview, retry, forced: Boolean(forcedState), error: res.error };
};

/** Just the matching count for a draft filter set (the More filters drawer), debounced; null while loading. */
export const useAgencyCount = (filters, delayMs = 300) => {
  const key = filterKey(filters);
  const [count, setCount] = useState({ key: null, value: null, state: null });
  useEffect(() => {
    let live = true;
    const t = setTimeout(() => {
      const [region, edu, interest, age, gender] = key.split('|');
      agencyOverview({ region, edu, interest, age, gender, countOnly: true })
        .then((o) => live && setCount({ key, value: o.count, state: o.state }))
        .catch(() => live && setCount({ key, value: null, state: 'error' }));
    }, delayMs);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [key, delayMs]);
  return count.key === key ? count : { key, value: null, state: 'loading' };
};
