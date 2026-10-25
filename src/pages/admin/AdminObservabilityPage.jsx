import { useEffect, useState } from 'react';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import { useAdminSession } from '../../components/sections/admin/useAdminSession.js';
import { useAdminData } from '../../components/sections/admin/useAdminData.js';
import AdminLoadNotice from '../../components/sections/admin/AdminLoadNotice.jsx';
import AgencyButton from '../../components/sections/agency/AgencyButton.jsx';
import AgencyPageHero from '../../components/sections/agency/AgencyPageHero.jsx';
import KpiStrip from '../../components/sections/publicData/ui/KpiStrip.jsx';
import KpiTile from '../../components/sections/publicData/ui/KpiTile.jsx';
import PublicCard from '../../components/sections/publicData/ui/PublicCard.jsx';
import TrendCard from '../../components/sections/publicData/outcomes/TrendCard.jsx';
import { classNames } from '../../utils/classNames.js';
import { TextInput } from '../../components/ui/form';
import {
  obsSeries,
  obsEnvironments,
  obsSnapshot,
  obsStatus,
  obsTop,
  obsTraces,
  timeAgo,
} from '../../services/admin.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('AdminObservabilityPage');

/*
 * AdminObservabilityPage — /admin/observability (Senior and Super Admin). Reads Grafana Cloud through the backend (services/adminObservability):
 *   status    which sources are configured (no secrets)        snapshot  this node: uptime, memory, services, cluster nodes
 *   series    request rate · server error rate · p95 / median response time · memory · CPU (Prometheus, gth_http_request_* metrics)
 *   top       slowest routes · routes with most 5xx · busiest routes · database time and queries per request
 *   traces    recent error traces and slow (> 1 s) traces from Tempo, with links into Grafana
 * Until Grafana read credentials are set on the server the page shows the node snapshot and says what's missing.
 * ?range=1h|6h|24h|7d, or ?from=&to= (a custom period, local date-times; up to 30 days back).
 */

const RANGES = ['1h', '6h', '24h', '7d'];
const SERIES = ['request_rate', 'error_rate', 'p95_latency', 'p50_latency', 'memory', 'cpu'];
const TABLES = [
  'slowest_routes',
  'error_routes',
  'busiest_routes',
  'db_time_routes',
  'db_queries_routes',
];

const fmtValue = (v, unit) => {
  if (!Number.isFinite(v)) return '—';
  if (unit === 'ratio') return `${(v * 100).toFixed(v < 0.01 ? 2 : 1)}%`;
  if (unit === 's') return v < 1 ? `${Math.round(v * 1000)} ms` : `${v.toFixed(2)} s`;
  if (unit === 'bytes') return `${(v / 1048576).toFixed(0)} MB`;
  if (unit === 'req/s') return v < 1 ? `${(v * 60).toFixed(1)}/min` : `${v.toFixed(1)}/s`;
  return v < 10 ? v.toFixed(2) : Math.round(v).toLocaleString('en-GB');
};
const niceMax = (n) => {
  const max = n > 0 ? n : 1;
  const p = 10 ** Math.floor(Math.log10(max));
  const step = Math.ceil(max / p / 4) * p;
  return { yMax: step * 4, yStep: step };
};
const label = (ms, range) =>
  new Date(ms).toLocaleString(
    'en-GB',
    range === '7d' ? { day: 'numeric', month: 'short' } : { hour: '2-digit', minute: '2-digit' }
  );

const toChart = (id, s, range) => {
  const pts =
    s.points.length > 60
      ? s.points.filter((_, i) => i % Math.ceil(s.points.length / 60) === 0)
      : s.points;
  const scale =
    s.unit === 'ratio' ? 100 : s.unit === 's' ? 1000 : s.unit === 'bytes' ? 1 / 1048576 : 1;
  const series = pts.map(([t, v]) => ({
    label: label(t, range),
    value: Math.round(v * scale * 100) / 100,
  }));
  const last = s.points[s.points.length - 1]?.[1];
  return {
    id,
    title: s.title,
    aside:
      { ratio: 'Percent', s: 'Milliseconds', bytes: 'MB', 'req/s': 'Per second', cores: 'Cores' }[
        s.unit
      ] || '',
    kind: 'line',
    series: series.length ? series : [{ label: '', value: 0 }],
    headline: fmtValue(last, s.unit),
    delta: 'now',
    ...niceMax(Math.max(0, ...series.map((x) => x.value))),
    showEndLabel: false,
  };
};

// Titles shown before the data arrives or when Grafana refuses (the server sends the real title with the rows).
const TABLE_TITLE = {
  slowest_routes: 'Slowest routes',
  error_routes: 'Routes with the most errors',
  busiest_routes: 'Busiest routes',
  db_time_routes: 'Most database time',
  db_queries_routes: 'Most database queries',
};

const Table = ({ name, data, error }) => (
  <PublicCard
    title={data?.title ?? TABLE_TITLE[name] ?? 'Top routes'}
    hint={data ? `Top ${data.rows.length}` : ''}
  >
    {error ? (
      <p className="m-0 font-sans text-[14px] text-[#737373]">{error}</p>
    ) : !data ? (
      <p className="m-0 font-sans text-[14px] text-[#737373]">Loading…</p>
    ) : data.rows.length === 0 ? (
      <p className="m-0 font-sans text-[14px] text-[#737373]">Nothing in this range.</p>
    ) : (
      <table className="w-full border-collapse font-sans text-[13.5px]">
        <tbody>
          {data.rows.map((r) => (
            <tr key={`${r.method}-${r.route}`}>
              <td className="border-b border-solid border-[#f2f2f2] py-[7px] pr-[10px] text-[#1c2a21]">
                {r.method ? (
                  <span className="mr-[6px] rounded-[6px] bg-[#f8f8f4] px-[6px] py-[1px] text-[11.5px] font-bold text-[#595959]">
                    {r.method}
                  </span>
                ) : null}
                <span className="break-all">
                  {r.route === 'none' ? 'No API action (health checks, unknown paths)' : r.route}
                </span>
              </td>
              <td className="border-b border-solid border-[#f2f2f2] py-[7px] text-right font-semibold whitespace-nowrap text-[#2a5730]">
                {fmtValue(r.value, data.unit)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </PublicCard>
);

const Traces = ({ kind, period, periodKey }) => {
  const t = useAdminData(() => obsTraces(kind, 15, period), [kind, periodKey]);
  return (
    <PublicCard
      title={kind === 'errors' ? 'Recent error traces' : 'Slow requests (over 1 s)'}
      hint="Selected period · Tempo"
    >
      {t.loading ? (
        <p className="m-0 font-sans text-[14px] text-[#737373]">Loading…</p>
      ) : t.error ? (
        <p className="m-0 font-sans text-[14px] text-[#737373]">{t.error}</p>
      ) : (t.data?.traces ?? []).length === 0 ? (
        <p className="m-0 font-sans text-[14px] text-[#737373]">None. 🎉</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-[8px] p-0">
          {t.data.traces.map((x) => (
            <li
              key={x.traceId}
              className="flex flex-wrap items-center justify-between gap-[8px] font-sans text-[13.5px]"
            >
              <span className="min-w-0 flex-1 truncate font-semibold text-[#1c2a21]">
                {x.rootName || x.traceId}
              </span>
              <span className="text-[#737373]">
                {x.durationMs != null ? `${x.durationMs} ms · ` : ''}
                {x.startedAt ? timeAgo(x.startedAt) : ''}
              </span>
              {x.link ? (
                <a
                  href={x.link}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#387440]"
                >
                  Open
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </PublicCard>
  );
};

const AdminObservabilityPage = () => {
  const data = useAdminState();
  const { role } = useAdminSession();
  const from = data.params.get('from');
  const to = data.params.get('to');
  const custom = Boolean(from || to);
  const range = custom
    ? 'custom'
    : RANGES.includes(data.params.get('range'))
      ? data.params.get('range')
      : '6h';
  const [picking, setPicking] = useState(custom);
  const [draft, setDraft] = useState({ from: from || '', to: to || '' });
  const [tick, setTick] = useState(0);
  const status = useAdminData(() => obsStatus(), []);
  const envs = useAdminData(() => obsEnvironments().catch(() => null), []);
  // Grafana collects metrics from deployed backends; a local backend defaults to staging (server decides the default).
  const envSel = data.params.get('env') || status.data?.env || envs.data?.default || undefined;
  const period = {
    ...(custom
      ? {
          from: from ? new Date(from).toISOString() : undefined,
          to: to ? new Date(to).toISOString() : undefined,
        }
      : { range }),
    env: envSel,
  };
  const periodKey = `${custom ? `${from}|${to}` : range}|${envSel || ''}`;
  const snap = useAdminData(() => obsSnapshot(), [tick]);
  const configured = Boolean(status.data?.metrics);
  const series = useAdminData(
    () => (configured && envSel ? obsSeries(SERIES, period) : Promise.resolve(null)),
    [configured, periodKey, tick]
  );
  const tables = useAdminData(async () => {
    if (!configured || !envSel) return null;
    const res = await Promise.all(
      TABLES.map((n) =>
        obsTop(n, period).catch((e) => ({
          name: n,
          error: e?.response?.data?.message || e.message,
        }))
      )
    );
    return Object.fromEntries(res.map((r, i) => [TABLES[i], r]));
  }, [configured, periodKey, tick]);
  useEffect(() => log('mount', { role, periodKey, configured }), [role, periodKey, configured]);

  if (!(role === 'super' || role === 'senior')) {
    return (
      <AdminFrame data={data} title="Observability">
        <AdminLoadNotice
          error="Observability is for Senior Admins and Super Admins."
          status={403}
        />
      </AdminFrame>
    );
  }

  const s = series.data?.series ?? {};
  const latest = (n) => s[n]?.points?.[s[n].points.length - 1]?.[1];
  const sn = snap.data;

  return (
    <AdminFrame data={data} title="Observability">
      <div className="flex flex-col gap-[28px]">
        <AgencyPageHero
          title="Observability"
          subtitle={`How the platform is running${status.data ? ` · ${status.data.service} · ${envSel || status.data.env}` : ''}. Read from Grafana Cloud.`}
          actions={
            <div className="flex flex-wrap gap-[8px]">
              <AgencyButton onClick={() => setTick((n) => n + 1)}>Refresh</AgencyButton>
              {status.data?.dashboardsUrl ? (
                <a
                  href={status.data.dashboardsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="no-underline"
                >
                  <AgencyButton tabIndex={-1}>Open Grafana</AgencyButton>
                </a>
              ) : null}
            </div>
          }
        />

        <div role="group" aria-label="Time range" className="flex flex-wrap gap-[8px]">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={r === range}
              onClick={() => {
                setPicking(false);
                data.update({ range: r === '6h' ? null : r, from: null, to: null });
              }}
              className={classNames(
                'h-[34px] cursor-pointer rounded-full border border-solid px-[14px] font-sans text-[13px] font-semibold',
                r === range
                  ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
                  : 'border-[#e1eae2] bg-white text-[#595959]'
              )}
            >
              Last {r}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={custom || picking}
            onClick={() => setPicking((v) => !v)}
            className={classNames(
              'h-[34px] cursor-pointer rounded-full border border-solid px-[14px] font-sans text-[13px] font-semibold',
              custom || picking
                ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
                : 'border-[#e1eae2] bg-white text-[#595959]'
            )}
          >
            {custom
              ? `${from ? new Date(from).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '…'} – ${to ? new Date(to).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : 'now'}`
              : 'Custom'}
          </button>
        </div>
        {(envs.data?.environments || []).length > 1 ? (
          <div
            role="group"
            aria-label="Environment"
            className="flex flex-wrap items-center gap-[8px]"
          >
            <span className="font-sans text-[13px] font-semibold text-[#595959]">Environment</span>
            {envs.data.environments.map((e) => (
              <button
                key={e}
                type="button"
                aria-pressed={e === envSel}
                onClick={() => data.update({ env: e === envs.data.default ? null : e })}
                className={classNames(
                  'h-[34px] cursor-pointer rounded-full border border-solid px-[14px] font-sans text-[13px] font-semibold',
                  e === envSel
                    ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
                    : 'border-[#e1eae2] bg-white text-[#595959]'
                )}
              >
                {e}
              </button>
            ))}
            {status.data?.serverEnv && status.data.serverEnv !== envSel ? (
              <span className="font-sans text-[12.5px] text-[#737373]">
                This server runs as “{status.data.serverEnv}”; Grafana only collects from deployed
                backends.
              </span>
            ) : null}
          </div>
        ) : null}
        {picking ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.from) return;
              data.update({ range: null, from: draft.from, to: draft.to || null });
            }}
            className="flex flex-wrap items-end gap-[12px] rounded-[20px] border border-solid border-[#e1eae2] bg-white p-[16px]"
          >
            <TextInput
              label="From"
              required
              type="datetime-local"
              value={draft.from}
              onChange={(e) => setDraft((d) => ({ ...d, from: e.target.value }))}
            />
            <TextInput
              label="To"
              optional
              type="datetime-local"
              value={draft.to}
              onChange={(e) => setDraft((d) => ({ ...d, to: e.target.value }))}
            />
            <button
              type="submit"
              disabled={!draft.from || (draft.to && draft.to <= draft.from)}
              className="h-[46px] cursor-pointer rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[15px] font-bold text-white disabled:opacity-55"
            >
              Apply
            </button>
            <span className="font-sans text-[12.5px] text-[#737373]">
              Up to 30 days back. Leave “To” empty for now.
            </span>
          </form>
        ) : null}

        {status.error ? (
          <AdminLoadNotice error={status.error} status={status.status} onRetry={status.reload} />
        ) : null}
        {status.data && !configured ? (
          <div className="rounded-[20px] border border-solid border-[#eedeb8] bg-[#faf4e8] px-[18px] py-[14px] font-sans text-[14px] leading-[21px] text-[#463409]">
            Grafana isn’t connected for reading yet. Add {status.data.missing.join(', ')} to the
            backend environment (a read-only Grafana Cloud token with metrics:read and traces:read).
            Until then only this server’s own snapshot is shown.
            {!status.data.exportsMetrics
              ? ' The backend also isn’t exporting metrics (METRICS_TOKEN unset).'
              : ''}
          </div>
        ) : null}

        <KpiStrip columns={4}>
          <KpiTile
            eyebrow="REQUESTS"
            value={configured ? fmtValue(latest('request_rate'), 'req/s') : '—'}
            sub="right now"
          />
          <KpiTile
            eyebrow="SERVER ERRORS"
            value={configured ? fmtValue(latest('error_rate'), 'ratio') : '—'}
            sub="of requests (5xx)"
          />
          <KpiTile
            eyebrow="P95 RESPONSE"
            value={configured ? fmtValue(latest('p95_latency'), 's') : '—'}
            sub="95% of requests are faster"
          />
          <KpiTile
            eyebrow="THIS SERVER"
            value={sn ? `${Math.round(sn.uptimeSeconds / 3600)} h up` : '…'}
            sub={
              sn
                ? `${(sn.memory.rss / 1048576).toFixed(0)} MB · ${sn.serviceCount} services · ${sn.nodes.length} node${sn.nodes.length === 1 ? '' : 's'}`
                : ''
            }
          />
        </KpiStrip>

        {configured ? (
          <>
            {series.error ? (
              <AdminLoadNotice
                error={series.error}
                status={series.status}
                onRetry={series.reload}
              />
            ) : null}
            <div className="grid grid-cols-1 gap-[24px] xl:grid-cols-2">
              {SERIES.filter((n) => s[n]).map((n) => (
                <TrendCard
                  key={`${n}-${periodKey}`}
                  chart={toChart(
                    n,
                    s[n],
                    custom
                      ? new Date(to || Date.now()) - new Date(from) > 2 * 86400000
                        ? '7d'
                        : '6h'
                      : range
                  )}
                />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-[24px] xl:grid-cols-2">
              {TABLES.map((n) => (
                <Table
                  key={n}
                  name={n}
                  data={tables.data?.[n]?.rows ? tables.data[n] : null}
                  error={tables.error || tables.data?.[n]?.error}
                />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-[24px] xl:grid-cols-2">
              {status.data?.traces ? (
                <>
                  <Traces
                    kind="errors"
                    period={
                      custom ? period : { range: range === '1h' || range === '6h' ? range : '24h' }
                    }
                    periodKey={periodKey}
                  />
                  <Traces
                    kind="slow"
                    period={
                      custom ? period : { range: range === '1h' || range === '6h' ? range : '24h' }
                    }
                    periodKey={periodKey}
                  />
                </>
              ) : (
                <PublicCard title="Traces" hint="Tempo">
                  <p className="m-0 font-sans text-[14px] text-[#737373]">
                    Add GRAFANA_TEMPO_QUERY_URL to see recent error and slow traces.
                  </p>
                </PublicCard>
              )}
            </div>
          </>
        ) : null}

        {sn ? (
          <PublicCard title="Cluster nodes" hint={`Node ${sn.nodeId} · ${sn.node}`}>
            <ul className="m-0 flex list-none flex-col gap-[6px] p-0">
              {sn.nodes.map((n) => (
                <li key={n.id} className="flex justify-between font-sans text-[13.5px]">
                  <span className="font-semibold text-[#1c2a21]">
                    {n.id}
                    {n.local ? ' (this server)' : ''}
                  </span>
                  <span className={n.available ? 'text-[#2a5730]' : 'text-[#902b20]'}>
                    {n.available ? 'Available' : 'Offline'}
                    {n.cpu != null ? ` · CPU ${n.cpu}%` : ''}
                  </span>
                </li>
              ))}
            </ul>
          </PublicCard>
        ) : null}
      </div>
    </AdminFrame>
  );
};

export default AdminObservabilityPage;
