import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import AssessmentFrame from '../../components/sections/talentAssessment/AssessmentFrame.jsx';
import AssessmentLibrary from '../../components/sections/talentAssessment/AssessmentLibrary.jsx';
import { useAssessmentState } from '../../components/sections/talentAssessment/assessmentState.js';
import { useTalentHomeState } from '../../components/sections/talentHome/talentHomeState.js';
import { ASSESSMENT_LIBRARY } from '../../components/sections/talentAssessment/assessmentData.js';
import { buildLiveLibrary } from '../../components/sections/talentAssessment/liveAssessments.js';
import { useLiveAssessments } from '../../components/sections/talentAssessment/useLiveAssessments.js';

const log = debug('AssessmentLibraryPage');

/* AssessmentLibraryPage — `/my-assessment/library` (MA-09): the talent shell around the assessments library. */
const AssessmentLibraryPage = () => {
  const assessment = useAssessmentState();
  const home = useTalentHomeState(); // live sidebar / nav (AssessmentFrame)
  const [params] = useSearchParams();
  // ?demo=1 keeps the drawn MA-09 (per-skill mock) for design QA; otherwise the six real assessments.
  const demo = params.get('demo') === '1';
  const live = useLiveAssessments({ enabled: !demo });
  const data = useMemo(
    () =>
      demo
        ? ASSESSMENT_LIBRARY
        : buildLiveLibrary(live.templates, live.results, ASSESSMENT_LIBRARY),
    [demo, live.templates, live.results]
  );
  useEffect(() => {
    log('mount', { demo, status: live.status, cards: data.cards.length });
  }, [demo, live.status, data.cards.length]);
  return (
    <AssessmentFrame assessment={assessment} home={home}>
      {!demo && live.status === 'loading' ? (
        <p className="m-0 py-[40px] font-sans text-[15px] text-[#595959]">Loading assessments…</p>
      ) : !demo && live.status === 'error' ? (
        <p className="m-0 py-[40px] font-sans text-[15px] text-[#595959]">
          We couldn’t load the assessments.{' '}
          <button
            type="button"
            onClick={live.reload}
            className="font-semibold text-[#387440] underline"
          >
            Try again
          </button>
        </p>
      ) : (
        <AssessmentLibrary key={demo ? 'demo' : 'live'} data={data} />
      )}
    </AssessmentFrame>
  );
};

export default AssessmentLibraryPage;
