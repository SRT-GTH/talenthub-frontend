import { useEffect } from 'react';
import { debug } from '../utils/debug.js';

const log = debug('useScopedRoundedFont');

/*
 * useScopedRoundedFont — turns on the bundled SF Pro Rounded (`GTH Parent Rounded`, styles/parent.css) while a screen is mounted.
 * The font stack is scoped by an attribute on <html> so no other page changes font and portalled dialogs and toasts get it too:
 * `attribute` is `data-parent-ui` (the parent screens) or `data-recruiter-ui` (the recruiter Career Buddy). If the bundled face fails to
 * load, `data-rounded-font="fallback"` bumps the Nunito fallback's weights (styles/parent.css). `enabled` = false does nothing.
 */
const useScopedRoundedFont = (attribute, enabled = true) => {
  useEffect(() => {
    if (!enabled) return undefined;
    const root = document.documentElement;
    log('on', attribute);
    root.setAttribute(attribute, '');
    document.fonts
      ?.load('600 16px "GTH Parent Rounded"')
      .then((faces) => {
        if (!faces.length) root.setAttribute('data-rounded-font', 'fallback');
      })
      .catch(() => root.setAttribute('data-rounded-font', 'fallback'));
    return () => {
      root.removeAttribute(attribute);
      root.removeAttribute('data-rounded-font');
    };
  }, [attribute, enabled]);
};

export default useScopedRoundedFont;
