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

  // Style step. Default is null so no tile is pre-selected on first
  // landing — the user picks a style themselves, which then fires the
  // preset (skinTone + hairStyle + apparel + …) for the avatar preview.
  // Previously this defaulted to 'style-1', which highlighted the first
  // tile but didn't fire its preset, so the avatar (just body-base)
  // didn't match the highlighted tile.
  baseStyle: null,

  // Skin step
  skinTone: 'cocoa',
  lightness: 0,
  lighting: 'daylight',

  // Hair step — ids match the tiles in AvatarHairPanel. Default is "no
  // pick yet" for hairStyle/hairColor so a fresh user has to choose.
  hairStyle: null,
  hairColor: 'black',
  hairVolumeLevel: 0,

  // Extras step — pick-one groups default to the group's "None" sentinel
  // so the Selected count doesn't pre-inflate before the user touches
  // anything. Details is a multi-select array (starts empty).
  eyewear: 'eyewear-none',
  facialHair: 'facial-none',
  earring: 'earring-none',
  details: null,
  // Separate tint per row so eyewear and earring can have different
  // colours (e.g., gold glasses + silver earrings). Both default to
  // null so the items render in their designed Figma colours on first
  // load — only changes when the user picks a tint swatch.
  eyewearTintColor: null,
  earringTintColor: null,

  // Outfit step — apparel + apparelColor default to null. With
  // apparelColor null the recolour pipeline is skipped and each outfit
  // renders in its designer-chosen Figma colour (purple Tee, navy
  // Hoodie, blue Polo, etc.). Picking an apparel-colour swatch then
  // recolours over that.
  careerPreset: null,
  apparel: null,
  fit: 'regular',
  apparelColor: null,
};

export const AvatarSelectionContext = createContext({
  selection: AVATAR_SELECTION_DEFAULTS,
  setField: () => {},
  toggleMulti: () => {},
  undo: () => {},
  reset: () => {},
});
