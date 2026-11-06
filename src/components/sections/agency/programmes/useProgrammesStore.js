import { useEffect, useSyncExternalStore } from 'react';
import { debug } from '../../../../utils/debug.js';
import {
  closeProgrammeApi,
  duplicateProgrammeApi,
  listProgrammes,
  publishProgrammeApi,
} from '../../../../services/agency.api.js';

const log = debug('programmesStore');

/*
 * programmesStore — the agency's programmes from GET /agency/programmes (opportunities of type government-program the agency posted).
 * One shared copy for the list, the Programme selects and the applicants page; every change goes to the server and the list reloads.
 *   closeProgramme(id)      POST /agency/programmes/:id/close      (logged under the MoU)
 *   duplicateProgramme(id)  POST /agency/programmes/:id/duplicate  (a draft "<title> (copy)")
 *   publishProgramme(id)    POST /agency/programmes/:id/publish    (policy check + audience of 5 or more; throws the server error)
 */

let state = { programmes: [], loading: true, loaded: false, error: null };
let inflight = null;
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

export const reloadProgrammes = () => {
  if (inflight) return inflight;
  set({ loading: true });
  inflight = listProgrammes()
    .then((res) => {
      set({ programmes: res?.items ?? [], loading: false, loaded: true, error: null });
      return res?.items ?? [];
    })
    .catch((err) => {
      log('load failed', err?.message);
      set({ loading: false, loaded: true, error: err });
      return [];
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
};

export const useProgrammesStore = () => {
  const s = useSyncExternalStore(subscribe, getState, getState);
  useEffect(() => {
    if (!state.loaded && !inflight) reloadProgrammes();
  }, []);
  return { ...s, reload: reloadProgrammes };
};

export const closeProgramme = async (id) => {
  log('close', id);
  const card = await closeProgrammeApi(id);
  await reloadProgrammes();
  return card;
};

export const duplicateProgramme = async (id) => {
  log('duplicate', id);
  const copy = await duplicateProgrammeApi(id);
  await reloadProgrammes();
  return copy;
};

export const publishProgramme = async (id) => {
  log('publish', id);
  const card = await publishProgrammeApi(id);
  await reloadProgrammes();
  return card;
};
