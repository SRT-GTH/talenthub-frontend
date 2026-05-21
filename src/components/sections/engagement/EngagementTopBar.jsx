import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import EngagementProgressIndicator from '../../ui/EngagementProgressIndicator.jsx';
import { PROFILE_STAGES } from '../../../constants/profileStages.js';

import avatarBreadcrumb from '../../../assets/engagement/avatarbreadcrumb.svg';
import interestBreadcrumb from '../../../assets/engagement/interestbreadcrumb.svg';
import personalityBreadcrumb from '../../../assets/engagement/personalitybreadcrumb.svg';
import skillsBreadcrumb from '../../../assets/engagement/skillsbreadcrumb.svg';
import workBreadcrumb from '../../../assets/engagement/workbreadcrumb.svg';
import portfolioBreadcrumb from '../../../assets/engagement/portfoliobreadcrumb.svg';
import certsBreadcrumb from '../../../assets/engagement/certsbreadcrumb.svg';
import goalsBreadcrumb from '../../../assets/engagement/goalsbreadcrumb.svg';
import pitchBreadcrumb from '../../../assets/engagement/pitchbreadcrumb.svg';
import arrowhead from '../../../assets/engagement/arrowhead.svg';

/*
 * EngagementTopBar — stage-trail row on the Profile Engagement page.
 * Source: Figma frame 3384:81977.
 *
 * Layout (two columns):
 *   left:  the 9-stage trail. Each stage is rendered from a per-stage
 *          designer SVG breadcrumb (check-circle + label baked in) and
 *          arrowhead.svg is the separator between them. Each breadcrumb
 *          is wrapped in a <Link> so users can jump to that stage.
 *   right: `EngagementProgressIndicator` (step counter + thin progress bar).
 *
 * Visual states (done / in-progress / pending) are not differentiated by
 * these SVGs — they all share the same brand-green palette by design.
 * The active stage picks up a subtle ring + bottom-margin lift so it
 * still reads as "current" within the row.
 */

// Per-stage breadcrumb SVG + its destination route. The order here mirrors
// PROFILE_STAGES so the trail stays in sync with the rest of the flow.
const STAGE_BREADCRUMBS = {
  avatar: { src: avatarBreadcrumb, route: '/profile/engagement/avatar' },
  'personal-interests': { src: interestBreadcrumb, route: '/profile/engagement' },
  personality: { src: personalityBreadcrumb, route: '/profile/engagement' },
  skills: { src: skillsBreadcrumb, route: '/profile/engagement' },
  'work-experience': { src: workBreadcrumb, route: '/profile/engagement' },
  'project-portfolio': { src: portfolioBreadcrumb, route: '/profile/engagement' },
  certifications: { src: certsBreadcrumb, route: '/profile/engagement' },
  'desired-career': { src: goalsBreadcrumb, route: '/profile/engagement' },
  'talent-pitch': { src: pitchBreadcrumb, route: '/profile/engagement' },
};

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
        className="flex-1 min-w-0 flex flex-nowrap items-center gap-x-0.5 overflow-hidden"
      >
        {PROFILE_STAGES.map((stage, index) => {
          const isCurrent = index === currentStageIndex;
          const breadcrumb = STAGE_BREADCRUMBS[stage.id];
          if (!breadcrumb) return null;

          return (
            <span key={stage.id} className="inline-flex items-center gap-0.5 shrink-0">
              <Link
                to={breadcrumb.route}
                aria-label={stage.trailLabel || stage.title}
                aria-current={isCurrent ? 'step' : undefined}
                className={classNames(
                  'inline-flex items-center rounded',
                  'transition-opacity duration-150',
                  'hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                  isCurrent ? 'opacity-100' : 'opacity-70 hover:opacity-90'
                )}
              >
                <img
                  src={breadcrumb.src}
                  alt=""
                  className="block h-[clamp(16px,1.2vw,20px)] w-auto select-none"
                  draggable="false"
                />
              </Link>
              {index < PROFILE_STAGES.length - 1 && (
                <img
                  src={arrowhead}
                  alt=""
                  aria-hidden="true"
                  className="block h-4 w-4 select-none opacity-70"
                  draggable="false"
                />
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
