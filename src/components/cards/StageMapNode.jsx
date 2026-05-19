import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('StageMapNode');

/*
 * StageMapNode — one circular badge node on the Identity Map.
 * Source: Figma frame (Section 1 · Your Identity map).
 *
 * Variants:
 *   stage-done     filled brand-green circle, white label, completed check
 *   stage-active   bigger filled brand-green circle (current step focus)
 *   stage-pending  white circle with thin border, dark label
 *   milestone      colored circle (yellow/amber for reward & trophy) with
 *                  the milestone image inside and the label below
 *
 * Stage variants render an order badge (small numbered pill, top-left)
 * and an optional inline icon. Milestone variants drop the order badge
 * and use a larger inline image.
 *
 * Renders as a button so the user can click into the stage screen.
 */

const CheckIcon = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M3 8l3.5 3.5L13 5" />
  </svg>
);

const VARIANT_CLASSES = {
  'stage-done': 'bg-brand-green text-white border-[3px] border-brand-green-dark shadow-bottom-300',
  'stage-active':
    'bg-brand-green text-white border-[3px] border-white ring-4 ring-brand-green/40 shadow-bottom-300',
  'stage-pending': 'bg-white text-content-primary border-2 border-white/80 shadow-bottom-200',
  milestone: 'bg-accent text-content-primary border-[3px] border-accent-dark shadow-bottom-300',
};

const StageMapNode = ({
  variant = 'stage-pending',
  label,
  order,
  icon,
  imageSrc,
  size = 88,
  onClick,
  className,
}) => {
  log('render', { variant, label, order });

  const isMilestone = variant === 'milestone';
  const isDone = variant === 'stage-done' || variant === 'stage-active';

  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'group relative inline-flex flex-col items-center justify-center rounded-full',
        'transition-transform duration-150 ease-out hover:scale-105 focus-visible:scale-105',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green',
        VARIANT_CLASSES[variant] || VARIANT_CLASSES['stage-pending'],
        className
      )}
      style={{ width: size, height: size }}
      aria-label={label}
    >
      {/* Order badge (top-left) — only for stages, not milestones */}
      {!isMilestone && order != null && (
        <span
          aria-hidden="true"
          className={classNames(
            'absolute -top-1 -left-1 inline-flex size-6 items-center justify-center rounded-full',
            'bg-accent text-content-primary font-sans font-semibold text-[12px] leading-none',
            'border-2 border-white shadow-bottom-100'
          )}
        >
          {order}
        </span>
      )}

      {/* Completed check (bottom-right) — only on stage-done */}
      {variant === 'stage-done' && (
        <span
          aria-hidden="true"
          className={classNames(
            'absolute -bottom-1 -right-1 inline-flex size-6 items-center justify-center rounded-full',
            'bg-white text-brand-green border-2 border-brand-green-dark shadow-bottom-100'
          )}
        >
          <CheckIcon className="size-3" />
        </span>
      )}

      {/* Body — image / icon + label */}
      <span className="flex flex-col items-center justify-center gap-1 px-2 pointer-events-none">
        {imageSrc ? (
          <img src={imageSrc} alt="" className="size-10 object-contain" />
        ) : (
          icon && <span className="inline-flex size-6">{icon}</span>
        )}
        {label && (
          <span
            className={classNames(
              'font-sans font-semibold tracking-[0.8px] uppercase text-center',
              isMilestone
                ? 'text-[10px] leading-3 text-content-primary'
                : isDone
                  ? 'text-[10px] leading-3 text-white'
                  : 'text-[10px] leading-3 text-content-primary'
            )}
          >
            {label}
          </span>
        )}
      </span>
    </button>
  );
};

export default StageMapNode;
