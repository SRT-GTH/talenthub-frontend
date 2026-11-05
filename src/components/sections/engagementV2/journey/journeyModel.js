import { ENGAGEMENT_STAGES, stagesFor } from '../../engagementShell/engagementShellData.js';
import {
  JOURNEY_NODES,
  JOURNEY_PROGRESS,
  MILESTONE_MODALS,
  MILESTONES,
  REGIONS,
  STAGE_COPY,
} from './journeyData.js';

/*
 * Pure derivations for the journey hub. Progress is either
 *   - a number `done` (demo / design URLs: the first `done` stages finished, in order, plus the mock progress of the
 *     stage in progress), or
 *   - live progress `{ doneIds, nextId }` from GET /profiles/journey (stages can be finished in any order; no partial
 *     "2 of 5 picked" figure exists, so `progress` is null).
 * Everything the map, hero and rail show comes from the model built here.
 */
const TOTAL = ENGAGEMENT_STAGES.length;

/* Milestones at a third, two thirds and all of the stages (3 / 6 / 9; 2 / 5 / 7 for JHS), like the backend. */
const milestonesFor = (total, isMinor) => {
  const scaled =
    total === TOTAL
      ? MILESTONES
      : MILESTONES.map((m, i) => ({
          ...m,
          at: [Math.round(total / 3), Math.round((total * 2) / 3), total][i],
        }));
  // Under-18s: recruiters can message them only once a parent or guardian has linked (backend MINOR_NEEDS_PARENT).
  return isMinor
    ? scaled.map((m) =>
        m.n === 1
          ? { ...m, blurb: 'Recruiters can find you; messages wait for a linked parent' }
          : m
      )
    : scaled;
};

const resolve = (input, stages = ENGAGEMENT_STAGES) => {
  const known = new Set(stages.map((s) => s.id));
  if (input && typeof input === 'object') {
    const doneIds = (input.doneIds || []).filter((id) => known.has(id));
    const done = new Set(doneIds);
    const nextId =
      input.nextId && known.has(input.nextId) && !done.has(input.nextId)
        ? input.nextId
        : (stages.find((s) => !done.has(s.id))?.id ?? null);
    return { done, count: done.size, currentId: nextId, live: true };
  }
  const n = Math.min(stages.length, Math.max(0, Number(input) || 0));
  return {
    done: new Set(stages.slice(0, n).map((s) => s.id)),
    count: n,
    currentId: stages[n]?.id ?? null,
    live: false,
  };
};

export const stageStatus = (stageId, done) => {
  const r = done && typeof done === 'object' && done.done instanceof Set ? done : resolve(done);
  if (r.done.has(stageId)) return 'done';
  return stageId === r.currentId ? 'current' : 'todo';
};

/* Live progress with `jhs: true` (GET /profiles/journey) draws the 7-stage JHS journey: no Work or Pitch. */
export const buildJourneyModel = (input) => {
  const jhs = Boolean(input && typeof input === 'object' && input.jhs);
  const stages = stagesFor(jhs);
  const byId = Object.fromEntries(stages.map((s) => [s.id, s]));
  const total = stages.length;
  const isMinor = Boolean(input && typeof input === 'object' && input.isMinor);
  const milestones = milestonesFor(total, isMinor);
  const r = resolve(input, stages);
  const done = r.count;
  const current = r.currentId ? byId[r.currentId] : null;
  const progress = current && !r.live ? (JOURNEY_PROGRESS[current.id] ?? null) : null;
  const unlocked = milestones.filter((m) => done >= m.at).map((m) => m.n);
  const next = milestones.find((m) => done < m.at) ?? null;
  const pct = Math.round((done / total) * 100);
  // True when the finished stages are exactly the first `done` ones (the Figma frames' avatar spots assume this,
  // and they are drawn for the 9-stage road only).
  const inOrder = !jhs && stages.slice(0, done).every((s) => r.done.has(s.id));
  const nodes = JOURNEY_NODES.filter((node) => node.kind === 'milestone' || byId[node.id]).map(
    (node) => {
      if (node.kind === 'milestone') {
        const m = milestones[node.n - 1];
        return { ...node, milestone: m, status: done >= m.at ? 'unlocked' : 'locked' };
      }
      const stage = byId[node.id];
      return { ...node, stage, status: stageStatus(node.id, r), copy: STAGE_COPY[node.id] };
    }
  );
  const regions = REGIONS.map((reg) => {
    const ids = reg.stages.filter((id) => byId[id]);
    return {
      ...reg,
      stages: ids,
      size: ids.length,
      count: ids.filter((id) => r.done.has(id)).length,
    };
  });
  return {
    done,
    doneIds: [...r.done],
    live: r.live,
    jhs,
    isMinor,
    milestones,
    inOrder,
    total,
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

/*
 * Celebration-modal copy for this talent: stage counts follow the journey (7 stages for JHS), and under-18s are told
 * that recruiter messages need a linked parent or guardian, who gets a copy of each one.
 */
export const milestoneModalFor = (n, model) => {
  const base = MILESTONE_MODALS[n];
  if (!base || !model) return base;
  const m = model.milestones?.[n - 1];
  const total = model.total || TOTAL;
  const nextM = model.milestones?.[n];
  const copy = {
    ...base,
    stats: {
      ...base.stats,
      done: `${m?.at ?? 0}/${total}`,
      profile: `${Math.round(((m?.at ?? 0) / total) * 100)}%`,
    },
    next:
      base.next && nextM
        ? { ...base.next, label: `Next: ${nextM.label} · ${nextM.at - m.at} more stages` }
        : base.next,
  };
  if (n === 3)
    copy.body =
      'Every stage done. You’re now in the pool recruiters see first, and your full card is ready to share.';
  if (model.isMinor) {
    if (n === 1) {
      copy.body =
        'Your card is now live in recruiter search. Employers looking for your interests can find you and view your avatar and personality. They can message you once a parent or guardian has linked to your account.';
      copy.benefits = base.benefits.map((b) =>
        b.icon === 'message'
          ? {
              ...b,
              title: 'Messages go through your parent',
              text: 'Recruiters can message you after a parent or guardian links your account. They get a copy of every message.',
            }
          : b
      );
    } else {
      copy.body = `${copy.body} Your parent or guardian can see this milestone on their dashboard.`;
    }
  }
  return copy;
};
