import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useGameV2Params } from '../gamesV2State.js';
import { TR_KWAKU_DELAY_MS, TR_NOTICE_MS, TR_QUOTES } from './threeInARowData.js';
import { LINES, winnerOf } from './threeInARowEngine.js';

const log = debug('useThreeInARowLive');

const OUTCOME = { win: 'you', loss: 'kwaku', draw: 'draw' };

const forks = (board) =>
  LINES.filter((line) => {
    const marks = line.filter((i) => board[i] === 'X').length;
    return marks === 2 && line.some((i) => !board[i]);
  }).length >= 2;

/*
 * useThreeInARowLive — Three in a Row against the server engine (backend utils/gameEngines/engines/ticTacToe.js): Kwaku's moves,
 * the move grading and the score are the server's. Same shape as the mock adapter in games/ThreeInARow.jsx.
 *   view.game { index, total, board, youStarted, result } · view.results ['win' | 'loss' | 'draw']
 *   action    { type: 'move', cell }  →  result { cell, cpuCell, gameResult, board, nextGame?, finished }
 *             an occupied square → HTTP 422 CELL_TAKEN → the drawn "That square is taken" notice (no penalty).
 * Your X shows at once; Kwaku's O (from the result) after ~0.8 s of "Kwaku is thinking". When a game ends the server has already
 * dealt the next one (Kwaku starts game 2), so the finished board is held until "Next game". The engine has no resign action, so
 * the resign link is hidden in live mode. The win line is only drawn from the board the server returned.
 */
export const useThreeInARowLive = (run) => {
  const g = useGameV2Params();
  const paused = Boolean(g.modal);
  const v = run.view;
  const game = v?.game ?? null;
  const [pending, setPending] = useState(null); // { board } your X while Kwaku "thinks"
  const [ended, setEnded] = useState(null); // { board, outcome, index, nextYouStart, last }
  const [notice, setNotice] = useState(null); // the taken cell
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);
  const later = useCallback((fn, ms) => timers.current.push(window.setTimeout(fn, ms)), []);

  useEffect(() => {
    if (notice === null || paused) return undefined;
    const id = window.setTimeout(() => setNotice(null), TR_NOTICE_MS);
    return () => window.clearTimeout(id);
  }, [notice, paused]);

  const thinking = Boolean(pending);
  const over = Boolean(ended);

  const play = useCallback(
    async (cell) => {
      if (!game || paused || over || thinking || run.busy) return;
      const empty = !game.board[cell];
      const before = Date.now();
      if (empty) {
        const board = game.board.slice();
        board[cell] = 'X';
        setPending({ board });
        setNotice(null);
      }
      log('move', cell);
      const res = await run.act({ type: 'move', cell });
      if (!res || res.error) {
        setPending(null);
        if (res?.code === 'CELL_TAKEN') {
          log('square taken', cell);
          setNotice(cell);
        } else if (res?.error) log('refused', res.code, res.error);
        return;
      }
      const r = res.result || {};
      const settle = () => {
        setPending(null);
        if (r.gameResult) {
          const outcome = OUTCOME[r.gameResult] ?? 'draw';
          log('game over', { game: game.index + 1, outcome, last: r.finished });
          setEnded({
            board: r.board ?? game.board,
            outcome,
            index: game.index,
            nextYouStart: r.nextGame ? Boolean(r.nextGame.youStarted) : null,
            last: Boolean(r.finished),
          });
        }
      };
      // Kwaku answered (cpuCell): let "Kwaku is thinking" show for a moment; your own winning / last move settles at once
      const wait =
        r.cpuCell === null || r.cpuCell === undefined
          ? 0
          : TR_KWAKU_DELAY_MS - (Date.now() - before);
      if (wait > 0) later(settle, wait);
      else settle();
    },
    [game, paused, over, thinking, run, later]
  );

  const next = useCallback(() => {
    if (!ended) return;
    if (ended.last) {
      run.submit(); // the card is already on its way (useGameRun opens it); a no-op then
      return;
    }
    log('next game');
    setEnded(null);
    setNotice(null);
  }, [ended, run]);

  const total = game?.total ?? 3;
  const results = useMemo(() => {
    const list = (v?.results ?? []).map((r) => OUTCOME[r] ?? 'draw');
    return Array.from({ length: total }, (_, i) => list[i] ?? null);
  }, [v, total]);

  if (!game) return null;

  const board = ended?.board ?? pending?.board ?? game.board;
  const win = ended ? (winnerOf(board)?.line ?? null) : null;
  let quote = TR_QUOTES.start;
  if (ended) {
    quote =
      ended.outcome === 'you'
        ? TR_QUOTES.playerWins
        : ended.outcome === 'kwaku'
          ? TR_QUOTES.kwakuWins
          : TR_QUOTES.draw;
  } else if (thinking) quote = forks(board) ? TR_QUOTES.fork : TR_QUOTES.thinking;
  else if (notice !== null) quote = TR_QUOTES.taken;

  const gameIndex = ended ? ended.index : game.index;
  let nextStatus = 'Match over';
  if (ended && !ended.last) {
    nextStatus =
      ended.nextYouStart === false
        ? `Game ${gameIndex + 2} · Kwaku starts`
        : `Game ${gameIndex + 2} starts with you`;
  }

  return {
    gameIndex,
    total,
    lastGame: ended ? ended.last : game.index >= total - 1,
    results,
    board,
    turn: thinking ? 'kwaku' : 'you',
    over,
    outcome: ended?.outcome ?? null,
    win,
    quote,
    notice,
    thinking,
    frozen: false,
    hover: null,
    interactive: !over && !thinking && !paused,
    nextStatus,
    play,
    resign: null,
    next,
    finishNow: run.submit,
  };
};
