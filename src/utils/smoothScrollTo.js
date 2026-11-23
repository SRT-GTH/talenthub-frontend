import { debug } from './debug.js';

const log = debug('smoothScrollTo');

/*
 * smoothScrollTo(el, { offset, duration }) — scrolls the window so `el`'s top sits `offset` px below the viewport top.
 * Animated with requestAnimationFrame instead of `scrollIntoView({ behavior: 'smooth' })`, which iOS Safari only supports
 * from 15.4 (older versions jump). The target is re-measured on every frame, so the scroll still lands correctly while the
 * iOS keyboard closes or content above the target settles. A touch / wheel / key by the user cancels it, and
 * prefers-reduced-motion jumps straight there. `offset` may be a function (re-read each frame, e.g. a fixed nav's height).
 * Returns a cancel function.
 */
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export const smoothScrollTo = (el, { offset = 0, duration } = {}) => {
  if (!el || typeof window === 'undefined') return () => {};
  const readOffset = () => (typeof offset === 'function' ? offset() : offset);
  const targetY = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = el.getBoundingClientRect().top + window.scrollY - readOffset();
    return Math.max(0, Math.min(max, Math.round(y)));
  };

  const startY = window.scrollY;
  const distance = Math.abs(targetY() - startY);
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || distance < 2) {
    log('jump (reduced motion or already there)', { to: targetY() });
    window.scrollTo(0, targetY());
    return () => {};
  }
  // 450ms for short hops up to 900ms for long ones
  const ms = duration ?? Math.min(900, Math.max(450, distance * 0.6));
  log('start', { from: startY, to: targetY(), ms: Math.round(ms) });

  let raf = 0;
  let t0 = null;
  const stop = () => {
    cancelAnimationFrame(raf);
    ['touchstart', 'wheel', 'keydown'].forEach((ev) => window.removeEventListener(ev, stop));
  };
  ['touchstart', 'wheel', 'keydown'].forEach((ev) =>
    window.addEventListener(ev, stop, { passive: true })
  );

  const step = (now) => {
    if (t0 === null) t0 = now;
    const p = Math.min(1, (now - t0) / ms);
    window.scrollTo(0, startY + (targetY() - startY) * easeInOutCubic(p));
    if (p < 1) raf = requestAnimationFrame(step);
    else {
      log('done at', window.scrollY);
      stop();
    }
  };
  raf = requestAnimationFrame(step);
  return stop;
};

export default smoothScrollTo;
