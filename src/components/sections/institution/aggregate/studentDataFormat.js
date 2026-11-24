/*
 * studentDataFormat — how the institution portal prints figures in the aggregate student data mode (ADR-14).
 * The backend (GET /institution/progress/overview, utils/institutionStudentData.js) never sends a figure about 1-4 students: such a count,
 * share or average arrives as null, and a whole group of 1-4 students arrives with suppressed: true.
 */

export const MIN_GROUP = 5;

/** A count: null = 1-4 students, hidden so no one can be picked out. */
export const countText = (n) => (n == null ? '<5' : Number(n).toLocaleString('en-GB'));
/** The same for screen readers and sentences. */
export const countWords = (n) => (n == null ? 'fewer than 5' : Number(n).toLocaleString('en-GB'));
/** A share or an average in %: null = not enough students to show it. */
export const pctText = (n) => (n == null ? '–' : `${n}%`);

/** "Reminders sent to 7 students" / "… to fewer than 5 students" (the toast after a whole-roster action). */
export const studentsWords = (n) =>
  n > 0 && n < MIN_GROUP ? 'fewer than 5 students' : `${n} student${n === 1 ? '' : 's'}`;

/** Columns of the breakdown tables: [key, heading, kind]. */
export const COLUMNS = {
  students: [
    ['students', 'Students', 'count'],
    ['onGth', 'On GTH', 'count'],
    ['onGthPct', 'Linked', 'pct'],
    ['waiting', 'Invited, not joined', 'count'],
    ['under18', 'Under 18', 'count'],
    ['consentAgreed', 'Guardian agreed', 'count'],
  ],
  progress: [
    ['students', 'Students', 'count'],
    ['counted', 'Counted', 'count'],
    ['avgProfile', 'Average profile', 'pct'],
    ['withSkillsPct', 'Evidenced skill', 'pct'],
    ['onTrack', 'On track', 'count'],
    ['needSupport', 'Need support', 'count'],
    ['inactive', 'Inactive 30+ days', 'count'],
  ],
};
COLUMNS.home = COLUMNS.students.filter(([k]) => k !== 'waiting');

/** Which breakdowns each view shows (the backend leaves "level" out when no roster row has one). */
export const GROUPS = {
  students: ['yearGroup', 'programme', 'level', 'age'],
  progress: ['yearGroup', 'programme', 'level', 'region'],
  home: ['yearGroup'],
};
