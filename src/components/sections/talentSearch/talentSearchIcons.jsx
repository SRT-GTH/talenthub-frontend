/*
 * talentSearchIcons.jsx — small UI glyphs for the Recruiter Talent Search
 * screen (Figma 7249:74283).
 *
 * Hand-crafted per the session rule: only each icon's bounding box, stroke /
 * fill colour and stroke weight were taken from Figma; no path data was
 * copied. All use `currentColor` so callers set colour with a token class.
 */

// Figma 7249:74337 — 7x7 remove control on each active filter chip.
export const FilterRemoveIcon = ({ className = '' }) => (
  <svg viewBox="0 0 7 7" fill="none" aria-hidden="true" className={className}>
    <path
      d="M1.3 1.3 5.7 5.7M5.7 1.3 1.3 5.7"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    />
  </svg>
);

// Figma 7249:74352 — 10.5x10.5 #387440 filter glyph on "More Filters".
// Path supplied verbatim by the user from the Figma node; `currentColor`
// replaces the baked #387440 so callers set the colour.
export const MoreFiltersIcon = ({ className = '' }) => (
  <svg viewBox="0 0 11 11" fill="none" aria-hidden="true" className={className}>
    <path
      d="M4.66667 10.5V7H5.83333V8.16667H10.5V9.33333H5.83333V10.5H4.66667ZM0 9.33333V8.16667H3.5V9.33333H0ZM2.33333 7V5.83333H0V4.66667H2.33333V3.5H3.5V7H2.33333ZM4.66667 5.83333V4.66667H10.5V5.83333H4.66667ZM7 3.5V0H8.16667V1.16667H10.5V2.33333H8.16667V3.5H7ZM0 2.33333V1.16667H5.83333V2.33333H0Z"
      fill="currentColor"
    />
  </svg>
);

// Figma 7249:74472 (hugeicons:bulb) — 20x20, stroke 1.8. Match Explanation.
// Path supplied verbatim by the user; `currentColor` replaces the baked fill.
export const LightbulbIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path
      d="M14.41 13.3332C15.4256 12.4375 16.1444 11.2538 16.4707 9.93952C16.7969 8.62528 16.7153 7.24283 16.2365 5.97615C15.7577 4.70946 14.9046 3.61861 13.7906 2.84874C12.6766 2.07887 11.3546 1.6665 10.0004 1.6665C8.64627 1.6665 7.32423 2.07887 6.21023 2.84874C5.09622 3.61861 4.24307 4.70946 3.76431 5.97615C3.28555 7.24283 3.20388 8.62528 3.53016 9.93952C3.85645 11.2538 4.57522 12.4375 5.59083 13.3332M9.99999 9.16651V13.3332M7.08333 15.8332H12.9167M8.33333 18.3332H11.6667"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Figma 7249:74401 — 11.67x10.70, fill #737373. Save / favourite control.
export const SaveHeartIcon = ({ className = '' }) => (
  <svg viewBox="0 0 12 11" fill="none" aria-hidden="true" className={className}>
    <path
      d="M6 10.2 1.6 6.1a2.7 2.7 0 0 1 3.8-3.8L6 2.9l.6-.6a2.7 2.7 0 0 1 3.8 3.8L6 10.2Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

// Figma 7249:74408 — 9.33x2.33, fill #737373. Overflow menu.
export const MoreDotsIcon = ({ className = '' }) => (
  <svg viewBox="0 0 10 3" fill="none" aria-hidden="true" className={className}>
    <circle cx="1.2" cy="1.5" r="1.2" fill="currentColor" />
    <circle cx="5" cy="1.5" r="1.2" fill="currentColor" />
    <circle cx="8.8" cy="1.5" r="1.2" fill="currentColor" />
  </svg>
);

// Figma 7249:74497 (lets-icons:message) — 22x22, stroke 1.5. "Start Conversation".
export const ConversationIcon = ({ className = '' }) => (
  <svg viewBox="0 0 22 22" fill="none" aria-hidden="true" className={className}>
    <path
      d="M3.7 5.5a1.8 1.8 0 0 1 1.8-1.8h11a1.8 1.8 0 0 1 1.8 1.8v7.3a1.8 1.8 0 0 1-1.8 1.8H8.3l-4.6 3.2V5.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M7 8.2h8M7 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Figma 7249:74593/74594 — the insight banner's watermark: a 100x60 white
// arrow at 10% NODE opacity, sitting 794px from the banner's left edge and
// 144px down, so it bleeds off the bottom-right corner and is clipped.
// Path supplied verbatim by the user. Their snippet declared viewBox
// "0 0 84 44" while the path itself spans 0-100 x 0-60 (which is exactly the
// Figma node size), so the viewBox is set to 0 0 100 60 — otherwise the glyph
// would be cropped before the banner even clips it.
export const InsightTrendWatermark = ({ className = '' }) => (
  <svg viewBox="0 0 100 60" fill="none" aria-hidden="true" className={className}>
    <path
      d="M7 60L0 53L37 15.75L57 35.75L83 10H70V0H100V30H90V17L57 50L37 30L7 60Z"
      fill="currentColor"
    />
  </svg>
);
