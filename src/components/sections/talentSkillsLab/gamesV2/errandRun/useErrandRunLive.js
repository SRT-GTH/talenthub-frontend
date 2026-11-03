import { useCallback, useEffect, useMemo, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useGameV2Params } from '../gamesV2State.js';
import { GameCheckCircleIcon, GameClockIcon } from '../planningShared/PlanningChessIcons.jsx';
import { blocksBetween, routeLegs } from './errandRunEngine.js';

const log = debug('useErrandRunLive');

const LEVEL_LABEL = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};
const PLUS_STOPS = /pharmacy|clinic/i;
const LEAD =
  'Start at home and visit every stop once. A trip costs the blocks across plus the blocks up or down.';
const LEAD_BACK = `${LEAD} Then come back home.`;

const fmt = (sec) => `${Math.floor(sec / 60)}:${String(Math.max(0, sec) % 60).padStart(2, '0')}`;
const blocksWord = (n) => `${n} ${n === 1 ? 'block' : 'blocks'}`;

/* server map → the board's shape (crossings are { x, y }; the board draws { col, row }) */
const toBoardMap = (m) =>
  m
    ? {
        index: m.index ?? 0,
        total: m.total ?? 1,
        grid: m.grid ?? 7,
        returnHome: Boolean(m.returnHome),
        home: { id: 'home', name: 'Home', col: m.home?.x ?? 0, row: m.home?.y ?? 0 },
        stops: (m.stops ?? []).map((s) => ({
          id: s.id,
          name: s.name ?? s.id,
          ref: s.name ?? s.id,
          col: s.x ?? 0,
          row: s.y ?? 0,
          icon: PLUS_STOPS.test(s.name ?? '') ? 'plus' : 'pin',
        })),
        visited: m.visited ?? [],
        blocksSoFar: m.blocksSoFar ?? 0,
        timeLimitSec: m.timeLimitSec ?? null,
        timeLeftSec: m.timeLeftSec ?? null,
      }
    : null;

/*
 * useErrandRunLive — Errand Run against the server route_planner engine (backend utils/gameEngines/engines/routePlanner.js).
 * Same return shape as useErrandRunMock (games/ErrandRun.jsx), so ErrandRunBoard draws both.
 *   view.map: { index, total, grid, home{x,y}, stops[{id,name,x,y}], visited, returnHome, blocksSoFar, timeLimitSec, timeLeftSec }
 *   view.results: ['shortest'|'longer'] per map done.
 *   A tap sends { type: 'visit', stop }; "Undo last stop" sends { type: 'undo' }; "Clear route" sends one undo per stop.
 *   The visit that completes a map returns { blocks, shortest, bestOrder, isShortest, timedOut } and the server moves on to the
 *   next map at once, so the finished map is kept here (review) until "Next map". After the last map the result card comes
 *   with that move and useGameRun opens the result (LiveErrandRun passes a longer finishDelayMs so the last map can be read).
 *   The clock is the server's per-map countdown (map.timeLeftSec), ticking locally between moves for display only: it never
 *   ends the game (a map finished after its time is scored by the server as timed out).
 *   Hidden in live: "Best so far" and the nearest-first comparison (the server does not send them).
 */
export const useErrandRunLive = (run) => {
  const g = useGameV2Params();
  const v = run.view;
  const live = useMemo(() => toBoardMap(v?.map), [v?.map]);
  const [review, setReview] = useState(null); // { map, order, result, elapsed }
  const [note, setNote] = useState(null);
  const [left, setLeft] = useState(null);

  useEffect(() => {
    setLeft(Number.isFinite(live?.timeLeftSec) ? live.timeLeftSec : null);
  }, [live]);
  useEffect(() => {
    if (left === null || left <= 0) return undefined;
    const id = window.setTimeout(() => setLeft((l) => (l === null ? l : l - 1)), 1000);
    return () => window.clearTimeout(id);
  }, [left]);

  const map = review?.map ?? live;
  const done = Boolean(review);
  const visited = useMemo(() => (review ? review.order : (live?.visited ?? [])), [review, live]);
  const locked = done || !live || Boolean(g.modal) || run.status !== 'ready';

  const pick = useCallback(
    async (stop) => {
      if (locked || run.busy || visited.includes(stop.id)) return;
      setNote(null);
      const before = live;
      const elapsed =
        Number.isFinite(before.timeLimitSec) && left !== null ? before.timeLimitSec - left : null;
      log('visit', stop.id);
      const res = await run.act({ type: 'visit', stop: stop.id });
      if (!res) return;
      if (res.error) {
        log('refused', res.code);
        setNote(res.error);
        return;
      }
      const r = res.result ?? {};
      if ('blocks' in r) {
        log('map done', r);
        setReview({ map: before, order: [...before.visited, stop.id], result: r, elapsed });
      }
    },
    [locked, run, visited, live, left]
  );

  const undo = useCallback(() => {
    if (locked || !visited.length) return;
    setNote(null);
    run.act({ type: 'undo' });
  }, [locked, visited.length, run]);

  const clearRoute = useCallback(() => {
    if (locked) return;
    setNote(null);
    visited.forEach(() => run.act({ type: 'undo' }));
  }, [locked, visited, run]);

  const nextMap = useCallback(() => setReview(null), []);

  if (!map) {
    return { empty: true };
  }

  const byId = (id) => map.stops.find((s) => s.id === id);
  const visitedStops = visited.map(byId).filter(Boolean);
  const legs = routeLegs(visitedStops, map.home);
  const r = review?.result;
  if (r && map.returnHome && visitedStops.length) {
    legs.push({
      stop: { id: 'home', name: 'Back home' },
      cost: blocksBetween(visitedStops[visitedStops.length - 1], map.home),
    });
  }
  const results = v?.results ?? [];
  const mapNo = map.index + 1;
  const total = map.total;
  const level = (
    LEVEL_LABEL[run.difficulty || g.level] ??
    run.difficulty ??
    g.level ??
    ''
  ).toUpperCase();

  let head = { title: 'Plan the shortest route.', lead: map.returnHome ? LEAD_BACK : LEAD };
  let feedback = note ? { tone: 'info', text: note } : null;
  let totalLabel = 'Blocks so far';
  let totalTone = 'amber';
  let showBest = null;
  let routeTone = 'green';
  let best = null;
  const cost = r ? r.blocks : (live?.blocksSoFar ?? 0);
  if (r?.timedOut) {
    head = {
      title: 'Time ran out on this map.',
      lead: `Your route was ${blocksWord(r.blocks)}; the shortest was ${r.shortest}. A map finished after its time doesn’t count.`,
    };
    feedback = { tone: 'info', text: 'Finish each map before its clock runs out.' };
    totalLabel = 'Your route';
    totalTone = 'red';
    showBest = r.shortest;
    routeTone = 'red';
    best = (r.bestOrder ?? []).map(byId).filter(Boolean);
  } else if (r && !r.isShortest) {
    best = (r.bestOrder ?? []).map(byId).filter(Boolean);
    const k = visitedStops.findIndex((s, i) => best[i] && s.id !== best[i].id);
    const saved = r.blocks - r.shortest;
    const saving =
      k >= 0 && saved > 0
        ? ` Visiting ${best[k].name} before ${visitedStops[k].name} saves ${blocksWord(saved)}.`
        : '';
    head = {
      title: `Route done: ${blocksWord(r.blocks)}.`,
      lead: `The shortest route was ${r.shortest}.${saving}`,
    };
    feedback = { tone: 'tip', text: `The gold route is ${blocksWord(saved)} shorter.` };
    totalLabel = 'Your route';
    totalTone = 'red';
    showBest = r.shortest;
    routeTone = 'red';
  } else if (r) {
    head = {
      title: 'Shortest route!',
      lead: `${blocksWord(r.blocks)}. That’s the shortest possible route.`,
    };
    feedback = { tone: 'success', text: `That’s the shortest route: ${blocksWord(r.blocks)}.` };
    totalTone = 'green';
  }

  const clockLabel =
    g.modal === 'offline' ? 'Paused' : left !== null ? `${fmt(left)} left` : 'No time limit';
  const stats = r
    ? [
        {
          icon: GameClockIcon,
          label: review.elapsed !== null ? `Done in ${review.elapsed} s` : 'Map done',
        },
        { icon: GameCheckCircleIcon, label: blocksWord(cost) },
      ]
    : [
        { icon: GameClockIcon, label: clockLabel },
        { icon: GameCheckCircleIcon, label: `${blocksWord(cost)} so far` },
      ];

  const dots = Array.from({ length: total }, (_, i) => {
    if (results[i]) return { state: results[i] === 'shortest' ? 'ok' : 'bad', label: i + 1 };
    if (i === results.length) return { state: 'now', label: i + 1 };
    return { state: 'todo', label: i + 1 };
  });
  const prev = results[mapNo - 2];
  const last = Boolean(r?.finished);

  return {
    eyebrow: `MAP ${mapNo} · ${level} · ${map.stops.length} STOPS`,
    head,
    stats,
    progress: {
      countLabel: `Map ${mapNo} of ${total}`,
      summary: prev ? `Map ${mapNo - 1}: ${prev}` : undefined,
      dots,
      passMark: undefined,
    },
    footer: done
      ? last
        ? { note: '' }
        : { note: '', action: { label: 'Next map', onClick: nextMap } }
      : {
          note: '',
          link: {
            label: 'Clear route',
            size: 'lg',
            onClick: clearRoute,
            disabled: !visited.length,
          },
        },
    timeUpSummary: `You planned ${results.length} of ${total} maps.`,
    onSeeResult: run.submit,
    mapProps: {
      stops: map.stops,
      visited,
      best: best && best.length ? best : null,
      routeTone,
      locked: locked || run.busy,
      onPick: pick,
      grid: map.grid,
      home: map.home,
      closeLoop: map.returnHome && done,
    },
    panel: {
      slots: map.stops.length + (map.returnHome ? 1 : 0),
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
