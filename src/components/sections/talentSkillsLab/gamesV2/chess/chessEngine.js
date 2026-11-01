import { Chess } from 'chess.js';
import { debug } from '../../../../../utils/debug.js';

const log = debug('chessEngine');

/* Pure chess helpers for Chess Tactics + Chess Match. Only king / rook / pawn art is drawn in Figma, so every position here uses
   only those pieces and a pawn that reaches the last rank always promotes to a rook (⚠️ ASSUMPTION: no queen art exists). */
export const PIECE_VALUE = { p: 1, r: 5, k: 0 };
export const PIECE_NAME = { p: 'pawn', r: 'rook', k: 'king' };

/** Legal moves with promotions limited to a rook. */
export const legalMoves = (chess) =>
  chess.moves({ verbose: true }).filter((m) => !m.promotion || m.promotion === 'r');

/** White minus black material in pawns (rook 5, pawn 1). */
export const materialDiff = (chess) =>
  chess
    .board()
    .reduce(
      (sum, rank) =>
        sum +
        rank.reduce(
          (n, sq) => (sq ? n + (sq.color === 'w' ? 1 : -1) * (PIECE_VALUE[sq.type] ?? 0) : n),
          0
        ),
      0
    );

/** The side to move can force mate within `n` of its own moves (every reply of the opponent is covered). */
export const mateIn = (chess, n) => {
  if (n <= 0) return false;
  return legalMoves(chess).some((m) => {
    chess.move(m);
    let ok;
    if (chess.isCheckmate()) ok = true;
    else if (n === 1 || chess.isDraw() || chess.isStalemate()) ok = false;
    else {
      const replies = legalMoves(chess);
      ok = replies.length > 0;
      for (let i = 0; ok && i < replies.length; i += 1) {
        chess.move(replies[i]);
        ok = mateIn(chess, n - 1);
        chess.undo();
      }
    }
    chess.undo();
    return ok;
  });
};

// every reply of the side to move still allows a mate in n
const coversAll = (chess, n) => {
  const replies = legalMoves(chess);
  if (!replies.length) return false;
  return replies.every((r) => {
    chess.move(r);
    const ok = mateIn(chess, n);
    chess.undo();
    return ok;
  });
};

/** `move` (legal in `chess`) mates now, or leaves a position where every reply still allows mate in n - 1 more moves. */
const forcesMate = (chess, move, n) => {
  chess.move(move);
  let ok;
  if (chess.isCheckmate()) ok = true;
  else if (n <= 1 || chess.isDraw() || chess.isStalemate()) ok = false;
  else ok = coversAll(chess, n - 1);
  chess.undo();
  return ok;
};

/** Verbose first moves of `fen` that force mate within `n` moves (used to verify puzzles and to judge the player's move). */
export const forcedMateMoves = (fen, n) => {
  const chess = new Chess(fen);
  return legalMoves(chess).filter((m) => forcesMate(chess, m, n));
};

/** `chess` is the position after the player's forcing move; returns the opponent reply Kwaku plays (first legal one). */
export const forcedReply = (chess) => legalMoves(chess)[0] ?? null;

/** Material (from the mover's side) after `move` and the opponent's best answer; mate = ±100. */
const scoreMove = (chess, move) => {
  const mover = chess.turn();
  const sign = mover === 'w' ? 1 : -1;
  chess.move(move);
  let value;
  if (chess.isCheckmate()) value = 100;
  else if (chess.isDraw() || chess.isStalemate()) value = 0;
  else {
    value = Infinity;
    legalMoves(chess).forEach((r) => {
      chess.move(r);
      const v = chess.isCheckmate() ? -100 : sign * materialDiff(chess);
      if (v < value) value = v;
      chess.undo();
    });
    if (value === Infinity) value = 0;
  }
  chess.undo();
  return value;
};

/**
 * Grade the move just played (⚠️ ASSUMPTION: a cheap 2-ply material evaluation, not an engine).
 *   delta = best score - played score:  >= 3 Blunder · >= 1 Inaccuracy · 0 and capture / check / unique best = Best · else Good.
 * `fen` is the position BEFORE the move, `played` = { from, to, promotion? }. Returns { grade, bestSan, delta }.
 */
export const gradeMove = (fen, played) => {
  const chess = new Chess(fen);
  const moves = legalMoves(chess);
  const scored = moves.map((m) => ({ m, v: scoreMove(chess, m) }));
  const best = Math.max(...scored.map((s) => s.v));
  const bests = scored.filter((s) => s.v === best);
  const mine =
    scored.find(
      (s) =>
        s.m.from === played.from &&
        s.m.to === played.to &&
        (s.m.promotion ?? '') === (played.promotion ?? '')
    ) ?? scored[0];
  const delta = best - mine.v;
  let grade;
  if (delta >= 3) grade = 'blunder';
  else if (delta >= 1) grade = 'inaccuracy';
  else if (
    bests.length === 1 ||
    mine.m.isCapture() ||
    mine.m.san.includes('+') ||
    mine.m.san.includes('#')
  )
    grade = 'best';
  else grade = 'good';
  log('grade', { played: mine.m.san, best: bests[0].m.san, delta, grade });
  return { grade, bestSan: bests[0].m.san, delta };
};

/** Kwaku, the weak opponent (⚠️ ASSUMPTION per level): beginner random · intermediate prefers captures · advanced / expert look 2 plies. */
export const kwakuMove = (chess, level) => {
  const moves = legalMoves(chess);
  if (!moves.length) return null;
  const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];
  if (level === 'beginner') return pickRandom(moves);
  if (level === 'advanced' || level === 'expert') {
    const scored = moves.map((m) => ({ m, v: scoreMove(chess, m) }));
    const best = Math.max(...scored.map((s) => s.v));
    return pickRandom(scored.filter((s) => s.v === best)).m;
  }
  const captures = moves.filter((m) => m.isCapture());
  if (!captures.length) return pickRandom(moves);
  const top = Math.max(...captures.map((m) => PIECE_VALUE[m.captured] ?? 0));
  return pickRandom(captures.filter((m) => (PIECE_VALUE[m.captured] ?? 0) === top));
};
