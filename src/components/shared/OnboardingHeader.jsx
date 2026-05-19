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

import { getTalentOnboardingSteps } from './onboardingSteps.js';
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

const OnboardingHeader = ({ steps: stepsProp, currentKey, percent = 0 }) => {
  // Steps list defaults to whatever the talent context implies (the
  // Parent step appears automatically for under-18 users). Callers can
  // still override with an explicit `steps` prop — e.g. parent/recruiter
  // flows will pass their own catalogue once those land.
  const { isMinor } = useOnboarding();
  const steps = stepsProp ?? getTalentOnboardingSteps({ isMinor: Boolean(isMinor) });
  const clamped = Math.max(0, Math.min(100, percent));
  const currentIndex = steps.findIndex((s) => s.key === currentKey);

  return (
    <div className="relative h-[58px] w-full border-b border-[#F1F1EF] bg-white">
      <div className="mx-auto flex h-full max-w-[1728px] items-center justify-between px-[54px]">
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
