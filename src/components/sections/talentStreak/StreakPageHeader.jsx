import { useEffect } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { STREAK_PAGE_COPY } from './talentStreakData.js';
import flameSm from '../../../assets/talent-streak/page/flame-sm.svg';
import headSparkle from '../../../assets/notifications/icons/head-sparkle.svg';
import headFlame from '../../../assets/notifications/icons/head-flame.svg';
import headDoodleGold from '../../../assets/notifications/icons/head-doodle-gold.svg';
import headDoodleGreen from '../../../assets/notifications/icons/head-doodle-green.svg';
import headDoodleSquiggle from '../../../assets/notifications/icons/head-doodle-squiggle.svg';
import headDoodleRing from '../../../assets/notifications/icons/head-doodle-ring.svg';
import face1 from '../../../assets/notifications/avatars/face-1.png';
import face2 from '../../../assets/notifications/avatars/face-2.png';
import face3 from '../../../assets/notifications/avatars/face-3.png';
import face4 from '../../../assets/notifications/avatars/face-4.png';

const log = debug('StreakPageHeader');
const FACES = [face1, face2, face3, face4];

/*
 * Page header (Figma "Your streak" S-07 7534:1061, Focused 8110:24751): Bricolage title + a "N days"
 * sticker (Playful: yellow, ink border + hard shadow, flame; Focused: flat mint, no flame) over the 16px
 * #999 subtitle. Right side: the "GTH · Messages header" decoration — Playful only (hidden in the Focused
 * frames, instance opacity 0), same geometry as /notifications.
 * Props: { sticker } e.g. "12 days".
 */
const HeaderDecor = () => (
  <div
    className="relative hidden h-[84px] w-[600px] shrink-0 xl:playful:block"
    aria-hidden="true"
    data-doodle=""
  >
    <span className="absolute left-0 top-[30px] flex">
      {FACES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="-ml-[12px] size-[40px] rounded-full border-[3px] border-solid border-white object-cover first:ml-0"
          style={{ zIndex: 4 - i }}
        />
      ))}
    </span>
    <span className="absolute left-[136px] top-[36px] inline-flex items-center gap-[6px] whitespace-nowrap rounded-full border border-solid border-[rgba(0,82,43,0.12)] bg-white px-[12px] py-[7px] font-sans text-[12px] leading-[14px] tracking-[0.2px] text-[#1c2a21] shadow-[0_1px_2px_rgba(28,42,33,0.06)]">
      <span className="size-[8px] rounded-full bg-[#349643]" />
      {STREAK_PAGE_COPY.header.inbox}
    </span>
    <span
      className="absolute left-[337px] top-[2px] inline-flex items-center gap-[6px] whitespace-nowrap rounded-full bg-[#387440] px-[14px] py-[8px] font-sans text-[13px] font-medium leading-[16px] tracking-[0.2px] text-white shadow-[0_4px_0_#224626]"
      style={{ transform: 'rotate(2deg)' }}
    >
      <img src={headSparkle} alt="" className="size-[15px]" />
      {STREAK_PAGE_COPY.header.sticker}
    </span>
    <span
      className="absolute left-[430px] top-[36px] inline-flex items-center gap-[6px] whitespace-nowrap rounded-full border-[1.5px] border-solid border-[#c8951a] bg-[#faf4e8] px-[12px] py-[7px] font-sans text-[12px] font-semibold leading-[14px] tracking-[0.2px] text-[#c8951a] shadow-[0_3px_0_rgba(200,149,26,0.45)]"
      style={{ transform: 'rotate(2deg)' }}
    >
      <img src={headFlame} alt="" className="size-[15px]" />
      {STREAK_PAGE_COPY.header.week}
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

const StreakPageHeader = (props) => {
  const sticker = props.sticker;
  useEffect(() => {
    log('mount', { sticker });
  }, [sticker]);
  return (
    <div className="flex items-start justify-between gap-[24px]">
      <div className="flex min-w-0 flex-col gap-[3px]">
        <div className="flex flex-wrap items-center gap-[12px]">
          <h1 className="m-0 font-sans text-[clamp(26px,1.97vw,34px)] font-semibold leading-[1.2] tracking-[-0.02em] text-[#1c2a21] playful:font-heading">
            {STREAK_PAGE_COPY.title}
          </h1>
          <span
            className={classNames(
              'inline-flex items-center gap-[4px] rounded-full bg-[#ebf1ec] px-[11px] py-[5px] font-sans text-[13px] font-bold leading-[16px] text-[#1f4d26]',
              'playful:border-[1.2px] playful:border-solid playful:border-[#1c2a21] playful:bg-[#ffd86b] playful:text-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21] playful:py-[7px] playful:leading-[21px]'
            )}
          >
            <img
              src={flameSm}
              alt=""
              aria-hidden="true"
              className="hidden size-[16px] playful:block"
            />
            {sticker}
          </span>
        </div>
        <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#999999] max-sm:text-[14px] max-sm:leading-[20px]">
          {STREAK_PAGE_COPY.subtitle}
        </p>
      </div>
      <HeaderDecor />
    </div>
  );
};

export default StreakPageHeader;
