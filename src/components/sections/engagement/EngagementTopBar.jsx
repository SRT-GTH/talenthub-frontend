import { classNames } from '../../../utils/classNames.js';
import EngagementProgressIndicator from '../../ui/EngagementProgressIndicator.jsx';
import { PROFILE_STAGES } from '../../../constants/profileStages.js';

/*
 * EngagementTopBar — top navigation row on the Profile Engagement page.
 * Source: Figma frame 3384:81977 ("Frame 150").
 *
 * Layout (Figma exact, scaled with clamp):
 *   left:  horizontal step trail (Avatar › Interests › Personality › …) —
 *          the active step picks up brand-green underline weight.
 *   right: EngagementProgressIndicator (step counter + thin progress bar).
 *
 * The trail uses simple right-chevrons between labels; the active label
 * gets a 2-px brand-green underline.
 */

const ChevronRight = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M9 6l6 6-6 6" />
  </svg>
);

const EngagementTopBar = ({ currentStageIndex = 0, completionPct = 0, className }) => {
  const currentStage = PROFILE_STAGES[currentStageIndex];

  return (
    <header
      className={classNames(
        'w-full bg-white border-b border-border-default',
        'px-[clamp(16px,4vw,56px)] py-[clamp(16px,2vw,28px)]',
        'flex flex-wrap items-center gap-6',
        className
      )}
    >
      <nav
        aria-label="Profile engagement stages"
        className="flex-1 min-w-0 flex flex-wrap items-center gap-x-2 gap-y-1"
      >
        {PROFILE_STAGES.map((stage, index) => {
          const isCurrent = index === currentStageIndex;
          return (
            <div key={stage.id} className="flex items-center gap-2">
              <span
                aria-current={isCurrent ? 'step' : undefined}
                className={classNames(
                  'font-sans text-[14px] tracking-[0.14px] capitalize',
                  isCurrent
                    ? 'font-semibold text-content-primary border-b-2 border-brand-green pb-0.5'
                    : 'font-medium text-neutral-dark-hover'
                )}
              >
                {stage.title.split(' ')[0]}
              </span>
              {index < PROFILE_STAGES.length - 1 && (
                <ChevronRight className="size-4 text-neutral-dark" />
              )}
            </div>
          );
        })}
      </nav>

      <div className="w-[clamp(260px,24vw,340px)]">
        <EngagementProgressIndicator
          currentIndex={currentStageIndex}
          totalSteps={PROFILE_STAGES.length}
          currentStepLabel={currentStage?.title}
          completionPct={completionPct}
        />
      </div>
    </header>
  );
};

export default EngagementTopBar;
