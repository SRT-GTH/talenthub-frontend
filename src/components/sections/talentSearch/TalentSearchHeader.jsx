import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import RecruiterPageHeading from '../recruiterShared/RecruiterPageHeading.jsx';
import { SearchIcon } from '../../shared/assets.jsx';
import { MoreFiltersIcon } from './talentSearchIcons.jsx';
import { PAGE_HEADING, PAGE_SUBHEADING, SEARCH_PLACEHOLDER } from './talentSearchData.js';

const log = debug('TalentSearchHeader');

/*
 * TalentSearchHeader — page title, result count and the in-page search field.
 * Figma 7249:74316.
 *
 * The headline is RecruiterPageHeading titleStyle="sans" + accentClassName: Bricolage
 * Grotesque 600 34/41 (Figma 10102:35217 style runs), "Talent " #1c2a21 + "Search Results" #387440 (not italic).
 */
/*
 * Add-only props (defaults unchanged): `heading` { lead, accent, titleStyle } and `subtitle` replace the title block (TS-10 draws "Talent Search" with the
 * 34px sans title and its own subtitle); `onSearchFocus` / `onSearchSubmit` and `searchDropdown` (a node placed under the field, TS-02) make the field a typeahead.
 */
const TalentSearchHeader = ({
  searchValue = '',
  onSearch,
  onSearchFocus,
  onSearchSubmit,
  searchDropdown,
  heading,
  subtitle = PAGE_SUBHEADING,
  onOpenFilters,
  filterCount = 0,
  className,
}) => {
  const title = heading ?? {
    lead: PAGE_HEADING.lead,
    accent: PAGE_HEADING.accent,
    accentClassName: 'text-brand-green',
  };
  log('render', { heading: `${title.lead}${title.accent}`, dropdown: Boolean(searchDropdown) });

  return (
    <div
      className={classNames(
        'flex w-full flex-wrap items-center justify-between gap-6 max-md:gap-[10px]',
        className
      )}
    >
      <RecruiterPageHeading
        titleStyle={title.titleStyle ?? 'sans'}
        accentClassName={title.accentClassName}
        lead={title.lead}
        accent={title.accent}
        subtitle={subtitle}
      />

      {/* Figma 7249:74321 "GTHInput" — 450x49, r12.16, 1.22px #cccccc border,
          solid 3.04px #bfbfbf drop shadow (no blur). */}
      {/* Below md: search + an icon-only Filters button share ONE row (the sheet it
          opens lives in TalentSearchSection). `md:contents` keeps desktop's DOM
          layout: the label stays a direct flex item of the row above. */}
      <div className="flex w-full items-center gap-[8px] md:contents">
        <div className="relative w-full max-w-[450px] shrink-0 max-md:min-w-0 max-md:flex-1 max-md:shrink">
          <label
            className={classNames(
              'flex h-[49px] max-lg:h-[44px] w-full items-center gap-[9.73px] rounded-[12.16px] max-lg:rounded-[10px] bg-white px-[24px] max-lg:px-[12px] shadow-[0_3.04px_0_0_#bfbfbf] max-lg:shadow-none',
              searchDropdown
                ? 'border-[1.5px] border-[#387540]'
                : 'border-[1.22px] border-[#cccccc] max-lg:border focus-within:border-brand-green'
            )}
          >
            <span className="sr-only">{SEARCH_PLACEHOLDER}</span>
            <SearchIcon className="size-[19.45px] shrink-0 text-[#595959]" />
            <input
              type="search"
              placeholder={SEARCH_PLACEHOLDER}
              value={searchValue}
              onChange={(event) => {
                log('search input', { length: event.target.value.length });
                onSearch?.(event.target.value);
              }}
              onFocus={() => onSearchFocus?.()}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  log('search submit', { length: event.currentTarget.value.length });
                  onSearchSubmit?.(event.currentTarget.value);
                }
              }}
              role={searchDropdown ? 'combobox' : undefined}
              aria-expanded={searchDropdown ? true : undefined}
              aria-controls={searchDropdown ? 'talent-search-suggestions' : undefined}
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent font-sans text-[14.5px] max-lg:text-[16px] leading-[24.31px] tracking-[0.24px] text-black outline-none placeholder:text-[#999999]"
            />
          </label>
          {searchDropdown ? (
            <div className="absolute top-[calc(100%+8px)] right-0 z-40 w-full">
              {searchDropdown}
            </div>
          ) : null}
        </div>
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
