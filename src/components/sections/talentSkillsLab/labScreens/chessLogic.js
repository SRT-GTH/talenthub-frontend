import { debug } from '../../../../utils/debug.js';
import { PIECE_NAME, applyMove, encodeMove } from './chessData.js';

const log = debug('chessLogic');

/*
 * Chess flow state. The engine (useLabAttempt) only learns the final outcome; the board interaction lives in `draft`:
 *   draft = { from, to, fails, shown }   from/to = tapped squares, fails = wrong moves so far (2 = puzzle missed),
 *                                        shown = the last wrong move is on the board with its explanation (button "Try again")
 * and when the puzzle is over `attempt.selected` holds 'from-to' (solved), 'miss:from-to' (second wrong move) or 'giveup'.
 * ⚠️ ASSUMPTION: Figma draws "Your move · Rook on e1 selected", "Your move · Hint shown", "Checkmate · Re8#" and
 * "Not mate · 1 try left" only. The other status lines below are invented in the same voice.
 */
/* The puzzle on screen: question.body.puzzle — from the API (no solution until revealed) or the dev-only demo flow. */
export const puzzleFor = (attempt) => attempt.question?.body?.puzzle;

const YELLOW_FROM = 'rgba(255,216,107,0.55)';
const YELLOW_TO = 'rgba(255,216,107,0.75)';
const RED_KING = 'rgba(192,57,43,0.55)';

export const chessView = ({ attempt, draft, puzzle, t }) => {
  const { answered, status, selected, hintUsed, flow } = attempt;
  const fails = draft.fails ?? 0;
  const base = { pieces: puzzle.pieces, selected: null, dots: [], marks: [], arrow: null };
  let view;
  let state = 'play';

  if (answered) {
    const solved = status === 'correct';
    state = solved ? 'solved' : 'missed';
    const [fromSq, toSq] = puzzle.answer.split('-');
    view = {
      ...base,
      pieces: applyMove(puzzle.pieces, fromSq, toSq),
      marks: [
        ...(puzzle.mateSq ? [{ sq: puzzle.mateSq, color: RED_KING }] : []),
        { sq: toSq, color: YELLOW_TO },
        { sq: fromSq, color: YELLOW_FROM },
      ],
    };
    if (solved) {
      view.status = { tone: 'ok', text: `${puzzle.word} · ${puzzle.san}` };
      view.feedback = {
        tone: 'correct',
        title: t(`${puzzle.word} · +{n} {xp}`, { n: flow.correctXp }),
        sticker: t('+{n} {xp}', { n: flow.correctXp }),
        body: puzzle.explain,
      };
      view.kofiSub = 'White · won';
    } else {
      view.status = { tone: 'bad', text: `Puzzle missed · ${puzzle.san}` };
      view.feedback = {
        tone: 'wrong',
        title: `Not this time. The answer was ${puzzle.san}.`,
        body: puzzle.explain,
      };
      view.kofiSub = 'White · missed';
    }
    log('view answered', { solved, selected });
    return { ...view, state };
  }

  const { from, to, shown } = draft;
  if (shown && from && to) {
    state = 'failed';
    const mv = encodeMove(from, to);
    view = {
      ...base,
      pieces: applyMove(puzzle.pieces, from, to),
      marks: [
        { sq: to, color: 'rgba(192,57,43,0.5)' },
        { sq: from, color: 'rgba(255,216,107,0.45)' },
      ],
      status: { tone: 'bad', text: `Not mate · ${2 - fails} try left` },
      feedback: { tone: 'wrong', ...(puzzle.wrong[mv] ?? puzzle.wrong.default) },
      kofiSub: 'White · your move',
    };
    return { ...view, state };
  }

  view = { ...base, kofiSub: 'White · your move' };
  if (from) {
    view.selected = from;
    const piece = puzzle.pieces.find((p) => p.sq === from);
    if (to) {
      view.pieces = applyMove(puzzle.pieces, from, to);
      view.selected = null;
      view.marks = [
        { sq: to, color: YELLOW_TO },
        { sq: from, color: YELLOW_FROM },
      ];
      view.status = {
        tone: 'ok',
        text: `Your move · ${PIECE_NAME[piece.t]} ${from} to ${to}`,
      };
    } else {
      view.dots = puzzle.targets[from] ?? [];
      view.status = { tone: 'ok', text: `Your move · ${PIECE_NAME[piece.t]} on ${from} selected` };
    }
  } else {
    view.status = { tone: 'ok', text: 'Your move · Tap a piece' };
  }
  if (fails > 0 && !from) view.status = { tone: 'bad', text: `Your move · ${2 - fails} try left` };
  if (hintUsed) {
    if (!to) view.status = { tone: 'amber', text: 'Your move · Hint shown' };
    if (puzzle.hintArrow && !to) view.arrow = puzzle.hintArrow;
    if (puzzle.hintArrow && !to) view.dots = [];
  }
  return { ...view, state };
};

/* Tap on a square while the puzzle is still being played. */
export const tapSquare = ({ sq, draft, puzzle, setDraft }) => {
  if (draft.shown) return;
  const { from, to } = draft;
  const mine = puzzle.pieces.find((p) => p.sq === sq && p.c === 'w' && puzzle.targets[sq]);
  if (from && !to && puzzle.targets[from]?.includes(sq)) {
    log('target', sq);
    setDraft({ to: sq });
  } else if (from && to && puzzle.targets[from]?.includes(sq)) {
    setDraft({ to: sq });
  } else if (sq === from) {
    setDraft({ from: null, to: null });
  } else if (mine) {
    log('select piece', sq);
    setDraft({ from: sq, to: null });
  }
};
