import { useSyncExternalStore } from 'react';
import { debug } from '../../../../utils/debug.js';
import { SAVED_QUERIES } from '../data/queriesData.js';

const log = debug('queriesStore');

/*
 * queriesStore — the MOCK "server state" of the agency queries (saved queries, export log, quota spent this session).
 * ⚠️ ASSUMPTION: in memory only (a reload restores the seed). The future API is POST /agency/queries, DELETE /agency/queries/:id,
 * POST /agency/queries/:id/export. Saving a query and exporting a CSV each use 1 query of the MoU quota (Figma 11.5.1c / 11.5.1d).
 * The persona card in the chrome reads the session, so it does not move with `quotaSpent` (listed in the package report).
 */

let state = { saved: SAVED_QUERIES, quotaSpent: 0, exportLog: [] };
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

export const useQueriesStore = () => useSyncExternalStore(subscribe, getState, getState);

export const addSavedQuery = (query) => {
  log('save', query.id);
  set({ saved: [query, ...state.saved], quotaSpent: state.quotaSpent + 1 });
};

export const removeSavedQuery = (id) => {
  log('delete', id);
  set({ saved: state.saved.filter((q) => q.id !== id) });
};

export const togglePausedQuery = (id) => {
  log('toggle pause', id);
  set({
    saved: state.saved.map((q) =>
      q.id === id
        ? q.status === 'paused'
          ? {
              ...q,
              status: 'scheduled',
              schedule: q.resumeSchedule ?? 'Monthly',
              movedPct: q.movedPct ?? 0,
            }
          : {
              ...q,
              status: 'paused',
              resumeSchedule: q.schedule,
              schedule: 'Not refreshing',
              movedPct: null,
            }
        : q
    ),
  });
};

export const logExport = (entry) => {
  log('export', entry.kind);
  set({ exportLog: [entry, ...state.exportLog], quotaSpent: state.quotaSpent + 1 });
};

export const spendQuota = (n) => {
  log('quota', n);
  set({ quotaSpent: state.quotaSpent + n });
};
