/*
 * flagsData — copy and mock data of the parent "Flags and corrections" screens (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 03 Flags and corrections" 10057:604).
 * Frames: PW-03 10034:4197 (Profile tab), PW-04 10034:5128 (flag dialog), PW-04b 10051:22618 (toast), PW-04c 10077:18202 (note too short), PW-05 10034:140037 (Flags tab),
 * PR-08 10057:893 (To review · Corrections), PW-06 10034:140801 (re-review dialog), PW-06b 10051:23020 (fix approved toast), PW-06c 10056:923 (flag again).
 * Mock only, shaped for an API swap. Every string is verbatim from Figma `characters`.
 * Marked blocks: PROFILE (the ward's profile fields), FLAGS (the three flags drawn on PW-05), COPY (dialogs, toasts, status key), REVIEW (the To review queue).
 * ⚠️ ASSUMPTION marks text the frames do not draw.
 */

/* ── PROFILE ─────────────────────────────────────────────────────────────── */
// PW-03: five groups; `badge` is a static chip drawn on the field (Python "Verified"); flag chips come from the flags store.
export const PROFILE_GROUPS = [
  {
    id: 'personal',
    label: 'Personal',
    fields: [
      { id: 'full-name', label: 'Full name', value: 'Abena Akosua Mensah' },
      { id: 'dob', label: 'Date of birth', value: '12 March 2010' },
      { id: 'region', label: 'Region', value: 'Greater Accra · Ayawaso' },
    ],
  },
  {
    id: 'education',
    label: 'Education',
    fields: [
      { id: 'school', label: 'School', value: 'Achimota School' },
      { id: 'programme', label: 'Programme', value: 'General Science · SHS 2' },
      { id: 'best-subjects', label: 'Best subjects', value: 'Elective Maths, Physics, ICT' },
    ],
  },
  {
    id: 'interests',
    label: 'Interests',
    fields: [
      { id: 'career-interests', label: 'Career interests', value: 'Software, Data, Medicine' },
    ],
  },
  {
    id: 'skills',
    label: 'Skills',
    fields: [
      { id: 'python', label: 'Python', value: 'Verified · Skills Lab 6/6', badge: 'Verified' },
      { id: 'public-speaking', label: 'Public speaking', value: 'Self-reported' },
    ],
  },
  {
    id: 'activities',
    label: 'Activities',
    fields: [
      { id: 'volunteering', label: 'Volunteering', value: 'Accra Library coding club · 2026' },
    ],
  },
];

/* ── FLAGS ───────────────────────────────────────────────────────────────── */
export const SEVERITIES = [
  { id: 'know', label: 'Just so you know' },
  { id: 'correcting', label: 'Needs correcting' },
  { id: 'critical', label: 'Critical' },
];

// PW-05 rows, in the drawn order. `icon` is fixed per flag (PW-06b keeps the refresh icon on the approved Date of birth row).
// `before` / `now` / `note` feed the PW-06 re-review dialog.
export const INITIAL_FLAGS = [
  {
    id: 'dob',
    fieldId: 'dob',
    label: 'Date of birth',
    icon: 'refresh',
    status: 'corrected',
    flaggedOn: '14 Oct',
    severity: 'correcting',
    note: 'Year should be 2010.',
    before: '12 March 2009',
    now: '12 March 2010',
  },
  {
    id: 'volunteering',
    fieldId: 'volunteering',
    label: 'Volunteering',
    icon: 'flag',
    status: 'pending',
    flaggedOn: 'today',
    severity: 'correcting',
    note: '',
  },
  {
    id: 'school',
    fieldId: 'school',
    label: 'School',
    icon: 'check',
    status: 'approved',
    flaggedOn: '3 Oct',
    severity: 'correcting',
    note: '',
    approvedOn: '4 Oct',
  },
];

// The Flags tab count chip: PW-02 / 03 / 04 / 05 / 06 draw 2, PW-04b draws 3 (after a send), PW-06b draws 1 (after an approval).
// The rows on PW-05 hold two open flags and PW-04b's three cannot be counted from the rows, so the chip is the drawn base plus one per send and minus one per approval.
export const FLAGS_BADGE_BASE = 2;

export const STATUS_LABEL = {
  pending: 'Pending',
  corrected: 'Corrected · check it',
  reflagged: 'Re-reviewing',
  approved: 'Approved',
};

// PW-05 "Flag statuses" key.
export const STATUS_KEY = [
  { status: 'pending', text: 'Abena hasn’t fixed it yet' },
  { status: 'corrected', text: 'She changed it — your turn' },
  { status: 'reflagged', text: 'You flagged it again' },
  { status: 'approved', text: 'Visible to recruiters again' },
];

/* ── COPY ────────────────────────────────────────────────────────────────── */
export const FLAGS_COPY = {
  rowSub: {
    // pending: PW-05 "Flagged today · Needs correcting · waiting for Abena"
    pending: (f, ward, severity) =>
      `Flagged ${f.flaggedOn} · ${severity.label} · waiting for ${ward.firstName}`,
    // corrected: PW-05 "Flagged 14 Oct · “Year should be 2010” · Abena changed it today"
    corrected: (f, ward) =>
      `Flagged ${f.flaggedOn} · “${f.note.replace(/\.$/, '')}” · ${ward.firstName} changed it today`,
    // reflagged: ⚠️ ASSUMPTION — no frame draws this row; same shape as the pending row.
    reflagged: (f, ward) =>
      `Flagged ${f.flaggedOn} · you flagged it again · waiting for ${ward.firstName}`,
    // approved: PW-05 "Flagged 3 Oct · fixed and approved 4 Oct", PW-06b "Flagged 14 Oct · fixed and approved today"
    approved: (f) => `Flagged ${f.flaggedOn} · fixed and approved ${f.approvedOn}`,
  },
  profileChip: {
    corrected: 'Corrected · re-review',
    pending: 'Flagged by you',
    // ⚠️ ASSUMPTION: a re-flagged field reads as flagged by the parent again.
    reflagged: 'Flagged by you',
  },
  field: {
    title: (label) => `Flag “${label}”`,
    intro: (ward) =>
      `${ward.firstName} will see your note and can fix it. You can’t change it yourself.`,
    current: 'Currently shows',
    severity: 'How important is it?',
    noteLabel: 'What’s wrong?',
    noteHelp: (ward) => `At least 10 characters. ${ward.firstName} sees this note.`,
    noteError: (ward) =>
      `Add a little more so ${ward.firstName} knows what to fix (at least 10 characters).`,
    hidden: 'This field is hidden from recruiters until you approve the fix.',
    cancel: 'Cancel',
    send: (ward) => `Send flag to ${ward.firstName}`,
  },
  again: {
    title: (label) => `Flag “${label}” again`,
    intro: (ward) =>
      `Tell ${ward.firstName} what’s still not right. It stays hidden from recruiters until you approve.`,
    noteLabel: 'What’s still wrong?',
    send: 'Send flag again',
  },
  recheck: {
    title: (label, ward) => `${ward.firstName} fixed “${label}”`,
    intro: 'Check the change. Approve it, or flag it again with a note.',
    before: 'Before',
    now: 'Now',
    note: (note) => `Your note: “${note}”`,
    again: 'Flag again',
    approve: 'Approve fix',
  },
  toast: {
    sent: (f, ward) => ({
      message: `Flag sent to ${ward.firstName}`,
      detail: `“${f.label}” is hidden from recruiters until you approve ${ward.possessive} fix.`,
      actionLabel: 'Undo',
    }),
    approved: (f, ward) => ({
      message: 'Fix approved',
      detail: `${ward.firstName}’s ${f.label.toLowerCase()} shows to recruiters again.`,
    }),
  },
  keyTitle: 'Flag statuses',
  minNote: 10,
};

/* ── REVIEW ──────────────────────────────────────────────────────────────── */
// PR-08 "To review": the waiting items other than corrections are not drawn, only their counts (tabs All 4 · Certificates 1 · Evaluations 1 · Corrections 1 · Payments 1).
export const REVIEW_COPY = {
  title: 'To review',
  intro: 'A few things need your OK. Everything else just keeps you informed.',
  tabs: [
    { id: 'all', label: 'All' },
    { id: 'certificates', label: 'Certificates', count: 1 },
    { id: 'evaluations', label: 'Evaluations', count: 1 },
    { id: 'corrections', label: 'Corrections' },
    { id: 'payments', label: 'Payments', count: 1 },
  ],
  // waiting items that are not corrections (Certificates 1 + Evaluations 1 + Payments 1)
  otherWaiting: 3,
  rowTitle: (f) => `${f.label} was corrected`,
  rowSub: (f, ward) => `${ward.firstName} · you flagged it ${f.flaggedOn}`,
  check: 'Check',
  // ⚠️ ASSUMPTION: once the correction is approved or flagged again the queue shows this note (no frame).
  empty: 'Nothing to check here.',
};
