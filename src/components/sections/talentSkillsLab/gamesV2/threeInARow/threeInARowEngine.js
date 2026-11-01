/*
 * Three in a Row — pure board logic. Cells are indexed 0–8 row by row; a board is an array of 9 × 'X' | 'O' | null.
 * The player is X (and starts every game, drawn: "Game 3 starts with you"); Kwaku is O.
 */
export const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/** → { mark, line } of the first completed line, else null. */
export const winnerOf = (board) => {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return { mark: board[a], line };
  }
  return null;
};

export const emptyCells = (board) => board.reduce((out, v, i) => (v ? out : [...out, i]), []);
export const isFull = (board) => emptyCells(board).length === 0;

/* Minimax with depth preference (win sooner / lose later). Score from O's (Kwaku's) point of view. */
const minimax = (board, turn, depth) => {
  const w = winnerOf(board);
  if (w) return w.mark === 'O' ? 10 - depth : depth - 10;
  if (isFull(board)) return 0;
  const scores = emptyCells(board).map((cell) => {
    const next = board.slice();
    next[cell] = turn;
    return minimax(next, turn === 'O' ? 'X' : 'O', depth + 1);
  });
  return turn === 'O' ? Math.max(...scores) : Math.min(...scores);
};

/** Every empty cell with its minimax score for O (best first). */
export const rankMoves = (board) =>
  emptyCells(board)
    .map((cell) => {
      const next = board.slice();
      next[cell] = 'O';
      return { cell, score: minimax(next, 'X', 1) };
    })
    .sort((a, b) => b.score - a.score);

/* A cell that completes a line for `mark` right now, or -1. */
const finishingCell = (board, mark) => {
  for (const [a, b, c] of LINES) {
    const trio = [a, b, c];
    const marks = trio.filter((i) => board[i] === mark).length;
    const empty = trio.filter((i) => !board[i]);
    if (marks === 2 && empty.length === 1) return empty[0];
  }
  return -1;
};

/*
 * kwakuMove — how Kwaku picks a cell. Simple but beatable (⚠️ ASSUMPTION: the per-level behaviour and slip chances):
 *   beginner     slips (random cell) 55 % of the time, otherwise takes a win / blocks / random
 *   intermediate slips 10 %; otherwise wins, blocks the obvious line, then takes the centre / a random cell — he does NOT look
 *                two moves ahead, so a fork (two ways to win, TR-02) beats him   ("blocks the obvious lines, so think one move ahead")
 *   advanced     slips 8 %; otherwise the best minimax move
 *   expert       never slips: pure minimax (cannot be beaten; a draw is the best the player can get)
 */
export const SLIP_CHANCE = { beginner: 0.55, intermediate: 0.1, advanced: 0.08, expert: 0 };

export const kwakuMove = (board, level, rng = Math.random) => {
  const open = emptyCells(board);
  if (!open.length) return -1;
  const pickRandom = () => open[Math.floor(rng() * open.length)];
  if (rng() < (SLIP_CHANCE[level] ?? SLIP_CHANCE.intermediate)) return pickRandom();
  if (level === 'advanced' || level === 'expert') {
    const ranked = rankMoves(board);
    const best = ranked.filter((m) => m.score === ranked[0].score);
    return best[Math.floor(rng() * best.length)].cell;
  }
  const win = finishingCell(board, 'O');
  if (win >= 0) return win;
  const block = finishingCell(board, 'X');
  if (block >= 0) return block;
  if (level === 'intermediate' && !board[4]) return 4;
  return pickRandom();
};
