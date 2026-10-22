import { ENGAGEMENT_STAGES, STAGE_BY_ID } from '../../engagementShell/engagementShellData.js';
import { JOURNEY_NODES, JOURNEY_PROGRESS, MILESTONES, REGIONS, STAGE_COPY } from './journeyData.js';

/*
 * Pure derivations for the journey hub. Progress is either
 *   - a number `done` (demo / design URLs: the first `done` stages finished, in order, plus the mock progress of the
 *     stage in progress), or
 *   - live progress `{ doneIds, nextId }` from GET /profiles/journey (stages can be finished in any order; no partial
 *     "2 of 5 picked" figure exists, so `progress` is null).
 * Everything the map, hero and rail show comes from the model built here.
 */
const TOTAL = ENGAGEMENT_STAGES.length;

const resolve = (input) => {
  if (input && typeof input === 'object') {
    const doneIds = (input.doneIds || []).filter((id) => STAGE_BY_ID[id]);
    const done = new Set(doneIds);
    const nextId =
      input.nextId && !done.has(input.nextId)
        ? input.nextId
        : (ENGAGEMENT_STAGES.find((s) => !done.has(s.id))?.id ?? null);
    return { done, count: done.size, currentId: nextId, live: true };
  }
  const n = Math.min(TOTAL, Math.max(0, Number(input) || 0));
  return {
    done: new Set(ENGAGEMENT_STAGES.slice(0, n).map((s) => s.id)),
    count: n,
    currentId: ENGAGEMENT_STAGES[n]?.id ?? null,
    live: false,
  };
};

export const stageStatus = (stageId, done) => {
  const r = done && typeof done === 'object' && done.done instanceof Set ? done : resolve(done);
  if (r.done.has(stageId)) return 'done';
  return stageId === r.currentId ? 'current' : 'todo';
};

export const buildJourneyModel = (input) => {
  const r = resolve(input);
  const done = r.count;
  const current = r.currentId ? STAGE_BY_ID[r.currentId] : null;
  const progress = current && !r.live ? (JOURNEY_PROGRESS[current.id] ?? null) : null;
  const unlocked = MILESTONES.filter((m) => done >= m.at).map((m) => m.n);
  const next = MILESTONES.find((m) => done < m.at) ?? null;
  const pct = Math.round((done / TOTAL) * 100);
  // True when the finished stages are exactly the first `done` ones (the Figma frames' avatar spots assume this).
  const inOrder = ENGAGEMENT_STAGES.slice(0, done).every((s) => r.done.has(s.id));
  const nodes = JOURNEY_NODES.map((node) => {
    if (node.kind === 'milestone') {
      const m = MILESTONES[node.n - 1];
      return { ...node, milestone: m, status: done >= m.at ? 'unlocked' : 'locked' };
    }
    const stage = STAGE_BY_ID[node.id];
    return { ...node, stage, status: stageStatus(node.id, r), copy: STAGE_COPY[node.id] };
  });
  const regions = REGIONS.map((reg) => ({
    ...reg,
    count: reg.stages.filter((id) => r.done.has(id)).length,
  }));
  return {
    done,
    doneIds: [...r.done],
    live: r.live,
    inOrder,
    total: TOTAL,
    current,
    progress,
    unlocked,
    next,
    pct,
    nodes,
    regions,
  };
};

/* How much of a milestone card's bar is filled (Figma: done / threshold of a 300px stretch on the 352px track). */
export const milestoneBar = (m, done) =>
  done >= m.at ? 100 : Math.round(((done / m.at) * 300 * 100) / 352);

/* Road segments to draw as "travelled": up to the node of the current stage (all of it when everything is done). */
export const travelledNodeCount = (model) => {
  if (!model.current) return JOURNEY_NODES.length;
  return JOURNEY_NODES.findIndex((n) => n.id === model.current.id) + 1;
};
