import { useEffect, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { classNames } from '../../../../utils/classNames.js';
import { institutionStudent, apiMessage } from '../../../../services/institutionPortal.api.js';
import { useInstitutionSession } from '../useInstitutionSession.js';
import InstitutionEditStudentDialog from './InstitutionEditStudentDialog.jsx';
import InstitutionRecordBar from './InstitutionRecordBar.jsx';
import InstitutionRecordHero from './InstitutionRecordHero.jsx';
import InstitutionRecordOverview from './InstitutionRecordOverview.jsx';
import InstitutionRecordRail from './InstitutionRecordRail.jsx';
import { barText, firstNameOf, recordFor } from './recordModel.js';

const log = debug('InstitutionStudentRecord');

/*
 * InstitutionStudentRecord — the student record page body (Figma 11.2.2j 8744:433480, /institution/students/:studentId): dark bar · hero · tabs · Overview (left column + right rail).
 * Live: GET /api/institution/students/:id (the school's details, consent, and the student's GTH profile summary when it is linked and, under 18, the guardian
 * agreed). Tabs list only the sections the profile has and scroll to their card. "Edit record" opens the edit dialog (PATCH /students/:id).
 * Props: student (a roster row), onAction('transfer' | 'remove') for the rail menu.
 */

const ANCHORS = {
  skills: 'record-skills',
  experience: 'record-experience',
  portfolio: 'record-portfolio',
  about: 'record-about',
  certs: 'record-card',
};

const InstitutionStudentRecord = ({ student: base, onAction }) => {
  const session = useInstitutionSession();
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const student = { ...base, firstName: firstNameOf(base) };
  const record = recordFor(base, detail, session.institution);
  const [tab, setTab] = useState('overview');
  const messageTo = '/institution/messages/new';

  useEffect(() => {
    let live = true;
    setDetail(null);
    institutionStudent(base.id)
      .then((d) => live && setDetail(d))
      .catch((err) => live && setError(apiMessage(err)));
    log('mount', { id: base.id });
    return () => {
      live = false;
    };
  }, [base.id]);

  const select = (id) => {
    setTab(id);
    const target = ANCHORS[id] && document.getElementById(ANCHORS[id]);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    log('tab', id);
  };

  return (
    <div className="flex min-w-0 flex-col gap-[20px]">
      <InstitutionRecordBar
        title={`${record.name} · student record`}
        text={barText(base, record)}
        firstName={student.firstName}
        messageTo={messageTo}
        backTo="/institution/students"
        onEdit={() => setEditing(true)}
      />
      {error ? (
        <p role="alert" className="m-0 font-sans text-[14px] text-danger">
          {error}
        </p>
      ) : null}
      <InstitutionRecordHero
        record={record}
        student={student}
        messageTo={messageTo}
        onEdit={() => setEditing(true)}
      />
      <div role="tablist" aria-label="Student record" className="flex flex-wrap gap-[4px]">
        {record.tabs.map((t) => {
          const on = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => select(t.id)}
              className={classNames(
                'inline-flex min-h-[40px] cursor-pointer items-center gap-[8px] border-0 bg-transparent px-[14px] pt-[10px] pb-[12px] font-sans text-[15px] leading-[18px] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#387440]',
                on
                  ? 'border-b-2 border-solid border-[#387440] font-semibold text-[#387440]'
                  : 'font-medium text-[#737373]'
              )}
            >
              {t.label}
              {t.count ? (
                <span className="inline-flex h-[16px] items-center rounded-full bg-[#ebf1ec] px-[7px] text-[11.5px] leading-[14px] font-bold text-[#2d5d33]">
                  {t.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      <div className="grid gap-[24px] xl:grid-cols-[minmax(0,880fr)_minmax(0,425fr)]">
        <InstitutionRecordOverview record={record} />
        <InstitutionRecordRail
          record={record}
          firstName={student.firstName}
          messageTo={messageTo}
          onAction={onAction}
        />
      </div>
      {editing ? (
        <InstitutionEditStudentDialog
          student={base}
          detail={detail}
          onClose={() => setEditing(false)}
          onSaved={(d) => d && setDetail(d)}
        />
      ) : null}
    </div>
  );
};

export default InstitutionStudentRecord;
