import { useEffect, useMemo, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import EmptyState from '../ui/EmptyState.jsx';
import SectionError from '../ui/SectionError.jsx';
import {
  FOCUS_OPTIONS,
  fetchPartners,
  PARTNER_TYPES,
  REGION_OPTIONS,
} from './data/directoryData.js';
import DirectoryControls from './DirectoryControls.jsx';
import DirectoryHead from './DirectoryHead.jsx';
import DirectoryPagination from './DirectoryPagination.jsx';
import DirectorySkeleton from './DirectorySkeleton.jsx';
import PartnerCard from './PartnerCard.jsx';
import { useDirectoryQuery } from './useDirectoryQuery.js';

const log = debug('PartnersDirectory');

/*
 * PartnersDirectory — Figma 8.6.1a (8498:9), 8.6.1c filtered (8498:324), phone 8508:346, tablet 8516:355494.
 * State lives in the URL: ?type=ngo&region=northern&focus=…&q=…&page=2 (state=loading | error force those states).
 * Result text: "185 partners" (unfiltered) / "3 partners match". Zero results -> EmptyState; failure -> SectionError with Retry.
 * Phones show the first 4 cards and "Load more partners" (Figma 8508:418) reveals the rest of the page, then the next page.
 * ⚠️ ASSUMPTION: the zero-result copy is not drawn for the directories (the shared EmptyState copy talks about talents), so a directory
 * sentence is used: "No partners match these filters".
 * Props: data (usePublicDataState()).
 */

const DEFINITIONS = [
  { key: 'type', label: 'Type', options: PARTNER_TYPES, allLabel: 'All types' },
  { key: 'region', label: 'Region', options: REGION_OPTIONS, allLabel: 'All regions' },
  {
    key: 'focus',
    label: 'Focus area',
    shortLabel: 'Focus',
    options: FOCUS_OPTIONS,
    allLabel: 'All focus areas',
  },
];

const MOBILE_STEP = 4;
const nf = new Intl.NumberFormat('en-GH');

const PartnersDirectory = ({ data }) => {
  const { params, update, q, state } = data;
  const type = params.get('type');
  const region = params.get('region');
  const focus = params.get('focus');
  const page = Math.max(1, Number(params.get('page')) || 1);
  const query = useMemo(() => ({ type, region, focus, q, page }), [type, region, focus, q, page]);
  const { status, data: result, retry } = useDirectoryQuery(fetchPartners, query, state);
  const [mobileCount, setMobileCount] = useState(MOBILE_STEP);

  useEffect(() => {
    setMobileCount(MOBILE_STEP);
  }, [type, region, focus, q, page]);

  const filtered = Boolean(type || region || focus || q.trim());
  const clearAll = () => {
    log('clear all');
    update({ type: null, region: null, focus: null, q: null, page: null });
  };
  const onFilter = (key, id) => update({ [key]: id, page: null });

  const total = result?.total ?? 0;
  const resultText =
    status !== 'ready'
      ? ' '
      : filtered
        ? `${nf.format(total)} ${total === 1 ? 'partner matches' : 'partners match'}`
        : `${nf.format(total)} partners`;
  const mobileSubtitle = `${nf.format(result?.total ?? 185)} organisations working with GTH`;

  let body;
  if (status === 'loading') {
    body = <DirectorySkeleton kind="cards" />;
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
        title="No partners match these filters"
        message="Try removing a filter or searching for a different name."
        actionLabel="Clear all filters"
        onAction={clearAll}
      />
    );
  } else {
    const items = result.items;
    const hasMore = mobileCount < items.length || page < result.pages;
    body = (
      <>
        <ul className="m-0 grid list-none grid-cols-1 gap-[16px] p-0 md:grid-cols-2 md:gap-[24px] xl:grid-cols-3">
          {items.map((p, i) => (
            <PartnerCard
              key={`${page}-${p.id}`}
              partner={p}
              className={i >= mobileCount ? 'max-md:hidden' : undefined}
            />
          ))}
        </ul>
        {hasMore && (
          <div className="flex md:hidden">
            <button
              type="button"
              className="min-h-[24px] cursor-pointer rounded-[4px] bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              onClick={() => {
                if (mobileCount < items.length) setMobileCount((n) => n + MOBILE_STEP);
                else update({ page: page + 1 });
              }}
            >
              Load more partners
            </button>
          </div>
        )}
        <DirectoryPagination
          page={result.page}
          pages={result.pages}
          label="Partner pages"
          onPage={(n) => update({ page: n > 1 ? n : null })}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-[16px] px-[16px] pt-[16px] pb-[24px] md:gap-[24px] md:px-[32px] md:pt-[24px] md:pb-[48px] xl:px-[40px]">
      <DirectoryHead
        title="Partner directory"
        description="Organisations working with GTH to support Ghanaian talent. Listed with their permission."
        mobileDescription={mobileSubtitle}
        activeTab="partners"
      />
      <DirectoryControls
        searchLabel="Search partners by name or focus"
        searchShort="Search partners"
        searchWidth="md:w-[380px]"
        q={q}
        onQ={(text) => update({ q: text || null, page: null }, { replace: true })}
        definitions={DEFINITIONS}
        values={{ type, region, focus }}
        onFilter={onFilter}
        resultText={resultText}
      />
      {body}
    </div>
  );
};

export default PartnersDirectory;
