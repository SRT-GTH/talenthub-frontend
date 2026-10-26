import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import AdminLoadNotice from '../../components/sections/admin/AdminLoadNotice.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import AdminQueueView from '../../components/sections/admin/queue/AdminQueueView.jsx';
import AdminConfirmDialog from '../../components/sections/admin/ui/AdminConfirmDialog.jsx';
import { useAdminData, useAdminToast } from '../../components/sections/admin/useAdminData.js';
import VerificationReviewView from '../../components/sections/admin/verification/VerificationReviewView.jsx';
import {
  ASK_TOPICS,
  REJECT_REASONS,
  VERIF_CHIPS,
  VERIF_TABS,
  reviewOf,
  rowOf,
} from '../../components/sections/admin/verification/verificationModel.js';
import { Select, Textarea, TextInput } from '../../components/ui/form';
import {
  adminError,
  verifAsk,
  verifDecide,
  verifGet,
  verifQueue,
} from '../../services/admin.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('AdminVerificationPage');

/*
 * AdminVerificationPage — /admin/verification/* (Figma 7.6) on real data from /api/admin/verification (Senior and Super Admin):
 *   /admin/verification                 queue · ?tab=all|kyb|affiliation · ?chip=waiting|decided (oldest first)
 *   /admin/verification/:id?kind=…      review · ?modal=approve | info (KYB only) | reject
 * Two kinds exist today, both on the recruiter's record: KYB documents, and a request to post under an organisation's name.
 * Approve / reject go through the recruiter-affiliation actions (the recruiter is notified, the audit log records it);
 * "Ask for more info" sends the KYB back to the recruiter with your message. Institution accreditation, agency MoUs,
 * data requests and appeals have no submissions yet, so they don't appear.
 */

const Queue = ({ data }) => {
  const tab = data.tab ?? 'all';
  const chip = data.params.get('chip') ?? 'waiting';
  const q = useAdminData(() => verifQueue({ kind: tab, state: chip }), [tab, chip]);
  if (q.loading || q.error) {
    return (
      <div className="flex flex-col gap-[16px] pt-[4px]">
        <h1 className="m-0 font-sans text-[34px] leading-[41px] font-semibold text-[#1c2a21]">
          Verification
        </h1>
        <AdminLoadNotice loading={q.loading} error={q.error} status={q.status} onRetry={q.reload} />
      </div>
    );
  }
  const d = q.data;
  const rows = d.rows.map(rowOf);
  const config = {
    title: 'Verification',
    sticker: `${d.counts.all} waiting`,
    subtitle:
      'Recruiter KYB documents and requests to post under an organisation’s name. Target: decide within 2 working days.',
    tabs: VERIF_TABS.map((t) => ({ ...t, count: String(d.counts[t.id] ?? 0) })),
    tabTone: 'ink',
    defaultTab: tab,
    chips: VERIF_CHIPS,
    defaultChip: chip,
    defaultView: 'list',
    sort: 'Oldest first',
    action: 'Refresh',
    banner:
      chip === 'waiting'
        ? d.overdue
          ? `${d.overdue} ${d.overdue === 1 ? 'is' : 'are'} past the 2-working-day target. Oldest first.`
          : 'Nothing is past the 2-working-day target. Oldest first.'
        : 'Decided in the last 90 days.',
    rows,
    empty: rows.length
      ? null
      : {
          title: chip === 'waiting' ? 'Nothing waiting' : 'Nothing decided yet',
          text:
            chip === 'waiting'
              ? 'New KYB submissions and affiliation requests show up here.'
              : 'Approved and rejected items from the last 90 days show up here.',
          steps: [
            {
              id: 's1',
              icon: 'user',
              title: 'Recruiter accounts',
              meta: 'Search accounts',
              to: '/admin/accounts',
            },
            {
              id: 's2',
              icon: 'spark',
              title: 'Decided items',
              meta: 'Last 90 days',
              to: '/admin/verification?chip=decided',
            },
            {
              id: 's3',
              icon: 'plus',
              title: 'Audit log',
              meta: 'KYB decisions',
              to: '/admin/audit-log?q=KYB',
            },
          ],
          primary: 'Back to home',
          onPrimary: '/admin',
          secondary: 'Audit log',
          secondaryTo: '/admin/audit-log',
        },
  };
  return <AdminQueueView config={config} data={data} onAction={q.reload} />;
};

const DecisionDialog = ({
  title,
  body,
  primary,
  tone,
  selectLabel,
  options,
  messageLabel,
  placeholder,
  busy,
  error,
  onSubmit,
  onClose,
}) => {
  const [choice, setChoice] = useState(options?.[0] ?? '');
  const [text, setText] = useState('');
  return (
    <AdminConfirmDialog
      title={title}
      body={body}
      primary={{ label: busy ? 'Saving…' : primary, tone, arrow: tone !== 'red' }}
      secondary="Cancel"
      onPrimary={() => !busy && onSubmit(choice, text.trim())}
      onClose={onClose}
    >
      <div className="flex flex-col gap-[16px]">
        {options ? (
          <Select
            label={selectLabel}
            required
            options={options}
            value={choice}
            onChange={setChoice}
          />
        ) : null}
        {messageLabel ? (
          <Textarea
            label={messageLabel}
            value={text}
            placeholder={placeholder}
            onChange={(e) => setText(e.target.value)}
          />
        ) : null}
        {error ? (
          <p role="alert" className="m-0 font-sans text-[14px] text-[#b42318]">
            {error}
          </p>
        ) : null}
      </div>
    </AdminConfirmDialog>
  );
};

const Review = ({ data, id, kind }) => {
  const navigate = useNavigate();
  const q = useAdminData(() => verifGet(id, kind), [id, kind]);
  const [toastEl, toast] = useAdminToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const modal = data.modal;
  const close = () => {
    setError('');
    data.update({ modal: null });
  };
  const d = q.data;

  const run = async (fn, done) => {
    setBusy(true);
    setError('');
    try {
      await fn();
      toast(done);
      data.update({ modal: null });
      // The audit entry is written just after the decision: give it a moment so History shows it.
      await new Promise((r) => setTimeout(r, 1200));
      q.reload();
    } catch (e) {
      setError(e?.response ? adminError(e) : e.message);
    } finally {
      setBusy(false);
    }
  };

  if (q.loading || q.error || !d) {
    return (
      <div className="flex flex-col gap-[16px] pt-[4px]">
        <button
          type="button"
          onClick={() => navigate('/admin/verification')}
          className="w-fit cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] font-semibold text-[#387440] underline"
        >
          ← Verification queue
        </button>
        <AdminLoadNotice loading={q.loading} error={q.error} status={q.status} onRetry={q.reload} />
      </div>
    );
  }

  const isKyb = d.kind === 'kyb';
  const who = d.recruiter.name || 'the recruiter';
  const decide = (id2) => data.update({ modal: id2 === 'primary' ? 'approve' : id2 });

  return (
    <>
      <button
        type="button"
        onClick={() => navigate('/admin/verification')}
        className="mb-[8px] w-fit cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] font-semibold text-[#387440] underline"
      >
        ← Verification queue
      </button>
      <VerificationReviewView review={reviewOf(d)} onDecide={decide} />
      {toastEl}
      {modal === 'approve' && !d.decision ? (
        <DecisionDialog
          title={
            isKyb ? `Approve ${d.company.name || 'this business'}?` : `Approve ${who}’s request?`
          }
          body={
            isKyb
              ? `${who} gets the verified badge and can publish job posts. They’re told in the app.`
              : `${who} can post jobs under ${d.affiliation.orgName || 'the organisation'}’s name. They’re told in the app.`
          }
          primary="Approve"
          tone="green"
          messageLabel={isKyb ? null : 'Note (optional)'}
          placeholder="Shown to the recruiter"
          busy={busy}
          error={error}
          onSubmit={(_, note) =>
            run(
              () => verifDecide(d.id, { kind: d.kind, decision: 'approve', reason: note }),
              'Approved'
            )
          }
          onClose={close}
        />
      ) : null}
      {modal === 'info' && isKyb && !d.decision ? (
        <DecisionDialog
          title="Ask for more information?"
          body={`The KYB goes back to ${who} to upload again; the documents already sent stay. They see exactly what you write.`}
          primary="Send request"
          tone="green"
          selectLabel="What’s needed"
          options={ASK_TOPICS}
          messageLabel="Message to the recruiter"
          placeholder="e.g. Please upload a clearer copy of your TIN certificate (PDF)."
          busy={busy}
          error={error}
          onSubmit={(topic, message) =>
            message.length < 10
              ? setError('Write a message of at least 10 characters.')
              : run(() => verifAsk(d.id, { topic, message }), 'Request sent')
          }
          onClose={close}
        />
      ) : null}
      {modal === 'reject' && !d.decision ? (
        <DecisionDialog
          title={isKyb ? 'Reject this KYB?' : 'Reject this request?'}
          body={`${who} sees your reason. The decision is logged under your name.`}
          primary="Reject"
          tone="red"
          selectLabel="Reason"
          options={REJECT_REASONS[d.kind]}
          messageLabel="Note to the recruiter"
          placeholder="Say what they can do next"
          busy={busy}
          error={error}
          onSubmit={(reason, note) => {
            const full = [reason === 'Other' ? null : reason, note].filter(Boolean).join(': ');
            if (full.length < 10) return setError('Give a reason of at least 10 characters.');
            return run(
              () => verifDecide(d.id, { kind: d.kind, decision: 'reject', reason: full }),
              'Rejected'
            );
          }}
          onClose={close}
        />
      ) : null}
    </>
  );
};

const AdminVerificationPage = () => {
  const data = useAdminState();
  const { pathname, search } = useLocation();
  const id = pathname.replace(/^\/admin\/verification\/?/, '').split('/')[0];
  const kind = new URLSearchParams(search).get('kind') || undefined;

  useEffect(() => {
    log('mount', { id, kind, modal: data.modal });
  }, [id, kind, data.modal]);

  return (
    <AdminFrame data={data} title="Verification">
      {id ? <Review data={data} id={id} kind={kind} /> : <Queue data={data} />}
    </AdminFrame>
  );
};

export default AdminVerificationPage;
