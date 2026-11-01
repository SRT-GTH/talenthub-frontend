import { useEffect, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';

const log = debug('useDotWindow');

/*
 * useDotWindow — how many progress dots fit the shared LabProgressStrip at this viewport (it never wraps its dots, and from `md` it
 * centres them absolutely between the count label and the "Best so far" chip). 20 dots only fit from 1280px up; below that the
 * strip shows a window of dots around the current card (the "Card 14 of 20" label still tells the whole story).
 *   <480: 8 · <768: 10 · <1024: 8 · <1280: 14 · wider: all
 */
const countFor = (width) => {
  if (width < 480) return 8;
  if (width < 768) return 10;
  if (width < 1024) return 8;
  if (width < 1280) return 14;
  return Infinity;
};

export const useDotWindowSize = () => {
  const [size, setSize] = useState(() =>
    typeof window === 'undefined' ? Infinity : countFor(window.innerWidth)
  );
  useEffect(() => {
    const onResize = () => {
      const next = countFor(window.innerWidth);
      log('viewport', window.innerWidth, '→ dots', next);
      setSize(next);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
};

/** The slice of `dots` that contains `current`, centred where it can be. */
export const windowDots = (dots, current, size) => {
  if (dots.length <= size) return dots;
  const start = Math.max(0, Math.min(dots.length - size, current - Math.floor(size / 2)));
  return dots.slice(start, start + size);
};
