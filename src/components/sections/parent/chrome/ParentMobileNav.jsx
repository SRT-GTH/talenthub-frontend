import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import DashboardMobileTabBar from '../../dashboard/DashboardMobileTabBar.jsx';
import useParentChrome from '../live/useParentChrome.js';
import { NAV_MAIN, NAV_SECONDARY, careerHome } from '../data/parentCoreData.js';
import { PARENT_NAV_ICONS } from './parentNavIcons.js';
import searchIcon from '../../../../assets/parent/search-0-1.svg';

const log = debug('ParentMobileNav');

// Thumb-reach tabs; everything else is in the More sheet.
const TAB_IDS = ['home', 'wards', 'review', 'notifications'];
const TAB_LABELS = { wards: 'Wards', review: 'Review' };

/*
 * ParentMobileNav — the phone (< 768px) replacement for the parent sidebar: the app's shared bottom tab bar
 * (DashboardMobileTabBar, the recruiter's) fed with the parent nav: Home · Wards · Review · Notifications · More.
 * More holds Evaluate, Ward wallets, Settings, Help and guides, then Search (the top bar's search field is hidden on
 * phones) and Switch to My career / Build my career profile. Badges are the sidebar's (live: GET /parent/me counts).
 * ⚠️ ASSUMPTION: the Parents file has no phone frame; this mirrors the talent and recruiter phone chrome
 * (wiki/responsive-plan.md §4). md–lg gets the collapsed rail instead (ParentFrame).
 * Props: active (nav id), sidebar (demo SIDEBAR_STATES key), career ('talent' | 'none'), onSearch, onBuildCareer.
 */
const ParentMobileNav = ({
  active = 'home',
  sidebar = 'linked',
  career,
  onSearch,
  onBuildCareer,
}) => {
  const chrome = useParentChrome(sidebar);
  const { pathname } = useLocation();
  const badges = chrome.sidebar.badges;

  const nav = useMemo(() => {
    const item = (it) => ({
      id: it.id,
      label: it.label,
      tabLabel: TAB_LABELS[it.id],
      icon: PARENT_NAV_ICONS[it.id],
      to: it.id === 'career' ? careerHome(chrome.live) : it.to,
      active: it.id === active,
      badge: badges[it.id],
    });
    const all = NAV_MAIN.map(item);
    const tabItems = TAB_IDS.map((id) => all.find((it) => it.id === id));
    const moreItems = all.filter((it) => !TAB_IDS.includes(it.id));
    const secondaryNavItems = NAV_SECONDARY.filter((it) => it.id !== 'career').map(item);
    return {
      tabItems,
      moreItems,
      secondaryNavItems,
      moreActive: [...moreItems, ...secondaryNavItems].some((it) => it.active),
      pathname,
    };
  }, [active, badges, chrome.live, pathname]);

  const sheet = {
    profile: {
      name: chrome.parent.name,
      meta: chrome.sidebar.role,
      photo: chrome.parent.photo,
    },
    extraRows: [
      {
        id: 'search',
        icon: searchIcon,
        label: 'Search',
        onSelect: () => {
          log('More › Search');
          onSearch?.();
        },
      },
      career === 'none'
        ? {
            id: 'career',
            icon: PARENT_NAV_ICONS.career,
            label: 'Build my career profile',
            onSelect: () => {
              log('More › Build my career profile');
              onBuildCareer?.();
            },
          }
        : {
            id: 'career',
            icon: PARENT_NAV_ICONS.career,
            label: 'Switch to My career',
            to: careerHome(chrome.live),
          },
    ],
    footer: null,
  };

  return <DashboardMobileTabBar nav={nav} sheet={sheet} />;
};

export default ParentMobileNav;
