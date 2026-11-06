import { useCallback, useEffect, useMemo, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import GameV2Shell from '../GameV2Shell.jsx';
import { useGameClock } from '../useGameClock.js';
import { useGameV2Params } from '../gamesV2State.js';
import ErrandMap from '../errandRun/ErrandMap.jsx';
import ErrandRoutePanel from '../errandRun/ErrandRoutePanel.jsx';
import {
  ERRAND_BEST_SO_FAR,
  ERRAND_MAPS_PER_RUN,
  ERRAND_MEASURES,
  ERRAND_SEEDS,
  errandTimeLimit,
} from '../errandRun/errandRunData.js';
import {
  generateErrandMap,
  nearestFirstRoute,
  routeCost,
  routeLegs,
  savingSentence,
  shortestRoute,
} from '../errandRun/errandRunEngine.js';
import { useErrandRunLive } from '../errandRun/useErrandRunLive.js';
import GameV2LiveGate from '../live/GameV2LiveGate.jsx';
import { isLiveGames } from '../live/gameKeys.js';
import { useGameRun } from '../live/useGameRun.js';
import GameV2Head from '../planningShared/GameV2Head.jsx';
import { GameCheckCircleIcon, GameClockIcon } from '../planningShared/PlanningChessIcons.jsx';
import { isMockGamesUrl, liveBestMark, readLiveResult } from '../planningShared/liveResultMeta.js';

const log = debug('ErrandRun');

/*
 * Errand Run — plan the shortest route through town (Figma "Games v2 · 9" ER-01 … ER-03).
 *   Live (default): the server route_planner engine (/api/games, errandRun/useErrandRunLive.js) — map size, home, stops, shortest
 *   route and score all come from the server (3 maps; Advanced / Expert must come back home).
 *   Mock (`?f=ER-01…03`, `?demo=1`): the local maps and rules in errandRun/errandRunEngine.js and the mock score.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2_META = {
  'errand-run': {
    name: 'Errand Run',
    // live results do not store the map count, so the live header names the skill only
    get subtitleLead() {
      return isMockGamesUrl() ? `Planning · ${ERRAND_MAPS_PER_RUN} town maps` : 'Planning';
    },
    /* a getter: the live strip follows the run just finished (server: correct = shortest routes, total = maps) */
    get resultProgress() {
      const stored = readLiveResult('errand-run');
      if (stored) {
        return {
          countLabel: `${stored.correct ?? 0} of ${stored.total ?? 0} shortest`,
          summary: stored.completed ? 'All maps planned' : (stored.summary ?? ''),
          dots: [],
          passMark: liveBestMark(stored),
        };
      }
      if (!isMockGamesUrl()) return null;
      return {
        countLabel: `Map ${ERRAND_MAPS_PER_RUN} of ${ERRAND_MAPS_PER_RUN}`,
        summary: 'All maps planned',
        dots: Array.from({ length: ERRAND_MAPS_PER_RUN }, (_, i) => ({
          state: 'ok',
          label: i + 1,
        })),
        passMark: `Best so far: ${ERRAND_BEST_SO_FAR}`,
      };
    },
  },
};

const LEAD =
  'Start at home and visit every stop once. A trip costs the blocks across plus the blocks up or down.';

/* the drawn Figma frames (`?f=`) and `?demo=1`: the local maps, rules and mock score */
const useErrandRunMock = (frame) => {
  const g = useGameV2Params();
  const seed = frame ? ERRAND_SEEDS[frame] : null;
  const level = seed ? 'intermediate' : g.level;
  const [run, setRun] = useState(() =>
    seed
      ? { ...seed, times: [], costs: [] }
      : { mapIdx: 1, route: [], status: 'play', results: [], times: [], costs: [] }
  );
  const [frozen, setFrozen] = useState(Boolean(seed));

  const map = useMemo(() => generateErrandMap(level, run.mapIdx), [level, run.mapIdx]);
  const limit = errandTimeLimit(map.stops.length);
  const best = useMemo(() => shortestRoute(map.stops), [map]);
  const nearest = useMemo(() => nearestFirstRoute(map.stops), [map]);
  const done = run.status === 'done';

  const clock = useGameClock({
    start: seed ? seed.seconds : limit,
    direction: 'down',
    running: !g.modal && !done && !frozen,
    onEnd: () => {
      log('time is up → modal');
      g.openModal('timeup');
    },
  });

  const visited = run.route.map((id) => map.stops.find((s) => s.id === id)).filter(Boolean);
  const legs = routeLegs(visited);
  const cost = routeCost(visited);
  const elapsed = limit - clock.seconds;
  const lastResult = run.results[run.mapIdx - 1];

  useEffect(() => {
    log('mount', { level, map: map.id, stops: map.stops.length, limit, best: best.cost, frame });
  }, [level, map.id, map.stops.length, limit, best.cost, frame]);

  const pick = useCallback(
    (stop) => {
      if (done || clock.ended || run.route.includes(stop.id)) return;
      const route = [...run.route, stop.id];
      log('pick', stop.id, 'route', route);
      if (route.length < map.stops.length) {
        setRun((r) => ({ ...r, route }));
        return;
      }
      const ordered = route.map((id) => map.stops.find((s) => s.id === id));
      const total = routeCost(ordered);
      const result = total === best.cost ? 'shortest' : 'longer';
      log('map done', { total, best: best.cost, result, elapsed });
      setRun((r) => ({
        ...r,
        route,
        status: 'done',
        results: [...r.results.slice(0, r.mapIdx - 1), result],
        times: [...r.times, { elapsed, limit }],
        costs: [...r.costs, { total, best: best.cost }],
      }));
    },
    [done, clock.ended, run.route, map.stops, best.cost, elapsed, limit]
  );

  const undo = () => {
    log('undo');
    setRun((r) => ({ ...r, route: r.route.slice(0, -1) }));
  };
  const clearRoute = () => {
    log('clear route');
    setRun((r) => ({ ...r, route: [] }));
  };

  const buildResult = useCallback(
    (partial) => {
      const costs = run.costs.length ? run.costs : [];
      const planned = costs.length;
      const efficiency = planned
        ? Math.round(costs.reduce((n, c) => n + (100 * c.best) / c.total, 0) / ERRAND_MAPS_PER_RUN)
        : 0;
      const shortest = run.results.filter((r) => r === 'shortest').length;
      const speed = run.times.length
        ? Math.round(
            run.times.reduce((n, t) => n + (100 * (t.limit - t.elapsed)) / t.limit, 0) /
              ERRAND_MAPS_PER_RUN
          )
        : 0;
      return {
        score: efficiency,
        skills: [
          { label: 'Planning', value: efficiency },
          {
            label: 'Numerical reasoning',
            value: Math.round((100 * shortest) / ERRAND_MAPS_PER_RUN),
          },
          { label: 'Processing speed', value: speed },
        ],
        summary: partial
          ? `Planned ${planned} of ${ERRAND_MAPS_PER_RUN} maps; ${shortest} on the shortest route.`
          : `Planned all ${ERRAND_MAPS_PER_RUN} maps; ${shortest} on the shortest route.`,
        verifies: 'Planning',
      };
    },
    [run.costs, run.results, run.times]
  );

  const nextMap = () => {
    if (run.mapIdx >= ERRAND_MAPS_PER_RUN) {
      const result = buildResult(false);
      log('finish', result);
      g.finish(result);
      return;
    }
    log('next map', run.mapIdx + 1);
    setFrozen(false);
    setRun((r) => ({ ...r, mapIdx: r.mapIdx + 1, route: [], status: 'play' }));
    clock.reset(errandTimeLimit(generateErrandMap(level, run.mapIdx + 1).stops.length));
  };
  const seeResultEarly = () => {
    const result = buildResult(true);
    log('finish (time up)', result);
    g.finish(result);
  };

  const dots = Array.from({ length: ERRAND_MAPS_PER_RUN }, (_, i) => {
    const n = i + 1;
    const doneResult = run.results[i];
    if (n < run.mapIdx || (n === run.mapIdx && done)) {
      return { state: doneResult === 'shortest' ? 'ok' : 'bad', label: n };
    }
    if (n === run.mapIdx || (n === run.mapIdx + 1 && done)) return { state: 'now', label: n };
    return { state: 'todo', label: n };
  });
  const prev = run.results[run.mapIdx - 2];

  let head;
  let feedback = null;
  let totalLabel = 'Blocks so far';
  let totalTone = 'amber';
  let showBest = null;
  let routeTone = 'green';
  if (done && lastResult === 'longer') {
    const saved = cost - best.cost;
    head = {
      title: `Route done: ${cost} blocks.`,
      lead: `The shortest route was ${best.cost}. ${savingSentence(visited, best)}`,
    };
    feedback = { tone: 'tip', text: `The gold route is ${saved} blocks shorter.` };
    totalLabel = 'Your route';
    totalTone = 'red';
    showBest = best.cost;
    routeTone = 'red';
  } else if (done) {
    const beat = cost < nearest.cost || frame === 'ER-03';
    head = {
      title: 'Shortest route!',
      lead: beat
        ? `${cost} blocks. You beat the nearest-first route too.`
        : `${cost} blocks. That matches the nearest-first route.`, // ⚠️ ASSUMPTION copy
    };
    feedback = { tone: 'success', text: `That’s the shortest route: ${cost} blocks.` };
    totalTone = 'green';
  } else {
    head = { title: 'Plan the shortest route.', lead: LEAD };
  }

  return {
    eyebrow: `MAP ${run.mapIdx} · ${level.toUpperCase()} · ${map.stops.length} STOPS`,
    head,
    stats: done
      ? [
          { icon: GameClockIcon, label: `Done in ${elapsed} s` },
          { icon: GameCheckCircleIcon, label: `${cost} ${cost === 1 ? 'block' : 'blocks'}` },
        ]
      : [
          { icon: GameClockIcon, label: `${clock.label} left` },
          { icon: GameCheckCircleIcon, label: `${cost} ${cost === 1 ? 'block' : 'blocks'} so far` },
        ],
    progress: {
      countLabel: `Map ${run.mapIdx} of ${ERRAND_MAPS_PER_RUN}`,
      summary: prev
        ? `Map ${run.mapIdx - 1}: ${prev === 'shortest' ? 'shortest' : 'longer'}`
        : undefined,
      dots,
      passMark: `Best so far: ${ERRAND_BEST_SO_FAR}`,
    },
    footer: done
      ? {
          note: '',
          action: {
            label: run.mapIdx >= ERRAND_MAPS_PER_RUN ? 'See result' : 'Next map',
            onClick: nextMap,
          },
        }
      : {
          note: '',
          link: {
            label: 'Clear route',
            size: 'lg',
            onClick: clearRoute,
            disabled: !run.route.length,
          },
        },
    timeUpSummary: `You planned ${run.costs.length} of ${ERRAND_MAPS_PER_RUN} maps before time ran out.`,
    onSeeResult: seeResultEarly,
    mapProps: {
      stops: map.stops,
      visited: run.route,
      best: done && lastResult === 'longer' ? best.order : null,
      routeTone,
      locked: done || clock.ended,
      onPick: pick,
    },
    panel: {
      slots: map.stops.length,
      legs,
      totalLabel,
      total: cost,
      totalTone,
      best: showBest,
      feedback,
      onUndo: done ? undefined : undo,
    },
  };
};

const ErrandRunBoard = ({ e }) => (
  <GameV2Shell
    name="Errand Run"
    subtitleLead={`Planning · ${e.progress.dots.length} town maps`}
    progress={e.progress}
    footer={e.footer}
    timeUp={{ summary: e.timeUpSummary }}
    onSeeResult={e.onSeeResult}
  >
    <GameV2Head
      eyebrow={e.eyebrow}
      title={e.head.title}
      lead={e.head.lead}
      stats={e.stats}
      measures={ERRAND_MEASURES}
    />
    <section
      aria-label="Errand Run"
      className="flex flex-wrap items-center justify-center gap-[clamp(16px,2.1vw,36px)] lg:min-h-[493px]"
    >
      <ErrandMap {...e.mapProps} />
      <div className="flex w-full min-w-[min(100%,280px)] flex-1 justify-center lg:w-[380px] lg:flex-none">
        <ErrandRoutePanel {...e.panel} />
      </div>
    </section>
  </GameV2Shell>
);

const MockErrandRun = ({ frame }) => <ErrandRunBoard e={useErrandRunMock(frame)} />;

/* live: the server engine builds the maps, knows the shortest routes and scores the run */
const LiveErrandRun = () => {
  // the last map's verdict stays readable a little longer before the result opens
  const run = useGameRun({ finishDelayMs: 2600 });
  const e = useErrandRunLive(run);
  if ((run.status !== 'ready' && run.status !== 'finished') || e.empty) {
    return <GameV2LiveGate run={run} name="Errand Run" subtitleLead="Planning" />;
  }
  return <ErrandRunBoard e={e} />;
};

const ErrandRun = ({ frame }) => {
  const g = useGameV2Params();
  const key = `${g.level}-${g.mode}-${frame ?? ''}`;
  return isLiveGames() ? <LiveErrandRun key={key} /> : <MockErrandRun key={key} frame={frame} />;
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2 = { 'errand-run': ErrandRun };

export default ErrandRun;
