import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { classNames } from '../../../../utils/classNames.js';
import { Select, TextInput } from '../../../ui/form';
import { GroupCard, TextAction } from '../../talentSettings/SettingsBUi.jsx';
import AgencyStatusChip from '../../agency/settings/AgencyStatusChip.jsx';
import { AdminArrowRightIcon, AdminLock14Icon } from '../adminIcons.jsx';
import { AdminChipCheckIcon } from './settingsIcons.jsx';
import AdminConfirmDialog from '../ui/AdminConfirmDialog.jsx';
import { useAdminData, useAdminToast } from '../useAdminData.js';
import AdminLoadNotice from '../AdminLoadNotice.jsx';
import AgencyDataRequestsReview from './AgencyDataRequestsReview.jsx';
import AgencyMouReview from './AgencyMouReview.jsx';
import { adminError, shortDate, timeAgo } from '../../../../services/admin.api.js';
import {
  adminApproveAgencyRequest,
  adminCreateAgency,
  adminDenyAgencyRequest,
  adminListAgencies,
  adminListAgencyRequests,
  adminResetAgencyPassword,
  adminSetAgencyStatus,
} from '../../../../services/agency.api.js';

const log = debug('AgenciesTab');

/*
 * AgenciesTab: Settings › Government agencies (/admin/settings/agencies). Super and Senior Admins.
 *   Create   agency + its admin sign-in. The backend returns a temporary password ONCE; it is shown here to hand over
 *            securely. The agency must set its own password on first sign-in (/agency/set-password) before any data.
 *   Reset    issues a new temporary password (signs the agency out everywhere); same one-time panel.
 *   Pause    suspends / reactivates the agency (the portal refuses data while paused).
 *   Requests self-service access requests from /agency/sign-up: approve (creates the account, same one-time panel) or deny.
 * Backend: services/governmentAccess.service.js via /api/admin/agencies. Every action is audited.
 */

const today = () => new Date().toISOString().slice(0, 10);
const inMonths = (n) => {
  const d = new Date();
  d.setMonth(d.getMonth() + n);
  return d.toISOString().slice(0, 10);
};
const EMPTY = {
  agencyName: '',
  short: '',
  ministry: '',
  contactName: '',
  email: '',
  phone: '',
  title: '',
  mouReference: '',
  categories: 'Aggregate talent figures, Regional breakdowns',
  expires: inMonths(12),
  queries: '200',
  exports: '20',
  requests: '4',
};

const PrimaryButton = ({ children, disabled, type = 'button', onClick }) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className="inline-flex h-[52px] cursor-pointer items-center gap-[8px] rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[28px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:cursor-not-allowed disabled:opacity-55"
  >
    {children}
  </button>
);

const CreateForm = ({ onDone, onCancel }) => {
  const [f, setF] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const ready =
    f.agencyName.trim().length > 1 &&
    f.contactName.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(f.email) &&
    f.phone.trim().length >= 9 &&
    f.expires > today() &&
    !busy;

  const submit = async (e) => {
    e.preventDefault();
    if (!ready) return;
    setBusy(true);
    setError('');
    try {
      const res = await adminCreateAgency({
        agencyName: f.agencyName.trim(),
        short: f.short.trim() || undefined,
        ministry: f.ministry.trim(),
        contactPerson: {
          name: f.contactName.trim(),
          email: f.email.trim().toLowerCase(),
          phone: f.phone.trim(),
          title: f.title.trim(),
        },
        mou: {
          reference: f.mouReference.trim(),
          categories: f.categories
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean),
          expiresAt: f.expires,
        },
        limits: {
          queriesPerMonth: Number(f.queries) || 0,
          csvExportsPerMonth: Number(f.exports) || 0,
          dataRequestsPerQuarter: Number(f.requests) || 0,
        },
      });
      log('created', res?.agency?.id);
      onDone(res);
    } catch (err) {
      setError(adminError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <GroupCard title="Create an agency account">
      <p className="m-0 font-sans text-[14px] leading-[21px] text-[#595959]">
        Creates the agency and its admin sign-in. You get a temporary password once, to hand over
        securely. The agency signs in at /login and must set its own password before it sees any
        data.
      </p>
      <form className="flex w-full flex-col gap-[8px]" onSubmit={submit}>
        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
          <TextInput
            label="Agency name"
            required
            value={f.agencyName}
            onChange={set('agencyName')}
            placeholder="National Youth Authority"
          />
          <TextInput
            label="Short name"
            optional
            value={f.short}
            onChange={set('short')}
            placeholder="NYA"
          />
          <TextInput label="Ministry" optional value={f.ministry} onChange={set('ministry')} />
          <TextInput
            label="Contact person"
            required
            value={f.contactName}
            onChange={set('contactName')}
          />
          <TextInput
            label="Contact work email"
            required
            type="email"
            value={f.email}
            onChange={set('email')}
          />
          <TextInput
            label="Contact phone"
            required
            placeholder="+233…"
            value={f.phone}
            onChange={set('phone')}
          />
          <TextInput label="Contact job title" optional value={f.title} onChange={set('title')} />
          <TextInput
            label="MoU reference"
            optional
            value={f.mouReference}
            onChange={set('mouReference')}
            placeholder="GTH-MOU-2026-004"
          />
          <TextInput
            label="Data categories in the MoU"
            optional
            value={f.categories}
            onChange={set('categories')}
          />
          <TextInput
            label="Access ends"
            required
            type="date"
            value={f.expires}
            onChange={set('expires')}
          />
          <TextInput
            label="Queries per month"
            type="number"
            value={f.queries}
            onChange={set('queries')}
          />
          <TextInput
            label="CSV exports per month"
            type="number"
            value={f.exports}
            onChange={set('exports')}
          />
          <TextInput
            label="Data requests per quarter"
            type="number"
            value={f.requests}
            onChange={set('requests')}
          />
        </div>
        {error ? (
          <p role="alert" className="m-0 font-sans text-[14px] text-[#902b20]">
            {error}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-[12px] pt-[12px]">
          <PrimaryButton type="submit" disabled={!ready}>
            {busy ? 'Creating…' : 'Create agency'}
            <AdminArrowRightIcon className="size-[20px]" />
          </PrimaryButton>
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer border-0 bg-transparent font-sans text-[14px] font-semibold text-[#1c2a21] underline"
          >
            Cancel
          </button>
        </div>
      </form>
    </GroupCard>
  );
};

/** The one-time sign-in details. Nothing is stored; closing it means a reset is needed to see a password again. */
const CredentialsPanel = ({ creds, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [handed, setHanded] = useState(false);
  const text = `Ghana Talent Hub agency portal\nSign in: ${window.location.origin}/login\nEmail: ${creds.email}\nTemporary password: ${creds.temporaryPassword}\nYou will be asked to set your own password the first time you sign in.`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  return (
    <AdminConfirmDialog
      title={`Sign-in details for ${creds.agencyName}`}
      body="Shown once. Give them to the agency contact through a secure channel (in person, phone, or an encrypted message), not in the same email as the address. They must set a new password the first time they sign in."
      primary={{ label: 'Done', arrow: false }}
      secondary="Close"
      onPrimary={() => handed && onClose()}
      onClose={() => handed && onClose()}
    >
      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-[12px] gap-y-[6px] rounded-[12px] bg-[#f5f7f5] p-[14px] font-sans text-[14px]">
        <dt className="font-semibold text-[#1c2a21]">Sign in at</dt>
        <dd className="m-0 break-all">{window.location.origin}/login</dd>
        <dt className="font-semibold text-[#1c2a21]">Email</dt>
        <dd className="m-0 break-all">{creds.email}</dd>
        <dt className="font-semibold text-[#1c2a21]">Temporary password</dt>
        <dd
          className="m-0 font-mono text-[15px] tracking-[0.5px] break-all"
          data-testid="agency-temp-password"
        >
          {creds.temporaryPassword}
        </dd>
      </dl>
      <div className="flex flex-wrap items-center gap-[14px] pt-[10px]">
        <TextAction tone="green" onClick={copy}>
          {copied ? 'Copied' : 'Copy sign-in details'}
        </TextAction>
        <label className="inline-flex items-center gap-[8px] font-sans text-[14px] text-[#1c2a21]">
          <input type="checkbox" checked={handed} onChange={(e) => setHanded(e.target.checked)} />I
          have saved or handed these over
        </label>
      </div>
    </AdminConfirmDialog>
  );
};

const statusOf = (a) => {
  if (a.status !== 'active') return { tone: 'invited', label: 'Paused' };
  if (a.expired) return { tone: 'invited', label: 'Access ended' };
  if (a.contact?.mustChangePassword) return { tone: 'invited', label: 'Waiting for first sign-in' };
  return { tone: 'active', label: 'Active', check: true };
};

const AgenciesTab = ({ creating, onClose, session }) => {
  const agencies = useAdminData(() => adminListAgencies(), []);
  const requests = useAdminData(() => adminListAgencyRequests('pending'), []);
  const [toastEl, toast] = useAdminToast();
  const [creds, setCreds] = useState(null);
  const [dialog, setDialog] = useState(null); // { kind: 'reset' | 'pause' | 'resume' | 'approve' | 'deny', row }
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const canEdit = session?.role === 'super' || session?.role === 'senior';
  const rows = agencies.data?.agencies ?? [];
  const pending = requests.data?.requests ?? [];

  const open = (kind, row) => {
    setError('');
    setValue('');
    setDialog({ kind, row });
  };
  const run = async (fn, after) => {
    setBusy(true);
    setError('');
    try {
      const res = await fn();
      setDialog(null);
      after(res);
      agencies.reload();
      requests.reload();
    } catch (err) {
      setError(adminError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <p className="m-0 flex items-center gap-[12px] rounded-[16px] bg-[#faf4e8] p-[16px] font-sans text-[14px] leading-[20px] font-medium text-[#463409]">
        Government agencies see aggregate talent figures only (no names or contacts; groups under 5
        are hidden). Super and Senior Admins create and manage their accounts; every change is
        logged under your name.
      </p>

      {creating && canEdit ? (
        <CreateForm
          onCancel={onClose}
          onDone={(res) => {
            onClose();
            agencies.reload();
            if (res?.login?.temporaryPassword)
              setCreds({ ...res.login, agencyName: res.agency?.name || 'the agency' });
          }}
        />
      ) : null}

      {pending.length ? (
        <GroupCard title={`Access requests · ${pending.length}`} gap="gap-0">
          {pending.map((r, i) => (
            <div
              key={r._id || r.id}
              className={classNames(
                'flex w-full flex-wrap items-center gap-[14px] py-[14px]',
                i > 0 && 'border-t border-[rgba(28,42,33,0.08)]'
              )}
            >
              <div className="flex min-w-[220px] flex-1 flex-col gap-[2px]">
                <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                  {r.agencyName}
                </p>
                <p className="m-0 font-sans text-[13px] leading-[18px] text-[#595959]">
                  {r.contactPerson?.name} · {r.contactPerson?.email} · {shortDate(r.createdAt)}
                  {r.intendedUse ? ` · ${r.intendedUse}` : ''}
                </p>
              </div>
              {canEdit ? (
                <div className="flex items-center gap-[14px]">
                  <TextAction tone="green" onClick={() => open('approve', r)}>
                    Approve
                  </TextAction>
                  <TextAction tone="green" onClick={() => open('deny', r)}>
                    Deny
                  </TextAction>
                </div>
              ) : null}
            </div>
          ))}
        </GroupCard>
      ) : null}

      <AgencyMouReview canEdit={canEdit} toast={toast} />

      <AgencyDataRequestsReview canEdit={canEdit} toast={toast} />

      <GroupCard title={`Agencies · ${rows.length}`} gap="gap-0">
        <AdminLoadNotice
          loading={agencies.loading}
          error={agencies.error}
          status={agencies.status}
          onRetry={agencies.reload}
        >
          {!rows.length ? (
            <p className="m-0 py-[14px] font-sans text-[14px] text-[#595959]">
              No agencies yet. Use “Create agency” to add the first one.
            </p>
          ) : null}
          {rows.map((a, i) => {
            const st = statusOf(a);
            return (
              <div
                key={a.id}
                className={classNames(
                  'flex w-full flex-wrap items-center gap-[14px] py-[14px]',
                  i > 0 && 'border-t border-[rgba(28,42,33,0.08)]'
                )}
              >
                <div className="flex min-w-[240px] flex-1 flex-col gap-[2px]">
                  <p className="m-0 flex flex-wrap items-center gap-[8px] font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                    {a.name}
                    {a.short ? (
                      <span className="font-normal text-[#595959]">({a.short})</span>
                    ) : null}
                    <AgencyStatusChip
                      tone={st.tone}
                      icon={st.check ? <AdminChipCheckIcon className="size-[14px]" /> : null}
                    >
                      {st.label}
                    </AgencyStatusChip>
                  </p>
                  <p className="m-0 font-sans text-[13px] leading-[18px] text-[#595959]">
                    {a.contact ? `${a.contact.name} · ${a.contact.email}` : 'No sign-in account'}
                    {a.contact
                      ? ` · ${a.contact.lastLogin ? `last sign-in ${timeAgo(a.contact.lastLogin)}` : 'never signed in'}`
                      : ''}
                  </p>
                  <p className="m-0 font-sans text-[13px] leading-[18px] text-[#595959]">
                    {a.mou?.reference ? `MoU ${a.mou.reference} · ` : ''}
                    {(a.mou?.categories || []).length} data categor
                    {(a.mou?.categories || []).length === 1 ? 'y' : 'ies'} · access until{' '}
                    {a.accessExpiresAt ? shortDate(a.accessExpiresAt) : '—'}
                    {a.legacyType ? ' · older account type' : ''}
                  </p>
                </div>
                {canEdit ? (
                  <div className="flex flex-wrap items-center gap-[14px]">
                    {a.contact ? (
                      <TextAction tone="green" onClick={() => open('reset', a)}>
                        Reset password
                      </TextAction>
                    ) : null}
                    {a.status === 'active' ? (
                      <TextAction tone="green" onClick={() => open('pause', a)}>
                        Pause access
                      </TextAction>
                    ) : (
                      <TextAction tone="green" onClick={() => open('resume', a)}>
                        Restore access
                      </TextAction>
                    )}
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-[6px] font-sans text-[13px] text-[#737373]">
                    <AdminLock14Icon className="size-[14px]" /> Senior or Super Admin
                  </span>
                )}
              </div>
            );
          })}
        </AdminLoadNotice>
      </GroupCard>

      {dialog?.kind === 'reset' ? (
        <AdminConfirmDialog
          title={`Reset the password for ${dialog.row.name}?`}
          body={`${dialog.row.contact?.email} gets a new temporary password and is signed out everywhere. They set their own password at the next sign-in.`}
          primary={{ label: busy ? 'Resetting…' : 'Reset password', tone: 'red' }}
          secondary="Cancel"
          onPrimary={() =>
            !busy &&
            run(
              () => adminResetAgencyPassword(dialog.row.id),
              (res) => res?.login && setCreds({ ...res.login, agencyName: dialog.row.name })
            )
          }
          onClose={() => setDialog(null)}
        >
          {error ? <p className="m-0 text-[14px] text-[#902b20]">{error}</p> : null}
        </AdminConfirmDialog>
      ) : null}
      {dialog?.kind === 'pause' ? (
        <AdminConfirmDialog
          title={`Pause ${dialog.row.name}'s access?`}
          body="The agency can still sign in but sees no data until you restore access."
          primary={{ label: busy ? 'Pausing…' : 'Pause access', tone: 'red' }}
          secondary="Cancel"
          onPrimary={() =>
            !busy &&
            value &&
            run(
              () => adminSetAgencyStatus(dialog.row.id, 'suspended', value),
              () => toast('Access paused', `${dialog.row.name} sees no data until restored.`)
            )
          }
          onClose={() => setDialog(null)}
        >
          <Select
            label="Reason"
            required
            options={[
              'MoU under review',
              'MoU expired',
              'Security concern',
              'Requested by the agency',
            ]}
            value={value}
            onChange={setValue}
            error={error || undefined}
          />
        </AdminConfirmDialog>
      ) : null}
      {dialog?.kind === 'resume' ? (
        <AdminConfirmDialog
          title={`Restore ${dialog.row.name}'s access?`}
          body="The agency sees its data again straight away."
          primary={{ label: busy ? 'Restoring…' : 'Restore access', arrow: true }}
          secondary="Cancel"
          onPrimary={() =>
            !busy &&
            run(
              () => adminSetAgencyStatus(dialog.row.id, 'active'),
              () => toast('Access restored', `${dialog.row.name} can use the portal again.`)
            )
          }
          onClose={() => setDialog(null)}
        >
          {error ? <p className="m-0 text-[14px] text-[#902b20]">{error}</p> : null}
        </AdminConfirmDialog>
      ) : null}
      {dialog?.kind === 'approve' ? (
        <AdminConfirmDialog
          title={`Approve ${dialog.row.agencyName}?`}
          body="Creates the agency and its admin sign-in for 12 months. You get a temporary password once, to hand over."
          primary={{ label: busy ? 'Approving…' : 'Approve and create account', arrow: true }}
          secondary="Cancel"
          onPrimary={() =>
            !busy &&
            run(
              () => adminApproveAgencyRequest(dialog.row._id || dialog.row.id, 12),
              (res) =>
                res?.temporaryPassword &&
                setCreds({
                  email: res.email,
                  temporaryPassword: res.temporaryPassword,
                  agencyName: dialog.row.agencyName,
                })
            )
          }
          onClose={() => setDialog(null)}
        >
          {error ? <p className="m-0 text-[14px] text-[#902b20]">{error}</p> : null}
        </AdminConfirmDialog>
      ) : null}
      {dialog?.kind === 'deny' ? (
        <AdminConfirmDialog
          title={`Deny ${dialog.row.agencyName}'s request?`}
          body="No account is created. The reason is recorded with the request."
          primary={{ label: busy ? 'Denying…' : 'Deny request', tone: 'red' }}
          secondary="Cancel"
          onPrimary={() =>
            !busy &&
            value &&
            run(
              () => adminDenyAgencyRequest(dialog.row._id || dialog.row.id, value),
              () => toast('Request denied', dialog.row.agencyName)
            )
          }
          onClose={() => setDialog(null)}
        >
          <Select
            label="Reason"
            required
            options={[
              'No MoU in place',
              'Not a government body',
              'Duplicate request',
              'Purpose not covered',
            ]}
            value={value}
            onChange={setValue}
            error={error || undefined}
          />
        </AdminConfirmDialog>
      ) : null}
      {creds ? (
        <CredentialsPanel
          creds={creds}
          onClose={() => {
            setCreds(null);
            toast('Agency account ready', 'They set their own password at first sign-in.');
          }}
        />
      ) : null}
      {toastEl}
    </>
  );
};

export default AgenciesTab;
