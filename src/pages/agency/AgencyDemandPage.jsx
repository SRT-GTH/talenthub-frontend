import { useEffect } from 'react';
import AgencyButton from '../../components/sections/agency/AgencyButton.jsx';
import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import AgencyPageHero from '../../components/sections/agency/AgencyPageHero.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import {
  COMPACT_SUBTITLE,
  DEMAND_VIEWS,
  HERO_SUBTITLE,
} from '../../components/sections/agency/demand/data/demandData.js';
import DemandTabs from '../../components/sections/agency/demand/DemandTabs.jsx';
import SkillDemandView from '../../components/sections/agency/demand/SkillDemandView.jsx';
import SuccessView from '../../components/sections/agency/demand/SuccessView.jsx';
import TrendsView from '../../components/sections/agency/demand/TrendsView.jsx';
import MoreFiltersDrawer from '../../components/sections/agency/national/MoreFiltersDrawer.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('AgencyDemandPage');

/*
 * AgencyDemandPage — /agency/demand, Theme 11 "Demand & outcomes" (Figma 11.4.5a-p, 11.4.6f-g). Package B2.
 * URL keys (agencyState.js lists the shared ones; these are this page's):
 *   view=skills|trends|success        the three tabs (default skills)
 *   skills : skill=<skillId> · region=<regionId> (district drill-down) · district= · category= · period= · state=empty|suppressed-region
 *   trends : range=30d|quarter|ytd|12m|custom|long · by=day|week|month · from= · to= (YYYY-MM-DD) · state=generating · modal=date-range
 *   success: source=all|programmes|opportunities · programme=<programmeId> · groupby=<view-by id> · modal=view-by · state=suppressed
 *   every tab: modal=filters (the More filters drawer of package B, bottom sheet on phones, side sheet on tablets)
 * Below lg (phone 360 / tablet 834, frames 11.4.5o/p) the green hero is replaced by the compact title line.
 */

const PANEL_ID = 'demand-panel';
const PAGE_KEYS = [
  'skill',
  'region',
  'district',
  'category',
  'period',
  'range',
  'by',
  'from',
  'to',
  'source',
  'programme',
  'groupby',
  'state',
  'modal',
];

const AgencyDemandPage = () => {
  const data = useAgencyState();
  const view = DEMAND_VIEWS.some((v) => v.id === data.view) ? data.view : 'skills';

  useEffect(() => {
    log('mount', view);
  }, [view]);

  const setView = (id) => {
    log('tab', id);
    data.update({
      ...Object.fromEntries(PAGE_KEYS.map((k) => [k, null])),
      view: id === 'skills' ? null : id,
    });
  };

  return (
    <AgencyFrame data={data} title="Demand & outcomes">
      <div className="hidden lg:contents">
        <AgencyPageHero
          title="Demand & outcomes"
          subtitle={HERO_SUBTITLE[view]}
          actions={<AgencyButton to="/agency/briefing?modal=download">Download PDF</AgencyButton>}
        />
      </div>
      <div className="-mt-[1px] flex flex-col gap-[4px] font-sans lg:hidden">
        <h1 className="m-0 text-[24px] leading-[30px] font-semibold tracking-[-0.12px] text-[#1c2a21]">
          Demand &amp; outcomes
        </h1>
        <p className="m-0 text-[12px] leading-[14px] text-[#575755]">{COMPACT_SUBTITLE}</p>
      </div>
      <DemandTabs value={view} onChange={setView} panelId={PANEL_ID} />
      <div
        id={PANEL_ID}
        role="tabpanel"
        aria-labelledby={`demand-tab-${view}`}
        className="flex min-w-0 flex-col gap-[16px] lg:gap-[30px]"
      >
        {view === 'trends' ? (
          <TrendsView data={data} />
        ) : view === 'success' ? (
          <SuccessView data={data} />
        ) : (
          <SkillDemandView data={data} />
        )}
      </div>
      <MoreFiltersDrawer data={data} tooFew={false} />
    </AgencyFrame>
  );
};

export default AgencyDemandPage;
