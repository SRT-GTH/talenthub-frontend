import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import AgencyNavItem from './AgencyNavItem.jsx';
import AgencyPageCard from './AgencyPageCard.jsx';
import AgencyPersonaCard from './AgencyPersonaCard.jsx';
import { AgencyLinkIcon, AgencySidebarToggleIcon } from './agencyIcons.jsx';
import { PRIMARY_NAV, SECONDARY_NAV } from './agencyNav.js';

const log = debug('AgencySidebar');

/*
 * AgencySidebar — the left rail of the agency chrome (Figma "Sidebar" 8597:398620, 303 wide, white).
 *   variant="expanded"  303: toggle · persona card · main nav (Home … Applicants) | divider | National data, Demand & outcomes · "Your agency page" card
 *   variant="rail"      80 : icon-only (⚠️ ASSUMPTION: no collapsed rail is drawn): monogram, the nav tiles, a link button for the agency page
 * The toggle is the `ep:d-arrow-left` button (Figma 8798:442030): it collapses / expands (mirrored when collapsed). onToggle is omitted
 * in the drawer (phone / tablet), which has no toggle. The nav block scrolls when the viewport is short; the agency-page card sits at the bottom.
 */

const AgencySidebar = ({
  variant = 'expanded',
  activeId,
  session,
  onToggle,
  toggleLabel,
  onNavigate,
  className,
}) => {
  const rail = variant === 'rail';
  log('render', { variant, activeId });
  return (
    <nav
      aria-label="Agency"
      className={classNames(
        'relative flex h-full flex-col overflow-x-hidden overflow-y-auto bg-white',
        rail
          ? 'w-[80px] items-center gap-[16px] px-[8px] pt-[56px] pb-[24px]'
          : 'w-[303px] gap-[20px] px-[12px] pt-[56px] pb-[40px]',
        className
      )}
    >
      {onToggle ? (
        <button
          type="button"
          onClick={onToggle}
          aria-label={toggleLabel ?? (rail ? 'Expand sidebar' : 'Collapse sidebar')}
          aria-expanded={toggleLabel ? undefined : !rail}
          className={classNames(
            'absolute top-[18px] flex size-[28px] items-center justify-center rounded-[8px] text-[#999999] hover:bg-[#ebf1ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
            rail ? 'left-1/2 -translate-x-1/2' : 'right-[9px]'
          )}
        >
          <AgencySidebarToggleIcon
            className={classNames('h-[20px] w-[23px]', rail && 'rotate-180')}
          />
        </button>
      ) : null}
      {rail ? (
        <span
          aria-hidden="true"
          className="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-[#387440] font-sans text-[16px] leading-[20px] font-semibold text-white"
        >
          {session.analyst.monogram}
        </span>
      ) : (
        <AgencyPersonaCard session={session} onNavigate={onNavigate} className="shrink-0" />
      )}
      <div
        className={classNames(
          'flex w-full flex-col',
          rail ? 'items-center gap-[12px]' : 'gap-[12px] px-[12px] pt-[6px]'
        )}
      >
        <div className={classNames('flex flex-col gap-[4px]', rail && 'items-center')}>
          {PRIMARY_NAV.map((item) => (
            <AgencyNavItem
              key={item.id}
              item={item}
              variant={variant}
              active={activeId === item.id}
              onNavigate={onNavigate}
            />
          ))}
        </div>
        <div role="separator" className="h-px w-full rounded-full bg-[#e1eae2]" />
        <div className={classNames('flex flex-col gap-[4px]', rail && 'items-center')}>
          {SECONDARY_NAV.map((item) => (
            <AgencyNavItem
              key={item.id}
              item={item}
              variant={variant}
              active={activeId === item.id}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
      {rail ? (
        <Link
          to="/agency/public-page"
          aria-label="Preview public view"
          title="Preview public view"
          className="mt-auto flex size-[44px] items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <AgencyLinkIcon className="size-[18px]" />
        </Link>
      ) : (
        <div className="mt-auto px-[12px] pt-[20px]">
          <AgencyPageCard session={session} onNavigate={onNavigate} />
        </div>
      )}
    </nav>
  );
};

export default AgencySidebar;
