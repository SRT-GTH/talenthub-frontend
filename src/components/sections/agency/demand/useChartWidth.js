import { useEffect, useRef, useState } from 'react';

/*
 * useChartWidth — measures the width of a chart box so the custom SVG charts can lay out in real pixels (text stays 11-12px at every
 * width instead of scaling down with a viewBox). Returns [ref, width]; width starts at `fallback` until the first measure.
 */
const useChartWidth = (fallback = 600) => {
  const ref = useRef(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    setWidth(Math.round(el.getBoundingClientRect().width) || fallback);
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([entry]) => {
      const next = Math.round(entry.contentRect.width);
      if (next) setWidth(next);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [fallback]);
  return [ref, width];
};

export default useChartWidth;
