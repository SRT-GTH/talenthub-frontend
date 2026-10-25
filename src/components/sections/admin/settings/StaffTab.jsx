import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { Select, TextInput } from '../../../ui/form';
import { GroupCard, SettingRow, TextAction } from '../../talentSettings/SettingsBUi.jsx';
import AgencyStatusChip from '../../agency/settings/AgencyStatusChip.jsx';
import { AdminArrowRightIcon, AdminLock14Icon } from '../adminIcons.jsx';
import { AdminChipCheckIcon, AdminStaffUserIcon } from './settingsIcons.jsx';
import { classNames } from '../../../../utils/classNames.js';
import AdminConfirmDialog from '../ui/AdminConfirmDialog.jsx';
import { useAdminData, useAdminToast } from '../useAdminData.js';
import AdminLoadNotice from '../AdminLoadNotice.jsx';
import {
  adminError,
  createStaff,
  deactivateStaff,
  docId,
  entityLabel,
  listStaff,
  reactivateStaff,
  timeAgo,
  updateStaff,
} from '../../../../services/admin.api.js';

const log = debug('StaffTab');

/*
 * StaffTab — Settings › Staff accounts (Figma 7.5.1a list, 7.5.1b create form, 7.5.1c deactivate, 7.5.1d last Super Admin).
 * Backend (services/admin.api.js): GET /admin/staff (Senior Admin and above), POST /admin/staff (Super Admin: email, name, phoneNumber, role, password?),
 * PATCH /admin/staff/:id { role }, POST /admin/staff/:id/deactivate { reason }, POST /admin/staff/:id/reactivate.
 * The backend sends no set-up link: a new staff member sets their password with "Forgot password?" on the sign-in page, unless a temporary password
 * is given here. Deactivating the last Super Admin is refused by the backend (LAST_SUPER_ADMIN_GUARD) and shows the 7.5.1d notice.
 * Props: creating (bool), onClose() (closes the create form), session ({ role, entityId, user }).
 */

const STAFF_ROLES = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'senior_admin', label: 'Senior Admin' },
  { value: 'support_agent', label: 'Support Agent' },
  { value: 'content_moderator', label: 'Content Moderator' },
];
const PREVIEW = {
  super_admin: 'Everything, including staff, platform settings, deletes and exports',
  senior_admin: 'Accounts, suspensions, moderation, reports, templates and bulk messages',
  support_agent: 'Account look-up (masked contact details), direct messages, suspension requests',
  content_moderator: 'Flag queue, community posts, warnings and escalations',
};

const staffName = (s) => s.metadata?.displayName || [s.firstName, s.lastName].filter(Boolean).join(' ') || s.email;
const isSelf = (s, session) => {
  const me = session?.user || {};
  return docId(s) === String(me._id || me.id || '') || (me.email && s.email === me.email);
};

const Pill = ({ children, selected, onClick }) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onClick}
    className={classNames(
      'inline-flex cursor-pointer items-center rounded-full border border-solid px-[14px] py-[8px] font-sans text-[14px] leading-[17px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      selected ? 'border-[#1c2a21] bg-[#1c2a21] text-white' : 'border-[#1c2a21]/60 bg-white text-[#1c2a21]',
    )}
  >
    {children}
  </button>
);

const CreateForm = ({ onDone, onCancel }) => {
  const [form, setForm] = useState({ name: '', email: '', phoneNumber: '', role: 'support_agent', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const ready =
    form.name.trim().length > 1 && /\S+@\S+\.\S+/.test(form.email) && form.phoneNumber.trim().length >= 9 && !busy;

  const submit = async (e) => {
    e.preventDefault();
    if (!ready) return;
    setBusy(true);
    setError('');
    try {
      const res = await createStaff({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phoneNumber: form.phoneNumber.trim(),
        role: form.role,
        password: form.password || undefined,
      });
      log('created', docId(res));
      onDone(res, Boolean(form.password));
    } catch (err) {
      setError(adminError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <GroupCard title="Create a staff account">
      <p className="m-0 font-sans text-[14px] leading-[21px] text-[#595959]">
        They sign in at /admin with 2-step sign-in. Leave the password empty and they set one with “Forgot password?”.
      </p>
      <form className="flex w-full flex-col gap-[8px]" onSubmit={submit}>
        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
          <TextInput label="Full name" required value={form.name} onChange={set('name')} />
          <TextInput label="Work email" required type="email" value={form.email} onChange={set('email')} />
          <TextInput label="Phone number" required placeholder="+233…" value={form.phoneNumber} onChange={set('phoneNumber')} />
          <TextInput
            label="Temporary password"
            optional
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={set('password')}
            error={error || undefined}
          />
        </div>
        <div className="flex flex-wrap gap-[8px] pt-[8px]" role="group" aria-label="Role">
          {STAFF_ROLES.map((r) => (
            <Pill key={r.value} selected={form.role === r.value} onClick={() => setForm((f) => ({ ...f, role: r.value }))}>
              {r.label}
            </Pill>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-[12px] pt-[12px]">
          <button
            type="submit"
            disabled={!ready}
            className="inline-flex h-[56px] cursor-pointer items-center gap-[8px] rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[34px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:cursor-not-allowed disabled:opacity-55"
          >
            {busy ? 'Creating…' : 'Create account'}
            <AdminArrowRightIcon className="size-[20px]" />
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer border-0 bg-transparent font-sans text-[14px] font-semibold text-[#1c2a21] underline"
          >
            Cancel
          </button>
          <span className="font-sans text-[13px] leading-[16px] text-[#595959]">Can do: {PREVIEW[form.role]}</span>
        </div>
      </form>
    </GroupCard>
  );
};

const StaffTab = ({ creating, onClose, session }) => {
  const staff = useAdminData(() => listStaff({ limit: 200 }), []);
  const [toastEl, toast] = useAdminToast();
  const [dialog, setDialog] = useState(null); // { kind: 'role' | 'deactivate' | 'reactivate' | 'last-super', row }
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const records = staff.data?.records ?? [];
  const supers = records.filter((r) => r.entityType === 'super_admin' && r.status === 'active');
  const canEdit = session?.role === 'super';

  const open = (kind, row) => {
    setError('');
    setValue(kind === 'role' ? row.entityType : '');
    setDialog({ kind, row });
  };
  const run = async (fn, title, body) => {
    setBusy(true);
    setError('');
    try {
      await fn();
      toast(title, body);
      setDialog(null);
      staff.reload();
    } catch (err) {
      const type = err?.response?.data?.type || err?.response?.data?.data?.code;
      if (type === 'LAST_SUPER_ADMIN_GUARD') setDialog({ kind: 'last-super', row: dialog?.row });
      else setError(adminError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <p className="m-0 flex items-center gap-[12px] rounded-[16px] bg-[#faf4e8] p-[16px] font-sans text-[14px] leading-[20px] font-medium text-[#463409]">
        Only Super Admins create, change or deactivate staff. Every change is logged under your name.
      </p>
      {creating && canEdit ? (
        <CreateForm
          onCancel={onClose}
          onDone={(res, withPassword) => {
            toast(
              'Staff account created',
              withPassword
                ? `${res?.email} can sign in with the temporary password.`
                : `${res?.email} sets a password with “Forgot password?”.`,
            );
            onClose();
            staff.reload();
          }}
        />
      ) : null}
      <GroupCard title={`Staff · ${records.length}`} gap="gap-0">
        <AdminLoadNotice loading={staff.loading} error={staff.error} status={staff.status} onRetry={staff.reload}>
          {records.map((r, i) => {
            const active = r.status === 'active';
            const self = isSelf(r, session);
            const last = r.staffMetadata?.lastStaffLoginAt || r.lastLogin;
            return (
              <div
                key={docId(r)}
                className={classNames('flex w-full flex-wrap items-center gap-[14px] py-[14px]', i > 0 && 'border-t border-[rgba(28,42,33,0.08)]')}
              >
                <span aria-hidden="true" className="grid size-[44px] shrink-0 place-items-center rounded-[13px] bg-[#ffd86b]">
                  <AdminStaffUserIcon className="size-[21px] text-[#1c2a21]" />
                </span>
                <div className="flex min-w-[220px] flex-1 flex-col gap-[2px]">
                  <p className="m-0 flex flex-wrap items-center gap-[8px] font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                    {staffName(r)} · {entityLabel(r.entityType)}
                    <AgencyStatusChip
                      tone={active ? 'active' : 'invited'}
                      icon={active ? <AdminChipCheckIcon className="size-[14px]" /> : null}
                    >
                      {active ? 'Active' : r.status === 'inactive' ? 'Deactivated' : r.status}
                    </AgencyStatusChip>
                  </p>
                  <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959]">
                    {r.email}
                    {self ? ' · you' : ''} · {last ? `last sign-in ${timeAgo(last)}` : 'never signed in'}
                  </p>
                </div>
                {self ? (
                  <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#387440] underline">You</span>
                ) : canEdit ? (
                  <div className="flex items-center gap-[14px]">
                    {active ? (
                      <>
                        <TextAction tone="green" onClick={() => open('role', r)}>
                          Change role
                        </TextAction>
                        <TextAction tone="green" onClick={() => open('deactivate', r)}>
                          Deactivate
                        </TextAction>
                      </>
                    ) : (
                      <TextAction tone="green" onClick={() => open('reactivate', r)}>
                        Reactivate
                      </TextAction>
                    )}
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-[6px] font-sans text-[13px] text-[#737373]">
                    <AdminLock14Icon className="size-[14px]" /> Super Admin only
                  </span>
                )}
              </div>
            );
          })}
        </AdminLoadNotice>
      </GroupCard>
      <GroupCard title="Super Admins" gap="gap-0">
        <SettingRow
          title={`${supers.length} active Super Admin${supers.length === 1 ? '' : 's'}`}
          description="The last active Super Admin can’t be deactivated. Keep at least two so approvals that need a second Super Admin can be resolved."
          top={false}
          control={null}
        />
      </GroupCard>

      {dialog?.kind === 'role' ? (
        <AdminConfirmDialog
          title={`Change ${staffName(dialog.row)}’s role`}
          body="The new role applies from their next request. Their old permissions are removed."
          primary={{ label: busy ? 'Saving…' : 'Save role', arrow: true }}
          secondary="Cancel"
          onPrimary={() =>
            !busy &&
            value !== dialog.row.entityType &&
            run(() => updateStaff(docId(dialog.row), { role: value }), 'Role changed', `${staffName(dialog.row)} is now ${entityLabel(value)}.`)
          }
          onClose={() => setDialog(null)}
        >
          <Select label="Role" required options={STAFF_ROLES} value={value} onChange={setValue} error={error || undefined} />
        </AdminConfirmDialog>
      ) : null}
      {dialog?.kind === 'deactivate' ? (
        <AdminConfirmDialog
          title={`Deactivate ${staffName(dialog.row)}?`}
          body="They’re signed out everywhere and can’t sign in. You can reactivate them later."
          primary={{ label: busy ? 'Deactivating…' : 'Deactivate', tone: 'red' }}
          secondary="Cancel"
          onPrimary={() =>
            !busy &&
            value.trim().length >= 3 &&
            run(() => deactivateStaff(docId(dialog.row), value.trim()), 'Staff deactivated', `${staffName(dialog.row)} can no longer sign in.`)
          }
          onClose={() => setDialog(null)}
        >
          <Select
            label="Reason"
            required
            options={['Left GTH', 'Role change', 'Extended leave', 'Security concern']}
            value={value}
            onChange={setValue}
            error={error || undefined}
          />
        </AdminConfirmDialog>
      ) : null}
      {dialog?.kind === 'reactivate' ? (
        <AdminConfirmDialog
          title={`Reactivate ${staffName(dialog.row)}?`}
          body="They can sign in again with their existing role."
          primary={{ label: busy ? 'Reactivating…' : 'Reactivate', arrow: true }}
          secondary="Cancel"
          onPrimary={() =>
            !busy && run(() => reactivateStaff(docId(dialog.row)), 'Staff reactivated', `${staffName(dialog.row)} can sign in again.`)
          }
          onClose={() => setDialog(null)}
        >
          {error ? <p className="m-0 text-[14px] text-[#902b20]">{error}</p> : null}
        </AdminConfirmDialog>
      ) : null}
      {dialog?.kind === 'last-super' ? (
        <AdminConfirmDialog
          title="You can’t deactivate the last Super Admin"
          body="Make another staff member a Super Admin first, then try again."
          primary={{ label: 'OK', arrow: false }}
          secondary="Close"
          onPrimary={() => setDialog(null)}
          onClose={() => setDialog(null)}
        />
      ) : null}
      {toastEl}
    </>
  );
};

export default StaffTab;
