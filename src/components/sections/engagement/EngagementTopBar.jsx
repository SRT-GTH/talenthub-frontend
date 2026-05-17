import { classNames } from '../../../utils/classNames.js';
import EngagementProgressIndicator from '../../ui/EngagementProgressIndicator.jsx';
import { PROFILE_STAGES } from '../../../constants/profileStages.js';

/*
 * EngagementTopBar — stage-trail row on the Profile Engagement page.
 * Source: Figma frame 3384:81977 ("Frame 150").
 *
 * Sits directly below `EngagementTopNav`. Two columns:
 *   left:  the 9-stage trail. Each stage is a hollow grey check-circle
 *          followed by the stage label. A small grey chevron (▸) separates
 *          stages. The active stage label picks up a brand-green underline.
 *   right: `EngagementProgressIndicator` (step counter + thin progress bar).
 *
 * Note: per Figma, every stage in the trail uses the same hollow grey
 * circle glyph regardless of completion status — completion is conveyed
 * by the per-stage cards in the body, not by colouring the trail.
 */

// Hollow check-circle in light grey — Figma 3384:81977 trail glyph.
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

// Small right-pointing chevron between stages.
const ChevronRight = ({ className }) => (
  <svg
    viewBox="0 0 8 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M2 2l4 4-4 4" />
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

          return (
            <span key={stage.id} className="inline-flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-flex size-4 shrink-0 text-neutral-dark">
                  <HollowCheckCircle className="size-full" />
                </span>
                <span
                  aria-current={isCurrent ? 'step' : undefined}
                  className={classNames(
                    'font-sans text-[13px] tracking-[0.14px]',
                    isCurrent
                      ? 'font-semibold text-content-primary border-b-2 border-brand-green pb-px'
                      : 'font-medium text-neutral-dark-hover'
                  )}
                >
                  {stage.title.split(' ')[0]}
                </span>
              </span>
              {index < PROFILE_STAGES.length - 1 && (
                <ChevronRight className="size-2.5 text-neutral-dark ml-2" />
              )}
            </span>
          );
        })}
      </nav>

      <div className="w-[clamp(260px,22vw,330px)] shrink-0">
        <EngagementProgressIndicator
          currentIndex={currentStageIndex}
          totalSteps={PROFILE_STAGES.length}
          currentStepLabel={currentStage?.title}
          completionPct={completionPct}
        />
      </div>
    </div>
  );
};

export default EngagementTopBar;
