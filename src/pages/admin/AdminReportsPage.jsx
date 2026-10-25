import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import { useAdminSession } from '../../components/sections/admin/useAdminSession.js';
import { useAdminData, useAdminToast } from '../../components/sections/admin/useAdminData.js';
import AdminLoadNotice from '../../components/sections/admin/AdminLoadNotice.jsx';
import AgencyButton from '../../components/sections/agency/AgencyButton.jsx';
import AgencyPageHero from '../../components/sections/agency/AgencyPageHero.jsx';
import TrendCard from '../../components/sections/publicData/outcomes/TrendCard.jsx';
import { Select, TextInput } from '../../components/ui/form';
import { adminError, exportReport, generateReport, humanize } from '../../services/admin.api.js';
import { downloadExport } from '../../components/sections/admin/audit/adminAuditModel.js';
import { debug } from '../../utils/debug.js';

const log = debug('AdminReportsPage');

/*
 * AdminReportsPage — /admin/reports/* (Figma 7.3.1-7.3.2) on POST /api/admin/reports/generate and /export:
 *   /admin/reports           report builder: type + date range → rows (up to 1,000 come back at once; larger reports are queued by the backend,
 *                            which has no way to fetch the queued result yet) · Export CSV (Senior and Super Admin)
 *   /admin/reports/health    Platform health: monthly charts from user_growth, flag_report_volume and account_status_overview
 * Which report types a role may run is decided by the backend (Support Agent: account status + growth; Content Moderator: moderation reports).
 * Not available yet: weekly buckets, verification reports, the external data-request workflow and PDF downloads.
 */

const TYPES = [
  { value: 'user_growth', label: 'User growth (monthly)' },
  { value: 'account_status_overview', label: 'Account status overview' },
  { value: 'moderation_queue_performance', label: 'Moderation queue performance' },
  { value: 'flag_report_volume', label: 'Flag report volume (monthly)' },
  { value: 'engagement_retention', label: 'Engagement and retention (weekly)' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthKey = (id) => `${id.year}-${String(id.month).padStart(2, '0')}`;
const monthLabel = (key) => {
  const [y, m] = key.split('-');
  return `${MONTHS[Number(m) - 1]} ${y.slice(2)}`;
};
const niceMax = (n) => {
  const max = Math.max(1, n);
  const p = 10 ** Math.floor(Math.log10(max));
  const step = Math.ceil(max / p / 4) * p;
  return { yMax: step * 4, yStep: step };
};
const fmt = (n) => Number(n || 0).toLocaleString('en-GB');
const flatten = (row) =>
  Object.fromEntries(
    Object.entries(row).flatMap(([k, v]) =>
      k === '_id' && v && typeof v === 'object' ? Object.entries(v) : [[k, typeof v === 'number' && !Number.isInteger(v) ? Math.round(v) : v]],
    ),
  );

/* ── Platform health (charts) ───────────────────────────────────────────── */
const HealthReport = () => {
  const growth = useAdminData(() => generateReport('user_growth'), []);
  const flags = useAdminData(() => generateReport('flag_report_volume'), []);
  const status = useAdminData(() => generateReport('account_status_overview'), []);

  const charts = useMemo(() => {
    const out = [];
    const byMonth = {};
    (growth.data?.data ?? []).forEach((r) => {
      const k = monthKey(r._id);
      byMonth[k] = (byMonth[k] || 0) + r.count;
    });
    const months = Object.keys(byMonth).sort().slice(-13);
    if (months.length) {
      let running = Object.keys(byMonth)
        .sort()
        .filter((k) => k < months[0])
        .reduce((n, k) => n + byMonth[k], 0);
      const cumulative = months.map((k) => {
        running += byMonth[k];
        return { label: monthLabel(k), value: running };
      });
      const last = cumulative[cumulative.length - 1].value;
      out.push({ id: 'total', title: 'Total accounts', aside: 'Cumulative, by month', kind: 'line', series: cumulative, headline: fmt(last), delta: `+${fmt(byMonth[months[months.length - 1]])} this month`, ...niceMax(last), showEndLabel: false });
      const signups = months.map((k) => ({ label: monthLabel(k), value: byMonth[k] }));
      out.push({ id: 'signups', title: 'New sign-ups', aside: 'Per month', kind: 'column', series: signups, headline: fmt(signups[signups.length - 1].value), delta: 'this month', ...niceMax(Math.max(...signups.map((s) => s.value))), current: true, showEndLabel: false });
    }
    const fByMonth = {};
    (flags.data?.data ?? []).forEach((r) => {
      const k = monthKey(r._id);
      fByMonth[k] = (fByMonth[k] || 0) + r.count;
    });
    const fm = Object.keys(fByMonth).sort().slice(-13);
    if (fm.length) {
      const s = fm.map((k) => ({ label: monthLabel(k), value: fByMonth[k] }));
      out.push({ id: 'flags', title: 'Flags raised', aside: 'Per month', kind: 'column', series: s, headline: fmt(s[s.length - 1].value), delta: 'this month', ...niceMax(Math.max(...s.map((x) => x.value))), showEndLabel: false });
    }
    const st = {};
    (status.data?.data ?? []).forEach((r) => {
      const k = r._id?.status || 'unknown';
      st[k] = (st[k] || 0) + r.count;
    });
    const sv = Object.entries(st).map(([k, v]) => ({ label: humanize(k), value: v }));
    if (sv.length) {
      out.push({ id: 'status', title: 'Accounts by status', aside: 'All account types', kind: 'column', series: sv, headline: fmt(st.active || 0), delta: 'active', ...niceMax(Math.max(...sv.map((x) => x.value))), showEndLabel: false });
    }
    return out;
  }, [growth.data, flags.data, status.data]);

  const loading = growth.loading || flags.loading || status.loading;
  const error = growth.error || flags.error || status.error;
  return (
    <div className="flex flex-col gap-[30px]">
      <AgencyPageHero title="Platform health report" subtitle="Monthly figures from the reporting service. Aggregated, no personal data." />
      <nav aria-label="Breadcrumb" className="flex items-center gap-[8px] font-sans text-[14px] leading-[17px]">
        <Link to="/admin/reports" className="font-semibold text-[#387440] no-underline hover:underline">
          Reports
        </Link>
        <span aria-hidden="true" className="text-[#595959]">›</span>
        <span aria-current="page" className="font-medium text-[#1c2a21]">Platform health</span>
      </nav>
      {loading || (error && !charts.length) ? (
        <AdminLoadNotice loading={loading} error={error} status={growth.status || flags.status} onRetry={() => [growth, flags, status].forEach((x) => x.reload())} />
      ) : (
        <div className="grid grid-cols-1 gap-[24px] xl:grid-cols-2">
          {charts.map((c) => (
            <TrendCard key={c.id} chart={c} />
          ))}
        </div>
      )}
      <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959]">
        The reporting service groups by month; weekly figures and verification decisions aren’t available yet.
      </p>
    </div>
  );
};

/* ── Report builder ─────────────────────────────────────────────────────── */
const Builder = ({ role }) => {
  const [toastEl, toast] = useAdminToast();
  const [type, setType] = useState('user_growth');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const canExport = role === 'super' || role === 'senior';
  const rows = (result?.data ?? []).map(flatten);
  const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))];

  const run = async (kind) => {
    setBusy(true);
    setError('');
    try {
      const p = { dateFrom: from ? new Date(from).toISOString() : undefined, dateTo: to ? new Date(to).toISOString() : undefined };
      if (kind === 'export') {
        const res = await exportReport(type, { ...p, exportFormat: 'csv' });
        if (res?.status === 'pending_approval') toast('Export needs approval', res.message || 'A second Super Admin must approve it.', 'info');
        else {
          downloadExport({ ...res, exportFormat: 'csv' }, `gth-${type}`);
          toast('Export downloaded', `${res?.rowCount ?? ''} rows.`);
        }
      } else {
        const res = await generateReport(type, p);
        setResult(res);
        if (res?.status === 'queued') toast('Report queued', res.message || 'It’s too large to show here.', 'info');
      }
    } catch (e) {
      setError(adminError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-[24px]">
      <AgencyPageHero
        title="Reports"
        subtitle="Run an aggregated report. No personal data. Every report is logged."
        actions={
          <Link to="/admin/reports/health" className="no-underline">
            <AgencyButton tabIndex={-1}>Platform health</AgencyButton>
          </Link>
        }
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run('generate');
        }}
        className="flex flex-col gap-[16px] rounded-[24px] border border-solid border-[#e1eae2] bg-white p-[24px]"
      >
        <div className="grid grid-cols-1 gap-[14px] md:grid-cols-3">
          <Select label="Report" required options={TYPES} value={type} onChange={setType} />
          <TextInput label="From" optional type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <TextInput label="To" optional type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        {error ? <p role="alert" className="m-0 font-sans text-[14px] font-semibold text-[#902b20]">{error}</p> : null}
        <div className="flex flex-wrap gap-[12px]">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-[48px] cursor-pointer items-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[20px] font-sans text-[15px] font-bold text-white shadow-[0_4px_0_#2a5730] disabled:opacity-55"
          >
            {busy ? 'Working…' : 'Generate report'}
          </button>
          {canExport ? (
            <AgencyButton size="md" onClick={() => run('export')} disabled={busy}>
              Export CSV
            </AgencyButton>
          ) : null}
        </div>
      </form>
      {result ? (
        <section className="flex flex-col gap-[10px] rounded-[24px] border border-solid border-[#e1eae2] bg-white p-[20px]">
          <p className="m-0 font-sans text-[15px] font-semibold text-[#1c2a21]">
            {TYPES.find((t) => t.value === result.reportType)?.label ?? humanize(result.reportType)} · {result.rowCount} rows · {humanize(result.status)}
          </p>
          {rows.length ? (
            <div className="overflow-auto">
              <table className="w-full border-collapse font-sans text-[13.5px]">
                <thead>
                  <tr>
                    {cols.map((c) => (
                      <th key={c} className="border-b border-solid border-[#e1eae2] px-[10px] py-[8px] text-left font-semibold text-[#595959]">
                        {humanize(c)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      {cols.map((c) => (
                        <td key={c} className="border-b border-solid border-[#f2f2f2] px-[10px] py-[7px] text-[#1c2a21]">
                          {typeof r[c] === 'number' ? fmt(r[c]) : humanize(String(r[c] ?? '—'))}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="m-0 font-sans text-[14px] text-[#737373]">
              {result.status === 'queued' ? 'This report was queued. The backend can’t return queued results yet.' : 'No rows for this range.'}
            </p>
          )}
        </section>
      ) : null}
      {toastEl}
    </div>
  );
};

const AdminReportsPage = () => {
  const data = useAdminState();
  const { role } = useAdminSession();
  const { pathname } = useLocation();
  const sub = pathname.replace(/^\/admin\/reports\/?/, '');
  useEffect(() => {
    log('mount', { sub, role });
  }, [sub, role]);
  if (!sub && data.view === 'exports') return <Navigate to="/admin/reports" replace />;
  return (
    <AdminFrame data={data} title={sub === 'health' ? 'Platform health report' : 'Reports'}>
      {sub === 'health' ? <HealthReport /> : <Builder role={role} />}
    </AdminFrame>
  );
};

export default AdminReportsPage;
