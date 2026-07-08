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
import WardInvitePanelContent from '../components/sections/parentLogin/ParentInvitePanelContent.jsx';
import WardInviteStepsPanelContent from '../components/sections/parentLogin/ParentInviteStepsPanelContent.jsx';
import WardLinkPanelContent from '../components/sections/parentLogin/ParentInviteLinkPanelContent.jsx';
import WardConsentPanelContent from '../components/sections/parentLogin/ParentInviteConsentPanelContent.jsx';
import { WARD_INVITE_STEP_PANELS } from '../constants/parentFlows.js';
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
  const { pathname, key: locationKey } = useLocation();
  const isLogin = pathname.includes('parent-login');
  const isWelcome = pathname.includes('parent-welcome');
  // Flow B (ward-invited): the bare welcome has no breadcrumb + ward-invite
  // panel; its step screens (parent-invited-*) show the breadcrumb + the
  // step-list panel.
  const isInvited = pathname.includes('parent-invited');
  const isInvitedWelcome = pathname.endsWith('parent-invited');
  const isInvitedStep = isInvited && !isInvitedWelcome;
  const isSignupStep = !isLogin && !isWelcome && !isInvited;
  const isDone = pathname.includes('parent-done');
  // Full-width steps that render no right panel (mirrors institution layout).
  const showRightPanel = !pathname.includes('parent-review');

  // Flow B step screens drive the breadcrumb from their per-step config; Flow A
  // steps derive it from PARENT_STEP_PATHS.
  const invitedPanel = isInvitedStep
    ? WARD_INVITE_STEP_PANELS[pathname.replace('/onboarding/', '')]
    : null;
  const stepIndex = PARENT_STEP_PATHS.findIndex((p) => pathname.startsWith(p));
  const currentStep = invitedPanel ? invitedPanel.currentStep : stepIndex >= 0 ? stepIndex : 0;
  // Terminal "done" step reads as fully complete (100%); others scale by index.
  const completionPercent = isDone
    ? 100
    : invitedPanel
      ? invitedPanel.percent
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
      {/* Breadcrumb — on Flow A sign-up steps and Flow B step screens (not the
          login / welcome / invited-welcome entries; fixed height). */}
      {(isSignupStep || isInvitedStep) && (
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
          className="pointer-events-none fixed"
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
          className="pointer-events-none fixed blur-lg"
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
        <div key={locationKey} className="page-fade-in flex-1 min-h-0 overflow-y-auto no-scrollbar">
          <Outlet />
        </div>

        {/* ── Right decorative panel — single component, props per route.
            Hidden on full-width steps (e.g. parent-review); simple variant on
            the success/done step (trophy + stat cards) and the ward-invited
            Flow B welcome (ward-invite cards); photo panel everywhere else. ── */}
        {showRightPanel &&
          (isDone ? (
            <ParentLoginRightPanel variant="simple" centerContent={<SuccessPanelContent />} />
          ) : isInvitedStep ? (
            <ParentLoginRightPanel
              variant="simple"
              centerContent={
                invitedPanel?.panel === 'link' ? (
                  <WardLinkPanelContent />
                ) : invitedPanel?.panel === 'consent' ? (
                  <WardConsentPanelContent />
                ) : (
                  <WardInviteStepsPanelContent {...(invitedPanel ?? {})} />
                )
              }
            />
          ) : isInvitedWelcome ? (
            <ParentLoginRightPanel variant="simple" centerContent={<WardInvitePanelContent />} />
          ) : (
            <ParentLoginRightPanel photoCards={photoCards} overlayContent={overlayContent} />
          ))}
      </section>
    </div>
  );
};

export default ParentOnboardingLayout;
