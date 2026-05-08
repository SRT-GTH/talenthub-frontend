import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('Card');

/*
 * Card — design-system selection card.
 * Source: Figma frame 50:8153 ("Cards" → "Select student cards"). Internal
 * symbols 2153:11577 (default), 2153:11576 (hover), 2153:11575 (active /
 * selected).
 *
 * Use case: a clickable card the user picks between two or three options
 * (e.g. "I'm a Student/Graduate" vs "I'm an Employer"). Renders as a
 * `<button>` so it's keyboard-accessible by default.
 *
 * Visual signature: same shelf-shadow language as Button — at rest a subtle
 * elevation shadow; on hover the card lifts onto a 6px grey shelf; when
 * `selected` it pins to a 6px brand-green shelf with a 1.5px green border,
 * and the icon block / tag / headline pick up brand-green accents.
 *
 * Layout (Figma exact):
 *   297×267 box, rounded-16, pl-24 pr-16 py-20, flex-col gap-16
 *   ├─ icon block (62×62 rounded-10, bg neutral / brand-green-light)
 *   └─ content stack (flex-col gap-12)
 *      ├─ tag pill (px-6 py-4 rounded-5)
 *      ├─ headline (Instrument Serif 22px)
 *      └─ description (SF Pro Rounded 14/20)
 *
 * The box-size is fixed in Figma but Card here lets you override via
 * className — typical real usage drops the fixed width and lets a parent
 * grid distribute. The 267px height is preserved by default for visual
 * parity with Figma.
 */

const STATE_CLASSES = {
  default:
    'bg-yellow-light border-2 border-[#e6e6e6] ' +
    'shadow-[0_2px_2px_-1px_rgba(27,36,44,0.04),0_2px_8px_-1px_rgba(27,36,44,0.08)]',
  hover: 'bg-yellow-light border-2 border-[#cccccc] shadow-[0_6px_0_0_rgba(204,204,204,0.8)]',
  selected: 'bg-white border-[1.5px] border-brand-green shadow-[0_6px_0_0_rgba(34,70,38,0.8)]',
  disabled:
    'bg-yellow-light border-2 border-[#e6e6e6] opacity-55 ' +
    'shadow-[0_2px_2px_-1px_rgba(27,36,44,0.04),0_2px_8px_-1px_rgba(27,36,44,0.08)]',
};

// Interactive bundle (no forced state, not selected, not disabled):
// default visual + hover-lift + disabled fallback.
const INTERACTIVE_CLASSES =
  STATE_CLASSES.default +
  ' ' +
  'hover:border-[#cccccc] hover:shadow-[0_6px_0_0_rgba(204,204,204,0.8)] ' +
  'disabled:opacity-55 disabled:hover:border-[#e6e6e6] ' +
  'disabled:hover:shadow-[0_2px_2px_-1px_rgba(27,36,44,0.04),0_2px_8px_-1px_rgba(27,36,44,0.08)]';

const BASE_CLASSES =
  'flex flex-col gap-4 items-start text-left ' +
  'pl-6 pr-4 py-5 rounded-2xl w-full h-[267px] overflow-clip ' +
  'transition-[border-color,box-shadow,background-color] duration-150 ease-out ' +
  'cursor-pointer disabled:cursor-not-allowed ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';

const Card = ({
  selected = false,
  disabled = false,
  state,
  onClick,
  icon,
  tag,
  headline,
  description,
  className,
  children,
  type = 'button',
  ref,
  ...rest
}) => {
  log('render', { selected, disabled, state, headline });

  // Resolve which visual to render. Forced state always wins.
  const isForced = Boolean(state);
  const resolvedState = isForced ? state : disabled ? 'disabled' : selected ? 'selected' : null; // null → interactive (hover via CSS)

  const isSelectedLook = resolvedState === 'selected';

  let stateClasses;
  if (resolvedState) {
    stateClasses = STATE_CLASSES[resolvedState];
  } else {
    stateClasses = INTERACTIVE_CLASSES;
  }

  // When the card looks selected, sub-elements pick up brand-green accents.
  const iconBlockClasses = isSelectedLook ? 'bg-brand-green-light' : 'bg-[#f8f8f4]';

  const tagClasses = isSelectedLook
    ? 'bg-brand-green-light border border-brand-green text-brand-green'
    : 'bg-yellow-light-active border border-[#b5b5b5] text-neutral-darker';

  const headlineClasses = isSelectedLook ? 'text-brand-green' : 'text-content-primary';

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      aria-pressed={selected || resolvedState === 'selected'}
      disabled={disabled || resolvedState === 'disabled'}
      className={classNames(BASE_CLASSES, stateClasses, className)}
      {...rest}
    >
      {/* If the consumer wants full layout control, pass children — they
        win. Otherwise we render the documented structured layout. */}
      {children ? (
        children
      ) : (
        <>
          {icon !== undefined && (
            <span
              className={classNames(
                'inline-flex items-center justify-center rounded-md size-[62px] shrink-0',
                iconBlockClasses
              )}
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          <div className="flex flex-col gap-3 items-start w-full">
            {(tag || headline) && (
              <div className="flex flex-col gap-2 items-start">
                {tag && (
                  <span
                    className={classNames(
                      'inline-flex items-center justify-center px-1.5 py-1 rounded-[5px]',
                      'font-sans font-medium text-[10px] leading-4 tracking-[0.2px] uppercase',
                      tagClasses
                    )}
                  >
                    {tag}
                  </span>
                )}
                {headline && (
                  <p
                    className={classNames(
                      'font-display text-[22px] leading-[1.1]',
                      headlineClasses
                    )}
                  >
                    {headline}
                  </p>
                )}
              </div>
            )}
            {description && (
              <p className="font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#737373]">
                {description}
              </p>
            )}
          </div>
        </>
      )}
    </button>
  );
};

export default Card;
