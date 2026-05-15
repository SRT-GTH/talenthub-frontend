import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('ProgressRing');

/*
 * ProgressRing — circular percentage badge.
 * Source: Figma frame 3384:81972 (inside the "Where you stand" panel).
 * Renders an SVG ring with a brand-green stroke filled clockwise by `value`,
 * with the integer percentage centered in the ring face.
 *
 * Use case: at-a-glance profile completion in the engagement standing panel.
 *
 * Sizing: defaults to 52×52 (Figma) but accepts any `size` in px. Stroke
 * thickness scales with size to stay visually balanced.
 */

const ProgressRing = ({
  value = 0,
  max = 100,
  size = 52,
  trackColor = 'var(--color-brand-green-light)',
  fillColor = 'var(--color-brand-green)',
  label,
  className,
}) => {
  const clamped = Math.max(0, Math.min(max, value));
  const pct = (clamped / max) * 100;
  const strokeWidth = Math.max(3, Math.round(size * 0.09));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct / 100);

  log('render', { value, max, size, pct });

  return (
    <div
      role="img"
      aria-label={label || `${Math.round(pct)} percent`}
      className={classNames('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={fillColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 400ms ease-out' }}
        />
      </svg>
      <span className="relative font-sans font-semibold text-[16px] leading-6 text-brand-green-dark tracking-[0.1px]">
        {Math.round(pct)}%
      </span>
    </div>
  );
};

export default ProgressRing;
