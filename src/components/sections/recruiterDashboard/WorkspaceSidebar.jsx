import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import CommunityIcon from '../community/CommunityIcon.jsx';
import { icons } from '../community/communityIcons.js';
import { useDashboardNav } from '../dashboard/dashboardNav.js';
import avatarKwame from '../../../assets/recruiter-dashboard/recruiter-avatar-kwame-asante.png';
import badgeProSparkle from '../../../assets/recruiter-dashboard/badge-pro-sparkle.svg';
import { dashIcons } from './recruiterDashboardIcons.js';
import WorkspaceSettingsIcon from './WorkspaceSettingsIcon.jsx';
import { WORKSPACE_SIDEBAR as S } from './recruiterDashboardData.js';

/*
 * WorkspaceSidebar — the recruiter dashboard's left rail at lg+ (Figma "Sidebar · talent" 10068:42622, 303×977): profile card (photo, name + Pro badge, meta line,
 * "Profile journey 5 of 9" bar, three stats), the nav (Home active as a flat #387440 pill), the plan-usage card, the public link and "Preview as talent".
 * Different from the older rail (`DashboardSidebar`, "Getting started" + gradient pill): that one still serves the other recruiter pages, this one is passed
 * to `DashboardShell` through `renderSidebar` on the dashboard only. Collapsing falls back to the standard collapsed rail.
 * Props: onToggle (collapse), className, showSettings (opt-in: a "Settings" row under Profile, drawn on the Application Pipeline frames PL-01 … PL-16, Figma 10173:11581; off everywhere else).
 */
const NAV_ORDER = [
  'home',
  'talent-search',
  'job-postings',
  'application-pipeline',
  'messages',
  'community',
];

const NavItem = ({ item, badge }) => {
  const body = (
    <>
      {item.Icon ? (
        <item.Icon className="size-[18px] shrink-0 text-[#999]" />
      ) : (
        <CommunityIcon
          src={item.icon}
          size={18}
          className={item.active ? 'brightness-0 invert' : 'brightness-0 invert-[.6]'}
        />
      )}
      <span
        className={classNames(
          'min-w-0 flex-1 text-left font-sans text-[14px] leading-[24px] tracking-[0.2px]',
          item.active ? 'font-semibold text-[#ebf1ec]' : 'text-[#70706e]'
        )}
      >
        {item.label}
      </span>
      {badge ? (
        <span className="inline-flex h-[18px] min-w-[19px] items-center justify-center rounded-full bg-[#387440] px-[6px] font-sans text-[10px] leading-[12px] font-medium text-white">
          {badge}
        </span>
      ) : null}
    </>
  );
  const cls = classNames(
    'flex h-[44px] w-full items-center gap-[11px] rounded-[10px] px-[12px] py-[10px] no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
    item.active ? 'bg-[#387440]' : 'bg-transparent hover:bg-[#ebf1ec]'
  );
  return item.to ? (
    <Link to={item.to} aria-current={item.active ? 'page' : undefined} className={cls}>
      {body}
    </Link>
  ) : (
    <button type="button" className={cls}>
      {body}
    </button>
  );
};

const SETTINGS_ITEM = { id: 'settings', label: 'Settings', Icon: WorkspaceSettingsIcon };

// `settingsActive`: the Recruiter Settings page (Figma SR-01 …): the Settings row links to /recruiter/settings and is the current page.
const WorkspaceSidebar = ({
  onToggle,
  className,
  showSettings = false,
  settingsActive = false,
}) => {
  const { navItems, secondaryNavItems } = useDashboardNav();
  const ordered = NAV_ORDER.map((id) => navItems.find((item) => item.id === id)).filter(Boolean);

  return (
    <aside
      aria-label="Recruiter navigation"
      className={classNames(
        'relative hidden h-full w-[clamp(280px,17.5vw,303px)] shrink-0 flex-col gap-[8px] overflow-y-auto border-r-2 border-white bg-white pt-[56px] pb-[22px] [scrollbar-width:none] lg:flex [&::-webkit-scrollbar]:hidden',
        className
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label="Collapse sidebar"
        className="absolute top-[22px] right-[14px] inline-flex cursor-pointer items-center justify-center rounded-[6px] border-0 bg-transparent p-[2px] hover:bg-[#ebf1ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
      >
        <CommunityIcon src={icons.collapseLeft} size={23} className="!h-[20px]" />
      </button>

      <div className="mx-[12px] flex flex-col items-center gap-[16px] rounded-[16px] border-[1.4px] border-solid border-[#e1eae2] bg-white py-[19px]">
        <span className="flex size-[62px] items-center justify-center overflow-hidden rounded-full bg-[#387440]">
          <img src={avatarKwame} alt={S.name} className="h-[70px] w-[69px] max-w-none" />
        </span>
        <div className="flex flex-col items-center gap-[7px] px-[12px]">
          <div className="flex items-center gap-[5px]">
            <span className="font-sans text-[14px] leading-[24px] font-semibold tracking-[0.2px] text-[#1c2a21]">
              {S.name}
            </span>
            <span className="inline-flex h-[18px] items-center gap-[3px] rounded-[4px] bg-[#eaeffb] py-[2px] pr-[7px] pl-[6px] font-sans text-[10px] leading-[12px] font-semibold tracking-[0.2px] text-[#244a9f]">
              <img src={badgeProSparkle} alt="" aria-hidden="true" className="size-[8px]" />
              {S.badge}
            </span>
          </div>
          <p className="m-0 text-center font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#babab7]">
            {S.meta}
          </p>
        </div>

        <div className="flex w-[239px] max-w-[calc(100%-32px)] flex-col gap-[6px]">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#1c2a21]">
              {S.journeyLabel}
            </span>
            <span className="font-sans text-[10px] leading-[16px] font-semibold tracking-[0.2px] text-[#babab7]">
              {S.journeyCount}
            </span>
          </div>
          <div
            role="progressbar"
            aria-label={S.journeyLabel}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(S.journeyPercent)}
            className="h-[7px] w-full overflow-hidden rounded-[4px] bg-[#ebf1ec]"
          >
            <span
              className="block h-full rounded-[4px] bg-[#387440]"
              style={{ width: `${S.journeyPercent}%` }}
            />
          </div>
          <span className="font-sans text-[10px] leading-[16px] tracking-[0.2px] text-[#70706e]">
            {S.journeyNext}
          </span>
        </div>

        <div className="flex w-[257px] max-w-[calc(100%-24px)] items-center justify-center gap-[4px] rounded-[10px] border border-solid border-[#faf4e8] bg-[#ebf1ec] px-[10px] py-[10px]">
          {S.stats.map((stat) => (
            <div key={stat.id} className="flex w-[60px] flex-col items-center px-[2px]">
              <span className="font-sans text-[14px] leading-[24px] font-semibold tracking-[0.2px] text-[#387440]">
                {stat.value}
              </span>
              <span className="font-sans text-[11px] leading-[13px] whitespace-nowrap text-[#999]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <nav aria-label="Recruiter" className="flex flex-col gap-[16px] px-[22px] pt-[6px]">
        <div className="flex flex-col gap-[4px]">
          {ordered.map((item) => (
            <NavItem key={item.id} item={item} badge={S.navBadges[item.id]} />
          ))}
        </div>
        <hr className="m-0 h-px w-full border-0 bg-[#e1eae2]" />
        <div className="flex flex-col gap-[4px]">
          {secondaryNavItems.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
          {showSettings ? (
            <NavItem
              item={
                settingsActive
                  ? { ...SETTINGS_ITEM, to: '/recruiter/settings', active: true }
                  : { ...SETTINGS_ITEM, to: '/recruiter/settings' }
              }
            />
          ) : null}
        </div>
      </nav>

      <div className="mt-auto flex flex-col gap-[6px] px-[22px] pt-[8px]">
        <div className="flex flex-col gap-[8px] rounded-[16px] border border-solid border-[#387440]/20 bg-[#ebf1ec]/50 p-[12px]">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[12px] leading-[20px] font-semibold tracking-[0.1px] text-[#2a5730]">
              {S.plan.title}
            </span>
            {/* Upgrade -> Settings > Plan and billing (Figma "Recruiter - Settings & Account" SR-11); the rail itself draws no link ⚠️ ASSUMPTION */}
            <Link
              to="/recruiter/settings?tab=billing"
              className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#387440] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              {S.plan.upgrade}
            </Link>
          </div>
          {S.plan.usage.map((row) => (
            <div key={row.id} className="flex flex-col gap-[4px]">
              <div className="flex items-center justify-between font-sans text-[12px] leading-[20px] tracking-[0.2px]">
                <span className="text-[#575755]">{row.label}</span>
                <span className="font-medium text-[#111]">{row.value}</span>
              </div>
              <div className="h-[5px] w-full overflow-hidden rounded-[5px] bg-white">
                <span
                  className="block h-full rounded-[5px] bg-[#387440]"
                  style={{ width: `${row.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-[6px] py-[4px]">
          <img
            src={dashIcons.linkPublicProfile}
            alt=""
            aria-hidden="true"
            className="size-[14px]"
          />
          <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#2a5730]">
            {S.url}
          </span>
        </div>
        <button
          type="button"
          className="inline-flex h-[36px] w-full cursor-pointer items-center justify-center gap-[6px] rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[12px] font-sans text-[13px] leading-[24px] font-semibold tracking-[0.1px] text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          {S.preview}
          <img
            src={dashIcons.arrowUpRightPreview}
            alt=""
            aria-hidden="true"
            className="size-[20px]"
          />
        </button>
      </div>
    </aside>
  );
};

export default WorkspaceSidebar;
