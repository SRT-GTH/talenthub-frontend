/*
 * NumbersWordsDashedFrame — a dashed rounded-rect outline whose dash length is exact (CSS `border-style: dashed` cannot set it).
 * Figma: Pattern Pulse "show the right answer" card = 2.5px #387440, dash [6, 4], radius 20 (Focused 14);
 *        Word Shuffle empty answer slot = 1.5px ink@.30, dash [5, 5], radius 14 (Focused 1px #dee5e0, radius 10).
 * Absolutely fills its (relative) parent; `className` carries the stroke colour (text-*) and the radius is passed in px.
 */
const NumbersWordsDashedFrame = ({ strokeWidth, dash, radius, className }) => {
  const inset = strokeWidth / 2;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 size-full overflow-visible"
    >
      <rect
        x={inset}
        y={inset}
        rx={Math.max(0, radius - inset)}
        ry={Math.max(0, radius - inset)}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={dash}
        className={className}
        style={{ width: `calc(100% - ${strokeWidth}px)`, height: `calc(100% - ${strokeWidth}px)` }}
      />
    </svg>
  );
};

export default NumbersWordsDashedFrame;
