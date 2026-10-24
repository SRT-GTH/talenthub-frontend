import { classNames } from '../../../../utils/classNames.js';

/*
 * Sparkline — Figma "T8 · Sparkline" (instance 8487:346011 > 8485:37, 376x48): a 2px #387440 line over a SOLID #387440 area
 * (the Figma area fill is opaque #387440, alpha 1), ending in an 8px
 * #2a5730 dot with a 2px white ring. Custom SVG, no chart library.
 * Props
 *   values     number[]   the series, oldest first (>= 2 points). Counts are never printed by this component; if the points are
 *                         talent counts the caller is responsible for the <5 rule (a series is shown only as a shape).
 *   height     number     px, default 48 (Figma). Width is fluid (100% of the parent, Figma 376 on the desktop hero, 824 on tablet).
 *   label      string     accessible description, e.g. "Registrations over the last 90 days, rising". Omit for aria-hidden decoration.
 *   className
 * Geometry: the line uses 36px of the 48px box (y from 6 to 42), like the Figma vector; the area closes at the bottom edge.
 */

const TOP = 6;
const BOTTOM_LINE = 42;

const Sparkline = ({ values, height = 48, label, className }) => {
  if (!Array.isArray(values) || values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const W = 376;
  const step = W / (values.length - 1);
  const pts = values.map((v, i) => [
    +(i * step).toFixed(2),
    +(BOTTOM_LINE - ((v - min) / span) * (BOTTOM_LINE - TOP)).toFixed(2),
  ]);
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join('');
  const area = `${line}V${height}H0Z`;
  const last = pts[pts.length - 1];
  return (
    <div
      className={classNames('relative w-full', className)}
      style={{ height: `${height}px` }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
    >
      <svg
        viewBox={`0 0 ${W} ${height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 block size-full overflow-visible"
        focusable="false"
        aria-hidden="true"
      >
        <path d={area} fill="#387440" />
        <path
          d={line}
          fill="none"
          stroke="#387440"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span
        aria-hidden="true"
        className="absolute box-content rounded-full border-2 border-solid border-white bg-[#2a5730]"
        style={{
          left: '100%',
          top: `${(last[1] / height) * 100}%`,
          transform: 'translate(-50%, -50%)',
          width: '4px',
          height: '4px',
        }}
      />
    </div>
  );
};

export default Sparkline;
