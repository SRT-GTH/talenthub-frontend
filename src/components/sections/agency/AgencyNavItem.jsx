import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  AgencyBookIcon,
  AgencyChartBarIcon,
  AgencyFilterIcon,
  AgencyHomeIcon,
  AgencyLockIcon,
  AgencyMapIcon,
  AgencyTrendUpIcon,
  AgencyUsersIcon,
} from './agencyIcons.jsx';

const log = debug('AgencyNavItem');

/*
 * AgencyNavItem — "GTH-DASH · Nav item" of the agency rail (Figma 8597:398695 active / 8597:398696 inactive).
 * expanded: 255 x 44, px12 py10, gap 11, radius 10, icon 20 + label 14/24; active = #387440 fill, #ebf1ec label 500; inactive = #70706e 400.
 * rail (icon-only, ⚠️ ASSUMPTION: the agency frames draw no collapsed rail): the same 44px tile without the label.
 */

const NAV_ICONS = {
  home: AgencyHomeIcon,
  map: AgencyMapIcon,
  book: AgencyBookIcon,
  filter: AgencyFilterIcon,
  lock: AgencyLockIcon,
  users: AgencyUsersIcon,
  chart: AgencyChartBarIcon,
  trend: AgencyTrendUpIcon,
};

const AgencyNavItem = ({ item, active = false, variant = 'expanded', onNavigate }) => {
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
          ? 'bg-[#387440] font-medium text-[#ebf1ec]'
          : 'font-normal text-[#70706e] hover:bg-[#ebf1ec]'
      )}
    >
      <Icon
        className={classNames('size-[20px] shrink-0', active ? 'text-[#ebf1ec]' : 'text-[#999999]')}
      />
      {rail ? null : <span className="min-w-0 flex-1 truncate">{item.label}</span>}
    </Link>
  );
};

export default AgencyNavItem;
