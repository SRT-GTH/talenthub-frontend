import CircleMiniPeopleCard from './CircleMiniPeopleCard.jsx';

/*
 * NetworkYouBothKnowCard — Figma `You both know · 8` right-rail card of the talent profile (NW-06 … NW-08, both looks) and the
 * recruiter talent profile (RC-NW06): title, three people (avatar + name + where you both know them), "See all 8".
 * Drawn by the shared CircleMiniPeopleCard. Props: block ({ title, seeAll, items: [{ id, note }] }), onSeeAll(), className.
 */
const NetworkYouBothKnowCard = ({ block, onSeeAll, className }) => (
  <CircleMiniPeopleCard
    title={block.title}
    items={block.items}
    seeAll={block.seeAll}
    onSeeAll={onSeeAll}
    className={className}
  />
);

export default NetworkYouBothKnowCard;
