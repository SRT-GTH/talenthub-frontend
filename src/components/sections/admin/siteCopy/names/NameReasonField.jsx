import { useId } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { NAME_LIMITS } from './productNamesData.js';
import { WarningIcon } from './NameIcons.jsx';

/*
 * NameReasonField — "Why are you publishing this?" of the Super Admin review drawer (7.8.6g, 7.8.6j): label 14/500, a 51 px box (r10, 1px #ccc,
 * 14/500 text, placeholder "For example: Fix typo in hero"), then "35 / 200 · everyone on the team can see this in history" 12.5/400 #575755.
 * Missing reason (7.8.6j): a 2px #c0392b box and the message with a warning glyph (13/600 #c0392b) replaces the counter line.
 * Figma draws this box 281 px (7.8.6g) and 450 px (7.8.6j) wide while every field above it is 564: kept full width here.
 * Props: value, onChange(text), error, inputRef.
 */
const NameReasonField = ({ value, onChange, error, inputRef, autoFocus }) => {
  const id = useId();
  return (
    <div className="flex flex-col gap-[6px]">
      <label
        htmlFor={id}
        className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
      >
        Why are you publishing this?
      </label>
      <input
        id={id}
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="For example: Fix typo in hero"
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={`${id}-note`}
        autoComplete="off"
        data-autofocus={autoFocus ? '' : undefined}
        className={classNames(
          'min-h-[51px] w-full rounded-[10px] border-solid bg-white py-[13px] pr-[16px] pl-[20px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21] shadow-[0_2px_11px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] outline-none placeholder:text-[#575755] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
          error ? 'border-2 border-[#c0392b]' : 'border border-[#ccc]'
        )}
      />
      {error ? (
        <p id={`${id}-note`} role="alert" className="m-0 flex items-start gap-[6px]">
          <WarningIcon className="-m-[3px] size-[20px] shrink-0 text-[#c0392b]" />
          <span className="font-sans text-[13px] leading-[18px] font-semibold text-[#c0392b]">
            {error}
          </span>
        </p>
      ) : (
        <p id={`${id}-note`} className="m-0 font-sans text-[12.5px] leading-[15px] text-[#575755]">
          {value.length} / {NAME_LIMITS.reason} · everyone on the team can see this in history
        </p>
      )}
    </div>
  );
};

export default NameReasonField;
