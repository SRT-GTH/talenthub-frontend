import { useSyncExternalStore } from 'react';
import { debug } from '../../../../utils/debug.js';

const log = debug('wardAccessStore');

/*
 * wardAccessStore — the in-memory mock of each ward's access status for the Opt out and restore flow (Figma "Parent · 05 Opt out and restore" 10057:1302), shared by the ward page, its dialogs and toast, so
 * opting a ward out on one screen shows the paused page and restoring brings the normal page back. Module-level store (no provider); a reload resets it, so the URL `?state=opted-out` re-applies it.
 * State: { [wardId]: { status: 'active' | 'opted-out', reasonId, reasonLabel, at, note } } — wards that are not listed are active.
 * Actions: optOut(wardId, { reasonId, reasonLabel, note, at }), restore(wardId), ensureOptedOut(wardId, { reasonId, reasonLabel, at }) and ensureRestored(wardId) (idempotent, for the frame URLs PO-02 / PO-03
 * and PO-04), reset(). Hook: useWardAccess() -> the state object.
 * ⚠️ ASSUMPTION: the safety note typed in the dialog is kept in the store only (the wards list and the recruiter side are not wired to it).
 */
let state = {};
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

export const isOptedOut = (s, wardId) => s[wardId]?.status === 'opted-out';

export const wardAccessActions = {
  optOut(wardId, { reasonId, reasonLabel, note, at }) {
    log('optOut', { wardId, reasonId, noteLength: note?.length ?? 0 });
    emit({ ...state, [wardId]: { status: 'opted-out', reasonId, reasonLabel, note, at } });
  },
  restore(wardId) {
    if (!isOptedOut(state, wardId)) return;
    log('restore', { wardId });
    emit({ ...state, [wardId]: { status: 'active' } });
  },
  ensureOptedOut(wardId, details) {
    if (!isOptedOut(state, wardId)) wardAccessActions.optOut(wardId, { note: '', ...details });
  },
  ensureRestored(wardId) {
    wardAccessActions.restore(wardId);
  },
  reset() {
    emit({});
  },
};

export const useWardAccess = () => useSyncExternalStore(subscribe, getState, getState);
