// Shared inline SVG icons. Anything inlined as a React SVG component on
// LoginPage or GetStartedPage lives here so both pages — and any future
// screens — pull from one source of truth. Paths are Figma-verbatim;
// dimensions / fills / strokes are baked into each component to match
// the design system.

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

export const PersonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      fill="#387440"
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

export const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
