import { Outlet, useLocation } from 'react-router-dom';
import InstitutionRightPanel from '../components/sections/institutionOnboarding/InstitutionRightPanel.jsx';
import InstitutionOnboardingBreadcrumb from '../components/shared/InstitutionOnboardingBreadcrumb.jsx';
// page-level background glow ellipses (2971:65357 / 2971:65356 / 2971:65358)
import pageEllipseTl from '../assets/hero/page-ellipse-tl.svg';
import pageEllipseBr from '../assets/hero/page-ellipse-br.svg';
import pageEllipseCenter from '../assets/hero/page-ellipse-center.svg';
import { debug } from '../utils/debug.js';

const log = debug('InstitutionOnboardingLayout');

/*
 * InstitutionOnboardingLayout — shared shell for every institution onboarding
 * route (/onboarding/institution/*).
 *
 * Provides:
 *   • InstitutionOnboardingBreadcrumb — shown on every step except /guidelines
 *   • Page-level background glow ellipses (3 SVGs, z:-1)
 *   • <Outlet /> — the left content column rendered by the matched child route
 *   • InstitutionRightPanel — the shared decorative green right panel
 *
 * The breadcrumb is hidden on the guidelines screen (which is a pre-form
 * splash) and shown on all form steps. WatchTutorial in the right panel
 * follows the same gate.
 *
 * Min-height accounting:
 *   OnboardingNavbar: ~90px rendered; the 160px constant below gives comfortable
 *   room for the nav + any sub-pixel rounding. With breadcrumb (h-12 = 48px)
 *   the section needs an additional 48px subtracted.
 *
 * Step-path mapping (for currentStep calculation):
 *   index 0 → /your-institution
 *   index 1 → /contact
 *   index 2 → /activate
 *   … (add as pages are built)
 */

const STEP_PATHS = [
  '/onboarding/institution/your-institution',
  '/onboarding/institution/contact',
  '/onboarding/institution/activate',
  '/onboarding/institution/template',
  '/onboarding/institution/upload',
  '/onboarding/institution/validate',
  '/onboarding/institution/confirm',
  '/onboarding/institution/report',
];

const InstitutionOnboardingLayout = () => {
  const { pathname } = useLocation();

  // Guidelines page is a splash screen — no breadcrumb, no WatchTutorial.
  const showBreadcrumb = !pathname.endsWith('/guidelines');

  // Activate + Template + Validate + Confirm + Report pages use the full width — no right panel.
  // Figma: 2973:79786 (activate), 2977:85777 (template), 3016:60108 (validate), 3040:71814 (confirm),
  //        3052:74319 / 3065:7371 (report).
  const showRightPanel =
    !pathname.endsWith('/activate') &&
    !pathname.endsWith('/template') &&
    !pathname.endsWith('/validate') &&
    !pathname.endsWith('/confirm') &&
    !pathname.endsWith('/report');

  // Map path → 0-based step index (falls back to 0 if not in list, e.g. /guidelines).
  const rawIndex = STEP_PATHS.findIndex((p) => pathname.startsWith(p));
  const currentStep = rawIndex >= 0 ? rawIndex : 0;

  // Completion = percentage of steps reached.
  const completionPercent = Math.round((currentStep / STEP_PATHS.length) * 100);

  log('mount', { pathname, showBreadcrumb, showRightPanel, currentStep, completionPercent });

  return (
    // flex-1 + flex-col: fills <main> (which is itself flex-1 flex-col in MainLayout),
    // so the section below can use flex-1 to fill whatever space remains after the breadcrumb.
    <div className="flex flex-1 min-h-0 flex-col">
      {/* Breadcrumb — fixed height above the section */}
      {showBreadcrumb && (
        <InstitutionOnboardingBreadcrumb
          currentStep={currentStep}
          completionPercent={completionPercent}
        />
      )}

      {/* Main two-column section:
          flex-1 → fills all remaining height after the breadcrumb (or all of <main> when
          breadcrumb is hidden). This replaces the old min-h-[calc(100vh-Xpx)] approach
          which was fragile because it depended on the navbar's rendered height.
          left  = <Outlet /> (flex-1 content column from child route)
          right = InstitutionRightPanel (fixed-width decorative panel)  */}
      <section className="relative flex flex-1 min-h-0 overflow-hidden">
        {/* ── Page background glow ellipses (behind all in-flow content) ── */}

        {/* 2971:65357 — green gradient glow, top-left corner, bleeds off-screen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute overflow-hidden rounded-full"
          style={{
            left: '-95px' /* px — Figma 2971:65353 frame-relative */,
            top: '-178px' /* px */,
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

        {/* 2971:65356 — red glow, bottom-right area (opacity 0.15 in the SVG) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute overflow-hidden rounded-full"
          style={{
            left: 'calc(83.33% - 16px)' /* % — Figma 2971:65353 */,
            top: '610px' /* px */,
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

        {/* 2971:65358 — gold/orange glow, centre-left (opacity 0.1 in the SVG) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute overflow-hidden rounded-full"
          style={{
            left: 'calc(33.33% + 100px)' /* % + px — Figma 2971:65353 */,
            top: 'calc(50% - 200px)' /* % + px — vertical centre offset */,
            transform: 'translateY(-50%)',
            width: '473px',
            height: '473px',
            zIndex: -1,
          }}
        >
          <img
            src={pageEllipseCenter}
            alt=""
            className="absolute block max-w-none"
            style={{
              inset: '-42.28%',
              width: 'calc(100% + 84.56%)',
              height: 'calc(100% + 84.56%)',
            }}
            draggable={false}
          />
        </div>

        {/* ── Left content — rendered by the child route via Outlet.
            Viewport-bounded scroll container: only the form column scrolls
            (navbar + right panel stay fixed); scrollbar hidden via no-scrollbar
            so no bar shows between the columns. ── */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
          <Outlet />
        </div>

        {/* ── Right decorative panel — hidden on full-width steps ── */}
        {showRightPanel && <InstitutionRightPanel showWatchTutorial={showBreadcrumb} />}
      </section>
    </div>
  );
};

export default InstitutionOnboardingLayout;
