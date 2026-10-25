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
  notifCoverage,
  notifMappings,
  notifRefreshMappings,
  searchAudit,
  shortDate,
  sysTplGet,
  sysTplList,
  sysTplPreview,
  sysTplStats,
  sysTplTestSend,
  sysTplUpdate,
} from '../../../../services/admin.api.js';

const log = debug('SystemNotificationsTab');

/*
 * SystemNotificationsTab — Settings › System notifications: the emails and SMS the platform sends by itself
 * (/api/templates), and which notification types each one answers (/api/notifications/template-*).
 * Not the comms templates staff send by hand (Comms › Templates).
 *   Templates  list (channel, category, search) → detail: rendered preview, variables, mapped types, edit with a reason,
 *              history from the audit log with restore, "send a test to me".
 *   Mappings   notification type → template per channel, clashes (several templates for one type), unmapped templates,
 *              reload the mappings cache (Super / Senior Admin).
 * Edits are versioned; the audit record keeps the previous values (TEMPLATE_UPDATED payload.before).
 * Designed emails (metadata.design) are generated from the Figma designs; edited ones stop receiving design updates.
 * URL: ?view=templates|mappings · ?tpl=<id>
 */

const CHANNELS = ['email', 'sms', 'push', 'in_app'];
const CATEGORIES = ['transactional', 'notification', 'marketing', 'system', 'custom'];
const SYSTEM = [
  'user_registration',
  'password_reset',
  'email_verification',
  'otp_code',
  'user_invitation',
  'welcome_message',
];
const docId = (t) => String(t?._id || t?.id || '');
const records = (d) => (Array.isArray(d) ? d : d?.records || d?.events || d?.rows || []);

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
const Chip = ({ children, tone }) => (
  <span
    className={classNames(
      'inline-flex rounded-full px-[8px] py-[2px] font-sans text-[12px] font-semibold',
      tone === 'warn'
        ? 'bg-[#faf4e8] text-[#463409]'
        : tone === 'off'
          ? 'bg-[#f0f0f0] text-[#595959]'
          : 'bg-[#ebf1ec] text-[#2a5730]'
    )}
  >
    {children}
  </span>
);

const editForm = (t) => ({
  description: t.description || '',
  subject: t.subject || '',
  body: t.body || '',
  htmlBody: t.htmlBody || '',
  types: (t.notificationTypes || []).join(', '),
  priority: String(t.priority ?? 0),
  isActive: t.isActive !== false,
  reason: '',
});
const typesFrom = (text) => [
  ...new Set(
    String(text)
      .split(/[\s,]+/)
      .map((x) => x.trim().toLowerCase())
      .filter(Boolean)
  ),
];

/* ── One template ───────────────────────────────────────────────────────── */
/** The list carries summaries only (no bodies); load the full template before showing or editing it. */
const TemplateDetail = ({ tpl, ...rest }) => {
  const id = docId(tpl);
  const full = useAdminData(() => sysTplGet(id), [id, tpl.version, tpl.updatedAt]);
  if (!full.data?.template) {
    return (
      <GroupCard title={tpl.name} description="Loading the template…">
        <AdminLoadNotice
          loading={full.loading}
          error={full.error}
          status={full.status}
          onRetry={full.reload}
        >
          {null}
        </AdminLoadNotice>
      </GroupCard>
    );
  }
  return <TemplateDetailLoaded tpl={full.data.template} {...rest} />;
};

const TemplateDetailLoaded = ({ tpl, canEdit, onChanged, onClose, toast }) => {
  const id = docId(tpl);
  const preview = useAdminData(() => sysTplPreview(id), [id, tpl.version]);
  const history = useAdminData(
    async () => records(await searchAudit({ affectedEntityId: id, limit: 50 })),
    [id, tpl.version]
  );
  const [dialog, setDialog] = useState(null); // 'edit' | 'test' | { restore }
  const [v, setV] = useState(() => editForm(tpl));
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const r = preview.data?.rendered || {};
  const designed = Boolean(tpl.metadata?.design);
  const events = (history.data || []).filter((e) => String(e.action || '').startsWith('TEMPLATE_'));

  const run = async (fn, title, text) => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await fn();
      toast(title, text);
      setDialog(null);
      onChanged();
    } catch (e) {
      setError(e?.response ? adminError(e) : e.message);
    } finally {
      setBusy(false);
    }
  };
  const save = () => {
    if (v.reason.trim().length < 10) return setError('Add a reason (10+ characters).');
    if (!v.body.trim()) return setError('The plain-text body can’t be empty.');
    if (!(Number(v.priority) >= 0)) return setError('Priority is a number, 0 or more.');
    const patch = { reason: v.reason.trim() };
    if (v.description !== (tpl.description || '')) patch.description = v.description;
    if (v.subject !== (tpl.subject || '')) patch.subject = v.subject;
    if (v.body !== (tpl.body || '')) patch.body = v.body;
    if (v.htmlBody !== (tpl.htmlBody || '')) patch.htmlBody = v.htmlBody;
    const nextTypes = typesFrom(v.types);
    if (JSON.stringify(nextTypes) !== JSON.stringify(tpl.notificationTypes || []))
      patch.notificationTypes = nextTypes;
    if (Number(v.priority) !== Number(tpl.priority ?? 0)) patch.priority = Number(v.priority);
    if (v.isActive !== (tpl.isActive !== false)) patch.isActive = v.isActive;
    if (Object.keys(patch).length === 1) return setError('Nothing changed.');
    return run(
      () => sysTplUpdate(id, patch),
      'Saved',
      `${tpl.name} is now version ${(tpl.version || 1) + 1}.`
    );
  };
  const restore = (e) => {
    if (reason.trim().length < 10) return setError('Add a reason (10+ characters).');
    const before = e.payload?.before || {};
    const patch = { reason: reason.trim() };
    for (const [k, val] of Object.entries(before)) {
      if (
        [
          'description',
          'subject',
          'body',
          'htmlBody',
          'notificationTypes',
          'priority',
          'isActive',
          'variables',
        ].includes(k)
      ) {
        patch[k] = val ?? (k === 'notificationTypes' ? [] : k === 'priority' ? 0 : '');
      }
    }
    return run(
      () => sysTplUpdate(id, patch),
      'Restored',
      `${tpl.name}: ${Object.keys(before).join(', ')} put back.`
    );
  };

  return (
    <GroupCard
      title={tpl.name}
      description={tpl.description || `${humanize(tpl.type)} · ${humanize(tpl.category)}`}
    >
      <div className="flex flex-col gap-[16px]">
        <div className="flex flex-wrap items-center gap-[10px]">
          <TextAction tone="green" onClick={onClose}>
            ← All templates
          </TextAction>
          <Chip tone={tpl.isActive === false ? 'off' : undefined}>
            {tpl.isActive === false ? 'Inactive' : 'Active'}
          </Chip>
          <Chip>{humanize(tpl.type)}</Chip>
          <Chip>v{tpl.version || 1}</Chip>
          {designed ? <Chip>Designed email</Chip> : null}
          {SYSTEM.includes(tpl.name) ? <Chip tone="warn">System template</Chip> : null}
          {canEdit ? (
            <TextAction
              tone="green"
              onClick={() => {
                setV(editForm(tpl));
                setError('');
                setDialog('edit');
              }}
            >
              Edit
            </TextAction>
          ) : null}
          {tpl.type === 'email' || tpl.type === 'sms' ? (
            <TextAction
              tone="green"
              onClick={() => {
                setError('');
                setDialog('test');
              }}
            >
              Send a test to me
            </TextAction>
          ) : null}
          <Link
            className="font-sans text-[14px] font-semibold text-[#2a5730]"
            to={`/admin/audit-log?q=${id}`}
          >
            Audit log
          </Link>
        </div>
        {designed ? (
          <p className="m-0 font-sans text-[13px] text-[#595959]">
            Built from the Figma email designs. Once edited here it keeps your version and no longer
            picks up design updates.
          </p>
        ) : null}

        <dl className="m-0 grid grid-cols-1 gap-x-[24px] gap-y-[8px] md:grid-cols-2">
          {[
            ['Category', humanize(tpl.category)],
            [
              'Answers notification types',
              (tpl.notificationTypes || []).join(', ') || 'None — only used by name',
            ],
            ['Priority', String(tpl.priority ?? 0)],
            [
              'Variables',
              (tpl.variables || []).map((x) => `${x.name}${x.required ? '*' : ''}`).join(', ') ||
                '—',
            ],
            ['Updated', shortDate(tpl.updatedAt)],
          ].map(([k, val]) => (
            <div key={k} className="flex flex-col">
              <dt className="font-sans text-[12px] font-semibold uppercase tracking-[0.04em] text-[#737373]">
                {k}
              </dt>
              <dd className="m-0 font-sans text-[14px] text-[#1c2a21]">{val}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-[8px]">
          <span className="font-sans text-[14px] font-semibold text-[#1c2a21]">
            Preview with sample data
          </span>
          <AdminLoadNotice
            loading={preview.loading}
            error={preview.error}
            status={preview.status}
            onRetry={preview.reload}
          >
            {r.subject ? (
              <p className="m-0 font-sans text-[14px]">
                <span className="text-[#737373]">Subject: </span>
                {r.subject}
              </p>
            ) : null}
            {r.htmlBody ? (
              <iframe
                title={`${tpl.name} preview`}
                sandbox=""
                srcDoc={r.htmlBody}
                className="h-[480px] w-full rounded-[12px] border border-solid border-[#e7e7e7] bg-white"
              />
            ) : (
              <pre className="m-0 max-h-[320px] overflow-auto whitespace-pre-wrap rounded-[12px] bg-[#f8f8f4] p-[12px] font-mono text-[13px]">
                {r.body || tpl.body}
              </pre>
            )}
          </AdminLoadNotice>
        </div>

        <div className="flex flex-col gap-[6px]">
          <span className="font-sans text-[14px] font-semibold text-[#1c2a21]">History</span>
          <AdminLoadNotice
            loading={history.loading}
            error={history.error}
            status={history.status}
            onRetry={history.reload}
          >
            <ul className="m-0 flex list-none flex-col gap-[6px] p-0 font-sans text-[14px]">
              {events.map((e) => (
                <li
                  key={e.id || e._id}
                  className="flex flex-wrap items-center justify-between gap-[8px]"
                >
                  <span>
                    <span className="font-semibold">
                      {humanize(String(e.action).replace('TEMPLATE_', ''))}
                    </span>
                    {e.payload?.version ? ` → v${e.payload.version}` : ''} ·{' '}
                    {shortDate(e.createdAt)}
                    {e.payload?.changed?.length ? ` · ${e.payload.changed.join(', ')}` : ''}
                    {e.payload?.reason ? (
                      <span className="text-[#595959]"> · “{e.payload.reason}”</span>
                    ) : null}
                  </span>
                  {canEdit && e.action === 'TEMPLATE_UPDATED' && e.payload?.before ? (
                    <TextAction
                      tone="green"
                      onClick={() => {
                        setReason('');
                        setError('');
                        setDialog({ restore: e });
                      }}
                    >
                      Restore what it replaced
                    </TextAction>
                  ) : null}
                </li>
              ))}
              {!events.length ? (
                <li className="text-[#737373]">No admin changes recorded yet.</li>
              ) : null}
            </ul>
          </AdminLoadNotice>
        </div>
      </div>

      {dialog === 'edit' ? (
        <AdminConfirmDialog
          title={`Edit ${tpl.name}`}
          body="Saved as a new version. The audit log keeps what you replaced, so it can be restored."
          primary={{ label: busy ? 'Saving…' : 'Save new version', arrow: true }}
          secondary="Cancel"
          onPrimary={save}
          onClose={() => setDialog(null)}
        >
          <div className="flex max-h-[58vh] flex-col gap-[12px] overflow-auto pr-[4px]">
            <TextInput
              label="Description"
              optional
              value={v.description}
              onChange={(e) => setV((x) => ({ ...x, description: e.target.value }))}
            />
            {tpl.type === 'email' ? (
              <TextInput
                label="Subject"
                value={v.subject}
                onChange={(e) => setV((x) => ({ ...x, subject: e.target.value }))}
              />
            ) : null}
            <Textarea
              label="Plain-text body"
              rows={6}
              value={v.body}
              onChange={(e) => setV((x) => ({ ...x, body: e.target.value }))}
              helperText="Use {{variableName}} for values filled in when it's sent."
            />
            {tpl.type === 'email' ? (
              <Textarea
                label="HTML body"
                optional
                rows={8}
                value={v.htmlBody}
                onChange={(e) => setV((x) => ({ ...x, htmlBody: e.target.value }))}
                className="font-mono"
              />
            ) : null}
            <TextInput
              label="Notification types it answers"
              optional
              placeholder="application.status, status.update"
              value={v.types}
              onChange={(e) => setV((x) => ({ ...x, types: e.target.value }))}
              helperText="Comma-separated. When several templates answer one type on one channel, the highest priority wins."
            />
            <TextInput
              label="Priority"
              inputMode="numeric"
              value={v.priority}
              onChange={(e) => setV((x) => ({ ...x, priority: e.target.value }))}
            />
            <label className="flex items-center justify-between gap-[12px] font-sans text-[14px] text-[#1c2a21]">
              Active
              <SettingsToggle
                checked={v.isActive}
                onChange={(x) => setV((y) => ({ ...y, isActive: x }))}
                label="Active"
              />
            </label>
            <TextInput
              label="Reason"
              required
              placeholder="Why this change (for the audit log)"
              value={v.reason}
              onChange={(e) => setV((x) => ({ ...x, reason: e.target.value }))}
            />
          </div>
          {error ? <p className="m-0 mt-[8px] text-[14px] text-[#902b20]">{error}</p> : null}
        </AdminConfirmDialog>
      ) : null}
      {dialog === 'test' ? (
        <AdminConfirmDialog
          title="Send a test to yourself"
          body={`Sends ${tpl.name} with sample data to your own ${tpl.type === 'sms' ? 'phone number' : 'email address'}. Tests can't be sent to anyone else.`}
          primary={{ label: busy ? 'Sending…' : 'Send test', arrow: true }}
          secondary="Cancel"
          onPrimary={() =>
            run(
              () => sysTplTestSend(id, preview.data?.sampleVariables || {}),
              'Test sent',
              'Check your inbox.'
            )
          }
          onClose={() => setDialog(null)}
        >
          {error ? <p className="m-0 text-[14px] text-[#902b20]">{error}</p> : null}
        </AdminConfirmDialog>
      ) : null}
      {dialog?.restore ? (
        <AdminConfirmDialog
          title="Restore the replaced version?"
          body={`Puts back ${Object.keys(dialog.restore.payload.before).join(', ')} as they were before the change on ${shortDate(dialog.restore.createdAt)}. Saved as a new version.`}
          primary={{ label: busy ? 'Restoring…' : 'Restore', arrow: true }}
          secondary="Cancel"
          onPrimary={() => restore(dialog.restore)}
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
    </GroupCard>
  );
};

/* ── Mappings ───────────────────────────────────────────────────────────── */
const Mappings = ({ canReload, templates, onOpen, toast }) => {
  const map = useAdminData(() => notifMappings(), []);
  const cov = useAdminData(() => notifCoverage(), []);
  const [busy, setBusy] = useState(false);
  const mappings = map.data?.mappings || {};
  const c = cov.data?.coverage || {};
  const clashes = Object.entries(c.duplicateMappings || {}).filter(
    ([, list]) => (list || []).length > 1
  );
  const byName = Object.fromEntries((templates || []).map((t) => [t.name, t]));
  const reload = async () => {
    setBusy(true);
    try {
      await notifRefreshMappings();
      map.reload();
      cov.reload();
      toast('Mappings reloaded', 'Notifications use the current templates.');
    } catch (e) {
      toast('Couldn’t reload', adminError(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <GroupCard
      title="Notification type → template"
      description="Which template each notification type uses per channel. Built from the types listed on each template; types the platform sends that no template lists fall back to the default template."
      gap="gap-0"
    >
      <div className="flex flex-wrap items-center gap-[14px] pb-[12px] font-sans text-[13px] text-[#595959]">
        <span>
          {c.totalTemplates ?? '–'} notification templates · {c.templatesWithMappings ?? '–'} mapped
          · {c.totalMappings ?? '–'} mappings
        </span>
        {canReload ? (
          <TextAction tone="green" onClick={() => !busy && reload()}>
            {busy ? 'Reloading…' : 'Reload mappings'}
          </TextAction>
        ) : null}
      </div>
      <AdminLoadNotice
        loading={map.loading}
        error={map.error}
        status={map.status}
        onRetry={map.reload}
      >
        {Object.entries(mappings)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([type, channels]) => (
            <SettingRow
              key={type}
              title={type}
              description={Object.entries(channels)
                .map(([ch, name]) => `${humanize(ch)}: ${name}`)
                .join(' · ')}
              control={
                <div className="flex flex-wrap justify-end gap-[10px]">
                  {Object.values(channels).map((name) =>
                    byName[name] ? (
                      <TextAction
                        key={name}
                        tone="green"
                        onClick={() => onOpen(docId(byName[name]))}
                      >
                        Open {name}
                      </TextAction>
                    ) : null
                  )}
                </div>
              }
            />
          ))}
      </AdminLoadNotice>
      {clashes.length ? (
        <div className="mt-[12px] flex flex-col gap-[6px] rounded-[12px] bg-[#faf4e8] p-[12px] font-sans text-[14px]">
          <span className="font-semibold text-[#463409]">
            Several templates answer the same type (highest priority wins)
          </span>
          {clashes.map(([key, list]) => (
            <span key={key}>
              {key}: {list.map((x) => `${x.name} (${x.priority})`).join(', ')}
            </span>
          ))}
        </div>
      ) : null}
      {(c.unmappedTemplates || []).length ? (
        <p className="m-0 mt-[12px] font-sans text-[13px] text-[#595959]">
          Notification templates not mapped to any type (used only by name):{' '}
          {(c.unmappedTemplates || []).map((x) => x.name || x).join(', ')}
        </p>
      ) : null}
    </GroupCard>
  );
};

/* ── Tab ────────────────────────────────────────────────────────────────── */
const SystemNotificationsTab = ({ data, session }) => {
  const [toastEl, toast] = useAdminToast();
  const canEdit = session?.role === 'super' || session?.role === 'senior';
  const view = data.view === 'mappings' ? 'mappings' : 'templates';
  const list = useAdminData(() => sysTplList({ summary: true }), []);
  const stats = useAdminData(() => sysTplStats().catch(() => null), []);
  const [channel, setChannel] = useState('');
  const [category, setCategory] = useState('');
  const [q, setQ] = useState('');
  const all = useMemo(() => list.data?.templates ?? [], [list.data]);
  const selected = all.find((t) => docId(t) === data.params.get('tpl'));
  const rows = all
    .filter((t) => !channel || t.type === channel)
    .filter((t) => !category || t.category === category)
    .filter(
      (t) =>
        !q ||
        `${t.name} ${t.description || ''} ${t.subject || ''} ${(t.notificationTypes || []).join(' ')}`
          .toLowerCase()
          .includes(q.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  log('render', { view, templates: all.length, selected: Boolean(selected) });
  const st = stats.data?.stats;

  return (
    <>
      <div className="flex flex-wrap items-center gap-[8px]">
        <Pill on={view === 'templates'} onClick={() => data.update({ view: null, tpl: null })}>
          Templates ({all.length})
        </Pill>
        <Pill on={view === 'mappings'} onClick={() => data.update({ view: 'mappings', tpl: null })}>
          Notification types
        </Pill>
        {st ? (
          <span className="ml-auto font-sans text-[13px] text-[#737373]">
            {st.active} active · {st.inactive} inactive · {st.byType?.email ?? 0} email ·{' '}
            {st.byType?.sms ?? 0} SMS
          </span>
        ) : null}
      </div>

      {selected ? (
        <TemplateDetail
          tpl={selected}
          canEdit={canEdit}
          toast={toast}
          onChanged={() => {
            list.reload();
            stats.reload();
          }}
          onClose={() => data.update({ tpl: null })}
        />
      ) : view === 'mappings' ? (
        <Mappings
          canReload={canEdit}
          templates={all}
          toast={toast}
          onOpen={(id) => data.update({ view: null, tpl: id })}
        />
      ) : (
        <GroupCard
          title="System notification templates"
          description="Emails and SMS the platform sends by itself: sign-in codes, verification, application updates, digests. Message templates staff send by hand live under Comms."
          gap="gap-0"
        >
          <div className="flex flex-wrap items-end gap-[12px] pb-[12px]">
            <TextInput label="Find" value={q} onChange={(e) => setQ(e.target.value)} />
            <Select
              label="Channel"
              options={[
                { value: '', label: 'All channels' },
                ...CHANNELS.map((c) => ({ value: c, label: humanize(c) })),
              ]}
              value={channel}
              onChange={setChannel}
            />
            <Select
              label="Category"
              options={[
                { value: '', label: 'All categories' },
                ...CATEGORIES.map((c) => ({ value: c, label: humanize(c) })),
              ]}
              value={category}
              onChange={setCategory}
            />
          </div>
          <AdminLoadNotice
            loading={list.loading}
            error={list.error}
            status={list.status}
            onRetry={list.reload}
          >
            {rows.map((t) => (
              <SettingRow
                key={docId(t)}
                title={t.name}
                description={`${humanize(t.type)} · ${humanize(t.category)} · v${t.version || 1}${t.subject ? ` · “${t.subject}”` : ''}${
                  (t.notificationTypes || []).length
                    ? ` · answers ${t.notificationTypes.length} type${t.notificationTypes.length > 1 ? 's' : ''}`
                    : ''
                }`}
                top
                control={
                  <div className="flex items-center gap-[10px]">
                    {t.isActive === false ? <Chip tone="off">Inactive</Chip> : null}
                    {SYSTEM.includes(t.name) ? <Chip tone="warn">System</Chip> : null}
                    <TextAction tone="green" onClick={() => data.update({ tpl: docId(t) })}>
                      Open
                    </TextAction>
                  </div>
                }
              />
            ))}
            {!rows.length ? (
              <p className="m-0 font-sans text-[14px] text-[#737373]">Nothing matches.</p>
            ) : null}
          </AdminLoadNotice>
        </GroupCard>
      )}
      {toastEl}
    </>
  );
};

export default SystemNotificationsTab;
