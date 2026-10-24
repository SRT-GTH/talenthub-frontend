import KpiStrip from '../ui/KpiStrip.jsx';
import KpiTile from '../ui/KpiTile.jsx';
import SegmentedControl from '../ui/SegmentedControl.jsx';
import { OUTCOMES_COPY } from './data/outcomesData.js';
import OutcomesByTypeCard from './OutcomesByTypeCard.jsx';
import OutcomesPartnersCard from './OutcomesPartnersCard.jsx';
import OutcomesPlacementsCard from './OutcomesPlacementsCard.jsx';
import OutcomesSkillsCard from './OutcomesSkillsCard.jsx';
import OutcomesStoriesSection from './OutcomesStoriesSection.jsx';

/*
 * OutcomesDashboard — Figma 8.5.1a (8496:27, 1728), loading 8.5.1d (8496:294), phone 8.5.1c (8507:419), tablet (8508:351744).
 * page header (h1 34/41 600 -0.34 + "What talents achieve through GTH: …" 16/19 #595959, range control on the right) · KPI row (4 tiles: Placements made
 * 4,218 · Scholarships surfaced GHS 2.4M · Skills evidenced 38% · Organisations involved 237) · row [Placements over time 860 | Placements by type 476] ·
 * row [Skills evidenced 668 | Partner ecosystem 668] · stories. Body padding 32/40/48 (tablet 28, phone 16: title 26/31 + short subtitle, no range control —
 * ⚠️ ASSUMPTION: the phone frame draws no range control, so it stays desktop/tablet only and the phone shows the 12-month sample).
 * `loading` (?state=loading): KPI tiles + chart area as skeleton blocks, everything else as drawn.
 * Props: response, stories, range, onRange, loading
 */

const OutcomesDashboard = ({ response, stories, range, onRange, loading }) => {
  const { kpis } = response;
  return (
    <div className="flex flex-col gap-[16px] px-[16px] pt-[16px] pb-[24px] md:gap-[24px] md:px-[28px] md:pt-[32px] md:pb-[48px] xl:px-[40px]">
      <header className="flex flex-wrap items-end justify-between gap-x-[16px] gap-y-[12px]">
        <div className="flex min-w-0 max-w-[760px] flex-col gap-[4px] md:gap-[6px]">
          <h1 className="m-0 font-sans text-[26px] leading-[31px] font-semibold tracking-[-0.13px] text-[#1c2a21] md:text-[34px] md:leading-[41px] md:tracking-[-0.34px]">
            {OUTCOMES_COPY.title}
          </h1>
          <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959] md:text-[16px] md:leading-[19px]">
            <span className="md:hidden">{OUTCOMES_COPY.subtitleShort}</span>
            <span className="hidden md:inline">{OUTCOMES_COPY.subtitle}</span>
          </p>
        </div>
        <SegmentedControl
          options={OUTCOMES_COPY.ranges}
          value={range}
          onChange={onRange}
          ariaLabel="Time range"
          className="max-md:hidden"
        />
      </header>
      <KpiStrip columns={4}>
        <KpiTile
          eyebrow="Placements made"
          eyebrowShort="Placements"
          count={kpis.placements.count}
          sub={kpis.placements.sub}
          subShort={kpis.placements.subShort}
          loading={loading}
          className="md:min-h-[166px]"
        />
        <KpiTile
          eyebrow="Scholarships surfaced"
          eyebrowShort="Scholarships"
          value={kpis.scholarships.valueText}
          sub={kpis.scholarships.sub}
          subShort={kpis.scholarships.subShort}
          loading={loading}
          className="md:min-h-[166px]"
        />
        <KpiTile
          eyebrow="Skills evidenced"
          value={kpis.skills.shareText}
          sub={kpis.skills.sub}
          subShort={kpis.skills.subShort}
          loading={loading}
          className="md:min-h-[166px]"
        />
        <KpiTile
          eyebrow="Organisations involved"
          eyebrowShort="Organisations"
          count={kpis.organisations.count}
          sub={kpis.organisations.sub}
          subShort={kpis.organisations.subShort}
          loading={loading}
          className="md:min-h-[166px]"
        />
      </KpiStrip>
      <div className="grid gap-[16px] md:gap-[24px] xl:grid-cols-[860fr_476fr]">
        <OutcomesPlacementsCard series={response.placementsOverTime} loading={loading} />
        <OutcomesByTypeCard items={response.placementsByType} note={response.averageTimeNote} />
      </div>
      <div className="hidden gap-[24px] md:grid xl:grid-cols-2">
        <OutcomesSkillsCard skills={response.skills} />
        <OutcomesPartnersCard partners={response.partners} />
      </div>
      <OutcomesStoriesSection stories={stories} />
    </div>
  );
};

export default OutcomesDashboard;
