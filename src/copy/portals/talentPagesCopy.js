import { OVERVIEW_PAGE } from '../../components/sections/talentAssessment/assessmentData.js';
import { MESSAGES_COPY } from '../../components/sections/talentMessages/messagesData.js';
import { WALLET_COPY } from '../../components/sections/talentWallet/walletData.js';
import { CYCLES_HERO } from '../../components/sections/talentWallet/walletCyclesData.js';
import { HEADER } from '../../components/sections/talentLearning/talentLearningHubData.js';
import { EXPLORE_HEADER } from '../../components/sections/talentLearning/talentLearningExploreData.js';
import { SETTINGS_NAV } from '../../components/sections/talentSettings/talentSettingsAData.js';
import { copySection } from '../copySections.js';
import { bindCopy } from '../copyBind.js';

/*
 * talentPagesCopy — page headings and fixed labels of the talent pages beyond Home: My Assessment, Messages, Wallet (+ Cycles),
 * My Learning (+ Explore) and the Settings menu. Imported by those pages (bindCopy applies the published text to their data).
 * Job Postings is not here yet: its header object is swapped per design variant at load (talentJobsData `pick`).
 */
const opt = { optional: true };

export const TALENT_ASSESSMENT_COPY = copySection({
  id: 'talent.assessment.header',
  label: 'Page heading',
  pageLabel: 'My Assessment',
  data: { OVERVIEW_PAGE },
  fields: [
    ['title', 'Heading', ['OVERVIEW_PAGE', 'title']],
    ['subtitle', 'Line under the heading', ['OVERVIEW_PAGE', 'subtitle']],
    ['preview-cta', 'Preview button', ['OVERVIEW_PAGE', 'previewCta'], opt],
  ],
  preview: { path: '/my-assessment' },
});

export const TALENT_MESSAGES_COPY = copySection({
  id: 'talent.messages.header',
  label: 'Page heading and labels',
  pageLabel: 'Messages',
  data: { MESSAGES_COPY },
  fields: [
    ['title', 'Heading', ['MESSAGES_COPY', 'title']],
    ['subtitle', 'Line under the heading', ['MESSAGES_COPY', 'subtitle']],
    ['search', 'Search box hint', ['MESSAGES_COPY', 'searchPlaceholder'], opt],
    ['tab-all', 'Tab: All', ['MESSAGES_COPY', 'tabs', 'all'], opt],
    ['tab-unread', 'Tab: Unread', ['MESSAGES_COPY', 'tabs', 'unread'], opt],
    ['tab-requests', 'Tab: Requests', ['MESSAGES_COPY', 'tabs', 'requests'], opt],
    ['requests-notice', 'Requests notice', ['MESSAGES_COPY', 'requestsNotice'], opt],
    ['composer', 'Message box hint', ['MESSAGES_COPY', 'composerPlaceholder'], opt],
    ['help-reply', '"Help me reply" button', ['MESSAGES_COPY', 'helpMeReply'], opt],
  ],
  preview: { path: '/messages' },
});

export const TALENT_WALLET_COPY = copySection({
  id: 'talent.wallet.header',
  label: 'Page heading and Cycles',
  pageLabel: 'Wallet',
  data: { WALLET_COPY, CYCLES_HERO },
  fields: [
    ['title', 'Heading', ['WALLET_COPY', 'title']],
    ['subtitle', 'Line under the heading', ['WALLET_COPY', 'subtitle']],
    ['cycles-label', 'Cycles card: title', ['CYCLES_HERO', 'label'], opt],
    ['cycles-note', 'Cycles card: text', ['CYCLES_HERO', 'note'], opt],
    ['cycles-redeem', 'Cycles card: redeem button', ['CYCLES_HERO', 'redeem'], opt],
    ['cycles-how', 'Cycles card: "how it works" link', ['CYCLES_HERO', 'how'], opt],
  ],
  preview: { path: '/wallet' },
});

export const TALENT_LEARNING_COPY = copySection({
  id: 'talent.learning.header',
  label: 'Page headings',
  pageLabel: 'My Learning',
  data: { HEADER, EXPLORE_HEADER },
  fields: [
    ['title', 'My Learning: heading', ['HEADER', 'title']],
    ['subtitle', 'My Learning: line under the heading', ['HEADER', 'subtitle']],
    ['explore-title', 'Explore courses: heading', ['EXPLORE_HEADER', 'title']],
    ['explore-subtitle', 'Explore courses: line under the heading', ['EXPLORE_HEADER', 'subtitle']],
  ],
  preview: { path: '/learning' },
});

export const TALENT_SETTINGS_COPY = copySection({
  id: 'talent.settings.menu',
  label: 'Settings menu',
  pageLabel: 'Settings',
  data: { SETTINGS_NAV },
  fields: SETTINGS_NAV.map((item, i) => [
    `${item.id}-label`,
    `Menu: ${item.label}`,
    ['SETTINGS_NAV', i, 'label'],
  ]),
  preview: { path: '/settings' },
});

export const TALENT_PAGES_COPY_SECTIONS = [
  TALENT_ASSESSMENT_COPY,
  TALENT_MESSAGES_COPY,
  TALENT_WALLET_COPY,
  TALENT_LEARNING_COPY,
  TALENT_SETTINGS_COPY,
];

bindCopy(...TALENT_PAGES_COPY_SECTIONS);
