import { classNames } from '../../../../utils/classNames.js';

/*
 * CircleNoteField — Figma `Note field` / `Recommendation field`: white box, 1.5px #387440 border, r12, p12/14, 14px text with a
 * "n / max" counter (11px #9a9a98) at the bottom right. Props: id, value, onChange(text), max, label (aria), placeholder,
 * rows, textClass (override font size), autoFocus.
 */
const CircleNoteField = ({ id, value, onChange, max, label, placeholder, rows = 3, textClass }) => (
  <div className="flex flex-col gap-[8px] rounded-[12px] border-[1.5px] border-solid border-[#387440] bg-white px-[14px] py-[12px] focus-within:shadow-[0_0_0_3px_rgba(56,116,64,0.18)]">
    <textarea
      id={id}
      value={value}
      rows={rows}
      maxLength={max}
      placeholder={placeholder}
      aria-label={label}
      onChange={(e) => onChange(e.target.value)}
      className={classNames(
        'block w-full resize-none border-0 bg-transparent p-0 font-sans text-[14px] leading-[21px] text-[#1c2a21] outline-none placeholder:text-[#9a9a98]',
        textClass
      )}
    />
    <span className="self-end font-sans text-[11px] leading-[13px] text-[#9a9a98] max-lg:text-[12px]">
      {value.length} / {max}
    </span>
  </div>
);

export default CircleNoteField;
