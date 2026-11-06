import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import {
  apiMessage,
  flagStudent,
  progressStudent,
  unflagStudent,
} from '../../../../services/institutionPortal.api.js';
import { TabLayout } from '../../talentProfile/ProfileTabsUi.jsx';
import { INSTITUTION_BASE } from '../institutionNav.js';
import { buildDetail } from './progressDetail.js';
import ProgressAboutCard from './ProgressAboutCard.jsx';
import ProgressExperienceCard from './ProgressExperienceCard.jsx';
import ProgressFlagDialog from './ProgressFlagDialog.jsx';
import ProgressPortfolioCard from './ProgressPortfolioCard.jsx';
import ProgressPreviewBar from './ProgressPreviewBar.jsx';
import ProgressSkillsCard from './ProgressSkillsCard.jsx';
import ProgressStudentHero from './ProgressStudentHero.jsx';
import ProgressTermRail from './ProgressTermRail.jsx';

const log = debug('ProgressStudentDetail');

/*
 * ProgressStudentDetail — 11.3.2b "Student detail" (Figma 8595:653) + 11.3.2c flag dialog (?modal=flag): preview bar, hero and the two columns
 * (About · Top skills · Experience · Portfolio | the term card · At a glance). Live: GET /institution/progress/students/:id; Flag for coaching
 * (POST …/flag) and Clear flag (DELETE …/flag) save at once. The Figma profile tabs (Skills, Experience, …) are left out: the school sees the overview only.
 * Students not linked yet, or under 18 without a guardian's agreement, show a short explanation instead of any profile data.
 * Props: studentId, data (useInstitutionState()).
 */

const Card = ({ children }) => (
  <div className="flex flex-col gap-[12px] rounded-[22px] border border-solid border-[#e1eae2] bg-white p-[28px]">
    {children}
  </div>
);

const ProgressStudentDetail = ({ studentId, data }) => {
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      setDetail(buildDetail(await progressStudent(studentId)));
    } catch (err) {
      setError(err?.response?.status === 404 ? 'not-found' : apiMessage(err));
    }
  }, [studentId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    log('mount', { studentId, loaded: Boolean(detail) });
  }, [studentId, detail]);

  if (error) {
    return (
      <Card>
        <h1 className="m-0 font-sans text-[24px] leading-[30px] font-semibold text-[#1c2a21]">
          {error === 'not-found' ? 'Student not found' : 'Could not load this student'}
        </h1>
        {error !== 'not-found' ? (
          <p className="m-0 font-sans text-[14px] text-[#902b20]">{error}</p>
        ) : null}
        <Link
          to={`${INSTITUTION_BASE}/progress`}
          className="font-sans text-[14px] font-semibold text-[#387440]"
        >
          Back to progress
        </Link>
      </Card>
    );
  }
  if (!detail) {
    return (
      <Card>
        <p className="m-0 font-sans text-[14px] text-[#595959]">Loading…</p>
      </Card>
    );
  }
  if (detail.hidden) {
    return (
      <Card>
        <h1 className="m-0 font-sans text-[24px] leading-[30px] font-semibold text-[#1c2a21]">
          {detail.name}
        </h1>
        <p className="m-0 font-sans text-[15px] text-[#595959]">{detail.headline}</p>
        <p className="m-0 font-sans text-[15px] leading-[23px] text-[#1c2a21]">
          {detail.hidden === 'consent'
            ? `${detail.first} is under 18. Their progress shows here once a parent or guardian agrees. Send the consent request from Students.`
            : `${detail.first} hasn’t linked a GTH account to your school yet. Their progress shows here once they do.`}
        </p>
        <div className="flex flex-wrap gap-[16px]">
          <Link
            to={`${INSTITUTION_BASE}/students/${detail.id}`}
            className="font-sans text-[14px] font-semibold text-[#387440]"
          >
            Open their roster record
          </Link>
          <Link
            to={`${INSTITUTION_BASE}/progress`}
            className="font-sans text-[14px] font-semibold text-[#387440]"
          >
            Back to progress
          </Link>
        </div>
      </Card>
    );
  }

  const isFlagged = Boolean(detail.flag);
  const openFlag = () => data.update({ modal: 'flag' });
  const closeFlag = () => data.update({ modal: null });
  const run = async (fn, done) => {
    setBusy(true);
    setNotice('');
    try {
      await fn();
      await load();
      setNotice(done);
    } catch (err) {
      setNotice(`That didn’t work: ${apiMessage(err)}`);
    } finally {
      setBusy(false);
    }
  };
  const confirmFlag = () => {
    log('flag confirmed', studentId);
    closeFlag();
    run(() => flagStudent(studentId), `${detail.first} is flagged for coaching.`);
  };
  const clearFlag = () =>
    run(() => unflagStudent(studentId), `The coaching flag of ${detail.first} is cleared.`);

  return (
    <div className="flex flex-col gap-[20px]">
      <ProgressPreviewBar
        detail={detail}
        flagged={isFlagged}
        busy={busy}
        onFlag={openFlag}
        onClear={clearFlag}
      />
      <ProgressStudentHero
        detail={detail}
        initials={detail.initials}
        flagged={isFlagged}
        busy={busy}
        onFlag={openFlag}
        onClear={clearFlag}
      />
      {notice ? (
        <p
          role="status"
          className="m-0 rounded-[12px] bg-[#ebf1ec] px-[16px] py-[10px] font-sans text-[14px] text-[#1f4a2b]"
        >
          {notice}
        </p>
      ) : null}
      <TabLayout
        tab="overview"
        left={
          <>
            {detail.about ? <ProgressAboutCard about={detail.about} /> : null}
            {detail.skills.length ? (
              <ProgressSkillsCard skills={detail.skills} total={detail.skillsTotal} />
            ) : (
              <Card>
                <h2 className="m-0 font-sans text-[20px] font-semibold text-[#1c2a21]">
                  Top skills
                </h2>
                <p className="m-0 font-sans text-[14px] text-[#595959]">
                  No skills evidenced yet. Assessments, Skills Lab games and Career Buddy chats add
                  them.
                </p>
              </Card>
            )}
            {detail.experience.length ? <ProgressExperienceCard items={detail.experience} /> : null}
            {detail.portfolio.length ? <ProgressPortfolioCard items={detail.portfolio} /> : null}
          </>
        }
        right={<ProgressTermRail detail={detail} />}
      />
      {data.modal === 'flag' && !isFlagged ? (
        <ProgressFlagDialog first={detail.first} onConfirm={confirmFlag} onCancel={closeFlag} />
      ) : null}
    </div>
  );
};

export default ProgressStudentDetail;
