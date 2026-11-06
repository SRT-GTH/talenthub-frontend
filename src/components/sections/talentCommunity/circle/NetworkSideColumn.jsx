import { classNames } from '../../../../utils/classNames.js';
import CircleParentCard from './CircleParentCard.jsx';
import CircleSidePanel from './CircleSidePanel.jsx';
import NetworkGrowCard from './NetworkGrowCard.jsx';
import NetworkMentorsCard from './NetworkMentorsCard.jsx';
import { NETWORK_GROW } from './recruiterCircleData.js';

/*
 * NetworkSideColumn — the recruiter right rail of My network (Figma `Right rail`, 420px, gap 18): the "Your network" stats + Hiring
 * Assistant tip, then (per frame) the parent card (under-18 view), the "Grow your network" checklist and "Mentors and hiring partners".
 * Props: stats ({ inCircle }), tiles (three { value, label } replacing the drawn stats), tip (text), grow (checklist block, null hides it),
 * parentCard (CircleParentCard `card`, hidden when absent), showMentors, following (ids), onFollow(person), onSeeAll(), onStep(id), className.
 */
const NetworkSideColumn = ({
  stats,
  tiles,
  tip,
  grow = NETWORK_GROW,
  parentCard,
  showMentors = false,
  following = [],
  onFollow,
  onSeeAll,
  onStep,
  className,
}) => (
  <div className={classNames('flex min-w-0 flex-col gap-[18px]', className)}>
    <CircleSidePanel stats={stats} tiles={tiles} tip={tip} />
    {parentCard && <CircleParentCard card={parentCard} />}
    {grow && <NetworkGrowCard grow={grow} onStep={onStep} />}
    {showMentors && (
      <NetworkMentorsCard following={following} onFollow={onFollow} onSeeAll={onSeeAll} />
    )}
  </div>
);

export default NetworkSideColumn;
