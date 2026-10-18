import { useCallback, useSyncExternalStore } from 'react';
import { debug } from '../../../utils/debug.js';
import { useA11yPrefs } from '../talentHome/useA11yPrefs.js';

const log = debug('useProfileA11y');

/*
 * Talent profile accessibility preferences — the "Accessibility · your way" panel (Figma AX-01,
 * Playful 7590:1952 / Focused 8110:389972). Six profile-scoped settings, stored per browser
 * (localStorage `gth:profile-a11y`; swap `read`/`write` for an API call when accounts exist):
 *   aloud      Read my profile aloud
 *   size       Profile text size  small | medium | large   (frame default: medium)
 *   describe   Describe my images
 *   calm       Calm profile
 *   captions   Captions on pitches                          (frame default: ON)
 *   oneColumn  One-column layout
 * plus `scope` ('profile' | 'everywhere') for the Everywhere / On Profile tabs (the frames only draw
 * "On Profile"; "Everywhere" has no frame of its own — ⚠️ ASSUMPTION: it is a stored choice only).
 *
 * `effectiveProfileA11y` merges these with the Figma frame states reachable by URL, so each frame
 * renders exactly as drawn regardless of what is stored:
 *   ?ax=calm      AX-02  Calm + Large text + One column applied
 *   ?ax=contrast  AX-03  High contrast (+ Underline links) applied   (global talent settings)
 * High contrast / Underline links are the existing talent-wide prefs (useA11yPrefs); they apply on the
 * profile only while accessibility mode is on (`?a11y=1`), same as the rest of the talent app.
 */
const KEY = 'gth:profile-a11y';
export const DEFAULT_PROFILE_A11Y = {
  scope: 'profile',
  aloud: false,
  size: 'medium',
  describe: false,
  calm: false,
  captions: true,
  oneColumn: false,
};

let cache = null;
const listeners = new Set();

const read = () => {
  if (cache) return cache;
  try {
    cache = { ...DEFAULT_PROFILE_A11Y, ...JSON.parse(window.localStorage.getItem(KEY) || '{}') };
  } catch {
    cache = { ...DEFAULT_PROFILE_A11Y };
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

export const useProfileA11yPrefs = () => {
  const prefs = useSyncExternalStore(subscribe, read, () => DEFAULT_PROFILE_A11Y);
  const setPref = useCallback((key, value) => write({ [key]: value }), []);
  return [prefs, setPref];
};

/* What is actually applied to the page right now (stored prefs + URL frame states). */
export const effectiveProfileA11y = (prefs, globalPrefs, { ax, a11yOn }) => {
  const frameCalm = ax === 'calm';
  const frameContrast = ax === 'contrast';
  return {
    calm: prefs.calm || frameCalm,
    size: frameCalm ? 'large' : prefs.size,
    oneColumn: prefs.oneColumn || frameCalm,
    contrast: frameContrast || (a11yOn && globalPrefs.contrast),
    links: frameContrast || (a11yOn && globalPrefs.links),
    captions: prefs.captions,
    aloud: prefs.aloud || ax === 'aloud',
    describe: prefs.describe || ax === 'images' || ax === 'alt',
  };
};

export const useProfileA11y = (profile) => {
  const [prefs, setPref] = useProfileA11yPrefs();
  const [globalPrefs] = useA11yPrefs();
  const effective = effectiveProfileA11y(prefs, globalPrefs, {
    ax: profile?.ax,
    a11yOn: Boolean(profile?.a11yParam),
  });
  return { prefs, setPref, effective };
};
