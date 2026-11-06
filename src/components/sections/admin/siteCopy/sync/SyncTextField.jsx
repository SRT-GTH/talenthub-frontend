import { useId } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import SyncChip from './SyncChip.jsx';
import { RestoreIcon } from './SyncIcons.jsx';
import SyncRichToolbar from './SyncRichToolbar.jsx';

/*
 * SyncTextField — one copy field of a section pane (Figma "field · Headline" …): the label 14/600 with an optional chip ("Changed", 7.8.8b), the counter
 * "32 / 60" 12.5/600 #575755 on the right, "Reset to default" 12.5/600 (7.8.8b), and the box (white, 1px #e7e7e7, r12): `line` 15/22 (20/28 600 for the
 * headline), `rich` with the formatting toolbar above the text. `read` (removed section, 7.8.8c) is a #f8f8f4 box with 13/600 label and 15/400 #575755 text.
 * Props: field { id, label, kind, value, max }, value, onChange, headline (bigger text), changed (show the chip + reset), onReset.
 */
const BOX =
  'w-full rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[14px] font-sans text-[#1c2a21] outline-none';
const RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const SyncTextField = ({ field, value, onChange, headline = false, changed = false, onReset }) => {
  const id = useId();
  const shown =
    field.count == null
      ? (value ?? '').length
      : field.count + (value ?? '').length - field.value.length;
  if (field.kind === 'read') {
    return (
      <div className="flex flex-col gap-[6px]">
        <span className="font-sans text-[13px] leading-[16px] font-semibold text-[#575755]">
          {field.label}
        </span>
        <p className="m-0 rounded-[12px] bg-[#f8f8f4] px-[14px] py-[12px] font-sans text-[15px] leading-[18px] text-[#575755]">
          {field.value}
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[4px]">
        <label
          htmlFor={id}
          className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]"
        >
          {field.label}
        </label>
        {changed ? <SyncChip tone="changed" /> : null}
        <span className="flex-1" />
        <span
          aria-hidden="true"
          className="font-sans text-[12.5px] leading-[15px] font-semibold text-[#575755]"
        >
          {shown} / {field.max}
        </span>
        {changed ? (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-[24px] cursor-pointer items-center gap-[4px] rounded-[8px] border-0 bg-transparent px-[8px] py-[4px] font-sans text-[12.5px] leading-[15px] font-semibold text-[#575755] hover:bg-[#f8f8f4] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#387440]"
          >
            <RestoreIcon className="size-[14px]" />
            Reset to default
          </button>
        ) : null}
      </div>
      {field.kind === 'rich' ? (
        <div
          className={classNames(
            BOX,
            'flex flex-col gap-[10px] pt-[10px] pb-[14px] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440]'
          )}
        >
          <SyncRichToolbar />
          <textarea
            id={id}
            rows={2}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full resize-none border-0 bg-transparent p-0 font-sans text-[15px] leading-[22px] text-[#1c2a21] outline-none"
          />
        </div>
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={classNames(
            BOX,
            RING,
            headline
              ? 'py-[12px] text-[20px] leading-[28px] font-semibold'
              : 'py-[12px] text-[15px] leading-[22px]'
          )}
        />
      )}
    </div>
  );
};

export default SyncTextField;
