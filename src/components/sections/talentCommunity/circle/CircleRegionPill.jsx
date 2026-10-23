import { classNames } from '../../../../utils/classNames.js';
import { CircleGlobeIcon } from './circleIcons.jsx';

/* CircleRegionPill — Figma `Region` on a card photo: white @92%, r99, p3/8/3/6, globe 12px + town 11/600. Props: town, className. */
const CircleRegionPill = ({ town, className }) => (
  <span
    className={classNames(
      'inline-flex items-center gap-[4px] rounded-full bg-[rgba(255,255,255,0.92)] py-[3px] pl-[6px] pr-[8px] font-sans text-[11px] font-semibold leading-[13px] text-[#1c2a21] max-lg:text-[12px]',
      className
    )}
  >
    <CircleGlobeIcon className="size-[12px]" />
    {town}
  </span>
);

export default CircleRegionPill;
