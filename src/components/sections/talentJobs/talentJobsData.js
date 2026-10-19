import farmerline from '../../../assets/talent-jobs/logos/farmerline.svg';
import accraTech from '../../../assets/talent-jobs/logos/accra-tech.svg';
import mtn from '../../../assets/talent-jobs/logos/mtn-ghana.svg';
import hubtel from '../../../assets/talent-jobs/logos/hubtel.svg';
import zeepay from '../../../assets/talent-jobs/logos/zeepay.svg';
import face1 from '../../../assets/talent-jobs/faces/banner-face-1.png';
import face2 from '../../../assets/talent-jobs/faces/banner-face-2.png';
import face3 from '../../../assets/talent-jobs/faces/banner-face-3.png';

/*
 * Talent Job Postings mock data — copy verbatim from Figma (file Bin8roWL8sloyc36IgFMuT, canvas "Talent Job
 * Postings"; Playful J-01 7503:104 / Focused 8110:409276). Shaped like the future API payload:
 * `{ id, company: {name, logo, confidential, sector}, title, location, type, pay, match, why[], posted,
 *   signal, isNew }` — swap `JOB_LIST` for a fetch and nothing else changes.
 */
export let JOBS_HEADER = {
  title: 'Job Postings',
  subtitle: 'Roles where recruiters are already seeing you, plus everything else that’s open.',
  stickers: {
    matched: '2 new matches',
    browse: '2 new matches',
    saved: '3 saved',
    applied: '1 interview',
    empty: 'new here?',
  },
  decor: {
    viewed: '9 recruiters viewed you',
    daily: 'Matches update daily',
    week: '5 new this week',
  },
};

export let JOB_TAB_LIST = [
  { id: 'matched', label: 'Matched to you', count: '6', amber: true },
  { id: 'browse', label: 'Browse all', count: '142' },
  { id: 'saved', label: 'Saved', count: '3' },
  { id: 'applied', label: 'Applied', count: '4' },
];

export const MATCH_FILTERS = ['All', '80%+ match', 'Remote / Hybrid', 'Internships', 'Accra'];
export const SORTS = {
  matched: 'Best match',
  browse: 'Newest',
  saved: 'Best match',
  applied: 'Most recent',
};
export const ALERTS_BUTTON = 'Match alerts · 75%+';

export let DISCOVERY = {
  faces: [face1, face2, face3],
  title: 'Recruiters can already see you for these 6 roles',
  body: 'You don’t need to apply to be discovered. Applying puts you at the top of their list.',
  sticker: 'no CV needed',
};

export let JOB_LIST = [
  {
    id: 'data-science-intern',
    company: { name: 'Farmerline', logo: farmerline },
    signal: 'Owura viewed you',
    isNew: true,
    title: 'Data Science Intern',
    location: 'Kumasi · Remote-first',
    type: 'Internship',
    pay: 'GHS 2,500–3,500 / mo',
    match: 88,
    why: ['SQL (verified)', 'Python', 'Data storytelling'],
    posted: 'Posted 2d ago',
    age: '2d',
  },
  {
    id: 'data-analyst',
    company: { name: 'Accra Tech Ltd', logo: accraTech },
    signal: 'New match',
    isNew: true,
    title: 'Data Analyst',
    location: 'Accra · On-site',
    type: 'Full-time',
    pay: 'GHS 4,500–6,000 / mo',
    match: 82,
    why: ['SQL (verified)', 'Excel', 'Lives in Accra'],
    posted: 'Posted Today',
    age: 'Today',
  },
  {
    id: 'junior-product-analyst',
    company: {
      name: 'Confidential company',
      sector: 'Fintech · 50–200 people',
      confidential: true,
    },
    title: 'Junior Product Analyst',
    location: 'Accra · Hybrid',
    type: 'Full-time',
    pay: 'Salary shared later',
    match: 78,
    why: ['Analytics', 'User research', 'BSc completed'],
    posted: 'Posted 3d ago',
    age: '3d',
  },
  {
    id: 'graduate-data-analyst',
    company: { name: 'MTN Ghana', logo: mtn },
    signal: '2 recruiters viewed you',
    title: 'Graduate Data Analyst',
    location: 'Accra · On-site',
    type: 'Graduate',
    pay: 'GHS 5,000–7,000 / mo',
    match: 76,
    why: ['SQL (verified)', 'Statistics', 'BSc completed'],
    posted: 'Posted 4d ago',
    age: '4d',
  },
  {
    id: 'bi-intern',
    company: { name: 'Hubtel', logo: hubtel },
    signal: '5d ago',
    title: 'BI Intern',
    location: 'Remote',
    type: 'Internship',
    pay: 'GHS 2,000–3,000 / mo',
    match: 74,
    why: ['Excel', 'Dashboards', 'Data cleaning'],
    posted: 'Posted 5d ago',
    age: '5d',
  },
  {
    id: 'junior-data-engineer',
    company: { name: 'Zeepay', logo: zeepay },
    signal: '1w ago',
    title: 'Junior Data Engineer',
    location: 'Accra · Hybrid',
    type: 'Full-time',
    pay: 'GHS 4,000–5,500 / mo',
    match: 71,
    why: ['Python', 'SQL (verified)', 'Git'],
    posted: 'Posted 1w ago',
    age: '1w',
  },
];

/* Browse all (J-18) rows — "Not matched yet" rows have no match %. */
export let BROWSE_COPY = {
  search: 'Search roles, companies or skills…',
  filters: ['Location', 'Job type', 'Pay', 'Industry'],
  count: '142 open roles in Ghana',
  onlyMine: 'Only show my matches',
  unmatched: 'Not matched yet',
};
export let BROWSE_ROWS = [
  {
    id: 'data-science-intern',
    title: 'Data Science Intern',
    meta: 'Farmerline · Kumasi · Remote-first · Internship',
    match: 88,
    age: '2d',
  },
  {
    id: 'customer-insights-associate',
    title: 'Customer Insights Associate',
    meta: 'Ecobank Ghana · Accra · On-site · Full-time',
    match: null,
    age: 'Today',
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    meta: 'Accra Tech Ltd · Accra · On-site · Full-time',
    match: 82,
    age: 'Today',
  },
  {
    id: 'marketing-intern',
    title: 'Marketing Intern',
    meta: 'Jumia Ghana · Accra · Hybrid · Internship',
    match: null,
    age: '1d',
  },
  {
    id: 'graduate-data-analyst',
    title: 'Graduate Data Analyst',
    meta: 'MTN Ghana · Accra · On-site · Graduate',
    match: 76,
    age: '4d',
  },
  {
    id: 'junior-software-tester',
    title: 'Junior Software Tester',
    meta: 'Kudzo Ltd · Remote · Contract',
    match: 58,
    age: '5d',
  },
  {
    id: 'field-operations-trainee',
    title: 'Field Operations Trainee',
    meta: 'Vodafone Ghana · Tamale · On-site · Graduate',
    match: null,
    age: '1w',
  },
];

/* Saved (J-19) */
export let SAVED_COPY = {
  filters: [
    { id: 'all', label: 'All', count: '3' },
    { id: 'open', label: 'Open', count: '2' },
    { id: 'closed', label: 'Closed', count: '1' },
  ],
  notice: '1 saved role closes in 2 days. Saved roles are removed 7 days after they close.',
  closesIn: 'Closes in 2 days',
  closed: 'Closed',
  remove: 'Remove',
  view: 'View opportunity',
};
/* id -> status ("closing" = closes in 2 days, "closed"), in Figma order */
export let SAVED_JOBS = [
  { id: 'data-science-intern', status: 'open' },
  { id: 'graduate-data-analyst', status: 'closing' },
  { id: 'junior-data-engineer', status: 'closed' },
];

/* Applied (J-10) */
export let APPLIED_COPY = {
  filters: [
    { id: 'all', label: 'All', count: '4' },
    { id: 'active', label: 'Active', count: '3' },
    { id: 'interviews', label: 'Interviews', count: '1' },
    { id: 'closed', label: 'Closed', count: '1' },
  ],
  steps: ['Sent', 'Seen', 'Shortlisted', 'Interview', 'Offer'],
  withdrawnStatus: 'Withdrawn by you',
  withdrawnAction: 'Apply again',
  tip: 'Tip: recruiters reply faster to talents with a verified skill. You have 1.',
};
/* step = index of the reached step in APPLIED_COPY.steps; tone good|plain|closed */
export let APPLIED_ROWS = [
  {
    id: 'data-science-intern',
    title: 'Data Science Intern',
    meta: 'Farmerline · Applied 9 Oct',
    step: 3,
    status: 'Interview Thu 16 Oct',
    tone: 'good',
    action: 'View invite',
    group: 'interviews',
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    meta: 'Accra Tech Ltd · Applied 2 days ago',
    step: 1,
    status: 'Seen by Ama',
    tone: 'plain',
    action: 'Prep with Buddy',
    group: 'active',
  },
  {
    id: 'graduate-data-analyst',
    title: 'Graduate Data Analyst',
    meta: 'MTN Ghana · Applied 5 days ago',
    step: 0,
    status: 'Sent · waiting for reply',
    tone: 'plain',
    action: 'View posting',
    group: 'active',
  },
  {
    id: 'junior-data-analyst',
    title: 'Junior Data Analyst',
    meta: 'Kudzo Ltd · Applied 28 Sep',
    step: 0,
    status: 'Not this time',
    tone: 'closed',
    action: 'See what to boost',
    group: 'closed',
  },
];

/* Empty matches (J-07) */
export let EMPTY_COPY = {
  title: 'No matches… yet',
  body: 'Recruiters find talent by skills and location. Give them more to go on and matches start rolling in, usually within a day.',
  steps: [
    { title: 'Add 3 more skills', sub: '+ more matches' },
    { title: 'Verify a skill in Skills Lab', sub: 'Recruiters filter for this' },
    { title: 'Finish your profile', sub: '1 of 5 done' },
  ],
  primary: 'Boost my profile',
  secondary: 'Browse all 142 postings',
};

export const LOADING_COPY = 'Finding roles that fit you…';
export let MATCH_FOOTER = {
  done: "That's all 6 for today",
  sub: 'New matches land every morning.',
  link: 'Browse all 142 roles →',
};

/* ---- pass c: settings, alerts and dialogs (J-06, J-08, J-15, J-16, J-17, J-20, J-21, HP) ---- */
import {
  HELP_COPY as HELP_COPY_DEFAULT,
  NOTIFICATIONS,
} from '../notifications/notificationsData.js';
import notifAma from '../../../assets/notifications/avatars/ama.png';
import notifMatchA from '../../../assets/notifications/avatars/match-a.png';
import notifMatchB from '../../../assets/notifications/avatars/match-b.png';
import notifMatchC from '../../../assets/notifications/avatars/match-c.png';
import notifKudzo from '../../../assets/notifications/avatars/kudzo.png';
import notifBuddy from '../../../assets/notifications/avatars/buddy.png';

/*
 * Dialog payloads (Figma: Playful J-06 7507:492, J-08 7508:599, J-15 7511:1329, J-16 7511:1811, J-17 7511:2519,
 * J-20 7518:5291, J-21 7518:5803; Focused twins 8110:411661 / 412649 / 416059 / 416512 / 417177 / 418481 / 418960).
 * Everything is verbatim Figma copy. Fields shaped like the future API: `alerts` is the saved preference,
 * `matchBreakdown[jobId]` the per-job fit factors, the reason lists are the pick-lists the backend will own.
 */
export const JOB_DIALOGS = {
  /* J-06 Match alerts settings (popover under "Match alerts · 75%+") */
  alerts: {
    title: 'Match alerts',
    sticker: 'you’re in control',
    sub: 'Get pinged when a new role matches you this well.',
    pingLabel: 'Ping me at',
    threshold: 75,
    min: 60,
    max: 95,
    step: 5,
    minLabel: '60% · more alerts',
    maxLabel: '95% · only the best',
    // Figma only draws the 75% preview ("4 alerts this week"). The other steps are mock values (ASSUMPTION).
    weekCounts: { 60: 9, 65: 7, 70: 5, 75: 4, 80: 3, 85: 2, 90: 1, 95: 1 },
    channelsLabel: 'WHERE TO PING YOU',
    channels: [
      { id: 'gth', label: 'In GTH', on: true, icon: 'bell' },
      { id: 'email', label: 'Email', on: true, icon: 'mail' },
      { id: 'push', label: 'Push on my phone', on: false, icon: 'phone' },
    ],
    cap: 'Max 5 alerts a day. Any extras come together in one summary at 8pm.',
    cancel: 'Cancel',
    save: 'Save alerts',
  },

  /* J-08 notification doc: the Notifications pop-up opened over the matched list, with match rows */
  notifications: {
    // Rows 1-3 are drawn unread (tinted); "Earlier" re-uses the existing badge row + a Career Buddy summary row.
    items: [
      {
        id: 'jn-match-82',
        type: 'profileView',
        group: 'today',
        unread: true,
        title: 'You’re an 82% match for Data Analyst at Accra Tech Ltd',
        body: 'Accra · Full-time · GHS 4,500–6,000 / mo',
        time: '2m',
        avatars: [notifAma],
        actions: [
          { label: 'View opportunity', tone: 'primary' },
          { label: 'Not now', tone: 'secondary' },
        ],
      },
      {
        id: 'jn-match-78',
        type: 'matches',
        group: 'today',
        unread: true,
        title: 'You’re a 78% match for Junior Product Analyst at a confidential company',
        body: 'Accra · Hybrid · Fintech · name hidden by recruiter',
        time: '1h',
        avatars: [notifMatchA, notifMatchB, notifMatchC],
        actions: [{ label: 'View opportunity', tone: 'secondary' }],
      },
      {
        id: 'jn-summary',
        type: 'interview',
        group: 'today',
        unread: true,
        title: 'You have 3 more matches today',
        body: 'You hit your 5-a-day limit, so here they are in one go.',
        time: '8 PM',
        avatars: [notifKudzo],
        actions: [{ label: 'See them in Job Postings', tone: 'secondary' }],
      },
      NOTIFICATIONS.find((n) => n.id === 'badge'),
      {
        id: 'jn-buddy',
        type: 'buddy',
        group: 'earlier',
        title: 'You have 3 more matches today',
        body: 'You hit your 5-a-day limit, so here they are in one go. View them in Job Postings.',
        time: '8 PM',
        avatars: [notifBuddy],
      },
    ],
  },

  /* J-15 "How your 82% works" (popover on the job detail), keyed by job id; default = data-analyst */
  matchTitle: 'How your {match}% works',
  matchBreakdown: {
    'data-analyst': {
      company: 'Accra Tech',
      intro: 'We compare your profile with what {company} asked for. More green = closer fit.',
      factors: [
        {
          id: 'skills',
          icon: 'spark',
          label: 'Skills',
          tag: 'Strong',
          pct: 80,
          note: '4 of 5 skills they want',
        },
        {
          id: 'education',
          icon: 'grad',
          label: 'Education',
          tag: 'Match',
          pct: 100,
          note: 'BSc matches what they asked for',
        },
        {
          id: 'location',
          icon: 'pin',
          label: 'Location',
          tag: 'Match',
          pct: 100,
          note: 'You’re in Accra, the role is in Accra',
        },
        {
          id: 'profile',
          icon: 'user',
          label: 'Profile strength',
          tag: 'Room to grow',
          pct: 30,
          note: '1 of 5 setup steps done',
          tone: 'amber',
        },
      ],
      footnote: 'Change your profile and your score updates within a minute.',
    },
  },

  /* J-16 "Not for you?" */
  notForMe: {
    title: 'Not for you?',
    closeLabel: 'Close',
    prompt: 'Tell us why and we’ll send better matches.',
    defaultJob: 'bi-intern',
    reasons: [
      { id: 'pay', label: 'Pay is too low' },
      { id: 'location', label: 'Wrong location' },
      { id: 'field', label: 'Not my field' },
      { id: 'fulltime', label: 'I want full-time' },
      { id: 'company', label: 'Not this company' },
      { id: 'other', label: 'Something else' },
    ],
    selected: ['pay', 'fulltime'],
    info: 'We’ll hide this match and show fewer roles like it. {company} won’t be told.',
    cancel: 'Cancel',
    confirm: 'Hide this match',
  },

  /* J-17 "Report this posting" */
  report: {
    title: 'Report this posting',
    defaultJob: 'junior-product-analyst',
    reasons: [
      { id: 'pay', label: 'They asked me to pay to apply or for training' },
      { id: 'details', label: 'They asked for my MoMo PIN, Ghana Card or bank details' },
      { id: 'fake', label: 'Fake company or pretending to be someone else' },
      { id: 'misleading', label: 'Pay or role is misleading' },
      { id: 'offensive', label: 'Offensive or discriminatory' },
      { id: 'other', label: 'Something else' },
    ],
    selected: 'pay',
    placeholder:
      'Add details (optional). E.g. “They sent a MoMo number for a GHS 200 training fee.”',
    safety:
      'Real employers on GTH never ask you to pay to apply. Never share your MoMo PIN with anyone.',
    cancel: 'Cancel',
    confirm: 'Send report',
    footnote: 'We review reports within 24 hours. The recruiter won’t see who reported.',
  },

  /* J-20 withdraw confirm */
  withdraw: {
    title: 'Withdraw your application?',
    defaultJob: 'data-analyst',
    body: '{title} at {company}. They’ll see you withdrew. You can apply again while the role is still open.',
    reasonsLabel: 'WHY? (OPTIONAL)',
    reasons: [
      { id: 'offer', label: 'I took another offer' },
      { id: 'mind', label: 'Changed my mind' },
      { id: 'mistake', label: 'Applied by mistake' },
      { id: 'changed', label: 'Pay or location changed' },
      { id: 'other', label: 'Other' },
    ],
    selected: 'offer',
    note: 'Your reason stays private. It only helps us improve your matches.',
    confirm: 'Yes, withdraw',
    keep: 'Keep my application',
  },

  /* J-21 toast on the Applied tab after withdrawing */
  withdrawnToast: {
    title: 'Application withdrawn',
    body: 'Accra Tech has been told. Congrats on the offer!',
    undo: 'Undo',
    // J-21 also redraws the withdrawn job's Applied row (status pill + action); the lead's list can read this.
    row: { jobId: 'data-analyst', status: 'Withdrawn by you', action: 'Apply again' },
  },
};

/*
 * HP: Help pop-over "for this page · Jobs" (Playful 8376:501980 / Focused 8376:502100). Same shape as
 * HELP_COPY in notifications/notificationsData.js; HelpPopover would pick it with `helpPage: 'jobs'`.
 */
export const JobsHelpCopy = {
  ...HELP_COPY_DEFAULT,
  pageLabel: 'FOR THIS PAGE · JOBS',
  page: [
    { label: 'How is my fit score worked out?', icon: 'help' },
    { label: 'How do I know a job is real?', icon: 'help' },
    { label: 'Can I withdraw an application?', icon: 'help' },
  ],
};

/* ---- pass b: posting detail + apply flow (Figma J-02 / J-03 / J-04 / J-05 / J-09 / J-11 / J-12 / J-14) ----
 * Payload shape = the future `GET /jobs/:id` response. `JOB_DETAILS` is keyed by the same id as `JOB_LIST`;
 * a job without an entry still renders (hero + match card + matched skills from `JOB_LIST`) — only the two
 * jobs drawn in Figma (`data-analyst`, `junior-product-analyst`) carry the long-form content.
 */
export const JOB_DETAIL_COPY = {
  backPrefix: 'Back to ',
  crumbPrefix: '·  Job Postings / ',
  verified: 'Verified employer',
  hidden: 'Name hidden by recruiter',
  apply: 'Apply with my GTH profile',
  applied: 'Applied',
  save: 'Save for later',
  hint: 'Takes 1 minute. You’ll preview what they see first.',
  report: 'Report posting',
  yourMatch: 'YOUR MATCH',
  how: 'How is this worked out?',
  aboutTitle: 'About the role',
  skillsTitle: 'Skills they want',
  hiring: 'WHO’S HIRING',
  yourApplication: 'Your application',
  prep: 'Prep with Career Buddy',
  withdraw: 'Withdraw application',
  closedTitle: 'This role has closed',
  closedButton: 'Applications closed',
  closedBadge: 'Closed',
  similarTitle: 'Still open for you',
  confidentialNote:
    'This company is hiring quietly. You’ll see who they are when the recruiter replies to your application.',
};

/* Applying: profile preview (J-04 / J-12 / J-14) and the "sent" celebration (J-05). `{token}` = template slot. */
export const APPLY_COPY = {
  step: 'STEP 1 OF 2 · PREVIEW',
  title: 'This is what {company} will see',
  sub: 'Your profile, exactly as their recruiter sees it for this role.',
  forThisRole: 'for this role',
  hiddenTitle: 'You’ve hidden Projects',
  hiddenNote: 'This lowers your match for this role by about {loss}.',
  showProjects: 'Show Projects for this role',
  shownTitle: 'Projects are now visible for this role',
  shownNote: 'Your match went up from {from}% to {to}%. Nice move.',
  justChanged: 'just changed',
  editProfile: 'Edit profile',
  editVisibility: 'Edit visibility',
  privacy: 'Your email and phone stay private.',
  cancel: 'Cancel',
  cont: 'Continue application',
  close: 'Close',
  offlineTitle: 'Your application didn’t send',
  offlineNote: 'Looks like you’re offline. Nothing is lost. We kept everything ready.',
  tryAgain: 'Try again',
  sendLater: 'Send when I’m back online',
  sentTitle: 'Application sent!',
  sentBody:
    '{company} now sees you at the top of their list for {title}. We’ll ping you the moment {recruiter} replies.',
  sentSticker: 'Sent to {recruiter}',
  next: [
    'Ama usually replies within 2 days',
    'Replies land in Messages, not email',
    'Prep with Career Buddy while you wait',
  ],
  backToMatches: 'Back to my matches',
  track: 'Track in Applied',
};

export let PROFILE_PREVIEW = {
  name: 'Kofi Agyekum',
  line: 'Tertiary (BSc) · Accra, Ghana',
  status: 'Open to work',
  rows: [
    { id: 'about', label: 'About me', status: 'Visible' },
    { id: 'skills', label: 'Skills · SQL verified, Excel, Python, Data viz', status: 'Visible' },
    { id: 'education', label: 'Education · BSc Computer Science, KNUST', status: 'Visible' },
    { id: 'projects', label: 'Projects · 3 projects', status: 'Visible', hiddenStatus: 'Hidden' },
    { id: 'contact', label: 'Email and phone', status: 'Shared only if you accept a chat' },
  ],
};

export let JOB_DETAILS = {
  'data-analyst': {
    company: { short: 'Accra Tech', line: 'Fintech · Accra · 200+ people', verified: true },
    sticker: 'New today',
    closes: 'Closes 30 Oct',
    closedOn: 'Closed 30 Oct',
    closedNote: 'This role stopped taking applications on 30 Oct.',
    closedBanner:
      'Accra Tech isn’t taking applications any more. Your 82% match still counts. Here are similar roles that are open.',
    matchLabel: 'Strong match',
    matchNote: 'Ama’s team already sees you in their top matches for this role.',
    breakdown: { education: 'BSc', location: 'Accra' },
    about: {
      intro:
        'Join our 6-person data team turning payments data into decisions. You’ll build the weekly dashboards our product and ops teams rely on, and dig into why customers drop off.',
      bullets: [
        'Write SQL to pull and clean transaction data',
        'Build and maintain dashboards for product and ops',
        'Present one insight a week to the team',
        'Pair with engineers on data quality',
      ],
    },
    skills: {
      have: [
        { name: 'SQL', verified: true },
        { name: 'Excel' },
        { name: 'Python' },
        { name: 'Data visualisation' },
      ],
      missing: ['Power BI'],
    },
    boost: {
      to: 88,
      delta: '+6%',
      note: 'Power BI is the one skill you’re missing. Add it and your match jumps.',
      have: 'I have it · add skill',
      learn: 'Learn it',
    },
    preview: { hiddenLoss: '8%' },
    recruiter: {
      name: 'Ama Darko',
      first: 'Ama',
      role: 'Talent Acquisition · Accra Tech',
      reply: 'Usually replies within 2 days',
    },
    application: {
      applied: 'Applied · 2 days ago',
      note: 'Ama has seen your application.',
      status: 'Seen by Ama',
      step: 1,
      when: { Sent: 'Mon', Seen: 'Tue' },
    },
    similar: ['graduate-data-analyst', 'bi-intern', 'junior-data-engineer'],
  },
  'junior-product-analyst': {
    company: {
      short: 'Confidential company',
      line: 'Fintech · Accra · 50–200 people',
      verified: false,
    },
    sticker: 'Hiring quietly',
    closes: 'Closes 2 Nov',
    matchLabel: 'Good match',
    matchNote:
      'This recruiter already sees you in their matches, even with the company name hidden.',
    breakdown: { education: 'BSc', location: 'Accra' },
    about: {
      intro:
        'Help a fast-growing payments app understand its users. You’ll turn product data and user interviews into clear recommendations for the product team.',
      bullets: [
        'Track how people use new features',
        'Run short user interviews with the design team',
        'Turn findings into one-page recommendations',
        'Help define product metrics',
      ],
    },
    skills: {
      have: [
        { name: 'SQL', verified: true },
        { name: 'Analytics' },
        { name: 'User research' },
        { name: 'Product thinking' },
      ],
      missing: ['Figma'],
    },
    /* Figma Focused J-03 (8110:410297) repeats J-02's "~88% / +6% / Power BI" boost text; the Playful frame
       (7504:135927) carries these confidential-role values, which are kept. */
    boost: {
      to: 83,
      delta: '+5%',
      note: 'Figma is the one skill you’re missing. Add it and your match jumps.',
      have: 'I have it · add skill',
      learn: 'Learn it',
    },
  },
};

/* ---- live data (2026-10-18) ----------------------------------------------------------------------
 * The exports above are ES live bindings: TalentJobsPage swaps them for the talent's real feed
 * (talentJobsLive.js builds the same shapes from GET /guidance/jobs) and `applyJobsData(null)` restores
 * the Figma demo (`?demo=1` or logged out). `JOB_INDEX` is every job the screens can open (matched +
 * browse + saved + applied); in the demo it is JOB_LIST. `JOBS_LIVE` tells components which mode they
 * are in (real mutations vs mock-only URL state).
 */
export let JOB_INDEX = JOB_LIST;
export let JOBS_LIVE = false;
export const jobById = (id) =>
  JOB_INDEX.find((j) => j.id === id) || JOB_LIST.find((j) => j.id === id);

export const DEMO_JOBS_DATA = Object.freeze({
  JOBS_HEADER,
  JOB_TAB_LIST,
  DISCOVERY,
  JOB_LIST,
  JOB_INDEX: JOB_LIST,
  BROWSE_COPY,
  BROWSE_ROWS,
  SAVED_COPY,
  SAVED_JOBS,
  APPLIED_COPY,
  APPLIED_ROWS,
  EMPTY_COPY,
  MATCH_FOOTER,
  JOB_DETAILS,
  PROFILE_PREVIEW,
});

export const applyJobsData = (data) => {
  const d = data || DEMO_JOBS_DATA;
  const pick = (k) => (d[k] !== undefined ? d[k] : DEMO_JOBS_DATA[k]);
  JOBS_LIVE = Boolean(data);
  JOBS_HEADER = pick('JOBS_HEADER');
  JOB_TAB_LIST = pick('JOB_TAB_LIST');
  DISCOVERY = pick('DISCOVERY');
  JOB_LIST = pick('JOB_LIST');
  JOB_INDEX = pick('JOB_INDEX');
  BROWSE_COPY = pick('BROWSE_COPY');
  BROWSE_ROWS = pick('BROWSE_ROWS');
  SAVED_COPY = pick('SAVED_COPY');
  SAVED_JOBS = pick('SAVED_JOBS');
  APPLIED_COPY = pick('APPLIED_COPY');
  APPLIED_ROWS = pick('APPLIED_ROWS');
  EMPTY_COPY = pick('EMPTY_COPY');
  MATCH_FOOTER = pick('MATCH_FOOTER');
  JOB_DETAILS = pick('JOB_DETAILS');
  PROFILE_PREVIEW = pick('PROFILE_PREVIEW');
};
