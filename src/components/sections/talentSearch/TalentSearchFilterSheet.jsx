import { debug } from '../../../utils/debug.js';
import Modal from '../../ui/Modal.jsx';
import { FilterRemoveIcon } from './talentSearchIcons.jsx';
import { FILTER_CHIPS } from './talentSearchData.js';

const log = debug('TalentSearchFilterSheet');

/*
 * TalentSearchFilterSheet — the phone (< md) filters panel behind the
 * "Filters (n)" button. The shared Modal renders as a bottom sheet below `sm`,
 * with the Apply / Clear actions pinned in its footer.
 *
 * `⚠️ ASSUMPTION` — Figma only draws the applied-filter CHIPS and a "More
 * Filters" label (no filter editor frame exists), so this sheet lists the
 * applied filters with a remove control each, mirroring what the chips offer
 * inline on desktop. Nothing is wired to results yet (neither are the chips);
 * every action logs its intent. Swap in the real editor when Figma lands.
 */
const TalentSearchFilterSheet = ({ isOpen, onClose }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    size="sm"
    ariaLabel="Filters"
    header={
      <div className="px-[20px] pb-[8px] pt-[20px] pr-[64px]">
        <h2 className="font-display text-[26px] not-italic leading-[32px] text-black">
          Filters ({FILTER_CHIPS.length})
        </h2>
        <p className="font-sans text-[14px] leading-5 text-neutral-dark-hover">
          Applied to your Senior Product Engineer matches.
        </p>
      </div>
    }
    footer={
      <div className="flex gap-[12px] border-t border-border-card bg-white px-[20px] py-[12px]">
        <button
          type="button"
          onClick={() => {
            log('branch', { action: 'clear-all', wired: false });
          }}
          className="inline-flex h-[40px] flex-1 items-center justify-center whitespace-nowrap rounded-[10px] border border-black/30 bg-white font-sans text-[14px] font-semibold text-black"
        >
          Clear all
        </button>
        <button
          type="button"
          onClick={() => {
            log('branch', { action: 'apply-filters', wired: false });
            onClose?.();
          }}
          className="inline-flex h-[40px] flex-1 items-center justify-center whitespace-nowrap rounded-[10px] border border-brand-green-dark bg-brand-green font-sans text-[14px] font-semibold text-white"
        >
          Show results
        </button>
      </div>
    }
  >
    <ul className="flex flex-col gap-[8px] px-[20px] pb-[16px] pt-[8px]">
      {FILTER_CHIPS.map((chip) => (
        <li
          key={chip.id}
          className="flex min-h-[56px] items-center justify-between gap-[12px] rounded-[12px] border border-brand-green-light-hover bg-white px-[14px] py-[8px]"
        >
          <span className="flex min-w-0 flex-col">
            <span className="font-sans text-[12px] font-semibold uppercase leading-4 tracking-[0.44px] text-content-muted">
              {chip.label.replace(':', '')}
            </span>
            <span className="font-sans text-[16px] font-medium leading-6 text-[#1c1c1a]">
              {chip.value}
            </span>
          </span>
          <button
            type="button"
            aria-label={`Remove ${chip.label.replace(':', '')} filter`}
            onClick={() => log('branch', { chip: chip.id, action: 'remove-filter', wired: false })}
            className="grid size-[44px] shrink-0 place-items-center rounded-full text-[#1c1c1a] transition-colors hover:bg-neutral"
          >
            <FilterRemoveIcon className="size-[10px]" />
          </button>
        </li>
      ))}
    </ul>
  </Modal>
);

export default TalentSearchFilterSheet;
