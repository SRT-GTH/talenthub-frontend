import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { RECORD_DETAIL } from './data/recordsData.js';
import QueueTabs from './QueueTabs.jsx';
import RecordAboutCard from './RecordAboutCard.jsx';
import RecordConfirmDialog from './RecordConfirmDialog.jsx';
import RecordExperienceCard from './RecordExperienceCard.jsx';
import RecordHero from './RecordHero.jsx';
import RecordPortfolioCard from './RecordPortfolioCard.jsx';
import RecordPreviewBar from './RecordPreviewBar.jsx';
import RecordRejectDialog from './RecordRejectDialog.jsx';
import RecordSideRail from './RecordSideRail.jsx';
import RecordSkillsCard from './RecordSkillsCard.jsx';
import { approveRecords, rejectRecord, useRecordsStore } from './useRecordsStore.js';

const log = debug('RecordDetailView');

/*
 * RecordDetailView — "Record detail" (Figma 11.2.3b 8593:575), with the approve dialog (11.2.3c) and the reject dialog (11.2.3d) over it.
 * URL: /institution/records/:recordId?modal=approve|reject. Approving or rejecting updates the in-memory queue and returns to /institution/records.
 * ⚠️ ASSUMPTIONS: the profile tabs scroll to the matching card (only the Overview is drawn); records other than Abena’s show the same sample profile body under their own name;
 * an unknown record id shows the first record.
 * Props: data (useInstitutionState()), recordId.
 */

const TAB_TARGETS = {
  skills: 'record-skills',
  experience: 'record-experience',
  portfolio: 'record-portfolio',
  certs: 'record-portfolio',
  about: 'record-about',
};

const RecordDetailView = ({ data, recordId }) => {
  const navigate = useNavigate();
  const { records } = useRecordsStore();
  const [tab, setTab] = useState('overview');
  const record = records.find((r) => r.id === recordId) ?? records[0];
  const detail = RECORD_DETAIL;
  const { modal, update } = data;

  useEffect(() => {
    log('mount', { id: record.id, modal });
  }, [record.id, modal]);

  const close = () => update({ modal: null }, { replace: true });

  const approve = () => {
    approveRecords([record.id]);
    log('approved', record.id);
    navigate('/institution/records');
  };

  const reject = ({ reason, note }) => {
    rejectRecord(record.id, { reason, note });
    log('rejected', record.id);
    navigate('/institution/records');
  };

  const onTab = (id) => {
    setTab(id);
    const target = TAB_TARGETS[id];
    if (target)
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openApprove = () => update({ modal: 'approve' });
  const openReject = () => update({ modal: 'reject' });

  return (
    <div className="flex flex-col gap-[20px] pt-[8px] font-sans">
      <RecordPreviewBar
        title={`${record.student} · ${record.title}`}
        sentence={`Submitted ${record.submittedOn ?? record.askedOn}. Check it against your school records. Approved records show “Verified by Savannah Hills SHS” on ${record.pronounPossessive} profile.`}
        onReject={openReject}
        onApprove={openApprove}
      />
      <RecordHero detail={detail} record={record} onReject={openReject} onApprove={openApprove} />
      <QueueTabs
        label="Profile sections"
        tone="green"
        tabs={detail.tabs}
        active={tab}
        onSelect={onTab}
      />
      <div className="grid grid-cols-1 gap-[24px] xl:grid-cols-[minmax(0,880fr)_minmax(0,425fr)]">
        <div className="flex min-w-0 flex-col gap-[20px]">
          <RecordAboutCard detail={detail} />
          <RecordSkillsCard detail={detail} />
          <RecordExperienceCard detail={detail} />
          <RecordPortfolioCard detail={detail} />
        </div>
        <RecordSideRail detail={detail} onApprove={openApprove} />
      </div>
      {modal === 'approve' ? (
        <RecordConfirmDialog
          title="Approve this record?"
          body={`${record.possessive} ${record.title} will show “Verified by Savannah Hills SHS”. ${record.pronoun} can share them with scholarship providers. You can revoke it later if you find a mistake.`}
          confirmLabel="Approve record"
          onConfirm={approve}
          onCancel={close}
        />
      ) : null}
      {modal === 'reject' ? (
        <RecordRejectDialog
          firstName={record.student.split(' ')[0]}
          pronounPossessive={record.pronounPossessive}
          onConfirm={reject}
          onCancel={close}
        />
      ) : null}
    </div>
  );
};

export default RecordDetailView;
