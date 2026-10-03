/*
 * scheduleInterviewData.js — verbatim content for the Schedule Interview
 * modals. Source: Figma Bin8roWL8sloyc36IgFMuT, frames
 *
 *   7249:80368  empty state                      1219x695
 *   7249:80974  empty + interviewer input open   1219x721
 *   7249:81591  filled — Online format           1219x797
 *   7249:83784  filled — Phone format            1219x797
 *   7249:83147  filled — In person format        1219x797
 *   7249:82225  Cancel this Interview?            528x303
 *   7249:82686  Schedule this Interview?          528x303
 *
 * Every string is the node's exact `characters`. The three filled frames are
 * the SAME modal with a different Interview Format selected — only the
 * format-specific field row changes — so they are one component with a
 * `format` state rather than three screens.
 */

export const SCHEDULE_HEADER = {
  title: 'Schedule an Interview',
  subtitle: 'Set up a session with Ama Boateng for the Senior Product Designer role.',
};

// Figma 7249:80374 — the candidate card at the top of the left column.
export const SCHEDULE_CANDIDATE = {
  name: 'Ella Mensah',
  meta: 'Senior Product Designer • Accra, Ghana',
  chips: [
    { id: 'match', label: '91% Match', tone: 'green' },
    { id: 'portfolio', label: 'Portfolio Reviewed', tone: 'neutral' },
  ],
};

export const FIELD_LABELS = {
  assessmentType: 'Assessment Type',
  interviewFormat: 'Interview Format',
  addInterviewers: 'Add Interviewers',
  recruiterNotes: 'Add Recruiter Notes',
  optional: 'Optional',
  required: '*',
};

export const ASSESSMENT_PLACEHOLDER = 'Select Assessment type';
// The value the three filled frames show in that select.
export const ASSESSMENT_FILLED = 'Technical Portfolio Review';

export const NOTES_PLACEHOLDER =
  'Add key notes about Ama Boateng to help you remember important details';

// Figma 7249:80412 — three format pills. Active is #ebf1ec/#e1eae2/#2a5730,
// inactive #f8f8f4/#e8e8e4/#737373.
export const INTERVIEW_FORMATS = [
  { id: 'online', label: 'Online' },
  { id: 'phone', label: 'Phone' },
  { id: 'in-person', label: 'In person' },
];

// The extra field row each format reveals once chosen (7249:81650 / :83784 /
// :83147). Figma gives no option list for the selects, only the shown value.
export const FORMAT_FIELDS = {
  online: {
    kind: 'online',
    platformLabel: 'Online Platform',
    platformValue: 'Google Meet',
    linkLabel: 'Meeting Link',
    linkValue: 'https://meet.google.com/xxxxxxx',
  },
  phone: {
    kind: 'phone',
    toggleLabel: 'Use recruiter’s phone',
    dialCode: '+233',
    number: '54 905 8090',
  },
  'in-person': {
    kind: 'in-person',
    locationLabel: 'Location',
    toggleLabel: 'Use recruiter’s address',
    address: 'Circle Mall Opposite Kfc Building',
  },
};

// Figma 7249:80974 — the interviewer row once the add button is pressed.
export const INTERVIEWER_INPUT = {
  placeholder: 'Enter Interviewer name',
  add: 'Add',
  save: 'Save',
};

// Figma 7249:81675 — shown in place of the notes textarea once notes exist.
export const RECRUITER_NOTES = {
  heading: 'Recruiter Notes',
  edit: 'Edit',
  body: '"Ama is looking for a role that offers high autonomy\nand design system leadership. She mentioned she\'s\nmost available during early mornings GMT."',
};

export const SLOTS_PANEL = {
  heading: 'Available Slots',
  month: 'August',
  year: '2026',
  dayLabel: 'Day',
  timeLabel: 'Select Time (GMT)',
};

// Figma 7249:80474-:80491 — SUN and MON are drawn at NODE opacity 0.50, i.e.
// unavailable; the selected day takes a #f3f8f4 fill.
export const SCHEDULE_DAYS = [
  { id: 'sun-04', weekday: 'SUN', date: '04', disabled: true },
  { id: 'mon-05', weekday: 'MON', date: '05', disabled: true },
  { id: 'tue-06', weekday: 'TUE', date: '06' },
  { id: 'wed-07', weekday: 'WED', date: '07' },
  { id: 'thu-08', weekday: 'THU', date: '08' },
  { id: 'fri-09', weekday: 'FRI', date: '09' },
];

/*
 * Option lists for the three selects. Figma draws only the CLOSED fields, so
 * these are INFERRED, not sourced - except the first assessment entry, which is
 * the value the filled frames show verbatim ('Technical Portfolio Review').
 */
export const ASSESSMENT_OPTIONS = [
  ASSESSMENT_FILLED,
  'Design Challenge Review',
  'Behavioural Interview',
  'Culture Fit Conversation',
  'Final Panel Interview',
];

export const MONTH_OPTIONS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const YEAR_OPTIONS = ['2026', '2027'];

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// Six consecutive days from the 4th, mirroring the six Figma draws. August 2026
// returns Figma's own verbatim set (including its disabled SUN/MON); any other
// month is derived from the real calendar with every day available.
export const buildScheduleDays = (month, year) => {
  if (month === 'August' && year === '2026') return SCHEDULE_DAYS;
  const monthIndex = MONTH_OPTIONS.indexOf(month);
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(Number(year), monthIndex, 4 + i);
    const date = String(d.getDate()).padStart(2, '0');
    const weekday = WEEKDAYS[d.getDay()];
    return { id: `${weekday.toLowerCase()}-${date}`, weekday, date };
  });
};

// Figma 7249:80499 onwards — 10:00 AM, 11:30 AM and 09:00 AM are drawn at NODE
// opacity 0.40 (unavailable). Order is Figma's own grid order, which does put
// 09:00 AM last. The selected slot takes a #387440 fill.
export const SCHEDULE_TIMES = [
  { id: '1000', label: '10:00 AM', disabled: true },
  { id: '1130', label: '11:30 AM', disabled: true },
  { id: '1300', label: '01:00 PM' },
  { id: '1400', label: '02:00 PM' },
  { id: '1530', label: '03:30 PM' },
  { id: '1600', label: '04:00 PM' },
  { id: '1730', label: '05:30 PM' },
  { id: '0900', label: '09:00 AM', disabled: true },
];

// Figma 7249:81755 — appears once a day + time are both chosen.
export const TENTATIVE = {
  label: 'Tentative Selection',
  clear: 'Clear',
  // Figma shows "Aug 04, 2024" even though the month/year selects read
  // August / 2026 — a demo-data inconsistency, kept verbatim in the template.
  format: (time) => `Aug 04, 2024 at ${time} (GMT)`,
};

export const SCHEDULE_ACTIONS = { cancel: 'Cancel', submit: 'Schedule Interview' };

// Figma 7249:82225 and 7249:82686 — both 528x303, r24, padding 48/64.
export const CANCEL_CONFIRMATION = {
  title: 'Cancel this Interview?',
  body: 'Once canceled, all progress will be lost. You can reopen it anytime.',
  confirmLabel: 'Yes, cancel interview',
  cancelLabel: 'No, keep editing',
  tone: 'danger',
};

export const SCHEDULE_CONFIRMATION = {
  title: 'Schedule this Interview?',
  body: 'Once scheduled, the user will receive an email containing the details of the interview schedule. You can cancel it anytime.',
  confirmLabel: 'Schedule Interview',
  cancelLabel: 'No, keep editing',
  tone: 'brand',
};
