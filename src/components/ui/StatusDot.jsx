import { classNames } from '../../utils/classNames.js';

/*
 * StatusDot — small inline indicator dot.
 * Source: Figma frame 3384:81927, used in the engagement top-bar
 * step indicator ("• Step 1 of 9 · Avatar") and the footer status
 * ribbon ("• Auto-Saved · Everything is Reversible · Finish Later").
 *
 * Pure presentational chip — no children, no aria, purely decorative.
 */

const COLOR_CLASSES = {
  brand: 'bg-brand-green',
  neutral: 'bg-neutral-darker',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

const SIZE_CLASSES = {
  sm: 'size-1.5',
  md: 'size-2',
};

const StatusDot = ({ color = 'brand', size = 'sm', className, ...rest }) => (
  <span
    aria-hidden="true"
    className={classNames(
      'inline-block rounded-full',
      COLOR_CLASSES[color] || COLOR_CLASSES.brand,
      SIZE_CLASSES[size] || SIZE_CLASSES.sm,
      className
    )}
    {...rest}
  />
);

export default StatusDot;
