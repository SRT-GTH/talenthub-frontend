import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import EmptyState from '../ui/EmptyState.jsx';
import SectionError from '../ui/SectionError.jsx';
import { fetchOpportunity, fetchPartner } from './data/directoryData.js';
import DirectorySkeleton from './DirectorySkeleton.jsx';
import OpportunityDetail from './OpportunityDetail.jsx';
import PartnerDetail from './PartnerDetail.jsx';
import { useDirectoryQuery } from './useDirectoryQuery.js';

const log = debug('DirectoryDetailView');

/*
 * DirectoryDetailView — loads one partner (/data/partners/:partnerId) or one opportunity (/data/opportunities/:opportunityId) and draws the
 * loading skeleton, the section error (retry) or the detail. An unknown id shows an EmptyState with a way back to the list.
 * ⚠️ ASSUMPTION: the "not found" copy is not drawn; it follows the empty-state pattern ("Partner not found" / "Opportunity not found").
 * Props: kind ('partner' | 'opportunity'), id, data (usePublicDataState()).
 */

const DirectoryDetailView = ({ kind, id, data }) => {
  const navigate = useNavigate();
  const isPartner = kind === 'partner';
  const {
    status,
    data: result,
    error,
    retry,
  } = useDirectoryQuery(isPartner ? fetchPartner : fetchOpportunity, id, data.state);
  const base = isPartner ? '/data/partners' : '/data/opportunities';

  let body;
  if (status === 'loading') {
    body = <DirectorySkeleton kind="detail" />;
  } else if (status === 'error' && error?.status === 404) {
    body = (
      <EmptyState
        variant="zero"
        title={isPartner ? 'Partner not found' : 'Opportunity not found'}
        message={
          isPartner
            ? 'This partner is not listed, or the link is out of date.'
            : 'This opportunity is closed, or the link is out of date.'
        }
        actionLabel={
          isPartner ? 'Back to the partner directory' : 'Back to the opportunity directory'
        }
        onAction={() => navigate(base)}
      />
    );
  } else if (status === 'error') {
    body = (
      <div className="rounded-[24px] border border-solid border-[#e7e7e7] bg-white py-[24px]">
        <SectionError
          onRetry={() => {
            log('retry');
            if (data.state === 'error') data.update({ state: null });
            else retry();
          }}
        />
      </div>
    );
  } else if (isPartner) {
    body = <PartnerDetail partner={result.partner} opportunities={result.opportunities} />;
  } else {
    body = (
      <OpportunityDetail
        opportunity={result.opportunity}
        partner={result.partner}
        onShare={() => data.update({ modal: 'share' })}
      />
    );
  }

  return (
    <div className="px-[16px] pt-[16px] pb-[24px] md:px-[32px] md:pt-[24px] md:pb-[48px] xl:px-[40px]">
      {body}
    </div>
  );
};

export default DirectoryDetailView;
