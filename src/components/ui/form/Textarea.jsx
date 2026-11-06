import { useId, useState } from 'react';
import Field from './Field.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('Textarea');

/*
 * Textarea — design-system multi-line input.
 * Source: Figma frame 2021:950 ("Text Area"). Visual variants pulled from:
 *   2022:1074 default / 2022:1118 active-filled.
 *
 * Hybrid pattern (same as TextInput / Select): accepts Field props directly.
 * Core differences from TextInput:
 *   - default height 100px (drag handle visible), `resize-y` so users can grow
 *   - active/filled bg is `#eef7f2` (slight green tint) instead of yellow-light
 *   - shelf shadow is 3px (deeper than TextInput's 2.5px) — matches VerificationCode
 *   - built-in character counter rendered below the textarea, right-aligned
 *
 * Counter colours (Figma description: "turns gold near the limit, red when over"):
 *   normal  — neutral-darker (#575755)
 *   warn    — accent (#c8951a) when length >= warnAt * maxLength
 *   (add-only) `counterSuffix` appends text to the counter (" · minimum 20"); `counterErrorTone` turns the counter red while `error` is set
 *   over    — danger (#c0392b) when length > maxLength
 *
 * State derivation priority (same as TextInput):
 *   forced `state` prop → `disabled` → `error` → `verified` → interactive (focus-within)
 */

const STATE_CLASSES = {
  default: 'bg-white border-2 border-[#cccccc] shadow-[0_3px_0_0_rgba(191,191,191,0.8)]',
  focus:
    'bg-[#eef7f2] border-2 border-brand-green-light-active shadow-[0_3px_0_0_rgba(34,70,38,0.8)]',
  verified:
    'bg-[#eef7f2] border-2 border-brand-green-light-active shadow-[0_3px_0_0_rgba(34,70,38,0.8)]',
  error: 'bg-white border-2 border-danger-light-active shadow-[0_3px_0_0_rgba(146,43,33,0.8)]',
  disabled: 'bg-brand-green-light border-2 border-[#cccccc] opacity-55 shadow-none',
};

// Interactive bundle (no forced state, not disabled, no error/verified):
// default visual + focus-within green visual.
const INTERACTIVE_CLASSES =
  'bg-white border-2 border-[#cccccc] shadow-[0_3px_0_0_rgba(191,191,191,0.8)] ' +
  'focus-within:bg-[#eef7f2] focus-within:border-brand-green-light-active ' +
  'focus-within:shadow-[0_3px_0_0_rgba(34,70,38,0.8)]';

const WRAPPER_BASE =
  'flex w-full rounded-md transition-colors duration-100 overflow-hidden max-md:shadow-none!';

const TEXTAREA_BASE =
  'flex-1 min-w-0 bg-transparent outline-none border-none resize-y ' +
  'pl-5 pr-4 py-[13px] max-md:pl-3 max-md:pr-3 max-md:py-2.5 ' +
  'font-sans text-[14px] leading-[20px] tracking-[0.2px] ' +
  'text-content-primary ' +
  'placeholder:text-[#595959] placeholder:font-normal ' +
  'disabled:cursor-not-allowed';

const Textarea = ({
  label,
  required,
  optional,
  optionalClassName,
  // Opt-in Field passthroughs (recruiter job-post form, Figma 7958:165028);
  // undefined = unchanged for every other caller.
  labelTrailing,
  labelTrailingClassName,
  labelClassName,
  labelRowClassName,
  forceAsterisk,
  asteriskClassName,
  // Opt-in extra classes on the bordered box / on the native <textarea>.
  boxClassName,
  textareaClassName,
  helperText,
  error,
  state,
  verified = false,
  disabled = false,
  maxLength,
  showCounter,
  counterSuffix,
  counterErrorTone = false,
  // (add-only) `counterInside` draws the counter inside the bordered box, under the text, right-aligned (recruiter invite dialog, Figma 10102:42412); default false = below the box.
  counterInside = false,
  warnAt = 0.9,
  rows = 4,
  value,
  defaultValue,
  onChange,
  id,
  className,
  ref,
  ...textareaProps
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const currentValue = isControlled ? value : internalValue;
  const length = currentValue ? String(currentValue).length : 0;

  log('render', {
    label,
    state,
    verified,
    disabled,
    length,
    maxLength,
    hasError: Boolean(error),
  });

  const resolvedState =
    state ||
    (disabled ? 'disabled' : null) ||
    (error ? 'error' : null) ||
    (verified ? 'verified' : null);

  const wrapperStateClasses = resolvedState ? STATE_CLASSES[resolvedState] : INTERACTIVE_CLASSES;
  const isHtmlDisabled = disabled || state === 'disabled';

  const handleChange = (e) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
  };

  // Show counter when explicitly enabled OR when maxLength is set and not
  // explicitly disabled.
  const showCounterResolved = showCounter ?? Boolean(maxLength);

  // Counter colour: red if over, gold if approaching, neutral otherwise.
  let counterColour = 'text-neutral-darker';
  if (counterErrorTone && error) counterColour = 'text-danger';
  if (maxLength) {
    if (length > maxLength) counterColour = 'text-danger';
    else if (length >= maxLength * warnAt) counterColour = 'text-accent';
  }

  return (
    <Field
      label={label}
      htmlFor={inputId}
      required={required}
      optional={optional}
      optionalClassName={optionalClassName}
      labelTrailing={labelTrailing}
      labelTrailingClassName={labelTrailingClassName}
      labelClassName={labelClassName}
      labelRowClassName={labelRowClassName}
      forceAsterisk={forceAsterisk}
      asteriskClassName={asteriskClassName}
      helperText={helperText}
      error={error}
      className={className}
    >
      <div
        className={classNames(
          WRAPPER_BASE,
          counterInside && 'flex-col',
          wrapperStateClasses,
          boxClassName
        )}
      >
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          disabled={isHtmlDisabled}
          // Native maxLength forces the browser to block input over the limit.
          // We intentionally don't set it so the counter can show "503/500"
          // and let the consumer apply their own validation. Use `maxLength`
          // explicitly (e.g. via react-hook-form `validate`) if you want
          // server-side rejection.
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error || helperText ? `${inputId}-msg` : undefined}
          className={classNames(TEXTAREA_BASE, textareaClassName)}
          value={isControlled ? currentValue : undefined}
          defaultValue={!isControlled ? defaultValue : undefined}
          onChange={handleChange}
          {...textareaProps}
        />
        {showCounterResolved && counterInside && (
          <div
            className={classNames(
              'flex justify-end px-4 pb-3 font-sans text-[12px] leading-5 tracking-[0.2px]',
              counterColour
            )}
            aria-live="polite"
          >
            {maxLength ? `${length} / ${maxLength}` : `${length}`}
            {counterSuffix}
          </div>
        )}
      </div>
      {showCounterResolved && !counterInside && (
        <div
          className={classNames(
            'flex justify-end mt-1 px-1 font-sans text-[10px] max-lg:text-[12px] leading-4 tracking-[0.2px]',
            counterColour
          )}
          aria-live="polite"
        >
          {maxLength ? `${length} / ${maxLength}` : `${length}`}
          {counterSuffix}
        </div>
      )}
    </Field>
  );
};

export default Textarea;
