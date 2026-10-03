import { useEffect, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import DashboardTopNav from './DashboardTopNav.jsx';
import DashboardSidebar from './DashboardSidebar.jsx';
import DashboardPageBackground from './DashboardPageBackground.jsx';
import CareerBuddyFloatingButton from '../community/CareerBuddyFloatingButton.jsx';

const log = debug('DashboardShell');

/*
 * DashboardShell — page chrome shared by both community routes.
 *
 *   [ page background: grid texture @70% + three blurred ellipses ]
 *   [ DashboardTopNav                                             ]
 *   [ DashboardSidebar | children                                 ]
 *   [ CareerBuddyFloatingButton — fixed bottom-right, every screen ]
 *
 * Mounted OUTSIDE MainLayout (same as /profile/engagement/*) because Figma's
 * frames carry their own dashboard chrome — no landing Navbar/Footer, no
 * onboarding nav. Verified against frames 7025:85167 and 7025:86093.
 *
 * Background geometry is expressed as % of Figma's 1728x1117 frame so it
 * scales with the viewport, and is `fixed` so it does not scroll away.
 *
 * ROLE
 * ----
 * Every frame in this set is titled "Recruiter …" — Recruiter Home, Recruiter
 * Talent Search, and the ten community frames — and the rail is recruiter
 * content throughout (HR Lead chip, Talent Search / Job Postings / Application
 * Pipeline, Active Jobs / Applicants, gth.com/recruiter/…, "Preview as
 * talent"). Figma ships no talent or parent variant of this chrome.
 *
 * This used to read the app-root CareerBuddyRoleContext and warn whenever that
 * context said "talent" — which it does by default, so every dashboard screen
 * logged a spurious warning while still rendering the recruiter rail. That
 * context governs which Career Buddy experience mounts at
 * /profile/filling/career-buddy; it was never about this chrome. The coupling
 * is removed: per Figma, this shell IS the recruiter dashboard. When a talent
 * or parent rail is designed, give it its own dataset here.
 */

const DashboardShell = ({
  children,
  defaultSidebarCollapsed = false,
  contentClassName,
  mainClassName,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(defaultSidebarCollapsed);

  useEffect(() => {
    log('mount', { role: 'recruiter', defaultSidebarCollapsed });
  }, [defaultSidebarCollapsed]);

  return (
    /* Fixed viewport shell — nav + rail are chrome, only the content column
       scrolls. Mirrors MainLayout's `h-screen overflow-hidden` pattern and
       matches Figma, where the rail is a fixed 977px column and the
       annotations describe headers that "remain fixed on scroll". */
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-white">
      {/* --- page background (Figma 7025:85168 grid + 7025:85170-172 ellipses) --- */}
      <DashboardPageBackground className="z-0" />

      <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col">
        <DashboardTopNav className="shrink-0" />

        <div className={classNames('flex min-h-0 w-full flex-1', contentClassName)}>
          <DashboardSidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
            /* No overflow clipping on the rail itself — the collapsed rail's
               public-profile popover has to escape it. The rail scrolls its
               own nav block internally instead. */
            className="hidden h-full lg:flex"
          />

          {/* No horizontal/top padding here on purpose — a `position: sticky`
              child sticks to the *padding edge*, not the border edge, so any
              padding on this scroll container would leave a permanent gap
              above every sticky bar (and inset it from the true left/right
              edges) that scrolled content bleeds through forever. Padding
              lives on each page's own non-sticky wrappers instead; sticky
              bars span this element's full, unpadded box. */}
          <main
            className={classNames(
              'min-h-0 min-w-0 flex-1 overflow-y-auto pb-[64px]',
              mainClassName
            )}
          >
            {children}
          </main>
        </div>
      </div>

      <CareerBuddyFloatingButton />
    </div>
  );
};

export default DashboardShell;
