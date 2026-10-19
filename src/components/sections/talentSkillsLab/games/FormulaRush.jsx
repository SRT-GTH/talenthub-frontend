import { useEffect, useMemo, useReducer, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { FOCUS_RING } from '../labPlayStyles.js';
import { GameBoltIcon, GameClockIcon, GameSpeedmeterIcon } from '../skillGames/GameIcons.jsx';
import { GameFeedback, GameFrame, GameHead, GameTip } from '../skillGames/gameKit.jsx';
import { HAIR, MONO, buildGameResult, formatClock } from '../skillGames/gameKitUtils.js';
import { FORMULA_FRAMES, FORMULA_RUSH, LAPS, SHEET } from '../skillGames/formulaRushData.js';

const log = debug('FormulaRush');

/*
 * Formula Rush (`/skills-lab/games/formula-rush`) — Figma SL-GS10 "Lap 3" (Playful 7943:8468 / Focused 8110:496529).
 * ?f=GS10 boots it. Loop: tap a chip under "Tap to fill:" to put it in the dashed slot of the formula (tap the filled slot to
 * empty it) → "Fire formula" → F2 shows the value, your knob races the ghost → "Next lap" … lap 6 → results (pass 5 of 6).
 * A lap is clean when the formula is right and fired in under 30 s; lap time counts up. Data + assumptions: formulaRushData.js.
 */

const TOKEN_BASE =
  'inline-flex items-center rounded-[8px] px-[8px] py-[4px] text-[15px] leading-[20px] text-[#1c2a21] max-lg:text-[14px]';
const PART = {
  fn: 'bg-[#387440] text-white',
  range: 'bg-[#eaeffb]',
  text: 'bg-[#faf4e8]',
};

const Formula = ({ lap, filled, onClear }) => (
  <div
    className={classNames(
      'flex flex-wrap items-center gap-[10px] rounded-[14px] bg-white px-[14px] py-[10px]',
      HAIR
    )}
    role="group"
    aria-label="Formula"
  >
    <span className="inline-flex rounded-full bg-[#f8f8f4] px-[12px] py-[3px] font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]">
      fx
    </span>
    {lap.parts.map((part, i) => {
      if (part.k === 'comma' || part.k === 'close')
        return (
          <span
            key={i}
            className="text-[15px] leading-[20px] text-[#1c2a21]"
            style={{ fontFamily: MONO }}
          >
            {part.t}
          </span>
        );
      if (part.k === 'slot') {
        return filled ? (
          <button
            key={i}
            type="button"
            onClick={onClear}
            title="Empty the slot"
            className={classNames(TOKEN_BASE, 'cursor-pointer bg-[#ffd86b]', FOCUS_RING)}
            style={{ fontFamily: MONO }}
          >
            {filled}
          </button>
        ) : (
          <span
            key={i}
            className="inline-flex items-center rounded-[8px] border-[1.5px] border-dashed border-[rgba(28,42,33,0.12)] bg-[#fffefc] px-[16px] py-[5px] font-sans text-[13px] leading-[16px] font-semibold text-[#595959] playful:border-[rgba(28,42,33,0.5)]"
          >
            {part.t}
          </span>
        );
      }
      return (
        <span key={i} className={classNames(TOKEN_BASE, PART[part.k])} style={{ fontFamily: MONO }}>
          {part.t}
        </span>
      );
    })}
  </div>
);

const Sheet = ({ lap, cell }) => {
  const tinted = (letter, row) =>
    lap.hl.some((h) => {
      const [col, val] = h.split(':');
      return col === letter && row.includes(val);
    });
  const cols = ['A', 'B', 'C', 'D', 'E'];
  return (
    <div className={classNames('overflow-x-auto rounded-[24px] bg-white', HAIR)}>
      <div className="flex min-w-[760px] flex-col gap-[8px]">
        <div className="grid grid-cols-[44px_1.7fr_1.5fr_1.7fr_1.1fr_1.5fr_2.4fr] bg-[#f8f8f4] font-sans text-[12px] leading-[14px] font-bold text-[#595959]">
          {SHEET.heads.map((h, i) => (
            <span key={i} className="px-[10px] py-[7px]">
              {h}
            </span>
          ))}
        </div>
        <div className="grid min-h-[36px] grid-cols-[44px_1.7fr_1.5fr_1.7fr_1.1fr_1.5fr_2.4fr] items-center border-b border-solid border-[rgba(28,42,33,0.08)] font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
          {SHEET.header.map((h, i) => (
            <span key={i} className={classNames('px-[10px] py-[9px]', i === 0 && 'text-[#595959]')}>
              {h}
            </span>
          ))}
        </div>
        {SHEET.rows.map((row) => (
          <div
            key={row[0]}
            className={classNames(
              'grid grid-cols-[44px_1.7fr_1.5fr_1.7fr_1.1fr_1.5fr_2.4fr] items-center border-b border-solid border-[rgba(28,42,33,0.08)] font-sans text-[14px] leading-[17px] text-[#1c2a21]',
              row[0] === '2' ? 'min-h-[41px]' : 'min-h-[37px]'
            )}
          >
            {row.map((value, i) => (
              <span
                key={i}
                className={classNames(
                  'px-[10px] py-[9px]',
                  i === 0 && 'font-semibold text-[#595959]',
                  i > 0 && tinted(cols[i - 1], row) && 'bg-[#faf4e8]'
                )}
                style={i === 4 ? { fontFamily: MONO } : undefined}
              >
                {value}
              </span>
            ))}
            <span
              className={classNames(
                'px-[10px] py-[9px] text-white',
                row[0] === '2' && 'bg-[#387440] border border-solid border-[rgba(28,42,33,0.12)]'
              )}
              style={{ fontFamily: MONO }}
            >
              {row[0] === '2' ? cell : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const fresh = (runKey = 0) => ({
  lap: 0,
  results: [],
  held: null,
  slot: null,
  value: null,
  took: null,
  elapsed: 0,
  phase: 'playing',
  frozen: false,
  seconds: 0,
  runKey,
});
const fromFrame = (code) => {
  const seed = code ? FORMULA_FRAMES[code] : null;
  return seed ? { ...fresh(), ...seed, frozen: true, elapsed: seed.seconds } : fresh();
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'tick':
      return state.phase === 'playing' && !state.frozen
        ? { ...state, elapsed: state.elapsed + 1 }
        : state;
    case 'fill':
      return state.phase === 'playing'
        ? { ...state, slot: action.index, held: action.index, frozen: false }
        : state;
    case 'clear':
      return state.phase === 'playing' ? { ...state, slot: null, held: null } : state;
    case 'fire':
    case 'lost': {
      if (state.phase !== 'playing') return state;
      const lap = LAPS[state.lap];
      const right = action.type === 'fire' && state.slot === lap.answer;
      const clean = right && state.elapsed < FORMULA_RUSH.cleanUnder;
      const results = [...state.results];
      results[state.lap] = clean ? 'ok' : 'bad';
      return {
        ...state,
        results,
        phase: 'fired',
        value: right ? lap.value : action.type === 'fire' ? '#VALUE!' : '—',
        right,
        took: state.elapsed,
      };
    }
    case 'next': {
      if (state.phase !== 'fired') return state;
      if (state.lap + 1 >= FORMULA_RUSH.total) return { ...state, phase: 'finished' };
      return { ...fresh(state.runKey), lap: state.lap + 1, results: state.results };
    }
    case 'restart':
      return fresh(state.runKey + 1);
    default:
      return state;
  }
};

const FormulaRush = ({ frame }) => {
  const [state, dispatch] = useReducer(reducer, frame, fromFrame);
  const [resultOpen, setResultOpen] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const lap = LAPS[state.lap];
  const finished = state.phase === 'finished';
  const fired = state.phase === 'fired';
  const clean = state.results.filter((r) => r === 'ok').length;
  const passed = clean >= FORMULA_RUSH.passMark;

  useEffect(() => {
    log('mount', { frame });
  }, [frame]);

  useEffect(() => {
    if (state.phase !== 'playing' || state.frozen) return undefined;
    const timer = setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => clearInterval(timer);
  }, [state.phase, state.frozen, state.lap, state.runKey]);

  useEffect(() => {
    if (state.phase === 'playing' && state.elapsed >= FORMULA_RUSH.lostAt)
      dispatch({ type: 'lost' });
  }, [state.elapsed, state.phase]);

  const result = useMemo(() => {
    if (!finished) return null;
    const rows = {};
    LAPS.forEach((l, i) => {
      rows[l.topic] ??= { label: l.topic, nums: [], strong: true };
      rows[l.topic].nums.push(i + 1);
      if (state.results[i] !== 'ok') rows[l.topic].strong = false;
    });
    const topics = Object.values(rows).map((r) => ({
      label: r.label,
      strong: r.strong,
      qs: `Lap${r.nums.length > 1 ? 's' : ''} ${r.nums.join(', ')}`,
    }));
    return buildGameResult({
      skill: FORMULA_RUSH.skill,
      gameName: FORMULA_RUSH.label,
      verb: 'finished',
      noun: 'laps clean',
      statLabel: 'LAPS CLEAN',
      correct: clean,
      total: FORMULA_RUSH.total,
      passMark: `${FORMULA_RUSH.passMark} of ${FORMULA_RUSH.total}`,
      passed,
      earned: clean * FORMULA_RUSH.lapXp + (passed ? FORMULA_RUSH.passBonusXp : 0),
      dots: state.results.map((r) => (r === 'ok' ? 'ok' : 'bad')),
      topics: [...topics.filter((t) => t.strong), ...topics.filter((t) => !t.strong)],
    });
  }, [finished, clean, passed, state.results]);

  const done = state.results.filter(Boolean).length;
  const dots = Array.from({ length: FORMULA_RUSH.total }, (_, i) => {
    if (state.results[i]) return { state: state.results[i], label: String(i + 1) };
    if (!finished && i === done) return { state: 'now', label: String(i + 1) };
    return { state: 'todo', label: String(i + 1) };
  });
  const prior = state.results.slice(0, state.lap);
  const priorOk = prior.filter((r) => r === 'ok').length;
  const summary = !prior.length
    ? 'No laps yet'
    : priorOk === prior.length
      ? `${prior.length} ${prior.length === 1 ? 'lap · under 30s' : prior.length === 2 ? 'laps · both under 30s' : 'laps · all under 30s'}`
      : `${priorOk} of ${prior.length} laps clean`;

  const ghostPct = Math.min(100, (state.elapsed / FORMULA_RUSH.ghostSeconds) * 100);
  const mePct = fired
    ? state.right
      ? 100
      : 40
    : Math.min(58, (state.elapsed / 18) * 58) + (state.slot !== null && !state.frozen ? 0 : 0);
  const lead = Math.max(0, Math.round(state.elapsed / 4.5));
  const isLast = state.lap + 1 >= FORMULA_RUSH.total;
  const chipLabel = state.held ?? state.slot;
  const footer = fired
    ? {
        primary: {
          label: isLast ? 'See results' : 'Next lap',
          onClick: () => dispatch({ type: 'next' }),
        },
      }
    : {
        link: { label: 'Formula cheat sheet', onClick: () => setSheetOpen((o) => !o) },
        primary: {
          label: 'Fire formula',
          disabled: state.slot === null,
          onClick: () => dispatch({ type: 'fire' }),
        },
      };

  return (
    <GameFrame
      game={{
        title: FORMULA_RUSH.title,
        label: FORMULA_RUSH.label,
        subtitle: FORMULA_RUSH.subtitle,
        sticker: `LAP ${Math.min(state.lap + 1, FORMULA_RUSH.total)} OF ${FORMULA_RUSH.total}`,
      }}
      xp={FORMULA_RUSH.baseXp}
      streakDays={FORMULA_RUSH.streakDays}
      progress={{
        countLabel: finished ? 'Race over' : `Lap ${state.lap + 1} of ${FORMULA_RUSH.total}`,
        summary,
        dots,
        passMark: `Pass mark: ${FORMULA_RUSH.passMark} of ${FORMULA_RUSH.total}`,
      }}
      footer={footer}
      result={result}
      resultOpen={resultOpen}
      onResultsClose={() => setResultOpen(false)}
      onReopenResults={() => setResultOpen(true)}
      current={state.lap + 1}
      total={FORMULA_RUSH.total}
      correct={clean}
      onRestart={() => {
        dispatch({ type: 'restart' });
        setResultOpen(true);
      }}
    >
      <div className="flex flex-col gap-[22px]">
        <GameHead
          eyebrow={`LAP ${state.lap + 1} · EXCEL AND GOOGLE SHEETS`}
          title={lap.title}
          prompt={lap.prompt}
          stats={[
            { Icon: GameClockIcon, label: `Lap time ${formatClock(state.elapsed)}` },
            { Icon: GameSpeedmeterIcon, label: `Ghost ${lead}s ahead` },
          ]}
          checks={lap.checks}
        />
        <div
          className={classNames(
            'flex items-center gap-[14px] rounded-[24px] bg-[#ffd86b] p-[16px]',
            HAIR
          )}
        >
          <span className="font-sans text-[12px] leading-[14px] font-bold text-[#1c2a21]">YOU</span>
          <div
            className="relative h-[28px] min-w-0 flex-1 rounded-full border-[1.5px] border-solid border-[rgba(28,42,33,0.12)] bg-white playful:border-[#1c2a21]"
            role="img"
            aria-label={`You are at ${Math.round(mePct)} percent, the ghost at ${Math.round(ghostPct)} percent`}
          >
            <span
              aria-hidden="true"
              className="absolute top-1/2 inline-flex size-[30px] -translate-y-1/2 rounded-full bg-[rgba(28,42,33,0.25)]"
              style={{ left: `${Math.min(ghostPct, 96)}%` }}
            />
            <span
              aria-hidden="true"
              className="absolute top-1/2 inline-flex size-[36px] -translate-y-1/2 items-center justify-center rounded-full border-2 border-solid border-[rgba(28,42,33,0.12)] bg-[#387440] playful:border-[#1c2a21]"
              style={{ left: `${Math.min(mePct, 95)}%` }}
            >
              <GameBoltIcon className="size-[18px] text-white" />
            </span>
          </div>
          <span
            aria-hidden="true"
            data-count={`Ghost is ${lead}s ahead`}
            className="rounded-full border-[1.5px] border-solid border-[rgba(28,42,33,0.12)] bg-white px-[12px] py-[3px] font-sans text-[12px] leading-[14px] font-semibold text-[#1c2a21] after:content-[attr(data-count)] max-md:hidden playful:border-[#1c2a21]"
          />
        </div>
        <Formula
          lap={lap}
          filled={state.slot === null ? null : lap.tokens[state.slot]}
          onClear={() => dispatch({ type: 'clear' })}
        />
        <Sheet lap={lap} cell={state.value ?? '?'} />
        <div className="flex flex-wrap items-center gap-[10px]">
          <span className="font-sans text-[13.5px] leading-[16px] font-semibold text-[#595959]">
            Tap to fill:
          </span>
          {lap.tokens.map((token, i) => (
            <button
              key={token}
              type="button"
              disabled={fired}
              onClick={() => dispatch({ type: 'fill', index: i })}
              aria-pressed={chipLabel === i}
              className={classNames(
                'rounded-[10px] px-[12px] py-[7px] text-[14px] leading-[18px] text-[#1c2a21]',
                'border border-solid border-[rgba(28,42,33,0.12)] playful:border-[1.5px] playful:border-[#1c2a21]',
                chipLabel === i ? 'bg-[#ffd86b]' : 'bg-white',
                fired ? 'cursor-default' : 'cursor-pointer',
                FOCUS_RING
              )}
              style={{ fontFamily: MONO }}
            >
              {token}
            </button>
          ))}
        </div>
        {sheetOpen && !fired ? (
          <GameTip>
            SUMIF adds up one column where another column matches. SUM adds a range, COUNTIF counts
            matches, AVERAGE and MAX read a range.
          </GameTip>
        ) : null}
        {fired ? (
          <GameFeedback
            ok={state.results[state.lap] === 'ok'}
            title={
              state.results[state.lap] === 'ok'
                ? `Clean lap in ${state.took} seconds!`
                : state.right
                  ? `Right formula, but ${state.took} seconds is too slow.`
                  : 'That formula did not return the right value.'
            }
            body={`F2 shows ${state.value}.`}
            pills={[`+${FORMULA_RUSH.lapXp} XP`]}
          />
        ) : null}
      </div>
    </GameFrame>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES = { 'formula-rush': FormulaRush };
export default FormulaRush;
