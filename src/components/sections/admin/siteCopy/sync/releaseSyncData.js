/*
 * releaseSyncData — mock data of the release-sync screens (Platform Admin 7.8.8a-d, Figma file iErYj7O3ft6WAG2FBT6aEw): what the Site copy page looks like
 * after a release (new pages and sections with "New" chips, 7.8.8a), when an original text changed under an edit (7.8.8b), with removed sections
 * (7.8.8c), and the Super Admin's "Section list from releases" (7.8.8d). Shaped like a future API payload; every string is verbatim from the nodes.
 *
 *   SYNC_VIEWS[view]   { portal, subtitle, pageCount, banner?, pages: [{ id, name, chip, sections?: [...] }], openPage, selected, removed? }
 *   chip               'edited' | 'new' | 'default' | 'shared' ("Used on every page") | 'removed'
 *   SYNC_SECTIONS[id]  the editor of a section: { path: [...breadcrumb], title, chip, fields: [...] , saved?, changed? }
 *   SYNC_RELEASES      the rows of 7.8.8d
 *
 * ⚠️ ASSUMPTION: only the sections that the frames draw have fields (Scholarships › Hero, Home › Hero, Home › Testimonials); every other section
 * of the lists opens a one-field editor with its summary line as the text. Pages without drawn sections open the Site copy browse instead of expanding.
 */

export const SYNC_PORTALS = [
  { id: 'public', label: 'Public site' },
  { id: 'talent', label: 'Talent' },
  { id: 'parent', label: 'Parent' },
  { id: 'recruiter', label: 'Recruiter' },
  { id: 'institution', label: 'Institution' },
  { id: 'emails', label: 'Emails' },
];

export const SYNC_COPY = {
  searchPlaceholder: 'Search pages, sections or words',
  afterRelease:
    'Release 2.4 added 1 page and 6 sections. They show the original text until you change it.',
  removedHead: 'REMOVED FROM THE PLATFORM',
  removedNote:
    'This section was removed from the platform in release 2.4. You can read it and its history, but you can’t edit it.',
  changedTitle: 'The original text changed since your edit',
  oldOriginal: 'OLD ORIGINAL',
  newOriginal: 'NEW ORIGINAL · release 2.4',
  syncTitle: 'Section list from releases',
  syncText:
    'Each release sends the list of pages and sections automatically. You only need “Sync now” if a release didn’t finish.',
  syncLock:
    'Only the release pipeline or a super admin can change the section list. Content editors see the result in Site copy.',
};

const sec = (id, name, sub, chip, extra = {}) => ({ id, name, sub, chip, ...extra });

export const SYNC_VIEWS = {
  'after-release': {
    portal: 'talent',
    subtitle: 'Talent portal · 93 pages',
    pageCount: '93 pages',
    banner: SYNC_COPY.afterRelease,
    openPage: 'scholarships',
    selected: 'talent.scholarships.hero',
    pages: [
      { id: 'dashboard', name: 'Dashboard', chip: 'edited' },
      { id: 'home', name: 'Home', chip: 'edited' },
      { id: 'skills-lab', name: 'Skills Lab', chip: 'edited' },
      {
        id: 'scholarships',
        name: 'Scholarships',
        chip: 'new',
        sections: [
          sec('talent.scholarships.hero', 'Hero', 'Scholarships that fit your goals', 'new'),
          sec('talent.scholarships.filters', 'Filters', 'Field, region, deadline', 'new'),
          sec('talent.scholarships.empty-state', 'Empty state', 'No scholarships match yet', 'new'),
          sec(
            'talent.scholarships.apply-tips',
            'Apply tips',
            'How to write a strong application',
            'new'
          ),
        ],
      },
      { id: 'opportunities', name: 'Opportunities', chip: 'default' },
      { id: 'messages', name: 'Messages', chip: 'default' },
    ],
  },
  changed: {
    portal: 'public',
    subtitle: 'Public site · Home',
    pageCount: '46 pages',
    openPage: 'home',
    selected: 'public.home.hero',
    pages: [
      {
        id: 'home',
        name: 'Home',
        chip: 'edited',
        sections: [
          sec('public.home.hero', 'Hero', 'Find work that fits you', 'edited'),
          sec(
            'public.home.how-it-works',
            'How it works',
            'Build your profile, prove your skills, get matched',
            'default'
          ),
          sec(
            'public.home.features',
            'Features',
            'Everything you need to start your career',
            'default'
          ),
          sec(
            'public.home.made-for-ghana',
            'Made for Ghana',
            'Built with schools, employers and families',
            'edited'
          ),
          sec('public.home.faq', 'FAQ', 'Questions people ask before they join', 'default'),
          sec('public.shared.footer', 'Footer', 'About · Help · Privacy · Terms', 'shared'),
        ],
      },
      { id: 'how-it-works', name: 'How it works', chip: 'edited' },
      { id: 'for-students', name: 'For students', chip: 'default' },
      { id: 'for-parents', name: 'For parents', chip: 'default' },
      { id: 'for-recruiters', name: 'For recruiters', chip: 'edited' },
    ],
  },
  removed: {
    portal: 'public',
    subtitle: 'Public site · removed sections are read-only',
    pageCount: '46 pages',
    openPage: 'removed',
    selected: 'public.home.testimonials',
    pages: [
      { id: 'home', name: 'Home', chip: 'edited' },
      { id: 'how-it-works', name: 'How it works', chip: 'edited' },
      { id: 'for-students', name: 'For students', chip: 'default' },
    ],
    removed: {
      name: 'Removed sections (2)',
      sections: [
        sec('public.home.testimonials', 'Home › Testimonials', 'Removed in release 2.4', 'removed'),
        sec('public.parents.pricing', 'For parents › Pricing', 'Removed in release 2.2', 'removed'),
      ],
    },
  },
};

/** Editors of the sections the frames draw (field kind: 'line' single line, 'rich' formatting toolbar, 'read' read-only box). */
export const SYNC_SECTIONS = {
  'talent.scholarships.hero': {
    path: ['Talent', 'Scholarships', 'Hero'],
    title: 'Hero',
    chip: 'new',
    fields: [
      {
        id: 'headline',
        label: 'Headline',
        kind: 'line',
        value: 'Scholarships that fit your goals',
        max: 60,
      },
      {
        id: 'support',
        label: 'Supporting line',
        kind: 'rich',
        value: 'Browse funding from schools, foundations and companies across Ghana.',
        count: 70, // Figma draws "70 / 160" for this 68-character text: kept, then follows the typing
        max: 160,
      },
      { id: 'button', label: 'Button text', kind: 'line', value: 'Find scholarships', max: 24 },
    ],
  },
  'public.home.hero': {
    path: ['Public site', 'Home', 'Hero'],
    title: 'Hero',
    chip: 'edited',
    saved: 'Your edit is still live',
    changed: {
      field: 'headline',
      oldOriginal: 'Find work that fits you',
      newOriginal: 'Find work and scholarships that fit you',
    },
    fields: [
      {
        id: 'headline',
        label: 'Headline',
        kind: 'line',
        value: 'Your future starts here',
        max: 60,
      },
      {
        id: 'support',
        label: 'Supporting line',
        kind: 'rich',
        value: 'Show what you can do, get verified skills and connect with employers across Ghana.',
        count: 84, // Figma draws "84 / 160" for this 82-character text: kept, then follows the typing
        max: 160,
      },
      {
        id: 'button',
        label: 'Main button text',
        kind: 'line',
        value: 'Create my profile',
        max: 24,
      },
      {
        id: 'button2',
        label: 'Second button text',
        kind: 'line',
        value: 'See how it works',
        max: 24,
      },
    ],
  },
  'public.home.testimonials': {
    path: ['Public site', 'Home', 'Testimonials'],
    title: 'Testimonials',
    chip: 'removed',
    removed: true,
    fields: [
      { id: 'heading', label: 'Heading', kind: 'read', value: 'What talents say' },
      {
        id: 'quote1',
        label: 'Quote 1',
        kind: 'read',
        value: '“I got my first internship through GTH.” · Abena, Kumasi',
      },
      {
        id: 'quote2',
        label: 'Quote 2',
        kind: 'read',
        value: '“The skill games showed me I’m good at planning.” · Kojo, Tamale',
      },
    ],
  },
};

export const SYNC_RELEASES = [
  {
    id: 'r2-4',
    title: 'Release 2.4 · +1 page · +6 sections · 1 removed · 1 original changed',
    meta: 'Today 13:05 · by Release pipeline',
  },
  { id: 'r2-3', title: 'Release 2.3 · +2 sections', meta: '24 Oct 11:40 · by Release pipeline' },
  {
    id: 'r2-2',
    title: 'Release 2.2 · 1 removed · history kept',
    meta: '17 Oct 16:20 · by Nana Adjei (manual)',
  },
];

/** ⚠️ ASSUMPTION: a manual "Sync now" adds this row (nothing new is pending in the mock pipeline); not drawn. */
export const MANUAL_SYNC_ROW = {
  title: 'Manual sync · nothing new',
  meta: 'Just now · by Nana Adjei (manual)',
};
