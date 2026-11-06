import { useCallback, useSyncExternalStore } from 'react';

/*
 * Staff accessibility preferences for the admin back office: high contrast, text size, reduce motion, underline
 * links. Stored per browser (localStorage, key gth:admin-a11y); all off by default (the talent defaults turn
 * contrast on, which is not what staff expect). AdminFrame turns them into data-admin-* attributes that
 * styles/adminA11y.css reads.
 */
const KEY = 'gth:admin-a11y';
export const ADMIN_A11Y_DEFAULTS = { contrast: false, text: 'normal', motion: false, links: false };
export const TEXT_SIZES = [
  { id: 'normal', label: 'Normal' },
  { id: 'large', label: 'Large' },
  { id: 'larger', label: 'Larger' },
];

let cache = null;
const listeners = new Set();
const read = () => {
  if (cache) return cache;
  try {
    cache = { ...ADMIN_A11Y_DEFAULTS, ...JSON.parse(window.localStorage.getItem(KEY) || '{}') };
  } catch {
    cache = { ...ADMIN_A11Y_DEFAULTS };
  }
  return cache;
};
const write = (patch) => {
  cache = { ...read(), ...patch };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* private mode: keep in memory */
  }
  listeners.forEach((fn) => fn());
};
const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const useAdminA11y = () => {
  const prefs = useSyncExternalStore(subscribe, read, () => ADMIN_A11Y_DEFAULTS);
  const setPref = useCallback((key, value) => write({ [key]: value }), []);
  const reset = useCallback(() => write({ ...ADMIN_A11Y_DEFAULTS }), []);
  return [prefs, setPref, reset];
};

/** Attributes for the admin root element. */
export const adminA11yAttrs = (p) => ({
  'data-admin-contrast': p.contrast ? '' : undefined,
  'data-admin-motion': p.motion ? '' : undefined,
  'data-admin-links': p.links ? '' : undefined,
  'data-admin-text': p.text !== 'normal' ? p.text : undefined,
});
