import { classNames } from '../../../../utils/classNames.js';
import { CIRCLE_COPY as COPY } from './circleData.js';
import { CircleVerifiedIcon } from './circleIcons.jsx';

/*
 * CircleMentorChip — Figma `Verified mentor` (#e8f0fe, #1e4fd8, r99, p2/8/2/6, verified glyph 13px, 11/600). Props: className.
 */
const CircleMentorChip = ({ className }) => (
  <span
    className={classNames(
      'inline-flex shrink-0 items-center gap-[4px] whitespace-nowrap rounded-full bg-[#e8f0fe] py-[2px] pl-[6px] pr-[8px] font-sans text-[11px] font-semibold leading-[13px] text-[#1e4fd8] max-lg:text-[12px]',
      className
    )}
  >
    <CircleVerifiedIcon className="size-[13px]" />
    {COPY.verifiedMentor}
  </span>
);

export default CircleMentorChip;
