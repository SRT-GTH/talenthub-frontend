import { useEffect, useMemo, useReducer, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { FOCUS_RING } from '../labPlayStyles.js';
import {
  GameBulbIcon,
  GameCheckCircleFillIcon,
  GameCheckCircleIcon,
  GameClockIcon,
} from '../skillGames/GameIcons.jsx';
import {
  PieceBlackKing,
  PieceBlackPawn,
  PieceBlackRook,
  PieceWhiteKing,
  PieceWhitePawn,
  PieceWhiteRook,
} from '../skillGames/ChessPieces.jsx';
import { Gen, GameFeedback, GameFrame, GameHead, SectionLabel } from '../skillGames/gameKit.jsx';
import {
  HAIR,
  MONO,
  SEL_BORDER,
  SEL_SHADOW,
  buildGameResult,
  formatClock,
  topicRowsFor,
  useCountdown,
} from '../skillGames/gameKitUtils.js';
import { CHESS_BLITZ, CHESS_FRAMES, PUZZLES } from '../skillGames/chessBlitzData.js';

const log = debug('ChessBlitz');

/*
 * Chess Blitz (`/skills-lab/games/chess-blitz`) — Figma SL-GS11 "Puzzle 4" (Playful 7943:8743 / Focused 8110:496629).
 * ?f=GS11 boots it. Loop: read the board, pick White's first move from the list (the piece and its path light up on the board)
 * → "Play move" → feedback → "Next puzzle" … puzzle 5 → results (pass 4 of 5). 60 s per puzzle, "Flip board" turns the
 * board round. Data + assumptions: chessBlitzData.js. Pieces: only king / rook / pawn exist in Figma (ChessPieces.jsx).
 */

const PIECE = {
  bk: PieceBlackKing,
  br: PieceBlackRook,
  bp: PieceBlackPawn,
  wk: PieceWhiteKing,
  wr: PieceWhiteRook,
  wp: PieceWhitePawn,
};
const FILES = 'abcdefgh';
const SQ = 100 / 8; // % of the 480 px grid

const Board = ({ puzzle, flipped, option }) => {
  const files = flipped ? [...FILES].reverse() : [...FILES];
  const ranks = flipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];
  const pos = (sq) => ({ x: files.indexOf(sq[0]), y: ranks.indexOf(Number(sq[1])) });
  const at = (sq) => {
    const { x, y } = pos(sq);
    return { left: `${x * SQ}%`, top: `${y * SQ}%`, width: `${SQ}%`, height: `${SQ}%` };
  };
  return (
    <div className="relative w-full max-w-[496px]" style={{ aspectRatio: '496 / 512' }}>
      <div
        className="absolute inset-0 rounded-[3px] bg-[linear-gradient(135deg,#142916_0%,#2a5730_100%)] shadow-[inset_0_-1px_3px_rgba(0,0,0,0.4),inset_0_2px_8px_rgba(0,0,0,0.6)]"
        role="img"
        aria-label={`Chess board. ${puzzle.pieces.map(([sq, p]) => `${p} on ${sq}`).join(', ')}`}
      >
        <div
          className="absolute"
          style={{
            left: `${(5 / 496) * 100}%`,
            top: `${(5 / 512) * 100}%`,
            width: `${(480 / 496) * 100}%`,
            height: `${(480 / 512) * 100}%`,
          }}
        >
          {ranks.flatMap((r, y) =>
            files.map((f, x) => (
              <span
                key={`${f}${r}`}
                className="absolute"
                style={{
                  left: `${x * SQ}%`,
                  top: `${y * SQ}%`,
                  width: `${SQ}%`,
                  height: `${SQ}%`,
                  backgroundColor: (FILES.indexOf(f) + r) % 2 === 0 ? '#e6cb85' : '#2f5d37',
                }}
              />
            ))
          )}
          {option ? (
            <span className="absolute bg-[rgba(255,216,107,0.75)]" style={at(option.from)} />
          ) : null}
          {puzzle.pieces.map(([sq, p]) => {
            const Glyph = PIECE[p];
            const king = p === 'bk';
            return (
              <span key={sq} className="absolute" style={at(sq)}>
                {/* the exported frames carry a 5 px shadow margin: 66 px art for a 60 px square; the black king is the 37 px group */}
                <span
                  className="absolute"
                  style={
                    king
                      ? { left: '19%', top: '12.2%', width: '61.7%', height: '73.3%' }
                      : { left: '-5%', top: '0%', width: '110%', height: '110%' }
                  }
                >
                  <Glyph className="block size-full" />
                </span>
              </span>
            );
          })}
          {option
            ? option.path.map((sq) => (
                <span key={sq} className="absolute flex items-center justify-center" style={at(sq)}>
                  <span className="size-[27%] rounded-full bg-[rgba(11,26,15,0.28)]" />
                </span>
              ))
            : null}
        </div>
        {ranks.map((r, y) => (
          <span
            key={r}
            aria-hidden="true"
            className="absolute -left-[12px] w-[10px] text-center text-[11px] leading-[14px] font-medium text-[#595959] max-lg:text-[12px]"
            style={{
              top: `calc(${((5 + 60 * y + 23) / 512) * 100}%)`,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {r}
          </span>
        ))}
        {files.map((f, x) => (
          <span
            key={f}
            aria-hidden="true"
            className="absolute text-center text-[11px] leading-[14px] font-medium text-[#e8f2ed] max-lg:text-[12px]"
            style={{
              left: `${((5 + 60 * x + 26) / 496) * 100}%`,
              top: `${(492 / 512) * 100}%`,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
};

const Move = ({ option, selected, locked, onPick, tone }) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    aria-label={`${option.san}. ${option.desc}`}
    disabled={locked}
    onClick={onPick}
    className={classNames(
      'flex w-full max-w-[276px] items-center gap-[12px] rounded-[16px] px-[16px] py-[14px] text-left',
      selected && tone !== 'wrong' && classNames('bg-[#ebf1ec]', SEL_BORDER, SEL_SHADOW),
      selected &&
        tone === 'wrong' &&
        'border border-solid border-[#c0392b] bg-[#f9ebea] playful:border-[1.5px]',
      !selected && classNames('bg-white', HAIR),
      locked ? 'cursor-default' : 'cursor-pointer',
      FOCUS_RING
    )}
  >
    <span className="flex min-w-0 flex-1 flex-col gap-px">
      <Gen
        text={option.san}
        className="text-[18px] leading-[24px] text-[#1c2a21]"
        style={{ fontFamily: MONO }}
      />
      <Gen
        text={option.desc}
        className={classNames(
          'font-sans text-[12.5px] leading-[15px] max-lg:text-[12px]',
          selected ? 'text-[#1c2a21]' : 'text-[#595959]'
        )}
      />
    </span>
    {selected ? <GameCheckCircleFillIcon className="size-[18px] shrink-0 text-[#1c2a21]" /> : null}
  </button>
);

const fresh = (runKey = 0) => ({
  index: 0,
  results: [],
  times: [],
  picked: null,
  phase: 'playing',
  frozen: false,
  seconds: null,
  took: null,
  runKey,
});
const fromFrame = (code) => {
  const seed = code ? CHESS_FRAMES[code] : null;
  return seed ? { ...fresh(), ...seed, frozen: true } : fresh();
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'pick':
      return state.phase === 'playing' ? { ...state, picked: action.index, frozen: false } : state;
    case 'play':
    case 'timeout': {
      if (state.phase !== 'playing') return state;
      const ok = action.type === 'play' && state.picked === PUZZLES[state.index].answer;
      const results = [...state.results];
      results[state.index] = ok ? 'ok' : 'bad';
      const took = action.type === 'play' ? CHESS_BLITZ.seconds - action.left : CHESS_BLITZ.seconds;
      return {
        ...state,
        results,
        times: ok ? [...state.times, took] : state.times,
        phase: 'feedback',
        took,
        ok,
      };
    }
    case 'next':
      if (state.phase !== 'feedback') return state;
      if (state.index + 1 >= CHESS_BLITZ.total) return { ...state, phase: 'finished' };
      return {
        ...state,
        index: state.index + 1,
        picked: null,
        phase: 'playing',
        frozen: false,
        seconds: null,
        took: null,
      };
    case 'restart':
      return fresh(state.runKey + 1);
    default:
      return state;
  }
};

const ChessBlitz = ({ frame }) => {
  const [state, dispatch] = useReducer(reducer, frame, fromFrame);
  const [resultOpen, setResultOpen] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const puzzle = PUZZLES[state.index];
  const finished = state.phase === 'finished';
  const feedback = state.phase === 'feedback';
  const solved = state.results.filter((r) => r === 'ok').length;
  const passed = solved >= CHESS_BLITZ.passMark;
  const left = useCountdown({
    start: state.seconds ?? CHESS_BLITZ.seconds,
    running: state.phase === 'playing' && !state.frozen,
    resetKey: `${state.index}:${state.runKey}`,
    onZero: () => dispatch({ type: 'timeout' }),
  });

  useEffect(() => {
    log('mount', { frame });
  }, [frame]);

  const result = useMemo(() => {
    if (!finished) return null;
    return buildGameResult({
      skill: CHESS_BLITZ.skill,
      gameName: CHESS_BLITZ.label,
      verb: 'solved',
      noun: 'puzzles',
      statLabel: 'PUZZLES SOLVED',
      correct: solved,
      total: CHESS_BLITZ.total,
      passMark: `${CHESS_BLITZ.passMark} of ${CHESS_BLITZ.total}`,
      passed,
      earned: solved * CHESS_BLITZ.solveXp + (passed ? CHESS_BLITZ.passBonusXp : 0),
      dots: state.results.map((r) => (r === 'ok' ? 'ok' : 'bad')),
      topics: topicRowsFor(PUZZLES, state.results, 'Puzzle'),
    });
  }, [finished, solved, passed, state.results]);

  const done = state.results.filter(Boolean).length;
  const dots = Array.from({ length: CHESS_BLITZ.total }, (_, i) => {
    if (state.results[i]) return { state: state.results[i], label: String(i + 1) };
    if (!finished && i === done) return { state: 'now', label: String(i + 1) };
    return { state: 'todo', label: String(i + 1) };
  });
  const avg = state.times.length
    ? Math.round(state.times.reduce((a, b) => a + b, 0) / state.times.length)
    : null;
  const isLast = state.index + 1 >= CHESS_BLITZ.total;
  const option = state.picked === null ? null : puzzle.options[state.picked];
  const footer = feedback
    ? {
        primary: {
          label: isLast ? 'See results' : 'Next puzzle',
          onClick: () => dispatch({ type: 'next' }),
        },
      }
    : {
        link: { label: 'Flip board', onClick: () => setFlipped((f) => !f) },
        primary: {
          label: 'Play move',
          disabled: state.picked === null,
          onClick: () => dispatch({ type: 'play', left }),
        },
      };

  return (
    <GameFrame
      game={{
        title: CHESS_BLITZ.title,
        label: CHESS_BLITZ.label,
        subtitle: CHESS_BLITZ.subtitle,
        sticker: 'BLITZ',
      }}
      xp={CHESS_BLITZ.baseXp}
      streakDays={CHESS_BLITZ.streakDays}
      progress={{
        countLabel: finished
          ? 'All puzzles done'
          : `Puzzle ${state.index + 1} of ${CHESS_BLITZ.total}`,
        summary: avg === null ? `${solved} solved` : `${solved} solved · avg ${avg}s`,
        dots,
        passMark: `Pass mark: ${CHESS_BLITZ.passMark} of ${CHESS_BLITZ.total}`,
      }}
      footer={footer}
      result={result}
      resultOpen={resultOpen}
      onResultsClose={() => setResultOpen(false)}
      onReopenResults={() => setResultOpen(true)}
      current={state.index + 1}
      total={CHESS_BLITZ.total}
      correct={solved}
      onRestart={() => {
        dispatch({ type: 'restart' });
        setResultOpen(true);
      }}
    >
      <div className="flex flex-col gap-[22px]">
        <GameHead
          eyebrow={`PUZZLE ${state.index + 1} · STRATEGIC THINKING`}
          title={[
            ['Find the ', false],
            ['knockout move.', true],
          ]}
          prompt={CHESS_BLITZ.prompt}
          stats={[
            { Icon: GameClockIcon, label: `${formatClock(left)} left` },
            { Icon: GameCheckCircleIcon, label: `${solved} of ${state.index + 1} solved` },
          ]}
          checks={CHESS_BLITZ.checks}
        />
        <div className="flex gap-[32px] max-lg:flex-col">
          <div
            className={classNames(
              'flex shrink-0 flex-col gap-[12px] rounded-[24px] bg-[#fffefc] p-[20px] lg:w-[538px]',
              HAIR
            )}
          >
            <Board puzzle={puzzle} flipped={flipped} option={option} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-[16px]">
            <div className="grid grid-cols-2 gap-[12px]">
              <div className="flex flex-col gap-[2px] rounded-[16px] border border-solid border-[rgba(28,42,33,0.1)] bg-[#1c2a21] px-[18px] py-[14px]">
                <span className="font-sans text-[11px] leading-[13px] font-bold text-[#c1d4c4] max-lg:text-[12px]">
                  YOU
                </span>
                <span className="font-sans text-[32px] leading-[38px] font-semibold tracking-[-0.01em] text-white playful:font-heading">
                  {formatClock(left)}
                </span>
              </div>
              <div
                className={classNames(
                  'flex flex-col gap-[2px] rounded-[16px] bg-white px-[18px] py-[14px]',
                  HAIR
                )}
              >
                <span className="font-sans text-[11px] leading-[13px] font-bold text-[#595959] max-lg:text-[12px]">
                  PUZZLE PAR
                </span>
                <span className="font-sans text-[32px] leading-[38px] font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading">
                  {formatClock(CHESS_BLITZ.par)}
                </span>
              </div>
            </div>
            <SectionLabel>YOUR FIRST MOVE</SectionLabel>
            <div
              role="radiogroup"
              aria-label="Your first move"
              className="flex flex-col gap-[12px]"
            >
              {puzzle.options.map((o, i) => (
                <Move
                  key={o.san}
                  option={o}
                  selected={state.picked === i}
                  tone={feedback && i !== puzzle.answer ? 'wrong' : 'ok'}
                  locked={feedback}
                  onPick={() => dispatch({ type: 'pick', index: i })}
                />
              ))}
            </div>
            <div className="flex items-center gap-[10px] rounded-[14px] bg-[#faf4e8] px-[16px] py-[12px]">
              <GameBulbIcon className="size-[18px] shrink-0 text-[#463409]" />
              <p className="m-0 font-sans text-[14px] leading-[17px] font-semibold text-[#463409]">
                {CHESS_BLITZ.tip}
              </p>
            </div>
          </div>
        </div>
        {feedback ? (
          <GameFeedback
            ok={Boolean(state.ok)}
            title={
              state.ok
                ? `Mate in ${state.took} seconds!`
                : `Not that one. The answer is ${puzzle.options[puzzle.answer].san}.`
            }
            body={puzzle.explain}
            pills={[`+${CHESS_BLITZ.solveXp} XP`]}
          />
        ) : null}
      </div>
    </GameFrame>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES = { 'chess-blitz': ChessBlitz };
export default ChessBlitz;
