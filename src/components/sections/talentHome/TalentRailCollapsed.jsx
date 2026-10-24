import { useLocation, useNavigate } from 'react-router-dom';
import { TalentSidebarProfileAvatarIllustration } from '../../shared/assets.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import TalentNavIcon from './TalentNavIcon.jsx';
import { homeTabRoute } from './talentShellData.js';
import { TALENT_NAV_MAIN, TALENT_NAV_SECONDARY } from './talentShellData.js';
import toggleIcon from '../../../assets/notifications/rail/toggle.svg';
import publicLinkIcon from '../../../assets/notifications/rail/public-link.svg';

const log = debug('TalentRailCollapsed');

/*
 * TalentRailCollapsed — Figma "GTH · Sidebar / Collapsed · Talent" (7471:54993, used by every
 * Notifications frame; same instance in the Focused set). A 126px icon rail: 74px ring avatar,
 * 80x54 nav tiles (24px glyph) with the active tile on the green→lime gradient, a divider before
 * Skills Lab, the public-profile link tile pinned to the bottom, and the » expand toggle at the
 * top right (19x16 at 95,22). Padding 60/12/40/12, gap 28.
 *
 * Props: activeId (nav id drawn active, Figma shows `messages`), badges ({ messages: '4' }),
 *        onToggle (expand to the full TalentSidebar), className.
 */
const Tile = ({ item, active, badge }) => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const go = () => {
    // Home / My Assessment are tabs of /home; the other items carry their route.
    if (item.route) {
      if (pathname !== item.route) navigate(item.route);
    } else if (item.tab) {
      log('nav ->', item.id);
      navigate(homeTabRoute(item.tab, pathname, search));
    }
  };
  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      aria-label={item.label}
      title={item.label}
      onClick={go}
      className={classNames(
        'relative flex h-[54px] w-[80px] items-center justify-center rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
        active
          ? 'rounded-[16px] bg-[linear-gradient(170.71deg,#387440_14.637%,#84cc16_85.349%)] text-white'
          : 'text-[#999999] hover:bg-[#ebf1ec]'
      )}
    >
      <TalentNavIcon icon={item.icon} size={24} />
      {badge && (
        <span
          className={classNames(
            'absolute -top-[2px] right-[10px] flex h-[18px] min-w-[20px] items-center justify-center rounded-full px-[6px] font-sans text-[10px] font-semibold leading-[12px]',
            active
              ? 'bg-[#e8f2ed] text-[#1f4d26]'
              : 'size-[10px] min-w-0 border-2 border-solid border-white bg-[#387440] p-0'
          )}
        >
          {active ? badge : ''}
        </span>
      )}
    </button>
  );
};

const TalentRailCollapsed = ({ activeId = 'messages', badges = {}, onToggle, className }) => {
  const navigate = useNavigate();
  log('render', { activeId });
  return (
    <div
      className={classNames(
        'relative flex w-[126px] shrink-0 flex-col items-center gap-[28px] overflow-y-auto bg-white px-[12px] pb-[40px] pt-[60px]',
        className
      )}
    >
      <button
        type="button"
        aria-label="Expand sidebar"
        aria-expanded="false"
        onClick={() => {
          log('toggle -> expanded');
          onToggle?.();
        }}
        className="absolute right-[12px] top-[22px] flex h-[16px] w-[19px] items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
      >
        <img src={toggleIcon} alt="" aria-hidden="true" className="h-[16px] w-[19px]" />
      </button>

      <div className="flex w-[80px] flex-col gap-[20px]">
        <span
          aria-hidden="true"
          className="relative mx-auto flex size-[74px] items-center justify-center overflow-hidden rounded-full border-[3px] border-solid border-[#e6e6e6] bg-white p-[6px]"
        >
          <span className="relative block size-[62px] overflow-hidden rounded-full bg-[linear-gradient(135deg,#387440_14.637%,#84cc16_85.349%)]">
            <TalentSidebarProfileAvatarIllustration className="absolute -top-[3px] left-1/2 h-[70px] w-[69px] max-w-none -translate-x-1/2 select-none" />
          </span>
        </span>

        <div className="flex flex-col gap-[12px] pt-[6px]">
          <nav aria-label="Main" className="flex flex-col gap-[4px]">
            {TALENT_NAV_MAIN.map((item) => (
              <Tile
                key={item.id}
                item={item}
                active={item.id === activeId}
                badge={badges[item.id]}
              />
            ))}
          </nav>
          <span aria-hidden="true" className="h-px w-full rounded-full bg-[#e1eae2]" />
          <nav aria-label="More" className="flex flex-col gap-[4px]">
            {TALENT_NAV_SECONDARY.map((item) => (
              <Tile key={item.id} item={item} active={item.id === activeId} />
            ))}
          </nav>
        </div>
      </div>

      <span className="flex-1" />

      <button
        type="button"
        aria-label="Public profile link"
        onClick={() => {
          log('public profile -> recruiter preview');
          navigate('/profile?view=recruiter');
        }}
        className="flex h-[60px] w-[64px] shrink-0 items-center justify-center rounded-[12px] border border-solid border-[#f8f8f4] bg-white p-[12px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
      >
        <span className="flex h-[36px] w-[40px] items-center justify-center rounded-[8px] bg-[#ebf1ec]">
          <img src={publicLinkIcon} alt="" aria-hidden="true" className="size-[20px]" />
        </span>
      </button>
    </div>
  );
};

export default TalentRailCollapsed;
