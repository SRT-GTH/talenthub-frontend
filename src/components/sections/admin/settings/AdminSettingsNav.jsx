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
import AgencyStatusChip from '../../agency/settings/AgencyStatusChip.jsx';
import { logout } from '../../../../services/auth.api.js';

const log = debug('AdminSettingsNav');

/*
 * AdminSettingsNav — the 280 "Settings nav" card of the admin Settings screens (Figma 7.5.1-7.5.2 and the 7.8.7 Roles / Staff frames): one row per item (icon 20,
 * label 15, the selected one on #ebf1ec with a 4 px green bar and a 600 #2a5730 label, optional chip), a divider and the red "Log out" (ends the staff session,
 * goes to /admin/sign-in). Below lg it becomes a scrolling chip row. Shared by AdminSettingsShell (real pages) and SettingsMockShell (7.8 mock pages).
 * Props: items [{ id, label, icon, to?, chip? }] (chip: a string draws the agency "admin" chip, a node is drawn as is; no `to` = a button that only logs),
 * active (item id), itemWeight 500 | 400 (unselected label weight), itemClassName (extra row classes), className (extra card classes), logoutLabel.
 */

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
  'relative flex items-center gap-[12px] rounded-[12px] border-0 px-[12px] py-[11px] text-left font-sans text-[15px] leading-[18px] no-underline max-lg:shrink-0 max-lg:whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const AdminSettingsNav = ({
  items,
  active,
  itemWeight = 500,
  itemClassName,
  className,
  logoutLabel = 'Log out',
}) => {
  const navigate = useNavigate();
  return (
    <nav
      aria-label="Settings sections"
      className={classNames(
        'relative flex w-[280px] shrink-0 flex-col gap-[8px] rounded-[20px] border border-solid border-[rgba(28,42,33,0.1)] bg-white p-[12px] max-lg:w-full max-lg:flex-row max-lg:gap-[4px] max-lg:overflow-x-auto max-lg:p-[8px]',
        className
      )}
    >
      {items.map((item) => {
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
              {Icon ? <Icon className="block size-[20px]" /> : null}
            </span>
            <span
              className={classNames(
                'min-w-0 flex-1 max-lg:flex-none',
                isActive
                  ? 'font-semibold text-[#2a5730]'
                  : itemWeight === 500
                    ? 'font-medium text-[#575755]'
                    : 'font-normal text-[#575755]'
              )}
            >
              {item.label}
            </span>
            {typeof item.chip === 'string' ? (
              <AgencyStatusChip tone="admin">{item.chip}</AgencyStatusChip>
            ) : (
              (item.chip ?? null)
            )}
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
          itemClassName,
          isActive ? 'bg-[#ebf1ec]' : 'bg-transparent hover:bg-[#f3f8f4]'
        );
        return item.to ? (
          <Link
            key={item.id}
            to={item.to}
            aria-current={isActive ? 'page' : undefined}
            className={cls}
            onClick={() => log('nav', item.id)}
          >
            {inner}
          </Link>
        ) : (
          <button
            key={item.id}
            type="button"
            className={cls}
            onClick={() => log('nav (no screen drawn)', item.id)}
          >
            {inner}
          </button>
        );
      })}
      <div role="separator" className="my-[0px] h-px w-full bg-[#e7e7e7] max-lg:hidden" />
      <button
        type="button"
        onClick={() => {
          log('log out → staff sign-in');
          logout();
          navigate('/admin/sign-in', { replace: true });
        }}
        className={classNames(ITEM, itemClassName, 'bg-transparent hover:bg-[#fbeeed]')}
      >
        <span className="flex size-[20px] shrink-0 text-[#c0392b]">
          <SettingsALogOutIcon className="block size-[20px]" />
        </span>
        <span className="min-w-0 flex-1 font-semibold text-[#c0392b] max-lg:flex-none">
          {logoutLabel}
        </span>
      </button>
    </nav>
  );
};

export default AdminSettingsNav;
