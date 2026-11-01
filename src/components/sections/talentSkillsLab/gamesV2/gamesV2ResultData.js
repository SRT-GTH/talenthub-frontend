/*
 * gamesV2ResultData — copy + mock numbers of the Games v2 result card (Figma GV-10 Result · Ranked, GV-11 under 18, GV-12 Makola Haggle
 * play style). Shaped like a future `GET /skills-lab/games/:id/results/:runId`. What the frames draw is exact; everything computed from a
 * real run (percentile, XP, cohort, personal best) is a mock — ⚠️ ASSUMPTION, tagged below.
 */

export const GAME_V2_NAMES = {
  'memory-match': 'Memory Match',
  'pattern-pulse': 'Pattern Pulse',
  'word-shuffle': 'Word Shuffle',
  'switch-sort': 'Switch Sort',
  'three-in-a-row': 'Three in a Row',
  'grid-logic': 'Grid Logic',
  'sum-grid': 'Sum Grid',
  'tower-shift': 'Tower Shift',
  'errand-run': 'Errand Run',
  'chess-tactics': 'Chess Tactics',
  'chess-match': 'Chess Match',
  'crisis-room': 'Crisis Room',
  'makola-haggle': 'Makola Haggle',
};

/* The icon in the card's tile is the same glyph as the game's tile on the Games tab (GV-01). */
export const GAME_V2_TILE_ICONS = {
  'memory-match': 'grid',
  'pattern-pulse': 'trend',
  'word-shuffle': 'book',
  'switch-sort': 'repeat',
  'three-in-a-row': 'target',
  'grid-logic': 'grid',
  'sum-grid': 'chart',
  'tower-shift': 'building',
  'errand-run': 'pin',
  'chess-tactics': 'bolt',
  'chess-match': 'trophy',
  'crisis-room': 'warning',
  'makola-haggle': 'cash',
};

/* GV-10 / GV-11 exactly as drawn (also what a result card with no stored run shows). */
export const GAME_V2_DRAWN_RESULT = {
  gameId: 'memory-match',
  level: 'intermediate',
  score: 82,
  skills: [
    { label: 'Working memory', value: 85 },
    { label: 'Attention to detail', value: 80 },
    { label: 'Processing speed', value: 77 },
  ],
  summary: 'Found all 10 pairs in 14 turns (fewest possible: 10).',
  verifies: 'Working memory',
  percentileLine: 'Top 30% of talents your age',
  minorLine: 'Your best yet · up 9 from last time',
  xp: 50,
};

/* GV-12 exactly as drawn. */
export const GAME_V2_DRAWN_PLAY_STYLE = {
  gameId: 'makola-haggle',
  level: 'intermediate',
  read: 'You held firm on price and walked away twice when the offer was poor. You were warm with traders and kept the deal moving.',
  tags: ['Firm on value', 'Builds rapport'],
};

export const GAME_V2_RESULT_COPY = {
  rankedKicker: 'RANKED RESULT',
  practiceKicker: 'PRACTICE RESULT', // ⚠️ ASSUMPTION: only RANKED RESULT is drawn; practice reuses the pattern
  playStyleKicker: 'PLAY STYLE · EARLY READ',
  outOf: 'out of 100',
  evidence: (skill) => `${skill} is now Game-evidenced on your profile.`,
  compared: 'Compared with 1,240 ranked results from talents aged 18–24.',
  comparedMinor:
    'We compare your score with your own past games. Rankings against others start when you turn 18.',
  practiceNote: 'Practice games are never shown to recruiters.', // the GV-05 footer sentence, reused as the practice chip
  readTitle: 'How you played',
  playStyleNote:
    'This is an early read from one game, not a score. It isn’t shown to recruiters and doesn’t rank you against anyone.',
  back: 'Back to games',
  again: 'Practise again',
  askBuddy: 'Ask Career Buddy about this',
};

/* ⚠️ ASSUMPTION — mock personal best and score → percentile / XP. 82 → "Top 30%" and "+50 XP" as drawn. */
export const GAME_V2_PERSONAL_BEST = 82;
export const GAME_V2_PREVIOUS_BEST = 73; // "up 9 from last time" (82 − 73)
export const percentileFor = (score) => Math.max(1, Math.round((100 - score) * (5 / 3)));
export const xpFor = (score) => Math.round(score * 0.61);
/* The score a ranked result must reach to verify the game's skill ("Game-evidenced", brief: ≥ 80). */
export const VERIFY_SCORE = 80;

/* ⚠️ ASSUMPTION — the under-18 flag is a mock: `?f=GV-11` or `?minor=1` (a real build reads the talent's age). */
export const isMinorFlag = (frame) => {
  if (frame === 'GV-11') return true;
  try {
    return new URLSearchParams(window.location.search).get('minor') === '1';
  } catch {
    return false;
  }
};

export const levelLabel = (level) =>
  level ? level.charAt(0).toUpperCase() + level.slice(1) : 'Intermediate';
