import {
  CARD_ONE_WHY,
  OPEN_TO_ANSWER,
  OPEN_TO_CHIPS,
  OPPORTUNITY_COPY,
  OPPORTUNITY_SEED,
} from './opportunityGuidanceData.js';
import OpportunityMatchCards from './OpportunityMatchCards.jsx';
import ThreadChips from './ThreadChips.jsx';

/*
 * Demo frames of the Opportunity Matching chat (Figma 9053:80188, Focused), reachable on the scripted talent chat:
 *   /profile/filling/career-buddy?chat=opp-areas      NOT STARTED                      9053:80189  (guidance area chips)
 *   /profile/filling/career-buddy?chat=opp-matches    IN PROGRESS                      9053:80615  (3 strongest matches, "Card 1 - Why this match?" sent)
 *   /profile/filling/career-buddy?chat=opp-why        AWAITING REVIEW AND CONFIRMATION 9053:81141  (the reply + Career Options awaiting confirm)
 * The three Figma frames are one long chat drawn at different scroll offsets; each URL renders the chat up to that frame's
 * last message. The real chat reaches the same states by interaction (guidance chips -> Opportunity Matching -> an open-to chip).
 */
let counter = 0;
const nextId = () => `opp-demo-${(counter += 1)}`;

const seedMessages = () =>
  OPPORTUNITY_SEED.map((m) =>
    m.kind === 'user'
      ? {
          id: nextId(),
          sender: 'user',
          personaLabel: 'Emma',
          text: m.text,
          ...(m.auto ? { auto: true, autoLabel: '[Auto]' } : {}),
        }
      : {
          id: nextId(),
          sender: 'bot',
          text: m.text,
          content: m.chips ? <ThreadChips chips={m.chips} onPick={() => {}} /> : undefined,
        }
  );

export const opportunityDemoMessages = (scene) => {
  const messages = seedMessages();
  if (scene === 'areas') return messages;
  const user = (text, extra = {}) => ({
    id: nextId(),
    sender: 'user',
    personaLabel: 'Emma',
    text,
    ...extra,
  });
  messages.push(
    user(OPPORTUNITY_COPY.areaLabel, { auto: true, autoLabel: '[Auto]' }),
    {
      id: nextId(),
      sender: 'bot',
      text: OPPORTUNITY_COPY.intro,
      content: <ThreadChips chips={OPEN_TO_CHIPS} onPick={() => {}} />,
    },
    user(OPEN_TO_ANSWER),
    {
      id: nextId(),
      sender: 'bot',
      text: OPPORTUNITY_COPY.matchesIntro,
      content: <OpportunityMatchCards onWhy={() => {}} onChip={() => {}} />,
    },
    user('Card 1 - Why this match?', { auto: true, autoLabel: '[Auto]' })
  );
  if (scene === 'matches') return messages;
  messages.push({
    id: nextId(),
    sender: 'bot',
    text: CARD_ONE_WHY.text,
    bullets: CARD_ONE_WHY.bullets,
  });
  return messages;
};

/** Right-panel state of a frame: Education done (100%), and in the last frame Career Options awaiting confirmation. */
export const applyOpportunityPanel = (stages, scene) =>
  stages.map((stage) => {
    if (stage.id === 'educational-background') {
      return { ...stage, status: 'done', completionPct: 100 };
    }
    if (stage.id === 'desired-career' && scene === 'why') {
      return { ...stage, status: 'awaiting-review', completionPct: 90 };
    }
    return stage;
  });

export const opportunityDemoChips = (scene) => (scene === 'why' ? CARD_ONE_WHY.chips : []);
