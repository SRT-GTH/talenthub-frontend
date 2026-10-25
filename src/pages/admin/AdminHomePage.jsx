import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AgencyButton from '../../components/sections/agency/AgencyButton.jsx';
import AgencyPageHero from '../../components/sections/agency/AgencyPageHero.jsx';
import AgencyQuickActions from '../../components/sections/agency/home/AgencyQuickActions.jsx';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import { useAdminSession } from '../../components/sections/admin/useAdminSession.js';
import { HOME } from '../../components/sections/admin/data/adminHomeData.js';
import AdminPaginationBar from '../../components/sections/admin/home/AdminPaginationBar.jsx';
import AdminHealthCards from '../../components/sections/admin/home/AdminHealthCards.jsx';
import AdminNextStepCard from '../../components/sections/admin/home/AdminNextStepCard.jsx';
import AdminSnapshotCard from '../../components/sections/admin/home/AdminSnapshotCard.jsx';
import AdminStatsCard from '../../components/sections/admin/home/AdminStatsCard.jsx';
import AdminWorkTable from '../../components/sections/admin/home/AdminWorkTable.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('AdminHomePage');

/*
 * AdminHomePage — /admin (Figma 7.0.2a-e: Senior Admin 8623:9, Support Agent 8665:10792, Content Moderator 8665:11496, Super Admin 8665:12200,
 * Data Protection Officer 8665:12904). One structure for all five roles (hero · quick actions · snapshot · stats + next step · work table +
 * pagination · team health cards); the role (?role=senior|support|moderator|super|dpo, see useAdminSession) only changes the content.
 * ⚠️ ASSUMPTION: Figma draws the home at desktop width only; below xl the blocks wrap like the agency home. The hero "Customise" button has no
 * destination drawn: it logs the intent only. Quick-action and snapshot destinations are the admin sections the labels name.
 */

const INK = { '#ebf1ec': '#2d5d33', '#eaeffb': '#244a9f', '#f5f3ff': '#6d28d9' };

const TARGETS = {
  senior: [
    '/admin/moderation',
    '/admin/accounts',
    '/admin/verification',
    '/admin/verification?view=approvals',
  ],
  support: [
    '/admin/accounts',
    '/admin/comms/message',
    '/admin/reports',
    '/admin/support?modal=escalate',
  ],
  moderator: [
    '/admin/moderation',
    '/admin/moderation/posts',
    '/admin/moderation/removed',
    '/admin/moderation?modal=escalate',
  ],
  super: [
    '/admin/verification?view=approvals',
    '/admin/settings/staff',
    '/admin/verification',
    '/admin/audit-log',
  ],
  dpo: [
    '/admin/verification/data-requests',
    '/admin/reports?view=exports',
    '/admin/reports?view=exports',
    '/admin/audit-log',
  ],
};

const SNAPSHOT_TO = {
  senior: '/admin/live-ops',
  support: '/admin/accounts',
  moderator: '/admin/moderation',
  super: '/admin/live-ops',
  dpo: '/admin/audit-log',
};

const HEALTH_ICONS = ['eye', 'shield', 'sparkle'];

const rowTarget = (role, row) => {
  const t = row.title.toLowerCase();
  if (t.startsWith('flag') || t.includes('hate') || t.includes('spam') || t.includes('fake'))
    return '/admin/moderation';
  if (t.startsWith('kyb') || t.includes('access') || t.includes('export'))
    return '/admin/verification';
  if (t.startsWith('merge')) return '/admin/accounts/merge';
  if (t.startsWith('suspension') || t.startsWith('delete')) return '/admin/accounts';
  return SNAPSHOT_TO[role];
};

const AdminHomePage = () => {
  const data = useAdminState();
  const session = useAdminSession();
  const navigate = useNavigate();
  const { role, staff } = session;
  const home = HOME[role];

  useEffect(() => {
    log('mount', { role, rows: home.rows.length });
  }, [role, home.rows.length]);

  const actions = home.actions.map((a, i) => ({
    ...a,
    ink: INK[a.tint],
    to: TARGETS[role][i],
  }));
  const cards = home.health.cards.map((c, i) => ({
    id: `${role}-${i}`,
    icon: HEALTH_ICONS[i],
    badge: c.badge,
    title: c.title,
    text: c.text,
    progressLabel: `${c.pct}%`,
    fillPct: c.pct,
    foot: c.foot,
  }));

  return (
    <AdminFrame data={data} title="Home">
      <AgencyPageHero
        title={home.hero.title}
        subtitle={home.hero.sub}
        actions={
          <AgencyButton onClick={() => log('customise (no destination drawn)', staff.id)}>
            {home.hero.button}
          </AgencyButton>
        }
      />
      <AgencyQuickActions actions={actions} />
      <AdminSnapshotCard snapshot={home.snapshot} to={SNAPSHOT_TO[role]} />
      <div className="grid gap-[24px] xl:grid-cols-[minmax(0,878fr)_minmax(0,427fr)]">
        <AdminStatsCard stats={home.stats} />
        <AdminNextStepCard next={home.next} />
      </div>
      <div className="flex flex-col gap-[8px]">
        <AdminWorkTable
          rows={home.rows}
          label="Your work queue"
          onOpen={(row) => navigate(rowTarget(role, row))}
        />
        <AdminPaginationBar summary={home.pagination} />
      </div>
      <AdminHealthCards
        title={home.health.title}
        subtitle={home.health.subtitle}
        cards={cards}
        dashed
        headingId="admin-home-health"
      />
    </AdminFrame>
  );
};

export default AdminHomePage;
