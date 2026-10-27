/*
 * progressData.js — copy of the institution "Progress" screens (Figma 11.3.2a-e: students list 8595:92, student detail 8595:653, flag 8595:1413,
 * class outcomes 8745:47, download 8745:822). Live data: GET /institution/progress/students?form=, /progress/students/:id,
 * POST|DELETE /progress/students/:id/flag, GET /progress/outcomes?period=, POST /progress/outcomes/export (services/institutionPortal.api.js).
 */

/* ---- BLOCK 1 · list page ---- */
export const PROGRESS_COPY = {
  title: 'Progress',
  subtitle:
    'How your students are doing on GTH: profiles, skills evidenced, Skills Lab and applications. Under-18s show only with a guardian’s agreement.',
  banner: (n) =>
    `${n} ${n === 1 ? 'student hasn’t' : 'students haven’t'} opened GTH in 30 days. Flag them for a coaching chat.`,
  exportLabel: 'Export report',
};

export const PROGRESS_FORMS = [
  { id: 'form-1', api: '1', label: 'Form 1' },
  { id: 'form-2', api: '2', label: 'Form 2' },
  { id: 'form-3', api: '3', label: 'Form 3' },
  { id: 'graduates', api: 'graduates', label: 'Graduates' },
];

export const PROGRESS_FILTERS = [
  { id: 'all', label: 'All', count: 'all' },
  { id: 'on-track', label: 'On track', count: 'onTrack' },
  { id: 'needs-support', label: 'Needs support', count: 'support' },
];

export const PROGRESS_SORTS = [
  { id: 'lowest', label: 'Lowest first' },
  { id: 'highest', label: 'Highest first' },
  { id: 'name', label: 'Name A–Z' },
];

/* "On track" / "needs support": the rule the backend applies, shown on the student page. */
export const PROGRESS_RULE =
  'A student needs support when they haven’t opened GTH for 30 days or their profile is under 50% complete.';

export const FLAG_COPY = {
  title: (first) => `Flag ${first} for coaching?`,
  body: (first) =>
    `Your staff see the flag on the progress list until someone clears it. ${first} isn’t told they were flagged.`,
  confirm: 'Flag for coaching',
  cancel: 'Cancel',
};

/* ---- BLOCK 2 · class outcomes (8745:47) ---- */
export const OUTCOMES_PAGE = {
  title: 'Class outcomes',
  subtitle: (name) =>
    `Where ${name || 'your'} students go next. Only your students linked to GTH are counted, and groups under 5 are hidden.`,
  download: 'Download report',
  periods: [
    { id: 'term', label: 'This term' },
    { id: 'year', label: 'Last 12 months' },
    { id: 'all', label: 'All time' },
  ],
};

/* ---- BLOCK 3 · download dialog (8745:822) ---- */
export const DOWNLOAD_COPY = {
  chip: 'Outcomes report',
  title: 'Download the class outcomes report',
  body: 'A dated CSV for your board, PTA or GES district office. Under-18s count only with a guardian’s agreement and the download is logged with your name.',
  options: [
    {
      id: 'readiness',
      label: 'Readiness by form and programme',
      detail: 'Students counted, average profile and evidenced skills per group',
      on: true,
    },
    {
      id: 'names',
      label: 'Student names',
      detail: 'Off by default. Turn on only for internal use. Admins and records officers only.',
      on: false,
    },
  ],
  periodLabel: 'Period',
  cancel: 'Cancel',
  submit: 'Download CSV',
};
