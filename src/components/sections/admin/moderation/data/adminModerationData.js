/*
 * adminModerationData — copy of the non-queue Moderation screens (Figma canvas 8520:12): 7.2.2a-e flag detail and its decision dialogs, 7.2.3b-c restore dialogs,
 * 7.2.4a-b community posts and the warn-author dialog, 7.2.5b-c community review dialogs. ⚠️ ASSUMPTION: frontend only, fixed sample items.
 */

export const FLAG_ID = 'FL-2291';

export const FLAG_HEAD = {
  title: 'Flag FL-2291',
  sub: 'Harassment in direct messages · High · reported 18 Oct, 07:02 by a talent user · claimed by you',
};

export const FLAG_LIST = {
  search: 'Search flags…',
  tabs: [
    { id: 'mine', label: 'Mine', count: '3' },
    { id: 'all', label: 'All', count: '11' },
  ],
  items: [
    {
      id: 'FL-2291',
      title: 'FL-2291 · Harassment',
      sub: 'Claimed by you',
      time: 'Now',
      active: true,
    },
    {
      id: 'FL-2294',
      title: 'FL-2294 · Fake job post',
      sub: 'Claimed by you',
      time: '40m',
      count: '01',
    },
    { id: 'FL-2287', title: 'FL-2287 · Hate speech', sub: 'Escalated', time: '5h', count: '02' },
    { id: 'FL-2295', title: 'FL-2295 · Spam', sub: 'System flag', time: 'Now', dot: true },
  ],
};

export const FLAG_THREAD = {
  title: 'FL-2291 · Harassment',
  sub: 'Reported conversation · 3 messages',
  time: '40m',
  message: {
    text: 'From TAL-311-0442: “You’re useless. Delete your profile or I’ll make sure no recruiter ever looks at you.”',
    time: '10:05',
    read: 'Read',
  },
  report: {
    eyebrow: 'REPORT',
    title: 'Harassment or threats',
    reporter: 'Reporter: a talent user · identity protected',
    pattern: '3rd flag in 30 days',
    alert: 'Pattern alert: this account has 3 flags in 30 days. Consider escalating.',
  },
  hint: {
    text: 'Decide below: dismiss, remove the content, warn the author or escalate',
    time: '10:05',
    read: 'Read',
  },
  notePlaceholder: 'Add an internal note…',
  decisions: [
    { id: 'dismiss', label: 'Dismiss' },
    { id: 'warn', label: 'Warn author' },
    { id: 'escalate', label: 'Escalate' },
  ],
  primary: 'Remove content',
};

export const DISMISS = {
  title: 'Dismiss this flag?',
  body: 'The content stays up. The reporter is told “We reviewed your report.” Your reason is logged with the flag.',
  primary: 'Dismiss flag',
  secondary: 'Cancel',
};

export const ESCALATE = {
  title: 'Escalate to a Senior Admin?',
  body: 'FL-2291 moves to the Senior Admin queue with your note. You stop being the reviewer.',
  primary: 'Escalate',
  secondary: 'Cancel',
};

export const CLAIMED = {
  title: 'Kweku Ansah claimed this flag',
  body: 'Only the person who claimed a flag can resolve it. Ask Kweku or your Senior Admin to reassign it to you.',
  primary: 'Ask to reassign',
  secondary: 'Close',
};

export const REMOVE = {
  chip: 'Remove content',
  title: 'Remove this message and warn the author?',
  sub: 'It’s hidden from the reporter and everyone else. The author is told why.',
  preview: { title: 'Message from TAL-311-0442', sub: 'Sent 18 Oct, 06:58 · direct message' },
  happensLabel: 'WHAT HAPPENS',
  happens: [
    'The message is removed and archived for appeals',
    'The author gets a warning (2 of 3)',
    'The flag closes as Resolved · Actioned',
  ],
  note: {
    title: 'Third flag in 30 days',
    sub: 'Escalate to a Senior Admin to consider a suspension.',
  },
  escalate: 'Escalate instead',
  primary: 'Remove content',
};

export const RESTORE = {
  title: 'Restore this opportunity?',
  body: 'It goes back to public view and the owner is told. The removal and the restore both stay in the audit log.',
  primary: 'Restore',
  secondary: 'Cancel',
};

export const GOV_BLOCKED = {
  title: 'This needs a Super Admin',
  body: 'Removing content from a Government Agency account needs Super Admin approval. Send a request with your reason and the flag ID.',
  primary: 'Send request',
  secondary: 'Close',
};

export const POSTS = {
  title: 'Community posts',
  sticker: '42 new today',
  subtitle:
    'Posts across all communities. Reclassify the purpose tag, remove posts or warn authors.',
  tabs: [
    { id: 'all', label: 'All', count: '1,204' },
    { id: 'escalated', label: 'Escalated', count: '2' },
    { id: 'reported', label: 'Reported', count: '4' },
    { id: 'removed', label: 'Removed', count: '7' },
  ],
  defaultTab: 'reported',
  chips: [
    { id: 'all', label: 'All 42' },
    { id: 'job-leads', label: 'Job leads 18' },
    { id: 'off-topic', label: 'Off-topic 3' },
  ],
  sort: 'Newest',
  action: 'Community moderator escalation',
  banner: '2 posts were escalated by volunteer community moderators. They’re shown first.',
  cards: [
    {
      id: 'p1',
      community: 'Data & Tech Ghana',
      posted: 'Posted 2h ago',
      tag: 'Escalated',
      text: '“DM me for guaranteed jobs at a telco, GHS 200 fee”',
      author: 'Author TAL-118-9902 · 2nd warning',
      purpose: 'Purpose: Job lead',
      looks: 'Looks like a scam',
      reports: '3',
      fill: 0.9,
      fillColor: '#387440',
      chips: ['Scam', 'Asks for money', 'Escalated'],
      foot: 'Community moderator: Yaw B.',
      action: 'Review post',
      actionStrong: true,
    },
    {
      id: 'p2',
      community: 'Kumasi Creatives',
      posted: 'Posted 5h ago',
      tag: null,
      text: '“Portfolio review Saturday at KNUST, all welcome!”',
      author: 'Author TAL-204-1180',
      purpose: 'Purpose: Event',
      looks: 'Tag looks right',
      reports: '0',
      fill: 0.78,
      fillColor: '#c8951a',
      chips: ['Event', 'Kumasi', 'On-topic'],
      foot: 'No reports',
      action: 'Review post',
      actionStrong: false,
    },
    {
      id: 'p3',
      community: 'Agri Youth Network',
      posted: 'Minor author',
      tag: 'Removed',
      text: '“My cousin’s farm is hiring, call 024…”',
      author: 'Author is 16 · parent told',
      purpose: 'Purpose: Job lead',
      looks: 'Contact details',
      reports: '1',
      fill: 0.45,
      fillColor: '#c8951a',
      chips: ['Contact details', 'Minor', 'Removed'],
      foot: 'Removed by Esi Darko',
      action: 'Restore',
      muted: true,
    },
  ],
};

export const WARN = {
  title: 'Warn this author?',
  body: 'TAL-118-9902 gets an in-app warning with your message. This is their 2nd warning. A 3rd starts a suspension review.',
  severityLabel: 'Severity',
  severities: ['Warning', 'Final warning'],
  messageLabel: 'Message (from template)',
  message: 'Posts that ask for money break the community rules.',
  primary: 'Send warning',
  secondary: 'Cancel',
};

export const REVIEW = {
  title: 'Review #Agritech Innovators Ghana',
  card: {
    id: 'CR-0412',
    name: 'Agritech Innovators Ghana',
    meta: ['1 member', 'Submitted 2h ago'],
    about: 'For students and builders working on tech for Ghanaian farms.',
    owner: 'Owner: Kofi Agyekum',
  },
  checksTitle: 'Automatic checks',
  checks: [
    { id: 'name', title: 'Name', sub: 'No company, brand or duplicate match', ok: true },
    { id: 'cover', title: 'Cover photo', sub: 'No logos, text or phone numbers found', ok: true },
    { id: 'rules', title: 'Rules', sub: 'GTH rules on · 2 own rules, nothing flagged', ok: true },
    {
      id: 'age',
      title: 'Ages 14 and up',
      sub: 'Opens only after a verified mentor joins · invite sent',
      ok: false,
    },
    {
      id: 'owner',
      title: 'Owner',
      sub: 'Kofi Agyekum · 22 · phone verified · 0 reports',
      ok: true,
    },
  ],
  checking: {
    title: 'What you’re checking',
    body: 'Is it a real group with a clear purpose? No company posing as a community, no pay-to-join, no contact details in the cover or name. Your decision is logged under your name.',
  },
  deadline: 'Decide within 24 hours of submission',
  reject: 'Reject',
  change: 'Ask for a change',
  approve: 'Approve',
};

export const ASK_CHANGE = {
  title: 'Ask Kofi for a change',
  whatLabel: 'What needs to change?',
  reasons: [
    'Cover photo shows a logo',
    'Name copies a company or community',
    'Rules break GTH guidelines',
    'Contact details in the name or photo',
    'Other',
  ],
  messageLabel: 'Message to the owner',
  messages: {
    'Cover photo shows a logo':
      'Your cover photo shows a company logo. Use a photo of your people instead, then send it again. Everything else looks good.',
  },
  seen: 'The owner sees this message word for word.',
  after: {
    title: 'After you send',
    body: 'Kofi gets a notification and sees “Needs a change” on his community page. Resubmissions go to the front of the queue.',
  },
  logged: 'Logged as CR-0412 · asked for a change',
  cancel: 'Cancel',
  send: 'Send to owner',
};
