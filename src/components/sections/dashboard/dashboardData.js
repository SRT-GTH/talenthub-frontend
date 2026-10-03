/*
 * dashboardData.js — content for the shared recruiter dashboard chrome
 * (top nav, left rail). Figma: the "Recruiter Home-Existing user" frame set —
 * `7025:85256` / `7025:85392` (community screens) and `7249:74069` /
 * `7249:74821` (recruiter home, talent search). Moved out of
 * communityData.js on 2026-10-01 when the chrome was renamed from
 * Community* to Dashboard*, since it is not community-specific.
 *
 * SIDEBAR_PROFILE.stats: the older 7025 frames carry a 4th "80% Profile"
 * stat; both newer 7249 frames drop it. Three is kept — the Profile
 * percentage duplicated the "Getting started 1 of 5" progress bar sitting
 * directly above it in the same card.
 *
 * SIDEBAR_PROFILE.meta: 7025 reads "Accra, Ghana", 7249 reads "Accra, GH".
 * The full country name is kept — it is unambiguous, matches the product's
 * own naming, and avoids a regression on the shipped community screens.
 */

/* ------------------------------------------------------------------ *
 * Left sidebar. `✅ VERIFIED` (7025:85256 expanded · 7025:86125 collapsed).
 *
 * ROLE NOTE — every sidebar string Figma provides is recruiter-specific
 * (HR Lead chip, Talent Search / Job Postings / Application Pipeline nav,
 * Active Jobs / Applicants stats, gth.com/recruiter/... URL, "Preview as
 * talent"). Figma ships NO talent or parent variant of this screen, so only
 * the `recruiter` dataset exists here. `DashboardShell` reads the app-root
 * CareerBuddyRoleContext and falls back to this dataset for other roles
 * with a debug warning rather than inventing copy. `❓ NEEDS-CLARIFICATION`
 * — a talent-side sidebar needs its own Figma frame.
 * ------------------------------------------------------------------ */
export const NAV_SEARCH_PLACEHOLDER = 'Search opportunities, skills, communities...';

export const SIDEBAR_PROFILE = {
  name: 'Joel Adade Kofie',
  badge: 'New',
  meta: 'HR Lead · Silver Rock Technology · Accra, Ghana',
  progressNote: '1 of 5 steps complete',
  gettingStartedLabel: 'Getting started',
  gettingStartedCount: '1 of 5',
  // Figma draws a 48px fill on a 250px track → 19.2%.
  gettingStartedPercent: 19.2,
  continueLabel: 'Continue setup →',
  stats: [
    { id: 'active-jobs', value: '47', label: 'Active Jobs' },
    { id: 'applicants', value: '128', label: 'Applicants' },
    { id: 'messages', value: '12', label: 'Messages' },
  ],
};

export const SIDEBAR_PUBLIC_PROFILE = {
  heading: 'Your public profile',
  url: 'gth.com/recruiter/kofi-agyekum',
  action: 'Preview as talent',
};

/* Top nav. `✅ VERIFIED` (7025:85392). */
export const TOP_NAV = {
  searchPlaceholder: NAV_SEARCH_PLACEHOLDER,
  shortcut: '⌘K',
  streakCount: '12',
  notificationCount: '5',
  messageCount: '5',
  language: 'EN',
  profileName: 'Kofi A.',
};
