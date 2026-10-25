import { useMemo, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { Select, TextInput } from '../../../ui/form';
import { GroupCard, SettingRow, TextAction } from '../../talentSettings/SettingsBUi.jsx';
import AdminConfirmDialog from '../ui/AdminConfirmDialog.jsx';
import AdminLoadNotice from '../AdminLoadNotice.jsx';
import { useAdminData, useAdminToast } from '../useAdminData.js';
import {
  adminError,
  docId,
  enumDeactivate,
  enumList,
  enumRegister,
  humanize,
  rbacClearRoleCache,
  rbacCreateRole,
  rbacDeleteRole,
  rbacAssignPermission,
  rbacRemovePermission,
  rbacRoleHolders,
  rbacRolePermissions,
  rbacRoles,
  rbacScopePermissions,
  rbacScopes,
  rbacStats,
  rbacUpdateRole,
} from '../../../../services/admin.api.js';

const log = debug('RolesPermissionsTab');

/*
 * RolesPermissionsTab — Settings › Roles and permissions, on the real RBAC service (/api/rbac) and role groups (/api/platform-enums).
 *   Roles        list (system / custom), holders, permissions by service scope with grant / revoke (custom roles only — system roles are
 *                managed by the seeders and the backend refuses changes), create / rename / delete custom roles, clear the permission cache.
 *   Role groups  which staff types may moderate, send bulk messages, manage templates, see reports… (platform enum domains read by
 *                the admin services). Add a staff type to a group or remove it.
 * Super Admin only for changes. Permission checks are cached for about a minute after a change.
 * URL: ?view=roles|groups · ?role=<roleId>
 */

const STAFF_TYPES = ['super_admin', 'senior_admin', 'support_agent', 'content_moderator'];
const GROUPS = [
  {
    domain: 'role_group_staff_entity_types',
    title: 'Staff account types',
    text: 'Which account types count as GTH staff.',
  },
  {
    domain: 'role_group_moderation',
    title: 'Moderate content',
    text: 'Can work the flag queue and decide flags.',
  },
  {
    domain: 'role_group_moderation_senior',
    title: 'Senior moderation',
    text: 'Can restore content and remove content proactively.',
  },
  {
    domain: 'role_group_reporting',
    title: 'Run reports',
    text: 'Can generate reports (each role is limited to its presets).',
  },
  {
    domain: 'role_group_comms_template_manager',
    title: 'Manage message templates',
    text: 'Can create and edit comms templates.',
  },
  {
    domain: 'role_group_comms_direct_sender',
    title: 'Message a user',
    text: 'Can send a direct message to one account.',
  },
  {
    domain: 'role_group_comms_bulk_sender',
    title: 'Send bulk messages',
    text: 'Can send to a group of accounts.',
  },
];

const Pill = ({ on, onClick, children }) => (
  <button
    type="button"
    aria-pressed={on}
    onClick={onClick}
    className={classNames(
      'h-[34px] cursor-pointer rounded-full border border-solid px-[14px] font-sans text-[13px] font-semibold',
      on ? 'border-[#1c2a21] bg-[#1c2a21] text-white' : 'border-[#e1eae2] bg-white text-[#595959]'
    )}
  >
    {children}
  </button>
);

/* ── One role: holders + permissions by scope ───────────────────────────── */
const RoleDetail = ({ role, canEdit, onChanged, onClose }) => {
  const [toastEl, toast] = useAdminToast();
  const roleId = docId(role);
  const perms = useAdminData(() => rbacRolePermissions(roleId), [roleId]);
  const holders = useAdminData(() => rbacRoleHolders(roleId), [roleId]);
  const scopes = useAdminData(() => rbacScopes({ scopeLevel: 'service' }), []);
  const [scopeId, setScopeId] = useState('');
  const scopePerms = useAdminData(
    () => (scopeId ? rbacScopePermissions(scopeId) : Promise.resolve([])),
    [scopeId]
  );
  const [busy, setBusy] = useState('');
  const held = useMemo(
    () => new Set((perms.data ?? []).map((p) => String(p._id || p.id || p.permissionId))),
    [perms.data]
  );
  const locked = role.isSystemRole || !canEdit;
  const byScope = useMemo(() => {
    const m = {};
    (perms.data ?? []).forEach((p) => {
      const s = p.scope || {};
      const key =
        s.scopeLevel === 'global'
          ? 'Global'
          : humanize(s.serviceName || s.modelName || s.scopeLevel || 'other');
      (m[key] ||= []).push(p);
    });
    return Object.entries(m).sort((a, b) => b[1].length - a[1].length);
  }, [perms.data]);

  const toggle = async (p, on) => {
    const pid = String(p._id || p.id);
    setBusy(pid);
    try {
      if (on) await rbacAssignPermission(roleId, pid);
      else await rbacRemovePermission(roleId, pid);
      await rbacClearRoleCache(roleId).catch(() => null);
      perms.reload();
      onChanged?.();
    } catch (e) {
      toast('Couldn’t change the permission', adminError(e), 'error');
    } finally {
      setBusy('');
    }
  };

  return (
    <GroupCard
      title={`${role.name}${role.isSystemRole ? ' · system role' : ''}`}
      description={`${role.description || 'No description.'} Code ${role.code || '—'} · for ${humanize(role.entityType || 'any account type')}.`}
    >
      <div className="flex flex-col gap-[16px]">
        <div className="flex flex-wrap gap-[14px]">
          <TextAction tone="green" onClick={onClose}>
            ← All roles
          </TextAction>
          <TextAction
            tone="green"
            onClick={async () => {
              await rbacClearRoleCache(roleId).catch(() => null);
              toast('Cache cleared', 'Permission checks use the new grants straight away.');
            }}
          >
            Clear permission cache
          </TextAction>
        </div>
        <p className="m-0 font-sans text-[14px] text-[#595959]">
          {perms.loading ? 'Loading permissions…' : `${(perms.data ?? []).length} permissions`} ·{' '}
          {holders.loading ? '…' : `${(holders.data ?? []).length} accounts hold this role`}
          {role.isSystemRole
            ? ' · System roles are managed by the platform seeders and can’t be edited here.'
            : ''}
        </p>
        <AdminLoadNotice
          loading={perms.loading}
          error={perms.error}
          status={perms.status}
          onRetry={perms.reload}
        >
          <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
            {byScope.slice(0, 40).map(([scope, list]) => (
              <details
                key={scope}
                className="rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[12px] py-[8px]"
              >
                <summary className="cursor-pointer font-sans text-[14px] font-semibold text-[#1c2a21]">
                  {scope} · {list.length}
                </summary>
                <ul className="m-0 mt-[6px] flex list-none flex-col gap-[4px] p-0">
                  {list.map((p) => (
                    <li
                      key={String(p._id || p.id)}
                      className="flex items-center justify-between gap-[8px] font-sans text-[13px]"
                    >
                      <span>
                        {humanize(p.action)}{' '}
                        {p.name ? <span className="text-[#737373]">· {p.name}</span> : null}
                      </span>
                      {!locked ? (
                        <button
                          type="button"
                          disabled={busy === String(p._id || p.id)}
                          onClick={() => toggle(p, false)}
                          className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-[#902b20] underline"
                        >
                          Revoke
                        </button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
          {byScope.length > 40 ? (
            <p className="m-0 font-sans text-[13px] text-[#737373]">
              Showing the 40 largest groups.
            </p>
          ) : null}
        </AdminLoadNotice>

        {!locked ? (
          <div className="flex flex-col gap-[10px] rounded-[16px] bg-[#f8f8f4] p-[14px]">
            <span className="font-sans text-[14px] font-semibold text-[#1c2a21]">
              Grant permissions on a service
            </span>
            <Select
              label="Service"
              searchable
              options={(scopes.data ?? []).map((s) => ({
                value: docId(s),
                label: humanize(s.serviceName || s.description || docId(s)),
              }))}
              value={scopeId}
              onChange={setScopeId}
              helperText={scopes.loading ? 'Loading services…' : scopes.error || undefined}
            />
            {scopeId ? (
              <div className="flex flex-wrap gap-[8px]">
                {(scopePerms.data ?? []).map((p) => {
                  const pid = String(p._id || p.id);
                  const on = held.has(pid);
                  return (
                    <Pill key={pid} on={on} onClick={() => busy !== pid && toggle(p, !on)}>
                      {busy === pid ? '…' : `${on ? '✓ ' : ''}${humanize(p.action)}`}
                    </Pill>
                  );
                })}
                {scopePerms.loading ? (
                  <span className="font-sans text-[13px] text-[#737373]">Loading…</span>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-col gap-[6px]">
          <span className="font-sans text-[14px] font-semibold text-[#1c2a21]">Who holds it</span>
          <ul className="m-0 flex max-h-[220px] list-none flex-col gap-[4px] overflow-auto p-0 font-sans text-[13px]">
            {(holders.data ?? []).slice(0, 100).map((h) => (
              <li key={String(h._id || h.id || h.entityId)} className="flex justify-between">
                <span className="font-semibold">
                  {h.name || h.entity?.name || String(h.entityId || h._id || '').slice(-8)}
                </span>
                <span className="text-[#737373]">{humanize(h.type || h.entity?.type || '')}</span>
              </li>
            ))}
            {!holders.loading && !(holders.data ?? []).length ? (
              <li className="text-[#737373]">Nobody yet.</li>
            ) : null}
          </ul>
        </div>
      </div>
      {toastEl}
    </GroupCard>
  );
};

/* ── Role groups ────────────────────────────────────────────────────────── */
const RoleGroups = ({ canEdit }) => {
  const [toastEl, toast] = useAdminToast();
  const groups = useAdminData(async () => {
    const res = await Promise.all(GROUPS.map((g) => enumList(g.domain).catch(() => null)));
    return Object.fromEntries(GROUPS.map((g, i) => [g.domain, res[i]]));
  }, []);
  const [busy, setBusy] = useState('');
  const set = async (domain, type, on, current) => {
    setBusy(`${domain}:${type}`);
    try {
      if (on) await enumRegister({ domain, key: type, label: humanize(type) });
      else await enumDeactivate(docId(current));
      toast(
        on ? 'Added' : 'Removed',
        `${humanize(type)} ${on ? 'can now' : 'can no longer'}: ${GROUPS.find((g) => g.domain === domain)?.title.toLowerCase()}.`
      );
      groups.reload();
    } catch (e) {
      toast('Couldn’t change the group', adminError(e), 'error');
    } finally {
      setBusy('');
    }
  };
  return (
    <GroupCard
      title="Role groups"
      description="What each staff type may do in the admin tools. Changes apply within the hour (the list is cached)."
      gap="gap-0"
    >
      <AdminLoadNotice
        loading={groups.loading}
        error={groups.error}
        status={groups.status}
        onRetry={groups.reload}
      >
        {GROUPS.map((g) => {
          const members = groups.data?.[g.domain];
          return (
            <SettingRow
              key={g.domain}
              title={g.title}
              description={members == null ? `${g.text} (couldn’t load)` : g.text}
              top
              control={
                <div className="flex max-w-[460px] flex-wrap justify-end gap-[6px]">
                  {STAFF_TYPES.map((t) => {
                    const current = (members ?? []).find(
                      (m) => m.key === t && m.isActive !== false
                    );
                    const on = Boolean(current);
                    return (
                      <Pill
                        key={t}
                        on={on}
                        onClick={() => canEdit && busy === '' && set(g.domain, t, !on, current)}
                      >
                        {busy === `${g.domain}:${t}` ? '…' : humanize(t)}
                      </Pill>
                    );
                  })}
                </div>
              }
            />
          );
        })}
      </AdminLoadNotice>
      {toastEl}
    </GroupCard>
  );
};

/* ── Tab ────────────────────────────────────────────────────────────────── */
const RolesPermissionsTab = ({ data, session }) => {
  const [toastEl, toast] = useAdminToast();
  const canEdit = session?.role === 'super';
  const view = data.view === 'groups' ? 'groups' : 'roles';
  const roles = useAdminData(() => rbacRoles(), []);
  const stats = useAdminData(() => rbacStats().catch(() => null), []);
  const selectedId = data.params.get('role');
  const selected = (roles.data ?? []).find((r) => docId(r) === selectedId);
  const [filter, setFilter] = useState('');
  const [dialog, setDialog] = useState(null); // { kind: 'create' | 'edit' | 'delete', role }
  const [form, setForm] = useState({ name: '', description: '', entityType: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const list = (roles.data ?? [])
    .filter(
      (r) =>
        !filter ||
        `${r.name} ${r.code} ${r.entityType}`.toLowerCase().includes(filter.toLowerCase())
    )
    .sort(
      (a, b) =>
        Number(b.isSystemRole) - Number(a.isSystemRole) ||
        String(a.name).localeCompare(String(b.name))
    );

  const save = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      if (dialog.kind === 'create') {
        if (!form.name.trim()) throw new Error('Give the role a name.');
        await rbacCreateRole({
          name: form.name.trim(),
          description: form.description.trim(),
          entityType: form.entityType || undefined,
        });
        toast('Role created', form.name);
      } else if (dialog.kind === 'edit') {
        await rbacUpdateRole(docId(dialog.role), {
          name: form.name.trim(),
          description: form.description.trim(),
        });
        toast('Role saved', form.name);
      } else {
        await rbacDeleteRole(docId(dialog.role), true);
        toast('Role deleted', dialog.role.name);
        data.update({ role: null });
      }
      setDialog(null);
      roles.reload();
    } catch (e) {
      setError(e?.response ? adminError(e) : e.message);
    } finally {
      setBusy(false);
    }
  };
  log('render', { view, roles: list.length, selected: Boolean(selected) });

  const s = stats.data?.stats;
  return (
    <>
      <div className="flex flex-wrap items-center gap-[8px]">
        <Pill on={view === 'roles'} onClick={() => data.update({ view: null })}>
          Roles
        </Pill>
        <Pill on={view === 'groups'} onClick={() => data.update({ view: 'groups', role: null })}>
          Role groups
        </Pill>
        {s ? (
          <span className="ml-auto font-sans text-[13px] text-[#737373]">
            {s.roles?.total ?? '–'} roles ({s.roles?.custom ?? 0} custom) ·{' '}
            {Number(s.permissions?.total ?? 0).toLocaleString('en-GB')} permissions ·{' '}
            {Number(s.entities ?? 0).toLocaleString('en-GB')} accounts
          </span>
        ) : null}
      </div>

      {view === 'groups' ? (
        <RoleGroups canEdit={canEdit} />
      ) : selected ? (
        <RoleDetail
          role={selected}
          canEdit={canEdit}
          onChanged={stats.reload}
          onClose={() => data.update({ role: null })}
        />
      ) : (
        <GroupCard
          title="Roles"
          description="Every role on the platform. System roles come from the platform seeders; custom roles are yours to shape."
          gap="gap-0"
        >
          <div className="flex flex-wrap items-end gap-[12px] pb-[12px]">
            <TextInput
              label="Find a role"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            {canEdit ? (
              <TextAction
                tone="green"
                onClick={() => {
                  setForm({ name: '', description: '', entityType: '' });
                  setError('');
                  setDialog({ kind: 'create' });
                }}
              >
                + New custom role
              </TextAction>
            ) : null}
          </div>
          <AdminLoadNotice
            loading={roles.loading}
            error={roles.error}
            status={roles.status}
            onRetry={roles.reload}
          >
            {list.map((r) => (
              <SettingRow
                key={docId(r)}
                title={`${r.name}${r.isSystemRole ? ' · system' : ''}`}
                description={`${r.code || '—'} · ${humanize(r.entityType || 'any account type')}${r.description ? ` · ${r.description}` : ''}`}
                top
                control={
                  <div className="flex items-center gap-[14px]">
                    <TextAction tone="green" onClick={() => data.update({ role: docId(r) })}>
                      Open
                    </TextAction>
                    {canEdit && !r.isSystemRole ? (
                      <>
                        <TextAction
                          tone="green"
                          onClick={() => {
                            setForm({
                              name: r.name || '',
                              description: r.description || '',
                              entityType: r.entityType || '',
                            });
                            setError('');
                            setDialog({ kind: 'edit', role: r });
                          }}
                        >
                          Edit
                        </TextAction>
                        <TextAction
                          tone="green"
                          onClick={() => {
                            setError('');
                            setDialog({ kind: 'delete', role: r });
                          }}
                        >
                          Delete
                        </TextAction>
                      </>
                    ) : null}
                  </div>
                }
              />
            ))}
          </AdminLoadNotice>
        </GroupCard>
      )}

      {dialog?.kind === 'create' || dialog?.kind === 'edit' ? (
        <AdminConfirmDialog
          title={dialog.kind === 'create' ? 'New custom role' : `Edit ${dialog.role.name}`}
          body="Give it a clear name. Add permissions after it’s created."
          primary={{ label: busy ? 'Saving…' : 'Save', arrow: true }}
          secondary="Cancel"
          onPrimary={save}
          onClose={() => setDialog(null)}
        >
          <div className="flex flex-col gap-[12px]">
            <TextInput
              label="Name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <TextInput
              label="Description"
              optional
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
            {dialog.kind === 'create' ? (
              <TextInput
                label="For account type"
                optional
                placeholder="institution, recruiter, talent…"
                value={form.entityType}
                onChange={(e) => setForm((f) => ({ ...f, entityType: e.target.value.trim() }))}
                error={error || undefined}
              />
            ) : error ? (
              <p className="m-0 text-[14px] text-[#902b20]">{error}</p>
            ) : null}
          </div>
        </AdminConfirmDialog>
      ) : null}
      {dialog?.kind === 'delete' ? (
        <AdminConfirmDialog
          title={`Delete ${dialog.role.name}?`}
          body="Everyone holding it loses its permissions straight away."
          primary={{ label: busy ? 'Deleting…' : 'Delete role', tone: 'red' }}
          secondary="Cancel"
          onPrimary={save}
          onClose={() => setDialog(null)}
        >
          {error ? <p className="m-0 text-[14px] text-[#902b20]">{error}</p> : null}
        </AdminConfirmDialog>
      ) : null}
      {toastEl}
    </>
  );
};

export default RolesPermissionsTab;
