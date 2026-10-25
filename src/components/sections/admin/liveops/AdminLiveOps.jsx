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
import { useAdminData } from '../useAdminData.js';
import AdminLoadNotice from '../AdminLoadNotice.jsx';
import { docId, humanize, realtime, timeAgo } from '../../../../services/admin.api.js';

const log = debug('AdminLiveOps');

/*
 * AdminLiveOps — /admin/live-ops (Figma 7.3.3a) on GET /api/admin/reports/realtime (Senior and Super Admin): active accounts, sign-ups in the last hour,
 * open moderation flags and audit events in the last hour, plus the last hour's event feed grouped by action. Refreshes every 30 seconds ("Pause updates").
 * The backend doesn't track people online, regions, devices, response times or alerts yet, so those cards say so instead of showing sample data.
 */

const REFRESH_MS = 30000;

const AdminLiveOps = () => {
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  const live = useAdminData(() => realtime(), [tick]);
  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setTick((n) => n + 1), REFRESH_MS);
    return () => clearInterval(id);
  }, [paused]);

  const m = live.data?.metrics ?? {};
  const feed = live.data?.eventFeed ?? [];
  const byAction = Object.entries(
    feed.reduce((acc, e) => ({ ...acc, [e.action]: (acc[e.action] || 0) + 1 }), {}),
  ).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...byAction.map((r) => r[1]));
  const at = live.data?.timestamp ? new Date(live.data.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '';

  return (
    <div className="flex flex-col gap-[30px]">
      <AgencyPageHero
        title="Live ops"
        subtitle={`What’s happening on GTH right now.${at ? ` Updated ${at}${paused ? ' · paused' : ' · every 30 seconds'}.` : ''}`}
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
      {live.error && !live.data ? (
        <AdminLoadNotice error={live.error} status={live.status} onRetry={live.reload} />
      ) : (
        <>
          <KpiStrip
            columns={3}
            hero={
              <HeroMetric
                eyebrow="ACTIVE ACCOUNTS"
                count={Number(m.totalActiveUsers ?? 0)}
                loading={live.loading && !live.data}
                label="accounts with an active status"
                note="People online right now isn’t tracked yet."
              />
            }
          >
            <KpiTile eyebrow="SIGN-UPS" value={String(m.newRegistrationsLastHour ?? '…')} sub="in the last hour" />
            <KpiTile eyebrow="OPEN FLAGS" value={String(m.openModerationFlags ?? '…')} sub={<Link to="/admin/moderation">Open the flag queue</Link>} />
            <KpiTile eyebrow="EVENTS" value={String(m.recentEventCount ?? '…')} sub="audit events in the last hour" />
          </KpiStrip>
          <div className="grid grid-cols-1 gap-[24px] xl:grid-cols-2">
            <PublicCard title="What people are doing" hint="Last hour, by audit event">
              {byAction.length ? (
                <BarList label="What people are doing" gap={10}>
                  {byAction.slice(0, 10).map(([action, count]) => (
                    <BarRow key={action} label={humanize(action)} count={count} ratio={count / max} />
                  ))}
                </BarList>
              ) : (
                <p className="m-0 font-sans text-[14px] text-[#737373]">No events in the last hour.</p>
              )}
            </PublicCard>
            <PublicCard title="Latest events" hint="Newest first">
              <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
                {feed.slice(0, 12).map((e) => (
                  <li key={docId(e)} className="flex flex-wrap justify-between gap-[8px] font-sans text-[13.5px] leading-[18px]">
                    <span className="font-semibold text-[#1c2a21]">{humanize(e.action)}</span>
                    <span className="text-[#737373]">
                      {humanize(e.actorType)} · {timeAgo(e.createdAt)}
                    </span>
                  </li>
                ))}
                {feed.length === 0 ? <li className="font-sans text-[14px] text-[#737373]">Nothing yet.</li> : null}
              </ul>
              <Link to="/admin/audit-log" className="mt-[12px] inline-block font-sans text-[14px] font-semibold text-[#387440]">
                Open the audit log →
              </Link>
            </PublicCard>
          </div>
          <PublicCard title="Not tracked yet" hint="Needs backend work">
            <p className="m-0 font-sans text-[14px] leading-[21px] text-[#595959]">
              People online now, active users by region, devices, response times per service, error rate and alerts aren’t reported by the
              backend yet. They’ll appear here once a monitoring endpoint exists.
            </p>
          </PublicCard>
        </>
      )}
    </div>
  );
};

export default AdminLiveOps;
