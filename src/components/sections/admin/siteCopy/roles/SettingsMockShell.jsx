import { Link } from 'react-router-dom';
import AdminSettingsNav from '../../settings/AdminSettingsNav.jsx';
import { copyUrl } from '../copyUrl.js';
import { NAV_ICONS, NAV_LOGOUT } from './settingsMockData.js';

/*
 * SettingsMockShell — the page frame of the MOCK Settings screens of Platform Admin 7.8.7a / b / e: title "Settings" 34 / 41 600 + sub copy 16 / 24 #595959 (+ an optional green
 * button on the right), then the 280 px "Settings nav" card (nine items, icon 20, label 15, the selected one on #ebf1ec with a 4 px green bar and a 600 #2a5730 label, an "Admin"
 * chip on Staff accounts, divider, red "Log out") and the tab body (gap 20). The nav card is the shared AdminSettingsNav (also used by the real AdminSettingsShell), fed
 * exactly the nine items of these frames; "Roles and permissions" and "Staff accounts" lead to the mock screens, the other seven open the real Settings screen with the
 * same name (REAL_ROUTES, the routes of AdminSettingsShell), and Log out ends the staff session like the real Settings nav.
 * The icon follows the position of the item (as in Figma), the label order differs per frame.
 * Props: ctx (keeps the mock role in links), subtitle, labels (nine strings), activeLabel, itemWeight (400 | 500), action ({ label, to }), banner (node above the nav + body), children.
 * ⚠️ ASSUMPTION: no screen is drawn in 7.8 for the other seven items, so they leave the mock area for the real screens. Below lg the nav is a scrolling chip row.
 */
const ROUTES = {
  'Roles and permissions': '/admin/site-copy/settings/roles',
  'Staff accounts': '/admin/site-copy/settings/staff-list',
};

/** The other items open the real Settings screens (settings/data/adminSettingsData.js NAV; "Notification templates" = Message templates). */
const REAL_ROUTES = {
  Overview: '/admin/settings/overview',
  'Notification templates': '/admin/comms/templates',
  Accessibility: '/admin/settings/accessibility',
  'Feature flags': '/admin/settings#feature_flag',
  Integrations: '/admin/settings#integration',
  Security: '/admin/settings/security',
  'Platform settings': '/admin/settings',
};

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
  // The nine items of the frame: the icon follows the position, "Staff accounts" carries the brown "Admin" pill drawn in 7.8.7.
  const items = labels.map((label, i) => ({
    id: label,
    label,
    icon: NAV_ICONS[i],
    to: ROUTES[label] ? copyUrl(ctx, ROUTES[label]) : REAL_ROUTES[label],
    chip:
      label === 'Staff accounts' ? (
        <span className="rounded-full bg-[#faf4e8] px-[7px] py-[2px] font-sans text-[11px] leading-[13px] font-semibold text-[#463409] max-lg:text-[12px]">
          Admin
        </span>
      ) : null,
  }));
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
        <AdminSettingsNav
          items={items}
          active={activeLabel}
          itemWeight={itemWeight}
          itemClassName="min-h-[42px]"
          className="max-lg:[scrollbar-width:none]"
          logoutLabel={NAV_LOGOUT}
        />
        <div className="flex w-full min-w-0 flex-1 flex-col gap-[20px]">{children}</div>
      </div>
    </div>
  );
};

export default SettingsMockShell;
