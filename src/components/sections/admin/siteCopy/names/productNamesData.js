/*
 * productNamesData — mock data of the Product names screens (Platform Admin 7.8.6a-j, Figma file iErYj7O3ft6WAG2FBT6aEw).
 * `PRODUCT_NAMES` is the seed of the shared list `useCopyKv('product-names.list', PRODUCT_NAMES)` (builder B1's name chips read it to
 * offer "Insert name"), shaped like a future API payload:
 *   { id, kind, name, short, plural, former: string[], status: 'live', usage, examples }
 *   usage     counts of the places a name is used: { public, talent, parent, recruiter, institution, emails, assistant }
 *   examples  before → after sentences of the rename drawer: `{name}` / `{short}` are replaced by the new full / short name
 * Rows of frame 7.8.6a: NAME · FULL NAME · SHORT NAME · PLURAL · FORMER NAMES · STATUS (all seven rows are verbatim).
 * The rename records live in `useCopyKv('product-names.renames', {})`, shape (builder A reads the same key):
 *   { [nameId]: { draft: { name, short, plural }, status: 'draft' | 'published', reason, by, at, publishedBy?, publishedAt? } }
 *
 * ⚠️ ASSUMPTION: only the Assistant row has drawn usage counts (14 / 212 / 18 / 9 / 4 / 23 / All) and examples. The other six rows keep
 * the same shape with invented counts and one invented example each, so "Rename" works on every row; none of them is drawn.
 */

/** Short labels of the places a name is used (frame 7.8.6b "WHERE IT’S USED"), in drawn order. */
export const USAGE_PLACES = [
  { key: 'public', label: 'Public site' },
  { key: 'talent', label: 'Talent' },
  { key: 'parent', label: 'Parent' },
  { key: 'recruiter', label: 'Recruiter' },
  { key: 'institution', label: 'Institution' },
  { key: 'emails', label: 'Emails' },
  { key: 'assistant', label: 'Assistant replies' },
];

export const NAME_LIMITS = { name: 40, short: 14, plural: 40, reason: 200 };

export const PRODUCT_NAMES = [
  {
    id: 'career-buddy',
    kind: 'Assistant',
    name: 'Career Buddy',
    short: 'Buddy',
    plural: '',
    former: [],
    status: 'live',
    usage: {
      public: 14,
      talent: 212,
      parent: 18,
      recruiter: 9,
      institution: 4,
      emails: 23,
      assistant: 'All',
    },
    examples: [
      {
        template: 'Ask {name} anything about jobs.',
        before: 'Ask Career Buddy anything about jobs.',
      },
      { template: '{short} picked 3 posts for you.', before: 'Buddy picked 3 posts for you.' },
    ],
  },
  {
    id: 'ghana-talent-hub',
    kind: 'Platform',
    name: 'Ghana Talent Hub',
    short: 'GTH',
    plural: '',
    former: [],
    status: 'live',
    // ⚠️ ASSUMPTION: counts and example are invented (only the Assistant row is drawn).
    usage: {
      public: 31,
      talent: 96,
      parent: 12,
      recruiter: 14,
      institution: 8,
      emails: 31,
      assistant: 'All',
    },
    examples: [{ template: 'Welcome to {name}.', before: 'Welcome to Ghana Talent Hub.' }],
  },
  {
    id: 'community',
    kind: 'Community',
    name: 'Community',
    short: '',
    plural: 'Communities',
    former: [],
    status: 'live',
    // ⚠️ ASSUMPTION: counts and example are invented.
    usage: {
      public: 6,
      talent: 44,
      parent: 5,
      recruiter: 2,
      institution: 3,
      emails: 9,
      assistant: 'All',
    },
    examples: [
      {
        template: 'Join the {name} to ask questions.',
        before: 'Join the Community to ask questions.',
      },
    ],
  },
  {
    id: 'my-circle',
    kind: 'My circle',
    name: 'My circle',
    short: '',
    plural: '',
    former: [],
    status: 'live',
    // ⚠️ ASSUMPTION: counts and example are invented.
    usage: {
      public: 2,
      talent: 38,
      parent: 4,
      recruiter: 1,
      institution: 1,
      emails: 6,
      assistant: 'All',
    },
    examples: [{ template: 'Add someone to {name}.', before: 'Add someone to My circle.' }],
  },
  {
    id: 'skills-lab',
    kind: 'Skills Lab',
    name: 'Skills Lab',
    short: 'Lab',
    plural: '',
    former: [],
    status: 'live',
    // ⚠️ ASSUMPTION: counts and example are invented.
    usage: {
      public: 8,
      talent: 71,
      parent: 6,
      recruiter: 3,
      institution: 2,
      emails: 11,
      assistant: 'All',
    },
    examples: [
      { template: 'Open the {name} to practise.', before: 'Open the Skills Lab to practise.' },
    ],
  },
  {
    id: 'profile-journey',
    kind: 'Profile journey',
    name: 'Profile journey',
    short: 'Journey',
    plural: '',
    former: [],
    status: 'live',
    // ⚠️ ASSUMPTION: counts and example are invented.
    usage: {
      public: 4,
      talent: 52,
      parent: 3,
      recruiter: 2,
      institution: 1,
      emails: 7,
      assistant: 'All',
    },
    examples: [{ template: 'Continue your {name}.', before: 'Continue your Profile journey.' }],
  },
  {
    id: 'wallet',
    kind: 'Wallet',
    name: 'Wallet',
    short: '',
    plural: '',
    former: [],
    status: 'live',
    // ⚠️ ASSUMPTION: counts and example are invented.
    usage: {
      public: 3,
      talent: 29,
      parent: 2,
      recruiter: 0,
      institution: 0,
      emails: 5,
      assistant: 'All',
    },
    examples: [
      {
        template: 'Your {name} shows every badge you earned.',
        before: 'Your Wallet shows every badge you earned.',
      },
    ],
  },
];

/** The staff of the mock rename flow (Figma 7.8.6e-i). */
export const NAME_STAFF = { editor: 'Ama Owusu', superAdmin: 'Nana Adjei' };

/** Frame copy of the Product names screens, verbatim from the Figma nodes. */
export const NAME_COPY = {
  title: 'Product names',
  subtitle: 'The platform’s own names, in one place. Renames need a super admin to publish.',
  chipsNote:
    'Names in page text are “name chips”, so a rename updates every page, email and the assistant’s replies at once. Former names are remembered, so the assistant still understands them.',
  draftOnly: 'You can draft this rename. A super admin publishes it.',
  columns: ['NAME', 'FULL NAME', 'SHORT NAME', 'PLURAL', 'FORMER NAMES', 'STATUS'],
  errors: {
    shortTooLong: 'Keep the short name under 15 characters. It appears in small buttons.',
    unsafe: 'Names can use letters, numbers, spaces and - ’ & . only. No line breaks.',
    reasonMissing:
      'Add a reason before publishing a rename. Everyone on the team sees it in the history.',
    // ⚠️ ASSUMPTION: not drawn (the frames only draw the three above); written in the voice of the drawn messages.
    nameMissing: 'Add a full name.',
    nameTooLong: 'Keep the full name under 41 characters.',
    pluralTooLong: 'Keep the plural under 41 characters.',
    unchanged: 'Change a name before you save.',
  },
};

/** The seed of the frame URLs (`?seed=draft | published | none`, see ProductNames.jsx): the Assistant renamed to Tali. */
export const SEED_REASON = 'Brand refresh approved by the board'; // frame 7.8.6g "writing field" (also the reason of 7.8.6h / 7.8.6i)
export const SEED_DRAFT = { name: 'Tali', short: 'Tali', plural: '' };
