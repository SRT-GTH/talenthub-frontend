import { classNames } from '../../../../utils/classNames.js';
import { CircleStarIcon } from './circleIcons.jsx';

/*
 * CircleLevelChip — Figma `Level` ("Lv 7" + star): Focused = white pill, 1px #e7e7e7, green label; Playful = yellow sticker pill with
 * a 1.2px ink border, 2px hard shadow and a -6deg tilt. Props: level (number), className.
 */
const CircleLevelChip = ({ level, className }) => (
  <span
    className={classNames(
      'inline-flex shrink-0 items-center gap-[3px] rounded-full border border-solid border-[#e7e7e7] bg-white px-[8px] py-[3px] font-sans text-[11px] font-bold leading-[13px] text-[#387440] max-lg:text-[12px]',
      'playful:-rotate-6 playful:border-[1.2px] playful:border-[#1c2a21] playful:bg-[#ffd86b] playful:text-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]',
      className
    )}
  >
    <CircleStarIcon className="size-[12px]" />
    {`Lv ${level}`}
  </span>
);

export default CircleLevelChip;
