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
 * `onWhy(text)` / `onChip(text)` override the live chat bridge for static demo frames.
 */
const OpportunityMatchCards = ({ matches = OPPORTUNITY_MATCHES, onWhy, onChip }) => {
  const navigate = useNavigate();
  const ask = onWhy ?? sendBuddyChip;
  return (
    <div className="mt-[16px] flex min-w-0 flex-col">
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
              navigate(match.detailPath);
            }}
            onWhy={() => ask(`Card ${i + 1} - Why this match?`)}
          />
        ))}
      </div>
      <ThreadChips chips={MATCH_FOLLOW_UP_CHIPS} onPick={onChip} />
    </div>
  );
};

export default OpportunityMatchCards;
