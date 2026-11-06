import {
  CIRCLE_COPY,
  CIRCLE_PEOPLE,
  DISCOVER_RESPONSE,
  FEED_RESPONSE,
  PROFILE_RESPONSE,
} from './circleData.js';

/*
 * Recruiter "My network" — mock data shaped like the future API. Figma canvas "Recruiter - Community Engagement" 10026:36840,
 * section "RECRUITER · COMMUNITY · My network" (RC-NW01 … RC-NW11), file OHG2xsfCCskT8xEn356njv. Converted 1:1 from the talent My
 * circle screens (circleData.js): same people and shapes, recruiter copy, plus the recruiter-only blocks (grow checklist, mentors
 * and hiring partners, "you both know", what a recruiter can do instead of endorsing / recommending).
 * Every string is copied verbatim from Figma (texts.py). The talent data file is untouched; this file only adds.
 *
 *   NETWORK_PEOPLE            GET /network/people/:id            the same people as the talent circle + Ama Kumi (RC-NW10)
 *   NETWORK_SUMMARY           GET /network/summary               128 in your network · 46 following · 31 profile views
 *   NETWORK_DISCOVER          GET /network/discover              "People to link up with" (+ the grow checklist, mentors card)
 *   NETWORK_INVITATIONS       GET /network/invitations           received (3) + sent (2)
 *   NETWORK_CONNECTIONS       GET /network/connections           first page of the 128
 *   NETWORK_PROFILE           GET /network/people/:id/profile    skills (invite to apply), in common, you both know, recommendations
 *   NETWORK_FEED              GET /network/feed                  "From your network"
 *   NETWORK_MINOR             GET /network/discover (talent < 18) RC-NW10: what a 15-year-old talent sees, explained
 *   NETWORK_EMPTY             GET /network/discover (no links)   RC-NW11 "Start your network"
 */

/* ---- BLOCK: PEOPLE ------------------------------------------------------------------------------------------------ */
export const NETWORK_PEOPLE = {
  ...CIRCLE_PEOPLE,
  // RC-NW10 draws a fourth classmate (Ama Kumi, Lv 3, Accra, Young Coders GH, "In your SQL study group.").
  'ama-kumi': {
    id: 'ama-kumi',
    name: 'Ama Kumi',
    firstName: 'Ama',
    headline: 'Student · Achimota School',
    level: 3,
    town: 'Accra',
    mutual: 4,
    shares: [{ kind: 'community', label: 'Young Coders GH' }],
    buddy: 'In your SQL study group.',
  },
};

/* ---- BLOCK: SUMMARY ----------------------------------------------------------------------------------------------- */
export const NETWORK_SUMMARY = {
  me: { id: 'joel-adade-kofie', name: 'Joel Adade Kofie' },
  inCircle: 128,
  following: 46,
  profileViewsThisWeek: 31,
  pendingInvitations: 3,
  tip: 'Recruiters who host events and answer questions get 3× more replies to invites.',
};

/* ---- BLOCK: GROW CHECKLIST + MENTORS CARD (right rail) ------------------------------------------------------------- */
export const NETWORK_GROW = {
  title: 'Grow your network',
  progress: '2 of 4 done · +20 pts each',
  doneCount: 2,
  steps: [
    {
      id: 'company-page',
      title: 'Add your company page',
      body: 'We use it to find classmates',
      done: true,
    },
    {
      id: 'join-clubs',
      title: 'Join 2 clubs',
      body: 'People there become suggestions',
      done: true,
    },
    { id: 'link-up-five', title: 'Link up with 5 people', body: '3 of 5 so far', done: false },
    {
      id: 'invite-friend',
      title: 'Invite a friend on WhatsApp',
      body: 'Share your GTH link',
      done: false,
    },
  ],
};

export const NETWORK_MENTORS_CARD = {
  title: 'Mentors and hiring partners',
  seeAll: 'See all',
  items: [
    { id: 'kwame-boateng', note: 'Mentor · Data Science Ghana' },
    { id: 'adwoa-sarpong', note: 'Data lead · MTN Ghana' },
  ],
};

/* ---- BLOCK: DISCOVER ---------------------------------------------------------------------------------------------- */
export const NETWORK_DISCOVER = {
  invitationsPreview: { ids: ['esi-quaye', 'nana-yaw-mensah'], total: 3 },
  suggestions: {
    ...DISCOVER_RESPONSE.suggestions,
    note: 'Based on your clubs, industry and open roles',
  },
};

/* ---- BLOCK: INVITATIONS ------------------------------------------------------------------------------------------- */
export const NETWORK_INVITATIONS = {
  received: [
    {
      id: 'esi-quaye',
      ago: '2 days ago',
      note: '“Hi Joel, I saw your portfolio review event in UX & Product Design Ghana. Would be great to swap notes on hiring juniors.”',
    },
    { id: 'nana-yaw-mensah', ago: '4 days ago', note: null },
    { id: 'adwoa-sarpong', ago: '1 week ago', note: '“Happy to share our interview scorecards.”' },
  ],
  // ⚠️ ASSUMPTION: Figma draws the "Sent · 2" chip but not its list. Two outgoing requests (adult talent), same row shape.
  sent: [
    { id: 'akosua-mensah', ago: 'sent 3 days ago' },
    { id: 'kojo-annan', ago: 'sent 1 week ago' },
  ],
  footnote: 'Requests you ignore aren’t shown to the sender. They expire after 3 months.',
};

/* ---- BLOCK: CONNECTIONS ------------------------------------------------------------------------------------------- */
export const NETWORK_CONNECTIONS = {
  total: 128,
  items: [
    { id: 'yaw-darko', connected: 'Linked up 2 days ago', region: 'Eastern Region' },
    { id: 'esi-quaye', connected: 'Linked up 5 days ago', region: 'Greater Accra' },
    { id: 'efua-asante', connected: 'Linked up 2 weeks ago', region: 'Central Region' },
    { id: 'akosua-mensah', connected: 'Linked up 3 weeks ago', region: 'Western Region' },
    { id: 'kojo-annan', connected: 'Linked up 1 month ago', region: 'Northern Region' },
  ],
  sorts: ['Recently added', 'Region', 'Skills', 'Clubs'],
  menu: ['View profile', 'Mute their posts', 'Remove from network', 'Report'],
};

/* ---- BLOCK: PROFILE (Yaw Darko, the drawn talent profile) --------------------------------------------------------- */
const YAW = PROFILE_RESPONSE['yaw-darko'];
export const NETWORK_PROFILE = {
  'yaw-darko': {
    ...YAW,
    mutualLine: '8 in your network know them · Abena, Efua and 6 others',
    circleSize: '214 in their network',
    openTo: null,
    lockedNote: 'Link up with Yaw to endorse their skills',
    inCommon: [
      { kind: 'community', label: 'Data Science Ghana', note: 'Both members' },
      { kind: 'school', label: 'Design track', note: 'Skills Lab' },
      { kind: 'interest', label: 'Product design', note: 'Shared interest' },
    ],
    youBothKnow: {
      title: 'You both know · 8',
      seeAll: 'See all 8',
      items: [
        { id: 'abena-owusu', note: 'Data Science Ghana' },
        { id: 'efua-asante', note: 'Accra Designers' },
        { id: 'kwame-boateng', note: 'Verified mentor · Hubtel' },
      ],
    },
    recommendations: [
      {
        id: 'kwame-boateng',
        author: 'kwame-boateng',
        meta: 'Mentored Yaw in Data Science Ghana · Sep 2026',
        text: '“Yaw asks the right questions before he designs. In our club hackathon he interviewed 12 traders at Makola before drawing a single screen.”',
      },
    ],
  },
};

/* What a recruiter can do instead of endorsing / recommending (RC-NW07, RC-NW08). */
export const NETWORK_RESTRICTIONS = {
  endorse: {
    title: 'Recruiters can’t endorse skills',
    body: 'Endorsements come from classmates, teammates and verified mentors so talent and employers can trust them.',
  },
  recommend: {
    title: 'Recruiters can’t write recommendations',
    body: (first) =>
      `Recommendations come from people who worked or studied with ${first}. It keeps them honest for every employer.`,
  },
  insteadTitle: 'What you can do instead',
  insteadBody: (first) =>
    `Invite ${first} to apply to a live role, save them to a list, or add a private note for your team.`,
  saveToList: 'Save to list',
  inviteToApply: 'Invite to apply',
};

/* Any person other than Yaw: the same layout built from their card (recruiter wording). ⚠️ ASSUMPTION, as in the talent file. */
export const buildNetworkGenericProfile = (person) => ({
  id: person.id,
  tagline: `${person.headline}`,
  location: `${person.town}, Ghana`,
  mutualLine: `${person.mutual ?? 0} in your network know them`,
  circleSize: null,
  openTo: null,
  skills: (person.shares ?? [])
    .filter((s) => s.kind === 'skill' || s.kind === 'interest')
    .map((s) => ({
      id: s.label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      label: s.label,
      count: 0,
      line: '0 endorsements',
    })),
  endorsePrompt: `Endorse skills you have seen ${person.firstName} use`,
  lockedNote: `Link up with ${person.firstName} to endorse their skills`,
  inCommon: (person.shares ?? []).map((s) => ({ kind: s.kind, label: s.label, note: 'Shared' })),
  youBothKnow: null,
  recommendations: [],
});

/* ---- BLOCK: FEED -------------------------------------------------------------------------------------------------- */
export const NETWORK_FEED = {
  ...FEED_RESPONSE,
  title: 'From your network',
  sticker: null,
  subtitle: 'Hiring news and events from recruiters and mentors in your network.',
};

/* ---- BLOCK: MINOR (a 15-year-old talent, as a recruiter sees it: hidden from recruiters, explained) ----------------- */
export const NETWORK_MINOR = {
  me: { name: 'Ama', age: 15 },
  notice: {
    title: 'Hidden from recruiters',
    body: 'Recruiters can’t see, connect with or message talent under 18. This view is what talent see.',
  },
  summaryTiles: [
    { value: 9, label: 'In your network' },
    { value: 2, label: 'Mentors' },
    { value: 14, label: 'Classmates on GTH' },
  ],
  tip: 'Under-18 talent are hidden from recruiter networking.',
  invitationsCount: 1,
  networkCount: 9,
  followingCount: 2,
  classmates: {
    title: 'Classmates you may know',
    note: 'From Achimota School and your clubs',
    topPickId: 'kwesi-ofori',
    items: [
      { id: 'kwesi-ofori', cta: 'link-up' },
      { id: 'afia-boakye', cta: 'link-up' },
      { id: 'selorm-agbeko', cta: 'link-up' },
      { id: 'ama-kumi', cta: 'link-up' },
    ],
  },
  mentors: {
    title: 'Verified mentors to follow',
    note: 'Checked by GTH: Ghana Card, safeguarding course and references',
    topPickId: 'kwame-boateng',
    items: [
      { id: 'kwame-boateng', cta: 'learn-from' },
      { id: 'adwoa-sarpong', cta: 'learn-from' },
    ],
  },
  parentCard: {
    title: 'Shared with your parent',
    body: 'This view is what a 15-year-old talent sees. Recruiters can’t see, connect with or message under-18 talent.',
  },
  grow: {
    title: 'Grow your network',
    progress: '1 of 4 done · +20 pts each',
    doneCount: 1,
    steps: [
      {
        id: 'company-page',
        title: 'Add your company page',
        body: 'Find classmates from Achimota',
        done: true,
      },
      {
        id: 'school-club',
        title: 'Join a school club',
        body: 'Young Coders GH is popular',
        done: false,
      },
      {
        id: 'link-up-three',
        title: 'Link up with 3 classmates',
        body: '1 of 3 so far',
        done: false,
      },
      {
        id: 'follow-partner',
        title: 'Follow 1 hiring partner',
        body: 'Checked by GTH',
        done: false,
      },
    ],
  },
};

/* ---- BLOCK: EMPTY ------------------------------------------------------------------------------------------------- */
export const NETWORK_EMPTY = {
  title: 'Start your network',
  sticker: null,
  body: 'Connect with other recruiters, hiring managers and mentors. Talent can follow your company page.',
  ways: [
    {
      id: 'classmates',
      icon: 'mortarboard',
      title: 'Find classmates',
      body: 'Add your company page to see people from it',
    },
    {
      id: 'community',
      icon: 'users',
      title: 'Join a club',
      body: 'Meet people who share your interests',
    },
    {
      id: 'friend',
      icon: 'link',
      title: 'Invite a friend',
      body: 'Share your GTH link on WhatsApp',
    },
  ],
  summaryTiles: [
    { value: 0, label: 'In your network' },
    { value: 0, label: 'Following' },
    { value: 0, label: 'Profile views this week' },
  ],
  tip: 'Start with 3 people you already know. Classmates say yes most often.',
  grow: {
    ...NETWORK_GROW,
    progress: '0 of 4 done · +20 pts each',
    doneCount: 0,
    steps: NETWORK_GROW.steps.map((s) => ({ ...s, done: false })),
  },
  suggestions: {
    title: 'People to link up with',
    note: 'A few people to start with',
    topPickId: 'abena-owusu',
    items: [
      { id: 'abena-owusu', cta: 'link-up', status: 'none' },
      { id: 'yaw-darko', cta: 'link-up', status: 'none' },
      { id: 'efua-asante', cta: 'link-up', status: 'none' },
      { id: 'kwame-boateng', cta: 'learn-from', status: 'none' },
    ],
  },
};

/* ---- BLOCK: COPY (screen chrome) ---------------------------------------------------------------------------------- */
export const NETWORK_COPY = {
  ...CIRCLE_COPY,
  switchCommunities: 'Clubs',
  switchCircle: 'My network',
  createCommunity: 'Host a company club',
  title: 'Your network',
  subtitle:
    'Recruiters, hiring managers and mentors you work with. Talent follow your company page instead.',
  growSticker: null,
  searchPlaceholder: 'Search recruiters, mentors and companies',
  tabs: { ...CIRCLE_COPY.tabs, circle: 'Network' },
  yourCircle: 'Your network',
  stats: ['In your network', 'Following', 'Profile views this week'],
  tipTitle: 'Tip from Hiring Assistant',
  learnFrom: 'Follow',
  inYourCircle: 'In your network',
  knowThem: (n, ago) => `${n} in your network know them · ${ago}`,
  notes: {
    ...CIRCLE_COPY.notes,
    suggestion: (p) =>
      p.id === 'abena-owusu'
        ? 'Hi Abena, we both recruit in Data Science Ghana. Would you like to co-host a CV clinic next month?'
        : `Hi ${p.firstName}, I’d love to link up and talk about hiring.`,
  },
  toast: {
    ...CIRCLE_COPY.toast,
    inCircle: (first) => `${first} is now in your network`,
  },
  inCommonTitle: 'You have in common',
  removeFromNetwork: 'Remove from network',
  people: (n) => `${n} ${n === 1 ? 'person' : 'people'} in your network`,
  sortLabel: 'Sort your network',
  tablistLabel: 'My network',
  checklistLabel: 'Grow your network',
  removed: (first) => `${first} was removed from your network`,
};
