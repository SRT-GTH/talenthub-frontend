import { createContext } from 'react';

/*
 * AvatarSelectionContext — the raw React Context object.
 *
 * Lives in its own file because the eslint react-refresh/only-export-components
 * rule won't allow the Provider file (which exports a component) to also
 * export non-component values. Importers should usually pull
 * `useAvatarSelection()` from src/hooks/ instead of using this directly.
 */

export const AVATAR_SELECTION_DEFAULTS = {
  // Identity
  username: 'KofiA_23',

  // Style step
  baseStyle: 'style-1',

  // Skin step
  skinTone: 'cocoa',
  lightness: 0,
  lighting: 'daylight',

  // Hair step
  hairStyle: 'locs',
  hairColor: 'black',
  hairVolume: 'medium',

  // Extras step
  eyewear: 'locs',
  facialHair: 'full-beard',
  earring: 'stud',
  details: ['blush'],
  tintColor: 'black',

  // Outfit step
  careerPreset: null,
  apparel: 'suit',
  fit: 'regular',
  apparelColor: 'brand-green',
};

export const AvatarSelectionContext = createContext({
  selection: AVATAR_SELECTION_DEFAULTS,
  setField: () => {},
  toggleMulti: () => {},
});
