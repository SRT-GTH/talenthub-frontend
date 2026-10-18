import { classNames } from '../../../utils/classNames.js';
import {
  ExploreCoverAgribusiness,
  ExploreCoverExcel,
  ExploreCoverFigma,
  ExploreCoverInterview,
  ExploreCoverPowerBi,
  ExploreCoverPython,
  ExploreCoverSpeaker,
  ExploreCoverSql,
  ExploreCoverStatistics,
  ExploreTargetIcon,
  ExploreUsersIcon,
} from '../../shared/assets.jsx';
import notifHeadSparkle from '../../../assets/notifications/icons/head-sparkle.svg';
import notifHeadFlame from '../../../assets/notifications/icons/head-flame.svg';
import headDoodleGold from '../../../assets/notifications/icons/head-doodle-gold.svg';
import headDoodleGreen from '../../../assets/notifications/icons/head-doodle-green.svg';
import headDoodleSquiggle from '../../../assets/notifications/icons/head-doodle-squiggle.svg';
import headDoodleRing from '../../../assets/notifications/icons/head-doodle-ring.svg';
import { EXPLORE_HEADER } from './talentLearningExploreData.js';

/* Shared building blocks for the Explore courses screens (EX-01..EX-04). */

const COVERS = {
  PowerBi: ExploreCoverPowerBi,
  Figma: ExploreCoverFigma,
  Python: ExploreCoverPython,
  Interview: ExploreCoverInterview,
  Agribusiness: ExploreCoverAgribusiness,
  Speaker: ExploreCoverSpeaker,
  Sql: ExploreCoverSql,
  Excel: ExploreCoverExcel,
  Statistics: ExploreCoverStatistics,
};

export const CourseCover = ({ kind, className = '' }) => {
  const Cover = COVERS[kind] ?? ExploreCoverPowerBi;
  return <Cover className={classNames('block size-full', className)} />;
};

export const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

/* Sticker: mint pill in Focused; yellow ink-bordered tilted sticker in Playful. */
export const Sticker = ({ children, size = 'md', tilt = 3, className = '' }) => (
  <span
    className={classNames(
      'inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-[#ebf1ec] font-sans font-bold text-[#1f4d26]',
      'playful:[transform:rotate(var(--ex-tilt))] playful:border-[1.2px] playful:border-solid playful:border-[#1c2a21] playful:text-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]',
      size === 'lg' &&
        'px-[11px] py-[5px] text-[13px] leading-[15.5px] playful:bg-[#ffd86b] playful:leading-[21px]',
      size === 'md' &&
        'gap-[4px] px-[10px] py-[4px] text-[11px] max-lg:text-[12px] leading-[13.1px] playful:bg-white',
      size === 'sm' &&
        'gap-[4px] px-[10px] py-[4px] text-[10.5px] max-lg:text-[12px] leading-[12.5px] playful:bg-[#ffd86b]',
      className
    )}
    style={{ '--ex-tilt': `-${tilt}deg` }}
  >
    {children}
  </span>
);

/* Course chip: Focused = small icon pill (target for matches, users for social proof);
 * Playful = 32px pill without icon (mint w/ green border for matches, white for social proof). */
export const CourseChip = ({ chip }) => {
  const match = chip.tone === 'match';
  return (
    <span
      className={classNames(
        'inline-flex max-w-full items-center gap-[5px] self-start rounded-full py-[4px] pl-[8px] pr-[10px] font-sans text-[11.5px] max-lg:text-[12px] font-semibold leading-[13.7px]',
        match ? 'bg-[#ebf1ec] text-[#2d5d33]' : 'bg-[#faf4e8] text-[#967014]',
        'playful:h-[32px] playful:gap-[6px] playful:border playful:border-solid playful:px-[14px] playful:py-0 playful:text-[13px] playful:leading-[15.5px]',
        match
          ? 'playful:border-[#c1d4c4] playful:bg-[#ebf1ec] playful:text-[#387440]'
          : 'playful:border-[#e1eae2] playful:bg-white playful:text-[#595959]'
      )}
    >
      <span className="shrink-0 playful:hidden" aria-hidden="true">
        {match ? <ExploreTargetIcon /> : <ExploreUsersIcon />}
      </span>
      <span className="truncate">{chip.label}</span>
    </span>
  );
};

export const CourseCard = ({ course, onOpen }) => (
  <button
    type="button"
    onClick={() => onOpen(course)}
    className={classNames(
      'flex w-full min-w-0 cursor-pointer flex-col gap-[10px] overflow-hidden rounded-[20px] border border-solid border-[#e1eae2] bg-white pb-[16px] text-left transition-colors hover:border-[#c1d4c4]',
      FOCUS_RING
    )}
  >
    <span className="block h-[120px] w-full overflow-hidden">
      <CourseCover kind={course.cover} />
    </span>
    <span className="flex min-w-0 flex-col gap-[6px] px-[16px]">
      <span className="font-sans text-[19px] font-semibold leading-[23.8px] text-[#1c2a21] playful:font-heading">
        {course.title}
      </span>
      <span className="font-sans text-[12.5px] leading-[14.9px] text-[#737373]">{course.meta}</span>
      <CourseChip chip={course.chip} />
    </span>
  </button>
);

export const CardGrid = ({ children, cols = 'lg:grid-cols-3', gap = 'gap-[20px]' }) => (
  <div className={classNames('grid grid-cols-1 sm:grid-cols-2', cols, gap)}>{children}</div>
);

/* "GTH · Messages header art" — Playful decoration at the right of the page header (xl+). */
export const ExploreHeaderArt = () => (
  <div className="relative hidden h-[84px] w-[600px] shrink-0 xl:playful:block" aria-hidden="true">
    <span className="absolute left-0 top-[30px] flex">
      {EXPLORE_HEADER.faces.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="-ml-[12px] size-[40px] rounded-full border-[3px] border-solid border-white object-cover first:ml-0"
          style={{ zIndex: 4 - i }}
        />
      ))}
    </span>
    <span className="absolute left-[136px] top-[36px] inline-flex items-center gap-[6px] rounded-full border border-solid border-[rgba(0,82,43,0.12)] bg-white px-[12px] py-[7px] font-sans text-[12px] leading-[14px] tracking-[0.2px] text-[#1c2a21] shadow-[0_1px_2px_rgba(28,42,33,0.06)]">
      <span className="size-[8px] rounded-full bg-[#349643]" />
      {EXPLORE_HEADER.inProgress}
    </span>
    <span
      className="absolute left-[337px] top-[2px] inline-flex items-center gap-[6px] rounded-full bg-[#387440] px-[14px] py-[8px] font-sans text-[13px] font-medium leading-[16px] tracking-[0.2px] text-white shadow-[0_4px_0_#224626]"
      style={{ transform: 'rotate(2deg)' }}
    >
      <img src={notifHeadSparkle} alt="" className="size-[15px]" />
      {EXPLORE_HEADER.sticker}
    </span>
    <span
      className="absolute left-[430px] top-[36px] inline-flex items-center gap-[6px] rounded-full border-[1.5px] border-solid border-[#c8951a] bg-[#faf4e8] px-[12px] py-[7px] font-sans text-[12px] font-semibold leading-[14px] tracking-[0.2px] text-[#c8951a] shadow-[0_3px_0_rgba(200,149,26,0.45)]"
      style={{ transform: 'rotate(2deg)' }}
    >
      <img src={notifHeadFlame} alt="" className="size-[15px]" />
      {EXPLORE_HEADER.xp}
    </span>
    <img src={headDoodleGold} alt="" className="absolute left-[574px] top-0 size-[22px]" />
    <img src={headDoodleGreen} alt="" className="absolute left-[316px] top-[46px] size-[12px]" />
    <img
      src={headDoodleSquiggle}
      alt=""
      className="absolute left-[298px] top-[10px] h-[20px] w-[48px]"
    />
    <img src={headDoodleRing} alt="" className="absolute left-[250px] top-[6px] size-[14px]" />
  </div>
);

export const ExploreHeader = ({ title, count, subtitle }) => (
  <div className="flex items-center justify-between gap-[24px]">
    <div className="flex min-w-0 flex-col gap-[3px]">
      <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[4px]">
        <h1 className="m-0 font-sans text-[clamp(26px,1.97vw,34px)] font-semibold leading-[1.2] tracking-[-0.02em] text-[#1c2a21] playful:font-heading">
          {title}
        </h1>
        <Sticker size="lg" tilt={6}>
          {count}
        </Sticker>
      </div>
      <p className="m-0 font-sans text-[clamp(14px,0.93vw,16px)] leading-[1.5] tracking-[0.2px] text-[#999999]">
        {subtitle}
      </p>
    </div>
    <ExploreHeaderArt />
  </div>
);

const LABEL_GRADIENT = 'linear-gradient(181.7deg, #fef1e7 0%, #e8f2ed 20.192%)';

/* Green / white shelf buttons (Figma "Button · View course", "Request this course", "Ask Career Buddy"). */
export const ShelfButton = ({
  tone = 'primary',
  size = 'md',
  onClick,
  children,
  className = '',
}) => (
  <button
    type="button"
    onClick={onClick}
    className={classNames(
      'inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap border-2 border-solid font-sans text-[16px] font-bold leading-[24px] tracking-[0.1px] transition-[transform,box-shadow] active:translate-y-[3px] active:shadow-[0_1px_0_#224626]',
      size === 'md' ? 'rounded-[10px] px-[18px] py-[12px]' : 'rounded-[14px] px-[34px] py-[16px]',
      tone === 'primary'
        ? 'border-[#2a5730] bg-[#387440] shadow-[0_4px_0_#224626]'
        : 'border-[rgba(28,42,33,0.3)] bg-white text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] active:shadow-[0_1px_0_rgba(17,17,17,0.25)]',
      FOCUS_RING,
      className
    )}
  >
    {tone === 'primary' ? (
      <span className="bg-clip-text text-transparent" style={{ backgroundImage: LABEL_GRADIENT }}>
        {children}
      </span>
    ) : (
      children
    )}
  </button>
);
