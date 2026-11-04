import { NAV_MAIN, NAV_SECONDARY } from '../../components/sections/parent/data/parentCoreData.js';
import {
  HOME_TABS,
  OFFLINE,
  QUICK_ACTIONS,
} from '../../components/sections/parent/home/data/parentHomeData.js';
import {
  WARDS_SUBTITLE,
  WARDS_TITLE,
} from '../../components/sections/parent/wards/data/wardsData.js';
import {
  REVIEW_INTRO,
  REVIEW_TITLE,
} from '../../components/sections/parent/review/data/reviewData.js';
import { EVALUATE_TITLE } from '../../components/sections/parent/evaluate/data/evaluateData.js';
import {
  LINK_SUBTITLE,
  LINK_TITLE,
} from '../../components/sections/parent/link/data/linkWardData.js';
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

/** Page headings of the other parent pages (the pages read them from here; defaults are the pages' own text). */
export const PARENT_PAGE_TEXT = {
  wards: { title: WARDS_TITLE, subtitle: WARDS_SUBTITLE },
  review: { title: REVIEW_TITLE, intro: REVIEW_INTRO },
  evaluate: { title: EVALUATE_TITLE },
  link: { title: LINK_TITLE, subtitle: LINK_SUBTITLE },
};

export const PARENT_PAGES_COPY = copySection({
  id: 'parent.pages.headings',
  label: 'Page headings',
  pageLabel: 'Other pages',
  data: { PARENT_PAGE_TEXT },
  fields: [
    ['wards-title', 'My wards: heading', ['PARENT_PAGE_TEXT', 'wards', 'title']],
    [
      'wards-subtitle',
      'My wards: line under the heading',
      ['PARENT_PAGE_TEXT', 'wards', 'subtitle'],
    ],
    ['review-title', 'To review: heading', ['PARENT_PAGE_TEXT', 'review', 'title']],
    ['review-intro', 'To review: line under the heading', ['PARENT_PAGE_TEXT', 'review', 'intro']],
    ['evaluate-title', 'Evaluate: heading', ['PARENT_PAGE_TEXT', 'evaluate', 'title']],
    ['link-title', 'Link a ward: heading', ['PARENT_PAGE_TEXT', 'link', 'title']],
    [
      'link-subtitle',
      'Link a ward: line under the heading',
      ['PARENT_PAGE_TEXT', 'link', 'subtitle'],
    ],
  ],
  preview: { path: '/parent/wards' },
});

export const PARENT_COPY_SECTIONS = [PARENT_MENU_COPY, PARENT_HOME_COPY, PARENT_PAGES_COPY];

bindCopy(...PARENT_COPY_SECTIONS);
