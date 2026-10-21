import coverDesertIsland from '../../../../assets/engagement-v2/arcade/cover-desert-island.png';
import coverEscapeRoom from '../../../../assets/engagement-v2/arcade/cover-escape-room.png';
import coverFestivalPlanner from '../../../../assets/engagement-v2/arcade/cover-festival-planner.png';
import coverGroupChat from '../../../../assets/engagement-v2/arcade/cover-group-chat-drama.png';
import coverLudoRisk from '../../../../assets/engagement-v2/arcade/cover-ludo-risk.png';
import coverMakola from '../../../../assets/engagement-v2/arcade/cover-makola-haggle.png';
import coverSpeedSort from '../../../../assets/engagement-v2/arcade/cover-speed-sort.png';
import coverThePitch from '../../../../assets/engagement-v2/arcade/cover-the-pitch.png';
import coverTowerBuilder from '../../../../assets/engagement-v2/arcade/cover-tower-builder.png';
import coverTrotroRush from '../../../../assets/engagement-v2/arcade/cover-trotro-rush.png';

/*
 * Personality Arcade (Figma canvas 3125:10352, section "Personality + Arcade": PA-01 hub, PA-02 game details, PA-13 archetype
 * unlocked). Copy is verbatim from the nodes; mock data, shaped like `GET /personality/arcade` so the API can replace it.
 * `status`: 'ready' (yellow chip) | 'new' (green chip) | 'soon' (not playable). `{xp}` words: XP in Playful, pts in Focused.
 */
export const ARCADE_ROUTE = '/profile/filling/personality/arcade';
export const GAME_ROUTE = (id) => `${ARCADE_ROUTE}/${id}`;
export const UNLOCK_AT = 3;

export const GAMES = [
  {
    id: 'escape-room',
    title: 'The Escape Room',
    category: 'Strategy',
    status: 'ready',
    meta: '~5 min · Medium',
    blurb: 'Four rooms, one clock. Every clue you chase shows how you think when time is tight.',
    measures: 'Problem solving · Calm under pressure',
    cover: coverEscapeRoom,
  },
  {
    id: 'makola-haggle',
    title: 'Makola Haggle',
    category: 'Social',
    status: 'new',
    meta: '~4 min · Medium',
    blurb: 'Bargain with a market queen. Shows how you handle give and take.',
    measures: 'Agreeableness · Decisiveness',
    cover: coverMakola,
  },
  {
    id: 'desert-island',
    title: 'Desert Island',
    category: 'Decisions',
    status: 'ready',
    meta: '~4 min · Medium',
    blurb: 'Your ship sank. Pick 5 of 12 items to keep. Then pick who to save.',
    measures: 'Decisiveness · Openness',
    cover: coverDesertIsland,
  },
  {
    id: 'trotro-rush',
    title: 'Trotro Rush',
    category: 'Planning',
    status: 'new',
    meta: '~4 min · Easy',
    blurb: 'Five errands across Accra before 9am. Plan the route, beat the traffic.',
    measures: 'Conscientiousness · Planning',
    cover: coverTrotroRush,
  },
  {
    id: 'group-chat-drama',
    title: 'Group Chat Drama',
    category: 'Social',
    status: 'new',
    meta: '~3 min · Easy',
    blurb: 'Your final-year project group chat is on fire. What do you send?',
    measures: 'Agreeableness · Emotional stability',
    cover: coverGroupChat,
  },
  {
    id: 'speed-sort',
    title: 'Speed Sort',
    category: 'Speed',
    status: 'ready',
    meta: '~2 min · Hard',
    blurb: 'Cards fly in fast. Sort them into the right basket before the timer ends.',
    measures: 'Focus · Decisiveness',
    cover: coverSpeedSort,
  },
  {
    id: 'tower-builder',
    title: 'Tower Builder',
    category: 'Logic',
    status: 'ready',
    meta: '~4 min · Easy',
    blurb: 'Stack blocks under rules that keep changing. Plan or improvise?',
    measures: 'Conscientiousness · Patience',
    cover: coverTowerBuilder,
  },
  {
    id: 'the-pitch',
    title: 'The Pitch',
    category: 'Creativity',
    status: 'ready',
    meta: '~3 min · Hard',
    blurb: 'Sell a random idea in 60 seconds, by voice or text. Bravery counts more than polish.',
    measures: 'Extraversion · Openness',
    cover: coverThePitch,
  },
  {
    id: 'ludo-risk',
    title: 'Ludo Risk',
    category: 'Strategy',
    status: 'ready',
    meta: '~3 min · Medium',
    blurb: 'Play it safe or chase the big move? Every roll tells us something.',
    measures: 'Risk appetite · Emotional stability',
    cover: coverLudoRisk,
  },
  {
    id: 'festival-planner',
    title: 'Festival Planner',
    category: 'Creativity',
    status: 'soon',
    meta: '~5 min · Medium',
    blurb: 'Set up a stall at a street art festival with a tight budget and a big crowd.',
    measures: 'Openness · Organisation',
    cover: coverFestivalPlanner,
  },
];

export const GAME_BY_ID = Object.fromEntries(GAMES.map((g) => [g.id, g]));

export const FILTERS = [
  'Strategy',
  'Social',
  'Decisions',
  'Planning',
  'Speed',
  'Logic',
  'Creativity',
];

export const STATUS_LABEL = { ready: 'Ready to play', new: 'New game', soon: 'Coming soon' };

export const HUB = {
  kicker: 'PERSONALITY ARCADE',
  sticker: '10 GAMES',
  title: ['Play any 3. ', 'We do the reading.'],
  lead: 'No right answers and no scores to beat. We watch how you play: what you chase first, when you take a risk, how you treat people.',
  progress: {
    locked: 'Your archetype unlocks at 3',
    unlocked: 'Archetype unlocked!',
    note: 'Each game takes 2 to 5 minutes. Play more than 3 and your scores get sharper.',
  },
  sort: 'Sort: Shortest first',
  suggest: {
    title: 'Got a game idea?',
    text: 'Tell us a game from home, school or work. The best ones join the Arcade.',
    action: 'Suggest a game',
  },
  footer: {
    note: 'Play any 3 games to unlock your archetype. Saved after every game.',
    quiz: 'Take the quiz instead',
    result: 'See my result',
  },
};

/* Featured card (PA-01): Makola Haggle, "New this week". */
export const FEATURED = {
  id: 'makola-haggle',
  sticker: 'NEW THIS WEEK',
  category: 'Social',
  title: 'Makola Haggle',
  text: 'Auntie Akos says the fabric is GH₵ 180, final price. Is it? Four rounds of bargaining show how you balance getting a good deal with keeping things friendly.',
  action: 'Play now',
  meta: '~4 min · +50 {xp}',
};

/* PA-02: details of Makola Haggle (the only game whose details are drawn). */
export const DETAILS = {
  'makola-haggle': {
    sticker: 'NEW',
    category: 'Social',
    title: 'Makola Haggle',
    chips: ['~4 min', '4 rounds', 'Medium', '+50 {xp}'],
    howTitle: 'HOW TO PLAY',
    steps: [
      ['Meet Auntie Akos', 'She sells fabric at Makola. Her first price is GH₵ 180.'],
      ['Pick your move', 'Counter, bundle, walk away or pay. Four rounds.'],
      ['Watch her mood', 'Push too hard and she gets annoyed. Too soft and you overpay.'],
      ['Strike a deal (or not)', 'Walking away is a real choice too.'],
    ],
    readsTitle: 'WHAT IT SHOWS RECRUITERS',
    reads: [
      ['Agreeableness', 'How you keep things friendly'],
      ['Decisiveness', 'How quickly you commit'],
      ['Emotional stability', 'How you handle a hard no'],
    ],
    private: 'Recruiters see traits, never your moves.',
    hint: 'Sound on for market vibes. Captions always on.',
    back: 'Back to Arcade',
    start: 'Start game',
  },
};

/* PA-13: the archetype-unlocked modal. */
export const ARCHETYPE = {
  sticker: '3 OF 3 PLAYED',
  title: 'Your archetype is ready',
  text: 'You haggled at Makola, escaped the study and calmed a group chat. That is enough for us to read your working style.',
  chips: ['Warm Closer', 'Careful Explorer', 'Calm Lead'],
  xp: '+150 {xp} earned. Play more games any time to sharpen your scores.',
  more: 'Play one more',
  reveal: 'Reveal my archetype',
};

/* The three games the PA-13 frame shows as played (also the `?played=3` demo state). */
export const DEMO_PLAYED = ['makola-haggle', 'escape-room', 'group-chat-drama'];
