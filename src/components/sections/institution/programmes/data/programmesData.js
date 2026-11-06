/*
 * programmesData.js — COPY and display maps of the institution programmes (Figma 11.3.1a-d + 11.3.4a-e, canvas 8520:10). No sample records:
 * programmes, templates, the audience, the roster figures and the applicants all come from /api/institution/programmes
 * (backend institutionProgrammes.service.js, services/institutionPortal.api.js). Counts in aggregates go through formatCount() ("<5" under 5);
 * the applicants board shows the school's own students by name ("They’re your students, so you see their names").
 */

import { isSuppressed } from '../../institutionFormat.js';

export const PROGRAMME_TABS = [
  { id: 'programmes', label: 'Your programmes' },
  { id: 'templates', label: 'Templates' },
  { id: 'apply', label: 'Who can apply' },
];

export const PROGRAMME_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
  { id: 'draft', label: 'Draft' },
  { id: 'closed', label: 'Closed' },
];

export const ACTION_MENU = [
  { id: 'edit', label: 'Edit programme' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'close', label: 'Close programme', danger: true },
];

/** The Close dialog sentence takes the sign-up count of the programme. */
export const closeSentence = (count) =>
  `Students can’t sign up once it’s closed. Your ${new Intl.NumberFormat('en-GH').format(count)} ${
    count === 1 ? 'sign-up keeps its' : 'sign-ups keep their'
  } stage. Closing is logged with your name.`;

/* ===== templates (Figma 11.3.4c) ===================================================================================== */

export const TEMPLATE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'scholarships', label: 'Scholarships' },
  { id: 'clubs', label: 'Clubs' },
  { id: 'events', label: 'Career events' },
  { id: 'mentoring', label: 'Mentoring' },
  { id: 'yours', label: 'Your templates' },
];

/** Icon and tile colours of each template card (the content comes from the API). */
export const TEMPLATE_LOOK = {
  'youthstart-grant': { icon: 'code', tile: { bg: 'bg-[#f3f8f4]', fg: 'text-[#2a5730]' } },
  'scholarship-nomination': {
    icon: 'megaphone',
    tile: { bg: 'bg-[#ffddb6]', fg: 'text-[#633e00]' },
  },
  'after-school-club': { icon: 'service', tile: { bg: 'bg-[#c1e9c9]', fg: 'text-[#43664d]' } },
  'career-fair': { icon: 'hat', tile: { bg: 'bg-[#eae8e2]', fg: 'text-[#404941]' } },
  'alumni-mentoring': { icon: 'palette', tile: { bg: 'bg-[#1f6b3f]', fg: 'text-[#9de9b2]' } },
};
export const OWN_TEMPLATE_LOOK = {
  icon: 'megaphone',
  tile: { bg: 'bg-[#faf4e8]', fg: 'text-[#785910]' },
};

/* ===== eligibility rules + audience (Figma 11.3.1a) ================================================================== */

/** "AT LEAST n verified skills": the meter shows how inclusive the rule is. */
export const RESULT_STEPS = [
  { count: 1, label: '1 verified skill', meter: 0.86 },
  { count: 2, label: '2 verified skills', meter: 0.57 },
  { count: 3, label: '3 verified skills', meter: 0.29 },
];

export const DEFAULT_RULES = {
  yearOn: true,
  forms: [],
  studyOn: false,
  study: [],
  linkedOn: false,
  resultsOn: false,
  results: 1,
  under18: true,
};

export const EMPTY_DETAILS = {
  title: '',
  description: '',
  kind: '',
  place: '',
  mode: 'onsite',
  deadline: '',
  templateId: null,
};

export const MODES = [
  { id: 'onsite', label: 'In person' },
  { id: 'remote', label: 'Online' },
  { id: 'hybrid', label: 'In person and online' },
];

export const audienceBlocked = (audience) =>
  !audience || audience.match < 5 || isSuppressed(audience.match);

/** The sentence under the stars. */
export const audienceNote = (audience, formatCount) => {
  if (!audience) return 'Working out who matches…';
  if (audienceBlocked(audience)) {
    return `Only ${formatCount(audience.match)} students match these rules. Groups under 5 can’t be targeted. Add a year group or switch a rule off.`;
  }
  const notYet = audience.match - audience.visible;
  return notYet > 0
    ? `${formatCount(audience.visible)} can see it now. ${formatCount(notYet)} more will once they link their GTH account (and, if under 18, a guardian agrees).`
    : `All ${formatCount(audience.match)} matching students will see this programme in their feed.`;
};

export const POLICY_TITLE = 'Remove contact details to publish';

/* ===== published (Figma 11.3.1c) ===================================================================================== */

export const PUBLISHED = {
  sticker: 'Live now',
  title: 'Programme published!',
  body: (count, visible, title) =>
    `${count} students match ${title}. ${visible} can see it in their GTH feed now; the rest will once they link their account (and, if under 18, a guardian agrees).`,
  next: [
    'Sign-ups land in your applicants board',
    'Each student hears from GTH when you move them',
    'Message the class from Messages',
  ],
  back: 'Back to programmes',
  view: 'View applicants',
};

/* ===== applicants board (Figma 11.3.1d) ============================================================================== */

export const PIPELINE_COLUMNS = [
  { id: 'signed-up', label: 'Signed up' },
  { id: 'guardian-ok', label: 'Guardian OK' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'session-1', label: 'Session 1' },
  { id: 'attending', label: 'Attending' },
  { id: 'completed', label: 'Completed' },
  { id: 'withdrawn', label: 'Withdrawn' },
];

/** The next step of a card: the button on it moves the student there. */
export const nextStep = (a) => {
  switch (a.stage) {
    case 'signed-up':
      return a.under18
        ? {
            to: 'guardian-ok',
            label: a.guardian === 'agreed' ? 'Guardian said yes' : 'Waiting for guardian',
            disabled: a.guardian !== 'agreed',
          }
        : { to: 'confirmed', label: 'Confirm place' };
    case 'guardian-ok':
      return { to: 'confirmed', label: 'Confirm place' };
    case 'confirmed':
      return { to: 'session-1', label: 'Add to session 1' };
    case 'session-1':
      return { to: 'attending', label: 'Mark as attended' };
    case 'attending':
      return { to: 'completed', label: 'Mark completed' };
    default:
      return null;
  }
};

export const APPLICANTS_COPY = {
  title: 'Applicants',
  sentence:
    'Move students from signed up to completed. They’re your students, so you see their names.',
  empty: 'No sign-ups yet. Students who match see this programme in their GTH feed.',
};
