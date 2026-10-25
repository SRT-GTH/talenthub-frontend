import { useParams } from 'react-router-dom';
import InstitutionFrame from '../../components/sections/institution/InstitutionFrame.jsx';
import { useInstitutionState } from '../../components/sections/institution/institutionState.js';
import RecordDetailView from '../../components/sections/institution/records/RecordDetailView.jsx';
import RecordsQueueView from '../../components/sections/institution/records/RecordsQueueView.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('InstitutionRecordsPage');

/*
 * InstitutionRecordsPage — Figma canvas 8520:10, 11.2.3a-f (package C).
 *   /institution/records                 queue 11.2.3a   ?tab=approved|rejected|all · ?filter=results|certificates · ?view=cards|list · ?sort=oldest|newest
 *                                        ?modal=bulk-approve 11.2.3e · ?state=caught-up 11.2.3f
 *   /institution/records/:recordId       detail 11.2.3b  ?modal=approve 11.2.3c · ?modal=reject 11.2.3d
 * Components: components/sections/institution/records/ (mock data in data/recordsData.js, in-memory store useRecordsStore.js).
 */
const InstitutionRecordsPage = () => {
  const data = useInstitutionState();
  const { recordId } = useParams();
  log('mount', { recordId, modal: data.modal, state: data.state });
  return (
    <InstitutionFrame data={data} title="Records">
      {recordId ? (
        <RecordDetailView data={data} recordId={recordId} />
      ) : (
        <RecordsQueueView data={data} />
      )}
    </InstitutionFrame>
  );
};

export default InstitutionRecordsPage;
