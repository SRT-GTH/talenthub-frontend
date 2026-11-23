import CircleButton from './CircleButton.jsx';
import CircleMiniPeopleCard from './CircleMiniPeopleCard.jsx';
import { useCircleVariantData } from './useCircleVariantData.js';

/*
 * NetworkMentorsCard — Figma `Mentors to learn from` right-rail card (talent NW-01 … NW-03, NW-11; "Mentors and hiring partners" on
 * the recruiter canvas): mentor rows with a soft 148x56 button ("Learn from" for talent, "Follow" for recruiters; pressed it reads
 * "Following") and "See all". Drawn by the shared CircleMiniPeopleCard.
 * Props: following (ids followed this session), onFollow(person), onSeeAll(), card (defaults to the audience's mentors block),
 * className.
 */
const NetworkMentorsCard = ({ following, onFollow, onSeeAll, card, className }) => {
  const { copy: COPY, mentorsCard } = useCircleVariantData();
  const block = card ?? mentorsCard;
  return (
    <CircleMiniPeopleCard
      title={block.title}
      items={block.items}
      seeAll={block.seeAll}
      onSeeAll={onSeeAll}
      className={className}
      renderAction={(person) => {
        const follows = following.includes(person.id);
        return (
          <CircleButton tone="soft" aria-pressed={follows} onClick={() => onFollow(person)}>
            {follows ? COPY.following : (COPY.learnFrom ?? COPY.follow)}
          </CircleButton>
        );
      }}
    />
  );
};

export default NetworkMentorsCard;
