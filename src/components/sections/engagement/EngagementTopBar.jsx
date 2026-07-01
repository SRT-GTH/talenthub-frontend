import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import EngagementProgressIndicator from '../../ui/EngagementProgressIndicator.jsx';
import { PROFILE_STAGES } from '../../../constants/profileStages.js';
import { useEngagementProgress } from '../../../hooks/useEngagementProgress.js';

import arrowhead from '../../../assets/engagement/arrowhead.svg';

/*
 * EngagementTopBar — stage-trail row on the Profile Engagement page.
 * Source: Figma frame 3384:81977.
 *
 * Layout (two columns):
 *   left:  the 9-stage trail. Each stage is rendered as a check-circle
 *          icon + text label, both colour-controlled so the active stage
 *          reads brand-green and the rest read neutral-grey. arrowhead.svg
 *          is the separator between them. Each row is wrapped in a <Link>
 *          so users can jump to that stage.
 *   right: `EngagementProgressIndicator` (step counter + thin progress bar).
 *
 * Earlier iteration used 9 per-stage SVG breadcrumbs (icon + label baked
 * into one image). We've switched to one shared check icon + a text
 * label so the active/inactive colour swap can happen in code
 * (text-brand-green vs text-neutral-dark-hover), matching the Figma
 * states. The shared icon is inlined as a React component so its fill
 * follows `currentColor` from the parent — the source SVG had a
 * hard-coded grey fill that blocked state-based recolouring.
 */

const CheckCircleIcon = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.9998 0.799805C4.02335 0.799805 0.799805 4.02335 0.799805 7.9998C0.799805 11.9763 4.02335 15.1998 7.9998 15.1998C11.9763 15.1998 15.1998 11.9763 15.1998 7.9998C15.1998 4.02335 11.9763 0.799805 7.9998 0.799805ZM11.0746 6.16667C11.2772 5.90446 11.2289 5.52765 10.9667 5.32503C10.7045 5.12242 10.3277 5.17073 10.125 5.43294L7.16473 9.26392L5.84578 7.79842C5.62411 7.55212 5.24473 7.53215 4.99843 7.75383C4.75212 7.9755 4.73215 8.35488 4.95383 8.60118L6.75383 10.6012C6.87286 10.7334 7.04446 10.806 7.22228 10.7994C7.40009 10.7927 7.56577 10.7075 7.67457 10.5667L11.0746 6.16667Z"
    />
  </svg>
);

// Per-stage destination route. Each stage now has its OWN route — no
// more dumping every non-Avatar breadcrumb back at /profile/engagement
// (which auto-opens the entry-method modal and confuses the UX).
// Routes that don't yet have a built page will 404 until they're
// implemented, which is more honest than silently rerouting.
const STAGE_ROUTES = {
  avatar: '/profile/engagement/avatar',
  'personal-interests': '/profile/engagement/interests',
  personality: '/profile/engagement/personality',
  skills: '/profile/engagement/skills',
  'work-experience': '/profile/engagement/work',
  'project-portfolio': '/profile/engagement/portfolio',
  certifications: '/profile/engagement/certifications',
  'desired-career': '/profile/engagement/goals',
  'talent-pitch': '/profile/engagement/pitch',
};

const EngagementTopBar = ({ currentStageIndex = 0, completionPct = 0, className }) => {
  const currentStage = PROFILE_STAGES[currentStageIndex];
  // Lock state pulled from the shared progress hook so the breadcrumb
  // greys out + becomes unclickable for stages the user hasn't
  // unlocked yet — matching the identity-map's gating.
  const { getStageStatus } = useEngagementProgress();

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
        className="flex-1 min-w-0 flex flex-nowrap items-center gap-x-1 overflow-hidden"
      >
        {PROFILE_STAGES.map((stage, index) => {
          const isCurrent = index === currentStageIndex;
          const route = STAGE_ROUTES[stage.id];
          if (!route) return null;
          const label = stage.trailLabel || stage.title;
          const status = getStageStatus(stage.id);
          const isLocked = status === 'locked';

          // Locked stages render as a non-link span (not a <Link>), so
          // clicks/hovers don't navigate anywhere. Visually faded.
          const breadcrumbContent = (
            <>
              <CheckCircleIcon className="size-[clamp(14px,1.2vw,16px)] shrink-0" />
              <span
                className={classNames(
                  'font-sans text-[clamp(11px,1vw,13px)] leading-4 tracking-[0.1px]',
                  isCurrent ? 'font-semibold' : 'font-medium'
                )}
              >
                {label}
              </span>
            </>
          );

          return (
            <span key={stage.id} className="inline-flex items-center gap-1 shrink-0">
              {isLocked ? (
                <span
                  aria-label={`${label} — locked`}
                  className={classNames(
                    'inline-flex items-center gap-1 rounded px-1 py-0.5',
                    'cursor-not-allowed text-neutral-dark-hover opacity-50'
                  )}
                >
                  {breadcrumbContent}
                </span>
              ) : (
                <Link
                  to={route}
                  aria-label={label}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={classNames(
                    'inline-flex items-center gap-1 rounded px-1 py-0.5',
                    'transition-colors duration-150',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                    // Active stage: brand-green check + label.
                    // Inactive (but unlocked): neutral grey, hover restores
                    // brand-green so users see it's clickable.
                    isCurrent
                      ? 'text-brand-green'
                      : 'text-neutral-dark-hover hover:text-brand-green'
                  )}
                >
                  {breadcrumbContent}
                </Link>
              )}
              {index < PROFILE_STAGES.length - 1 && (
                <img
                  src={arrowhead}
                  alt=""
                  aria-hidden="true"
                  className="block size-5 select-none opacity-70 shrink-0"
                  draggable="false"
                />
              )}
            </span>
          );
        })}
      </nav>

      <div className="w-[clamp(320px,28vw,420px)] shrink-0">
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
