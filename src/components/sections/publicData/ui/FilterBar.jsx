import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { formatCount, isSuppressed } from '../publicDataFormat.js';
import { FILTER_DEFINITIONS, filterOptionLabel } from './data/uiData.js';
import FilterChip from './FilterChip.jsx';
import FilterMenu from './FilterMenu.jsx';
import { PublicIconFilterBar } from './publicUiIcons.jsx';
import SuppressedValue from './SuppressedValue.jsx';

const log = debug('FilterBar');

/*
 * FilterBar — the filter row of the overview (Figma "filter bar" 8487:345985, 1360x61: white, border #e7e7e7, radius 16, p 12/16, gap 8):
 *   [filter icon] Filter · [Region ▾] [Education level ▾] [Interest ▾] [Age range ▾] [Gender ▾]            219,428 talents · Clear all · Save as link
 * and the mobile row 8507:46 "filter chips (scroll)": bare chips with the short labels (Region · Education · Interest · Age · Gender),
 * horizontally scrollable, no bar chrome, no result text; tapping a chip opens the bottom sheet (FilterSheet) instead of a menu.
 * Props
 *   filters       { region, edu, interest, age, gender }   option ids or null/undefined (the URL values of publicDataState.js)
 *   onChange      fn(key, id | null)   a filter changed (desktop menus)
 *   onClearAll    fn()                 "Clear all"
 *   onSaveLink    fn()                 "Save as link" (the page opens the share dialog / copies the URL; this component does neither)
 *   onOpenSheet   fn()                 mobile: any chip tapped (the page sets ?modal=filters)
 *   result        { count?: number, state?: 'count' | 'loading' | 'zero' | 'suppressed' }   the right-hand text. `state` is derived from
 *                 `count` when omitted: 0 -> zero, 1-4 -> suppressed, otherwise count.
 *   definitions   FILTER_DEFINITIONS by default (see data/uiData.js)
 *   disabledKeys  string[]   chips drawn disabled (⚠️ ASSUMPTION: not drawn in Figma)
 *   className
 * Result text (verbatim from the frames): "219,428 talents" (no filter) · "38,540 talents match" (1 filter) · "237 talents match these filters"
 * (2+) · "0 talents match these filters" (zero) · "<5 talents · not enough data to show safely" with the suppressed chip (8.2.3d) ·
 * "Counting talents…" (loading). "Clear all" / "Save as link" are #b5b5b5 and disabled while no filter is set, #387440 otherwise.
 * The count is always printed through formatCount(). The result text is an aria-live="polite" status.
 */

const SEEN_ACTIVE = (filters, definitions) =>
  definitions.filter((d) => filters?.[d.key]).map((d) => d.key);

const FilterBar = ({
  filters = {},
  onChange,
  onClearAll,
  onSaveLink,
  onOpenSheet,
  result,
  definitions = FILTER_DEFINITIONS,
  disabledKeys = [],
  className,
}) => {
  const [openKey, setOpenKey] = useState(null);
  const uid = useId();
  const rootRef = useRef(null);
  const chipRefs = useRef({});
  const activeKeys = SEEN_ACTIVE(filters, definitions);
  const hasActive = activeKeys.length > 0;

  const closeMenu = useCallback(
    (reason) => {
      const key = openKey;
      setOpenKey(null);
      if (key && reason !== 'tab') chipRefs.current[key]?.focus();
    },
    [openKey]
  );

  // click outside closes the open menu
  useEffect(() => {
    if (!openKey) return undefined;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        log('outside click, close', openKey);
        setOpenKey(null);
      }
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [openKey]);

  const state =
    result?.state ??
    (typeof result?.count === 'number'
      ? result.count === 0
        ? 'zero'
        : isSuppressed(result.count)
          ? 'suppressed'
          : 'count'
      : 'count');

  let resultNode = null;
  if (state === 'loading') {
    resultNode = <span>Counting talents…</span>;
  } else if (state === 'zero') {
    resultNode = <span>0 talents match these filters</span>;
  } else if (state === 'suppressed') {
    resultNode = (
      <>
        <SuppressedValue />
        <span>&lt;5 talents · not enough data to show safely</span>
      </>
    );
  } else if (typeof result?.count === 'number') {
    const n = formatCount(result.count);
    resultNode = (
      <span>
        {n} talents
        {activeKeys.length === 1 ? ' match' : activeKeys.length > 1 ? ' match these filters' : ''}
      </span>
    );
  }

  const actionClass = (enabled) =>
    classNames(
      '-my-[4px] min-h-[24px] cursor-pointer bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      enabled ? 'text-[#387440]' : 'cursor-not-allowed text-[#b5b5b5]'
    );
  const actionsEnabled = hasActive || state === 'zero' || state === 'suppressed';

  const labelFor = (d, short) => {
    const id = filters?.[d.key];
    const optionLabel = id ? filterOptionLabel(d.key, id) : null;
    return optionLabel ? `${d.label}: ${optionLabel}` : short ? d.shortLabel : d.label;
  };

  return (
    <div ref={rootRef} className={classNames('font-sans', className)}>
      {/* desktop + tablet */}
      <div className="hidden min-h-[61px] flex-wrap items-center gap-x-[16px] gap-y-[8px] rounded-[16px] xl:flex-nowrap border border-solid border-[#e7e7e7] bg-white px-[16px] py-[12px] md:flex">
        <div className="flex flex-wrap items-center gap-[8px] xl:flex-nowrap">
          <PublicIconFilterBar className="size-[18px] shrink-0 text-[#70706e]" />
          <span className="mr-[0px] text-[14px] leading-[17px] font-semibold text-[#595959]">
            Filter
          </span>
          {definitions.map((d) => {
            const active = Boolean(filters?.[d.key]);
            const menuId = `${uid}-${d.key}`;
            return (
              <div key={d.key} className="relative">
                <FilterChip
                  label={labelFor(d, false)}
                  active={active}
                  open={openKey === d.key}
                  disabled={disabledKeys.includes(d.key)}
                  controls={menuId}
                  buttonRef={(el) => {
                    chipRefs.current[d.key] = el;
                  }}
                  onClick={() => {
                    log('toggle menu', d.key);
                    setOpenKey((k) => (k === d.key ? null : d.key));
                  }}
                  onClear={() => {
                    log('clear', d.key);
                    onChange?.(d.key, null);
                  }}
                  clearLabel={`Clear ${d.label} filter`}
                />
                {openKey === d.key && (
                  <FilterMenu
                    id={menuId}
                    label={d.label}
                    options={d.options}
                    value={filters?.[d.key] ?? null}
                    allLabel={d.allLabel}
                    onSelect={(id) => onChange?.(d.key, id)}
                    onClose={closeMenu}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-x-[16px] gap-y-[6px]">
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-[10px] text-[14px] leading-[17px] font-semibold text-[#1c2a21]"
          >
            {resultNode}
          </div>
          <button
            type="button"
            disabled={!actionsEnabled}
            onClick={onClearAll}
            className={actionClass(actionsEnabled)}
          >
            Clear all
          </button>
          <button
            type="button"
            disabled={!actionsEnabled}
            onClick={onSaveLink}
            className={actionClass(actionsEnabled)}
          >
            Save as link
          </button>
        </div>
      </div>
      {/* mobile: scrolling chips, tap opens the bottom sheet */}
      <div
        role="group"
        aria-label="Filters"
        className="no-scrollbar -mx-[16px] flex gap-[8px] overflow-x-auto px-[16px] py-[2px] md:hidden"
      >
        {definitions.map((d) => (
          <FilterChip
            key={d.key}
            label={labelFor(d, true)}
            active={Boolean(filters?.[d.key])}
            popup="dialog"
            disabled={disabledKeys.includes(d.key)}
            onClick={() => {
              log('open sheet from', d.key);
              onOpenSheet?.(d.key);
            }}
            onClear={() => onChange?.(d.key, null)}
            clearLabel={`Clear ${d.label} filter`}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
