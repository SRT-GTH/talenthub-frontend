import { useMemo, useState } from 'react';
import { Checkbox, Select, Textarea, TextInput } from '../../../../ui/form';
import { GroupCard, SettingRow } from '../../../talentSettings/SettingsBUi.jsx';
import AdminConfirmDialog from '../../ui/AdminConfirmDialog.jsx';
import AdminLoadNotice from '../../AdminLoadNotice.jsx';
import { useAdminData } from '../../useAdminData.js';
import {
  adminError,
  docId,
  enumDeactivate,
  enumList,
  enumRegister,
  enumUpdate,
} from '../../../../../services/admin.api.js';
import { Btn, Chip, Note } from './shared.jsx';

/*
 * Platform lists (Settings › Reference data › Platform lists): option lists other features read from platformEnum at runtime, so new
 * options need no code change. Each list below says which fields its options carry (stored in the option's metadata).
 *   Support case types     the topics people pick in Help › Contact support, each with its priority, SLA hours and whether it's
 *                          restricted to Senior / Super Admins (support.service reads them within a minute)
 *   Support canned replies the templates staff pick when replying; {{firstName}} becomes the person's first name
 * Built-in options (seeded with the platform) can be edited but not switched off; options you add can be switched off, and adding the
 * same key again switches it back on. Who may answer support is under Roles and permissions (role groups).
 */

const PRIORITY = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const LISTS = [
  {
    domain: 'support_case_type',
    label: 'Support case types',
    text: 'Topics people pick when they contact support. The SLA hours set when a first reply and a resolution are due.',
    defaults: {
      priority: 'normal',
      firstResponseHours: 24,
      resolveHours: 72,
      restricted: false,
      requesterCanPick: true,
    },
    summary: (m) =>
      `${m.priority || 'normal'} priority · first reply ${m.firstResponseHours ?? '–'} h · resolve ${
        m.resolveHours ?? '–'
      } h${m.restricted ? ' · Senior / Super Admins only' : ''}${
        m.requesterCanPick === false ? ' · not offered in the contact form' : ''
      }`,
  },
  {
    domain: 'support_reply',
    label: 'Support canned replies',
    text: 'Templates staff can start a reply from. {{firstName}} is replaced with the person’s first name.',
    defaults: { body: '', caseTypes: [] },
    summary: (m) =>
      `${String(m.body || '').slice(0, 90)}${String(m.body || '').length > 90 ? '…' : ''}${
        m.caseTypes && m.caseTypes.length ? ` · for ${m.caseTypes.join(', ')}` : ' · all types'
      }`,
  },
];

const slug = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);

const Editor = ({ list, item, types, busy, error, onSave, onClose }) => {
  const adding = !item;
  const [label, setLabel] = useState(item?.label || '');
  const [key, setKey] = useState(item?.key || '');
  const [description, setDescription] = useState(item?.description || '');
  const [meta, setMeta] = useState({ ...list.defaults, ...(item?.metadata || {}) });
  const set = (k, v) => setMeta((m) => ({ ...m, [k]: v }));
  const finalKey = adding ? key || slug(label) : item.key;
  const isType = list.domain === 'support_case_type';
  const valid =
    label.trim().length >= 2 &&
    finalKey &&
    (isType
      ? Number(meta.firstResponseHours) > 0 && Number(meta.resolveHours) > 0
      : String(meta.body || '').trim().length >= 10);
  return (
    <AdminConfirmDialog
      title={adding ? `Add to ${list.label.toLowerCase()}` : `Edit “${item.label}”`}
      body={
        adding
          ? 'New options are available straight away. The key is set once and never changes.'
          : 'Changes apply within a minute. The key never changes.'
      }
      primary={{ label: busy ? 'Saving…' : 'Save', tone: 'green' }}
      secondary="Cancel"
      onPrimary={() =>
        valid &&
        !busy &&
        onSave({
          key: finalKey,
          label: label.trim(),
          description: description.trim(),
          metadata: isType
            ? {
                ...meta,
                firstResponseHours: Number(meta.firstResponseHours),
                resolveHours: Number(meta.resolveHours),
              }
            : { ...meta, body: String(meta.body || '').trim() },
        })
      }
      onClose={onClose}
    >
      <div className="flex flex-col gap-[14px]">
        <TextInput label="Name" required value={label} onChange={(e) => setLabel(e.target.value)} />
        {adding ? (
          <TextInput
            label="Key"
            placeholder={slug(label) || 'e.g. payments'}
            value={key}
            onChange={(e) => setKey(slug(e.target.value))}
          />
        ) : null}
        {isType ? (
          <>
            <TextInput
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Select
              label="Priority"
              options={PRIORITY}
              value={meta.priority}
              onChange={(v) => set('priority', v)}
            />
            <div className="grid grid-cols-2 gap-[12px]">
              <TextInput
                label="First reply within (hours)"
                type="number"
                min={1}
                value={String(meta.firstResponseHours ?? '')}
                onChange={(e) => set('firstResponseHours', e.target.value)}
              />
              <TextInput
                label="Resolve within (hours)"
                type="number"
                min={1}
                value={String(meta.resolveHours ?? '')}
                onChange={(e) => set('resolveHours', e.target.value)}
              />
            </div>
            <Checkbox
              label="Offer it in the Contact support form"
              checked={meta.requesterCanPick !== false}
              onChange={(e) => set('requesterCanPick', e.target.checked)}
            />
            <Checkbox
              label="Restricted: only Senior and Super Admins see these queries"
              checked={Boolean(meta.restricted)}
              onChange={(e) => set('restricted', e.target.checked)}
            />
          </>
        ) : (
          <>
            <Textarea
              label="Reply text"
              required
              value={meta.body}
              onChange={(e) => set('body', e.target.value)}
            />
            <div className="flex flex-col gap-[6px]">
              <span className="font-sans text-[14px] font-semibold text-[#1c2a21]">
                Suggested for (none = all types)
              </span>
              {types.map((t) => (
                <Checkbox
                  key={t.key}
                  label={t.label}
                  checked={(meta.caseTypes || []).includes(t.key)}
                  onChange={(e) =>
                    set(
                      'caseTypes',
                      e.target.checked
                        ? [...(meta.caseTypes || []), t.key]
                        : (meta.caseTypes || []).filter((k) => k !== t.key)
                    )
                  }
                />
              ))}
            </div>
          </>
        )}
        {error ? (
          <p role="alert" className="m-0 font-sans text-[14px] text-[#b42318]">
            {error}
          </p>
        ) : null}
      </div>
    </AdminConfirmDialog>
  );
};

const PlatformListsSection = ({ canEdit, toast }) => {
  const [domain, setDomain] = useState(LISTS[0].domain);
  const list = LISTS.find((l) => l.domain === domain);
  const q = useAdminData(() => enumList(domain), [domain]);
  const typesQ = useAdminData(() => enumList('support_case_type'), []);
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const rows = useMemo(
    () => [...(q.data || [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [q.data]
  );

  const save = async (p) => {
    setBusy(true);
    setError('');
    try {
      if (editing === 'new') {
        await enumRegister({
          domain,
          key: p.key,
          label: p.label,
          description: p.description || undefined,
          sortOrder: rows.length + 1,
          metadata: p.metadata,
        });
        toast(`Added “${p.label}”`);
      } else {
        await enumUpdate(docId(editing), {
          label: p.label,
          description: p.description,
          metadata: p.metadata,
        });
        toast(`Saved “${p.label}”`);
      }
      setEditing(null);
      q.reload();
      if (domain === 'support_case_type') typesQ.reload();
    } catch (e) {
      setError(adminError(e));
    } finally {
      setBusy(false);
    }
  };

  const switchOff = async (item) => {
    try {
      await enumDeactivate(docId(item));
      toast(`Switched off “${item.label}”`);
      q.reload();
    } catch (e) {
      toast(adminError(e));
    }
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-wrap items-center gap-[8px]">
        {LISTS.map((l) => (
          <Btn key={l.domain} primary={l.domain === domain} onClick={() => setDomain(l.domain)}>
            {l.label}
          </Btn>
        ))}
      </div>
      <Note>
        {list.text} Built-in options can be edited but not switched off.
        {canEdit ? '' : ' Senior and Super Admins make changes.'}
      </Note>
      {canEdit ? (
        <div>
          <Btn primary onClick={() => setEditing('new')}>
            Add option
          </Btn>
        </div>
      ) : null}
      {q.loading || q.error ? (
        <AdminLoadNotice loading={q.loading} error={q.error} status={q.status} onRetry={q.reload} />
      ) : (
        <GroupCard title={list.label} description={`${rows.length} active`}>
          {rows.map((r) => (
            <SettingRow
              key={docId(r) || r.key}
              title={
                <span className="inline-flex flex-wrap items-center gap-[8px]">
                  {r.label}
                  <Chip>{r.key}</Chip>
                  {r.isBuiltIn ? <Chip>Built-in</Chip> : <Chip tone="good">Added</Chip>}
                </span>
              }
              description={list.summary(r.metadata || {})}
              control={
                canEdit ? (
                  <span className="inline-flex gap-[8px]">
                    <Btn onClick={() => setEditing(r)}>Edit</Btn>
                    {!r.isBuiltIn ? <Btn onClick={() => switchOff(r)}>Switch off</Btn> : null}
                  </span>
                ) : null
              }
            />
          ))}
        </GroupCard>
      )}
      {editing ? (
        <Editor
          list={list}
          item={editing === 'new' ? null : editing}
          types={typesQ.data || []}
          busy={busy}
          error={error}
          onSave={save}
          onClose={() => {
            setError('');
            setEditing(null);
          }}
        />
      ) : null}
    </div>
  );
};

export default PlatformListsSection;
