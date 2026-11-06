/*
 * talentCandidateProfileIcons.jsx — the 24 UI glyphs of the recruiter candidate profile (Figma page "Recruiter - Talent Search", frames TS-11 … TS-19).
 *
 * Every path is the Figma REST `svg` export of the icon instance itself (file OHG2xsfCCskT8xEn356njv) with the baked colour replaced by `currentColor`, so callers
 * set the colour with a text-colour class. Nothing is hand-drawn. Sizes in the names are the viewBox the glyph is drawn on; callers size it with a className.
 * Not exported here: the dropdown arrowhead (Figma instance 10102:41716;2040:8572 returns NO IMAGE from the REST export) — `ui/form/Select` draws its own chevron.
 */

/* BackArrowIcon — Figma 10102:41550 */
export const BackArrowIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M5.99996 9.33335L2.66663 6.00002L5.99996 2.66669"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M2.66663 6H9.66663C10.1481 6 10.6249 6.09484 11.0698 6.27911C11.5147 6.46338 11.9189 6.73346 12.2594 7.07394C12.5998 7.41442 12.8699 7.81863 13.0542 8.26349C13.2385 8.70835 13.3333 9.18515 13.3333 9.66667C13.3333 10.1482 13.2385 10.625 13.0542 11.0698C12.8699 11.5147 12.5998 11.9189 12.2594 12.2594C11.9189 12.5999 11.5147 12.87 11.0698 13.0542C10.6249 13.2385 10.1481 13.3333 9.66663 13.3333H7.33329"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* ChevronRightIcon — Figma 10102:41556 */
export const ChevronRightIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path
      d="M6.75 13.5L11.25 9L6.75 4.5"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* VerifiedBadgeIcon — Figma 10102:41602 */
export const VerifiedBadgeIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
    <path
      d="M2.24582 5.02834C2.16068 4.64481 2.17375 4.246 2.28383 3.86887C2.39391 3.49174 2.59743 3.14852 2.87551 2.87101C3.1536 2.5935 3.49725 2.39071 3.87461 2.28142C4.25197 2.17213 4.65081 2.15989 5.03416 2.24584C5.24515 1.91585 5.53583 1.64428 5.87938 1.45617C6.22293 1.26806 6.60831 1.16946 6.99999 1.16946C7.39167 1.16946 7.77705 1.26806 8.1206 1.45617C8.46415 1.64428 8.75483 1.91585 8.96582 2.24584C9.34975 2.15952 9.74928 2.1717 10.1272 2.28126C10.5052 2.39081 10.8493 2.59417 11.1276 2.87243C11.4058 3.15069 11.6092 3.4948 11.7187 3.87276C11.8283 4.25072 11.8405 4.65024 11.7542 5.03417C12.0841 5.24517 12.3557 5.53584 12.5438 5.87939C12.7319 6.22295 12.8305 6.60833 12.8305 7.00001C12.8305 7.39169 12.7319 7.77706 12.5438 8.12062C12.3557 8.46417 12.0841 8.75484 11.7542 8.96584C11.8401 9.34919 11.8279 9.74803 11.7186 10.1254C11.6093 10.5027 11.4065 10.8464 11.129 11.1245C10.8515 11.4026 10.5083 11.6061 10.1311 11.7162C9.754 11.8262 9.35518 11.8393 8.97166 11.7542C8.76093 12.0854 8.47004 12.3582 8.1259 12.5471C7.78176 12.7361 7.39551 12.8351 7.00291 12.8351C6.61031 12.8351 6.22406 12.7361 5.87992 12.5471C5.53578 12.3582 5.24488 12.0854 5.03416 11.7542C4.65081 11.8401 4.25197 11.8279 3.87461 11.7186C3.49725 11.6093 3.1536 11.4065 2.87551 11.129C2.59743 10.8515 2.39391 10.5083 2.28383 10.1311C2.17375 9.75401 2.16068 9.3552 2.24582 8.97167C1.9133 8.76123 1.6394 8.47011 1.4496 8.12538C1.25981 7.78065 1.16028 7.39353 1.16028 7.00001C1.16028 6.60648 1.25981 6.21936 1.4496 5.87463C1.6394 5.5299 1.9133 5.23878 2.24582 5.02834Z"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M5.25 6.99999L6.41667 8.16666L8.75 5.83333"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* CheckIcon — Figma 10102:41573 */
export const CheckIcon = ({ className = '' }) => (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
    <path
      d="M10 3L4.5 8.5L2 6"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* CalendarIcon — Figma 10102:41576 */
export const CalendarIcon = ({ className = '' }) => (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
    <path
      d="M2.5 2H9.5C10.0523 2 10.5 2.44772 10.5 3V10C10.5 10.5523 10.0523 11 9.5 11H2.5C1.94772 11 1.5 10.5523 1.5 10V3C1.5 2.44772 1.94772 2 2.5 2Z"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M8 1V3M4 1V3M1.5 5H10.5"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* MapPinIcon — Figma 10102:41579 */
export const MapPinIcon = ({ className = '' }) => (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
    <path
      d="M10 5C10 8 6 11 6 11C6 11 2 8 2 5C2 3.93913 2.42143 2.92172 3.17157 2.17157C3.92172 1.42143 4.93913 1 6 1C7.06087 1 8.07828 1.42143 8.82843 2.17157C9.57857 2.92172 10 3.93913 10 5Z"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M7.5 5C7.5 5.82843 6.82843 6.5 6 6.5C5.17157 6.5 4.5 5.82843 4.5 5C4.5 4.17157 5.17157 3.5 6 3.5C6.82843 3.5 7.5 4.17157 7.5 5Z"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* MoreDotsIcon — Figma 10102:41588 */
export const MoreDotsIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path
      d="M9.75 9C9.75 9.41421 9.41421 9.75 9 9.75C8.58579 9.75 8.25 9.41421 8.25 9C8.25 8.58579 8.58579 8.25 9 8.25C9.41421 8.25 9.75 8.58579 9.75 9Z"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M15 9C15 9.41421 14.6642 9.75 14.25 9.75C13.8358 9.75 13.5 9.41421 13.5 9C13.5 8.58579 13.8358 8.25 14.25 8.25C14.6642 8.25 15 8.58579 15 9Z"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M4.5 9C4.5 9.41421 4.16421 9.75 3.75 9.75C3.33579 9.75 3 9.41421 3 9C3 8.58579 3.33579 8.25 3.75 8.25C4.16421 8.25 4.5 8.58579 4.5 9Z"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* BriefcaseIcon — Figma 10102:41649 */
export const BriefcaseIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path
      d="M3.33329 5.83334H16.6666C17.5871 5.83334 18.3333 6.57953 18.3333 7.5V15.8333C18.3333 16.7538 17.5871 17.5 16.6666 17.5H3.33329C2.41282 17.5 1.66663 16.7538 1.66663 15.8333V7.5C1.66663 6.57953 2.41282 5.83334 3.33329 5.83334Z"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M13.3333 17.5V4.16667C13.3333 3.72464 13.1577 3.30072 12.8451 2.98816C12.5326 2.67559 12.1087 2.5 11.6666 2.5H8.33329C7.89127 2.5 7.46734 2.67559 7.15478 2.98816C6.84222 3.30072 6.66663 3.72464 6.66663 4.16667V17.5"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* GraduationCapIcon — Figma 10102:41694 */
export const GraduationCapIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path
      d="M17.85 9.10168C17.9991 9.03587 18.1257 8.92774 18.2141 8.79068C18.3024 8.65363 18.3486 8.49367 18.3469 8.33063C18.3452 8.16758 18.2957 8.00862 18.2046 7.87342C18.1134 7.73822 17.9846 7.63273 17.8341 7.57001L10.6916 4.31668C10.4745 4.21764 10.2386 4.16638 9.99995 4.16638C9.7613 4.16638 9.52542 4.21764 9.30829 4.31668L2.16662 7.56668C2.01826 7.63166 1.89205 7.73846 1.80343 7.87403C1.7148 8.00959 1.6676 8.16805 1.6676 8.33001C1.6676 8.49198 1.7148 8.65043 1.80343 8.786C1.89205 8.92157 2.01826 9.02837 2.16662 9.09335L9.30829 12.35C9.52542 12.4491 9.7613 12.5003 9.99995 12.5003C10.2386 12.5003 10.4745 12.4491 10.6916 12.35L17.85 9.10168Z"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M18.3334 8.33331V13.3333"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M5 10.4167V13.3334C5 13.9964 5.52678 14.6323 6.46447 15.1011C7.40215 15.57 8.67392 15.8334 10 15.8334C11.3261 15.8334 12.5979 15.57 13.5355 15.1011C14.4732 14.6323 15 13.9964 15 13.3334V10.4167"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* FilePlaceholderIcon — Figma 10102:41677 */
export const FilePlaceholderIcon = ({ className = '' }) => (
  <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" className={className}>
    <path
      d="M17.5 2.33334H6.99996C6.38112 2.33334 5.78763 2.57918 5.35004 3.01676C4.91246 3.45435 4.66663 4.04784 4.66663 4.66668V23.3333C4.66663 23.9522 4.91246 24.5457 5.35004 24.9833C5.78763 25.4208 6.38112 25.6667 6.99996 25.6667H21C21.6188 25.6667 22.2123 25.4208 22.6499 24.9833C23.0875 24.5457 23.3333 23.9522 23.3333 23.3333V8.16668L17.5 2.33334Z"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M16.3334 2.33334V7.00001C16.3334 7.61885 16.5792 8.21234 17.0168 8.64993C17.4544 9.08751 18.0479 9.33334 18.6667 9.33334H23.3334"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* ExternalLinkIcon — Figma 10102:41672 */
export const ExternalLinkIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M10 2H14V6"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M6.66675 9.33333L14.0001 2"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H5.33333"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* EyeIcon — Figma 10102:41753 */
export const EyeIcon = ({ className = '' }) => (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
    <path
      d="M1 6C1 6 2.5 2.5 6 2.5C9.5 2.5 11 6 11 6C11 6 9.5 9.5 6 9.5C2.5 9.5 1 6 1 6Z"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M7.5 6C7.5 6.82843 6.82843 7.5 6 7.5C5.17157 7.5 4.5 6.82843 4.5 6C4.5 5.17157 5.17157 4.5 6 4.5C6.82843 4.5 7.5 5.17157 7.5 6Z"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* SendIcon — Figma 10102:42401 */
export const SendIcon = ({ className = '' }) => (
  <svg viewBox="0 0 22 22" fill="none" aria-hidden="true" className={className}>
    <path
      d="M20.1666 1.83331L13.7499 20.1666L10.0833 11.9166L1.83325 8.24998L20.1666 1.83331Z"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M20.1666 1.83331L10.0833 11.9166"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* CloseIcon — Figma 10102:42406 */
export const CloseIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M12 4L4 12"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M4 4L12 12"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* BuildingIcon — Figma 10102:42419 */
export const BuildingIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path
      d="M4.99992 1.66666H14.9999C15.9204 1.66666 16.6666 2.41285 16.6666 3.33332V16.6667C16.6666 17.5871 15.9204 18.3333 14.9999 18.3333H4.99992C4.07944 18.3333 3.33325 17.5871 3.33325 16.6667V3.33332C3.33325 2.41285 4.07944 1.66666 4.99992 1.66666Z"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M7.5 18.3333V15H12.5V18.3333"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M6.66675 5H6.67508M13.3334 5H13.3417M10.0001 5H10.0084M10.0001 8.33333H10.0084M10.0001 11.6667H10.0084M13.3334 8.33333H13.3417M13.3334 11.6667H13.3417M6.66675 8.33333H6.67508M6.66675 11.6667H6.67508"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* BookmarkIcon — Figma 10102:43304 */
export const BookmarkIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path
      d="M14.25 15.75L9 12.75L3.75 15.75V3.75C3.75 3.35218 3.90804 2.97064 4.18934 2.68934C4.47064 2.40804 4.85218 2.25 5.25 2.25H12.75C13.1478 2.25 13.5294 2.40804 13.8107 2.68934C14.092 2.97064 14.25 3.35218 14.25 3.75V15.75Z"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* PlusIcon — Figma 10102:43321 */
export const PlusIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path
      d="M3.75 9H14.25"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M9 3.75V14.25"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* PipelineIcon — Figma 10102:44198 */
export const PipelineIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path
      d="M9 10.125H3.375C3.07663 10.125 2.79048 10.0065 2.5795 9.7955C2.36853 9.58452 2.25 9.29837 2.25 9V3.375C2.25 3.07663 2.36853 2.79048 2.5795 2.5795C2.79048 2.36853 3.07663 2.25 3.375 2.25H9C9.29837 2.25 9.58452 2.36853 9.7955 2.5795C10.0065 2.79048 10.125 3.07663 10.125 3.375V9C10.125 9.29837 10.0065 9.58452 9.7955 9.7955C9.58452 10.0065 9.29837 10.125 9 10.125ZM3.375 3.375V9H9V3.375H3.375ZM14.625 6.75V9H12.375V6.75H14.625ZM14.625 5.625H12.375C12.0766 5.625 11.7905 5.74353 11.5795 5.9545C11.3685 6.16548 11.25 6.45163 11.25 6.75V9C11.25 9.29837 11.3685 9.58452 11.5795 9.7955C11.7905 10.0065 12.0766 10.125 12.375 10.125H14.625C14.9234 10.125 15.2095 10.0065 15.4205 9.7955C15.6315 9.58452 15.75 9.29837 15.75 9V6.75C15.75 6.45163 15.6315 6.16548 15.4205 5.9545C15.2095 5.74353 14.9234 5.625 14.625 5.625ZM14.625 12.375V14.625H12.375V12.375H14.625ZM14.625 11.25H12.375C12.0766 11.25 11.7905 11.3685 11.5795 11.5795C11.3685 11.7905 11.25 12.0766 11.25 12.375V14.625C11.25 14.9234 11.3685 15.2095 11.5795 15.4205C11.7905 15.6315 12.0766 15.75 12.375 15.75H14.625C14.9234 15.75 15.2095 15.6315 15.4205 15.4205C15.6315 15.2095 15.75 14.9234 15.75 14.625V12.375C15.75 12.0766 15.6315 11.7905 15.4205 11.5795C15.2095 11.3685 14.9234 11.25 14.625 11.25ZM9 12.375V14.625H6.75V12.375H9ZM9 11.25H6.75C6.45163 11.25 6.16548 11.3685 5.9545 11.5795C5.74353 11.7905 5.625 12.0766 5.625 12.375V14.625C5.625 14.9234 5.74353 15.2095 5.9545 15.4205C6.16548 15.6315 6.45163 15.75 6.75 15.75H9C9.29837 15.75 9.58452 15.6315 9.7955 15.4205C10.0065 15.2095 10.125 14.9234 10.125 14.625V12.375C10.125 12.0766 10.0065 11.7905 9.7955 11.5795C9.58452 11.3685 9.29837 11.25 9 11.25Z"
      fill="currentColor"
    />
  </svg>
);

/* UsersIcon — Figma 10102:44203 */
export const UsersIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path
      d="M12 15.75V14.25C12 13.4544 11.6839 12.6913 11.1213 12.1287C10.5587 11.5661 9.79565 11.25 9 11.25H4.5C3.70435 11.25 2.94129 11.5661 2.37868 12.1287C1.81607 12.6913 1.5 13.4544 1.5 14.25V15.75"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M9.75 5.25C9.75 6.90685 8.40685 8.25 6.75 8.25C5.09315 8.25 3.75 6.90685 3.75 5.25C3.75 3.59315 5.09315 2.25 6.75 2.25C8.40685 2.25 9.75 3.59315 9.75 5.25Z"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M16.5 15.75V14.25C16.4995 13.5853 16.2783 12.9396 15.871 12.4142C15.4638 11.8889 14.8936 11.5137 14.25 11.3475"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M12 2.3475C12.6453 2.51273 13.2173 2.88803 13.6257 3.41424C14.0342 3.94044 14.2559 4.58763 14.2559 5.25375C14.2559 5.91988 14.0342 6.56706 13.6257 7.09327C13.2173 7.61948 12.6453 7.99478 12 8.16"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* LinkIcon — Figma 10102:44207 */
export const LinkIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path
      d="M7.5 9.75C7.82209 10.1806 8.23302 10.5369 8.70491 10.7947C9.17681 11.0525 9.69863 11.2058 10.235 11.2443C10.7713 11.2827 11.3097 11.2053 11.8135 11.0173C12.3173 10.8294 12.7748 10.5353 13.155 10.155L15.405 7.905C16.0881 7.19775 16.4661 6.25049 16.4575 5.26725C16.449 4.28401 16.0546 3.34347 15.3593 2.64819C14.664 1.9529 13.7235 1.55852 12.7403 1.54998C11.757 1.54143 10.8098 1.91941 10.1025 2.6025L8.8125 3.885"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M10.4997 8.24999C10.1776 7.81939 9.76664 7.4631 9.29475 7.20528C8.82285 6.94746 8.30103 6.79415 7.76467 6.75574C7.22832 6.71732 6.68997 6.79471 6.18615 6.98265C5.68233 7.17059 5.22483 7.46468 4.84466 7.84499L2.59466 10.095C1.91157 10.8022 1.53359 11.7495 1.54213 12.7327C1.55068 13.716 1.94506 14.6565 2.64034 15.3518C3.33562 16.0471 4.27617 16.4415 5.25941 16.45C6.24264 16.4586 7.1899 16.0806 7.89716 15.3975L9.17966 14.115"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* AlertTriangleIcon — Figma 10102:44216 */
export const AlertTriangleIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path
      d="M16.2973 13.5L10.2973 2.99999C10.1665 2.76914 9.97678 2.57713 9.74752 2.44354C9.51826 2.30995 9.25767 2.23956 8.99232 2.23956C8.72698 2.23956 8.46639 2.30995 8.23713 2.44354C8.00787 2.57713 7.81815 2.76914 7.68733 2.99999L1.68733 13.5C1.55509 13.729 1.48575 13.9889 1.48633 14.2534C1.48692 14.5178 1.55741 14.7774 1.69066 15.0059C1.82391 15.2343 2.01519 15.4234 2.2451 15.5541C2.47501 15.6848 2.73538 15.7524 2.99983 15.75H14.9998C15.263 15.7497 15.5215 15.6802 15.7493 15.5484C15.9771 15.4167 16.1662 15.2273 16.2977 14.9993C16.4292 14.7713 16.4984 14.5128 16.4983 14.2496C16.4982 13.9864 16.4289 13.7279 16.2973 13.5Z"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M9 6.75V9.75"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M9 12.75H9.0075"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* InfoCircleIcon — Figma 10102:44669 */
export const InfoCircleIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path
      d="M18.3337 9.99999C18.3337 14.6024 14.6027 18.3333 10.0003 18.3333C5.39795 18.3333 1.66699 14.6024 1.66699 9.99999C1.66699 5.39762 5.39795 1.66666 10.0003 1.66666C14.6027 1.66666 18.3337 5.39762 18.3337 9.99999Z"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M10 13.3333V10"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M10 6.66666H10.0083"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* InboxIcon — Figma 10102:45142 */
export const InboxIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path
      d="M18.3327 10H13.3327L11.666 12.5H8.33268L6.66602 10H1.66602"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M4.54102 4.25831L1.66602 9.99998V15C1.66602 15.442 1.84161 15.8659 2.15417 16.1785C2.46673 16.4911 2.89065 16.6666 3.33268 16.6666H16.666C17.108 16.6666 17.532 16.4911 17.8445 16.1785C18.1571 15.8659 18.3327 15.442 18.3327 15V9.99998L15.4577 4.25831C15.3197 3.98064 15.107 3.74696 14.8435 3.58355C14.58 3.42014 14.2761 3.33348 13.966 3.33331H6.03268C5.72261 3.33348 5.41874 3.42014 5.15522 3.58355C4.8917 3.74696 4.679 3.98064 4.54102 4.25831Z"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);
