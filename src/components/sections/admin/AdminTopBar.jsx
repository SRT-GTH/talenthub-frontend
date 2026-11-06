import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import gthLogo from '../../../assets/engagement/GTHLogo 1.svg';
import {
  AgencyAccessibilityIcon,
  AgencyBellIcon,
  AgencyBellMobileIcon,
  AgencyChartBarIcon,
  AgencyChevronDownIcon,
  AgencyGlobeIcon,
  AgencyHelpIcon,
  AgencyMessageIcon,
} from '../agency/agencyIcons.jsx';
import AdminSearch from './chrome/AdminSearch.jsx';
import { ADMIN_BASE } from './adminNav.js';

const log = debug('AdminTopBar');

/*
 * AdminTopBar — the top bar of the admin chrome (the agency top bar with staff data).
 *   >= lg : Figma "Nav" 8623:~ — h87 + 1px border, px56: logo 71x66 · search 553 "Search accounts, flags or IDs…" (⌘K badge) | help · notifications (5) ·
 *           messages (5) · EN · accessibility · profile chip "Akua S." (?modal=profile, nothing drawn for it yet)
 *   < lg  : the phone / tablet bar of the agency chrome — h73: menu button 48 · "GTH" · bell 48 · avatar 40 (⚠️ ASSUMPTION: no admin phone frame is drawn)
 * ⌘K (or Ctrl+K) focuses the search; it suggests pages, accounts and settings as you type (chrome/AdminSearch.jsx).
 * Each round button toggles ?modal=help|notifications|messages|a11y|language|profile; AdminFrame mounts the panel (chrome/AdminChromeOverlays).
 * Badges are the real unread counts (counts prop from useAdminCounts; hidden when zero or unknown, "9+" above nine).
 */

const ROUND =
  'relative flex shrink-0 items-center justify-center rounded-full bg-[#f8fafc] text-[#387440] transition-colors hover:bg-[#eef2f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const Badge = ({ count }) =>
  count > 0 ? (
    <span
      aria-hidden="true"
      className="absolute -top-[2px] left-[23px] flex size-[16px] items-center justify-center rounded-full border-[1.5px] border-solid border-white bg-[#c0392b] font-sans text-[10px] leading-[16px] font-semibold text-white"
    >
      {count > 9 ? '9+' : count}
    </span>
  ) : null;

const countLabel = (n, word) => (n > 0 ? `, ${n} ${word}` : n === 0 ? `, none ${word}` : '');

const AdminTopBar = ({ session, data, counts = {}, menuButtonRef, className }) => {
  const searchRef = useRef(null);
  const { staff } = session;
  const badges = { notifications: counts.notifications, messages: counts.messages };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        log('shortcut ⌘K');
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Toggle: the same button closes its panel.
  const open = (name) => data.update({ modal: data.modal === name ? null : name });
  const pressed = (name) => data.modal === name;

  return (
    <header
      className={classNames(
        'sticky top-0 z-30 border-b border-solid border-[#e7e7e7] bg-white shadow-[0_1px_2px_rgba(15,15,10,0.05)]',
        className
      )}
    >
      {/* phone + tablet */}
      <div className="flex h-[73px] items-center gap-[12px] px-[16px] lg:hidden">
        <button
          ref={menuButtonRef}
          type="button"
          aria-label="Open menu"
          aria-expanded={data.drawer}
          onClick={() => data.update({ drawer: true })}
          className="flex size-[48px] shrink-0 flex-col items-center justify-center gap-[4px] rounded-[10px] border border-solid border-[#e5e8e3] bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <span aria-hidden="true" className="h-[2px] w-[18px] rounded-[1px] bg-[#111111]" />
          <span aria-hidden="true" className="h-[2px] w-[18px] rounded-[1px] bg-[#111111]" />
          <span aria-hidden="true" className="h-[2px] w-[18px] rounded-[1px] bg-[#111111]" />
        </button>
        <Link
          to={ADMIN_BASE}
          className="min-w-0 flex-1 font-sans text-[20px] leading-[25px] font-semibold tracking-[-0.1px] text-[#111111] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          GTH
        </Link>
        <button
          type="button"
          data-admin-topbar-button=""
          aria-label={`Notifications${countLabel(badges.notifications, 'new')}`}
          aria-expanded={pressed('notifications')}
          onClick={() => open('notifications')}
          className="relative flex size-[48px] shrink-0 items-center justify-center rounded-[10px] border border-solid border-[#e5e8e3] bg-transparent text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <AgencyBellMobileIcon className="size-[20px]" />
          <Badge count={badges.notifications} />
        </button>
        <button
          type="button"
          data-admin-topbar-button=""
          aria-label={`Profile menu, ${staff.name}${countLabel(badges.messages, 'unread messages')}`}
          aria-haspopup="menu"
          aria-expanded={pressed('profile')}
          onClick={() => open('profile')}
          className="relative flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[#387440] font-sans text-[13px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {session.signedIn ? (
            staff.monogram
          ) : (
            <AgencyChartBarIcon className="size-[20px] text-white" />
          )}
          <Badge count={badges.messages} />
        </button>
      </div>

      {/* desktop (lg and up) */}
      <div className="hidden h-[87px] items-center gap-[clamp(16px,2vw,34px)] px-[clamp(24px,3.24vw,56px)] lg:flex">
        <Link
          to={ADMIN_BASE}
          aria-label="Ghana Talent Hub, admin home"
          className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <img src={gthLogo} alt="" className="block h-[66px] w-[71px] object-contain" />
        </Link>
        <AdminSearch ref={searchRef} role={session.role} initial={data.q || ''} />
        <div className="ml-auto flex items-center gap-[24px]">
          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              data-admin-topbar-button=""
              aria-label="Help"
              aria-expanded={pressed('help')}
              onClick={() => open('help')}
              className={classNames(ROUND, 'size-[36px]')}
            >
              <AgencyHelpIcon className="size-[16px]" />
            </button>
            <button
              type="button"
              data-admin-topbar-button=""
              aria-label={`Notifications${countLabel(badges.notifications, 'new')}`}
              aria-expanded={pressed('notifications')}
              onClick={() => open('notifications')}
              className={classNames(ROUND, 'size-[36px]')}
            >
              <AgencyBellIcon className="size-[16px]" />
              <Badge count={badges.notifications} />
            </button>
            <button
              type="button"
              data-admin-topbar-button=""
              aria-label={`Messages${countLabel(badges.messages, 'unread')}`}
              aria-expanded={pressed('messages')}
              onClick={() => open('messages')}
              className={classNames(ROUND, 'size-[36px]')}
            >
              <AgencyMessageIcon className="size-[18px]" />
              <Badge count={badges.messages} />
            </button>
            <button
              type="button"
              data-admin-topbar-button=""
              aria-label="Language, English"
              aria-expanded={pressed('language')}
              onClick={() => open('language')}
              className={classNames(ROUND, 'h-[36px] w-[83px] gap-[7px] px-[10px] pl-[12px]')}
            >
              <AgencyGlobeIcon className="size-[16px]" />
              <span className="font-sans text-[13px] leading-[16px] font-semibold text-[#babab7]">
                EN
              </span>
              <AgencyChevronDownIcon className="size-[14px] text-[#cccccc]" />
            </button>
            <button
              type="button"
              data-admin-topbar-button=""
              aria-label="Accessibility"
              aria-expanded={pressed('a11y')}
              onClick={() => open('a11y')}
              className={classNames(ROUND, 'size-[38px]')}
            >
              <AgencyAccessibilityIcon className="size-[20px]" />
            </button>
          </div>
          <button
            type="button"
            data-admin-topbar-button=""
            aria-haspopup="menu"
            aria-expanded={pressed('profile')}
            aria-label={`Profile menu, ${staff.shortName}`}
            onClick={() => open('profile')}
            className="flex h-[40px] shrink-0 items-center gap-[7px] rounded-[10px] border border-solid border-[#c1d4c4] bg-[#fffefc] px-[16px] py-[8px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <span
              aria-hidden="true"
              className="flex size-[24px] items-center justify-center rounded-full bg-[#387440] font-sans text-[10px] leading-[12px] font-semibold text-white"
            >
              {staff.monogram}
            </span>
            <span className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]">
              {staff.shortName}
            </span>
            <AgencyChevronDownIcon className="size-[14px] text-[#387440]" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
