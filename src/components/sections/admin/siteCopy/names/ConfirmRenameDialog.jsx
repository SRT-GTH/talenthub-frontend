import { useState } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import AgencyDialog from '../../../agency/onboarding/AgencyDialog.jsx';
import { CopyLabelIcon } from '../siteCopyIcons.jsx';
import { CloseIcon } from './NameIcons.jsx';
import { placesOf } from './productNameRules.js';

const log = debug('ConfirmRenameDialog');

/*
 * ConfirmRenameDialog — "Rename Career Buddy everywhere?" (Figma 7.8.6h "Modal · Rename Career …": 580 wide, r24, 28 padding, 16 gap, 1px ink@.10, scrim
 * #1c2a21 at 55 %): a cream label tile, the title 24/600, a close button, the explanation, three summary tiles (places on pages · emails · assistant
 * replies: 280 · 23 · All), "Type the new name to confirm" (the "Rename everywhere" button stays off until the typed text is the new full name),
 * "Reason: …" and Cancel / Rename everywhere.
 * Figma draws the tiles squeezed to 28 px and the reason line on top of the input (auto-layout broken in that frame): drawn here in the order of the nodes
 * (tiles → input → reason line → buttons) at their real sizes.
 * Props: item (the name row), next { name }, reason, initialTyped (frame URL: pre-typed), onCancel, onConfirm.
 */
const SUMMARY = (usage) => [
  { value: String(placesOf(usage)), label: 'places on pages' },
  { value: String(usage.emails), label: 'emails' },
  { value: String(usage.assistant), label: 'assistant replies' },
];

const ConfirmRenameDialog = ({ item, next, reason, initialTyped = '', onCancel, onConfirm }) => {
  const [typed, setTyped] = useState(initialTyped);
  const ready = typed.trim() === next.name;
  log('render', { id: item.id, ready });
  return (
    <AgencyDialog
      label={`Rename ${item.name} everywhere?`}
      onClose={onCancel}
      scrimClassName="bg-[#1c2a21]/55"
      panelClassName="w-[min(580px,calc(100vw-24px))]"
    >
      <div className="flex flex-col gap-[16px] rounded-[24px] border border-solid border-[#1c2a21]/10 bg-white p-[20px] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_8px_rgba(0,0,0,0.08),0_24px_60px_rgba(28,42,33,0.25)] sm:p-[28px]">
        <div className="flex items-center gap-[12px]">
          <span className="inline-flex size-[44px] shrink-0 items-center justify-center rounded-[13px] bg-[#faf4e8] text-[#8a6100]">
            <CopyLabelIcon className="size-[21px]" />
          </span>
          <h2 className="m-0 min-w-0 flex-1 font-sans text-[clamp(20px,5.5vw,24px)] leading-[29px] font-semibold tracking-[-0.24px] text-[#1c2a21]">
            Rename {item.name} everywhere?
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="inline-flex size-[30px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[#f8f8f4] p-0 text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <CloseIcon className="size-[18px]" />
          </button>
        </div>
        <p className="m-0 font-sans text-[15px] leading-[22px] text-[#575755]">
          This renames {item.name} everywhere, including emails and the assistant’s replies. People
          who type “{item.name}” will still be understood.
        </p>
        <ul className="m-0 flex list-none flex-wrap gap-[8px] p-0">
          {SUMMARY(item.usage).map((s) => (
            <li
              key={s.label}
              className="flex flex-col gap-[2px] rounded-[12px] bg-[#f8f8f4] p-[12px]"
            >
              <span className="font-sans text-[20px] leading-[24px] font-semibold text-[#1c2a21]">
                {s.value}
              </span>
              <span className="font-sans text-[12.5px] leading-[15px] font-medium text-[#575755]">
                {s.label}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-[8px]">
          <label
            htmlFor="rename-confirm"
            className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
          >
            Type the new name to confirm
          </label>
          <input
            id="rename-confirm"
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
            data-autofocus=""
            className="min-h-[51px] w-full rounded-[10px] border border-solid border-[#ccc] bg-white py-[13px] pr-[16px] pl-[20px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21] shadow-[0_2px_11px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          />
        </div>
        <p className="m-0 font-sans text-[13px] leading-[16px] font-medium text-[#575755]">
          Reason: {reason}
        </p>
        <div className="flex gap-[12px] max-sm:flex-col-reverse">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-[56px] flex-1 cursor-pointer items-center justify-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[12px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] sm:px-[34px]"
          >
            Cancel
          </button>
          <button
            type="button"
            aria-disabled={ready ? undefined : 'true'}
            onClick={() =>
              ready ? onConfirm() : log('confirm blocked: typed name does not match')
            }
            className={classNames(
              'inline-flex min-h-[56px] flex-1 items-center justify-center rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[12px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] sm:px-[34px]',
              ready ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
            )}
          >
            Rename everywhere
          </button>
        </div>
      </div>
    </AgencyDialog>
  );
};

export default ConfirmRenameDialog;
