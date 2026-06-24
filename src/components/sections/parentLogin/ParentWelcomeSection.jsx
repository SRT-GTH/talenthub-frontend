import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WavyDivider from '../../shared/WavyDivider.jsx';
import Toast from '../../ui/Toast.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('ParentWelcomeSection');

/*
 * ParentWelcomeSection — left content column for the parent welcome / sign-up
 * screen (Figma 2865:44066). Rendered inside ParentOnboardingLayout via <Outlet>.
 *
 * Shown when a parent arrives via ward's notification (opt-out model).
 * Displays context about how the platform works + CTAs to create account or opt-out.
 * Auto-shows a success Toast on mount confirming ward registration.
 */

// ── WelcomeBackBadge ─────────────────────────────────────────────────────────
// Figma 2900:76717 — identical structure to the one in ParentLoginSection.
const WelcomeBackBadge = () => (
  <span
    className="inline-flex w-fit items-center gap-2 rounded-[8px] px-3 py-[5px]"
    style={{ backgroundColor: '#f7efdd', border: '1px solid #eedeb8' }}
  >
    <span
      className="shrink-0 rounded-full"
      style={{
        width: 8,
        height: 8,
        backgroundColor: '#eedeb8',
        border: '1.5px solid #c8951a',
        boxShadow: '0 0 4px #f5c451',
      }}
    />
    <span
      className="font-sans font-normal text-[12px] leading-[18px]"
      style={{ color: '#c8951a', letterSpacing: '0.4px' }}
    >
      WELCOME BACK
    </span>
  </span>
);

// ── HowThisWorksBadge ────────────────────────────────────────────────────────
// Figma 2865:44250 — amber dot + "How This Works" in #967014 semibold.
const HowThisWorksBadge = () => (
  <span
    className="inline-flex w-fit items-center gap-2 rounded-[8px] px-4 py-[4px]"
    style={{
      backgroundColor: 'rgba(250,244,232,0.6)',
      border: '1px solid #eedeb8',
    }}
  >
    <span
      className="shrink-0 rounded-full"
      style={{
        width: 8,
        height: 8,
        backgroundColor: '#faf4e8',
        border: '1.5px solid #c8951a',
        boxShadow: '0 0 4px #d6a243',
      }}
    />
    <span
      className="font-sans font-semibold text-[12px] leading-[18px]"
      style={{ color: '#967014', letterSpacing: '0.2px' }}
    >
      How This Works
    </span>
  </span>
);

// ── steps data ────────────────────────────────────────────────────────────────
// Figma 2865:44258 — three-item list with amber number badges
const STEPS = [
  {
    num: '1',
    title: "Your Ward's Account Is Already Active.",
    desc: 'They have access to career guidance, assessments, and resources now.',
  },
  {
    num: '2',
    title: 'No Action Needed Unless You Have Concerns.',
    desc: 'To review their profile or remove access, create your account below.',
  },
  {
    num: '3',
    title: 'You Can Opt-Out At Any Time.',
    desc: "If you opt-out, your ward's access is suspended and they're notified.",
  },
];

// ── ArrowRightIcon ────────────────────────────────────────────────────────────
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3 8h10M9 5l3 3-3 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── primary gradient text style — apply to a <span> inside the button ────────
// backgroundImage applied to the button itself overrides backgroundColor (green).
const PRIMARY_TEXT_GRADIENT = {
  backgroundImage: 'linear-gradient(188.377deg, rgb(254, 241, 231) 0%, rgb(232, 242, 237) 20.192%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  color: 'transparent',
};

// ── main component ────────────────────────────────────────────────────────────

const ParentWelcomeSection = () => {
  log('mount');

  const navigate = useNavigate();
  const [toastVisible, setToastVisible] = useState(true);

  log('toast visible:', toastVisible);

  return (
    <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-12 md:py-16 lg:py-20">
      <div className="flex w-full max-w-[698px] flex-col items-center gap-6">
        {/* Welcome badge — Figma 2900:76717 */}
        <WelcomeBackBadge />

        {/* Headline — Figma 2865:44246, Instrument Serif 64px */}
        {/* "on the platform." italic #c8951a */}
        <h1
          className="font-display font-normal text-center text-black"
          style={{
            fontSize: 'clamp(2rem, 4.4vw, 4rem)',
            lineHeight: 1.094,
            letterSpacing: '-0.64px',
          }}
        >
          Your ward is already
          <br />
          <span className="italic" style={{ color: '#c8951a' }}>
            on the platform.
          </span>
        </h1>

        {/* Subtitle — Figma 2865:44248, SF Pro Rounded 16px #737373 */}
        <p
          className="font-sans font-normal text-center"
          style={{
            fontSize: 16,
            lineHeight: '24px',
            letterSpacing: '0.2px',
            color: '#737373',
            maxWidth: 482,
          }}
        >
          Ghana Talent Hub uses an opt-out model — your ward has immediate access. Create your
          parent account to review their profile and manage their participation.
        </p>

        {/* WavyDivider — Figma 2865:44249 */}
        <WavyDivider />

        {/* "How This Works" badge — Figma 2865:44250 */}
        <HowThisWorksBadge />

        {/* 3-step list — Figma 2865:44258 */}
        <div className="w-full divide-y max-w-[514px] divide-[#E6E6E6]">
          {STEPS.map(({ num, title, desc }) => {
            log('render step', num);
            return (
              <div key={num} className="flex items-center gap-4 py-4" style={{ minHeight: 72 }}>
                {/* Number badge — 32×32 amber */}
                <span
                  className="flex shrink-0 items-center justify-center rounded-[30px]"
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: '#ebf1ec',
                    border: '1px solid #eedeb8',
                  }}
                >
                  <span
                    className="font-display italic"
                    style={{
                      fontSize: 16,
                      lineHeight: 1,
                      color: '#c8951a',
                      letterSpacing: '-0.16px',
                    }}
                  >
                    {num}
                  </span>
                </span>

                {/* Step text */}
                <div className="flex flex-col gap-[2px]">
                  <p
                    className="font-sans font-semibold"
                    style={{ fontSize: 16, lineHeight: '22px', color: '#c8951a' }}
                  >
                    {title}
                  </p>
                  <p
                    className="font-sans font-normal"
                    style={{ fontSize: 14, lineHeight: '20px', color: '#575755' }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── CTA block — Figma 2865:44284 ── */}
        <div className="flex w-full flex-col gap-4" style={{ maxWidth: 542 }}>
          {/* Primary CTA — "Create My Parent Account" */}
          {/* Figma 2865:44285 — bg #387440, shelf #224626, full-width */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-[14px] px-[40px] py-[16px] font-sans font-bold transition-all
              hover:drop-shadow-[0_5px_0_#224626] active:translate-y-1 active:drop-shadow-none"
            style={{
              backgroundColor: '#387440',
              border: '2px solid #2a5730',
              borderTop: '1px solid #2a5730',
              boxShadow: '0 4px 0 #224626',
              fontSize: 16,
              lineHeight: '22px',
            }}
            onClick={() => {
              log('create account CTA clicked');
              // TODO: navigate to sign-up form step
            }}
          >
            <span style={PRIMARY_TEXT_GRADIENT}>Create My Parent Account</span>
            <span style={{ color: 'rgb(232,242,237)' }}>
              <ArrowRightIcon />
            </span>
          </button>

          {/* Secondary CTA — "I Have Concerns Opt-Out Instead" */}
          {/* Figma 2900:76829 — bg #faf4e8, shelf rgba(0,0,0,0.15), #575755 text */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-[14px] px-[40px] py-[16px] font-sans font-bold transition-all
              hover:drop-shadow-[0_5px_0_rgba(17,17,17,0.25)] active:translate-y-1 active:drop-shadow-none"
            style={{
              backgroundColor: '#faf4e8',
              border: '1px solid rgba(17,17,17,0.3)',
              borderBottom: '2px solid rgba(17,17,17,0.3)',
              boxShadow: '0 4px 0 rgba(17,17,17,0.15)',
              fontSize: 16,
              lineHeight: '22px',
              color: '#575755',
            }}
            onClick={() => {
              log('opt-out CTA clicked');
              // TODO: navigate to opt-out flow
            }}
          >
            I Have Concerns — Opt-Out Instead
            <ArrowRightIcon />
          </button>

          {/* Footer link — Figma 2865:44286 */}
          <p
            className="font-sans font-normal text-center"
            style={{ fontSize: 14, lineHeight: '20px', color: '#737373' }}
          >
            Already have an account?{' '}
            <button
              type="button"
              className="font-semibold hover:underline focus-visible:underline"
              style={{ color: '#387440' }}
              onClick={() => {
                log('log in link clicked');
                navigate('/onboarding/parent-login');
              }}
            >
              Log in Instead
            </button>
          </p>
        </div>
      </div>

      {/* Ward registration toast — Figma 2900:76816 */}
      {/* Auto-shows on mount; persists 8 s then fades out */}
      {toastVisible && (
        <Toast
          variant="success"
          position="top-right"
          title="Your ward registered on Ghana Talent Hub"
          body={
            <>
              <strong style={{ fontWeight: 600, color: '#2a5730' }}>Kofi Mensah (16)</strong>{' '}
              provided your contact. Your details have been pre-filled below. Create your account to
              review their profile.
            </>
          }
          duration={8000}
          onDismiss={() => {
            log('toast dismissed');
            setToastVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default ParentWelcomeSection;
