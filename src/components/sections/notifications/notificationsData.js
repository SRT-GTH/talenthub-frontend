/*
 * Talent Notifications — copy, filters + asset map. NOTIFICATIONS below is the Figma mock feed,
 * kept for the mapper's reference and the playful-leak check; the screens read the real feed
 * through useNotificationFeed (GET /api/notifications, notificationsMappers.js).
 * Every string is verbatim from Figma file Bin8roWL8sloyc36IgFMuT, section "Talent Notification
 * Screens" (7471:53182): pop-up N-01..N-04 (7471:54715…), full screen N-05/N-06 (7471:55841/56304),
 * Help overlay HP (8376:10396). Swap the arrays for an API call later and keep the shapes.
 *
 * `body` is the pop-up subtitle, `bodyFull` the (sometimes longer) full-screen subtitle — Figma
 * words them differently, so both are kept.
 */
import typeEye from '../../../assets/notifications/icons/type-eye.svg';
import typeChat from '../../../assets/notifications/icons/type-chat.svg';
import typeTarget from '../../../assets/notifications/icons/type-target.svg';
import typeCalendar from '../../../assets/notifications/icons/type-calendar.svg';
import typeSpark from '../../../assets/notifications/icons/type-spark.svg';
import typeFile from '../../../assets/notifications/icons/type-file.svg';
import typeUsers from '../../../assets/notifications/icons/type-users.svg';
import tileAward from '../../../assets/notifications/icons/tile-award.svg';
import tileBrief from '../../../assets/notifications/icons/tile-brief.svg';
import railBellWhite from '../../../assets/notifications/icons/rail-bell-white.svg';
import railSpark from '../../../assets/notifications/icons/rail-spark.svg';
import railTarget from '../../../assets/notifications/icons/rail-target.svg';
import railChat from '../../../assets/notifications/icons/rail-chat.svg';
import railFile from '../../../assets/notifications/icons/rail-file.svg';
import railAward from '../../../assets/notifications/icons/rail-award.svg';
import railUsers from '../../../assets/notifications/icons/rail-users.svg';
import avatarAma from '../../../assets/notifications/avatars/ama.png';
import avatarKwame from '../../../assets/notifications/avatars/kwame.png';
import avatarMatchA from '../../../assets/notifications/avatars/match-a.png';
import avatarMatchB from '../../../assets/notifications/avatars/match-b.png';
import avatarMatchC from '../../../assets/notifications/avatars/match-c.png';
import avatarKudzo from '../../../assets/notifications/avatars/kudzo.png';
import avatarBuddy from '../../../assets/notifications/avatars/buddy.png';
import avatarYaw from '../../../assets/notifications/avatars/yaw.png';
import face1 from '../../../assets/notifications/avatars/face-1.png';
import face2 from '../../../assets/notifications/avatars/face-2.png';
import face3 from '../../../assets/notifications/avatars/face-3.png';
import face4 from '../../../assets/notifications/avatars/face-4.png';
import recap1 from '../../../assets/notifications/avatars/recap-1.png';
import recap2 from '../../../assets/notifications/avatars/recap-2.png';
import recap3 from '../../../assets/notifications/avatars/recap-3.png';
import recap4 from '../../../assets/notifications/avatars/recap-4.png';

// Type badge (22px pop-up / 24px full screen circle): ring colour + white glyph.
export const NOTIFICATION_TYPES = {
  profileView: { badge: '#224626', icon: typeEye },
  message: { badge: '#244a9f', icon: typeChat },
  matches: { badge: '#387440', icon: typeTarget },
  interview: { badge: '#c8951a', icon: typeCalendar },
  badge: { badge: '#c8951a', icon: typeSpark },
  application: { badge: '#387440', icon: typeFile },
  community: { badge: '#967014', icon: typeUsers },
  buddy: { badge: '#387440', icon: typeSpark },
  // Backend-only types (system / alert / reminder / security) — no Figma row, ink badge ⚠️ ASSUMPTION.
  system: { badge: '#1c2a21', icon: typeSpark },
};

// action tone: 'primary' (green) | 'secondary' (white, ink border)
export const NOTIFICATIONS = [
  {
    id: 'profile-view',
    type: 'profileView',
    group: 'today',
    unread: true,
    title: 'Ama from Zeepay checked out your profile',
    body: 'Data team · that’s 2 views this week',
    bodyFull:
      'Data team · that’s 2 views this week. Recruiters who view twice reply 3x more often.',
    time: '2m',
    avatars: [avatarAma],
    actions: [
      { label: 'Say hi', tone: 'primary' },
      { label: 'View company', tone: 'secondary' },
    ],
  },
  {
    id: 'message',
    type: 'message',
    group: 'today',
    unread: true,
    title: 'Kwame Asante sent you a message',
    body: 'Hubtel · Product Analyst role',
    bodyFull: 'Hubtel · Product Analyst role',
    quote: '“Hey! Are you free for a quick call Thursday?”',
    time: '18m',
    avatars: [avatarKwame],
    actions: [{ label: 'Reply', tone: 'primary' }],
    actionsFull: [
      { label: 'Reply', tone: 'primary' },
      { label: 'Help me reply', tone: 'secondary' },
    ],
  },
  {
    id: 'matches',
    type: 'matches',
    group: 'today',
    unread: true,
    title: '12 roles think you’re a vibe',
    body: 'MTN, Hubtel +10 · up to 92% match',
    bodyFull: 'Data Analyst at MTN, Hubtel and 10 more · up to 92% match',
    time: '1h',
    avatars: [avatarMatchA, avatarMatchB, avatarMatchC],
    actions: [{ label: 'See matches', tone: 'secondary' }],
  },
  {
    id: 'interview',
    type: 'interview',
    group: 'today',
    unread: true,
    title: 'Interview locked in',
    body: 'Kudzo Ltd · Thu 10:00 · Junior Data Analyst',
    bodyFull: 'Kudzo Ltd · Thursday 10:00 · Junior Data Analyst',
    time: '3h',
    avatars: [avatarKudzo],
    actions: [{ label: 'Add to calendar', tone: 'secondary' }],
    actionsFull: [
      { label: 'Add to calendar', tone: 'secondary' },
      { label: 'Prep with Buddy', tone: 'secondary' },
    ],
  },
  {
    id: 'application',
    type: 'application',
    group: 'yesterday',
    title: 'You’re shortlisted at MTN Ghana',
    bodyFull: 'Graduate Data Analyst · next step is a skills task',
    time: 'Yesterday',
    tile: tileBrief,
    popover: false,
    actionsFull: [{ label: 'View application', tone: 'secondary' }],
  },
  {
    id: 'community',
    type: 'community',
    group: 'yesterday',
    title: 'Yaw replied to your post in Data Gang GH',
    bodyFull: '“Facts! SQL window functions changed my life fr”',
    time: 'Yesterday',
    avatars: [avatarYaw],
    popover: false,
  },
  {
    id: 'badge',
    type: 'badge',
    group: 'earlier',
    title: 'Badge unlocked: SQL Basics',
    body: '+40 XP · top 15% of analysts this month',
    bodyFull: '+40 XP · you’re in the top 15% of analysts this month',
    // Focused frames (8110:662 / 8110:1796) word XP as "pts".
    bodyFocused: '+40 pts · top 15% of analysts this month',
    bodyFullFocused: '+40 pts · you’re in the top 15% of analysts this month',
    time: 'Mon',
    tile: tileAward,
    tileTone: 'gold',
  },
  {
    id: 'buddy',
    type: 'buddy',
    group: 'earlier',
    title: 'Career Buddy cooked up a plan for you',
    body: '2 quick steps to push readiness past 90%',
    bodyFull: '2 quick steps to push your readiness past 90%',
    time: 'Sun',
    avatars: [avatarBuddy],
  },
];

// Group headings. Pop-up: TODAY / EARLIER (+ squiggle on the first). Full screen: Today 4 /
// Yesterday 2 / This week 3 — the counts are verbatim Figma text (the feed shows the first rows
// of each; the rest sit below the scroll fade).
export const POPOVER_GROUPS = [
  { id: 'today', label: 'TODAY' },
  { id: 'earlier', label: 'EARLIER' },
];
export const PAGE_GROUPS = [
  { id: 'today', label: 'Today', count: '4', squiggle: true },
  { id: 'yesterday', label: 'Yesterday', count: '2' },
  { id: 'earlier', label: 'This week', count: '3' },
];

export const POPOVER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread', count: '4' },
  { id: 'jobs', label: 'Jobs' },
  { id: 'messages', label: 'Messages' },
];

// Full-screen filter rail ("Show me"). `icon` is the grey glyph; `All` uses the white bell.
export const FILTERS = [
  { id: 'all', label: 'All', count: '24', icon: railBellWhite },
  { id: 'unread', label: 'Unread', count: '4', icon: railSpark, hot: true },
  { id: 'jobs', label: 'Jobs & matches', count: '12', icon: railTarget },
  { id: 'messages', label: 'Messages', count: '3', icon: railChat },
  { id: 'applications', label: 'Applications', count: '2', icon: railFile },
  { id: 'learning', label: 'Learning & badges', count: '5', icon: railAward },
  { id: 'community', label: 'Community', count: '1', icon: railUsers },
  { id: 'buddy', label: 'Career Buddy', count: '2', icon: railSpark },
];

export const QUIET_HOURS = {
  label: 'Quiet hours',
  body: '10pm – 7am. We hold pings so you can sleep ',
};

// Messages header strip (shared Figma instance "GTH · Messages header", 7442:3611…).
export const PAGE_HEADER = {
  title: 'Notifications',
  subtitle: 'Everything happening on your career side, in one feed.',
  faces: [face1, face2, face3, face4],
  inbox: (n) => `${n} new since you left`, // Figma: '4 new since you left'
  inboxCaughtUp: 'All caught up',
  sticker: 'Seen by 9 recruiters',
  streak: '5-day streak',
};

export const POPOVER_COPY = {
  title: 'Notifications',
  subtitle: 'What’s been happening on your career side',
  newSticker: '4 new',
  emptySticker: 'chill mode',
  emptySubtitle: 'Nothing new. Go touch grass',
  settings: 'Settings',
  seeEverything: 'See everything',
  empty: {
    title: 'You’re all caught up',
    body: 'New matches, profile views and recruiter DMs will pop up here. We’ll ping you, promise.',
    primary: 'Explore matches',
    secondary: 'Notification settings',
  },
  tooltip: { label: 'Open full view', keys: '⇧ N' },
  // Not in Figma (no error frame) ⚠️ ASSUMPTION.
  error: 'We couldn’t load your notifications.',
  retry: 'Try again',
};

export const FEED_COPY = {
  title: 'All notifications',
  unreadTitle: 'Unread',
  newSticker: '4 new',
  sort: 'Newest first',
  markAllRead: 'Mark all read',
  railTitle: 'Show me',
  // Not in Figma (no error frame) ⚠️ ASSUMPTION.
  error: 'We couldn’t load your notifications. Check your connection and try again.',
  retry: 'Try again',
  inboxZero: {
    sticker: 'inbox zero',
    title: 'Main character energy',
    body: 'You’ve read everything. We’ll ping you the moment a recruiter looks your way or a new match drops.',
    primary: 'Explore new matches',
    secondary: 'See all notifications',
  },
};

export const RECAP = {
  eyebrow: 'YOUR WEEK, RECAPPED',
  title: 'You got noticed 9 times this week ',
  faces: [recap1, recap2, recap3, recap4],
  more: '+5',
  stickers: [
    { label: '12 matches', tone: 'gold' },
    { label: '2 interviews', tone: 'white' },
    { label: '+120 XP', tone: 'mint' },
  ],
  // Focused frame words the third sticker differently (8110:1796).
  focusedXp: '+120 pts',
};

export const COMING_UP = {
  title: 'Coming up',
  day: 'THU',
  date: '16',
  event: 'Interview · Kudzo Ltd',
  when: '10:00 – 10:30 · Google Meet',
  primary: 'Add to calendar',
  secondary: 'Prep',
};

export const PING_SETTINGS = {
  title: 'Your ping settings',
  rows: [
    { label: 'Job matches', value: 'Instant', on: true },
    { label: 'Recruiter DMs', value: 'Instant', on: true },
    { label: 'Learning nudges', value: 'Daily digest' },
    { label: 'Community', value: 'Weekly digest' },
  ],
};

// Help pop-over (HP, 8376:10396). Row icon keys map to assets/notifications/help/row-*.svg.
export const HELP_COPY = {
  title: 'Help',
  subtitle: 'Quick answers for the page you are on',
  search: 'Search help, e.g. verify a skill',
  pageLabel: 'FOR THIS PAGE · NOTIFICATIONS',
  page: [
    { label: 'How do I turn off one type of alert?', icon: 'help' },
    { label: 'Why did I get a job match alert?', icon: 'help' },
    { label: 'Can I get alerts on WhatsApp?', icon: 'help' },
  ],
  popularLabel: 'POPULAR',
  popular: [
    { label: 'A recruiter asked me to pay a fee. What do I do?', icon: 'shield' },
    { label: 'Can I use GTH without data?', icon: 'info' },
    { label: 'How do I verify a skill?', icon: 'verified' },
  ],
  buddy: 'Ask Career Buddy',
  whatsapp: 'WhatsApp us',
  replay: 'Replay the tour',
  shortcuts: 'Shortcuts',
  help: 'Help centre',
};

/* /profile help pop-over (Figma 8376:19219 / 8376:19339): same card, "for this page" block differs. */
export const HELP_COPY_PROFILE = {
  ...HELP_COPY,
  pageLabel: 'FOR THIS PAGE · PROFILE',
  page: [
    { label: 'Who can see my profile?', icon: 'help' },
    { label: 'How do I add a portfolio piece?', icon: 'help' },
    { label: 'What does Verified mean on a skill?', icon: 'help' },
  ],
};
