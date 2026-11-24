import { useLocation, useParams } from 'react-router-dom';
import InstitutionFrame from '../../components/sections/institution/InstitutionFrame.jsx';
import { useInstitutionState } from '../../components/sections/institution/institutionState.js';
import CredentialPreviewView from '../../components/sections/institution/credentials/CredentialPreviewView.jsx';
import CredentialsListView from '../../components/sections/institution/credentials/CredentialsListView.jsx';
import InstitutionAggregateOnly from '../../components/sections/institution/aggregate/InstitutionAggregateOnly.jsx';
import { useInstitutionSession } from '../../components/sections/institution/useInstitutionSession.js';
import { debug } from '../../utils/debug.js';

const log = debug('InstitutionCredentialsPage');

/*
 * InstitutionCredentialsPage — Figma canvas 8520:10, 11.2.4a-h (package C). Live: /api/institution/credentials.
 *   /institution/credentials                      issued list 11.2.4a   ?tab=valid|revoked|all|drafts · ?filter=completion|awards · ?sort=oldest|newest
 *   /institution/credentials/new                  issue form 11.2.4b over the list     ?mode=class = bulk issue 11.2.4h
 *   /institution/credentials/new?modal=preview    certificate preview 11.2.4c          ?state=issued = "Credential issued!" 11.2.4d over it
 *   /institution/credentials/:id                  the certificate page of an issued credential   ?modal=revoke 11.2.4e · ?modal=corrected 11.2.4g
 * Components: components/sections/institution/credentials/.
 * Aggregate student data mode (ADR-14): credentials need the named roster, so every route here shows why they are not available
 * (the backend refuses the calls with 403 STUDENT_DATA_AGGREGATE_ONLY; the nav item is hidden).
 */
const InstitutionCredentialsPage = () => {
  const data = useInstitutionState();
  const { credentialId } = useParams();
  const { pathname } = useLocation();
  const isNew = pathname.replace(/\/$/, '').endsWith('/credentials/new');
  const preview = isNew && (data.modal === 'preview' || data.state === 'issued');
  const session = useInstitutionSession();
  log('mount', { credentialId, isNew, modal: data.modal, state: data.state });
  return (
    <InstitutionFrame data={data} title="Credentials">
      {session.studentData.aggregate ? (
        <InstitutionAggregateOnly
          what="credentials"
          school={session.institution.short || session.institution.name}
        />
      ) : credentialId && !isNew ? (
        <CredentialPreviewView data={data} credentialId={credentialId} />
      ) : preview ? (
        <CredentialPreviewView data={data} />
      ) : (
        <CredentialsListView data={data} isNew={isNew} />
      )}
    </InstitutionFrame>
  );
};

export default InstitutionCredentialsPage;
