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
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.0007 30.4193C25.7536 30.4193 30.4173 25.7556 30.4173 20.0026C30.4173 14.2496 25.7536 9.58594 20.0007 9.58594C14.2477 9.58594 9.58398 14.2496 9.58398 20.0026C9.58398 25.7556 14.2477 30.4193 20.0007 30.4193Z"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 25C22.7614 25 25 22.7614 25 20C25 17.2386 22.7614 15 20 15C17.2386 15 15 17.2386 15 20C15 22.7614 17.2386 25 20 25Z"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.9993 34.5807C28.0535 34.5807 34.5827 28.0515 34.5827 19.9974C34.5827 11.9432 28.0535 5.41406 19.9993 5.41406C11.9452 5.41406 5.41602 11.9432 5.41602 19.9974C5.41602 28.0515 11.9452 34.5807 19.9993 34.5807Z"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
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

// Waving-hand icon for recruiter welcome toast — user-supplied production SVG
// (Figma 5132:66247), green→gold gradient fill. Unique gradient id so it
// never collides with another paint0_linear_* in the same document.
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
      d="M10.711 2.88821L15.435 7.61221C15.435 7.21821 15.453 6.84621 15.501 6.50521C15.654 5.41021 16.124 4.39221 17.281 3.90821L17.437 3.85321C18.172 3.63721 18.899 4.03721 19.187 4.67521L19.242 4.81521L21.252 10.8422C21.7218 12.2517 21.7898 13.7643 21.4484 15.2103C21.107 16.6563 20.3696 17.9787 19.319 19.0292L18.843 19.5062C18.1001 20.2491 17.2182 20.8384 16.2475 21.2405C15.2769 21.6426 14.2366 21.8495 13.186 21.8495C12.1354 21.8495 11.095 21.6426 10.1244 21.2405C9.15377 20.8384 8.27183 20.2491 7.52896 19.5062L2.93296 14.9092C2.65175 14.6279 2.49378 14.2465 2.49378 13.8487C2.49378 13.451 2.65175 13.0695 2.93296 12.7882L3.04696 12.6852C3.33507 12.4511 3.69974 12.3322 4.07045 12.3514C4.44117 12.3706 4.79159 12.5266 5.05396 12.7892L6.84996 14.5862C6.8969 14.6332 6.96057 14.6595 7.02696 14.6595C7.09335 14.6595 7.15702 14.6332 7.20396 14.5862C7.2509 14.5393 7.27728 14.4756 7.27728 14.4092C7.27728 14.3428 7.2509 14.2792 7.20396 14.2322L3.28496 10.3132C3.00406 10.032 2.84628 9.65071 2.84628 9.25321C2.84628 8.85571 3.00406 8.47446 3.28496 8.19321L3.39896 8.09021C3.6869 7.85559 4.05164 7.73614 4.42258 7.75499C4.79352 7.77383 5.14428 7.92962 5.40696 8.19221L8.66296 11.4482C8.68618 11.4715 8.71377 11.49 8.74414 11.5026C8.77452 11.5152 8.80708 11.5217 8.83996 11.5217C8.87284 11.5217 8.9054 11.5152 8.93578 11.5026C8.96615 11.49 8.99374 11.4715 9.01696 11.4482C9.04024 11.425 9.05871 11.3974 9.07132 11.367C9.08392 11.3367 9.09041 11.3041 9.09041 11.2712C9.09041 11.2383 9.08392 11.2058 9.07132 11.1754C9.05871 11.145 9.04024 11.1174 9.01696 11.0942L4.52296 6.60021C4.19504 6.27206 4.01083 5.82713 4.01083 5.36321C4.01083 4.8993 4.19504 4.45436 4.52296 4.12621L4.65596 4.00521C4.99196 3.73181 5.41742 3.59274 5.85003 3.6149C6.28265 3.63707 6.69167 3.8189 6.99796 4.12521L12.154 9.28221C12.2009 9.32915 12.2646 9.35553 12.331 9.35553C12.3973 9.35553 12.461 9.32915 12.508 9.28221C12.5549 9.23527 12.5813 9.1716 12.5813 9.10521C12.5813 9.03882 12.5549 8.97516 12.508 8.92821L8.58796 5.01021C8.44855 4.87076 8.33801 4.70519 8.26265 4.52298C8.18729 4.34076 8.14859 4.14548 8.14878 3.9483C8.14897 3.75111 8.18803 3.5559 8.26373 3.37383C8.33943 3.19176 8.45029 3.0264 8.58996 2.88721L8.70296 2.78521C8.9909 2.55059 9.35564 2.43114 9.72658 2.44999C10.0975 2.46883 10.4483 2.62562 10.711 2.88821ZM4.00696 17.2342L4.06096 17.4892C4.24096 18.2002 4.80096 18.7622 5.51296 18.9402L5.76696 18.9942C6.00677 19.059 6.21388 19.2107 6.34797 19.4198C6.48206 19.6289 6.53352 19.8804 6.49234 20.1254C6.45116 20.3704 6.32028 20.5912 6.12519 20.745C5.9301 20.8988 5.68477 20.9744 5.43696 20.9572L5.02696 20.8802C4.32512 20.7041 3.68418 20.3409 3.17244 19.8294C2.66069 19.3178 2.29729 18.677 2.12096 17.9752L2.04496 17.5632C2.02936 17.3163 2.10584 17.0724 2.25963 16.8786C2.41342 16.6847 2.63359 16.5548 2.87759 16.5139C3.1216 16.473 3.3721 16.524 3.5807 16.657C3.78929 16.7901 3.94117 16.9957 4.00696 17.2342ZM13.167 1.05521C13.7116 1.14698 14.2314 1.35056 14.6935 1.65312C15.1556 1.95569 15.55 2.35068 15.852 2.81321L16.012 3.09121C16.1104 3.31665 16.1224 3.57043 16.0456 3.80413C15.9688 4.03784 15.8087 4.23509 15.5958 4.35825C15.3828 4.48141 15.132 4.52185 14.8912 4.47186C14.6503 4.42187 14.4363 4.28494 14.29 4.08721L14.114 3.81721C13.8423 3.44686 13.4514 3.18132 13.007 3.06521L12.836 3.02821C12.7064 3.00654 12.5824 2.95957 12.471 2.88998C12.3596 2.82038 12.263 2.72953 12.1867 2.6226C12.0327 2.40665 11.9707 2.13835 12.0145 1.87671C12.0582 1.61508 12.2041 1.38154 12.4201 1.22748C12.636 1.07342 12.9043 1.01145 13.166 1.05521"
      fill="url(#paint0_linear_toast_welcome)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_toast_welcome"
        x1="-4.54369"
        y1="4.02316"
        x2="6.61043"
        y2="28.6633"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#C1D4C4" />
        <stop offset="1" stopColor="#C8951A" />
      </linearGradient>
    </defs>
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
