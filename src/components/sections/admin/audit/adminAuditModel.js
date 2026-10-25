import { docId, humanize, searchAudit, shortDate, timeAgo } from '../../../../services/admin.api.js';

/*
 * adminAuditModel — loads and shapes the platform audit log (GET /api/admin/audit/search; Super Admin raw, Senior Admin masked).
 * The backend filters on one exact value per field, so the "Admin actions", "Exports" and staff filters run one search per value and merge the
 * newest results; their counts are the sum of the per-value totals.
 */

export const STAFF_ACTORS = ['super_admin', 'senior_admin', 'support_agent', 'content_moderator'];
const EXPORT_ACTIONS = ['DATA_EXPORTED', 'AUDIT_LOG_EXPORTED', 'EXPORT_DUAL_APPROVAL_REQUIRED', 'AUDIT_EXPORT_DUAL_APPROVAL_REQUIRED'];
const LOGIN_ACTIONS = ['LOGIN_SUCCESS'];

export const AUDIT_TABS = [
  { id: 'all', label: 'All events' },
  { id: 'admin', label: 'Admin actions' },
  { id: 'exports', label: 'Exports' },
  { id: 'logins', label: 'Logins' },
];
export const AUDIT_CHIPS = [
  { id: 'all', label: 'All' },
  { id: 'warning', label: 'Warnings' },
  { id: 'critical', label: 'Critical' },
];

const isHexId = (q) => /^[a-f0-9]{24,64}$/i.test(q);

/** The list of filter objects for a tab + chip + search text. Each object is one backend search. */
export const auditQueries = ({ tab, chip, q }) => {
  const severity = chip === 'warning' || chip === 'critical' ? chip : undefined;
  let base;
  if (tab === 'admin') base = STAFF_ACTORS.map((actorType) => ({ actorType }));
  else if (tab === 'exports') base = EXPORT_ACTIONS.map((action) => ({ action }));
  else if (tab === 'logins') base = LOGIN_ACTIONS.map((action) => ({ action }));
  else base = [{}];
  const text = (q || '').trim();
  let search = [{}];
  if (text) {
    search = isHexId(text)
      ? [{ affectedEntityId: text }, { actorEntityId: text }]
      : [{ action: text.toUpperCase().replace(/[\s-]+/g, '_') }];
  }
  const out = [];
  base.forEach((b) => search.forEach((s) => out.push({ ...b, ...s, severity })));
  return out;
};

/** Runs the searches and merges them newest first. Returns { records, total }. */
export const loadAudit = async (filters, limit = 50) => {
  const results = await Promise.all(filters.map((f) => searchAudit({ ...f, limit })));
  const seen = new Set();
  const records = results
    .flatMap((r) => r?.records ?? [])
    .filter((r) => {
      const id = docId(r);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
  const total = results.reduce((n, r) => n + (r?.total ?? 0), 0);
  return { records, total };
};

const short = (id) => (!id ? '' : /^[a-f0-9]{16,}$/i.test(String(id)) ? String(id).slice(-8) : String(id));
const TILE = (e) =>
  /EXPORT/.test(e.action) ? 'download' : /CONFIG|FLAG|TEMPLATE|SETTING/.test(e.action) ? 'settings' : 'user';

export const actorLabel = (e) =>
  e.actorType === 'system' ? `System · ${e.actorEntityId || e.serviceOrigin}` : `${humanize(e.actorType)} ${short(e.actorEntityId)}`;

/** One event row of AuditLogView. */
export const auditRow = (e) => {
  const reason = e.payload?.reason;
  const staff = STAFF_ACTORS.includes(e.actorType);
  return {
    id: docId(e),
    icon: TILE(e),
    title: humanize(e.action),
    sticker: staff ? 'Admin' : e.actorType === 'system' ? 'System' : humanize(e.actorType),
    sub: [
      `${shortDate(e.createdAt)}, ${new Date(e.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`,
      actorLabel(e),
      e.affectedEntityType ? `${humanize(e.affectedEntityType)} ${short(e.affectedEntityId)}` : null,
      reason ? `reason: ${reason}` : null,
    ]
      .filter(Boolean)
      .join(' · '),
    chips: [
      { label: humanize(e.severity || 'info'), tone: e.severity === 'critical' || e.severity === 'warning' ? 'amber' : 'green' },
      e.serviceOrigin ? { label: e.serviceOrigin, tone: 'grey' } : null,
    ].filter(Boolean),
    pill: { label: 'View', strong: false },
    age: timeAgo(e.createdAt),
    raw: e,
  };
};

const fmt = (v) => (v === null || v === undefined || v === '' ? '—' : String(v));

/** Rows for the event detail dialog (AdminRecordDialog). */
export const eventDetailRows = (e) => [
  [
    { id: 'actor', label: 'Actor', value: actorLabel(e), ro: true },
    { id: 'actorId', label: 'Actor id', value: fmt(e.actorEntityId), ro: true },
  ],
  [
    { id: 'action', label: 'Action', value: e.action, ro: true },
    { id: 'severity', label: 'Severity', value: humanize(e.severity), ro: true, tint: e.severity !== 'info' },
  ],
  [
    { id: 'affected', label: 'Affected', value: `${humanize(e.affectedEntityType)}`, ro: true },
    { id: 'affectedId', label: 'Affected id', value: fmt(e.affectedEntityId), ro: true },
  ],
  [
    { id: 'service', label: 'Service', value: fmt(e.serviceOrigin), ro: true },
    { id: 'ip', label: 'IP address', value: fmt(e.ipAddress), ro: true },
  ],
  [
    { id: 'trace', label: 'Correlation id', value: fmt(e.correlationId), ro: true },
    { id: 'time', label: 'Time', value: new Date(e.createdAt).toLocaleString('en-GB'), ro: true },
  ],
];

const toCsv = (rows) => rows;
/** Saves an export payload ({ data, exportFormat }) as a file in the browser. */
export const downloadExport = (res, name = 'gth-audit-log') => {
  const isJson = res.exportFormat === 'json';
  const text = typeof res.data === 'string' ? res.data : JSON.stringify(toCsv(res.data), null, 2);
  const blob = new Blob([text], { type: isJson ? 'application/json' : 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}-${new Date().toISOString().slice(0, 10)}.${isJson ? 'json' : 'csv'}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
