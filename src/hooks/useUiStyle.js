import { useContext } from 'react';
import { UiStyleContext } from '../providers/UiStyleContext.js';

/** Appearance style + setters. Safe outside the provider (falls back to focused, no-ops). */
export const useUiStyle = () =>
  useContext(UiStyleContext) ?? {
    uiStyle: 'focused',
    vibeChosen: true,
    setUiStyle: () => {},
    markVibeChosen: () => {},
  };
