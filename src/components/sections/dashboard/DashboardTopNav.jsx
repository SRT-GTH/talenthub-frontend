import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import CommunityIcon from '../community/CommunityIcon.jsx';
import { icons } from '../community/communityIcons.js';
import { TOP_NAV } from './dashboardData.js';
import DashboardSearchSheet from './DashboardSearchSheet.jsx';
import gthLogo from '../../../assets/engagement/GTHLogo 1.svg';
import avatarNav from '../../../assets/community/avatar-recruiter-nav.svg';
import {
  TalentNavProfileAvatarIllustration,
  TalentNavStreakPlayfulFigureIcon,
} from '../../shared/assets.jsx';
import StyleSwitch from '../../ui/StyleSwitch.jsx';
import { getTalentNavData, getTalentSidebarData } from '../talentHome/talentShellData.js';
import TalentA11yMenu from '../talentHome/TalentA11yMenu.jsx';

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

const NavIconButton = ({ src, label, badge, onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={classNames(
      'relative inline-flex size-[36px] max-lg:size-[40px] shrink-0 items-center justify-center rounded-[18px] max-lg:rounded-[20px] bg-[#f8fafc] transition-colors hover:bg-[#eef2f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      className
    )}
  >
    <CommunityIcon src={src} size={src === icons.navMessage ? 18 : 16} />
    {badge && (
      <span className="absolute -top-[1.5px] left-[22.67px] max-lg:left-[26px] max-lg:top-[2px] inline-flex size-[16px] max-lg:size-auto max-lg:h-[18px] max-lg:min-w-[18px] max-lg:px-[4px] max-lg:leading-none items-center justify-center overflow-hidden rounded-[100px] border-[1.5px] border-white bg-danger font-sans text-[10px] max-lg:text-[12px] font-semibold leading-5 tracking-[0.2px] text-white">
        {badge}
      </span>
    )}
  </button>
);

/*
 * Talent variant (`/home`, Figma `Nav` 8315:461634): pass `talentHome` (useTalentHomeState()).
 * Everything talent-specific is gated on it — recruiter/community pages never pass it and render
 * byte-identically. Adds: search opens the global search (⌘K / Ctrl+K), style switch, Playful streak
 * mark, per-state streak/counts, accessibility toggle (`a11y` param), talent avatar.
 */
const DashboardTopNav = ({ className, talentHome }) => {
  const isTalent = Boolean(talentHome);
  // Playful complete/top frames draw a lime-gradient avatar; day 1/discoverable a softer #7aa870 one.
  const talentFlat = isTalent && Boolean(getTalentSidebarData(talentHome.stateKey).flat);
  const nav = isTalent ? { ...TOP_NAV, ...getTalentNavData(talentHome.stateKey) } : TOP_NAV;
  // Phone-only: the inline search field is `md:flex`, so < md gets an icon
  // button that opens DashboardSearchSheet instead.
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!isTalent) return undefined;
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        log('⌘K → open global search');
        talentHome.update({ search: true });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isTalent, talentHome]);

  const handleAction = (action) => {
    // Every control here is presentational in this build — no destination
    // screens exist yet — so log the intent instead of silently doing nothing.
    log('nav action (no destination wired yet):', action);
  };

  return (
    <header
      className={classNames(
        'relative z-30 flex w-full items-center justify-between gap-4 border-b border-[#e7e7e7] bg-white shadow-bottom-100',
        'px-[clamp(16px,3.24vw,56px)] py-[12px] max-md:py-[8px]',
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
            className="block h-[clamp(44px,3.82vw,66px)] max-md:h-[36px] w-auto select-none"
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
            readOnly={isTalent}
            onClick={isTalent ? () => talentHome.update({ search: true }) : undefined}
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
        {isTalent && (
          <StyleSwitch className="max-md:hidden max-lg:[&_button>span]:sr-only lg:-mr-[4px]" />
        )}
        <div className="flex items-center gap-[12px] max-md:gap-[8px]">
          {/* Phone only — opens the full-width search sheet (the inline field is md+). */}
          <button
            type="button"
            aria-label="Search"
            aria-haspopup="dialog"
            onClick={() => {
              log('search sheet: open');
              if (isTalent) talentHome.update({ search: true });
              else setSearchOpen(true);
            }}
            className="relative inline-flex size-[36px] shrink-0 items-center justify-center rounded-[18px] bg-[#f8fafc] transition-colors after:absolute after:-inset-1 hover:bg-[#eef2f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green md:hidden"
          >
            <CommunityIcon src={icons.navSearch} size={20} />
          </button>

          <span
            className={classNames(
              'inline-flex items-center gap-[6px] overflow-hidden rounded-[100px] px-[12px] py-[8px] max-md:py-[2px]',
              isTalent ? 'bg-[#faf4e8]' : 'bg-accent-light'
            )}
          >
            <CommunityIcon
              src={icons.streakFire}
              size={20}
              className={isTalent ? 'playful:hidden' : undefined}
            />
            {isTalent && (
              <TalentNavStreakPlayfulFigureIcon className="hidden size-[24px] shrink-0 select-none playful:block" />
            )}
            <span
              className={classNames(
                'font-sans text-[14px] font-semibold leading-6 tracking-[0.1px]',
                isTalent ? 'text-[#c8951a]' : 'text-accent'
              )}
            >
              {nav.streakCount}
            </span>
          </span>

          {/* md–lg keeps only notifications + messages (help / language / accessibility
              stay lg+); phones reach them through the tab bar's More sheet. */}
          <div className="hidden items-center gap-[8px] md:flex">
            <NavIconButton
              src={icons.navHelp}
              label="Help"
              className="max-lg:hidden"
              onClick={() => handleAction('help')}
            />
            <NavIconButton
              src={icons.navNotification}
              label={`Notifications, ${nav.notificationCount} unread`}
              badge={nav.notificationCount}
              onClick={() => handleAction('notifications')}
            />
            <NavIconButton
              src={icons.navMessage}
              label={`Messages, ${nav.messageCount} unread`}
              badge={nav.messageCount}
              onClick={() => handleAction('messages')}
            />

            <button
              type="button"
              onClick={() => handleAction('language')}
              className="inline-flex h-[36px] items-center gap-[7px] overflow-hidden rounded-[99px] bg-[#f8fafc] py-[8px] pl-[12px] pr-[10px] max-lg:hidden transition-colors hover:bg-[#eef2f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              <CommunityIcon src={icons.navGlobe} size={16} />
              <span className="font-sans text-[13px] font-semibold text-neutral-dark">
                {TOP_NAV.language}
              </span>
              <CommunityIcon src={icons.navCaret} size={14} />
            </button>

            {isTalent ? (
              <TalentA11yMenu home={talentHome} />
            ) : (
              <button
                type="button"
                onClick={() => handleAction('accessibility')}
                aria-label="Accessibility mode"
                className="inline-flex size-[38px] items-center justify-center overflow-hidden rounded-[99px] bg-[#f8fafc] max-lg:hidden transition-colors hover:bg-[#eef2f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              >
                <CommunityIcon src={icons.navAccessibility} size={20} />
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleAction('profile-menu')}
          aria-label={`Profile menu, ${nav.profileName}`}
          /* Phones: collapse to a 44px avatar-only button (the name + caret
             don't fit beside the logo, search and streak at 320). */
          className="inline-flex shrink-0 items-center gap-[7px] rounded-[10px] border border-brand-green-light-active bg-[#fffefc] px-[16px] py-[8px] max-md:relative max-md:size-[32px] max-md:justify-center max-md:rounded-[16px] max-md:p-0 max-md:after:absolute max-md:after:-inset-2 transition-colors hover:bg-brand-green-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <span
            aria-hidden="true"
            className={classNames(
              'relative size-[24px] shrink-0 overflow-hidden rounded-[12px]',
              isTalent &&
                (talentFlat
                  ? 'bg-[#387440] playful:bg-[linear-gradient(135deg,#387440_14.637%,#84cc16_85.349%)]'
                  : 'bg-[#387440] playful:bg-[linear-gradient(135deg,#387440_14.637%,#7aa870_85.349%)]')
            )}
            style={
              isTalent
                ? undefined
                : { backgroundImage: 'linear-gradient(135deg, #387440 14.637%, #84cc16 85.349%)' }
            }
          >
            {isTalent ? (
              <TalentNavProfileAvatarIllustration className="absolute -bottom-[3px] left-1/2 h-[28px] w-[27px] max-w-none -translate-x-1/2 select-none" />
            ) : (
              <img
                src={avatarNav}
                alt=""
                draggable="false"
                className="absolute -bottom-[3px] left-1/2 h-[28px] w-[27px] max-w-none -translate-x-1/2 select-none"
              />
            )}
          </span>
          <span className="font-sans text-[14px] font-medium leading-6 tracking-[0.2px] text-black max-md:hidden">
            {nav.profileName}
          </span>
          <CommunityIcon src={icons.navChipCaret} size={14} className="max-md:hidden" />
        </button>
      </div>

      <DashboardSearchSheet isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
};

export default DashboardTopNav;
