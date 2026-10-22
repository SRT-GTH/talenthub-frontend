import { useLayoutEffect, useRef, useState } from 'react';

/*
 * useFitScale — measure a wrapper and return the scale (<=1) that fits a fixed-design-width artboard inside it.
 * The Figma tablet/mobile frames show the desktop "card fan" scaled down uniformly (0.538 / 0.279), so we do the same.
 */
export const useFitScale = (designWidth) => {
  const ref = useRef(null);
  const [state, setState] = useState({ scale: 1, width: designWidth });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => {
      const w = el.clientWidth;
      setState({ scale: Math.min(1, w / designWidth), width: w });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [designWidth]);
  return [ref, state.scale, state.width];
};
