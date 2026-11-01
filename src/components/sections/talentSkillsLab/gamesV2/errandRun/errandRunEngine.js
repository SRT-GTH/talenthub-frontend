import {
  ERRAND_DRAWN_MAP,
  ERRAND_HOME,
  ERRAND_STOPS_BY_LEVEL,
  ERRAND_STOP_ORDER,
  ERRAND_STOP_TYPES,
} from './errandRunData.js';
import { debug } from '../../../../../utils/debug.js';

const log = debug('errandRunEngine');

/* Pure Errand Run rules: block costs, route cost, the true shortest route (brute force over every visiting order — at most 6! = 720),
   the nearest-first route, and a deterministic map generator. */
export const blocksBetween = (a, b) => Math.abs(a.col - b.col) + Math.abs(a.row - b.row);

/** Legs of a route (stop objects in visiting order) starting at Home: [{ stop, cost }]. */
export const routeLegs = (stopsInOrder) => {
  let at = ERRAND_HOME;
  return stopsInOrder.map((stop) => {
    const cost = blocksBetween(at, stop);
    at = stop;
    return { stop, cost };
  });
};

export const routeCost = (stopsInOrder) => routeLegs(stopsInOrder).reduce((n, l) => n + l.cost, 0);

const permutations = (items) => {
  if (items.length <= 1) return [items];
  return items.flatMap((item, i) =>
    permutations([...items.slice(0, i), ...items.slice(i + 1)]).map((rest) => [item, ...rest])
  );
};

/** { order: stops[], cost } — the lexicographically first cheapest order (stable). */
export const shortestRoute = (stops) => {
  let best = null;
  permutations(stops).forEach((order) => {
    const cost = routeCost(order);
    if (!best || cost < best.cost) best = { order, cost };
  });
  return best;
};

/** Greedy "always the nearest unvisited stop" route. */
export const nearestFirstRoute = (stops) => {
  const left = [...stops];
  const order = [];
  let at = ERRAND_HOME;
  while (left.length) {
    let pick = 0;
    left.forEach((s, i) => {
      if (blocksBetween(at, s) < blocksBetween(at, left[pick])) pick = i;
    });
    at = left.splice(pick, 1)[0];
    order.push(at);
  }
  return { order, cost: routeCost(order) };
};

/** Polyline of street crossings for a route: Home → each stop, up/down the street first, then across. */
export const routePoints = (stopsInOrder) => {
  const pts = [{ col: 0, row: 0 }];
  let at = ERRAND_HOME;
  stopsInOrder.forEach((s) => {
    if (s.row !== at.row) pts.push({ col: at.col, row: s.row });
    if (s.col !== at.col) pts.push({ col: s.col, row: s.row });
    at = s;
  });
  return pts;
};

/** The "Visiting Makola before the Pharmacy saves 6 blocks." sentence (first stop where the orders differ). */
export const savingSentence = (userOrder, best) => {
  const k = userOrder.findIndex((s, i) => s.id !== best.order[i].id);
  const saved = routeCost(userOrder) - best.cost;
  if (k < 0 || saved <= 0) return '';
  return `Visiting ${best.order[k].ref} before ${userOrder[k].ref} saves ${saved} blocks.`;
};

const mulberry32 = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** ⚠️ ASSUMPTION: generated map for (level, mapIdx). Deterministic; shortest route strictly beats the nearest-first route. */
export const generateErrandMap = (level, mapIdx) => {
  const count = ERRAND_STOPS_BY_LEVEL[level] ?? 4;
  if (level === 'intermediate' && mapIdx === 2) return ERRAND_DRAWN_MAP;
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const rand = mulberry32((mapIdx * 7919 + count * 104729 + attempt * 31) >>> 0);
    const taken = new Set(['0,0']);
    const stops = [];
    const names = ERRAND_STOP_ORDER.slice(0, count);
    for (let i = names.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rand() * (i + 1));
      [names[i], names[j]] = [names[j], names[i]];
    }
    for (let i = 0; i < count; i += 1) {
      let col;
      let row;
      do {
        col = Math.floor(rand() * 7);
        row = Math.floor(rand() * 7);
      } while (taken.has(`${col},${row}`));
      taken.add(`${col},${row}`);
      stops.push({ ...ERRAND_STOP_TYPES[names[i]], col, row });
    }
    stops.sort((a, b) => ERRAND_STOP_ORDER.indexOf(a.id) - ERRAND_STOP_ORDER.indexOf(b.id));
    const best = shortestRoute(stops);
    const nearest = nearestFirstRoute(stops);
    if (best.cost < nearest.cost) {
      log('generated map', { level, mapIdx, attempt, best: best.cost, nearest: nearest.cost });
      return { id: `gen-${level}-${mapIdx}-${attempt}`, stops };
    }
  }
  return ERRAND_DRAWN_MAP;
};
