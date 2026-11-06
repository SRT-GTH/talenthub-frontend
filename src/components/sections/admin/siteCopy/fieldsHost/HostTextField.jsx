import { useId } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import { CopyLabelIcon } from '../siteCopyIcons.jsx';
import { LinkIcon } from '../fields/FieldsIcons.jsx';

const log = debug('HostTextField');

/*
 * HostTextField — a text field of the demo editor behind the image / video fields (Figma "field · Headline | Supporting line | Section title"): label 14 / 600 with the
 * counter "23 / 60" (12.5 / 600 #575755) on the right, then a #e7e7e7 box (r12, 14 padding). `variant`: 'headline' (20 / 28 600, one line), 'section-title' (15 / 22),
 * 'rich' (the Supporting line: a format toolbar B · I · • · 1. · link · Insert name above the 15 / 22 text). Real editing of text fields belongs to the editor
 * page of builder B1; here the boxes are plain inputs so the page behind the image / video fields behaves.
 * ⚠️ ASSUMPTION: the toolbar buttons of the rich variant only log (no rich text in this demo page); the counter counts characters.
 * Props: label, value, onChange(text), max, variant, canEdit.
 */
const TOOLS = [
  { id: 'bold', node: <span className="font-bold">B</span>, label: 'Bold' },
  { id: 'italic', node: <span className="font-medium">I</span>, label: 'Italic' },
  { id: 'bullets', node: <span className="font-semibold">•</span>, label: 'Bulleted list' },
  { id: 'numbers', node: <span className="font-semibold">1.</span>, label: 'Numbered list' },
  { id: 'link', node: <LinkIcon className="size-[16px]" />, label: 'Link' },
];

const HostTextField = ({
  label,
  value,
  onChange,
  max,
  variant = 'section-title',
  canEdit = true,
}) => {
  const id = useId();
  const rich = variant === 'rich';
  const common = {
    id,
    value,
    readOnly: !canEdit,
    maxLength: max,
    onChange: (e) => onChange?.(e.target.value),
    className: classNames(
      'w-full min-w-0 border-0 bg-transparent p-0 font-sans text-[#1c2a21] outline-none',
      variant === 'headline'
        ? 'text-[20px] leading-[28px] font-semibold max-sm:text-[18px]'
        : 'text-[15px] leading-[22px]'
    ),
  };
  return (
    <div className="flex min-w-0 flex-col gap-[8px]">
      <div className="flex items-center gap-[8px]">
        <label
          htmlFor={id}
          className="flex-1 font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]"
        >
          {label}
        </label>
        <span
          aria-live="polite"
          className="font-sans text-[12.5px] leading-[15px] font-semibold text-[#575755]"
        >
          {value.length} / {max}
        </span>
      </div>
      <div
        className={classNames(
          'flex flex-col gap-[10px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white focus-within:border-[#387440]',
          rich ? 'px-[14px] pt-[10px] pb-[14px]' : 'px-[14px] py-[12px]'
        )}
      >
        {rich ? (
          <div
            role="toolbar"
            aria-label="Format"
            className="flex w-fit max-w-full flex-wrap items-center gap-[2px] rounded-[10px] bg-[#f8f8f4] p-[4px] font-sans text-[14px] leading-[17px] text-[#1c2a21]"
          >
            {TOOLS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-label={t.label}
                disabled={!canEdit}
                onClick={() => log('format (no rich text in this demo)', t.id)}
                className="inline-flex min-h-[27px] min-w-[24px] cursor-pointer items-center justify-center rounded-[8px] border-0 bg-transparent px-[10px] py-[5px] text-inherit hover:bg-white focus-visible:outline-2 focus-visible:outline-[#387440]"
              >
                {t.node}
              </button>
            ))}
            <span aria-hidden="true" className="mx-[2px] h-[20px] w-px bg-[#e7e7e7]" />
            <button
              type="button"
              disabled={!canEdit}
              onClick={() => log('insert name (no rich text in this demo)')}
              className="inline-flex min-h-[26px] cursor-pointer items-center gap-[6px] rounded-[8px] border-0 bg-transparent px-[10px] py-[5px] text-[13px] leading-[16px] font-semibold text-[#2a5730] hover:bg-white focus-visible:outline-2 focus-visible:outline-[#387440]"
            >
              <CopyLabelIcon className="size-[16px]" />
              Insert name
            </button>
          </div>
        ) : null}
        {rich ? (
          <textarea rows={2} {...common} className={classNames(common.className, 'resize-none')} />
        ) : (
          <input type="text" {...common} />
        )}
      </div>
    </div>
  );
};

export default HostTextField;
