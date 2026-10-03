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

// Figma 7249:73914 + 7249:73974 — the brand gradient, same two stops the
// sidebar already uses (DashboardSidebar GREEN_GRADIENT / BADGE_GRADIENT),
// at this frame's own angle. Figma handles (0.146,0.146) → (0.853,0.853)
// across a 1329x176 box resolve to ~97.5deg in CSS terms; the stop
// percentages follow the handle positions, matching the existing constants'
// convention.
export const HERO_GRADIENT = 'linear-gradient(97.54deg, #387440 14.637%, #84cc16 85.349%)';
