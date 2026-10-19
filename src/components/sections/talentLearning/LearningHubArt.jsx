import {
  LearningDoodleRing,
  LearningDoodleSparkleGold,
  LearningDoodleSparkleGreen,
  LearningDoodleSquiggle,
  LearningHeaderFlameIcon,
  LearningHeaderSparkleIcon,
} from '../../shared/assets.jsx';
import { HEADER } from './talentLearningHubData.js';

/*
 * "GTH · Messages header art" as used in the Playful My Learning frames (7522:146, 600x84, right
 * aligned in the title row): four overlapping faces, an inbox label, two tilted stickers and four
 * doodles. Hidden in Focused (the Focused frames set the instance to opacity 0) and below xl, where
 * the title row has no room for it. Decorative only (aria-hidden). Positions are Figma offsets from
 * the art's top-left.
 */
const LearningHubArt = ({ inbox = HEADER.art.inbox }) => (
  <div
    aria-hidden="true"
    className="relative -mt-[2px] hidden h-[84px] w-[600px] shrink-0 select-none xl:playful:block"
  >
    <span className="absolute top-[30px] left-0 flex">
      {HEADER.art.faces.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="-ml-[12px] size-[40px] rounded-full object-cover shadow-[0_0_0_3px_#ffffff] first:ml-0"
          style={{ zIndex: i + 1 }}
        />
      ))}
    </span>

    <span className="absolute top-[36px] left-[136px] inline-flex items-center gap-[6px] rounded-full border border-solid border-[rgba(0,82,43,0.12)] bg-white px-[12px] py-[7px] font-sans text-[12px] leading-[14.3px] tracking-[0.2px] whitespace-nowrap text-[#1c2a21] shadow-[0_6px_14px_rgba(31,69,38,0.16)]">
      <span className="size-[8px] rounded-full bg-[#349643]" />
      {inbox}
    </span>

    <span className="absolute top-[2px] left-[298px]">
      <LearningDoodleSquiggle />
    </span>
    <span className="absolute top-[6px] left-[250px]">
      <LearningDoodleRing />
    </span>
    <span className="absolute top-[46px] left-[316px]">
      <LearningDoodleSparkleGreen />
    </span>
    <span className="absolute top-0 left-[574px]">
      <LearningDoodleSparkleGold />
    </span>

    <span className="absolute top-[10px] left-[338px] inline-flex rotate-[5deg] items-center gap-[6px] rounded-full bg-[#387440] px-[14px] py-[8px] font-sans text-[13px] leading-[15.5px] font-medium tracking-[0.2px] whitespace-nowrap text-white shadow-[0_6px_14px_rgba(31,69,38,0.16)]">
      <LearningHeaderSparkleIcon className="size-[15.2px]" />
      {HEADER.art.sticker}
    </span>

    <span className="absolute top-[41px] left-[431px] inline-flex -rotate-[4deg] items-center gap-[6px] rounded-full border-[1.5px] border-solid border-[#c8951a] bg-[#faf4e8] px-[12px] py-[7px] font-sans text-[12px] leading-[14.3px] font-semibold tracking-[0.2px] whitespace-nowrap text-[#c8951a] shadow-[0_6px_14px_rgba(31,69,38,0.16)]">
      <LearningHeaderFlameIcon className="size-[14.9px]" />
      {HEADER.art.xp}
    </span>
  </div>
);

export default LearningHubArt;
