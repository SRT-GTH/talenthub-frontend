import { useId } from 'react';
import hintIcon from '../../../../assets/parent/link-hint.svg';

/*
 * LinkField — one labelled input of the search card (Figma "Input · Ward’s full name" 10034:142082 / "Input · Date of birth" 10034:142083, 634 x 106): label 14/500 with a green "*" (Instrument Serif 600),
 * the 51px field (white, #ccc hairline, r10, 2.5px shelf rgba(191,191,191,.8), 14/500 text) and a 12/400 hint with the 16px alert glyph.
 * Props: label, hint, value, onChange(value), placeholder, inputMode, autoComplete, maxLength, required (shows the star; default true), className, ...input props.
 */
const LinkField = ({
  label,
  hint,
  value,
  onChange,
  placeholder,
  required = true,
  className,
  ...rest
}) => {
  const id = useId();
  return (
    <div className={`flex min-w-0 flex-col gap-[8px] ${className ?? ''}`}>
      <label
        htmlFor={id}
        className="flex items-center gap-px font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
      >
        {label}
        {required ? (
          <span
            aria-hidden="true"
            className="font-['Instrument_Serif',serif] text-[14px] leading-[21px] font-semibold text-[#2e8b57]"
          >
            *
          </span>
        ) : null}
      </label>
      <input
        id={id}
        type="text"
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        aria-describedby={`${id}-hint`}
        className="h-[51px] w-full min-w-0 rounded-[10px] border border-solid border-[#ccc] bg-white py-[13px] pr-[16px] pl-[20px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21] shadow-[0_2.5px_0_rgba(191,191,191,0.8)] outline-none placeholder:font-normal placeholder:text-[#bfbfbf] focus-visible:border-brand-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        {...rest}
      />
      <p
        id={`${id}-hint`}
        className="m-0 flex items-center gap-[8px] px-[8px] font-sans text-[12px] leading-[18px] tracking-[0.2px] text-neutral-darker"
      >
        <img src={hintIcon} alt="" aria-hidden="true" className="size-[16px] shrink-0" />
        {hint}
      </p>
    </div>
  );
};

export default LinkField;
