import { useEffect, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import '../../styles/talentA11y.css';
import { debug } from '../../utils/debug.js';
import { ensurePlayfulFont } from '../../utils/ensurePlayfulFont.js';
import UiStyleScope from '../../components/shared/UiStyleScope.jsx';
import AssessmentFrame from '../../components/sections/talentAssessment/AssessmentFrame.jsx';
import { useAssessmentState } from '../../components/sections/talentAssessment/assessmentState.js';
import { useTalentHomeState } from '../../components/sections/talentHome/talentHomeState.js';
import {
  FULL_FRAMES,
  getFullAssessment,
} from '../../components/sections/talentAssessment/assessmentData.js';
import FullIntroScreen from '../../components/sections/talentAssessment/full/FullIntroScreen.jsx';
import FullPlayScreen from '../../components/sections/talentAssessment/full/FullPlayScreen.jsx';
import { LIVE_TYPES } from '../../components/sections/talentAssessment/liveAssessments.js';
import { useLiveAssessments } from '../../components/sections/talentAssessment/useLiveAssessments.js';

const log = debug('AssessmentFullPage');

/*
 * AssessmentFullPage — `/my-assessment/full/:skillId` (only `typescript` is drawn).
 *
 *   /my-assessment/full/typescript                 MA-04 intro, inside the talent shell (AssessmentFrame)
 *   /my-assessment/full/typescript?step=play       a real run: fresh, or the saved one (Save and exit / Leave anyway)
 *   /my-assessment/full/typescript?f=MA-04         the intro as drawn
 *   ?f=MA-05 · MA-06 · MA-10 · MA-11 · MA-12 · MA-13   boots the exact Figma state (frozen clock until the first click/key):
 *                                                  Q12 answer picked · passed (82) · not passed (58) · connection lost ·
 *                                                  time is up · leave confirmation
 *   &help=1 Help pop-over (helpPage 'assessment')  &rail=collapsed icon rail (intro only)
 * The run itself is focused chrome (logo bar + green lab header + progress bar + footer), NOT the talent shell. Data +
 * ⚠️ ASSUMPTIONS: components/sections/talentAssessment/assessmentData.js `/* ---- full ---- *\/`.
 */
const AssessmentFullPage = () => {
  const { skillId } = useParams();
  const [params] = useSearchParams();
  const assessment = useAssessmentState();
  const home = useTalentHomeState(); // live sidebar / nav (AssessmentFrame)
  const frame = params.get('f');
  // The six server-scored assessments (liveAssessments.js); `typescript` stays the drawn mock for design QA.
  const isLive = Boolean(LIVE_TYPES[skillId]) && !frame;
  const live = useLiveAssessments({ enabled: isLive });
  const { flowFor } = live;
  const flow = useMemo(
    () => (isLive ? (live.status === 'ready' ? flowFor(skillId) : null) : getFullAssessment(skillId)),
    [isLive, live.status, flowFor, skillId]
  );
  const seed = frame ? FULL_FRAMES[frame] : null;
  const playing = params.get('step') === 'play' || seed?.screen === 'play';

  useEffect(() => {
    ensurePlayfulFont();
    log('mount', { skillId, frame, playing, found: Boolean(flow) });
  }, [skillId, frame, playing, flow]);

  // Same marker as /home so talentA11y.css (focus ring, reduced motion) covers the portaled dialogs.
  useEffect(() => {
    document.documentElement.setAttribute('data-talent-home', '');
    return () => document.documentElement.removeAttribute('data-talent-home');
  }, []);

  if (isLive && live.status === 'loading') {
    return (
      <AssessmentFrame assessment={assessment} home={home}>
        <p className="m-0 py-[40px] font-sans text-[15px] text-[#595959]">Loading the assessment…</p>
      </AssessmentFrame>
    );
  }

  if (!flow) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-[12px] bg-[#f7f8f4] p-[24px] font-sans text-[#1c2a21]">
        <p className="m-0 text-[16px]">This assessment is not available yet.</p>
        <Link to="/my-assessment" className="text-[14px] font-semibold text-[#387440] underline">
          Back to My Assessment
        </Link>
      </div>
    );
  }

  if (playing) {
    return (
      <>
        <UiStyleScope enabled />
        <FullPlayScreen key={`${skillId}:${frame ?? 'live'}`} flow={flow} frame={frame} resume />
      </>
    );
  }

  return (
    <AssessmentFrame assessment={assessment} home={home}>
      <FullIntroScreen
        flow={flow}
        startTo="?step=play"
        practiseTo={flow.live ? '/profile/filling/career-buddy' : undefined}
      />
    </AssessmentFrame>
  );
};

export default AssessmentFullPage;
