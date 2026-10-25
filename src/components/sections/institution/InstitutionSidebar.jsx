import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import InstitutionNavItem from './InstitutionNavItem.jsx';
import InstitutionPageCard from './InstitutionPageCard.jsx';
import InstitutionPersonaCard from './InstitutionPersonaCard.jsx';
import { InstitutionLinkIcon, InstitutionSidebarToggleIcon } from './institutionIcons.jsx';
import { PRIMARY_NAV, SECONDARY_NAV } from './institutionNav.js';

const log = debug('InstitutionSidebar');

/*
 * InstitutionSidebar — the left rail of the institution chrome (Figma "Sidebar" 8585:342, 303 wide, white).
 *   variant="expanded"  303: toggle · persona card · main nav (Home … Credentials) | divider | Progress · "Your institution page" card
 *   variant="rail"      80 : icon-only (⚠️ ASSUMPTION: no collapsed rail is drawn): monogram, the nav tiles, a link button for the institution page
 * The toggle is the `ep:d-arrow-left` button (Figma 8798:441862): it collapses / expands (mirrored when collapsed). onToggle is omitted
 * in the drawer (phone / tablet), which has no toggle. The nav block scrolls when the viewport is short; the institution-page card sits at the bottom.
 */

const InstitutionSidebar = ({
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
      aria-label="Institution"
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
          <InstitutionSidebarToggleIcon
            className={classNames('h-[20px] w-[23px]', rail && 'rotate-180')}
          />
        </button>
      ) : null}
      {rail ? (
        <span
          aria-hidden="true"
          className="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-[#387440] font-sans text-[16px] leading-[20px] font-semibold text-white"
        >
          {session.admin.monogram}
        </span>
      ) : (
        <InstitutionPersonaCard session={session} onNavigate={onNavigate} className="shrink-0" />
      )}
      <div
        className={classNames(
          'flex w-full flex-col',
          rail ? 'items-center gap-[12px]' : 'gap-[12px] px-[12px] pt-[6px]'
        )}
      >
        <div className={classNames('flex flex-col gap-[4px]', rail && 'items-center')}>
          {PRIMARY_NAV.map((item) => (
            <InstitutionNavItem
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
            <InstitutionNavItem
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
          to="/institution/public-page"
          aria-label="Preview as a student"
          title="Preview as a student"
          className="mt-auto flex size-[44px] items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <InstitutionLinkIcon className="size-[18px]" />
        </Link>
      ) : (
        <div className="mt-auto px-[12px] pt-[20px]">
          <InstitutionPageCard session={session} onNavigate={onNavigate} />
        </div>
      )}
    </nav>
  );
};

export default InstitutionSidebar;
