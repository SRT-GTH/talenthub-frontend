import { debug } from '../../utils/debug.js';

const log = debug('ParentOnboardingBreadcrumb');

/*
 * ParentOnboardingBreadcrumb — horizontal progress bar for the parent sign-up wizard.
 * Figma node: 2901:81385. Mirrors InstitutionOnboardingBreadcrumb in structure but uses
 * amber (#b48617) instead of brand-green, and an inline progress bar div instead of
 * <ProgressBar /> (which hardcodes bg-brand-green and cannot be reused for amber fill).
 *
 * Props:
 *   currentStep       {number}  0-based index of the active step. Default 0.
 *   completionPercent {number}  0-100 override. Defaults to
 *                               Math.round((currentStep / total) × 100).
 */

const PARENT_STEPS = [
  'Parent Identity',
  'Verification',
  'Contact',
  'Security',
  'Link Ward',
  'Review & Consent',
  'Consent',
  'Done',
];

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

const ParentOnboardingBreadcrumb = ({ currentStep = 0, completionPercent }) => {
  const total = PARENT_STEPS.length;
  const pct =
    completionPercent !== undefined
      ? Math.max(0, Math.min(100, completionPercent))
      : Math.round((currentStep / total) * 100);

  log('render', { currentStep, total, pct });

  return (
    <nav
      aria-label="Parent onboarding steps"
      className="flex h-12 items-center gap-0 bg-white px-6"
      style={{ borderBottom: '1px solid #e7e7e7' }}
    >
      {/* ── Steps list — scrollable on narrow viewports ── */}
      <ol
        className="flex flex-1 min-w-0 items-center overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {PARENT_STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isDone = index < currentStep;
          log('step render:', step, { isActive, isDone });

          return (
            <li key={step} className="inline-flex shrink-0 items-center">
              {index > 0 && <StepSeparator />}
              <span
                className="inline-flex items-center gap-1.5"
                aria-current={isActive ? 'step' : undefined}
              >
                <CheckCircleIcon
                  className={[
                    'size-4 shrink-0',
                    isActive || isDone ? 'text-[#b48617]' : 'text-[#babab7]',
                  ].join(' ')}
                />
                <span
                  className="font-sans text-[14px]"
                  style={{
                    letterSpacing: '0.14px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#b48617' : '#babab7',
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

      {/* ── Right: progress readout — amber instead of green ── */}
      <div
        className="ml-4 flex shrink-0 flex-col gap-[4px]"
        style={{ width: 'clamp(120px, 14vw, 180px)' }}
        aria-label={`${pct}% complete`}
      >
        <div className="flex items-center justify-between">
          <span
            className="hidden font-sans text-[12px] uppercase sm:block"
            style={{ letterSpacing: '0.5px', color: '#bfbfbf', lineHeight: '16px' }}
          >
            COMPLETE
          </span>
          <span
            className="font-sans text-[14px] font-semibold"
            style={{ color: '#b48617', lineHeight: '24px' }}
          >
            {pct}%
          </span>
        </div>
        {/* Inline amber fill — ProgressBar.jsx hardcodes bg-brand-green, cannot reuse */}
        <div
          className="h-[6px] w-full overflow-hidden rounded-full"
          style={{ backgroundColor: '#f5e9c8' }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${pct}%`, backgroundColor: '#b48617' }}
          />
        </div>
      </div>
    </nav>
  );
};

export default ParentOnboardingBreadcrumb;
