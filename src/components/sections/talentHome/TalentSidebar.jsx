import { useLocation, useNavigate } from 'react-router-dom';
import {
  TalentSidebarProfileAvatarIllustration,
  TalentSidebarVerifiedChipIcon,
} from '../../shared/assets.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import TalentNavIcon from './TalentNavIcon.jsx';
import { JOURNEY_MAP_ROUTE } from '../engagementShell/engagementShellData.js';
import {
  TALENT_NAV_MAIN,
  withWalletItem,
  TALENT_NAV_SECONDARY,
  getTalentProfile,
  getTalentSidebarData,
} from './talentShellData.js';
import PublicProfileCard from './TalentPublicProfileCard.jsx';

const log = debug('TalentSidebar');

/*
 * TalentSidebar — Figma `Sidebar · talent`. Every state follows ITS OWN frame:
 *   Focused (all states)               8097:4779 / 8097:6199 / 8097:6591 / 8097:6984 / 8097:7659 — flat.
 *   Playful day 1 / discoverable (shelf) 7740:11213 / 7740:11375 / 7756:182331 — ink borders + offset shelves + LIVE sticker.
 *   Playful complete / top (flat)       7756:182929 / 7740:11537 — the Focused layout with lime-gradient
 *                                        accents (avatar, active Home, badges, XP bar), no shelves, no LIVE sticker.
 * `data.flat` (talentShellData.js) picks the Playful flavour; Playful styling is `playful:` variants only.
 * Props: home (useTalentHomeState object), compact (md–lg icon rail), className, activeId / activeNav
 * (override which item is current: the Notifications screens pass activeId 'messages' like their
 * collapsed rail, /profile passes activeNav 'profile'; omitted = the open home tab decides, see isActive).
 * The open home tab picks the current item (see isActive); Home and My Assessment
 * call `home.update({ tab })`; the other destinations have no screen yet (logged).
 */

/* Text that differs between Focused and Playful ("pts" vs "XP"). */
const Dual = ({ focused, playful }) =>
  playful && playful !== focused ? (
    <>
      <span className="playful:hidden">{focused}</span>
      <span className="hidden playful:inline">{playful}</span>
    </>
  ) : (
    focused
  );

/* `active`: the badge on the current (green) item is a white pill with a green count (Figma MA frames); `gradient`: the
   Focused Messages badge drawn with the green→lime gradient (data.gradientBadges). Both are opt-in, default look unchanged. */
const Badge = ({ count, shelf, soft, active = false, gradient = false }) => (
  <span
    className={classNames(
      'inline-flex h-[18px] shrink-0 items-center justify-center overflow-hidden rounded-[99px] px-[6px] py-[2px] font-sans text-[10px] font-medium',
      active
        ? 'bg-white text-[#387440]'
        : gradient
          ? 'bg-[linear-gradient(136.548deg,#387440_14.637%,#84cc16_85.349%)] text-white'
          : soft
            ? 'h-[20px] bg-[#ebf1ec] px-[6px] py-[3px] text-[12px] text-[#2d5d33]'
            : 'bg-[#387440] text-white',
      shelf
        ? active
          ? 'playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)] playful:bg-white playful:px-[7px] playful:text-[11px] playful:font-semibold playful:text-[#387440]'
          : 'playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)] playful:bg-[#ebf1ec] playful:bg-none playful:px-[7px] playful:text-[11px] playful:font-semibold playful:text-[#1f4d26]'
        : !active && 'playful:bg-[linear-gradient(136.548deg,#387440_14.637%,#84cc16_85.349%)]'
    )}
  >
    {count}
  </span>
);

// Which rail item is current: My Assessment while its tab is open, Home on every other
// home tab. (Figma keeps Home active on every tab; changed at Quazor's request, 2026-10-18.)
const isActive = (item, home) =>
  home?.tab === 'assessment' ? item.id === 'assessment' : item.id === 'home';

const NavItem = ({
  item,
  active,
  badge,
  soft,
  gradient,
  mutedActive,
  compact,
  onSelect,
  shelf,
}) => (
  <button
    type="button"
    onClick={() => onSelect(item)}
    aria-current={active ? 'page' : undefined}
    aria-label={compact ? item.label : undefined}
    title={compact ? item.label : undefined}
    className={classNames(
      'group relative flex w-full items-center gap-[11px] rounded-[10px] px-[12px] py-[10px] text-left font-sans text-[14px] leading-6 tracking-[0.2px] transition-colors',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      shelf && 'playful:rounded-[14px] playful:text-[15px]',
      compact && 'justify-center px-0',
      active
        ? classNames(
            'bg-[#387440] font-semibold',
            mutedActive ? 'text-[#70706e]' : 'text-[#ebf1ec]',
            shelf
              ? 'playful:text-white playful:shadow-[inset_0_0_0_1.5px_rgba(28,42,33,0.55),4px_4px_0_rgba(28,42,33,0.55)]'
              : 'playful:bg-[linear-gradient(170.71deg,#387440_14.637%,#84cc16_85.349%)]'
          )
        : classNames(
            'font-normal text-[#70706e] hover:bg-[#ebf1ec]',
            shelf &&
              'playful:font-medium playful:text-[rgba(28,42,33,0.85)] playful:hover:bg-[#fbf4e0] playful:hover:shadow-[inset_0_0_0_1.5px_rgba(28,42,33,0.55),3px_3px_0_rgba(28,42,33,0.55)]'
          )
    )}
  >
    <span className="relative flex size-[20px] shrink-0 items-center justify-center">
      <TalentNavIcon
        icon={item.icon}
        size={18}
        className={
          active ? 'text-white' : classNames('text-[#999999]', shelf && 'playful:text-[#46524a]')
        }
      />
      {compact && badge && (
        <span className="absolute -right-[6px] -top-[6px] inline-flex size-[10px] rounded-full border border-white bg-[#387440]" />
      )}
    </span>
    {!compact && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
    {!compact && badge && (
      <Badge
        count={badge}
        shelf={shelf}
        soft={soft}
        active={active && !!mutedActive}
        gradient={gradient}
      />
    )}
  </button>
);

const Stat = ({ value, label, tight }) => (
  <div className="flex min-w-0 flex-1 flex-col items-center justify-center text-center">
    <span className="font-sans text-[14px] font-semibold leading-6 tracking-[0.2px] text-[#387440]">
      {value}
    </span>
    <span
      className={classNames(
        'font-sans text-[10px] text-[#999999]',
        tight ? 'leading-[11.9px]' : 'leading-[normal]'
      )}
    >
      {label}
    </span>
  </div>
);

const Divider = ({ shelf }) => (
  <span
    aria-hidden="true"
    className={classNames(
      'block h-[28px] w-px shrink-0 bg-[#ebf1ec]',
      shelf && 'playful:bg-[rgba(28,42,33,0.12)]'
    )}
  />
);

const avatarClass = (shelf) =>
  classNames(
    'relative flex shrink-0 items-center justify-center overflow-hidden bg-[#387440]',
    shelf
      ? 'playful:border-[1.5px] playful:border-solid playful:border-[rgba(28,42,33,0.55)] playful:bg-[linear-gradient(135deg,#387440_14.637%,#7aa870_85.349%)] playful:shadow-[2px_2px_0_rgba(28,42,33,0.55)]'
      : 'playful:bg-[linear-gradient(135deg,#387440_14.637%,#84cc16_85.349%)]'
  );

const TalentSidebar = ({ home, compact = false, className, activeId: activeIdProp, activeNav }) => {
  // `activeNav` ('profile' on /profile, 'learning' on /learning) draws that item active; default (home) is unchanged.
  const activeId =
    activeIdProp ??
    (activeNav === 'profile'
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
                        : 'home');
  const isCurrent = (item) =>
    activeIdProp || activeNav ? item.id === activeId : isActive(item, home);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const stateKey = home?.stateKey ?? 'day1';
  const data = getTalentSidebarData(stateKey, home?.live, activeNav);
  const profile = getTalentProfile(home?.live);
  const { journey } = data;
  const shelf = !data.flat;
  const percent = journey.percent ?? ((journey.done ?? 0) / 9) * 100;

  log('render', { stateKey, tab: home?.tab, compact, chip: data.chip, shelf });

  const select = (item) => {
    log('nav select:', item.id);
    if (item.route) {
      if (pathname !== item.route) navigate(item.route);
    } else if (item.tab && pathname !== '/home') {
      // Off the home screen (e.g. /notifications) Home / My Assessment must route back to /home.
      navigate(item.tab === 'home' ? '/home' : `/home?tab=${item.tab}`);
    } else if (item.tab) home?.update?.({ tab: item.tab === 'home' ? null : item.tab });
    else log('nav: no destination wired yet:', item.id);
  };

  const mainItems = data.wallet ? withWalletItem(TALENT_NAV_MAIN) : TALENT_NAV_MAIN;
  const navBadge = (id) => data.badges[id];
  const withLabel = (item) =>
    data.labels?.[item.id] ? { ...item, label: data.labels[item.id] } : item;

  if (compact) {
    return (
      <div
        className={classNames(
          'flex w-[72px] shrink-0 flex-col items-center gap-[16px] overflow-y-auto bg-white px-[8px] py-[16px]',
          shelf && 'playful:bg-transparent',
          className
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(avatarClass(shelf), 'size-[40px] rounded-full')}
        >
          <TalentSidebarProfileAvatarIllustration className="absolute -top-[3px] left-1/2 h-[45px] w-[44px] max-w-none -translate-x-1/2 select-none" />
        </span>
        <nav aria-label="Main" className="flex w-full flex-col gap-[4px]">
          {mainItems.map((item) => (
            <NavItem
              key={item.id}
              item={withLabel(item)}
              compact
              shelf={shelf}
              active={isCurrent(item)}
              badge={navBadge(item.id)}
              onSelect={select}
            />
          ))}
        </nav>
        <span
          className={classNames(
            'h-px w-full bg-[#e1eae2]',
            shelf && 'playful:bg-[rgba(28,42,33,0.15)]'
          )}
          aria-hidden="true"
        />
        <nav aria-label="More" className="flex w-full flex-col gap-[4px]">
          {TALENT_NAV_SECONDARY.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              compact
              shelf={shelf}
              active={item.id === activeId}
              onSelect={select}
            />
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div
      className={classNames(
        'flex w-[clamp(240px,17.53vw,303px)] shrink-0 flex-col items-center gap-[40px] overflow-y-auto bg-white py-[22px]',
        data.navGap && '!gap-[24px]',
        shelf && 'playful:bg-transparent',
        className
      )}
    >
      {/* Profile card */}
      <div
        className={classNames(
          'flex w-[calc(100%-24px)] shrink-0 flex-col items-center gap-[16px] overflow-clip rounded-[16px] border-[1.4px] border-solid border-[#e1eae2] bg-white py-[19px]',
          data.tight && '!py-[16px]',
          shelf &&
            'playful:rounded-[20px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_24px_rgba(28,42,33,0.06),5px_5px_0_rgba(28,42,33,0.55)]'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(avatarClass(shelf), 'size-[62px] rounded-[31px]')}
        >
          <TalentSidebarProfileAvatarIllustration className="h-[70px] w-[69px] max-w-none shrink-0 select-none" />
        </span>

        <div className="flex max-w-full flex-col items-center gap-[7px] px-[8px]">
          <div className="flex max-w-full items-center gap-[5px]">
            <p className="truncate font-sans text-[14px] font-semibold leading-6 tracking-[0.2px] text-[#1c2a21]">
              {profile.name}
            </p>
            <span className="inline-flex h-[18px] shrink-0 items-center gap-[3px] overflow-hidden rounded-[4px] bg-[#eaeffb] py-[2px] pl-[6px] pr-[7px]">
              <TalentSidebarVerifiedChipIcon className="size-[8px] shrink-0" />
              <span className="font-sans text-[10px] font-semibold leading-5 tracking-[0.2px] text-[#244a9f]">
                {data.chip}
              </span>
            </span>
          </div>
          <p className="max-w-full truncate font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#babab7]">
            {data.headline ?? profile.headline}
          </p>
          <div className="flex max-w-full items-center gap-[5px]">
            <span aria-hidden="true" className="size-[4px] shrink-0 rounded-full bg-[#387440]" />
            <p className="truncate font-sans text-[10px] font-semibold leading-4 tracking-[0.2px] text-[#387440]">
              {data.status}
            </p>
          </div>
        </div>

        {/* Journey / XP progress */}
        <div
          className={classNames(
            'flex w-[calc(100%-40px)] flex-col justify-center gap-[6px] overflow-clip border-t border-solid border-[#fefefe]',
            data.tight && 'h-[55px]'
          )}
        >
          <div className="flex items-center justify-between gap-[8px] font-sans font-semibold tracking-[0.2px]">
            <p className="truncate text-[12px] leading-5 text-[#1c2a21]">{journey.label}</p>
            <p className="shrink-0 text-[10px] leading-4 text-[#babab7]">
              <Dual focused={journey.count} playful={journey.countPlayful} />
            </p>
          </div>
          <div
            role="progressbar"
            aria-label={journey.label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(percent)}
            className={classNames(
              'flex h-[7px] w-full items-start overflow-clip rounded-[4px] bg-[rgba(235,241,236,0.5)]',
              shelf &&
                'playful:rounded-[99px] playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)] playful:bg-[#ebf1ec]'
            )}
          >
            <span
              className={classNames(
                'block h-[7px] shrink-0 rounded-[4px] bg-[#387440]',
                shelf
                  ? 'playful:rounded-[99px]'
                  : 'playful:bg-[linear-gradient(177.975deg,#387440_14.637%,#84cc16_85.349%)]'
              )}
              style={{ width: `${percent}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              // Live data names the next stage; demo / placeholder captions open the journey map.
              const to = journey.to || JOURNEY_MAP_ROUTE;
              log('journey caption ->', to);
              navigate(to);
            }}
            className="w-fit max-w-full truncate rounded text-left font-sans text-[10px] leading-4 tracking-[0.2px] text-[#70706e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <Dual focused={journey.caption} playful={journey.captionPlayful} />
          </button>
        </div>

        {/* Stats */}
        <div
          className={classNames(
            'flex w-[calc(100%-22px)] shrink-0 items-center justify-center gap-[4px] rounded-[10px] border border-solid border-[#faf4e8] bg-[rgba(235,241,236,0.5)] px-[6px] py-[10px]',
            data.tight && 'h-[56px] !py-0',
            shelf &&
              'playful:rounded-[14px] playful:border-[rgba(28,42,33,0.35)] playful:bg-[#faf4e8]'
          )}
        >
          {data.stats.map((stat, index) => (
            <div key={stat.id} className="flex min-w-0 flex-1 items-center gap-[4px]">
              {index > 0 && <Divider shelf={shelf} />}
              <Stat value={stat.value} label={stat.label} tight={data.tight} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation + public profile */}
      <div className="flex min-h-px w-full flex-1 flex-col items-start gap-[16px] pl-[clamp(14px,1.27vw,22px)] pr-[clamp(10px,0.7vw,12px)]">
        <div
          className={classNames(
            'flex w-full flex-col gap-[12px] pt-[6px]',
            data.navGap && '!gap-[6px]'
          )}
        >
          <nav aria-label="Main" className="flex w-full flex-col gap-[4px]">
            {mainItems.map((item) => (
              <NavItem
                key={item.id}
                item={withLabel(item)}
                shelf={shelf}
                active={isCurrent(item)}
                badge={navBadge(item.id)}
                soft={data.softBadges?.includes(item.id)}
                gradient={data.gradientBadges?.includes(item.id)}
                mutedActive={data.activeLabelMuted}
                onSelect={select}
              />
            ))}
          </nav>
          <span
            aria-hidden="true"
            className={classNames(
              'block h-px w-full rounded-[30px] bg-[#e1eae2]',
              shelf && 'playful:bg-[rgba(28,42,33,0.15)]'
            )}
          />
          <nav aria-label="More" className="flex w-full flex-col gap-[4px]">
            {TALENT_NAV_SECONDARY.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                shelf={shelf}
                active={item.id === activeId}
                onSelect={select}
              />
            ))}
          </nav>
        </div>

        <PublicProfileCard
          url={data.publicUrl ?? profile.url}
          shelf={shelf}
          label={data.previewLabel}
          onPreview={data.preview ? () => home?.update?.(data.preview) : undefined}
        />
      </div>
    </div>
  );
};

export default TalentSidebar;
