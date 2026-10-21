import { useCallback, useSyncExternalStore } from 'react';

/*
 * Which arcade games this talent has finished (kept in this browser; swap for the API). The games call `markArcadePlayed(id)`
 * when a run finishes (usePersonalityRun); the hub reads it. `?played=` on the hub overrides it for the Figma frames.
 */
const KEY = 'gth:arcade-played';
const listeners = new Set();

const read = () => {
  try {
    const raw = JSON.parse(window.localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};

let snapshot = null;
const getSnapshot = () => {
  const next = JSON.stringify(read());
  if (snapshot?.key !== next) snapshot = { key: next, list: JSON.parse(next) };
  return snapshot.list;
};
const subscribe = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const markArcadePlayed = (id) => {
  if (!id) return;
  const list = read();
  if (list.includes(id)) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...list, id]));
  } catch {
    /* private mode: the run just is not remembered */
  }
  listeners.forEach((cb) => cb());
};

export const useArcadePlayed = () => {
  const list = useSyncExternalStore(subscribe, getSnapshot, () => []);
  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    listeners.forEach((cb) => cb());
  }, []);
  return { played: list, clear };
};
