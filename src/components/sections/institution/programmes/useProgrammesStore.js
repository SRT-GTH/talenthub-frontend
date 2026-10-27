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
 */

let state = { programmes: [], loaded: false, loading: false, error: '' };
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
  set({ loading: true, error: '' });
  pending = listProgrammes()
    .then((res) => {
      const items = res?.items ?? [];
      log('loaded', items.length);
      set({ programmes: items, loaded: true, loading: false });
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

/** The store, loaded on first use. */
export const useProgrammesStore = () => {
  const s = useSyncExternalStore(subscribe, getState, getState);
  useEffect(() => {
    loadProgrammes();
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
