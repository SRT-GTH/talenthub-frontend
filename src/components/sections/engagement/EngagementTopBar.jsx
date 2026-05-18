import { classNames } from '../../../utils/classNames.js';
import EngagementProgressIndicator from '../../ui/EngagementProgressIndicator.jsx';
import { PROFILE_STAGES, STAGE_STATUS } from '../../../constants/profileStages.js';

/*
 * EngagementTopBar — stage-trail row on the Profile Engagement page.
 * Source: Figma frame 3384:81977 ("Frame 150").
 *
 * Sits directly below `EngagementTopNav`. Two columns:
 *   left:  the 9-stage trail. Each stage shows a check-circle (filled
 *          green for done stages, hollow grey for pending) followed by
 *          the stage label. A small filled grey triangle (▸) separates
 *          stages. The active stage label picks up a brand-green
 *          underline.
 *   right: `EngagementProgressIndicator` (step counter + thin progress bar).
 *
 * Completion state for the per-stage circle comes from the stage's
 * `status` field in PROFILE_STAGES — that's the source of truth that
 * also drives the stage cards below.
 */

// Hollow check-circle in light grey — used for pending / not-yet-done stages.
const HollowCheckCircle = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
    <path
      d="M5.5 8.4l1.8 1.8 3.6-3.8"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Filled brand-green check circle — used for done stages.
const FilledCheckCircle = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <circle cx="8" cy="8" r="7.4" fill="currentColor" />
    <path
      d="M5.2 8.4l1.8 1.8 3.8-4"
      stroke="white"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Small filled right-pointing triangle separator between stages.
// Figma uses a flat, solid grey triangle (not a stroke chevron) lying on
// its side. The viewBox is 6×8 so the triangle reads as a compact arrow.
const TriangleSeparator = ({ className }) => (
  <svg viewBox="0 0 6 8" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M0 0L6 4L0 8Z" />
  </svg>
);

const EngagementTopBar = ({ currentStageIndex = 0, completionPct = 0, className }) => {
  const currentStage = PROFILE_STAGES[currentStageIndex];

  return (
    <div
      className={classNames(
        'w-full bg-white border-b border-border-default',
        'px-[clamp(16px,3vw,40px)] py-[clamp(10px,1.2vw,14px)]',
        'flex flex-wrap items-center gap-x-6 gap-y-3',
        className
      )}
    >
      <nav
        aria-label="Profile engagement stages"
        className="flex-1 min-w-0 flex flex-wrap items-center gap-x-1.5 gap-y-2"
      >
        {PROFILE_STAGES.map((stage, index) => {
          const isCurrent = index === currentStageIndex;
          const isDone = stage.status === STAGE_STATUS.DONE;

          return (
            <span key={stage.id} className="inline-flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className={classNames(
                    'inline-flex size-4 shrink-0',
                    isDone ? 'text-brand-green' : 'text-neutral-dark'
                  )}
                >
                  {isDone ? (
                    <FilledCheckCircle className="size-full" />
                  ) : (
                    <HollowCheckCircle className="size-full" />
                  )}
                </span>
                <span
                  aria-current={isCurrent ? 'step' : undefined}
                  className={classNames(
                    'font-sans text-[13px] tracking-[0.14px]',
                    isCurrent
                      ? 'font-semibold text-content-primary border-b-2 border-brand-green pb-px'
                      : isDone
                        ? 'font-medium text-brand-green'
                        : 'font-medium text-neutral-dark-hover'
                  )}
                >
                  {stage.trailLabel || stage.title}
                </span>
              </span>
              {index < PROFILE_STAGES.length - 1 && (
                <TriangleSeparator className="ml-2 h-2 w-1.5 text-neutral-dark" />
              )}
            </span>
          );
        })}
      </nav>

      <div className="w-[clamp(280px,24vw,360px)] shrink-0">
        <EngagementProgressIndicator
          currentIndex={currentStageIndex}
          totalSteps={PROFILE_STAGES.length}
          currentStepLabel={currentStage?.trailLabel || currentStage?.title}
          completionPct={completionPct}
        />
      </div>
    </div>
  );
};

export default EngagementTopBar;
