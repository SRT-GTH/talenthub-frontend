import { useLayoutEffect, useRef, useState } from 'react';

/*
 * FitToWidth — draws a fixed-size sheet (A4 print layout 794×1123, report page 1123×794) at its true size when there is room and scales it down
 * to the available width on narrow screens, so nothing scrolls sideways from 320 to 1920. When printing, the scale is dropped (publicPrint.css).
 * Props: width, height (the sheet's own pixel size), children, className (for the outer box).
 */

const FitToWidth = ({ width, height, children, className }) => {
  const outerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = outerRef.current?.parentElement;
    if (!el) return undefined;
    const measure = () => setScale(Math.min(1, el.clientWidth / width));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div
      ref={outerRef}
      data-fit-outer=""
      className={className}
      style={{ width: width * scale, height: height * scale }}
    >
      <div
        data-fit-inner=""
        style={{ width, height, transform: `scale(${scale})`, transformOrigin: '0 0' }}
      >
        {children}
      </div>
    </div>
  );
};

export default FitToWidth;
