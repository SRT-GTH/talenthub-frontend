import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import EmptyState from '../../publicData/ui/EmptyState.jsx';
import InstitutionButton from '../InstitutionButton.jsx';
import QueueBanner from '../records/QueueBanner.jsx';
import QueueHeader from '../records/QueueHeader.jsx';
import QueuePill from '../records/QueuePill.jsx';
import QueueRow from '../records/QueueRow.jsx';
import QueueTabs from '../records/QueueTabs.jsx';
import QueueToolbar from '../records/QueueToolbar.jsx';
import { RecordsIconCheck11, RecordsIconEye13 } from '../records/recordsIcons.jsx';
import CredentialIssueDialog from './CredentialIssueDialog.jsx';
import CredentialRevokeDialog from './CredentialRevokeDialog.jsx';
import CredentialTableDialog from './CredentialTableDialog.jsx';
import CredentialToast from './CredentialToast.jsx';
import { CredentialsIconInfocircle, CredentialsIconShield } from './credentialsIcons.jsx';
import {
  BULK,
  CORRECTION,
  REVOKED_BANNER,
  REVOKED_TOAST,
  SORT_OPTIONS,
  TOAST_CORRECTED,
  TYPE_CHIPS,
  VIEW_DARK_SINCE,
  WAITING_BANNER,
} from './data/credentialsData.js';
import {
  applyCorrection,
  approveRevocation,
  bulkIssue,
  credentialCounts,
  dismissToast,
  resetForm,
  setForm,
  showToast,
  useCredentialsStore,
} from './useCredentialsStore.js';

const log = debug('CredentialsListView');

/*
 * CredentialsListView — "Issued list" (Figma 11.2.4a 8593:388444) and the dialogs drawn over it:
 *   /institution/credentials                        list ?tab=valid|revoked|all|drafts (default all) · ?filter=completion|awards · ?view=cards|list · ?sort=oldest|newest
 *   /institution/credentials/new                    11.2.4b issue form dialog   ?mode=class = 11.2.4h bulk issue "Issue completion certificates to Form 3"
 *   /institution/credentials/:id?modal=revoke       11.2.4e revoke (dual approval)      ?modal=corrected = 11.2.4g corrected copy (the drawn sample is Kofi’s)
 *   /institution/credentials/:id?state=revoked      11.2.4f banner "… is revoked" + the "Credential revoked" toast (the row keeps drawing "Revoking", as in the frame)
 * ⚠️ ASSUMPTIONS: the cards view is not drawn (the list stays); the four drafts are sample rows; the Revoked tab lists the rows that are revoked or being revoked; the "View" button of
 * a valid row opens the certificate page (/credentials/:id), Yaw’s opens the revoke dialog; approving the revocation marks the row Revoked and shows the banner and toast.
 * Props: data (useInstitutionState()), credentialId (route param, optional), isNew (route /credentials/new).
 */

const VIEW_DARK =
  'inline-flex h-[25px] items-center rounded-full border border-solid border-[#1c2a21]/12 bg-[#387440] px-[10px] text-[12.5px] leading-[15px] font-bold text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';
const VIEW_LIGHT =
  'inline-flex h-[25px] items-center rounded-full border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[10px] text-[12.5px] leading-[15px] font-bold text-[#2d5d33] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const TAB_FILTERS = {
  valid: (c) => c.status === 'valid',
  revoked: (c) => c.status === 'revoked' || c.status === 'revoking',
  drafts: (c) => c.status === 'draft',
  all: (c) => c.status !== 'draft',
};

const CredentialsListView = ({ data, credentialId, isNew }) => {
  const navigate = useNavigate();
  const store = useCredentialsStore();
  const { params, modal, state, update } = data;
  const { credentials, form, toast } = store;
  const [announce, setAnnounce] = useState('');
  const counts = credentialCounts(store);

  const tab = ['valid', 'revoked', 'drafts'].includes(data.tab) ? data.tab : 'all';
  const chip = ['completion', 'awards'].includes(data.filter) ? data.filter : 'all';
  const view = params.get('view') === 'cards' ? 'cards' : 'list';
  const sort = params.get('sort') === 'oldest' ? 'oldest' : 'newest';
  const bulkMode = isNew && params.get('mode') === 'class';
  const revokedFrame = state === 'revoked';

  useEffect(() => {
    log('mount', { tab, chip, credentialId, isNew, modal, state });
  }, [tab, chip, credentialId, isNew, modal, state]);

  const rows = useMemo(() => {
    const base = credentials.filter(TAB_FILTERS[tab]);
    const typed = base.filter(
      (c) =>
        chip === 'all' || (chip === 'completion' ? c.kind === 'completion' : c.kind === 'award')
    );
    const sorted = [...typed].sort((a, b) => a.issuedOn.localeCompare(b.issuedOn));
    return sort === 'newest' ? sorted.reverse() : sorted;
  }, [credentials, tab, chip, sort]);

  const target = credentials.find((c) => c.id === credentialId);
  const revoking = credentials.find((c) => c.status === 'revoking');
  const revokeTarget = target ?? revoking;
  const waiting = credentials.filter((c) => c.status === 'revoking').length;

  const setQuery = (patch) => update({ ...patch, modal: null }, { replace: true });
  const toList = (extra = '') => navigate(`/institution/credentials${extra}`);

  const tabs = [
    { id: 'valid', label: 'Valid', count: String(counts.valid) },
    { id: 'revoked', label: 'Revoked', count: String(counts.revoked) },
    { id: 'all', label: 'All', count: String(counts.all) },
    { id: 'drafts', label: 'Drafts', count: String(counts.drafts) },
  ];
  const chips = TYPE_CHIPS.map((c) => ({
    ...c,
    count: String(c.id === 'all' ? counts.all : counts[c.id]),
  }));

  const renderRow = (c) => {
    const kind = (
      <QueuePill icon={<RecordsIconCheck11 className="size-[11px]" />}>{c.kindLabel}</QueuePill>
    );
    if (c.status === 'revoking' || c.status === 'revoked') {
      const done = c.status === 'revoked';
      const href = `/institution/credentials/${c.id}?modal=revoke`;
      return (
        <QueueRow
          key={c.id}
          initials={c.initials}
          name={c.student}
          badge={done ? 'Revoked' : 'Revoking'}
          sub={c.sub}
          muted
          href={done ? undefined : href}
          pills={
            <span className="flex items-center gap-[6px] opacity-50">
              {kind}
              {done ? null : (
                <QueuePill className="!text-[12.5px] !leading-[15px] !font-bold">
                  {c.approvals} of 2 approved
                </QueuePill>
              )}
            </span>
          }
          action={
            done ? null : (
              <InstitutionButton
                to={href}
                size="sm"
                className="!h-[40px] !rounded-[10px] !px-[16px] !text-[16px]"
                aria-label={`View ${c.student}’s revocation`}
              >
                View
              </InstitutionButton>
            )
          }
        />
      );
    }
    const href = `/institution/credentials/${c.id}`;
    const dark = c.issuedOn >= VIEW_DARK_SINCE;
    return (
      <QueueRow
        key={c.id}
        initials={c.initials}
        name={c.student}
        badge={c.status === 'draft' ? 'Draft' : 'Valid'}
        sub={c.sub}
        href={href}
        pills={
          <>
            <QueuePill tone="amber" icon={<RecordsIconEye13 className="size-[13px]" />}>
              {c.issuedLabel}
            </QueuePill>
            {kind}
          </>
        }
        action={
          <Link
            to={href}
            aria-label={`View ${c.student}’s credential`}
            className={dark ? VIEW_DARK : VIEW_LIGHT}
          >
            View
          </Link>
        }
      />
    );
  };

  const confirmApprove = () => {
    approveRevocation(revokeTarget.id);
    showToast(REVOKED_TOAST, 'View log');
    setAnnounce(`${revokeTarget.student}’s credential is revoked.`);
    navigate(`/institution/credentials/${revokeTarget.id}?state=revoked`, { replace: true });
  };

  const confirmCorrected = () => {
    applyCorrection(CORRECTION.credentialId);
    showToast(TOAST_CORRECTED);
    toList();
  };

  const confirmBulk = () => {
    bulkIssue(BULK.willReceive);
    resetForm();
    toList();
  };

  const toastMessage = toast?.message ?? (revokedFrame ? REVOKED_TOAST : null);
  const banner = revokedFrame ? REVOKED_BANNER : waiting > 0 ? WAITING_BANNER : null;

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
          view={view}
          onView={(v) => setQuery({ view: v === 'list' ? null : v })}
          sortOptions={SORT_OPTIONS}
          sort={sort}
          onSort={(id) => setQuery({ sort: id === 'newest' ? null : id })}
          actionLabel="Issue a credential"
          onAction={() => navigate('/institution/credentials/new')}
        />
        {banner ? <QueueBanner>{banner}</QueueBanner> : null}
        {rows.length ? (
          <ul className="m-0 flex list-none flex-col gap-[4px] overflow-hidden rounded-[22px] border border-solid border-[#e1eae2] bg-white p-0">
            {rows.map(renderRow)}
          </ul>
        ) : (
          <div className="pt-[56px] pb-[64px]">
            <EmptyState
              card={false}
              title="Nothing here yet"
              message="Credentials you issue show up here with their status."
              actionLabel="Show all credentials"
              onAction={() => setQuery({ tab: null, filter: null })}
            />
          </div>
        )}
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>
      {isNew && !bulkMode ? (
        <CredentialIssueDialog
          form={form}
          onChange={setForm}
          onPreview={() => navigate('/institution/credentials/new?modal=preview')}
          onClass={() => navigate('/institution/credentials/new?mode=class', { replace: true })}
          onCancel={() => toList()}
        />
      ) : null}
      {bulkMode ? (
        <CredentialTableDialog
          chip="Bulk issue"
          heading={`Issue completion certificates to ${BULK.className}`}
          description="One certificate per student, signed with your institution key. Students who haven’t linked their profile get it when they do."
          stats={[
            { id: 'in', value: String(BULK.inClass), label: `In ${BULK.className}`, tone: 'plain' },
            { id: 'get', value: String(BULK.willReceive), label: 'Will receive it', tone: 'green' },
            { id: 'wait', value: String(BULK.waiting), label: 'Waiting to link', tone: 'amber' },
          ]}
          head={['Setting', 'Value']}
          rows={BULK.rows.map((r) => ({ id: r.id, a: r.setting, b: r.value }))}
          note={BULK.approverNote}
          noteIcon={<CredentialsIconInfocircle className="size-[16px] text-[#575755]" />}
          confirmLabel={`Issue ${BULK.willReceive} certificates`}
          onConfirm={confirmBulk}
          onClose={() => toList()}
        />
      ) : null}
      {modal === 'revoke' && revokeTarget && revokeTarget.status === 'revoking' ? (
        <CredentialRevokeDialog
          credential={revokeTarget}
          onCorrected={() =>
            navigate(`/institution/credentials/${revokeTarget.id}?modal=corrected`, {
              replace: true,
            })
          }
          onApprove={confirmApprove}
          onClose={() => toList()}
        />
      ) : null}
      {modal === 'corrected' ? (
        <CredentialTableDialog
          chip="Corrected copy"
          heading={`Fix a typo on ${CORRECTION.firstName}’s certificate`}
          description="The corrected copy replaces the old one. Links and QR codes keep working, and gth.com/verify shows the new version with a note that it was corrected."
          head={['Field', 'Was', 'Now']}
          rows={CORRECTION.rows.map((r) => ({ id: r.id, a: r.field, b: r.was, c: r.now }))}
          note={CORRECTION.note}
          noteIcon={<CredentialsIconShield className="size-[16px] text-[#575755]" />}
          confirmLabel="Issue corrected copy"
          onConfirm={confirmCorrected}
          onClose={() => toList()}
        />
      ) : null}
      {toastMessage ? (
        <CredentialToast
          message={toastMessage}
          sticky={revokedFrame}
          onDismiss={() => {
            dismissToast();
            if (revokedFrame) update({ state: null }, { replace: true });
          }}
        />
      ) : null}
    </div>
  );
};

export default CredentialsListView;
