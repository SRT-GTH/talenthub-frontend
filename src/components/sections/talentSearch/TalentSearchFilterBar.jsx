import { useRef } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import useDismissableLayer from '../../../hooks/useDismissableLayer.js';
import { useMediaQuery } from '../../../hooks/useMediaQuery.js';
import DashboardPageBackground from '../dashboard/DashboardPageBackground.jsx';
import { FilterRemoveIcon, MoreFiltersIcon } from './talentSearchIcons.jsx';
import { ArrowheadDownIcon } from './talentSearchMenuIcons.jsx';
import { ExperienceMenu, LocationMenu, SkillsMenu, SortMenu } from './TalentSearchMenus.jsx';
import { MORE_FILTERS_LABEL, RESULT_TABS } from './talentSearchData.js';
import {
  EXPERIENCE_FILTER,
  FILTER_CHIP_EMPTY_VALUE,
  FILTER_CHIP_LABELS,
  FIRST_VISIT,
  LOCATION_FILTER,
  SKILLS_FILTER,
  SORT_MENU,
} from './talentSearchFilterData.js';
import { listParam } from './useTalentSearchState.js';

const log = debug('TalentSearchFilterBar');

/*
 * TalentSearchFilterBar — applied-filter chips, "More Filters", the result-set segmented control and the Sort control. Figma TS-01 10102:35226.
 *
 * Chips (Skills / Exp / Location, 29px, 8px radius, 1px #e1eae2) are menu triggers: the label opens its dropdown (TS-03 skills, TS-04 experience,
 * TS-05 location) and the x clears that filter (the chip then reads "Any", ⚠️ ASSUMPTION — Figma never draws a cleared chip). Below md the chips
 * live in a sideways-scrolling row that would clip a popover, so a chip press opens the filters sheet instead.
 * "More Filters" opens the drawer (TS-06; `moreFilters` is the node the section renders: popover at xl+, sheet below).
 * Sort (TS-07): 220×44 field "Sort: <option>" with the green arrowhead, panel 260 wide aligned to its right edge.
 *
 * STICKY: the Figma frame is annotated "This section becomes fixed on scroll", so this is a `sticky top-0` full-bleed child of DashboardShell's <main>.
 * The page-background copy sits in its own clipped layer (so only the background is clipped, not the popovers) and keeps the bar opaque while staying
 * pixel-aligned with the page behind it. Horizontal padding lives here, because a sticky element sticks to its container's padding edge.
 * RESPONSIVE: below md the bar is `relative`, the "More Filters" link becomes the header's "Filters (n)" button, the chips scroll sideways and the tabs and
 * Sort each take a full row. md–lg keeps the wrapping chips + 300px control; >= lg is the Figma bar.
 *
 * Props (all controlled from TalentSearchSection / the URL): filters { skills, expId, locationId, remote, radius, sortId }, tabId, menu, onMenuChange(menu|null),
 * onChange(partial URL changes), onSelectTab, moreFilters (node), hideChips (TS-10 draws none), className.
 */
const AnchoredMenu = ({ open, onClose, trigger, panel, panelClassName }) => {
  const rootRef = useRef(null);
  useDismissableLayer(rootRef, open, onClose);
  return (
    <div ref={rootRef} className="relative shrink-0">
      {trigger}
      {open ? (
        <div className={classNames('absolute z-40 max-w-[calc(100vw-32px)]', panelClassName)}>
          {panel}
        </div>
      ) : null}
    </div>
  );
};

const FilterChip = ({ chipId, label, value, open, onToggle, onClear, panelId }) => {
  const isEmpty = !value;
  return (
    <span
      className={classNames(
        'inline-flex h-[29.39px] shrink-0 items-center rounded-[8px] border border-solid bg-white transition-colors max-lg:h-[30px]',
        'border-[#e1eae2] hover:bg-neutral'
      )}
    >
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={onToggle}
        className={classNames(
          'inline-flex h-full cursor-pointer items-center gap-[8px] rounded-[8px] border-0 bg-transparent pl-[12px] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green',
          isEmpty ? 'pr-[12px]' : 'pr-[4px]'
        )}
      >
        <span className="font-sans text-[11px] leading-[15.4px] font-semibold tracking-[0.44px] whitespace-nowrap text-[#9a988f] max-lg:text-[12px]">
          {label}
        </span>
        <span className="font-sans text-[13px] leading-[13px] font-medium whitespace-nowrap text-[#1c1c1a]">
          {isEmpty ? FILTER_CHIP_EMPTY_VALUE : value}
        </span>
      </button>
      {isEmpty ? null : (
        <button
          type="button"
          aria-label={`Remove ${label.replace(':', '')} filter`}
          data-chip={chipId}
          onClick={onClear}
          className="inline-flex size-[24px] cursor-pointer items-center justify-center rounded-[6px] border-0 bg-transparent p-0 text-[#1c1c1a] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green"
        >
          <FilterRemoveIcon className="size-[7px]" />
        </button>
      )}
    </span>
  );
};

const TalentSearchFilterBar = ({
  filters,
  tabId,
  menu,
  onMenuChange,
  onChange,
  onSelectTab,
  moreFilters,
  hideChips = false,
  className,
}) => {
  const isMdUp = useMediaQuery('(min-width: 768px)');
  const isXlUp = useMediaQuery('(min-width: 1280px) and (min-height: 960px)');
  const moreRef = useRef(null);
  useDismissableLayer(moreRef, menu === 'more-filters' && isXlUp, () => onMenuChange(null));
  const experience = EXPERIENCE_FILTER.options.find((option) => option.id === filters.expId);
  const location = LOCATION_FILTER.options.find((option) => option.id === filters.locationId);
  const sort =
    SORT_MENU.options.find((option) => option.id === filters.sortId) ?? SORT_MENU.options[0];
  log('render', { tabId, menu, isMdUp, skills: filters.skills.length, exp: filters.expId });

  const toggleMenu = (id) => {
    if (!isMdUp) {
      log('branch: chip press on phone opens the filters sheet', { chip: id });
      onMenuChange('more-filters');
      return;
    }
    onMenuChange(menu === id ? null : id);
  };
  const close = (id) => () => {
    if (menu === id) onMenuChange(null);
  };

  return (
    <div
      className={classNames(
        'sticky top-0 z-20 w-full py-[4px] max-md:relative max-md:py-[4px]',
        className
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <DashboardPageBackground className="z-0" />
      </div>

      <div className="relative z-10 flex w-full flex-wrap items-center justify-between gap-[16px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)] max-md:flex-col max-md:items-stretch max-md:gap-[12px]">
        {/* Active filters — Figma 10102:35227, gap 8 */}
        <div className="flex flex-wrap items-center gap-[8px] max-md:-mx-[16px] max-md:flex-nowrap max-md:pl-[16px]">
          {hideChips ? null : (
            <div className="no-scrollbar contents max-md:-mr-[16px] max-md:flex max-md:min-w-0 max-md:flex-1 max-md:gap-[8px] max-md:overflow-x-auto max-md:pr-[16px] max-md:[mask-image:linear-gradient(to_right,#000_calc(100%-28px),transparent)]">
              <AnchoredMenu
                open={menu === 'skills' && isMdUp}
                onClose={close('skills')}
                panelClassName="top-[calc(100%+12px)] left-0"
                trigger={
                  <FilterChip
                    chipId="skills"
                    label={FILTER_CHIP_LABELS.skills}
                    value={filters.skills.join(', ')}
                    open={menu === 'skills'}
                    panelId="talent-search-skills-menu"
                    onToggle={() => toggleMenu('skills')}
                    onClear={() => onChange({ skills: 'none' })}
                  />
                }
                panel={
                  <SkillsMenu
                    skills={filters.skills}
                    onChange={(next) =>
                      onChange({ skills: listParam(next, SKILLS_FILTER.defaultSkills) })
                    }
                  />
                }
              />
              <AnchoredMenu
                open={menu === 'experience' && isMdUp}
                onClose={close('experience')}
                panelClassName="top-[calc(100%+12px)] left-0"
                trigger={
                  <FilterChip
                    chipId="experience"
                    label={FILTER_CHIP_LABELS.exp}
                    value={experience?.chip ?? ''}
                    open={menu === 'experience'}
                    panelId="talent-search-experience-menu"
                    onToggle={() => toggleMenu('experience')}
                    onClear={() => onChange({ exp: 'any' })}
                  />
                }
                panel={
                  <ExperienceMenu
                    value={filters.expId}
                    onChange={(id) =>
                      onChange({
                        exp: id === EXPERIENCE_FILTER.defaultId ? null : id,
                        menu: null,
                      })
                    }
                  />
                }
              />
              <AnchoredMenu
                open={menu === 'location' && isMdUp}
                onClose={close('location')}
                panelClassName="top-[calc(100%+12px)] left-0"
                trigger={
                  <FilterChip
                    chipId="location"
                    label={FILTER_CHIP_LABELS.location}
                    value={location?.chip ?? ''}
                    open={menu === 'location'}
                    panelId="talent-search-location-menu"
                    onToggle={() => toggleMenu('location')}
                    onClear={() => onChange({ location: 'any' })}
                  />
                }
                panel={
                  <LocationMenu
                    value={filters.locationId}
                    remote={filters.remote}
                    radius={filters.radius}
                    onChange={(id) =>
                      onChange({
                        location: id === LOCATION_FILTER.defaultId ? null : id,
                        menu: null,
                      })
                    }
                    onToggle={(id, on) =>
                      onChange(
                        id === 'remote' ? { remote: on ? null : '0' } : { radius: on ? '1' : null }
                      )
                    }
                  />
                }
              />
            </div>
          )}

          {/* Figma 10102:35249 — separated from the chips by an 8px left border; the drawer anchors here (TS-06) */}
          <span
            ref={moreRef}
            className={classNames(
              'relative max-md:hidden',
              hideChips ? 'px-[8px] py-[16px]' : 'border-l border-[#e1eae2] pl-[8px]'
            )}
          >
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={menu === 'more-filters'}
              onClick={() => {
                log('branch', { action: 'more-filters', open: menu !== 'more-filters' });
                onMenuChange(menu === 'more-filters' ? null : 'more-filters');
              }}
              className="inline-flex cursor-pointer items-center gap-[3.99px] border-0 bg-transparent p-0 text-brand-green transition-opacity hover:opacity-80 max-lg:min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              <MoreFiltersIcon className="size-[10.5px]" />
              {/* Figma 10102:35253 — 13/13 semibold #387440 */}
              <span className="font-sans text-[13px] leading-[13px] font-semibold">
                {hideChips ? FIRST_VISIT.exploreFilters : MORE_FILTERS_LABEL}
              </span>
            </button>
            {menu === 'more-filters' && isXlUp ? (
              <div className="absolute top-[calc(100%+12px)] -left-[53px] z-40">{moreFilters}</div>
            ) : null}
          </span>
        </div>

        {/* Segmented control 300×44 and Sort 220×44 — Figma 10102:35254, gap 20 */}
        <div className="flex items-center gap-[20px] max-md:flex-col max-md:items-stretch max-md:gap-[12px]">
          {/* Figma: a FIXED 300x44 track holding three FIXED 93.33px tabs (4px pad + 6px gaps). Their 24px side padding plus labels of 66 / 91 / 77px
              overflows that width, so Figma clips the last tab — `overflow-hidden` + fixed widths reproduce that instead of letting the group stretch. */}
          <div
            role="tablist"
            aria-label="Result filter"
            className="flex h-[44px] w-[300px] shrink-0 items-center gap-[6px] overflow-hidden rounded-[8px] bg-[#f2f2f2] p-[4px] shadow-[0_1px_2px_0_rgba(0,0,0,0.17)] max-md:h-[40px] max-md:w-full"
          >
            {RESULT_TABS.map((tab) => {
              const isActive = tab.id === tabId;
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
                    'flex h-[36px] w-[93.33px] shrink-0 cursor-pointer items-center justify-center overflow-hidden px-[24px] whitespace-nowrap max-md:h-[32px] max-md:w-auto max-md:flex-1 max-md:px-[4px]',
                    'font-sans text-[13px] leading-[15.51px] font-medium transition-all duration-300 ease-in',
                    isActive
                      ? 'rounded-[8px] border border-[#e5e5e5] bg-white text-brand-green'
                      : 'rounded-pill border-0 bg-transparent text-[#595959]'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <AnchoredMenu
            open={menu === 'sort'}
            onClose={close('sort')}
            panelClassName="top-[calc(100%+8px)] right-0"
            trigger={
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={menu === 'sort'}
                aria-label={`${SORT_MENU.triggerPrefix}${sort.label}`}
                onClick={() => onMenuChange(menu === 'sort' ? null : 'sort')}
                className={classNames(
                  'flex h-[44px] w-[220px] cursor-pointer items-center gap-[8px] rounded-[10px] border border-solid bg-white py-[13px] pr-[16px] pl-[20px] text-left shadow-[0_2.5px_0_rgba(191,191,191,0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green max-md:w-full',
                  menu === 'sort' ? 'border-brand-green' : 'border-[#ccc]'
                )}
              >
                <span className="min-w-0 flex-1 truncate font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#595959]">
                  {SORT_MENU.triggerPrefix}
                  {sort.label}
                </span>
                <ArrowheadDownIcon className="size-[20px] shrink-0 text-[#387440]" />
              </button>
            }
            panel={
              <SortMenu
                value={filters.sortId}
                onChange={(id) =>
                  onChange({ sort: id === SORT_MENU.defaultId ? null : id, menu: null })
                }
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default TalentSearchFilterBar;
