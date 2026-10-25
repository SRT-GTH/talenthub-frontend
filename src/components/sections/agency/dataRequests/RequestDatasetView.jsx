import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { formatCount } from '../../publicData/publicDataFormat.js';
import AgeCard from '../../publicData/regions/AgeCard.jsx';
import CapabilityCard from '../../publicData/regions/CapabilityCard.jsx';
import DistrictTable from '../../publicData/regions/DistrictTable.jsx';
import DistrictZoomMap from '../../publicData/regions/DistrictZoomMap.jsx';
import EducationCard from '../../publicData/regions/EducationCard.jsx';
import PartnerFootprintCard from '../../publicData/regions/PartnerFootprintCard.jsx';
import RankChips from '../../publicData/regions/RankChips.jsx';
import RegionBreadcrumb from '../../publicData/regions/RegionBreadcrumb.jsx';
import RegionHeroRow from '../../publicData/regions/RegionHeroRow.jsx';
import { getDistrict } from '../../publicData/regions/data/regionsData.js';
import { buildDistrictView } from '../../publicData/regions/regionsView.js';
import AgencyButton from '../AgencyButton.jsx';
import AgencyPageHero from '../AgencyPageHero.jsx';
import DatasetLoggedCard from './DatasetLoggedCard.jsx';
import { DATASET as D } from './data/dataRequestsData.js';

const log = debug('RequestDatasetView');

/*
 * RequestDatasetView — ?view=dataset on an approved request (Figma 11.4.3h, 8609:1012): the approved dataset, an aggregated district table. It is the
 * Theme 8 district view of Accra Metro (breadcrumb · hero row · rank chips · map + area table · education / age / capability · partner footprint)
 * inside the agency shell, under a hero with "Download CSV (logged)", with the green "Logged view" card where Theme 8 has the find-talent card.
 * The "<5" rule is applied by the Theme 8 components (formatCount / safeShare) and by the CSV below. Figma prints the dataset name "Youth unemployment ·
 * Accra Metro" in the breadcrumb, the education label and the highlighted map marker, and "Not in work or training · Accra Metro" on the hero metric.
 * "Download CSV (logged)" builds a real CSV of the area table in the browser (the audit-log write is MOCKED).
 * Props: none.
 */

const csvEscape = (value) => `"${String(value).replaceAll('"', '""')}"`;

const RequestDatasetView = () => {
  const navigate = useNavigate();
  const view = useMemo(() => {
    const base = buildDistrictView(getDistrict('greater-accra', 'accra-metro'));
    return {
      ...base,
      crumbs: [
        { label: 'National', to: '/agency/national' },
        { label: 'Greater Accra', to: '/agency/regions/greater-accra' },
        { label: D.heroTitle },
      ],
      hero: { ...base.hero, eyebrow: D.eyebrow },
      education: { ...base.education, label: D.heroTitle },
      map: {
        ...base.map,
        markers: base.map.markers.map((m) => (m.id === base.id ? { ...m, name: D.heroTitle } : m)),
        districtTo: () => null,
      },
    };
  }, []);

  const download = () => {
    log('download csv (logged, mock)');
    const lines = [
      ['Rank', 'Area', 'Talents', '30-day change'].map(csvEscape).join(','),
      ...view.table.rows.map((r) =>
        [r.rank, r.name, formatCount(r.talents), `${r.trendPct > 0 ? '+' : ''}${r.trendPct}%`]
          .map(csvEscape)
          .join(',')
      ),
    ];
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = D.csvName;
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <AgencyPageHero
        title={D.heroTitle}
        subtitle={D.heroText}
        actions={
          <AgencyButton size="sm" onClick={download}>
            {D.download}
          </AgencyButton>
        }
      />
      <div className="flex min-w-0 flex-col gap-[16px] overflow-x-clip lg:gap-[24px]">
        <RegionBreadcrumb items={view.crumbs} />
        <RegionHeroRow view={view} />
        <RankChips label={view.chipsLabel} chips={view.chips} />
        <div className="grid min-w-0 grid-cols-1 gap-[24px] max-md:hidden xl:grid-cols-[minmax(0,700fr)_minmax(0,636fr)]">
          <DistrictZoomMap regionId={view.regionId} map={view.map} />
          <DistrictTable table={view.table} />
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
          <DatasetLoggedCard
            logged={D.logged}
            onAction={() => navigate('/agency/settings/audit-log')}
          />
        </div>
      </div>
    </>
  );
};

export default RequestDatasetView;
