import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AgencyButton from '../../components/sections/agency/AgencyButton.jsx';
import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import AgencyPageHero from '../../components/sections/agency/AgencyPageHero.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import { useAgencySession } from '../../components/sections/agency/useAgencySession.js';
import AgencyChecklistCard from '../../components/sections/agency/home/AgencyChecklistCard.jsx';
import AgencyFeatureCards from '../../components/sections/agency/home/AgencyFeatureCards.jsx';
import AgencyQuickActions from '../../components/sections/agency/home/AgencyQuickActions.jsx';
import { MOU_GATES } from '../../components/sections/agency/onboarding/data/agencyOnboardingData.js';
import { debug } from '../../utils/debug.js';

const log = debug('AgencyMouStatusPage');

/*
 * AgencyMouStatusPage — /agency/mou/status (Figma 11.4.1c pending 8596:1641 · 11.4.1c2 needs more info 8607:2710 · 11.4.1c3 not approved 8607:3192 · 11.4.1d approved 8596:2133).
 * The gate of the portal: the status comes from useAgencySession() (?mou=pending | needs-info | not-approved | approved, mock override; no ?mou= = the session's own, approved).
 * Hero (red for "not approved") with the one action of the state · quick actions · "Your verification" checklist (4 checks) · "Unlocks when you’re verified" /
 * "Now unlocked" cards. All copy is in data/agencyOnboardingData.js (MOU_GATES).
 * ⚠️ ASSUMPTION: ?mou=none (no MoU uploaded yet) is not drawn here: it redirects to the upload page /agency/mou.
 * URLs: /agency/mou/status?mou=pending|needs-info|not-approved|approved.
 */

const fill = (text, vars) => text.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

const AgencyMouStatusPage = () => {
  const data = useAgencyState();
  const session = useAgencySession();
  const status = session.mou.status;

  useEffect(() => {
    log('mount', { status });
  }, [status]);

  if (status === 'none') return <Navigate to="/agency/mou" replace />;

  const gate = MOU_GATES[status];
  const vars = { first: session.analyst.firstName, agency: session.agency.name };
  const danger = gate.tone === 'danger';

  return (
    <AgencyFrame data={data} title="MoU status">
      <AgencyPageHero
        title={fill(gate.hero.title, vars)}
        subtitle={fill(gate.hero.subtitle, vars)}
        actions={<AgencyButton to={gate.hero.action.to}>{gate.hero.action.label}</AgencyButton>}
        className={`[&_h1]:text-[22px] [&_h1]:leading-[28px] ${danger ? '!bg-[#c0392b]' : ''}`}
      />
      <AgencyQuickActions actions={gate.actions} />
      <AgencyChecklistCard {...gate.checklist} headingId="mou-status-checks" />
      <AgencyFeatureCards {...gate.cards} headingId="mou-status-cards" />
    </AgencyFrame>
  );
};

export default AgencyMouStatusPage;
