import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('EntryMethodCard');

/*
 * EntryMethodCard — one option in the "How would you like to add your details?"
 * modal. Source: Figma frame (Information Entry Category modal).
 *
 * Each card represents one way to add profile details: type manually,
 * chat with the AI buddy, or upload a CV. The `highlighted` variant
 * (used for the middle "Chat with Career Ai" option) draws a brand-green
 * border with a soft brand glow and optionally renders a "MOST POPULAR"
 * ribbon banner at the top.
 *
 * Layout (Figma exact):
 *   ├─ optional "MOST POPULAR" ribbon banner (when mostPopular=true)
 *   ├─ icon tile (48×48, rounded-md, neutral or green-tinted bg)
 *   ├─ duration chip (small uppercase pill)
 *   ├─ title (display, 22px)
 *   ├─ description (paragraph, 14px)
 *   └─ action row: label + arrow (separated from above with a thin divider)
 *
 * Renders as a `<button>` so it's keyboard-focusable.
 */

const ArrowRight = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M3 8h10" />
    <path d="M8.5 3.5L13 8l-4.5 4.5" />
  </svg>
);

const EntryMethodCard = ({
  icon,
  duration,
  title,
  description,
  actionLabel,
  highlighted = false,
  mostPopular = false,
  onClick,
  className,
}) => {
  log('render', { title, highlighted, mostPopular });

  return (
    <div className={classNames('relative', className)}>
      {mostPopular && (
        <span
          className={classNames(
            'absolute left-1/2 -top-3.5 -translate-x-1/2 z-10',
            'inline-flex items-center rounded-md bg-brand-green px-3 py-1',
            'font-sans font-semibold text-[11px] tracking-[0.6px] uppercase text-white',
            'shadow-bottom-100'
          )}
        >
          Most Popular
        </span>
      )}

      <button
        type="button"
        onClick={onClick}
        className={classNames(
          'group flex w-full flex-col items-start gap-4 text-left',
          'rounded-xl bg-white px-5 py-6 h-full',
          'transition-[border-color,box-shadow,transform] duration-150 ease-out',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
          highlighted
            ? 'border-[1.5px] border-brand-green shadow-[0_8px_24px_-6px_rgba(56,116,64,0.25),0_2px_4px_rgba(56,116,64,0.08)]'
            : 'border border-border-default shadow-bottom-200 hover:border-brand-green-light-active hover:shadow-bottom-300'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            'inline-flex size-12 items-center justify-center rounded-md',
            highlighted
              ? 'bg-brand-green-light text-brand-green'
              : 'bg-neutral text-content-primary'
          )}
        >
          {icon}
        </span>

        {duration && (
          <span
            className={classNames(
              'inline-flex items-center rounded-md border px-2 py-0.5',
              'font-sans font-semibold text-[10px] leading-4 tracking-[0.6px] uppercase',
              highlighted
                ? 'bg-brand-green-light border-brand-green-light-active text-brand-green-dark'
                : 'bg-neutral border-[#dfdfdc] text-neutral-darker'
            )}
          >
            {duration}
          </span>
        )}

        <h3 className="font-display text-[22px] leading-[1.15] text-content-primary">{title}</h3>

        <p className="font-sans text-[14px] leading-[20px] tracking-[0.2px] text-neutral-darker">
          {description}
        </p>

        <div className="mt-auto flex w-full items-center justify-between pt-4 border-t border-border-default">
          <span className="font-sans font-semibold text-[14px] leading-5 tracking-[0.2px] text-content-primary">
            {actionLabel}
          </span>
          <ArrowRight
            className={classNames(
              'size-4 transition-transform group-hover:translate-x-0.5',
              highlighted ? 'text-brand-green' : 'text-content-primary'
            )}
          />
        </div>
      </button>
    </div>
  );
};

export default EntryMethodCard;
