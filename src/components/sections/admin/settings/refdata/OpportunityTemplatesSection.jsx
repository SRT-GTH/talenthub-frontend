import { useState } from 'react';
import { Checkbox, Select, TextInput, Textarea } from '../../../../ui/form';
import { GroupCard, SettingRow, TextAction } from '../../../talentSettings/SettingsBUi.jsx';
import AdminConfirmDialog from '../../ui/AdminConfirmDialog.jsx';
import AdminLoadNotice from '../../AdminLoadNotice.jsx';
import { useAdminData } from '../../useAdminData.js';
import {
  catCategories,
  catCurrencies,
  catDeleteOppTemplate,
  catOppTemplates,
  catSaveOppTemplate,
  catSetOppTemplateActive,
  humanize,
} from '../../../../../services/admin.api.js';
import { Btn, Note, ReasonInput } from './shared.jsx';
import { useReasonRun } from './useReasonRun.js';

/*
 * Opportunity templates: ready-made defaults a recruiter can start a posting from (title, type, category,
 * work mode, pay, skills, requirements, benefits, tags). The server whitelists and validates every field.
 * A template that opportunities were made from can't be deleted (deactivate it instead).
 */

const EMPTY = {
  name: '',
  group: '',
  about: '',
  title: '',
  shortDescription: '',
  description: '',
  type: '',
  category: '',
  workMode: '',
  durationType: '',
  currency: '',
  payType: '',
  min: '',
  max: '',
  negotiable: false,
  skills: [],
  requirements: '',
  benefits: '',
  tags: '',
};

const lines = (s) =>
  String(s || '')
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);

const toForm = (t) => {
  const df = t?.defaultFields || {};
  return {
    ...EMPTY,
    name: t?.name || '',
    group: t?.category || '',
    about: t?.description || '',
    title: df.title || '',
    shortDescription: df.shortDescription || '',
    description: df.description || '',
    type: df.type || '',
    category: df.category ? String(df.category) : '',
    workMode: df.location?.type || '',
    durationType: df.duration?.type || '',
    currency: df.salary?.currency || '',
    payType: df.salary?.type || '',
    min: df.salary?.min != null ? String(df.salary.min) : '',
    max: df.salary?.max != null ? String(df.salary.max) : '',
    negotiable: Boolean(df.salary?.negotiable),
    skills: (df.skills || []).map((s) => ({ ...s })),
    requirements: (df.applicationRequirements || []).join('\n'),
    benefits: (df.benefits || []).join('\n'),
    tags: (df.tags || []).join('\n'),
  };
};

const toDefaults = (f) => {
  const out = {};
  for (const k of ['title', 'shortDescription', 'description', 'type', 'category']) {
    if (String(f[k]).trim()) out[k] = String(f[k]).trim();
  }
  if (f.workMode) out.location = { type: f.workMode };
  if (f.durationType) out.duration = { type: f.durationType };
  const salary = {};
  if (f.currency) salary.currency = f.currency;
  if (f.payType) salary.type = f.payType;
  if (f.min !== '') salary.min = Number(f.min);
  if (f.max !== '') salary.max = Number(f.max);
  if (f.negotiable) salary.negotiable = true;
  if (Object.keys(salary).length) out.salary = salary;
  const skills = f.skills.filter((s) => s.name.trim());
  if (skills.length) out.skills = skills.map((s) => ({ ...s, name: s.name.trim() }));
  if (lines(f.requirements).length) out.applicationRequirements = lines(f.requirements);
  if (lines(f.benefits).length) out.benefits = lines(f.benefits);
  if (lines(f.tags).length) out.tags = lines(f.tags);
  return out;
};

const opt = (values) => [
  { value: '', label: 'Not set' },
  ...(values || []).map((v) => ({ value: v, label: humanize(v.replace(/-/g, ' ')) })),
];

const Editor = ({ tpl, options, toast, onDone }) => {
  const cats = useAdminData(() => catCategories(), []);
  const curs = useAdminData(() => catCurrencies(), []);
  const [form, setForm] = useState(() => toForm(tpl));
  const [confirming, setConfirming] = useState(false);
  const [formError, setFormError] = useState('');
  const r = useReasonRun(toast, () => {
    setConfirming(false);
    onDone(true);
  });
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v?.target ? v.target.value : v }));
  const setSkill = (i, patch) =>
    setForm((f) => ({ ...f, skills: f.skills.map((s, j) => (j === i ? { ...s, ...patch } : s)) }));

  const check = () => {
    if (form.name.trim().length < 3) return 'Give the template a name (3+ characters).';
    for (const k of ['min', 'max']) {
      if (form[k] !== '' && !(Number(form[k]) >= 0))
        return `Pay ${k === 'min' ? 'from' : 'to'} is a number of 0 or more.`;
    }
    if (form.min !== '' && form.max !== '' && Number(form.min) > Number(form.max))
      return 'Pay from is above pay to.';
    return '';
  };

  const catOptions = [
    { value: '', label: 'Not set' },
    ...(cats.data?.categories ?? []).map((c) => ({
      value: c.id,
      label: `${c.name}${c.isActive === false ? ' (inactive)' : ''}`,
    })),
  ];
  const curOptions = [
    { value: '', label: 'Not set' },
    ...(curs.data?.currencies ?? [])
      .filter((c) => c.isActive || c.code === form.currency)
      .map((c) => ({ value: c.code, label: `${c.code} · ${c.name}` })),
  ];
  const levelOptions = (options?.skillLevels || []).map((v) => ({ value: v, label: humanize(v) }));
  const grid = 'grid grid-cols-1 gap-[12px] md:grid-cols-2';
  const h = 'm-0 font-sans text-[15px] font-semibold text-[#1c2a21]';

  return (
    <GroupCard
      title={tpl ? `Edit ${tpl.name}` : 'New opportunity template'}
      description="Recruiters start a posting from these defaults and can change anything before publishing. Leave a field as Not set to let the recruiter fill it."
      gap="gap-[16px]"
    >
      <div>
        <TextAction tone="green" onClick={() => onDone(false)}>
          ← All opportunity templates
        </TextAction>
      </div>
      {tpl?.usedBy ? (
        <Note tone="warn">
          {tpl.usedBy} opportunit{tpl.usedBy === 1 ? 'y was' : 'ies were'} made from this template.
          Changes only affect new postings.
        </Note>
      ) : null}

      <h3 className={h}>About the template</h3>
      <div className={grid}>
        <TextInput label="Template name" required value={form.name} onChange={set('name')} />
        <TextInput
          label="Group"
          optional
          placeholder="e.g. Engineering"
          value={form.group}
          onChange={set('group')}
        />
      </div>
      <TextInput
        label="What it’s for"
        optional
        placeholder="Shown to recruiters when they pick a template"
        value={form.about}
        onChange={set('about')}
      />

      <h3 className={h}>Posting defaults</h3>
      <TextInput label="Opportunity title" optional value={form.title} onChange={set('title')} />
      <TextInput
        label="Short description"
        optional
        value={form.shortDescription}
        onChange={set('shortDescription')}
      />
      <Textarea
        label="Description"
        optional
        rows={5}
        maxLength={5000}
        value={form.description}
        onChange={set('description')}
      />
      <div className={grid}>
        <Select
          label="Opportunity type"
          options={opt(options?.types)}
          value={form.type}
          onChange={set('type')}
        />
        <Select
          label="Category"
          searchable
          options={catOptions}
          value={form.category}
          onChange={set('category')}
          helperText={cats.loading ? 'Loading categories…' : undefined}
        />
        <Select
          label="Work mode"
          options={opt(options?.workModes)}
          value={form.workMode}
          onChange={set('workMode')}
        />
        <Select
          label="Contract type"
          options={opt(options?.durationTypes)}
          value={form.durationType}
          onChange={set('durationType')}
        />
      </div>

      <h3 className={h}>Pay</h3>
      <div className={grid}>
        <Select
          label="Currency"
          searchable
          options={curOptions}
          value={form.currency}
          onChange={set('currency')}
        />
        <Select
          label="Pay period"
          options={opt(options?.salaryTypes)}
          value={form.payType}
          onChange={set('payType')}
        />
        <TextInput
          label="Pay from"
          optional
          inputMode="decimal"
          value={form.min}
          onChange={set('min')}
        />
        <TextInput
          label="Pay to"
          optional
          inputMode="decimal"
          value={form.max}
          onChange={set('max')}
        />
      </div>
      <Checkbox
        label="Pay is negotiable"
        checked={form.negotiable}
        onChange={(e) => setForm((f) => ({ ...f, negotiable: e.target.checked }))}
      />

      <h3 className={h}>Skills</h3>
      {form.skills.map((s, i) => (
        <div
          key={i}
          className="grid grid-cols-1 items-end gap-[10px] md:grid-cols-[1fr_180px_auto_auto]"
        >
          <TextInput
            label={`Skill ${i + 1}`}
            value={s.name}
            onChange={(e) => setSkill(i, { name: e.target.value })}
          />
          <Select
            label="Level"
            options={levelOptions}
            value={s.level || 'basic'}
            onChange={(v) => setSkill(i, { level: v })}
          />
          <Checkbox
            label="Required"
            checked={Boolean(s.isRequired)}
            onChange={(e) => setSkill(i, { isRequired: e.target.checked })}
          />
          <TextAction
            onClick={() => setForm((f) => ({ ...f, skills: f.skills.filter((_, j) => j !== i) }))}
            aria-label={`Remove skill ${i + 1}`}
          >
            Remove
          </TextAction>
        </div>
      ))}
      {form.skills.length < 30 ? (
        <div>
          <TextAction
            tone="green"
            onClick={() =>
              setForm((f) => ({
                ...f,
                skills: [...f.skills, { name: '', level: 'basic', isRequired: false }],
              }))
            }
          >
            + Add skill
          </TextAction>
        </div>
      ) : null}

      <h3 className={h}>Lists (one per line)</h3>
      <div className="grid grid-cols-1 gap-[12px] md:grid-cols-3">
        <Textarea
          label="Application requirements"
          optional
          rows={4}
          value={form.requirements}
          onChange={set('requirements')}
        />
        <Textarea
          label="Benefits"
          optional
          rows={4}
          value={form.benefits}
          onChange={set('benefits')}
        />
        <Textarea label="Tags" optional rows={4} value={form.tags} onChange={set('tags')} />
      </div>

      {formError ? <p className="m-0 font-sans text-[14px] text-[#b42318]">{formError}</p> : null}
      <div className="flex flex-wrap gap-[10px]">
        <Btn
          primary
          onClick={() => {
            const e = check();
            setFormError(e);
            if (e) return;
            r.reset();
            setConfirming(true);
          }}
        >
          {tpl ? 'Save changes' : 'Create template'}
        </Btn>
        <Btn onClick={() => onDone(false)}>Cancel</Btn>
      </div>

      {confirming ? (
        <AdminConfirmDialog
          title={tpl ? `Save ${form.name.trim()}?` : `Create ${form.name.trim()}?`}
          body="The audit log keeps what you replaced."
          primary={{ label: r.busy ? 'Saving…' : 'Save', arrow: true }}
          secondary="Cancel"
          onPrimary={() =>
            r.run(
              () =>
                catSaveOppTemplate(tpl?.id, {
                  name: form.name.trim(),
                  category: form.group.trim() || undefined,
                  description: form.about.trim() || undefined,
                  defaultFields: toDefaults(form),
                  reason: r.reason.trim(),
                }),
              tpl ? 'Template saved' : 'Template created',
              form.name.trim()
            )
          }
          onClose={() => setConfirming(false)}
        >
          <ReasonInput value={r.reason} onChange={r.setReason} error={r.error} />
        </AdminConfirmDialog>
      ) : null}
    </GroupCard>
  );
};

const summary = (t, catName) => {
  const df = t.defaultFields || {};
  const bits = [
    t.category,
    df.type && humanize(df.type.replace(/-/g, ' ')),
    df.category && (catName[df.category] || 'unknown category'),
    df.location?.type && humanize(df.location.type),
    t.usedBy ? `used by ${t.usedBy} opportunit${t.usedBy === 1 ? 'y' : 'ies'}` : 'not used yet',
  ].filter(Boolean);
  return `${bits.join(' · ')}${t.description ? ` · ${t.description}` : ''}`;
};

const OpportunityTemplatesSection = ({ canEdit, toast }) => {
  const list = useAdminData(() => catOppTemplates(), []);
  const cats = useAdminData(() => catCategories(), []);
  const rows = list.data?.templates ?? [];
  const catName = Object.fromEntries((cats.data?.categories ?? []).map((c) => [c.id, c.name]));
  const [editing, setEditing] = useState(null); // 'new' | template
  const [dialog, setDialog] = useState(null); // { kind: 'active'|'delete', t }
  const r = useReasonRun(toast, () => {
    setDialog(null);
    list.reload();
  });

  if (editing) {
    return (
      <Editor
        tpl={editing === 'new' ? null : editing}
        options={list.data?.options}
        toast={toast}
        onDone={(saved) => {
          setEditing(null);
          if (saved) list.reload();
        }}
      />
    );
  }

  const d = dialog;
  return (
    <GroupCard
      title="Opportunity templates"
      description="Ready-made defaults recruiters can start a posting from. A template opportunities were made from can’t be deleted; deactivate it so recruiters stop seeing it."
      gap="gap-0"
    >
      {canEdit ? (
        <div className="pb-[12px]">
          <TextAction tone="green" onClick={() => setEditing('new')}>
            + New template
          </TextAction>
        </div>
      ) : null}
      <AdminLoadNotice
        loading={list.loading}
        error={list.error}
        status={list.status}
        onRetry={list.reload}
      >
        {rows.map((t) => (
          <SettingRow
            key={t.id}
            title={`${t.name}${t.isActive === false ? ' · inactive' : ''}`}
            description={summary(t, catName)}
            top
            control={
              canEdit ? (
                <div className="flex items-center gap-[14px]">
                  <TextAction tone="green" onClick={() => setEditing(t)}>
                    Edit
                  </TextAction>
                  <TextAction
                    tone={t.isActive === false ? 'green' : 'danger'}
                    onClick={() => {
                      r.reset();
                      setDialog({ kind: 'active', t });
                    }}
                  >
                    {t.isActive === false ? 'Activate' : 'Deactivate'}
                  </TextAction>
                  {!t.usedBy ? (
                    <TextAction
                      onClick={() => {
                        r.reset();
                        setDialog({ kind: 'delete', t });
                      }}
                    >
                      Delete
                    </TextAction>
                  ) : null}
                </div>
              ) : null
            }
          />
        ))}
        {!rows.length && !list.loading ? (
          <p className="m-0 font-sans text-[14px] text-[#737373]">
            No templates yet. Recruiters start every posting from a blank form.
          </p>
        ) : null}
      </AdminLoadNotice>

      {d?.kind === 'active' ? (
        <AdminConfirmDialog
          title={`${d.t.isActive === false ? 'Activate' : 'Deactivate'} ${d.t.name}?`}
          body={
            d.t.isActive === false
              ? 'Recruiters can start postings from it again.'
              : 'Recruiters stop seeing it. Opportunities already made from it don’t change.'
          }
          primary={{
            label: r.busy ? 'Saving…' : 'Confirm',
            tone: d.t.isActive === false ? 'green' : 'red',
            arrow: d.t.isActive === false,
          }}
          secondary="Cancel"
          onPrimary={() =>
            r.run(
              () => catSetOppTemplateActive(d.t.id, d.t.isActive === false, r.reason.trim()),
              'Saved',
              d.t.name
            )
          }
          onClose={() => setDialog(null)}
        >
          <ReasonInput value={r.reason} onChange={r.setReason} error={r.error} />
        </AdminConfirmDialog>
      ) : null}

      {d?.kind === 'delete' ? (
        <AdminConfirmDialog
          title={`Delete ${d.t.name}?`}
          body="No opportunity was made from it. The audit log keeps its contents."
          primary={{ label: r.busy ? 'Deleting…' : 'Delete', tone: 'red' }}
          secondary="Cancel"
          onPrimary={() =>
            r.run(() => catDeleteOppTemplate(d.t.id, r.reason.trim()), 'Deleted', d.t.name)
          }
          onClose={() => setDialog(null)}
        >
          <ReasonInput value={r.reason} onChange={r.setReason} error={r.error} />
        </AdminConfirmDialog>
      ) : null}
    </GroupCard>
  );
};

export default OpportunityTemplatesSection;
