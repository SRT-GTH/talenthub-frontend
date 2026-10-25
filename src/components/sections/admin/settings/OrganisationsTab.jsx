import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { Select, TextInput, Textarea } from '../../../ui/form';
import {
  GroupCard,
  SettingRow,
  SettingsToggle,
  TextAction,
} from '../../talentSettings/SettingsBUi.jsx';
import AdminConfirmDialog from '../ui/AdminConfirmDialog.jsx';
import AdminLoadNotice from '../AdminLoadNotice.jsx';
import { useAdminData, useAdminToast } from '../useAdminData.js';
import {
  adminError,
  humanize,
  orgAddAdmin,
  orgAdminList,
  orgCreate,
  orgRemoveAdmin,
  orgTypes,
  orgUpdate,
  shortDate,
} from '../../../../services/admin.api.js';

const log = debug('OrganisationsTab');

/*
 * OrganisationsTab — Settings › Organisations and tenants, on /api/organizations.
 *   Platform tenants  GTH today; a Super Admin can create another (e.g. NTH, Nigeria Talent Hub). Each tenant shows a readiness
 *                     checklist: a record alone doesn't give a country its own branded platform yet (see NOT_YET).
 *   Organisations     institutions, companies, government and partners, filtered by type, status and tenant.
 *   Detail            settings (country, currency, timezone, branding, features, limits), status with a reason, admins, children.
 * Every create / change writes an audit record (ORGANIZATION_CREATED / _UPDATED / _STATUS_CHANGED).
 * URL: ?view=tenants|orgs · ?org=<id> · ?new=tenant|org
 */

const FALLBACK_TYPES = [
  'platform_tenant',
  'education',
  'corporate',
  'recruiter',
  'government',
  'partner',
];
const FEATURES = [
  'messaging',
  'notifications',
  'opportunities',
  'profiles',
  'posts',
  'analytics',
  'customBranding',
];
const featureLabel = (k) => (k === 'customBranding' ? 'Custom branding' : humanize(k));
const STATUS_TONE = {
  active: 'text-[#2a5730] bg-[#ebf1ec]',
  suspended: 'text-[#902b20] bg-[#fbeeec]',
  archived: 'text-[#595959] bg-[#f0f0f0]',
};
const CODE_RX = /^[a-z][a-z0-9-]{1,30}$/;

/** What a tenant record does not yet switch on by itself. Shown on every tenant so nobody assumes NTH is live after creating it. */
const NOT_YET = [
  [
    'Branding in the apps',
    'The web app always shows the GTH logo and colours; it doesn’t read a tenant’s branding yet.',
  ],
  ['Platform name in emails', 'Emails use one platform name (PLATFORM_NAME) for every tenant.'],
  [
    'Settings and templates',
    'Platform settings, notification templates and the onboarding template are shared by every tenant.',
  ],
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
const Status = ({ value }) => (
  <span
    className={classNames(
      'rounded-full px-[8px] py-[2px] font-sans text-[12px] font-semibold',
      STATUS_TONE[value] || STATUS_TONE.archived
    )}
  >
    {humanize(value || 'unknown')}
  </span>
);

/** Settings form shared by create and edit. `v` is a flat form state. */
const blankForm = (tenant) => ({
  name: '',
  uid: '',
  type: tenant ? 'platform_tenant' : 'education',
  platformTenantId: '',
  country: '',
  currency: '',
  timezone: tenant ? 'Africa/Accra' : '',
  locale: 'en',
  usernamePrefix: '',
  customDomain: '',
  primaryColor: '',
  secondaryColor: '',
  website: '',
  description: '',
  allowSelfRegistration: true,
  features: {
    messaging: true,
    notifications: true,
    opportunities: true,
    profiles: true,
    posts: true,
    analytics: false,
    customBranding: false,
  },
  maxUsers: '',
  adminEntityId: '',
  reason: '',
});
const formFromOrg = (o) => {
  const st = o.settings || {};
  return {
    ...blankForm(o.type === 'platform_tenant'),
    name: o.name || '',
    uid: o.uid || '',
    type: o.type || '',
    platformTenantId: o.platformTenantId ? String(o.platformTenantId) : '',
    country: st.country || '',
    currency: st.currency || '',
    timezone: st.timezone || '',
    locale: st.locale || 'en',
    usernamePrefix: st.usernamePrefix || '',
    customDomain: st.branding?.customDomain || '',
    primaryColor: st.branding?.primaryColor || '',
    secondaryColor: st.branding?.secondaryColor || '',
    website: st.website || '',
    description: st.description || '',
    allowSelfRegistration: st.allowSelfRegistration !== false,
    features: { ...blankForm(false).features, ...(st.features || {}) },
    maxUsers: st.limits?.maxUsers != null ? String(st.limits.maxUsers) : '',
  };
};
const settingsFromForm = (v) => {
  const s = {
    country: v.country.trim() || undefined,
    currency: v.currency.trim().toUpperCase() || undefined,
    timezone: v.timezone.trim() || undefined,
    locale: v.locale.trim() || undefined,
    usernamePrefix: v.usernamePrefix.trim(),
    website: v.website.trim() || undefined,
    description: v.description.trim() || undefined,
    allowSelfRegistration: v.allowSelfRegistration,
    branding: {
      customDomain: v.customDomain.trim().toLowerCase() || undefined,
      primaryColor: v.primaryColor.trim() || undefined,
      secondaryColor: v.secondaryColor.trim() || undefined,
    },
    features: v.features,
  };
  if (v.maxUsers !== '') s.limits = { maxUsers: Number(v.maxUsers) };
  return s;
};
const formError = (v, creating) => {
  if (v.name.trim().length < 3) return 'Give it a name (3+ characters).';
  if (creating && !CODE_RX.test(v.uid))
    return 'Short code: lowercase letters, numbers and hyphens, starting with a letter (e.g. nth).';
  if (v.currency && !/^[A-Za-z]{3}$/.test(v.currency.trim()))
    return 'Currency is a 3-letter code such as NGN or GHS.';
  if (v.primaryColor && !/^#[0-9a-fA-F]{6}$/.test(v.primaryColor.trim()))
    return 'Colours are hex values such as #1c2a21.';
  if (v.secondaryColor && !/^#[0-9a-fA-F]{6}$/.test(v.secondaryColor.trim()))
    return 'Colours are hex values such as #1c2a21.';
  if (v.maxUsers !== '' && !(Number(v.maxUsers) > 0))
    return 'Maximum users must be a positive number.';
  if (v.adminEntityId && !/^[a-f0-9]{24}$/i.test(v.adminEntityId.trim()))
    return 'The first admin is a 24-character entity id.';
  if (v.reason.trim().length < 10) return 'Add a reason (10+ characters) for the audit log.';
  return '';
};

const OrgForm = ({ v, set, creating, types, tenants }) => {
  const isTenant = v.type === 'platform_tenant';
  const f = (key) => ({ value: v[key], onChange: (e) => set({ [key]: e.target.value }) });
  return (
    <div className="flex max-h-[56vh] flex-col gap-[12px] overflow-auto pr-[4px]">
      <TextInput
        label="Name"
        required
        placeholder={isTenant ? 'Nigeria Talent Hub' : 'Organisation name'}
        {...f('name')}
      />
      {creating ? (
        <>
          <TextInput
            label="Short code"
            required
            placeholder={isTenant ? 'nth' : 'acme-ltd'}
            helperText="Used as the uid and slug. A tenant’s code is also its subdomain (nth.your-domain). Can’t be changed later."
            value={v.uid}
            onChange={(e) => set({ uid: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
          />
          {!isTenant ? (
            <>
              <Select
                label="Type"
                options={types
                  .filter((t) => t !== 'platform_tenant')
                  .map((t) => ({ value: t, label: humanize(t) }))}
                value={v.type}
                onChange={(val) => set({ type: val })}
              />
              <Select
                label="Platform tenant"
                options={[
                  { value: '', label: 'None' },
                  ...tenants.map((t) => ({ value: t.id, label: `${t.name} (${t.uid})` })),
                ]}
                value={v.platformTenantId}
                onChange={(val) => set({ platformTenantId: val })}
              />
            </>
          ) : null}
        </>
      ) : null}
      <div className="grid grid-cols-1 gap-[12px] md:grid-cols-2">
        <TextInput label="Country" placeholder="Nigeria" {...f('country')} />
        <TextInput label="Currency" placeholder="NGN" {...f('currency')} />
        <TextInput label="Timezone" placeholder="Africa/Lagos" {...f('timezone')} />
        <TextInput label="Language" placeholder="en" {...f('locale')} />
        <TextInput
          label="Username prefix"
          optional
          placeholder={isTenant ? 'nth' : ''}
          {...f('usernamePrefix')}
        />
        <TextInput label="Maximum users" optional inputMode="numeric" {...f('maxUsers')} />
        <TextInput
          label="Custom domain"
          optional
          placeholder="nigeriatalenthub.ng"
          {...f('customDomain')}
        />
        <TextInput label="Website" optional {...f('website')} />
        <TextInput label="Primary colour" optional placeholder="#1c2a21" {...f('primaryColor')} />
        <TextInput
          label="Secondary colour"
          optional
          placeholder="#ebf1ec"
          {...f('secondaryColor')}
        />
      </div>
      <Textarea label="Description" optional rows={2} {...f('description')} />
      <div className="flex flex-col gap-[8px] rounded-[12px] bg-[#f8f8f4] p-[12px]">
        <span className="font-sans text-[14px] font-semibold text-[#1c2a21]">Features</span>
        <div className="flex flex-wrap gap-[6px]">
          {FEATURES.map((k) => (
            <Pill
              key={k}
              on={Boolean(v.features[k])}
              onClick={() => set({ features: { ...v.features, [k]: !v.features[k] } })}
            >
              {v.features[k] ? '✓ ' : ''}
              {featureLabel(k)}
            </Pill>
          ))}
        </div>
        <label className="flex items-center justify-between gap-[12px] font-sans text-[14px] text-[#1c2a21]">
          People can sign up on their own
          <SettingsToggle
            checked={v.allowSelfRegistration}
            onChange={(x) => set({ allowSelfRegistration: x })}
            label="Self sign-up"
          />
        </label>
      </div>
      {creating ? (
        <TextInput
          label="First admin (entity id)"
          optional
          placeholder="24-character entity id"
          helperText="Optional. You can add admins after it’s created."
          {...f('adminEntityId')}
        />
      ) : null}
      <TextInput
        label="Reason"
        required
        placeholder="Why this change (for the audit log)"
        {...f('reason')}
      />
    </div>
  );
};

/* ── Detail ─────────────────────────────────────────────────────────────── */
const OrgDetail = ({ org, all, canEdit, canTenant, onChanged, onClose, toast }) => {
  const isTenant = org.type === 'platform_tenant';
  const mayEdit = canEdit && (!isTenant || canTenant);
  const [dialog, setDialog] = useState(null); // 'edit' | 'status' | 'admin' | { removeAdmin }
  const [v, setV] = useState(() => formFromOrg(org));
  const [nextStatus, setNextStatus] = useState('');
  const [reason, setReason] = useState('');
  const [adminId, setAdminId] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const children = all.filter((o) => String(o.platformTenantId || '') === org.id);
  const parent = all.find((o) => o.id === String(org.platformTenantId || ''));
  const st = org.settings || {};
  const open = (d) => {
    setError('');
    setReason('');
    setV(formFromOrg(org));
    setDialog(d);
  };
  const run = async (fn, okTitle, okBody) => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await fn();
      toast(okTitle, okBody);
      setDialog(null);
      onChanged();
    } catch (e) {
      setError(e?.response ? adminError(e) : e.message);
    } finally {
      setBusy(false);
    }
  };
  const saveEdit = () => {
    const err = formError(v, false);
    if (err) return setError(err);
    return run(
      () =>
        orgUpdate({
          organizationId: org.id,
          name: v.name.trim(),
          settings: settingsFromForm(v),
          reason: v.reason.trim(),
        }),
      'Saved',
      `${v.name} settings updated.`
    );
  };
  const saveStatus = () => {
    if (reason.trim().length < 10) return setError('Add a reason (10+ characters).');
    return run(
      () => orgUpdate({ organizationId: org.id, status: nextStatus, reason: reason.trim() }),
      'Status changed',
      `${org.name} is now ${nextStatus}.`
    );
  };
  const addAdmin = () => {
    if (!/^[a-f0-9]{24}$/i.test(adminId.trim())) return setError('Paste a 24-character entity id.');
    return run(
      () => orgAddAdmin(org.id, adminId.trim()),
      'Admin added',
      `${org.name} has a new admin.`
    );
  };
  const rows = [
    ['Short code', `${org.uid}${org.slug && org.slug !== org.uid ? ` · slug ${org.slug}` : ''}`],
    ['Type', humanize(org.type)],
    !isTenant
      ? [
          'Platform tenant',
          parent ? `${parent.name} (${parent.uid})` : 'None — not linked to a tenant',
        ]
      : null,
    ['Country · currency', `${st.country || '—'} · ${st.currency || '—'}`],
    ['Timezone · language', `${st.timezone || '—'} · ${st.locale || '—'}`],
    ['Username prefix', st.usernamePrefix || '—'],
    ['Custom domain', st.branding?.customDomain || '—'],
    [
      'Colours',
      [st.branding?.primaryColor, st.branding?.secondaryColor].filter(Boolean).join(' · ') || '—',
    ],
    [
      'Features',
      FEATURES.filter((k) => st.features?.[k])
        .map(featureLabel)
        .join(', ') || 'None',
    ],
    ['Self sign-up', st.allowSelfRegistration === false ? 'Off' : 'On'],
    [
      'Limits',
      st.limits ? `${Number(st.limits.maxUsers ?? 0).toLocaleString('en-GB')} users` : '—',
    ],
    [
      'Subscription',
      org.subscription
        ? `${humanize(org.subscription.plan || '—')} · ${humanize(org.subscription.status || '—')}`
        : '—',
    ],
    ['Created', shortDate(org.createdAt)],
  ].filter(Boolean);

  return (
    <GroupCard
      title={org.name}
      description={isTenant ? 'Platform tenant' : `${humanize(org.type)} organisation`}
    >
      <div className="flex flex-col gap-[16px]">
        <div className="flex flex-wrap items-center gap-[14px]">
          <TextAction tone="green" onClick={onClose}>
            ← All
          </TextAction>
          <Status value={org.status} />
          {mayEdit ? (
            <>
              <TextAction tone="green" onClick={() => open('edit')}>
                Edit settings
              </TextAction>
              {['active', 'suspended', 'archived']
                .filter((s) => s !== org.status)
                .map((s) => (
                  <TextAction
                    key={s}
                    tone={s === 'active' ? 'green' : 'danger'}
                    onClick={() => {
                      setNextStatus(s);
                      open('status');
                    }}
                  >
                    {s === 'active' ? 'Reactivate' : s === 'suspended' ? 'Suspend' : 'Archive'}
                  </TextAction>
                ))}
            </>
          ) : null}
          <Link
            className="font-sans text-[14px] font-semibold text-[#2a5730]"
            to={`/admin/audit-log?q=${org.id}`}
          >
            Audit history
          </Link>
        </div>

        <dl className="m-0 grid grid-cols-1 gap-x-[24px] gap-y-[8px] md:grid-cols-2">
          {rows.map(([k, val]) => (
            <div key={k} className="flex flex-col">
              <dt className="font-sans text-[12px] font-semibold uppercase tracking-[0.04em] text-[#737373]">
                {k}
              </dt>
              <dd className="m-0 font-sans text-[14px] text-[#1c2a21]">{val}</dd>
            </div>
          ))}
        </dl>

        {isTenant ? (
          <div className="flex flex-col gap-[8px] rounded-[16px] bg-[#f8f8f4] p-[14px]">
            <span className="font-sans text-[14px] font-semibold text-[#1c2a21]">Readiness</span>
            <ul className="m-0 flex list-none flex-col gap-[6px] p-0 font-sans text-[14px]">
              <li>✓ Tenant record · code “{org.uid}”</li>
              <li>
                {org.admins?.length ? '✓' : '○'} Tenant admin{' '}
                {org.admins?.length ? `(${org.admins.length})` : '— add one below'}
              </li>
              <li>
                {children.length ? '✓' : '○'} Organisations under this tenant ({children.length})
              </li>
              <li>
                ○ Address — point {org.slug}.&lt;your domain&gt;
                {st.branding?.customDomain ? ` or ${st.branding.customDomain}` : ''} at the platform
                (DNS, set up outside the admin). The API already picks the tenant from the
                subdomain, domain or X-Organization header.
              </li>
              {NOT_YET.map(([t, text]) => (
                <li key={t}>
                  ✕ {t} — <span className="text-[#595959]">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex flex-col gap-[6px]">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[14px] font-semibold text-[#1c2a21]">Admins</span>
            {mayEdit ? (
              <TextAction
                tone="green"
                onClick={() => {
                  setAdminId('');
                  open('admin');
                }}
              >
                + Add admin
              </TextAction>
            ) : null}
          </div>
          <ul className="m-0 flex list-none flex-col gap-[4px] p-0 font-sans text-[14px]">
            {(org.admins || []).map((a) => (
              <li key={a.entityId} className="flex items-center justify-between gap-[8px]">
                {a.userId ? (
                  <Link className="font-semibold text-[#2a5730]" to={`/admin/accounts/${a.userId}`}>
                    {a.name || a.email || a.entityId}
                  </Link>
                ) : (
                  <span className="font-semibold">{a.entityId} · no account found</span>
                )}
                <span className="text-[#737373]">{a.email || ''}</span>
                {mayEdit && org.admins.length > 1 ? (
                  <TextAction onClick={() => setDialog({ removeAdmin: a })}>Remove</TextAction>
                ) : null}
              </li>
            ))}
            {!(org.admins || []).length ? <li className="text-[#737373]">No admins.</li> : null}
          </ul>
        </div>

        {isTenant ? (
          <div className="flex flex-col gap-[6px]">
            <span className="font-sans text-[14px] font-semibold text-[#1c2a21]">
              Organisations under {org.uid.toUpperCase()}
            </span>
            <ul className="m-0 flex max-h-[240px] list-none flex-col gap-[4px] overflow-auto p-0 font-sans text-[14px]">
              {children.map((c) => (
                <li key={c.id} className="flex justify-between gap-[8px]">
                  <span>{c.name}</span>
                  <span className="text-[#737373]">
                    {humanize(c.type)} · {humanize(c.status)}
                  </span>
                </li>
              ))}
              {!children.length ? <li className="text-[#737373]">None yet.</li> : null}
            </ul>
          </div>
        ) : null}
      </div>

      {dialog === 'edit' ? (
        <AdminConfirmDialog
          title={`Edit ${org.name}`}
          body="Only what you change is saved; other settings stay as they are."
          primary={{ label: busy ? 'Saving…' : 'Save', arrow: true }}
          secondary="Cancel"
          onPrimary={saveEdit}
          onClose={() => setDialog(null)}
        >
          <OrgForm
            v={v}
            set={(p) => setV((x) => ({ ...x, ...p }))}
            creating={false}
            types={[]}
            tenants={[]}
          />
          {error ? <p className="m-0 mt-[8px] text-[14px] text-[#902b20]">{error}</p> : null}
        </AdminConfirmDialog>
      ) : null}
      {dialog === 'status' ? (
        <AdminConfirmDialog
          title={`${nextStatus === 'active' ? 'Reactivate' : nextStatus === 'suspended' ? 'Suspend' : 'Archive'} ${org.name}?`}
          body={
            nextStatus === 'active'
              ? 'It becomes available again.'
              : isTenant
                ? 'The tenant stops being picked for requests; its organisations stay linked to it.'
                : 'It disappears from public organisation lists and sign-up.'
          }
          primary={{
            label: busy ? 'Saving…' : 'Confirm',
            tone: nextStatus === 'active' ? 'green' : 'red',
            arrow: nextStatus === 'active',
          }}
          secondary="Cancel"
          onPrimary={saveStatus}
          onClose={() => setDialog(null)}
        >
          <TextInput
            label="Reason"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            error={error || undefined}
          />
        </AdminConfirmDialog>
      ) : null}
      {dialog === 'admin' ? (
        <AdminConfirmDialog
          title={`Add an admin to ${org.name}`}
          body="Paste the account’s entity id (shown on the account’s detail page)."
          primary={{ label: busy ? 'Adding…' : 'Add admin', arrow: true }}
          secondary="Cancel"
          onPrimary={addAdmin}
          onClose={() => setDialog(null)}
        >
          <TextInput
            label="Entity id"
            required
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            error={error || undefined}
          />
        </AdminConfirmDialog>
      ) : null}
      {dialog?.removeAdmin ? (
        <AdminConfirmDialog
          title={`Remove ${dialog.removeAdmin.name || 'this admin'}?`}
          body={`They stop being an admin of ${org.name}. Their account is not changed otherwise.`}
          primary={{ label: busy ? 'Removing…' : 'Remove admin', tone: 'red' }}
          secondary="Cancel"
          onPrimary={() =>
            run(
              () => orgRemoveAdmin(org.id, dialog.removeAdmin.entityId),
              'Admin removed',
              org.name
            )
          }
          onClose={() => setDialog(null)}
        >
          {error ? <p className="m-0 text-[14px] text-[#902b20]">{error}</p> : null}
        </AdminConfirmDialog>
      ) : null}
    </GroupCard>
  );
};

/* ── Tab ────────────────────────────────────────────────────────────────── */
const OrganisationsTab = ({ data, session }) => {
  const [toastEl, toast] = useAdminToast();
  const canEdit = session?.role === 'super' || session?.role === 'senior';
  const canTenant = session?.role === 'super';
  const view = data.view === 'orgs' ? 'orgs' : 'tenants';
  const list = useAdminData(() => orgAdminList(), []);
  const types = useAdminData(async () => {
    const t = await orgTypes().catch(() => []);
    const codes = t.map((x) => x.code).filter(Boolean);
    return codes.length ? codes : FALLBACK_TYPES;
  }, []);
  const all = useMemo(() => list.data?.rows ?? [], [list.data]);
  const tenants = all.filter((o) => o.type === 'platform_tenant');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tenantFilter, setTenantFilter] = useState('');
  const [q, setQ] = useState('');
  const selected = all.find((o) => o.id === data.params.get('org'));
  const creating = data.params.get('new'); // 'tenant' | 'org'
  const [v, setV] = useState(() => blankForm(true));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const orgs = all
    .filter((o) => o.type !== 'platform_tenant')
    .filter((o) => !typeFilter || o.type === typeFilter)
    .filter((o) => !statusFilter || o.status === statusFilter)
    .filter(
      (o) =>
        !tenantFilter ||
        (tenantFilter === 'none'
          ? !o.platformTenantId
          : String(o.platformTenantId) === tenantFilter)
    )
    .filter((o) => !q || `${o.name} ${o.uid}`.toLowerCase().includes(q.toLowerCase()));

  const startCreate = (kind) => {
    setV({
      ...blankForm(kind === 'tenant'),
      platformTenantId: kind === 'org' && tenants.length === 1 ? tenants[0].id : '',
    });
    setError('');
    data.update({ new: kind, org: null });
  };
  const create = async () => {
    if (busy) return;
    const err = formError(v, true);
    if (err) return setError(err);
    setBusy(true);
    setError('');
    try {
      const res = await orgCreate({
        uid: v.uid,
        slug: v.uid,
        name: v.name.trim(),
        type: creating === 'tenant' ? 'platform_tenant' : v.type,
        platformTenantId: creating === 'tenant' ? undefined : v.platformTenantId || undefined,
        settings: settingsFromForm(v),
        adminEntityId: v.adminEntityId.trim() || undefined,
        reason: v.reason.trim(),
      });
      const id = String(res?.organization?._id || res?.organization?.id || '');
      toast('Created', `${v.name} (${v.uid}) is set up.`);
      list.reload();
      data.update({ new: null, org: id || null, view: creating === 'tenant' ? null : 'orgs' });
    } catch (e) {
      setError(e?.response ? adminError(e) : e.message);
    } finally {
      setBusy(false);
    }
  };
  log('render', { view, orgs: all.length, selected: Boolean(selected), creating });

  const row = (o) => (
    <SettingRow
      key={o.id}
      title={o.name}
      description={
        o.type === 'platform_tenant'
          ? `${o.uid} · ${o.settings?.country || 'no country'} · ${o.settings?.currency || '—'} · ${o.childCount} organisations · ${o.admins?.length || 0} admins`
          : `${humanize(o.type)} · ${o.uid} · ${tenants.find((t) => t.id === String(o.platformTenantId || ''))?.uid?.toUpperCase() || 'no tenant'}`
      }
      top
      control={
        <div className="flex items-center gap-[14px]">
          <Status value={o.status} />
          <TextAction tone="green" onClick={() => data.update({ org: o.id })}>
            Open
          </TextAction>
        </div>
      }
    />
  );

  return (
    <>
      <div className="flex flex-wrap items-center gap-[8px]">
        <Pill on={view === 'tenants'} onClick={() => data.update({ view: null, org: null })}>
          Platform tenants ({tenants.length})
        </Pill>
        <Pill on={view === 'orgs'} onClick={() => data.update({ view: 'orgs', org: null })}>
          Organisations ({all.length - tenants.length})
        </Pill>
      </div>

      {selected ? (
        <OrgDetail
          org={selected}
          all={all}
          canEdit={canEdit}
          canTenant={canTenant}
          toast={toast}
          onChanged={list.reload}
          onClose={() => data.update({ org: null })}
        />
      ) : view === 'tenants' ? (
        <GroupCard
          title="Platform tenants"
          description="Each tenant is a national talent hub (GTH today). Institutions and companies sit under a tenant."
          gap="gap-0"
        >
          {canTenant ? (
            <div className="pb-[12px]">
              <TextAction tone="green" onClick={() => startCreate('tenant')}>
                + New platform tenant
              </TextAction>
            </div>
          ) : null}
          <AdminLoadNotice
            loading={list.loading}
            error={list.error}
            status={list.status}
            onRetry={list.reload}
          >
            {tenants.map(row)}
            {!tenants.length ? (
              <p className="m-0 font-sans text-[14px] text-[#737373]">No tenants.</p>
            ) : null}
          </AdminLoadNotice>
        </GroupCard>
      ) : (
        <GroupCard
          title="Organisations"
          description="Institutions, companies, government bodies and partners on the platform."
          gap="gap-0"
        >
          <div className="flex flex-wrap items-end gap-[12px] pb-[12px]">
            <TextInput label="Find" value={q} onChange={(e) => setQ(e.target.value)} />
            <Select
              label="Type"
              options={[
                { value: '', label: 'All types' },
                ...(types.data ?? FALLBACK_TYPES)
                  .filter((t) => t !== 'platform_tenant')
                  .map((t) => ({ value: t, label: humanize(t) })),
              ]}
              value={typeFilter}
              onChange={setTypeFilter}
            />
            <Select
              label="Status"
              options={[
                { value: '', label: 'Any status' },
                ...['active', 'suspended', 'archived'].map((s) => ({
                  value: s,
                  label: humanize(s),
                })),
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
            />
            <Select
              label="Tenant"
              options={[
                { value: '', label: 'Any tenant' },
                ...tenants.map((t) => ({ value: t.id, label: t.uid.toUpperCase() })),
                { value: 'none', label: 'Not linked' },
              ]}
              value={tenantFilter}
              onChange={setTenantFilter}
            />
            {canEdit ? (
              <TextAction tone="green" onClick={() => startCreate('org')}>
                + New organisation
              </TextAction>
            ) : null}
          </div>
          <AdminLoadNotice
            loading={list.loading}
            error={list.error}
            status={list.status}
            onRetry={list.reload}
          >
            {orgs.map(row)}
            {!orgs.length ? (
              <p className="m-0 font-sans text-[14px] text-[#737373]">Nothing matches.</p>
            ) : null}
          </AdminLoadNotice>
        </GroupCard>
      )}

      {creating ? (
        <AdminConfirmDialog
          title={creating === 'tenant' ? 'New platform tenant' : 'New organisation'}
          body={
            creating === 'tenant'
              ? 'Creates the tenant record (for example NTH, Nigeria Talent Hub). Its readiness checklist shows what still needs doing outside this screen.'
              : 'Creates an organisation and, if you choose one, links it to a platform tenant.'
          }
          primary={{ label: busy ? 'Creating…' : 'Create', arrow: true }}
          secondary="Cancel"
          onPrimary={create}
          onClose={() => data.update({ new: null })}
        >
          <OrgForm
            v={v}
            set={(p) => setV((x) => ({ ...x, ...p }))}
            creating
            types={types.data ?? FALLBACK_TYPES}
            tenants={tenants}
          />
          {error ? <p className="m-0 mt-[8px] text-[14px] text-[#902b20]">{error}</p> : null}
        </AdminConfirmDialog>
      ) : null}
      {toastEl}
    </>
  );
};

export default OrganisationsTab;
