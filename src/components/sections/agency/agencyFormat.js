/*
 * agencyFormat.js — number / date formatting of the Theme 11 agency screens.
 * Counts go through Theme 8's formatCount() / safeShare(): under 5 reads "<5", always (privacy rule of the whole programme).
 */

export {
  SUPPRESSION_THRESHOLD,
  isSuppressed,
  formatCount,
  formatGhs,
  formatPercent,
  formatChange,
  safeShare,
} from '../publicData/publicDataFormat.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const toDate = (value) => (value instanceof Date ? value : new Date(`${value}T00:00:00`));

/** 142, 220 → 64 (whole percent, clamped to 0-100). */
export const quotaPercent = (used, limit) => {
  if (!limit || limit <= 0) return 0;
  return Math.max(0, Math.min(100, Math.floor((used / limit) * 100)));
};

/** 142, 220 → "142 of 220". */
export const formatQuota = (used, limit) => `${used} of ${limit}`;

/** "2026-10-18" or a Date → "Oct 18, 2026" (saved-query table, Figma "Oct 18, 2026"). */
export const formatDate = (value) => {
  const d = toDate(value);
  if (Number.isNaN(d.getTime())) return '–';
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

/** "2026-10-18" → "18 Oct 2026" (prose dates: "Data as of 18 Oct 2026"). */
export const formatDateLong = (value) => {
  const d = toDate(value);
  if (Number.isNaN(d.getTime())) return '–';
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

/** "2027-10-31" → "Oct 2027" (MoU "access until Oct 2027"). */
export const formatMonthYear = (value) => {
  const d = toDate(value);
  if (Number.isNaN(d.getTime())) return '–';
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};
