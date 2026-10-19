import { useEffect, useMemo, useReducer, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { FOCUS_RING } from '../labPlayStyles.js';
import { GameDragDropIcon, GamePhoneIcon, GameUsersIcon } from '../skillGames/GameIcons.jsx';
import {
  Gen,
  GameFeedback,
  GameFrame,
  GameHead,
  GameTip,
  SectionLabel,
} from '../skillGames/gameKit.jsx';
import {
  DASH_BORDER,
  HAIR,
  INK,
  SEL_BORDER,
  SEL_SHADOW,
  buildGameResult,
  formatClock,
  useCountdown,
} from '../skillGames/gameKitUtils.js';
import { ALARMS, CRISIS_FRAMES, CRISIS_ROOM } from '../skillGames/crisisRoomData.js';
import { OPTION_LETTERS } from '../labFormat.js';

const log = debug('CrisisRoom');

/*
 * Crisis Room (`/skills-lab/games/crisis-room`) — Figma SL-GS09 "Alarm 2" (Playful 7943:8272 / Focused 8110:496433).
 * ?f=GS09 boots it. Loop: put the people in the order you would call them (drag a card, or focus it and press ↑ / ↓; the top
 * ones get numbered, the rest stay dashed) → pick your first message (A–C) → "Make the calls" → feedback → "Next alarm" …
 * alarm 4 → results (pass 3 of 4). 5:00 per alarm. Data + assumptions: crisisRoomData.js.
 */

const calmWord = (left) => (left > 120 ? 'holding' : left > 30 ? 'wobbling' : 'rattled');

const Person = (props) => {
  const { person, position, numbered, locked, onDragStart, onDropOn, onMove, onSwap, picked } =
    props;
  const n = position + 1;
  return (
    <li
      draggable={!locked}
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDropOn();
      }}
      className={classNames(
        'flex items-center gap-[12px] rounded-[16px] px-[14px] py-[12px]',
        numbered ? classNames('bg-white', HAIR) : classNames('bg-[#f8f8f4]', DASH_BORDER),
        picked && 'outline-2 outline-offset-2 outline-[#387440]'
      )}
    >
      <button
        type="button"
        disabled={locked}
        onClick={onSwap}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            onMove(-1);
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            onMove(1);
          }
        }}
        aria-label={`${person.name}, ${person.role}. ${numbered ? `Call number ${n}` : 'Not in the call list'}. Press the arrow keys to move, or press Enter then pick another person to swap.`}
        className={classNames(
          'flex min-w-0 flex-1 cursor-grab items-center gap-[12px] text-left',
          FOCUS_RING
        )}
      >
        <GameDragDropIcon className="size-[16px] shrink-0 text-[#595959]" />
        <span
          aria-hidden="true"
          data-count={numbered ? String(n) : '–'}
          className={classNames(
            'inline-flex size-[26px] shrink-0 items-center justify-center rounded-full font-sans text-[12px] leading-[14px] font-bold after:content-[attr(data-count)]',
            INK,
            numbered ? 'bg-[#387440] text-white' : 'bg-white text-[#1c2a21]'
          )}
        />
        <span
          aria-hidden="true"
          className="inline-flex size-[34px] shrink-0 items-center justify-center rounded-full font-sans text-[14px] after:content-[attr(data-count)] leading-[17px] font-bold text-white"
          data-count={person.initial}
          style={{ backgroundColor: person.color }}
        />
        <span className="flex min-w-0 flex-col">
          <Gen
            text={person.name}
            className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]"
          />
          <Gen
            text={person.role}
            className="font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[12px]"
          />
        </span>
      </button>
      <GamePhoneIcon className="size-[18px] shrink-0 text-[#1c2a21]" />
    </li>
  );
};

const Message = ({ letter, text, selected, locked, onPick }) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    aria-label={`${letter}: ${text}`}
    disabled={locked}
    onClick={onPick}
    className={classNames(
      'flex w-full items-start gap-[12px] rounded-[16px] px-[16px] py-[14px] text-left',
      selected ? classNames('bg-[#ebf1ec]', SEL_BORDER, SEL_SHADOW) : classNames('bg-white', HAIR),
      locked ? 'cursor-default' : 'cursor-pointer',
      FOCUS_RING
    )}
  >
    <span
      aria-hidden="true"
      data-count={letter}
      className={classNames(
        'mt-px inline-flex h-[20px] min-w-[25px] shrink-0 items-center justify-center rounded-[8px] px-[8px] font-sans text-[12px] leading-[14px] font-bold after:content-[attr(data-count)]',
        selected ? 'bg-[#387440] text-white' : 'bg-[#f8f8f4] text-[#1c2a21]'
      )}
    />
    <span className="min-w-0 flex-1 font-sans text-[14.5px] leading-[21px] font-medium text-[#1c2a21]">
      {text}
    </span>
  </button>
);

const initialOrder = (alarm) => alarm.people.map((p) => p.id);

const fresh = (runKey = 0) => ({
  alarm: 0,
  results: [],
  order: initialOrder(ALARMS[0]),
  message: null,
  advice: false,
  swapFrom: null,
  seconds: null,
  frozen: false,
  phase: 'playing',
  correct: null,
  runKey,
});
const fromFrame = (code) => {
  const seed = code ? CRISIS_FRAMES[code] : null;
  return seed ? { ...fresh(), ...seed, frozen: true } : fresh();
};

const move = (list, from, to) => {
  if (to < 0 || to >= list.length || from === to) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'move':
      return state.phase === 'playing'
        ? {
            ...state,
            order: move(state.order, action.from, action.to),
            frozen: false,
            swapFrom: null,
          }
        : state;
    case 'swap': {
      if (state.phase !== 'playing') return state;
      if (state.swapFrom === null) return { ...state, swapFrom: action.index };
      const next = [...state.order];
      [next[state.swapFrom], next[action.index]] = [next[action.index], next[state.swapFrom]];
      return { ...state, order: next, swapFrom: null, frozen: false };
    }
    case 'message':
      return state.phase === 'playing' ? { ...state, message: action.index, frozen: false } : state;
    case 'advice':
      return state.phase === 'playing' ? { ...state, advice: true } : state;
    case 'call':
    case 'timeout': {
      if (state.phase !== 'playing') return state;
      const alarm = ALARMS[state.alarm];
      const orderOk = action.type === 'call' && alarm.order.every((id, i) => state.order[i] === id);
      const msgOk = action.type === 'call' && state.message === alarm.answer;
      const results = [...state.results];
      results[state.alarm] = { order: orderOk, msg: msgOk };
      return {
        ...state,
        results,
        phase: 'feedback',
        correct: orderOk && msgOk,
        timedOut: action.type === 'timeout',
      };
    }
    case 'next': {
      if (state.phase !== 'feedback') return state;
      if (state.alarm + 1 >= CRISIS_ROOM.total) return { ...state, phase: 'finished' };
      const next = state.alarm + 1;
      return {
        ...state,
        alarm: next,
        order: initialOrder(ALARMS[next]),
        message: null,
        advice: false,
        swapFrom: null,
        seconds: null,
        frozen: false,
        phase: 'playing',
        correct: null,
        timedOut: false,
      };
    }
    case 'restart':
      return fresh(state.runKey + 1);
    default:
      return state;
  }
};

const CrisisRoom = ({ frame }) => {
  const [state, dispatch] = useReducer(reducer, frame, fromFrame);
  const [resultOpen, setResultOpen] = useState(true);
  const [dragFrom, setDragFrom] = useState(null);
  const alarm = ALARMS[state.alarm];
  const byId = Object.fromEntries(alarm.people.map((p) => [p.id, p]));
  const finished = state.phase === 'finished';
  const feedback = state.phase === 'feedback';
  const handled = state.results.filter((r) => r && r.order && r.msg).length;
  const passed = handled >= CRISIS_ROOM.passMark;
  const left = useCountdown({
    start: state.seconds ?? CRISIS_ROOM.seconds,
    running: state.phase === 'playing' && !state.frozen,
    resetKey: `${state.alarm}:${state.runKey}`,
    onZero: () => dispatch({ type: 'timeout' }),
  });

  useEffect(() => {
    log('mount', { frame });
  }, [frame]);

  const result = useMemo(() => {
    if (!finished) return null;
    const row = (label, key) => {
      const nums = state.results.map((r, i) => (r && r[key] ? null : i + 1)).filter(Boolean);
      const okNums = state.results.map((r, i) => (r && r[key] ? i + 1 : null)).filter(Boolean);
      return {
        label,
        strong: nums.length === 0,
        qs: `Alarm${(nums.length ? nums : okNums).length > 1 ? 's' : ''} ${(nums.length ? nums : okNums).join(', ')}`,
      };
    };
    const topics = [row('Prioritising people', 'order'), row('Calm communication', 'msg')];
    return buildGameResult({
      skill: CRISIS_ROOM.skill,
      gameName: CRISIS_ROOM.label,
      verb: 'handled',
      noun: 'alarms',
      statLabel: 'ALARMS HANDLED',
      correct: handled,
      total: CRISIS_ROOM.total,
      passMark: `${CRISIS_ROOM.passMark} of ${CRISIS_ROOM.total}`,
      passed,
      earned: handled * CRISIS_ROOM.alarmXp + (passed ? CRISIS_ROOM.passBonusXp : 0),
      dots: state.results.map((r) => (r && r.order && r.msg ? 'ok' : 'bad')),
      topics: [...topics.filter((t) => t.strong), ...topics.filter((t) => !t.strong)],
    });
  }, [finished, handled, passed, state.results]);

  const dots = Array.from({ length: CRISIS_ROOM.total }, (_, i) => {
    const r = state.results[i];
    if (r) return { state: r.order && r.msg ? 'ok' : 'bad', label: String(i + 1) };
    if (!finished && i === state.results.filter(Boolean).length)
      return { state: 'now', label: String(i + 1) };
    return { state: 'todo', label: String(i + 1) };
  });
  const prev = state.results[state.alarm - 1];
  const isLast = state.alarm + 1 >= CRISIS_ROOM.total;
  const footer = feedback
    ? {
        primary: {
          label: isLast ? 'See results' : 'Next alarm',
          onClick: () => dispatch({ type: 'next' }),
        },
      }
    : {
        link: {
          label: 'Ask for advice',
          onClick: () => dispatch({ type: 'advice' }),
          disabled: state.advice,
        },
        primary: {
          label: 'Make the calls',
          onClick: () => dispatch({ type: 'call' }),
          disabled: state.message === null,
        },
      };

  return (
    <GameFrame
      game={{
        title: CRISIS_ROOM.title,
        label: CRISIS_ROOM.label,
        subtitle: CRISIS_ROOM.subtitle,
        sticker: `ALARM ${Math.min(state.alarm + 1, CRISIS_ROOM.total)} OF ${CRISIS_ROOM.total}`,
      }}
      xp={CRISIS_ROOM.baseXp}
      streakDays={CRISIS_ROOM.streakDays}
      progress={{
        countLabel: finished
          ? 'All alarms done'
          : `Alarm ${state.alarm + 1} of ${CRISIS_ROOM.total}`,
        summary: prev
          ? `Alarm ${state.alarm} ${prev.order && prev.msg ? 'handled well' : 'handled badly'}`
          : 'No alarm handled yet',
        dots,
        passMark: `Pass mark: ${CRISIS_ROOM.passMark} of ${CRISIS_ROOM.total}`,
      }}
      footer={footer}
      result={result}
      resultOpen={resultOpen}
      onResultsClose={() => setResultOpen(false)}
      onReopenResults={() => setResultOpen(true)}
      current={state.alarm + 1}
      total={CRISIS_ROOM.total}
      correct={handled}
      onRestart={() => {
        dispatch({ type: 'restart' });
        setResultOpen(true);
      }}
    >
      <div className="flex flex-col gap-[22px]">
        <GameHead
          eyebrow={`ALARM ${state.alarm + 1} · TEAM LEADERSHIP`}
          title={alarm.title}
          prompt={alarm.prompt}
          stats={[
            { Icon: GamePhoneIcon, label: `${formatClock(left)} to CEO call` },
            { Icon: GameUsersIcon, label: `Team calm: ${calmWord(left)}` },
          ]}
          checks={CRISIS_ROOM.checks}
        />
        <div className="grid gap-[20px] lg:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-[20px]">
            <SectionLabel>WHO DO YOU CALL FIRST? DRAG TO ORDER</SectionLabel>
            <ul className="m-0 flex list-none flex-col gap-[20px] p-0" aria-label="Call order">
              {state.order.map((id, i) => (
                <Person
                  key={id}
                  person={byId[id]}
                  position={i}
                  numbered={i < alarm.calls}
                  locked={feedback}
                  picked={state.swapFrom === i}
                  onDragStart={(e) => {
                    setDragFrom(i);
                    e.dataTransfer.setData('text/plain', String(i));
                  }}
                  onDropOn={() => {
                    if (dragFrom !== null) dispatch({ type: 'move', from: dragFrom, to: i });
                    setDragFrom(null);
                  }}
                  onMove={(delta) => dispatch({ type: 'move', from: i, to: i + delta })}
                  onSwap={() => dispatch({ type: 'swap', index: i })}
                />
              ))}
            </ul>
          </div>
          <div className="flex min-w-0 flex-col gap-[20px]">
            <SectionLabel>YOUR FIRST MESSAGE TO THE TEAM</SectionLabel>
            <div role="radiogroup" aria-label="First message" className="flex flex-col gap-[20px]">
              {alarm.messages.map((text, i) => (
                <Message
                  key={text}
                  letter={OPTION_LETTERS[i]}
                  text={text}
                  selected={state.message === i}
                  locked={feedback}
                  onPick={() => dispatch({ type: 'message', index: i })}
                />
              ))}
            </div>
          </div>
        </div>
        {state.advice && !feedback ? <GameTip>{alarm.advice}</GameTip> : null}
        {feedback ? (
          <GameFeedback
            ok={Boolean(state.correct)}
            title={
              state.timedOut
                ? 'The CEO called first.'
                : state.correct
                  ? 'Calm and clear.'
                  : 'That order cost you.'
            }
            body={alarm.explain}
            pills={[`+${CRISIS_ROOM.alarmXp} XP`]}
          />
        ) : null}
      </div>
    </GameFrame>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES = { 'crisis-room': CrisisRoom };
export default CrisisRoom;
