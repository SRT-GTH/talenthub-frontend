import { useSyncExternalStore } from 'react';
import { debug } from '../../../../utils/debug.js';
import { DECIDED_SAMPLES, RECORDS } from './data/recordsData.js';

const log = debug('recordsStore');

/*
 * recordsStore — the MOCK "server state" of the record verification queue (approve / reject / bulk approve).
 * ⚠️ ASSUMPTION: in memory only (a reload restores the seed). Future API: POST /institution/records/:id/approve,
 * POST /institution/records/:id/reject { reason, note }, POST /institution/records/bulk-approve { ids } — every approval is logged under the approver's name.
 */

let state = { records: [...RECORDS, ...DECIDED_SAMPLES], decided: [] };
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

export const useRecordsStore = () => useSyncExternalStore(subscribe, getState, getState);

const decide = (ids, status, extra = {}) => {
  const wanted = new Set(ids);
  log('decide', status, [...wanted]);
  set({
    records: state.records.map((r) => (wanted.has(r.id) ? { ...r, status, ...extra } : r)),
    decided: [
      ...state.decided,
      ...state.records
        .filter((r) => wanted.has(r.id) && (r.status === 'pending' || r.status === 'needs-info'))
        .map((r) => ({ id: r.id, kind: r.kind, status, waitingDays: r.waitingDays ?? 0 })),
    ],
  });
};

export const approveRecords = (ids) => decide(ids, 'approved');

export const rejectRecord = (id, { reason, note }) => decide([id], 'rejected', { reason, note });
