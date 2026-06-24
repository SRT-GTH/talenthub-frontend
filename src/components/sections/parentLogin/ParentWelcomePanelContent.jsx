import photoStudents from '../../../assets/hero/parent-welcome-panel-photo.png';
import ellipse5 from '../../../assets/hero/Ellipse 5.svg';
import { FlagCorrectionsOverlay } from './ParentLoginPanelContent.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('ParentWelcomePanelContent');

/*
 * ParentWelcomePanelContent — exactly 3 foreground elements for the parent
 * welcome screen right panel (Figma group 2894:72732, parent frame 2865:44066).
 *
 *   1. Photo card       — Students using GTH on phone.png, rotate(7deg)
 *   2. Ward Status card — white card, icon above text, top-right
 *   3. Flag corrections — shared green card, bottom-left
 *
 * Consumed by ParentOnboardingLayout:
 *   <ParentLoginRightPanel
 *     photoCards={WELCOME_PHOTO_CARDS}
 *     overlayContent={<WelcomeOverlayCards />}
 *   />
 */

// ── WardStatusCard ────────────────────────────────────────────────────────
/*
 * Figma 2894:72783 — white card, icon above text.
 * Inset within panel (739×973): top=529px (54.4%), right=56px (7.6%),
 * width=181px (24.5%). Layout: icon (#faf4e8, 26×26, rounded-6) above
 * "WARD STATUS" + "Active : Kofi Mensah" text, all flex-col centered vertically.
 */
export const WardStatusCard = () => {
  log('render WardStatusCard');
  return (
    <div
      aria-hidden="true"
      className="absolute top-[54.4%] right-[7.6%] flex items-center rounded-[12px] bg-white"
      style={{
        width: 'clamp(160px, 24.5%, 181px)',
        minHeight: '9%',
        boxShadow: '0px 16px 20px rgba(0,0,0,0.18)',
      }}
    >
      {/* Content: icon + text, flex-col, left-offset 18px, vertically centered */}
      <div className="flex flex-col gap-2 items-start pl-[18px] py-3">
        <span
          className="flex shrink-0 items-center justify-center rounded-[6px]"
          style={{ width: 26, height: 26, backgroundColor: '#faf4e8' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M6 1.5l1.06 2.15 2.37.35-1.72 1.67.41 2.36L6 6.82 3.88 8.03l.41-2.36L2.57 4 4.94 3.65 6 1.5z"
              fill="#c8951a"
              stroke="#c8951a"
              strokeWidth="0.4"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <div className="flex flex-col gap-1">
          <p
            className="font-sans font-semibold uppercase"
            style={{ fontSize: 9, lineHeight: 'normal', letterSpacing: '0.6px', color: '#70706e' }}
          >
            Ward Status
          </p>
          <p
            className="font-sans font-semibold"
            style={{ fontSize: 12, lineHeight: 'normal', color: '#967014' }}
          >
            Active : Kofi Mensah
          </p>
        </div>
      </div>
    </div>
  );
};

// ── Photo card configs ────────────────────────────────────────────────────
/*
 * Figma 2894:72733 — "Main photo — slightly tilted, breaks composition".
 * Group container centered at (calc(50% - 13.23px), calc(50% - 40.54px)) of
 * the 739×973 panel. Inner card: 574.323×676.978px, rotate(7deg).
 * Width as % of panel: 574.323/739 = 77.7%.
 * Ellipse 5 corner bleed: top=-103.42px (-15.3% of card h), left=-86.4px (-15% of w).
 */
// eslint-disable-next-line react-refresh/only-export-components
export const WELCOME_PHOTO_CARDS = [
  {
    photo: photoStudents,
    centerX: 'calc(50% - 13.23px)',
    centerY: 'calc(50% - 40.54px)',
    rotate: 'rotate(7deg)',
    width: 'clamp(280px, 77.7%, 574px)',
    aspectRatio: '574 / 677',
    borderColor: '#ddebe4',
    cornerEllipseSrc: ellipse5,
  },
];

// ── Overlay group ─────────────────────────────────────────────────────────
// Welcome screen: WardStatusCard (top-right) + FlagCorrectionsOverlay (bottom-left).
// Flag corrections position: left=10.7% (79/739), top=80.9% (787/973).

export const WelcomeOverlayCards = () => (
  <>
    <WardStatusCard />
    <FlagCorrectionsOverlay className="top-[80.9%] left-[10.7%]" />
  </>
);

// ── SignupActiveBadge ─────────────────────────────────────────────────────
/*
 * Figma 2901:85237 — green "Active" pill shown on the right panel during all
 * parent sign-up steps (Parent Identity → Done). Confirms the ward is active
 * while the parent completes registration.
 * Position: top-[7%] left-[9%] — overlaps the photo card's top-left corner area.
 */
export const SignupActiveBadge = () => {
  log('render SignupActiveBadge');
  return (
    <div
      aria-hidden="true"
      className="absolute z-10 flex items-center gap-[7px] rounded-[10px]"
      style={{
        top: '7%',
        left: '9%',
        backgroundColor: '#387440',
        border: '1px solid #2a5730',
        boxShadow: '0px 4px 0px 0px #2a5730, 0px 8px 28px 0px rgba(56,116,64,0.25)',
        padding: '8px 16px',
      }}
    >
      {/* Status indicator: outer translucent ring + inner filled circle */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="6" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
        <circle cx="7" cy="7" r="2.5" fill="white" />
      </svg>
      <span
        className="font-sans font-medium text-white"
        style={{ fontSize: 16, lineHeight: '28px', letterSpacing: '0.2px' }}
      >
        Active
      </span>
    </div>
  );
};

// ── SignupOverlayCards ────────────────────────────────────────────────────
// Sign-up steps (Identity → Done): Active badge (top-left) + WardStatusCard
// (top-right) + FlagCorrectionsOverlay (bottom-left).
// Uses the same WELCOME_PHOTO_CARDS single-large-photo config.

export const SignupOverlayCards = () => (
  <>
    <SignupActiveBadge />
    <WardStatusCard />
    <FlagCorrectionsOverlay className="top-[80.9%] left-[10.7%]" />
  </>
);
