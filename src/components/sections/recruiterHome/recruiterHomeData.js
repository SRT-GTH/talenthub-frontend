/*
 * recruiterHomeData.js — verbatim content for the recruiter dashboard home.
 * Source: Figma file Bin8roWL8sloyc36IgFMuT, frame 7249:73882
 * ("Recruiter Home-Existing user"), content column 7249:73913.
 *
 * Every string below is the node's exact `characters` value pulled from the
 * Figma REST API — including two deliberate-looking oddities that are
 * preserved rather than "cleaned up":
 *   • DOUBLE SPACES in the "Get ready" subtitle ("job matches  in any order")
 *     and the "Coming up" subtitle ("turns these on  no pressure") — both are
 *     literally two spaces in Figma (7249:73970 / 7249:74008).
 *   • A trailing newline on the KYB/KYC description (7249:74003), which is
 *     what makes that row 78px tall instead of 60px. HTML collapses it, so the
 *     row height is set explicitly instead.
 *
 * `titleCase: true` marks nodes carrying Figma `textCase: TITLE`. Figma stores
 * those characters in sentence case and renders them capitalised, so the
 * verbatim string is kept here and `capitalize` is applied at render — that
 * way the data stays faithful to Figma AND the output matches the design.
 *
 * No recruiterHome service exists yet (Theme 6 / Epic 6.1.1 is still a planned
 * integration), so this is static demo content, same approach as
 * communityData.js.
 */

// Figma 7249:73914
export const WELCOME_HERO = {
  headline: 'Welcome to Ghana Talent Hub, Joel 👋',
  subtitle:
    "Here's how your hiring is going — 3 active postings, 12 new applicants this week, and 2 candidates awaiting review.",
  customizeLabel: 'Customize',
};

// Figma 7249:73932 — four tinted quick-action cards. `tintClass` / `iconClass`
// map the per-card Figma fills and icon stroke colours.
//
// `to` sends the card into the existing profile-filling flow. Figma ships no
// destination frames for these, so only the two with a real counterpart in the
// app are wired: "Complete profile" → the Career Buddy profile-filling entry,
// and "Post a job" → the recruiter Career Buddy post-a-job flow. "Search
// Talents" and "Review Pipeline" have no screens anywhere in the app yet, so
// they stay inert and log their intent rather than navigating somewhere wrong.
export const QUICK_ACTIONS = [
  {
    id: 'complete-profile',
    title: 'Complete profile',
    titleCase: true,
    meta: '1 section left',
    tintClass: 'bg-brand-green-light',
    iconClass: 'text-brand-green-active',
    to: '/profile/filling/career-buddy',
    figmaNode: '7249:73933',
  },
  {
    id: 'search-talents',
    title: 'Search Talents',
    titleCase: true,
    meta: '1,402 matched',
    tintClass: 'bg-informative-light',
    // #0369a1 — a one-off icon stroke, not part of any Figma colour family.
    iconClass: 'text-[#0369a1]',
    figmaNode: '7249:73941',
  },
  {
    id: 'review-pipeline',
    title: 'Review Pipeline',
    titleCase: true,
    meta: '2 awaiting review',
    tintClass: 'bg-brand-green-light',
    // #3f6212 — one-off olive icon stroke, no matching token.
    iconClass: 'text-[#3f6212]',
    figmaNode: '7249:73949',
  },
  {
    id: 'post-a-job',
    title: 'Post a job',
    titleCase: true,
    meta: '3 active',
    tintClass: 'bg-purple-secondary-light',
    iconClass: 'text-purple-secondary-dark',
    to: '/profile/filling/recruiter-buddy',
    figmaNode: '7249:73958',
  },
];

// Figma 7249:73965. Progress fill is 80px on a 1295px track → 6.177%.
export const GET_READY = {
  title: "Let's get you ready",
  titleCase: true,
  subtitle: 'Finish these to unlock your job matches  in any order.',
  badge: '1 of 5 · nice start!',
  progressPercent: (80 / 1295) * 100,
  items: [
    {
      id: 'create-account',
      title: 'Create your account',
      // Figma styleOverrideTable["1"].textDecoration = STRIKETHROUGH
      struck: true,
      done: true,
      trailingLabel: 'Done',
      figmaNode: '7249:73976',
    },
    {
      id: 'company-profile',
      title: 'Complete company profile',
      titleCase: true,
      description: 'Builds trust with candidates',
      action: 'Add skills',
      actionTo: '/profile/filling/skills',
      figmaNode: '7249:73983',
    },
    {
      id: 'first-job',
      title: 'Post your first job',
      titleCase: true,
      description: 'Shows recruiters your background',
      trailingLabel: '3 min',
      figmaNode: '7249:73993',
    },
    {
      id: 'kyb-kyc',
      title: 'Upload KYB/KYC documents',
      titleCase: true,
      description: 'Optional — build trust with a verified badge',
      trailingLabel: '10 min',
      // Figma row is 78px (not 60px) because the description carries a
      // trailing newline that HTML collapses — pinned explicitly.
      tall: true,
      figmaNode: '7249:73999',
    },
  ],
};

// Figma 7249:74005. Card progress fills are 34px and 45px on a 56px track.
export const COMING_UP = {
  title: 'Unlocks as you build your profile',
  titleCase: true,
  subtitle: 'A complete profile turns these on  no pressure, they’ll be here when you’re ready.',
  lockedLabel: 'Locked',
  cards: [
    {
      id: 'top-talent-matches',
      icon: 'sparkle',
      title: 'Top Talent Matches',
      titleCase: true,
      description: 'See which candidates best match your job requirements',
      percentLabel: '60%',
      percent: (34 / 56) * 100,
      unlockLabel: 'Unlocks at 60% profile',
      figmaNode: '7249:74010',
    },
    {
      id: 'verified-employer-badge',
      icon: 'shield',
      title: 'Verified Employer Badge',
      description: "Show candidates you're a trusted, verified company",
      percentLabel: '60%',
      percent: (34 / 56) * 100,
      unlockLabel: 'Unlocks at 60% profile',
      figmaNode: '7249:74029',
    },
    {
      id: 'recruiter-interest',
      icon: 'visibility',
      title: 'Recruiter interest',
      description: 'Rank higher when candidates search for employers',
      percentLabel: '80%',
      percent: (45 / 56) * 100,
      unlockLabel: 'Unlocks at 80% profile',
      figmaNode: '7249:74049',
    },
  ],
};

// Figma 7249:73914 + 7249:73974 (V2.0, 3 Nov) — the hero and the Get-ready progress fill share one gradient:
// Forest Green #1f4a2b (stop 0) -> #3f7f4c (stop 1). Handles (0.146,0.146) -> (0.853,0.853) across a 1329x176 box resolve to ~97.5deg
// in CSS terms; the stop percentages follow the handle positions. (The 3 Oct build used #387440 -> #84cc16; Figma replaced it.)
export const HERO_GRADIENT = 'linear-gradient(97.54deg, #1f4a2b 14.637%, #3f7f4c 85.349%)';

/*
 * ---- Existing-user home (V2.0 frames 8063:45341, 8193:78567, 8193:79434, 8193:80078) ----
 * Shaped like the future API payload (GET /recruiter/home?user=existing -> hiring overview + applicants page).
 * All strings are the Figma node `characters`, verbatim.
 */

// Figma 8080:49909 (stats card) + 8080:49927 (recommendation card)
export const HIRING_OVERVIEW = {
  sortLabel: 'Sort by Match',
  stats: [
    { id: 'total-applicants', label: 'Total Applicants', value: '128', valueColor: '#00522b' },
    { id: 'screening', label: 'Screening', value: '42', valueColor: '#43664d' },
    { id: 'average-match', label: 'Avg. Match', value: '84%', valueColor: '#43664d' },
  ],
  nextStepRecommendation: {
    label: 'Next Step Recommendation',
    title: 'Schedule Panel Interviews',
    description: 'Top 5 candidates have passed technical screening.',
  },
};

// Figma 8121:19114 table header
export const APPLICANT_TABLE_COLUMNS = {
  applicantName: 'Applicant Name',
  currentStage: 'Current Stage',
  matchScore: 'Match Score',
  appliedDate: 'Applied Date',
  actions: 'Actions',
};

// Stage pill look per stage (Figma 8155:27469 interview/screening, 8155:27475 accepted, 8121:19223 rejected).
export const APPLICANT_STAGES = {
  interview: { label: 'Interview', pillClass: 'border-[#e8e8e4] bg-[#f8f8f4] text-[#737373]' },
  screening: { label: 'Screening', pillClass: 'border-[#e8e8e4] bg-[#f8f8f4] text-[#737373]' },
  accepted: { label: 'Accepted', pillClass: 'border-[#e1eae2] bg-[#f3f8f4] text-[#2a5730]' },
  rejected: { label: 'Rejected', pillClass: 'border-[#ebc2bd] bg-[#f9ebea] text-[#902b20]' },
};

// Figma 8121:19129 body rows. `matchBarFillPercent` is the bar fill AS DRAWN (42/48, 37/48, 45/48, 12/48 px): it does not equal the score for
// 82% and 15% in Figma, so it is kept separate from `matchScorePercent` (which is the number shown).
export const APPLICANTS_PAGE = {
  applicants: [
    {
      id: 'elena-sterling',
      initials: 'ES',
      avatarClass: 'bg-[#c1e9c9] text-[#43664d]',
      name: 'Elena Sterling',
      headline: 'Formerly at Vercel • 8 yrs exp.',
      stage: 'interview',
      matchScorePercent: 88,
      matchBarFillPercent: (42 / 48) * 100,
      matchColor: '#00522b',
      appliedDate: 'Oct 24, 2026',
    },
    {
      id: 'marcus-jensen',
      initials: 'MJ',
      avatarClass: 'bg-[#a7f4bb] text-[#00522b]',
      name: 'Marcus Jensen',
      headline: 'Freelance Architect • 5 yrs exp.',
      stage: 'screening',
      matchScorePercent: 82,
      matchBarFillPercent: (37 / 48) * 100,
      matchColor: '#43664d',
      appliedDate: 'Oct 25, 2026',
    },
    {
      id: 'leila-wong',
      initials: 'LW',
      avatarClass: 'bg-[#ffddb6] text-[#633e00]',
      name: 'Leila Wong',
      headline: 'Senior Dev at Shopify • 10 yrs exp.',
      stage: 'accepted',
      matchScorePercent: 94,
      matchBarFillPercent: (45 / 48) * 100,
      matchColor: '#00522b',
      appliedDate: 'Oct 26, 2026',
    },
    {
      id: 'arthur-blair',
      initials: 'AB',
      avatarClass: 'bg-[#e4e2dd] text-[#6b6a63]',
      name: 'Arthur Blair',
      headline: 'Junior Dev at Bloom • 2 yrs exp.',
      stage: 'rejected',
      matchScorePercent: 15,
      matchBarFillPercent: (12 / 48) * 100,
      matchColor: '#b23b3b',
      appliedDate: 'Oct 27, 2026',
    },
  ],
  pagination: {
    summary: 'Showing 1 to 4 of 42 applicants',
    previousLabel: 'Previous',
    nextLabel: 'Next',
    pages: [1, 2, 3],
    currentPage: 1,
  },
};

// Row-action menu per applicant stage. Figma 8193:79206 (interview), 8193:79366 (screening), 8193:79660 (accepted), 8193:80703 (rejected).
// `widthPx` = the menu panel width as drawn (164, or 153 for the single "Reconsider" row); `iconGapPx` = icon/label gap (8 in the first two
// menus, 6 in the last two). `iconKey` maps to recruiterHomeApplicantIcons.jsx; `tone: 'danger'` = #c0392b text + icon, `'muted'` = #70706e text.
// The label 'Reshedule interview' (sic) is the node text, kept as drawn (Figma typo) — ⚠️ confirm the intended spelling with design.
export const APPLICANT_ROW_MENU_BY_STAGE = {
  interview: {
    widthPx: 164,
    iconGapPx: 8,
    actions: [
      { id: 'extend-offer', label: 'Extend Offer', iconKey: 'extend-offer' },
      { id: 'mark-as-accepted', label: 'Mark as Accepted', iconKey: 'mark-as-accepted' },
      {
        id: 'reschedule-interview',
        label: 'Reshedule interview',
        iconKey: 'reschedule-interview-clock',
      },
      { id: 'reject', label: 'Reject', iconKey: 'reject', tone: 'danger' },
    ],
  },
  screening: {
    widthPx: 164,
    iconGapPx: 8,
    actions: [
      { id: 'shortlist', label: 'Shortlist', iconKey: 'shortlist' },
      {
        id: 'reschedule-interview',
        label: 'Reshedule interview',
        iconKey: 'reschedule-interview-add',
      },
      { id: 'reject', label: 'Reject', iconKey: 'reject', tone: 'danger' },
    ],
  },
  accepted: {
    widthPx: 164,
    iconGapPx: 6,
    actions: [
      { id: 'message-candidate', label: 'Message candidate', iconKey: 'message-candidate' },
      { id: 'undo', label: 'Undo', iconKey: 'undo', tone: 'danger' },
    ],
  },
  rejected: {
    widthPx: 153,
    iconGapPx: 6,
    actions: [{ id: 'reconsider', label: 'Reconsider', iconKey: 'reconsider', tone: 'muted' }],
  },
};
