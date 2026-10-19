import { CONFETTI } from '../skillsLabLabsData.js';

/*
 * Each lab's verified modal draws its own confetti scatter (Figma art frames differ per lab). A flow lists them as
 * flow.confetti = { verified: [[x, y, rot, playfulFill, playfulOpacity, focusedFill, focusedOpacity], …] } and points its
 * resultCopy.verified.confetti at the key `${flow.id}:verified`. Registered lazily (skillsLabLabsData imports the flows, so this
 * cannot run at module load).
 */
export const registerFlowConfetti = (flow) => {
  Object.entries(flow.confetti ?? {}).forEach(([scenario, pieces]) => {
    const key = `${flow.id}:${scenario}`;
    if (!CONFETTI[key]) CONFETTI[key] = pieces;
  });
};
