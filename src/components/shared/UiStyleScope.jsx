import { useEffect } from 'react';
import { debug } from '../../utils/debug.js';
import { useUiStyle } from '../../hooks/useUiStyle.js';

const log = debug('UiStyleScope');

/*
 * UiStyleScope — opts a screen in to the Playful appearance.
 *
 * While mounted (and `enabled`), it puts `data-ui-style="playful|focused"` on
 * <html>. Every Playful rule in the codebase is written with the `playful:`
 * Tailwind variant (src/index.css), which only matches under
 * `[data-ui-style="playful"]`. Because the attribute is REMOVED on unmount,
 * no other route can ever pick Playful styling up — shared components
 * (Button, Modal, Toast…) keep their Focused look everywhere except inside a
 * scope. It lives on <html> rather than a wrapper div so portaled
 * modals/toasts (rendered into <body>) are themed too.
 *
 * Usage: render <UiStyleScope enabled={isTalent} /> anywhere in the screen.
 */
const UiStyleScope = ({ enabled = true }) => {
  const { uiStyle } = useUiStyle();

  useEffect(() => {
    if (!enabled) return undefined;
    const root = document.documentElement;
    root.setAttribute('data-ui-style', uiStyle);
    log('scope on', { uiStyle });
    return () => {
      root.removeAttribute('data-ui-style');
      log('scope off');
    };
  }, [enabled, uiStyle]);

  return null;
};

export default UiStyleScope;
