import { useCallback, useEffect, useMemo } from 'react';
import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import AgencyButton from '../../components/sections/agency/AgencyButton.jsx';
import AgencyPageHero from '../../components/sections/agency/AgencyPageHero.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import CompareAgeCard from '../../components/sections/publicData/regions/CompareAgeCard.jsx';
import CompareEducationCard from '../../components/sections/publicData/regions/CompareEducationCard.jsx';
import CompareHeader from '../../components/sections/publicData/regions/CompareHeader.jsx';
import CompareHeadlineCard from '../../components/sections/publicData/regions/CompareHeadlineCard.jsx';
import CompareInterestsCards from '../../components/sections/publicData/regions/CompareInterestsCards.jsx';
import CompareSelectorDialog from '../../components/sections/publicData/regions/CompareSelectorDialog.jsx';
import {
  getCompare,
  parseCompareIds,
} from '../../components/sections/publicData/regions/data/regionsData.js';
import RegionBreadcrumb from '../../components/sections/publicData/regions/RegionBreadcrumb.jsx';
import EmptyState from '../../components/sections/publicData/ui/EmptyState.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('AgencyComparePage');

/*
 * AgencyComparePage — /agency/compare?regions=a,b[,c] (Figma 11.4.2n 2 regions, 11.4.2o selector). Theme 8's compare cards inside the agency chrome.
 * Same URL contract as Theme 8: ?regions= (2-3 ids), ?modal=compare opens the selector; no ?regions= compares Greater Accra and Ashanti.
 */

const AgencyComparePage = () => {
  const data = useAgencyState();
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
    <AgencyFrame data={data} title="Compare regions" active="districts">
      <AgencyPageHero
        title="Compare regions"
        subtitle="Side by side with the same filters. Add up to 3 regions."
        actions={<AgencyButton to="/agency/briefing?modal=download">Download PDF</AgencyButton>}
      />
      <RegionBreadcrumb
        items={[{ label: 'National', to: '/agency/national' }, { label: 'Compare regions' }]}
        className="max-md:block"
      />
      <CompareHeader
        titleAs="h2"
        regions={regions}
        onRemove={(id) => setRegions(ids.filter((x) => x !== id))}
        onAdd={() => update({ modal: 'compare' })}
      />
      {ready ? (
        <>
          <CompareHeadlineCard regions={regions} />
          <div className="grid min-w-0 grid-cols-1 gap-[24px] xl:grid-cols-2">
            <CompareEducationCard regions={regions} />
            <CompareAgeCard regions={regions} />
          </div>
          <CompareInterestsCards regions={regions} />
        </>
      ) : (
        <EmptyState
          variant="zero"
          title="Choose regions to compare"
          message="Pick up to 3. Each region keeps its colour across every chart."
        />
      )}
      {open && (
        <CompareSelectorDialog
          key={ids.join(',')}
          selected={ids}
          onApply={(next) => setRegions(next, { modal: null })}
          onClose={() => update({ modal: null })}
        />
      )}
    </AgencyFrame>
  );
};

export default AgencyComparePage;
