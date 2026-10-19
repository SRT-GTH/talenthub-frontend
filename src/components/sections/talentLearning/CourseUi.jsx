import { classNames } from '../../../utils/classNames.js';
import { ArrowLeftIcon, CourseCertSealIcon, ShareStreakFlameIcon } from '../../shared/assets.jsx';
import { CERT_HEAD, CERT_LEAD, CERT_NAME } from './talentLearningCourseData.js';

/*
 * CourseUi — building blocks shared by the Course agent's screens (ML-02..05, QC-01..05).
 * Focused is the default; Playful is layered with `playful:` variants only (wiki/playful-mode.md).
 * Every value is the exact Figma value from the Focused / Playful frames.
 */

export const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

// Heading face: SF Pro Rounded in Focused, Bricolage Grotesque in Playful.
export const HEAD = 'font-sans font-semibold playful:font-heading';

// Hero-level card: hairline + soft drop in Focused, 1.5px ink border + 4px shelf in Playful.
export const CARD_INK =
  'border border-[rgba(28,42,33,0.1)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';
// Quiet white card (same in both styles).
export const CARD_SOFT = 'border border-[#e1eae2] bg-white';

// "+150 pts" in Focused, "+150 XP" in Playful.
export const DualText = ({ focused, playful }) => (
  <>
    <span className="playful:hidden">{focused}</span>
    <span className="hidden playful:inline">{playful}</span>
  </>
);

// Soft pill in Focused -> rotated ink sticker in Playful (Figma `sticker`).
const STICKER_TONE = {
  green: 'bg-[#ebf1ec] text-[#1f4d26] playful:bg-[#ffd86b]',
  white: 'bg-[#ebf1ec] text-[#1f4d26] playful:bg-white',
};
export const CourseSticker = ({
  children,
  tone = 'green',
  rotate = 'playful:rotate-[4deg]',
  className,
  textClass = 'text-[11.5px] max-lg:text-[12px]',
}) => (
  <span
    className={classNames(
      'inline-flex shrink-0 items-center justify-center rounded-full px-[10px] py-[4px] leading-[13.7px] font-bold whitespace-nowrap',
      'playful:border-[1.2px] playful:border-[#1c2a21] playful:text-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]',
      textClass,
      STICKER_TONE[tone],
      rotate,
      className
    )}
  >
    {children}
  </span>
);

// Small ink shelf under a pill-shaped control is not in Figma for these; plain 38px round icon button.
export const BackRow = ({ label, crumb, onClick }) => (
  <div className="flex min-w-0 items-center gap-[8px]">
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'inline-flex shrink-0 cursor-pointer items-center gap-[8px] text-[14px] leading-[16.7px] font-semibold whitespace-nowrap text-[#2d5d33]',
        FOCUS
      )}
    >
      <ArrowLeftIcon className="size-[16px]" />
      {label}
    </button>
    <span className="min-w-0 truncate text-[13px] leading-[15.5px] text-[#737373]">{crumb}</span>
  </div>
);

export const Flame = ({ className }) => <ShareStreakFlameIcon className={className} />;

/*
 * Certificate card (Figma `certificate · …`): cream paper, seal top-right, name, course, date + link.
 * Playful tilts the card 2deg only where the Figma frame does (`tilt`).
 */
export const CertCard = ({ course, date, link, tilt, children, className, name = CERT_NAME }) => (
  <div
    className={classNames(
      'relative flex flex-col gap-[8px] rounded-[16px] bg-[#fffefc] px-[20px] py-[18px]',
      CARD_INK,
      tilt,
      className
    )}
  >
    <div className="flex min-h-[40px] items-center gap-[8px]">
      <span className="min-w-0 flex-1 truncate text-[10px] max-lg:text-[12px] leading-[11.9px] font-bold text-[#2d5d33]">
        {CERT_HEAD}
      </span>
      <CourseCertSealIcon className="size-[40px] shrink-0" />
    </div>
    <span className="text-[11.5px] max-lg:text-[12px] leading-[13.7px] text-[#737373]">
      {CERT_LEAD}
    </span>
    <span className={classNames(HEAD, 'text-[22px] leading-[27.5px] text-[#1c2a21]')}>{name}</span>
    <span className="text-[12.5px] leading-[14.9px] font-semibold text-[#1c2a21]">
      completed {course}
    </span>
    <div className="flex items-center gap-[8px] text-[11px] max-lg:text-[12px] leading-[13.1px] font-medium">
      <span className="min-w-0 flex-1 truncate text-[#737373]">{date}</span>
      <span className="shrink-0 text-[#2d5d33]">{link}</span>
    </div>
    {children}
  </div>
);
