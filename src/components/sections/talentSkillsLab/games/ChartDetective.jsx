import { useEffect, useMemo, useReducer, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { FOCUS_RING } from '../labPlayStyles.js';
import {
  GameBoltIcon,
  GameCheckCircleFillIcon,
  GameClockIcon,
  GameWarningIcon,
} from '../skillGames/GameIcons.jsx';
import { GameFeedback, GameFrame, GameHead, SectionLabel } from '../skillGames/gameKit.jsx';
import {
  HAIR,
  SEL_BORDER,
  SEL_SHADOW,
  buildGameResult,
  formatClock,
  topicRowsFor,
  useCountdown,
} from '../skillGames/gameKitUtils.js';
import { CHART_CASES, CHART_DETECTIVE, CHART_FRAMES } from '../skillGames/chartDetectiveData.js';

const log = debug('ChartDetective');

/*
 * Chart Detective (`/skills-lab/games/chart-detective`) — Figma SL-GS05 "Case 3" (Playful 7943:7482 / Focused 8110:496031).
 * ?f=GS05 boots it. Loop: tap the chart you think is lying → "WHY IS CHART X MISLEADING?" appears → pick the reason →
 * "Solve the case" → feedback → "Next case" … case 6 → results (pass 5 of 6). 60 s per case, bonus under 45 s, "Zoom in"
 * stacks the charts full width. Data + assumptions: chartDetectiveData.js.
 */

const BAR = '#387440';
const LAST = '#c8951a';
const pct = (px) => `${(px / 468) * 100}%`;

const Plot = ({ chart, months }) => (
  <div
    className={classNames('relative h-[260px] overflow-hidden rounded-[12px] bg-white', HAIR)}
    role="img"
    aria-label={`Bar chart, axis ${chart.ticks[0]} to ${chart.ticks[4]}`}
  >
    {chart.ticks.map((tick, k) => (
      <div key={tick}>
        <span
          className="absolute left-[8px] font-sans text-[11px] leading-[13px] font-medium text-[#595959] max-lg:text-[12px]"
          style={{ top: 222 - 50 * k }}
        >
          {tick}
        </span>
        <span
          className="absolute h-px bg-[rgba(28,42,33,0.08)]"
          style={{ left: pct(60), right: 0, top: 230 - 50 * k }}
        />
      </div>
    ))}
    {chart.heights.map((h, i) => (
      <div key={months[i]}>
        <span
          className="absolute rounded-t-[6px]"
          style={{
            left: pct(76 + 68 * i),
            width: pct(46),
            bottom: 30,
            height: h,
            backgroundColor: i === 5 ? LAST : BAR,
          }}
        />
        <span
          className="absolute text-center font-sans text-[11px] leading-[13px] font-medium text-[#595959] max-lg:text-[12px]"
          style={{ left: pct(76 + 68 * i), width: pct(46), top: 236 }}
        >
          {months[i]}
        </span>
      </div>
    ))}
    {chart.note ? (
      <span className="absolute top-[200px] left-[6px] inline-flex items-center gap-[6px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#f9ebea] px-[10px] py-[5px] font-sans text-[12px] leading-[14px] font-bold text-[#902b20] playful:border-[1.2px] playful:border-[#1c2a21]">
        <GameWarningIcon className="size-[14px] shrink-0" />
        {chart.note}
      </span>
    ) : null}
  </div>
);

const ChartCard = (props) => {
  const { letter, title, chart, months, selected, locked, onPick } = props;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`Chart ${letter}: ${title}`}
      disabled={locked}
      onClick={onPick}
      className={classNames(
        'flex min-w-0 flex-col gap-[12px] rounded-[20px] p-[20px] text-left',
        selected
          ? classNames('bg-[#ebf1ec]', SEL_BORDER, SEL_SHADOW)
          : classNames('bg-white', HAIR),
        locked ? 'cursor-default' : 'cursor-pointer',
        FOCUS_RING
      )}
    >
      <span className="flex items-center gap-[8px]">
        <span
          aria-hidden="true"
          data-count={letter}
          className={classNames(
            'inline-flex h-[22px] min-w-[27px] items-center justify-center rounded-[8px] px-[9px] font-sans text-[13px] leading-[16px] font-bold after:content-[attr(data-count)]',
            selected ? 'bg-[#387440] text-white' : 'bg-[#f8f8f4] text-[#1c2a21]'
          )}
        />
        <span className="font-sans text-[14.5px] leading-[17px] font-semibold text-[#1c2a21]">
          {title}
        </span>
      </span>
      <Plot chart={chart} months={months} />
    </button>
  );
};

const Reason = ({ label, selected, locked, onPick }) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    aria-label={label}
    disabled={locked}
    onClick={onPick}
    className={classNames(
      'inline-flex items-center gap-[8px] rounded-full px-[16px] py-[10px] font-sans text-[14.5px] leading-[17px] font-semibold',
      HAIR,
      selected ? 'bg-[#387440] text-white' : 'bg-white text-[#1c2a21]',
      locked ? 'cursor-default' : 'cursor-pointer',
      FOCUS_RING
    )}
  >
    {selected ? <GameCheckCircleFillIcon className="size-[16px] shrink-0 text-white" /> : null}
    <span aria-hidden="true" data-count={label} className="after:content-[attr(data-count)]" />
  </button>
);

const fresh = (runKey = 0) => ({
  index: 0,
  results: [],
  pick: null,
  reason: null,
  phase: 'playing',
  took: null,
  frozen: false,
  seconds: null,
  runKey,
});
const fromFrame = (code) => {
  const seed = code ? CHART_FRAMES[code] : null;
  return seed ? { ...fresh(), ...seed, frozen: true } : fresh();
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'pick':
      return state.phase === 'playing'
        ? { ...state, pick: action.letter, reason: null, frozen: false }
        : state;
    case 'reason':
      return state.phase === 'playing' && state.pick
        ? { ...state, reason: action.index, frozen: false }
        : state;
    case 'solve': {
      if (state.phase !== 'playing' || state.pick === null || state.reason === null) return state;
      const c = CHART_CASES[state.index];
      const ok = state.pick === c.lying && state.reason === c.reason;
      const results = [...state.results];
      results[state.index] = ok ? 'ok' : 'bad';
      return {
        ...state,
        results,
        phase: ok ? 'solved' : 'wrong',
        took: CHART_DETECTIVE.seconds - action.left,
      };
    }
    case 'timeout': {
      if (state.phase !== 'playing') return state;
      const results = [...state.results];
      results[state.index] = 'bad';
      return { ...state, results, phase: 'wrong', took: CHART_DETECTIVE.seconds };
    }
    case 'next':
      if (state.phase !== 'solved' && state.phase !== 'wrong') return state;
      if (state.index + 1 >= CHART_DETECTIVE.total) return { ...state, phase: 'finished' };
      return {
        ...state,
        index: state.index + 1,
        pick: null,
        reason: null,
        phase: 'playing',
        took: null,
        seconds: null,
        frozen: false,
      };
    case 'restart':
      return fresh(state.runKey + 1);
    default:
      return state;
  }
};

const ChartDetective = ({ frame }) => {
  const [state, dispatch] = useReducer(reducer, frame, fromFrame);
  const [resultOpen, setResultOpen] = useState(true);
  const [zoom, setZoom] = useState(false);
  const c = CHART_CASES[state.index];
  const finished = state.phase === 'finished';
  const answered = state.phase === 'solved' || state.phase === 'wrong';
  const solved = state.results.filter((r) => r === 'ok').length;
  const wrong = state.results.filter((r) => r === 'bad').length;
  const passed = solved >= CHART_DETECTIVE.passMark;
  const left = useCountdown({
    start: state.seconds ?? CHART_DETECTIVE.seconds,
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
      skill: CHART_DETECTIVE.skill,
      gameName: CHART_DETECTIVE.label,
      verb: 'solved',
      noun: 'cases',
      statLabel: 'CASES SOLVED',
      correct: solved,
      total: CHART_DETECTIVE.total,
      passMark: `${CHART_DETECTIVE.passMark} of ${CHART_DETECTIVE.total}`,
      passed,
      earned: solved * CHART_DETECTIVE.caseXp + (passed ? CHART_DETECTIVE.passBonusXp : 0),
      dots: state.results.map((r) => (r === 'ok' ? 'ok' : 'bad')),
      topics: topicRowsFor(CHART_CASES, state.results, 'Case'),
    });
  }, [finished, solved, passed, state.results]);

  const resolved = state.results.filter(Boolean).length;
  const dots = Array.from({ length: CHART_DETECTIVE.total }, (_, i) => {
    if (state.results[i]) return { state: state.results[i], label: String(i + 1) };
    if (!finished && i === resolved) return { state: 'now', label: String(i + 1) };
    return { state: 'todo', label: String(i + 1) };
  });
  const isLast = state.index + 1 >= CHART_DETECTIVE.total;
  const footer = answered
    ? {
        primary: {
          label: isLast ? 'See results' : 'Next case',
          onClick: () => dispatch({ type: 'next' }),
        },
      }
    : {
        link: { label: 'Zoom in', onClick: () => setZoom((z) => !z) },
        primary: {
          label: 'Solve the case',
          disabled: state.reason === null,
          onClick: () => dispatch({ type: 'solve', left }),
        },
      };

  return (
    <GameFrame
      game={{
        title: CHART_DETECTIVE.title,
        label: CHART_DETECTIVE.label,
        subtitle: CHART_DETECTIVE.subtitle,
        sticker: `CASE ${Math.min(state.index + 1, CHART_DETECTIVE.total)} OF ${CHART_DETECTIVE.total}`,
      }}
      xp={CHART_DETECTIVE.baseXp}
      streakDays={CHART_DETECTIVE.streakDays}
      progress={{
        countLabel: finished
          ? 'All cases done'
          : `Case ${state.index + 1} of ${CHART_DETECTIVE.total}`,
        summary: `${solved} solved · ${wrong} wrong`,
        dots,
        passMark: `Pass mark: ${CHART_DETECTIVE.passMark} of ${CHART_DETECTIVE.total}`,
      }}
      footer={footer}
      result={result}
      resultOpen={resultOpen}
      onResultsClose={() => setResultOpen(false)}
      onReopenResults={() => setResultOpen(true)}
      current={state.index + 1}
      total={CHART_DETECTIVE.total}
      correct={solved}
      onRestart={() => {
        dispatch({ type: 'restart' });
        setResultOpen(true);
      }}
    >
      <div className="flex flex-col gap-[22px]">
        <GameHead
          eyebrow={`CASE ${state.index + 1} · DATA ANALYSIS`}
          title={[
            ['Same data, two charts. Which one is ', false],
            ['lying?', true],
          ]}
          prompt={c.prompt}
          stats={[
            { Icon: GameClockIcon, label: `${formatClock(left)} left` },
            { Icon: GameBoltIcon, label: `Bonus under ${CHART_DETECTIVE.bonusUnder}s` },
          ]}
          checks={CHART_DETECTIVE.checks}
        />
        <div
          role="radiogroup"
          aria-label="Which chart is lying"
          className={classNames(
            'grid gap-[20px]',
            zoom ? 'grid-cols-1' : 'grid-cols-2 max-md:grid-cols-1'
          )}
        >
          {['A', 'B'].map((letter) => (
            <ChartCard
              key={letter}
              letter={letter}
              title={c.title}
              chart={c[letter]}
              months={CHART_DETECTIVE.months}
              selected={state.pick === letter}
              locked={answered}
              onPick={() => dispatch({ type: 'pick', letter })}
            />
          ))}
        </div>
        {state.pick && !answered ? (
          <>
            <SectionLabel>{`WHY IS CHART ${state.pick} MISLEADING?`}</SectionLabel>
            <div role="radiogroup" aria-label="Reason" className="flex flex-wrap gap-[10px]">
              {CHART_DETECTIVE.reasons.map((label, i) => (
                <Reason
                  key={label}
                  label={label}
                  selected={state.reason === i}
                  onPick={() => dispatch({ type: 'reason', index: i })}
                />
              ))}
            </div>
          </>
        ) : null}
        {answered ? (
          <GameFeedback
            ok={state.phase === 'solved'}
            title={
              state.phase === 'solved'
                ? `Case solved in ${state.took} seconds!`
                : `Not quite. Chart ${c.lying} was lying.`
            }
            body={c.explain}
            pills={[`+${CHART_DETECTIVE.caseXp} XP`]}
          />
        ) : null}
      </div>
    </GameFrame>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES = { 'chart-detective': ChartDetective };
export default ChartDetective;
