import { classNames } from '../../../utils/classNames.js';
import Button from '../../ui/Button.jsx';
import {
  LearningCoverExcel,
  LearningCoverFigma,
  LearningCoverFrontend,
  LearningCoverInterview,
  LearningCoverPowerBi,
  LearningCoverPython,
  LearningCoverSql,
  LearningCoverStatistics,
  LearningTargetIcon,
  LearningUsersIcon,
} from '../../shared/assets.jsx';

/*
 * Shared building blocks of the My Learning hub (ML-01 / ML-06 / ML-07 / ML-08 / SV-0x).
 * Focused values are the un-prefixed classes (exact Figma "Focused" frames); Playful only through
 * `playful:` variants (wiki/playful-mode.md). Every class string is a literal so Tailwind sees it.
 */

// Heading face: SF Pro Rounded (Focused) / Bricolage Grotesque (Playful).
export const HEAD = 'font-sans font-semibold playful:font-heading';

// Card shells -------------------------------------------------------------------------------
// "Lifted" card (continue card, weekly goal, saved row #1, toast): Focused hairline + soft drop;
// Playful 1.5px ink border + 4px offset "shelf" + soft glow (Figma 7522:389).
export const LIFT =
  'border border-[rgba(28,42,33,0.1)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';
// Plain card (course cards, level, certificates, saved rows 2+, empty state).
export const PLAIN = 'border border-[#e1eae2] bg-white';

// "620 / 800 pts" in Focused, "XP" in Playful.
export const Unit = () => (
  <>
    <span className="playful:hidden">pts</span>
    <span className="hidden playful:inline">XP</span>
  </>
);

// Skeleton / pill sticker -------------------------------------------------------------------
const STICKER_SIZE = {
  sm: 'px-[10px] py-[4px] text-[11px] max-lg:text-[12px] leading-[13.1px]',
  md: 'px-[10px] py-[4px] text-[11.5px] max-lg:text-[12px] leading-[13.7px]',
  lg: 'px-[11px] py-[5px] text-[13px] leading-[15.5px]',
};
const STICKER_TONE = { gold: 'playful:bg-[#ffd86b]', white: 'playful:bg-white' };

// Focused: pale-green pill. Playful: ink-outlined sticker with a 2px shelf, tilted (Figma stickers).
export const HubSticker = ({
  children,
  tone = 'gold',
  size = 'sm',
  rotate = 4,
  icon,
  className,
}) => (
  <span
    style={{ '--hub-rot': `${rotate}deg` }}
    className={classNames(
      'inline-flex shrink-0 items-center gap-[4px] rounded-full bg-[#ebf1ec] font-sans font-bold whitespace-nowrap text-[#1f4d26]',
      'playful:border-[1.2px] playful:border-solid playful:border-[#1c2a21] playful:text-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21] playful:[transform:rotate(var(--hub-rot))]',
      STICKER_SIZE[size],
      STICKER_TONE[tone],
      className
    )}
  >
    {icon}
    {children}
  </span>
);

// Course cover art ------------------------------------------------------------------------
const COVERS = {
  sql: LearningCoverSql,
  frontend: LearningCoverFrontend,
  excel: LearningCoverExcel,
  powerBi: LearningCoverPowerBi,
  figma: LearningCoverFigma,
  statistics: LearningCoverStatistics,
  interview: LearningCoverInterview,
  python: LearningCoverPython,
};

// Figma re-composes the art per frame size: 'thumb' (64px ML-07 picks) draws it at half scale; 'row'
// (150x96 saved rows) at 0.78x and without the squiggle. Default = the native height-normalised art.
const VIEW_BOX = {
  default: '-300 0 600 140',
  thumb: '-600 -70 1200 280',
  row: '-400 -19.55 800 179.1',
};

export const LearningCover = ({ kind, variant = 'default', className }) => {
  const Cover = COVERS[kind];
  if (!Cover) return null;
  return (
    <Cover
      viewBox={VIEW_BOX[variant]}
      bare={variant === 'row'}
      className={classNames('block h-full w-full', className)}
    />
  );
};

// Progress -----------------------------------------------------------------------------------
export const ProgressBar = ({ pct, label }) => (
  <div
    role="progressbar"
    aria-label={label}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={pct}
    className="h-[8px] min-w-0 flex-1 overflow-hidden rounded-full bg-[#e1eae2]"
  >
    <div className="h-full rounded-full bg-[#387440]" style={{ width: `${pct}%` }} />
  </div>
);

// Course chips (gap "+6% on …" / social "2,300 … took this") -------------------------------------
const CHIP_TONE = {
  gap: 'bg-[#ebf1ec] text-[#2d5d33]',
  social: 'bg-[#faf4e8] text-[#967014]',
};

/*
 * `playfulChip` = the Playful frame's own chip treatment (Figma differs per course):
 *   'default'    22px chip (same as Focused)
 *   'ink'        22px chip + 1px ink@35% outline (ML-01 / ML-07 Playful)
 *   'pill-green' 32px GTH chip, no icon (ML-06 Playful)
 *   'pill-white' 32px white GTH chip, no icon (ML-06 Playful)
 */
export const CourseChip = ({ chip, text, size = 'md', playfulChip = 'default' }) => {
  const Icon = chip.kind === 'social' ? LearningUsersIcon : LearningTargetIcon;
  const label = text ?? chip.text;
  const small = size === 'sm';
  const pill = playfulChip === 'pill-green' || playfulChip === 'pill-white';
  return (
    <>
      <span
        className={classNames(
          'inline-flex max-w-full items-center rounded-full font-sans font-semibold',
          small
            ? 'gap-[4px] py-[3px] pl-[6px] pr-[8px] text-[11px] max-lg:text-[12px] leading-[13.1px]'
            : 'gap-[5px] py-[4px] pl-[8px] pr-[10px] text-[11.5px] max-lg:text-[12px] leading-[13.7px]',
          CHIP_TONE[chip.kind],
          playfulChip === 'ink' &&
            'playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)]',
          pill && 'playful:hidden'
        )}
      >
        <Icon className={classNames('shrink-0', small ? 'size-[11px]' : 'size-[12px]')} />
        <span className="min-w-0 truncate">{label}</span>
      </span>
      {pill && (
        <span
          className={classNames(
            'hidden max-w-full items-center rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[15.5px] font-semibold playful:inline-flex playful:h-[32px]',
            playfulChip === 'pill-green'
              ? 'border-[#c1d4c4] bg-[#ebf1ec] text-[#387440]'
              : 'border-[#e1eae2] bg-white text-[#595959]'
          )}
        >
          <span className="min-w-0 truncate">{label}</span>
        </span>
      )}
    </>
  );
};

// "Start course" (full-bleed tertiary button, Figma "Btn · Start course") --------------------------
export const StartButton = ({ children, onClick, className }) => (
  <Button
    variant="tertiary"
    size="sm"
    onClick={onClick}
    className={classNames('w-full !rounded-[14px] !text-[#1c2a21]', className)}
  >
    {children}
  </Button>
);

// Recommended-style course card (ML-01 gap grid: size "sm" / ML-06 grid: size "lg") ---------------
export const RecCard = ({
  course,
  meta,
  size = 'sm',
  playfulChip = 'default',
  buttonLabel,
  onStart,
}) => {
  const large = size === 'lg';
  return (
    <article
      className={classNames(
        'flex min-w-0 flex-col gap-[10px] overflow-hidden rounded-[20px] pb-[16px]',
        PLAIN
      )}
    >
      <div className={classNames('overflow-hidden', large ? 'h-[130px]' : 'h-[140px]')}>
        <LearningCover kind={course.cover} />
      </div>
      <div className="flex min-w-0 flex-col items-start gap-[6px] px-[16px]">
        <h3
          className={classNames(
            'm-0 max-w-full line-clamp-2 text-[#1c2a21]',
            HEAD,
            large ? 'text-[20px] leading-[25px]' : 'text-[19px] leading-[23.8px]'
          )}
        >
          {course.title}
        </h3>
        <p className="m-0 max-w-full truncate font-sans text-[12.5px] leading-[14.9px] text-[#737373]">
          {meta}
        </p>
        <CourseChip chip={course.chip} playfulChip={playfulChip} />
      </div>
      <StartButton onClick={onStart}>{buttonLabel}</StartButton>
    </article>
  );
};
