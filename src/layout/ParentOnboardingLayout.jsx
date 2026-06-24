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
import pageEllipseBr from '../assets/hero/page-ellipse-br.svg';
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
  '/onboarding/parent-consent',
  '/onboarding/parent-done',
];

const ParentOnboardingLayout = () => {
  const { pathname } = useLocation();
  const isLogin = pathname.includes('parent-login');
  const isWelcome = pathname.includes('parent-welcome');
  const isSignupStep = !isLogin && !isWelcome;

  const stepIndex = PARENT_STEP_PATHS.findIndex((p) => pathname.startsWith(p));
  const currentStep = stepIndex >= 0 ? stepIndex : 0;
  const completionPercent = Math.round((currentStep / PARENT_STEP_PATHS.length) * 100);

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
    <div className="flex-1 flex flex-col">
      {/* Breadcrumb — sign-up steps only, not login or welcome */}
      {isSignupStep && (
        <ParentOnboardingBreadcrumb
          currentStep={currentStep}
          completionPercent={completionPercent}
        />
      )}

      <section className="relative flex flex-1 overflow-hidden">
        {/* ── TL gold gradient glow (2884:64763) ── */}
        {/* GRADIENT_LINEAR #f5c451→#d6a243→#f5bd4f, 571×571px, op=0.6 */}
        {/* CSS radial-gradient approximation — no SVG asset for this node */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full"
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
          className="pointer-events-none absolute overflow-hidden rounded-full"
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

        {/* ── Left content — rendered by the child route via Outlet ── */}
        <Outlet />

        {/* ── Right decorative panel — single component, props per route ── */}
        <ParentLoginRightPanel photoCards={photoCards} overlayContent={overlayContent} />
      </section>
    </div>
  );
};

export default ParentOnboardingLayout;
