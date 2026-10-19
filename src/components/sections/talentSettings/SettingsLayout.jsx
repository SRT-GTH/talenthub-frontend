import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  SettingsAFolderIcon,
  SettingsAGlobeIcon,
  SettingsALockIcon,
  SettingsALogOutIcon,
  SettingsABellIcon,
  SettingsAShieldIcon,
  SettingsASlidersIcon,
  SettingsAStarIcon,
  SettingsAUserIcon,
  SettingsAUsersIcon,
} from '../../shared/assets.jsx';
import {
  SETTINGS_HEADING,
  SETTINGS_LOGOUT_LABEL,
  SETTINGS_NAV,
  SETTINGS_SUBHEADING,
} from './talentSettingsAData.js';
import { HEAD } from './SettingsAUi.jsx';

const log = debug('SettingsLayout');

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
 * SettingsLayout — the talent Settings page frame (Figma ST-01 "Main Content Canvas"): heading,
 * section nav (280px card from lg, a scrolling chip row below) and the section body as children.
 * Nav clicks go to `/settings/<section>`; "Log out" opens the shell-level confirm via `?logout=confirm`.
 */
const SettingsLayout = ({ settings, children }) => {
  const active = settings?.section;
  log('render', { active, state: settings?.state });
  const navRef = useRef(null);

  // Below lg the nav is a scrolling chip row: bring the active section into view.
  useEffect(() => {
    const nav = navRef.current;
    const el = nav?.querySelector('[aria-current="page"]');
    if (!nav || !el || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollLeft = el.offsetLeft - (nav.clientWidth - el.clientWidth) / 2;
    log('nav scrolled to active', { active, left: nav.scrollLeft });
  }, [active]);

  return (
    <div className="flex flex-col gap-[clamp(16px,1.39vw,24px)] lg:pt-[clamp(0px,0.69vw,12px)] lg:pr-[clamp(0px,1.85vw,32px)] lg:pl-[clamp(0px,0.93vw,16px)]">
      <div className="flex flex-col gap-[3px]">
        <h1
          className={classNames(
            HEAD,
            'text-[clamp(26px,1.97vw,34px)] leading-[1.2] tracking-[-0.68px] text-[#1c2a21]'
          )}
        >
          {SETTINGS_HEADING}
        </h1>
        <p className="text-[16px] leading-[24px] tracking-[0.2px] text-[#595959] max-sm:text-[14px]">
          {SETTINGS_SUBHEADING}
        </p>
      </div>

      <div className="flex items-start gap-[24px] max-lg:flex-col max-lg:gap-[16px]">
        <nav
          ref={navRef}
          aria-label="Settings sections"
          className="relative flex w-[280px] shrink-0 flex-col gap-[8px] rounded-[20px] border border-[rgba(28,42,33,0.1)] bg-white p-[12px] max-lg:w-full max-lg:flex-row max-lg:gap-[4px] max-lg:overflow-x-auto max-lg:p-[8px]"
        >
          {SETTINGS_NAV.map((item) => {
            const Icon = ICONS[item.icon];
            const isActive = item.id === active;
            return (
              <Link
                key={item.id}
                to={`/settings/${item.id}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => log('nav ->', item.id)}
                className={classNames(
                  ITEM,
                  isActive
                    ? 'bg-[#ebf1ec] font-semibold text-[#2a5730]'
                    : 'font-normal text-[#575755]'
                )}
              >
                <span
                  className={classNames(
                    'flex size-[20px] shrink-0',
                    isActive ? 'text-[#387440]' : 'text-[#575755]'
                  )}
                >
                  <Icon className="block size-[20px]" />
                </span>
                <span className="min-w-0 flex-1 max-lg:flex-none">{item.label}</span>
                {item.chip ? (
                  <span className="leading-[13px] rounded-full bg-[#faf4e8] px-[7px] py-[2px] text-[11px] font-semibold whitespace-nowrap text-[#c8951a] max-lg:text-[12px]">
                    {item.chip}
                  </span>
                ) : null}
                {isActive ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-[10px] left-0 h-[24px] w-[4px] rounded-[2px] bg-[#387440] max-lg:top-auto max-lg:right-[12px] max-lg:bottom-0 max-lg:left-[12px] max-lg:h-[3px] max-lg:w-auto"
                  />
                ) : null}
              </Link>
            );
          })}
          <span aria-hidden="true" className="h-px w-full bg-[#e7e7e7] max-lg:hidden" />
          <button
            type="button"
            onClick={() => {
              log('nav -> log out confirm');
              settings?.update?.({ logout: 'confirm' });
            }}
            className={classNames(
              ITEM,
              'w-full cursor-pointer text-left font-semibold text-[#c0392b]'
            )}
          >
            <span className="flex size-[20px] shrink-0 text-[#c0392b]">
              <SettingsALogOutIcon className="block size-[20px]" />
            </span>
            <span className="min-w-0 flex-1 max-lg:flex-none">{SETTINGS_LOGOUT_LABEL}</span>
          </button>
        </nav>

        <div className="flex w-full min-w-0 flex-1 flex-col gap-[20px]">{children}</div>
      </div>
    </div>
  );
};

export default SettingsLayout;
