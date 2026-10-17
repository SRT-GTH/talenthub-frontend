import { debug } from '../utils/debug.js';

const log = debug('uiStylePreference');

/*
 * Appearance-style preference (Focused | Playful) — Figma "GTH · Style switch"
 * 7875:85654: "Appearance style for talent screens. Independent from Switch
 * Modes (AI chat vs step-by-step) and from Accessibility settings."
 *
 * Frontend-only for now (localStorage). This module is the ONLY place that
 * knows where the preference lives, so wiring it to the backend later means
 * changing `loadUiStyle` / `saveUiStyle` (e.g. GET/PATCH the user's profile
 * settings) without touching any component.
 */
export const UI_STYLES = ['focused', 'playful'];
export const DEFAULT_UI_STYLE = 'playful';

const STYLE_KEY = 'gth:ui-style';
const CHOSEN_KEY = 'gth:ui-style-chosen';

const read = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // storage unavailable (private mode) — preference lasts for the session only
  }
};

/** @returns {{ style: 'focused'|'playful', chosen: boolean }} chosen = user has answered "Pick your vibe" */
export const loadUiStyle = () => {
  const stored = read(STYLE_KEY);
  const style = UI_STYLES.includes(stored) ? stored : DEFAULT_UI_STYLE;
  const chosen = read(CHOSEN_KEY) === '1';
  log('load', { style, chosen });
  return { style, chosen };
};

export const saveUiStyle = (style, { chosen = true } = {}) => {
  if (!UI_STYLES.includes(style)) return;
  log('save', { style, chosen });
  write(STYLE_KEY, style);
  if (chosen) write(CHOSEN_KEY, '1');
};
