import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { AgencyHomeIcon, AgencyUsersIcon } from '../agency/agencyIcons.jsx';
import { CopyEditIcon, CopyFileIcon, CopyLabelIcon } from './siteCopy/siteCopyIcons.jsx';
import {
  AdminFileCheckIcon,
  AdminMessageIcon,
  AdminSettingsIcon,
  AdminSpeedmeterIcon,
  AdminUserCheckIcon,
  AdminWarningIcon,
} from './adminIcons.jsx';

const log = debug('AdminNavItem');

/*
 * AdminNavItem — "GTH-DASH · Nav item" of the admin rail (same component as the agency rail: Figma 8623:417 active / 8623:418 inactive).
 * expanded: 255 x 44, px12 py10, gap 11, radius 10, icon 20 + label 14/24; active = #387440 fill, #ebf1ec label 500; inactive = #70706e 400.
 * rail (icon-only, ⚠️ ASSUMPTION: no collapsed rail is drawn): the same 44px tile without the label.
 */

const NAV_ICONS = {
  home: AgencyHomeIcon,
  users: AgencyUsersIcon,
  warning: AdminWarningIcon,
  message: AdminMessageIcon,
  'user-check': AdminUserCheckIcon,
  speedmeter: AdminSpeedmeterIcon,
  'file-check': AdminFileCheckIcon,
  settings: AdminSettingsIcon,
  'copy-edit': CopyEditIcon,
  'copy-label': CopyLabelIcon,
  'copy-file': CopyFileIcon,
};

/* Site copy area (7.8): the active item is a #387440 → #84cc16 gradient (Figma 7.8.0a), items can carry a count badge. */
const GRADIENT = 'bg-[linear-gradient(135deg,#387440_0%,#84cc16_100%)]';

const AdminNavItem = ({
  item,
  active = false,
  variant = 'expanded',
  onNavigate,
  gradient = false,
  badge,
}) => {
  const Icon = NAV_ICONS[item.icon];
  const rail = variant === 'rail';
  return (
    <Link
      to={item.to}
      aria-current={active ? 'page' : undefined}
      aria-label={rail ? item.label : undefined}
      title={rail ? item.label : undefined}
      onClick={() => {
        log('nav click', item.id);
        onNavigate?.();
      }}
      className={classNames(
        'flex items-center rounded-[10px] font-sans text-[14px] leading-[24px] tracking-[0.2px] no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
        rail ? 'size-[44px] justify-center' : 'h-[44px] w-full gap-[11px] px-[12px] py-[10px]',
        active
          ? classNames(gradient ? GRADIENT : 'bg-[#387440]', 'font-medium text-[#ebf1ec]')
          : 'font-normal text-[#70706e] hover:bg-[#ebf1ec]'
      )}
    >
      <Icon
        className={classNames('size-[20px] shrink-0', active ? 'text-[#ebf1ec]' : 'text-[#999999]')}
      />
      {rail ? null : <span className="min-w-0 flex-1 truncate">{item.label}</span>}
      {!rail && badge ? (
        <span
          className={classNames(
            'inline-flex h-[18px] min-w-[19px] items-center justify-center rounded-full px-[6px] font-sans text-[10px] leading-[12px] font-medium text-white max-lg:text-[12px]',
            GRADIENT
          )}
        >
          {badge}
        </span>
      ) : null}
    </Link>
  );
};

export default AdminNavItem;
