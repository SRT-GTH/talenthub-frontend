import {
  TALENT_NAV_MAIN,
  TALENT_NAV_SECONDARY,
  TALENT_NAV_WALLET,
} from '../../components/sections/talentHome/talentShellData.js';
import {
  BUDDY_INTRO,
  EXPLORE,
  FIRST_QUESTS,
  HOME_TAB_ITEMS,
  UNLOCKS,
} from '../../components/sections/talentHome/talentHomeCoreData.js';
import { copySection } from '../copySections.js';
import { bindCopy } from '../copyBind.js';

/*
 * talentCopy — the talent portal texts staff can edit in Site copy: the menu (sidebar, rail and phone nav) and the Home page cards
 * that read the same for every talent. Greetings, names, numbers and matches come from each talent's own data and are not here.
 * Imported once by the talent chrome and the Home page (bindCopy applies the published text to the data they read).
 */

const navFields = (items, list) =>
  items.map((item, i) => [`${item.id}-label`, `Menu: ${item.label}`, [list, i, 'label']]);

export const TALENT_MENU_COPY = copySection({
  id: 'talent.shared.menu',
  label: 'Menu',
  pageLabel: 'Shared',
  shared: true,
  data: { TALENT_NAV_MAIN, TALENT_NAV_SECONDARY, WALLET: [TALENT_NAV_WALLET] },
  fields: [
    ...navFields(TALENT_NAV_MAIN, 'TALENT_NAV_MAIN'),
    ['wallet-label', 'Menu: Wallet', ['WALLET', 0, 'label']],
    ...navFields(TALENT_NAV_SECONDARY, 'TALENT_NAV_SECONDARY'),
  ],
  preview: { path: '/home' },
});

export const TALENT_HOME_COPY = copySection({
  id: 'talent.home.cards',
  label: 'Home cards',
  pageLabel: 'Home',
  data: { BUDDY_INTRO, FIRST_QUESTS, UNLOCKS, EXPLORE, HOME_TAB_ITEMS },
  fields: [
    ['buddy-title', 'Career Buddy card: title', ['BUDDY_INTRO', 'title']],
    ['buddy-sub', 'Career Buddy card: line under the title', ['BUDDY_INTRO', 'sub']],
    ['buddy-message', 'Career Buddy card: message', ['BUDDY_INTRO', 'message']],
    ...BUDDY_INTRO.chips.map((c, i) => [
      `buddy-chip-${i + 1}`,
      `Career Buddy card: suggestion ${i + 1}`,
      ['BUDDY_INTRO', 'chips', i],
    ]),
    ['buddy-cta', 'Career Buddy card: button', ['BUDDY_INTRO', 'cta']],
    ['quests-title', 'First quests: title', ['FIRST_QUESTS', 'title']],
    ['quests-sub', 'First quests: line under the title', ['FIRST_QUESTS', 'sub']],
    ...FIRST_QUESTS.quests.flatMap((q, i) => [
      [`quest-${q.id}-title`, `Quest ${i + 1}`, ['FIRST_QUESTS', 'quests', i, 'title']],
      [`quest-${q.id}-meta`, `Quest ${i + 1}: time`, ['FIRST_QUESTS', 'quests', i, 'meta']],
    ]),
    ['unlocks-title-lead', 'Unlocks: heading', ['UNLOCKS', 'title', 0, 0]],
    ['unlocks-title-accent', 'Unlocks: heading, green end', ['UNLOCKS', 'title', 1, 0]],
    ['unlocks-sub', 'Unlocks: line under the heading', ['UNLOCKS', 'sub']],
    ['unlocks-locked', 'Unlocks: "Locked" chip', ['UNLOCKS', 'chipLocked']],
    ...UNLOCKS.cards.flatMap((c, i) => [
      [`unlock-${c.id}-title`, `Unlock ${i + 1}: title`, ['UNLOCKS', 'cards', i, 'title']],
      [`unlock-${c.id}-body`, `Unlock ${i + 1}: text`, ['UNLOCKS', 'cards', i, 'body']],
    ]),
    ['explore-text', 'Explore strip: question', ['EXPLORE', 'text']],
    ...HOME_TAB_ITEMS.map((t, i) => [
      `tab-${t.id}`,
      `Home tab ${i + 1}`,
      ['HOME_TAB_ITEMS', i, 'label'],
    ]),
  ],
  preview: { path: '/home' },
});

export const TALENT_COPY_SECTIONS = [TALENT_MENU_COPY, TALENT_HOME_COPY];

bindCopy(...TALENT_COPY_SECTIONS);
