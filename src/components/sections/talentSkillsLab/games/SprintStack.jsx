import { useEffect, useMemo, useReducer, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { FOCUS_RING } from '../labPlayStyles.js';
import { GameLinkIcon, GameSpeedmeterIcon, GameUsersIcon } from '../skillGames/GameIcons.jsx';
import { Gen, GameFeedback, GameFrame, GameHead } from '../skillGames/gameKit.jsx';
import { DASH_BORDER, HAIR, buildGameResult } from '../skillGames/gameKitUtils.js';
import { SPRINTS, SPRINT_FRAMES, SPRINT_STACK } from '../skillGames/sprintStackData.js';

const log = debug('SprintStack');

/*
 * Sprint Stack (`/skills-lab/games/sprint-stack`) — Figma SL-GS07 "Sprint 2" (Playful 7943:7856 / Focused 8110:496231).
 * ?f=GS07 boots it. Loop: click (or drag) a backlog task into the sprint — it must fit the 20-point capacity — click a
 * sprint task to send it back → "Start sprint" gives the verdict (shipped = nothing blocked + every must-do task in) →
 * "Next sprint" … sprint 3 → results (ship 2 of 3). "Clear sprint" empties the sprint. Data + assumptions: sprintStackData.js.
 */

const CHIP = {
  plain: 'bg-white text-[#1c2a21]',
  red: 'bg-[#f9ebea] text-[#902b20]',
  amber: 'bg-[#faf4e8] text-[#463409]',
};

const Chip = ({ tone = 'plain', icon, children }) => (
  <span
    className={classNames(
      'inline-flex items-center gap-[6px] rounded-full px-[10px] py-[5px] font-sans text-[11.5px] leading-[14px] font-semibold max-lg:text-[12px]',
      CHIP[tone]
    )}
  >
    {icon}
    <Gen text={children} />
  </span>
);

const Task = (props) => {
  const { task, tasksById, onClick, draggable, onDragStart, blockedNow, label } = props;
  const dim = task.nice;
  return (
    <button
      type="button"
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      aria-label={label}
      className={classNames(
        'flex w-full cursor-pointer flex-col gap-[8px] rounded-[16px] bg-white px-[16px] py-[14px] text-left',
        dim ? classNames(DASH_BORDER, 'opacity-35') : HAIR,
        FOCUS_RING
      )}
    >
      <span className="flex items-center gap-[8px]">
        <Gen
          text={task.name}
          className="min-w-0 flex-1 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]"
        />
        <span
          aria-hidden="true"
          data-count={`${task.pts} pts`}
          className="inline-flex shrink-0 items-center rounded-full bg-[#1c2a21] px-[8px] py-[3px] font-sans text-[12px] leading-[14px] font-bold text-[#c1d4c4] after:content-[attr(data-count)]"
        />
      </span>
      {task.tags.length || task.needs ? (
        <span className="flex flex-wrap gap-[6px]">
          {task.needs ? (
            <Chip
              tone={task.blockedTone ? 'red' : 'plain'}
              icon={<GameLinkIcon className="size-[12px] shrink-0" />}
            >
              {task.needsLabel}
            </Chip>
          ) : null}
          {task.tags.map((tag) => (
            <Chip key={tag.label} tone={tag.tone}>
              {tag.label}
            </Chip>
          ))}
        </span>
      ) : null}
      {blockedNow ? (
        <span className="sr-only">{`Blocked: ${tasksById[task.needs].name} is not in the sprint`}</span>
      ) : null}
    </button>
  );
};

const fresh = (runKey = 0) => ({
  sprint: 0,
  results: [],
  reasons: [],
  inSprint: SPRINTS[0].start,
  backlogLabel: null,
  verdict: null,
  nudge: null,
  phase: 'playing',
  runKey,
});

const fromFrame = (code) => {
  const seed = code ? SPRINT_FRAMES[code] : null;
  return seed
    ? {
        ...fresh(),
        ...seed,
        reasons: seed.results.map(() => ({ ok: true, unmet: [], missing: [] })),
      }
    : fresh();
};

const used = (sprint, ids) =>
  ids.reduce((sum, id) => sum + sprint.tasks.find((t) => t.id === id).pts, 0);

const judge = (sprint, ids) => {
  const unmet = ids.filter((id) => {
    const need = sprint.tasks.find((t) => t.id === id).needs;
    return need && !ids.includes(need);
  });
  const missing = sprint.tasks.filter((t) => t.must && !ids.includes(t.id));
  return { unmet, missing, ok: unmet.length === 0 && missing.length === 0 };
};

const reducer = (state, action) => {
  const sprint = SPRINTS[state.sprint];
  switch (action.type) {
    case 'add': {
      if (state.phase !== 'playing' || state.inSprint.includes(action.id)) return state;
      const task = sprint.tasks.find((t) => t.id === action.id);
      if (used(sprint, state.inSprint) + task.pts > SPRINT_STACK.capacity)
        return { ...state, nudge: 'full', backlogLabel: null };
      return {
        ...state,
        inSprint: [...state.inSprint, action.id],
        nudge: null,
        backlogLabel: null,
      };
    }
    case 'remove':
      if (state.phase !== 'playing') return state;
      return {
        ...state,
        inSprint: state.inSprint.filter((id) => id !== action.id),
        nudge: null,
        backlogLabel: null,
      };
    case 'clear':
      return state.phase === 'playing'
        ? { ...state, inSprint: [], nudge: null, backlogLabel: null }
        : state;
    case 'start': {
      if (state.phase !== 'playing') return state;
      const verdict = judge(sprint, state.inSprint);
      const results = [...state.results];
      results[state.sprint] = verdict.ok ? 'ok' : 'bad';
      const reasons = [...state.reasons];
      reasons[state.sprint] = verdict;
      return { ...state, results, reasons, verdict, phase: 'verdict' };
    }
    case 'next': {
      if (state.phase !== 'verdict') return state;
      if (state.sprint + 1 >= SPRINT_STACK.total) return { ...state, phase: 'finished' };
      const next = state.sprint + 1;
      return {
        ...state,
        sprint: next,
        inSprint: SPRINTS[next].start,
        verdict: null,
        nudge: null,
        phase: 'playing',
      };
    }
    case 'restart':
      return fresh(state.runKey + 1);
    default:
      return state;
  }
};

const SprintStack = ({ frame }) => {
  const [state, dispatch] = useReducer(reducer, frame, fromFrame);
  const [resultOpen, setResultOpen] = useState(true);
  const sprint = SPRINTS[state.sprint];
  const tasksById = Object.fromEntries(sprint.tasks.map((t) => [t.id, t]));
  const finished = state.phase === 'finished';
  const verdictPhase = state.phase === 'verdict';
  const points = used(sprint, state.inSprint);
  const left = SPRINT_STACK.capacity - points;
  const shipped = state.results.filter((r) => r === 'ok').length;
  const passed = shipped >= SPRINT_STACK.passMark;
  const backlog = sprint.tasks.filter((t) => !state.inSprint.includes(t.id));

  useEffect(() => {
    log('mount', { frame });
  }, [frame]);

  const result = useMemo(() => {
    if (!finished) return null;
    const verdicts = state.reasons;
    const topic = (label, strong) => ({ label, strong });
    const noDeps = verdicts.every((v) => v.ok || !v.unmet?.length);
    const noMiss = verdicts.every((v) => v.ok || !v.missing?.length);
    const list = (fn) => verdicts.map((v, i) => (fn(v) ? i + 1 : null)).filter(Boolean);
    const sprintsWord = (ids) => `Sprint${ids.length > 1 ? 's' : ''} ${ids.join(', ')}`;
    const topics = [
      { ...topic('Estimation', true), qs: 'Every sprint' },
      {
        ...topic('Dependencies', noDeps),
        qs: sprintsWord(
          list((v) => v.unmet?.length).length ? list((v) => v.unmet?.length) : [1, 2, 3]
        ),
      },
      {
        ...topic('Priorities', noMiss),
        qs: sprintsWord(
          list((v) => v.missing?.length).length ? list((v) => v.missing?.length) : [1, 2, 3]
        ),
      },
    ];
    return buildGameResult({
      skill: SPRINT_STACK.skill,
      gameName: SPRINT_STACK.label,
      verb: 'shipped',
      noun: 'sprints',
      statLabel: 'SPRINTS SHIPPED',
      correct: shipped,
      total: SPRINT_STACK.total,
      passMark: `${SPRINT_STACK.passMark} of ${SPRINT_STACK.total}`,
      passed,
      earned: shipped * SPRINT_STACK.sprintXp + (passed ? SPRINT_STACK.passBonusXp : 0),
      dots: state.results.map((r) => (r === 'ok' ? 'ok' : 'bad')),
      topics: [...topics.filter((t) => t.strong), ...topics.filter((t) => !t.strong)],
    });
  }, [finished, shipped, passed, state.results, state.reasons]);

  const dots = Array.from({ length: SPRINT_STACK.total }, (_, i) => {
    if (state.results[i]) return { state: state.results[i], label: String(i + 1) };
    if (!finished && i === state.results.length) return { state: 'now', label: String(i + 1) };
    return { state: 'todo', label: String(i + 1) };
  });

  const isLast = state.sprint + 1 >= SPRINT_STACK.total;
  const footer = verdictPhase
    ? {
        primary: {
          label: isLast ? 'See results' : 'Next sprint',
          onClick: () => dispatch({ type: 'next' }),
        },
      }
    : {
        link: { label: 'Clear sprint', onClick: () => dispatch({ type: 'clear' }) },
        primary: {
          label: 'Start sprint',
          disabled: state.inSprint.length === 0,
          onClick: () => dispatch({ type: 'start' }),
        },
      };

  const prev = state.results[state.sprint - 1];
  const verdictCopy = () => {
    const v = state.verdict;
    if (v.ok)
      return {
        ok: true,
        title: 'Sprint shipped on time!',
        body: 'Every must-do task is in and nothing is blocked.',
      };
    const bits = [];
    if (v.unmet.length)
      bits.push(`${tasksById[v.unmet[0]].name} needs a task that is not in the sprint`);
    if (v.missing.length) bits.push(`${v.missing[0].name} was a must-do and got left out`);
    return { ok: false, title: 'Sprint slipped.', body: `${bits.join('. ')}.` };
  };

  return (
    <GameFrame
      game={{
        title: SPRINT_STACK.title,
        label: SPRINT_STACK.label,
        subtitle: SPRINT_STACK.subtitle,
        sticker: `${points} / ${SPRINT_STACK.capacity} PTS`,
      }}
      xp={SPRINT_STACK.baseXp}
      streakDays={SPRINT_STACK.streakDays}
      progress={{
        countLabel: finished
          ? 'All sprints done'
          : `Sprint ${state.sprint + 1} of ${SPRINT_STACK.total}`,
        summary: prev
          ? `Sprint ${state.sprint} ${prev === 'ok' ? 'shipped on time' : 'slipped'}`
          : 'No sprint shipped yet',
        dots,
        passMark: `Pass mark: ${SPRINT_STACK.passMark} of ${SPRINT_STACK.total} sprints`,
      }}
      footer={footer}
      result={result}
      resultOpen={resultOpen}
      onResultsClose={() => setResultOpen(false)}
      onReopenResults={() => setResultOpen(true)}
      current={state.sprint + 1}
      total={SPRINT_STACK.total}
      correct={shipped}
      onRestart={() => {
        dispatch({ type: 'restart' });
        setResultOpen(true);
      }}
    >
      <div className="flex flex-col gap-[22px]">
        <GameHead
          eyebrow={`SPRINT ${state.sprint + 1} · ENGINEERING PLANNING`}
          title={[
            ['Fill the sprint without ', false],
            ['breaking anything.', true],
          ]}
          prompt={sprint.blurb}
          stats={[
            { Icon: GameSpeedmeterIcon, label: `${points} of ${SPRINT_STACK.capacity} pts` },
            { Icon: GameUsersIcon, label: `Squad of ${SPRINT_STACK.squad}` },
          ]}
          checks={SPRINT_STACK.checks}
        />
        <div className="grid items-start gap-[24px] lg:grid-cols-2">
          <section
            aria-label="Backlog"
            className={classNames(
              'flex min-w-0 flex-col gap-[12px] rounded-[22px] bg-[#f8f8f4] p-[18px]',
              HAIR
            )}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const id = e.dataTransfer.getData('text/plain');
              if (state.inSprint.includes(id)) dispatch({ type: 'remove', id });
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="m-0 font-sans text-[20px] leading-[25px] font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading">
                Backlog
              </h3>
              <span
                aria-hidden="true"
                data-count={state.backlogLabel ?? `${backlog.length} tasks`}
                className="rounded-full bg-white px-[12px] py-[3px] font-sans text-[12px] leading-[14px] font-semibold text-[#1c2a21] after:content-[attr(data-count)]"
              />
            </div>
            {backlog.map((task) => (
              <Task
                key={task.id}
                task={task}
                tasksById={tasksById}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
                onClick={() => dispatch({ type: 'add', id: task.id })}
                label={`${task.name}, ${task.pts} points. Add to sprint`}
              />
            ))}
          </section>
          <section
            aria-label={sprint.name}
            className={classNames(
              'flex min-w-0 flex-col gap-[12px] rounded-[22px] bg-[#ebf1ec] p-[18px]',
              HAIR
            )}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => dispatch({ type: 'add', id: e.dataTransfer.getData('text/plain') })}
          >
            <div className="flex items-center justify-between">
              <h3 className="m-0 font-sans text-[20px] leading-[25px] font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading">
                {sprint.name}
              </h3>
              <span
                aria-hidden="true"
                data-count={`${points} of ${SPRINT_STACK.capacity} pts`}
                className="rounded-full bg-white px-[12px] py-[3px] font-sans text-[12px] leading-[14px] font-semibold text-[#1c2a21] after:content-[attr(data-count)]"
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center justify-between font-sans">
                <span className="text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                  Capacity
                </span>
                <span
                  aria-hidden="true"
                  data-count={`${points} / ${SPRINT_STACK.capacity} pts`}
                  className="text-[13px] leading-[16px] font-semibold text-[#595959] after:content-[attr(data-count)]"
                />
              </div>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={SPRINT_STACK.capacity}
                aria-valuenow={points}
                aria-label="Sprint capacity"
                className="h-[14px] overflow-hidden rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#ebebe3] playful:border-[1.2px] playful:border-[#1c2a21]"
              >
                <div
                  className="h-full rounded-full bg-[#387440]"
                  style={{ width: `${(points / SPRINT_STACK.capacity) * 100}%` }}
                />
              </div>
            </div>
            {state.inSprint.map((id) => (
              <Task
                key={id}
                task={tasksById[id]}
                tasksById={tasksById}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', id)}
                onClick={() => dispatch({ type: 'remove', id })}
                label={`${tasksById[id].name}, ${tasksById[id].pts} points. Send back to the backlog`}
                blockedNow={
                  Boolean(tasksById[id].needs) && !state.inSprint.includes(tasksById[id].needs)
                }
              />
            ))}
            <div
              className={classNames(
                'flex min-h-[56px] items-center justify-center rounded-[16px] bg-white px-[18px] py-[18px] font-sans text-[14px] leading-[17px] font-semibold',
                DASH_BORDER,
                'border-[rgba(28,42,33,0.1)] playful:border-[rgba(28,42,33,0.4)]',
                state.nudge === 'full' ? 'text-[#902b20]' : 'text-[#595959]'
              )}
            >
              {state.nudge === 'full'
                ? `Not enough room · ${left} pts left`
                : `Drop here · ${left} pts left`}
            </div>
          </section>
        </div>
        {verdictPhase && state.verdict ? (
          <GameFeedback {...verdictCopy()} pills={[`+${SPRINT_STACK.sprintXp} XP`]} />
        ) : null}
      </div>
    </GameFrame>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES = { 'sprint-stack': SprintStack };
export default SprintStack;
