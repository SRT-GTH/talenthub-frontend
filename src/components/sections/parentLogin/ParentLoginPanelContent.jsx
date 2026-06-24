import photoLarge from '../../../assets/hero/parent-panel-photo-large.png';
import photoSmall from '../../../assets/hero/parent-panel-photo-small.png';
import { debug } from '../../../utils/debug.js';

const log = debug('ParentLoginPanelContent');

/*
 * ParentLoginPanelContent — photo card configs and overlay cards for the
 * parent login screen (Figma 2884:64826).
 *
 * Consumed by ParentOnboardingLayout:
 *   <ParentLoginRightPanel
 *     photoCards={LOGIN_PHOTO_CARDS}
 *     overlayContent={<LoginOverlayCards />}
 *   />
 */

// ── ErrorCallout ──────────────────────────────────────────────────────────
/*
 * Figma 2894:71740 — 498×71, fill=#ebf1ec, r=10, stroke=#c1d4c4.
 * Panel-relative: left=20.9% (184/739), top=4% (75/973), width=75% (498/739).
 */
export const ErrorCallout = () => {
  log('render ErrorCallout');
  return (
    <div
      aria-hidden="true"
      className="absolute top-[4%] left-[20.9%] w-[75%] z-10 flex items-center justify-between gap-2 overflow-hidden rounded-[10px] px-4"
      style={{
        minHeight: 71,
        backgroundColor: '#ebf1ec',
        border: '1px solid #c1d4c4',
      }}
    >
      <span
        className="flex shrink-0 items-center justify-center rounded-[6px]"
        style={{ width: 26, height: 26, backgroundColor: '#387440' }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M2 6.5l3 3 5-6"
            stroke="#ebf1ec"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <div>
        <span className="font-sans font-semibold" style={{ fontSize: 14, color: '#387440' }}>
          Kofi Mensah added you as a parent.{' '}
          <span className="font-sans" style={{ fontSize: 12, color: '#387440' }}>
            Log in to manage their account.
          </span>
        </span>
      </div>

      <span className="flex items-center justify-center">
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
          <path
            d="M1 1l7 7M8 1l-7 7"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </div>
  );
};

// ── FlagCorrectionsOverlay ────────────────────────────────────────────────
/*
 * Figma 2891:68611 — 242×~67, fill=#ebf1ec, r=10, stroke=#c1d4c4.
 * Shared between login and welcome screens; caller provides className for
 * per-screen top/left placement.
 * Width: 32.7% of the 739px panel (≈242px).
 */
export const FlagCorrectionsOverlay = ({ className = '' }) => {
  log('render FlagCorrectionsOverlay');
  return (
    <div
      aria-hidden="true"
      className={`absolute flex items-center gap-3 rounded-[10px] ${className}`}
      style={{
        width: 'clamp(210px, 32.7%, 242px)',
        backgroundColor: '#ebf1ec',
        border: '1px solid #c1d4c4',
        padding: '12px 15px',
      }}
    >
      <span
        className="flex shrink-0 items-center justify-center rounded-[6px]"
        style={{ width: 29, height: 29, backgroundColor: '#387440' }}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <path
            d="M2.5 6.5l3 3 5-6"
            stroke="#ebf1ec"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <div className="flex flex-col gap-[2px]">
        <p
          className="font-sans font-bold text-[#2a5730]"
          style={{ fontSize: 12, lineHeight: '18px', letterSpacing: '0.2px' }}
        >
          Flag corrections
        </p>
        <p
          className="font-sans text-neutral-darker"
          style={{ fontSize: 10, lineHeight: '15px', letterSpacing: '0.1px' }}
        >
          Spot something wrong? Flag it and Kofi gets notified.
        </p>
      </div>
    </div>
  );
};

// ── Photo card configs ────────────────────────────────────────────────────
/*
 * Large  (2884:64836): 498×566px, stroke #ddebe4, center (36.5%, 35%)
 * Small  (2884:67288): 425×478px, stroke #eedeb8, center (62%, 70.4%)
 */
// eslint-disable-next-line react-refresh/only-export-components
export const LOGIN_PHOTO_CARDS = [
  {
    photo: photoLarge,
    centerX: '36.5%',
    centerY: '35%',
    rotate: 'rotate(7deg)',
    width: 'clamp(230px, 67.4%, 440px)',
    aspectRatio: '498 / 566',
    borderColor: '#ddebe4',
  },
  {
    photo: photoSmall,
    centerX: '62%',
    centerY: '70.4%',
    rotate: 'rotate(9deg)',
    width: 'clamp(150px, 57.5%, 370px)',
    aspectRatio: '425 / 478',
    borderColor: '#eedeb8',
  },
];

// ── Overlay group ─────────────────────────────────────────────────────────
// Login screen: ErrorCallout (top) + FlagCorrectionsOverlay (bottom-left).
// Login flag position: top=76.9% (787/973), left=10.4% (77/739).

export const LoginOverlayCards = () => (
  <>
    <ErrorCallout />
    <FlagCorrectionsOverlay className="top-[76.9%] left-[10.4%]" />
  </>
);
