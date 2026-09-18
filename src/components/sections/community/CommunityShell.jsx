import { useEffect, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { useCareerBuddyRole } from '../../../hooks/useCareerBuddyRole.js';
import CommunityTopNav from './CommunityTopNav.jsx';
import CommunitySidebar from './CommunitySidebar.jsx';
import CommunityPageBackground from './CommunityPageBackground.jsx';
import CareerBuddyFloatingButton from './CareerBuddyFloatingButton.jsx';

const log = debug('CommunityShell');

/*
 * CommunityShell — page chrome shared by both community routes.
 *
 *   [ page background: grid texture @70% + three blurred ellipses ]
 *   [ CommunityTopNav                                             ]
 *   [ CommunitySidebar | children                                 ]
 *   [ CareerBuddyFloatingButton — fixed bottom-right, every screen ]
 *
 * Mounted OUTSIDE MainLayout (same as /profile/engagement/*) because Figma's
 * frames carry their own dashboard chrome — no landing Navbar/Footer, no
 * onboarding nav. Verified against frames 7025:85167 and 7025:86093.
 *
 * Background geometry is expressed as % of Figma's 1728x1117 frame so it
 * scales with the viewport, and is `fixed` so it does not scroll away.
 *
 * ROLE GATING
 * -----------
 * Figma provides ONE role's screens: the frames are named "Recruiter Home",
 * the sidebar is recruiter-specific, and the feed/community content itself is
 * identical regardless of who is viewing. So this is a SINGLE route pair
 * (/community and /community/:communityId), not two role-split routes.
 *
 * The shell still reads the app-root CareerBuddyRoleContext — the same
 * provider that gates Career Buddy — so that when talent/parent sidebar
 * frames land, only the dataset lookup needs to change here. Until then a
 * non-recruiter role renders the recruiter dataset and logs a warning rather
 * than inventing copy that Figma never specified. `❓ NEEDS-CLARIFICATION`
 */

const CommunityShell = ({
  children,
  defaultSidebarCollapsed = false,
  contentClassName,
  mainClassName,
}) => {
  const { role } = useCareerBuddyRole();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(defaultSidebarCollapsed);

  useEffect(() => {
    log('mount', { role, defaultSidebarCollapsed });
    if (role !== 'recruiter') {
      log.warn(
        `role "${role}" has no dedicated community sidebar in Figma — falling back to the recruiter dataset (see communityData.js role note)`
      );
    }
  }, [role, defaultSidebarCollapsed]);

  return (
    /* Fixed viewport shell — nav + rail are chrome, only the content column
       scrolls. Mirrors MainLayout's `h-screen overflow-hidden` pattern and
       matches Figma, where the rail is a fixed 977px column and the
       annotations describe headers that "remain fixed on scroll". */
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-white">
      {/* --- page background (Figma 7025:85168 grid + 7025:85170-172 ellipses) --- */}
      <CommunityPageBackground className="z-0" />

      <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col">
        <CommunityTopNav className="shrink-0" />

        <div className={classNames('flex min-h-0 w-full flex-1', contentClassName)}>
          <CommunitySidebar
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

export default CommunityShell;
