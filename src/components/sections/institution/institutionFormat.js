/*
 * institutionFormat.js — number / date formatting of the Theme 11 institution screens.
 * Counts in AGGREGATES go through Theme 8's formatCount() / safeShare(): under 5 reads "<5", always (privacy rule of the whole programme).
 * Roster rows are the institution's own data and are drawn as in Figma (no suppression there).
 */

export {
  SUPPRESSION_THRESHOLD,
  isSuppressed,
  formatCount,
  formatPercent,
  formatChange,
  safeShare,
} from '../publicData/publicDataFormat.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const toDate = (value) => (value instanceof Date ? value : new Date(`${value}T00:00:00`));

/** "2026-10-19" or a Date → "19 Oct" (Figma "12 Oct", "Confirmed on 19 Oct"). */
export const formatDayMonth = (value) => {
  const d = toDate(value);
  if (Number.isNaN(d.getTime())) return '–';
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

/** "2026-10-19" → "19 Oct 2026". */
export const formatDateLong = (value) => {
  const d = toDate(value);
  if (Number.isNaN(d.getTime())) return '–';
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

/** "2027-10-31" → "Oct 2027" ("Renewal due in October 2027" uses the long month in the frames; this is the short form). */
export const formatMonthYear = (value) => {
  const d = toDate(value);
  if (Number.isNaN(d.getTime())) return '–';
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

/** 61, 100 → 61 (whole percent, clamped to 0-100). */
export const clampPercent = (value) => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
