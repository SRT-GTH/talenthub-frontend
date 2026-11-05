/*
 * recruiterDashboardData.js — copy and mock rows for the recruiter dashboard.
 * Source: Figma file OHG2xsfCCskT8xEn356njv, canvas "Recruiter - Dashboard" (10005:38660), section 01 "Dashboard landing (US-7.3-01)"
 * — frames 10049:58645 (landing), 10049:59816 (org switcher), 10050:61097 (loading), 10057:63699 (switched toast),
 * 10057:64965 (single affiliation), 10064:36501 (pending), 10066:38322 (no affiliation), 10067:39673 (revoked toast).
 * Every string is copied from the frame's `characters`. Mock data only (frontend-only build, no backend).
 */

/* ---------------------------------------------------------------- organisations (switcher, D02) */
export const ORGS = [
  {
    id: 'mtn',
    name: 'MTN Ghana',
    meta: 'Recruiter · Enterprise plan',
    logo: 'mtn',
    status: 'active',
  },
  {
    id: 'hubtel',
    name: 'Hubtel Ltd',
    meta: 'Recruiter · Professional plan',
    logo: 'hubtel',
    status: 'active',
  },
  {
    id: 'pending',
    name: 'Zeepay Ghana Ltd',
    meta: 'Awaiting Primary Admin approval',
    logo: 'zeepay',
    status: 'pending',
    badge: 'Pending',
  },
  {
    id: 'none',
    name: 'Personal · Freelance',
    meta: 'Post jobs under your own name',
    logo: 'personal',
    status: 'personal',
  },
];

export const ORG_SWITCHER = {
  caption: 'Recruiting on behalf of',
  heading: 'Your organisations',
  request: 'Request affiliation with an organisation',
};

/* ---------------------------------------------------------------- toasts (D04, D08) */
export const ORG_TOASTS = {
  switched: {
    tone: 'success',
    title: 'Success',
    body: (org) => `Switched to ${org}. Your dashboard, jobs and messages now show ${org}’s data.`,
    action: 'Undo',
  },
  revoked: {
    tone: 'warning',
    title: 'Warning',
    body: (org) => `Your access to MTN Ghana was removed by its admin. Switched to ${org}`,
  },
};

/* ---------------------------------------------------------------- hero (D01) */
export const HERO = {
  date: 'TUESDAY 14 OCTOBER',
  greeting: 'Good evening, ',
  name: 'Kwame',
  summary: (org) => `Here's what's happening at ${org} today — 5 new applicants since yesterday.`,
  noOrg: "You're not linked to an organisation yet.",
  customize: 'Customize',
  quickActions: [
    { id: 'search', label: 'Search talents', icon: 'search' },
    { id: 'post', label: 'Post new opportunity', icon: 'plus' },
    { id: 'edit', label: 'Edit profile', icon: 'edit' },
  ],
  stats: [
    {
      id: 'views',
      value: '47',
      label: 'Profile views',
      note: '+38% this week',
      tone: 'white',
      noteColor: '#1d7c4d',
    },
    {
      id: 'applicants',
      value: '128',
      label: 'Applicants',
      note: '+12 new',
      tone: 'white',
      noteColor: '#1d7c4d',
    },
    {
      id: 'messages',
      value: '12',
      label: 'Messages',
      note: '2 unread',
      tone: 'cream',
      noteColor: '#785910',
    },
    {
      id: 'jobs',
      value: '4',
      label: 'Active Jobs',
      note: '8 waiting for review',
      tone: 'mint',
      noteColor: '#387440',
    },
  ],
};

/* Pending affiliation (D06) — read-only banner. */
export const PENDING_BANNER = {
  title: 'Affiliation pending — read-only',
  body: 'Ama Owusu (Primary Admin) hasn’t approved your request yet. You can look around, but posting and inviting are disabled for this organisation. Switch to Personal to post under your own name.',
  action: 'Switch to Personal',
  pill: 'Read-only',
};

/* No affiliation yet (D07). */
export const LINK_ORG = {
  title: 'Link your profile to an organisation',
  subtitle: 'Recruiters post on behalf of an employer — or as a freelancer under their own name',
  emptyTitle: 'No organisation linked',
  emptyBody:
    'Search for your employer and request to join, or create a new organisation and become its Primary Admin. Freelancers can keep posting under their own name.',
  request: 'Request affiliation',
  create: 'Create organisation',
  freelancer: 'Continue as freelancer',
};

/* ---------------------------------------------------------------- active job postings (D01) */
export const JOBS_WIDGET = {
  title: 'Active job postings',
  chip: '4 active',
  subtitle: (org) => `Live roles for ${org} · counts refresh every 30s`,
  sort: 'Sort: Urgent first',
  viewAll: 'View all',
  columns: ['JOB', 'POSTED', 'APPLICANTS', 'NEW · 7D', 'IN PIPELINE', 'STATUS'],
};

export const JOBS = [
  {
    id: 'junior-accountant',
    title: 'Junior Accountant',
    type: 'Full-time',
    place: 'Accra',
    urgent: 'Closes today',
    posted: 'Oct 2',
    applicants: '12',
    fresh: '+5',
    pipeline: '3',
    pipelineFill: 8,
    status: 'Active',
  },
  {
    id: 'marketing-intern',
    title: 'Marketing Intern',
    type: 'Internship',
    place: 'Accra',
    posted: 'Sep 28',
    applicants: '45',
    fresh: '+18',
    pipeline: '14',
    pipelineFill: 37,
    status: 'Active',
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    type: 'Full-time',
    place: 'Kumasi',
    posted: 'Sep 20',
    applicants: '31',
    fresh: '+6',
    pipeline: '9',
    pipelineFill: 24,
    status: 'Active',
  },
  {
    id: 'customer-service-trainee',
    title: 'Customer Service Trainee',
    type: 'Training programme',
    place: 'Tema',
    posted: 'Sep 12',
    applicants: '22',
    fresh: '+2',
    pipeline: '6',
    pipelineFill: 16,
    status: 'Active',
  },
];

/* ---------------------------------------------------------------- verification (D01) */
export const VERIFICATION = {
  title: 'Verification',
  subtitle: 'Earn the Verified badge on your postings',
  kyc: { title: 'KYC · You', text: 'Identity verified on Oct 3', chip: 'Verified' },
  kyb: (org) => ({
    title: `KYB · ${org}`,
    text: 'In review — 2 documents missing',
    chip: 'In review',
  }),
  documentsLabel: 'KYB DOCUMENTS',
  documents: [
    { id: 'registration', label: 'Registration certificate', status: 'Verified' },
    { id: 'tin', label: 'TIN certificate', status: 'Missing' },
    { id: 'licence', label: 'Recruitment licence', status: 'Missing' },
  ],
  note: 'Optional — you can keep posting while we verify. Only org owners can upload KYB documents.',
  upload: 'Upload missing documents',
  readOnly: 'Read-only',
};

/* ---------------------------------------------------------------- recruitment pipeline (D01) */
export const PIPELINE = {
  title: 'Recruitment pipeline',
  subtitle: '45 candidates across all opportunities · last 30 days',
  jobFilter: 'All opportunities',
  windows: ['7d', '30d', '90d'],
  stages: [
    { id: 'applied', label: 'Applied', sub: 'submitted', count: '45', bar: 140, opacity: 1 },
    {
      id: 'screening',
      label: 'Screening',
      sub: 'under review',
      count: '22',
      drop: '−51%',
      bar: 68,
      opacity: 0.85,
    },
    {
      id: 'shortlisted',
      label: 'Shortlisted',
      sub: 'shortlisted',
      count: '12',
      drop: '−45%',
      bar: 37,
      opacity: 0.7,
    },
    {
      id: 'interview',
      label: 'Interview',
      sub: 'scheduled + interviewed',
      count: '8',
      drop: '−33%',
      bar: 25,
      opacity: 0.55,
    },
    {
      id: 'offer',
      label: 'Offer extended',
      sub: 'pending + extended',
      count: '2',
      drop: '−75%',
      bar: 10,
      opacity: 0.42,
    },
    {
      id: 'accepted',
      label: 'Accepted',
      sub: 'accepted',
      count: '1',
      drop: '−50%',
      bar: 10,
      opacity: 0.3,
    },
  ],
  outflowLabel: 'OUTFLOW',
  rejected: 'Rejected · 14',
  withdrawn: 'Withdrawn · 3',
  insight: 'Most candidates drop off between Interview and Offer',
  hint: 'Tap a stage to see the candidates in it. Drop-off is measured against the previous stage.',
};

/* ---------------------------------------------------------------- feedback (D01) */
export const FEEDBACK = {
  title: 'Feedback',
  subtitle: 'Keep the candidate experience clean',
  viewAll: 'View all feedback',
  tabs: { give: 'Give feedback · 3', mine: 'My feedback · 4.5 ★' },
  action: 'Leave feedback',
  pending: [
    {
      id: 'elena',
      initials: 'ES',
      bg: '#ebf1ec',
      color: '#2a5730',
      name: 'Elena Sterling · Junior Accountant',
      due: 'Interviewed Oct 10 · due in 2 days',
    },
    {
      id: 'marcus',
      initials: 'MJ',
      bg: '#f5f3ff',
      color: '#6d28d9',
      name: 'Marcus Jensen · Data Analyst',
      due: 'Interviewed Oct 9 · due tomorrow',
    },
    {
      id: 'leila',
      initials: 'LW',
      bg: '#faf4e8',
      color: '#463409',
      name: 'Leila Wong · Marketing Intern',
      due: 'Interviewed Oct 8 · due today',
      overdue: true,
    },
  ],
};

/* ---------------------------------------------------------------- recommended talents (D01) */
export const TALENTS = {
  title: 'Recommended talents',
  subtitle: 'AI picks for your open roles · only what each talent allows you to see',
  job: 'Job: Junior Accountant',
  seeAll: 'See all matches',
  groupLabel: 'Top matches for Junior Accountant',
  groupCount: '5 candidates',
  view: 'View',
  invite: 'Invite',
  cards: [
    {
      id: 'akua',
      initials: 'AM',
      bg: '#ebf1ec',
      color: '#2a5730',
      name: 'Akua Mensah',
      sub: 'BSc Accounting · KNUST',
      fit: '92% fit',
      why: ['IFRS', 'Excel', 'Accra-based'],
    },
    {
      id: 'kofi',
      initials: 'KB',
      bg: '#f5f3ff',
      color: '#6d28d9',
      name: 'Kofi Boateng',
      sub: 'HND Accountancy · ATU',
      fit: '87% fit',
      why: ['QuickBooks', 'Payroll'],
    },
    {
      id: 'hidden',
      anonymous: true,
      name: 'Talent #4821',
      sub: 'Identity hidden until they respond',
      fit: '84% fit',
      why: ['Tally', 'Tax filing'],
    },
    {
      id: 'ama',
      initials: 'AS',
      bg: '#faf4e8',
      color: '#463409',
      name: 'Ama Serwaa',
      sub: 'ICAG Level 2 · Tema',
      fit: '81% fit',
      why: ['Audit', 'Excel'],
    },
    {
      id: 'yaw',
      initials: 'YD',
      bg: '#eaeffb',
      color: '#244a9f',
      name: 'Yaw Darko',
      sub: 'BCom · UCC',
      fit: '78% fit',
      why: ['Bookkeeping', 'Sage'],
    },
  ],
};

/* ---------------------------------------------------------------- in-demand skills (D01) */
export const SKILLS = {
  title: 'In-demand skills',
  subtitle: 'Last 30 days · Greater Accra · refreshed daily at 02:00',
  region: 'Greater Accra',
  industry: 'All industries',
  footnote: 'Aggregated and anonymised — groups smaller than 5 people are never shown.',
  hiddenRow: '< 5 — hidden for privacy',
  bands: [
    {
      id: 'hot',
      title: 'Hot',
      note: 'Very high demand',
      tone: 'hot',
      rows: [
        { name: 'Data Analyst', pay: 'GH₵ 6,000–9,500 / month', delta: '+32%' },
        { name: 'UX Designer', pay: 'GH₵ 5,500–9,000 / month', delta: '+27%' },
        { name: 'Cloud Engineer', pay: 'GH₵ 9,000–15,000 / month', delta: '+22%' },
        { name: 'Digital Marketer', pay: 'GH₵ 4,000–7,000 / month', delta: '+18%' },
        { name: 'Software Developer', pay: 'GH₵ 7,500–13,000 / month', delta: '+15%' },
      ],
    },
    {
      id: 'warm',
      title: 'Warm',
      note: 'High demand',
      tone: 'warm',
      rows: [
        { name: 'Bookkeeping', pay: 'GH₵ 3,000–5,000 / month', delta: '+8%' },
        { name: 'Customer Success', pay: 'GH₵ 3,500–5,500 / month', delta: 'Stable' },
        { name: 'Sales Executive', pay: 'GH₵ 3,000–6,000 / month', delta: '+6%' },
        { name: 'Project Coordinator', pay: 'GH₵ 4,500–7,500 / month', delta: 'Stable' },
        { name: 'HR Assistant', pay: 'GH₵ 3,200–5,000 / month', delta: '+4%' },
      ],
    },
    {
      id: 'cooling',
      title: 'Cooling',
      note: 'Declining demand',
      tone: 'cooling',
      rows: [
        { name: 'Receptionist', pay: 'GH₵ 2,000–3,200 / month', delta: '−12%' },
        { name: 'Data Entry Clerk', pay: 'GH₵ 1,800–2,800 / month', delta: '−9%' },
        { name: 'Cashier', pay: 'GH₵ 2,000–3,000 / month', delta: '−7%' },
        { name: 'Telemarketer', pay: 'GH₵ 1,900–2,900 / month', delta: '−5%' },
      ],
      hidden: true,
    },
  ],
};

/* ---------------------------------------------------------------- sidebar (Sidebar · talent 10068:42622) */
export const WORKSPACE_SIDEBAR = {
  name: 'Kwame Asante',
  badge: 'Pro',
  meta: 'Recruiter · MTN Ghana · Accra, GH',
  journeyLabel: 'Profile journey',
  journeyCount: '5 of 9',
  journeyPercent: (134 / 239) * 100,
  journeyNext: 'Continue: Portfolio →',
  stats: [
    { id: 'jobs', value: '4', label: 'Active Jobs' },
    { id: 'applicants', value: '128', label: 'Applicants' },
    { id: 'messages', value: '12', label: 'Messages' },
  ],
  plan: {
    title: 'Professional plan',
    upgrade: 'Upgrade',
    usage: [
      { id: 'posts', label: 'Job posts', value: '3 / 20', percent: (34 / 233) * 100 },
      { id: 'inmails', label: 'InMails', value: '18 / 50', percent: (81 / 233) * 100 },
    ],
  },
  url: 'gth.com/recruiter/kwame-asante',
  preview: 'Preview as talent',
  navBadges: { 'job-postings': '3' },
};

/* ---------------------------------------------------------------- active jobs: sort menu, row menu, dialogs, states (section 03, D20–D28) */
export const SORT_MENU = {
  label: 'Sort jobs by',
  options: [
    {
      value: 'urgent',
      label: 'Urgent first',
      description: 'Deadline within 7 days',
      icon: 'sortOptionUrgent',
    },
    {
      value: 'recent',
      label: 'Most recent',
      description: 'Newest publish date',
      icon: 'sortOptionRecent',
    },
    {
      value: 'applicants',
      label: 'Most applicants',
      description: 'Highest applicant count',
      icon: 'sortOptionApplicants',
    },
  ],
};

export const ROW_MENU = [
  { id: 'view', label: 'View job', icon: 'rowMenuViewJob' },
  { id: 'edit', label: 'Edit', icon: 'rowMenuEdit' },
  { id: 'pause', label: 'Pause', note: 'Hide from talents', icon: 'rowMenuPause' },
  { id: 'close', label: 'Close job', icon: 'rowMenuCloseJob', danger: true },
];

export const PAUSE_DIALOG = {
  title: (job) => `Pause ${job}?`,
  body: (applicants) =>
    `Talents won’t see this job while it’s paused. Your ${applicants} applicants stay in the pipeline.`,
  points: [
    { icon: 'dialogPauseHiddenEye', text: 'Hidden from search and recommendations' },
    { icon: 'dialogPausePipelineKept', text: 'Applicants and interviews are kept' },
    { icon: 'dialogPauseResumeAnytime', text: 'Resume anytime from Job Postings' },
  ],
  cancel: 'Cancel',
  confirm: 'Pause job',
};

export const CLOSE_DIALOG = {
  title: (job) => `Close ${job}?`,
  body: 'Closing ends the posting for good. Tell us why so we can improve your matches.',
  reasonLabel: 'Reason for closing *',
  reasons: ['Position filled', 'Hiring paused or budget cut', 'Posted by mistake', 'Other'],
  notify: (n) => `Let the ${n} candidates still in the pipeline know`,
  cancel: 'Keep job open',
  confirm: 'Close job',
};

export const JOBS_TOASTS = {
  paused: {
    tone: 'success',
    title: 'Success',
    body: 'Marketing intern is paused. Hidden from talents. 45 applicants kept',
    action: 'Undo',
  },
};

export const JOBS_STATES = {
  empty: {
    tone: 'mint',
    icon: 'emptyNoJobsBriefcase',
    title: 'No active jobs — post your first opportunity',
    body: 'Your live roles will appear here with applicant and pipeline counts. Posting takes about 5 minutes.',
    action: 'Post your first opportunity',
    actionIcon: 'emptyPostFirstOpportunityPlus',
  },
  suspended: {
    tone: 'danger',
    icon: 'emptySuspendedAlert',
    title: 'This organisation is currently suspended',
    body: (org) =>
      `Jobs for ${org} are hidden while our Trust & Safety team reviews the account. Contact support to find out more.`,
    action: 'Contact support',
    actionIcon: 'contactSupportMessage',
  },
  error: {
    tone: 'danger',
    icon: 'emptyLoadErrorWifiOff',
    title: "We couldn't load your jobs",
    body: 'Something went wrong on our side. Your postings are safe — try again in a moment.',
    action: 'Retry',
    actionIcon: 'retryRefresh',
  },
};

/* ---------------------------------------------------------------- recommended talents: filter, invite, hint, states (section 04, D30–D36) */
export const TALENT_FILTER = {
  label: 'Show matches for',
  options: [
    { value: 'all', label: 'All open roles', description: '19 matches' },
    { value: 'junior-accountant', label: 'Junior Accountant', description: '5 matches' },
    { value: 'marketing-intern', label: 'Marketing Intern', description: '5 matches' },
    { value: 'data-analyst', label: 'Data Analyst', description: '4 matches' },
    {
      value: 'customer-service-trainee',
      label: 'Customer Service Trainee',
      description: '5 matches · training',
    },
  ],
};

export const INVITE_DIALOG = {
  title: (name) => `Invite ${name} to apply`,
  body: 'She’ll get your invite in-app, by email and by SMS. Her full profile unlocks if she accepts.',
  candidate: 'BSc Accounting · KNUST · Accra',
  roleLabel: 'Role',
  role: 'Junior Accountant · Full-time · Accra',
  messageLabel: 'Message',
  message:
    'Hi Akua, your IFRS and Excel skills stood out. We’d love you to apply for our Junior Accountant role at MTN Ghana.',
  channelsLabel: 'Sent via',
  channels: ['In-app', 'Email', 'SMS'],
  limit: '12 of 100 daily invites used',
  cancel: 'Cancel',
  confirm: 'Send invite',
};

export const TALENT_TOASTS = {
  invited: {
    tone: 'success',
    title: 'Success - Invite sent to Akua Mensah',
    body: 'In-app, email and SMS · we’ll notify you when she responds',
  },
  saved: {
    tone: 'success',
    title: 'Success - Saved to pool',
    body: 'Kofi Boateng saved to your talent pool',
    action: 'Undo',
  },
};

export const HIDDEN_HINT = {
  title: 'Identity hidden',
  body: 'This talent chose “Visible only after I respond”. You can see their skills and fit, but not their name or photo.',
  action: 'Invite them to apply — if they accept, their full profile unlocks.',
};

export const TALENT_EMPTY = {
  title: 'Refine your job descriptions to unlock better matches',
  body: 'We couldn’t find strong matches for your open roles yet. Adding clear skills, location and level helps our AI find the right talents.',
  action: 'Edit job descriptions',
};

/* ---------------------------------------------------------------- recruitment pipeline: job filter, 7-day window, drill-in, states (section 05, D40–D44) */
export const PIPELINE_FILTER = {
  label: 'Show pipeline for',
  options: [
    { value: 'all', label: 'All opportunities', description: '45 candidates' },
    { value: 'junior-accountant', label: 'Junior Accountant', description: '12 candidates' },
    { value: 'marketing-intern', label: 'Marketing Intern', description: '45 candidates' },
    { value: 'data-analyst', label: 'Data Analyst', description: '31 candidates' },
    {
      value: 'customer-service-trainee',
      label: 'Customer Service Trainee',
      description: '22 candidates',
    },
  ],
};

/* D41 "7-day window": the funnel of the last 7 days. ⚠️ ASSUMPTION: 90d reuses the 30d numbers (no frame draws it). */
export const PIPELINE_7D = [
  { id: 'applied', count: '14', bar: 44, opacity: 1 },
  { id: 'screening', count: '9', drop: '−36%', bar: 28, opacity: 0.85 },
  { id: 'shortlisted', count: '5', drop: '−44%', bar: 16, opacity: 0.7 },
  { id: 'interview', count: '3', drop: '−40%', bar: 10, opacity: 0.55 },
  { id: 'offer', count: '1', drop: '−67%', bar: 10, opacity: 0.42 },
  { id: 'accepted', count: '0', drop: '−100%', bar: 10, opacity: 0.3 },
];

export const STAGE_DRAWER = {
  chip: 'Stage',
  title: (stage, count) => ({ stage, count: `${count} candidates` }),
  subtitle: (stageSub) => `${stageSub} · all opportunities · last 30 days`,
  tabs: [
    { id: 'all', label: 'All · 8' },
    { id: 'scheduled', label: 'Scheduled · 5' },
    { id: 'interviewed', label: 'Interviewed · 3' },
  ],
  open: 'Open in Application Pipeline',
  candidates: [
    {
      id: 'elena',
      initials: 'ES',
      bg: '#ebf1ec',
      color: '#2a5730',
      name: 'Elena Sterling',
      role: 'Junior Accountant',
      status: 'interviewed',
      when: 'Interviewed Oct 10',
    },
    {
      id: 'adam',
      initials: 'AS',
      bg: '#faf4e8',
      color: '#463409',
      name: 'Adam Sandler',
      role: 'Senior UX Designer',
      status: 'scheduled',
      when: 'Scheduled · Tue Oct 21, 2:00 PM',
    },
    {
      id: 'elliot',
      initials: 'EW',
      bg: '#f5f3ff',
      color: '#6d28d9',
      name: 'Elliot Whitmore',
      role: 'Data Analyst',
      status: 'scheduled',
      when: 'Scheduled · Wed Oct 22, 10:00 AM',
    },
    {
      id: 'sarah',
      initials: 'SJ',
      bg: '#eaeffb',
      color: '#244a9f',
      name: 'Sarah Jenkins',
      role: 'Data Analyst',
      status: 'interviewed',
      when: 'Interviewed Oct 8',
    },
    {
      id: 'kofi',
      initials: 'KB',
      bg: '#f5f3ff',
      color: '#6d28d9',
      name: 'Kofi Boateng',
      role: 'Junior Accountant',
      status: 'scheduled',
      when: 'Scheduled · Thu Oct 23, 11:30 AM',
    },
  ],
};

export const PIPELINE_STATES = {
  empty: {
    subtitle: '3 candidates · last 30 days',
    title: 'Too few candidates to draw a funnel — keep posting and inviting',
    body: 'We need at least 5 applications before showing drop-off, so the numbers aren’t misleading.',
    action: 'Invite recommended talents',
  },
  loading: { subtitle: 'Loading pipeline…' },
};

/* ---------------------------------------------------------------- verification states + upload dialog (section 06, D50–D55) */
export const VERIFICATION_STATES = {
  verified: {
    kybText: 'Organisation verified on Oct 14',
    kybChip: 'Verified',
    banner: {
      title: 'Verified recruiter',
      text: 'Your postings now show the trust badge to talents.',
    },
  },
  rejected: {
    kybText: '1 document rejected',
    kybChip: 'Action needed',
    why: {
      title: 'Why it was rejected',
      text: 'The scan is blurry and the TIN number can’t be read. Upload a clearer copy.',
      cooldown: 'You can re-upload in 18 hours (24-hour cooldown)',
    },
    reupload: 'Re-upload available in 18h',
  },
  owner: {
    kybText: '1 document rejected',
    kybChip: 'Action needed',
    title: 'Only org owners can upload KYB documents',
    text: 'Ask Ama Owusu (owner of MTN Ghana) to upload them. You can still post jobs.',
    action: 'Notify Ama Owusu',
  },
};

export const UPLOAD_DIALOG = {
  title: 'Upload KYB documents',
  subtitle: (org) => `${org} · PDF, JPG or PNG · max 10 MB each`,
  typeLabel: 'Document type *',
  types: ['Registration certificate', 'TIN certificate', 'Recruitment licence'],
  dropLead: (type) => `Drag & drop your ${type}, or`,
  browse: 'browse',
  privacy: 'Docs are encrypted and only seen by the GTH verification team.',
  cancel: 'Cancel',
  upload: 'Upload',
  uploading: 'Uploading...',
  files: [
    {
      id: 'tin',
      name: 'TIN_certificate_MTN.pdf',
      size: '2.4 MB',
      status: 'Uploading · 64%',
      progress: 64,
    },
    {
      id: 'licence',
      name: 'Recruitment_licence_2026.jpg',
      size: '1.1 MB',
      status: 'Queued',
      progress: 0,
    },
  ],
};

export const VERIFICATION_TOASTS = {
  uploaded: {
    tone: 'success',
    title: 'Success - 2 documents uploaded',
    body: 'We’ll review them within 2 working days',
  },
};

/* ---------------------------------------------------------------- in-demand skills: filters, national view, states (section 07, D60–D64) */
export const SKILLS_REGIONS = {
  label: '',
  options: [
    {
      value: 'national',
      label: 'Ghana · National',
      description: 'All regions',
      icon: 'regionOptionNationalGlobe',
    },
    { kind: 'label', label: 'Regions' },
    {
      value: 'accra',
      label: 'Greater Accra',
      description: 'Your region',
      icon: 'regionOptionMapPin',
    },
    { value: 'ashanti', label: 'Ashanti', icon: 'regionOptionMapPin' },
    { value: 'western', label: 'Western', icon: 'regionOptionMapPin' },
    { value: 'central', label: 'Central', icon: 'regionOptionMapPin' },
    { value: 'eastern', label: 'Eastern', icon: 'regionOptionMapPin' },
    { value: 'northern', label: 'Northern', icon: 'regionOptionMapPin' },
    { value: 'upper-west', label: 'Upper West', tag: 'Low data', icon: 'regionOptionMapPin' },
  ],
};

export const SKILLS_INDUSTRIES = {
  options: [
    { value: 'all', label: 'All industries', icon: 'industryOptionBuilding' },
    { value: 'technology', label: 'Technology', icon: 'industryOptionBuilding' },
    { value: 'finance', label: 'Finance', icon: 'industryOptionBuilding' },
    { value: 'healthcare', label: 'Healthcare', icon: 'industryOptionBuilding' },
    { value: 'education', label: 'Education', icon: 'industryOptionBuilding' },
    { value: 'manufacturing', label: 'Manufacturing', icon: 'industryOptionBuilding' },
    { value: 'agriculture', label: 'Agriculture', icon: 'industryOptionBuilding' },
    { value: 'hospitality', label: 'Hospitality', icon: 'industryOptionBuilding' },
  ],
};

/* D62 "Ghana · National": the rows that differ from Greater Accra (Hot rows 1–3, Cooling row 1). */
export const SKILLS_NATIONAL_ROWS = {
  hot: [
    { name: 'Data Analyst', pay: 'GH₵ 5,000–8,500 / month', delta: '+29%' },
    { name: 'Agronomist', pay: 'GH₵ 5,500–9,000 / month', delta: '+24%' },
    { name: 'Nurse', pay: 'GH₵ 3,800–6,000 / month', delta: '+22%' },
  ],
  cooling: [{ name: 'Typist', pay: 'GH₵ 2,000–3,200 / month', delta: '−12%' }],
};

export const SKILLS_STATES = {
  sparse: {
    subtitle: 'Last 30 days · Upper West',
    regionLabel: 'Upper West',
    icon: 'emptySparseRegionMapPin',
    title: 'Not enough activity in this region yet',
    body: 'Upper West had fewer than 50 job postings in the last 30 days, so trends wouldn’t be reliable.',
    action: 'Switch to National view',
    actionIcon: 'emptySwitchNationalGlobe',
  },
  none: {
    subtitle: 'Last 30 days · Tamale · Agriculture',
    regionLabel: 'Northern · Tamale',
    industryLabel: 'Agriculture',
    icon: 'emptyNoDemandSignalFlame',
    title: 'No agriculture demand signal yet for Tamale',
    body: 'Try another industry, or widen to the whole Northern region or national view.',
    action: 'Clear industry filter',
  },
};

/* ---------------------------------------------------------------- feedback inbox (section 08, D70–D74) */
export const FEEDBACK_MINE = {
  score: '4.5',
  stars: 4.5,
  caption: 'From 12 candidate ratings · raters stay anonymous',
  reviews: [
    {
      id: 'r1',
      stars: 5,
      who: 'A candidate · Junior Accountant',
      when: '2 days ago',
      text: '“Clear process and quick feedback after my interview.”',
    },
    {
      id: 'r2',
      stars: 4,
      who: 'A candidate · Marketing Intern',
      when: '1 week ago',
      text: '“Friendly interviewers — would love more detail on next steps.”',
    },
    {
      id: 'r3',
      stars: 4,
      who: 'A candidate · Data Analyst',
      when: '2 weeks ago',
      text: '“The assessment matched the role well.”',
    },
  ],
};

export const FEEDBACK_DIALOG = {
  title: (name) => `Feedback for ${name}`,
  body: (role, date, first) =>
    `${role} · interviewed ${date}. ${first} sees your feedback; your name stays with MTN Ghana.`,
  ratingLabel: 'Overall rating *',
  groupLabel: 'How did they do?',
  criteria: ['Communication', 'Technical skills', 'Culture fit'],
  levels: ['Needs work', 'Good', 'Strong'],
  textLabel: (first) => `What should ${first} know?`,
  placeholder: 'Share specific, kind feedback — strengths and one thing to improve.',
  counterSuffix: ' · minimum 20',
  tooShort: 'Tell us more — minimum 20 characters',
  cancel: 'Cancel',
  submit: 'Submit feedback',
};

export const FEEDBACK_TOASTS = {
  sent: {
    tone: 'success',
    title: 'Success - Feedback sent to Elena Sterling',
    body: 'Thanks for keeping candidates in the loop',
  },
};

export const FEEDBACK_WITHDREW = {
  text: 'Candidate withdrew — feedback no longer required',
  chip: 'Closed',
};

/* ---------------------------------------------------------------- top bar panels (section 02, D10–D17) */
export const NOTIFICATIONS_PANEL = {
  title: 'Notifications',
  newSticker: '5 new',
  subtitle: 'What’s been happening on your career side',
  tabs: [
    { id: 'all', label: 'All' },
    { id: 'applications', label: 'Applications', count: '5' },
    { id: 'interviews', label: 'Interviews' },
    { id: 'affiliation', label: 'Affiliation' },
    { id: 'system', label: 'System' },
  ],
  groups: [
    {
      id: 'today',
      label: 'TODAY',
      rows: [
        {
          id: 'akua',
          type: 'applications',
          avatar: 'notificationAvatarAkuaMensahApplied',
          title: 'Akua Mensah applied to Junior Accountant',
          meta: 'Applications',
          time: 'now',
          unread: true,
          actions: [
            { id: 'shortlist', label: 'Shortlist', tone: 'primary' },
            { id: 'pipeline', label: 'See pipeline', tone: 'secondary' },
          ],
        },
        {
          id: 'elena',
          type: 'interviews',
          avatar: 'notificationAvatarElenaSterlingInterview',
          title: 'Interview with Elena Sterling at 2:00 PM today',
          meta: 'Interviews',
          time: '2m',
          unread: true,
          actions: [{ id: 'details', label: 'See Details', tone: 'secondary' }],
        },
        {
          id: 'ama',
          type: 'affiliation',
          avatar: 'notificationAvatarAmaOwusuAffiliation',
          title: 'Ama Owusu approved your request to join MTN Ghana',
          meta: 'Affiliation',
          time: '3h',
          unread: true,
        },
      ],
    },
    {
      id: 'earlier',
      label: 'EARLIER',
      rows: [
        {
          id: 'kofi',
          type: 'applications',
          initials: 'KB',
          bg: '#f5f3ff',
          color: '#6d28d9',
          title: 'Kofi Boateng accepted your invite to apply',
          meta: 'Applications',
          time: 'Mon',
        },
        {
          id: 'kyb',
          type: 'system',
          system: true,
          title: 'KYB document rejected — TIN certificate',
          meta: 'System',
          time: 'Sun',
        },
      ],
    },
  ],
  settings: 'Settings',
  seeEverything: 'See everything',
  empty: {
    sticker: 'chill mode',
    subtitle: 'Nothing new. Go touch grass',
    title: 'You’re all caught up ',
    body: 'New applicants, interview reminders and affiliation updates will show up here.',
    primary: 'Search Talents',
    secondary: 'Notification settings',
  },
  offline: {
    tone: 'warning',
    title: 'Warning',
    body: "You're offline. Showing your last known notification count (5+). We’ll refresh when you reconnect.",
  },
};

export const LANGUAGE_MENU = {
  label: 'Language',
  options: [
    { id: 'en', name: 'English (Ghana)', code: 'EN-GH · default' },
    { id: 'tw', name: 'Twi (Akan)', code: 'TW-GH' },
    { id: 'ee', name: 'Ewe', code: 'EE-GH' },
    { id: 'gaa', name: 'Ga', code: 'GAA-GH' },
    { id: 'dag', name: 'Dagbani', code: 'DAG-GH', soon: 'Coming soon' },
  ],
  note: 'Untranslated text falls back to English and is marked with a dotted underline.',
};

/* ---------------------------------------------------------------- global search (section 02, D13–D15) */
export const SEARCH_PANEL = {
  placeholder: 'Search opportunities, skills, communities...',
  categories: [
    { id: 'all', label: 'All', count: '3' },
    { id: 'people', label: 'People', count: '2' },
    { id: 'applications', label: 'Application', count: '1' },
    { id: 'jobs', label: 'Jobs', count: '0' },
  ],
  recentLabel: 'RECENT SEARCHES',
  recents: [
    {
      id: 'kumasi',
      title: 'Data Analyst in Kumasi',
      sub: 'Jobs',
      icon: 'searchRecentSelectedTile',
      hint: 'Enter to open',
    },
    { id: 'kofi', title: 'Kofi Boateng', sub: 'Candidates', icon: 'searchRecentCandidatesTile' },
    {
      id: 'marketing',
      title: 'Marketing Intern applicants',
      sub: 'Applications',
      icon: 'searchRecentApplicationsTile',
    },
  ],
  quickLabel: 'QUICK FILTERS',
  quick: [
    {
      id: 'pipeline',
      title: 'View Pipeline',
      sub: '8 in interview · 12 shortlisted',
      icon: 'searchQuickViewPipelineTile',
    },
    {
      id: 'saved',
      title: 'Saved Talents',
      sub: '14 saved · 3 open to work',
      icon: 'searchQuickSavedTalentsTile',
    },
    {
      id: 'deadlines',
      title: 'Job Deadlines',
      sub: '2 jobs closing this week',
      icon: 'searchQuickJobDeadlinesTile',
    },
  ],
  keys: [
    { key: '↑ ↓', label: 'to move' },
    { key: 'Enter', label: 'to open' },
    { key: 'Esc', label: 'to close' },
  ],
  assistant: {
    title: (q) => `Ask Hiring Assistant: “Talents similar to ${q}”`,
    sub: 'Get a ranked answer with reasons',
    key: 'Tab',
  },
  peopleLabel: 'PEOPLE · 2',
  people: [
    {
      id: 'akua',
      name: 'Akua Mensah',
      sub: 'BSc Accounting · KNUST · Accra',
      avatar: 'searchResultPersonAkuaMensah',
      hint: 'Enter to open',
    },
    {
      id: 'owusu',
      name: 'Akua Owusu-Ansah',
      sub: 'Marketing graduate · UCC · Cape Coast',
      avatar: 'searchResultPersonAkuaOwusuAnsah',
    },
  ],
  applicationsLabel: 'APPLICATIONS · 1',
  application: {
    title: 'Akua Mensah → Junior Accountant',
    sub: 'Applied Oct 2',
    status: 'Screening',
  },
  jobsLabel: 'JOBS · 0',
  noJobs: { title: 'No jobs', sub: (q) => `No jobs match “${q}”` },
  seeAll: 'See all 3 results',
  scope: 'Showing candidates for MTN Ghana only — each talent’s visibility settings apply.',
  none: {
    title: (q) => `No results for “${q}”`,
    body: 'Check the spelling, or search by a skill, job title or school. You can only find candidates who allow recruiters to see them.',
  },
};
