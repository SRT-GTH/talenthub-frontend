import ProgressBar from '../ui/ProgressBar.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('InstitutionOnboardingBreadcrumb');

/*
 * InstitutionOnboardingBreadcrumb — horizontal progress bar for the
 * institution bulk-onboarding wizard.
 *
 * Figma node: 2968:24850. 48px tall, bg-white with a 1px bottom hairline.
 *
 * Left section — 8 step pills with:
 *   • 16×16 check-circle icon (active = brand-green #387440, pending = #babab7)
 *   • 14px step label (capitalize, tracking 0.14px / 0.01em)
 *   • 24px-wide chevron separator between steps
 *
 * Right section — compact progress readout:
 *   • "COMPLETE" label  — 12px, #bfbfbf, uppercase, tracking 0.5px
 *   • Percentage text   — 14px, semibold, brand-green (#387440)
 *   • ProgressBar md (6px track, brand-green fill on brand-green-light)
 *     capped at w-[72px]
 *
 * Props:
 *   currentStep      {number}  0-based index of the active step. Default 0.
 *   completionPercent {number} 0-100 override. Defaults to
 *                              Math.round((currentStep / total) × 100).
 */

const INSTITUTION_STEPS = [
  'Institution',
  'Contact',
  'Activate',
  'Template',
  'Upload',
  'Validate',
  'Confirm',
  'Report',
];

// ── inline icons ──────────────────────────────────────────────────────────

/* 16×16 check-circle. stroke colour is inherited via `currentColor`. */
const CheckCircleIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M5 8.3l2 2L11 5.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* 4×6 right-pointing chevron inside a 24px-wide container (Figma separator). */
const StepSeparator = () => (
  <span aria-hidden="true" className="inline-flex w-6 shrink-0 items-center justify-center">
    <svg viewBox="0 0 4 6" fill="none" className="text-[#babab7]" style={{ width: 4, height: 6 }}>
      <path
        d="M1 1l2 2-2 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

// ── main component ────────────────────────────────────────────────────────

const InstitutionOnboardingBreadcrumb = ({ currentStep = 0, completionPercent }) => {
  const total = INSTITUTION_STEPS.length;

  // Default completion: proportion of steps that have been reached (0-based).
  const pct =
    completionPercent !== undefined
      ? Math.max(0, Math.min(100, completionPercent))
      : Math.round((currentStep / total) * 100);

  log('render', { currentStep, total, pct });

  return (
    <nav
      aria-label="Institution onboarding steps"
      className="flex h-12 items-center gap-0 bg-white px-6"
      style={{ borderBottom: '1px solid #e7e7e7' }}
    >
      {/* ── Steps list — scrollable on narrow viewports ── */}
      <ol
        className="flex flex-1 min-w-0 items-center overflow-x-auto"
        style={{
          scrollbarWidth: 'none',
        }} /* hide scrollbar; raw CSS — Tailwind has no scrollbar-hide utility in v4 by default */
      >
        {INSTITUTION_STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isDone = index < currentStep;
          log('step render:', step, { isActive, isDone });

          return (
            <li key={step} className="inline-flex shrink-0 items-center">
              {/* Separator (before every step except the first) */}
              {index > 0 && <StepSeparator />}

              {/* Step pill — icon + label */}
              <span
                className="inline-flex items-center gap-1.5"
                aria-current={isActive ? 'step' : undefined}
              >
                <CheckCircleIcon
                  className={[
                    'size-4 shrink-0',
                    isActive || isDone ? 'text-brand-green' : 'text-[#babab7]',
                  ].join(' ')}
                />
                <span
                  className="font-sans text-[14px] capitalize"
                  style={{
                    letterSpacing: '0.14px' /* 0.01em at 14px — Figma token */,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#387440' : '#babab7',
                    lineHeight: '20px',
                  }}
                >
                  {step}
                </span>
              </span>
            </li>
          );
        })}
      </ol>

      {/* ── Right: progress readout ──
           Figma node 3010:40725 — container 245×48px.
           Layout is two stacked rows (NOT one horizontal row):
             Row 1 (h=24): "COMPLETE" label on the left, XX% value on the right.
             Row 2 (h=6):  full-width progress bar track below (y=35).
           Previous implementation had all three in a single horizontal row
           which did not match the Figma spec. ── */}
      <div
        className="ml-4 flex shrink-0 flex-col gap-[4px]"
        style={{ width: 'clamp(120px, 14vw, 180px)' }}
        aria-label={`${pct}% complete`}
      >
        {/* Row 1 — "COMPLETE" left, percentage right */}
        <div className="flex items-center justify-between">
          {/* 3010:40727 — "COMPLETE" label */}
          <span
            className="hidden font-sans text-[12px] uppercase sm:block"
            style={{
              letterSpacing: '0.5px',
              color: '#bfbfbf',
              lineHeight: '16px',
            }}
          >
            COMPLETE
          </span>
          {/* 3010:40729 — percentage value */}
          <span
            className="font-sans text-[14px] font-semibold"
            style={{ color: '#387440', lineHeight: '24px' }}
          >
            {pct}%
          </span>
        </div>

        {/* Row 2 — 3010:40731 progress bar, full-width track (h=6) */}
        <ProgressBar
          value={pct}
          max={100}
          size="md"
          label={`${pct}% complete`}
          className="w-full"
        />
      </div>
    </nav>
  );
};

export default InstitutionOnboardingBreadcrumb;
