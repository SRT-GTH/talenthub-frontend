import { useMemo } from 'react';
import { debug } from '../../../../utils/debug.js';
import EmptyState from '../ui/EmptyState.jsx';
import SectionError from '../ui/SectionError.jsx';
import {
  CLOSING_OPTIONS,
  ELIGIBILITY_OPTIONS,
  fetchOpportunities,
  OPPORTUNITY_TYPES,
  REGION_OPTIONS,
} from './data/directoryData.js';
import DirectoryControls from './DirectoryControls.jsx';
import DirectoryHead from './DirectoryHead.jsx';
import DirectoryPagination from './DirectoryPagination.jsx';
import DirectorySkeleton from './DirectorySkeleton.jsx';
import OpportunityList from './OpportunityList.jsx';
import { useDirectoryQuery } from './useDirectoryQuery.js';

const log = debug('OpportunitiesDirectory');

/*
 * OpportunitiesDirectory — Figma 8.6.2a (8498:349008), 8.6.2c filtered (8498:349179), phone 8508:428, tablet 8516:355894.
 * URL: ?type=training&region=…&closing=month|next|later|rolling&eligibility=…&q=…&page=2 (state=loading | error force those states).
 * Result text: "142 open opportunities" / "2 opportunities match". Phones show three chips (Type · Region · Deadline) as drawn; the Eligibility
 * chip is desktop and tablet only (Figma 8508:460).
 * ⚠️ ASSUMPTION: pagination under the table (not drawn; 142 open opportunities cannot be reached otherwise); zero-result copy is a directory
 * sentence ("No opportunities match these filters"), the shared EmptyState copy talks about talents.
 * Props: data (usePublicDataState()).
 */

const DEFINITIONS = [
  { key: 'type', label: 'Type', options: OPPORTUNITY_TYPES, allLabel: 'All types' },
  { key: 'region', label: 'Region', options: REGION_OPTIONS, allLabel: 'All regions' },
  { key: 'closing', label: 'Deadline', options: CLOSING_OPTIONS, allLabel: 'Any deadline' },
  {
    key: 'eligibility',
    label: 'Eligibility',
    options: ELIGIBILITY_OPTIONS,
    allLabel: 'Anyone',
    desktopOnly: true,
  },
];

const nf = new Intl.NumberFormat('en-GH');

const OpportunitiesDirectory = ({ data }) => {
  const { params, update, q, state } = data;
  const type = params.get('type');
  const region = params.get('region');
  const closing = params.get('closing');
  const eligibility = params.get('eligibility');
  const page = Math.max(1, Number(params.get('page')) || 1);
  const query = useMemo(
    () => ({ type, region, closing, eligibility, q, page }),
    [type, region, closing, eligibility, q, page]
  );
  const { status, data: result, retry } = useDirectoryQuery(fetchOpportunities, query, state);

  const filtered = Boolean(type || region || closing || eligibility || q.trim());
  const clearAll = () => {
    log('clear all');
    update({ type: null, region: null, closing: null, eligibility: null, q: null, page: null });
  };

  const total = result?.total ?? 0;
  const resultText =
    status !== 'ready'
      ? ' '
      : filtered
        ? `${nf.format(total)} ${total === 1 ? 'opportunity matches' : 'opportunities match'}`
        : `${nf.format(total)} open opportunities`;
  const mobileSubtitle = `${nf.format(result?.total ?? 142)} open · apply inside GTH`;

  let body;
  if (status === 'loading') {
    body = <DirectorySkeleton kind="table" />;
  } else if (status === 'error') {
    body = (
      <div className="rounded-[24px] border border-solid border-[#e7e7e7] bg-white py-[24px]">
        <SectionError
          onRetry={() => {
            log('retry');
            if (state === 'error') update({ state: null });
            else retry();
          }}
        />
      </div>
    );
  } else if (result.items.length === 0) {
    body = (
      <EmptyState
        variant="zero"
        title="No opportunities match these filters"
        message="Try removing a filter or a different deadline."
        actionLabel="Clear all filters"
        onAction={clearAll}
      />
    );
  } else {
    body = (
      <>
        <OpportunityList items={result.items} />
        <DirectoryPagination
          page={result.page}
          pages={result.pages}
          label="Opportunity pages"
          onPage={(n) => update({ page: n > 1 ? n : null })}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-[16px] px-[16px] pt-[16px] pb-[24px] md:gap-[24px] md:px-[32px] md:pt-[24px] md:pb-[48px] xl:px-[40px]">
      <DirectoryHead
        title="Opportunity directory"
        description="Open jobs, internships, scholarships and training posted by GTH partners. Talents apply inside GTH."
        mobileDescription={mobileSubtitle}
        activeTab="opportunities"
      />
      <DirectoryControls
        searchLabel="Search opportunities"
        searchShort="Search opportunities"
        searchWidth="md:w-[340px]"
        q={q}
        onQ={(text) => update({ q: text || null, page: null }, { replace: true })}
        definitions={DEFINITIONS}
        values={{ type, region, closing, eligibility }}
        onFilter={(key, id) => update({ [key]: id, page: null })}
        resultText={resultText}
      />
      {body}
    </div>
  );
};

export default OpportunitiesDirectory;
