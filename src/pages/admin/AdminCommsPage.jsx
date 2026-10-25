import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import { Checkbox, Select, Textarea, TextInput } from '../../components/ui/form';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import AdminConfirmDialog from '../../components/sections/admin/ui/AdminConfirmDialog.jsx';
import AdminQueueView from '../../components/sections/admin/queue/AdminQueueView.jsx';
import CommsTabs from '../../components/sections/admin/comms/CommsTabs.jsx';
import TemplatesView from '../../components/sections/admin/comms/TemplatesView.jsx';
import { SettingsDialog } from '../../components/sections/talentSettings/SettingsBDialogs.jsx';
import { AdminCommentIcon } from '../../components/sections/admin/comms/commsIcons.jsx';
import { useAdminSession } from '../../components/sections/admin/useAdminSession.js';
import { useAdminData, useAdminToast } from '../../components/sections/admin/useAdminData.js';
import AdminLoadNotice from '../../components/sections/admin/AdminLoadNotice.jsx';
import {
  adminError,
  bulkStatus,
  createTemplate,
  deleteTemplate,
  docId,
  humanize,
  listTemplates,
  personName,
  searchAccounts,
  searchAudit,
  sendBulk,
  sendDirect,
  shortDate,
  timeAgo,
  updateTemplate,
  viewAccount,
} from '../../services/admin.api.js';

const log = debug('AdminCommsPage');

/*
 * AdminCommsPage — Figma 7.4 Comms at /admin/comms/*. Real data from /api/admin/comms (adminComms service):
 *   /admin/comms                      sent messages: the backend keeps no send history, so this lists the DIRECT_COMM_SENT / BULK_COMM_SENT audit events
 *                                     (Senior Admin and up can read the audit log)
 *   /admin/comms/message?account=ID   message one user: POST /send-direct (Support Agent and up; free text is Super Admin only, others pick an active template)
 *   /admin/comms/bulk                 bulk notification: POST /send-bulk with an active template + audience filter, then GET /bulk/:jobId/status (Senior Admin and up)
 *   /admin/comms/templates            templates: GET/POST/PATCH/DELETE /templates (create / edit Senior Admin and up, delete Super Admin; templates linked to a
 *                                     system event are read-only in the backend)
 * Channels are fixed by the backend (direct: email + in-app; a template has one channel). No SMS opt-out state, preview, test send, schedule or version history.
 */

const REASON_CODES = [
  'account_action',
  'policy_update',
  'welcome',
  'reminder',
  'system_maintenance',
  'feature_announcement',
  'compliance_notice',
  'support_followup',
  'general',
].map((v) => ({ value: v, label: humanize(v) }));
const CHANNELS = ['email', 'in_app', 'sms', 'push'].map((v) => ({ value: v, label: humanize(v) }));
const STATUSES = ['draft', 'active', 'archived'].map((v) => ({ value: v, label: humanize(v) }));
const AUDIENCES = [
  { value: 'talent', label: 'Talents' },
  { value: 'recruiter', label: 'Recruiters' },
  { value: 'institution', label: 'Institutions' },
  { value: 'parent', label: 'Parents' },
];

const Heading = ({ title, sub, active }) => (
  <div className="flex flex-col gap-[16px]">
    <header className="flex flex-col gap-[3px]">
      <h1 className="m-0 font-sans text-[32px] leading-[40px] font-semibold text-[#1c2a21]">{title}</h1>
      <p className="m-0 font-sans text-[16px] leading-[24px] text-[#999999]">{sub}</p>
    </header>
    <CommsTabs active={active} />
  </div>
);

const GreenButton = ({ children, disabled, ...rest }) => (
  <button
    type="submit"
    disabled={disabled}
    className="inline-flex h-[52px] cursor-pointer items-center justify-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[22px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] disabled:cursor-not-allowed disabled:opacity-55"
    {...rest}
  >
    {children}
  </button>
);

/* ── Template editor ────────────────────────────────────────────────────── */
const TemplateDialog = ({ template, role, onClose, onSaved, onDeleted }) => {
  const locked = Boolean(template?.systemEventTrigger);
  const [f, setF] = useState({
    name: template?.name ?? '',
    description: template?.description ?? '',
    subject: template?.subject ?? '',
    body: template?.body ?? '',
    channel: template?.channel ?? 'email',
    status: template?.status ?? 'draft',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e?.target ? e.target.value : e }));
  const placeholders = [...new Set((f.body + f.subject).match(/\{\{\s*[\w.]+\s*\}\}/g) || [])].map((p) => p.replace(/[{}\s]/g, ''));
  const ready = f.name.trim() && f.subject.trim() && f.body.trim() && !busy && !locked;

  const save = async (e) => {
    e.preventDefault();
    if (!ready) return;
    setBusy(true);
    setError('');
    try {
      // The backend stores placeholders as { key, description, required } objects.
      const payload = { ...f, placeholders: placeholders.map((key) => ({ key, required: false })) };
      const res = template ? await updateTemplate(docId(template), payload) : await createTemplate(payload);
      onSaved(res?.template ?? res, Boolean(template));
    } catch (err) {
      setError(adminError(err));
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await deleteTemplate(docId(template));
      onDeleted(template);
    } catch (err) {
      setError(adminError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <SettingsDialog
      open
      title={template ? `Edit template · ${template.name}` : 'New template'}
      icon={<AdminCommentIcon className="size-[21px] text-[#1c2a21]" />}
      iconTone="bg-[#ffd86b]"
      onClose={onClose}
      widthClass="w-[620px]"
      gap="gap-[20px]"
    >
      <form onSubmit={save} className="flex flex-col gap-[16px]">
        {locked ? (
          <p className="m-0 rounded-[14px] bg-[#faf4e8] p-[12px] font-sans text-[14px] leading-[20px] text-[#463409]">
            This template is used by the “{humanize(template.systemEventTrigger)}” system event, so the backend doesn’t allow edits.
          </p>
        ) : null}
        <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2">
          <TextInput label="Name" required value={f.name} onChange={set('name')} disabled={locked} />
          <TextInput label="Description" optional value={f.description} onChange={set('description')} disabled={locked} />
          <Select label="Channel" required options={CHANNELS} value={f.channel} onChange={set('channel')} disabled={locked} />
          <Select label="Status" required options={STATUSES} value={f.status} onChange={set('status')} disabled={locked} />
        </div>
        <TextInput label="Subject" required value={f.subject} onChange={set('subject')} disabled={locked} />
        <Textarea label="Message" required rows={6} value={f.body} onChange={set('body')} disabled={locked} />
        <p className="m-0 font-sans text-[13px] leading-[18px] text-[#737373]">
          Use {'{{name}}'} style variables.{placeholders.length ? ` Found: ${placeholders.join(', ')}.` : ''}
          {template ? ` Version ${template.version ?? 1} · last changed ${shortDate(template.updatedAt)}.` : ''}
        </p>
        {error ? <p role="alert" className="m-0 font-sans text-[14px] font-semibold text-[#902b20]">{error}</p> : null}
        <div className="flex flex-wrap items-center justify-between gap-[12px]">
          {template && role === 'super' && !locked ? (
            <button type="button" onClick={remove} className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] font-semibold text-[#902b20] underline">
              Delete template
            </button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-[12px]">
            <button type="button" onClick={onClose} className="h-[52px] cursor-pointer rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[22px] font-sans text-[16px] font-bold">
              {locked ? 'Close' : 'Cancel'}
            </button>
            {locked ? null : <GreenButton disabled={!ready}>{busy ? 'Saving…' : template ? 'Save changes' : 'Create template'}</GreenButton>}
          </div>
        </div>
      </form>
    </SettingsDialog>
  );
};

const TemplatesScreen = ({ data, role }) => {
  const [toastEl, toast] = useAdminToast();
  const [query, setQuery] = useState('');
  const list = useAdminData(() => listTemplates({ limit: 200 }), []);
  const templates = list.data?.templates ?? [];
  const filter = data.params.get('chip') ?? 'all';
  const editing = data.modal === 'edit' ? templates.find((t) => docId(t) === data.params.get('template')) : null;
  const canEdit = role === 'super' || role === 'senior';
  const shown = templates.filter((t) => {
    if (filter === 'system' && !t.systemEventTrigger) return false;
    if (['active', 'draft', 'archived'].includes(filter) && t.status !== filter) return false;
    const q = query.trim().toLowerCase();
    return !q || `${t.name} ${t.subject} ${t.description}`.toLowerCase().includes(q);
  });
  const cards = shown.map((t) => ({
    id: docId(t),
    icon: t.systemEventTrigger ? 'shield' : t.channel === 'email' ? 'megaphone' : 'code',
    tile: t.status === 'active' ? '#ebf1ec' : '#f0eee8',
    title: t.name,
    area: t.systemEventTrigger ? 'System' : 'Custom',
    channel: humanize(t.channel),
    text: t.description || t.subject,
    status: `${humanize(t.status)} · v${t.version ?? 1}`,
  }));
  const close = () => data.update({ modal: null, template: null });
  return (
    <>
      {list.loading || list.error ? (
        <div className="flex flex-col gap-[16px] pt-[4px]">
          <Heading title="Notification templates" sub="Messages staff send to users." active="templates" />
          <AdminLoadNotice loading={list.loading} error={list.error} status={list.status} onRetry={list.reload} />
        </div>
      ) : (
        <TemplatesView
          data={data}
          cards={cards}
          filters={['All', 'Active', 'Draft', 'Archived', 'System']}
          sub={`${templates.length} templates. Active ones can be used for direct and bulk messages. Senior Admins and Super Admins edit them.`}
          query={query}
          onQuery={setQuery}
          canCreate={canEdit}
          onOpen={(card) => data.update({ modal: 'edit', template: card.id })}
          onNew={() => data.update({ modal: 'new' })}
        />
      )}
      {data.modal === 'new' || editing ? (
        <TemplateDialog
          key={editing ? docId(editing) : 'new'}
          template={editing}
          role={role}
          onClose={close}
          onSaved={(t, updated) => {
            toast(updated ? 'Template saved' : 'Template created', `${t?.name ?? ''}${t?.version ? ` · v${t.version}` : ''}`);
            close();
            list.reload();
          }}
          onDeleted={(t) => {
            toast('Template deleted', t.name);
            close();
            list.reload();
          }}
        />
      ) : null}
      {toastEl}
    </>
  );
};

/* ── Message one user ───────────────────────────────────────────────────── */
const MessageScreen = ({ data, role }) => {
  const navigate = useNavigate();
  const accountId = data.params.get('account');
  const [toastEl, toast] = useAdminToast();
  const acc = useAdminData(() => (accountId ? viewAccount(accountId) : Promise.resolve(null)), [accountId]);
  const tpls = useAdminData(() => listTemplates({ status: 'active', limit: 200 }), []);
  const active = (tpls.data?.templates ?? []).filter((t) => t.status === 'active');
  const [mode, setMode] = useState('template');
  const [templateId, setTemplateId] = useState('');
  const [reasonCode, setReasonCode] = useState('support_followup');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const back = () => navigate(accountId ? `/admin/accounts/${accountId}` : '/admin/accounts');
  const free = mode === 'free' && role === 'super';
  const ready = !busy && (free ? subject.trim() && body.trim() : templateId);
  const name = acc.data ? personName(acc.data) : 'this user';

  const send = async (e) => {
    e.preventDefault();
    if (!ready) return;
    setBusy(true);
    setError('');
    try {
      await sendDirect(
        free
          ? { recipientId: accountId, reasonCode, freeTextSubject: subject.trim(), freeTextBody: body.trim() }
          : { recipientId: accountId, reasonCode, templateId },
      );
      toast('Message sent', `${name} gets it by email and in the app.`);
      setTimeout(back, 1200);
    } catch (err) {
      setError(adminError(err));
    } finally {
      setBusy(false);
    }
  };

  if (!accountId) {
    return (
      <div className="flex flex-col gap-[16px] pt-[4px]">
        <Heading title="Message a user" sub="Open an account and choose “Message user”." active="sent" />
        <AdminLoadNotice error="No account chosen." status={400} />
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col gap-[16px] pt-[4px]">
        <Heading title={`Message ${name}`} sub="Sent by email and in the app. Every message is logged with its reason." active="sent" />
        <AdminLoadNotice loading={acc.loading} error={acc.error} status={acc.status} onRetry={acc.reload} />
      </div>
      <SettingsDialog
        open
        title={`Message ${name}`}
        icon={<AdminCommentIcon className="size-[21px] text-[#1c2a21]" />}
        iconTone="bg-[#ffd86b]"
        onClose={back}
        widthClass="w-[560px]"
        gap="gap-[20px]"
      >
        <form onSubmit={send} className="flex flex-col gap-[16px]">
          {role === 'super' ? (
            <div role="radiogroup" aria-label="Message type" className="grid grid-cols-2 gap-[10px]">
              {[
                { id: 'template', label: 'Use a template' },
                { id: 'free', label: 'Write my own' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={mode === m.id}
                  onClick={() => setMode(m.id)}
                  className={`h-[56px] cursor-pointer rounded-[14px] border border-solid font-sans text-[14px] font-semibold ${
                    mode === m.id ? 'border-[#387440] bg-[#ebf1ec] text-[#2a5730]' : 'border-[#1c2a21]/15 bg-white text-[#1c2a21]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          ) : null}
          <Select label="Reason" required options={REASON_CODES} value={reasonCode} onChange={setReasonCode} />
          {free ? (
            <>
              <TextInput label="Subject" required value={subject} onChange={(e) => setSubject(e.target.value)} />
              <Textarea label="Message" required rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
            </>
          ) : (
            <>
              <Select
                label="Template"
                required
                options={active.map((t) => ({ value: docId(t), label: t.name }))}
                value={templateId}
                onChange={setTemplateId}
                helperText={tpls.loading ? 'Loading templates…' : active.length ? undefined : 'No active templates yet: create one under Templates.'}
              />
              {templateId ? (
                <p className="m-0 rounded-[14px] bg-[#f8f8f4] p-[12px] font-sans text-[14px] leading-[20px] whitespace-pre-wrap text-[#1c2a21]">
                  {active.find((t) => docId(t) === templateId)?.body}
                </p>
              ) : null}
            </>
          )}
          {error ? <p role="alert" className="m-0 font-sans text-[14px] font-semibold text-[#902b20]">{error}</p> : null}
          <div className="grid grid-cols-[1fr_219px] gap-[12px]">
            <button type="button" onClick={back} className="h-[56px] cursor-pointer rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white font-sans text-[16px] font-bold">
              Cancel
            </button>
            <GreenButton disabled={!ready}>{busy ? 'Sending…' : 'Send message'}</GreenButton>
          </div>
        </form>
      </SettingsDialog>
      {toastEl}
    </>
  );
};

/* ── Bulk notification ──────────────────────────────────────────────────── */
const BulkScreen = ({ role }) => {
  const [toastEl, toast] = useAdminToast();
  const tpls = useAdminData(() => listTemplates({ status: 'active', limit: 200 }), []);
  const active = (tpls.data?.templates ?? []).filter((t) => t.status === 'active');
  const [templateId, setTemplateId] = useState('');
  const [audience, setAudience] = useState('talent');
  const [region, setRegion] = useState('');
  const [includeMinors, setIncludeMinors] = useState(false);
  const [reasonCode, setReasonCode] = useState('feature_announcement');
  const [confirming, setConfirming] = useState(false);
  const [word, setWord] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [job, setJob] = useState(null);
  const reach = useAdminData(() => searchAccounts({ accountType: audience, status: 'active', limit: 200 }).then((r) => r?.records ?? []), [audience]);
  const estimate = (reach.data ?? []).filter((a) => (!region || a.region === region) && (includeMinors || !a.isMinor)).length;
  const filter = useMemo(() => {
    const f = { entityType: audience, status: 'active' };
    if (region.trim()) f.region = region.trim();
    if (!includeMinors) f.isMinor = { $ne: true };
    return f;
  }, [audience, region, includeMinors]);
  const allowed = role === 'super' || role === 'senior';

  const send = async () => {
    if (word !== 'CONFIRM' || busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await sendBulk({ templateId, recipientFilter: filter, reasonCode });
      setConfirming(false);
      setWord('');
      if (res?.status === 'pending_approval') {
        toast('Sent for approval', `${res.recipientCount} recipients. A second admin must approve it.`, 'info');
      } else {
        setJob(res);
        toast('Sending', `${res?.recipientCount ?? 0} recipients · ${res?.deliveryMethod === 'inline' ? 'sent now' : 'queued'}.`);
      }
    } catch (err) {
      setError(adminError(err));
    } finally {
      setBusy(false);
    }
  };

  const status = useAdminData(() => (job?.jobId ? bulkStatus(job.jobId) : Promise.resolve(null)), [job?.jobId]);

  return (
    <div className="flex flex-col gap-[24px] pt-[4px]">
      <Heading title="Bulk notification" sub="Send an active template to a group of users. Every send is logged." active="bulk" />
      {!allowed ? (
        <AdminLoadNotice error="Bulk messages are for Senior Admins and Super Admins." status={403} />
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (templateId) setConfirming(true);
          }}
          className="flex max-w-[760px] flex-col gap-[16px] rounded-[24px] border border-solid border-[#e1eae2] bg-white p-[24px]"
        >
          <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2">
            <Select
              label="Template"
              required
              options={active.map((t) => ({ value: docId(t), label: `${t.name} · ${humanize(t.channel)}` }))}
              value={templateId}
              onChange={setTemplateId}
              helperText={active.length ? undefined : 'No active templates yet.'}
            />
            <Select label="Reason" required options={REASON_CODES} value={reasonCode} onChange={setReasonCode} />
            <Select label="Who gets it" required options={AUDIENCES} value={audience} onChange={setAudience} />
            <TextInput label="Region" optional placeholder="Greater Accra" value={region} onChange={(e) => setRegion(e.target.value)} />
          </div>
          <Checkbox label="Include under-18 accounts" checked={includeMinors} onChange={(e) => setIncludeMinors(e.target.checked)} labelClassName="text-[14px] font-medium" />
          <p className="m-0 rounded-[14px] bg-[#faf4e8] p-[12px] font-sans text-[14px] leading-[20px] text-[#463409]">
            About {reach.loading ? '…' : `${estimate}${(reach.data?.length ?? 0) >= 200 ? '+' : ''}`} active {AUDIENCES.find((a) => a.value === audience)?.label.toLowerCase()} match.
            Over 1,000 recipients needs a second admin’s approval. The backend has no test send or schedule yet.
          </p>
          {error ? <p role="alert" className="m-0 font-sans text-[14px] font-semibold text-[#902b20]">{error}</p> : null}
          <div>
            <GreenButton disabled={!templateId}>Review and send</GreenButton>
          </div>
        </form>
      )}
      {job ? (
        <div className="max-w-[760px] rounded-[20px] border border-solid border-[#e1eae2] bg-white p-[18px] font-sans text-[14px] leading-[21px] text-[#1c2a21]">
          <strong>Last send:</strong> {job.recipientCount} recipients · {job.successCount ?? 0} sent · {job.failCount ?? 0} failed
          {job.jobId ? ` · job ${job.jobId} · ${status.data?.state ?? 'checking…'}` : ''}
          {job.jobId ? (
            <button type="button" onClick={status.reload} className="ml-[10px] cursor-pointer border-0 bg-transparent font-semibold text-[#387440] underline">
              Refresh
            </button>
          ) : null}
        </div>
      ) : null}
      {confirming ? (
        <AdminConfirmDialog
          title={`Send to about ${estimate} people?`}
          body="This can’t be undone. Type CONFIRM to send."
          primary={{ label: busy ? 'Sending…' : 'Send now', tone: 'red' }}
          secondary="Cancel"
          onPrimary={send}
          onClose={() => setConfirming(false)}
        >
          <TextInput label="Type CONFIRM" value={word} onChange={(e) => setWord(e.target.value)} autoComplete="off" error={error || undefined} />
        </AdminConfirmDialog>
      ) : null}
      {toastEl}
    </div>
  );
};

/* ── Sent (from the audit log) ──────────────────────────────────────────── */
const SentScreen = ({ data }) => {
  const navigate = useNavigate();
  const sent = useAdminData(async () => {
    const r = await Promise.all(['DIRECT_COMM_SENT', 'BULK_COMM_SENT'].map((action) => searchAudit({ action, limit: 100 })));
    return r
      .flatMap((x) => x?.records ?? [])
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, []);
  const records = sent.data ?? [];
  const tab = data.tab ?? 'all';
  const shown = records.filter((e) => (tab === 'bulk' ? e.action === 'BULK_COMM_SENT' : tab === 'direct' ? e.action === 'DIRECT_COMM_SENT' : true));
  const rows = shown.map((e) => {
    const p = e.payload || {};
    const bulk = e.action === 'BULK_COMM_SENT';
    return {
      id: docId(e),
      lead: { icon: bulk ? 'company' : 'book' },
      title: bulk ? `Bulk · ${p.templateName || p.templateId || 'template'}` : `Direct message · ${humanize(p.reasonCode || 'message')}`,
      sticker: bulk ? `${p.recipientCount ?? p.successCount ?? '?'} people` : null,
      sub: [shortDate(e.createdAt), humanize(e.actorType), bulk ? null : `to ${String(e.affectedEntityId || '').slice(-8)}`].filter(Boolean).join(' · '),
      chips: [{ label: p.isFreeText ? 'Free text' : 'Template', tone: 'green' }],
      pill: { label: 'View', strong: false },
      age: timeAgo(e.createdAt),
      to: `/admin/audit-log?modal=event&event=${docId(e)}&q=${e.action}`,
    };
  });
  if (sent.loading || sent.error) {
    return (
      <div className="flex flex-col gap-[16px] pt-[4px]">
        <Heading title="Sent messages" sub="Direct and bulk messages, newest first." active="sent" />
        <AdminLoadNotice loading={sent.loading} error={sent.error} status={sent.status} onRetry={sent.reload} />
      </div>
    );
  }
  return (
    <AdminQueueView
      data={data}
      onAction={() => navigate('/admin/comms/bulk')}
      config={{
        title: 'Sent messages',
        sticker: `${records.length} sent`,
        subtitle: 'Direct and bulk messages from the audit log. Open rates, bounces and drafts aren’t tracked by the backend yet.',
        tabs: [
          { id: 'all', label: 'All', count: records.length },
          { id: 'direct', label: 'Direct', count: records.filter((e) => e.action === 'DIRECT_COMM_SENT').length },
          { id: 'bulk', label: 'Bulk', count: records.filter((e) => e.action === 'BULK_COMM_SENT').length },
        ],
        defaultTab: 'all',
        chips: [{ id: 'all', label: 'All' }],
        defaultView: 'list',
        sort: 'Newest first',
        action: 'New bulk message',
        banner: 'Newest first.',
        rows,
        empty: rows.length
          ? null
          : {
              title: 'Nothing sent yet',
              text: 'Messages you send to users show up here.',
              steps: [
                { id: 's1', icon: 'plus', title: 'Send a bulk notification', meta: 'Comms › Bulk', to: '/admin/comms/bulk' },
                { id: 's2', icon: 'spark', title: 'Manage templates', meta: 'Comms › Templates', to: '/admin/comms/templates' },
                { id: 's3', icon: 'user', title: 'Message one user', meta: 'From their account page', to: '/admin/accounts' },
              ],
              primary: 'New bulk message',
              onPrimary: '/admin/comms/bulk',
              secondary: 'Templates',
              secondaryTo: '/admin/comms/templates',
            },
      }}
    />
  );
};

const AdminCommsPage = () => {
  const data = useAdminState();
  const { role } = useAdminSession();
  const { pathname } = useLocation();
  const sub = pathname.replace(/^\/admin\/comms\/?/, '').split('/')[0];
  log('render', { sub, modal: data.modal, role });

  let title = 'Comms';
  let body;
  if (sub === 'message') {
    title = 'Message a user';
    body = <MessageScreen data={data} role={role} />;
  } else if (sub === 'bulk') {
    title = 'Bulk notification';
    body = <BulkScreen role={role} />;
  } else if (sub === 'templates') {
    title = 'Notification templates';
    body = <TemplatesScreen data={data} role={role} />;
  } else {
    body = <SentScreen data={data} />;
  }
  return (
    <AdminFrame data={data} title={title}>
      {body}
    </AdminFrame>
  );
};

export default AdminCommsPage;
