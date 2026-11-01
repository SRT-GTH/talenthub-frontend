/*
 * Icons of the Pattern Pulse + Word Shuffle frames, exported from Figma (Talent - Skills Lab, Games v2 · "icon · …" instances of
 * PP-03/04 and WS-01…04). Single-colour glyphs use currentColor (duotone fills keep the 22 % tint); set the colour with a text-* class.
 */
const svgProps = (size, className) => ({
  width: size,
  height: size,
  viewBox: `0 0 ${size} ${size}`,
  fill: 'none',
  'aria-hidden': 'true',
  focusable: 'false',
  className,
});

/* answer-card mark + beads badge: white check (stroke 1.05) */
export const NwCheckMarkIcon = ({ className = '' }) => (
  <svg {...svgProps(14, className)}>
    <path
      d="M2.9165 7.29036L5.3665 9.74037L11.0832 4.08203"
      strokeWidth="1.05"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* answer-card mark: white cross (stroke 1.05) */
export const NwCloseMarkIcon = ({ className = '' }) => (
  <svg {...svgProps(14, className)}>
    <path
      d="M3.7915 3.79297L6.99984 7.0013M6.99984 7.0013L10.2082 10.2096M6.99984 7.0013L10.2082 3.79297M6.99984 7.0013L3.7915 10.2096"
      strokeWidth="1.05"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* feedback pill, correct (circle with check, duotone) */
export const NwCheckCircleDuotoneIcon = ({ className = '' }) => (
  <svg {...svgProps(16, className)}>
    <path
      d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M5.3335 8.1987L7.20016 10.0654L11.0002 6.33203"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* feedback pill, rule / hint (bulb, duotone) */
export const NwBulbDuotoneIcon = ({ className = '' }) => (
  <svg {...svgProps(16, className)}>
    <path
      d="M8.00016 8.66536C9.47292 8.66536 10.6668 7.47146 10.6668 5.9987C10.6668 4.52594 9.47292 3.33203 8.00016 3.33203C6.5274 3.33203 5.3335 4.52594 5.3335 5.9987C5.3335 7.47146 6.5274 8.66536 8.00016 8.66536Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M6.33318 12H9.66652M6.99985 14H8.99985M7.99985 2C7.17132 2.00408 6.3645 2.26534 5.69085 2.74769C5.01719 3.23004 4.50994 3.90968 4.23917 4.69272C3.96839 5.47577 3.94746 6.32357 4.17926 7.11903C4.41106 7.91448 4.88415 8.61832 5.53319 9.13333C6.06652 9.6 6.33318 10.0667 6.33318 10.6667V11H9.66652V10.6667C9.66652 10.0667 9.93318 9.6 10.4665 9.13333C11.1156 8.61832 11.5886 7.91448 11.8204 7.11903C12.0522 6.32357 12.0313 5.47577 11.7605 4.69272C11.4898 3.90968 10.9825 3.23004 10.3089 2.74769C9.6352 2.26534 8.82838 2.00408 7.99985 2Z"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* feedback pill, wrong (cross, stroke 1.2) */
export const NwCrossIcon = ({ className = '' }) => (
  <svg {...svgProps(16, className)}>
    <path
      d="M4.33325 4.33594L7.99992 8.0026M7.99992 8.0026L11.6666 11.6693M7.99992 8.0026L11.6666 4.33594M7.99992 8.0026L4.33325 11.6693"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* status pill: "2 of 3 right" (20-check-circle at 14px) */
export const NwStatCheckIcon = ({ className = '' }) => (
  <svg {...svgProps(14, className)}>
    <path
      d="M7.00001 1.75313C4.10052 1.75313 1.75001 4.10363 1.75001 7.00313C1.75001 9.90262 4.10052 12.2531 7.00001 12.2531C9.89951 12.2531 12.25 9.90262 12.25 7.00313C12.25 4.10363 9.89951 1.75313 7.00001 1.75313ZM0.700012 7.00313C0.700012 3.52373 3.52062 0.703125 7.00001 0.703125C10.4794 0.703125 13.3 3.52373 13.3 7.00313C13.3 10.4825 10.4794 13.3031 7.00001 13.3031C3.52062 13.3031 0.700012 10.4825 0.700012 7.00313ZM9.59602 4.6627C9.82546 4.83999 9.86773 5.1697 9.69044 5.39914L6.71544 9.24913C6.62024 9.37233 6.47526 9.44692 6.31968 9.45276C6.16409 9.45859 6.01394 9.39506 5.90978 9.27933L4.33478 7.52933C4.14082 7.31381 4.15829 6.98186 4.37381 6.78789C4.58932 6.59393 4.92128 6.6114 5.11524 6.82692L6.26932 8.10923L8.85959 4.75712C9.03688 4.52768 9.36659 4.48541 9.59602 4.6627Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    />
  </svg>
);

/* status pill: "0:52 left" (20-time-clock, 20 box shown at 14px) */
export const NwStatClockIcon = ({ className = '' }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5ZM1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10ZM9.75 5C10.1642 5 10.5 5.33579 10.5 5.75V9.5H12.25C12.6642 9.5 13 9.83579 13 10.25C13 10.6642 12.6642 11 12.25 11H9.75C9.33579 11 9 10.6642 9 10.25V5.75C9 5.33579 9.33579 5 9.75 5Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    />
  </svg>
);

/* clue chip: "Field: Health" */
export const NwBriefcaseIcon = ({ className = '' }) => (
  <svg {...svgProps(13, className)}>
    <path
      d="M1.625 5.14323C1.625 4.78408 1.76767 4.43964 2.02163 4.18569C2.27558 3.93173 2.62002 3.78906 2.97917 3.78906H10.0208C10.38 3.78906 10.7244 3.93173 10.9784 4.18569C11.2323 4.43964 11.375 4.78408 11.375 5.14323V6.76823H1.625V5.14323Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M2.97917 3.78906H10.0208C10.7687 3.78906 11.375 4.39534 11.375 5.14323V9.47656C11.375 10.2244 10.7687 10.8307 10.0208 10.8307H2.97917C2.23128 10.8307 1.625 10.2244 1.625 9.47656V5.14323C1.625 4.39534 2.23128 3.78906 2.97917 3.78906Z"
      strokeWidth="0.975"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M4.875 3.78906V2.97656C4.875 2.76107 4.9606 2.55441 5.11298 2.40204C5.26535 2.24966 5.47201 2.16406 5.6875 2.16406H7.3125C7.52799 2.16406 7.73465 2.24966 7.88703 2.40204C8.0394 2.55441 8.125 2.76107 8.125 2.97656V3.78906M1.625 6.76823H11.375"
      strokeWidth="0.975"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* clue chip: "7 letters" */
export const NwInfoIcon = ({ className = '' }) => (
  <svg {...svgProps(13, className)}>
    <path
      d="M6.5 11.375C9.19239 11.375 11.375 9.19239 11.375 6.5C11.375 3.80761 9.19239 1.625 6.5 1.625C3.80761 1.625 1.625 3.80761 1.625 6.5C1.625 9.19239 3.80761 11.375 6.5 11.375Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M11.375 6.5C11.375 9.19239 9.19239 11.375 6.5 11.375C3.80761 11.375 1.625 9.19239 1.625 6.5C1.625 3.80761 3.80761 1.625 6.5 1.625C9.19239 1.625 11.375 3.80761 11.375 6.5Z"
      strokeWidth="0.975"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M6.5 5.9599V8.93906M6.5 4.22656V4.3349"
      strokeWidth="0.975"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* clue chip: "1 tries left" */
export const NwHeartIcon = ({ className = '' }) => (
  <svg {...svgProps(13, className)}>
    <path
      d="M6.5 10.8333C6.5 10.8333 2.4375 8.34167 2.4375 5.30833C2.47522 4.85394 2.64548 4.42062 2.92717 4.06209C3.20886 3.70356 3.58958 3.43558 4.02213 3.2914C4.45469 3.14722 4.92005 3.13316 5.36052 3.25097C5.80098 3.36879 6.19719 3.61329 6.5 3.95417C6.80281 3.61329 7.19902 3.36879 7.63948 3.25097C8.07995 3.13316 8.54531 3.14722 8.97787 3.2914C9.41042 3.43558 9.79114 3.70356 10.0728 4.06209C10.3545 4.42062 10.5248 4.85394 10.5625 5.30833C10.5625 8.34167 6.5 10.8333 6.5 10.8333Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M6.5 10.8333C6.5 10.8333 2.4375 8.34167 2.4375 5.30833C2.47522 4.85394 2.64548 4.42062 2.92717 4.06209C3.20886 3.70356 3.58958 3.43558 4.02213 3.2914C4.45469 3.14722 4.92005 3.13316 5.36052 3.25097C5.80098 3.36879 6.19719 3.61329 6.5 3.95417C6.80281 3.61329 7.19902 3.36879 7.63948 3.25097C8.07995 3.13316 8.54531 3.14722 8.97787 3.2914C9.41042 3.43558 9.79114 3.70356 10.0728 4.06209C10.3545 4.42062 10.5248 4.85394 10.5625 5.30833C10.5625 8.34167 6.5 10.8333 6.5 10.8333Z"
      strokeWidth="0.975"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* clue chip: "Last try" */
export const NwWarningIcon = ({ className = '' }) => (
  <svg {...svgProps(13, className)}>
    <path
      d="M6.49994 2.16406L1.5166 10.5599H11.4833L6.49994 2.16406Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M6.49994 5.41406V7.85156M6.49994 9.20573V9.21115M6.49994 2.16406L1.5166 10.5599H11.4833L6.49994 2.16406Z"
      strokeWidth="0.975"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* hint-locked tile badge */
export const NwLockIcon = ({ className = '' }) => (
  <svg {...svgProps(12, className)}>
    <path
      d="M8.25 5.25H3.75C3.05964 5.25 2.5 5.80964 2.5 6.5V9C2.5 9.69036 3.05964 10.25 3.75 10.25H8.25C8.94036 10.25 9.5 9.69036 9.5 9V6.5C9.5 5.80964 8.94036 5.25 8.25 5.25Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M3.75 5.25H8.25C8.94036 5.25 9.5 5.80964 9.5 6.5V9C9.5 9.69036 8.94036 10.25 8.25 10.25H3.75C3.05964 10.25 2.5 9.69036 2.5 9V6.5C2.5 5.80964 3.05964 5.25 3.75 5.25Z"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M4 5.25V3.75C4 3.21957 4.21071 2.71086 4.58579 2.33579C4.96086 1.96071 5.46957 1.75 6 1.75C6.53043 1.75 7.03914 1.96071 7.41421 2.33579C7.78929 2.71086 8 3.21957 8 3.75V5.25M6 7.25V8.5"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* tool: Shuffle */
export const NwRefreshIcon = ({ className = '' }) => (
  <svg {...svgProps(16, className)}>
    <path
      d="M13.3334 8.00015C13.3201 9.23324 12.8799 10.4236 12.0877 11.3687C11.2956 12.3138 10.2004 12.9552 8.9886 13.1837C7.7768 13.4122 6.52325 13.2137 5.44131 12.622C4.35937 12.0303 3.5159 11.082 3.05446 9.93842C2.59302 8.79484 2.54212 7.5267 2.91042 6.34982C3.27873 5.17294 4.04348 4.16006 5.07452 3.48356C6.10556 2.80706 7.33916 2.50875 8.56539 2.6394C9.79161 2.77005 10.9347 3.32159 11.8 4.20015M13.3334 2.66682V5.66682H10.3334"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* tool: Clear */
export const NwBackspaceArrowIcon = ({ className = '' }) => (
  <svg {...svgProps(16, className)}>
    <path
      d="M13 8H3M7 12L3 8L7 4"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);
