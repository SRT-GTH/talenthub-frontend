import { HELP_COPY } from '../notifications/notificationsData.js';
import avatarAma from '../../../assets/talent-streak/page/avatar-ama.png';
import avatarYaw from '../../../assets/talent-streak/page/avatar-yaw.png';

/*
 * talentStreakData — mock data for the Talent Streaks screens (Figma canvas "Talent Streaks" 7532:2),
 * shaped like the payloads a streak API would return so the swap is mechanical.
 * Two owners, one block each (re-read before editing, never touch the other block):
 *   the popover block  Agent A — the nav Streak pop-up (six states) + STREAK_HELP_COPY
 *   the page block     Agent B — `/streak` (S-07) and the 15-day milestone modal (S-08)
 */

/* ---- popover ---- */
/* (owned by the pop-up agent — appended above the page block) */

/*
 * Nav Streak pop-up — Figma component set "GTH · Streak pop-up" 7532:317 (Focused twin 8256:90621), frames
 * S-01..S-06 (Playful 7533:28 / :697 / :1359 / :2020 / :2682 / :3347, Focused 8110:21906 / :22379 / :22852 /
 * :23325 / :23798 / :24270). One entry per `?streak=` value; shaped like what a streak-summary API would return
 * once it maps its status to `kind` (`active | done | risk | freeze | lost | new`). Copy is verbatim from Figma.
 *
 *   header       tone of the header band + the mark art + sticker
 *   count        big number (string, as Figma draws it)
 *   week         seven day circles Mon..Sun; the 5th is "today" (F). `kind`:
 *                  lit | lit-freeze | lit-lost | today-pending | today-done | freeze | missed | future | empty
 *   message      body sentence; `flame` shows the small flame at its right edge (Active only)
 *   info         grey info pill
 *   actions      primary (+ optional secondary, drawn left of it) button labels; `intent` is what the CTA does
 */
export const STREAK_POPOVER_PARAM_TO_KIND = {
  open: 'active',
  done: 'done',
  risk: 'risk',
  freeze: 'freeze',
  lost: 'lost',
  new: 'new',
};

const WEEK_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const makeWeek = (kinds) => WEEK_LETTERS.map((letter, i) => ({ letter, kind: kinds[i] }));

export const STREAK_POPOVER_COPY = {
  unit: 'day streak',
  link: 'See streak details →',
  dialogLabel: 'Your streak',
};

export const STREAK_POPOVER_STATES = {
  active: {
    kind: 'active',
    count: '12',
    sticker: { label: 'keep it going', tone: 'white' },
    header: 'cream',
    week: makeWeek(['lit', 'lit', 'lit', 'lit', 'today-pending', 'future', 'future']),
    message: 'Do 1 lesson or 1 Skills Lab game today to make it 13',
    flame: true,
    info: 'Next: 15 days → On Fire badge',
    actions: [{ id: 'primary', label: 'Do a 5-min lesson', intent: 'learn' }],
  },
  done: {
    kind: 'done',
    count: '13',
    sticker: { label: 'safe for today', tone: 'gold' },
    header: 'cream',
    week: makeWeek(['lit', 'lit', 'lit', 'lit', 'today-done', 'future', 'future']),
    message: 'Nice work! +10 XP. Come back tomorrow to keep it going.',
    info: '2 days to your On Fire badge',
    actions: [{ id: 'primary', label: 'Keep learning', intent: 'learn' }],
  },
  risk: {
    kind: 'risk',
    count: '12',
    sticker: { label: 'ends in 3h', tone: 'orange' },
    header: 'peach',
    week: makeWeek(['lit', 'lit', 'lit', 'lit', 'today-pending', 'future', 'future']),
    message: 'Your streak ends at midnight. One 5-minute lesson saves it.',
    info: 'Reminder sent at 7:00 PM',
    actions: [{ id: 'primary', label: 'Save my streak', intent: 'learn' }],
  },
  freeze: {
    kind: 'freeze',
    count: '12',
    sticker: { label: 'a freeze saved you', tone: 'white', icon: 'shield' },
    header: 'ice',
    week: makeWeek([
      'lit-freeze',
      'lit-freeze',
      'lit-freeze',
      'freeze',
      'lit-freeze',
      'future',
      'future',
    ]),
    message:
      'You missed yesterday, so a streak freeze kicked in. You have 0 left. Earn another at 15 days.',
    info: 'Freezes left: 0',
    actions: [{ id: 'primary', label: 'Keep learning', intent: 'learn' }],
  },
  lost: {
    kind: 'lost',
    count: '0',
    sticker: { label: 'streak ended', tone: 'white' },
    header: 'grey',
    muted: true,
    week: makeWeek([
      'lit-lost',
      'lit-lost',
      'lit-lost',
      'missed',
      'today-pending',
      'future',
      'future',
    ]),
    message:
      'Your 12-day streak ended. Life happens. Repair it by finishing 2 lessons today, or start fresh.',
    info: 'Your best is still 21 days',
    actions: [
      { id: 'secondary', label: 'Start fresh', intent: 'fresh' },
      { id: 'primary', label: 'Repair my streak', intent: 'repair' },
    ],
  },
  new: {
    kind: 'new',
    count: '0',
    sticker: { label: 'new here?', tone: 'white' },
    header: 'cream',
    week: makeWeek(['empty', 'empty', 'empty', 'empty', 'today-pending', 'empty', 'empty']),
    message:
      'Learn or play something every day to build a streak. Your first flame is one lesson away.',
    info: 'Streaks earn XP, badges and freezes',
    actions: [{ id: 'primary', label: 'Start my streak', intent: 'learn' }],
  },
};

/* Help pop-over on the streak surfaces — Figma HP 8374:531 (Playful) / 8374:862 (Focused): the same card as
 * HELP_COPY with only the "for this page" block swapped (identical text in both styles). */
export const STREAK_HELP_COPY = {
  ...HELP_COPY,
  pageLabel: 'FOR THIS PAGE · STREAKS',
  page: [
    { label: 'How do I keep my streak going?', icon: 'help' },
    { label: 'What is a streak freeze?', icon: 'help' },
    { label: 'What do I get for a long streak?', icon: 'help' },
  ],
};

/* ---- page ---- */

/* Copy that is the same in every state of the page (S-07 / S-08, Playful 7534:1027 / 7534:1615, Focused 8110:24742 / 8110:25229). */
export const STREAK_PAGE_COPY = {
  title: 'Your streak',
  subtitle: 'Show up a little every day. Small wins stack up.',
  header: {
    inbox: '3 courses in progress',
    sticker: '15 min a day is enough',
    week: '+120 XP this week',
  },
  heroUnit: 'day streak',
  statLabels: { longest: 'Longest', totalDays: 'Total days', freezes: 'Freezes' },
  // Figma writes the points label per style: Playful "Streak XP", Focused "Streak pts".
  pointsLabel: { playful: 'Streak XP', focused: 'Streak pts' },
  weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  cellLabels: { today: 'today', missed: 'missed', goal: 'On Fire', todayGoal: 'today · On Fire!' },
  counts: {
    title: 'Any one of these keeps your flame alive',
    items: [
      { id: 'lesson', label: 'Finish a lesson', icon: 'book' },
      { id: 'check', label: 'Pass a quick check', icon: 'quiz' },
      { id: 'game', label: 'Play a Skills Lab game', icon: 'game' },
      { id: 'assessment', label: 'Complete an assessment', icon: 'clip' },
    ],
  },
  milestonesTitle: 'Milestones',
  remindersTitle: 'Reminders',
  leaderboardTitle: 'Top streaks in Data Gang GH',
};

/* "Reminders" settings as an API would return them. */
export const STREAK_REMINDERS = [
  { id: 'daily', label: 'Daily nudge at', time: '7:00 PM', enabled: true },
  { id: 'warn', label: 'Warn me before my streak ends', time: null, enabled: true },
];

/* Leaderboard rows (rank order). `you` carries the initial instead of a photo. */
const LEADERBOARD = [
  { rank: 1, name: 'Ama O.', days: 34, avatar: avatarAma },
  { rank: 2, name: 'Yaw B.', days: 21, avatar: avatarYaw },
  { rank: 3, name: 'You', days: 12, initial: 'K', you: true },
];

const MILESTONE_LADDER = [
  { id: 3, label: 'Spark', days: '3 days' },
  { id: 7, label: 'Warm up', days: '7 days' },
  { id: 15, label: 'On Fire', days: '15 days' },
  { id: 30, label: 'Unstoppable', days: '30 days' },
  { id: 60, label: 'Main character', days: '60 days' },
  { id: 100, label: 'Legend', days: '100 days' },
];

/*
 * Streak page payloads. `month.litDates` are the days with a qualifying action (ISO yyyy-mm-dd);
 * missed days are derived (a past, un-lit day). `goalDate` is the day the next milestone lands.
 * S-07: streak 12, today = Oct 14 (not yet lit), On Fire lands on the 16th.
 * S-08: streak 15, today = Oct 16, the day On Fire unlocks.
 */
const range = (from, to) =>
  Array.from({ length: to - from + 1 }, (_, i) => `2026-10-${String(from + i).padStart(2, '0')}`);

export const STREAK_PAGE_DEFAULT = {
  summary: {
    current: 12,
    longest: 21,
    totalDays: 47,
    freezes: 1,
    points: 360,
    heroSticker: '3 days to On Fire',
    navStreak: '12',
    headerSticker: '12 days',
  },
  month: {
    year: 2026,
    month: 10,
    today: '2026-10-14',
    litDates: range(2, 13),
    goalDate: '2026-10-16',
  },
  milestones: MILESTONE_LADDER.map((m) => ({
    ...m,
    state: m.id <= 7 ? 'done' : m.id === 15 ? 'current' : 'locked',
    note: m.id === 15 ? '15 days · 3 days to go' : m.days,
  })),
  reminders: STREAK_REMINDERS,
  leaderboard: LEADERBOARD,
  milestoneModal: false,
};

export const STREAK_PAGE_MILESTONE_15 = {
  summary: {
    current: 15,
    longest: 21,
    totalDays: 47,
    freezes: 1,
    points: 360,
    heroSticker: 'On Fire unlocked',
    navStreak: '15',
    headerSticker: '15 days',
  },
  month: {
    year: 2026,
    month: 10,
    today: '2026-10-16',
    litDates: range(2, 16),
    goalDate: '2026-10-16',
  },
  milestones: MILESTONE_LADDER.map((m) => ({
    ...m,
    state: m.id <= 7 ? 'done' : m.id === 15 ? 'unlocked' : 'locked',
    note: m.id === 15 ? '15 days · unlocked today' : m.days,
  })),
  reminders: STREAK_REMINDERS,
  leaderboard: LEADERBOARD,
  milestoneModal: true,
};

/* Pop-up that celebrates a milestone (S-08, Playful 7534:2220 / Focused 8110:25717). */
export const STREAK_MILESTONE_MODAL = {
  badgeDays: '15',
  sticker: 'Badge unlocked: On Fire',
  title: '15-day streak!',
  body: 'Two weeks of showing up. That’s how skills stick, and recruiters notice consistency.',
  rewards: [
    { id: 'points', label: { playful: '+50 XP', focused: '+50 pts' }, tone: 'gold' },
    {
      id: 'freeze',
      label: { playful: '+1 streak freeze', focused: '+1 streak freeze' },
      tone: 'blue',
      shield: true,
    },
    {
      id: 'badge',
      label: { playful: 'Badge on profile', focused: 'Badge on profile' },
      tone: 'mint',
    },
  ],
  share: 'Share it',
  keepGoing: 'Keep going',
};

export const getStreakPageData = ({ milestone } = {}) =>
  milestone === '15' ? STREAK_PAGE_MILESTONE_15 : STREAK_PAGE_DEFAULT;
