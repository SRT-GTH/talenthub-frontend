import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import CommunityIcon from '../community/CommunityIcon.jsx';
import { icons } from '../community/communityIcons.js';
import { SIDEBAR_PROFILE, SIDEBAR_PUBLIC_PROFILE } from './dashboardData.js';
import { useDashboardNav } from './dashboardNav.js';
import NavBadge from './NavBadge.jsx';
import PublicProfileCard from './PublicProfileCard.jsx';
import avatarLarge from '../../../assets/community/avatar-recruiter-large.svg';
import { useRecruiterShell } from '../../../hooks/useRecruiterShell.js';

const log = debug('DashboardSidebar');

/*
 * DashboardSidebar — the recruiter's COLLAPSED icon rail (126px, as drawn in the recruiter Figma): avatar puck, icon nav, public-profile
 * popover. The expand chevron hands back to DashboardShell, whose expanded rail is always the workspace sidebar
 * (recruiterDashboard/WorkspaceSidebar.jsx). The older expanded "Getting started" rail was removed (2026-11-25): it showed
 * the Figma sample recruiter on every account. Signed in, the puck shows the recruiter's initials and plan badge.
 *
 * ROLE NOTE — every label here is recruiter-specific and comes straight from
 * Figma; there is no talent/parent variant in the file. See the role note in
 * communityData.js.
 */

const GREEN_GRADIENT = 'linear-gradient(171.84deg, #387440 14.637%, #84cc16 85.349%)';

const CollapsedNavItem = ({ item, onNavigate }) => {
  const RecruiterIcon = item.RecruiterIcon;
  const content = (
    <>
      {RecruiterIcon ? (
        <RecruiterIcon className={item.active ? 'text-[#ebf1ec]' : 'text-[#999999]'} />
      ) : (
        <CommunityIcon
          src={item.collapsedIcon}
          size={item.active ? 18 : 20}
          className={item.active ? 'brightness-0 invert' : 'brightness-0 invert-[.6]'}
        />
      )}
      {item.badge && (
        <NavBadge count={item.badge} className="absolute right-[10px] top-[10px] !text-[12px]" />
      )}
    </>
  );

  const shared = classNames(
    'relative flex h-[54px] w-[80px] items-center justify-center gap-[8px] px-[12px] py-[10px] transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
    item.active ? 'rounded-[16px]' : 'rounded-[10px] hover:bg-brand-green-light'
  );
  const style = item.active ? { backgroundImage: GREEN_GRADIENT } : undefined;

  if (item.to) {
    return (
      <Link
        to={item.to}
        aria-label={item.label}
        aria-current={item.active ? 'page' : undefined}
        className={shared}
        style={style}
        onClick={() => log('nav click:', item.id)}
      >
        {content}
      </Link>
    );
  }
  return (
    <button
      type="button"
      aria-label={item.label}
      className={shared}
      style={style}
      onClick={() => onNavigate(item.id)}
    >
      {content}
    </button>
  );
};

/*
 * `compact` is the md–lg (tablet) rail: the same collapsed rendering, forced
 * collapsed, a touch narrower, with no expand toggle and no "New" badge (that
 * badge hangs 46px outside the avatar puck and the narrow rail would clip it).
 * Phones get DashboardMobileTabBar instead; >= lg is the untouched rail.
 */
const DashboardSidebar = ({ collapsed, onToggle, compact = false, className }) => {
  /* `active` is derived from the route (see dashboardNav.js): /community and
     /community/:id both resolve to the Community item, and items with no `to`
     stay inactive, exactly as before. */
  const { navItems, secondaryNavItems } = useDashboardNav();
  // Signed in: the recruiter's own initials and plan badge (signed out keeps the Figma sample avatar and "New").
  const shell = useRecruiterShell();
  const badge = shell ? shell.plan?.badge || 'Free' : SIDEBAR_PROFILE.badge;

  /* Figma annotation (7025:87865): "Appears when link Icon is hovered or
     clicked." Hover and click are tracked separately so a click that follows
     the pointer entering the trigger PINS the popover instead of immediately
     toggling the hover-opened one shut. */
  const [profileHovered, setProfileHovered] = useState(false);
  const [profilePinned, setProfilePinned] = useState(false);
  const profilePopoverOpen = profileHovered || profilePinned;

  useEffect(() => {
    log('mount', { collapsed });
  }, [collapsed]);

  // Collapsing hides the popover trigger's anchor — close it so it can't
  // linger over the expanded rail.
  useEffect(() => {
    if (!collapsed && profilePinned) {
      log('branch: rail expanded while popover pinned → unpinning popover');
      setProfilePinned(false);
    }
  }, [collapsed, profilePinned]);

  const handleNavigate = (id) => {
    log('nav click (no destination wired yet):', id);
  };

  const handleToggle = () => {
    log('toggle collapse:', collapsed ? 'collapsed → expanded' : 'expanded → collapsed');
    onToggle?.();
  };

  const toggleButton = compact ? null : (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      aria-expanded={!collapsed}
      className={classNames(
        'absolute top-[22px] z-10 inline-flex items-center justify-center rounded-[6px] p-[2px] transition-colors hover:bg-brand-green-light',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
        collapsed ? 'right-[8px]' : 'right-[11px]'
      )}
    >
      <CommunityIcon
        src={collapsed ? icons.collapseRight : icons.collapseLeft}
        size={collapsed ? 19 : 23}
        className={collapsed ? '!h-[16px]' : '!h-[20px]'}
      />
    </button>
  );

  return (
    <aside
      className={classNames(
        'relative flex w-[126px] shrink-0 flex-col items-center justify-between border-r-2 border-white bg-white px-[12px] py-[60px]',
        compact && 'max-lg:w-[104px] max-lg:px-[8px] max-lg:py-[24px]',
        className
      )}
      aria-label="Community navigation"
    >
      {toggleButton}

      <div className="flex min-h-0 flex-col items-center gap-[20px] slim-scrollbar overflow-y-auto">
        {/* Avatar puck — 3px brand ring + "New" badge (7025:86127) */}
        <div className="relative flex flex-col items-center justify-center gap-[16px] rounded-[1000px] border-[3px] border-[#468438] bg-white p-[6px]">
          <span
            className="flex size-[62px] items-center justify-center overflow-hidden rounded-[31px]"
            style={{
              backgroundImage: 'linear-gradient(135deg, #387440 14.637%, #84cc16 85.349%)',
            }}
          >
            {shell ? (
              <span
                className="font-sans text-[22px] font-semibold text-white"
                aria-label={shell.fullName || undefined}
              >
                {shell.initials || ''}
              </span>
            ) : (
              <img
                src={avatarLarge}
                alt={SIDEBAR_PROFILE.name}
                draggable="false"
                className="h-[70px] w-[69px] max-w-none select-none"
              />
            )}
          </span>
          <span className="absolute -right-[46px] top-[5px] inline-flex h-[18px] max-lg:hidden items-center gap-[3px] overflow-hidden rounded-[4px] bg-informative-light px-[4px] py-[2px]">
            <CommunityIcon src={icons.newBadge} size={8} />
            <span className="font-sans text-[9px] max-lg:text-[12px] font-medium tracking-[0.2px] text-informative-dark">
              {badge}
            </span>
          </span>
        </div>

        <nav className="flex flex-col items-start gap-[12px] overflow-hidden pt-[6px]">
          <div className="flex flex-col items-start gap-[4px]">
            {navItems.map((item) => (
              <CollapsedNavItem key={item.id} item={item} onNavigate={handleNavigate} />
            ))}
          </div>
          <div className="h-px w-full rounded-[30px] bg-brand-green-light-hover" />
          {secondaryNavItems.map((item) => (
            <CollapsedNavItem key={item.id} item={item} onNavigate={handleNavigate} />
          ))}
        </nav>
      </div>

      {/* Collapsed public-profile trigger + hover/click popover */}
      <div
        className="relative shrink-0"
        onMouseEnter={() => {
          log('public-profile popover: hover open');
          setProfileHovered(true);
        }}
        onMouseLeave={() => {
          log('public-profile popover: hover close');
          setProfileHovered(false);
        }}
      >
        <button
          type="button"
          aria-label={SIDEBAR_PUBLIC_PROFILE.heading}
          aria-expanded={profilePopoverOpen}
          onClick={() => {
            log('public-profile popover: click pin toggle →', !profilePinned);
            setProfilePinned((pinned) => !pinned);
          }}
          className="flex flex-col items-start overflow-hidden rounded-[12px] border border-neutral bg-white p-[12px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <span className="flex items-center rounded-[8px] bg-brand-green-light px-[10px] py-[8px]">
            <CommunityIcon src={icons.linkOutlinedLg} size={20} />
          </span>
        </button>

        {profilePopoverOpen && (
          <PublicProfileCard className="absolute bottom-0 left-[57px] z-20 w-[249px]" />
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
