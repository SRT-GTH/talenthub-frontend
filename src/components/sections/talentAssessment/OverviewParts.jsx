import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { HEADING } from '../talentSkillsLab/HubParts.jsx';
import { HubArrowRightIcon } from '../talentSkillsLab/HubIcons.jsx';
import { AssessCheckFillIcon } from './AssessmentIcons.jsx';
import { OV_FOCUS } from './overviewShared.js';

const log = debug('OverviewParts');

/*
 * OverviewParts — small pieces shared by the My Assessment overview screens (Figma MA-01 … MA-08).
 *   OvHeader     page title + sticker + subtitle (+ right-hand action)  · props title, sticker, subtitle, action
 *   OvChip       the pill chips of the overview (Done / Completed / 9 skills · 7 verified / Last 90 days / Not started /
 *                affinity): Focused 22px, Playful 32px (the Playful frames draw the 32px `Chip` component)
 *                tone: done | soft | quiet | outline | affinity
 *   OvCardHead   32px tile + title (+ spacer) + trailing node (+ link)
 *   OvLink       green 14px link, arrow unless `arrow={false}` (router Link when `to`, button otherwise)
 *   OvSkeleton   loading block (#edede5)
 */

export const OvSticker = ({ children }) => (
  <span
    className={classNames(
      'inline-flex items-center rounded-full bg-[#ebf1ec] px-[11px] py-[5px] font-sans text-[13px] font-bold leading-[16px] text-[#1f4a2b]',
      'playful:rotate-[6deg] playful:border-[1.2px] playful:border-solid playful:border-[#1c2a21] playful:bg-[#ffd86b] playful:leading-[22px] playful:text-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]'
    )}
  >
    {children}
  </span>
);

export const OvHeader = ({ title, sticker, subtitle, action }) => (
  <div className="flex flex-wrap items-start justify-between gap-x-[24px] gap-y-[12px]">
    <div className="flex min-w-0 flex-col gap-[3px]">
      <div className="flex flex-wrap items-center gap-[12px]">
        <h1
          className={classNames(
            HEADING,
            'text-[clamp(26px,1.97vw,34px)] leading-[1.2] tracking-[-0.02em]'
          )}
        >
          {title}
        </h1>
        {sticker ? <OvSticker>{sticker}</OvSticker> : null}
      </div>
      <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#595959] max-sm:text-[14px] max-sm:leading-[20px]">
        {subtitle}
      </p>
    </div>
    {action}
  </div>
);

const CHIP_BASE =
  'inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-solid font-sans font-semibold';
const CHIP_TONE = {
  /* "Done": Focused soft green with the dark-green label + check; Playful = Chip with a c1d4c4 hairline. */
  done: 'h-[22px] gap-[5px] border-transparent bg-[#ebf1ec] px-[10px] text-[12px] leading-[14px] text-[#2a5730] playful:h-[32px] playful:gap-[6px] playful:border-[#c1d4c4] playful:px-[14px] playful:text-[13px] playful:leading-[16px] playful:text-[#387440]',
  soft: 'h-[22px] gap-[4px] border-transparent bg-[#ebf1ec] px-[10px] text-[12px] leading-[14px] text-[#387440] playful:h-[32px] playful:gap-[6px] playful:border-[#c1d4c4] playful:px-[14px] playful:text-[13px] playful:leading-[16px]',
  quiet:
    'h-[22px] gap-[5px] border-transparent bg-[#f8f8f4] px-[10px] text-[12px] leading-[14px] text-[#595959] playful:h-[32px] playful:gap-[6px] playful:border-[#e1eae2] playful:bg-white playful:px-[14px] playful:text-[13px] playful:leading-[16px]',
  /* Same 32px chip in both styles. */
  outline:
    'h-[32px] gap-[6px] border-[#e1eae2] bg-white px-[14px] text-[13px] leading-[16px] text-[#595959]',
  affinity:
    'h-[32px] gap-[6px] border-[#c1d4c4] bg-[#ebf1ec] px-[14px] text-[13px] leading-[16px] text-[#387440]',
};

export const OvChip = ({ tone = 'soft', check = false, className, children }) => (
  <span className={classNames(CHIP_BASE, CHIP_TONE[tone], className)}>
    {check ? <AssessCheckFillIcon className="size-[13px] shrink-0 playful:size-[14px]" /> : null}
    {children}
  </span>
);

export const OvCardHead = ({ icon, title, titleId, trailing }) => (
  <div className="flex items-center gap-[10px]">
    <span
      aria-hidden="true"
      className="flex size-[32px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#387440]"
    >
      {icon}
    </span>
    <h2
      id={titleId}
      className="m-0 min-w-0 font-sans text-[17px] font-semibold leading-[20px] text-[#1c2a21]"
    >
      {title}
    </h2>
    <span aria-hidden="true" className="min-w-0 flex-1" />
    {trailing}
  </div>
);

export const OvLink = ({ to, onClick, arrow = true, children, className }) => {
  const cls = classNames(
    'inline-flex shrink-0 cursor-pointer items-center gap-[4px] whitespace-nowrap border-0 bg-transparent p-0 font-sans text-[14px] font-semibold leading-[17px] text-[#387440] no-underline max-lg:min-h-[32px]',
    OV_FOCUS,
    className
  );
  const body = (
    <>
      {children}
      {arrow ? <HubArrowRightIcon className="size-[16px]" /> : null}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={cls} onClick={() => log('link ->', to)}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick}>
      {body}
    </button>
  );
};

export const OvSkeleton = ({ className }) => (
  <span aria-hidden="true" className={classNames('block rounded-[8px] bg-[#edede5]', className)} />
);
