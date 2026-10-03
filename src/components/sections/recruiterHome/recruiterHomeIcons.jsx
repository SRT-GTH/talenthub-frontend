/*
 * recruiterHomeIcons.jsx — small UI glyphs for the recruiter home screen.
 *
 * Hand-crafted per the session rule for small UI icons: ONLY each icon's
 * bounding box, stroke colour and stroke weight were taken from Figma
 * (frame 7249:73882); no path data was copied from the design file. Every
 * glyph is drawn independently and uses `currentColor` so the caller sets
 * colour with a Tailwind text-* token.
 *
 * These live here rather than in shared/assets.jsx on purpose: the nearest
 * shared equivalents (LockIcon, EyeIcon) hardcode a size and a brand-green
 * fill and are used on 9 and 8 other screens respectively, so widening them
 * would put those usages at risk for no gain. Icons that DO already fit
 * (SearchIcon, BriefcaseIcon, SparkleIcon, ShieldCheckIcon — all currentColor
 * + className) are reused from shared/assets.jsx instead of redrawn here.
 */

// Figma 7249:73935 — 22x22, stroke 1.8. "Complete Profile" quick action.
export const CheckCircleIcon = ({ className = '' }) => (
  <svg viewBox="0 0 22 22" fill="none" aria-hidden="true" className={className}>
    <circle cx="11" cy="11" r="9.17" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="m7 11.2 2.7 2.7L15.2 8.4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Figma 7249:73951 (hugeicons:workflow-square-06) — 22x22, stroke 1.5.
// "Review Pipeline": one parent node branching down into two children.
export const WorkflowSquareIcon = ({ className = '' }) => (
  <svg viewBox="0 0 22 22" fill="none" aria-hidden="true" className={className}>
    <rect x="8" y="1.8" width="6" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.5" />
    <rect x="1.8" y="14.2" width="6" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.5" />
    <rect x="14.2" y="14.2" width="6" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M11 7.8v3.4M4.8 14.2v-1.6a1.4 1.4 0 0 1 1.4-1.4h9.6a1.4 1.4 0 0 1 1.4 1.4v1.6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Figma 7249:74052 — 22x22, stroke 1.4167. "Recruiter interest" unlock card.
export const VisibilityIcon = ({ className = '' }) => (
  <svg viewBox="0 0 22 22" fill="none" aria-hidden="true" className={className}>
    <path
      d="M1.8 11S5.5 5.2 11 5.2 20.2 11 20.2 11 16.5 16.8 11 16.8 1.8 11 1.8 11Z"
      stroke="currentColor"
      strokeWidth="1.4167"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="11" cy="11" r="2.75" stroke="currentColor" strokeWidth="1.4167" />
  </svg>
);

// Figma 7249:73921 — 15x15. "Customize" button: sliders / tune glyph.
export const CustomizeSlidersIcon = ({ className = '' }) => (
  <svg viewBox="0 0 15 15" fill="none" aria-hidden="true" className={className}>
    <path
      d="M2 4.3h3.1M8.2 4.3H13M2 10.7h4.8M9.9 10.7H13"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <circle cx="6.65" cy="4.3" r="1.55" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="8.35" cy="10.7" r="1.55" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

// Figma 7249:74016 — 11x11, stroke 0.9167. Padlock inside the "Locked" pill.
export const LockedBadgeIcon = ({ className = '' }) => (
  <svg viewBox="0 0 11 11" fill="none" aria-hidden="true" className={className}>
    <rect
      x="1.4"
      y="4.6"
      width="8.25"
      height="5.0417"
      rx="1.2"
      stroke="currentColor"
      strokeWidth="0.9167"
    />
    <path
      d="M3.2 4.6V3.4a2.3 2.3 0 0 1 4.6 0v1.2"
      stroke="currentColor"
      strokeWidth="0.9167"
      strokeLinecap="round"
    />
  </svg>
);

// Figma 7249:73979 — 13x13, stroke 1.1917, white. Tick inside the completed
// checklist row's filled green circle.
export const RowCheckIcon = ({ className = '' }) => (
  <svg viewBox="0 0 13 13" fill="none" aria-hidden="true" className={className}>
    <path
      d="m3.2 6.8 2.6 2.5 4.3-5"
      stroke="currentColor"
      strokeWidth="1.1917"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Figma 7249:73990 — 13x13, stroke 1.1917, white. Arrow in the "Add skills" CTA.
export const InlineArrowRightIcon = ({ className = '' }) => (
  <svg viewBox="0 0 13 13" fill="none" aria-hidden="true" className={className}>
    <path
      d="M2.7 6.5h7.6M7.1 3.4l3.2 3.1-3.2 3.1"
      stroke="currentColor"
      strokeWidth="1.1917"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Figma 7249:74013 — 22x22, stroke 1.4167. Four-point sparkle, "Top Talent
// Matches". Deliberately NOT shared/assets.jsx's SparkleIcon: that one is a
// FILLED glyph (fill=currentColor) while Figma's here is an outline.
export const SparkleOutlineIcon = ({ className = '' }) => (
  <svg viewBox="0 0 22 22" fill="none" aria-hidden="true" className={className}>
    <path
      d="M11 1.8c0 4.5 3.7 8.2 8.2 8.2-4.5 0-8.2 3.7-8.2 8.2 0-4.5-3.7-8.2-8.2-8.2 4.5 0 8.2-3.7 8.2-8.2Z"
      stroke="currentColor"
      strokeWidth="1.4167"
      strokeLinejoin="round"
    />
  </svg>
);

// Figma 7249:74032 (octicon:shield-check-24) — 24x24, FILLED #387440.
// shared/assets.jsx's ShieldCheckIcon is a 12x12 outline variant, so this
// filled 24x24 version is drawn separately rather than bending that one.
export const ShieldCheckFilledIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 1.5 3.5 4.6v6.2c0 5.2 3.5 9.9 8.5 11.2 5-1.3 8.5-6 8.5-11.2V4.6L12 1.5Zm4.3 7.6-5.1 5.6a.9.9 0 0 1-1.3 0L7.7 12.4a.9.9 0 0 1 1.3-1.2l1.6 1.7 4.4-4.9a.9.9 0 1 1 1.3 1.1Z"
      fill="currentColor"
    />
  </svg>
);
