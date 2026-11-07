import { useId } from 'react';
import Checkbox from '../../../ui/form/Checkbox.jsx';
import { CheckIcon } from '../../talentCandidateProfile/talentCandidateProfileIcons.jsx';
import { classNames } from '../../../../utils/classNames.js';

/*
 * ActionFormParts.jsx — small form pieces shared by the pipeline action dialogs.
 *   HintCheckbox   the 18px green checkbox with a 14/24 label and an optional 12/20 hint (Figma "Checkbox · Send each of them a short update" 10173:16186, "Don’t send a message" 10173:16850).
 *   RadioOptionRow a radio row of the "Akosua accepted your offer!" list: 18px circle, #387440 fill + white 8px dot when selected, #dbded9 1.5px ring otherwise (10173:19447 …).
 */
const CHECK_GLYPHS = {
  checked: (
    <span className="flex size-[18px] items-center justify-center rounded-[5px] bg-[#387440] text-white">
      <CheckIcon className="size-[12px]" />
    </span>
  ),
  unchecked: (
    <span className="block size-[18px] rounded-[5px] border-[1.5px] border-solid border-[#dbded9] bg-white" />
  ),
};

export const HintCheckbox = ({ checked, onChange, label, hint }) => (
  <Checkbox
    glyphs={CHECK_GLYPHS}
    checked={checked}
    onChange={(event) => onChange(event.target.checked)}
    label={
      <span className="flex flex-col gap-[2px] pl-[4px]">
        <span className="font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#111]">
          {label}
        </span>
        {hint ? (
          <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
            {hint}
          </span>
        ) : null}
      </span>
    }
  />
);

export const RadioOptionRow = ({ name, value, checked, onChange, label, hint }) => {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className="flex min-h-[24px] cursor-pointer items-start gap-[10px] select-none has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-green"
    >
      <span className="relative mt-[3px] flex size-[18px] shrink-0 items-center justify-center">
        <input
          id={id}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          className="peer absolute inset-0 m-0 size-full cursor-pointer opacity-0"
        />
        <span
          aria-hidden="true"
          className={classNames(
            'flex size-[18px] items-center justify-center rounded-full',
            checked ? 'bg-[#387440]' : 'border-[1.5px] border-solid border-[#dbded9] bg-white'
          )}
        >
          {checked ? <span className="size-[8px] rounded-full bg-white" /> : null}
        </span>
      </span>
      <span className="flex min-w-0 flex-col gap-[2px]">
        <span className="font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#111]">
          {label}
        </span>
        {hint ? (
          <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
            {hint}
          </span>
        ) : null}
      </span>
    </label>
  );
};
