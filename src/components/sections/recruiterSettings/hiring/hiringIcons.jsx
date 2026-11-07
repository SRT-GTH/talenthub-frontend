/*
 * hiringIcons - Figma's own icon vectors for the recruiter Hiring / Notifications / Billing / Accessibility Settings tabs
 * ("Recruiter - Settings & Account" 10161:75722), exported with figma-tools export.py (svg) and turned into currentColor components.
 * Node ids: message 10161:80630, plus 10161:80648, pause 10161:83681, bell 10161:84302, info 10161:84676, calendar 10161:81098, upload 10161:81148.
 * Figma inconsistency kept as drawn: the invoice "Download" glyph is the layer "Icon/upload" and draws an arrow pointing UP.
 */
const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const MessageIcon = ({ className }) => (
  <svg viewBox="0 0 22 22" aria-hidden="true" className={className} {...STROKE} strokeWidth="1.75">
    <path d="M19.25 13.75C19.25 14.2362 19.0568 14.7025 18.713 15.0464C18.3692 15.3902 17.9029 15.5833 17.4167 15.5833H6.41667L2.75 19.25V4.58333C2.75 4.0971 2.94315 3.63079 3.28697 3.28697C3.63079 2.94315 4.0971 2.75 4.58333 2.75H17.4167C17.9029 2.75 18.3692 2.94315 18.713 3.28697C19.0568 3.63079 19.25 4.0971 19.25 4.58333V13.75Z" />
  </svg>
);

export const PlusIcon = ({ className }) => (
  <svg viewBox="0 0 12 12" aria-hidden="true" className={className} {...STROKE} strokeWidth="1.4">
    <path d="M2.5 6H9.5" />
    <path d="M6 2.5V9.5" />
  </svg>
);

export const PauseIcon = ({ className }) => (
  <svg viewBox="0 0 20 20" aria-hidden="true" className={className} {...STROKE} strokeWidth="1.75">
    <path d="M5.83333 3.33325H7.5C7.96024 3.33325 8.33333 3.70635 8.33333 4.16659V15.8333C8.33333 16.2935 7.96024 16.6666 7.5 16.6666H5.83333C5.3731 16.6666 5 16.2935 5 15.8333V4.16659C5 3.70635 5.3731 3.33325 5.83333 3.33325Z" />
    <path d="M12.5003 3.33325H14.167C14.6272 3.33325 15.0003 3.70635 15.0003 4.16659V15.8333C15.0003 16.2935 14.6272 16.6666 14.167 16.6666H12.5003C12.0401 16.6666 11.667 16.2935 11.667 15.8333V4.16659C11.667 3.70635 12.0401 3.33325 12.5003 3.33325Z" />
  </svg>
);

export const BellIcon = ({ className }) => (
  <svg viewBox="0 0 20 20" aria-hidden="true" className={className} {...STROKE} strokeWidth="1.75">
    <path d="M5 6.66675C5 5.34067 5.52678 4.0689 6.46447 3.13121C7.40215 2.19353 8.67392 1.66675 10 1.66675C11.3261 1.66675 12.5979 2.19353 13.5355 3.13121C14.4732 4.0689 15 5.34067 15 6.66675C15 12.5001 17.5 14.1667 17.5 14.1667H2.5C2.5 14.1667 5 12.5001 5 6.66675Z" />
    <path d="M8.58301 17.5C8.72249 17.7537 8.92755 17.9653 9.17675 18.1127C9.42595 18.26 9.71016 18.3378 9.99967 18.3378C10.2892 18.3378 10.5734 18.26 10.8226 18.1127C11.0718 17.9653 11.2769 17.7537 11.4163 17.5" />
  </svg>
);

export const InfoIcon = ({ className }) => (
  <svg viewBox="0 0 20 20" aria-hidden="true" className={className} {...STROKE} strokeWidth="1.75">
    <path d="M18.3337 10.0001C18.3337 14.6025 14.6027 18.3334 10.0003 18.3334C5.39795 18.3334 1.66699 14.6025 1.66699 10.0001C1.66699 5.39771 5.39795 1.66675 10.0003 1.66675C14.6027 1.66675 18.3337 5.39771 18.3337 10.0001Z" />
    <path d="M10 13.3333V10" />
    <path d="M10 6.66675H10.0083" />
  </svg>
);

export const CalendarIcon = ({ className }) => (
  <svg viewBox="0 0 12 12" aria-hidden="true" className={className} {...STROKE} strokeWidth="1">
    <path d="M2.5 2H9.5C10.0523 2 10.5 2.44772 10.5 3V10C10.5 10.5523 10.0523 11 9.5 11H2.5C1.94772 11 1.5 10.5523 1.5 10V3C1.5 2.44772 1.94772 2 2.5 2Z" />
    <path d="M8 1V3M4 1V3M1.5 5H10.5" />
  </svg>
);

export const UploadArrowIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className={className} {...STROKE} strokeWidth="1.75">
    <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10" />
    <path d="M11.3332 5.33333L7.99984 2L4.6665 5.33333" />
    <path d="M8 2V10" />
  </svg>
);
