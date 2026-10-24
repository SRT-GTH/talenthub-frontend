import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import AgeCard from './AgeCard.jsx';
import CapabilityCard from './CapabilityCard.jsx';
import DistrictTable from './DistrictTable.jsx';
import DistrictZoomMap from './DistrictZoomMap.jsx';
import EducationCard from './EducationCard.jsx';
import FindTalentCard from './FindTalentCard.jsx';
import PartnerFootprintCard from './PartnerFootprintCard.jsx';
import RankChips from './RankChips.jsx';
import RegionBreadcrumb from './RegionBreadcrumb.jsx';
import RegionHeader from './RegionHeader.jsx';
import RegionHeroRow from './RegionHeroRow.jsx';
import RegionLowDataCard from './RegionLowDataCard.jsx';
import RegionMobileSections from './RegionMobileSections.jsx';

const log = debug('RegionView');

/*
 * RegionView — the body of /data/regions/:regionId and /data/regions/:regionId/districts/:districtId (Figma 8.3.1a-d, 8.3.2a-c, tablet 8508:351349,
 * phones 8507:260 / 8516:8). One template for both levels: the view-model (regionsView.js) carries the copy and numbers.
 *   padding 40 (xl) · 28 (tablet) · 16 (phone), gap 24 (16 on phones)
 *   order: breadcrumb · header · hero row · rank chips · map + table · education / age / capability · partner footprint + find-talent card
 * States: loading (tile skeletons, no bubbles, skeleton table rows — 8494:8 / 8494:2497) · low-data (the early-rollout card instead of everything
 * below the header — 8494:426 / 8494:2390).
 * Props: view, regionId, allRows (phone list), state ('loading' | 'low-data' | null), switcher, onCompare, onSubscribe.
 */

const RegionView = ({ view, regionId, allRows, state, switcher, onCompare, onSubscribe }) => {
  const navigate = useNavigate();
  const loading = state === 'loading';
  const lowData = state === 'low-data';
  log('render', { kind: view.kind, id: view.id, state });
  const findTalent = () => {
    log('find talent → partner sign-in');
    navigate('/login');
  };
  return (
    <div className="flex flex-col gap-[16px] px-[16px] pt-[20px] pb-[24px] md:gap-[24px] md:px-[28px] md:pt-[24px] md:pb-[48px] xl:px-[40px]">
      <RegionBreadcrumb items={view.crumbs} />
      <RegionHeader
        view={view}
        switcher={switcher}
        onCompare={onCompare}
        plainTitle={view.kind === 'district'}
      />
      {lowData ? (
        <RegionLowDataCard
          low={view.lowData}
          onSubscribe={onSubscribe}
          onBack={() => navigate('/data/overview')}
        />
      ) : (
        <>
          <RegionHeroRow view={view} loading={loading} />
          <RankChips label={view.chipsLabel} chips={view.chips} />
          <div className="grid min-w-0 grid-cols-1 gap-[24px] max-md:hidden xl:grid-cols-[minmax(0,700fr)_minmax(0,636fr)]">
            <DistrictZoomMap regionId={regionId} map={view.map} loading={loading} />
            <DistrictTable table={view.table} loading={loading} />
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-[24px] max-md:hidden md:grid-cols-2 xl:grid-cols-3">
            <EducationCard education={view.education} />
            <AgeCard items={view.age} ariaLabel={`Age distribution of talents in ${view.name}`} />
            <div className="min-w-0 md:col-span-2 xl:col-span-1 [&>section]:h-full">
              <CapabilityCard capabilities={view.capabilities} gender={view.gender} />
            </div>
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-[24px] max-md:hidden xl:grid-cols-[minmax(0,880fr)_minmax(0,456fr)]">
            <PartnerFootprintCard partners={view.partners} />
            <FindTalentCard cta={view.cta} onAction={findTalent} />
          </div>
          <RegionMobileSections
            view={view}
            regionId={regionId}
            allRows={allRows}
            onFindTalent={findTalent}
          />
        </>
      )}
    </div>
  );
};

export default RegionView;
