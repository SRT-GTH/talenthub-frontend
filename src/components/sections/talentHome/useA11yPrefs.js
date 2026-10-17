import { useCallback, useSyncExternalStore } from 'react';
import { debug } from '../../../utils/debug.js';

const log = debug('useA11yPrefs');

/*
 * Talent-home accessibility preferences (Figma A11Y-02 panel 7752:3735): high contrast, text size,
 * reduce motion, underline links. Stored per browser (localStorage); swap `read`/`write` for an API
 * call when the account-level setting exists ("Settings save to your account").
 * Mode ON (`?a11y=1`) applies whichever toggles are on; the frame shows contrast, motion and links on,
 * text size "medium", so those are the defaults.
 */
const KEY = 'gth:a11y-prefs';
export const DEFAULT_A11Y_PREFS = { contrast: true, text: 'medium', motion: true, links: true };

let cache = null;
const listeners = new Set();

const read = () => {
  if (cache) return cache;
  try {
    cache = { ...DEFAULT_A11Y_PREFS, ...JSON.parse(window.localStorage.getItem(KEY) || '{}') };
  } catch {
    cache = { ...DEFAULT_A11Y_PREFS };
  }
  return cache;
};

const write = (patch) => {
  cache = { ...read(), ...patch };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    log('localStorage unavailable; preference kept in memory');
  }
  log('prefs', cache);
  listeners.forEach((fn) => fn());
};

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const useA11yPrefs = () => {
  const prefs = useSyncExternalStore(subscribe, read, () => DEFAULT_A11Y_PREFS);
  const setPref = useCallback((key, value) => write({ [key]: value }), []);
  return [prefs, setPref];
};
