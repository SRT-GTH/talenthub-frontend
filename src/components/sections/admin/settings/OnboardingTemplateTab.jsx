import { useEffect, useMemo, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { Checkbox, TextInput, Textarea } from '../../../ui/form';
import { GroupCard, TextAction } from '../../talentSettings/SettingsBUi.jsx';
import AdminConfirmDialog from '../ui/AdminConfirmDialog.jsx';
import { useAdminData, useAdminToast } from '../useAdminData.js';
import AdminLoadNotice from '../AdminLoadNotice.jsx';
import {
  adminError,
  configHistory,
  listConfig,
  shortDate,
  updateConfig,
} from '../../../../services/admin.api.js';

const log = debug('OnboardingTemplateTab');

/*
 * OnboardingTemplateTab — Settings › Onboarding templates (Super Admin). Edits the CSV template institutions download to bulk-upload students
 * (platform config key onboarding.bulk_roster_template; institutions read it through GET /api/config/public/:key).
 * Columns (one card each, fits any width): key (CSV header), label, required, example, help — reorder, add, remove; file name; instructions; example row on/off; live CSV preview.
 * Besides the built-in fields, admins add their own (custom_<name>: text, number, date or a choice list). Institutions fill
 * them in the upload; the values are checked there and kept on each student as metadata.customFields.
 * Save asks for a reason (PATCH /api/admin/config/:key) — the backend validates the shape and bumps the version; History lists earlier versions.
 */

const KEY = 'onboarding.bulk_roster_template';
// The fields the institution bulk upload maps to backend users (services/institutionBulk.js). Core ones can't be removed.
const FIELDS = [
  { key: 'firstName', label: 'First name', core: true },
  { key: 'lastName', label: 'Last name', core: true },
  { key: 'dob', label: 'Date of birth', core: true },
  { key: 'gender', label: 'Gender' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'level', label: 'Education level' },
  { key: 'grade', label: 'Grade / year' },
  { key: 'studentId', label: 'Student ID' },
  { key: 'parentName', label: 'Parent name' },
  { key: 'parentEmail', label: 'Parent email' },
  { key: 'parentPhone', label: 'Parent phone' },
];
const isCore = (key) => FIELDS.some((f) => f.key === key && f.core);
const CUSTOM_TYPES = [
  { id: 'text', label: 'Text' },
  { id: 'number', label: 'Number' },
  { id: 'date', label: 'Date (DD/MM/YYYY)' },
  { id: 'choice', label: 'One of a list' },
];
const MAX_CUSTOM = 20;
// "House / dormitory" -> "custom_houseDormitory"
const customKey = (name, taken) => {
  const words = String(name)
    .normalize('NFKD')
    .replace(/[^A-Za-z0-9 ]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  let base = words
    .map((w, i) => (i ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase()))
    .join('')
    .replace(/^[0-9]+/, '')
    .slice(0, 30);
  if (base.length < 2) base = 'field';
  let key = `custom_${base}`;
  for (let n = 2; taken.has(key); n++) key = `custom_${base}${n}`;
  return key;
};
const colLabel = (c) =>
  c.custom ? c.label || c.header || c.key : (FIELDS.find((f) => f.key === c.key)?.label ?? c.key);
const blankColumn = (key) => ({
  key,
  header: FIELDS.find((f) => f.key === key)?.label ?? '',
  required: false,
  minors: false,
  aliases: [],
  example: '',
  help: '',
});
const csvCell = (v) =>
  /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v ?? '');
const templateCsv = (t) => {
  const cols = t?.columns ?? [];
  const lines = [cols.map((c) => csvCell(c.header)).join(',')];
  if (t?.includeExampleRow) lines.push(cols.map((c) => csvCell(c.example)).join(','));
  return `${lines.join('\n')}\n`;
};

const IconBtn = ({ label, onClick, disabled, children }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    disabled={disabled}
    onClick={onClick}
    className="grid size-[30px] cursor-pointer place-items-center rounded-full border border-solid border-[#e1eae2] bg-white font-sans text-[14px] text-[#1c2a21] disabled:cursor-not-allowed disabled:opacity-40"
  >
    {children}
  </button>
);

const OnboardingTemplateTab = ({ session }) => {
  const cfg = useAdminData(() => listConfig(), []);
  const [toastEl, toast] = useAdminToast();
  const current = (cfg.data?.configs ?? []).find((c) => c.key === KEY);
  const [draft, setDraft] = useState(null);
  const [dialog, setDialog] = useState(null); // 'save' | 'history' | 'reset'
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [newField, setNewField] = useState({ name: '', type: 'text' });
  const hist = useAdminData(
    () => (dialog === 'history' ? configHistory(KEY) : Promise.resolve(null)),
    [dialog]
  );

  useEffect(() => {
    if (current && !draft) setDraft(structuredClone(current.value));
  }, [current, draft]);

  const dirty = useMemo(
    () => current && draft && JSON.stringify(current.value) !== JSON.stringify(draft),
    [current, draft]
  );
  const problems = useMemo(() => {
    if (!draft) return [];
    const out = [];
    const seen = new Set();
    draft.columns.forEach((c, i) => {
      if (seen.has(c.key)) out.push(`Column ${i + 1}: “${c.key}” is used twice.`);
      seen.add(c.key);
      if (!String(c.header || '').trim()) out.push(`Column ${i + 1} needs a header.`);
      if (c.custom && !String(c.label || '').trim()) out.push(`Column ${i + 1} needs a name.`);
      if (c.custom && c.type === 'choice' && (c.options || []).length < 2) {
        out.push(`“${colLabel(c)}” is a list: give it at least 2 options.`);
      }
    });
    if (draft.columns.filter((c) => c.custom).length > MAX_CUSTOM)
      out.push(`Use at most ${MAX_CUSTOM} fields of your own.`);
    FIELDS.filter((f) => f.core).forEach((f) => {
      const col = draft.columns.find((c) => c.key === f.key);
      if (!col) out.push(`${f.label} must stay in the template.`);
      else if (!col.required) out.push(`${f.label} must be required.`);
    });
    return out;
  }, [draft]);

  if (session?.role !== 'super') {
    return <AdminLoadNotice error="Only Super Admins edit onboarding templates." status={403} />;
  }
  if (cfg.loading || cfg.error || !draft) {
    return (
      <AdminLoadNotice
        loading={cfg.loading || (!cfg.error && !draft && Boolean(current))}
        error={
          cfg.error ||
          (!current && !cfg.loading
            ? 'The template setting isn’t on this server yet: restart the backend so it seeds onboarding.bulk_roster_template.'
            : null)
        }
        status={cfg.status}
        onRetry={cfg.reload}
      />
    );
  }

  const setCol = (i, patch) =>
    setDraft((d) => ({
      ...d,
      columns: d.columns.map((c, j) => (j === i ? { ...c, ...patch } : c)),
    }));
  const move = (i, by) =>
    setDraft((d) => {
      const cols = [...d.columns];
      const [x] = cols.splice(i, 1);
      cols.splice(i + by, 0, x);
      return { ...d, columns: cols };
    });
  const save = async () => {
    if (busy) return;
    if (reason.trim().length < 3) {
      setError('Give a reason (it’s logged).');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await updateConfig(KEY, draft, reason.trim());
      const saved = res?.config?.value ?? draft;
      toast('Template saved', `Version ${saved.version ?? ''} is what institutions download now.`);
      setDialog(null);
      setReason('');
      // Keep what the server stored (it bumps the version). Clearing the draft here made the effect above refill it
      // from the list that hadn't reloaded yet, so a fresh save looked undone.
      setDraft(structuredClone(saved));
      cfg.reload();
    } catch (e) {
      setError(adminError(e));
    } finally {
      setBusy(false);
    }
  };
  const addCustom = () => {
    const name = newField.name.trim();
    if (!name) return;
    setDraft((d) => {
      const key = customKey(name, new Set(d.columns.map((c) => c.key)));
      return {
        ...d,
        columns: [
          ...d.columns,
          {
            key,
            custom: true,
            label: name,
            header: name,
            type: newField.type,
            options: [],
            required: false,
            minors: false,
            aliases: [],
            example: '',
            help: '',
          },
        ],
      };
    });
    setNewField({ name: '', type: 'text' });
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([templateCsv(draft)], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = draft.fileName || 'template.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    log('preview downloaded');
  };

  return (
    <>
      <GroupCard
        className="min-w-0"
        title="Bulk student upload template"
        description={`The CSV institutions download from Roster › Bulk upload. Version ${current.value?.version ?? 1}${
          current.lastModifiedAt ? ` · changed ${shortDate(current.lastModifiedAt)}` : ''
        }.`}
      >
        <div className="flex w-full min-w-0 flex-col gap-[16px]">
          <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
            <TextInput
              label="File name"
              required
              value={draft.fileName}
              onChange={(e) => setDraft((d) => ({ ...d, fileName: e.target.value }))}
            />
            <div className="flex items-end pb-[6px]">
              <Checkbox
                label="Include an example row under the headers"
                checked={draft.includeExampleRow !== false}
                onChange={(e) => setDraft((d) => ({ ...d, includeExampleRow: e.target.checked }))}
                labelClassName="text-[14px] font-medium"
              />
            </div>
          </div>
          <Textarea
            label="Instructions shown with the download"
            rows={3}
            value={draft.instructions}
            onChange={(e) => setDraft((d) => ({ ...d, instructions: e.target.value }))}
          />

          <ol aria-label="Template columns" className="m-0 flex list-none flex-col gap-[12px] p-0">
            {draft.columns.map((c, i) => {
              const label = colLabel(c);
              return (
                <li
                  key={i}
                  className="flex min-w-0 flex-col gap-[12px] rounded-[16px] border border-solid border-[#e7e7e7] bg-[#fcfcfa] p-[14px] max-sm:p-[12px]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-[10px]">
                    <div className="flex min-w-0 items-baseline gap-[10px]">
                      <span className="grid size-[26px] shrink-0 place-items-center rounded-full bg-[#ebf1ec] font-sans text-[12.5px] font-bold text-[#2a5730]">
                        {i + 1}
                      </span>
                      <span className="min-w-0 font-sans text-[15px] font-semibold text-[#1c2a21]">
                        {label}{' '}
                        <span className="font-mono text-[11.5px] font-normal text-[#737373]">
                          {c.key}
                        </span>
                        {c.custom ? (
                          <span className="ml-[6px] rounded-full bg-[#eef4fb] px-[8px] py-[2px] align-middle font-sans text-[11.5px] font-semibold text-[#2f5b8a]">
                            Your field
                          </span>
                        ) : null}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[6px]">
                      <label className="flex cursor-pointer items-center gap-[6px] font-sans text-[13.5px] text-[#1c2a21]">
                        <input
                          type="checkbox"
                          aria-label={`${label} required`}
                          checked={c.required}
                          disabled={isCore(c.key)}
                          onChange={(e) => setCol(i, { required: e.target.checked })}
                        />
                        Required
                      </label>
                      <label className="flex cursor-pointer items-center gap-[6px] font-sans text-[13.5px] text-[#1c2a21]">
                        <input
                          type="checkbox"
                          aria-label={`${label} under-18 only`}
                          checked={Boolean(c.minors)}
                          onChange={(e) => setCol(i, { minors: e.target.checked })}
                        />
                        Under-18 only
                      </label>
                      <div className="flex gap-[4px]">
                        <IconBtn
                          label={`Move ${label} up`}
                          disabled={i === 0}
                          onClick={() => move(i, -1)}
                        >
                          ↑
                        </IconBtn>
                        <IconBtn
                          label={`Move ${label} down`}
                          disabled={i === draft.columns.length - 1}
                          onClick={() => move(i, 1)}
                        >
                          ↓
                        </IconBtn>
                        <IconBtn
                          label={`Remove ${label}`}
                          disabled={isCore(c.key)}
                          onClick={() =>
                            setDraft((d) => ({
                              ...d,
                              columns: d.columns.filter((_, j) => j !== i),
                            }))
                          }
                        >
                          ×
                        </IconBtn>
                      </div>
                    </div>
                  </div>
                  {c.custom ? (
                    <div className="grid min-w-0 grid-cols-1 gap-[10px] sm:grid-cols-2 2xl:grid-cols-4">
                      <label className="flex min-w-0 flex-col gap-[4px] font-sans text-[12.5px] font-semibold text-[#595959]">
                        Name
                        <input
                          aria-label={`${label} name`}
                          value={c.label ?? ''}
                          onChange={(e) => setCol(i, { label: e.target.value })}
                          className="h-[40px] w-full min-w-0 rounded-[8px] border border-solid border-[#d9d9d9] bg-white px-[10px] font-sans text-[14px] text-[#1c2a21]"
                        />
                      </label>
                      <label className="flex min-w-0 flex-col gap-[4px] font-sans text-[12.5px] font-semibold text-[#595959]">
                        Type
                        <select
                          aria-label={`${label} type`}
                          value={c.type || 'text'}
                          onChange={(e) => setCol(i, { type: e.target.value })}
                          className="h-[40px] w-full min-w-0 rounded-[8px] border border-solid border-[#d9d9d9] bg-white px-[8px] font-sans text-[14px] text-[#1c2a21]"
                        >
                          {CUSTOM_TYPES.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      {c.type === 'choice' ? (
                        <label className="flex min-w-0 flex-col gap-[4px] font-sans text-[12.5px] font-semibold text-[#595959] sm:col-span-2">
                          Options (comma-separated)
                          <input
                            aria-label={`${label} options`}
                            placeholder="Aggrey, Guggisberg, Fraser"
                            defaultValue={(c.options || []).join(', ')}
                            onBlur={(e) =>
                              setCol(i, {
                                options: [
                                  ...new Set(
                                    e.target.value
                                      .split(',')
                                      .map((x) => x.trim())
                                      .filter(Boolean)
                                  ),
                                ],
                              })
                            }
                            className="h-[40px] w-full min-w-0 rounded-[8px] border border-solid border-[#d9d9d9] bg-white px-[10px] font-sans text-[14px] text-[#1c2a21]"
                          />
                        </label>
                      ) : null}
                    </div>
                  ) : null}
                  <div className="grid min-w-0 grid-cols-1 gap-[10px] sm:grid-cols-2 2xl:grid-cols-4">
                    {[
                      {
                        id: 'header',
                        name: 'CSV header',
                        value: c.header,
                        set: (v) => setCol(i, { header: v }),
                      },
                      {
                        id: 'aliases',
                        name: 'Also accept',
                        placeholder: 'surname, family name',
                        value: (c.aliases || []).join(', '),
                        set: (v) =>
                          setCol(i, {
                            aliases: v
                              .split(',')
                              .map((x) => x.trim())
                              .filter(Boolean),
                          }),
                      },
                      {
                        id: 'example',
                        name: 'Example',
                        value: c.example,
                        set: (v) => setCol(i, { example: v }),
                      },
                      {
                        id: 'help',
                        name: 'Help',
                        value: c.help,
                        set: (v) => setCol(i, { help: v }),
                      },
                    ].map((f) => (
                      <label
                        key={f.id}
                        className="flex min-w-0 flex-col gap-[4px] font-sans text-[12.5px] font-semibold text-[#595959]"
                      >
                        {f.name}
                        <input
                          aria-label={`${label} ${f.name}`}
                          placeholder={f.placeholder}
                          value={f.value ?? ''}
                          onChange={(e) => f.set(e.target.value)}
                          className="h-[40px] w-full min-w-0 rounded-[8px] border border-solid border-[#d9d9d9] bg-white px-[10px] font-sans text-[14px] text-[#1c2a21]"
                        />
                      </label>
                    ))}
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="flex min-w-0 flex-col gap-[10px] rounded-[16px] border border-dashed border-[#c9d8cb] p-[14px]">
            <span className="font-sans text-[14px] font-semibold text-[#1c2a21]">
              Add a field of your own
            </span>
            <p className="m-0 font-sans text-[13px] text-[#595959]">
              Something your institutions need that isn’t above, e.g. house, programme option or bus
              route. It becomes a column in the template; values are checked on upload and kept on
              each student.
            </p>
            <div className="flex flex-wrap items-end gap-[10px]">
              <label className="flex min-w-[180px] flex-1 flex-col gap-[4px] font-sans text-[12.5px] font-semibold text-[#595959]">
                Field name
                <input
                  aria-label="New field name"
                  placeholder="House"
                  value={newField.name}
                  maxLength={60}
                  onChange={(e) => setNewField((f) => ({ ...f, name: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustom();
                    }
                  }}
                  className="h-[40px] w-full min-w-0 rounded-[8px] border border-solid border-[#d9d9d9] bg-white px-[10px] font-sans text-[14px] text-[#1c2a21]"
                />
              </label>
              <label className="flex min-w-[160px] flex-col gap-[4px] font-sans text-[12.5px] font-semibold text-[#595959]">
                Type
                <select
                  aria-label="New field type"
                  value={newField.type}
                  onChange={(e) => setNewField((f) => ({ ...f, type: e.target.value }))}
                  className="h-[40px] w-full min-w-0 rounded-[8px] border border-solid border-[#d9d9d9] bg-white px-[8px] font-sans text-[14px] text-[#1c2a21]"
                >
                  {CUSTOM_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={addCustom}
                disabled={
                  !newField.name.trim() ||
                  draft.columns.filter((c) => c.custom).length >= MAX_CUSTOM
                }
                className="h-[40px] cursor-pointer rounded-[8px] border border-solid border-[#387440] bg-white px-[16px] font-sans text-[14px] font-semibold text-[#387440] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add field
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-[14px]">
            {FIELDS.filter((f) => !draft.columns.some((c) => c.key === f.key)).map((f) => (
              <TextAction
                key={f.key}
                tone="green"
                onClick={() =>
                  setDraft((d) => ({ ...d, columns: [...d.columns, blankColumn(f.key)] }))
                }
              >
                + {f.label}
              </TextAction>
            ))}
            <TextAction tone="green" onClick={download}>
              Download this version
            </TextAction>
            <TextAction tone="green" onClick={() => setDialog('history')}>
              History
            </TextAction>
          </div>

          <div className="flex flex-col gap-[6px]">
            <span className="font-sans text-[13px] font-semibold text-[#1c2a21]">
              Preview: {draft.fileName}
            </span>
            <pre className="m-0 overflow-x-auto rounded-[12px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] p-[12px] font-mono text-[12.5px] leading-[18px] text-[#1c2a21]">
              {templateCsv(draft)}
            </pre>
          </div>

          {problems.length ? (
            <ul className="m-0 list-disc pl-[20px] font-sans text-[13.5px] leading-[20px] text-[#902b20]">
              {problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          ) : null}

          <div className="flex flex-wrap items-center gap-[12px]">
            <button
              type="button"
              disabled={!dirty || problems.length > 0}
              onClick={() => {
                setError('');
                setDialog('save');
              }}
              className="inline-flex h-[48px] cursor-pointer items-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[20px] font-sans text-[15px] font-bold text-white shadow-[0_4px_0_#2a5730] disabled:cursor-not-allowed disabled:opacity-55"
            >
              Save template
            </button>
            {dirty ? (
              <button
                type="button"
                onClick={() => setDraft(structuredClone(current.value))}
                className="cursor-pointer border-0 bg-transparent font-sans text-[14px] font-semibold text-[#902b20] underline"
              >
                Discard changes
              </button>
            ) : (
              <span className="font-sans text-[13px] text-[#737373]">No unsaved changes.</span>
            )}
          </div>
        </div>
      </GroupCard>

      {dialog === 'save' ? (
        <AdminConfirmDialog
          title="Publish this template?"
          body="Institutions get the new columns the next time they download the template. Files they already filled in aren’t affected."
          primary={{ label: busy ? 'Saving…' : 'Publish', arrow: true }}
          secondary="Cancel"
          onPrimary={save}
          onClose={() => setDialog(null)}
        >
          <TextInput
            label="Reason (logged)"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            error={error || undefined}
          />
        </AdminConfirmDialog>
      ) : null}
      {dialog === 'history' ? (
        <AdminConfirmDialog
          title="Template history"
          body={hist.loading ? 'Loading…' : `${hist.data?.totalChanges ?? 0} changes.`}
          primary={{ label: 'Close' }}
          secondary="Done"
          onPrimary={() => setDialog(null)}
          onClose={() => setDialog(null)}
        >
          <ul className="m-0 flex max-h-[320px] list-none flex-col gap-[10px] overflow-auto p-0">
            {(hist.data?.history ?? [])
              .slice()
              .reverse()
              .map((h, i) => (
                <li
                  key={i}
                  className="rounded-[12px] bg-[#f8f8f4] p-[10px] font-sans text-[13px] leading-[18px]"
                >
                  <strong>
                    v{h.previousValue?.version ?? '?'} → v{h.newValue?.version ?? '?'} ·{' '}
                    {h.newValue?.columns?.length ?? '?'} columns
                  </strong>
                  <span className="block text-[#737373]">
                    {shortDate(h.modifiedAt)} · {h.reason}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setDraft(structuredClone(h.previousValue));
                      setDialog(null);
                    }}
                    className="mt-[4px] cursor-pointer border-0 bg-transparent p-0 font-semibold text-[#387440] underline"
                  >
                    Load the version before this change
                  </button>
                </li>
              ))}
          </ul>
        </AdminConfirmDialog>
      ) : null}
      {toastEl}
    </>
  );
};

export default OnboardingTemplateTab;
