import { useEffect, useState } from 'react';

/*
 * The mobile Figma frame is 430px wide. Below 430 the layout would otherwise reflow with the same fixed type sizes, so text looks oversized
 * (pill text wrapping, headings breaking) on 320/360/375 phones. Instead the whole landing tree is rendered at the 430 layout and scaled
 * down with CSS `zoom` (= viewport / 430), so every size shrinks proportionally. ≥ 430 → 1 (no change).
 */
const DESIGN_WIDTH = 430;

const compute = () =>
  typeof window === 'undefined' ? 1 : Math.min(1, window.innerWidth / DESIGN_WIDTH);

const useFitZoom = () => {
  const [zoom, setZoom] = useState(compute);
  useEffect(() => {
    const onResize = () => setZoom(compute());
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return zoom;
};

export default useFitZoom;
