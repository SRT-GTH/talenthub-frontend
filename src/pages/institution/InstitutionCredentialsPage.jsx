import { useLocation, useParams } from 'react-router-dom';
import InstitutionFrame from '../../components/sections/institution/InstitutionFrame.jsx';
import { useInstitutionState } from '../../components/sections/institution/institutionState.js';
import CredentialPreviewView from '../../components/sections/institution/credentials/CredentialPreviewView.jsx';
import CredentialsListView from '../../components/sections/institution/credentials/CredentialsListView.jsx';
import { useCredentialsStore } from '../../components/sections/institution/credentials/useCredentialsStore.js';
import { debug } from '../../utils/debug.js';

const log = debug('InstitutionCredentialsPage');

/*
 * InstitutionCredentialsPage — Figma canvas 8520:10, 11.2.4a-h (package C).
 *   /institution/credentials                      issued list 11.2.4a   ?tab=valid|revoked|all|drafts · ?filter=completion|awards · ?view=cards|list · ?sort=oldest|newest
 *   /institution/credentials/new                  issue form 11.2.4b over the list     ?mode=class = bulk issue 11.2.4h
 *   /institution/credentials/new?modal=preview    certificate preview 11.2.4c          ?state=issued = "Credential issued!" 11.2.4d over it
 *   /institution/credentials/:id?modal=revoke     revoke (dual approval) 11.2.4e       ?modal=corrected = corrected copy 11.2.4g · ?state=revoked = 11.2.4f
 *   /institution/credentials/:id                  ⚠️ ASSUMPTION: the certificate page of an issued credential
 * Components: components/sections/institution/credentials/ (mock data in data/credentialsData.js, in-memory store useCredentialsStore.js).
 */
const InstitutionCredentialsPage = () => {
  const data = useInstitutionState();
  const { credentialId } = useParams();
  const { pathname } = useLocation();
  const { credentials } = useCredentialsStore();
  const isNew = pathname.replace(/\/$/, '').endsWith('/credentials/new');
  const credential = credentialId ? credentials.find((c) => c.id === credentialId) : null;
  const overlay = ['revoke', 'corrected'].includes(data.modal) || data.state === 'revoked';
  const showCertificate = isNew
    ? data.modal === 'preview' || data.state === 'issued'
    : credential?.status === 'valid' && !overlay;
  log('mount', { credentialId, isNew, modal: data.modal, state: data.state, showCertificate });
  return (
    <InstitutionFrame data={data} title="Credentials">
      {showCertificate ? (
        <CredentialPreviewView data={data} credential={isNew ? null : credential} />
      ) : (
        <CredentialsListView data={data} credentialId={credentialId} isNew={isNew} />
      )}
    </InstitutionFrame>
  );
};

export default InstitutionCredentialsPage;
