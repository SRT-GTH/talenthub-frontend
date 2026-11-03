import { useCallback, useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import { debug } from '../../../../../utils/debug.js';
import { useGameV2Params } from '../gamesV2State.js';
import { useRoundShown } from '../live/useRoundShown.js';
import { GameCheckCircleIcon, GameClockIcon } from '../planningShared/PlanningChessIcons.jsx';
import { TACTICS_COPY, TACTICS_MEASURES, tacticsTitle } from './chessData.js';
import { findLegal, fmtClock, humanise, targetsFrom, useServerCountdown } from './chessLive.js';

const log = debug('useChessTacticsLive');

const safeChess = (fen) => {
  try {
    return new Chess(fen);
  } catch {
    log.error?.('bad FEN from server', fen);
    return new Chess();
  }
};

/*
 * useChessTacticsLive — Chess Tactics against the server engine (backend utils/gameEngines/engines/chessTactics.js).
 * Same return shape as useChessTacticsMock, so ChessTacticsBoard draws both.
 *   view.puzzle   { index, total, fen, youPlay, mateIn, theme, legalMoves [{ from, to, promotion }], lastMove, timeLeftSec, timeLimitSec }
 *                 (null once every puzzle is played) · view.results ['solved' | 'missed', …]
 *   actions       { type: 'move', from, to, promotion? } · { type: 'skip' } · { type: 'timeout', round } ("Next puzzle" at 0:00)
 *                 · { type: 'round_shown', round } (quiet: sent once per puzzle when it is drawn; starts its server clock)
 *   result        { correct, san, checkmate? } solved · { correct: true, san, reply { from, to, san }, fen, mateIn: 1 } first move of a
 *                 mate in 2 (the server played the defence) · { correct: false, san?, solution [SAN], timedOut? } missed.
 * The server decides every move (any mating move counts); chess.js here only draws the FEN. A missed or solved puzzle moves the
 * server on to the next one at once, so the outcome is shown as a chip over the next puzzle (no review pause that would eat its
 * clock). The per-puzzle clock is the server's `timeLeftSec` (full and held until the server has it running: `clockRunning`), ticked
 * locally; at 0:00 the board locks and "Next puzzle" sends a timeout (a timed-out miss).
 */
export const useChessTacticsLive = (run) => {
  const g = useGameV2Params();
  const v = run.view;
  const p = v?.puzzle ?? null;
  const [shown, setShown] = useState(p);
  const [finalFen, setFinalFen] = useState(null);
  if (p && p !== shown) setShown(p);
  const cur = p ?? shown;
  const [selected, setSelected] = useState(null);
  const [userFlip, setUserFlip] = useState(false);
  const [rows, setRows] = useState({ index: -1, list: [] });
  const [chip, setChip] = useState(null);
  const [lastMove, setLastMove] = useState(null);

  const fen = !p && finalFen ? finalFen : cur?.fen;
  const chess = useMemo(() => safeChess(fen), [fen]);
  const side = cur?.youPlay === 'black' ? 'b' : 'w';
  useRoundShown(run, p ? p.index : null);
  const left = useServerCountdown(
    p?.timeLeftSec,
    run.view,
    Boolean(p) && p.clockRunning !== false && !g.modal
  );
  const outOfTime = left !== null && left <= 0;
  const locked = !p || run.busy || Boolean(g.modal) || outOfTime;

  const results = v?.results ?? [];
  const solvedCount = results.filter((r) => r === 'solved').length;
  const total = cur?.total ?? results.length;
  const index = cur?.index ?? 0;
  const mateIn = cur?.mateIn ?? 1;

  const onResult = useCallback((res, before, idx) => {
    if (!res) return;
    if (res.error) {
      setChip({ tone: 'info', text: res.error });
      return;
    }
    const r = res.result || {};
    if (r.correct && r.checkmate) {
      setRows((x) => ({
        index: idx,
        list: [
          ...(x.index === idx ? x.list : []),
          { n: (x.index === idx ? x.list.length : 0) + 1, san: r.san, grade: null, reply: null },
        ],
      }));
      setChip({ tone: 'success', text: `Checkmate! ${r.san}. Puzzle ${idx + 1} solved.` });
      setLastMove(null);
      if (r.finished && before && r.san) {
        // draw the mating move on the last board (chess.js draws; the server already judged it)
        try {
          const c = new Chess(before);
          c.move(r.san);
          setFinalFen(c.fen());
        } catch {
          setFinalFen(null);
        }
      }
      return;
    }
    if (r.correct && r.reply) {
      setRows((x) => {
        const list = x.index === idx ? x.list : [];
        return {
          index: idx,
          list: [...list, { n: list.length + 1, san: r.san, grade: null, reply: r.reply.san }],
        };
      });
      setLastMove({ from: r.reply.from, to: r.reply.to });
      setChip({
        tone: 'success',
        text: `${r.san} keeps the mate on. The defence: ${r.reply.san}. Now mate in ${r.mateIn ?? 1}.`,
      });
      return;
    }
    const line =
      Array.isArray(r.solution) && r.solution.length
        ? ` A winning line: ${r.solution.join(' ')}.`
        : '';
    let text = `Puzzle ${idx + 1} skipped.${line}`;
    if (r.timedOut) text = `Time ran out on puzzle ${idx + 1}.${line}`;
    else if (r.san) text = `${r.san} does not force mate. Puzzle ${idx + 1} missed.${line}`;
    setChip({ tone: 'error', text });
    setLastMove(null);
  }, []);

  const onSquare = useCallback(
    async (square) => {
      if (locked) return;
      let piece = null;
      try {
        piece = chess.get(square);
      } catch {
        piece = null;
      }
      const mine = Boolean(piece) && piece.color === side;
      if (selected) {
        const mv = findLegal(p.legalMoves, selected, square);
        if (mv) {
          const idx = p.index;
          const before = p.fen;
          setSelected(null);
          log('move', mv.from, mv.to);
          const res = await run.act({
            type: 'move',
            from: mv.from,
            to: mv.to,
            ...(mv.promotion ? { promotion: mv.promotion } : {}),
          });
          onResult(res, before, idx);
          return;
        }
        setSelected(mine && square !== selected ? square : null);
        return;
      }
      if (mine) {
        setSelected(square);
        setChip(null);
      }
    },
    [locked, chess, side, selected, p, run, onResult]
  );

  const skip = useCallback(async () => {
    if (!p || run.busy || g.modal) return;
    const idx = p.index;
    log(outOfTime ? 'timeout' : 'skip', idx);
    setSelected(null);
    const res = await run.act(outOfTime ? { type: 'timeout', round: idx } : { type: 'skip' });
    if (res?.result?.ignored) return; // the server had already moved past this puzzle
    onResult(res, null, idx);
  }, [p, run, g.modal, outOfTime, onResult]);

  const targets = useMemo(
    () => (p ? targetsFrom(p.legalMoves, selected, chess) : []),
    [p, selected, chess]
  );
  const shownRows = rows.index === index ? rows.list : [];

  const dots = Array.from({ length: total }, (_, i) => {
    if (i < results.length) return { state: results[i] === 'solved' ? 'ok' : 'bad', label: i + 1 };
    if (i === results.length && p) return { state: 'now', label: i + 1 };
    return { state: 'todo', label: i + 1 };
  });

  let footer = { note: '' };
  if (p) {
    footer = {
      note: '',
      link: { label: 'Flip board', size: 'lg', onClick: () => setUserFlip((f) => !f) },
      action: {
        label: outOfTime ? 'Next puzzle' : 'Skip puzzle',
        onClick: skip,
        disabled: run.busy || Boolean(g.modal),
      },
    };
  }

  const clockLabel = left === null ? null : fmtClock(left);
  const theme = humanise(cur?.theme);

  return {
    g,
    subtitleLead: `Strategic thinking · ${total} puzzles`,
    progress: {
      countLabel: `Puzzle ${Math.min(index + 1, total)} of ${total}`,
      summary: `${solvedCount} solved`,
      dots,
      passMark: undefined, // no personal best in the run view
    },
    footer,
    timeUpSummary: `You solved ${solvedCount} of ${total} puzzles.`,
    onSeeResult: run.submit,
    head: {
      eyebrow: `PUZZLE ${index + 1} OF ${total} · MATE IN ${mateIn}`,
      title: p ? tacticsTitle(mateIn) : 'All puzzles played.',
      lead: `${side === 'b' ? 'Black' : 'White'} to move.${theme ? ` Theme: ${theme.toLowerCase()}.` : ''}`,
      stats: [
        ...(clockLabel
          ? [{ icon: GameClockIcon, label: outOfTime ? 'Time is up' : `${clockLabel} left` }]
          : []),
        { icon: GameCheckCircleIcon, label: `${solvedCount} of ${results.length} solved` },
      ],
      measures: TACTICS_MEASURES,
    },
    board: {
      board: chess.board(),
      flipped: (side === 'b') !== userFlip,
      selected,
      targets,
      onSquare,
      disabled: locked,
      lastMove,
    },
    clocks: {
      dark: { label: 'TIME LEFT', value: clockLabel ?? '–' },
      light: { label: 'PUZZLE', value: `${Math.min(index + 1, total)} of ${total}` },
    },
    moves: {
      heading: 'MOVES SO FAR',
      rows: shownRows,
      currentNumber: p && !run.busy ? shownRows.length + 1 : null,
    },
    tip: run.busy ? 'Checking your move…' : TACTICS_COPY.playTip,
    chip,
  };
};
