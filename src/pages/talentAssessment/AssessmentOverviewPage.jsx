import { useEffect, useMemo, useRef } from 'react';
import { debug } from '../../utils/debug.js';
import { RetakeCooldownDialog } from '../../components/sections/talentAssessment/AssessmentDialogs.jsx';
import AssessmentFrame from '../../components/sections/talentAssessment/AssessmentFrame.jsx';
import {
  ASSESSMENT_OVERVIEW,
  FIRST_VISIT,
  OVERVIEW_PAGE,
  RECRUITER_VIEW,
} from '../../components/sections/talentAssessment/assessmentData.js';
import { useAssessmentState } from '../../components/sections/talentAssessment/assessmentState.js';
import { OverviewBody } from '../../components/sections/talentAssessment/OverviewCards.jsx';
import { OvHeader } from '../../components/sections/talentAssessment/OverviewParts.jsx';
import {
  ErrorBody,
  FirstVisitBody,
  LoadingBody,
} from '../../components/sections/talentAssessment/OverviewStates.jsx';
import { RecruiterView } from '../../components/sections/talentAssessment/RecruiterView.jsx';
import { HubButton } from '../../components/sections/talentSkillsLab/HubParts.jsx';
import { buildLiveOverview } from '../../components/sections/talentAssessment/liveOverview.js';
import { useAssessmentHome } from '../../components/sections/talentAssessment/useAssessmentHome.js';

const log = debug('AssessmentOverviewPage');

/*
 * AssessmentOverviewPage — `/my-assessment`: MA-01 overview (3 of 4), `?state=first` MA-01b first visit, `?state=loading`
 * MA-01c, `?state=error` MA-01d, `?view=recruiter` MA-07 recruiter view, `?modal=retake` MA-08 retake cooldown pop-up.
 * The rail card of the shell follows the state (talentShellData.js: assessment · assessment-first · assessment-recruiter),
 * handed over through `stateKey` on the state object the frame receives.
 */
const RETRY_MS = 1200;

const AssessmentOverviewPage = () => {
  const assessment = useAssessmentState();
  const { state, view, modal, update, demo } = assessment;
  const recruiter = view === 'recruiter';
  // Live data (results / skills / games) unless a Figma frame or ?demo=1 is asked for.
  const data = useAssessmentHome({ enabled: !demo });
  const liveOverview = useMemo(
    () => (!demo && data.live && data.assessment ? buildLiveOverview(data.live, data.assessment) : null),
    [demo, data.live, data.assessment]
  );
  const liveLoading = !demo && !liveOverview && !data.failed;
  const first = !recruiter && (state === 'first' || Boolean(liveOverview?.first));
  const timer = useRef(null);

  useEffect(() => {
    log('mount', { state, view, modal });
  }, [state, view, modal]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const railKey = recruiter ? 'assessment-recruiter' : first ? 'assessment-first' : 'assessment';
  const frameState = useMemo(() => ({ ...assessment, stateKey: railKey }), [assessment, railKey]);

  // "Try again": live -> refetch; demo -> re-run the loading skeleton and land on the overview.
  const retry = () => {
    log('retry');
    if (!demo) {
      data.reload();
      return;
    }
    update({ state: 'loading' });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => update({ state: null }), RETRY_MS);
  };

  let body;
  if (recruiter) {
    body = <RecruiterView data={RECRUITER_VIEW} onExit={() => update({ view: null })} />;
  } else {
    let inner;
    const overview = liveOverview?.overview ?? ASSESSMENT_OVERVIEW;
    if (state === 'loading' || liveLoading) inner = <LoadingBody />;
    else if (state === 'error' || (!demo && data.failed)) inner = <ErrorBody onRetry={retry} />;
    else if (first) inner = <FirstVisitBody data={liveOverview?.firstVisit ?? FIRST_VISIT} />;
    else inner = <OverviewBody data={overview} />;
    const done =
      state === 'loading' || state === 'error' || liveLoading || first ? null : overview.summary;
    body = (
      <>
        <OvHeader
          title={OVERVIEW_PAGE.title}
          sticker={first ? FIRST_VISIT.sticker : done?.sticker}
          subtitle={OVERVIEW_PAGE.subtitle}
          action={
            // The recruiter preview (MA-07) is still the drawn mock: offered in demo mode only.
            done && demo ? (
              <HubButton
                tone="secondary"
                size="lg"
                onClick={() => update({ view: 'recruiter' })}
                className="shrink-0"
              >
                {OVERVIEW_PAGE.previewCta}
              </HubButton>
            ) : null
          }
        />
        {inner}
      </>
    );
  }

  return (
    <AssessmentFrame assessment={frameState} home={demo ? null : data.home}>
      <div className="mx-auto flex w-full max-w-[1425px] flex-col gap-[24px] pb-[32px] pl-[clamp(12px,2.31vw,40px)] pr-[clamp(12px,3.24vw,56px)] pt-[clamp(16px,1.85vw,32px)]">
        {body}
      </div>
      {modal === 'retake' ? <RetakeCooldownDialog onClose={() => update({ modal: null })} /> : null}
    </AssessmentFrame>
  );
};

export default AssessmentOverviewPage;
