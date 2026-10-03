import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import CommunityIcon from '../community/CommunityIcon.jsx';
import { icons } from '../community/communityIcons.js';
import { TOP_NAV } from './dashboardData.js';
import gthLogo from '../../../assets/engagement/GTHLogo 1.svg';
import avatarNav from '../../../assets/community/avatar-recruiter-nav.svg';

const log = debug('DashboardTopNav');

/*
 * DashboardTopNav — the dashboard-style top bar on every community screen.
 * Source: Figma `7025:85392` (identical instance on all ten frames).
 *
 * Layout: logo + global search (⌘K badge) on the left; streak pill, help /
 * notifications / messages icon buttons, language switcher, accessibility
 * toggle and the profile chip on the right.
 *
 * Deliberately NOT `EngagementTopNav` — that header is the profile-filling
 * chrome (Save & Exit + help + user chip, no search, no notification cluster).
 * Figma's community header shares only the logo, so a separate component is
 * correct rather than bending EngagementTopNav with flags. It does reuse the
 * same committed logo asset (`assets/engagement/GTHLogo 1.svg`).
 *
 * Figma geometry: h 87, px 56, py 12, bottom border #e7e7e7 + bottom.100 shadow.
 * Horizontal padding + logo height are clamped so the bar scales down.
 */

const NavIconButton = ({ src, label, badge, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="relative inline-flex size-[36px] shrink-0 items-center justify-center rounded-[18px] bg-[#f8fafc] transition-colors hover:bg-[#eef2f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
  >
    <CommunityIcon src={src} size={src === icons.navMessage ? 18 : 16} />
    {badge && (
      <span className="absolute -top-[1.5px] left-[22.67px] inline-flex size-[16px] items-center justify-center overflow-hidden rounded-[100px] border-[1.5px] border-white bg-danger font-sans text-[10px] font-semibold leading-5 tracking-[0.2px] text-white">
        {badge}
      </span>
    )}
  </button>
);

const DashboardTopNav = ({ className }) => {
  const handleAction = (action) => {
    // Every control here is presentational in this build — no destination
    // screens exist yet — so log the intent instead of silently doing nothing.
    log('nav action (no destination wired yet):', action);
  };

  return (
    <header
      className={classNames(
        'relative z-30 flex w-full items-center justify-between gap-4 border-b border-[#e7e7e7] bg-white shadow-bottom-100',
        'px-[clamp(16px,3.24vw,56px)] py-[12px]',
        className
      )}
    >
      {/* Left: logo + global search */}
      <div className="flex min-w-0 flex-1 items-center gap-[clamp(16px,1.97vw,34px)]">
        <Link
          to={'/'}
          aria-label="Ghana Talent Hub home"
          className="inline-flex shrink-0 items-center rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <img
            src={gthLogo}
            alt="Ghana Talent Hub"
            draggable="false"
            className="block h-[clamp(44px,3.82vw,66px)] w-auto select-none"
          />
        </Link>

        <label className="relative hidden min-w-0 max-w-[553px] flex-1 items-center gap-[12px] overflow-hidden rounded-[8px] border border-[#dfdfdc] bg-white py-[10px] pl-[14px] pr-[12px] shadow-[inset_0px_1px_2px_0px_rgba(0,0,0,0.08)] md:flex">
          <span className="sr-only">{TOP_NAV.searchPlaceholder}</span>
          <span className="flex size-[28px] shrink-0 items-center justify-center rounded-[14px]">
            <CommunityIcon src={icons.navSearch} size={20} />
          </span>
          <input
            type="search"
            placeholder={TOP_NAV.searchPlaceholder}
            onChange={(event) => log('global search input:', event.target.value.length, 'chars')}
            className="min-w-0 flex-1 bg-transparent font-sans text-[14px] leading-5 tracking-[0.2px] text-black outline-none placeholder:text-[#bfbfbf]"
          />
          <span className="inline-flex shrink-0 items-center rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] py-[6px] font-sans text-[12px] font-semibold text-[#2d5d33] shadow-bottom-100">
            {TOP_NAV.shortcut}
          </span>
        </label>
      </div>

      {/* Right: streak, utility icons, language, accessibility, profile chip */}
      <div className="flex shrink-0 items-center gap-[clamp(10px,1.39vw,24px)]">
        <div className="flex items-center gap-[12px]">
          <span className="inline-flex items-center gap-[6px] overflow-hidden rounded-[100px] bg-accent-light px-[12px] py-[8px]">
            <CommunityIcon src={icons.streakFire} size={20} />
            <span className="font-sans text-[14px] font-semibold leading-6 tracking-[0.1px] text-accent">
              {TOP_NAV.streakCount}
            </span>
          </span>

          <div className="hidden items-center gap-[8px] lg:flex">
            <NavIconButton src={icons.navHelp} label="Help" onClick={() => handleAction('help')} />
            <NavIconButton
              src={icons.navNotification}
              label={`Notifications, ${TOP_NAV.notificationCount} unread`}
              badge={TOP_NAV.notificationCount}
              onClick={() => handleAction('notifications')}
            />
            <NavIconButton
              src={icons.navMessage}
              label={`Messages, ${TOP_NAV.messageCount} unread`}
              badge={TOP_NAV.messageCount}
              onClick={() => handleAction('messages')}
            />

            <button
              type="button"
              onClick={() => handleAction('language')}
              className="inline-flex h-[36px] items-center gap-[7px] overflow-hidden rounded-[99px] bg-[#f8fafc] py-[8px] pl-[12px] pr-[10px] transition-colors hover:bg-[#eef2f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              <CommunityIcon src={icons.navGlobe} size={16} />
              <span className="font-sans text-[13px] font-semibold text-neutral-dark">
                {TOP_NAV.language}
              </span>
              <CommunityIcon src={icons.navCaret} size={14} />
            </button>

            <button
              type="button"
              onClick={() => handleAction('accessibility')}
              aria-label="Accessibility mode"
              className="inline-flex size-[38px] items-center justify-center overflow-hidden rounded-[99px] bg-[#f8fafc] transition-colors hover:bg-[#eef2f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              <CommunityIcon src={icons.navAccessibility} size={20} />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleAction('profile-menu')}
          className="inline-flex shrink-0 items-center gap-[7px] rounded-[10px] border border-brand-green-light-active bg-[#fffefc] px-[16px] py-[8px] transition-colors hover:bg-brand-green-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <span
            aria-hidden="true"
            className="relative size-[24px] shrink-0 overflow-hidden rounded-[12px]"
            style={{ backgroundImage: 'linear-gradient(135deg, #387440 14.637%, #84cc16 85.349%)' }}
          >
            <img
              src={avatarNav}
              alt=""
              draggable="false"
              className="absolute -bottom-[3px] left-1/2 h-[28px] w-[27px] max-w-none -translate-x-1/2 select-none"
            />
          </span>
          <span className="font-sans text-[14px] font-medium leading-6 tracking-[0.2px] text-black">
            {TOP_NAV.profileName}
          </span>
          <CommunityIcon src={icons.navChipCaret} size={14} />
        </button>
      </div>
    </header>
  );
};

export default DashboardTopNav;
