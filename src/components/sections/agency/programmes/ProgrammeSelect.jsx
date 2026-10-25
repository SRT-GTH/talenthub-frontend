import { useId } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { ProgrammesIconArrowhead } from './programmesIcons.jsx';

/*
 * ProgrammeSelect — the required "Programme *" field of "Who can apply" and "Applicants" (Figma GTHInput 8597:393863: 431 x 51, 1px #cccccc, r10, shadow 0 2.5 0,
 * value 14/500 #595959, the green 20px arrowhead on the right; label 14/500 on the form, 16/500 on the Applicants page, the asterisk #1d7c4d 600).
 * A native <select> (keyboard, screen reader and mobile pickers for free) under the label, the arrowhead is decoration.
 * Props: value, onChange(id), options [{ id, optionLabel }], large (16px label, Applicants page).
 */

const ProgrammeSelect = ({ value, onChange, options, large = false }) => {
  const id = useId();
  return (
    <div className="flex w-full max-w-[431px] flex-col gap-[8px] font-sans">
      <label
        htmlFor={id}
        className={classNames(
          'flex items-center gap-[1px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]',
          large ? 'text-[16px]' : 'text-[14px]'
        )}
      >
        Programme
        <span aria-hidden="true" className="text-[14px] font-semibold text-[#1d7c4d]">
          *
        </span>
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          required
          aria-required="true"
          onChange={(e) => onChange(e.target.value)}
          className="h-[51px] w-full cursor-pointer appearance-none rounded-[10px] border border-solid border-[#cccccc] bg-white py-[13px] pr-[44px] pl-[16px] font-sans text-[14px] leading-[20px] font-medium tracking-[0.2px] text-[#595959] shadow-[0_2.5px_0_rgba(0,0,0,0.04)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.optionLabel}
            </option>
          ))}
        </select>
        <ProgrammesIconArrowhead className="pointer-events-none absolute top-[15px] right-[16px] size-[20px] text-[#387440]" />
      </div>
    </div>
  );
};

export default ProgrammeSelect;
