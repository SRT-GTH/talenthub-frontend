import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('Tag');

/*
 * Tag — small status indicator.
 * Two visual variants reflect the two distinct shapes used in Figma:
 *
 *   pill (default) — Source: Figma frame 3167:29034 ("Tags"), symbol 3167:22477.
 *     Rounded-pill (100px) bordered chip with a soft 1.5px shadow.
 *     Used standalone for status callouts ("11% Completed", "Verified").
 *     Default visual: white bg, green-light-hover border, brand-green text.
 *
 *   chip — Source: meta-tags inside MiniCard (Figma 3179:29793 brand-green
 *     chip and 3179:29795 neutral chip). Flat 4px corners, denser padding,
 *     semibold weight, slightly different colour palette (brand-green-light
 *     bg with brand-green-DARK text vs the pill's white bg + brand-green
 *     text). No shadow. Used inside cards / mini-cards as compact meta
 *     indicators ("Avatar set", "~3 min", "Required").
 *
 * Both variants accept the same five `color` values; the variant flips
 * the bg / border / text colours within each colour family. Children are
 * ReactNode so consumers can embed structured content (e.g. a bold leading
 * value followed by a muted label inside a pill).
 *
 * Sizes (`pill` only): `md` matches Figma (px-12 py-8). `sm` is denser for
 * inline-with-text use. Chip variant is fixed-density (px-8 py-3px) — its
 * raison d'être is compactness, so a size knob would just produce a worse
 * pill.
 */

// Pill variant — rounded-full, medium weight, soft shadow.
// Default look mirrors Figma 3167:22477 exactly.
const PILL_COLOR_CLASSES = {
  brand: 'bg-white border-brand-green-light-hover text-brand-green',
  success: 'bg-success-light border-success-light-active text-success',
  warning: 'bg-accent-light border-accent-light-active text-accent-dark',
  danger: 'bg-danger-light border-danger-light-active text-danger',
  neutral: 'bg-neutral border-[#dfdfdc] text-neutral-darker',
};

// Chip variant — flat-cornered, semibold, no shadow.
// Brand + neutral mirror Figma 3179:29793 / 3179:29795 exactly.
const CHIP_COLOR_CLASSES = {
  brand: 'bg-brand-green-light border-brand-green-light-active text-brand-green-dark',
  success: 'bg-success-light border-success-light-active text-success-dark',
  warning: 'bg-accent-light border-accent-light-active text-accent-dark',
  danger: 'bg-danger-light border-danger-light-active text-danger-dark',
  neutral: 'bg-neutral border-[#dfdfdc] text-neutral-darker',
};

const PILL_SIZE_CLASSES = {
  sm: 'px-2 py-0.5 text-[10px] leading-4',
  md: 'px-3 py-1 text-[10px] leading-4',
};

const PILL_BASE =
  'inline-flex items-center justify-center gap-1 rounded-pill border ' +
  'font-sans font-medium tracking-[0.1px] ' +
  'shadow-[0_1px_1.5px_rgba(0,0,0,0.06)] ' +
  'whitespace-nowrap';

const CHIP_BASE =
  'inline-flex items-center justify-center gap-1 rounded-[4px] border ' +
  'px-2 py-[3px] ' +
  'font-sans font-semibold text-[10px] leading-4 tracking-[0.2px] ' +
  'whitespace-nowrap';

const Tag = ({ variant = 'pill', color = 'brand', size = 'md', className, children, ...rest }) => {
  log('render', { variant, color, size });

  const isChip = variant === 'chip';
  const colorClasses =
    (isChip ? CHIP_COLOR_CLASSES : PILL_COLOR_CLASSES)[color] || PILL_COLOR_CLASSES.brand;
  const baseClasses = isChip ? CHIP_BASE : PILL_BASE;
  const sizeClasses = isChip ? '' : PILL_SIZE_CLASSES[size] || PILL_SIZE_CLASSES.md;

  return (
    <span className={classNames(baseClasses, colorClasses, sizeClasses, className)} {...rest}>
      {children}
    </span>
  );
};

export default Tag;
