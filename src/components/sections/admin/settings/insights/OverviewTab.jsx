import AdminLoadNotice from '../../AdminLoadNotice.jsx';
import { useAdminData } from '../../useAdminData.js';
import { insightsOverview } from '../../../../../services/admin.api.js';
import { Chip } from '../refdata/shared.jsx';
import { fmt, roleLabel, when } from './insightsFormat.js';
import { Card, GoLink, Kpi, Kpis } from './insightsUi.jsx';

/*
 * OverviewTab — Settings › Overview (Senior and Super Admin): one card per settings area with its live figures,
 * from GET /api/admin/insights/overview, each linking to the screen where it is managed.
 */

const OverviewTab = () => {
  const q = useAdminData(() => insightsOverview(), []);
  const s = q.data;
  const loc = s?.reference.locations || {};

  return (
    <AdminLoadNotice loading={q.loading} error={q.error} status={q.status} onRetry={q.reload}>
      {s ? (
        <>
          <Card
            title="Staff"
            sub={Object.entries(s.staff.byType)
              .map(([t, n]) => `${fmt(n)} ${roleLabel(t)}`)
              .join(' · ')}
            action={<GoLink to="/admin/settings/staff">Staff accounts</GoLink>}
          >
            <Kpis>
              <Kpi
                label="Active staff"
                value={fmt(s.staff.active)}
                hint={`${fmt(s.staff.inactive)} deactivated`}
              />
              <Kpi
                label="Dormant"
                value={fmt(s.staff.dormant)}
                hint={`${fmt(s.staff.neverSignedIn)} never signed in`}
                tone={s.staff.dormant ? 'warn' : undefined}
              />
              <Kpi label="Roles" value={fmt(s.roles)} hint="Across all account types" />
            </Kpis>
          </Card>

          <div className="grid grid-cols-2 gap-[20px] max-lg:grid-cols-1">
            <Card
              title="Security"
              sub="Failed sign-ins from the audit log."
              action={<GoLink to="/admin/settings/security">Security</GoLink>}
            >
              <Kpis>
                <Kpi label="Last 24 hours" value={fmt(s.signIns.failed24h)} />
                <Kpi label="Last 7 days" value={fmt(s.signIns.failed7d)} />
              </Kpis>
            </Card>
            <Card
              title="Platform settings"
              sub={
                s.lastSettingChange
                  ? `Last change: ${s.lastSettingChange.key} on ${when(s.lastSettingChange.at)}${
                      s.lastSettingChange.by ? ` by ${s.lastSettingChange.by}` : ''
                    }${s.lastSettingChange.reason ? ` (“${s.lastSettingChange.reason}”)` : ''}`
                  : 'No setting has been changed yet.'
              }
              action={<GoLink to="/admin/settings">Platform settings</GoLink>}
            >
              <Kpis>
                <Kpi
                  label="Feature flags on"
                  value={`${fmt(s.flags.on)} of ${fmt(s.flags.total)}`}
                />
              </Kpis>
            </Card>
          </div>

          <Card
            title="Reference data"
            sub="Lists other features read."
            action={<GoLink to="/admin/settings/reference">Reference data</GoLink>}
          >
            <Kpis>
              <Kpi
                label="Currencies in use"
                value={fmt(s.reference.currencies.active)}
                hint={`of ${fmt(s.reference.currencies.total)}`}
              />
              <Kpi
                label="Places"
                value={fmt(Object.values(loc).reduce((a, b) => a + b, 0))}
                hint={['region', 'district', 'city']
                  .filter((t) => loc[t])
                  .map((t) => `${fmt(loc[t])} ${t === 'city' ? 'towns' : `${t}s`}`)
                  .join(' · ')}
              />
              <Kpi label="Opportunity categories" value={fmt(s.reference.categories)} />
              <Kpi label="Assessment templates" value={fmt(s.reference.assessmentTemplates)} />
            </Kpis>
          </Card>

          <div className="grid grid-cols-2 gap-[20px] max-lg:grid-cols-1">
            <Card
              title="Organisations and tenants"
              action={<GoLink to="/admin/settings/organisations">Organisations</GoLink>}
            >
              <Kpis>
                <Kpi label="Organisations" value={fmt(s.organisations)} />
              </Kpis>
            </Card>
            <Card
              title="System notifications"
              action={<GoLink to="/admin/settings/notifications">System notifications</GoLink>}
            >
              <Kpis>
                <Kpi label="Templates" value={fmt(s.templates)} />
              </Kpis>
            </Card>
          </div>
          <p className="m-0 flex items-center gap-[8px] font-sans text-[12px] text-[#737373]">
            <Chip>Live</Chip> Updated {when(s.generatedAt)}.
          </p>
        </>
      ) : null}
    </AdminLoadNotice>
  );
};

export default OverviewTab;
