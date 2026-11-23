import CircleButton from './CircleButton.jsx';
import CircleMiniPeopleCard from './CircleMiniPeopleCard.jsx';
import { useCircleVariantData } from './useCircleVariantData.js';

/*
 * CircleFeedSide — Figma `People you may know (mini)` (NW-09 right rail): "People to link up with", three rows with a soft
 * Link up / Learn from button (recruiter: Follow) and "See all". Drawn by the shared CircleMiniPeopleCard.
 * Props: block (FEED_RESPONSE.sideSuggestions), statusOf(id), following (ids), onLinkUp(person), onFollow(person), onSeeAll().
 */
const CircleFeedSide = ({ block, statusOf, following, onLinkUp, onFollow, onSeeAll }) => {
  const { copy: COPY, isRecruiter } = useCircleVariantData();
  return (
    <CircleMiniPeopleCard
      title={block.title}
      items={block.items}
      seeAll={block.seeAll}
      onSeeAll={onSeeAll}
      // Talent NW-09 Focused draws 20 between the rows; the recruiter feed keeps the 16 it was built with.
      gap={isRecruiter ? 16 : 20}
      renderAction={(person, item) => {
        if (item.cta === 'follow') {
          const follows = following.includes(item.id);
          return (
            <CircleButton tone="soft" aria-pressed={follows} onClick={() => onFollow(person)}>
              {follows ? COPY.following : (COPY.learnFrom ?? COPY.follow)}
            </CircleButton>
          );
        }
        const sent = statusOf(item.id) === 'pending-sent';
        return (
          <CircleButton tone="soft" disabled={sent} onClick={() => onLinkUp(person)}>
            {sent ? COPY.linkUpSent : COPY.linkUp}
          </CircleButton>
        );
      }}
    />
  );
};

export default CircleFeedSide;
