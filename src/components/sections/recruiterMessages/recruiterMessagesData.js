/*
 * recruiterMessagesData.js — verbatim content of the Messages screens in the Figma file
 * OHG2xsfCCskT8xEn356njv ("Job prospecting V2.0"), section "RECRUITER - MESSAGES" 7249:83992.
 *
 * Frames (1728x1117) and what they show:
 *   7249:83993 "Recruiter Dropdown"            recruiter inbox, expanded sidebar, NO dropdown drawn (base screen)
 *   7249:84379 "Recruiter - Message - Dropdown" collapsed sidebar, thread options menu open + the talent-side
 *                                              (iconed, 6 items) menu drawn next to it, "Mute notifications" hovered
 *   7249:84775 "Recruiter - Message - Dropdown" collapsed sidebar, "Unread" tab active, thread options menu open,
 *                                              "Mute notifications" hovered (Kofi's thread stays open)
 *   7249:85147 "Talents - Messages"            the SAME conversation seen by the talent (Kofi) — list shows
 *                                              "Mr. Owura Asante", bubbles mirrored, dark "Job proposal" card with a
 *                                              "View & apply →" button, extra "Today" follow-up, talent sidebar
 *   7249:85536 "Talents - Messages"            same, with the talent's thread menu (View recruiter’s profile …) open
 *
 * Data is shaped like the future API payload (inbox summary rows + thread messages). Every string is the
 * Figma node's own `characters`.
 *
 * ⚠️ ASSUMPTION — only Kofi Agyekum / Mr. Owura Asante has a Figma-drawn thread. The other three conversations are
 * drawn only as list rows, so their `thread` below is invented (short, consistent with the row preview) purely so
 * selecting a row swaps the thread pane instead of leaving it static.
 * ⚠️ ASSUMPTION — the "Today" follow-up ("Hi Sir, Sorry haven’t heard from you", Delivered) appears only in the two
 * talent-side frames; the recruiter-side frames were not updated after it was added, so it is marked
 * `visibleTo: ['talent']`.
 * ⚠️ ASSUMPTION — the little dot before a row's preview (green on Abigail Mensah, grey on Mr. Owura Asante) is not
 * labelled in Figma; modelled as `previewDotTone` ('green' | 'grey').
 * ⚠️ ASSUMPTION — the talent inbox shows tab counts "All (5)" / "Unread" (no count) while only four rows are drawn;
 * kept as drawn.
 */

export const PAGE_HEADING = { lead: 'Messages' };
export const PAGE_SUBHEADING = 'All your conversations with talents and recruiters, in one place.';

export const SEARCH_PLACEHOLDER = 'Search by name or message...';
export const COMPOSER_PLACEHOLDER = 'Type a message...';

export const INBOX_TABS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
];

/*
 * Two viewpoints of the same screen. `viewerRole` is who is looking: it decides which side a bubble sits on
 * (the viewer's own messages are the light bubbles on the right, the other person's the dark #737373 ones on
 * the left) and whose read receipts are shown.
 */
export const VIEWPOINTS = {
  recruiter: {
    id: 'recruiter',
    viewerRole: 'recruiter',
    // Tab count text exactly as drawn; '' = the tab is drawn without a count.
    tabCounts: { all: '(4)', unread: '(2)' },
    conversations: [
      {
        id: 'kofi-agyekum',
        threadId: 'kofi-agyekum',
        name: 'Kofi Agyekum',
        meta: 'Tertiary (BSc) · Accra, Ghana',
        time: '3:38 AM',
        preview: 'What are the processes to go through?',
        unread: null,
        previewDotTone: null,
        avatarId: 'kofi-agyekum',
      },
      {
        id: 'akosua-quansah',
        threadId: 'akosua-quansah',
        name: 'Akosua Quansah',
        meta: 'Tertiary (BSc) · Kumasi, Ghana',
        time: 'Yesterday',
        preview: 'Interview scheduled 🎉',
        unread: '01',
        previewDotTone: null,
        avatarId: 'akosua-quansah',
      },
      {
        id: 'roselyn-awinnor',
        threadId: 'roselyn-awinnor',
        name: 'Roselyn Awinnor',
        meta: 'Tertiary (BSc) · Tamale, Ghana',
        time: 'Friday',
        preview: 'Congratulations on moving forward to the next stage!',
        unread: '02',
        previewDotTone: null,
        avatarId: 'roselyn-awinnor',
      },
      {
        id: 'abigail-mensah',
        threadId: 'abigail-mensah',
        name: 'Abigail Mensah',
        meta: 'Tertiary (BSc) · Accra, Ghana',
        time: '13/09/2026',
        preview: 'How are you doing?',
        unread: null,
        previewDotTone: 'green',
        avatarId: 'abigail-mensah',
      },
    ],
  },
  talent: {
    id: 'talent',
    viewerRole: 'talent',
    tabCounts: { all: '(5)', unread: '' },
    conversations: [
      {
        id: 'owura-asante',
        threadId: 'kofi-agyekum',
        name: 'Mr. Owura Asante',
        meta: 'HR Lead · Farmerline',
        time: '3:38 AM',
        preview: 'Hi Sir, Sorry haven’t heard from you',
        unread: null,
        previewDotTone: 'grey',
        avatarId: 'owura-asante',
      },
      {
        id: 'akosua-quansah',
        threadId: 'akosua-quansah',
        name: 'Akosua Quansah',
        meta: 'Tertiary (BSc) · Kumasi, Ghana',
        time: 'Yesterday',
        preview: 'Interview scheduled 🎉',
        unread: '01',
        previewDotTone: null,
        avatarId: 'akosua-quansah',
      },
      {
        id: 'roselyn-awinnor',
        threadId: 'roselyn-awinnor',
        name: 'Roselyn Awinnor',
        meta: 'Tertiary (BSc) · Tamale, Ghana',
        time: 'Friday',
        preview: 'Congratulations on moving forward to the next stage!',
        unread: '02',
        previewDotTone: null,
        avatarId: 'roselyn-awinnor',
      },
      {
        id: 'abigail-mensah',
        threadId: 'abigail-mensah',
        name: 'Abigail Mensah',
        meta: 'Tertiary (BSc) · Accra, Ghana',
        time: '13/09/2026',
        preview: 'How are you doing?',
        unread: null,
        previewDotTone: 'green',
        avatarId: 'abigail-mensah',
      },
    ],
  },
};

// Keyed by `threadId`. Each thread is a list of day groups (Figma's "Yesterday" / "Today" pills).
// `from` is the sender's role; `receipt` is the sender's own delivery status (shown only to the sender).
export const THREADS = {
  'kofi-agyekum': {
    dayGroups: [
      {
        day: 'Yesterday',
        messages: [
          {
            id: 'recruiter-introduction',
            from: 'recruiter',
            text: "Hi Kofi, I came across your profile and think you'd be a great fit for one of our open roles.",
            time: '2:18 AM',
            receipt: 'Read',
          },
          {
            id: 'job-proposal',
            from: 'recruiter',
            proposal: {
              label: 'JOB PROPOSAL',
              title: 'Data Science Intern',
              company: 'Farmerline • Remote-first',
              match: '88% profile match',
              // Footer line differs by viewer: the recruiter sees the pipeline state, the talent sees a prompt
              // plus a "View & apply →" button (talent-side frames only).
              recruiterStatus: 'Awaiting response · not yet applied',
              talentStatus: 'Awaiting your response',
              talentActionLabel: 'View & apply →',
            },
          },
          {
            id: 'recruiter-follow-up',
            from: 'recruiter',
            text: "No pressure at all — happy to answer any questions about the role first if that's easier.",
            time: '2:20 AM',
            receipt: 'Read',
          },
          {
            id: 'talent-thanks',
            from: 'talent',
            text: 'Hi there Mr.Asante. I’m honored to be considered for this role. Thank you',
            time: '3:18 AM',
            receipt: 'Read',
          },
          {
            id: 'talent-process-question',
            from: 'talent',
            text: 'What are the processes to go through?',
            time: '3:38 AM',
            receipt: 'Read',
          },
        ],
      },
      {
        // ⚠️ ASSUMPTION — see file header: only the talent-side frames draw this group.
        day: 'Today',
        visibleTo: ['talent'],
        messages: [
          {
            id: 'talent-chaser',
            from: 'talent',
            text: 'Hi Sir, Sorry haven’t heard from you',
            time: '3:38 AM',
            receipt: 'Delivered',
          },
        ],
      },
    ],
  },
  // ⚠️ ASSUMPTION — invented threads below (see file header).
  'akosua-quansah': {
    dayGroups: [
      {
        day: 'Yesterday',
        messages: [
          {
            id: 'akosua-recruiter-invite',
            from: 'recruiter',
            text: 'Hi Akosua, great news — we’d like to schedule an interview with you this week.',
            time: '9:40 AM',
            receipt: 'Read',
          },
          {
            id: 'akosua-talent-confirmation',
            from: 'talent',
            text: 'Interview scheduled 🎉',
            time: '10:15 AM',
          },
        ],
      },
    ],
  },
  'roselyn-awinnor': {
    dayGroups: [
      {
        day: 'Friday',
        messages: [
          {
            id: 'roselyn-talent-check-in',
            from: 'talent',
            text: 'Hi, just checking in on my application status.',
            time: '2:00 PM',
          },
          {
            id: 'roselyn-recruiter-congratulations',
            from: 'recruiter',
            text: 'Congratulations on moving forward to the next stage!',
            time: '2:45 PM',
            receipt: 'Read',
          },
        ],
      },
    ],
  },
  'abigail-mensah': {
    dayGroups: [
      {
        day: '13/09/2026',
        messages: [
          {
            id: 'abigail-talent-greeting',
            from: 'talent',
            text: 'How are you doing?',
            time: '11:02 AM',
          },
        ],
      },
    ],
  },
};

/*
 * The menu behind the thread header's meatball button. Plain menu: 265 wide, white, 0.7px #e5e5e5,
 * r24, 4px vertical padding, 49px rows split by 0.6px #e5e5e5 rules, rows centred, 14/400 #737373,
 * hovered row #f6f6f6, destructive item #902b20.
 * `id` doubles as the `forceHover` URL value that pins a row's hover look.
 */
// 7249:84533 (recruiter frames)
export const RECRUITER_THREAD_MENU_ITEMS = [
  { id: 'view-profile', label: 'View candidate profile' },
  { id: 'mute', label: 'Mute notifications' },
  { id: 'report', label: 'Report conversation' },
  { id: 'block', label: 'Block this candidate' },
  { id: 'delete', label: 'Delete Conversation', destructive: true },
];

// 7249:85536 (talent frames)
export const TALENT_THREAD_MENU_ITEMS = [
  { id: 'view-profile', label: 'View recruiter’s profile' },
  { id: 'mute', label: 'Mute notifications' },
  { id: 'report', label: 'Report conversation' },
  { id: 'block', label: 'Block this recruiter' },
  { id: 'delete', label: 'Delete Conversation', destructive: true },
];

/*
 * 8187:78389 — the iconed, 6-item talent-side menu drawn beside the recruiter menu in frame 7249:84379 (border
 * #e6e6e6, shadow 0 1px 4px). `icon` names an icon of recruiterMessagesIcons; `iconGap` is the gap to the label as
 * drawn. Figma draws NO rule between "Archive conversation" and "Report conversation": kept as drawn
 * (`ruleBefore: false`).
 */
export const TALENT_ICON_THREAD_MENU_ITEMS = [
  { id: 'view-profile', label: 'View recruiter’s profile', icon: 'viewProfile', iconGap: 12 },
  { id: 'mute', label: 'Mute notifications', icon: 'muteNotifications', iconGap: 12 },
  { id: 'archive', label: 'Archive conversation', icon: 'archive', iconGap: 8 },
  { id: 'report', label: 'Report conversation', icon: 'reportFlag', iconGap: 8, ruleBefore: false },
  { id: 'block', label: 'Block this recruiter', icon: 'block', iconGap: 5 },
  {
    id: 'delete',
    label: 'Delete Conversation',
    icon: 'deleteTrash',
    iconGap: 5,
    destructive: true,
  },
];
