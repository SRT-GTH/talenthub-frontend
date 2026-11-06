import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import AgencyButton from '../../agency/AgencyButton.jsx';
import AgencyPageHero from '../../agency/AgencyPageHero.jsx';
import BarList from '../../publicData/ui/BarList.jsx';
import BarRow from '../../publicData/ui/BarRow.jsx';
import HeroMetric from '../../publicData/ui/HeroMetric.jsx';
import KpiStrip from '../../publicData/ui/KpiStrip.jsx';
import KpiTile from '../../publicData/ui/KpiTile.jsx';
import PublicCard from '../../publicData/ui/PublicCard.jsx';
import TodayStrip from '../../publicData/ui/TodayStrip.jsx';
import { useAdminData } from '../useAdminData.js';
import AdminLoadNotice from '../AdminLoadNotice.jsx';
import {
  docId,
  humanize,
  liveOpsSnapshot,
  realtime,
  timeAgo,
} from '../../../../services/admin.api.js';

const log = debug('AdminLiveOps');

/*
 * AdminLiveOps — /admin/live-ops (Figma 7.3.3a), Senior and Super Admin.
 *   GET /api/admin/live-ops/snapshot  people online now (accounts with a request in the last 5 min) by platform, peak today,
 *                                     same time last week, what people are doing and active accounts by region (last 15 min,
 *                                     regions under 5 hidden), sign-ups today vs the usual level, error rate and p95 response
 *                                     times, open flags, alerts, today's totals
 *   GET /api/admin/reports/realtime   active accounts and the last hour's audit events
 * Refreshes every 30 seconds ("Pause updates"). An alert opens the alert dialog (onOpenAlert).
 */

const REFRESH_MS = 30000;
const pct = (x) => (x == null ? '–' : `${(x * 100).toFixed(x < 0.01 ? 2 : 1)}%`);
const clock = (d) =>
  d ? new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '';
const ago = (d) => {
  if (!d) return '';
  const m = Math.round((Date.now() - new Date(d)) / 60000);
  if (m < 60) return `${m}m`;
  if (m < 48 * 60) return `${Math.floor(m / 60)}h ${m % 60}m`;
  return `${Math.round(m / 1440)} days`;
};

const AdminLiveOps = ({ onOpenAlert, muted = {} }) => {
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  const snap = useAdminData(() => liveOpsSnapshot(), [tick]);
  const live = useAdminData(() => realtime(), [tick]);
  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setTick((n) => n + 1), REFRESH_MS);
    return () => clearInterval(id);
  }, [paused]);

  const s = snap.data;
  const alerts = (s?.alerts ?? []).filter((a) => !muted[a.key]);
  const mutedCount = (s?.alerts ?? []).length - alerts.length;
  const m = live.data?.metrics ?? {};
  const feed = live.data?.eventFeed ?? [];
  const loading = snap.loading && !s;
  const online = s?.online;
  const change =
    online && online.sameTimeLastWeek
      ? {
          pct: Math.round(((online.now - online.sameTimeLastWeek) / online.sameTimeLastWeek) * 100),
          suffix: 'vs this time last week',
        }
      : undefined;
  const activityMax = Math.max(1, ...(s?.activity ?? []).map((r) => r[1]));
  const regions = s?.regions ?? [];
  const regionMax = Math.max(1, ...regions.map((r) => r.count || 0));
  const usual = s?.signups?.usual;
  const signupNote =
    usual == null
      ? ''
      : s.signups.today >= Math.max(10, usual * 2)
        ? `Well above the usual ${usual} by now.`
        : s.signups.today < usual / 2 && usual >= 4
          ? `Below the usual ${usual} by now.`
          : `Usually about ${usual} by now.`;

  return (
    <div className="flex flex-col gap-[30px]">
      <AgencyPageHero
        title="Live ops"
        subtitle={`What’s happening on GTH right now. Counts only, no individual tracking.${
          s?.timestamp
            ? ` Updated ${new Date(s.timestamp).toLocaleTimeString('en-GB')}${paused ? ' · paused' : ' · every 30 seconds'}.`
            : ''
        }`}
        actions={
          <AgencyButton
            onClick={() => {
              log('pause toggled', !paused);
              setPaused((v) => !v);
              if (paused) setTick((n) => n + 1);
            }}
          >
            {paused ? 'Resume updates' : 'Pause updates'}
          </AgencyButton>
        }
      />

      {snap.error && !s ? (
        <AdminLoadNotice error={snap.error} status={snap.status} onRetry={snap.reload} />
      ) : (
        <>
          {alerts.length || mutedCount ? (
            <div className="flex flex-col gap-[8px]">
              {mutedCount ? (
                <p className="m-0 font-sans text-[13px] text-[#737373]">
                  {mutedCount} muted alert{mutedCount === 1 ? '' : 's'} hidden for up to an hour.
                </p>
              ) : null}
              {alerts.map((a) => (
                <button
                  key={a.key}
                  type="button"
                  onClick={() => onOpenAlert?.(a)}
                  className={`flex w-full cursor-pointer flex-wrap items-center justify-between gap-[8px] rounded-[14px] border border-solid px-[16px] py-[12px] text-left font-sans text-[14px] ${
                    a.severity === 'high'
                      ? 'border-[#f1c5c0] bg-[#fdf1f0] text-[#7a1f16]'
                      : 'border-[#f0dfb8] bg-[#faf4e8] text-[#463409]'
                  }`}
                >
                  <span>
                    <span className="font-semibold">{a.title}</span> · {a.kind}
                  </span>
                  <span className="font-semibold underline">Review</span>
                </button>
              ))}
            </div>
          ) : null}

          <KpiStrip
            columns={3}
            hero={
              <HeroMetric
                eyebrow="People online now"
                value={String(online?.now ?? 0)}
                loading={loading}
                label="signed in, active in the last 5 minutes"
                change={change}
                note={
                  online?.peakToday
                    ? `Peak today ${online.peakToday.online} at ${clock(online.peakToday.at)}`
                    : 'Peak today appears after the first 5-minute snapshot.'
                }
                series={(online?.hourly ?? []).map((h) => h.online ?? 0)}
                seriesLabel="Online by hour today"
              />
            }
          >
            <KpiTile
              eyebrow="Sign-ups today"
              value={String(s?.signups?.today ?? '…')}
              sub={signupNote}
              loading={loading}
            />
            <KpiTile
              eyebrow="Error rate"
              value={pct(s?.errors?.rate)}
              sub={
                s
                  ? `${s.errors.errors} of ${s.errors.requests} requests failed · last 15 min · alert above 1%`
                  : ''
              }
              loading={loading}
            />
            <KpiTile
              eyebrow="Pending flags"
              value={String(s?.flags?.open ?? '…')}
              sub={
                s ? (
                  <Link to="/admin/moderation">
                    {s.flags.high} high priority
                    {s.flags.oldestAt ? ` · oldest ${ago(s.flags.oldestAt)}` : ''}
                    {s.flags.overdue ? ` · ${s.flags.overdue} overdue` : ''}
                  </Link>
                ) : (
                  ''
                )
              }
              loading={loading}
            />
          </KpiStrip>

          <div className="grid grid-cols-1 gap-[24px] xl:grid-cols-2">
            <PublicCard
              title="Active by region"
              hint="Last 15 minutes · regions under 5 hidden"
              loading={loading}
            >
              {regions.length ? (
                <BarList label="Active by region" gap={10}>
                  {regions.map((r) => (
                    <BarRow
                      key={r.name}
                      label={r.name}
                      valueText={r.hidden ? 'fewer than 5' : String(r.count)}
                      ratio={r.hidden ? 0.02 : r.count / regionMax}
                    />
                  ))}
                </BarList>
              ) : (
                <p className="m-0 font-sans text-[14px] text-[#737373]">
                  Nobody signed in has been active in the last 15 minutes.
                </p>
              )}
            </PublicCard>
            <PublicCard
              title="What people are doing"
              hint="Last 15 minutes, by area"
              loading={loading}
            >
              {s?.activity?.length ? (
                <BarList label="What people are doing" gap={10}>
                  {s.activity.map(([area, count]) => (
                    <BarRow
                      key={area}
                      label={area}
                      valueText={String(count)}
                      ratio={count / activityMax}
                    />
                  ))}
                </BarList>
              ) : (
                <p className="m-0 font-sans text-[14px] text-[#737373]">
                  No activity in the last 15 minutes.
                </p>
              )}
            </PublicCard>
          </div>

          <div className="grid grid-cols-1 gap-[24px] xl:grid-cols-2">
            <PublicCard title="Devices" hint="Online now" loading={loading}>
              {online?.now ? (
                <BarList label="People online by device" gap={10}>
                  {[
                    ['Web', online.byPlatform.web || 0],
                    ['Android', online.byPlatform.android || 0],
                    ['iOS', online.byPlatform.ios || 0],
                  ].map(([label, n]) => (
                    <BarRow
                      key={label}
                      label={label}
                      valueText={String(n)}
                      ratio={n / Math.max(1, online.now)}
                    />
                  ))}
                </BarList>
              ) : (
                <p className="m-0 font-sans text-[14px] text-[#737373]">Nobody online right now.</p>
              )}
            </PublicCard>
            <PublicCard title="Response time" hint="p95, last 15 minutes" loading={loading}>
              <BarList label="Response time" gap={10}>
                {(s?.response ?? []).map((r) => (
                  <BarRow
                    key={r.key}
                    label={r.label}
                    valueText={r.p95 == null ? 'no requests' : `${r.p95} ms · ${r.count} requests`}
                    ratio={r.p95 == null ? 0 : Math.min(1, r.p95 / 2000)}
                  />
                ))}
              </BarList>
            </PublicCard>
          </div>

          <TodayStrip
            loading={loading}
            stats={[
              {
                key: 'signups',
                value: String(s?.today?.signups ?? 0),
                prefix: '+',
                label: 'Sign-ups',
              },
              { key: 'assess', value: String(s?.today?.assessments ?? 0), label: 'Assessments' },
              { key: 'flags', value: String(s?.today?.flagsRaised ?? 0), label: 'Flags raised' },
              { key: 'alerts', value: String(s?.today?.alerts ?? 0), label: 'Alerts now' },
            ]}
          />

          <div className="grid grid-cols-1 gap-[24px] xl:grid-cols-2">
            <PublicCard title="Accounts" hint="All time">
              <p className="m-0 font-sans text-[14px] leading-[22px] text-[#3b3b3b]">
                {m.totalActiveUsers ?? '…'} active accounts · {m.newRegistrationsLastHour ?? '…'}{' '}
                sign-ups in the last hour · {m.openModerationFlags ?? '…'} open flags.
              </p>
              {s?.trackingSince ? (
                <p className="m-0 mt-[8px] font-sans text-[12.5px] text-[#737373]">
                  Online and request figures are counted by this server since{' '}
                  {clock(s.trackingSince)} (they restart when the server restarts).
                </p>
              ) : null}
            </PublicCard>
            <PublicCard title="Latest events" hint="Audit log, newest first">
              <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
                {feed.slice(0, 10).map((e) => (
                  <li
                    key={docId(e)}
                    className="flex flex-wrap justify-between gap-[8px] font-sans text-[13.5px] leading-[18px]"
                  >
                    <span className="font-semibold text-[#1c2a21]">{humanize(e.action)}</span>
                    <span className="text-[#737373]">
                      {humanize(e.actorType)} · {timeAgo(e.createdAt)}
                    </span>
                  </li>
                ))}
                {feed.length === 0 ? (
                  <li className="font-sans text-[14px] text-[#737373]">
                    Nothing in the last hour.
                  </li>
                ) : null}
              </ul>
              <Link
                to="/admin/audit-log"
                className="mt-[12px] inline-block font-sans text-[14px] font-semibold text-[#387440]"
              >
                Open the audit log →
              </Link>
            </PublicCard>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminLiveOps;
