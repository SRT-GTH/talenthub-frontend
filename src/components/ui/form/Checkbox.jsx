import { useId } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('Checkbox');

/*
 * Checkbox — design-system checkbox.
 * Source: Figma frame 2019:13564 ("Check Box"). Variants pulled from symbols:
 *   2019:14112 default, 2019:14111 active (= checked).
 *
 * The visual is a 20×20 rounded-6 box with the same "shelf" DNA as Button:
 * a 2px grey shelf at rest collapses to a 1.2px green shelf when checked, so
 * the checkbox "presses down" on click. Tick mark is rendered as inline SVG
 * (no asset dependency).
 *
 * Layout: an inline `<label>` wraps the visual box and the label text on a
 * single row; the visually-hidden native `<input type="checkbox">` lives
 * inside so keyboard / a11y / form-integration is identical to a regular
 * checkbox. Field is NOT used here — checkboxes don't need a separate label
 * row above the control. Helper / error text renders below in the same
 * alert-icon style as Field.
 *
 * State derivation priority (highest first):
 *   forced `state` prop  →  `disabled`  →  `error`  →  `checked`  →  default
 *
 * Real usage omits `state`; the visual derives from the actual `checked`
 * boolean. The `state` prop is showcase-only so each variant can be pinned
 * for documentation.
 */

const TickIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path
      d="M5 12.5l4.5 4.5L19 7"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AlertIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
    <path d="M8 4.5v4.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="8" cy="11.4" r="0.85" fill="currentColor" />
  </svg>
);

// Per-state classes for the visual box.
// Matches Figma exactly — the 2px → 1.2px shelf collapse is the press-down
// animation. Tailwind v4 JIT requires literal classes (no concatenation).
const BOX_STATE_CLASSES = {
  default: 'bg-white border-[1.5px] border-[#cccccc] shadow-[0_2px_0_0_rgba(204,204,204,1)]',
  checked:
    'bg-brand-green border-[1.5px] border-brand-green-dark-active shadow-[0_1.2px_0_0_rgba(25,52,29,1)]',
  error:
    'bg-white border-[1.5px] border-danger-light-active shadow-[0_2px_0_0_rgba(146,43,33,0.8)]',
  'error-checked':
    'bg-danger border-[1.5px] border-danger-dark shadow-[0_1.2px_0_0_rgba(86,26,19,1)]',
  disabled: 'bg-white border-[1.5px] border-[#cccccc] shadow-none opacity-55',
  'disabled-checked':
    'bg-brand-green border-[1.5px] border-brand-green-dark-active shadow-none opacity-55',
};

const BOX_BASE =
  'relative inline-flex shrink-0 items-center justify-center size-5 rounded-[6px] ' +
  'transition-[background-color,border-color,box-shadow,transform] duration-100';

const Checkbox = ({
  label,
  required = false,
  helperText,
  error,
  state,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  id,
  name,
  className,
  ref,
  ...inputProps
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const messageId = `${inputId}-msg`;

  log('render', { label: typeof label, state, checked, disabled, hasError: Boolean(error) });

  const isControlled = checked !== undefined;

  // Resolve which visual variant to paint. `state` always wins so the
  // showcase can pin any variant; in real usage we derive from the props.
  let resolvedKey;
  if (state) {
    resolvedKey = state;
  } else if (disabled) {
    resolvedKey = isControlled ? (checked ? 'disabled-checked' : 'disabled') : 'disabled';
  } else if (error) {
    // For error, both checked and unchecked use the red treatment. We pick
    // a slightly different shade when checked so the tick remains visible.
    resolvedKey = isControlled && checked ? 'error-checked' : 'error';
  } else if (isControlled ? checked : defaultChecked) {
    resolvedKey = 'checked';
  } else {
    resolvedKey = 'default';
  }

  // Whether the visual currently shows a tick. Derived from the resolved
  // visual variant so `state="checked"` paints the tick for showcase pins.
  const showTick =
    resolvedKey === 'checked' ||
    resolvedKey === 'error-checked' ||
    resolvedKey === 'disabled-checked';

  // For interactive (non-forced) usage the input drives the box visual via
  // its own state — no extra hover/focus class needed because the shadow
  // collapse already happens automatically when `checked` flips.
  const boxClasses = BOX_STATE_CLASSES[resolvedKey] || BOX_STATE_CLASSES.default;

  const message = error || helperText;
  const messageColourClass = error ? 'text-danger' : 'text-neutral-darker';

  const handleChange = (e) => {
    log('change:', e.target.checked);
    onChange?.(e);
  };

  return (
    <div className={classNames('flex flex-col gap-2', className)}>
      <label
        htmlFor={inputId}
        className={classNames(
          'inline-flex items-start gap-3 select-none',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        )}
      >
        <input
          ref={ref}
          id={inputId}
          name={name}
          type="checkbox"
          checked={isControlled ? checked : undefined}
          defaultChecked={!isControlled ? defaultChecked : undefined}
          disabled={disabled || state === 'disabled' || state === 'disabled-checked'}
          onChange={handleChange}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={message ? messageId : undefined}
          className="sr-only peer"
          {...inputProps}
        />
        {/*
         * Visual proxy. The native input is visually hidden but receives
         * focus / clicks via the wrapping <label>. The peer:focus-visible
         * ring keeps keyboard navigation visible.
         */}
        <span
          aria-hidden="true"
          className={classNames(
            BOX_BASE,
            boxClasses,
            'peer-focus-visible:ring-2 peer-focus-visible:ring-brand-green-light-active peer-focus-visible:ring-offset-2',
            // Keep the box vertically aligned with the first line of label
            // text (which is 20px tall — see <span> below) without offsets.
            'mt-px'
          )}
        >
          {showTick && <TickIcon className="size-[14px] text-white" />}
        </span>
        {label !== undefined && (
          <span className="font-sans text-[14px] leading-[20px] tracking-[0.2px] text-content-primary">
            {label}
            {required && (
              <span
                className="font-semibold text-brand-green text-[14px] leading-[20px] ml-px"
                aria-hidden="true"
              >
                *
              </span>
            )}
          </span>
        )}
      </label>
      {message && (
        <div
          id={messageId}
          className={classNames('flex items-center gap-2 px-2', messageColourClass)}
          role={error ? 'alert' : undefined}
        >
          <AlertIcon className="size-4 shrink-0" />
          <p className="font-sans text-[12px] leading-[18px] tracking-[0.2px]">{message}</p>
        </div>
      )}
    </div>
  );
};

export default Checkbox;
