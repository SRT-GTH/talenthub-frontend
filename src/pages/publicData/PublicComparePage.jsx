import { useCallback, useEffect, useMemo } from 'react';
import PublicDataFrame from '../../components/sections/publicData/PublicDataFrame.jsx';
import { usePublicDataState } from '../../components/sections/publicData/publicDataState.js';
import CompareAgeCard from '../../components/sections/publicData/regions/CompareAgeCard.jsx';
import CompareEducationCard from '../../components/sections/publicData/regions/CompareEducationCard.jsx';
import CompareHeader from '../../components/sections/publicData/regions/CompareHeader.jsx';
import CompareHeadlineCard from '../../components/sections/publicData/regions/CompareHeadlineCard.jsx';
import CompareInterestsCards from '../../components/sections/publicData/regions/CompareInterestsCards.jsx';
import CompareMobileCards from '../../components/sections/publicData/regions/CompareMobileCards.jsx';
import CompareSelectorDialog from '../../components/sections/publicData/regions/CompareSelectorDialog.jsx';
import {
  getCompare,
  parseCompareIds,
} from '../../components/sections/publicData/regions/data/regionsData.js';
import RegionBreadcrumb from '../../components/sections/publicData/regions/RegionBreadcrumb.jsx';
import PublicDataModals from '../../components/sections/publicData/share/PublicDataModals.jsx';
import EmptyState from '../../components/sections/publicData/ui/EmptyState.jsx';
import MobileActionBar from '../../components/sections/publicData/ui/MobileActionBar.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('PublicComparePage');

/*
 * PublicComparePage — /data/compare?regions=a,b[,c] (Figma 8.3.3a 2 regions, 8.3.3b 3 regions, 8.3.3c selector modal, phone 8.9.2 8516:143).
 * The URL is the state: ?regions= lists 2 or 3 region ids (order = colour: green, orange, blue), ?modal=compare opens the selector. Unknown ids are
 * dropped, duplicates ignored, more than three cut to three.
 * ⚠️ ASSUMPTION: without ?regions= the page compares the two largest regions (Greater Accra, Ashanti — the drawn default); with a single valid
 * region (the "Compare with another region" button of a region page sends one, with ?modal=compare) the selector is open and the page shows the pick-more state.
 * Mock-backed: getCompare(ids) stands in for GET /public/compare?regions=…
 */

const PublicComparePage = () => {
  const data = usePublicDataState();
  const { update, params, modal } = data;
  const raw = params.get('regions');
  const ids = useMemo(
    () => (raw === null ? ['greater-accra', 'ashanti'] : parseCompareIds(raw)),
    [raw]
  );
  const regions = useMemo(() => getCompare(ids), [ids]);
  const ready = regions.length >= 2;
  const open = modal === 'compare';

  useEffect(() => {
    log('mount', { ids, ready, open });
  }, [ids, ready, open]);

  const setRegions = useCallback(
    (next, extra = {}) => update({ regions: next.join(','), ...extra }),
    [update]
  );

  return (
    <PublicDataFrame data={data} title="National snapshot" active="regions">
      <div className="flex flex-col gap-[16px] px-[16px] pt-[20px] pb-[24px] md:gap-[24px] md:px-[28px] md:pt-[24px] md:pb-[48px] xl:px-[40px]">
        <RegionBreadcrumb
          items={[{ label: 'National', to: '/data/overview' }, { label: 'Compare regions' }]}
        />
        <CompareHeader
          regions={regions}
          onRemove={(id) => setRegions(ids.filter((x) => x !== id))}
          onAdd={() => update({ modal: 'compare' })}
        />
        {ready ? (
          <>
            <CompareHeadlineCard regions={regions} />
            <div className="grid min-w-0 grid-cols-1 gap-[24px] max-md:hidden xl:grid-cols-2">
              <CompareEducationCard regions={regions} />
              <CompareAgeCard regions={regions} />
            </div>
            <CompareInterestsCards regions={regions} />
            <CompareMobileCards regions={regions} />
          </>
        ) : (
          <EmptyState
            variant="zero"
            title="Choose regions to compare"
            message="Pick up to 3. Each region keeps its colour across every chart."
          />
        )}
      </div>
      <MobileActionBar
        onShare={() => update({ modal: 'share' })}
        onDownload={() => update({ modal: 'download' })}
      />
      {open && (
        <CompareSelectorDialog
          key={ids.join(',')}
          selected={ids}
          onApply={(next) => setRegions(next, { modal: null })}
          onClose={() => update({ modal: null })}
        />
      )}
      <PublicDataModals
        data={data}
        scope={{ title: 'Compare regions', reportKind: 'overview', sharePath: 'compare' }}
      />
    </PublicDataFrame>
  );
};

export default PublicComparePage;
