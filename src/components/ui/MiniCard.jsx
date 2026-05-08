import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('MiniCard');

/*
 * MiniCard — horizontal step / task card.
 * Source: Figma frame 3384:76788 ("mini cards"). Variants:
 *   3176:29339 default (grey border + grey shelf)
 *   3176:29407 selected (brand-green border + 3px green shelf)
 *
 * Use case: an onboarding step list, a checklist of profile-completion
 * tasks, a queue of opportunities — anywhere the user sees a row of
 * compact cards each carrying icon + heading + status + description +
 * meta tags + a forward action.
 *
 * Layout (Figma exact):
 *   bg-white rounded-md, px-[17px] py-[15px], flex justify-between
 *   ├─ icon block (40×40 rounded-md, brand-green-light bg) + content stack
 *   │     ├─ heading row: heading text + optional status badge (success-green)
 *   │     ├─ description (small grey)
 *   │     └─ tags row (ReactNode)
 *   └─ action button (33×28 rounded-sm, brand-green-light-active border, dropdown shadow)
 *
 * Selection state flips the outer border + shelf shadow to brand-green
 * (similar treatment to Card, but a 3px shelf rather than 6px since the
 * card is much shorter).
 *
 * Renders as a `<div>` by default — there's no built-in clickability for
 * the whole card. The action button is a separate `<button>`. To make the
 * whole row clickable, wrap MiniCard in a `<button>` or `<a>` at the
 * consumer level.
 */

const ChevronRight = ({ className }) => (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
    <path
      d="m4 2 4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const STATE_CLASSES = {
  default: 'bg-white border border-[#e8e8e4] shadow-[0_4px_0_rgba(0,0,0,0.07)]',
  selected: 'bg-white border border-brand-green-light-active shadow-[0_3px_0_rgba(34,70,38,0.4)]',
};

const MiniCard = ({
  icon,
  heading,
  status,
  description,
  tags,
  selected = false,
  onAction,
  actionLabel = 'Continue',
  actionIcon,
  state,
  className,
  ...rest
}) => {
  log('render', { heading, selected, state, hasAction: Boolean(onAction) });

  const resolvedState = state || (selected ? 'selected' : 'default');
  const stateClasses = STATE_CLASSES[resolvedState];

  return (
    <div
      className={classNames(
        'flex items-center justify-between gap-4 rounded-md px-[17px] py-[15px] w-full',
        'transition-[border-color,box-shadow] duration-150 ease-out',
        stateClasses,
        className
      )}
      {...rest}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        {icon !== undefined && (
          <span
            className="inline-flex items-center justify-center shrink-0 size-10 rounded-md bg-brand-green-light text-brand-green"
            aria-hidden="true"
          >
            {/* Inner sizer keeps the icon at 21×21 (Figma exact) regardless
              of the SVG's intrinsic dimensions. Icons render `width="100%"`
              so they fill this inner span. */}
            <span className="block size-[21px]">{icon}</span>
          </span>
        )}
        <div className="flex flex-col gap-1 items-start min-w-0 flex-1">
          {(heading || status) && (
            <div className="flex items-center gap-1.5 min-w-0">
              {heading && (
                <span className="font-sans font-medium text-[14px] leading-6 tracking-[0.2px] text-content-primary truncate">
                  {heading}
                </span>
              )}
              {status && (
                <span className="font-sans font-semibold text-[10px] leading-4 tracking-[0.2px] text-success">
                  {status}
                </span>
              )}
            </div>
          )}
          {description && (
            <span className="font-sans text-[10px] leading-4 tracking-[0.2px] text-neutral-dark-active">
              {description}
            </span>
          )}
          {tags && <div className="flex flex-wrap items-center gap-1 mt-0.5">{tags}</div>}
        </div>
      </div>
      {onAction !== undefined && (
        <button
          type="button"
          aria-label={actionLabel}
          onClick={onAction}
          className={classNames(
            'inline-flex items-center justify-center shrink-0 w-[33px] h-7 rounded-sm',
            'bg-white border border-brand-green-light-active text-content-primary',
            'shadow-bottom-300 cursor-pointer',
            'hover:bg-brand-green-light hover:border-brand-green',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green'
          )}
        >
          {actionIcon || <ChevronRight className="size-3" />}
        </button>
      )}
    </div>
  );
};

export default MiniCard;
