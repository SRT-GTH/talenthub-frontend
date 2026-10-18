// Shared inline SVG icons. Anything inlined as a React SVG component on
// LoginPage or GetStartedPage lives here so both pages — and any future
// screens — pull from one source of truth. Paths are Figma-verbatim;
// dimensions / fills / strokes are baked into each component to match
// the design system.
import { useId } from 'react';

// ---- Role icons (GetStartedPage) -------------------------------------
// 52×52 line icons. Strokes hard-coded #737373 (primary) and #BFBFBF
// (secondary) per the Figma export — they stay constant regardless of
// card selection state.

export const TalentIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
    <path
      d="M4.33301 17.3333C4.33301 20.2405 21.872 28.1667 25.9696 28.1667C30.0669 28.1667 47.6061 20.2405 47.6061 17.3333C47.6061 14.4261 30.0669 6.5 25.9696 6.5C21.872 6.5 4.33301 14.4261 4.33301 17.3333Z"
      stroke="#737373"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.9873 23.833L13.5184 36.0311C13.529 36.2753 13.5554 36.5199 13.6262 36.7539C13.845 37.4772 14.2482 38.1343 14.8633 38.5759C19.6765 42.0298 32.2619 42.0298 37.0749 38.5759C37.6905 38.1343 38.0935 37.4772 38.3123 36.7539C38.3829 36.5199 38.4094 36.2753 38.4202 36.0311L38.951 23.833"
      stroke="#BFBFBF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M44.3586 20.583V35.7497M44.3586 35.7497C42.6426 38.8833 41.8839 40.5623 41.1132 43.333C40.9459 44.3188 41.0787 44.8157 41.7582 45.2568C42.0342 45.436 42.366 45.4997 42.6949 45.4997H45.9891C46.3394 45.4997 46.6928 45.4267 46.9812 45.2278C47.6128 44.7923 47.7753 44.3145 47.6041 43.333C46.9285 40.7603 46.0679 39.0014 44.3586 35.7497Z"
      stroke="#BFBFBF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PersonIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className={className}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      fill="currentColor"
      d="M12 4.75a2.25 2.25 0 1 0 0 4.5a2.25 2.25 0 0 0 0-4.5M8.25 7a3.75 3.75 0 1 1 7.5 0a3.75 3.75 0 0 1-7.5 0m1.064 5.819c.132.098.302.213.505.327c.513.29 1.265.59 2.18.59s1.668-.3 2.181-.59c.203-.114.373-.229.505-.327q.282.075.559.166l.96.315c.72.237 1.264.812 1.458 1.523l.397 2.864c.075.544-.21.939-.606 1.033c-1.047.25-2.812.53-5.453.53s-4.407-.28-5.454-.53c-.395-.094-.68-.489-.606-1.033l.397-2.864A2.23 2.23 0 0 1 7.796 13.3l.96-.315q.276-.09.558-.166m.71-1.355l-.291-.287l-.402.092q-.526.12-1.044.291l-.96.315a3.72 3.72 0 0 0-2.454 2.616l-.01.04l-.408 2.95c-.161 1.164.462 2.393 1.744 2.698c1.17.279 3.052.571 5.8.571c2.749 0 4.631-.292 5.801-.57c1.282-.306 1.906-1.535 1.745-2.698l-.409-2.95l-.01-.04a3.72 3.72 0 0 0-2.455-2.617l-.959-.315q-.517-.17-1.044-.29l-.402-.093l-.29.286l-.001.001a2 2 0 0 1-.12.101a3 3 0 0 1-.41.274a2.96 2.96 0 0 1-1.445.397a2.96 2.96 0 0 1-1.445-.397a3.2 3.2 0 0 1-.53-.375"
    />
  </svg>
);

export const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none" />
    <g fill="none" stroke="#387440" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <circle cx="12" cy="10" r="3" />
      <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8" />
    </g>
  </svg>
);

export const ParentIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
    <path
      d="M28.1663 23.8337C28.1663 19.0472 24.2861 15.167 19.4997 15.167C14.7132 15.167 10.833 19.0472 10.833 23.8337C10.833 28.62 14.7132 32.5003 19.4997 32.5003C24.2861 32.5003 28.1663 28.62 28.1663 23.8337Z"
      stroke="#BFBFBF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M23.9166 16.3751C23.8614 15.9802 23.833 15.5768 23.833 15.1667C23.833 10.3802 27.7133 6.5 32.4997 6.5C37.2861 6.5 41.1663 10.3802 41.1663 15.1667C41.1663 19.9531 37.2861 23.8333 32.4997 23.8333C30.8864 23.8333 29.3762 23.3926 28.0827 22.625"
      stroke="#BFBFBF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M32.5 45.5C32.5 38.3203 26.6797 32.5 19.5 32.5C12.3203 32.5 6.5 38.3203 6.5 45.5"
      stroke="#BFBFBF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M45.5 36.833C45.5 29.6533 39.6797 23.833 32.5 23.833"
      stroke="#BFBFBF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const RecruiterIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
    <path d="M4.33301 47.667H47.6663" stroke="#BFBFBF" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M38.9997 19.5H30.333C24.9553 19.5 23.833 20.6223 23.833 26V47.6667H45.4997V26C45.4997 20.6223 44.3773 19.5 38.9997 19.5Z"
      stroke="#BFBFBF"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M32.5 47.6663H6.5V10.833C6.5 5.45534 7.62233 4.33301 13 4.33301H26C31.3777 4.33301 32.5 5.45534 32.5 10.833V19.4997"
      stroke="#BFBFBF"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 13H13M6.5 21.6667H13M6.5 30.3333H13"
      stroke="#BFBFBF"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M32.5 28.167H36.8333M32.5 34.667H36.8333"
      stroke="#BFBFBF"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M34.667 47.667V41.167"
      stroke="#BFBFBF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ---- CTA glyphs ------------------------------------------------------
// Arrow extracted verbatim from Figma 41:1545 ("20-arrow-right"). Fill —
// not stroke — at #FEFEFE so it reads as the near-white CTA arrow on the
// brand-green primary button.

export const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.736 5.20385C12.0376 4.91996 12.5123 4.93435 12.7962 5.23598L16.7962 9.48598C17.068 9.77477 17.068 10.2252 16.7962 10.514L12.7962 14.764C12.5123 15.0657 12.0376 15.08 11.736 14.7962C11.4343 14.5123 11.42 14.0376 11.7038 13.736L14.5142 10.75H3.75C3.33579 10.75 3 10.4142 3 10C3 9.58579 3.33579 9.25 3.75 9.25H14.5142L11.7038 6.26403C11.42 5.9624 11.4343 5.48774 11.736 5.20385Z"
      fill="#FEFEFE"
    />
  </svg>
);

// Loading spinner — Figma 2168:24205, a 14×14 quarter-arc spun by
// Tailwind's `animate-spin`. Stroke is a prop so callers can switch
// between pure white (GetStartedPage) and the cream mint #EBF1EC used on
// LoginPage's pressed-state CTA.

export const LoadingSpinner = ({ stroke = 'white' }) => (
  <span className="inline-flex size-5 items-center justify-center">
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="animate-spin"
      aria-hidden="true"
    >
      <path
        d="M12.5833 6.66634C12.5833 5.73263 12.3624 4.81218 11.9385 3.98023C11.5146 3.14829 10.8998 2.42848 10.1444 1.87966"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  </span>
);

// ---- Form control glyphs (LoginPage) ---------------------------------

export const ChevronDownIcon = ({ className = '' }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M3 4.5L6 7.5L9 4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Padlock for the password field. Fill #387440 to match the brand-green
// hover state on the input field shadow.
export const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="15"
    viewBox="0 0 13 15"
    fill="none"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.2 3.2C3.2 1.43269 4.63269 0 6.4 0C8.16731 0 9.6 1.43269 9.6 3.2V5.6H10.6C11.815 5.6 12.8 6.58497 12.8 7.8V12.2C12.8 13.415 11.815 14.4 10.6 14.4H2.2C0.984974 14.4 0 13.415 0 12.2V7.8C0 6.58497 0.984974 5.6 2.2 5.6H3.2V3.2ZM4.4 5.6H8.4V3.2C8.4 2.09543 7.50457 1.2 6.4 1.2C5.29543 1.2 4.4 2.09543 4.4 3.2V5.6ZM2.2 6.8C1.64772 6.8 1.2 7.24771 1.2 7.8V12.2C1.2 12.7523 1.64772 13.2 2.2 13.2H10.6C11.1523 13.2 11.6 12.7523 11.6 12.2V7.8C11.6 7.24771 11.1523 6.8 10.6 6.8H2.2ZM6.4 8.8C6.73137 8.8 7 9.06863 7 9.4V10.6C7 10.9314 6.73137 11.2 6.4 11.2C6.06863 11.2 5.8 10.9314 5.8 10.6V9.4C5.8 9.06863 6.06863 8.8 6.4 8.8Z"
      fill="#387440"
    />
  </svg>
);

export const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M2 10s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

export const EyeOffIcon = () => (
  // Crossed-out eye — Figma password-revealed state on the personal info
  // step. Used in place of EyeIcon when the password is masked.
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M2 10s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M3 17 17 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const UserIcon = () => (
  // Generic person silhouette — used as the leftIcon on Name fields and
  // as the eyebrow glyph on the "Build Your Profile" step.
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="5.5" r="2.8" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M2.5 13.5c.7-2.7 3-4.2 5.5-4.2s4.8 1.5 5.5 4.2"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

export const IdCardIcon = () => (
  // Horizontal ID-card glyph — leftIcon on Ghana Card / Student ID input.
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect
      x="1.6"
      y="3.5"
      width="12.8"
      height="9"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <circle cx="5.5" cy="8" r="1.4" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M8.8 7.2h3.8M8.8 9.4h2.6"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

export const GlobeIcon = () => (
  // Globe / nationality glyph — leftIcon on the Nationality select.
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M2 8h12M8 1.8c2.2 2 2.2 10.4 0 12.4M8 1.8c-2.2 2-2.2 10.4 0 12.4"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

// ---- Onboarding step glyphs ------------------------------------------

export const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="2" y="3.5" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
    <path d="M2 7h12" stroke="currentColor" strokeWidth="1.3" />
    <path d="M5.5 2v3M10.5 2v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

// Mortarboard / graduation cap used in the loading overlay icon block.
// Figma extracted from the loading card (lines ~5363 of the HTML export).
export const MortarboardIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path
      d="M2.666 10.667c0 1.789 10.793 6.666 13.315 6.666 2.521 0 13.314-4.877 13.314-6.666 0-1.79-10.793-6.667-13.314-6.667-2.522 0-13.315 4.878-13.315 6.667Z"
      stroke="#387440"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m7.992 14.667.327 7.506c.006.15.023.301.066.445.135.445.383.85.762 1.121 2.962 2.126 10.707 2.126 13.669 0 .379-.271.627-.676.762-1.121.043-.144.06-.294.066-.445l.327-7.506"
      stroke="#387440"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27.297 12.667V22m0 0c-1.056 1.928-1.523 2.961-1.997 4.667-.103.606-.022.912.397 1.183.17.11.374.15.576.15h2.027c.216 0 .433-.045.611-.167.388-.268.488-.562.383-1.166-.416-1.583-.945-2.665-1.997-4.667Z"
      stroke="#387440"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Under-18 notice — group / users icon at amber tone.
export const UsersGroupIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.6 2C4.5 2 3.6 2.9 3.6 4s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm-3.2 2A3.2 3.2 0 1 1 8.8 4 3.2 3.2 0 0 1 2.4 4Zm7.4-2.6c0-.33.27-.6.6-.6A3.2 3.2 0 0 1 13.6 4a3.2 3.2 0 0 1-3.2 3.2.6.6 0 1 1 0-1.2 2 2 0 1 0 0-4 .6.6 0 0 1-.6-.6ZM.8 13.3a4.5 4.5 0 0 1 4.5-4.5h.6a4.5 4.5 0 0 1 4.5 4.5c0 1.05-.85 1.9-1.9 1.9H2.7c-1.05 0-1.9-.85-1.9-1.9ZM5.3 10A3.3 3.3 0 0 0 2 13.3c.0.39.31.7.7.7h5.8c.39 0 .7-.31.7-.7A3.3 3.3 0 0 0 5.9 10h-.6ZM10 9.4c0-.33.27-.6.6-.6h.1a4.5 4.5 0 0 1 4.5 4.5c0 1.05-.85 1.9-1.9 1.9H12a.6.6 0 1 1 0-1.2h1.3c.39 0 .7-.31.7-.7A3.3 3.3 0 0 0 10.7 10h-.1a.6.6 0 0 1-.6-.6Z"
      fill="#B48617"
    />
  </svg>
);

export const PencilEditIcon = () => (
  // Small pencil glyph used inside the eyebrow pill on this step.
  // Figma node 2329:3917 — sits to the left of "Build Your Profile".
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path
      d="M7.5 2 10 4.5M2 10l1.5-.5L9 4l-2.5-2.5L1 7l-.5 1.5L2 10z"
      stroke="#387440"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ProfilePlaceholderIcon = () => (
  // Default avatar glyph shown inside the round upload preview when no
  // photo is selected. Soft up-arrow indicating "tap to upload".
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <path
      d="M11 14V5M11 5 7 9M11 5l4 4"
      stroke="#BABAB7"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 17v1.5A1.5 1.5 0 0 0 4.5 20h13a1.5 1.5 0 0 0 1.5-1.5V17"
      stroke="#BABAB7"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const CloseIcon = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path d="M4 4l8 8M12 4 4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ---- Onboarding success-summary glyphs -------------------------------

export const SuccessCheckIcon = () => (
  // Big green check inside the success modal's top badge — Figma
  // 2374:14410 ("Profile section complete").
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path
      d="M8 16.5 13 21.5 24 10.5"
      stroke="#387440"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Compact glyphs for the success-summary rows.
export const SummaryUserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="5.5" r="2.8" stroke="#575755" strokeWidth="1.3" />
    <path
      d="M2.5 13.5c.7-2.7 3-4.2 5.5-4.2s4.8 1.5 5.5 4.2"
      stroke="#575755"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);
export const SummaryFlagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect width="16" height="3.3" y="2.4" fill="#006B3F" rx="0.5" />
    <rect width="16" height="3.3" y="5.7" fill="#FCD116" />
    <rect width="16" height="3.3" y="9" fill="#CE1126" rx="0.5" />
  </svg>
);
export const SummaryIdIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.6" y="3.5" width="12.8" height="9" rx="1.5" stroke="#575755" strokeWidth="1.3" />
    <circle cx="5.5" cy="8" r="1.4" stroke="#575755" strokeWidth="1.3" />
    <path d="M8.8 7.2h3.8M8.8 9.4h2.6" stroke="#575755" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
export const SummaryPhotoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.6" y="2.4" width="12.8" height="11.2" rx="1.5" stroke="#575755" strokeWidth="1.3" />
    <circle cx="11" cy="6" r="1.3" stroke="#575755" strokeWidth="1.3" />
    <path
      d="m2 12 4-4 4 4 2-2 2 2"
      stroke="#575755"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ---- Contact-step glyphs ---------------------------------------------
// Used by OnboardingContactPage (step 03). Sizes are caller-controlled via
// className when needed; defaults match Figma sizes.

export const PhoneIcon = ({ className = '' }) => (
  // 16px outline phone — Figma `20-phone` (node 41:1207). Stroke is
  // currentColor so callers tint via parent text-color.
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M5.4 2.7c.4-.9 1.5-1.3 2.4-.9l1.6.7c.7.3 1 1 .8 1.7l-.4 1.5a1 1 0 0 0 .3 1l1.7 1.7a1 1 0 0 0 1 .3l1.5-.4c.7-.2 1.4.1 1.7.8l.7 1.6c.4.9 0 2-.9 2.4-3 1.2-6.4.5-8.7-1.8C3.8 9.1 3.1 5.7 4.3 2.7Z"
      transform="translate(-1 -1)"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

export const MailIcon = ({ className = '' }) => (
  // 16px outline envelope — Figma `20-mail` (node 41:1239).
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="m2.5 4.5 5.5 4 5.5-4"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MessageBubbleIcon = () => (
  // 28×28 speech-bubble hero glyph — sits inside the 64px green-light chip
  // at the top of the OTP modal ("Check your messages.")
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path
      d="M4 8a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-7l-4.4 3.4A.8.8 0 0 1 7.3 23v-3H8a4 4 0 0 1-4-4V8Z"
      stroke="#387440"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M9 12h10M9 15h6" stroke="#387440" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const ClockIcon = ({ className = '' }) => (
  // 16px outline clock — Figma timer leading glyph for "Code expires in".
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M8 4.5V8l2.2 1.5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ShieldCheckIcon = ({ className = '' }) => (
  // 12px shield + check — footer trust note in onboarding modals.
  // Filled paths so it reads at small sizes; tint via currentColor.
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M6 0.7 1 2.5v3.2c0 2.7 1.9 4.6 5 5.6 3.1-1 5-2.9 5-5.6V2.5L6 .7Z"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinejoin="round"
    />
    <path
      d="m4 6 1.5 1.5L8.2 4.8"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PlayCircleIcon = ({ className = '' }) => (
  // 24px circled play — collapsed watch-tutorial badge on the right panel.
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M10 8.5v7L16 12l-6-3.5Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

// ---- Address-step glyphs ---------------------------------------------
// Used by OnboardingAddressPage (step 04). Strokes use currentColor so the
// parent text-color tints them.

export const MapPinIcon = ({ className = '' }) => (
  // 16px outline marker pin — Figma `20-marker-pin` (node 41:1235). Used
  // on Region / Town/City / Community / Nearby Landmark fields.
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M8 1.5c-2.8 0-5 2.2-5 5 0 3.6 5 8 5 8s5-4.4 5-8c0-2.8-2.2-5-5-5Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="6.5" r="1.8" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

export const MapPinIconTwo = ({ className = '' }) => (
  // 16px outline marker pin — Figma `20-marker-pin` (node 41:1235). Used
  // on Region / Town/City / Community / Nearby Landmark fields.
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 32 32"
  >
    <path d="M0 0h32v32H0z" fill="none" />
    <path
      fill="currentColor"
      d="m16 24l-6.09-8.6A8.14 8.14 0 0 1 16 2a8.08 8.08 0 0 1 8 8.13a8.2 8.2 0 0 1-1.8 5.13Zm0-20a6.07 6.07 0 0 0-6 6.13a6.2 6.2 0 0 0 1.49 4L16 20.52L20.63 14A6.24 6.24 0 0 0 22 10.13A6.07 6.07 0 0 0 16 4"
    />
    <circle cx="16" cy="9" r="2" fill="currentColor" />
    <path
      fill="currentColor"
      d="M28 12h-2v2h2v14H4V14h2v-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V14a2 2 0 0 0-2-2"
    />
  </svg>
);

export const MapIcon = ({ className = '' }) => (
  // 16px outline folded-map glyph — Figma `20-map` (node 41:1237). Left
  // icon on the District field (disabled until Region is picked).
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M1.8 4 5.5 2.5 10.5 4.5 14.2 3v9L10.5 13.5 5.5 11.5 1.8 13V4Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path d="M5.5 2.5v9M10.5 4.5v9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const GhanaFlagRoundIcon = () => (
  // 20px circular Ghana flag used inside the country-code prefix of the
  // phone-number inputs. Three horizontal stripes (red / yellow / green)
  // with a centred black star, clipped to a circle.
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <mask id="ghana-flag-clip">
      <circle cx="10" cy="10" r="10" fill="white" />
    </mask>
    <g mask="url(#ghana-flag-clip)">
      <rect width="20" height="6.7" y="0" fill="#CE1126" />
      <rect width="20" height="6.7" y="6.7" fill="#FCD116" />
      <rect width="20" height="6.7" y="13.3" fill="#006B3F" />
      <path
        d="M10 8.2 10.7 10l1.9.1-1.5 1.2.6 1.9L10 12l-1.7 1.2.6-1.9-1.5-1.2L9.3 10 10 8.2Z"
        fill="#111111"
      />
    </g>
  </svg>
);

export const ShieldIcon = ({ className = '' }) => (
  // 20px circular Ghana flag used inside the country-code prefix of the
  // phone-number inputs. Three horizontal stripes (red / yellow / green)
  // with a centred black star, clipped to a circle.
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      fill="currentColor"
      d="M12 22q-3.475-.875-5.738-3.988T4 11.1V5l8-3l8 3v6.1q0 3.8-2.262 6.913T12 22m0-2.1q2.6-.825 4.3-3.3t1.7-5.5V6.375l-6-2.25l-6 2.25V11.1q0 3.025 1.7 5.5t4.3 3.3m0-7.9"
    />
  </svg>
);

// ---- Education-step glyphs ------------------------------------------
// Used by OnboardingEducationPage (step 05). Strokes use currentColor so
// the parent text-color tints them, matching the Address-step glyphs.

export const TrendUpIcon = ({ className = '' }) => (
  // 16px ascending chart-arrow with NE-pointing arrowhead + a small
  // dotted accent below — the signature glyph of the education step.
  // Used in the eyebrow pill (8x8 scaled) and as Cell 1 left icon.
  // Figma composite `2418:40567` (nodes 2709:12613 + 2709:12614).
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M2 11 6 7l2.5 2.5L13 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 5h3.5v3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SearchIcon = ({ className = '' }) => (
  // 16px magnifying glass — left icon on the Institution typeahead.
  // Figma `20-search` (node 41:1170).
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const WarningIcon = ({ className = '' }) => (
  // 20px amber-toned triangle warning glyph — used inside the
  // "Not quite yet" (sub-JHS gating) modal's 64x64 icon block.
  // Figma `20-warning` (node 41:1037).
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M10 2.7 18 16.6H2L10 2.7Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M10 8v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="14.2" r="0.9" fill="currentColor" />
  </svg>
);

export const ArrowLeftIcon = ({ className = '' }) => (
  // 20px left chevron — leading icon on the warning-modal CTA
  // "Choose A Different Level". Figma `20-arrow-left` (node 41:1547).
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M12.5 4.5 6.5 10l6 5.5M6.5 10H16"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ---- Institution-contact-step glyphs --------------------------------
// Used by ContactInfoSection and ContactVerificationModal.

export const BriefcaseIcon = ({ className = '' }) => (
  // 16px outline briefcase — left icon on Role / Title field.
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <rect x="1.5" y="5.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M5.5 5.5V4A1.5 1.5 0 0 1 7 2.5h2A1.5 1.5 0 0 1 10.5 4v1.5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path d="M1.5 9.5h13" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

export const WorkBriefcaseIcon = ({ className = '' }) => (
  // 16px outline briefcase — left icon on Role / Title field.
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
  >
    <path
      d="M3.33301 23.3307C3.33301 18.6492 3.33301 16.3084 4.45654 14.6269C4.94294 13.899 5.56794 13.274 6.29587 12.7876C7.97736 11.6641 10.3181 11.6641 14.9997 11.6641H24.9997C29.6812 11.6641 32.022 11.6641 33.7035 12.7876C34.4313 13.274 35.0563 13.899 35.5428 14.6269C36.6663 16.3084 36.6663 18.6492 36.6663 23.3307C36.6663 28.0122 36.6663 30.3531 35.5428 32.0346C35.0563 32.7624 34.4313 33.3874 33.7035 33.8739C32.022 34.9974 29.6812 34.9974 24.9997 34.9974H14.9997C10.3181 34.9974 7.97736 34.9974 6.29587 33.8739C5.56794 33.3874 4.94294 32.7624 4.45654 32.0346C3.33301 30.3531 3.33301 28.0122 3.33301 23.3307Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M26.6668 11.6667C26.6668 8.52397 26.6668 6.95262 25.6905 5.97632C24.7142 5 23.1428 5 20.0002 5C16.8575 5 15.2861 5 14.3098 5.97632C13.3335 6.95262 13.3335 8.52397 13.3335 11.6667"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 18.3359L11.0866 18.6726C16.8085 20.4459 23.1915 20.4459 28.9133 18.6726L30 18.3359M20 20.0026V23.3359"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DiamondIcon = ({ className = '' }) => (
  // 8×8 filled diamond bullet — used beside "Email verification" helper text.
  <svg
    width="8"
    height="8"
    viewBox="0 0 8 8"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M4 0.6L7.4 4L4 7.4L0.6 4L4 0.6Z" />
  </svg>
);

// ---- Interest category icons (profile filling / interests step) -----------
// Figma nodes 3576:89195–89210, pen-tool from 3550:71944.
// Energy & Startups use inline SVG (Figma reused the food icon for both slots).
// All strokes use currentColor — parent chip controls the tint.

export const CatCourtIcon = ({ className = '' }) => (
  // Tech, Law, Health — house-with-cross from court-law Figma component
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M1.56759 8.47599C1.33225 6.94446 1.21457 6.17875 1.50411 5.49991C1.79365 4.82107 2.43602 4.35661 3.72076 3.4277L4.68066 2.73366C6.27886 1.57811 7.07793 1.00033 8 1.00033C8.92207 1.00033 9.72113 1.57811 11.3193 2.73366L12.2793 3.4277C13.564 4.35661 14.2063 4.82107 14.4959 5.49991C14.7854 6.17875 14.6677 6.94446 14.4324 8.47599L14.2317 9.78193C13.8981 11.9529 13.7313 13.0385 12.9527 13.6861C12.1741 14.3337 11.0358 14.3337 8.7592 14.3337H7.2408C4.96422 14.3337 3.82594 14.3337 3.04733 13.6861C2.26873 13.0385 2.10191 11.9529 1.76829 9.78193L1.56759 8.47599Z"
      stroke="currentColor"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 8.50033C8.2912 9.29153 9.33333 10.0956 9.33333 10.0956L10.7619 8.66699C10.7619 8.66699 9.95787 7.62486 9.16667 6.83366C8.37547 6.04245 7.33333 5.23842 7.33333 5.23842L5.90476 6.66699C5.90476 6.66699 6.7088 7.70913 7.5 8.50033ZM7.5 8.50033L5 11.0003M11 8.42893L9.09527 10.3337M7.5714 5.00033L5.66667 6.90506"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CatPenToolIcon = ({ className = '' }) => (
  // Creative Arts & Design — pen-tool-03 (Figma 3550:71944)
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path
      d="M11.071 16.1372L4.85203 17.2922C3.65919 17.5137 3.06278 17.6244 2.71919 17.2808C2.3756 16.9372 2.48635 16.3408 2.70786 15.1478L3.86269 8.92858C4.04788 7.93135 4.14047 7.43271 4.46918 7.13142C4.79791 6.83013 5.39908 6.77133 6.60142 6.65373C7.76023 6.54039 8.85692 6.14314 10 5L15 10.0004C13.8569 11.1436 13.4594 12.2395 13.3459 13.3984C13.2282 14.6009 13.1692 15.2022 12.868 15.5308C12.5667 15.8595 12.0682 15.9521 11.071 16.1372Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path
      d="M7.32521 10.833C7.4009 11.2993 7.60372 11.7256 7.93925 12.0611C8.27478 12.3966 8.70107 12.5994 9.16732 12.6751M7.93925 12.0611L3.33398 16.6663"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M10 5C10.5936 4.12425 11.3976 2.651 12.5887 2.50915C13.4018 2.41233 14.0755 3.08593 15.4227 4.43315L15.5668 4.57731C16.9141 5.92453 17.5877 6.59814 17.4908 7.41125C17.349 8.60242 15.8757 9.40642 15 10"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

export const CatBusinessIcon = ({ className = '' }) => (
  // Business & Finance — briefcase-with-dollar (Figma 3576:89197)
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M1.33333 9.33333C1.33333 6.9956 1.33333 5.82669 1.93864 5.03995C2.04945 4.89592 2.17326 4.76386 2.30829 4.64566C3.04585 4 4.14168 4 6.33333 4H9.66667C11.8583 4 12.9541 4 13.6917 4.64566C13.8267 4.76386 13.9505 4.89592 14.0613 5.03995C14.6667 5.82669 14.6667 6.9956 14.6667 9.33333C14.6667 11.6711 14.6667 12.84 14.0613 13.6267C13.9505 13.7707 13.8267 13.9028 13.6917 14.021C12.9541 14.6667 11.8583 14.6667 9.66667 14.6667H6.33333C4.14168 14.6667 3.04585 14.6667 2.30829 14.021C2.17326 13.9028 2.04945 13.7707 1.93864 13.6267C1.33333 12.84 1.33333 11.6711 1.33333 9.33333Z"
      stroke="currentColor"
    />
    <path
      d="M10.6667 4C10.6667 2.74292 10.6667 2.11438 10.2761 1.72386C9.8856 1.33333 9.25707 1.33333 8 1.33333C6.74293 1.33333 6.11438 1.33333 5.72386 1.72386C5.33333 2.11438 5.33333 2.74292 5.33333 4"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 7.33333C7.2636 7.33333 6.66667 7.78107 6.66667 8.33333C6.66667 8.8856 7.2636 9.33333 8 9.33333C8.7364 9.33333 9.33333 9.78107 9.33333 10.3333C9.33333 10.8856 8.7364 11.3333 8 11.3333M8 7.33333C8.58053 7.33333 9.0744 7.6116 9.25747 8M8 7.33333V6.66667M8 11.3333C7.41947 11.3333 6.9256 11.0551 6.74253 10.6667M8 11.3333V12"
      stroke="currentColor"
      strokeLinecap="round"
    />
    <path d="M4 8H1.33333" stroke="currentColor" strokeLinecap="round" />
    <path d="M14.6667 8H12" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

export const CatEducationIcon = ({ className = '' }) => (
  // Education & Teaching — document with sidebar lines (Figma 3576:89199)
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M14.6667 9.33333V6.66667C14.6667 4.15251 14.6667 2.89543 13.8856 2.11438C13.1046 1.33333 11.8475 1.33333 9.33333 1.33333H8C5.48584 1.33333 4.22877 1.33333 3.44771 2.11438C2.66667 2.89543 2.66667 4.15251 2.66667 6.66667V9.33333C2.66667 11.8475 2.66667 13.1046 3.44771 13.8856C4.22877 14.6667 5.48584 14.6667 8 14.6667H9.33333C11.8475 14.6667 13.1046 14.6667 13.8856 13.8856C14.6667 13.1046 14.6667 11.8475 14.6667 9.33333Z"
      stroke="currentColor"
    />
    <path
      d="M3.33333 4H1.33333M3.33333 8H1.33333M3.33333 12H1.33333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.6667 4.66667H9M10.3333 7.33333H9"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 14.6667V1.33333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CatArchitectureIcon = ({ className = '' }) => (
  // Architecture & Built Env. — curved building doc (Figma 3576:89200)
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path d="M2.66667 14.6667H13.3333" stroke="currentColor" strokeLinecap="round" />
    <path
      d="M11.3333 6H9.33333M12 8.66667H9.33333M12 11.3333H9.33333"
      stroke="currentColor"
      strokeLinecap="round"
    />
    <path
      d="M4 14.6667V2.13333C4 1.6159 4.31399 1.33333 4.8 1.33333C5.91481 1.33333 6.47221 1.33333 6.9386 1.4072C9.50593 1.81383 11.5195 3.82737 11.9261 6.39473C12 6.86113 12 7.41853 12 8.53333V14.6667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CatMediaIcon = ({ className = '' }) => (
  // Media & Communications — lines + music note (Figma 3576:89201)
  <svg viewBox="0 0 17.0001 17" fill="none" aria-hidden="true" className={className}>
    <path d="M0.5 0.5H14.8996" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M0.5 6.39422H10.8997"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M0.5 12.2909H6.09986"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.5001 13.9736C13.5001 15.3689 12.3808 16.5 11.0001 16.5C9.61945 16.5 8.5002 15.3689 8.5002 13.9736C8.5002 12.5782 9.61945 11.4471 11.0001 11.4471C12.3808 11.4471 13.5001 12.5782 13.5001 13.9736ZM13.5001 13.9736V6.39422C13.8334 6.89951 14.1001 9.02172 16.5 9.42595"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CatAgricultureIcon = ({ className = '' }) => (
  // Agriculture & Food — leaf/plant (Figma 3576:89203)
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M3.37238 7.82807C4.65141 7.9854 5.82075 7.03567 5.98419 5.70679C6.14761 4.37793 4.6259 3.09723 5.17868 1.33333C2.44318 1.72966 1.50037 3.93409 1.35241 5.13715C1.18899 6.46601 2.09335 7.6708 3.37238 7.82807Z"
      stroke="currentColor"
      strokeLinejoin="round"
    />
    <path
      d="M4.66667 13.3333C3.38357 10.2161 3.17995 7.46273 3.42183 5.33333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.33857 11.7787C7.12187 13.3735 9.01373 13.8133 10.5642 12.761C12.1147 11.7087 12.3585 8.7932 14.6667 7.77673C12.2036 5.04831 9.1314 6.03332 7.72773 6.98593C6.17725 8.0382 5.55531 10.184 6.33857 11.7787Z"
      stroke="currentColor"
      strokeLinejoin="round"
    />
    <path
      d="M4 14.6667C5.58519 11.9363 7.5096 10.2867 9.33333 9.33333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CatDevelopmentIcon = ({ className = '' }) => (
  // Development & NGO — wave + rounded rect + circle (Figma 3576:89204)
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M8.66667 10C7.13887 14 2.86111 10 1.33333 14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.3333 10H11.3342C12.9055 10 13.6912 10 14.1794 9.51187C14.6675 9.02367 14.6675 8.238 14.6675 6.66667V5.33333C14.6675 3.76199 14.6675 2.97631 14.1794 2.48815C13.6912 2 12.9055 2 11.3342 2H8.66753C7.0962 2 6.31051 2 5.82235 2.48815C5.40875 2.90176 5.34559 3.52896 5.33594 4.66667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 10C5.92047 10 6.66667 9.25381 6.66667 8.33333C6.66667 7.41286 5.92047 6.66667 5 6.66667C4.07953 6.66667 3.33333 7.41286 3.33333 8.33333C3.33333 9.25381 4.07953 10 5 10Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 4.66667H12M12 7.33333H10"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CatEntertainmentIcon = ({ className = '' }) => (
  // Arts & Entertainment — globe with colour dots (Figma 3576:89206)
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M14.6667 8C14.6667 4.3181 11.6819 1.33333 8 1.33333C4.3181 1.33333 1.33333 4.3181 1.33333 8C1.33333 11.6819 4.3181 14.6667 8 14.6667C8.56113 14.6667 9.33333 14.7442 9.33333 14C9.33333 13.594 9.12213 13.2808 8.9124 12.9696C8.60547 12.5143 8.30153 12.0635 8.66667 11.3333C9.11113 10.4445 9.85187 10.4445 10.9877 10.4445C11.5556 10.4445 12.2223 10.4445 13 10.3333C14.4007 10.1333 14.6667 9.27227 14.6667 8Z"
      stroke="currentColor"
    />
    <path
      d="M6.33333 6.66667C6.88562 6.66667 7.33333 6.21895 7.33333 5.66667C7.33333 5.11438 6.88562 4.66667 6.33333 4.66667C5.78105 4.66667 5.33333 5.11438 5.33333 5.66667C5.33333 6.21895 5.78105 6.66667 6.33333 6.66667Z"
      stroke="currentColor"
    />
    <path
      d="M11 7.33333C11.5523 7.33333 12 6.88562 12 6.33333C12 5.78105 11.5523 5.33333 11 5.33333C10.4477 5.33333 10 5.78105 10 6.33333C10 6.88562 10.4477 7.33333 11 7.33333Z"
      stroke="currentColor"
    />
    <path
      d="M4.75 10H4.66667M4.83333 10C4.83333 10.0921 4.75871 10.1667 4.66667 10.1667C4.57462 10.1667 4.5 10.0921 4.5 10C4.5 9.90793 4.57462 9.83333 4.66667 9.83333C4.75871 9.83333 4.83333 9.90793 4.83333 10Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CatBankingIcon = ({ className = '' }) => (
  // Banking & Insurance — columns under peaked roof (Figma 3576:89208)
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M8.08333 3.83333H8M8.16667 3.83333C8.16667 3.92538 8.09207 4 8 4C7.90793 4 7.83333 3.92538 7.83333 3.83333C7.83333 3.74129 7.90793 3.66667 8 3.66667C8.09207 3.66667 8.16667 3.74129 8.16667 3.83333Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.33333 6V12.6667M6 6V12.6667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 6V12.6667M12.6667 6V12.6667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.2345 6H1.76548C1.52681 6 1.33333 5.80434 1.33333 5.56298C1.33333 5.41506 1.40733 5.27718 1.52997 5.19657L5.82005 2.37657C6.87807 1.68108 7.40713 1.33333 8 1.33333C8.59287 1.33333 9.12193 1.68108 10.1799 2.37657L14.4701 5.19657C14.5927 5.27718 14.6667 5.41506 14.6667 5.56298C14.6667 5.80434 14.4732 6 14.2345 6Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.0265 13.5286L13.5679 13.0572C13.3805 12.8645 13.2867 12.7681 13.1676 12.7174C13.0484 12.6667 12.9159 12.6667 12.6508 12.6667H3.34921C3.08414 12.6667 2.9516 12.6667 2.83242 12.7174C2.71325 12.7681 2.61953 12.8645 2.43209 13.0572L1.97353 13.5286C1.50237 14.0129 1.2668 14.2551 1.34971 14.4609C1.43262 14.6667 1.76578 14.6667 2.43209 14.6667H13.5679C14.2342 14.6667 14.5674 14.6667 14.6503 14.4609C14.7332 14.2551 14.4976 14.0129 14.0265 13.5286Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CatResearchIcon = ({ className = '' }) => (
  // Research & Science — flask/beaker (Figma 3576:89209)
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M5.33333 1.33333H10.6667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.8125 8.6696L10.6614 9.07673C10.3479 9.76667 9.40767 10.4959 7.8406 9.54547C6.8314 8.9334 5.95775 8.44207 5.33313 8.77333L4.81261 9.02747"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.6882 1.33333V5.71068C9.6882 6.18553 9.6882 6.42295 9.7536 6.64815C9.819 6.87333 9.94647 7.07467 10.2014 7.47733L11.5241 9.56667C12.9517 11.8217 13.6655 12.9492 13.1834 13.8079C12.7013 14.6667 11.3545 14.6667 8.66093 14.6667H7.33907C4.6455 14.6667 3.29871 14.6667 2.81663 13.8079C2.33455 12.9492 3.04834 11.8217 4.47593 9.56667L5.79861 7.47733C6.05353 7.07467 6.18099 6.87333 6.24641 6.64815C6.31182 6.42295 6.31182 6.18553 6.31182 5.71068V1.33333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.0833 12.6667H10M10.1667 12.6667C10.1667 12.7587 10.0921 12.8333 10 12.8333C9.90793 12.8333 9.83333 12.7587 9.83333 12.6667C9.83333 12.5746 9.90793 12.5 10 12.5C10.0921 12.5 10.1667 12.5746 10.1667 12.6667Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.75 11.3333H6.66667M6.83333 11.3333C6.83333 11.4254 6.75873 11.5 6.66667 11.5C6.57462 11.5 6.5 11.4254 6.5 11.3333C6.5 11.2413 6.57462 11.1667 6.66667 11.1667C6.75873 11.1667 6.83333 11.2413 6.83333 11.3333Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CatTourismIcon = ({ className = '' }) => (
  // Tourism & Hospitality — headphones/bag shape (Figma 3576:89210)
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M3.33333 8C3.33333 5.42267 5.42267 3.33333 8 3.33333C10.5773 3.33333 12.6667 5.42267 12.6667 8V10.8889C12.6667 11.9231 12.6667 12.4403 12.5251 12.8572C12.2587 13.6422 11.6422 14.2587 10.8572 14.5251C10.4403 14.6667 9.92313 14.6667 8.88887 14.6667H7.11113C6.07686 14.6667 5.55973 14.6667 5.14283 14.5251C4.35779 14.2587 3.74134 13.6422 3.47485 12.8572C3.33333 12.4403 3.33333 11.9231 3.33333 10.8889V8Z"
      stroke="currentColor"
      strokeLinejoin="round"
    />
    <path
      d="M3.33333 11.3333C4.43331 10.1133 6.11515 9.33333 8 9.33333C9.88487 9.33333 11.5667 10.1133 12.6667 11.3333"
      stroke="currentColor"
      strokeLinejoin="round"
    />
    <path d="M7.33333 6.66667H8.66667" stroke="currentColor" strokeLinecap="round" />
    <path
      d="M6 4V3.33333C6 2.71208 6 2.40145 6.10149 2.15642C6.23682 1.82972 6.49639 1.57015 6.82307 1.43483C7.06813 1.33333 7.37873 1.33333 8 1.33333C8.62127 1.33333 8.93187 1.33333 9.17693 1.43483C9.5036 1.57015 9.7632 1.82972 9.89853 2.15642C10 2.40145 10 2.71208 10 3.33333V4"
      stroke="currentColor"
    />
    <path
      d="M3.33333 12.6667H2.47619C1.84501 12.6667 1.33333 12.155 1.33333 11.5238V10.6667C1.33333 9.56207 2.22877 8.66667 3.33333 8.66667"
      stroke="currentColor"
    />
    <path
      d="M12.6667 12.6667H13.5238C14.155 12.6667 14.6667 12.155 14.6667 11.5238V10.6667C14.6667 9.56207 13.7713 8.66667 12.6667 8.66667"
      stroke="currentColor"
    />
  </svg>
);

export const CatEnergyIcon = ({ className = '' }) => (
  // Energy & Environment — leaf (inline; Figma reused food icon for this slot)
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M13 2.5C9 2.5 5.5 5.5 4.5 10C4 12 4.2 13.5 4.5 14.5C5.5 12 8 9.5 10.5 8C8 10.5 6.5 13 6 14.5C7.5 14.5 10 14 12 12C14 10 14.5 7 14.5 3.5L13 2.5Z"
      fill="currentColor"
    />
    <path
      d="M4.5 14.5C5 11.5 7 8.5 10 7"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

export const CatStartupsIcon = ({ className = '' }) => (
  // Startups & VC — rocket (inline; Figma reused food icon for this slot)
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M10 1.5C7.5 1.5 5 3.5 4 6.5L2 9L4.5 11.5C5 10.5 6 9.5 7 9C6.5 10 6 11 6 12L8 14L10.5 12.5C13 11 14.5 8.5 14.5 6C14.5 3.5 12.5 1.5 10 1.5Z"
      fill="currentColor"
    />
    <circle cx="9.5" cy="6.5" r="1.3" fill="white" />
    <path d="M2 9C1 9.5 0.5 11.5 2 13C2.5 11 3 9.5 2 9Z" fill="currentColor" />
  </svg>
);

// ---- InterestsCompleteModal stat-row + CTA glyphs --------------------
// Used by InterestsCompleteModal. All strokes/fills use currentColor so
// the parent controls tint via Tailwind text-* class.

export const CheckIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path
      d="M3.5 9.5l4 4 7-8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Stroke-based 18×18 arrow — distinct from ArrowRightIcon (20×20 fill, CTA button).
export const ArrowRightSmIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path
      d="M3 9h12M10 5l5 4-5 4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Filled brand chevron — Figma `20-arrowhead-down` (job-post salary selects,
// node 5132:67855 / 67870). Pass `className="size-5 text-brand-green"`.
export const ArrowheadDownIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 13C9.68524 13 9.38885 12.8518 9.2 12.6L6.20001 8.6C5.97274 8.29698 5.93619 7.89157 6.10558 7.55279C6.27497 7.214 6.62123 7 7 7H13C13.3788 7 13.725 7.214 13.8944 7.55279C14.0638 7.89157 14.0273 8.29698 13.8 8.6L10.8 12.6C10.6111 12.8518 10.3148 13 10 13Z"
      fill="currentColor"
    />
  </svg>
);

// Edit / pencil glyph — Figma Confirm Job Posting "Go back and edit" (5132:72897).
// 11×12 viewBox; stroke inherits via currentColor (defaults to #111 on tertiary).
export const EditPencilIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 11 12"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M0.5 11.0002H9.83333M1.47183 6.44261C1.22311 6.69189 1.0834 7.02964 1.08333 7.38178V9.2502H2.96342C3.31575 9.2502 3.6535 9.1102 3.90258 8.86053L9.44425 3.31595C9.69289 3.06663 9.83251 2.72889 9.83251 2.37678C9.83251 2.02467 9.69289 1.68693 9.44425 1.43761L8.89708 0.88928C8.77369 0.765818 8.62716 0.66789 8.46589 0.601094C8.30462 0.534299 8.13177 0.499946 7.95721 0.5C7.78266 0.500054 7.60982 0.534514 7.44859 0.60141C7.28737 0.668305 7.1409 0.766325 7.01758 0.889863L1.47183 6.44261Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export const WorkEditPencilIcon = ({ className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
  >
    <path
      d="M3.25033 7.04167L5.41699 9.20833M2.16699 9.75L3.25033 6.5L8.66699 1.625L10.292 3.25L5.41699 8.66667L2.16699 9.75Z"
      stroke="currentColor"
      strokeWidth="1.40833"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PlusIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const SparkleIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M10 2l1.9 5.6L17.5 9l-5.6 1.9L10 17l-1.9-5.6L3 9l5.6-1.9L10 2Z" />
  </svg>
);

// ---- Profile-filling journey step icons ----------------------------------------
// Used in the right panel "Your journey" step list on every profile-filling intro
// page. All use 16×16 viewBox + stroke="currentColor" so the parent text-color
// class controls the tint. Hand-crafted to match the visual identity of the icon
// libraries used in Figma (user, material-symbols:interests-outline,
// arcticons:habit-builder, game-icons:skills, hugeicons:work, dashicons:portfolio,
// ph:certificate, mage:goals, mynaui:video).

export const AvatarStepIcon = ({ className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M11.3332 5.66927C11.3332 3.82832 9.84077 2.33594 7.99984 2.33594C6.15889 2.33594 4.6665 3.82832 4.6665 5.66927C4.6665 7.5102 6.15889 9.0026 7.99984 9.0026C9.84077 9.0026 11.3332 7.5102 11.3332 5.66927Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.6668 13.6667C12.6668 11.0893 10.5775 9 8.00016 9C5.42284 9 3.3335 11.0893 3.3335 13.6667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_5178_101425"
        x1="11.3332"
        y1="2.33594"
        x2="5.8398"
        y2="9.85931"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="currentColor" />
        <stop offset="0.201923" stopColor="currentColor" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_5178_101425"
        x1="12.6668"
        y1="9"
        x2="10.0658"
        y2="16.1245"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="currentColor" />
        <stop offset="0.201923" stopColor="currentColor" />
      </linearGradient>
    </defs>
  </svg>
);

export const InterestsStepIcon = ({ className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g opacity="0.45">
      <path
        d="M1.84668 6.94962L4.69268 1.98828L7.53868 6.94962H1.84668ZM3.04001 12.9996C2.58624 12.5458 2.35935 11.9925 2.35935 11.3396C2.35935 10.6774 2.58601 10.1198 3.03935 9.66695C3.49357 9.2145 4.0489 8.98828 4.70535 8.98828C5.36179 8.98828 5.9169 9.21517 6.37068 9.66895C6.82446 10.1227 7.05135 10.6778 7.05135 11.3343C7.05135 11.9907 6.82446 12.5458 6.37068 12.9996C5.9169 13.4534 5.36179 13.6803 4.70535 13.6803C4.0489 13.6803 3.49424 13.4534 3.04001 12.9996ZM5.89668 12.5263C6.22201 12.2009 6.38468 11.8036 6.38468 11.3343C6.38468 10.8649 6.22201 10.4678 5.89668 10.1429C5.57135 9.81806 5.17424 9.65539 4.70535 9.65495C4.23646 9.6545 3.83912 9.81717 3.51335 10.1429C3.18757 10.4687 3.02535 10.8658 3.02668 11.3343C3.02801 11.8027 3.19046 12.2001 3.51401 12.5263C3.83757 12.8525 4.2349 13.0149 4.70601 13.0136C5.17712 13.0123 5.57357 12.8498 5.89668 12.5263ZM2.99735 6.28295H6.40001L4.69268 3.34095L2.99735 6.28295ZM9.01268 13.6803V8.98828H13.7053V13.6803H9.01268ZM9.67935 13.0136H13.0387V9.65495H9.67935V13.0136ZM11.3593 6.94962C10.9482 6.62117 10.5713 6.3165 10.2287 6.03561C9.88646 5.75428 9.59179 5.48117 9.34468 5.21628C9.09801 4.95139 8.90624 4.68806 8.76935 4.42628C8.63246 4.16495 8.56401 3.89117 8.56401 3.60495C8.56401 3.20717 8.69424 2.87895 8.95468 2.62028C9.21468 2.36117 9.54601 2.23161 9.94868 2.23161C10.2145 2.23161 10.4629 2.29673 10.694 2.42695C10.9251 2.55717 11.1469 2.75317 11.3593 3.01495C11.5713 2.76206 11.7971 2.56828 12.0367 2.43361C12.2767 2.29895 12.5251 2.23161 12.782 2.23161C13.1731 2.23161 13.4996 2.36784 13.7613 2.64028C14.0231 2.91317 14.154 3.24739 14.154 3.64295C14.154 3.92073 14.0856 4.18828 13.9487 4.44561C13.8122 4.70339 13.6205 4.9625 13.3733 5.22295C13.1262 5.48339 12.8316 5.75428 12.4893 6.03561C12.1471 6.31695 11.7705 6.62161 11.3593 6.94962ZM11.3593 6.08428C12.1336 5.48606 12.6818 5.00095 13.004 4.62895C13.3262 4.25695 13.4873 3.92673 13.4873 3.63828C13.4873 3.42539 13.42 3.24873 13.2853 3.10828C13.1507 2.96828 12.9813 2.89828 12.7773 2.89828C12.6338 2.89828 12.4938 2.94161 12.3573 3.02828C12.2209 3.11495 12.032 3.27895 11.7907 3.52028L11.3593 3.94428L10.9273 3.52028C10.6776 3.2705 10.4871 3.1045 10.356 3.02228C10.2249 2.93961 10.0867 2.89828 9.94135 2.89828C9.72801 2.89828 9.55646 2.96206 9.42668 3.08961C9.2969 3.21717 9.23157 3.39139 9.23068 3.61228C9.23068 3.9185 9.39179 4.25739 9.71401 4.62895C10.0362 5.0005 10.5851 5.48561 11.3593 6.08428Z"
        fill="url(#paint0_linear_5178_101432)"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_5178_101432"
        x1="14.154"
        y1="1.98828"
        x2="4.68022"
        y2="15.6458"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="currentColor" />
        <stop offset="0.201923" stopColor="currentColor" />
      </linearGradient>
    </defs>
  </svg>
);

export const PersonalityStepIcon = ({ className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g opacity="0.45">
      <path
        d="M8.00016 15.1693C11.9582 15.1693 15.1668 11.9606 15.1668 8.0026C15.1668 4.04456 11.9582 0.835938 8.00016 0.835938C4.04212 0.835938 0.833496 4.04456 0.833496 8.0026C0.833496 11.9606 4.04212 15.1693 8.00016 15.1693Z"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.00016 12.1693C10.3013 12.1693 12.1668 10.3038 12.1668 8.0026C12.1668 5.70142 10.3013 3.83594 8.00016 3.83594C5.69898 3.83594 3.8335 5.70142 3.8335 8.0026C3.8335 10.3038 5.69898 12.1693 8.00016 12.1693Z"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.99984 13.8307C11.2215 13.8307 13.8332 11.2191 13.8332 7.9974C13.8332 4.77573 11.2215 2.16406 7.99984 2.16406C4.77818 2.16406 2.1665 4.77573 2.1665 7.9974C2.1665 11.2191 4.77818 13.8307 7.99984 13.8307Z"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export const SkillsStepIcon = ({ className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M3.76807 1.03223C3.79714 1.03306 3.83619 1.03418 3.88428 1.03418C4.5556 1.03418 5.27197 1.78774 5.27197 2.93457C5.27193 3.50139 5.0801 3.99887 4.8042 4.34375L4.48877 4.7373L4.21924 5.07422L4.646 5.14062L5.146 5.21875H5.14697C5.55097 5.27948 5.82692 5.46618 6.06104 5.77539V5.77637C6.29795 6.09689 6.48124 6.55657 6.60205 7.11523L6.60303 7.11621C6.8139 8.06933 6.83693 9.23243 6.83936 10.3027H5.54736L5.53174 10.5361L5.21924 15.2529H2.67529L2.3208 10.5342L2.30322 10.3027H0.95166C0.96471 9.25152 1.02532 8.10332 1.25537 7.16016C1.392 6.60453 1.58165 6.13961 1.81982 5.81738L1.8208 5.81543C2.05244 5.49554 2.31579 5.3098 2.66943 5.24219L2.67041 5.24316L3.16064 5.15234L3.58154 5.07422L3.30713 4.74609L2.98779 4.36426C2.70157 4.0197 2.49956 3.51441 2.49951 2.93457C2.49951 1.8611 3.14038 1.11076 3.75342 1.03223L3.75537 1.03125C3.75928 1.03137 3.7637 1.0321 3.76807 1.03223ZM13.7495 13.2812C14.1489 13.2812 14.4683 13.6006 14.4683 14C14.4683 14.3994 14.1489 14.7188 13.7495 14.7188C13.3503 14.7185 13.0308 14.3993 13.0308 14C13.0308 13.6007 13.3503 13.2815 13.7495 13.2812ZM11.9702 1.96875C11.97 1.97914 11.9683 1.98954 11.9683 2C11.9683 2.01046 11.97 2.02086 11.9702 2.03125H10.0308V8.96875H11.9702C11.97 8.97913 11.9683 8.98953 11.9683 9C11.9683 9.01047 11.97 9.02087 11.9702 9.03125H10.0308V13.9688H11.9702C11.97 13.9791 11.9683 13.9895 11.9683 14C11.9683 14.0105 11.97 14.0209 11.9702 14.0312H9.96826V13.0312H6.74951V12.9688H9.96826V9.03125H8.24951V8.96875H9.96826V3.53125H6.74951V3.46875H9.96826V1.96875H11.9702ZM13.7495 8.28125C14.1489 8.28125 14.4683 8.60057 14.4683 9C14.4683 9.39943 14.1489 9.71875 13.7495 9.71875C13.3503 9.71854 13.0308 9.3993 13.0308 9C13.0308 8.6007 13.3503 8.28146 13.7495 8.28125ZM13.7495 1.28125C14.1491 1.28125 14.4683 1.59979 14.4683 2C14.4683 2.40021 14.1491 2.71875 13.7495 2.71875C13.3501 2.71854 13.0308 2.40008 13.0308 2C13.0308 1.59992 13.3501 1.28146 13.7495 1.28125Z"
      stroke="url(#paint0_linear_5178_101443)"
      strokeWidth="0.5"
    />
    <defs>
      <linearGradient
        id="paint0_linear_5178_101443"
        x1="14.7187"
        y1="0.78125"
        x2="2.41982"
        y2="16.8241"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="currentColor" />
        <stop offset="0.201923" stopColor="currentColor" />
      </linearGradient>
    </defs>
  </svg>
);

export const WorkStepIcon = ({ className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g opacity="0.45">
      <path
        d="M10.6668 4.66667C10.6668 3.40933 10.6668 2.78133 10.2762 2.39067C9.8855 2 9.2575 2 8.00016 2C6.74283 2 6.11483 2 5.72416 2.39067C5.3335 2.78133 5.3335 3.40933 5.3335 4.66667M1.3335 9.33333C1.3335 7.46067 1.3335 6.52467 1.78283 5.852C1.97744 5.5607 2.22753 5.31061 2.51883 5.116C3.1915 4.66667 4.12683 4.66667 6.00016 4.66667H10.0002C11.8728 4.66667 12.8088 4.66667 13.4815 5.116C13.7728 5.31061 14.0229 5.5607 14.2175 5.852C14.6668 6.52467 14.6668 7.46 14.6668 9.33333C14.6668 11.2067 14.6668 12.142 14.2175 12.8147C14.0229 13.106 13.7728 13.3561 13.4815 13.5507C12.8088 14 11.8735 14 10.0002 14H6.00016C4.1275 14 3.1915 14 2.51883 13.5507C2.22753 13.3561 1.97744 13.106 1.78283 12.8147C1.3335 12.142 1.3335 11.2067 1.3335 9.33333Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 7.33594L4.43467 7.4706C6.75852 8.18073 9.24148 8.18073 11.5653 7.4706L12 7.33594M8 8.0026V9.33594"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export const PortfolioStepIcon = ({ className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="12"
    viewBox="0 0 16 12"
    fill="none"
  >
    <path
      d="M3.13165 1.6H0.555646C0.259646 1.6 -0.0363543 1.856 0.00364566 2.272L1.25165 10.264C1.25165 10.264 2.73165 4.376 3.01965 2.96C3.10765 2.536 3.50765 2.4 3.80365 2.4H7.93165C7.93165 2.4 7.37165 0.736 7.31565 0.552C7.21965 0.2 7.04365 0 6.69165 0H4.04365C3.75565 0 3.48365 0.184 3.40365 0.512C3.33165 0.832 3.13165 1.6 3.13165 1.6ZM7.03565 1.6H3.83565C3.83565 1.6 4.17165 0.8 4.53165 0.8H6.23565C6.61965 0.8 7.03565 1.6 7.03565 1.6ZM2.06765 10.6C1.81965 10.976 1.45965 11.2 1.05965 11.2H13.6436C14.0756 11.2 14.3796 10.952 14.4676 10.536C14.8196 8.784 15.8116 3.784 15.8116 3.784C15.8676 3.384 15.5716 3.2 15.3156 3.2H12.7316V2.024C12.7316 1.896 12.5236 1.6 12.2036 1.6H9.19565C8.77965 1.6 8.49965 2.064 8.49965 2.064L7.93165 3.2H4.40365C4.14765 3.2 3.89965 3.352 3.85165 3.6C3.85165 3.6 2.57965 8.96 2.47565 9.464C2.41965 9.76 2.29965 10.256 2.06765 10.6ZM12.2356 3.2H8.73165C8.73165 3.2 9.19565 2.4 9.63565 2.4H11.4676C12.0356 2.4 12.2356 3.2 12.2356 3.2Z"
      fill="url(#paint0_linear_5178_104578)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_5178_104578"
        x1="15.8185"
        y1="0"
        x2="7.91329"
        y2="15.2911"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="currentColor" />
        <stop offset="0.201923" stopColor="currentColor" />
      </linearGradient>
    </defs>
  </svg>
);

export const PortfolioPostIcon = ({ className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M36.3675 17.3536C36.77 19.7523 36.9712 20.9516 35.4038 23.2201C35.2432 23.4528 34.8277 23.9513 34.6283 24.1509C32.6838 26.0968 30.718 26.0968 26.786 26.0968H23.5653C22.5142 26.0968 21.9885 26.0968 21.6065 26.1894C19.931 26.5959 18.8385 28.2309 19.0883 29.9583C19.1453 30.3521 19.3405 30.8466 19.731 31.8358C19.8908 32.2406 19.9707 32.4431 20.0227 32.8831C20.2153 34.5131 18.4782 36.5838 16.8597 36.6534C16.4226 36.6723 16.3947 36.6661 16.3388 36.6534C12.7696 35.8491 9.43673 33.8529 6.97315 30.7359C1.22798 23.4671 2.38577 12.8552 9.55913 7.0335C16.7325 1.21184 27.205 2.38504 32.9502 9.65392C34.78 11.9689 35.9095 14.6231 36.3675 17.3536Z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M12.2788 12.9167H12.0705M12.4871 12.9167C12.4871 13.1468 12.3006 13.3333 12.0705 13.3333C11.8404 13.3333 11.6538 13.1468 11.6538 12.9167C11.6538 12.6865 11.8404 12.5 12.0705 12.5C12.3006 12.5 12.4871 12.6865 12.4871 12.9167Z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.2788 26.2487H12.0705M12.4871 26.2487C12.4871 26.4787 12.3006 26.6654 12.0705 26.6654C11.8404 26.6654 11.6538 26.4787 11.6538 26.2487C11.6538 26.0185 11.8404 25.832 12.0705 25.832C12.3006 25.832 12.4871 26.0185 12.4871 26.2487Z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.7788 9.58464H19.5705M19.9871 9.58464C19.9871 9.81475 19.8006 10.0013 19.5705 10.0013C19.3403 10.0013 19.1538 9.81475 19.1538 9.58464C19.1538 9.35452 19.3403 9.16797 19.5705 9.16797C19.8006 9.16797 19.9871 9.35452 19.9871 9.58464Z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27.2788 12.9167H27.0705M27.4871 12.9167C27.4871 13.1468 27.3006 13.3333 27.0705 13.3333C26.8403 13.3333 26.6538 13.1468 26.6538 12.9167C26.6538 12.6865 26.8403 12.5 27.0705 12.5C27.3006 12.5 27.4871 12.6865 27.4871 12.9167Z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M30.6118 19.5846H30.4035M30.8201 19.5846C30.8201 19.8146 30.6336 20.0013 30.4035 20.0013C30.1733 20.0013 29.9868 19.8146 29.9868 19.5846C29.9868 19.3545 30.1733 19.168 30.4035 19.168C30.6336 19.168 30.8201 19.3545 30.8201 19.5846Z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.77881 19.5846H9.57048M9.98714 19.5846C9.98714 19.8146 9.80059 20.0013 9.57048 20.0013C9.34036 20.0013 9.15381 19.8146 9.15381 19.5846C9.15381 19.3545 9.34036 19.168 9.57048 19.168C9.80059 19.168 9.98714 19.3545 9.98714 19.5846Z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const HelperTextIcon = ({ className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.074 2.01242C8.02575 1.9969 7.97385 1.9969 7.92561 2.01242C7.91962 2.01519 7.89316 2.02935 7.83447 2.07917C7.75006 2.15083 7.64491 2.25532 7.47113 2.4291L2.42812 7.4721C2.25434 7.64588 2.14985 7.75103 2.0782 7.83544C2.02837 7.89413 2.01421 7.9206 2.01145 7.92658C1.99592 7.97483 1.99592 8.02673 2.01144 8.07498C2.01421 8.08096 2.02837 8.10743 2.0782 8.16612C2.14985 8.25053 2.25434 8.35568 2.42812 8.52946L7.47113 13.5725C7.64491 13.7462 7.75006 13.8507 7.83447 13.9224C7.89317 13.9722 7.91964 13.9864 7.92561 13.9891C7.97386 14.0047 8.02576 14.0047 8.074 13.9891C8.07999 13.9864 8.10645 13.9722 8.16514 13.9224C8.24955 13.8507 8.3547 13.7462 8.52848 13.5725L13.5715 8.52946C13.7453 8.35568 13.8498 8.25053 13.9214 8.16612C13.9712 8.10743 13.9854 8.08096 13.9882 8.07498C14.0037 8.02673 14.0037 7.97483 13.9882 7.92658C13.9854 7.9206 13.9712 7.89413 13.9214 7.83544C13.8498 7.75103 13.7453 7.64588 13.5715 7.4721L8.52848 2.4291C8.3547 2.25532 8.24955 2.15083 8.16514 2.07917C8.10645 2.02934 8.07998 2.01519 8.074 2.01242ZM8.07265 2.01187C8.07264 2.01184 8.07314 2.01203 8.074 2.01242L8.07265 2.01187ZM13.9887 8.07363C13.9887 8.07361 13.9886 8.07412 13.9882 8.07498L13.9887 8.07363ZM7.92696 13.9897C7.92698 13.9897 7.92647 13.9895 7.92561 13.9891L7.92696 13.9897ZM2.01089 7.92793C2.01086 7.92795 2.01105 7.92745 2.01145 7.92658L2.01089 7.92793ZM7.55411 0.871372C7.84379 0.777251 8.15582 0.777251 8.4455 0.871372C8.64699 0.93684 8.80595 1.04907 8.94176 1.16436C9.06811 1.27163 9.20813 1.41167 9.36199 1.56554L14.435 6.63859C14.5889 6.79245 14.729 6.93247 14.8362 7.05883C14.9515 7.19464 15.0637 7.3536 15.1292 7.55509C15.2233 7.84476 15.2233 8.1568 15.1292 8.44647C15.0637 8.64796 14.9515 8.80692 14.8362 8.94273C14.729 9.06908 14.5889 9.2091 14.435 9.36296L9.36198 14.436C9.20812 14.5899 9.06811 14.7299 8.94176 14.8372C8.80595 14.9525 8.64699 15.0647 8.4455 15.1302C8.15582 15.2243 7.84379 15.2243 7.55411 15.1302C7.35262 15.0647 7.19366 14.9525 7.05785 14.8372C6.9315 14.7299 6.79147 14.5899 6.63761 14.436L1.56457 9.36296C1.41069 9.2091 1.27065 9.06909 1.16339 8.94273C1.04809 8.80692 0.935864 8.64796 0.870395 8.44647C0.776274 8.1568 0.776274 7.84476 0.870395 7.55509C0.935864 7.3536 1.04809 7.19464 1.16339 7.05883C1.27065 6.93248 1.41068 6.79247 1.56455 6.63862L6.63765 1.56552C6.7915 1.41165 6.93151 1.27162 7.05785 1.16436C7.19366 1.04907 7.35262 0.93684 7.55411 0.871372ZM7.9998 4.00078C8.33117 4.00078 8.5998 4.26941 8.5998 4.60078V7.40078C8.5998 7.73215 8.33117 8.00078 7.9998 8.00078C7.66843 8.00078 7.3998 7.73215 7.3998 7.40078V4.60078C7.3998 4.26941 7.66843 4.00078 7.9998 4.00078ZM7.9998 9.60078C8.33117 9.60078 8.5998 9.86941 8.5998 10.2008V11.4008C8.5998 11.7322 8.33117 12.0008 7.9998 12.0008C7.66843 12.0008 7.3998 11.7322 7.3998 11.4008V10.2008C7.3998 9.86941 7.66843 9.60078 7.9998 9.60078Z"
      fill="currentColor"
    />
  </svg>
);

export const ImagePlaceholderIcon = ({ className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
  >
    <path
      d="M21 4.5H15C9.34314 4.5 6.51473 4.5 4.75736 6.25735C3 8.01472 3 10.8431 3 16.5V19.5C3 25.1568 3 27.9853 4.75736 29.7426C6.51473 31.5 9.34314 31.5 15 31.5H21C26.6568 31.5 29.4853 31.5 31.2426 29.7426C33 27.9853 33 25.1568 33 19.5V16.5C33 10.8431 33 8.01472 31.2426 6.25735C29.4853 4.5 26.6568 4.5 21 4.5Z"
      stroke="currentColor"
      strokeOpacity="0.5"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.75 15C13.9926 15 15 13.9926 15 12.75C15 11.5074 13.9926 10.5 12.75 10.5C11.5074 10.5 10.5 11.5074 10.5 12.75C10.5 13.9926 11.5074 15 12.75 15Z"
      stroke="currentColor"
      strokeOpacity="0.5"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M32.25 25.5L24.522 17.0695C24.1894 16.7065 23.7196 16.5 23.2275 16.5C22.7616 16.5 22.3149 16.6851 21.9856 17.0144L15 24L11.7589 20.759C11.4331 20.433 10.9911 20.25 10.5303 20.25C10.034 20.25 9.56134 20.4622 9.23161 20.8332L3.75 27"
      stroke="currentColor"
      strokeOpacity="0.5"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Certificate/credential glyph — used by the Certifications profile-filling
// flow's card icon tile (CertsStage2Section.jsx), DeleteCertModal.jsx's
// preview card, and CertSavedModal.jsx's mini-list. Figma's own populated
// example cards (5245:167801 etc.) literally reuse the "laptop" icon from the
// Work-flow card clone — but the SAME Certs list page's own empty state
// (5223:167439 "certificate-01") uses a genuinely distinct certificate glyph,
// so this hand-crafted document+ribbon shape (not pulled from Figma path
// data — same "no matching icon-set identifier" treatment as
// WorkSavedModal.jsx's CornerArrowIcon) is used everywhere in this flow
// instead of blindly reusing WorkRoleIcon's laptop shape.
export const CertificateIcon = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <rect x="3" y="3" width="18" height="13" rx="1.5" />
    <line x1="6.5" y1="7" x2="17.5" y2="7" />
    <line x1="6.5" y1="10.5" x2="14" y2="10.5" />
    <path d="M9 16v4.2a.6.6 0 0 0 .93.5L12 19.4l2.07 1.3a.6.6 0 0 0 .93-.5V16" />
  </svg>
);

export const UploadCertificateIcon = ({ className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
  >
    <path
      d="M19.1667 36.6654C12.4884 36.6654 9.14932 36.6654 7.07467 34.2245C5 31.7839 5 27.8554 5 19.9987C5 12.142 5 8.21358 7.07467 5.77281C9.14932 3.33203 12.4884 3.33203 19.1667 3.33203C25.8448 3.33203 29.184 3.33203 31.2587 5.77281C32.9287 7.73756 33.2545 10.6663 33.318 15.832"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.3335 13.332H25.0002M13.3335 21.6654H18.3335"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M32.6822 30.1757C34.087 29.153 35.0002 27.4957 35.0002 25.625C35.0002 22.5183 32.4818 20 29.3752 20H28.9585C25.8518 20 23.3335 22.5183 23.3335 25.625C23.3335 27.4957 24.2467 29.153 25.6515 30.1757M32.6822 30.1757C31.754 30.8513 30.6112 31.25 29.3752 31.25H28.9585C27.7225 31.25 26.5797 30.8513 25.6515 30.1757M32.6822 30.1757L33.6535 33.234C34.024 34.4005 34.2093 34.9838 34.1587 35.347C34.0532 36.1028 33.4367 36.664 32.7088 36.6667C32.3592 36.668 31.8352 36.393 30.7873 35.8432C30.338 35.6073 30.1133 35.4893 29.8835 35.42C29.4152 35.2788 28.9185 35.2788 28.4502 35.42C28.2203 35.4893 27.9957 35.6073 27.5463 35.8432C26.4985 36.393 25.9745 36.668 25.6248 36.6667C24.897 36.664 24.2805 36.1028 24.175 35.347C24.1243 34.9838 24.3097 34.4005 24.6802 33.234L25.6515 30.1757"
      stroke="currentColor"
      strokeWidth="2.5"
    />
  </svg>
);

export const CertsStepIcon = ({ className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g opacity="0.45">
      <path
        d="M8 8.5C8 8.63261 7.94732 8.75979 7.85355 8.85355C7.75979 8.94732 7.63261 9 7.5 9H4.5C4.36739 9 4.24021 8.94732 4.14645 8.85355C4.05268 8.75979 4 8.63261 4 8.5C4 8.36739 4.05268 8.24021 4.14645 8.14645C4.24021 8.05268 4.36739 8 4.5 8H7.5C7.63261 8 7.75979 8.05268 7.85355 8.14645C7.94732 8.24021 8 8.36739 8 8.5ZM7.5 6H4.5C4.36739 6 4.24021 6.05268 4.14645 6.14645C4.05268 6.24021 4 6.36739 4 6.5C4 6.63261 4.05268 6.75979 4.14645 6.85355C4.24021 6.94732 4.36739 7 4.5 7H7.5C7.63261 7 7.75979 6.94732 7.85355 6.85355C7.94732 6.75979 8 6.63261 8 6.5C8 6.36739 7.94732 6.24021 7.85355 6.14645C7.75979 6.05268 7.63261 6 7.5 6ZM14.5 10.0919V14C14.5008 14.0881 14.4783 14.1749 14.4347 14.2516C14.3911 14.3282 14.3281 14.392 14.252 14.4364C14.1758 14.4808 14.0893 14.5043 14.0011 14.5045C13.913 14.5047 13.8263 14.4816 13.75 14.4375L12.25 13.5787L10.75 14.4375C10.6737 14.4816 10.587 14.5047 10.4989 14.5045C10.4107 14.5043 10.3242 14.4808 10.248 14.4364C10.1719 14.392 10.1089 14.3282 10.0653 14.2516C10.0217 14.1749 9.99921 14.0881 10 14V12.5H2.5C2.23478 12.5 1.98043 12.3946 1.79289 12.2071C1.60536 12.0196 1.5 11.7652 1.5 11.5V3.5C1.5 3.23478 1.60536 2.98043 1.79289 2.79289C1.98043 2.60536 2.23478 2.5 2.5 2.5H13.5C13.7652 2.5 14.0196 2.60536 14.2071 2.79289C14.3946 2.98043 14.5 3.23478 14.5 3.5V5.40812C14.8161 5.7108 15.0676 6.07433 15.2394 6.47681C15.4113 6.87928 15.4999 7.31238 15.4999 7.75C15.4999 8.18762 15.4113 8.62072 15.2394 9.0232C15.0676 9.42567 14.8161 9.7892 14.5 10.0919ZM10 11.5V10.0919C9.45513 9.56639 9.11078 8.8672 9.02637 8.11495C8.94196 7.36269 9.12278 6.60457 9.53764 5.9714C9.95249 5.33822 10.5754 4.86972 11.2987 4.64674C12.0221 4.42376 12.8007 4.46028 13.5 4.75V3.5H2.5V11.5H10ZM13.5 10.75C13.104 10.9154 12.6791 11.0006 12.25 11.0006C11.8209 11.0006 11.396 10.9154 11 10.75V13.1388L12 12.5662C12.0756 12.5231 12.1611 12.5003 12.2481 12.5003C12.3352 12.5003 12.4207 12.5231 12.4963 12.5662L13.4963 13.1388L13.5 10.75ZM14.5 7.75C14.5 7.30499 14.368 6.86998 14.1208 6.49997C13.8736 6.12996 13.5222 5.84157 13.111 5.67127C12.6999 5.50097 12.2475 5.45642 11.811 5.54323C11.3746 5.63005 10.9737 5.84434 10.659 6.15901C10.3443 6.47368 10.13 6.87459 10.0432 7.31105C9.95642 7.7475 10.001 8.1999 10.1713 8.61104C10.3416 9.02217 10.63 9.37357 11 9.62081C11.37 9.86804 11.805 10 12.25 10C12.5455 10 12.8381 9.9418 13.111 9.82873C13.384 9.71566 13.6321 9.54992 13.841 9.34099C14.0499 9.13206 14.2157 8.88402 14.3287 8.61104C14.4418 8.33805 14.5 8.04547 14.5 7.75Z"
        fill="url(#paint0_linear_5178_101461)"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_5178_101461"
        x1="15.4999"
        y1="2.5"
        x2="6.15787"
        y2="17.4208"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="currentColor" />
        <stop offset="0.201923" stopColor="#E8F2ED" />
      </linearGradient>
    </defs>
  </svg>
);

export const GoalsStepIcon = ({ className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g opacity="0.45">
      <path
        d="M7.10673 7.10156C6.8689 7.33815 6.73464 7.65943 6.7334 7.9949C6.7334 8.33084 6.86685 8.65302 7.1044 8.89056C7.34194 9.12811 7.66412 9.26156 8.00006 9.26156C8.33553 9.26032 8.65681 9.12606 8.8934 8.88823"
        stroke="url(#paint0_linear_5178_101465)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.99971 4.19531C7.24814 4.19531 6.51345 4.41818 5.88854 4.83573C5.26364 5.25328 4.77658 5.84676 4.48897 6.54112C4.20135 7.23547 4.1261 7.99953 4.27272 8.73666C4.41935 9.47378 4.78126 10.1509 5.3127 10.6823C5.84414 11.2138 6.52124 11.5757 7.25837 11.7223C7.99549 11.8689 8.75955 11.7937 9.45391 11.5061C10.1483 11.2184 10.7417 10.7314 11.1593 10.1065C11.5768 9.48157 11.7997 8.74688 11.7997 7.99531"
        stroke="url(#paint1_linear_5178_101465)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.99984 1.66406C6.74722 1.66406 5.52274 2.03551 4.48123 2.73142C3.43972 3.42734 2.62796 4.41647 2.1486 5.57373C1.66925 6.731 1.54383 8.00442 1.7882 9.23297C2.03257 10.4615 2.63576 11.59 3.5215 12.4757C4.40723 13.3615 5.53572 13.9647 6.76427 14.209C7.99281 14.4534 9.26624 14.328 10.4235 13.8486C11.5808 13.3693 12.5699 12.5575 13.2658 11.516C13.9617 10.4745 14.3332 9.25001 14.3332 7.9974M10.3498 5.64806L8.63317 7.36406"
        stroke="url(#paint2_linear_5178_101465)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.9597 3.89232L11.7997 4.19632L12.1037 2.03632C12.1059 2.01123 12.1006 1.98605 12.0884 1.96399C12.0763 1.94192 12.0578 1.92399 12.0354 1.91247C12.013 1.90094 11.9877 1.89636 11.9627 1.89931C11.9377 1.90225 11.9141 1.91258 11.895 1.92899L10.463 3.35365C10.3159 3.5018 10.2077 3.684 10.1481 3.88406C10.0884 4.08411 10.0791 4.29581 10.121 4.50032L10.349 5.64699L11.4957 5.87432C11.7002 5.91622 11.9119 5.90692 12.1119 5.84726C12.312 5.78759 12.4942 5.6794 12.6423 5.53232L14.0663 4.10099C14.0828 4.08183 14.0931 4.05819 14.0961 4.03311C14.099 4.00802 14.0944 3.98263 14.0828 3.9602C14.0711 3.93777 14.0531 3.91932 14.0309 3.90723C14.0088 3.89513 13.9835 3.88994 13.9583 3.89232"
        stroke="url(#paint3_linear_5178_101465)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_5178_101465"
        x1="8.8934"
        y1="7.10156"
        x2="7.11354"
        y2="9.53914"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="currentColor" />
        <stop offset="0.201923" stopColor="#E8F2ED" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_5178_101465"
        x1="11.7997"
        y1="4.19531"
        x2="5.53726"
        y2="12.772"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="currentColor" />
        <stop offset="0.201923" stopColor="#E8F2ED" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_5178_101465"
        x1="14.3332"
        y1="1.66406"
        x2="3.89576"
        y2="15.9585"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="currentColor" />
        <stop offset="0.201923" stopColor="#E8F2ED" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_5178_101465"
        x1="14.0969"
        y1="1.89844"
        x2="10.7996"
        y2="6.41438"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="currentColor" />
        <stop offset="0.201923" stopColor="#E8F2ED" />
      </linearGradient>
    </defs>
  </svg>
);

export const PitchStepIcon = ({ className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g opacity="0.45">
      <path
        d="M2 10.4974V5.4974C2 5.14377 2.14048 4.80464 2.39052 4.55459C2.64057 4.30454 2.97971 4.16406 3.33333 4.16406H9C9.35362 4.16406 9.69276 4.30454 9.94281 4.55459C10.1929 4.80464 10.3333 5.14377 10.3333 5.4974V10.4974C10.3333 10.851 10.1929 11.1902 9.94281 11.4402C9.69276 11.6903 9.35362 11.8307 9 11.8307H3.33333C2.97971 11.8307 2.64057 11.6903 2.39052 11.4402C2.14048 11.1902 2 10.851 2 10.4974ZM13.4453 4.65806L10.7787 7.0334C10.7435 7.06461 10.7154 7.10289 10.6961 7.14575C10.6768 7.18861 10.6667 7.23506 10.6667 7.28206V8.4674C10.6667 8.5144 10.6768 8.56085 10.6961 8.60371C10.7154 8.64656 10.7435 8.68485 10.7787 8.71606L13.4453 11.0914C13.4934 11.1341 13.5527 11.1619 13.6162 11.1716C13.6798 11.1814 13.7447 11.1725 13.8033 11.1462C13.8619 11.1198 13.9117 11.0771 13.9466 11.0232C13.9815 10.9692 14 10.9063 14 10.8421V4.9074C14 4.84314 13.9815 4.78025 13.9466 4.7263C13.9117 4.67234 13.8619 4.62962 13.8033 4.60328C13.7447 4.57693 13.6798 4.56809 13.6162 4.57781C13.5527 4.58753 13.4934 4.6154 13.4453 4.65806Z"
        stroke="url(#paint0_linear_5178_101473)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_5178_101473"
        x1="14"
        y1="4.16406"
        x2="8.91799"
        y2="15.058"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="currentColor" />
        <stop offset="0.201923" stopColor="#E8F2ED" />
      </linearGradient>
    </defs>
  </svg>
);

// ---- Skill card brand icons --------------------------------------------------
// Used in SkillsStage2Section skill cards. Real brand SVG paths sourced from
// Simple Icons (https://github.com/simple-icons/simple-icons) and OpenJDK.
// Each component renders the logo in its official brand color so it works on
// any background — the card container bg is set separately per skill.

// JavaScript — Simple Icons path (CC0). Letter paths only; background rect is
// omitted so the yellow card container (bg-[#F7DF1E]) provides the brand colour.
export const SkillIconJs = ({ className = '' }) => (
  <svg
    width="800px"
    height="800px"
    viewBox="0 0 256 256"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMinYMin meet"
    className={className}
  >
    <path d="M0 0h256v256H0V0z" fill="#F7DF1E" />
    <path d="M67.312 213.932l19.59-11.856c3.78 6.701 7.218 12.371 15.465 12.371 7.905 0 12.89-3.092 12.89-15.12v-81.798h24.057v82.138c0 24.917-14.606 36.259-35.916 36.259-19.245 0-30.416-9.967-36.087-21.996M152.381 211.354l19.588-11.341c5.157 8.421 11.859 14.607 23.715 14.607 9.969 0 16.325-4.984 16.325-11.858 0-8.248-6.53-11.17-17.528-15.98l-6.013-2.58c-17.357-7.387-28.87-16.667-28.87-36.257 0-18.044 13.747-31.792 35.228-31.792 15.294 0 26.292 5.328 34.196 19.247L210.29 147.43c-4.125-7.389-8.591-10.31-15.465-10.31-7.046 0-11.514 4.468-11.514 10.31 0 7.217 4.468 10.14 14.778 14.608l6.014 2.577c20.45 8.765 31.963 17.7 31.963 37.804 0 21.654-17.012 33.51-39.867 33.51-22.339 0-36.774-10.654-43.819-24.574" />
  </svg>
);

// Python — Simple Icons path (CC0). Rendered in Python blue (#3776AB).
export const SkillIconPython = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Python"
    className={className}
  >
    <path
      fill="#3776AB"
      d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"
    />
  </svg>
);

// ---- Skills Lab glyphs ------------------------------------------------
// Icons used across the Skills Lab quiz hub screens. Prefixed SL* when a
// same-concept icon already exists in this file at a different size or colour.

export const SLCloseIcon = ({ className = '' }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const SLClockIcon = ({ className = '' }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
    <path
      d="M6 3.5V6L7.5 7.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SLStarIcon = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M8 1.333l1.884 3.817 4.216.614-3.05 2.972.72 4.197L8 10.847l-3.77 1.986.72-4.197-3.05-2.972 4.216-.614L8 1.333z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SLArrowRightIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path
      d="M4.167 10h11.666M10.833 5l5 5-5 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SLArrowRightSmIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
    <path
      d="M3 7h8M8 4l3 3-3 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LightbulbIcon = ({ className = '' }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M5.25 11.083h3.5M5.833 12.25h2.334M7 1.167a4.083 4.083 0 0 0-2.625 7c.292.438.583.875.583 1.458h4.084c0-.583.291-1.02.583-1.458A4.083 4.083 0 0 0 7 1.167Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const GameControllerIcon = ({ className = '' }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M2.00825 15.8092C2.23114 12.3161 2.88737 9.7599 3.44345 8.27511C3.72419 7.5255 4.32818 6.96728 5.10145 6.78021C9.40147 5.73993 14.5986 5.73993 18.8986 6.78021C19.6719 6.96728 20.2759 7.5255 20.5566 8.27511C21.1127 9.7599 21.7689 12.3161 21.9918 15.8092C22.1251 17.8989 20.6148 19.0503 18.9429 19.8925C17.878 20.4289 17.0591 18.8457 16.5155 17.6203C16.2185 16.9508 15.5667 16.5356 14.8281 16.5356H9.17196C8.43331 16.5356 7.78158 16.9508 7.48456 17.6203C6.94089 18.8457 6.122 20.4289 5.05711 19.8925C3.40215 19.0588 1.87384 17.9157 2.00825 15.8092Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 4.5L6.96285 4M19 4.5L17 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 13L7.5 11.5M7.5 11.5L6 10M7.5 11.5L6 13M7.5 11.5L9 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M16.5 10V13M15 11.5H18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const SwitchModesIcon = ({ className = '' }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M1.75 5.25L4.08333 2.91667M4.08333 2.91667L6.41667 5.25M4.08333 2.91667V11.0833M12.25 8.75L9.91667 11.0833M9.91667 11.0833L7.58333 8.75M9.91667 11.0833V2.91667"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const NotificationIcon = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M6 13.3333C6.35958 13.7325 6.87852 14 7.46667 14C8.05481 14 8.57375 13.7325 8.93333 13.3333M11.3333 5.33333C11.3333 4.27247 10.912 3.25505 10.1618 2.50491C9.41167 1.75476 8.39424 1.33333 7.33333 1.33333C6.27247 1.33333 5.25505 1.75476 4.50491 2.50491C3.75476 3.25505 3.33333 4.27247 3.33333 5.33333C3.33333 7.96812 2.66639 9.72464 2.04894 10.7538C1.53315 11.6135 1.27525 12.0434 1.28461 12.1636C1.29504 12.2971 1.32117 12.3421 1.42932 12.4241C1.52686 12.4979 1.96266 12.4979 2.83427 12.4979H11.8324C12.704 12.4979 13.1398 12.4979 13.2374 12.4241C13.3455 12.3421 13.3717 12.2971 13.382 12.1636C13.3914 12.0434 13.1335 11.6135 12.6177 10.7538C12.0003 9.72464 11.3333 7.96812 11.3333 5.33333Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SLChevronLeftIcon = ({ className = '' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M11.25 13.5L6.75 9L11.25 4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChessCrownIcon = ({ className = '' }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path d="M3 15H17V17H3V15ZM4 8L6 13H14L16 8L12.5 10L10 5L7.5 10L4 8Z" fill="currentColor" />
  </svg>
);

export const ChessFlagIcon = ({ className = '' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M3.75 2.25V15.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.75 3H14.25L11.25 6.75L14.25 10.5H3.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChessHintIcon = ({ className = '' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M9 1.5C6.1 1.5 3.75 3.85 3.75 6.75C3.75 8.55 4.65 10.12 6 11.02V13.5H12V11.02C13.35 10.12 14.25 8.55 14.25 6.75C14.25 3.85 11.9 1.5 9 1.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M6.75 15.75H11.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Java — OpenJDK logo path. Rendered in Java/OpenJDK orange (#ED8B00).
export const SkillIconJava = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Java"
    role="img"
    viewBox="0 0 512 512"
    fill="none"
    className={className}
  >
    <rect width="512" height="512" rx="15%" fill="#ffffff" />
    <path
      d="M274 235c18 21-5 40-5 40s47-24 25-54-35-42 48-90C342 130 211 163 274 235M294 53s40 40-38 100c-62 49-14 77 0 109-36-33-63-61-45-88C238 134 310 115 294 53"
      fill="#f8981d"
    />
    <path
      d="M206 347s-15 8 10 11 46 3 79-3a137 137 0 0 0 21 10C242 397 147 364 206 347m-9-42s-16 12 9 15 58 4 102-5a45 45 0 0 0 16 10C233 351 132 327 197 305m175 73s11 9-12 16c-43 13-179 17-217 1-14-6 15-17 33-17-17-10-98 21-42 30C287 432 412 396 372 378M213 262s-69 16-25 22c19 3 57 2 92-1s57-8 57-8a122 122 0 0 0-17 9c-70 18-206 10-167-9S213 262 213 262m124 69c73-37 39-80 7-66 36-30 101 36-9 68v-2M220 432c69 4 174-2 176-35 0 0-5 12-57 22s-131 10-174 3C166 422 175 429 220 432"
      fill="#5382a1"
    />
  </svg>
);

// ---- Skills Lab — new skill icons ----------------------------------------

export const SkillIconDataAnalysis = ({ className = '' }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <rect x="2" y="12" width="3" height="8" rx="1" fill="#387440" />
    <rect x="7" y="8" width="3" height="12" rx="1" fill="#387440" />
    <rect x="12" y="4" width="3" height="16" rx="1" fill="#387440" />
    <rect x="17" y="10" width="3" height="10" rx="1" fill="#c0392b" />
    <path
      d="M2 6L7 4L12 2L17 7"
      stroke="#c8951a"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SkillIconCreativeDesign = ({ className = '' }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <circle cx="8" cy="8" r="5" fill="#3062d4" opacity="0.7" />
    <circle cx="14" cy="8" r="5" fill="#c0392b" opacity="0.7" />
    <circle cx="11" cy="13" r="5" fill="#c8951a" opacity="0.7" />
  </svg>
);

export const SkillIconProjectMgmt = ({ className = '' }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <rect x="1" y="3" width="20" height="16" rx="2" stroke="#387440" strokeWidth="1.5" />
    <rect x="3" y="7" width="8" height="2" rx="1" fill="#387440" />
    <rect x="3" y="11" width="12" height="2" rx="1" fill="#c8951a" />
    <rect x="3" y="15" width="6" height="2" rx="1" fill="#3062d4" />
    <line x1="9" y1="3" x2="9" y2="19" stroke="#e8e8e4" strokeWidth="0.5" />
    <line x1="15" y1="3" x2="15" y2="19" stroke="#e8e8e4" strokeWidth="0.5" />
  </svg>
);

export const SkillIconPublicSpeaking = ({ className = '' }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M11 2C7.13 2 4 4.69 4 8C4 9.8 4.94 11.4 6.44 12.42L5 20L11 17L17 20L15.56 12.42C17.06 11.4 18 9.8 18 8C18 4.69 14.87 2 11 2Z"
      stroke="#c8951a"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="8" r="1" fill="#c8951a" />
    <circle cx="11" cy="8" r="1" fill="#c8951a" />
    <circle cx="14" cy="8" r="1" fill="#c8951a" />
  </svg>
);

// ---- Talent Profile Panel row icons (AI Engagement / Career Buddy flow) -----
// Source: Figma node 5132:40348 ("component groupings" reference sheet for the
// Talent Profile Panel). Icon glyphs there are sourced from Iconify sets
// (material-symbols, fluent, carbon, ph) — hand-crafted here per CLAUDE.md
// Rule 3 exception using only bounding box (40x40 container, 20x20 glyph) and
// stroke colour, never copied path data. Distinct from the StepIcon family
// above (that set belongs to the older engagement-trail Figma frame
// 3384:81927 and is visually different by design — see wiki/figma-node-map.md).

// "Personal Info." row — Line Rounded/User (plain person, no edit badge —
// re-verified 2026-07-23 against the isolated Figma export at 5264:48155;
// the earlier version incorrectly added a pencil-edit badge).
export const PanelPersonInfoIcon = ({ className = '' }) => (
  <svg
    width="40"
    className={className}
    aria-hidden="true"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.41406 36.6667V34.5833C5.41406 32.6682 5.79127 30.7719 6.52415 29.0025C7.25703 27.2332 8.33123 25.6255 9.68542 24.2714C11.0396 22.9172 12.6473 21.843 14.4166 21.1101C16.1859 20.3772 18.0823 20 19.9974 20C21.9125 20 23.8089 20.3772 25.5782 21.1101C27.3475 21.843 28.9552 22.9172 30.3094 24.2714C31.6636 25.6255 32.7378 27.2332 33.4706 29.0025C34.2035 30.7719 34.5807 32.6682 34.5807 34.5833V36.6667"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.9974 19.9999C22.2075 19.9999 24.3271 19.1219 25.89 17.5591C27.4528 15.9963 28.3307 13.8767 28.3307 11.6666C28.3307 9.45645 27.4528 7.33683 25.89 5.77403C24.3271 4.21123 22.2075 3.33325 19.9974 3.33325C17.7873 3.33325 15.6676 4.21123 14.1048 5.77403C12.542 7.33683 11.6641 9.45645 11.6641 11.6666C11.6641 13.8767 12.542 15.9963 14.1048 17.5591C15.6676 19.1219 17.7873 19.9999 19.9974 19.9999V19.9999Z"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// "Educational Background" row — material-symbols-light:school-outline-rounded.
export const PanelEducationIcon = ({ className = '' }) => (
  <svg
    width="40"
    aria-hidden="true"
    className={className}
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.0623 27.9095C9.60786 27.6534 9.24665 27.3051 8.97869 26.8648C8.71073 26.4233 8.57676 25.9287 8.57676 25.381V18.5163L5.7579 16.9528C5.50057 16.7993 5.30934 16.6176 5.18421 16.4074C5.05909 16.1973 4.9977 15.9648 5.00007 15.7098C5.00243 15.4548 5.06499 15.2223 5.18775 15.0122C5.31052 14.8021 5.50116 14.6203 5.75967 14.4668L17.8354 7.88004C18.0503 7.76082 18.2716 7.67582 18.4994 7.62507C18.7272 7.57431 18.961 7.54834 19.2006 7.54716C19.4402 7.54598 19.6745 7.57195 19.9035 7.62507C20.1325 7.67819 20.3545 7.76259 20.5693 7.87827L34.2404 15.2919C34.4906 15.4395 34.6795 15.6242 34.807 15.8461C34.9357 16.0692 35 16.31 35 16.5686V26.13C35 26.3803 34.915 26.5904 34.745 26.7604C34.575 26.9303 34.3649 27.0153 34.1147 27.0153C33.8644 27.0153 33.6537 26.9303 33.4826 26.7604C33.3114 26.5904 33.227 26.3803 33.2294 26.13V16.7049L29.8244 18.5163V25.381C29.8244 25.9287 29.6904 26.4233 29.4225 26.8648C29.1545 27.3063 28.7939 27.6545 28.3406 27.9095L20.5764 32.113C20.3568 32.2369 20.1325 32.3249 19.9035 32.3768C19.6745 32.4288 19.4402 32.4541 19.2006 32.453C18.961 32.4518 18.7266 32.4264 18.4976 32.3768C18.2686 32.3272 18.0444 32.2387 17.8248 32.1112L10.0623 27.9095ZM18.7916 22.0575C18.9509 22.1473 19.0926 22.1921 19.2165 22.1921C19.3416 22.1921 19.4839 22.1473 19.6432 22.0575L31.2941 15.7098L19.6432 9.39748C19.4851 9.30658 19.3434 9.26114 19.2183 9.26114C19.0932 9.26114 18.9515 9.30658 18.7933 9.39748L7.10713 15.7098L18.7916 22.0575ZM18.7579 30.6133C18.9173 30.7042 19.0648 30.7496 19.2006 30.7496C19.3363 30.7496 19.4839 30.7042 19.6432 30.6133L27.5438 26.3443C27.7256 26.2309 27.8555 26.1005 27.9334 25.9529C28.0113 25.8054 28.0514 25.6177 28.0538 25.3899V19.4901L20.587 23.5661C20.3663 23.6901 20.142 23.778 19.9142 23.83C19.6887 23.8807 19.4508 23.9061 19.2006 23.9061C18.9503 23.9061 18.7119 23.8807 18.4853 23.83C18.2586 23.7792 18.0349 23.6907 17.8142 23.5644L10.3474 19.4919V25.3917C10.3474 25.5734 10.3869 25.7499 10.466 25.9211C10.5451 26.0911 10.6756 26.2327 10.8573 26.346L18.7579 30.6133Z"
      fill="currentColor"
    />
  </svg>
);

// "Personal area of interest" row — material-symbols-light:interests-outline.
// Re-verified 2026-07-23 against 5264:48157: a loose 2x2 grid of 4 distinct
// outline shapes (triangle / heart / rotated-square / circle), not the
// diamond+heart pair the earlier version used.
export const PanelInterestsIcon = ({ className = '' }) => (
  <svg
    width="40"
    aria-hidden="true"
    className={className}
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.61719 17.3716L11.7322 4.96826L18.8472 17.3716H4.61719ZM11.7639 34.1983C10.1227 34.1983 8.73497 33.631 7.60052 32.4966C6.46608 31.3621 5.89885 29.9788 5.89885 28.3466C5.89885 26.691 6.46552 25.2972 7.59885 24.1649C8.73441 23.0338 10.1227 22.4683 11.7639 22.4683C13.405 22.4683 14.7927 23.0355 15.9272 24.1699C17.0616 25.3044 17.6289 26.6922 17.6289 28.3333C17.6289 29.9744 17.0616 31.3621 15.9272 32.4966C14.7927 33.631 13.405 34.1983 11.7639 34.1983ZM11.7639 32.5316C12.9361 32.5316 13.9289 32.1255 14.7422 31.3133C15.5555 30.501 15.9622 29.5077 15.9622 28.3333C15.9622 27.1588 15.5555 26.166 14.7422 25.3549C13.9289 24.5438 12.9361 24.1372 11.7639 24.1349C10.5916 24.1327 9.5983 24.5394 8.78385 25.3549C7.96941 26.1705 7.56385 27.1633 7.56719 28.3333C7.57052 29.5033 7.97663 30.4966 8.78552 31.3133C9.59441 32.1299 10.5861 32.536 11.7639 32.5316ZM7.49385 15.7049H16.0005L11.7322 8.34993L7.49385 15.7049ZM22.5322 34.1983V22.4683H34.2639V34.1983H22.5322ZM24.1989 32.5316H32.5972V24.1349H24.1989V32.5316ZM28.3989 17.3716C27.3711 16.5505 26.4289 15.7888 25.5722 15.0866C24.7166 14.3833 23.98 13.7005 23.3622 13.0383C22.7455 12.376 22.2661 11.7177 21.9239 11.0633C21.5816 10.4099 21.4105 9.72548 21.4105 9.00993C21.4105 8.01548 21.7361 7.19493 22.3872 6.54826C23.0372 5.90048 23.8655 5.5766 24.8722 5.5766C25.5366 5.5766 26.1577 5.73937 26.7355 6.06493C27.3133 6.39048 27.8677 6.88048 28.3989 7.53493C28.9289 6.90271 29.4933 6.41826 30.0922 6.0816C30.6922 5.74493 31.3133 5.5766 31.9555 5.5766C32.9333 5.5766 33.7494 5.91715 34.4039 6.59826C35.0583 7.28048 35.3855 8.11604 35.3855 9.10493C35.3855 9.79937 35.2144 10.4683 34.8722 11.1116C34.5311 11.756 34.0516 12.4038 33.4339 13.0549C32.8161 13.706 32.0794 14.3833 31.2239 15.0866C30.3683 15.7899 29.4266 16.5516 28.3989 17.3716ZM28.3989 15.2083C30.3344 13.7127 31.705 12.4999 32.5105 11.5699C33.3161 10.6399 33.7189 9.81437 33.7189 9.09326C33.7189 8.56104 33.5505 8.11937 33.2139 7.76826C32.8772 7.41826 32.4539 7.24326 31.9439 7.24326C31.585 7.24326 31.235 7.3516 30.8939 7.56826C30.5527 7.78493 30.0805 8.19493 29.4772 8.79826L28.3989 9.85826L27.3189 8.79826C26.6944 8.17382 26.2183 7.75882 25.8905 7.55326C25.5627 7.3466 25.2172 7.24326 24.8539 7.24326C24.3205 7.24326 23.8916 7.40271 23.5672 7.7216C23.2427 8.04048 23.0794 8.47604 23.0772 9.02826C23.0772 9.79382 23.48 10.641 24.2855 11.5699C25.0911 12.4988 26.4633 13.7116 28.3989 15.2083Z"
      fill="currentColor"
    />
  </svg>
);

// "Personality" row — fluent:puzzle-piece-32-regular. Re-verified 2026-07-23
// against 5264:48158: a single jigsaw-puzzle-piece outline (one bump, one
// notch), not the earlier rounded-square-with-cutouts approximation.
export const PanelPersonalityIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.25 5C20.587 5 19.9511 5.26339 19.4822 5.73223C19.0134 6.20107 18.75 6.83696 18.75 7.5V10H12.1875C11.9389 10 11.7004 10.0988 11.5246 10.2746C11.3488 10.4504 11.25 10.6889 11.25 10.9375V17.5H8.75C8.08696 17.5 7.45107 17.7634 6.98223 18.2322C6.51339 18.7011 6.25 19.337 6.25 20C6.25 20.663 6.51339 21.2989 6.98223 21.7678C7.45107 22.2366 8.08696 22.5 8.75 22.5H11.25V29.0625C11.25 29.58 11.67 30 12.1875 30H18.75V32.5C18.75 33.163 19.0134 33.7989 19.4822 34.2678C19.9511 34.7366 20.587 35 21.25 35C21.913 35 22.5489 34.7366 23.0178 34.2678C23.4866 33.7989 23.75 33.163 23.75 32.5V30H30.3125C30.5611 30 30.7996 29.9012 30.9754 29.7254C31.1512 29.5496 31.25 29.3111 31.25 29.0625V25H30C28.6739 25 27.4021 24.4732 26.4645 23.5355C25.5268 22.5979 25 21.3261 25 20C25 18.6739 25.5268 17.4021 26.4645 16.4645C27.4021 15.5268 28.6739 15 30 15H31.25V10.9375C31.25 10.6889 31.1512 10.4504 30.9754 10.2746C30.7996 10.0988 30.5611 10 30.3125 10H23.75V7.5C23.75 6.83696 23.4866 6.20107 23.0178 5.73223C22.5489 5.26339 21.913 5 21.25 5ZM16.25 7.5C16.25 6.17392 16.7768 4.90215 17.7145 3.96447C18.6521 3.02678 19.9239 2.5 21.25 2.5C22.5761 2.5 23.8479 3.02678 24.7855 3.96447C25.7232 4.90215 26.25 6.17392 26.25 7.5H30.3125C30.7639 7.5 31.2109 7.58891 31.628 7.76166C32.045 7.93441 32.424 8.18762 32.7432 8.50682C33.0624 8.82602 33.3156 9.20497 33.4883 9.62203C33.6611 10.0391 33.75 10.4861 33.75 10.9375V17.5H30C29.337 17.5 28.7011 17.7634 28.2322 18.2322C27.7634 18.7011 27.5 19.337 27.5 20C27.5 20.663 27.7634 21.2989 28.2322 21.7678C28.7011 22.2366 29.337 22.5 30 22.5H33.75V29.0625C33.75 29.9742 33.3878 30.8485 32.7432 31.4932C32.0985 32.1378 31.2242 32.5 30.3125 32.5H26.25C26.25 33.8261 25.7232 35.0979 24.7855 36.0355C23.8479 36.9732 22.5761 37.5 21.25 37.5C19.9239 37.5 18.6521 36.9732 17.7145 36.0355C16.7768 35.0979 16.25 33.8261 16.25 32.5H12.1875C11.2758 32.5 10.4015 32.1378 9.75682 31.4932C9.11216 30.8485 8.75 29.9742 8.75 29.0625V25C7.42392 25 6.15215 24.4732 5.21447 23.5355C4.27678 22.5979 3.75 21.3261 3.75 20C3.75 18.6739 4.27678 17.4021 5.21447 16.4645C6.15215 15.5268 7.42392 15 8.75 15V10.9375C8.75 10.4861 8.83891 10.0391 9.01166 9.62203C9.18441 9.20497 9.43762 8.82602 9.75682 8.50682C10.4015 7.86216 11.2758 7.5 12.1875 7.5H16.25Z"
      fill="currentColor"
    />
  </svg>
);

// "Skills (Competencies)" row — carbon:skill-level (ascending bars).
export const PanelSkillsIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M37.5 37.5H27.5V5H37.5V37.5ZM30 35H35V7.5H30V35ZM25 37.5H15V15H25V37.5ZM17.5 35H22.5V17.5H17.5V35ZM12.5 37.5H2.5V22.5H12.5V37.5ZM5 35H10V25H5V35Z"
      fill="currentColor"
    />
  </svg>
);

export const PanelWorkExperienceIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M36.25 21.25V35H3.75V21.25M20 27.5V22.5M25 10C25 10 25 5 20 5C15 5 15 10 15 10M2.5 10H37.5V20C37.5 20 30 25 20 25C10 25 2.5 20 2.5 20V10Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PanelPortfolioIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.66406 13.3332H33.3307M33.3307 13.3332L26.6641 6.6665H13.3307L6.66406 13.3332V29.9998C6.66406 30.8839 7.01525 31.7317 7.64037 32.3569C8.26549 32.982 9.11334 33.3332 9.9974 33.3332H29.9974C30.8815 33.3332 31.7293 32.982 32.3544 32.3569C32.9795 31.7317 33.3307 30.8839 33.3307 29.9998V13.3332ZM13.3307 19.9998H19.9974"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PanelCertificationsIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.6875 21.25C19.6875 21.4986 19.5887 21.7371 19.4129 21.9129C19.2371 22.0887 18.9986 22.1875 18.75 22.1875H11.25C11.0014 22.1875 10.7629 22.0887 10.5871 21.9129C10.4113 21.7371 10.3125 21.4986 10.3125 21.25C10.3125 21.0014 10.4113 20.7629 10.5871 20.5871C10.7629 20.4113 11.0014 20.3125 11.25 20.3125H18.75C18.9986 20.3125 19.2371 20.4113 19.4129 20.5871C19.5887 20.7629 19.6875 21.0014 19.6875 21.25ZM18.75 15.3125H11.25C11.0014 15.3125 10.7629 15.4113 10.5871 15.5871C10.4113 15.7629 10.3125 16.0014 10.3125 16.25C10.3125 16.4986 10.4113 16.7371 10.5871 16.9129C10.7629 17.0887 11.0014 17.1875 11.25 17.1875H18.75C18.9986 17.1875 19.2371 17.0887 19.4129 16.9129C19.5887 16.7371 19.6875 16.4986 19.6875 16.25C19.6875 16.0014 19.5887 15.7629 19.4129 15.5871C19.2371 15.4113 18.9986 15.3125 18.75 15.3125ZM35.9375 25.0969V35C35.9379 35.1647 35.8948 35.3267 35.8127 35.4695C35.7306 35.6123 35.6123 35.731 35.4697 35.8135C35.3271 35.8961 35.1653 35.9396 35.0005 35.9397C34.8358 35.9398 34.6739 35.8964 34.5312 35.8141L30.625 33.5797L26.7187 35.8141C26.5761 35.8964 26.4142 35.9398 26.2495 35.9397C26.0847 35.9396 25.9229 35.8961 25.7803 35.8135C25.6377 35.731 25.5194 35.6123 25.4373 35.4695C25.3552 35.3267 25.3121 35.1647 25.3125 35V30.9375H6.25C5.66984 30.9375 5.11344 30.707 4.7032 30.2968C4.29297 29.8866 4.0625 29.3302 4.0625 28.75V8.75C4.0625 8.16984 4.29297 7.61344 4.7032 7.2032C5.11344 6.79297 5.66984 6.5625 6.25 6.5625H33.75C34.3302 6.5625 34.8866 6.79297 35.2968 7.2032C35.707 7.61344 35.9375 8.16984 35.9375 8.75V13.6531C36.7259 14.3832 37.3549 15.2683 37.7851 16.253C38.2152 17.2376 38.4373 18.3005 38.4373 19.375C38.4373 20.4495 38.2152 21.5124 37.7851 22.497C37.3549 23.4817 36.7259 24.3668 35.9375 25.0969ZM30.625 13.4375C29.4507 13.4375 28.3027 13.7857 27.3263 14.4381C26.3499 15.0906 25.5889 16.0179 25.1395 17.1028C24.6901 18.1878 24.5725 19.3816 24.8016 20.5333C25.0307 21.6851 25.5962 22.7431 26.4266 23.5734C27.2569 24.4038 28.3149 24.9693 29.4666 25.1984C30.6184 25.4275 31.8122 25.3099 32.8972 24.8605C33.9821 24.4111 34.9094 23.6501 35.5618 22.6737C36.2143 21.6973 36.5625 20.5493 36.5625 19.375C36.5625 17.8003 35.9369 16.2901 34.8234 15.1766C33.7099 14.0631 32.1997 13.4375 30.625 13.4375ZM25.3125 29.0625V25.0969C23.9445 23.8202 23.0802 22.095 22.8767 20.2349C22.6732 18.3749 23.144 16.5035 24.2036 14.9613C25.2632 13.4191 26.8411 12.3083 28.6504 11.8311C30.4597 11.3539 32.3801 11.5419 34.0625 12.3609V8.75C34.0625 8.66712 34.0296 8.58763 33.971 8.52903C33.9124 8.47042 33.8329 8.4375 33.75 8.4375H6.25C6.16712 8.4375 6.08763 8.47042 6.02903 8.52903C5.97042 8.58763 5.9375 8.66712 5.9375 8.75V28.75C5.9375 28.8329 5.97042 28.9124 6.02903 28.971C6.08763 29.0296 6.16712 29.0625 6.25 29.0625H25.3125ZM34.0625 26.3891C32.9927 26.9144 31.8168 27.1876 30.625 27.1876C29.4332 27.1876 28.2573 26.9144 27.1875 26.3891V33.3844L30.1562 31.6859C30.2988 31.6037 30.4604 31.5603 30.625 31.5603C30.7896 31.5603 30.9512 31.6037 31.0937 31.6859L34.0625 33.3844V26.3891Z"
      fill="currentColor"
    />
  </svg>
);

// "Career Options" row — streamline:target. Verified 2026-07-23 against
// 5264:48187: an incomplete circular ring with an arrow crossing into it
// (a "target/compass" glyph), not the concentric-circle bullseye the
// existing GoalsStepIcon (older engagement-trail family) uses.
export const PanelCareerOptionsIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_5282_8926)">
      <path
        d="M38.514 21.4746C38.232 25.0189 36.9384 28.4078 34.7871 31.2385C32.6357 34.0693 29.717 36.223 26.3776 37.4438C23.0383 38.6646 19.4186 38.9011 15.9488 38.1253C12.479 37.3495 9.30477 35.5939 6.80331 33.0672C4.30186 30.5405 2.57829 27.3488 1.83738 23.8713C1.09648 20.3939 1.36938 16.7768 2.62366 13.4499C3.87794 10.123 6.06088 7.22604 8.91313 5.10324C11.7654 2.98045 15.1671 1.72102 18.714 1.47461"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27.9673 23.1144C27.4513 24.4424 26.6125 25.6208 25.5266 26.5432C24.4408 27.4655 23.1422 28.1026 21.7482 28.3969C20.3542 28.6912 18.9089 28.6333 17.5429 28.2286C16.1769 27.8239 14.9333 27.0851 13.9246 26.079C12.9159 25.0729 12.1739 23.8312 11.7656 22.4663C11.3574 21.1013 11.2959 19.6561 11.5866 18.2614C11.8773 16.8667 12.511 15.5664 13.4305 14.4782C14.3501 13.3899 15.5263 12.5481 16.853 12.0287M19.9959 20.0001L27.1387 12.8573M27.1387 12.8573L32.853 14.2859L38.5673 8.57157L32.853 7.143L31.4244 1.42871L25.7101 7.143L27.1387 12.8573Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_5282_8926">
        <rect width="40" height="40" fill="none" />
      </clipPath>
    </defs>
  </svg>
);

// "Career Pitch" row — ph:microphone.
export const PanelMicrophoneIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 27.5C21.9885 27.4979 23.8949 26.7071 25.301 25.301C26.7071 23.8949 27.4979 21.9885 27.5 20V10C27.5 8.01088 26.7098 6.10322 25.3033 4.6967C23.8968 3.29018 21.9891 2.5 20 2.5C18.0109 2.5 16.1032 3.29018 14.6967 4.6967C13.2902 6.10322 12.5 8.01088 12.5 10V20C12.5021 21.9885 13.2929 23.8949 14.699 25.301C16.1051 26.7071 18.0115 27.4979 20 27.5ZM15 10C15 8.67392 15.5268 7.40215 16.4645 6.46447C17.4021 5.52678 18.6739 5 20 5C21.3261 5 22.5979 5.52678 23.5355 6.46447C24.4732 7.40215 25 8.67392 25 10V20C25 21.3261 24.4732 22.5979 23.5355 23.5355C22.5979 24.4732 21.3261 25 20 25C18.6739 25 17.4021 24.4732 16.4645 23.5355C15.5268 22.5979 15 21.3261 15 20V10ZM21.25 32.4375V37.5C21.25 37.8315 21.1183 38.1495 20.8839 38.3839C20.6495 38.6183 20.3315 38.75 20 38.75C19.6685 38.75 19.3505 38.6183 19.1161 38.3839C18.8817 38.1495 18.75 37.8315 18.75 37.5V32.4375C15.6682 32.1239 12.8121 30.6787 10.7341 28.3813C8.65613 26.084 7.50381 23.0977 7.5 20C7.5 19.6685 7.6317 19.3505 7.86612 19.1161C8.10054 18.8817 8.41848 18.75 8.75 18.75C9.08152 18.75 9.39946 18.8817 9.63388 19.1161C9.8683 19.3505 10 19.6685 10 20C10 22.6522 11.0536 25.1957 12.9289 27.0711C14.8043 28.9464 17.3478 30 20 30C22.6522 30 25.1957 28.9464 27.0711 27.0711C28.9464 25.1957 30 22.6522 30 20C30 19.6685 30.1317 19.3505 30.3661 19.1161C30.6005 18.8817 30.9185 18.75 31.25 18.75C31.5815 18.75 31.8995 18.8817 32.1339 19.1161C32.3683 19.3505 32.5 19.6685 32.5 20C32.4962 23.0977 31.3439 26.084 29.2659 28.3813C27.1879 30.6787 24.3318 32.1239 21.25 32.4375Z"
      fill="currentColor"
    />
  </svg>
);

// ---- Career Buddy chat background decorations ------------------------------
// Source: Figma 5132:44997 (education), 5132:45001 (spark), 5132:45080
// (chart). Unlike the other icons in this file, these are decorative
// illustrations supplied verbatim by the user as real exported SVG markup
// (not hand-crafted from bounding box + colour per the usual Rule 3 flow —
// the user gave the actual production paths directly). Only syntax was
// adapted for JSX (kebab-case attrs → camelCase, unique clipPath ids kept
// as-is since each is scoped to its own component).

export const CareerBuddyBgEducationIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="90"
    height="90"
    viewBox="0 0 90 90"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <g opacity="0.35" clipPath="url(#clip0_5132_44997)">
      <path
        d="M70.0189 57.9093C70.6906 62.5644 67.9035 66.6491 64.1923 69.4934C60.4059 72.3933 55.1193 74.487 49.2409 75.2916C43.3624 76.0962 37.688 75.5028 33.2281 73.7349C28.8514 71.9911 25.0195 68.8124 24.3473 64.1542L22.6719 52.5435L47.5878 63.8362L68.3425 46.2923L70.0189 57.9093Z"
        fill="#387440"
        fillOpacity="0.3"
      />
      <path
        d="M81.6713 27.2309L76.2302 31.8276L79.1138 51.8104L72.5895 52.7034L70.3003 36.8401L46.5807 56.8903L4.45489 37.7968L9.23665 33.7492C12.455 37.0145 16.8444 38.9502 21.4946 39.1547C26.1448 39.3592 30.6989 37.8169 34.2123 34.8477C37.7257 31.8785 39.9289 27.7102 40.3648 23.2073C40.8006 18.7045 39.4359 14.2127 36.5534 10.6635L39.5455 8.13741L81.6713 27.2309Z"
        fill="#387440"
        fillOpacity="0.3"
      />
      <path
        d="M25.9599 16.9738L36.4576 19.6861L27.1333 25.1051L24.34 35.3013L18.7658 26.2504L8.27186 23.5408L17.5892 18.1195L20.3895 7.92557L25.9599 16.9738Z"
        fill="#387440"
        fillOpacity="0.3"
      />
    </g>
    <defs>
      <clipPath id="clip0_5132_44997">
        <rect
          width="79.0224"
          height="80.042"
          fill="white"
          transform="matrix(0.990762 -0.135611 0.142825 0.989748 0 10.7163)"
        />
      </clipPath>
    </defs>
  </svg>
);

export const CareerBuddyBgSparkIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="97"
    viewBox="0 0 100 97"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <g opacity="0.35" clipPath="url(#clip0_5132_45001)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M57.7437 8.56773C58.6003 5.38296 62.7349 4.37898 65.0265 6.79928L69.8419 11.8858C70.8403 12.9405 72.1282 13.6942 73.5531 14.0576L80.4252 15.8105C83.6953 16.6448 84.7261 20.6715 82.241 22.9033L77.0183 27.5932C75.9354 28.5655 75.1615 29.8199 74.7884 31.2076L72.9885 37.9005C72.1319 41.0853 67.9973 42.0892 65.7057 39.6689L60.8903 34.5824C59.8919 33.5278 58.6039 32.774 57.1791 32.4107L50.307 30.6577C47.0369 29.8234 46.0061 25.7967 48.4912 23.5649L53.7139 18.875C54.7968 17.9027 55.5707 16.6483 55.9438 15.2606L57.7437 8.56773ZM49.2452 16.0868L45.0121 19.8887C39.5411 24.8003 41.809 33.6591 49.0072 35.4943L55.8793 37.2472C56.354 37.3684 56.7831 37.6195 57.1157 37.9708L61.9311 43.0573C64.6632 45.9443 68.5854 46.6186 71.9073 45.513C71.9379 52.3825 69.6121 59.0652 65.299 64.5007C65.2678 65.5357 65.2235 66.5703 65.1659 67.6043C65.0205 70.2745 63.3401 72.7008 60.6279 73.66C58.2778 74.4901 54.3564 75.7205 48.314 77.1878C42.2716 78.6551 38.2161 79.3616 35.7409 79.7032C32.8839 80.0964 30.2322 78.722 28.815 76.4312C28.2658 75.5446 27.7278 74.6514 27.2014 73.7518C18.6961 70.001 11.9588 62.6294 9.52243 53.1124C5.29259 36.5899 15.617 19.8553 32.582 15.7357C38.2774 14.3527 43.9991 14.5677 49.2452 16.0868ZM34.9566 83.9354C35.4132 83.9276 35.8732 83.892 36.3367 83.8287C38.9808 83.4649 43.1837 82.7278 49.3473 81.2311C55.511 79.7344 59.5756 78.464 62.0872 77.5759C62.6626 77.3725 63.2201 77.124 63.7541 76.8327L63.8252 77.3307C64.3313 80.9267 62.5665 84.7253 58.7508 86.1895C56.2909 87.1189 53.7722 87.8934 51.2103 88.5083C47.9392 89.3026 45.3416 89.6895 43.4065 89.8674C39.8447 90.1946 36.9051 88.088 35.5696 85.2483C35.3765 84.8383 35.1719 84.3996 34.9566 83.9354Z"
        fill="#387440"
        fillOpacity="0.3"
      />
    </g>
    <defs>
      <clipPath id="clip0_5132_45001">
        <rect
          width="82.0184"
          height="80.127"
          fill="white"
          transform="matrix(0.971761 -0.235969 0.248006 0.968758 0 19.3538)"
        />
      </clipPath>
    </defs>
  </svg>
);

export const CareerBuddyBgChartIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="78"
    height="97"
    viewBox="0 0 78 97"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <g opacity="0.35" clipPath="url(#clip0_5132_45080)">
      <path
        d="M68.2366 64.591C68.4762 65.5562 68.3226 66.5772 67.8096 67.4292C67.2965 68.2812 66.466 68.8945 65.5007 69.1341L7.26878 83.5924C6.30353 83.8321 5.2826 83.6785 4.4306 83.1654C3.57859 82.6523 2.9653 81.8218 2.72564 80.8565L-9.32292 32.3299C-9.56258 31.3647 -9.40898 30.3437 -8.89591 29.4917C-8.38284 28.6397 -7.55232 28.0264 -6.58707 27.7868C-5.62181 27.5471 -4.60089 27.7007 -3.74888 28.2138C-2.89688 28.7269 -2.28359 29.5574 -2.04393 30.5226L5.41112 60.5485L15.3301 44.0728C15.584 43.6495 15.9189 43.2806 16.3157 42.987C16.7125 42.6935 17.1633 42.4812 17.6423 42.3623C18.1213 42.2433 18.6191 42.2201 19.1071 42.294C19.5951 42.3678 20.0637 42.5373 20.4861 42.7926L29.3815 48.1572L39.185 31.8776L35.8488 32.7059C34.8835 32.9456 33.8626 32.792 33.0106 32.2789C32.1586 31.7658 31.5453 30.9353 31.3057 29.9701C31.066 29.0048 31.2196 27.9839 31.7327 27.1319C32.2457 26.2799 33.0763 25.6666 34.0415 25.4269L46.1732 22.4148C47.1384 22.1751 48.1593 22.3287 49.0113 22.8418C49.8633 23.3549 50.4766 24.1854 50.7163 25.1506L53.7284 37.2823C53.9681 38.2475 53.8145 39.2685 53.3014 40.1205C52.7884 40.9725 51.9578 41.5858 50.9926 41.8254C50.0273 42.0651 49.0064 41.9115 48.1544 41.3984C47.3024 40.8853 46.6891 40.0548 46.4494 39.0896L45.6211 35.7534L33.8782 55.2578C33.6243 55.6811 33.2894 56.05 32.8926 56.3436C32.4958 56.6371 32.045 56.8494 31.566 56.9684C31.087 57.0873 30.5892 57.1105 30.1012 57.0366C29.6132 56.9628 29.1446 56.7933 28.7223 56.538L19.8268 51.1735L7.97144 70.8604L9.10099 75.4098L63.6934 61.8551C64.6587 61.6155 65.6796 61.7691 66.5316 62.2821C67.3836 62.7952 67.9969 63.6257 68.2366 64.591Z"
        fill="#387440"
        fillOpacity="0.3"
      />
    </g>
    <defs>
      <clipPath id="clip0_5132_45080">
        <rect
          width="80"
          height="80"
          fill="white"
          transform="translate(-19 19.2778) rotate(-13.9439)"
        />
      </clipPath>
    </defs>
  </svg>
);

// ---- ChatThread icons (AI Engagement / Career Buddy flow) -------------------
// Source: Figma 5132:43389-43431 (message actions, input bar). Hand-crafted
// per CLAUDE.md Rule 3 exception — bounding box + stroke colour only, no
// path data copied from Figma MCP. `PlusIcon` (New Chat pill) and `CheckIcon`
// (confirm-recording) already exist above and are reused as-is, not
// duplicated here.

export const ChatThumbsUpIcon = ({ className = '' }) => (
  <svg
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M2.5 6.5h1.8V12H2.5a.6.6 0 0 1-.6-.6V7.1a.6.6 0 0 1 .6-.6Z" />
    <path d="M4.3 6.5 6.6 2a1 1 0 0 1 1.8.4l-.3 2.6h2.7c.7 0 1.2.7 1 1.4l-1 4.2a1.2 1.2 0 0 1-1.2.9H4.3" />
  </svg>
);

export const ChatThumbsDownIcon = ({ className = '' }) => (
  <svg
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M11.5 7.5H9.7V2H11.5a.6.6 0 0 1 .6.6v4.3a.6.6 0 0 1-.6.6Z" />
    <path d="M9.7 7.5 7.4 12a1 1 0 0 1-1.8-.4l.3-2.6H3.2c-.7 0-1.2-.7-1-1.4l1-4.2A1.2 1.2 0 0 1 4.4 2.5h5.3" />
  </svg>
);

export const ChatRetryIcon = ({ className = '' }) => (
  <svg
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M2 7a5 5 0 1 1 1.6 3.68" />
    <path d="M2 10.5V7.8h2.7" />
  </svg>
);

export const ChatPencilIcon = ({ className = '' }) => (
  <svg
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M9.3 2.3 11.7 4.7 5 11.4 2.2 11.8l.4-2.8Z" />
  </svg>
);

// Bidirectional chevron for the user-message edit/version pagination row —
// pass `dir="left"` (default) or `dir="right"`.
export const ChatPaginationChevronIcon = ({ dir = 'left', className = '' }) => (
  <svg
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d={dir === 'left' ? 'M8.5 3.5 5 7l3.5 3.5' : 'M5.5 3.5 9 7l-3.5 3.5'} />
  </svg>
);

export const ChatFileIcon = ({ className = '' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M4 2h5l3 3v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" />
    <path d="M9 2v3h3" />
  </svg>
);

export const ChatHistoryIcon = ({ className = '' }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <circle cx="10" cy="10" r="7.5" />
    <path d="M10 5.5V10l3 1.8" />
  </svg>
);

export const ChatAttachIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    className={className}
    height="18"
    viewBox="0 0 13 18"
    fill="none"
  >
    <path
      d="M4.41667 6.08333V10.5278C4.41667 10.9993 4.60982 11.4515 4.95364 11.7849C5.29745 12.1183 5.76377 12.3056 6.25 12.3056C6.73623 12.3056 7.20255 12.1183 7.54636 11.7849C7.89018 11.4515 8.08333 10.9993 8.08333 10.5278V4.30556C8.08333 3.36256 7.69703 2.45819 7.00939 1.7914C6.32176 1.1246 5.38913 0.75 4.41667 0.75C3.44421 0.75 2.51158 1.1246 1.82394 1.7914C1.13631 2.45819 0.75 3.36256 0.75 4.30556V11.4167C0.75 12.8312 1.32946 14.1877 2.36091 15.1879C3.39236 16.1881 4.79131 16.75 6.25 16.75C7.70869 16.75 9.10764 16.1881 10.1391 15.1879C11.1705 14.1877 11.75 12.8312 11.75 11.4167V2.52778"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChatMicIcon = ({ className = '' }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <rect x="7.25" y="2.5" width="5.5" height="9.5" rx="2.75" />
    <path d="M4.5 9.5a5.5 5.5 0 0 0 11 0" />
    <path d="M10 15v2.5M7 17.5h6" />
  </svg>
);

// Secondary "voice notes" affordance shown beside the mic button (Figma
// ant-design:audio-outlined, second instance) — a small equaliser glyph.
export const ChatWaveIcon = ({ className = '' }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M3 10h1M6.5 6v8M10 3v14M13.5 6v8M17 10h-1" />
  </svg>
);

export const ChatSendArrowIcon = ({ className = '' }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M10 15.5V4.5M5 9.5 10 4.5l5 5" />
  </svg>
);

// Cancel-recording "X" — distinct from the existing className-less
// CloseIcon above (that one is hardcoded 16x16 for a different context).
export const ChatCancelIcon = ({ className = '' }) => (
  <svg
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M2.5 2.5l9 9M11.5 2.5l-9 9" />
  </svg>
);

// Voice-call hang-up / VTT cancel X — Figma 18×18 filled glyph (#575755).
// Hand-crafted from bbox + fill only (no MCP path copy).
export const ChatVoiceCloseIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M9.9 9l6.6-6.6A1.27 1.27 0 0 0 16.5 0.9a1.27 1.27 0 0 0-1.8 0L9 7.1 2.4.9A1.27 1.27 0 0 0 .6.9a1.27 1.27 0 0 0 0 1.8L7.1 9 .6 15.6a1.27 1.27 0 0 0 0 1.8 1.27 1.27 0 0 0 1.8 0L9 10.9l6.6 6.6a1.27 1.27 0 0 0 1.8 0 1.27 1.27 0 0 0 0-1.8L9.9 9z" />
  </svg>
);

// Settings sliders — Figma fluent:options 18×16 (#111). Hand-crafted.
export const ChatSettingsSlidersIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 16" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M11.8 0a2.9 2.9 0 0 0-2.75 2.29H.56a.56.56 0 1 0 0 1.14h8.49A2.9 2.9 0 0 0 14.57 2.86h2.87a.56.56 0 1 0 0-1.14h-2.87A2.9 2.9 0 0 0 11.8 0zm0 4.57a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42zM6.19 10.28a2.9 2.9 0 0 0-2.76 2.29H.56a.56.56 0 1 0 0 1.14h2.87A2.9 2.9 0 0 0 8.94 13.14h8.5a.56.56 0 1 0 0-1.14H8.94A2.9 2.9 0 0 0 6.19 10.28zm0 4.57a1.71 1.71 0 1 1 0-3.43 1.71 1.71 0 0 1 0 3.43z" />
  </svg>
);

// Copy icon for the "auto" confirmation-message actions row (Figma
// 5132:47342 tabler:copy, Educational Background confirm flow). Hand-crafted
// per CLAUDE.md Rule 3 — bounding box + stroke colour only.
export const ChatCopyIcon = ({ className = '' }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <rect x="7.5" y="7.5" width="9" height="9" rx="1.5" />
    <path d="M4.5 12.5h-1a1.5 1.5 0 0 1-1.5-1.5v-7A1.5 1.5 0 0 1 3.5 2.5h7A1.5 1.5 0 0 1 12 4v1" />
  </svg>
);

// Chat message link CTA arrow — Figma 5166:48026 (mynaui:arrow-up-right).
export const ChatLinkArrowIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M4.33203 11.6663L11.6654 4.33301M11.6654 10.333V4.33301H5.66536"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ---- Toast compact-banner icons (Career Buddy save feedback) --------------
// Official production SVGs (success #387440 / error #C0392B / warning #F59638).
export const ToastSuccessIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M11 1.375C13.5527 1.375 16.0009 2.38906 17.8059 4.1941C19.6109 5.99913 20.625 8.44729 20.625 11C20.625 13.5527 19.6109 16.0009 17.8059 17.8059C16.0009 19.6109 13.5527 20.625 11 20.625C8.44729 20.625 5.99913 19.6109 4.1941 17.8059C2.38906 16.0009 1.375 13.5527 1.375 11C1.375 8.44729 2.38906 5.99913 4.1941 4.1941C5.99913 2.38906 8.44729 1.375 11 1.375ZM9.80117 12.8992L7.66348 10.7594C7.50878 10.6044 7.29884 10.5172 7.07986 10.517C6.86088 10.5168 6.65079 10.6036 6.4958 10.7583C6.34082 10.913 6.25363 11.1229 6.25343 11.3419C6.25323 11.5609 6.34003 11.771 6.49473 11.926L9.21895 14.6523C9.29541 14.7292 9.3863 14.7902 9.4864 14.8318C9.5865 14.8734 9.69384 14.8948 9.80225 14.8948C9.91065 14.8948 10.018 14.8734 10.1181 14.8318C10.2182 14.7902 10.3091 14.7292 10.3855 14.6523L16.023 9.0127C16.1015 8.93651 16.164 8.84548 16.207 8.74492C16.2499 8.64435 16.2725 8.53625 16.2733 8.4269C16.274 8.31754 16.2531 8.20912 16.2116 8.10794C16.1701 8.00676 16.109 7.91483 16.0316 7.8375C15.9543 7.76018 15.8624 7.699 15.7612 7.65752C15.66 7.61604 15.5516 7.59509 15.4422 7.59589C15.3329 7.59669 15.2248 7.61922 15.1242 7.66217C15.0237 7.70513 14.9326 7.76765 14.8564 7.84609L9.80117 12.8992Z"
      fill="#387440"
    />
  </svg>
);

export const ToastErrorIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M11.6562 15.3204C11.8316 15.1444 11.9193 14.9266 11.9193 14.6668C11.9193 14.4071 11.8313 14.1896 11.6553 14.0142C11.4793 13.8388 11.2617 13.7508 11.0026 13.7502C10.7435 13.7496 10.5259 13.8376 10.3499 14.0142C10.1739 14.1908 10.0859 14.4083 10.0859 14.6668C10.0859 14.9253 10.1739 15.1432 10.3499 15.3204C10.5259 15.4976 10.7435 15.5853 11.0026 15.5835C11.2617 15.5817 11.4796 15.4946 11.6562 15.3204ZM11.6562 11.6528C11.8316 11.4774 11.9193 11.2599 11.9193 11.0002V7.3335C11.9193 7.07377 11.8313 6.85622 11.6553 6.68083C11.4793 6.50544 11.2617 6.41744 11.0026 6.41683C10.7435 6.41622 10.5259 6.50422 10.3499 6.68083C10.1739 6.85744 10.0859 7.075 10.0859 7.3335V11.0002C10.0859 11.2599 10.1739 11.4777 10.3499 11.6537C10.5259 11.8297 10.7435 11.9174 11.0026 11.9168C11.2617 11.9162 11.4796 11.8282 11.6562 11.6528ZM11.0026 20.1668C9.73455 20.1668 8.54288 19.9261 7.42761 19.4445C6.31233 18.9629 5.34219 18.31 4.51719 17.4856C3.69219 16.6612 3.03922 15.6911 2.55827 14.5752C2.07733 13.4593 1.83655 12.2676 1.83594 11.0002C1.83533 9.73272 2.07611 8.54105 2.55827 7.42516C3.04044 6.30927 3.69341 5.33913 4.51719 4.51475C5.34097 3.69036 6.31111 3.03738 7.42761 2.55583C8.54411 2.07427 9.73577 1.8335 11.0026 1.8335C12.2694 1.8335 13.4611 2.07427 14.5776 2.55583C15.6941 3.03738 16.6642 3.69036 17.488 4.51475C18.3118 5.33913 18.9651 6.30927 19.4479 7.42516C19.9306 8.54105 20.1711 9.73272 20.1693 11.0002C20.1674 12.2676 19.9267 13.4593 19.4469 14.5752C18.9672 15.6911 18.3142 16.6612 17.488 17.4856C16.6618 18.31 15.6917 18.9632 14.5776 19.4454C13.4635 19.9276 12.2719 20.1681 11.0026 20.1668Z"
      fill="#C0392B"
    />
  </svg>
);

export const ToastWarningIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M11.6562 15.3204C11.8316 15.1444 11.9193 14.9266 11.9193 14.6668C11.9193 14.4071 11.8313 14.1896 11.6553 14.0142C11.4793 13.8388 11.2617 13.7508 11.0026 13.7502C10.7435 13.7496 10.5259 13.8376 10.3499 14.0142C10.1739 14.1908 10.0859 14.4083 10.0859 14.6668C10.0859 14.9253 10.1739 15.1432 10.3499 15.3204C10.5259 15.4976 10.7435 15.5853 11.0026 15.5835C11.2617 15.5817 11.4796 15.4946 11.6562 15.3204ZM11.6562 11.6528C11.8316 11.4774 11.9193 11.2599 11.9193 11.0002V7.3335C11.9193 7.07377 11.8313 6.85622 11.6553 6.68083C11.4793 6.50544 11.2617 6.41744 11.0026 6.41683C10.7435 6.41622 10.5259 6.50422 10.3499 6.68083C10.1739 6.85744 10.0859 7.075 10.0859 7.3335V11.0002C10.0859 11.2599 10.1739 11.4777 10.3499 11.6537C10.5259 11.8297 10.7435 11.9174 11.0026 11.9168C11.2617 11.9162 11.4796 11.8282 11.6562 11.6528ZM11.0026 20.1668C9.73455 20.1668 8.54288 19.9261 7.42761 19.4445C6.31233 18.9629 5.34219 18.31 4.51719 17.4856C3.69219 16.6612 3.03922 15.6911 2.55827 14.5752C2.07733 13.4593 1.83655 12.2676 1.83594 11.0002C1.83533 9.73272 2.07611 8.54105 2.55827 7.42516C3.04044 6.30927 3.69341 5.33913 4.51719 4.51475C5.34097 3.69036 6.31111 3.03738 7.42761 2.55583C8.54411 2.07427 9.73577 1.8335 11.0026 1.8335C12.2694 1.8335 13.4611 2.07427 14.5776 2.55583C15.6941 3.03738 16.6642 3.69036 17.488 4.51475C18.3118 5.33913 18.9651 6.30927 19.4479 7.42516C19.9306 8.54105 20.1711 9.73272 20.1693 11.0002C20.1674 12.2676 19.9267 13.4593 19.4469 14.5752C18.9672 15.6911 18.3142 16.6612 17.488 17.4856C16.6618 18.31 15.6917 18.9632 14.5776 19.4454C13.4635 19.9276 12.2719 20.1681 11.0026 20.1668Z"
      fill="#F59638"
    />
  </svg>
);

// Official welcome toast icon — Figma 5624:67780 (fluent:person-available), #387440.
export const ToastWelcomeIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M6.00039 7.20002C6.00039 5.92699 6.5061 4.70609 7.40628 3.80591C8.30645 2.90574 9.52735 2.40002 10.8004 2.40002C12.0734 2.40002 13.2943 2.90574 14.1945 3.80591C15.0947 4.70609 15.6004 5.92699 15.6004 7.20002C15.6004 8.47306 15.0947 9.69396 14.1945 10.5941C13.2943 11.4943 12.0734 12 10.8004 12C9.52735 12 8.30645 11.4943 7.40628 10.5941C6.5061 9.69396 6.00039 8.47306 6.00039 7.20002ZM10.8004 3.60002C9.84561 3.60002 8.92994 3.97931 8.25481 4.65444C7.57968 5.32957 7.20039 6.24525 7.20039 7.20002C7.20039 8.1548 7.57968 9.07048 8.25481 9.74561C8.92994 10.4207 9.84561 10.8 10.8004 10.8C11.7552 10.8 12.6708 10.4207 13.346 9.74561C14.0211 9.07048 14.4004 8.1548 14.4004 7.20002C14.4004 6.24525 14.0211 5.32957 13.346 4.65444C12.6708 3.97931 11.7552 3.60002 10.8004 3.60002ZM2.40039 15.6C2.40039 14.2644 3.48399 13.2 4.81119 13.2H12.3088C12.0031 13.5702 11.7388 13.9725 11.5204 14.4H4.81119C4.13799 14.4 3.60039 14.9364 3.60039 15.6C3.60039 17.1708 4.34679 18.3408 5.60799 19.1436C6.89199 19.9632 8.71839 20.4 10.8004 20.4C11.0404 20.4 11.2772 20.394 11.5108 20.382C11.7196 20.7924 11.9668 21.1756 12.2524 21.5316C11.778 21.5772 11.294 21.6 10.8004 21.6C8.57439 21.6 6.50079 21.1368 4.96239 20.1564C3.39999 19.1604 2.40039 17.628 2.40039 15.6ZM22.8004 17.4C22.8004 18.8322 22.2315 20.2057 21.2188 21.2184C20.2061 22.2311 18.8326 22.8 17.4004 22.8C15.9682 22.8 14.5947 22.2311 13.582 21.2184C12.5693 20.2057 12.0004 18.8322 12.0004 17.4C12.0004 15.9679 12.5693 14.5943 13.582 13.5816C14.5947 12.569 15.9682 12 17.4004 12C18.8326 12 20.2061 12.569 21.2188 13.5816C22.2315 14.5943 22.8004 15.9679 22.8004 17.4ZM20.2252 15.1752C20.1695 15.1193 20.1032 15.075 20.0304 15.0448C19.9575 15.0145 19.8793 14.999 19.8004 14.999C19.7215 14.999 19.6433 15.0145 19.5704 15.0448C19.4975 15.075 19.4313 15.1193 19.3756 15.1752L16.2004 18.3516L15.4252 17.5752C15.3125 17.4626 15.1597 17.3993 15.0004 17.3993C14.8411 17.3993 14.6883 17.4626 14.5756 17.5752C14.4629 17.6879 14.3996 17.8407 14.3996 18C14.3996 18.1594 14.4629 18.3122 14.5756 18.4248L15.7756 19.6248C15.8313 19.6807 15.8975 19.725 15.9704 19.7553C16.0433 19.7855 16.1215 19.8011 16.2004 19.8011C16.2793 19.8011 16.3575 19.7855 16.4304 19.7553C16.5032 19.725 16.5695 19.6807 16.6252 19.6248L20.2252 16.0248C20.2811 15.9691 20.3254 15.9029 20.3556 15.83C20.3859 15.7571 20.4015 15.6789 20.4015 15.6C20.4015 15.5211 20.3859 15.443 20.3556 15.3701C20.3254 15.2972 20.2811 15.231 20.2252 15.1752Z"
      fill="#387440"
    />
  </svg>
);

// Edit-pencil icon for the TalentProfilePanel row "Modify" button — supplied
// directly by the user as real production SVG (not extracted from Figma
// MCP), kebab-case attrs converted to camelCase for JSX. stroke switched to
// currentColor so it follows the tertiary button's own text colour (#111)
// instead of being hardcoded.
export const PanelModifyIcon = ({ className = '' }) => (
  <svg viewBox="0 0 11 12" fill="none" aria-hidden="true" className={className}>
    <path
      d="M0.5 11.0002H9.83333M1.47183 6.44261C1.22311 6.69189 1.0834 7.02964 1.08333 7.38178V9.2502H2.96342C3.31575 9.2502 3.6535 9.1102 3.90258 8.86053L9.44425 3.31595C9.69289 3.06663 9.83251 2.72889 9.83251 2.37678C9.83251 2.02467 9.69289 1.68693 9.44425 1.43761L8.89708 0.88928C8.77369 0.765818 8.62716 0.66789 8.46589 0.601094C8.30462 0.534299 8.13177 0.499946 7.95721 0.5C7.78266 0.500054 7.60982 0.534514 7.44859 0.60141C7.28737 0.668305 7.1409 0.766325 7.01758 0.889863L1.47183 6.44261Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Games mode-card icon — real production SVG supplied directly by the user
// (Figma 5132:55203, "streamline-ultimate-color:board-game-dice-1"), fixed
// multi-colour illustration, not a hand-crafted glyph.
export const PersonalityGamesIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden="true"
    className={` text-[#70706E] ${className}`}
  >
    <path
      d="M24.9366 26.9722C24.6347 27.1034 24.3091 27.1711 23.9799 27.1711C23.6507 27.1711 23.3251 27.1034 23.0232 26.9722L11.7066 22.0222C11.5641 21.96 11.4429 21.8577 11.3577 21.7278C11.2724 21.5978 11.2269 21.4459 11.2266 21.2905V6.13216C11.2272 5.96246 11.2818 5.79737 11.3825 5.66076C11.4832 5.52414 11.6247 5.42307 11.7866 5.37216L23.2649 1.78383C23.7316 1.63716 24.2316 1.63716 24.6982 1.78383L36.1766 5.37549C36.3373 5.42681 36.4777 5.52762 36.5776 5.66352C36.6776 5.79942 36.7321 5.96345 36.7332 6.13216V21.2922C36.7327 21.4471 36.6873 21.5985 36.6024 21.7281C36.5175 21.8577 36.3967 21.9599 36.2549 22.0222L24.9366 26.9722Z"
      fill="white"
    />
    <path
      d="M23.9844 10.4367V27.1751C24.3166 27.1751 24.6355 27.1084 24.941 26.9751L36.2594 22.0217C36.4012 21.9594 36.5219 21.8573 36.6069 21.7277C36.6918 21.5981 36.7372 21.4467 36.7377 21.2917V6.13341C36.7358 5.98193 36.6925 5.83384 36.6127 5.70508L23.9844 10.4367Z"
      fill="#E3E3E3"
    />
    <path
      d="M23.9816 11.8642V10.4359M36.6132 5.69922L23.9832 10.4359L11.3516 5.69922"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M31.9516 23.9058L36.2549 22.0224C36.397 21.96 36.5179 21.8576 36.6029 21.7277C36.6878 21.5978 36.7331 21.446 36.7332 21.2908V6.13244C36.7326 5.96275 36.678 5.79766 36.5773 5.66104C36.4766 5.52442 36.3351 5.42335 36.1732 5.37244L24.6949 1.77578C24.2278 1.62943 23.7271 1.62943 23.2599 1.77578L11.7816 5.36578C11.6195 5.4179 11.4784 5.52035 11.3785 5.65823C11.2787 5.79611 11.2255 5.96223 11.2266 6.13244V10.8658"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.9678 38.1317C16.6659 38.2629 16.3403 38.3307 16.0111 38.3307C15.682 38.3307 15.3564 38.2629 15.0545 38.1317L3.73615 33.1801C3.59429 33.1178 3.47358 33.0156 3.38866 32.8861C3.30375 32.7565 3.25829 32.605 3.25781 32.4501V17.2884C3.25848 17.1187 3.3131 16.9536 3.41376 16.817C3.51443 16.6804 3.65593 16.5793 3.81781 16.5284L15.2945 12.9401C15.7611 12.7934 16.2628 12.7934 16.7295 12.9401L28.2078 16.5317C28.3697 16.5827 28.5112 16.6837 28.6119 16.8203C28.7125 16.957 28.7671 17.122 28.7678 17.2917V32.4501C28.7673 32.605 28.7219 32.7565 28.637 32.8861C28.552 33.0156 28.4313 33.1178 28.2895 33.1801L16.9678 38.1317Z"
      fill="white"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.0128 38.3324V21.5941M16.0128 21.5941L28.6445 16.8574M16.0128 21.5941L3.38281 16.8574"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.0078 21.5947V38.333C16.3378 38.333 16.6611 38.2647 16.9645 38.133L28.2811 33.1813C28.4233 33.1193 28.5444 33.0172 28.6296 32.8876C28.7148 32.758 28.7605 32.6064 28.7611 32.4513V17.2897C28.7592 17.1382 28.716 16.9901 28.6361 16.8613L16.0078 21.5947Z"
      fill="#E3E3E3"
      stroke="#70706E"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M23.9844 5.25391C24.0905 5.25391 24.1922 5.29605 24.2672 5.37106C24.3422 5.44608 24.3844 5.54782 24.3844 5.65391"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M23.9859 5.25391C23.8801 5.25391 23.7786 5.29582 23.7037 5.37047C23.6287 5.44513 23.5864 5.54644 23.5859 5.65224C23.5864 5.75804 23.6287 5.85935 23.7037 5.93401C23.7786 6.00866 23.8801 6.05057 23.9859 6.05057"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24.3827 5.65234C24.3827 5.75814 24.3408 5.85963 24.2661 5.9346C24.1915 6.00957 24.0902 6.0519 23.9844 6.05234M33.151 11.2323C33.151 11.1265 33.1091 11.0251 33.0345 10.9501C32.9598 10.8751 32.8585 10.8328 32.7527 10.8323C32.6469 10.8328 32.5456 10.8751 32.4709 10.9501C32.3963 11.0251 32.3544 11.1265 32.3544 11.2323"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M32.7516 11.6305C32.6455 11.6305 32.5437 11.5883 32.4687 11.5133C32.3937 11.4383 32.3516 11.3366 32.3516 11.2305"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M33.1499 11.2324C33.1495 11.3382 33.1071 11.4395 33.0321 11.5142C32.9572 11.5888 32.8557 11.6308 32.7499 11.6308M33.1499 19.2041C33.1499 19.0983 33.108 18.9968 33.0333 18.9218C32.9587 18.8469 32.8574 18.8045 32.7516 18.8041C32.6461 18.8045 32.545 18.8466 32.4704 18.9212C32.3958 18.9958 32.3537 19.0969 32.3532 19.2024C32.3537 19.3082 32.3943 19.4095 32.4693 19.4842C32.5443 19.5588 32.6458 19.6008 32.7516 19.6008"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M33.1511 19.2031C33.1511 19.3092 33.109 19.411 33.034 19.486C32.959 19.561 32.8572 19.6031 32.7511 19.6031M25.1811 23.9865C25.1807 23.8809 25.1386 23.7799 25.064 23.7053C24.9894 23.6307 24.8883 23.5886 24.7828 23.5881C24.6767 23.5881 24.575 23.6286 24.5 23.7036C24.425 23.7786 24.3828 23.8804 24.3828 23.9865C24.3837 24.092 24.4262 24.1929 24.5011 24.2671C24.5761 24.3414 24.6773 24.3831 24.7828 24.3831"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M25.1805 23.9863C25.1801 24.0921 25.1377 24.1934 25.0628 24.2681C24.9878 24.3427 24.8863 24.3847 24.7805 24.3847M22.3905 27.573C22.496 27.5734 22.5971 27.6155 22.6717 27.6901C22.7463 27.7648 22.7884 27.8658 22.7889 27.9713M21.9922 27.9713C21.9922 27.8655 22.0341 27.764 22.1088 27.6891C22.1834 27.6141 22.2847 27.5718 22.3905 27.5713"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22.3844 28.3687C22.2783 28.3687 22.1765 28.3266 22.1015 28.2516C22.0265 28.1766 21.9844 28.0748 21.9844 27.9688"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22.7837 27.9707C22.7833 28.0765 22.741 28.1778 22.666 28.2525C22.591 28.3271 22.4895 28.369 22.3837 28.369M20.3937 31.9574C20.3937 31.8513 20.3516 31.7495 20.2766 31.6745C20.2016 31.5995 20.0998 31.5574 19.9937 31.5574C19.888 31.5574 19.7865 31.5993 19.7115 31.6739C19.6365 31.7486 19.5942 31.8499 19.5938 31.9557C19.5942 32.0615 19.6365 32.1628 19.7115 32.2375C19.7865 32.3121 19.888 32.354 19.9937 32.354"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.395 31.955C20.395 32.0611 20.3529 32.1628 20.2778 32.2378C20.2028 32.3128 20.1011 32.355 19.995 32.355M12.4233 31.9566C12.4233 31.8508 12.3814 31.7494 12.3068 31.6744C12.2321 31.5994 12.1308 31.5571 12.025 31.5566C11.9195 31.5571 11.8184 31.5992 11.7438 31.6738C11.6692 31.7484 11.6271 31.8495 11.6267 31.955C11.6271 32.0608 11.6678 32.1621 11.7427 32.2367C11.8177 32.3114 11.9192 32.3533 12.025 32.3533"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.4254 31.9554C12.4254 32.0615 12.3833 32.1633 12.3083 32.2383C12.2332 32.3133 12.1315 32.3554 12.0254 32.3554M6.84542 23.9854C6.84542 23.8796 6.88733 23.7782 6.96198 23.7032C7.03664 23.6282 7.13795 23.5876 7.24375 23.5871C7.34955 23.5871 7.45104 23.629 7.52601 23.7037C7.60097 23.7783 7.64331 23.8796 7.64375 23.9854C7.64331 24.091 7.59954 24.192 7.52493 24.2666C7.45032 24.3412 7.34926 24.3817 7.24375 24.3821C7.13824 24.3821 7.037 24.3404 6.96208 24.2661C6.88716 24.1918 6.84463 24.091 6.84375 23.9854M16.4104 16.8121C16.4104 16.7063 16.3685 16.6048 16.2939 16.5299C16.2192 16.4549 16.1179 16.4126 16.0121 16.4121C15.9063 16.4126 15.805 16.4549 15.7303 16.5299C15.6557 16.6048 15.6137 16.7063 15.6138 16.8121"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.0094 17.2105C15.9033 17.2105 15.8015 17.1684 15.7265 17.0934C15.6515 17.0184 15.6094 16.9166 15.6094 16.8105"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.4078 16.8125C16.4074 16.9183 16.365 17.0196 16.2901 17.0943C16.2151 17.1689 16.1136 17.2108 16.0078 17.2108"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// MCQs (Assessment) mode-card icon — real production SVG supplied directly
// by the user (Figma 5132:55204, "Component 28").
export const PersonalityMcqIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M16.6641 12.4993C16.6641 12.2783 16.7519 12.0664 16.9081 11.9101C17.0644 11.7538 17.2764 11.666 17.4974 11.666H24.1641C24.3851 11.666 24.597 11.7538 24.7533 11.9101C24.9096 12.0664 24.9974 12.2783 24.9974 12.4993C24.9974 12.7204 24.9096 12.9323 24.7533 13.0886C24.597 13.2449 24.3851 13.3327 24.1641 13.3327H17.4974C17.2764 13.3327 17.0644 13.2449 16.9081 13.0886C16.7519 12.9323 16.6641 12.7204 16.6641 12.4993ZM17.4974 14.9993C17.2764 14.9993 17.0644 15.0871 16.9081 15.2434C16.7519 15.3997 16.6641 15.6117 16.6641 15.8327C16.6641 16.0537 16.7519 16.2657 16.9081 16.4219C17.0644 16.5782 17.2764 16.666 17.4974 16.666H24.1641C24.3851 16.666 24.597 16.5782 24.7533 16.4219C24.9096 16.2657 24.9974 16.0537 24.9974 15.8327C24.9974 15.6117 24.9096 15.3997 24.7533 15.2434C24.597 15.0871 24.3851 14.9993 24.1641 14.9993H17.4974ZM16.6641 23.3327C16.6641 23.1117 16.7519 22.8997 16.9081 22.7434C17.0644 22.5871 17.2764 22.4993 17.4974 22.4993H24.1641C24.3851 22.4993 24.597 22.5871 24.7533 22.7434C24.9096 22.8997 24.9974 23.1117 24.9974 23.3327C24.9974 23.5537 24.9096 23.7657 24.7533 23.9219C24.597 24.0782 24.3851 24.166 24.1641 24.166H17.4974C17.2764 24.166 17.0644 24.0782 16.9081 23.9219C16.7519 23.7657 16.6641 23.5537 16.6641 23.3327ZM17.4974 25.8327C17.2764 25.8327 17.0644 25.9205 16.9081 26.0768C16.7519 26.233 16.6641 26.445 16.6641 26.666C16.6641 26.887 16.7519 27.099 16.9081 27.2553C17.0644 27.4116 17.2764 27.4993 17.4974 27.4993H24.1641C24.3851 27.4993 24.597 27.4116 24.7533 27.2553C24.9096 27.099 24.9974 26.887 24.9974 26.666C24.9974 26.445 24.9096 26.233 24.7533 26.0768C24.597 25.9205 24.3851 25.8327 24.1641 25.8327H17.4974Z"
      fill="#70706E"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.33594 22.4993C8.33594 22.2783 8.42374 22.0664 8.58002 21.9101C8.7363 21.7538 8.94826 21.666 9.16927 21.666H13.3359C13.557 21.666 13.7689 21.7538 13.9252 21.9101C14.0815 22.0664 14.1693 22.2783 14.1693 22.4993V26.666C14.1693 26.887 14.0815 27.099 13.9252 27.2553C13.7689 27.4116 13.557 27.4993 13.3359 27.4993H9.16927C8.94826 27.4993 8.7363 27.4116 8.58002 27.2553C8.42374 27.099 8.33594 26.887 8.33594 26.666V22.4993ZM10.0026 23.3327V25.8327H12.5026V23.3327H10.0026Z"
      fill="#70706E"
    />
    <path
      d="M14.1621 11.9277C14.3149 11.9292 14.4613 11.9906 14.5693 12.0986C14.6774 12.2067 14.7389 12.353 14.7402 12.5059C14.7416 12.6587 14.6823 12.806 14.5762 12.916L10.833 16.6582L8.75781 14.583C8.6516 14.473 8.59247 14.3257 8.59375 14.1729C8.59508 14.02 8.6566 13.8738 8.76465 13.7656C8.87277 13.6575 9.01898 13.5961 9.17188 13.5947C9.32467 13.5934 9.47205 13.6518 9.58203 13.7578L10.6562 14.833L10.834 15.0098L13.7549 12.0889L13.7539 12.0879C13.8636 11.9835 14.0106 11.9264 14.1621 11.9277Z"
      fill="#70706E"
      stroke="url(#mcq-icon-gradient-1)"
      strokeWidth="0.5"
    />
    <path
      d="M8.33301 5.25H25C25.8177 5.25 26.6024 5.57508 27.1807 6.15332C27.7586 6.73145 28.0829 7.51553 28.083 8.33301V31.667C28.0829 32.4845 27.7586 33.2686 27.1807 33.8467C26.6024 34.4249 25.8177 34.75 25 34.75H8.33301C7.51538 34.7499 6.73148 34.4248 6.15332 33.8467C5.57516 33.2685 5.25009 32.4846 5.25 31.667V8.33301C5.25009 7.51537 5.57516 6.73148 6.15332 6.15332C6.73148 5.57516 7.51537 5.25009 8.33301 5.25ZM8.33301 6.41699C7.82479 6.41708 7.33788 6.61915 6.97852 6.97852C6.61915 7.33788 6.41708 7.82479 6.41699 8.33301V31.667C6.41708 32.1752 6.61915 32.6621 6.97852 33.0215C7.33788 33.3809 7.82479 33.5829 8.33301 33.583H25C25.5083 33.583 25.996 33.3809 26.3555 33.0215C26.7146 32.6621 26.9169 32.1751 26.917 31.667V8.33301C26.9169 7.82495 26.7146 7.33785 26.3555 6.97852C25.996 6.61907 25.5083 6.41699 25 6.41699H8.33301ZM32.5 11.083C33.0967 11.083 33.6689 11.3203 34.0908 11.7422C34.5127 12.1641 34.7499 12.7364 34.75 13.333V30.1768L32.5 33.5518L30.25 30.1768V13.333C30.2501 12.7364 30.4873 12.1641 30.9092 11.7422C31.3311 11.3203 31.9033 11.083 32.5 11.083ZM31.417 29.8232L31.459 29.8857L32.292 31.1357L32.5 31.4482L32.708 31.1357L33.541 29.8857L33.583 29.8232V16.417H31.417V29.8232ZM32.5 12.25C32.2128 12.25 31.9375 12.3643 31.7344 12.5674C31.5313 12.7705 31.4171 13.0458 31.417 13.333V15.25H33.583V13.333C33.5829 13.0458 33.4687 12.7705 33.2656 12.5674C33.0625 12.3643 32.7872 12.25 32.5 12.25Z"
      fill="#70706E"
      stroke="url(#mcq-icon-gradient-2)"
      strokeWidth="0.5"
    />
    <defs>
      <linearGradient
        id="mcq-icon-gradient-1"
        x1="8.34375"
        y1="11.6777"
        x2="13.5522"
        y2="18.1665"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#142916" />
        <stop offset="1" stopColor="#2A5730" />
      </linearGradient>
      <linearGradient
        id="mcq-icon-gradient-2"
        x1="5"
        y1="5"
        x2="35"
        y2="35"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#142916" />
        <stop offset="1" stopColor="#2A5730" />
      </linearGradient>
    </defs>
  </svg>
);

// Open Chat mode-card icon — real production SVG supplied directly by the
// user (Figma 5132:57376's chat-bubble glyph); distinct from the generic
// MessageBubbleIcon used elsewhere.
export const PersonalityOpenChatIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M13.3359 11.6673C14.22 11.6673 15.0678 12.0185 15.693 12.6436C16.3181 13.2687 16.6693 14.1166 16.6693 15.0007V23.334C16.6693 24.218 16.3181 25.0659 15.693 25.691C15.0678 26.3161 14.22 26.6673 13.3359 26.6673C12.4519 26.6673 11.604 26.3161 10.9789 25.691C10.3538 25.0659 10.0026 24.218 10.0026 23.334V15.0007C10.0026 14.1166 10.3538 13.2687 10.9789 12.6436C11.604 12.0185 12.4519 11.6673 13.3359 11.6673ZM23.3359 23.334C23.3359 28.284 19.7359 32.4007 15.0026 33.2007V36.6673H11.6693V33.2007C6.93594 32.4007 3.33594 28.284 3.33594 23.334H6.66927C6.66927 25.1021 7.37165 26.7978 8.62189 28.048C9.87213 29.2983 11.5678 30.0007 13.3359 30.0007C15.104 30.0007 16.7997 29.2983 18.05 28.048C19.3002 26.7978 20.0026 25.1021 20.0026 23.334H23.3359ZM35.6859 15.684L28.6193 22.7673L30.3026 16.6673H23.3359C22.4519 16.6673 21.604 16.3161 20.9789 15.691C20.3538 15.0659 20.0026 14.218 20.0026 13.334V6.66732C20.0026 5.78326 20.3538 4.93542 20.9789 4.31029C21.604 3.68517 22.4519 3.33398 23.3359 3.33398H33.3359C34.22 3.33398 35.0678 3.68517 35.693 4.31029C36.3181 4.93542 36.6693 5.78326 36.6693 6.66732V13.334C36.6693 14.2507 36.3026 15.084 35.6859 15.684Z"
      fill="#70706E"
    />
  </svg>
);

// Escape Room header "Save & Exit" button icon — hand-crafted per CLAUDE.md
// Rule 3: bounding box + stroke only, a plain floppy-disk glyph (Figma
// `fluent:save-16-regular`, not extracted as raw path data).
export const SaveIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M2.5 2.5h8.6L13.5 5.4v8.1a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path
      d="M4.5 2.5v3.3h5V2.5M4.5 14.5v-4.3h7v4.3"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

// Game Store header icon — real production SVG downloaded from the Figma
// Dev Mode MCP asset proxy (5473:48189, "Component 28"), distinct from
// PersonalityGamesIcon (the mode-picker's own dice glyph) — Figma's Game
// Store header uses this simpler dice-box icon instead.
export const GameStoreDiceIcon = ({ className = '' }) => (
  <svg viewBox="0 0 34.8767 38.0664" fill="none" aria-hidden="true" className={className}>
    <path
      d="M22.38 26.0064C22.0781 26.1376 21.7525 26.2053 21.4233 26.2053C21.0942 26.2053 20.7685 26.1376 20.4667 26.0064L9.15 21.0564C9.00758 20.9943 8.88634 20.892 8.8011 20.762C8.71586 20.6321 8.6703 20.4802 8.67 20.3248V5.16643C8.67067 4.99673 8.72529 4.83164 8.82595 4.69502C8.92662 4.5584 9.06812 4.45734 9.23 4.40643L20.7083 0.818095C21.175 0.671428 21.675 0.671428 22.1417 0.818095L33.62 4.40976C33.7807 4.46107 33.9211 4.56189 34.0211 4.69779C34.1211 4.83369 34.1755 4.99772 34.1767 5.16643V20.3264C34.1762 20.4814 34.1307 20.6328 34.0458 20.7624C33.9609 20.892 33.8402 20.9941 33.6983 21.0564L22.38 26.0064Z"
      fill="white"
    />
    <path
      d="M21.4233 9.46976V26.2081C21.7556 26.2081 22.0744 26.1414 22.38 26.0081L33.6983 21.0548C33.8402 20.9925 33.9609 20.8903 34.0458 20.7607C34.1307 20.6311 34.1762 20.4797 34.1767 20.3248V5.16643C34.1747 5.01494 34.1315 4.86686 34.0517 4.73809L21.4233 9.46976Z"
      fill="#E3E3E3"
    />
    <path
      d="M21.4233 10.8981V9.46976M34.055 4.73309L21.425 9.46976L8.79334 4.73309"
      stroke="#70706E"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M29.395 22.9398L33.6983 21.0564C33.8405 20.994 33.9613 20.8916 34.0463 20.7617C34.1312 20.6318 34.1765 20.48 34.1767 20.3248V5.16643C34.176 4.99673 34.1214 4.83164 34.0207 4.69502C33.9201 4.5584 33.7786 4.45734 33.6167 4.40643L22.1383 0.809761C21.6712 0.663413 21.1705 0.663413 20.7033 0.809761L9.225 4.39976C9.06297 4.45189 8.92178 4.55434 8.82196 4.69221C8.72215 4.83009 8.66892 4.99622 8.67 5.16643V9.89976"
      stroke="#70706E"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.41 37.1664C14.1081 37.2976 13.7825 37.3653 13.4533 37.3653C13.1242 37.3653 12.7985 37.2976 12.4967 37.1664L1.17834 32.2148C1.03648 32.1525 0.915767 32.0503 0.830855 31.9207C0.745942 31.7911 0.700484 31.6397 0.700003 31.4848V16.3231C0.700672 16.1534 0.755287 15.9883 0.855953 15.8517C0.956618 15.7151 1.09812 15.614 1.26 15.5631L12.7367 11.9748C13.2033 11.8281 13.705 11.8281 14.1717 11.9748L25.65 15.5664C25.8119 15.6173 25.9534 15.7184 26.0541 15.855C26.1547 15.9916 26.2093 16.1567 26.21 16.3264V31.4848C26.2095 31.6397 26.1641 31.7911 26.0792 31.9207C25.9942 32.0503 25.8735 32.1525 25.7317 32.2148L14.41 37.1664Z"
      fill="white"
      stroke="#70706E"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.4533 37.3664V20.6281M13.4533 20.6281L26.085 15.8914M13.4533 20.6281L0.823337 15.8914"
      stroke="#70706E"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.4533 20.6281V37.3664C13.7833 37.3664 14.1067 37.2981 14.41 37.1664L25.7267 32.2148C25.8688 32.1527 25.9899 32.0507 26.0751 31.9211C26.1603 31.7915 26.206 31.6399 26.2067 31.4848V16.3231C26.2047 16.1716 26.1615 16.0235 26.0817 15.8948L13.4533 20.6281Z"
      fill="#E3E3E3"
      stroke="#70706E"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21.4233 4.28809C21.5294 4.28809 21.6312 4.33024 21.7062 4.40525C21.7812 4.48027 21.8233 4.58201 21.8233 4.68809"
      stroke="#70706E"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21.425 4.28809C21.3192 4.28809 21.2177 4.33001 21.1427 4.40466C21.0678 4.47932 21.0254 4.58063 21.025 4.68643C21.0254 4.79223 21.0678 4.89354 21.1427 4.96819C21.2177 5.04285 21.3192 5.08476 21.425 5.08476"
      stroke="#70706E"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21.8217 4.68643C21.8217 4.79223 21.7798 4.89372 21.7051 4.96868C21.6304 5.04365 21.5291 5.08599 21.4233 5.08643M30.59 10.2664C30.59 10.1606 30.5481 10.0591 30.4734 9.98417C30.3988 9.90921 30.2975 9.86687 30.1917 9.86643C30.0859 9.86687 29.9846 9.90921 29.9099 9.98417C29.8353 10.0591 29.7933 10.1606 29.7933 10.2664"
      stroke="#70706E"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M30.1917 10.6648C30.0856 10.6648 29.9838 10.6226 29.9088 10.5476C29.8338 10.4726 29.7917 10.3708 29.7917 10.2648"
      stroke="#70706E"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M30.59 10.2664C30.5896 10.3722 30.5472 10.4735 30.4723 10.5482C30.3973 10.6228 30.2958 10.6648 30.19 10.6648M30.59 18.2381C30.59 18.1323 30.5481 18.0308 30.4734 17.9558C30.3988 17.8809 30.2975 17.8385 30.1917 17.8381C30.0862 17.8385 29.9851 17.8806 29.9105 17.9552C29.8359 18.0299 29.7938 18.1309 29.7933 18.2364C29.7938 18.3422 29.8344 18.4435 29.9094 18.5182C29.9844 18.5928 30.0859 18.6348 30.1917 18.6348"
      stroke="#70706E"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M30.59 18.2364C30.59 18.3425 30.5479 18.4443 30.4728 18.5193C30.3978 18.5943 30.2961 18.6364 30.19 18.6364M22.62 23.0198C22.6196 22.9143 22.5775 22.8132 22.5029 22.7386C22.4282 22.664 22.3272 22.6219 22.2217 22.6214C22.1156 22.6214 22.0138 22.6619 21.9388 22.7369C21.8638 22.8119 21.8217 22.9137 21.8217 23.0198C21.8226 23.1253 21.8651 23.2262 21.94 23.3005C22.0149 23.3747 22.1162 23.4164 22.2217 23.4164"
      stroke="#70706E"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22.62 23.0198C22.6196 23.1256 22.5772 23.2269 22.5023 23.3015C22.4273 23.3762 22.3258 23.4181 22.22 23.4181M19.83 26.6064C19.9355 26.6069 20.0366 26.649 20.1112 26.7236C20.1858 26.7982 20.2279 26.8993 20.2283 27.0048M19.4317 27.0048C19.4317 26.899 19.4736 26.7975 19.5482 26.7225C19.6229 26.6475 19.7242 26.6052 19.83 26.6048"
      stroke="#70706E"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.83 27.4031C19.7239 27.4031 19.6222 27.361 19.5472 27.2859C19.4721 27.2109 19.43 27.1092 19.43 27.0031"
      stroke="#70706E"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.2283 27.0048C20.2279 27.1106 20.1856 27.2119 20.1106 27.2865C20.0356 27.3612 19.9341 27.4031 19.8283 27.4031M17.8383 30.9914C17.8383 30.8853 17.7962 30.7836 17.7212 30.7086C17.6462 30.6336 17.5444 30.5914 17.4383 30.5914C17.3325 30.5914 17.231 30.6333 17.1561 30.708C17.0811 30.7827 17.0388 30.884 17.0383 30.9898C17.0388 31.0956 17.0811 31.1969 17.1561 31.2715C17.231 31.3462 17.3325 31.3881 17.4383 31.3881"
      stroke="#70706E"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.8383 30.9898C17.8383 31.0958 17.7962 31.1976 17.7212 31.2726C17.6462 31.3476 17.5444 31.3898 17.4383 31.3898M9.86667 30.9914C9.86667 30.8856 9.82476 30.7841 9.7501 30.7092C9.67545 30.6342 9.57413 30.5919 9.46834 30.5914C9.36283 30.5919 9.26176 30.634 9.18716 30.7086C9.11255 30.7832 9.07044 30.8843 9.07 30.9898C9.07044 31.0956 9.11111 31.1969 9.18608 31.2715C9.26105 31.3462 9.36254 31.3881 9.46834 31.3881"
      stroke="#70706E"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.86667 30.9898C9.86667 31.0958 9.82453 31.1976 9.74951 31.2726C9.6745 31.3476 9.57276 31.3898 9.46667 31.3898M4.28667 23.0198C4.28667 22.914 4.32858 22.8125 4.40324 22.7375C4.47789 22.6625 4.57921 22.6219 4.685 22.6214C4.7908 22.6214 4.89229 22.6633 4.96726 22.738C5.04223 22.8127 5.08456 22.914 5.085 23.0198C5.08456 23.1253 5.04079 23.2263 4.96618 23.3009C4.89158 23.3755 4.79051 23.416 4.685 23.4164C4.57949 23.4164 4.47825 23.3747 4.40333 23.3005C4.32841 23.2262 4.28588 23.1253 4.285 23.0198M13.8517 15.8464C13.8517 15.7406 13.8098 15.6391 13.7351 15.5642C13.6604 15.4892 13.5591 15.4469 13.4533 15.4464C13.3475 15.4469 13.2462 15.4892 13.1716 15.5642C13.0969 15.6391 13.055 15.7406 13.055 15.8464"
      stroke="#70706E"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.4533 16.2448C13.3473 16.2448 13.2455 16.2026 13.1705 16.1276C13.0955 16.0526 13.0533 15.9508 13.0533 15.8448"
      stroke="#70706E"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.8517 15.8464C13.8512 15.9522 13.8089 16.0535 13.7339 16.1282C13.659 16.2028 13.5575 16.2448 13.4517 16.2448"
      stroke="#70706E"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Game Store header close (X) icon — real production SVG downloaded from
// the Figma Dev Mode MCP asset proxy (5473:48196, "20-close" → Icon).
export const GameStoreCloseIcon = ({ className = '' }) => (
  <svg viewBox="0 0 8 8" fill="none" aria-hidden="true" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.175736 0.175736C0.410051 -0.0585786 0.78995 -0.0585786 1.02426 0.175736L4 3.15147L6.97574 0.175736C7.21005 -0.0585786 7.58995 -0.0585786 7.82426 0.175736C8.05858 0.410051 8.05858 0.78995 7.82426 1.02426L4.84853 4L7.82426 6.97574C8.05858 7.21005 8.05858 7.58995 7.82426 7.82426C7.58995 8.05858 7.21005 8.05858 6.97574 7.82426L4 4.84853L1.02426 7.82426C0.78995 8.05858 0.410051 8.05858 0.175736 7.82426C-0.0585786 7.58995 -0.0585786 7.21005 0.175736 6.97574L3.15147 4L0.175736 1.02426C-0.0585786 0.78995 -0.0585786 0.410051 0.175736 0.175736Z"
      fill="#387440"
    />
  </svg>
);

// Game Store details "keyboard hint" footer icon — real production SVG
// (5473:48281). Figma names it a generic "Frame" but the shape (circle +
// vertical bar + dot) is an info-circle glyph, not literal arrow keys.
export const GameStoreInfoIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
    <circle cx="7" cy="7" r="6" stroke="#387440" strokeWidth="1.2" />
    <path d="M7 6v4M7 4.5v.5" stroke="#387440" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// "Let's Play →" CTA arrow — real production SVG (5473:48285's
// "20-arrow-right" instance), white fill for the pressed-green button.
export const GameStoreArrowIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 10" fill="none" aria-hidden="true" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.73598 0.203852C9.03761 -0.0800352 9.51226 -0.0656517 9.79615 0.235979L13.7962 4.48598C14.068 4.77477 14.068 5.22524 13.7962 5.51403L9.79615 9.76403C9.51226 10.0657 9.03761 10.08 8.73598 9.79615C8.43435 9.51226 8.41996 9.03761 8.70385 8.73598L11.5142 5.75H0.75C0.335786 5.75 0 5.41422 0 5C0 4.58579 0.335786 4.25 0.75 4.25H11.5142L8.70385 1.26403C8.41996 0.962395 8.43435 0.48774 8.73598 0.203852Z"
      fill="#FEFEFE"
    />
  </svg>
);

// Recruiter Panel — Company Info icon (user-supplied SVG for Figma 5132:66001).
export const RecruiterCompanyInfoIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M3.33203 20C3.33203 12.9283 3.33203 9.39333 5.77203 7.19667C8.21536 5 12.142 5 19.9987 5C27.8554 5 31.7837 5 34.2237 7.19667C36.6637 9.39333 36.6654 12.93 36.6654 20C36.6654 27.07 36.6654 30.6067 34.2237 32.8033C31.7854 35 27.8554 35 19.9987 35C12.142 35 8.2137 35 5.77203 32.8033C3.33036 30.6067 3.33203 27.07 3.33203 20Z"
      stroke="#387440"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 13.3335H12.6667C11.41 13.3335 10.7817 13.3335 10.39 13.7235C10 14.1168 10 14.7435 10 16.0002V17.3335C10 18.5902 10 19.2185 10.39 19.6102C10.7833 20.0002 11.41 20.0002 12.6667 20.0002H14C15.2567 20.0002 15.885 20.0002 16.2767 19.6102C16.6667 19.2168 16.6667 18.5902 16.6667 17.3335V16.0002C16.6667 14.7435 16.6667 14.1152 16.2767 13.7235C15.8833 13.3335 15.2567 13.3335 14 13.3335Z"
      stroke="#387440"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path
      d="M10 26.6668H16.6667M23.3333 13.3335H30M23.3333 20.0002H30M23.3333 26.6668H30"
      stroke="#387440"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Recruiter "Post a Job" mode-card icons (Figma 5132:69556 / 69569 / 69583) ──
// Hand-crafted per the session rule for small UI icons: only the 40x40 bounding
// box and the stroke treatment are taken from Figma (source icons are Iconify
// sets — basil:file-upload-outline, marketeq:conversation,
// hugeicons:content-writing); no path data was copied. Default colour matches
// the existing mode-card icons (PersonalityGamesIcon et al., #70706E) since
// these render in the identical ChatThread `modeCards` slot at the same size.

// Document with an upward arrow — "File Upload" card.
export const JobFileUploadIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden="true"
    className={` text-[#70706E] ${className}`}
  >
    <path
      d="M23 5H12a3 3 0 0 0-3 3v24a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V13l-8-8Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M23 5v8h8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M20 29v-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path
      d="m16.5 23.5 3.5-3.5 3.5 3.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Two overlapping speech bubbles — "Conversation with AI" card.
export const JobConversationIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden="true"
    className={` text-[#70706E] ${className}`}
  >
    <path
      d="M6 13a3 3 0 0 1 3-3h13a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-8l-6 4v-4H9a3 3 0 0 1-3-3v-7Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M29 16h2a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-1v4l-5-4h-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Document with a pencil — "Manual Creation" card.
export const JobManualCreationIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden="true"
    className={` text-[#70706E] ${className}`}
  >
    <path
      d="M27 20v12a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13 16h7M13 22h6M13 28h5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="m30.5 5.5 4 4L24 20l-5 1 1-5 10.5-10.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

// ---- Work Experience profile-filling flow (2026-09-06) ----------------
// Moved here from being hand-rolled inline in individual Work section/modal
// files so every Work-flow icon has one definition, reused across call sites.

// Small "company" glyph on each role card and the success-modal mini-list —
// used by both WorkStage2Section.jsx (RoleCard) and WorkSavedModal.jsx.
export const WorkRoleIcon = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <rect x="4" y="5" width="16" height="10" rx="1.5" />
    <path d="M2 19h20l-1.6-3.4a1 1 0 0 0-.9-.6H4.5a1 1 0 0 0-.9.6L2 19z" />
  </svg>
);

// Small 12×12 delete glyph on each role card's action-button row
// (WorkStage2Section.jsx RoleCard) — distinct from WorkDeleteWarningIcon
// below, which is the larger modal-header illustration.
export const WorkDeleteIcon = ({ className = '' }) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M1.5 3h9M4.5 3V2h3v1M2.5 3l.5 7h6l.5-7" />
    <line x1="5" y1="5" x2="5" y2="8.5" />
    <line x1="7" y1="5" x2="7" y2="8.5" />
  </svg>
);

// Larger 24×24 delete illustration in DeleteWorkModal.jsx's header badge.
export const WorkDeleteWarningIcon = ({ className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="45"
    height="51"
    viewBox="0 0 45 51"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.2 7.7C11.2 3.44741 14.6474 0 18.9 0H25.9C30.1526 0 33.6 3.44741 33.6 7.7V8.4H42.7C43.8598 8.4 44.8 9.3402 44.8 10.5C44.8 11.6598 43.8598 12.6 42.7 12.6H41.8866L40.1906 43.1271C39.9639 47.2075 36.5891 50.4 32.5025 50.4H12.2975C8.21087 50.4 4.83607 47.2075 4.60938 43.1271L2.91343 12.6H2.1C0.940202 12.6 0 11.6598 0 10.5C0 9.3402 0.940202 8.4 2.1 8.4H11.2V7.7ZM7.11991 12.6L8.80291 42.8941C8.90595 44.7489 10.44 46.2 12.2975 46.2H32.5025C34.36 46.2 35.894 44.7489 35.9971 42.8941L37.6801 12.6H7.11991ZM29.4 8.4H15.4V7.7C15.4 5.767 16.967 4.2 18.9 4.2H25.9C27.833 4.2 29.4 5.767 29.4 7.7V8.4ZM16.1 19.6C17.2598 19.6 18.2 20.5402 18.2 21.7V37.1C18.2 38.2598 17.2598 39.2 16.1 39.2C14.9402 39.2 14 38.2598 14 37.1V21.7C14 20.5402 14.9402 19.6 16.1 19.6ZM28.7 19.6C29.8598 19.6 30.8 20.5402 30.8 21.7V37.1C30.8 38.2598 29.8598 39.2 28.7 39.2C27.5402 39.2 26.6 38.2598 26.6 37.1V21.7C26.6 20.5402 27.5402 19.6 28.7 19.6Z"
      fill="currentColor"
    />
  </svg>
);

// ---- Goals (Desired Career Options) profile-filling flow (2026-09-09) ----
// Small 12×12 "money-03" glyph rendered next to the salary line on every
// goal card (Figma 5622:89448 etc., file key Bin8roWL8sloyc36IgFMuT).
// ✅ VERIFIED: path data copied verbatim from the Figma Dev-Mode asset
// server's own SVG for that node
// (localhost:3845/assets/bc5fea49e4e92b7cd813954f873279632c9df974.svg),
// with Figma's hardcoded #387440 stroke swapped for `currentColor` so call
// sites can tint it — no hand-drawn approximation. Added rather than reused
// because assets.jsx had no money/currency glyph of any kind (grepped
// 2026-09-09); every OTHER Goals icon reuses an existing export
// (WorkRoleIcon for the "laptop" card tile, UploadCertificateIcon for the
// empty-state "certificate-01" glyph, WorkDeleteWarningIcon / WorkEditPencilIcon
// for the delete + edit affordances).
export const GoalSalaryIcon = ({ className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M7.24999 6.00001C7.24999 6.69036 6.69034 7.25001 5.99999 7.25001C5.30964 7.25001 4.75 6.69036 4.75 6.00001C4.75 5.30966 5.30964 4.75 5.99999 4.75C6.69034 4.75 7.24999 5.30966 7.24999 6.00001Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 2.5C9.2397 2.5 10.0952 2.6921 10.5665 2.83816C10.8378 2.92226 11 3.17945 11 3.46353V8.34116C11 8.89871 10.386 9.31821 9.8381 9.21476C9.36805 9.12601 8.75535 9.05471 8 9.05471C5.62455 9.05471 5.0548 9.95756 1.5724 9.18961C1.23632 9.11551 1 8.81326 1 8.46911V3.46058C1 2.97265 1.4604 2.61683 1.93899 2.7118C5.09835 3.33873 5.71045 2.5 8 2.5Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 4.5C1.97566 4.5 2.85241 3.70253 2.9645 2.87708M9.25025 2.75C9.25025 3.76982 10.1327 4.73449 11 4.73449M11 7.50001C10.0505 7.50001 9.13005 8.15511 9.051 9.04916M3.00025 9.24806C3.00025 8.14346 2.10482 7.24806 1.00024 7.24806"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Filled 14×14 play-triangle — "active" indicator on ProfileFillingJourneyPanel.jsx's
// journey rows (the "done" counterpart reuses the existing CheckIcon above).
export const PlayMarkIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 14" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M3.5 2.5L11.5 7 3.5 11.5V2.5z" />
  </svg>
);

// Calendar-picker button icon — used by the shared `ui/form/DatePicker`
// component (originally added for AddEditWorkModal.jsx's Start/End date
// fields; now generic since DatePicker is reusable). Real production SVG
// supplied directly by the user (Figma node 5114:124426), used verbatim per
// CLAUDE.md's "user supplies real SVG" exception. Gradient id is generated
// per-instance via useId() since multiple DatePicker instances can render on
// the same page at once — a hardcoded id would create a duplicate-id
// collision.
export const CalendarPickerIcon = ({ className = '' }) => {
  const gradientId = useId();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M10.5625 1.52344H10.0547V0.507812H9.03906V1.52344H3.96094V0.507812H2.94531V1.52344H2.4375C1.87891 1.52344 1.42188 1.98047 1.42188 2.53906V10.6641C1.42188 11.2227 1.87891 11.6797 2.4375 11.6797H10.5625C11.1211 11.6797 11.5781 11.2227 11.5781 10.6641V2.53906C11.5781 1.98047 11.1211 1.52344 10.5625 1.52344ZM10.5625 10.6641H2.4375V4.0625H10.5625V10.6641Z"
        fill={`url(#${gradientId})`}
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="1.42188"
          y1="0.507812"
          x2="12.5432"
          y2="10.6181"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#142916" />
          <stop offset="1" stopColor="#2A5730" />
        </linearGradient>
      </defs>
    </svg>
  );
};

/* ───────────────────────────────────────────────────────────────────────────
 * Talent Pitch (stage 9) glyphs — Figma file Bin8roWL8sloyc36IgFMuT.
 *
 * Every path below is copied VERBATIM from the Figma Dev-Mode asset server's
 * own SVG for the named node (fetched 2026-09-09 from
 * http://localhost:3845/assets/…), with the baked-in `stroke`/`fill` colour
 * swapped for `currentColor` so call sites can tint them — the same approach
 * `GoalSalaryIcon` used. Nothing here is hand-drawn or approximated.
 *
 * NOTE on reuse (checked before adding anything): `PitchStepIcon` already
 * exists above and is the journey-panel/showcase glyph for this stage — it is
 * NOT duplicated here. `UploadCertificateIcon` covers the stage-2 empty
 * state's "certificate-01" node, `WorkRoleIcon` covers every "laptop" tile,
 * `CheckIcon` covers the recorder's "check" glyph, and
 * `WorkDeleteWarningIcon` covers every delete affordance in this flow (per
 * the standing icon-consolidation instruction).
 * ─────────────────────────────────────────────────────────────────────────── */

// Figma "flim-slate" (sic) — the Record tab pill, the uploaded-file row tile
// and the written-pitch "Want 6× more recruiter messages?" banner.
export const PitchFilmSlateIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M2.33301 7H11.9409C12.9114 7 13.3967 7 13.6981 7.29287C13.9997 7.5858 13.9997 8.0572 13.9997 9V10C13.9997 12.1999 13.9997 13.2998 13.2961 13.9833C12.5926 14.6667 11.4603 14.6667 9.19574 14.6667H7.13694C4.87234 14.6667 3.74004 14.6667 3.03653 13.9833C2.33301 13.2998 2.33301 12.1999 2.33301 10V7Z"
      stroke="currentColor"
    />
    <path
      d="M2.33218 7.00261C2.09412 6.09732 1.97509 5.64468 2.00436 5.24668C2.05679 4.53382 2.42495 3.88408 3.00461 3.48138C3.32824 3.25655 3.77247 3.13527 4.66092 2.8927L9.8214 1.48375C10.0511 1.42103 10.1661 1.38966 10.2651 1.37185C11.3669 1.1739 12.4491 1.81055 12.8318 2.88177C12.8662 2.97814 12.897 3.09519 12.9585 3.32931C12.9761 3.3962 12.9849 3.42965 12.9899 3.45851C13.0455 3.77926 12.8669 4.09432 12.5665 4.20572C12.5395 4.21574 12.5067 4.2247 12.4411 4.24263L2.33218 7.00261Z"
      stroke="currentColor"
    />
    <path d="M4.66699 6.66406L6.00033 2.66406" stroke="currentColor" />
    <path d="M9.33301 5.33594L10.6663 1.33594" stroke="currentColor" />
    <path d="M5.33301 12H7.33301" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

// Figma "upload-05" — the Upload tab pill.
export const PitchUploadTabIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M1.66699 9.0026V4.33594H14.3337V9.0026C14.3337 11.5167 14.3337 12.7739 13.5526 13.5549C12.7716 14.3359 11.5145 14.3359 9.00035 14.3359H7.00035C4.48617 14.3359 3.22909 14.3359 2.44804 13.5549C1.66699 12.7739 1.66699 11.5167 1.66699 9.0026Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.66699 4.33073L2.06699 3.7974C2.85213 2.75054 3.2447 2.22712 3.80776 1.94559C4.37081 1.66406 5.02509 1.66406 6.33366 1.66406H9.66702C10.9756 1.66406 11.6298 1.66406 12.1929 1.94559C12.756 2.22712 13.1486 2.75054 13.9337 3.7974L14.3337 4.33073"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.0001 9C10.0001 9 8.52707 7 8 7C7.473 7 6.00004 9 6.00004 9M8 7.33333L8.00007 11.6667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Figma "edit-01" — the Written Pitch tab pill and the "Write a pitch"
// three-ways card.
export const PitchWriteIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M11.2973 2.11797C11.6888 1.72646 11.8845 1.53071 12.1014 1.43709C12.4139 1.30222 12.7681 1.30222 13.0805 1.43709C13.2973 1.53071 13.4931 1.72646 13.8846 2.11797C14.2761 2.50949 14.4719 2.70524 14.5655 2.92211C14.7004 3.23454 14.7004 3.58877 14.5655 3.9012C14.4719 4.11807 14.2761 4.31382 13.8846 4.70533L10.5369 8.05307C9.71213 8.87787 9.29973 9.29027 8.7832 9.53461C8.26667 9.77894 7.68627 9.83621 6.52549 9.95074L6 10.0026L6.05185 9.47714C6.16639 8.31634 6.22366 7.73594 6.46801 7.21941C6.71233 6.70287 7.12473 6.29049 7.94953 5.4657L11.2973 2.11797Z"
      stroke="currentColor"
      strokeLinejoin="round"
    />
    <path
      d="M3.99967 10H2.49967C1.85534 10 1.33301 10.5223 1.33301 11.1667C1.33301 11.811 1.85534 12.3333 2.49967 12.3333H8.83301C9.47734 12.3333 9.99967 12.8557 9.99967 13.5C9.99967 14.1443 9.47734 14.6667 8.83301 14.6667H7.33301"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Figma "camera-video" — the "Record in-browser" three-ways card.
export const PitchCameraVideoIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path
      d="M3.75 17.9193L7.08333 14.5859M8.75 14.5859L12.0833 17.9193M7.91667 14.5859V18.7526"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.66699 9.89583C1.66699 8.17717 1.66699 7.31784 2.52127 6.78392C3.37553 6.25 4.75047 6.25 7.50033 6.25H8.33366C11.0835 6.25 12.4584 6.25 13.3127 6.78392C14.167 7.31784 14.167 8.17717 14.167 9.89583V10.9375C14.167 12.6562 14.167 13.5155 13.3127 14.0494C12.4584 14.5833 11.0835 14.5833 8.33366 14.5833H7.50033C4.75047 14.5833 3.37553 14.5833 2.52127 14.0494C1.66699 13.5155 1.66699 12.6562 1.66699 10.9375V9.89583Z"
      stroke="currentColor"
    />
    <path
      d="M14.167 8.54401L14.2719 8.48109C16.0351 7.42305 16.9167 6.89404 17.6252 7.14946C18.3337 7.4049 18.3337 8.25172 18.3337 9.94542V10.8932C18.3337 12.5868 18.3337 13.4337 17.6252 13.6891C16.9167 13.9445 16.0351 13.4155 14.2719 12.3575L14.167 12.2945"
      stroke="currentColor"
      strokeLinecap="round"
    />
    <path
      d="M10.4163 6.2526C11.5669 6.2526 12.4997 5.31986 12.4997 4.16927C12.4997 3.01868 11.5669 2.08594 10.4163 2.08594C9.26575 2.08594 8.33301 3.01868 8.33301 4.16927C8.33301 5.31986 9.26575 6.2526 10.4163 6.2526Z"
      stroke="currentColor"
    />
    <path
      d="M5.83301 6.25C7.21372 6.25 8.33301 5.13071 8.33301 3.75C8.33301 2.36929 7.21372 1.25 5.83301 1.25C4.4523 1.25 3.33301 2.36929 3.33301 3.75C3.33301 5.13071 4.4523 6.25 5.83301 6.25Z"
      stroke="currentColor"
    />
  </svg>
);

// Figma "computer-arrow-up" — the "Upload a video" three-ways card.
export const PitchComputerUploadIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path
      d="M13.3337 2.5H6.66699C4.30997 2.5 3.13146 2.5 2.39923 3.23223C1.66699 3.96447 1.66699 5.14297 1.66699 7.5V9.16667C1.66699 11.5237 1.66699 12.7022 2.39923 13.4344C3.13146 14.1667 4.30997 14.1667 6.66699 14.1667H13.3337C15.6907 14.1667 16.8692 14.1667 17.6014 13.4344C18.3337 12.7022 18.3337 11.5237 18.3337 9.16667V7.5C18.3337 5.14297 18.3337 3.96447 17.6014 3.23223C16.8692 2.5 15.6907 2.5 13.3337 2.5Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.8753 17.4974H13.3337M11.8753 17.4974C11.185 17.4974 10.6253 16.9377 10.6253 16.2474V14.1641H10.0003M11.8753 17.4974H8.12533M10.0003 14.1641H9.37533V16.2474C9.37533 16.9377 8.81566 17.4974 8.12533 17.4974M10.0003 14.1641V17.4974M8.12533 17.4974H6.66699"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 8.33592C7.5 8.33592 9.34125 5.83595 10 5.83594C10.6588 5.83593 12.5 8.33594 12.5 8.33594M10 6.2526V10.8359"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Figma "camera" — the recorder's camera-access card badge. Figma strokes
// this one at 2px (it sits on the dark viewfinder), so the weight is kept.
export const PitchCameraIcon = ({ className = '' }) => (
  <svg viewBox="0 0 22 22" fill="none" aria-hidden="true" className={className}>
    <path
      d="M13.7705 3.92294C13.4865 3.75351 13.1619 3.66406 12.8311 3.66406H9.1706C8.84018 3.66404 8.51591 3.7533 8.23205 3.92238C7.9482 4.09147 7.71533 4.33411 7.55805 4.62463L7.10976 5.45322C6.95249 5.74374 6.71961 5.98638 6.43576 6.15547C6.15191 6.32455 5.82763 6.41381 5.49722 6.41379H3.66649C3.18022 6.41379 2.71387 6.60692 2.37002 6.9507C2.02618 7.29449 1.83301 7.76076 1.83301 8.24694V16.4961C1.83301 16.9823 2.02618 17.4486 2.37002 17.7923C2.71387 18.1361 3.18022 18.3293 3.66649 18.3293H18.3343C18.8206 18.3293 19.287 18.1361 19.6308 17.7923C19.9746 17.4486 20.1678 16.9823 20.1678 16.4961V8.24694C20.1678 7.76076 19.9746 7.29449 19.6308 6.9507C19.287 6.60692 18.8206 6.41379 18.3343 6.41379H16.5036C16.1728 6.41379 15.8483 6.32434 15.5642 6.15491C15.2802 5.98549 15.0472 5.74239 14.8901 5.45138L14.4446 4.62647C14.2875 4.33546 14.0546 4.09236 13.7705 3.92294Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Figma "settings" — the recorder's 44px settings button.
export const PitchSettingsIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path
      d="M8.05893 3.44517C8.10485 2.96212 8.32921 2.51354 8.68818 2.18707C9.04716 1.86059 9.51495 1.67969 10.0002 1.67969C10.4854 1.67969 10.9532 1.86059 11.3122 2.18707C11.6712 2.51354 11.8955 2.96212 11.9414 3.44517C11.969 3.75721 12.0714 4.05801 12.2399 4.32211C12.4084 4.58622 12.638 4.80584 12.9093 4.9624C13.1807 5.11895 13.4857 5.20783 13.7987 5.22152C14.1116 5.2352 14.4233 5.17328 14.7073 5.041C15.1482 4.84081 15.6478 4.81185 16.1089 4.95974C16.57 5.10763 16.9596 5.42179 17.2019 5.84109C17.4441 6.26038 17.5217 6.75481 17.4195 7.22814C17.3173 7.70147 17.0426 8.11984 16.6489 8.40183C16.3926 8.5817 16.1833 8.82067 16.0389 9.09852C15.8944 9.37637 15.819 9.68492 15.819 9.99808C15.819 10.3112 15.8944 10.6198 16.0389 10.8976C16.1833 11.1755 16.3926 11.4145 16.6489 11.5943C17.0426 11.8763 17.3173 12.2947 17.4195 12.768C17.5217 13.2414 17.4441 13.7358 17.2019 14.1551C16.9596 14.5744 16.57 14.8885 16.1089 15.0364C15.6478 15.1843 15.1482 15.1553 14.7073 14.9552C14.4233 14.8229 14.1116 14.761 13.7987 14.7746C13.4857 14.7883 13.1807 14.8772 12.9093 15.0338C12.638 15.1903 12.4084 15.4099 12.2399 15.674C12.0714 15.9381 11.969 16.239 11.9414 16.551C11.8955 17.034 11.6712 17.4826 11.3122 17.8091C10.9532 18.1356 10.4854 18.3165 10.0002 18.3165C9.51495 18.3165 9.04716 18.1356 8.68818 17.8091C8.32921 17.4826 8.10485 17.034 8.05893 16.551C8.03138 16.2388 7.92901 15.9379 7.76049 15.6737C7.59196 15.4095 7.36224 15.1898 7.09079 15.0333C6.81934 14.8767 6.51416 14.7878 6.20108 14.7742C5.88801 14.7607 5.57627 14.8227 5.29227 14.9552C4.85134 15.1553 4.3517 15.1843 3.8906 15.0364C3.42949 14.8885 3.03991 14.5744 2.79767 14.1551C2.55543 13.7358 2.47786 13.2414 2.58007 12.768C2.68227 12.2947 2.95693 11.8763 3.3506 11.5943C3.60695 11.4145 3.81621 11.1755 3.96067 10.8976C4.10514 10.6198 4.18056 10.3112 4.18056 9.99808C4.18056 9.68492 4.10514 9.37637 3.96067 9.09852C3.81621 8.82067 3.60695 8.5817 3.3506 8.40183C2.95749 8.1197 2.68331 7.70149 2.58135 7.22848C2.47939 6.75547 2.55694 6.26145 2.79892 5.84243C3.0409 5.4234 3.43003 5.10931 3.89067 4.9612C4.35132 4.81309 4.85059 4.84153 5.29143 5.041C5.5754 5.17328 5.88705 5.2352 6.20002 5.22152C6.51298 5.20783 6.81804 5.11895 7.08938 4.9624C7.36072 4.80584 7.59034 4.58622 7.75882 4.32211C7.9273 4.05801 8.02967 3.75721 8.05727 3.44517M12.4995 9.99837C12.4995 11.3791 11.3802 12.4984 9.99951 12.4984C8.6188 12.4984 7.49951 11.3791 7.49951 9.99837C7.49951 8.61766 8.6188 7.49837 9.99951 7.49837C11.3802 7.49837 12.4995 8.61766 12.4995 9.99837Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Figma "battery" — the recorder's top-right status readout.
export const PitchBatteryIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M14.6664 9.33333V6.66667M2.66547 4H10.6661C11.4026 4 11.9996 4.59695 11.9996 5.33333V10.6667C11.9996 11.403 11.4026 12 10.6661 12H2.66547C1.92903 12 1.33203 11.403 1.33203 10.6667V5.33333C1.33203 4.59695 1.92903 4 2.66547 4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Figma "play" — the 28px glyph inside the recorder's 72px white preview
// button. Figma fills AND strokes it with the same dark-green gradient; the
// gradient id is generated per instance (two preview buttons can coexist on
// one page), same reasoning as `CalendarPickerIcon`.
export const PitchPlayIcon = ({ className = '' }) => {
  const gradientId = useId();
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" className={className}>
      <path
        d="M6.14577 4.6647C5.94013 5.02004 5.83191 5.42334 5.83203 5.83387V22.1661C5.83191 22.5767 5.94013 22.98 6.14577 23.3353C6.3514 23.6906 6.64718 23.9854 7.00322 24.1899C7.35926 24.3944 7.76297 24.5014 8.17357 24.5C8.58418 24.4986 8.98715 24.3889 9.3418 24.182L23.3435 16.0159C23.6964 15.8103 23.9892 15.5157 24.1926 15.1616C24.3959 14.8075 24.5028 14.4062 24.5024 13.9978C24.5021 13.5895 24.3945 13.1884 24.1905 12.8346C23.9866 12.4808 23.6933 12.1867 23.34 11.9818L9.3418 3.818C8.98715 3.6111 8.58418 3.50141 8.17357 3.50001C7.76297 3.49862 7.35926 3.60557 7.00322 3.81007C6.64718 4.01456 6.3514 4.30936 6.14577 4.6647Z"
        fill={`url(#${gradientId})`}
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="5.83203"
          y1="3.5"
          x2="26.6877"
          y2="22.0421"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#142916" />
          <stop offset="1" stopColor="#2A5730" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Figma "medal-02" — the 16px glyph beside "Profile strength after
// publishing pitch". Figma exports this asset on a 330.5px-wide strip (the
// render node clips it with a -1965% inset); the real artwork lives inside
// 0-13 on x, so the viewBox is tightened to match rather than reproducing
// the clip hack.
export const PitchMedalIcon = ({ className = '' }) => (
  <svg viewBox="0 0 13 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M0.500031 3.41124C0.500031 3.0428 0.500031 2.85857 0.528624 2.70509C0.655391 2.02468 1.1838 1.49242 1.85929 1.36474C2.01166 1.33594 2.19456 1.33594 2.56035 1.33594H10.4397C10.8055 1.33594 10.9884 1.33594 11.1408 1.36474C11.8162 1.49242 12.3447 2.02468 12.4714 2.70509C12.5 2.85857 12.5 3.0428 12.5 3.41124C12.5 3.77274 12.5 3.95348 12.479 4.12108C12.3873 4.85288 12.0008 5.51448 11.4103 5.95066C11.275 6.05055 11.1182 6.13833 10.8044 6.31388L9.0901 7.2732C7.8241 7.98167 7.19103 8.33594 6.50003 8.33594C5.80903 8.33594 5.17596 7.98167 3.90994 7.2732L2.19562 6.31388C1.8819 6.13833 1.72504 6.05055 1.5898 5.95066C0.999264 5.51448 0.61279 4.85288 0.521044 4.12108C0.50003 3.95348 0.500031 3.77274 0.500031 3.41124Z"
      stroke="currentColor"
      strokeLinecap="round"
    />
    <path
      d="M3.83401 3.33594V4.0026M6.50068 3.33594V5.33594M9.16735 3.33594V4.0026"
      stroke="currentColor"
      strokeLinecap="round"
    />
    <path
      d="M7.0183 9.09731L7.54623 10.1619C7.61823 10.3101 7.81023 10.4522 7.97223 10.4794L8.9291 10.6398C9.54103 10.7426 9.68503 11.1902 9.2441 11.6318L8.50016 12.3818C8.37416 12.5089 8.30516 12.7538 8.34416 12.9293L8.55716 13.8578C8.72516 14.5927 8.33816 14.877 7.69323 14.4929L6.79636 13.9576C6.63436 13.8608 6.36736 13.8608 6.20243 13.9576L5.3055 14.4929C4.66358 14.877 4.27362 14.5897 4.4416 13.8578L4.65458 12.9293C4.69358 12.7538 4.62458 12.5089 4.4986 12.3818L3.75468 11.6318C3.31673 11.1902 3.45772 10.7426 4.06965 10.6398L5.02654 10.4794C5.1855 10.4522 5.3775 10.3101 5.4495 10.1619L5.97743 9.09731C6.26543 8.51965 6.73336 8.51965 7.0183 9.09731Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Figma "20-upload" — the 16px glyph inside the upload drop-zone's 40px
// white tile. Solid fill (not a stroke glyph) in the source asset.
export const PitchDropUploadIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.59303 0.959118C7.82287 0.746961 8.17713 0.746961 8.40697 0.959118L11.007 3.35912C11.2505 3.58388 11.2656 3.96348 11.0409 4.20697C10.8161 4.45046 10.4365 4.46564 10.193 4.24088L8.6 2.77039V9.8C8.6 10.1314 8.33137 10.4 8 10.4C7.66863 10.4 7.4 10.1314 7.4 9.8V2.77039L5.80697 4.24088C5.56348 4.46564 5.18388 4.45046 4.95912 4.20697C4.73436 3.96348 4.74954 3.58388 4.99303 3.35912L7.59303 0.959118ZM1.4 10.4C1.73137 10.4 2 10.6686 2 11V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V11C14 10.6686 14.2686 10.4 14.6 10.4C14.9314 10.4 15.2 10.6686 15.2 11V13C15.2 14.215 14.215 15.2 13 15.2H3C1.78497 15.2 0.8 14.215 0.8 13V11C0.8 10.6686 1.06863 10.4 1.4 10.4Z"
      fill="currentColor"
    />
  </svg>
);

// ---- Talent home · tabs (MyAssessment, Recruiter activity, Search, Edit home) ----

export const ActivityAppliedSuitcaseIcon = ({ className = '' }) => (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M4.99427 1.2H7.00573C7.16022 1.19999 7.30211 1.19998 7.42072 1.20967C7.5486 1.22012 7.68851 1.24403 7.82669 1.31444C8.02426 1.41511 8.18489 1.57574 8.28556 1.77331C8.35597 1.91149 8.37988 2.0514 8.39033 2.17928C8.40002 2.29789 8.40001 2.43977 8.4 2.59426L8.4 3L10.0057 3C10.1602 2.99999 10.3021 2.99998 10.4207 3.00967C10.5486 3.02012 10.6885 3.04403 10.8267 3.11444C11.0243 3.21511 11.1849 3.37574 11.2856 3.57331C11.356 3.71149 11.3799 3.8514 11.3903 3.97928C11.4 4.09789 11.4 4.23977 11.4 4.39426V7.00574C11.4 7.16023 11.4 7.30211 11.3903 7.42072C11.3799 7.5486 11.356 7.68851 11.2856 7.82669C11.1849 8.02426 11.0243 8.18489 10.8267 8.28556C10.8178 8.29009 10.8089 8.29442 10.8 8.29858V9.40574C10.8 9.56023 10.8 9.70211 10.7903 9.82072C10.7799 9.9486 10.756 10.0885 10.6856 10.2267C10.5849 10.4243 10.4243 10.5849 10.2267 10.6856C10.0885 10.756 9.9486 10.7799 9.82072 10.7903C9.70211 10.8 9.56023 10.8 9.40574 10.8H2.59426C2.43977 10.8 2.29789 10.8 2.17928 10.7903C2.0514 10.7799 1.91149 10.756 1.77331 10.6856C1.57574 10.5849 1.41511 10.4243 1.31444 10.2267C1.24403 10.0885 1.22012 9.9486 1.20967 9.82072C1.19998 9.70211 1.19999 9.56022 1.2 9.40573L1.2 8.29858C1.1911 8.29442 1.1822 8.29009 1.17331 8.28556C0.97574 8.18489 0.81511 8.02426 0.714443 7.82669C0.644035 7.68851 0.620117 7.5486 0.609669 7.42072C0.599978 7.30211 0.599988 7.16022 0.599999 7.00573V4.39427C0.599988 4.23978 0.599978 4.09789 0.609669 3.97928C0.620117 3.8514 0.644035 3.71149 0.714443 3.57331C0.81511 3.37574 0.97574 3.21511 1.17331 3.11444C1.31149 3.04403 1.4514 3.02012 1.57928 3.00967C1.69789 2.99998 1.83978 2.99999 1.99427 3C1.9995 3 2.00474 3 2.01 3H3.6L3.6 2.59427C3.59999 2.43978 3.59998 2.29789 3.60967 2.17928C3.62012 2.0514 3.64403 1.91149 3.71444 1.77331C3.81511 1.57574 3.97574 1.41511 4.17331 1.31444C4.31149 1.24403 4.4514 1.22012 4.57928 1.20967C4.69789 1.19998 4.83978 1.19999 4.99427 1.2ZM2.01 3.9C1.83456 3.9 1.73004 3.90035 1.65257 3.90668C1.60528 3.91054 1.58541 3.91564 1.58008 3.91729C1.55329 3.93141 1.53141 3.95329 1.51729 3.98008C1.51564 3.98541 1.51054 4.00528 1.50668 4.05257C1.50035 4.13004 1.5 4.23456 1.5 4.41V6.99C1.5 7.16544 1.50035 7.26996 1.50668 7.34744C1.51054 7.39472 1.51564 7.4146 1.51729 7.41992C1.53141 7.44671 1.55329 7.46859 1.58008 7.48271C1.58541 7.48436 1.60528 7.48946 1.65257 7.49332C1.65936 7.49388 1.66637 7.49439 1.67361 7.49485C1.67654 7.495 1.67946 7.49518 1.68237 7.49539C1.75674 7.49973 1.85607 7.5 2.01 7.5H4.2V7.05C4.2 6.80147 4.40147 6.6 4.65 6.6C4.89853 6.6 5.1 6.80147 5.1 7.05V7.5H6.9V7.05C6.9 6.80147 7.10147 6.6 7.35 6.6C7.59853 6.6 7.8 6.80147 7.8 7.05V7.5H9.99C10.1439 7.5 10.2433 7.49973 10.3176 7.49539C10.3205 7.49518 10.3235 7.495 10.3264 7.49485C10.3336 7.49439 10.3406 7.49388 10.3474 7.49332C10.3947 7.48946 10.4146 7.48436 10.4199 7.48271C10.4467 7.46859 10.4686 7.44671 10.4827 7.41992C10.4844 7.41459 10.4895 7.39472 10.4933 7.34744C10.4997 7.26996 10.5 7.16544 10.5 6.99V4.41C10.5 4.23456 10.4997 4.13004 10.4933 4.05257C10.4895 4.00528 10.4844 3.98541 10.4827 3.98008C10.4686 3.95329 10.4467 3.93141 10.4199 3.91729C10.4146 3.91564 10.3947 3.91054 10.3474 3.90668C10.27 3.90035 10.1654 3.9 9.99 3.9H2.01ZM7.5 3H4.5V2.61C4.5 2.43456 4.50035 2.33004 4.50668 2.25257C4.51054 2.20528 4.51564 2.18541 4.51729 2.18008C4.53141 2.15329 4.55329 2.13141 4.58008 2.11729C4.5854 2.11564 4.60528 2.11054 4.65257 2.10668C4.73004 2.10035 4.83456 2.1 5.01 2.1H6.99C7.16544 2.1 7.26996 2.10035 7.34744 2.10668C7.39472 2.11054 7.4146 2.11564 7.41992 2.11729C7.44671 2.13141 7.46859 2.15329 7.48271 2.18008C7.48436 2.1854 7.48946 2.20528 7.49332 2.25257C7.49965 2.33004 7.5 2.43456 7.5 2.61V3ZM7.48216 2.17853C7.48217 2.17851 7.48229 2.17879 7.48249 2.17941ZM7.42148 2.11784C7.42146 2.11784 7.42114 2.11774 7.42058 2.1175ZM4.57852 2.11784C4.57851 2.11783 4.57879 2.11771 4.57942 2.11751ZM4.51751 2.17942C4.51771 2.17879 4.51783 2.17851 4.51784 2.17852ZM10.4215 3.91784C10.4215 3.91784 10.4211 3.91774 10.4206 3.9175ZM10.4822 3.97853C10.4822 3.97851 10.4823 3.97879 10.4825 3.97942ZM10.4822 7.42148C10.4822 7.42146 10.4823 7.42114 10.4825 7.42057ZM10.4215 7.48216C10.4215 7.48217 10.4212 7.48229 10.4206 7.4825ZM9.9 8.4H7.8V8.55C7.8 8.79853 7.59853 9 7.35 9C7.10147 9 6.9 8.79853 6.9 8.55V8.4H5.1V8.55C5.1 8.79853 4.89853 9 4.65 9C4.40147 9 4.2 8.79853 4.2 8.55V8.4H2.1V9.39C2.1 9.56544 2.10035 9.66996 2.10668 9.74744C2.11054 9.79472 2.11564 9.8146 2.11729 9.81992C2.13141 9.84671 2.15329 9.86859 2.18008 9.88271C2.18541 9.88436 2.20528 9.88946 2.25257 9.89332C2.33004 9.89965 2.43456 9.9 2.61 9.9H9.39C9.56544 9.9 9.66996 9.89965 9.74744 9.89332C9.79472 9.88946 9.8146 9.88436 9.81992 9.88271C9.84671 9.86859 9.86859 9.84671 9.88271 9.81992C9.88436 9.8146 9.88946 9.79472 9.89332 9.74744C9.89965 9.66996 9.9 9.56544 9.9 9.39V8.4ZM9.88217 9.82148C9.88215 9.82148 9.88225 9.82116 9.8825 9.82057ZM9.82148 9.88216C9.82149 9.88217 9.82121 9.88229 9.82059 9.88249ZM2.17853 9.88216C2.17855 9.88216 2.17886 9.88226 2.17942 9.8825ZM2.11751 9.82059C2.11774 9.82114 2.11784 9.82146 2.11784 9.82148ZM1.57852 7.48216C1.57854 7.48216 1.57886 7.48226 1.57941 7.48249ZM1.51751 7.42058C1.51774 7.42114 1.51784 7.42146 1.51784 7.42148ZM1.5175 3.97943C1.51771 3.97879 1.51783 3.97851 1.51784 3.97852ZM1.57943 3.9175C1.57886 3.91774 1.57854 3.91784 1.57852 3.91784Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1D7C4D"
      />
    </g>
  </svg>
);

export const ActivityDateRangeCalendarIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
    <g clipPath="url(#ActivityDateRangeCalendarIcon-clip0_8334_93418)">
      <path
        d="M4.725 0.7C5.01495 0.7 5.25 0.935051 5.25 1.225V2.1H8.75V1.225C8.75 0.935051 8.98505 0.7 9.275 0.7C9.56495 0.7 9.8 0.935051 9.8 1.225V2.1H11.375C12.4381 2.1 13.3 2.96185 13.3 4.025V11.375C13.3 12.4381 12.4381 13.3 11.375 13.3H2.625C1.56185 13.3 0.7 12.4381 0.7 11.375V4.025C0.7 2.96185 1.56185 2.1 2.625 2.1H4.2V1.225C4.2 0.935051 4.43505 0.7 4.725 0.7ZM4.2 3.15H2.625C2.14175 3.15 1.75 3.54175 1.75 4.025V5.6H12.25V4.025C12.25 3.54175 11.8582 3.15 11.375 3.15H9.8V3.675C9.8 3.96495 9.56495 4.2 9.275 4.2C8.98505 4.2 8.75 3.96495 8.75 3.675V3.15H5.25V3.675C5.25 3.96495 5.01495 4.2 4.725 4.2C4.43505 4.2 4.2 3.96495 4.2 3.675V3.15ZM12.25 6.65H1.75V11.375C1.75 11.8582 2.14175 12.25 2.625 12.25H11.375C11.8582 12.25 12.25 11.8582 12.25 11.375V6.65Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
    <defs>
      <clipPath id="ActivityDateRangeCalendarIcon-clip0_8334_93418">
        <rect width="14" height="14" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const ActivityMessageChatIcon = ({ className = '' }) => (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
    <g clipPath="url(#ActivityMessageChatIcon-clip0_8334_93690)">
      <path
        d="M4.8 1.5C2.90076 1.5 1.5 2.77915 1.5 4.2C1.5 4.70301 1.76855 5.28297 2.20085 5.75344L2.20427 5.75716C2.53384 6.11585 2.7852 6.38941 2.96273 6.58922C3.05175 6.68942 3.12578 6.77507 3.18343 6.84601C3.23577 6.91042 3.29299 6.98473 3.33201 7.05611C3.33965 7.07008 3.34747 7.08428 3.35509 7.09811C3.3697 7.12464 3.38356 7.14978 3.39387 7.16928C3.41193 7.20343 3.43291 7.24546 3.45081 7.29633C3.46871 7.34721 3.47866 7.39312 3.48596 7.43105C3.49013 7.45272 3.49507 7.48101 3.50029 7.51085C3.503 7.52639 3.50579 7.54236 3.50858 7.55802C3.52809 7.66751 3.53074 7.78526 3.52775 7.90769C3.73211 7.69168 3.9448 7.47331 4.12329 7.3044C4.21615 7.21652 4.3074 7.13473 4.38747 7.07235C4.42677 7.04174 4.47297 7.00822 4.52166 6.9802L4.52334 6.97923C4.55309 6.96207 4.66071 6.9 4.8 6.9C6.69924 6.9 8.1 5.62085 8.1 4.2C8.1 2.77915 6.69924 1.5 4.8 1.5ZM0.6 4.2C0.6 2.14146 2.5571 0.6 4.8 0.6C7.0429 0.6 9 2.14146 9 4.2C9 6.22165 7.11241 7.74459 4.92029 7.79852C4.87551 7.83501 4.8156 7.88836 4.7419 7.9581C4.57298 8.11795 4.36131 8.33557 4.15076 8.55878C3.94135 8.78078 3.73771 9.00336 3.58611 9.17079C3.5104 9.2544 3.44787 9.32404 3.40434 9.3727L3.35407 9.42902L3.33694 9.44828C3.20929 9.59227 3.00398 9.6394 2.82644 9.56518C2.6489 9.49097 2.5382 9.31207 2.551 9.12007L2.59782 8.41778C2.61284 8.19235 2.62329 8.03478 2.62717 7.91516C2.63116 7.79253 2.62678 7.73972 2.62254 7.71591C2.61788 7.68976 2.6144 7.6698 2.61157 7.65354C2.60769 7.63126 2.60502 7.61591 2.60216 7.60106C2.60174 7.59887 2.60136 7.59695 2.60103 7.59529C2.60025 7.59379 2.59934 7.59205 2.5983 7.59008C2.59123 7.57672 2.5837 7.56307 2.57279 7.54329C2.56488 7.52896 2.5552 7.51141 2.54263 7.48841C2.54335 7.48975 2.54309 7.48937 2.54142 7.487C2.53673 7.48033 2.52096 7.45789 2.48495 7.41357C2.43973 7.35792 2.37591 7.28378 2.28992 7.18699C2.11803 6.99352 1.8718 6.72553 1.53813 6.36238C1.0049 5.78205 0.6 4.99477 0.6 4.2ZM9.96319 4.73822C10.1451 4.5689 10.4299 4.57913 10.5992 4.76106C11.0937 5.29237 11.4 5.97778 11.4 6.73333C11.4 7.34167 11.1333 7.9396 10.7685 8.41117C10.4387 8.83742 10.1941 9.15363 10.0248 9.37826C9.93998 9.49072 9.8767 9.57671 9.83217 9.64017C9.79924 9.6871 9.78374 9.71174 9.77817 9.72058C9.77544 9.72492 9.77511 9.72546 9.77628 9.72295C9.75937 9.75875 9.74375 9.79077 9.73369 9.81141C9.73204 9.8148 9.73054 9.81789 9.7292 9.82063C9.72877 9.82365 9.7283 9.82703 9.72778 9.83076C9.72457 9.8537 9.71956 9.88942 9.71352 9.92901C9.70323 9.99634 9.70871 10.1247 9.7363 10.5443L9.76103 10.9205C9.77369 11.113 9.66222 11.2922 9.48392 11.3659C9.30563 11.4396 9.10019 11.3914 8.97321 11.2462L8.97239 11.2452L8.95874 11.2297L8.91662 11.1818C8.88013 11.1405 8.8277 11.0812 8.7642 11.0101C8.63704 10.8677 8.46631 10.6785 8.29083 10.4898C8.11423 10.2999 7.93748 10.1157 7.79704 9.98093C7.74596 9.93191 7.70357 9.8932 7.67032 9.86467C7.02789 9.84489 6.42497 9.67865 5.90706 9.40002C5.6882 9.28227 5.60623 9.0094 5.72397 8.79053C5.84172 8.57167 6.1146 8.4897 6.33347 8.60744C6.75321 8.83326 7.25586 8.96667 7.8 8.96667C7.93806 8.96667 8.04332 9.02838 8.07011 9.04408L8.07209 9.04524C8.11718 9.07156 8.15898 9.10243 8.19318 9.12945C8.26309 9.18468 8.34164 9.25618 8.42021 9.33157C8.54444 9.4508 8.68782 9.59829 8.83035 9.7493C8.83214 9.73688 8.83363 9.72619 8.83507 9.71586C8.83666 9.70448 8.83818 9.69355 8.83998 9.68122C8.84401 9.65356 8.85076 9.60803 8.8663 9.55712C8.88185 9.5062 8.90169 9.46468 8.9138 9.43948C8.9192 9.42825 8.92404 9.41833 8.92908 9.40802C8.93823 9.38928 8.94801 9.36923 8.96292 9.33766C8.9956 9.26847 9.04842 9.19023 9.09547 9.12319C9.1489 9.04705 9.21947 8.95139 9.30615 8.83643C9.4793 8.60678 9.72734 8.28615 10.0543 7.86352L10.0566 7.86048C10.338 7.49681 10.5 7.08744 10.5 6.73333C10.5 6.2302 10.2977 5.75813 9.94035 5.37421C9.77104 5.19228 9.78126 4.90754 9.96319 4.73822Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
    <defs>
      <clipPath id="ActivityMessageChatIcon-clip0_8334_93690">
        <rect width="12" height="12" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const ActivityShortlistedHeartIcon = ({ className = '' }) => (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M8.10685 2.11479C7.52033 2.18901 6.88927 2.55381 6.38285 3.37366C6.30087 3.50637 6.156 3.58717 6 3.58717C5.84401 3.58717 5.69914 3.50638 5.61715 3.37366C5.11073 2.55383 4.47967 2.18904 3.89315 2.11481C3.29975 2.03972 2.68957 2.25354 2.21079 2.71069C1.26286 3.62419 1.26307 5.16381 2.21142 6.07704L6 9.72528L9.78858 6.07704C10.7369 5.16381 10.7371 3.6242 9.78922 2.7107C9.31043 2.25354 8.70025 2.03971 8.10685 2.11479ZM7.99386 1.22192C8.88437 1.10923 9.75809 1.43616 10.4116 2.06058L10.4129 2.06179C11.7291 3.32923 11.7291 5.45788 10.4129 6.72533L6.31214 10.6741C6.13788 10.842 5.86212 10.842 5.68786 10.6741L1.58715 6.72533C0.270951 5.45788 0.270951 3.32923 1.58715 2.06179L1.58841 2.06058L1.58841 2.06058C2.24192 1.43616 3.11564 1.10924 4.00614 1.22193C4.73208 1.3138 5.4289 1.69227 5.99999 2.36968C6.57109 1.69225 7.26791 1.31378 7.99386 1.22192Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#785910"
      />
    </g>
  </svg>
);

export const ActivityViewedEyeIcon = ({ className = '' }) => (
  <svg viewBox="0 0 12 11.4" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M3.74413 4.16097C3.07169 4.72542 2.54207 5.39832 2.24389 5.81737C2.19532 5.88563 2.17253 5.9182 2.15726 5.94408C2.14772 5.96025 2.14591 5.96594 2.14491 5.96981C2.14479 5.97049 2.14443 5.97265 2.14403 5.97634C2.14334 5.98268 2.14286 5.99086 2.14286 6C2.14286 6.00914 2.14334 6.01732 2.14403 6.02366C2.14442 6.02735 2.14479 6.0295 2.14491 6.03018C2.14591 6.03406 2.14772 6.03975 2.15726 6.05592C2.17253 6.0818 2.19532 6.11437 2.24389 6.18263C2.54207 6.60168 3.07169 7.27458 3.74413 7.83903C4.42253 8.40847 5.19973 8.82857 6 8.82857C6.80027 8.82857 7.57747 8.40847 8.25587 7.83903C8.92831 7.27458 9.45793 6.60168 9.75612 6.18263C9.80468 6.11437 9.82748 6.0818 9.84274 6.05592C9.85228 6.03974 9.85409 6.03406 9.85509 6.03018C9.85521 6.0295 9.85558 6.02735 9.85598 6.02366C9.85666 6.01732 9.85714 6.00914 9.85714 6C9.85714 5.99086 9.85666 5.98268 9.85598 5.97634C9.85558 5.97265 9.85521 5.9705 9.85509 5.96982C9.85409 5.96594 9.85228 5.96026 9.84274 5.94408C9.82748 5.9182 9.80468 5.88563 9.75612 5.81737C9.45793 5.39832 8.92831 4.72542 8.25587 4.16097C7.57747 3.59153 6.80027 3.17143 6 3.17143C5.19973 3.17143 4.42253 3.59153 3.74413 4.16097ZM3.24817 3.57011C3.98495 2.95166 4.93537 2.4 6 2.4C7.06463 2.4 8.01506 2.95166 8.75183 3.57011C9.49457 4.19356 10.0677 4.92467 10.3847 5.37012C10.3899 5.37743 10.3951 5.38479 10.4004 5.39222C10.4766 5.49875 10.5616 5.6176 10.6032 5.78139C10.637 5.91497 10.637 6.08503 10.6032 6.21861C10.5616 6.3824 10.4766 6.50125 10.4004 6.60778C10.3951 6.61521 10.3899 6.62257 10.3847 6.62988C10.0677 7.07533 9.49457 7.80644 8.75183 8.42989C8.01506 9.04834 7.06463 9.6 6 9.6C4.93537 9.6 3.98495 9.04834 3.24817 8.42989C2.50543 7.80644 1.93231 7.07533 1.61534 6.62988C1.61014 6.62257 1.60488 6.61521 1.59957 6.60779C1.52339 6.50125 1.43841 6.3824 1.39685 6.21861C1.36296 6.08503 1.36296 5.91497 1.39685 5.78139C1.43841 5.6176 1.52339 5.49875 1.59957 5.39221C1.60488 5.38479 1.61014 5.37743 1.61534 5.37012C1.93231 4.92467 2.50543 4.19356 3.24817 3.57011ZM6 5.22857C5.57395 5.22857 5.22857 5.57395 5.22857 6C5.22857 6.42605 5.57395 6.77143 6 6.77143C6.42605 6.77143 6.77143 6.42605 6.77143 6C6.77143 5.57395 6.42605 5.22857 6 5.22857ZM4.45714 6C4.45714 5.1479 5.1479 4.45714 6 4.45714C6.8521 4.45714 7.54286 5.1479 7.54286 6C7.54286 6.8521 6.8521 7.54286 6 7.54286C5.1479 7.54286 4.45714 6.8521 4.45714 6Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#595959"
      />
    </g>
  </svg>
);

export const AddCardPersonalityLightbulbIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M3.6 6.3C3.6 3.31766 6.01766 0.9 9 0.9C11.9823 0.9 14.4 3.31766 14.4 6.3V6.74353C14.4 8.5195 13.5124 10.178 12.0347 11.1631C11.8256 11.3025 11.7 11.5372 11.7 11.7885V13.2138C11.7 13.8689 11.1689 14.4 10.5138 14.4H7.48622C6.83109 14.4 6.3 13.8689 6.3 13.2138V11.7885C6.3 11.5372 6.1744 11.3025 5.96528 11.1631C4.48758 10.178 3.6 8.5195 3.6 6.74353V6.3ZM9 2.25C6.76325 2.25 4.95 4.06325 4.95 6.3V6.74353C4.95 8.06813 5.612 9.30508 6.71413 10.0398C7.29881 10.4296 7.65 11.0858 7.65 11.7885V13.05H10.35V11.7885C10.35 11.0858 10.7012 10.4296 11.2859 10.0398C12.388 9.30508 13.05 8.06813 13.05 6.74353V6.3C13.05 4.06325 11.2368 2.25 9 2.25ZM7.2 16.425C7.2 16.0522 7.50221 15.75 7.875 15.75H10.125C10.4978 15.75 10.8 16.0522 10.8 16.425C10.8 16.7978 10.4978 17.1 10.125 17.1H7.875C7.50221 17.1 7.2 16.7978 7.2 16.425Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);

export const AddCardPlusIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M7 2.80034C7.28995 2.80034 7.525 3.03539 7.525 3.32534V6.47543H10.675C10.9649 6.47543 11.2 6.71048 11.2 7.00043C11.2 7.29038 10.9649 7.52543 10.675 7.52543H7.525V10.6753C7.525 10.9653 7.28995 11.2003 7 11.2003C6.71005 11.2003 6.475 10.9653 6.475 10.6753V7.52543H3.325C3.03505 7.52543 2.8 7.29038 2.8 7.00043C2.8 6.71048 3.03505 6.47543 3.325 6.47543H6.475V3.32534C6.475 3.03539 6.71005 2.80034 7 2.80034Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="white"
      />
    </g>
  </svg>
);

export const AddCardProfileCompletenessChartIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M6.075 2.475C6.075 1.60515 6.78015 0.9 7.65 0.9H10.35C11.2198 0.9 11.925 1.60515 11.925 2.475V9H14.625C15.4948 9 16.2 9.70515 16.2 10.575V15.525C16.2 16.3948 15.4948 17.1 14.625 17.1H3.375C2.50515 17.1 1.8 16.3948 1.8 15.525V6.975C1.8 6.10515 2.50515 5.4 3.375 5.4H6.075V2.475ZM6.075 6.75H3.375C3.25074 6.75 3.15 6.85074 3.15 6.975V15.525C3.15 15.6493 3.25074 15.75 3.375 15.75H6.075V6.75ZM7.425 15.75H10.575V2.475C10.575 2.35074 10.4743 2.25 10.35 2.25H7.65C7.52574 2.25 7.425 2.35074 7.425 2.475V15.75ZM11.925 15.75H14.625C14.7493 15.75 14.85 15.6493 14.85 15.525V10.575C14.85 10.4507 14.7493 10.35 14.625 10.35H11.925V15.75Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);

export const AddCardVerifiedSkillsShieldIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M9.22161 2.27308C9.07533 2.24231 8.92467 2.24231 8.77839 2.27308C8.63688 2.30284 8.48883 2.37814 7.94193 2.68856L3.55256 5.17991C3.41019 5.26072 3.32952 5.30684 3.27074 5.34513C3.22618 5.37415 3.21512 5.38559 3.21533 5.38553C3.21537 5.38552 3.21572 5.38519 3.21628 5.38456C3.19325 5.41017 3.17475 5.44176 3.16318 5.47771C3.15774 5.49457 3.15 5.5262 3.15 5.88996V8.71889C3.15 10.7971 4.19406 12.7192 5.89698 13.8066L8.60387 15.535C8.74869 15.6275 8.83131 15.6799 8.89564 15.7155C8.93317 15.7362 8.95071 15.7433 8.95578 15.7451C8.98498 15.7516 9.01502 15.7516 9.04422 15.7451C9.04929 15.7433 9.06683 15.7362 9.10436 15.7155C9.16869 15.6799 9.25131 15.6275 9.39613 15.535L12.103 13.8066C13.8059 12.7192 14.85 10.7971 14.85 8.71889V5.88996C14.85 5.5262 14.8423 5.49457 14.8368 5.47771C14.8252 5.44177 14.8068 5.41017 14.7837 5.38457C14.7803 5.38129 14.7664 5.36932 14.7293 5.34513C14.6705 5.30684 14.5898 5.26072 14.4474 5.17991L10.0581 2.68856C9.51117 2.37814 9.36312 2.30284 9.22161 2.27308ZM9.0426 15.7456C9.04261 15.7456 9.04307 15.7454 9.04393 15.7452ZM8.95739 15.7456C8.95737 15.7456 8.95695 15.7455 8.95607 15.7452ZM8.50053 0.951979C8.83005 0.882674 9.16995 0.882674 9.49947 0.951979C9.87353 1.03065 10.2153 1.22501 10.6473 1.47062C10.6727 1.48507 10.6984 1.4997 10.7245 1.51449L15.1138 4.00585C15.1316 4.01592 15.1495 4.02602 15.1675 4.03618C15.3831 4.1579 15.6127 4.2875 15.7874 4.48175C15.9389 4.65018 16.0526 4.8488 16.1218 5.0638C16.2012 5.31028 16.2006 5.5737 16.2001 5.82746C16.2 5.84837 16.2 5.86921 16.2 5.88996V8.71889C16.2 11.2464 14.9305 13.6029 12.8296 14.9444L10.1227 16.6729C10.1044 16.6846 10.0859 16.6964 10.0674 16.7083C9.85008 16.8479 9.61608 16.9981 9.35115 17.0597C9.12004 17.1134 8.87996 17.1134 8.64885 17.0597C8.38392 16.9981 8.14992 16.8479 7.93263 16.7083C7.91408 16.6964 7.89565 16.6846 7.87733 16.6729L5.17044 14.9444C3.06955 13.6029 1.8 11.2464 1.8 8.71889V5.88996C1.8 5.8692 1.79996 5.84837 1.79991 5.82746C1.79936 5.5737 1.7988 5.31028 1.87819 5.0638C1.94745 4.8488 2.06107 4.65018 2.21257 4.48175C2.38729 4.2875 2.61689 4.1579 2.83254 4.03617C2.85053 4.02602 2.86842 4.01592 2.88618 4.00585L7.27554 1.51449C7.30161 1.4997 7.32733 1.48507 7.35275 1.47062C7.78467 1.22501 8.12647 1.03065 8.50053 0.951979Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);

export const AiValidatedChatBubbleIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
    <g clipPath="url(#AiValidatedChatBubbleIcon-clip0_8334_92830)">
      <path
        d="M8 2.5C4.8346 2.5 2.5 4.63191 2.5 7C2.5 7.83835 2.94759 8.80494 3.66808 9.58907L3.67378 9.59527C4.22307 10.1931 4.642 10.649 4.93787 10.982C5.08625 11.149 5.20964 11.2918 5.30572 11.41C5.39295 11.5174 5.48832 11.6412 5.55335 11.7602C5.56608 11.7835 5.57912 11.8071 5.59181 11.8302C5.61617 11.8744 5.63926 11.9163 5.65645 11.9488C5.68655 12.0057 5.72152 12.0758 5.75135 12.1606C5.78118 12.2453 5.79777 12.3219 5.80993 12.3851C5.81688 12.4212 5.82512 12.4683 5.83381 12.5181C5.83834 12.544 5.84299 12.5706 5.84764 12.5967C5.88016 12.7792 5.88457 12.9754 5.87958 13.1795C6.22019 12.8195 6.57467 12.4555 6.87215 12.174C7.02692 12.0275 7.17901 11.8912 7.31245 11.7873C7.37795 11.7362 7.45495 11.6804 7.5361 11.6337L7.53891 11.632C7.58848 11.6035 7.76786 11.5 8 11.5C11.1654 11.5 13.5 9.36809 13.5 7C13.5 4.63191 11.1654 2.5 8 2.5ZM1 7C1 3.5691 4.26184 1 8 1C11.7382 1 15 3.5691 15 7C15 10.3694 11.854 12.9076 8.20049 12.9975C8.12585 13.0584 8.02599 13.1473 7.90316 13.2635C7.62164 13.5299 7.26885 13.8926 6.91794 14.2646C6.56892 14.6346 6.22951 15.0056 5.97685 15.2846C5.85066 15.424 5.74645 15.5401 5.6739 15.6212L5.59011 15.715L5.56157 15.7471C5.34881 15.9871 5.00664 16.0657 4.71074 15.942C4.41483 15.8183 4.23033 15.5201 4.25166 15.2001L4.32969 14.0296C4.35474 13.6539 4.37214 13.3913 4.37862 13.1919C4.38526 12.9875 4.37797 12.8995 4.3709 12.8598C4.36313 12.8163 4.35734 12.783 4.35262 12.7559C4.34615 12.7188 4.3417 12.6932 4.33694 12.6684C4.33623 12.6648 4.3356 12.6616 4.33504 12.6588C4.33375 12.6563 4.33224 12.6534 4.3305 12.6501C4.31872 12.6279 4.30617 12.6051 4.28798 12.5721C4.27481 12.5483 4.25867 12.519 4.23771 12.4807C4.23892 12.4829 4.23848 12.4823 4.2357 12.4783C4.22789 12.4672 4.2016 12.4298 4.14159 12.356C4.06621 12.2632 3.95985 12.1396 3.81653 11.9783C3.53004 11.6559 3.11967 11.2092 2.56355 10.604C1.67483 9.63675 1 8.32461 1 7ZM16.6053 7.89703C16.9085 7.61484 17.3831 7.63188 17.6653 7.93509C18.4894 8.82061 19 9.96297 19 11.2222C19 12.2361 18.5555 13.2327 17.9475 14.0186C17.3979 14.729 16.9902 15.2561 16.7079 15.6304C16.5666 15.8179 16.4612 15.9612 16.3869 16.067C16.3321 16.1452 16.3062 16.1862 16.297 16.201C16.2924 16.2082 16.2918 16.2091 16.2938 16.2049C16.2656 16.2646 16.2396 16.318 16.2228 16.3523C16.2201 16.358 16.2176 16.3631 16.2153 16.3677C16.2146 16.3727 16.2138 16.3784 16.213 16.3846C16.2076 16.4228 16.1993 16.4824 16.1892 16.5483C16.1721 16.6606 16.1812 16.8744 16.2272 17.5738L16.2684 18.2008C16.2895 18.5217 16.1037 18.8203 15.8065 18.9431C15.5094 19.066 15.167 18.9857 14.9554 18.7436L14.954 18.7421L14.9312 18.7161L14.861 18.6364C14.8002 18.5674 14.7128 18.4687 14.607 18.3502C14.3951 18.1128 14.1105 17.7975 13.8181 17.483C13.5237 17.1666 13.2291 16.8595 12.9951 16.6349C12.9099 16.5532 12.8393 16.4887 12.7839 16.4411C11.7131 16.4081 10.7083 16.1311 9.8451 15.6667C9.48033 15.4705 9.34371 15.0157 9.53996 14.6509C9.7362 14.2861 10.191 14.1495 10.5558 14.3457C11.2554 14.7221 12.0931 14.9444 13 14.9444C13.2301 14.9444 13.4055 15.0473 13.4502 15.0735L13.4535 15.0754C13.5286 15.1193 13.5983 15.1707 13.6553 15.2157C13.7718 15.3078 13.9027 15.427 14.0337 15.5526C14.2407 15.7513 14.4797 15.9971 14.7172 16.2488C14.7202 16.2281 14.7227 16.2103 14.7251 16.1931C14.7278 16.1741 14.7303 16.1559 14.7333 16.1354C14.74 16.0893 14.7513 16.0134 14.7772 15.9285C14.8031 15.8437 14.8361 15.7745 14.8563 15.7325C14.8653 15.7138 14.8734 15.6972 14.8818 15.68C14.897 15.6488 14.9134 15.6154 14.9382 15.5628C14.9927 15.4474 15.0807 15.317 15.1591 15.2053C15.2482 15.0784 15.3658 14.919 15.5102 14.7274C15.7988 14.3446 16.2122 13.8102 16.7571 13.1059L16.761 13.1008C17.2299 12.4947 17.5 11.8124 17.5 11.2222C17.5 10.3837 17.1628 9.59688 16.5673 8.95701C16.2851 8.6538 16.3021 8.17923 16.6053 7.89703Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
    <defs>
      <clipPath id="AiValidatedChatBubbleIcon-clip0_8334_92830">
        <rect width="14" height="14" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const AssessmentDoneCheckIcon = ({ className = '' }) => (
  <svg viewBox="0 0 13 13" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M10.836 3.88532C11.0978 4.09678 11.1386 4.48045 10.9272 4.74227L6.66156 10.0235C6.55049 10.161 6.38517 10.2435 6.20851 10.2496C6.03184 10.2557 5.86124 10.1848 5.74095 10.0553L3.10033 7.21152C2.87132 6.9649 2.8856 6.57933 3.13223 6.35033C3.37885 6.12132 3.76442 6.1356 3.99342 6.38222L6.15542 8.71053L9.97907 3.97648C10.1905 3.71467 10.5742 3.67385 10.836 3.88532Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="white"
      />
    </g>
  </svg>
);

export const AssessmentEvidencedShieldIcon = ({ className = '' }) => (
  <svg viewBox="0 0 13 13" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M6.66006 1.64167C6.5544 1.61944 6.4456 1.61944 6.33995 1.64167C6.23775 1.66316 6.13082 1.71755 5.73584 1.94174L2.56574 3.74105C2.46292 3.79941 2.40465 3.83272 2.3622 3.86037C2.33002 3.88133 2.32203 3.8896 2.32218 3.88955C2.32221 3.88954 2.32246 3.8893 2.32287 3.88885C2.30623 3.90734 2.29288 3.93016 2.28452 3.95612C2.28059 3.9683 2.275 3.99115 2.275 4.25386V6.29697C2.275 7.79787 3.02904 9.1861 4.25893 9.97142L6.21391 11.2197C6.3185 11.2865 6.37817 11.3244 6.42463 11.35C6.45174 11.365 6.46441 11.3701 6.46807 11.3714C6.48915 11.3762 6.51085 11.3762 6.53194 11.3714C6.5356 11.3701 6.54827 11.365 6.57537 11.35C6.62183 11.3244 6.6815 11.2865 6.7861 11.2197L8.74107 9.97142C9.97096 9.18609 10.725 7.79788 10.725 6.29697V4.25386C10.725 3.99115 10.7194 3.9683 10.7155 3.95612C10.7071 3.93017 10.6938 3.90735 10.6771 3.88886C10.6746 3.88649 10.6646 3.87784 10.6378 3.86037C10.5953 3.83272 10.5371 3.79941 10.4343 3.74105L7.26416 1.94174C6.86918 1.71755 6.76225 1.66316 6.66006 1.64167ZM6.53077 11.3718C6.53077 11.3718 6.53111 11.3717 6.53173 11.3715ZM6.46923 11.3718C6.46921 11.3718 6.46891 11.3717 6.46827 11.3715ZM6.13927 0.687541C6.37726 0.637486 6.62274 0.637486 6.86073 0.687541C7.13089 0.744361 7.37774 0.884732 7.68968 1.06211C7.70804 1.07255 7.72662 1.08312 7.74544 1.0938L10.9155 2.89311C10.9284 2.90039 10.9413 2.90768 10.9543 2.91502C11.11 3.00293 11.2758 3.09653 11.402 3.23682C11.5114 3.35846 11.5935 3.50191 11.6435 3.65719C11.7009 3.83521 11.7005 4.02545 11.7001 4.20872C11.7 4.22382 11.7 4.23887 11.7 4.25386V6.29697C11.7 8.12241 10.7831 9.82433 9.2658 10.7932L7.31082 12.0415C7.29759 12.05 7.28427 12.0585 7.27087 12.0671C7.11394 12.1679 6.94495 12.2764 6.75361 12.3209C6.58669 12.3597 6.41331 12.3597 6.24639 12.3209C6.05505 12.2764 5.88605 12.1679 5.72912 12.0671C5.71572 12.0585 5.70241 12.05 5.68918 12.0415L3.7342 10.7932C2.2169 9.82433 1.3 8.12241 1.3 6.29697V4.25386C1.3 4.23887 1.29997 4.22382 1.29994 4.20872C1.29954 4.02545 1.29913 3.83521 1.35647 3.65719C1.40649 3.50191 1.48855 3.35846 1.59797 3.23682C1.72415 3.09653 1.88998 3.00293 2.04573 2.91501C2.05872 2.90768 2.07164 2.90039 2.08446 2.89311L5.25456 1.0938C5.27338 1.08312 5.29196 1.07255 5.31032 1.06211C5.62226 0.884732 5.86912 0.744361 6.13927 0.687541Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="white"
      />
    </g>
  </svg>
);

export const EditBannerDragHandleIcon = ({ className = '' }) => (
  <svg viewBox="0 0 22 22" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M3.575 9.625C4.48627 9.625 5.225 8.88627 5.225 7.975C5.225 7.06373 4.48627 6.325 3.575 6.325C2.66373 6.325 1.925 7.06373 1.925 7.975C1.925 8.88627 2.66373 9.625 3.575 9.625ZM11 9.625C11.9113 9.625 12.65 8.88627 12.65 7.975C12.65 7.06373 11.9113 6.325 11 6.325C10.0887 6.325 9.35 7.06373 9.35 7.975C9.35 8.88627 10.0887 9.625 11 9.625ZM20.075 7.975C20.075 8.88627 19.3363 9.625 18.425 9.625C17.5137 9.625 16.775 8.88627 16.775 7.975C16.775 7.06373 17.5137 6.325 18.425 6.325C19.3363 6.325 20.075 7.06373 20.075 7.975ZM3.575 15.675C4.48627 15.675 5.225 14.9363 5.225 14.025C5.225 13.1137 4.48627 12.375 3.575 12.375C2.66373 12.375 1.925 13.1137 1.925 14.025C1.925 14.9363 2.66373 15.675 3.575 15.675ZM12.65 14.025C12.65 14.9363 11.9113 15.675 11 15.675C10.0887 15.675 9.35 14.9363 9.35 14.025C9.35 13.1137 10.0887 12.375 11 12.375C11.9113 12.375 12.65 13.1137 12.65 14.025ZM18.425 15.675C19.3363 15.675 20.075 14.9363 20.075 14.025C20.075 13.1137 19.3363 12.375 18.425 12.375C17.5137 12.375 16.775 13.1137 16.775 14.025C16.775 14.9363 17.5137 15.675 18.425 15.675Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1C2A21"
      />
    </g>
  </svg>
);

export const EditCardDragHandleIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M2.275 6.125C2.8549 6.125 3.325 5.6549 3.325 5.075C3.325 4.4951 2.8549 4.025 2.275 4.025C1.6951 4.025 1.225 4.4951 1.225 5.075C1.225 5.6549 1.6951 6.125 2.275 6.125ZM7 6.125C7.5799 6.125 8.05 5.6549 8.05 5.075C8.05 4.4951 7.5799 4.025 7 4.025C6.4201 4.025 5.95 4.4951 5.95 5.075C5.95 5.6549 6.4201 6.125 7 6.125ZM12.775 5.075C12.775 5.6549 12.3049 6.125 11.725 6.125C11.1451 6.125 10.675 5.6549 10.675 5.075C10.675 4.4951 11.1451 4.025 11.725 4.025C12.3049 4.025 12.775 4.4951 12.775 5.075ZM2.275 9.975C2.8549 9.975 3.325 9.5049 3.325 8.925C3.325 8.3451 2.8549 7.875 2.275 7.875C1.6951 7.875 1.225 8.3451 1.225 8.925C1.225 9.5049 1.6951 9.975 2.275 9.975ZM8.05 8.925C8.05 9.5049 7.5799 9.975 7 9.975C6.4201 9.975 5.95 9.5049 5.95 8.925C5.95 8.3451 6.4201 7.875 7 7.875C7.5799 7.875 8.05 8.3451 8.05 8.925ZM11.725 9.975C12.3049 9.975 12.775 9.5049 12.775 8.925C12.775 8.3451 12.3049 7.875 11.725 7.875C11.1451 7.875 10.675 8.3451 10.675 8.925C10.675 9.5049 11.1451 9.975 11.725 9.975Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1C2A21"
      />
    </g>
  </svg>
);

export const EditCardHideEyeOffIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M0.806527 2.30797C0.981615 2.07686 1.31091 2.03144 1.54203 2.20653L13.092 10.9565C13.3231 11.1316 13.3686 11.4609 13.1935 11.692C13.0184 11.9231 12.6891 11.9686 12.458 11.7935L10.5867 10.3758C9.61515 11.1913 8.38009 11.9 7 11.9C5.5759 11.9 4.30773 11.1451 3.32807 10.3035C2.33964 9.45429 1.57724 8.4588 1.15582 7.85264C1.14896 7.84277 1.14202 7.83284 1.13503 7.82284C1.03342 7.67738 0.920907 7.5163 0.865986 7.29477C0.821352 7.11473 0.821352 6.88527 0.865986 6.70524C0.920906 6.4837 1.03342 6.32262 1.13503 6.17716C1.14202 6.16716 1.14895 6.15723 1.15582 6.14736C1.47283 5.69139 1.98147 5.01703 2.63302 4.35033L0.907975 3.04347C0.676858 2.86838 0.631438 2.53909 0.806527 2.30797ZM3.47725 4.98989C2.83677 5.62947 2.33092 6.29655 2.01793 6.74674C1.95337 6.8396 1.92302 6.88398 1.90266 6.91931C1.88942 6.94229 1.88704 6.95028 1.88548 6.9565C1.88548 6.9565 1.88475 6.96061 1.88413 6.96652C1.88318 6.97559 1.88251 6.98715 1.88251 7C1.88251 7.01285 1.88318 7.02441 1.88413 7.03348C1.88475 7.03939 1.88548 7.0435 1.88548 7.0435C1.88704 7.04972 1.88942 7.05771 1.90266 7.08069C1.92302 7.11602 1.95337 7.1604 2.01793 7.25327C2.41458 7.82379 3.11871 8.73932 4.0123 9.50701C4.91465 10.2822 5.94401 10.85 7 10.85C7.95738 10.85 8.89138 10.3832 9.72547 9.72339L8.30373 8.64632C7.94583 8.93002 7.49272 9.1 7 9.1C5.8402 9.1 4.9 8.1598 4.9 7C4.9 6.71341 4.95764 6.43974 5.0619 6.19039L3.47725 4.98989ZM5.95802 6.86926C5.95273 6.91206 5.95 6.95568 5.95 7C5.95 7.5799 6.4201 8.05 7 8.05C7.14474 8.05 7.28263 8.02082 7.40814 7.96784L5.95802 6.86926ZM7 3.15C6.57657 3.15 6.15692 3.24087 5.74497 3.40216C5.47498 3.50788 5.17041 3.3747 5.06469 3.10471C4.95898 2.83472 5.09215 2.53015 5.36214 2.42444C5.87472 2.22374 6.42444 2.1 7 2.1C8.4241 2.1 9.69227 2.85491 10.6719 3.69654C11.6604 4.54571 12.4228 5.5412 12.8442 6.14736C12.851 6.15723 12.858 6.16716 12.865 6.17716C12.9666 6.32262 13.0791 6.4837 13.134 6.70523C13.1787 6.88527 13.1787 7.11473 13.134 7.29477C13.0791 7.5163 12.9666 7.67739 12.865 7.82284C12.858 7.83284 12.851 7.84277 12.8442 7.85264C12.7657 7.96555 12.6758 8.09132 12.5753 8.22663C12.4024 8.45937 12.0735 8.50787 11.8408 8.33495C11.608 8.16202 11.5595 7.83317 11.7324 7.60043C11.8259 7.4746 11.9094 7.35782 11.9821 7.25327C12.0466 7.16041 12.077 7.11602 12.0973 7.08069C12.1106 7.0577 12.113 7.04971 12.1145 7.04349C12.1145 7.04349 12.1152 7.03937 12.1159 7.03348C12.1168 7.02441 12.1175 7.01285 12.1175 7C12.1175 6.98715 12.1168 6.97559 12.1159 6.96652C12.1152 6.96061 12.1145 6.9565 12.1145 6.9565C12.113 6.95028 12.1106 6.94229 12.0973 6.91931C12.077 6.88398 12.0466 6.8396 11.9821 6.74673C11.5854 6.17621 10.8813 5.26068 9.98771 4.49299C9.08535 3.71777 8.056 3.15 7 3.15Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1C2A21"
      />
    </g>
  </svg>
);

export const EditCardShowEyeIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 13.3" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M4.36816 4.85447C3.58364 5.51299 2.96575 6.29804 2.61787 6.78694C2.56121 6.86656 2.53461 6.90457 2.5168 6.93476C2.50568 6.95363 2.50356 6.96026 2.5024 6.96478C2.50226 6.96558 2.50183 6.96809 2.50137 6.9724C2.50057 6.97979 2.5 6.98934 2.5 7C2.5 7.01066 2.50057 7.02021 2.50137 7.0276C2.50183 7.03191 2.50226 7.03442 2.5024 7.03522C2.50356 7.03974 2.50568 7.04637 2.5168 7.06524C2.53461 7.09543 2.56121 7.13344 2.61787 7.21306C2.96575 7.70196 3.58364 8.48701 4.36816 9.14553C5.15962 9.80988 6.06635 10.3 7 10.3C7.93365 10.3 8.84038 9.80988 9.63185 9.14553C10.4164 8.48701 11.0343 7.70196 11.3821 7.21306C11.4388 7.13344 11.4654 7.09543 11.4832 7.06524C11.4943 7.04637 11.4964 7.03974 11.4976 7.03521C11.4977 7.03442 11.4982 7.03191 11.4986 7.0276C11.4994 7.02021 11.5 7.01066 11.5 7C11.5 6.98934 11.4994 6.97979 11.4986 6.9724C11.4982 6.96809 11.4977 6.96558 11.4976 6.96479C11.4964 6.96026 11.4943 6.95363 11.4832 6.93476C11.4654 6.90457 11.4388 6.86656 11.3821 6.78694C11.0343 6.29804 10.4164 5.51299 9.63185 4.85447C8.84038 4.19012 7.93365 3.7 7 3.7C6.06635 3.7 5.15962 4.19012 4.36816 4.85447ZM3.78953 4.16513C4.6491 3.44361 5.75793 2.8 7 2.8C8.24207 2.8 9.3509 3.44361 10.2105 4.16513C11.077 4.89248 11.7456 5.74545 12.1154 6.26514C12.1215 6.27367 12.1276 6.28226 12.1338 6.29092C12.2227 6.41521 12.3219 6.55387 12.3703 6.74495C12.4099 6.90079 12.4099 7.09921 12.3703 7.25505C12.3219 7.44613 12.2227 7.58479 12.1338 7.70908C12.1276 7.71774 12.1215 7.72633 12.1154 7.73486C11.7456 8.25455 11.077 9.10752 10.2105 9.83487C9.3509 10.5564 8.24207 11.2 7 11.2C5.75793 11.2 4.6491 10.5564 3.78953 9.83487C2.923 9.10752 2.25436 8.25455 1.88457 7.73486C1.8785 7.72633 1.87236 7.71774 1.86617 7.70908C1.77729 7.58479 1.67814 7.44613 1.62966 7.25505C1.59012 7.09921 1.59012 6.90079 1.62966 6.74495C1.67814 6.55387 1.77729 6.41521 1.86617 6.29092C1.87236 6.28226 1.8785 6.27367 1.88457 6.26514C2.25436 5.74545 2.923 4.89248 3.78953 4.16513ZM7 6.1C6.50294 6.1 6.1 6.50294 6.1 7C6.1 7.49706 6.50294 7.9 7 7.9C7.49706 7.9 7.9 7.49706 7.9 7C7.9 6.50294 7.49706 6.1 7 6.1ZM5.2 7C5.2 6.00589 6.00589 5.2 7 5.2C7.99411 5.2 8.8 6.00589 8.8 7C8.8 7.99411 7.99411 8.8 7 8.8C6.00589 8.8 5.2 7.99411 5.2 7Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1C2A21"
      />
    </g>
  </svg>
);

export const GameEvidencedControllerIcon = ({ className = '' }) => (
  <svg viewBox="0 0 13 13" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M1.08333 7.49306C1.08333 5.71233 1.08333 4.82198 1.57514 4.22271C1.66518 4.113 1.76577 4.0124 1.87548 3.92237C2.47476 3.43056 3.36511 3.43056 5.14583 3.43056H7.85417C9.6349 3.43056 10.5252 3.43056 11.1245 3.92237C11.2342 4.0124 11.3348 4.113 11.4248 4.22271C11.9167 4.82198 11.9167 5.71233 11.9167 7.49306C11.9167 9.27378 11.9167 10.1641 11.4248 10.7634C11.3348 10.8731 11.2342 10.9737 11.1245 11.0637C10.5252 11.5556 9.6349 11.5556 7.85417 11.5556H5.14583C3.36511 11.5556 2.47476 11.5556 1.87548 11.0637C1.76577 10.9737 1.66518 10.8731 1.57514 10.7634C1.08333 10.1641 1.08333 9.27378 1.08333 7.49306Z"
        strokeWidth="0.722222"
        strokeLinecap="round"
        stroke="#1D7C4D"
      />
      <path
        d="M6.5 3.43056V2.34722C6.5 2.04807 6.7425 1.80556 7.04167 1.80556C7.34083 1.80556 7.58333 1.56304 7.58333 1.26389V0.722222"
        strokeWidth="0.722222"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1D7C4D"
      />
      <path
        d="M5.41667 8.30556L4.60417 7.49306M4.60417 7.49306L3.79167 6.68056M4.60417 7.49306L3.79167 8.30556M4.60417 7.49306L5.41667 6.68056"
        strokeWidth="0.722222"
        strokeLinecap="round"
        stroke="#1D7C4D"
      />
      <path
        d="M9.20833 8.03472V6.95139"
        strokeWidth="0.722222"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1D7C4D"
      />
    </g>
  </svg>
);

export const HomeTabAssessmentClipboardActiveIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16.2 16.2" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M6.075 1.35H10.125C10.4978 1.35 10.8 1.65221 10.8 2.025V3.375C10.8 3.74779 10.4978 4.05 10.125 4.05H6.075C5.70221 4.05 5.4 3.74779 5.4 3.375V2.025C5.4 1.65221 5.70221 1.35 6.075 1.35Z"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#387440"
      />
      <path
        d="M10.8 2.7H12.15C12.508 2.7 12.8514 2.84223 13.1046 3.09541C13.3578 3.34858 13.5 3.69196 13.5 4.05V13.5C13.5 13.858 13.3578 14.2014 13.1046 14.4546C12.8514 14.7078 12.508 14.85 12.15 14.85H4.05C3.69196 14.85 3.34858 14.7078 3.09541 14.4546C2.84223 14.2014 2.7 13.858 2.7 13.5V4.05C2.7 3.69196 2.84223 3.34858 3.09541 3.09541C3.34858 2.84223 3.69196 2.7 4.05 2.7H5.4"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#387440"
      />
      <path
        d="M8.1 7.425H10.8"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#387440"
      />
      <path
        d="M8.1 10.8H10.8"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#387440"
      />
      <path
        d="M5.4 7.425H5.40675"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#387440"
      />
      <path
        d="M5.4 10.8H5.40675"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#387440"
      />
    </g>
  </svg>
);

export const HomeTabAssessmentClipboardIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16.2 16.2" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M6.075 1.35H10.125C10.4978 1.35 10.8 1.65221 10.8 2.025V3.375C10.8 3.74779 10.4978 4.05 10.125 4.05H6.075C5.70221 4.05 5.4 3.74779 5.4 3.375V2.025C5.4 1.65221 5.70221 1.35 6.075 1.35Z"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#595959"
      />
      <path
        d="M10.8 2.7H12.15C12.508 2.7 12.8514 2.84223 13.1046 3.09541C13.3578 3.34858 13.5 3.69196 13.5 4.05V13.5C13.5 13.858 13.3578 14.2014 13.1046 14.4546C12.8514 14.7078 12.508 14.85 12.15 14.85H4.05C3.69196 14.85 3.34858 14.7078 3.09541 14.4546C2.84223 14.2014 2.7 13.858 2.7 13.5V4.05C2.7 3.69196 2.84223 3.34858 3.09541 3.09541C3.34858 2.84223 3.69196 2.7 4.05 2.7H5.4"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#595959"
      />
      <path
        d="M8.1 7.425H10.8"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#595959"
      />
      <path
        d="M8.1 10.8H10.8"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#595959"
      />
      <path
        d="M5.4 7.425H5.40675"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#595959"
      />
      <path
        d="M5.4 10.8H5.40675"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#595959"
      />
    </g>
  </svg>
);

export const HomeTabHouseIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M2.25 6.75L9 1.5L15.75 6.75V15C15.75 15.3978 15.592 15.7794 15.3107 16.0607C15.0294 16.342 14.6478 16.5 14.25 16.5H3.75C3.35218 16.5 2.97064 16.342 2.68934 16.0607C2.40804 15.7794 2.25 15.3978 2.25 15V6.75Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#595959"
      />
      <path
        d="M6.75 16.5V9H11.25V16.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#595959"
      />
    </g>
  </svg>
);

export const HomeTabRecruiterEyeActiveIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 17.1" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M5.6162 6.24146C4.60753 7.08813 3.8131 8.09748 3.36583 8.72606C3.29298 8.82844 3.25879 8.8773 3.23589 8.91613C3.22158 8.94038 3.21887 8.94891 3.21737 8.95472C3.21719 8.95574 3.21664 8.95897 3.21604 8.96451C3.21502 8.97402 3.21429 8.98629 3.21429 9C3.21429 9.01371 3.21502 9.02598 3.21604 9.03549C3.21664 9.04103 3.21719 9.04426 3.21737 9.04528C3.21887 9.05109 3.22158 9.05962 3.23589 9.08387C3.25879 9.1227 3.29298 9.17156 3.36583 9.27394C3.8131 9.90252 4.60753 10.9119 5.6162 11.7585C6.6338 12.6127 7.79959 13.2429 9 13.2429C10.2004 13.2429 11.3662 12.6127 12.3838 11.7585C13.3925 10.9119 14.1869 9.90252 14.6342 9.27394C14.707 9.17156 14.7412 9.1227 14.7641 9.08387C14.7784 9.05962 14.7811 9.05109 14.7826 9.04527C14.7828 9.04425 14.7834 9.04102 14.784 9.03549C14.785 9.02598 14.7857 9.01371 14.7857 9C14.7857 8.98629 14.785 8.97402 14.784 8.96451C14.7834 8.95897 14.7828 8.95575 14.7826 8.95473C14.7811 8.94891 14.7784 8.94038 14.7641 8.91613C14.7412 8.8773 14.707 8.82844 14.6342 8.72606C14.1869 8.09748 13.3925 7.08813 12.3838 6.24146C11.3662 5.38729 10.2004 4.75714 9 4.75714C7.79959 4.75714 6.6338 5.38729 5.6162 6.24146ZM4.87225 5.35517C5.97742 4.4275 7.40306 3.6 9 3.6C10.5969 3.6 12.0226 4.4275 13.1277 5.35517C14.2419 6.29034 15.1015 7.38701 15.577 8.05518C15.5848 8.06615 15.5927 8.07719 15.6006 8.08832C15.7149 8.24813 15.8424 8.4264 15.9047 8.67208C15.9556 8.87245 15.9556 9.12755 15.9047 9.32792C15.8424 9.5736 15.7149 9.75187 15.6006 9.91168C15.5927 9.92281 15.5848 9.93385 15.577 9.94482C15.1015 10.613 14.2419 11.7097 13.1277 12.6448C12.0226 13.5725 10.5969 14.4 9 14.4C7.40306 14.4 5.97742 13.5725 4.87225 12.6448C3.75815 11.7097 2.89847 10.613 2.42301 9.94482C2.41521 9.93385 2.40732 9.92281 2.39936 9.91168C2.28509 9.75188 2.15761 9.5736 2.09527 9.32792C2.04443 9.12755 2.04443 8.87245 2.09527 8.67208C2.15761 8.4264 2.28509 8.24812 2.39936 8.08832C2.40732 8.07719 2.41521 8.06615 2.42301 8.05518C2.89847 7.38701 3.75815 6.29034 4.87225 5.35517ZM9 7.84286C8.36093 7.84286 7.84286 8.36093 7.84286 9C7.84286 9.63907 8.36093 10.1571 9 10.1571C9.63907 10.1571 10.1571 9.63907 10.1571 9C10.1571 8.36093 9.63907 7.84286 9 7.84286ZM6.68572 9C6.68572 7.72186 7.72186 6.68571 9 6.68571C10.2781 6.68571 11.3143 7.72186 11.3143 9C11.3143 10.2781 10.2781 11.3143 9 11.3143C7.72186 11.3143 6.68572 10.2781 6.68572 9Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);

export const HomeTabRecruiterEyeIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 17.1" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M5.6162 6.24146C4.60753 7.08813 3.8131 8.09748 3.36583 8.72606C3.29298 8.82844 3.25879 8.8773 3.23589 8.91613C3.22158 8.94038 3.21887 8.94891 3.21737 8.95472C3.21719 8.95574 3.21664 8.95897 3.21604 8.96451C3.21502 8.97402 3.21429 8.98629 3.21429 9C3.21429 9.01371 3.21502 9.02598 3.21604 9.03549C3.21664 9.04103 3.21719 9.04426 3.21737 9.04528C3.21887 9.05109 3.22158 9.05962 3.23589 9.08387C3.25879 9.1227 3.29298 9.17156 3.36583 9.27394C3.8131 9.90252 4.60753 10.9119 5.6162 11.7585C6.6338 12.6127 7.79959 13.2429 9 13.2429C10.2004 13.2429 11.3662 12.6127 12.3838 11.7585C13.3925 10.9119 14.1869 9.90252 14.6342 9.27394C14.707 9.17156 14.7412 9.1227 14.7641 9.08387C14.7784 9.05962 14.7811 9.05109 14.7826 9.04527C14.7828 9.04425 14.7834 9.04102 14.784 9.03549C14.785 9.02598 14.7857 9.01371 14.7857 9C14.7857 8.98629 14.785 8.97402 14.784 8.96451C14.7834 8.95897 14.7828 8.95575 14.7826 8.95473C14.7811 8.94891 14.7784 8.94038 14.7641 8.91613C14.7412 8.8773 14.707 8.82844 14.6342 8.72606C14.1869 8.09748 13.3925 7.08813 12.3838 6.24146C11.3662 5.38729 10.2004 4.75714 9 4.75714C7.79959 4.75714 6.6338 5.38729 5.6162 6.24146ZM4.87225 5.35517C5.97742 4.4275 7.40306 3.6 9 3.6C10.5969 3.6 12.0226 4.4275 13.1277 5.35517C14.2419 6.29034 15.1015 7.38701 15.577 8.05518C15.5848 8.06615 15.5927 8.07719 15.6006 8.08832C15.7149 8.24813 15.8424 8.4264 15.9047 8.67208C15.9556 8.87245 15.9556 9.12755 15.9047 9.32792C15.8424 9.5736 15.7149 9.75187 15.6006 9.91168C15.5927 9.92281 15.5848 9.93385 15.577 9.94482C15.1015 10.613 14.2419 11.7097 13.1277 12.6448C12.0226 13.5725 10.5969 14.4 9 14.4C7.40306 14.4 5.97742 13.5725 4.87225 12.6448C3.75815 11.7097 2.89847 10.613 2.42301 9.94482C2.41521 9.93385 2.40732 9.92281 2.39936 9.91168C2.28509 9.75188 2.15761 9.5736 2.09527 9.32792C2.04443 9.12755 2.04443 8.87245 2.09527 8.67208C2.15761 8.4264 2.28509 8.24812 2.39936 8.08832C2.40732 8.07719 2.41521 8.06615 2.42301 8.05518C2.89847 7.38701 3.75815 6.29034 4.87225 5.35517ZM9 7.84286C8.36093 7.84286 7.84286 8.36093 7.84286 9C7.84286 9.63907 8.36093 10.1571 9 10.1571C9.63907 10.1571 10.1571 9.63907 10.1571 9C10.1571 8.36093 9.63907 7.84286 9 7.84286ZM6.68572 9C6.68572 7.72186 7.72186 6.68571 9 6.68571C10.2781 6.68571 11.3143 7.72186 11.3143 9C11.3143 10.2781 10.2781 11.3143 9 11.3143C7.72186 11.3143 6.68572 10.2781 6.68572 9Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#595959"
      />
    </g>
  </svg>
);

export const NextAssessmentBarChartIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M8.1 3.3C8.1 2.1402 9.0402 1.2 10.2 1.2H13.8C14.9598 1.2 15.9 2.1402 15.9 3.3V12H19.5C20.6598 12 21.6 12.9402 21.6 14.1V20.7C21.6 21.8598 20.6598 22.8 19.5 22.8H4.5C3.3402 22.8 2.4 21.8598 2.4 20.7V9.3C2.4 8.1402 3.3402 7.2 4.5 7.2H8.1V3.3ZM8.1 9H4.5C4.33431 9 4.2 9.13432 4.2 9.3V20.7C4.2 20.8657 4.33432 21 4.5 21H8.1V9ZM9.9 21H14.1V3.3C14.1 3.13432 13.9657 3 13.8 3H10.2C10.0343 3 9.9 3.13431 9.9 3.3V21ZM15.9 21H19.5C19.6657 21 19.8 20.8657 19.8 20.7V14.1C19.8 13.9343 19.6657 13.8 19.5 13.8H15.9V21Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#785910"
      />
    </g>
  </svg>
);

export const PersonalityLightbulbIcon = ({ className = '' }) => (
  <svg viewBox="0 0 17 17" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M3.4 5.95C3.4 3.13335 5.68335 0.85 8.5 0.85C11.3167 0.85 13.6 3.13335 13.6 5.95V6.36889C13.6 8.0462 12.7617 9.61253 11.3661 10.5429C11.1686 10.6746 11.05 10.8963 11.05 11.1336V12.4797C11.05 13.0984 10.5484 13.6 9.92968 13.6H7.07032C6.45158 13.6 5.95 13.0984 5.95 12.4797V11.1336C5.95 10.8963 5.83137 10.6746 5.63388 10.5429C4.23827 9.61253 3.4 8.0462 3.4 6.36889V5.95ZM8.5 2.125C6.38751 2.125 4.675 3.83751 4.675 5.95V6.36889C4.675 7.6199 5.30022 8.78813 6.34112 9.48207C6.89332 9.8502 7.225 10.47 7.225 11.1336V12.325H9.775V11.1336C9.775 10.47 10.1067 9.8502 10.6589 9.48207C11.6998 8.78813 12.325 7.6199 12.325 6.36889V5.95C12.325 3.83751 10.6125 2.125 8.5 2.125ZM6.8 15.5125C6.8 15.1604 7.08542 14.875 7.4375 14.875H9.5625C9.91458 14.875 10.2 15.1604 10.2 15.5125C10.2 15.8646 9.91458 16.15 9.5625 16.15H7.4375C7.08542 16.15 6.8 15.8646 6.8 15.5125Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);

export const PersonalityTypeCompassIcon = ({ className = '' }) => (
  <svg viewBox="0 0 38 38" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M19 4.75C11.1299 4.75 4.75 11.1299 4.75 19C4.75 26.8701 11.1299 33.25 19 33.25C26.8701 33.25 33.25 26.8701 33.25 19C33.25 11.1299 26.8701 4.75 19 4.75ZM1.9 19C1.9 9.55593 9.55593 1.9 19 1.9C28.4441 1.9 36.1 9.55593 36.1 19C36.1 28.4441 28.4441 36.1 19 36.1C9.55593 36.1 1.9 28.4441 1.9 19ZM28.0826 9.91737C28.4559 10.2906 28.5922 10.8396 28.437 11.3441L25.5836 20.6176C25.5661 20.6744 25.5489 20.7306 25.5318 20.7861C25.237 21.7467 25.0052 22.502 24.5745 23.1444C24.1955 23.7097 23.7097 24.1955 23.1444 24.5745C22.502 25.0052 21.7467 25.237 20.7861 25.5318C20.7306 25.5489 20.6744 25.5661 20.6176 25.5836L11.3441 28.437C10.8396 28.5922 10.2906 28.4559 9.91737 28.0826C9.54414 27.7094 9.40779 27.1604 9.56302 26.6559L12.4164 17.3824C12.4339 17.3256 12.4511 17.2694 12.4682 17.214C12.763 16.2533 12.9948 15.498 13.4255 14.8556C13.8045 14.2903 14.2903 13.8045 14.8556 13.4255C15.498 12.9948 16.2533 12.763 17.214 12.4682C17.2694 12.4511 17.3256 12.4339 17.3824 12.4164L26.6559 9.56302C27.1604 9.40779 27.7094 9.54414 28.0826 9.91737ZM24.9214 13.0786L18.2206 15.1404C17.0114 15.5124 16.6918 15.6256 16.4427 15.7927C16.1858 15.965 15.965 16.1858 15.7927 16.4427C15.6256 16.6918 15.5124 17.0114 15.1404 18.2206L13.0786 24.9214L19.7794 22.8596C20.9886 22.4876 21.3082 22.3744 21.5573 22.2073C21.8142 22.035 22.035 21.8142 22.2073 21.5573C22.3744 21.3082 22.4876 20.9886 22.8596 19.7794L24.9214 13.0786Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="white"
      />
    </g>
  </svg>
);

export const PlayfulAssessmentDoneCheckIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M11.7213 3.16654C12.0435 3.42681 12.0937 3.89902 11.8335 4.22125L6.58346 10.7213C6.44675 10.8905 6.24329 10.9921 6.02586 10.9996C5.80842 11.0071 5.59845 10.9198 5.4504 10.7603L2.2004 7.26034C1.91855 6.9568 1.93613 6.48226 2.23966 6.2004C2.54319 5.91855 3.01774 5.93613 3.2996 6.23966L5.96051 9.10526L10.6665 3.27875C10.9268 2.95651 11.399 2.90628 11.7213 3.16654Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
      />
    </g>
  </svg>
);

export const PlayfulAssessmentEvidencedShieldIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M7.17237 1.76795C7.05859 1.74402 6.94141 1.74402 6.82763 1.76795C6.71758 1.7911 6.60242 1.84967 6.17706 2.0911L2.7631 4.02882C2.65237 4.09167 2.58963 4.12754 2.54391 4.15732C2.50925 4.1799 2.50065 4.1888 2.50081 4.18874C2.50084 4.18874 2.50111 4.18848 2.50155 4.18799C2.48364 4.20791 2.46925 4.23248 2.46025 4.26044C2.45602 4.27355 2.45 4.29816 2.45 4.58108V6.78136C2.45 8.39771 3.26204 9.89272 4.58654 10.7385L6.6919 12.0828C6.80454 12.1547 6.8688 12.1955 6.91883 12.2231C6.94802 12.2393 6.96167 12.2448 6.96561 12.2462C6.98832 12.2513 7.01168 12.2513 7.03439 12.2462C7.03833 12.2448 7.05198 12.2393 7.08117 12.2231C7.1312 12.1955 7.19546 12.1547 7.3081 12.0828L9.41346 10.7385C10.738 9.89272 11.55 8.39771 11.55 6.78136V4.58108C11.55 4.29816 11.544 4.27355 11.5398 4.26044C11.5307 4.23249 11.5164 4.20791 11.4985 4.188C11.4958 4.18545 11.485 4.17613 11.4561 4.15732C11.4104 4.12754 11.3476 4.09167 11.2369 4.02882L7.82294 2.0911C7.39758 1.84967 7.28242 1.7911 7.17237 1.76795ZM7.03314 12.2466C7.03314 12.2465 7.0335 12.2464 7.03417 12.2462ZM6.96686 12.2466C6.96685 12.2466 6.96652 12.2465 6.96583 12.2462ZM6.61152 0.740428C6.86781 0.686524 7.13219 0.686524 7.38848 0.740428C7.67941 0.801619 7.94526 0.952788 8.2812 1.14382C8.30096 1.15505 8.32097 1.16643 8.34124 1.17794L11.7552 3.11566C11.769 3.1235 11.7829 3.13135 11.7969 3.13925C11.9646 3.23392 12.1432 3.33473 12.2791 3.48581C12.3969 3.6168 12.4853 3.77129 12.5392 3.93851C12.6009 4.13022 12.6005 4.3351 12.6001 4.53247C12.6 4.54873 12.6 4.56494 12.6 4.58108V6.78136C12.6 8.74721 11.6126 10.58 9.97855 11.6234L7.87319 12.9678C7.85894 12.9769 7.8446 12.9861 7.83017 12.9954C7.66117 13.1039 7.47917 13.2208 7.27312 13.2687C7.09336 13.3104 6.90664 13.3104 6.72688 13.2687C6.52082 13.2208 6.33883 13.1039 6.16983 12.9954C6.15539 12.9861 6.14106 12.9769 6.12681 12.9678L4.02145 11.6234C2.38743 10.58 1.4 8.74721 1.4 6.78136V4.58108C1.4 4.56494 1.39997 4.54873 1.39993 4.53247C1.39951 4.3351 1.39906 4.13022 1.46082 3.93851C1.51468 3.77129 1.60306 3.6168 1.72089 3.48581C1.85678 3.33472 2.03536 3.23392 2.20309 3.13925C2.21708 3.13135 2.231 3.12349 2.2448 3.11566L5.65876 1.17794C5.67903 1.16643 5.69904 1.15505 5.7188 1.14381C6.05474 0.952788 6.32059 0.801619 6.61152 0.740428Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
      />
    </g>
  </svg>
);

export const PlayfulSelfReportedPencilIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
    <g clipPath="url(#PlayfulSelfReportedPencilIcon-clip0_8334_97641)">
      <path
        d="M9.02387 1.43367C9.49363 0.963908 10.1308 0.7 10.7951 0.7C12.1785 0.7 13.3 1.82148 13.3 3.2049C13.3 3.86924 13.0361 4.50637 12.5663 4.97613L4.39623 13.1462C4.29777 13.2447 4.16424 13.3 4.025 13.3H1.225C0.935051 13.3 0.7 13.065 0.7 12.775V9.975C0.7 9.83576 0.755312 9.70223 0.853769 9.60377L9.02387 1.43367ZM10.7951 1.75C10.4092 1.75 10.0392 1.90328 9.76633 2.17613L9.49246 2.45L11.55 4.50754L11.8239 4.23367C12.0967 3.96082 12.25 3.59076 12.25 3.2049C12.25 2.40138 11.5986 1.75 10.7951 1.75ZM10.8075 5.25L8.75 3.19246L1.75 10.1925V12.25H3.80754L10.8075 5.25Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
    <defs>
      <clipPath id="PlayfulSelfReportedPencilIcon-clip0_8334_97641">
        <rect width="14" height="14" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const RecruiterVerifiedCheckIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
    <g clipPath="url(#RecruiterVerifiedCheckIcon-clip0_8334_93660)">
      <path
        d="M7 0.7C3.52061 0.7 0.7 3.52061 0.7 7C0.7 10.4794 3.52061 13.3 7 13.3C10.4794 13.3 13.3 10.4794 13.3 7C13.3 3.52061 10.4794 0.7 7 0.7ZM9.69042 5.39601C9.86771 5.16658 9.82544 4.83686 9.59601 4.65958C9.36658 4.48229 9.03686 4.52456 8.85958 4.75399L6.26931 8.1061L5.11523 6.82379C4.92126 6.60827 4.58931 6.5908 4.37379 6.78477C4.15828 6.97874 4.1408 7.31069 4.33477 7.5262L5.90977 9.27621C6.01393 9.39193 6.16408 9.45546 6.31966 9.44963C6.47525 9.4438 6.62022 9.36921 6.71542 9.24601L9.69042 5.39601Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
    <defs>
      <clipPath id="RecruiterVerifiedCheckIcon-clip0_8334_93660">
        <rect width="14" height="14" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const ResultsLockedPadlockIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M4.2 3.5C4.2 1.9536 5.4536 0.7 7 0.7C8.5464 0.7 9.8 1.9536 9.8 3.5V5.6H10.675C11.7381 5.6 12.6 6.46185 12.6 7.525V11.375C12.6 12.4381 11.7381 13.3 10.675 13.3H3.325C2.26185 13.3 1.4 12.4381 1.4 11.375V7.525C1.4 6.46185 2.26185 5.6 3.325 5.6H4.2V3.5ZM5.25 5.6H8.75V3.5C8.75 2.5335 7.9665 1.75 7 1.75C6.0335 1.75 5.25 2.5335 5.25 3.5V5.6ZM3.325 6.65C2.84175 6.65 2.45 7.04175 2.45 7.525V11.375C2.45 11.8582 2.84175 12.25 3.325 12.25H10.675C11.1582 12.25 11.55 11.8582 11.55 11.375V7.525C11.55 7.04175 11.1582 6.65 10.675 6.65H3.325ZM7 8.4C7.28995 8.4 7.525 8.63505 7.525 8.925V9.975C7.525 10.2649 7.28995 10.5 7 10.5C6.71005 10.5 6.475 10.2649 6.475 9.975V8.925C6.475 8.63505 6.71005 8.4 7 8.4Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#595959"
      />
    </g>
  </svg>
);

export const SearchRoleWalletActiveIcon = ({ className = '' }) => (
  <svg viewBox="0 0 17 17" fill="none" aria-hidden="true" className={className}>
    <g clipPath="url(#SearchRoleWalletActiveIcon-clip0_8334_97268)">
      <path
        d="M0.85 3.1875C0.85 1.89653 1.89653 0.85 3.1875 0.85H10.8375C11.1896 0.85 11.475 1.13542 11.475 1.4875C11.475 1.83958 11.1896 2.125 10.8375 2.125H3.1875C2.6007 2.125 2.125 2.6007 2.125 3.1875V3.4H13.8125C15.1035 3.4 16.15 4.44653 16.15 5.7375V13.8125C16.15 15.1035 15.1035 16.15 13.8125 16.15H3.1875C1.89653 16.15 0.85 15.1035 0.85 13.8125V3.1875ZM2.125 4.675V13.8125C2.125 14.3993 2.6007 14.875 3.1875 14.875H13.8125C14.3993 14.875 14.875 14.3993 14.875 13.8125V5.7375C14.875 5.1507 14.3993 4.675 13.8125 4.675H2.125ZM12.1125 9.35C11.8778 9.35 11.6875 9.54028 11.6875 9.775C11.6875 10.0097 11.8778 10.2 12.1125 10.2C12.3472 10.2 12.5375 10.0097 12.5375 9.775C12.5375 9.54028 12.3472 9.35 12.1125 9.35ZM10.4125 9.775C10.4125 8.83612 11.1736 8.075 12.1125 8.075C13.0514 8.075 13.8125 8.83612 13.8125 9.775C13.8125 10.7139 13.0514 11.475 12.1125 11.475C11.1736 11.475 10.4125 10.7139 10.4125 9.775Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="SearchRoleWalletActiveIcon-clip0_8334_97268">
        <rect width="17" height="17" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const SearchRoleWalletIcon = ({ className = '' }) => (
  <svg viewBox="0 0 17 17" fill="none" aria-hidden="true" className={className}>
    <g clipPath="url(#SearchRoleWalletIcon-clip0_8334_97263)">
      <path
        d="M0.85 3.1875C0.85 1.89653 1.89653 0.85 3.1875 0.85H10.8375C11.1896 0.85 11.475 1.13542 11.475 1.4875C11.475 1.83958 11.1896 2.125 10.8375 2.125H3.1875C2.6007 2.125 2.125 2.6007 2.125 3.1875V3.4H13.8125C15.1035 3.4 16.15 4.44653 16.15 5.7375V13.8125C16.15 15.1035 15.1035 16.15 13.8125 16.15H3.1875C1.89653 16.15 0.85 15.1035 0.85 13.8125V3.1875ZM2.125 4.675V13.8125C2.125 14.3993 2.6007 14.875 3.1875 14.875H13.8125C14.3993 14.875 14.875 14.3993 14.875 13.8125V5.7375C14.875 5.1507 14.3993 4.675 13.8125 4.675H2.125ZM12.1125 9.35C11.8778 9.35 11.6875 9.54028 11.6875 9.775C11.6875 10.0097 11.8778 10.2 12.1125 10.2C12.3472 10.2 12.5375 10.0097 12.5375 9.775C12.5375 9.54028 12.3472 9.35 12.1125 9.35ZM10.4125 9.775C10.4125 8.83612 11.1736 8.075 12.1125 8.075C13.0514 8.075 13.8125 8.83612 13.8125 9.775C13.8125 10.7139 13.0514 11.475 12.1125 11.475C11.1736 11.475 10.4125 10.7139 10.4125 9.775Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
    <defs>
      <clipPath id="SearchRoleWalletIcon-clip0_8334_97263">
        <rect width="17" height="17" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const SelfReportedPencilIcon = ({ className = '' }) => (
  <svg viewBox="0 0 13 13" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M8.37931 1.33126C8.81551 0.895058 9.40714 0.65 10.024 0.65C11.3086 0.65 12.35 1.69138 12.35 2.97598C12.35 3.59287 12.1049 4.18449 11.6687 4.62069L4.08221 12.2072C3.99079 12.2986 3.86679 12.35 3.7375 12.35H1.1375C0.868261 12.35 0.65 12.1317 0.65 11.8625V9.2625C0.65 9.13321 0.701362 9.00921 0.792786 8.91779L8.37931 1.33126ZM10.024 1.625C9.66572 1.625 9.32209 1.76733 9.06874 2.02069L8.81443 2.275L10.725 4.18557L10.9793 3.93126C11.2327 3.67791 11.375 3.33428 11.375 2.97598C11.375 2.22985 10.7701 1.625 10.024 1.625ZM10.0356 4.875L8.125 2.96443L1.625 9.46443V11.375H3.53557L10.0356 4.875Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#785910"
      />
    </g>
  </svg>
);

export const SkillFunctionIcon = ({ className = '' }) => (
  <svg viewBox="0 0 17 17" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M8.06008 3.11335C8.15181 2.75402 8.2805 2.49907 8.42357 2.34244C8.5516 2.20226 8.70231 2.125 8.925 2.125C9.39444 2.125 9.775 2.50556 9.775 2.975C9.775 3.32708 10.0604 3.6125 10.4125 3.6125C10.7646 3.6125 11.05 3.32708 11.05 2.975C11.05 1.80139 10.0986 0.85 8.925 0.85C8.32617 0.85 7.83937 1.09149 7.48217 1.48256C7.14214 1.85482 6.93956 2.33829 6.81903 2.82038C6.8162 2.83172 6.81368 2.84313 6.81147 2.85461L5.88924 7.65021H3.825C3.47292 7.65021 3.1875 7.93563 3.1875 8.28771C3.1875 8.63979 3.47292 8.92521 3.825 8.92521H5.64405L4.68992 13.8867C4.59819 14.246 4.4695 14.5009 4.32643 14.6576C4.1984 14.7977 4.04769 14.875 3.825 14.875C3.35556 14.875 2.975 14.4944 2.975 14.025C2.975 13.6729 2.68958 13.3875 2.3375 13.3875C1.98542 13.3875 1.7 13.6729 1.7 14.025C1.7 15.1986 2.6514 16.15 3.825 16.15C4.42383 16.15 4.91063 15.9085 5.26783 15.5174C5.60786 15.1452 5.81044 14.6617 5.93097 14.1796C5.9338 14.1683 5.93632 14.1569 5.93853 14.1454L6.94241 8.92521H9.59327C9.65578 8.92521 9.71511 8.95273 9.75549 9.00045L11.4899 11.0502L9.50084 13.4009C9.27342 13.6697 9.30694 14.0719 9.57571 14.2994C9.84449 14.5268 10.2467 14.4933 10.4742 14.2245L12.325 12.0371L14.1758 14.2245C14.4033 14.4933 14.8055 14.5268 15.0743 14.2994C15.3431 14.0719 15.3766 13.6697 15.1492 13.4009L13.1601 11.0502L15.1492 8.6995C15.3766 8.43072 15.3431 8.02847 15.0743 7.80105C14.8055 7.57362 14.4033 7.60714 14.1758 7.87592L12.325 10.0633L10.7288 8.17687C10.4462 7.84285 10.0308 7.65021 9.59327 7.65021H7.1876L8.06008 3.11335Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);

export const SkillsEvidenceBoltIcon = ({ className = '' }) => (
  <svg viewBox="0 0 17 17" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M9.57225 0.889996C9.84571 0.991714 10.0152 1.26609 9.98379 1.55616L9.50779 5.95H13.8125C14.0476 5.95 14.2636 6.0794 14.3746 6.28669C14.4855 6.49398 14.4733 6.7455 14.3429 6.94112L8.39293 15.8661C8.23165 16.108 7.92711 16.2102 7.65257 16.1144C7.37803 16.0187 7.20306 15.7493 7.2272 15.4596L7.59467 11.05H3.1875C2.95053 11.05 2.73311 10.9186 2.623 10.7087C2.51289 10.4989 2.52826 10.2453 2.6629 10.0503L8.8254 1.12528C8.99118 0.885187 9.29879 0.788279 9.57225 0.889996ZM4.40238 9.775H8.2875C8.46578 9.775 8.63591 9.84965 8.75663 9.98084C8.87734 10.112 8.9376 10.2878 8.9228 10.4654L8.70305 13.1024L12.6213 7.225H8.7975C8.61647 7.225 8.44398 7.14804 8.32307 7.01331C8.20215 6.87859 8.14421 6.69881 8.16371 6.51884L8.44527 3.91978L4.40238 9.775Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);

export const SkillsLabControllerIcon = ({ className = '' }) => (
  <svg viewBox="0 0 17 17" fill="none" aria-hidden="true" className={className}>
    <g>
      <path
        d="M1.41667 9.79861C1.41667 7.46997 1.41667 6.30566 2.0598 5.522C2.17754 5.37853 2.30909 5.24699 2.45255 5.12925C3.23622 4.48611 4.40053 4.48611 6.72917 4.48611H10.2708C12.5995 4.48611 13.7638 4.48611 14.5475 5.12925C14.6909 5.24699 14.8224 5.37853 14.9402 5.522C15.5833 6.30566 15.5833 7.46997 15.5833 9.79861C15.5833 12.1273 15.5833 13.2915 14.9402 14.0752C14.8224 14.2187 14.6909 14.3502 14.5475 14.4679C13.7638 15.1111 12.5995 15.1111 10.2708 15.1111H6.72917C4.40053 15.1111 3.23622 15.1111 2.45255 14.4679C2.30909 14.3502 2.17754 14.2187 2.0598 14.0752C1.41667 13.2915 1.41667 12.1273 1.41667 9.79861Z"
        strokeWidth="0.944444"
        strokeLinecap="round"
        stroke="#387440"
      />
      <path
        d="M8.5 4.48611V3.06944C8.5 2.67825 8.81712 2.36111 9.20833 2.36111C9.59955 2.36111 9.91667 2.04398 9.91667 1.65278V0.944444"
        strokeWidth="0.944444"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#387440"
      />
      <path
        d="M7.08333 10.8611L6.02083 9.79861M6.02083 9.79861L4.95833 8.73611M6.02083 9.79861L4.95833 10.8611M6.02083 9.79861L7.08333 8.73611"
        strokeWidth="0.944444"
        strokeLinecap="round"
        stroke="#387440"
      />
      <path
        d="M12.0417 10.5069V9.09028"
        strokeWidth="0.944444"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#387440"
      />
    </g>
  </svg>
);

export const TalentVisibilitySwitchOffIcon = ({ className = '' }) => (
  <svg viewBox="0 0 40 24" fill="none" aria-hidden="true" className={className}>
    <g>
      <rect width="40" height="24" rx="12" fill="#D9DCD3" />
      <circle cx="12" cy="12" r="9" fill="white" />
    </g>
  </svg>
);

export const TalentVisibilitySwitchOnIcon = ({ className = '' }) => (
  <svg viewBox="0 0 40 24" fill="none" aria-hidden="true" className={className}>
    <g>
      <rect width="40" height="24" rx="12" fill="#387440" />
      <circle cx="28" cy="12" r="9" fill="white" />
    </g>
  </svg>
);

// ---- Talent home · shell (top nav, rail, phone nav, page background) ----
// Single-colour nav glyphs use currentColor; illustrations keep their Figma fills.
export const TalentSidebarHomeNavIcon = ({ className = '' }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M2.25 6.75L9 1.5L15.75 6.75V15C15.75 15.3978 15.592 15.7794 15.3107 16.0607C15.0294 16.342 14.6478 16.5 14.25 16.5H3.75C3.35218 16.5 2.97064 16.342 2.68934 16.0607C2.40804 15.7794 2.25 15.3978 2.25 15V6.75Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
        <path
          d="M6.75 16.5V9H11.25V16.5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
      </g>
    </svg>
  );
};

export const TalentSidebarMyAssessmentNavIcon = ({ className = '' }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M6.75 1.5H11.25C11.6642 1.5 12 1.83579 12 2.25V3.75C12 4.16421 11.6642 4.5 11.25 4.5H6.75C6.33579 4.5 6 4.16421 6 3.75V2.25C6 1.83579 6.33579 1.5 6.75 1.5Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
        <path
          d="M12 3H13.5C13.8978 3 14.2794 3.15804 14.5607 3.43934C14.842 3.72064 15 4.10218 15 4.5V15C15 15.3978 14.842 15.7794 14.5607 16.0607C14.2794 16.342 13.8978 16.5 13.5 16.5H4.5C4.10218 16.5 3.72064 16.342 3.43934 16.0607C3.15804 15.7794 3 15.3978 3 15V4.5C3 4.10218 3.15804 3.72064 3.43934 3.43934C3.72064 3.15804 4.10218 3 4.5 3H6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
        <path
          d="M9 8.25H12"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
        <path
          d="M9 12H12"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
        <path
          d="M6 8.25H6.0075"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
        <path
          d="M6 12H6.0075"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
      </g>
    </svg>
  );
};

export const TalentSidebarOpportunitiesNavIcon = ({ className = '' }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M3 5.25H15C15.8284 5.25 16.5 5.92157 16.5 6.75V14.25C16.5 15.0784 15.8284 15.75 15 15.75H3C2.17157 15.75 1.5 15.0784 1.5 14.25V6.75C1.5 5.92157 2.17157 5.25 3 5.25Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
        <path
          d="M12 15.75V3.75C12 3.35218 11.842 2.97064 11.5607 2.68934C11.2794 2.40804 10.8978 2.25 10.5 2.25H7.5C7.10218 2.25 6.72064 2.40804 6.43934 2.68934C6.15804 2.97064 6 3.35218 6 3.75V15.75"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
      </g>
    </svg>
  );
};

export const TalentSidebarCommunityNavIcon = ({ className = '' }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M12 15.75V14.25C12 13.4544 11.6839 12.6913 11.1213 12.1287C10.5587 11.5661 9.79565 11.25 9 11.25H4.5C3.70435 11.25 2.94129 11.5661 2.37868 12.1287C1.81607 12.6913 1.5 13.4544 1.5 14.25V15.75"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
        <path
          d="M9.75 5.25C9.75 6.90685 8.40685 8.25 6.75 8.25C5.09315 8.25 3.75 6.90685 3.75 5.25C3.75 3.59315 5.09315 2.25 6.75 2.25C8.40685 2.25 9.75 3.59315 9.75 5.25Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
        <path
          d="M16.5 15.75V14.25C16.4995 13.5853 16.2783 12.9396 15.871 12.4142C15.4638 11.8889 14.8936 11.5137 14.25 11.3475"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
        <path
          d="M12 2.3475C12.6453 2.51273 13.2173 2.88803 13.6257 3.41423C14.0342 3.94044 14.2559 4.58762 14.2559 5.25375C14.2559 5.91988 14.0342 6.56706 13.6257 7.09327C13.2173 7.61947 12.6453 7.99477 12 8.16"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
      </g>
    </svg>
  );
};

export const TalentSidebarSkillsLabNavIcon = ({ className = '' }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="1.5"
        y="4.5"
        width="15"
        height="9"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M5.5 7.5v3M4 9h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M12 8.25h.01M13.5 9.75h.01"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const TalentSidebarMyLearningNavIcon = ({ className = '' }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M9 3L1.5 6.75L9 10.5L16.5 6.75L9 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 8.5V12.25C4.5 13.25 6.5 14.5 9 14.5C11.5 14.5 13.5 13.25 13.5 12.25V8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16.5 6.75V11.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export const TalentSidebarMessagesNavIcon = ({ className = '' }) => {
  return (
    <svg
      width="19.3333"
      height="18.4167"
      viewBox="0 0 19.3333 18.4167"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M6.45833 11.5H12.875M6.45833 6.91667H9.66667"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.6564 17.358C15.4908 17.1031 18.5451 14.0054 18.7965 10.1167C18.8456 9.35564 18.8456 8.56749 18.7965 7.80648C18.5451 3.91768 15.4908 0.820036 11.6564 0.565148C10.3482 0.478193 8.98246 0.478376 7.67695 0.565148C3.84252 0.820036 0.788207 3.91768 0.536884 7.80648C0.487705 8.56749 0.487705 9.35564 0.536884 10.1167C0.628423 11.533 1.25481 12.8444 1.99225 13.9517C2.42042 14.7269 2.13784 15.6945 1.69186 16.5397C1.37029 17.1491 1.20951 17.4538 1.3386 17.6738C1.4677 17.8939 1.75607 17.901 2.33281 17.915C3.47336 17.9428 4.24245 17.6194 4.85295 17.1692C5.1992 16.9139 5.37233 16.7862 5.49165 16.7716C5.61096 16.7569 5.84579 16.8536 6.31534 17.047C6.73736 17.2208 7.22738 17.3281 7.67695 17.358C8.98246 17.4448 10.3482 17.4449 11.6564 17.358Z"
          stroke="currentColor"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export const TalentSidebarProfileNavIcon = ({ className = '' }) => {
  return (
    <svg
      width="21.3"
      height="19.3"
      viewBox="0 0 21.3 19.3"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M0.650001 9.65C0.650001 5.407 0.650001 3.286 2.114 1.968C3.58 0.65 5.936 0.65 10.65 0.65C15.364 0.65 17.721 0.65 19.185 1.968C20.649 3.286 20.65 5.408 20.65 9.65C20.65 13.892 20.65 16.014 19.185 17.332C17.722 18.65 15.364 18.65 10.65 18.65C5.936 18.65 3.579 18.65 2.114 17.332C0.649001 16.014 0.650001 13.892 0.650001 9.65Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.05 5.65H6.25C5.496 5.65 5.119 5.65 4.884 5.884C4.65 6.12 4.65 6.496 4.65 7.25V8.05C4.65 8.804 4.65 9.181 4.884 9.416C5.12 9.65 5.496 9.65 6.25 9.65H7.05C7.804 9.65 8.181 9.65 8.416 9.416C8.65 9.18 8.65 8.804 8.65 8.05V7.25C8.65 6.496 8.65 6.119 8.416 5.884C8.18 5.65 7.804 5.65 7.05 5.65Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M4.65 13.65H8.65M12.65 5.65H16.65M12.65 9.65H16.65M12.65 13.65H16.65"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export const TalentSidebarVerifiedChipIcon = ({ className = '' }) => {
  const uid = useId();
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g clipPath={`url(#${uid}clip0_8334_94453)`}>
        <path
          d="M1.28366 2.8734C1.23501 2.65424 1.24248 2.42634 1.30538 2.21084C1.36828 1.99534 1.48458 1.79921 1.64349 1.64064C1.80239 1.48206 1.99877 1.36618 2.2144 1.30373C2.43003 1.24128 2.65794 1.23428 2.877 1.2834C2.99757 1.09483 3.16367 0.939648 3.35998 0.832157C3.5563 0.724666 3.77651 0.668324 4.00033 0.668324C4.22415 0.668324 4.44436 0.724666 4.64068 0.832157C4.837 0.939648 5.00309 1.09483 5.12366 1.2834C5.34305 1.23407 5.57135 1.24103 5.78733 1.30363C6.00331 1.36623 6.19994 1.48244 6.35895 1.64145C6.51795 1.80045 6.63416 1.99709 6.69676 2.21306C6.75936 2.42904 6.76632 2.65734 6.717 2.87673C6.90556 2.9973 7.06074 3.1634 7.16824 3.35971C7.27573 3.55603 7.33207 3.77624 7.33207 4.00006C7.33207 4.22388 7.27573 4.4441 7.16824 4.64041C7.06074 4.83673 6.90556 5.00283 6.717 5.1234C6.76611 5.34245 6.75912 5.57036 6.69667 5.78599C6.63422 6.00163 6.51833 6.198 6.35976 6.35691C6.20118 6.51581 6.00505 6.63211 5.78955 6.69501C5.57405 6.75791 5.34616 6.76538 5.127 6.71673C5.00658 6.90602 4.84036 7.06186 4.64371 7.16984C4.44705 7.27781 4.22634 7.33441 4.002 7.33441C3.77766 7.33441 3.55694 7.27781 3.36029 7.16984C3.16364 7.06186 2.99741 6.90602 2.877 6.71673C2.65794 6.76584 2.43003 6.75885 2.2144 6.6964C1.99877 6.63395 1.80239 6.51806 1.64349 6.35949C1.48458 6.20091 1.36828 6.00478 1.30538 5.78928C1.24248 5.57378 1.23501 5.34589 1.28366 5.12673C1.09365 5.00648 0.937135 4.84012 0.82868 4.64313C0.720225 4.44615 0.663352 4.22493 0.663352 4.00006C0.663352 3.77519 0.720225 3.55398 0.82868 3.35699C0.937135 3.16 1.09365 2.99365 1.28366 2.8734Z"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#185FA5"
        />
        <path
          d="M3 3.99976L3.66667 4.66643L5 3.3331"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#185FA5"
        />
      </g>
      <defs>
        <clipPath id={`${uid}clip0_8334_94453`}>
          <rect width="8" height="8" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const TalentSidebarPublicProfileLinkIcon = ({ className = '' }) => {
  return (
    <svg
      width="11.8003"
      height="11.8003"
      viewBox="0 0 11.8003 11.8003"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M6.80084 4.99951C6.32288 4.52218 5.675 4.25407 4.99951 4.25407C4.32401 4.25407 3.67614 4.52218 3.19817 4.99951L1.39626 6.80084C0.918437 7.27866 0.65 7.92673 0.65 8.60247C0.65 9.27821 0.918437 9.92627 1.39626 10.4041C1.87408 10.8819 2.52214 11.1503 3.19788 11.1503C3.87362 11.1503 4.52169 10.8819 4.99951 10.4041L5.90017 9.50342"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#387440"
        />
        <path
          d="M4.99951 6.80084C5.47747 7.27817 6.12535 7.54627 6.80084 7.54627C7.47633 7.54627 8.12421 7.27817 8.60217 6.80084L10.4041 4.99951C10.8819 4.52169 11.1503 3.87362 11.1503 3.19788C11.1503 2.52214 10.8819 1.87408 10.4041 1.39626C9.92627 0.918437 9.27821 0.65 8.60247 0.65C7.92672 0.65 7.27866 0.918437 6.80084 1.39626L5.90017 2.29692"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#387440"
        />
      </g>
    </svg>
  );
};

export const TalentSidebarPreviewArrowUpRightIcon = ({ className = '' }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M5.5 14.5L14.5 5.5M7 5.5H14.5V13"
        stroke="#1C2A21"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const TalentSidebarLiveStickerDot = ({ className = '' }) => {
  return (
    <svg
      width="6"
      height="6"
      viewBox="0 0 6 6"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M5.5 3C5.5 4.38071 4.38071 5.5 3 5.5C1.61929 5.5 0.5 4.38071 0.5 3C0.5 1.61929 1.61929 0.5 3 0.5C4.38071 0.5 5.5 1.61929 5.5 3Z"
        fill="#387440"
        stroke="#1C2A21"
      />
    </svg>
  );
};

export const TalentNavStreakPlayfulFigureIcon = ({ className = '' }) => {
  const uid = useId();
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M88.9997 26C92.9997 26 94.9997 30 91.9997 34C84.513 45.2299 73.5234 52.956 60.6696 53.9014C62.5141 64.2745 64.8805 73.7617 71.9997 88C73.9997 92 71.9997 96 67.9997 96H63.9997C60.9999 95.9999 58.9996 93.9999 57.9997 91C55.9997 85 52.9997 80 49.9997 76C46.9997 81 43.9997 86.0001 40.9997 92C39.9996 94.9999 36.9996 97 33.9997 97H29.9997C25.9999 96.9998 23.9998 92.9998 25.9997 89C32.2932 76.4129 36.1612 65.4422 39.0583 53.9082C26.3167 53.1237 15.3628 47.2216 6.99968 37C3.99989 34.0001 3.99981 30.9999 5.99968 28C7.99966 25 12.9996 26.0001 14.9997 30C21.9996 39.9999 31.9998 43.9999 41.9997 44H57.9997C67.9996 44 76.9997 39.9999 82.9997 31C84.9996 28.0001 85.9999 26.0001 88.9997 26Z"
          fill={`url(#${uid}paint0_linear_8334_96089)`}
        />
        <circle cx="50" cy="32.5" r="9.5" fill="#CE1126" />
        <path
          d="M85.312 0C89.715 8.976 100 15.504 100 26.928C100 35.088 93.54 40.8 85.312 40.8C77.084 40.8 70.624 35.088 70.624 26.928C70.624 20.4 74.143 16.32 77.084 10.608C78.257 15.504 80.025 17.952 82.371 18.768C80.62 11.424 82.966 4.896 85.312 0Z"
          fill={`url(#${uid}paint1_linear_8334_96089)`}
        />
      </g>
      <defs>
        <linearGradient
          id={`${uid}paint0_linear_8334_96089`}
          x1="49.0253"
          y1="26"
          x2="49.0253"
          y2="97"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#CE1126" />
          <stop offset="0.4" stopColor="#CE1126" />
          <stop offset="0.4001" stopColor="#FCD116" />
          <stop offset="0.7" stopColor="#FCD116" />
          <stop offset="0.7001" stopColor="#006B3F" />
          <stop offset="1" stopColor="#006B3F" />
        </linearGradient>
        <linearGradient
          id={`${uid}paint1_linear_8334_96089`}
          x1="85.312"
          y1="0"
          x2="85.312"
          y2="40.8"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFC83C" />
          <stop offset="1" stopColor="#FF7A1E" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const TalentSidebarProfileAvatarIllustration = ({ className = '' }) => {
  const uid = useId();
  return (
    <svg
      width="69"
      height="70"
      viewBox="0 0 69 70"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g clipPath={`url(#${uid}clip0_8334_94475)`}>
        <g></g>
        <path
          d="M48.0439 31.6504C48.2291 28.6963 47.9056 25.3673 46.4941 22.7295C46.2024 22.1842 44.9661 20.4323 44.439 20.2344C43.9903 20.066 40.7673 20.7061 39.9917 20.7813C34.7471 21.2896 29.4773 21.2668 24.2241 20.8496C22.1507 24.2148 21.7343 27.8883 21.832 31.7871C20.4469 28.3025 19.1221 24.6063 18.9346 20.8155C18.2347 20.5596 17.5091 20.6367 16.8457 20.9522C17.0846 19.6397 18.0038 18.216 19.3389 17.876C17.2133 17.4366 16.1569 15.4515 16.8457 13.3643L20.956 15.4151C18.865 13.4353 19.3459 10.0886 21.3267 8.20316C24.0647 11.2809 27.9132 8.90473 31.1645 8.20316C35.5855 7.24921 40.9012 7.02574 44.5737 10.1172C46.003 11.3204 47.3476 13.0799 46.5278 15.0391C48.2303 13.2572 51.0841 15.6306 51.2783 17.6026C51.4055 18.8935 50.9807 21.1943 50.7393 22.5244C50.1833 25.5867 49.2364 28.788 48.0439 31.6504Z"
          fill="#0D0100"
        />
        <path
          d="M48.044 31.6504C53.1241 28.0513 53.74 34.4499 51.6826 37.837C50.5481 39.7048 48.3268 41.1021 46.5952 39.0333C45.8864 43.3865 42.3701 46.1036 38.2735 46.9629C36.3231 47.3721 33.764 47.4021 31.8047 47.0313C31.0152 46.8819 29.348 46.2962 28.604 45.9376C26.1556 44.7573 24.4344 42.4454 23.6177 39.8536C21.2046 42.2101 18.4442 39.0784 17.6543 36.7432C16.401 33.0377 17.8375 29.8004 21.8657 32.2657C22.0438 32.252 21.8356 31.9275 21.8321 31.7872C21.7343 27.8883 22.1507 24.2148 24.2241 20.8497C29.4774 21.2669 34.7471 21.2896 39.9917 20.7813C40.7674 20.7061 43.9904 20.066 44.439 20.2344C44.9661 20.4323 46.2024 22.1842 46.4942 22.7295C47.9056 25.3673 48.2291 28.6963 48.044 31.6504ZM40.3286 26.9336C39.8758 26.9609 37.6602 27.6051 38.7788 28.1641C39.0283 28.2888 41.4074 28.0964 42.0132 28.1641C42.7681 28.2485 43.4748 28.5664 44.2031 28.7452C43.3439 27.5077 41.8071 26.8446 40.3286 26.9336ZM28.2671 27.0704C27.1436 27.1704 25.7057 27.9096 25.2686 29.0186C25.9445 28.7042 26.7174 28.4027 27.4585 28.3008C28.124 28.2094 30.2913 28.3986 30.6255 28.2325C31.2082 27.9428 30.5618 27.4168 30.2212 27.2754C29.7625 27.0851 28.7637 27.0261 28.2671 27.0704ZM37.9365 33.6329C38.9768 35.9764 42.9998 36.0874 43.5967 33.7012C44.6009 32.7547 44.3342 31.1171 43.2935 30.2833C40.9938 28.4407 36.4848 30.3624 37.9365 33.6329ZM26.2793 33.4961C26.6156 35.8351 30.43 36.0767 31.7373 34.1114C33.6491 31.2373 29.0393 28.3452 26.7173 30.2149C25.804 30.9503 25.447 32.5541 26.2793 33.4961ZM50.5034 32.6075C49.042 32.8037 48.0039 35.1393 47.4375 36.3331C47.4414 36.5234 48.3674 35.7199 48.5493 35.6836C48.9946 35.5948 49.7033 35.7452 49.9307 36.1963C50.4041 37.1359 49.2944 38.6969 49.4253 38.7598C50.5849 37.5525 51.7797 35.0259 51.6153 33.3252C51.5414 32.5614 51.2027 32.5135 50.5034 32.6075ZM18.6988 33.4278C18.0308 33.6545 18.6817 35.906 18.8672 36.4014C19.262 37.4561 20.1128 38.671 20.9898 39.3751C19.4776 37.4385 20.1488 35.2911 22.708 36.8116C22.0535 35.5419 20.4529 32.8325 18.6988 33.4278ZM42.7544 35.3418C41.1706 35.5308 41.1632 37.2821 42.7544 37.461C45.4518 37.7642 45.2672 35.0421 42.7544 35.3418ZM26.3804 35.4102C24.8539 35.645 24.9236 37.3855 26.5152 37.5293C29.2274 37.7744 28.9382 35.0169 26.3804 35.4102ZM33.961 36.8458C33.6356 36.7699 32.6717 36.741 33.085 37.2559C33.2665 37.4822 33.9976 37.825 34.2979 37.8711C35.2119 38.0116 36.1299 37.8185 36.8584 37.2217C36.86 37.1035 36.3028 36.9799 36.252 36.9825C36.8586 36.6122 35.3102 36.1203 35.0054 36.0938C34.4902 36.0491 33.2687 36.2575 33.961 36.8458ZM31.7373 39.8536C31.7432 39.8962 31.7268 39.9747 31.7373 39.9903L31.2656 39.8877L32.1416 40.6739C33.4521 42.553 37.9803 42.3728 38.6104 40.4004C38.6444 40.2938 38.6853 40.1743 38.6778 40.0586C38.966 39.9113 39.524 39.5157 38.9136 39.3751L31.5689 39.5801C31.4761 39.7045 31.6552 39.8103 31.7373 39.8536Z"
          fill="#996647"
        />
        <path
          d="M40.3286 26.9336C41.8071 26.8446 43.3439 27.5077 44.2031 28.7451C43.4748 28.5664 42.7681 28.2484 42.0132 28.1641C41.4074 28.0963 39.0283 28.2888 38.7788 28.1641C37.6602 27.6051 39.8757 26.9609 40.3286 26.9336Z"
          fill="#1C2A21"
        />
        <path
          d="M28.2671 27.0703C28.7637 27.0261 29.7625 27.0851 30.2212 27.2754C30.5617 27.4168 31.2082 27.9428 30.6255 28.2325C30.2913 28.3986 28.124 28.2093 27.4585 28.3008C26.7174 28.4027 25.9445 28.7041 25.2686 29.0186C25.7057 27.9096 27.1435 27.1704 28.2671 27.0703Z"
          fill="#1C2A21"
        />
        <path
          d="M43.5967 33.7011C44.7012 29.2859 37.4501 29.1148 37.9365 33.6328C36.4848 30.3623 40.9937 28.4406 43.2934 30.2832C44.3342 31.117 44.6009 32.7545 43.5967 33.7011Z"
          fill="#1C2A21"
        />
        <path
          d="M31.7373 34.1113C32.447 31.8499 30.0867 29.7838 27.9302 30.4883C26.8053 30.8557 26.1152 32.3548 26.2793 33.4961C25.447 32.554 25.804 30.9503 26.7173 30.2148C29.0392 28.3451 33.6491 31.2372 31.7373 34.1113Z"
          fill="#1C2A21"
        />
        <path
          d="M43.5967 33.7012C42.9997 36.0874 38.9768 35.9764 37.9365 33.6329C37.4501 29.1149 44.7012 29.2859 43.5967 33.7012ZM40.3286 30.6934C38.5883 30.9394 38.1013 33.9306 39.6548 34.795C42.7689 36.5277 44.0516 30.1672 40.3286 30.6934Z"
          fill="#FDFDFD"
        />
        <path
          d="M31.7373 34.1114C30.4299 36.0767 26.6156 35.8351 26.2793 33.4961C26.1152 32.3549 26.8053 30.8558 27.9302 30.4883C30.0867 29.7839 32.447 31.85 31.7373 34.1114ZM28.7051 31.377C29.1465 31.7232 28.8259 32.4772 28.3008 32.5391C27.9164 32.5844 27.5728 32.3568 27.4585 31.9922C26.8907 33.2053 27.6949 34.8864 29.0757 35C32.6875 35.2973 31.1484 28.6341 27.8291 31.3428C27.8473 31.3965 28.361 31.107 28.7051 31.377Z"
          fill="#FDFDFD"
        />
        <path
          d="M40.3286 30.6934C44.0516 30.1672 42.769 36.5277 39.6548 34.795C38.1014 33.9306 38.5883 30.9394 40.3286 30.6934ZM41.5078 32.4707C42.3485 32.7677 42.8124 31.8383 42.0806 31.4454C41.8735 31.3341 41.703 31.4077 41.5078 31.377C40.6548 31.2429 39.8371 31.2523 39.419 32.1631C39.1118 32.8322 39.1758 33.4064 39.7222 33.9063C41.081 35.1495 41.7097 33.8747 41.5078 32.4707Z"
          fill="#573220"
        />
        <path
          d="M28.3008 32.539C28.1017 33.6836 28.4889 34.4483 29.7495 34.248C31.2448 34.0105 30.2464 30.6502 28.7051 31.3769C28.361 31.107 27.8473 31.3965 27.8291 31.3427C31.1485 28.634 32.6875 35.2972 29.0757 35C27.6949 34.8864 26.8907 33.2053 27.4585 31.9922C27.5729 32.3567 27.9164 32.5844 28.3008 32.539Z"
          fill="#583320"
        />
        <path
          d="M28.3008 32.5391C28.8259 32.4772 29.1465 31.7232 28.7051 31.377C30.2464 30.6503 31.2448 34.0105 29.7495 34.2481C28.4888 34.4484 28.1017 33.6836 28.3008 32.5391Z"
          fill="#060000"
        />
        <path
          d="M41.5078 31.377C41.0086 31.6463 40.9157 32.2616 41.5078 32.4708C41.7096 33.8747 41.0809 35.1495 39.7222 33.9063C39.1757 33.4064 39.1118 32.8322 39.4189 32.1631C39.837 31.2523 40.6548 31.243 41.5078 31.377Z"
          fill="#1C2A21"
        />
        <path
          d="M41.5078 32.4707C40.9157 32.2616 41.0086 31.6462 41.5078 31.377C41.703 31.4076 41.8734 31.3341 42.0805 31.4453C42.8123 31.8382 42.3484 32.7677 41.5078 32.4707Z"
          fill="#FDFDFD"
        />
        <path
          d="M50.5034 32.6074C51.2026 32.5135 51.5414 32.5613 51.6152 33.3252C51.7797 35.0258 50.5849 37.5524 49.4253 38.7598C49.2944 38.6969 50.4041 37.1358 49.9307 36.1963C49.7033 35.7452 48.9946 35.5948 48.5493 35.6836C48.3674 35.7199 47.4414 36.5233 47.4375 36.333C48.0039 35.1393 49.042 32.8037 50.5034 32.6074Z"
          fill="#652C0D"
        />
        <path
          d="M18.6987 33.4277C20.4528 32.8324 22.0534 35.5418 22.708 36.8115C20.1487 35.291 19.4775 37.4384 20.9897 39.375C20.1127 38.6709 19.262 37.456 18.8672 36.4013C18.6817 35.9059 18.0307 33.6544 18.6987 33.4277Z"
          fill="#652D0D"
        />
        <path
          d="M42.7544 35.3418C45.2672 35.042 45.4518 37.7642 42.7544 37.4609C41.1632 37.282 41.1706 35.5307 42.7544 35.3418Z"
          fill="#7E3734"
        />
        <path
          d="M26.3804 35.4102C28.9382 35.0168 29.2274 37.7744 26.5151 37.5293C24.9236 37.3855 24.8539 35.6449 26.3804 35.4102Z"
          fill="#7F3734"
        />
        <path
          d="M36.252 36.9824C35.9467 36.9976 35.5887 37.345 35.0728 37.3242C34.544 37.3028 34.2549 36.9142 33.961 36.8457C33.2687 36.2574 34.4902 36.049 35.0054 36.0937C35.3102 36.1202 36.8586 36.6121 36.252 36.9824Z"
          fill="#B38164"
        />
        <path
          d="M33.9609 36.8457C34.2549 36.9143 34.5439 37.3029 35.0728 37.3242C35.5887 37.345 35.9467 36.9976 36.252 36.9824C36.3028 36.9799 36.8599 37.1035 36.8584 37.2217C36.1299 37.8185 35.2118 38.0116 34.2979 37.8711C34.1227 37.3827 33.5828 37.0591 33.085 37.2559C32.6717 36.7409 33.6355 36.7698 33.9609 36.8457Z"
          fill="#824B25"
        />
        <path
          d="M34.2979 37.871C33.9976 37.8249 33.2665 37.4821 33.085 37.2558C33.5828 37.0591 34.1227 37.3826 34.2979 37.871Z"
          fill="#6A3412"
        />
        <path
          d="M38.6777 40.0586C37.0494 40.8906 33.3535 40.7058 31.7373 39.8535C31.6552 39.8102 31.4761 39.7044 31.5688 39.5801L38.9136 39.375C39.524 39.5156 38.966 39.9113 38.6777 40.0586Z"
          fill="#FDFDFD"
        />
        <path
          d="M31.7373 39.9902C31.8585 40.1692 31.8418 40.1485 31.9395 40.332C32.0032 40.4519 32.064 40.5625 32.1416 40.6738L31.2656 39.8877L31.7373 39.9902Z"
          fill="#572D15"
        />
        <path
          d="M38.6777 40.0586C38.6853 40.1743 38.6444 40.2938 38.6104 40.4004C37.2166 40.6075 35.8116 40.7843 34.3989 40.7422L31.9395 40.332C31.8418 40.1485 31.8585 40.1692 31.7373 39.9902C31.7268 39.9746 31.7432 39.8961 31.7373 39.8535C33.3535 40.7058 37.0494 40.8906 38.6777 40.0586Z"
          fill="#C2B7BB"
        />
        <path
          d="M38.7187 40.3651C38.0716 42.4031 33.42 42.5893 32.0739 40.6476C31.9941 40.5326 31.9317 40.4183 31.8662 40.2944L34.3927 40.7183C35.8438 40.7618 37.2871 40.5791 38.7187 40.3651Z"
          fill="#FEFDFD"
        />
        <path
          d="M38.2734 46.9629C38.2821 47.0275 38.2588 47.1097 38.2734 47.168C36.8841 50.0412 34.1662 50.5073 31.4004 49.2871C31.605 48.7087 31.6521 47.6637 31.8047 47.0312C33.764 47.402 36.323 47.372 38.2734 46.9629Z"
          fill="#5B2F14"
        />
        <path
          d="M39.3516 49.834C38.1443 52.5324 36.6567 55.0725 35.0728 57.5586C33.197 55.4883 31.7953 53.0776 30.2549 50.7568C30.062 50.4028 30.3091 50.3061 30.457 50.0391C31.0068 49.8444 31.1738 49.9278 31.4004 49.2871C34.1662 50.5073 36.8841 50.0412 38.2734 47.168C38.3932 47.6454 39.0545 49.5402 39.3516 49.834Z"
          fill="#986546"
        />
        <path
          d="M39.4863 49.9023C38.2191 52.7896 36.7354 55.5479 35.0054 58.1738C34.6711 58.2624 32.0538 54.7345 31.7373 54.2432C31.1956 53.4022 30.0234 51.4395 29.7158 50.5518C29.6488 50.3585 29.5964 50.3873 29.7832 50.2441C29.9922 50.1912 30.2524 50.1115 30.457 50.0391C30.3091 50.3061 30.062 50.4028 30.2549 50.7568C31.7953 53.0776 33.197 55.4883 35.0728 57.5586C36.6567 55.0725 38.1443 52.5324 39.3516 49.834C39.3633 49.8455 39.4578 49.8858 39.4863 49.9023Z"
          fill="#01551F"
        />
        <path
          d="M39.8232 50.0391C38.4647 53.3619 36.6225 56.4285 34.7021 59.4385L35.1401 60.2246C34.9471 60.3536 33.6837 59.0347 33.4893 58.8232C31.3859 56.5357 29.7473 53.4654 28.5029 50.6201L28.3682 50.5859C28.5272 50.4601 28.7794 50.426 28.9746 50.3809C28.7934 51.7215 33.852 59.2676 34.3989 59.1992C34.4328 59.195 34.7734 58.6525 34.7695 58.6182C34.7562 58.498 33.3629 57.1089 33.1523 56.8408C31.5932 54.8562 30.3149 52.6738 29.2441 50.3809C29.4127 50.342 29.6108 50.2878 29.7832 50.2441C29.5964 50.3873 29.6488 50.3585 29.7158 50.5518C30.0234 51.4395 31.1956 53.4022 31.7373 54.2432C32.0538 54.7345 34.6711 58.2624 35.0054 58.1738C36.7354 55.5479 38.2191 52.7896 39.4863 49.9023C39.5109 49.9166 39.7826 50.0256 39.8232 50.0391Z"
          fill="#3C854F"
        />
        <path
          d="M40.834 50.2441C40.6118 51.6979 36.4323 61.0259 35.6792 61.3184C35.2535 61.4837 35.2041 60.732 35.4434 60.4297C35.8349 60.1367 36.2437 59.363 36.5215 58.8916C38.1249 56.1701 39.2805 53.191 40.4971 50.2783L40.0254 50.21C38.8851 53.8296 36.9907 57.1022 35.2412 60.4297C34.8201 60.6876 35.0522 61.093 34.3315 60.6348C32.6982 59.5962 29.1619 53.8965 28.5029 51.9873C28.3631 51.5823 28.2184 51.0172 28.2334 50.5859C28.2778 50.5881 28.3237 50.5849 28.3682 50.5859L28.5029 50.6201C29.7473 53.4654 31.3859 56.5357 33.4893 58.8232C33.6837 59.0347 34.9471 60.3536 35.1401 60.2246L34.7021 59.4385C36.6225 56.4285 38.4647 53.3619 39.8232 50.0391C40.0308 50.1078 40.5378 50.1652 40.834 50.2441ZM35.3423 58.6523C35.3112 58.7863 35.7456 58.9651 35.7803 58.8916C35.7717 58.6939 35.487 58.6806 35.3423 58.6523Z"
          fill="#05531E"
        />
        <path
          d="M35.4434 60.4297C35.4147 60.4512 35.3942 60.336 35.2412 60.4297C36.9907 57.1022 38.8851 53.8296 40.0254 50.21L40.4971 50.2783C39.2805 53.191 38.1249 56.1701 36.5215 58.8916C36.2437 59.363 35.8349 60.1367 35.4434 60.4297Z"
          fill="#39854E"
        />
        <path
          d="M49.3916 52.7051C47.7256 57.1742 47.0226 61.9974 47.3701 66.7871C39.3533 66.8084 31.3313 66.8077 23.3145 66.7871C23.5168 62.0097 22.4724 57.2546 20.9561 52.7734C22.0435 52.3225 27.3332 50.5421 28.2334 50.5859C28.2184 51.0172 28.3631 51.5823 28.5029 51.9873C29.1619 53.8965 32.6982 59.5962 34.3315 60.6348C35.0522 61.093 34.8201 60.6876 35.2412 60.4297C35.3942 60.336 35.4147 60.4512 35.4434 60.4297C35.2042 60.732 35.2535 61.4837 35.6792 61.3184C36.4323 61.0259 40.6118 51.6979 40.834 50.2441C43.7814 51.0301 46.5028 51.6161 49.3916 52.7051Z"
          fill="#337B32"
        />
        <path
          d="M29.2441 50.3809C30.3149 52.6738 31.5932 54.8562 33.1523 56.8408C33.3629 57.1089 34.7562 58.498 34.7695 58.6182C34.7734 58.6525 34.4328 59.195 34.3989 59.1992C33.852 59.2676 28.7934 51.7215 28.9746 50.3809C29.0569 50.3618 29.1618 50.3998 29.2441 50.3809Z"
          fill="#005723"
        />
        <path
          d="M47.3701 66.7871C47.0226 61.9974 47.7256 57.1742 49.3916 52.7051C50.6391 53.1753 51.7644 53.282 52.3564 54.7217L54.8496 66.7529C52.358 66.8205 49.8621 66.7805 47.3701 66.7871Z"
          fill="#003415"
        />
        <path
          d="M20.9561 52.7734C22.4724 57.2546 23.5168 62.0097 23.3145 66.7871C20.7358 66.7805 18.1386 66.8773 15.5654 66.6846L18.5303 54.6533C19.0219 53.4904 19.9133 53.2058 20.9561 52.7734Z"
          fill="#003415"
        />
        <path
          d="M35.3423 58.6523C35.4869 58.6806 35.7717 58.6939 35.7803 58.8916C35.7455 58.9651 35.3111 58.7863 35.3423 58.6523Z"
          fill="#1F6F3F"
        />
      </g>
      <defs>
        <clipPath id={`${uid}clip0_8334_94475`}>
          <rect width="69" height="70" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const TalentNavProfileAvatarIllustration = ({ className = '' }) => {
  const uid = useId();
  return (
    <svg
      width="27"
      height="28"
      viewBox="0 0 27 28"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g clipPath={`url(#${uid}clip0_8334_93550)`}>
        <g></g>
        <path
          d="M18.7998 12.6602C18.8723 11.4785 18.7457 10.1469 18.1934 9.09181C18.0792 8.87369 17.5954 8.17292 17.3892 8.09376C17.2136 8.02639 15.9524 8.28244 15.6489 8.31251C13.5967 8.51584 11.5346 8.50674 9.479 8.33986C8.66766 9.68591 8.50473 11.1553 8.54297 12.7149C8.00096 11.321 7.48256 9.84253 7.40918 8.32619C7.1353 8.22384 6.85138 8.25468 6.5918 8.38087C6.68529 7.85587 7.04497 7.28639 7.56738 7.15041C6.73563 6.97464 6.32227 6.1806 6.5918 5.34572L8.20019 6.16603C7.38194 5.37413 7.57015 4.03543 8.34521 3.28126C9.41662 4.51236 10.9226 3.56189 12.1948 3.28126C13.9248 2.89968 16.0048 2.8103 17.4419 4.04689C18.0012 4.52817 18.5273 5.23194 18.2065 6.01564C18.8727 5.3029 19.9894 6.25225 20.0654 7.04103C20.1152 7.55742 19.949 8.47772 19.8545 9.00978C19.637 10.2347 19.2664 11.5152 18.7998 12.6602Z"
          fill="#0D0100"
        />
        <path
          d="M18.7998 12.6602C20.7877 11.2205 21.0287 13.78 20.2236 15.1348C19.7797 15.8819 18.9105 16.4408 18.2329 15.6133C17.9555 17.3546 16.5796 18.4414 14.9766 18.7852C14.2134 18.9488 13.212 18.9608 12.4453 18.8125C12.1364 18.7527 11.484 18.5185 11.1929 18.375C10.2348 17.9029 9.56128 16.9782 9.24171 15.9414C8.29745 16.884 7.21729 15.6314 6.90821 14.6973C6.41778 13.2151 6.97988 11.9201 8.55616 12.9063C8.62585 12.9008 8.54435 12.771 8.54298 12.7149C8.50475 11.1553 8.66767 9.68592 9.47901 8.33986C11.5346 8.50674 13.5967 8.51585 15.6489 8.31252C15.9524 8.28244 17.2136 8.0264 17.3892 8.09377C17.5954 8.17293 18.0792 8.8737 18.1934 9.09182C18.7457 10.1469 18.8723 11.4785 18.7998 12.6602ZM15.7808 10.7735C15.6036 10.7844 14.7366 11.0421 15.1743 11.2656C15.2719 11.3155 16.2029 11.2385 16.44 11.2656C16.7353 11.2994 17.0119 11.4266 17.2969 11.4981C16.9606 11.0031 16.3593 10.7379 15.7808 10.7735ZM11.061 10.8281C10.6214 10.8681 10.0587 11.1638 9.8877 11.6074C10.1522 11.4817 10.4547 11.3611 10.7446 11.3203C11.005 11.2837 11.8531 11.3594 11.9839 11.293C12.2119 11.1771 11.959 10.9667 11.8257 10.9102C11.6462 10.8341 11.2554 10.8105 11.061 10.8281ZM14.8447 13.4531C15.2518 14.3906 16.826 14.435 17.0596 13.4805C17.4525 13.1019 17.3482 12.4468 16.9409 12.1133C16.041 11.3763 14.2767 12.145 14.8447 13.4531ZM10.2832 13.3985C10.4148 14.3341 11.9074 14.4307 12.419 13.6446C13.167 12.4949 11.3632 11.3381 10.4546 12.086C10.0972 12.3801 9.95752 13.0216 10.2832 13.3985ZM19.7622 13.043C19.1904 13.1215 18.7841 14.0557 18.5625 14.5332C18.564 14.6093 18.9264 14.288 18.9976 14.2735C19.1718 14.2379 19.4491 14.2981 19.5381 14.4785C19.7234 14.8543 19.2891 15.4788 19.3403 15.5039C19.7941 15.021 20.2616 14.0104 20.1973 13.3301C20.1684 13.0246 20.0358 13.0054 19.7622 13.043ZM7.3169 13.3711C7.05553 13.4618 7.31023 14.3624 7.38282 14.5606C7.53731 14.9824 7.87022 15.4684 8.21339 15.75C7.62166 14.9754 7.8843 14.1165 8.88575 14.7246C8.62962 14.2167 8.00329 13.133 7.3169 13.3711ZM16.73 14.1367C16.1102 14.2123 16.1074 14.9128 16.73 14.9844C17.7855 15.1057 17.7132 14.0168 16.73 14.1367ZM10.3228 14.1641C9.72544 14.258 9.7527 14.9542 10.3755 15.0117C11.4368 15.1098 11.3237 14.0067 10.3228 14.1641ZM13.2891 14.7383C13.1617 14.708 12.7846 14.6964 12.9463 14.9024C13.0173 14.9929 13.3034 15.13 13.4209 15.1485C13.7786 15.2046 14.1378 15.1274 14.4229 14.8887C14.4235 14.8414 14.2055 14.792 14.1856 14.793C14.4229 14.6449 13.817 14.4481 13.6978 14.4375C13.4962 14.4196 13.0182 14.503 13.2891 14.7383ZM12.419 15.9414C12.4212 15.9585 12.4148 15.9899 12.419 15.9961L12.2344 15.9551L12.5772 16.2696C13.0899 17.0212 14.8619 16.9491 15.1084 16.1602C15.1217 16.1175 15.1377 16.0697 15.1348 16.0235C15.2476 15.9645 15.4659 15.8063 15.2271 15.75L12.353 15.8321C12.3167 15.8818 12.3868 15.9241 12.419 15.9414Z"
          fill="#996647"
        />
        <path
          d="M15.7808 10.7734C16.3593 10.7378 16.9606 11.0031 17.2969 11.498C17.0119 11.4265 16.7353 11.2994 16.4399 11.2656C16.2029 11.2385 15.2719 11.3155 15.1743 11.2656C14.7366 11.042 15.6035 10.7843 15.7808 10.7734Z"
          fill="#1C2A21"
        />
        <path
          d="M11.061 10.8281C11.2554 10.8104 11.6462 10.834 11.8257 10.9102C11.9589 10.9667 12.2119 11.1771 11.9839 11.293C11.8531 11.3594 11.005 11.2837 10.7446 11.3203C10.4546 11.3611 10.1522 11.4817 9.8877 11.6074C10.0587 11.1638 10.6214 10.8681 11.061 10.8281Z"
          fill="#1C2A21"
        />
        <path
          d="M17.0596 13.4804C17.4918 11.7143 14.6544 11.6459 14.8447 13.4531C14.2767 12.1449 16.041 11.3762 16.9409 12.1133C17.3482 12.4468 17.4525 13.1018 17.0596 13.4804Z"
          fill="#1C2A21"
        />
        <path
          d="M12.4189 13.6445C12.6967 12.74 11.7731 11.9135 10.9292 12.1953C10.489 12.3423 10.219 12.9419 10.2832 13.3984C9.95752 13.0216 10.0972 12.3801 10.4546 12.0859C11.3632 11.3381 13.167 12.4949 12.4189 13.6445Z"
          fill="#1C2A21"
        />
        <path
          d="M17.0596 13.4805C16.826 14.435 15.2518 14.3906 14.8447 13.4531C14.6544 11.646 17.4918 11.7144 17.0596 13.4805ZM15.7808 12.2774C15.0998 12.3758 14.9092 13.5723 15.5171 13.918C16.7357 14.6111 17.2376 12.0669 15.7808 12.2774Z"
          fill="#FDFDFD"
        />
        <path
          d="M12.4189 13.6445C11.9074 14.4307 10.4148 14.334 10.2832 13.3985C10.219 12.942 10.489 12.3423 10.9292 12.1953C11.7731 11.9136 12.6967 12.74 12.4189 13.6445ZM11.2324 12.5508C11.4052 12.6893 11.2797 12.9909 11.0742 13.0156C10.9238 13.0338 10.7894 12.9427 10.7446 12.7969C10.5225 13.2821 10.8371 13.9546 11.3774 14C12.7907 14.1189 12.1885 11.4536 10.8896 12.5371C10.8968 12.5586 11.0978 12.4428 11.2324 12.5508Z"
          fill="#FDFDFD"
        />
        <path
          d="M15.7808 12.2774C17.2376 12.0669 16.7357 14.6111 15.5171 13.918C14.9092 13.5723 15.0998 12.3758 15.7808 12.2774ZM16.2422 12.9883C16.5712 13.1071 16.7527 12.7353 16.4663 12.5781C16.3853 12.5337 16.3186 12.5631 16.2422 12.5508C15.9084 12.4972 15.5884 12.5009 15.4248 12.8652C15.3046 13.1329 15.3297 13.3626 15.5435 13.5625C16.0752 14.0598 16.3212 13.5499 16.2422 12.9883Z"
          fill="#573220"
        />
        <path
          d="M11.0742 13.0156C10.9963 13.4734 11.1478 13.7793 11.6411 13.6992C12.2262 13.6042 11.8355 12.2601 11.2324 12.5508C11.0978 12.4428 10.8968 12.5586 10.8897 12.5371C12.1885 11.4536 12.7908 14.1189 11.3774 14C10.8371 13.9545 10.5225 13.2821 10.7446 12.7969C10.7894 12.9427 10.9238 13.0337 11.0742 13.0156Z"
          fill="#583320"
        />
        <path
          d="M11.0742 13.0156C11.2797 12.9909 11.4052 12.6893 11.2324 12.5508C11.8355 12.2601 12.2262 13.6042 11.6411 13.6992C11.1478 13.7794 10.9963 13.4735 11.0742 13.0156Z"
          fill="#060000"
        />
        <path
          d="M16.2422 12.5508C16.0469 12.6585 16.0105 12.9047 16.2422 12.9883C16.3212 13.5499 16.0751 14.0598 15.5435 13.5625C15.3296 13.3626 15.3046 13.1329 15.4248 12.8653C15.5884 12.5009 15.9084 12.4972 16.2422 12.5508Z"
          fill="#1C2A21"
        />
        <path
          d="M16.2422 12.9883C16.0105 12.9046 16.0468 12.6585 16.2422 12.5508C16.3186 12.5631 16.3852 12.5336 16.4663 12.5781C16.7526 12.7353 16.5711 13.1071 16.2422 12.9883Z"
          fill="#FDFDFD"
        />
        <path
          d="M19.7622 13.043C20.0358 13.0054 20.1684 13.0245 20.1973 13.3301C20.2616 14.0103 19.7941 15.021 19.3403 15.5039C19.2891 15.4788 19.7233 14.8543 19.5381 14.4785C19.4491 14.2981 19.1718 14.2379 18.9976 14.2734C18.9264 14.288 18.564 14.6093 18.5625 14.5332C18.7841 14.0557 19.1904 13.1215 19.7622 13.043Z"
          fill="#652C0D"
        />
        <path
          d="M7.31689 13.3711C8.00328 13.133 8.6296 14.2167 8.88573 14.7246C7.88428 14.1164 7.62164 14.9754 8.21337 15.75C7.8702 15.4683 7.53729 14.9824 7.3828 14.5605C7.31022 14.3623 7.05551 13.4617 7.31689 13.3711Z"
          fill="#652D0D"
        />
        <path
          d="M16.73 14.1367C17.7132 14.0168 17.7855 15.1057 16.73 14.9844C16.1073 14.9128 16.1102 14.2123 16.73 14.1367Z"
          fill="#7E3734"
        />
        <path
          d="M10.3228 14.1641C11.3237 14.0067 11.4368 15.1097 10.3755 15.0117C9.7527 14.9542 9.72543 14.258 10.3228 14.1641Z"
          fill="#7F3734"
        />
        <path
          d="M14.1856 14.7929C14.0661 14.799 13.926 14.938 13.7241 14.9297C13.5172 14.9211 13.4041 14.7657 13.2891 14.7383C13.0182 14.5029 13.4962 14.4196 13.6978 14.4375C13.817 14.4481 14.4229 14.6448 14.1856 14.7929Z"
          fill="#B38164"
        />
        <path
          d="M13.2891 14.7383C13.4041 14.7657 13.5172 14.9212 13.7241 14.9297C13.926 14.938 14.0661 14.799 14.1855 14.793C14.2055 14.792 14.4235 14.8414 14.4229 14.8887C14.1378 15.1274 13.7785 15.2046 13.4209 15.1484C13.3524 14.9531 13.1411 14.8236 12.9463 14.9023C12.7846 14.6964 13.1617 14.7079 13.2891 14.7383Z"
          fill="#824B25"
        />
        <path
          d="M13.4209 15.1484C13.3034 15.13 13.0173 14.9928 12.9463 14.9023C13.1411 14.8236 13.3524 14.953 13.4209 15.1484Z"
          fill="#6A3412"
        />
        <path
          d="M15.1348 16.0234C14.4976 16.3562 13.0514 16.2823 12.4189 15.9414C12.3868 15.9241 12.3167 15.8818 12.353 15.832L15.2271 15.75C15.4659 15.8062 15.2476 15.9645 15.1348 16.0234Z"
          fill="#FDFDFD"
        />
        <path
          d="M12.4189 15.9961C12.4664 16.0677 12.4598 16.0594 12.498 16.1328C12.523 16.1807 12.5468 16.225 12.5771 16.2695L12.2344 15.9551L12.4189 15.9961Z"
          fill="#572D15"
        />
        <path
          d="M15.1348 16.0234C15.1377 16.0697 15.1217 16.1175 15.1084 16.1602C14.563 16.243 14.0132 16.3137 13.4604 16.2969L12.498 16.1328C12.4598 16.0594 12.4664 16.0677 12.4189 15.9961C12.4148 15.9899 12.4212 15.9584 12.4189 15.9414C13.0514 16.2823 14.4976 16.3562 15.1348 16.0234Z"
          fill="#C2B7BB"
        />
        <path
          d="M15.3911 16.1336C15.0979 17.0012 12.9902 17.0805 12.3802 16.2539C12.3441 16.2049 12.3158 16.1562 12.2861 16.1035L13.4309 16.2839C14.0884 16.3025 14.7424 16.2247 15.3911 16.1336Z"
          fill="#FEFDFD"
        />
        <path
          d="M14.9766 18.7852C14.98 18.811 14.9708 18.8439 14.9766 18.8672C14.4329 20.0165 13.3694 20.2029 12.2871 19.7148C12.3672 19.4835 12.3856 19.0655 12.4453 18.8125C13.212 18.9608 14.2134 18.9488 14.9766 18.7852Z"
          fill="#5B2F14"
        />
        <path
          d="M15.3984 19.9336C14.926 21.013 14.3439 22.029 13.7241 23.0234C12.9901 22.1953 12.4416 21.2311 11.8389 20.3027C11.7634 20.1611 11.8601 20.1225 11.918 20.0156C12.1331 19.9377 12.1984 19.9711 12.2871 19.7148C13.3694 20.2029 14.4329 20.0165 14.9766 18.8672C15.0234 19.0582 15.2822 19.8161 15.3984 19.9336Z"
          fill="#986546"
        />
        <path
          d="M15.4512 19.9609C14.9553 21.1158 14.3747 22.2192 13.6978 23.2695C13.5669 23.3049 12.5428 21.8938 12.4189 21.6973C12.207 21.3609 11.7483 20.5758 11.6279 20.2207C11.6017 20.1434 11.5812 20.1549 11.6543 20.0977C11.7361 20.0765 11.8379 20.0446 11.918 20.0156C11.8601 20.1225 11.7634 20.1611 11.8389 20.3027C12.4416 21.2311 12.9901 22.1953 13.7241 23.0234C14.3439 22.029 14.926 21.013 15.3984 19.9336C15.403 19.9382 15.44 19.9543 15.4512 19.9609Z"
          fill="#01551F"
        />
        <path
          d="M15.583 20.0156C15.0514 21.3448 14.3305 22.5714 13.5791 23.7754L13.7505 24.0898C13.6749 24.1414 13.1806 23.6139 13.1045 23.5293C12.2814 22.6143 11.6402 21.3862 11.1533 20.248L11.1006 20.2344C11.1628 20.184 11.2615 20.1704 11.3379 20.1523C11.267 20.6886 13.2465 23.7071 13.4604 23.6797C13.4737 23.678 13.607 23.461 13.6055 23.4473C13.6002 23.3992 13.0551 22.8435 12.9727 22.7363C12.3625 21.9425 11.8624 21.0695 11.4434 20.1523C11.5093 20.1368 11.5868 20.1151 11.6543 20.0977C11.5812 20.1549 11.6017 20.1434 11.6279 20.2207C11.7483 20.5758 12.207 21.3609 12.4189 21.6973C12.5428 21.8938 13.5669 23.3049 13.6978 23.2695C14.3747 22.2192 14.9553 21.1158 15.4512 19.9609C15.4608 19.9667 15.5671 20.0102 15.583 20.0156Z"
          fill="#3C854F"
        />
        <path
          d="M15.9785 20.0977C15.8916 20.6791 14.2561 24.4104 13.9614 24.5273C13.7948 24.5935 13.7755 24.2928 13.8691 24.1719C14.0224 24.0547 14.1823 23.7452 14.291 23.5566C14.9184 22.4681 15.3706 21.2764 15.8467 20.1113L15.6621 20.084C15.2159 21.5318 14.4746 22.8409 13.79 24.1719C13.6252 24.275 13.7161 24.4372 13.4341 24.2539C12.7949 23.8385 11.4112 21.5586 11.1533 20.7949C11.0986 20.6329 11.042 20.4069 11.0479 20.2344C11.0652 20.2352 11.0832 20.234 11.1006 20.2344L11.1533 20.248C11.6402 21.3862 12.2814 22.6143 13.1045 23.5293C13.1806 23.6139 13.6749 24.1414 13.7505 24.0898L13.5791 23.7754C14.3305 22.5714 15.0514 21.3448 15.583 20.0156C15.6642 20.0431 15.8626 20.0661 15.9785 20.0977ZM13.8296 23.4609C13.8174 23.5145 13.9874 23.586 14.001 23.5566C13.9976 23.4776 13.8862 23.4723 13.8296 23.4609Z"
          fill="#05531E"
        />
        <path
          d="M13.8691 24.1719C13.8579 24.1805 13.8499 24.1344 13.79 24.1719C14.4746 22.8409 15.2159 21.5318 15.6621 20.084L15.8467 20.1113C15.3706 21.2764 14.9184 22.4681 14.291 23.5566C14.1823 23.7452 14.0224 24.0547 13.8691 24.1719Z"
          fill="#39854E"
        />
        <path
          d="M19.3271 21.082C18.6752 22.8697 18.4001 24.799 18.5361 26.7148C15.3991 26.7234 12.2601 26.7231 9.12305 26.7148C9.20223 24.8039 8.79356 22.9018 8.2002 21.1094C8.62574 20.929 10.6956 20.2168 11.0479 20.2344C11.042 20.4069 11.0986 20.6329 11.1533 20.7949C11.4112 21.5586 12.7949 23.8385 13.4341 24.2539C13.7161 24.4372 13.6252 24.275 13.79 24.1719C13.8499 24.1344 13.8579 24.1805 13.8691 24.1719C13.7755 24.2928 13.7948 24.5935 13.9614 24.5273C14.2561 24.4104 15.8916 20.6791 15.9785 20.0977C17.1318 20.4121 18.1968 20.6464 19.3271 21.082Z"
          fill="#337B32"
        />
        <path
          d="M11.4434 20.1523C11.8624 21.0695 12.3625 21.9425 12.9727 22.7363C13.0551 22.8435 13.6002 23.3992 13.6055 23.4473C13.607 23.461 13.4737 23.678 13.4604 23.6797C13.2465 23.7071 11.267 20.6886 11.3379 20.1523C11.3701 20.1447 11.4111 20.1599 11.4434 20.1523Z"
          fill="#005723"
        />
        <path
          d="M18.5361 26.7148C18.4001 24.799 18.6752 22.8697 19.3271 21.082C19.8153 21.2701 20.2556 21.3128 20.4873 21.8887L21.4629 26.7012C20.4879 26.7282 19.5113 26.7122 18.5361 26.7148Z"
          fill="#003415"
        />
        <path
          d="M8.2002 21.1094C8.79356 22.9018 9.20223 24.8039 9.12305 26.7148C8.11403 26.7122 7.0977 26.7509 6.09082 26.6738L7.25098 21.8613C7.44335 21.3962 7.79216 21.2823 8.2002 21.1094Z"
          fill="#003415"
        />
        <path
          d="M13.8296 23.4609C13.8862 23.4723 13.9976 23.4776 14.001 23.5566C13.9874 23.586 13.8174 23.5145 13.8296 23.4609Z"
          fill="#1F6F3F"
        />
      </g>
      <defs>
        <clipPath id={`${uid}clip0_8334_93550`}>
          <rect width="27" height="28" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const TalentPageBackgroundBlobBottomRightIllustration = ({ className = '' }) => {
  const uid = useId();
  return (
    <svg
      width="900"
      height="900"
      viewBox="0 0 900 900"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g filter={`url(#${uid}filter0_f_8334_95311)`}>
        <circle cx="450" cy="450" r="310" fill="#F6E3D7" fillOpacity="0.55" />
      </g>
      <defs>
        <filter
          id={`${uid}filter0_f_8334_95311`}
          x="0"
          y="0"
          width="900"
          height="900"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="70" result="effect1_foregroundBlur_8334_95311" />
        </filter>
      </defs>
    </svg>
  );
};

export const TalentPageBackgroundBlobTopLeftIllustration = ({ className = '' }) => {
  const uid = useId();
  return (
    <svg
      width="840"
      height="840"
      viewBox="0 0 840 840"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g filter={`url(#${uid}filter0_f_8334_95313)`}>
        <circle cx="420" cy="420" r="280" fill="#DDEBDD" fillOpacity="0.7" />
      </g>
      <defs>
        <filter
          id={`${uid}filter0_f_8334_95313`}
          x="0"
          y="0"
          width="840"
          height="840"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="70" result="effect1_foregroundBlur_8334_95313" />
        </filter>
      </defs>
    </svg>
  );
};

export const TalentPageBackgroundBlobCenterIllustration = ({ className = '' }) => {
  const uid = useId();
  return (
    <svg
      width="740"
      height="740"
      viewBox="0 0 740 740"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g filter={`url(#${uid}filter0_f_8334_95315)`}>
        <circle cx="370" cy="370" r="230" fill="#F3F0DC" fillOpacity="0.45" />
      </g>
      <defs>
        <filter
          id={`${uid}filter0_f_8334_95315`}
          x="0"
          y="0"
          width="740"
          height="740"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="70" result="effect1_foregroundBlur_8334_95315" />
        </filter>
      </defs>
    </svg>
  );
};

// ---- Talent home · flows ----
// Welcome / tour / first chat / apply-gate overlays (src/components/sections/talentHome/*).
export const PartyPopperSpotIllustration = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="160"
    height="160"
    viewBox="0 0 160 160"
    fill="none"
  >
    <g>
      <path
        d="M18 84C14 50 42 20 78 18C114 16 144 42 142 80C140 118 112 144 76 140C42 136 22 116 18 84Z"
        fill="#E1EAE2"
      />
      <path d="M38 130L62 66L102 106L38 130Z" fill="#1C2A21" />
      <path
        d="M34 126L58 62L98 102L34 126Z"
        fill="#F3C84B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M50 84L72 106M42 104L56 118"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#C8951A"
      />
      <path
        d="M108 40H102C100.895 40 100 40.8954 100 42V54C100 55.1046 100.895 56 102 56H108C109.105 56 110 55.1046 110 54V42C110 40.8954 109.105 40 108 40Z"
        fill="#E8672A"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M126 66H118C116.895 66 116 66.8954 116 68V73C116 74.1046 116.895 75 118 75H126C127.105 75 128 74.1046 128 73V68C128 66.8954 127.105 66 126 66Z"
        fill="#387440"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M94 73C96.7614 73 99 70.7614 99 68C99 65.2386 96.7614 63 94 63C91.2386 63 89 65.2386 89 68C89 70.7614 91.2386 73 94 73Z"
        fill="#387440"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M74 52C70 40 82 36 78 24"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#387440"
      />
      <path
        d="M108 92C118 88 120 100 132 96"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#E8672A"
      />
      <path
        d="M124 37C124.84 43.16 124.84 43.16 131 44C124.84 44.84 124.84 44.84 124 51C123.16 44.84 123.16 44.84 117 44C123.16 43.16 123.16 43.16 124 37Z"
        fill="#F3C84B"
      />
      <path
        d="M126 25C127.08 32.92 127.08 32.92 135 34C127.08 35.08 127.08 35.08 126 43C124.92 35.08 124.92 35.08 117 34C124.92 32.92 124.92 32.92 126 25Z"
        fill="#C8951A"
      />
      <path
        d="M32 40C32.72 45.28 32.72 45.28 38 46C32.72 46.72 32.72 46.72 32 52C31.28 46.72 31.28 46.72 26 46C31.28 45.28 31.28 45.28 32 40Z"
        fill="#387440"
      />
      <path
        d="M22 130C26 124.667 30 124.667 34 130C38 135.333 42 135.333 46 130"
        strokeWidth="3"
        strokeLinecap="round"
        stroke="#C8951A"
      />
      <path
        d="M139 124C139 126.761 136.761 129 134 129C131.239 129 129 126.761 129 124C129 121.239 131.239 119 134 119C136.761 119 139 121.239 139 124Z"
        strokeWidth="3"
        stroke="#C8951A"
      />
    </g>
  </svg>
);

export const PartyPopperPlayfulSpotIllustration = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="104"
    height="104"
    viewBox="0 0 104 104"
    fill="none"
  >
    <g>
      <path
        d="M11.7 54.6C9.1 32.5 27.3 13 50.7 11.7C74.1 10.4 93.6 27.3 92.3 52C91 76.7 72.8 93.6 49.4 91C27.3 88.4 14.3 75.4 11.7 54.6Z"
        fill="#E1EAE2"
      />
      <path d="M24.7 84.5L40.3 42.9L66.3 68.9L24.7 84.5Z" fill="#1C2A21" />
      <path
        d="M22.1 81.9L37.7 40.3L63.7 66.3L22.1 81.9Z"
        fill="#F3C84B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M32.5 54.6L46.8 68.9M27.3 67.6L36.4 76.7"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#C8951A"
      />
      <path
        d="M70.2 26H66.3C65.582 26 65 26.582 65 27.3V35.1C65 35.818 65.582 36.4 66.3 36.4H70.2C70.918 36.4 71.5 35.818 71.5 35.1V27.3C71.5 26.582 70.918 26 70.2 26Z"
        fill="#E8672A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M81.9 42.9H76.7C75.982 42.9 75.4 43.482 75.4 44.2V47.45C75.4 48.168 75.982 48.75 76.7 48.75H81.9C82.618 48.75 83.2 48.168 83.2 47.45V44.2C83.2 43.482 82.618 42.9 81.9 42.9Z"
        fill="#387440"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M61.1 47.45C62.8949 47.45 64.35 45.9949 64.35 44.2C64.35 42.4051 62.8949 40.95 61.1 40.95C59.3051 40.95 57.85 42.4051 57.85 44.2C57.85 45.9949 59.3051 47.45 61.1 47.45Z"
        fill="#387440"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M48.1 33.8C45.5 26 53.3 23.4 50.7 15.6"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#387440"
      />
      <path
        d="M70.2 59.8C76.7 57.2 78 65 85.8 62.4"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#E8672A"
      />
      <path
        d="M80.6 24.05C81.146 28.054 81.146 28.054 85.15 28.6C81.146 29.146 81.146 29.146 80.6 33.15C80.054 29.146 80.054 29.146 76.05 28.6C80.054 28.054 80.054 28.054 80.6 24.05Z"
        fill="#F3C84B"
      />
      <path
        d="M81.9 16.25C82.602 21.398 82.602 21.398 87.75 22.1C82.602 22.802 82.602 22.802 81.9 27.95C81.198 22.802 81.198 22.802 76.05 22.1C81.198 21.398 81.198 21.398 81.9 16.25Z"
        fill="#C8951A"
      />
      <path
        d="M20.8 26C21.268 29.432 21.268 29.432 24.7 29.9C21.268 30.368 21.268 30.368 20.8 33.8C20.332 30.368 20.332 30.368 16.9 29.9C20.332 29.432 20.332 29.432 20.8 26Z"
        fill="#387440"
      />
      <path
        d="M14.3 84.5C16.9 81.0333 19.5 81.0333 22.1 84.5C24.7 87.9667 27.3 87.9667 29.9 84.5"
        strokeWidth="3"
        strokeLinecap="round"
        stroke="#C8951A"
      />
      <path
        d="M90.35 80.6C90.35 82.3949 88.8949 83.85 87.1 83.85C85.3051 83.85 83.85 82.3949 83.85 80.6C83.85 78.8051 85.3051 77.35 87.1 77.35C88.8949 77.35 90.35 78.8051 90.35 80.6Z"
        strokeWidth="3"
        stroke="#C8951A"
      />
    </g>
  </svg>
);

export const DoodleStarLargeIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
  >
    <path
      d="M11 0C12.1 7.7 14.3 9.9 22 11C14.3 12.1 12.1 14.3 11 22C9.9 14.3 7.7 12.1 0 11C7.7 9.9 9.9 7.7 11 0Z"
      fill="#FFD86B"
    />
  </svg>
);

export const DoodleStarSmallIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
  >
    <path
      d="M5 0C5.5 3.5 6.5 4.5 10 5C6.5 5.5 5.5 6.5 5 10C4.5 6.5 3.5 5.5 0 5C3.5 4.5 4.5 3.5 5 0Z"
      fill="#FFD86B"
    />
  </svg>
);

export const DoodleStarMediumIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
  >
    <path
      d="M7 0C7.7 4.9 9.1 6.3 14 7C9.1 7.7 7.7 9.1 7 14C6.3 9.1 4.9 7.7 0 7C4.9 6.3 6.3 4.9 7 0Z"
      fill="white"
    />
  </svg>
);

export const MilestoneEyeIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="16"
    height="15.2"
    viewBox="0 0 16 15.2"
    fill="none"
  >
    <g>
      <path
        d="M4.99218 5.54797C4.09558 6.30056 3.38942 7.19776 2.99185 7.7565C2.92709 7.8475 2.8967 7.89093 2.87634 7.92545C2.86363 7.947 2.86122 7.95458 2.85988 7.95975C2.85972 7.96066 2.85923 7.96353 2.8587 7.96845C2.85779 7.9769 2.85714 7.98781 2.85714 8C2.85714 8.01219 2.85779 8.0231 2.8587 8.03155C2.85923 8.03647 2.85972 8.03934 2.85988 8.04025C2.86122 8.04542 2.86363 8.053 2.87634 8.07455C2.8967 8.10907 2.92709 8.1525 2.99185 8.2435C3.38942 8.80224 4.09558 9.69944 4.99218 10.452C5.89671 11.2113 6.93297 11.7714 8 11.7714C9.06703 11.7714 10.1033 11.2113 11.0078 10.452C11.9044 9.69944 12.6106 8.80224 13.0082 8.2435C13.0729 8.1525 13.1033 8.10907 13.1237 8.07455C13.1364 8.05299 13.1388 8.04541 13.1401 8.04024C13.1403 8.03933 13.1408 8.03647 13.1413 8.03155C13.1422 8.0231 13.1429 8.01219 13.1429 8C13.1429 7.98781 13.1422 7.9769 13.1413 7.96845C13.1408 7.96353 13.1403 7.96066 13.1401 7.95976C13.1388 7.95459 13.1364 7.94701 13.1237 7.92545C13.1033 7.89093 13.0729 7.8475 13.0082 7.7565C12.6106 7.19776 11.9044 6.30056 11.0078 5.54797C10.1033 4.78871 9.06703 4.22857 8 4.22857C6.93297 4.22857 5.89671 4.78871 4.99218 5.54797ZM4.33089 4.76015C5.31326 3.93555 6.58049 3.2 8 3.2C9.41951 3.2 10.6867 3.93555 11.6691 4.76015C12.6594 5.59141 13.4236 6.56623 13.8462 7.16016C13.8531 7.16991 13.8602 7.17973 13.8672 7.18962C13.9688 7.33167 14.0821 7.49014 14.1375 7.70852C14.1827 7.88662 14.1827 8.11338 14.1375 8.29148C14.0821 8.50987 13.9688 8.66833 13.8672 8.81038C13.8602 8.82027 13.8531 8.83009 13.8462 8.83984C13.4236 9.43377 12.6594 10.4086 11.6691 11.2399C10.6867 12.0644 9.41951 12.8 8 12.8C6.58049 12.8 5.31326 12.0644 4.33089 11.2399C3.34058 10.4086 2.57641 9.43377 2.15379 8.83984C2.14685 8.83009 2.13984 8.82028 2.13276 8.81038C2.03119 8.66833 1.91787 8.50987 1.86246 8.29148C1.81727 8.11338 1.81727 7.88662 1.86246 7.70852C1.91787 7.49013 2.03119 7.33167 2.13276 7.18962C2.13984 7.17972 2.14685 7.16991 2.15379 7.16016C2.57641 6.56623 3.34058 5.59141 4.33089 4.76015ZM8 6.97143C7.43194 6.97143 6.97143 7.43194 6.97143 8C6.97143 8.56806 7.43194 9.02857 8 9.02857C8.56806 9.02857 9.02857 8.56806 9.02857 8C9.02857 7.43194 8.56806 6.97143 8 6.97143ZM5.94286 8C5.94286 6.86387 6.86387 5.94286 8 5.94286C9.13613 5.94286 10.0571 6.86387 10.0571 8C10.0571 9.13613 9.13613 10.0571 8 10.0571C6.86387 10.0571 5.94286 9.13613 5.94286 8Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);

export const MilestoneTrendUpIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g>
      <path
        d="M9.6 3.8C9.6 3.46863 9.86863 3.2 10.2 3.2H14.6C14.9314 3.2 15.2 3.46863 15.2 3.8V8.2C15.2 8.53137 14.9314 8.8 14.6 8.8C14.2686 8.8 14 8.53137 14 8.2V5.24853L9.02426 10.2243C8.81313 10.4354 8.47887 10.4592 8.24 10.28L5.49602 8.22201L1.86093 12.5841C1.64879 12.8387 1.27046 12.8731 1.01589 12.6609C0.761323 12.4488 0.726929 12.0705 0.939067 11.8159L4.93907 7.01589C5.14356 6.7705 5.50446 6.72834 5.76 6.92L8.5437 9.00777L13.1515 4.4H10.2C9.86863 4.4 9.6 4.13137 9.6 3.8Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);

export const MilestoneTrophyIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g>
      <path
        d="M12.14 7.41875C12.4175 7.19 14.02 6.19875 14.8975 5.36375C15.5825 4.71125 15.8475 3.0075 14.7937 2.17875C13.4237 1.1025 12.1088 2.2325 12.1088 2.2325C12.1088 2.2325 11.9938 1.59375 11.1938 1.21875C10.1863 0.74625 8.91 0.57 7.73625 0.585C6.59875 0.59875 5.55125 0.73625 4.62125 1.1925C3.78875 1.60125 3.73875 2.18375 3.73875 2.18375C3.73875 2.18375 2.64625 1.14 1.3075 1.9875C-0.03 2.83625 0.35375 4.53625 0.9975 5.25C1.83625 6.18 2.84375 6.65375 3.30125 6.99625C3.7575 7.33875 4.195 7.665 4.195 7.95875C4.195 8.2525 4.065 8.3175 4.015 8.30125C3.96625 8.285 3.88 7.99875 3.65625 8.12125C3.35125 8.29 3.44375 8.97 4.08 9.035C4.69625 9.09875 4.81375 8.4475 4.81375 8.4475L4.91125 7.81125L5.9225 8.5125L7.03125 9.42625L6.99875 10.2087C6.99875 10.2087 6.95 10.8125 6.65625 11.335C6.3625 11.8575 5.89 12.3787 5.89 12.3787L5.875 12.8512L9.98625 12.7537L9.85625 12.2975C9.85625 12.2975 9.32625 11.715 9.0075 11.09C8.78 10.6425 8.74375 10.1912 8.74375 10.1912L8.73375 9.06875L10.8675 7.76125C10.8675 7.76125 11.0963 7.94125 11.0638 8.00625C11.0312 8.07125 11.0238 8.7375 11.5363 8.985C12.0425 9.23 12.45 8.92 12.4012 8.495C12.3525 8.07125 12.0913 8.2175 12.01 8.2825C11.9288 8.3475 11.7487 8.36375 11.7 8.11875C11.65 7.87625 11.8625 7.6475 12.14 7.41875ZM1.63625 5.11125L1.1475 3.62375L1.73875 2.85L2.40125 2.65625C2.40125 2.65625 3.2475 3.2875 3.2775 3.33875C3.3075 3.39 3.8175 4.43875 3.8175 4.43875L4.49 6.87375L1.63625 5.11125ZM11.2437 7.0675C11.2537 7.01625 11.875 4.45875 11.875 4.45875C11.875 4.42875 12.3125 4.225 12.3125 4.18375C12.3125 4.1425 13.1075 2.84875 13.1075 2.84875L14.4325 2.9L14.7075 4.21375L14.045 5.30375C14.0463 5.305 11.2337 7.1175 11.2437 7.0675Z"
        fill="#FEC417"
      />
      <path
        d="M14.99 3.83C14.8925 2.665 13.74 2.38625 13.2662 2.555C12.7925 2.72375 12.485 3.04 12.38 3.49C12.295 3.85375 12.21 4.09625 12.1125 4.13375C12.005 4.17375 11.9063 4.1575 11.9063 4.1575C11.9063 4.1575 11.8888 3.37 11.8938 3.0525C11.9063 2.3975 12.1062 2.23 12.1062 2.23C12.1062 2.23 12.0638 2.00875 11.9788 1.88625C11.8938 1.765 11.7362 1.6075 11.7362 1.6075C11.7362 1.6075 11.7725 1.9225 11.615 1.99625C11.4575 2.07 11.2875 1.96 11.2875 1.96L11.445 2.615C11.445 2.615 11.19 5.88 11.1663 5.9525C11.1425 6.025 10.1838 7.6875 10.1838 7.6875C10.1838 7.6875 9.625 8.21 9.35875 8.33125C9.09125 8.4525 8.86125 8.76875 7.83 8.78C6.79875 8.7925 5.9125 7.97875 5.9125 7.97875L5.02625 7.12875L4.37125 5.19875L4.27375 3.2325L4.315 2.5175L4.34375 2.21875L4.2975 2.0675C4.2975 2.0675 4.2125 2.1525 4.055 2.11625C3.8975 2.08 3.83625 1.87375 3.83625 1.87375C3.83625 1.87375 3.775 1.97125 3.76375 2.02C3.75125 2.06875 3.73875 2.18125 3.73875 2.18125C3.73875 2.18125 3.90875 2.36 3.945 2.615C3.98125 2.87 3.9325 3.92625 3.75125 3.90125C3.56875 3.8775 3.62875 2.99125 2.9375 2.65125C2.33875 2.35625 1.445 2.445 1.08 3.185C0.71625 3.925 0.9825 4.79875 2.12375 5.6125C3.265 6.42625 4.48 7.11 4.6725 7.7625C4.9025 8.53875 4.38125 9 4.38125 9C4.38125 9 4.76 8.9475 4.94625 8.54125C5.00625 8.41 5.02875 8.21875 5.0375 8.105C5.46875 8.6675 6.0425 9.14375 6.8025 9.37375C7.09 9.4725 7.41375 9.5225 7.86375 9.5225C7.92875 9.5225 7.9925 9.52 8.05625 9.5175C8.5825 9.49875 9.0325 9.4 9.46875 9.18375C10.0575 8.91125 10.5138 8.495 10.8663 8.0225C10.8562 8.135 10.925 8.415 11.0562 8.63625C11.2862 9.025 11.675 9.04875 11.675 9.04875C11.675 9.04875 11.1412 8.73375 11.25 7.98125C11.3588 7.22875 11.8563 6.96125 12.6088 6.47625C13.3638 5.99 15.0862 4.995 14.99 3.83ZM2.65875 5.48125C2.32 5.2425 1.72625 4.92375 1.48125 4.4375C1.155 3.78875 1.42 3.005 2.04 2.90875C3.3275 2.70625 3.35125 4.305 3.43625 4.49875C3.52125 4.6925 3.76375 4.705 3.76375 4.705C3.76375 4.705 3.7725 4.8125 3.8075 5.02C3.80875 5.02625 3.81 5.03125 3.81 5.0375L3.81375 5.05625C3.8375 5.1975 3.87125 5.37375 3.91875 5.575L3.9225 5.59C3.94875 5.70375 3.97625 5.81125 4.005 5.91C4.0625 6.1175 4.1325 6.34125 4.21875 6.57125C4.09375 6.48625 3.3775 5.99 2.65875 5.48125ZM14.3225 4.5825C14.0538 5.0175 13.51 5.34125 13.1088 5.61375C12.5913 5.965 11.8213 6.4925 11.6038 6.64C11.6538 6.5075 11.6975 6.37625 11.7375 6.2475C11.8025 6.0775 11.8713 5.87 11.9187 5.64625C12.0437 5.05875 12.065 4.545 12.065 4.545C12.065 4.545 12.32 4.6175 12.4775 4.4475C12.635 4.2775 12.6938 3.75 12.8413 3.50125C13.0713 3.1125 13.5325 2.7125 14.225 3.1975C14.625 3.47875 14.64 4.0675 14.3225 4.5825ZM7.565 9.91375L8.27125 9.905C8.27125 9.905 8.29 10.6763 8.40125 11.2512C8.5125 11.8275 8.66125 12.4675 8.66125 12.4675C8.66125 12.4675 7.2225 12.95 7.23125 12.43C7.24 11.91 7.45375 10.8975 7.45375 10.8975C7.45375 10.8975 7.58375 9.69125 7.565 9.91375Z"
        fill="#FFA828"
      />
      <path
        d="M6.37988 1.89875C6.37988 1.89875 7.16613 1.81 7.89738 1.82125C8.62863 1.8325 9.38113 1.97625 9.38113 1.97625C9.38113 1.97625 9.33738 4.42375 9.20363 5.7975C9.07113 7.17125 8.55113 8.2 8.41238 8.49125C8.27863 8.77375 8.18113 8.925 8.18113 8.925L7.47613 8.8425L6.25738 6.395L6.37988 1.89875Z"
        fill="#FFA828"
      />
      <path
        d="M5.43855 2.265C5.43855 2.265 5.6598 2.15375 5.98105 2.0325C6.2723 1.9225 6.5348 1.88875 6.5348 1.88875C6.5348 1.88875 6.5423 3.51125 6.56855 4.66875C6.59105 5.655 6.95605 7.27125 7.13355 7.70375C7.31105 8.13625 7.63105 8.79625 7.63105 8.79625C7.63105 8.79625 6.9873 8.70375 6.59105 8.20125C6.3823 7.93625 5.40605 5.88625 5.3723 4.535C5.33855 3.18375 5.47105 2.23125 5.43855 2.265Z"
        fill="#FFEFAB"
      />
      <path
        d="M5.0725 2.4525C5.05 2.51875 4.87375 3.915 5.15 5.21C5.42625 6.505 5.835 7.39125 6.105 7.7425C6.345 8.05375 6.50125 8.20125 6.59 8.20125C6.67875 8.20125 6.225 7.1275 6.01375 6.285C5.80375 5.44375 5.6925 4.435 5.67 3.9375C5.6475 3.43875 5.62625 2.15375 5.62625 2.15375C5.62625 2.15375 5.3825 2.265 5.3275 2.2975C5.2725 2.33125 5.0725 2.4525 5.0725 2.4525Z"
        fill="#FFFCFD"
      />
      <path
        d="M6.6675 12.3762C6.6675 12.3762 7.14375 11.6012 7.24375 11.0137C7.34375 10.4262 7.39875 9.90625 7.39875 9.90625L7.69375 9.91875C7.69375 9.91875 7.665 10.77 7.63125 11.3462C7.5975 11.9225 7.49875 12.4875 7.49875 12.4875L6.6675 12.3762Z"
        fill="#FFEFAB"
      />
      <path
        d="M7.03375 9.42625C7.03375 9.42625 7.255 9.21 7.86375 9.21C8.4725 9.21 8.73375 9.44375 8.73375 9.44375L8.75 10.195C8.75 10.195 8.345 10.0688 7.8525 10.0625C7.4425 10.0575 7.00125 10.21 7.00125 10.21L7.03375 9.42625ZM4.375 1.965C4.4775 1.87 5.46 1.1325 7.78625 1.1125C10.2887 1.09 11.2275 1.815 11.2862 1.855C11.3525 1.89875 11.43 2.09875 11.3975 2.1875C11.3637 2.27625 11.2975 2.30875 11.11 2.23125C10.9212 2.15375 9.99125 1.475 7.75375 1.545C5.605 1.61125 4.69375 2.265 4.5975 2.32C4.52 2.36375 4.37625 2.375 4.31 2.28625C4.2425 2.19875 4.30875 2.0275 4.375 1.965ZM11.3975 2.48625C11.11 2.50875 11.3087 4.82375 10.7 6.27375C10.0475 7.825 9.215 8.2675 9.24875 8.35625C9.2825 8.445 10.0975 8.19875 10.6112 7.47C11.0875 6.795 11.375 6.19625 11.5087 5.39875C11.64 4.60125 11.7175 2.46125 11.3975 2.48625ZM4.31375 2.75125C4.24125 2.7475 4.315 3.9025 4.1975 4.41C4.1525 4.605 4.0425 4.645 4.03125 4.68875C4.02 4.7325 4.2725 6.21875 4.69625 6.87125C5.10625 7.5025 5.915 8.28875 6.0475 8.15625C6.18 8.02375 5.46 7.58 4.97375 6.61625C4.69375 6.06375 4.40875 5.23125 4.3975 4.27875C4.39 3.64875 4.46875 2.76 4.31375 2.75125Z"
        fill="#D1701C"
      />
      <path
        d="M10.8461 14.0887L10.8448 12.3025H5.11106C5.12856 12.3025 5.11481 13.755 5.11231 14.095H4.29731V15.3888H11.5786V14.095L10.8461 14.0887Z"
        fill="#865C50"
      />
      <path
        d="M6.94863 13.2412C6.80738 13.235 6.64488 13.2637 6.63863 13.4387C6.63238 13.6137 6.63238 14.12 6.63238 14.2162C6.63238 14.3125 6.71113 14.3962 6.90863 14.4025C7.10613 14.4087 8.95988 14.4025 9.08988 14.4025C9.21988 14.4025 9.28738 14.29 9.29238 14.1775C9.29863 14.065 9.28613 13.5912 9.28613 13.4625C9.28613 13.2487 9.09488 13.2487 8.96488 13.2487C8.82488 13.2462 6.94863 13.2412 6.94863 13.2412Z"
        fill="#FCC219"
      />
    </g>
  </svg>
);

export const WhiteArrowRightIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <g>
      <path
        d="M11.736 5.20385C12.0376 4.91996 12.5123 4.93435 12.7962 5.23598L16.7962 9.48598C17.068 9.77476 17.068 10.2252 16.7962 10.514L12.7962 14.764C12.5123 15.0657 12.0376 15.08 11.736 14.7961C11.4343 14.5123 11.42 14.0376 11.7038 13.736L14.5142 10.75H3.75C3.33579 10.75 3 10.4142 3 10C3 9.58579 3.33579 9.25 3.75 9.25H14.5142L11.7038 6.26402C11.42 5.96239 11.4343 5.48774 11.736 5.20385Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="white"
      />
    </g>
  </svg>
);

export const TourPlayIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g>
      <path
        d="M4.31527 2.47186C4.50947 2.36717 4.74546 2.37749 4.92977 2.49875L12.5298 7.49875C12.6984 7.60972 12.8 7.79809 12.8 8C12.8 8.20191 12.6984 8.39028 12.5298 8.50125L4.92977 13.5013C4.74546 13.6225 4.50947 13.6328 4.31527 13.5281C4.12108 13.4234 4 13.2206 4 13V3C4 2.77938 4.12108 2.57656 4.31527 2.47186ZM5.2 4.11294V11.8871L11.1083 8L5.2 4.11294Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);

export const LanguageGlobeIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g>
      <path
        d="M2.02963 7.4H4.81024C4.86661 5.75539 5.15306 4.25603 5.60328 3.11318C5.70867 2.84563 5.82511 2.59234 5.95278 2.35833C3.82703 3.12987 2.2611 5.06865 2.02963 7.4ZM8 0.8C4.02355 0.8 0.8 4.02355 0.8 8C0.8 11.9765 4.02355 15.2 8 15.2C11.9765 15.2 15.2 11.9765 15.2 8C15.2 4.02355 11.9765 0.8 8 0.8ZM8 2C7.86265 2 7.66858 2.06824 7.42702 2.32759C7.18465 2.58782 6.93877 2.99708 6.71977 3.55301C6.33327 4.53413 6.067 5.87868 6.01099 7.4H9.98901C9.933 5.87868 9.66673 4.53413 9.28023 3.55301C9.06123 2.99708 8.81535 2.58782 8.57298 2.32759C8.33142 2.06824 8.13735 2 8 2ZM11.1898 7.4C11.1334 5.75539 10.8469 4.25603 10.3967 3.11318C10.2913 2.84563 10.1749 2.59234 10.0472 2.35833C12.173 3.12987 13.7389 5.06865 13.9704 7.4H11.1898ZM9.98901 8.6H6.01099C6.067 10.1213 6.33327 11.4659 6.71977 12.447C6.93877 13.0029 7.18465 13.4122 7.42702 13.6724C7.66858 13.9318 7.86265 14 8 14C8.13735 14 8.33142 13.9318 8.57298 13.6724C8.81535 13.4122 9.06123 13.0029 9.28023 12.447C9.66673 11.4659 9.933 10.1213 9.98901 8.6ZM10.0472 13.6417C10.1749 13.4077 10.2913 13.1544 10.3967 12.8868C10.8469 11.744 11.1334 10.2446 11.1898 8.6H13.9704C13.7389 10.9313 12.173 12.8701 10.0472 13.6417ZM5.95278 13.6417C5.82511 13.4077 5.70867 13.1544 5.60328 12.8868C5.15306 11.744 4.86661 10.2446 4.81024 8.6H2.02963C2.2611 10.9313 3.82703 12.8701 5.95278 13.6417Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);

export const DialogCloseIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
  >
    <g>
      <path
        d="M3.69221 3.69221C3.94849 3.43593 4.36401 3.43593 4.62029 3.69221L7 6.07192L9.37971 3.69221C9.63599 3.43593 10.0515 3.43593 10.3078 3.69221C10.5641 3.94849 10.5641 4.36401 10.3078 4.62029L7.92808 7L10.3078 9.37971C10.5641 9.63599 10.5641 10.0515 10.3078 10.3078C10.0515 10.5641 9.63599 10.5641 9.37971 10.3078L7 7.92808L4.62029 10.3078C4.36401 10.5641 3.94849 10.5641 3.69221 10.3078C3.43593 10.0515 3.43593 9.63599 3.69221 9.37971L6.07192 7L3.69221 4.62029C3.43593 4.36401 3.43593 3.94849 3.69221 3.69221Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1C2A21"
      />
    </g>
  </svg>
);

export const ChatHistoryClockIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g>
      <path
        d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2ZM0.8 8C0.8 4.02355 4.02355 0.8 8 0.8C11.9765 0.8 15.2 4.02355 15.2 8C15.2 11.9765 11.9765 15.2 8 15.2C4.02355 15.2 0.8 11.9765 0.8 8ZM7.8 4C8.13137 4 8.4 4.26863 8.4 4.6V7.6H9.8C10.1314 7.6 10.4 7.86863 10.4 8.2C10.4 8.53137 10.1314 8.8 9.8 8.8H7.8C7.46863 8.8 7.2 8.53137 7.2 8.2V4.6C7.2 4.26863 7.46863 4 7.8 4Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="white"
      />
    </g>
  </svg>
);

export const ChatPanelCloseIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g>
      <path
        d="M4.21967 4.21967C4.51256 3.92678 4.98744 3.92678 5.28033 4.21967L8 6.93934L10.7197 4.21967C11.0126 3.92678 11.4874 3.92678 11.7803 4.21967C12.0732 4.51256 12.0732 4.98744 11.7803 5.28033L9.06066 8L11.7803 10.7197C12.0732 11.0126 12.0732 11.4874 11.7803 11.7803C11.4874 12.0732 11.0126 12.0732 10.7197 11.7803L8 9.06066L5.28033 11.7803C4.98744 12.0732 4.51256 12.0732 4.21967 11.7803C3.92678 11.4874 3.92678 11.0126 4.21967 10.7197L6.93934 8L4.21967 5.28033C3.92678 4.98744 3.92678 4.51256 4.21967 4.21967Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="white"
      />
    </g>
  </svg>
);

export const InterestsHeartIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g>
      <path
        d="M10.8091 2.81973C10.0271 2.91868 9.1857 3.40508 8.51047 4.49821C8.40116 4.67517 8.208 4.78289 8 4.78289C7.79201 4.78289 7.59885 4.67517 7.48954 4.49821C6.81431 3.40511 5.97289 2.91872 5.19086 2.81975C4.39966 2.71962 3.5861 3.00472 2.94773 3.61425C1.68381 4.83226 1.68409 6.88508 2.94857 8.10272L8 12.967L13.0514 8.10272C14.3159 6.88509 14.3162 4.83227 13.0523 3.61426C12.4139 3.00472 11.6003 2.71961 10.8091 2.81973ZM10.6585 1.62922C11.8458 1.47897 13.0108 1.91489 13.8821 2.74744L13.8838 2.74905C15.6387 4.43898 15.6387 7.27718 13.8838 8.9671L8.41618 14.2322C8.18383 14.4559 7.81617 14.4559 7.58382 14.2322L2.1162 8.9671C0.361268 7.27718 0.361268 4.43898 2.1162 2.74906L2.11788 2.74744L2.11788 2.74744C2.98922 1.91488 4.15418 1.47899 5.34152 1.62925C6.30945 1.75174 7.23853 2.25637 7.99999 3.15958C8.76146 2.25634 9.69055 1.7517 10.6585 1.62922Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);

export const GreenArrowRightIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
  >
    <g>
      <path
        d="M10.5624 4.68346C10.8338 4.42797 11.261 4.44091 11.5165 4.71238L15.1165 8.53738C15.3612 8.79729 15.3612 9.20271 15.1165 9.46262L11.5165 13.2876C11.261 13.5591 10.8338 13.572 10.5624 13.3165C10.2909 13.061 10.278 12.6338 10.5335 12.3624L13.0628 9.675H3.375C3.00221 9.675 2.7 9.37279 2.7 9C2.7 8.62721 3.00221 8.325 3.375 8.325H13.0628L10.5335 5.63762C10.278 5.36615 10.2909 4.93896 10.5624 4.68346Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);

export const ChatTypingIndicatorIllustration = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="55"
    height="29"
    viewBox="0 0 55 29"
    fill="none"
  >
    <g>
      <rect x="0.5" y="0.5" width="54" height="28" rx="13.5" fill="white" />
      <rect x="0.5" y="0.5" width="54" height="28" rx="13.5" stroke="#E7E7E7" />
      <circle cx="16.5" cy="14.5" r="3.5" fill="#387440" />
      <circle cx="27.5" cy="14.5" r="3.5" fill="#387440" fillOpacity="0.6" />
      <circle cx="38.5" cy="14.5" r="3.5" fill="#387440" fillOpacity="0.3" />
    </g>
  </svg>
);

export const ChatComposerMicIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
  >
    <g>
      <path
        d="M5.4 4.5C5.4 2.51177 7.01177 0.9 9 0.9C10.9882 0.9 12.6 2.51177 12.6 4.5V8.1C12.6 10.0882 10.9882 11.7 9 11.7C7.01177 11.7 5.4 10.0882 5.4 8.1V4.5ZM9 2.25C7.75736 2.25 6.75 3.25736 6.75 4.5V8.1C6.75 9.34264 7.75736 10.35 9 10.35C10.2426 10.35 11.25 9.34264 11.25 8.1V4.5C11.25 3.25736 10.2426 2.25 9 2.25ZM3.375 7.425C3.74779 7.425 4.05 7.72721 4.05 8.1C4.05 10.8338 6.26619 13.05 9 13.05C11.7338 13.05 13.95 10.8338 13.95 8.1C13.95 7.72721 14.2522 7.425 14.625 7.425C14.9978 7.425 15.3 7.72721 15.3 8.1C15.3 11.3514 12.837 14.0275 9.675 14.3643V15.75H11.925C12.2978 15.75 12.6 16.0522 12.6 16.425C12.6 16.7978 12.2978 17.1 11.925 17.1H6.075C5.70221 17.1 5.4 16.7978 5.4 16.425C5.4 16.0522 5.70221 15.75 6.075 15.75H8.325V14.3643C5.16301 14.0275 2.7 11.3514 2.7 8.1C2.7 7.72721 3.00221 7.425 3.375 7.425Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#595959"
      />
    </g>
  </svg>
);

export const OnlineStatusDotIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="8"
    height="8"
    viewBox="0 0 8 8"
    fill="none"
  >
    <circle cx="4" cy="4" r="4" fill="#387440" />
  </svg>
);

export const ApplyLockIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
  >
    <g>
      <path
        d="M4.2 3.5C4.2 1.9536 5.4536 0.7 7 0.7C8.5464 0.7 9.8 1.9536 9.8 3.5V5.6H10.675C11.7381 5.6 12.6 6.46185 12.6 7.525V11.375C12.6 12.4381 11.7381 13.3 10.675 13.3H3.325C2.26185 13.3 1.4 12.4381 1.4 11.375V7.525C1.4 6.46185 2.26185 5.6 3.325 5.6H4.2V3.5ZM5.25 5.6H8.75V3.5C8.75 2.5335 7.9665 1.75 7 1.75C6.0335 1.75 5.25 2.5335 5.25 3.5V5.6ZM3.325 6.65C2.84175 6.65 2.45 7.04175 2.45 7.525V11.375C2.45 11.8582 2.84175 12.25 3.325 12.25H10.675C11.1582 12.25 11.55 11.8582 11.55 11.375V7.525C11.55 7.04175 11.1582 6.65 10.675 6.65H3.325ZM7 8.4C7.28995 8.4 7.525 8.63505 7.525 8.925V9.975C7.525 10.2649 7.28995 10.5 7 10.5C6.71005 10.5 6.475 10.2649 6.475 9.975V8.925C6.475 8.63505 6.71005 8.4 7 8.4Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);

export const RoleWalletIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
  >
    <g>
      <path
        d="M1.1 4.125C1.1 2.45434 2.45434 1.1 4.125 1.1H14.025C14.4806 1.1 14.85 1.46937 14.85 1.925C14.85 2.38064 14.4806 2.75 14.025 2.75H4.125C3.36561 2.75 2.75 3.36561 2.75 4.125V4.4H17.875C19.5457 4.4 20.9 5.75434 20.9 7.425V17.875C20.9 19.5457 19.5457 20.9 17.875 20.9H4.125C2.45434 20.9 1.1 19.5457 1.1 17.875V4.125ZM2.75 6.05V17.875C2.75 18.6344 3.36561 19.25 4.125 19.25H17.875C18.6344 19.25 19.25 18.6344 19.25 17.875V7.425C19.25 6.66561 18.6344 6.05 17.875 6.05H2.75ZM15.675 12.1C15.3712 12.1 15.125 12.3462 15.125 12.65C15.125 12.9538 15.3712 13.2 15.675 13.2C15.9788 13.2 16.225 12.9538 16.225 12.65C16.225 12.3462 15.9788 12.1 15.675 12.1ZM13.475 12.65C13.475 11.435 14.46 10.45 15.675 10.45C16.89 10.45 17.875 11.435 17.875 12.65C17.875 13.865 16.89 14.85 15.675 14.85C14.46 14.85 13.475 13.865 13.475 12.65Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);

export const SavedHeartIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
  >
    <g>
      <path
        d="M9.45799 2.46726C8.77372 2.55385 8.03748 2.97944 7.44666 3.93593C7.35101 4.09077 7.182 4.18503 7 4.18503C6.81801 4.18503 6.64899 4.09077 6.55335 3.93594C5.96252 2.97947 5.22628 2.55388 4.542 2.46728C3.8497 2.37967 3.13784 2.62913 2.57926 3.16247C1.47334 4.22822 1.47358 6.02445 2.57999 7.08988L7 11.3462L11.42 7.08988C12.5264 6.02445 12.5267 4.22823 11.4208 3.16248C10.8622 2.62913 10.1503 2.37966 9.45799 2.46726ZM9.32617 1.42557C10.3651 1.2941 11.3844 1.67552 12.1469 2.40401L12.1483 2.40542C13.6839 3.88411 13.6839 6.36753 12.1483 7.84622L7.36416 12.4532C7.16086 12.6489 6.83914 12.6489 6.63584 12.4532L1.85167 7.84622C0.316109 6.36753 0.316109 3.88411 1.85167 2.40542L1.85314 2.40401L1.85315 2.40401C2.61557 1.67552 3.63491 1.29412 4.67383 1.42559C5.52077 1.53277 6.33371 1.97432 6.99999 2.76463C7.66628 1.9743 8.47923 1.53274 9.32617 1.42557Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);

export const ReminderBellIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
  >
    <g>
      <path
        d="M3.19172 3.62302C3.36395 1.89197 4.846 0.7 6.55602 0.7H7.44297C9.15298 0.7 10.635 1.89197 10.8073 3.62302L10.8075 3.62578L11.1039 6.77302C11.1039 6.77349 11.1039 6.77396 11.104 6.77443C11.2013 7.74952 11.6223 8.73392 12.2871 9.44015C12.6504 9.82608 12.6535 10.3607 12.5126 10.7435C12.3712 11.1274 12.0086 11.55 11.4381 11.55H9.07046C8.90383 12.5432 8.04004 13.3 6.9995 13.3C5.95895 13.3 5.09516 12.5432 4.92853 11.55H2.56084C1.99041 11.55 1.62776 11.1274 1.4864 10.7435C1.34545 10.3607 1.34861 9.82608 1.71189 9.44015C2.37671 8.73391 2.79769 7.74948 2.895 6.77437L3.19172 3.62302ZM11.4381 10.5C11.4408 10.5 11.4415 10.4997 11.4423 10.4994C11.4438 10.4988 11.4495 10.4963 11.4586 10.4887C11.4786 10.4718 11.5068 10.4363 11.5273 10.3807C11.5476 10.3255 11.553 10.2699 11.5474 10.2264C11.5421 10.1849 11.529 10.1667 11.5225 10.1598C10.6854 9.27049 10.177 8.06307 10.059 6.87698L10.0587 6.87421L9.76242 3.72698C9.76237 3.72652 9.76233 3.72606 9.76228 3.72561C9.64846 2.58879 8.67164 1.75 7.44297 1.75H6.55602C5.32733 1.75 4.35049 2.58882 4.23669 3.72566C4.23665 3.7261 4.23661 3.72654 4.23656 3.72698L3.93998 6.87698C3.82197 8.06307 3.31362 9.27049 2.47645 10.1598C2.46997 10.1667 2.45687 10.1849 2.45155 10.2264C2.44598 10.2699 2.45142 10.3255 2.47173 10.3807C2.49221 10.4363 2.52042 10.4718 2.54037 10.4887C2.54944 10.4963 2.55507 10.4988 2.55656 10.4994C2.55743 10.4997 2.55811 10.5 2.56084 10.5H11.4381ZM6.00924 11.55C6.15339 11.9578 6.54232 12.25 6.9995 12.25C7.45667 12.25 7.84561 11.9578 7.98975 11.55H6.00924Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#595959"
      />
    </g>
  </svg>
);

export const TourTooltipArrowIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    overflow="visible"
    width="19.0526"
    height="10.5"
    viewBox="0 0 19.0526 10.5"
    fill="none"
  >
    <path d="M9.52628 0L19.0526 10.5H0L9.52628 0Z" fill="white" />
  </svg>
);

// ---- Talent home · core (hero, journey, cards, unlocks) -------------------------
// Generated from the Figma icon exports (colours baked in, as in the other sections).
export const TalentHomeActivityCheckCircleIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M9 0.9C4.52649 0.9 0.9 4.52649 0.9 9C0.9 13.4735 4.52649 17.1 9 17.1C13.4735 17.1 17.1 13.4735 17.1 9C17.1 4.52649 13.4735 0.9 9 0.9ZM12.4591 6.93773C12.6871 6.64274 12.6327 6.21883 12.3377 5.99088C12.0427 5.76294 11.6188 5.81729 11.3909 6.11227L8.06054 10.4221L6.57672 8.77345C6.32734 8.49635 5.90054 8.47389 5.62345 8.72327C5.34635 8.97266 5.32389 9.39945 5.57328 9.67655L7.59828 11.9265C7.73219 12.0753 7.92524 12.157 8.12528 12.1495C8.32532 12.142 8.51172 12.0461 8.63412 11.8877L12.4591 6.93773Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeApplicationsSuitcaseIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M7.07521 1.7H9.92479C10.1436 1.69998 10.3447 1.69997 10.5127 1.7137C10.6939 1.7285 10.8921 1.76238 11.0878 1.86213C11.3677 2.00474 11.5953 2.2323 11.7379 2.51219C11.8376 2.70795 11.8715 2.90615 11.8863 3.08731C11.9 3.25534 11.9 3.45634 11.9 3.6752L11.9 4.25L14.1748 4.25C14.3936 4.24998 14.5947 4.24997 14.7627 4.2637C14.9439 4.2785 15.1421 4.31238 15.3378 4.41213C15.6177 4.55474 15.8453 4.7823 15.9879 5.06219C16.0876 5.25795 16.1215 5.45615 16.1363 5.63731C16.15 5.80534 16.15 6.00634 16.15 6.2252V9.9248C16.15 10.1437 16.15 10.3447 16.1363 10.5127C16.1215 10.6939 16.0876 10.8921 15.9879 11.0878C15.8453 11.3677 15.6177 11.5953 15.3378 11.7379C15.3252 11.7443 15.3126 11.7504 15.3 11.7563V13.3248C15.3 13.5437 15.3 13.7447 15.2863 13.9127C15.2715 14.0939 15.2376 14.2921 15.1379 14.4878C14.9953 14.7677 14.7677 14.9953 14.4878 15.1379C14.2921 15.2376 14.0939 15.2715 13.9127 15.2863C13.7447 15.3 13.5437 15.3 13.3248 15.3H3.6752C3.45634 15.3 3.25534 15.3 3.08731 15.2863C2.90615 15.2715 2.70795 15.2376 2.51219 15.1379C2.2323 14.9953 2.00474 14.7677 1.86213 14.4878C1.76238 14.2921 1.7285 14.0939 1.7137 13.9127C1.69997 13.7447 1.69998 13.5436 1.7 13.3248L1.7 11.7563C1.68739 11.7504 1.67478 11.7443 1.66219 11.7379C1.3823 11.5953 1.15474 11.3677 1.01213 11.0878C0.912383 10.8921 0.878499 10.6939 0.863698 10.5127C0.849969 10.3447 0.849983 10.1436 0.849999 9.92479V6.22522C0.849983 6.00635 0.849969 5.80534 0.863698 5.63731C0.878499 5.45615 0.912383 5.25795 1.01213 5.06219C1.15474 4.7823 1.3823 4.55474 1.66219 4.41213C1.85795 4.31238 2.05615 4.2785 2.23731 4.2637C2.40534 4.24997 2.60635 4.24998 2.82522 4.25C2.83263 4.25 2.84005 4.25 2.8475 4.25H5.1L5.1 3.67522C5.09998 3.45635 5.09997 3.25534 5.1137 3.08731C5.1285 2.90615 5.16238 2.70795 5.26213 2.51219C5.40474 2.2323 5.6323 2.00474 5.91219 1.86213C6.10795 1.76238 6.30615 1.7285 6.48731 1.7137C6.65534 1.69997 6.85635 1.69998 7.07521 1.7ZM2.8475 5.525C2.59896 5.525 2.45089 5.5255 2.34113 5.53446C2.27415 5.53994 2.24599 5.54716 2.23844 5.5495C2.2005 5.56949 2.16949 5.6005 2.1495 5.63844C2.14716 5.64599 2.13994 5.67415 2.13446 5.74113C2.1255 5.85089 2.125 5.99896 2.125 6.2475V9.9025C2.125 10.151 2.1255 10.2991 2.13446 10.4089C2.13994 10.4759 2.14716 10.504 2.1495 10.5116C2.16949 10.5495 2.2005 10.5805 2.23844 10.6005C2.24599 10.6028 2.27415 10.6101 2.34113 10.6155C2.35077 10.6163 2.36069 10.617 2.37095 10.6177C2.3751 10.6179 2.37923 10.6182 2.38336 10.6185C2.48872 10.6246 2.62944 10.625 2.8475 10.625H5.95V9.9875C5.95 9.63542 6.23542 9.35 6.5875 9.35C6.93958 9.35 7.225 9.63542 7.225 9.9875V10.625H9.775V9.9875C9.775 9.63542 10.0604 9.35 10.4125 9.35C10.7646 9.35 11.05 9.63542 11.05 9.9875V10.625H14.1525C14.3706 10.625 14.5113 10.6246 14.6166 10.6185C14.6208 10.6182 14.6249 10.6179 14.629 10.6177C14.6393 10.617 14.6492 10.6163 14.6589 10.6155C14.7259 10.6101 14.754 10.6028 14.7616 10.6005C14.7995 10.5805 14.8305 10.5495 14.8505 10.5116C14.8528 10.504 14.8601 10.4759 14.8655 10.4089C14.8745 10.2991 14.875 10.151 14.875 9.9025V6.2475C14.875 5.99896 14.8745 5.85089 14.8655 5.74113C14.8601 5.67415 14.8528 5.64599 14.8505 5.63844C14.8305 5.6005 14.7995 5.56949 14.7616 5.5495C14.754 5.54716 14.7259 5.53994 14.6589 5.53446C14.5491 5.5255 14.401 5.525 14.1525 5.525H2.8475ZM10.625 4.25H6.375V3.6975C6.375 3.44896 6.3755 3.30089 6.38446 3.19113C6.38994 3.12415 6.39716 3.09599 6.3995 3.08844C6.41949 3.0505 6.4505 3.01949 6.48844 2.9995C6.49599 2.99716 6.52415 2.98994 6.59113 2.98446C6.70089 2.9755 6.84896 2.975 7.0975 2.975H9.9025C10.151 2.975 10.2991 2.9755 10.4089 2.98446C10.4759 2.98994 10.504 2.99716 10.5116 2.9995C10.5495 3.01949 10.5805 3.0505 10.6005 3.08844C10.6028 3.09599 10.6101 3.12415 10.6155 3.19113C10.6245 3.30089 10.625 3.44896 10.625 3.6975V4.25ZM10.5997 3.08624C10.5997 3.08622 10.5999 3.08662 10.6002 3.0875ZM10.5138 3.00027C10.5137 3.00028 10.5133 3.00013 10.5125 2.9998ZM6.48624 3.00027C6.48622 3.00026 6.48662 3.0001 6.48751 2.9998ZM6.3998 3.08751C6.40009 3.08661 6.40026 3.08622 6.40027 3.08624ZM14.7638 5.55027C14.7637 5.55027 14.7633 5.55012 14.7625 5.54979ZM14.8497 5.63624C14.8497 5.63622 14.8499 5.63662 14.8502 5.63751ZM14.8497 10.5138C14.8497 10.5137 14.8499 10.5133 14.8502 10.5125ZM14.7638 10.5997C14.7638 10.5997 14.7634 10.5999 14.7625 10.6002ZM14.025 11.9H11.05V12.1125C11.05 12.4646 10.7646 12.75 10.4125 12.75C10.0604 12.75 9.775 12.4646 9.775 12.1125V11.9H7.225V12.1125C7.225 12.4646 6.93958 12.75 6.5875 12.75C6.23542 12.75 5.95 12.4646 5.95 12.1125V11.9H2.975V13.3025C2.975 13.551 2.9755 13.6991 2.98446 13.8089C2.98994 13.8759 2.99716 13.904 2.9995 13.9116C3.01949 13.9495 3.0505 13.9805 3.08844 14.0005C3.09599 14.0028 3.12415 14.0101 3.19113 14.0155C3.30089 14.0245 3.44896 14.025 3.6975 14.025H13.3025C13.551 14.025 13.6991 14.0245 13.8089 14.0155C13.8759 14.0101 13.904 14.0028 13.9116 14.0005C13.9495 13.9805 13.9805 13.9495 14.0005 13.9116C14.0028 13.904 14.0101 13.8759 14.0155 13.8089C14.0245 13.6991 14.025 13.551 14.025 13.3025V11.9ZM13.9997 13.9138C13.9997 13.9138 13.9999 13.9133 14.0002 13.9125ZM13.9138 13.9997C13.9138 13.9997 13.9134 13.9999 13.9125 14.0002ZM3.08624 13.9997C3.08627 13.9997 3.08672 13.9999 3.08751 14.0002ZM2.9998 13.9125C3.00013 13.9133 3.00028 13.9137 3.00027 13.9138ZM2.23624 10.5997C2.23627 10.5997 2.23671 10.5999 2.2375 10.6002ZM2.1498 10.5125C2.15013 10.5133 2.15028 10.5137 2.15027 10.5138ZM2.14979 5.63753C2.15009 5.63662 2.15026 5.63622 2.15027 5.63624ZM2.23753 5.54979C2.23672 5.55013 2.23627 5.55028 2.23624 5.55027Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeArrowRightGreenIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M8.80198 3.90289C9.02821 3.68997 9.3842 3.70076 9.59711 3.92698L12.5971 7.11448C12.801 7.33107 12.801 7.66893 12.5971 7.88552L9.59711 11.073C9.3842 11.2992 9.02821 11.31 8.80198 11.0971C8.57576 10.8842 8.56497 10.5282 8.77789 10.302L10.8856 8.0625H2.8125C2.50184 8.0625 2.25 7.81066 2.25 7.5C2.25 7.18934 2.50184 6.9375 2.8125 6.9375H10.8856L8.77789 4.69802C8.56497 4.47179 8.57576 4.1158 8.80198 3.90289Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeArrowRightGreenSmallIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M8.21518 3.64269C8.42633 3.44397 8.75858 3.45404 8.9573 3.66518L11.7573 6.64018C11.9476 6.84233 11.9476 7.15767 11.7573 7.35982L8.9573 10.3348C8.75858 10.546 8.42633 10.556 8.21518 10.3573C8.00404 10.1586 7.99397 9.82632 8.19269 9.61518L10.1599 7.525H2.625C2.33505 7.525 2.1 7.28995 2.1 7C2.1 6.71005 2.33505 6.475 2.625 6.475H10.1599L8.19269 4.38482C7.99397 4.17368 8.00404 3.84142 8.21518 3.64269Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeBadgeFireIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M5.00063 5.72766C4.92047 6.58266 4.86422 8.09578 5.36906 8.73984C5.36906 8.73984 5.13141 7.07766 7.26188 4.99219C8.11969 4.15266 8.31797 3.01078 8.01844 2.15437C7.84828 1.66922 7.5375 1.26844 7.2675 0.988594C7.11 0.824062 7.23094 0.552656 7.46016 0.5625C8.84672 0.624375 11.0939 1.00969 12.0487 3.40594C12.4678 4.45781 12.4987 5.54484 12.2991 6.65016C12.1725 7.35609 11.7225 8.92547 12.7491 9.11812C13.4817 9.25594 13.8361 8.67375 13.995 8.25469C14.0611 8.08031 14.2903 8.03672 14.4141 8.17594C15.6516 9.58359 15.757 11.2416 15.5011 12.6689C15.0061 15.428 12.2119 17.4361 9.43594 17.4361C5.96812 17.4361 3.20766 15.4519 2.49187 11.8603C2.20359 10.4105 2.34984 7.54172 4.58578 5.51672C4.75172 5.36484 5.02313 5.49984 5.00063 5.72766Z"
        fill="url(#paint0_radial_8334_97734)"
      />
      <path
        d="M10.703 10.8872C9.42469 9.24187 9.99703 7.36453 10.3106 6.61641C10.3528 6.51797 10.2403 6.42516 10.1517 6.48562C9.60187 6.85969 8.47547 7.74 7.95094 8.97891C7.24078 10.6537 7.29141 11.4736 7.71187 12.4748C7.965 13.0781 7.67109 13.2061 7.52344 13.2286C7.38 13.2511 7.24781 13.1555 7.14234 13.0556C6.83899 12.7643 6.62278 12.3942 6.51797 11.9869C6.49547 11.8997 6.38156 11.8758 6.32953 11.9475C5.93578 12.4917 5.73187 13.365 5.72203 13.9823C5.69109 15.8906 7.2675 17.4375 9.17437 17.4375C11.5777 17.4375 13.3284 14.7797 11.9475 12.5578C11.5467 11.9109 11.1698 11.4877 10.703 10.8872Z"
        fill="url(#paint1_radial_8334_97734)"
      />
    </g>
    <defs>
      <radialGradient
        id="paint0_radial_8334_97734"
        cx="0"
        cy="0"
        r="1"
        gradientTransform="matrix(-9.9263 -0.0430801 -0.0707745 16.2871 8.74909 17.4798)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.314" stopColor="#FF9800" />
        <stop offset="0.662" stopColor="#FF6D00" />
        <stop offset="0.972" stopColor="#F44336" />
      </radialGradient>
      <radialGradient
        id="paint1_radial_8334_97734"
        cx="0"
        cy="0"
        r="1"
        gradientTransform="matrix(-0.104904 10.3855 7.81589 0.0789379 9.30656 7.60196)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.214" stopColor="#FFF176" />
        <stop offset="0.328" stopColor="#FFF27D" />
        <stop offset="0.487" stopColor="#FFF48F" />
        <stop offset="0.672" stopColor="#FFF7AD" />
        <stop offset="0.793" stopColor="#FFF9C4" />
        <stop offset="0.822" stopColor="#FFF8BD" stopOpacity="0.804" />
        <stop offset="0.863" stopColor="#FFF6AB" stopOpacity="0.529" />
        <stop offset="0.91" stopColor="#FFF38D" stopOpacity="0.209" />
        <stop offset="0.941" stopColor="#FFF176" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);
export const TalentHomeBadgeTrophyAltIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M13.6575 8.34609C13.9697 8.08875 15.7725 6.97359 16.7597 6.03422C17.5303 5.30016 17.8284 3.38344 16.643 2.45109C15.1017 1.24031 13.6223 2.51156 13.6223 2.51156C13.6223 2.51156 13.493 1.79297 12.593 1.37109C11.4595 0.839531 10.0237 0.64125 8.70328 0.658125C7.42359 0.673594 6.24516 0.828281 5.19891 1.34156C4.26234 1.80141 4.20609 2.45672 4.20609 2.45672C4.20609 2.45672 2.97703 1.2825 1.47094 2.23594C-0.03375 3.19078 0.397969 5.10328 1.12219 5.90625C2.06578 6.9525 3.19922 7.48547 3.71391 7.87078C4.22719 8.25609 4.71938 8.62312 4.71938 8.95359C4.71938 9.28406 4.57312 9.35719 4.51687 9.33891C4.46203 9.32062 4.365 8.99859 4.11328 9.13641C3.77016 9.32625 3.87422 10.0913 4.59 10.1644C5.28328 10.2361 5.41547 9.50344 5.41547 9.50344L5.52516 8.78766L6.66281 9.57656L7.91016 10.6045L7.87359 11.4848C7.87359 11.4848 7.81875 12.1641 7.48828 12.7519C7.15781 13.3397 6.62625 13.9261 6.62625 13.9261L6.60938 14.4577L11.2345 14.348L11.0883 13.8347C11.0883 13.8347 10.492 13.1794 10.1334 12.4763C9.8775 11.9728 9.83672 11.4652 9.83672 11.4652L9.82547 10.2023L12.2259 8.73141C12.2259 8.73141 12.4833 8.93391 12.4467 9.00703C12.4102 9.08016 12.4017 9.82969 12.9783 10.1081C13.5478 10.3837 14.0062 10.035 13.9514 9.55687C13.8966 9.08016 13.6027 9.24469 13.5113 9.31781C13.4198 9.39094 13.2173 9.40922 13.1625 9.13359C13.1062 8.86078 13.3453 8.60344 13.6575 8.34609ZM1.84078 5.75016L1.29094 4.07672L1.95609 3.20625L2.70141 2.98828C2.70141 2.98828 3.65344 3.69844 3.68719 3.75609C3.72094 3.81375 4.29469 4.99359 4.29469 4.99359L5.05125 7.73297L1.84078 5.75016ZM12.6492 7.95094C12.6605 7.89328 13.3594 5.01609 13.3594 5.01609C13.3594 4.98234 13.8516 4.75313 13.8516 4.70672C13.8516 4.66031 14.7459 3.20484 14.7459 3.20484L16.2366 3.2625L16.5459 4.74047L15.8006 5.96672C15.802 5.96812 12.638 8.00719 12.6492 7.95094Z"
        fill="#FEC417"
      />
      <path
        d="M16.8638 4.30875C16.7541 2.99812 15.4575 2.68453 14.9245 2.87437C14.3916 3.06422 14.0456 3.42 13.9275 3.92625C13.8319 4.33547 13.7363 4.60828 13.6266 4.65047C13.5056 4.69547 13.3945 4.67719 13.3945 4.67719C13.3945 4.67719 13.3748 3.79125 13.3805 3.43406C13.3945 2.69719 13.6195 2.50875 13.6195 2.50875C13.6195 2.50875 13.5717 2.25984 13.4761 2.12203C13.3805 1.98562 13.2033 1.80844 13.2033 1.80844C13.2033 1.80844 13.2441 2.16281 13.0669 2.24578C12.8897 2.32875 12.6984 2.205 12.6984 2.205L12.8756 2.94187C12.8756 2.94187 12.5888 6.615 12.562 6.69656C12.5353 6.77812 11.4567 8.64844 11.4567 8.64844C11.4567 8.64844 10.8281 9.23625 10.5286 9.37266C10.2277 9.50906 9.96891 9.86484 8.80875 9.8775C7.64859 9.89156 6.65156 8.97609 6.65156 8.97609L5.65453 8.01984L4.91766 5.84859L4.80797 3.63656L4.85438 2.83219L4.88672 2.49609L4.83469 2.32594C4.83469 2.32594 4.73906 2.42156 4.56187 2.38078C4.38469 2.34 4.31578 2.10797 4.31578 2.10797C4.31578 2.10797 4.24687 2.21766 4.23422 2.2725C4.22016 2.32734 4.20609 2.45391 4.20609 2.45391C4.20609 2.45391 4.39734 2.655 4.43812 2.94187C4.47891 3.22875 4.42406 4.41703 4.22016 4.38891C4.01484 4.36219 4.08234 3.36516 3.30469 2.98266C2.63109 2.65078 1.62563 2.75062 1.215 3.58312C0.805781 4.41562 1.10531 5.39859 2.38922 6.31406C3.67312 7.22953 5.04 7.99875 5.25656 8.73281C5.51531 9.60609 4.92891 10.125 4.92891 10.125C4.92891 10.125 5.355 10.0659 5.56453 9.60891C5.63203 9.46125 5.65734 9.24609 5.66719 9.11812C6.15234 9.75094 6.79781 10.2867 7.65281 10.5455C7.97625 10.6566 8.34047 10.7128 8.84672 10.7128C8.91984 10.7128 8.99156 10.71 9.06328 10.7072C9.65531 10.6861 10.1616 10.575 10.6523 10.3317C11.3147 10.0252 11.828 9.55687 12.2245 9.02531C12.2133 9.15188 12.2906 9.46687 12.4383 9.71578C12.697 10.1531 13.1344 10.1798 13.1344 10.1798C13.1344 10.1798 12.5339 9.82547 12.6562 8.97891C12.7786 8.13234 13.3383 7.83141 14.1848 7.28578C15.0342 6.73875 16.972 5.61937 16.8638 4.30875ZM2.99109 6.16641C2.61 5.89781 1.94203 5.53922 1.66641 4.99219C1.29937 4.26234 1.5975 3.38063 2.295 3.27234C3.74344 3.04453 3.77016 4.84313 3.86578 5.06109C3.96141 5.27906 4.23422 5.29312 4.23422 5.29312C4.23422 5.29312 4.24406 5.41406 4.28344 5.6475C4.28484 5.65453 4.28625 5.66016 4.28625 5.66719L4.29047 5.68828C4.31719 5.84719 4.35516 6.04547 4.40859 6.27187L4.41281 6.28875C4.44234 6.41672 4.47328 6.53766 4.50562 6.64875C4.57031 6.88219 4.64906 7.13391 4.74609 7.39266C4.60547 7.29703 3.79969 6.73875 2.99109 6.16641ZM16.1128 5.15531C15.8105 5.64469 15.1988 6.00891 14.7473 6.31547C14.1652 6.71062 13.2989 7.30406 13.0542 7.47C13.1105 7.32094 13.1597 7.17328 13.2047 7.02844C13.2778 6.83719 13.3552 6.60375 13.4086 6.35203C13.5492 5.69109 13.5731 5.11312 13.5731 5.11312C13.5731 5.11312 13.86 5.19469 14.0372 5.00344C14.2144 4.81219 14.2805 4.21875 14.4464 3.93891C14.7052 3.50156 15.2241 3.05156 16.0031 3.59719C16.4531 3.91359 16.47 4.57594 16.1128 5.15531ZM8.51063 11.153L9.30516 11.1431C9.30516 11.1431 9.32625 12.0108 9.45141 12.6577C9.57656 13.3059 9.74391 14.0259 9.74391 14.0259C9.74391 14.0259 8.12531 14.5688 8.13516 13.9838C8.145 13.3988 8.38547 12.2597 8.38547 12.2597C8.38547 12.2597 8.53172 10.9027 8.51063 11.153Z"
        fill="#FFA828"
      />
      <path
        d="M7.17736 2.13609C7.17736 2.13609 8.06189 2.03625 8.88455 2.04891C9.70721 2.06156 10.5538 2.22328 10.5538 2.22328C10.5538 2.22328 10.5046 4.97672 10.3541 6.52219C10.205 8.06766 9.62002 9.225 9.46393 9.55266C9.31346 9.87047 9.20377 10.0406 9.20377 10.0406L8.41064 9.94781L7.03955 7.19438L7.17736 2.13609Z"
        fill="#FFA828"
      />
      <path
        d="M6.11837 2.54813C6.11837 2.54813 6.36728 2.42297 6.72869 2.28656C7.05634 2.16281 7.35166 2.12484 7.35166 2.12484C7.35166 2.12484 7.36009 3.95016 7.38962 5.25234C7.41494 6.36187 7.82556 8.18016 8.02525 8.66672C8.22494 9.15328 8.58494 9.89578 8.58494 9.89578C8.58494 9.89578 7.86072 9.79172 7.41494 9.22641C7.18009 8.92828 6.08181 6.62203 6.04384 5.10187C6.00587 3.58172 6.15494 2.51016 6.11837 2.54813Z"
        fill="#FFEFAB"
      />
      <path
        d="M5.70656 2.75906C5.68125 2.83359 5.48297 4.40438 5.79375 5.86125C6.10453 7.31813 6.56437 8.31516 6.86812 8.71031C7.13812 9.06047 7.31391 9.22641 7.41375 9.22641C7.51359 9.22641 7.00312 8.01844 6.76547 7.07062C6.52922 6.12422 6.40406 4.98937 6.37875 4.42969C6.35344 3.86859 6.32953 2.42297 6.32953 2.42297C6.32953 2.42297 6.05531 2.54812 5.99344 2.58469C5.93156 2.62266 5.70656 2.75906 5.70656 2.75906Z"
        fill="#FFFCFD"
      />
      <path
        d="M7.50094 13.9233C7.50094 13.9233 8.03672 13.0514 8.14922 12.3905C8.26172 11.7295 8.32359 11.1445 8.32359 11.1445L8.65547 11.1586C8.65547 11.1586 8.62312 12.1162 8.58516 12.7645C8.54719 13.4128 8.43609 14.0484 8.43609 14.0484L7.50094 13.9233Z"
        fill="#FFEFAB"
      />
      <path
        d="M7.91297 10.6045C7.91297 10.6045 8.16187 10.3613 8.84672 10.3613C9.53156 10.3613 9.82547 10.6242 9.82547 10.6242L9.84375 11.4694C9.84375 11.4694 9.38812 11.3273 8.83406 11.3203C8.37281 11.3147 7.87641 11.4863 7.87641 11.4863L7.91297 10.6045ZM4.92187 2.21062C5.03719 2.10375 6.1425 1.27406 8.75953 1.25156C11.5748 1.22625 12.6309 2.04187 12.697 2.08687C12.7716 2.13609 12.8587 2.36109 12.8222 2.46094C12.7842 2.56078 12.7097 2.59734 12.4987 2.51016C12.2864 2.42297 11.2402 1.65937 8.72297 1.73812C6.30562 1.81266 5.28047 2.54812 5.17219 2.61C5.085 2.65922 4.92328 2.67188 4.84875 2.57203C4.77281 2.47359 4.84734 2.28094 4.92187 2.21062ZM12.8222 2.79703C12.4987 2.82234 12.7223 5.42672 12.0375 7.05797C11.3034 8.80312 10.3669 9.30094 10.4048 9.40078C10.4428 9.50062 11.3597 9.22359 11.9377 8.40375C12.4734 7.64437 12.7969 6.97078 12.9473 6.07359C13.095 5.17641 13.1822 2.76891 12.8222 2.79703ZM4.85297 3.09516C4.77141 3.09094 4.85437 4.39031 4.72219 4.96125C4.67156 5.18062 4.54781 5.22562 4.53516 5.27484C4.5225 5.32406 4.80656 6.99609 5.28328 7.73016C5.74453 8.44031 6.65437 9.32484 6.80344 9.17578C6.9525 9.02672 6.1425 8.5275 5.59547 7.44328C5.28047 6.82172 4.95984 5.88516 4.94719 4.81359C4.93875 4.10484 5.02734 3.105 4.85297 3.09516Z"
        fill="#D1701C"
      />
      <path
        d="M12.2018 15.8498L12.2004 13.8403H5.74994C5.76963 13.8403 5.75416 15.4744 5.75135 15.8569H4.83447V17.3123H13.0259V15.8569L12.2018 15.8498Z"
        fill="#865C50"
      />
      <path
        d="M7.81721 14.8964C7.6583 14.8894 7.47549 14.9217 7.46846 15.1186C7.46143 15.3155 7.46143 15.885 7.46143 15.9933C7.46143 16.1016 7.55002 16.1958 7.77221 16.2028C7.99439 16.2098 10.0799 16.2028 10.2261 16.2028C10.3724 16.2028 10.4483 16.0762 10.4539 15.9497C10.461 15.8231 10.4469 15.2902 10.4469 15.1453C10.4469 14.9048 10.2317 14.9048 10.0855 14.9048C9.92799 14.902 7.81721 14.8964 7.81721 14.8964Z"
        fill="#FCC219"
      />
    </g>
  </svg>
);
export const TalentHomeBadgeTrophyIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M12.8988 7.88242C13.1936 7.63937 14.8963 6.58617 15.8286 5.69898C16.5564 5.0057 16.838 3.19547 15.7184 2.31492C14.2627 1.17141 12.8655 2.37203 12.8655 2.37203C12.8655 2.37203 12.7434 1.69336 11.8934 1.29492C10.8229 0.792891 9.46688 0.605625 8.21977 0.621562C7.01117 0.636172 5.8982 0.782266 4.91008 1.26703C4.02555 1.70133 3.97242 2.32023 3.97242 2.32023C3.97242 2.32023 2.81164 1.21125 1.38922 2.11172C-0.031875 3.01352 0.375859 4.81976 1.05984 5.57812C1.95102 6.56625 3.02148 7.06961 3.50758 7.43351C3.99234 7.79742 4.45719 8.14406 4.45719 8.45617C4.45719 8.76828 4.31906 8.83734 4.26594 8.82008C4.21414 8.80281 4.1225 8.49867 3.88477 8.62883C3.5607 8.80812 3.65898 9.53062 4.335 9.59969C4.98977 9.66742 5.11461 8.97547 5.11461 8.97547L5.2182 8.29945L6.29266 9.04453L7.4707 10.0154L7.43617 10.8468C7.43617 10.8468 7.38437 11.4883 7.07227 12.0434C6.76016 12.5986 6.25813 13.1524 6.25813 13.1524L6.24219 13.6545L10.6104 13.5509L10.4723 13.0661C10.4723 13.0661 9.90914 12.4472 9.57047 11.7831C9.32875 11.3077 9.29023 10.8282 9.29023 10.8282L9.27961 9.63555L11.5467 8.24633C11.5467 8.24633 11.7898 8.43758 11.7552 8.50664C11.7207 8.5757 11.7127 9.28359 12.2573 9.54656C12.7952 9.80687 13.2281 9.4775 13.1763 9.02594C13.1245 8.5757 12.847 8.73109 12.7606 8.80016C12.6743 8.86922 12.483 8.88648 12.4312 8.62617C12.3781 8.36851 12.6039 8.12547 12.8988 7.88242ZM1.73852 5.4307L1.21922 3.85023L1.84742 3.02812L2.55133 2.82227C2.55133 2.82227 3.45047 3.49297 3.48234 3.54742C3.51422 3.60187 4.05609 4.71617 4.05609 4.71617L4.77062 7.30336L1.73852 5.4307ZM11.9465 7.50922C11.9571 7.45476 12.6172 4.73742 12.6172 4.73742C12.6172 4.70555 13.082 4.48906 13.082 4.44523C13.082 4.40141 13.9267 3.0268 13.9267 3.0268L15.3345 3.08125L15.6267 4.47711L14.9228 5.63523C14.9241 5.63656 11.9359 7.56234 11.9465 7.50922Z"
        fill="#FEC417"
      />
      <path
        d="M15.9269 4.06937C15.8233 2.83156 14.5988 2.53539 14.0954 2.71469C13.592 2.89398 13.2653 3.23 13.1538 3.70812C13.0634 4.09461 12.9731 4.35227 12.8695 4.39211C12.7553 4.43461 12.6504 4.41734 12.6504 4.41734C12.6504 4.41734 12.6318 3.58062 12.6371 3.24328C12.6504 2.54734 12.8629 2.36937 12.8629 2.36937C12.8629 2.36937 12.8177 2.1343 12.7274 2.00414C12.6371 1.87531 12.4698 1.70797 12.4698 1.70797C12.4698 1.70797 12.5083 2.04266 12.3409 2.12102C12.1736 2.19937 11.993 2.0825 11.993 2.0825L12.1603 2.77844C12.1603 2.77844 11.8894 6.2475 11.8641 6.32453C11.8389 6.40156 10.8202 8.16797 10.8202 8.16797C10.8202 8.16797 10.2266 8.72312 9.94367 8.85195C9.65945 8.98078 9.41508 9.3168 8.31937 9.32875C7.22367 9.34203 6.28203 8.47742 6.28203 8.47742L5.34039 7.5743L4.64445 5.52367L4.54086 3.43453L4.58469 2.67484L4.61523 2.35742L4.56609 2.19672C4.56609 2.19672 4.47578 2.28703 4.30844 2.24852C4.14109 2.21 4.07602 1.99086 4.07602 1.99086C4.07602 1.99086 4.01094 2.09445 3.99898 2.14625C3.9857 2.19805 3.97242 2.31758 3.97242 2.31758C3.97242 2.31758 4.15305 2.5075 4.19156 2.77844C4.23008 3.04937 4.17828 4.17164 3.9857 4.14508C3.7918 4.11984 3.85555 3.1782 3.12109 2.81695C2.48492 2.50352 1.53531 2.59781 1.1475 3.38406C0.761016 4.17031 1.04391 5.09867 2.25648 5.96328C3.46906 6.82789 4.76 7.55437 4.96453 8.24766C5.20891 9.07242 4.65508 9.5625 4.65508 9.5625C4.65508 9.5625 5.0575 9.50672 5.25539 9.07508C5.31914 8.93562 5.34305 8.73242 5.35234 8.61156C5.81055 9.20922 6.42016 9.71523 7.22766 9.95961C7.53312 10.0645 7.87711 10.1177 8.35523 10.1177C8.4243 10.1177 8.49203 10.115 8.55977 10.1123C9.11891 10.0924 9.59703 9.9875 10.0605 9.75773C10.6861 9.4682 11.1709 9.02594 11.5454 8.52391C11.5348 8.64344 11.6078 8.94094 11.7473 9.17601C11.9916 9.58906 12.4047 9.6143 12.4047 9.6143C12.4047 9.6143 11.8376 9.27961 11.9531 8.48008C12.0687 7.68055 12.5973 7.39633 13.3968 6.88102C14.199 6.36437 16.0291 5.30719 15.9269 4.06937ZM2.82492 5.82383C2.465 5.57016 1.83414 5.23148 1.57383 4.71484C1.22719 4.02555 1.50875 3.19281 2.1675 3.09055C3.53547 2.87539 3.5607 4.57406 3.65102 4.77992C3.74133 4.98578 3.99898 4.99906 3.99898 4.99906C3.99898 4.99906 4.00828 5.11328 4.04547 5.33375C4.0468 5.34039 4.04812 5.3457 4.04812 5.35234L4.05211 5.37227C4.07734 5.52234 4.1132 5.70961 4.16367 5.92344L4.16766 5.93937C4.19555 6.06023 4.22477 6.17445 4.25531 6.27937C4.31641 6.49984 4.39078 6.73758 4.48242 6.98195C4.34961 6.89164 3.58859 6.36437 2.82492 5.82383ZM15.2177 4.86891C14.9321 5.33109 14.3544 5.67508 13.928 5.96461C13.3782 6.33781 12.5601 6.89828 12.329 7.055C12.3821 6.91422 12.4286 6.77477 12.4711 6.63797C12.5402 6.45734 12.6132 6.23687 12.6637 5.99914C12.7965 5.37492 12.8191 4.82906 12.8191 4.82906C12.8191 4.82906 13.09 4.90609 13.2573 4.72547C13.4247 4.54484 13.4871 3.98437 13.6438 3.72008C13.8882 3.30703 14.3783 2.88203 15.1141 3.39734C15.5391 3.69617 15.555 4.32172 15.2177 4.86891ZM8.03781 10.5334L8.7882 10.5241C8.7882 10.5241 8.80812 11.3435 8.92633 11.9545C9.04453 12.5667 9.20258 13.2467 9.20258 13.2467C9.20258 13.2467 7.67391 13.7594 7.6832 13.2069C7.6925 12.6544 7.91961 11.5786 7.91961 11.5786C7.91961 11.5786 8.05773 10.297 8.03781 10.5334Z"
        fill="#FFA828"
      />
      <path
        d="M6.77862 2.01742C6.77862 2.01742 7.61401 1.92313 8.39096 1.93508C9.16792 1.94703 9.96745 2.09977 9.96745 2.09977C9.96745 2.09977 9.92096 4.70024 9.77885 6.15984C9.63807 7.61945 9.08557 8.7125 8.93815 9.02195C8.79604 9.32211 8.69245 9.48281 8.69245 9.48281L7.94339 9.39516L6.64846 6.79469L6.77862 2.01742Z"
        fill="#FFA828"
      />
      <path
        d="M5.77846 2.40656C5.77846 2.40656 6.01354 2.28836 6.35487 2.15953C6.66432 2.04266 6.94323 2.0068 6.94323 2.0068C6.94323 2.0068 6.9512 3.7307 6.97909 4.96055C7.003 6.00844 7.39081 7.7257 7.5794 8.18523C7.768 8.64477 8.108 9.34602 8.108 9.34602C8.108 9.34602 7.42401 9.24773 7.003 8.71383C6.7812 8.43227 5.74393 6.25414 5.70807 4.81844C5.67221 3.38273 5.813 2.3707 5.77846 2.40656Z"
        fill="#FFEFAB"
      />
      <path
        d="M5.38953 2.60578C5.36562 2.67617 5.17836 4.15969 5.47187 5.53562C5.76539 6.91156 6.19969 7.8532 6.48656 8.22641C6.74156 8.55711 6.90758 8.71383 7.00187 8.71383C7.09617 8.71383 6.61406 7.57297 6.38961 6.67781C6.16648 5.78398 6.04828 4.71219 6.02437 4.18359C6.00047 3.65367 5.97789 2.28836 5.97789 2.28836C5.97789 2.28836 5.71891 2.40656 5.66047 2.44109C5.60203 2.47695 5.38953 2.60578 5.38953 2.60578Z"
        fill="#FFFCFD"
      />
      <path
        d="M7.08422 13.1498C7.08422 13.1498 7.59023 12.3263 7.69648 11.7021C7.80273 11.0779 7.86117 10.5254 7.86117 10.5254L8.17461 10.5387C8.17461 10.5387 8.14406 11.4431 8.1082 12.0554C8.07234 12.6677 7.96742 13.268 7.96742 13.268L7.08422 13.1498Z"
        fill="#FFEFAB"
      />
      <path
        d="M7.47336 10.0154C7.47336 10.0154 7.70844 9.78562 8.35523 9.78562C9.00203 9.78562 9.27961 10.034 9.27961 10.034L9.29687 10.8322C9.29687 10.8322 8.86656 10.698 8.34328 10.6914C7.90766 10.6861 7.43883 10.8481 7.43883 10.8481L7.47336 10.0154ZM4.64844 2.08781C4.75734 1.98687 5.80125 1.20328 8.27289 1.18203C10.9318 1.15812 11.9292 1.92844 11.9916 1.97094C12.062 2.01742 12.1444 2.22992 12.1098 2.32422C12.074 2.41852 12.0036 2.45305 11.8044 2.3707C11.6038 2.28836 10.6157 1.56719 8.23836 1.64156C5.95531 1.71195 4.98711 2.40656 4.88484 2.465C4.8025 2.51148 4.64977 2.52344 4.57937 2.42914C4.50766 2.33617 4.57805 2.15422 4.64844 2.08781ZM12.1098 2.64164C11.8044 2.66555 12.0155 5.12523 11.3687 6.66586C10.6755 8.31406 9.79094 8.78422 9.8268 8.87852C9.86266 8.97281 10.7286 8.71117 11.2745 7.93687C11.7805 7.21969 12.0859 6.58352 12.228 5.73617C12.3675 4.88883 12.4498 2.61508 12.1098 2.64164ZM4.58336 2.9232C4.50633 2.91922 4.58469 4.14641 4.45984 4.68562C4.41203 4.89281 4.29516 4.93531 4.2832 4.9818C4.27125 5.02828 4.53953 6.60742 4.98977 7.3007C5.42539 7.97141 6.28469 8.8068 6.42547 8.66602C6.56625 8.52523 5.80125 8.05375 5.28461 7.02977C4.98711 6.44273 4.6843 5.5582 4.67234 4.54617C4.66437 3.8768 4.74805 2.9325 4.58336 2.9232Z"
        fill="#D1701C"
      />
      <path
        d="M11.5239 14.9693L11.5226 13.0714H5.4305C5.44909 13.0714 5.43448 14.6147 5.43183 14.9759H4.56589V16.3505H12.3022V14.9759L11.5239 14.9693Z"
        fill="#865C50"
      />
      <path
        d="M7.38292 14.0688C7.23284 14.0622 7.06018 14.0927 7.05354 14.2787C7.0469 14.4646 7.0469 15.0025 7.0469 15.1048C7.0469 15.207 7.13057 15.296 7.34042 15.3027C7.55026 15.3093 9.51987 15.3027 9.658 15.3027C9.79612 15.3027 9.86784 15.1831 9.87315 15.0636C9.87979 14.9441 9.86651 14.4407 9.86651 14.3039C9.86651 14.0768 9.66331 14.0768 9.52518 14.0768C9.37643 14.0741 7.38292 14.0688 7.38292 14.0688Z"
        fill="#FCC219"
      />
    </g>
  </svg>
);
export const TalentHomeCardTargetIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M8.5 0.85C8.85208 0.85 9.1375 1.13542 9.1375 1.4875V2.58375C11.9144 2.87954 14.1205 5.08562 14.4162 7.8625H15.5125C15.8646 7.8625 16.15 8.14792 16.15 8.5C16.15 8.85208 15.8646 9.1375 15.5125 9.1375H14.4162C14.1205 11.9144 11.9144 14.1205 9.1375 14.4162V15.5125C9.1375 15.8646 8.85208 16.15 8.5 16.15C8.14792 16.15 7.8625 15.8646 7.8625 15.5125V14.4162C5.08562 14.1205 2.87954 11.9144 2.58375 9.1375L1.4875 9.1375C1.13542 9.1375 0.85 8.85208 0.85 8.5C0.85 8.14792 1.13542 7.8625 1.4875 7.8625L2.58375 7.8625C2.87954 5.08562 5.08562 2.87954 7.8625 2.58375V1.4875C7.8625 1.13542 8.14792 0.85 8.5 0.85ZM8.5 3.825C5.91807 3.825 3.825 5.91807 3.825 8.5C3.825 11.0819 5.91807 13.175 8.5 13.175C11.0819 13.175 13.175 11.0819 13.175 8.5C13.175 5.91807 11.0819 3.825 8.5 3.825ZM8.5 7.225C7.79584 7.225 7.225 7.79584 7.225 8.5C7.225 9.20416 7.79584 9.775 8.5 9.775C9.20416 9.775 9.775 9.20416 9.775 8.5C9.775 7.79584 9.20416 7.225 8.5 7.225ZM5.95 8.5C5.95 7.09167 7.09167 5.95 8.5 5.95C9.90833 5.95 11.05 7.09167 11.05 8.5C11.05 9.90833 9.90833 11.05 8.5 11.05C7.09167 11.05 5.95 9.90833 5.95 8.5Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeCheckWhiteIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M14.3114 4.68736C14.6739 4.98016 14.7304 5.5114 14.4376 5.87391L8.53139 13.1864C8.3776 13.3768 8.1487 13.4911 7.90409 13.4995C7.65947 13.5079 7.42325 13.4097 7.2567 13.2304L3.60046 9.29288C3.28337 8.9514 3.30314 8.41754 3.64462 8.10045C3.98609 7.78337 4.51996 7.80314 4.83704 8.14462L7.83058 11.3684L13.1249 4.81359C13.4177 4.45108 13.9489 4.39456 14.3114 4.68736Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="white"
      />
    </g>
  </svg>
);
export const TalentHomeChevronIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M4.23966 5.9504C4.5432 5.66855 5.01774 5.68613 5.2996 5.98966L8 8.89779L10.7004 5.98966C10.9823 5.68613 11.4568 5.66855 11.7603 5.95041C12.0639 6.23226 12.0814 6.70681 11.7996 7.01034L8.54959 10.5103C8.40769 10.6632 8.20855 10.75 8 10.75C7.79145 10.75 7.59231 10.6632 7.4504 10.5103L4.2004 7.01034C3.91855 6.7068 3.93613 6.23226 4.23966 5.9504Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1C2A21"
      />
    </g>
  </svg>
);
export const TalentHomeChipLockIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M4.2 3.5C4.2 1.9536 5.4536 0.7 7 0.7C8.5464 0.7 9.8 1.9536 9.8 3.5V5.6H10.675C11.7381 5.6 12.6 6.46185 12.6 7.525V11.375C12.6 12.4381 11.7381 13.3 10.675 13.3H3.325C2.26185 13.3 1.4 12.4381 1.4 11.375V7.525C1.4 6.46185 2.26185 5.6 3.325 5.6H4.2V3.5ZM5.25 5.6H8.75V3.5C8.75 2.5335 7.9665 1.75 7 1.75C6.0335 1.75 5.25 2.5335 5.25 3.5V5.6ZM3.325 6.65C2.84175 6.65 2.45 7.04175 2.45 7.525V11.375C2.45 11.8582 2.84175 12.25 3.325 12.25H10.675C11.1582 12.25 11.55 11.8582 11.55 11.375V7.525C11.55 7.04175 11.1582 6.65 10.675 6.65H3.325ZM7 8.4C7.28995 8.4 7.525 8.63505 7.525 8.925V9.975C7.525 10.2649 7.28995 10.5 7 10.5C6.71005 10.5 6.475 10.2649 6.475 9.975V8.925C6.475 8.63505 6.71005 8.4 7 8.4Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeClockIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M8.5 2.125C4.97918 2.125 2.125 4.97918 2.125 8.5C2.125 12.0208 4.97918 14.875 8.5 14.875C12.0208 14.875 14.875 12.0208 14.875 8.5C14.875 4.97918 12.0208 2.125 8.5 2.125ZM0.85 8.5C0.85 4.27502 4.27502 0.85 8.5 0.85C12.725 0.85 16.15 4.27502 16.15 8.5C16.15 12.725 12.725 16.15 8.5 16.15C4.27502 16.15 0.85 12.725 0.85 8.5ZM8.2875 4.25C8.63958 4.25 8.925 4.53542 8.925 4.8875V8.075H10.4125C10.7646 8.075 11.05 8.36042 11.05 8.7125C11.05 9.06458 10.7646 9.35 10.4125 9.35H8.2875C7.93542 9.35 7.65 9.06458 7.65 8.7125V4.8875C7.65 4.53542 7.93542 4.25 8.2875 4.25Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeCommunityChatIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M6.8 2.125C4.10941 2.125 2.125 3.93713 2.125 5.95C2.125 6.66259 2.50545 7.4842 3.11787 8.15071L3.12271 8.15598C3.58961 8.66412 3.9457 9.05166 4.19719 9.33473C4.32331 9.47667 4.42819 9.59801 4.50986 9.69852C4.584 9.78976 4.66507 9.89504 4.72035 9.99616C4.73117 10.016 4.74225 10.0361 4.75304 10.0557C4.77374 10.0932 4.79337 10.1289 4.80798 10.1565C4.83357 10.2049 4.86329 10.2644 4.88865 10.3365C4.914 10.4085 4.9281 10.4736 4.93844 10.5273C4.94435 10.558 4.95135 10.5981 4.95874 10.6404C4.96259 10.6624 4.96654 10.685 4.97049 10.7072C4.99813 10.8623 5.00188 11.0291 4.99764 11.2026C5.28716 10.8965 5.58847 10.5872 5.84133 10.3479C5.97288 10.2234 6.10216 10.1075 6.21558 10.0192C6.27125 9.9758 6.33671 9.92831 6.40568 9.88862L6.40807 9.88724C6.45021 9.86293 6.60268 9.775 6.8 9.775C9.49059 9.775 11.475 7.96287 11.475 5.95C11.475 3.93713 9.49059 2.125 6.8 2.125ZM0.85 5.95C0.85 3.03373 3.62256 0.85 6.8 0.85C9.97744 0.85 12.75 3.03373 12.75 5.95C12.75 8.81401 10.0759 10.9715 6.97042 11.0479C6.90697 11.0996 6.82209 11.1752 6.71769 11.274C6.47839 11.5004 6.17852 11.8087 5.88025 12.1249C5.58358 12.4394 5.29509 12.7548 5.08032 12.9919C4.97306 13.1104 4.88448 13.2091 4.82282 13.278L4.75159 13.3578L4.72734 13.3851C4.54649 13.589 4.25565 13.6558 4.00413 13.5507C3.75261 13.4455 3.59578 13.1921 3.61391 12.9201L3.68024 11.9252C3.70153 11.6058 3.71632 11.3826 3.72183 11.2131C3.72747 11.0394 3.72128 10.9646 3.71527 10.9309C3.70866 10.8938 3.70374 10.8656 3.69973 10.8425C3.69423 10.811 3.69044 10.7892 3.6864 10.7682C3.6858 10.7651 3.68526 10.7623 3.68479 10.76C3.68369 10.7579 3.6824 10.7554 3.68092 10.7526C3.67091 10.7337 3.66025 10.7144 3.64478 10.6863C3.63359 10.666 3.61987 10.6412 3.60206 10.6086C3.60308 10.6105 3.60271 10.6099 3.60035 10.6066C3.59371 10.5971 3.57136 10.5653 3.52035 10.5026C3.45628 10.4237 3.36587 10.3187 3.24405 10.1816C3.00054 9.90749 2.65172 9.52783 2.17901 9.01337C1.4236 8.19123 0.85 7.07592 0.85 5.95ZM14.1145 6.71248C14.3723 6.47261 14.7756 6.4871 15.0155 6.74483C15.716 7.49752 16.15 8.46852 16.15 9.53889C16.15 10.4007 15.7722 11.2478 15.2554 11.9158C14.7882 12.5197 14.4417 12.9676 14.2018 13.2859C14.0816 13.4452 13.992 13.567 13.9289 13.6569C13.8823 13.7234 13.8603 13.7583 13.8524 13.7708C13.8485 13.777 13.8481 13.7777 13.8497 13.7742C13.8258 13.8249 13.8037 13.8703 13.7894 13.8995C13.7871 13.9043 13.7849 13.9087 13.783 13.9126C13.7824 13.9168 13.7818 13.9216 13.781 13.9269C13.7765 13.9594 13.7694 14.01 13.7608 14.0661C13.7462 14.1615 13.754 14.3433 13.7931 14.9377L13.8281 15.4707C13.8461 15.7434 13.6881 15.9972 13.4356 16.1016C13.183 16.2061 12.8919 16.1379 12.712 15.9321L12.7109 15.9307L12.6915 15.9087L12.6319 15.8409C12.5802 15.7823 12.5059 15.6984 12.416 15.5977C12.2358 15.3959 11.9939 15.1278 11.7453 14.8606C11.4952 14.5916 11.2448 14.3306 11.0458 14.1396C10.9734 14.0702 10.9134 14.0154 10.8663 13.975C9.95618 13.9469 9.10204 13.7114 8.36834 13.3167C8.05828 13.1499 7.94215 12.7633 8.10896 12.4533C8.27577 12.1432 8.66235 12.0271 8.97241 12.1939C9.56705 12.5138 10.2791 12.7028 11.05 12.7028C11.2456 12.7028 11.3947 12.7902 11.4327 12.8124L11.4355 12.8141C11.4993 12.8514 11.5585 12.8951 11.607 12.9334C11.706 13.0116 11.8173 13.1129 11.9286 13.2197C12.1046 13.3886 12.3077 13.5976 12.5097 13.8115C12.5122 13.7939 12.5143 13.7788 12.5163 13.7641C12.5186 13.748 12.5208 13.7325 12.5233 13.7151C12.529 13.6759 12.5386 13.6114 12.5606 13.5393C12.5826 13.4671 12.6107 13.4083 12.6279 13.3726C12.6355 13.3567 12.6424 13.3426 12.6495 13.328C12.6625 13.3015 12.6764 13.2731 12.6975 13.2283C12.7438 13.1303 12.8186 13.0195 12.8852 12.9245C12.9609 12.8167 13.0609 12.6811 13.1837 12.5183C13.429 12.1929 13.7804 11.7387 14.2436 11.14L14.2469 11.1357C14.6454 10.6205 14.875 10.0405 14.875 9.53889C14.875 8.82611 14.5884 8.15735 14.0822 7.61346C13.8423 7.35573 13.8568 6.95234 14.1145 6.71248Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeCustomizeIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M6.63771 2.56393C6.71325 2.26802 6.81923 2.05806 6.93705 1.92907C7.0425 1.81363 7.16661 1.75 7.35 1.75C7.7366 1.75 8.05 2.0634 8.05 2.45C8.05 2.73995 8.28505 2.975 8.575 2.975C8.86495 2.975 9.1 2.73995 9.1 2.45C9.1 1.4835 8.3165 0.7 7.35 0.7C6.85684 0.7 6.45595 0.898871 6.16178 1.22093C5.88176 1.5275 5.71493 1.92565 5.61568 2.32267C5.61334 2.33201 5.61126 2.3414 5.60945 2.35086L4.84996 6.30017H3.15C2.86005 6.30017 2.625 6.53522 2.625 6.82517C2.625 7.11512 2.86005 7.35017 3.15 7.35017H4.64804L3.86229 11.4361C3.78675 11.732 3.68077 11.9419 3.56294 12.0709C3.4575 12.1864 3.33339 12.25 3.15 12.25C2.7634 12.25 2.45 11.9366 2.45 11.55C2.45 11.2601 2.21495 11.025 1.925 11.025C1.63505 11.025 1.4 11.2601 1.4 11.55C1.4 12.5165 2.1835 13.3 3.15 13.3C3.64316 13.3 4.04405 13.1011 4.33822 12.7791C4.61824 12.4725 4.78507 12.0743 4.88432 11.6773C4.88666 11.668 4.88874 11.6586 4.89055 11.6491L5.71728 7.35017H7.90034C7.95182 7.35017 8.00068 7.37283 8.03393 7.41213L9.46227 9.10017L7.82422 11.0361C7.63693 11.2574 7.66454 11.5887 7.88588 11.7759C8.10722 11.9632 8.43849 11.9356 8.62578 11.7143L10.15 9.91294L11.6742 11.7143C11.8615 11.9356 12.1928 11.9632 12.4141 11.7759C12.6355 11.5887 12.6631 11.2574 12.4758 11.0361L10.8377 9.10017L12.4758 7.16429C12.6631 6.94295 12.6355 6.61168 12.4141 6.42439C12.1928 6.2371 11.8615 6.26471 11.6742 6.48605L10.15 8.2874L8.83549 6.73389C8.60273 6.45882 8.26067 6.30017 7.90034 6.30017H5.9192L6.63771 2.56393Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeDoodleStarGold20 = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path d="M10 0C11 7 13 9 20 10C13 11 11 13 10 20C9 13 7 11 0 10C7 9 9 7 10 0Z" fill="#FFD86B" />
  </svg>
);
export const TalentHomeDoodleStarGold9 = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="9"
    height="9"
    viewBox="0 0 9 9"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M4.5 0C4.95 3.15 5.85 4.05 9 4.5C5.85 4.95 4.95 5.85 4.5 9C4.05 5.85 3.15 4.95 0 4.5C3.15 4.05 4.05 3.15 4.5 0Z"
      fill="#FFD86B"
    />
  </svg>
);
export const TalentHomeDoodleStarGoldLarge = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M12 0C13.2 8.4 15.6 10.8 24 12C15.6 13.2 13.2 15.6 12 24C10.8 15.6 8.4 13.2 0 12C8.4 10.8 10.8 8.4 12 0Z"
      fill="#FFD86B"
    />
  </svg>
);
export const TalentHomeDoodleStarGoldMedium = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M5 0C5.5 3.5 6.5 4.5 10 5C6.5 5.5 5.5 6.5 5 10C4.5 6.5 3.5 5.5 0 5C3.5 4.5 4.5 3.5 5 0Z"
      fill="#FFD86B"
    />
  </svg>
);
export const TalentHomeDoodleStarLime9 = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="9"
    height="9"
    viewBox="0 0 9 9"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M4.5 0C4.95 3.15 5.85 4.05 9 4.5C5.85 4.95 4.95 5.85 4.5 9C4.05 5.85 3.15 4.95 0 4.5C3.15 4.05 4.05 3.15 4.5 0Z"
      fill="#84CC16"
    />
  </svg>
);
export const TalentHomeDoodleStarWhiteSmall = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M7 0C7.7 4.9 9.1 6.3 14 7C9.1 7.7 7.7 9.1 7 14C6.3 9.1 4.9 7.7 0 7C4.9 6.3 6.3 4.9 7 0Z"
      fill="white"
      fillOpacity="0.6"
    />
  </svg>
);
export const TalentHomeEditProfileIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M9.02387 1.43367C9.49363 0.963908 10.1308 0.7 10.7951 0.7C12.1785 0.7 13.3 1.82148 13.3 3.2049C13.3 3.86924 13.0361 4.50637 12.5663 4.97613L4.39623 13.1462C4.29777 13.2447 4.16424 13.3 4.025 13.3H1.225C0.935051 13.3 0.7 13.065 0.7 12.775V9.975C0.7 9.83576 0.755312 9.70223 0.853769 9.60377L9.02387 1.43367ZM10.7951 1.75C10.4092 1.75 10.0392 1.90328 9.76633 2.17613L9.49246 2.45L11.55 4.50754L11.8239 4.23367C12.0967 3.96082 12.25 3.59076 12.25 3.2049C12.25 2.40138 11.5986 1.75 10.7951 1.75ZM10.8075 5.25L8.75 3.19246L1.75 10.1925V12.25H3.80754L10.8075 5.25Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeEvaluationsUsersIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M5.95 2.125C4.7764 2.125 3.825 3.07639 3.825 4.25C3.825 5.42361 4.7764 6.375 5.95 6.375C7.12361 6.375 8.075 5.42361 8.075 4.25C8.075 3.07639 7.12361 2.125 5.95 2.125ZM2.55 4.25C2.55 2.37223 4.07223 0.85 5.95 0.85C7.82777 0.85 9.35 2.37223 9.35 4.25C9.35 6.12777 7.82777 7.65 5.95 7.65C4.07223 7.65 2.55 6.12777 2.55 4.25ZM10.4125 1.4875C10.4125 1.13542 10.6979 0.85 11.05 0.85C12.9278 0.85 14.45 2.37223 14.45 4.25C14.45 6.12777 12.9278 7.65 11.05 7.65C10.6979 7.65 10.4125 7.36458 10.4125 7.0125C10.4125 6.66042 10.6979 6.375 11.05 6.375C12.2236 6.375 13.175 5.42361 13.175 4.25C13.175 3.07639 12.2236 2.125 11.05 2.125C10.6979 2.125 10.4125 1.83958 10.4125 1.4875ZM0.85 14.1313C0.85 11.4906 2.99064 9.35 5.63125 9.35H6.26875C8.90936 9.35 11.05 11.4906 11.05 14.1313C11.05 15.2462 10.1462 16.15 9.03125 16.15H2.86875C1.75383 16.15 0.85 15.2462 0.85 14.1313ZM5.63125 10.625C3.6948 10.625 2.125 12.1948 2.125 14.1313C2.125 14.542 2.45799 14.875 2.86875 14.875H9.03125C9.44201 14.875 9.775 14.542 9.775 14.1313C9.775 12.1948 8.2052 10.625 6.26875 10.625H5.63125ZM10.625 9.9875C10.625 9.63542 10.9104 9.35 11.2625 9.35H11.3688C14.0094 9.35 16.15 11.4906 16.15 14.1313C16.15 15.2462 15.2462 16.15 14.1313 16.15H12.75C12.3979 16.15 12.1125 15.8646 12.1125 15.5125C12.1125 15.1604 12.3979 14.875 12.75 14.875H14.1313C14.542 14.875 14.875 14.542 14.875 14.1313C14.875 12.1948 13.3052 10.625 11.3688 10.625H11.2625C10.9104 10.625 10.625 10.3396 10.625 9.9875Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeExploreCompassIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5ZM1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10ZM14.7803 5.21967C14.9768 5.41611 15.0485 5.70504 14.9668 5.97056L13.465 10.8514C13.4558 10.8813 13.4468 10.9108 13.4378 10.94C13.2826 11.4456 13.1606 11.8432 12.9339 12.1813C12.7345 12.4788 12.4788 12.7345 12.1813 12.9339C11.8432 13.1606 11.4456 13.2826 10.94 13.4378C10.9108 13.4468 10.8813 13.4558 10.8514 13.465L5.97056 14.9668C5.70504 15.0485 5.41611 14.9768 5.21967 14.7803C5.02323 14.5839 4.95147 14.295 5.03317 14.0294L6.53495 9.14864C6.54416 9.11872 6.55323 9.08917 6.56218 9.05997C6.71735 8.55438 6.83935 8.15685 7.06606 7.81872C7.26554 7.52121 7.52121 7.26554 7.81872 7.06606C8.15685 6.83935 8.55438 6.71735 9.05997 6.56218C9.08917 6.55323 9.11872 6.54416 9.14864 6.53495L14.0294 5.03317C14.295 4.95147 14.5839 5.02323 14.7803 5.21967ZM13.1165 6.88346L9.58977 7.96862C8.95336 8.16444 8.78518 8.22403 8.65406 8.31194C8.51883 8.40261 8.40261 8.51883 8.31194 8.65406C8.22403 8.78518 8.16444 8.95336 7.96862 9.58977L6.88346 13.1165L10.4102 12.0314C11.0466 11.8356 11.2148 11.776 11.3459 11.6881C11.4812 11.5974 11.5974 11.4812 11.6881 11.3459C11.776 11.2148 11.8356 11.0466 12.0314 10.4102L13.1165 6.88346Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeEyeGreenIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="16.15"
    viewBox="0 0 17 16.15"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M5.80419 5.39471C4.85156 6.19434 4.10126 7.14762 3.67884 7.74128C3.61004 7.83797 3.57774 7.88412 3.55612 7.92079C3.54261 7.94369 3.54004 7.95175 3.53862 7.95724C3.53845 7.9582 3.53794 7.96125 3.53737 7.96648C3.5364 7.97546 3.53571 7.98705 3.53571 8C3.53571 8.01295 3.5364 8.02454 3.53737 8.03352C3.53794 8.03875 3.53845 8.0418 3.53862 8.04276C3.54004 8.04825 3.54261 8.05631 3.55612 8.07921C3.57774 8.11588 3.61004 8.16203 3.67884 8.25872C4.10126 8.85238 4.85156 9.80566 5.80419 10.6053C6.76526 11.412 7.86628 12.0071 9 12.0071C10.1337 12.0071 11.2347 11.412 12.1958 10.6053C13.1484 9.80566 13.8987 8.85238 14.3212 8.25872C14.39 8.16203 14.4223 8.11588 14.4439 8.07921C14.4574 8.0563 14.46 8.04825 14.4614 8.04276C14.4615 8.04179 14.4621 8.03875 14.4626 8.03352C14.4636 8.02454 14.4643 8.01295 14.4643 8C14.4643 7.98705 14.4636 7.97546 14.4626 7.96648C14.4621 7.96125 14.4615 7.95821 14.4614 7.95724C14.46 7.95175 14.4574 7.94369 14.4439 7.92079C14.4223 7.88412 14.39 7.83797 14.3212 7.74128C13.8987 7.14762 13.1484 6.19434 12.1958 5.39471C11.2347 4.588 10.1337 3.99286 9 3.99286C7.86628 3.99286 6.76526 4.588 5.80419 5.39471ZM5.10157 4.55766C6.14534 3.68153 7.49178 2.9 9 2.9C10.5082 2.9 11.8547 3.68153 12.8984 4.55766C13.9506 5.44087 14.7626 6.47662 15.2116 7.10767C15.219 7.11803 15.2264 7.12846 15.2339 7.13897C15.3419 7.2899 15.4623 7.45827 15.5211 7.6903C15.5691 7.87953 15.5691 8.12047 15.5211 8.3097C15.4623 8.54173 15.3419 8.7101 15.2339 8.86103C15.2264 8.87154 15.219 8.88197 15.2116 8.89233C14.7626 9.52338 13.9506 10.5591 12.8984 11.4423C11.8547 12.3185 10.5082 13.1 9 13.1C7.49178 13.1 6.14534 12.3185 5.10157 11.4423C4.04936 10.5591 3.23744 9.52338 2.7884 8.89233C2.78103 8.88197 2.77358 8.87154 2.76606 8.86103C2.65814 8.7101 2.53774 8.54173 2.47887 8.3097C2.43085 8.12047 2.43085 7.87953 2.47887 7.6903C2.53774 7.45827 2.65814 7.2899 2.76606 7.13897C2.77358 7.12846 2.78103 7.11803 2.7884 7.10767C3.23744 6.47662 4.04936 5.44087 5.10157 4.55766ZM9 6.90714C8.39643 6.90714 7.90714 7.39643 7.90714 8C7.90714 8.60357 8.39643 9.09286 9 9.09286C9.60357 9.09286 10.0929 8.60357 10.0929 8C10.0929 7.39643 9.60357 6.90714 9 6.90714ZM6.81429 8C6.81429 6.79286 7.79286 5.81429 9 5.81429C10.2071 5.81429 11.1857 6.79286 11.1857 8C11.1857 9.20714 10.2071 10.1857 9 10.1857C7.79286 10.1857 6.81429 9.20714 6.81429 8Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeEyeOffIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M0.921745 2.63769C1.12185 2.37355 1.49818 2.32164 1.76231 2.52174L14.9623 12.5217C15.2264 12.7218 15.2784 13.0982 15.0783 13.3623C14.8782 13.6264 14.5018 13.6784 14.2377 13.4783L12.0991 11.8581C10.9887 12.79 9.57724 13.6 8 13.6C6.37246 13.6 4.92312 12.7372 3.8035 11.7754C2.67387 10.8049 1.80257 9.66721 1.32093 8.97445C1.31309 8.96317 1.30516 8.95182 1.29718 8.94039C1.18105 8.77415 1.05246 8.59006 0.989698 8.33688C0.938688 8.13111 0.938688 7.86889 0.989698 7.66313C1.05246 7.40994 1.18106 7.22585 1.29718 7.05961C1.30516 7.04818 1.31309 7.03683 1.32093 7.02555C1.68323 6.50444 2.26454 5.73374 3.00917 4.9718L1.03769 3.47826C0.773552 3.27815 0.721644 2.90182 0.921745 2.63769ZM3.974 5.70273C3.24202 6.43368 2.66391 7.19605 2.30621 7.71055C2.23243 7.81668 2.19774 7.86741 2.17447 7.90778C2.15934 7.93404 2.15662 7.94318 2.15483 7.95029C2.15483 7.95029 2.15401 7.95498 2.15329 7.96174C2.1522 7.9721 2.15144 7.98532 2.15144 8C2.15144 8.01468 2.1522 8.0279 2.15329 8.03826C2.15401 8.04502 2.15483 8.04971 2.15483 8.04971C2.15662 8.05682 2.15934 8.06596 2.17447 8.09222C2.19774 8.13259 2.23243 8.18332 2.30621 8.28945C2.75952 8.94147 3.56424 9.9878 4.58548 10.8652C5.61674 11.7511 6.79315 12.4 8 12.4C9.09415 12.4 10.1616 11.8665 11.1148 11.1124L9.48998 9.88151C9.08095 10.2057 8.56311 10.4 8 10.4C6.67452 10.4 5.6 9.32548 5.6 8C5.6 7.67247 5.66587 7.3597 5.78503 7.07473L3.974 5.70273ZM6.80916 7.85059C6.80312 7.89949 6.8 7.94935 6.8 8C6.8 8.66274 7.33726 9.2 8 9.2C8.16542 9.2 8.32301 9.16665 8.46645 9.10611L6.80916 7.85059ZM8 3.6C7.51608 3.6 7.03648 3.70385 6.56568 3.88819C6.25712 4.009 5.90904 3.8568 5.78822 3.54824C5.66741 3.23968 5.8196 2.8916 6.12816 2.77079C6.71397 2.54142 7.34222 2.4 8 2.4C9.62754 2.4 11.0769 3.26275 12.1965 4.22462C13.3261 5.19509 14.1974 6.33279 14.6791 7.02555C14.6869 7.03683 14.6948 7.04818 14.7028 7.05961C14.819 7.22586 14.9475 7.40994 15.0103 7.66313C15.0613 7.86888 15.0613 8.13112 15.0103 8.33688C14.9475 8.59006 14.8189 8.77415 14.7028 8.94039C14.6948 8.95182 14.6869 8.96317 14.6791 8.97445C14.5894 9.10349 14.4866 9.24722 14.3717 9.40186C14.1741 9.66785 13.7983 9.72327 13.5323 9.52565C13.2663 9.32803 13.2109 8.95219 13.4085 8.6862C13.5153 8.5424 13.6107 8.40894 13.6938 8.28945C13.7676 8.18332 13.8023 8.13259 13.8255 8.09222C13.8407 8.06594 13.8434 8.05681 13.8452 8.04971C13.8452 8.04971 13.846 8.045 13.8467 8.03826C13.8478 8.0279 13.8486 8.01468 13.8486 8C13.8486 7.98532 13.8478 7.9721 13.8467 7.96174C13.846 7.95498 13.8452 7.95029 13.8452 7.95029C13.8434 7.94318 13.8407 7.93404 13.8255 7.90778C13.8023 7.86741 13.7676 7.81668 13.6938 7.71055C13.2405 7.05853 12.4358 6.0122 11.4145 5.13485C10.3833 4.24889 9.20685 3.6 8 3.6Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="white"
      />
    </g>
  </svg>
);
export const TalentHomeHeroXpAvatar = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="106.839"
    height="108.387"
    viewBox="0 0 106.839 108.387"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <g></g>
      <path
        d="M74.3906 49.0071C74.6773 44.4329 74.1764 39.2784 71.9909 35.1941C71.5392 34.3498 69.6249 31.6371 68.8087 31.3307C68.1141 31.0699 63.1236 32.061 61.9226 32.1775C53.802 32.9646 45.6424 32.9293 37.5083 32.2833C34.2978 37.4938 33.6531 43.1818 33.8044 49.2188C31.6597 43.8232 29.6084 38.1001 29.318 32.2304C28.2343 31.8342 27.1108 31.9536 26.0837 32.4421C26.4536 30.4098 27.8769 28.2054 29.9441 27.679C26.6528 26.9986 25.0172 23.9249 26.0837 20.6931L32.4481 23.8685C29.2103 20.8031 29.955 15.621 33.0219 12.7017C37.2615 17.4672 43.2204 13.788 48.2548 12.7017C55.1002 11.2246 63.3308 10.8786 69.0174 15.6654C71.2305 17.5284 73.3124 20.2527 72.0431 23.2863C74.6791 20.5273 79.0979 24.2022 79.3987 27.2556C79.5956 29.2545 78.9378 32.817 78.564 34.8766C77.7032 39.6182 76.237 44.575 74.3906 49.0071Z"
        fill="#0D0100"
      />
      <path
        d="M74.3907 49.0071C82.2567 43.4342 83.2103 53.3418 80.0247 58.5863C78.2681 61.4784 74.8287 63.6419 72.1475 60.4386C71.0499 67.1791 65.6053 71.3862 59.2621 72.7168C56.2422 73.3503 52.2797 73.3968 49.246 72.8227C48.0235 72.5913 45.4421 71.6844 44.2901 71.1291C40.499 69.3017 37.8339 65.7219 36.5693 61.7087C32.8329 65.3575 28.5587 60.5086 27.3357 56.8927C25.3951 51.1551 27.6193 46.1425 33.8566 49.9598C34.1324 49.9386 33.8099 49.4361 33.8045 49.2188C33.6532 43.1819 34.2979 37.4939 37.5084 32.2833C45.6424 32.9293 53.802 32.9646 61.9227 32.1775C63.1237 32.0611 68.1141 31.0699 68.8088 31.3307C69.625 31.6372 71.5392 34.3498 71.991 35.1941C74.1765 39.2784 74.6774 44.433 74.3907 49.0071ZM62.4443 41.7037C61.7431 41.7459 58.3126 42.7434 60.0446 43.609C60.4309 43.802 64.1147 43.5041 65.0527 43.609C66.2216 43.7396 67.3158 44.2319 68.4436 44.5086C67.1131 42.5926 64.7335 41.5659 62.4443 41.7037ZM43.7684 41.9154C42.0288 42.0703 39.8024 43.2149 39.1255 44.932C40.1721 44.4451 41.3689 43.9784 42.5164 43.8206C43.5468 43.679 46.9027 43.972 47.4202 43.7148C48.3224 43.2663 47.3214 42.4518 46.7941 42.2329C46.0839 41.9383 44.5374 41.8469 43.7684 41.9154ZM58.7405 52.0767C60.3512 55.7054 66.5803 55.8773 67.5046 52.1825C69.0595 50.7169 68.6465 48.1813 67.0351 46.8902C63.4742 44.0372 56.4927 47.0128 58.7405 52.0767ZM40.6906 51.865C41.2113 55.4867 47.1174 55.8607 49.1417 52.8176C52.1019 48.3674 44.964 43.8893 41.3687 46.7844C39.9546 47.9231 39.4018 50.4063 40.6906 51.865ZM78.1989 50.489C75.9361 50.7929 74.3286 54.4092 73.4517 56.2576C73.4577 56.5523 74.8915 55.3083 75.1732 55.2521C75.8626 55.1146 76.96 55.3475 77.312 56.0459C78.0451 57.5007 76.3268 59.9178 76.5295 60.0152C78.325 58.1457 80.1751 54.2336 79.9204 51.6004C79.8061 50.4177 79.2816 50.3436 78.1989 50.489ZM28.9529 51.7592C27.9186 52.1101 28.9265 55.5963 29.2137 56.3635C29.825 57.9965 31.1424 59.8776 32.5003 60.9678C30.1588 57.9693 31.1981 54.6443 35.1608 56.9986C34.1473 55.0326 31.669 50.8374 28.9529 51.7592ZM66.2004 54.7229C63.748 55.0154 63.7366 57.7271 66.2004 58.0041C70.377 58.4736 70.0911 54.2587 66.2004 54.7229ZM40.8471 54.8287C38.4835 55.1922 38.5914 57.8873 41.0557 58.11C45.2553 58.4894 44.8076 54.2197 40.8471 54.8287ZM52.5847 57.0515C52.0809 56.934 50.5885 56.8892 51.2284 57.6866C51.5094 58.0369 52.6415 58.5677 53.1064 58.6392C54.5216 58.8567 55.943 58.5577 57.0711 57.6336C57.0735 57.4506 56.2109 57.2593 56.1321 57.2632C57.0714 56.6898 54.6739 55.9281 54.2019 55.8872C53.4042 55.818 51.5129 56.1406 52.5847 57.0515ZM49.1417 61.7087C49.1507 61.7747 49.1254 61.8963 49.1417 61.9204L48.4113 61.7617L49.7677 62.9789C51.7968 65.8885 58.8083 65.6095 59.7838 62.5555C59.8365 62.3904 59.8998 62.2054 59.8881 62.0263C60.3345 61.7982 61.1985 61.1855 60.2533 60.9678L48.8808 61.2854C48.7372 61.4779 49.0145 61.6417 49.1417 61.7087Z"
        fill="#996647"
      />
      <path
        d="M62.4443 41.7036C64.7335 41.5658 67.1131 42.5925 68.4435 44.5086C67.3158 44.2318 66.2215 43.7395 65.0527 43.6089C64.1147 43.504 60.4309 43.8019 60.0446 43.6089C58.3125 42.7434 61.7431 41.7459 62.4443 41.7036Z"
        fill="#1C2A21"
      />
      <path
        d="M43.7684 41.9154C44.5373 41.8469 46.0839 41.9382 46.7941 42.2329C47.3214 42.4518 48.3224 43.2663 47.4201 43.7148C46.9026 43.972 43.5468 43.679 42.5164 43.8206C41.3689 43.9783 40.1721 44.4451 39.1255 44.932C39.8023 43.2148 42.0287 42.0702 43.7684 41.9154Z"
        fill="#1C2A21"
      />
      <path
        d="M67.5045 52.1824C69.2148 45.3458 57.9872 45.081 58.7404 52.0765C56.4926 47.0126 63.4742 44.037 67.035 46.89C68.6465 48.1812 69.0594 50.7167 67.5045 52.1824Z"
        fill="#1C2A21"
      />
      <path
        d="M49.1416 52.8175C50.2406 49.316 46.5859 46.1169 43.2467 47.2077C41.505 47.7766 40.4365 50.0978 40.6905 51.8649C39.4018 50.4062 39.9546 47.923 41.3687 46.7843C44.964 43.8893 52.1018 48.3673 49.1416 52.8175Z"
        fill="#1C2A21"
      />
      <path
        d="M67.5045 52.1825C66.5802 55.8773 60.3511 55.7054 58.7404 52.0767C57.9872 45.0812 69.2148 45.346 67.5045 52.1825ZM62.4443 47.5253C59.7496 47.9062 58.9956 52.5377 61.401 53.8761C66.2229 56.559 68.2089 46.7105 62.4443 47.5253Z"
        fill="#FDFDFD"
      />
      <path
        d="M49.1416 52.8176C47.1173 55.8607 41.2113 55.4866 40.6905 51.865C40.4365 50.0979 41.505 47.7767 43.2467 47.2077C46.5859 46.117 50.2406 49.3161 49.1416 52.8176ZM44.4466 48.5837C45.1301 49.1199 44.6337 50.2872 43.8206 50.3831C43.2255 50.4533 42.6935 50.1008 42.5164 49.5364C41.6373 51.4147 42.8824 54.0177 45.0204 54.1936C50.6129 54.6538 48.2299 44.3366 43.0902 48.5308C43.1184 48.614 43.9137 48.1658 44.4466 48.5837Z"
        fill="#FDFDFD"
      />
      <path
        d="M62.4444 47.5253C68.209 46.7105 66.2229 56.559 61.401 53.8761C58.9957 52.5377 59.7497 47.9062 62.4444 47.5253ZM64.2702 50.2773C65.5719 50.7371 66.2901 49.298 65.1571 48.6896C64.8363 48.5174 64.5725 48.6313 64.2702 48.5837C62.9494 48.3762 61.6832 48.3907 61.0358 49.801C60.5603 50.837 60.6593 51.726 61.5053 52.5001C63.6093 54.425 64.5827 52.4512 64.2702 50.2773Z"
        fill="#573220"
      />
      <path
        d="M43.8206 50.383C43.5123 52.1552 44.1118 53.3393 46.0638 53.0292C48.3791 52.6614 46.8331 47.4584 44.4466 48.5836C43.9137 48.1656 43.1184 48.6139 43.0902 48.5307C48.2299 44.3365 50.6129 54.6537 45.0204 54.1935C42.8824 54.0176 41.6373 51.4146 42.5164 49.5362C42.6934 50.1007 43.2255 50.4532 43.8206 50.383Z"
        fill="#583320"
      />
      <path
        d="M43.8206 50.3831C44.6336 50.2872 45.1301 49.1198 44.4466 48.5837C46.8331 47.4585 48.3791 52.6615 46.0638 53.0293C44.1118 53.3394 43.5123 52.1553 43.8206 50.3831Z"
        fill="#060000"
      />
      <path
        d="M64.2701 48.5838C63.4972 49.0007 63.3534 49.9535 64.2701 50.2773C64.5826 52.4512 63.6092 54.425 61.5053 52.5001C60.6592 51.726 60.5602 50.837 61.0358 49.801C61.6832 48.3907 62.9494 48.3762 64.2701 48.5838Z"
        fill="#1C2A21"
      />
      <path
        d="M64.2701 50.2772C63.3533 49.9534 63.4972 49.0006 64.2701 48.5837C64.5724 48.6312 64.8362 48.5173 65.1569 48.6895C66.29 49.2979 65.5718 50.737 64.2701 50.2772Z"
        fill="#FDFDFD"
      />
      <path
        d="M78.1988 50.4889C79.2815 50.3435 79.806 50.4176 79.9204 51.6003C80.175 54.2336 78.325 58.1457 76.5295 60.0151C76.3268 59.9177 78.0451 57.5006 77.312 56.0459C76.96 55.3474 75.8626 55.1145 75.1731 55.252C74.8914 55.3082 73.4577 56.5522 73.4516 56.2576C74.3285 54.4092 75.936 50.7928 78.1988 50.4889Z"
        fill="#652C0D"
      />
      <path
        d="M28.9528 51.759C31.6689 50.8373 34.1473 55.0324 35.1608 56.9984C31.198 54.6442 30.1587 57.9691 32.5002 60.9677C31.1423 59.8775 29.825 57.9963 29.2137 56.3633C28.9264 55.5962 27.9186 52.11 28.9528 51.759Z"
        fill="#652D0D"
      />
      <path
        d="M66.2003 54.7228C70.0911 54.2586 70.377 58.4736 66.2003 58.004C63.7366 57.727 63.748 55.0153 66.2003 54.7228Z"
        fill="#7E3734"
      />
      <path
        d="M40.847 54.8286C44.8076 54.2196 45.2553 58.4893 41.0557 58.1099C38.5913 57.8872 38.4834 55.1921 40.847 54.8286Z"
        fill="#7F3734"
      />
      <path
        d="M56.1321 57.263C55.6594 57.2865 55.1051 57.8244 54.3062 57.7923C53.4874 57.7592 53.0399 57.1575 52.5847 57.0513C51.5129 56.1404 53.4041 55.8178 54.2019 55.887C54.6739 55.928 57.0714 56.6897 56.1321 57.263Z"
        fill="#B38164"
      />
      <path
        d="M52.5847 57.0514C53.0399 57.1576 53.4874 57.7593 54.3062 57.7923C55.1051 57.8245 55.6594 57.2866 56.1321 57.2631C56.2108 57.2592 57.0735 57.4506 57.0711 57.6336C55.943 58.5576 54.5216 58.8566 53.1064 58.6391C52.8352 57.8828 51.9992 57.3819 51.2283 57.6865C50.5885 56.8891 52.0809 56.9339 52.5847 57.0514Z"
        fill="#824B25"
      />
      <path
        d="M53.1064 58.639C52.6414 58.5676 51.5094 58.0368 51.2283 57.6864C51.9992 57.3818 52.8352 57.8828 53.1064 58.639Z"
        fill="#6A3412"
      />
      <path
        d="M59.8881 62.0262C57.3668 63.3145 51.6441 63.0284 49.1416 61.7087C49.0145 61.6417 48.7371 61.4778 48.8808 61.2853L60.2533 60.9677C61.1984 61.1855 60.3345 61.7981 59.8881 62.0262Z"
        fill="#FDFDFD"
      />
      <path
        d="M49.1416 61.9204C49.3293 62.1975 49.3035 62.1654 49.4546 62.4496C49.5533 62.6351 49.6475 62.8065 49.7676 62.9788L48.4113 61.7616L49.1416 61.9204Z"
        fill="#572D15"
      />
      <path
        d="M59.8881 62.0262C59.8998 62.2053 59.8365 62.3903 59.7838 62.5554C57.6257 62.8762 55.4502 63.1499 53.2628 63.0847L49.4546 62.4496C49.3035 62.1654 49.3293 62.1975 49.1416 61.9204C49.1254 61.8962 49.1507 61.7746 49.1416 61.7087C51.6441 63.0284 57.3667 63.3145 59.8881 62.0262Z"
        fill="#C2B7BB"
      />
      <path
        d="M59.9516 62.5008C58.9495 65.6565 51.7471 65.9448 49.6628 62.9382C49.5393 62.7602 49.4426 62.5831 49.3412 62.3914L53.2531 63.0476C55.5001 63.115 57.7348 62.8322 59.9516 62.5008Z"
        fill="#FEFDFD"
      />
      <path
        d="M59.2621 72.7167C59.2756 72.8168 59.2395 72.9441 59.2621 73.0343C57.1109 77.4832 52.9025 78.2049 48.62 76.3155C48.9367 75.42 49.0098 73.8019 49.246 72.8226C52.2797 73.3967 56.2421 73.3502 59.2621 72.7167Z"
        fill="#5B2F14"
      />
      <path
        d="M60.9315 77.1623C59.0622 81.3405 56.7587 85.2735 54.3062 89.123C51.4017 85.9173 49.2314 82.1847 46.8463 78.5912C46.5477 78.043 46.9303 77.8934 47.1593 77.4798C48.0105 77.1784 48.2691 77.3075 48.62 76.3155C52.9025 78.2049 57.1109 77.4832 59.2621 73.0343C59.4475 73.7735 60.4714 76.7075 60.9315 77.1623Z"
        fill="#986546"
      />
      <path
        d="M61.1401 77.2681C59.1779 81.7387 56.8805 86.0097 54.2019 90.0756C53.6842 90.2127 49.6317 84.7501 49.1416 83.9894C48.3029 82.6873 46.4878 79.6483 46.0116 78.2737C45.9079 77.9745 45.8266 78.019 46.1159 77.7974C46.4395 77.7155 46.8424 77.592 47.1593 77.4798C46.9303 77.8934 46.5477 78.0431 46.8463 78.5912C49.2314 82.1847 51.4017 85.9173 54.3062 89.123C56.7587 85.2736 59.0622 81.3405 60.9314 77.1623C60.9496 77.1802 61.096 77.2425 61.1401 77.2681Z"
        fill="#01551F"
      />
      <path
        d="M61.6618 77.4798C59.5582 82.6248 56.7058 87.3732 53.7324 92.0338L54.4105 93.251C54.1116 93.4507 52.1554 91.4086 51.8543 91.0811C48.5975 87.5391 46.0603 82.7852 44.1336 78.3795L43.9249 78.3266C44.1711 78.1317 44.5617 78.079 44.8639 78.0091C44.5834 80.0849 52.4161 91.7693 53.2629 91.6633C53.3152 91.6567 53.8426 90.8168 53.8367 90.7636C53.816 90.5775 51.6587 88.4266 51.3327 88.0116C48.9185 84.9386 46.9392 81.5595 45.2813 78.0091C45.5423 77.9489 45.8489 77.865 46.1159 77.7974C45.8266 78.019 45.9079 77.9745 46.0116 78.2737C46.4878 79.6483 48.3029 82.6873 49.1416 83.9894C49.6317 84.7501 53.6843 90.2127 54.2019 90.0756C56.8806 86.0097 59.1779 81.7387 61.1401 77.2681C61.1782 77.2903 61.5989 77.459 61.6618 77.4798Z"
        fill="#3C854F"
      />
      <path
        d="M63.2268 77.7974C62.8827 80.0483 56.4113 94.4917 55.2452 94.9446C54.586 95.2005 54.5096 94.0367 54.88 93.5685C55.4863 93.1149 56.1193 91.9169 56.5494 91.187C59.032 86.9731 60.8215 82.3603 62.7051 77.8503L61.9748 77.7445C60.2092 83.349 57.276 88.4162 54.567 93.5685C53.9149 93.9679 54.2744 94.5956 53.1585 93.8861C50.6294 92.278 45.1539 83.4527 44.1336 80.4965C43.9171 79.8693 43.693 78.9944 43.7162 78.3266C43.785 78.33 43.856 78.325 43.9249 78.3266L44.1336 78.3795C46.0603 82.7852 48.5975 87.5391 51.8543 91.0811C52.1554 91.4086 54.1116 93.4507 54.4105 93.251L53.7324 92.0338C56.7058 87.3732 59.5582 82.6248 61.6618 77.4798C61.9831 77.5862 62.7683 77.6751 63.2268 77.7974ZM54.7235 90.8165C54.6753 91.024 55.348 91.3008 55.4017 91.187C55.3885 90.8809 54.9475 90.8603 54.7235 90.8165Z"
        fill="#05531E"
      />
      <path
        d="M54.88 93.5685C54.8356 93.6018 54.804 93.4234 54.567 93.5685C57.276 88.4162 60.2092 83.349 61.9748 77.7445L62.7051 77.8503C60.8215 82.3603 59.032 86.9731 56.5494 91.187C56.1193 91.9169 55.4863 93.1149 54.88 93.5685Z"
        fill="#39854E"
      />
      <path
        d="M76.4773 81.6079C73.8977 88.5278 72.8091 95.996 73.3473 103.412C60.9342 103.445 48.5129 103.444 36.0998 103.412C36.4131 96.015 34.796 88.6523 32.4481 81.7137C34.1319 81.0154 42.3223 78.2588 43.7162 78.3266C43.693 78.9944 43.9171 79.8693 44.1336 80.4965C45.1539 83.4527 50.6294 92.278 53.1585 93.8861C54.2744 94.5956 53.9149 93.9679 54.567 93.5685C54.804 93.4234 54.8356 93.6018 54.88 93.5685C54.5097 94.0367 54.586 95.2005 55.2452 94.9446C56.4113 94.4917 62.8827 80.0483 63.2268 77.7974C67.7905 79.0144 72.0044 79.9217 76.4773 81.6079Z"
        fill="#337B32"
      />
      <path
        d="M45.2813 78.0091C46.9392 81.5595 48.9185 84.9386 51.3327 88.0116C51.6587 88.4266 53.816 90.5775 53.8367 90.7636C53.8427 90.8168 53.3152 91.6567 53.2629 91.6633C52.4161 91.7693 44.5834 80.0849 44.8639 78.0091C44.9913 77.9795 45.1538 78.0384 45.2813 78.0091Z"
        fill="#005723"
      />
      <path
        d="M73.3473 103.412C72.8091 95.996 73.8977 88.5278 76.4773 81.6079C78.409 82.336 80.1512 82.5011 81.068 84.7303L84.9284 103.359C81.0704 103.464 77.2059 103.402 73.3473 103.412Z"
        fill="#003415"
      />
      <path
        d="M32.4481 81.7137C34.796 88.6523 36.4131 96.015 36.0998 103.412C32.1071 103.402 28.0855 103.552 24.1013 103.254L28.692 84.6245C29.4533 82.8238 30.8335 82.3832 32.4481 81.7137Z"
        fill="#003415"
      />
      <path
        d="M54.7235 90.8165C54.9475 90.8603 55.3884 90.8809 55.4017 91.187C55.3479 91.3008 54.6753 91.024 54.7235 90.8165Z"
        fill="#1F6F3F"
      />
    </g>
  </svg>
);
export const TalentHomeIndustryAgritechIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M14.1104 4.04224C12.3923 2.31925 9.60767 2.31925 7.88956 4.04224C6.17015 5.76652 6.17015 8.56309 7.88956 10.2874L11 13.4066L14.1104 10.2874C15.8299 8.56309 15.8299 5.76652 14.1104 4.04224ZM11 14.575L10.4158 15.1575L6.72118 11.4524C4.35961 9.08418 4.35961 5.24543 6.72118 2.87716C9.08404 0.507612 12.916 0.507612 15.2788 2.87716C17.6404 5.24543 17.6404 9.08418 15.2788 11.4524L11.5847 15.1571L11 14.575ZM11 14.575L11.5847 15.1571C11.4299 15.3123 11.2192 15.4 11 15.4C10.7808 15.4 10.5706 15.3127 10.4158 15.1575L11 14.575ZM9.35 7.15C9.35 6.23873 10.0887 5.5 11 5.5C11.9113 5.5 12.65 6.23873 12.65 7.15C12.65 8.06127 11.9113 8.8 11 8.8C10.0887 8.8 9.35 8.06127 9.35 7.15ZM2.79081 12.1105C3.24066 12.1829 3.54666 12.6062 3.47428 13.0561L2.97636 16.1508C2.86154 16.8645 2.78495 17.3454 2.75905 17.7169C2.73376 18.0796 2.76549 18.2474 2.80776 18.3534C2.92451 18.6461 3.14768 18.8994 3.44798 19.0626C3.56642 19.127 3.75172 19.1849 4.13886 19.2168C4.5327 19.2493 5.0471 19.25 5.80024 19.25H16.1998C16.9529 19.25 17.4673 19.2493 17.8611 19.2168C18.2483 19.1849 18.4336 19.127 18.552 19.0626C18.8523 18.8994 19.0755 18.6461 19.1922 18.3534C19.2345 18.2474 19.2662 18.0796 19.2409 17.7169C19.215 17.3454 19.1385 16.8645 19.0236 16.1508L18.5257 13.0561C18.4533 12.6062 18.7593 12.1829 19.2092 12.1105C19.659 12.0381 20.0824 12.3441 20.1548 12.7939L20.6587 15.926C20.766 16.5928 20.8553 17.1476 20.887 17.6021C20.9199 18.0739 20.8994 18.5271 20.7248 18.9647C20.461 19.6261 19.9683 20.1707 19.3402 20.5122C18.9298 20.7354 18.481 20.8213 17.9968 20.8613C17.527 20.9 16.9442 20.9 16.235 20.9H5.76504C5.0558 20.9 4.47297 20.9 4.00319 20.8613C3.51896 20.8213 3.07024 20.7354 2.6598 20.5122C2.03171 20.1707 1.53903 19.6261 1.27518 18.9647C1.10063 18.5271 1.08015 18.0739 1.11305 17.6021C1.14474 17.1476 1.23401 16.5928 1.34131 15.926L1.84523 12.7939C1.91761 12.3441 2.34096 12.0381 2.79081 12.1105Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1D7C4D"
      />
    </g>
  </svg>
);
export const TalentHomeIndustryAgritechSmallIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M12.8277 3.67476C11.2658 2.10841 8.73425 2.10841 7.17232 3.67476C5.60923 5.24229 5.60923 7.78462 7.17232 9.35215L10 12.1878L12.8277 9.35215C14.3908 7.78462 14.3908 5.24229 12.8277 3.67476ZM10 13.25L9.46889 13.7796L6.11016 10.4113C3.96328 8.25834 3.96328 4.76857 6.11016 2.6156C8.25822 0.461465 11.7418 0.461465 13.8898 2.6156C16.0367 4.76857 16.0367 8.25834 13.8898 10.4113L10.5315 13.7791L10 13.25ZM10 13.25L10.5315 13.7791C10.3908 13.9203 10.1993 14 10 14C9.80072 14 9.6096 13.9207 9.46889 13.7796L10 13.25ZM8.5 6.5C8.5 5.67157 9.17157 5 10 5C10.8284 5 11.5 5.67157 11.5 6.5C11.5 7.32843 10.8284 8 10 8C9.17157 8 8.5 7.32843 8.5 6.5ZM2.5371 11.0095C2.94605 11.0753 3.22423 11.4602 3.15844 11.8691L2.70578 14.6826C2.6014 15.3313 2.53178 15.7685 2.50823 16.1062C2.48524 16.436 2.51408 16.5885 2.5525 16.6849C2.65865 16.951 2.86153 17.1812 3.13453 17.3297C3.2422 17.3882 3.41065 17.4408 3.7626 17.4699C4.12064 17.4994 4.58828 17.5 5.27294 17.5H14.7271C15.4117 17.5 15.8794 17.4994 16.2374 17.4699C16.5893 17.4408 16.7578 17.3882 16.8655 17.3297C17.1385 17.1812 17.3414 16.951 17.4475 16.6849C17.4859 16.5885 17.5148 16.436 17.4918 16.1062C17.4682 15.7685 17.3986 15.3313 17.2942 14.6826L16.8416 11.8691C16.7758 11.4602 17.054 11.0753 17.4629 11.0095C17.8719 10.9437 18.2567 11.2219 18.3225 11.6309L18.7806 14.4782C18.8782 15.0844 18.9593 15.5887 18.9881 16.0019C19.018 16.4308 18.9994 16.8428 18.8407 17.2406C18.6009 17.8419 18.153 18.337 17.582 18.6475C17.2089 18.8504 16.8009 18.9285 16.3607 18.9648C15.9337 19 15.4038 19 14.7591 19H5.24094C4.59618 19 4.06634 19 3.63926 18.9648C3.19905 18.9285 2.79113 18.8504 2.418 18.6475C1.84701 18.337 1.39912 17.8419 1.15925 17.2406C1.00057 16.8428 0.981952 16.4308 1.01186 16.0019C1.04068 15.5887 1.12182 15.0844 1.21937 14.4782L1.67748 11.6309C1.74328 11.2219 2.12814 10.9437 2.5371 11.0095Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1D7C4D"
      />
    </g>
  </svg>
);
export const TalentHomeIndustryFintechGreenIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M1.1 4.125C1.1 2.45434 2.45434 1.1 4.125 1.1H14.025C14.4806 1.1 14.85 1.46937 14.85 1.925C14.85 2.38064 14.4806 2.75 14.025 2.75H4.125C3.36561 2.75 2.75 3.36561 2.75 4.125V4.4H17.875C19.5457 4.4 20.9 5.75434 20.9 7.425V17.875C20.9 19.5457 19.5457 20.9 17.875 20.9H4.125C2.45434 20.9 1.1 19.5457 1.1 17.875V4.125ZM2.75 6.05V17.875C2.75 18.6344 3.36561 19.25 4.125 19.25H17.875C18.6344 19.25 19.25 18.6344 19.25 17.875V7.425C19.25 6.66561 18.6344 6.05 17.875 6.05H2.75ZM15.675 12.1C15.3712 12.1 15.125 12.3462 15.125 12.65C15.125 12.9538 15.3712 13.2 15.675 13.2C15.9788 13.2 16.225 12.9538 16.225 12.65C16.225 12.3462 15.9788 12.1 15.675 12.1ZM13.475 12.65C13.475 11.435 14.46 10.45 15.675 10.45C16.89 10.45 17.875 11.435 17.875 12.65C17.875 13.865 16.89 14.85 15.675 14.85C14.46 14.85 13.475 13.865 13.475 12.65Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeIndustryFintechSmallIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M1 3.75C1 2.23122 2.23122 1 3.75 1H12.75C13.1642 1 13.5 1.33579 13.5 1.75C13.5 2.16421 13.1642 2.5 12.75 2.5H3.75C3.05964 2.5 2.5 3.05964 2.5 3.75V4H16.25C17.7688 4 19 5.23122 19 6.75V16.25C19 17.7688 17.7688 19 16.25 19H3.75C2.23122 19 1 17.7688 1 16.25V3.75ZM2.5 5.5V16.25C2.5 16.9404 3.05964 17.5 3.75 17.5H16.25C16.9404 17.5 17.5 16.9404 17.5 16.25V6.75C17.5 6.05964 16.9404 5.5 16.25 5.5H2.5ZM14.25 11C13.9739 11 13.75 11.2239 13.75 11.5C13.75 11.7761 13.9739 12 14.25 12C14.5261 12 14.75 11.7761 14.75 11.5C14.75 11.2239 14.5261 11 14.25 11ZM12.25 11.5C12.25 10.3954 13.1454 9.5 14.25 9.5C15.3546 9.5 16.25 10.3954 16.25 11.5C16.25 12.6046 15.3546 13.5 14.25 13.5C13.1454 13.5 12.25 12.6046 12.25 11.5Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeIndustryFintechWhiteIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M1.1 4.125C1.1 2.45434 2.45434 1.1 4.125 1.1H14.025C14.4806 1.1 14.85 1.46937 14.85 1.925C14.85 2.38064 14.4806 2.75 14.025 2.75H4.125C3.36561 2.75 2.75 3.36561 2.75 4.125V4.4H17.875C19.5457 4.4 20.9 5.75434 20.9 7.425V17.875C20.9 19.5457 19.5457 20.9 17.875 20.9H4.125C2.45434 20.9 1.1 19.5457 1.1 17.875V4.125ZM2.75 6.05V17.875C2.75 18.6344 3.36561 19.25 4.125 19.25H17.875C18.6344 19.25 19.25 18.6344 19.25 17.875V7.425C19.25 6.66561 18.6344 6.05 17.875 6.05H2.75ZM15.675 12.1C15.3712 12.1 15.125 12.3462 15.125 12.65C15.125 12.9538 15.3712 13.2 15.675 13.2C15.9788 13.2 16.225 12.9538 16.225 12.65C16.225 12.3462 15.9788 12.1 15.675 12.1ZM13.475 12.65C13.475 11.435 14.46 10.45 15.675 10.45C16.89 10.45 17.875 11.435 17.875 12.65C17.875 13.865 16.89 14.85 15.675 14.85C14.46 14.85 13.475 13.865 13.475 12.65Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="white"
      />
    </g>
  </svg>
);
export const TalentHomeIndustryHealthIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M14.8626 3.87712C13.7873 4.01319 12.6303 4.68198 11.7019 6.18503C11.5516 6.42835 11.286 6.57647 11 6.57647C10.714 6.57648 10.4484 6.42836 10.2981 6.18504C9.36967 4.68203 8.21272 4.01323 7.13744 3.87716C6.04953 3.73948 4.93089 4.1315 4.05312 4.96959C2.31524 6.64435 2.31563 9.46699 4.05428 11.1412L11 17.8297L17.9457 11.1412C19.6844 9.46699 19.6848 6.64437 17.9469 4.96961C17.0691 4.13149 15.9505 3.73946 14.8626 3.87712ZM14.6554 2.24018C16.288 2.03359 17.8898 2.63297 19.0879 3.77773L19.0902 3.77995C21.5033 6.1036 21.5033 10.0061 19.0902 12.3298L11.5723 19.5693C11.2528 19.8769 10.7472 19.8769 10.4277 19.5693L2.90977 12.3298C0.496743 10.0061 0.496743 6.1036 2.90977 3.77995L2.91208 3.77773L2.91209 3.77773C4.11018 2.63296 5.712 2.03361 7.34459 2.24021C8.67549 2.40864 9.95298 3.1025 11 4.34442C12.047 3.10247 13.3245 2.40859 14.6554 2.24018Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#902B20"
      />
    </g>
  </svg>
);
export const TalentHomeIndustryTelecomIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M2.53703 9.25H6.0128C6.08326 7.19424 6.44133 5.32004 7.0041 3.89148C7.13584 3.55704 7.28139 3.24042 7.44097 2.94791C4.78379 3.91234 2.82637 6.33582 2.53703 9.25ZM10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1ZM10 2.5C9.82831 2.5 9.58572 2.5853 9.28378 2.90949C8.98082 3.23477 8.67346 3.74635 8.39971 4.44126C7.91658 5.66766 7.58375 7.34835 7.51373 9.25H12.4863C12.4163 7.34835 12.0834 5.66766 11.6003 4.44126C11.3265 3.74635 11.0192 3.23477 10.7162 2.90949C10.4143 2.5853 10.1717 2.5 10 2.5ZM13.9872 9.25C13.9167 7.19424 13.5587 5.32004 12.9959 3.89148C12.8642 3.55704 12.7186 3.24042 12.559 2.94791C15.2162 3.91234 17.1736 6.33582 17.463 9.25H13.9872ZM12.4863 10.75H7.51373C7.58375 12.6516 7.91658 14.3323 8.39971 15.5587C8.67346 16.2537 8.98082 16.7652 9.28378 17.0905C9.58572 17.4147 9.82831 17.5 10 17.5C10.1717 17.5 10.4143 17.4147 10.7162 17.0905C11.0192 16.7652 11.3265 16.2537 11.6003 15.5587C12.0834 14.3323 12.4163 12.6516 12.4863 10.75ZM12.559 17.0521C12.7186 16.7596 12.8642 16.443 12.9959 16.1085C13.5587 14.68 13.9167 12.8058 13.9872 10.75H17.463C17.1736 13.6642 15.2162 16.0877 12.559 17.0521ZM7.44097 17.0521C7.28139 16.7596 7.13584 16.443 7.0041 16.1085C6.44133 14.68 6.08326 12.8058 6.0128 10.75H2.53703C2.82637 13.6642 4.78379 16.0877 7.44097 17.0521Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#785910"
      />
    </g>
  </svg>
);
export const TalentHomeJobReadinessLockIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M7.2 6C7.2 3.34903 9.34903 1.2 12 1.2C14.651 1.2 16.8 3.34903 16.8 6V9.6H18.3C20.1225 9.6 21.6 11.0775 21.6 12.9V19.5C21.6 21.3225 20.1225 22.8 18.3 22.8H5.7C3.87746 22.8 2.4 21.3225 2.4 19.5V12.9C2.4 11.0775 3.87746 9.6 5.7 9.6H7.2V6ZM9 9.6H15V6C15 4.34315 13.6569 3 12 3C10.3431 3 9 4.34315 9 6V9.6ZM5.7 11.4C4.87157 11.4 4.2 12.0716 4.2 12.9V19.5C4.2 20.3284 4.87157 21 5.7 21H18.3C19.1284 21 19.8 20.3284 19.8 19.5V12.9C19.8 12.0716 19.1284 11.4 18.3 11.4H5.7ZM12 14.4C12.4971 14.4 12.9 14.8029 12.9 15.3V17.1C12.9 17.5971 12.4971 18 12 18C11.5029 18 11.1 17.5971 11.1 17.1V15.3C11.1 14.8029 11.5029 14.4 12 14.4Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#595959"
      />
    </g>
  </svg>
);
export const TalentHomeJourneyCompleteTrophyIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M21.245 12.9828C21.7306 12.5825 24.535 10.8478 26.0706 9.38656C27.2694 8.24469 27.7331 5.26312 25.8891 3.81281C23.4916 1.92938 21.1903 3.90688 21.1903 3.90688C21.1903 3.90688 20.9891 2.78906 19.5891 2.13281C17.8259 1.30594 15.5925 0.9975 13.5384 1.02375C11.5478 1.04781 9.71469 1.28844 8.08719 2.08688C6.63031 2.80219 6.54281 3.82156 6.54281 3.82156C6.54281 3.82156 4.63094 1.995 2.28813 3.47813C-0.0525 4.96344 0.619062 7.93844 1.74563 9.1875C3.21344 10.815 4.97656 11.6441 5.77719 12.2434C6.57563 12.8428 7.34125 13.4137 7.34125 13.9278C7.34125 14.4419 7.11375 14.5556 7.02625 14.5272C6.94094 14.4988 6.79 13.9978 6.39844 14.2122C5.86469 14.5075 6.02656 15.6975 7.14 15.8113C8.21844 15.9228 8.42406 14.7831 8.42406 14.7831L8.59469 13.6697L10.3644 14.8969L12.3047 16.4959L12.2478 17.8653C12.2478 17.8653 12.1625 18.9219 11.6484 19.8363C11.1344 20.7506 10.3075 21.6628 10.3075 21.6628L10.2813 22.4897L17.4759 22.3191L17.2484 21.5206C17.2484 21.5206 16.3209 20.5013 15.7631 19.4075C15.365 18.6244 15.3016 17.8347 15.3016 17.8347L15.2841 15.8703L19.0181 13.5822C19.0181 13.5822 19.4184 13.8972 19.3616 14.0109C19.3047 14.1247 19.2916 15.2906 20.1884 15.7238C21.0744 16.1525 21.7875 15.61 21.7022 14.8662C21.6169 14.1247 21.1597 14.3806 21.0175 14.4944C20.8753 14.6081 20.5603 14.6366 20.475 14.2078C20.3875 13.7834 20.7594 13.3831 21.245 12.9828ZM2.86344 8.94469L2.00813 6.34156L3.04281 4.9875L4.20219 4.64844C4.20219 4.64844 5.68313 5.75312 5.73563 5.84281C5.78813 5.9325 6.68063 7.76781 6.68063 7.76781L7.8575 12.0291L2.86344 8.94469ZM19.6766 12.3681C19.6941 12.2784 20.7813 7.80281 20.7813 7.80281C20.7813 7.75031 21.5469 7.39375 21.5469 7.32156C21.5469 7.24938 22.9381 4.98531 22.9381 4.98531L25.2569 5.075L25.7381 7.37406L24.5788 9.28156C24.5809 9.28375 19.6591 12.4556 19.6766 12.3681Z"
        fill="#FEC417"
      />
      <path
        d="M26.2325 6.7025C26.0619 4.66375 24.045 4.17594 23.2159 4.47125C22.3869 4.76656 21.8487 5.32 21.665 6.1075C21.5163 6.74406 21.3675 7.16844 21.1969 7.23406C21.0087 7.30406 20.8359 7.27562 20.8359 7.27562C20.8359 7.27562 20.8053 5.8975 20.8141 5.34188C20.8359 4.19563 21.1859 3.9025 21.1859 3.9025C21.1859 3.9025 21.1116 3.51531 20.9628 3.30094C20.8141 3.08875 20.5384 2.81312 20.5384 2.81312C20.5384 2.81312 20.6019 3.36438 20.3262 3.49344C20.0506 3.6225 19.7531 3.43 19.7531 3.43L20.0288 4.57625C20.0288 4.57625 19.5825 10.29 19.5409 10.4169C19.4994 10.5437 17.8216 13.4531 17.8216 13.4531C17.8216 13.4531 16.8438 14.3675 16.3778 14.5797C15.9097 14.7919 15.5072 15.3453 13.7025 15.365C11.8978 15.3869 10.3469 13.9628 10.3469 13.9628L8.79594 12.4753L7.64969 9.09781L7.47906 5.65688L7.55125 4.40562L7.60156 3.88281L7.52062 3.61813C7.52062 3.61813 7.37187 3.76688 7.09625 3.70344C6.82062 3.64 6.71344 3.27906 6.71344 3.27906C6.71344 3.27906 6.60625 3.44969 6.58656 3.535C6.56469 3.62031 6.54281 3.81719 6.54281 3.81719C6.54281 3.81719 6.84031 4.13 6.90375 4.57625C6.96719 5.0225 6.88187 6.87094 6.56469 6.82719C6.24531 6.78562 6.35031 5.23469 5.14062 4.63969C4.09281 4.12344 2.52875 4.27875 1.89 5.57375C1.25344 6.86875 1.71937 8.39781 3.71656 9.82187C5.71375 11.2459 7.84 12.4425 8.17687 13.5844C8.57938 14.9428 7.66719 15.75 7.66719 15.75C7.66719 15.75 8.33 15.6581 8.65594 14.9472C8.76094 14.7175 8.80031 14.3828 8.81562 14.1837C9.57031 15.1681 10.5744 16.0016 11.9044 16.4041C12.4075 16.5769 12.9741 16.6644 13.7616 16.6644C13.8753 16.6644 13.9869 16.66 14.0984 16.6556C15.0194 16.6228 15.8069 16.45 16.5703 16.0716C17.6006 15.5947 18.3991 14.8663 19.0159 14.0394C18.9984 14.2363 19.1188 14.7262 19.3484 15.1134C19.7509 15.7937 20.4313 15.8353 20.4313 15.8353C20.4313 15.8353 19.4972 15.2841 19.6875 13.9672C19.8778 12.6503 20.7484 12.1822 22.0653 11.3334C23.3866 10.4825 26.4009 8.74125 26.2325 6.7025ZM4.65281 9.59219C4.06 9.17437 3.02094 8.61656 2.59219 7.76562C2.02125 6.63031 2.485 5.25875 3.57 5.09031C5.82313 4.73594 5.86469 7.53375 6.01344 7.87281C6.16219 8.21188 6.58656 8.23375 6.58656 8.23375C6.58656 8.23375 6.60187 8.42187 6.66312 8.785C6.66531 8.79594 6.6675 8.80469 6.6675 8.81562L6.67406 8.84844C6.71563 9.09563 6.77469 9.40406 6.85781 9.75625L6.86437 9.7825C6.91031 9.98156 6.95844 10.1697 7.00875 10.3425C7.10938 10.7056 7.23187 11.0972 7.38281 11.4997C7.16406 11.3509 5.91063 10.4825 4.65281 9.59219ZM25.0644 8.01937C24.5941 8.78062 23.6425 9.34719 22.9403 9.82406C22.0347 10.4387 20.6872 11.3619 20.3066 11.62C20.3941 11.3881 20.4706 11.1584 20.5406 10.9331C20.6544 10.6356 20.7747 10.2725 20.8578 9.88094C21.0766 8.85281 21.1137 7.95375 21.1137 7.95375C21.1137 7.95375 21.56 8.08063 21.8356 7.78313C22.1113 7.48563 22.2141 6.5625 22.4722 6.12719C22.8747 5.44688 23.6819 4.74687 24.8937 5.59562C25.5938 6.08781 25.62 7.11812 25.0644 8.01937ZM13.2388 17.3491L14.4747 17.3337C14.4747 17.3337 14.5075 18.6834 14.7022 19.6897C14.8969 20.6981 15.1572 21.8181 15.1572 21.8181C15.1572 21.8181 12.6394 22.6625 12.6547 21.7525C12.67 20.8425 13.0441 19.0706 13.0441 19.0706C13.0441 19.0706 13.2716 16.9597 13.2388 17.3491Z"
        fill="#FFA828"
      />
      <path
        d="M11.1648 3.32281C11.1648 3.32281 12.5407 3.1675 13.8204 3.18719C15.1001 3.20688 16.417 3.45844 16.417 3.45844C16.417 3.45844 16.3404 7.74156 16.1063 10.1456C15.8745 12.5497 14.9645 14.35 14.7217 14.8597C14.4876 15.3541 14.317 15.6188 14.317 15.6188L13.0832 15.4744L10.9504 11.1913L11.1648 3.32281Z"
        fill="#FFA828"
      />
      <path
        d="M9.51747 3.96375C9.51747 3.96375 9.90466 3.76906 10.4668 3.55688C10.9765 3.36438 11.4359 3.30531 11.4359 3.30531C11.4359 3.30531 11.449 6.14469 11.495 8.17031C11.5343 9.89625 12.1731 12.7247 12.4837 13.4816C12.7943 14.2384 13.3543 15.3934 13.3543 15.3934C13.3543 15.3934 12.2278 15.2316 11.5343 14.3522C11.169 13.8884 9.4606 10.3009 9.40153 7.93625C9.34247 5.57156 9.57435 3.90469 9.51747 3.96375Z"
        fill="#FFEFAB"
      />
      <path
        d="M8.87687 4.29188C8.8375 4.40781 8.52906 6.85125 9.0125 9.1175C9.49594 11.3837 10.2112 12.9347 10.6837 13.5494C11.1037 14.0941 11.3772 14.3522 11.5325 14.3522C11.6878 14.3522 10.8937 12.4731 10.5241 10.9987C10.1566 9.52656 9.96187 7.76125 9.9225 6.89062C9.88312 6.01781 9.84594 3.76906 9.84594 3.76906C9.84594 3.76906 9.41937 3.96375 9.32312 4.02062C9.22687 4.07969 8.87687 4.29188 8.87687 4.29188Z"
        fill="#FFFCFD"
      />
      <path
        d="M11.6681 21.6584C11.6681 21.6584 12.5016 20.3022 12.6766 19.2741C12.8516 18.2459 12.9478 17.3359 12.9478 17.3359L13.4641 17.3578C13.4641 17.3578 13.4138 18.8475 13.3547 19.8559C13.2956 20.8644 13.1228 21.8531 13.1228 21.8531L11.6681 21.6584Z"
        fill="#FFEFAB"
      />
      <path
        d="M12.3091 16.4959C12.3091 16.4959 12.6962 16.1175 13.7616 16.1175C14.8269 16.1175 15.2841 16.5266 15.2841 16.5266L15.3125 17.8412C15.3125 17.8412 14.6037 17.6203 13.7419 17.6094C13.0244 17.6006 12.2522 17.8675 12.2522 17.8675L12.3091 16.4959ZM7.65625 3.43875C7.83562 3.2725 9.555 1.98187 13.6259 1.94687C18.0053 1.9075 19.6481 3.17625 19.7509 3.24625C19.8669 3.32281 20.0025 3.67281 19.9456 3.82812C19.8866 3.98344 19.7706 4.04031 19.4425 3.90469C19.1122 3.76906 17.4847 2.58125 13.5691 2.70375C9.80875 2.81969 8.21406 3.96375 8.04562 4.06C7.91 4.13656 7.65844 4.15625 7.5425 4.00094C7.42437 3.84781 7.54031 3.54812 7.65625 3.43875ZM19.9456 4.35094C19.4425 4.39031 19.7903 8.44156 18.725 10.9791C17.5831 13.6937 16.1262 14.4681 16.1853 14.6234C16.2444 14.7787 17.6706 14.3478 18.5697 13.0725C19.4031 11.8912 19.9062 10.8434 20.1403 9.44781C20.37 8.05219 20.5056 4.30719 19.9456 4.35094ZM7.54906 4.81469C7.42219 4.80812 7.55125 6.82937 7.34562 7.7175C7.26687 8.05875 7.07437 8.12875 7.05469 8.20531C7.035 8.28187 7.47687 10.8828 8.21844 12.0247C8.93594 13.1294 10.3512 14.5053 10.5831 14.2734C10.815 14.0416 9.555 13.265 8.70406 11.5784C8.21406 10.6116 7.71531 9.15469 7.69562 7.48781C7.6825 6.38531 7.82031 4.83 7.54906 4.81469Z"
        fill="#D1701C"
      />
      <path
        d="M18.9806 24.6553L18.9784 21.5294H8.94435C8.97498 21.5294 8.95092 24.0713 8.94654 24.6663H7.52029V26.9303H20.2625V24.6663L18.9806 24.6553Z"
        fill="#865C50"
      />
      <path
        d="M12.1601 23.1722C11.9129 23.1612 11.6285 23.2116 11.6176 23.5178C11.6067 23.8241 11.6067 24.71 11.6067 24.8784C11.6067 25.0469 11.7445 25.1934 12.0901 25.2044C12.4357 25.2153 15.6798 25.2044 15.9073 25.2044C16.1348 25.2044 16.2529 25.0075 16.2617 24.8106C16.2726 24.6137 16.2507 23.7847 16.2507 23.5594C16.2507 23.1853 15.916 23.1853 15.6885 23.1853C15.4435 23.1809 12.1601 23.1722 12.1601 23.1722Z"
        fill="#FCC219"
      />
    </g>
  </svg>
);
export const TalentHomeLearningMortarboardIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M1.41574 5.19405C1.41574 6.14462 7.15059 8.73622 8.49033 8.73622C9.83014 8.73622 15.5649 6.14462 15.5649 5.19405C15.5649 4.24348 9.83014 1.65186 8.49033 1.65186C7.15059 1.65186 1.41574 4.24348 1.41574 5.19405Z"
        strokeWidth="0.944444"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#387440"
      />
      <path
        d="M4.24447 7.31944L5.1308 11.4279C5.19151 11.7093 5.33164 11.9723 5.56534 12.1399C7.13908 13.2693 9.83931 13.2693 11.4131 12.1399C11.6468 11.9723 11.7869 11.7093 11.8477 11.4279L12.734 7.31944"
        strokeWidth="0.944444"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#387440"
      />
      <path
        d="M14.5053 6.25648V11.2156M14.5053 11.2156C13.945 12.2402 13.6972 12.7892 13.4455 13.6951C13.3909 14.0175 13.4343 14.1799 13.6561 14.3241C13.7463 14.3827 13.8546 14.4035 13.962 14.4035H15.0377C15.152 14.4035 15.2674 14.3796 15.3616 14.3146C15.5678 14.1722 15.6208 14.016 15.5649 13.6951C15.3444 12.8539 15.0634 12.2788 14.5053 11.2156Z"
        strokeWidth="0.944444"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeMatchHeartIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M12.1603 3.17219C11.2805 3.28352 10.3339 3.83071 9.57427 5.06048C9.4513 5.25956 9.234 5.38075 9 5.38075C8.76601 5.38075 8.5487 5.25957 8.42573 5.06049C7.6661 3.83075 6.7195 3.28356 5.83972 3.17222C4.94962 3.05958 4.03436 3.38031 3.31619 4.06603C1.89429 5.43629 1.8946 7.74572 3.31714 9.11556L9 14.5879L14.6829 9.11556C16.1054 7.74572 16.1057 5.4363 14.6838 4.06604C13.9656 3.38031 13.0504 3.05956 12.1603 3.17219ZM11.9908 1.83287C13.3266 1.66384 14.6371 2.15425 15.6174 3.09087L15.6193 3.09268C17.5936 4.99385 17.5936 8.18683 15.6193 10.088L9.46821 16.0112C9.20681 16.2629 8.79319 16.2629 8.53179 16.0112L2.38072 10.088C0.406426 8.18683 0.406426 4.99385 2.38072 3.09269L2.38261 3.09087L2.38262 3.09087C3.36288 2.15424 4.67345 1.66386 6.00921 1.8329C7.09813 1.9707 8.14335 2.53841 8.99999 3.55452C9.85664 2.53838 10.9019 1.97067 11.9908 1.83287Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#595959"
      />
    </g>
  </svg>
);
export const TalentHomeMilestoneEyeIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="11.4"
    viewBox="0 0 12 11.4"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M3.74413 4.16097C3.07169 4.72542 2.54207 5.39832 2.24389 5.81737C2.19532 5.88563 2.17253 5.9182 2.15726 5.94408C2.14772 5.96025 2.14591 5.96594 2.14491 5.96981C2.14479 5.97049 2.14443 5.97265 2.14403 5.97634C2.14334 5.98268 2.14286 5.99086 2.14286 6C2.14286 6.00914 2.14334 6.01732 2.14403 6.02366C2.14442 6.02735 2.14479 6.0295 2.14491 6.03018C2.14591 6.03406 2.14772 6.03975 2.15726 6.05592C2.17253 6.0818 2.19532 6.11437 2.24389 6.18263C2.54207 6.60168 3.07169 7.27458 3.74413 7.83903C4.42253 8.40847 5.19973 8.82857 6 8.82857C6.80027 8.82857 7.57747 8.40847 8.25587 7.83903C8.92831 7.27458 9.45793 6.60168 9.75612 6.18263C9.80468 6.11437 9.82748 6.0818 9.84274 6.05592C9.85228 6.03974 9.85409 6.03406 9.85509 6.03018C9.85521 6.0295 9.85558 6.02735 9.85598 6.02366C9.85666 6.01732 9.85714 6.00914 9.85714 6C9.85714 5.99086 9.85666 5.98268 9.85598 5.97634C9.85558 5.97265 9.85521 5.9705 9.85509 5.96982C9.85409 5.96594 9.85228 5.96026 9.84274 5.94408C9.82748 5.9182 9.80468 5.88563 9.75612 5.81737C9.45793 5.39832 8.92831 4.72542 8.25587 4.16097C7.57747 3.59153 6.80027 3.17143 6 3.17143C5.19973 3.17143 4.42253 3.59153 3.74413 4.16097ZM3.24817 3.57011C3.98495 2.95166 4.93537 2.4 6 2.4C7.06463 2.4 8.01506 2.95166 8.75183 3.57011C9.49457 4.19356 10.0677 4.92467 10.3847 5.37012C10.3899 5.37743 10.3951 5.38479 10.4004 5.39222C10.4766 5.49875 10.5616 5.6176 10.6032 5.78139C10.637 5.91497 10.637 6.08503 10.6032 6.21861C10.5616 6.3824 10.4766 6.50125 10.4004 6.60778C10.3951 6.61521 10.3899 6.62257 10.3847 6.62988C10.0677 7.07533 9.49457 7.80644 8.75183 8.42989C8.01506 9.04834 7.06463 9.6 6 9.6C4.93537 9.6 3.98495 9.04834 3.24817 8.42989C2.50543 7.80644 1.93231 7.07533 1.61534 6.62988C1.61014 6.62257 1.60488 6.61521 1.59957 6.60779C1.52339 6.50125 1.43841 6.3824 1.39685 6.21861C1.36296 6.08503 1.36296 5.91497 1.39685 5.78139C1.43841 5.6176 1.52339 5.49875 1.59957 5.39221C1.60488 5.38479 1.61014 5.37743 1.61534 5.37012C1.93231 4.92467 2.50543 4.19356 3.24817 3.57011ZM6 5.22857C5.57395 5.22857 5.22857 5.57395 5.22857 6C5.22857 6.42605 5.57395 6.77143 6 6.77143C6.42605 6.77143 6.77143 6.42605 6.77143 6C6.77143 5.57395 6.42605 5.22857 6 5.22857ZM4.45714 6C4.45714 5.1479 5.1479 4.45714 6 4.45714C6.8521 4.45714 7.54286 5.1479 7.54286 6C7.54286 6.8521 6.8521 7.54286 6 7.54286C5.1479 7.54286 4.45714 6.8521 4.45714 6Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeMilestoneEyeReachedIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="11.4"
    viewBox="0 0 12 11.4"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M3.74413 4.16097C3.07169 4.72542 2.54207 5.39832 2.24389 5.81737C2.19532 5.88563 2.17253 5.9182 2.15726 5.94408C2.14772 5.96025 2.14591 5.96594 2.14491 5.96981C2.14479 5.97049 2.14443 5.97265 2.14403 5.97634C2.14334 5.98268 2.14286 5.99086 2.14286 6C2.14286 6.00914 2.14334 6.01732 2.14403 6.02366C2.14442 6.02735 2.14479 6.0295 2.14491 6.03018C2.14591 6.03406 2.14772 6.03975 2.15726 6.05592C2.17253 6.0818 2.19532 6.11437 2.24389 6.18263C2.54207 6.60168 3.07169 7.27458 3.74413 7.83903C4.42253 8.40847 5.19973 8.82857 6 8.82857C6.80027 8.82857 7.57747 8.40847 8.25587 7.83903C8.92831 7.27458 9.45793 6.60168 9.75612 6.18263C9.80468 6.11437 9.82748 6.0818 9.84274 6.05592C9.85228 6.03974 9.85409 6.03406 9.85509 6.03018C9.85521 6.0295 9.85558 6.02735 9.85598 6.02366C9.85666 6.01732 9.85714 6.00914 9.85714 6C9.85714 5.99086 9.85666 5.98268 9.85598 5.97634C9.85558 5.97265 9.85521 5.9705 9.85509 5.96982C9.85409 5.96594 9.85228 5.96026 9.84274 5.94408C9.82748 5.9182 9.80468 5.88563 9.75612 5.81737C9.45793 5.39832 8.92831 4.72542 8.25587 4.16097C7.57747 3.59153 6.80027 3.17143 6 3.17143C5.19973 3.17143 4.42253 3.59153 3.74413 4.16097ZM3.24817 3.57011C3.98495 2.95166 4.93537 2.4 6 2.4C7.06463 2.4 8.01506 2.95166 8.75183 3.57011C9.49457 4.19356 10.0677 4.92467 10.3847 5.37012C10.3899 5.37743 10.3951 5.38479 10.4004 5.39222C10.4766 5.49875 10.5616 5.6176 10.6032 5.78139C10.637 5.91497 10.637 6.08503 10.6032 6.21861C10.5616 6.3824 10.4766 6.50125 10.4004 6.60778C10.3951 6.61521 10.3899 6.62257 10.3847 6.62988C10.0677 7.07533 9.49457 7.80644 8.75183 8.42989C8.01506 9.04834 7.06463 9.6 6 9.6C4.93537 9.6 3.98495 9.04834 3.24817 8.42989C2.50543 7.80644 1.93231 7.07533 1.61534 6.62988C1.61014 6.62257 1.60488 6.61521 1.59957 6.60779C1.52339 6.50125 1.43841 6.3824 1.39685 6.21861C1.36296 6.08503 1.36296 5.91497 1.39685 5.78139C1.43841 5.6176 1.52339 5.49875 1.59957 5.39221C1.60488 5.38479 1.61014 5.37743 1.61534 5.37012C1.93231 4.92467 2.50543 4.19356 3.24817 3.57011ZM6 5.22857C5.57395 5.22857 5.22857 5.57395 5.22857 6C5.22857 6.42605 5.57395 6.77143 6 6.77143C6.42605 6.77143 6.77143 6.42605 6.77143 6C6.77143 5.57395 6.42605 5.22857 6 5.22857ZM4.45714 6C4.45714 5.1479 5.1479 4.45714 6 4.45714C6.8521 4.45714 7.54286 5.1479 7.54286 6C7.54286 6.8521 6.8521 7.54286 6 7.54286C5.1479 7.54286 4.45714 6.8521 4.45714 6Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1C2A21"
      />
    </g>
  </svg>
);
export const TalentHomeMilestoneTrendUpIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M7.2 2.85C7.2 2.60147 7.40147 2.4 7.65 2.4H10.95C11.1985 2.4 11.4 2.60147 11.4 2.85V6.15C11.4 6.39853 11.1985 6.6 10.95 6.6C10.7015 6.6 10.5 6.39853 10.5 6.15V3.9364L6.7682 7.6682C6.60985 7.82655 6.35915 7.84437 6.18 7.71L4.12201 6.16651L1.3957 9.43808C1.2366 9.62901 0.952842 9.6548 0.761917 9.4957C0.570992 9.3366 0.545197 9.05284 0.7043 8.86192L3.7043 5.26192C3.85767 5.07787 4.12834 5.04626 4.32 5.19L6.40777 6.75583L9.86361 3.3H7.65C7.40147 3.3 7.2 3.09853 7.2 2.85Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeMilestoneTrophyIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M9.105 5.56406C9.31313 5.3925 10.515 4.64906 11.1731 4.02281C11.6869 3.53344 11.8856 2.25563 11.0953 1.63406C10.0678 0.826875 9.08156 1.67438 9.08156 1.67438C9.08156 1.67438 8.99531 1.19531 8.39531 0.914063C7.63969 0.559688 6.6825 0.4275 5.80219 0.43875C4.94906 0.449063 4.16344 0.552188 3.46594 0.894375C2.84156 1.20094 2.80406 1.63781 2.80406 1.63781C2.80406 1.63781 1.98469 0.855 0.980625 1.49062C-0.0224999 2.12719 0.265313 3.40219 0.748125 3.9375C1.37719 4.635 2.13281 4.99031 2.47594 5.24719C2.81813 5.50406 3.14625 5.74875 3.14625 5.96906C3.14625 6.18937 3.04875 6.23812 3.01125 6.22594C2.97469 6.21375 2.91 5.99906 2.74219 6.09094C2.51344 6.2175 2.58281 6.7275 3.06 6.77625C3.52219 6.82406 3.61031 6.33562 3.61031 6.33562L3.68344 5.85844L4.44188 6.38437L5.27344 7.06969L5.24906 7.65656C5.24906 7.65656 5.2125 8.10937 4.99219 8.50125C4.77187 8.89312 4.4175 9.28406 4.4175 9.28406L4.40625 9.63844L7.48969 9.56531L7.39219 9.22312C7.39219 9.22312 6.99469 8.78625 6.75562 8.3175C6.585 7.98187 6.55781 7.64344 6.55781 7.64344L6.55031 6.80156L8.15063 5.82094C8.15063 5.82094 8.32219 5.95594 8.29781 6.00469C8.27344 6.05344 8.26781 6.55312 8.65219 6.73875C9.03187 6.9225 9.3375 6.69 9.30094 6.37125C9.26437 6.05344 9.06844 6.16312 9.0075 6.21187C8.94656 6.26062 8.81156 6.27281 8.775 6.08906C8.7375 5.90719 8.89688 5.73562 9.105 5.56406ZM1.22719 3.83344L0.860625 2.71781L1.30406 2.1375L1.80094 1.99219C1.80094 1.99219 2.43562 2.46562 2.45812 2.50406C2.48062 2.5425 2.86313 3.32906 2.86313 3.32906L3.3675 5.15531L1.22719 3.83344ZM8.43281 5.30062C8.44031 5.26219 8.90625 3.34406 8.90625 3.34406C8.90625 3.32156 9.23438 3.16875 9.23438 3.13781C9.23438 3.10687 9.83062 2.13656 9.83062 2.13656L10.8244 2.175L11.0306 3.16031L10.5337 3.97781C10.5347 3.97875 8.42531 5.33812 8.43281 5.30062Z"
        fill="#FEC417"
      />
      <path
        d="M11.2425 2.8725C11.1694 1.99875 10.305 1.78969 9.94969 1.91625C9.59438 2.04281 9.36375 2.28 9.285 2.6175C9.22125 2.89031 9.1575 3.07219 9.08438 3.10031C9.00375 3.13031 8.92969 3.11812 8.92969 3.11812C8.92969 3.11812 8.91656 2.5275 8.92031 2.28938C8.92969 1.79813 9.07969 1.6725 9.07969 1.6725C9.07969 1.6725 9.04781 1.50656 8.98406 1.41469C8.92031 1.32375 8.80219 1.20563 8.80219 1.20563C8.80219 1.20563 8.82937 1.44188 8.71125 1.49719C8.59313 1.5525 8.46563 1.47 8.46563 1.47L8.58375 1.96125C8.58375 1.96125 8.3925 4.41 8.37469 4.46438C8.35688 4.51875 7.63781 5.76562 7.63781 5.76562C7.63781 5.76562 7.21875 6.1575 7.01906 6.24844C6.81844 6.33938 6.64594 6.57656 5.8725 6.585C5.09906 6.59437 4.43437 5.98406 4.43437 5.98406L3.76969 5.34656L3.27844 3.89906L3.20531 2.42438L3.23625 1.88813L3.25781 1.66406L3.22313 1.55063C3.22313 1.55063 3.15937 1.61438 3.04125 1.58719C2.92312 1.56 2.87719 1.40531 2.87719 1.40531C2.87719 1.40531 2.83125 1.47844 2.82281 1.515C2.81344 1.55156 2.80406 1.63594 2.80406 1.63594C2.80406 1.63594 2.93156 1.77 2.95875 1.96125C2.98594 2.1525 2.94938 2.94469 2.81344 2.92594C2.67656 2.90812 2.72156 2.24344 2.20312 1.98844C1.75406 1.76719 1.08375 1.83375 0.81 2.38875C0.537188 2.94375 0.736875 3.59906 1.59281 4.20938C2.44875 4.81969 3.36 5.3325 3.50438 5.82188C3.67688 6.40406 3.28594 6.75 3.28594 6.75C3.28594 6.75 3.57 6.71063 3.70969 6.40594C3.75469 6.3075 3.77156 6.16406 3.77812 6.07875C4.10156 6.50062 4.53188 6.85781 5.10188 7.03031C5.3175 7.10437 5.56031 7.14187 5.89781 7.14187C5.94656 7.14187 5.99437 7.14 6.04219 7.13812C6.43688 7.12406 6.77438 7.05 7.10156 6.88781C7.54313 6.68344 7.88531 6.37125 8.14969 6.01687C8.14219 6.10125 8.19375 6.31125 8.29219 6.47719C8.46469 6.76875 8.75625 6.78656 8.75625 6.78656C8.75625 6.78656 8.35594 6.55031 8.4375 5.98594C8.51906 5.42156 8.89219 5.22094 9.45656 4.85719C10.0228 4.4925 11.3147 3.74625 11.2425 2.8725ZM1.99406 4.11094C1.74 3.93187 1.29469 3.69281 1.11094 3.32812C0.86625 2.84156 1.065 2.25375 1.53 2.18156C2.49563 2.02969 2.51344 3.22875 2.57719 3.37406C2.64094 3.51938 2.82281 3.52875 2.82281 3.52875C2.82281 3.52875 2.82937 3.60938 2.85562 3.765C2.85656 3.76969 2.8575 3.77344 2.8575 3.77812L2.86031 3.79219C2.87813 3.89813 2.90344 4.03031 2.93906 4.18125L2.94187 4.1925C2.96156 4.27781 2.98219 4.35844 3.00375 4.4325C3.04688 4.58812 3.09937 4.75594 3.16406 4.92844C3.07031 4.86469 2.53313 4.4925 1.99406 4.11094ZM10.7419 3.43687C10.5403 3.76312 10.1325 4.00594 9.83156 4.21031C9.44344 4.47375 8.86594 4.86937 8.70281 4.98C8.74031 4.88063 8.77313 4.78219 8.80313 4.68563C8.85188 4.55813 8.90344 4.4025 8.93906 4.23469C9.03281 3.79406 9.04875 3.40875 9.04875 3.40875C9.04875 3.40875 9.24 3.46313 9.35813 3.33563C9.47625 3.20813 9.52031 2.8125 9.63094 2.62594C9.80344 2.33438 10.1494 2.03438 10.6688 2.39813C10.9688 2.60906 10.98 3.05062 10.7419 3.43687ZM5.67375 7.43531L6.20344 7.42875C6.20344 7.42875 6.2175 8.00719 6.30094 8.43844C6.38438 8.87063 6.49594 9.35062 6.49594 9.35062C6.49594 9.35062 5.41688 9.7125 5.42344 9.3225C5.43 8.9325 5.59031 8.17312 5.59031 8.17312C5.59031 8.17312 5.68781 7.26844 5.67375 7.43531Z"
        fill="#FFA828"
      />
      <path
        d="M4.78491 1.42406C4.78491 1.42406 5.3746 1.3575 5.92303 1.36594C6.47147 1.37438 7.03585 1.48219 7.03585 1.48219C7.03585 1.48219 7.00303 3.31781 6.90272 4.34813C6.80335 5.37844 6.41335 6.15 6.30928 6.36844C6.20897 6.58031 6.13585 6.69375 6.13585 6.69375L5.6071 6.63188L4.69303 4.79625L4.78491 1.42406Z"
        fill="#FFA828"
      />
      <path
        d="M4.07892 1.69875C4.07892 1.69875 4.24485 1.61531 4.48579 1.52438C4.70423 1.44188 4.9011 1.41656 4.9011 1.41656C4.9011 1.41656 4.90673 2.63344 4.92642 3.50156C4.94329 4.24125 5.21704 5.45344 5.35017 5.77781C5.48329 6.10219 5.72329 6.59719 5.72329 6.59719C5.72329 6.59719 5.24048 6.52781 4.94329 6.15094C4.78673 5.95219 4.05454 4.41469 4.02923 3.40125C4.00392 2.38781 4.10329 1.67344 4.07892 1.69875Z"
        fill="#FFEFAB"
      />
      <path
        d="M3.80438 1.83938C3.7875 1.88906 3.65531 2.93625 3.8625 3.9075C4.06969 4.87875 4.37625 5.54344 4.57875 5.80688C4.75875 6.04031 4.87594 6.15094 4.9425 6.15094C5.00906 6.15094 4.66875 5.34563 4.51031 4.71375C4.35281 4.08281 4.26938 3.32625 4.2525 2.95313C4.23563 2.57906 4.21969 1.61531 4.21969 1.61531C4.21969 1.61531 4.03688 1.69875 3.99563 1.72313C3.95438 1.74844 3.80438 1.83938 3.80438 1.83938Z"
        fill="#FFFCFD"
      />
      <path
        d="M5.00063 9.28219C5.00063 9.28219 5.35781 8.70094 5.43281 8.26031C5.50781 7.81969 5.54906 7.42969 5.54906 7.42969L5.77031 7.43906C5.77031 7.43906 5.74875 8.0775 5.72344 8.50969C5.69813 8.94188 5.62406 9.36563 5.62406 9.36563L5.00063 9.28219Z"
        fill="#FFEFAB"
      />
      <path
        d="M5.27531 7.06969C5.27531 7.06969 5.44125 6.9075 5.89781 6.9075C6.35438 6.9075 6.55031 7.08281 6.55031 7.08281L6.5625 7.64625C6.5625 7.64625 6.25875 7.55156 5.88938 7.54688C5.58188 7.54313 5.25094 7.6575 5.25094 7.6575L5.27531 7.06969ZM3.28125 1.47375C3.35813 1.4025 4.095 0.849375 5.83969 0.834375C7.71656 0.8175 8.42063 1.36125 8.46469 1.39125C8.51438 1.42406 8.5725 1.57406 8.54813 1.64063C8.52281 1.70719 8.47313 1.73156 8.3325 1.67344C8.19094 1.61531 7.49344 1.10625 5.81531 1.15875C4.20375 1.20844 3.52031 1.69875 3.44813 1.74C3.39 1.77281 3.28219 1.78125 3.2325 1.71469C3.18188 1.64906 3.23156 1.52063 3.28125 1.47375ZM8.54813 1.86469C8.3325 1.88156 8.48156 3.61781 8.025 4.70531C7.53563 5.86875 6.91125 6.20063 6.93656 6.26719C6.96188 6.33375 7.57313 6.14906 7.95844 5.6025C8.31563 5.09625 8.53125 4.64719 8.63156 4.04906C8.73 3.45094 8.78813 1.84594 8.54813 1.86469ZM3.23531 2.06344C3.18094 2.06063 3.23625 2.92688 3.14813 3.3075C3.11438 3.45375 3.03188 3.48375 3.02344 3.51656C3.015 3.54937 3.20438 4.66406 3.52219 5.15344C3.82969 5.62688 4.43625 6.21656 4.53563 6.11719C4.635 6.01781 4.095 5.685 3.73031 4.96219C3.52031 4.54781 3.30656 3.92344 3.29813 3.20906C3.2925 2.73656 3.35156 2.07 3.23531 2.06344Z"
        fill="#D1701C"
      />
      <path
        d="M8.13454 10.5666L8.13361 9.22688H3.83329C3.84642 9.22688 3.83611 10.3163 3.83423 10.5713H3.22298V11.5416H8.68392V10.5713L8.13454 10.5666Z"
        fill="#865C50"
      />
      <path
        d="M5.21147 9.93094C5.10553 9.92625 4.98366 9.94781 4.97897 10.0791C4.97428 10.2103 4.97428 10.59 4.97428 10.6622C4.97428 10.7344 5.03335 10.7972 5.18147 10.8019C5.3296 10.8066 6.71991 10.8019 6.81741 10.8019C6.91491 10.8019 6.96553 10.7175 6.96928 10.6331C6.97397 10.5488 6.9646 10.1934 6.9646 10.0969C6.9646 9.93656 6.82116 9.93656 6.72366 9.93656C6.61866 9.93469 5.21147 9.93094 5.21147 9.93094Z"
        fill="#FCC219"
      />
    </g>
  </svg>
);
export const TalentHomeNoteInfoIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2ZM0.8 8C0.8 4.02355 4.02355 0.8 8 0.8C11.9765 0.8 15.2 4.02355 15.2 8C15.2 11.9765 11.9765 15.2 8 15.2C4.02355 15.2 0.8 11.9765 0.8 8ZM8 4C8.33137 4 8.6 4.26863 8.6 4.6V5.8C8.6 6.13137 8.33137 6.4 8 6.4C7.66863 6.4 7.4 6.13137 7.4 5.8V4.6C7.4 4.26863 7.66863 4 8 4ZM8 8C8.33137 8 8.6 8.26863 8.6 8.6V11.4C8.6 11.7314 8.33137 12 8 12C7.66863 12 7.4 11.7314 7.4 11.4V8.6C7.4 8.26863 7.66863 8 8 8Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#785910"
      />
    </g>
  </svg>
);
export const TalentHomePlusIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M8 3.20039C8.33137 3.20039 8.6 3.46902 8.6 3.80039V7.40049H12.2C12.5314 7.40049 12.8 7.66912 12.8 8.00049C12.8 8.33186 12.5314 8.60049 12.2 8.60049H8.6V12.2004C8.6 12.5318 8.33137 12.8004 8 12.8004C7.66863 12.8004 7.4 12.5318 7.4 12.2004V8.60049H3.8C3.46863 8.60049 3.2 8.33186 3.2 8.00049C3.2 7.66912 3.46863 7.40049 3.8 7.40049H7.4V3.80039C7.4 3.46902 7.66863 3.20039 8 3.20039Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomePrivacyLockIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M4.2 3.5C4.2 1.9536 5.4536 0.7 7 0.7C8.5464 0.7 9.8 1.9536 9.8 3.5V5.6H10.675C11.7381 5.6 12.6 6.46185 12.6 7.525V11.375C12.6 12.4381 11.7381 13.3 10.675 13.3H3.325C2.26185 13.3 1.4 12.4381 1.4 11.375V7.525C1.4 6.46185 2.26185 5.6 3.325 5.6H4.2V3.5ZM5.25 5.6H8.75V3.5C8.75 2.5335 7.9665 1.75 7 1.75C6.0335 1.75 5.25 2.5335 5.25 3.5V5.6ZM3.325 6.65C2.84175 6.65 2.45 7.04175 2.45 7.525V11.375C2.45 11.8582 2.84175 12.25 3.325 12.25H10.675C11.1582 12.25 11.55 11.8582 11.55 11.375V7.525C11.55 7.04175 11.1582 6.65 10.675 6.65H3.325ZM7 8.4C7.28995 8.4 7.525 8.63505 7.525 8.925V9.975C7.525 10.2649 7.28995 10.5 7 10.5C6.71005 10.5 6.475 10.2649 6.475 9.975V8.925C6.475 8.63505 6.71005 8.4 7 8.4Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#595959"
      />
    </g>
  </svg>
);
export const TalentHomeQuestBellIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M3.64768 4.1406C3.84451 2.16225 5.53828 0.8 7.49259 0.8H8.50625C10.4606 0.8 12.1543 2.16225 12.3512 4.1406L12.3515 4.14375L12.6901 7.7406C12.6902 7.74113 12.6902 7.74167 12.6903 7.74221C12.8015 8.8566 13.2826 9.98162 14.0424 10.7887C14.4576 11.2298 14.4612 11.8408 14.3001 12.2783C14.1385 12.7171 13.7241 13.2 13.0722 13.2H10.3662C10.1758 14.3351 9.18862 15.2 7.99942 15.2C6.81023 15.2 5.82304 14.3351 5.63261 13.2H2.92667C2.27476 13.2 1.8603 12.7171 1.69874 12.2783C1.53766 11.8408 1.54127 11.2298 1.95645 10.7887C2.71623 9.98161 3.19736 8.85655 3.30857 7.74213L3.64768 4.1406ZM13.0722 12C13.0752 12 13.076 11.9997 13.077 11.9993C13.0787 11.9986 13.0852 11.9958 13.0956 11.987C13.1184 11.9678 13.1506 11.9272 13.174 11.8637C13.1972 11.8006 13.2034 11.737 13.1971 11.6873C13.191 11.6399 13.176 11.6191 13.1686 11.6113C12.2118 10.5949 11.6309 9.21494 11.496 7.8594L11.4957 7.85625L11.1571 4.2594C11.157 4.25888 11.1569 4.25836 11.1569 4.25784C11.0268 2.95862 9.91044 2 8.50625 2H7.49259C6.08837 2 4.97198 2.95865 4.84194 4.2579C4.84189 4.2584 4.84184 4.2589 4.84179 4.2594L4.50283 7.8594C4.36797 9.21494 3.78699 10.5949 2.83022 11.6113C2.82282 11.6191 2.80785 11.6399 2.80177 11.6873C2.79541 11.737 2.80162 11.8006 2.82483 11.8637C2.84824 11.9272 2.88048 11.9678 2.90328 11.987C2.91364 11.9958 2.92008 11.9986 2.92178 11.9993C2.92278 11.9997 2.92355 12 2.92667 12H13.0722ZM6.86771 13.2C7.03244 13.6661 7.47694 14 7.99942 14C8.52191 14 8.96641 13.6661 9.13114 13.2H6.86771Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeQuestBulbIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M3.2 5.6C3.2 2.94903 5.34903 0.8 8 0.8C10.651 0.8 12.8 2.94903 12.8 5.6V5.99425C12.8 7.57289 12.011 9.04709 10.6975 9.92276C10.5116 10.0467 10.4 10.2553 10.4 10.4787V11.7456C10.4 12.3279 9.92792 12.8 9.34558 12.8H6.65442C6.07208 12.8 5.6 12.3279 5.6 11.7456V10.4787C5.6 10.2553 5.48835 10.0467 5.30247 9.92276C3.98896 9.04709 3.2 7.57289 3.2 5.99425V5.6ZM8 2C6.01178 2 4.4 3.61177 4.4 5.6V5.99425C4.4 7.17167 4.98844 8.27118 5.96811 8.9243C6.48783 9.27078 6.8 9.85407 6.8 10.4787V11.6H9.2V10.4787C9.2 9.85407 9.51217 9.27078 10.0319 8.9243C11.0116 8.27118 11.6 7.17167 11.6 5.99425V5.6C11.6 3.61177 9.98822 2 8 2ZM6.4 14.6C6.4 14.2686 6.66863 14 7 14H9C9.33137 14 9.6 14.2686 9.6 14.6C9.6 14.9314 9.33137 15.2 9 15.2H7C6.66863 15.2 6.4 14.9314 6.4 14.6Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeQuestCheckWhiteIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M12.7213 4.16654C13.0435 4.42681 13.0937 4.89902 12.8335 5.22125L7.58346 11.7213C7.44675 11.8905 7.24329 11.9921 7.02586 11.9996C6.80842 12.0071 6.59845 11.9198 6.4504 11.7603L3.2004 8.26034C2.91855 7.9568 2.93613 7.48226 3.23966 7.2004C3.54319 6.91855 4.01774 6.93613 4.2996 7.23966L6.96051 10.1053L11.6665 4.27875C11.9268 3.95651 12.399 3.90628 12.7213 4.16654Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="white"
      />
    </g>
  </svg>
);
export const TalentHomeQuestFireIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M7.22313 8.27328C7.10734 9.50828 7.02609 11.6939 7.75531 12.6242C7.75531 12.6242 7.41203 10.2233 10.4894 7.21094C11.7284 5.99828 12.0148 4.34891 11.5822 3.11187C11.3364 2.41109 10.8875 1.83219 10.4975 1.42797C10.27 1.19031 10.4447 0.798281 10.7758 0.8125C12.7786 0.901875 16.0245 1.45844 17.4038 4.91969C18.0091 6.43906 18.0538 8.00922 17.7653 9.60578C17.5825 10.6255 16.9325 12.8923 18.4153 13.1706C19.4736 13.3697 19.9855 12.5288 20.215 11.9234C20.3105 11.6716 20.6416 11.6086 20.8203 11.8097C22.6078 13.843 22.7602 16.2378 22.3905 18.2995C21.6755 22.2848 17.6394 25.1855 13.6297 25.1855C8.62063 25.1855 4.63328 22.3194 3.59938 17.1316C3.18297 15.0373 3.39422 10.8936 6.62391 7.96859C6.86359 7.74922 7.25563 7.94422 7.22313 8.27328Z"
        fill="url(#paint0_radial_8334_94552)"
      />
      <path
        d="M15.4598 15.7259C13.6134 13.3494 14.4402 10.6377 14.8931 9.55703C14.9541 9.41484 14.7916 9.28078 14.6636 9.36812C13.8694 9.90844 12.2423 11.18 11.4847 12.9695C10.4589 15.3887 10.532 16.573 11.1394 18.0192C11.505 18.8906 11.0805 19.0755 10.8672 19.108C10.66 19.1405 10.4691 19.0023 10.3167 18.8581C9.87854 18.4373 9.56624 17.9027 9.41484 17.3144C9.38234 17.1884 9.21781 17.1539 9.14266 17.2575C8.57391 18.0436 8.27937 19.305 8.26516 20.1967C8.22047 22.9531 10.4975 25.1875 13.2519 25.1875C16.7233 25.1875 19.2522 21.3484 17.2575 18.1391C16.6786 17.2047 16.1342 16.5933 15.4598 15.7259Z"
        fill="url(#paint1_radial_8334_94552)"
      />
    </g>
    <defs>
      <radialGradient
        id="paint0_radial_8334_94552"
        cx="0"
        cy="0"
        r="1"
        gradientTransform="matrix(-14.338 -0.0622268 -0.10223 23.5258 12.6376 25.2486)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.314" stopColor="#FF9800" />
        <stop offset="0.662" stopColor="#FF6D00" />
        <stop offset="0.972" stopColor="#F44336" />
      </radialGradient>
      <radialGradient
        id="paint1_radial_8334_94552"
        cx="0"
        cy="0"
        r="1"
        gradientTransform="matrix(-0.151528 15.0013 11.2896 0.114021 13.4428 10.9806)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.214" stopColor="#FFF176" />
        <stop offset="0.328" stopColor="#FFF27D" />
        <stop offset="0.487" stopColor="#FFF48F" />
        <stop offset="0.672" stopColor="#FFF7AD" />
        <stop offset="0.793" stopColor="#FFF9C4" />
        <stop offset="0.822" stopColor="#FFF8BD" stopOpacity="0.804" />
        <stop offset="0.863" stopColor="#FFF6AB" stopOpacity="0.529" />
        <stop offset="0.91" stopColor="#FFF38D" stopOpacity="0.209" />
        <stop offset="0.941" stopColor="#FFF176" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);
export const TalentHomeQuestHeartIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M10.8091 2.81973C10.0271 2.91868 9.1857 3.40508 8.51047 4.49821C8.40116 4.67517 8.208 4.78289 8 4.78289C7.79201 4.78289 7.59885 4.67517 7.48954 4.49821C6.81431 3.40511 5.97289 2.91872 5.19086 2.81975C4.39966 2.71962 3.5861 3.00472 2.94773 3.61425C1.68381 4.83226 1.68409 6.88508 2.94857 8.10272L8 12.967L13.0514 8.10272C14.3159 6.88509 14.3162 4.83227 13.0523 3.61426C12.4139 3.00472 11.6003 2.71961 10.8091 2.81973ZM10.6585 1.62922C11.8458 1.47897 13.0108 1.91489 13.8821 2.74744L13.8838 2.74905C15.6387 4.43898 15.6387 7.27718 13.8838 8.9671L8.41618 14.2322C8.18383 14.4559 7.81617 14.4559 7.58382 14.2322L2.1162 8.9671C0.361268 7.27718 0.361268 4.43898 2.1162 2.74906L2.11788 2.74744L2.11788 2.74744C2.98922 1.91488 4.15418 1.47899 5.34152 1.62925C6.30945 1.75174 7.23853 2.25637 7.99999 3.15958C8.76146 2.25634 9.69055 1.7517 10.6585 1.62922Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeSavedRolesHeartIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M11.4847 2.99596C10.6538 3.1011 9.7598 3.61789 9.04237 4.77935C8.92623 4.96736 8.721 5.08182 8.5 5.08182C8.27901 5.08182 8.07378 4.96737 7.95763 4.77935C7.2402 3.61793 6.3462 3.10114 5.51529 2.99599C4.67464 2.8896 3.81023 3.19252 3.13196 3.84014C1.78905 5.13427 1.78935 7.3154 3.13285 8.60914L8.5 13.7775L13.8671 8.60914C15.2107 7.3154 15.211 5.13429 13.8681 3.84015C13.1898 3.19252 12.3254 2.88958 11.4847 2.99596ZM11.3246 1.73105C12.5862 1.57141 13.824 2.03457 14.7498 2.91916L14.7515 2.92087C16.6162 4.71642 16.6162 7.732 14.7515 9.52755L8.9422 15.1217C8.69532 15.3594 8.30468 15.3594 8.05781 15.1217L2.24846 9.52755C0.383847 7.732 0.383847 4.71642 2.24846 2.92087L2.25024 2.91915L2.25025 2.91916C3.17605 2.03456 4.41382 1.57143 5.67536 1.73107C6.70379 1.86122 7.69094 2.39739 8.49999 3.35705C9.30905 2.39736 10.2962 1.86119 11.3246 1.73105Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeSpotJobsIllustration = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="160"
    height="160"
    viewBox="0 0 160 160"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M18 84C14 50 42 20 78 18C114 16 144 42 142 80C140 118 112 144 76 140C42 136 22 116 18 84Z"
        fill="#FAF4E8"
      />
      <path
        d="M62 58V50C62 48.4087 62.6321 46.8826 63.7574 45.7574C64.8826 44.6321 66.4087 44 68 44H92C93.5913 44 95.1174 44.6321 96.2426 45.7574C97.3679 46.8826 98 48.4087 98 50V58"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M120 62H48C42.4772 62 38 66.4772 38 72V114C38 119.523 42.4772 124 48 124H120C125.523 124 130 119.523 130 114V72C130 66.4772 125.523 62 120 62Z"
        fill="#1C2A21"
      />
      <path
        d="M116 58H44C38.4772 58 34 62.4772 34 68V110C34 115.523 38.4772 120 44 120H116C121.523 120 126 115.523 126 110V68C126 62.4772 121.523 58 116 58Z"
        fill="#387440"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M34 84H126"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M85 77H75C72.7909 77 71 78.7909 71 81V87C71 89.2091 72.7909 91 75 91H85C87.2091 91 89 89.2091 89 87V81C89 78.7909 87.2091 77 85 77Z"
        fill="#F3C84B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M126 25C127.08 32.92 127.08 32.92 135 34C127.08 35.08 127.08 35.08 126 43C124.92 35.08 124.92 35.08 117 34C124.92 32.92 124.92 32.92 126 25Z"
        fill="#C8951A"
      />
      <path
        d="M32 40C32.72 45.28 32.72 45.28 38 46C32.72 46.72 32.72 46.72 32 52C31.28 46.72 31.28 46.72 26 46C31.28 45.28 31.28 45.28 32 40Z"
        fill="#387440"
      />
      <path
        d="M22 130C26 124.667 30 124.667 34 130C38 135.333 42 135.333 46 130"
        strokeWidth="3"
        strokeLinecap="round"
        stroke="#C8951A"
      />
      <path
        d="M139 124C139 126.761 136.761 129 134 129C131.239 129 129 126.761 129 124C129 121.239 131.239 119 134 119C136.761 119 139 121.239 139 124Z"
        strokeWidth="3"
        stroke="#C8951A"
      />
    </g>
  </svg>
);
export const TalentHomeStarIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M9.08353 2.27094C8.99915 2.22742 8.87563 2.25027 8.81401 2.38073L7.2072 5.78305C6.98594 6.25155 6.55026 6.5907 6.02958 6.66977L2.43663 7.21535C2.3973 7.22133 2.35582 7.24137 2.32071 7.27901C2.22434 7.38232 2.2272 7.55847 2.32484 7.65793L4.92473 10.3063C5.2885 10.6768 5.4479 11.2017 5.36452 11.7098L4.75076 15.4493C4.74066 15.5109 4.75068 15.5732 4.77689 15.6253C4.84083 15.7524 4.96373 15.773 5.04807 15.7266L8.26171 13.9611C8.72281 13.7077 9.27707 13.7077 9.73818 13.9611L12.9518 15.7266C12.9906 15.7479 13.032 15.754 13.071 15.747C13.1278 15.7369 13.1898 15.7004 13.235 15.6377C13.2786 15.5774 13.2935 15.5113 13.2842 15.4513L12.6353 11.7098C12.552 11.2017 12.7114 10.6768 13.0752 10.3063L15.675 7.65793C15.7111 7.62115 15.7385 7.56864 15.7471 7.50678C15.7704 7.33922 15.6575 7.22967 15.5633 7.21535L11.9703 6.66977C11.4496 6.5907 11.0139 6.25155 10.7927 5.78305L9.18587 2.38073C9.16094 2.32794 9.12301 2.2913 9.08353 2.27094ZM7.5933 1.80422C7.96577 1.01555 8.90717 0.661015 9.70233 1.07112C10.0131 1.23139 10.2587 1.49101 10.4066 1.80422L12.0134 5.20654C12.0508 5.28579 12.1152 5.3263 12.173 5.33507L15.7659 5.88066C16.6423 6.01374 17.202 6.84595 17.0842 7.69271C17.0367 8.03477 16.882 8.35555 16.6384 8.60367L14.0385 11.252C13.9841 11.3074 13.9526 11.3959 13.9672 11.489L14.6161 15.2307C14.7607 16.1119 14.1436 16.9263 13.3092 17.0759C12.9633 17.1379 12.6087 17.0784 12.3018 16.9098L9.08814 15.1443C9.03186 15.1133 8.96803 15.1133 8.91175 15.1443L5.69811 16.9098C4.91428 17.3404 3.96339 17.0122 3.57091 16.232C3.41537 15.9229 3.36267 15.5714 3.41859 15.2307L4.03234 11.4912C4.04776 11.3972 4.01616 11.3078 3.96136 11.252L1.36148 8.60367C0.756756 7.98768 0.745244 6.98884 1.33351 6.35817C1.57103 6.10354 1.88677 5.93338 2.23395 5.88066L5.82691 5.33507C5.88468 5.3263 5.94905 5.2858 5.98648 5.20654L7.5933 1.80422Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeStreakDayCheckIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M11.1311 3.64573C11.4131 3.87346 11.457 4.28664 11.2293 4.5686L6.63552 10.2561C6.51591 10.4042 6.33788 10.493 6.14762 10.4996C5.95737 10.5062 5.77364 10.4298 5.6441 10.2903L2.80035 7.22779C2.55373 6.9622 2.56911 6.54697 2.8347 6.30035C3.1003 6.05373 3.51553 6.06911 3.76215 6.3347L6.09045 8.8421L10.2082 3.7439C10.436 3.46195 10.8491 3.41799 11.1311 3.64573Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1C2A21"
      />
    </g>
  </svg>
);
export const TalentHomeStreakFireIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M7.77875 8.90969C7.65406 10.2397 7.56656 12.5934 8.35188 13.5953C8.35188 13.5953 7.98219 11.0097 11.2963 7.76562C12.6306 6.45969 12.9391 4.68344 12.4731 3.35125C12.2084 2.59656 11.725 1.97312 11.305 1.53781C11.06 1.28187 11.2481 0.859687 11.6047 0.875C13.7616 0.97125 17.2572 1.57062 18.7425 5.29812C19.3944 6.93437 19.4425 8.62531 19.1319 10.3447C18.935 11.4428 18.235 13.8841 19.8319 14.1837C20.9716 14.3981 21.5228 13.4925 21.77 12.8406C21.8728 12.5694 22.2294 12.5016 22.4219 12.7181C24.3469 14.9078 24.5109 17.4869 24.1128 19.7072C23.3428 23.9991 18.9962 27.1228 14.6781 27.1228C9.28375 27.1228 4.98969 24.0362 3.87625 18.4494C3.42781 16.1941 3.65531 11.7316 7.13344 8.58156C7.39156 8.34531 7.81375 8.55531 7.77875 8.90969Z"
        fill="url(#paint0_radial_8334_97828)"
      />
      <path
        d="M16.6491 16.9356C14.6606 14.3762 15.5509 11.4559 16.0387 10.2922C16.1044 10.1391 15.9294 9.99469 15.7916 10.0887C14.9362 10.6706 13.1841 12.04 12.3681 13.9672C11.2634 16.5725 11.3422 17.8478 11.9962 19.4053C12.39 20.3437 11.9328 20.5428 11.7031 20.5778C11.48 20.6128 11.2744 20.4641 11.1103 20.3087C10.6384 19.8556 10.3021 19.2799 10.1391 18.6462C10.1041 18.5106 9.92687 18.4734 9.84594 18.585C9.23344 19.4316 8.91625 20.79 8.90094 21.7503C8.85281 24.7187 11.305 27.125 14.2712 27.125C18.0097 27.125 20.7331 22.9906 18.585 19.5344C17.9616 18.5281 17.3753 17.8697 16.6491 16.9356Z"
        fill="url(#paint1_radial_8334_97828)"
      />
    </g>
    <defs>
      <radialGradient
        id="paint0_radial_8334_97828"
        cx="0"
        cy="0"
        r="1"
        gradientTransform="matrix(-15.4409 -0.0670135 -0.110094 25.3354 13.6097 27.1908)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.314" stopColor="#FF9800" />
        <stop offset="0.662" stopColor="#FF6D00" />
        <stop offset="0.972" stopColor="#F44336" />
      </radialGradient>
      <radialGradient
        id="paint1_radial_8334_97828"
        cx="0"
        cy="0"
        r="1"
        gradientTransform="matrix(-0.163184 16.1553 12.158 0.122792 14.4769 11.8253)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.214" stopColor="#FFF176" />
        <stop offset="0.328" stopColor="#FFF27D" />
        <stop offset="0.487" stopColor="#FFF48F" />
        <stop offset="0.672" stopColor="#FFF7AD" />
        <stop offset="0.793" stopColor="#FFF9C4" />
        <stop offset="0.822" stopColor="#FFF8BD" stopOpacity="0.804" />
        <stop offset="0.863" stopColor="#FFF6AB" stopOpacity="0.529" />
        <stop offset="0.91" stopColor="#FFF38D" stopOpacity="0.209" />
        <stop offset="0.941" stopColor="#FFF176" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);
export const TalentHomeUnlockChatIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M8 2.5C4.8346 2.5 2.5 4.63191 2.5 7C2.5 7.83835 2.94759 8.80494 3.66808 9.58907L3.67378 9.59527C4.22307 10.1931 4.642 10.649 4.93787 10.982C5.08625 11.149 5.20964 11.2918 5.30572 11.41C5.39295 11.5174 5.48832 11.6412 5.55335 11.7602C5.56608 11.7835 5.57912 11.8071 5.59181 11.8302C5.61617 11.8744 5.63926 11.9163 5.65645 11.9488C5.68655 12.0057 5.72152 12.0758 5.75135 12.1606C5.78118 12.2453 5.79777 12.3219 5.80993 12.3851C5.81688 12.4212 5.82512 12.4683 5.83381 12.5181C5.83834 12.544 5.84299 12.5706 5.84764 12.5967C5.88016 12.7792 5.88457 12.9754 5.87958 13.1795C6.22019 12.8195 6.57467 12.4555 6.87215 12.174C7.02692 12.0275 7.17901 11.8912 7.31245 11.7873C7.37795 11.7362 7.45495 11.6804 7.5361 11.6337L7.53891 11.632C7.58848 11.6035 7.76786 11.5 8 11.5C11.1654 11.5 13.5 9.36809 13.5 7C13.5 4.63191 11.1654 2.5 8 2.5ZM1 7C1 3.5691 4.26184 1 8 1C11.7382 1 15 3.5691 15 7C15 10.3694 11.854 12.9076 8.20049 12.9975C8.12585 13.0584 8.02599 13.1473 7.90316 13.2635C7.62164 13.5299 7.26885 13.8926 6.91794 14.2646C6.56892 14.6346 6.22951 15.0056 5.97685 15.2846C5.85066 15.424 5.74645 15.5401 5.6739 15.6212L5.59011 15.715L5.56157 15.7471C5.34881 15.9871 5.00664 16.0657 4.71074 15.942C4.41483 15.8183 4.23033 15.5201 4.25166 15.2001L4.32969 14.0296C4.35474 13.6539 4.37214 13.3913 4.37862 13.1919C4.38526 12.9875 4.37797 12.8995 4.3709 12.8598C4.36313 12.8163 4.35734 12.783 4.35262 12.7559C4.34615 12.7188 4.3417 12.6932 4.33694 12.6684C4.33623 12.6648 4.3356 12.6616 4.33504 12.6588C4.33375 12.6563 4.33224 12.6534 4.3305 12.6501C4.31872 12.6279 4.30617 12.6051 4.28798 12.5721C4.27481 12.5483 4.25867 12.519 4.23771 12.4807C4.23892 12.4829 4.23848 12.4823 4.2357 12.4783C4.22789 12.4672 4.2016 12.4298 4.14159 12.356C4.06621 12.2632 3.95985 12.1396 3.81653 11.9783C3.53004 11.6559 3.11967 11.2092 2.56355 10.604C1.67483 9.63675 1 8.32461 1 7ZM16.6053 7.89703C16.9085 7.61484 17.3831 7.63188 17.6653 7.93509C18.4894 8.82061 19 9.96297 19 11.2222C19 12.2361 18.5555 13.2327 17.9475 14.0186C17.3979 14.729 16.9902 15.2561 16.7079 15.6304C16.5666 15.8179 16.4612 15.9612 16.3869 16.067C16.3321 16.1452 16.3062 16.1862 16.297 16.201C16.2924 16.2082 16.2918 16.2091 16.2938 16.2049C16.2656 16.2646 16.2396 16.318 16.2228 16.3523C16.2201 16.358 16.2176 16.3631 16.2153 16.3677C16.2146 16.3727 16.2138 16.3784 16.213 16.3846C16.2076 16.4228 16.1993 16.4824 16.1892 16.5483C16.1721 16.6606 16.1812 16.8744 16.2272 17.5738L16.2684 18.2008C16.2895 18.5217 16.1037 18.8203 15.8065 18.9431C15.5094 19.066 15.167 18.9857 14.9554 18.7436L14.954 18.7421L14.9312 18.7161L14.861 18.6364C14.8002 18.5674 14.7128 18.4687 14.607 18.3502C14.3951 18.1128 14.1105 17.7975 13.8181 17.483C13.5237 17.1666 13.2291 16.8595 12.9951 16.6349C12.9099 16.5532 12.8393 16.4887 12.7839 16.4411C11.7131 16.4081 10.7083 16.1311 9.8451 15.6667C9.48033 15.4705 9.34371 15.0157 9.53996 14.6509C9.7362 14.2861 10.191 14.1495 10.5558 14.3457C11.2554 14.7221 12.0931 14.9444 13 14.9444C13.2301 14.9444 13.4055 15.0473 13.4502 15.0735L13.4535 15.0754C13.5286 15.1193 13.5983 15.1707 13.6553 15.2157C13.7718 15.3078 13.9027 15.427 14.0337 15.5526C14.2407 15.7513 14.4797 15.9971 14.7172 16.2488C14.7202 16.2281 14.7227 16.2103 14.7251 16.1931C14.7278 16.1741 14.7303 16.1559 14.7333 16.1354C14.74 16.0893 14.7513 16.0134 14.7772 15.9285C14.8031 15.8437 14.8361 15.7745 14.8563 15.7325C14.8653 15.7138 14.8734 15.6972 14.8818 15.68C14.897 15.6488 14.9134 15.6154 14.9382 15.5628C14.9927 15.4474 15.0807 15.317 15.1591 15.2053C15.2482 15.0784 15.3658 14.919 15.5102 14.7274C15.7988 14.3446 16.2122 13.8102 16.7571 13.1059L16.761 13.1008C17.2299 12.4947 17.5 11.8124 17.5 11.2222C17.5 10.3837 17.1628 9.59688 16.5673 8.95701C16.2851 8.6538 16.3021 8.17923 16.6053 7.89703Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeUnlockSearchIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M7.5 2.5C4.73858 2.5 2.5 4.73858 2.5 7.5C2.5 10.2614 4.73858 12.5 7.5 12.5C10.2614 12.5 12.5 10.2614 12.5 7.5C12.5 4.73858 10.2614 2.5 7.5 2.5ZM1.25 7.5C1.25 4.04822 4.04822 1.25 7.5 1.25C10.9518 1.25 13.75 4.04822 13.75 7.5C13.75 9.00079 13.221 10.378 12.3393 11.4555L16.0669 15.1831C16.311 15.4271 16.311 15.8229 16.0669 16.0669C15.8229 16.311 15.4271 16.311 15.1831 16.0669L11.4555 12.3393C10.378 13.221 9.00079 13.75 7.5 13.75C4.04822 13.75 1.25 10.9518 1.25 7.5Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const TalentHomeUnlockTargetIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M10 1C10.4142 1 10.75 1.33579 10.75 1.75V3.03971C14.0169 3.38769 16.6123 5.98308 16.9603 9.25H18.25C18.6642 9.25 19 9.58579 19 10C19 10.4142 18.6642 10.75 18.25 10.75H16.9603C16.6123 14.0169 14.0169 16.6123 10.75 16.9603V18.25C10.75 18.6642 10.4142 19 10 19C9.58579 19 9.25 18.6642 9.25 18.25V16.9603C5.98308 16.6123 3.38769 14.0169 3.03971 10.75L1.75 10.75C1.33579 10.75 1 10.4142 1 10C1 9.58578 1.33579 9.25 1.75 9.25L3.03971 9.25C3.38769 5.98308 5.98308 3.38769 9.25 3.03971V1.75C9.25 1.33579 9.58579 1 10 1ZM10 4.5C6.96243 4.5 4.5 6.96243 4.5 10C4.5 13.0376 6.96243 15.5 10 15.5C13.0376 15.5 15.5 13.0376 15.5 10C15.5 6.96243 13.0376 4.5 10 4.5ZM10 8.5C9.17157 8.5 8.5 9.17157 8.5 10C8.5 10.8284 9.17157 11.5 10 11.5C10.8284 11.5 11.5 10.8284 11.5 10C11.5 9.17157 10.8284 8.5 10 8.5ZM7 10C7 8.34315 8.34315 7 10 7C11.6569 7 13 8.34315 13 10C13 11.6569 11.6569 13 10 13C8.34315 13 7 11.6569 7 10Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);

// ---- Talent home · states ----

// HM-04 loading-note spinner (Figma 7733:889, 16px three-quarter arc). Spin it from the caller.
export const SpinnerArcIcon = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 15.6128"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M16 7.61282C16 9.0888 15.5917 10.536 14.8202 11.7943C14.0487 13.0526 12.9442 14.073 11.6288 14.7425C10.3134 15.412 8.83839 15.7045 7.36704 15.5877C5.89568 15.471 4.48532 14.9494 3.29199 14.0808C2.09867 13.2122 1.16891 12.0304 0.605584 10.6661C0.0422601 9.30185 -0.132664 7.80835 0.100165 6.35085C0.332995 4.89335 0.964501 3.52867 1.92481 2.40782C2.88512 1.28696 4.13679 0.453617 5.54134 0L6.15601 1.9032C5.1026 2.24342 4.16384 2.86842 3.44361 3.70907C2.72338 4.54971 2.24975 5.57322 2.07512 6.66634C1.9005 7.75947 2.0317 8.87959 2.45419 9.90278C2.87668 10.926 3.574 11.8123 4.469 12.4638C5.36399 13.1153 6.42176 13.5064 7.52528 13.594C8.62879 13.6816 9.73503 13.4622 10.7216 12.9601C11.7081 12.4579 12.5365 11.6927 13.1151 10.7489C13.6938 9.80521 14 8.7198 14 7.61282H16Z"
      fill="#387440"
    />
  </svg>
);

// ---- Talent home · accessibility panel (A11Y-02, Figma 7752:3735) ----

export const A11yContrastIcon = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8Z"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#387440"
    />
    <path
      d="M8 1.33333V14.6667C9.76811 14.6667 11.4638 13.9643 12.714 12.714C13.9643 11.4638 14.6667 9.76811 14.6667 8C14.6667 6.23189 13.9643 4.5362 12.714 3.28595C11.4638 2.03571 9.76811 1.33333 8 1.33333Z"
      fill="#1C2A21"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#387440"
    />
  </svg>
);

export const A11yTextSizeIcon = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M2.66667 4.66667V2.66667H13.3333V4.66667"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#387440"
    />
    <path
      d="M6 13.3333H10"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#387440"
    />
    <path
      d="M8 2.66667V13.3333"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#387440"
    />
  </svg>
);

export const A11yMotionIcon = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M8.66667 1.33333L2 9.33333H8L7.33333 14.6667L14 6.66667H8L8.66667 1.33333Z"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#387440"
    />
  </svg>
);

export const A11yLinkIcon = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M6.66667 8.66667C6.95297 9.04942 7.31824 9.36612 7.7377 9.59529C8.15716 9.82446 8.621 9.96074 9.09777 9.99489C9.57453 10.029 10.0531 9.96024 10.5009 9.79319C10.9487 9.62613 11.3554 9.36471 11.6933 9.02667L13.6933 7.02667C14.3005 6.39799 14.6365 5.55599 14.6289 4.682C14.6213 3.80801 14.2708 2.97196 13.6527 2.35394C13.0347 1.73591 12.1987 1.38535 11.3247 1.37775C10.4507 1.37016 9.60867 1.70614 8.98 2.31333L7.83333 3.45333"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#387440"
    />
    <path
      d="M9.33333 7.33333C9.04703 6.95058 8.68176 6.63388 8.2623 6.40471C7.84284 6.17554 7.37899 6.03926 6.90223 6.00511C6.42547 5.97097 5.94694 6.03976 5.4991 6.20681C5.05126 6.37387 4.64459 6.63529 4.30667 6.97333L2.30667 8.97333C1.69947 9.60201 1.36349 10.444 1.37109 11.318C1.37868 12.192 1.72924 13.028 2.34727 13.6461C2.9653 14.2641 3.80134 14.6147 4.67533 14.6222C5.54932 14.6298 6.39133 14.2939 7.02 13.6867L8.16 12.5467"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#387440"
    />
  </svg>
);

export const A11yPanelCheckIcon = ({ className = '' }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M9.54094 3.12491C9.78262 3.32011 9.82029 3.67426 9.62509 3.91594L5.68759 8.79094C5.58506 8.91788 5.43247 8.99404 5.26939 8.99966C5.10632 9.00529 4.94883 8.93982 4.8378 8.82025L2.4003 6.19525C2.18891 5.9676 2.2021 5.61169 2.42975 5.4003C2.6574 5.18891 3.01331 5.2021 3.2247 5.42975L5.22038 7.57895L8.74991 3.20906C8.94511 2.96738 9.29926 2.92971 9.54094 3.12491Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#1C2A21"
    />
  </svg>
);

export const A11yPanelSparkleIcon = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M8 1L9.73333 6.26667L15 8L9.73333 9.73333L8 15L6.26667 9.73333L1 8L6.26667 6.26667L8 1Z"
      fill="#FFD86B"
      strokeWidth="0.933333"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
  </svg>
);

// ---- Talent profile · tabs ----

export const ProfileBarGlyph = ({ className = '' }) => {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M7.7625 3.1625C7.7625 2.05103 8.66353 1.15 9.775 1.15H13.225C14.3365 1.15 15.2375 2.05103 15.2375 3.1625V11.5H18.6875C19.799 11.5 20.7 12.401 20.7 13.5125V19.8375C20.7 20.949 19.799 21.85 18.6875 21.85H4.3125C3.20103 21.85 2.3 20.949 2.3 19.8375V8.9125C2.3 7.80103 3.20103 6.9 4.3125 6.9H7.7625V3.1625ZM7.7625 8.625H4.3125C4.15372 8.625 4.025 8.75372 4.025 8.9125V19.8375C4.025 19.9963 4.15372 20.125 4.3125 20.125H7.7625V8.625ZM9.4875 20.125H13.5125V3.1625C13.5125 3.00372 13.3838 2.875 13.225 2.875H9.775C9.61622 2.875 9.4875 3.00372 9.4875 3.1625V20.125ZM15.2375 20.125H18.6875C18.8463 20.125 18.975 19.9963 18.975 19.8375V13.5125C18.975 13.3537 18.8463 13.225 18.6875 13.225H15.2375V20.125Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#1C2A21"
        />
      </g>
    </svg>
  );
};

export const ProfileDnsGlyph = ({ className = '' }) => {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M5.6575 2.875H17.3425C17.9568 2.87499 18.4695 2.87498 18.8884 2.9092C19.3252 2.94489 19.7354 3.02207 20.1232 3.21969C20.7183 3.52289 21.2021 4.00669 21.5053 4.60175C21.7029 4.98961 21.7801 5.39976 21.8158 5.83663C21.85 6.25549 21.85 6.76821 21.85 7.38248V7.85502C21.85 8.46929 21.85 8.98201 21.8158 9.40087C21.7801 9.83774 21.7029 10.2479 21.5053 10.6357C21.3397 10.9608 21.1202 11.2526 20.8581 11.5C21.1202 11.7474 21.3397 12.0392 21.5053 12.3643C21.7029 12.7521 21.7801 13.1623 21.8158 13.5991C21.85 14.018 21.85 14.5307 21.85 15.145V15.6175C21.85 16.2318 21.85 16.7445 21.8158 17.1634C21.7801 17.6002 21.7029 18.0104 21.5053 18.3982C21.2021 18.9933 20.7183 19.4771 20.1232 19.7803C19.7354 19.9779 19.3252 20.0551 18.8884 20.0908C18.4695 20.125 17.9568 20.125 17.3425 20.125H5.65748C5.04321 20.125 4.53049 20.125 4.11163 20.0908C3.67476 20.0551 3.26461 19.9779 2.87675 19.7803C2.28169 19.4771 1.79789 18.9933 1.49469 18.3982C1.29707 18.0104 1.21989 17.6002 1.1842 17.1634C1.14998 16.7445 1.14999 16.2318 1.15 15.6175V15.145C1.14999 14.5307 1.14998 14.018 1.1842 13.5991C1.21989 13.1623 1.29707 12.7521 1.49469 12.3643C1.66031 12.0392 1.87983 11.7474 2.14192 11.5C1.87983 11.2526 1.66031 10.9608 1.49469 10.6357C1.29707 10.2479 1.21989 9.83774 1.1842 9.40087C1.14998 8.982 1.14999 8.46928 1.15 7.855V7.3825C1.14999 6.76822 1.14998 6.2555 1.1842 5.83663C1.21989 5.39976 1.29707 4.98961 1.49469 4.60175C1.79789 4.00669 2.28169 3.52289 2.87675 3.21969C3.26461 3.02207 3.67476 2.94489 4.11163 2.9092C4.5305 2.87498 5.04322 2.87499 5.6575 2.875ZM5.6925 12.3625C5.03421 12.3625 4.59236 12.3632 4.2521 12.391C3.92191 12.4179 3.76403 12.4661 3.65989 12.5192C3.38941 12.657 3.1695 12.8769 3.03168 13.1474C2.97861 13.2515 2.93045 13.4094 2.90347 13.7396C2.87567 14.0799 2.875 14.5217 2.875 15.18V15.5825C2.875 16.2408 2.87567 16.6826 2.90347 17.0229C2.93045 17.3531 2.97861 17.511 3.03168 17.6151C3.1695 17.8856 3.38941 18.1055 3.65989 18.2433C3.76403 18.2964 3.92191 18.3446 4.2521 18.3715C4.59236 18.3993 5.03421 18.4 5.6925 18.4H17.3075C17.9658 18.4 18.4076 18.3993 18.7479 18.3715C19.0781 18.3446 19.236 18.2964 19.3401 18.2433C19.6106 18.1055 19.8305 17.8856 19.9683 17.6151C20.0214 17.511 20.0695 17.3531 20.0965 17.0229C20.1243 16.6826 20.125 16.2408 20.125 15.5825V15.18C20.125 14.5217 20.1243 14.0799 20.0965 13.7396C20.0695 13.4094 20.0214 13.2515 19.9683 13.1474C19.8305 12.8769 19.6106 12.657 19.3401 12.5192C19.236 12.4661 19.0781 12.4179 18.7479 12.391C18.4076 12.3632 17.9658 12.3625 17.3075 12.3625H5.6925ZM17.3075 10.6375C17.9658 10.6375 18.4076 10.6368 18.7479 10.609C19.0781 10.5821 19.236 10.5339 19.3401 10.4808C19.6106 10.343 19.8305 10.1231 19.9683 9.85261C20.0214 9.74847 20.0695 9.59059 20.0965 9.2604C20.1243 8.92014 20.125 8.47829 20.125 7.82V7.4175C20.125 6.75921 20.1243 6.31736 20.0965 5.9771C20.0695 5.64691 20.0214 5.48903 19.9683 5.38489C19.8305 5.11441 19.6106 4.8945 19.3401 4.75668C19.236 4.70361 19.0781 4.65545 18.7479 4.62847C18.4076 4.60067 17.9658 4.6 17.3075 4.6H5.6925C5.03421 4.6 4.59236 4.60067 4.2521 4.62847C3.92191 4.65545 3.76403 4.70361 3.65989 4.75668C3.38941 4.8945 3.1695 5.11441 3.03168 5.38489C2.97861 5.48903 2.93045 5.64691 2.90347 5.9771C2.87567 6.31736 2.875 6.75921 2.875 7.4175V7.82C2.875 8.47829 2.87567 8.92014 2.90347 9.2604C2.93045 9.59059 2.97861 9.74847 3.03168 9.85261C3.1695 10.1231 3.38941 10.343 3.65989 10.4808C3.76403 10.5339 3.92191 10.5821 4.2521 10.609C4.59236 10.6368 5.03421 10.6375 5.6925 10.6375H17.3075ZM4.6 7.75939C4.60032 7.28305 4.98673 6.89715 5.46308 6.89747L8.33808 6.89941C8.81443 6.89973 9.20032 7.28614 9.2 7.76249C9.19968 8.23883 8.81327 8.62473 8.33692 8.62441L5.46192 8.62247C4.98557 8.62215 4.59968 8.23574 4.6 7.75939ZM4.6 15.2369C4.60032 14.7606 4.98673 14.3747 5.46308 14.375L8.33808 14.3769C8.81443 14.3773 9.20032 14.7637 9.2 15.24C9.19968 15.7164 8.81327 16.1023 8.33692 16.1019L5.46192 16.1C4.98557 16.0997 4.59968 15.7133 4.6 15.2369Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#1C2A21"
        />
      </g>
    </svg>
  );
};

export const ProfileFuncGlyph = ({ className = '' }) => {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M10.9048 4.21217C11.0289 3.72603 11.203 3.3811 11.3966 3.16918C11.5698 2.97953 11.7737 2.875 12.075 2.875C12.7101 2.875 13.225 3.38987 13.225 4.025C13.225 4.50135 13.6112 4.8875 14.0875 4.8875C14.5638 4.8875 14.95 4.50135 14.95 4.025C14.95 2.43718 13.6628 1.15 12.075 1.15C11.2648 1.15 10.6062 1.47672 10.1229 2.00582C9.6629 2.50947 9.38881 3.16357 9.22575 3.81581C9.22192 3.83115 9.2185 3.84659 9.21552 3.86212L7.9678 10.3503H5.175C4.69865 10.3503 4.3125 10.7364 4.3125 11.2128C4.3125 11.6891 4.69865 12.0753 5.175 12.0753H7.63606L6.34519 18.7878C6.22108 19.274 6.04698 19.6189 5.85341 19.8308C5.68018 20.0205 5.47628 20.125 5.175 20.125C4.53987 20.125 4.025 19.6101 4.025 18.975C4.025 18.4987 3.63885 18.1125 3.1625 18.1125C2.68615 18.1125 2.3 18.4987 2.3 18.975C2.3 20.5628 3.58718 21.85 5.175 21.85C5.98519 21.85 6.64379 21.5233 7.12707 20.9942C7.5871 20.4905 7.86119 19.8364 8.02425 19.1842C8.02808 19.1688 8.03149 19.1534 8.03448 19.1379L9.39267 12.0753H12.9791C13.0637 12.0753 13.144 12.1125 13.1986 12.1771L15.5452 14.9503L12.8541 18.1307C12.5464 18.4943 12.5917 19.0385 12.9554 19.3462C13.319 19.6539 13.8632 19.6085 14.1709 19.2449L16.675 16.2855L19.1791 19.2449C19.4868 19.6085 20.031 19.6539 20.3946 19.3462C20.7583 19.0385 20.8036 18.4943 20.4959 18.1307L17.8048 14.9503L20.4959 11.7699C20.8036 11.4063 20.7583 10.8621 20.3946 10.5544C20.031 10.2467 19.4868 10.292 19.1791 10.6557L16.675 13.615L14.5154 11.0628C14.1331 10.6109 13.5711 10.3503 12.9791 10.3503H9.7244L10.9048 4.21217Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#1C2A21"
        />
      </g>
    </svg>
  );
};

export const ProfileTableGlyph = ({ className = '' }) => {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M1.15 4.3125C1.15 2.5659 2.5659 1.15 4.3125 1.15H18.6875C20.4341 1.15 21.85 2.5659 21.85 4.3125V18.6875C21.85 20.4341 20.4341 21.85 18.6875 21.85H4.3125C2.5659 21.85 1.15 20.4341 1.15 18.6875V4.3125ZM2.875 8.625V18.6875C2.875 19.4814 3.51859 20.125 4.3125 20.125H6.9V8.625H2.875ZM6.9 6.9H2.875V4.3125C2.875 3.51859 3.51859 2.875 4.3125 2.875H6.9V6.9ZM8.625 8.625V20.125H18.6875C19.4814 20.125 20.125 19.4814 20.125 18.6875V8.625H8.625ZM20.125 6.9H8.625V2.875H18.6875C19.4814 2.875 20.125 3.51859 20.125 4.3125V6.9Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#1C2A21"
        />
      </g>
    </svg>
  );
};

export const ProfileVoiceGlyph = ({ className = '' }) => {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M6.6125 1.15C7.08884 1.15 7.475 1.53615 7.475 2.0125V20.9875C7.475 21.4638 7.08884 21.85 6.6125 21.85C6.13615 21.85 5.75 21.4638 5.75 20.9875V2.0125C5.75 1.53615 6.13615 1.15 6.6125 1.15ZM11.5 4.6C11.9763 4.6 12.3625 4.98615 12.3625 5.4625V17.5375C12.3625 18.0138 11.9763 18.4 11.5 18.4C11.0237 18.4 10.6375 18.0138 10.6375 17.5375V5.4625C10.6375 4.98615 11.0237 4.6 11.5 4.6ZM20.9875 5.75C21.4638 5.75 21.85 6.13615 21.85 6.6125V16.3875C21.85 16.8638 21.4638 17.25 20.9875 17.25C20.5112 17.25 20.125 16.8638 20.125 16.3875V6.6125C20.125 6.13615 20.5112 5.75 20.9875 5.75ZM2.0125 8.05C2.48884 8.05 2.875 8.43615 2.875 8.9125V14.0875C2.875 14.5638 2.48884 14.95 2.0125 14.95C1.53615 14.95 1.15 14.5638 1.15 14.0875V8.9125C1.15 8.43615 1.53615 8.05 2.0125 8.05ZM16.3875 9.2C16.8638 9.2 17.25 9.58615 17.25 10.0625V12.9375C17.25 13.4138 16.8638 13.8 16.3875 13.8C15.9112 13.8 15.525 13.4138 15.525 12.9375V10.0625C15.525 9.58615 15.9112 9.2 16.3875 9.2Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#1C2A21"
        />
      </g>
    </svg>
  );
};

export const ProfileTrendGlyph = ({ className = '' }) => {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M13.8 5.4625C13.8 4.98615 14.1862 4.6 14.6625 4.6H20.9875C21.4638 4.6 21.85 4.98615 21.85 5.4625V11.7875C21.85 12.2638 21.4638 12.65 20.9875 12.65C20.5112 12.65 20.125 12.2638 20.125 11.7875V7.54476L12.9724 14.6974C12.6689 15.0009 12.1884 15.035 11.845 14.7775L7.90052 11.8191L2.67509 18.0897C2.37014 18.4556 1.82628 18.505 1.46034 18.2001C1.0944 17.8951 1.04496 17.3513 1.34991 16.9853L7.09991 10.0853C7.39387 9.73259 7.91266 9.67199 8.28 9.9475L12.2816 12.9487L18.9052 6.325H14.6625C14.1862 6.325 13.8 5.93885 13.8 5.4625Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#1C2A21"
        />
      </g>
    </svg>
  );
};

export const ProfileGradGlyph = ({ className = '' }) => {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M1.91542 7.02724C1.91542 8.3133 9.67433 11.8196 11.4869 11.8196C13.2996 11.8196 21.0585 8.3133 21.0585 7.02724C21.0585 5.74117 13.2996 2.23486 11.4869 2.23486C9.67433 2.23486 1.91542 5.74117 1.91542 7.02724Z"
          strokeWidth="1.27778"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#1C2A21"
        />
        <path
          d="M5.74251 9.90278L6.94167 15.4613C7.02381 15.842 7.2134 16.1978 7.52958 16.4246C9.65875 17.9526 13.312 17.9526 15.4412 16.4246C15.7575 16.1978 15.947 15.842 16.0292 15.4613L17.2283 9.90278"
          strokeWidth="1.27778"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#1C2A21"
        />
        <path
          d="M19.6248 8.46465V15.174M19.6248 15.174C18.8668 16.5603 18.5315 17.303 18.191 18.5287C18.1171 18.9648 18.1758 19.1846 18.4759 19.3797C18.5979 19.4589 18.7445 19.4871 18.8898 19.4871H20.3451C20.4998 19.4871 20.6559 19.4548 20.7833 19.3668C21.0623 19.1742 21.1341 18.9628 21.0585 18.5287C20.76 17.3906 20.3799 16.6125 19.6248 15.174Z"
          strokeWidth="1.27778"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#1C2A21"
        />
      </g>
    </svg>
  );
};

export const ProfileLaptopGlyph = ({ className = '' }) => {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M6.8075 2.3H16.1925C16.8068 2.29999 17.3195 2.29998 17.7384 2.3342C18.1752 2.36989 18.5854 2.44707 18.9732 2.64469C19.5683 2.94789 20.0521 3.43169 20.3553 4.02676C20.5529 4.41461 20.6301 4.82476 20.6658 5.26163C20.7 5.68049 20.7 6.19321 20.7 6.80748V14.95H20.9875C21.4638 14.95 21.85 15.3362 21.85 15.8125V16.1925C21.85 16.8068 21.85 17.3195 21.8158 17.7384C21.7801 18.1752 21.7029 18.5854 21.5053 18.9732C21.2021 19.5683 20.7183 20.0521 20.1232 20.3553C19.7354 20.5529 19.3252 20.6301 18.8884 20.6658C18.4695 20.7 17.9568 20.7 17.3425 20.7H5.65748C5.04321 20.7 4.53049 20.7 4.11163 20.6658C3.67476 20.6301 3.26461 20.5529 2.87675 20.3553C2.28169 20.0521 1.79789 19.5683 1.49469 18.9732C1.29707 18.5854 1.21989 18.1752 1.1842 17.7384C1.14998 17.3195 1.14999 16.8068 1.15 16.1925L1.15 15.8125C1.15 15.3362 1.53615 14.95 2.0125 14.95H2.3L2.3 6.8075C2.29999 6.19322 2.29998 5.6805 2.3342 5.26163C2.36989 4.82476 2.44707 4.41461 2.64469 4.02676C2.94789 3.43169 3.43169 2.94789 4.02676 2.64469C4.41461 2.44707 4.82476 2.36989 5.26163 2.3342C5.6805 2.29998 6.19322 2.29999 6.8075 2.3ZM2.8758 16.675C2.87764 17.0618 2.88367 17.3556 2.90347 17.5979C2.93045 17.9281 2.97861 18.086 3.03168 18.1901C3.1695 18.4606 3.38941 18.6805 3.65989 18.8183C3.76403 18.8714 3.92191 18.9195 4.2521 18.9465C4.59236 18.9743 5.03421 18.975 5.6925 18.975H17.3075C17.9658 18.975 18.4076 18.9743 18.7479 18.9465C19.0781 18.9195 19.236 18.8714 19.3401 18.8183C19.6106 18.6805 19.8305 18.4606 19.9683 18.1901C20.0214 18.086 20.0695 17.9281 20.0965 17.5979C20.1163 17.3556 20.1224 17.0618 20.1242 16.675H16.2741C15.9149 16.675 15.5794 16.8545 15.3801 17.1534C14.8609 17.9322 13.9869 18.4 13.0509 18.4H9.9491C9.01311 18.4 8.13905 17.9322 7.61986 17.1534C7.42059 16.8545 7.08513 16.675 6.7259 16.675H2.8758ZM18.975 14.95H16.2741C15.3381 14.95 14.464 15.4178 13.9449 16.1966C13.7456 16.4955 13.4101 16.675 13.0509 16.675H9.9491C9.58987 16.675 9.25441 16.4955 9.05514 16.1966C8.53595 15.4178 7.66189 14.95 6.7259 14.95H4.025V6.8425C4.025 6.18421 4.02567 5.74236 4.05347 5.4021C4.08045 5.07191 4.12861 4.91403 4.18168 4.80989C4.3195 4.53941 4.53941 4.3195 4.80989 4.18168C4.91403 4.12861 5.07191 4.08045 5.4021 4.05347C5.74236 4.02567 6.18421 4.025 6.8425 4.025H16.1575C16.8158 4.025 17.2576 4.02567 17.5979 4.05347C17.9281 4.08045 18.086 4.12861 18.1901 4.18168C18.4606 4.3195 18.6805 4.53941 18.8183 4.80989C18.8714 4.91403 18.9196 5.07191 18.9465 5.4021C18.9743 5.74236 18.975 6.18421 18.975 6.8425V14.95Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#1C2A21"
        />
      </g>
    </svg>
  );
};

export const ProfileBldgGlyph = ({ className = '' }) => {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M1.91667 21.0833H21.0833"
          strokeWidth="1.15"
          strokeLinecap="round"
          stroke="#1C2A21"
        />
        <path
          d="M17.25 8.625H13.4167C11.0381 8.625 10.5417 9.12142 10.5417 11.5V21.0833H20.125V11.5C20.125 9.12142 19.6286 8.625 17.25 8.625Z"
          strokeWidth="1.15"
          strokeLinejoin="round"
          stroke="#1C2A21"
        />
        <path
          d="M14.375 21.0833H2.875V4.79167C2.875 2.41308 3.37142 1.91667 5.75 1.91667H11.5C13.8786 1.91667 14.375 2.41308 14.375 4.79167V8.625"
          strokeWidth="1.15"
          strokeLinejoin="round"
          stroke="#1C2A21"
        />
        <path
          d="M2.875 5.75H5.75M2.875 9.58333H5.75M2.875 13.4167H5.75"
          strokeWidth="1.15"
          strokeLinecap="round"
          stroke="#1C2A21"
        />
        <path
          d="M14.375 12.4583H16.2917M14.375 15.3333H16.2917"
          strokeWidth="1.15"
          strokeLinecap="round"
          stroke="#1C2A21"
        />
        <path
          d="M15.3333 21.0833V18.2083"
          strokeWidth="1.15"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#1C2A21"
        />
      </g>
    </svg>
  );
};

export const ProfileCompanyGlyph = ({ className = '' }) => {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M6.12235 1.15H12.2777C12.5738 1.14998 12.8457 1.14996 13.0731 1.16853C13.3182 1.18856 13.5863 1.2344 13.8512 1.36935C14.2298 1.56229 14.5377 1.87017 14.7307 2.24884C14.8656 2.5137 14.9114 2.78184 14.9315 3.02695C14.95 3.25428 14.95 3.52623 14.95 3.82233L14.95 8.05L16.8776 8.05C17.1738 8.04998 17.4457 8.04996 17.6731 8.06853C17.9182 8.08856 18.1863 8.1344 18.4512 8.26935C18.8298 8.46229 19.1377 8.77017 19.3307 9.14884C19.4656 9.4137 19.5114 9.68184 19.5315 9.92695C19.55 10.1543 19.55 10.4262 19.55 10.7223L19.55 20.125H20.9875C21.4638 20.125 21.85 20.5112 21.85 20.9875C21.85 21.4638 21.4638 21.85 20.9875 21.85H2.0125C1.53615 21.85 1.15 21.4638 1.15 20.9875C1.15 20.5112 1.53615 20.125 2.0125 20.125H3.45V3.8525C3.45 3.84242 3.45 3.83237 3.45 3.82235C3.44998 3.52624 3.44996 3.25429 3.46853 3.02695C3.48856 2.78184 3.5344 2.5137 3.66935 2.24884C3.86229 1.87017 4.17017 1.56229 4.54884 1.36935C4.8137 1.2344 5.08184 1.18856 5.32695 1.16853C5.55429 1.14996 5.82624 1.14998 6.12235 1.15ZM5.175 20.125H13.225V3.8525C13.225 3.51624 13.2243 3.31591 13.2122 3.16742C13.2048 3.07679 13.195 3.03869 13.1919 3.02848C13.1648 2.97715 13.1229 2.93519 13.0715 2.90815C13.0613 2.90498 13.0232 2.89521 12.9326 2.8878C12.7841 2.87567 12.5838 2.875 12.2475 2.875H6.1525C5.81624 2.875 5.61591 2.87567 5.46742 2.8878C5.37679 2.89521 5.33869 2.90498 5.32848 2.90815C5.27715 2.9352 5.2352 2.97715 5.20815 3.02848C5.20498 3.03869 5.19521 3.07679 5.1878 3.16742C5.17567 3.31591 5.175 3.51624 5.175 3.8525V20.125ZM5.20919 3.02551C5.2092 3.02554 5.209 3.02615 5.20854 3.02725ZM5.32551 2.90919C5.32547 2.90917 5.32602 2.90895 5.32725 2.90854ZM13.0745 2.90919C13.0745 2.9092 13.0739 2.909 13.0728 2.90855ZM13.1908 3.02551C13.1908 3.02547 13.191 3.02601 13.1914 3.02721ZM14.95 9.775V20.125H17.825V10.7525C17.825 10.4162 17.8243 10.2159 17.8122 10.0674C17.8048 9.97679 17.795 9.93869 17.7919 9.92848C17.7648 9.87715 17.7229 9.83519 17.6715 9.80815C17.6613 9.80498 17.6232 9.79521 17.5326 9.7878C17.3841 9.77567 17.1838 9.775 16.8475 9.775H14.95ZM17.6745 9.80919C17.6745 9.8092 17.6739 9.809 17.6728 9.80854ZM17.7908 9.92551C17.7908 9.92546 17.791 9.926 17.7915 9.92725ZM6.9 6.6125C6.9 6.13615 7.28615 5.75 7.7625 5.75H10.6375C11.1138 5.75 11.5 6.13615 11.5 6.6125C11.5 7.08885 11.1138 7.475 10.6375 7.475H7.7625C7.28615 7.475 6.9 7.08885 6.9 6.6125ZM6.9 11.5C6.9 11.0237 7.28615 10.6375 7.7625 10.6375H10.6375C11.1138 10.6375 11.5 11.0237 11.5 11.5C11.5 11.9763 11.1138 12.3625 10.6375 12.3625H7.7625C7.28615 12.3625 6.9 11.9763 6.9 11.5ZM6.9 16.3875C6.9 15.9112 7.28615 15.525 7.7625 15.525H10.6375C11.1138 15.525 11.5 15.9112 11.5 16.3875C11.5 16.8638 11.1138 17.25 10.6375 17.25H7.7625C7.28615 17.25 6.9 16.8638 6.9 16.3875Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#1C2A21"
        />
      </g>
    </svg>
  );
};

export const ProfileCheckCircleGlyph = ({ className = '' }) => {
  const uid = useId();
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g clipPath={`url(#${uid}clip0_8654_87084)`}>
        <path
          d="M7.5 0.75C3.77208 0.75 0.75 3.77208 0.75 7.5C0.75 11.2279 3.77208 14.25 7.5 14.25C11.2279 14.25 14.25 11.2279 14.25 7.5C14.25 3.77208 11.2279 0.75 7.5 0.75ZM10.3826 5.78144C10.5726 5.53562 10.5273 5.18235 10.2814 4.9924C10.0356 4.80245 9.68236 4.84774 9.4924 5.09356L6.71711 8.68511L5.4806 7.31121C5.27278 7.08029 4.91712 7.06157 4.68621 7.2694C4.4553 7.47722 4.43658 7.83288 4.6444 8.06379L6.3319 9.93879C6.44349 10.0628 6.60437 10.1309 6.77107 10.1246C6.93777 10.1184 7.0931 10.0384 7.1951 9.90644L10.3826 5.78144Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#1C2A21"
        />
      </g>
      <defs>
        <clipPath id={`${uid}clip0_8654_87084`}>
          <rect width="15" height="15" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const ProfileBadgeCheckCircleGlyph = ({ className = '' }) => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M12.5 1.25C6.2868 1.25 1.25 6.2868 1.25 12.5C1.25 18.7132 6.2868 23.75 12.5 23.75C18.7132 23.75 23.75 18.7132 23.75 12.5C23.75 6.2868 18.7132 1.25 12.5 1.25ZM17.3043 9.63573C17.6209 9.22603 17.5454 8.63726 17.1357 8.32067C16.726 8.00408 16.1373 8.07957 15.8207 8.48927L11.1952 14.4752L9.13434 12.1853C8.78797 11.8005 8.1952 11.7693 7.81035 12.1157C7.42549 12.462 7.39429 13.0548 7.74066 13.4397L10.5532 16.5647C10.7392 16.7713 11.0073 16.8848 11.2851 16.8743C11.5629 16.8639 11.8218 16.7307 11.9918 16.5107L17.3043 9.63573Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#1C2A21"
        />
      </g>
    </svg>
  );
};

export const ProfilePlusGlyph = ({ className = '' }) => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M8.5 3.40042C8.85208 3.40042 9.1375 3.68583 9.1375 4.03792V7.86302H12.9625C13.3146 7.86302 13.6 8.14844 13.6 8.50052C13.6 8.8526 13.3146 9.13802 12.9625 9.13802H9.1375V12.9629C9.1375 13.315 8.85208 13.6004 8.5 13.6004C8.14792 13.6004 7.8625 13.315 7.8625 12.9629V9.13802H4.0375C3.68542 9.13802 3.4 8.8526 3.4 8.50052C3.4 8.14844 3.68542 7.86302 4.0375 7.86302H7.8625V4.03792C7.8625 3.68583 8.14792 3.40042 8.5 3.40042Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#1C2A21"
        />
      </g>
    </svg>
  );
};

export const ProfileHourglassGlyph = ({ className = '' }) => {
  return (
    <svg
      width="29"
      height="29"
      viewBox="0 0 29 29"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M4.35 2.5375C4.35 1.93689 4.83689 1.45 5.4375 1.45H23.5625C24.1631 1.45 24.65 1.93689 24.65 2.5375C24.65 3.13811 24.1631 3.625 23.5625 3.625H21.75V6.11736C21.75 6.81129 21.5689 7.49321 21.2246 8.09572L18.0789 13.6007C17.7605 14.158 17.7605 14.842 18.0789 15.3993L21.2246 20.9043C21.5689 21.5068 21.75 22.1887 21.75 22.8826V25.375H23.5625C24.1631 25.375 24.65 25.8619 24.65 26.4625C24.65 27.0631 24.1631 27.55 23.5625 27.55H5.4375C4.83689 27.55 4.35 27.0631 4.35 26.4625C4.35 25.8619 4.83689 25.375 5.4375 25.375H7.25V22.8826C7.25 22.1887 7.43109 21.5068 7.77538 20.9043L10.9211 15.3993C11.2395 14.842 11.2395 14.158 10.9211 13.6007L7.77538 8.09572C7.43109 7.49321 7.25 6.8113 7.25 6.11736V3.625H5.4375C4.83689 3.625 4.35 3.13811 4.35 2.5375ZM9.425 3.625V6.11736C9.425 6.43279 9.50731 6.74275 9.66381 7.01661L12.8095 12.5216C13.51 13.7475 13.51 15.2525 12.8095 16.4784L9.66381 21.9834C9.50731 22.2572 9.425 22.5672 9.425 22.8826V25.375H19.575V22.8826C19.575 22.5672 19.4927 22.2572 19.3362 21.9834L16.1905 16.4784C15.49 15.2525 15.49 13.7475 16.1905 12.5216L19.3362 7.01661C19.4927 6.74275 19.575 6.43279 19.575 6.11736V3.625H9.425Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#1C2A21"
        />
      </g>
    </svg>
  );
};

export const ProfileGameGlyph = ({ className = '' }) => {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M1.58333 10.9514C1.58333 8.34878 1.58333 7.04751 2.30214 6.17165C2.43373 6.0113 2.58075 5.86428 2.74109 5.73269C3.61695 5.01389 4.91825 5.01389 7.52083 5.01389H11.4792C14.0818 5.01389 15.383 5.01389 16.2589 5.73269C16.4192 5.86428 16.5663 6.0113 16.6978 6.17165C17.4167 7.04751 17.4167 8.34878 17.4167 10.9514C17.4167 13.554 17.4167 14.8553 16.6978 15.7312C16.5663 15.8915 16.4192 16.0385 16.2589 16.1701C15.383 16.8889 14.0818 16.8889 11.4792 16.8889H7.52083C4.91825 16.8889 3.61695 16.8889 2.74109 16.1701C2.58075 16.0385 2.43373 15.8915 2.30214 15.7312C1.58333 14.8553 1.58333 13.554 1.58333 10.9514Z"
          strokeWidth="1.05556"
          strokeLinecap="round"
          stroke="#1C2A21"
        />
        <path
          d="M9.5 5.01389V3.43056C9.5 2.99333 9.85443 2.63889 10.2917 2.63889C10.7289 2.63889 11.0833 2.28444 11.0833 1.84722V1.05556"
          strokeWidth="1.05556"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#1C2A21"
        />
        <path
          d="M7.91667 12.1389L6.72917 10.9514M6.72917 10.9514L5.54167 9.76389M6.72917 10.9514L5.54167 12.1389M6.72917 10.9514L7.91667 9.76389"
          strokeWidth="1.05556"
          strokeLinecap="round"
          stroke="#1C2A21"
        />
        <path
          d="M13.4583 11.7431V10.1597"
          strokeWidth="1.05556"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#1C2A21"
        />
      </g>
    </svg>
  );
};

export const ProfileBookGlyph = ({ className = '' }) => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M6.25635 3.07667C5.42011 2.94073 4.56738 2.94073 3.73115 3.07666C3.4394 3.12409 3.1463 3.19464 2.49649 3.35205C2.39239 3.37727 2.33192 3.39203 2.28668 3.40488C2.25827 3.41295 2.2464 3.41742 2.24348 3.41859C2.24348 3.41859 2.24348 3.41859 2.24348 3.41859C2.18566 3.44702 2.14405 3.50001 2.13009 3.56249C2.12964 3.56561 2.1281 3.57817 2.12695 3.60748C2.12511 3.6544 2.125 3.71658 2.125 3.82362V13.4466C2.125 13.522 2.12504 13.5681 2.1258 13.6027C2.12629 13.6249 2.12698 13.6347 2.12716 13.6371C2.14321 13.7486 2.24438 13.8287 2.35772 13.8179C2.36002 13.8175 2.36974 13.8158 2.39159 13.8111C2.42548 13.8036 2.47039 13.7928 2.54365 13.775L2.55687 13.7718C2.8399 13.7033 2.99783 13.665 3.156 13.6326C4.36852 13.3838 5.61898 13.3838 6.8315 13.6326C6.98964 13.665 7.14754 13.7033 7.43048 13.7718L7.8625 13.8765V3.44207L7.491 3.35207C6.84119 3.19466 6.5481 3.1241 6.25635 3.07667ZM9.1375 3.44207V13.8765L9.56938 13.7718C9.85241 13.7033 10.0103 13.665 10.1685 13.6326C11.381 13.3838 12.6315 13.3838 13.844 13.6326C14.0022 13.665 14.1601 13.7033 14.4431 13.7718L14.4563 13.775C14.5296 13.7928 14.5745 13.8036 14.6084 13.8111C14.6417 13.8183 14.6468 13.8183 14.6405 13.8177C14.7546 13.8295 14.8567 13.7492 14.8728 13.6371C14.873 13.6347 14.8737 13.6249 14.8742 13.6027C14.875 13.5681 14.875 13.522 14.875 13.4466V3.82366C14.875 3.71662 14.8749 3.65444 14.8731 3.60751C14.8719 3.57819 14.8704 3.56564 14.8699 3.56252C14.8559 3.50004 14.8143 3.44706 14.7565 3.41862C14.7536 3.41745 14.7417 3.41298 14.7133 3.40491C14.6681 3.39206 14.6076 3.3773 14.5035 3.35208C13.8537 3.19467 13.5606 3.12411 13.2688 3.07668C12.4326 2.94076 11.5799 2.94076 10.7437 3.07668C10.4519 3.12411 10.1588 3.19467 9.509 3.35208L9.1375 3.44207ZM3.52657 1.81818C4.49831 1.66022 5.4892 1.66023 6.46093 1.81819C6.80649 1.87437 7.14885 1.95731 7.76232 2.10592L8.33134 2.24376C8.39348 2.25882 8.42777 2.26707 8.45403 2.27266C8.47672 2.27749 8.48125 2.27764 8.47935 2.27745C8.49309 2.27879 8.50692 2.27879 8.52066 2.27745C8.51876 2.27764 8.52329 2.27749 8.54598 2.27266C8.57224 2.26707 8.60652 2.25882 8.66867 2.24376L9.2377 2.10593C9.85119 1.95731 10.1936 1.87437 10.5391 1.8182C11.5108 1.66025 12.5017 1.66025 13.4734 1.8182C13.8189 1.87437 14.1613 1.95731 14.7748 2.10593L14.8037 2.11292C14.817 2.11616 14.8305 2.11939 14.844 2.12265C15.0009 2.16037 15.166 2.2001 15.3126 2.27125C15.7225 2.47036 16.0187 2.84647 16.1159 3.2919C16.1506 3.4511 16.1503 3.62101 16.15 3.78217C16.15 3.79607 16.15 3.80991 16.15 3.82366V13.4466C16.15 13.4568 16.15 13.4671 16.15 13.4774C16.1501 13.59 16.1503 13.7051 16.1366 13.8061C16.0289 14.6026 15.3077 15.1688 14.5088 15.0859C14.4075 15.0753 14.2956 15.0481 14.1861 15.0215C14.1761 15.019 14.1661 15.0166 14.1562 15.0142C13.8565 14.9416 13.7213 14.9089 13.5878 14.8816C12.5443 14.6675 11.4682 14.6675 10.4247 14.8816C10.2912 14.9089 10.156 14.9416 9.85632 15.0142L8.96883 15.2292C8.96122 15.231 8.95356 15.2329 8.94586 15.2348C8.85131 15.2578 8.75009 15.2824 8.64418 15.2927C8.54829 15.302 8.45171 15.302 8.35582 15.2927C8.24991 15.2824 8.14869 15.2578 8.05414 15.2348C8.04644 15.2329 8.03878 15.231 8.03117 15.2292L7.14368 15.0142C6.84395 14.9416 6.70877 14.9089 6.57525 14.8816C5.5318 14.6675 4.4557 14.6675 3.41225 14.8816C3.27873 14.9089 3.14355 14.9416 2.84382 15.0142C2.83387 15.0166 2.8239 15.019 2.8139 15.0215C2.70437 15.0481 2.59253 15.0753 2.49118 15.0859C1.69226 15.1688 0.971108 14.6026 0.863404 13.8061C0.849746 13.7051 0.849863 13.59 0.849979 13.4774C0.849989 13.4671 0.85 13.4568 0.85 13.4466V3.82362C0.85 3.80986 0.849977 3.79602 0.849955 3.78212C0.849692 3.62098 0.849415 3.45107 0.88413 3.29189C0.981274 2.84644 1.27745 2.47032 1.68746 2.27121C1.83398 2.20006 1.99915 2.16033 2.15598 2.12261C2.16949 2.11936 2.18295 2.11613 2.19632 2.11289L2.22517 2.1059C2.83865 1.95729 3.18101 1.87435 3.52657 1.81818Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#1C2A21"
        />
      </g>
    </svg>
  );
};

export const ProfileLockGlyph = ({ className = '' }) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M4.2 3.5C4.2 1.9536 5.4536 0.7 7 0.7C8.5464 0.7 9.8 1.9536 9.8 3.5V5.6H10.675C11.7381 5.6 12.6 6.46185 12.6 7.525V11.375C12.6 12.4381 11.7381 13.3 10.675 13.3H3.325C2.26185 13.3 1.4 12.4381 1.4 11.375V7.525C1.4 6.46185 2.26185 5.6 3.325 5.6H4.2V3.5ZM5.25 5.6H8.75V3.5C8.75 2.5335 7.9665 1.75 7 1.75C6.0335 1.75 5.25 2.5335 5.25 3.5V5.6ZM3.325 6.65C2.84175 6.65 2.45 7.04175 2.45 7.525V11.375C2.45 11.8582 2.84175 12.25 3.325 12.25H10.675C11.1582 12.25 11.55 11.8582 11.55 11.375V7.525C11.55 7.04175 11.1582 6.65 10.675 6.65H3.325ZM7 8.4C7.28995 8.4 7.525 8.63505 7.525 8.925V9.975C7.525 10.2649 7.28995 10.5 7 10.5C6.71005 10.5 6.475 10.2649 6.475 9.975V8.925C6.475 8.63505 6.71005 8.4 7 8.4Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#1C2A21"
        />
      </g>
    </svg>
  );
};

export const ProfileTargetGlyph = ({ className = '' }) => {
  const uid = useId();
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g clipPath={`url(#${uid}clip0_8654_86599)`}>
        <path
          d="M9 0.9C9.37279 0.9 9.675 1.20221 9.675 1.575V2.73574C12.6152 3.04892 14.9511 5.38477 15.2643 8.325H16.425C16.7978 8.325 17.1 8.62721 17.1 9C17.1 9.37279 16.7978 9.675 16.425 9.675H15.2643C14.9511 12.6152 12.6152 14.9511 9.675 15.2643V16.425C9.675 16.7978 9.37279 17.1 9 17.1C8.62721 17.1 8.325 16.7978 8.325 16.425V15.2643C5.38477 14.9511 3.04892 12.6152 2.73574 9.675L1.575 9.675C1.20221 9.675 0.9 9.37279 0.9 9C0.9 8.62721 1.20221 8.325 1.575 8.325L2.73574 8.325C3.04892 5.38477 5.38477 3.04892 8.325 2.73574V1.575C8.325 1.20221 8.62721 0.9 9 0.9ZM9 4.05C6.26619 4.05 4.05 6.26619 4.05 9C4.05 11.7338 6.26619 13.95 9 13.95C11.7338 13.95 13.95 11.7338 13.95 9C13.95 6.26619 11.7338 4.05 9 4.05ZM9 7.65C8.25441 7.65 7.65 8.25441 7.65 9C7.65 9.74558 8.25441 10.35 9 10.35C9.74558 10.35 10.35 9.74558 10.35 9C10.35 8.25441 9.74558 7.65 9 7.65ZM6.3 9C6.3 7.50883 7.50883 6.3 9 6.3C10.4912 6.3 11.7 7.50883 11.7 9C11.7 10.4912 10.4912 11.7 9 11.7C7.50883 11.7 6.3 10.4912 6.3 9Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#1C2A21"
        />
      </g>
      <defs>
        <clipPath id={`${uid}clip0_8654_86599`}>
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const ProfileBulbGlyph = ({ className = '' }) => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M3.64286 9.91667C3.12896 9.07247 2.83333 8.08336 2.83333 7.02586C2.83333 3.92798 5.37039 1.41667 8.5 1.41667C11.6296 1.41667 14.1667 3.92798 14.1667 7.02586C14.1667 8.08336 13.8711 9.07247 13.3571 9.91667"
          strokeWidth="0.796875"
          strokeLinecap="round"
          stroke="#1C2A21"
        />
        <path
          d="M9.91667 7.08333C9.48281 7.53893 9.0037 7.79167 8.5 7.79167C7.9963 7.79167 7.51719 7.53893 7.08333 7.08333"
          strokeWidth="0.796875"
          strokeLinecap="round"
          stroke="#1C2A21"
        />
        <path
          d="M5.22953 12.1112C5.16446 11.9153 5.13192 11.8173 5.13571 11.738C5.14373 11.5701 5.24956 11.4227 5.4057 11.362C5.47952 11.3333 5.58241 11.3333 5.7882 11.3333H11.2118C11.4176 11.3333 11.5205 11.3333 11.5943 11.362C11.7505 11.4227 11.8563 11.5701 11.8643 11.738C11.8681 11.8173 11.8355 11.9153 11.7704 12.1112C11.6502 12.4733 11.59 12.6544 11.4973 12.801C11.303 13.1081 10.9984 13.3285 10.6467 13.4164C10.4787 13.4583 10.2885 13.4583 9.90824 13.4583H7.09176C6.71142 13.4583 6.52127 13.4583 6.35335 13.4164C6.00159 13.3285 5.69699 13.1081 5.50269 12.801C5.40993 12.6544 5.3498 12.4733 5.22953 12.1112Z"
          strokeWidth="0.796875"
          stroke="#1C2A21"
        />
        <path
          d="M10.625 13.4583L10.5334 13.9163C10.4333 14.4172 10.3832 14.6676 10.2709 14.8655C10.0974 15.1714 9.81622 15.4019 9.48217 15.5121C9.26613 15.5833 9.01078 15.5833 8.50001 15.5833H8.5H8.49999C7.98922 15.5833 7.73387 15.5833 7.51783 15.5121C7.18378 15.4019 6.9026 15.1714 6.72907 14.8655C6.61685 14.6676 6.56677 14.4172 6.4666 13.9163L6.375 13.4583"
          strokeWidth="0.796875"
          stroke="#1C2A21"
        />
        <path
          d="M8.5 10.9792V7.79167"
          strokeWidth="0.796875"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#1C2A21"
        />
      </g>
    </svg>
  );
};

export const ProfileChipAnalyticalIcon = ({ className = '' }) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M2.8 4.9C2.8 2.5804 4.6804 0.7 7 0.7C9.3196 0.7 11.2 2.5804 11.2 4.9V5.24497C11.2 6.62628 10.5097 7.9162 9.36034 8.68241C9.19769 8.79084 9.1 8.97338 9.1 9.16886V10.2774C9.1 10.7869 8.68693 11.2 8.17738 11.2H5.82262C5.31307 11.2 4.9 10.7869 4.9 10.2774V9.16886C4.9 8.97338 4.80231 8.79084 4.63966 8.68241C3.49034 7.9162 2.8 6.62628 2.8 5.24497V4.9ZM7 1.75C5.2603 1.75 3.85 3.1603 3.85 4.9V5.24497C3.85 6.27521 4.36489 7.23729 5.2221 7.80876C5.67685 8.11193 5.95 8.62231 5.95 9.16886V10.15H8.05V9.16886C8.05 8.62231 8.32315 8.11193 8.7779 7.80876C9.63511 7.23729 10.15 6.27521 10.15 5.24497V4.9C10.15 3.1603 8.7397 1.75 7 1.75ZM5.6 12.775C5.6 12.4851 5.83505 12.25 6.125 12.25H7.875C8.16495 12.25 8.4 12.4851 8.4 12.775C8.4 13.065 8.16495 13.3 7.875 13.3H6.125C5.83505 13.3 5.6 13.065 5.6 12.775Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#387440"
        />
      </g>
    </svg>
  );
};

export const ProfileChipCalmIcon = ({ className = '' }) => {
  const uid = useId();
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g clipPath={`url(#${uid}clip0_8654_89009)`}>
        <path
          d="M4.9 1.925C4.9 1.24845 5.44845 0.7 6.125 0.7H7.875C8.55155 0.7 9.1 1.24845 9.1 1.925V4.9H12.075C12.7515 4.9 13.3 5.44845 13.3 6.125V7.875C13.3 8.55155 12.7515 9.1 12.075 9.1H9.1V12.075C9.1 12.7515 8.55155 13.3 7.875 13.3H6.125C5.44845 13.3 4.9 12.7515 4.9 12.075V9.1H1.925C1.24845 9.1 0.7 8.55155 0.7 7.875V6.125C0.7 5.44845 1.24845 4.9 1.925 4.9H4.9V1.925ZM6.125 1.75C6.02835 1.75 5.95 1.82835 5.95 1.925V5.425C5.95 5.71495 5.71495 5.95 5.425 5.95H1.925C1.82835 5.95 1.75 6.02835 1.75 6.125V7.875C1.75 7.97165 1.82835 8.05 1.925 8.05H5.425C5.71495 8.05 5.95 8.28505 5.95 8.575V12.075C5.95 12.1717 6.02835 12.25 6.125 12.25H7.875C7.97165 12.25 8.05 12.1717 8.05 12.075V8.575C8.05 8.28505 8.28505 8.05 8.575 8.05H12.075C12.1717 8.05 12.25 7.97165 12.25 7.875V6.125C12.25 6.02835 12.1717 5.95 12.075 5.95H8.575C8.28505 5.95 8.05 5.71495 8.05 5.425V1.925C8.05 1.82835 7.97165 1.75 7.875 1.75H6.125Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#387440"
        />
      </g>
      <defs>
        <clipPath id={`${uid}clip0_8654_89009`}>
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const ProfileChipTeamIcon = ({ className = '' }) => {
  const uid = useId();
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g clipPath={`url(#${uid}clip0_8654_89021)`}>
        <path
          d="M4.9 1.75C3.9335 1.75 3.15 2.5335 3.15 3.5C3.15 4.4665 3.9335 5.25 4.9 5.25C5.8665 5.25 6.65 4.4665 6.65 3.5C6.65 2.5335 5.8665 1.75 4.9 1.75ZM2.1 3.5C2.1 1.9536 3.3536 0.7 4.9 0.7C6.4464 0.7 7.7 1.9536 7.7 3.5C7.7 5.0464 6.4464 6.3 4.9 6.3C3.3536 6.3 2.1 5.0464 2.1 3.5ZM8.575 1.225C8.575 0.935051 8.81005 0.7 9.1 0.7C10.6464 0.7 11.9 1.9536 11.9 3.5C11.9 5.0464 10.6464 6.3 9.1 6.3C8.81005 6.3 8.575 6.06495 8.575 5.775C8.575 5.48505 8.81005 5.25 9.1 5.25C10.0665 5.25 10.85 4.4665 10.85 3.5C10.85 2.5335 10.0665 1.75 9.1 1.75C8.81005 1.75 8.575 1.51495 8.575 1.225ZM0.7 11.6375C0.7 9.46288 2.46288 7.7 4.6375 7.7H5.1625C7.33712 7.7 9.1 9.46288 9.1 11.6375C9.1 12.5557 8.35567 13.3 7.4375 13.3H2.3625C1.44433 13.3 0.7 12.5557 0.7 11.6375ZM4.6375 8.75C3.04278 8.75 1.75 10.0428 1.75 11.6375C1.75 11.9758 2.02423 12.25 2.3625 12.25H7.4375C7.77577 12.25 8.05 11.9758 8.05 11.6375C8.05 10.0428 6.75722 8.75 5.1625 8.75H4.6375ZM8.75 8.225C8.75 7.93505 8.98505 7.7 9.275 7.7H9.3625C11.5371 7.7 13.3 9.46288 13.3 11.6375C13.3 12.5557 12.5557 13.3 11.6375 13.3H10.5C10.2101 13.3 9.975 13.065 9.975 12.775C9.975 12.4851 10.2101 12.25 10.5 12.25H11.6375C11.9758 12.25 12.25 11.9758 12.25 11.6375C12.25 10.0428 10.9572 8.75 9.3625 8.75H9.275C8.98505 8.75 8.75 8.51495 8.75 8.225Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#387440"
        />
      </g>
      <defs>
        <clipPath id={`${uid}clip0_8654_89021`}>
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const ProfileChipHeartIcon = ({ className = '' }) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M9.45799 2.46726C8.77372 2.55385 8.03748 2.97944 7.44666 3.93593C7.35101 4.09077 7.182 4.18503 7 4.18503C6.81801 4.18503 6.64899 4.09077 6.55335 3.93594C5.96252 2.97947 5.22628 2.55388 4.542 2.46728C3.8497 2.37967 3.13784 2.62913 2.57926 3.16247C1.47334 4.22822 1.47358 6.02445 2.57999 7.08988L7 11.3462L11.42 7.08988C12.5264 6.02445 12.5267 4.22823 11.4208 3.16248C10.8622 2.62913 10.1503 2.37966 9.45799 2.46726ZM9.32617 1.42557C10.3651 1.2941 11.3844 1.67552 12.1469 2.40401L12.1483 2.40542C13.6839 3.88411 13.6839 6.36753 12.1483 7.84622L7.36416 12.4532C7.16086 12.6489 6.83914 12.6489 6.63584 12.4532L1.85167 7.84622C0.316109 6.36753 0.316109 3.88411 1.85167 2.40542L1.85314 2.40401L1.85315 2.40401C2.61557 1.67552 3.63491 1.29412 4.67383 1.42559C5.52077 1.53277 6.33371 1.97432 6.99999 2.76463C7.66628 1.9743 8.47923 1.53274 9.32617 1.42557Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#387440"
        />
      </g>
    </svg>
  );
};

export const ProfileChipTargetIcon = ({ className = '' }) => {
  const uid = useId();
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g clipPath={`url(#${uid}clip0_8654_86003)`}>
        <path
          d="M7 0.7C7.28995 0.7 7.525 0.935051 7.525 1.225V2.1278C9.81185 2.37138 11.6286 4.18816 11.8722 6.475H12.775C13.065 6.475 13.3 6.71005 13.3 7C13.3 7.28995 13.065 7.525 12.775 7.525H11.8722C11.6286 9.81185 9.81185 11.6286 7.525 11.8722V12.775C7.525 13.065 7.28995 13.3 7 13.3C6.71005 13.3 6.475 13.065 6.475 12.775V11.8722C4.18816 11.6286 2.37138 9.81185 2.1278 7.525L1.225 7.525C0.93505 7.525 0.7 7.28995 0.7 7C0.7 6.71005 0.935051 6.475 1.225 6.475L2.1278 6.475C2.37138 4.18816 4.18816 2.37138 6.475 2.1278V1.225C6.475 0.935051 6.71005 0.7 7 0.7ZM7 3.15C4.8737 3.15 3.15 4.8737 3.15 7C3.15 9.1263 4.8737 10.85 7 10.85C9.1263 10.85 10.85 9.1263 10.85 7C10.85 4.8737 9.1263 3.15 7 3.15ZM7 5.95C6.4201 5.95 5.95 6.4201 5.95 7C5.95 7.5799 6.4201 8.05 7 8.05C7.5799 8.05 8.05 7.5799 8.05 7C8.05 6.4201 7.5799 5.95 7 5.95ZM4.9 7C4.9 5.8402 5.8402 4.9 7 4.9C8.1598 4.9 9.1 5.8402 9.1 7C9.1 8.1598 8.1598 9.1 7 9.1C5.8402 9.1 4.9 8.1598 4.9 7Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#387440"
        />
      </g>
      <defs>
        <clipPath id={`${uid}clip0_8654_86003`}>
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const ProfileChipPinIcon = ({ className = '' }) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M9.96755 2.99516C8.32786 1.33495 5.67214 1.33495 4.03245 2.99516C2.38918 4.65901 2.38918 7.35932 4.03245 9.02317L7 12.0279L9.96755 9.02317C11.6108 7.35932 11.6108 4.65901 9.96755 2.99516ZM7 12.775L6.62644 13.1439L3.28539 9.761C1.2382 7.68818 1.2382 4.33015 3.28539 2.25734C5.33615 0.180888 8.66385 0.180888 10.7146 2.25734C12.7618 4.33015 12.7618 7.68818 10.7146 9.761L7.37397 13.1435L7 12.775ZM7 12.775L7.37397 13.1435C7.27533 13.2433 7.14037 13.3 7 13.3C6.85963 13.3 6.72508 13.2438 6.62644 13.1439L7 12.775ZM7 4.55C6.4201 4.55 5.95 5.0201 5.95 5.6C5.95 6.1799 6.4201 6.65 7 6.65C7.5799 6.65 8.05 6.1799 8.05 5.6C8.05 5.0201 7.5799 4.55 7 4.55ZM4.9 5.6C4.9 4.4402 5.8402 3.5 7 3.5C8.1598 3.5 9.1 4.4402 9.1 5.6C9.1 6.7598 8.1598 7.7 7 7.7C5.8402 7.7 4.9 6.7598 4.9 5.6Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#387440"
        />
      </g>
    </svg>
  );
};

export const ProfileChipLangIcon = ({ className = '' }) => {
  const uid = useId();
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g clipPath={`url(#${uid}clip0_8654_85990)`}>
        <path
          d="M5.75 1C6.16421 1 6.5 1.33579 6.5 1.75V18.25C6.5 18.6642 6.16421 19 5.75 19C5.33579 19 5 18.6642 5 18.25V1.75C5 1.33579 5.33579 1 5.75 1ZM10 4C10.4142 4 10.75 4.33579 10.75 4.75V15.25C10.75 15.6642 10.4142 16 10 16C9.58579 16 9.25 15.6642 9.25 15.25V4.75C9.25 4.33579 9.58579 4 10 4ZM18.25 5C18.6642 5 19 5.33579 19 5.75V14.25C19 14.6642 18.6642 15 18.25 15C17.8358 15 17.5 14.6642 17.5 14.25V5.75C17.5 5.33579 17.8358 5 18.25 5ZM1.75 7C2.16421 7 2.5 7.33579 2.5 7.75V12.25C2.5 12.6642 2.16421 13 1.75 13C1.33579 13 0.999999 12.6642 0.999999 12.25V7.75C0.999999 7.33579 1.33579 7 1.75 7ZM14.25 8C14.6642 8 15 8.33579 15 8.75V11.25C15 11.6642 14.6642 12 14.25 12C13.8358 12 13.5 11.6642 13.5 11.25V8.75C13.5 8.33579 13.8358 8 14.25 8Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#387440"
        />
      </g>
      <defs>
        <clipPath id={`${uid}clip0_8654_85990`}>
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const ProfileChipCheckIcon = ({ className = '' }) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M11.7213 3.16654C12.0435 3.42681 12.0937 3.89902 11.8335 4.22125L6.58346 10.7213C6.44675 10.8905 6.24329 10.9921 6.02586 10.9996C5.80842 11.0071 5.59845 10.9198 5.4504 10.7603L2.2004 7.26034C1.91855 6.9568 1.93613 6.48226 2.23966 6.2004C2.54319 5.91855 3.01774 5.93613 3.2996 6.23966L5.96051 9.10526L10.6665 3.27875C10.9268 2.95651 11.399 2.90628 11.7213 3.16654Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#272E35"
        />
      </g>
    </svg>
  );
};

export const ProfileInterestDataIcon = ({ className = '' }) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M4.725 1.925C4.725 1.24845 5.27345 0.7 5.95 0.7H8.05C8.72655 0.7 9.275 1.24845 9.275 1.925V7H11.375C12.0515 7 12.6 7.54845 12.6 8.225V12.075C12.6 12.7515 12.0515 13.3 11.375 13.3H2.625C1.94845 13.3 1.4 12.7515 1.4 12.075V5.425C1.4 4.74845 1.94845 4.2 2.625 4.2H4.725V1.925ZM4.725 5.25H2.625C2.52835 5.25 2.45 5.32835 2.45 5.425V12.075C2.45 12.1717 2.52835 12.25 2.625 12.25H4.725V5.25ZM5.775 12.25H8.225V1.925C8.225 1.82835 8.14665 1.75 8.05 1.75H5.95C5.85335 1.75 5.775 1.82835 5.775 1.925V12.25ZM9.275 12.25H11.375C11.4716 12.25 11.55 12.1717 11.55 12.075V8.225C11.55 8.12835 11.4716 8.05 11.375 8.05H9.275V12.25Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#387440"
        />
      </g>
    </svg>
  );
};

export const ProfileInterestFintechIcon = ({ className = '' }) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M0.7 4.025C0.7 2.96185 1.56185 2.1 2.625 2.1H11.375C12.4381 2.1 13.3 2.96185 13.3 4.025V9.975C13.3 11.0381 12.4381 11.9 11.375 11.9H2.625C1.56185 11.9 0.7 11.0381 0.7 9.975V4.025ZM2.625 3.15C2.14175 3.15 1.75 3.54175 1.75 4.025V5.6H12.25V4.025C12.25 3.54175 11.8582 3.15 11.375 3.15H2.625ZM12.25 6.65H1.75V9.975C1.75 10.4582 2.14175 10.85 2.625 10.85H11.375C11.8582 10.85 12.25 10.4582 12.25 9.975V6.65ZM2.8 8.925C2.8 8.63505 3.03505 8.4 3.325 8.4H5.775C6.06495 8.4 6.3 8.63505 6.3 8.925C6.3 9.21495 6.06495 9.45 5.775 9.45H3.325C3.03505 9.45 2.8 9.21495 2.8 8.925Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#387440"
        />
      </g>
    </svg>
  );
};

export const ProfileInterestAgritechIcon = ({ className = '' }) => {
  const uid = useId();
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g clipPath={`url(#${uid}clip0_8654_88793)`}>
        <path
          d="M8.98417 1.42077C9.5452 0.859743 10.4548 0.859742 11.0158 1.42077L13.0792 3.48417C13.6403 4.0452 13.6403 4.9548 13.0792 5.51583L11.0158 7.57923C10.9339 7.66113 10.8446 7.73108 10.75 7.78907V9.25H13.5C15.0188 9.25 16.25 10.4814 16.25 12.0001V12.2109C16.3446 12.2689 16.4339 12.3389 16.5158 12.4208L18.5792 14.4842C19.1403 15.0452 19.1403 15.9548 18.5792 16.5158L16.5158 18.5792C15.9548 19.1403 15.0452 19.1403 14.4842 18.5792L12.4208 16.5158C11.8597 15.9548 11.8597 15.0452 12.4208 14.4842L14.4842 12.4208C14.5661 12.3389 14.6554 12.2689 14.75 12.2109V12.0001C14.75 11.3097 14.1903 10.75 13.5 10.75H6.5C5.80964 10.75 5.25 11.3096 5.25 12V12.2109C5.34459 12.2689 5.43393 12.3389 5.51583 12.4208L7.57923 14.4842C8.14026 15.0452 8.14026 15.9548 7.57923 16.5158L5.51583 18.5792C4.9548 19.1403 4.0452 19.1403 3.48417 18.5792L1.42077 16.5158C0.859743 15.9548 0.859742 15.0452 1.42077 14.4842L3.48417 12.4208C3.56607 12.3389 3.65541 12.2689 3.75 12.2109V12C3.75 10.4812 4.98122 9.25 6.5 9.25H9.25V7.78907C9.15541 7.73108 9.06607 7.66113 8.98417 7.57923L6.92077 5.51583C6.35974 4.9548 6.35974 4.0452 6.92077 3.48417L8.98417 1.42077ZM10 6.47374L11.9737 4.5L10 2.52626L8.02626 4.5L10 6.47374ZM4.5 13.5263L2.52626 15.5L4.5 17.4737L6.47374 15.5L4.5 13.5263ZM4.45517 17.5186C4.45514 17.5186 4.45521 17.5185 4.45517 17.5186ZM4.54472 17.5185C4.54469 17.5184 4.54476 17.5185 4.54472 17.5185ZM15.5 13.5263L13.5263 15.5L15.5 17.4737L17.4737 15.5L15.5 13.5263Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#387440"
        />
      </g>
      <defs>
        <clipPath id={`${uid}clip0_8654_88793`}>
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const ProfileInterestCityIcon = ({ className = '' }) => {
  const uid = useId();
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g clipPath={`url(#${uid}clip0_8654_88753)`}>
        <path
          d="M3.72665 0.699999H7.47335C7.65359 0.699986 7.81913 0.699974 7.95751 0.71128C8.1067 0.72347 8.26992 0.751374 8.43114 0.833517C8.66164 0.950962 8.84904 1.13836 8.96648 1.36886C9.04863 1.53008 9.07653 1.6933 9.08872 1.84249C9.10003 1.98087 9.10001 2.1464 9.1 2.32664L9.1 4.9L10.2733 4.9C10.4536 4.89999 10.6191 4.89997 10.7575 4.91128C10.9067 4.92347 11.0699 4.95137 11.2311 5.03352C11.4616 5.15096 11.649 5.33836 11.7665 5.56886C11.8486 5.73008 11.8765 5.8933 11.8887 6.04249C11.9 6.18087 11.9 6.3464 11.9 6.52664L11.9 12.25H12.775C13.065 12.25 13.3 12.4851 13.3 12.775C13.3 13.0649 13.065 13.3 12.775 13.3H1.225C0.935051 13.3 0.7 13.0649 0.7 12.775C0.7 12.4851 0.935051 12.25 1.225 12.25H2.1V2.345C2.1 2.33887 2.1 2.33275 2.1 2.32665C2.09999 2.14641 2.09997 1.98087 2.11128 1.84249C2.12347 1.6933 2.15137 1.53008 2.23352 1.36886C2.35096 1.13836 2.53836 0.950962 2.76886 0.833517C2.93008 0.751374 3.0933 0.72347 3.24249 0.71128C3.38087 0.699974 3.54641 0.699986 3.72665 0.699999ZM3.15 12.25H8.05V2.345C8.05 2.14032 8.04959 2.01838 8.04221 1.92799C8.0377 1.87283 8.03175 1.84964 8.02982 1.84342C8.01336 1.81218 7.98782 1.78664 7.95658 1.77018C7.95036 1.76825 7.92717 1.7623 7.87201 1.75779C7.78162 1.75041 7.65968 1.75 7.455 1.75H3.745C3.54032 1.75 3.41838 1.75041 3.32799 1.75779C3.27283 1.7623 3.24964 1.76825 3.24342 1.77018C3.21218 1.78664 3.18664 1.81218 3.17018 1.84342C3.16825 1.84964 3.1623 1.87283 3.15779 1.92799C3.15041 2.01838 3.15 2.14032 3.15 2.345V12.25ZM3.17081 1.84161C3.17082 1.84163 3.17069 1.84201 3.17042 1.84267ZM3.24161 1.77081C3.24159 1.7708 3.24193 1.77066 3.24267 1.77042ZM7.95839 1.77081C7.95837 1.77082 7.958 1.77069 7.95735 1.77042ZM8.02919 1.84161C8.0292 1.84159 8.02933 1.84192 8.02958 1.84265ZM9.1 5.95V12.25H10.85V6.545C10.85 6.34032 10.8496 6.21838 10.8422 6.12799C10.8377 6.07283 10.8318 6.04964 10.8298 6.04342C10.8134 6.01218 10.7878 5.98664 10.7566 5.97018C10.7504 5.96825 10.7272 5.9623 10.672 5.95779C10.5816 5.95041 10.4597 5.95 10.255 5.95H9.1ZM10.7584 5.97081C10.7584 5.97082 10.758 5.97069 10.7573 5.97042ZM10.8292 6.04161C10.8292 6.04158 10.8293 6.04192 10.8296 6.04267ZM4.2 4.025C4.2 3.73505 4.43505 3.5 4.725 3.5H6.475C6.76495 3.5 7 3.73505 7 4.025C7 4.31495 6.76495 4.55 6.475 4.55H4.725C4.43505 4.55 4.2 4.31495 4.2 4.025ZM4.2 7C4.2 6.71005 4.43505 6.475 4.725 6.475H6.475C6.76495 6.475 7 6.71005 7 7C7 7.28995 6.76495 7.525 6.475 7.525H4.725C4.43505 7.525 4.2 7.28995 4.2 7ZM4.2 9.975C4.2 9.68505 4.43505 9.45 4.725 9.45H6.475C6.76495 9.45 7 9.68505 7 9.975C7 10.2649 6.76495 10.5 6.475 10.5H4.725C4.43505 10.5 4.2 10.2649 4.2 9.975Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#387440"
        />
      </g>
      <defs>
        <clipPath id={`${uid}clip0_8654_88753`}>
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const ProfileInterestMicIcon = ({ className = '' }) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M4.2 3.5C4.2 1.9536 5.4536 0.7 7 0.7C8.5464 0.7 9.8 1.9536 9.8 3.5V6.3C9.8 7.8464 8.5464 9.1 7 9.1C5.4536 9.1 4.2 7.8464 4.2 6.3V3.5ZM7 1.75C6.0335 1.75 5.25 2.5335 5.25 3.5V6.3C5.25 7.2665 6.0335 8.05 7 8.05C7.9665 8.05 8.75 7.2665 8.75 6.3V3.5C8.75 2.5335 7.9665 1.75 7 1.75ZM2.625 5.775C2.91495 5.775 3.15 6.01005 3.15 6.3C3.15 8.4263 4.8737 10.15 7 10.15C9.1263 10.15 10.85 8.4263 10.85 6.3C10.85 6.01005 11.0851 5.775 11.375 5.775C11.6649 5.775 11.9 6.01005 11.9 6.3C11.9 8.82884 9.98433 10.9102 7.525 11.1722V12.25H9.275C9.56495 12.25 9.8 12.4851 9.8 12.775C9.8 13.065 9.56495 13.3 9.275 13.3H4.725C4.43505 13.3 4.2 13.065 4.2 12.775C4.2 12.4851 4.43505 12.25 4.725 12.25H6.475V11.1722C4.01567 10.9102 2.1 8.82884 2.1 6.3C2.1 6.01005 2.33505 5.775 2.625 5.775Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#387440"
        />
      </g>
    </svg>
  );
};

export const ProfileInterestMusicIcon = ({ className = '' }) => {
  const uid = useId();
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g clipPath={`url(#${uid}clip0_8654_88833)`}>
        <path
          d="M10 2.5C6.41015 2.5 3.5 5.41015 3.5 9V11H4.08045C4.6146 11 5.06044 11 5.42467 11.0297C5.80456 11.0608 6.16121 11.1279 6.49847 11.2997C7.01592 11.5634 7.43662 11.9841 7.70027 12.5015C7.87211 12.8388 7.93922 13.1954 7.97026 13.5753C8.00002 13.9396 8.00001 14.3854 8 14.9196V16C8 16.0124 8 16.0246 8.00001 16.0366C8.00005 16.2329 8.00009 16.3842 7.98676 16.5195C7.85816 17.8252 6.82518 18.8582 5.51955 18.9868C5.38415 19.0001 5.23292 19.0001 5.03662 19C5.02458 19 5.01238 19 5 19C4.98762 19 4.97542 19 4.96338 19C4.76708 19.0001 4.61585 19.0001 4.48045 18.9868C3.17482 18.8582 2.14184 17.8252 2.01324 16.5195C1.99991 16.3842 1.99995 16.2329 1.99999 16.0366C2 16.0246 2 16.0124 2 16V9C2 4.58172 5.58172 1 10 1C14.4183 1 18 4.58172 18 9V16C18 16.0124 18 16.0246 18 16.0366C18.0001 16.2329 18.0001 16.3842 17.9868 16.5195C17.8582 17.8252 16.8252 18.8582 15.5195 18.9868C15.3842 19.0001 15.2329 19.0001 15.0366 19C15.0246 19 15.0124 19 15 19C14.9876 19 14.9754 19 14.9634 19C14.7671 19.0001 14.6158 19.0001 14.4805 18.9868C13.1748 18.8582 12.1418 17.8252 12.0132 16.5195C11.9999 16.3842 11.9999 16.2329 12 16.0366C12 16.0246 12 16.0124 12 16V14.9195C12 14.3854 12 13.9396 12.0297 13.5753C12.0608 13.1954 12.1279 12.8388 12.2997 12.5015C12.5634 11.9841 12.9841 11.5634 13.5015 11.2997C13.8388 11.1279 14.1954 11.0608 14.5753 11.0297C14.9396 11 15.3854 11 15.9195 11H16.5V9C16.5 5.41015 13.5899 2.5 10 2.5ZM16.5 12.5H15.95C15.3776 12.5 14.9934 12.5006 14.6975 12.5248C14.4104 12.5482 14.2731 12.5901 14.1825 12.6362C13.9473 12.7561 13.7561 12.9473 13.6362 13.1825C13.5901 13.2731 13.5482 13.4104 13.5248 13.6975C13.5006 13.9934 13.5 14.3776 13.5 14.95V16C13.5 16.25 13.5009 16.3207 13.506 16.3725C13.5645 16.966 14.034 17.4355 14.6275 17.494C14.6793 17.4991 14.75 17.5 15 17.5C15.25 17.5 15.3207 17.4991 15.3725 17.494C15.966 17.4355 16.4355 16.966 16.494 16.3725C16.4991 16.3207 16.5 16.25 16.5 16V12.5ZM3.5 12.5V16C3.5 16.25 3.50091 16.3207 3.50602 16.3725C3.56447 16.966 4.03401 17.4355 4.62748 17.494C4.67935 17.4991 4.74998 17.5 5 17.5C5.25002 17.5 5.32065 17.4991 5.37252 17.494C5.96599 17.4355 6.43553 16.966 6.49398 16.3725C6.49909 16.3207 6.5 16.25 6.5 16V14.95C6.5 14.3776 6.49942 13.9934 6.47524 13.6975C6.45178 13.4104 6.4099 13.2731 6.36376 13.1825C6.24392 12.9473 6.05269 12.7561 5.81749 12.6362C5.72693 12.5901 5.58965 12.5482 5.30252 12.5248C5.00664 12.5006 4.62243 12.5 4.05 12.5H3.5Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#387440"
        />
      </g>
      <defs>
        <clipPath id={`${uid}clip0_8654_88833`}>
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const ProfileCameraIcon = ({ className = '' }) => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M6.50045 1.49991C6.51846 1.49996 6.53636 1.5 6.55414 1.5H8.44586C8.46364 1.5 8.48154 1.49996 8.49955 1.49991C8.71285 1.49938 8.94054 1.49882 9.15194 1.57173C9.33586 1.63517 9.50337 1.7387 9.64236 1.87483C9.80212 2.0313 9.90344 2.23521 9.99836 2.42623C10.0064 2.44235 10.0143 2.45838 10.0223 2.47429L10.2851 3L11.3103 3C11.7109 2.99999 12.0453 2.99999 12.3185 3.0223C12.6034 3.04558 12.8709 3.09592 13.1239 3.2248C13.5119 3.42254 13.8275 3.73806 14.0252 4.12614C14.1541 4.37909 14.2044 4.64658 14.2277 4.9315C14.25 5.20467 14.25 5.53905 14.25 5.93966V10.5603C14.25 10.9609 14.25 11.2953 14.2277 11.5685C14.2044 11.8534 14.1541 12.1209 14.0252 12.3739C13.8275 12.7619 13.5119 13.0775 13.1239 13.2752C12.8709 13.4041 12.6034 13.4544 12.3185 13.4777C12.0453 13.5 11.7109 13.5 11.3103 13.5H3.68966C3.28905 13.5 2.95467 13.5 2.6815 13.4777C2.39658 13.4544 2.12909 13.4041 1.87614 13.2752C1.48806 13.0775 1.17254 12.7619 0.974799 12.3739C0.845916 12.1209 0.795583 11.8534 0.772304 11.5685C0.749985 11.2953 0.749992 10.9609 0.75 10.5603V5.93967C0.749992 5.53906 0.749985 5.20467 0.772304 4.9315C0.795583 4.64658 0.845916 4.37909 0.974799 4.12614C1.17254 3.73806 1.48806 3.42254 1.87614 3.2248C2.12909 3.09592 2.39658 3.04558 2.6815 3.0223C2.95467 2.99999 3.28906 2.99999 3.68967 3L4.71486 3L4.97771 2.47429C4.98567 2.45838 4.99363 2.44235 5.00164 2.42623C5.09656 2.2352 5.19788 2.0313 5.35764 1.87483C5.49663 1.7387 5.66414 1.63517 5.84806 1.57173C6.05946 1.49882 6.28715 1.49938 6.50045 1.49991ZM6.21328 2.63573C6.21325 2.63572 6.21359 2.63561 6.21439 2.63541ZM6.27143 2.62903C6.23408 2.63136 6.21848 2.63443 6.21439 2.63541C6.18844 2.64444 6.16484 2.65904 6.14516 2.67822C6.14245 2.68144 6.13277 2.69398 6.11398 2.72634C6.08348 2.77889 6.04719 2.85091 5.98394 2.9774L5.56562 3.81406C5.47033 4.00462 5.27556 4.125 5.0625 4.125H3.7125C3.28318 4.125 2.99502 4.12544 2.77311 4.14357C2.55777 4.16116 2.4548 4.19257 2.38688 4.22718C2.21048 4.31706 2.06706 4.46048 1.97718 4.63688C1.94257 4.7048 1.91116 4.80777 1.89357 5.02311C1.87544 5.24502 1.875 5.53318 1.875 5.9625V10.5375C1.875 10.9668 1.87544 11.255 1.89357 11.4769C1.91116 11.6922 1.94257 11.7952 1.97718 11.8631C2.06706 12.0395 2.21048 12.1829 2.38688 12.2728C2.4548 12.3074 2.55777 12.3388 2.77311 12.3564C2.99502 12.3746 3.28318 12.375 3.7125 12.375H11.2875C11.7168 12.375 12.005 12.3746 12.2269 12.3564C12.4422 12.3388 12.5452 12.3074 12.6131 12.2728C12.7895 12.1829 12.9329 12.0395 13.0228 11.8631C13.0574 11.7952 13.0888 11.6922 13.1064 11.4769C13.1246 11.255 13.125 10.9668 13.125 10.5375V5.9625C13.125 5.53318 13.1246 5.24502 13.1064 5.02311C13.0888 4.80777 13.0574 4.7048 13.0228 4.63688C12.9329 4.46048 12.7895 4.31706 12.6131 4.22718C12.5452 4.19257 12.4422 4.16116 12.2269 4.14357C12.005 4.12544 11.7168 4.125 11.2875 4.125H9.9375C9.72444 4.125 9.52967 4.00462 9.43438 3.81406L9.01606 2.9774C8.95281 2.85091 8.91652 2.77889 8.88602 2.72634C8.86723 2.69397 8.85755 2.68143 8.85483 2.67822C8.83516 2.65904 8.81151 2.64443 8.78556 2.6354C8.78628 2.63564 8.7867 2.63574 8.78672 2.63573M8.78556 2.6354C8.78147 2.63441 8.76592 2.63136 8.72857 2.62903C8.66793 2.62525 8.58728 2.625 8.44586 2.625H6.55414C6.41272 2.625 6.33207 2.62525 6.27143 2.62903M8.85403 2.67732C8.85402 2.6773 8.85431 2.6776 8.85483 2.67822ZM6.14597 2.67732C6.14597 2.67735 6.14566 2.67771 6.14516 2.67822ZM7.5 6.375C6.46447 6.375 5.625 7.21447 5.625 8.25C5.625 9.28553 6.46447 10.125 7.5 10.125C8.53553 10.125 9.375 9.28553 9.375 8.25C9.375 7.21447 8.53553 6.375 7.5 6.375ZM4.5 8.25C4.5 6.59315 5.84315 5.25 7.5 5.25C9.15685 5.25 10.5 6.59315 10.5 8.25C10.5 9.90685 9.15685 11.25 7.5 11.25C5.84315 11.25 4.5 9.90685 4.5 8.25Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#1C2A21"
        />
      </g>
    </svg>
  );
};

export const ProfileGhanaFlagIcon = ({ className = '' }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path d="M0 7.03125H18V10.9688H0V7.03125Z" fill="#F9CB38" />
        <path
          d="M15.1875 2.8125H2.8125C0.948656 2.8125 0 4.19766 0 5.90625V7.03125H18V5.90625C18 4.19766 17.0513 2.8125 15.1875 2.8125Z"
          fill="#EC1C24"
        />
        <path
          d="M0 12.0938C0 13.8023 0.948656 15.1875 2.8125 15.1875H15.1875C17.0513 15.1875 18 13.8023 18 12.0938V10.9688H0V12.0938Z"
          fill="#137A08"
        />
        <path
          d="M8.93756 7.26328L9.48516 8.37281L10.71 8.55225L9.82434 9.41625L10.0336 10.6349L8.93756 10.0592L7.84181 10.6349L8.05106 9.41625L7.16512 8.55225L8.39025 8.37281L8.93756 7.26328Z"
          fill="#25333A"
        />
      </g>
    </svg>
  );
};

export const ProfileVerifiedCheckIcon = ({ className = '' }) => {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M10.836 3.88532C11.0978 4.09678 11.1386 4.48045 10.9272 4.74227L6.66156 10.0235C6.55049 10.161 6.38517 10.2435 6.20851 10.2496C6.03184 10.2557 5.86124 10.1848 5.74095 10.0553L3.10033 7.21152C2.87132 6.9649 2.8856 6.57933 3.13223 6.35033C3.37885 6.12132 3.76442 6.1356 3.99342 6.38222L6.15542 8.71053L9.97907 3.97648C10.1905 3.71467 10.5742 3.67385 10.836 3.88532Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#387440"
        />
      </g>
    </svg>
  );
};

export const ProfileCheckWhiteIcon = ({ className = '' }) => {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M10.836 3.88532C11.0978 4.09678 11.1386 4.48045 10.9272 4.74227L6.66156 10.0235C6.55049 10.161 6.38517 10.2435 6.20851 10.2496C6.03184 10.2557 5.86124 10.1848 5.74095 10.0553L3.10033 7.21152C2.87132 6.9649 2.8856 6.57933 3.13223 6.35033C3.37885 6.12132 3.76442 6.1356 3.99342 6.38222L6.15542 8.71053L9.97907 3.97648C10.1905 3.71467 10.5742 3.67385 10.836 3.88532Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="white"
        />
      </g>
    </svg>
  );
};

export const ProfileVerifiedHeadingCheckIcon = ({ className = '' }) => {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M23.8524 7.81227C24.4565 8.30027 24.5507 9.18566 24.0627 9.78985L14.219 21.9773C13.9627 22.2947 13.5812 22.4851 13.1735 22.4992C12.7658 22.5132 12.3721 22.3496 12.0945 22.0506L6.00076 15.4881C5.47229 14.919 5.50524 14.0292 6.07437 13.5008C6.64349 12.9723 7.53327 13.0052 8.06174 13.5744L13.051 18.9474L21.8748 8.02265C22.3628 7.41846 23.2482 7.32427 23.8524 7.81227Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#1C2A21"
        />
      </g>
    </svg>
  );
};

export const ProfilePitchPlayIcon = ({ className = '' }) => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <rect width="28" height="28" rx="14" fill="#1C2A21" />
        <path d="M19 14L11.5 18.3301V9.66987L19 14Z" fill="white" />
      </g>
    </svg>
  );
};

export const ProfilePitchPlayLargeIcon = ({ className = '' }) => {
  const uid = useId();
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g filter={`url(#${uid}filter0_dd_8654_88698)`}>
        <rect x="24" y="14" width="72" height="72" rx="36" fill="#FFD86B" />
        <rect
          x="24.75"
          y="14.75"
          width="70.5"
          height="70.5"
          rx="35.25"
          stroke="#1C2A21"
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />
        <path d="M72 50L54 60.3923V39.6077L72 50Z" fill="#1C2A21" />
      </g>
      <defs>
        <filter
          id={`${uid}filter0_dd_8654_88698`}
          x="0"
          y="0"
          width="120"
          height="120"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="4" dy="4" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.109804 0 0 0 0 0.164706 0 0 0 0 0.129412 0 0 0 0.45 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_8654_88698" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="10" />
          <feGaussianBlur stdDeviation="12" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.109804 0 0 0 0 0.164706 0 0 0 0 0.129412 0 0 0 0.06 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_8654_88698"
            result="effect2_dropShadow_8654_88698"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_8654_88698"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export const ProfileDoodleSparkleLargeIcon = ({ className = '' }) => {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M11 0L13.7224 8.27764L22 11L13.7224 13.7224L11 22L8.27764 13.7224L0 11L8.27764 8.27764L11 0Z"
        fill="white"
      />
    </svg>
  );
};

export const ProfileDoodleSparkleSmallIcon = ({ className = '' }) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M7 0L8.73241 5.26759L14 7L8.73241 8.73241L7 14L5.26759 8.73241L0 7L5.26759 5.26759L7 0Z"
        fill="white"
      />
    </svg>
  );
};

export const ProfileDoodleSparkleMediumIcon = ({ className = '' }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M9 0L11.2274 6.77261L18 9L11.2274 11.2274L9 18L6.77261 11.2274L0 9L6.77261 6.77261L9 0Z"
        fill="white"
      />
    </svg>
  );
};

export const ProfileDoodleSquiggleIcon = ({ className = '' }) => {
  return (
    <svg
      width="122.121"
      height="11.6605"
      viewBox="0 0 122.121 11.6605"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M1.06066 5.83025C16.0607 -9.16975 26.0607 20.8302 41.0607 5.83025C56.0607 -9.16975 66.0607 20.8302 81.0607 5.83025C96.0607 -9.16975 106.061 20.8302 121.061 5.83025"
        strokeWidth="3"
        stroke="#FFD86B"
      />
    </svg>
  );
};

export const ProfileStrengthRingTrackIcon = ({ className = '' }) => {
  return (
    <svg
      width="84"
      height="84"
      viewBox="0 0 84 84"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M84 42C84 65.196 65.196 84 42 84C18.804 84 0 65.196 0 42C0 18.804 18.804 0 42 0C65.196 0 84 18.804 84 42ZM8.4 42C8.4 60.5568 23.4432 75.6 42 75.6C60.5568 75.6 75.6 60.5568 75.6 42C75.6 23.4432 60.5568 8.4 42 8.4C23.4432 8.4 8.4 23.4432 8.4 42Z"
        fill="#E1EAE2"
      />
    </svg>
  );
};

export const ProfileStrengthRingProgressIcon = ({ className = '' }) => {
  return (
    <svg
      width="84"
      height="84"
      viewBox="0 0 84 84"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M42 0C51.0951 -3.97559e-07 59.9445 2.95236 67.2177 8.41324C74.4909 13.8741 79.7949 21.5484 82.3324 30.2824C84.8698 39.0163 84.5036 48.338 81.2887 56.8459C78.0738 65.3539 72.184 72.5884 64.5048 77.4618C56.8255 82.3352 47.7718 84.5841 38.7048 83.8705C29.6377 83.1569 21.0473 79.5194 14.2249 73.5047C7.4026 67.49 2.71705 59.4232 0.872679 50.5171C-0.971692 41.6109 0.124796 32.3468 3.9973 24.1173L11.5978 27.6938C8.49984 34.2774 7.62265 41.6888 9.09815 48.8137C10.5736 55.9386 14.3221 62.392 19.78 67.2037C25.2378 72.0155 32.1102 74.9256 39.3638 75.4964C46.6175 76.0673 53.8604 74.2681 60.0038 70.3694C66.1472 66.4707 70.859 60.6831 73.431 53.8768C76.0029 47.0704 76.2959 39.6131 74.2659 32.6259C72.2359 25.6387 67.9927 19.4993 62.1742 15.1306C56.3556 10.7619 49.2761 8.4 42 8.4V0Z"
        fill="#387440"
      />
    </svg>
  );
};

export const ProfileSearchNoteIcon = ({ className = '' }) => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M4.5 1.5C2.84315 1.5 1.5 2.84315 1.5 4.5C1.5 6.15685 2.84315 7.5 4.5 7.5C6.15685 7.5 7.5 6.15685 7.5 4.5C7.5 2.84315 6.15685 1.5 4.5 1.5ZM0.75 4.5C0.75 2.42893 2.42893 0.75 4.5 0.75C6.57107 0.75 8.25 2.42893 8.25 4.5C8.25 5.40048 7.93261 6.22682 7.4036 6.87327L9.64017 9.10983C9.78661 9.25628 9.78661 9.49372 9.64017 9.64017C9.49372 9.78661 9.25628 9.78661 9.10983 9.64017L6.87327 7.4036C6.22682 7.93261 5.40048 8.25 4.5 8.25C2.42893 8.25 0.75 6.57107 0.75 4.5Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#463409"
        />
      </g>
    </svg>
  );
};

export const ProfileTrophyIcon = ({ className = '' }) => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M18.9688 11.5918C19.4023 11.2344 21.9063 9.68555 23.2773 8.38086C24.3477 7.36133 24.7617 4.69922 23.1152 3.4043C20.9746 1.72266 18.9199 3.48828 18.9199 3.48828C18.9199 3.48828 18.7402 2.49023 17.4902 1.9043C15.916 1.16602 13.9219 0.890625 12.0879 0.914062C10.3105 0.935547 8.67383 1.15039 7.2207 1.86328C5.91992 2.50195 5.8418 3.41211 5.8418 3.41211C5.8418 3.41211 4.13477 1.78125 2.04297 3.10547C-0.0468749 4.43164 0.552734 7.08789 1.55859 8.20312C2.86914 9.65625 4.44336 10.3965 5.1582 10.9316C5.87109 11.4668 6.55469 11.9766 6.55469 12.4355C6.55469 12.8945 6.35156 12.9961 6.27344 12.9707C6.19727 12.9453 6.0625 12.498 5.71289 12.6895C5.23633 12.9531 5.38086 14.0156 6.375 14.1172C7.33789 14.2168 7.52148 13.1992 7.52148 13.1992L7.67383 12.2051L9.25391 13.3008L10.9863 14.7285L10.9355 15.9512C10.9355 15.9512 10.8594 16.8945 10.4004 17.7109C9.94141 18.5273 9.20313 19.3418 9.20313 19.3418L9.17969 20.0801L15.6035 19.9277L15.4004 19.2148C15.4004 19.2148 14.5723 18.3047 14.0742 17.3281C13.7187 16.6289 13.6621 15.9238 13.6621 15.9238L13.6465 14.1699L16.9805 12.127C16.9805 12.127 17.3379 12.4082 17.2871 12.5098C17.2363 12.6113 17.2246 13.6523 18.0254 14.0391C18.8164 14.4219 19.4531 13.9375 19.377 13.2734C19.3008 12.6113 18.8926 12.8398 18.7656 12.9414C18.6387 13.043 18.3574 13.0684 18.2813 12.6855C18.2031 12.3066 18.5352 11.9492 18.9688 11.5918ZM2.55664 7.98633L1.79297 5.66211L2.7168 4.45312L3.75195 4.15039C3.75195 4.15039 5.07422 5.13672 5.12109 5.2168C5.16797 5.29687 5.96484 6.93555 5.96484 6.93555L7.01562 10.7402L2.55664 7.98633ZM17.5684 11.043C17.584 10.9629 18.5547 6.9668 18.5547 6.9668C18.5547 6.91992 19.2383 6.60156 19.2383 6.53711C19.2383 6.47266 20.4805 4.45117 20.4805 4.45117L22.5508 4.53125L22.9805 6.58398L21.9453 8.28711C21.9473 8.28906 17.5527 11.1211 17.5684 11.043Z"
          fill="#FEC417"
        />
        <path
          d="M23.4219 5.98437C23.2695 4.16406 21.4687 3.72852 20.7285 3.99219C19.9883 4.25586 19.5078 4.75 19.3437 5.45312C19.2109 6.02148 19.0781 6.40039 18.9258 6.45898C18.7578 6.52148 18.6035 6.49609 18.6035 6.49609C18.6035 6.49609 18.5762 5.26562 18.584 4.76953C18.6035 3.74609 18.916 3.48437 18.916 3.48437C18.916 3.48437 18.8496 3.13867 18.7168 2.94727C18.584 2.75781 18.3379 2.51172 18.3379 2.51172C18.3379 2.51172 18.3945 3.00391 18.1484 3.11914C17.9023 3.23437 17.6367 3.0625 17.6367 3.0625L17.8828 4.08594C17.8828 4.08594 17.4844 9.1875 17.4473 9.30078C17.4102 9.41406 15.9121 12.0117 15.9121 12.0117C15.9121 12.0117 15.0391 12.8281 14.623 13.0176C14.2051 13.207 13.8457 13.7012 12.2344 13.7187C10.623 13.7383 9.23828 12.4668 9.23828 12.4668L7.85352 11.1387L6.83008 8.12305L6.67773 5.05078L6.74219 3.93359L6.78711 3.4668L6.71484 3.23047C6.71484 3.23047 6.58203 3.36328 6.33594 3.30664C6.08984 3.25 5.99414 2.92773 5.99414 2.92773C5.99414 2.92773 5.89844 3.08008 5.88086 3.15625C5.86133 3.23242 5.8418 3.4082 5.8418 3.4082C5.8418 3.4082 6.10742 3.6875 6.16406 4.08594C6.2207 4.48437 6.14453 6.13477 5.86133 6.0957C5.57617 6.05859 5.66992 4.67383 4.58984 4.14258C3.6543 3.68164 2.25781 3.82031 1.6875 4.97656C1.11914 6.13281 1.53516 7.49805 3.31836 8.76953C5.10156 10.041 7 11.1094 7.30078 12.1289C7.66016 13.3418 6.8457 14.0625 6.8457 14.0625C6.8457 14.0625 7.4375 13.9805 7.72852 13.3457C7.82227 13.1406 7.85742 12.8418 7.87109 12.6641C8.54492 13.543 9.44141 14.2871 10.6289 14.6465C11.0781 14.8008 11.584 14.8789 12.2871 14.8789C12.3887 14.8789 12.4883 14.875 12.5879 14.8711C13.4102 14.8418 14.1133 14.6875 14.7949 14.3496C15.7148 13.9238 16.4277 13.2734 16.9785 12.5352C16.9629 12.7109 17.0703 13.1484 17.2754 13.4941C17.6348 14.1016 18.2422 14.1387 18.2422 14.1387C18.2422 14.1387 17.4082 13.6465 17.5781 12.4707C17.748 11.2949 18.5254 10.877 19.7012 10.1191C20.8809 9.35937 23.5723 7.80469 23.4219 5.98437ZM4.1543 8.56445C3.625 8.19141 2.69727 7.69336 2.31445 6.93359C1.80469 5.91992 2.21875 4.69531 3.1875 4.54492C5.19922 4.22852 5.23633 6.72656 5.36914 7.0293C5.50195 7.33203 5.88086 7.35156 5.88086 7.35156C5.88086 7.35156 5.89453 7.51953 5.94922 7.84375C5.95117 7.85352 5.95312 7.86133 5.95312 7.87109L5.95898 7.90039C5.99609 8.12109 6.04883 8.39648 6.12305 8.71094L6.12891 8.73437C6.16992 8.91211 6.21289 9.08008 6.25781 9.23437C6.34766 9.55859 6.45703 9.9082 6.5918 10.2676C6.39648 10.1348 5.27734 9.35937 4.1543 8.56445ZM22.3789 7.16016C21.959 7.83984 21.1094 8.3457 20.4824 8.77148C19.6738 9.32031 18.4707 10.1445 18.1309 10.375C18.209 10.168 18.2773 9.96289 18.3398 9.76172C18.4414 9.49609 18.5488 9.17187 18.623 8.82226C18.8184 7.9043 18.8516 7.10156 18.8516 7.10156C18.8516 7.10156 19.25 7.21484 19.4961 6.94922C19.7422 6.68359 19.834 5.85937 20.0645 5.4707C20.4238 4.86328 21.1445 4.23828 22.2266 4.99609C22.8516 5.43555 22.875 6.35547 22.3789 7.16016ZM11.8203 15.4902L12.9238 15.4766C12.9238 15.4766 12.9531 16.6816 13.127 17.5801C13.3008 18.4805 13.5332 19.4805 13.5332 19.4805C13.5332 19.4805 11.2852 20.2344 11.2988 19.4219C11.3125 18.6094 11.6465 17.0273 11.6465 17.0273C11.6465 17.0273 11.8496 15.1426 11.8203 15.4902Z"
          fill="#FFA828"
        />
        <path
          d="M9.96856 2.9668C9.96856 2.9668 11.1971 2.82813 12.3397 2.8457C13.4822 2.86328 14.658 3.08789 14.658 3.08789C14.658 3.08789 14.5897 6.91211 14.3807 9.05859C14.1736 11.2051 13.3611 12.8125 13.1443 13.2676C12.9354 13.709 12.783 13.9453 12.783 13.9453L11.6814 13.8164L9.77715 9.99219L9.96856 2.9668Z"
          fill="#FFA828"
        />
        <path
          d="M8.49774 3.53906C8.49774 3.53906 8.84345 3.36523 9.3454 3.17578C9.80048 3.00391 10.2106 2.95117 10.2106 2.95117C10.2106 2.95117 10.2224 5.48633 10.2634 7.29492C10.2985 8.83594 10.8688 11.3613 11.1462 12.0371C11.4235 12.7129 11.9235 13.7441 11.9235 13.7441C11.9235 13.7441 10.9177 13.5996 10.2985 12.8145C9.97235 12.4004 8.44696 9.19726 8.39423 7.08594C8.34149 4.97461 8.54852 3.48633 8.49774 3.53906Z"
          fill="#FFEFAB"
        />
        <path
          d="M7.92578 3.83203C7.89062 3.93555 7.61523 6.11719 8.04687 8.14062C8.47851 10.1641 9.11719 11.5488 9.53906 12.0977C9.91406 12.584 10.1582 12.8145 10.2969 12.8145C10.4355 12.8145 9.72656 11.1367 9.39648 9.82031C9.06836 8.50586 8.89453 6.92969 8.85937 6.15234C8.82422 5.37305 8.79101 3.36523 8.79101 3.36523C8.79101 3.36523 8.41016 3.53906 8.32422 3.58984C8.23828 3.64258 7.92578 3.83203 7.92578 3.83203Z"
          fill="#FFFCFD"
        />
        <path
          d="M10.418 19.3379C10.418 19.3379 11.1621 18.127 11.3184 17.209C11.4746 16.291 11.5605 15.4785 11.5605 15.4785L12.0215 15.498C12.0215 15.498 11.9766 16.8281 11.9238 17.7285C11.8711 18.6289 11.7168 19.5117 11.7168 19.5117L10.418 19.3379Z"
          fill="#FFEFAB"
        />
        <path
          d="M10.9902 14.7285C10.9902 14.7285 11.3359 14.3906 12.2871 14.3906C13.2383 14.3906 13.6465 14.7559 13.6465 14.7559L13.6719 15.9297C13.6719 15.9297 13.0391 15.7324 12.2695 15.7227C11.6289 15.7148 10.9395 15.9531 10.9395 15.9531L10.9902 14.7285ZM6.83594 3.07031C6.99609 2.92187 8.53125 1.76953 12.166 1.73828C16.0762 1.70312 17.543 2.83594 17.6348 2.89844C17.7383 2.9668 17.8594 3.2793 17.8086 3.41797C17.7559 3.55664 17.6523 3.60742 17.3594 3.48633C17.0645 3.36523 15.6113 2.30469 12.1152 2.41406C8.75781 2.51758 7.33398 3.53906 7.18359 3.625C7.0625 3.69336 6.83789 3.71094 6.73437 3.57227C6.62891 3.43555 6.73242 3.16797 6.83594 3.07031ZM17.8086 3.88477C17.3594 3.91992 17.6699 7.53711 16.7187 9.80273C15.6992 12.2266 14.3984 12.918 14.4512 13.0566C14.5039 13.1953 15.7773 12.8105 16.5801 11.6719C17.3242 10.6172 17.7734 9.68164 17.9824 8.43555C18.1875 7.18945 18.3086 3.8457 17.8086 3.88477ZM6.74023 4.29883C6.62695 4.29297 6.74219 6.09766 6.55859 6.89062C6.48828 7.19531 6.31641 7.25781 6.29883 7.32617C6.28125 7.39453 6.67578 9.7168 7.33789 10.7363C7.97851 11.7227 9.24219 12.9512 9.44922 12.7441C9.65625 12.5371 8.53125 11.8437 7.77148 10.3379C7.33398 9.47461 6.88867 8.17383 6.87109 6.68555C6.85937 5.70117 6.98242 4.3125 6.74023 4.29883Z"
          fill="#D1701C"
        />
        <path
          d="M16.947 22.0137L16.945 19.2227H7.98603C8.01337 19.2227 7.99189 21.4922 7.98798 22.0234H6.71455V24.0449H18.0915V22.0234L16.947 22.0137Z"
          fill="#865C50"
        />
        <path
          d="M10.8572 20.6895C10.6365 20.6797 10.3826 20.7246 10.3729 20.998C10.3631 21.2715 10.3631 22.0625 10.3631 22.2129C10.3631 22.3633 10.4861 22.4941 10.7947 22.5039C11.1033 22.5137 13.9998 22.5039 14.2029 22.5039C14.4061 22.5039 14.5115 22.3281 14.5193 22.1523C14.5291 21.9766 14.5096 21.2363 14.5096 21.0352C14.5096 20.7012 14.2107 20.7012 14.0076 20.7012C13.7889 20.6973 10.8572 20.6895 10.8572 20.6895Z"
          fill="#FCC219"
        />
      </g>
    </svg>
  );
};

export const ProfileCertTrophyIcon = ({ className = '' }) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M24.28 14.8375C24.835 14.38 28.04 12.3975 29.795 10.7275C31.165 9.4225 31.695 6.015 29.5875 4.3575C26.8475 2.205 24.2175 4.465 24.2175 4.465C24.2175 4.465 23.9875 3.1875 22.3875 2.4375C20.3725 1.4925 17.82 1.14 15.4725 1.17C13.1975 1.1975 11.1025 1.4725 9.2425 2.385C7.5775 3.2025 7.4775 4.3675 7.4775 4.3675C7.4775 4.3675 5.2925 2.28 2.615 3.975C-0.0599999 5.6725 0.7075 9.0725 1.995 10.5C3.6725 12.36 5.6875 13.3075 6.6025 13.9925C7.515 14.6775 8.39 15.33 8.39 15.9175C8.39 16.505 8.13 16.635 8.03 16.6025C7.9325 16.57 7.76 15.9975 7.3125 16.2425C6.7025 16.58 6.8875 17.94 8.16 18.07C9.3925 18.1975 9.6275 16.895 9.6275 16.895L9.8225 15.6225L11.845 17.025L14.0625 18.8525L13.9975 20.4175C13.9975 20.4175 13.9 21.625 13.3125 22.67C12.725 23.715 11.78 24.7575 11.78 24.7575L11.75 25.7025L19.9725 25.5075L19.7125 24.595C19.7125 24.595 18.6525 23.43 18.015 22.18C17.56 21.285 17.4875 20.3825 17.4875 20.3825L17.4675 18.1375L21.735 15.5225C21.735 15.5225 22.1925 15.8825 22.1275 16.0125C22.0625 16.1425 22.0475 17.475 23.0725 17.97C24.085 18.46 24.9 17.84 24.8025 16.99C24.705 16.1425 24.1825 16.435 24.02 16.565C23.8575 16.695 23.4975 16.7275 23.4 16.2375C23.3 15.7525 23.725 15.295 24.28 14.8375ZM3.2725 10.2225L2.295 7.2475L3.4775 5.7L4.8025 5.3125C4.8025 5.3125 6.495 6.575 6.555 6.6775C6.615 6.78 7.635 8.8775 7.635 8.8775L8.98 13.7475L3.2725 10.2225ZM22.4875 14.135C22.5075 14.0325 23.75 8.9175 23.75 8.9175C23.75 8.8575 24.625 8.45 24.625 8.3675C24.625 8.285 26.215 5.6975 26.215 5.6975L28.865 5.8L29.415 8.4275L28.09 10.6075C28.0925 10.61 22.4675 14.235 22.4875 14.135Z"
          fill="#FEC417"
        />
        <path
          d="M29.98 7.66C29.785 5.33 27.48 4.7725 26.5325 5.11C25.585 5.4475 24.97 6.08 24.76 6.98C24.59 7.7075 24.42 8.1925 24.225 8.2675C24.01 8.3475 23.8125 8.315 23.8125 8.315C23.8125 8.315 23.7775 6.74 23.7875 6.105C23.8125 4.795 24.2125 4.46 24.2125 4.46C24.2125 4.46 24.1275 4.0175 23.9575 3.7725C23.7875 3.53 23.4725 3.215 23.4725 3.215C23.4725 3.215 23.545 3.845 23.23 3.9925C22.915 4.14 22.575 3.92 22.575 3.92L22.89 5.23C22.89 5.23 22.38 11.76 22.3325 11.905C22.285 12.05 20.3675 15.375 20.3675 15.375C20.3675 15.375 19.25 16.42 18.7175 16.6625C18.1825 16.905 17.7225 17.5375 15.66 17.56C13.5975 17.585 11.825 15.9575 11.825 15.9575L10.0525 14.2575L8.7425 10.3975L8.5475 6.465L8.63 5.035L8.6875 4.4375L8.595 4.135C8.595 4.135 8.425 4.305 8.11 4.2325C7.795 4.16 7.6725 3.7475 7.6725 3.7475C7.6725 3.7475 7.55 3.9425 7.5275 4.04C7.5025 4.1375 7.4775 4.3625 7.4775 4.3625C7.4775 4.3625 7.8175 4.72 7.89 5.23C7.9625 5.74 7.865 7.8525 7.5025 7.8025C7.1375 7.755 7.2575 5.9825 5.875 5.3025C4.6775 4.7125 2.89 4.89 2.16 6.37C1.4325 7.85 1.965 9.5975 4.2475 11.225C6.53 12.8525 8.96 14.22 9.345 15.525C9.805 17.0775 8.7625 18 8.7625 18C8.7625 18 9.52 17.895 9.8925 17.0825C10.0125 16.82 10.0575 16.4375 10.075 16.21C10.9375 17.335 12.085 18.2875 13.605 18.7475C14.18 18.945 14.8275 19.045 15.7275 19.045C15.8575 19.045 15.985 19.04 16.1125 19.035C17.165 18.9975 18.065 18.8 18.9375 18.3675C20.115 17.8225 21.0275 16.99 21.7325 16.045C21.7125 16.27 21.85 16.83 22.1125 17.2725C22.5725 18.05 23.35 18.0975 23.35 18.0975C23.35 18.0975 22.2825 17.4675 22.5 15.9625C22.7175 14.4575 23.7125 13.9225 25.2175 12.9525C26.7275 11.98 30.1725 9.99 29.98 7.66ZM5.3175 10.9625C4.64 10.485 3.4525 9.8475 2.9625 8.875C2.31 7.5775 2.84 6.01 4.08 5.8175C6.655 5.4125 6.7025 8.61 6.8725 8.9975C7.0425 9.385 7.5275 9.41 7.5275 9.41C7.5275 9.41 7.545 9.625 7.615 10.04C7.6175 10.0525 7.62 10.0625 7.62 10.075L7.6275 10.1125C7.675 10.395 7.7425 10.7475 7.8375 11.15L7.845 11.18C7.8975 11.4075 7.9525 11.6225 8.01 11.82C8.125 12.235 8.265 12.6825 8.4375 13.1425C8.1875 12.9725 6.755 11.98 5.3175 10.9625ZM28.645 9.165C28.1075 10.035 27.02 10.6825 26.2175 11.2275C25.1825 11.93 23.6425 12.985 23.2075 13.28C23.3075 13.015 23.395 12.7525 23.475 12.495C23.605 12.155 23.7425 11.74 23.8375 11.2925C24.0875 10.1175 24.13 9.09 24.13 9.09C24.13 9.09 24.64 9.235 24.955 8.895C25.27 8.555 25.3875 7.5 25.6825 7.0025C26.1425 6.225 27.065 5.425 28.45 6.395C29.25 6.9575 29.28 8.135 28.645 9.165ZM15.13 19.8275L16.5425 19.81C16.5425 19.81 16.58 21.3525 16.8025 22.5025C17.025 23.655 17.3225 24.935 17.3225 24.935C17.3225 24.935 14.445 25.9 14.4625 24.86C14.48 23.82 14.9075 21.795 14.9075 21.795C14.9075 21.795 15.1675 19.3825 15.13 19.8275Z"
          fill="#FFA828"
        />
        <path
          d="M12.7598 3.7975C12.7598 3.7975 14.3323 3.62 15.7948 3.6425C17.2573 3.665 18.7623 3.9525 18.7623 3.9525C18.7623 3.9525 18.6748 8.8475 18.4073 11.595C18.1423 14.3425 17.1023 16.4 16.8248 16.9825C16.5573 17.5475 16.3623 17.85 16.3623 17.85L14.9523 17.685L12.5148 12.79L12.7598 3.7975Z"
          fill="#FFA828"
        />
        <path
          d="M10.8771 4.53C10.8771 4.53 11.3196 4.3075 11.9621 4.065C12.5446 3.845 13.0696 3.7775 13.0696 3.7775C13.0696 3.7775 13.0846 7.0225 13.1371 9.3375C13.1821 11.31 13.9121 14.5425 14.2671 15.4075C14.6221 16.2725 15.2621 17.5925 15.2621 17.5925C15.2621 17.5925 13.9746 17.4075 13.1821 16.4025C12.7646 15.8725 10.8121 11.7725 10.7446 9.07C10.6771 6.3675 10.9421 4.4625 10.8771 4.53Z"
          fill="#FFEFAB"
        />
        <path
          d="M10.145 4.905C10.1 5.0375 9.7475 7.83 10.3 10.42C10.8525 13.01 11.67 14.7825 12.21 15.485C12.69 16.1075 13.0025 16.4025 13.18 16.4025C13.3575 16.4025 12.45 14.255 12.0275 12.57C11.6075 10.8875 11.385 8.87 11.34 7.875C11.295 6.8775 11.2525 4.3075 11.2525 4.3075C11.2525 4.3075 10.765 4.53 10.655 4.595C10.545 4.6625 10.145 4.905 10.145 4.905Z"
          fill="#FFFCFD"
        />
        <path
          d="M13.335 24.7525C13.335 24.7525 14.2875 23.2025 14.4875 22.0275C14.6875 20.8525 14.7975 19.8125 14.7975 19.8125L15.3875 19.8375C15.3875 19.8375 15.33 21.54 15.2625 22.6925C15.195 23.845 14.9975 24.975 14.9975 24.975L13.335 24.7525Z"
          fill="#FFEFAB"
        />
        <path
          d="M14.0675 18.8525C14.0675 18.8525 14.51 18.42 15.7275 18.42C16.945 18.42 17.4675 18.8875 17.4675 18.8875L17.5 20.39C17.5 20.39 16.69 20.1375 15.705 20.125C14.885 20.115 14.0025 20.42 14.0025 20.42L14.0675 18.8525ZM8.75 3.93C8.955 3.74 10.92 2.265 15.5725 2.225C20.5775 2.18 22.455 3.63 22.5725 3.71C22.705 3.7975 22.86 4.1975 22.795 4.375C22.7275 4.5525 22.595 4.6175 22.22 4.4625C21.8425 4.3075 19.9825 2.95 15.5075 3.09C11.21 3.2225 9.3875 4.53 9.195 4.64C9.04 4.7275 8.7525 4.75 8.62 4.5725C8.485 4.3975 8.6175 4.055 8.75 3.93ZM22.795 4.9725C22.22 5.0175 22.6175 9.6475 21.4 12.5475C20.095 15.65 18.43 16.535 18.4975 16.7125C18.565 16.89 20.195 16.3975 21.2225 14.94C22.175 13.59 22.75 12.3925 23.0175 10.7975C23.28 9.2025 23.435 4.9225 22.795 4.9725ZM8.6275 5.5025C8.4825 5.495 8.63 7.805 8.395 8.82C8.305 9.21 8.085 9.29 8.0625 9.3775C8.04 9.465 8.545 12.4375 9.3925 13.7425C10.2125 15.005 11.83 16.5775 12.095 16.3125C12.36 16.0475 10.92 15.16 9.9475 13.2325C9.3875 12.1275 8.8175 10.4625 8.795 8.5575C8.78 7.2975 8.9375 5.52 8.6275 5.5025Z"
          fill="#D1701C"
        />
        <path
          d="M21.6921 28.1775L21.6896 24.605H10.2221C10.2571 24.605 10.2296 27.51 10.2246 28.19H8.59462V30.7775H23.1571V28.19L21.6921 28.1775Z"
          fill="#865C50"
        />
        <path
          d="M13.8973 26.4825C13.6148 26.47 13.2898 26.5275 13.2773 26.8775C13.2648 27.2275 13.2648 28.24 13.2648 28.4325C13.2648 28.625 13.4223 28.7925 13.8173 28.805C14.2123 28.8175 17.9198 28.805 18.1798 28.805C18.4398 28.805 18.5748 28.58 18.5848 28.355C18.5973 28.13 18.5723 27.1825 18.5723 26.925C18.5723 26.4975 18.1898 26.4975 17.9298 26.4975C17.6498 26.4925 13.8973 26.4825 13.8973 26.4825Z"
          fill="#FCC219"
        />
      </g>
    </svg>
  );
};

export const ProfileBadgeBulbIcon = ({ className = '' }) => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M5 8.75C5 4.60786 8.35786 1.25 12.5 1.25C16.6421 1.25 20 4.60786 20 8.75V9.36602C20 11.8326 18.7672 14.1361 16.7149 15.5043C16.4245 15.6979 16.25 16.0239 16.25 16.373V18.3525C16.25 19.2624 15.5124 20 14.6025 20H10.3975C9.48762 20 8.75 19.2624 8.75 18.3525V16.373C8.75 16.0239 8.57555 15.6979 8.28512 15.5043C6.23276 14.1361 5 11.8326 5 9.36602V8.75ZM12.5 3.125C9.3934 3.125 6.875 5.6434 6.875 8.75V9.36602C6.875 11.2057 7.79444 12.9237 9.32518 13.9442C10.1372 14.4856 10.625 15.397 10.625 16.373V18.125H14.375V16.373C14.375 15.397 14.8628 14.4856 15.6748 13.9442C17.2056 12.9237 18.125 11.2057 18.125 9.36602V8.75C18.125 5.6434 15.6066 3.125 12.5 3.125ZM10 22.8125C10 22.2947 10.4197 21.875 10.9375 21.875H14.0625C14.5803 21.875 15 22.2947 15 22.8125C15 23.3303 14.5803 23.75 14.0625 23.75H10.9375C10.4197 23.75 10 23.3303 10 22.8125Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#1C2A21"
        />
      </g>
    </svg>
  );
};

export const ProfileLineChartIllustration = ({ className = '' }) => {
  return (
    <svg
      width="234.001"
      height="96.0006"
      viewBox="0 0 234.001 96.0006"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2.00038 94.0002L46.0004 70.0002L86.0004 78.0002L126 38.0002L166 46.0002L232 2.00021"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#7C3AED"
      />
    </svg>
  );
};

export const ProfileDotSmallAIcon = ({ className = '' }) => {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle opacity="0.6" cx="4" cy="4" r="4" fill="#1C2A21" />
    </svg>
  );
};

export const ProfileDotSmallBIcon = ({ className = '' }) => {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle opacity="0.8" cx="4" cy="4" r="4" fill="#C8951A" />
    </svg>
  );
};

export const ProfileDotLargeAIcon = ({ className = '' }) => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle opacity="0.8" cx="7.5" cy="7.5" r="7.5" fill="#C8951A" />
    </svg>
  );
};

export const ProfileDotLargeBIcon = ({ className = '' }) => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle opacity="0.6" cx="7.5" cy="7.5" r="7.5" fill="#1C2A21" />
    </svg>
  );
};

export const ProfilePinSolidIcon = ({ className = '' }) => {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M4.88118 0.65H8.11882C8.34015 0.64999 8.53485 0.649981 8.69398 0.662886C8.8604 0.676381 9.04037 0.706875 9.21084 0.800035C9.45381 0.932813 9.64647 1.14724 9.74321 1.41204C9.81294 1.6029 9.80692 1.78928 9.78587 1.95064C9.76612 2.10212 9.72508 2.28243 9.68009 2.48008L9.39586 3.72928C9.34081 3.97122 9.32895 4.03213 9.32684 4.08876C9.32463 4.1482 9.32983 4.2078 9.34245 4.2665C9.35454 4.3228 9.37722 4.38196 9.47361 4.61235L10.7566 7.67913C10.8487 7.89921 10.931 8.09576 10.9821 8.26095C11.0352 8.43254 11.0784 8.63949 11.0268 8.86053C10.9565 9.16174 10.764 9.41423 10.5051 9.57186C10.3203 9.6844 10.117 9.71942 9.9321 9.73492C9.75198 9.75002 9.5283 9.75001 9.27016 9.75H6.9875V11.8625C6.9875 12.1317 6.76924 12.35 6.5 12.35C6.23076 12.35 6.0125 12.1317 6.0125 11.8625V9.75H3.72984C3.4717 9.75001 3.24802 9.75002 3.0679 9.73492C2.88301 9.71942 2.67974 9.6844 2.49491 9.57186C2.23603 9.41423 2.04353 9.16174 1.97322 8.86053C1.92163 8.63949 1.96479 8.43254 2.01791 8.26095C2.06904 8.09576 2.15128 7.89922 2.24337 7.67915L3.5264 4.61235C3.62278 4.38196 3.64546 4.3228 3.65756 4.2665C3.67017 4.2078 3.67537 4.1482 3.67316 4.08876C3.67105 4.03213 3.65919 3.97122 3.60414 3.72928L3.32442 2.49991C3.32291 2.49328 3.32141 2.48666 3.31991 2.48007C3.27492 2.28242 3.23388 2.10212 3.21413 1.95064C3.19309 1.78928 3.18706 1.6029 3.25679 1.41204C3.35353 1.14724 3.54619 0.932813 3.78916 0.800035C3.95963 0.706875 4.1396 0.676381 4.30602 0.662886C4.46515 0.649981 4.65985 0.64999 4.88118 0.65ZM4.25671 1.65562C4.25664 1.65566 4.25679 1.65557 4.25671 1.65562C4.26071 1.65384 4.29043 1.64235 4.38482 1.6347C4.49974 1.62538 4.65434 1.625 4.89966 1.625H8.10035C8.34566 1.625 8.50027 1.62538 8.61518 1.6347C8.70959 1.64235 8.73954 1.65397 8.74352 1.65574C8.78686 1.67949 8.81241 1.71126 8.82473 1.73988C8.82529 1.74923 8.8256 1.77443 8.81906 1.82457C8.80599 1.92482 8.77585 2.05958 8.72488 2.28359L8.44516 3.51297C8.44252 3.52456 8.43991 3.53601 8.43733 3.54733C8.39375 3.73842 8.35845 3.89316 8.35252 4.05248C8.34728 4.19311 8.35963 4.33371 8.38921 4.47136C8.42267 4.62708 8.48415 4.77381 8.5605 4.95605C8.565 4.96679 8.56955 4.97765 8.57415 4.98865L9.84871 8.03521C9.95189 8.28185 10.0152 8.43449 10.0507 8.54928C10.0686 8.60696 10.0733 8.63711 10.0745 8.64876C10.065 8.67811 10.0421 8.71184 9.99928 8.73832C9.9948 8.74026 9.95968 8.75418 9.85064 8.76333C9.71625 8.77459 9.53404 8.775 9.25024 8.775H3.74976C3.46597 8.775 3.28375 8.77459 3.14936 8.76333C3.04031 8.75418 3.0052 8.74026 3.00072 8.73832C2.95787 8.71184 2.93499 8.67811 2.92546 8.64876C2.92672 8.63711 2.93144 8.60696 2.9493 8.54928C2.98483 8.43449 3.04811 8.28185 3.15129 8.03522L4.42585 4.98865C4.43045 4.97765 4.435 4.96679 4.4395 4.95605C4.51585 4.77381 4.57733 4.62708 4.61079 4.47136C4.64037 4.33371 4.65272 4.19311 4.64748 4.05248C4.64155 3.89316 4.60625 3.73842 4.56267 3.54734C4.56009 3.53601 4.55748 3.52456 4.55484 3.51297L4.27512 2.2836C4.22415 2.05958 4.19402 1.92482 4.18094 1.82457C4.1744 1.77443 4.17471 1.74923 4.17527 1.73988C4.18759 1.71126 4.21337 1.67936 4.25671 1.65562ZM4.17527 1.73988C4.17545 1.73682 4.17566 1.73545 4.17567 1.73547C4.17569 1.73549 4.17508 1.73979 4.17258 1.74663C4.17339 1.74441 4.17429 1.74215 4.17527 1.73988ZM2.92546 8.64876C2.92437 8.64541 2.92345 8.64212 2.9227 8.63891C2.92497 8.64864 2.92495 8.65459 2.92498 8.65459C2.92499 8.65459 2.92502 8.65277 2.92546 8.64876ZM3.00072 8.73832C3.00072 8.73832 3.00037 8.73817 3.00072 8.73832C3.00072 8.73832 3.00085 8.7384 3.00198 8.73909C3.00156 8.73883 3.00114 8.73857 3.00072 8.73832ZM9.99928 8.73832C9.99886 8.73858 9.99844 8.73883 9.99802 8.73909C9.99915 8.7384 9.99928 8.73832 9.99928 8.73832ZM10.0745 8.64876C10.075 8.65277 10.075 8.65459 10.075 8.65459C10.075 8.65459 10.075 8.64864 10.0773 8.63891C10.0765 8.64212 10.0756 8.64541 10.0745 8.64876ZM8.82473 1.73988C8.82571 1.74215 8.82661 1.7444 8.82742 1.74663C8.82492 1.73979 8.82431 1.73549 8.82433 1.73547C8.82434 1.73545 8.82455 1.73682 8.82473 1.73988ZM8.74352 1.65574C8.74353 1.65574 8.74386 1.65589 8.74352 1.65574Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#1C2A21"
        />
      </g>
    </svg>
  );
};

export const ProfileLinkIcon = ({ className = '' }) => {
  const uid = useId();
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g clipPath={`url(#${uid}clip0_8654_88053)`}>
        <path
          d="M10.0833 1.75258C10.0324 1.75015 9.96891 1.75 9.80515 1.75C9.73353 1.75 9.70625 1.75003 9.68061 1.75065C9.11488 1.76412 8.57447 1.98797 8.1649 2.37847C8.14636 2.39616 8.12699 2.41547 8.07638 2.46609L6.49623 4.04623C6.38046 4.16201 6.33568 4.207 6.30134 4.24477C5.51262 5.11247 5.51262 6.43753 6.30134 7.30523C6.33568 7.343 6.38047 7.38801 6.49623 7.50377L6.67123 7.67877C6.87626 7.88379 6.87626 8.21621 6.67123 8.42123C6.46621 8.62626 6.13379 8.62626 5.92877 8.42123L5.7424 8.23486C5.64179 8.13426 5.57778 8.07025 5.52437 8.01149C4.37161 6.74331 4.37161 4.80669 5.52437 3.53851C5.57778 3.47974 5.64178 3.41575 5.7424 3.31514L7.33392 1.72362L7.3388 1.71874C7.38307 1.67447 7.41167 1.64587 7.44034 1.61854C8.03893 1.0478 8.82876 0.720644 9.6556 0.700943C9.69527 0.699998 9.7357 0.699999 9.79853 0.7L9.82132 0.7C9.96359 0.699995 10.054 0.699991 10.1334 0.703773C11.8452 0.785392 13.2146 2.15479 13.2962 3.86665C13.3 3.94598 13.3 4.03644 13.3 4.17874V4.20147C13.3 4.2643 13.3 4.30473 13.2991 4.3444C13.2794 5.17124 12.9522 5.96107 12.3815 6.55966C12.3541 6.58837 12.3255 6.61696 12.2811 6.66135L12.2764 6.66608L11.3962 7.54623C11.1912 7.75126 10.8588 7.75126 10.6538 7.54623C10.4487 7.34121 10.4487 7.00879 10.6538 6.80377L11.5339 5.92362C11.5845 5.87299 11.6038 5.85365 11.6215 5.8351C12.012 5.42553 12.2359 4.88513 12.2494 4.31939C12.25 4.29375 12.25 4.26647 12.25 4.19485C12.25 4.03109 12.2499 3.96765 12.2474 3.91665C12.1916 2.74538 11.2546 1.80843 10.0833 1.75258ZM7.32877 6.32123C7.12374 6.11621 7.12374 5.78379 7.32877 5.57877C7.53379 5.37374 7.86621 5.37374 8.07123 5.57877L8.25763 5.76517C8.35822 5.86575 8.42223 5.92975 8.47564 5.98851C9.62839 7.25669 9.62839 9.19331 8.47564 10.4615C8.42222 10.5203 8.35823 10.5842 8.25761 10.6849L6.66608 12.2764L6.66114 12.2813C6.61691 12.3256 6.58832 12.3541 6.55967 12.3815C5.96107 12.9522 5.17124 13.2794 4.3444 13.2991C4.30473 13.3 4.2643 13.3 4.20147 13.3H4.17874C4.03644 13.3 3.94598 13.3 3.86665 13.2962C2.15479 13.2146 0.785392 11.8452 0.703774 10.1334C0.699992 10.054 0.699995 9.96359 0.7 9.82132L0.700001 9.79853C0.7 9.7357 0.699999 9.69527 0.700944 9.6556C0.720644 8.82875 1.0478 8.03893 1.61854 7.44034C1.64592 7.41162 1.67453 7.38301 1.71894 7.3386L2.60377 6.45377C2.80879 6.24874 3.14121 6.24874 3.34623 6.45377C3.55126 6.65879 3.55126 6.99121 3.34623 7.19623L2.46608 8.07638C2.41545 8.12701 2.39616 8.14635 2.37847 8.1649C1.98797 8.57447 1.76413 9.11487 1.75065 9.68061C1.75004 9.70624 1.75 9.73353 1.75 9.80515C1.75 9.96891 1.75015 10.0324 1.75258 10.0833C1.80843 11.2546 2.74538 12.1916 3.91666 12.2474C3.96765 12.2498 4.0311 12.25 4.19485 12.25C4.26647 12.25 4.29375 12.25 4.31939 12.2494C4.88513 12.2359 5.42553 12.012 5.8351 11.6215C5.85365 11.6038 5.87301 11.5845 5.92363 11.5339L7.50377 9.95377C7.61955 9.838 7.66432 9.793 7.69866 9.75523C8.48738 8.88753 8.48738 7.56247 7.69866 6.69477C7.66433 6.657 7.61953 6.61199 7.50377 6.49623L7.32877 6.32123Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#2D5D33"
        />
      </g>
      <defs>
        <clipPath id={`${uid}clip0_8654_88053`}>
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const ProfileFileIcon = ({ className = '' }) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M4.025 1.75C3.54175 1.75 3.15 2.14175 3.15 2.625V11.375C3.15 11.8582 3.54175 12.25 4.025 12.25H9.975C10.4582 12.25 10.85 11.8582 10.85 11.375V5.25H7.875C7.58505 5.25 7.35 5.01495 7.35 4.725V1.75H4.025ZM8.4 2.49246L10.1075 4.2H8.4V2.49246ZM2.1 2.625C2.1 1.56185 2.96185 0.7 4.025 0.7H7.875C8.01424 0.7 8.14777 0.755312 8.24623 0.853769L11.7462 4.35377C11.8447 4.45223 11.9 4.58576 11.9 4.725V11.375C11.9 12.4381 11.0381 13.3 9.975 13.3H4.025C2.96185 13.3 2.1 12.4381 2.1 11.375V2.625Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#2D5D33"
        />
      </g>
    </svg>
  );
};

export const ProfileEyeIcon = ({ className = '' }) => {
  return (
    <svg
      width="14"
      height="13.3"
      viewBox="0 0 14 13.3"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M4.36816 4.85447C3.58364 5.51299 2.96575 6.29804 2.61787 6.78694C2.56121 6.86656 2.53461 6.90457 2.5168 6.93476C2.50568 6.95363 2.50356 6.96026 2.5024 6.96478C2.50226 6.96558 2.50183 6.96809 2.50137 6.9724C2.50057 6.97979 2.5 6.98934 2.5 7C2.5 7.01066 2.50057 7.02021 2.50137 7.0276C2.50183 7.03191 2.50226 7.03442 2.5024 7.03522C2.50356 7.03974 2.50568 7.04637 2.5168 7.06524C2.53461 7.09543 2.56121 7.13344 2.61787 7.21306C2.96575 7.70196 3.58364 8.48701 4.36816 9.14553C5.15962 9.80988 6.06635 10.3 7 10.3C7.93365 10.3 8.84038 9.80988 9.63185 9.14553C10.4164 8.48701 11.0343 7.70196 11.3821 7.21306C11.4388 7.13344 11.4654 7.09543 11.4832 7.06524C11.4943 7.04637 11.4964 7.03974 11.4976 7.03521C11.4977 7.03442 11.4982 7.03191 11.4986 7.0276C11.4994 7.02021 11.5 7.01066 11.5 7C11.5 6.98934 11.4994 6.97979 11.4986 6.9724C11.4982 6.96809 11.4977 6.96558 11.4976 6.96479C11.4964 6.96026 11.4943 6.95363 11.4832 6.93476C11.4654 6.90457 11.4388 6.86656 11.3821 6.78694C11.0343 6.29804 10.4164 5.51299 9.63185 4.85447C8.84038 4.19012 7.93365 3.7 7 3.7C6.06635 3.7 5.15962 4.19012 4.36816 4.85447ZM3.78953 4.16513C4.6491 3.44361 5.75793 2.8 7 2.8C8.24207 2.8 9.3509 3.44361 10.2105 4.16513C11.077 4.89248 11.7456 5.74545 12.1154 6.26514C12.1215 6.27367 12.1276 6.28226 12.1338 6.29092C12.2227 6.41521 12.3219 6.55387 12.3703 6.74495C12.4099 6.90079 12.4099 7.09921 12.3703 7.25505C12.3219 7.44613 12.2227 7.58479 12.1338 7.70908C12.1276 7.71774 12.1215 7.72633 12.1154 7.73486C11.7456 8.25455 11.077 9.10752 10.2105 9.83487C9.3509 10.5564 8.24207 11.2 7 11.2C5.75793 11.2 4.6491 10.5564 3.78953 9.83487C2.923 9.10752 2.25436 8.25455 1.88457 7.73486C1.8785 7.72633 1.87236 7.71774 1.86617 7.70908C1.77729 7.58479 1.67814 7.44613 1.62966 7.25505C1.59012 7.09921 1.59012 6.90079 1.62966 6.74495C1.67814 6.55387 1.77729 6.41521 1.86617 6.29092C1.87236 6.28226 1.8785 6.27367 1.88457 6.26514C2.25436 5.74545 2.923 4.89248 3.78953 4.16513ZM7 6.1C6.50294 6.1 6.1 6.50294 6.1 7C6.1 7.49706 6.50294 7.9 7 7.9C7.49706 7.9 7.9 7.49706 7.9 7C7.9 6.50294 7.49706 6.1 7 6.1ZM5.2 7C5.2 6.00589 6.00589 5.2 7 5.2C7.99411 5.2 8.8 6.00589 8.8 7C8.8 7.99411 7.99411 8.8 7 8.8C6.00589 8.8 5.2 7.99411 5.2 7Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#737373"
        />
      </g>
    </svg>
  );
};

export const ProfileNoteIcon = ({ className = '' }) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path
          d="M5.82878 6.02778H7.87045M5.82878 3.69444H9.91212"
          strokeWidth="0.777778"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#2D5D33"
        />
        <path
          d="M3.49544 3.11111H1.74544M3.49544 6.61111H1.74544M3.49544 10.1111H1.74544"
          strokeWidth="0.777778"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#2D5D33"
        />
        <path
          d="M5.24544 12.4087C4.32306 12.349 3.7318 12.1889 3.30386 11.761C2.62044 11.0776 2.62044 9.97764 2.62044 7.77778V5.44444C2.62044 3.24456 2.62044 2.14462 3.30386 1.4612C3.98727 0.777778 5.08722 0.777778 7.28712 0.777778H7.57878C9.77865 0.777778 10.8786 0.777778 11.562 1.46119C12.2454 2.14462 12.2454 3.24456 12.2454 5.44444V5.73611"
          strokeWidth="0.777778"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#2D5D33"
        />
        <path
          d="M11.5827 8.03402L11.9882 8.43792C12.3312 8.77958 12.3312 9.33363 11.9882 9.67529L9.86377 11.8311C9.69665 11.9975 9.48286 12.1097 9.25057 12.1529L7.93393 12.4376C7.72603 12.4825 7.54094 12.2987 7.58545 12.0915L7.86574 10.7876C7.90908 10.5562 8.02178 10.3433 8.18891 10.1769L10.3403 8.03402C10.6834 7.69236 11.2396 7.69236 11.5827 8.03402Z"
          strokeWidth="0.777778"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#2D5D33"
        />
      </g>
    </svg>
  );
};

export const ProfileTraitThumbIcon = ({ className = '' }) => {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M21.25 11C21.25 16.6609 16.6609 21.25 11 21.25C5.33908 21.25 0.75 16.6609 0.75 11C0.75 5.33908 5.33908 0.75 11 0.75C16.6609 0.75 21.25 5.33908 21.25 11Z"
        fill="#FFD86B"
        strokeWidth="1.5"
        stroke="#1C2A21"
      />
    </svg>
  );
};

export const ProfileEditButtonIcon = ({ className = '' }) => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 34 34"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <rect x="0.5" y="0.5" width="33" height="33" rx="9.5" fill="white" />
    <rect x="0.5" y="0.5" width="33" height="33" rx="9.5" stroke="#E6E6E6" />
    <path d="M20 11L23 14M11 20V23H14L22 15L19 12L11 20Z" strokeWidth="1.4" stroke="#1C2A21" />
  </svg>
);

// ---- Talent profile · edit & preview ----

export const ProfileSpotAboutIllustration = ({ className = '' }) => (
  <svg
    width="104"
    height="104"
    viewBox="0 0 104 104"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M11.7 54.6C9.1 32.5 27.3 13 50.7 11.7C74.1 10.4 93.6 27.3 92.3 52C91 76.7 72.8 93.6 49.4 91C27.3 88.4 14.3 75.4 11.7 54.6Z"
        fill="#FAF4E8"
      />
      <path
        d="M55.9 19.5H48.1C46.6641 19.5 45.5 20.6641 45.5 22.1V27.3C45.5 28.7359 46.6641 29.9 48.1 29.9H55.9C57.3359 29.9 58.5 28.7359 58.5 27.3V22.1C58.5 20.6641 57.3359 19.5 55.9 19.5Z"
        fill="#387440"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M83.2 31.2H26C22.4101 31.2 19.5 34.1101 19.5 37.7V75.4C19.5 78.9899 22.4101 81.9 26 81.9H83.2C86.7898 81.9 89.7 78.9899 89.7 75.4V37.7C89.7 34.1101 86.7898 31.2 83.2 31.2Z"
        fill="#1C2A21"
      />
      <path
        d="M80.6 28.6H23.4C19.8101 28.6 16.9 31.5101 16.9 35.1V72.8C16.9 76.3899 19.8101 79.3 23.4 79.3H80.6C84.1898 79.3 87.1 76.3899 87.1 72.8V35.1C87.1 31.5101 84.1898 28.6 80.6 28.6Z"
        fill="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M37.7 58.5C42.7258 58.5 46.8 54.4258 46.8 49.4C46.8 44.3742 42.7258 40.3 37.7 40.3C32.6742 40.3 28.6 44.3742 28.6 49.4C28.6 54.4258 32.6742 58.5 37.7 58.5Z"
        fill="#F3C84B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M26 70.2C27.3 61.1 48.1 61.1 49.4 70.2H26Z"
        fill="#387440"
        strokeWidth="3"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M57.2 45.5H78M57.2 53.3H72.8"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M71.825 61.1H60.775C58.8006 61.1 57.2 62.7006 57.2 64.675C57.2 66.6494 58.8006 68.25 60.775 68.25H71.825C73.7994 68.25 75.4 66.6494 75.4 64.675C75.4 62.7006 73.7994 61.1 71.825 61.1Z"
        fill="#387440"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M81.9 16.25C82.602 21.398 82.602 21.398 87.75 22.1C82.602 22.802 82.602 22.802 81.9 27.95C81.198 22.802 81.198 22.802 76.05 22.1C81.198 21.398 81.198 21.398 81.9 16.25Z"
        fill="#C8951A"
      />
      <path
        d="M20.8 26C21.268 29.432 21.268 29.432 24.7 29.9C21.268 30.368 21.268 30.368 20.8 33.8C20.332 30.368 20.332 30.368 16.9 29.9C20.332 29.432 20.332 29.432 20.8 26Z"
        fill="#387440"
      />
      <path
        d="M14.3 84.5C16.9 81.0333 19.5 81.0333 22.1 84.5C24.7 87.9667 27.3 87.9667 29.9 84.5"
        strokeWidth="3"
        strokeLinecap="round"
        stroke="#C8951A"
      />
      <path
        d="M90.35 80.6C90.35 82.3949 88.8949 83.85 87.1 83.85C85.3051 83.85 83.85 82.3949 83.85 80.6C83.85 78.8051 85.3051 77.35 87.1 77.35C88.8949 77.35 90.35 78.8051 90.35 80.6Z"
        strokeWidth="3"
        stroke="#C8951A"
      />
    </g>
  </svg>
);
export const ProfileSpotSkillsIllustration = ({ className = '' }) => (
  <svg
    width="104"
    height="104"
    viewBox="0 0 104 104"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M11.7 54.6C9.1 32.5 27.3 13 50.7 11.7C74.1 10.4 93.6 27.3 92.3 52C91 76.7 72.8 93.6 49.4 91C27.3 88.4 14.3 75.4 11.7 54.6Z"
        fill="#FAF4E8"
      />
      <path d="M40.3 62.4L31.2 92.3L42.9 87.1L49.4 97.5L57.2 67.6L40.3 62.4Z" fill="#1C2A21" />
      <path
        d="M37.7 59.8L28.6 89.7L40.3 84.5L46.8 94.9L54.6 65L37.7 59.8Z"
        fill="#387440"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path d="M68.9 62.4L78 92.3L66.3 87.1L59.8 97.5L52 67.6L68.9 62.4Z" fill="#1C2A21" />
      <path
        d="M66.3 59.8L75.4 89.7L63.7 84.5L57.2 94.9L49.4 65L66.3 59.8Z"
        fill="#224626"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M32.5 48.1C32.5 53.9613 34.8284 59.5825 38.9729 63.7271C43.1175 67.8716 48.7387 70.2 54.6 70.2C60.4613 70.2 66.0825 67.8716 70.2271 63.7271C74.3716 59.5825 76.7 53.9613 76.7 48.1C76.7 42.2387 74.3716 36.6175 70.2271 32.4729C66.0825 28.3284 60.4613 26 54.6 26C48.7387 26 43.1175 28.3284 38.9729 32.4729C34.8284 36.6175 32.5 42.2387 32.5 48.1Z"
        fill="#1C2A21"
      />
      <path
        d="M29.9 45.5C29.9 51.3613 32.2284 56.9825 36.3729 61.1271C40.5175 65.2716 46.1387 67.6 52 67.6C57.8613 67.6 63.4825 65.2716 67.6271 61.1271C71.7716 56.9825 74.1 51.3613 74.1 45.5C74.1 39.6387 71.7716 34.0175 67.6271 29.8729C63.4825 25.7284 57.8613 23.4 52 23.4C46.1387 23.4 40.5175 25.7284 36.3729 29.8729C32.2284 34.0175 29.9 39.6387 29.9 45.5Z"
        fill="#F3C84B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M67.526 43.9703C67.5749 44.4736 67.6 44.9839 67.6 45.5C67.6 46.0161 67.5749 46.5264 67.526 47.0297M66.2129 39.06C65.7884 38.1246 65.2743 37.2386 64.6815 36.4128M61.0872 32.8185C60.2614 32.2257 59.3754 31.7116 58.44 31.2871M53.5297 29.974C53.0264 29.9251 52.5161 29.9 52 29.9C51.4839 29.9 50.9736 29.9251 50.4703 29.974M45.56 31.2871C44.6246 31.7116 43.7386 32.2257 42.9128 32.8185M39.3185 36.4128C38.7258 37.2386 38.2116 38.1246 37.7871 39.06M36.474 43.9703C36.4251 44.4736 36.4 44.9839 36.4 45.5C36.4 46.0161 36.4251 46.5264 36.474 47.0297M37.7871 51.94C38.2116 52.8754 38.7258 53.7614 39.3185 54.5872M42.9128 58.1815C43.7386 58.7743 44.6246 59.2884 45.56 59.7129M50.4703 61.026C50.9736 61.0749 51.4839 61.1 52 61.1C52.5161 61.1 53.0264 61.0749 53.5297 61.026M58.44 59.7129C59.3754 59.2884 60.2614 58.7743 61.0872 58.1815M64.6815 54.5872C65.2743 53.7614 65.7884 52.8754 66.2129 51.94"
        strokeWidth="3"
        stroke="#1C2A21"
      />
      <path
        d="M52 36.4C53.092 44.408 53.092 44.408 61.1 45.5C53.092 46.592 53.092 46.592 52 54.6C50.908 46.592 50.908 46.592 42.9 45.5C50.908 44.408 50.908 44.408 52 36.4Z"
        fill="#1C2A21"
      />
      <path
        d="M83.2 14.3C83.824 18.876 83.824 18.876 88.4 19.5C83.824 20.124 83.824 20.124 83.2 24.7C82.576 20.124 82.576 20.124 78 19.5C82.576 18.876 82.576 18.876 83.2 14.3Z"
        fill="#387440"
      />
      <path
        d="M19.5 18.85C20.046 22.854 20.046 22.854 24.05 23.4C20.046 23.946 20.046 23.946 19.5 27.95C18.954 23.946 18.954 23.946 14.95 23.4C18.954 22.854 18.954 22.854 19.5 18.85Z"
        fill="#C8951A"
      />
      <path
        d="M90.35 78C90.35 79.7949 88.8949 81.25 87.1 81.25C85.3051 81.25 83.85 79.7949 83.85 78C83.85 76.2051 85.3051 74.75 87.1 74.75C88.8949 74.75 90.35 76.2051 90.35 78Z"
        strokeWidth="3"
        stroke="#C8951A"
      />
    </g>
  </svg>
);
export const ProfileSpotJobsIllustration = ({ className = '' }) => (
  <svg
    width="104"
    height="104"
    viewBox="0 0 104 104"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M11.7 54.6C9.1 32.5 27.3 13 50.7 11.7C74.1 10.4 93.6 27.3 92.3 52C91 76.7 72.8 93.6 49.4 91C27.3 88.4 14.3 75.4 11.7 54.6Z"
        fill="#FAF4E8"
      />
      <path
        d="M40.3 37.7V32.5C40.3 31.4657 40.7109 30.4737 41.4423 29.7423C42.1737 29.0109 43.1657 28.6 44.2 28.6H59.8C60.8343 28.6 61.8263 29.0109 62.5577 29.7423C63.2891 30.4737 63.7 31.4657 63.7 32.5V37.7"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M78 40.3H31.2C27.6101 40.3 24.7 43.2101 24.7 46.8V74.1C24.7 77.6898 27.6101 80.6 31.2 80.6H78C81.5899 80.6 84.5 77.6898 84.5 74.1V46.8C84.5 43.2101 81.5899 40.3 78 40.3Z"
        fill="#1C2A21"
      />
      <path
        d="M75.4 37.7H28.6C25.0101 37.7 22.1 40.6101 22.1 44.2V71.5C22.1 75.0899 25.0101 78 28.6 78H75.4C78.9899 78 81.9 75.0899 81.9 71.5V44.2C81.9 40.6101 78.9899 37.7 75.4 37.7Z"
        fill="#387440"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M22.1 54.6H81.9"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M55.25 50.05H48.75C47.3141 50.05 46.15 51.2141 46.15 52.65V56.55C46.15 57.9859 47.3141 59.15 48.75 59.15H55.25C56.6859 59.15 57.85 57.9859 57.85 56.55V52.65C57.85 51.2141 56.6859 50.05 55.25 50.05Z"
        fill="#F3C84B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M81.9 16.25C82.602 21.398 82.602 21.398 87.75 22.1C82.602 22.802 82.602 22.802 81.9 27.95C81.198 22.802 81.198 22.802 76.05 22.1C81.198 21.398 81.198 21.398 81.9 16.25Z"
        fill="#C8951A"
      />
      <path
        d="M20.8 26C21.268 29.432 21.268 29.432 24.7 29.9C21.268 30.368 21.268 30.368 20.8 33.8C20.332 30.368 20.332 30.368 16.9 29.9C20.332 29.432 20.332 29.432 20.8 26Z"
        fill="#387440"
      />
      <path
        d="M14.3 84.5C16.9 81.0333 19.5 81.0333 22.1 84.5C24.7 87.9667 27.3 87.9667 29.9 84.5"
        strokeWidth="3"
        strokeLinecap="round"
        stroke="#C8951A"
      />
      <path
        d="M90.35 80.6C90.35 82.3949 88.8949 83.85 87.1 83.85C85.3051 83.85 83.85 82.3949 83.85 80.6C83.85 78.8051 85.3051 77.35 87.1 77.35C88.8949 77.35 90.35 78.8051 90.35 80.6Z"
        strokeWidth="3"
        stroke="#C8951A"
      />
    </g>
  </svg>
);
export const ProfileSpotPortfolioIllustration = ({ className = '' }) => (
  <svg
    width="104"
    height="104"
    viewBox="0 0 104 104"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M11.7 54.6C9.1 32.5 27.3 13 50.7 11.7C74.1 10.4 93.6 27.3 92.3 52C91 76.7 72.8 93.6 49.4 91C27.3 88.4 14.3 75.4 11.7 54.6Z"
        fill="#E1EAE2"
      />
      <path
        d="M22.1 36.4C22.1 35.3657 22.5109 34.3737 23.2423 33.6423C23.9737 32.9109 24.9657 32.5 26 32.5H42.9L48.1 39H83.2C84.2343 39 85.2263 39.4109 85.9577 40.1423C86.6891 40.8737 87.1 41.8657 87.1 42.9V78C87.1 79.0343 86.6891 80.0263 85.9577 80.7577C85.2263 81.4891 84.2343 81.9 83.2 81.9H26C24.9657 81.9 23.9737 81.4891 23.2423 80.7577C22.5109 80.0263 22.1 79.0343 22.1 78V36.4Z"
        fill="#1C2A21"
      />
      <path
        d="M19.5 33.8C19.5 32.7657 19.9109 31.7737 20.6423 31.0423C21.3737 30.3109 22.3657 29.9 23.4 29.9H40.3L45.5 36.4H80.6C81.6343 36.4 82.6263 36.8109 83.3577 37.5423C84.0891 38.2737 84.5 39.2657 84.5 40.3V75.4C84.5 76.4343 84.0891 77.4263 83.3577 78.1577C82.6263 78.8891 81.6343 79.3 80.6 79.3H23.4C22.3657 79.3 21.3737 78.8891 20.6423 78.1577C19.9109 77.4263 19.5 76.4343 19.5 75.4V33.8Z"
        fill="#224626"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M67.6 28.6H32.5C31.0641 28.6 29.9 29.7641 29.9 31.2V52C29.9 53.4359 31.0641 54.6 32.5 54.6H67.6C69.0359 54.6 70.2 53.4359 70.2 52V31.2C70.2 29.7641 69.0359 28.6 67.6 28.6Z"
        fill="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path d="M18.2 49.4H91L85.8 81.9H23.4L18.2 49.4Z" fill="#1C2A21" />
      <path
        d="M15.6 46.8H88.4L83.2 79.3H20.8L15.6 46.8Z"
        fill="#F3C84B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M52 55.25C52.858 61.542 52.858 61.542 59.15 62.4C52.858 63.258 52.858 63.258 52 69.55C51.142 63.258 51.142 63.258 44.85 62.4C51.142 61.542 51.142 61.542 52 55.25Z"
        fill="white"
      />
      <path
        d="M81.9 16.25C82.602 21.398 82.602 21.398 87.75 22.1C82.602 22.802 82.602 22.802 81.9 27.95C81.198 22.802 81.198 22.802 76.05 22.1C81.198 21.398 81.198 21.398 81.9 16.25Z"
        fill="#C8951A"
      />
      <path
        d="M20.8 26C21.268 29.432 21.268 29.432 24.7 29.9C21.268 30.368 21.268 30.368 20.8 33.8C20.332 30.368 20.332 30.368 16.9 29.9C20.332 29.432 20.332 29.432 20.8 26Z"
        fill="#387440"
      />
      <path
        d="M14.3 84.5C16.9 81.0333 19.5 81.0333 22.1 84.5C24.7 87.9667 27.3 87.9667 29.9 84.5"
        strokeWidth="3"
        strokeLinecap="round"
        stroke="#C8951A"
      />
      <path
        d="M90.35 80.6C90.35 82.3949 88.8949 83.85 87.1 83.85C85.3051 83.85 83.85 82.3949 83.85 80.6C83.85 78.8051 85.3051 77.35 87.1 77.35C88.8949 77.35 90.35 78.8051 90.35 80.6Z"
        strokeWidth="3"
        stroke="#C8951A"
      />
    </g>
  </svg>
);
export const ProfileEditModalCloseIcon = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M4.21967 4.21967C4.51256 3.92678 4.98744 3.92678 5.28033 4.21967L8 6.93934L10.7197 4.21967C11.0126 3.92678 11.4874 3.92678 11.7803 4.21967C12.0732 4.51256 12.0732 4.98744 11.7803 5.28033L9.06066 8L11.7803 10.7197C12.0732 11.0126 12.0732 11.4874 11.7803 11.7803C11.4874 12.0732 11.0126 12.0732 10.7197 11.7803L8 9.06066L5.28033 11.7803C4.98744 12.0732 4.51256 12.0732 4.21967 11.7803C3.92678 11.4874 3.92678 11.0126 4.21967 10.7197L6.93934 8L4.21967 5.28033C3.92678 4.98744 3.92678 4.51256 4.21967 4.21967Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#595959"
      />
    </g>
  </svg>
);
export const ProfileEditTypeWorkIcon = ({ className = '' }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M1.25 8.75C1.25 6.99444 1.25 6.11663 1.67132 5.48608C1.85372 5.2131 2.0881 4.97872 2.36107 4.79632C2.99163 4.375 3.86943 4.375 5.625 4.375H9.375C11.1306 4.375 12.0084 4.375 12.6389 4.79632C12.9119 4.97872 13.1462 5.2131 13.3287 5.48608C13.75 6.11663 13.75 6.99444 13.75 8.75C13.75 10.5056 13.75 11.3834 13.3287 12.0139C13.1462 12.2869 12.9119 12.5212 12.6389 12.7037C12.0084 13.125 11.1306 13.125 9.375 13.125H5.625C3.86943 13.125 2.99163 13.125 2.36107 12.7037C2.0881 12.5212 1.85372 12.2869 1.67132 12.0139C1.25 11.3834 1.25 10.5056 1.25 8.75Z"
        strokeWidth="0.625"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
      <path
        d="M10 4.375C10 3.19649 10 2.60723 9.63387 2.24112C9.26775 1.875 8.6785 1.875 7.5 1.875C6.3215 1.875 5.73223 1.875 5.36612 2.24112C5 2.60723 5 3.19649 5 4.375"
        strokeWidth="0.625"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
      <path
        d="M3.75 6.875L4.15748 7.00125C6.30319 7.66625 8.69681 7.66625 10.8425 7.00125L11.25 6.875M7.5 7.5V8.75"
        strokeWidth="0.625"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
    </g>
  </svg>
);
export const ProfileEditTypeGradIcon = ({ className = '' }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M1.24919 4.58298C1.24919 5.42172 6.30934 7.70843 7.49147 7.70843C8.67365 7.70843 13.7338 5.42172 13.7338 4.58298C13.7338 3.74424 8.67365 1.45752 7.49147 1.45752C6.30934 1.45752 1.24919 3.74424 1.24919 4.58298Z"
        strokeWidth="0.833333"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
      <path
        d="M3.74512 6.45833L4.52717 10.0835C4.58074 10.3318 4.70439 10.5638 4.9106 10.7117C6.29919 11.7082 8.68175 11.7082 10.0704 10.7117C10.2766 10.5638 10.4002 10.3318 10.4538 10.0835L11.2359 6.45833"
        strokeWidth="0.833333"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
      <path
        d="M12.7988 5.52043V9.89611M12.7988 9.89611C12.3044 10.8002 12.0858 11.2845 11.8637 12.0839C11.8155 12.3684 11.8538 12.5117 12.0495 12.6389C12.1291 12.6906 12.2247 12.709 12.3194 12.709H13.2685C13.3694 12.709 13.4712 12.6879 13.5543 12.6305C13.7363 12.5049 13.7831 12.367 13.7338 12.0839C13.5392 11.3417 13.2912 10.8342 12.7988 9.89611Z"
        strokeWidth="0.833333"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
    </g>
  </svg>
);
export const ProfileEditTypeFlagIcon = ({ className = '' }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path d="M0 5.85938H15V9.14062H0V5.85938Z" fill="#F9CB38" />
      <path
        d="M12.6562 2.34375H2.34375C0.790547 2.34375 0 3.49805 0 4.92188V5.85938H15V4.92188C15 3.49805 14.2095 2.34375 12.6562 2.34375Z"
        fill="#EC1C24"
      />
      <path
        d="M0 10.0781C0 11.502 0.790547 12.6562 2.34375 12.6562H12.6562C14.2095 12.6562 15 11.502 15 10.0781V9.14062H0V10.0781Z"
        fill="#137A08"
      />
      <path
        d="M7.44797 6.05273L7.9043 6.97734L8.925 7.12687L8.18695 7.84687L8.36133 8.86242L7.44797 8.38266L6.53484 8.86242L6.70922 7.84687L5.97094 7.12687L6.99187 6.97734L7.44797 6.05273Z"
        fill="#25333A"
      />
    </g>
  </svg>
);
export const ProfileEditTypeUsersIcon = ({ className = '' }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M5.25 1.875C4.21447 1.875 3.375 2.71447 3.375 3.75C3.375 4.78553 4.21447 5.625 5.25 5.625C6.28553 5.625 7.125 4.78553 7.125 3.75C7.125 2.71447 6.28553 1.875 5.25 1.875ZM2.25 3.75C2.25 2.09315 3.59315 0.75 5.25 0.75C6.90685 0.75 8.25 2.09315 8.25 3.75C8.25 5.40685 6.90685 6.75 5.25 6.75C3.59315 6.75 2.25 5.40685 2.25 3.75ZM9.1875 1.3125C9.1875 1.00184 9.43934 0.75 9.75 0.75C11.4069 0.75 12.75 2.09315 12.75 3.75C12.75 5.40685 11.4069 6.75 9.75 6.75C9.43934 6.75 9.1875 6.49816 9.1875 6.1875C9.1875 5.87684 9.43934 5.625 9.75 5.625C10.7855 5.625 11.625 4.78553 11.625 3.75C11.625 2.71447 10.7855 1.875 9.75 1.875C9.43934 1.875 9.1875 1.62316 9.1875 1.3125ZM0.75 12.4688C0.75 10.1388 2.6388 8.25 4.96875 8.25H5.53125C7.8612 8.25 9.75 10.1388 9.75 12.4688C9.75 13.4525 8.95251 14.25 7.96875 14.25H2.53125C1.54749 14.25 0.75 13.4525 0.75 12.4688ZM4.96875 9.375C3.26012 9.375 1.875 10.7601 1.875 12.4688C1.875 12.8312 2.16881 13.125 2.53125 13.125H7.96875C8.33119 13.125 8.625 12.8312 8.625 12.4688C8.625 10.7601 7.23988 9.375 5.53125 9.375H4.96875ZM9.375 8.8125C9.375 8.50184 9.62684 8.25 9.9375 8.25H10.0312C12.3612 8.25 14.25 10.1388 14.25 12.4688C14.25 13.4525 13.4525 14.25 12.4688 14.25H11.25C10.9393 14.25 10.6875 13.9982 10.6875 13.6875C10.6875 13.3768 10.9393 13.125 11.25 13.125H12.4688C12.8312 13.125 13.125 12.8312 13.125 12.4688C13.125 10.7601 11.7399 9.375 10.0312 9.375H9.9375C9.62684 9.375 9.375 9.12316 9.375 8.8125Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
      />
    </g>
  </svg>
);
export const ProfileEditTypeBoltIcon = ({ className = '' }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M8.4461 0.785291C8.68739 0.875042 8.83695 1.11714 8.80923 1.37308L8.38923 5.25H12.1875C12.3949 5.25 12.5856 5.36418 12.6834 5.54708C12.7813 5.72998 12.7706 5.95191 12.6555 6.12452L7.40553 13.9995C7.26322 14.213 6.9945 14.3031 6.75226 14.2186C6.51002 14.1341 6.35564 13.8965 6.37694 13.6408L6.70118 9.75H2.8125C2.60341 9.75 2.41157 9.63402 2.31441 9.44887C2.21725 9.26372 2.23082 9.03996 2.34962 8.86789L7.78712 0.992893C7.93339 0.781047 8.20482 0.69554 8.4461 0.785291ZM3.88445 8.625H7.3125C7.4698 8.625 7.61992 8.69087 7.72643 8.80663C7.83295 8.92238 7.88612 9.07745 7.87306 9.23421L7.67916 11.5609L11.1365 6.375H7.7625C7.60277 6.375 7.45057 6.30709 7.34388 6.18822C7.23719 6.06935 7.18607 5.91072 7.20327 5.75192L7.45171 3.45863L3.88445 8.625Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
      />
    </g>
  </svg>
);
export const ProfileEditOrgHintIcon = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M8.0742 2.01164C8.02595 1.99612 7.97405 1.99612 7.9258 2.01164C7.91982 2.01441 7.89335 2.02856 7.83466 2.07839C7.75025 2.15005 7.6451 2.25454 7.47132 2.42832L2.42832 7.47132C2.25454 7.6451 2.15005 7.75025 2.07839 7.83466C2.02856 7.89335 2.01441 7.91982 2.01164 7.9258C1.99612 7.97405 1.99612 8.02595 2.01164 8.0742C2.01441 8.08018 2.02856 8.10665 2.07839 8.16534C2.15005 8.24975 2.25454 8.3549 2.42832 8.52868L7.47132 13.5717C7.6451 13.7455 7.75025 13.85 7.83466 13.9216C7.89337 13.9714 7.91983 13.9856 7.92581 13.9884C7.97405 14.0039 8.02595 14.0039 8.0742 13.9884C8.08018 13.9856 8.10665 13.9714 8.16534 13.9216C8.24975 13.85 8.3549 13.7455 8.52868 13.5717L13.5717 8.52868C13.7455 8.3549 13.85 8.24975 13.9216 8.16534C13.9714 8.10664 13.9856 8.08018 13.9884 8.0742C14.0039 8.02595 14.0039 7.97405 13.9884 7.9258C13.9856 7.91982 13.9714 7.89335 13.9216 7.83466C13.85 7.75025 13.7455 7.6451 13.5717 7.47132L8.52868 2.42832C8.3549 2.25454 8.24975 2.15005 8.16534 2.07839C8.10665 2.02856 8.08018 2.01441 8.0742 2.01164ZM8.07285 2.01108C8.07283 2.01106 8.07333 2.01124 8.0742 2.01164ZM13.9889 8.07285C13.9889 8.07283 13.9888 8.07333 13.9884 8.0742ZM7.92715 13.9889C7.92717 13.9889 7.92667 13.9888 7.92581 13.9884ZM2.01108 7.92715C2.01106 7.92717 2.01124 7.92667 2.01164 7.9258ZM7.55431 0.870591C7.84398 0.77647 8.15602 0.77647 8.44569 0.870591C8.64718 0.936059 8.80614 1.04829 8.94195 1.16358C9.0683 1.27085 9.20832 1.41089 9.36218 1.56476L14.4352 6.63781C14.5891 6.79167 14.7291 6.93169 14.8364 7.05805C14.9517 7.19386 15.0639 7.35282 15.1294 7.55431C15.2235 7.84398 15.2235 8.15602 15.1294 8.44569C15.0639 8.64718 14.9517 8.80614 14.8364 8.94195C14.7292 9.0683 14.5891 9.20832 14.4352 9.36218L9.36218 14.4352C9.20832 14.5891 9.0683 14.7292 8.94195 14.8364C8.80614 14.9517 8.64718 15.0639 8.44569 15.1294C8.15602 15.2235 7.84398 15.2235 7.55431 15.1294C7.35282 15.0639 7.19386 14.9517 7.05805 14.8364C6.93169 14.7291 6.79167 14.5891 6.63781 14.4352L1.56476 9.36218C1.41089 9.20832 1.27085 9.0683 1.16358 8.94195C1.04829 8.80614 0.936059 8.64718 0.870591 8.44569C0.77647 8.15602 0.77647 7.84398 0.870591 7.55431C0.936059 7.35282 1.04829 7.19386 1.16358 7.05805C1.27084 6.9317 1.41087 6.79169 1.56474 6.63784L6.63784 1.56474C6.79169 1.41087 6.9317 1.27084 7.05805 1.16358C7.19386 1.04829 7.35282 0.936059 7.55431 0.870591ZM8 4C8.33137 4 8.6 4.26863 8.6 4.6V7.4C8.6 7.73137 8.33137 8 8 8C7.66863 8 7.4 7.73137 7.4 7.4V4.6C7.4 4.26863 7.66863 4 8 4ZM8 9.6C8.33137 9.6 8.6 9.86863 8.6 10.2V11.4C8.6 11.7314 8.33137 12 8 12C7.66863 12 7.4 11.7314 7.4 11.4V10.2C7.4 9.86863 7.66863 9.6 8 9.6Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const ProfileEditHubtelLogoIcon = ({ className = '' }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M21 0H7C3.13401 0 0 3.13401 0 7V21C0 24.866 3.13401 28 7 28H21C24.866 28 28 24.866 28 21V7C28 3.13401 24.866 0 21 0Z"
        fill="#0E3B2E"
      />
      <path
        d="M7.58333 9.33333C7.58333 8.71449 7.82917 8.121 8.26675 7.68342C8.70434 7.24583 9.29783 7 9.91667 7H18.0833C18.7022 7 19.2957 7.24583 19.7332 7.68342C20.1708 8.121 20.4167 8.71449 20.4167 9.33333V15.1667C20.4167 15.7855 20.1708 16.379 19.7332 16.8166C19.2957 17.2542 18.7022 17.5 18.0833 17.5H13.4167L9.91667 20.4167V17.5C9.29783 17.5 8.70434 17.2542 8.26675 16.8166C7.82917 16.379 7.58333 15.7855 7.58333 15.1667V9.33333Z"
        fill="white"
      />
      <path
        d="M11.0833 13.3C11.6632 13.3 12.1333 12.8299 12.1333 12.25C12.1333 11.6701 11.6632 11.2 11.0833 11.2C10.5034 11.2 10.0333 11.6701 10.0333 12.25C10.0333 12.8299 10.5034 13.3 11.0833 13.3Z"
        fill="#0E3B2E"
      />
      <path
        d="M14 13.3C14.5799 13.3 15.05 12.8299 15.05 12.25C15.05 11.6701 14.5799 11.2 14 11.2C13.4201 11.2 12.95 11.6701 12.95 12.25C12.95 12.8299 13.4201 13.3 14 13.3Z"
        fill="#0E3B2E"
      />
      <path
        d="M16.9167 13.3C17.4966 13.3 17.9667 12.8299 17.9667 12.25C17.9667 11.6701 17.4966 11.2 16.9167 11.2C16.3368 11.2 15.8667 11.6701 15.8667 12.25C15.8667 12.8299 16.3368 13.3 16.9167 13.3Z"
        fill="#F5B700"
      />
    </g>
  </svg>
);
export const ProfileEditOrgBuildingIcon = ({ className = '' }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path d="M1.16667 12.8333H12.8333" strokeWidth="0.7" strokeLinecap="round" stroke="#2D5D33" />
      <path
        d="M10.5 5.25H8.16667C6.71883 5.25 6.41667 5.55217 6.41667 7V12.8333H12.25V7C12.25 5.55217 11.9478 5.25 10.5 5.25Z"
        strokeWidth="0.7"
        strokeLinejoin="round"
        stroke="#2D5D33"
      />
      <path
        d="M8.75 12.8333H1.75V2.91667C1.75 1.46883 2.05217 1.16667 3.5 1.16667H7C8.44783 1.16667 8.75 1.46883 8.75 2.91667V5.25"
        strokeWidth="0.7"
        strokeLinejoin="round"
        stroke="#2D5D33"
      />
      <path
        d="M1.75 3.5H3.5M1.75 5.83333H3.5M1.75 8.16667H3.5"
        strokeWidth="0.7"
        strokeLinecap="round"
        stroke="#2D5D33"
      />
      <path
        d="M8.75 7.58333H9.91667M8.75 9.33333H9.91667"
        strokeWidth="0.7"
        strokeLinecap="round"
        stroke="#2D5D33"
      />
      <path
        d="M9.33333 12.8333V11.0833"
        strokeWidth="0.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#2D5D33"
      />
    </g>
  </svg>
);
export const ProfileEditSkillRemoveIcon = ({ className = '' }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M3.21967 3.21967C3.51256 2.92678 3.98744 2.92678 4.28033 3.21967L7 5.93934L9.71967 3.21967C10.0126 2.92678 10.4874 2.92678 10.7803 3.21967C11.0732 3.51256 11.0732 3.98744 10.7803 4.28033L8.06066 7L10.7803 9.71967C11.0732 10.0126 11.0732 10.4874 10.7803 10.7803C10.4874 11.0732 10.0126 11.0732 9.71967 10.7803L7 8.06066L4.28033 10.7803C3.98744 11.0732 3.51256 11.0732 3.21967 10.7803C2.92678 10.4874 2.92678 10.0126 3.21967 9.71967L5.93934 7L3.21967 4.28033C2.92678 3.98744 2.92678 3.51256 3.21967 3.21967Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#272E35"
      />
    </g>
  </svg>
);
export const ProfileEditDraftLockIcon = ({ className = '' }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M4.2 3.5C4.2 1.9536 5.4536 0.7 7 0.7C8.5464 0.7 9.8 1.9536 9.8 3.5V5.6H10.675C11.7381 5.6 12.6 6.46185 12.6 7.525V11.375C12.6 12.4381 11.7381 13.3 10.675 13.3H3.325C2.26185 13.3 1.4 12.4381 1.4 11.375V7.525C1.4 6.46185 2.26185 5.6 3.325 5.6H4.2V3.5ZM5.25 5.6H8.75V3.5C8.75 2.5335 7.9665 1.75 7 1.75C6.0335 1.75 5.25 2.5335 5.25 3.5V5.6ZM3.325 6.65C2.84175 6.65 2.45 7.04175 2.45 7.525V11.375C2.45 11.8582 2.84175 12.25 3.325 12.25H10.675C11.1582 12.25 11.55 11.8582 11.55 11.375V7.525C11.55 7.04175 11.1582 6.65 10.675 6.65H3.325ZM7 8.4C7.28995 8.4 7.525 8.63505 7.525 8.925V9.975C7.525 10.2649 7.28995 10.5 7 10.5C6.71005 10.5 6.475 10.2649 6.475 9.975V8.925C6.475 8.63505 6.71005 8.4 7 8.4Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#737373"
      />
    </g>
  </svg>
);
export const ProfileEmptyDiscoverEyeIcon = ({ className = '' }) => (
  <svg
    width="15"
    height="14.25"
    viewBox="0 0 15 14.25"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M5.07573 4.70122C4.20404 5.40677 3.5175 6.2479 3.13096 6.77172C3.06801 6.85703 3.03846 6.89775 3.01867 6.9301C3.00631 6.95031 3.00396 6.95742 3.00266 6.96227C3.00251 6.96312 3.00203 6.96581 3.00152 6.97043C3.00063 6.97835 3 6.98857 3 7C3 7.01143 3.00063 7.02165 3.00152 7.02957C3.00203 7.03419 3.00251 7.03688 3.00266 7.03773C3.00396 7.04258 3.00631 7.04968 3.01867 7.0699C3.03846 7.10225 3.06801 7.14297 3.13096 7.22828C3.5175 7.7521 4.20404 8.59323 5.07573 9.29878C5.95514 10.0106 6.96261 10.5357 8 10.5357C9.03739 10.5357 10.0449 10.0106 10.9243 9.29878C11.796 8.59323 12.4825 7.7521 12.869 7.22828C12.932 7.14297 12.9615 7.10225 12.9813 7.06989C12.9937 7.04968 12.996 7.04257 12.9973 7.03773C12.9975 7.03688 12.998 7.03419 12.9985 7.02957C12.9994 7.02165 13 7.01143 13 7C13 6.98857 12.9994 6.97835 12.9985 6.97043C12.998 6.96581 12.9975 6.96312 12.9973 6.96227C12.996 6.95743 12.9937 6.95032 12.9813 6.9301C12.9615 6.89775 12.932 6.85703 12.869 6.77172C12.4825 6.2479 11.796 5.40677 10.9243 4.70122C10.0449 3.98941 9.03739 3.46429 8 3.46429C6.96261 3.46429 5.95514 3.98941 5.07573 4.70122ZM4.43281 3.96264C5.38789 3.18958 6.61992 2.5 8 2.5C9.38008 2.5 10.6121 3.18958 11.5672 3.96264C12.53 4.74195 13.2729 5.65584 13.6838 6.21265C13.6906 6.22179 13.6974 6.23099 13.7043 6.24027C13.803 6.37344 13.9132 6.522 13.967 6.72674C14.011 6.89371 14.011 7.10629 13.967 7.27326C13.9132 7.478 13.803 7.62656 13.7043 7.75973C13.6974 7.76901 13.6906 7.77821 13.6838 7.78735C13.2729 8.34416 12.53 9.25805 11.5672 10.0374C10.6121 10.8104 9.38008 11.5 8 11.5C6.61992 11.5 5.38789 10.8104 4.43281 10.0374C3.47 9.25805 2.72707 8.34416 2.31618 7.78735C2.30944 7.77821 2.30262 7.76901 2.29574 7.75973C2.19699 7.62656 2.08682 7.478 2.03295 7.27326C1.98902 7.10629 1.98902 6.89371 2.03295 6.72674C2.08682 6.522 2.19699 6.37344 2.29574 6.24027C2.30262 6.23099 2.30944 6.22179 2.31618 6.21265C2.72707 5.65584 3.47 4.74195 4.43281 3.96264ZM8 6.03571C7.44772 6.03571 7 6.46744 7 7C7 7.53256 7.44772 7.96429 8 7.96429C8.55229 7.96429 9 7.53256 9 7C9 6.46744 8.55229 6.03571 8 6.03571ZM6 7C6 5.93488 6.89543 5.07143 8 5.07143C9.10457 5.07143 10 5.93488 10 7C10 8.06512 9.10457 8.92857 8 8.92857C6.89543 8.92857 6 8.06512 6 7Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#2D5D33"
      />
    </g>
  </svg>
);
export const ProfileEmptyHeadlinePencilIcon = ({ className = '' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M11.6021 1.84329C12.2061 1.23931 13.0253 0.9 13.8794 0.9C15.6581 0.9 17.1 2.3419 17.1 4.12058C17.1 4.97474 16.7607 5.7939 16.1567 6.39788L5.6523 16.9023C5.52571 17.0289 5.35402 17.1 5.175 17.1H1.575C1.20221 17.1 0.9 16.7978 0.9 16.425V12.825C0.9 12.646 0.971116 12.4743 1.0977 12.3477L11.6021 1.84329ZM13.8794 2.25C13.3833 2.25 12.9075 2.44708 12.5567 2.79788L12.2046 3.15L14.85 5.79541L15.2021 5.44329C15.5529 5.09248 15.75 4.61669 15.75 4.12058C15.75 3.08749 14.9125 2.25 13.8794 2.25ZM13.8954 6.75L11.25 4.10459L2.25 13.1046V15.75H4.89541L13.8954 6.75Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);
export const ProfileEmptyTipBulbIcon = ({ className = '' }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g>
      <path
        d="M3 8.16667C2.57679 7.47145 2.33333 6.65688 2.33333 5.786C2.33333 3.23481 4.42267 1.16667 7 1.16667C9.57734 1.16667 11.6667 3.23481 11.6667 5.786C11.6667 6.65688 11.4232 7.47145 11 8.16667"
        strokeWidth="0.65625"
        strokeLinecap="round"
        stroke="currentColor"
      />
      <path
        d="M8.16667 5.83333C7.80937 6.20853 7.41481 6.41667 7 6.41667C6.58519 6.41667 6.19062 6.20853 5.83333 5.83333"
        strokeWidth="0.65625"
        strokeLinecap="round"
        stroke="currentColor"
      />
      <path
        d="M4.30667 9.97395C4.25308 9.8126 4.22629 9.73193 4.22941 9.66659C4.23601 9.52834 4.32316 9.40695 4.45175 9.35696C4.51254 9.33333 4.59728 9.33333 4.76675 9.33333H9.23323C9.40275 9.33333 9.48745 9.33333 9.54823 9.35696C9.67686 9.40695 9.76401 9.52834 9.7706 9.66659C9.77369 9.73193 9.74692 9.8126 9.69331 9.97395C9.59426 10.2722 9.54473 10.4213 9.46837 10.542C9.30837 10.7949 9.05753 10.9764 8.76785 11.0488C8.62954 11.0833 8.47292 11.0833 8.15972 11.0833H5.84027C5.52705 11.0833 5.37046 11.0833 5.23217 11.0488C4.94248 10.9764 4.69164 10.7949 4.53162 10.542C4.45524 10.4213 4.40572 10.2722 4.30667 9.97395Z"
        strokeWidth="0.65625"
        stroke="currentColor"
      />
      <path
        d="M8.75 11.0833L8.67457 11.4605C8.59209 11.873 8.55085 12.0792 8.45839 12.2422C8.31553 12.4941 8.08395 12.6839 7.80885 12.7747C7.63093 12.8333 7.42064 12.8333 7.00001 12.8333H7H6.99999C6.57936 12.8333 6.36907 12.8333 6.19115 12.7747C5.91605 12.6839 5.68449 12.4941 5.54159 12.2422C5.44917 12.0792 5.40793 11.873 5.32544 11.4605L5.25 11.0833"
        strokeWidth="0.65625"
        stroke="currentColor"
      />
      <path
        d="M7 9.04167V6.41667"
        strokeWidth="0.65625"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
    </g>
  </svg>
);
export const ProfileEmptyAddProjectIcon = ({ className = '' }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 17 17"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M8.5 3.40042C8.85208 3.40042 9.1375 3.68583 9.1375 4.03792V7.86302H12.9625C13.3146 7.86302 13.6 8.14844 13.6 8.50052C13.6 8.8526 13.3146 9.13802 12.9625 9.13802H9.1375V12.9629C9.1375 13.315 8.85208 13.6004 8.5 13.6004C8.14792 13.6004 7.8625 13.315 7.8625 12.9629V9.13802H4.0375C3.68542 9.13802 3.4 8.8526 3.4 8.50052C3.4 8.14844 3.68542 7.86302 4.0375 7.86302H7.8625V4.03792C7.8625 3.68583 8.14792 3.40042 8.5 3.40042Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#387440"
    />
  </svg>
);
export const ProfileEmptyRingArcIcon = ({ className = '' }) => (
  <svg
    width="39.9444"
    height="31.617"
    viewBox="0 0 39.9444 31.617"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M0 0C8.86953 -3.87699e-07 17.5114 2.80791 24.687 8.02129C31.8626 13.2347 37.2035 20.5859 39.9444 29.0213L31.9555 31.617C29.7628 24.8687 25.4901 18.9877 19.7496 14.817C14.0091 10.6463 7.09562 8.4 0 8.4V0Z"
      fill="#387440"
    />
  </svg>
);
// ---- Talent profile · share ----

export const ShareCloseIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g>
      <path
        d="M4.21967 4.21967C4.51256 3.92678 4.98744 3.92678 5.28033 4.21967L8 6.93934L10.7197 4.21967C11.0126 3.92678 11.4874 3.92678 11.7803 4.21967C12.0732 4.51256 12.0732 4.98744 11.7803 5.28033L9.06066 8L11.7803 10.7197C12.0732 11.0126 12.0732 11.4874 11.7803 11.7803C11.4874 12.0732 11.0126 12.0732 10.7197 11.7803L8 9.06066L5.28033 11.7803C4.98744 12.0732 4.51256 12.0732 4.21967 11.7803C3.92678 11.4874 3.92678 11.0126 4.21967 10.7197L6.93934 8L4.21967 5.28033C3.92678 4.98744 3.92678 4.51256 4.21967 4.21967Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#595959"
      />
    </g>
  </svg>
);

export const ShareAlertDiamondIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g clipPath="url(#clip0_8654_87719)">
      <path
        d="M8.0742 2.01164C8.02595 1.99612 7.97405 1.99612 7.9258 2.01164C7.91982 2.01441 7.89335 2.02856 7.83466 2.07839C7.75025 2.15005 7.6451 2.25454 7.47132 2.42832L2.42832 7.47132C2.25454 7.6451 2.15005 7.75025 2.07839 7.83466C2.02856 7.89335 2.01441 7.91982 2.01164 7.9258C1.99612 7.97405 1.99612 8.02595 2.01164 8.0742C2.01441 8.08018 2.02856 8.10665 2.07839 8.16534C2.15005 8.24975 2.25454 8.3549 2.42832 8.52868L7.47132 13.5717C7.6451 13.7455 7.75025 13.85 7.83466 13.9216C7.89337 13.9714 7.91983 13.9856 7.92581 13.9884C7.97405 14.0039 8.02595 14.0039 8.0742 13.9884C8.08018 13.9856 8.10665 13.9714 8.16534 13.9216C8.24975 13.85 8.3549 13.7455 8.52868 13.5717L13.5717 8.52868C13.7455 8.3549 13.85 8.24975 13.9216 8.16534C13.9714 8.10664 13.9856 8.08018 13.9884 8.0742C14.0039 8.02595 14.0039 7.97405 13.9884 7.9258C13.9856 7.91982 13.9714 7.89335 13.9216 7.83466C13.85 7.75025 13.7455 7.6451 13.5717 7.47132L8.52868 2.42832C8.3549 2.25454 8.24975 2.15005 8.16534 2.07839C8.10665 2.02856 8.08018 2.01441 8.0742 2.01164ZM8.07285 2.01108C8.07283 2.01106 8.07333 2.01124 8.0742 2.01164ZM13.9889 8.07285C13.9889 8.07283 13.9888 8.07333 13.9884 8.0742ZM7.92715 13.9889C7.92717 13.9889 7.92667 13.9888 7.92581 13.9884ZM2.01108 7.92715C2.01106 7.92717 2.01124 7.92667 2.01164 7.9258ZM7.55431 0.870591C7.84398 0.77647 8.15602 0.77647 8.44569 0.870591C8.64718 0.936059 8.80614 1.04829 8.94195 1.16358C9.0683 1.27085 9.20832 1.41089 9.36218 1.56476L14.4352 6.63781C14.5891 6.79167 14.7291 6.93169 14.8364 7.05805C14.9517 7.19386 15.0639 7.35282 15.1294 7.55431C15.2235 7.84398 15.2235 8.15602 15.1294 8.44569C15.0639 8.64718 14.9517 8.80614 14.8364 8.94195C14.7292 9.0683 14.5891 9.20832 14.4352 9.36218L9.36218 14.4352C9.20832 14.5891 9.0683 14.7292 8.94195 14.8364C8.80614 14.9517 8.64718 15.0639 8.44569 15.1294C8.15602 15.2235 7.84398 15.2235 7.55431 15.1294C7.35282 15.0639 7.19386 14.9517 7.05805 14.8364C6.93169 14.7291 6.79167 14.5891 6.63781 14.4352L1.56476 9.36218C1.41089 9.20832 1.27085 9.0683 1.16358 8.94195C1.04829 8.80614 0.936059 8.64718 0.870591 8.44569C0.77647 8.15602 0.77647 7.84398 0.870591 7.55431C0.936059 7.35282 1.04829 7.19386 1.16358 7.05805C1.27084 6.9317 1.41087 6.79169 1.56474 6.63784L6.63784 1.56474C6.79169 1.41087 6.9317 1.27084 7.05805 1.16358C7.19386 1.04829 7.35282 0.936059 7.55431 0.870591ZM8 4C8.33137 4 8.6 4.26863 8.6 4.6V7.4C8.6 7.73137 8.33137 8 8 8C7.66863 8 7.4 7.73137 7.4 7.4V4.6C7.4 4.26863 7.66863 4 8 4ZM8 9.6C8.33137 9.6 8.6 9.86863 8.6 10.2V11.4C8.6 11.7314 8.33137 12 8 12C7.66863 12 7.4 11.7314 7.4 11.4V10.2C7.4 9.86863 7.66863 9.6 8 9.6Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
    <defs>
      <clipPath id="clip0_8654_87719">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const ShareEditPencilIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
  >
    <g clipPath="url(#clip0_8654_85371)">
      <path
        d="M9.02387 1.43367C9.49363 0.963908 10.1308 0.7 10.7951 0.7C12.1785 0.7 13.3 1.82148 13.3 3.2049C13.3 3.86924 13.0361 4.50637 12.5663 4.97613L4.39623 13.1462C4.29777 13.2447 4.16424 13.3 4.025 13.3H1.225C0.93505 13.3 0.7 13.0649 0.7 12.775V9.975C0.7 9.83576 0.755312 9.70222 0.853769 9.60377L9.02387 1.43367ZM10.7951 1.75C10.4092 1.75 10.0392 1.90328 9.76633 2.17613L9.49246 2.45L11.55 4.50754L11.8239 4.23367C12.0967 3.96082 12.25 3.59076 12.25 3.2049C12.25 2.40138 11.5986 1.75 10.7951 1.75ZM10.8075 5.25L8.75 3.19246L1.75 10.1925V12.25H3.80754L10.8075 5.25Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1C2A21"
      />
    </g>
    <defs>
      <clipPath id="clip0_8654_85371">
        <rect width="14" height="14" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const ShareWhatsAppBubbleIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill="none"
  >
    <g>
      <path
        d="M8.85417 14.4097H16.1458M8.85417 9.20139H12.5"
        strokeWidth="1.38889"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="white"
      />
      <path
        d="M14.761 21.0665C19.1183 20.7769 22.5892 17.2568 22.8748 12.8377C22.9306 11.973 22.9306 11.0773 22.8748 10.2125C22.5892 5.79345 19.1183 2.2734 14.761 1.98375C13.2745 1.88494 11.7225 1.88515 10.239 1.98375C5.88165 2.2734 2.41084 5.79345 2.12525 10.2125C2.06936 11.0773 2.06936 11.973 2.12525 12.8377C2.22927 14.4472 2.94107 15.9374 3.77907 17.1958C4.26563 18.0767 3.94452 19.1762 3.43772 20.1366C3.0723 20.8291 2.88959 21.1753 3.03629 21.4255C3.183 21.6756 3.51068 21.6836 4.16607 21.6995C5.46215 21.7311 6.33612 21.3636 7.02987 20.852C7.42333 20.5619 7.62007 20.4168 7.75566 20.4001C7.89125 20.3835 8.15809 20.4934 8.69167 20.7132C9.17125 20.9107 9.72808 21.0325 10.239 21.0665C11.7225 21.1651 13.2745 21.1653 14.761 21.0665Z"
        strokeWidth="1.38889"
        strokeLinejoin="round"
        stroke="white"
      />
    </g>
  </svg>
);

export const ShareLinkedInBriefcaseIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill="none"
  >
    <g>
      <path
        d="M2.08333 14.5833C2.08333 11.6574 2.08333 10.1944 2.78554 9.14346C3.08954 8.6885 3.48017 8.29787 3.93512 7.99387C4.98605 7.29167 6.44904 7.29167 9.375 7.29167H15.625C18.5509 7.29167 20.014 7.29167 21.0649 7.99387C21.5198 8.29787 21.9104 8.6885 22.2145 9.14346C22.9167 10.1944 22.9167 11.6574 22.9167 14.5833C22.9167 17.5093 22.9167 18.9723 22.2145 20.0232C21.9104 20.4781 21.5198 20.8687 21.0649 21.1728C20.014 21.875 18.5509 21.875 15.625 21.875H9.375C6.44904 21.875 4.98605 21.875 3.93512 21.1728C3.48017 20.8687 3.08954 20.4781 2.78554 20.0232C2.08333 18.9723 2.08333 17.5093 2.08333 14.5833Z"
        strokeWidth="1.04167"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="white"
      />
      <path
        d="M16.6667 7.29167C16.6667 5.32748 16.6667 4.34539 16.0565 3.7352C15.4462 3.125 14.4642 3.125 12.5 3.125C10.5358 3.125 9.55372 3.125 8.94353 3.7352C8.33333 4.34539 8.33333 5.32748 8.33333 7.29167"
        strokeWidth="1.04167"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="white"
      />
      <path
        d="M6.25 11.4583L6.92914 11.6687C10.5053 12.7771 14.4947 12.7771 18.0708 11.6687L18.75 11.4583M12.5 12.5V14.5833"
        strokeWidth="1.04167"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="white"
      />
    </g>
  </svg>
);

export const ShareStatusCameraIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill="none"
  >
    <g>
      <path
        d="M10.8341 2.49985C10.8641 2.49993 10.8939 2.5 10.9236 2.5H14.0764C14.1061 2.5 14.1359 2.49993 14.1659 2.49985C14.5214 2.49897 14.9009 2.49803 15.2532 2.61956C15.5598 2.72528 15.8389 2.89783 16.0706 3.12471C16.3369 3.38551 16.5057 3.72534 16.6639 4.04372C16.6773 4.07059 16.6906 4.09731 16.7038 4.12381L17.1419 5L18.8505 5C19.5182 4.99999 20.0755 4.99998 20.5308 5.03717C21.0057 5.07597 21.4515 5.15986 21.8731 5.37467C22.5199 5.70423 23.0458 6.2301 23.3753 6.87691C23.5901 7.29849 23.674 7.74431 23.7128 8.21916C23.75 8.67445 23.75 9.23175 23.75 9.89944V17.6006C23.75 18.2682 23.75 18.8256 23.7128 19.2808C23.674 19.7557 23.5901 20.2015 23.3753 20.6231C23.0458 21.2699 22.5199 21.7958 21.8731 22.1253C21.4515 22.3401 21.0057 22.424 20.5308 22.4628C20.0756 22.5 19.5182 22.5 18.8506 22.5H6.14943C5.48175 22.5 4.92445 22.5 4.46916 22.4628C3.99431 22.424 3.54849 22.3401 3.12691 22.1253C2.4801 21.7958 1.95423 21.2699 1.62467 20.6231C1.40986 20.2015 1.32597 19.7557 1.28717 19.2808C1.24998 18.8255 1.24999 18.2682 1.25 17.6005V9.89946C1.24999 9.23176 1.24998 8.67445 1.28717 8.21916C1.32597 7.74431 1.40986 7.29849 1.62467 6.87691C1.95423 6.2301 2.4801 5.70423 3.12691 5.37467C3.54849 5.15986 3.99431 5.07597 4.46916 5.03717C4.92445 4.99998 5.48176 4.99999 6.14946 5L7.85809 5L8.29619 4.12381C8.30944 4.0973 8.32272 4.07058 8.33607 4.04371C8.49427 3.72534 8.66313 3.38551 8.92941 3.12471C9.16105 2.89783 9.44024 2.72528 9.74676 2.61956C10.0991 2.49803 10.4786 2.49897 10.8341 2.49985ZM10.3555 4.39288C10.3554 4.39287 10.356 4.39268 10.3573 4.39236ZM10.4524 4.38172C10.3901 4.3856 10.3641 4.39071 10.3573 4.39236C10.3141 4.4074 10.2747 4.43174 10.2419 4.4637C10.2374 4.46906 10.2213 4.48996 10.19 4.5439C10.1391 4.63148 10.0786 4.75152 9.97324 4.96234L9.27603 6.35676C9.11722 6.67437 8.7926 6.875 8.4375 6.875H6.1875C5.47196 6.875 4.9917 6.87573 4.62185 6.90595C4.26294 6.93527 4.09134 6.98762 3.97814 7.0453C3.68414 7.1951 3.4451 7.43414 3.2953 7.72814C3.23762 7.84134 3.18527 8.01294 3.15595 8.37185C3.12573 8.7417 3.125 9.22196 3.125 9.9375V17.5625C3.125 18.278 3.12573 18.7583 3.15595 19.1282C3.18527 19.4871 3.23762 19.6587 3.2953 19.7719C3.4451 20.0659 3.68414 20.3049 3.97814 20.4547C4.09134 20.5124 4.26294 20.5647 4.62185 20.5941C4.9917 20.6243 5.47196 20.625 6.1875 20.625H18.8125C19.528 20.625 20.0083 20.6243 20.3782 20.5941C20.7371 20.5647 20.9087 20.5124 21.0219 20.4547C21.3159 20.3049 21.5549 20.0659 21.7047 19.7719C21.7624 19.6587 21.8147 19.4871 21.8441 19.1282C21.8743 18.7583 21.875 18.278 21.875 17.5625V9.9375C21.875 9.22196 21.8743 8.7417 21.8441 8.37185C21.8147 8.01294 21.7624 7.84134 21.7047 7.72814C21.5549 7.43414 21.3159 7.1951 21.0219 7.0453C20.9087 6.98762 20.7371 6.93527 20.3782 6.90595C20.0083 6.87573 19.528 6.875 18.8125 6.875H16.5625C16.2074 6.875 15.8828 6.67437 15.724 6.35676L15.0268 4.96234C14.9214 4.75152 14.8609 4.63148 14.81 4.5439C14.7787 4.48995 14.7626 4.46905 14.7581 4.4637C14.7253 4.43174 14.6858 4.40738 14.6426 4.39234C14.6438 4.39273 14.6445 4.39289 14.6445 4.39288M14.6426 4.39234C14.6358 4.39069 14.6099 4.3856 14.5476 4.38172C14.4466 4.37542 14.3121 4.375 14.0764 4.375H10.9236C10.6879 4.375 10.5534 4.37542 10.4524 4.38172M14.7567 4.46221C14.7567 4.46217 14.7572 4.46266 14.7581 4.4637ZM10.2433 4.46221C10.2433 4.46225 10.2428 4.46285 10.2419 4.4637ZM12.5 10.625C10.7741 10.625 9.375 12.0241 9.375 13.75C9.375 15.4759 10.7741 16.875 12.5 16.875C14.2259 16.875 15.625 15.4759 15.625 13.75C15.625 12.0241 14.2259 10.625 12.5 10.625ZM7.5 13.75C7.5 10.9886 9.73858 8.75 12.5 8.75C15.2614 8.75 17.5 10.9886 17.5 13.75C17.5 16.5114 15.2614 18.75 12.5 18.75C9.73858 18.75 7.5 16.5114 7.5 13.75Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1C2A21"
      />
    </g>
  </svg>
);

export const ShareMailIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill="none"
  >
    <g>
      <path
        d="M3.2053 6.69172L12.5 12.0432L21.7947 6.69172C21.5874 6.0718 21.0021 5.625 20.3125 5.625H4.6875C3.99785 5.625 3.41256 6.0718 3.2053 6.69172ZM21.875 8.80906L12.9678 13.9375C12.6782 14.1042 12.3218 14.1042 12.0322 13.9375L3.125 8.80906V17.8125C3.125 18.6754 3.82456 19.375 4.6875 19.375H20.3125C21.1754 19.375 21.875 18.6754 21.875 17.8125V8.80906ZM1.25 7.1875C1.25 5.28902 2.78902 3.75 4.6875 3.75H20.3125C22.211 3.75 23.75 5.28902 23.75 7.1875V17.8125C23.75 19.711 22.211 21.25 20.3125 21.25H4.6875C2.78902 21.25 1.25 19.711 1.25 17.8125V7.1875Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1C2A21"
      />
    </g>
  </svg>
);

export const ShareMoreDotsIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
  >
    <g>
      <path
        d="M6.65 14C6.65 15.1598 5.7098 16.1 4.55 16.1C3.3902 16.1 2.45 15.1598 2.45 14C2.45 12.8402 3.3902 11.9 4.55 11.9C5.7098 11.9 6.65 12.8402 6.65 14ZM16.1 14C16.1 15.1598 15.1598 16.1 14 16.1C12.8402 16.1 11.9 15.1598 11.9 14C11.9 12.8402 12.8402 11.9 14 11.9C15.1598 11.9 16.1 12.8402 16.1 14ZM23.45 16.1C24.6098 16.1 25.55 15.1598 25.55 14C25.55 12.8402 24.6098 11.9 23.45 11.9C22.2902 11.9 21.35 12.8402 21.35 14C21.35 15.1598 22.2902 16.1 23.45 16.1Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1C2A21"
      />
    </g>
  </svg>
);

export const ShareGlobeIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
  >
    <g clipPath="url(#clip0_8654_85288)">
      <path
        d="M1.90277 6.9375H4.5096C4.56244 5.39568 4.831 3.99003 5.25307 2.91861C5.35188 2.66778 5.46104 2.43032 5.58073 2.21093C3.58784 2.93426 2.11978 4.75186 1.90277 6.9375ZM7.5 0.75C3.77208 0.75 0.75 3.77208 0.75 7.5C0.75 11.2279 3.77208 14.25 7.5 14.25C11.2279 14.25 14.25 11.2279 14.25 7.5C14.25 3.77208 11.2279 0.75 7.5 0.75ZM7.5 1.875C7.37123 1.875 7.18929 1.93898 6.96284 2.18212C6.73561 2.42608 6.5051 2.80976 6.29978 3.33095C5.93744 4.25074 5.68781 5.51126 5.6353 6.9375H9.3647C9.31219 5.51126 9.06256 4.25074 8.70022 3.33095C8.4949 2.80976 8.26439 2.42608 8.03716 2.18212C7.81071 1.93898 7.62877 1.875 7.5 1.875ZM10.4904 6.9375C10.4376 5.39568 10.169 3.99003 9.74693 2.91861C9.64812 2.66778 9.53896 2.43032 9.41927 2.21093C11.4122 2.93426 12.8802 4.75186 13.0972 6.9375H10.4904ZM9.3647 8.0625H5.6353C5.68781 9.48874 5.93744 10.7493 6.29978 11.6691C6.5051 12.1902 6.73561 12.5739 6.96284 12.8179C7.18929 13.061 7.37123 13.125 7.5 13.125C7.62877 13.125 7.81071 13.061 8.03716 12.8179C8.26439 12.5739 8.4949 12.1902 8.70022 11.6691C9.06256 10.7493 9.31219 9.48874 9.3647 8.0625ZM9.41927 12.7891C9.53896 12.5697 9.64812 12.3322 9.74693 12.0814C10.169 11.01 10.4376 9.60432 10.4904 8.0625H13.0972C12.8802 10.2481 11.4122 12.0657 9.41927 12.7891ZM5.58073 12.7891C5.46104 12.5697 5.35188 12.3322 5.25307 12.0814C4.831 11.01 4.56244 9.60432 4.5096 8.0625H1.90277C2.11978 10.2481 3.58784 12.0657 5.58073 12.7891Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1C2A21"
      />
    </g>
    <defs>
      <clipPath id="clip0_8654_85288">
        <rect width="15" height="15" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const ShareChevronDownIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
  >
    <g>
      <path
        d="M3.7097 5.2066C3.9753 4.95998 4.39053 4.97536 4.63715 5.24095L7 7.78557L9.36285 5.24096C9.60948 4.97536 10.0247 4.95998 10.2903 5.20661C10.5559 5.45323 10.5713 5.86846 10.3246 6.13405L7.4809 9.19655C7.35672 9.33027 7.18248 9.40625 7 9.40625C6.81752 9.40625 6.64327 9.33027 6.5191 9.19655L3.67535 6.13405C3.42873 5.86845 3.44411 5.45322 3.7097 5.2066Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#595959"
      />
    </g>
  </svg>
);

export const ShareEyeIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="14"
    height="13.3"
    viewBox="0 0 14 13.3"
    fill="none"
  >
    <g>
      <path
        d="M4.36816 4.85447C3.58364 5.51299 2.96575 6.29804 2.61787 6.78694C2.56121 6.86656 2.53461 6.90457 2.5168 6.93476C2.50568 6.95363 2.50356 6.96026 2.5024 6.96478C2.50226 6.96558 2.50183 6.96809 2.50137 6.9724C2.50057 6.97979 2.5 6.98934 2.5 7C2.5 7.01066 2.50057 7.02021 2.50137 7.0276C2.50183 7.03191 2.50226 7.03442 2.5024 7.03522C2.50356 7.03974 2.50568 7.04637 2.5168 7.06524C2.53461 7.09543 2.56121 7.13344 2.61787 7.21306C2.96575 7.70196 3.58364 8.48701 4.36816 9.14553C5.15962 9.80988 6.06635 10.3 7 10.3C7.93365 10.3 8.84038 9.80988 9.63185 9.14553C10.4164 8.48701 11.0343 7.70196 11.3821 7.21306C11.4388 7.13344 11.4654 7.09543 11.4832 7.06524C11.4943 7.04637 11.4964 7.03974 11.4976 7.03521C11.4977 7.03442 11.4982 7.03191 11.4986 7.0276C11.4994 7.02021 11.5 7.01066 11.5 7C11.5 6.98934 11.4994 6.97979 11.4986 6.9724C11.4982 6.96809 11.4977 6.96558 11.4976 6.96479C11.4964 6.96026 11.4943 6.95363 11.4832 6.93476C11.4654 6.90457 11.4388 6.86656 11.3821 6.78694C11.0343 6.29804 10.4164 5.51299 9.63185 4.85447C8.84038 4.19012 7.93365 3.7 7 3.7C6.06635 3.7 5.15962 4.19012 4.36816 4.85447ZM3.78953 4.16513C4.6491 3.44361 5.75793 2.8 7 2.8C8.24207 2.8 9.3509 3.44361 10.2105 4.16513C11.077 4.89248 11.7456 5.74545 12.1154 6.26514C12.1215 6.27367 12.1276 6.28226 12.1338 6.29092C12.2227 6.41521 12.3219 6.55387 12.3703 6.74495C12.4099 6.90079 12.4099 7.09921 12.3703 7.25505C12.3219 7.44613 12.2227 7.58479 12.1338 7.70908C12.1276 7.71774 12.1215 7.72633 12.1154 7.73486C11.7456 8.25455 11.077 9.10752 10.2105 9.83487C9.3509 10.5564 8.24207 11.2 7 11.2C5.75793 11.2 4.6491 10.5564 3.78953 9.83487C2.923 9.10752 2.25436 8.25455 1.88457 7.73486C1.8785 7.72633 1.87236 7.71774 1.86617 7.70908C1.77729 7.58479 1.67814 7.44613 1.62966 7.25505C1.59012 7.09921 1.59012 6.90079 1.62966 6.74495C1.67814 6.55387 1.77729 6.41521 1.86617 6.29092C1.87236 6.28226 1.8785 6.27367 1.88457 6.26514C2.25436 5.74545 2.923 4.89248 3.78953 4.16513ZM7 6.1C6.50294 6.1 6.1 6.50294 6.1 7C6.1 7.49706 6.50294 7.9 7 7.9C7.49706 7.9 7.9 7.49706 7.9 7C7.9 6.50294 7.49706 6.1 7 6.1ZM5.2 7C5.2 6.00589 6.00589 5.2 7 5.2C7.99411 5.2 8.8 6.00589 8.8 7C8.8 7.99411 7.99411 8.8 7 8.8C6.00589 8.8 5.2 7.99411 5.2 7Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#737373"
      />
    </g>
  </svg>
);

export const ShareToastLinkIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="19"
    height="19"
    viewBox="0 0 19 19"
    fill="none"
  >
    <g clipPath="url(#clip0_8654_86147)">
      <path
        d="M13.6845 2.3785C13.6153 2.3752 13.5292 2.375 13.307 2.375C13.2098 2.375 13.1728 2.37505 13.138 2.37588C12.3702 2.39417 11.6368 2.69796 11.0809 3.22793C11.0558 3.25193 11.0295 3.27814 10.9608 3.34683L8.81631 5.49131C8.65919 5.64844 8.59842 5.7095 8.55183 5.76076C7.48141 6.93836 7.48141 8.73665 8.55183 9.91424C8.59842 9.9655 8.65921 10.0266 8.81631 10.1837L9.05382 10.4212C9.33206 10.6994 9.33206 11.1506 9.05382 11.4288C8.77557 11.7071 8.32444 11.7071 8.04619 11.4288L7.79325 11.1759C7.65672 11.0394 7.56984 10.9525 7.49735 10.8727C5.9329 9.15163 5.9329 6.52337 7.49735 4.80226C7.56985 4.72251 7.6567 4.63567 7.79326 4.49912L9.95318 2.3392L9.9598 2.33258C10.0199 2.2725 10.0587 2.23368 10.0976 2.19659C10.91 1.42201 11.9819 0.978017 13.104 0.95128C13.1579 0.949998 13.2127 0.949999 13.298 0.95L13.3289 0.95C13.522 0.949993 13.6448 0.949988 13.7524 0.95512C16.0756 1.06589 17.9341 2.92436 18.0449 5.2476C18.05 5.35525 18.05 5.47802 18.05 5.67114V5.70199C18.05 5.78727 18.05 5.84213 18.0487 5.89597C18.022 7.01812 17.578 8.09002 16.8034 8.9024C16.7663 8.94136 16.7275 8.98017 16.6672 9.0404L16.6608 9.04682L15.4663 10.2413C15.1881 10.5196 14.7369 10.5196 14.4587 10.2413C14.1804 9.96307 14.1804 9.51194 14.4587 9.23369L15.6532 8.0392C15.7219 7.97049 15.7481 7.94424 15.7721 7.91906C16.302 7.36322 16.6058 6.62981 16.6241 5.86203C16.625 5.82724 16.625 5.79021 16.625 5.69301C16.625 5.47077 16.6248 5.38467 16.6215 5.31546C16.5457 3.72587 15.2741 2.45429 13.6845 2.3785ZM9.94619 8.57881C9.66794 8.30057 9.66794 7.84944 9.94619 7.57119C10.2244 7.29294 10.6756 7.29294 10.9538 7.57119L11.2068 7.82416C11.3433 7.96066 11.4302 8.04752 11.5027 8.12726C13.0671 9.84837 13.0671 12.4766 11.5026 14.1977C11.4302 14.2775 11.3433 14.3643 11.2068 14.5009L9.04682 16.6608L9.04012 16.6675C8.98009 16.7275 8.94129 16.7663 8.9024 16.8034C8.09002 17.578 7.01812 18.022 5.89597 18.0487C5.84213 18.05 5.78727 18.05 5.702 18.05H5.67114C5.47802 18.05 5.35525 18.05 5.2476 18.0449C2.92436 17.9341 1.06589 16.0756 0.955121 13.7524C0.949989 13.6448 0.949994 13.522 0.95 13.3289L0.950001 13.298C0.949999 13.2127 0.949998 13.1579 0.951281 13.104C0.978017 11.9819 1.42201 10.91 2.19659 10.0976C2.23374 10.0586 2.27257 10.0198 2.33285 9.95952L3.53369 8.75869C3.81194 8.48044 4.26307 8.48044 4.54131 8.75869C4.81956 9.03694 4.81956 9.48807 4.54132 9.76631L3.34682 10.9608C3.27811 11.0295 3.25194 11.0558 3.22793 11.0809C2.69796 11.6368 2.39417 12.3702 2.37588 13.138C2.37505 13.1728 2.375 13.2098 2.375 13.307C2.375 13.5292 2.3752 13.6153 2.3785 13.6845C2.45429 15.2741 3.72588 16.5457 5.31546 16.6215C5.38467 16.6248 5.47077 16.625 5.69301 16.625C5.79021 16.625 5.82724 16.625 5.86203 16.6241C6.62982 16.6058 7.36322 16.302 7.91906 15.7721C7.94423 15.7481 7.97051 15.7219 8.03921 15.6532L10.1837 13.5087C10.3408 13.3516 10.4016 13.2905 10.4482 13.2392C11.5186 12.0616 11.5186 10.2634 10.4482 9.08576C10.4016 9.0345 10.3408 8.97342 10.1837 8.81631L9.94619 8.57881Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1C2A21"
      />
    </g>
    <defs>
      <clipPath id="clip0_8654_86147">
        <rect width="19" height="19" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const ShareCheckGreenIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
  >
    <g>
      <path
        d="M10.836 3.88532C11.0978 4.09678 11.1386 4.48045 10.9272 4.74227L6.66156 10.0235C6.55049 10.161 6.38517 10.2435 6.20851 10.2496C6.03184 10.2557 5.86124 10.1848 5.74095 10.0553L3.10033 7.21152C2.87132 6.9649 2.8856 6.57933 3.13223 6.35033C3.37885 6.12132 3.76442 6.1356 3.99342 6.38222L6.15542 8.71053L9.97907 3.97648C10.1905 3.71467 10.5742 3.67385 10.836 3.88532Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);

export const ShareRedoIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
  >
    <g>
      <path
        d="M13.6875 5.25C13.9982 5.25 14.25 5.50184 14.25 5.8125V9.1875C14.25 9.49816 13.9982 9.75 13.6875 9.75H10.3125C10.0018 9.75 9.75 9.49816 9.75 9.1875C9.75 8.87684 10.0018 8.625 10.3125 8.625H12.5299C11.2743 7.32796 9.40889 6.65626 7.5 6.65625C5.20456 6.65625 2.97194 7.62753 1.78706 9.48949C1.62027 9.75158 1.2726 9.82885 1.01051 9.66206C0.748416 9.49527 0.671155 9.1476 0.83794 8.88551C2.27806 6.62246 4.92044 5.53125 7.5 5.53125C9.54585 5.53126 11.6312 6.21764 13.125 7.63063V5.8125C13.125 5.50184 13.3768 5.25 13.6875 5.25Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1C2A21"
      />
    </g>
  </svg>
);

export const ShareArrowLeftIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
  >
    <g>
      <path
        d="M7.43762 4.68346C7.70909 4.93896 7.72203 5.36615 7.46654 5.63762L4.93724 8.325H14.625C14.9978 8.325 15.3 8.62721 15.3 9C15.3 9.37279 14.9978 9.675 14.625 9.675H4.93724L7.46654 12.3624C7.72203 12.6338 7.70909 13.061 7.43762 13.3165C7.16615 13.572 6.73896 13.5591 6.48346 13.2876L2.88346 9.46262C2.63884 9.20271 2.63884 8.79729 2.88346 8.53738L6.48346 4.71238C6.73896 4.44091 7.16615 4.42797 7.43762 4.68346Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#595959"
      />
    </g>
  </svg>
);

export const ShareCheckWhiteIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
  >
    <g>
      <path
        d="M10.836 3.88532C11.0978 4.09678 11.1386 4.48045 10.9272 4.74227L6.66156 10.0235C6.55049 10.161 6.38517 10.2435 6.20851 10.2496C6.03184 10.2557 5.86124 10.1848 5.74095 10.0553L3.10033 7.21152C2.87132 6.9649 2.8856 6.57933 3.13223 6.35033C3.37885 6.12132 3.76442 6.1356 3.99342 6.38222L6.15542 8.71053L9.97907 3.97648C10.1905 3.71467 10.5742 3.67385 10.836 3.88532Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="white"
      />
    </g>
  </svg>
);

export const ShareArrowheadDownSmallIcon = ({ className = '' }) => (
  <svg aria-hidden="true" className={className} width="8" height="8" viewBox="0 0 8 8" fill="none">
    <g>
      <path
        d="M4 6C3.76393 6 3.54164 5.9012 3.4 5.73333L1.15 3.06667C0.979557 2.86465 0.95214 2.59438 1.07918 2.36852C1.20623 2.14267 1.46592 2 1.75 2H6.25C6.53408 2 6.79377 2.14267 6.92082 2.36852C7.04786 2.59438 7.02044 2.86465 6.85 3.06667L4.6 5.73333C4.45836 5.9012 4.23607 6 4 6Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#272E35"
      />
    </g>
  </svg>
);

export const SharePhoneFieldDotIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="20"
    height="19"
    viewBox="0 0 20 19"
    fill="none"
  >
    <g>
      <g>
        <path
          d="M20 9.5C20 14.7467 15.5228 19 10 19C4.47715 19 0 14.7467 0 9.5C0 4.25329 4.47715 0 10 0C15.5228 0 20 4.25329 20 9.5Z"
          fill="#D9D9D9"
        />
        <mask id="stroke0_8654_87605" fill="white">
          <path d="M20 9.5C20 14.7467 15.5228 19 10 19C4.47715 19 0 14.7467 0 9.5C0 4.25329 4.47715 0 10 0C15.5228 0 20 4.25329 20 9.5Z" />
        </mask>
        <path
          d="M20 9.5C20 14.7467 15.5228 19 10 19C4.47715 19 0 14.7467 0 9.5C0 4.25329 4.47715 0 10 0C15.5228 0 20 4.25329 20 9.5Z"
          strokeWidth="2"
          stroke="#1C2A21"
          mask="url(#stroke0_8654_87605)"
        />
      </g>
    </g>
  </svg>
);

export const ShareChipCheckIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
  >
    <g>
      <path
        d="M11.7213 3.16654C12.0435 3.42681 12.0937 3.89902 11.8335 4.22125L6.58346 10.7213C6.44675 10.8905 6.24329 10.9921 6.02586 10.9996C5.80842 11.0071 5.59845 10.9198 5.4504 10.7603L2.2004 7.26034C1.91855 6.9568 1.93613 6.48226 2.23966 6.2004C2.54319 5.91855 3.01774 5.93613 3.2996 6.23966L5.96051 9.10526L10.6665 3.27875C10.9268 2.95651 11.399 2.90628 11.7213 3.16654Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#272E35"
      />
    </g>
  </svg>
);

export const ShareCardCheckIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
  >
    <g>
      <path
        d="M9.54094 3.12491C9.78262 3.32011 9.82029 3.67426 9.62509 3.91594L5.68759 8.79094C5.58506 8.91788 5.43247 8.99404 5.26939 8.99966C5.10632 9.00529 4.94883 8.93982 4.8378 8.82025L2.4003 6.19525C2.18891 5.9676 2.2021 5.61169 2.42975 5.4003C2.6574 5.18891 3.01331 5.2021 3.2247 5.42975L5.22038 7.57895L8.74991 3.20906C8.94511 2.96738 9.29926 2.92971 9.54094 3.12491Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1C2A21"
      />
    </g>
  </svg>
);

export const ShareMobileIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
  >
    <g>
      <path
        d="M2.25 2.8125C2.25 1.67341 3.17341 0.75 4.3125 0.75H10.6875C11.8266 0.75 12.75 1.67341 12.75 2.8125V12.1875C12.75 13.3266 11.8266 14.25 10.6875 14.25H4.3125C3.17341 14.25 2.25 13.3266 2.25 12.1875V2.8125ZM4.3125 1.875C3.79473 1.875 3.375 2.29473 3.375 2.8125V12.1875C3.375 12.7053 3.79473 13.125 4.3125 13.125H10.6875C11.2053 13.125 11.625 12.7053 11.625 12.1875V2.8125C11.625 2.29473 11.2053 1.875 10.6875 1.875H4.3125ZM6.75 11.4375C6.75 11.1268 7.00184 10.875 7.3125 10.875H7.6875C7.99816 10.875 8.25 11.1268 8.25 11.4375C8.25 11.7482 7.99816 12 7.6875 12H7.3125C7.00184 12 6.75 11.7482 6.75 11.4375Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="white"
      />
    </g>
  </svg>
);

export const ShareBoxesIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
  >
    <g clipPath="url(#clip0_8654_89246)">
      <path
        d="M3.68967 0.75H3.81033C4.21094 0.749992 4.54533 0.749985 4.8185 0.772304C5.10342 0.795583 5.37091 0.845916 5.62386 0.974799C6.01194 1.17254 6.32746 1.48806 6.5252 1.87614C6.65408 2.12909 6.70442 2.39658 6.7277 2.6815C6.75002 2.95467 6.75001 3.28906 6.75 3.68968V3.81032C6.75001 4.21094 6.75002 4.54533 6.7277 4.8185C6.70442 5.10342 6.65408 5.37091 6.5252 5.62386C6.32746 6.01194 6.01194 6.32746 5.62386 6.5252C5.37091 6.65408 5.10342 6.70442 4.8185 6.7277C4.54533 6.75002 4.21094 6.75001 3.81032 6.75H3.68968C3.28906 6.75001 2.95467 6.75002 2.6815 6.7277C2.39658 6.70442 2.12909 6.65408 1.87614 6.5252C1.48806 6.32746 1.17254 6.01194 0.974799 5.62386C0.845916 5.37091 0.795583 5.10342 0.772304 4.8185C0.749985 4.54533 0.749992 4.21094 0.75 3.81033V3.68967C0.749992 3.28906 0.749985 2.95467 0.772304 2.6815C0.795583 2.39658 0.845916 2.12909 0.974799 1.87614C1.17254 1.48806 1.48806 1.17254 1.87614 0.974799C2.12909 0.845916 2.39658 0.795583 2.6815 0.772304C2.95467 0.749985 3.28906 0.749992 3.68967 0.75ZM2.77311 1.89357C2.55777 1.91116 2.4548 1.94257 2.38688 1.97718C2.21048 2.06706 2.06706 2.21048 1.97718 2.38688C1.94257 2.4548 1.91116 2.55777 1.89357 2.77311C1.87544 2.99502 1.875 3.28318 1.875 3.7125V3.7875C1.875 4.21682 1.87544 4.50498 1.89357 4.72689C1.91116 4.94223 1.94257 5.0452 1.97718 5.11312C2.06706 5.28952 2.21048 5.43294 2.38688 5.52282C2.4548 5.55743 2.55777 5.58884 2.77311 5.60643C2.99502 5.62456 3.28318 5.625 3.7125 5.625H3.7875C4.21682 5.625 4.50498 5.62456 4.72689 5.60643C4.94223 5.58884 5.0452 5.55743 5.11312 5.52282C5.28952 5.43294 5.43294 5.28952 5.52282 5.11312C5.55743 5.0452 5.58884 4.94223 5.60643 4.72689C5.62456 4.50498 5.625 4.21682 5.625 3.7875V3.7125C5.625 3.28318 5.62456 2.99502 5.60643 2.77311C5.58884 2.55777 5.55743 2.4548 5.52282 2.38688C5.43294 2.21048 5.28952 2.06706 5.11312 1.97718C5.0452 1.94257 4.94223 1.91116 4.72689 1.89357C4.50498 1.87544 4.21682 1.875 3.7875 1.875H3.7125C3.28318 1.875 2.99502 1.87544 2.77311 1.89357ZM11.1897 0.75H11.3103C11.7109 0.749992 12.0453 0.749985 12.3185 0.772304C12.6034 0.795583 12.8709 0.845916 13.1239 0.974799C13.5119 1.17254 13.8275 1.48806 14.0252 1.87614C14.1541 2.12909 14.2044 2.39658 14.2277 2.6815C14.25 2.95467 14.25 3.28905 14.25 3.68966V3.81034C14.25 4.21095 14.25 4.54533 14.2277 4.8185C14.2044 5.10342 14.1541 5.37091 14.0252 5.62386C13.8275 6.01194 13.5119 6.32746 13.1239 6.5252C12.8709 6.65408 12.6034 6.70442 12.3185 6.7277C12.0453 6.75002 11.7109 6.75001 11.3103 6.75H11.1897C10.7891 6.75001 10.4547 6.75002 10.1815 6.7277C9.89658 6.70442 9.62909 6.65408 9.37614 6.5252C8.98806 6.32746 8.67254 6.01194 8.4748 5.62386C8.34592 5.37091 8.29558 5.10342 8.2723 4.8185C8.24999 4.54533 8.24999 4.21095 8.25 3.81034V3.68966C8.24999 3.28905 8.24999 2.95467 8.2723 2.6815C8.29558 2.39658 8.34592 2.12909 8.4748 1.87614C8.67254 1.48806 8.98806 1.17254 9.37614 0.974799C9.62909 0.845916 9.89658 0.795583 10.1815 0.772304C10.4547 0.749985 10.7891 0.749992 11.1897 0.75ZM10.2731 1.89357C10.0578 1.91116 9.9548 1.94257 9.88688 1.97718C9.71048 2.06706 9.56706 2.21048 9.47718 2.38688C9.44257 2.4548 9.41116 2.55777 9.39357 2.77311C9.37544 2.99502 9.375 3.28318 9.375 3.7125V3.7875C9.375 4.21682 9.37544 4.50498 9.39357 4.72689C9.41116 4.94223 9.44257 5.0452 9.47718 5.11312C9.56706 5.28952 9.71048 5.43294 9.88688 5.52282C9.9548 5.55743 10.0578 5.58884 10.2731 5.60643C10.495 5.62456 10.7832 5.625 11.2125 5.625H11.2875C11.7168 5.625 12.005 5.62456 12.2269 5.60643C12.4422 5.58884 12.5452 5.55743 12.6131 5.52282C12.7895 5.43294 12.9329 5.28952 13.0228 5.11312C13.0574 5.0452 13.0888 4.94223 13.1064 4.72689C13.1246 4.50498 13.125 4.21682 13.125 3.7875V3.7125C13.125 3.28318 13.1246 2.99502 13.1064 2.77311C13.0888 2.55777 13.0574 2.4548 13.0228 2.38688C12.9329 2.21048 12.7895 2.06706 12.6131 1.97718C12.5452 1.94257 12.4422 1.91116 12.2269 1.89357C12.005 1.87544 11.7168 1.875 11.2875 1.875H11.2125C10.7832 1.875 10.495 1.87544 10.2731 1.89357ZM3.68966 8.25H3.81034C4.21095 8.24999 4.54533 8.24999 4.8185 8.2723C5.10342 8.29558 5.37091 8.34592 5.62386 8.4748C6.01194 8.67254 6.32746 8.98806 6.5252 9.37614C6.65408 9.62909 6.70442 9.89658 6.7277 10.1815C6.75002 10.4547 6.75001 10.7891 6.75 11.1897V11.3103C6.75001 11.7109 6.75002 12.0453 6.7277 12.3185C6.70442 12.6034 6.65408 12.8709 6.5252 13.1239C6.32746 13.5119 6.01194 13.8275 5.62386 14.0252C5.37091 14.1541 5.10342 14.2044 4.8185 14.2277C4.54533 14.25 4.21095 14.25 3.81034 14.25H3.68966C3.28905 14.25 2.95467 14.25 2.6815 14.2277C2.39658 14.2044 2.12909 14.1541 1.87614 14.0252C1.48806 13.8275 1.17254 13.5119 0.974799 13.1239C0.845916 12.8709 0.795583 12.6034 0.772304 12.3185C0.749985 12.0453 0.749992 11.7109 0.75 11.3103V11.1897C0.749992 10.7891 0.749985 10.4547 0.772304 10.1815C0.795583 9.89658 0.845916 9.62909 0.974799 9.37614C1.17254 8.98806 1.48806 8.67254 1.87614 8.4748C2.12909 8.34592 2.39658 8.29558 2.6815 8.2723C2.95467 8.24999 3.28905 8.24999 3.68966 8.25ZM2.77311 9.39357C2.55777 9.41116 2.4548 9.44257 2.38688 9.47718C2.21048 9.56706 2.06706 9.71048 1.97718 9.88688C1.94257 9.9548 1.91116 10.0578 1.89357 10.2731C1.87544 10.495 1.875 10.7832 1.875 11.2125V11.2875C1.875 11.7168 1.87544 12.005 1.89357 12.2269C1.91116 12.4422 1.94257 12.5452 1.97718 12.6131C2.06706 12.7895 2.21048 12.9329 2.38688 13.0228C2.4548 13.0574 2.55777 13.0888 2.77311 13.1064C2.99502 13.1246 3.28318 13.125 3.7125 13.125H3.7875C4.21682 13.125 4.50498 13.1246 4.72689 13.1064C4.94223 13.0888 5.0452 13.0574 5.11312 13.0228C5.28952 12.9329 5.43294 12.7895 5.52282 12.6131C5.55743 12.5452 5.58884 12.4422 5.60643 12.2269C5.62456 12.005 5.625 11.7168 5.625 11.2875V11.2125C5.625 10.7832 5.62456 10.495 5.60643 10.2731C5.58884 10.0578 5.55743 9.9548 5.52282 9.88688C5.43294 9.71048 5.28952 9.56706 5.11312 9.47718C5.0452 9.44257 4.94223 9.41116 4.72689 9.39357C4.50498 9.37544 4.21682 9.375 3.7875 9.375H3.7125C3.28318 9.375 2.99502 9.37544 2.77311 9.39357ZM11.1897 8.25H11.3103C11.7109 8.24999 12.0453 8.24999 12.3185 8.2723C12.6034 8.29558 12.8709 8.34592 13.1239 8.4748C13.5119 8.67254 13.8275 8.98806 14.0252 9.37614C14.1541 9.62909 14.2044 9.89658 14.2277 10.1815C14.25 10.4547 14.25 10.7891 14.25 11.1897V11.3103C14.25 11.7109 14.25 12.0453 14.2277 12.3185C14.2044 12.6034 14.1541 12.8709 14.0252 13.1239C13.8275 13.5119 13.5119 13.8275 13.1239 14.0252C12.8709 14.1541 12.6034 14.2044 12.3185 14.2277C12.0453 14.25 11.7109 14.25 11.3103 14.25H11.1897C10.7891 14.25 10.4547 14.25 10.1815 14.2277C9.89658 14.2044 9.62909 14.1541 9.37614 14.0252C8.98806 13.8275 8.67254 13.5119 8.4748 13.1239C8.34592 12.8709 8.29558 12.6034 8.2723 12.3185C8.24999 12.0453 8.24999 11.7109 8.25 11.3103V11.1897C8.24999 10.7891 8.24999 10.4547 8.2723 10.1815C8.29558 9.89658 8.34592 9.62909 8.4748 9.37614C8.67254 8.98806 8.98806 8.67254 9.37614 8.4748C9.62909 8.34592 9.89658 8.29558 10.1815 8.2723C10.4547 8.24999 10.7891 8.24999 11.1897 8.25ZM10.2731 9.39357C10.0578 9.41116 9.9548 9.44257 9.88688 9.47718C9.71048 9.56706 9.56706 9.71048 9.47718 9.88688C9.44257 9.9548 9.41116 10.0578 9.39357 10.2731C9.37544 10.495 9.375 10.7832 9.375 11.2125V11.2875C9.375 11.7168 9.37544 12.005 9.39357 12.2269C9.41116 12.4422 9.44257 12.5452 9.47718 12.6131C9.56706 12.7895 9.71048 12.9329 9.88688 13.0228C9.9548 13.0574 10.0578 13.0888 10.2731 13.1064C10.495 13.1246 10.7832 13.125 11.2125 13.125H11.2875C11.7168 13.125 12.005 13.1246 12.2269 13.1064C12.4422 13.0888 12.5452 13.0574 12.6131 13.0228C12.7895 12.9329 12.9329 12.7895 13.0228 12.6131C13.0574 12.5452 13.0888 12.4422 13.1064 12.2269C13.1246 12.005 13.125 11.7168 13.125 11.2875V11.2125C13.125 10.7832 13.1246 10.495 13.1064 10.2731C13.0888 10.0578 13.0574 9.9548 13.0228 9.88688C12.9329 9.71048 12.7895 9.56706 12.6131 9.47718C12.5452 9.44257 12.4422 9.41116 12.2269 9.39357C12.005 9.37544 11.7168 9.375 11.2875 9.375H11.2125C10.7832 9.375 10.495 9.37544 10.2731 9.39357Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#595959"
      />
    </g>
    <defs>
      <clipPath id="clip0_8654_89246">
        <rect width="15" height="15" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const ShareBriefcaseSmallIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
  >
    <g>
      <path
        d="M1.25 8.75C1.25 6.99444 1.25 6.11663 1.67132 5.48608C1.85372 5.2131 2.0881 4.97872 2.36107 4.79632C2.99163 4.375 3.86943 4.375 5.625 4.375H9.375C11.1306 4.375 12.0084 4.375 12.6389 4.79632C12.9119 4.97872 13.1462 5.2131 13.3287 5.48608C13.75 6.11663 13.75 6.99444 13.75 8.75C13.75 10.5056 13.75 11.3834 13.3287 12.0139C13.1462 12.2869 12.9119 12.5212 12.6389 12.7037C12.0084 13.125 11.1306 13.125 9.375 13.125H5.625C3.86943 13.125 2.99163 13.125 2.36107 12.7037C2.0881 12.5212 1.85372 12.2869 1.67132 12.0139C1.25 11.3834 1.25 10.5056 1.25 8.75Z"
        strokeWidth="0.625"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#595959"
      />
      <path
        d="M10 4.375C10 3.19649 10 2.60723 9.63387 2.24112C9.26775 1.875 8.6785 1.875 7.5 1.875C6.3215 1.875 5.73223 1.875 5.36612 2.24112C5 2.60723 5 3.19649 5 4.375"
        strokeWidth="0.625"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#595959"
      />
      <path
        d="M3.75 6.875L4.15748 7.00125C6.30319 7.66625 8.69681 7.66625 10.8425 7.00125L11.25 6.875M7.5 7.5V8.75"
        strokeWidth="0.625"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#595959"
      />
    </g>
  </svg>
);

export const ShareShieldIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
  >
    <g>
      <path
        d="M7.68468 1.89423C7.56277 1.86859 7.43723 1.86859 7.31532 1.89423C7.1974 1.91903 7.07403 1.98179 6.61827 2.24046L2.96047 4.31659C2.84183 4.38393 2.7746 4.42237 2.72561 4.45428C2.68849 4.47846 2.67926 4.488 2.67944 4.48794C2.67947 4.48793 2.67976 4.48766 2.68023 4.48714C2.66104 4.50847 2.64563 4.5348 2.63598 4.56476C2.63145 4.57881 2.625 4.60517 2.625 4.9083V7.26574C2.625 8.99755 3.49505 10.5993 4.91415 11.5055L7.16989 12.9459C7.29058 13.0229 7.35943 13.0666 7.41303 13.0962C7.44431 13.1135 7.45893 13.1194 7.46315 13.1209C7.48748 13.1264 7.51252 13.1264 7.53685 13.1209C7.54107 13.1194 7.55569 13.1135 7.58697 13.0962C7.64057 13.0666 7.70942 13.0229 7.83011 12.9459L10.0859 11.5055C11.505 10.5993 12.375 8.99755 12.375 7.26574V4.9083C12.375 4.60517 12.3685 4.57881 12.364 4.56476C12.3544 4.53481 12.339 4.50848 12.3198 4.48714C12.3169 4.48441 12.3053 4.47443 12.2744 4.45428C12.2254 4.42237 12.1582 4.38393 12.0395 4.31659L8.38172 2.24046C7.92597 1.98179 7.8026 1.91903 7.68468 1.89423ZM7.5355 13.1213C7.53551 13.1213 7.5359 13.1212 7.53661 13.121ZM7.46449 13.1213C7.46448 13.1213 7.46413 13.1212 7.46339 13.121ZM7.08377 0.793316C7.35837 0.735561 7.64163 0.735561 7.91623 0.793316C8.22794 0.858878 8.51278 1.02084 8.87271 1.22552C8.89389 1.23756 8.91533 1.24975 8.93705 1.26208L12.5949 3.3382C12.6096 3.3466 12.6246 3.35502 12.6395 3.36348C12.8193 3.46492 13.0106 3.57292 13.1562 3.73479C13.2824 3.87515 13.3771 4.04067 13.4348 4.21983C13.501 4.42524 13.5005 4.64475 13.5001 4.85622C13.5 4.87364 13.5 4.891 13.5 4.9083V7.26574C13.5 9.37201 12.442 11.3358 10.6913 12.4537L8.43556 13.894C8.42029 13.9038 8.40493 13.9137 8.38946 13.9236C8.2084 14.0399 8.0134 14.1651 7.79262 14.2164C7.60003 14.2612 7.39997 14.2612 7.20738 14.2164C6.9866 14.1651 6.7916 14.0399 6.61053 13.9236C6.59507 13.9137 6.57971 13.9038 6.56444 13.894L4.3087 12.4537C2.55796 11.3358 1.5 9.37201 1.5 7.26574V4.9083C1.5 4.891 1.49996 4.87364 1.49993 4.85622C1.49947 4.64475 1.499 4.42524 1.56516 4.21983C1.62287 4.04067 1.71756 3.87515 1.84381 3.73479C1.98941 3.57292 2.18074 3.46492 2.36045 3.36348C2.37544 3.35502 2.39035 3.3466 2.40515 3.3382L6.06295 1.26208C6.08467 1.24975 6.10611 1.23756 6.12729 1.22551C6.48722 1.02084 6.77206 0.858877 7.08377 0.793316Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1C2A21"
      />
    </g>
  </svg>
);

export const ShareSpinnerIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="40"
    height="39.0211"
    viewBox="0 0 40 39.0211"
    fill="none"
  >
    <path
      d="M40 19.0211C40 22.7096 38.98 26.3262 37.0528 29.4711C35.1256 32.616 32.3662 35.1667 29.0798 36.8413C25.7934 38.5158 22.1079 39.2489 18.4308 38.9595C14.7538 38.6701 11.2283 37.3695 8.2443 35.2015C5.26029 33.0335 2.93393 30.0825 1.52242 26.6748C0.11091 23.2671 -0.330759 19.5355 0.246241 15.8924C0.823241 12.2494 2.39643 8.83689 4.79189 6.03217C7.18734 3.22745 10.3117 1.13979 13.8197 0L15.1793 4.18465C12.4432 5.07369 10.0061 6.70206 8.13767 8.88974C6.26922 11.0774 5.04213 13.7392 4.59207 16.5808C4.14201 19.4223 4.48651 22.333 5.58749 24.991C6.68846 27.649 8.50303 29.9507 10.8306 31.6418C13.1581 33.3328 15.9079 34.3473 18.776 34.573C21.6442 34.7988 24.5188 34.227 27.0823 32.9208C29.6457 31.6147 31.798 29.6251 33.3012 27.1721C34.8044 24.7191 35.6 21.8981 35.6 19.0211H40Z"
      fill="#387440"
    />
  </svg>
);

export const ShareCheckSmallIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
  >
    <g>
      <path
        d="M17.3484 6.28184C17.676 6.59851 17.6848 7.1208 17.3682 7.44839L9.39317 15.6984C9.23572 15.8613 9.01824 15.9522 8.79172 15.95C8.5652 15.9477 8.34959 15.8524 8.19545 15.6864L4.62045 11.8364C4.31041 11.5025 4.32974 10.9805 4.66363 10.6704C4.99751 10.3604 5.51952 10.3797 5.82955 10.7136L8.81204 13.9255L16.1818 6.30161C16.4985 5.97401 17.0208 5.96516 17.3484 6.28184Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="white"
      />
    </g>
  </svg>
);

export const ShareMessageOutlineIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <g>
      <path
        d="M7.08333 11.5278H12.9167M7.08333 7.36111H10"
        strokeWidth="1.11111"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M11.8088 16.8532C15.2947 16.6215 18.0713 13.8054 18.2998 10.2702C18.3445 9.57836 18.3445 8.86186 18.2998 8.17003C18.0713 4.63476 15.2947 1.81872 11.8088 1.587C10.6196 1.50795 9.378 1.50812 8.19116 1.587C4.70532 1.81872 1.92867 4.63476 1.7002 8.17003C1.65549 8.86186 1.65549 9.57836 1.7002 10.2702C1.78341 11.5578 2.35286 12.7499 3.02326 13.7566C3.41251 14.4614 3.15561 15.3409 2.75017 16.1093C2.45784 16.6633 2.31167 16.9403 2.42903 17.1404C2.5464 17.3404 2.80855 17.3469 3.33286 17.3596C4.36972 17.3849 5.0689 17.0909 5.6239 16.6816C5.93866 16.4495 6.09606 16.3334 6.20453 16.3201C6.313 16.3068 6.52647 16.3947 6.95334 16.5705C7.337 16.7285 7.78246 16.826 8.19116 16.8532C9.378 16.9321 10.6196 16.9323 11.8088 16.8532Z"
        strokeWidth="1.11111"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
    </g>
  </svg>
);

export const ShareChevronRightIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
  >
    <g>
      <path
        d="M6.48673 3.80893C6.74414 3.53927 7.17141 3.52933 7.44107 3.78674L12.3911 8.51173C12.5245 8.6391 12.6 8.81553 12.6 9C12.6 9.18447 12.5245 9.3609 12.3911 9.48827L7.44107 14.2133C7.17141 14.4707 6.74414 14.4607 6.48673 14.1911C6.22933 13.9214 6.23927 13.4941 6.50893 13.2367L10.9474 9L6.50893 4.76327C6.23927 4.50586 6.22933 4.07859 6.48673 3.80893Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#595959"
      />
    </g>
  </svg>
);

export const ShareBriefcaseOutlineIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <g>
      <path
        d="M1.66667 11.6667C1.66667 9.32592 1.66667 8.15551 2.22843 7.31477C2.47163 6.9508 2.78413 6.6383 3.1481 6.3951C3.98884 5.83333 5.15923 5.83333 7.5 5.83333H12.5C14.8407 5.83333 16.0112 5.83333 16.8519 6.3951C17.2158 6.6383 17.5283 6.9508 17.7716 7.31477C18.3333 8.15551 18.3333 9.32592 18.3333 11.6667C18.3333 14.0074 18.3333 15.1778 17.7716 16.0186C17.5283 16.3825 17.2158 16.695 16.8519 16.9382C16.0112 17.5 14.8407 17.5 12.5 17.5H7.5C5.15923 17.5 3.98884 17.5 3.1481 16.9382C2.78413 16.695 2.47163 16.3825 2.22843 16.0186C1.66667 15.1778 1.66667 14.0074 1.66667 11.6667Z"
        strokeWidth="0.833333"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M13.3333 5.83333C13.3333 4.26198 13.3333 3.47631 12.8452 2.98816C12.357 2.5 11.5713 2.5 10 2.5C8.42867 2.5 7.64297 2.5 7.15482 2.98816C6.66667 3.47631 6.66667 4.26198 6.66667 5.83333"
        strokeWidth="0.833333"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
      <path
        d="M5 9.16667L5.54331 9.335C8.40425 10.2217 11.5957 10.2217 14.4567 9.335L15 9.16667M10 10V11.6667"
        strokeWidth="0.833333"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#1C2A21"
      />
    </g>
  </svg>
);

export const ShareCopyIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <g>
      <path
        d="M1 3.75C1 2.23122 2.23122 1 3.75 1H12.25C13.7688 1 15 2.23122 15 3.75V5H16.25C17.7688 5 19 6.23122 19 7.75V16.25C19 17.7688 17.7688 19 16.25 19H7.75C6.23122 19 5 17.7688 5 16.25V15H3.75C2.23122 15 1 13.7688 1 12.25V3.75ZM5 13.5V7.75C5 6.23122 6.23122 5 7.75 5H13.5V3.75C13.5 3.05964 12.9404 2.5 12.25 2.5H3.75C3.05964 2.5 2.5 3.05964 2.5 3.75V12.25C2.5 12.9404 3.05964 13.5 3.75 13.5H5ZM7.75 6.5C7.05964 6.5 6.5 7.05964 6.5 7.75V16.25C6.5 16.9404 7.05964 17.5 7.75 17.5H16.25C16.9404 17.5 17.5 16.9404 17.5 16.25V7.75C17.5 7.05964 16.9404 6.5 16.25 6.5H7.75Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1C2A21"
      />
    </g>
  </svg>
);

export const ShareDownloadIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <g>
      <path
        d="M10 1C10.4142 1 10.75 1.33579 10.75 1.75V10.537L12.7413 8.6989C13.0457 8.41794 13.5202 8.43692 13.8011 8.74129C14.0821 9.04566 14.0631 9.52015 13.7587 9.8011L10.5087 12.8011C10.2214 13.0663 9.77859 13.0663 9.49129 12.8011L6.24129 9.8011C5.93692 9.52015 5.91794 9.04566 6.1989 8.74129C6.47985 8.43692 6.95434 8.41794 7.25871 8.6989L9.25 10.537V1.75C9.25 1.33579 9.58579 1 10 1ZM1.75 13C2.16421 13 2.5 13.3358 2.5 13.75V16.25C2.5 16.9404 3.05964 17.5 3.75 17.5H16.25C16.9404 17.5 17.5 16.9404 17.5 16.25V13.75C17.5 13.3358 17.8358 13 18.25 13C18.6642 13 19 13.3358 19 13.75V16.25C19 17.7688 17.7688 19 16.25 19H3.75C2.23122 19 1 17.7688 1 16.25V13.75C1 13.3358 1.33579 13 1.75 13Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1C2A21"
      />
    </g>
  </svg>
);

export const ShareStreakFlameIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
  >
    <g>
      <path
        d="M50 8C59.29 26.92 80.96 40.68 80.96 64.76C80.96 81.96 67.34 94 50 94C32.66 94 19.04 81.96 19.04 64.76C19.04 51 26.47 42.4 32.66 30.36C35.14 40.68 38.85 45.84 43.81 47.56C40.09 32.08 45.05 18.32 50 8Z"
        fill="#FF7A1E"
      />
      <path
        d="M50 44.12C54.83 53.96 66.1 61.11 66.1 73.64C66.1 82.58 59.02 88.84 50 88.84C40.98 88.84 33.9 82.58 33.9 73.64C33.9 66.48 37.76 62.01 40.98 55.75C42.27 61.11 44.2 63.8 46.78 64.69C44.85 56.64 47.42 49.49 50 44.12Z"
        fill="white"
        fillOpacity="0.55"
      />
    </g>
  </svg>
);

export const ShareMailSmallIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g>
      <path
        d="M2.05139 4.2827L8 7.70766L13.9486 4.2827C13.816 3.88595 13.4414 3.6 13 3.6H3C2.55863 3.6 2.18404 3.88595 2.05139 4.2827ZM14 5.6378L8.29938 8.91997C8.11405 9.02668 7.88595 9.02668 7.70062 8.91997L2 5.6378V11.4C2 11.9523 2.44772 12.4 3 12.4H13C13.5523 12.4 14 11.9523 14 11.4V5.6378ZM0.8 4.6C0.8 3.38497 1.78497 2.4 3 2.4H13C14.215 2.4 15.2 3.38497 15.2 4.6V11.4C15.2 12.615 14.215 13.6 13 13.6H3C1.78497 13.6 0.8 12.615 0.8 11.4V4.6Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);

export const ShareKofiAvatarIllustration = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="109.065"
    height="110.645"
    viewBox="0 0 109.065 110.645"
    fill="none"
  >
    <g clipPath="url(#clip0_8654_87465)">
      <g></g>
      <path
        d="M75.9404 50.0281C76.2331 45.3586 75.7218 40.0967 73.4907 35.9273C73.0295 35.0654 71.0754 32.2962 70.2422 31.9834C69.5331 31.7172 64.4387 32.729 63.2127 32.8478C54.9228 33.6513 46.5932 33.6153 38.2897 32.9559C35.0124 38.275 34.3543 44.0815 34.5087 50.2442C32.3193 44.7361 30.2252 38.8939 29.9288 32.9019C28.8225 32.4974 27.6756 32.6193 26.6271 33.118C27.0048 31.0434 28.4576 28.793 30.5679 28.2556C27.2081 27.5611 25.5383 24.4234 26.6271 21.1242L33.1241 24.3658C29.8188 21.2365 30.5791 15.9465 33.7099 12.9663C38.0377 17.8311 44.1209 14.0752 49.2601 12.9663C56.2481 11.4584 64.6502 11.1052 70.4552 15.9917C72.7145 17.8936 74.8398 20.6746 73.544 23.7715C76.2349 20.955 80.7458 24.7065 81.0528 27.8234C81.2538 29.864 80.5824 33.5007 80.2008 35.6032C79.3221 40.4436 77.8253 45.5036 75.9404 50.0281Z"
        fill="#0D0100"
      />
      <path
        d="M75.9405 50.0281C83.9703 44.3391 84.9438 54.4531 81.6919 59.8068C79.8986 62.7592 76.3876 64.9678 73.6505 61.6977C72.5301 68.5787 66.972 72.8734 60.4968 74.2317C57.4139 74.8784 53.3689 74.9259 50.272 74.3398C49.024 74.1036 46.3888 73.1778 45.2128 72.611C41.3427 70.7455 38.6221 67.0911 37.3312 62.9944C33.5169 66.7191 29.1537 61.7691 27.9052 58.078C25.9242 52.2208 28.1947 47.1038 34.562 51.0006C34.8435 50.979 34.5143 50.4661 34.5087 50.2442C34.3543 44.0815 35.0124 38.275 38.2898 32.9559C46.5933 33.6154 54.9229 33.6513 63.2127 32.8479C64.4387 32.729 69.5331 31.7172 70.2423 31.9835C71.0755 32.2963 73.0296 35.0654 73.4908 35.9273C75.7218 40.0967 76.2331 45.3587 75.9405 50.0281ZM63.7453 42.5725C63.0294 42.6157 59.5274 43.6339 61.2956 44.5175C61.6899 44.7146 65.4505 44.4104 66.408 44.5175C67.6012 44.6508 68.7182 45.1534 69.8695 45.4359C68.5113 43.48 66.0822 42.4319 63.7453 42.5725ZM44.6803 42.7886C42.9044 42.9467 40.6316 44.1152 39.9407 45.8681C41.009 45.3711 42.2308 44.8946 43.4022 44.7336C44.4541 44.589 47.8798 44.8881 48.4081 44.6255C49.3291 44.1677 48.3073 43.3362 47.769 43.1128C47.044 42.812 45.4652 42.7187 44.6803 42.7886ZM59.9642 53.1616C61.6085 56.866 67.9674 57.0414 68.9109 53.2697C70.4982 51.7735 70.0766 49.1851 68.4316 47.8671C64.7966 44.9546 57.6696 47.9922 59.9642 53.1616ZM41.5383 52.9455C42.0699 56.6426 48.099 57.0245 50.1655 53.918C53.1873 49.3751 45.9008 44.8037 42.2306 47.759C40.787 48.9215 40.2227 51.4565 41.5383 52.9455ZM79.828 51.5408C77.5181 51.8511 75.8771 55.5428 74.9819 57.4297C74.9881 57.7305 76.4517 56.4606 76.7393 56.4032C77.4431 56.2628 78.5633 56.5005 78.9227 57.2136C79.671 58.6986 77.9169 61.1661 78.1239 61.2655C79.9568 59.3571 81.8454 55.3635 81.5854 52.6754C81.4687 51.468 80.9333 51.3924 79.828 51.5408ZM29.5561 52.8375C28.5003 53.1958 29.5291 56.7546 29.8224 57.5377C30.4464 59.2048 31.7912 61.1251 33.1774 62.238C30.7871 59.177 31.848 55.7827 35.8933 58.186C34.8587 56.1791 32.3287 51.8966 29.5561 52.8375ZM67.5796 55.8629C65.0761 56.1616 65.0645 58.9298 67.5796 59.2125C71.8432 59.6918 71.5514 55.3891 67.5796 55.8629ZM41.698 55.971C39.2852 56.342 39.3953 59.0932 41.9111 59.3206C46.1981 59.7079 45.7411 55.3492 41.698 55.971ZM53.6802 58.2401C53.1659 58.1201 51.6424 58.0744 52.2956 58.8884C52.5826 59.246 53.7382 59.7879 54.2128 59.8608C55.6574 60.0829 57.1085 59.7776 58.2601 58.8343C58.2625 58.6475 57.3819 58.4522 57.3015 58.4562C58.2604 57.8708 55.8129 57.0933 55.3311 57.0515C54.5167 56.9808 52.5861 57.3102 53.6802 58.2401ZM50.1655 62.9944C50.1747 63.0617 50.1488 63.1858 50.1655 63.2105L49.4199 63.0484L50.8045 64.291C52.8759 67.2612 60.0334 66.9764 61.0293 63.8588C61.0831 63.6902 61.1477 63.5013 61.1358 63.3185C61.5914 63.0857 62.4734 62.4602 61.5086 62.238L49.8992 62.5621C49.7525 62.7587 50.0356 62.926 50.1655 62.9944Z"
        fill="#996647"
      />
      <path
        d="M63.7452 42.5725C66.0821 42.4318 68.5113 43.4799 69.8695 45.4358C68.7182 45.1533 67.6011 44.6507 66.4079 44.5174C65.4504 44.4103 61.6898 44.7145 61.2955 44.5174C59.5274 43.6339 63.0294 42.6156 63.7452 42.5725Z"
        fill="#1C2A21"
      />
      <path
        d="M44.6802 42.7886C45.4652 42.7187 47.044 42.8119 47.769 43.1128C48.3073 43.3362 49.3291 44.1677 48.408 44.6255C47.8797 44.8881 44.454 44.589 43.4021 44.7335C42.2308 44.8945 41.009 45.371 39.9406 45.8681C40.6315 44.1152 42.9043 42.9467 44.6802 42.7886Z"
        fill="#1C2A21"
      />
      <path
        d="M68.9109 53.2695C70.6567 46.2905 59.1953 46.0202 59.9642 53.1615C57.6695 47.992 64.7965 44.9545 68.4316 47.8669C70.0766 49.1849 70.4982 51.7733 68.9109 53.2695Z"
        fill="#1C2A21"
      />
      <path
        d="M50.1654 53.9179C51.2873 50.3434 47.5564 47.0777 44.1477 48.1912C42.3696 48.7719 41.2789 51.1415 41.5382 52.9454C40.2227 51.4564 40.7869 48.9214 42.2305 47.759C45.9007 44.8036 53.1873 49.375 50.1654 53.9179Z"
        fill="#1C2A21"
      />
      <path
        d="M68.9109 53.2697C67.9673 57.0414 61.6084 56.8659 59.9642 53.1616C59.1953 46.0203 70.6568 46.2907 68.9109 53.2697ZM63.7452 48.5154C60.9944 48.9042 60.2247 53.6323 62.6801 54.9985C67.6025 57.7373 69.6299 47.6836 63.7452 48.5154Z"
        fill="#FDFDFD"
      />
      <path
        d="M50.1654 53.918C48.0989 57.0245 42.0698 56.6426 41.5382 52.9455C41.2789 51.1416 42.3696 48.772 44.1477 48.1912C47.5564 47.0778 51.2873 50.3435 50.1654 53.918ZM45.3725 49.5959C46.0703 50.1432 45.5635 51.3349 44.7335 51.4328C44.126 51.5044 43.5829 51.1446 43.4021 50.5684C42.5047 52.4859 43.7758 55.1431 45.9583 55.3227C51.6673 55.7925 49.2346 45.2603 43.9879 49.5419C44.0167 49.6268 44.8286 49.1692 45.3725 49.5959Z"
        fill="#FDFDFD"
      />
      <path
        d="M63.7453 48.5154C69.63 47.6836 67.6026 57.7373 62.6802 54.9985C60.2247 53.6323 60.9945 48.9043 63.7453 48.5154ZM65.6092 51.3247C66.938 51.7941 67.6712 50.325 66.5145 49.7039C66.1871 49.5281 65.9177 49.6444 65.6092 49.5959C64.2609 49.384 62.9683 49.3988 62.3074 50.8385C61.8219 51.8961 61.923 52.8036 62.7867 53.5938C64.9344 55.5588 65.9282 53.5439 65.6092 51.3247Z"
        fill="#573220"
      />
      <path
        d="M44.7335 51.4327C44.4188 53.2418 45.0308 54.4506 47.0234 54.134C49.387 53.7585 47.8088 48.4471 45.3726 49.5958C44.8286 49.1691 44.0167 49.6267 43.9879 49.5418C49.2347 45.2602 51.6673 55.7923 45.9583 55.3225C43.7758 55.143 42.5047 52.4857 43.4022 50.5682C43.5829 51.1445 44.126 51.5043 44.7335 51.4327Z"
        fill="#583320"
      />
      <path
        d="M44.7335 51.4328C45.5635 51.3349 46.0703 50.1432 45.3725 49.5959C47.8088 48.4472 49.3869 53.7586 47.0234 54.1341C45.0308 54.4507 44.4188 53.2419 44.7335 51.4328Z"
        fill="#060000"
      />
      <path
        d="M65.6091 49.5959C64.8201 50.0215 64.6732 50.9942 65.6091 51.3247C65.9281 53.5439 64.9344 55.5589 62.7866 53.5938C61.923 52.8036 61.8219 51.8961 62.3073 50.8385C62.9682 49.3988 64.2608 49.384 65.6091 49.5959Z"
        fill="#1C2A21"
      />
      <path
        d="M65.6091 51.3247C64.6732 50.9941 64.8201 50.0214 65.6091 49.5958C65.9176 49.6443 66.187 49.5281 66.5144 49.7039C67.6711 50.325 66.9379 51.794 65.6091 51.3247Z"
        fill="#FDFDFD"
      />
      <path
        d="M79.828 51.5408C80.9332 51.3923 81.4686 51.4679 81.5854 52.6753C81.8454 55.3634 79.9567 59.357 78.1238 61.2654C77.9169 61.166 79.671 58.6986 78.9227 57.2135C78.5633 56.5005 77.443 56.2627 76.7392 56.4031C76.4517 56.4605 74.988 57.7304 74.9818 57.4296C75.8771 55.5427 77.518 51.851 79.828 51.5408Z"
        fill="#652C0D"
      />
      <path
        d="M29.556 52.8373C32.3287 51.8964 34.8587 56.1789 35.8933 58.1859C31.848 55.7826 30.7871 59.1768 33.1773 62.2378C31.7911 61.1249 30.4463 59.2046 29.8223 57.5376C29.5291 56.7544 28.5002 53.1956 29.556 52.8373Z"
        fill="#652D0D"
      />
      <path
        d="M67.5795 55.8628C71.5513 55.389 71.8431 59.6918 67.5795 59.2124C65.0644 58.9297 65.076 56.1615 67.5795 55.8628Z"
        fill="#7E3734"
      />
      <path
        d="M41.698 55.9709C45.7411 55.3492 46.1981 59.7079 41.911 59.3205C39.3953 59.0932 39.2852 56.3419 41.698 55.9709Z"
        fill="#7F3734"
      />
      <path
        d="M57.3015 58.456C56.819 58.48 56.2531 59.0291 55.4376 58.9963C54.6017 58.9626 54.1449 58.3483 53.6802 58.2399C52.5861 57.31 54.5167 56.9807 55.3311 57.0513C55.8129 57.0931 58.2604 57.8707 57.3015 58.456Z"
        fill="#B38164"
      />
      <path
        d="M53.6802 58.24C54.1449 58.3484 54.6017 58.9626 55.4376 58.9963C56.2531 59.0292 56.819 58.4801 57.3015 58.4561C57.3819 58.4521 58.2625 58.6474 58.2601 58.8343C57.1085 59.7776 55.6574 60.0828 54.2127 59.8608C53.9359 59.0887 53.0825 58.5773 52.2956 58.8883C51.6424 58.0743 53.1659 58.12 53.6802 58.24Z"
        fill="#824B25"
      />
      <path
        d="M54.2127 59.8607C53.7381 59.7877 52.5825 59.2459 52.2956 58.8882C53.0825 58.5772 53.9359 59.0886 54.2127 59.8607Z"
        fill="#6A3412"
      />
      <path
        d="M61.1358 63.3184C58.5619 64.6335 52.72 64.3415 50.1654 62.9943C50.0356 62.9259 49.7525 62.7586 49.8991 62.5621L61.5086 62.2379C62.4734 62.4602 61.5914 63.0856 61.1358 63.3184Z"
        fill="#FDFDFD"
      />
      <path
        d="M50.1654 63.2104C50.357 63.4932 50.3306 63.4605 50.4849 63.7506C50.5857 63.94 50.6818 64.115 50.8045 64.2909L49.4199 63.0483L50.1654 63.2104Z"
        fill="#572D15"
      />
      <path
        d="M61.1358 63.3184C61.1477 63.5012 61.0831 63.6901 61.0293 63.8587C58.8263 64.1861 56.6054 64.4655 54.3725 64.3989L50.4849 63.7506C50.3306 63.4605 50.357 63.4933 50.1654 63.2104C50.1488 63.1857 50.1747 63.0616 50.1654 62.9943C52.72 64.3415 58.5619 64.6335 61.1358 63.3184Z"
        fill="#C2B7BB"
      />
      <path
        d="M61.2006 63.8029C60.1776 67.0243 52.8252 67.3186 50.6974 64.2495C50.5714 64.0677 50.4727 63.8869 50.3692 63.6912L54.3626 64.3611C56.6563 64.4299 58.9376 64.1412 61.2006 63.8029Z"
        fill="#FEFDFD"
      />
      <path
        d="M60.4967 74.2317C60.5105 74.3338 60.4736 74.4638 60.4967 74.5558C58.3007 79.0975 54.0046 79.8342 49.6329 77.9054C49.9562 76.9912 50.0308 75.3394 50.2719 74.3397C53.3689 74.9258 57.4138 74.8784 60.4967 74.2317Z"
        fill="#5B2F14"
      />
      <path
        d="M62.2009 78.7698C60.2927 83.0351 57.9412 87.0501 55.4376 90.9797C52.4726 87.7072 50.257 83.8969 47.8222 80.2285C47.5174 79.6689 47.908 79.5162 48.1418 79.094C49.0108 78.7863 49.2747 78.9181 49.6329 77.9054C54.0046 79.8342 58.3007 79.0975 60.4967 74.5558C60.686 75.3105 61.7313 78.3055 62.2009 78.7698Z"
        fill="#986546"
      />
      <path
        d="M62.4139 78.8779C60.4108 83.4416 58.0656 87.8016 55.3311 91.9522C54.8027 92.0921 50.6657 86.5158 50.1654 85.7392C49.3092 84.4099 47.4563 81.3077 46.9702 79.9044C46.8643 79.5989 46.7813 79.6444 47.0767 79.4182C47.407 79.3345 47.8183 79.2085 48.1418 79.094C47.908 79.5162 47.5174 79.6689 47.8222 80.2285C50.257 83.8969 52.4726 87.7072 55.4376 90.9797C57.9412 87.0501 60.2927 83.0351 62.2009 78.7698C62.2194 78.7881 62.3688 78.8517 62.4139 78.8779Z"
        fill="#01551F"
      />
      <path
        d="M62.9464 79.094C60.799 84.3462 57.8872 89.1935 54.8518 93.9511L55.5441 95.1937C55.2389 95.3976 53.242 93.313 52.9346 92.9787C49.61 89.3628 47.0199 84.5099 45.053 80.0124L44.84 79.9584C45.0914 79.7595 45.49 79.7057 45.7986 79.6343C45.5122 81.7534 53.5081 93.6811 54.3725 93.573C54.426 93.5663 54.9644 92.7089 54.9583 92.6545C54.9372 92.4646 52.7349 90.2688 52.4021 89.8452C49.9376 86.7082 47.9171 83.2586 46.2246 79.6343C46.4911 79.5729 46.8041 79.4872 47.0767 79.4182C46.7813 79.6444 46.8643 79.5989 46.9702 79.9044C47.4563 81.3077 49.3092 84.4099 50.1654 85.7392C50.6657 86.5158 54.8027 92.0921 55.3311 91.9522C58.0656 87.8016 60.4108 83.4416 62.4139 78.8779C62.4527 78.9005 62.8822 79.0727 62.9464 79.094Z"
        fill="#3C854F"
      />
      <path
        d="M64.544 79.4181C64.1928 81.716 57.5865 96.4603 56.3962 96.9226C55.7232 97.1838 55.6453 95.9958 56.0234 95.5179C56.6423 95.0548 57.2885 93.8318 57.7275 93.0867C60.2619 88.7851 62.0886 84.0762 64.0115 79.4722L63.2659 79.3641C61.4636 85.0855 58.4692 90.2582 55.7038 95.5179C55.0382 95.9256 55.4051 96.5663 54.266 95.842C51.6842 94.2004 46.0946 85.1913 45.053 82.1735C44.832 81.5333 44.6032 80.6401 44.627 79.9584C44.6972 79.9619 44.7697 79.9568 44.84 79.9584L45.053 80.0124C47.0199 84.5099 49.61 89.3628 52.9346 92.9787C53.242 93.313 55.2389 95.3976 55.5441 95.1937L54.8518 93.9511C57.8872 89.1935 60.799 84.3462 62.9464 79.094C63.2745 79.2026 64.0759 79.2933 64.544 79.4181ZM55.8636 92.7085C55.8144 92.9203 56.5011 93.2029 56.5559 93.0867C56.5424 92.7742 56.0923 92.7533 55.8636 92.7085Z"
        fill="#05531E"
      />
      <path
        d="M56.0234 95.5179C55.978 95.5518 55.9457 95.3698 55.7038 95.5179C58.4692 90.2582 61.4636 85.0855 63.2659 79.3641L64.0115 79.4722C62.0886 84.0762 60.2619 88.7851 57.7275 93.0867C57.2885 93.8318 56.6423 95.0548 56.0234 95.5179Z"
        fill="#39854E"
      />
      <path
        d="M78.0706 83.308C75.4373 90.3721 74.326 97.996 74.8753 105.567C62.2036 105.6 49.5236 105.599 36.8519 105.567C37.1717 98.0153 35.5209 90.4992 33.1241 83.4161C34.843 82.7033 43.204 79.8892 44.627 79.9584C44.6032 80.6401 44.832 81.5333 45.053 82.1735C46.0946 85.1913 51.6842 94.2004 54.266 95.8421C55.4051 96.5663 55.0382 95.9256 55.7038 95.5179C55.9457 95.3698 55.978 95.5518 56.0234 95.5179C55.6453 95.9958 55.7232 97.1838 56.3962 96.9226C57.5865 96.4603 64.1928 81.716 64.544 79.4182C69.2028 80.6605 73.5045 81.5868 78.0706 83.308Z"
        fill="#337B32"
      />
      <path
        d="M46.2246 79.6343C47.9171 83.2586 49.9376 86.7082 52.4021 89.8452C52.7349 90.2688 54.9372 92.4646 54.9583 92.6545C54.9644 92.7089 54.426 93.5663 54.3725 93.573C53.5081 93.6811 45.5122 81.7534 45.7986 79.6343C45.9286 79.6041 46.0945 79.6642 46.2246 79.6343Z"
        fill="#005723"
      />
      <path
        d="M74.8753 105.567C74.326 97.996 75.4373 90.3721 78.0706 83.308C80.0425 84.0513 81.8211 84.2199 82.7569 86.4956L86.6978 105.513C82.7594 105.619 78.8143 105.556 74.8753 105.567Z"
        fill="#003415"
      />
      <path
        d="M33.1241 83.4161C35.521 90.4992 37.1717 98.0153 36.8519 105.567C32.776 105.556 28.6707 105.709 24.6034 105.405L29.2898 86.3875C30.0669 84.5493 31.4759 84.0995 33.1241 83.4161Z"
        fill="#003415"
      />
      <path
        d="M55.8636 92.7085C56.0922 92.7533 56.5424 92.7742 56.5559 93.0867C56.501 93.2029 55.8144 92.9203 55.8636 92.7085Z"
        fill="#1F6F3F"
      />
    </g>
    <defs>
      <clipPath id="clip0_8654_87465">
        <rect width="109.065" height="110.645" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const ShareXLetterIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="14.109"
    height="17.367"
    viewBox="44.9453 33.3164 14.1094 17.3672"
    fill="none"
  >
    <path
      d="M46.6211 50.6836C45.6836 50.6836 44.9453 50.0039 44.9453 49.1484C44.9453 48.7148 45.0859 48.3398 45.4258 47.8711L49.6445 41.9883V41.8945L45.5664 36.3398C45.1797 35.8242 45.0508 35.4375 45.0508 34.9805C45.0508 34.0195 45.8125 33.3164 46.8438 33.3164C47.5117 33.3164 47.9805 33.6094 48.4375 34.3008L52.0586 39.6445H52.1523L55.8906 34.1836C56.3008 33.5742 56.6523 33.3164 57.332 33.3164C58.2578 33.3164 59.0547 33.9844 59.0547 34.8281C59.0547 35.2852 58.9258 35.6602 58.5859 36.0938L54.1914 41.9648V42.0469L58.457 47.8008C58.7852 48.2227 58.9258 48.6211 58.9258 49.0898C58.9258 50.0156 58.2109 50.6836 57.2266 50.6836C56.582 50.6836 56.1484 50.4258 55.6914 49.8047L51.918 44.543H51.8242L48.1094 49.8164C47.6641 50.4609 47.2891 50.6836 46.6211 50.6836Z"
      fill="white"
    />
  </svg>
);

// ---- Talent profile · share card ----

export const ShareCardShieldIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g>
      <path
        d="M8.19699 2.02051C8.06696 1.99316 7.93304 1.99316 7.80301 2.02051C7.67723 2.04697 7.54563 2.1139 7.05949 2.38983L3.15783 4.60437C3.03128 4.67619 2.95958 4.71719 2.90732 4.75123C2.86772 4.77703 2.85788 4.7872 2.85807 4.78714C2.8581 4.78713 2.85841 4.78683 2.85891 4.78628C2.83844 4.80904 2.822 4.83712 2.81171 4.86907C2.80688 4.88406 2.8 4.91218 2.8 5.23552V7.75012C2.8 9.59738 3.72805 11.306 5.24176 12.2725L7.64788 13.8089C7.77662 13.8911 7.85006 13.9377 7.90723 13.9693C7.9406 13.9877 7.95619 13.994 7.9607 13.9956C7.98665 14.0015 8.01335 14.0015 8.03931 13.9956C8.04381 13.994 8.0594 13.9877 8.09277 13.9693C8.14995 13.9377 8.22338 13.8911 8.35212 13.8089L10.7582 12.2725C12.272 11.306 13.2 9.59739 13.2 7.75012V5.23552C13.2 4.91218 13.1931 4.88406 13.1883 4.86907C13.178 4.83713 13.1616 4.80904 13.1411 4.78629C13.138 4.78337 13.1257 4.77272 13.0927 4.75123C13.0404 4.71719 12.9687 4.67619 12.8422 4.60437L8.94051 2.38983C8.45437 2.1139 8.32277 2.04697 8.19699 2.02051ZM8.03787 13.9961C8.03787 13.9961 8.03829 13.9959 8.03905 13.9957ZM7.96213 13.9961C7.96211 13.9961 7.96174 13.996 7.96095 13.9957ZM7.55602 0.846204C7.84893 0.784599 8.15107 0.784599 8.44398 0.846204C8.77647 0.916136 9.0803 1.0889 9.46423 1.30722C9.48682 1.32006 9.50968 1.33307 9.53285 1.34621L13.4345 3.56075C13.4503 3.56971 13.4662 3.57869 13.4822 3.58771C13.6739 3.69591 13.878 3.81111 14.0333 3.98378C14.1679 4.13349 14.2689 4.31005 14.3305 4.50115C14.4011 4.72025 14.4006 4.9544 14.4001 5.17997C14.4 5.19855 14.4 5.21707 14.4 5.23552V7.75012C14.4 9.99681 13.2715 12.0915 11.4041 13.2839L8.99793 14.8203C8.98164 14.8307 8.96526 14.8412 8.94876 14.8518C8.75562 14.9759 8.54763 15.1095 8.31213 15.1642C8.1067 15.2119 7.8933 15.2119 7.68787 15.1642C7.45237 15.1095 7.24437 14.9759 7.05123 14.8518C7.03474 14.8412 7.01835 14.8307 7.00207 14.8203L4.59594 13.2839C2.72849 12.0915 1.6 9.99681 1.6 7.75012V5.23552C1.6 5.21707 1.59996 5.19855 1.59992 5.17996C1.59943 4.9544 1.59893 4.72025 1.66951 4.50115C1.73106 4.31005 1.83207 4.13349 1.96673 3.98378C2.12204 3.81111 2.32613 3.69591 2.51782 3.58771C2.53381 3.57868 2.54971 3.56971 2.56549 3.56075L6.46715 1.34621C6.49032 1.33307 6.51319 1.32006 6.53578 1.30722C6.9197 1.0889 7.22353 0.916136 7.55602 0.846204Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#2D5D33"
      />
    </g>
  </svg>
);

export const ShareCardInfoIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
  >
    <g>
      <path
        d="M7 1.75C4.10051 1.75 1.75 4.10051 1.75 7C1.75 9.89949 4.10051 12.25 7 12.25C9.89949 12.25 12.25 9.89949 12.25 7C12.25 4.10051 9.89949 1.75 7 1.75ZM0.7 7C0.7 3.52061 3.52061 0.7 7 0.7C10.4794 0.7 13.3 3.52061 13.3 7C13.3 10.4794 10.4794 13.3 7 13.3C3.52061 13.3 0.7 10.4794 0.7 7ZM7 3.5C7.28995 3.5 7.525 3.73505 7.525 4.025V5.075C7.525 5.36495 7.28995 5.6 7 5.6C6.71005 5.6 6.475 5.36495 6.475 5.075V4.025C6.475 3.73505 6.71005 3.5 7 3.5ZM7 7C7.28995 7 7.525 7.23505 7.525 7.525V9.975C7.525 10.2649 7.28995 10.5 7 10.5C6.71005 10.5 6.475 10.2649 6.475 9.975V7.525C6.475 7.23505 6.71005 7 7 7Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#737373"
      />
    </g>
  </svg>
);

export const ShareCardMobileIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
  >
    <g>
      <path
        d="M2.25 2.8125C2.25 1.67341 3.17341 0.75 4.3125 0.75H10.6875C11.8266 0.75 12.75 1.67341 12.75 2.8125V12.1875C12.75 13.3266 11.8266 14.25 10.6875 14.25H4.3125C3.17341 14.25 2.25 13.3266 2.25 12.1875V2.8125ZM4.3125 1.875C3.79473 1.875 3.375 2.29473 3.375 2.8125V12.1875C3.375 12.7053 3.79473 13.125 4.3125 13.125H10.6875C11.2053 13.125 11.625 12.7053 11.625 12.1875V2.8125C11.625 2.29473 11.2053 1.875 10.6875 1.875H4.3125ZM6.75 11.4375C6.75 11.1268 7.00184 10.875 7.3125 10.875H7.6875C7.99816 10.875 8.25 11.1268 8.25 11.4375C8.25 11.7482 7.99816 12 7.6875 12H7.3125C7.00184 12 6.75 11.7482 6.75 11.4375Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
      />
    </g>
  </svg>
);

export const ShareCardWorkIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
  >
    <g>
      <path
        d="M1.25 8.75C1.25 6.99444 1.25 6.11663 1.67132 5.48608C1.85372 5.2131 2.0881 4.97872 2.36107 4.79632C2.99163 4.375 3.86943 4.375 5.625 4.375H9.375C11.1306 4.375 12.0084 4.375 12.6389 4.79632C12.9119 4.97872 13.1462 5.2131 13.3287 5.48608C13.75 6.11663 13.75 6.99444 13.75 8.75C13.75 10.5056 13.75 11.3834 13.3287 12.0139C13.1462 12.2869 12.9119 12.5212 12.6389 12.7037C12.0084 13.125 11.1306 13.125 9.375 13.125H5.625C3.86943 13.125 2.99163 13.125 2.36107 12.7037C2.0881 12.5212 1.85372 12.2869 1.67132 12.0139C1.25 11.3834 1.25 10.5056 1.25 8.75Z"
        strokeWidth="0.625"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
      <path
        d="M10 4.375C10 3.19649 10 2.60723 9.63387 2.24112C9.26775 1.875 8.6785 1.875 7.5 1.875C6.3215 1.875 5.73223 1.875 5.36612 2.24112C5 2.60723 5 3.19649 5 4.375"
        strokeWidth="0.625"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
      <path
        d="M3.75 6.875L4.15748 7.00125C6.30319 7.66625 8.69681 7.66625 10.8425 7.00125L11.25 6.875M7.5 7.5V8.75"
        strokeWidth="0.625"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
    </g>
  </svg>
);

export const ShareCardCheckWhiteIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
  >
    <g>
      <path
        d="M10.836 3.88532C11.0978 4.09678 11.1386 4.48045 10.9272 4.74227L6.66156 10.0235C6.55049 10.161 6.38517 10.2435 6.20851 10.2496C6.03184 10.2557 5.86124 10.1848 5.74095 10.0553L3.10033 7.21152C2.87132 6.9649 2.8856 6.57933 3.13223 6.35033C3.37885 6.12132 3.76442 6.1356 3.99342 6.38222L6.15542 8.71053L9.97907 3.97648C10.1905 3.71467 10.5742 3.67385 10.836 3.88532Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="white"
      />
    </g>
  </svg>
);

export const ShareCardEditIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
  >
    <g>
      <path
        d="M9.02387 1.43367C9.49363 0.963908 10.1308 0.7 10.7951 0.7C12.1785 0.7 13.3 1.82148 13.3 3.2049C13.3 3.86924 13.0361 4.50637 12.5663 4.97613L4.39623 13.1462C4.29777 13.2447 4.16424 13.3 4.025 13.3H1.225C0.93505 13.3 0.7 13.0649 0.7 12.775V9.975C0.7 9.83576 0.755312 9.70222 0.853769 9.60377L9.02387 1.43367ZM10.7951 1.75C10.4092 1.75 10.0392 1.90328 9.76633 2.17613L9.49246 2.45L11.55 4.50754L11.8239 4.23367C12.0967 3.96082 12.25 3.59076 12.25 3.2049C12.25 2.40138 11.5986 1.75 10.7951 1.75ZM10.8075 5.25L8.75 3.19246L1.75 10.1925V12.25H3.80754L10.8075 5.25Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#387440"
      />
    </g>
  </svg>
);

export const ShareCardFlagIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="9.92"
    height="9.92"
    viewBox="0 0 9.92 9.92"
    fill="none"
  >
    <g>
      <path d="M0 3.875H9.92V6.045H0V3.875Z" fill="#F9CB38" />
      <path
        d="M8.37 1.55H1.55C0.522815 1.55 0 2.31337 0 3.255V3.875H9.92V3.255C9.92 2.31337 9.39719 1.55 8.37 1.55Z"
        fill="#EC1C24"
      />
      <path
        d="M0 6.665C0 7.60663 0.522815 8.37 1.55 8.37H8.37C9.39719 8.37 9.92 7.60663 9.92 6.665V6.045H0V6.665Z"
        fill="#137A08"
      />
      <path
        d="M4.92559 4.00288L5.22737 4.61435L5.9024 4.71324L5.41431 5.1894L5.52962 5.86102L4.92559 5.54373L4.32171 5.86102L4.43703 5.1894L3.94878 4.71324L4.62396 4.61435L4.92559 4.00288Z"
        fill="#25333A"
      />
    </g>
  </svg>
);

export const ShareCardChipCheckIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="8.68"
    height="8.68"
    viewBox="0 0 8.68 8.68"
    fill="none"
  >
    <g>
      <path
        d="M6.56128 1.92035C6.73609 2.06154 6.76334 2.31772 6.62215 2.49253L3.77402 6.01878C3.69986 6.1106 3.58948 6.16569 3.47153 6.16976C3.35357 6.17383 3.23966 6.12647 3.15934 6.03998L1.39622 4.14123C1.24331 3.97657 1.25285 3.71912 1.41752 3.56622C1.58218 3.41331 1.83963 3.42285 1.99253 3.58752L3.43608 5.1421L5.9891 1.98122C6.1303 1.80641 6.38647 1.77916 6.56128 1.92035Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1C2A21"
      />
    </g>
  </svg>
);

export const ShareCardLockIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
  >
    <rect x="2.6" y="6" width="8.8" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.1" />
    <path
      d="M4.6 6V4.5a2.4 2.4 0 0 1 4.8 0V6"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    />
  </svg>
);

export const ShareCardStarIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
  >
    <path
      d="M7 1.4l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.6l-3.2 1.7.6-3.6L1.8 5.2l3.6-.5L7 1.4z"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
  </svg>
);

export const ShareCardRefreshIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M13 6.2A5.2 5.2 0 0 0 3.4 4.9L2.4 6.2M2.4 3v3.2h3.2"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 9.8a5.2 5.2 0 0 0 9.6 1.3l1-1.3M13.6 13V9.8h-3.2"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ShareCardDownloadIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M8 2.4v7.2M5 6.8l3 3 3-3M2.8 11.2v1.4c0 .5.4.9.9.9h8.6c.5 0 .9-.4.9-.9v-1.4"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ShareCardFolderIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
  >
    <path
      d="M1.6 3.9c0-.7.5-1.2 1.2-1.2h2.4l1.3 1.5h4.7c.7 0 1.2.5 1.2 1.2v4.5c0 .7-.5 1.2-1.2 1.2H2.8c-.7 0-1.2-.5-1.2-1.2V3.9z"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
  </svg>
);

export const ShareCardWifiOffIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
  >
    <path
      d="M3 8.2a12.6 12.6 0 0 1 4.2-2.4M18.9 8.2a12.6 12.6 0 0 0-5.2-2.7M6 11.4a8 8 0 0 1 2.6-1.6M16 11.4a8 8 0 0 0-2.4-1.5M8.6 14.5a4.2 4.2 0 0 1 4.8-.2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="11" cy="17.4" r="1.1" fill="currentColor" />
    <path d="M3.6 3.6l14.8 14.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const ShareCardHourglassIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
  >
    <path
      d="M4.5 2.5h9M4.5 15.5h9M5.4 2.5c0 3 1.6 4.2 3.6 6.5-2 2.3-3.6 3.5-3.6 6.5M12.6 2.5c0 3-1.6 4.2-3.6 6.5 2 2.3 3.6 3.5 3.6 6.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ShareCardCheckCircleIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
  >
    <circle cx="9" cy="9" r="9" fill="currentColor" />
    <path
      d="M5.2 9.2l2.5 2.5 5-5.2"
      stroke="#fff"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ShareCardUserIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
  >
    <circle cx="13" cy="9.6" r="4.4" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M4.6 22c.7-4.2 4-6.4 8.4-6.4s7.7 2.2 8.4 6.4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

export const ShareCardTrophyIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
  >
    <path
      d="M6.2 3.6h9.6v4.6a4.8 4.8 0 0 1-9.6 0V3.6z"
      fill="#ffd86b"
      stroke="#1c2a21"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path
      d="M6.2 5H3.4v1.4a3 3 0 0 0 3 3M15.8 5h2.8v1.4a3 3 0 0 1-3 3M11 13v3.2M7.6 18.4h6.8"
      stroke="#1c2a21"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ShareCardSparkleDoodle = ({ className = '' }) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M8 0c.5 4.6 3.4 7.5 8 8-4.6.5-7.5 3.4-8 8-.5-4.6-3.4-7.5-8-8 4.6-.5 7.5-3.4 8-8z"
      fill="#fff"
    />
  </svg>
);

export const ShareCardSquiggleDoodle = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 96 7"
    fill="none"
    preserveAspectRatio="none"
  >
    <path
      d="M1 4.5C5.5 0.5 10 0.5 14.5 3.5s9 3 13.5 0 9-3 13.5 0 9 3 13.5 0 9-3 13.5 0 9 3 13.5 0"
      stroke="#ffd86b"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

/* Figma `20-info-circle` (banner safe-zone note) — drawn to the 16px frame; asset node not exported. */
export const ShareInfoCircleIcon = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <circle cx="8" cy="8" r="6.5" stroke="#387440" strokeWidth="1.3" />
    <path d="M8 7.25V11" stroke="#387440" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="8" cy="5" r="0.85" fill="#387440" />
  </svg>
);

// ---- Talent profile · recruiter / public preview ----

export const ProfileWalletGlyph = ({ className = '' }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g clipPath="url(#ProfileWalletGlyph-clip0_0_5)">
      <path
        d="M0.75 2.8125C0.75 1.67341 1.67341 0.75 2.8125 0.75H9.5625C9.87316 0.75 10.125 1.00184 10.125 1.3125C10.125 1.62316 9.87316 1.875 9.5625 1.875H2.8125C2.29473 1.875 1.875 2.29473 1.875 2.8125V3H12.1875C13.3266 3 14.25 3.92341 14.25 5.0625V12.1875C14.25 13.3266 13.3266 14.25 12.1875 14.25H2.8125C1.67341 14.25 0.75 13.3266 0.75 12.1875V2.8125ZM1.875 4.125V12.1875C1.875 12.7053 2.29473 13.125 2.8125 13.125H12.1875C12.7053 13.125 13.125 12.7053 13.125 12.1875V5.0625C13.125 4.54473 12.7053 4.125 12.1875 4.125H1.875ZM10.6875 8.25C10.4804 8.25 10.3125 8.41789 10.3125 8.625C10.3125 8.83211 10.4804 9 10.6875 9C10.8946 9 11.0625 8.83211 11.0625 8.625C11.0625 8.41789 10.8946 8.25 10.6875 8.25ZM9.1875 8.625C9.1875 7.79657 9.85907 7.125 10.6875 7.125C11.5159 7.125 12.1875 7.79657 12.1875 8.625C12.1875 9.45343 11.5159 10.125 10.6875 10.125C9.85907 10.125 9.1875 9.45343 9.1875 8.625Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#1C2A21"
      />
    </g>
    <defs>
      <clipPath id="ProfileWalletGlyph-clip0_0_5">
        <rect width="15" height="15" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const ProfilePhoneGlyph = ({ className = '' }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M0.75 4.03099C0.75 2.21895 2.21895 0.75 4.03099 0.75C4.36042 0.75 4.67636 0.880866 4.9093 1.11381L4.91333 1.11784L4.98557 1.19175C5.0314 1.23868 5.09686 1.3058 5.17552 1.3867C5.33275 1.54841 5.54309 1.76559 5.75492 1.98684C5.9662 2.2075 6.18127 2.43463 6.34701 2.61541C6.42935 2.70522 6.50321 2.78761 6.55938 2.85374C6.58695 2.8862 6.61501 2.9203 6.63908 2.9523C6.65091 2.96802 6.66618 2.98906 6.68132 3.01286L6.6819 3.01375C6.69133 3.02855 6.72615 3.08319 6.7501 3.15692C6.83575 3.42052 6.83575 3.70448 6.7501 3.96809C6.71006 4.09132 6.63295 4.19141 6.60426 4.22866L6.60325 4.22996C6.55973 4.28648 6.50773 4.34652 6.45544 4.40443C6.35032 4.52083 6.21576 4.65955 6.08256 4.79628L6.06208 4.8173C5.78545 5.10126 5.52889 5.3646 5.4073 5.52627C5.22605 5.76725 5.18761 6.16671 5.27471 6.40804C5.27471 6.40804 5.27486 6.40834 5.27553 6.40994C5.27907 6.41832 5.42265 6.71764 5.4535 6.78398C5.48642 6.85481 5.40194 6.6823 5.4535 6.78398C5.55817 6.99041 5.68537 7.22313 5.80358 7.40398C6.34973 8.23957 6.76032 8.63853 7.60057 9.19943C7.81852 9.34492 8.10035 9.49832 8.35028 9.62305C8.4735 9.68454 8.58476 9.73698 8.67084 9.77574C8.75231 9.81243 8.79516 9.82956 8.80496 9.83348C8.80672 9.83418 8.80709 9.83435 8.80709 9.83435C9.02782 9.90675 9.26757 9.89462 9.47986 9.80032C9.59645 9.74852 9.90214 9.55309 10.2541 9.3224C10.2805 9.30511 10.3069 9.28778 10.3332 9.27052C10.4681 9.18204 10.5998 9.09558 10.7079 9.02699C10.7723 8.98613 10.8345 8.94767 10.8875 8.91714C10.9138 8.90202 10.9433 8.88568 10.973 8.871C10.9925 8.86137 11.0507 8.83253 11.1217 8.81494C11.3291 8.76354 11.5459 8.76354 11.7533 8.81494C11.846 8.83792 11.9345 8.88579 11.9658 8.90273C11.9672 8.90349 11.9697 8.90482 11.9697 8.90482C12.0207 8.93233 12.0795 8.96653 12.1399 9.0029C12.2619 9.07625 12.4109 9.17046 12.5592 9.26596C12.8564 9.45742 13.1664 9.66409 13.2842 9.7426C13.8874 10.1447 14.25 10.8219 14.25 11.5468C14.25 13.0397 13.0397 14.25 11.5468 14.25H9.68669C8.77564 14.25 7.87799 14.0306 7.06968 13.6102C4.63768 12.3456 2.6544 10.3623 1.38976 7.93032C0.969442 7.12201 0.75 6.22436 0.75 5.31331V4.03099ZM4.11259 1.9081C4.09075 1.88689 4.06148 1.875 4.03099 1.875C2.84027 1.875 1.875 2.84027 1.875 4.03099V5.31331C1.875 6.04368 2.05092 6.7633 2.38788 7.41129C3.54585 9.63816 5.36184 11.4542 7.58871 12.6121C8.2367 12.9491 8.95632 13.125 9.68669 13.125H11.5468C12.4184 13.125 13.125 12.4184 13.125 11.5468C13.125 11.198 12.9507 10.8723 12.6605 10.6789C12.5428 10.6004 12.2392 10.398 11.95 10.2118C11.8049 10.1183 11.6673 10.0314 11.5601 9.96696C11.5131 9.93868 11.4756 9.91694 11.4479 9.90168C11.4429 9.9014 11.4379 9.90132 11.4328 9.90145C11.4023 9.91946 11.3616 9.94457 11.3107 9.97689C11.2105 10.0405 11.0876 10.1211 10.9525 10.2097C10.9257 10.2273 10.8985 10.2452 10.8708 10.2633C10.565 10.4638 10.1597 10.7293 9.93658 10.8284C9.46953 11.0359 8.94208 11.0626 8.45647 10.9033C8.35141 10.8689 8.10416 10.7575 7.84793 10.6297C7.57953 10.4957 7.25031 10.3182 6.97597 10.1351C6.01969 9.49676 5.49751 8.99196 4.86189 8.01948C4.57202 7.576 4.26884 6.93491 4.21652 6.78995C4.01091 6.22026 4.08116 5.41785 4.50822 4.85005C4.67517 4.62807 4.97612 4.3195 5.222 4.06739C5.24058 4.04834 5.25885 4.02962 5.27671 4.01128C5.41289 3.87149 5.53216 3.74826 5.62049 3.65044C5.64939 3.61844 5.67202 3.5924 5.68911 3.57188C5.68918 3.57033 5.68924 3.56878 5.68928 3.56723C5.6475 3.51865 5.58943 3.45382 5.51777 3.37566C5.36041 3.20402 5.15205 2.9839 4.94233 2.76486C4.73318 2.54641 4.52499 2.33145 4.36892 2.17093C4.29093 2.09072 4.22606 2.02421 4.18073 1.97779L4.11259 1.9081Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#1C2A21"
    />
  </svg>
);

export const ProfileCBulbIcon = ({ className = '' }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M3.00016 8.16602C2.57695 7.4708 2.3335 6.65623 2.3335 5.78535C2.3335 3.23416 4.42283 1.16602 7.00016 1.16602C9.57751 1.16602 11.6668 3.23416 11.6668 5.78535C11.6668 6.65623 11.4234 7.4708 11.0001 8.16602"
      strokeWidth="0.65625"
      strokeLinecap="round"
      stroke="#463409"
    />
    <path
      d="M8.16683 5.83398C7.80954 6.20918 7.41497 6.41732 7.00016 6.41732C6.58535 6.41732 6.19079 6.20918 5.8335 5.83398"
      strokeWidth="0.65625"
      strokeLinecap="round"
      stroke="#463409"
    />
    <path
      d="M4.30651 9.9746C4.25292 9.81325 4.22613 9.73258 4.22925 9.66724C4.23585 9.52899 4.323 9.4076 4.45159 9.35761C4.51238 9.33398 4.59712 9.33398 4.76659 9.33398H9.23307C9.40259 9.33398 9.48729 9.33398 9.54807 9.35761C9.6767 9.4076 9.76384 9.52899 9.77044 9.66724C9.77353 9.73258 9.74675 9.81325 9.69314 9.9746C9.59409 10.2728 9.54457 10.422 9.46821 10.5427C9.3082 10.7956 9.05737 10.9771 8.76769 11.0495C8.62938 11.084 8.47275 11.084 8.15956 11.084H5.84011C5.52689 11.084 5.3703 11.084 5.23201 11.0495C4.94232 10.9771 4.69148 10.7956 4.53146 10.5427C4.45507 10.422 4.40556 10.2728 4.30651 9.9746Z"
      strokeWidth="0.65625"
      stroke="#463409"
    />
    <path
      d="M8.75 11.084L8.67457 11.4612C8.59209 11.8736 8.55085 12.0799 8.45839 12.2428C8.31553 12.4948 8.08395 12.6846 7.80885 12.7753C7.63093 12.834 7.42064 12.834 7.00001 12.834H7H6.99999C6.57936 12.834 6.36907 12.834 6.19115 12.7753C5.91605 12.6846 5.68449 12.4948 5.54159 12.2428C5.44917 12.0799 5.40793 11.8736 5.32544 11.4612L5.25 11.084"
      strokeWidth="0.65625"
      stroke="#463409"
    />
    <path
      d="M7 9.04102V6.41602"
      strokeWidth="0.65625"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#463409"
    />
  </svg>
);

// ---- Talent profile · visibility drawer ----
// Exported from Figma, colours replaced by currentColor so the same glyph serves the selected (white) and
// unselected (grey) segment states.

export const ProfileGlobeGlyph = ({ className = '' }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g clipPath="url(#ProfileGlobeGlyph-clip0_0_15)">
      <path
        d="M1.77587 6.47422H4.20891C4.25823 5.03519 4.50888 3.72325 4.90282 2.72325C4.99504 2.48915 5.09693 2.26751 5.20863 2.06275C3.3486 2.73786 1.97841 4.43429 1.77587 6.47422ZM6.99995 0.699219C3.52056 0.699219 0.699951 3.51982 0.699951 6.99922C0.699951 10.4786 3.52056 13.2992 6.99995 13.2992C10.4793 13.2992 13.3 10.4786 13.3 6.99922C13.3 3.51982 10.4793 0.699219 6.99995 0.699219ZM6.99995 1.74922C6.87977 1.74922 6.70996 1.80893 6.4986 2.03586C6.28652 2.26356 6.07138 2.62166 5.87975 3.1081C5.54156 3.96658 5.30857 5.14307 5.25956 6.47422H8.74034C8.69133 5.14307 8.45834 3.96658 8.12015 3.1081C7.92853 2.62166 7.71338 2.26356 7.50131 2.03586C7.28995 1.80893 7.12013 1.74922 6.99995 1.74922ZM9.79099 6.47422C9.74167 5.03519 9.49102 3.72325 9.09708 2.72325C9.00486 2.48915 8.90298 2.26751 8.79127 2.06275C10.6513 2.73786 12.0215 4.43429 12.224 6.47422H9.79099ZM8.74034 7.52422H5.25956C5.30857 8.85537 5.54156 10.0319 5.87975 10.8903C6.07138 11.3768 6.28652 11.7349 6.4986 11.9626C6.70996 12.1895 6.87977 12.2492 6.99995 12.2492C7.12013 12.2492 7.28995 12.1895 7.50131 11.9626C7.71338 11.7349 7.92853 11.3768 8.12015 10.8903C8.45834 10.0319 8.69133 8.85537 8.74034 7.52422ZM8.79127 11.9357C8.90298 11.7309 9.00486 11.5093 9.09708 11.2752C9.49102 10.2752 9.74167 8.96325 9.79099 7.52422H12.224C12.0215 9.56415 10.6513 11.2606 8.79127 11.9357ZM5.20863 11.9357C5.09693 11.7309 4.99504 11.5093 4.90282 11.2752C4.50888 10.2752 4.25823 8.96325 4.20891 7.52422H1.77587C1.97841 9.56415 3.3486 11.2606 5.20863 11.9357Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="ProfileGlobeGlyph-clip0_0_15">
        <rect width="14" height="14" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const ProfileWorkGlyph = ({ className = '' }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M1.16675 8.16732C1.16675 6.52879 1.16675 5.70951 1.55998 5.12099C1.73022 4.86621 1.94897 4.64746 2.20375 4.47722C2.79227 4.08398 3.61154 4.08398 5.25008 4.08398H8.75008C10.3886 4.08398 11.2079 4.08398 11.7964 4.47722C12.0512 4.64746 12.2699 4.86621 12.4402 5.12099C12.8334 5.70951 12.8334 6.52879 12.8334 8.16732C12.8334 9.80584 12.8334 10.6251 12.4402 11.2137C12.2699 11.4684 12.0512 11.6872 11.7964 11.8574C11.2079 12.2507 10.3886 12.2507 8.75008 12.2507H5.25008C3.61154 12.2507 2.79227 12.2507 2.20375 11.8574C1.94897 11.6872 1.73022 11.4684 1.55998 11.2137C1.16675 10.6251 1.16675 9.80584 1.16675 8.16732Z"
      strokeWidth="0.583333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M9.33342 4.08333C9.33342 2.98339 9.33341 2.43342 8.9917 2.09171C8.64998 1.75 8.10001 1.75 7.00008 1.75C5.90015 1.75 5.35016 1.75 5.00846 2.09171C4.66675 2.43342 4.66675 2.98339 4.66675 4.08333"
      strokeWidth="0.583333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M3.5 6.41602L3.88032 6.53385C5.88298 7.15452 8.11703 7.15452 10.1197 6.53385L10.5 6.41602M7 6.99935V8.16602"
      strokeWidth="0.583333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const ProfilePauseGlyph = ({ className = '' }) => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M6.58745 3.40039C6.93953 3.40039 7.22495 3.68581 7.22495 4.03789V12.9629C7.22495 13.315 6.93953 13.6004 6.58745 13.6004C6.23537 13.6004 5.94995 13.315 5.94995 12.9629V4.03789C5.94995 3.68581 6.23537 3.40039 6.58745 3.40039ZM10.4125 3.40039C10.7645 3.40039 11.05 3.68581 11.05 4.03789V12.9629C11.05 13.315 10.7645 13.6004 10.4125 13.6004C10.0604 13.6004 9.77495 13.315 9.77495 12.9629V4.03789C9.77495 3.68581 10.0604 3.40039 10.4125 3.40039Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    />
  </svg>
);

export const ProfileImageGlyph = ({ className = '' }) => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 19 19"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M0.949971 3.56172C0.949971 2.11888 2.11963 0.949219 3.56247 0.949219H15.4375C16.8803 0.949219 18.05 2.11888 18.05 3.56172V12.1098C18.05 12.1112 18.05 12.1126 18.05 12.114V15.4367C18.05 16.8796 16.8803 18.0492 15.4375 18.0492H3.56247C2.11963 18.0492 0.949971 16.8796 0.949971 15.4367V11.9591C0.949945 11.9556 0.949945 11.952 0.949971 11.9485V3.56172ZM2.37497 12.2891V15.4367C2.37497 16.0926 2.90663 16.6242 3.56247 16.6242H15.4375C16.0933 16.6242 16.625 16.0926 16.625 15.4367V12.4213L13.701 9.69233L11.0939 11.4304L13.1011 13.5179C13.3738 13.8015 13.365 14.2526 13.0813 14.5253C12.7977 14.7981 12.3466 14.7892 12.0739 14.5056L6.59415 8.80665L2.37497 12.2891ZM10.0904 10.3868L7.16356 7.34288C6.90532 7.07431 6.48376 7.05005 6.19642 7.28722L2.37497 10.4414V3.56172C2.37497 2.90588 2.90663 2.37422 3.56247 2.37422H15.4375C16.0933 2.37422 16.625 2.90588 16.625 3.56172V10.4721L14.2611 8.26584C14.0196 8.04038 13.6547 8.01059 13.3797 8.19388L10.0904 10.3868Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    />
  </svg>
);

export const ProfilePinGlyph = ({ className = '' }) => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 19 19"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M13.5274 4.06408C11.3021 1.81093 7.69791 1.81093 5.47262 4.06408C3.24246 6.32217 3.24246 9.98687 5.47262 12.2449L9.5 16.3228L13.5274 12.2449C15.7575 9.98687 15.7575 6.32217 13.5274 4.06408ZM9.5 17.3367L8.99302 17.8374L4.45874 13.2463C1.68042 10.4332 1.68042 5.87586 4.45874 3.06275C7.24192 0.24471 11.7581 0.24471 14.5413 3.06275C17.3196 5.87586 17.3196 10.4332 14.5413 13.2463L10.0075 17.8368L9.5 17.3367ZM9.5 17.3367L10.0075 17.8368C9.87366 17.9723 9.6905 18.0492 9.5 18.0492C9.3095 18.0492 9.12689 17.9729 8.99302 17.8374L9.5 17.3367ZM9.5 6.17422C8.71299 6.17422 8.075 6.81221 8.075 7.59922C8.075 8.38623 8.71299 9.02422 9.5 9.02422C10.287 9.02422 10.925 8.38623 10.925 7.59922C10.925 6.81221 10.287 6.17422 9.5 6.17422ZM6.65 7.59922C6.65 6.02521 7.92599 4.74922 9.5 4.74922C11.074 4.74922 12.35 6.02521 12.35 7.59922C12.35 9.17323 11.074 10.4492 9.5 10.4492C7.92599 10.4492 6.65 9.17323 6.65 7.59922Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    />
  </svg>
);

export const ProfileShieldGlyph = ({ className = '' }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M7.17241 1.76717C7.05863 1.74324 6.94145 1.74324 6.82768 1.76717C6.71762 1.79031 6.60247 1.84889 6.1771 2.09032L2.76315 4.02804C2.65241 4.09089 2.58967 4.12676 2.54395 4.15654C2.5093 4.17912 2.50069 4.18801 2.50086 4.18796C2.50088 4.18795 2.50116 4.1877 2.50159 4.18721C2.48368 4.20713 2.4693 4.2317 2.46029 4.25966C2.45607 4.27277 2.45004 4.29738 2.45004 4.5803V6.78057C2.45004 8.39693 3.26209 9.89194 4.58658 10.7377L6.69194 12.082C6.80458 12.154 6.86884 12.1947 6.91887 12.2223C6.94807 12.2385 6.96171 12.244 6.96565 12.2454C6.98836 12.2505 7.01172 12.2505 7.03443 12.2454C7.03838 12.244 7.05202 12.2385 7.08121 12.2223C7.13124 12.1947 7.1955 12.1539 7.30815 12.082L9.41351 10.7377C10.738 9.89194 11.55 8.39693 11.55 6.78057V4.5803C11.55 4.29738 11.544 4.27277 11.5398 4.25966C11.5308 4.23171 11.5164 4.20713 11.4985 4.18722C11.4958 4.18467 11.485 4.17535 11.4561 4.15654C11.4104 4.12676 11.3477 4.09089 11.2369 4.02804L7.82299 2.09032C7.39762 1.84889 7.28247 1.79031 7.17241 1.76717ZM7.03318 12.2458C7.03318 12.2458 7.03355 12.2456 7.03421 12.2455ZM6.9669 12.2458C6.96689 12.2458 6.96656 12.2457 6.96588 12.2455ZM6.61156 0.739647C6.86786 0.685743 7.13223 0.685743 7.38852 0.739647C7.67946 0.800838 7.9453 0.952007 8.28124 1.14303C8.30101 1.15427 8.32102 1.16565 8.34129 1.17716L11.7552 3.11488C11.769 3.12271 11.783 3.13057 11.797 3.13847C11.9647 3.23314 12.1433 3.33394 12.2792 3.48502C12.397 3.61602 12.4854 3.77051 12.5392 3.93773C12.601 4.12944 12.6005 4.33432 12.6001 4.53169C12.6001 4.54795 12.6 4.56416 12.6 4.5803V6.78057C12.6 8.74642 11.6126 10.5793 9.97859 11.6226L7.87323 12.967C7.85898 12.9761 7.84464 12.9853 7.83021 12.9946C7.66121 13.1031 7.47922 13.22 7.27316 13.2679C7.0934 13.3097 6.90668 13.3097 6.72693 13.2679C6.52087 13.22 6.33887 13.1031 6.16987 12.9946C6.15544 12.9853 6.1411 12.9761 6.12685 12.967L4.02149 11.6226C2.38747 10.5793 1.40004 8.74643 1.40004 6.78057V4.5803C1.40004 4.56416 1.40001 4.54795 1.39997 4.53169C1.39955 4.33432 1.39911 4.12944 1.46086 3.93773C1.51472 3.77051 1.6031 3.61602 1.72093 3.48502C1.85682 3.33394 2.0354 3.23314 2.20313 3.13846C2.21712 3.13057 2.23104 3.12271 2.24485 3.11488L5.6588 1.17716C5.67907 1.16565 5.69908 1.15427 5.71885 1.14303C6.05478 0.952007 6.32063 0.800838 6.61156 0.739647Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    />
  </svg>
);

export const ProfileCloseGlyph = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M4.21967 4.21967C4.51256 3.92678 4.98744 3.92678 5.28033 4.21967L8 6.93934L10.7197 4.21967C11.0126 3.92678 11.4874 3.92678 11.7803 4.21967C12.0732 4.51256 12.0732 4.98744 11.7803 5.28033L9.06066 8L11.7803 10.7197C12.0732 11.0126 12.0732 11.4874 11.7803 11.7803C11.4874 12.0732 11.0126 12.0732 10.7197 11.7803L8 9.06066L5.28033 11.7803C4.98744 12.0732 4.51256 12.0732 4.21967 11.7803C3.92678 11.4874 3.92678 11.0126 4.21967 10.7197L6.93934 8L4.21967 5.28033C3.92678 4.98744 3.92678 4.51256 4.21967 4.21967Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    />
  </svg>
);

export const ProfileLockSegGlyph = ({ className = '' }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M4.1999 3.49922C4.1999 1.95282 5.45351 0.699219 6.9999 0.699219C8.5463 0.699219 9.7999 1.95282 9.7999 3.49922V5.59922H10.6749C11.7381 5.59922 12.5999 6.46107 12.5999 7.52422V11.3742C12.5999 12.4374 11.7381 13.2992 10.6749 13.2992H3.3249C2.26175 13.2992 1.3999 12.4374 1.3999 11.3742V7.52422C1.3999 6.46107 2.26175 5.59922 3.3249 5.59922H4.1999V3.49922ZM5.2499 5.59922H8.7499V3.49922C8.7499 2.53272 7.9664 1.74922 6.9999 1.74922C6.0334 1.74922 5.2499 2.53272 5.2499 3.49922V5.59922ZM3.3249 6.64922C2.84165 6.64922 2.4499 7.04097 2.4499 7.52422V11.3742C2.4499 11.8575 2.84165 12.2492 3.3249 12.2492H10.6749C11.1582 12.2492 11.5499 11.8575 11.5499 11.3742V7.52422C11.5499 7.04097 11.1582 6.64922 10.6749 6.64922H3.3249ZM6.9999 8.39922C7.28985 8.39922 7.5249 8.63427 7.5249 8.92422V9.97422C7.5249 10.2642 7.28985 10.4992 6.9999 10.4992C6.70995 10.4992 6.4749 10.2642 6.4749 9.97422V8.92422C6.4749 8.63427 6.70995 8.39922 6.9999 8.39922Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    />
  </svg>
);

export const ProfileFileDarkGlyph = ({ className = '' }) => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 19 19"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M5.4626 2.37422C4.80676 2.37422 4.2751 2.90588 4.2751 3.56172V15.4367C4.2751 16.0926 4.80676 16.6242 5.4626 16.6242H13.5376C14.1934 16.6242 14.7251 16.0926 14.7251 15.4367V7.12422H10.6876C10.2941 7.12422 9.9751 6.80522 9.9751 6.41172V2.37422H5.4626ZM11.4001 3.38185L13.7175 5.69922H11.4001V3.38185ZM2.8501 3.56172C2.8501 2.11888 4.01975 0.949219 5.4626 0.949219H10.6876C10.8766 0.949219 11.0578 1.02429 11.1914 1.15791L15.9414 5.90791C16.075 6.04152 16.1501 6.22275 16.1501 6.41172V15.4367C16.1501 16.8796 14.9804 18.0492 13.5376 18.0492H5.4626C4.01975 18.0492 2.8501 16.8796 2.8501 15.4367V3.56172Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#1C2A21"
    />
  </svg>
);

// ---- Talent profile · accessibility ----

export const ProfileA11yVolumeGlyph = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M7.33337 3.33301L4.00004 5.99967H1.33337V9.99967H4.00004L7.33337 12.6663V3.33301Z"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#2D5D33"
    />
    <path
      d="M10.36 5.64044C10.9849 6.26554 11.3359 7.11323 11.3359 7.99711C11.3359 8.88099 10.9849 9.72868 10.36 10.3538M12.7133 3.28711C13.9631 4.53729 14.6652 6.23268 14.6652 8.00044C14.6652 9.7682 13.9631 11.4636 12.7133 12.7138"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#2D5D33"
    />
  </svg>
);

export const ProfileA11yTextSizeGlyph = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M2.66663 4.66699V2.66699H13.3333V4.66699"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#387440"
    />
    <path
      d="M6 13.333H10"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#387440"
    />
    <path
      d="M8 2.66699V13.3337"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#387440"
    />
  </svg>
);

export const ProfileA11ySparkGlyph = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M8.00004 2L9.26671 5.4L12.6667 6.66667L9.26671 7.93333L8.00004 11.3333L6.73337 7.93333L3.33337 6.66667L6.73337 5.4L8.00004 2Z"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#2D5D33"
    />
  </svg>
);

export const ProfileA11yCloudGlyph = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M11.6666 12.6663H5.99994C5.13452 12.6661 4.28621 12.4253 3.54979 11.9707C2.81338 11.5161 2.21789 10.8656 1.82986 10.0921C1.44183 9.31853 1.27654 8.45231 1.35247 7.59022C1.4284 6.72814 1.74256 5.90415 2.25984 5.21033C2.77712 4.51651 3.47714 3.9802 4.28168 3.66133C5.08622 3.34246 5.96357 3.25359 6.81571 3.40465C7.66785 3.55571 8.4612 3.94075 9.1071 4.51675C9.753 5.09274 10.226 5.83699 10.4733 6.66634H11.6666C12.4623 6.66634 13.2253 6.98241 13.7879 7.54502C14.3505 8.10763 14.6666 8.87069 14.6666 9.66634C14.6666 10.462 14.3505 11.2251 13.7879 11.7877C13.2253 12.3503 12.4623 12.6663 11.6666 12.6663Z"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#2D5D33"
    />
  </svg>
);

export const ProfileA11yColumnsGlyph = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <mask id="stroke0_0_81" fill="white">
      <path d="M2 3C2 2.44772 2.44772 2 3 2H13C13.5523 2 14 2.44772 14 3V4C14 4.55228 13.5523 5 13 5H3C2.44772 5 2 4.55228 2 4V3Z" />
    </mask>
    <path
      d="M3 5H13C13.5523 5 14 4.55228 14 4V3C14 2.44772 13.5523 2 13 2H3C2.44772 2 2 2.44772 2 3V4C2 4.55228 2.44772 5 3 5Z"
      strokeWidth="2.6"
      stroke="#387440"
      mask="url(#stroke0_0_81)"
    />
    <mask id="stroke1_0_81" fill="white">
      <path d="M2 8C2 7.44772 2.44772 7 3 7H13C13.5523 7 14 7.44772 14 8V9C14 9.55228 13.5523 10 13 10H3C2.44772 10 2 9.55228 2 9V8Z" />
    </mask>
    <path
      d="M3 10H13C13.5523 10 14 9.55228 14 9V8C14 7.44772 13.5523 7 13 7H3C2.44772 7 2 7.44772 2 8V9C2 9.55228 2.44772 10 3 10Z"
      strokeWidth="2.6"
      stroke="#387440"
      mask="url(#stroke1_0_81)"
    />
    <mask id="stroke2_0_81" fill="white">
      <path d="M2 13C2 12.4477 2.44772 12 3 12H13C13.5523 12 14 12.4477 14 13V14C14 14.5523 13.5523 15 13 15H3C2.44772 15 2 14.5523 2 14V13Z" />
    </mask>
    <path
      d="M3 15H13C13.5523 15 14 14.5523 14 14V13C14 12.4477 13.5523 12 13 12H3C2.44772 12 2 12.4477 2 13V14C2 14.5523 2.44772 15 3 15Z"
      strokeWidth="2.6"
      stroke="#387440"
      mask="url(#stroke2_0_81)"
    />
  </svg>
);

export const ProfileA11yPillCloudIcon = ({ className = '' }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M7.5 4.125C5.91334 4.125 4.58115 5.22042 4.22099 6.69694C4.16105 6.94269 3.94445 7.1182 3.69162 7.12589C2.68328 7.15656 1.875 7.98399 1.875 9C1.875 10.0355 2.71447 10.875 3.75 10.875H12C12.6213 10.875 13.125 10.3713 13.125 9.75C13.125 9.12868 12.6213 8.625 12 8.625C11.8528 8.625 11.7134 8.653 11.586 8.70345C11.3968 8.77841 11.1818 8.74525 11.0239 8.61676C10.866 8.48826 10.7898 8.28448 10.8248 8.08393C10.8577 7.89463 10.875 7.69956 10.875 7.5C10.875 5.63604 9.36396 4.125 7.5 4.125ZM3.24128 6.04299C3.84677 4.27299 5.52412 3 7.5 3C9.98528 3 12 5.01472 12 7.5C13.2426 7.5 14.25 8.50736 14.25 9.75C14.25 10.9926 13.2426 12 12 12H3.75C2.09315 12 0.75 10.6569 0.75 9C0.75 7.51654 1.82658 6.28471 3.24128 6.04299Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="white"
    />
  </svg>
);

export const ProfileA11yPillRowsIcon = ({ className = '' }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g clipPath="url(#ProfileA11yPillRowsIcon-clip0_7603_6277)">
      <path
        d="M0.75 2.8125C0.75 1.67341 1.67341 0.75 2.8125 0.75H12.1875C13.3266 0.75 14.25 1.67341 14.25 2.8125V12.1875C14.25 13.3266 13.3266 14.25 12.1875 14.25H2.8125C1.67341 14.25 0.75 13.3266 0.75 12.1875V2.8125ZM1.875 8.0625V12.1875C1.875 12.7053 2.29473 13.125 2.8125 13.125H12.1875C12.7053 13.125 13.125 12.7053 13.125 12.1875V8.0625H1.875ZM13.125 6.9375H1.875V2.8125C1.875 2.29473 2.29473 1.875 2.8125 1.875H12.1875C12.7053 1.875 13.125 2.29473 13.125 2.8125V6.9375Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="ProfileA11yPillRowsIcon-clip0_7603_6277">
        <rect width="15" height="15" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

// ---- Talent job postings ----
// View-toggle glyphs use currentColor (white on the selected segment, grey otherwise).

export const JobBookmarkIcon = ({ className = '' }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M11.875 13.125L7.5 10.625L3.125 13.125V3.125C3.125 2.79348 3.2567 2.47554 3.49112 2.24112C3.72554 2.0067 4.04348 1.875 4.375 1.875H10.625C10.9565 1.875 11.2745 2.0067 11.5089 2.24112C11.7433 2.47554 11.875 2.79348 11.875 3.125V13.125Z"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#595959"
    />
  </svg>
);

export const JobPinIcon = ({ className = '' }) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M10.8334 5.41683C10.8334 8.66683 6.50002 11.9168 6.50002 11.9168C6.50002 11.9168 2.16669 8.66683 2.16669 5.41683C2.16669 4.26756 2.62323 3.16536 3.43589 2.3527C4.24855 1.54004 5.35075 1.0835 6.50002 1.0835C7.64929 1.0835 8.75149 1.54004 9.56415 2.3527C10.3768 3.16536 10.8334 4.26756 10.8334 5.41683Z"
      strokeWidth="1.08333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#595959"
    />
    <path
      d="M8.125 5.4165C8.125 6.31397 7.39746 7.0415 6.5 7.0415C5.60254 7.0415 4.875 6.31397 4.875 5.4165C4.875 4.51904 5.60254 3.7915 6.5 3.7915C7.39746 3.7915 8.125 4.51904 8.125 5.4165Z"
      strokeWidth="1.08333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#595959"
    />
  </svg>
);

export const JobBriefIcon = ({ className = '' }) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M2.16665 3.7915H10.8333C11.4316 3.7915 11.9166 4.27653 11.9166 4.87484V10.2915C11.9166 10.8898 11.4316 11.3748 10.8333 11.3748H2.16665C1.56834 11.3748 1.08331 10.8898 1.08331 10.2915V4.87484C1.08331 4.27653 1.56834 3.7915 2.16665 3.7915Z"
      strokeWidth="1.08333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#595959"
    />
    <path
      d="M8.66665 11.375V2.70833C8.66665 2.42102 8.55251 2.14547 8.34935 1.9423C8.14618 1.73914 7.87063 1.625 7.58331 1.625H5.41665C5.12933 1.625 4.85378 1.73914 4.65061 1.9423C4.44745 2.14547 4.33331 2.42102 4.33331 2.70833V11.375"
      strokeWidth="1.08333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#595959"
    />
  </svg>
);

export const JobCashIcon = ({ className = '' }) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M2.16665 3.25H10.8333C11.4316 3.25 11.9166 3.73502 11.9166 4.33333V8.66667C11.9166 9.26498 11.4316 9.75 10.8333 9.75H2.16665C1.56834 9.75 1.08331 9.26498 1.08331 8.66667V4.33333C1.08331 3.73502 1.56834 3.25 2.16665 3.25Z"
      strokeWidth="1.08333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#595959"
    />
    <path
      d="M7.58335 6.49984C7.58335 7.09815 7.09833 7.58317 6.50002 7.58317C5.90171 7.58317 5.41669 7.09815 5.41669 6.49984C5.41669 5.90153 5.90171 5.4165 6.50002 5.4165C7.09833 5.4165 7.58335 5.90153 7.58335 6.49984Z"
      strokeWidth="1.08333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#595959"
    />
    <path
      d="M3.25 6.5H3.25542M9.75 6.5H9.75542"
      strokeWidth="1.08333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#595959"
    />
  </svg>
);

export const JobWhyCheckIcon = ({ className = '' }) => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 11 11"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M9.16665 2.75L4.12498 7.79167L1.83331 5.5"
      strokeWidth="1.375"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#387440"
    />
  </svg>
);

export const JobConfidentialLockIcon = ({ className = '' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M3.75 8.25H14.25C15.0784 8.25 15.75 8.92157 15.75 9.75V15C15.75 15.8284 15.0784 16.5 14.25 16.5H3.75C2.92157 16.5 2.25 15.8284 2.25 15V9.75C2.25 8.92157 2.92157 8.25 3.75 8.25Z"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
    <path
      d="M5.25 8.25V5.25C5.25 4.25544 5.64509 3.30161 6.34835 2.59835C7.05161 1.89509 8.00544 1.5 9 1.5C9.99456 1.5 10.9484 1.89509 11.6517 2.59835C12.3549 3.30161 12.75 4.25544 12.75 5.25V8.25"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
  </svg>
);

export const JobViewGridIcon = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
    <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
    <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" />
    <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" />
  </svg>
);

export const JobViewListIcon = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <rect x="1" y="1.75" width="2.5" height="2.5" rx="1.25" fill="currentColor" />
    <rect x="5" y="2" width="10" height="2" rx="1" fill="currentColor" />
    <rect x="1" y="6.75" width="2.5" height="2.5" rx="1.25" fill="currentColor" />
    <rect x="5" y="7" width="10" height="2" rx="1" fill="currentColor" />
    <rect x="1" y="11.75" width="2.5" height="2.5" rx="1.25" fill="currentColor" />
    <rect x="5" y="12" width="10" height="2" rx="1" fill="currentColor" />
  </svg>
);

// ---- Talent job postings · list icons (Figma 7503… exports) ----

export const JobArrowIcon = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M3.3335 8.00001H12.6668M8.00016 12.6667L12.6668 8.00001L8.00016 3.33334"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#2D5D33"
    />
  </svg>
);

export const JobClockIcon = ({ className = '' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5C13.1421 1.5 16.5 4.85786 16.5 9Z"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#967014"
    />
    <path
      d="M9 4.5V9L12 10.5"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#967014"
    />
  </svg>
);

export const JobEyeIcon = ({ className = '' }) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M4.55627 4.5077C3.82779 5.11918 3.25403 5.84816 2.931 6.30213C2.87839 6.37607 2.85369 6.41136 2.83715 6.4394C2.82682 6.45692 2.82486 6.46307 2.82378 6.46727C2.82365 6.46801 2.82325 6.47034 2.82282 6.47434C2.82208 6.48121 2.82155 6.49007 2.82155 6.49998C2.82155 6.50988 2.82208 6.51874 2.82282 6.52561C2.82325 6.52961 2.82365 6.53194 2.82378 6.53268C2.82486 6.53688 2.82682 6.54304 2.83715 6.56055C2.85369 6.58859 2.87839 6.62388 2.931 6.69782C3.25403 7.15179 3.82779 7.88077 4.55627 8.49225C5.2912 9.10915 6.13316 9.56426 7.00013 9.56426C7.86709 9.56426 8.70905 9.10915 9.44398 8.49225C10.1725 7.88077 10.7462 7.15179 11.0692 6.69782C11.1219 6.62388 11.1466 6.58859 11.1631 6.56055C11.1734 6.54303 11.1754 6.53687 11.1765 6.53267C11.1766 6.53193 11.177 6.5296 11.1774 6.52561C11.1782 6.51874 11.1787 6.50988 11.1787 6.49998C11.1787 6.49007 11.1782 6.48121 11.1774 6.47434C11.177 6.47035 11.1766 6.46802 11.1765 6.46728C11.1754 6.46308 11.1734 6.45692 11.1631 6.4394C11.1466 6.41136 11.1219 6.37607 11.0692 6.30213C10.7462 5.84816 10.1725 5.11918 9.44398 4.5077C8.70905 3.8908 7.86709 3.43569 7.00013 3.43569C6.13316 3.43569 5.2912 3.8908 4.55627 4.5077ZM4.01897 3.8676C4.81715 3.19761 5.84678 2.59998 7.00013 2.59998C8.15347 2.59998 9.1831 3.19761 9.98128 3.8676C10.7859 4.543 11.4068 5.33504 11.7502 5.81761C11.7558 5.82553 11.7615 5.8335 11.7673 5.84154C11.8498 5.95696 11.9419 6.08571 11.9869 6.26315C12.0236 6.40785 12.0236 6.5921 11.9869 6.7368C11.9419 6.91424 11.8498 7.043 11.7673 7.15841C11.7615 7.16645 11.7558 7.17442 11.7502 7.18234C11.4068 7.66491 10.7859 8.45695 9.98128 9.13235C9.1831 9.80234 8.15347 10.4 7.00013 10.4C5.84678 10.4 4.81715 9.80234 4.01897 9.13236C3.21434 8.45695 2.59346 7.66492 2.25008 7.18234C2.24444 7.17442 2.23874 7.16645 2.23299 7.15841C2.15047 7.043 2.0584 6.91424 2.01338 6.7368C1.97666 6.5921 1.97666 6.40785 2.01338 6.26315C2.0584 6.08571 2.15047 5.95695 2.23299 5.84154C2.23874 5.8335 2.24444 5.82553 2.25008 5.81761C2.59346 5.33504 3.21434 4.543 4.01897 3.8676ZM7.00013 5.66426C6.53857 5.66426 6.16441 6.03842 6.16441 6.49998C6.16441 6.96153 6.53857 7.33569 7.00013 7.33569C7.46168 7.33569 7.83584 6.96153 7.83584 6.49998C7.83584 6.03842 7.46168 5.66426 7.00013 5.66426ZM5.3287 6.49998C5.3287 5.57687 6.07702 4.82855 7.00013 4.82855C7.92323 4.82855 8.67155 5.57687 8.67155 6.49998C8.67155 7.42308 7.92323 8.1714 7.00013 8.1714C6.07702 8.1714 5.3287 7.42308 5.3287 6.49998Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#1C2A21"
    />
  </svg>
);

export const JobSearchIcon = ({ className = '' }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M14.1665 14.1667L17.4998 17.5"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#387440"
    />
    <path
      d="M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667Z"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#387440"
    />
  </svg>
);

export const JobChevronIcon = ({ className = '' }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M7 10C6.68524 10 6.38885 9.85181 6.2 9.6L3.20001 5.6C2.97274 5.29698 2.93619 4.89157 3.10558 4.55279C3.27497 4.214 3.62123 4 4 4H10C10.3788 4 10.725 4.214 10.8944 4.55279C11.0638 4.89157 11.0273 5.29698 10.8 5.6L7.8 9.6C7.61115 9.85181 7.31476 10 7 10Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#595959"
    />
  </svg>
);

export const JobPlusIcon = ({ className = '' }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M7.5 3.125V7.5M7.5 7.5V11.875M7.5 7.5H3.125M7.5 7.5H11.875"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#2D5D33"
    />
  </svg>
);

export const JobSparkIcon = ({ className = '' }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M7.5 1.875L8.6875 5.0625L11.875 6.25L8.6875 7.4375L7.5 10.625L6.3125 7.4375L3.125 6.25L6.3125 5.0625L7.5 1.875Z"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#2D5D33"
    />
  </svg>
);

export const JobUserIcon = ({ className = '' }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M12.5 13.125V11.875C12.5 11.212 12.2366 10.5761 11.7678 10.1072C11.2989 9.63839 10.663 9.375 10 9.375H5C4.33696 9.375 3.70107 9.63839 3.23223 10.1072C2.76339 10.5761 2.5 11.212 2.5 11.875V13.125"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#2D5D33"
    />
    <path
      d="M10 4.375C10 5.75571 8.88071 6.875 7.5 6.875C6.11929 6.875 5 5.75571 5 4.375C5 2.99429 6.11929 1.875 7.5 1.875C8.88071 1.875 10 2.99429 10 4.375Z"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#2D5D33"
    />
  </svg>
);

export const JobStepCheckIcon = ({ className = '' }) => (
  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true" className={className}>
    <path
      d="M7.5 2.25L3.375 6.375L1.5 4.5"
      strokeWidth="1.3125"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="white"
    />
  </svg>
);

export const JobNoteSparkIcon = ({ className = '' }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M6.99984 1.75L8.10817 4.725L11.0832 5.83333L8.10817 6.94167L6.99984 9.91667L5.8915 6.94167L2.9165 5.83333L5.8915 4.725L6.99984 1.75Z"
      strokeWidth="1.16667"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#2D5D33"
    />
  </svg>
);

// ---- Talent learning · explore ----
// Cover art for PowerBi courses (Figma cover frame, 430x120, centred on x=0 so it crops evenly at any card width).
export const ExploreCoverPowerBi = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="-215 0 430 120"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g transform="translate(-215 0)">
      <rect x="-600" y="-40" width="1600" height="200" fill="#FFCB05" />
      <path
        d="M190.083 63H182.583C180.512 63 178.833 64.6789 178.833 66.75V89.25C178.833 91.3211 180.512 93 182.583 93H190.083C192.154 93 193.833 91.3211 193.833 89.25V66.75C193.833 64.6789 192.154 63 190.083 63Z"
        fill="#1C2A21"
      />
      <path
        d="M212.583 45H205.083C203.012 45 201.333 46.6789 201.333 48.75V89.25C201.333 91.3211 203.012 93 205.083 93H212.583C214.654 93 216.333 91.3211 216.333 89.25V48.75C216.333 46.6789 214.654 45 212.583 45Z"
        fill="#1C2A21"
      />
      <path
        d="M235.083 30H227.583C225.512 30 223.833 31.6789 223.833 33.75V89.25C223.833 91.3211 225.512 93 227.583 93H235.083C237.154 93 238.833 91.3211 238.833 89.25V33.75C238.833 31.6789 237.154 30 235.083 30Z"
        fill="#1C2A21"
      />
      <path d="M172.833 96H250.833Z" fill="#1C2A21" />
      <path d="M172.833 96H250.833" strokeWidth="4.5" strokeLinecap="round" stroke="#1C2A21" />
      <path
        d="M291.333 16.5L294.333 25.5L303.333 28.5L294.333 31.5L291.333 40.5L288.333 31.5L279.333 28.5L288.333 25.5L291.333 16.5Z"
        fill="white"
        strokeWidth="1.5"
        stroke="#1C2A21"
      />
    </g>
  </svg>
);

// Cover art for Figma courses (Figma cover frame, 430x120, centred on x=0 so it crops evenly at any card width).
export const ExploreCoverFigma = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="-215 0 430 120"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g transform="translate(-215 0)">
      <rect x="-600" y="-40" width="1600" height="200" fill="#7C3AED" />
      <path d="M214.833 30L240.333 55.5L214.833 93L189.333 55.5L214.833 30Z" fill="white" />
      <path
        d="M214.833 69.75C218.561 69.75 221.583 66.7279 221.583 63C221.583 59.2721 218.561 56.25 214.833 56.25C211.105 56.25 208.083 59.2721 208.083 63C208.083 66.7279 211.105 69.75 214.833 69.75Z"
        fill="#7C3AED"
      />
      <path d="M214.833 69.75V93Z" fill="#1C2A21" />
      <path d="M214.833 69.75V93" strokeWidth="3.75" stroke="#7C3AED" />
      <path
        d="M291.333 16.5L294.333 25.5L303.333 28.5L294.333 31.5L291.333 40.5L288.333 31.5L279.333 28.5L288.333 25.5L291.333 16.5Z"
        fill="#FFD86B"
        strokeWidth="1.5"
        stroke="#1C2A21"
      />
    </g>
  </svg>
);

// Cover art for Python courses (Figma cover frame, 430x120, centred on x=0 so it crops evenly at any card width).
export const ExploreCoverPython = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="-215 0 430 120"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g transform="translate(-215 0)">
      <rect x="-600" y="-40" width="1600" height="200" fill="#244A9F" />
      <path
        d="M199.833 37.5H220.833C223.22 37.5 225.509 38.4482 227.197 40.136C228.885 41.8239 229.833 44.1131 229.833 46.5V60H199.833C197.446 60 195.157 60.9482 193.469 62.636C191.781 64.3239 190.833 66.6131 190.833 69V79.5"
        strokeWidth="6.75"
        strokeLinecap="round"
        stroke="#FFD86B"
      />
      <path
        d="M229.833 82.5H208.833C206.446 82.5 204.157 81.5518 202.469 79.864C200.781 78.1761 199.833 75.8869 199.833 73.5V60H229.833C232.22 60 234.509 59.0518 236.197 57.364C237.885 55.6761 238.833 53.3869 238.833 51V40.5"
        strokeWidth="6.75"
        strokeLinecap="round"
        stroke="white"
      />
      <path
        d="M291.333 16.5L294.333 25.5L303.333 28.5L294.333 31.5L291.333 40.5L288.333 31.5L279.333 28.5L288.333 25.5L291.333 16.5Z"
        fill="#C9F27B"
        strokeWidth="1.5"
        stroke="#1C2A21"
      />
    </g>
  </svg>
);

// Cover art for Interview courses (Figma cover frame, 430x120, centred on x=0 so it crops evenly at any card width).
export const ExploreCoverInterview = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="-215 0 430 120"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g transform="translate(-215 0)">
      <rect x="-600" y="-40" width="1600" height="200" fill="#0E3B2E" />
      <path
        d="M214.833 73.5C226.431 73.5 235.833 64.098 235.833 52.5C235.833 40.902 226.431 31.5 214.833 31.5C203.235 31.5 193.833 40.902 193.833 52.5C193.833 64.098 203.235 73.5 214.833 73.5Z"
        fill="#FFD86B"
      />
      <path
        d="M222.333 73.5H207.333C205.676 73.5 204.333 74.8431 204.333 76.5V84C204.333 85.6569 205.676 87 207.333 87H222.333C223.99 87 225.333 85.6569 225.333 84V76.5C225.333 74.8431 223.99 73.5 222.333 73.5Z"
        fill="white"
      />
      <path d="M208.833 91.5H220.833Z" fill="#1C2A21" />
      <path d="M208.833 91.5H220.833" strokeWidth="3.75" strokeLinecap="round" stroke="white" />
      <path
        d="M291.333 16.5L294.333 25.5L303.333 28.5L294.333 31.5L291.333 40.5L288.333 31.5L279.333 28.5L288.333 25.5L291.333 16.5Z"
        fill="#C9F27B"
        strokeWidth="1.5"
        stroke="#1C2A21"
      />
    </g>
  </svg>
);

// Cover art for Agribusiness courses (Figma cover frame, 430x120, centred on x=0 so it crops evenly at any card width).
export const ExploreCoverAgribusiness = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="-215 0 430 120"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g transform="translate(-215 0)">
      <rect x="-600" y="-40" width="1600" height="200" fill="#C9F27B" />
      <path d="M214.833 93V52.5Z" fill="#1C2A21" />
      <path d="M214.833 93V52.5" strokeWidth="4.5" strokeLinecap="round" stroke="#1C2A21" />
      <path
        d="M214.833 60C214.833 46.5 223.833 37.5 237.333 37.5C237.333 51 228.333 60 214.833 60Z"
        fill="#2F7A3B"
        strokeWidth="2.25"
        stroke="#1C2A21"
      />
      <path
        d="M214.833 72C214.833 60 207.333 52.5 195.333 52.5C195.333 64.5 202.833 72 214.833 72Z"
        fill="white"
        strokeWidth="2.25"
        stroke="#1C2A21"
      />
      <path
        d="M291.333 16.5L294.333 25.5L303.333 28.5L294.333 31.5L291.333 40.5L288.333 31.5L279.333 28.5L288.333 25.5L291.333 16.5Z"
        fill="white"
        strokeWidth="1.5"
        stroke="#1C2A21"
      />
    </g>
  </svg>
);

// Cover art for Speaker courses (Figma cover frame, 430x120, centred on x=0 so it crops evenly at any card width).
export const ExploreCoverSpeaker = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="-215 0 430 120"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g transform="translate(-215 0)">
      <rect x="-600" y="-40" width="1600" height="200" fill="#C0392B" />
      <path
        d="M225.333 40.5C225.333 34.701 220.632 30 214.833 30C209.034 30 204.333 34.701 204.333 40.5V61.5C204.333 67.299 209.034 72 214.833 72C220.632 72 225.333 67.299 225.333 61.5V40.5Z"
        fill="white"
      />
      <path
        d="M192.333 63C192.333 68.9674 194.704 74.6903 198.923 78.9099C203.143 83.1295 208.866 85.5 214.833 85.5M214.833 85.5C220.8 85.5 226.523 83.1295 230.743 78.9099C234.962 74.6903 237.333 68.9674 237.333 63M214.833 85.5V96"
        strokeWidth="5.25"
        strokeLinecap="round"
        stroke="white"
      />
      <path
        d="M291.333 16.5L294.333 25.5L303.333 28.5L294.333 31.5L291.333 40.5L288.333 31.5L279.333 28.5L288.333 25.5L291.333 16.5Z"
        fill="#FFD86B"
        strokeWidth="1.5"
        stroke="#1C2A21"
      />
    </g>
  </svg>
);

// Cover art for Sql courses (Figma cover frame, 430x120, centred on x=0 so it crops evenly at any card width).
export const ExploreCoverSql = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="-215 0 430 120"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g transform="translate(-170 0)">
      <rect x="-600" y="-40" width="1600" height="200" fill="#1D4ED8" />
      <path
        d="M169.833 49.5C188.058 49.5 202.833 44.799 202.833 39C202.833 33.201 188.058 28.5 169.833 28.5C151.608 28.5 136.833 33.201 136.833 39C136.833 44.799 151.608 49.5 169.833 49.5Z"
        fill="white"
      />
      <path
        d="M136.833 39V81C136.833 87 151.833 91.5 169.833 91.5C187.833 91.5 202.833 87 202.833 81V39"
        strokeWidth="5.25"
        stroke="white"
      />
      <path
        d="M136.833 60C136.833 66 151.833 70.5 169.833 70.5C187.833 70.5 202.833 66 202.833 60"
        strokeWidth="5.25"
        stroke="#93C5FD"
      />
      <path
        d="M246.333 16.5L249.333 25.5L258.333 28.5L249.333 31.5L246.333 40.5L243.333 31.5L234.333 28.5L243.333 25.5L246.333 16.5Z"
        fill="#FFD86B"
        strokeWidth="1.5"
        stroke="#1C2A21"
      />
    </g>
  </svg>
);

// Cover art for Excel courses (Figma cover frame, 430x120, centred on x=0 so it crops evenly at any card width).
export const ExploreCoverExcel = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="-215 0 430 120"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g transform="translate(-170 0)">
      <rect x="-600" y="-40" width="1600" height="200" fill="#2F7A3B" />
      <path
        d="M201.333 33H138.333C134.191 33 130.833 36.3579 130.833 40.5V85.5C130.833 89.6421 134.191 93 138.333 93H201.333C205.475 93 208.833 89.6421 208.833 85.5V40.5C208.833 36.3579 205.475 33 201.333 33Z"
        fill="white"
      />
      <path
        d="M130.833 52.5H208.833ZM130.833 72H208.833ZM157.083 33V93ZM183.333 33V93Z"
        fill="#1C2A21"
      />
      <path
        d="M130.833 52.5H208.833M130.833 72H208.833M157.083 33V93M183.333 33V93"
        strokeWidth="3"
        stroke="#2F7A3B"
      />
      <path d="M183.333 52.5H157.083V72H183.333V52.5Z" fill="#C9F27B" />
      <path
        d="M246.333 16.5L249.333 25.5L258.333 28.5L249.333 31.5L246.333 40.5L243.333 31.5L234.333 28.5L243.333 25.5L246.333 16.5Z"
        fill="#FFD86B"
        strokeWidth="1.5"
        stroke="#1C2A21"
      />
    </g>
  </svg>
);

// Cover art for Statistics courses (Figma cover frame, 430x120, centred on x=0 so it crops evenly at any card width).
export const ExploreCoverStatistics = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="-215 0 430 120"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g transform="translate(-170 0)">
      <rect x="-600" y="-40" width="1600" height="200" fill="#F68B1E" />
      <path
        d="M121.833 90C136.833 45 151.833 30 169.833 30C187.833 30 202.833 45 217.833 90"
        strokeWidth="6"
        strokeLinecap="round"
        stroke="white"
      />
      <path d="M169.833 30V90Z" fill="#1C2A21" />
      <path
        d="M169.833 30V32.1429M169.833 90V87.8571M169.833 36.4286V40.7143M169.833 45V49.2857M169.833 53.5714V57.8571M169.833 62.1429V66.4286M169.833 70.7143V75M169.833 79.2857V83.5714"
        strokeWidth="3"
        stroke="#1C2A21"
      />
      <path
        d="M246.333 16.5L249.333 25.5L258.333 28.5L249.333 31.5L246.333 40.5L243.333 31.5L234.333 28.5L243.333 25.5L246.333 16.5Z"
        fill="white"
        strokeWidth="1.5"
        stroke="#1C2A21"
      />
    </g>
  </svg>
);

export const ExploreCategoryChartIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M2 2V14H14"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
    <path
      d="M11.9997 11.333V5.99967M8.66634 11.333V3.33301M5.33301 11.333V9.33301"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
  </svg>
);

export const ExploreCategoryCodeIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M10.6663 12L14.6663 8L10.6663 4M5.33301 4L1.33301 8L5.33301 12"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
  </svg>
);

export const ExploreCategoryPenIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M8 12.6667L12.6667 8L14.6667 10L10 14.6667L8 12.6667Z"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
    <path
      d="M11.9997 8.66634L10.9997 3.66634L1.33301 1.33301L3.66634 10.9997L8.66634 11.9997L11.9997 8.66634Z"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
  </svg>
);

export const ExploreCategoryBriefcaseIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M2.66634 4.66699H13.333C14.0694 4.66699 14.6663 5.26395 14.6663 6.00033V12.667C14.6663 13.4034 14.0694 14.0003 13.333 14.0003H2.66634C1.92996 14.0003 1.33301 13.4034 1.33301 12.667V6.00033C1.33301 5.26395 1.92996 4.66699 2.66634 4.66699Z"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
    <path
      d="M10.6663 14V3.33333C10.6663 2.97971 10.5259 2.64057 10.2758 2.39052C10.0258 2.14048 9.68663 2 9.33301 2H6.66634C6.31272 2 5.97358 2.14048 5.72353 2.39052C5.47348 2.64057 5.33301 2.97971 5.33301 3.33333V14"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
  </svg>
);

export const ExploreCategoryHeartIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12.6663 9.33333C13.6597 8.36 14.6663 7.19333 14.6663 5.66667C14.6663 4.69421 14.28 3.76158 13.5924 3.07394C12.9048 2.38631 11.9721 2 10.9997 2C9.82634 2 8.99967 2.33333 7.99967 3.33333C6.99967 2.33333 6.17301 2 4.99967 2C4.02721 2 3.09458 2.38631 2.40695 3.07394C1.71932 3.76158 1.33301 4.69421 1.33301 5.66667C1.33301 7.2 2.33301 8.36667 3.33301 9.33333L7.99967 14L12.6663 9.33333Z"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
  </svg>
);

export const ExploreCategoryMicIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M8 1.333C6.895 1.333 6 2.229 6 3.333V6c0 1.105.895 2 2 2s2-.895 2-2V3.333c0-1.104-.895-2-2-2Z"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
    <path
      d="M12.667 6.667V8a4.667 4.667 0 0 1-9.334 0V6.667M8 12.667v2"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
  </svg>
);

export const ExploreCategoryLeafIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M7.33316 13.333C6.16253 13.3366 5.03333 12.9 4.1695 12.11C3.30568 11.3199 2.77033 10.234 2.66965 9.06775C2.56896 7.90145 2.91028 6.73991 3.62592 5.8135C4.34156 4.88709 5.37924 4.26347 6.53316 4.06634C10.3332 3.33301 11.3332 2.98634 12.6665 1.33301C13.3332 2.66634 13.9998 4.11967 13.9998 6.66634C13.9998 10.333 10.8132 13.333 7.33316 13.333Z"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
    <path
      d="M1.33301 14C1.33301 12 2.56634 10.4267 4.71967 10"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
  </svg>
);

export const ExploreTargetIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#387440"
    />
    <path
      d="M9 6C9 7.65685 7.65685 9 6 9C4.34315 9 3 7.65685 3 6C3 4.34315 4.34315 3 6 3C7.65685 3 9 4.34315 9 6Z"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#387440"
    />
    <path
      d="M7 6C7 6.55228 6.55228 7 6 7C5.44772 7 5 6.55228 5 6C5 5.44772 5.44772 5 6 5C6.55228 5 7 5.44772 7 6Z"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#387440"
    />
  </svg>
);

export const ExploreUsersIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M8 10.5V9.5C8 8.96957 7.78929 8.46086 7.41421 8.08579C7.03914 7.71071 6.53043 7.5 6 7.5H3C2.46957 7.5 1.96086 7.71071 1.58579 8.08579C1.21071 8.46086 1 8.96957 1 9.5V10.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#967014"
    />
    <path
      d="M6.5 3.5C6.5 4.60457 5.60457 5.5 4.5 5.5C3.39543 5.5 2.5 4.60457 2.5 3.5C2.5 2.39543 3.39543 1.5 4.5 1.5C5.60457 1.5 6.5 2.39543 6.5 3.5Z"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#967014"
    />
    <path
      d="M11 10.5004V9.50043C10.9997 9.05729 10.8522 8.62682 10.5807 8.27659C10.3092 7.92636 9.92906 7.67621 9.5 7.56543M8 1.56543C8.43021 1.67558 8.81152 1.92578 9.08382 2.27658C9.35612 2.62739 9.50392 3.05884 9.50392 3.50293C9.50392 3.94701 9.35612 4.37847 9.08382 4.72927C8.81152 5.08008 8.43021 5.33028 8 5.44043"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#967014"
    />
  </svg>
);

export const ExploreSearchIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#595959"
    />
    <path
      d="M17.5003 17.5003L13.917 13.917"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#595959"
    />
  </svg>
);

export const ExploreClearIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 4L8 8M8 8L4 12M8 8L4 4M8 8L12 12"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#737373"
    />
  </svg>
);

export const ExploreNoResultsSpot = ({ className = '' }) => (
  <svg
    className={className}
    width="130"
    height="130"
    viewBox="0 0 130 130"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M14.6241 68.2498C11.3741 40.6248 34.1241 16.2498 63.3741 14.6248C92.6241 12.9998 116.999 34.1248 115.374 64.9998C113.749 95.8748 90.9991 117 61.7491 113.75C34.1241 110.5 17.8741 94.2498 14.6241 68.2498Z"
      fill="#FAF4E8"
    />
    <path d="M82.875 82.875L110.5 110.5" strokeWidth="13" strokeLinecap="round" stroke="#1C2A21" />
    <path
      d="M79.625 79.625L107.25 107.25"
      strokeWidth="9.75"
      strokeLinecap="round"
      stroke="#387440"
    />
    <path
      d="M30.875 60.125C30.875 64.1796 31.6736 68.1944 33.2252 71.9403C34.7768 75.6863 37.0511 79.0899 39.9181 81.9569C42.7851 84.8239 46.1887 87.0982 49.9347 88.6498C53.6806 90.2014 57.6954 91 61.75 91C65.8046 91 69.8194 90.2014 73.5653 88.6498C77.3113 87.0982 80.7149 84.8239 83.5819 81.9569C86.4489 79.0899 88.7232 75.6863 90.2748 71.9403C91.8264 68.1944 92.625 64.1796 92.625 60.125C92.625 56.0704 91.8264 52.0556 90.2748 48.3097C88.7232 44.5637 86.4489 41.1601 83.5819 38.2931C80.7149 35.4261 77.3113 33.1518 73.5653 31.6002C69.8194 30.0486 65.8046 29.25 61.75 29.25C57.6954 29.25 53.6806 30.0486 49.9347 31.6002C46.1887 33.1518 42.7851 35.4261 39.9181 38.2931C37.0511 41.1601 34.7768 44.5637 33.2252 48.3097C31.6736 52.0556 30.875 56.0704 30.875 60.125Z"
      fill="#1C2A21"
    />
    <path
      d="M27.625 56.875C27.625 60.9296 28.4236 64.9444 29.9752 68.6903C31.5268 72.4363 33.8011 75.8399 36.6681 78.7069C39.5351 81.5739 42.9387 83.8482 46.6847 85.3998C50.4306 86.9514 54.4454 87.75 58.5 87.75C62.5546 87.75 66.5694 86.9514 70.3153 85.3998C74.0613 83.8482 77.4649 81.5739 80.3319 78.7069C83.1989 75.8399 85.4732 72.4363 87.0248 68.6903C88.5764 64.9444 89.375 60.9296 89.375 56.875C89.375 52.8204 88.5764 48.8056 87.0248 45.0597C85.4732 41.3137 83.1989 37.9101 80.3319 35.0431C77.4649 32.1761 74.0613 29.9018 70.3153 28.3502C66.5694 26.7986 62.5546 26 58.5 26C54.4454 26 50.4306 26.7986 46.6847 28.3502C42.9387 29.9018 39.5351 32.1761 36.6681 35.0431C33.8011 37.9101 31.5268 41.3137 29.9752 45.0597C28.4236 48.8056 27.625 52.8204 27.625 56.875Z"
      fill="white"
      strokeWidth="2.4375"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
    <path
      d="M81.25 56.875C81.25 69.4395 71.0645 79.625 58.5 79.625C45.9355 79.625 35.75 69.4395 35.75 56.875C35.75 44.3105 45.9355 34.125 58.5 34.125C71.0645 34.125 81.25 44.3105 81.25 56.875Z"
      strokeWidth="4.875"
      stroke="#E1EAE2"
    />
    <path
      d="M50.375 48.7501C50.375 40.6251 66.625 39.0001 66.625 48.7501C66.625 55.2501 58.5 55.2501 58.5 63.3751"
      strokeWidth="4.0625"
      strokeLinecap="round"
      stroke="#1C2A21"
    />
    <path
      d="M58.5 75.9688C60.0706 75.9688 61.3438 74.6956 61.3438 73.125C61.3438 71.5544 60.0706 70.2812 58.5 70.2812C56.9294 70.2812 55.6562 71.5544 55.6562 73.125C55.6562 74.6956 56.9294 75.9688 58.5 75.9688Z"
      fill="#1C2A21"
    />
    <path
      d="M105.625 18.6875C106.502 25.1225 106.502 25.1225 112.938 26C106.502 26.8775 106.502 26.8775 105.625 33.3125C104.747 26.8775 104.747 26.8775 98.3125 26C104.747 25.1225 104.747 25.1225 105.625 18.6875Z"
      fill="#C8951A"
    />
    <path
      d="M21.125 92.625C21.71 96.915 21.71 96.915 26 97.5C21.71 98.085 21.71 98.085 21.125 102.375C20.54 98.085 20.54 98.085 16.25 97.5C20.54 96.915 20.54 96.915 21.125 92.625Z"
      fill="#387440"
    />
    <path
      d="M114.562 66.625C114.562 68.8687 112.744 70.6875 110.5 70.6875C108.256 70.6875 106.438 68.8687 106.438 66.625C106.438 64.3813 108.256 62.5625 110.5 62.5625C112.744 62.5625 114.562 64.3813 114.562 66.625Z"
      strokeWidth="2.4375"
      stroke="#C8951A"
    />
  </svg>
);

// ---- Talent learning · course ----
// Outline glyphs share one 24-unit grid (stroke 2, round caps) and inherit `currentColor`.
const CourseOutlineSvg = ({ className = '', children }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    {children}
  </svg>
);

export const CourseLayersIcon = ({ className = '' }) => (
  <CourseOutlineSvg className={className}>
    <path d="M13 13.74a2 2 0 0 1-2 0L2.5 8.87a1 1 0 0 1 0-1.74L11 2.26a2 2 0 0 1 2 0l8.5 4.87a1 1 0 0 1 0 1.74Z" />
    <path d="m20 14.285 1.5.845a1 1 0 0 1 0 1.74L13 21.74a2 2 0 0 1-2 0l-8.5-4.87a1 1 0 0 1 0-1.74l1.5-.845" />
  </CourseOutlineSvg>
);

export const CourseSignalBarsIcon = ({ className = '' }) => (
  <CourseOutlineSvg className={className}>
    <path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16" />
  </CourseOutlineSvg>
);

export const CourseGiftIcon = ({ className = '' }) => (
  <CourseOutlineSvg className={className}>
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
  </CourseOutlineSvg>
);

export const CourseAwardIcon = ({ className = '' }) => (
  <CourseOutlineSvg className={className}>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </CourseOutlineSvg>
);

export const CourseHammerIcon = ({ className = '' }) => (
  <CourseOutlineSvg className={className}>
    <path d="m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9M18 15l4-4" />
    <path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5" />
  </CourseOutlineSvg>
);

export const CourseQuizHelpIcon = ({ className = '' }) => (
  <CourseOutlineSvg className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
  </CourseOutlineSvg>
);

export const CourseZapIcon = ({ className = '' }) => (
  <CourseOutlineSvg className={className}>
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
  </CourseOutlineSvg>
);

export const CoursePlayOutlineIcon = ({ className = '' }) => (
  <CourseOutlineSvg className={className}>
    <path d="M6 3 20 12 6 21Z" />
  </CourseOutlineSvg>
);

export const CourseCaptionsIcon = ({ className = '' }) => (
  <CourseOutlineSvg className={className}>
    <rect x="2" y="5" width="20" height="14" rx="3" />
    <path d="M10.5 10.5a2 2 0 1 0 0 3M17 10.5a2 2 0 1 0 0 3" />
  </CourseOutlineSvg>
);

export const CourseVolumeIcon = ({ className = '' }) => (
  <CourseOutlineSvg className={className}>
    <path d="M11 5 6 9H2v6h4l5 4V5Z" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </CourseOutlineSvg>
);

export const CourseExpandIcon = ({ className = '' }) => (
  <CourseOutlineSvg className={className}>
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </CourseOutlineSvg>
);

export const CourseNoteIcon = ({ className = '' }) => (
  <CourseOutlineSvg className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2Z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </CourseOutlineSvg>
);

export const CourseSendPlaneIcon = ({ className = '' }) => (
  <CourseOutlineSvg className={className}>
    <path d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13" />
  </CourseOutlineSvg>
);

export const CourseBulbIcon = ({ className = '' }) => (
  <CourseOutlineSvg className={className}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4" />
  </CourseOutlineSvg>
);

export const CourseTargetRingsIcon = ({ className = '' }) => (
  <CourseOutlineSvg className={className}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </CourseOutlineSvg>
);

export const CourseChevronUpIcon = ({ className = '' }) => (
  <CourseOutlineSvg className={className}>
    <path d="m18 15-6-6-6 6" />
  </CourseOutlineSvg>
);

export const CourseShieldOutlineIcon = ({ className = '' }) => (
  <CourseOutlineSvg className={className}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
  </CourseOutlineSvg>
);

// 40px scalloped certificate seal (Figma `seal`): gold rosette, green disc, white tick.
export const CourseCertSealIcon = ({ className = '' }) => (
  <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className={className}>
    <path
      d="M20 0L24.375 3.75L30 2.5L31.875 8.125L37.5 10L36.25 15.625L40 20L36.25 24.375L37.5 30L31.875 31.875L30 37.5L24.375 36.25L20 40L15.625 36.25L10 37.5L8.125 31.875L2.5 30L3.75 24.375L0 20L3.75 15.625L2.5 10L8.125 8.125L10 2.5L15.625 3.75L20 0Z"
      fill="#FFD86B"
      stroke="#1C2A21"
      strokeWidth="1.25"
    />
    <circle cx="20" cy="18.75" r="10" fill="#387440" stroke="#1C2A21" strokeWidth="1.25" />
    <path
      d="M15.6 18.7 18.7 21.8 25 15.6"
      stroke="#FFFFFF"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Course banner art (Figma `banner art`, 420x170): three ink bars, baseline, trend curve, node, sparkle.
export const CourseBannerChartArt = ({ className = '' }) => (
  <svg viewBox="0 0 420 170" fill="none" aria-hidden="true" className={className}>
    <path
      d="M47 96h20a7 7 0 0 1 7 7v42a7 7 0 0 1-7 7H47a7 7 0 0 1-7-7v-42a7 7 0 0 1 7-7ZM95 66h20a7 7 0 0 1 7 7v72a7 7 0 0 1-7 7H95a7 7 0 0 1-7-7V73a7 7 0 0 1 7-7ZM143 36h20a7 7 0 0 1 7 7v102a7 7 0 0 1-7 7h-20a7 7 0 0 1-7-7V43a7 7 0 0 1 7-7Z"
      fill="#1C2A21"
    />
    <path d="M31.5 152H194.5" stroke="#1C2A21" strokeWidth="7" strokeLinecap="round" />
    <path
      d="M230 120C258 68 288 62 320 80C345 98 375 90 390 50"
      stroke="#1C2A21"
      strokeWidth="7"
      strokeLinecap="round"
    />
    <circle cx="390" cy="50" r="10" fill="#FFFFFF" stroke="#1C2A21" strokeWidth="4" />
    <path
      d="M300 22L305 36L319 41L305 46L300 60L295 46L281 41L295 36L300 22Z"
      fill="#FFFFFF"
      stroke="#1C2A21"
      strokeWidth="2.5"
    />
  </svg>
);

export const CourseRoleMarkHexIcon = ({ className = '' }) => (
  <svg viewBox="0 0 30 30" fill="none" aria-hidden="true" className={className}>
    <rect width="30" height="30" rx="7.5" fill="#1D4ED8" />
    <path
      d="M15 6.875 21.875 10.94V19.06L15 23.125 8.125 19.06V10.94Z"
      stroke="#FFFFFF"
      strokeWidth="1.875"
      strokeLinejoin="round"
    />
    <circle cx="15" cy="15" r="2.5" fill="#93C5FD" />
  </svg>
);

export const CourseRoleMarkChatIcon = ({ className = '' }) => (
  <svg viewBox="0 0 30 30" fill="none" aria-hidden="true" className={className}>
    <rect width="30" height="30" rx="7.5" fill="#0E3B2E" />
    <path
      d="M8.125 10C8.125 9.337 8.388 8.701 8.857 8.232C9.326 7.763 9.962 7.5 10.625 7.5H19.375C20.038 7.5 20.674 7.763 21.143 8.232C21.612 8.701 21.875 9.337 21.875 10V16.25C21.875 16.913 21.612 17.549 21.143 18.018C20.674 18.487 20.038 18.75 19.375 18.75H14.375L10.625 21.875V18.75C9.962 18.75 9.326 18.487 8.857 18.018C8.388 17.549 8.125 16.913 8.125 16.25V10Z"
      fill="#FFFFFF"
    />
    <circle cx="11.875" cy="13" r="1.125" fill="#0E3B2E" />
    <circle cx="15" cy="13" r="1.125" fill="#0E3B2E" />
    <circle cx="18.125" cy="13" r="1.125" fill="#F5B700" />
  </svg>
);
// ---- Talent learning · hub ----
// Course cover art is height-normalised (viewBox -300 0 600 140, centred, slice) so it scales by
// height and stays centre-anchored in any box (Figma cover frames 260x170 / 84x84 / 309x140 / 429x130).

export const LearningCoverSql = ({ className = '', viewBox = '-300 0 600 140', bare = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={viewBox}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <rect x="-1000" y="-300" width="2000" height="740" fill="#1d4ed8" />
    <g transform="scale(0.8235) translate(-130 0)">
      <path
        d="M3.19 6.38C4.95 6.38 6.38 4.95 6.38 3.19C6.38 1.43 4.95 0 3.19 0C1.43 0 0 1.43 0 3.19C0 4.95 1.43 6.38 3.19 6.38Z"
        fill="#ffffff"
        fillOpacity="0.18"
        transform="translate(-11.31 28.69)"
      />
      <path
        d="M3.19 6.38C4.95 6.38 6.38 4.95 6.38 3.19C6.38 1.43 4.95 0 3.19 0C1.43 0 0 1.43 0 3.19C0 4.95 1.43 6.38 3.19 6.38Z"
        fill="#ffffff"
        fillOpacity="0.18"
        transform="translate(20.56 134.94)"
      />
      <path
        d="M3.19 6.38C4.95 6.38 6.38 4.95 6.38 3.19C6.38 1.43 4.95 0 3.19 0C1.43 0 0 1.43 0 3.19C0 4.95 1.43 6.38 3.19 6.38Z"
        fill="#ffffff"
        fillOpacity="0.18"
        transform="translate(254.31 39.31)"
      />
      <path
        d="M3.19 6.38C4.95 6.38 6.38 4.95 6.38 3.19C6.38 1.43 4.95 0 3.19 0C1.43 0 0 1.43 0 3.19C0 4.95 1.43 6.38 3.19 6.38Z"
        fill="#ffffff"
        fillOpacity="0.18"
        transform="translate(222.44 124.31)"
      />
      <path
        d="M3.19 6.38C4.95 6.38 6.38 4.95 6.38 3.19C6.38 1.43 4.95 0 3.19 0C1.43 0 0 1.43 0 3.19C0 4.95 1.43 6.38 3.19 6.38Z"
        fill="#ffffff"
        fillOpacity="0.18"
        transform="translate(-21.94 92.44)"
      />
      <path
        d="M3.19 6.38C4.95 6.38 6.38 4.95 6.38 3.19C6.38 1.43 4.95 0 3.19 0C1.43 0 0 1.43 0 3.19C0 4.95 1.43 6.38 3.19 6.38Z"
        fill="#ffffff"
        fillOpacity="0.18"
        transform="translate(275.56 92.44)"
      />
      <path
        d="M46.75 29.75C72.57 29.75 93.5 23.09 93.5 14.88C93.5 6.66 72.57 0 46.75 0C20.93 0 0 6.66 0 14.88C0 23.09 20.93 29.75 46.75 29.75Z"
        fill="#ffffff"
        transform="translate(83.25 40.38)"
      />
      <path
        d="M0 0L-3.72 0L-3.72 59.5L0 59.5L3.72 59.5L3.72 0L0 0ZM0 59.5L-3.72 59.5C-3.72 63.31 -1.33 66.27 1.49 68.39C4.35 70.53 8.25 72.28 12.7 73.67C21.66 76.47 33.74 78.09 46.75 78.09L46.75 74.38L46.75 70.66C34.26 70.66 22.97 69.09 14.92 66.58C10.88 65.31 7.87 63.87 5.95 62.44C3.98 60.96 3.72 59.94 3.72 59.5L0 59.5ZM46.75 74.38L46.75 78.09C59.76 78.09 71.84 76.47 80.8 73.67C85.25 72.28 89.15 70.53 92.01 68.39C94.83 66.27 97.22 63.31 97.22 59.5L93.5 59.5L89.78 59.5C89.78 59.94 89.52 60.96 87.55 62.44C85.63 63.87 82.62 65.31 78.58 66.58C70.53 69.09 59.24 70.66 46.75 70.66L46.75 74.38ZM93.5 59.5L97.22 59.5L97.22 0L93.5 0L89.78 0L89.78 59.5L93.5 59.5Z"
        fill="#ffffff"
        transform="translate(83.25 55.25)"
      />
      <path
        d="M0 0L-3.72 0C-3.72 3.81 -1.33 6.77 1.49 8.89C4.35 11.03 8.25 12.78 12.7 14.17C21.66 16.97 33.74 18.59 46.75 18.59L46.75 14.88L46.75 11.16C34.26 11.16 22.97 9.59 14.92 7.08C10.88 5.81 7.87 4.37 5.95 2.94C3.98 1.46 3.72 0.44 3.72 0L0 0ZM46.75 14.88L46.75 18.59C59.76 18.59 71.84 16.97 80.8 14.17C85.25 12.78 89.15 11.03 92.01 8.89C94.83 6.77 97.22 3.81 97.22 0L93.5 0L89.78 0C89.78 0.44 89.52 1.46 87.55 2.94C85.63 4.37 82.62 5.81 78.58 7.08C70.53 9.59 59.24 11.16 46.75 11.16L46.75 14.88Z"
        fill="#93c5fd"
        transform="translate(83.25 85)"
      />
      <path
        d="M17 0L21.25 12.75L34 17L21.25 21.25L17 34L12.75 21.25L0 17L12.75 12.75L17 0Z"
        fill="#ffd86b"
        transform="translate(221.38 23.38)"
      />
      <path
        d="M17 0L18.01 -0.34L17 -3.36L15.99 -0.34L17 0ZM21.25 12.75L20.24 13.09L20.41 13.59L20.91 13.76L21.25 12.75ZM34 17L34.34 18.01L37.36 17L34.34 15.99L34 17ZM21.25 21.25L20.91 20.24L20.41 20.41L20.24 20.91L21.25 21.25ZM17 34L15.99 34.34L17 37.36L18.01 34.34L17 34ZM12.75 21.25L13.76 20.91L13.59 20.41L13.09 20.24L12.75 21.25ZM0 17L-0.34 15.99L-3.36 17L-0.34 18.01L0 17ZM12.75 12.75L13.09 13.76L13.59 13.59L13.76 13.09L12.75 12.75ZM17 0L15.99 0.34L20.24 13.09L21.25 12.75L22.26 12.41L18.01 -0.34L17 0ZM21.25 12.75L20.91 13.76L33.66 18.01L34 17L34.34 15.99L21.59 11.74L21.25 12.75ZM34 17L33.66 15.99L20.91 20.24L21.25 21.25L21.59 22.26L34.34 18.01L34 17ZM21.25 21.25L20.24 20.91L15.99 33.66L17 34L18.01 34.34L22.26 21.59L21.25 21.25ZM17 34L18.01 33.66L13.76 20.91L12.75 21.25L11.74 21.59L15.99 34.34L17 34ZM12.75 21.25L13.09 20.24L0.34 15.99L0 17L-0.34 18.01L12.41 22.26L12.75 21.25ZM0 17L0.34 18.01L13.09 13.76L12.75 12.75L12.41 11.74L-0.34 15.99L0 17ZM12.75 12.75L13.76 13.09L18.01 0.34L17 0L15.99 -0.34L11.74 12.41L12.75 12.75Z"
        fill="#1c2a21"
        transform="translate(221.38 23.38)"
      />
      {!bare && (
        <path
          d="M-1.7 1.18C-2.4 2.12 -2.21 3.45 -1.27 4.15C-0.34 4.86 1 4.67 1.7 3.73L0 2.45L-1.7 1.18ZM39.95 3.73C40.65 2.79 40.46 1.46 39.53 0.75C38.59 0.05 37.25 0.24 36.55 1.18L38.25 2.45L39.95 3.73ZM0 2.45L1.7 3.73C2.35 2.86 2.89 2.47 3.28 2.29C3.64 2.13 4 2.09 4.43 2.16C5.48 2.33 6.67 3.08 8.38 4.22C9.86 5.21 11.86 6.58 13.99 6.94C15.16 7.13 16.39 7.04 17.62 6.48C18.82 5.93 19.88 4.99 20.83 3.73L19.13 2.45L17.43 1.18C16.78 2.04 16.24 2.44 15.85 2.61C15.49 2.78 15.13 2.82 14.69 2.75C13.64 2.57 12.45 1.83 10.74 0.69C9.27 -0.3 7.27 -1.68 5.13 -2.03C3.97 -2.23 2.74 -2.13 1.51 -1.57C0.3 -1.02 -0.75 -0.08 -1.7 1.18L0 2.45ZM19.13 2.45L20.83 3.73C21.47 2.86 22.01 2.47 22.4 2.29C22.76 2.13 23.12 2.09 23.56 2.16C24.61 2.33 25.8 3.08 27.51 4.22C28.98 5.21 30.98 6.58 33.12 6.94C34.28 7.13 35.51 7.04 36.74 6.48C37.95 5.93 39 4.99 39.95 3.73L38.25 2.45L36.55 1.18C35.9 2.04 35.36 2.44 34.97 2.61C34.61 2.78 34.25 2.82 33.82 2.75C32.77 2.57 31.58 1.83 29.87 0.69C28.39 -0.3 26.39 -1.68 24.26 -2.03C23.09 -2.23 21.86 -2.13 20.63 -1.57C19.43 -1.02 18.37 -0.08 17.43 1.18L19.13 2.45Z"
          fill="#ffd86b"
          transform="translate(-1.75 133.55)"
        />
      )}
    </g>
  </svg>
);

export const LearningCoverFrontend = ({
  className = '',
  viewBox = '-300 0 600 140',
  bare = false,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={viewBox}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <rect x="-1000" y="-300" width="2000" height="740" fill="#1c2a21" />
    <g transform="scale(1.6667) translate(-42 0)">
      <path
        d="M1.58 3.15C2.44 3.15 3.15 2.44 3.15 1.58C3.15 0.71 2.44 0 1.58 0C0.71 0 0 0.71 0 1.58C0 2.44 0.71 3.15 1.58 3.15Z"
        fill="#ffffff"
        fillOpacity="0.18"
        transform="translate(-27.83 14.17)"
      />
      <path
        d="M1.58 3.15C2.44 3.15 3.15 2.44 3.15 1.58C3.15 0.71 2.44 0 1.58 0C0.71 0 0 0.71 0 1.58C0 2.44 0.71 3.15 1.58 3.15Z"
        fill="#ffffff"
        fillOpacity="0.18"
        transform="translate(-12.08 66.67)"
      />
      <path
        d="M1.58 3.15C2.44 3.15 3.15 2.44 3.15 1.58C3.15 0.71 2.44 0 1.58 0C0.71 0 0 0.71 0 1.58C0 2.44 0.71 3.15 1.58 3.15Z"
        fill="#ffffff"
        fillOpacity="0.18"
        transform="translate(103.42 19.42)"
      />
      <path
        d="M1.58 3.15C2.44 3.15 3.15 2.44 3.15 1.58C3.15 0.71 2.44 0 1.58 0C0.71 0 0 0.71 0 1.58C0 2.44 0.71 3.15 1.58 3.15Z"
        fill="#ffffff"
        fillOpacity="0.18"
        transform="translate(87.67 61.42)"
      />
      <path
        d="M1.58 3.15C2.44 3.15 3.15 2.44 3.15 1.58C3.15 0.71 2.44 0 1.58 0C0.71 0 0 0.71 0 1.58C0 2.44 0.71 3.15 1.58 3.15Z"
        fill="#ffffff"
        fillOpacity="0.18"
        transform="translate(-33.08 45.67)"
      />
      <path
        d="M1.58 3.15C2.44 3.15 3.15 2.44 3.15 1.58C3.15 0.71 2.44 0 1.58 0C0.71 0 0 0.71 0 1.58C0 2.44 0.71 3.15 1.58 3.15Z"
        fill="#ffffff"
        fillOpacity="0.18"
        transform="translate(113.92 45.67)"
      />
      <path
        d="M16.37 6.92C17.29 6 17.29 4.5 16.37 3.58C15.45 2.66 13.95 2.66 13.03 3.58L14.7 5.25L16.37 6.92ZM0 19.95L-1.67 18.28C-2.59 19.2 -2.59 20.7 -1.67 21.62L0 19.95ZM13.03 36.32C13.95 37.24 15.45 37.24 16.37 36.32C17.29 35.4 17.29 33.9 16.37 32.98L14.7 34.65L13.03 36.32ZM49.97 3.58C49.05 2.66 47.55 2.66 46.63 3.58C45.71 4.5 45.71 6 46.63 6.92L48.3 5.25L49.97 3.58ZM63 19.95L64.67 21.62C65.59 20.7 65.59 19.2 64.67 18.28L63 19.95ZM46.63 32.98C45.71 33.9 45.71 35.4 46.63 36.32C47.55 37.24 49.05 37.24 49.97 36.32L48.3 34.65L46.63 32.98ZM40.05 0.71C40.45 -0.53 39.76 -1.86 38.51 -2.25C37.27 -2.65 35.94 -1.96 35.55 -0.71L37.8 0L40.05 0.71ZM22.95 39.19C22.55 40.43 23.24 41.76 24.49 42.15C25.73 42.55 27.06 41.86 27.45 40.61L25.2 39.9L22.95 39.19ZM14.7 5.25L13.03 3.58L-1.67 18.28L0 19.95L1.67 21.62L16.37 6.92L14.7 5.25ZM0 19.95L-1.67 21.62L13.03 36.32L14.7 34.65L16.37 32.98L1.67 18.28L0 19.95ZM48.3 5.25L46.63 6.92L61.33 21.62L63 19.95L64.67 18.28L49.97 3.58L48.3 5.25ZM63 19.95L61.33 18.28L46.63 32.98L48.3 34.65L49.97 36.32L64.67 21.62L63 19.95ZM37.8 0L35.55 -0.71L22.95 39.19L25.2 39.9L27.45 40.61L40.05 0.71L37.8 0Z"
        fill="#84cc16"
        transform="translate(10.5 24.15)"
      />
      <path
        d="M8.4 0L10.5 6.3L16.8 8.4L10.5 10.5L8.4 16.8L6.3 10.5L0 8.4L6.3 6.3L8.4 0Z"
        fill="#ffd86b"
        transform="translate(87.15 11.55)"
      />
      <path
        d="M8.4 0L8.9 -0.17L8.4 -1.66L7.9 -0.17L8.4 0ZM10.5 6.3L10 6.47L10.09 6.72L10.33 6.8L10.5 6.3ZM16.8 8.4L16.97 8.9L18.46 8.4L16.97 7.9L16.8 8.4ZM10.5 10.5L10.33 10L10.09 10.09L10 10.33L10.5 10.5ZM8.4 16.8L7.9 16.97L8.4 18.46L8.9 16.97L8.4 16.8ZM6.3 10.5L6.8 10.33L6.72 10.09L6.47 10L6.3 10.5ZM0 8.4L-0.17 7.9L-1.66 8.4L-0.17 8.9L0 8.4ZM6.3 6.3L6.47 6.8L6.72 6.72L6.8 6.47L6.3 6.3ZM8.4 0L7.9 0.17L10 6.47L10.5 6.3L11 6.13L8.9 -0.17L8.4 0ZM10.5 6.3L10.33 6.8L16.63 8.9L16.8 8.4L16.97 7.9L10.67 5.8L10.5 6.3ZM16.8 8.4L16.63 7.9L10.33 10L10.5 10.5L10.67 11L16.97 8.9L16.8 8.4ZM10.5 10.5L10 10.33L7.9 16.63L8.4 16.8L8.9 16.97L11 10.67L10.5 10.5ZM8.4 16.8L8.9 16.63L6.8 10.33L6.3 10.5L5.8 10.67L7.9 16.97L8.4 16.8ZM6.3 10.5L6.47 10L0.17 7.9L0 8.4L-0.17 8.9L6.13 11L6.3 10.5ZM0 8.4L0.17 8.9L6.47 6.8L6.3 6.3L6.13 5.8L-0.17 7.9L0 8.4ZM6.3 6.3L6.8 6.47L8.9 0.17L8.4 0L7.9 -0.17L5.8 6.13L6.3 6.3Z"
        fill="#1c2a21"
        transform="translate(87.15 11.55)"
      />
      {!bare && (
        <path
          d="M-0.84 0.58C-1.19 1.05 -1.09 1.7 -0.63 2.05C-0.17 2.4 0.49 2.31 0.84 1.84L0 1.21L-0.84 0.58ZM19.74 1.84C20.09 1.38 19.99 0.72 19.53 0.37C19.07 0.02 18.41 0.12 18.06 0.58L18.9 1.21L19.74 1.84ZM0 1.21L0.84 1.84C1.16 1.42 1.43 1.22 1.62 1.13C1.8 1.05 1.98 1.03 2.19 1.07C2.71 1.15 3.3 1.52 4.14 2.09C4.87 2.57 5.86 3.25 6.91 3.43C7.49 3.52 8.1 3.48 8.71 3.2C9.3 2.93 9.82 2.47 10.29 1.84L9.45 1.21L8.61 0.58C8.29 1.01 8.02 1.2 7.83 1.29C7.65 1.37 7.47 1.39 7.26 1.36C6.74 1.27 6.15 0.9 5.31 0.34C4.58 -0.15 3.59 -0.83 2.54 -1C1.96 -1.1 1.35 -1.05 0.74 -0.78C0.15 -0.5 -0.37 -0.04 -0.84 0.58L0 1.21ZM9.45 1.21L10.29 1.84C10.61 1.42 10.88 1.22 11.07 1.13C11.25 1.05 11.43 1.03 11.64 1.07C12.16 1.15 12.75 1.52 13.59 2.09C14.32 2.57 15.31 3.25 16.36 3.43C16.94 3.52 17.55 3.48 18.16 3.2C18.75 2.93 19.27 2.47 19.74 1.84L18.9 1.21L18.06 0.58C17.74 1.01 17.47 1.2 17.28 1.29C17.1 1.37 16.92 1.39 16.71 1.36C16.19 1.27 15.6 0.9 14.76 0.34C14.03 -0.15 13.04 -0.83 11.99 -1C11.41 -1.1 10.8 -1.05 10.19 -0.78C9.6 -0.5 9.08 -0.04 8.61 0.58L9.45 1.21Z"
          fill="#ffd86b"
          transform="translate(-23.1 65.99)"
        />
      )}
    </g>
  </svg>
);

export const LearningCoverExcel = ({
  className = '',
  viewBox = '-300 0 600 140',
  bare = false,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={viewBox}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <rect x="-1000" y="-300" width="2000" height="740" fill="#2f7a3b" />
    <g transform="scale(1.6667) translate(-42 0)">
      <path
        d="M1.58 3.15C2.44 3.15 3.15 2.44 3.15 1.58C3.15 0.71 2.44 0 1.58 0C0.71 0 0 0.71 0 1.58C0 2.44 0.71 3.15 1.58 3.15Z"
        fill="#ffffff"
        fillOpacity="0.18"
        transform="translate(-27.83 14.17)"
      />
      <path
        d="M1.58 3.15C2.44 3.15 3.15 2.44 3.15 1.58C3.15 0.71 2.44 0 1.58 0C0.71 0 0 0.71 0 1.58C0 2.44 0.71 3.15 1.58 3.15Z"
        fill="#ffffff"
        fillOpacity="0.18"
        transform="translate(-12.08 66.67)"
      />
      <path
        d="M1.58 3.15C2.44 3.15 3.15 2.44 3.15 1.58C3.15 0.71 2.44 0 1.58 0C0.71 0 0 0.71 0 1.58C0 2.44 0.71 3.15 1.58 3.15Z"
        fill="#ffffff"
        fillOpacity="0.18"
        transform="translate(103.42 19.42)"
      />
      <path
        d="M1.58 3.15C2.44 3.15 3.15 2.44 3.15 1.58C3.15 0.71 2.44 0 1.58 0C0.71 0 0 0.71 0 1.58C0 2.44 0.71 3.15 1.58 3.15Z"
        fill="#ffffff"
        fillOpacity="0.18"
        transform="translate(87.67 61.42)"
      />
      <path
        d="M1.58 3.15C2.44 3.15 3.15 2.44 3.15 1.58C3.15 0.71 2.44 0 1.58 0C0.71 0 0 0.71 0 1.58C0 2.44 0.71 3.15 1.58 3.15Z"
        fill="#ffffff"
        fillOpacity="0.18"
        transform="translate(-33.08 45.67)"
      />
      <path
        d="M1.58 3.15C2.44 3.15 3.15 2.44 3.15 1.58C3.15 0.71 2.44 0 1.58 0C0.71 0 0 0.71 0 1.58C0 2.44 0.71 3.15 1.58 3.15Z"
        fill="#ffffff"
        fillOpacity="0.18"
        transform="translate(113.92 45.67)"
      />
      <path
        d="M49.35 0L5.25 0C2.35 0 0 2.35 0 5.25L0 36.75C0 39.65 2.35 42 5.25 42L49.35 42C52.25 42 54.6 39.65 54.6 36.75L54.6 5.25C54.6 2.35 52.25 0 49.35 0Z"
        fill="#ffffff"
        transform="translate(14.7 23.1)"
      />
      <path
        d="M0 13.65L54.6 13.65ZM0 27.3L54.6 27.3ZM18.38 0L18.38 42ZM36.75 0L36.75 42Z"
        fill="#1c2a21"
        transform="translate(14.7 23.1)"
      />
      <path
        d="M0 13.65L0 14.7L54.6 14.7L54.6 13.65L54.6 12.6L0 12.6L0 13.65ZM0 27.3L0 28.35L54.6 28.35L54.6 27.3L54.6 26.25L0 26.25L0 27.3ZM18.38 0L17.33 0L17.33 42L18.38 42L19.43 42L19.43 0L18.38 0ZM36.75 0L35.7 0L35.7 42L36.75 42L37.8 42L37.8 0L36.75 0Z"
        fill="#2f7a3b"
        transform="translate(14.7 23.1)"
      />
      <path
        d="M18.38 0L0 0L0 13.65L18.38 13.65L18.38 0Z"
        fill="#c9f27b"
        transform="translate(33.08 36.75)"
      />
      <path
        d="M8.4 0L10.5 6.3L16.8 8.4L10.5 10.5L8.4 16.8L6.3 10.5L0 8.4L6.3 6.3L8.4 0Z"
        fill="#ffd86b"
        transform="translate(87.15 11.55)"
      />
      <path
        d="M8.4 0L8.9 -0.17L8.4 -1.66L7.9 -0.17L8.4 0ZM10.5 6.3L10 6.47L10.09 6.72L10.33 6.8L10.5 6.3ZM16.8 8.4L16.97 8.9L18.46 8.4L16.97 7.9L16.8 8.4ZM10.5 10.5L10.33 10L10.09 10.09L10 10.33L10.5 10.5ZM8.4 16.8L7.9 16.97L8.4 18.46L8.9 16.97L8.4 16.8ZM6.3 10.5L6.8 10.33L6.72 10.09L6.47 10L6.3 10.5ZM0 8.4L-0.17 7.9L-1.66 8.4L-0.17 8.9L0 8.4ZM6.3 6.3L6.47 6.8L6.72 6.72L6.8 6.47L6.3 6.3ZM8.4 0L7.9 0.17L10 6.47L10.5 6.3L11 6.13L8.9 -0.17L8.4 0ZM10.5 6.3L10.33 6.8L16.63 8.9L16.8 8.4L16.97 7.9L10.67 5.8L10.5 6.3ZM16.8 8.4L16.63 7.9L10.33 10L10.5 10.5L10.67 11L16.97 8.9L16.8 8.4ZM10.5 10.5L10 10.33L7.9 16.63L8.4 16.8L8.9 16.97L11 10.67L10.5 10.5ZM8.4 16.8L8.9 16.63L6.8 10.33L6.3 10.5L5.8 10.67L7.9 16.97L8.4 16.8ZM6.3 10.5L6.47 10L0.17 7.9L0 8.4L-0.17 8.9L6.13 11L6.3 10.5ZM0 8.4L0.17 8.9L6.47 6.8L6.3 6.3L6.13 5.8L-0.17 7.9L0 8.4ZM6.3 6.3L6.8 6.47L8.9 0.17L8.4 0L7.9 -0.17L5.8 6.13L6.3 6.3Z"
        fill="#1c2a21"
        transform="translate(87.15 11.55)"
      />
      {!bare && (
        <path
          d="M-0.84 0.58C-1.19 1.05 -1.09 1.7 -0.63 2.05C-0.17 2.4 0.49 2.31 0.84 1.84L0 1.21L-0.84 0.58ZM19.74 1.84C20.09 1.38 19.99 0.72 19.53 0.37C19.07 0.02 18.41 0.12 18.06 0.58L18.9 1.21L19.74 1.84ZM0 1.21L0.84 1.84C1.16 1.42 1.43 1.22 1.62 1.13C1.8 1.05 1.98 1.03 2.19 1.07C2.71 1.15 3.3 1.52 4.14 2.09C4.87 2.57 5.86 3.25 6.91 3.43C7.49 3.52 8.1 3.48 8.71 3.2C9.3 2.93 9.82 2.47 10.29 1.84L9.45 1.21L8.61 0.58C8.29 1.01 8.02 1.2 7.83 1.29C7.65 1.37 7.47 1.39 7.26 1.36C6.74 1.27 6.15 0.9 5.31 0.34C4.58 -0.15 3.59 -0.83 2.54 -1C1.96 -1.1 1.35 -1.05 0.74 -0.78C0.15 -0.5 -0.37 -0.04 -0.84 0.58L0 1.21ZM9.45 1.21L10.29 1.84C10.61 1.42 10.88 1.22 11.07 1.13C11.25 1.05 11.43 1.03 11.64 1.07C12.16 1.15 12.75 1.52 13.59 2.09C14.32 2.57 15.31 3.25 16.36 3.43C16.94 3.52 17.55 3.48 18.16 3.2C18.75 2.93 19.27 2.47 19.74 1.84L18.9 1.21L18.06 0.58C17.74 1.01 17.47 1.2 17.28 1.29C17.1 1.37 16.92 1.39 16.71 1.36C16.19 1.27 15.6 0.9 14.76 0.34C14.03 -0.15 13.04 -0.83 11.99 -1C11.41 -1.1 10.8 -1.05 10.19 -0.78C9.6 -0.5 9.08 -0.04 8.61 0.58L9.45 1.21Z"
          fill="#ffd86b"
          transform="translate(-23.1 65.99)"
        />
      )}
    </g>
  </svg>
);

export const LearningCoverPowerBi = ({
  className = '',
  viewBox = '-300 0 600 140',
  bare = false,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={viewBox}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <rect x="-1000" y="-300" width="2000" height="740" fill="#ffcb05" />
    <g transform="scale(1) translate(-154.5 0)">
      <path
        d="M13.13 0L4.38 0C1.96 0 0 1.96 0 4.38L0 30.63C0 33.04 1.96 35 4.38 35L13.13 35C15.54 35 17.5 33.04 17.5 30.63L17.5 4.38C17.5 1.96 15.54 0 13.13 0Z"
        fill="#1c2a21"
        transform="translate(112.5 73.5)"
      />
      <path
        d="M13.13 0L4.38 0C1.96 0 0 1.96 0 4.38L0 51.63C0 54.04 1.96 56 4.38 56L13.13 56C15.54 56 17.5 54.04 17.5 51.63L17.5 4.38C17.5 1.96 15.54 0 13.13 0Z"
        fill="#1c2a21"
        transform="translate(138.75 52.5)"
      />
      <path
        d="M13.13 0L4.38 0C1.96 0 0 1.96 0 4.38L0 69.13C0 71.54 1.96 73.5 4.38 73.5L13.13 73.5C15.54 73.5 17.5 71.54 17.5 69.13L17.5 4.38C17.5 1.96 15.54 0 13.13 0Z"
        fill="#1c2a21"
        transform="translate(165 35)"
      />
      <path d="M0 0L91 0Z" fill="#1c2a21" transform="translate(105.5 112)" />
      <path
        d="M0 -2.62C-1.45 -2.62 -2.62 -1.45 -2.62 0C-2.62 1.45 -1.45 2.63 0 2.63L0 0L0 -2.62ZM91 2.63C92.45 2.63 93.63 1.45 93.63 0C93.63 -1.45 92.45 -2.62 91 -2.62L91 0L91 2.63ZM0 0L0 2.63L91 2.63L91 0L91 -2.62L0 -2.62L0 0Z"
        fill="#1c2a21"
        transform="translate(105.5 112)"
      />
      <path
        d="M14 0L17.5 10.5L28 14L17.5 17.5L14 28L10.5 17.5L0 14L10.5 10.5L14 0Z"
        fill="#ffffff"
        transform="translate(229.75 19.25)"
      />
      <path
        d="M14 0L14.83 -0.28L14 -2.77L13.17 -0.28L14 0ZM17.5 10.5L16.67 10.78L16.81 11.19L17.22 11.33L17.5 10.5ZM28 14L28.28 14.83L30.77 14L28.28 13.17L28 14ZM17.5 17.5L17.22 16.67L16.81 16.81L16.67 17.22L17.5 17.5ZM14 28L13.17 28.28L14 30.77L14.83 28.28L14 28ZM10.5 17.5L11.33 17.22L11.19 16.81L10.78 16.67L10.5 17.5ZM0 14L-0.28 13.17L-2.77 14L-0.28 14.83L0 14ZM10.5 10.5L10.78 11.33L11.19 11.19L11.33 10.78L10.5 10.5ZM14 0L13.17 0.28L16.67 10.78L17.5 10.5L18.33 10.22L14.83 -0.28L14 0ZM17.5 10.5L17.22 11.33L27.72 14.83L28 14L28.28 13.17L17.78 9.67L17.5 10.5ZM28 14L27.72 13.17L17.22 16.67L17.5 17.5L17.78 18.33L28.28 14.83L28 14ZM17.5 17.5L16.67 17.22L13.17 27.72L14 28L14.83 28.28L18.33 17.78L17.5 17.5ZM14 28L14.83 27.72L11.33 17.22L10.5 17.5L9.67 17.78L13.17 28.28L14 28ZM10.5 17.5L10.78 16.67L0.28 13.17L0 14L-0.28 14.83L10.22 18.33L10.5 17.5ZM0 14L0.28 14.83L10.78 11.33L10.5 10.5L10.22 9.67L-0.28 13.17L0 14ZM10.5 10.5L11.33 10.78L14.83 0.28L14 0L13.17 -0.28L9.67 10.22L10.5 10.5Z"
        fill="#1c2a21"
        transform="translate(229.75 19.25)"
      />
      {!bare && (
        <path
          d="M-1.4 0.97C-1.98 1.74 -1.82 2.84 -1.05 3.42C-0.28 4 0.82 3.84 1.4 3.07L0 2.02L-1.4 0.97ZM32.9 3.07C33.48 2.3 33.32 1.2 32.55 0.62C31.78 0.04 30.68 0.2 30.1 0.97L31.5 2.02L32.9 3.07ZM0 2.02L1.4 3.07C1.93 2.36 2.38 2.04 2.7 1.89C3 1.75 3.29 1.72 3.65 1.78C4.52 1.92 5.49 2.54 6.9 3.48C8.12 4.29 9.77 5.42 11.52 5.72C12.48 5.87 13.5 5.8 14.51 5.33C15.5 4.88 16.37 4.11 17.15 3.07L15.75 2.02L14.35 0.97C13.82 1.68 13.37 2.01 13.05 2.15C12.75 2.29 12.46 2.32 12.1 2.26C11.23 2.12 10.26 1.5 8.85 0.56C7.63 -0.25 5.98 -1.38 4.23 -1.67C3.27 -1.83 2.25 -1.76 1.24 -1.29C0.25 -0.84 -0.62 -0.07 -1.4 0.97L0 2.02ZM15.75 2.02L17.15 3.07C17.68 2.36 18.13 2.04 18.45 1.89C18.75 1.75 19.04 1.72 19.4 1.78C20.27 1.92 21.24 2.54 22.65 3.48C23.87 4.29 25.52 5.42 27.27 5.72C28.23 5.87 29.25 5.8 30.26 5.33C31.25 4.88 32.12 4.11 32.9 3.07L31.5 2.02L30.1 0.97C29.57 1.68 29.12 2.01 28.8 2.15C28.5 2.29 28.21 2.32 27.85 2.26C26.98 2.12 26.01 1.5 24.6 0.56C23.38 -0.25 21.73 -1.38 19.98 -1.67C19.02 -1.83 18 -1.76 16.99 -1.29C16 -0.84 15.13 -0.07 14.35 0.97L15.75 2.02Z"
          fill="#ffffff"
          transform="translate(46 109.98)"
        />
      )}
    </g>
  </svg>
);

export const LearningCoverFigma = ({
  className = '',
  viewBox = '-300 0 600 140',
  bare = false,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={viewBox}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <rect x="-1000" y="-300" width="2000" height="740" fill="#7c3aed" />
    <g transform="scale(1) translate(-154.5 0)">
      <path
        d="M29.75 0L59.5 29.75L29.75 73.5L0 29.75L29.75 0Z"
        fill="#ffffff"
        transform="translate(124.75 35)"
      />
      <path
        d="M7.88 15.75C12.22 15.75 15.75 12.22 15.75 7.88C15.75 3.53 12.22 0 7.88 0C3.53 0 0 3.53 0 7.88C0 12.22 3.53 15.75 7.88 15.75Z"
        fill="#7c3aed"
        transform="translate(146.63 65.63)"
      />
      <path d="M0 0L0 27.13Z" fill="#1c2a21" transform="translate(154.5 81.38)" />
      <path
        d="M0 0L-2.19 0L-2.19 27.13L0 27.13L2.19 27.13L2.19 0L0 0Z"
        fill="#7c3aed"
        transform="translate(154.5 81.38)"
      />
      <path
        d="M14 0L17.5 10.5L28 14L17.5 17.5L14 28L10.5 17.5L0 14L10.5 10.5L14 0Z"
        fill="#ffd86b"
        transform="translate(229.75 19.25)"
      />
      <path
        d="M14 0L14.83 -0.28L14 -2.77L13.17 -0.28L14 0ZM17.5 10.5L16.67 10.78L16.81 11.19L17.22 11.33L17.5 10.5ZM28 14L28.28 14.83L30.77 14L28.28 13.17L28 14ZM17.5 17.5L17.22 16.67L16.81 16.81L16.67 17.22L17.5 17.5ZM14 28L13.17 28.28L14 30.77L14.83 28.28L14 28ZM10.5 17.5L11.33 17.22L11.19 16.81L10.78 16.67L10.5 17.5ZM0 14L-0.28 13.17L-2.77 14L-0.28 14.83L0 14ZM10.5 10.5L10.78 11.33L11.19 11.19L11.33 10.78L10.5 10.5ZM14 0L13.17 0.28L16.67 10.78L17.5 10.5L18.33 10.22L14.83 -0.28L14 0ZM17.5 10.5L17.22 11.33L27.72 14.83L28 14L28.28 13.17L17.78 9.67L17.5 10.5ZM28 14L27.72 13.17L17.22 16.67L17.5 17.5L17.78 18.33L28.28 14.83L28 14ZM17.5 17.5L16.67 17.22L13.17 27.72L14 28L14.83 28.28L18.33 17.78L17.5 17.5ZM14 28L14.83 27.72L11.33 17.22L10.5 17.5L9.67 17.78L13.17 28.28L14 28ZM10.5 17.5L10.78 16.67L0.28 13.17L0 14L-0.28 14.83L10.22 18.33L10.5 17.5ZM0 14L0.28 14.83L10.78 11.33L10.5 10.5L10.22 9.67L-0.28 13.17L0 14ZM10.5 10.5L11.33 10.78L14.83 0.28L14 0L13.17 -0.28L9.67 10.22L10.5 10.5Z"
        fill="#1c2a21"
        transform="translate(229.75 19.25)"
      />
      {!bare && (
        <path
          d="M-1.4 0.97C-1.98 1.74 -1.82 2.84 -1.05 3.42C-0.28 4 0.82 3.84 1.4 3.07L0 2.02L-1.4 0.97ZM32.9 3.07C33.48 2.3 33.32 1.2 32.55 0.62C31.78 0.04 30.68 0.2 30.1 0.97L31.5 2.02L32.9 3.07ZM0 2.02L1.4 3.07C1.93 2.36 2.38 2.04 2.7 1.89C3 1.75 3.29 1.72 3.65 1.78C4.52 1.92 5.49 2.54 6.9 3.48C8.12 4.29 9.77 5.42 11.52 5.72C12.48 5.87 13.5 5.8 14.51 5.33C15.5 4.88 16.37 4.11 17.15 3.07L15.75 2.02L14.35 0.97C13.82 1.68 13.37 2.01 13.05 2.15C12.75 2.29 12.46 2.32 12.1 2.26C11.23 2.12 10.26 1.5 8.85 0.56C7.63 -0.25 5.98 -1.38 4.23 -1.67C3.27 -1.83 2.25 -1.76 1.24 -1.29C0.25 -0.84 -0.62 -0.07 -1.4 0.97L0 2.02ZM15.75 2.02L17.15 3.07C17.68 2.36 18.13 2.04 18.45 1.89C18.75 1.75 19.04 1.72 19.4 1.78C20.27 1.92 21.24 2.54 22.65 3.48C23.87 4.29 25.52 5.42 27.27 5.72C28.23 5.87 29.25 5.8 30.26 5.33C31.25 4.88 32.12 4.11 32.9 3.07L31.5 2.02L30.1 0.97C29.57 1.68 29.12 2.01 28.8 2.15C28.5 2.29 28.21 2.32 27.85 2.26C26.98 2.12 26.01 1.5 24.6 0.56C23.38 -0.25 21.73 -1.38 19.98 -1.67C19.02 -1.83 18 -1.76 16.99 -1.29C16 -0.84 15.13 -0.07 14.35 0.97L15.75 2.02Z"
          fill="#ffd86b"
          transform="translate(46 109.98)"
        />
      )}
    </g>
  </svg>
);

export const LearningCoverStatistics = ({
  className = '',
  viewBox = '-300 0 600 140',
  bare = false,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={viewBox}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <rect x="-1000" y="-300" width="2000" height="740" fill="#f68b1e" />
    <g transform="scale(1) translate(-154.5 0)">
      <path
        d="M-3.32 68.89C-3.93 70.73 -2.94 72.71 -1.11 73.32C0.73 73.93 2.71 72.94 3.32 71.11L0 70L-3.32 68.89ZM108.68 71.11C109.29 72.94 111.27 73.93 113.11 73.32C114.94 72.71 115.93 70.73 115.32 68.89L112 70L108.68 71.11ZM0 70L3.32 71.11C12.02 45 20.6 28 29.37 17.56C38 7.29 46.69 3.5 56 3.5L56 0L56 -3.5C44.31 -3.5 33.75 1.46 24.01 13.06C14.4 24.5 5.48 42.5 -3.32 68.89L0 70ZM56 0L56 3.5C65.31 3.5 74 7.29 82.63 17.56C91.4 28 99.98 45 108.68 71.11L112 70L115.32 68.89C106.52 42.5 97.6 24.5 87.99 13.06C78.25 1.46 67.69 -3.5 56 -3.5L56 0Z"
        fill="#ffffff"
        transform="translate(98.5 35)"
      />
      <path d="M0 0L0 70Z" fill="#1c2a21" transform="translate(154.5 35)" />
      <path
        d="M0 0L-1.75 0L-1.75 2.5L0 2.5L1.75 2.5L1.75 0L0 0ZM0 7.5L-1.75 7.5L-1.75 12.5L0 12.5L1.75 12.5L1.75 7.5L0 7.5ZM0 17.5L-1.75 17.5L-1.75 22.5L0 22.5L1.75 22.5L1.75 17.5L0 17.5ZM0 27.5L-1.75 27.5L-1.75 32.5L0 32.5L1.75 32.5L1.75 27.5L0 27.5ZM0 37.5L-1.75 37.5L-1.75 42.5L0 42.5L1.75 42.5L1.75 37.5L0 37.5ZM0 47.5L-1.75 47.5L-1.75 52.5L0 52.5L1.75 52.5L1.75 47.5L0 47.5ZM0 57.5L-1.75 57.5L-1.75 62.5L0 62.5L1.75 62.5L1.75 57.5L0 57.5ZM0 67.5L-1.75 67.5L-1.75 70L0 70L1.75 70L1.75 67.5L0 67.5Z"
        fill="#1c2a21"
        transform="translate(154.5 35)"
      />
      <path
        d="M14 0L17.5 10.5L28 14L17.5 17.5L14 28L10.5 17.5L0 14L10.5 10.5L14 0Z"
        fill="#ffffff"
        transform="translate(229.75 19.25)"
      />
      <path
        d="M14 0L14.83 -0.28L14 -2.77L13.17 -0.28L14 0ZM17.5 10.5L16.67 10.78L16.81 11.19L17.22 11.33L17.5 10.5ZM28 14L28.28 14.83L30.77 14L28.28 13.17L28 14ZM17.5 17.5L17.22 16.67L16.81 16.81L16.67 17.22L17.5 17.5ZM14 28L13.17 28.28L14 30.77L14.83 28.28L14 28ZM10.5 17.5L11.33 17.22L11.19 16.81L10.78 16.67L10.5 17.5ZM0 14L-0.28 13.17L-2.77 14L-0.28 14.83L0 14ZM10.5 10.5L10.78 11.33L11.19 11.19L11.33 10.78L10.5 10.5ZM14 0L13.17 0.28L16.67 10.78L17.5 10.5L18.33 10.22L14.83 -0.28L14 0ZM17.5 10.5L17.22 11.33L27.72 14.83L28 14L28.28 13.17L17.78 9.67L17.5 10.5ZM28 14L27.72 13.17L17.22 16.67L17.5 17.5L17.78 18.33L28.28 14.83L28 14ZM17.5 17.5L16.67 17.22L13.17 27.72L14 28L14.83 28.28L18.33 17.78L17.5 17.5ZM14 28L14.83 27.72L11.33 17.22L10.5 17.5L9.67 17.78L13.17 28.28L14 28ZM10.5 17.5L10.78 16.67L0.28 13.17L0 14L-0.28 14.83L10.22 18.33L10.5 17.5ZM0 14L0.28 14.83L10.78 11.33L10.5 10.5L10.22 9.67L-0.28 13.17L0 14ZM10.5 10.5L11.33 10.78L14.83 0.28L14 0L13.17 -0.28L9.67 10.22L10.5 10.5Z"
        fill="#1c2a21"
        transform="translate(229.75 19.25)"
      />
      {!bare && (
        <path
          d="M-1.4 0.97C-1.98 1.74 -1.82 2.84 -1.05 3.42C-0.28 4 0.82 3.84 1.4 3.07L0 2.02L-1.4 0.97ZM32.9 3.07C33.48 2.3 33.32 1.2 32.55 0.62C31.78 0.04 30.68 0.2 30.1 0.97L31.5 2.02L32.9 3.07ZM0 2.02L1.4 3.07C1.93 2.36 2.38 2.04 2.7 1.89C3 1.75 3.29 1.72 3.65 1.78C4.52 1.92 5.49 2.54 6.9 3.48C8.12 4.29 9.77 5.42 11.52 5.72C12.48 5.87 13.5 5.8 14.51 5.33C15.5 4.88 16.37 4.11 17.15 3.07L15.75 2.02L14.35 0.97C13.82 1.68 13.37 2.01 13.05 2.15C12.75 2.29 12.46 2.32 12.1 2.26C11.23 2.12 10.26 1.5 8.85 0.56C7.63 -0.25 5.98 -1.38 4.23 -1.67C3.27 -1.83 2.25 -1.76 1.24 -1.29C0.25 -0.84 -0.62 -0.07 -1.4 0.97L0 2.02ZM15.75 2.02L17.15 3.07C17.68 2.36 18.13 2.04 18.45 1.89C18.75 1.75 19.04 1.72 19.4 1.78C20.27 1.92 21.24 2.54 22.65 3.48C23.87 4.29 25.52 5.42 27.27 5.72C28.23 5.87 29.25 5.8 30.26 5.33C31.25 4.88 32.12 4.11 32.9 3.07L31.5 2.02L30.1 0.97C29.57 1.68 29.12 2.01 28.8 2.15C28.5 2.29 28.21 2.32 27.85 2.26C26.98 2.12 26.01 1.5 24.6 0.56C23.38 -0.25 21.73 -1.38 19.98 -1.67C19.02 -1.83 18 -1.76 16.99 -1.29C16 -0.84 15.13 -0.07 14.35 0.97L15.75 2.02Z"
          fill="#ffffff"
          transform="translate(46 109.98)"
        />
      )}
    </g>
  </svg>
);

export const LearningCoverInterview = ({
  className = '',
  viewBox = '-300 0 600 140',
  bare = false,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={viewBox}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <rect x="-1000" y="-300" width="2000" height="740" fill="#0e3b2e" />
    <g transform="scale(1.0769) translate(-214.8333282470703 0)">
      <path
        d="M22.75 45.5C35.31 45.5 45.5 35.31 45.5 22.75C45.5 10.19 35.31 0 22.75 0C10.19 0 0 10.19 0 22.75C0 35.31 10.19 45.5 22.75 45.5Z"
        fill="#ffd86b"
        transform="translate(192.08 34.13)"
      />
      <path
        d="M19.5 0L3.25 0C1.46 0 0 1.46 0 3.25L0 11.38C0 13.17 1.46 14.63 3.25 14.63L19.5 14.63C21.29 14.63 22.75 13.17 22.75 11.38L22.75 3.25C22.75 1.46 21.29 0 19.5 0Z"
        fill="#ffffff"
        transform="translate(203.46 79.63)"
      />
      <path d="M0 0L13 0Z" fill="#1c2a21" transform="translate(208.33 99.13)" />
      <path
        d="M0 -2.03C-1.12 -2.03 -2.03 -1.12 -2.03 0C-2.03 1.12 -1.12 2.03 0 2.03L0 0L0 -2.03ZM13 2.03C14.12 2.03 15.03 1.12 15.03 0C15.03 -1.12 14.12 -2.03 13 -2.03L13 0L13 2.03ZM0 0L0 2.03L13 2.03L13 0L13 -2.03L0 -2.03L0 0Z"
        fill="#ffffff"
        transform="translate(208.33 99.13)"
      />
      <path
        d="M13 0L16.25 9.75L26 13L16.25 16.25L13 26L9.75 16.25L0 13L9.75 9.75L13 0Z"
        fill="#c9f27b"
        transform="translate(284.71 17.88)"
      />
      <path
        d="M13 0L13.77 -0.26L13 -2.57L12.23 -0.26L13 0ZM16.25 9.75L15.48 10.01L15.61 10.39L15.99 10.52L16.25 9.75ZM26 13L26.26 13.77L28.57 13L26.26 12.23L26 13ZM16.25 16.25L15.99 15.48L15.61 15.61L15.48 15.99L16.25 16.25ZM13 26L12.23 26.26L13 28.57L13.77 26.26L13 26ZM9.75 16.25L10.52 15.99L10.39 15.61L10.01 15.48L9.75 16.25ZM0 13L-0.26 12.23L-2.57 13L-0.26 13.77L0 13ZM9.75 9.75L10.01 10.52L10.39 10.39L10.52 10.01L9.75 9.75ZM13 0L12.23 0.26L15.48 10.01L16.25 9.75L17.02 9.49L13.77 -0.26L13 0ZM16.25 9.75L15.99 10.52L25.74 13.77L26 13L26.26 12.23L16.51 8.98L16.25 9.75ZM26 13L25.74 12.23L15.99 15.48L16.25 16.25L16.51 17.02L26.26 13.77L26 13ZM16.25 16.25L15.48 15.99L12.23 25.74L13 26L13.77 26.26L17.02 16.51L16.25 16.25ZM13 26L13.77 25.74L10.52 15.99L9.75 16.25L8.98 16.51L12.23 26.26L13 26ZM9.75 16.25L10.01 15.48L0.26 12.23L0 13L-0.26 13.77L9.49 17.02L9.75 16.25ZM0 13L0.26 13.77L10.01 10.52L9.75 9.75L9.49 8.98L-0.26 12.23L0 13ZM9.75 9.75L10.52 10.01L13.77 0.26L13 0L12.23 -0.26L8.98 9.49L9.75 9.75Z"
        fill="#1c2a21"
        transform="translate(284.71 17.88)"
      />
      {!bare && (
        <path
          d="M-1.3 0.9C-1.84 1.62 -1.69 2.64 -0.97 3.18C-0.26 3.71 0.76 3.57 1.3 2.85L0 1.88L-1.3 0.9ZM30.55 2.85C31.09 2.13 30.94 1.11 30.23 0.58C29.51 0.04 28.49 0.18 27.95 0.9L29.25 1.88L30.55 2.85ZM0 1.88L1.3 2.85C1.8 2.19 2.21 1.89 2.51 1.75C2.78 1.63 3.06 1.6 3.39 1.65C4.19 1.79 5.1 2.36 6.41 3.23C7.54 3.98 9.07 5.04 10.7 5.31C11.59 5.46 12.53 5.38 13.47 4.95C14.39 4.53 15.2 3.81 15.93 2.85L14.63 1.88L13.33 0.9C12.83 1.56 12.42 1.86 12.12 2C11.84 2.13 11.57 2.16 11.24 2.1C10.43 1.97 9.52 1.4 8.21 0.52C7.09 -0.23 5.56 -1.28 3.92 -1.55C3.04 -1.7 2.09 -1.63 1.15 -1.2C0.23 -0.78 -0.58 -0.06 -1.3 0.9L0 1.88ZM14.63 1.88L15.93 2.85C16.42 2.19 16.83 1.89 17.13 1.75C17.41 1.63 17.68 1.6 18.01 1.65C18.82 1.79 19.73 2.36 21.04 3.23C22.16 3.98 23.69 5.04 25.33 5.31C26.21 5.46 27.16 5.38 28.1 4.95C29.02 4.53 29.83 3.81 30.55 2.85L29.25 1.88L27.95 0.9C27.45 1.56 27.04 1.86 26.74 2C26.47 2.13 26.19 2.16 25.86 2.1C25.06 1.97 24.15 1.4 22.84 0.52C21.71 -0.23 20.18 -1.28 18.55 -1.55C17.66 -1.7 16.72 -1.63 15.78 -1.2C14.86 -0.78 14.05 -0.06 13.33 0.9L14.63 1.88Z"
          fill="#c9f27b"
          transform="translate(114.08 102.12)"
        />
      )}
    </g>
  </svg>
);

export const LearningCoverPython = ({
  className = '',
  viewBox = '-300 0 600 140',
  bare = false,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={viewBox}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <rect x="-1000" y="-300" width="2000" height="740" fill="#244a9f" />
    <g transform="scale(1.0769) translate(-214.8333282470703 0)">
      <path
        d="M9.75 -3.66C7.73 -3.66 6.09 -2.02 6.09 5.77e-15C6.09 2.02 7.73 3.66 9.75 3.66L9.75 5.77e-15L9.75 -3.66ZM32.5 5.77e-15L32.5 3.66L32.5 5.77e-15ZM42.25 24.38L42.25 28.03L45.91 28.03L45.91 24.38L42.25 24.38ZM9.75 24.38L9.75 20.72L9.75 24.38ZM0 34.13L-3.66 34.13L0 34.13ZM-3.66 45.5C-3.66 47.52 -2.02 49.16 0 49.16C2.02 49.16 3.66 47.52 3.66 45.5L0 45.5L-3.66 45.5ZM9.75 5.77e-15L9.75 3.66L32.5 3.66L32.5 5.77e-15L32.5 -3.66L9.75 -3.66L9.75 5.77e-15ZM32.5 5.77e-15L32.5 3.66C34.12 3.66 35.67 4.3 36.81 5.44L39.39 2.86L41.98 0.27C39.47 -2.24 36.06 -3.66 32.5 -3.66L32.5 5.77e-15ZM39.39 2.86L36.81 5.44C37.95 6.58 38.59 8.13 38.59 9.75L42.25 9.75L45.91 9.75C45.91 6.19 44.49 2.78 41.98 0.27L39.39 2.86ZM42.25 9.75L38.59 9.75L38.59 24.38L42.25 24.38L45.91 24.38L45.91 9.75L42.25 9.75ZM42.25 24.38L42.25 20.72L9.75 20.72L9.75 24.38L9.75 28.03L42.25 28.03L42.25 24.38ZM9.75 24.38L9.75 20.72C6.19 20.72 2.78 22.13 0.27 24.65L2.86 27.23L5.44 29.82C6.58 28.67 8.13 28.03 9.75 28.03L9.75 24.38ZM2.86 27.23L0.27 24.65C-2.24 27.16 -3.66 30.57 -3.66 34.13L0 34.13L3.66 34.13C3.66 32.51 4.3 30.96 5.44 29.82L2.86 27.23ZM0 34.13L-3.66 34.13L-3.66 45.5L0 45.5L3.66 45.5L3.66 34.13L0 34.13Z"
        fill="#ffd86b"
        transform="translate(188.83 40.63)"
      />
      <path
        d="M32.5 49.16C34.52 49.16 36.16 47.52 36.16 45.5C36.16 43.48 34.52 41.84 32.5 41.84L32.5 45.5L32.5 49.16ZM9.75 45.5L9.75 49.16L9.75 45.5ZM0 21.13L0 17.47L-3.66 17.47L-3.66 21.13L0 21.13ZM32.5 21.13L32.5 24.78L32.5 21.13ZM45.91 0C45.91 -2.02 44.27 -3.66 42.25 -3.66C40.23 -3.66 38.59 -2.02 38.59 0L42.25 0L45.91 0ZM32.5 45.5L32.5 41.84L9.75 41.84L9.75 45.5L9.75 49.16L32.5 49.16L32.5 45.5ZM9.75 45.5L9.75 41.84C8.13 41.84 6.58 41.2 5.44 40.06L2.86 42.64L0.27 45.23C2.78 47.74 6.19 49.16 9.75 49.16L9.75 45.5ZM2.86 42.64L5.44 40.06C4.3 38.92 3.66 37.37 3.66 35.75L0 35.75L-3.66 35.75C-3.66 39.31 -2.24 42.72 0.27 45.23L2.86 42.64ZM0 35.75L3.66 35.75L3.66 21.13L0 21.13L-3.66 21.13L-3.66 35.75L0 35.75ZM0 21.13L0 24.78L32.5 24.78L32.5 21.13L32.5 17.47L0 17.47L0 21.13ZM32.5 21.13L32.5 24.78C36.06 24.78 39.47 23.37 41.98 20.85L39.39 18.27L36.81 15.68C35.67 16.83 34.12 17.47 32.5 17.47L32.5 21.13ZM39.39 18.27L41.98 20.85C44.49 18.34 45.91 14.93 45.91 11.38L42.25 11.38L38.59 11.38C38.59 12.99 37.95 14.54 36.81 15.68L39.39 18.27ZM42.25 11.38L45.91 11.38L45.91 0L42.25 0L38.59 0L38.59 11.38L42.25 11.38Z"
        fill="#ffffff"
        transform="translate(198.58 43.88)"
      />
      <path
        d="M13 0L16.25 9.75L26 13L16.25 16.25L13 26L9.75 16.25L0 13L9.75 9.75L13 0Z"
        fill="#c9f27b"
        transform="translate(284.71 17.88)"
      />
      <path
        d="M13 0L13.77 -0.26L13 -2.57L12.23 -0.26L13 0ZM16.25 9.75L15.48 10.01L15.61 10.39L15.99 10.52L16.25 9.75ZM26 13L26.26 13.77L28.57 13L26.26 12.23L26 13ZM16.25 16.25L15.99 15.48L15.61 15.61L15.48 15.99L16.25 16.25ZM13 26L12.23 26.26L13 28.57L13.77 26.26L13 26ZM9.75 16.25L10.52 15.99L10.39 15.61L10.01 15.48L9.75 16.25ZM0 13L-0.26 12.23L-2.57 13L-0.26 13.77L0 13ZM9.75 9.75L10.01 10.52L10.39 10.39L10.52 10.01L9.75 9.75ZM13 0L12.23 0.26L15.48 10.01L16.25 9.75L17.02 9.49L13.77 -0.26L13 0ZM16.25 9.75L15.99 10.52L25.74 13.77L26 13L26.26 12.23L16.51 8.98L16.25 9.75ZM26 13L25.74 12.23L15.99 15.48L16.25 16.25L16.51 17.02L26.26 13.77L26 13ZM16.25 16.25L15.48 15.99L12.23 25.74L13 26L13.77 26.26L17.02 16.51L16.25 16.25ZM13 26L13.77 25.74L10.52 15.99L9.75 16.25L8.98 16.51L12.23 26.26L13 26ZM9.75 16.25L10.01 15.48L0.26 12.23L0 13L-0.26 13.77L9.49 17.02L9.75 16.25ZM0 13L0.26 13.77L10.01 10.52L9.75 9.75L9.49 8.98L-0.26 12.23L0 13ZM9.75 9.75L10.52 10.01L13.77 0.26L13 0L12.23 -0.26L8.98 9.49L9.75 9.75Z"
        fill="#1c2a21"
        transform="translate(284.71 17.88)"
      />
      {!bare && (
        <path
          d="M-1.3 0.9C-1.84 1.62 -1.69 2.64 -0.97 3.18C-0.26 3.71 0.76 3.57 1.3 2.85L0 1.88L-1.3 0.9ZM30.55 2.85C31.09 2.13 30.94 1.11 30.23 0.58C29.51 0.04 28.49 0.18 27.95 0.9L29.25 1.88L30.55 2.85ZM0 1.88L1.3 2.85C1.8 2.19 2.21 1.89 2.51 1.75C2.78 1.63 3.06 1.6 3.39 1.65C4.19 1.79 5.1 2.36 6.41 3.23C7.54 3.98 9.07 5.04 10.7 5.31C11.59 5.46 12.53 5.38 13.47 4.95C14.39 4.53 15.2 3.81 15.93 2.85L14.63 1.88L13.33 0.9C12.83 1.56 12.42 1.86 12.12 2C11.84 2.13 11.57 2.16 11.24 2.1C10.43 1.97 9.52 1.4 8.21 0.52C7.09 -0.23 5.56 -1.28 3.92 -1.55C3.04 -1.7 2.09 -1.63 1.15 -1.2C0.23 -0.78 -0.58 -0.06 -1.3 0.9L0 1.88ZM14.63 1.88L15.93 2.85C16.42 2.19 16.83 1.89 17.13 1.75C17.41 1.63 17.68 1.6 18.01 1.65C18.82 1.79 19.73 2.36 21.04 3.23C22.16 3.98 23.69 5.04 25.33 5.31C26.21 5.46 27.16 5.38 28.1 4.95C29.02 4.53 29.83 3.81 30.55 2.85L29.25 1.88L27.95 0.9C27.45 1.56 27.04 1.86 26.74 2C26.47 2.13 26.19 2.16 25.86 2.1C25.06 1.97 24.15 1.4 22.84 0.52C21.71 -0.23 20.18 -1.28 18.55 -1.55C17.66 -1.7 16.72 -1.63 15.78 -1.2C14.86 -0.78 14.05 -0.06 13.33 0.9L14.63 1.88Z"
          fill="#c9f27b"
          transform="translate(114.08 102.12)"
        />
      )}
    </g>
  </svg>
);

export const LearningStreakFlameIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M4.64 0C6.04 2.84 9.29 4.9 9.29 8.51C9.29 11.09 7.25 12.9 4.64 12.9C2.04 12.9 0 11.09 0 8.51C0 6.45 1.11 5.16 2.04 3.35C2.42 4.9 2.97 5.68 3.72 5.93C3.16 3.61 3.9 1.55 4.64 0Z"
      fill="#ff7a1e"
      transform="translate(2.86 1.2)"
    />
    <path
      d="M2.42 0C3.14 1.48 4.83 2.55 4.83 4.43C4.83 5.77 3.77 6.71 2.42 6.71C1.06 6.71 0 5.77 0 4.43C0 3.35 0.58 2.68 1.06 1.74C1.26 2.55 1.55 2.95 1.93 3.09C1.64 1.88 2.03 0.81 2.42 0Z"
      fill="#ffffff"
      fillOpacity="0.55"
      transform="translate(5.08 6.62)"
    />
  </svg>
);

export const LearningTargetIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M10 5L9.5 5C9.5 7.49 7.49 9.5 5 9.5L5 10L5 10.5C8.04 10.5 10.5 8.04 10.5 5L10 5ZM5 10L5 9.5C2.51 9.5 0.5 7.49 0.5 5L0 5L-0.5 5C-0.5 8.04 1.96 10.5 5 10.5L5 10ZM0 5L0.5 5C0.5 2.51 2.51 0.5 5 0.5L5 0L5 -0.5C1.96 -0.5 -0.5 1.96 -0.5 5L0 5ZM5 0L5 0.5C7.49 0.5 9.5 2.51 9.5 5L10 5L10.5 5C10.5 1.96 8.04 -0.5 5 -0.5L5 0Z"
      fill="#387440"
      transform="translate(1 1)"
    />
    <path
      d="M6 3L5.5 3C5.5 4.38 4.38 5.5 3 5.5L3 6L3 6.5C4.93 6.5 6.5 4.93 6.5 3L6 3ZM3 6L3 5.5C1.62 5.5 0.5 4.38 0.5 3L0 3L-0.5 3C-0.5 4.93 1.07 6.5 3 6.5L3 6ZM0 3L0.5 3C0.5 1.62 1.62 0.5 3 0.5L3 0L3 -0.5C1.07 -0.5 -0.5 1.07 -0.5 3L0 3ZM3 0L3 0.5C4.38 0.5 5.5 1.62 5.5 3L6 3L6.5 3C6.5 1.07 4.93 -0.5 3 -0.5L3 0Z"
      fill="#387440"
      transform="translate(3 3)"
    />
    <path
      d="M2 1L1.5 1C1.5 1.28 1.28 1.5 1 1.5L1 2L1 2.5C1.83 2.5 2.5 1.83 2.5 1L2 1ZM1 2L1 1.5C0.72 1.5 0.5 1.28 0.5 1L0 1L-0.5 1C-0.5 1.83 0.17 2.5 1 2.5L1 2ZM0 1L0.5 1C0.5 0.72 0.72 0.5 1 0.5L1 0L1 -0.5C0.17 -0.5 -0.5 0.17 -0.5 1L0 1ZM1 0L1 0.5C1.28 0.5 1.5 0.72 1.5 1L2 1L2.5 1C2.5 0.17 1.83 -0.5 1 -0.5L1 0Z"
      fill="#387440"
      transform="translate(5 5)"
    />
  </svg>
);

export const LearningZapIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21.98"
    height="21.98"
    viewBox="0 0 21.98 21.98"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M8.33 0L9.16 0.1C9.21 -0.26 9 -0.62 8.67 -0.76C8.33 -0.91 7.93 -0.82 7.69 -0.53L8.33 0ZM0 10L-0.64 9.47C-0.85 9.71 -0.89 10.06 -0.75 10.35C-0.62 10.65 -0.32 10.83 -1.42e-16 10.83L0 10ZM7.5 10L8.33 10.1C8.36 9.87 8.28 9.63 8.12 9.45C7.97 9.27 7.74 9.17 7.5 9.17L7.5 10ZM6.67 16.67L5.84 16.56C5.79 16.93 6 17.28 6.33 17.43C6.67 17.58 7.07 17.48 7.31 17.2L6.67 16.67ZM15 6.67L15.64 7.2C15.85 6.95 15.89 6.61 15.75 6.31C15.62 6.02 15.32 5.83 15 5.83L15 6.67ZM7.5 6.67L6.67 6.56C6.64 6.8 6.72 7.04 6.88 7.22C7.03 7.4 7.26 7.5 7.5 7.5L7.5 6.67ZM8.33 0L7.69 -0.53L-0.64 9.47L0 10L0.64 10.53L8.97 0.53L8.33 0ZM0 10L0 10.83L7.5 10.83L7.5 10L7.5 9.17L0 9.17L0 10ZM7.5 10L6.67 9.9L5.84 16.56L6.67 16.67L7.49 16.77L8.33 10.1L7.5 10ZM6.67 16.67L7.31 17.2L15.64 7.2L15 6.67L14.36 6.13L6.03 16.13L6.67 16.67ZM15 6.67L15 5.83L7.5 5.83L7.5 6.67L7.5 7.5L15 7.5L15 6.67ZM7.5 6.67L8.33 6.77L9.16 0.1L8.33 0L7.51 -0.1L6.67 6.56L7.5 6.67Z"
      fill="#1c2a21"
      transform="translate(2.66 1.92)"
    />
  </svg>
);

export const LearningAwardIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M9 4.5L8.25 4.5C8.25 6.57 6.57 8.25 4.5 8.25L4.5 9L4.5 9.75C7.4 9.75 9.75 7.4 9.75 4.5L9 4.5ZM4.5 9L4.5 8.25C2.43 8.25 0.75 6.57 0.75 4.5L0 4.5L-0.75 4.5C-0.75 7.4 1.6 9.75 4.5 9.75L4.5 9ZM0 4.5L0.75 4.5C0.75 2.43 2.43 0.75 4.5 0.75L4.5 0L4.5 -0.75C1.6 -0.75 -0.75 1.6 -0.75 4.5L0 4.5ZM4.5 0L4.5 0.75C6.57 0.75 8.25 2.43 8.25 4.5L9 4.5L9.75 4.5C9.75 1.6 7.4 -0.75 4.5 -0.75L4.5 0Z"
      fill="#967014"
      transform="translate(4.5 1.5)"
    />
    <path
      d="M7.11 -0.12C7.05 -0.53 6.66 -0.81 6.25 -0.74C5.84 -0.67 5.57 -0.29 5.64 0.12L6.38 0L7.11 -0.12ZM7.5 6.75L7.11 7.39C7.36 7.54 7.68 7.53 7.92 7.37C8.16 7.21 8.29 6.92 8.24 6.63L7.5 6.75ZM3.75 4.5L4.14 3.86C3.9 3.71 3.6 3.71 3.36 3.86L3.75 4.5ZM0 6.75L-0.74 6.63C-0.79 6.92 -0.66 7.21 -0.42 7.37C-0.18 7.53 0.14 7.54 0.39 7.39L0 6.75ZM1.86 0.12C1.93 -0.29 1.66 -0.67 1.25 -0.74C0.84 -0.81 0.45 -0.53 0.39 -0.12L1.13 0L1.86 0.12ZM6.38 0L5.64 0.12L6.76 6.87L7.5 6.75L8.24 6.63L7.11 -0.12L6.38 0ZM7.5 6.75L7.89 6.11L4.14 3.86L3.75 4.5L3.36 5.14L7.11 7.39L7.5 6.75ZM3.75 4.5L3.36 3.86L-0.39 6.11L0 6.75L0.39 7.39L4.14 5.14L3.75 4.5ZM0 6.75L0.74 6.87L1.86 0.12L1.13 0L0.39 -0.12L-0.74 6.63L0 6.75Z"
      fill="#967014"
      transform="translate(5.25 9.75)"
    />
  </svg>
);

export const LearningBannerSparkIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M4.96 0L5.62 -0.25C5.52 -0.52 5.25 -0.71 4.96 -0.71C4.66 -0.71 4.4 -0.52 4.29 -0.25L4.96 0ZM6.3 3.61L5.64 3.86C5.71 4.05 5.86 4.2 6.06 4.28L6.3 3.61ZM9.92 4.96L10.16 5.62C10.44 5.52 10.63 5.25 10.63 4.96C10.63 4.66 10.44 4.4 10.16 4.29L9.92 4.96ZM6.3 6.3L6.06 5.64C5.86 5.71 5.71 5.86 5.64 6.06L6.3 6.3ZM4.96 9.92L4.29 10.16C4.4 10.44 4.66 10.63 4.96 10.63C5.25 10.63 5.52 10.44 5.62 10.16L4.96 9.92ZM3.61 6.3L4.28 6.06C4.2 5.86 4.05 5.71 3.86 5.64L3.61 6.3ZM0 4.96L-0.25 4.29C-0.52 4.4 -0.71 4.66 -0.71 4.96C-0.71 5.25 -0.52 5.52 -0.25 5.62L0 4.96ZM3.61 3.61L3.86 4.28C4.05 4.2 4.2 4.05 4.28 3.86L3.61 3.61ZM4.96 0L4.29 0.25L5.64 3.86L6.3 3.61L6.97 3.37L5.62 -0.25L4.96 0ZM6.3 3.61L6.06 4.28L9.67 5.62L9.92 4.96L10.16 4.29L6.55 2.95L6.3 3.61ZM9.92 4.96L9.67 4.29L6.06 5.64L6.3 6.3L6.55 6.97L10.16 5.62L9.92 4.96ZM6.3 6.3L5.64 6.06L4.29 9.67L4.96 9.92L5.62 10.16L6.97 6.55L6.3 6.3ZM4.96 9.92L5.62 9.67L4.28 6.06L3.61 6.3L2.95 6.55L4.29 10.16L4.96 9.92ZM3.61 6.3L3.86 5.64L0.25 4.29L0 4.96L-0.25 5.62L3.37 6.97L3.61 6.3ZM0 4.96L0.25 5.62L3.86 4.28L3.61 3.61L3.37 2.95L-0.25 4.29L0 4.96ZM3.61 3.61L4.28 3.86L5.62 0.25L4.96 0L4.29 -0.25L2.95 3.37L3.61 3.61Z"
      fill="#2d5d33"
      transform="translate(3.54 2.13)"
    />
  </svg>
);

export const LearningUsersIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M6.5 3C6.5 3.28 6.72 3.5 7 3.5C7.28 3.5 7.5 3.28 7.5 3L7 3L6.5 3ZM7 2L7.5 2L7 2ZM5 0L5 -0.5L5 0ZM2 0L2 -0.5L2 0ZM0 2L-0.5 2L0 2ZM-0.5 3C-0.5 3.28 -0.28 3.5 0 3.5C0.28 3.5 0.5 3.28 0.5 3L0 3L-0.5 3ZM7 3L7.5 3L7.5 2L7 2L6.5 2L6.5 3L7 3ZM7 2L7.5 2C7.5 1.34 7.24 0.7 6.77 0.23L6.41 0.59L6.06 0.94C6.34 1.22 6.5 1.6 6.5 2L7 2ZM6.41 0.59L6.77 0.23C6.3 -0.24 5.66 -0.5 5 -0.5L5 0L5 0.5C5.4 0.5 5.78 0.66 6.06 0.94L6.41 0.59ZM5 0L5 -0.5L2 -0.5L2 0L2 0.5L5 0.5L5 0ZM2 0L2 -0.5C1.34 -0.5 0.7 -0.24 0.23 0.23L0.59 0.59L0.94 0.94C1.22 0.66 1.6 0.5 2 0.5L2 0ZM0.59 0.59L0.23 0.23C-0.24 0.7 -0.5 1.34 -0.5 2L0 2L0.5 2C0.5 1.6 0.66 1.22 0.94 0.94L0.59 0.59ZM0 2L-0.5 2L-0.5 3L0 3L0.5 3L0.5 2L0 2Z"
      fill="#967014"
      transform="translate(1 7.5)"
    />
    <path
      d="M4 2L3.5 2C3.5 2.83 2.83 3.5 2 3.5L2 4L2 4.5C3.38 4.5 4.5 3.38 4.5 2L4 2ZM2 4L2 3.5C1.17 3.5 0.5 2.83 0.5 2L0 2L-0.5 2C-0.5 3.38 0.62 4.5 2 4.5L2 4ZM0 2L0.5 2C0.5 1.17 1.17 0.5 2 0.5L2 0L2 -0.5C0.62 -0.5 -0.5 0.62 -0.5 2L0 2ZM2 0L2 0.5C2.83 0.5 3.5 1.17 3.5 2L4 2L4.5 2C4.5 0.62 3.38 -0.5 2 -0.5L2 0Z"
      fill="#967014"
      transform="translate(2.5 1.5)"
    />
    <path
      d="M2.5 8.94C2.5 9.21 2.72 9.44 3 9.44C3.28 9.44 3.5 9.21 3.5 8.94L3 8.94L2.5 8.94ZM3 7.94L3.5 7.94L3.5 7.93L3 7.94ZM1.63 5.52C1.36 5.45 1.08 5.61 1.02 5.88C0.95 6.14 1.11 6.42 1.38 6.48L1.5 6L1.63 5.52ZM0.12 -0.48C-0.14 -0.55 -0.42 -0.39 -0.48 -0.12C-0.55 0.14 -0.39 0.42 -0.12 0.48L0 0L0.12 -0.48ZM1.5 1.94L2 1.94L1.5 1.94ZM-0.12 3.39C-0.39 3.46 -0.55 3.73 -0.48 4C-0.42 4.27 -0.14 4.43 0.12 4.36L0 3.88L-0.12 3.39ZM3 8.94L3.5 8.94L3.5 7.94L3 7.94L2.5 7.94L2.5 8.94L3 8.94ZM3 7.94L3.5 7.93C3.5 7.38 3.32 6.84 2.98 6.4L2.58 6.71L2.19 7.02C2.39 7.28 2.5 7.6 2.5 7.94L3 7.94ZM2.58 6.71L2.98 6.4C2.64 5.97 2.16 5.65 1.63 5.52L1.5 6L1.38 6.48C1.7 6.57 1.98 6.75 2.19 7.02L2.58 6.71ZM0 0L-0.12 0.48C0.2 0.57 0.48 0.75 0.69 1.02L1.08 0.71L1.48 0.4C1.14 -0.03 0.66 -0.35 0.12 -0.48L0 0ZM1.08 0.71L0.69 1.02C0.89 1.28 1 1.6 1 1.94L1.5 1.94L2 1.94C2 1.38 1.82 0.84 1.48 0.4L1.08 0.71ZM1.5 1.94L1 1.94C1 2.27 0.89 2.59 0.69 2.86L1.08 3.16L1.48 3.47C1.82 3.03 2 2.49 2 1.94L1.5 1.94ZM1.08 3.16L0.69 2.86C0.48 3.12 0.2 3.31 -0.12 3.39L0 3.88L0.12 4.36C0.66 4.22 1.14 3.91 1.48 3.47L1.08 3.16Z"
      fill="#967014"
      transform="translate(8 1.56)"
    />
  </svg>
);

export const LearningSearchIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M0.44 -0.44C0.2 -0.69 -0.2 -0.69 -0.44 -0.44C-0.69 -0.2 -0.69 0.2 -0.44 0.44L0 0L0.44 -0.44ZM2.89 3.78C3.14 4.02 3.53 4.02 3.78 3.78C4.02 3.53 4.02 3.14 3.78 2.89L3.33 3.33L2.89 3.78ZM0 0L-0.44 0.44L2.89 3.78L3.33 3.33L3.78 2.89L0.44 -0.44L0 0Z"
      fill="#387440"
      transform="translate(14.17 14.17)"
    />
    <path
      d="M13.33 6.67L13.96 6.67C13.96 2.64 10.69 -0.62 6.67 -0.62L6.67 0L6.67 0.63C10 0.63 12.71 3.33 12.71 6.67L13.33 6.67ZM6.67 0L6.67 -0.62C2.64 -0.62 -0.62 2.64 -0.62 6.67L0 6.67L0.63 6.67C0.63 3.33 3.33 0.63 6.67 0.63L6.67 0ZM0 6.67L-0.62 6.67C-0.62 10.69 2.64 13.96 6.67 13.96L6.67 13.33L6.67 12.71C3.33 12.71 0.63 10 0.63 6.67L0 6.67ZM6.67 13.33L6.67 13.96C10.69 13.96 13.96 10.69 13.96 6.67L13.33 6.67L12.71 6.67C12.71 10 10 12.71 6.67 12.71L6.67 13.33Z"
      fill="#387440"
      transform="translate(2.5 2.5)"
    />
  </svg>
);

export const LearningBellIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M2.13 4.25L1.42 4.25L2.13 4.25ZM6.38 0L6.38 -0.71L6.38 0ZM10.63 4.25L11.33 4.25L10.63 4.25ZM12.75 10.63L12.75 11.33C13.06 11.33 13.34 11.13 13.43 10.83C13.52 10.53 13.4 10.21 13.14 10.04L12.75 10.63ZM0 10.63L-0.39 10.04C-0.65 10.21 -0.77 10.53 -0.68 10.83C-0.59 11.13 -0.31 11.33 3.49e-16 11.33L0 10.63ZM5.79 13.12C5.6 12.77 5.17 12.65 4.83 12.84C4.49 13.03 4.36 13.46 4.55 13.8L5.17 13.46L5.79 13.12ZM8.2 13.8C8.39 13.46 8.26 13.03 7.92 12.84C7.58 12.65 7.15 12.77 6.96 13.12L7.58 13.46L8.2 13.8ZM2.13 4.25L2.83 4.25C2.83 3.31 3.21 2.41 3.87 1.75L3.37 1.24L2.87 0.74C1.94 1.67 1.42 2.93 1.42 4.25L2.13 4.25ZM3.37 1.24L3.87 1.75C4.53 1.08 5.44 0.71 6.38 0.71L6.38 0L6.38 -0.71C5.06 -0.71 3.8 -0.19 2.87 0.74L3.37 1.24ZM6.38 0L6.38 0.71C7.31 0.71 8.22 1.08 8.88 1.75L9.38 1.24L9.88 0.74C8.95 -0.19 7.69 -0.71 6.38 -0.71L6.38 0ZM9.38 1.24L8.88 1.75C9.54 2.41 9.92 3.31 9.92 4.25L10.63 4.25L11.33 4.25C11.33 2.93 10.81 1.67 9.88 0.74L9.38 1.24ZM10.63 4.25L9.92 4.25C9.92 6.83 10.47 8.55 11.07 9.64C11.36 10.18 11.66 10.56 11.9 10.81C12.02 10.94 12.13 11.03 12.21 11.1C12.24 11.13 12.28 11.16 12.3 11.18C12.32 11.19 12.33 11.19 12.34 11.2C12.34 11.2 12.34 11.21 12.35 11.21C12.35 11.21 12.35 11.21 12.35 11.21C12.35 11.21 12.35 11.21 12.36 11.21C12.36 11.21 12.36 11.21 12.36 11.21C12.36 11.21 12.36 11.21 12.75 10.63C13.14 10.04 13.14 10.04 13.14 10.04C13.14 10.04 13.14 10.04 13.14 10.04C13.15 10.04 13.15 10.04 13.15 10.04C13.15 10.04 13.15 10.04 13.15 10.04C13.15 10.04 13.15 10.04 13.15 10.04C13.15 10.04 13.15 10.04 13.15 10.04C13.14 10.04 13.13 10.03 13.11 10.01C13.07 9.98 13.01 9.92 12.93 9.84C12.77 9.67 12.54 9.39 12.31 8.96C11.84 8.1 11.33 6.62 11.33 4.25L10.63 4.25ZM12.75 10.63L12.75 9.92L0 9.92L0 10.63L0 11.33L12.75 11.33L12.75 10.63ZM0 10.63C0.39 11.21 0.39 11.21 0.39 11.21C0.39 11.21 0.39 11.21 0.39 11.21C0.4 11.21 0.4 11.21 0.4 11.21C0.4 11.21 0.4 11.21 0.4 11.21C0.41 11.21 0.41 11.2 0.41 11.2C0.42 11.19 0.43 11.19 0.45 11.18C0.47 11.16 0.51 11.13 0.54 11.1C0.62 11.03 0.73 10.94 0.85 10.81C1.09 10.56 1.39 10.18 1.68 9.64C2.28 8.55 2.83 6.83 2.83 4.25L2.13 4.25L1.42 4.25C1.42 6.62 0.91 8.1 0.44 8.96C0.21 9.39 -0.02 9.67 -0.18 9.84C-0.26 9.92 -0.32 9.98 -0.36 10.01C-0.38 10.03 -0.39 10.04 -0.4 10.04C-0.4 10.04 -0.4 10.04 -0.4 10.04C-0.4 10.04 -0.4 10.04 -0.4 10.04C-0.4 10.04 -0.4 10.04 -0.4 10.04C-0.4 10.04 -0.4 10.04 -0.39 10.04C-0.39 10.04 -0.39 10.04 -0.39 10.04C-0.39 10.04 -0.39 10.04 0 10.63ZM5.17 13.46L4.55 13.8C4.73 14.13 4.99 14.4 5.31 14.59L5.68 13.98L6.04 13.37C5.93 13.31 5.85 13.22 5.79 13.12L5.17 13.46ZM5.68 13.98L5.31 14.59C5.64 14.78 6 14.88 6.38 14.88L6.38 14.17L6.38 13.46C6.26 13.46 6.14 13.43 6.04 13.37L5.68 13.98ZM6.38 14.17L6.38 14.88C6.75 14.88 7.11 14.78 7.44 14.59L7.07 13.98L6.71 13.37C6.61 13.43 6.49 13.46 6.38 13.46L6.38 14.17ZM7.07 13.98L7.44 14.59C7.76 14.4 8.02 14.13 8.2 13.8L7.58 13.46L6.96 13.12C6.9 13.22 6.82 13.31 6.71 13.37L7.07 13.98Z"
      fill="#967014"
      transform="translate(2.13 1.42)"
    />
  </svg>
);

export const LearningClockIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M10.83 5.42L10.29 5.42C10.29 8.11 8.11 10.29 5.42 10.29L5.42 10.83L5.42 11.38C8.71 11.38 11.38 8.71 11.38 5.42L10.83 5.42ZM5.42 10.83L5.42 10.29C2.72 10.29 0.54 8.11 0.54 5.42L0 5.42L-0.54 5.42C-0.54 8.71 2.13 11.38 5.42 11.38L5.42 10.83ZM0 5.42L0.54 5.42C0.54 2.72 2.72 0.54 5.42 0.54L5.42 0L5.42 -0.54C2.13 -0.54 -0.54 2.13 -0.54 5.42L0 5.42ZM5.42 0L5.42 0.54C8.11 0.54 10.29 2.72 10.29 5.42L10.83 5.42L11.38 5.42C11.38 2.13 8.71 -0.54 5.42 -0.54L5.42 0Z"
      fill="#737373"
      transform="translate(1.08 1.08)"
    />
    <path
      d="M0.54 0C0.54 -0.3 0.3 -0.54 0 -0.54C-0.3 -0.54 -0.54 -0.3 -0.54 0L0 0L0.54 0ZM0 3.25L-0.54 3.25C-0.54 3.46 -0.43 3.64 -0.24 3.73L0 3.25ZM1.92 4.82C2.19 4.95 2.52 4.84 2.65 4.58C2.78 4.31 2.68 3.98 2.41 3.85L2.17 4.33L1.92 4.82ZM0 0L-0.54 0L-0.54 3.25L0 3.25L0.54 3.25L0.54 0L0 0ZM0 3.25L-0.24 3.73L1.92 4.82L2.17 4.33L2.41 3.85L0.24 2.77L0 3.25Z"
      fill="#737373"
      transform="translate(6.5 3.25)"
    />
  </svg>
);

export const LearningBookmarkIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M9.33 12L4.67 9.33L0 12L0 1.33C0 0.98 0.14 0.64 0.39 0.39C0.64 0.14 0.98 2.96e-16 1.33 0L8 0C8.35 2.96e-16 8.69 0.14 8.94 0.39C9.19 0.64 9.33 0.98 9.33 1.33L9.33 12Z"
      fill="#ffffff"
      transform="translate(3.33 2)"
    />
    <path
      d="M9.33 12L9 12.58C9.21 12.7 9.46 12.7 9.67 12.58C9.87 12.46 10 12.24 10 12L9.33 12ZM4.67 9.33L5 8.75C4.79 8.64 4.54 8.64 4.34 8.75L4.67 9.33ZM0 12L-0.67 12C-0.67 12.24 -0.54 12.46 -0.33 12.58C-0.13 12.7 0.12 12.7 0.33 12.58L0 12ZM1.33 0L1.33 -0.67L1.33 0ZM8 0L8 -0.67L8 0ZM9.33 12L9.66 11.42L5 8.75L4.67 9.33L4.34 9.91L9 12.58L9.33 12ZM4.67 9.33L4.34 8.75L-0.33 11.42L0 12L0.33 12.58L5 9.91L4.67 9.33ZM0 12L0.67 12L0.67 1.33L0 1.33L-0.67 1.33L-0.67 12L0 12ZM0 1.33L0.67 1.33C0.67 1.16 0.74 0.99 0.86 0.86L0.39 0.39L-0.08 -0.08C-0.46 0.29 -0.67 0.8 -0.67 1.33L0 1.33ZM0.39 0.39L0.86 0.86C0.99 0.74 1.16 0.67 1.33 0.67L1.33 0L1.33 -0.67C0.8 -0.67 0.29 -0.46 -0.08 -0.08L0.39 0.39ZM1.33 0L1.33 0.67L8 0.67L8 0L8 -0.67L1.33 -0.67L1.33 0ZM8 0L8 0.67C8.18 0.67 8.35 0.74 8.47 0.86L8.94 0.39L9.41 -0.08C9.04 -0.46 8.53 -0.67 8 -0.67L8 0ZM8.94 0.39L8.47 0.86C8.6 0.99 8.67 1.16 8.67 1.33L9.33 1.33L10 1.33C10 0.8 9.79 0.29 9.41 -0.08L8.94 0.39ZM9.33 1.33L8.67 1.33L8.67 12L9.33 12L10 12L10 1.33L9.33 1.33Z"
      fill="#ffffff"
      transform="translate(3.33 2)"
    />
  </svg>
);

export const LearningToastBookmarkIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M8.75 11.25L4.38 8.75L0 11.25L0 1.25C0 0.92 0.13 0.6 0.37 0.37C0.6 0.13 0.92 2.78e-16 1.25 0L7.5 0C7.83 2.78e-16 8.15 0.13 8.38 0.37C8.62 0.6 8.75 0.92 8.75 1.25L8.75 11.25Z"
      fill="#1c2a21"
      transform="translate(3.13 1.88)"
    />
    <path
      d="M8.75 11.25L8.36 11.93C8.6 12.07 8.9 12.07 9.14 11.93C9.38 11.79 9.53 11.53 9.53 11.25L8.75 11.25ZM4.38 8.75L4.76 8.07C4.52 7.93 4.23 7.93 3.99 8.07L4.38 8.75ZM0 11.25L-0.78 11.25C-0.78 11.53 -0.63 11.79 -0.39 11.93C-0.15 12.07 0.15 12.07 0.39 11.93L0 11.25ZM1.25 0L1.25 -0.78L1.25 0ZM7.5 0L7.5 -0.78L7.5 0ZM8.75 11.25L9.14 10.57L4.76 8.07L4.38 8.75L3.99 9.43L8.36 11.93L8.75 11.25ZM4.38 8.75L3.99 8.07L-0.39 10.57L0 11.25L0.39 11.93L4.76 9.43L4.38 8.75ZM0 11.25L0.78 11.25L0.78 1.25L0 1.25L-0.78 1.25L-0.78 11.25L0 11.25ZM0 1.25L0.78 1.25C0.78 1.13 0.83 1.01 0.92 0.92L0.37 0.37L-0.19 -0.19C-0.57 0.19 -0.78 0.71 -0.78 1.25L0 1.25ZM0.37 0.37L0.92 0.92C1.01 0.83 1.13 0.78 1.25 0.78L1.25 0L1.25 -0.78C0.71 -0.78 0.19 -0.57 -0.19 -0.19L0.37 0.37ZM1.25 0L1.25 0.78L7.5 0.78L7.5 0L7.5 -0.78L1.25 -0.78L1.25 0ZM7.5 0L7.5 0.78C7.62 0.78 7.74 0.83 7.83 0.92L8.38 0.37L8.94 -0.19C8.56 -0.57 8.04 -0.78 7.5 -0.78L7.5 0ZM8.38 0.37L7.83 0.92C7.92 1.01 7.97 1.13 7.97 1.25L8.75 1.25L9.53 1.25C9.53 0.71 9.32 0.19 8.94 -0.19L8.38 0.37ZM8.75 1.25L7.97 1.25L7.97 11.25L8.75 11.25L9.53 11.25L9.53 1.25L8.75 1.25Z"
      fill="#1c2a21"
      transform="translate(3.13 1.88)"
    />
  </svg>
);

export const LearningHeaderSparkleIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15.17"
    height="15.17"
    viewBox="0 0 15.17 15.17"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M7 0C7.58 4.08 9.92 6.42 14 7C9.92 7.58 7.58 9.92 7 14C6.42 9.92 4.08 7.58 0 7C4.08 6.42 6.42 4.08 7 0Z"
      fill="#f3c84b"
    />
  </svg>
);

export const LearningHeaderFlameIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14.94"
    height="14.94"
    viewBox="0 0 14.94 14.94"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M3.5 0C4.08 2.33 7 3.5 7 7C7 7.93 6.63 8.82 5.97 9.47C5.32 10.13 4.43 10.5 3.5 10.5C2.57 10.5 1.68 10.13 1.03 9.47C0.37 8.82 1.04e-15 7.93 0 7C0 5.25 1.17 4.08 1.75 3.5C1.75 4.67 2.33 5.25 2.92 5.25C2.92 3.5 2.33 1.75 3.5 0Z"
      fill="#e8672a"
      transform="translate(3.57 1.41)"
    />
  </svg>
);

export const LearningDoodleSparkleGold = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M11 0C11.92 6.42 15.58 10.08 22 11C15.58 11.92 11.92 15.58 11 22C10.08 15.58 6.42 11.92 0 11C6.42 10.08 10.08 6.42 11 0Z"
      fill="#c8951a"
    />
  </svg>
);

export const LearningDoodleSparkleGreen = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M6 0C6.5 3.5 8.5 5.5 12 6C8.5 6.5 6.5 8.5 6 12C5.5 8.5 3.5 6.5 0 6C3.5 5.5 5.5 3.5 6 0Z"
      fill="#387440"
    />
  </svg>
);

export const LearningSpotBookIllustration = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="140"
    height="140"
    viewBox="0 0 140 140"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M0.33 57.84C-3.17 28.09 21.33 1.84 52.83 0.09C84.33 -1.66 110.58 21.09 108.83 54.34C107.08 87.59 82.58 110.34 51.08 106.84C21.33 103.34 3.83 85.84 0.33 57.84Z"
      fill="#e1eae2"
      transform="translate(15.42 15.66)"
    />
    <path
      d="M47.25 8.69C35 -0.06 17.5 -1.81 0 1.69L0 71.69C17.5 68.19 35 69.94 47.25 78.69L47.25 8.69Z"
      fill="#1c2a21"
      transform="translate(29.75 40.31)"
    />
    <path
      d="M47.25 8.69C35 -0.06 17.5 -1.81 0 1.69L0 71.69C17.5 68.19 35 69.94 47.25 78.69L47.25 8.69Z"
      fill="#ffffff"
      transform="translate(22.75 36.81)"
    />
    <path
      d="M47.25 8.69L48.56 8.69C48.56 8.27 48.36 7.87 48.01 7.62L47.25 8.69ZM0 1.69L-0.26 0.4C-0.87 0.53 -1.31 1.06 -1.31 1.69L0 1.69ZM0 71.69L-1.31 71.69C-1.31 72.08 -1.14 72.46 -0.83 72.71C-0.53 72.95 -0.13 73.05 0.26 72.98L0 71.69ZM47.25 78.69L46.49 79.76C46.89 80.04 47.41 80.08 47.85 79.86C48.29 79.63 48.56 79.18 48.56 78.69L47.25 78.69ZM47.25 8.69L48.01 7.62C35.36 -1.42 17.44 -3.14 -0.26 0.4L0 1.69L0.26 2.98C17.56 -0.48 34.64 1.3 46.49 9.76L47.25 8.69ZM0 1.69L-1.31 1.69L-1.31 71.69L0 71.69L1.31 71.69L1.31 1.69L0 1.69ZM0 71.69L0.26 72.98C17.56 69.52 34.64 71.3 46.49 79.76L47.25 78.69L48.01 77.62C35.36 68.58 17.44 66.86 -0.26 70.4L0 71.69ZM47.25 78.69L48.56 78.69L48.56 8.69L47.25 8.69L45.94 8.69L45.94 78.69L47.25 78.69Z"
      fill="#1c2a21"
      transform="translate(22.75 36.81)"
    />
    <path
      d="M0 8.69C12.25 -0.06 29.75 -1.81 47.25 1.69L47.25 71.69C29.75 68.19 12.25 69.94 0 78.69L0 8.69Z"
      fill="#f3c84b"
      transform="translate(70 36.81)"
    />
    <path
      d="M0 8.69L-0.76 7.62C-1.11 7.87 -1.31 8.27 -1.31 8.69L0 8.69ZM47.25 1.69L48.56 1.69C48.56 1.06 48.12 0.53 47.51 0.4L47.25 1.69ZM47.25 71.69L46.99 72.98C47.38 73.05 47.78 72.95 48.08 72.71C48.39 72.46 48.56 72.08 48.56 71.69L47.25 71.69ZM0 78.69L-1.31 78.69C-1.31 79.18 -1.04 79.63 -0.6 79.86C-0.16 80.08 0.36 80.04 0.76 79.76L0 78.69ZM0 8.69L0.76 9.76C12.61 1.3 29.69 -0.48 46.99 2.98L47.25 1.69L47.51 0.4C29.81 -3.14 11.89 -1.42 -0.76 7.62L0 8.69ZM47.25 1.69L45.94 1.69L45.94 71.69L47.25 71.69L48.56 71.69L48.56 1.69L47.25 1.69ZM47.25 71.69L47.51 70.4C29.81 66.86 11.89 68.58 -0.76 77.62L0 78.69L0.76 79.76C12.61 71.3 29.69 69.52 46.99 72.98L47.25 71.69ZM0 78.69L1.31 78.69L1.31 8.69L0 8.69L-1.31 8.69L-1.31 78.69L0 78.69Z"
      fill="#1c2a21"
      transform="translate(70 36.81)"
    />
    <path
      d="M-0.22 -0.61C-0.93 -0.49 -1.41 0.19 -1.29 0.9C-1.18 1.62 -0.5 2.1 0.22 1.98L0 0.69L-0.22 -0.61ZM25.66 5.36C26.31 5.68 27.1 5.42 27.42 4.77C27.75 4.13 27.49 3.34 26.84 3.01L26.25 4.19L25.66 5.36ZM-0.22 13.39C-0.93 13.51 -1.41 14.19 -1.29 14.9C-1.18 15.62 -0.5 16.1 0.22 15.98L0 14.69L-0.22 13.39ZM25.66 19.36C26.31 19.68 27.1 19.42 27.42 18.77C27.75 18.13 27.49 17.34 26.84 17.01L26.25 18.19L25.66 19.36ZM-0.22 27.39C-0.93 27.51 -1.41 28.19 -1.29 28.9C-1.18 29.62 -0.5 30.1 0.22 29.98L0 28.69L-0.22 27.39ZM25.66 33.36C26.31 33.68 27.1 33.42 27.42 32.77C27.75 32.13 27.49 31.34 26.84 31.01L26.25 32.19L25.66 33.36ZM0 0.69L0.22 1.98C10.44 0.28 18.91 1.98 25.66 5.36L26.25 4.19L26.84 3.01C19.59 -0.61 10.56 -2.4 -0.22 -0.61L0 0.69ZM0 14.69L0.22 15.98C10.44 14.28 18.91 15.98 25.66 19.36L26.25 18.19L26.84 17.01C19.59 13.39 10.56 11.6 -0.22 13.39L0 14.69ZM0 28.69L0.22 29.98C10.44 28.28 18.91 29.98 25.66 33.36L26.25 32.19L26.84 31.01C19.59 27.39 10.56 25.6 -0.22 27.39L0 28.69Z"
      fill="#387440"
      transform="translate(35 55.31)"
    />
    <path
      d="M10.5 0C11.76 9.24 11.76 9.24 21 10.5C11.76 11.76 11.76 11.76 10.5 21C9.24 11.76 9.24 11.76 0 10.5C9.24 9.24 9.24 9.24 10.5 0Z"
      fill="#1c2a21"
      transform="translate(84 61.25)"
    />
    <path
      d="M8.75 0C9.8 7.7 9.8 7.7 17.5 8.75C9.8 9.8 9.8 9.8 8.75 17.5C7.7 9.8 7.7 9.8 0 8.75C7.7 7.7 7.7 7.7 8.75 0Z"
      fill="#c8951a"
      transform="translate(61.25 12.25)"
    />
    <path
      d="M5.25 0C5.88 4.62 5.88 4.62 10.5 5.25C5.88 5.88 5.88 5.88 5.25 10.5C4.62 5.88 4.62 5.88 0 5.25C4.62 4.62 4.62 4.62 5.25 0Z"
      fill="#387440"
      transform="translate(108.5 17.5)"
    />
    <path
      d="M-1.05 2.71C-1.48 3.29 -1.37 4.12 -0.79 4.55C-0.21 4.98 0.62 4.87 1.05 4.29L0 3.5L-1.05 2.71ZM22.05 4.29C22.48 3.71 22.37 2.88 21.79 2.45C21.21 2.02 20.38 2.13 19.95 2.71L21 3.5L22.05 4.29ZM0 3.5L1.05 4.29C2.72 2.07 4.13 1.31 5.25 1.31C6.37 1.31 7.78 2.07 9.45 4.29L10.5 3.5L11.55 2.71C9.72 0.27 7.63 -1.31 5.25 -1.31C2.87 -1.31 0.78 0.27 -1.05 2.71L0 3.5ZM10.5 3.5L9.45 4.29C11.28 6.73 13.37 8.31 15.75 8.31C18.13 8.31 20.22 6.73 22.05 4.29L21 3.5L19.95 2.71C18.28 4.93 16.87 5.69 15.75 5.69C14.63 5.69 13.22 4.93 11.55 2.71L10.5 3.5Z"
      fill="#c8951a"
      transform="translate(17.5 119)"
    />
  </svg>
);

export const LearningSpotBookmarkIllustration = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="140"
    height="140"
    viewBox="0 0 140 140"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M0.33 57.84C-3.17 28.09 21.33 1.84 52.83 0.09C84.33 -1.66 110.58 21.09 108.83 54.34C107.08 87.59 82.58 110.34 51.08 106.84C21.33 103.34 3.83 85.84 0.33 57.84Z"
      fill="#faf4e8"
      transform="translate(15.42 15.66)"
    />
    <path
      d="M0 0L49 0L49 94.5L24.5 75.25L0 94.5L0 0Z"
      fill="#1c2a21"
      transform="translate(49 26.25)"
    />
    <path
      d="M0 0L49 0L49 94.5L24.5 75.25L0 94.5L0 0Z"
      fill="#387440"
      transform="translate(45.5 22.75)"
    />
    <path
      d="M0 0L0 -1.31C-0.72 -1.31 -1.31 -0.72 -1.31 2.91e-16L0 0ZM49 0L50.31 0C50.31 -0.72 49.72 -1.31 49 -1.31L49 0ZM49 94.5L48.19 95.53C48.58 95.84 49.12 95.9 49.57 95.68C50.03 95.46 50.31 95 50.31 94.5L49 94.5ZM24.5 75.25L25.31 74.22C24.84 73.84 24.17 73.84 23.69 74.22L24.5 75.25ZM0 94.5L-1.31 94.5C-1.31 95 -1.03 95.46 -0.57 95.68C-0.12 95.9 0.42 95.84 0.81 95.53L0 94.5ZM0 0L0 1.31L49 1.31L49 0L49 -1.31L0 -1.31L0 0ZM49 0L47.69 0L47.69 94.5L49 94.5L50.31 94.5L50.31 0L49 0ZM49 94.5L49.81 93.47L25.31 74.22L24.5 75.25L23.69 76.28L48.19 95.53L49 94.5ZM24.5 75.25L23.69 74.22L-0.81 93.47L0 94.5L0.81 95.53L25.31 76.28L24.5 75.25ZM0 94.5L1.31 94.5L1.31 0L0 0L-1.31 0L-1.31 94.5L0 94.5Z"
      fill="#1c2a21"
      transform="translate(45.5 22.75)"
    />
    <path
      d="M10.69 17.73C-6.46 7.93 -0.34 -5.55 10.69 2.41C21.71 -5.55 27.84 7.93 10.69 17.73Z"
      fill="#ffffff"
      transform="translate(59.31 49.3)"
    />
    <path
      d="M10.69 17.73L10.04 18.86C10.44 19.1 10.94 19.1 11.34 18.86L10.69 17.73ZM10.69 2.41L9.92 3.48C10.38 3.81 11 3.81 11.46 3.48L10.69 2.41ZM10.69 17.73L11.34 16.59C7.19 14.21 4.52 11.66 3 9.35C1.46 7.03 1.12 5.03 1.41 3.68C1.68 2.4 2.52 1.57 3.83 1.36C5.22 1.14 7.33 1.6 9.92 3.48L10.69 2.41L11.46 1.35C8.54 -0.76 5.74 -1.6 3.42 -1.23C1.01 -0.84 -0.67 0.82 -1.16 3.14C-1.64 5.38 -0.98 8.09 0.81 10.8C2.61 13.53 5.61 16.34 10.04 18.86L10.69 17.73ZM10.69 2.41L11.46 3.48C14.05 1.6 16.15 1.14 17.54 1.36C18.85 1.57 19.7 2.4 19.97 3.68C20.26 5.03 19.92 7.03 18.38 9.35C16.85 11.66 14.19 14.21 10.04 16.59L10.69 17.73L11.34 18.86C15.76 16.34 18.76 13.53 20.57 10.8C22.36 8.09 23.02 5.38 22.54 3.14C22.04 0.82 20.36 -0.84 17.96 -1.23C15.64 -1.6 12.84 -0.76 9.92 1.35L10.69 2.41Z"
      fill="#1c2a21"
      transform="translate(59.31 49.3)"
    />
    <path
      d="M7.88 0C8.82 6.93 8.82 6.93 15.75 7.88C8.82 8.82 8.82 8.82 7.88 15.75C6.93 8.82 6.93 8.82 0 7.88C6.93 6.93 6.93 6.93 7.88 0Z"
      fill="#c8951a"
      transform="translate(102.38 21.88)"
    />
    <path
      d="M5.25 0C5.88 4.62 5.88 4.62 10.5 5.25C5.88 5.88 5.88 5.88 5.25 10.5C4.62 5.88 4.62 5.88 0 5.25C4.62 4.62 4.62 4.62 5.25 0Z"
      fill="#387440"
      transform="translate(22.75 35)"
    />
    <path
      d="M-1.05 2.71C-1.48 3.29 -1.37 4.12 -0.79 4.55C-0.21 4.98 0.62 4.87 1.05 4.29L0 3.5L-1.05 2.71ZM22.05 4.29C22.48 3.71 22.37 2.88 21.79 2.45C21.21 2.02 20.38 2.13 19.95 2.71L21 3.5L22.05 4.29ZM0 3.5L1.05 4.29C2.72 2.07 4.13 1.31 5.25 1.31C6.37 1.31 7.78 2.07 9.45 4.29L10.5 3.5L11.55 2.71C9.72 0.27 7.63 -1.31 5.25 -1.31C2.87 -1.31 0.78 0.27 -1.05 2.71L0 3.5ZM10.5 3.5L9.45 4.29C11.28 6.73 13.37 8.31 15.75 8.31C18.13 8.31 20.22 6.73 22.05 4.29L21 3.5L19.95 2.71C18.28 4.93 16.87 5.69 15.75 5.69C14.63 5.69 13.22 4.93 11.55 2.71L10.5 3.5Z"
      fill="#c8951a"
      transform="translate(19.25 110.25)"
    />
    <path
      d="M8.75 4.38L7.44 4.38C7.44 6.07 6.07 7.44 4.38 7.44L4.38 8.75L4.38 10.06C7.52 10.06 10.06 7.52 10.06 4.38L8.75 4.38ZM4.38 8.75L4.38 7.44C2.68 7.44 1.31 6.07 1.31 4.38L0 4.38L-1.31 4.38C-1.31 7.52 1.23 10.06 4.38 10.06L4.38 8.75ZM0 4.38L1.31 4.38C1.31 2.68 2.68 1.31 4.38 1.31L4.38 0L4.38 -1.31C1.23 -1.31 -1.31 1.23 -1.31 4.38L0 4.38ZM4.38 0L4.38 1.31C6.07 1.31 7.44 2.68 7.44 4.38L8.75 4.38L10.06 4.38C10.06 1.23 7.52 -1.31 4.38 -1.31L4.38 0Z"
      fill="#c8951a"
      transform="translate(112.88 104.13)"
    />
  </svg>
);

export const LearningDoodleSquiggle = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="21"
    viewBox="0 0 48 21"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M2.70447 9.28741C6.79012 4.41926 10.1257 4.88804 12.7112 10.6938C15.2968 16.4995 18.6324 16.9683 22.718 12.1001C26.8036 7.23197 30.1392 7.70076 32.7248 13.5065C35.3103 19.3122 38.6459 19.781 42.7315 14.9128"
      stroke="#349643"
      strokeWidth="2.52628"
      strokeLinecap="round"
    />
  </svg>
);

export const LearningDoodleRing = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <circle cx="7" cy="7" r="6" stroke="#c8951a" strokeWidth="2" />
  </svg>
);
