import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { MATCH_FOLLOW_UP_CHIPS, OPPORTUNITY_MATCHES } from './opportunityGuidanceData.js';
import { sendBuddyChip } from './opportunityEvents.js';
import OpportunityMatchCard from './OpportunityMatchCard.jsx';
import ThreadChips from './ThreadChips.jsx';

const log = debug('OpportunityMatchCards');

/*
 * OpportunityMatchCards - the horizontal row of three job cards plus the "Why these 3?" / "Show more matches" chips, rendered
 * as the rich `content` of the buddy's "Got it. Here are your 3 strongest matches" message (Figma 9053:80615 / 9053:81141).
 * `onWhy(text, match, index)` / `onChip(text)` override the live chat bridge for static demo frames; the live agent chat
 * (useCareerBuddyLive) passes its own `onWhy` / `onView` and `followUps` (empty: the agent sends its own chips).
 */
const OpportunityMatchCards = ({
  matches = OPPORTUNITY_MATCHES,
  onWhy,
  onChip,
  onView,
  followUps = MATCH_FOLLOW_UP_CHIPS,
  disabled = false,
  fitWidth = false,
}) => {
  const navigate = useNavigate();
  const ask = onWhy ?? sendBuddyChip;
  return (
    <div
      className="mt-[16px] flex min-w-0 max-w-full flex-col"
      // In a chat bubble that shrink-wraps its text, the scrolling row would otherwise collapse to the text's width:
      // give it the cards' own width, capped to what the bubble can hold (the row scrolls past that).
      style={fitWidth ? { width: `min(${matches.length * 432 - 4}px, 660px, 78vw)` } : undefined}
    >
      <div
        role="group"
        aria-label="Your strongest matches"
        className="-mx-[4px] flex max-w-full gap-[12px] overflow-x-auto px-[4px] pb-[8px] [scrollbar-width:thin]"
      >
        {matches.map((match, i) => (
          <OpportunityMatchCard
            key={match.id}
            match={match}
            onView={() => {
              log('branch', { viewOpportunity: match.id, to: match.detailPath });
              if (onView) onView(match, i);
              else navigate(match.detailPath);
            }}
            onWhy={() => ask(`Card ${i + 1} - Why this match?`, match, i)}
            whyDisabled={disabled}
          />
        ))}
      </div>
      {followUps.length ? <ThreadChips chips={followUps} onPick={onChip} /> : null}
    </div>
  );
};

export default OpportunityMatchCards;
