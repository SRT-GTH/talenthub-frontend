import { classNames } from '../../../../utils/classNames.js';
import { CIRCLE_COPY as COPY } from './circleData.js';
import {
  CircleBriefcaseIcon,
  CircleCodeIcon,
  CircleGlobeIcon,
  CircleMortarboardIcon,
  CircleUsersIcon,
} from './circleIcons.jsx';
import { CARD, HEADING } from './circleStyles.js';

const ICONS = {
  community: CircleUsersIcon,
  skill: CircleCodeIcon,
  region: CircleGlobeIcon,
  school: CircleMortarboardIcon,
  interest: CircleBriefcaseIcon,
};

/*
 * CircleInCommonCard — Figma `In common` right-rail card (NW-06): "You have in common" 17/20, rows of a 30px #ebf1ec icon tile +
 * label 13/600 + note 12 (Data Science Ghana · Both members, Design track · Skills Lab, Product design · Shared interest).
 * Props: items ([{ kind, label, note }]).
 */
const CircleInCommonCard = ({ items }) => (
  <section className={classNames(CARD, 'flex flex-col gap-[24px] p-[18px]')}>
    <h2 className={classNames(HEADING, 'text-[17px] leading-[20px]')}>{COPY.inCommonTitle}</h2>
    <ul className="m-0 flex list-none flex-col gap-[24px] p-0">
      {items.map((item) => {
        const Glyph = ICONS[item.kind] ?? CircleBriefcaseIcon;
        return (
          <li key={item.label} className="flex items-center gap-[10px]">
            <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#387440]">
              <Glyph className="size-[16px]" />
            </span>
            <span className="flex min-w-0 flex-col gap-[4px]">
              <span className="font-sans text-[13px] font-semibold leading-[16px] text-[#1c2a21] max-lg:text-[14px]">
                {item.label}
              </span>
              <span className="font-sans text-[12px] leading-[14px] text-[#737373] max-lg:text-[13px]">
                {item.note}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  </section>
);

export default CircleInCommonCard;
