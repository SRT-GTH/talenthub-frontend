import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { agencyDataRequest } from '../../../../services/agency.api.js';
import { debug } from '../../../../utils/debug.js';
import AgencyButton from '../AgencyButton.jsx';
import { useAgencyResource } from '../useAgencyResource.js';
import AppealDialog from './AppealDialog.jsx';
import RequestAccessCards from './RequestAccessCards.jsx';
import RequestApprovalSteps from './RequestApprovalSteps.jsx';
import RequestDatasetView from './RequestDatasetView.jsx';
import RequestHero from './RequestHero.jsx';
import RequestQuickActions from './RequestQuickActions.jsx';
import RequestTextDialog from './RequestTextDialog.jsx';
import { SUPPORT_EMAIL, buildDetail } from './data/dataRequestsData.js';
import { useAccessCountdown } from './useAccessCountdown.js';

const log = debug('DataRequestDetail');

/*
 * DataRequestDetail — /agency/data-requests/:requestId (Figma 11.4.3c–g, i; 11.4.3h with ?view=dataset), drawn from GET /agency/data-requests/:id.
 * The state is the request's own status (pending · approved · rejected · ended · needs-detail · withdrawn); approved shows the live countdown to
 * accessEndsAt. ?view=dataset opens the approved dataset; ?modal=appeal | detail | extend | view open the dialogs.
 * Actions: Open dataset → ?view=dataset · Start an appeal → ?modal=appeal · Add detail → ?modal=detail · Ask to extend → ?modal=extend ·
 * View request → ?modal=view · New request → /new · Run a query → /agency/queries · Add a viewer → settings › analysts › invite ·
 * Contact support → email to the GTH agencies team.
 * Props: data (useAgencyState()), requestId, onAnnounce(text).
 */

const DataRequestDetail = ({ data, requestId, onAnnounce }) => {
  const navigate = useNavigate();
  const { params, update } = data;
  const res = useAgencyResource(() => agencyDataRequest(requestId), [requestId]);
  const request = res.data;
  const countdown = useAccessCountdown(
    request?.status === 'approved' ? request.accessEndsAt : null
  );
  const modal = params.get('modal');

  useEffect(() => {
    log('render', { requestId, status: request?.status, modal });
  }, [requestId, request?.status, modal]);

  if (res.loading && !request) {
    return (
      <p role="status" className="m-0 p-[24px] font-sans text-[15px] text-[#737373]">
        Loading the request…
      </p>
    );
  }
  if (res.error || !request) {
    const missing = res.status === 404;
    return (
      <div role="alert" className="flex flex-col items-start gap-[12px] p-[24px]">
        <h1 className="m-0 font-sans text-[22px] leading-[28px] font-semibold text-[#1c2a21]">
          {missing ? 'We couldn’t find that request' : 'We couldn’t load this request'}
        </h1>
        <div className="flex gap-[12px]">
          {missing ? null : (
            <AgencyButton size="sm" onClick={res.reload}>
              Try again
            </AgencyButton>
          )}
          <Link
            to="/agency/data-requests"
            className="font-sans text-[15px] font-semibold text-[#387440]"
          >
            Back to data requests
          </Link>
        </div>
      </div>
    );
  }

  if (request.status === 'approved' && params.get('view') === 'dataset') {
    return <RequestDatasetView request={request} onBack={() => update({ view: null })} />;
  }

  const view = buildDetail(request);
  const closeModal = () => update({ modal: null }, { replace: true });
  const done = (text) => (updated) => {
    onAnnounce?.(text);
    closeModal();
    if (updated?.id && updated.id !== request.id) navigate(`/agency/data-requests/${updated.id}`);
    else res.reload();
  };
  const act = (id) => {
    log('action', id);
    switch (id) {
      case 'dataset':
        update({ view: 'dataset' });
        break;
      case 'appeal':
      case 'detail':
      case 'extend':
      case 'view':
        update({ modal: id });
        break;
      case 'new':
        navigate('/agency/data-requests/new');
        break;
      case 'query':
        navigate('/agency/queries');
        break;
      case 'viewer':
        navigate('/agency/settings/analysts?modal=invite');
        break;
      case 'support':
        window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Data request: ${request.title}`)}`;
        break;
      default:
        break;
    }
  };
  const stepAction = (label) => {
    if (label === 'Start an appeal') act('appeal');
    else if (label === 'Ask to extend') act('extend');
    else if (label === 'Add detail') act('detail');
    else act('view');
  };
  const daysLeft = request.daysLeft ?? 0;
  const cards = view.cards.map((c) =>
    c.live ? { ...c, fill: Math.max(4, Math.round((56 * daysLeft) / 30)) } : c
  );

  return (
    <div className="flex min-w-0 flex-col gap-[16px] pt-[12px] lg:gap-[30px]">
      <RequestHero
        tone={view.tone}
        title={view.heroTitle}
        text={view.heroText}
        action={view.heroAction}
        onAction={() => act(view.heroAction.id)}
      />
      <RequestQuickActions actions={view.quick} locked={view.locked} onAction={act} />
      <RequestApprovalSteps
        sub={view.stepsSub}
        badge={view.stepsBadge}
        progress={view.progress}
        steps={view.steps}
        onAction={stepAction}
      />
      <RequestAccessCards
        title={view.sectionTitle}
        sub={view.sectionSub}
        cards={cards}
        countdown={countdown.label}
      />
      {modal === 'appeal' && request.status === 'rejected' ? (
        <AppealDialog
          request={request}
          onClose={closeModal}
          onSent={done('Appeal sent. A different reviewer will look at it.')}
          onWithdraw={done('Request withdrawn.')}
        />
      ) : null}
      {modal === 'detail' && request.status === 'needs-detail' ? (
        <RequestTextDialog
          mode="detail"
          request={request}
          onClose={closeModal}
          onDone={done('Detail sent to the reviewer.')}
        />
      ) : null}
      {modal === 'extend' && ['approved', 'ended'].includes(request.status) ? (
        <RequestTextDialog
          mode="extend"
          request={request}
          onClose={closeModal}
          onDone={done('Extension request sent for approval.')}
        />
      ) : null}
      {modal === 'view' ? (
        <RequestTextDialog mode="view" request={request} onClose={closeModal} />
      ) : null}
    </div>
  );
};

export default DataRequestDetail;
