/*
 * scheduleInterviewIcons.jsx — glyphs for the Schedule Interview modal.
 *
 * Hand-crafted per the session rule: only bounding box and fill/stroke colour
 * came from Figma (7249:80368 and siblings). No path data was copied.
 */

// 7249:80521 — 16x16 close glyph, #387440, inside a 28x28 #ebf1ec r20 button.
export const ModalCloseIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// 7249:80449 — 18x20 calendar beside "Available Slots".
export const SlotsCalendarIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 20" fill="none" aria-hidden="true" className={className}>
    <rect
      x="1.2"
      y="3.2"
      width="15.6"
      height="15.6"
      rx="2.4"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path
      d="M1.2 7.8h15.6M5.6 1.2v4M12.4 1.2v4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

// 7249:80471 — 14x14 chevron in the day-scroll arrows.
export const SlotArrowIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
    <path
      d="M8.8 2.8 4.6 7l4.2 4.2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 7249:80400 — 20x20 arrowhead-down on every GTHInput select.
export const SelectArrowIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path
      d="m5.5 8 4.5 4 4.5-4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 7249:80414 — heroicons-outline:status-online, 20x20, on the Online pill.
export const FormatOnlineIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <circle cx="10" cy="10" r="2.4" fill="currentColor" />
    <path
      d="M5.8 5.8a6 6 0 0 0 0 8.4M14.2 14.2a6 6 0 0 0 0-8.4M3.2 3.2a9.6 9.6 0 0 0 0 13.6M16.8 16.8a9.6 9.6 0 0 0 0-13.6"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

// 7249:80418 — 13.5x13.5 handset on the Phone pill.
export const FormatPhoneIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
    <path
      d="M3.1 1.4 5 1.9l.8 2.6-1.4 1a7.6 7.6 0 0 0 3.1 3.1l1-1.4 2.6.8.5 1.9a1.3 1.3 0 0 1-1.3 1.6A9.8 9.8 0 0 1 1.5 2.7a1.3 1.3 0 0 1 1.6-1.3Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

// 7249:80422 — 12x15 pin on the In person pill.
export const FormatInPersonIcon = ({ className = '' }) => (
  <svg viewBox="0 0 12 15" fill="none" aria-hidden="true" className={className}>
    <path
      d="M6 13.8c3-3.2 4.6-5.6 4.6-7.6a4.6 4.6 0 1 0-9.2 0c0 2 1.6 4.4 4.6 7.6Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <circle cx="6" cy="6" r="1.7" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

// 7249:80432 — 11.7x11.7 plus inside the dashed add-interviewer avatar.
export const AddInterviewerIcon = ({ className = '' }) => (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
    <path d="M6 1.4v9.2M1.4 6h9.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// 7249:81758 — 21.9x12 glyph in the Tentative Selection badge, #00522b.
export const TentativeCheckIcon = ({ className = '' }) => (
  <svg viewBox="0 0 22 12" fill="none" aria-hidden="true" className={className}>
    <path
      d="M1.4 6.4 5 10l6-9"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.6 6.4 15.2 10l5.4-8.4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
