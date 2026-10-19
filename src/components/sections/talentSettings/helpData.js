/*
 * Help & support — mock content for "Talent Settings & Account" (Figma file Bin8roWL8sloyc36IgFMuT).
 * Every string below is the Figma `characters` text of the frame named in the comment — nothing is invented.
 * (Frames — Playful / Focused: HS-01 7857:11670 / 8110:38737 · HP-01 8228:11841 / 8230:416483 ·
 *  HP-02 8228:12878 / 8230:417097 · HP-03 8228:13882 / 8230:417711 · HP-08 8228:14879 / 8230:418325 ·
 *  HP-04 8229:22097 / 8230:419009 · HP-07 8229:22572 / 8230:419313 · HP-05 8230:22419 / 8230:419651 ·
 *  HP-06 8230:22926 / 8230:419936 · FB-01 7857:12397 / 8110:39078 · IV-01 7857:13517 / 8110:39766.)
 * Swap this module for an API later; keep the shapes.
 */

export const HELP_ROUTE = '/settings/help';

/* ---- HS-01 Help and support page ---- */
export const HS_COPY = {
  title: 'Help and support',
  subtitle: 'Answers in plain language, and real people when you need them.',
  popularTitle: 'Popular questions',
  talkTitle: 'Talk to us',
  requestsTitle: 'Your requests',
};

export const HS_SEARCH_PLACEHOLDER = "Search help, for example 'verify a skill'";

export const HS_TOPICS = [
  { id: 'profile', icon: 'user', title: 'Your profile', hint: 'Avatar, pitch, visibility' },
  { id: 'skills-lab', icon: 'shield', title: 'Skills Lab', hint: 'Labs, scores, retakes' },
  {
    id: 'jobs',
    icon: 'suitcase',
    title: 'Jobs and applications',
    hint: 'Matches, applying, offers',
  },
  { id: 'messages', icon: 'message', title: 'Messages', hint: 'Recruiters, blocking, safety' },
  { id: 'parents', icon: 'users', title: 'Parents and under-18s', hint: 'Consent and approvals' },
  { id: 'account', icon: 'lock', title: 'Account and security', hint: 'Password, 2-step, devices' },
];

export const HS_FAQ = [
  {
    id: 'fit-score',
    question: 'Why can I not see my fit score?',
    answer:
      'Fit scores show once your profile reaches Discoverable (3 of 9 stages). Finish Avatar, Interests and Personality and they appear on every role.',
  },
  { id: 'hide-profile', question: 'How do I hide my profile from my employer?' },
  { id: 'fee', question: 'A recruiter asked me to pay a fee. What do I do?', article: true },
  { id: 'no-data', question: 'Can I use GTH without data?' },
];

export const HS_SAFETY = {
  title: 'GTH and real recruiters never ask you to pay',
  body: 'If anyone asks for money, a fee or your MoMo PIN, report them from the chat.',
  action: 'Report a problem',
};

export const HS_CONTACTS = [
  {
    id: 'buddy',
    icon: 'chat',
    title: 'Ask Career Buddy',
    hint: 'Instant answers, any time',
  },
  {
    id: 'whatsapp',
    icon: 'whatsapp',
    title: 'WhatsApp support',
    hint: 'Weekdays 8 am to 6 pm',
  },
  { id: 'email', icon: 'mail', title: 'Email us', hint: 'Reply within 1 working day' },
  { id: 'call', icon: 'phone', title: 'Call us', hint: '030 222 0000 · toll free' },
];

export const HS_REQUESTS = [
  {
    id: 'GTH-2291',
    title: 'Certificate not showing',
    meta: '#GTH-2291 · 2 days ago',
    status: 'Answered',
  },
];

/* ---- HP-01 / HP-02 / HP-03 pop-over ---- */
export const HP_COPY = {
  title: 'Help',
  subtitleDefault: 'Quick answers for the page you are on',
  subtitleSearch: 'Search every help article',
  search: 'Search help, e.g. verify a skill',
  pageLabel: 'FOR THIS PAGE · HOME',
  popularLabel: 'POPULAR',
  buddy: 'Ask Career Buddy',
  whatsapp: 'WhatsApp us',
  replay: 'Replay the tour',
  shortcuts: 'Shortcuts',
  centre: 'Help centre',
  notFound: 'Not what you need?',
  contact: 'Contact support',
  suggest: 'Suggest a help article',
  noResultsBody: 'Try fewer words, or ask a person. Career Buddy can usually help straight away.',
};

// Link rows (title only). `icon` keys map to the row icons; `to` is a drawn destination.
export const HP_PAGE_ROWS = [
  { id: 'discoverable', icon: 'help', title: 'What does Discoverable mean?' },
  { id: 'fit-score-worked', icon: 'help', title: 'How is my fit score worked out?' },
  { id: 'hide-profile', icon: 'help', title: 'How do I hide my profile from my employer?' },
];

export const HP_POPULAR_ROWS = [
  {
    id: 'fee',
    icon: 'shield',
    title: 'A recruiter asked me to pay a fee. What do I do?',
    article: true,
  },
  { id: 'no-data', icon: 'info', title: 'Can I use GTH without data?' },
  { id: 'verify-skill', icon: 'verified', title: 'How do I verify a skill?' },
];

// Searchable corpus. Entries with `preview` + `category` are drawn as "Help result" rows (HP-02);
// entries without are drawn in the article's RELATED / contact "Link" row style.
export const HP_CORPUS = [
  {
    id: 'fee',
    icon: 'shield',
    title: 'A recruiter asked me to pay a fee. What do I do?',
    preview: 'Never pay. Report the chat and we review it within 24 hours.',
    category: 'Safety',
    article: true,
  },
  {
    id: 'gth-fees',
    icon: 'info',
    title: 'Are there fees to use Ghana Talent Hub?',
    preview: 'GTH is free for talents. Premium never blocks your matches.',
    category: 'Account',
  },
  {
    id: 'course-fees',
    icon: 'file',
    title: 'Course fees and free learning paths',
    preview: 'Most courses are free. Paid ones show the price up front.',
    category: 'Learning',
  },
  ...HP_PAGE_ROWS.map((r) => ({ id: r.id, icon: 'help', title: r.title })),
  { id: 'no-data', icon: 'info', title: 'Can I use GTH without data?' },
  { id: 'verify-skill', icon: 'verified', title: 'How do I verify a skill?' },
  { id: 'fake-job', icon: 'file', title: 'How to spot a fake job post' },
  { id: 'block-report', icon: 'file', title: 'How do I block or report someone?' },
  { id: 'after-report', icon: 'file', title: 'What happens after I report?' },
  { id: 'fit-score', icon: 'help', title: 'Why can I not see my fit score?' },
];

// States as drawn (HP-02 query “fee”, HP-03 query “nss posting letter”).
export const HP_DEFAULT_QUERY = { searching: 'fee', none: 'nss posting letter' };

export const searchHelp = (query) => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits = HP_CORPUS.filter(
    (i) => i.title.toLowerCase().includes(q) || i.preview?.toLowerCase().includes(q)
  );
  // Drawn results (with preview + category) first, then plain title links.
  return [...hits.filter((h) => h.preview), ...hits.filter((h) => !h.preview)];
};

/* ---- HP-08 Keyboard shortcuts ---- */
export const SHORTCUTS_COPY = {
  title: 'Keyboard shortcuts',
  subtitle: 'Move around GTH without the mouse. Press ? any time to see this.',
  done: 'Got it',
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
        { label: 'Job postings', keys: ['G', 'J'] },
        { label: 'Messages', keys: ['G', 'M'] },
        { label: 'Skills Lab', keys: ['G', 'S'] },
      ],
    },
    {
      label: 'IN SKILLS LAB AND QUIZZES',
      rows: [
        { label: 'Pick an answer', keys: ['1 – 4'] },
        { label: 'Check my answer', keys: ['Enter'] },
      ],
    },
  ],
};

/* ---- HP-04 Help article ---- */
export const ARTICLE = {
  pageTitle: 'Help centre',
  pageSubtitle: 'Safety  ·  A recruiter asked me to pay a fee',
  breadcrumb: ['Help centre', 'Safety', 'Fees and scams'],
  title: 'A recruiter asked me to pay a fee. What do I do?',
  category: 'Safety',
  meta: 'Updated 12 Oct 2026  ·  2 min read',
  callout: {
    title: 'GTH and real recruiters never ask you to pay',
    body: 'Not for interviews, training, uniforms, “processing” or a medical. If someone asks for money or your MoMo PIN, it is a scam.',
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
    'Already paid? Call your mobile money provider straight away to try to reverse it, then report the chat so we can stop them reaching others.',
  helpful: { question: 'Was this helpful?', yes: 'Yes', no: 'No' },
  relatedLabel: 'RELATED',
  related: [
    'How to spot a fake job post',
    'How do I block or report someone?',
    'What happens after I report?',
  ],
  stuck: {
    title: 'Still stuck?',
    body: 'Talk to Career Buddy or a real person.',
    buddy: 'Ask Career Buddy',
    whatsapp: 'WhatsApp support',
    contact: 'Contact support',
  },
  reportCard: {
    title: 'Did this happen to you?',
    body: 'Report the recruiter. It takes 30 seconds and protects other talents.',
    action: 'Report a problem',
  },
};

/* ---- HP-07 Report a problem (modal over the article) ---- */
export const REPORT = {
  title: 'Report a problem',
  subtitle: 'Kwame Asante · Product Analyst role · Hubtel',
  question: 'What happened?',
  options: [
    'Asked me to pay money',
    'Asked for my MoMo PIN or password',
    'Fake company or job',
    'Harassment or unsafe messages',
    'Something else',
  ],
  detailsLabel: 'Add details (optional)',
  detailsValue: 'He said I must pay GHS 200 for “processing” before the interview.',
  blockTitle: 'Also block this recruiter',
  blockBody: 'They won’t know you reported or blocked them.',
  cancel: 'Cancel',
  send: 'Send report',
};

/* ---- HP-05 Contact support ---- */
export const CONTACT = {
  title: 'Contact support',
  subtitle:
    'A real person from our Accra team replies within 1 working day. Usually faster on WhatsApp.',
  topicQuestion: 'What is it about?',
  topics: [
    'Account',
    'Jobs and applications',
    'Skills Lab',
    'Payments or fees',
    'Safety',
    'Something else',
  ],
  topicValue: 'Payments or fees',
  subjectLabel: 'Subject',
  subjectValue: 'Recruiter asked for a “processing fee”',
  detailsLabel: 'Tell us what happened',
  detailsValue:
    'A recruiter from “Prime Jobs GH” messaged me about the Data Analyst role and said I must pay GHS 200 before the interview.',
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
  before: ['A recruiter asked me to pay a fee. What do I do?', 'How to spot a fake job post'],
};

/* ---- HP-06 Request sent (modal over the contact page) ---- */
export const SENT = {
  title: 'Sent. We’re on it.',
  body: 'Request #GTH-2318. A person from our Accra team will reply in the app, usually within a few hours.',
  steps: ['Sent', 'Reviewing', 'Answered'],
  viewRequests: 'View my requests',
  back: 'Back to Help centre',
};

/* ---- FB-01 Send feedback ---- */
export const FEEDBACK = {
  title: 'Send feedback',
  question: 'How is GTH working for you?',
  ratings: ['Not great', 'Okay', 'Love it'],
  ratingValue: 'Love it',
  textValue: 'The Skills Lab is so good. Please add an accounting lab!',
  screenshot: 'Include a screenshot of this page',
  cancel: 'Cancel',
  send: 'Send feedback',
};

/* ---- IV-01 Invite a friend (Playful says “XP”, Focused says “pts”) ---- */
export const INVITE = {
  title: 'Invite a friend',
  link: 'gth.com/join/kofi-k7',
  copy: 'Copy link',
  share: ['WhatsApp', 'Email', 'SMS', 'More'],
  bodyPre: 'You both get +50 ',
  bodyPost: ' when they finish their first 3 stages.',
  statsPre: '2 friends joined with your link · +100 ',
  statsPost: ' earned',
  unitFocused: 'pts',
  unitPlayful: 'XP',
};
