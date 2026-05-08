import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('Loader');

/*
 * Loader — design-system spinner.
 * Source: Figma frame 2168:24062 ("Loaders"). The Figma uses a layered
 * raster + repeated keyframe symbols to produce a single dot orbiting a
 * circle. We reproduce the same visual intent with pure CSS — a brand-green
 * circular arc that rotates continuously. No assets, no animation libs.
 *
 * Sizes mirror Figma's two reference sizes (.base 32×32, Loader 60×60) and
 * extrapolate one larger. `lg` is for empty-state pages where the spinner
 * carries the whole composition.
 *
 *   sm — 32×32  (inline w/ text, e.g. button loading state)
 *   md — 60×60  (default — Figma's primary spinner size)
 *   lg — 96×96  (full-page loading state)
 *
 * Stroke-width is proportional to size (~10% of diameter) so the arc reads
 * the same at every scale.
 *
 * A11y: renders `role="status"` with a visually-hidden label so screen
 * readers announce loading. The visible SVG is `aria-hidden`.
 */

const SIZE_PRESETS = {
  sm: { diameter: 32, stroke: 3 },
  md: { diameter: 60, stroke: 5 },
  lg: { diameter: 96, stroke: 8 },
};

const Loader = ({ size = 'md', label = 'Loading…', className, ...rest }) => {
  log('render', { size, label });

  const preset = SIZE_PRESETS[size] || SIZE_PRESETS.md;
  const { diameter, stroke } = preset;
  const radius = (diameter - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  // 75% arc visible — leaves a 25% gap that visually "leads" the spin.
  const visible = circumference * 0.75;
  const gap = circumference - visible;

  return (
    <span
      role="status"
      aria-live="polite"
      className={classNames('inline-flex items-center justify-center', className)}
      {...rest}
    >
      <svg
        className="animate-spin"
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
        aria-hidden="true"
      >
        {/* Track ring (faint background circle) */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke="var(--color-brand-green-light)"
          strokeWidth={stroke}
          fill="none"
        />
        {/* Animated arc (75% of circumference) */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke="var(--color-brand-green)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${visible} ${gap}`}
        />
      </svg>
      {/* Visually hidden — screen-reader announcement only. */}
      <span className="sr-only">{label}</span>
    </span>
  );
};

export default Loader;
