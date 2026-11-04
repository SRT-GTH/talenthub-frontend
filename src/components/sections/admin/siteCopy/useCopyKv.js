import { useCallback, useEffect, useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';

const log = debug('useCopyKv');

/*
 * useCopyKv — the tiny shared mock "server" of the Platform Admin 7.8 screens: a value kept in sessionStorage under `gth:copy:<key>`,
 * shared by every screen that uses the same key (a draft saved in the editor shows on the browse list, a publish shows in the history).
 *   const [drafts, setDrafts, reset] = useCopyKv('drafts', {})
 * `setDrafts(next | (prev) => next)` persists and notifies the other hooks / tabs on the same key; `reset()` restores `initial`.
 * Key convention: `<area>.<thing>` (`site-copy.drafts`, `site-copy.history.public.home.hero`, `product-names.renames`, `media.assets`).
 * Seed data lives in the screen's own data file and is passed as `initial`; nothing is sent anywhere (⚠️ ASSUMPTION: no backend yet).
 * A `?f=<frame>` style frame URL must NOT depend on stored state: frame screens seed from `initial` and ignore storage (pass `{ persist: false }`).
 */
const NAME = (key) => `gth:copy:${key}`;
const EVENT = 'gth:copy-kv';

/** Plain (non-hook) access to the same store, for code that is not a component (the publish flow writes history entries). */
export const readCopyKv = (key, initial) => {
  try {
    const raw = window.sessionStorage.getItem(NAME(key));
    return raw === null ? initial : JSON.parse(raw);
  } catch {
    return initial;
  }
};

/** Write + notify every useCopyKv hook on the same key. */
export const writeCopyKv = (key, value) => {
  try {
    window.sessionStorage.setItem(NAME(key), JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { key } }));
  } catch {
    log('storage unavailable', key);
  }
};

export const useCopyKv = (key, initial, { persist = true } = {}) => {
  const [value, setValue] = useState(() => (persist ? readCopyKv(key, initial) : initial));

  useEffect(() => {
    if (!persist) return undefined;
    const sync = (e) => {
      if (e.detail?.key === key) setValue(readCopyKv(key, initial));
    };
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, persist]);

  const latest = useRef(value);
  latest.current = value;

  const set = useCallback(
    (next) => {
      const v = typeof next === 'function' ? next(latest.current) : next;
      latest.current = v;
      setValue(v);
      if (!persist) return;
      try {
        window.sessionStorage.setItem(NAME(key), JSON.stringify(v));
        window.dispatchEvent(new CustomEvent(EVENT, { detail: { key } }));
      } catch {
        log('storage unavailable', key);
      }
    },
    [key, persist]
  );

  const reset = useCallback(() => {
    try {
      window.sessionStorage.removeItem(NAME(key));
    } catch {
      /* storage unavailable */
    }
    setValue(initial);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { key } }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, set, reset];
};
