import { useParams } from 'react-router-dom';
import CredentialVerifyView from '../../components/sections/institution/credentials/CredentialVerifyView.jsx';
import PublicDataFrame from '../../components/sections/publicData/PublicDataFrame.jsx';
import { usePublicDataState } from '../../components/sections/publicData/publicDataState.js';
import PublicDataModals from '../../components/sections/publicData/share/PublicDataModals.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('InstitutionVerifyPage');

/*
 * InstitutionVerifyPage — the PUBLIC "Verify a credential" page, Figma 11.2.4i (valid) and 11.2.4j (revoked); no institution chrome: it wears the Theme 8 public chrome ("Directory").
 * /institution/verify/:credentialId  ?state=valid|revoked (see CredentialVerifyView for how the record is chosen). Share and Download PDF in the top bar open the Theme 8 dialogs.
 */
const InstitutionVerifyPage = () => {
  const { credentialId } = useParams();
  const data = usePublicDataState();
  log('mount', { credentialId, state: data.state });
  return (
    <PublicDataFrame data={data} title="Directory" active="directory">
      <CredentialVerifyView credentialId={credentialId} state={data.state} />
      <PublicDataModals
        data={data}
        scope={{ title: 'Verify a credential', reportKind: 'overview', sharePath: 'verify' }}
      />
    </PublicDataFrame>
  );
};

export default InstitutionVerifyPage;
