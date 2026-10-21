/*
 * Talent Messages — job-proposal and interview cards inside a conversation (Figma "GTH · Job proposal card" component set
 * 7430:3311: State = Pending / Passing / Applied / Passed / Closed). Mock data shaped like the future API payload.
 * Package B owns this file and the components in this folder; package A only imports the exports below.
 * Shape (B may ADD fields, never rename): { id, state, company, role, badge, pickedForYou, tags[], matchPercent, skillsLabel }.
 */
export const JOB_CARD_PENDING = {
  id: 'job-farmerline-ds-intern',
  state: 'pending',
  company: 'Farmerline',
  role: 'Data Science Intern',
  badge: 'New',
  pickedForYou: true,
  tags: ['Remote-first', 'Internship', 'GHS 2,500–3,500 / mo'],
  matchPercent: 88,
  skillsLabel: '4 of 5 key skills',
};

/*
 * ---- Package B additions (add-only). Figma component set 7430:3311, copy verbatim from the node `characters`. ----
 * Fields added: `statusLabel` (the status tag), `reasons` (Passing: the optional-reason chips, `selectedReason` = the one
 * drawn selected), `reasonsPrompt` / `reasonsNote` (Passing copy), `applied` ({ label, action }), `closedNote`, `closedAction`.
 * Pending shows `badge` ('New'); Passing/Applied/Passed/Closed show `statusLabel`.
 * State changes (lead wires them): pending --Not interested--> passing --Pass on this role--> passed (Cancel -> pending);
 * pending --View and apply--> pre-apply dialog --Continue application--> applied.
 */
export const JOB_REASON_CHIPS = ['Not the right role', 'Location', 'Pay', 'Just looking'];

export const JOB_CARD_PASSING = {
  ...JOB_CARD_PENDING,
  state: 'passing',
  statusLabel: 'Passing',
  reasonsPrompt: 'Want to tell us why? (optional)',
  reasons: JOB_REASON_CHIPS,
  selectedReason: 'Location', // the chip drawn selected in Figma 7433:3312 (a demo selection, the user can change it)
  reasonsNote: 'Your reason stays private. It only helps us improve your matches.',
  passLabel: 'Pass on this role',
  cancelLabel: 'Cancel',
};

export const JOB_CARD_APPLIED = {
  ...JOB_CARD_PENDING,
  state: 'applied',
  statusLabel: 'Applied',
  applied: { label: 'You applied today', action: 'Track' },
};

// Passed state (component 7430:3242, no frame places it): copy read verbatim from the node via the Figma MCP (2026-10-20).
export const JOB_CARD_PASSED = {
  ...JOB_CARD_PENDING,
  state: 'passed',
  statusLabel: 'Passed',
  barWidth: '96.04%', // the drawn Passed bar (Figma); live cards use their own match %
  passedNote: 'You passed on this role. Farmerline only sees that you passed.',
};

export const JOB_CARD_CLOSED = {
  ...JOB_CARD_PENDING,
  state: 'closed',
  statusLabel: 'Closed',
  closedNote: 'This role closed on 20 Oct.',
  closedAction: 'See similar roles',
};

// "Before you apply" pre-apply preview (Figma T-MSG-06 7420:3578 / Focused 8110:438016), copy verbatim from the node characters.
export const PRE_APPLY_PREVIEW = {
  title: 'Before you apply',
  company: 'Farmerline',
  role: 'Data Science Intern',
  matchPercent: 88,
  boostedPercent: 94,
  sectionsLabel: 'WHAT FARMERLINE SEES',
  rows: [
    { id: 'info', label: 'Personal info and education', hidden: false },
    { id: 'skills', label: 'Skills · 7 verified', hidden: false },
    { id: 'assessments', label: 'Assessments and badges', hidden: false },
    { id: 'work', label: 'Work experience is hidden', hidden: true, action: 'Edit visibility' },
    { id: 'portfolio', label: 'Portfolio · 3 projects', hidden: false },
  ],
  cancelLabel: 'Cancel',
  continueLabel: 'Continue application',
};

export const INTERVIEW_CARD_INVITE = {
  id: 'interview-hubtel-jpd',
  kind: 'interview',
  state: 'invite',
  strip: 'INTERVIEW INVITE',
  title: 'Junior Product Designer · Hubtel',
  when: 'Thu 16 Oct · 10:00–10:45 AM',
  where: 'Video call · link shared after you accept',
  acceptLabel: 'Accept',
  suggestLabel: 'Suggest another time',
};

export const INTERVIEW_CARD_CONFIRMED = {
  ...INTERVIEW_CARD_INVITE,
  state: 'confirmed',
  where: 'Video call · link added to your calendar',
  confirmedLabel: "You're confirmed",
  calendarLabel: 'Add to calendar',
  changeLabel: 'Need to change it?',
};
