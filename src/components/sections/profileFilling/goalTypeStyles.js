// Shared data + small helpers for the Goals ("Desired Career Options")
// profile-filling flow — split into its own file (like certTypeStyles.js /
// workRoleStatusStyles.js / portfolioProjectTypeStyles.js) because a
// component file may only export components under this project's
// react-refresh lint rule; plain data/constants need a separate module.
//
// Every string below is either reproduced verbatim from a real
// `get_design_context` dive (file key Bin8roWL8sloyc36IgFMuT, 2026-09-09 —
// see wiki/figma-node-map.md § "Goals — profile filling page flow" for the
// node inventory) or explicitly flagged as an extrapolation.

// "Industry / sector" Select options — Figma's own field (5622:90394) only
// ever renders the "Select…" placeholder, so it gives no option list. These
// five values are the industries that literally appear in the populated
// list's own card titles (5622:89446 / 89482 / 89518 / 89554 / 89590,
// ✅ VERIFIED verbatim): "Software Engineer — Fintech", "Data Analyst :
// E-commerce", "UX/UI Designer : Technology", "Product Manager : Health
// Tech", "Digital Marketing Specialist : Startups".
// ⚠️ ASSUMPTION: this list is certainly NOT exhaustive — it is the complete
// set of industry strings Figma actually shows, nothing more.
export const INDUSTRY_OPTIONS = ['Fintech', 'E-commerce', 'Technology', 'Health Tech', 'Startups'];

// "Opportunity type" Select options (Section 1, Figma 5622:90157). Again the
// dropdown itself only shows "Select…", so these come from the values Figma
// actually renders elsewhere: the blue informative chip on every populated
// goal card is "Full-time job" (5622:89462 etc.) or "Contract"
// (5622:89606) — both ✅ VERIFIED verbatim — and the success modal's own
// mini-list (5619:83108) shows a third real value, "Postgrad study".
// ⚠️ ASSUMPTION: not exhaustive, same caveat as INDUSTRY_OPTIONS.
export const OPPORTUNITY_TYPES = ['Full-time job', 'Contract', 'Postgrad study'];

// Section 2's SECOND select (Figma 5622:90415/90420/90424).
//
// ❓ NEEDS-CLARIFICATION — the biggest unresolved question in this whole
// flow, flagged rather than silently "fixed":
//   * Figma labels this field "Opportunity type" with a default value of
//     "Any type" — i.e. literally the same label as Section 1's own
//     "Opportunity type" select, inside a section titled "Location &
//     timeline".
//   * Yet every populated goal card renders a THIRD chip holding a timeline
//     value — "Within 6 months" / "Within 3 months" / "Within 4 months" /
//     "Immediately" / "Within 2 months" (5622:89466 / 89502 / 89538 /
//     89574 / 89610, all ✅ VERIFIED verbatim) — and no field anywhere in
//     the Add/Edit modal produces such a value.
//   * The intro page's own stage card #3 ("Location preferences",
//     5619:81224) also describes a per-goal setting, and the aside's
//     "What counts?" list item reads "Location & timeline" (5619:81579).
// Resolution: the field is wired to the card's timeline chip (the only
// evidenced consumer), but its LABEL and PLACEHOLDER stay Figma-verbatim
// ("Opportunity type" / "Any type") per the never-invent-copy rule. The
// options below are exactly the five timeline strings Figma's own cards
// contain — no invented values. A designer needs to confirm whether the
// label is a clone leftover that should read "Timeline".
export const TIMEFRAME_OPTIONS = [
  'Immediately',
  'Within 2 months',
  'Within 3 months',
  'Within 4 months',
  'Within 6 months',
];

// "★ Primary" chip on the delete modal's preview card (Figma 5625:92808/
// 92809) — informative-blue, ✅ VERIFIED. Shares the exact palette the goal
// cards' own opportunity-type chip uses (#eaeffb / #bfcef2 / #3062d4).
export const PRIMARY_BADGE_STYLE = { bg: '#eaeffb', border: '#bfcef2', text: '#3062d4' };

// Neutral chip palette used by the location + timeline chips on every goal
// card (Figma 5622:89463/89465 etc.) — ✅ VERIFIED.
export const NEUTRAL_CHIP_STYLE = { bg: '#f8f8f4', border: '#e8e8e4', text: '#70706e' };

// "● Active" pill on the delete modal's preview card (Figma 5625:92804/
// 92805) — ✅ VERIFIED (#ebf1ec / #c1d4c4 / #2a5730).
export const ACTIVE_BADGE_STYLE = { bg: '#ebf1ec', border: '#c1d4c4', text: '#2a5730' };

/*
 * "GHS 3,000 – 6,000/mo" — ✅ VERIFIED verbatim format from every populated
 * goal card (Figma 5622:89452 / 89488 / 89524 / 89560 / 89596). The en-dash
 * and the "/mo" suffix are Figma's own.
 *
 * ⚠️ ASSUMPTION on the min-only fallback ("GHS 3,000+/mo"): the salary
 * fields are individually optional-ish (see AddEditGoalModal's header
 * comment on the asterisk/either-or judgment call), so a min-only goal is
 * reachable, but Figma never renders that state. The "+" suffix follows the
 * success modal's own "GHS 4,000+/mo" string (5619:82959), so it is at
 * least grounded in a real Figma string rather than invented.
 */
export const buildSalarySummary = (salaryMin, salaryMax) => {
  const min = salaryMin?.trim();
  const max = salaryMax?.trim();
  if (min && max) return `GHS ${min} – ${max}/mo`;
  if (min) return `GHS ${min}+/mo`;
  if (max) return `GHS up to ${max}/mo`;
  return null;
};

/*
 * "Full-time · Accra or Remote · GHS 3,000–6,000/mo" — the one-line summary
 * under the goal title inside the DELETE modal's preview card. ✅ VERIFIED
 * verbatim from Figma 5625:92799 (note: that string drops the " job" suffix
 * from the opportunity type and the spaces around the dash in the salary,
 * both reproduced here).
 */
export const buildGoalSummaryLine = (goal) => {
  if (!goal) return '';
  const opportunity = goal.opportunityType?.replace(/ job$/, '') || null;
  const salary = buildSalarySummary(goal.salaryMin, goal.salaryMax)?.replace(' – ', '–') ?? null;
  return [opportunity, goal.location, salary].filter(Boolean).join(' · ');
};
