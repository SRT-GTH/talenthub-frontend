/* Copy for landing S4 · Features (Figma 7797:11136, tablet 7815:267713, mobile 7815:275530) — verbatim from Figma. */

export const FEATURES_CHIP = 'Everything in one place';
/* Heading: Bricolage 54/40/32, "actually works." in gold (#ffd86b) — character style overrides on 7797:13078. */
export const FEATURES_HEADING = ['Built around how Ghana ', 'actually works.'];
export const FEATURES_SUB =
  'Not copied from Silicon Valley. Every feature is designed for students, graduates and early-career talents here.';

export const BUDDY_CARD = {
  kicker: 'CAREER BUDDY · YOUR AI GUIDE',
  title: 'Advice that knows you, any time.',
  body: 'Ask about roles, pay in Accra, interview prep or your next step. Replies in your language where it can.',
  messages: [
    { from: 'buddy', text: 'Your Zeepay interview is Thursday. Want a 10-minute mock?' },
    { from: 'you', text: 'Yes please, React questions' },
    { from: 'buddy', text: 'Great. Question 1: what does useEffect’s cleanup do?' },
  ],
};

export const READINESS_CARD = {
  kicker: 'JOB READINESS',
  title: 'Know how ready you are.',
  body: 'One score and the one gap to close next.',
  score: '82',
  scoreNote: 'Ahead of 71% of similar talents',
  scorePct: 82, // bar fill 350 / 428
};

export const SKILLS_LAB_CARD = {
  kicker: 'SKILLS LAB',
  title: 'Prove it by playing.',
  body: 'Short challenges turn skills into evidence.',
  games: [
    { name: 'React Speedrun', rank: 'Top 11%' },
    { name: 'Python Lab', rank: 'Top 23%' },
    { name: 'Chess', rank: 'Top 38%' },
  ],
};

export const ASSESSMENT_CARD = {
  kicker: 'MYASSESSMENT',
  title: 'Know your real strengths.',
  body: '15 scenarios from Ghanaian workplaces. One of 9 archetypes.',
  traits: [
    { name: 'Conscientiousness', pct: 88 }, // 388 / 441
    { name: 'Decisiveness', pct: 79 }, // 348 / 441
    { name: 'Openness', pct: 72 }, // 317 / 441
  ],
};

export const VERIFIED_CARD = {
  kicker: 'VERIFIED SKILLS',
  title: 'More than a CV.',
  body: 'Every skill shows how it was proven, so recruiters trust it.',
  chips: [
    { label: 'Assessment-evidenced', kind: 'assessment' },
    { label: 'Game-evidenced', kind: 'game' },
    { label: 'AI-validated in chat', kind: 'chat' },
    { label: 'Self-reported', kind: 'self' },
  ],
};

export const STREAK_CARD = {
  kicker: 'STREAKS, XP AND QUESTS',
  title: 'Small wins, every day.',
  body: 'Keep a streak, finish weekly quests and level up. One free streak freeze a week.',
  /* Mon..Sun: the first six are done (orange tile + tick), Sunday is empty. */
  days: [
    { letter: 'M', done: true },
    { letter: 'T', done: true },
    { letter: 'W', done: true },
    { letter: 'T', done: true },
    { letter: 'F', done: true },
    { letter: 'S', done: true },
    { letter: 'S', done: false },
  ],
};

export const MATCHING_CARD = {
  kicker: 'SMART MATCHING',
  title: 'Opportunities find you.',
  body: 'A fit score on every role, with the reasons. No keyword games.',
  role: 'Data Analyst Intern · MTN Ghana',
  meta: 'Hybrid · Accra · Analytical, Python',
  score: '94%',
};
