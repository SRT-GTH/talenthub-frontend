import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import WardChip from '../wards/WardChip.jsx';
import pauseIcon from '../../../../assets/parent/optout-pause.svg';
import { OPT_OUT_COPY } from './data/optOutData.js';

const log = debug('WardOptedOut');

/*
 * WardOptedOut — the ward page of an opted-out ward, PO-02 "Ward · Opted out" (Figma 10034:143423; same layout behind PO-03 10034:144044): "My wards" 34/600, the red paused banner (#f9ebea, r16, p16: pause icon,
 * "Abena’s access is paused" 15/600 over "Opted out by you today, 15:20 · reason: … · her profile is hidden and her data is kept" 13), the ward header (avatar 72, name 28/600, red "Opted out" chip, meta line,
 * one "Restore access" button — no tabs, no other buttons), the "What happens now" card (four bullets) and the 360px "Worried about safety?" card (#ebf1ec, r24, p22) with "Report a concern".
 * Props: ward (wardsData entry), access ({ reasonLabel, at }), onRestore, onReport. Renders ONLY the main column, like WardShell.
 * Figma inconsistency: PO-02 draws the safety card at x 1696, outside the 1329 column (cut off at the frame edge); PO-03 draws it at x 1334 beside the 945px card — the PO-03 layout is built (below 1280px it stacks).
 */
const CARD =
  'rounded-[24px] border border-solid border-[#e7e7e7] bg-white shadow-[0_5px_8.5px_rgba(28,42,33,0.03)]';

const WardOptedOut = ({ ward, access, onRestore, onReport }) => {
  const copy = OPT_OUT_COPY.paused;
  log('render', { ward: ward.id, reason: access?.reasonLabel });

  return (
    <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[24px] pt-[clamp(0px,0.7vw,12px)]">
      <h1 className="m-0 font-sans text-[clamp(26px,1.97vw,34px)] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21]">
        My wards
      </h1>

      <div className="flex flex-col gap-[20px]">
        <div
          id="access-banner"
          role="status"
          tabIndex={-1}
          className="flex items-start gap-[12px] rounded-[16px] bg-[#f9ebea] p-[16px] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c0392b]"
        >
          <img src={pauseIcon} alt="" aria-hidden="true" className="size-[20px] shrink-0" />
          <div className="flex min-w-0 flex-col gap-[2px]">
            <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
              {copy.title(ward)}
            </span>
            <span className="font-sans text-[13px] leading-[16px] text-[#575755] max-lg:text-[12px]">
              {copy.sub(ward, access?.at, access?.reasonLabel)}
            </span>
          </div>
        </div>

        <section
          aria-label={`${ward.name} header`}
          className={`flex flex-wrap items-center gap-x-[18px] gap-y-[16px] p-[22px] ${CARD}`}
        >
          <img
            src={ward.photo}
            alt=""
            width="72"
            height="72"
            className="size-[72px] shrink-0 rounded-full object-cover"
          />
          <div className="flex min-w-[240px] flex-1 flex-col gap-[4px]">
            <div className="flex flex-wrap items-center gap-[10px]">
              <h2 className="m-0 font-sans text-[28px] leading-[1.25] font-semibold tracking-[-0.14px] text-[#1c2a21]">
                {ward.name}
              </h2>
              <WardChip tone="opted">{copy.chip}</WardChip>
            </div>
            <p className="m-0 font-sans text-[14px] leading-normal text-[#575755]">
              {ward.relation} · {ward.age} · {ward.grade} · {ward.school} · on GTH since{' '}
              {ward.since}
            </p>
          </div>
          <ParentButton onClick={onRestore}>{copy.restore}</ParentButton>
        </section>

        <div className="flex flex-col items-start gap-[24px] min-[1280px]:flex-row">
          <section
            aria-labelledby="happens-now"
            className={`flex w-full min-w-0 flex-1 flex-col gap-[14px] p-[22px] ${CARD}`}
          >
            <h3
              id="happens-now"
              className="m-0 font-sans text-[20px] leading-[25px] font-semibold tracking-[-0.1px] text-[#1c2a21]"
            >
              {copy.happensTitle}
            </h3>
            <ul className="m-0 flex list-none flex-col gap-[14px] p-0">
              {copy.happens(ward).map((line) => (
                <li
                  key={line}
                  className="font-sans text-[14px] leading-[17px] text-[#1c2a21] max-lg:text-[14px]"
                >
                  <span aria-hidden="true">• </span>
                  {line}
                </li>
              ))}
            </ul>
          </section>

          <aside
            aria-label={copy.safetyTitle}
            className="flex w-full shrink-0 flex-col items-start gap-[14px] rounded-[24px] bg-[#ebf1ec] p-[22px] min-[1280px]:w-[360px]"
          >
            <h3 className="m-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]">
              {copy.safetyTitle}
            </h3>
            <p className="m-0 font-sans text-[13px] leading-[16px] text-[#1c2a21] max-lg:text-[13px]">
              {copy.safetyText}
            </p>
            <ParentButton variant="secondary" onClick={onReport}>
              {copy.report}
            </ParentButton>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default WardOptedOut;
