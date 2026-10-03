/*
 * recruiterMessagesData.js — verbatim content for the Recruiter Messages
 * screen. Source: Figma Bin8roWL8sloyc36IgFMuT, frame 7249:83993
 * ("RECRUITER - MESSAGES / Recruiter Dropdown"), canvas 7249:84024.
 *
 * The section's other four frames are states of this same screen (two header
 * dropdowns and the talent-side view of the same thread), not separate pages.
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
export const CONVERSATIONS = [
  {
    id: 'kofi-agyekum',
    name: 'Kofi Agyekum',
    time: '3:38 AM',
    preview: 'What are the processes to go through?',
    unread: null,
  },
  {
    id: 'akosua-quansah',
    name: 'Akosua Quansah',
    time: 'Yesterday',
    preview: 'Interview scheduled 🎉',
    unread: '01',
  },
  {
    id: 'roselyn-awinnor',
    name: 'Roselyn Awinnor',
    time: 'Friday',
    preview: 'Congratulations on moving forward to the next stage!',
    unread: '02',
  },
  {
    id: 'abigail-mensah',
    name: 'Abigail Mensah',
    time: '13/09/2026',
    preview: 'How are you doing?',
    unread: null,
  },
];

export const ACTIVE_THREAD = {
  name: 'Kofi Agyekum',
  meta: 'Tertiary (BSc) · Accra, Ghana',
  dayDivider: 'Yesterday',
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
