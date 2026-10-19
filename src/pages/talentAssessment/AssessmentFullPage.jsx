import { useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import '../../styles/talentA11y.css';
import { debug } from '../../utils/debug.js';
import { ensurePlayfulFont } from '../../utils/ensurePlayfulFont.js';
import UiStyleScope from '../../components/shared/UiStyleScope.jsx';
import AssessmentFrame from '../../components/sections/talentAssessment/AssessmentFrame.jsx';
import { useAssessmentState } from '../../components/sections/talentAssessment/assessmentState.js';
import {
  FULL_FRAMES,
  getFullAssessment,
} from '../../components/sections/talentAssessment/assessmentData.js';
import FullIntroScreen from '../../components/sections/talentAssessment/full/FullIntroScreen.jsx';
import FullPlayScreen from '../../components/sections/talentAssessment/full/FullPlayScreen.jsx';

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
  const flow = getFullAssessment(skillId);
  const frame = params.get('f');
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
    <AssessmentFrame assessment={assessment}>
      <FullIntroScreen flow={flow} startTo="?step=play" />
    </AssessmentFrame>
  );
};

export default AssessmentFullPage;
