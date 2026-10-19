/*
 * Chess Blitz mock data — Figma SL-GS11 "Puzzle 4" (Playful 7943:8743 / Focused 8110:496629). Shaped like
 * `GET /skills-lab/games/chess-blitz` (puzzles) + `POST …/puzzles/:n/move`.
 *
 * DRAWN: puzzle 4 — Black Kg8, pawns a7 f7 g7 h7, rook b2; White Kg1, Re1, pawns a3 f2 g2 h2; the four moves Re8# (selected) /
 * h3 / Kf1 / Ra1 with their one-line descriptions; the "Re8#" preview (the e1 rook highlighted, dots along the e-file), "YOU
 * 0:41", "PUZZLE PAR 0:45", the tip, "3 of 4 solved", "3 solved · avg 38s", header copy.
 * ⚠️ ASSUMPTION: the highlight/dots shown for h3, Kf1 and Ra1 (derived from the move); puzzles 1, 2, 3 and 5 (positions use only
 * the pieces Figma draws — king, rook, pawn — all back-rank mates; their move lists and copy); a 60 s clock per puzzle (the
 * drawn 0:41 is "time left"); 0:00 = puzzle lost; +20 XP per solve / +20 pass bonus; the feedback copy; "Flip board".
 *
 * Squares are algebraic ("e1"). pieces: [square, piece] with piece = b|w + k|r|p.
 */
export const CHESS_BLITZ = {
  gameId: 'chess-blitz',
  title: 'Skills Lab · Chess Blitz',
  label: 'Chess Blitz',
  subtitle: 'Strategic thinking · 5 puzzles · Pass 4 to earn Verified',
  skill: 'Strategic thinking',
  total: 5,
  passMark: 4,
  seconds: 60,
  par: 45,
  baseXp: 240,
  streakDays: 7,
  solveXp: 20,
  passBonusXp: 20,
  checks: ['Spotting threats', 'Committing to a plan'],
  tip: 'Checks, captures, threats. Look at forcing moves first.',
  prompt: 'Black’s king is boxed in by its own pawns. White to move.',
};

const file = (f, from, to) => {
  const n = Math.abs(to - from);
  const step = to > from ? 1 : -1;
  return Array.from({ length: n }, (_, i) => `${f}${from + step * (i + 1)}`);
};
const rank = (r, from, to) => {
  const letters = 'abcdefgh';
  const a = letters.indexOf(from);
  const b = letters.indexOf(to);
  const step = b > a ? 1 : -1;
  return Array.from({ length: Math.abs(b - a) }, (_, i) => `${letters[a + step * (i + 1)]}${r}`);
};

const opt = (san, desc, from, path) => ({ san, desc, from, path });

export const PUZZLES = [
  {
    // ⚠️ ASSUMPTION (puzzle 1)
    topic: 'Spotting threats',
    pieces: [
      ['g8', 'bk'],
      ['f7', 'bp'],
      ['g7', 'bp'],
      ['h7', 'bp'],
      ['g1', 'wk'],
      ['d1', 'wr'],
      ['f2', 'wp'],
      ['g2', 'wp'],
      ['h2', 'wp'],
    ],
    options: [
      opt('Rd8#', 'Rook to the back rank, mate', 'd1', file('d', 1, 8)),
      opt('Rd7', 'Rook to the seventh rank', 'd1', file('d', 1, 7)),
      opt('h3', 'Give your king some air', 'h2', ['h3']),
      opt('Kf1', 'Step the king to safety', 'g1', ['f1']),
    ],
    answer: 0,
    explain:
      'The black king has no escape square: f7, g7 and h7 are its own pawns, so a rook on d8 is mate.',
  },
  {
    // ⚠️ ASSUMPTION (puzzle 2)
    topic: 'Committing to a plan',
    pieces: [
      ['h8', 'bk'],
      ['g7', 'bp'],
      ['h7', 'bp'],
      ['f7', 'bp'],
      ['g1', 'wk'],
      ['a1', 'wr'],
      ['f2', 'wp'],
      ['g2', 'wp'],
      ['h2', 'wp'],
    ],
    options: [
      opt('Ra8#', 'Rook to the back rank, mate', 'a1', file('a', 1, 8)),
      opt('Ra7', 'Attack the pawns on the seventh', 'a1', file('a', 1, 7)),
      opt('Kh1', 'Tuck the king in the corner', 'g1', ['h1']),
      opt('g3', 'Give your king some air', 'g2', ['g3']),
    ],
    answer: 0,
    explain: 'The a-file is open, and the black king on h8 is boxed in by g7 and h7. Ra8 is mate.',
  },
  {
    // ⚠️ ASSUMPTION (puzzle 3)
    topic: 'Spotting threats',
    pieces: [
      ['g8', 'bk'],
      ['f7', 'bp'],
      ['g7', 'bp'],
      ['h7', 'bp'],
      ['g1', 'wk'],
      ['c1', 'wr'],
      ['f2', 'wp'],
      ['g2', 'wp'],
      ['h2', 'wp'],
    ],
    options: [
      opt('Rc8#', 'Rook to the back rank, mate', 'c1', file('c', 1, 8)),
      opt('Rc7', 'Rook to the seventh rank', 'c1', file('c', 1, 7)),
      opt('Rb1', 'Slide the rook along the back rank', 'c1', rank(1, 'c', 'b')),
      opt('Kh1', 'Step the king to safety', 'g1', ['h1']),
    ],
    answer: 0,
    explain:
      'Nothing stops a rook reaching c8 and the king cannot step away. Always check the back rank first.',
  },
  {
    // DRAWN (puzzle 4, Figma SL-GS11)
    topic: 'Committing to a plan',
    pieces: [
      ['g8', 'bk'],
      ['b2', 'br'],
      ['a7', 'bp'],
      ['f7', 'bp'],
      ['g7', 'bp'],
      ['h7', 'bp'],
      ['g1', 'wk'],
      ['e1', 'wr'],
      ['a3', 'wp'],
      ['f2', 'wp'],
      ['g2', 'wp'],
      ['h2', 'wp'],
    ],
    options: [
      opt('Re8#', 'Rook to the back rank, mate', 'e1', file('e', 1, 8)),
      opt('h3', 'Give your king some air', 'h2', ['h3']),
      opt('Kf1', 'Step the king to safety', 'g1', ['f1']),
      opt('Ra1', 'Attack the rook on b2', 'e1', rank(1, 'e', 'a')),
    ],
    answer: 0,
    explain:
      'The black rook on b2 is a distraction. The king on g8 is boxed in by its own pawns, so Re8 ends the game.',
  },
  {
    // ⚠️ ASSUMPTION (puzzle 5)
    topic: 'Spotting threats',
    pieces: [
      ['h8', 'bk'],
      ['g7', 'bp'],
      ['h7', 'bp'],
      ['a7', 'bp'],
      ['g1', 'wk'],
      ['b1', 'wr'],
      ['a2', 'wp'],
      ['g2', 'wp'],
      ['h2', 'wp'],
    ],
    options: [
      opt('Rb7', 'Attack the pawn on a7', 'b1', file('b', 1, 7)),
      opt('Rb8#', 'Rook to the back rank, mate', 'b1', file('b', 1, 8)),
      opt('Kh1', 'Tuck the king in the corner', 'g1', ['h1']),
      opt('a3', 'Push the a-pawn', 'a2', ['a3']),
    ],
    answer: 1,
    explain: 'The b-file is open: a rook on b8 is check and the king on h8 has no square.',
  },
];

/* Figma seed (?f=GS11): puzzle 4, three solved (36 s, 41 s, 37 s → avg 38 s), Re8# picked, 0:41 on the clock. */
export const CHESS_FRAMES = {
  GS11: { index: 3, results: ['ok', 'ok', 'ok'], times: [36, 41, 37], picked: 0, seconds: 41 },
};
