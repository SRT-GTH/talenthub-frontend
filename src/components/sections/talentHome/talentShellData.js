import {
  TalentSidebarHomeNavIcon,
  TalentSidebarMyAssessmentNavIcon,
  TalentSidebarOpportunitiesNavIcon,
  TalentSidebarWalletNavIcon,
  TalentSidebarCommunityNavIcon,
  TalentSidebarMessagesNavIcon,
  TalentSidebarSkillsLabNavIcon,
  TalentSidebarMyLearningNavIcon,
  TalentSidebarProfileNavIcon,
} from '../../shared/assets.jsx';

/*
 * talentShellData.js — content for the talent chrome (top nav, rail, phone nav).
 * Figma: `Sidebar · talent` 7740:11213 (+ states 7740:11375 / 7740:11537 / 8097:*),
 * `Nav` 8315:461634. Everything here is mock, keyed by the home state
 * (`home.stateKey`) so an API can replace it. ✅ VERIFIED against the frames named above
 * for day1 / discoverable / top; `complete` shares the `top` sidebar (7756:182819 screenshot).
 */

export const TALENT_PROFILE = {
  name: 'Kofi Agyekum',
  headline: 'Frontend developer · Accra',
  url: 'gth.com/talent/kofi-agyekum',
  navName: 'Kofi A.',
};

/* Icons are components from shared/assets.jsx (stroke = currentColor). */
export const TALENT_NAV_MAIN = [
  { id: 'home', label: 'Home', icon: TalentSidebarHomeNavIcon, tab: 'home' },
  {
    id: 'assessment',
    label: 'My Assessment',
    icon: TalentSidebarMyAssessmentNavIcon,
    route: '/my-assessment',
  },
  {
    id: 'opportunities',
    label: 'Job Postings',
    icon: TalentSidebarOpportunitiesNavIcon,
    route: '/job-postings',
  },
  {
    id: 'community',
    label: 'Community',
    icon: TalentSidebarCommunityNavIcon,
    route: '/community',
  },
  { id: 'messages', label: 'Messages', icon: TalentSidebarMessagesNavIcon, route: '/messages' },
];

/* The Home and Settings frames (Figma 8097:*, 7849:530) draw a "Wallet" item between Job Postings and Community. No wallet
   screens exist yet, so it has no destination. Added only where `data.wallet` is set (Home + settings pages) — the other
   frames (My Assessment, Skills Lab, Community…) do not draw it. */
export const TALENT_NAV_WALLET = {
  id: 'wallet',
  label: 'Wallet',
  icon: TalentSidebarWalletNavIcon,
  route: '/wallet',
};
export const withWalletItem = (items) =>
  items.flatMap((item) => (item.id === 'opportunities' ? [item, TALENT_NAV_WALLET] : [item]));

export const TALENT_NAV_SECONDARY = [
  {
    id: 'skills-lab',
    label: 'Skills Lab',
    icon: TalentSidebarSkillsLabNavIcon,
    route: '/skills-lab',
  },
  {
    id: 'my-learning',
    label: 'My Learning',
    icon: TalentSidebarMyLearningNavIcon,
    route: '/learning',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: TalentSidebarProfileNavIcon,
    route: '/profile',
  },
];

const DAY1 = {
  chip: 'New',
  status: '1 of 9 stages complete',
  journey: { label: 'Profile journey', count: '1 of 9', done: 1, caption: 'Continue: Interests →' },
  stats: [
    { id: 'views', value: '0', label: 'Views' },
    { id: 'matches', value: '–', label: 'Matches' },
    { id: 'messages', value: '0', label: 'Messages' },
    { id: 'skills', value: '0', label: 'Skills' },
  ],
  badges: {},
  streak: '1',
};

const DISCOVERABLE = {
  chip: 'Discoverable',
  status: '5 of 9 · recruiters can find you',
  journey: { label: 'Profile journey', count: '5 of 9', done: 5, caption: 'Continue: Portfolio →' },
  stats: [
    { id: 'views', value: '2', label: 'Views' },
    { id: 'matches', value: '18', label: 'Matches' },
    { id: 'messages', value: '0', label: 'Messages' },
    { id: 'skills', value: '3', label: 'Skills' },
  ],
  badges: { opportunities: '18' },
  streak: '3',
};

/* `flat`: Playful complete/top frames (7756:182929, 7740:11537) draw the Focused layout with lime accents. */
const TOP = {
  flat: true,
  chip: 'Verified',
  status: 'Open to opportunities',
  /* XP variant: the progress block reads "Level 5 · Standout / 1,240 XP / 260 XP to Level 6 →" */
  journey: {
    label: 'Level 5 · Standout',
    count: '1,240 pts',
    countPlayful: '1,240 XP',
    percent: 82.8,
    caption: '260 pts to Level 6 →',
    captionPlayful: '260 XP to Level 6 →',
    xp: true,
  },
  stats: [
    { id: 'views', value: '47', label: 'Views' },
    { id: 'matches', value: '142', label: 'Matches' },
    { id: 'messages', value: '3', label: 'Messages' },
    { id: 'skills', value: '7', label: 'Skills' },
  ],
  badges: { opportunities: '12', messages: '3' },
  streak: '12',
};

/* Every Home frame (Day 1 → Top Talent, Figma 8097:4669 / 6075 / 6860 / 7535 and the Settings-flow HM frame) draws a Wallet item. */
const BY_STATE = {
  day1: { ...DAY1, wallet: true },
  discoverable: { ...DISCOVERABLE, wallet: true },
  complete: { ...TOP, wallet: true },
  top: { ...TOP, wallet: true },
};

/*
 * /profile chrome (Figma `_base (Profile template)` 7568:2044, P-01 Focused 8110:368104 / Playful
 * 7570:105): the rail card reads "Tertiary (BSc) · Accra, Ghana", "3 steps to Top Talent", a
 * "Profile strength 82%" bar and 47/142/4/7 stats; "Opportunities" is labelled "Job Postings".
 * Playful keeps the shelf (ink borders + LIVE sticker) here, unlike the home `top` state.
 */
const PROFILE_PAGE = {
  chip: 'Verified',
  headline: 'Tertiary (BSc) · Accra, Ghana',
  status: '3 steps to Top Talent',
  journey: { label: 'Profile strength', count: '82%', percent: 82, caption: 'Finish profile →' },
  stats: [
    { id: 'views', value: '47', label: 'Views' },
    { id: 'matches', value: '142', label: 'Matches' },
    { id: 'messages', value: '4', label: 'Messages' },
    { id: 'skills', value: '7', label: 'Skills' },
  ],
  badges: { assessment: '142', opportunities: '2', messages: '4' },
  streak: '12',
};

/*
 * /learning chrome (Figma ML-01 Playful 7522:104 sidebar 7522:147 / Focused 8110:10737 sidebar
 * 8110:10989): "New" chip, "1 of 5 steps complete", a "Getting started 1 of 5" bar, 47/142/4/7 stats,
 * "Job Postings" label. Playful keeps the shelf. `softBadges`: Focused draws the Messages badge as a
 * light pill (#ebf1ec / #2d5d33, 12px), the others solid green.
 */
const LEARNING_PAGE = {
  chip: 'New',
  headline: 'Tertiary (BSc) · Accra, Ghana',
  status: '1 of 5 steps complete',
  journey: { label: 'Getting started', count: '1 of 5', percent: 20, caption: 'Continue setup →' },
  stats: [
    { id: 'views', value: '47', label: 'Views' },
    { id: 'matches', value: '142', label: 'Matches' },
    { id: 'messages', value: '4', label: 'Messages' },
    { id: 'skills', value: '7', label: 'Skills' },
  ],
  badges: { assessment: '142', opportunities: '2', messages: '4' },
  softBadges: ['messages'],
  // Figma strokes sit INSIDE the boxes: trim padding so the card is 327px and the nav starts at 529.
  tight: true,
  streak: '12',
};

/*
 * /messages chrome (Figma T-MSG-01 Playful 7414:1717 / Focused 8110:435676; same card in every Messages frame): the
 * Learning card (327px "tight", "Getting started 1 of 5", 47/142/4/7) with the Wallet item, "Opportunities" label, badges
 * My Assessment 142 · Opportunities 142 · Messages 4 (the active item draws its badge as a white pill), nav streak 12.
 * ✅ read off the Focused node 8110:435676 (texts.py). Playful keeps the shelf card (LIVE sticker).
 */
const MESSAGES_PAGE = {
  ...LEARNING_PAGE,
  softBadges: undefined,
  wallet: true,
  labels: { opportunities: 'Opportunities' }, // the Messages frames say "Opportunities", not "Job Postings"
  badges: { assessment: '142', opportunities: '142', messages: '4' },
};

/*
 * /job-postings chrome (Figma J-01 7503:104 / Focused 8110:409276): the rail card reads "New" ·
 * "Tertiary (BSc) · Accra, Ghana" · "1 of 5 steps complete" with a "Getting started 1 of 5" bar.
 */
const JOBS_PAGE = {
  chip: 'New',
  headline: 'Tertiary (BSc) · Accra, Ghana',
  status: '1 of 5 steps complete',
  journey: { label: 'Getting started', count: '1 of 5', percent: 20, caption: 'Continue setup →' },
  stats: PROFILE_PAGE.stats,
  badges: { assessment: '142', opportunities: '2', messages: '6' },
  streak: '12',
};

/*
 * /my-assessment chrome (Figma MA-01 Playful 7963:9352 sidebar 7963:9604 / Focused 8110:28604 sidebar 8110:28910; same card in
 * MA-01b/c/d/MA-07/MA-08): "Frontend developer · Accra", "Open to opportunities", "Level 5 · Standout" with the XP bar filled
 * 48 of 239px (20%), "1,240 XP/pts", "260 XP/pts to Level 6 →", 47 / 142 / 4 / 7; badges My Assessment 142, Job Postings 2,
 * Messages 4 (label "Job Postings" for Opportunities). ✅ every value read off the nodes (the lead's first pass said 82.8% and
 * Level 6 from the 0.5x image). Playful keeps the shelf here (ink borders, LIVE sticker) except in MA-07/MA-08 (flat).
 * `tight`: the card is 327px tall in both styles (Figma strokes sit inside the boxes) so the nav starts at y=529.
 * `gradientBadges`: Focused draws the Messages badge with the green->lime gradient. (`activeLabelMuted`, which draws the active label dark grey as the Focused Figma frame
 * does, was removed on request: the active label is white like every other page). `preview`: what the rail's "Preview as …" button does (patch for home.update).
 */
const ASSESSMENT_PAGE = {
  tight: true,
  chip: 'Verified',
  headline: 'Frontend developer · Accra',
  status: 'Open to opportunities',
  journey: {
    label: 'Level 5 · Standout',
    count: '1,240 pts',
    countPlayful: '1,240 XP',
    percent: 20.1,
    caption: '260 pts to Level 6 →',
    captionPlayful: '260 XP to Level 6 →',
    xp: true,
  },
  stats: [
    { id: 'views', value: '47', label: 'Views' },
    { id: 'matches', value: '142', label: 'Matches' },
    { id: 'messages', value: '4', label: 'Messages' },
    { id: 'skills', value: '7', label: 'Skills' },
  ],
  badges: { assessment: '142', opportunities: '2', messages: '4' },
  gradientBadges: ['messages'],
  streak: '12',
  preview: { view: 'recruiter' },
};

/* MA-01b first visit: same card, the progress block is titled "Getting started" (7965:9771). */
const ASSESSMENT_FIRST = {
  ...ASSESSMENT_PAGE,
  journey: { ...ASSESSMENT_PAGE.journey, label: 'Getting started' },
};

/* MA-07 / MA-08 recruiter preview (7970:10350 / 8110:32746): flat Playful, "Preview as talent", recruiter public URL. */
const ASSESSMENT_RECRUITER = {
  ...ASSESSMENT_PAGE,
  flat: true,
  publicUrl: 'gth.com/recruiter/kofi-agyekum',
  previewLabel: 'Preview as talent',
  preview: { view: null },
};

const ASSESSMENT_BY_STATE = {
  assessment: ASSESSMENT_PAGE,
  'assessment-first': ASSESSMENT_FIRST,
  'assessment-recruiter': ASSESSMENT_RECRUITER,
};

/*
 * /community chrome (Figma C-01 Playful 7625:4354 sidebar 7625:4376 / Focused 8110:460141 sidebar 8110:460193; same card in every
 * Community v2 frame): "New" · "Tertiary (BSc) · Accra, Ghana" · "1 of 5 steps complete", "Getting started 1 of 5" bar filled 48 of
 * 239px (20%) with "Continue setup →", 47 / 142 / 4 / 7; badges My Assessment 142, Job Postings 2, Messages 4 (label "Job Postings"
 * for Opportunities), nav streak 12. ✅ every value read off the nodes (the lead's first pass came from the 0.5x image).
 * `tight`: the card is 327px tall in both styles (strokes sit inside the boxes) so the nav starts at y=529.
 * `gradientBadges`: Focused draws the Messages badge with the green->lime gradient, My Assessment / Job Postings solid green;
 * Playful draws all three as soft #ebf1ec pills.
 */
const COMMUNITY_PAGE = {
  ...JOBS_PAGE,
  tight: true,
  badges: { assessment: '142', opportunities: '2', messages: '4' },
  gradientBadges: ['messages'],
};

/*
 * /wallet chrome (Figma W-06 Playful 8817:695 / Focused 8820:464667): same rail card as Job Postings / Community ("New" · "Getting started 1 of 5"),
 * badges My Assessment 142 · Job Postings 2 · Messages 4, the Wallet item drawn active. `tight` + gradient Messages badge as on
 * Community (measured against the Wallet frames: card 327px, nav rows and badges match).
 */
const WALLET_PAGE = {
  ...COMMUNITY_PAGE,
  wallet: true,
  // Figma Wallet frames: card -> nav list gap 24 (shell default 40) and 6px around the divider (default 12). ✅ measured off 8820:344.
  navGap: true,
};

/*
 * /settings chrome (Figma ST-01 7838:13009 / Focused 8110:44072): rail card "Getting started 1 of 5" like Job Postings,
 * badges My Assessment 142 · Job Postings 2 · Messages 4, a Wallet item, and NO nav item active.
 */
const SETTINGS_PAGE = {
  ...JOBS_PAGE,
  wallet: true,
  badges: { assessment: '142', opportunities: '2', messages: '4' },
};

const STAGE_LABEL = {
  avatar: 'Avatar',
  interests: 'Interests',
  personality: 'Personality',
  skills: 'Skills',
  work: 'Work',
  portfolio: 'Portfolio',
  certs: 'Certs',
  goals: 'Goals',
  pitch: 'Pitch',
};
const STATUS_BY_MILESTONE = {
  none: (n) => `${n} of 9 stages complete`,
  discoverable: (n) => `${n} of 9 · recruiters can find you`,
  top_20: (n) => `${n} of 9 · Top 20%`,
  top_talent: () => 'Profile complete · Top Talent',
};

/**
 * Sidebar data. With `live` (useTalentHomeState().live, real /home data) the
 * Figma demo numbers are replaced by real ones; numbers with no backend yet
 * (views, streak, XP level) show "–".
 */
export const getTalentSidebarData = (stateKey = 'day1', live = null, activeNav) => {
  // `activeNav` ('profile' on /profile) swaps in the profile-page rail card; omitted = home data.
  // The page-specific Figma cards are demo data; with live data every page draws the talent's own card.
  if (activeNav === 'profile' && !live) return PROFILE_PAGE;
  if ((activeNav === 'jobs' || activeNav === 'streak' || activeNav === 'skills-lab') && !live)
    return JOBS_PAGE;
  // My Assessment / My Learning / Community: the Figma rail card in demo mode; the talent's live card once live data exists.
  if (activeNav === 'assessment' && !live) return ASSESSMENT_BY_STATE[stateKey] ?? ASSESSMENT_PAGE;
  if (activeNav === 'settings' && !live) return SETTINGS_PAGE;
  if (activeNav === 'learning' && !live) return LEARNING_PAGE;
  if (activeNav === 'messages' && !live) return MESSAGES_PAGE;
  if (activeNav === 'wallet' && !live) return WALLET_PAGE;
  if (activeNav === 'community' && !live) return COMMUNITY_PAGE;
  const base = BY_STATE[stateKey] ?? DAY1;
  if (!live) return base;
  if (live.placeholder) {
    return {
      ...base,
      status: '',
      journey: { label: 'Profile journey', count: '–', done: 0, caption: '' },
      stats: base.stats.map((s) => ({ ...s, value: '–' })),
      badges: {},
      streak: '–',
    };
  }
  const j = live.journey || { doneCount: 0, milestone: 'none', nextStage: 'avatar' };
  const next = j.nextStage ? STAGE_LABEL[j.nextStage] : null;
  const matches = live.matches?.total ?? 0;
  return {
    ...base,
    status: (STATUS_BY_MILESTONE[j.milestone] || STATUS_BY_MILESTONE.none)(j.doneCount),
    journey: {
      label: 'Profile journey',
      count: `${j.doneCount} of 9`,
      done: j.doneCount,
      caption: next ? `Continue: ${next} →` : 'View my profile →',
    },
    stats: [
      { id: 'views', value: live.views ? String(live.views.uniqueViewers) : '–', label: 'Views' },
      { id: 'matches', value: String(matches), label: 'Matches' },
      { id: 'messages', value: '–', label: 'Messages' },
      { id: 'skills', value: String(live.verifiedSkills ?? 0), label: 'Skills' },
    ],
    badges: matches ? { opportunities: String(matches) } : {},
    streak: '–',
  };
};

/** Name / headline for the sidebar and phone nav (real when `live` is given). */
export const getTalentProfile = (live = null) => {
  if (!live || !live.firstName) return TALENT_PROFILE;
  const name = [live.firstName, live.lastName].filter(Boolean).join(' ');
  return {
    ...TALENT_PROFILE,
    name,
    headline: [live.targetCareer, live.city].filter(Boolean).join(' · ') || 'Talent',
    url: '',
    navName: `${live.firstName}${live.lastName ? ` ${live.lastName[0]}.` : ''}`,
  };
};

/* Top nav counts (Nav 8315:461634: bell 5, messages 5; streak per state). */
export const getTalentNavData = (stateKey = 'day1', live = null) =>
  live
    ? {
        streakCount: '–',
        notificationCount: live.notifications?.unread ? String(live.notifications.unread) : '',
        messageCount: '',
        profileName: getTalentProfile(live).navName,
      }
    : {
        streakCount: getTalentSidebarData(stateKey).streak,
        notificationCount: '5',
        messageCount: '5',
        profileName: TALENT_PROFILE.navName,
      };
