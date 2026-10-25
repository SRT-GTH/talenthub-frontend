import { useSyncExternalStore } from 'react';
import { debug } from '../../../../utils/debug.js';
import { PROGRAMMES } from './data/programmesData.js';

const log = debug('programmesStore');

/*
 * programmesStore — the MOCK "server state" of the agency programmes (status changes, duplicates, publishing).
 * ⚠️ ASSUMPTION: in memory only (a reload restores the seed). Future API: PATCH /institution/programmes/:id { status }, POST /institution/programmes/:id/duplicate,
 * POST /institution/programmes/:id/publish. Closing a programme is logged under the MoU (Figma 11.5.2k).
 */

let state = { programmes: PROGRAMMES, log: [] };
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

export const useProgrammesStore = () => useSyncExternalStore(subscribe, getState, getState);

export const closeProgramme = (id) => {
  log('close', id);
  set({
    programmes: state.programmes.map((p) =>
      p.id === id
        ? {
            ...p,
            status: 'closed',
            statusLabel: 'Closed',
            tile: { bg: 'bg-[#eae8e2]', fg: 'text-[#737373]' },
            action: 'View summary',
          }
        : p
    ),
    log: [{ at: Date.now(), event: 'close', id }, ...state.log],
  });
};

export const duplicateProgramme = (id) => {
  const src = state.programmes.find((p) => p.id === id);
  if (!src) return null;
  const copy = {
    ...src,
    id: `${src.id}-copy-${state.programmes.length + 1}`,
    title: `${src.title} (copy)`,
    optionLabel: `${src.title} (copy)`,
    status: 'draft',
    statusLabel: 'Draft',
    stamp: 'Draft · saved today',
    applicants: null,
    toReview: null,
    avgMatch: null,
    success: null,
    action: 'Continue editing',
    tile: { bg: 'bg-[#faf4e8]', fg: 'text-[#785910]' },
  };
  log('duplicate', id, '->', copy.id);
  set({ programmes: [...state.programmes, copy] });
  return copy;
};

export const publishProgramme = (id) => {
  log('publish', id);
  set({
    programmes: state.programmes.map((p) =>
      p.id === id
        ? {
            ...p,
            status: 'live',
            statusLabel: 'Active',
            action: 'View applicants',
            tile: { bg: 'bg-[#f3f8f4]', fg: 'text-[#2a5730]' },
          }
        : p
    ),
    log: [{ at: Date.now(), event: 'publish', id }, ...state.log],
  });
};
