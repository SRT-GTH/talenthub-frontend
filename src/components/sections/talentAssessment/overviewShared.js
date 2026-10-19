import {
  HubBulbIcon,
  HubChartBarIcon,
  HubCheckCircleIcon,
  HubCompassIcon,
  HubFunctionIcon,
  HubListBulletIcon,
  HubLockIcon,
} from '../talentSkillsLab/HubIcons.jsx';
import { AssessBoltIcon, AssessClipboardIcon, AssessGameIcon } from './AssessmentIcons.jsx';
import { OVERVIEW_ROUTES } from './assessmentData.js';

/*
 * Shared constants for the My Assessment overview screens (MA-01 … MA-08): card chrome, icon lookup and the route resolver.
 * Card A = r20, ink hairline (progress / history / loading / error / first-visit cards); card B = r24, #e7e7e7 hairline
 * (personality, skills evidence, labels, Skills Lab); card C = the "Next assessment" emphasis card (Playful 1.5px ink + hard
 * shadow, Focused two soft shadows). Shadows differ per style exactly as the frames draw them.
 */
export const OV_CARD_A =
  'rounded-[20px] border border-solid border-[rgba(28,42,33,0.1)] bg-white shadow-[0_4px_14px_rgba(28,42,33,0.03)] playful:shadow-[0_6px_20px_rgba(28,42,33,0.06)]';
export const OV_CARD_B =
  'rounded-[24px] border border-solid border-[#e7e7e7] bg-white shadow-[0_5px_17px_rgba(18,38,20,0.03)] playful:shadow-[0_8px_24px_rgba(18,38,20,0.06)]';
export const OV_CARD_C =
  'rounded-[24px] border border-solid border-[rgba(28,42,33,0.1)] bg-white shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

export const OV_FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

/* Step / tile icon lookup (data carries the key, never a component). */
export const OV_ICONS = {
  compass: HubCompassIcon,
  list: HubListBulletIcon,
  check: HubCheckCircleIcon,
  clipboard: AssessClipboardIcon,
  bulb: HubBulbIcon,
  bolt: AssessBoltIcon,
  function: HubFunctionIcon,
  chart: HubChartBarIcon,
  game: AssessGameIcon,
  lock: HubLockIcon,
};

/* OVERVIEW_ROUTES key (or a literal path) -> path. */
export const resolveRoute = (to, skillId) => {
  if (skillId) return OVERVIEW_ROUTES.skill(skillId);
  return OVERVIEW_ROUTES[to] ?? to;
};
