import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { SearchIcon } from '../../shared/assets.jsx';
import { MoreFiltersIcon } from './talentSearchIcons.jsx';
import { PAGE_HEADING, PAGE_SUBHEADING, SEARCH_PLACEHOLDER } from './talentSearchData.js';

const log = debug('TalentSearchHeader');

/*
 * TalentSearchHeader — page title, result count and the in-page search field.
 * Figma 7249:74316.
 *
 * The headline is the project's mixed-style pattern: Figma node 7249:74317
 * carries characterStyleOverrides splitting "Talent Search Results" at index 7
 * — "Talent " stays #111111 while "Search Results" is italic #387440. Both
 * runs are Instrument Serif 40/52 with -2 letter-spacing.
 */
const TalentSearchHeader = ({ onSearch, onOpenFilters, filterCount = 0, className }) => {
  log('render', { heading: `${PAGE_HEADING.lead}${PAGE_HEADING.accent}` });

  return (
    <div
      className={classNames(
        'flex w-full flex-wrap items-center justify-between gap-6 max-md:gap-[10px]',
        className
      )}
    >
      <div className="flex min-w-0 flex-col gap-[3px]">
        <h1
          className="font-display not-italic tracking-[-2px] max-md:tracking-[-0.5px] max-md:text-[24px]! max-md:leading-[1.2]! text-black"
          /* Figma 40px/52 — clamped per the fluid-sizing rule. */
          style={{ fontSize: 'clamp(1.75rem, 1.4rem + 1.1vw, 2.5rem)', lineHeight: 1.3 }}
        >
          {PAGE_HEADING.lead}
          <span className="italic text-brand-green">{PAGE_HEADING.accent}</span>
        </h1>
        <p className="font-sans text-[16px] leading-6 tracking-[0.2px] text-[#999999] max-md:hidden">
          {PAGE_SUBHEADING}
        </p>
      </div>

      {/* Figma 7249:74321 "GTHInput" — 450x49, r12.16, 1.22px #cccccc border,
          solid 3.04px #bfbfbf drop shadow (no blur). */}
      {/* Below md: search + an icon-only Filters button share ONE row (the sheet it
          opens lives in TalentSearchSection). `md:contents` keeps desktop's DOM
          layout: the label stays a direct flex item of the row above. */}
      <div className="flex w-full items-center gap-[8px] md:contents">
        <label className="flex h-[49px] max-lg:h-[44px] max-md:w-auto max-md:min-w-0 max-md:flex-1 max-md:shrink w-full max-w-[450px] shrink-0 items-center gap-[9.73px] rounded-[12.16px] max-lg:rounded-[10px] border-[1.22px] max-lg:border border-[#cccccc] bg-white px-[24px] max-lg:px-[12px] shadow-[0_3.04px_0_0_#bfbfbf] max-lg:shadow-none focus-within:border-brand-green">
          <span className="sr-only">{SEARCH_PLACEHOLDER}</span>
          <SearchIcon className="size-[19.45px] shrink-0 text-[#595959]" />
          <input
            type="search"
            placeholder={SEARCH_PLACEHOLDER}
            onChange={(event) => {
              log('search input', { length: event.target.value.length });
              onSearch?.(event.target.value);
            }}
            className="min-w-0 flex-1 bg-transparent font-sans text-[14.5px] max-lg:text-[16px] leading-[24.31px] tracking-[0.24px] text-black outline-none placeholder:text-[#999999]"
          />
        </label>
        <button
          type="button"
          aria-label={`Filters (${filterCount})`}
          aria-haspopup="dialog"
          onClick={() => {
            log('branch', { action: 'open-filter-sheet', count: filterCount });
            onOpenFilters?.();
          }}
          className="relative grid size-[44px] shrink-0 place-items-center rounded-[10px] border border-brand-green bg-white text-brand-green transition-colors hover:bg-brand-green-light md:hidden"
        >
          <MoreFiltersIcon className="size-[18px]" />
          {filterCount > 0 && (
            <span className="absolute -right-[6px] -top-[6px] inline-flex h-[20px] min-w-[20px] items-center justify-center rounded-full border-2 border-white bg-brand-green px-[4px] font-sans text-[12px] font-semibold leading-none tabular-nums text-white">
              {filterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default TalentSearchHeader;
