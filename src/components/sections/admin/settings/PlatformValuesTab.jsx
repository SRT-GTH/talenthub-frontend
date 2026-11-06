import { useMemo, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { Checkbox, TextInput, Textarea } from '../../../ui/form';
import { GroupCard, TextAction } from '../../talentSettings/SettingsBUi.jsx';
import AdminConfirmDialog from '../ui/AdminConfirmDialog.jsx';
import { useAdminData, useAdminToast } from '../useAdminData.js';
import AdminLoadNotice from '../AdminLoadNotice.jsx';
import {
  adminError,
  deactivatePlatformValue,
  humanize,
  listPlatformValues,
  registerPlatformValue,
  shortDate,
} from '../../../../services/admin.api.js';

const log = debug('PlatformValuesTab');

/*
 * PlatformValuesTab — Settings › Platform values (Super Admin). The platform's extensible lists (education levels, consent types,
 * report statuses …) as they are in the database right now: GET /api/platform-enums/all (platformEnum.listAll reads the
 * platformEnums collection, active and inactive values, so values added at runtime show up — not the seed files).
 *   Add a value      POST /api/platform-enums/register (a custom, global value; registering a deactivated key turns it back on)
 *   Deactivate       PUT /api/platform-enums/:id/deactivate (custom values only; built-in values come with the platform)
 * Lists that control access or safety (role groups, entity types, guardrails …) are read-only here: the backend refuses changes
 * (ENUM_DOMAIN_PROTECTED); they change in code with a review.
 */

const KEY_RE = /^[a-z][a-z0-9_]{1,63}$/;
const keyOf = (label) =>
  String(label || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/^(\d)/, 'v_$1')
    .slice(0, 64);

const TONES = {
  grey: 'bg-[#f2f2f2] text-[#575755]',
  green: 'bg-[#ebf1ec] text-[#2a5730]',
  amber: 'bg-[#fdf3e1] text-[#8a5a00]',
  red: 'bg-[#fbeeed] text-[#902b20]',
  blue: 'bg-[#eaf1fb] text-[#24508f]',
};
const Chip = ({ tone = 'grey', children }) => (
  <span
    className={`inline-flex items-center rounded-full px-[8px] py-[2px] font-sans text-[12px] leading-[16px] font-semibold whitespace-nowrap ${TONES[tone]}`}
  >
    {children}
  </span>
);

const typeOf = (v) =>
  v.isBuiltIn ? 'Built-in' : v.scope === 'organization' ? 'Organisation' : 'Custom';
const typeTone = (v) => (v.isBuiltIn ? 'grey' : v.scope === 'organization' ? 'blue' : 'green');
const BLANK = { label: '', key: '', keyTouched: false, description: '', sortOrder: '' };

const PlatformValuesTab = ({ session }) => {
  const res = useAdminData(() => listPlatformValues(), []);
  const [toastEl, toast] = useAdminToast();
  const [query, setQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [open, setOpen] = useState(() => new Set());
  // { kind: 'add', domain } | { kind: 'deactivate' | 'reactivate', value }
  const [dialog, setDialog] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const domains = useMemo(() => res.data?.domains ?? [], [res.data]);
  const values = useMemo(() => res.data?.values ?? [], [res.data]);
  const byDomain = useMemo(() => {
    const m = new Map();
    values.forEach((v) => m.set(v.domain, [...(m.get(v.domain) ?? []), v]));
    return m;
  }, [values]);

  const q = query.trim().toLowerCase();
  const shown = useMemo(
    () =>
      domains
        .map((d) => {
          const rows = (byDomain.get(d.domain) ?? []).filter((v) => showInactive || v.isActive);
          const domainHit =
            !q || d.domain.includes(q) || humanize(d.domain).toLowerCase().includes(q);
          const hits = domainHit
            ? rows
            : rows.filter((v) =>
                `${v.key} ${v.label} ${v.description ?? ''}`.toLowerCase().includes(q)
              );
          return { ...d, rows: hits, match: domainHit || hits.length > 0 };
        })
        .filter((d) => d.match),
    [domains, byDomain, q, showInactive]
  );

  if (session?.role !== 'super') {
    return <AdminLoadNotice error="Only Super Admins see platform values." status={403} />;
  }
  if (res.loading || res.error) {
    return (
      <AdminLoadNotice
        loading={res.loading}
        error={res.error}
        status={res.status}
        onRetry={res.reload}
      />
    );
  }

  const totals = {
    values: values.length,
    active: values.filter((v) => v.isActive).length,
    custom: values.filter((v) => !v.isBuiltIn).length,
  };
  const toggle = (domain) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(domain)) n.delete(domain);
      else n.add(domain);
      return n;
    });
  const openDialog = (d) => {
    setError('');
    setDialog(d);
  };
  const close = () => {
    if (!busy) setDialog(null);
  };

  const run = async (fn, done) => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await fn();
      done();
      setDialog(null);
      res.reload();
    } catch (e) {
      setError(adminError(e));
    } finally {
      setBusy(false);
    }
  };

  const add = () => {
    const label = form.label.trim();
    const key = form.key.trim();
    const existing = (byDomain.get(dialog.domain) ?? []).find(
      (v) => v.key === key && v.scope === 'global'
    );
    if (label.length < 2) return setError('Give the value a label people will read.');
    if (!KEY_RE.test(key)) {
      return setError(
        'The key is lower-case letters, numbers and _ (2–64 characters), starting with a letter.'
      );
    }
    if (existing?.isActive) return setError(`“${key}” is already in this list.`);
    const sortOrder = form.sortOrder === '' ? undefined : Number(form.sortOrder);
    if (sortOrder !== undefined && !Number.isFinite(sortOrder)) {
      return setError('Order is a number.');
    }
    return run(
      () =>
        registerPlatformValue({
          domain: dialog.domain,
          key,
          label,
          description: form.description.trim() || undefined,
          sortOrder,
        }),
      () => {
        log('added', dialog.domain, key);
        toast(
          existing ? 'Value turned back on' : 'Value added',
          `${label} is now in ${humanize(dialog.domain)}.`
        );
      }
    );
  };

  return (
    <>
      <GroupCard
        title="Platform values"
        description={`The lists the platform checks values against, read live from the database: ${domains.length} lists · ${totals.values} values (${totals.active} active, ${totals.custom} custom). Built-in values come with the platform and can’t be removed.`}
      >
        <div className="flex flex-col gap-[14px]">
          <div className="flex flex-wrap items-end gap-[16px]">
            <div className="min-w-[240px] flex-1">
              <TextInput
                label="Search lists and values"
                placeholder="education, consent, shs …"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="pb-[6px]">
              <Checkbox
                label="Show deactivated values"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                labelClassName="text-[14px] font-medium"
              />
            </div>
            <div className="flex gap-[14px] pb-[10px]">
              <TextAction tone="green" onClick={() => setOpen(new Set(shown.map((d) => d.domain)))}>
                Open all
              </TextAction>
              <TextAction tone="green" onClick={() => setOpen(new Set())}>
                Close all
              </TextAction>
            </div>
          </div>

          {shown.length === 0 ? (
            <p className="m-0 font-sans text-[14px] text-[#595959]">
              {domains.length
                ? `No list or value matches “${query}”.`
                : 'No values in the database yet.'}
            </p>
          ) : null}

          <ul className="m-0 flex list-none flex-col gap-[8px] p-0">
            {shown.map((d) => {
              const isOpen = open.has(d.domain) || Boolean(q);
              return (
                <li
                  key={d.domain}
                  className="rounded-[14px] border border-solid border-[#e7e7e7] bg-white"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggle(d.domain)}
                    className="flex w-full cursor-pointer flex-wrap items-center gap-[10px] rounded-[14px] border-0 bg-transparent px-[14px] py-[12px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                  >
                    <span
                      aria-hidden="true"
                      className="w-[12px] font-sans text-[12px] text-[#737373]"
                    >
                      {isOpen ? '▾' : '▸'}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="font-sans text-[15px] leading-[20px] font-semibold text-[#1c2a21]">
                        {humanize(d.domain)}
                      </span>
                      <span className="font-mono text-[12px] text-[#737373]">{d.domain}</span>
                    </span>
                    <span className="font-sans text-[13px] text-[#595959]">
                      {d.active} active
                      {d.total > d.active ? ` · ${d.total - d.active} off` : ''}
                      {d.custom ? ` · ${d.custom} custom` : ''}
                    </span>
                    {d.protected ? <Chip tone="amber">Access control · read only</Chip> : null}
                  </button>
                  {isOpen ? (
                    <div className="border-t border-solid border-[#f2f2f2] px-[14px] pt-[6px] pb-[12px]">
                      {d.protected ? (
                        <p className="m-0 mb-[8px] font-sans text-[13px] leading-[19px] text-[#8a5a00]">
                          These values decide who can do what, or keep young people safe, so they
                          change in code with a review, not here.
                        </p>
                      ) : null}
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] border-collapse font-sans text-[13.5px]">
                          <thead>
                            <tr className="text-left text-[#595959]">
                              <th className="py-[8px] pr-[8px] font-semibold">Label</th>
                              <th className="py-[8px] pr-[8px] font-semibold">Key</th>
                              <th className="w-[60px] py-[8px] pr-[8px] font-semibold">Order</th>
                              <th className="w-[110px] py-[8px] pr-[8px] font-semibold">Type</th>
                              <th className="w-[90px] py-[8px] pr-[8px] font-semibold">Status</th>
                              <th className="w-[120px] py-[8px]" />
                            </tr>
                          </thead>
                          <tbody>
                            {d.rows.map((v) => {
                              const editable = !d.protected && !v.isBuiltIn && v.scope === 'global';
                              return (
                                <tr
                                  key={v.id}
                                  className="border-t border-solid border-[#f2f2f2] align-top"
                                >
                                  <td className="py-[8px] pr-[8px] text-[#1c2a21]">
                                    <span className="font-semibold">{v.label}</span>
                                    {v.description ? (
                                      <span className="block text-[12.5px] text-[#737373]">
                                        {v.description}
                                      </span>
                                    ) : null}
                                  </td>
                                  <td className="py-[8px] pr-[8px] font-mono text-[12.5px] text-[#575755]">
                                    {v.key}
                                  </td>
                                  <td className="py-[8px] pr-[8px] text-[#575755]">
                                    {v.sortOrder}
                                  </td>
                                  <td className="py-[8px] pr-[8px]">
                                    <Chip tone={typeTone(v)}>{typeOf(v)}</Chip>
                                    {!v.isBuiltIn && v.createdAt ? (
                                      <span className="block pt-[2px] text-[12px] text-[#737373]">
                                        {shortDate(v.createdAt)}
                                      </span>
                                    ) : null}
                                  </td>
                                  <td className="py-[8px] pr-[8px]">
                                    {v.isActive ? (
                                      <Chip tone="green">Active</Chip>
                                    ) : (
                                      <Chip tone="red">Off</Chip>
                                    )}
                                  </td>
                                  <td className="py-[8px] text-right">
                                    {editable && v.isActive ? (
                                      <TextAction
                                        onClick={() => openDialog({ kind: 'deactivate', value: v })}
                                      >
                                        Deactivate
                                      </TextAction>
                                    ) : null}
                                    {editable && !v.isActive ? (
                                      <TextAction
                                        tone="green"
                                        onClick={() => openDialog({ kind: 'reactivate', value: v })}
                                      >
                                        Turn back on
                                      </TextAction>
                                    ) : null}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      {!d.protected ? (
                        <div className="pt-[8px]">
                          <TextAction
                            tone="green"
                            onClick={() => {
                              setForm(BLANK);
                              openDialog({ kind: 'add', domain: d.domain });
                            }}
                          >
                            + Add a value
                          </TextAction>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </GroupCard>

      {dialog?.kind === 'add' ? (
        <AdminConfirmDialog
          title={`Add a value to ${humanize(dialog.domain)}`}
          body="It can be used wherever this list is used as soon as you add it. The change is logged."
          primary={{ label: busy ? 'Adding…' : 'Add value', arrow: true }}
          secondary="Cancel"
          onPrimary={add}
          onClose={close}
        >
          <div className="flex flex-col gap-[12px]">
            <TextInput
              label="Label"
              required
              value={form.label}
              onChange={(e) => {
                const label = e.target.value;
                setForm((f) => ({ ...f, label, key: f.keyTouched ? f.key : keyOf(label) }));
              }}
            />
            <TextInput
              label="Key (stored in records)"
              required
              value={form.key}
              onChange={(e) => setForm((f) => ({ ...f, key: e.target.value, keyTouched: true }))}
            />
            <Textarea
              label="Description (optional)"
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
            <TextInput
              label="Order (optional)"
              inputMode="numeric"
              value={form.sortOrder}
              onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
              error={error || undefined}
            />
          </div>
        </AdminConfirmDialog>
      ) : null}
      {dialog?.kind === 'deactivate' ? (
        <AdminConfirmDialog
          title={`Deactivate “${dialog.value.label}”?`}
          body="New records can’t use this value any more. Records that already use it keep it. You can turn it back on later."
          primary={{ label: busy ? 'Deactivating…' : 'Deactivate', tone: 'red' }}
          secondary="Cancel"
          onPrimary={() =>
            run(
              () => deactivatePlatformValue(dialog.value.id),
              () => toast('Value deactivated', `${dialog.value.label} can’t be chosen any more.`)
            )
          }
          onClose={close}
        >
          {error ? <p className="m-0 font-sans text-[13.5px] text-[#902b20]">{error}</p> : null}
        </AdminConfirmDialog>
      ) : null}
      {dialog?.kind === 'reactivate' ? (
        <AdminConfirmDialog
          title={`Turn “${dialog.value.label}” back on?`}
          body="New records can use this value again."
          primary={{ label: busy ? 'Saving…' : 'Turn back on', arrow: true }}
          secondary="Cancel"
          onPrimary={() =>
            run(
              () =>
                registerPlatformValue({
                  domain: dialog.value.domain,
                  key: dialog.value.key,
                  label: dialog.value.label,
                  description: dialog.value.description || undefined,
                  sortOrder: dialog.value.sortOrder,
                }),
              () => toast('Value turned back on', `${dialog.value.label} can be chosen again.`)
            )
          }
          onClose={close}
        >
          {error ? <p className="m-0 font-sans text-[13.5px] text-[#902b20]">{error}</p> : null}
        </AdminConfirmDialog>
      ) : null}
      {toastEl}
    </>
  );
};

export default PlatformValuesTab;
