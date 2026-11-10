import { useEffect, useState } from 'react';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import { useAdminSession } from '../../components/sections/admin/useAdminSession.js';
import { useAdminData } from '../../components/sections/admin/useAdminData.js';
import AdminLoadNotice from '../../components/sections/admin/AdminLoadNotice.jsx';
import { BillingTable, Tabs } from '../../components/sections/admin/billing/AdminBillingParts.jsx';
import AgencyButton from '../../components/sections/agency/AgencyButton.jsx';
import AgencyPageHero from '../../components/sections/agency/AgencyPageHero.jsx';
import KpiStrip from '../../components/sections/publicData/ui/KpiStrip.jsx';
import KpiTile from '../../components/sections/publicData/ui/KpiTile.jsx';
import PublicCard from '../../components/sections/publicData/ui/PublicCard.jsx';
import { TextInput } from '../../components/ui/form';
import {
  aiMeteringEnabled,
  formatUsd,
  getUsageReport,
  isoDay,
  lastDays,
  modelLabel,
  roleLabel,
} from '../../services/usage.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('AdminAiUsagePage');

/*
 * AdminAiUsagePage — /admin/ai-usage (Super Admin only). What Career Buddy and Recruiter Buddy cost, from the AI metering
 * service (backend services/usage.service.js, GET /api/usage/report): calls, failed calls, weighted turns, active users,
 * billed cost and shadow cost (what the call would cost on a paid model; Kasada is billed 0), compute credits
 * (1 credit = US$0.001 of shadow cost), per model and per role, and how many user-days WOULD have hit a cap. Caps are
 * dark-launched: nothing is enforced. Needs AI_METERING=1 on the backend and VITE_AI_METERING=1 in this build.
 * URL states: ?range=today|7d|30d (default 7d) · ?from=YYYY-MM-DD&to=YYYY-MM-DD (custom).
 */

const RANGES = [
  { id: 'today', label: 'Today', days: 1 },
  { id: '7d', label: 'Last 7 days', days: 7 },
  { id: '30d', label: 'Last 30 days', days: 30 },
];
const DAY = /^\d{4}-\d{2}-\d{2}$/;

const Restricted = ({ data, message }) => (
  <AdminFrame data={data} title="AI usage">
    <AdminLoadNotice error={message} status={403} />
  </AdminFrame>
);

const AdminAiUsagePage = () => {
  const data = useAdminState();
  const { role } = useAdminSession();
  const qFrom = data.params.get('from');
  const qTo = data.params.get('to');
  const custom = DAY.test(qFrom || '') && DAY.test(qTo || '');
  const range = custom
    ? 'custom'
    : RANGES.find((r) => r.id === data.params.get('range'))?.id || '7d';
  const period = custom
    ? { from: qFrom, to: qTo }
    : lastDays(RANGES.find((r) => r.id === range).days);
  const [picking, setPicking] = useState(custom);
  const [draft, setDraft] = useState({ from: qFrom || period.from, to: qTo || period.to });
  const allowed = role === 'super' && aiMeteringEnabled();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => log('mount', { role, range, ...period }), [role, range, period.from, period.to]);

  const report = useAdminData(
    () => (allowed ? getUsageReport(period) : Promise.resolve(null)),
    [allowed, period.from, period.to]
  );

  if (!aiMeteringEnabled()) {
    return (
      <Restricted
        data={data}
        message="AI metering is switched off in this build (VITE_AI_METERING)."
      />
    );
  }
  if (role !== 'super') {
    return <Restricted data={data} message="AI usage is for Super Admins." />;
  }

  const r = report.data;
  const failedPct = r && r.calls ? `${((r.failedCalls / r.calls) * 100).toFixed(1)}%` : '0%';
  const models = [...(r?.byModel || [])].sort((a, b) => b.shadowCostUsd - a.shadowCostUsd);
  const roles = [...(r?.byRole || [])].sort((a, b) => b.turns - a.turns);
  const anyEstimated = models.some((m) => m.estimatedPrice);
  const periodText = period.from === period.to ? period.from : `${period.from} to ${period.to}`;

  return (
    <AdminFrame data={data} title="AI usage">
      <div className="flex min-w-0 flex-col gap-[24px]">
        <AgencyPageHero
          title="AI usage"
          subtitle={`What Career Buddy and Recruiter Buddy used and cost · ${periodText} (Accra time).`}
          actions={<AgencyButton onClick={report.reload}>Refresh</AgencyButton>}
        />

        <Tabs
          label="Period"
          value={picking ? 'custom' : range}
          options={[...RANGES, { id: 'custom', label: custom ? periodText : 'Custom' }]}
          onChange={(id) => {
            if (id === 'custom') {
              setPicking(true);
              return;
            }
            setPicking(false);
            data.update({ range: id === '7d' ? null : id, from: null, to: null });
          }}
        />
        {picking ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.from || !draft.to || draft.to < draft.from) return;
              data.update({ range: null, from: draft.from, to: draft.to });
            }}
            className="flex flex-wrap items-end gap-[12px] rounded-[20px] border border-solid border-[#e1eae2] bg-white p-[16px]"
          >
            <TextInput
              label="From"
              type="date"
              required
              max={isoDay(new Date())}
              value={draft.from}
              onChange={(e) => setDraft((d) => ({ ...d, from: e.target.value }))}
            />
            <TextInput
              label="To"
              type="date"
              required
              max={isoDay(new Date())}
              value={draft.to}
              onChange={(e) => setDraft((d) => ({ ...d, to: e.target.value }))}
            />
            <button
              type="submit"
              disabled={!draft.from || !draft.to || draft.to < draft.from}
              className="h-[46px] cursor-pointer rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[15px] font-bold text-white disabled:opacity-55"
            >
              Apply
            </button>
          </form>
        ) : null}

        <div className="rounded-[20px] border border-solid border-[#e1eae2] bg-[#f4f8f4] px-[18px] py-[12px] font-sans text-[14px] leading-[21px] text-[#1c2a21]">
          Caps are <strong>not enforced</strong> yet: the “would” figures show what they would do.
          Shadow cost is what each call would cost on a paid model (the Kasada pilot is billed
          nothing); credits are 1 per US$0.001 of shadow cost.
        </div>

        {report.loading || report.error ? (
          <AdminLoadNotice
            loading={report.loading}
            error={report.error}
            status={report.status}
            onRetry={report.reload}
          />
        ) : r ? (
          <>
            <KpiStrip columns={4}>
              <KpiTile
                eyebrow="Model calls"
                value={r.calls.toLocaleString('en-GB')}
                sub={`${failedPct} failed`}
              />
              <KpiTile
                eyebrow="Turns (weighted)"
                eyebrowShort="Turns"
                value={Number(r.turns).toLocaleString('en-GB', { maximumFractionDigits: 1 })}
                sub={`${r.activeUsers.toLocaleString('en-GB')} people used the buddies`}
                subShort={`${r.activeUsers} people`}
              />
              <KpiTile
                eyebrow="Cost (billed)"
                eyebrowShort="Billed"
                value={formatUsd(r.costUsd)}
                sub={`Shadow ${formatUsd(r.shadowCostUsd)}`}
              />
              <KpiTile
                eyebrow="Compute credits"
                eyebrowShort="Credits"
                value={Number(r.credits).toLocaleString('en-GB', { maximumFractionDigits: 1 })}
                sub={`Would warn ${r.userDaysWouldWarn} · would slow ${r.userDaysWouldDegrade} user-days`}
                subShort={`Warn ${r.userDaysWouldWarn} · slow ${r.userDaysWouldDegrade}`}
              />
            </KpiStrip>

            <PublicCard
              title="By model"
              hint={anyEstimated ? 'Some prices are estimates' : 'Prices verified'}
            >
              {models.length === 0 ? (
                <p className="m-0 font-sans text-[14px] text-[#737373]">No calls in this period.</p>
              ) : (
                <BillingTable
                  label="Usage by model"
                  columns={['Model', 'Calls', 'Billed', 'Shadow cost']}
                  numeric={[1, 2, 3]}
                  rows={models.map((m) => ({
                    id: m.model || 'none',
                    cells: [
                      <span key="m" className="flex flex-wrap items-center gap-[8px]">
                        <span className="font-semibold">{modelLabel(m.model)}</span>
                        {m.estimatedPrice ? (
                          <span className="rounded-full bg-[#faf4e8] px-[8px] py-[1px] text-[11.5px] font-semibold text-[#8a6512]">
                            estimated price
                          </span>
                        ) : null}
                      </span>,
                      m.calls.toLocaleString('en-GB'),
                      formatUsd(m.costUsd),
                      formatUsd(m.shadowCostUsd),
                    ],
                  }))}
                />
              )}
            </PublicCard>

            <PublicCard title="By role" hint="Turns are weighted by what was asked">
              {roles.length === 0 ? (
                <p className="m-0 font-sans text-[14px] text-[#737373]">
                  No signed-in usage in this period.
                </p>
              ) : (
                <BillingTable
                  label="Usage by role"
                  columns={['Role', 'People', 'Turns', 'Shadow cost']}
                  numeric={[1, 2, 3]}
                  rows={roles.map((x) => ({
                    id: x.role || 'none',
                    cells: [
                      <span key="r" className="font-semibold">
                        {roleLabel(x.role)}
                      </span>,
                      x.users.toLocaleString('en-GB'),
                      Number(x.turns).toLocaleString('en-GB', { maximumFractionDigits: 1 }),
                      formatUsd(x.shadowCostUsd),
                    ],
                  }))}
                />
              )}
            </PublicCard>
          </>
        ) : null}
      </div>
    </AdminFrame>
  );
};

export default AdminAiUsagePage;
