import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { CIRCLE_COPY as COPY } from './circleData.js';
import { CircleSwitchCircleIcon, CircleSwitchCommunitiesIcon } from './circleIcons.jsx';
import CircleButton from './CircleButton.jsx';
import { CIRCLE_HREF, COMMUNITY_HREF, CREATE_COMMUNITY_HREF, withRail } from './circleState.js';
import { FOCUS_RING } from './circleStyles.js';

/*
 * CircleSwitch — Figma `GTH · Community switch` (Focused 9205:539458 · Playful 9205:539441): the segmented control at the top of
 * Community that swaps "Communities" (groups) and "My circle" (people). Flow step 2: "At the top of Community, tap My circle."
 *   Focused: #f1f2f0 tray r12 p4, white selected segment (r9, soft shadow), 14px labels.
 *   Playful: white pill with 1.5px ink border + 3px shelf, selected segment = green pill with white label + yellow count, 15px.
 * Props: active ('communities' | 'circle'), count (people waiting to link up), rail ('collapsed' keeps the rail in the links),
 * showCreate (Communities view only: the "Create a community" button the flow frame draws at the right of this row).
 * Navigation = real links: /community (Communities, the default) and /community?view=circle (My circle).
 */
const Segment = ({ to, selected, icon, children, count }) => {
  const Icon = icon;
  return (
    <Link
      to={to}
      aria-current={selected ? 'page' : undefined}
      className={classNames(
        'inline-flex h-[34px] items-center gap-[8px] rounded-[9px] px-[16px] font-sans text-[14px] leading-[17px] no-underline max-lg:min-h-[34px]',
        'playful:h-[38px] playful:rounded-full playful:px-[18px] playful:text-[15px]',
        selected
          ? 'bg-white font-semibold text-[#1c2a21] shadow-[0_1px_3px_rgba(28,42,33,0.12)] playful:bg-[#387440] playful:text-white playful:shadow-none'
          : 'font-medium text-[#595959] playful:font-semibold playful:text-[#1c2a21]',
        count !== undefined && 'pr-[12px] playful:pr-[12px]',
        FOCUS_RING
      )}
    >
      <Icon className="size-[18px]" />
      {children}
      {count !== undefined && (
        <span
          className={classNames(
            'inline-flex h-[18px] min-w-[22px] items-center justify-center rounded-full px-[7px] text-[12px] font-bold leading-[14px]',
            selected
              ? 'bg-[#387440] text-white playful:bg-[#ffd86b] playful:text-[#1c2a21]'
              : 'bg-[#e8f2ed] text-[#387440]'
          )}
        >
          {count}
        </span>
      )}
    </Link>
  );
};

const CircleSwitch = ({ active = 'circle', count = 3, rail, showCreate = false }) => (
  <div className="flex flex-wrap items-center justify-between gap-[12px]">
    <nav
      aria-label="Community views"
      className="flex w-fit items-center gap-[4px] rounded-[12px] bg-[#f1f2f0] p-[4px] playful:rounded-full playful:border-[1.5px] playful:border-solid playful:border-[#1c2a21] playful:bg-white playful:shadow-[0_3px_0_rgba(28,42,33,0.12)]"
    >
      <Segment
        to={withRail(COMMUNITY_HREF, rail)}
        selected={active === 'communities'}
        icon={CircleSwitchCommunitiesIcon}
      >
        {COPY.switchCommunities}
      </Segment>
      <Segment
        to={withRail(CIRCLE_HREF, rail)}
        selected={active === 'circle'}
        icon={CircleSwitchCircleIcon}
        count={count}
      >
        {COPY.switchCircle}
      </Segment>
    </nav>
    {showCreate && (
      <CircleButton to={withRail(CREATE_COMMUNITY_HREF, rail)}>{COPY.createCommunity}</CircleButton>
    )}
  </div>
);

export default CircleSwitch;
