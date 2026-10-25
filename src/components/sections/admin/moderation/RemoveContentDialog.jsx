import { AdminClose16Icon, AdminFileCheckIcon, AdminPenIcon } from '../adminIcons.jsx';
import AgencyDialog from '../../agency/onboarding/AgencyDialog.jsx';
import { REMOVE } from './data/adminModerationData.js';

/*
 * RemoveContentDialog — "Remove this message and warn the author?" (Figma 7.2.2c 8627:2113, the talent "Delete certification" modal: 620 wide, r28, p 40/36/40/32, 1px
 * ink, scrim #0b1a0f at 55 %): chip "Remove content" · title 32/38 600 ("author?" green) · 15/22 #595959 sub · the message preview strip (#f8f8f4, r16) · WHAT HAPPENS with three
 * red-dot effects · the cream "Third flag in 30 days" note (gold edit tile) · "Escalate instead" (mint) + "Remove content" (red, 2px border, 4px shelf). 40 round close.
 * Props: onClose, onRemove, onEscalate.
 */

const RemoveContentDialog = ({ onClose, onRemove, onEscalate }) => (
  <AgencyDialog
    label={REMOVE.title}
    onClose={onClose}
    scrimClassName="bg-[#0b1a0f]/55"
    panelClassName="w-[min(620px,calc(100vw-32px))]"
  >
    <div className="relative flex flex-col gap-[32px] rounded-[28px] border border-solid border-[#1c2a21] bg-white px-[clamp(18px,2.1vw,36px)] pt-[clamp(24px,2.3vw,40px)] pb-[clamp(18px,1.85vw,32px)] shadow-[0_24px_64px_rgba(0,0,0,0.2)]">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-[24px] right-[24px] grid size-[40px] cursor-pointer place-items-center rounded-full border-0 bg-[#f3f3ef] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <AdminClose16Icon className="size-[16px]" />
      </button>
      <header className="flex flex-col items-start gap-[8px] pr-[44px]">
        <span className="inline-flex h-[32px] items-center rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#595959]">
          {REMOVE.chip}
        </span>
        <h2 className="m-0 font-sans text-[32px] leading-[38px] font-semibold text-[#1c2a21]">
          Remove this message and warn the <span className="text-[#387440]">author?</span>
        </h2>
        <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">{REMOVE.sub}</p>
      </header>
      <div className="flex items-center gap-[12px] rounded-[16px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] py-[14px] pr-[16px] pl-[14px]">
        <span className="grid size-[40px] shrink-0 place-items-center rounded-[12px] bg-[#ebf1ec] text-[#387440]">
          <AdminFileCheckIcon className="size-[20px]" />
        </span>
        <div className="flex flex-col gap-[2px]">
          <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
            {REMOVE.preview.title}
          </p>
          <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959]">
            {REMOVE.preview.sub}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-[16px]">
        <p className="m-0 font-sans text-[11px] leading-[13px] font-bold text-[#595959]">
          {REMOVE.happensLabel}
        </p>
        <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
          {REMOVE.happens.map((t) => (
            <li
              key={t}
              className="flex items-center gap-[8px] font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]"
            >
              <span aria-hidden="true" className="size-[7px] shrink-0 rounded-full bg-[#c0392b]" />
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center gap-[12px] rounded-[14px] border border-solid border-[#eedeb8] bg-[#faf4e8] py-[14px] pr-[16px] pl-[14px]">
        <span className="grid size-[34px] shrink-0 place-items-center rounded-[10px] bg-[#c8951a] text-white">
          <AdminPenIcon className="size-[17px]" />
        </span>
        <div className="flex flex-col gap-[2px]">
          <p className="m-0 font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
            {REMOVE.note.title}
          </p>
          <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959]">
            {REMOVE.note.sub}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-[12px] pt-[8px]">
        <button
          type="button"
          onClick={onEscalate}
          className="inline-flex h-[52px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[34px] font-sans text-[16px] leading-[24px] font-bold text-[#165d3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {REMOVE.escalate}
        </button>
        <button
          type="button"
          data-autofocus
          onClick={onRemove}
          className="inline-flex h-[52px] cursor-pointer items-center rounded-[10px] border-2 border-solid border-[#73221a] bg-[#c0392b] px-[28px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#73221a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c0392b]"
        >
          {REMOVE.primary}
        </button>
      </div>
    </div>
  </AgencyDialog>
);

export default RemoveContentDialog;
