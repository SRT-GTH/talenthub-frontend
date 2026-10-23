import {
  CARD_ONE_WHY,
  MATCH_FOLLOW_UP_CHIPS,
  OPEN_TO_ANSWER,
  OPEN_TO_CHIPS,
  OPPORTUNITY_COPY,
  OPPORTUNITY_MATCHES,
} from './opportunityGuidanceData.js';
import OpportunityMatchCards from './OpportunityMatchCards.jsx';

/*
 * Opportunity Matching script nodes (Figma 9053:80188). Merged into CAREER_BUDDY_NODES by careerBuddyScript.js; the node
 * `stub-guidance-opportunity` (the guidance chip's target) replaces the old "coming soon" stub.
 *
 *   stub-guidance-opportunity -> (open-to chip or typed answer) -> opportunity-matches
 *   opportunity-matches -> "Why these 3?" | "Show more matches" | "Card N - Why this match?"
 *   opportunity-why-N -> "Apply with my GTH profile" (opens the posting) | "Add skill"
 *
 * A node's `navigateTo` makes the chat route there after its reply (CareerBuddySection submit()).
 */
const TALENT = 'Emma';
let counter = 0;
const nextId = () => `opp-${(counter += 1)}`;
const bot = (text, extra = {}) => ({ id: nextId(), sender: 'bot', text, ...extra });
const userMsg = (text, extra = {}) => ({
  id: nextId(),
  sender: 'user',
  text,
  personaLabel: TALENT,
  ...extra,
});
const autoMsg = (text) => userMsg(text, { auto: true, autoLabel: '[Auto]' });

const CARD_KEYS = OPPORTUNITY_MATCHES.map((_, i) => `Card ${i + 1} - Why this match?`);

const MATCH_NEXT = {
  'Why these 3?': 'opportunity-why-three',
  'Show more matches': 'opportunity-more',
  ...Object.fromEntries(CARD_KEYS.map((key, i) => [key, `opportunity-why-${i + 1}`])),
  '*': 'opportunity-more',
};

const WHY_NEXT = {
  ...MATCH_NEXT,
  'Apply with my GTH profile': 'opportunity-apply',
  'Add skill': 'opportunity-add-skill',
};

// ⚠️ ASSUMPTION: cards 2 and 3 have no drawn reply; same shape as card 1's, built from the card's own facts.
const whyForCard = (match) => ({
  text: `You’re a ${match.match}% match for ${match.company} ${match.title}:`,
  bullets: [
    `Skills ${match.skills.filter((s) => s.have).length} of ${match.skills.length}. ${match.skills
      .filter((s) => s.have)
      .map((s) => s.name)
      .join(', ')} line up.`,
    ...match.skills.filter((s) => !s.have).map((s) => `Missing. ${s.name}.`),
  ],
});

const whyNode = (index) => ({
  reply: (text) => {
    const why = index === 0 ? CARD_ONE_WHY : whyForCard(OPPORTUNITY_MATCHES[index]);
    return [autoMsg(text ?? CARD_KEYS[index]), bot(why.text, { bullets: why.bullets })];
  },
  suggestedReplies: index === 0 ? CARD_ONE_WHY.chips : ['Add skill'],
  next: WHY_NEXT,
});

export const OPPORTUNITY_NODES = {
  'stub-guidance-opportunity': {
    reply: () => [autoMsg(OPPORTUNITY_COPY.areaLabel), bot(OPPORTUNITY_COPY.intro)],
    suggestedReplies: OPEN_TO_CHIPS,
    next: {
      ...Object.fromEntries(OPEN_TO_CHIPS.map((chip) => [chip, 'opportunity-matches'])),
      '*': 'opportunity-matches',
    },
  },
  'opportunity-matches': {
    reply: (text) => [
      userMsg(text || OPEN_TO_ANSWER),
      bot(OPPORTUNITY_COPY.matchesIntro, { content: <OpportunityMatchCards /> }),
    ],
    suggestedReplies: [],
    next: MATCH_NEXT,
  },
  'opportunity-why-three': {
    reply: (text) => [userMsg(text), bot(OPPORTUNITY_COPY.whyThese)],
    suggestedReplies: [],
    next: MATCH_NEXT,
  },
  'opportunity-more': {
    reply: (text) => [userMsg(text), bot(OPPORTUNITY_COPY.moreMatches)],
    suggestedReplies: MATCH_FOLLOW_UP_CHIPS,
    next: MATCH_NEXT,
  },
  'opportunity-why-1': whyNode(0),
  'opportunity-why-2': whyNode(1),
  'opportunity-why-3': whyNode(2),
  'opportunity-apply': {
    // ⚠️ ASSUMPTION: the reply line reuses the detail page's own hint ("Takes 1 minute. You’ll preview what they see first.").
    reply: (text) => [userMsg(text), bot('Takes 1 minute. You’ll preview what they see first.')],
    navigateTo: CARD_ONE_WHY.applyPath,
    suggestedReplies: [],
    next: WHY_NEXT,
  },
  'opportunity-add-skill': {
    reply: (text) => [userMsg(text), bot(OPPORTUNITY_COPY.addSkill)],
    suggestedReplies: CARD_ONE_WHY.chips,
    next: WHY_NEXT,
  },
};
