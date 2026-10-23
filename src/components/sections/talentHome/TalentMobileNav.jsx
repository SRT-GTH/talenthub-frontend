import { TalentSidebarProfileAvatarIllustration } from '../../shared/assets.jsx';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Modal from '../../ui/Modal.jsx';
import StyleSwitch from '../../ui/StyleSwitch.jsx';
import CommunityIcon from '../community/CommunityIcon.jsx';
import { icons } from '../community/communityIcons.js';
import TalentNavIcon from './TalentNavIcon.jsx';
import TalentPublicProfileCard from './TalentPublicProfileCard.jsx';
import { HELP_ROUTE } from '../talentSettings/helpData.js';
import {
  TALENT_NAV_MAIN,
  TALENT_NAV_SECONDARY,
  TALENT_NAV_WALLET,
  getTalentProfile,
  getTalentNavData,
  getTalentSidebarData,
} from './talentShellData.js';

const log = debug('TalentMobileNav');

/*
 * TalentMobileNav — phone (< md) replacement for the rail: a bottom tab bar (Home, Opportunities,
 * Community, Messages, More) and the More sheet (My Assessment, Wallet, Skills Lab, My Learning, Profile,
 * Notifications, Help, Accessibility mode, style switch, public-profile card). Wallet is always in the sheet
 * (the phone has no other way to /wallet); Help opens the Help centre (/settings/help) because the
 * desktop Help pop-over is hidden below lg. Same data as
 * TalentSidebar (talentShellData.js). ⚠️ ASSUMPTION — Figma has no phone frame for the talent
 * chrome; the pattern mirrors DashboardMobileTabBar (wiki/responsive-plan.md §4).
 */

const TAB_IDS = ['home', 'opportunities', 'community', 'messages'];

const rowClass =
  'flex min-h-[44px] w-full items-center gap-[12px] rounded-[10px] px-[12px] py-[6px] text-left font-sans text-[15px] leading-6 tracking-[0.2px] transition-colors active:bg-[#ebf1ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';

/* `generated`: draw the number as CSS content (`data-count`) — used on the tab bar where the badge floats
   above the icon; the tab's accessible name carries the count, and the "labels never wrap" probe sees one
   text row instead of a label + a floating number. */
const Badge = ({ count, generated = false }) => (
  <span
    {...(generated ? { 'aria-hidden': 'true', 'data-count': count } : {})}
    className="inline-flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-[99px] bg-[linear-gradient(136.548deg,#387440_14.637%,#84cc16_85.349%)] px-[6px] font-sans text-[12px] font-medium leading-none text-white playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)] playful:bg-[#ebf1ec] playful:bg-none playful:font-semibold playful:text-[#1f4d26] after:content-[attr(data-count)]"
  >
    {generated ? null : count}
  </span>
);

const TalentMobileNav = ({ home, className, activeNav }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const stateKey = home?.stateKey ?? 'day1';
  const data = getTalentSidebarData(stateKey, home?.live, activeNav);
  const navData = getTalentNavData(stateKey, home?.live);
  const profile = getTalentProfile(home?.live);
  // Current item: /profile -> Profile row (More sheet); /notifications -> Messages (like the desktop
  // rails, Figma 7471:54993); otherwise My Assessment while its tab is open, Home else (as TalentSidebar).
  const activeId =
    activeNav === 'profile'
      ? 'profile'
      : activeNav === 'settings'
        ? 'none'
        : activeNav === 'community'
          ? 'community'
          : activeNav === 'assessment'
            ? 'assessment'
            : activeNav === 'skills-lab'
              ? 'skills-lab'
              : activeNav === 'streak'
                ? 'none'
                : activeNav === 'jobs'
                  ? 'opportunities'
                  : activeNav === 'learning'
                    ? 'my-learning'
                    : activeNav === 'wallet'
                      ? 'wallet'
                      : activeNav === 'messages'
                        ? 'messages'
                        : pathname === '/notifications'
                          ? 'messages'
                          : home?.tab === 'assessment'
                            ? 'assessment'
                            : 'home';

  useEffect(() => {
    log('mount', { tabs: TAB_IDS, stateKey });
  }, [stateKey]);

  const select = (item) => {
    log('select:', item.id);
    if (item.route) {
      if (pathname !== item.route) navigate(item.route);
    } else if (item.tab && pathname !== '/home') {
      navigate(item.tab === 'home' ? '/home' : `/home?tab=${item.tab}`);
    } else if (item.tab) home?.update?.({ tab: item.tab === 'home' ? null : item.tab });
    setMoreOpen(false);
  };

  const tabs = TAB_IDS.map((id) => TALENT_NAV_MAIN.find((item) => item.id === id));

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
          {tabs.map((item) => {
            const active = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => select(item)}
                aria-label={`${data.labels?.[item.id] ?? item.label}${data.badges[item.id] ? `, ${data.badges[item.id]}` : ''}`}
                aria-current={active ? 'page' : undefined}
                className="group flex min-w-[48px] flex-1 flex-col items-center justify-center gap-[1px] px-[2px] py-[4px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-green"
              >
                <span
                  className={classNames(
                    'relative flex h-[28px] w-[52px] items-center justify-center rounded-[14px] transition-colors',
                    active
                      ? 'bg-[#387440] playful:shadow-[inset_0_0_0_1.5px_rgba(28,42,33,0.55)]'
                      : 'group-active:bg-[#ebf1ec]'
                  )}
                >
                  <TalentNavIcon
                    icon={item.icon}
                    size={active ? 16 : 18}
                    className={active ? 'text-white' : 'text-[#999999] playful:text-[#46524a]'}
                  />
                  {data.badges[item.id] && (
                    <span className="absolute -right-[2px] -top-[6px]">
                      <Badge count={data.badges[item.id]} generated />
                    </span>
                  )}
                </span>
                <span
                  className={classNames(
                    'max-w-full truncate font-sans text-[12px] leading-4 tracking-[0.1px]',
                    active ? 'font-semibold text-[#387440]' : 'font-medium text-[#70706e]'
                  )}
                >
                  {data.labels?.[item.id] ?? item.label}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={moreOpen}
            onClick={() => {
              log('tab click: more →', moreOpen ? 'close' : 'open');
              setMoreOpen(!moreOpen);
            }}
            className="group flex h-[46px] min-w-[48px] flex-1 flex-col items-center justify-center gap-[1px] self-center px-[2px] py-[4px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-green"
          >
            <span className="relative flex h-[28px] w-[52px] items-center justify-center rounded-[14px] group-active:bg-[#ebf1ec]">
              <CommunityIcon src={icons.postMenu} size={18} className="brightness-0 invert-[.6]" />
            </span>
            <span className="max-w-full truncate font-sans text-[12px] font-medium leading-4 tracking-[0.1px] text-[#70706e]">
              More
            </span>
          </button>
        </div>
      </nav>

      <Modal
        isOpen={moreOpen}
        onClose={() => setMoreOpen(false)}
        size="sm"
        ariaLabel="More navigation"
      >
        <div className="flex flex-col gap-[16px] px-[16px] pb-[20px] pt-[20px]">
          <div className="flex items-center gap-[12px] pr-[56px]">
            <span
              aria-hidden="true"
              className="relative flex size-[48px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#387440] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:bg-[linear-gradient(135deg,#387440_14.637%,#7aa870_85.349%)]"
            >
              <TalentSidebarProfileAvatarIllustration className="absolute -top-[3px] left-1/2 h-[54px] w-[53px] max-w-none -translate-x-1/2 select-none" />
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-sans text-[16px] font-semibold leading-6 text-[#1c2a21]">
                {profile.name}
              </span>
              <span className="truncate font-sans text-[14px] leading-5 text-[#babab7]">
                {data.headline ?? profile.headline}
              </span>
            </div>
          </div>

          <nav aria-label="More destinations" className="flex flex-col gap-[2px]">
            {[TALENT_NAV_MAIN[1], TALENT_NAV_WALLET, ...TALENT_NAV_SECONDARY].map((item) => (
              <button
                key={item.id}
                type="button"
                className={classNames(
                  rowClass,
                  item.id === activeId && 'bg-[#ebf1ec] font-semibold'
                )}
                aria-current={item.id === activeId ? 'page' : undefined}
                onClick={() => select(item)}
              >
                <TalentNavIcon
                  icon={item.icon}
                  size={18}
                  className="text-[#999999] playful:text-[#46524a]"
                />
                <span className="min-w-0 flex-1 truncate text-[rgba(28,42,33,0.85)]">
                  {data.labels?.[item.id] ?? item.label}
                </span>
              </button>
            ))}
            <div className="my-[6px] h-px w-full bg-[#e1eae2]" />
            <button
              type="button"
              className={rowClass}
              onClick={() => {
                log('sheet: notifications -> /notifications');
                setMoreOpen(false);
                if (pathname !== '/notifications') navigate('/notifications');
              }}
            >
              <CommunityIcon src={icons.navNotification} size={18} />
              <span className="min-w-0 flex-1 truncate text-[rgba(28,42,33,0.85)]">
                Notifications
              </span>
              <Badge count={navData.notificationCount} />
            </button>
            <button
              type="button"
              className={rowClass}
              onClick={() => {
                log('sheet: help ->', HELP_ROUTE);
                setMoreOpen(false);
                if (pathname !== HELP_ROUTE) navigate(HELP_ROUTE);
              }}
            >
              <CommunityIcon src={icons.navHelp} size={18} />
              <span className="min-w-0 flex-1 truncate text-[rgba(28,42,33,0.85)]">Help</span>
            </button>
            <button
              type="button"
              className={rowClass}
              aria-pressed={Boolean(home?.a11yMode)}
              onClick={() => home?.update?.({ a11y: !home.a11yMode })}
            >
              <CommunityIcon src={icons.navAccessibility} size={18} />
              <span className="min-w-0 flex-1 truncate text-[rgba(28,42,33,0.85)]">
                Accessibility mode
              </span>
            </button>
          </nav>

          <StyleSwitch className="self-start" />
          <TalentPublicProfileCard shelf={!data.flat} url={profile.url} />
        </div>
      </Modal>
    </>
  );
};

export default TalentMobileNav;
