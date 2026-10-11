import { useLocation } from 'react-router-dom';
import { icons } from '../community/communityIcons.js';

/*
 * dashboardNav.js — the ONE list of dashboard destinations, shared by the
 * desktop / tablet rail (`DashboardSidebar`) and the phone bottom tab bar
 * (`DashboardMobileTabBar` + its More sheet). Adding a destination here adds
 * it everywhere; the surfaces only differ in which subset they surface.
 *
 * Figma only ships the rail (7025:85256 expanded / 7025:86125 collapsed), so
 * the phone tab bar is an engineering pattern from wiki/responsive-plan.md §4
 * (`⚠️ ASSUMPTION` until a designer signs it off).
 */

export const NAV_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    icon: icons.navHome,
    collapsedIcon: icons.navHomeCollapsed,
    to: '/recruiter/home',
  },
  {
    id: 'talent-search',
    label: 'Talent Search',
    tabLabel: 'Talent',
    icon: icons.navTalentSearch,
    collapsedIcon: icons.navTalentSearchCollapsed,
    to: '/recruiter/talent-search',
  },
  {
    id: 'job-postings',
    label: 'Job Postings',
    tabLabel: 'Postings',
    icon: icons.navJobPostings,
    collapsedIcon: icons.navJobPostingsCollapsed,
    badge: '5',
    to: '/recruiter/job-postings',
  },
  {
    id: 'community',
    label: 'Community',
    icon: icons.navCommunityActive,
    collapsedIcon: icons.navCommunityActiveCollapsed,
    to: '/community',
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: icons.navMessages,
    collapsedIcon: icons.navMessages,
    badge: '3',
    to: '/recruiter/messages',
  },
  {
    id: 'application-pipeline',
    label: 'Application Pipeline',
    icon: icons.navApplicationPipeline,
    collapsedIcon: icons.navApplicationPipelineCollapsed,
    to: '/recruiter/application-pipeline',
  },
];

export const SECONDARY_NAV_ITEMS = [
  { id: 'profile', label: 'Profile', icon: icons.navProfile, collapsedIcon: icons.navProfile },
];

/* The four primary phone tabs, in display order. The fifth tab is "More". */
export const TAB_BAR_IDS = ['home', 'talent-search', 'job-postings', 'messages'];

/* `active` is derived from the route (never hardcoded): an item is active on
   its own path and on any nested path beneath it, so /community and
   /community/:id both light up Community. Items with no `to` stay inactive. */
const markActive = (items, pathname) =>
  items.map((item) => ({
    ...item,
    active: Boolean(item.to) && (pathname === item.to || pathname.startsWith(`${item.to}/`)),
  }));

export const useDashboardNav = () => {
  const { pathname } = useLocation();
  const navItems = markActive(NAV_ITEMS, pathname);
  const secondaryNavItems = markActive(SECONDARY_NAV_ITEMS, pathname);
  const tabItems = TAB_BAR_IDS.map((id) => navItems.find((item) => item.id === id));
  const moreItems = navItems.filter((item) => !TAB_BAR_IDS.includes(item.id));
  return {
    pathname,
    navItems,
    secondaryNavItems,
    tabItems,
    moreItems,
    // The "More" tab lights up when the current page lives inside its sheet.
    moreActive: [...moreItems, ...secondaryNavItems].some((item) => item.active),
  };
};
