import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import CommunityIcon from './CommunityIcon.jsx';
import { icons } from './communityIcons.js';
import { SIDEBAR_PROFILE, SIDEBAR_PUBLIC_PROFILE } from './communityData.js';
import avatarLarge from '../../../assets/community/avatar-recruiter-large.svg';

const log = debug('CommunitySidebar');

/*
 * CommunitySidebar — the left rail, in BOTH states Figma ships:
 *
 *   expanded  (339px) → Figma 7025:85256  — used on the community index
 *   collapsed (126px) → Figma 7025:86125  — used on the community detail
 *
 * The `ep:d-arrow-left` chevron in the rail's top-right toggles between them
 * (Figma 7025:85366 pointing left, 7025:86231 mirrored pointing right), so
 * both states are reachable from either page.
 *
 * `⚠️ ASSUMPTION` — Figma's expanded frame leaves the icon slots for
 * "Messages" (7025:85344) and "Profile" (7025:85353) EMPTY. The collapsed
 * frame supplies both glyphs, so those are reused here rather than leaving
 * two blank squares. Flagged for the manual Figma pass.
 *
 * ROLE NOTE — every label here is recruiter-specific and comes straight from
 * Figma; there is no talent/parent variant in the file. See the role note in
 * communityData.js.
 */

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: icons.navHome, collapsedIcon: icons.navHomeCollapsed },
  {
    id: 'talent-search',
    label: 'Talent Search',
    icon: icons.navTalentSearch,
    collapsedIcon: icons.navTalentSearchCollapsed,
  },
  {
    id: 'job-postings',
    label: 'Job Postings',
    icon: icons.navJobPostings,
    collapsedIcon: icons.navJobPostingsCollapsed,
    badge: '5',
  },
  {
    id: 'community',
    label: 'Community',
    icon: icons.navCommunityActive,
    collapsedIcon: icons.navCommunityActiveCollapsed,
    to: '/community',
    active: true,
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: icons.navMessages,
    collapsedIcon: icons.navMessages,
    badge: '3',
  },
  {
    id: 'application-pipeline',
    label: 'Application Pipeline',
    icon: icons.navApplicationPipeline,
    collapsedIcon: icons.navApplicationPipelineCollapsed,
  },
];

const SECONDARY_NAV_ITEMS = [
  { id: 'profile', label: 'Profile', icon: icons.navProfile, collapsedIcon: icons.navProfile },
];

const GREEN_GRADIENT = 'linear-gradient(171.84deg, #387440 14.637%, #84cc16 85.349%)';
const BADGE_GRADIENT = 'linear-gradient(136.55deg, #387440 14.637%, #84cc16 85.349%)';

const NavBadge = ({ count, className, style }) => (
  <span
    className={classNames(
      'inline-flex h-[18px] items-center justify-center overflow-hidden rounded-[99px] px-[6px] py-[2px] font-sans text-[10px] font-medium text-white',
      className
    )}
    style={{ backgroundImage: BADGE_GRADIENT, ...style }}
  >
    {count}
  </span>
);

const ExpandedNavItem = ({ item, onNavigate }) => {
  const content = (
    <>
      <span className="flex w-[20px] shrink-0 items-center justify-center">
        <CommunityIcon src={item.icon} size={18} />
      </span>
      <span
        className={classNames(
          'min-w-0 flex-1 text-left font-sans text-[14px] leading-6 tracking-[0.2px]',
          item.active ? 'text-brand-green-light' : 'text-neutral-dark-active'
        )}
      >
        {item.label}
      </span>
      {item.badge && <NavBadge count={item.badge} />}
    </>
  );

  const shared = classNames(
    'flex w-full items-center gap-[11px] rounded-[10px] px-[12px] py-[10px] transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
    !item.active && 'hover:bg-brand-green-light'
  );
  const style = item.active ? { backgroundImage: GREEN_GRADIENT } : undefined;

  if (item.to) {
    return (
      <Link
        to={item.to}
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
    <button type="button" className={shared} style={style} onClick={() => onNavigate(item.id)}>
      {content}
    </button>
  );
};

const CollapsedNavItem = ({ item, onNavigate }) => {
  const content = (
    <>
      <CommunityIcon src={item.collapsedIcon} size={item.active ? 18 : 20} />
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

/* Public-profile card. In the expanded rail it is always visible (7025:85355).
 * In the collapsed rail only the link icon shows (7025:86227) and the full card
 * appears as a popover — Figma annotation on 7025:87865:
 *   "Appears when link Icon is hovered or clicked." */
const PublicProfileCard = ({ className, style }) => (
  <div
    /* Width is set by the caller (`w-full` in the expanded rail, a fixed
       249px for the collapsed rail's popover) — `classNames` is a plain join,
       not tailwind-merge, so no width class may live in the base list. */
    className={classNames(
      'flex flex-col items-start gap-[10px] overflow-hidden rounded-[12px] border border-neutral bg-white p-[12px]',
      className
    )}
    style={style}
  >
    <div className="flex w-full items-center gap-[6px] rounded-[8px] bg-brand-green-light px-[10px] py-[8px]">
      <CommunityIcon src={icons.linkOutlined} size={16} />
      <span className="font-sans text-[13px] font-medium leading-[18px] tracking-[0.2px] text-brand-green">
        {SIDEBAR_PUBLIC_PROFILE.heading}
      </span>
    </div>
    <p className="w-full font-mono text-[10px] leading-4 tracking-[0.2px] text-brand-green-hover">
      {SIDEBAR_PUBLIC_PROFILE.url}
    </p>
    <button
      type="button"
      onClick={() => log('preview as talent clicked (no destination wired yet)')}
      className="flex h-[36px] w-full items-center justify-center gap-[6px] rounded-[8px] border border-brand-green-light-active bg-white px-[12px] py-[6px] transition-colors hover:bg-brand-green-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
    >
      <span className="font-sans text-[13px] font-semibold leading-[18px] tracking-[0.2px] text-brand-green">
        {SIDEBAR_PUBLIC_PROFILE.action}
      </span>
      <span className="inline-flex -scale-y-100 rotate-180 items-center justify-center">
        <CommunityIcon src={icons.arrowUpLeft} size={16} />
      </span>
    </button>
  </div>
);

const CommunitySidebar = ({ collapsed, onToggle, className }) => {
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

  const toggleButton = (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      aria-expanded={!collapsed}
      className={classNames(
        'absolute top-[22px] z-10 inline-flex items-center justify-center rounded-[6px] p-[2px] transition-colors hover:bg-brand-green-light',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
        collapsed ? 'right-[8px]' : 'right-[14px]'
      )}
    >
      <CommunityIcon
        src={collapsed ? icons.collapseRight : icons.collapseLeft}
        size={collapsed ? 19 : 23}
        className={collapsed ? '!h-[16px]' : '!h-[20px]'}
      />
    </button>
  );

  if (collapsed) {
    return (
      <aside
        className={classNames(
          'relative flex w-[126px] shrink-0 flex-col items-center justify-between border-r-2 border-white bg-white px-[12px] py-[60px]',
          className
        )}
        aria-label="Community navigation"
      >
        {toggleButton}

        <div className="flex min-h-0 flex-col items-center gap-[20px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Avatar puck — 3px brand ring + "New" badge (7025:86127) */}
          <div className="relative flex flex-col items-center justify-center gap-[16px] rounded-[1000px] border-[3px] border-[#468438] bg-white p-[6px]">
            <span
              className="flex size-[62px] items-center justify-center overflow-hidden rounded-[31px]"
              style={{
                backgroundImage: 'linear-gradient(135deg, #387440 14.637%, #84cc16 85.349%)',
              }}
            >
              <img
                src={avatarLarge}
                alt={SIDEBAR_PROFILE.name}
                draggable="false"
                className="h-[70px] w-[69px] max-w-none select-none"
              />
            </span>
            <span className="absolute -right-[46px] top-[5px] inline-flex h-[18px] items-center gap-[3px] overflow-hidden rounded-[4px] bg-informative-light px-[4px] py-[2px]">
              <CommunityIcon src={icons.newBadge} size={8} />
              <span className="font-sans text-[9px] font-medium tracking-[0.2px] text-informative-dark">
                {SIDEBAR_PROFILE.badge}
              </span>
            </span>
          </div>

          <nav className="flex flex-col items-start gap-[12px] overflow-hidden pt-[6px]">
            <div className="flex flex-col items-start gap-[4px]">
              {NAV_ITEMS.map((item) => (
                <CollapsedNavItem key={item.id} item={item} onNavigate={handleNavigate} />
              ))}
            </div>
            <div className="h-px w-full rounded-[30px] bg-brand-green-light-hover" />
            {SECONDARY_NAV_ITEMS.map((item) => (
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
            <PublicProfileCard className="absolute bottom-0 left-[57px] z-20 w-[249px] shadow-bottom-300" />
          )}
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={classNames(
        'relative flex w-[clamp(280px,19.62vw,339px)] shrink-0 flex-col items-center justify-end gap-[28px] border-r-2 border-white bg-white px-[16px] pb-[48px] pt-[60px]',
        className
      )}
      aria-label="Community navigation"
    >
      {toggleButton}

      {/* Profile card. Every child carries shrink-0 (as Figma's own auto-layout
          does) — without it the flex column squashes the getting-started block
          to zero height whenever the rail is short on space. */}
      <div className="flex w-full shrink-0 flex-col items-center justify-center gap-[16px] overflow-hidden rounded-[16px] border-2 border-brand-green-light-hover bg-white px-[12px] py-[18px]">
        <span
          className="flex size-[62px] shrink-0 items-center justify-center overflow-hidden rounded-[31px]"
          style={{ backgroundImage: 'linear-gradient(135deg, #387440 14.637%, #84cc16 85.349%)' }}
        >
          <img
            src={avatarLarge}
            alt={SIDEBAR_PROFILE.name}
            draggable="false"
            className="h-[70px] w-[69px] max-w-none select-none"
          />
        </span>

        <div className="flex shrink-0 flex-col items-center gap-[7px]">
          <div className="flex items-center gap-[5px] overflow-hidden">
            <span className="font-sans text-[14px] font-semibold leading-6 tracking-[0.2px] text-black">
              {SIDEBAR_PROFILE.name}
            </span>
            <span className="inline-flex h-[18px] items-center gap-[3px] overflow-hidden rounded-[4px] bg-informative-light py-[2px] pl-[6px] pr-[7px]">
              <CommunityIcon src={icons.newBadge} size={8} />
              <span className="font-sans text-[10px] font-semibold leading-5 tracking-[0.2px] text-informative-dark">
                {SIDEBAR_PROFILE.badge}
              </span>
            </span>
          </div>
          <p className="text-center font-sans text-[12.5px] leading-[18px] tracking-[0.2px] text-neutral-dark-hover">
            {SIDEBAR_PROFILE.meta}
          </p>
          <div className="flex items-center gap-[5px] overflow-hidden">
            <CommunityIcon src={icons.dotProgress} size={4} />
            <span className="font-sans text-[12px] font-medium leading-4 tracking-[0.2px] text-brand-green">
              {SIDEBAR_PROFILE.progressNote}
            </span>
          </div>
        </div>

        {/* Getting started progress */}
        <div className="flex w-full max-w-[250px] shrink-0 flex-col items-start justify-center gap-[6px] overflow-hidden border-t border-neutral-light">
          <div className="flex w-full items-center justify-between overflow-hidden tracking-[0.2px]">
            <span className="font-sans text-[13px] font-semibold leading-5 text-black">
              {SIDEBAR_PROFILE.gettingStartedLabel}
            </span>
            <span className="font-sans text-[11px] font-medium leading-4 text-neutral-dark">
              {SIDEBAR_PROFILE.gettingStartedCount}
            </span>
          </div>
          <div
            className="flex h-[7px] w-full overflow-hidden rounded-[4px] bg-brand-green-light/50"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(SIDEBAR_PROFILE.gettingStartedPercent)}
            aria-label={SIDEBAR_PROFILE.gettingStartedLabel}
          >
            <span
              className="h-[7px] rounded-[4px]"
              style={{
                width: `${SIDEBAR_PROFILE.gettingStartedPercent}%`,
                backgroundImage: 'linear-gradient(171.7deg, #387440 14.637%, #84cc16 85.349%)',
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => log('continue setup clicked (no destination wired yet)')}
            className="font-sans text-[12px] leading-4 tracking-[0.2px] text-neutral-dark-active hover:text-brand-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            {SIDEBAR_PROFILE.continueLabel}
          </button>
        </div>

        {/* Stats strip */}
        <div className="flex shrink-0 items-center justify-center gap-[4px] rounded-[10px] border border-accent-light bg-brand-green-light/50 px-[8px] py-[10px]">
          {SIDEBAR_PROFILE.stats.map((stat, index) => (
            <div key={stat.id} className="flex items-center">
              {index > 0 && <span className="mr-[4px] h-[28px] w-px bg-brand-green-light" />}
              <div className="flex w-[60px] flex-col items-center justify-center gap-[2px] overflow-hidden px-[2px] text-center">
                <span className="font-sans text-[12px] font-semibold leading-5 tracking-[0.2px] text-brand-green">
                  {stat.value}
                </span>
                <span className="font-sans text-[11px] text-[#999]">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      {/* The nav is the only flexible band — the profile card and the
          public-profile card are shrink-0, so a short viewport scrolls here
          instead of silently clipping either card. */}
      <nav className="flex min-h-0 w-full flex-col items-start gap-[12px] overflow-y-auto pt-[6px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-full flex-col items-start gap-[4px]">
          {NAV_ITEMS.map((item) => (
            <ExpandedNavItem key={item.id} item={item} onNavigate={handleNavigate} />
          ))}
        </div>
        <div className="h-px w-full rounded-[30px] bg-brand-green-light-hover" />
        <div className="flex w-full flex-col items-start gap-[4px]">
          {SECONDARY_NAV_ITEMS.map((item) => (
            <ExpandedNavItem key={item.id} item={item} onNavigate={handleNavigate} />
          ))}
        </div>
      </nav>

      <PublicProfileCard className="w-full shrink-0" />
    </aside>
  );
};

export default CommunitySidebar;
