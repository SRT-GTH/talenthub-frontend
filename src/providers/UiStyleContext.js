import { createContext } from 'react';

/**
 * Appearance style (Focused | Playful). Split from the Provider so
 * react-refresh/only-export-components stays happy.
 *
 * Value shape: { uiStyle: 'focused'|'playful', vibeChosen: boolean,
 *   setUiStyle(style), markVibeChosen(style?) }
 */
export const UiStyleContext = createContext(null);
