import AgencyDialog from '../../agency/onboarding/AgencyDialog.jsx';
import { AdminCheckIcon, AdminClockIcon, AdminSparkIcon, AdminUserIcon } from '../adminIcons.jsx';
import { READY } from './data/adminReportsData.js';

/*
 * ExportReadyDialog — "Export ready" (Figma 7.3.2c 8636:8199 "Applied modal", 560 x 586, #fffefc, r28, 1px ink, scrim #1c2a21 at 45 %): the 200 high #387440 celebration (a 110 yellow
 * disc with a white tick, the "Approved" sticker, eight 2px-radius confetti pieces) · title 34/41 600 · 15 #595959 sub · the "what next" list (#f8f8f4, r18: three rows with a 30 round
 * mint icon + 14/500 text) · "Back to reports" (white) + "Download CSV" (green). Props: onBack, onDownload.
 * ⚠️ ASSUMPTION: "Download CSV" has no file behind it in the mock (it logs and closes).
 */

const CONFETTI = [
  { x: 40, y: 25, w: 15, h: 10, c: '#ffd86b', r: 18 },
  { x: 87, y: 160, w: 15, h: 12, c: '#ffffff', r: -22 },
  { x: 470, y: 21, w: 15, h: 14, c: '#ffffff', r: 28 },
  { x: 498, y: 150, w: 15, h: 9, c: '#ffd86b', r: -14 },
  { x: 180, y: 158, w: 12, h: 15, c: '#ebf1ec', r: 35 },
  { x: 350, y: 168, w: 15, h: 8, c: '#ffd86b', r: -30 },
  { x: 16, y: 120, w: 15, h: 14, c: '#ebf1ec', r: 12 },
  { x: 520, y: 84, w: 15, h: 11, c: '#ebf1ec', r: -40 },
];

const ICONS = { clock: AdminClockIcon, chat: AdminUserIcon, spark: AdminSparkIcon };

const ExportReadyDialog = ({ onBack, onDownload }) => (
  <AgencyDialog
    label={READY.title}
    onClose={onBack}
    scrimClassName="bg-[#1c2a21]/45"
    panelClassName="w-[min(560px,calc(100vw-32px))]"
  >
    <div className="flex flex-col overflow-hidden rounded-[28px] border border-solid border-[#1c2a21] bg-[#fffefc] shadow-[0_24px_64px_rgba(0,0,0,0.2)]">
      <div className="relative h-[200px] bg-[#387440]">
        {CONFETTI.map((p, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute rounded-[2px] border border-solid border-[#1c2a21]"
            style={{
              left: p.x,
              top: p.y,
              width: p.w,
              height: p.h,
              background: p.c,
              transform: `rotate(${p.r}deg)`,
            }}
          />
        ))}
        <span className="absolute top-[44px] left-1/2 grid size-[110px] -translate-x-1/2 place-items-center rounded-full border border-solid border-[#1c2a21] bg-[#ffd86b]">
          <span className="grid size-[52px] place-items-center rounded-[6px] bg-white text-[#1c2a21]">
            <AdminCheckIcon className="size-[40px]" />
          </span>
        </span>
        <span className="absolute top-[40px] left-[calc(50%+78px)] inline-flex items-center gap-[6px] rounded-full border border-solid border-[#1c2a21] bg-white py-[6px] pr-[12px] pl-[10px] font-sans text-[12.5px] leading-[15px] font-bold text-[#1c2a21]">
          <span aria-hidden="true">➤</span>
          {READY.sticker}
        </span>
      </div>
      <div className="flex flex-col items-center gap-[12px] px-[30px] pt-[24px] pb-[26px]">
        <h2 className="m-0 font-sans text-[34px] leading-[41px] font-semibold text-[#1c2a21]">
          {READY.title}
        </h2>
        <p className="m-0 text-center font-sans text-[15px] leading-[21px] text-[#595959]">
          {READY.sub}
        </p>
        <ul className="m-0 flex w-full list-none flex-col gap-[4px] overflow-hidden rounded-[18px] border border-solid border-[#e1eae2] bg-[#f8f8f4] p-0">
          {READY.items.map((it, i) => {
            const Icon = ICONS[it.id];
            return (
              <li
                key={it.id}
                className={`flex items-center gap-[12px] px-[16px] py-[12px] ${i > 0 ? 'border-t border-solid border-[#e1eae2]' : ''}`}
              >
                <span className="grid size-[30px] shrink-0 place-items-center rounded-full bg-[#ebf1ec] text-[#387440]">
                  <Icon className="size-[15px]" />
                </span>
                <span className="font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]">
                  {it.text}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="mt-[8px] flex w-full gap-[10px]">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-[56px] flex-1 cursor-pointer items-center justify-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[34px] font-sans text-[16px] leading-[24px] font-bold text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {READY.back}
          </button>
          <button
            type="button"
            data-autofocus
            onClick={onDownload}
            className="inline-flex h-[56px] flex-1 cursor-pointer items-center justify-center rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[34px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {READY.primary}
          </button>
        </div>
      </div>
    </div>
  </AgencyDialog>
);

export default ExportReadyDialog;
