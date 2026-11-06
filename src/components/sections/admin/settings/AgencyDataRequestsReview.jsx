import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { classNames } from '../../../../utils/classNames.js';
import { Select, TextInput } from '../../../ui/form';
import { GroupCard, TextAction } from '../../talentSettings/SettingsBUi.jsx';
import AdminConfirmDialog from '../ui/AdminConfirmDialog.jsx';
import AdminLoadNotice from '../AdminLoadNotice.jsx';
import { useAdminData } from '../useAdminData.js';
import { adminError, shortDate } from '../../../../services/admin.api.js';
import { adminDecideDataRequest, adminListDataRequests } from '../../../../services/agency.api.js';

const log = debug('AgencyDataRequestsReview');

/*
 * AgencyDataRequestsReview — Settings › Government agencies › "Data requests to review" (Super / Senior Admin).
 * GET /admin/agencies/data-requests; each open request shows its agency, purpose, scope, the answers and appeals added, and whose step it is.
 * Review → POST /admin/agencies/data-requests/:id/decide {step, decision, note}: the programme manager step first (approve / reject), then the
 * data protection officer step (approve / reject / ask for detail). The server refuses a DPO decision from the person who approved as
 * programme manager, and an appeal from whoever rejected it; the error is shown in the dialog.
 * Props: canEdit, toast(title, text).
 */

const DECISIONS = {
  pm: ['Approve', 'Reject'],
  dpo: ['Approve', 'Reject', 'Ask for more detail'],
};
const DECISION_KEY = {
  Approve: 'approve',
  Reject: 'reject',
  'Ask for more detail': 'needs-detail',
};

const stepOf = (r) => {
  const pm = (r.steps || []).find((s) => s.key === 'pm') || {};
  return pm.status === 'approved' ? 'dpo' : 'pm';
};

const AgencyDataRequestsReview = ({ canEdit, toast }) => {
  const list = useAdminData(() => adminListDataRequests(), []);
  const [dialog, setDialog] = useState(null);
  const [decision, setDecision] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const items = (list.data?.items ?? []).filter((r) =>
    ['pending', 'needs-detail'].includes(r.status)
  );
  const recent = (list.data?.items ?? [])
    .filter((r) => !['pending', 'needs-detail'].includes(r.status))
    .slice(0, 5);

  const open = (r) => {
    setDialog({ row: r, step: stepOf(r) });
    setDecision('');
    setNote('');
    setError('');
  };
  const decide = async () => {
    if (!decision || note.trim().length < 3) {
      setError('Choose a decision and write a short note (the agency sees it).');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await adminDecideDataRequest(dialog.row.id, {
        step: dialog.step,
        decision: DECISION_KEY[decision],
        note: note.trim(),
      });
      log('decided', dialog.row.id, dialog.step, decision, res.status);
      toast(
        'Decision recorded',
        `${dialog.row.title}: ${res.status === 'pending' ? 'passed to the DPO' : res.status}.`
      );
      setDialog(null);
      list.reload();
    } catch (err) {
      setError(adminError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <GroupCard title={`Data requests to review · ${items.length}`} gap="gap-0">
        <AdminLoadNotice
          loading={list.loading}
          error={list.error}
          status={list.status}
          onRetry={list.reload}
        >
          {!items.length ? (
            <p className="m-0 py-[14px] font-sans text-[14px] text-[#595959]">
              No data requests are waiting. Agencies send them from their portal’s Data requests
              page.
            </p>
          ) : null}
          {items.map((r, i) => {
            const step = stepOf(r);
            return (
              <div
                key={r.id}
                className={classNames(
                  'flex w-full flex-wrap items-start gap-[14px] py-[14px]',
                  i > 0 && 'border-t border-[rgba(28,42,33,0.08)]'
                )}
              >
                <div className="flex min-w-[240px] flex-1 flex-col gap-[3px]">
                  <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                    {r.title}
                    <span className="font-normal text-[#595959]"> · {r.agencyName}</span>
                  </p>
                  <p className="m-0 font-sans text-[13px] leading-[18px] text-[#595959]">
                    {r.categoryLabel} · {r.regionsLabel} · {r.range} · sent {shortDate(r.createdAt)}{' '}
                    by {r.createdBy}
                    {r.appealOpen ? ' · appeal' : ''}
                  </p>
                  <p className="m-0 font-sans text-[13px] leading-[18px] text-[#1c2a21]">
                    Why: {r.why}
                  </p>
                  {r.details?.map((d) => (
                    <p
                      key={d.at}
                      className="m-0 font-sans text-[13px] leading-[18px] text-[#1c2a21]"
                    >
                      Detail added {shortDate(d.at)}: {d.text}
                    </p>
                  ))}
                  {r.appeals?.map((a) => (
                    <p
                      key={a.at}
                      className="m-0 font-sans text-[13px] leading-[18px] text-[#1c2a21]"
                    >
                      Appeal {shortDate(a.at)}: {a.why} · {a.detail}
                    </p>
                  ))}
                  <p className="m-0 font-sans text-[12px] leading-[16px] font-semibold text-[#967014]">
                    {r.status === 'needs-detail'
                      ? 'Waiting for the agency to add detail'
                      : step === 'pm'
                        ? 'Programme manager step'
                        : `DPO step · programme manager: ${(r.steps.find((s) => s.key === 'pm') || {}).by || '—'}`}
                  </p>
                </div>
                {canEdit && r.status === 'pending' ? (
                  <TextAction tone="green" onClick={() => open(r)}>
                    Review
                  </TextAction>
                ) : null}
              </div>
            );
          })}
        </AdminLoadNotice>
      </GroupCard>

      {recent.length ? (
        <GroupCard title="Recently decided data requests" gap="gap-0">
          {recent.map((r, i) => (
            <p
              key={r.id}
              className={classNames(
                'm-0 w-full py-[10px] font-sans text-[13px] leading-[18px] text-[#595959]',
                i > 0 && 'border-t border-[rgba(28,42,33,0.08)]'
              )}
            >
              <strong className="text-[#1c2a21]">{r.title}</strong> · {r.agencyName} · {r.status}
              {r.accessEndsAt ? ` · access until ${shortDate(r.accessEndsAt)}` : ''}
            </p>
          ))}
        </GroupCard>
      ) : null}

      {dialog ? (
        <AdminConfirmDialog
          title={`${dialog.step === 'pm' ? 'Programme manager' : 'Data protection officer'} review: ${dialog.row.title}`}
          body={`${dialog.row.agencyName} · ${dialog.row.categoryLabel} · ${dialog.row.regionsLabel}. ${
            dialog.step === 'dpo'
              ? 'The DPO step must be decided by someone other than the programme manager.'
              : 'If you approve, the request goes to the data protection officer.'
          }`}
          primary={{ label: busy ? 'Saving…' : 'Record decision', arrow: true }}
          secondary="Cancel"
          onPrimary={() => !busy && decide()}
          onClose={() => setDialog(null)}
        >
          <Select
            label="Decision"
            required
            options={DECISIONS[dialog.step]}
            value={decision}
            onChange={setDecision}
          />
          <TextInput
            label="Note to the agency"
            required
            placeholder={
              decision === 'Reject' ? 'Why it can’t be approved' : 'e.g. Inside MoU clause 4.2'
            }
            value={note}
            onChange={(e) => setNote(e.target.value)}
            error={error || undefined}
          />
        </AdminConfirmDialog>
      ) : null}
    </>
  );
};

export default AgencyDataRequestsReview;
