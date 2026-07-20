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
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    aria-hidden="true"
    className={className}
  >
    <circle cx="8" cy="5.5" r="2.5" />
    <path d="M3 13c0-2.76 2.24-5 5-5s5 2.24 5 5" />
  </svg>
);

export const InterestsStepIcon = ({ className = '' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    aria-hidden="true"
    className={className}
  >
    <circle cx="5.8" cy="8" r="4" />
    <circle cx="10.2" cy="8" r="4" />
  </svg>
);

export const PersonalityStepIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    className={className}
  >
    <path
      d="M20.0007 37.9193C29.8958 37.9193 37.9173 29.8977 37.9173 20.0026C37.9173 10.1075 29.8958 2.08594 20.0007 2.08594C10.1055 2.08594 2.08398 10.1075 2.08398 20.0026C2.08398 29.8977 10.1055 37.9193 20.0007 37.9193Z"
      stroke="currentColor"
      stroke-width="0.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M20.0007 30.4193C25.7536 30.4193 30.4173 25.7556 30.4173 20.0026C30.4173 14.2496 25.7536 9.58594 20.0007 9.58594C14.2477 9.58594 9.58398 14.2496 9.58398 20.0026C9.58398 25.7556 14.2477 30.4193 20.0007 30.4193Z"
      stroke="currentColor"
      stroke-width="0.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M20 25C22.7614 25 25 22.7614 25 20C25 17.2386 22.7614 15 20 15C17.2386 15 15 17.2386 15 20C15 22.7614 17.2386 25 20 25Z"
      stroke="currentColor"
      stroke-width="0.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M19.9993 34.5807C28.0535 34.5807 34.5827 28.0515 34.5827 19.9974C34.5827 11.9432 28.0535 5.41406 19.9993 5.41406C11.9452 5.41406 5.41602 11.9432 5.41602 19.9974C5.41602 28.0515 11.9452 34.5807 19.9993 34.5807Z"
      stroke="currentColor"
      stroke-width="0.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const SkillsStepIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M9.5 1.5 4 9h5.5L7 14.5 14 6h-5.5z" />
  </svg>
);

export const WorkStepIcon = ({ className = '' }) => (
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
    <rect x="1.5" y="5.5" width="13" height="9" rx="1.5" />
    <path d="M5.5 5.5V4a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1.5" />
    <path d="M1.5 9.5h13" />
  </svg>
);

export const PortfolioStepIcon = ({ className = '' }) => (
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
    <rect x="2.5" y="4.5" width="9" height="10" rx="1" />
    <path d="M5 4.5V3a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-1.5" />
    <path d="M5 7.5h4.5M5 10h3" />
  </svg>
);

export const CertsStepIcon = ({ className = '' }) => (
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
    <path d="M9 10.5V14l1.5-1 1.5 1v-3.5" />
    <path d="M9 10.5H2.5a1 1 0 0 1-1-1V2.5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1V7" />
    <circle cx="10.5" cy="8.5" r="2.5" />
    <path d="M4.5 5h4.5M4.5 7h3" />
  </svg>
);

export const GoalsStepIcon = ({ className = '' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    aria-hidden="true"
    className={className}
  >
    <circle cx="8" cy="8" r="6.5" />
    <circle cx="8" cy="8" r="3.5" />
    <circle cx="8" cy="8" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const PitchStepIcon = ({ className = '' }) => (
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
    <rect x="1" y="4.5" width="9" height="7" rx="1.5" />
    <path d="M10 7l5-2v6l-5-2" />
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
