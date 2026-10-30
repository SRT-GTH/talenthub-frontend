import { useEffect, useSyncExternalStore } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isLoggedIn } from '../../../../services/auth.api.js';
import {
  fetchParentMe,
  fetchParentWard,
  parentError,
  parentErrorCode,
} from '../../../../services/parent.api.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('parentLive');

/*
 * parentLive — the signed-in parent's data for the /parent/* screens.
 *
 * Live vs demo (same rule as the talent home and Ask Buddy): the screens show live data when someone is signed in and
 * the URL is not a design frame. `?state=…` (the Figma frames) or `?demo=1` keep the mock persona (Emma Mensah) so the
 * frames and the Playwright baselines still reproduce. Signed out also shows the demo.
 *
 * A module-level store (no provider, like flagsStore): `me` (GET /parent/me) and one entry per ward page
 * (GET /parent/wards/:id). Each entry is { status: 'idle' | 'loading' | 'ready' | 'error', data, error, code }.
 * After a write, call `refreshParent(wardId?)` so the sidebar counts, the home and the ward page agree.
 */

const empty = () => ({ status: 'idle', data: null, error: null, code: null });
let state = { me: empty(), wards: {} };
const listeners = new Set();
const emit = (next) => {
  state = next;
  listeners.forEach((l) => l());
};
const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getState = () => state;

const inflight = new Map();
const once = (key, fn) => {
  if (inflight.has(key)) return inflight.get(key);
  const p = fn().finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
};

export const loadParentMe = (force = false) => {
  if (!force && ['loading', 'ready'].includes(state.me.status))
    return Promise.resolve(state.me.data);
  return once('me', async () => {
    // Keep showing the last data while a refresh runs (no flash back to the skeleton).
    emit({ ...state, me: { ...state.me, status: state.me.data ? 'ready' : 'loading' } });
    try {
      const data = await fetchParentMe();
      emit({ ...state, me: { status: 'ready', data, error: null, code: null } });
      return data;
    } catch (err) {
      log('me failed', parentErrorCode(err));
      emit({
        ...state,
        me: {
          status: 'error',
          data: state.me.data,
          error: parentError(err),
          code: parentErrorCode(err),
        },
      });
      return null;
    }
  });
};

export const loadParentWard = (wardId, force = false) => {
  const cur = state.wards[wardId] || empty();
  if (!wardId || (!force && ['loading', 'ready'].includes(cur.status)))
    return Promise.resolve(cur.data);
  return once(`ward:${wardId}`, async () => {
    emit({
      ...state,
      wards: { ...state.wards, [wardId]: { ...cur, status: cur.data ? 'ready' : 'loading' } },
    });
    try {
      const data = await fetchParentWard(wardId);
      emit({
        ...state,
        wards: { ...state.wards, [wardId]: { status: 'ready', data, error: null, code: null } },
      });
      return data;
    } catch (err) {
      emit({
        ...state,
        wards: {
          ...state.wards,
          [wardId]: {
            status: 'error',
            data: cur.data,
            error: parentError(err),
            code: parentErrorCode(err),
          },
        },
      });
      return null;
    }
  });
};

/** Re-read after a write: the home / sidebar always, plus one ward page when given. */
export const refreshParent = async (wardId) => {
  await Promise.all([loadParentMe(true), wardId ? loadParentWard(wardId, true) : null]);
};

/** Forget a ward page (after unlinking it). */
export const dropParentWard = (wardId) => {
  const wards = { ...state.wards };
  delete wards[wardId];
  emit({ ...state, wards });
};

export const resetParentLive = () => emit({ me: empty(), wards: {} });

/** True when this page shows live data (signed in, not a design frame). */
export const useParentLiveMode = () => {
  const [params] = useSearchParams();
  return isLoggedIn() && !params.has('state') && params.get('demo') !== '1';
};

/** { live, status, data, error, code } for GET /parent/me; loads on first use. */
export const useParentMe = () => {
  const live = useParentLiveMode();
  const s = useSyncExternalStore(subscribe, getState, getState);
  // Also when the store is back to idle (a hot reload resets this module's state): never stuck on "Loading".
  const idle = s.me.status === 'idle';
  useEffect(() => {
    if (live && idle) loadParentMe();
  }, [live, idle]);
  return { live, ...s.me };
};

/** Every linked ward's page data (the To review queue gathers their corrections); loads each on first use. */
export const useParentWardsDetail = (wardIds) => {
  const live = useParentLiveMode();
  const s = useSyncExternalStore(subscribe, getState, getState);
  const key = (wardIds || []).join(',');
  const missing = (wardIds || []).filter((id) => !s.wards[id]).join(',');
  useEffect(() => {
    if (live) (missing ? missing.split(',') : []).forEach((id) => loadParentWard(id));
  }, [live, key, missing]);
  return { live, wards: s.wards };
};

/** { live, status, data, error, code } for one ward page; loads on first use. */
export const useParentWard = (wardId) => {
  const live = useParentLiveMode();
  const s = useSyncExternalStore(subscribe, getState, getState);
  const idle = !s.wards[wardId] || s.wards[wardId].status === 'idle';
  useEffect(() => {
    if (live && wardId && idle) loadParentWard(wardId);
  }, [live, wardId, idle]);
  return { live, ...(s.wards[wardId] || empty()) };
};
