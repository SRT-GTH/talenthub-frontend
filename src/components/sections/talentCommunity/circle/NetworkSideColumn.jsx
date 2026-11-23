import { classNames } from '../../../../utils/classNames.js';
import CircleParentCard from './CircleParentCard.jsx';
import CircleSidePanel from './CircleSidePanel.jsx';
import NetworkGrowCard from './NetworkGrowCard.jsx';
import NetworkMentorsCard from './NetworkMentorsCard.jsx';
import { useCircleVariantData } from './useCircleVariantData.js';

/*
 * NetworkSideColumn — the right rail of My crew (talent NW-01 … NW-05, NW-10, NW-11) and My network (recruiter), Figma `Right rail`
 * (420px, gap 18): the "Your crew" / "Your network" stats + tip, then (per frame) the parent card (under-18 view), the
 * "Grow your crew" / "Grow your network" checklist and "Mentors to learn from" / "Mentors and hiring partners".
 * Props: stats ({ inCircle }), tiles (three { value, label } replacing the drawn stats), tip (text), grow (checklist block; defaults
 * to the audience's, null hides it), parentCard (CircleParentCard `card`, hidden when absent), showMentors, following (ids),
 * onFollow(person), onSeeAll(), onStep(id), className.
 */
const NetworkSideColumn = ({
  stats,
  tiles,
  tip,
  grow,
  parentCard,
  showMentors = false,
  following = [],
  onFollow,
  onSeeAll,
  onStep,
  className,
}) => {
  const { grow: variantGrow } = useCircleVariantData();
  const growBlock = grow === undefined ? variantGrow : grow;
  return (
    <div className={classNames('flex min-w-0 flex-col gap-[18px]', className)}>
      <CircleSidePanel stats={stats} tiles={tiles} tip={tip} />
      {parentCard && <CircleParentCard card={parentCard} />}
      {growBlock && <NetworkGrowCard grow={growBlock} onStep={onStep} />}
      {showMentors && (
        <NetworkMentorsCard following={following} onFollow={onFollow} onSeeAll={onSeeAll} />
      )}
    </div>
  );
};

export default NetworkSideColumn;
