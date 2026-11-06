/*
 * screeningFlowData.js — mock content for the screening flow of the "Recruiter - Job Postings" canvas
 * (Figma file OHG2xsfCCskT8xEn356njv, canvas 10103:59491, frames JS-01 … JS-14). Text is verbatim from the frames' `characters`;
 * every number is mock data (⚠️ ASSUMPTION: no screening API exists yet) and the counting rules below are inferred from the frames.
 */

// ── jobs the flow can run on (URL key `job`) ─────────────────────────────────────────────────────────────────────────────
export const FLOW_JOBS = {
  'senior-ux-designer': {
    id: 'senior-ux-designer',
    title: 'Senior UX Designer',
    applyingTo: 'Senior UX Designer — London, UK',
    criteriaName: 'Senior design screening',
    screened: 128,
    qualified: 46,
    close: 19,
    dont: 63,
  },
  'product-designer': {
    id: 'product-designer',
    title: 'Product Designer',
    applyingTo: 'Product Designer — Accra, GH',
    criteriaName: 'Product Designer screening',
    screened: 0,
    qualified: 0,
    close: 0,
    dont: 0,
    invite: 24,
  },
};

// ── the criteria builder, Senior UX Designer variant (JS-01 … JS-03, JS-12 … JS-14) ───────────────────────────────────────
export const FLOW_CRITERIA = {
  experience: {
    value: '5–10 Years',
    description: 'Filter candidates by total years in a relevant design role.',
  },
  skills: {
    base: ['Figma', 'Design systems', 'User research'],
    description: 'Mandatory match for primary skills: Figma, Design systems, User research.',
  },
  funnel: { total: '128', qualified: 46 },
};

// ── JS-01: the add-skill search popover ─────────────────────────────────────────────────────────────────────────────────
export const SKILL_CATALOG = [
  {
    id: 'prototyping',
    label: 'Prototyping',
    group: 'FROM THIS POSTING',
    note: 'Listed in Senior UX Designer',
    drop: 8,
  },
  {
    id: 'accessibility',
    label: 'Accessibility',
    group: 'FROM THIS POSTING',
    note: 'Listed in Senior UX Designer',
    drop: 5,
  },
  {
    id: 'product-thinking',
    label: 'Product thinking',
    group: 'SUGGESTED',
    note: 'Common in senior design roles',
    drop: 6,
  },
  {
    id: 'interaction-design',
    label: 'Interaction design',
    group: 'SUGGESTED',
    note: null,
    drop: 4,
  },
];
// ⚠️ ASSUMPTION: a custom skill (typed, not in the catalogue) removes 3 from the qualified count, a catalogue skill its `drop`.
export const CUSTOM_SKILL_DROP = 3;

// ── JS-03: the education level dropdown ─────────────────────────────────────────────────────────────────────────────────
export const EDUCATION_LEVELS = [
  { id: 'any', label: 'Any level', note: 'Don’t filter on education' },
  { id: 'diploma', label: 'Diploma or HND' },
  { id: 'bachelors', label: 'Bachelor’s degree' },
  { id: 'masters', label: 'Master’s degree' },
];
export const EDUCATION_PARTNERS = {
  label: 'Only from partner institutions',
  note: 'KNUST, UG, Ashesi, UCC + 12 more',
};
export const EDUCATION_LEVEL_GROUP = 'MINIMUM LEVEL';

// ── JS-04: the processing dialog ────────────────────────────────────────────────────────────────────────────────────────
export const PROCESSING = {
  title: 'Screening 128 applicants…',
  body: 'Checking everyone against your 5 criteria for Senior UX Designer.',
  steps: [
    'Experience (5+ yrs)',
    'Required skills (Figma, Design systems, User research)',
    'Education (Bachelor’s or higher)',
    'Assessment score and location',
  ],
  total: 128,
  // ⚠️ ASSUMPTION: a step is done once `checked` passes its quarter, running inside it, pending before it (80 of 128 = steps 1–2 done, 3 running).
  stepSize: 32,
};

// ── JS-05 … JS-09: the results screen ───────────────────────────────────────────────────────────────────────────────────
export const RESULTS_TEXT = {
  heading: { lead: 'Screening ', accent: 'results' },
  breadcrumb: '·  Job Postings / Screening / ',
  back: 'Back to screening criteria',
  backToPostings: 'Back to Job Postings',
  adjust: 'Adjust criteria',
  stats: [
    { id: 'screened', label: 'Applicants screened', note: 'All applicants so far' },
    { id: 'meet', label: 'Meet all criteria', note: 'Ready for the pipeline' },
    { id: 'close', label: 'Close match', note: 'Missing 1 criterion' },
    { id: 'dont', label: 'Don’t meet criteria', note: 'Stay in Applied' },
  ],
  tabs: [
    { id: 'meet', label: 'Meet all criteria' },
    { id: 'close', label: 'Close match' },
    { id: 'dont', label: 'Don’t meet' },
  ],
  search: 'Search applicants',
  sort: 'Sort: Best match',
  columns: {
    meet: ['APPLICANT', 'MATCH', 'SKILLS MET', 'ASSESSMENT'],
    close: ['APPLICANT', 'MATCH', 'WHY IT’S CLOSE'],
    dont: ['APPLICANT', 'MATCH', 'WHY IT’S MISSING'],
  },
  viewProfile: 'View profile',
  moveAnyway: 'Move anyway',
  loadMore: 'Load more',
  skillsMet: '3/3 required',
};

export const AVATAR_TONES = {
  mint: { bg: '#ebf1ec', fg: '#2a5730' },
  violet: { bg: '#f5f3ff', fg: '#6d28d9' },
  amber: { bg: '#faf4e8', fg: '#463409' },
  blue: { bg: '#eaeffb', fg: '#244a9f' },
  stone: { bg: '#bcb7a8', fg: '#575755' },
};

export const MEET_APPLICANTS = [
  {
    id: 'ella-mensah',
    name: 'Ella Mensah',
    initials: 'EM',
    tone: 'mint',
    meta: 'Product Designer · 6 yrs · Accra',
    match: '91%',
    score: '86 / 100',
  },
  {
    id: 'eleanor-fant',
    name: 'Eleanor Fant',
    initials: 'EF',
    tone: 'violet',
    meta: 'UX Lead · 7 yrs · London',
    match: '91%',
    score: '88 / 100',
  },
  {
    id: 'ama-boateng',
    name: 'Ama Boateng',
    initials: 'AB',
    tone: 'amber',
    meta: 'Product Lead · 8 yrs · Accra',
    match: '84%',
    score: '81 / 100',
  },
  {
    id: 'julian-reed',
    name: 'Julian Reed',
    initials: 'JR',
    tone: 'blue',
    meta: 'Senior UX Designer · 5 yrs · Remote',
    match: '84%',
    score: '79 / 100',
  },
  {
    id: 'kofi-amankwah',
    name: 'Kofi Amankwah',
    initials: 'KA',
    tone: 'mint',
    meta: 'Senior Product Engineer · 6 yrs · Kumasi',
    match: '81%',
    score: '77 / 100',
  },
  {
    id: 'adam-sandler',
    name: 'Adam Sandler',
    initials: 'AS',
    tone: 'stone',
    meta: 'UX Designer · 5 yrs · Manchester',
    match: '79%',
    score: '74 / 100',
  },
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    initials: 'SJ',
    tone: 'violet',
    meta: 'Design Systems Lead · 9 yrs · Remote',
    match: '77%',
    score: '72 / 100',
  },
];

export const CLOSE_APPLICANTS = [
  {
    id: 'marcus-thorne',
    name: 'Marcus Thorne',
    initials: 'MT',
    tone: 'amber',
    meta: 'UX Designer · 4 yrs · Accra',
    match: '68%',
    why: 'Experience 4 yrs (needs 5+)',
  },
  {
    id: 'godfred-ansah',
    name: 'Godfred Ansah',
    initials: 'GA',
    tone: 'mint',
    meta: 'Product Designer · 6 yrs · Tema',
    match: '66%',
    why: 'Missing: User research',
  },
  {
    id: 'abena-owusu',
    name: 'Abena Owusu',
    initials: 'AO',
    tone: 'blue',
    meta: 'UI Designer · 5 yrs · Kumasi',
    match: '64%',
    why: 'Assessment 64 (needs 70+)',
  },
  {
    id: 'nana-kwarteng',
    name: 'Nana Kwarteng',
    initials: 'NK',
    tone: 'stone',
    meta: 'Product Designer · 7 yrs · Lagos',
    match: '63%',
    why: 'Location outside your region',
  },
];

// ⚠️ ASSUMPTION: the "Don’t meet" tab is not drawn in Figma; these rows are invented mock data in the same row shape.
export const DONT_APPLICANTS = [
  {
    id: 'yaw-frimpong',
    name: 'Yaw Frimpong',
    initials: 'YF',
    tone: 'stone',
    meta: 'Graphic Designer · 2 yrs · Accra',
    match: '41%',
    why: 'Experience 2 yrs (needs 5+)',
  },
  {
    id: 'esi-mensimah',
    name: 'Esi Mensimah',
    initials: 'EM',
    tone: 'violet',
    meta: 'Marketing Designer · 3 yrs · Takoradi',
    match: '38%',
    why: 'Missing 2 of 3 required skills',
  },
  {
    id: 'kwabena-tetteh',
    name: 'Kwabena Tetteh',
    initials: 'KT',
    tone: 'blue',
    meta: 'Illustrator · 1 yr · Accra',
    match: '33%',
    why: 'Education below Bachelor’s',
  },
];

export const SELECTION_FOOTER = {
  meet: (shown, total) => `Showing ${shown} of ${total} · all selected`,
  close: (shown, total) => `Showing ${shown} of ${total} close matches`,
  dont: (shown, total) => `Showing ${shown} of ${total} that don’t meet`,
};

export const NONE_STATE = {
  title: 'No one meets all 5 criteria yet',
  body: 'Your criteria are stricter than this applicant pool. These changes would help most:',
  suggestions: [
    {
      id: 'experience',
      label: 'Lower minimum experience to 4+ years',
      gain: '+11 would qualify',
      apply: { adjExperience: '4plus' },
    },
    {
      id: 'education',
      label: 'Make Education level optional',
      gain: '+6 would qualify',
      apply: { adjEducation: 'off' },
    },
    { id: 'skills', label: 'Allow 2 of 3 required skills', gain: '+9 would qualify', apply: {} },
  ],
  apply: 'Apply',
  adjust: 'Adjust criteria',
  review: (count) => `Review close matches (${count})`,
  // JS-08 is the same pool as JS-05, screened with stricter rules: 0 · 7 · 121.
  counts: { qualified: 0, close: 7, dont: 121 },
};

export const WAITING_STATE = {
  title: 'No applicants to screen yet',
  body: 'Product Designer went live today. Screening runs automatically as people apply, and qualified applicants move to Screening on their own.',
  subtitle: 'Product Designer · Product Designer screening · waiting for applicants',
  editCriteria: 'Edit criteria',
  invite: (count) => `Invite ${count} matching talents`,
};

// ── JS-07: the adjust-criteria drawer ───────────────────────────────────────────────────────────────────────────────────
export const DRAWER = {
  title: 'Adjust criteria',
  hint: 'Changes update the count instantly. Nothing moves until you apply.',
  reset: 'Reset',
  cancel: 'Cancel',
  apply: 'Apply changes',
  liveLabel: 'Would meet all criteria',
  experienceOptions: ['3+ years', '4+ years', '5–10 years', '10+ years'],
  educationOptions: ['Any level', 'Diploma or HND', 'Bachelor’s', 'Master’s'],
  assessmentOptions: ['60+', '70+', '80+'],
};
/*
 * ⚠️ ASSUMPTION: the drawer's live count is derived, not computed. Each relaxed rule adds a fixed number of applicants
 * (`close` of them from Close match, `dont` from Don’t meet). Experience 4+ and Location off together reproduce JS-07 exactly (46 → 61: +15 = 4 + 11).
 */
export const RELAX_RULES = {
  adjExperience: { '3plus': { close: 3, dont: 10 }, '4plus': { close: 2, dont: 7 } },
  adjEducation: { any: { close: 3, dont: 5 }, diploma: { close: 2, dont: 4 } },
  adjAssessment: { 60: { close: 2, dont: 3 } },
  adjLocation: { off: { close: 2, dont: 4 } },
};

// ── JS-10: confirm move to the pipeline ─────────────────────────────────────────────────────────────────────────────────
export const MOVE_DIALOG = {
  title: (count) => `Move ${count} applicants to Screening?`,
  body: 'They’ll appear in the Screening column of the Senior UX Designer pipeline.',
  notify: 'Send them a “we’re reviewing your application” message',
  notifyNote: 'Goes to Messages · you can edit the template in Settings',
  unqualifiedTitle: (count) => `The ${count} who didn’t qualify`,
  keep: 'Keep them in Applied for now',
  keepNote: 'You can still review them manually',
  reject: 'Mark as not progressed and send a kind message',
  cancel: 'Cancel',
  confirm: (count) => `Move ${count} to Pipeline`,
};

// ── JS-11: the hand-off toast on the pipeline ───────────────────────────────────────────────────────────────────────────
export const HANDOFF_TOAST = {
  title: (count) => `Success - ${count} applicants moved to Screening`,
  message: 'From Senior design screening · they were sent a “reviewing” message',
  action: 'Undo',
};

// ── JS-12 / JS-13: save the criteria as a template ──────────────────────────────────────────────────────────────────────
export const SAVE_DIALOG = {
  title: 'Save screening criteria',
  body: 'Reuse these 5 rules for future roles. You can load them on any job.',
  nameLabel: 'Name',
  defaultName: 'Senior design screening',
  suggestLabel: 'Suggest it for',
  suggestOptions: ['Design roles', 'Engineering roles', 'Operations roles', 'All roles'],
  rules: [
    '5–10 years experience',
    'Figma, Design systems, User research (required)',
    'Bachelor’s degree or higher',
    'Assessment score 70+',
    'Location: Accra or Remote',
  ],
  share: 'Share with everyone at Silver Rock Technology',
  makeDefault: 'Use as the default for new Design jobs',
  cancel: 'Cancel',
  save: 'Save criteria',
};
export const SAVED_TOAST = {
  title: 'Success - Screening criteria saved',
  message: 'Find it under Templates › Screening, or load it on any job',
  action: 'View',
};
export const savedChip = (name) => `Saved as “${name}”`;

// ── JS-14: load saved criteria ──────────────────────────────────────────────────────────────────────────────────────────
export const SAVED_CRITERIA = {
  trigger: 'Load saved criteria',
  group: 'SAVED BY YOUR TEAM',
  items: [
    {
      id: 'senior-design',
      label: 'Senior design screening',
      note: 'You · 5 rules · used on 2 jobs',
      icon: 'filter',
    },
    {
      id: 'graduate-intake',
      label: 'Graduate intake screening',
      note: 'Akua M. · 4 rules · used on 6 jobs',
      icon: 'filter',
    },
    {
      id: 'product-designer',
      label: 'Product Designer screening',
      note: 'From template · 3 rules',
      icon: 'file',
    },
  ],
  manage: 'Manage in Templates › Screening',
};

// ── the counting rules shared by the drawer and the results screen ──────────────────────────────────────────────────────
export const readAdjustment = (searchParams) => {
  let close = 0;
  let dont = 0;
  const changes = {};
  Object.entries(RELAX_RULES).forEach(([key, table]) => {
    const rule = table[searchParams.get(key)];
    if (rule) {
      close += rule.close;
      dont += rule.dont;
      changes[key] = searchParams.get(key);
    }
  });
  return { close, dont, delta: close + dont, changes };
};
