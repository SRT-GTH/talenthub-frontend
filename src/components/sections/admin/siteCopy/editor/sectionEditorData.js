/*
 * sectionEditorData — mock data of the Site copy section editor (Platform Admin 7.8.2, frames 7.8.2a-2n). Shaped like a future API payload;
 * nothing is sent anywhere (⚠️ ASSUMPTION: no backend yet, see wiki/admin.md).
 *
 * Section: { id, portal, page, pageLabel, label, shared?, fields: [{ key, label, kind, max, original }] }
 *   kind  'headline' (20/600 single line) | 'text' (15/400 single line) | 'rich' (bold / italic / lists / links / product-name chips)
 *   original  the GTH default text ("Original:" line, "Reset to default"); rich values are the stored HTML (richText.js).
 * Drafts live in the shared mock server `useCopyKv('site-copy.drafts')`:  { [sectionId]: { fields: { [fieldKey]: { draft } }, savedAt } }.
 * ⚠️ ASSUMPTION: what is live (published) is `useCopyKv('site-copy.published')`: { [sectionId]: { [fieldKey]: value } }, written by the publish
 * dialogs; until anything is published the live value is the original.
 */

export const PORTALS = [
  { id: 'public', label: 'Public site' },
  { id: 'talent', label: 'Talent' },
  { id: 'parent', label: 'Parent' },
  { id: 'recruiter', label: 'Recruiter' },
  { id: 'institution', label: 'Institution' },
  { id: 'emails', label: 'Emails' },
];

/** The "46 pages" counter of the Pages card (frame 7.8.2a). */
export const PAGES_TOTAL = 46;

/*
 * The Pages card of the Public site portal (frame 7.8.2a). Home is open and lists its sections; the other pages are drawn collapsed
 * (⚠️ ASSUMPTION: their sections are not drawn, so their header opens the Site copy list filtered on the page instead of expanding).
 * `status` is the published state of the section / page when no draft exists: 'edited' (changed from the default and live) | 'default'.
 */
export const PAGES = [
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

/** Every product name an editor can insert as a chip (frame 7.8.2f "Insert a product name"); chips follow a rename by themselves. */
export const PRODUCT_NAME_CHIPS = [
  { name: 'Career Buddy', note: 'Assistant · full name' },
  { name: 'Buddy', note: 'Assistant · short name' },
  { name: 'Ghana Talent Hub', note: 'Platform · full name' },
  { name: 'GTH', note: 'Platform · short name' },
  { name: 'Community', note: 'Community' },
  { name: 'Skills Lab', note: 'Skills Lab' },
  { name: 'Wallet', note: 'Wallet' },
];

const CHIP = (name) => `<span data-chip="${name}"></span>`;

/*
 * The FAQ section edits one question + answer at a time (frames 2c-2f, 2i, 2n draw question 3, 5 and 6). ⚠️ ASSUMPTION: the item is picked
 * with `?item=3|5|6` (default 3); no switcher is drawn. The ORIGINAL answers of 5 and 6 are not drawn: ⚠️ ASSUMPTION, minimal and in the
 * voice of the drawn answers (5 keeps the drawn "Career Buddy" chip, 6 the drawn "Wallet" product name).
 */
export const FAQ_ITEMS = {
  3: {
    question: 'Is it free to join?',
    answer:
      'Yes. Ghana Talent Hub is free for every student. You only need a phone number to start.',
  },
  5: {
    question: 'What if I need help?',
    answer: `Ask ${CHIP('Career Buddy')} for help, any time.`,
  },
  6: {
    question: 'Where are my certificates?',
    answer: `Track your certificates in ${CHIP('Wallet')} anytime.`,
  },
};

export const FAQ_ITEM_IDS = Object.keys(FAQ_ITEMS);

const faqFields = (n) => [
  { key: `q${n}`, label: `Question ${n}`, kind: 'text', max: 90, original: FAQ_ITEMS[n].question },
  { key: `a${n}`, label: `Answer ${n}`, kind: 'rich', max: 600, original: FAQ_ITEMS[n].answer },
];

/** The fields of the section the editor opens (`item` only matters for the FAQ). Unknown section ids get a generic single-field editor. */
export const SECTION_DEFS = {
  'public.home.hero': {
    portal: 'public',
    page: 'home',
    label: 'Hero',
    fields: [
      {
        key: 'headline',
        label: 'Headline',
        kind: 'headline',
        max: 60,
        original: 'Find work that fits you',
      },
      {
        key: 'supporting',
        label: 'Supporting line',
        kind: 'rich',
        max: 160,
        original:
          'Show what you can do, get verified skills and connect with employers across Ghana.',
      },
      {
        key: 'primary_cta',
        label: 'Main button text',
        kind: 'text',
        max: 24,
        original: 'Create my profile',
      },
      {
        key: 'secondary_cta',
        label: 'Second button text',
        kind: 'text',
        max: 24,
        original: 'See how it works',
      },
    ],
  },
  'public.home.faq': {
    portal: 'public',
    page: 'home',
    label: 'FAQ',
    fieldsFor: (item) => faqFields(FAQ_ITEMS[item] ? item : 3),
  },
  'public.shared.footer': {
    portal: 'public',
    page: 'shared',
    pageLabel: 'Shared',
    label: 'Footer',
    shared: true,
    fields: [
      {
        key: 'tagline',
        label: 'Tagline',
        kind: 'text',
        max: 90,
        original: 'Ghana Talent Hub · Built in Ghana, for Ghana’s young people',
      },
      { key: 'link1', label: 'Link 1 label', kind: 'text', max: 24, original: 'About us' },
      { key: 'link2', label: 'Link 2 label', kind: 'text', max: 24, original: 'Help centre' },
      {
        key: 'copyright',
        label: 'Copyright line',
        kind: 'text',
        max: 90,
        original: '© 2026 Ghana Talent Hub. All rights reserved.',
      },
    ],
  },
};

const humanise = (s) =>
  String(s || '')
    .replace(/[-_]+/g, ' ')
    .replace(/^./, (c) => c.toUpperCase());

/*
 * Resolve the section for an id. ⚠️ ASSUMPTION: a section that no frame draws (every other id the Site copy list links to) opens with ONE
 * plain field "Headline" (max 60) that holds the section's drawn summary line from the Pages card when there is one, else an empty default.
 */
export const resolveSection = (sectionId, item) => {
  const [portal = 'public', page = 'home', slug = ''] = String(sectionId).split('.');
  const known = SECTION_DEFS[sectionId];
  const fromTree = PAGES.flatMap((p) => p.sections).find((s) => s.id === sectionId);
  const def = known ?? {
    portal,
    page,
    label: fromTree?.label ?? humanise(slug),
    fields: [
      {
        key: 'headline',
        label: 'Headline',
        kind: 'headline',
        max: 60,
        original: fromTree?.summary ?? '',
      },
    ],
  };
  const portalLabel =
    PORTALS.find((p) => p.id === (def.portal ?? portal))?.label ?? humanise(portal);
  const pageLabel =
    def.pageLabel ?? PAGES.find((p) => p.id === (def.page ?? page))?.label ?? humanise(page);
  return {
    id: sectionId,
    portal: def.portal ?? portal,
    portalLabel,
    page: def.page ?? page,
    pageLabel,
    label: def.label,
    shared: Boolean(def.shared),
    fields: def.fieldsFor ? def.fieldsFor(item) : def.fields,
    known: Boolean(known),
  };
};

/*
 * Frame presets (`?f=<code>`): fixed states of the editor, independent of storage (useCopyKv persist:false), so every Figma frame is a URL.
 *   sectionId / item   which section the frame draws
 *   drafts             the saved drafts the Pages card and the publish bar know about (same shape as the kv)
 *   edits              unsaved values (typed but not saved: over the limit, an unknown chip …)
 *   savedLabel         the saved-status line (frozen; live editing uses the ticking label of editorTime.js)
 *   modal / field      popover or dialog open on arrival, linkDraft the link popover's fields
 *   state              'conflict' (the other editor's draft is the saved one, mine is the unsaved edit) | 'offline' · pasted: the paste notice
 *   focus              the field that carries the green focus border
 */
const HERO = 'public.home.hero';
const FAQ = 'public.home.faq';
const saved = (fields) => ({ fields, savedAt: 0 });
const A3_DRAFT = `Yes. Ghana Talent Hub is <b>free for every student</b>. You only need a phone number to start.`;
const A3_LIST = `${A3_DRAFT}<ul><li>Create your profile in 5 minutes</li><li>Prove your skills with short games</li><li>Get matched with real opportunities</li></ul>`;

export const FRAME_PRESETS = {
  '2a': { sectionId: HERO, focus: 'headline' },
  '2b': {
    sectionId: HERO,
    focus: 'headline',
    drafts: { [HERO]: saved({ headline: { draft: 'Your future starts here' } }) },
    savedLabel: 'Saved as draft just now · only staff can see it',
  },
  '2c': {
    sectionId: FAQ,
    item: 3,
    drafts: { [FAQ]: saved({ a3: { draft: A3_LIST } }) },
    savedLabel: 'Saved as draft 4 s ago',
    activeTools: ['bold', 'ul'],
  },
  '2d': {
    sectionId: FAQ,
    item: 3,
    drafts: { [FAQ]: saved({ a3: { draft: A3_DRAFT } }) },
    modal: 'link',
    field: 'a3',
    linkDraft: { text: 'free for every student', url: 'https://ghanatalenthub.com/pricing' },
  },
  '2e': {
    sectionId: FAQ,
    item: 3,
    drafts: { [FAQ]: saved({ a3: { draft: A3_DRAFT } }) },
    modal: 'link',
    field: 'a3',
    linkDraft: { text: 'free for every student', url: 'www.ghanatalenthub/pricing', error: true },
  },
  '2f': {
    sectionId: FAQ,
    item: 5,
    drafts: {
      [FAQ]: saved({
        a5: { draft: `Stuck on your CV? Ask ${CHIP('Career Buddy')} for help, any time.` },
      }),
    },
    modal: 'chip',
    field: 'a5',
  },
  '2g': {
    sectionId: HERO,
    edits: { primary_cta: 'Create my free GTH profile now' },
    savedLabel: 'Last change saved 2 min ago',
  },
  '2h': {
    sectionId: HERO,
    drafts: { [HERO]: saved({ headline: { draft: 'Your future starts here' } }) },
    modal: 'reset',
    field: 'headline',
    savedLabel: '',
  },
  '2i': {
    sectionId: FAQ,
    item: 3,
    drafts: { [FAQ]: saved({ a3: { draft: A3_DRAFT } }) },
    savedLabel: 'Saved as draft just now',
    pasted: true,
  },
  '2j': { sectionId: 'public.shared.footer' },
  '2k': {
    sectionId: HERO,
    drafts: { [HERO]: saved({ headline: { draft: 'Your future starts here' } }) },
    edits: { headline: 'Start your career story today' },
    savedLabel: 'Your change is not saved yet',
    state: 'conflict',
  },
  '2l': {
    sectionId: HERO,
    drafts: { [HERO]: saved({ headline: { draft: 'Your future starts here' } }) },
    edits: { headline: 'Start your career story today' },
    savedLabel: 'Your change is not saved yet',
    state: 'conflict',
    modal: 'theirs',
  },
  '2m': {
    sectionId: HERO,
    drafts: { [HERO]: saved({ headline: { draft: 'Your future starts here' } }) },
    state: 'offline',
    savedLabel: '',
  },
  '2n': {
    sectionId: FAQ,
    item: 6,
    drafts: {
      [FAQ]: saved({ a6: { draft: `Track your certificates in ${CHIP('Wallet')} anytime.` } }),
    },
    edits: { a6: `Track your certificates in ${CHIP('Vault')} anytime.` },
    savedLabel: 'This change isn’t saved yet',
  },
};

/*
 * The other editor of the conflict frames 7.8.2k / 2l (a fixed mock: "Ama Owusu changed this section 2 minutes ago").
 * ⚠️ ASSUMPTION: when the signed-in editor is Ama herself the other editor is Kofi Mensah (the persona of frame 7.8.2k).
 */
export const THEIR_VERSION = {
  name: 'Ama Owusu',
  agoLabel: '2 min ago',
  agoLong: '2 minutes ago',
  fields: {
    headline: 'Your future starts here',
    primary_cta: 'Create my profile',
  },
};
export const THEIR_VERSION_ALT = { ...THEIR_VERSION, name: 'Kofi Mensah' };
