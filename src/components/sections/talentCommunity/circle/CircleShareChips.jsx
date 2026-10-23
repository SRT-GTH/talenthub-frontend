import { classNames } from '../../../../utils/classNames.js';
import { CIRCLE_COPY as COPY } from './circleData.js';
import {
  CircleBriefcaseIcon,
  CircleCodeIcon,
  CircleGlobeIcon,
  CircleMortarboardIcon,
  CircleUsersIcon,
} from './circleIcons.jsx';

/*
 * CircleShareChips — Figma `You share`: the "YOU SHARE" label (10/700, 0.6 tracking, #9a9a98) and the chips of what the talent has
 * in common with the person (#ebf1ec, r8, 11/600 #387440, 12px icon; Playful adds a 1px ink@.25 outline).
 * Props: shares ([{ kind, label }]), className. The icon follows the kind: community, skill, region, school, interest.
 */
const ICONS = {
  community: CircleUsersIcon,
  skill: CircleCodeIcon,
  region: CircleGlobeIcon,
  school: CircleMortarboardIcon,
  interest: CircleBriefcaseIcon,
};

const CircleShareChips = ({ shares, className }) => (
  <div className={classNames('flex flex-col gap-[6px]', className)}>
    <span className="font-sans text-[10px] font-bold uppercase leading-[12px] tracking-[0.6px] text-[#9a9a98] max-lg:text-[12px] max-lg:leading-[14px]">
      {COPY.youShare}
    </span>
    <ul className="m-0 flex list-none flex-wrap gap-[6px] p-0">
      {shares.map((share) => {
        const Glyph = ICONS[share.kind] ?? CircleBriefcaseIcon;
        return (
          <li
            key={share.label}
            className="inline-flex items-center gap-[5px] rounded-[8px] bg-[#ebf1ec] py-[4px] pl-[6px] pr-[8px] font-sans text-[11px] font-semibold leading-[13px] text-[#387440] max-lg:text-[12px] max-lg:leading-[14px] playful:border playful:border-solid playful:border-[rgba(28,42,33,0.25)]"
          >
            <Glyph className="size-[12px]" />
            {share.label}
          </li>
        );
      })}
    </ul>
  </div>
);

export default CircleShareChips;
