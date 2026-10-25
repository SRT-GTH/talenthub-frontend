import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import {
  SettingsABellIcon,
  SettingsAFolderIcon,
  SettingsAGlobeIcon,
  SettingsALockIcon,
  SettingsALogOutIcon,
  SettingsAShieldIcon,
  SettingsASlidersIcon,
  SettingsAStarIcon,
  SettingsAUserIcon,
  SettingsAUsersIcon,
} from '../../../shared/assets.jsx';
import AgencyStatusChip from './AgencyStatusChip.jsx';
import { SETTINGS_LOGOUT_LABEL, SETTINGS_NAV } from './data/agencySettingsData.js';

const log = debug('AgencySettingsNav');

const ICONS = {
  user: SettingsAUserIcon,
  shield: SettingsAShieldIcon,
  bell: SettingsABellIcon,
  sliders: SettingsASlidersIcon,
  star: SettingsAStarIcon,
  globe: SettingsAGlobeIcon,
  lock: SettingsALockIcon,
  users: SettingsAUsersIcon,
  folder: SettingsAFolderIcon,
};

const ITEM =
  'relative flex items-center gap-[12px] rounded-[12px] px-[12px] py-[11px] text-[15px] leading-[18px] max-lg:shrink-0 max-lg:whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

/*
 * AgencySettingsNav — the 280px "Settings nav" card of Figma 11.6.1a (8611:25): 9 items (icon 20, label 15, active = #ebf1ec tint, green bar,
 * #2a5730 600), a divider and the red "Log out". Below lg it becomes a scrolling chip row.
 * Props: active (nav id). ⚠️ ASSUMPTION: Log out has no real session; it returns to the sign-up entry /agency/sign-up.
 */
const AgencySettingsNav = ({ active }) => {
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    const nav = navRef.current;
    const el = nav?.querySelector('[aria-current="page"]');
    if (nav && el && nav.scrollWidth > nav.clientWidth) {
      nav.scrollLeft = el.offsetLeft - (nav.clientWidth - el.clientWidth) / 2;
    }
  }, [active]);

  return (
    <nav
      ref={navRef}
      aria-label="Settings sections"
      className="relative flex w-[280px] shrink-0 flex-col gap-[8px] rounded-[20px] border border-[rgba(28,42,33,0.1)] bg-white p-[12px] max-lg:w-full max-lg:flex-row max-lg:gap-[4px] max-lg:overflow-x-auto max-lg:p-[8px]"
    >
      {SETTINGS_NAV.map((item) => {
        const Icon = ICONS[item.icon];
        const isActive = item.id === active;
        const inner = (
          <>
            <span
              className={classNames(
                'flex size-[20px] shrink-0',
                isActive ? 'text-[#387440]' : 'text-[#575755]'
              )}
            >
              <Icon className="block size-[20px]" />
            </span>
            <span className="min-w-0 flex-1 max-lg:flex-none">{item.label}</span>
            {item.chip ? <AgencyStatusChip tone="admin">{item.chip}</AgencyStatusChip> : null}
            {isActive ? (
              <span
                aria-hidden="true"
                className="absolute top-[10px] left-0 h-[24px] w-[4px] rounded-[2px] bg-[#387440] max-lg:top-auto max-lg:right-[12px] max-lg:bottom-0 max-lg:left-[12px] max-lg:h-[3px] max-lg:w-auto"
              />
            ) : null}
          </>
        );
        const cls = classNames(
          ITEM,
          isActive ? 'bg-[#ebf1ec] font-semibold text-[#2a5730]' : 'font-normal text-[#575755]',
          item.disabled && 'cursor-not-allowed opacity-100'
        );
        return item.disabled ? (
          <span key={item.id} aria-disabled="true" className={cls}>
            {inner}
          </span>
        ) : (
          <Link
            key={item.id}
            to={item.to}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => log('nav ->', item.id)}
            className={cls}
          >
            {inner}
          </Link>
        );
      })}
      <span aria-hidden="true" className="h-px w-full bg-[#e7e7e7] max-lg:hidden" />
      <button
        type="button"
        onClick={() => {
          log('log out (mock)');
          navigate('/agency/sign-up');
        }}
        className={classNames(ITEM, 'w-full cursor-pointer text-left font-semibold text-[#c0392b]')}
      >
        <span className="flex size-[20px] shrink-0 text-[#c0392b]">
          <SettingsALogOutIcon className="block size-[20px]" />
        </span>
        <span className="min-w-0 flex-1 max-lg:flex-none">{SETTINGS_LOGOUT_LABEL}</span>
      </button>
    </nav>
  );
};

export default AgencySettingsNav;
