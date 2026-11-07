/*
 * Recruiter Help set - mock content for "Recruiter - Settings & Account" (Figma 10161:75722). Every string is the Figma `characters` of the frame named in the comment
 * (R-FB-01 10161:86399 · R-IV-01 10161:86808 · R-HS-01 10161:87217 · R-HP-01 10161:87540 · R-HP-02 10161:87922 · R-HP-03 10161:88304 · R-HP-08 10161:88686 ·
 *  R-HP-04 10161:89124 · R-HP-07 10161:89324 · R-HP-05 10161:89558 · R-HP-06 10161:89746). The shapes are the talent `talentSettings/helpData.js` shapes, so the
 * shared talent components take these objects through their add-only `data` / `copy` props. Swap this module for an API later; keep the shapes.
 *
 * URL contract (state in the URL; any recruiter page that mounts `useRecruiterHelpPanels()` reads it):
 *   ?help=page                          R-HP-01  pop-over, "For this page"
 *   ?help=searching&q=fee               R-HP-02  pop-over, results      (typing rewrites help + q)
 *   ?help=none&q=bulk reject            R-HP-03  pop-over, no results
 *   ?help=shortcuts                     R-HP-08  keyboard-shortcuts modal ("?" key opens it too)
 *   ?modal=feedback | ?modal=invite     R-FB-01 / R-IV-01  dialogs (every recruiter page that mounts the hook)
 *   /recruiter/help                     R-HS-01  Help and support page
 *   /recruiter/help?help=article        R-HP-04  article        ?help=report  R-HP-07 (modal over the article)
 *   /recruiter/help?help=contact        R-HP-05  contact form   ?help=sent    R-HP-06 (modal over the form)
 * `help=article|report|contact|sent` on any other recruiter page redirects (replace) to /recruiter/help?help=<same>.
 */

export const RECRUITER_HELP_ROUTE = '/recruiter/help';
// "Ask Hiring Assistant": the recruiter AI chat (Figma "Recruiter - AI Chat", built; `live=0` keeps the scripted demo).
export const RECRUITER_ASSISTANT_ROUTE =
  '/profile/filling/career-buddy?role=recruiter&live=0&cb=landing';

/* ---- R-HS-01 Help and support page ---- */
export const RECRUITER_HS_COPY = {
  title: 'Help and support',
  subtitle: 'Answers in plain language, and real people when you need them.',
  popularTitle: 'Popular questions',
  talkTitle: 'Talk to us',
  requestsTitle: 'Your requests',
};

export const RECRUITER_HS_SEARCH_PLACEHOLDER = 'Search help, for example “screening criteria”';

export const RECRUITER_HS_TOPICS = [
  {
    id: 'profile',
    icon: 'user',
    title: 'Your recruiter profile',
    hint: 'Photo, title, company page',
  },
  {
    id: 'job-postings',
    icon: 'shield',
    title: 'Job Postings',
    hint: 'Templates, screening, closing jobs',
  },
  {
    id: 'pipeline',
    icon: 'suitcase',
    title: 'Pipeline and candidates',
    hint: 'Stages, interviews, offers',
  },
  { id: 'messages', icon: 'message', title: 'Messages', hint: 'Candidates, reporting, safety' },
  {
    id: 'under-18s',
    icon: 'users',
    title: 'Hiring under-18s and NSS',
    hint: 'Parent consent, internship rules',
  },
  { id: 'account', icon: 'lock', title: 'Account and security', hint: 'Password, 2-step, devices' },
];

export const RECRUITER_HS_FAQ = [
  {
    id: 'match-score',
    question: 'Why can’t I see a candidate’s match score?',
    answer:
      'Fit scores show once your profile reaches Discoverable (3 of 9 stages). Finish Avatar, Interests and Personality and they appear on every role.',
  },
  { id: 'add-teammate', question: 'How do I add a teammate to a job?' },
  {
    id: 'fee',
    question: 'A candidate asked me to pay or sent a strange link. What do I do?',
    article: true,
  },
  { id: 'invites-inmails', question: 'How do invites and InMails work?' },
];

export const RECRUITER_HS_SAFETY = {
  title: 'GTH never asks recruiters to pay outside Billing',
  body: 'If anyone asks for money, a fee or your MoMo PIN, report them from the chat.',
  action: 'Report a problem',
};

export const RECRUITER_HS_CONTACTS = [
  { id: 'buddy', icon: 'chat', title: 'Ask Hiring Assistant', hint: 'Instant answers, any time' },
  { id: 'whatsapp', icon: 'whatsapp', title: 'WhatsApp support', hint: 'Weekdays 8 am to 6 pm' },
  { id: 'email', icon: 'mail', title: 'Email us', hint: 'Reply within 1 working day' },
  { id: 'call', icon: 'phone', title: 'Call us', hint: '030 222 0000 · toll free' },
];

/* "Your requests": the useMyRequests() row shape (no /api/support call is made from recruiter pages). The age is relative to now, as the real API's `updatedAt` would be. */
const DAY = 24 * 60 * 60 * 1000;
export const recruiterRequests = () => ({
  rows: [
    {
      ref: '#GTH-2291',
      subject: 'KYB documents still in review',
      status: 'answered',
      statusLabel: 'Answered',
      updatedAt: new Date(Date.now() - 2 * DAY).toISOString(),
      lastFromStaff: false,
    },
  ],
  loading: false,
  error: null,
  reload: () => {},
});

/* ---- R-HP-01 / 02 / 03 pop-over ---- */
export const RECRUITER_HP_COPY = {
  title: 'Help',
  subtitleDefault: 'Quick answers for the page you are on',
  subtitleSearch: 'Search every help article',
  search: 'Search help, e.g. screening',
  pageLabel: 'FOR THIS PAGE · JOB POSTINGS',
  popularLabel: 'POPULAR',
  buddy: 'Ask Hiring Assistant',
  whatsapp: 'WhatsApp us',
  replay: 'Replay the recruiter tour',
  shortcuts: 'Shortcuts',
  centre: 'Help centre',
  notFound: 'Not what you need?',
  contact: 'Contact support',
  suggest: 'Suggest a help article',
  noResultsBody:
    'Try fewer words, or ask a person. Hiring Assistant can usually help straight away.',
};

/* Drawn only for Job Postings (Figma draws the pop-over over that page). ⚠️ ASSUMPTION: other recruiter pages (Settings, Help centre) show the same three
   questions under their own "FOR THIS PAGE · <PAGE>" label, because no other page's list is drawn. */
export const RECRUITER_HP_PAGE_ROWS = [
  { id: 'close-pause', icon: 'help', title: 'How do I close or pause a posting?' },
  { id: 'apply-filter-pool', icon: 'help', title: 'How does Apply & Filter Pool work?' },
  { id: 'add-teammate', icon: 'help', title: 'How do I add a teammate to a job?' },
];

export const RECRUITER_HP_POPULAR_ROWS = [
  {
    id: 'fee',
    icon: 'shield',
    title: 'A candidate asked me to pay or sent a strange link. What do I do?',
    article: true,
  },
  { id: 'invites-inmails', icon: 'info', title: 'How do invites and InMails work?' },
  {
    id: 'screening-template',
    icon: 'verified',
    title: 'How do I save screening criteria as a template?',
  },
];

const PAGE_LABELS = {
  '/recruiter/job-postings': 'JOB POSTINGS',
  '/recruiter/settings': 'SETTINGS',
  '/recruiter/help': 'HELP AND SUPPORT',
};

/* The pop-over data for the page it is opened on (⚠️ ASSUMPTION for every page but Job Postings, see above). */
export const recruiterPopoverData = (pathname) => ({
  copy: {
    ...RECRUITER_HP_COPY,
    pageLabel: `FOR THIS PAGE · ${PAGE_LABELS[pathname] ?? 'JOB POSTINGS'}`,
  },
  pageRows: RECRUITER_HP_PAGE_ROWS,
  popularRows: RECRUITER_HP_POPULAR_ROWS,
  search: searchRecruiterHelp,
  defaultQuery: { searching: 'fee', none: 'bulk reject' },
  helpRoute: RECRUITER_HELP_ROUTE,
});

/* Searchable corpus. Entries with `preview` + `category` are the drawn "Help result" rows (R-HP-02, query "fee"); the others are plain "Link" rows. `keywords` (⚠️ ASSUMPTION:
   the frames show "fee" matching articles that do not contain the word) widen the match. */
export const RECRUITER_HP_CORPUS = [
  {
    id: 'fee',
    icon: 'shield',
    title: 'A candidate asked me to pay or sent a strange link. What do I do?',
    preview: 'Never pay. Report the chat and we review it within 24 hours.',
    category: 'Safety',
    article: true,
    keywords: ['fee', 'fees', 'payment', 'scam'],
  },
  {
    id: 'billing',
    icon: 'info',
    title: 'How does recruiter billing work?',
    preview: 'Plans are billed monthly. Invites and job posts reset each billing period.',
    category: 'Account',
    keywords: ['fee', 'fees', 'invoice', 'payment'],
  },
  {
    id: 'plan-limits',
    icon: 'file',
    title: 'Plans, invites and job post limits',
    preview: 'Your plan shows what’s included. Extra invites are never charged without asking.',
    category: 'Hiring',
    keywords: ['fee', 'fees', 'charge'],
  },
  ...RECRUITER_HP_PAGE_ROWS.map((r) => ({ id: r.id, icon: 'help', title: r.title })),
  { id: 'invites-inmails', icon: 'info', title: 'How do invites and InMails work?' },
  {
    id: 'screening-template',
    icon: 'verified',
    title: 'How do I save screening criteria as a template?',
  },
  { id: 'fake-profile', icon: 'file', title: 'How to spot a fake candidate profile' },
  { id: 'block-report', icon: 'file', title: 'How do I block or report someone?' },
  { id: 'after-report', icon: 'file', title: 'What happens after I report?' },
  { id: 'match-score', icon: 'help', title: 'Why can’t I see a candidate’s match score?' },
];

export const searchRecruiterHelp = (query) => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits = RECRUITER_HP_CORPUS.filter(
    (i) =>
      i.title.toLowerCase().includes(q) ||
      i.preview?.toLowerCase().includes(q) ||
      i.keywords?.some((k) => k.includes(q))
  );
  // Drawn results (with preview + category) first, then plain title links.
  return [...hits.filter((h) => h.preview), ...hits.filter((h) => !h.preview)];
};

/* ---- R-HP-08 Keyboard shortcuts ---- */
export const RECRUITER_SHORTCUTS_COPY = {
  title: 'Keyboard shortcuts',
  subtitle: 'Move around GTH without the mouse. Press ? any time to see this.',
  done: 'Open candidate', // as drawn (the button label of the frame; it closes the modal)
  groups: [
    {
      label: 'EVERYWHERE',
      rows: [
        { label: 'Open help', keys: ['?'] },
        { label: 'Search GTH', keys: ['⌘ K'] },
        { label: 'Open notifications', keys: ['N'] },
        { label: 'Close pop-ups and modals', keys: ['Esc'] },
      ],
    },
    {
      label: 'GO TO',
      rows: [
        { label: 'Home', keys: ['G', 'H'] },
        { label: 'Talent Search', keys: ['G', 'J'] },
        { label: 'Messages', keys: ['G', 'M'] },
        { label: 'Job Postings', keys: ['G', 'S'] },
      ],
    },
    {
      label: 'IN THE PIPELINE',
      rows: [
        { label: 'Move to next candidate', keys: ['J / K'] },
        { label: 'Move candidate to next stage', keys: ['Enter'] },
      ],
    },
  ],
};

/* ---- R-HP-04 Help article ---- */
export const RECRUITER_ARTICLE = {
  pageTitle: 'Help centre',
  pageSubtitle: 'Safety  ·  A candidate asked for payment',
  breadcrumb: ['Help centre', 'Safety', 'Fees and scams'],
  title: 'A candidate asked me to pay or sent a strange link. What do I do?',
  category: 'Safety',
  meta: 'Updated 12 Oct 2026  ·  2 min read',
  callout: {
    title: 'GTH never asks recruiters to pay outside Billing',
    body: 'Candidates never need to pay, and you never need to pay to see a CV. If anyone asks for money or your MoMo PIN, it is a scam.',
  },
  stepsTitle: 'What to do',
  steps: [
    {
      title: 'Don’t pay or share your MoMo PIN',
      body: 'Even if they promise a refund or say the job will go to someone else.',
    },
    {
      title: 'Report the chat',
      body: 'Open the conversation, tap  ⋯  then Report. Pick “Asked me to pay money”.',
    },
    {
      title: 'Block them',
      body: 'Blocking stops new messages. They won’t know you reported them.',
    },
    {
      title: 'We review within 24 hours',
      body: 'Our Accra team checks every report and tells you what we did in your inbox.',
    },
  ],
  alreadyPaid:
    'Already paid? Call your mobile money provider straight away, then report the profile so we can stop it happening to other recruiters.',
  helpful: { question: 'Was this helpful?', yes: 'Yes', no: 'No' },
  relatedLabel: 'RELATED',
  related: [
    'How to spot a fake candidate profile',
    'How do I block or report someone?',
    'What happens after I report?',
  ],
  stuck: {
    title: 'Still stuck?',
    body: 'Talk to the Hiring Assistant or our recruiter support team.',
    buddy: 'Ask Hiring Assistant',
    whatsapp: 'WhatsApp support',
    contact: 'Contact support',
  },
  reportCard: {
    title: 'Did this happen to you?',
    body: 'Report the profile. It takes 30 seconds and protects other recruiters.',
    action: 'Report a problem',
  },
};

/* ---- R-HP-07 Report a problem (modal over the article) ---- */
export const RECRUITER_REPORT = {
  title: 'Report a problem',
  subtitle: '“Kwame A.” · applicant · Senior UX Designer',
  question: 'What happened?',
  options: [
    'Asked me to pay money',
    'Asked for my MoMo PIN or password',
    'Fake profile or documents',
    'Harassment or unsafe messages',
    'Something else',
  ],
  detailsLabel: 'Add details (optional)',
  detailsValue: 'He said I must pay GHS 200 to “unlock” his CV before the interview.',
  blockTitle: 'Also block this person',
  blockBody: 'They won’t know you reported or blocked them.',
  cancel: 'Cancel',
  send: 'Send report',
};

export const RECRUITER_ARTICLE_DATA = { article: RECRUITER_ARTICLE, report: RECRUITER_REPORT };

/* ---- R-HP-05 Contact support ---- */
export const RECRUITER_CONTACT = {
  title: 'Contact support',
  subtitle:
    'A real person from our Accra team replies within 1 working day. Usually faster on WhatsApp.',
  topicQuestion: 'What is it about?',
  topics: [
    'Account',
    'Pipeline and candidates',
    'Job Postings',
    'Payments or fees',
    'Safety',
    'Something else',
  ],
  topicValue: 'Payments or fees',
  subjectLabel: 'Subject',
  subjectValue: 'Candidate asked for a “processing fee”',
  detailsLabel: 'Tell us what happened',
  detailsValue:
    'Someone claiming to be a candidate asked me to pay GHS 200 to “unlock” their CV before the interview.',
  detailsMax: 1000,
  uploadTitle: 'Add screenshots (optional)',
  uploadHint: 'PNG or JPG, up to 5 MB each. Screenshots of the chat help us act faster.',
  browse: 'Browse',
  files: [{ name: 'chat-screenshot.png', size: '240 KB' }],
  replyQuestion: 'How should we reply?',
  replyOptions: ['In the app', 'WhatsApp', 'Email'],
  replyValue: 'In the app',
  deviceInfo: 'Include my device and browser info (helps us fix bugs)',
  cancel: 'Cancel',
  send: 'Send to support',
  beforeTitle: 'Before you send',
  beforeBody: 'These might answer it straight away:',
  before: [
    { title: 'A candidate asked me to pay or sent a strange link. What do I do?', icon: 'shield' },
    { title: 'How to spot a fake candidate profile', icon: 'shield' },
  ],
};

/* ---- R-HP-06 Request sent (modal over the contact page) ---- */
export const RECRUITER_SENT = {
  title: 'Sent. We’re on it.',
  body: 'Request #GTH-2318. A person from our Accra team will reply in the app, usually within a few hours.',
  steps: ['Sent', 'Reviewing', 'Answered'],
  viewRequests: 'View my requests',
  back: 'Back to Help centre',
};

/* ---- R-FB-01 Send feedback / R-IV-01 Invite a teammate (override objects for the talent dialogs) ---- */
export const RECRUITER_FEEDBACK = {
  textValue: 'Screening is great. Please let me reuse criteria across organisations!',
};

export const RECRUITER_INVITE = {
  title: 'Invite a teammate',
  link: 'gth.com/recruit/joel-k7',
  bodyPre:
    'They’ll join Silver Rock Technology as a Recruiter. You can change their role in Settings.',
  bodyPost: '',
  statsPre: '2 teammates joined with your link',
  statsPost: '',
  unitFocused: '',
  unitPlayful: '',
  // ⚠️ ASSUMPTION: the share text is not drawn.
  message:
    'Join me on Ghana Talent Hub as a recruiter at Silver Rock Technology: https://gth.com/recruit/joel-k7',
};

/* The help values that open a page (not the pop-over): they live on RECRUITER_HELP_ROUTE. */
export const RECRUITER_HELP_PAGE_VALUES = ['article', 'report', 'contact', 'sent'];
export const RECRUITER_HELP_POPOVER_VALUES = ['page', 'searching', 'none'];
