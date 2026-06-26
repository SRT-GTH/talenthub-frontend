import { debug } from '../../utils/debug.js';

const log = debug('ParentOnboardingBreadcrumb');

/*
 * ParentOnboardingBreadcrumb — horizontal progress bar for the parent sign-up
 * wizard. Figma node 2864:37569 (Flow B style).
 *
 * Step indicator style:
 *   completed (index < currentStep) → amber #c8951a circle + white check,
 *                                     label #967014 semibold
 *   active    (index === currentStep) → black #111 circle + white dot,
 *                                       label #111 semibold
 *   upcoming  (index > currentStep)  → grey #babab7 @45% circle (empty),
 *                                      label #babab7 medium
 * Right: "COMPLETE" + amber percentage + amber progress bar on #eedeb8 track.
 *
 * Props:
 *   currentStep       {number}  0-based index of the active step. Default 0.
 *   completionPercent {number}  0-100 override. Defaults to
 *                               Math.round((currentStep / total) × 100).
 */

const PARENT_STEPS = [
  'Identity',
  'Verification',
  'Contact',
  'Security',
  'Link Ward',
  'Consent',
  'Done',
];

const StepCheck = () => (
  <svg viewBox="0 0 8 8" fill="none" aria-hidden="true" className="size-2">
    <path
      d="M1.5 4.2l1.6 1.6L6.6 2.2"
      stroke="#ffffff"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Step status circle — 15px filled, per-status fill + glyph.
const StepCircle = ({ completed, active }) => {
  if (completed) {
    return (
      <span
        className="flex size-[15px] shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: '#c8951a' }}
      >
        <StepCheck />
      </span>
    );
  }
  if (active) {
    return (
      <span
        className="flex size-[15px] shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: '#111111' }}
      >
        <span className="size-[4px] rounded-full" style={{ backgroundColor: '#ffffff' }} />
      </span>
    );
  }
  return (
    <span
      className="size-[15px] shrink-0 rounded-full"
      style={{ backgroundColor: '#babab7', opacity: 0.45 }}
    />
  );
};

const StepSeparator = () => (
  <span aria-hidden="true" className="inline-flex w-6 shrink-0 items-center justify-center">
    <svg viewBox="0 0 4 7" fill="none" style={{ width: 4, height: 7 }}>
      <path
        d="M1 1l2 2.5-2 2.5"
        stroke="#babab7"
        strokeWidth="1.3"
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
      className="flex h-[52px] shrink-0 items-center gap-0 bg-white px-6"
      style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
    >
      {/* ── Steps list — scrollable on narrow viewports ── */}
      <ol
        className="flex flex-1 min-w-0 items-center overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {PARENT_STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isDone = index < currentStep;

          return (
            <li key={step} className="inline-flex shrink-0 items-center">
              {index > 0 && <StepSeparator />}
              <span
                className="inline-flex items-center gap-2"
                aria-current={isActive ? 'step' : undefined}
              >
                <StepCircle completed={isDone} active={isActive} />
                <span
                  className="font-sans text-[12px]"
                  style={{
                    fontWeight: isActive || isDone ? 600 : 500,
                    color: isDone ? '#967014' : isActive ? '#111111' : '#babab7',
                    lineHeight: 'normal',
                  }}
                >
                  {step}
                </span>
              </span>
            </li>
          );
        })}
      </ol>

      {/* ── Right: completion readout — amber ── */}
      <div
        className="ml-4 flex shrink-0 flex-col items-end gap-[3px]"
        aria-label={`${pct}% complete`}
      >
        <span
          className="hidden font-sans text-[10px] font-bold uppercase sm:block"
          style={{ letterSpacing: '0.6px', color: '#babab7', lineHeight: 'normal' }}
        >
          Complete
        </span>
        <div className="flex items-center gap-[8px]">
          <span
            className="font-sans text-[13px] font-bold"
            style={{ color: '#c8951a', lineHeight: 'normal' }}
          >
            {pct}%
          </span>
          <div
            className="h-[5px] w-[100px] overflow-hidden rounded-full"
            style={{ backgroundColor: '#eedeb8' }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${pct}%`, backgroundColor: '#c8951a' }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ParentOnboardingBreadcrumb;
