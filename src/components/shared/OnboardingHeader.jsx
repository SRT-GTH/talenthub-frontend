/*
 * OnboardingHeader — 58px strip that sits below the main Nav on every
 * onboarding step. Left side carries the breadcrumb trail through all
 * 8 stages of the talent flow (Role → Done). Right side shows the
 * completion meter (label + percent + 6px progress rail).
 *
 * Figma source: Frame 150 / 153 across nodes 2236:830, 2282:7563+,
 * 2282:10259, 2329:3893 (profile step). Background sits on white with
 * a 1px hairline at the bottom.
 *
 * Steps array is shared so every step page renders the same trail
 * with just `currentKey` swapped — pre-current steps render as
 * "completed" (green check + muted dark grey label), the current
 * step is highlighted in brand-green/600, and post-current steps
 * are muted grey/500.
 */

import { getTalentOnboardingSteps, getOnboardingPercent } from './onboardingSteps.js';
import { useOnboarding } from '../../hooks/useOnboarding.js';

const ChevronRight = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className="shrink-0"
  >
    <path
      d="M10 16L14 12L10 8"
      stroke="#BABAB7"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CompletedCheck = () => (
  // Small filled green check that prefixes completed step labels.
  // Figma swaps in this badge in place of the chevron's leading dot
  // once a step is past — keeps the trail readable in one glance.
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className="shrink-0"
  >
    <circle cx="8" cy="8" r="8" fill="#387440" />
    <path
      d="M5 8.4l2 2 4-4.4"
      stroke="white"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const OnboardingHeader = ({ steps: stepsProp, currentKey, percent }) => {
  // Steps list defaults to whatever the talent context implies (the
  // Parent step appears automatically for under-18 users). Callers can
  // still override with an explicit `steps` prop — e.g. parent/recruiter
  // flows will pass their own catalogue once those land.
  const { isMinor } = useOnboarding();
  const steps = stepsProp ?? getTalentOnboardingSteps({ isMinor: Boolean(isMinor) });
  const currentIndex = steps.findIndex((s) => s.key === currentKey);
  // Progress follows the trail: every step before the current one counts as
  // done, and reaching the last step ("Done") is 100%. The minor path has an
  // extra Parent step, so its percentages differ slightly. Callers can still
  // pass an explicit `percent` to override.
  const computed = getOnboardingPercent(steps, currentIndex);
  const clamped = Math.max(0, Math.min(100, percent ?? computed));

  return (
    <div className="relative h-[58px] w-full border-b border-[#F1F1EF] bg-white max-md:h-auto">
      {/* Phones: one slim row "Step 3 of 8 · Contact  38%" with a 3px progress line (<= 36px) */}
      <div className="relative flex items-center justify-between gap-3 px-4 py-2 md:hidden">
        <p className="min-w-0 truncate text-[13px] font-semibold leading-4 text-brand-green">
          <span className="text-[#575755]">
            Step {currentIndex >= 0 ? currentIndex + 1 : 1} of {steps.length}
          </span>
          <span aria-hidden="true" className="px-1.5 text-[#BABAB7]">
            ·
          </span>
          <span className="capitalize" aria-current="step">
            {steps[currentIndex]?.label ?? ''}
          </span>
        </p>
        <span className="shrink-0 text-[13px] font-semibold leading-4 text-brand-green">
          {clamped}%
        </span>
        <div
          className="absolute inset-x-0 bottom-0 h-[3px] bg-[#EBF1EC]"
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Onboarding completion"
        >
          <div
            className="h-full bg-brand-green transition-[width] duration-300"
            style={{ width: `${clamped}%` }}
          />
        </div>
      </div>

      <div className="mx-auto flex h-full items-center justify-between px-[54px] max-md:hidden">
        {/* Breadcrumbs */}
        <nav
          aria-label="Onboarding progress"
          className="flex items-center gap-2 overflow-x-auto text-[14px] leading-4 capitalize"
          style={{ letterSpacing: '0.14px' }}
        >
          {steps.map((step, index) => {
            const isActive = step.key === currentKey;
            const isCompleted = currentIndex >= 0 && index < currentIndex;
            const isUpcoming = currentIndex >= 0 && index > currentIndex;
            return (
              <div key={step.key} className="flex shrink-0 items-center gap-2">
                {index > 0 && <ChevronRight />}
                {isCompleted && <CompletedCheck />}
                <span
                  className={
                    isActive
                      ? 'font-semibold text-brand-green'
                      : isCompleted
                        ? 'font-medium text-[#575755]'
                        : 'font-medium text-[#BABAB7]'
                  }
                  aria-current={isActive ? 'step' : undefined}
                >
                  {step.label}
                </span>
                {/* Reserved width when step is upcoming so widths stay
                    stable as a user advances through the trail. */}
                {isUpcoming && null}
              </div>
            );
          })}
        </nav>

        {/* Completion meter */}
        <div className="flex w-[245px] shrink-0 flex-col gap-2 pl-6">
          <div className="flex items-center justify-between text-[14px] leading-4">
            <span
              className="font-medium capitalize text-[#BFBFBF]"
              style={{ letterSpacing: '0.5px' }}
            >
              COMPLETE
            </span>
            <span className="font-semibold text-brand-green">{clamped}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EBF1EC]">
            <div
              className="h-full rounded-full bg-brand-green transition-[width] duration-300"
              style={{ width: `${clamped}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingHeader;
