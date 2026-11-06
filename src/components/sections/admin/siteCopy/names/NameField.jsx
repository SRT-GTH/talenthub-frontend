import { useId } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { WarningIcon } from './NameIcons.jsx';

/*
 * NameField — one labelled text field of the rename drawer (Figma "f · Full name" 564 wide: 14/600 label, "4 / 40" counter 12.5/600 #575755 on the
 * right, a 44 px box r12 with a 1px #e7e7e7 border, 15/500 text; placeholder 15/400 #575755). Invalid (7.8.6c / 7.8.6d): a 2px #c0392b border, the counter
 * turns #c0392b and the message sits under the box with a warning glyph (13/600 #c0392b).
 * Props: label, value, onChange(text), onPaste, max (counter limit), error, placeholder, readOnly, autoFocus, inputRef, name.
 */
const NameField = ({
  label,
  value,
  onChange,
  onPaste,
  max,
  error,
  placeholder,
  readOnly,
  inputRef,
  name,
  ...rest
}) => {
  const id = useId();
  const count = String(value ?? '').length;
  return (
    <div className="flex flex-col gap-[6px]">
      <div className="flex items-baseline justify-between gap-[8px]">
        <label
          htmlFor={id}
          className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]"
        >
          {label}
        </label>
        <span
          aria-hidden="true"
          className={classNames(
            'font-sans text-[12.5px] leading-[15px] font-semibold',
            error ? 'text-[#c0392b]' : 'text-[#575755]'
          )}
        >
          {count} / {max}
        </span>
      </div>
      <input
        id={id}
        ref={inputRef}
        name={name}
        type="text"
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        onPaste={onPaste}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        autoComplete="off"
        {...rest}
        className={classNames(
          'h-[44px] w-full rounded-[12px] border-solid bg-white px-[14px] font-sans text-[15px] leading-[18px] font-medium text-[#1c2a21] outline-none placeholder:font-normal placeholder:text-[#575755] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
          error ? 'border-2 border-[#c0392b]' : 'border border-[#e7e7e7]',
          readOnly && 'cursor-default'
        )}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="m-0 flex items-start gap-[6px]">
          <WarningIcon className="-m-[3px] mt-[0px] size-[20px] shrink-0 text-[#b42318]" />
          <span className="font-sans text-[13px] leading-[18px] font-semibold text-[#c0392b]">
            {error}
          </span>
        </p>
      ) : null}
    </div>
  );
};

export default NameField;
