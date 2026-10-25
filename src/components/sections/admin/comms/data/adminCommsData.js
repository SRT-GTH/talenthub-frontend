/*
 * adminCommsData — copy of the Comms screens (Figma canvas 8520:12, section 7.4): 7.4.0a Sent and scheduled 8638:8, 7.4.1a Message user 8625:6087, 7.4.2a-e Bulk notification
 * 8638:540 / 1150 / 1792 / 2410 / 3190, 7.4.3a-d Notification templates 8638:3946 / 4516 / 5203 / 8666:11839. ⚠️ ASSUMPTION: frontend only, fixed sample messages.
 */

export const COMMS_HEAD = {
  title: 'Comms',
  sub: 'Bulk notifications, direct messages and the templates behind them. Every send is logged.',
  action: 'New bulk notification',
};

export const TABS = [
  { id: 'sent', label: 'Sent', to: '/admin/comms' },
  { id: 'templates', label: 'Templates', to: '/admin/comms/templates' },
  { id: 'bulk', label: 'Bulk notification', to: '/admin/comms/bulk' },
];

/* 7.4.0a — the inbox of sends: list on the left, the selected send as a thread on the right. */
export const INBOX = {
  search: 'Search messages…',
  tabs: [
    { id: 'all', label: 'All', count: '4' },
    { id: 'drafts', label: 'Drafts', count: '1' },
  ],
  items: [
    {
      id: 'm1',
      title: 'Maintenance · Sun 25 Oct',
      sub: 'All users · 219,428 · sending',
      time: 'Today',
      active: true,
    },
    {
      id: 'm2',
      title: 'Scholarship season reminder',
      sub: 'Talents 18–24 · 96,410 · 61% opened',
      time: 'Today',
      count: '01',
    },
    {
      id: 'm3',
      title: 'KYB reminder to partners',
      sub: 'Partners · 28 · 22 opened',
      time: 'Friday',
      count: '02',
    },
    {
      id: 'm4',
      title: 'Draft · New community rules',
      sub: 'Waiting for Super Admin approval',
      time: '13 Sep',
      dot: true,
    },
  ],
  thread: {
    title: 'Maintenance · Sun 25 Oct',
    sub: 'All users · 219,428 · sending since 09:00',
    day: 'Today',
    message: {
      text: 'GTH will be down for maintenance on Sunday 25 October, 01:00–03:00. Your profile and messages are safe.',
      time: '09:00',
      status: '8,412 delivered',
    },
    template: {
      eyebrow: 'TEMPLATE',
      title: 'Scholarship season reminder',
      sub: 'Maintenance notice · v3 · approved by Nana Adjei',
      channel: 'In-platform + email',
      foot: '0.3% bounced · 12 opted out',
    },
    test: {
      text: 'Test sent to 5 internal accounts at 08:52. All received.',
      time: '09:01',
      status: 'Read',
    },
    replies: [
      { id: 'r1', text: 'Test account 1 · received 08:52', time: '11:42' },
      { id: 'r2', text: 'Delivery: 8,412 of 12,400 in this batch', time: '11:20' },
    ],
    notePlaceholder: 'Add an internal note…',
  },
};

/* 7.4.1a / 7.4.3b — the channel picker of both dialogs (the frames draw the same three cards; 7.4.3b labels the third one "In-platform" again). */
export const MESSAGE_USER = {
  title: 'Message Kofi Agyekum',
  channelLabel: 'Channel',
  channels: [
    { id: 'in-platform', label: 'In-platform', icon: 'user' },
    { id: 'email', label: 'Email', icon: 'users' },
    { id: 'sms', label: 'SMS · opted out', icon: 'company', selected: true },
  ],
  text: 'Hi Kofi, we reviewed the report on your account and closed it with no action. Thanks for your patience. Template: Report closed, no action.',
  link: 'Link to ticket SUP-10442',
  preview: 'Preview',
  send: 'Send message',
};

/* 7.4.2a — bulk notification. */
export const BULK = {
  title: 'Bulk notification',
  sub: 'Pick who gets it. Senior Admins draft; Super Admins approve and send.',
  templateLabel: 'Template',
  template: 'Maintenance notice · v3',
  audience: 'AUDIENCE',
  automated: 'AUTOMATED',
  criteria: [
    {
      id: 'type',
      icon: 'usertype',
      title: 'User type',
      sub: 'Talents, partners, recruiters, institutions, agencies.',
      on: true,
      control: { kind: 'select', label: 'All users' },
    },
    {
      id: 'region',
      icon: 'region',
      title: 'Region',
      sub: 'Leave empty for national.',
      on: true,
      control: { kind: 'region', label: 'National', add: '+ Add region' },
    },
    {
      id: 'channel',
      icon: 'channel',
      title: 'Channel',
      sub: 'Each user’s opt-outs are respected.',
      on: false,
      control: { kind: 'text', label: 'In-platform + email' },
    },
  ],
  reach: {
    title: 'Reach',
    audience: ['Audience', '219,428'],
    bar: 0.12,
    willGet: ['will get it', '212,940'],
    reachable: '97% reachable after opt-outs',
    rating: 97,
    note: 'About 212,940 people. Over 50,000 needs you to type CONFIRM.',
    test: 'Send a test',
    submit: 'Submit for approval',
  },
  schedule: {
    icon: 'schedule',
    title: 'Schedule',
    sub: 'Send now or pick a time.',
    chip: 'SEND',
    when: 'Sun 25 Oct, 08:00',
    fill: 0.86,
    on: true,
  },
  minors: {
    icon: 'under18',
    title: 'Under-18s',
    sub: 'Included. System notices don’t copy parents.',
    included: 'Included',
    policy: 'Policy',
    on: true,
  },
  delivery: {
    title: 'DELIVERY',
    cards: [
      { id: 'last', label: 'Last bulk send', value: '4 min', sub: 'To deliver 100,000 messages.' },
      { id: 'opt', label: 'Opt-outs', value: '0.4%', sub: 'Users who turned email off.' },
      { id: 'bounce', label: 'Bounces', value: '0.3%', sub: 'Bad addresses are skipped.' },
    ],
  },
};

export const TEST_DIALOG = {
  title: 'Send a test first?',
  body: 'A test goes to 5 internal accounts. Check it looks right before 212,940 people get it.',
  primary: 'Send test',
  secondary: 'Cancel',
};

export const APPROVAL_DIALOG = {
  title: 'Submit for approval?',
  body: 'A Super Admin checks the test and the audience, then sends it. Nobody can approve their own bulk notification.',
  primary: 'Submit for approval',
  secondary: 'Cancel',
};

export const CONFIRM_DIALOG = {
  title: 'This reaches 212,940 people',
  body: 'Sends can’t be recalled. The test was approved by Akua Sarfo at 08:55.',
  label: 'Type CONFIRM to send',
  word: 'CONFIRM',
  primary: 'Send now',
  secondary: 'Cancel',
};

export const SENDING = {
  title: 'Sending to 212,940 people',
  sub: 'Sent: 8,412 of 12,400 in this batch. About 4 minutes left. You can leave this page.',
  fill: 0.595,
  batch: 'Batch 1 of 18',
  steps: [
    { id: 's1', label: 'Test approved', state: 'done' },
    { id: 's2', label: 'Sending batch 1', state: 'done' },
    { id: 's3', label: 'Batches 2–18', state: 'active' },
    { id: 's4', label: 'Delivery report', state: 'next' },
  ],
  pause: 'Pause sending',
};

/* 7.4.3a — templates. */
export const TEMPLATES = {
  title: 'Notification templates',
  sub: 'Pre-approved messages that staff and system events use. Only Super Admins publish changes.',
  filters: ['All', 'Account', 'Moderation', 'Verification', 'System', 'Marketing', 'Minors'],
  search: 'Search templates…',
  create: 'New template',
  cards: [
    {
      id: 't1',
      title: 'Account suspended',
      area: 'Account',
      channel: 'Email + in-platform',
      text: 'Used by 2 system events. Variables: name, reason, end date.',
      status: 'Active · v4',
      icon: 'code',
      tile: '#f3f8f4',
      quirk: true,
    },
    {
      id: 't2',
      title: 'Content removed',
      area: 'Account',
      channel: 'In-platform',
      text: 'Tells the owner what was removed and how to appeal.',
      status: 'Active · v2',
      icon: 'megaphone',
      tile: '#ffddb6',
    },
    {
      id: 't3',
      title: 'KYB needs more info',
      area: 'Verification',
      channel: 'Email',
      text: 'Lists exactly what the partner must upload.',
      status: 'Active · v3',
      icon: 'shield',
      tile: '#c1e9c9',
    },
    {
      id: 't4',
      title: 'Maintenance notice',
      area: 'System',
      channel: 'Email + in-platform',
      text: 'Planned downtime with start and end times.',
      status: 'Draft · v4',
      icon: 'cap',
      tile: '#eae8e2',
    },
    {
      id: 't5',
      title: 'Report closed, no action',
      area: 'Moderation',
      channel: 'In-platform',
      text: 'Thanks the reporter after a review.',
      status: 'Active · v1',
      icon: 'palette',
      tile: '#1f6b3f',
      dark: true,
    },
  ],
  blank: { title: 'New template', text: 'Start from scratch. Publishing needs a Super Admin.' },
};

export const EDIT_TEMPLATE = {
  title: 'Edit template · Account suspended',
  channelLabel: 'Channels',
  text: 'Hi {name}, your GTH account is suspended until {end_date} because: {reason}. Reply to this message to appeal.',
  preview: 'Preview with test data (Kwame Test)',
  draft: 'Save draft',
  publish: 'Publish v5',
};

export const PUBLISH_DIALOG = {
  title: '2 system events use this template',
  body: 'Publishing changes the suspension and reactivation emails straight away. Version 4 stays live until you publish.',
  primary: 'Publish v5',
  secondary: 'Cancel',
};

export const HISTORY = {
  chip: 'Version history',
  title: 'Account suspended · v4 vs v5',
  sub: 'Account suspended · compare any two versions. Only Active versions are used by staff and system events.',
  file: {
    title: 'v5 draft vs v4 live',
    meta: '2 lines changed · edited by Nana Adjei',
    action: 'Pick versions',
  },
  left: {
    label: 'v4 · live since 2 Aug',
    text: 'Hi {name}, your account is suspended because: {reason}.',
  },
  right: {
    label: 'v5 · draft',
    text: 'Hi {name}, your account is suspended until {end_date} because: {reason}.',
  },
  removed: { label: 'Removed', value: '“Contact support to appeal.”' },
  changed: { label: 'Changed text', value: '“Reply to this message to appeal.”' },
  added: { label: 'Added', value: '“Your suspension ends on {end_date}.”' },
  variables: { label: 'Variables', value: 'name, reason, end_date' },
  events: { label: 'Events', value: 'Used by 2 system events' },
  earlier: { label: 'Earlier versions', value: 'v3 · 14 Jun · v2 · 2 Mar' },
  only: 'Show only changed lines',
  note: 'Publishing v5 replaces v4 for every event',
  rollback: 'Roll back to v3',
  close: 'Close',
  publish: 'Publish v5',
};
