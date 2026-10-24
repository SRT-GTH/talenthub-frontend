import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import PublicFooter from './PublicFooter.jsx';
import PublicMobileTabs from './PublicMobileTabs.jsx';
import PublicSidebar from './PublicSidebar.jsx';
import PublicTopBar from './PublicTopBar.jsx';
import OfflineBanner from './status/OfflineBanner.jsx';
import { offlineFreshness } from './status/publicDataCache.js';
import useOnlineStatus from './status/useOnlineStatus.js';
import { activeNavId } from './publicDataNav.js';

const log = debug('PublicDataFrame');

/*
 * PublicDataFrame — the page chrome of every Theme 8 public-data screen (Figma canvas 8477:209484, Focused style, no sign-in).
 *   desktop >= xl (1280): sidebar 288 (or the 80 rail when ?rail=collapsed) + main column (top bar · body · footer)
 *   tablet md..xl (768-1279): icon rail 80 (Figma "Tablet (1024)")
 *   mobile < md: no sidebar; top bar with the menu button; the drawer (300 + 50% scrim, 8.9.2) opens with ?drawer=1
 * Props: data (usePublicDataState()), title (top-bar context label; it is a <p>: every page renders its own single <h1>), active (nav id;
 * defaults from the pathname), children, noFooter, hideMobileTabs (the mobile methodology frame has no section tabs).
 * Modals (share, download, digest ...) are mounted by the sections that draw them, keyed on data.modal; the chrome only opens them
 * (Share / Download PDF / Monthly digest set ?modal=…).
 * The page behind is #f8f8f4. Playful never applies here (Phase 1 of 5 is Focused only).
 */

const PublicDataFrame = ({
  data,
  title = 'Home',
  active,
  freshness,
  children,
  noFooter = false,
  hideMobileTabs = false,
  className,
}) => {
  const { pathname } = useLocation();
  const activeId = active ?? activeNavId(pathname);
  const { rail, drawer, update } = data;
  const online = useOnlineStatus();

  useEffect(() => {
    log('mount', { pathname, rail, drawer, activeId });
  }, [pathname, rail, drawer, activeId]);

  // The page uses its own scrollbar-free body; lock background scroll while the mobile drawer is open.
  useEffect(() => {
    if (!drawer) return undefined;
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

  const openModal = (name) => update({ modal: name, drawer: null });
  const closeDrawer = () => update({ drawer: null });

  return (
    <div
      data-public-data=""
      className={classNames(
        'min-h-screen bg-[#f8f8f4] font-sans text-[#1c2a21] md:flex',
        className
      )}
    >
      <a
        href="#public-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-[8px] focus:bg-white focus:px-[12px] focus:py-[8px]"
      >
        Skip to content
      </a>
      {/* desktop: expanded or collapsed rail; tablet: always the rail */}
      <div className="sticky top-0 hidden h-screen shrink-0 self-start md:block">
        <div className={classNames('h-full', rail ? 'block' : 'xl:hidden')}>
          <PublicSidebar
            variant="rail"
            activeId={activeId}
            onModal={openModal}
            onToggle={rail ? () => update({ rail: null }) : undefined}
          />
        </div>
        {!rail ? (
          <div className="hidden h-full xl:block">
            <PublicSidebar
              variant="expanded"
              activeId={activeId}
              onModal={openModal}
              onToggle={() => update({ rail: 'collapsed' })}
            />
          </div>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <PublicTopBar
          title={title}
          freshness={online ? freshness : offlineFreshness()}
          q={data.q}
          onSearch={(q) => update({ q: q || null }, { replace: true })}
          onShare={() => update({ modal: 'share' })}
          onDownload={() => update({ modal: 'download' })}
          onMenu={() => update({ drawer: true })}
        />
        <OfflineBanner />
        <main id="public-main" tabIndex={-1} className="min-w-0 flex-1 outline-none">
          {hideMobileTabs ? null : (
            <PublicMobileTabs activeId={activeId} className="px-[16px] pt-[20px]" />
          )}
          {children}
        </main>
        {noFooter ? null : <PublicFooter onModal={openModal} />}
      </div>
      {drawer ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeDrawer}
            className="absolute inset-0 cursor-default bg-[#121712]/50"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute inset-y-0 left-0 w-[300px] max-w-[85vw] shadow-[8px_0_32px_rgba(0,0,0,0.16)]"
          >
            <PublicSidebar
              variant="expanded"
              activeId={activeId}
              onModal={openModal}
              onNavigate={closeDrawer}
              className="w-full"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PublicDataFrame;
