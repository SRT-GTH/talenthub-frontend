import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import RequestAccessCards from './RequestAccessCards.jsx';
import RequestApprovalSteps from './RequestApprovalSteps.jsx';
import RequestDatasetView from './RequestDatasetView.jsx';
import RequestHero from './RequestHero.jsx';
import RequestQuickActions from './RequestQuickActions.jsx';
import { DETAIL, DETAIL_STATES, getRequest } from './data/dataRequestsData.js';
import { useAccessCountdown } from './useAccessCountdown.js';

const log = debug('DataRequestDetail');

/*
 * DataRequestDetail — /agency/data-requests/:requestId (Figma 11.4.3c–g, i; 11.4.3h with ?view=dataset). The page state is `?state=` (pending ·
 * approved · rejected · ended · needs-detail) or, without it, the request's own status (a request sent from the form is pending, with its own title).
 * Each state draws its own subject, as the frames do (pending / needs-detail → "NSS placements by region", approved / ended → "Youth unemployment by
 * district", rejected → "Under-18 skills by school"). Approved shows the live access countdown. ?view=dataset opens the approved dataset (only for an
 * approved request). ?modal=appeal is mounted by the page.
 * Actions (⚠️ ASSUMPTIONS where Figma draws no destination): Open dataset → ?view=dataset · Start an appeal → ?modal=appeal · New request → /new ·
 * Run a query → /agency/queries · Add a viewer → settings › analysts › invite · Add detail / Ask to extend / View request → the form, prefilled
 * (/new?from=<id>) · Contact support → nothing yet (no destination drawn; logged).
 * Props: data (useAgencyState()), requestId.
 */

const DataRequestDetail = ({ data, requestId }) => {
  const navigate = useNavigate();
  const { params, update } = data;
  const request = getRequest(requestId);
  const stateParam = params.get('state');
  const state = DETAIL_STATES.includes(stateParam)
    ? stateParam
    : DETAIL_STATES.includes(request?.status)
      ? request.status
      : 'pending';
  const view = DETAIL[state];
  const countdown = useAccessCountdown();
  const own = request?.submitted && !stateParam;
  const subject = own ? request.title : view.subject;
  const swap = (text) => (own ? text.replaceAll(view.subject, subject) : text);

  useEffect(() => {
    log('render', { requestId, state, own: Boolean(own) });
  }, [requestId, state, own]);

  if (state === 'approved' && params.get('view') === 'dataset') return <RequestDatasetView />;

  const base = '/agency/data-requests';
  const act = (id) => {
    log('action', id);
    switch (id) {
      case 'dataset':
        update({ view: 'dataset' });
        break;
      case 'appeal':
        update({ modal: 'appeal' });
        break;
      case 'new':
        navigate(`${base}/new`);
        break;
      case 'query':
        navigate('/agency/queries');
        break;
      case 'viewer':
        navigate('/agency/settings/analysts?modal=invite');
        break;
      case 'extend':
      case 'detail':
        navigate(`${base}/new?from=${requestId}`);
        break;
      default:
        break;
    }
  };
  const stepAction = (label) => {
    if (label === 'Start an appeal') act('appeal');
    else if (label === 'Ask to extend') act('extend');
    else if (label === 'Add detail') act('detail');
    else navigate(`${base}/new?from=${requestId}`);
  };

  return (
    <div className="flex min-w-0 flex-col gap-[16px] pt-[12px] lg:gap-[30px]">
      <RequestHero
        tone={view.tone}
        title={view.heroTitle}
        text={swap(view.heroText)}
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
        cards={view.cards.map((c) => (own ? { ...c, text: swap(c.text) } : c))}
        countdown={countdown.label}
      />
    </div>
  );
};

export default DataRequestDetail;
