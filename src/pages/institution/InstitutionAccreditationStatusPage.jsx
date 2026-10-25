import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AgencyChecklistCard from '../../components/sections/agency/home/AgencyChecklistCard.jsx';
import AgencyFeatureCards from '../../components/sections/agency/home/AgencyFeatureCards.jsx';
import AgencyQuickActions from '../../components/sections/agency/home/AgencyQuickActions.jsx';
import InstitutionButton from '../../components/sections/institution/InstitutionButton.jsx';
import InstitutionFrame from '../../components/sections/institution/InstitutionFrame.jsx';
import InstitutionPageHero from '../../components/sections/institution/InstitutionPageHero.jsx';
import { useInstitutionState } from '../../components/sections/institution/institutionState.js';
import { useInstitutionSession } from '../../components/sections/institution/useInstitutionSession.js';
import { GATES } from '../../components/sections/institution/onboarding/data/institutionOnboardingData.js';
import { debug } from '../../utils/debug.js';

const log = debug('InstitutionAccreditationStatusPage');

/*
 * InstitutionAccreditationStatusPage — /institution/accreditation/status (Figma 11.1.2b under review 8589:3478 · c approved 8589:3962 · d needs more info 8589:4444 ·
 * e not approved 8589:4918). The gate of the portal: the status comes from useInstitutionSession() (?verify=under-review | approved | needs-info | not-approved, mock override;
 * no ?verify= = the session's own, approved). Hero (red for "not approved") with the one action of the state · quick actions · "Your verification" checklist (4 checks) ·
 * "Unlocks when you’re verified" / "Now unlocked" cards. All copy is in onboarding/data/institutionOnboardingData.js (GATES). The quick-action / checklist / card pieces are the
 * agency ones (identical Figma components, read-only import).
 * ⚠️ ASSUMPTION: ?verify=none (nothing uploaded yet) is not drawn here: it redirects to the upload page /institution/accreditation.
 * URLs: /institution/accreditation/status?verify=under-review|approved|needs-info|not-approved.
 */

const fill = (text, vars) => text.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

const InstitutionAccreditationStatusPage = () => {
  const data = useInstitutionState();
  const session = useInstitutionSession();
  const status = session.verify.status;

  useEffect(() => {
    log('mount', { status });
  }, [status]);

  if (status === 'none') return <Navigate to="/institution/accreditation" replace />;

  const gate = GATES[status];
  const vars = { first: session.admin.firstName, institution: session.institution.short };
  const danger = gate.tone === 'danger';
  const action = gate.hero.action;

  return (
    <InstitutionFrame data={data} title="Verification status">
      <InstitutionPageHero
        title={fill(gate.hero.title, vars)}
        subtitle={fill(gate.hero.subtitle, vars)}
        actions={
          action.to ? (
            <InstitutionButton to={action.to}>{action.label}</InstitutionButton>
          ) : (
            <InstitutionButton
              onClick={() => {
                log('contact support');
                window.location.href = action.href;
              }}
            >
              {action.label}
            </InstitutionButton>
          )
        }
        className={`[&_h1]:text-[22px] [&_h1]:leading-[28px] ${danger ? '!bg-[#c0392b]' : ''}`}
      />
      <AgencyQuickActions actions={gate.actions} />
      <AgencyChecklistCard {...gate.checklist} headingId="verify-status-checks" />
      <AgencyFeatureCards {...gate.cards} headingId="verify-status-cards" />
    </InstitutionFrame>
  );
};

export default InstitutionAccreditationStatusPage;
