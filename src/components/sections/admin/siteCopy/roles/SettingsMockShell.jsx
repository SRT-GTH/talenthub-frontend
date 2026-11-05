import { Link, useNavigate } from 'react-router-dom';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
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
} from '../../../../shared/assets.jsx';
import { copyUrl } from '../copyUrl.js';
import { NAV_ICONS, NAV_LOGOUT } from './settingsMockData.js';

const log = debug('SettingsMockShell');

/*
 * SettingsMockShell — the page frame of the MOCK Settings screens of Platform Admin 7.8.7a / b / e: title "Settings" 34 / 41 600 + sub copy 16 / 24 #595959 (+ an optional green
 * button on the right), then the 280 px "Settings nav" card (nine items, icon 20, label 15, the selected one on #ebf1ec with a 4 px green bar and a 600 #2a5730 label, an "Admin"
 * chip on Staff accounts, divider, red "Log out") and the tab body (gap 20). It copies the look of the real `AdminSettingsShell` (which is wired to the backend and not touched) but draws
 * exactly the nine items of these frames; "Roles and permissions" and "Staff accounts" lead to the mock screens, the other items only log, Log out goes to the Site copy home.
 * The icon follows the position of the item (as in Figma), the label order differs per frame.
 * Props: ctx (keeps the mock role in links), subtitle, labels (nine strings), activeLabel, itemWeight (400 | 500), action ({ label, to }), banner (node above the nav + body), children.
 * ⚠️ ASSUMPTION: Log out is inert-ish (goes to /admin/site-copy); the other seven nav items only log (no screen drawn for them in 7.8). Below lg the nav is a scrolling chip row.
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

const ROUTES = {
  'Roles and permissions': '/admin/site-copy/settings/roles',
  'Staff accounts': '/admin/site-copy/settings/staff-list',
};

const ITEM =
  'relative flex min-h-[42px] items-center gap-[12px] rounded-[12px] border-0 px-[12px] py-[11px] text-left font-sans text-[15px] leading-[18px] no-underline max-lg:shrink-0 max-lg:whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const SettingsMockShell = ({
  ctx,
  subtitle,
  labels,
  activeLabel,
  itemWeight = 500,
  action,
  banner,
  children,
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-[24px] pt-[16px]">
      <header className="flex flex-wrap items-start justify-between gap-[16px]">
        <div className="flex min-w-0 flex-col gap-[3px]">
          <h1 className="m-0 font-sans text-[clamp(28px,1.97vw,34px)] leading-[41px] font-semibold tracking-[-0.68px] text-[#1c2a21]">
            Settings
          </h1>
          <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#595959] max-sm:text-[14px]">
            {subtitle}
          </p>
        </div>
        {action ? (
          <Link
            to={copyUrl(ctx, action.to)}
            className="inline-flex min-h-[44px] items-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[14px] leading-[24px] font-semibold text-white no-underline shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {action.label}
          </Link>
        ) : null}
      </header>
      {banner}
      <div className="flex items-start gap-[24px] max-lg:flex-col max-lg:gap-[16px]">
        <nav
          aria-label="Settings sections"
          className="relative flex w-[280px] shrink-0 flex-col gap-[8px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[12px] max-lg:w-full max-lg:flex-row max-lg:gap-[4px] max-lg:overflow-x-auto max-lg:p-[8px] max-lg:[scrollbar-width:none]"
        >
          {labels.map((label, i) => {
            const Icon = ICONS[NAV_ICONS[i]];
            const active = label === activeLabel;
            const to = ROUTES[label];
            const cls = classNames(
              ITEM,
              active ? 'bg-[#ebf1ec]' : 'bg-transparent hover:bg-[#f3f8f4]'
            );
            const inner = (
              <>
                <span
                  className={classNames(
                    'flex size-[20px] shrink-0',
                    active ? 'text-[#387440]' : 'text-[#575755]'
                  )}
                >
                  <Icon className="block size-[20px]" />
                </span>
                <span
                  className={classNames(
                    'min-w-0 flex-1 max-lg:flex-none',
                    active
                      ? 'font-semibold text-[#2a5730]'
                      : itemWeight === 500
                        ? 'font-medium text-[#575755]'
                        : 'font-normal text-[#575755]'
                  )}
                >
                  {label}
                </span>
                {label === 'Staff accounts' ? (
                  <span className="rounded-full bg-[#faf4e8] px-[7px] py-[2px] font-sans text-[11px] leading-[13px] font-semibold text-[#463409] max-lg:text-[12px]">
                    Admin
                  </span>
                ) : null}
                {active ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-[10px] left-0 h-[24px] w-[4px] rounded-[2px] bg-[#387440] max-lg:top-auto max-lg:right-[12px] max-lg:bottom-0 max-lg:left-[12px] max-lg:h-[3px] max-lg:w-auto"
                  />
                ) : null}
              </>
            );
            return to ? (
              <Link
                key={label}
                to={copyUrl(ctx, to)}
                aria-current={active ? 'page' : undefined}
                className={cls}
                onClick={() => log('nav', label)}
              >
                {inner}
              </Link>
            ) : (
              <button
                key={label}
                type="button"
                className={cls}
                onClick={() => log('nav (no screen drawn)', label)}
              >
                {inner}
              </button>
            );
          })}
          <div role="separator" className="h-px w-full bg-[#e7e7e7] max-lg:hidden" />
          <button
            type="button"
            onClick={() => {
              log('log out → Site copy home');
              navigate(copyUrl(ctx, '/admin/site-copy'));
            }}
            className={classNames(ITEM, 'bg-transparent hover:bg-[#fbeeed]')}
          >
            <span className="flex size-[20px] shrink-0 text-[#c0392b]">
              <SettingsALogOutIcon className="block size-[20px]" />
            </span>
            <span className="min-w-0 flex-1 font-semibold text-[#c0392b] max-lg:flex-none">
              {NAV_LOGOUT}
            </span>
          </button>
        </nav>
        <div className="flex w-full min-w-0 flex-1 flex-col gap-[20px]">{children}</div>
      </div>
    </div>
  );
};

export default SettingsMockShell;
