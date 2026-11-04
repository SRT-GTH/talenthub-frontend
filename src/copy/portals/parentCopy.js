import { NAV_MAIN, NAV_SECONDARY } from '../../components/sections/parent/data/parentCoreData.js';
import {
  HOME_TABS,
  OFFLINE,
  QUICK_ACTIONS,
} from '../../components/sections/parent/home/data/parentHomeData.js';
import { copySection } from '../copySections.js';
import { bindCopy } from '../copyBind.js';

/*
 * parentCopy — the parent portal texts staff can edit in Site copy: the menu and the Home texts that read the same for every parent.
 * Wards, greetings, numbers and the weekly guide come from each parent's own data and are not here. Imported by ParentApp.
 */

const navFields = (items, list) =>
  items.map((item, i) => [`${item.id}-label`, `Menu: ${item.label}`, [list, i, 'label']]);

export const PARENT_MENU_COPY = copySection({
  id: 'parent.shared.menu',
  label: 'Menu',
  pageLabel: 'Shared',
  shared: true,
  data: { NAV_MAIN, NAV_SECONDARY },
  fields: [...navFields(NAV_MAIN, 'NAV_MAIN'), ...navFields(NAV_SECONDARY, 'NAV_SECONDARY')],
  preview: { path: '/parent' },
});

export const PARENT_HOME_COPY = copySection({
  id: 'parent.home.overview',
  label: 'Overview',
  pageLabel: 'Home',
  data: { QUICK_ACTIONS, HOME_TABS, OFFLINE },
  fields: [
    ...QUICK_ACTIONS.map((a, i) => [
      `action-${a.id}`,
      `Quick action ${i + 1}`,
      ['QUICK_ACTIONS', i, 'label'],
    ]),
    ['tab-overview', 'First tab', ['HOME_TABS', 0, 'label']],
    ['offline-title', 'Offline banner: title', ['OFFLINE', 'title']],
    ['offline-body', 'Offline banner: text', ['OFFLINE', 'body']],
  ],
  preview: { path: '/parent' },
});

export const PARENT_COPY_SECTIONS = [PARENT_MENU_COPY, PARENT_HOME_COPY];

bindCopy(...PARENT_COPY_SECTIONS);
