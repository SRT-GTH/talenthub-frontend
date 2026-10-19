import { useEffect, useMemo, useReducer } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { useLabText } from '../labFormat.js';
import { FOCUS_RING } from '../labPlayStyles.js';
import { OPTION_LETTERS } from '../labFormat.js';
import {
  GameBulbIcon,
  GameCheckLargeIcon,
  GameCloseXlIcon,
  GameClockIcon,
  GameFileIcon,
  GameHeartIcon,
  GameBoltIcon,
  GameTargetIcon,
} from '../skillGames/GameIcons.jsx';
import { Gen, GameFrame, GameHead, SectionLabel } from '../skillGames/gameKit.jsx';
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
import { BUG_FRAMES, BUG_HUNT, BUG_ROUNDS } from '../skillGames/bugHuntData.js';

const log = debug('BugHunt');

/*
 * Bug Hunt (`/skills-lab/games/bug-hunt`) — Figma SL-GS02 round 4 line tapped (Playful 7943:6875 / Focused 8110:495726),
 * SL-GS03 squashed (7943:7074 / 8110:495830), SL-GS12 verified (7943:9038 / 8110:496727). ?f=GS02|GS03|GS12 boots that frame.
 *
 * Loop: tap the broken line (a wrong line costs a life) → pick the fix (A–C, keys 1–3 / A–C) → "Squash it" → green feedback
 * ("Squashed in N seconds!", +15 XP, combo) → "Next bug" … round 8 → results dialog (pass 6 of 8 = Verified). 60 s per round
 * (a timeout is a missed round), 3 lives (0 ends the run), one hint per round (−5 XP). Round data: bugHuntData.js.
 */

/* ---------- code ---------- */
const GOLD_WORDS = new Set([
  'def',
  'for',
  'in',
  'return',
  'if',
  'else',
  'while',
  'import',
  'print',
  'round',
  'len',
  'range',
  'str',
  'int',
  'float',
  'sum',
  'min',
  'max',
  'sorted',
]);
const TOKEN_RE = /("[^"]*"|'[^']*')|([A-Za-z_]\w*)|(\d+|\s+|[^\w\s])/g;

// Figma token colours (SL-GS02 "momo_payouts.py"): keywords + built-ins #ffd86b, string literals #84cc16, the rest white.
const tokenize = (line) => {
  const out = [];
  for (const m of line.matchAll(TOKEN_RE)) {
    const [text, str, word] = m;
    let tone = 'id';
    if (str) tone = 'lit';
    else if (word && GOLD_WORDS.has(word)) tone = 'fn';
    const last = out[out.length - 1];
    if (last && last.tone === tone) last.text += text;
    else out.push({ text, tone });
  }
  return out;
};
const TONE = { id: 'text-white', fn: 'text-[#ffd86b]', lit: 'text-[#84cc16]' };

const Tag = ({ children, tone = 'ink' }) => (
  <span
    className={classNames(
      'ml-auto inline-flex shrink-0 items-center gap-[6px] rounded-full px-[10px] py-[4px] font-sans text-[12px] leading-[14px] font-bold',
      tone === 'ink' ? 'bg-[#1c2a21] text-[#c1d4c4]' : 'bg-[#c0392b] text-white'
    )}
  >
    <GameTargetIcon
      className={classNames('size-[14px]', tone === 'ink' ? 'text-[#387440]' : 'text-white')}
    />
    {children}
  </span>
);

const CodeLine = (props) => {
  const { n, text, state, onTap, interactive } = props;
  const number = String(n).padStart(2, ' ');
  const lit = state === 'tapped' || state === 'fixed';
  const body = (
    <>
      <span
        aria-hidden="true"
        className={classNames(
          'w-[18px] shrink-0 text-[15px] leading-[20px] whitespace-pre',
          lit ? 'text-[#1c2a21]' : 'text-[#595959] opacity-70'
        )}
        style={{ fontFamily: MONO }}
      >
        {number}
      </span>
      <code
        className={classNames(
          'min-w-0 flex-1 text-[16px] leading-[21px] whitespace-pre max-lg:text-[14px]',
          lit && 'text-[#1c2a21]'
        )}
        style={{ fontFamily: MONO }}
      >
        {lit
          ? text
          : tokenize(text).map((tok, k) => (
              <span key={k} className={TONE[tok.tone]}>
                {tok.text}
              </span>
            ))}
      </code>
      {state === 'tapped' ? <Tag>You tapped this</Tag> : null}
      {state === 'fixed' ? <Tag>Fixed</Tag> : null}
      {state === 'wrong' ? <Tag tone="red">Not this one</Tag> : null}
    </>
  );
  const rowClass = classNames(
    'flex w-full min-w-max items-center gap-[18px] px-[16px] py-[7px] text-left',
    lit && 'bg-[#ffd86b]',
    state === 'wrong' && 'bg-[rgba(192,57,43,0.35)]',
    state === 'hint' && 'bg-[rgba(255,216,107,0.22)] shadow-[inset_4px_0_0_#ffd86b]'
  );
  if (!interactive) {
    return <div className={rowClass}>{body}</div>;
  }
  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={`Line ${n}: ${text.trim() || 'blank'}`}
      className={classNames(
        rowClass,
        'cursor-pointer hover:bg-[rgba(255,255,255,0.06)]',
        FOCUS_RING,
        'focus-visible:-outline-offset-2'
      )}
    >
      {body}
    </button>
  );
};

const Editor = ({ round, view, onTap }) => {
  const lines = round.code.map((text, i) => ({ n: i + 1, text }));
  return (
    <div className="overflow-hidden rounded-[24px] border border-solid border-[rgba(28,42,33,0.12)] bg-[#2a5730]">
      <div className="flex items-center gap-[8px] bg-[#19341d] px-[16px] py-[10px]">
        {['#c0392b', '#c8951a', '#387440'].map((color) => (
          <span
            key={color}
            aria-hidden="true"
            className="size-[11px] shrink-0 rounded-full"
            style={{ backgroundColor: color }}
          />
        ))}
        <span className="inline-flex items-center gap-[6px] rounded-[8px] bg-[#142916] px-[12px] py-[5px]">
          <GameFileIcon className="size-[14px] text-white" />
          <span
            className="text-[13px] leading-[17px] text-white max-lg:text-[12px]"
            style={{ fontFamily: MONO }}
          >
            {round.file}
          </span>
        </span>
      </div>
      <div className="flex flex-col overflow-x-auto py-[12px]" role="group" aria-label="Code">
        {lines.map((line) => {
          let state = 'idle';
          if (view.phase === 'playing') {
            if (view.tapped === line.n) state = 'tapped';
            else if (view.wrongTaps.includes(line.n)) state = 'wrong';
            else if (view.hintLine === line.n) state = 'hint';
          } else if (line.n === round.bug) state = 'fixed';
          return (
            <CodeLine
              key={line.n}
              n={line.n}
              text={line.n === round.bug && state === 'fixed' ? round.fixed : line.text}
              state={state}
              interactive={
                view.phase === 'playing' && line.text.trim() !== '' && view.tapped === null
              }
              onTap={() => onTap(line.n)}
            />
          );
        })}
      </div>
    </div>
  );
};

/* ---------- fixes ---------- */
const FixCard = (props) => {
  const { letter, text, tone, disabled, onPick } = props;
  const selected = tone === 'selected' || tone === 'correct';
  const wrong = tone === 'wrong';
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${letter}: ${text}`}
      disabled={disabled}
      onClick={onPick}
      className={classNames(
        'flex min-w-0 flex-1 items-center gap-[12px] rounded-[16px] px-[16px] py-[14px] text-left',
        selected && classNames('bg-[#ebf1ec]', SEL_BORDER, SEL_SHADOW),
        wrong && 'border border-solid border-[#c0392b] bg-[#f9ebea] playful:border-[1.5px]',
        !selected && !wrong && classNames('bg-white', HAIR),
        tone === 'dim' && 'opacity-55',
        disabled ? 'cursor-default' : 'cursor-pointer',
        FOCUS_RING
      )}
    >
      <span
        aria-hidden="true"
        data-count={letter}
        className={classNames(
          'after:content-[attr(data-count)] inline-flex h-[24px] min-w-[27px] shrink-0 items-center justify-center rounded-[8px] px-[9px] font-sans text-[13px] leading-[16px] font-bold',
          selected && 'bg-[#387440] text-white',
          wrong && 'bg-[#c0392b] text-white',
          !selected && !wrong && 'bg-[#f8f8f4] text-[#1c2a21]'
        )}
      ></span>
      <Gen
        text={text}
        style={{ fontFamily: MONO }}
        className="min-w-0 flex-1 text-[15px] leading-[20px] break-words text-[#1c2a21] max-lg:text-[14px]"
      />
    </button>
  );
};

/* ---------- feedback ---------- */
const Feedback = ({ ok, title, body, gain, combo }) => (
  <>
    <div
      role="status"
      aria-live="polite"
      className={classNames(
        'flex items-center gap-[20px] rounded-[20px] px-[24px] py-[20px] max-sm:flex-wrap',
        ok
          ? 'border border-solid border-[#387440] bg-[#ebf1ec] playful:border-[1.5px]'
          : 'border border-solid border-[#c0392b] bg-[#f9ebea] playful:border-[1.5px]'
      )}
    >
      <span
        aria-hidden="true"
        className="inline-flex size-[56px] shrink-0 items-center justify-center rounded-full border-2 border-solid border-[rgba(28,42,33,0.12)] bg-white text-[#1c2a21] playful:border-[#1c2a21]"
      >
        {ok ? (
          <GameCheckLargeIcon className="size-[28px]" />
        ) : (
          <GameCloseXlIcon className="size-[28px] text-[#c0392b]" />
        )}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
        <p className="m-0 font-sans text-[24px] leading-[29px] font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading">
          {title}
        </p>
        <p className="m-0 font-sans text-[15px] leading-[22px] font-medium text-[#1c2a21]">
          {body}
        </p>
      </div>
      {ok ? (
        <div className="hidden shrink-0 flex-col items-center gap-[6px] playful:flex">
          <span className="inline-flex items-center rounded-full border-[1.5px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[11px] leading-[13px] font-bold text-[#1c2a21] max-lg:text-[12px]">
            +{gain} XP
          </span>
          <span className="inline-flex items-center rounded-full border-[1.5px] border-solid border-[#1c2a21] bg-white px-[11px] py-[5px] font-sans text-[11px] leading-[13px] font-bold text-[#1c2a21] max-lg:text-[12px]">
            X{combo} COMBO
          </span>
        </div>
      ) : null}
    </div>
  </>
);

const Tip = ({ children }) => (
  <div
    className={classNames(
      'flex items-center gap-[10px] rounded-[14px] bg-white px-[16px] py-[12px] border border-solid border-[rgba(28,42,33,0.1)] playful:border-[rgba(28,42,33,0.15)]'
    )}
  >
    <GameBulbIcon className="size-[18px] shrink-0 text-[#c8951a]" />
    <p className="m-0 font-sans text-[14px] leading-[17px] text-[#1c2a21]">{children}</p>
  </div>
);

/* ---------- state ---------- */
const fresh = () => ({
  round: 0,
  results: [],
  lives: BUG_HUNT.lives,
  combo: 0,
  tapped: null,
  picked: null,
  wrongTaps: [],
  wrongFixes: [],
  hintUsed: false,
  hintLine: null,
  hintFix: null,
  phase: 'playing',
  squashedIn: null,
  gain: 0,
  xp: BUG_HUNT.baseXp,
  frozen: false,
  seeded: false,
  runKey: 0,
});

const fromFrame = (code) => {
  const seed = code ? BUG_FRAMES[code] : null;
  if (!seed) return fresh();
  return {
    ...fresh(),
    ...seed,
    wrongTaps: [],
    wrongFixes: [],
    frozen: true,
    seeded: true,
  };
};

const finishState = (state, results, extra = {}) => {
  const total = BUG_HUNT.total;
  const filled = Array.from({ length: total }, (_, i) => results[i] ?? 'bad');
  return { ...state, ...extra, results: filled, phase: 'finished', tapped: state.tapped };
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'tap': {
      if (state.phase !== 'playing' || state.tapped !== null) return state;
      const round = BUG_ROUNDS[state.round];
      const base = { ...state, frozen: false };
      if (action.line === round.bug) return { ...base, tapped: action.line, hintLine: null };
      const lives = state.lives - 1;
      const next = { ...base, lives, combo: 0, wrongTaps: [...state.wrongTaps, action.line] };
      return lives <= 0 ? finishState(next, state.results) : next;
    }
    case 'pick':
      if (state.phase !== 'playing' || state.tapped === null) return state;
      if (state.wrongFixes.includes(action.index)) return state;
      return { ...state, picked: action.index, frozen: false };
    case 'hint': {
      if (state.phase !== 'playing' || state.hintUsed) return state;
      const round = BUG_ROUNDS[state.round];
      if (state.tapped === null)
        return { ...state, hintUsed: true, hintLine: round.bug, frozen: false };
      const wrongOne = round.fixes.findIndex(
        (_, i) => i !== round.answer && !state.wrongFixes.includes(i)
      );
      return { ...state, hintUsed: true, hintFix: wrongOne, frozen: false };
    }
    case 'check': {
      if (state.phase !== 'playing' || state.picked === null) return state;
      const round = BUG_ROUNDS[state.round];
      if (state.picked !== round.answer) {
        const lives = state.lives - 1;
        const next = {
          ...state,
          lives,
          combo: 0,
          wrongFixes: [...state.wrongFixes, state.picked],
          picked: null,
        };
        return lives <= 0 ? finishState(next, state.results) : next;
      }
      const results = [...state.results];
      results[state.round] = 'ok';
      return {
        ...state,
        results,
        combo: state.combo + 1,
        phase: 'squashed',
        squashedIn: BUG_HUNT.roundSeconds - action.left,
        gain: BUG_HUNT.squashXp,
      };
    }
    case 'timeout': {
      if (state.phase !== 'playing') return state;
      const results = [...state.results];
      results[state.round] = 'bad';
      return { ...state, results, combo: 0, phase: 'missed', gain: 0 };
    }
    case 'next': {
      if (state.phase !== 'squashed' && state.phase !== 'missed') return state;
      const xp = state.xp + state.gain;
      if (state.round + 1 >= BUG_HUNT.total) return finishState({ ...state, xp }, state.results);
      return {
        ...state,
        xp,
        gain: 0,
        round: state.round + 1,
        tapped: null,
        picked: null,
        wrongTaps: [],
        wrongFixes: [],
        hintUsed: false,
        hintLine: null,
        hintFix: null,
        phase: 'playing',
        squashedIn: null,
        frozen: false,
      };
    }
    case 'restart':
      return { ...fresh(), runKey: state.runKey + 1 };
    default:
      return state;
  }
};

const BugHunt = ({ frame }) => {
  const [state, dispatch] = useReducer(reducer, frame, fromFrame);
  const { t } = useLabText();
  const [resultOpen, setResultOpen] = useReducer((_, v) => v, true);
  const round = BUG_ROUNDS[state.round];
  const running = state.phase === 'playing' && !state.frozen;
  const left = useCountdown({
    start: state.seeded && state.round === 3 && state.runKey === 0 ? 38 : BUG_HUNT.roundSeconds,
    running,
    resetKey: `${state.round}:${state.runKey}`,
    onZero: () => dispatch({ type: 'timeout' }),
  });

  useEffect(() => {
    log('mount', { frame });
  }, [frame]);

  const finished = state.phase === 'finished';
  const squashed = state.results.filter((r) => r === 'ok').length;
  const missed = state.results.filter((r) => r === 'bad').length;
  const passed = squashed >= BUG_HUNT.passMark;

  const result = useMemo(() => {
    if (!finished) return null;
    const drawn = frame === 'GS12' ? BUG_FRAMES.GS12.modal : null;
    return buildGameResult({
      skill: BUG_HUNT.skill,
      gameName: BUG_HUNT.label,
      verb: 'squashed',
      noun: 'bugs',
      statLabel: 'BUGS SQUASHED',
      correct: squashed,
      total: BUG_HUNT.total,
      passMark: `${BUG_HUNT.passMark} of ${BUG_HUNT.total}`,
      neededLabel: `${BUG_HUNT.passMark} of ${BUG_HUNT.total}`,
      passed,
      earned: drawn
        ? drawn.earned
        : squashed * BUG_HUNT.squashXp + (passed ? BUG_HUNT.passBonusXp : 0),
      dots: drawn ? drawn.dots : state.results.map((r) => (r === 'ok' ? 'ok' : 'bad')),
      topics: drawn ? drawn.topics : topicRowsFor(BUG_ROUNDS, state.results),
    });
  }, [finished, frame, squashed, passed, state.results]);

  const dots = Array.from({ length: BUG_HUNT.total }, (_, i) => {
    if (state.results[i]) return { state: state.results[i], label: String(i + 1) };
    if (!finished && i === state.results.length) return { state: 'now', label: String(i + 1) };
    return { state: 'todo', label: String(i + 1) };
  });

  const pick = (index) => dispatch({ type: 'pick', index });
  const check = () => dispatch({ type: 'check', left });

  // Keys: 1–3 / A–C pick a fix, Enter squashes or moves on.
  useEffect(() => {
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName)) return;
      const key = event.key.toLowerCase();
      const index =
        ['1', '2', '3'].indexOf(key) >= 0 ? Number(key) - 1 : ['a', 'b', 'c'].indexOf(key);
      if (index >= 0 && state.phase === 'playing' && state.tapped !== null) pick(index);
      else if (event.key === 'Enter' && event.target?.tagName !== 'BUTTON') {
        if (state.phase === 'playing' && state.picked !== null) check();
        else if (state.phase === 'squashed' || state.phase === 'missed') dispatch({ type: 'next' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const answered = state.phase === 'squashed' || state.phase === 'missed';
  const isLast = state.round + 1 >= BUG_HUNT.total;
  const footer = answered
    ? {
        primary: {
          label: isLast ? 'See results' : 'Next bug',
          onClick: () => dispatch({ type: 'next' }),
        },
      }
    : {
        link: {
          label: state.hintUsed
            ? 'Hint used'
            : t('Use a hint (-{cost} {xp})', { cost: BUG_HUNT.hintCost }),
          onClick: () => dispatch({ type: 'hint' }),
          disabled: state.hintUsed,
        },
        primary: {
          label: 'Squash it',
          disabled: state.picked === null,
          onClick: check,
        },
      };

  const fixTone = (i) => {
    if (state.wrongFixes.includes(i)) return 'wrong';
    if (state.picked === i) return 'selected';
    if (state.hintFix === i) return 'dim';
    return 'idle';
  };

  return (
    <GameFrame
      game={{
        title: BUG_HUNT.title,
        label: BUG_HUNT.label,
        subtitle: finished ? 'Python · Run complete' : BUG_HUNT.subtitle,
        sticker: finished && passed ? 'VERIFIED' : BUG_HUNT.sticker,
      }}
      xp={
        finished && frame !== 'GS12'
          ? BUG_HUNT.baseXp + (result ? parseEarned(result) : 0)
          : state.xp
      }
      streakDays={BUG_HUNT.streakDays}
      progress={{
        countLabel: finished ? 'Run complete' : `Round ${state.round + 1} of ${BUG_HUNT.total}`,
        summary: finished
          ? `${squashed} of ${BUG_HUNT.total} squashed`
          : `${squashed} squashed · ${missed} missed`,
        dots,
        passMark: `Pass mark: ${BUG_HUNT.passMark} of ${BUG_HUNT.total}`,
      }}
      footer={footer}
      result={result}
      resultOpen={resultOpen}
      onResultsClose={() => setResultOpen(false)}
      onReopenResults={() => setResultOpen(true)}
      current={state.round + 1}
      total={BUG_HUNT.total}
      correct={squashed}
      onRestart={() => {
        dispatch({ type: 'restart' });
        setResultOpen(true);
      }}
    >
      <div className="flex flex-col gap-[22px]">
        <GameHead
          eyebrow={`ROUND ${state.round + 1} · PYTHON`}
          title={[
            ['Which line has ', false],
            ['the bug?', true],
          ]}
          prompt={round.report}
          stats={[
            { Icon: GameClockIcon, label: `${formatClock(left)} left` },
            { Icon: GameHeartIcon, label: `Lives ${state.lives} of ${BUG_HUNT.lives}` },
            { Icon: GameBoltIcon, label: `x${state.combo} combo` },
          ]}
          checks={round.check}
        />
        <Editor
          round={round}
          view={{
            phase: state.phase === 'finished' ? 'squashed' : state.phase,
            tapped: state.tapped,
            wrongTaps: state.wrongTaps,
            hintLine: state.hintLine,
          }}
          onTap={(line) => dispatch({ type: 'tap', line })}
        />
        {state.phase === 'playing' && state.tapped !== null ? (
          <>
            <SectionLabel>{`PICK THE FIX FOR LINE ${state.tapped}`}</SectionLabel>
            <div
              role="radiogroup"
              aria-label={`Fixes for line ${state.tapped}`}
              className="flex flex-wrap gap-[12px] max-md:flex-col"
            >
              {round.fixes.map((text, i) => (
                <FixCard
                  key={text}
                  letter={OPTION_LETTERS[i]}
                  text={text}
                  tone={fixTone(i)}
                  disabled={state.wrongFixes.includes(i)}
                  onPick={() => pick(i)}
                />
              ))}
            </div>
          </>
        ) : null}
        {answered || finished ? (
          <>
            <Feedback
              ok={state.phase !== 'missed'}
              title={
                state.phase === 'missed'
                  ? 'Out of time'
                  : `Squashed in ${state.squashedIn ?? 0} seconds!`
              }
              body={round.explain}
              gain={BUG_HUNT.squashXp}
              combo={state.combo}
            />
            <Tip>{round.tip}</Tip>
          </>
        ) : null}
      </div>
    </GameFrame>
  );
};

// "+120 {xp}" → 120 (the header XP after a live run = what the player had + what the modal says was earned).
const parseEarned = (result) => {
  const stat = result.stats.find((s) => s.label === 'EARNED' || s.label === 'FOR PRACTICE');
  return Number(String(stat?.value ?? '').replace(/[^\d]/g, '')) || 0;
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES = { 'bug-hunt': BugHunt };
export default BugHunt;
