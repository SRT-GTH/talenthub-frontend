import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import AppealDialog from '../../components/sections/agency/dataRequests/AppealDialog.jsx';
import DataRequestDetail from '../../components/sections/agency/dataRequests/DataRequestDetail.jsx';
import DataRequestsList from '../../components/sections/agency/dataRequests/DataRequestsList.jsx';
import NewRequestDialog from '../../components/sections/agency/dataRequests/NewRequestDialog.jsx';
import { getRequest } from '../../components/sections/agency/dataRequests/data/dataRequestsData.js';
import { useRestoreFocus } from '../../components/sections/agency/dataRequests/useRestoreFocus.js';
import { debug } from '../../utils/debug.js';

const log = debug('AgencyDataRequestsPage');

/*
 * AgencyDataRequestsPage — /agency/data-requests (list, Figma 11.4.3a) · /new (the request form over the list, 11.4.3b) · /:requestId (request page,
 * 11.4.3c–g, dataset view 11.4.3h, appeal 11.4.3i). Privileged data: every request needs a GTH programme manager AND the DPO to approve (mock).
 * URL keys of this package: tab=pending|approved|rejected|all · scope=active|expired · layout=grid|list · sort=oldest (list) · state=pending|approved|
 * rejected|ended|needs-detail · view=dataset · modal=appeal (request page) · from=<requestId> (the form opens prefilled). The shared keys state / modal /
 * view / tab are used as agencyState.js documents them.
 * Real flow: "New request" → form → Send for approval → the new request's page in the Pending state; a rejected request → Start an appeal → dialog.
 * ⚠️ ASSUMPTIONS: unknown request ids still draw the request page (state from ?state, else pending); a sent appeal closes the dialog and is announced to
 * screen readers only (no confirmation is drawn).
 */

const prefillFrom = (request) =>
  request
    ? {
        what: request.title,
        why: 'Plan the 2027 YouthStart budget',
        category: 'Readiness · in your MoU',
        range: 'Oct 2024 – Oct 2026',
        viewers: 'Efua Owusu, Kojo Mensah',
        regions: 'All 16 regions',
      }
    : undefined;

const AgencyDataRequestsPage = () => {
  const data = useAgencyState();
  const { requestId } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const restoreFocus = useRestoreFocus();
  const [announce, setAnnounce] = useState('');
  const isNew = pathname.endsWith('/new');
  const appeal = Boolean(requestId) && data.modal === 'appeal';
  const from = data.params.get('from');
  const { update } = data;

  useEffect(() => {
    log('mount', { pathname, requestId, isNew, appeal });
  }, [pathname, requestId, isNew, appeal]);

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
  const closeAppeal = useCallback(() => {
    update({ modal: null }, { replace: true });
    restoreFocus();
  }, [update, restoreFocus]);
  const appealSent = useCallback(() => {
    setAnnounce('Appeal sent. A different reviewer will look at it.');
    closeAppeal();
  }, [closeAppeal]);
  const withdraw = useCallback(() => {
    log('withdraw');
    setAnnounce('Request withdrawn.');
    closeAppeal();
  }, [closeAppeal]);

  return (
    <AgencyFrame data={data} title="Data requests">
      {requestId ? (
        <DataRequestDetail data={data} requestId={requestId} />
      ) : (
        <DataRequestsList data={data} />
      )}
      {isNew ? (
        <NewRequestDialog
          prefill={from ? prefillFrom(getRequest(from)) : undefined}
          onClose={closeNew}
          onSent={sent}
        />
      ) : null}
      {appeal ? (
        <AppealDialog onClose={closeAppeal} onSent={appealSent} onWithdraw={withdraw} />
      ) : null}
      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>
    </AgencyFrame>
  );
};

export default AgencyDataRequestsPage;
