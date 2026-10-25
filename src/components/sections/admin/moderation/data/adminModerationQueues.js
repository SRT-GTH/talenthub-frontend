/*
 * adminModerationQueues — the four queue-style Moderation screens (Figma canvas 8520:12), generated from the Figma node text and styles and consumed by
 * queue/AdminQueueView. ⚠️ ASSUMPTION: frontend only, a handful of fixed sample items. `to` is the screen a row opens (null: no destination drawn).
 */

/* 7.2.1a Moderation · Flag queue 8627:8 */
export const FLAGS = {
  title: 'Moderation',
  sticker: '11 pending',
  subtitle:
    'Reports from users and the system, highest priority first. Claim a flag before you act on it.',
  tabs: [
    {
      id: 'pending',
      label: 'Pending',
      count: '11',
    },
    {
      id: 'in-review',
      label: 'In review',
      count: '3',
    },
    {
      id: 'all',
      label: 'All',
      count: '14',
    },
    {
      id: 'escalated',
      label: 'Escalated',
      count: '1',
    },
  ],
  tabTone: 'ink',
  defaultTab: 'all',
  chips: [
    {
      id: 'all',
      label: 'All 14',
    },
    {
      id: 'user-reports-9',
      label: 'User reports 9',
    },
    {
      id: 'system-flags-5',
      label: 'System flags 5',
    },
  ],
  defaultView: 'list',
  sort: 'Priority',
  action: 'Claim next',
  banner: 'You have 2 claimed flags older than 2 hours. Resolve or escalate them.',
  rows: [
    {
      id: 'r1',
      lead: {
        icon: 'warning',
      },
      title: 'FL-2291 · Harassment in messages',
      sticker: 'High',
      sub: 'Direct message · reported by a talent · 2h 10m ago',
      chips: [
        {
          label: 'Claimed by you',
          tone: 'amber',
        },
        {
          label: 'Messages',
          tone: 'green',
        },
        {
          label: '3rd in 30 days',
          tone: 'grey',
        },
      ],
      pill: {
        label: 'Open',
        strong: true,
      },
      age: '',
      muted: false,
      button: null,
      to: '/admin/moderation/flags/FL-2291',
    },
    {
      id: 'r2',
      lead: {
        icon: 'warning',
      },
      title: 'FL-2294 · Fake job post',
      sticker: null,
      sub: 'Opportunity · system flag · spam pattern · 40m ago',
      chips: [
        {
          label: 'System flag',
          tone: 'amber',
        },
        {
          label: 'Opportunities',
          tone: 'green',
        },
        {
          label: 'Auto-detected',
          tone: 'grey',
        },
      ],
      pill: {
        label: 'Claim',
        strong: false,
      },
      age: '',
      muted: false,
      button: null,
      to: '/admin/moderation/flags/FL-2294',
    },
    {
      id: 'r3',
      lead: {
        icon: 'warning',
      },
      title: 'FL-2287 · Hate speech in a comment',
      sticker: 'Escalated',
      sub: 'Community post · escalated to Senior Admin · 5h ago',
      chips: [
        {
          label: 'Community',
          tone: 'green',
        },
        {
          label: 'Minor author',
          tone: 'grey',
        },
      ],
      pill: {
        label: 'View',
        strong: false,
      },
      age: '',
      muted: true,
      button: 'Reassign',
      to: '/admin/moderation/flags/FL-2287',
    },
  ],
};

/* 7.2.1b Moderation · All clear 8627:563 */
export const FLAGS_EMPTY = {
  title: 'Moderation',
  sticker: '0 pending',
  subtitle:
    'Reports from users and the system, highest priority first. Claim a flag before you act on it.',
  tabs: [
    {
      id: 'pending',
      label: 'Pending',
      count: '0',
    },
    {
      id: 'in-review',
      label: 'In review',
      count: '0',
    },
    {
      id: 'escalated',
      label: 'Escalated',
      count: '0',
    },
    {
      id: 'all',
      label: 'All',
      count: '0',
    },
  ],
  tabTone: 'green',
  defaultTab: 'pending',
  chips: [
    {
      id: 'all',
      label: 'All',
    },
    {
      id: 'all-types',
      label: 'All types',
    },
    {
      id: 'high-priority',
      label: 'High priority',
    },
    {
      id: 'user-reports',
      label: 'User reports',
    },
    {
      id: 'last-24-hours',
      label: 'Last 24 hours',
    },
  ],
  defaultView: 'cards',
  sort: 'Priority',
  action: 'Claim next',
  chipsDim: true,
  empty: {
    title: 'All clear! No flags pending review.',
    text: 'New reports show up here within 60 seconds. While it’s quiet, you could:',
    steps: [
      {
        id: 's1',
        icon: 'plus',
        title: 'Review community posts',
        meta: '42 new today',
        to: '/admin/moderation/posts',
      },
      {
        id: 's2',
        icon: 'spark',
        title: 'Check content appeals',
        meta: '3 waiting',
        to: '/admin/moderation/removed',
      },
      {
        id: 's3',
        icon: 'user',
        title: 'See resolved flags',
        meta: '48 this week',
        to: '/admin/moderation',
      },
    ],
    primary: 'Refresh',
    onPrimary: '/admin/moderation',
    secondary: 'Open moderation log',
    secondaryTo: '/admin/audit-log',
  },
};

/* 7.2.3a Moderation · Removed content 8629:3065 */
export const REMOVED = {
  title: 'Removed content',
  sticker: '38 this month',
  subtitle: 'Content staff removed. Owners can appeal for 14 days. Restoring needs a Senior Admin.',
  tabs: [
    {
      id: 'removed',
      label: 'Removed',
      count: '38',
    },
    {
      id: 'appealed',
      label: 'Appealed',
      count: '3',
    },
    {
      id: 'all',
      label: 'All',
      count: '41',
    },
    {
      id: 'restored',
      label: 'Restored',
      count: '3',
    },
  ],
  tabTone: 'ink',
  defaultTab: 'all',
  chips: [
    {
      id: 'all',
      label: 'All 41',
    },
    {
      id: 'messages-22',
      label: 'Messages 22',
    },
    {
      id: 'posts-19',
      label: 'Posts 19',
    },
  ],
  defaultView: 'list',
  sort: 'Newest',
  action: 'Access review',
  banner: '3 appeals are waiting. Owners hear back within 5 working days.',
  rows: [
    {
      id: 'r1',
      lead: {
        icon: 'archive',
      },
      title: 'Message · FL-2291',
      sticker: 'Removed',
      sub: 'Removed 18 Oct by Esi Darko · harassment or threats',
      chips: [
        {
          label: 'Appeal open 14 days',
          tone: 'amber',
        },
        {
          label: 'Messages',
          tone: 'green',
        },
        {
          label: 'Warning 2 of 3',
          tone: 'grey',
        },
      ],
      pill: {
        label: 'View',
        strong: true,
      },
      age: '',
      muted: false,
      button: null,
      to: '/admin/moderation/flags/FL-2291',
    },
    {
      id: 'r2',
      lead: {
        icon: 'archive',
      },
      title: 'Opportunity · FL-2294',
      sticker: null,
      sub: 'Removed 18 Oct by the system · spam pattern',
      chips: [
        {
          label: 'Appealed',
          tone: 'amber',
        },
        {
          label: 'Opportunities',
          tone: 'green',
        },
        {
          label: 'Warning 2 of 3',
          tone: 'grey',
        },
      ],
      pill: {
        label: 'Review appeal',
        strong: false,
      },
      age: '',
      muted: false,
      button: null,
      to: '/admin/moderation/removed?modal=restore',
    },
    {
      id: 'r3',
      lead: {
        icon: 'archive',
      },
      title: 'Programme post · NYA',
      sticker: 'Blocked',
      sub: 'Government agency content needs Super Admin approval to remove',
      chips: [
        {
          label: 'Government',
          tone: 'green',
        },
        {
          label: 'Opportunities',
          tone: 'green',
        },
        {
          label: 'Super Admin only',
          tone: 'grey',
        },
      ],
      pill: {
        label: 'Request',
        strong: false,
      },
      age: '',
      muted: true,
      button: 'Restore',
      to: null,
    },
  ],
};

/* 7.2.5a Moderation · New community reviews 8956:592 */
export const COMMUNITIES = {
  title: 'New communities',
  sticker: '3 waiting',
  subtitle:
    'Talent-created communities wait here before they go live. Aim to decide within 24 hours.',
  tabs: [
    {
      id: 'waiting',
      label: 'Waiting',
      count: '3',
    },
    {
      id: 'asked-for-a-change',
      label: 'Asked for a change',
      count: '1',
    },
    {
      id: 'all',
      label: 'All',
      count: '6',
    },
    {
      id: 'escalated',
      label: 'Escalated',
      count: '0',
    },
  ],
  tabTone: 'ink',
  defaultTab: 'all',
  chips: [
    {
      id: 'all',
      label: 'All 3',
    },
    {
      id: 'ages-14-1',
      label: 'Ages 14+ · 1',
    },
    {
      id: 'auto-held-1',
      label: 'Auto-held · 1',
    },
  ],
  defaultView: 'list',
  sort: 'Priority',
  action: 'Claim next',
  banner:
    'Ages 14+ communities can be approved now, but they only open once a verified mentor joins.',
  rows: [
    {
      id: 'r1',
      lead: {
        icon: 'warning',
      },
      title: 'CR-0412 · #Agritech Innovators Ghana',
      sticker: 'Ages 14+',
      sub: 'Agriculture · Public · by Kofi Agyekum · 2h ago',
      chips: [
        {
          label: 'Claimed by you',
          tone: 'amber',
        },
        {
          label: 'Auto-checks passed',
          tone: 'green',
        },
        {
          label: 'Needs a mentor',
          tone: 'grey',
        },
      ],
      pill: {
        label: 'Open',
        strong: true,
      },
      age: '',
      muted: false,
      button: null,
      to: '/admin/moderation/communities?modal=review',
    },
    {
      id: 'r2',
      lead: {
        icon: 'warning',
      },
      title: 'CR-0413 · #MTN Youth Hustlers',
      sticker: null,
      sub: 'Entrepreneurship · auto-held: company name · 40m ago',
      chips: [
        {
          label: 'System hold',
          tone: 'amber',
        },
        {
          label: 'Name check',
          tone: 'green',
        },
        {
          label: 'Auto-detected',
          tone: 'grey',
        },
      ],
      pill: {
        label: 'Claim',
        strong: false,
      },
      age: '',
      muted: false,
      button: null,
      to: '/admin/moderation/communities?modal=review',
    },
    {
      id: 'r3',
      lead: {
        icon: 'warning',
      },
      title: 'CR-0409 · #Data Science Ghana Tamale',
      sticker: 'Resubmitted',
      sub: 'Data science · resubmitted after a change · 5h ago',
      chips: [
        {
          label: 'Cover photo',
          tone: 'green',
        },
        {
          label: 'Owner is 22',
          tone: 'grey',
        },
      ],
      pill: {
        label: 'View',
        strong: false,
      },
      age: '',
      muted: true,
      button: 'Reassign',
      to: null,
    },
  ],
};
