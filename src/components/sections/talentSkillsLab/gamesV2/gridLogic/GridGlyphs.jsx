/*
 * GridGlyphs — the small icons of the Grid Logic / Sum Grid frames, exported from Figma (all 16px / 14px glyphs, drawn in
 * `currentColor` so the caller sets the colour):
 *   GridClockIcon        "20-time-clock"   (status chip, 14px — the Figma export keeps the 20-unit drawing inside a 14px slot)
 *   GridSavedIcon        "20-check-circle" (status chip "Saved as you go")
 *   GridNotesIcon        "icon · edit"     (Notes tool, duotone pencil)
 *   GridEraseIcon        "icon · close"    (Erase tool, small cross)
 *   GridFeedbackBadIcon  "icon · close"    (feedback pill, error)
 *   GridFeedbackInfoIcon "icon · info"     (feedback pill, info)
 *   GridFeedbackOkIcon   "icon · checkc"   (feedback pill, success)
 */
export const GridClockIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5ZM1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10ZM9.75 5C10.1642 5 10.5 5.33579 10.5 5.75V9.5H12.25C12.6642 9.5 13 9.83579 13 10.25C13 10.6642 12.6642 11 12.25 11H9.75C9.33579 11 9 10.6642 9 10.25V5.75C9 5.33579 9.33579 5 9.75 5Z"
      fill="currentColor"
    />
  </svg>
);

export const GridSavedIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.00001 1.75313C4.10052 1.75313 1.75001 4.10363 1.75001 7.00313C1.75001 9.90262 4.10052 12.2531 7.00001 12.2531C9.89951 12.2531 12.25 9.90262 12.25 7.00313C12.25 4.10363 9.89951 1.75313 7.00001 1.75313ZM0.700012 7.00313C0.700012 3.52373 3.52062 0.703125 7.00001 0.703125C10.4794 0.703125 13.3 3.52373 13.3 7.00313C13.3 10.4825 10.4794 13.3031 7.00001 13.3031C3.52062 13.3031 0.700012 10.4825 0.700012 7.00313ZM9.59602 4.6627C9.82546 4.83999 9.86773 5.1697 9.69044 5.39914L6.71544 9.24913C6.62024 9.37233 6.47526 9.44692 6.31968 9.45276C6.16409 9.45859 6.01394 9.39506 5.90978 9.27933L4.33478 7.52933C4.14082 7.31381 4.15829 6.98186 4.37381 6.78789C4.58932 6.59393 4.92128 6.6114 5.11524 6.82692L6.26932 8.10923L8.85959 4.75712C9.03688 4.52768 9.36659 4.48541 9.59602 4.6627Z"
      fill="currentColor"
    />
  </svg>
);

export const GridNotesIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M2.66663 13.3335H5.33329L12.6666 6.0002C13.0202 5.64658 13.2189 5.16697 13.2189 4.66687C13.2189 4.16677 13.0202 3.68716 12.6666 3.33353C12.313 2.97991 11.8334 2.78125 11.3333 2.78125C10.8332 2.78125 10.3536 2.97991 9.99996 3.33353L2.66663 10.6669V13.3335Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M11.6666 7.0002L5.33329 13.3335H2.66663V10.6669L8.99996 4.33353M11.6666 7.0002L12.6666 6.0002C13.0202 5.64658 13.2189 5.16697 13.2189 4.66687C13.2189 4.16677 13.0202 3.68716 12.6666 3.33353C12.313 2.97991 11.8334 2.78125 11.3333 2.78125C10.8332 2.78125 10.3536 2.97991 9.99996 3.33353L8.99996 4.33353M11.6666 7.0002L8.99996 4.33353"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const GridEraseIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M4.33337 4.33594L8.00004 8.0026M8.00004 8.0026L11.6667 11.6693M8.00004 8.0026L11.6667 4.33594M8.00004 8.0026L4.33337 11.6693"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const GridFeedbackBadIcon = GridEraseIcon;

export const GridFeedbackInfoIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 7.33646V11.0031M8 5.20312V5.33646"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const GridFeedbackOkIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.3335 8.2026L7.20016 10.0693L11.0002 6.33594"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
