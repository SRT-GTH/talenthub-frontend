import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import AgencyDialog from '../../agency/onboarding/AgencyDialog.jsx';
import { ACCREDITATION } from './data/institutionOnboardingData.js';
import {
  ArrowRightIcon,
  BellIcon,
  CloseIcon,
  FileCheckIcon,
  SearchIcon,
} from './institutionOnboardingIcons.jsx';

const log = debug('InstitutionSubmittedDialog');

const ICONS = { search: SearchIcon, bell: BellIcon };
const STAT = {
  plain: 'bg-[#f8f8f4] text-[#1c2a21]',
  green: 'bg-[#e8f2ed] text-[#165d3a]',
  gold: 'bg-[#faf4e8] text-[#785910]',
};
// Confetti pieces of the art band (Figma "confetti" rects: x, y, w, h, colour), 560 x 176.
const CONFETTI = [
  [424, 29, 11, 11, '#c0392b'],
  [403, 19, 12, 9, '#c0392b'],
  [114, 49, 12, 11, '#ffd86b'],
  [52, 83, 12, 11, '#ffd86b'],
  [102, 91, 5, 11, '#387440'],
  [46, 139, 11, 6, '#c8951a'],
  [122, 147, 12, 10, '#387440'],
  [419, 107, 11, 12, '#c0392b'],
  [524, 75, 12, 11, '#c8951a'],
  [72, 31, 12, 11, '#ffd86b'],
  [82, 19, 12, 7, '#c0392b'],
  [472, 79, 11, 11, '#c8951a'],
  [109, 117, 10, 12, '#ffd86b'],
  [126, 76, 12, 8, '#387440'],
  [114, 106, 9, 12, '#387440'],
  [69, 74, 5, 11, '#3062d4'],
  [454, 76, 7, 12, '#c0392b'],
  [133, 117, 12, 9, '#c8951a'],
  [419, 128, 11, 6, '#c8951a'],
  [467, 116, 9, 12, '#3062d4'],
];

/*
 * InstitutionSubmittedDialog — "Documents submitted." (Figma 11.1.2a3 8589:3051 "Modal · Stage complete" 560 x 703: white, 1px ink@.10, r28, pb 28, gap 20; scrim #0b1a0f at 55 %).
 * 176 high art band with the 100 round green medallion + 20 confetti rects and the 36 round close; body (p 32, gap 32): eyebrow, 35/42 headline (green "submitted."),
 * 15/22 text, three stat tiles (r16), "What happens next" two rows, "Go to my status page" (mint) + "Next: Review" (green shelf).
 * ⚠️ ASSUMPTION: the Review step is not drawn, so "Next: Review" also lands on the status page (in review).
 * Props: onClose.
 */

const InstitutionSubmittedDialog = ({ onClose }) => {
  const S = ACCREDITATION.submitted;
  const statusTo = '/institution/accreditation/status?verify=under-review';
  return (
    <AgencyDialog
      label="Documents submitted"
      onClose={onClose}
      scrimClassName="bg-[#0b1a0f]/55"
      panelClassName="mt-[24px] w-[min(560px,calc(100vw-32px))] self-start"
    >
      <div className="flex flex-col gap-[20px] overflow-hidden rounded-[28px] border border-solid border-[#1c2a21]/10 bg-white pb-[28px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)]">
        <div className="relative h-[176px] bg-[radial-gradient(circle_at_50%_50%,#dfeae1_0%,#ffffff_75%)]">
          {CONFETTI.map(([x, y, w, h, c]) => (
            <span
              key={`${x}-${y}`}
              aria-hidden="true"
              className="absolute rounded-[2px] max-sm:hidden"
              style={{ left: x, top: y, width: w, height: h, backgroundColor: c, opacity: 0.9 }}
            />
          ))}
          <span className="absolute top-[41px] left-1/2 grid size-[100px] -translate-x-1/2 place-items-center rounded-full border border-solid border-[#1c2a21]/10 bg-[#387440] text-white shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)]">
            <FileCheckIcon className="size-[44px]" />
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-[21px] right-[16px] grid size-[36px] place-items-center rounded-full bg-[#f3f3ef] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <CloseIcon className="size-[14px]" />
          </button>
        </div>
        <div className="flex flex-col gap-[32px] px-[clamp(16px,5.7vw,32px)]">
          <div className="flex flex-col items-center gap-[8px] text-center">
            <p className="m-0 font-sans text-[11px] leading-[13px] font-bold tracking-[1.2px] text-[#387440] max-lg:text-[12px]">
              {S.eyebrow}
            </p>
            <h2 className="m-0 font-sans text-[clamp(28px,6vw,35px)] leading-[42px] font-semibold text-[#1c2a21]">
              {S.title[0]}
              <span className="text-[#387440]">{S.title[1]}</span>
            </h2>
            <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">{S.text}</p>
          </div>
          <ul className="m-0 grid list-none grid-cols-3 gap-[10px] p-0">
            {S.stats.map((s) => (
              <li
                key={s.id}
                className={classNames(
                  'flex flex-col items-center gap-[2px] rounded-[16px] border border-solid border-[#1c2a21]/10 px-[8px] py-[12px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)]',
                  STAT[s.tone]
                )}
              >
                <span className="font-sans text-[23px] leading-[29px] font-semibold">
                  {s.value}
                </span>
                <span className="font-sans text-[10px] leading-[12px] font-semibold tracking-[1px] text-[#595959] max-lg:text-[12px]">
                  {s.label}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-[4px]">
            <h3 className="m-0 font-sans text-[11px] leading-[13px] font-bold tracking-[1.2px] text-[#595959] max-lg:text-[12px]">
              {S.nextLabel}
            </h3>
            <ul className="m-0 flex list-none flex-col p-0">
              {S.next.map((n) => {
                const Icon = ICONS[n.icon];
                return (
                  <li key={n.id} className="flex items-center gap-[14px] py-[10px]">
                    <span
                      aria-hidden="true"
                      className="grid size-[38px] shrink-0 place-items-center rounded-[12px] bg-[#ebf1ec] text-[#387440]"
                    >
                      <Icon className="size-[19px]" />
                    </span>
                    <span className="flex min-w-0 flex-col gap-[4px]">
                      <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                        {n.title}
                      </span>
                      <span className="font-sans text-[13px] leading-[18px] text-[#595959]">
                        {n.text}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex flex-col gap-[12px] sm:flex-row">
            <Link
              to={statusTo}
              data-autofocus
              onClick={() => log('status page')}
              className="inline-flex min-h-[56px] flex-1 items-center justify-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[20px] py-[16px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-[#165d3a] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {S.status}
            </Link>
            <Link
              to={statusTo}
              onClick={() => log('next: review')}
              className="inline-flex min-h-[56px] flex-1 items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[20px] py-[16px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-white no-underline shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {S.review}
              <ArrowRightIcon className="size-[20px]" />
            </Link>
          </div>
        </div>
      </div>
    </AgencyDialog>
  );
};

export default InstitutionSubmittedDialog;
