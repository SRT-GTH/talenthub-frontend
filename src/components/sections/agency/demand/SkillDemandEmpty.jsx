import Button from '../../../ui/Button.jsx';
import { AgencyArrowRightIcon } from '../agencyIcons.jsx';
import EmptyState from '../../publicData/ui/EmptyState.jsx';
import DemandCard from './DemandCard.jsx';
import { NO_RESULTS } from './data/demandData.js';

/*
 * SkillDemandEmpty — the "Skill demand" card of 11.4.5d (Figma 8702:418724): Theme 8's EmptyState (filter disc, 17/600 title, 14/20 message, "Clear all filters")
 * and, when a region is chosen, a primary "Show all regions →" button that widens the area.
 * Props: hint (the filters in words), message, onClear(), onWiden() (optional), widenLabel.
 */

const SkillDemandEmpty = ({ hint, message, onClear, onWiden, widenLabel = 'Show all regions' }) => (
  <DemandCard
    id="skill-demand-empty"
    title={NO_RESULTS.cardTitle}
    hint={hint}
    bodyClassName="flex flex-col items-center gap-[20px] px-[24px] pb-[24px]"
  >
    <EmptyState
      card={false}
      title={NO_RESULTS.title}
      message={message}
      actionLabel="Clear all filters"
      onAction={onClear}
      className="!py-0"
    />
    {onWiden ? (
      <Button
        type="button"
        variant="primary"
        size="sm"
        onClick={onWiden}
        className="!rounded-[10px] !px-[18px] !py-[10px] !text-[14px]"
      >
        <span className="inline-flex items-center gap-[8px]">
          {widenLabel}
          <AgencyArrowRightIcon className="size-[20px]" />
        </span>
      </Button>
    ) : null}
  </DemandCard>
);

export default SkillDemandEmpty;
