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
  SettingsAUserIcon,
  SettingsAUsersIcon,
} from '../../../shared/assets.jsx';
import AgencyStatusChip from '../../agency/settings/AgencyStatusChip.jsx';
import { AdminArrowRightIcon } from '../adminIcons.jsx';
import { LOGOUT, NAV, NAV_ROLES } from './data/adminSettingsData.js';

const log = debug('AdminSettingsShell');

/*
 * AdminSettingsShell — the page frame of the admin Settings screens (Figma 7.5.1-7.5.2, the talent / agency Settings layout): title 34/41 600 + 16/24 #595959 sub copy
 * (+ the green "Create a staff account →" button on the staff screens), the 280 "Settings nav" card (9 items, icon 20, label 15, selected = #ebf1ec tint + green bar + 600
 * #2a5730, an "Admin" chip on Staff accounts, divider, red "Log out") and the tab body (gap 20). Below lg the nav becomes a scrolling chip row.
 * Props: active (nav id), subtitle, action ({ label, onClick }), navOrder ('roles' draws the Roles frame's order), children.
 * ⚠️ ASSUMPTION: only Roles and permissions, Staff accounts and Platform settings have a screen; the other items only log; Log out has no real session (goes to /admin/sign-in).
 */

const ICONS = {
  user: SettingsAUserIcon,
  shield: SettingsAShieldIcon,
  bell: SettingsABellIcon,
  sliders: SettingsASlidersIcon,
  globe: SettingsAGlobeIcon,
  lock: SettingsALockIcon,
  users: SettingsAUsersIcon,
  folder: SettingsAFolderIcon,
};

const ITEM =
  'relative flex items-center gap-[12px] rounded-[12px] border-0 px-[12px] py-[11px] text-left font-sans text-[15px] leading-[18px] no-underline max-lg:shrink-0 max-lg:whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const AdminSettingsShell = ({ active, subtitle, action, navOrder, children }) => {
  const navigate = useNavigate();
  const items = navOrder === 'roles' ? NAV_ROLES : NAV;
  return (
    <div className="flex flex-col gap-[24px] pt-[12px]">
      <header className="flex flex-wrap items-start justify-between gap-[16px]">
        <div className="flex flex-col gap-[3px]">
          <h1 className="m-0 font-sans text-[clamp(28px,1.97vw,34px)] leading-[41px] font-semibold text-[#1c2a21]">
            Settings
          </h1>
          <p className="m-0 font-sans text-[16px] leading-[24px] text-[#595959] max-sm:text-[14px]">
            {subtitle}
          </p>
        </div>
        {action ? (
          <button
            type="button"
            onClick={action.onClick}
            className="inline-flex h-[44px] cursor-pointer items-center gap-[8px] rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[14px] leading-[24px] font-semibold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {action.label}
            <AdminArrowRightIcon className="size-[20px]" />
          </button>
        ) : null}
      </header>
      <div className="flex items-start gap-[24px] max-lg:flex-col max-lg:gap-[16px]">
        <nav
          aria-label="Settings sections"
          className="relative flex w-[280px] shrink-0 flex-col gap-[8px] rounded-[20px] border border-solid border-[rgba(28,42,33,0.1)] bg-white p-[12px] max-lg:w-full max-lg:flex-row max-lg:gap-[4px] max-lg:overflow-x-auto max-lg:p-[8px]"
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
                  <Icon className="block size-[20px]" />
                </span>
                <span
                  className={classNames(
                    'min-w-0 flex-1 max-lg:flex-none',
                    isActive ? 'font-semibold text-[#2a5730]' : 'font-medium text-[#575755]'
                  )}
                >
                  {item.label}
                </span>
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
            onClick={() => navigate('/admin/sign-in')}
            className={classNames(ITEM, 'bg-transparent hover:bg-[#fbeeed]')}
          >
            <span className="flex size-[20px] shrink-0 text-[#c0392b]">
              <SettingsALogOutIcon className="block size-[20px]" />
            </span>
            <span className="min-w-0 flex-1 font-semibold text-[#c0392b] max-lg:flex-none">
              {LOGOUT}
            </span>
          </button>
        </nav>
        <div className="flex w-full min-w-0 flex-1 flex-col gap-[20px]">{children}</div>
      </div>
    </div>
  );
};

export default AdminSettingsShell;
