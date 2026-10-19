/*
 * Sprint Stack mock data — Figma SL-GS07 "Sprint 2" (Playful 7943:7856 / Focused 8110:496231). Shaped like
 * `GET /skills-lab/games/sprint-stack` (sprints with their backlog) + `POST …/sprints/:n/start` (verdict).
 *
 * DRAWN: sprint 2 = "Sprint 14" (capacity 20, backlog Offline mode for orders 8 (blocked by Sync API), Sync API 5, Dark mode 3
 * (nice to have), Fix login crash on Tecno phones 2 (Bug, Users waiting); in the sprint MoMo payment API 8 (Due Friday), Order
 * history screen 5 (needs Payment API), Push notifications 4), the "6 tasks" pill, "17 of 20 pts", "Squad of 3", header copy,
 * "Sprint 1 shipped on time".
 * ⚠️ ASSUMPTION: sprints 1 ("Sprint 13") and 3 ("Sprint 15") backlogs; the verdict rule (shipped = nothing blocked + every
 * `must` task in the sprint; capacity is always enforced); its copy; +25 XP per shipped sprint / +20 pass bonus; the
 * "Not enough room" drop-zone text; what the drawn "6 tasks" pill counts (kept as drawn until the first move).
 */
export const SPRINT_STACK = {
  gameId: 'sprint-stack',
  title: 'Skills Lab · Sprint Stack',
  label: 'Sprint Stack',
  subtitle: 'Engineering planning · 3 sprints · Ship 2 to earn Verified',
  skill: 'Engineering planning',
  total: 3,
  passMark: 2,
  capacity: 20,
  squad: 3,
  baseXp: 240,
  streakDays: 7,
  sprintXp: 25,
  passBonusXp: 20,
  checks: ['Estimation', 'Dependencies', 'Priorities'],
};

// tag tones: plain (white chip), red (#f9ebea / #902b20), amber (#faf4e8 / #463409)
const T = (label, tone = 'plain') => ({ label, tone });

export const SPRINTS = [
  {
    // ⚠️ ASSUMPTION (sprint 1)
    name: 'Sprint 13',
    blurb:
      'Your squad has 20 points for two weeks. Drag tasks from the backlog and watch the dependencies.',
    tasks: [
      { id: 'login', name: 'Login screen', pts: 5, tags: [T('Frontend')] },
      {
        id: 'walletApi',
        name: 'Wallet balance API',
        pts: 8,
        tags: [T('Backend'), T('Due Friday', 'amber')],
        must: true,
      },
      {
        id: 'walletScreen',
        name: 'Wallet balance screen',
        pts: 5,
        needs: 'walletApi',
        needsLabel: 'Needs Wallet API',
        tags: [],
      },
      {
        id: 'crash',
        name: 'Fix crash on startup',
        pts: 3,
        tags: [T('Bug', 'red'), T('Users waiting', 'amber')],
        must: true,
      },
      { id: 'typo', name: 'Fix typo in terms', pts: 1, tags: [T('Nice to have')], nice: true },
      { id: 'banner', name: 'Promo banner', pts: 4, tags: [T('Frontend')] },
    ],
    start: [],
  },
  {
    // DRAWN (sprint 2, Figma SL-GS07)
    name: 'Sprint 14',
    blurb:
      'Your squad has 20 points for two weeks. Drag tasks from the backlog and watch the dependencies.',
    tasks: [
      {
        id: 'offline',
        name: 'Offline mode for orders',
        pts: 8,
        needs: 'sync',
        needsLabel: 'Blocked by Sync API',
        blockedTone: true,
        tags: [],
      },
      { id: 'sync', name: 'Sync API', pts: 5, tags: [T('Backend')] },
      { id: 'dark', name: 'Dark mode', pts: 3, tags: [T('Nice to have')], nice: true },
      {
        id: 'fix',
        name: 'Fix login crash on Tecno phones',
        pts: 2,
        tags: [T('Bug', 'red'), T('Users waiting', 'amber')],
        must: true,
      },
      {
        id: 'momo',
        name: 'MoMo payment API',
        pts: 8,
        tags: [T('Backend'), T('Due Friday', 'amber')],
        must: true,
      },
      {
        id: 'order',
        name: 'Order history screen',
        pts: 5,
        needs: 'momo',
        needsLabel: 'Needs Payment API',
        tags: [],
      },
      { id: 'push', name: 'Push notifications', pts: 4, tags: [T('Frontend')] },
    ],
    start: ['momo', 'order', 'push'],
  },
  {
    // ⚠️ ASSUMPTION (sprint 3)
    name: 'Sprint 15',
    blurb:
      'Your squad has 20 points for two weeks. Drag tasks from the backlog and watch the dependencies.',
    tasks: [
      { id: 'settings', name: 'Settings page', pts: 3, tags: [T('Frontend')] },
      {
        id: 'notifApi',
        name: 'Notifications API',
        pts: 5,
        tags: [T('Backend'), T('Due Friday', 'amber')],
        must: true,
      },
      {
        id: 'notifScreen',
        name: 'Notifications screen',
        pts: 5,
        needs: 'notifApi',
        needsLabel: 'Needs Notifications API',
        tags: [],
      },
      {
        id: 'patch',
        name: 'Security patch',
        pts: 2,
        tags: [T('Bug', 'red'), T('Users waiting', 'amber')],
        must: true,
      },
      { id: 'csv', name: 'Export to CSV', pts: 8, tags: [T('Nice to have')], nice: true },
      { id: 'auth', name: 'Refactor auth', pts: 6, tags: [T('Backend')] },
    ],
    start: [],
  },
];

/* Figma seed (?f=GS07): sprint 2, sprint 1 shipped, 17 of 20 pts in the sprint, the drawn "6 tasks" pill. */
export const SPRINT_FRAMES = {
  GS07: {
    sprint: 1,
    results: ['ok'],
    inSprint: ['momo', 'order', 'push'],
    backlogLabel: '6 tasks',
  },
};
