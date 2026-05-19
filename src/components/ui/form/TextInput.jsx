import { useId } from 'react';
import Field from './Field.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('TextInput');

/*
 * TextInput — design-system text input.
 * Source: Figma frame 50:6914. State variants pulled from symbols:
 *   2278:7339 default, 2278:7337 active/focus, 2282:8880 filled,
 *   2278:7341 verified, 2278:7340 error, 2278:7338 disabled.
 *
 * Hybrid pattern: by default this renders a built-in Field wrapper around
 * the input (label / required / optional / helperText / error all accepted
 * as props). For non-text controls, import Field directly and compose.
 *
 * State derivation (priority: highest first):
 *   forced `state` prop  →  `disabled`  →  `error`  →  `verified`  →  interactive
 *
 * In normal use the `state` prop is omitted — focus is driven automatically
 * via the wrapper's `:focus-within` pseudo-class. The `state` prop is for
 * the design-system showcase where every state must be visible at rest.
 */

// Per-state classes for the input box (the "GTHInput" 51px container).
// Values mirror Figma exactly. Shadows are 2.5px shelves (lighter than the
// 4px button shelf — inputs are subtler).
const STATE_CLASSES = {
  default: 'bg-white border border-[#cccccc] shadow-[0_2.5px_0_0_rgba(191,191,191,0.8)]',
  focus:
    'bg-yellow-light border-2 border-brand-green-light-active shadow-[0_2.5px_0_0_rgba(34,70,38,0.8)]',
  verified:
    'bg-white border-[1.5px] border-brand-green-light-active shadow-[0_2.5px_0_0_rgba(34,70,38,0.8)]',
  // On error, placeholder text flips to danger red (`#C0392B`) per Figma
  // frames 07-error-a / 08-error-b — the unfilled error cells render their
  // placeholders in red. The filled-value color stays `#111` (covered by
  // INPUT_BASE).
  error:
    'bg-white border-[1.5px] border-danger-light-active shadow-[0_2.5px_0_0_rgba(146,43,33,0.8)] ' +
    '[&_input]:placeholder:text-danger',
  disabled: 'bg-brand-green-light border-2 border-[#cccccc] opacity-55 shadow-none',
};

// When no forced state applies, the wrapper sits at default + reacts to focus
// via :focus-within. (Tailwind v4 JIT requires literal class names, no runtime
// concatenation of `focus-within:` prefixes.)
const INTERACTIVE_CLASSES =
  'bg-white border border-[#cccccc] shadow-[0_2.5px_0_0_rgba(191,191,191,0.8)] ' +
  'focus-within:bg-yellow-light focus-within:border-brand-green-light-active ' +
  'focus-within:shadow-[0_2.5px_0_0_rgba(34,70,38,0.8)]';

const WRAPPER_BASE =
  'flex h-[51px] items-center gap-2 pl-[20px] pr-[16px] py-[13px] rounded-md w-full ' +
  'transition-colors duration-100';

// Filled-value typography mirrors Figma node 2353:14649 — SF Pro Rounded
// Medium 14/24, color #111. Placeholder stays 400 / #595959 via the
// `placeholder:` modifiers so the empty state is unchanged.
const INPUT_BASE =
  'flex-1 min-w-0 bg-transparent outline-none border-none ' +
  'font-sans font-medium text-[14px] leading-[24px] tracking-[0.2px] ' +
  'text-[#111111] ' +
  'placeholder:text-[#595959] placeholder:font-normal ' +
  'disabled:cursor-not-allowed';

const TextInput = ({
  label,
  required,
  optional,
  helperText,
  successText,
  error,
  state,
  verified = false,
  disabled = false,
  leftIcon,
  // Optional override for the leading-icon color wrapper. Defaults to
  // `text-content-tertiary` (the legacy neutral). The Contact step's
  // Email field flips this to `text-brand-green` once the user has
  // typed a value, and to `text-success` in the "Verrifed input" state.
  leftIconClassName,
  rightIcon,
  labelTrailing,
  labelTrailingClassName,
  // Helper-row slots forwarded straight to Field — see Field.jsx.
  helperIcon,
  helperIconClassName,
  helperTextClassName,
  type = 'text',
  id,
  className,
  ref,
  ...inputProps
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  log('render', { label, state, verified, disabled, hasError: Boolean(error) });

  // Resolve which visual state applies. Highest-priority wins; null means
  // "no override — let :focus-within drive it interactively".
  const resolvedState =
    state ||
    (disabled ? 'disabled' : null) ||
    (error ? 'error' : null) ||
    (verified ? 'verified' : null);

  const wrapperStateClasses = resolvedState ? STATE_CLASSES[resolvedState] : INTERACTIVE_CLASSES;

  const isHtmlDisabled = disabled || state === 'disabled';

  return (
    <Field
      label={label}
      htmlFor={inputId}
      required={required}
      optional={optional}
      helperText={helperText}
      successText={successText}
      error={error}
      labelTrailing={labelTrailing}
      labelTrailingClassName={labelTrailingClassName}
      helperIcon={helperIcon}
      helperIconClassName={helperIconClassName}
      helperTextClassName={helperTextClassName}
      className={className}
    >
      <div className={classNames(WRAPPER_BASE, wrapperStateClasses)}>
        {leftIcon && (
          <span
            className={classNames(
              'inline-flex shrink-0 size-4',
              leftIconClassName ?? 'text-content-tertiary'
            )}
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={isHtmlDisabled}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error || helperText ? `${inputId}-msg` : undefined}
          className={INPUT_BASE}
          {...inputProps}
        />
        {rightIcon && (
          <span className="inline-flex shrink-0 size-5 text-content-tertiary" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>
    </Field>
  );
};

export default TextInput;
