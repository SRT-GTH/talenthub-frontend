import { flushSync } from 'react-dom';
import { debug } from './debug.js';

const log = debug('smoothLayout');

/*
 * Run a React state change as a View Transition, so elements that carry a `view-transition-name` glide from their old
 * place to the new one and everything else cross-fades (timings in index.css, "Home layout transitions").
 * Falls back to an instant change when the browser has no View Transitions or the user asked for reduced motion.
 */
export const smoothLayout = (update, why = 'layout') => {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (typeof document === 'undefined' || !document.startViewTransition || reduced) {
    log('instant', why, reduced ? '(reduced motion)' : '(no view transitions)');
    update();
    return;
  }
  log('animate', why);
  document.startViewTransition(() => flushSync(update));
};
