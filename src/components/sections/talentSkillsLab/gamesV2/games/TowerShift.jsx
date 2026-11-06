import { useCallback, useEffect, useMemo, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import GameV2Shell from '../GameV2Shell.jsx';
import { useGameClock, formatClock } from '../useGameClock.js';
import { useGameV2Params } from '../gamesV2State.js';
import GameV2LiveGate from '../live/GameV2LiveGate.jsx';
import { isLiveGames } from '../live/gameKeys.js';
import { useGameRun } from '../live/useGameRun.js';
import GameV2FeedbackChip from '../planningShared/GameV2FeedbackChip.jsx';
import GameV2Head from '../planningShared/GameV2Head.jsx';
import {
  GameCheckCircleIcon,
  GameClockIcon,
  GameRepeatIcon,
  GameTargetIcon,
} from '../planningShared/PlanningChessIcons.jsx';
import { isMockGamesUrl, liveBestMark, readLiveResult } from '../planningShared/liveResultMeta.js';
import TowerBoard from '../towerShift/TowerBoard.jsx';
import {
  TOWER_BEST_SO_FAR,
  TOWER_COPY,
  TOWER_LEVELS,
  TOWER_MEASURES,
  TOWER_SEEDS,
  TOWER_GOAL_PEG,
  towerScore,
  towerSolvedLead,
  towerSolvedMessage,
} from '../towerShift/towerShiftData.js';
import {
  towerDrop,
  towerFreshState,
  towerIsSolved,
  towerLift,
  towerMoveCursor,
  towerOptimalMoves,
  towerTap,
} from '../towerShift/towerShiftEngine.js';
import { useTowerShiftLive } from '../towerShift/useTowerShiftLive.js';

const log = debug('TowerShift');

/*
 * Tower Shift — Tower of Hanoi (Figma "Games v2 · 8" TS-01 … TS-03).
 *   Live (default): the server tower_of_hanoi engine (/api/games, towerShift/useTowerShiftLive.js) — discs by level from the view
 *   (3 / 4 / 5 / 6), server move count, "not allowed" from its 422, server clock and score.
 *   Mock (`?f=TS-01…03`, `?demo=1`): the local rules in towerShift/towerShiftEngine.js and the mock score.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2_META = {
  'tower-shift': {
    name: 'Tower Shift',
    // live results do not store the disc count, so the live header names the skill only
    get subtitleLead() {
      return isMockGamesUrl() ? 'Planning · 4 discs' : 'Planning';
    },
    /* a getter: the live strip follows the run just finished. Server card: solved → correct = fewest possible, total = moves;
       not solved → correct = discs in place, total = discs. */
    get resultProgress() {
      const stored = readLiveResult('tower-shift');
      if (stored) {
        return stored.completed
          ? {
              countLabel: 'Tower moved',
              summary: `${stored.total} moves · fewest possible: ${stored.correct}`,
              dots: [],
              passMark: liveBestMark(stored),
            }
          : {
              countLabel: `${stored.correct ?? 0} of ${stored.total ?? 0} discs in place`,
              summary: stored.summary ?? '',
              dots: [],
              passMark: liveBestMark(stored),
            };
      }
      if (!isMockGamesUrl()) return null;
      return {
        countLabel: 'Tower moved',
        summary: 'Fewest possible: 15',
        dots: [],
        passMark: `Best so far: ${TOWER_BEST_SO_FAR}`,
      };
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

/* the drawn Figma frames (`?f=`) and `?demo=1`: the local rules and mock scoring */
const useTowerShiftMock = (frame) => {
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
  const onKey = useCallback(
    (key) => {
      if (locked) return false;
      if (key === 'ArrowLeft') act('key ←', (s) => towerMoveCursor(s, -1));
      else if (key === 'ArrowRight') act('key →', (s) => towerMoveCursor(s, 1));
      else if (key === 'ArrowUp') act('key ↑ lift', (s) => towerLift(s, s.cursor));
      else if (key === 'ArrowDown') act('key ↓ drop', (s) => towerDrop(s, s.cursor));
      else return false;
      return true;
    },
    [locked, act]
  );

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

  return {
    n,
    optimal,
    moves: state.moves,
    illegal: state.illegal,
    stacks: state.stacks,
    lifted: state.lifted,
    cursor: state.cursor,
    blocked: state.blocked,
    solved,
    eyebrow: `${(g.level ?? 'intermediate').toUpperCase()} · ${n} DISCS`,
    title: solved ? TOWER_COPY.solvedTitle : TOWER_COPY.title,
    lead: solved ? towerSolvedLead(state.moves, optimal) : TOWER_COPY.lead,
    clockLabel: solved ? `${formatClock(total)} total` : `${clock.label} left`,
    feedback: solved
      ? { tone: 'success', text: towerSolvedMessage(state.moves, optimal) }
      : state.blocked
        ? { tone: 'info', text: TOWER_COPY.notAllowed }
        : null,
    passMark: `Best so far: ${TOWER_BEST_SO_FAR}`,
    footer: solved
      ? { note: '', action: { label: 'See result', onClick: finishNow } }
      : { note: '', link: { label: 'Finish here', size: 'lg', onClick: finishNow } },
    timeUpSummary: `You got ${onGoal} of ${n} discs onto the Goal peg in ${plural(state.moves, 'move', 'moves')}.`,
    onSeeResult: finishNow,
    onTap,
    onKey,
  };
};

const TowerShiftBoard = ({ t }) => {
  const { onKey } = t;
  useEffect(() => {
    const handler = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (onKey(e.key)) e.preventDefault();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onKey]);
  log('render', { solved: t.solved, moves: t.moves, lifted: t.lifted?.disc ?? null });

  const illegalLabel = `${t.illegal} illegal ${t.illegal === 1 ? 'try' : 'tries'}`;
  return (
    <GameV2Shell
      name="Tower Shift"
      subtitleLead={`Planning · ${t.n} discs`}
      progress={{
        countLabel: t.solved ? `${t.moves} moves` : `Move ${t.moves}`,
        summary: `Fewest possible: ${t.optimal}`,
        dots: [],
        passMark: t.passMark,
      }}
      footer={t.footer}
      timeUp={{ summary: t.timeUpSummary }}
      onSeeResult={t.onSeeResult}
    >
      <GameV2Head
        eyebrow={t.eyebrow}
        title={t.title}
        lead={t.lead}
        stats={[
          { icon: GameClockIcon, label: t.clockLabel },
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
            Moves: {t.moves}
          </MoveChip>
          <MoveChip icon={GameTargetIcon} className="bg-[#fef8ec] text-[#8a6100]">
            Fewest possible: {t.optimal}
          </MoveChip>
        </div>
        <div className="h-[20px]" aria-hidden="true" />
        <TowerBoard
          discs={t.n}
          stacks={t.stacks}
          lifted={t.lifted}
          cursor={t.cursor}
          blocked={t.blocked}
          onTap={t.onTap}
        />
        <div className="flex min-h-[60px] items-center justify-center">
          {t.feedback ? (
            <GameV2FeedbackChip tone={t.feedback.tone}>{t.feedback.text}</GameV2FeedbackChip>
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

const MockTowerShift = ({ frame }) => <TowerShiftBoard t={useTowerShiftMock(frame)} />;

/* live: the server engine checks every move, counts them and scores the run */
const LiveTowerShift = () => {
  const run = useGameRun();
  const t = useTowerShiftLive(run);
  if (run.status !== 'ready' && run.status !== 'finished') {
    return <GameV2LiveGate run={run} name="Tower Shift" subtitleLead="Planning" />;
  }
  return <TowerShiftBoard t={t} />;
};

const TowerShift = ({ frame }) => {
  const g = useGameV2Params();
  const key = `${g.level}-${g.mode}-${frame ?? ''}`;
  return isLiveGames() ? <LiveTowerShift key={key} /> : <MockTowerShift key={key} frame={frame} />;
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2 = { 'tower-shift': TowerShift };

export default TowerShift;
