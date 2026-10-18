import { useLayoutEffect, useRef, useState } from 'react';

/* Non-component helpers shared by the Share profile views (kept out of the .jsx files for fast refresh). */

export const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

export const SHARE_INPUT_CLASS =
  'h-[51px] w-full min-w-0 rounded-[10px] bg-white pr-[16px] pl-[20px] text-[14px] leading-6 font-medium tracking-[0.2px] text-[#1c2a21] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_11px_rgba(28,42,33,0.03)] outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#387440]';

/* Base pixel size of each share-card art (Figma `share card · …`). */
export const CARD_BASE = {
  story: { w: 300, h: 533 },
  post: { w: 340, h: 340 },
  banner: { w: 352, h: 88 },
};

/* Scales fixed-size art (the share card) down to the width of its container. */
export const useFitScale = (baseWidth) => {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const next = Math.min(1, el.clientWidth / baseWidth);
      setScale((prev) => (Math.abs(prev - next) < 0.001 ? prev : next));
    };
    measure();
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    ro?.observe(el);
    return () => ro?.disconnect();
  }, [baseWidth]);
  return [ref, scale];
};
