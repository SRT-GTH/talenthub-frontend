import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('WatchTutorial');

/*
 * WatchTutorial — floating "watch a tutorial" widget.
 * Source: Figma frame 2255:1597 ("Watch tutorial component"). Variants:
 *   2255:1604 default (button only — no label, slightly transparent)
 *   2255:1639 expanded (label "Watch Tutorial" + circular play button)
 *   2255:1658 alt (label hidden, full-opacity button)
 *
 * Use case: a fixed-position helper that nudges the user to watch the
 * onboarding tutorial. The button itself is the same shelf-shadow Button
 * DNA — 72px circular brand-green pill with a 4px dark-green shelf below.
 *
 * API: pass `label` to render the cream pill on the left; omit for the
 * button-only variant. `onClick` fires on press. Internally renders as a
 * single `<button>` so the entire widget is one tappable target.
 */

// 20-play-circle — pulled directly from Figma node 41:1185.
const PlayCircleIcon = ({ className }) => (
  <svg viewBox="0 0 21.6 21.6" fill="none" aria-hidden="true" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.8 1.8C5.82944 1.8 1.8 5.82944 1.8 10.8C1.8 15.7706 5.82944 19.8 10.8 19.8C15.7706 19.8 19.8 15.7706 19.8 10.8C19.8 5.82944 15.7706 1.8 10.8 1.8ZM0 10.8C0 4.83532 4.83532 0 10.8 0C16.7647 0 21.6 4.83532 21.6 10.8C21.6 16.7647 16.7647 21.6 10.8 21.6C4.83532 21.6 0 16.7647 0 10.8ZM8.89027 6.09867C9.19119 5.94481 9.55295 5.97251 9.82694 6.17039L15.2269 10.0704C15.4612 10.2396 15.6 10.511 15.6 10.8C15.6 11.089 15.4612 11.3604 15.2269 11.5296L9.82694 15.4296C9.55295 15.6275 9.19119 15.6552 8.89027 15.5013C8.58935 15.3475 8.4 15.038 8.4 14.7V6.9C8.4 6.56202 8.58935 6.25254 8.89027 6.09867ZM10.2 8.66018V12.9398L13.1628 10.8L10.2 8.66018Z"
      fill="currentColor"
    />
  </svg>
);

const WatchTutorial = ({
  label = 'Watch Tutorial',
  showLabel = true,
  onClick,
  className,
  ...rest
}) => {
  log('render', { label, showLabel });

  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'inline-flex items-center cursor-pointer',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green focus-visible:rounded-pill',
        className
      )}
      {...rest}
    >
      {showLabel && label && (
        <span
          className={classNames(
            // Pill on the left — overlaps the circular button by 13px so they
            // visually fuse into one widget (Figma's mr-[-13px] trick).
            'inline-flex items-center justify-center px-5 py-3 -mr-3 rounded-md',
            'bg-brand-green-light border border-[rgba(0,0,0,0.06)]',
            'shadow-[0_8px_16px_rgba(0,0,0,0.1),0_2px_0_rgba(0,0,0,0.05)]',
            'font-sans font-semibold text-[14px] leading-6 tracking-[0.1px] text-brand-green',
            'whitespace-nowrap'
          )}
        >
          {label}
        </span>
      )}
      <span
        className={classNames(
          // Circular brand-green play button — same shelf DNA as Button.
          'relative inline-flex items-center justify-center shrink-0 size-[72px] rounded-pill',
          'bg-[#EBF1EC]/30 hover:bg-[#EBF1EC]/60 active:bg-[#EBF1EC]/100 ',
          'text-brand-green-light',
          'transition-transform duration-100',
          'hover:translate-y-0',
          'active:translate-y-1 active:shadow-none'
        )}
      >
        <PlayCircleIcon className="size-6" />
      </span>
    </button>
  );
};

export default WatchTutorial;
