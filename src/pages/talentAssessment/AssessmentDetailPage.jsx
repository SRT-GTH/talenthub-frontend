import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import { RetakeCooldownDialog } from '../../components/sections/talentAssessment/AssessmentDialogs.jsx';
import AssessmentFrame from '../../components/sections/talentAssessment/AssessmentFrame.jsx';
import PersonalityDetail from '../../components/sections/talentAssessment/PersonalityDetail.jsx';
import SkillEvidence from '../../components/sections/talentAssessment/SkillEvidence.jsx';
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
  const skill = skillId ? getSkillEvidence(skillId) : null;

  useEffect(() => {
    log('mount', { skillId: skillId ?? 'personality', found: skillId ? Boolean(skill) : true });
  }, [skillId, skill]);

  return (
    <AssessmentFrame assessment={assessment}>
      {!skillId ? (
        <PersonalityDetail data={PERSONALITY_DETAIL} />
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
