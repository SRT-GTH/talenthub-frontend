/*
 * jobScreeningIcons.jsx — glyphs and the criteria toggle for Job Screening.
 *
 * Hand-crafted per the session rule: only bounding boxes and fill colours came
 * from Figma (criteria glyphs 19.5x16 #387440, the Assessment/Location card
 * glyphs 18x18 #387440, the rating stars 20x19 — four #eab308 and one
 * #d6d1c2). No path data was copied.
 */
import { classNames } from '../../../utils/classNames.js';

export const CriteriaExperienceIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 16" fill="none" aria-hidden="true" className={className}>
    <rect x="1.2" y="4" width="17.6" height="10.8" rx="2" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M6.8 4V2.8a1.6 1.6 0 0 1 1.6-1.6h3.2a1.6 1.6 0 0 1 1.6 1.6V4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path d="M1.2 8.6h17.6" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

export const CriteriaSkillsIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M7 3.2h11.4M7 8h11.4M7 12.8h11.4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="m1.4 3 1.3 1.3 2.1-2.4M1.4 7.8l1.3 1.3 2.1-2.4M1.4 12.6l1.3 1.3 2.1-2.4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CriteriaEducationIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M10 1.4 1.4 5.2 10 9l8.6-3.8L10 1.4Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path
      d="M4.8 6.8v3.9c0 1.4 2.3 2.5 5.2 2.5s5.2-1.1 5.2-2.5V6.8"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const AssessmentGaugeIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path
      d="M2 13.4a8 8 0 1 1 14 0"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path d="m9 10.6 3.4-3.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="9" cy="12.2" r="1.3" fill="currentColor" />
  </svg>
);

export const LocationMatchIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path
      d="M9 16.2c3.4-3.4 5.2-6 5.2-8.2a5.2 5.2 0 1 0-10.4 0c0 2.2 1.8 4.8 5.2 8.2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="7.8" r="1.9" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

// 20x19 — Estimated Quality rating.
export const RatingStarIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 19" fill="none" aria-hidden="true" className={className}>
    <path
      d="m10 1.4 2.6 5.4 5.9.8-4.3 4.2 1 5.9L10 15l-5.2 2.7 1-5.9L1.5 7.6l5.9-.8L10 1.4Z"
      fill="currentColor"
    />
  </svg>
);

// 16x16, #595959 — solar:alt-arrow-down-line-duotone on each criteria select.
export const CriteriaChevronIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="m3.4 6 4.6 4 4.6-4"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/*
 * CriteriaToggle — the pill switch that ends every criteria row (Figma
 * 7249:78279: a 44x24 #387440 track with a 20px white knob) and sits in the
 * Assessment / Location card headers at 39.6x21.6 with an 18px knob. Both are
 * drawn ON in Figma; `size` picks the geometry.
 */
export const CriteriaToggle = ({ size = 'lg', className = '' }) => (
  <span
    role="img"
    aria-label="Criterion enabled"
    className={classNames(
      'inline-flex shrink-0 items-center rounded-full bg-brand-green',
      size === 'lg' ? 'h-[24px] w-[44px] px-[2px]' : 'h-[21.6px] w-[39.6px] px-[1.8px]',
      'justify-end',
      className
    )}
  >
    <span
      className={classNames('rounded-full bg-white', size === 'lg' ? 'size-[20px]' : 'size-[18px]')}
    />
  </span>
);
