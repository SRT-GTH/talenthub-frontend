/*
 * Engagement revamp — shared stage model (Figma canvas "Engagement 1 - gamified" 3125:10352, refreshed 14 Oct 2026).
 * Nine stages, any order, nothing locked. Copy verbatim from J-01 (journey map, Focused 8285:531 / Playful 7640:13290) and
 * the stage bars of IN-01 / WK-01 / … Mock progress only (frontend-only; swap for the API later and keep the shape).
 */
export const ENGAGEMENT_STAGES = [
  { n: 1, id: 'avatar', label: 'Avatar', route: '/profile/engagement/avatar' },
  { n: 2, id: 'interests', label: 'Interests', route: '/profile/filling/interests' },
  { n: 3, id: 'personality', label: 'Personality', route: '/profile/filling/personality' },
  { n: 4, id: 'skills', label: 'Skills', route: '/profile/filling/skills' },
  { n: 5, id: 'work', label: 'Work', route: '/profile/filling/work' },
  { n: 6, id: 'portfolio', label: 'Portfolio', route: '/profile/filling/portfolio' },
  {
    n: 7,
    id: 'certs',
    label: 'Certs',
    barLabel: 'Certifications',
    route: '/profile/filling/certs',
  },
  { n: 8, id: 'goals', label: 'Goals', route: '/profile/filling/goals' },
  { n: 9, id: 'pitch', label: 'Pitch', route: '/profile/filling/pitch' },
];

export const STAGE_BY_ID = Object.fromEntries(ENGAGEMENT_STAGES.map((s) => [s.id, s]));

export const JOURNEY_MAP_ROUTE = '/profile/engagement';

/* Where "Skip for now" / "Skip this stage" goes: the next stage in journey order; after the last stage, back to the map. */
export const nextStageRoute = (stageId) => {
  const i = ENGAGEMENT_STAGES.findIndex((s) => s.id === stageId);
  return (i >= 0 && ENGAGEMENT_STAGES[i + 1]?.route) || JOURNEY_MAP_ROUTE;
};

/* Segment states for the stage bar: stages in doneIds are done, currentId is in progress, the rest are todo. */
export const buildStageSegments = ({ doneIds = [], currentId = null } = {}) =>
  ENGAGEMENT_STAGES.map((s) =>
    doneIds.includes(s.id) ? 'done' : s.id === currentId ? 'current' : 'todo'
  );
