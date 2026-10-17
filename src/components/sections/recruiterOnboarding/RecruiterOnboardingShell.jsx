import OnboardingHeader from '../../shared/OnboardingHeader.jsx';
import RecruiterOnboardingPanel from './RecruiterOnboardingPanel.jsx';
import {
  RECRUITER_ONBOARDING_STEPS,
  RECRUITER_ROUTES,
} from '../../shared/recruiterOnboardingSteps.js';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('RecruiterOnboardingShell');

/*
 * RecruiterOnboardingShell - the page skeleton every recruiter step shares:
 * breadcrumb header (steps + Figma-fixed percent) over a two-column area where
 * the LEFT column scrolls (vertically only) and the RIGHT panel stays put.
 * Same skeleton as the talent steps, extracted so the nine pages don't each
 * re-paste it.
 *
 * Props:
 *   routeKey   keyof RECRUITER_ROUTES - picks the breadcrumb step + percent.
 *   panel      ReactNode | false - default <RecruiterOnboardingPanel/>; pass
 *              false for a full-width step.
 *   hideHeader boolean - for frames with no breadcrumb.
 *   children   the step content, centred in the left column.
 */
const RecruiterOnboardingShell = ({
  routeKey,
  panel = <RecruiterOnboardingPanel />,
  hideHeader = false,
  className,
  children,
}) => {
  const route = RECRUITER_ROUTES[routeKey];
  log('render', { routeKey, percent: route?.percent, hideHeader, hasPanel: panel !== false });

  return (
    <section className="relative flex w-full flex-1 min-h-0 flex-col overflow-hidden bg-white">
      {!hideHeader && (
        <OnboardingHeader
          steps={RECRUITER_ONBOARDING_STEPS}
          currentKey={route?.stepKey}
          percent={route?.percent}
          completedTone="brand"
        />
      )}
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        <div className="flex flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden no-scrollbar max-md:scroll-pb-28 max-lg:relative max-lg:z-10">
          <div
            className={classNames(
              'flex min-w-0 flex-1 items-start justify-center px-6 pt-12 pb-12 md:pt-16 max-md:px-4 max-md:pt-3 max-md:pb-3',
              className
            )}
          >
            {children}
          </div>
        </div>
        {panel !== false && panel}
      </div>
    </section>
  );
};

export default RecruiterOnboardingShell;
