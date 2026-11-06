import { PRIMARY_NAV, SECONDARY_NAV } from '../../components/sections/agency/agencyNav.js';
import {
  HOME_HERO,
  LIMIT_CARDS,
  MOBILE_HOME,
  MONTH_STATS,
  NATIONAL_SNAPSHOT,
  NEXT_STEP,
  QUICK_ACTIONS,
} from '../../components/sections/agency/home/data/agencyHomeData.js';
import { NATIONAL_SUBTITLE } from '../../components/sections/agency/national/data/nationalData.js';
import { HERO_SUBTITLE } from '../../components/sections/agency/demand/data/demandData.js';
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

const opt = { optional: true };

export const GOVERNMENT_PHONE_COPY = copySection({
  id: 'government.home.phone',
  label: 'Phone home',
  pageLabel: 'Home',
  data: { MOBILE_HOME },
  fields: [
    ['greeting', 'Greeting', ['MOBILE_HOME', 'greeting'], opt],
    ['sub', 'Line under the greeting', ['MOBILE_HOME', 'sub'], opt],
    ...[
      ['mou', 'MoU card'],
      ['requests', 'Data requests card'],
      ['programmes', 'Programmes card'],
      ['applicants', 'Applicants card'],
      ['changes', 'Saved query changes card'],
      ['skills', 'Readiness by skill card'],
    ].flatMap(([k, label]) => [
      [`${k}-title`, `${label}: title`, ['MOBILE_HOME', k, 'title'], opt],
      [`${k}-sub`, `${label}: line under the title`, ['MOBILE_HOME', k, 'sub'], opt],
      [`${k}-action`, `${label}: button`, ['MOBILE_HOME', k, 'action'], opt],
      [`${k}-all`, `${label}: "see all" link`, ['MOBILE_HOME', k, 'all'], opt],
    ]),
  ],
  preview: { path: '/agency' },
});

/*
 * Page headings of the other government pages. The pages used to carry these as literal text; they now read them from here, so
 * the defaults below ARE the page text.
 */
export const GOVERNMENT_PAGE_TEXT = {
  districts: {
    title: 'Districts',
    subtitle:
      'All 261 districts across 16 regions. Pick one to see its talents, skills and outcomes. Counts under 5 are hidden.',
  },
  national: { title: 'National data', subtitle: NATIONAL_SUBTITLE },
  compare: {
    title: 'Compare regions',
    subtitle: 'Side by side with the same filters. Add up to 3 regions.',
  },
  demand: { title: 'Demand & outcomes', subtitle: HERO_SUBTITLE },
  methodology: {
    title: 'How we count',
    subtitle:
      'Where the numbers come from, how often they refresh and why small groups are hidden.',
  },
  caseStudy: { title: 'Case study', subtitle: 'How one partner programme moved talents forward.' },
  outcomes: {
    title: 'Impact and outcomes',
    subtitle: 'Placements, scholarships and skills gained through GTH, all partners combined.',
  },
  queries: {
    title: 'Queries',
    subtitle:
      'Build a cut of the data in your MoU. Pick filters, then save or export it. Data as of 18 Oct 2026, 09:00. Groups under 5 stay hidden.',
  },
  trends: {
    title: 'Trends',
    subtitle:
      'Sign-ups, assessments and placements over 24 months. Your MoU includes the full history.',
  },
};

const PAGE_LABELS = {
  districts: 'Districts',
  national: 'National data',
  compare: 'Compare regions',
  methodology: 'How we count',
  caseStudy: 'Case study',
  outcomes: 'Impact and outcomes',
  queries: 'Queries',
  trends: 'Trends',
};

export const GOVERNMENT_PAGES_COPY = copySection({
  id: 'government.pages.headings',
  label: 'Page headings',
  pageLabel: 'Other pages',
  data: { GOVERNMENT_PAGE_TEXT },
  fields: [
    ...Object.entries(PAGE_LABELS).flatMap(([k, label]) => [
      [`${k}-title`, `${label}: heading`, ['GOVERNMENT_PAGE_TEXT', k, 'title']],
      [
        `${k}-subtitle`,
        `${label}: line under the heading`,
        ['GOVERNMENT_PAGE_TEXT', k, 'subtitle'],
      ],
    ]),
    ['demand-title', 'Demand & outcomes: heading', ['GOVERNMENT_PAGE_TEXT', 'demand', 'title']],
    ...Object.keys(HERO_SUBTITLE).map((v) => [
      `demand-${v}-subtitle`,
      `Demand & outcomes (${v}): line under the heading`,
      ['GOVERNMENT_PAGE_TEXT', 'demand', 'subtitle', v],
    ]),
  ],
  preview: { path: '/agency/districts' },
});

export const GOVERNMENT_COPY_SECTIONS = [
  GOVERNMENT_MENU_COPY,
  GOVERNMENT_HOME_COPY,
  GOVERNMENT_PHONE_COPY,
  GOVERNMENT_PAGES_COPY,
];

bindCopy(...GOVERNMENT_COPY_SECTIONS);
