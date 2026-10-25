import { useSyncExternalStore } from 'react';
import { debug } from '../../../../utils/debug.js';

const log = debug('useProgressFlags');

/*
 * useProgressFlags — session-only store of the students flagged for coaching in this visit (⚠️ ASSUMPTION: no backend; POST
 * /institution/progress/students/:id/coaching-flags later). Returns { flagged: Set<string>, flag(id) }.
 */

let flagged = new Set();
const listeners = new Set();

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getSnapshot = () => flagged;

const flag = (id) => {
  log('flag', id);
  flagged = new Set(flagged).add(id);
  listeners.forEach((listener) => listener());
};

export const useProgressFlags = () => ({
  flagged: useSyncExternalStore(subscribe, getSnapshot),
  flag,
});
