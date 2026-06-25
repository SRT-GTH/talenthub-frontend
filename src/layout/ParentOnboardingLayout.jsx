import { Outlet, useLocation } from 'react-router-dom';
import ParentLoginRightPanel from '../components/sections/parentLogin/ParentLoginRightPanel.jsx';
import ParentOnboardingBreadcrumb from '../components/shared/ParentOnboardingBreadcrumb.jsx';
import {
  LOGIN_PHOTO_CARDS,
  LoginOverlayCards,
} from '../components/sections/parentLogin/ParentLoginPanelContent.jsx';
import {
  WELCOME_PHOTO_CARDS,
  WelcomeOverlayCards,
  SignupOverlayCards,
} from '../components/sections/parentLogin/ParentWelcomePanelContent.jsx';
import SuccessPanelContent from '../components/sections/parentLogin/ParentSuccessPanelContent.jsx';
import { debug } from '../utils/debug.js';

const log = debug('ParentOnboardingLayout');

/*
 * ParentOnboardingLayout — shared shell for all parent onboarding routes
 * (/onboarding/parent-*).
 *
 * Provides:
 *   • Page-level background glow ellipses (z:-1)
 *   • ParentOnboardingBreadcrumb — shown on all sign-up steps (not login/welcome)
 *   • <Outlet /> — the left content column rendered by the matched child route
 *   • ParentLoginRightPanel — single panel component; photo cards and overlay
 *     content swapped per route:
 *       parent-login   → LOGIN_PHOTO_CARDS + LoginOverlayCards
 *       parent-welcome → WELCOME_PHOTO_CARDS + WelcomeOverlayCards
 *       sign-up steps  → WELCOME_PHOTO_CARDS + SignupOverlayCards (adds Active badge)
 *
 * Mirrors InstitutionOnboardingLayout in structure.
 */

// Ordered path segments for each parent sign-up step — used to compute the
// active breadcrumb step index and completion percentage.
const PARENT_STEP_PATHS = [
  '/onboarding/parent-identity',
  '/onboarding/parent-verification',
  '/onboarding/parent-contact',
  '/onboarding/parent-security',
  '/onboarding/parent-link-ward',
  '/onboarding/parent-review',
  '/onboarding/parent-done',
];

const ParentOnboardingLayout = () => {
  const { pathname } = useLocation();
  const isLogin = pathname.includes('parent-login');
  const isWelcome = pathname.includes('parent-welcome');
  const isSignupStep = !isLogin && !isWelcome;
  const isDone = pathname.includes('parent-done');
  // Full-width steps that render no right panel (mirrors institution layout).
  const showRightPanel = !pathname.includes('parent-review');

  const stepIndex = PARENT_STEP_PATHS.findIndex((p) => pathname.startsWith(p));
  const currentStep = stepIndex >= 0 ? stepIndex : 0;
  // Terminal "done" step reads as fully complete (100%); others scale by index.
  const completionPercent = isDone
    ? 100
    : Math.round((currentStep / PARENT_STEP_PATHS.length) * 100);

  log('mount', { pathname, isLogin, isWelcome, isSignupStep, currentStep, completionPercent });

  const photoCards = isLogin ? LOGIN_PHOTO_CARDS : WELCOME_PHOTO_CARDS;
  const overlayContent = isLogin ? (
    <LoginOverlayCards />
  ) : isSignupStep ? (
    <SignupOverlayCards />
  ) : (
    <WelcomeOverlayCards />
  );

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      {/* Breadcrumb — sign-up steps only, not login or welcome (fixed height) */}
      {isSignupStep && (
        <ParentOnboardingBreadcrumb
          currentStep={currentStep}
          completionPercent={completionPercent}
        />
      )}

      <section className="relative flex flex-1 min-h-0 overflow-hidden">
        {/* ── TL gold gradient glow (2884:64763) ── */}
        {/* GRADIENT_LINEAR #f5c451→#d6a243→#f5bd4f, 571×571px, op=0.6 */}
        {/* CSS radial-gradient approximation — no SVG asset for this node */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed rounded-full"
          style={{
            left: '-110px',
            top: '-178px',
            width: '571px',
            height: '571px',
            background:
              'radial-gradient(circle at 40% 40%, rgba(245,196,81,0.85) 0%, rgba(214,162,67,0.65) 38%, transparent 70%)',
            opacity: 0.6,
            zIndex: -1,
          }}
        />

        {/* ── BR red glow (2884:64762) ── */}
        {/* page-ellipse-br.svg — opacity 0.15 baked in the SVG */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed blur-lg  rounded-full"
          style={{
            left: 'calc(83.33% - 16px)',
            top: '610px',
            width: '571px',
            height: '571px',
            background:
              'radial-gradient(circle at 40% 40%, rgba(245,196,81,0.85) 0%, rgba(214,162,67,0.65) 38%, transparent 70%)',
            opacity: 0.4,
            zIndex: -1,
          }}
        />

        {/* ── Left content — rendered by the child route via Outlet.
            Wrapped in a viewport-bounded scroll container so only the form
            column scrolls (navbar + right panel stay fixed); scrollbar hidden
            via no-scrollbar so no bar shows between the columns. ── */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
          <Outlet />
        </div>

        {/* ── Right decorative panel — single component, props per route.
            Hidden on full-width steps (e.g. parent-review); simple variant
            (trophy + stat cards) on the success/done step. ── */}
        {showRightPanel &&
          (isDone ? (
            <ParentLoginRightPanel variant="simple" centerContent={<SuccessPanelContent />} />
          ) : (
            <ParentLoginRightPanel photoCards={photoCards} overlayContent={overlayContent} />
          ))}
      </section>
    </div>
  );
};

export default ParentOnboardingLayout;
