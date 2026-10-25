/*
 * adminSupportData — copy of Support queries (Figma canvas 8520:12): 7.7.1a query queue 8666:415975, 7.7.1b query detail 8666:416513, 7.7.1c reply with template 8666:417042,
 * 7.7.1d escalate to Senior Admin 8666:417619. ⚠️ ASSUMPTION: frontend only; three fixed sample queries (the queue shows 3 of "9 open"); the two sticker labels the frames do
 * not spell out ("Mine" on the first row) are inferred from the claimed state; lead glyphs use the closest tiles the queue row has.
 */

export const QUERY_ID = 'SUP-10451';

export const SUPPORT = {
  title: 'Support queries',
  sticker: '9 open',
  subtitle:
    'Questions users send through Help. Reply with an approved template. Anything that changes an account goes to a Senior Admin.',
  tabs: [
    { id: 'open', label: 'Open', count: '9' },
    { id: 'waiting', label: 'Waiting on user', count: '2' },
    { id: 'all', label: 'All', count: '41' },
    { id: 'escalated', label: 'Escalated', count: '1' },
  ],
  tabTone: 'ink',
  defaultTab: 'all',
  chips: [
    { id: 'all', label: 'All 9' },
    { id: 'talents', label: 'Talents 6' },
    { id: 'orgs', label: 'Organisations 3' },
  ],
  defaultView: 'list',
  sort: 'Oldest first',
  action: 'Claim next',
  banner: '1 query has waited more than 6 hours. Target: answer within 1 day.',
  rows: [
    {
      id: 'r1',
      lead: { icon: 'shield' },
      title: 'SUP-10451 · Can’t sign in after phone change',
      sticker: 'Mine',
      sub: 'Kofi Agyekum · talent · sent 40m ago',
      chips: [
        { label: 'Sign-in', tone: 'amber' },
        { label: 'Account', tone: 'green' },
        { label: '2-step', tone: 'grey' },
      ],
      pill: { label: 'Open', strong: true },
      age: '',
      muted: false,
      button: null,
      to: `/admin/support/${QUERY_ID}`,
    },
    {
      id: 'r2',
      lead: { icon: 'warning' },
      title: 'SUP-10448 · Parent link missing',
      sticker: null,
      sub: 'Abena Mensah · minor · sent 6h ago',
      chips: [
        { label: 'Waiting 6h', tone: 'amber' },
        { label: 'Minor', tone: 'green' },
        { label: '2-step', tone: 'grey' },
      ],
      pill: { label: 'Open', strong: false },
      age: '',
      muted: false,
      button: null,
      to: `/admin/support/${QUERY_ID}`,
    },
    {
      id: 'r3',
      lead: { icon: 'company' },
      title: 'SUP-10440 · Recruiter can’t post',
      sticker: 'Escalated',
      sub: 'MTN Ghana · recruiter · escalated to Akua Sarfo',
      chips: [
        { label: 'Recruiter', tone: 'green' },
        { label: 'Minor', tone: 'green' },
        { label: 'Verification', tone: 'grey' },
      ],
      pill: { label: 'View', strong: false },
      age: '',
      muted: true,
      button: 'Reassign',
      to: `/admin/support/${QUERY_ID}`,
    },
  ],
};

export const DETAIL = {
  title: `Query ${QUERY_ID}`,
  sub: 'Can’t sign in after phone change · Kofi Agyekum (TAL-204-8812) · sent 18 Oct, 09:02 · claimed by you',
  searchPlaceholder: 'Search queries…',
  filters: [
    { id: 'mine', label: 'Mine', count: '(3)' },
    { id: 'all', label: 'All (9)' },
  ],
  list: [
    {
      id: 'SUP-10451',
      title: 'SUP-10451 · Sign-in',
      age: '40m',
      status: 'Claimed by you',
      selected: true,
    },
    {
      id: 'SUP-10448',
      title: 'SUP-10448 · Parent link',
      age: '6h',
      status: 'Claimed by you',
      badge: '01',
    },
    {
      id: 'SUP-10440',
      title: 'SUP-10440 · Recruiter',
      age: '1d',
      status: 'Escalated',
      badge: '02',
    },
    { id: 'SUP-10452', title: 'SUP-10452 · Password', age: '40m', status: 'New' },
  ],
  header: {
    monogram: 'KA',
    title: 'SUP-10451 · Sign-in',
    sub: 'Talent · Greater Accra · 2-step on',
  },
  waited: '6h',
  message: {
    text: 'From Kofi: “I changed my phone and now I can’t get the 2-step code. Please help, I have an interview on Monday.”',
    time: '10:05',
    read: 'Read',
  },
  account: {
    label: 'ACCOUNT',
    name: 'Kofi Agyekum · TAL-204-8812',
    status: 'Active · last sign-in 14 Oct',
    check: 'Identity check needed',
    hint: 'Ask 2 security questions before resetting 2-step.',
  },
  note: {
    text: 'Reply with a template. Resetting 2-step is logged under your name.',
    time: '10:05',
    read: 'Read',
  },
  replyPlaceholder: 'Reply to Kofi…',
  menu: [
    { id: 'reply', label: 'Reply with template' },
    { id: 'escalate', label: 'Escalate to Senior Admin' },
  ],
};

export const REPLY = {
  title: 'Reply to Kofi',
  templateLabel: 'Template',
  channel: 'In-platform',
  template: '2-step reset done',
  change: 'Change template',
  body: 'Hi Kofi, we’ve reset your 2-step sign-in. Next time you sign in, scan the new code with your authenticator app. Good luck on Monday!',
  close: 'Close the query after sending',
  send: 'Send reply',
};

export const ESCALATE = {
  title: 'Escalate this query?',
  body: 'Account changes like suspensions, merges and field overrides need a Senior Admin. Kofi is told someone senior is looking.',
  toLabel: 'Send to',
  to: 'Akua Sarfo · Senior Admin',
  noteLabel: 'Note',
  note: 'Identity checked. Needs a phone number override.',
  primary: 'Escalate',
  secondary: 'Cancel',
};
