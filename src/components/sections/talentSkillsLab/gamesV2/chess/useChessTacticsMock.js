import { useCallback, useEffect, useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import { debug } from '../../../../../utils/debug.js';
import { formatClock, useGameClock } from '../useGameClock.js';
import { useGameV2Params } from '../gamesV2State.js';
import { GameCheckCircleIcon, GameClockIcon } from '../planningShared/PlanningChessIcons.jsx';
import {
  TACTICS_BEST_SO_FAR,
  TACTICS_COPY,
  TACTICS_MEASURES,
  TACTICS_PUZZLES,
  TACTICS_SECONDS,
  TACTICS_SEEDS,
  tacticsSolvedMessage,
  tacticsTitle,
} from './chessData.js';
import { forcedMateMoves, forcedReply, legalMoves } from './chessEngine.js';

const log = debug('ChessTacticsMock');
export const TACTICS_TOTAL = TACTICS_PUZZLES.length;

const freshPuzzle = (idx) => ({
  idx,
  fen: TACTICS_PUZZLES[idx].fen,
  rows: [],
  selected: null,
  dots: null,
  misses: 0,
  status: 'play',
  feedback: null,
});

/*
 * useChessTacticsMock — the local Chess Tactics run for the drawn Figma frames (`?f=CT-01|CT-02`) and `?demo=1`: local puzzles,
 * the local 2-ply checker (chessEngine.js) and a local score. Returns the same shape as useChessTacticsLive (ChessTacticsBoard).
 */
export const useChessTacticsMock = (frame) => {
  const g = useGameV2Params();
  const seed = frame ? TACTICS_SEEDS[frame] : null;
  const seconds = TACTICS_SECONDS[g.level] ?? TACTICS_SECONDS.intermediate;
  const [state, setState] = useState(() =>
    seed
      ? {
          ...freshPuzzle(seed.puzzleIdx),
          fen: seed.fen,
          rows: seed.rows,
          selected: seed.selected,
          dots: seed.dots,
          status: seed.solved ? 'solved' : 'play',
        }
      : freshPuzzle(0)
  );
  const [results, setResults] = useState(() => (seed ? seed.results : []));
  const [times, setTimes] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const [frozen, setFrozen] = useState(Boolean(seed));

  const puzzle = TACTICS_PUZZLES[state.idx];
  const solved = state.status === 'solved';
  const clock = useGameClock({
    start: seed ? seed.seconds : seconds,
    direction: 'down',
    running: !g.modal && !solved && !frozen,
    onEnd: () => {
      log('time is up → modal');
      g.openModal('timeup');
    },
  });
  const timedOut = clock.ended;
  const elapsed = seconds - clock.seconds;
  const chess = useMemo(() => new Chess(state.fen), [state.fen]);
  const targets = useMemo(() => {
    if (!state.selected) return [];
    if (state.dots) return state.dots.map((square) => ({ square, capture: false }));
    return legalMoves(chess)
      .filter((m) => m.from === state.selected)
      .map((m) => ({ square: m.to, capture: m.isCapture() }));
  }, [chess, state.selected, state.dots]);

  useEffect(() => {
    log('mount', { level: g.level, puzzle: puzzle.id, mateIn: puzzle.mateIn, seconds, frame });
  }, [g.level, puzzle.id, puzzle.mateIn, seconds, frame]);

  const onSquare = useCallback(
    (square) => {
      if (solved || timedOut || g.modal) return;
      const piece = chess.get(square);
      const turn = chess.turn();
      const legal = legalMoves(chess);
      if (state.selected) {
        const move = legal.find((m) => m.from === state.selected && m.to === square);
        if (move) {
          const remaining = puzzle.mateIn - state.rows.length;
          const good = forcedMateMoves(state.fen, remaining).some(
            (m) => m.from === move.from && m.to === move.to
          );
          log('move', move.san, { remaining, good });
          if (!good) {
            setState((s) => ({
              ...s,
              selected: null,
              dots: null,
              misses: s.misses + 1,
              feedback: { tone: 'error', text: TACTICS_COPY.wrongTry },
            }));
            return;
          }
          const next = new Chess(state.fen);
          const played = next.move({ from: move.from, to: move.to, promotion: move.promotion });
          const row = { n: state.rows.length + 1, san: played.san, grade: 'best', reply: null };
          if (next.isCheckmate()) {
            log('checkmate → solved');
            setState((s) => ({
              ...s,
              fen: next.fen(),
              rows: [...s.rows, row],
              selected: null,
              dots: null,
              status: 'solved',
              feedback: null,
            }));
            setTimes((t) => [...t, { elapsed, limit: seconds }]);
            return;
          }
          const reply = forcedReply(next);
          const replied = next.move(reply);
          log('forced reply', replied.san);
          setState((s) => ({
            ...s,
            fen: next.fen(),
            rows: [...s.rows, { ...row, reply: replied.san }],
            selected: null,
            dots: null,
            feedback: null,
          }));
          return;
        }
        if (piece && piece.color === turn && square !== state.selected) {
          setState((s) => ({ ...s, selected: square, dots: null, feedback: null }));
          return;
        }
        setState((s) => ({ ...s, selected: null, dots: null }));
        return;
      }
      if (piece && piece.color === turn) {
        log('select', square);
        setState((s) => ({ ...s, selected: square, dots: null, feedback: null }));
      }
    },
    [solved, timedOut, g.modal, chess, state, puzzle.mateIn, elapsed, seconds]
  );

  const finalResults = solved ? [...results, state.misses ? 'bad' : 'ok'] : results;
  const solvedCount = finalResults.filter((r) => r === 'ok').length;

  const buildResult = (list, timeList) => {
    const ratio = Math.round((100 * list.filter((r) => r === 'ok').length) / TACTICS_TOTAL);
    const speed = timeList.length
      ? Math.round(
          timeList.reduce((n, t) => n + (100 * (t.limit - t.elapsed)) / t.limit, 0) / TACTICS_TOTAL
        )
      : 0;
    return {
      score: ratio,
      skills: [
        { label: 'Strategic thinking', value: ratio },
        { label: 'Pattern recognition', value: ratio },
        { label: 'Processing speed', value: speed },
      ],
      summary: `Solved ${list.filter((r) => r === 'ok').length} of ${TACTICS_TOTAL} puzzles without a wrong try.`,
      verifies: 'Strategic thinking',
    };
  };

  const nextPuzzle = () => {
    if (state.idx + 1 >= TACTICS_TOTAL) {
      const result = buildResult(finalResults, times);
      log('finish', result);
      g.finish(result);
      return;
    }
    log('next puzzle', state.idx + 2);
    setResults(finalResults);
    setFrozen(false);
    setFlipped(false);
    setState(freshPuzzle(state.idx + 1));
    clock.reset(seconds);
  };
  const seeResultEarly = () => {
    const result = buildResult(results, times);
    log('finish (time up)', result);
    g.finish(result);
  };

  const dots = Array.from({ length: TACTICS_TOTAL }, (_, i) => {
    if (i < finalResults.length)
      return { state: finalResults[i] === 'ok' ? 'ok' : 'bad', label: i + 1 };
    if (i === finalResults.length) return { state: 'now', label: i + 1 };
    return { state: 'todo', label: i + 1 };
  });
  const attempted = finalResults.length;
  const last = state.idx + 1 >= TACTICS_TOTAL;

  return {
    g,
    subtitleLead: `Strategic thinking · ${TACTICS_TOTAL} puzzles`,
    progress: {
      countLabel: `Puzzle ${state.idx + 1} of ${TACTICS_TOTAL}`,
      summary: `${solvedCount} solved`,
      dots,
      passMark: `Best so far: ${TACTICS_BEST_SO_FAR}`,
    },
    footer: solved
      ? { note: '', action: { label: last ? 'See result' : 'Next puzzle', onClick: nextPuzzle } }
      : {
          note: '',
          link: { label: 'Flip board', size: 'lg', onClick: () => setFlipped((f) => !f) },
        },
    timeUpSummary: `You solved ${solvedCount} of ${TACTICS_TOTAL} puzzles before time ran out.`,
    onSeeResult: seeResultEarly,
    head: {
      eyebrow: `PUZZLE ${puzzle.id} · MATE IN ${puzzle.mateIn}`,
      title: solved ? 'Checkmate!' : tacticsTitle(puzzle.mateIn),
      lead: puzzle.lead,
      stats: [
        {
          icon: GameClockIcon,
          label: solved ? `${formatClock(elapsed)} taken` : `${clock.label} left`,
        },
        { icon: GameCheckCircleIcon, label: `${solvedCount} of ${attempted} solved` },
      ],
      measures: TACTICS_MEASURES,
    },
    board: {
      board: chess.board(),
      flipped,
      selected: state.selected,
      targets,
      onSquare,
      disabled: solved || timedOut,
      lastMove: null,
    },
    clocks: {
      dark: solved
        ? { label: 'SOLVED IN', value: formatClock(elapsed) }
        : { label: 'TIME LEFT', value: clock.label },
      light: { label: 'PUZZLE', value: `${puzzle.id} of ${TACTICS_TOTAL}` },
    },
    moves: {
      heading: solved ? 'MOVES' : 'MOVES SO FAR',
      rows: state.rows,
      currentNumber: solved ? null : state.rows.length + 1,
    },
    tip: solved ? TACTICS_COPY.solvedTip : TACTICS_COPY.playTip,
    chip: solved
      ? { tone: 'success', text: tacticsSolvedMessage(puzzle.mateIn) }
      : (state.feedback ?? null),
  };
};
