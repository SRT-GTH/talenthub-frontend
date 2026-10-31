import { useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { Checkbox, TextInput } from '../../../ui/form';
import { GroupCard, SettingRow, TextAction } from '../../talentSettings/SettingsBUi.jsx';
import AdminConfirmDialog from '../ui/AdminConfirmDialog.jsx';
import AdminLoadNotice from '../AdminLoadNotice.jsx';
import AssessmentTemplatesSection from './refdata/AssessmentTemplatesSection.jsx';
import DataSourcesSection from './refdata/DataSourcesSection.jsx';
import FxAutoUpdatePanel from './refdata/FxAutoUpdatePanel.jsx';
import LocationsSection from './refdata/LocationsSection.jsx';
import OpportunityTemplatesSection from './refdata/OpportunityTemplatesSection.jsx';
import PlatformListsSection from './refdata/PlatformListsSection.jsx';
import { useAdminData, useAdminToast } from '../useAdminData.js';
import {
  adminError,
  catCategories,
  catCreateCategory,
  catCreateCurrency,
  catCurrencies,
  catSetCurrencyActive,
  catSetCurrencyRate,
  catDeleteCategory,
  catReorderCategories,
  catSetCategoryActive,
  catUpdateCategory,
  humanize,
} from '../../../../services/admin.api.js';

const log = debug('ReferenceDataTab');

/*
 * ReferenceDataTab — Settings › Reference data: lists other features read (/api/admin/catalog, Senior / Super Admin).
 *   Opportunity categories  name, description, icon, order, active; usage per category. The slug is set once and
 *                           never changes; a category in use can't be deleted (deactivate it). Every change needs a
 *                           reason and is audited with the values it replaced.
 *   Currencies              rates per 1 USD, how old each rate is (nothing updates them automatically), edit with a
 *                           reason (changes over 25% need confirming), activate / deactivate, add.
 *   Opportunity templates   refdata/OpportunityTemplatesSection.jsx
 *   Assessment templates    refdata/AssessmentTemplatesSection.jsx (questions view-only)
 *   Locations               refdata/LocationsSection.jsx (CSV import with preview)
 *   Data sources            refdata/DataSourcesSection.jsx (O*NET import, Ghana scrapers, summaries)
 *   Platform lists          refdata/PlatformListsSection.jsx (platformEnum option lists: support case types, canned replies)
 * URL: ?section=categories|currencies|opportunity-templates|assessment-templates|locations|data-sources|lists
 */

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

const usageText = (u) => {
  if (!u || !u.total) return 'Not used yet';
  const parts = Object.entries(u.byStatus || {}).map(
    ([s, n]) => `${n} ${humanize(s).toLowerCase()}`
  );
  return `${u.total} opportunit${u.total === 1 ? 'y' : 'ies'} (${parts.join(', ')})`;
};

/* ── Opportunity categories ─────────────────────────────────────────────── */
const Categories = ({ canEdit, toast }) => {
  const list = useAdminData(() => catCategories(), []);
  const cats = list.data?.categories ?? [];
  const [dialog, setDialog] = useState(null); // { kind: 'create'|'edit'|'active'|'delete'|'order', cat?, order? }
  const [form, setForm] = useState({ name: '', description: '', icon: '' });
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const open = (d) => {
    setError('');
    setReason('');
    setForm({
      name: d.cat?.name || '',
      description: d.cat?.description || '',
      icon: d.cat?.icon || '',
    });
    setDialog(d);
  };
  const run = async (fn, title, text) => {
    if (busy) return;
    if (reason.trim().length < 10) return setError('Add a reason (10+ characters).');
    setBusy(true);
    setError('');
    try {
      await fn();
      toast(title, text);
      setDialog(null);
      list.reload();
    } catch (e) {
      setError(e?.response ? adminError(e) : e.message);
    } finally {
      setBusy(false);
    }
  };
  const move = (i, dir) => {
    const order = (dialog?.order || cats).slice();
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    setDialog((d) => ({ ...d, order }));
  };

  const d = dialog;
  return (
    <GroupCard
      title="Opportunity categories"
      description="The categories recruiters choose when posting an opportunity and talents filter by. A category in use can’t be deleted; deactivate it so no new opportunities can pick it."
      gap="gap-0"
    >
      {canEdit ? (
        <div className="flex flex-wrap gap-[14px] pb-[12px]">
          <TextAction tone="green" onClick={() => open({ kind: 'create' })}>
            + New category
          </TextAction>
          {cats.length > 1 ? (
            <TextAction tone="green" onClick={() => open({ kind: 'order', order: cats })}>
              Change order
            </TextAction>
          ) : null}
        </div>
      ) : null}
      <AdminLoadNotice
        loading={list.loading}
        error={list.error}
        status={list.status}
        onRetry={list.reload}
      >
        {cats.map((c) => (
          <SettingRow
            key={c.id}
            title={`${c.sortOrder ?? '–'}. ${c.name}${c.isActive === false ? ' · inactive' : ''}`}
            description={`/${c.slug} · ${usageText(c.usage)}${c.description ? ` · ${c.description}` : ''}`}
            top
            control={
              canEdit ? (
                <div className="flex items-center gap-[14px]">
                  <TextAction tone="green" onClick={() => open({ kind: 'edit', cat: c })}>
                    Edit
                  </TextAction>
                  <TextAction
                    tone={c.isActive === false ? 'green' : 'danger'}
                    onClick={() => open({ kind: 'active', cat: c })}
                  >
                    {c.isActive === false ? 'Activate' : 'Deactivate'}
                  </TextAction>
                  {!c.usage?.total ? (
                    <TextAction onClick={() => open({ kind: 'delete', cat: c })}>Delete</TextAction>
                  ) : null}
                </div>
              ) : null
            }
          />
        ))}
        {!cats.length && !list.loading ? (
          <p className="m-0 font-sans text-[14px] text-[#737373]">No categories yet.</p>
        ) : null}
      </AdminLoadNotice>

      {d?.kind === 'create' || d?.kind === 'edit' ? (
        <AdminConfirmDialog
          title={d.kind === 'create' ? 'New opportunity category' : `Edit ${d.cat.name}`}
          body={
            d.kind === 'create'
              ? 'Its web address (slug) is made from the name and never changes.'
              : `Its web address stays /${d.cat.slug}.`
          }
          primary={{ label: busy ? 'Saving…' : 'Save', arrow: true }}
          secondary="Cancel"
          onPrimary={() => {
            if (form.name.trim().length < 2) return setError('Give it a name (2+ characters).');
            const p = {
              name: form.name.trim(),
              description: form.description.trim(),
              icon: form.icon.trim(),
              reason: reason.trim(),
            };
            return run(
              () => (d.kind === 'create' ? catCreateCategory(p) : catUpdateCategory(d.cat.id, p)),
              d.kind === 'create' ? 'Category created' : 'Category saved',
              p.name
            );
          }}
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
            <TextInput
              label="Icon name"
              optional
              placeholder="briefcase"
              value={form.icon}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
            />
            <TextInput
              label="Reason"
              required
              placeholder="Why this change (for the audit log)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              error={error || undefined}
            />
          </div>
        </AdminConfirmDialog>
      ) : null}

      {d?.kind === 'active' ? (
        <AdminConfirmDialog
          title={`${d.cat.isActive === false ? 'Activate' : 'Deactivate'} ${d.cat.name}?`}
          body={
            d.cat.isActive === false
              ? 'Recruiters can pick it again.'
              : `New opportunities can’t pick it. ${usageText(d.cat.usage)} keep it.`
          }
          primary={{
            label: busy ? 'Saving…' : 'Confirm',
            tone: d.cat.isActive === false ? 'green' : 'red',
            arrow: d.cat.isActive === false,
          }}
          secondary="Cancel"
          onPrimary={() =>
            run(
              () => catSetCategoryActive(d.cat.id, d.cat.isActive === false, reason.trim()),
              'Saved',
              d.cat.name
            )
          }
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

      {d?.kind === 'delete' ? (
        <AdminConfirmDialog
          title={`Delete ${d.cat.name}?`}
          body="No opportunity uses it. The audit log keeps its details."
          primary={{ label: busy ? 'Deleting…' : 'Delete', tone: 'red' }}
          secondary="Cancel"
          onPrimary={() =>
            run(() => catDeleteCategory(d.cat.id, reason.trim()), 'Deleted', d.cat.name)
          }
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

      {d?.kind === 'order' ? (
        <AdminConfirmDialog
          title="Change the order"
          body="The order categories appear in when recruiters post and talents filter."
          primary={{ label: busy ? 'Saving…' : 'Save order', arrow: true }}
          secondary="Cancel"
          onPrimary={() =>
            run(
              () =>
                catReorderCategories(
                  d.order.map((c) => c.id),
                  reason.trim()
                ),
              'Order saved',
              d.order.map((c) => c.name).join(' · ')
            )
          }
          onClose={() => setDialog(null)}
        >
          <ol className="m-0 flex list-none flex-col gap-[6px] p-0">
            {d.order.map((c, i) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-[10px] rounded-[10px] bg-[#f8f8f4] px-[12px] py-[8px] font-sans text-[14px]"
              >
                <span>
                  {i + 1}. {c.name}
                </span>
                <span className="flex gap-[10px]">
                  <TextAction
                    tone="green"
                    onClick={() => move(i, -1)}
                    aria-label={`Move ${c.name} up`}
                  >
                    ↑
                  </TextAction>
                  <TextAction
                    tone="green"
                    onClick={() => move(i, 1)}
                    aria-label={`Move ${c.name} down`}
                  >
                    ↓
                  </TextAction>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-[12px]">
            <TextInput
              label="Reason"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              error={error || undefined}
            />
          </div>
        </AdminConfirmDialog>
      ) : null}
    </GroupCard>
  );
};

/* ── Currencies ─────────────────────────────────────────────────────────── */
const STALE_DAYS = 30;
const Currencies = ({ canEdit, toast }) => {
  const list = useAdminData(() => catCurrencies(), []);
  const data = list.data;
  const rows = data?.currencies ?? [];
  const [dialog, setDialog] = useState(null); // { kind: 'rate'|'active'|'create', cur? }
  const [rate, setRate] = useState('');
  const [form, setForm] = useState({ code: '', name: '', symbol: '', exchangeRate: '' });
  const [reason, setReason] = useState('');
  const [confirmLarge, setConfirmLarge] = useState(false);
  const [pin, setPin] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const open = (d) => {
    setError('');
    setReason('');
    // A held automatic change arrives with its suggested rate, already flagged as a large change.
    setConfirmLarge(d.suggested != null);
    setPin(Boolean(d.cur?.ratePinned));
    setRate(d.cur ? String(d.suggested ?? d.cur.exchangeRate) : '');
    setForm({ code: '', name: '', symbol: '', exchangeRate: '' });
    setDialog(d);
  };
  const run = async (fn, title, text) => {
    if (busy) return;
    if (reason.trim().length < 10) return setError('Add a reason (10+ characters).');
    setBusy(true);
    setError('');
    try {
      await fn();
      toast(title, text);
      setDialog(null);
      list.reload();
    } catch (e) {
      if (e?.response?.data?.type === 'LARGE_RATE_CHANGE') setConfirmLarge(true);
      setError(e?.response ? adminError(e) : e.message);
    } finally {
      setBusy(false);
    }
  };
  const d = dialog;
  const stale = rows.filter((c) => c.code !== data?.base && (c.ageDays ?? 0) > STALE_DAYS);
  return (
    <GroupCard
      title="Currencies and exchange rates"
      description={`Rates are units per 1 ${data?.base || 'USD'}. Change one by hand at any time; tick “Keep this rate” so the automatic update leaves it alone. No screen converts amounts with them yet.`}
      gap="gap-0"
    >
      {stale.length ? (
        <div className="mb-[12px] rounded-[12px] bg-[#faf4e8] px-[14px] py-[10px] font-sans text-[14px] text-[#463409]">
          {stale.map((c) => c.code).join(', ')} {stale.length === 1 ? 'hasn’t' : 'haven’t'} been
          updated for over {STALE_DAYS} days.
        </div>
      ) : null}
      <FxAutoUpdatePanel
        canEdit={canEdit}
        toast={toast}
        currencies={rows}
        onChanged={list.reload}
        onReview={(code, to) => {
          const cur = rows.find((c) => c.code === code);
          if (cur) open({ kind: 'rate', cur, suggested: to });
        }}
      />
      {canEdit ? (
        <div className="pb-[12px]">
          <TextAction tone="green" onClick={() => open({ kind: 'create' })}>
            + Add currency
          </TextAction>
        </div>
      ) : null}
      <AdminLoadNotice
        loading={list.loading}
        error={list.error}
        status={list.status}
        onRetry={list.reload}
      >
        {rows.map((c) => (
          <SettingRow
            key={c.code}
            title={`${c.code} · ${c.name}${c.isActive ? '' : ' · inactive'}`}
            description={
              c.code === data?.base
                ? `${c.symbol} · base currency (1)`
                : `${c.symbol} · 1 ${data?.base} = ${Number(c.exchangeRate).toLocaleString('en-GB', { maximumFractionDigits: 6 })} ${c.code} · updated ${
                    c.ageDays == null
                      ? 'never'
                      : c.ageDays === 0
                        ? 'today'
                        : `${c.ageDays} days ago`
                  }${c.rateSource && c.rateSource !== 'manual' ? ' automatically' : ''}${c.ratePinned ? ' · pinned' : ''}${
                    c.code === data?.defaultCurrency ? ' · default' : ''
                  }`
            }
            top
            control={
              canEdit && c.code !== data?.base ? (
                <div className="flex items-center gap-[14px]">
                  <TextAction tone="green" onClick={() => open({ kind: 'rate', cur: c })}>
                    Change rate
                  </TextAction>
                  {c.code !== data?.defaultCurrency ? (
                    <TextAction
                      tone={c.isActive ? 'danger' : 'green'}
                      onClick={() => open({ kind: 'active', cur: c })}
                    >
                      {c.isActive ? 'Deactivate' : 'Activate'}
                    </TextAction>
                  ) : null}
                </div>
              ) : null
            }
          />
        ))}
      </AdminLoadNotice>

      {d?.kind === 'rate' ? (
        <AdminConfirmDialog
          title={`Change the ${d.cur.code} rate`}
          body={`Currently 1 ${data?.base} = ${d.cur.exchangeRate} ${d.cur.code}.`}
          primary={{
            label: busy ? 'Saving…' : confirmLarge ? 'Yes, save this rate' : 'Save rate',
            arrow: true,
          }}
          secondary="Cancel"
          onPrimary={() => {
            const n = Number(rate);
            if (!(n > 0)) return setError('The rate is a number above 0.');
            return run(
              () =>
                catSetCurrencyRate(d.cur.code, {
                  rate: n,
                  reason: reason.trim(),
                  confirmLargeChange: confirmLarge || undefined,
                  pin: pin !== Boolean(d.cur.ratePinned) ? pin : undefined,
                }),
              'Rate saved',
              `1 ${data?.base} = ${n} ${d.cur.code}`
            );
          }}
          onClose={() => setDialog(null)}
        >
          <div className="flex flex-col gap-[12px]">
            <TextInput
              label={`${d.cur.code} per 1 ${data?.base}`}
              inputMode="decimal"
              value={rate}
              onChange={(e) => {
                setRate(e.target.value);
                setConfirmLarge(false);
              }}
            />
            <Checkbox
              label="Keep this rate (the automatic update won’t change it)"
              checked={pin}
              onChange={(e) => setPin(e.target.checked)}
            />
            <TextInput
              label="Reason"
              required
              placeholder="Source of the rate, e.g. Bank of Ghana 25 Oct"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              error={error || undefined}
            />
          </div>
        </AdminConfirmDialog>
      ) : null}

      {d?.kind === 'active' ? (
        <AdminConfirmDialog
          title={`${d.cur.isActive ? 'Deactivate' : 'Activate'} ${d.cur.code}?`}
          body={
            d.cur.isActive
              ? 'It stops appearing in currency lists.'
              : 'It appears in currency lists again.'
          }
          primary={{
            label: busy ? 'Saving…' : 'Confirm',
            tone: d.cur.isActive ? 'red' : 'green',
            arrow: !d.cur.isActive,
          }}
          secondary="Cancel"
          onPrimary={() =>
            run(
              () => catSetCurrencyActive(d.cur.code, !d.cur.isActive, reason.trim()),
              'Saved',
              d.cur.code
            )
          }
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

      {d?.kind === 'create' ? (
        <AdminConfirmDialog
          title="Add a currency"
          body={`Rate is units of the new currency per 1 ${data?.base || 'USD'}.`}
          primary={{ label: busy ? 'Adding…' : 'Add currency', arrow: true }}
          secondary="Cancel"
          onPrimary={() => {
            if (!/^[A-Za-z]{3}$/.test(form.code))
              return setError('The code is 3 letters (ISO 4217), e.g. KES.');
            if (form.name.trim().length < 2 || !form.symbol.trim())
              return setError('Add a name and a symbol.');
            if (!(Number(form.exchangeRate) > 0)) return setError('The rate is a number above 0.');
            return run(
              () =>
                catCreateCurrency({
                  code: form.code.toUpperCase(),
                  name: form.name.trim(),
                  symbol: form.symbol.trim(),
                  exchangeRate: Number(form.exchangeRate),
                  reason: reason.trim(),
                }),
              'Currency added',
              form.code.toUpperCase()
            );
          }}
          onClose={() => setDialog(null)}
        >
          <div className="grid grid-cols-1 gap-[12px] md:grid-cols-2">
            <TextInput
              label="Code"
              placeholder="KES"
              value={form.code}
              onChange={(e) =>
                setForm((f) => ({ ...f, code: e.target.value.toUpperCase().slice(0, 3) }))
              }
            />
            <TextInput
              label="Symbol"
              placeholder="KSh"
              value={form.symbol}
              onChange={(e) => setForm((f) => ({ ...f, symbol: e.target.value }))}
            />
            <TextInput
              label="Name"
              placeholder="Kenyan Shilling"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <TextInput
              label={`Per 1 ${data?.base || 'USD'}`}
              inputMode="decimal"
              value={form.exchangeRate}
              onChange={(e) => setForm((f) => ({ ...f, exchangeRate: e.target.value }))}
            />
          </div>
          <div className="mt-[12px]">
            <TextInput
              label="Reason"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              error={error || undefined}
            />
          </div>
        </AdminConfirmDialog>
      ) : null}
    </GroupCard>
  );
};

/* ── Tab ────────────────────────────────────────────────────────────────── */
const SECTIONS = [
  { id: 'categories', label: 'Opportunity categories' },
  { id: 'currencies', label: 'Currencies' },
  { id: 'opportunity-templates', label: 'Opportunity templates' },
  { id: 'assessment-templates', label: 'Assessment templates' },
  { id: 'locations', label: 'Locations' },
  { id: 'data-sources', label: 'Data sources' },
  { id: 'lists', label: 'Platform lists' },
];

const ReferenceDataTab = ({ data, session }) => {
  const [toastEl, toast] = useAdminToast();
  const canEdit = session?.role === 'super' || session?.role === 'senior';
  const section = SECTIONS.some((x) => x.id === data.params.get('section'))
    ? data.params.get('section')
    : 'categories';
  log('render', { section });
  return (
    <>
      <div className="flex flex-wrap items-center gap-[8px]">
        {SECTIONS.map((x) => (
          <Pill
            key={x.id}
            on={x.id === section}
            onClick={() => data.update({ section: x.id === 'categories' ? null : x.id })}
          >
            {x.label}
          </Pill>
        ))}
      </div>
      {section === 'categories' ? <Categories canEdit={canEdit} toast={toast} /> : null}
      {section === 'currencies' ? <Currencies canEdit={canEdit} toast={toast} /> : null}
      {section === 'opportunity-templates' ? (
        <OpportunityTemplatesSection canEdit={canEdit} toast={toast} />
      ) : null}
      {section === 'assessment-templates' ? (
        <AssessmentTemplatesSection canEdit={canEdit} toast={toast} />
      ) : null}
      {section === 'locations' ? <LocationsSection canEdit={canEdit} toast={toast} /> : null}
      {section === 'lists' ? <PlatformListsSection canEdit={canEdit} toast={toast} /> : null}
      {section === 'data-sources' ? (
        <DataSourcesSection
          canEdit={canEdit}
          toast={toast}
          goTo={(id) => data.update({ section: id === 'categories' ? null : id })}
        />
      ) : null}
      {toastEl}
    </>
  );
};

export default ReferenceDataTab;
