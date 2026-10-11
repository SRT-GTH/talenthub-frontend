import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Modal from '../../ui/Modal.jsx';
import CommunityIcon from '../community/CommunityIcon.jsx';
import { icons } from '../community/communityIcons.js';
import { SIDEBAR_PROFILE, TOP_NAV } from './dashboardData.js';
import NavBadge from './NavBadge.jsx';
import PublicProfileCard from './PublicProfileCard.jsx';
import avatarLarge from '../../../assets/community/avatar-recruiter-large.svg';

const log = debug('DashboardMoreSheet');

/*
 * DashboardMoreSheet — the phone tab bar's "More" destination: a bottom sheet
 * (the shared Modal is a bottom sheet below `sm`) holding everything the five
 * tabs don't — Community, Application Pipeline, Profile — plus the header
 * actions that are hidden on phones (notifications, help) and the public
 * profile card with its "Preview as talent" action.
 *
 * Every row is a >= 48px target. Routed rows are real <Link>s; rows with no
 * destination in this build log their intent, matching the rail and top nav.
 */

const GREEN_GRADIENT = 'linear-gradient(171.84deg, #387440 14.637%, #84cc16 85.349%)';

const rowClass =
  'flex min-h-[44px] w-full items-center gap-[12px] rounded-[10px] px-[12px] py-[6px] text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';

const SheetRow = ({ icon, label, badge, active, to, onSelect }) => {
  const content = (
    <>
      <span
        className="flex size-[32px] shrink-0 items-center justify-center rounded-[10px] bg-[#f8fafc]"
        style={active ? { backgroundImage: GREEN_GRADIENT } : undefined}
      >
        <CommunityIcon
          src={icon}
          size={18}
          className={active ? 'brightness-0 invert' : 'brightness-0 invert-[.6]'}
        />
      </span>
      <span
        className={classNames(
          'min-w-0 flex-1 font-sans text-[15px] leading-6 tracking-[0.2px]',
          active ? 'font-semibold text-brand-green' : 'text-neutral-dark-active'
        )}
      >
        {label}
      </span>
      {badge && <NavBadge count={badge} />}
    </>
  );

  const shared = classNames(
    rowClass,
    active ? 'bg-brand-green-light' : 'active:bg-brand-green-light'
  );

  if (to) {
    return (
      <Link
        to={to}
        aria-current={active ? 'page' : undefined}
        className={shared}
        onClick={() => onSelect?.(label)}
      >
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={shared} onClick={() => onSelect?.(label)}>
      {content}
    </button>
  );
};

const DashboardMoreSheet = ({ isOpen, onClose, items, secondaryItems }) => {
  const handleSelect = (label) => log('sheet row:', label);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" ariaLabel="More navigation">
      <div className="flex flex-col gap-[16px] px-[16px] pb-[20px] pt-[20px]">
        {/* Profile summary — mirrors the top of the rail's profile card */}
        <div className="flex items-center gap-[12px] pr-[56px]">
          <span
            className="flex size-[48px] shrink-0 items-center justify-center overflow-hidden rounded-full"
            style={{ backgroundImage: 'linear-gradient(135deg, #387440 14.637%, #84cc16 85.349%)' }}
          >
            <img
              src={avatarLarge}
              alt=""
              draggable="false"
              className="h-[54px] w-[53px] max-w-none select-none"
            />
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="font-sans text-[16px] font-semibold leading-6 text-black">
              {SIDEBAR_PROFILE.name}
            </span>
            <span className="font-sans text-[14px] leading-5 text-neutral-dark-hover">
              {SIDEBAR_PROFILE.meta}
            </span>
          </div>
        </div>

        <nav aria-label="More destinations" className="flex flex-col gap-[2px]">
          {items.map((item) => (
            <SheetRow
              key={item.id}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
              active={item.active}
              to={item.to}
              onSelect={handleSelect}
            />
          ))}
          {secondaryItems.map((item) => (
            <SheetRow
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={item.active}
              to={item.to}
              onSelect={handleSelect}
            />
          ))}
          <div className="my-[6px] h-px w-full bg-brand-green-light-hover" />
          <SheetRow
            icon={icons.navNotification}
            label="Notifications"
            badge={TOP_NAV.notificationCount}
            onSelect={handleSelect}
          />
          <SheetRow icon={icons.navHelp} label="Help" onSelect={handleSelect} />
        </nav>

        <PublicProfileCard className="w-full" />
      </div>
    </Modal>
  );
};

export default DashboardMoreSheet;
