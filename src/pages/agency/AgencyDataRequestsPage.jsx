import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import DataRequestDetail from '../../components/sections/agency/dataRequests/DataRequestDetail.jsx';
import DataRequestsList from '../../components/sections/agency/dataRequests/DataRequestsList.jsx';
import NewRequestDialog from '../../components/sections/agency/dataRequests/NewRequestDialog.jsx';
import { useRestoreFocus } from '../../components/sections/agency/dataRequests/useRestoreFocus.js';
import { debug } from '../../utils/debug.js';

const log = debug('AgencyDataRequestsPage');

/*
 * AgencyDataRequestsPage — /agency/data-requests (list, Figma 11.4.3a) · /new (the request form over the list, 11.4.3b) · /:requestId (request page,
 * 11.4.3c–g, dataset view 11.4.3h, dialogs 11.4.3i). Live data: GET/POST /agency/data-requests. Every request needs a GTH programme manager AND
 * the DPO to approve. URL keys: tab=pending|approved|rejected|all · scope=active|expired · layout=grid|list · sort=oldest (list) · view=dataset ·
 * modal=appeal|detail|extend|view (request page).
 */

const AgencyDataRequestsPage = () => {
  const data = useAgencyState();
  const { requestId } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const restoreFocus = useRestoreFocus();
  const [announce, setAnnounce] = useState('');
  const isNew = pathname.endsWith('/new');

  useEffect(() => {
    log('mount', { pathname, requestId, isNew });
  }, [pathname, requestId, isNew]);

  const closeNew = useCallback(() => {
    log('close new');
    navigate('/agency/data-requests');
    restoreFocus();
  }, [navigate, restoreFocus]);
  const sent = useCallback(
    (request) => {
      log('request sent', request.id);
      setAnnounce(`Request sent for approval: ${request.title}.`);
      navigate(`/agency/data-requests/${request.id}`);
    },
    [navigate]
  );

  return (
    <AgencyFrame data={data} title="Data requests">
      {requestId && !isNew ? (
        <DataRequestDetail data={data} requestId={requestId} onAnnounce={setAnnounce} />
      ) : (
        <DataRequestsList data={data} />
      )}
      {isNew ? <NewRequestDialog onClose={closeNew} onSent={sent} /> : null}
      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>
    </AgencyFrame>
  );
};

export default AgencyDataRequestsPage;
