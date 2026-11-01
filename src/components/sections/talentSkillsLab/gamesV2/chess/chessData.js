/*
 * Chess Tactics + Chess Match data (Figma "Games v2 · 10 / 11", frames CT-01, CT-02, CM-01, CM-02). Mock payload shaped like a future
 * GET /skills-lab/games/chess-tactics/puzzles and /games/chess-match/config response.
 *
 * Drawn board (all four frames, identical): White Re1 Kg1 pa3 pf2 pg2 ph2 · Black Kg8 Rb2 pa7 pf7 pg7 ph7, rook e1 selected with dots on
 * e2-e8. FEN below. NOTE (Figma inconsistency, kept as drawn on the seeded frames only): the move lists claim "1. Re8+ Rxe8" but the
 * drawn position has no black piece that can take on e8 (Re8 is mate in one there), and the CM lists mention knights / queens /
 * bishops that are not on the board; only king, rook and pawn art exists, so every live position uses only those three.
 *
 * ⚠️ ASSUMPTION: puzzles 1-3 and 5, their leads, the 2:00 puzzle clock (inferred from "1:12 left" = "solved in 0:48"), the miss rule,
 * the Chess Match start position, the grade thresholds (see chessEngine.gradeMove) and the extra copy marked below.
 * Every puzzle is verified with chess.js (scripts: key move mates / forces mate in 2).
 */
export const DRAWN_BOARD_FEN = '6k1/p4ppp/8/8/8/P7/1r3PPP/4R1K1 w - - 0 1';
export const DRAWN_E_FILE_DOTS = ['e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8'];

export const TACTICS_BEST_SO_FAR = 80;
export const TACTICS_MEASURES = ['Strategic thinking', 'Pattern recognition', 'Processing speed'];
// ⚠️ ASSUMPTION: seconds per puzzle by level (Intermediate 2:00 inferred from the frames).
export const TACTICS_SECONDS = { beginner: 180, intermediate: 120, advanced: 90, expert: 60 };

export const TACTICS_PUZZLES = [
  {
    id: 1,
    mateIn: 1,
    fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
    lead: 'White to move. The back rank is empty.', // ⚠️ ASSUMPTION
  },
  {
    id: 2,
    mateIn: 1,
    fen: '7k/6pp/8/8/8/8/5PPP/R5K1 w - - 0 1',
    lead: 'White to move. The open file leads straight to the king.', // ⚠️ ASSUMPTION
  },
  {
    id: 3,
    mateIn: 1,
    fen: '7k/R7/8/8/8/8/8/1R4K1 w - - 0 1',
    lead: 'White to move. One rook cuts off the king, the other gives mate.', // ⚠️ ASSUMPTION
  },
  {
    id: 4,
    mateIn: 2,
    // ⚠️ ASSUMPTION: the drawn position cannot give the drawn line (see note), so puzzle 4 keeps the drawn pieces (king, pawns,
    // Re1) and adds a second white rook on e2 and the black rook on a8 so that 1. Re8+ Rxe8 2. Rxe8# really works.
    fen: 'r5k1/p4ppp/8/8/8/P7/4RPPP/4R1K1 w - - 0 1',
    lead: 'White to move. Black’s king is boxed in by its own pawns.',
  },
  {
    id: 5,
    mateIn: 2,
    fen: '6k1/4rppp/5p2/8/8/8/3R1PPP/5RK1 w - - 0 1',
    lead: 'White to move. Check first, then finish it.', // ⚠️ ASSUMPTION
  },
];

export const TACTICS_COPY = {
  playTip: 'Click a piece, then click a square. Every move is checked on the server.',
  solvedTip: 'Checks first: forcing moves leave your opponent no choice.',
  wrongTry: 'Not forcing enough. That move does not lead to mate. Try again.', // ⚠️ ASSUMPTION
};

export const tacticsTitle = (mateIn) =>
  mateIn === 2 ? 'Find checkmate in two moves.' : 'Find checkmate in one move.'; // ⚠️ ASSUMPTION for mate in 1
export const tacticsSolvedMessage = (mateIn) => `Checkmate in ${mateIn}. Puzzle solved.`;

// Frame seeds. `seconds` = clock of the frame; rows = the move list as drawn.
export const TACTICS_SEEDS = {
  'CT-01': {
    puzzleIdx: 3,
    fen: DRAWN_BOARD_FEN,
    selected: 'e1',
    dots: DRAWN_E_FILE_DOTS,
    results: ['ok', 'ok', 'ok'],
    seconds: 72,
    rows: [{ n: 1, san: 'Re8+', grade: 'best', reply: 'Rxe8' }],
    solved: false,
  },
  'CT-02': {
    puzzleIdx: 3,
    fen: DRAWN_BOARD_FEN,
    selected: 'e1',
    dots: DRAWN_E_FILE_DOTS,
    results: ['ok', 'ok', 'ok'],
    seconds: 72,
    rows: [
      { n: 1, san: 'Re8+', grade: 'best', reply: 'Rxe8' },
      { n: 2, san: 'Rxe8#', grade: 'best', reply: null },
    ],
    solved: true,
  },
};

// ---------------------------------------------------------------- Chess Match
export const MATCH_MOVES = 30;
export const MATCH_MEASURES = ['Strategic thinking', 'Planning', 'Attention to detail'];
// ⚠️ ASSUMPTION: balanced rook ending (R + 5 pawns each), white (the player) to move, move 1.
export const MATCH_START_FEN = '4rk2/pp3ppp/8/8/8/PP6/5PPP/4RK2 w - - 0 1';
export const MATCH_COPY = {
  title: 'Your move.',
  lead: 'Every move gets a grade. Find the best one, not just a safe one.',
  askTip: 'Before you move, ask: what can Kwaku take next?',
  defaultTip: 'Checks, captures, threats: look at all three before you move.', // ⚠️ ASSUMPTION
  plays: 'Kwaku plays well', // drawn pass-mark chip; ⚠️ ASSUMPTION: static
};
export const GRADE_LABEL = {
  best: 'Best',
  good: 'Good',
  inaccuracy: 'Inaccuracy',
  blunder: 'Blunder',
};

// Seeds: the exact drawn lists. `override` replaces the live numbers until the first move.
export const MATCH_SEEDS = {
  'CM-01': {
    fen: '6k1/p4ppp/8/8/8/P7/1r3PPP/4R1K1 w - - 0 14',
    rows: [
      { n: 12, san: 'Nf3', grade: 'good', reply: 'Bg4' },
      { n: 13, san: 'Qd2', grade: 'inaccuracy', reply: 'Bxf3' },
    ],
    movesLeft: 16,
    material: 'You +2',
    summary: 'You’re ahead by 2 points',
    tip: 'Inaccuracy on move 13: Be2 kept your knight safe.',
    chip: null,
    selected: 'e1',
    dots: DRAWN_E_FILE_DOTS,
  },
  'CM-02': {
    fen: '6k1/p4ppp/8/8/8/P7/1r3PPP/4R1K1 w - - 0 15',
    rows: [
      { n: 13, san: 'Qd2', grade: 'inaccuracy', reply: 'Bxf3' },
      { n: 14, san: 'Qg5', grade: 'blunder', reply: 'Rxg5' },
    ],
    movesLeft: 15,
    material: 'Kwaku +7',
    summary: 'Kwaku is ahead by 7',
    tip: 'Before you move, ask: what can Kwaku take next?',
    chip: 'Blunder: your queen was open. Kwaku took it.',
    selected: 'e1',
    dots: DRAWN_E_FILE_DOTS,
  },
};
