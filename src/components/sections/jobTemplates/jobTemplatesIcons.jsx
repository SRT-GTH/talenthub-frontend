/*
 * jobTemplatesIcons.jsx — glyphs for the Job Templates cards.
 *
 * Hand-crafted per the session rule for small UI icons: only each icon's
 * bounding box and fill/stroke colour were taken from Figma (7249:75141 etc.
 * — all card glyphs are #2a5730, the blank tile's is #9a988f, and the footer
 * arrow "ci:arrow-right-md" is a 24x24 #2a5730 stroke at weight 2). No path
 * data was copied; each glyph is drawn to match its Figma bounding-box
 * proportions and the template category it sits on.
 */

// 23.33 x 14 — widest and shortest of the set. Software Engineer.
export const TemplateCodeIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 14" fill="none" aria-hidden="true" className={className}>
    <path
      d="M7.5 1.5 1.8 7l5.7 5.5M16.5 1.5 22.2 7l-5.7 5.5M13.6 1l-3.2 12"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 23.33 x 18.67 — Marketing Associate.
export const TemplateMegaphoneIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 19" fill="none" aria-hidden="true" className={className}>
    <path
      d="M2 7.2v4.6a1.6 1.6 0 0 0 1.6 1.6h2.1L21 17.4V1.6L5.7 5.6H3.6A1.6 1.6 0 0 0 2 7.2Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M6 13.6V18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 23.33 x 21 — Customer Support Rep.
export const TemplateHeadsetIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 21" fill="none" aria-hidden="true" className={className}>
    <path
      d="M3 13V10.5a9 9 0 0 1 18 0V13"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <rect
      x="1.4"
      y="12.4"
      width="4.6"
      height="6.4"
      rx="1.8"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <rect
      x="18"
      y="12.4"
      width="4.6"
      height="6.4"
      rx="1.8"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);

// 25.67 x 21 — General Internship.
export const TemplateGraduationIcon = ({ className = '' }) => (
  <svg viewBox="0 0 26 21" fill="none" aria-hidden="true" className={className}>
    <path
      d="M13 2 1.6 7.2 13 12.4l11.4-5.2L13 2Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M5.4 9v5.6c0 1.9 3.4 3.4 7.6 3.4s7.6-1.5 7.6-3.4V9"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 23.33 x 23.33 — Product Designer (the only square glyph).
export const TemplateDesignIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path
      d="M12 2a10 10 0 1 0 0 20c1.3 0 2.1-.9 2.1-2 0-.6-.2-1-.6-1.4-.4-.4-.6-.8-.6-1.3 0-1.1.9-2 2-2H17a5 5 0 0 0 5-5c0-4.4-4.5-8-10-8Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="7.4" cy="11.4" r="1.5" fill="currentColor" />
    <circle cx="12" cy="7.2" r="1.5" fill="currentColor" />
    <circle cx="16.6" cy="11.4" r="1.5" fill="currentColor" />
  </svg>
);

// 18.67 x 18.67, #9a988f — the blank tile's add glyph.
export const TemplatePlusIcon = ({ className = '' }) => (
  <svg viewBox="0 0 19 19" fill="none" aria-hidden="true" className={className}>
    <path d="M9.5 2v15M2 9.5h15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

// 24 x 24, stroke 2 — "ci:arrow-right-md" in every card footer.
export const TemplateArrowRightIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
