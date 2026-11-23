import AdminSettingsNav from './AdminSettingsNav.jsx';
import { AdminArrowRightIcon } from '../adminIcons.jsx';
import { LOGOUT, NAV, NAV_ROLES } from './data/adminSettingsData.js';

/*
 * AdminSettingsShell — the page frame of the admin Settings screens (Figma 7.5.1-7.5.2, the talent / agency Settings layout): title 34/41 600 + 16/24 #595959 sub copy
 * (+ the green "Create a staff account →" button on the staff screens), the 280 "Settings nav" card (9 items, icon 20, label 15, selected = #ebf1ec tint + green bar + 600
 * #2a5730, an "Admin" chip on Staff accounts, divider, red "Log out") and the tab body (gap 20). Below lg the nav becomes a scrolling chip row.
 * Props: active (nav id), subtitle, action ({ label, onClick }), navOrder ('roles' draws the Roles frame's order), children.
 * Every nav item has a screen (AdminSettingsPage routes /admin/settings/:tab; Feature flags and Integrations scroll Platform settings to
 * #feature_flag / #integration). Log out ends the staff session and goes to /admin/sign-in. The nav card is the shared AdminSettingsNav.
 */

const AdminSettingsShell = ({ active, subtitle, action, navOrder, children }) => {
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
        <AdminSettingsNav items={items} active={active} logoutLabel={LOGOUT} />
        <div className="flex w-full min-w-0 flex-1 flex-col gap-[20px]">{children}</div>
      </div>
    </div>
  );
};

export default AdminSettingsShell;
