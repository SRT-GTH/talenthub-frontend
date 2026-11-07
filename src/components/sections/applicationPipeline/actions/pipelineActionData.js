/*
 * pipelineActionData.js — copy and mock payloads of the pipeline action layer (candidate drawer, move prompts, Not progressing, offer, interview feedback, toasts).
 * Source: Figma file OHG2xsfCCskT8xEn356njv, page "Recruiter - Application Pipeline" (10172:10101), frames PL-03 10173:12962, PL-05 10173:14268, PL-07 10173:15546, PL-08 10173:16195, PL-09 10173:16858,
 * PL-10 10173:17496, PL-11 10173:18161, PL-12 10173:18806, PL-13 10173:19464, PL-14 10173:20129, PL-16 10173:21199. Every string is verbatim from `texts.py`; the few invented ones are tagged ⚠️ ASSUMPTION.
 * The shapes mirror the future API payloads (candidate detail, not-progressed reasons, offer terms, interview feedback).
 */

export const STAGE_LABELS = {
  applied: 'Applied',
  screening: 'Screening',
  shortlisted: 'Shortlisted',
  interview: 'Interview',
  'offer-extended': 'Offer extended',
  hired: 'Hired',
  'not-progressed': 'Not progressed',
};

// The stage a card moves to with the drawer's primary button. ⚠️ ASSUMPTION: only "Move to Screening" is drawn; the rest follow the board's stage order.
export const NEXT_STAGE = {
  applied: 'screening',
  screening: 'shortlisted',
  shortlisted: 'interview',
  interview: 'offer-extended',
};

/* ---- Candidate drawer (PL-03) ---- */
export const DRAWER_COPY = {
  openedFromMessages: 'Opened from Messages',
  match: 'Match',
  stage: 'Stage',
  applied: 'Applied',
  application: 'Application',
  activity: 'Activity',
  teamNotes: 'Team notes',
  notesPlaceholder: 'Add a private note for your team…',
  notProgressing: 'Not progressing',
  moveTo: (stageLabel) => `Move to ${stageLabel}`,
  screeningLine: (met, total, name) => `Meets ${met} of ${total} screening rules · ${name}`,
  close: 'Close candidate details',
};

// Detail payload by card id. Only Ama Boateng is drawn; other cards fall back to `fallbackDetail` (⚠️ ASSUMPTION).
export const CANDIDATE_DETAILS = {
  'ama-boateng': {
    cardId: 'ama-boateng',
    headline: 'Product Lead · PayLink Ghana · Accra',
    openedFrom: 'Messages',
    appliedAt: 'Today 9:05',
    screening: {
      met: 5,
      total: 5,
      name: 'Senior design screening',
      rules: ['8 yrs', 'Figma ✓', 'Design systems ✓', 'User research ✓', 'BA ✓', 'Assessment 81'],
    },
    application:
      '“I’ve led design for two fintech apps in Ghana and would love to bring that to Silver Rock.”',
    links: [
      { id: 'profile', label: 'View full profile', icon: 'user' },
      { id: 'portfolio', label: 'ama.design/work', icon: 'external' },
      { id: 'conversation', label: 'Open conversation', icon: 'message' },
    ],
    activity: [
      { id: 'applied', label: 'Applied with GTH profile', at: 'Today 9:05 AM' },
      { id: 'auto-message', label: 'Auto-message sent to you', at: 'Today 9:05 AM' },
      { id: 'replied', label: 'You replied in Messages', at: 'Today 9:20 AM' },
    ],
  },
};

// ⚠️ ASSUMPTION: the drawer is drawn for one candidate; the other cards open the same layout with only the facts the board card already holds.
export const fallbackDetail = (card) => ({
  cardId: card.id,
  headline: card.role ? `${card.role} · ${card.years} yrs` : '',
  openedFrom: null,
  appliedAt: card.footer ?? '',
  screening: null,
  application: null,
  links: [{ id: 'profile', label: 'View full profile', icon: 'user' }],
  activity: [],
});

/* ---- Move prompts (PL-05 toast, PL-07 bulk dialog) ---- */
export const MOVE_NOTIFY_COPY = {
  title: (name, stage) => `Success - ${name} moved to ${stage}`,
  message: (first) => `Tell ${first}? They’ll get a short update in Messages.`,
  action: 'Send update',
};

export const BULK_MOVE_COPY = {
  title: (count, stage) => `Move ${count} candidates to ${stage}?`,
  body: (names, from, to) => `${names} will move from ${from} to ${to}.`,
  moveToLabel: 'Move to',
  notifyLabel: 'Send each of them a short update',
  notifyPreview: (jobTitle, stage) =>
    `“Good news — your application for ${jobTitle} moved to ${stage}.”`,
  cancel: 'Cancel',
  confirm: (count) => `Move ${count} candidates`,
};

/* ---- Not progressing (PL-08, PL-09 toast) ---- */
// ⚠️ ASSUMPTION: only "Not enough senior experience" is drawn; the other reasons are invented examples of a private reason list.
export const NOT_PROGRESSING_REASONS = [
  { value: 'not-enough-senior-experience', label: 'Not enough senior experience' },
  { value: 'skills-mismatch', label: 'Skills do not match the role' },
  { value: 'role-filled', label: 'Role filled by another candidate' },
  { value: 'other', label: 'Other' },
];

export const NOT_PROGRESSING_COPY = {
  title: (first, last) => `Not progressing with ${first} ${last}`,
  body: (first) => `${first} will move to Not progressed. Your reason stays private to your team.`,
  reasonLabel: 'Reason (private)',
  messageLabel: (first) => `Message to ${first} *`,
  maxLength: 600,
  defaultMessage: (first, jobTitle) =>
    `Hi ${first}, thank you for applying to ${jobTitle}. We’ve decided to move forward with candidates whose experience is closer to this role. We were impressed by your portfolio and would love to keep you in mind for future roles.`,
  keepInPool: (first) => `Keep ${first} in my talent pool for future roles`,
  noMessage: 'Don’t send a message',
  noMessageHint: 'Not recommended. Candidates who hear back rate recruiters higher.',
  cancel: 'Cancel',
  confirm: 'Send and move',
};

export const NOT_PROGRESSED_TOAST = {
  title: (name) => `Success - ${name} moved to Not progressed`,
  message: 'Your message was sent · kept in your talent pool',
  action: 'Undo',
};

/* ---- Offer (PL-10 dialog, PL-11 toast, PL-12 accepted, PL-13 declined) ---- */
export const OFFER_COPY = {
  title: (name) => `Extend an offer to ${name}`,
  body: (first) => `${first} will get the offer in Messages and can accept or decline in the app.`,
  salaryLabel: 'Salary',
  startDateLabel: 'Start date',
  expiresLabel: 'Offer expires in',
  employmentLabel: 'Employment type',
  messageLabel: 'Message',
  replace: 'Replace',
  maxLength: 600,
  withdrawHint: (first) => `You can withdraw the offer until ${first} responds.`,
  cancel: 'Cancel',
  confirm: 'Send offer',
  defaultMessage: (first, jobTitleShort) =>
    `Hi ${first}, we loved meeting you and we’re delighted to offer you the ${jobTitleShort} role. The details are attached. Happy to talk through anything.`,
};

// Defaults as drawn for Sarah Jenkins. ⚠️ ASSUMPTION: the extra option rows are invented (only the selected values are drawn).
export const OFFER_DEFAULTS = {
  salary: 'GBP 62,000 / year',
  startDate: '5 Jan 2027',
  expires: '7-days',
  employment: 'full-time-remote',
  letter: { name: 'Offer_Letter_Sarah_Jenkins.pdf', size: '182 KB' },
};

export const OFFER_EXPIRY_OPTIONS = [
  { value: '3-days', label: '3 days · 31 Oct 2026' },
  { value: '7-days', label: '7 days · 4 Nov 2026' },
  { value: '14-days', label: '14 days · 11 Nov 2026' },
];

export const OFFER_EMPLOYMENT_OPTIONS = [
  { value: 'full-time-remote', label: 'Full-time · Remote' },
  { value: 'full-time-onsite', label: 'Full-time · On-site' },
  { value: 'full-time-hybrid', label: 'Full-time · Hybrid' },
  { value: 'contract-remote', label: 'Contract · Remote' },
];

export const OFFER_SENT_TOAST = {
  title: (name) => `Success - Offer sent to ${name}`,
  message: (first) => `We’ll notify you when ${first} accepts or declines`,
  action: 'View message',
};

export const OFFER_ACCEPTED_COPY = {
  title: (first) => `${first} accepted your offer!`,
  body: (jobTitleShort) =>
    `That fills the only opening for ${jobTitleShort}. What would you like to do with the posting?`,
  options: [
    {
      value: 'close',
      label: (others) => `Close the posting and thank the other ${others} active candidates`,
      hint: 'Recommended · sends a kind “role filled” message',
    },
    { value: 'keep-open', label: 'Keep it open (I’m hiring more than one)', hint: null },
    { value: 'decide-later', label: 'Decide later', hint: null },
  ],
  // Candidates still active on the posting: 76 as drawn.
  otherActiveCandidates: 76,
  notNow: 'Not now',
  confirm: 'Close posting',
};

export const OFFER_DECLINED_COPY = {
  title: (first) => `${first} declined the offer`,
  body: (reason) => `Reason shared: “${reason}” The role is still open.`,
  reason: 'Accepted another offer closer to home.',
  go: 'Go',
  moveToNotProgressed: (first) => `Move ${first} to Not progressed`,
  done: 'Done',
  steps: [
    {
      id: 'next-candidate',
      title: 'Offer to your next candidate',
      detail: 'Sarah Jenkins · interview completed · 77%',
    },
    {
      id: 'review-shortlisted',
      title: 'Review Shortlisted (18)',
      detail: 'Move someone to Interview',
    },
    {
      id: 'keep-in-pool',
      title: (first) => `Keep ${first} in your talent pool`,
      detail: 'She can hear about future roles',
    },
  ],
};

/* ---- Interview completed (PL-14) ---- */
export const INTERVIEW_FEEDBACK_COPY = {
  title: (first) => `How did the interview with ${first} go?`,
  body: (first) => `Your feedback is private to your hiring team. ${first} never sees it.`,
  overallLabel: 'Overall',
  notesLabel: 'Notes',
  nextStepLabel: 'Next step',
  saveForLater: 'Save for later',
  saveAndExtend: 'Save and extend offer',
  defaultNotes:
    'Clear thinker. Walked through the savings redesign in depth. Wants more ownership of research.',
};

export const OVERALL_VERDICTS = [
  { value: 'strong-no', label: 'Strong no' },
  { value: 'no', label: 'No' },
  { value: 'yes', label: 'Yes' },
  { value: 'strong-yes', label: 'Strong yes' },
];

export const FEEDBACK_CRITERIA = [
  { id: 'design-craft', label: 'Design craft', rating: 4 },
  { id: 'systems-thinking', label: 'Systems thinking', rating: 4 },
  { id: 'communication', label: 'Communication', rating: 5 },
];

export const NEXT_STEP_OPTIONS = [
  { value: 'extend-offer', label: 'Extend offer', icon: 'badge-check' },
  { value: 'another-interview', label: 'Another interview', icon: 'calendar' },
  { value: 'not-progressing', label: 'Not progressing', icon: 'x-circle' },
];

/* ---- Interview scheduled toast (PL-16) ---- */
export const INTERVIEW_SCHEDULED_TOAST = {
  title: (name) => `Success - Interview scheduled with ${name}`,
  message: 'Thu 30 Oct, 11:30 · Google Meet · invite sent in Messages',
  action: 'View details',
};

/* ---- Sarah Jenkins as she sits in Offer extended after the offer (PL-11 …) ---- */
export const OFFER_SENT_CARD = {
  id: 'sarah-jenkins',
  kind: 'candidate',
  name: 'Sarah Jenkins',
  initials: 'SJ',
  avatar: null,
  avatarTone: 'violet',
  role: 'Design Systems Lead',
  years: 9,
  matchPercent: 77,
  qualified: true,
  tags: [],
  criteria: null,
  badges: [{ id: 'offer-sent', label: 'Offer sent · expires 4 Nov', tone: 'green', icon: 'check' }],
  footer: 'Just now',
  primaryAction: null,
};
