import { useEffect, useRef } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { SearchIcon } from '../../shared/assets.jsx';

const log = debug('RecruiterListToolbar');

/*
 * RecruiterListToolbar — the filter-chip row + search field + primary action
 * that heads the Job Postings and Job Templates lists (Figma 7249:75871 /
 * 7249:75888 and 7249:75100 / 7249:75126, identical geometry). Extracted so the
 * two screens share one responsive treatment instead of two copies.
 *
 * >= lg this is the exact Figma row: chips left, a 362px search field + 166px
 * button right, never wrapping, gap 28.93.
 *
 * Below lg (wiki/responsive-plan.md §4, "Filters / search rows"):
 *   - the search group moves FIRST and spans the full width; on phones the
 *     primary action drops under the field as a full-width 48px button
 *   - chips become a single horizontally scrolling row that bleeds to the
 *     screen edges on phones (wraps on tablets), 44px tall, with the active
 *     chip scrolled into view
 *   - the field is 16px so iOS Safari does not zoom on focus
 *
 * Props
 *   chips         [{ id, label, count? }]
 *   activeChipId  id of the active chip
 *   onChipSelect  (id) => void
 *   searchLabel   placeholder + accessible name
 *   onSearch      (value) => void
 *   actionLabel   primary button text
 *   onAction      () => void
 */
const RecruiterListToolbar = ({
  chips,
  activeChipId,
  onChipSelect,
  searchLabel,
  onSearch,
  actionLabel,
  onAction,
  className,
}) => {
  const chipRowRef = useRef(null);

  // Keep the active chip visible when the row scrolls (phones only matter).
  useEffect(() => {
    const row = chipRowRef.current;
    const active = row?.querySelector('[aria-pressed="true"]');
    if (!row || !active || row.scrollWidth <= row.clientWidth) return;
    log('branch: scrolling active chip into view', { activeChipId });
    row.scrollLeft = active.offsetLeft - (row.clientWidth - active.offsetWidth) / 2;
  }, [activeChipId]);

  return (
    <div
      className={classNames(
        'flex items-center justify-between gap-[28.93px] max-lg:flex-col max-lg:items-stretch max-lg:gap-[12px]',
        className
      )}
    >
      {/* Filter chips — Figma gap 8, h37, r100 */}
      <div
        ref={chipRowRef}
        className="no-scrollbar flex flex-wrap items-center gap-[8px] max-sm:-mx-[16px] max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:px-[16px] max-sm:py-[2px] max-sm:[mask-image:linear-gradient(to_right,#000_calc(100%-28px),transparent)]"
      >
        {chips.map((chip) => {
          const isActive = chip.id === activeChipId;
          return (
            <button
              key={chip.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChipSelect?.(chip.id)}
              className={classNames(
                'relative inline-flex h-[37px] max-lg:h-[30px] shrink-0 items-center gap-[4px] rounded-pill border-[1.22px] border-brand-green-light-hover px-[14px] max-lg:px-[12px] max-lg:after:absolute max-lg:after:-inset-x-[2px] max-lg:after:-inset-y-[7px]',
                'font-sans tracking-[0.24px] shadow-[0_1.22px_3.65px_0_rgba(0,0,0,0.08)] max-lg:shadow-none transition-all duration-300 ease-in',
                isActive
                  ? 'bg-brand-green text-[14.59px] max-lg:text-[13px] font-semibold text-white'
                  : 'bg-white text-[14px] max-lg:text-[13px] font-medium text-content-helper hover:bg-neutral'
              )}
            >
              {chip.label}
              {chip.count && <span>{chip.count}</span>}
            </button>
          );
        })}
      </div>

      {/* Search + action — Figma: fixed 362px input + button, gap 19.29, never wrapping */}
      <div className="flex shrink-0 flex-nowrap items-center gap-[19.29px] max-lg:order-first max-lg:w-full max-lg:shrink max-lg:gap-[8px]">
        <label className="flex h-[49px] w-[362px] shrink-0 items-center gap-[9.73px] rounded-[12px] border-[1.22px] border-[#cccccc] bg-white px-[24px] shadow-[0_3.04px_0_0_#bfbfbf] focus-within:border-brand-green max-lg:h-[44px] max-lg:w-auto max-lg:min-w-0 max-lg:flex-1 max-lg:rounded-[10px] max-lg:border max-lg:px-[12px] max-lg:shadow-none">
          <span className="sr-only">{searchLabel}</span>
          <SearchIcon className="size-[19.45px] max-lg:size-[18px] shrink-0 text-[#595959]" />
          <input
            type="search"
            placeholder={searchLabel}
            onChange={(event) => {
              log('search', { length: event.target.value.length });
              onSearch?.(event.target.value);
            }}
            className="min-w-0 flex-1 bg-transparent font-sans text-[14.5px] leading-[24.31px] text-black outline-none placeholder:text-[#999999] max-lg:text-[16px]"
          />
        </label>
        <button
          type="button"
          aria-label={actionLabel}
          onClick={onAction}
          className="inline-flex h-[49px] shrink-0 items-center justify-center whitespace-nowrap rounded-[12.05px] border-[2.41px] border-brand-green-dark bg-brand-green px-[24.11px] font-sans text-[14px] font-medium leading-[16.71px] tracking-[0.12px] text-white shadow-[0_4.82px_0_0_#224626] transition-all duration-300 ease-in hover:bg-brand-green-hover active:translate-y-[4.82px] active:shadow-none max-lg:h-[40px] max-lg:rounded-[10px] max-lg:border max-lg:px-[14px] max-lg:shadow-none max-lg:active:translate-y-0 max-sm:size-[44px] max-sm:shrink-0 max-sm:px-0"
        >
          {/* Phones: icon-only so the field keeps the row; the label stays for screen readers. */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            aria-hidden="true"
            className="size-[20px] sm:hidden"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span className="max-sm:sr-only">{actionLabel}</span>
        </button>
      </div>
    </div>
  );
};

export default RecruiterListToolbar;
