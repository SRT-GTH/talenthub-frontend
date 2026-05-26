import { useId } from 'react';
import Field from './Field.jsx';
import { classNames } from '../../../utils/classNames.js';
import { GhanaFlagRoundIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('PhoneInput');

/*
 * PhoneInput — Ghana +233 phone-number input.
 *
 * Renders a two-part pill: a read-only "+233" prefix (Ghana flag + text)
 * separated by a hairline divider, then an editable numeric field.
 * The wrapper changes appearance on focus, error, and disabled states,
 * mirroring TextInput's shelf-shadow visual language exactly.
 *
 * Field-compatible: accepts label, required, optional, labelTrailing,
 * labelTrailingClassName, helperText, error.
 *
 * react-hook-form usage — Controller pattern (same as Select):
 *   <Controller
 *     name="phoneNumber"
 *     control={control}
 *     render={({ field }) => (
 *       <PhoneInput
 *         label="Phone Number"
 *         value={field.value}
 *         onChange={field.onChange}
 *         onBlur={field.onBlur}
 *         error={errors.phoneNumber?.message}
 *       />
 *     )}
 *   />
 *
 * Figma source: institution contact step phone field.
 */

const WRAPPER_BASE =
  'flex items-center gap-0 pl-[16px] pr-[16px] py-[13px] rounded-md w-full ' +
  'transition-colors duration-100';

const INTERACTIVE_CLASSES =
  'bg-white border border-[#cccccc] shadow-[0_2.5px_0_0_rgba(191,191,191,0.8)] ' +
  'focus-within:bg-yellow-light focus-within:border-[1.5px] focus-within:border-brand-green-light-active ' +
  'focus-within:shadow-[0_2.5px_0_0_rgba(34,70,38,0.8)]';

const ERROR_CLASSES =
  'bg-white border-[1.5px] border-danger-light-active shadow-[0_2.5px_0_0_rgba(146,43,33,0.8)] ' +
  '[&_input]:placeholder:text-danger';

const DISABLED_CLASSES = 'bg-brand-green-light border-2 border-[#cccccc] opacity-55 shadow-none';

const INPUT_BASE =
  'flex-1 min-w-0 bg-transparent outline-none border-none ' +
  'font-sans font-medium text-[14px] leading-[24px] tracking-[0.2px] ' +
  'text-[#111111] ' +
  'placeholder:text-[#595959] placeholder:font-normal ' +
  'disabled:cursor-not-allowed';

const PhoneInput = ({
  label,
  required,
  optional,
  labelTrailing,
  labelTrailingClassName,
  helperText,
  error,
  disabled = false,
  id,
  className,
  ref,
  ...inputProps
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  log('render', { label, disabled, hasError: Boolean(error) });

  const wrapperStateClasses = error
    ? ERROR_CLASSES
    : disabled
      ? DISABLED_CLASSES
      : INTERACTIVE_CLASSES;

  return (
    <Field
      label={label}
      htmlFor={inputId}
      required={required}
      optional={optional}
      labelTrailing={labelTrailing}
      labelTrailingClassName={labelTrailingClassName}
      helperText={helperText}
      error={error}
      className={className}
    >
      <div className={classNames(WRAPPER_BASE, wrapperStateClasses)}>
        {/* Read-only Ghana prefix */}
        <div className="flex shrink-0 items-center gap-1.5 pr-3 select-none" aria-hidden="true">
          <GhanaFlagRoundIcon />
          <span className="font-sans font-medium text-[14px] leading-[24px] tracking-[0.2px] text-[#111111]">
            +233
          </span>
        </div>

        {/* Divider */}
        <div className="shrink-0 w-px h-[18px] bg-[#d0d0d0] mr-3" aria-hidden="true" />

        {/* Number input */}
        <input
          ref={ref}
          id={inputId}
          type="tel"
          inputMode="numeric"
          disabled={disabled}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error || helperText ? `${inputId}-msg` : undefined}
          className={INPUT_BASE}
          {...inputProps}
        />
      </div>
    </Field>
  );
};

export default PhoneInput;
