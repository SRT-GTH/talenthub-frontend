import { useLocation, useParams } from 'react-router-dom';
import InstitutionFrame from '../../components/sections/institution/InstitutionFrame.jsx';
import { useInstitutionState } from '../../components/sections/institution/institutionState.js';
import CredentialPreviewView from '../../components/sections/institution/credentials/CredentialPreviewView.jsx';
import CredentialsListView from '../../components/sections/institution/credentials/CredentialsListView.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('InstitutionCredentialsPage');

/*
 * InstitutionCredentialsPage — Figma canvas 8520:10, 11.2.4a-h (package C). Live: /api/institution/credentials.
 *   /institution/credentials                      issued list 11.2.4a   ?tab=valid|revoked|all|drafts · ?filter=completion|awards · ?sort=oldest|newest
 *   /institution/credentials/new                  issue form 11.2.4b over the list     ?mode=class = bulk issue 11.2.4h
 *   /institution/credentials/new?modal=preview    certificate preview 11.2.4c          ?state=issued = "Credential issued!" 11.2.4d over it
 *   /institution/credentials/:id                  the certificate page of an issued credential   ?modal=revoke 11.2.4e · ?modal=corrected 11.2.4g
 * Components: components/sections/institution/credentials/.
 */
const InstitutionCredentialsPage = () => {
  const data = useInstitutionState();
  const { credentialId } = useParams();
  const { pathname } = useLocation();
  const isNew = pathname.replace(/\/$/, '').endsWith('/credentials/new');
  const preview = isNew && (data.modal === 'preview' || data.state === 'issued');
  log('mount', { credentialId, isNew, modal: data.modal, state: data.state });
  return (
    <InstitutionFrame data={data} title="Credentials">
      {credentialId && !isNew ? (
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
