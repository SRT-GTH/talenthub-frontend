import AdminLoadNotice from '../../AdminLoadNotice.jsx';
import { useAdminData } from '../../useAdminData.js';
import { insightsSecurity } from '../../../../../services/admin.api.js';
import { Chip, Note } from '../refdata/shared.jsx';
import { fmt, roleLabel, when } from './insightsFormat.js';
import { Bars, Card, GoLink, Kpi, Kpis, Table } from './insightsUi.jsx';

/*
 * SecurityTab — Settings › Security (Senior and Super Admin), read only, from GET /api/admin/insights/security:
 * sign-in and session rules (edited in Platform settings by Super Admins), failed sign-ins from the audit log
 * (by reason, by day, accounts with repeated failures — emails masked), SMS code delivery, staff last sign-in.
 */

const DayChart = ({ days }) => {
  const max = Math.max(1, ...days.map((d) => d.failed + d.succeeded));
  return (
    <div>
      <div
        className="flex h-[120px] items-end gap-[4px]"
        role="img"
        aria-label={`Sign-ins per day for the last ${days.length} days: ${days
          .map((d) => `${d.day} ${d.succeeded} succeeded, ${d.failed} failed`)
          .join('; ')}`}
      >
        {days.map((d) => (
          <div
            key={d.day}
            className="flex h-full min-w-0 flex-1 flex-col justify-end"
            title={`${d.day}: ${d.succeeded} succeeded, ${d.failed} failed`}
          >
            <span
              className="block rounded-t-[3px] bg-[#c0392b]"
              style={{ height: `${(d.failed / max) * 100}%` }}
            />
            <span
              className="block bg-[#9cc3a2]"
              style={{ height: `${(d.succeeded / max) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-[6px] flex justify-between font-sans text-[12px] text-[#737373]">
        <span>{days[0]?.day}</span>
        <span className="flex gap-[12px]">
          <span>
            <span className="mr-[4px] inline-block size-[10px] rounded-[2px] bg-[#9cc3a2]" />
            Succeeded
          </span>
          <span>
            <span className="mr-[4px] inline-block size-[10px] rounded-[2px] bg-[#c0392b]" />
            Failed
          </span>
        </span>
        <span>{days[days.length - 1]?.day}</span>
      </div>
    </div>
  );
};

const SecurityTab = ({ session }) => {
  const q = useAdminData(() => insightsSecurity(), []);
  const s = q.data;
  const canEdit = session?.role === 'super';

  return (
    <AdminLoadNotice loading={q.loading} error={q.error} status={q.status} onRetry={q.reload}>
      {s ? (
        <>
          <Card
            title="Sign-in and session rules"
            sub="The limits the platform applies to every account."
            action={
              canEdit ? (
                <GoLink to="/admin/settings#operational">Change in Platform settings</GoLink>
              ) : null
            }
          >
            <Table
              head={['Rule', 'Value', 'Last changed']}
              rows={s.rules.map((r) => [
                r.label,
                r.missing ? (
                  <Chip tone="warn">Not set</Chip>
                ) : (
                  <span className="font-semibold">
                    {fmt(r.value)} {r.unit}
                  </span>
                ),
                <span className="text-[#595959]">{r.updatedAt ? when(r.updatedAt) : '–'}</span>,
              ])}
              empty="No rules found."
            />
            {!canEdit ? (
              <p className="m-0 font-sans text-[13px] text-[#737373]">
                Super Admins change these in Platform settings.
              </p>
            ) : null}
          </Card>

          <Card
            title={`Sign-ins, last ${s.days} days`}
            sub="From the audit log: every failed and successful sign-in."
            action={
              <GoLink to="/admin/audit-log?tab=logins&q=LOGIN_FAILED">Open in audit log</GoLink>
            }
          >
            <Kpis>
              <Kpi label="Failed" value={fmt(s.signIns.failed)} />
              <Kpi label="Succeeded" value={fmt(s.signIns.succeeded)} />
              <Kpi
                label="Failure rate"
                value={`${Math.round(s.signIns.failureRate * 100)}%`}
                tone={s.signIns.failureRate > 0.3 ? 'warn' : undefined}
              />
              <Kpi label="Failed, last 24 hours" value={fmt(s.signIns.failed24h)} />
            </Kpis>
            <DayChart days={s.signIns.byDay} />
            <h3 className="m-0 font-sans text-[15px] font-semibold text-[#1c2a21]">
              Why they failed
            </h3>
            <Bars
              rows={s.signIns.byReason.map((r) => ({ label: r.label, count: r.count }))}
              total={s.signIns.failed}
              empty="No failed sign-ins in this period."
            />
          </Card>

          <Card
            title="Repeated failures, last 7 days"
            sub={`Email addresses with ${s.signIns.repeatThreshold} or more failed sign-ins. Addresses are masked; ${fmt(
              s.signIns.distinctIps7d
            )} different networks tried in this period.`}
          >
            <Table
              head={['Account', 'Failures', 'Why', 'Networks', 'Account exists', 'Last try']}
              rows={s.signIns.repeated.map((r) => [
                <span className="font-mono text-[13px]">{r.account}</span>,
                <span className="font-semibold">{fmt(r.failures)}</span>,
                r.reasons.join(', '),
                fmt(r.ips),
                r.exists ? (
                  <Chip tone="warn">Yes · {roleLabel(r.accountType)}</Chip>
                ) : (
                  <Chip>No</Chip>
                ),
                <span className="whitespace-nowrap text-[#595959]">{when(r.lastAt)}</span>,
              ])}
              empty="No account had repeated failures this week."
            />
          </Card>

          <Card title="Sign-in codes by SMS, last 7 days">
            <Kpis>
              <Kpi label="Codes sent" value={fmt(s.codes.sent7d)} />
              <Kpi
                label="SMS that failed to send"
                value={fmt(s.codes.smsFailed7d)}
                tone={s.codes.smsFailed7d ? 'warn' : undefined}
              />
            </Kpis>
            {s.codes.smsFailed7d ? (
              <Note tone="warn">
                Some codes did not reach people by SMS. Check the SMS provider in{' '}
                <GoLink to="/admin/observability">Observability</GoLink>
              </Note>
            ) : null}
          </Card>

          <Card
            title="Staff sign-ins"
            sub={`Dormant: active staff with no sign-in for ${s.dormantDays} days, or never signed in after two weeks.`}
            action={<GoLink to="/admin/settings/staff">Manage staff</GoLink>}
          >
            <Table
              head={['Staff', 'Role', 'Status', 'Last sign-in', 'Sign-ins']}
              rows={s.staff.map((m) => [
                <span className="break-all">{m.email || m.id}</span>,
                roleLabel(m.type),
                <span className="flex flex-wrap gap-[6px]">
                  <Chip tone={m.status === 'active' ? 'good' : undefined}>{m.status}</Chip>
                  {m.dormant ? <Chip tone="warn">Dormant</Chip> : null}
                </span>,
                <span className="whitespace-nowrap text-[#595959]">{when(m.lastSignInAt)}</span>,
                fmt(m.sessions),
              ])}
              empty="No staff accounts."
            />
          </Card>
          <p className="m-0 font-sans text-[12px] text-[#737373]">Updated {when(s.generatedAt)}.</p>
        </>
      ) : null}
    </AdminLoadNotice>
  );
};

export default SecurityTab;
