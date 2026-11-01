import { useCallback, useEffect, useMemo, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import GameV2Shell from '../GameV2Shell.jsx';
import { useGameClock, formatClock } from '../useGameClock.js';
import { useGameV2Params } from '../gamesV2State.js';
import GameV2FeedbackChip from '../planningShared/GameV2FeedbackChip.jsx';
import GameV2Head from '../planningShared/GameV2Head.jsx';
import {
  GameCheckCircleIcon,
  GameClockIcon,
  GameRepeatIcon,
  GameTargetIcon,
} from '../planningShared/PlanningChessIcons.jsx';
import TowerBoard from '../towerShift/TowerBoard.jsx';
import {
  TOWER_BEST_SO_FAR,
  TOWER_COPY,
  TOWER_GOAL_PEG,
  TOWER_LEVELS,
  TOWER_MEASURES,
  TOWER_SEEDS,
  towerScore,
  towerSolvedLead,
  towerSolvedMessage,
} from '../towerShift/towerShiftData.js';
import {
  towerCanDrop,
  towerDrop,
  towerFreshState,
  towerIsSolved,
  towerLift,
  towerMoveCursor,
  towerOptimalMoves,
  towerTap,
} from '../towerShift/towerShiftEngine.js';

const log = debug('TowerShift');

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2_META = {
  'tower-shift': {
    name: 'Tower Shift',
    subtitleLead: 'Planning · 4 discs',
    resultProgress: {
      countLabel: 'Tower moved',
      summary: 'Fewest possible: 15',
      dots: [],
      passMark: `Best so far: ${TOWER_BEST_SO_FAR}`,
    },
  },
};

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

const MoveChip = ({ icon, className, children }) => {
  const Glyph = icon;
  return (
    <span
      className={`inline-flex min-h-[24px] items-center gap-[5px] rounded-full px-[10px] py-[4px] font-sans text-[12px] leading-[14px] font-semibold ${className}`}
    >
      <Glyph className="size-[13px] shrink-0" />
      {children}
    </span>
  );
};

const TowerShift = ({ frame }) => {
  const g = useGameV2Params();
  const { discs, seconds: limit } = TOWER_LEVELS[g.level] ?? TOWER_LEVELS.intermediate;
  const seed = frame ? TOWER_SEEDS[frame] : null;
  const n = seed ? 4 : discs;
  const optimal = towerOptimalMoves(n);
  const [state, setState] = useState(() => (seed ? { ...seed } : towerFreshState(n)));
  const solved = towerIsSolved(state.stacks, n);
  const paused = Boolean(g.modal) || solved;

  const clock = useGameClock({
    start: seed ? seed.seconds : limit,
    direction: 'down',
    running: !paused && !seed,
    onEnd: () => {
      log('time is up → modal');
      g.openModal('timeup');
    },
  });
  const timedOut = clock.ended;
  const total = seed ? limit - seed.seconds : limit - clock.seconds;

  useEffect(() => {
    log('mount', { level: g.level, discs: n, optimal, limit, frame, ranked: g.ranked });
  }, [g.level, g.ranked, n, optimal, limit, frame]);

  const locked = paused || timedOut;
  const act = useCallback(
    (name, fn) => {
      if (locked) return;
      setState((prev) => {
        const next = fn(prev);
        log(name, {
          moves: next.moves,
          illegal: next.illegal,
          lifted: next.lifted?.disc ?? null,
          cursor: next.cursor,
          blocked: next.blocked,
        });
        return next;
      });
    },
    [locked]
  );

  const onTap = useCallback((peg) => act(`tap ${peg}`, (s) => towerTap(s, peg)), [act]);

  useEffect(() => {
    const onKey = (e) => {
      if (locked || e.altKey || e.ctrlKey || e.metaKey) return;
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowLeft') act('key ←', (s) => towerMoveCursor(s, -1));
      else if (e.key === 'ArrowRight') act('key →', (s) => towerMoveCursor(s, 1));
      else if (e.key === 'ArrowUp') act('key ↑ lift', (s) => towerLift(s, s.cursor));
      else if (e.key === 'ArrowDown') act('key ↓ drop', (s) => towerDrop(s, s.cursor));
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [locked, act]);

  const onGoal = state.stacks[TOWER_GOAL_PEG].length;
  const result = useMemo(() => {
    const efficiency = Math.round((100 * optimal) / Math.max(state.moves, optimal, 1));
    const speed = Math.max(0, Math.min(100, Math.round((100 * (limit - total)) / limit)));
    const complete = onGoal === n;
    const score = complete
      ? towerScore({ moves: state.moves, optimal, illegal: state.illegal })
      : Math.round((onGoal / n) * 40); // ⚠️ ASSUMPTION: an unfinished tower scores at most 40
    return {
      score,
      skills: [
        { label: 'Planning', value: complete ? efficiency : Math.round((onGoal / n) * 40) },
        { label: 'Logical reasoning', value: Math.max(0, 100 - state.illegal * 15) },
        { label: 'Processing speed', value: complete ? speed : 0 },
      ],
      summary: complete
        ? `Moved the tower in ${plural(state.moves, 'move', 'moves')} (fewest possible: ${optimal}) with ${plural(state.illegal, 'illegal try', 'illegal tries')}.`
        : `Got ${onGoal} of ${n} discs onto the Goal peg in ${plural(state.moves, 'move', 'moves')}.`,
      verifies: 'Planning',
    };
  }, [state, optimal, limit, total, onGoal, n]);

  const finishNow = () => {
    log('finish', result);
    g.finish(result);
  };
  const goalLegal = state.lifted
    ? towerCanDrop(state.stacks, state.lifted.disc, TOWER_GOAL_PEG)
    : false;
  log('render', { solved, goalLegal, seconds: clock.seconds });

  const level = (g.level ?? 'intermediate').toUpperCase();
  const illegalLabel = `${state.illegal} illegal ${state.illegal === 1 ? 'try' : 'tries'}`;
  const feedback = solved
    ? { tone: 'success', text: towerSolvedMessage(state.moves, optimal) }
    : state.blocked
      ? { tone: 'info', text: TOWER_COPY.notAllowed }
      : null;

  return (
    <GameV2Shell
      name="Tower Shift"
      subtitleLead={`Planning · ${n} discs`}
      progress={{
        countLabel: solved ? `${state.moves} moves` : `Move ${state.moves}`,
        summary: `Fewest possible: ${optimal}`,
        dots: [],
        passMark: `Best so far: ${TOWER_BEST_SO_FAR}`,
      }}
      footer={
        solved
          ? { note: '', action: { label: 'See result', onClick: finishNow } }
          : { note: '', link: { label: 'Finish here', size: 'lg', onClick: finishNow } }
      }
      timeUp={{
        summary: `You got ${onGoal} of ${n} discs onto the Goal peg in ${plural(state.moves, 'move', 'moves')}.`,
      }}
      onSeeResult={finishNow}
    >
      <GameV2Head
        eyebrow={`${level} · ${n} DISCS`}
        title={solved ? TOWER_COPY.solvedTitle : TOWER_COPY.title}
        lead={solved ? towerSolvedLead(state.moves, optimal) : TOWER_COPY.lead}
        stats={[
          {
            icon: GameClockIcon,
            label: solved ? `${formatClock(total)} total` : `${clock.label} left`,
          },
          { icon: GameCheckCircleIcon, label: illegalLabel },
        ]}
        measures={TOWER_MEASURES}
      />
      <section
        aria-label="Tower Shift"
        className="flex flex-col items-stretch lg:min-h-[493px] lg:justify-center"
      >
        <div className="flex items-center justify-center gap-[12px] max-sm:flex-wrap">
          <MoveChip icon={GameRepeatIcon} className="bg-[#f2f5f4] text-[#1c2a21]">
            Moves: {state.moves}
          </MoveChip>
          <MoveChip icon={GameTargetIcon} className="bg-[#fef8ec] text-[#8a6100]">
            Fewest possible: {optimal}
          </MoveChip>
        </div>
        <div className="h-[20px]" aria-hidden="true" />
        <TowerBoard
          discs={n}
          stacks={state.stacks}
          lifted={state.lifted}
          cursor={state.cursor}
          blocked={state.blocked}
          onTap={onTap}
        />
        <div className="flex min-h-[60px] items-center justify-center">
          {feedback ? (
            <GameV2FeedbackChip tone={feedback.tone}>{feedback.text}</GameV2FeedbackChip>
          ) : null}
        </div>
        <p className="sr-only">
          Keyboard: left and right arrows choose a peg, up arrow lifts the top disc, down arrow
          drops it.
        </p>
      </section>
    </GameV2Shell>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2 = { 'tower-shift': TowerShift };

export default TowerShift;
