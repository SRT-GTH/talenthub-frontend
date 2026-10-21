import { ENGAGEMENT_STAGES, STAGE_BY_ID } from '../../engagementShell/engagementShellData.js';
import { JOURNEY_NODES, JOURNEY_PROGRESS, MILESTONES, REGIONS, STAGE_COPY } from './journeyData.js';

/*
 * Pure derivations for the journey hub: everything the map, hero and rail show comes from `done` (stages finished, in
 * order) plus the mock progress of the stage in progress.
 */
const TOTAL = ENGAGEMENT_STAGES.length;

export const stageStatus = (stageId, done) => {
  const idx = ENGAGEMENT_STAGES.findIndex((s) => s.id === stageId);
  if (idx < done) return 'done';
  return idx === done ? 'current' : 'todo';
};

export const buildJourneyModel = (done) => {
  const current = done < TOTAL ? ENGAGEMENT_STAGES[done] : null;
  const progress = current ? (JOURNEY_PROGRESS[current.id] ?? null) : null;
  const unlocked = MILESTONES.filter((m) => done >= m.at).map((m) => m.n);
  const next = MILESTONES.find((m) => done < m.at) ?? null;
  const pct = Math.round((done / TOTAL) * 100);
  const nodes = JOURNEY_NODES.map((node) => {
    if (node.kind === 'milestone') {
      const m = MILESTONES[node.n - 1];
      return { ...node, milestone: m, status: done >= m.at ? 'unlocked' : 'locked' };
    }
    const stage = STAGE_BY_ID[node.id];
    return { ...node, stage, status: stageStatus(node.id, done), copy: STAGE_COPY[node.id] };
  });
  const regions = REGIONS.map((r) => ({
    ...r,
    count: r.stages.filter((id) => stageStatus(id, done) === 'done').length,
  }));
  return { done, total: TOTAL, current, progress, unlocked, next, pct, nodes, regions };
};

/* How much of a milestone card's bar is filled (Figma: done / threshold of a 300px stretch on the 352px track). */
export const milestoneBar = (m, done) =>
  done >= m.at ? 100 : Math.round(((done / m.at) * 300 * 100) / 352);

/* Road segments to draw as "travelled": up to the node of the current stage (all of it when everything is done). */
export const travelledNodeCount = (model) => {
  if (!model.current) return JOURNEY_NODES.length;
  return JOURNEY_NODES.findIndex((n) => n.id === model.current.id) + 1;
};
