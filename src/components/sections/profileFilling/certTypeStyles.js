// Shared data + small helpers for the Certifications profile-filling flow —
// split into its own file (like workRoleStatusStyles.js / portfolioProjectTypeStyles.js)
// because a component file may only export components under this project's
// react-refresh lint rule; plain data/constants need a separate module.

// "Credential type" Select options — Figma's field (5249:171755, Edit modal
// dive) shows "Online Course" as a live selected example; the populated list
// page's own example cards (get_metadata dive on 5217:124109, 2026-09-08)
// show TWO distinct type tags across the 5 examples — "Online course" and
// "Online certification" — used as genuinely different values (Google Data
// Analytics / Azure Fundamentals = "Online course"; AWS / Scrum / GCP =
// "Online certification"), so both are kept as separate options here rather
// than merged into one. The remaining options are invented-but-consistent
// (same convention as PROJECT_TYPES in portfolioProjectTypeStyles.js) since
// Figma's dropdown itself only ever shows the one live example value.
export const CREDENTIAL_TYPES = [
  'Online course',
  'Online certification',
  'Degree / Diploma',
  'Professional license',
  'Bootcamp',
  'Other',
];

// Verified vs self-reported badge styles — a certification is "Verified" once
// it has a Credential ID or a Badge/verify URL (per the Add modal's own
// verbatim tip copy, Figma 5249:171313/171314: "Add either a Credential ID
// ... or a badge verify link. GTH will mark the cert as Uploaded & verifiable
// and the disclaimer disappears.") — otherwise it's "Self-reported". Both
// ✅ VERIFIED via a real get_design_context dive on the success modal
// (5248:169003, 2026-09-09), which renders one of each badge.
export const VERIFIED_BADGE_STYLE = { bg: '#ebf1ec', border: '#c1d4c4', text: '#2a5730' };
export const SELF_REPORTED_BADGE_STYLE = { bg: '#faf4e8', border: '#eedeb8', text: '#c8951a' };

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// DatePicker stores dates as "DD/MM/YYYY" strings (see DatePicker.jsx) — the
// card/preview surfaces need Figma's own "Issued Mar 2024" / "Expires Jan
// 2027" short format instead. Returns null for anything unparsable so
// callers can fall back to a plain dash.
export const formatMonthYear = (ddmmyyyy) => {
  if (!ddmmyyyy) return null;
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(ddmmyyyy);
  if (!match) return null;
  const [, , month, year] = match;
  const monthIndex = Number(month) - 1;
  if (monthIndex < 0 || monthIndex > 11) return null;
  return `${MONTH_LABELS[monthIndex]} ${year}`;
};

// "Issued Mar 2024 · No expiry" / "Issued Jan 2024 · Expires Jan 2027" —
// verbatim phrasing pattern confirmed via get_metadata on all 5 populated
// example cards (2026-09-08).
export const buildDateSummary = (dateIssued, doesNotExpire, expiryDate) => {
  const issued = formatMonthYear(dateIssued);
  const expiry = doesNotExpire
    ? 'No expiry'
    : expiryDate
      ? `Expires ${formatMonthYear(expiryDate)}`
      : null;
  return [issued ? `Issued ${issued}` : null, expiry].filter(Boolean).join(' · ');
};
