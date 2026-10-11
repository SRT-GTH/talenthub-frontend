import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import CommunityIcon from '../community/CommunityIcon.jsx';
import { icons } from '../community/communityIcons.js';
import { TAB_BAR_IDS, useDashboardNav } from './dashboardNav.js';
import NavBadge from './NavBadge.jsx';
import DashboardMoreSheet from './DashboardMoreSheet.jsx';

const log = debug('DashboardMobileTabBar');

/*
 * DashboardMobileTabBar — the phone (< md) replacement for the left rail.
 * Five thumb-reach tabs: Home · Talent Search · Job Postings · Messages · More.
 * "More" opens DashboardMoreSheet with every remaining destination, so nothing
 * the rail offers is unreachable on a phone (audit finding P2).
 *
 * It sits IN FLOW at the bottom of DashboardShell's column (not `fixed`), so
 * the scroll area ends exactly at its top edge — no page padding games and no
 * overlap with the last piece of content. It carries the iOS home-indicator
 * safe-area inset as padding. md and up never render it (`md:hidden`); the
 * md–lg tablet gets the collapsed rail instead.
 *
 * Active state comes from the route via useDashboardNav() — same source as
 * the rail. Each tab is >= 48px wide x 64px tall.
 *
 * `⚠️ ASSUMPTION` — engineering pattern from wiki/responsive-plan.md §4; Figma
 * has no phone frame for the dashboard. Pending designer sign-off.
 */

const GREEN_GRADIENT = 'linear-gradient(171.84deg, #387440 14.637%, #84cc16 85.349%)';

const TabContent = ({ icon, label, active, badge }) => (
  <>
    <span
      className={classNames(
        'relative flex h-[28px] w-[52px] items-center justify-center rounded-[14px] transition-colors',
        !active && 'group-active:bg-brand-green-light'
      )}
      style={active ? { backgroundImage: GREEN_GRADIENT } : undefined}
    >
      <CommunityIcon
        src={icon}
        size={active ? 16 : 18}
        className={active ? 'brightness-0 invert' : 'brightness-0 invert-[.6]'}
      />
      {badge && (
        <NavBadge
          count={badge}
          className="absolute -right-[2px] -top-[6px] !h-[18px] !min-w-[18px] !px-[4px] !leading-none"
        />
      )}
    </span>
    <span
      className={classNames(
        'max-w-full truncate font-sans text-[12px] leading-4 tracking-[0.1px]',
        active ? 'font-semibold text-brand-green' : 'font-medium text-neutral-dark-active'
      )}
    >
      {label}
    </span>
  </>
);

const tabClass =
  'group flex min-w-[48px] flex-1 flex-col items-center justify-center gap-[1px] px-[2px] py-[4px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-green';

const DashboardMobileTabBar = ({ className }) => {
  const { tabItems, moreItems, secondaryNavItems, moreActive, pathname } = useDashboardNav();
  /* The sheet is "open for a path": navigating (from a tab or from inside the
     sheet) changes pathname, which closes it without a setState-in-effect. */
  const [moreOpenPath, setMoreOpenPath] = useState(null);
  const moreOpen = moreOpenPath === pathname;
  const setMoreOpen = (next) => setMoreOpenPath(next ? pathname : null);

  useEffect(() => {
    log('mount', { tabs: TAB_BAR_IDS });
  }, []);

  return (
    <>
      <nav
        aria-label="Primary"
        className={classNames(
          'relative z-40 flex w-full shrink-0 items-stretch border-t border-[#e7e7e7] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_8px_0_rgba(0,0,0,0.04)] md:hidden',
          className
        )}
      >
        <div className="flex h-[56px] w-full items-stretch">
          {tabItems.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              aria-label={item.label}
              aria-current={item.active ? 'page' : undefined}
              onClick={() => log('tab click:', item.id)}
              className={tabClass}
            >
              <TabContent
                icon={item.icon}
                label={item.tabLabel ?? item.label}
                active={item.active}
                badge={item.badge}
              />
            </Link>
          ))}

          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={moreOpen}
            onClick={() => {
              log('tab click: more →', moreOpen ? 'close' : 'open');
              setMoreOpen(!moreOpen);
            }}
            className={classNames(tabClass, 'h-[46px] self-center')}
          >
            <TabContent icon={icons.postMenu} label="More" active={moreActive || moreOpen} />
          </button>
        </div>
      </nav>

      <DashboardMoreSheet
        isOpen={moreOpen}
        onClose={() => setMoreOpen(false)}
        items={moreItems}
        secondaryItems={secondaryNavItems}
      />
    </>
  );
};

export default DashboardMobileTabBar;
