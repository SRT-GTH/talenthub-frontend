import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import {
  apiMessage,
  approveRecord,
  askRecord,
  getRecord,
  openApiFile,
  recordFile,
  rejectRecord,
} from '../../../../services/institutionPortal.api.js';
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
import { buildRecordDetail } from './recordDetail.js';

const log = debug('RecordDetailView');

/*
 * RecordDetailView — "Record detail" (Figma 11.2.3b 8593:575), with the approve dialog (11.2.3c), the reject dialog (11.2.3d) and the "ask for more
 * information" dialog (not drawn; same card as reject) over it. Live: GET /api/institution/records/:id (the record, its checks and file, and the
 * student's GTH profile as the school sees it in Progress); approve / reject / ask post to the record and return to the queue. A decided record
 * shows its decision instead of the actions.
 * URL: /institution/records/:recordId?modal=approve|reject|ask.
 * Props: data (useInstitutionState()), recordId.
 */

const TAB_TARGETS = {
  skills: 'record-skills',
  experience: 'record-experience',
  portfolio: 'record-portfolio',
  about: 'record-about',
};

const RecordDetailView = ({ data, recordId }) => {
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState('overview');
  const { modal, update } = data;

  const load = useCallback(async () => {
    setError('');
    try {
      setRecord(await getRecord(recordId));
    } catch (err) {
      setError(apiMessage(err));
    }
  }, [recordId]);

  useEffect(() => {
    log('mount', { recordId });
    load();
  }, [load, recordId]);

  const close = () => update({ modal: null }, { replace: true });

  const act = async (fn, message) => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await fn();
      navigate('/institution/records', { state: { announce: message } });
    } catch (err) {
      setError(apiMessage(err));
      close();
    } finally {
      setBusy(false);
    }
  };

  const openFile = async () => {
    try {
      openApiFile(await recordFile(record.id));
    } catch (err) {
      setError(apiMessage(err));
    }
  };

  if (error && !record) {
    return (
      <p role="alert" className="m-0 font-sans text-[14px] leading-[20px] text-[#902b20]">
        {error}
      </p>
    );
  }
  if (!record)
    return <p className="m-0 font-sans text-[14px] text-[#737373]">Loading the record…</p>;

  const detail = buildRecordDetail(record);
  const first = record.student.split(' ')[0];
  const school = record.profile?.school || 'your school';
  const onTab = (id) => {
    setTab(id);
    const target = TAB_TARGETS[id];
    if (target)
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const openApprove = () => update({ modal: 'approve' });
  const openReject = () => update({ modal: 'reject' });
  const openAsk = () => update({ modal: 'ask' });
  const decided =
    record.status === 'approved'
      ? `Approved ${record.decidedOn}${record.decidedByName ? ` by ${record.decidedByName}` : ''}.`
      : record.status === 'rejected'
        ? `Rejected ${record.decidedOn}${record.decidedByName ? ` by ${record.decidedByName}` : ''}: ${record.reason}${record.note ? ` · “${record.note}”` : ''}.`
        : record.status === 'needs-info'
          ? `You asked ${first} on ${record.askedOn}: “${record.askNote}”. You can still decide now.`
          : null;

  return (
    <div className="flex flex-col gap-[20px] pt-[8px] font-sans">
      <RecordPreviewBar
        title={`${record.student} · ${record.title}`}
        sentence={
          decided ??
          `Submitted ${record.submittedOn}. Check it against your school records. Approved records show “Verified by ${school}” on ${first}’s profile.`
        }
        open={detail.open}
        onReject={openReject}
        onApprove={openApprove}
      />
      {error ? (
        <p role="alert" className="m-0 text-[14px] leading-[20px] text-[#902b20]">
          {error}
        </p>
      ) : null}
      <RecordHero detail={detail} record={record} onReject={openReject} onApprove={openApprove} />
      {detail.tabs.length > 1 ? (
        <QueueTabs
          label="Profile sections"
          tone="green"
          tabs={detail.tabs}
          active={tab}
          onSelect={onTab}
        />
      ) : null}
      <div className="grid grid-cols-1 gap-[24px] xl:grid-cols-[minmax(0,880fr)_minmax(0,425fr)]">
        <div className="flex min-w-0 flex-col gap-[20px]">
          {detail.about || detail.vibe.length ? <RecordAboutCard detail={detail} /> : null}
          {detail.skills.length ? <RecordSkillsCard detail={detail} /> : null}
          {detail.experience.length ? <RecordExperienceCard detail={detail} /> : null}
          {detail.portfolio.length ? <RecordPortfolioCard detail={detail} /> : null}
          {!detail.onGth ? (
            <p className="m-0 rounded-[20px] border border-solid border-[#e6e6e6] bg-white p-[24px] text-[14px] leading-[20px] text-[#595959]">
              {first}’s GTH profile isn’t visible to your staff yet. You can still check the record
              itself.
            </p>
          ) : null}
        </div>
        <RecordSideRail
          detail={detail}
          record={record}
          onApprove={openApprove}
          onAsk={openAsk}
          onOpenFile={openFile}
          onOpenRecord={(id) => navigate(`/institution/records/${id}`)}
        />
      </div>
      {modal === 'approve' && detail.open ? (
        <RecordConfirmDialog
          title="Approve this record?"
          body={`${first}’s ${record.title} will show “Verified by ${school}”. ${first} can share it with scholarship providers. Your approval is logged under your name.`}
          confirmLabel={busy ? 'Approving…' : 'Approve record'}
          onConfirm={() =>
            act(() => approveRecord(record.id), `Approved ${first}’s ${record.title}.`)
          }
          onCancel={close}
        />
      ) : null}
      {modal === 'reject' && detail.open ? (
        <RecordRejectDialog
          firstName={first}
          busy={busy}
          onConfirm={({ reason, note }) =>
            act(
              () => rejectRecord(record.id, { reason, note }),
              `Rejected ${first}’s ${record.title}.`
            )
          }
          onCancel={close}
        />
      ) : null}
      {modal === 'ask' && record.status === 'pending' ? (
        <RecordRejectDialog
          mode="ask"
          firstName={first}
          busy={busy}
          onConfirm={({ note }) =>
            act(() => askRecord(record.id, note), `Asked ${first} for more information.`)
          }
          onCancel={close}
        />
      ) : null}
    </div>
  );
};

export default RecordDetailView;
