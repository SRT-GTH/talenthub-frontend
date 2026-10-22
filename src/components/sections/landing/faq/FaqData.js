import {
  FaqBulbIcon,
  FaqEyeIcon,
  FaqLockIcon,
  FaqPlayIcon,
  FaqSuitcaseIcon,
  FaqUserIcon,
  FaqUsersIcon,
} from './FaqIcons.jsx';

/* P-06 FAQ copy — verbatim from Figma 7797:31009 (curly quotes kept). */

export const FAQ_HERO = {
  crumb: 'FAQ',
  chipLabel: 'Help centre',
  title: 'Questions? We’ve got you.',
  subtitle: 'Quick answers about profiles, assessments, privacy, parents and more.',
  searchPlaceholder: 'Search help, e.g. “delete my data”',
  searchHint: '⌘K',
};

/* Topic list (Categories card). `group` = id of the answers group it jumps to; the last four topics have no group drawn in Figma. */
export const FAQ_CATEGORIES = [
  {
    id: 'getting-started',
    label: 'Getting started',
    count: 6,
    Icon: FaqPlayIcon,
    group: 'getting-started',
  },
  { id: 'profile', label: 'Profile and stages', count: 8, Icon: FaqUserIcon, group: 'profile' },
  {
    id: 'assessments',
    label: 'Assessments and Skills Lab',
    count: 7,
    Icon: FaqBulbIcon,
    group: null,
  },
  { id: 'opportunities', label: 'Opportunities', count: 6, Icon: FaqSuitcaseIcon, group: null },
  { id: 'privacy', label: 'Privacy and safety', count: 9, Icon: FaqLockIcon, group: 'privacy' },
  { id: 'parents', label: 'Parents and under-18s', count: 5, Icon: FaqUsersIcon, group: 'parents' },
  {
    id: 'accessibility',
    label: 'Accessibility and languages',
    count: 4,
    Icon: FaqEyeIcon,
    group: null,
  },
];

export const FAQ_GROUPS = [
  {
    id: 'getting-started',
    title: 'Getting started',
    items: [
      {
        id: 'free',
        q: 'Is GTH really free for students?',
        a: 'Yes. Students and graduates never pay to build a profile, take assessments, use Career Buddy or apply. Companies pay to hire.',
      },
      {
        id: 'cv',
        q: 'Do I need a CV to start?',
        a: 'No. Your 9 profile stages build something better than a CV. You can add a CV later.',
      },
      {
        id: 'time',
        q: 'How long does the profile take?',
        a: 'About 20 minutes in total, in short stages that save on their own.',
      },
    ],
  },
  {
    id: 'profile',
    title: 'Profile and assessments',
    items: [
      {
        id: 'discoverable',
        q: 'What is Discoverable?',
        a: 'Your first milestone, at 3 of 9 stages. Recruiters can find you in search and you can apply.',
      },
      {
        id: 'retake',
        q: 'Can I retake the personality quiz?',
        a: 'Yes, every 90 days. Your most recent result is the one recruiters see.',
      },
      {
        id: 'labels',
        q: 'What do the skill labels mean?',
        a: 'Assessment-evidenced is strongest, then Game-evidenced, AI-validated in chat and Self-reported.',
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy and safety',
    items: [
      {
        id: 'see',
        q: 'Who can see my profile?',
        a: 'Only verified recruiters, once you reach Discoverable. You choose what’s shown.',
      },
      {
        id: 'hide',
        q: 'Can I hide from my current employer?',
        a: 'Yes. One switch in Who can see you hides your profile from that company.',
      },
      {
        id: 'delete',
        q: 'How do I delete my data?',
        a: 'Settings, Privacy, Delete my data. It’s removed within 30 days.',
      },
    ],
  },
  {
    id: 'parents',
    title: 'Parents and under-18s',
    items: [
      {
        id: 'under18',
        q: 'I’m under 18. Can I join?',
        a: 'Yes. A parent or guardian links to your account and approves matches before any contact.',
      },
      {
        id: 'parent-see',
        q: 'What can my parent see?',
        a: 'Your progress, matches and recruiter interest. Not your private chats with Career Buddy.',
      },
    ],
  },
];

export const FAQ_HELP = {
  chip: 'Still need help?',
  title: 'Talk to a human, or Career Buddy.',
  cards: [
    {
      id: 'buddy',
      title: 'Ask Career Buddy',
      body: 'Instant answers, any time, in your language where it can.',
      cta: 'Start chat',
    },
    {
      id: 'email',
      title: 'Email us',
      body: 'info@ghanatalenthub.com · replies within 1 working day.',
      cta: 'Send an email',
      href: 'mailto:info@ghanatalenthub.com',
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp support',
      body: 'Weekdays 8am to 6pm, Ghana time.',
      cta: 'Open WhatsApp',
    },
  ],
};

/* Accordion item open on first paint (Figma draws the first item expanded). */
export const FAQ_DEFAULT_OPEN = 'free';
