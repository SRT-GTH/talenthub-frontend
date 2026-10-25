import { useEffect, useMemo, useState } from 'react';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import AuditExportDialog from '../../components/sections/admin/audit/AuditExportDialog.jsx';
import AuditLogView from '../../components/sections/admin/audit/AuditLogView.jsx';
import {
  AUDIT_CHIPS,
  AUDIT_TABS,
  auditQueries,
  auditRow,
  downloadExport,
  eventDetailRows,
  loadAudit,
} from '../../components/sections/admin/audit/adminAuditModel.js';
import AdminRecordDialog from '../../components/sections/admin/settings/AdminRecordDialog.jsx';
import { useAdminSession } from '../../components/sections/admin/useAdminSession.js';
import { useAdminData, useAdminToast } from '../../components/sections/admin/useAdminData.js';
import AdminLoadNotice from '../../components/sections/admin/AdminLoadNotice.jsx';
import { adminError, exportAudit, humanize } from '../../services/admin.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('AdminAuditPage');

/*
 * AdminAuditPage — /admin/audit-log (Figma 7.5.3). Real data: GET /api/admin/audit/search (Super Admin raw, Senior Admin masked: IPs and personal fields
 * in payloads), POST /api/admin/audit/export (Super Admin).
 * URL states: ?tab=all|admin|exports|logins · ?chip=all|warning|critical · ?q= (an id matches actor or affected entity; text matches an action name)
 *             ?modal=event&event=<id> (event detail) · ?modal=export.
 * Other roles get a 403 from the backend and see the restricted notice.
 */

const PAGE = 50;

const AdminAuditPage = () => {
  const data = useAdminState();
  const { role } = useAdminSession();
  const tab = data.tab ?? 'all';
  const chip = data.params.get('chip') ?? 'all';
  const q = data.q;
  const modal = data.modal;
  const eventId = data.params.get('event');
  const [limit, setLimit] = useState(PAGE);
  const [toastEl, toast] = useAdminToast();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => setLimit(PAGE), [tab, chip, q]);
  useEffect(() => {
    log('mount', { role, tab, chip, q, modal });
  }, [role, tab, chip, q, modal]);

  const filters = useMemo(() => auditQueries({ tab, chip, q }), [tab, chip, q]);
  const list = useAdminData(() => loadAudit(filters, limit), [filters, limit]);
  // Every audit search writes an AUDIT_LOG_VIEWED event, so the page doesn't run extra searches just to count the other tabs:
  // the open tab shows its total, the others a dash.
  const counts = { data: { [tab]: list.data?.total ?? null } };

  const records = list.data?.records ?? [];
  const total = list.data?.total ?? 0;
  const events = records.map(auditRow);
  const close = () => {
    setErr('');
    data.update({ modal: null, event: null });
  };
  const masked = role === 'senior';
  const selected = records.find((r) => String(r._id || r.id) === eventId);

  const config = {
    title: 'Audit log',
    sticker: 'Immutable',
    subtitle: 'Every user action, system event and admin operation. This log can’t be edited or deleted.',
    tabs: AUDIT_TABS.map((t) => ({
      ...t,
      count: counts.data?.[t.id] == null ? '–' : counts.data[t.id].toLocaleString('en-GB'),
    })),
    chips: AUDIT_CHIPS,
    banner: masked
      ? `You’re viewing as a Senior Admin: IP addresses and personal details in events are masked. Showing ${records.length} of ${total.toLocaleString('en-GB')}.`
      : `Showing ${records.length} of ${total.toLocaleString('en-GB')} events${q ? ` matching “${q}”` : ''}, newest first. Exports over 10,000 rows need a second Super Admin.`,
    events,
    body:
      list.loading || list.error ? (
        <AdminLoadNotice loading={list.loading} error={list.error} status={list.status} onRetry={list.reload} />
      ) : null,
    more: records.length < total && records.length >= limit ? 'Load more' : null,
  };

  // Export: one filter set only (the backend takes single values).
  const single = filters.length === 1 ? filters[0] : null;
  const exportOptions = [
    {
      id: 'csv',
      title: 'Current filters · CSV',
      meta: single ? `${total.toLocaleString('en-GB')} rows` : 'This tab combines several filters: switch to All events to export',
      disabled: !single,
    },
    {
      id: 'json',
      title: 'Current filters · JSON for investigators',
      meta: single ? 'Full payloads' : 'Not available for this tab',
      disabled: !single,
    },
    { id: 'all', title: 'Everything · CSV', meta: 'All events; over 10,000 rows needs a second Super Admin' },
  ];
  const doExport = async (option) => {
    setBusy(true);
    setErr('');
    try {
      const f = option === 'all' ? {} : single;
      const res = await exportAudit({ ...f, exportFormat: option === 'json' ? 'json' : 'csv' });
      if (res?.status === 'pending_approval') {
        toast('Export needs a second Super Admin', `${res.totalRows?.toLocaleString('en-GB')} rows. An approval request was opened.`, 'info');
      } else {
        downloadExport(res);
        toast('Export downloaded', `${res?.totalRows ?? ''} rows saved as ${res?.exportFormat?.toUpperCase()}.`);
      }
      close();
    } catch (e) {
      setErr(adminError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminFrame data={data} title="Audit log">
      <AuditLogView
        data={data}
        config={config}
        canExport={role === 'super'}
        onOpen={(row) => data.update({ modal: 'event', event: row.id })}
        onExport={() => data.update({ modal: 'export' })}
        onMore={() => setLimit((n) => n + PAGE)}
      />
      {modal === 'event' && selected ? (
        <AdminRecordDialog
          key={eventId}
          chip="Event detail"
          title={[humanize(selected.action), '']}
          sub={`${new Date(selected.createdAt).toLocaleString('en-GB')} · ${selected.serviceOrigin || 'platform'}`}
          file={{
            title: `Event ${String(selected._id || selected.id).slice(-8)}`,
            meta: 'Read-only: audit events can’t be changed',
            action: 'Copy JSON',
            onAction: async () => {
              try {
                await navigator.clipboard.writeText(JSON.stringify(selected, null, 2));
                toast('Copied', 'The event JSON is on your clipboard.');
              } catch {
                toast('Couldn’t copy', 'Your browser blocked the clipboard.', 'error');
              }
            },
          }}
          rows={eventDetailRows(selected)}
          secondary="Close"
          primary="Done"
          onSubmit={close}
          onClose={close}
        >
          <div className="flex flex-col gap-[6px]">
            <span className="font-sans text-[13px] font-semibold text-[#1c2a21]">Payload</span>
            <pre className="m-0 max-h-[220px] overflow-auto rounded-[12px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] p-[12px] font-mono text-[12px] leading-[17px] whitespace-pre-wrap text-[#1c2a21]">
              {JSON.stringify(selected.payload ?? {}, null, 2)}
            </pre>
          </div>
        </AdminRecordDialog>
      ) : null}
      {modal === 'export' ? (
        <AuditExportDialog options={exportOptions} busy={busy} error={err} onClose={close} onSubmit={doExport} />
      ) : null}
      {toastEl}
    </AdminFrame>
  );
};

export default AdminAuditPage;
