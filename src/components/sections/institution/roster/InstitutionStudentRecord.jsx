import { useEffect, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { classNames } from '../../../../utils/classNames.js';
import InstitutionRecordBar from './InstitutionRecordBar.jsx';
import InstitutionRecordHero from './InstitutionRecordHero.jsx';
import InstitutionRecordOverview from './InstitutionRecordOverview.jsx';
import InstitutionRecordRail from './InstitutionRecordRail.jsx';
import { barText, firstNameOf, recordFor } from './recordModel.js';

const log = debug('InstitutionStudentRecord');

/*
 * InstitutionStudentRecord — the student record page body (Figma 11.2.2j 8744:433480, /institution/students/:studentId): dark bar · hero · tabs · Overview (left column + right rail).
 * Tabs (Overview · Skills 7 · Experience 2 · Portfolio 3 · Certs 2 · About me; 15/18, current 600 #387440 with a 2px underline, count pills #ebf1ec): Figma draws the Overview only, so
 * every tab keeps that one page and scrolls to its card (Skills → Top skills, Experience, Portfolio, About me → About, Certs → Record) ⚠️ ASSUMPTION.
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
  const student = { ...base, firstName: firstNameOf(base) };
  const record = recordFor(base);
  const [tab, setTab] = useState('overview');
  const messageTo = '/institution/messages/new';

  useEffect(() => {
    log('mount', { id: base.id });
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
      />
      <InstitutionRecordHero record={record} student={student} messageTo={messageTo} />
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
    </div>
  );
};

export default InstitutionStudentRecord;
