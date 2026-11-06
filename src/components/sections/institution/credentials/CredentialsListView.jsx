import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import {
  apiMessage,
  approveCredentialBatch,
  bulkIssueCredentials,
} from '../../../../services/institutionPortal.api.js';
import EmptyState from '../../publicData/ui/EmptyState.jsx';
import InstitutionButton from '../InstitutionButton.jsx';
import QueueBanner from '../records/QueueBanner.jsx';
import QueueHeader from '../records/QueueHeader.jsx';
import QueuePill from '../records/QueuePill.jsx';
import QueueRow from '../records/QueueRow.jsx';
import QueueTabs from '../records/QueueTabs.jsx';
import QueueToolbar from '../records/QueueToolbar.jsx';
import { RecordsIconCheck11, RecordsIconEye13 } from '../records/recordsIcons.jsx';
import CredentialBulkDialog from './CredentialBulkDialog.jsx';
import CredentialIssueDialog from './CredentialIssueDialog.jsx';
import CredentialToast from './CredentialToast.jsx';
import { SORT_OPTIONS, TYPE_CHIPS } from './data/credentialsData.js';
import {
  dismissToast,
  resetForm,
  setForm,
  showToast,
  useCredentialOptions,
  useCredentialsList,
  useCredentialsStore,
} from './useCredentialsStore.js';

const log = debug('CredentialsListView');

/*
 * CredentialsListView — "Issued list" (Figma 11.2.4a 8593:388444) and the dialogs drawn over it. Live: GET /api/institution/credentials.
 *   /institution/credentials            ?tab=valid|revoked|all|drafts (default all) · ?filter=completion|awards · ?sort=oldest|newest
 *   /institution/credentials/new        11.2.4b issue form   ?mode=class = 11.2.4h bulk issue (POST /credentials/bulk)
 * Banners: revocations and bulk batches waiting for a second staff member (a batch someone else asked for can be released here).
 * Every row opens the credential page (/credentials/:id), where it can be corrected, revoked or the revocation approved.
 * Props: data (useInstitutionState()), isNew (route /credentials/new).
 */

const VIEW =
  'inline-flex h-[25px] items-center rounded-full border border-solid border-[#1c2a21]/12 bg-[#387440] px-[10px] text-[12.5px] leading-[15px] font-bold text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const CredentialsListView = ({ data, isNew }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { form, toast } = useCredentialsStore();
  const { params, modal, update } = data;
  const [announce, setAnnounce] = useState(location.state?.announce ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const tab = ['valid', 'revoked', 'drafts'].includes(data.tab) ? data.tab : 'all';
  const chip = ['completion', 'awards'].includes(data.filter) ? data.filter : 'all';
  const sort = params.get('sort') === 'oldest' ? 'oldest' : 'newest';
  const bulkMode = isNew && params.get('mode') === 'class';
  const { data: list, error: loadError, reload } = useCredentialsList({ tab, filter: chip, sort });
  const { data: options } = useCredentialOptions();

  useEffect(() => {
    log('mount', { tab, chip, isNew, modal });
  }, [tab, chip, isNew, modal]);

  useEffect(() => {
    if (location.state?.announce) showToast(location.state.announce);
  }, [location.state]);

  const counts = list?.counts ?? {
    valid: 0,
    revoked: 0,
    all: 0,
    drafts: 0,
    completion: 0,
    awards: 0,
  };
  const setQuery = (patch) => update({ ...patch, modal: null }, { replace: true });
  const toList = () => navigate('/institution/credentials');

  const tabs = [
    { id: 'valid', label: 'Valid', count: String(counts.valid) },
    { id: 'revoked', label: 'Revoked', count: String(counts.revoked) },
    { id: 'all', label: 'All', count: String(counts.all) },
    { id: 'drafts', label: 'Waiting', count: String(counts.drafts) },
  ];
  const chips = TYPE_CHIPS.map((c) => ({
    ...c,
    count: String(c.id === 'all' ? counts.all : counts[c.id]),
  }));

  const renderRow = (c) => {
    const href = `/institution/credentials/${c.id}`;
    const kind = (
      <QueuePill icon={<RecordsIconCheck11 className="size-[11px]" />}>{c.kindLabel}</QueuePill>
    );
    const off = c.status === 'revoked' || c.status === 'revoking';
    const badge = { valid: 'Valid', draft: 'Waiting', revoking: 'Revoking', revoked: 'Revoked' }[
      c.status
    ];
    return (
      <QueueRow
        key={c.id}
        initials={c.initials}
        name={c.student}
        badge={c.corrected ? `${badge} · corrected` : badge}
        sub={c.sub}
        muted={off}
        href={href}
        pills={
          <span className={`flex items-center gap-[6px] ${off ? 'opacity-60' : ''}`}>
            {c.status === 'revoking' ? (
              <QueuePill className="!text-[12.5px] !leading-[15px] !font-bold">
                1 of 2 approved
              </QueuePill>
            ) : (
              <QueuePill tone="amber" icon={<RecordsIconEye13 className="size-[13px]" />}>
                {c.issuedLabel}
              </QueuePill>
            )}
            {kind}
          </span>
        }
        action={
          c.status === 'revoking' && c.mineToApprove ? (
            <InstitutionButton
              to={`${href}?modal=revoke`}
              size="sm"
              className="!h-[40px] !rounded-[10px] !px-[16px] !text-[16px]"
              aria-label={`Review ${c.student}’s revocation`}
            >
              Review
            </InstitutionButton>
          ) : (
            <Link to={href} aria-label={`View ${c.student}’s credential`} className={VIEW}>
              View
            </Link>
          )
        }
      />
    );
  };

  const releaseBatch = async (b) => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await approveCredentialBatch(b.id);
      showToast(`Released ${res.issued} certificates · ${b.label}`);
      reload();
    } catch (err) {
      setError(apiMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const confirmBulk = async (payload) => {
    setBusy(true);
    setError('');
    try {
      const res = await bulkIssueCredentials(payload);
      showToast(
        res.waiting
          ? `${res.waiting} certificates prepared · they go out when a second staff member approves`
          : `Issued ${res.issued} certificates · ${res.linked} on GTH now`
      );
      setAnnounce('Bulk issue done.');
      toList();
      reload();
    } catch (err) {
      setError(apiMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const waiting = list?.waiting ?? { revocations: [], batches: [] };
  const items = list?.items ?? [];

  return (
    <div className="flex flex-col gap-[24px] pt-[4px] font-sans">
      <QueueHeader
        title="Credentials"
        count={`${counts.all} issued`}
        sentence="Signed certificates your students can share. Anyone can check them at gth.com/verify."
      />
      <div className="flex flex-col gap-[18px]">
        <QueueTabs
          label="Credentials"
          tabs={tabs}
          active={tab}
          onSelect={(id) => setQuery({ tab: id === 'all' ? null : id })}
        />
        <QueueToolbar
          filterLabel="Credential type"
          chips={chips}
          chip={chip}
          onChip={(id) => setQuery({ filter: id === 'all' ? null : id })}
          sortOptions={SORT_OPTIONS}
          sort={sort}
          onSort={(id) => setQuery({ sort: id === 'newest' ? null : id })}
          actionLabel="Issue a credential"
          onAction={() => {
            resetForm();
            navigate('/institution/credentials/new');
          }}
        />
        {error || loadError ? (
          <p role="alert" className="m-0 text-[14px] leading-[20px] text-[#902b20]">
            {error || loadError}
          </p>
        ) : null}
        {waiting.revocations.length ? (
          <QueueBanner>
            {waiting.revocations.length === 1
              ? `1 revocation is waiting for a second approver (${waiting.revocations[0].student}, asked by ${waiting.revocations[0].askedBy}).`
              : `${waiting.revocations.length} revocations are waiting for a second approver.`}{' '}
            Revocations need two staff to agree.
          </QueueBanner>
        ) : null}
        {waiting.batches.map((b) => (
          <div
            key={b.id}
            className="flex flex-wrap items-center gap-[12px] rounded-[16px] border border-solid border-[#eedeb8] bg-[#faf4e8] px-[18px] py-[14px] text-[14px] leading-[20px] text-[#1c2a21]"
          >
            <span className="min-w-[220px] flex-1">
              <strong>{b.count} certificates</strong> ({b.label}) are waiting for a second approver
              · asked by {b.mine ? 'you' : b.askedBy}
            </span>
            {b.mine ? null : (
              <InstitutionButton
                size="sm"
                className="!h-[40px] !rounded-[10px]"
                onClick={() => releaseBatch(b)}
              >
                {busy ? 'Releasing…' : `Approve and issue ${b.count}`}
              </InstitutionButton>
            )}
          </div>
        ))}
        {!list && !loadError ? (
          <p className="m-0 text-[14px] text-[#737373]">Loading credentials…</p>
        ) : items.length ? (
          <ul className="m-0 flex list-none flex-col gap-[4px] overflow-hidden rounded-[22px] border border-solid border-[#e1eae2] bg-white p-0">
            {items.map(renderRow)}
          </ul>
        ) : list ? (
          <div className="pt-[56px] pb-[64px]">
            <EmptyState
              card={false}
              title={counts.all || counts.drafts ? 'Nothing in this view' : 'No credentials yet'}
              message={
                counts.all || counts.drafts
                  ? 'Try another tab or type.'
                  : 'Issue a certificate of completion or an award. It goes on the student’s profile and anyone can check it.'
              }
              actionLabel={
                counts.all || counts.drafts ? 'Show all credentials' : 'Issue a credential'
              }
              onAction={() =>
                counts.all || counts.drafts
                  ? setQuery({ tab: null, filter: null })
                  : navigate('/institution/credentials/new')
              }
            />
          </div>
        ) : null}
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>
      {isNew && !bulkMode ? (
        <CredentialIssueDialog
          form={form}
          options={options}
          onChange={setForm}
          onPreview={() => navigate('/institution/credentials/new?modal=preview')}
          onClass={() => navigate('/institution/credentials/new?mode=class', { replace: true })}
          onCancel={toList}
        />
      ) : null}
      {bulkMode && options ? (
        <CredentialBulkDialog
          options={options}
          busy={busy}
          onConfirm={confirmBulk}
          onClose={toList}
        />
      ) : null}
      {toast ? (
        <CredentialToast key={toast.id} message={toast.message} onDismiss={dismissToast} />
      ) : null}
    </div>
  );
};

export default CredentialsListView;
