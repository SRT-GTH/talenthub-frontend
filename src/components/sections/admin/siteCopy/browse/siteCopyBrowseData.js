import { isCopyLive } from '../live/copyLive.js';
import { copyPagesOf } from '../../../../../copy/copyRegistry.js';
import { debug } from '../../../../../utils/debug.js';

const log = debug('siteCopyBrowseData');

/*
 * siteCopyBrowseData — mock data of the Site copy browse screens and the Content Editor home (Platform Admin 7.8.0a / 7.8.1a-l, Figma file
 * iErYj7O3ft6WAG2FBT6aEw). Shaped like a future API payload; nothing is sent anywhere (⚠️ ASSUMPTION: no backend yet, see wiki/admin.md).
 *
 *   PORTALS    the six tabs (Public site · Talent · Parent · Recruiter · Institution · Emails) with the counts drawn on the home tiles
 *   SITE_PAGES per portal: { pages: [...], shared: [...] }. A page: { id, label, status: 'default' | 'edited' | 'soon', draftSeed?, listed?, sections }.
 *              A section: { id: '<portal>.<page>.<section>', label, summary, text, status: 'default' | 'edited', shared? }.
 *              `summary` is the preview line drawn under the section name, `text` the full text the search looks at (summary included).
 *   listed:false  the page is drawn only in a filtered view or a search result (7.8.1g Press kit / Careers / Partner stories, 7.8.1c Talent › Onboarding),
 *                 never in the "All" list of its portal (Figma inconsistency kept as drawn: the "All" lists are samples of the 46 / 92 pages).
 *   EDITED_VIEW / UNPUBLISHED_SEED  the two filtered views are drawn with their own chips and counts (7.8.1i: Sign up and Home read "Edited" there but "Default" /
 *              "Draft changes (1)" in 7.8.1a; 7.8.1f: Home / Hero read "Draft changes (2)") — kept as drawn, each view has its own seed.
 *
 * Shared mock server keys (useCopyKv): `site-copy.drafts` { [sectionId]: { fields: { [fieldKey]: { draft } }, savedAt } } written by the section editor, and
 * `site-copy.published` { [sectionId]: { [fieldKey]: value } } written by the publish dialogs. A section with a draft shows "Draft changes (n)" here and is
 * listed under "Has unpublished changes"; a section with published values shows "Edited". `draftCountOf` / `previewOf` read both shapes defensively
 * (the editor and the publish store disagree on whether a `fields` wrapper exists).
 */

export const PORTALS = [
  {
    id: 'public',
    label: 'Public site',
    subtitle: 'Public site',
    pages: 46,
    edited: 9,
    unit: 'pages',
    iconKey: 'company',
  },
  {
    id: 'talent',
    label: 'Talent',
    subtitle: 'Talent portal',
    pages: 92,
    edited: 6,
    unit: 'pages',
    iconKey: 'users',
  },
  {
    id: 'parent',
    label: 'Parent',
    // ⚠️ ASSUMPTION: "<Portal> portal" like the drawn "Talent portal" subtitle (only Public site and Talent are drawn).
    subtitle: 'Parent portal',
    pages: 24,
    edited: 1,
    unit: 'pages',
    iconKey: 'shield',
  },
  {
    id: 'recruiter',
    label: 'Recruiter',
    subtitle: 'Recruiter portal',
    pages: 31,
    edited: 2,
    unit: 'pages',
    iconKey: 'suitcase',
  },
  {
    id: 'institution',
    label: 'Institution',
    subtitle: 'Institution portal',
    pages: 21,
    edited: 0,
    unit: 'pages',
    iconKey: 'book',
  },
  {
    id: 'government',
    label: 'Government',
    subtitle: 'Government portal',
    pages: 2,
    edited: 0,
    unit: 'pages',
    iconKey: 'shield',
  },
  {
    id: 'emails',
    label: 'Emails',
    subtitle: 'Emails',
    pages: 38,
    edited: 0,
    unit: 'templates',
    iconKey: 'chat',
  },
];

/** The pages of every portal: what the pages declare (live), or the drawn lists (mock). */
export const sitePages = () =>
  isCopyLive() ? Object.fromEntries(PORTALS.map((p) => [p.id, copyPagesOf(p.id)])) : SITE_PAGES;

export const portalById = (id) => PORTALS.find((p) => p.id === id) ?? PORTALS[0];

/** "46 pages · 9 edited" / "38 templates · 0 edited" (the home tiles). */
export const portalCounts = (p) => `${p.pages} ${p.unit} · ${p.edited} edited`;

const section = (id, label, summary, status = 'default', extra = {}) => ({
  id,
  label,
  summary,
  text: extra.text ?? summary ?? '',
  status,
  ...extra,
});

/** The Public site Home page (7.8.1a): six sections, Footer is shared. */
const PUBLIC_HOME = {
  id: 'home',
  label: 'Home',
  status: 'edited',
  draftSeed: 1,
  sections: [
    section('public.home.hero', 'Hero', 'Find work that fits you', 'edited', {
      text: 'Find work that fits you Show what you can do, get verified skills and connect with employers across Ghana. Create my profile',
    }),
    section(
      'public.home.how-it-works',
      'How it works',
      'Build your profile, prove your skills, get matched',
      'default',
      { text: 'How it works Build your profile Prove your skills Get matched' }
    ),
    section(
      'public.home.features',
      'Features',
      'Everything you need to start your career',
      'default'
    ),
    section(
      'public.home.made-for-ghana',
      'Made for Ghana',
      'Built with schools, employers and families in all 16 regions',
      'edited'
    ),
    section('public.home.faq', 'FAQ', 'Questions people ask before they join', 'default'),
    section('public.shared.footer', 'Footer', 'About · Help · Privacy · Terms', 'default', {
      shared: true,
    }),
  ],
};

const page = (id, label, status = 'default', extra = {}) => ({
  id,
  label,
  status,
  sections: [],
  ...extra,
});

/** A shared section is drawn as its own collapsed row with one section inside (⚠️ ASSUMPTION: the inner section carries the same name). */
const shared = (portal, id, label, status = 'default', summary = undefined) =>
  page(id, label, status, {
    sections: [section(`${portal}.shared.${id}`, label, summary, status, { shared: true })],
  });

export const SITE_PAGES = {
  public: {
    pages: [
      PUBLIC_HOME,
      page('how-it-works', 'How it works', 'edited'),
      page('for-students', 'For students'),
      page('for-parents', 'For parents'),
      page('for-recruiters', 'For recruiters', 'edited'),
      page('for-partners', 'For partners'),
      page('sign-up', 'Sign up'),
      page('help-centre', 'Help centre', 'soon'),
      page('partner-stories', 'Partner stories', 'soon', { listed: false }),
      page('careers-at-gth', 'Careers at GTH', 'soon', { listed: false }),
      page('press-kit', 'Press kit', 'soon', { listed: false }),
    ],
    shared: [
      // ⚠️ ASSUMPTION: the summary is the nav labels drawn in the 7.8.1a page preview ("How it works · For students · For recruiters · Join now").
      shared(
        'public',
        'top-navigation',
        'Top navigation',
        'default',
        'How it works · For students · For recruiters · Join now'
      ),
      shared('public', 'footer', 'Footer', 'default', 'About · Help · Privacy · Terms'),
      shared('public', 'cookie-banner', 'Cookie banner'),
    ],
  },
  talent: {
    pages: [
      page('dashboard', 'Dashboard', 'default', {
        draftSeed: 1,
        sections: [
          section(
            'talent.dashboard.welcome-banner',
            'Welcome banner',
            'Akwaaba, Abena. Pick up where you left off.',
            'default'
          ),
        ],
      }),
      page('home', 'Home', 'edited', {
        sections: [
          section(
            'talent.home.hero',
            'Hero',
            'Your journey starts here. Build a profile employers trust.',
            'edited'
          ),
        ],
      }),
      page('my-profile', 'My profile'),
      page('skills-lab', 'Skills Lab', 'edited'),
      page('opportunities', 'Opportunities'),
      page('messages', 'Messages'),
      page('community', 'Community', 'edited'),
      page('wallet', 'Wallet'),
      page('settings', 'Settings'),
      page('scholarships', 'Scholarships', 'soon'),
      page('onboarding', 'Onboarding', 'default', {
        listed: false,
        sections: [
          section(
            'talent.onboarding.step-1-welcome',
            'Step 1 · Welcome',
            'Akwaaba! Your journey starts with three quick questions.',
            'default'
          ),
        ],
      }),
    ],
    shared: [
      shared('talent', 'sidebar', 'Sidebar', 'edited'),
      shared('talent', 'top-bar', 'Top bar'),
      shared('talent', 'ask-buddy-button', 'Ask Buddy button'),
    ],
  },
  // ⚠️ ASSUMPTION: Parent, Recruiter and Institution pages are not drawn (only the tab and its "N pages · N edited" tile are). Each portal gets a small
  // sample list in the same voice so the tabs switch to something real; their sections are not listed (the page rows say so when opened).
  parent: {
    pages: [
      page('dashboard', 'Dashboard', 'edited'),
      page('my-ward', 'My ward'),
      page('consent', 'Consent'),
      page('settings', 'Settings'),
    ],
    shared: [shared('parent', 'sidebar', 'Sidebar'), shared('parent', 'top-bar', 'Top bar')],
  },
  recruiter: {
    pages: [
      page('dashboard', 'Dashboard', 'edited'),
      page('candidates', 'Candidates', 'edited'),
      page('jobs', 'Jobs'),
      page('settings', 'Settings'),
    ],
    shared: [shared('recruiter', 'sidebar', 'Sidebar'), shared('recruiter', 'top-bar', 'Top bar')],
  },
  institution: {
    pages: [
      page('dashboard', 'Dashboard'),
      page('students', 'Students'),
      page('programmes', 'Programmes'),
      page('settings', 'Settings'),
    ],
    shared: [
      shared('institution', 'sidebar', 'Sidebar'),
      shared('institution', 'top-bar', 'Top bar'),
    ],
  },
  emails: {
    pages: [
      page('welcome-email', 'Welcome email', 'default', {
        sections: [
          section(
            'emails.welcome-email.subject-line',
            'Subject line',
            'Akwaaba to Ghana Talent Hub'
          ),
          section(
            'emails.welcome-email.heading',
            'Heading',
            'Your journey starts today, {first name}'
          ),
          section(
            'emails.welcome-email.body',
            'Body',
            'Here’s how to make the most of your first week…',
            'default',
            {
              text: 'Here’s how to make the most of your first week: finish your profile, try a skill game and say hello to Career Buddy.',
            }
          ),
          section('emails.welcome-email.button', 'Button', 'Complete my profile'),
        ],
      }),
      page('verification-code', 'Verification code'),
      page('password-reset', 'Password reset', 'edited'),
      page('weekly-digest', 'Weekly digest'),
      page('interview-invite', 'Interview invite'),
      page('parent-consent-request', 'Parent consent request'),
    ],
    shared: [],
  },
};

/** The Edited view of 7.8.1i (public): 4 pages · 9 sections, Home opened on its two edited sections. */
export const EDITED_VIEW = {
  public: [
    {
      id: 'home',
      label: 'Home',
      status: 'edited',
      sections: ['public.home.hero', 'public.home.made-for-ghana'],
    },
    { id: 'how-it-works', label: 'How it works', status: 'edited', sections: [] },
    { id: 'for-recruiters', label: 'For recruiters', status: 'edited', sections: [] },
    { id: 'sign-up', label: 'Sign up', status: 'edited', sections: [] },
  ],
  sectionsTotal: 9,
};

/** The Has-unpublished-changes view of 7.8.1f: across every portal (3 changes in 2 pages) — merged with the drafts saved in the section editor. */
export const UNPUBLISHED_SEED = [
  {
    portal: 'public',
    pageId: 'home',
    label: 'Public site › Home',
    count: 2,
    sections: [
      {
        id: 'public.home.hero',
        label: 'Hero',
        summary: 'Your future starts here',
        count: 2,
      },
    ],
  },
  {
    portal: 'talent',
    pageId: 'dashboard',
    label: 'Talent › Dashboard',
    count: 1,
    sections: [
      {
        id: 'talent.dashboard.welcome-banner',
        label: 'Welcome banner',
        summary: 'Akwaaba, Abena. Pick up where you left off.',
        count: 1,
      },
    ],
  },
];

/** "Continue where you left off" rows of the Content Editor home (7.8.0a). */
export const CONTINUE_ROWS = [
  {
    sectionId: 'public.home.hero',
    path: 'Public site › Home › Hero',
    hint: 'Headline and button text',
    changes: 2,
  },
  {
    sectionId: 'talent.dashboard.welcome-banner',
    path: 'Talent › Dashboard › Welcome banner',
    hint: 'Welcome line for new talents',
    changes: 1,
  },
];

/** The Home page overview of 7.8.1a: header, the two highlighted sections (clickable edit tags) and the line under the title. */
export const HOME_OVERVIEW = {
  title: 'Home',
  sectionsLine: '6 sections · last published 28 Oct by Ama Owusu',
  nav: ['How it works', 'For students', 'For recruiters'],
};

/** Email preview of 7.8.1h (Welcome email). `{first name}` renders as the drawn sample "Abena". */
export const EMAIL_PREVIEW = {
  'welcome-email': {
    title: 'Welcome email · preview',
    subject: 'Subject: Akwaaba to Ghana Talent Hub',
    heading: 'Your journey starts today, Abena',
    body: 'Here’s how to make the most of your first week: finish your profile, try a skill game and say hello to Career Buddy.',
    button: 'Complete my profile',
  },
};

/* ───── helpers ───── */

const stripHtml = (s) =>
  String(s ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Number of fields with a saved draft of a section, whichever shape the writer used (see header). */
export const draftCountOf = (drafts, sectionId) => {
  const d = drafts?.[sectionId];
  if (!d || typeof d !== 'object') return 0;
  const fields = d.fields && typeof d.fields === 'object' ? d.fields : d;
  return Object.keys(fields).filter((k) => k !== 'savedAt').length;
};

/** The first draft text of a section (the preview line of an unpublished section), or ''. */
export const previewOf = (drafts, sectionId) => {
  const d = drafts?.[sectionId];
  if (!d || typeof d !== 'object') return '';
  const fields = d.fields && typeof d.fields === 'object' ? d.fields : d;
  const first = Object.entries(fields).find(([k]) => k !== 'savedAt');
  if (!first) return '';
  const v = first[1];
  return stripHtml(typeof v === 'string' ? v : (v?.draft ?? ''));
};

export const isPublishedSection = (published, sectionId) =>
  Boolean(published?.[sectionId] && Object.keys(published[sectionId]).length > 0);

/** Normalised text for the search (lower case, curly quotes straightened). */
export const norm = (s) =>
  String(s ?? '')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"');

/** Splits `text` around the case-insensitive matches of `q` → [{ t, hit }], for the bold highlight of 7.8.1c. */
export const highlightParts = (text, q) => {
  const needle = norm(q).trim();
  const hay = norm(text);
  if (!needle || !hay.includes(needle)) return [{ t: text, hit: false }];
  const parts = [];
  let i = 0;
  while (i < text.length) {
    const at = hay.indexOf(needle, i);
    if (at === -1) {
      parts.push({ t: text.slice(i), hit: false });
      break;
    }
    if (at > i) parts.push({ t: text.slice(i, at), hit: false });
    parts.push({ t: text.slice(at, at + needle.length), hit: true });
    i = at + needle.length;
  }
  return parts;
};

/** Every page of every portal, flattened with its portal (the search corpus and the "not editable yet" view). */
export const allPages = () =>
  Object.entries(sitePages()).flatMap(([portal, { pages, shared: sh }]) => [
    ...pages.map((p) => ({ ...p, portal, isShared: false })),
    ...sh.map((p) => ({ ...p, portal, isShared: true })),
  ]);

/** Section-level search over every portal: [{ portal, page, sections: [section] }] grouped by page, in portal order. A page-name match lists all its sections. */
export const searchSections = (q, drafts) => {
  const needle = norm(q).trim();
  const out = [];
  allPages().forEach((pg) => {
    if (pg.status === 'soon') return;
    const portal = portalById(pg.portal);
    const pageHit = norm(pg.label).includes(needle) || norm(portal.label).includes(needle);
    const hits = pg.sections.filter((s) => {
      const draft = previewOf(drafts, s.id);
      return (
        pageHit ||
        norm(s.label).includes(needle) ||
        norm(s.text).includes(needle) ||
        norm(draft).includes(needle)
      );
    });
    if (hits.length) out.push({ portal: pg.portal, page: pg, sections: hits });
  });
  log('search', { q, groups: out.length });
  return out;
};

/** The drawn label of a status chip ({ kind, count }) as plain text, for aria-labels and generated content. */
export const chipLabel = (chip) => {
  if (!chip) return '';
  if (chip.label) return chip.label;
  return (
    { default: 'Default', edited: 'Edited', shared: 'Used on every page', soon: 'Coming soon' }[
      chip.kind
    ] ?? (chip.kind === 'draft' ? `Draft changes (${chip.count})` : String(chip.count ?? ''))
  );
};
