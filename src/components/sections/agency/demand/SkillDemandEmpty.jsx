import Button from '../../../ui/Button.jsx';
import { formatCount } from '../agencyFormat.js';
import { AgencyArrowRightIcon } from '../agencyIcons.jsx';
import EmptyState from '../../publicData/ui/EmptyState.jsx';
import DemandCard from './DemandCard.jsx';
import { NO_RESULTS } from './data/demandData.js';

/*
 * SkillDemandEmpty — the "Skill demand" card of 11.4.5d (Figma 8702:418724): Theme 8's EmptyState (filter disc, 17/600 title, 14/20 message, "Clear all filters")
 * with the agency extras under it: a primary "Show Northern region →" button (widen the area) and "Nearby with opportunities:" pills (#ebf1ec r999, 12/600 #387440,
 * "Nalerigu-Gambaga · 7"). The pill counts go through formatCount. Props: onClear(), onWiden(), regionName.
 */

const SkillDemandEmpty = ({ onClear, onWiden, regionName = 'Northern' }) => (
  <DemandCard
    id="skill-demand-empty"
    title={NO_RESULTS.cardTitle}
    hint={NO_RESULTS.cardHint}
    bodyClassName="flex flex-col items-center gap-[20px] px-[24px] pb-[24px]"
  >
    <EmptyState
      card={false}
      title={NO_RESULTS.title}
      message={NO_RESULTS.message}
      actionLabel="Clear all filters"
      onAction={onClear}
      className="!py-0"
    />
    <Button
      type="button"
      variant="primary"
      size="sm"
      onClick={onWiden}
      className="!rounded-[10px] !px-[18px] !py-[10px] !text-[14px]"
    >
      <span className="inline-flex items-center gap-[8px]">
        {`Show ${regionName} region`}
        <AgencyArrowRightIcon className="size-[20px]" />
      </span>
    </Button>
    <p className="m-0 flex flex-wrap items-center justify-center gap-[8px] font-sans text-[13px] leading-[16px] text-[#575755]">
      <span>{NO_RESULTS.nearbyLabel}</span>
      {NO_RESULTS.nearby.map((n) => (
        <span
          key={n.label}
          className="rounded-full bg-[#ebf1ec] px-[8px] py-[3px] text-[12px] leading-[14px] font-semibold text-[#387440]"
          aria-label={`${n.label.split(' · ')[0]}, ${formatCount(n.count)} opportunities`}
        >
          {n.label}
        </span>
      ))}
    </p>
  </DemandCard>
);

export default SkillDemandEmpty;
