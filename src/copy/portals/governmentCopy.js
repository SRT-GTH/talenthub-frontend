import { PRIMARY_NAV, SECONDARY_NAV } from '../../components/sections/agency/agencyNav.js';
import {
  HOME_HERO,
  LIMIT_CARDS,
  MONTH_STATS,
  NATIONAL_SNAPSHOT,
  NEXT_STEP,
  QUICK_ACTIONS,
} from '../../components/sections/agency/home/data/agencyHomeData.js';
import { copySection } from '../copySections.js';
import { bindCopy } from '../copyBind.js';

/*
 * governmentCopy — the government (agency) portal texts staff can edit in Site copy: the menu and the Home texts that read the same for
 * every agency. Words in braces ({first}, {pct}, {used} …) are filled in for each agency; keep them where they are.
 * Section ids use the portal name staff see ("government"); the code lives under /agency. Imported by AgencyApp.
 */

const navFields = (items, list) =>
  items.map((item, i) => [`${item.id}-label`, `Menu: ${item.label}`, [list, i, 'label']]);

export const GOVERNMENT_MENU_COPY = copySection({
  id: 'government.shared.menu',
  label: 'Menu',
  pageLabel: 'Shared',
  shared: true,
  data: { PRIMARY_NAV, SECONDARY_NAV },
  fields: [...navFields(PRIMARY_NAV, 'PRIMARY_NAV'), ...navFields(SECONDARY_NAV, 'SECONDARY_NAV')],
  preview: { path: '/agency' },
});

export const GOVERNMENT_HOME_COPY = copySection({
  id: 'government.home.overview',
  label: 'Overview',
  pageLabel: 'Home',
  data: { HOME_HERO, QUICK_ACTIONS, NATIONAL_SNAPSHOT, MONTH_STATS, NEXT_STEP, LIMIT_CARDS },
  fields: [
    ['hero-title', 'Welcome heading', ['HOME_HERO', 'default', 'title']],
    ['hero-subtitle', 'Welcome line', ['HOME_HERO', 'default', 'subtitle']],
    ['first-title', 'Welcome heading (first visit)', ['HOME_HERO', 'firstLogin', 'title']],
    ['first-subtitle', 'Welcome line (first visit)', ['HOME_HERO', 'firstLogin', 'subtitle']],
    ['quota-title', 'Quota warning: heading', ['HOME_HERO', 'quota', 'title']],
    ['quota-subtitle', 'Quota warning: line', ['HOME_HERO', 'quota', 'subtitle']],
    ['quota-action', 'Quota warning: button', ['HOME_HERO', 'quota', 'action']],
    ...QUICK_ACTIONS.default.map((a, i) => [
      `action-${a.id}-title`,
      `Quick action ${i + 1}`,
      ['QUICK_ACTIONS', 'default', i, 'title'],
    ]),
    ['national-eyebrow', 'National data card: small label', ['NATIONAL_SNAPSHOT', 'eyebrow']],
    ['national-action', 'National data card: button', ['NATIONAL_SNAPSHOT', 'action']],
    ['month-title', 'This month: heading', ['MONTH_STATS', 'title']],
    ['next-eyebrow', 'Next step: small label', ['NEXT_STEP', 'eyebrow']],
    ['next-title', 'Next step: title', ['NEXT_STEP', 'title']],
    ['next-body', 'Next step: text', ['NEXT_STEP', 'body']],
    ...LIMIT_CARDS.flatMap((c, i) => [
      [`limit-${c.id}-title`, `Usage card ${i + 1}: title`, ['LIMIT_CARDS', i, 'title']],
      [`limit-${c.id}-body`, `Usage card ${i + 1}: text`, ['LIMIT_CARDS', i, 'body']],
      [`limit-${c.id}-foot`, `Usage card ${i + 1}: note`, ['LIMIT_CARDS', i, 'foot']],
    ]),
  ],
  preview: { path: '/agency' },
});

export const GOVERNMENT_COPY_SECTIONS = [GOVERNMENT_MENU_COPY, GOVERNMENT_HOME_COPY];

bindCopy(...GOVERNMENT_COPY_SECTIONS);
