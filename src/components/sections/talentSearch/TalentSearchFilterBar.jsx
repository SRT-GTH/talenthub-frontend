import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import DashboardPageBackground from '../dashboard/DashboardPageBackground.jsx';
import { FilterRemoveIcon, MoreFiltersIcon } from './talentSearchIcons.jsx';
import { FILTER_CHIPS, MORE_FILTERS_LABEL, RESULT_TABS } from './talentSearchData.js';

const log = debug('TalentSearchFilterBar');

/*
 * TalentSearchFilterBar — active filter chips plus the result-set segmented
 * control. Figma 7249:74327.
 *
 * STICKY: the Figma frame is annotated "This section becomes fixed on scroll",
 * so this is a `sticky top-0` full-bleed child of DashboardShell's <main>.
 * It carries its own DashboardPageBackground copy for exactly the reason that
 * component documents — a `background-attachment: fixed` layer keeps the bar
 * opaque while staying pixel-aligned with the page behind it, which neither a
 * translucent wash nor a `position: fixed` copy managed. Horizontal padding
 * lives here rather than on a parent, because a sticky element sticks to its
 * container's PADDING edge; padding on an ancestor would leave a permanent gap
 * above the bar that scrolled content bleeds through.
 *
 * The segmented control reuses the geometry Figma also uses for the Talent
 * Profile Panel switcher (#f2f2f2 track, white active pill, 6px gap, 4px pad).
 */
const TalentSearchFilterBar = ({ activeTabId, onSelectTab, onOpenMoreFilters, className }) => {
  log('render', { activeTabId, chipCount: FILTER_CHIPS.length });

  return (
    <div className={classNames('sticky top-0 z-20 w-full overflow-hidden py-[4px]', className)}>
      <DashboardPageBackground className="z-0" />

      <div className="relative z-10 flex w-full flex-wrap items-center justify-between gap-[16px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)]">
        {/* Active filters — Figma 7249:74328, gap 8 */}
        <div className="flex flex-wrap items-center gap-[8px]">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => {
                log('branch', { chip: chip.id, action: 'edit-filter', wired: false });
              }}
              className="inline-flex h-[29.39px] items-center gap-[8px] rounded-[8px] border border-brand-green-light-hover bg-white px-[12px] transition-colors hover:bg-neutral"
            >
              <span className="font-sans text-[11px] font-semibold leading-[15.4px] tracking-[0.44px] text-content-muted">
                {chip.label}
              </span>
              <span className="font-sans text-[13px] font-medium leading-[13px] text-[#1c1c1a]">
                {chip.value}
              </span>
              <FilterRemoveIcon className="size-[7px] text-[#1c1c1a]" />
            </button>
          ))}

          {/* Figma 7249:74354 — separated from the chips by an 8px left border */}
          <span className="border-l border-brand-green-light-hover pl-[8px]">
            <button
              type="button"
              onClick={() => {
                log('branch', { action: 'more-filters', wired: false });
                onOpenMoreFilters?.();
              }}
              className="inline-flex items-center gap-[3.99px] text-brand-green transition-opacity hover:opacity-80"
            >
              <MoreFiltersIcon className="size-[10.5px]" />
              {/* Figma 7249:74354 — 13/13 semibold #387440 */}
              <span className="font-sans text-[13px] font-semibold leading-[13px]">
                {MORE_FILTERS_LABEL}
              </span>
            </button>
          </span>
        </div>

        {/* Segmented control — Figma 7249:74604, 300x44 */}
        {/* Figma 7249:74355 — a FIXED 300x44 track holding three FIXED
            93.33px tabs (4px pad + 6px gaps). Their 24px side padding plus
            labels of 66 / 91 / 77px overflows that width, so Figma clips the
            last tab — `overflow-hidden` + fixed widths reproduce that instead
            of letting the group stretch. */}
        <div
          role="tablist"
          aria-label="Result filter"
          className="flex h-[44px] w-[300px] shrink-0 items-center gap-[6px] overflow-hidden rounded-[8px] bg-[#f2f2f2] p-[4px] shadow-[0_1px_2px_0_rgba(0,0,0,0.17)]"
        >
          {RESULT_TABS.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  log('branch', { tab: tab.id });
                  onSelectTab?.(tab.id);
                }}
                className={classNames(
                  'flex h-[36px] w-[93.33px] shrink-0 items-center justify-center overflow-hidden whitespace-nowrap px-[24px]',
                  'font-sans text-[13px] font-medium leading-[15.51px] transition-all duration-300 ease-in',
                  isActive
                    ? 'rounded-[8px] border border-[#e5e5e5] bg-white text-brand-green'
                    : 'rounded-pill text-[#595959]'
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TalentSearchFilterBar;
