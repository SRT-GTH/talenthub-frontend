import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { SearchIcon } from '../../shared/assets.jsx';
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
const TalentSearchHeader = ({ onSearch, className }) => {
  log('render', { heading: `${PAGE_HEADING.lead}${PAGE_HEADING.accent}` });

  return (
    <div
      className={classNames('flex w-full flex-wrap items-center justify-between gap-6', className)}
    >
      <div className="flex min-w-0 flex-col gap-[3px]">
        <h1
          className="font-display not-italic tracking-[-2px] text-black"
          /* Figma 40px/52 — clamped per the fluid-sizing rule. */
          style={{ fontSize: 'clamp(1.75rem, 1.4rem + 1.1vw, 2.5rem)', lineHeight: 1.3 }}
        >
          {PAGE_HEADING.lead}
          <span className="italic text-brand-green">{PAGE_HEADING.accent}</span>
        </h1>
        <p className="font-sans text-[16px] leading-6 tracking-[0.2px] text-[#999999]">
          {PAGE_SUBHEADING}
        </p>
      </div>

      {/* Figma 7249:74321 "GTHInput" — 450x49, r12.16, 1.22px #cccccc border,
          solid 3.04px #bfbfbf drop shadow (no blur). */}
      <label className="flex h-[49px] w-full max-w-[450px] shrink-0 items-center gap-[9.73px] rounded-[12.16px] border-[1.22px] border-[#cccccc] bg-white px-[24px] shadow-[0_3.04px_0_0_#bfbfbf] focus-within:border-brand-green">
        <span className="sr-only">{SEARCH_PLACEHOLDER}</span>
        <SearchIcon className="size-[19.45px] shrink-0 text-[#595959]" />
        <input
          type="search"
          placeholder={SEARCH_PLACEHOLDER}
          onChange={(event) => {
            log('search input', { length: event.target.value.length });
            onSearch?.(event.target.value);
          }}
          className="min-w-0 flex-1 bg-transparent font-sans text-[14.5px] leading-[24.31px] tracking-[0.24px] text-black outline-none placeholder:text-[#999999]"
        />
      </label>
    </div>
  );
};

export default TalentSearchHeader;
