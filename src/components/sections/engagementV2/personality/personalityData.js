/*
 * Personality package mock data (Figma canvas 3125:10352, Personality + Arcade section). API-shaped, frontend only.
 * Every string is verbatim from the Figma node data (PE-01 … PE-05, PA-00, "interests(intro page(optional)").
 * Only question 7 is drawn in Figma, so the question bank holds that one question.
 */
import makolaImg from '../../../../assets/engagement-v2/personality/path-makola-haggle.png';
import escapeImg from '../../../../assets/engagement-v2/personality/path-escape-room.png';
import groupChatImg from '../../../../assets/engagement-v2/personality/path-group-chat.png';
import kofiAvatar from '../../../../assets/engagement-v2/personality/kofi-avatar.png';

export const ARCADE_ROUTE = '/profile/filling/personality/arcade';
export const PERSONALITY_ROUTE = '/profile/filling/personality';

export const STAGE_TRAIL = [
  { id: 'avatar', label: 'Avatar', done: true },
  { id: 'interests', label: 'Interests ', done: true },
  { id: 'personality', label: 'Personality', done: true, current: true },
  { id: 'skills', label: 'Skills', done: false },
  { id: 'work', label: 'Work', done: false },
  { id: 'portfolio', label: 'Portfolio', done: false },
  { id: 'certs', label: 'Certs', done: false },
  { id: 'goals', label: 'Goals', done: false },
  { id: 'pitch', label: 'Pitch', done: false },
];

export const ARCHETYPES = [
  'The Architect',
  'The Builder',
  'The Connector',
  'The Visionary',
  'The Analyst',
  'The Guardian',
  'The Catalyst',
  'The Mentor',
  'The Pioneer',
];

export const INTRO_CHIPS = ['About 8 min', '15 scenarios', 'Retake any time'];

export const GETS = [
  {
    id: 'scores',
    icon: 'ChartBar',
    title: 'Six trait scores',
    body: 'How you compare with other GTH talents, shown as percentiles.',
  },
  {
    id: 'archetype',
    icon: 'Compass',
    title: 'Your archetype',
    body: 'One of 9 working styles, shown as a badge on your recruiter card.',
  },
  {
    id: 'note',
    icon: 'Edit',
    title: 'A note in your words',
    body: 'Up to 200 characters to give recruiters context. Optional.',
  },
];

export const TRAITS = [
  { id: 'openness', icon: 'Bulb', title: 'Openness', body: 'Curiosity and new ideas' },
  {
    id: 'conscientiousness',
    icon: 'Target',
    title: 'Conscientiousness',
    body: 'Organisation and follow-through',
  },
  {
    id: 'extraversion',
    icon: 'Users',
    title: 'Extraversion',
    body: 'Energy from people and groups',
  },
  { id: 'agreeableness', icon: 'Heart', title: 'Agreeableness', body: 'Empathy and cooperation' },
  {
    id: 'stability',
    icon: 'Shield',
    title: 'Emotional stability',
    body: 'Staying calm under pressure',
  },
  {
    id: 'decisiveness',
    icon: 'Bolt',
    title: 'Decisiveness',
    body: 'Making calls with what you know',
  },
];

export const BEFORE_YOU_START = [
  {
    id: 'right',
    icon: 'ThumbUp',
    title: 'No right answers',
    body: 'Each option points to a different working style. Pick what you would really do.',
  },
  {
    id: 'private',
    icon: 'Lock',
    title: 'Your answers stay private',
    body: 'Recruiters only see your trait scores and archetype, never your answers.',
  },
  {
    id: 'ghana',
    icon: 'GhanaFlag',
    title: 'Made for Ghana',
    body: 'Scenarios use Ghanaian workplaces, not US or UK defaults.',
  },
  {
    id: 'retake',
    icon: 'Refresh',
    title: 'Retake any time',
    body: 'We keep your most recent result. Your card updates straight away.',
  },
];

/* Quiz — only question 7 of 15 is drawn. `fill` = the trait bar width as a fraction of its track (Figma px / 416). */
export const QUIZ_TOTAL = 15;
export const QUIZ_ANSWERED_BEFORE = 6;
export const QUESTIONS = {
  7: {
    n: 7,
    kicker: 'QUESTION 7 · DECISIONS UNDER PRESSURE',
    titleLead: 'Your team is behind on a critical project and you have two workable paths. Which ',
    titleAccent: 'do you take?',
    context:
      'The deadline is in 48 hours. Path A: restructure the plan and share out the tasks again. Slower to start, but steadier. Path B: push the current plan harder with longer hours. Faster, but quality may slip.',
    options: [
      {
        letter: 'A',
        text: 'Restructure now. Call a 30-minute team alignment, share out tasks by who has capacity, and reset the timeline with the client.',
      },
      {
        letter: 'B',
        text: 'Push through with the current plan, but add my own hours. I’ll take on extra work rather than disrupt the team this close to the deadline.',
      },
      {
        letter: 'C',
        text: 'Flag it to leadership straight away and ask for an extension. I’d rather renegotiate scope than ship something below the bar.',
      },
      {
        letter: 'D',
        text: 'Split the difference: extend hours for two days and cut scope on the lowest-priority item so we finish on time without burning anyone out.',
      },
    ],
  },
};

export const QUIZ_TRAITS_SO_FAR = [
  { id: 'openness', label: 'Openness', status: 'Building', fill: 258 / 416 },
  { id: 'conscientiousness', label: 'Conscientiousness', status: 'Building', fill: 333 / 416 },
  { id: 'extraversion', label: 'Extraversion', status: 'Building', fill: 158 / 416 },
  { id: 'agreeableness', label: 'Agreeableness', status: 'Building', fill: 229 / 416 },
  { id: 'stability', label: 'Emotional stability', status: 'Building', fill: 250 / 416 },
  { id: 'decisiveness', label: 'Decisiveness', status: 'Building', fill: 291 / 416 },
];

export const WORKING_STEPS = [
  'Scoring your 15 answers',
  'Comparing with other GTH talents',
  'Matching you to 1 of 9 archetypes',
];

/* Result — `fill` is the bar width as a fraction of its 960px track (Figma px / 960). Labels kept as drawn ("72th", "41th"). */
export const RESULT = {
  archetype: 'The Architect',
  kicker: 'YOUR ARCHETYPE · 1 OF 9',
  titleLead: 'You’re ',
  titleAccent: 'The Architect.',
  body: 'Strategic and systematic. You plan before you build, spot risks early and like clear structure. Teams lean on you when things get complicated.',
  topChips: ['Conscientiousness · 88th', 'Decisiveness · 79th', 'Openness · 72nd'],
  traits: [
    {
      id: 'conscientiousness',
      icon: 'Target',
      title: 'Conscientiousness',
      percentile: '88th percentile',
      strong: true,
      fill: 774 / 960,
      body: 'You finish what you start and keep things organised.',
    },
    {
      id: 'decisiveness',
      icon: 'Bolt',
      title: 'Decisiveness',
      percentile: '79th percentile',
      strong: true,
      fill: 695 / 960,
      body: 'You make calls quickly with the information you have.',
    },
    {
      id: 'openness',
      icon: 'Bulb',
      title: 'Openness',
      percentile: '72th percentile',
      strong: true,
      fill: 634 / 960,
      body: 'You enjoy new ideas and different ways of working.',
    },
    {
      id: 'stability',
      icon: 'Shield',
      title: 'Emotional stability',
      percentile: '70th percentile',
      strong: true,
      fill: 616 / 960,
      body: 'You stay steady when deadlines get tight.',
    },
    {
      id: 'agreeableness',
      icon: 'Heart',
      title: 'Agreeableness',
      percentile: '64th percentile',
      strong: false,
      fill: 563 / 960,
      body: 'You cooperate well and look out for teammates.',
    },
    {
      id: 'extraversion',
      icon: 'Users',
      title: 'Extraversion',
      percentile: '41th percentile',
      strong: false,
      fill: 361 / 960,
      body: 'You recharge with focused, smaller-group work.',
    },
  ],
  noteMax: 200,
  notePlaceholder: 'e.g. I’m an Architect who also loves running community events at KNUST.',
  cardChips: ['Conscientious', 'Decisive', 'Open'],
  cardName: 'Kofi A.',
  cardPlace: 'Accra · Software & data',
  cardNoteEmpty: '“Add a note and it shows here.”',
  avatar: kofiAvatar,
};

export const PATHS = [
  {
    id: 'games',
    title: 'Play mini-games',
    icon: 'BigSmile',
    body: 'Pick any 3 of 10 games: haggle at Makola, escape a locked room, survive a group-chat meltdown. We read your style from how you play.',
    meta: ['~12 min', '10 games', '+150 XP'],
  },
  {
    id: 'quiz',
    title: 'Quick quiz',
    icon: 'ListBullet',
    body: '15 short scenarios from real Ghanaian workplaces. Tap the option closest to what you would really do.',
    meta: ['~8 min', '15 questions', '+100 XP'],
  },
  {
    id: 'chat',
    title: 'Chat with Buddy',
    icon: 'Chat',
    body: 'Talk it through with Career Buddy. It asks follow-ups and fills your traits as you chat. Opens AI chat mode.',
    meta: ['~10 min', 'Voice or text', '+100 XP'],
  },
];
export const PATH_IMAGES = { makola: makolaImg, escape: escapeImg, groupChat: groupChatImg };
export const PATH_QUIZ_OPTIONS = [
  { letter: 'A', text: 'Restructure now and share out tasks', selected: false },
  { letter: 'B', text: 'Push through, add my own hours', selected: true },
  { letter: 'C', text: 'Flag it to leadership straight away', selected: false },
];
export const PATH_CHAT_BUBBLES = {
  buddy: 'When a deadline is close, what do you do first?',
  user: 'I make a list, then call the team',
  reply: 'Nice. That says a lot about you.',
};

/* "interests(intro page(optional)" — a stage overview that sits before the quiz (its title copy was pasted from Interests). */
export const OVERVIEW = {
  title: 'Personality\nYour working style, measured.',
  body: 'Take a 15-question quiz and get one of 9 archetypes.\nRecruiters use it to see how you work — not just what\nyou can do. There are no wrong answers.',
  tags: ['In progress', '15 questions', '9 archetypes', '6 trait scores', '~8 min'],
  covers: [
    {
      title: '15-question quiz',
      body: 'Situational judgment scenarios calibrated for Ghanaian professional context — not US/EU workplace defaults. Each question takes 20–40 seconds.',
    },
    {
      title: 'Six trait scores',
      body: 'Openness · Conscientiousness · Extraversion · Agreeableness · Emotional Stability · Decisiveness. Percentile relative to all other GTH users.',
    },
    {
      title: 'Your archetype',
      body: 'One of 9 archetypes (The Architect, The Builder, The Connector, The Visionary, etc.) generated from trait combination. Shown on your recruiter card.',
    },
    {
      title: 'Your personal note',
      body: 'Up to 200 characters. Recruiters see it alongside your archetype score. Use it to frame your results in your own words this is your chance to contextualise the data.',
    },
  ],
  panelJourney: [
    { label: 'Avatar', glyph: 'User', done: true },
    { label: 'Interests', glyph: 'Interests', done: true },
    { label: 'Personality', glyph: 'HabitBuilderSmall', current: true },
    { label: 'Skills', glyph: 'Skills' },
    { label: 'Work', glyph: 'Work' },
    { label: 'Portfolio', glyph: 'Portfolio' },
    { label: 'Certs', glyph: 'Certificate' },
    { label: 'Goals', glyph: 'Goals' },
    { label: 'Pitch', glyph: 'Pitch' },
  ],
};

/* True when a profile already holds a personality result (the journey's "personality done" rule). Read-only: the result
   screen is still the drawn Figma result, so nothing on this stage writes personalitySnapshot. */
export const hasPersonalitySnapshot = (profile) => {
  const snap = profile?.personalitySnapshot;
  return Boolean(
    snap &&
    (snap.mbtiType || (snap.primaryTraits && snap.primaryTraits.length) || snap.lastAssessedAt)
  );
};
