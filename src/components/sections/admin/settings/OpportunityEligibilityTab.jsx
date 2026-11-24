import { useEffect, useMemo, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { TextInput } from '../../../ui/form';
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
import {
  ACCESS,
  AGE_BANDS,
  APPLIES_TO,
  EDUCATION_GROUPS,
  ELIGIBILITY_KEY,
  KINDS,
  MINOR_CAPPED_KINDS,
  accessFor,
} from '../../../../utils/opportunityTypes.js';

const log = debug('OpportunityEligibilityTab');

/*
 * OpportunityEligibilityTab — Settings › Opportunity eligibility (Super Admin; ADR-06). Edits platform config
 * opportunity.eligibility_rules: for each age band and each education level, which kinds of opportunity talents see and
 * may apply to. The talent's age rule and education rule are read together and the stricter one wins.
 * Save asks for a reason (PATCH /api/admin/config/:key): the backend checks every cell, refuses unsafe values (under-18s
 * never get paid work without the posting's opt-in), bumps the version and logs CONFIG_VALUE_UPDATED. "Reset to defaults"
 * loads the seeded defaults (GET /api/admin/config returns them as defaultValue) to review before saving. History lists
 * earlier versions. "Check a talent" shows what one kind of talent would get with the rules on screen.
 */

const SELECT =
  'h-[34px] w-full min-w-[128px] cursor-pointer rounded-[8px] border border-solid border-[#d9d9d9] bg-white px-[6px] font-sans text-[13px] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#387440]';
const TONE = {
  yes: 'bg-[#ebf1ec] text-[#2a5730]',
  opt_in: 'bg-[#faf4e8] text-[#785910]',
  view: 'bg-[#eef1f5] text-[#3d4a5c]',
  no: 'bg-[#f6eceb] text-[#902b20]',
};
const accessLabel = (id) => ACCESS.find((a) => a.id === id)?.label ?? id;
const same = (a, b) =>
  JSON.stringify({ a: a?.ageBands, e: a?.educationGroups }) ===
  JSON.stringify({ a: b?.ageBands, e: b?.educationGroups });

// The checks the backend makes (utils/opportunityEligibility normaliseRules), so Save is offered only for a valid draft.
const problemsOf = (draft) => {
  const out = [];
  AGE_BANDS.forEach((b) =>
    KINDS.forEach((k) => {
      const v = draft?.ageBands?.[b.id]?.[k.id];
      if (!ACCESS.some((a) => a.id === v)) out.push(`${b.label}: choose a value for ${k.label}.`);
      else if (!b.minor && v === 'opt_in')
        out.push(`${b.label}: “${accessLabel('opt_in')}” is only for under-18s (${k.label}).`);
      else if (b.minor && v === 'yes' && MINOR_CAPPED_KINDS.includes(k.id))
        out.push(
          `${b.label}: ${k.label} are paid work; under-18s may reach them only through postings open to under-18s.`
        );
    })
  );
  EDUCATION_GROUPS.forEach((g) => {
    const r = draft?.educationGroups?.[g.id];
    if (!APPLIES_TO.some((a) => a.id === r?.appliesTo))
      out.push(`${g.label}: choose who the rule applies to.`);
    KINDS.forEach((k) => {
      if (!ACCESS.some((a) => a.id === r?.allow?.[k.id]))
        out.push(`${g.label}: choose a value for ${k.label}.`);
    });
  });
  return out;
};

const Cell = ({ value, options, onChange, label }) => (
  <select
    aria-label={label}
    value={value ?? ''}
    onChange={(e) => onChange(e.target.value)}
    className={SELECT}
  >
    {options.map((a) => (
      <option key={a.id} value={a.id}>
        {a.label}
      </option>
    ))}
  </select>
);

// Rows = kinds of opportunity, columns = age bands or education levels; the table scrolls inside its card on phones.
const Matrix = ({ caption, columns, valueOf, optionsFor, onChange, head = null }) => (
  <div className="w-full min-w-0 overflow-x-auto">
    <table className="w-full min-w-[600px] border-collapse font-sans text-[13px]">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr>
          <th
            scope="col"
            className="sticky left-0 z-[1] bg-white py-[8px] pr-[10px] text-left font-semibold text-[#575755]"
          >
            Opportunity
          </th>
          {columns.map((c) => (
            <th
              key={c.id}
              scope="col"
              className="px-[4px] py-[8px] text-left align-bottom font-semibold text-[#1c2a21]"
            >
              {c.label}
            </th>
          ))}
        </tr>
        {head}
      </thead>
      <tbody>
        {KINDS.map((k) => (
          <tr key={k.id} className="border-0 border-t border-solid border-[#eeeeea]">
            <th
              scope="row"
              className="sticky left-0 z-[1] bg-white py-[6px] pr-[10px] text-left font-medium text-[#1c2a21]"
            >
              {k.label}
            </th>
            {columns.map((c) => (
              <td key={c.id} className="px-[4px] py-[6px]">
                <Cell
                  value={valueOf(c, k)}
                  options={optionsFor(c, k)}
                  onChange={(v) => onChange(c, k, v)}
                  label={`${k.label}, ${c.label}`}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// "Check a talent": what one kind of talent gets with the rules on screen (saved or not).
const Preview = ({ rules }) => {
  const [band, setBand] = useState('age_16_17');
  const [group, setGroup] = useState('shs');
  const [studying, setStudying] = useState(true);
  const minor = Boolean(AGE_BANDS.find((b) => b.id === band)?.minor);
  const facts = { band, group, minor, studying: studying && (group === 'jhs' || group === 'shs') };
  const pick = (label, value, onChange, options) => (
    <label className="flex min-w-[150px] flex-1 flex-col gap-[4px] font-sans text-[12.5px] font-semibold text-[#595959]">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className={SELECT}>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
  return (
    <div className="flex w-full min-w-0 flex-col gap-[12px]">
      <div className="flex flex-wrap items-end gap-[12px]">
        {pick('Age', band, setBand, AGE_BANDS)}
        {pick('Education level', group, setGroup, EDUCATION_GROUPS)}
        {group === 'jhs' || group === 'shs'
          ? pick('At school now?', studying ? 'yes' : 'no', (v) => setStudying(v === 'yes'), [
              { id: 'yes', label: 'Yes, still at school' },
              { id: 'no', label: 'No, finished (BECE / WASSCE)' },
            ])
          : null}
      </div>
      <ul className="m-0 flex list-none flex-wrap gap-[8px] p-0">
        {KINDS.map((k) => {
          const { access } = accessFor(rules, facts, k.id);
          return (
            <li
              key={k.id}
              className={`rounded-full px-[10px] py-[4px] font-sans text-[12.5px] font-semibold ${TONE[access] ?? ''}`}
            >
              {k.short}: {accessLabel(access)}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
const OpportunityEligibilityTab = ({ session }) => {
  const cfg = useAdminData(() => listConfig(), []);
  const [toastEl, toast] = useAdminToast();
  const current = (cfg.data?.configs ?? []).find((c) => c.key === ELIGIBILITY_KEY);
  const [draft, setDraft] = useState(null);
  const [dialog, setDialog] = useState(null); // 'save' | 'history'
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const hist = useAdminData(
    () => (dialog === 'history' ? configHistory(ELIGIBILITY_KEY) : Promise.resolve(null)),
    [dialog]
  );

  useEffect(() => {
    if (current && !draft) setDraft(structuredClone(current.value));
  }, [current, draft]);

  const dirty = useMemo(
    () => Boolean(current && draft && !same(current.value, draft)),
    [current, draft]
  );
  const problems = useMemo(() => (draft ? problemsOf(draft) : []), [draft]);
  const defaults = current?.defaultValue ?? null;

  if (session?.role !== 'super') {
    return <AdminLoadNotice error="Only Super Admins edit opportunity eligibility." status={403} />;
  }
  if (cfg.loading || cfg.error || !draft) {
    return (
      <AdminLoadNotice
        loading={cfg.loading || (!cfg.error && !draft && Boolean(current))}
        error={
          cfg.error ||
          (!current && !cfg.loading
            ? 'The eligibility rules aren’t on this server yet: restart the backend so it seeds opportunity.eligibility_rules.'
            : null)
        }
        status={cfg.status}
        onRetry={cfg.reload}
      />
    );
  }

  const setAge = (band, kind, v) =>
    setDraft((d) => ({
      ...d,
      ageBands: { ...d.ageBands, [band.id]: { ...d.ageBands?.[band.id], [kind.id]: v } },
    }));
  const setEdu = (group, kind, v) =>
    setDraft((d) => {
      const rule = d.educationGroups?.[group.id] ?? {};
      return {
        ...d,
        educationGroups: {
          ...d.educationGroups,
          [group.id]: { ...rule, allow: { ...rule.allow, [kind.id]: v } },
        },
      };
    });
  const setApplies = (groupId, v) =>
    setDraft((d) => ({
      ...d,
      educationGroups: {
        ...d.educationGroups,
        [groupId]: { ...d.educationGroups?.[groupId], appliesTo: v },
      },
    }));
  // Adults have no "if open to under-18s"; under-18s never get paid work outright.
  const ageOptions = (band, kind) =>
    ACCESS.filter((a) =>
      band.minor ? !(a.id === 'yes' && MINOR_CAPPED_KINDS.includes(kind.id)) : a.id !== 'opt_in'
    );

  const save = async () => {
    if (busy) return;
    if (reason.trim().length < 3) {
      setError('Give a reason (it’s logged).');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await updateConfig(ELIGIBILITY_KEY, draft, reason.trim());
      const saved = res?.config?.value ?? draft;
      log('saved', saved.version);
      toast(
        'Eligibility rules saved',
        `Version ${saved.version ?? ''}. Talents and recruiters see the change within a minute.`
      );
      setDialog(null);
      setReason('');
      setDraft(structuredClone(saved));
      cfg.reload();
    } catch (e) {
      setError(adminError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <GroupCard
        className="min-w-0"
        title="How the rules work"
        description={`Version ${current.value?.version ?? 1}${
          current.lastModifiedAt ? ` · changed ${shortDate(current.lastModifiedAt)}` : ''
        }. Each talent gets an age rule (from their date of birth) and an education rule (from their education level); the stricter of the two wins.`}
      >
        <ul className="m-0 grid list-none grid-cols-1 gap-[8px] p-0 sm:grid-cols-2">
          {ACCESS.map((a) => (
            <li
              key={a.id}
              className="flex items-start gap-[8px] font-sans text-[13px] leading-[18px]"
            >
              <span
                className={`shrink-0 rounded-full px-[8px] py-[2px] text-[12px] font-semibold ${TONE[a.id]}`}
              >
                {a.label}
              </span>
              <span className="text-[#595959]">{a.hint}</span>
            </li>
          ))}
        </ul>
      </GroupCard>

      <GroupCard
        className="min-w-0"
        title="By age"
        description="From the talent’s date of birth (with none on file, an under-18 counts as 16–17). Under-18s reach paid work only through postings the recruiter opened to under-18s."
      >
        <Matrix
          caption="Access by age band"
          columns={AGE_BANDS}
          valueOf={(b, k) => draft.ageBands?.[b.id]?.[k.id]}
          optionsFor={ageOptions}
          onChange={setAge}
        />
      </GroupCard>

      <GroupCard
        className="min-w-0"
        title="By education level"
        description="From the talent’s education level (JHS includes finished JHS / BECE, SHS includes finished SHS / WASSCE). “Applies to” sets who the rule covers, so an adult who finished SHS years ago isn’t held to the SHS rule."
      >
        <Matrix
          caption="Access by education level"
          columns={EDUCATION_GROUPS}
          valueOf={(g, k) => draft.educationGroups?.[g.id]?.allow?.[k.id]}
          optionsFor={() => ACCESS}
          onChange={setEdu}
          head={
            <tr>
              <th
                scope="row"
                className="sticky left-0 z-[1] bg-white py-[6px] pr-[10px] text-left font-medium text-[#575755]"
              >
                Applies to
              </th>
              {EDUCATION_GROUPS.map((g) => (
                <td key={g.id} className="px-[4px] py-[6px]">
                  <Cell
                    value={draft.educationGroups?.[g.id]?.appliesTo}
                    options={APPLIES_TO}
                    onChange={(v) => setApplies(g.id, v)}
                    label={`${g.label}: applies to`}
                  />
                </td>
              ))}
            </tr>
          }
        />
      </GroupCard>

      <GroupCard
        className="min-w-0"
        title="Check a talent"
        description="What one kind of talent gets with the rules on this screen (saved or not)."
      >
        <Preview rules={draft} />
      </GroupCard>

      {problems.length ? (
        <ul className="m-0 list-disc pl-[20px] font-sans text-[13.5px] leading-[20px] text-[#902b20]">
          {problems.slice(0, 12).map((p) => (
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
          Save rules
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
        {defaults && !same(defaults, draft) ? (
          <TextAction
            tone="green"
            onClick={() => {
              log('reset to defaults (not saved yet)');
              setDraft({ ...structuredClone(defaults), version: draft.version });
            }}
          >
            Reset to defaults
          </TextAction>
        ) : null}
        <TextAction tone="green" onClick={() => setDialog('history')}>
          History
        </TextAction>
      </div>

      {dialog === 'save' ? (
        <AdminConfirmDialog
          title="Save these eligibility rules?"
          body="Talents’ job lists, apply buttons, recruiter talent search and Career Buddy follow the new rules within a minute. Applications already sent aren’t affected."
          primary={{ label: busy ? 'Saving…' : 'Save', arrow: true }}
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
          title="Eligibility rules history"
          body={hist.loading ? 'Loading…' : `${hist.data?.totalChanges ?? 0} changes.`}
          primary={{ label: 'Close' }}
          secondary="Done"
          onPrimary={() => setDialog(null)}
          onClose={() => setDialog(null)}
        >
          <ul className="m-0 flex max-h-[320px] list-none flex-col gap-[10px] overflow-auto p-0">
            {(hist.data?.history ?? []).map((h, i) => (
              <li
                key={i}
                className="rounded-[12px] bg-[#f8f8f4] p-[10px] font-sans text-[13px] leading-[18px]"
              >
                <strong>
                  v{h.previousValue?.version ?? '?'} → v{h.newValue?.version ?? '?'}
                </strong>
                <span className="block text-[#737373]">
                  {shortDate(h.modifiedAt)} · {h.reason}
                </span>
                {h.previousValue?.ageBands ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDraft({ ...structuredClone(h.previousValue), version: draft.version });
                      setDialog(null);
                    }}
                    className="mt-[4px] cursor-pointer border-0 bg-transparent p-0 font-semibold text-[#387440] underline"
                  >
                    Load the version before this change
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </AdminConfirmDialog>
      ) : null}
      {toastEl}
    </>
  );
};

export default OpportunityEligibilityTab;
