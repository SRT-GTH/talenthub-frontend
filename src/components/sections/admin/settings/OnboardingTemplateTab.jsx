import { useEffect, useMemo, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { Checkbox, TextInput, Textarea } from '../../../ui/form';
import { GroupCard, TextAction } from '../../talentSettings/SettingsBUi.jsx';
import AdminConfirmDialog from '../ui/AdminConfirmDialog.jsx';
import { useAdminData, useAdminToast } from '../useAdminData.js';
import AdminLoadNotice from '../AdminLoadNotice.jsx';
import { adminError, configHistory, listConfig, shortDate, updateConfig } from '../../../../services/admin.api.js';

const log = debug('OnboardingTemplateTab');

/*
 * OnboardingTemplateTab — Settings › Onboarding templates (Super Admin). Edits the CSV template institutions download to bulk-upload students
 * (platform config key onboarding.bulk_roster_template; institutions read it through GET /api/config/public/:key).
 * Columns: key (CSV header), label, required, example, help — reorder, add, remove; file name; instructions; example row on/off; live CSV preview.
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
const blankColumn = (key) => ({ key, header: FIELDS.find((f) => f.key === key)?.label ?? '', required: false, minors: false, aliases: [], example: '', help: '' });
const csvCell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v ?? ''));
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
  const hist = useAdminData(() => (dialog === 'history' ? configHistory(KEY) : Promise.resolve(null)), [dialog]);

  useEffect(() => {
    if (current && !draft) setDraft(structuredClone(current.value));
  }, [current, draft]);

  const dirty = useMemo(() => current && draft && JSON.stringify(current.value) !== JSON.stringify(draft), [current, draft]);
  const problems = useMemo(() => {
    if (!draft) return [];
    const out = [];
    const seen = new Set();
    draft.columns.forEach((c, i) => {
      if (seen.has(c.key)) out.push(`Column ${i + 1}: “${c.key}” is used twice.`);
      seen.add(c.key);
      if (!String(c.header || '').trim()) out.push(`Column ${i + 1} needs a header.`);
    });
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
        error={cfg.error || (!current && !cfg.loading ? 'The template setting isn’t on this server yet: restart the backend so it seeds onboarding.bulk_roster_template.' : null)}
        status={cfg.status}
        onRetry={cfg.reload}
      />
    );
  }

  const setCol = (i, patch) => setDraft((d) => ({ ...d, columns: d.columns.map((c, j) => (j === i ? { ...c, ...patch } : c)) }));
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
      setDraft(null);
      cfg.reload();
    } catch (e) {
      setError(adminError(e));
    } finally {
      setBusy(false);
    }
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
        title="Bulk student upload template"
        description={`The CSV institutions download from Roster › Bulk upload. Version ${current.value?.version ?? 1}${
          current.lastModifiedAt ? ` · changed ${shortDate(current.lastModifiedAt)}` : ''
        }.`}
      >
        <div className="flex flex-col gap-[16px]">
          <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
            <TextInput label="File name" required value={draft.fileName} onChange={(e) => setDraft((d) => ({ ...d, fileName: e.target.value }))} />
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

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] border-collapse font-sans text-[13.5px]">
              <thead>
                <tr className="text-left text-[#595959]">
                  <th className="w-[60px] py-[8px] font-semibold">Order</th>
                  <th className="py-[8px] font-semibold">Field</th>
                  <th className="py-[8px] font-semibold">CSV header</th>
                  <th className="w-[80px] py-[8px] font-semibold">Required</th>
                  <th className="w-[90px] py-[8px] font-semibold">Under-18 only</th>
                  <th className="py-[8px] font-semibold">Also accept</th>
                  <th className="py-[8px] font-semibold">Example</th>
                  <th className="py-[8px] font-semibold">Help</th>
                  <th className="w-[110px] py-[8px]" />
                </tr>
              </thead>
              <tbody>
                {draft.columns.map((c, i) => (
                  <tr key={i} className="border-t border-solid border-[#f2f2f2] align-top">
                    <td className="py-[8px] pr-[8px] text-[#737373]">{i + 1}</td>
                    <td className="py-[12px] pr-[8px] font-semibold whitespace-nowrap text-[#1c2a21]">
                      {FIELDS.find((f) => f.key === c.key)?.label ?? c.key}
                      <span className="block font-mono text-[11px] font-normal text-[#737373]">{c.key}</span>
                    </td>
                    <td className="py-[6px] pr-[8px]">
                      <input
                        aria-label={`Column ${i + 1} CSV header`}
                        value={c.header}
                        onChange={(e) => setCol(i, { header: e.target.value })}
                        className="h-[36px] w-full rounded-[8px] border border-solid border-[#d9d9d9] px-[8px]"
                      />
                    </td>
                    <td className="py-[12px] pr-[8px]">
                      <input
                        type="checkbox"
                        aria-label={`Column ${i + 1} required`}
                        checked={c.required}
                        disabled={isCore(c.key)}
                        onChange={(e) => setCol(i, { required: e.target.checked })}
                      />
                    </td>
                    <td className="py-[12px] pr-[8px]">
                      <input type="checkbox" aria-label={`Column ${i + 1} under-18 only`} checked={Boolean(c.minors)} onChange={(e) => setCol(i, { minors: e.target.checked })} />
                    </td>
                    <td className="py-[6px] pr-[8px]">
                      <input
                        aria-label={`Column ${i + 1} other header spellings`}
                        placeholder="surname, family name"
                        value={(c.aliases || []).join(', ')}
                        onChange={(e) => setCol(i, { aliases: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })}
                        className="h-[36px] w-full rounded-[8px] border border-solid border-[#d9d9d9] px-[8px]"
                      />
                    </td>
                    <td className="py-[6px] pr-[8px]">
                      <input
                        aria-label={`Column ${i + 1} example`}
                        value={c.example}
                        onChange={(e) => setCol(i, { example: e.target.value })}
                        className="h-[36px] w-full rounded-[8px] border border-solid border-[#d9d9d9] px-[8px]"
                      />
                    </td>
                    <td className="py-[6px] pr-[8px]">
                      <input
                        aria-label={`Column ${i + 1} help`}
                        value={c.help}
                        onChange={(e) => setCol(i, { help: e.target.value })}
                        className="h-[36px] w-full rounded-[8px] border border-solid border-[#d9d9d9] px-[8px]"
                      />
                    </td>
                    <td className="py-[8px]">
                      <div className="flex gap-[4px]">
                        <IconBtn label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                          ↑
                        </IconBtn>
                        <IconBtn label="Move down" disabled={i === draft.columns.length - 1} onClick={() => move(i, 1)}>
                          ↓
                        </IconBtn>
                        <IconBtn
                          label="Remove column"
                          disabled={isCore(c.key)}
                          onClick={() => setDraft((d) => ({ ...d, columns: d.columns.filter((_, j) => j !== i) }))}
                        >
                          ×
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center gap-[14px]">
            {FIELDS.filter((f) => !draft.columns.some((c) => c.key === f.key)).map((f) => (
              <TextAction key={f.key} tone="green" onClick={() => setDraft((d) => ({ ...d, columns: [...d.columns, blankColumn(f.key)] }))}>
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
            <span className="font-sans text-[13px] font-semibold text-[#1c2a21]">Preview: {draft.fileName}</span>
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
          <TextInput label="Reason (logged)" required value={reason} onChange={(e) => setReason(e.target.value)} error={error || undefined} />
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
                <li key={i} className="rounded-[12px] bg-[#f8f8f4] p-[10px] font-sans text-[13px] leading-[18px]">
                  <strong>
                    v{h.previousValue?.version ?? '?'} → v{h.newValue?.version ?? '?'} · {h.newValue?.columns?.length ?? '?'} columns
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
