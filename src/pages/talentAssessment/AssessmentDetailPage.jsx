import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import { RetakeCooldownDialog } from '../../components/sections/talentAssessment/AssessmentDialogs.jsx';
import AssessmentFrame from '../../components/sections/talentAssessment/AssessmentFrame.jsx';
import PersonalityDetail from '../../components/sections/talentAssessment/PersonalityDetail.jsx';
import SkillEvidence from '../../components/sections/talentAssessment/SkillEvidence.jsx';
import { buildLivePersonalityDetail } from '../../components/sections/talentAssessment/liveOverview.js';
import { buildLiveSkillEvidence } from '../../components/sections/talentAssessment/liveSkillEvidence.js';
import { useAssessmentHome } from '../../components/sections/talentAssessment/useAssessmentHome.js';
import { useAssessmentState } from '../../components/sections/talentAssessment/assessmentState.js';
import {
  PERSONALITY_DETAIL,
  getSkillEvidence,
} from '../../components/sections/talentAssessment/assessmentData.js';

const log = debug('AssessmentDetailPage');

/*
 * AssessmentDetailPage — serves `/my-assessment/personality` (MA-02) and `/my-assessment/skills/:skillId` (MA-03 python,
 * MA-03b firebase). Data comes from assessmentData.js (`/* ---- details ---- *\/`); a skill id without a drawn frame shows the
 * ⚠️ ASSUMPTION "not found" state (copy mirrors LabDetailPage). Talent shell = AssessmentFrame; `?rail=collapsed` = icon rail.
 */
const AssessmentDetailPage = () => {
  const assessment = useAssessmentState();
  const { skillId } = useParams();
  // Personality and per-skill evidence are live (profile skills, verifications, games); demo keeps the drawn mock.
  const { demo } = assessment;
  const data = useAssessmentHome({ enabled: !demo });
  const skill = useMemo(() => {
    if (!skillId) return null;
    if (demo) return getSkillEvidence(skillId);
    return data.assessment ? buildLiveSkillEvidence(skillId, data.assessment) : null;
  }, [demo, skillId, data.assessment]);
  const personality = useMemo(
    () =>
      !demo && data.live && data.assessment
        ? buildLivePersonalityDetail(data.live, data.assessment)
        : null,
    [demo, data.live, data.assessment]
  );
  const waiting = !demo && !data.assessment && !data.failed;

  useEffect(() => {
    log('mount', { skillId: skillId ?? 'personality', found: skillId ? Boolean(skill) : true });
  }, [skillId, skill]);

  return (
    <AssessmentFrame assessment={assessment} home={demo ? null : data.home}>
      {waiting ? (
        <p className="m-0 px-[clamp(12px,3vw,52px)] pt-[32px] font-sans text-[15px] text-[#595959]">
          Loading your results…
        </p>
      ) : !skillId && !demo && !personality ? (
        <div className="mx-auto flex w-full max-w-[1433px] flex-col items-start gap-[12px] px-[clamp(12px,3vw,52px)] pt-[32px] font-sans">
          <p className="m-0 text-[16px] text-[#1c2a21]">
            You haven’t taken a personality assessment yet.
          </p>
          <Link
            to="/my-assessment/full/big-five"
            className="text-[14px] font-semibold text-[#387440] underline"
          >
            Take the Big Five (about 8 minutes)
          </Link>
        </div>
      ) : !skillId ? (
        <PersonalityDetail data={demo ? PERSONALITY_DETAIL : personality} />
      ) : skill ? (
        <SkillEvidence key={skill.id} data={skill} />
      ) : (
        <div className="mx-auto flex w-full max-w-[1433px] flex-col gap-[12px] px-[clamp(12px,3vw,52px)] pt-[32px] font-sans">
          <p className="m-0 text-[16px] text-[#1c2a21]">We could not find that skill.</p>
          <Link to="/my-assessment" className="text-[14px] font-semibold text-[#387440] underline">
            My Assessment
          </Link>
        </div>
      )}
      {assessment.modal === 'retake' ? (
        <RetakeCooldownDialog onClose={() => assessment.update({ modal: null })} />
      ) : null}
    </AssessmentFrame>
  );
};

export default AssessmentDetailPage;
