/*
 * recruiterMessagesData.js — verbatim content for the Recruiter Messages
 * screen. Source: Figma Bin8roWL8sloyc36IgFMuT, frame 7249:83993
 * ("RECRUITER - MESSAGES / Recruiter Dropdown"), canvas 7249:84024.
 *
 * The section's other four frames are states of this same screen (two header
 * dropdowns and the talent-side view of the same thread), not separate pages.
 *
 * ⚠️ ASSUMPTION — only Kofi Agyekum has a real Figma-designed thread
 * (recruiter's own view: 7249:84859; mirrored talent-side view: 7249:85253 /
 * 7249:85642). The other three conversations only ever had a list-row preview
 * in Figma, never an opened thread, so their `thread` below is fabricated —
 * written to be internally consistent with that preview/unread state, not
 * sourced from any frame — purely so the thread pane has something real to
 * swap to instead of staying static when a different row is selected.
 *
 * Kofi's thread itself got two corrections against 7249:84859 that an
 * earlier pass had wrong:
 *   1. The TALENT's own bubble is `#737373` with white text, not `#32683a`
 *      (brand green) — confirmed against both the recruiter-view frame and
 *      its talent-view mirror, which agree on this color.
 *   2. The candidate-card gradient is `linear-gradient(200.24deg, ...)`, not
 *      `225deg` — re-measured directly off 7249:84882's own style attribute.
 * And one addition: both talent-view frames (7249:85253, 7249:85642) show a
 * second "Today" group with a follow-up talent message ("Hi Sir, Sorry
 * haven't heard from you", Delivered) that the recruiter-view frame
 * (7249:84859) doesn't have — looks like the recruiter frame just wasn't
 * updated after that follow-up was added on the talent side. Included here
 * since two of three frames agree on it and it's the more complete version
 * of the same conversation.
 */

export const PAGE_HEADING = { lead: 'Messages' };
export const PAGE_SUBHEADING = 'All your conversations with talents and recruiters, in one place.';

export const SEARCH_PLACEHOLDER = 'Search by name or message...';
export const COMPOSER_PLACEHOLDER = 'Type a message...';

export const INBOX_TABS = [
  { id: 'all', label: 'All', count: '(4)' },
  { id: 'unread', label: 'Unread (2)' },
];

// Figma 7249:84040 onwards. Avatar keys map to project assets in the section.
// `meta` is the one-liner shown under the name in the opened thread's header
// pill (Figma 7249:84865-67) — only Kofi's is Figma-sourced, see file header.
export const CONVERSATIONS = [
  {
    id: 'kofi-agyekum',
    name: 'Kofi Agyekum',
    meta: 'Tertiary (BSc) · Accra, Ghana',
    time: '3:38 AM',
    preview: 'What are the processes to go through?',
    unread: null,
  },
  {
    id: 'akosua-quansah',
    name: 'Akosua Quansah',
    meta: 'Tertiary (BSc) · Kumasi, Ghana',
    time: 'Yesterday',
    preview: 'Interview scheduled 🎉',
    unread: '01',
  },
  {
    id: 'roselyn-awinnor',
    name: 'Roselyn Awinnor',
    meta: 'Tertiary (BSc) · Tamale, Ghana',
    time: 'Friday',
    preview: 'Congratulations on moving forward to the next stage!',
    unread: '02',
  },
  {
    id: 'abigail-mensah',
    name: 'Abigail Mensah',
    meta: 'Tertiary (BSc) · Accra, Ghana',
    time: '13/09/2026',
    preview: 'How are you doing?',
    unread: null,
  },
];

// Keyed by CONVERSATIONS[].id. Each thread is a list of day groups (Figma's
// own "Yesterday" / "Today" pills, 7249:84874 etc.) so a conversation can
// carry more than one without the day divider being a single fixed string.
export const THREADS = {
  'kofi-agyekum': {
    dayGroups: [
      {
        day: 'Yesterday',
        messages: [
          {
            id: 'm1',
            from: 'recruiter',
            text: "Hi Kofi, I came across your profile and think you'd be a great fit for one of our open roles.",
            time: '2:18 AM',
            receipt: 'Read',
          },
          {
            id: 'proposal',
            from: 'recruiter',
            proposal: {
              label: 'JOB PROPOSAL',
              title: 'Data Science Intern',
              company: 'Farmerline • Remote-first',
              match: '88% profile match',
              status: 'Awaiting response · not yet applied',
            },
          },
          {
            id: 'm2',
            from: 'recruiter',
            text: "No pressure at all — happy to answer any questions about the role first if that's easier.",
            time: '2:20 AM',
            receipt: 'Read',
          },
          {
            id: 'm3',
            from: 'talent',
            text: 'Hi there Mr.Asante. I’m honored to be considered for this role. Thank you',
            time: '3:18 AM',
          },
          {
            id: 'm4',
            from: 'talent',
            text: 'What are the processes to go through?',
            time: '3:38 AM',
          },
        ],
      },
      {
        // ⚠️ ASSUMPTION — see file header: present on both talent-view frames,
        // absent on the recruiter-view one.
        day: 'Today',
        messages: [
          {
            id: 'm5',
            from: 'talent',
            text: 'Hi Sir, Sorry haven’t heard from you',
            time: '3:38 AM',
          },
        ],
      },
    ],
  },
  // ⚠️ ASSUMPTION — fabricated threads below, see file header. Kept short
  // and consistent with each conversation's own Figma-sourced preview/unread
  // state rather than invented from nothing.
  'akosua-quansah': {
    dayGroups: [
      {
        day: 'Yesterday',
        messages: [
          {
            id: 'ak1',
            from: 'recruiter',
            text: 'Hi Akosua, great news — we’d like to schedule an interview with you this week.',
            time: '9:40 AM',
            receipt: 'Read',
          },
          {
            id: 'ak2',
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
            id: 'ro1',
            from: 'talent',
            text: 'Hi, just checking in on my application status.',
            time: '2:00 PM',
          },
          {
            id: 'ro2',
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
            id: 'ab1',
            from: 'talent',
            text: 'How are you doing?',
            time: '11:02 AM',
          },
        ],
      },
    ],
  },
};

// Figma 7249:84533 — the menu behind the thread header's meatball button.
// 265x255, white, 0.7px #e5e5e5, r24, 4px vertical padding, 49px rows split by
// 0.6px #e5e5e5 rules, hovered row #f6f6f6. Labels are 14/400 #737373; the
// final item is destructive (#902b20).
export const THREAD_MENU_ITEMS = [
  { id: 'view-profile', label: 'View candidate profile' },
  { id: 'mute', label: 'Mute notifications' },
  { id: 'report', label: 'Report conversation' },
  { id: 'block', label: 'Block this candidate' },
  { id: 'delete', label: 'Delete Conversation', destructive: true },
];
