import { useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import LabDetailScreen from '../../components/sections/talentSkillsLab/LabDetailScreen.jsx';
import { RestartLabDialog } from '../../components/sections/talentSkillsLab/SkillsLabLabDialogs.jsx';
import SkillsLabDialogs from '../../components/sections/talentSkillsLab/SkillsLabDialogs.jsx';
import SkillsLabFrame from '../../components/sections/talentSkillsLab/SkillsLabFrame.jsx';
import { useSkillsLabState } from '../../components/sections/talentSkillsLab/skillsLabState.js';
import { getLabDetail } from '../../components/sections/talentSkillsLab/skillsLabData.js';
import { isSkillsLabDemo, useLiveHub } from '../../components/sections/talentSkillsLab/skillsLabHubData.js';
import { liveLabDetail } from '../../components/sections/talentSkillsLab/liveLabDetail.js';

const log = debug('LabDetailPage');

/*
 * LabDetailPage — `/skills-lab/lab/:labId`: SL-02 Python (in progress), SL-02b Public speaking (not started),
 * SL-02c Data analysis (verified, cooldown). Data driven: getLabDetail(labId) returns the `GET /skills-lab/labs/:id`
 * payload (skillsLabData.js `/* ---- details ---- *\/`); labs without a drawn frame get a generic detail built from the hub
 * data. The talent shell (expanded sidebar, "Skills Lab" highlighted) is SkillsLabFrame; `?rail=collapsed` = icon rail.
 */
const LabDetailPage = () => {
  const skills = useSkillsLabState();
  const { labId } = useParams();
  const [params] = useSearchParams();
  // Live by default: this talent's status and attempts for the lab; `?demo=1` keeps the drawn detail frames.
  const live = useLiveHub({ enabled: !isSkillsLabDemo(params) });
  const detail = live
    ? live.status === 'ready'
      ? liveLabDetail(labId, live.labById(labId), live.attempts)
      : null
    : getLabDetail(labId);
  const navigate = useNavigate();

  useEffect(() => {
    log('mount', { labId, found: Boolean(detail) });
  }, [labId, detail]);

  return (
    <SkillsLabFrame skills={skills}>
      {live && live.status === 'loading' ? (
        <p role="status" className="mx-auto w-full max-w-[1433px] px-[clamp(12px,3vw,52px)] pt-[32px] font-sans text-[15px] text-[#595959]">
          Loading the lab…
        </p>
      ) : detail ? (
        <LabDetailScreen key={detail.id} detail={detail} />
      ) : (
        <div className="mx-auto flex w-full max-w-[1433px] flex-col gap-[12px] px-[clamp(12px,3vw,52px)] pt-[32px] font-sans">
          <p className="m-0 text-[16px] text-[#1c2a21]">We could not find that lab.</p>
          <Link to="/skills-lab" className="text-[14px] font-semibold text-[#387440] underline">
            All labs
          </Link>
        </div>
      )}
      <SkillsLabDialogs skills={skills} />
      {skills.modal === 'restart' && detail ? (
        <RestartLabDialog
          lab={detail.title.replace(/ lab$/, '')}
          onClose={() => skills.update({ modal: null })}
          onConfirm={() => navigate(`/skills-lab/lab/${labId}/play${live ? '?restart=1' : ''}`)}
        />
      ) : null}
    </SkillsLabFrame>
  );
};

export default LabDetailPage;
