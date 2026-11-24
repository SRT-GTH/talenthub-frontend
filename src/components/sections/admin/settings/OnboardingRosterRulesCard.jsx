import { useEffect, useMemo, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { Checkbox, TextInput } from '../../../ui/form';
import { GroupCard, TextAction } from '../../talentSettings/SettingsBUi.jsx';
import AdminConfirmDialog from '../ui/AdminConfirmDialog.jsx';
import { adminError, shortDate, updateConfig } from '../../../../services/admin.api.js';

const log = debug('OnboardingRosterRulesCard');

/*
 * OnboardingRosterRulesCard — Settings › Onboarding templates, second card (Super Admin): the rules of the institution bulk upload, platform config
 * onboarding.bulk_roster_rules (ADR-11 / ADR-13; backend utils/institution/rosterRules.js validateRules):
 *   Ghana Card column: Required / Optional / Off, and whether the student ID counts instead of it (only a hash of a card number is ever stored)
 *   Opt-out window: days a parent's opt-out link works after the school's notice (US-1.1.2-02)
 *   Education levels: name, on / off, parent contact recommended or not needed (University: not needed), year groups (comma-separated), other spellings
 * Save asks for a reason (PATCH /api/admin/config/:key); the backend checks the shape and bumps the version.
 * Props: config (the platformconfigs row of the key, from the tab's listConfig), onSaved(), toast(title, body).
 */

const KEY = 'onboarding.bulk_roster_rules';
const CARD_MODES = [
  { id: 'required', label: 'Required' },
  { id: 'optional', label: 'Optional' },
  { id: 'off', label: 'Off (not collected)' },
];
const csv = (list) => (list || []).join(', ');
const words = (s) => [
  ...new Set(
    String(s || '')
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
  ),
];
const levelKey = (name, taken) => {
  let base =
    String(name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .replace(/^[0-9_]+/, '')
      .slice(0, 24) || 'level';
  if (base.length < 2) base = `${base}_level`;
  let key = base;
  for (let i = 2; taken.has(key); i++) key = `${base}_${i}`;
  return key;
};
const inputCls =
  'h-[40px] w-full min-w-0 rounded-[8px] border border-solid border-[#d9d9d9] bg-white px-[10px] font-sans text-[14px] text-[#1c2a21]';
const labelCls =
  'flex min-w-0 flex-col gap-[4px] font-sans text-[12.5px] font-semibold text-[#595959]';

const OnboardingRosterRulesCard = ({ config, onSaved, toast }) => {
  const [draft, setDraft] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [newLevel, setNewLevel] = useState('');

  useEffect(() => {
    if (config && !draft) setDraft(structuredClone(config.value));
  }, [config, draft]);

  const dirty = useMemo(
    () => config && draft && JSON.stringify(config.value) !== JSON.stringify(draft),
    [config, draft]
  );
  const problems = useMemo(() => {
    if (!draft) return [];
    const out = [];
    const days = Number(draft.optOut?.windowDays);
    if (!Number.isInteger(days) || days < 1 || days > 365)
      out.push('The opt-out window must be 1 to 365 days.');
    if (!(draft.levels || []).some((l) => l.enabled !== false))
      out.push('Keep at least one level switched on.');
    (draft.levels || []).forEach((l, i) => {
      if (!String(l.label || '').trim()) out.push(`Level ${i + 1} needs a name.`);
      if (!(l.grades || []).length)
        out.push(`${l.label || `Level ${i + 1}`} needs at least one year group.`);
    });
    return out;
  }, [draft]);

  if (!config) {
    return (
      <GroupCard className="min-w-0" title="Levels, year groups and student ID" description="">
        <p className="m-0 font-sans text-[14px] text-[#595959]">
          The setting onboarding.bulk_roster_rules isn’t on this server yet: restart the backend so
          it seeds it.
        </p>
      </GroupCard>
    );
  }
  if (!draft) return null;

  const setLevel = (i, patch) =>
    setDraft((d) => ({
      ...d,
      levels: d.levels.map((l, j) => (j === i ? { ...l, ...patch } : l)),
    }));
  const setGrades = (i, text) =>
    setDraft((d) => ({
      ...d,
      levels: d.levels.map((l, j) => {
        if (j !== i) return l;
        const old = new Map((l.grades || []).map((g) => [g.label.toLowerCase(), g]));
        // year groups keep their key (and tab, aliases) when the name stays; new names get a key on save
        return {
          ...l,
          grades: words(text).map((label, k) => ({
            ...(old.get(label.toLowerCase()) || {}),
            label,
            year: k + 1,
          })),
        };
      }),
    }));
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
      toast?.(
        'Upload rules saved',
        `Version ${saved.version ?? ''} applies to the next class list an institution checks.`
      );
      setDialog(false);
      setReason('');
      setDraft(structuredClone(saved));
      onSaved?.();
      log('saved', saved.version);
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
        title="Levels, year groups and student ID"
        description={`What the class-list upload accepts. Version ${config.value?.version ?? 1}${
          config.lastModifiedAt ? ` · changed ${shortDate(config.lastModifiedAt)}` : ''
        }.`}
      >
        <div className="flex w-full min-w-0 flex-col gap-[16px]">
          <fieldset className="m-0 flex min-w-0 flex-col gap-[8px] border-0 p-0">
            <legend className="mb-[6px] font-sans text-[14px] font-semibold text-[#1c2a21]">
              Ghana Card column
            </legend>
            <div className="flex flex-wrap gap-x-[18px] gap-y-[8px]">
              {CARD_MODES.map((m) => (
                <label
                  key={m.id}
                  className="flex cursor-pointer items-center gap-[6px] font-sans text-[14px] text-[#1c2a21]"
                >
                  <input
                    type="radio"
                    name="ghana-card-mode"
                    checked={draft.identity?.ghanaCard === m.id}
                    onChange={() =>
                      setDraft((d) => ({ ...d, identity: { ...d.identity, ghanaCard: m.id } }))
                    }
                  />
                  {m.label}
                </label>
              ))}
            </div>
            <Checkbox
              label="Accept the student ID (index number) instead of the Ghana Card"
              checked={draft.identity?.studentIdAlternative !== false}
              disabled={draft.identity?.ghanaCard === 'off'}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  identity: { ...d.identity, studentIdAlternative: e.target.checked },
                }))
              }
              labelClassName="text-[14px] font-medium"
            />
            <p className="m-0 font-sans text-[13px] text-[#595959]">
              Only a fingerprint (hash) of a card number and its last 3 digits are kept, to spot
              duplicates. Off: a Ghana Card column is ignored and left out of the templates.
            </p>
          </fieldset>
          <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
            <TextInput
              label="Parent opt-out window (days)"
              required
              type="number"
              value={String(draft.optOut?.windowDays ?? '')}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  optOut: { ...d.optOut, windowDays: Number(e.target.value) || e.target.value },
                }))
              }
            />
            <p className="m-0 self-end pb-[6px] font-sans text-[13px] text-[#595959]">
              Students under 18 are active at once; their parent’s notice has an opt-out link that
              works this many days.
            </p>
          </div>
          <ol aria-label="Education levels" className="m-0 flex list-none flex-col gap-[12px] p-0">
            {(draft.levels || []).map((l, i) => (
              <li
                key={l.key}
                className="flex min-w-0 flex-col gap-[10px] rounded-[16px] border border-solid border-[#e7e7e7] bg-[#fcfcfa] p-[14px]"
              >
                <div className="flex flex-wrap items-center justify-between gap-[10px]">
                  <span className="font-sans text-[15px] font-semibold text-[#1c2a21]">
                    {l.label || 'New level'}{' '}
                    <span className="font-mono text-[11.5px] font-normal text-[#737373]">
                      {l.key}
                    </span>
                  </span>
                  <label className="flex cursor-pointer items-center gap-[6px] font-sans text-[13.5px] text-[#1c2a21]">
                    <input
                      type="checkbox"
                      aria-label={`${l.label} switched on`}
                      checked={l.enabled !== false}
                      onChange={(e) => setLevel(i, { enabled: e.target.checked })}
                    />
                    On
                  </label>
                </div>
                <div className="grid min-w-0 grid-cols-1 gap-[10px] sm:grid-cols-2 2xl:grid-cols-4">
                  <label className={labelCls}>
                    Name
                    <input
                      aria-label={`${l.label} name`}
                      value={l.label || ''}
                      onChange={(e) => setLevel(i, { label: e.target.value })}
                      className={inputCls}
                    />
                  </label>
                  <label className={labelCls}>
                    Parent contact
                    <select
                      aria-label={`${l.label} parent contact`}
                      value={l.parentContact || 'recommended'}
                      onChange={(e) => setLevel(i, { parentContact: e.target.value })}
                      className={inputCls}
                    >
                      <option value="recommended">Recommended (under-18s)</option>
                      <option value="not-needed">Not needed (adults)</option>
                    </select>
                  </label>
                  <label className={`${labelCls} sm:col-span-2`}>
                    Year groups (comma-separated, in order)
                    <input
                      aria-label={`${l.label} year groups`}
                      defaultValue={(l.grades || []).map((g) => g.label).join(', ')}
                      onBlur={(e) => setGrades(i, e.target.value)}
                      className={inputCls}
                    />
                  </label>
                  <label className={`${labelCls} sm:col-span-2 2xl:col-span-4`}>
                    Other spellings of the level
                    <input
                      aria-label={`${l.label} other spellings`}
                      defaultValue={csv(l.aliases)}
                      onBlur={(e) => setLevel(i, { aliases: words(e.target.value) })}
                      className={inputCls}
                    />
                  </label>
                </div>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-end gap-[10px]">
            <label className={`${labelCls} min-w-[200px] flex-1`}>
              Add a level
              <input
                aria-label="New level name"
                value={newLevel}
                maxLength={60}
                onChange={(e) => setNewLevel(e.target.value)}
                className={inputCls}
              />
            </label>
            <TextAction
              tone="green"
              onClick={() => {
                const name = newLevel.trim();
                if (!name) return;
                setDraft((d) => ({
                  ...d,
                  levels: [
                    ...d.levels,
                    {
                      key: levelKey(name, new Set(d.levels.map((x) => x.key))),
                      label: name,
                      enabled: true,
                      parentContact: 'recommended',
                      aliases: [],
                      grades: [{ label: 'Year 1', year: 1 }],
                    },
                  ],
                }));
                setNewLevel('');
              }}
            >
              + Add level
            </TextAction>
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
                setDialog(true);
              }}
              className="inline-flex h-[48px] cursor-pointer items-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[20px] font-sans text-[15px] font-bold text-white shadow-[0_4px_0_#2a5730] disabled:cursor-not-allowed disabled:opacity-55"
            >
              Save upload rules
            </button>
            {dirty ? (
              <button
                type="button"
                onClick={() => setDraft(structuredClone(config.value))}
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
      {dialog ? (
        <AdminConfirmDialog
          title="Save the upload rules?"
          body="Institutions get the new levels, year groups and identity rule the next time they check a class list."
          primary={{ label: busy ? 'Saving…' : 'Save', arrow: true }}
          secondary="Cancel"
          onPrimary={save}
          onClose={() => setDialog(false)}
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
    </>
  );
};

export default OnboardingRosterRulesCard;
