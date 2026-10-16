import { useCallback, useMemo, useState } from 'react';
import { debug } from '../utils/debug.js';
import { loadUiStyle, saveUiStyle } from '../services/uiStylePreference.js';
import { UiStyleContext } from './UiStyleContext.js';

const log = debug('UiStyleProvider');

/**
 * UiStyleProvider — holds the Focused / Playful appearance choice for the
 * whole app. It only STORES the choice; nothing changes visually until a
 * screen opts in by rendering <UiStyleScope> (see components/shared).
 */
export default function UiStyleProvider({ children }) {
  const [state, setState] = useState(loadUiStyle);

  const setUiStyle = useCallback((next) => {
    log('dispatch setUiStyle', { next });
    saveUiStyle(next);
    setState({ style: next, chosen: true });
  }, []);

  // "Pick your vibe" answered (Not now / Keep X) — stop asking.
  const markVibeChosen = useCallback((next) => {
    setState((prev) => {
      const style = next ?? prev.style;
      log('dispatch markVibeChosen', { style });
      saveUiStyle(style);
      return { style, chosen: true };
    });
  }, []);

  const value = useMemo(
    () => ({
      uiStyle: state.style,
      vibeChosen: state.chosen,
      setUiStyle,
      markVibeChosen,
    }),
    [state, setUiStyle, markVibeChosen]
  );

  return <UiStyleContext.Provider value={value}>{children}</UiStyleContext.Provider>;
}
