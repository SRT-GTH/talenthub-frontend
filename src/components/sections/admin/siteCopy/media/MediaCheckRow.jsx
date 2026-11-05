import { useId } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { MediaCheckIcon } from './MediaIcons.jsx';

/*
 * MediaCheckRow — the tick rows of the media dialogs (Figma "check · Decorative image / Shows identifiable people / Consent confirmed / Keep the same description"):
 * 22 box r6, 1.5px #575755 border on white (checked: #387440 face and border with a white tick), label 14.5/600, hint 12.5/400 #575755 (18 line), gap 10.
 * A real checkbox (keyboard + screen readers) with the visual box drawn after it. Props: label, hint, checked, onChange(bool), disabled.
 */
const MediaCheckRow = ({ label, hint, checked, onChange, disabled = false }) => {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={classNames(
        'flex items-start gap-[10px] font-sans',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={classNames(
          'grid size-[22px] shrink-0 place-items-center rounded-[6px] border-[1.5px] border-solid text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#387440]',
          checked ? 'border-[#387440] bg-[#387440]' : 'border-[#575755] bg-white'
        )}
      >
        {checked ? <MediaCheckIcon className="size-[14px]" /> : null}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <span className="text-[14.5px] leading-[17px] font-semibold text-[#1c2a21]">{label}</span>
        {hint ? (
          <span id={`${id}-hint`} className="text-[12.5px] leading-[18px] text-[#575755]">
            {hint}
          </span>
        ) : null}
      </span>
    </label>
  );
};

export default MediaCheckRow;
