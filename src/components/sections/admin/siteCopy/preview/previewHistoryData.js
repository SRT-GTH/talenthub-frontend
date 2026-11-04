/*
 * previewHistoryData — mock seed of the Preview (7.8.3) and History (7.8.5) screens of Platform Admin 7.8 (Figma file iErYj7O3ft6WAG2FBT6aEw,
 * frames 7.8.3a-h and 7.8.5a-e). Shaped like a future API payload; nothing here is sent anywhere.
 *
 * Shared mock "server" keys (useCopyKv, see ../useCopyKv.js):
 *   site-copy.drafts            { [sectionId]: { fields: { [fieldKey]: { draft } }, savedAt } }
 *   site-copy.published         { [sectionId]: { fields: { [fieldKey]: { published } }, version, publishedAt } }   (a bare string is read as `published` too)
 *   site-copy.history.<id>      [{ version, who, when, why, fields: { [fieldKey]: { before, after } }, restoredFrom?, original? }]  newest last
 * Every text below that is drawn in Figma is copied verbatim from the frames; everything else is tagged ⚠️ ASSUMPTION.
 */

export const PORTAL_TABS = [
  { id: 'public', label: 'Public site' },
  { id: 'talent', label: 'Talent' },
  { id: 'parent', label: 'Parent' },
  { id: 'recruiter', label: 'Recruiter' },
  { id: 'institution', label: 'Institution' },
  { id: 'emails', label: 'Emails' },
];

export const DRAFTS_KEY = 'site-copy.drafts';
export const PUBLISHED_KEY = 'site-copy.published';
export const historyKey = (sectionId) => `site-copy.history.${sectionId}`;

/** ⚠️ ASSUMPTION: the editor stores rich text as light markdown: **bold** and lines starting "- " are bullets (7.8.3f draws exactly that). */
export const FAQ_ANSWER_DRAFT =
  'Yes. Ghana Talent Hub is **free for every student**. You only need a phone number to start.\n- Create your profile in 5 minutes\n- Prove your skills with short games\n- Get matched with real opportunities';

const HERO_SUPPORT =
  'Show what you can do, get verified skills and connect with employers across Ghana.';

/** The Home hero as the public site shows it. Counters (max) for the headline / buttons are ⚠️ ASSUMPTION (Figma draws 40 for the "How it works" fields only). */
const HERO_FIELDS = [
  { key: 'headline', label: 'Headline', published: 'Find work that fits you', max: 60 },
  { key: 'supporting', label: 'Supporting line', published: HERO_SUPPORT, max: 140, long: true },
  { key: 'primary_cta', label: 'Main button text', published: 'Create my profile', max: 24 },
  // ⚠️ ASSUMPTION: the label of the fourth hero field ("3 other fields are the same" in 7.8.5b proves there are four; only three labels are drawn).
  { key: 'secondary_cta', label: 'Second button text', published: 'See how it works', max: 24 },
];

const HOW_FIELDS = [
  { key: 'title', label: 'Section title', published: 'How it works', max: 40 },
  { key: 'step1', label: 'Step 1', published: 'Build your profile', max: 40 },
  { key: 'step2', label: 'Step 2', published: 'Prove your skills', max: 40 },
  { key: 'step3', label: 'Step 3', published: 'Get matched', max: 40 },
];

/** ⚠️ ASSUMPTION: the FAQ answers a1 and a3 are not drawn (collapsed in 7.8.3f); their text is invented, in the voice of the drawn answer. */
const FAQ_FIELDS = [
  { key: 'heading', label: 'Section title', published: 'Questions people ask', max: 60 },
  { key: 'q1', label: 'Question 1', published: 'Who is Ghana Talent Hub for?', max: 80 },
  {
    key: 'a1',
    label: 'Answer 1',
    published: 'Students, parents, recruiters and schools across Ghana.',
    max: 400,
    long: true,
  },
  { key: 'q2', label: 'Question 2', published: 'Is it free to join?', max: 80 },
  {
    key: 'a2',
    label: 'Answer 2',
    published:
      'Yes. Ghana Talent Hub is free for every student. You only need a phone number to start.',
    max: 400,
    long: true,
  },
  { key: 'q3', label: 'Question 3', published: 'Do I need a CV?', max: 80 },
  {
    key: 'a3',
    label: 'Answer 3',
    published: 'No. Your profile and your skill results speak for you.',
    max: 400,
    long: true,
  },
];

const PLAIN = (key, label, published) => [{ key, label, published, max: 120, long: true }];

/**
 * The sections the preview and the history know by name. `previewKind` picks the mock page: 'home-top' (hero + How it works),
 * 'faq' (accordion) or 'generic' (any other section: the site nav and one card with the section's fields).
 */
export const SECTION_CATALOG = {
  'public.home.hero': {
    portal: 'public',
    page: 'Home',
    label: 'Hero',
    previewKind: 'home-top',
    fields: HERO_FIELDS,
  },
  'public.home.how-it-works': {
    portal: 'public',
    page: 'Home',
    label: 'How it works',
    previewKind: 'home-top',
    fields: HOW_FIELDS,
  },
  'public.home.features': {
    portal: 'public',
    page: 'Home',
    label: 'Features',
    previewKind: 'generic',
    fields: PLAIN('headline', 'Headline', 'Everything you need to start your career'),
  },
  'public.home.made-for-ghana': {
    portal: 'public',
    page: 'Home',
    label: 'Made for Ghana',
    previewKind: 'generic',
    fields: PLAIN('headline', 'Headline', 'Built with schools, employers and families'),
  },
  'public.home.faq': {
    portal: 'public',
    page: 'Home',
    label: 'FAQ',
    previewKind: 'faq',
    fields: FAQ_FIELDS,
  },
  'public.shared.footer': {
    portal: 'public',
    page: 'Home',
    label: 'Footer',
    previewKind: 'generic',
    fields: PLAIN('links', 'Links', 'About · Help · Privacy · Terms'),
  },
};

/** The "Pages" panel of the History screen (7.8.5): Public site pages and their sections. 46 pages is the total drawn in the frame. */
export const PAGES_TOTAL = 46;
export const PUBLIC_PAGES = [
  {
    id: 'home',
    label: 'Home',
    status: 'edited',
    sections: [
      {
        id: 'public.home.hero',
        label: 'Hero',
        summary: 'Find work that fits you',
        status: 'edited',
      },
      {
        id: 'public.home.how-it-works',
        label: 'How it works',
        summary: 'Build your profile, prove your skills, get matched',
        status: 'default',
      },
      {
        id: 'public.home.features',
        label: 'Features',
        summary: 'Everything you need to start your career',
        status: 'default',
      },
      {
        id: 'public.home.made-for-ghana',
        label: 'Made for Ghana',
        summary: 'Built with schools, employers and families',
        status: 'edited',
      },
      {
        id: 'public.home.faq',
        label: 'FAQ',
        summary: 'Questions people ask before they join',
        status: 'default',
      },
      {
        id: 'public.shared.footer',
        label: 'Footer',
        summary: 'About · Help · Privacy · Terms',
        status: 'shared',
      },
    ],
  },
  { id: 'how-it-works', label: 'How it works', status: 'edited', sections: [] },
  { id: 'for-students', label: 'For students', status: 'default', sections: [] },
  { id: 'for-parents', label: 'For parents', status: 'default', sections: [] },
  { id: 'for-recruiters', label: 'For recruiters', status: 'edited', sections: [] },
];

/** 7.8.3a-f: drafts the mock staff already has (the Content Editor home says "3 Drafts"). The third one is ⚠️ ASSUMPTION (only the count 3 is drawn). */
export const SEED_DRAFTS = {
  'public.home.hero': {
    fields: { headline: { draft: 'Your future starts here' } },
    savedAt: '2026-11-04T09:12:00.000Z',
  },
  'public.home.faq': {
    fields: { a2: { draft: FAQ_ANSWER_DRAFT } },
    savedAt: '2026-11-04T09:40:00.000Z',
  },
  'talent.dashboard.welcome-banner': {
    fields: {},
    savedAt: '2026-11-03T16:05:00.000Z',
  },
};

/** 7.8.3c: the long headline of the phone frame. Reached with `?sample=long-headline` (a frame URL must not depend on stored drafts). */
export const LONG_HEADLINE_SAMPLE = 'Your future starts here, with skills employers can trust';

const field = (before, after) => ({ before, after });
const ORIGINAL_PRIMARY = 'Start my profile'; // ⚠️ ASSUMPTION (the original button text is not drawn)

/**
 * 7.8.5a / 5b: the drawn history of `public.home.hero`. Who / when / why / changed-field labels are verbatim; the before / after values that
 * Figma draws are the headline of v4 → v5 ("Your future starts here" → "Your futur starts here", the typo). Every other before / after value
 * is ⚠️ ASSUMPTION (only the labels of the changed fields are drawn). `when` strings are display text, as drawn.
 * Figma inconsistency kept as drawn: v5 (live) has the typo headline while 7.8.3g shows "Find work that fits you" as what everyone sees.
 */
export const SEED_HERO_HISTORY = [
  {
    version: 1,
    who: null,
    when: 'Original from the design',
    why: 'Original text',
    release: 'Release 2.0',
    original: true,
    fields: {
      headline: field(null, 'Find work that fits you'),
      supporting: field(null, HERO_SUPPORT),
      primary_cta: field(null, ORIGINAL_PRIMARY),
      secondary_cta: field(null, 'See how it works'),
    },
  },
  {
    version: 2,
    who: 'Ama Owusu',
    when: '14 Oct 09:30',
    why: 'First edit of the hero',
    fields: {
      supporting: field(
        HERO_SUPPORT,
        'Show your skills, get verified and connect with employers across Ghana.'
      ),
    },
  },
  {
    version: 3,
    who: 'Nana Adjei',
    when: '21 Oct 10:15',
    why: 'Launch copy from marketing',
    fields: {
      headline: field('Find work that fits you', 'Launch your career in Ghana'),
      supporting: field(
        'Show your skills, get verified and connect with employers across Ghana.',
        HERO_SUPPORT
      ),
    },
  },
  {
    version: 4,
    who: 'Ama Owusu',
    when: '28 Oct 14:02',
    why: 'New hero wording for MVP',
    fields: {
      headline: field('Launch your career in Ghana', 'Your future starts here'),
      primary_cta: field(ORIGINAL_PRIMARY, 'Create my profile'),
    },
  },
  {
    version: 5,
    who: 'Kofi Mensah',
    when: 'Yesterday 17:40',
    why: 'Tighten hero headline',
    fields: { headline: field('Your future starts here', 'Your futur starts here') },
  },
];

/** ⚠️ ASSUMPTION: a section nobody edited shows one live version, the original text (7.8.5e draws exactly this row). */
export const ORIGINAL_VERSION = {
  version: 1,
  who: null,
  when: 'Original from the design',
  why: 'Original text',
  release: 'Release 2.0',
  original: true,
  fields: {},
};

/** The seed history of a section id (only the hero was edited in the drawn data). */
export const seedHistory = (sectionId) =>
  sectionId === 'public.home.hero' ? SEED_HERO_HISTORY : [ORIGINAL_VERSION];

/** Avatar tints of the people drawn in the history rows (KM #faf4e8 · AO #ebf1ec@.5 · NA #eaeffb · original #f8f8f4). */
export const AVATAR_TINTS = {
  'Kofi Mensah': 'bg-[#faf4e8]',
  'Ama Owusu': 'bg-[#ebf1ec]/50',
  'Nana Adjei': 'bg-[#eaeffb]',
};
export const AVATAR_FALLBACK = 'bg-[#f8f8f4]';

/** 7.8.3h: the signed-in non-staff visitor drawn in the frame. */
export const NON_STAFF_VISITOR = 'Abena Mensah (talent)';

/** ⚠️ ASSUMPTION: the 7.8.3 preview link lives 30 minutes (drawn: "link expires in 30 minutes"). */
export const PREVIEW_LINK_MINUTES = 30;
