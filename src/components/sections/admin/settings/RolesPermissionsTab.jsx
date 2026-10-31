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
  rbacRolePermissionSummary,
  rbacRoles,
  rbacScopePermissions,
  rbacScopes,
  rbacStats,
  rbacCreateEntityType,
  rbacEntityTypes,
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
  {
    domain: 'role_group_support',
    title: 'Answer support queries',
    text: 'Can work the Support queue: claim, reply, add notes, escalate.',
  },
  {
    domain: 'role_group_support_senior',
    title: 'Senior support',
    text: 'Sees safeguarding concerns, takes escalations and can take over any query.',
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
/* One service group of a role: count in the summary line; its permissions load the first time it is opened. */
const ScopeGroup = ({ label, count, filters, roleId, locked, busy, onRevoke }) => {
  const [state, setState] = useState({ loaded: false, loading: false, items: [], error: '' });
  const load = async () => {
    if (state.loaded || state.loading) return;
    setState((x) => ({ ...x, loading: true, error: '' }));
    try {
      const lists = await Promise.all(filters.map((f) => rbacRolePermissions(roleId, f)));
      const seen = new Set();
      const items = lists.flat().filter((p) => {
        const id = String(p._id || p.id);
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
      setState({ loaded: true, loading: false, items, error: '' });
    } catch (e) {
      setState({ loaded: false, loading: false, items: [], error: adminError(e) });
    }
  };
  return (
    <details
      onToggle={(e) => e.currentTarget.open && load()}
      className="rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[12px] py-[8px]"
    >
      <summary className="cursor-pointer font-sans text-[14px] font-semibold text-[#1c2a21]">
        {label} · {count.toLocaleString('en-GB')}
      </summary>
      {state.loading ? (
        <p className="m-0 mt-[6px] font-sans text-[13px] text-[#737373]">Loading…</p>
      ) : null}
      {state.error ? (
        <p className="m-0 mt-[6px] font-sans text-[13px] text-[#902b20]">{state.error}</p>
      ) : null}
      {state.loaded ? (
        <ul className="m-0 mt-[6px] flex max-h-[320px] list-none flex-col gap-[4px] overflow-auto p-0">
          {state.items.map((p) => (
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
                  onClick={() => onRevoke(p)}
                  className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-[#902b20] underline"
                >
                  Revoke
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </details>
  );
};

const RoleDetail = ({ role, canEdit, onChanged, onClose }) => {
  const [toastEl, toast] = useAdminToast();
  const roleId = docId(role);
  // Counts per service first (Administrator holds ~12,000 permissions); a group's permissions load when it is opened.
  const perms = useAdminData(() => rbacRolePermissionSummary(roleId), [roleId]);
  const [version, setVersion] = useState(0);
  const holders = useAdminData(() => rbacRoleHolders(roleId), [roleId]);
  const scopes = useAdminData(() => rbacScopes({ scopeLevel: 'service' }), []);
  const [scopeId, setScopeId] = useState('');
  const scopePerms = useAdminData(
    () => (scopeId ? rbacScopePermissions(scopeId) : Promise.resolve([])),
    [scopeId]
  );
  const [busy, setBusy] = useState('');
  // What the role already holds under the service picked in "Grant permissions" (for the ✓ pills).
  const heldInScope = useAdminData(
    () => (scopeId ? rbacRolePermissions(roleId, { scopeId }) : Promise.resolve([])),
    [roleId, scopeId, version]
  );
  const held = useMemo(
    () => new Set((heldInScope.data ?? []).map((p) => String(p._id || p.id || p.permissionId))),
    [heldInScope.data]
  );
  const locked = role.isSystemRole || !canEdit;
  // Same grouping as before (Global, else service, else model), built from the server's counts; each entry keeps the
  // scope filters that make it up so the group can load its own permissions.
  const byScope = useMemo(() => {
    const m = {};
    (perms.data?.groups ?? []).forEach((g) => {
      const key =
        g.scopeLevel === 'global'
          ? 'Global'
          : humanize(g.serviceName || g.modelName || g.scopeLevel || 'other');
      const e = (m[key] ||= { count: 0, filters: [] });
      e.count += g.count;
      e.filters.push({
        scopeLevel: g.scopeLevel ?? '',
        serviceName: g.serviceName ?? '',
        modelName: g.modelName ?? '',
      });
    });
    return Object.entries(m).sort((a, b) => b[1].count - a[1].count);
  }, [perms.data]);
  const total = perms.data?.total ?? 0;

  const toggle = async (p, on) => {
    const pid = String(p._id || p.id);
    setBusy(pid);
    try {
      if (on) await rbacAssignPermission(roleId, pid);
      else await rbacRemovePermission(roleId, pid);
      await rbacClearRoleCache(roleId).catch(() => null);
      perms.reload();
      setVersion((v) => v + 1);
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
          {perms.loading ? 'Loading permissions…' : `${total.toLocaleString('en-GB')} permissions`}{' '}
          · {holders.loading ? '…' : `${(holders.data ?? []).length} accounts hold this role`}
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
            {byScope.slice(0, 40).map(([scope, g]) => (
              <ScopeGroup
                key={`${scope}:${version}`}
                label={scope}
                count={g.count}
                filters={g.filters}
                roleId={roleId}
                locked={locked}
                busy={busy}
                onRevoke={(p) => toggle(p, false)}
              />
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
  const [form, setForm] = useState({
    name: '',
    description: '',
    entityType: '',
    newType: '',
    newTypeDescription: '',
  });
  // Account (entity) types for the "For account type" dropdown; "__new__" creates one first.
  const entityTypes = useAdminData(() => rbacEntityTypes().catch(() => []), []);
  const typeOptions = [
    { value: '', label: 'Any account type' },
    ...(entityTypes.data ?? [])
      .map((t) => t.name)
      .filter(Boolean)
      .sort()
      .map((n) => ({ value: n, label: humanize(n) })),
    ...(canEdit ? [{ value: '__new__', label: '+ New account type…' }] : []),
  ];
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
        let entityType = form.entityType || undefined;
        if (entityType === '__new__') {
          const code = form.newType.trim();
          if (!/^[a-z][a-z0-9_]{1,39}$/.test(code)) {
            throw new Error(
              'Account type code: lowercase letters, numbers and _ (e.g. career_counsellor).'
            );
          }
          if ((entityTypes.data ?? []).some((t) => t.name === code))
            throw new Error(`“${code}” already exists — pick it from the list.`);
          await rbacCreateEntityType({
            name: code,
            description: form.newTypeDescription.trim() || undefined,
          });
          entityTypes.reload();
          entityType = code;
          // The type now exists: a retry (if the role step fails) reuses it instead of re-creating it.
          setForm((f) => ({ ...f, entityType: code, newType: '', newTypeDescription: '' }));
        }
        await rbacCreateRole({
          name: form.name.trim(),
          description: form.description.trim(),
          entityType,
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
                  setForm({
                    name: '',
                    description: '',
                    entityType: '',
                    newType: '',
                    newTypeDescription: '',
                  });
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
              <>
                <Select
                  label="For account type"
                  options={typeOptions}
                  value={form.entityType}
                  onChange={(v) => setForm((f) => ({ ...f, entityType: v }))}
                  helperText={entityTypes.loading ? 'Loading account types…' : undefined}
                />
                {form.entityType === '__new__' ? (
                  <>
                    <TextInput
                      label="New account type code"
                      required
                      placeholder="career_counsellor"
                      value={form.newType}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          newType: e.target.value.toLowerCase().replace(/[\s-]+/g, '_'),
                        }))
                      }
                      helperText="Lowercase letters, numbers and _. It can’t be renamed later."
                    />
                    <TextInput
                      label="What this account type is"
                      optional
                      value={form.newTypeDescription}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, newTypeDescription: e.target.value }))
                      }
                    />
                  </>
                ) : null}
                {error ? <p className="m-0 text-[14px] text-[#902b20]">{error}</p> : null}
              </>
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
