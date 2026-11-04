import {
  PRIMARY_NAV,
  SECONDARY_NAV,
} from '../../components/sections/institution/institutionNav.js';
import {
  GLANCE,
  HOME_HERO,
  MOBILE_HOME,
  NEXT_STEP,
  QUICK_ACTIONS,
  READINESS_CARD,
} from '../../components/sections/institution/home/data/institutionHomeData.js';
import { copySection } from '../copySections.js';
import { bindCopy } from '../copyBind.js';

/*
 * institutionCopy — the institution portal texts staff can edit in Site copy: the menu and the Home texts that read the same for every
 * school. Words in braces ({first}, {pending}, {students} …) are filled in for each school; keep them where they are.
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

export const INSTITUTION_HOME_COPY = copySection({
  id: 'institution.home.overview',
  label: 'Overview',
  pageLabel: 'Home',
  data: { HOME_HERO, QUICK_ACTIONS, READINESS_CARD, NEXT_STEP, GLANCE },
  fields: [
    ['hero-title', 'Welcome heading', ['HOME_HERO', 'default', 'title']],
    ['hero-subtitle', 'Welcome line', ['HOME_HERO', 'default', 'subtitle']],
    ['first-title', 'Welcome heading (first visit)', ['HOME_HERO', 'firstLogin', 'title']],
    ['first-subtitle', 'Welcome line (first visit)', ['HOME_HERO', 'firstLogin', 'subtitle']],
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
    ['readiness-action', 'Readiness card: button', ['READINESS_CARD', 'action']],
    ['next-eyebrow', 'Next step: small label', ['NEXT_STEP', 'eyebrow']],
    ['next-title', 'Next step: title', ['NEXT_STEP', 'title']],
    ['next-body', 'Next step: text', ['NEXT_STEP', 'body']],
    ['glance-title', 'This term: heading', ['GLANCE', 'title']],
    ['glance-subtitle', 'This term: line under the heading', ['GLANCE', 'subtitle']],
    ...GLANCE.cards.map((c, i) => [
      `glance-${c.id}-title`,
      `This term card ${i + 1}: title`,
      ['GLANCE', 'cards', i, 'title'],
    ]),
  ],
  preview: { path: '/institution' },
});

const opt = { optional: true };
const cap = (k) => `${k[0].toUpperCase()}${k.slice(1)}`;

export const INSTITUTION_PHONE_COPY = copySection({
  id: 'institution.home.phone',
  label: 'Phone home',
  pageLabel: 'Home',
  data: { MOBILE_HOME },
  fields: [
    ['greeting', 'Greeting', ['MOBILE_HOME', 'greeting', 0], opt],
    ...Object.keys(MOBILE_HOME)
      .filter(
        (k) =>
          MOBILE_HOME[k] && typeof MOBILE_HOME[k] === 'object' && !Array.isArray(MOBILE_HOME[k])
      )
      .flatMap((k) => [
        [`${k}-title`, `${cap(k)} card: title`, ['MOBILE_HOME', k, 'title'], opt],
        [`${k}-sub`, `${cap(k)} card: line under the title`, ['MOBILE_HOME', k, 'sub'], opt],
        [`${k}-action`, `${cap(k)} card: button`, ['MOBILE_HOME', k, 'action'], opt],
        [`${k}-all`, `${cap(k)} card: "see all" link`, ['MOBILE_HOME', k, 'all'], opt],
      ]),
  ],
  preview: { path: '/institution' },
});

export const INSTITUTION_COPY_SECTIONS = [
  INSTITUTION_MENU_COPY,
  INSTITUTION_HOME_COPY,
  INSTITUTION_PHONE_COPY,
];

bindCopy(...INSTITUTION_COPY_SECTIONS);
