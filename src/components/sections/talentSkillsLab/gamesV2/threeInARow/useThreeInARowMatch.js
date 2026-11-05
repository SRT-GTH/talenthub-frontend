import { useCallback, useEffect, useReducer, useRef } from 'react';
import { debug } from '../../../../../utils/debug.js';
import {
  emptyBoard,
  TR_GAMES,
  TR_KWAKU_DELAY_MS,
  TR_NOTICE_MS,
  TR_QUOTES,
  TR_SEEDS,
} from './threeInARowData.js';
import { isFull, kwakuMove, LINES, winnerOf } from './threeInARowEngine.js';

const log = debug('useThreeInARowMatch');

/*
 * useThreeInARowMatch — best-of-three match state (three games are always played, drawn: "Game 3 starts with you" at 2–0).
 * State: { gameIndex, results[3], board, turn 'you'|'kwaku', over, outcome 'you'|'kwaku'|'draw'|'resigned', win[], quote, notice (cell|null) }.
 * You are X and start every game. A Figma seed (`?f=TR-0x`) boots a frozen state: no Kwaku timer, no input.
 */
const forks = (board) =>
  LINES.filter((line) => {
    const marks = line.filter((i) => board[i] === 'X').length;
    return marks === 2 && line.some((i) => !board[i]);
  }).length >= 2;

const initial = (seed) => ({
  gameIndex: 1,
  results: ['you', null, null],
  board: emptyBoard(),
  turn: 'you',
  over: false,
  outcome: null,
  win: null,
  quote: TR_QUOTES.start,
  notice: null,
  ...(seed ?? {}),
});

const fresh = () => ({ ...initial(null), gameIndex: 0, results: [null, null, null] });

const endGame = (state, board, outcome, win, quote) => {
  const results = state.results.slice();
  results[state.gameIndex] = outcome === 'resigned' ? 'kwaku' : outcome;
  log('game over', { game: state.gameIndex + 1, outcome });
  return { ...state, board, over: true, outcome, win, results, quote, notice: null, turn: 'you' };
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'play': {
      if (state.over || state.turn !== 'you') return state;
      if (state.board[action.cell]) {
        log('square taken', action.cell);
        return { ...state, notice: action.cell, quote: TR_QUOTES.taken };
      }
      const board = state.board.slice();
      board[action.cell] = 'X';
      const w = winnerOf(board);
      if (w) return endGame(state, board, 'you', w.line, TR_QUOTES.playerWins);
      if (isFull(board)) return endGame(state, board, 'draw', null, TR_QUOTES.draw);
      return {
        ...state,
        board,
        turn: 'kwaku',
        notice: null,
        quote: forks(board) ? TR_QUOTES.fork : TR_QUOTES.thinking,
      };
    }
    case 'kwaku': {
      if (state.over || state.turn !== 'kwaku' || state.board[action.cell]) return state;
      const board = state.board.slice();
      board[action.cell] = 'O';
      const w = winnerOf(board);
      if (w) return endGame(state, board, 'kwaku', w.line, TR_QUOTES.kwakuWins);
      if (isFull(board)) return endGame(state, board, 'draw', null, TR_QUOTES.draw);
      return { ...state, board, turn: 'you', quote: TR_QUOTES.start };
    }
    case 'resign':
      if (state.over) return state;
      return endGame(state, state.board, 'resigned', null, TR_QUOTES.resigned);
    case 'next':
      if (!state.over || state.gameIndex >= TR_GAMES - 1) return state;
      return {
        ...state,
        gameIndex: state.gameIndex + 1,
        board: emptyBoard(),
        turn: 'you',
        over: false,
        outcome: null,
        win: null,
        notice: null,
        quote: TR_QUOTES.start,
      };
    case 'clearNotice':
      return state.notice === null ? state : { ...state, notice: null, quote: TR_QUOTES.start };
    default:
      return state;
  }
};

export const useThreeInARowMatch = ({ level, frame, paused }) => {
  const seed = frame ? TR_SEEDS[frame] : null;
  const frozen = Boolean(seed);
  const [state, dispatch] = useReducer(reducer, null, () => (seed ? initial(seed) : fresh()));
  const levelRef = useRef(level);
  useEffect(() => {
    levelRef.current = level;
  }, [level]);

  const thinking = state.turn === 'kwaku' && !state.over;
  useEffect(() => {
    if (frozen || paused || !thinking) return undefined;
    log('Kwaku thinks', { level: levelRef.current, delay: TR_KWAKU_DELAY_MS });
    const id = window.setTimeout(() => {
      const cell = kwakuMove(state.board, levelRef.current);
      log('Kwaku plays', cell);
      dispatch({ type: 'kwaku', cell });
    }, TR_KWAKU_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [frozen, paused, thinking, state.board]);

  const noticed = state.notice !== null;
  useEffect(() => {
    if (frozen || paused || !noticed) return undefined;
    const id = window.setTimeout(() => dispatch({ type: 'clearNotice' }), TR_NOTICE_MS);
    return () => window.clearTimeout(id);
  }, [frozen, paused, noticed, state.notice]);

  const play = useCallback(
    (cell) => {
      if (frozen || paused) return;
      dispatch({ type: 'play', cell });
    },
    [frozen, paused]
  );
  const resign = useCallback(() => {
    if (!frozen && !paused) dispatch({ type: 'resign' });
  }, [frozen, paused]);
  const next = useCallback(() => {
    if (!frozen) dispatch({ type: 'next' });
  }, [frozen]);

  return { ...state, thinking, frozen, hover: seed?.hover ?? null, play, resign, next };
};
