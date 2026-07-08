import { Outlet } from 'react-router-dom';
import { debug } from '../utils/debug.js';
import pageEllipseTl from '../assets/hero/page-ellipse-tl.svg';
import pageEllipseBr from '../assets/hero/page-ellipse-br.svg';

const log = debug('TalentOnboardingLayout');

/*
 * TalentOnboardingLayout — shared shell for the talent auth flow.
 *
 * Wraps /login and /onboarding/talent/* routes. Provides:
 *   • Two fixed page-level background glow ellipses (z:-1, outside the
 *     scrollable content so they persist across every step):
 *       – TL green  (page-ellipse-tl.svg, Figma 2165:22442)
 *       – BR pink   (page-ellipse-br.svg, Figma 2165:22441)
 *   • A flex shell (flex-1 min-h-0) that combines with MainLayout's
 *     h-screen overflow-hidden fixed-shell mode to lock the viewport.
 *
 * Each child route (LoginPage, talent step pages) renders its own
 * two-column layout (left content + OnboardingRightPanel). The layout
 * does NOT inject a right panel — child routes own that.
 *
 * Mirrors InstitutionOnboardingLayout / ParentOnboardingLayout in structure.
 */
const TalentOnboardingLayout = () => {
  log('mount');

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <section className="relative flex flex-1 min-h-0 overflow-hidden">
        {/* ── TL green glow (Figma 2165:22442) ── */}
        {/* Soft green ambient ellipse, bleeds off-screen from the top-left corner */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            left: '-95px',
            top: '-178px',
            width: '571px',
            height: '571px',
            zIndex: -1,
          }}
        >
          <img
            src={pageEllipseTl}
            alt=""
            className="absolute block max-w-none"
            style={{
              inset: '-35.03%',
              width: 'calc(100% + 70.06%)',
              height: 'calc(100% + 70.06%)',
            }}
            draggable={false}
          />
        </div>

        {/* ── BR pink/red glow (Figma 2165:22441) ── */}
        {/* Soft rose ambient ellipse, anchored to the bottom-right area */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            left: 'calc(83.33% - 16px)',
            top: '610px',
            width: '571px',
            height: '571px',
            zIndex: -1,
          }}
        >
          <img
            src={pageEllipseBr}
            alt=""
            className="absolute block max-w-none"
            style={{
              inset: '-35.03%',
              width: 'calc(100% + 70.06%)',
              height: 'calc(100% + 70.06%)',
            }}
            draggable={false}
          />
        </div>

        {/* Child route renders its own two-column layout (form + right panel) */}
        <Outlet />
      </section>
    </div>
  );
};

export default TalentOnboardingLayout;
