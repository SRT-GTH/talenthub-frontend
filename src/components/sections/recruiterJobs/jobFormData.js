/*
 * Mock data + verbatim copy for the recruiter job flows (Figma "Recruiter - Job Postings" 10103:59491: JT-01…JT-11 create from a template, CT-01…CT-08 build a template, JM-01…JM-13 manage a posting).
 * ⚠️ ASSUMPTION: all values are mock; no API is called and nothing is persisted (state lives in the URL).
 */

export const ORG_NAME = 'Silver Rock Technology';

export const FORM_SECTIONS = {
  basics: { title: 'Basics', subtitle: 'What the role is and who it’s for' },
  pay: {
    title: 'Location and pay',
    subtitle: 'Postings that show pay get about 2× more applicants',
  },
  description: {
    title: 'Description',
    subtitle: 'Keep it short and specific. Talent read this on their phones.',
  },
  skills: { title: 'Skills', subtitle: 'Required skills are used for matching and screening' },
  settings: { title: 'Application settings', subtitle: 'How people apply and how you screen them' },
};

export const DEPARTMENTS = ['Design', 'Engineering', 'Marketing', 'Operations', 'Finance'];

export const EMPLOYMENT_TYPES = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract', description: 'Fixed term, set an end date' },
  {
    value: 'Internship',
    label: 'Internship',
    description: 'Opens to students and recent graduates',
  },
  {
    value: 'National Service (NSS)',
    label: 'National Service (NSS)',
    description: 'For NSS-posted graduates',
  },
  { value: 'Apprenticeship', label: 'Apprenticeship' },
];
export const EMPLOYMENT_MENU_LABEL = 'EMPLOYMENT TYPE';

export const EXPERIENCE_LEVELS = [
  'Entry-level (0–2 yrs)',
  'Mid-level (2–5 yrs)',
  'Senior (5+ yrs)',
  'Lead / Manager',
];

export const WORK_SETUPS = ['On-site', 'Hybrid', 'Remote'];

export const LOCATIONS = [
  {
    value: 'Accra, Greater Accra',
    label: 'Accra, Greater Accra',
    description: 'City · 1,240 talents nearby',
  },
  { value: 'Airport City, Accra', label: 'Airport City, Accra', description: 'Area' },
  { value: 'Tema, Greater Accra', label: 'Tema, Greater Accra', description: 'City' },
  {
    value: 'Remote · anywhere in Ghana',
    label: 'Remote · anywhere in Ghana',
    description: 'Shown to talent in all regions',
  },
  { value: 'London, UK', label: 'London, UK' },
];

export const PAY_TYPES = [
  'Monthly salary',
  'Yearly salary (GBP)',
  'Hourly rate',
  'Stipend',
  'Unpaid',
];

export const SCREENING_GROUPS = [
  {
    label: 'FROM THIS TEMPLATE',
    items: [
      {
        value: 'Product Designer screening (from template)',
        label: 'Product Designer screening',
        description: '2–5 yrs · Figma, Prototyping · assessment ≥ 70',
      },
    ],
  },
  {
    label: 'SAVED BY YOUR TEAM',
    items: [
      {
        value: 'Senior design screening',
        label: 'Senior design screening',
        description: 'Saved by you · 5+ yrs · portfolio required',
      },
      {
        value: 'Graduate intake screening',
        label: 'Graduate intake screening',
        description: 'Saved by Akua M. · BSc · assessment ≥ 60',
      },
    ],
  },
];
export const SCREENING_NEW_LABEL = 'Create new criteria';
export const SCREENING_NONE_LABEL = 'No screening · review everyone yourself';

export const CATEGORIES = [
  'Technology',
  'Design',
  'Finance and accounting',
  'Sales and marketing',
  'Customer service',
  'Internships and NSS',
];
export const NEW_CATEGORY_LABEL = 'New category…';

export const SETTINGS_CHECKS = [
  {
    id: 'confirmation',
    label: 'Send applicants an automatic confirmation message',
    hint: 'They get it in Messages as soon as they apply.',
  },
  {
    id: 'gthProfile',
    label: 'Let talent apply with their GTH profile (no CV needed)',
  },
  {
    id: 'under18',
    label: 'Accept applications from talent under 18',
    hint: 'Only for internships and training programmes. Parent consent is checked automatically.',
  },
];

export const PRODUCT_DESIGNER = {
  id: 'product-designer',
  title: 'Product Designer',
  department: 'Design',
  employment: 'Full-time',
  experience: 'Mid-level (2–5 yrs)',
  setup: 'Hybrid',
  location: 'Accra, Greater Accra',
  openings: '1',
  payType: 'Monthly salary',
  min: '6,000',
  max: '9,000',
  showPay: true,
  payHint: 'Suggested range for Product Designers in Accra: GHS 5,500–9,500',
  about:
    'Join our product team to design simple, accessible experiences for millions of mobile-first users across Ghana. You’ll own features end to end, from research to shipped UI.',
  responsibilities: [
    'Run lightweight user research and usability tests',
    'Turn insights into flows, wireframes and high-fidelity UI in Figma',
    'Maintain and extend the design system',
    'Work with engineers through build and QA',
  ],
  skills: [
    { name: 'Figma', required: true },
    { name: 'Prototyping', required: true },
    { name: 'User research' },
    { name: 'Design systems' },
    { name: 'Accessibility' },
  ],
  deadline: '30 Nov 2026',
  screening: 'Product Designer screening (from template)',
  confirmation: true,
  gthProfile: true,
  under18: false,
};

export const JUNIOR_FRONTEND = {
  id: 'junior-frontend-developer',
  title: 'Junior Frontend Developer',
  department: 'Engineering',
  employment: 'Full-time',
  experience: 'Entry-level (0–2 yrs)',
  setup: 'Hybrid',
  location: 'Accra, Greater Accra',
  openings: '2',
  payType: 'Monthly salary',
  min: '4,000',
  max: '6,000',
  showPay: true,
  payHint: 'You can choose “Unpaid” or “Stipend” as the pay type for internships.',
  about:
    'Help us build fast, accessible web apps used by schools and small businesses across Ghana. You’ll pair with senior engineers and ship to production from your first month.',
  responsibilities: [
    'Build UI features in React and TypeScript',
    'Turn Figma designs into accessible, responsive pages',
    'Write tests and fix bugs reported by users',
    'Join code reviews and weekly demos',
  ],
  skills: [
    { name: 'React', required: true },
    { name: 'JavaScript', required: true },
    { name: 'HTML & CSS' },
    { name: 'Git' },
    { name: 'Accessibility' },
  ],
  deadline: '',
  screening: 'Graduate intake screening',
  category: 'Technology',
  confirmation: true,
  gthProfile: true,
  under18: false,
};

export const SENIOR_UX = {
  id: 'senior-ux-designer',
  title: 'Senior UX Designer',
  department: 'Design',
  employment: 'Full-time',
  experience: 'Senior (5+ yrs)',
  setup: 'Remote',
  location: 'London, UK',
  openings: '1',
  payType: 'Yearly salary (GBP)',
  min: '55,000',
  max: '65,000',
  showPay: true,
  payHint: 'Changed from GBP 50,000–60,000',
  about:
    'Lead end-to-end design for our fintech products used by more than 2 million people. You’ll shape research, interaction and visual design, and mentor two mid-level designers.',
  responsibilities: [
    'Own the design of our payments and savings flows',
    'Run research with users in Ghana, Nigeria and the UK',
    'Grow and govern the design system with engineering',
    'Mentor two mid-level designers',
  ],
  skills: [
    { name: 'Figma', required: true },
    { name: 'Design systems', required: true },
    { name: 'User research', required: true },
    { name: 'Prototyping' },
    { name: 'Accessibility' },
    { name: 'Stakeholder management' },
  ],
  deadline: '15 Nov 2026',
  screening: 'Senior design screening',
  confirmation: true,
  gthProfile: true,
  under18: false,
};

export const BLANK_FORM = {
  title: '',
  department: '',
  employment: '',
  experience: '',
  setup: '',
  location: '',
  openings: '1',
  payType: '',
  min: '0',
  max: '0',
  showPay: false,
  payHint: 'You can choose “Unpaid” or “Stipend” as the pay type for internships.',
  about: '',
  responsibilities: [],
  skills: [],
  deadline: '',
  screening: '',
  confirmation: true,
  gthProfile: true,
  under18: false,
};

export const SKILL_SEARCH_PLACEHOLDER = 'Search skills, e.g. Motion design';
export const TEMPLATE_SKILL_SEARCH_PLACEHOLDER = 'Search skills, e.g. React';

/* The "Create job" page (JT-03…JT-10). */
export const CREATE_JOB = {
  back: 'Back to templates',
  crumb: 'Job Postings / Templates / Product Designer / Create job',
  titleLead: 'Create ',
  titleAccent: 'job',
  subtitle:
    'Pre-filled from the Product Designer template. Review and edit anything before you publish.',
  banner: {
    title: 'Template applied: Product Designer',
    body: 'Every field below came from the template and can be changed.',
    reset: 'Reset to template',
  },
  errorBanner: {
    title: '2 things need fixing before you can publish',
    body: 'We’ve highlighted them below.',
  },
  aside: {
    status: 'READY TO PUBLISH',
    fromTemplate: 'From template · Product Designer',
    checklistTitle: 'Posting checklist',
    checklist: [
      'Title and type',
      'Location and pay',
      'Description',
      '5 skills (2 required)',
      'Deadline and screening',
    ],
    publish: 'Publish job',
    preview: 'Preview',
    draft: 'Save as draft',
    tipTitle: 'Tip',
    tip: 'After publishing, GTH suggests matching talent you can invite straight away.',
  },
  errors: {
    pay: 'Minimum can’t be higher than maximum (GHS 9,000)',
    deadline: 'Add a deadline. It must be at least 3 days from today.',
    checklistBad: ['Location and pay', 'Deadline and screening'],
  },
};

/* The "Build a template" page (CT-01…CT-05). */
export const BUILD_TEMPLATE = {
  back: 'Back to templates',
  crumb: 'Job Postings / Templates / New template',
  titleLead: 'Build a ',
  titleAccent: 'template',
  subtitle:
    'Create a reusable job template from scratch. Save it once and use it for every similar role.',
  banner: {
    title: 'Templates don’t publish anything',
    body: 'They’re saved to My templates. Use one any time to start a job with everything filled in.',
  },
  aside: {
    eyebrow: 'TEMPLATE SETTINGS',
    nameLabel: 'Template name',
    namePlaceholder: 'e.g. Junior Frontend Developer',
    categoryLabel: 'Category',
    categoryPlaceholder: 'Select a category',
    visibilityLabel: 'Who can use it',
    onlyMe: 'Only me',
    team: 'Everyone at Silver Rock Technology',
    teamHint: 'Your 4 teammates will see it in Templates',
    includeScreening: 'Save screening criteria with this template',
    save: 'Save template',
    preview: 'Preview',
    hint: 'Add a template name and job title to save.',
  },
  dialog: {
    title: 'Save template',
    body: 'Saved to My templates. You can edit it any time.',
    nameLabel: 'Template name',
    categoryLabel: 'Category',
    visibilityLabel: 'Who can use it',
    includeScreening: 'Include screening criteria',
    includeScreeningHint: 'Graduate intake screening · BSc · assessment ≥ 60',
    cancel: 'Cancel',
    save: 'Save template',
    nameError:
      'You already have a template with this name. Try “Junior Frontend Developer (Hybrid)”.',
  },
  toast: {
    title: 'Success',
    message: 'Template saved to My templates. Everyone at Silver Rock Technology can use it.',
    action: 'Use it now',
  },
  skillsEmpty: 'No skills added yet. Add at least 3 so we can match the right talent.',
  payHintNote: 'You can choose “Unpaid” or “Stipend” as the pay type for internships.',
};

/* Preview (JT-02 template preview as talent sees it, JT-08 preview before publishing). */
export const PREVIEW = {
  employer: ORG_NAME,
  verified: 'Verified employer',
  employerMeta: 'Technology · Accra · 50–200 people',
  chips: ['Accra · Hybrid', 'Full-time', 'GHS 6,000–9,000 / mo', 'Closes 30 Nov'],
  apply: 'Apply with my GTH profile',
  save: 'Save for later',
  applyHint: 'Takes 1 minute. You’ll preview what they see first.',
  aboutTitle: 'About the role',
  skillsTitle: 'Skills they want',
  skillsCount: 'You have 4 of 5',
  match: {
    eyebrow: 'YOUR MATCH',
    badge: 'Strong match',
    percent: '82%',
    copy: 'Silver Rock’s team already sees you in their top matches for this role.',
    rows: [
      { label: 'Skills', value: '4 of 5' },
      { label: 'Education', value: 'BSc' },
      { label: 'Location', value: 'Accra' },
    ],
    how: 'How is this worked out?',
  },
  hiring: {
    eyebrow: 'WHO’S HIRING',
    initials: 'JK',
    name: 'Joel Adade Kofie',
    role: 'HR Lead · Silver Rock Technology',
    reply: 'Usually replies within 2 days',
  },
  template: {
    crumbBack: 'Back to template',
    crumb: 'Job Postings / Templates / Product Designer',
    bannerTitle: 'Preview — this is exactly what talent will see',
    bannerBody:
      'Match details on the right are shown for a sample talent. Buttons are disabled in preview.',
    badge: 'New today',
    barCopy: 'Happy with it? Use the template to create your job. You can edit everything.',
    close: 'Close preview',
    use: 'Use template',
    skills: [
      { name: 'Figma (required)', state: 'have' },
      { name: 'Prototyping (required)', state: 'have' },
      { name: 'User research', state: 'have' },
      { name: 'Design systems', state: 'have' },
      { name: 'Accessibility · missing', state: 'missing' },
    ],
  },
  publish: {
    crumbBack: 'Back to edit',
    crumb: 'Job Postings / Create job / Preview',
    bannerTitle: 'Preview · not published yet',
    bannerBody:
      'Match details on the right are shown for a sample talent. Buttons are disabled in preview.',
    badge: 'Draft',
    barCopy: 'This is how your job will appear in Opportunities and in Talent Search invites.',
    back: 'Back to edit',
    publish: 'Publish job',
    skills: [
      { name: 'Figma · verified', state: 'have' },
      { name: 'Prototyping', state: 'have' },
      { name: 'User research', state: 'have' },
      { name: 'Design systems', state: 'have' },
      { name: 'Accessibility · missing', state: 'missing' },
    ],
  },
};

/* JT-01 template details modal. */
export const TEMPLATE_DETAILS = {
  title: 'Product Designer',
  meta: 'Design template · Used by 214 recruiters · Last updated 2 Oct 2026',
  chips: ['Full-time', 'Mid-level · 2–5 yrs', 'Accra · Hybrid', 'GHS 6,000–9,000 / mo'],
  aboutTitle: 'About the role',
  responsibilitiesTitle: 'Responsibilities',
  skillsTitle: 'Skills',
  includedTitle: 'Included in this template',
  included: [
    'Job description and responsibilities',
    'Suggested pay range for Accra',
    '5 skills, 2 required',
    'Screening criteria (2–5 yrs, Figma, assessment ≥ 70)',
  ],
  includedNote: 'Everything is editable after you choose Use template.',
  previewAsTalent: 'Preview as talent',
  close: 'Close',
  use: 'Use template',
};

/* JT-09 publishing, JT-10 success. */
export const PUBLISHING = {
  title: 'Publishing your job…',
  body: 'This usually takes a few seconds. Please keep this tab open.',
  steps: [
    { label: 'Checking your details', state: 'done' },
    { label: 'Running safety and fairness checks', state: 'active' },
    { label: 'Finding matching talent', state: 'todo' },
  ],
};

export const PUBLISHED = {
  title: 'Your job is live!',
  body: 'Product Designer at Silver Rock Technology is now visible to talent across Ghana.',
  nextLabel: 'WHAT’S NEXT',
  next: [
    {
      id: 'invite',
      title: '24 strong matches found',
      body: 'Invite them to apply before the posting gets busy',
      action: 'Invite talent',
    },
    {
      id: 'share',
      title: 'Share your posting',
      body: 'gth.com/jobs/silver-rock/product-designer',
      action: 'Copy link',
    },
    {
      id: 'track',
      title: 'Track applicants',
      body: 'New applications land in Applied and in Messages',
      action: 'Open pipeline',
    },
  ],
  back: 'Back to Job Postings',
  view: 'View posting',
  toast: {
    title: 'Success',
    message: 'Product Designer is live. Talent can now find it in Opportunities',
    action: 'View posting',
  },
};

/* JM-01 recruiter's job detail. */
export const POSTING_DETAIL = {
  back: 'Back to Job Postings',
  crumb: 'Job Postings / Senior UX Designer',
  posted: 'Posted 5 days ago by you · Closes 15 Nov',
  status: 'Active',
  edit: 'Edit posting',
  chips: ['London, UK · Remote-friendly', 'Full-time', 'GBP 55,000–65,000 / yr', 'Closes 15 Nov'],
  stats: [
    { label: 'Total applicants', value: '128', note: '+12 this week', tone: 'good' },
    { label: 'Awaiting review', value: '42', note: '8 waiting 3+ days', tone: 'warn' },
    { label: 'Avg. match', value: '84%', note: 'Strong pool', tone: 'good' },
    { label: 'Views', value: '1,204', note: '9% applied', tone: 'good' },
  ],
  aboutTitle: 'About the role',
  skillsTitle: 'Skills you asked for',
  editScreening: 'Edit screening',
  pipeline: {
    title: 'Pipeline',
    total: '128 applicants',
    rows: [
      { label: 'Applied', value: 42, color: '#575755' },
      { label: 'Screening', value: 30, color: '#3b5bdb' },
      { label: 'Shortlisted', value: 18, color: '#387440' },
      { label: 'Interview', value: 12, color: '#c8951a' },
      { label: 'Offer extended', value: 4, color: '#387440' },
      { label: 'Not progressed', value: 22, color: '#c0392b' },
    ],
    open: 'Open pipeline',
  },
  screening: {
    title: 'Senior design screening',
    body: '46 of 128 applicants meet your criteria',
    link: 'Review screening results',
  },
  share: {
    title: 'SHARE THIS JOB',
    url: 'gth.com/jobs/silver-rock/senior-ux-designer',
    copy: 'Copy',
  },
};

/* JM-03 / JM-04 / JM-05 editing a live posting. */
export const EDIT_POSTING = {
  back: 'Back to posting',
  crumb: 'Job Postings / Senior UX Designer / Edit',
  titleLead: 'Edit ',
  titleAccent: 'posting',
  subtitle: 'Senior UX Designer · Active · 128 applicants',
  warning: {
    title: '128 people have already applied',
    body: 'Changes to the title, location, pay or required skills are shown to them and can change their match score. Typos and wording changes are safe.',
  },
  aside: {
    title: 'UNSAVED CHANGES',
    changes: [
      { label: 'Pay range: GBP 50k–60k → 55k–65k', note: 'Applicants will be told', notify: true },
      { label: 'Work setup: Hybrid → Remote', note: 'Applicants will be told', notify: true },
      { label: 'About the role: wording', note: 'No one is notified', notify: false },
    ],
    save: 'Save changes',
    cancel: 'Cancel',
    foot: 'Match scores update within a few minutes after saving.',
  },
  confirm: {
    title: 'Save changes to a live posting?',
    body: '2 changes affect what applicants applied for. We’ll show a short “Updated” note on the posting.',
    notify: 'Notify all 128 applicants in Messages',
    notifyHint:
      '“Silver Rock Technology updated the pay range and work setup for Senior UX Designer.”',
    ask: 'Ask applicants to confirm they’re still interested',
    keep: 'Keep editing',
    save: 'Save changes',
  },
  saved: {
    updated: 'Updated just now',
    meta: 'Updated just now by you · Closes 15 Nov',
  },
};
