import { useCallback, useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import { debug } from '../../../../../utils/debug.js';
import { useGameV2Params } from '../gamesV2State.js';
import { GameCheckCircleIcon, GameClockIcon } from '../planningShared/PlanningChessIcons.jsx';
import { GRADE_LABEL, MATCH_COPY, MATCH_MEASURES } from './chessData.js';
import { findLegal, targetsFrom } from './chessLive.js';

const log = debug('useChessMatchLive');

const LEVEL_LABEL = {
  beginner: 'BEGINNER',
  intermediate: 'INTERMEDIATE',
  advanced: 'ADVANCED',
  expert: 'EXPERT',
};
const OUTCOME = { win: 'You win', draw: 'It is a draw', loss: 'Kwaku wins' };
const REASON = {
  checkmate: 'by checkmate',
  stalemate: 'by stalemate',
  move_limit: 'on points at the move limit',
  resigned: 'by resignation',
  draw: '',
};

const safeChess = (fen) => {
  try {
    return new Chess(fen);
  } catch {
    return new Chess();
  }
};

/** Draw-only: the position after the player's move while the server answers (the server's FEN replaces it). */
const afterMove = (fen, mv) => {
  try {
    const c = new Chess(fen);
    c.move({ from: mv.from, to: mv.to, ...(mv.promotion ? { promotion: mv.promotion } : {}) });
    return c.fen();
  } catch {
    return null;
  }
};

const endText = (result, reason) => {
  if (!result) return null;
  const why = REASON[reason] ?? '';
  return `${OUTCOME[result] ?? 'Game over'}${why ? ` ${why}` : ''}.`;
};

/*
 * useChessMatchLive — Chess Match against the server engine (backend utils/gameEngines/engines/chessMatch.js). Same return shape
 * as useChessMatchMock, so ChessMatchBoard draws both.
 *   view     { fen, youPlay: 'white', cpu { name }, toMove, inCheck, legalMoves [{ from, to, promotion }], moveNumber, maxMoves,
 *            lastMoves [{ by, san, from, to }], result } + timeLeftSec / timeLimitSec (the whole-game clock → run.timeLabel)
 *   actions  { type: 'move', from, to, promotion? } · { type: 'resign' }
 *   result   { san, quality: best | good | inaccuracy | blunder, reply { from, to, san } | null, fen, result, reason, finished }
 * The server grades every move (centipawn loss → quality) and plays Kwaku's reply in the same call; while it is in flight
 * (`run.busy`) the board shows the player's move and "Kwaku is thinking…". Material, a personal best and Kwaku's strength
 * are not in the view, so they are not shown.
 */
export const useChessMatchLive = (run) => {
  const g = useGameV2Params();
  const v = run.view;
  const [selected, setSelected] = useState(null);
  const [pendingFen, setPendingFen] = useState(null);
  const [rows, setRows] = useState(() => {
    // a resumed run: the last pair of moves the server lists (grades are not in the view)
    const last = v?.lastMoves ?? [];
    const mine = last.find((x) => x.by === 'player');
    if (!mine) return [];
    const reply = last.find((x) => x.by === 'cpu' && last.indexOf(x) > last.indexOf(mine));
    return [
      {
        n: Math.max(1, (v?.moveNumber ?? 2) - 1),
        san: mine.san,
        grade: null,
        reply: reply?.san ?? null,
      },
    ];
  });
  const [last, setLast] = useState(null); // { san, quality, reply, reason }
  const [error, setError] = useState(null);

  const fen = run.busy && pendingFen ? pendingFen : v?.fen;
  const chess = useMemo(() => safeChess(fen), [fen]);
  const finished = Boolean(v?.finished);
  const yourTurn = v?.toMove === 'you';
  const locked = finished || run.busy || !yourTurn || Boolean(g.modal);
  const maxMoves = v?.maxMoves ?? 0;
  const moveNo = Math.min(v?.moveNumber ?? 1, maxMoves || Infinity);
  const cpuName = v?.cpu?.name ?? 'Kwaku';

  const play = useCallback(
    async (mv) => {
      const n = v?.moveNumber ?? 1;
      setSelected(null);
      setError(null);
      setPendingFen(afterMove(v?.fen, mv));
      log('move', mv.from, mv.to);
      const res = await run.act({
        type: 'move',
        from: mv.from,
        to: mv.to,
        ...(mv.promotion ? { promotion: mv.promotion } : {}),
      });
      setPendingFen(null);
      if (!res) return;
      if (res.error) {
        setError(res.error);
        return;
      }
      const r = res.result || {};
      setRows((x) => [
        ...x,
        {
          n,
          san: r.san,
          grade: GRADE_LABEL[r.quality] ? r.quality : null,
          reply: r.reply?.san ?? null,
        },
      ]);
      setLast({ san: r.san, quality: r.quality, reply: r.reply ?? null, reason: r.reason ?? null });
    },
    [v, run]
  );

  const onSquare = useCallback(
    (square) => {
      if (locked) return;
      let piece = null;
      try {
        piece = chess.get(square);
      } catch {
        piece = null;
      }
      const mine = Boolean(piece) && piece.color === 'w';
      if (selected) {
        const mv = findLegal(v?.legalMoves, selected, square);
        if (mv) {
          play(mv);
          return;
        }
        setSelected(mine && square !== selected ? square : null);
        return;
      }
      if (mine) setSelected(square);
    },
    [locked, chess, selected, v, play]
  );

  const resign = useCallback(() => {
    if (finished) return;
    log('resign');
    run.act({ type: 'resign' }).then((res) => {
      if (res && !res.error) setLast({ reason: 'resigned' });
    });
  }, [finished, run]);

  const targets = useMemo(
    () => (locked ? [] : targetsFrom(v?.legalMoves, selected, chess)),
    [locked, v, selected, chess]
  );

  const good = rows.filter((r) => r.grade === 'best' || r.grade === 'good').length;
  const graded = rows.filter((r) => r.grade).length;
  const ended = endText(v?.result, last?.reason ?? null) ?? (finished ? 'Game over.' : null);

  let chip = null;
  if (error) chip = { tone: 'info', text: error };
  else if (finished) chip = { tone: 'info', text: ended };
  else if (last?.quality === 'blunder')
    chip = {
      tone: 'error',
      text: `Blunder: ${last.san}.${last.reply ? ` ${cpuName} answered ${last.reply.san}.` : ''}`,
    };
  else if (last?.quality === 'inaccuracy')
    chip = { tone: 'tip', text: `Inaccuracy: ${last.san}. There was a stronger move.` };
  else if (last?.quality === 'best') chip = { tone: 'success', text: `Best move: ${last.san}.` };

  let summary = 'Your move';
  if (finished) summary = 'Game over';
  else if (run.busy || !yourTurn) summary = `${cpuName} is thinking…`;
  else if (v?.inCheck) summary = 'You are in check';

  const lastCpu = (v?.lastMoves ?? []).filter((x) => x.by === 'cpu').slice(-1)[0];

  return {
    g,
    subtitleLead: `Strategic thinking · full game against ${cpuName}${maxMoves ? ` · ${maxMoves} moves` : ''}`,
    progress: {
      countLabel: maxMoves ? `Move ${moveNo} of ${maxMoves}` : `Move ${moveNo}`,
      summary,
      dots: [],
      passMark: undefined,
    },
    footer: finished
      ? { note: '' }
      : {
          note: '',
          link: { label: 'Resign game', size: 'lg', onClick: resign, disabled: run.busy },
        },
    timeUpSummary: 'The game clock ran out.',
    onSeeResult: run.submit,
    head: {
      eyebrow: `GAME AGAINST ${cpuName.toUpperCase()} · ${LEVEL_LABEL[run.difficulty] ?? String(run.difficulty ?? '').toUpperCase()}`,
      title: finished ? 'Game over.' : MATCH_COPY.title,
      lead: MATCH_COPY.lead,
      stats: [
        ...(run.timeLabel ? [{ icon: GameClockIcon, label: `${run.timeLabel} left` }] : []),
        { icon: GameCheckCircleIcon, label: `${good} of ${graded} moves good or best` },
      ],
      measures: MATCH_MEASURES,
    },
    board: {
      board: chess.board(),
      flipped: false,
      selected,
      targets,
      onSquare,
      disabled: locked,
      lastMove: !run.busy && lastCpu ? { from: lastCpu.from, to: lastCpu.to } : null,
    },
    clocks: {
      dark: { label: 'TIME LEFT', value: run.timeLabel ?? '–' },
      light: {
        label: 'MOVES LEFT',
        value: maxMoves
          ? `${Math.max(0, maxMoves - (v?.moveNumber ?? 1) + 1)} of ${maxMoves}`
          : '–',
      },
    },
    moves: {
      heading: 'LAST MOVES',
      rows: rows.slice(-2),
      currentNumber: !finished && !run.busy && yourTurn && !chip ? moveNo : null,
    },
    tip: run.busy
      ? `${cpuName} is thinking…`
      : last?.quality === 'blunder'
        ? MATCH_COPY.askTip
        : MATCH_COPY.defaultTip,
    chip,
  };
};
