import {
  PRIMARY_NAV,
  SECONDARY_NAV,
} from '../../components/sections/institution/institutionNav.js';
import {
  GLANCE_TEXT,
  HOME_HERO,
  NEXT_STEP,
  QUICK_ACTIONS,
  READINESS_CARD,
} from '../../components/sections/institution/home/data/institutionHomeData.js';
import { copySection } from '../copySections.js';
import { bindCopy } from '../copyBind.js';

/*
 * institutionCopy — the institution portal texts staff can edit in Site copy: the menu and the Home texts that read the same for every
 * school. Words in braces ({first}, {institution}, {n}, {pct}, {school} …) are filled in for each school; keep them where they are.
 * The home is built from live data (GET /institution/home); these are its words, the numbers come from the API.
 * Imported by InstitutionApp.
 */

const navFields = (items, list) =>
  items.map((item, i) => [`${item.id}-label`, `Menu: ${item.label}`, [list, i, 'label']]);

export const INSTITUTION_MENU_COPY = copySection({
  id: 'institution.shared.menu',
  label: 'Menu',
  pageLabel: 'Shared',
  shared: true,
  data: { PRIMARY_NAV, SECONDARY_NAV },
  fields: [...navFields(PRIMARY_NAV, 'PRIMARY_NAV'), ...navFields(SECONDARY_NAV, 'SECONDARY_NAV')],
  preview: { path: '/institution' },
});

// The next-step card shows one of these, depending on the roster.
const NEXT_CASES = [
  ['consent', 'guardian consent needed'],
  ['invite', 'students not invited'],
  ['waiting', 'students still to confirm'],
  ['add', 'everyone linked'],
];

export const INSTITUTION_HOME_COPY = copySection({
  id: 'institution.home.overview',
  label: 'Overview',
  pageLabel: 'Home',
  data: { HOME_HERO, QUICK_ACTIONS, READINESS_CARD, NEXT_STEP, GLANCE_TEXT },
  fields: [
    ['hero-title', 'Welcome heading', ['HOME_HERO', 'default', 'title']],
    ['hero-subtitle', 'Welcome line', ['HOME_HERO', 'default', 'subtitle']],
    ['first-title', 'Welcome heading (first visit)', ['HOME_HERO', 'firstLogin', 'title']],
    ['first-subtitle', 'Welcome line (first visit)', ['HOME_HERO', 'firstLogin', 'subtitle']],
    [
      'overlay-title',
      'Welcome heading (first-visit tour)',
      ['HOME_HERO', 'firstLoginOverlay', 'title'],
    ],
    [
      'overlay-subtitle',
      'Welcome line (first-visit tour)',
      ['HOME_HERO', 'firstLoginOverlay', 'subtitle'],
    ],
    ...QUICK_ACTIONS.default.flatMap((a, i) => [
      [`action-${a.id}-title`, `Quick action ${i + 1}`, ['QUICK_ACTIONS', 'default', i, 'title']],
      [
        `action-${a.id}-meta`,
        `Quick action ${i + 1}: line under it`,
        ['QUICK_ACTIONS', 'default', i, 'meta'],
      ],
    ]),
    ['readiness-eyebrow', 'Readiness card: small label', ['READINESS_CARD', 'eyebrow']],
    ['readiness-title', 'Readiness card: title', ['READINESS_CARD', 'title']],
    ['readiness-empty', 'Readiness card: no students yet', ['READINESS_CARD', 'empty']],
    ['readiness-action', 'Readiness card: button', ['READINESS_CARD', 'action']],
    ['next-eyebrow', 'Next step: small label', ['NEXT_STEP', 'eyebrow']],
    ...NEXT_CASES.flatMap(([k, what]) => [
      [`next-${k}-title`, `Next step (${what}): title`, ['NEXT_STEP', k, 'title']],
      [`next-${k}-body`, `Next step (${what}): text`, ['NEXT_STEP', k, 'body']],
    ]),
    ['glance-title', 'At a glance: heading', ['GLANCE_TEXT', 'title']],
    ['glance-subtitle', 'At a glance: line under the heading', ['GLANCE_TEXT', 'subtitle']],
    ...Object.keys(GLANCE_TEXT.cards).flatMap((k, i) => [
      [
        `glance-${k}-badge`,
        `At a glance card ${i + 1}: label`,
        ['GLANCE_TEXT', 'cards', k, 'badge'],
      ],
      [
        `glance-${k}-title`,
        `At a glance card ${i + 1}: title`,
        ['GLANCE_TEXT', 'cards', k, 'title'],
      ],
    ]),
  ],
  preview: { path: '/institution' },
});

// The phone home (InstitutionHomeMobile) is built from live data and the session; it has no editable texts of its own.

export const INSTITUTION_COPY_SECTIONS = [INSTITUTION_MENU_COPY, INSTITUTION_HOME_COPY];

bindCopy(...INSTITUTION_COPY_SECTIONS);
