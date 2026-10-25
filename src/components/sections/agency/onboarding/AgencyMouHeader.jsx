import { Link } from 'react-router-dom';
import gthLogoStacked from '../../../../assets/brand/gth-logo-stacked.webp';
import { AgArrowLeft, AgHelp } from './agencyOnboardingIcons.jsx';
import { MOU_UPLOAD as U } from './data/agencyOnboardingData.js';

/*
 * AgencyMouHeader — the two bars above the MoU upload page (Figma 11.4.1b 8596:988): "Nav" 90 high on #f8f8f4 (logo · gold "Change input mode" #c8951a / 2px #967014 ·
 * "Save & Exit" · help · "Efua O." chip) and the 64 high "Stage bar" (← MoU checklist · "STEP 5 OF 7" chip + "MoU" · "4 of 7 done · 57%" + nine 18 x 6 segments
 * (six #387440, the current #c8951a, two #e7e7e7) · "Auto-saved").
 * ⚠️ Not rendered: the Figma "Focused | Playful" switch in the nav (Focused style only). Props: onChangeMode, modeLabel (pressed state text for assistive tech).
 */

const SEGMENTS = [
  '#387440',
  '#387440',
  '#387440',
  '#387440',
  '#387440',
  '#387440',
  '#c8951a',
  '#e7e7e7',
  '#e7e7e7',
];

const AgencyMouHeader = ({ onChangeMode, listView }) => (
  <>
    <header className="flex min-h-[90px] w-full shrink-0 items-center justify-between gap-[12px] border-b border-solid border-[#e7e7e7] bg-[#f8f8f4] px-[clamp(16px,3.7vw,64px)] py-[12px] shadow-[0_1px_2px_rgba(27,36,44,0.12)]">
      <Link to="/agency" aria-label="Ghana Talent Hub, agency home">
        <img
          src={gthLogoStacked}
          alt="Ghana Talent Hub"
          className="h-[66px] w-[71px] max-md:h-10 max-md:w-[43px]"
        />
      </Link>
      <div className="flex items-center gap-[clamp(10px,1.4vw,24px)]">
        <button
          type="button"
          aria-pressed={listView}
          onClick={onChangeMode}
          className="inline-flex min-h-[44px] items-center gap-[8px] rounded-[10px] border-2 border-solid border-[#967014] bg-[#c8951a] px-[clamp(12px,1.4vw,24px)] py-[10px] font-sans text-[14px] leading-[24px] font-bold tracking-[0.1px] text-white shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8951a] max-sm:hidden"
        >
          Change input mode
        </button>
        <Link
          to="/agency"
          className="inline-flex min-h-[24px] items-center font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#387440] underline"
        >
          Save &amp; Exit
        </Link>
        <button
          type="button"
          aria-label="Help"
          className="grid size-[36px] place-items-center rounded-full border border-solid border-[#e2e8f0] bg-[#f8fafc] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <AgHelp className="size-[16px]" />
        </button>
        <span className="inline-flex h-[40px] items-center gap-[7px] rounded-[10px] border border-solid border-[#c1d4c4] bg-[#fffefc] px-[16px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]">
          <span
            aria-hidden="true"
            className="grid size-[24px] place-items-center rounded-full bg-[#387440] text-[10px] max-lg:text-[12px] leading-[12px] font-semibold text-white"
          >
            EO
          </span>
          Efua O.
        </span>
      </div>
    </header>
    <div className="grid min-h-[64px] w-full grid-cols-[1fr_auto_1fr] items-center gap-[12px] border-b border-solid border-[#e7e7e7] bg-white px-[clamp(16px,3.7vw,64px)] py-[8px]">
      <Link
        to="/agency/mou/status"
        className="inline-flex min-h-[24px] w-fit items-center gap-[8px] font-sans text-[14px] leading-[17px] font-semibold text-[#387440] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <AgArrowLeft className="size-[16px]" />
        {U.checklist}
      </Link>
      <div className="flex items-center justify-center gap-[10px]">
        <span className="inline-flex items-center rounded-full border border-solid border-[#1c2a21]/10 bg-[#ebf1ec] px-[10px] py-[4px] font-sans text-[11px] max-lg:text-[12px] leading-[13px] font-semibold text-[#387440] max-lg:text-[12px]">
          {U.stepChip}
        </span>
        <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
          {U.stepName}
        </span>
      </div>
      <div className="flex items-center justify-end gap-[12px]">
        <span className="font-sans text-[13px] leading-[16px] font-medium text-[#595959] max-md:hidden">
          {U.progress}
        </span>
        <span className="flex gap-[4px]" role="img" aria-label={U.progress}>
          {SEGMENTS.map((c, i) => (
            <span
              key={i}
              style={{ backgroundColor: c }}
              className="h-[6px] w-[18px] rounded-[3px] max-md:w-[10px]"
            />
          ))}
        </span>
        <span className="font-sans text-[12px] leading-[14px] font-medium text-[#595959] max-lg:hidden">
          Auto-saved
        </span>
      </div>
    </div>
  </>
);

export default AgencyMouHeader;
