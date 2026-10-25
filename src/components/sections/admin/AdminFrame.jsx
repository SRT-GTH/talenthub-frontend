import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import DashboardPageBackground from '../dashboard/DashboardPageBackground.jsx';
import AgencyBuddyFab from '../agency/AgencyBuddyFab.jsx';
import AdminSidebar from './AdminSidebar.jsx';
import AdminTopBar from './AdminTopBar.jsx';
import { activeNavId } from './adminNav.js';
import { useAdminSession } from './useAdminSession.js';

const log = debug('AdminFrame');

/*
 * AdminFrame — the page chrome of every signed-in Theme 7 admin screen (Figma canvas 8520:12, e.g. frame 7.0.2a 8623:9; Focused style only).
 *   >= xl (1280) : top bar · rail 303 (or the 80 icon rail with ?rail=collapsed) · main column · Ask Buddy pill
 *   lg..xl       : the 80 icon rail (always)
 *   < lg (1024)  : phone / tablet top bar (menu · GTH · bell · avatar); the menu opens the drawer (?drawer=1)
 *                  ⚠️ ASSUMPTION: Figma draws the admin back office at desktop width only; the phone / tablet chrome follows the agency portal
 * Props: data (useAdminState()), title (accessible name of the main landmark; every page renders its own single <h1>), active (nav id,
 * defaults from the pathname), children, className.
 * Children are laid out as a column with a 30px gap (16px on phones) under a 16px top padding; wrap content in ONE element for another layout.
 * The page behind is the shared dashboard background (grid + 3 blurred ellipses). Modals are mounted by the pages that draw them, keyed on data.modal.
 */

const AdminFrame = ({ data, title = 'Admin', active, children, className }) => {
  const { pathname } = useLocation();
  const session = useAdminSession();
  const activeId = active ?? activeNavId(pathname);
  const { rail, drawer, update } = data;
  const menuButtonRef = useRef(null);
  const drawerRef = useRef(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    log('mount', { pathname, rail, drawer, activeId, role: session.role });
  }, [pathname, rail, drawer, activeId, session.role]);

  // The drawer locks the page scroll, closes with Esc and gives the focus back to the menu button.
  useEffect(() => {
    if (!drawer) {
      if (wasOpen.current) menuButtonRef.current?.focus();
      wasOpen.current = false;
      return undefined;
    }
    wasOpen.current = true;
    drawerRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') update({ drawer: null });
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [drawer, update]);

  const closeDrawer = () => update({ drawer: null });

  return (
    <div
      data-admin=""
      className={classNames('relative min-h-dvh bg-white font-sans text-[#1c2a21]', className)}
    >
      <DashboardPageBackground className="z-0" />
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-[8px] focus:bg-white focus:px-[12px] focus:py-[8px]"
      >
        Skip to content
      </a>
      <div className="relative z-10 flex min-h-dvh flex-col">
        <AdminTopBar
          session={session}
          data={data}
          modalOpen={data.modal === 'profile'}
          menuButtonRef={menuButtonRef}
        />
        <div className="flex min-h-0 flex-1">
          <aside className="sticky top-[88px] hidden h-[calc(100dvh-88px)] shrink-0 self-start lg:block">
            <div className={classNames('h-full', rail ? 'block' : 'xl:hidden')}>
              <AdminSidebar
                variant="rail"
                activeId={activeId}
                session={session}
                onToggle={rail ? () => update({ rail: null }) : undefined}
              />
            </div>
            {rail ? null : (
              <div className="hidden h-full xl:block">
                <AdminSidebar
                  variant="expanded"
                  activeId={activeId}
                  session={session}
                  onToggle={() => update({ rail: 'collapsed' })}
                />
              </div>
            )}
          </aside>
          <main
            id="admin-main"
            tabIndex={-1}
            aria-label={title}
            className="flex min-w-0 flex-1 flex-col gap-[16px] px-[16px] pt-[16px] pb-[112px] outline-none lg:gap-[30px] lg:pr-[clamp(24px,3.24vw,56px)] lg:pl-[clamp(24px,2.3vw,40px)]"
          >
            {children}
          </main>
        </div>
      </div>
      <AgencyBuddyFab />
      {drawer ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close menu"
            onClick={closeDrawer}
            className="absolute inset-0 cursor-default bg-[#121712]/50"
          />
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            tabIndex={-1}
            className="absolute inset-y-0 left-0 w-[303px] max-w-[88vw] bg-white shadow-[8px_0_32px_rgba(0,0,0,0.16)] outline-none"
          >
            <AdminSidebar
              variant="expanded"
              activeId={activeId}
              session={session}
              onToggle={closeDrawer}
              toggleLabel="Close menu"
              onNavigate={closeDrawer}
              className="!w-full"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminFrame;
