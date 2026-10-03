/*
 * jobPostingsIcons.jsx — glyphs for the Job Postings cards.
 *
 * Hand-crafted per the session rule: only bounding box, stroke colour and
 * weight came from Figma (7249:75903 etc). The three card glyphs are 20x20
 * #2a5730 at stroke 1 and Figma names them keyline-icons:pencil-ruler,
 * fluent:developer-board-16-regular and fluent:hat-graduation-32-regular;
 * each is redrawn here to match that shape. No path data was copied.
 */

// Senior UX Designer — keyline-icons:pencil-ruler
export const PencilRulerIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path
      d="m12.4 2.6 5 5L7.6 17.4H2.6v-5L12.4 2.6Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path d="m10.6 4.4 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path
      d="M6.2 8.8 8 10.6M4.4 11.4l1.4 1.4"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

// DevOps Engineer — fluent:developer-board-16-regular
export const DeveloperBoardIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <rect
      x="3.2"
      y="3.2"
      width="13.6"
      height="13.6"
      rx="2.2"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <rect x="7" y="7" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
    <path
      d="M7 1.8v1.4M13 1.8v1.4M7 16.8v1.4M13 16.8v1.4M1.8 7h1.4M1.8 13h1.4M16.8 7h1.4M16.8 13h1.4"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

// Data Analyst Intern — fluent:hat-graduation-32-regular
export const HatGraduationIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path
      d="M10 3 1.8 6.8 10 10.6l8.2-3.8L10 3Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path
      d="M5 8.4v4c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-4"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M18.2 6.8v4.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// hugeicons:location-04 — 18x18, stroke #999999 at 1.
export const LocationPinIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path
      d="M9 16.2c3.4-3.4 5.2-6 5.2-8.2a5.2 5.2 0 1 0-10.4 0c0 2.2 1.8 4.8 5.2 8.2Z"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="7.8" r="1.9" stroke="currentColor" strokeWidth="1.1" />
  </svg>
);

// charm:menu-meatball — three 2.25px #999999 dots in a 40.75x24.25 white pill.
export const MeatballMenuIcon = ({ className = '' }) => (
  <svg viewBox="0 0 19 3" fill="none" aria-hidden="true" className={className}>
    <circle cx="1.6" cy="1.5" r="1.5" fill="currentColor" />
    <circle cx="9.4" cy="1.5" r="1.5" fill="currentColor" />
    <circle cx="17.2" cy="1.5" r="1.5" fill="currentColor" />
  </svg>
);
