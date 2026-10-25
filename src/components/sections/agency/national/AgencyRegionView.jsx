import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import AgeCard from '../../publicData/regions/AgeCard.jsx';
import CapabilityCard from '../../publicData/regions/CapabilityCard.jsx';
import DistrictTable from '../../publicData/regions/DistrictTable.jsx';
import DistrictZoomMap from '../../publicData/regions/DistrictZoomMap.jsx';
import EducationCard from '../../publicData/regions/EducationCard.jsx';
import PartnerFootprintCard from '../../publicData/regions/PartnerFootprintCard.jsx';
import RankChips from '../../publicData/regions/RankChips.jsx';
import RegionBreadcrumb from '../../publicData/regions/RegionBreadcrumb.jsx';
import RegionHeroRow from '../../publicData/regions/RegionHeroRow.jsx';
import RegionLowDataCard from '../../publicData/regions/RegionLowDataCard.jsx';
import RegionSwitcher from '../../publicData/regions/RegionSwitcher.jsx';
import AgencyButton from '../AgencyButton.jsx';
import AgencyPageHero from '../AgencyPageHero.jsx';
import AgencyQueryCtaCard from './AgencyQueryCtaCard.jsx';

const log = debug('AgencyRegionView');

/*
 * AgencyRegionView — body of /agency/regions/:regionId[/districts/:districtId] (Figma 11.4.2k region, 11.4.2b district, 11.4.2l switcher open,
 * 11.4.2m low-data). Theme 8's region template inside the agency chrome: hero (Compare regions | Download PDF) · breadcrumb · hero row · rank chips ·
 * map + table · education / age / capability · partner footprint + "For your agency" query card.
 * The bubble map is hidden below md (its 10-13px markers are under the 24px tap size; the district table lists the same districts as links).
 * ⚠️ ASSUMPTION: Figma draws the switcher menu open but not its trigger; a small "Switch region ▾" link sits at the right of the breadcrumb row.
 * Props: view (agencyRegionView), regionId, state ('loading' | 'low-data' | null), switcher (props of RegionSwitcher), onCompare.
 */

const AgencyRegionView = ({ view, regionId, state, switcher, onCompare }) => {
  const navigate = useNavigate();
  const loading = state === 'loading';
  const lowData = state === 'low-data';
  log('render', { kind: view.kind, id: view.id, state });
  const isRegion = view.kind === 'region';
  return (
    <>
      <AgencyPageHero
        title={lowData ? 'Region with early data' : view.name}
        subtitle={
          lowData
            ? 'GTH is still rolling out here, so small groups are hidden to protect privacy.'
            : view.heroSubtitle
        }
        actions={
          isRegion && !lowData ? (
            <AgencyButton onClick={onCompare}>Compare regions</AgencyButton>
          ) : (
            <AgencyButton to="/agency/briefing?modal=download">Download PDF</AgencyButton>
          )
        }
      />
      <div className="flex min-w-0 items-center justify-between gap-[12px]">
        <RegionBreadcrumb items={view.crumbs} className="max-md:block" />
        {isRegion && !lowData ? <RegionSwitcher {...switcher} bare /> : null}
      </div>
      {lowData ? (
        <RegionLowDataCard
          low={view.lowData}
          onSubscribe={() => navigate('/agency/settings/notifications')}
          onBack={() => navigate('/agency/national')}
          backLabel="Back to national data"
        />
      ) : (
        <>
          <RegionHeroRow view={view} loading={loading} />
          <RankChips label={view.chipsLabel} chips={view.chips} />
          <div className="grid min-w-0 grid-cols-1 gap-[24px] xl:grid-cols-[minmax(0,700fr)_minmax(0,636fr)]">
            <div className="min-w-0 max-md:hidden">
              <DistrictZoomMap regionId={regionId} map={view.map} loading={loading} />
            </div>
            <DistrictTable table={view.table} loading={loading} />
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-[24px] md:grid-cols-2 xl:grid-cols-3">
            <EducationCard education={view.education} />
            <AgeCard items={view.age} ariaLabel={`Age distribution of talents in ${view.name}`} />
            <div className="min-w-0 md:col-span-2 xl:col-span-1 [&>section]:h-full">
              <CapabilityCard capabilities={view.capabilities} gender={view.gender} />
            </div>
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-[24px] xl:grid-cols-[minmax(0,880fr)_minmax(0,456fr)]">
            <PartnerFootprintCard partners={view.partners} />
            <AgencyQueryCtaCard {...view.queryCta} />
          </div>
        </>
      )}
    </>
  );
};

export default AgencyRegionView;
