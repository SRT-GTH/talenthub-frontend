/*
 * Games v2 catalogue — mock payload shaped like `GET /skills-lab/games` (v2) for the Games tab "Skill games" block
 * (Figma GV-01 Playful 9598:34402 / Focused 9598:36301) and the details dialog (GV-02 / GV-03).
 *
 * Row shape (what the API is expected to return per game, merged with the talent's own status):
 *   id, title, category (key of GAME_V2_CATEGORIES), meta ('~3 min · 4 levels'), minutes ('~3 min'), description, measures
 *   (skills the game measures), levels (4 × { id, label, size }) or [] for one-level games, howToPlay (3 steps), icon (tile
 *   icon key), kind ('skill' | 'playstyle'), status:
 *     { kind: 'new' }
 *     { kind: 'ranked-open', best: { score, level, topPercent } }
 *     { kind: 'in-progress', mode: 'ranked', done, total, unit, savedHoursAgo, keptHours }
 *     { kind: 'cooldown', opensOn: 'Thu 6 Nov', opensAt: 'Thu 6 Nov, 09:40' }
 *
 * Verbatim from Figma: every card string (title, meta, description, measures, status), the category colours, the Memory Match
 * details (how to play, measures with their descriptions, level sizes "3×4 / 4×4 / 4×5 / 5×6 cards").
 * ⚠️ ASSUMPTION (not drawn anywhere — invented in the voice of the drawn copy): the details content of every game other than
 * Memory Match (how-to-play steps, the one-line description of each skill other than the three drawn, level sizes, the minutes
 * chip), and which row opens which dialog state (see gamesV2Urls.js).
 */

// Category chip + icon tile colours (Figma `category chip` / `icon tile` fills and text colours).
export const GAME_V2_CATEGORIES = {
  memory: { label: 'Memory', bg: '#fef3d6', fg: '#9e6e05' },
  numbers: { label: 'Numbers', bg: '#e5f0fa', fg: '#2966b0' },
  words: { label: 'Words', bg: '#f2ebfc', fg: '#6b45a8' },
  focus: { label: 'Focus', bg: '#fcebe5', fg: '#b8452e' },
  strategy: { label: 'Strategy', bg: '#e2f1e4', fg: '#27522e' },
  logic: { label: 'Logic puzzles', bg: '#ebf0f7', fg: '#405480' },
  planning: { label: 'Planning', bg: '#fff0de', fg: '#a8610f' },
  leadership: { label: 'Leadership', bg: '#fcebe5', fg: '#b8452e' },
  social: { label: 'Social', bg: '#fef3d6', fg: '#9e6e05' },
};

// Filter strip order (as drawn: All 13 · Memory 1 · Numbers 1 · Words 1 · Focus 1 · Strategy 3 · Logic puzzles 2 · Planning 2 · Leadership 1 · Social 1).
export const GAME_V2_FILTER_ORDER = [
  'memory',
  'numbers',
  'words',
  'focus',
  'strategy',
  'logic',
  'planning',
  'leadership',
  'social',
];

export const GAME_V2_LEVELS = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'expert', label: 'Expert' },
];

// ⚠️ ASSUMPTION — the same rules apply to every game: a skill that can be verified is any measured skill except speed.
export const NOT_VERIFIABLE = 'Processing speed';

// One-line explanation of each measured skill. Working memory / Attention to detail / Processing speed are drawn (GV-02);
// ⚠️ ASSUMPTION: every other line is invented in the same voice.
export const SKILL_BLURBS = {
  'Working memory': 'Holding information in mind and updating it while you work.',
  'Attention to detail': 'Staying accurate and catching mistakes.',
  'Processing speed': 'Taking in information and responding quickly.',
  'Pattern recognition': 'Spotting the rule behind a sequence or a shape.',
  'Numerical reasoning': 'Working with numbers to find the right answer.',
  'Cognitive flexibility': 'Switching approach when the rules change.',
  'Logical reasoning': 'Working out what must be true from what you know.',
  'Verbal reasoning': 'Making sense of words and finding the right one.',
  'Strategic thinking': 'Looking a few moves ahead and weighing your options.',
  Planning: 'Putting steps in the best order before you act.',
};

const LEVEL_SIZES = (sizes) => GAME_V2_LEVELS.map((level, i) => ({ ...level, size: sizes[i] }));

const SKILL = 'skill';

export const GAMES_V2 = [
  {
    id: 'memory-match',
    kind: SKILL,
    title: 'Memory Match',
    category: 'memory',
    icon: 'grid',
    minutes: '~3 min',
    meta: '~3 min · 4 levels',
    description: 'Turn two cards at a time. Find every pair.',
    measures: ['Working memory', 'Attention to detail', 'Processing speed'],
    levels: LEVEL_SIZES(['3×4 cards', '4×4 cards', '4×5 cards', '5×6 cards']),
    howToPlay: [
      'Tap a card to turn it over, then tap a second card.',
      'If the two pictures match, they stay face up. If not, they turn back.',
      'Find every pair. Fewer turns and less time score higher.',
    ],
    status: { kind: 'ranked-open', best: { score: 82, level: 'Intermediate', topPercent: 30 } },
  },
  {
    id: 'pattern-pulse',
    kind: SKILL,
    title: 'Pattern Pulse',
    category: 'numbers',
    icon: 'trend',
    minutes: '~4 min',
    meta: '~4 min · 4 levels',
    description: 'What number comes next? Spot the rule.',
    measures: ['Pattern recognition', 'Numerical reasoning', 'Processing speed'],
    // ⚠️ ASSUMPTION: level sizes and steps.
    levels: LEVEL_SIZES(['6 rounds', '8 rounds', '10 rounds', '12 rounds']),
    howToPlay: [
      'Read the numbers in the sequence.',
      'Work out the rule, then pick the number that comes next.',
      'Get more right in fewer seconds to score higher.',
    ],
    // As drawn on the card: "In progress · Ranked" · "6 of 10 pairs" (the resume dialog says "round 5 of 8" — see resumeNote).
    status: {
      kind: 'in-progress',
      mode: 'ranked',
      done: 6,
      total: 10,
      unit: 'pairs',
      savedHoursAgo: 2,
      keptHours: 22,
      resumeRound: 5,
      resumeOf: 8,
    },
  },
  {
    id: 'switch-sort',
    kind: SKILL,
    title: 'Switch Sort',
    category: 'focus',
    icon: 'repeat',
    minutes: '~2 min',
    meta: '~2 min · 4 levels',
    description: 'Sort by colour or shape. The rule keeps changing.',
    measures: ['Cognitive flexibility', 'Attention to detail', 'Processing speed'],
    levels: LEVEL_SIZES(['20 cards', '30 cards', '40 cards', '50 cards']),
    howToPlay: [
      'A card appears. The rule says to sort it by colour or by shape.',
      'Drop it in the matching pile. The rule can change at any time.',
      'Sort quickly and accurately to score higher.',
    ],
    status: { kind: 'cooldown', opensOn: 'Thu 6 Nov', opensAt: 'Thu 6 Nov, 09:40' },
  },
  {
    id: 'word-shuffle',
    kind: SKILL,
    title: 'Word Shuffle',
    category: 'words',
    icon: 'book',
    minutes: '~5 min',
    meta: '~5 min · 4 levels',
    description: 'Unscramble the job title. The field is your clue.',
    measures: ['Verbal reasoning', 'Processing speed'],
    levels: LEVEL_SIZES(['6 words', '8 words', '10 words', '12 words']),
    howToPlay: [
      'Read the field. It is your clue.',
      'Put the scrambled letters in order to spell the job title.',
      'Spell more titles in less time to score higher.',
    ],
    status: { kind: 'new' },
  },
  {
    id: 'three-in-a-row',
    kind: SKILL,
    title: 'Three in a Row',
    category: 'strategy',
    icon: 'target',
    minutes: '~3 min',
    meta: '~3 min · 4 levels',
    description: 'Three games against Kwaku. Think one move ahead.',
    measures: ['Strategic thinking'],
    levels: LEVEL_SIZES(['Easy Kwaku', 'Steady Kwaku', 'Sharp Kwaku', 'Ruthless Kwaku']),
    howToPlay: [
      'Take turns with Kwaku. Place your mark on the board.',
      'Get three in a row before he does.',
      'Win, draw or lose, you play three games. Your best play counts.',
    ],
    status: { kind: 'new' },
  },
  {
    id: 'grid-logic',
    kind: SKILL,
    title: 'Grid Logic',
    category: 'logic',
    icon: 'grid',
    minutes: '~5–25 min',
    meta: '~5–25 min · 4 levels',
    description: 'Fill the grid. Every row, column and box once.',
    measures: ['Logical reasoning', 'Attention to detail', 'Processing speed'],
    levels: LEVEL_SIZES(['4×4 grid', '6×6 grid', '9×9 grid', '9×9 grid, fewer clues']),
    howToPlay: [
      'Tap a square, then choose a number to place in it.',
      'Every row, column and box must hold each number once.',
      'Fill the whole grid with as few mistakes as you can.',
    ],
    status: { kind: 'new' },
  },
  {
    id: 'chess-tactics',
    kind: SKILL,
    title: 'Chess Tactics',
    category: 'strategy',
    icon: 'bolt',
    minutes: '~10 min',
    meta: '~10 min · 4 levels',
    description: 'Find the checkmate. Mate in one, then mate in two.',
    measures: ['Strategic thinking', 'Pattern recognition', 'Processing speed'],
    levels: LEVEL_SIZES(['Mate in one', 'Mate in two', 'Mate in two, harder', 'Mate in three']),
    howToPlay: [
      'Study the board. It is your move.',
      'Find the move that gives checkmate.',
      'Solve more puzzles in fewer tries to score higher.',
    ],
    status: { kind: 'new' },
  },
  {
    id: 'tower-shift',
    kind: SKILL,
    title: 'Tower Shift',
    category: 'planning',
    icon: 'building',
    minutes: '~4 min',
    meta: '~4 min · 4 levels',
    description: 'Move the tower in as few moves as you can.',
    measures: ['Planning', 'Logical reasoning', 'Processing speed'],
    levels: LEVEL_SIZES(['3 discs', '4 discs', '5 discs', '6 discs']),
    howToPlay: [
      'Move one disc at a time from the first peg to the last.',
      'Never put a bigger disc on a smaller one.',
      'Finish in fewer moves to score higher.',
    ],
    status: { kind: 'new' },
  },
  {
    id: 'errand-run',
    kind: SKILL,
    title: 'Errand Run',
    category: 'planning',
    icon: 'pin',
    minutes: '~4 min',
    meta: '~4 min · 4 levels',
    description: 'Plan the shortest route through town.',
    measures: ['Planning', 'Numerical reasoning', 'Processing speed'],
    levels: LEVEL_SIZES(['4 stops', '5 stops', '6 stops', '8 stops']),
    howToPlay: [
      'See the stops you have to visit on the map.',
      'Tap the stops in the order you will visit them.',
      'A shorter route scores higher.',
    ],
    status: { kind: 'new' },
  },
  {
    id: 'sum-grid',
    kind: SKILL,
    title: 'Sum Grid',
    category: 'logic',
    icon: 'chart',
    minutes: '~6 min',
    meta: '~6 min · 4 levels',
    description: 'Every row, every column, every cage adds up.',
    measures: ['Numerical reasoning', 'Logical reasoning', 'Attention to detail'],
    levels: LEVEL_SIZES(['4×4 grid', '5×5 grid', '6×6 grid', '7×7 grid']),
    howToPlay: [
      'Tap a square, then choose a number to place in it.',
      'Each cage must add up to the number shown on it.',
      'Fill the whole grid with as few mistakes as you can.',
    ],
    status: { kind: 'new' },
  },
  {
    id: 'chess-match',
    kind: SKILL,
    title: 'Chess Match',
    category: 'strategy',
    icon: 'trophy',
    minutes: '~15–30 min',
    meta: '~15–30 min · 4 levels',
    description: 'A short game against Kwaku. Every move counts.',
    measures: ['Strategic thinking', 'Planning', 'Attention to detail'],
    levels: LEVEL_SIZES(['Easy Kwaku', 'Steady Kwaku', 'Sharp Kwaku', 'Ruthless Kwaku']),
    howToPlay: [
      'Play a full game of chess against Kwaku.',
      'Tap a piece, then tap where it should go.',
      'Win or draw in fewer moves to score higher.',
    ],
    status: { kind: 'new' },
  },
  {
    id: 'crisis-room',
    kind: SKILL,
    title: 'Crisis Room',
    category: 'leadership',
    icon: 'warning',
    minutes: '~5 min',
    meta: '~5 min · 1 level',
    description: 'The app is down. Who do you call first?',
    measures: ['Strategic thinking', 'Processing speed'],
    levels: [],
    howToPlay: [
      'Read the alarm. The app is down and people are waiting.',
      'Choose who you call first and what you say.',
      'Quick, sensible calls score higher.',
    ],
    status: { kind: 'new' },
  },
  {
    id: 'makola-haggle',
    kind: 'playstyle',
    title: 'Makola Haggle',
    category: 'social',
    icon: 'cash',
    minutes: '~4 min',
    meta: '~4 min · 1 level',
    description: 'Bargain with Auntie Akos. Shows how you handle give and take.',
    // Card line as drawn ("Shows how you play · early read, not a score"); the details dialog has no skills block for it.
    measuresLine: 'Shows how you play · early read, not a score',
    measures: [],
    levels: [],
    howToPlay: [
      'Auntie Akos names her price for an item.',
      'Make an offer, or accept hers.',
      'There is no score. How you bargain shows how you play.',
    ],
    status: { kind: 'new' },
  },
];

export const GAMES_V2_COPY = {
  title: 'Skill games',
  verifies: 'Verifies skills',
  subtitle:
    '13 short games. Every move is checked on our servers, and a ranked play every 7 days can add Game-evidenced skills to your profile.',
  history: 'My games history',
  all: 'All',
  playStyleChip: 'Play style · early read',
  savedNote: 'Saved for 24 hours. Your timer kept running while you were away.',
  cooldownNote:
    'You can practise as much as you like until then. Practice doesn’t change your profile.',
};

export const GAME_V2_DETAILS_COPY = {
  howToPlay: 'HOW TO PLAY',
  measures: 'WHAT IT MEASURES',
  verify: 'SKILLS IT CAN VERIFY',
  verifyNote: 'A ranked score of 60 or more adds “Game-evidenced” to the skill on your profile.',
  level: 'CHOOSE A LEVEL',
  mode: 'HOW DO YOU WANT TO PLAY?',
  ranked: 'Ranked',
  rankedNote:
    'Counts towards your profile. Earns XP and skill evidence. One ranked play every 7 days.',
  practice: 'Practice',
  practiceNote: 'Play as often as you like. Doesn’t change your profile or reach recruiters.',
  fair: 'Every move is checked on GTH’s servers, so scores are fair for everyone. Need more time? Turn on Extra time in Practice.',
  back: 'Back to games',
  startRanked: 'Start ranked game',
  startPractice: 'Start practice game',
  // ⚠️ ASSUMPTION: Makola Haggle is a play style game (no ranked score), so its dialog has a single start button.
  startPlayStyle: 'Start game',
  close: 'Close',
};

export const GAME_V2_RESUME_COPY = {
  title: 'Pick up where you left off?',
  note: 'Starting again ends this game with the rounds you’ve done.',
  resume: 'Resume game',
  again: 'Start again',
};

export const GAME_V2_EXPIRED_COPY = {
  title: 'This game has ended',
  body: 'Saved games are kept for 24 hours. Your ranked game ended with the rounds you’d finished, and the result is in your history.',
  result: 'View result',
  back: 'Back to games',
};

export const gameV2ById = (id) => GAMES_V2.find((g) => g.id === id) || null;

export const countByCategory = (games = GAMES_V2) => {
  const counts = {};
  games.forEach((g) => {
    counts[g.category] = (counts[g.category] || 0) + 1;
  });
  return counts;
};

// Skills the dialog lists under "Skills it can verify" (every measured skill except speed).
export const verifiableSkills = (game) => game.measures.filter((m) => m !== NOT_VERIFIABLE);

// "Measures working memory, attention to detail and processing speed" (card line).
export const measuresLine = (game) => {
  if (game.measuresLine) return game.measuresLine;
  const names = game.measures.map((m) => m.toLowerCase());
  const head = names.slice(0, -1).join(', ');
  return `Measures ${names.length > 1 ? `${head} and ${names[names.length - 1]}` : names[0]}`;
};

// Resume dialog copy: "You have a ranked Pattern Pulse game in progress: round 5 of 8, saved 2 hours ago. It’s kept for 22 more hours."
export const resumeSentence = (game) => {
  const s = game.status.kind === 'in-progress' ? game.status : gameV2ById('pattern-pulse').status;
  return `You have a ranked ${game.title} game in progress: round ${s.resumeRound} of ${s.resumeOf}, saved ${s.savedHoursAgo} hours ago. It’s kept for ${s.keptHours} more hours.`;
};
