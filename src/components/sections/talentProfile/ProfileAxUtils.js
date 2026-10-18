import { useLayoutEffect, useRef, useState } from 'react';

/* Non-component helpers for the AX overlays: measure real page elements and stay glued to them. */

export const isVisible = (el) => Boolean(el) && el.getClientRects().length > 0;

export const rectOf = (el) => {
  if (!isVisible(el)) return null;
  const b = el.getBoundingClientRect();
  return {
    x: Math.round(b.left * 2) / 2,
    y: Math.round(b.top * 2) / 2,
    w: Math.round(b.width * 2) / 2,
    h: Math.round(b.height * 2) / 2,
  };
};

/* First element matching `selector` that is actually rendered (compact + full sidebars both exist). */
export const queryVisible = (selector, root = document) =>
  [...root.querySelectorAll(selector)].find(isVisible) ?? null;

/* The scrolling <main> of the talent shell (overlays that point at page content clip to it). */
export const mainRect = () =>
  rectOf(document.getElementById('main')) ?? {
    x: 0,
    y: 0,
    w: window.innerWidth,
    h: window.innerHeight,
  };

/*
 * useAxMeasure(measure) -> latest `measure()` result (null until the first layout). Re-measures on resize,
 * on any scroll (capture, so the inner <main> counts), on DOM changes and when sizes change, throttled to one
 * frame; the state only changes when the numbers do.
 */
export const useAxMeasure = (measure) => {
  const [value, setValue] = useState(null);
  const latest = useRef(measure);
  latest.current = measure;

  useLayoutEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      const next = latest.current();
      setValue((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    run();
    window.addEventListener('resize', schedule);
    document.addEventListener('scroll', schedule, true);
    const mo = new MutationObserver(schedule);
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'hidden'],
    });
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    ro?.observe(document.body);
    const mainEl = document.getElementById('main');
    if (mainEl) ro?.observe(mainEl);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('scroll', schedule, true);
      mo.disconnect();
      ro?.disconnect();
    };
  }, []);

  return value;
};
