import { useEffect, useSyncExternalStore } from 'react';
import { debug } from '../../../../utils/debug.js';
import {
  apiMessage,
  closeProgramme as apiClose,
  duplicateProgramme as apiDuplicate,
  listProgrammes,
} from '../../../../services/institutionPortal.api.js';

const log = debug('programmesStore');

/*
 * programmesStore — the school's programmes as the API returns them (GET /api/institution/programmes), shared by the list, the
 * "Who can apply" select and the applicants board. Closing and duplicating go to the API and replace the card with the server's copy.
 * Stale-while-revalidate: a page that opens the store shows the cached list at once and, when it is older than STALE_MS, refreshes it
 * quietly (no loading state) so new sign-ups and changes made by colleagues appear without a full reload.
 */

const STALE_MS = 30 * 1000;
let state = { programmes: [], loaded: false, loading: false, error: '', loadedAt: 0 };
let pending = null;
const listeners = new Set();

const set = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getState = () => state;

export const loadProgrammes = (force = false) => {
  if (pending) return pending;
  if (state.loaded && !force) return Promise.resolve(state.programmes);
  // a refresh of a list already on screen stays silent: no loading state, the old list stays until the new one arrives
  set(state.loaded ? { error: '' } : { loading: true, error: '' });
  pending = listProgrammes()
    .then((res) => {
      const items = res?.items ?? [];
      log('loaded', items.length);
      set({ programmes: items, loaded: true, loading: false, loadedAt: Date.now() });
      return items;
    })
    .catch((err) => {
      set({ loading: false, error: apiMessage(err) });
      return state.programmes;
    })
    .finally(() => {
      pending = null;
    });
  return pending;
};

/** The store, loaded on first use and refreshed in the background when a page opens it with a stale list. */
export const useProgrammesStore = () => {
  const s = useSyncExternalStore(subscribe, getState, getState);
  useEffect(() => {
    loadProgrammes(state.loaded && Date.now() - state.loadedAt > STALE_MS);
  }, []);
  return s;
};

export const upsertProgramme = (card) => {
  if (!card?.id) return;
  const has = state.programmes.some((p) => p.id === card.id);
  set({
    programmes: has
      ? state.programmes.map((p) => (p.id === card.id ? { ...p, ...card } : p))
      : [card, ...state.programmes],
  });
};

export const closeProgramme = async (id) => {
  log('close', id);
  const card = await apiClose(id);
  upsertProgramme(card);
  return card;
};

export const duplicateProgramme = async (id) => {
  log('duplicate', id);
  const copy = await apiDuplicate(id);
  upsertProgramme(copy);
  return copy;
};
