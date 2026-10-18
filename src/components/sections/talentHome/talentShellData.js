import {
  TalentSidebarHomeNavIcon,
  TalentSidebarMyAssessmentNavIcon,
  TalentSidebarOpportunitiesNavIcon,
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
    tab: 'assessment',
  },
  { id: 'opportunities', label: 'Opportunities', icon: TalentSidebarOpportunitiesNavIcon },
  {
    id: 'community',
    label: 'Community',
    icon: TalentSidebarCommunityNavIcon,
    route: '/community',
  },
  { id: 'messages', label: 'Messages', icon: TalentSidebarMessagesNavIcon },
];

export const TALENT_NAV_SECONDARY = [
  { id: 'skills-lab', label: 'Skills Lab', icon: TalentSidebarSkillsLabNavIcon },
  { id: 'my-learning', label: 'My Learning', icon: TalentSidebarMyLearningNavIcon },
  { id: 'profile', label: 'Profile', icon: TalentSidebarProfileNavIcon },
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

const BY_STATE = { day1: DAY1, discoverable: DISCOVERABLE, complete: TOP, top: TOP };

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
  labels: { opportunities: 'Job Postings' },
  streak: '12',
};

/* `activeNav` ('profile') swaps in the profile-page rail data; omitted = the home data, unchanged. */
export const getTalentSidebarData = (stateKey = 'day1', activeNav) =>
  activeNav === 'profile' ? PROFILE_PAGE : (BY_STATE[stateKey] ?? DAY1);

/* Top nav counts (Nav 8315:461634: bell 5, messages 5; streak per state). */
export const getTalentNavData = (stateKey = 'day1') => ({
  streakCount: getTalentSidebarData(stateKey).streak,
  notificationCount: '5',
  messageCount: '5',
  profileName: TALENT_PROFILE.navName,
});
