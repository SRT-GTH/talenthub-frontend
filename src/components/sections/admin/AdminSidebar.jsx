import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import AdminNavItem from './AdminNavItem.jsx';
import AdminHandbookCard from './AdminHandbookCard.jsx';
import AdminPersonaCard from './AdminPersonaCard.jsx';
import { AgencyLinkIcon, AgencySidebarToggleIcon } from '../agency/agencyIcons.jsx';
import { PRIMARY_NAV, SECONDARY_NAV } from './adminNav.js';

const log = debug('AdminSidebar');

/*
 * AdminSidebar — the left rail of the admin chrome (Figma "Sidebar" 303 wide, white; same rail as the agency portal).
 *   variant="expanded"  303: toggle · persona card · main nav (Home … Reports) | divider | Live ops, Audit log, Settings · "Staff handbook" card
 *   variant="rail"      80 : icon-only (⚠️ ASSUMPTION: no collapsed rail is drawn): monogram, the nav tiles, a link button for the handbook
 * The toggle is the `ep:d-arrow-left` button: it collapses / expands (mirrored when collapsed). onToggle is omitted in the drawer
 * (phone / tablet), which has no toggle. The nav block scrolls when the viewport is short; the handbook card sits at the bottom.
 */

const AdminSidebar = ({
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
      aria-label="Admin"
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
          {session.staff.monogram}
        </span>
      ) : (
        <AdminPersonaCard session={session} onNavigate={onNavigate} className="shrink-0" />
      )}
      <div
        className={classNames(
          'flex w-full flex-col',
          rail ? 'items-center gap-[12px]' : 'gap-[12px] px-[12px] pt-[6px]'
        )}
      >
        <div className={classNames('flex flex-col gap-[4px]', rail && 'items-center')}>
          {PRIMARY_NAV.map((item) => (
            <AdminNavItem
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
            <AdminNavItem
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
          to="/admin/settings/roles"
          aria-label="Staff handbook"
          title="Staff handbook"
          className="mt-auto flex size-[44px] items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <AgencyLinkIcon className="size-[18px]" />
        </Link>
      ) : (
        <div className="mt-auto px-[12px] pt-[20px]">
          <AdminHandbookCard session={session} onNavigate={onNavigate} />
        </div>
      )}
    </nav>
  );
};

export default AdminSidebar;
