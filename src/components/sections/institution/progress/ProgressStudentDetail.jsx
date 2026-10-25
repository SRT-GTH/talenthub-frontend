import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { TabLayout } from '../../talentProfile/ProfileTabsUi.jsx';
import { INSTITUTION_BASE } from '../institutionNav.js';
import { findStudentRow, getStudentDetail } from './progressDetail.js';
import ProgressAboutCard from './ProgressAboutCard.jsx';
import ProgressExperienceCard from './ProgressExperienceCard.jsx';
import ProgressFlagDialog from './ProgressFlagDialog.jsx';
import ProgressPortfolioCard from './ProgressPortfolioCard.jsx';
import ProgressPreviewBar from './ProgressPreviewBar.jsx';
import ProgressSkillsCard from './ProgressSkillsCard.jsx';
import ProgressStudentHero from './ProgressStudentHero.jsx';
import ProgressTermRail from './ProgressTermRail.jsx';
import { useProgressFlags } from './useProgressFlags.js';

const log = debug('ProgressStudentDetail');

/*
 * ProgressStudentDetail — 11.3.2b "Student detail" (Figma 8595:653) + 11.3.2c flag dialog (?modal=flag): preview bar, hero, the profile tabs (Overview,
 * Skills 7, Experience 2, Portfolio 3, Certs 2, About me; only Overview is drawn, so the others are not links) and the two columns (About · Top skills ·
 * Experience · Portfolio | Term card · This term · Badges). Flagging records the student in the session store, closes the dialog and announces it.
 * Props: studentId, data (useInstitutionState()).
 */

const TABS = [
  { label: 'Overview' },
  { label: 'Skills', count: '7' },
  { label: 'Experience', count: '2' },
  { label: 'Portfolio', count: '3' },
  { label: 'Certs', count: '2' },
  { label: 'About me' },
];

const ProgressStudentDetail = ({ studentId, data }) => {
  const detail = getStudentDetail(studentId);
  const row = findStudentRow(studentId);
  const { flagged, flag } = useProgressFlags();
  const isFlagged = flagged.has(studentId) || row?.status === 'flagged';

  useEffect(() => {
    log('mount', { studentId, found: Boolean(detail) });
  }, [studentId, detail]);

  if (!detail) {
    return (
      <div className="flex flex-col gap-[12px] rounded-[22px] border border-solid border-[#e1eae2] bg-white p-[28px]">
        <h1 className="m-0 font-sans text-[24px] leading-[30px] font-semibold text-[#1c2a21]">
          Student not found
        </h1>
        <Link
          to={`${INSTITUTION_BASE}/progress`}
          className="font-sans text-[14px] font-semibold text-[#387440]"
        >
          Back to progress
        </Link>
      </div>
    );
  }

  const openFlag = () => data.update({ modal: 'flag' });
  const closeFlag = () => data.update({ modal: null });
  const confirmFlag = () => {
    log('flag confirmed', studentId);
    flag(studentId);
    closeFlag();
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <ProgressPreviewBar detail={detail} flagged={isFlagged} onFlag={openFlag} />
      <ProgressStudentHero
        detail={detail}
        initials={row?.initials}
        photo={studentId === 'kofi-danso'}
        flagged={isFlagged}
        onFlag={openFlag}
      />
      <nav aria-label="Student sections" className="@container">
        <ul className="m-0 flex list-none items-end gap-[4px] overflow-x-auto border-0 p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((tab, i) => (
            <li
              key={tab.label}
              aria-current={i === 0 ? 'page' : undefined}
              className={
                i === 0
                  ? 'flex shrink-0 items-center gap-[8px] border-0 border-b-[3px] border-solid border-[#387440] px-[14px] pt-[10px] pb-[12px] font-sans text-[15px] leading-[18px] font-semibold text-[#387440]'
                  : 'flex shrink-0 items-center gap-[8px] border-0 border-b-[3px] border-solid border-transparent px-[14px] pt-[10px] pb-[12px] font-sans text-[15px] leading-[18px] font-medium text-[#737373]'
              }
            >
              {tab.label}
              {tab.count ? (
                <span className="rounded-full bg-[#ebf1ec] px-[7px] py-px font-sans text-[11.5px] max-lg:text-[12px] leading-[14px] font-bold text-[#2d5d33]">
                  {tab.count}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
      <TabLayout
        tab="overview"
        left={
          <>
            {detail.about ? <ProgressAboutCard about={detail.about} /> : null}
            {detail.skills.length ? <ProgressSkillsCard skills={detail.skills} /> : null}
            {detail.experience.length ? <ProgressExperienceCard items={detail.experience} /> : null}
            {detail.portfolio.length ? <ProgressPortfolioCard items={detail.portfolio} /> : null}
          </>
        }
        right={<ProgressTermRail detail={detail} />}
      />
      <p role="status" aria-live="polite" className="sr-only">
        {isFlagged ? `${detail.first} is flagged for coaching` : ''}
      </p>
      {data.modal === 'flag' && !isFlagged ? (
        <ProgressFlagDialog first={detail.first} onConfirm={confirmFlag} onCancel={closeFlag} />
      ) : null}
    </div>
  );
};

export default ProgressStudentDetail;
