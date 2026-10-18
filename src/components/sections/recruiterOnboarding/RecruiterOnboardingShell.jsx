import { useEffect, useState } from 'react';
import OnboardingHeader from '../../shared/OnboardingHeader.jsx';
import { RECRUITER_API_ERROR_EVENT } from '../../../services/recruiterOnboarding.api.js';
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
  // 2026-10-18: backend failures (services/recruiterOnboarding.api.js) are
  // announced as a window event and shown here, so every step gets the same
  // error banner without its own error state.
  const [apiError, setApiError] = useState(null);
  useEffect(() => {
    const onError = (e) =>
      setApiError(e.detail?.message || 'Something went wrong. Please try again.');
    window.addEventListener(RECRUITER_API_ERROR_EVENT, onError);
    return () => window.removeEventListener(RECRUITER_API_ERROR_EVENT, onError);
  }, []);
  useEffect(() => {
    if (!apiError) return undefined;
    const id = setTimeout(() => setApiError(null), 8000);
    return () => clearTimeout(id);
  }, [apiError]);
  log('render', { routeKey, percent: route?.percent, hideHeader, hasPanel: panel !== false });

  return (
    <section className="relative flex w-full flex-1 min-h-0 flex-col overflow-clip bg-white">
      {!hideHeader && (
        <OnboardingHeader
          steps={RECRUITER_ONBOARDING_STEPS}
          currentKey={route?.stepKey}
          percent={route?.percent}
          completedTone="brand"
        />
      )}
      {apiError && (
        <div
          role="alert"
          className="mx-auto mt-3 flex w-[min(640px,calc(100%-32px))] items-start justify-between gap-3 rounded-[10px] border border-[#f3c7c3] bg-[#fdf1f0] px-4 py-3 text-[14px] leading-5 text-[#8a1c12]"
        >
          <span>{apiError}</span>
          <button
            type="button"
            onClick={() => setApiError(null)}
            aria-label="Dismiss"
            className="shrink-0 font-semibold text-[#8a1c12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            ×
          </button>
        </div>
      )}
      <div className="relative flex flex-1 min-h-0 overflow-clip">
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
