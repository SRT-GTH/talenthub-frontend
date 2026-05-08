import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('ProgressBar');

/*
 * ProgressBar — horizontal progress indicator.
 * Source: Figma frame 2282:23906 ("Progressive bars"). Variants:
 *   2282:23891 default (~16% fill, 6px track, rounded-2)
 *   2282:23893 variant2 (~57% fill, rounded-6 fill on rounded-2 track)
 *   2282:23897 variant4 (~83% fill, same as v2)
 *   2282:23895 variant3 (100% fill, rounded-6 track)
 *
 * The Figma variants all share the same brand-green fill (#387440) on a
 * brand-green-light track (#ebf1ec). Only the fill width differs across
 * variants, so we collapse them into a single component driven by `value`
 * (0–100). Track size defaults to 6px (Figma's primary); pass `size="sm"`
 * for a thinner 4px bar (used inside Upload's loading state).
 *
 * `indeterminate` runs an infinite shimmer for unknown durations (think:
 * "loading data of unknown size"). Otherwise the bar is determinate and
 * announces progress via ARIA.
 */

const SIZE_CLASSES = {
  sm: 'h-1',
  md: 'h-1.5',
};

const ProgressBar = ({
  value,
  max = 100,
  size = 'md',
  indeterminate = false,
  label,
  className,
  ...rest
}) => {
  const pct = indeterminate ? null : Math.max(0, Math.min(100, ((value ?? 0) / max) * 100));

  log('render', { value, max, size, indeterminate, pct });

  return (
    <div
      role="progressbar"
      aria-valuemin={indeterminate ? undefined : 0}
      aria-valuemax={indeterminate ? undefined : max}
      aria-valuenow={indeterminate ? undefined : value}
      aria-label={label}
      className={classNames(
        'relative w-full bg-brand-green-light rounded-pill overflow-hidden',
        SIZE_CLASSES[size] || SIZE_CLASSES.md,
        className
      )}
      {...rest}
    >
      {indeterminate ? (
        // Indeterminate fallback: full-width bar that pulses opacity.
        // Tailwind's built-in animate-pulse keeps this dependency-free.
        <div className="absolute inset-0 bg-brand-green rounded-pill animate-pulse opacity-70" />
      ) : (
        <div
          className="h-full bg-brand-green rounded-pill transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      )}
    </div>
  );
};

export default ProgressBar;
