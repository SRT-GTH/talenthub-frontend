import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { formatCount } from '../agencyFormat.js';
import {
  EXTRA_CHIP,
  REGION_OPTIONS,
  activeFilterCount,
  fieldById,
  optionLabel,
} from '../data/queriesData.js';
import { FILTER_DEFINITIONS, filterOptionLabel } from '../../publicData/ui/data/uiData.js';
import FilterChip from '../../publicData/ui/FilterChip.jsx';
import FilterMenu from '../../publicData/ui/FilterMenu.jsx';
import { PublicIconFilterBar } from '../../publicData/ui/publicUiIcons.jsx';
import QueryChoiceMenu from './QueryChoiceMenu.jsx';

const log = debug('QueryFilterBar');

/*
 * QueryFilterBar — the filter row of the agency Queries page (Figma "filter bar" 8597:390994, 1329x61: white, 1px #e7e7e7, r16, p 12/16, gap 8):
 *   [filter icon] Filter · [Region: Volta ✕] [Education level ▾] [Interest: Technology ✕] [Age range: 18–24 ✕] [Gender ▾] [+ More filters ▾]
 *   ...                                         Query · 237 talents match · Clear all · Save query
 * The Region chip opens the multi-select menu (search, counts, "Apply · 1 region"); the other four keep the single-select Theme 8 menus.
 * With extra profile filters (frame 11.5.1g 8707:421111) the row shows Region + the first three extras as chips and an active
 * "+ More filters · N" chip (✕ clears the extras); the drawer lists the rest.
 * Props: filters (parseQueryFilters), result ({ status, count }), actions (useQueryPage), menu ('region' | null), saveLabel, onSave, onMore.
 * The result text is a polite status ("Query · 237 talents match"); counts always go through formatCount() so 1–4 read "<5".
 */

const SINGLE_KEYS = ['edu', 'interest', 'age', 'gender'];
const DEFS = Object.fromEntries(FILTER_DEFINITIONS.map((d) => [d.key, d]));

const QueryFilterBar = ({
  filters,
  result,
  actions,
  menu,
  saveLabel = 'Save query',
  onSave,
  onMore,
}) => {
  const [openKey, setOpenKey] = useState(null);
  const uid = useId();
  const rootRef = useRef(null);
  const chipRefs = useRef({});
  const regionOpen = menu === 'region';
  const extraEntries = Object.entries(filters.extras);
  const hasExtras = extraEntries.length > 0;
  const total = activeFilterCount(filters);
  const anyActive = total > 0;

  const closeSingle = useCallback(
    (reason) => {
      const key = openKey;
      setOpenKey(null);
      if (key && reason !== 'tab') chipRefs.current[key]?.focus();
    },
    [openKey]
  );

  useEffect(() => {
    if (!openKey && !regionOpen) return undefined;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        log('outside click');
        setOpenKey(null);
        if (regionOpen) actions.closeMenu();
      }
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [openKey, regionOpen, actions]);

  const closeRegion = (reason) => {
    actions.closeMenu();
    if (reason !== 'tab') chipRefs.current.region?.focus();
  };

  const regionLabel = filters.region.length
    ? `Region: ${filters.region
        .map((id) => REGION_OPTIONS.find((r) => r.id === id)?.label)
        .join(', ')}`
    : 'Region';

  const singleLabel = (key) => {
    const id = filters[key];
    const label = id ? filterOptionLabel(key, id) : null;
    return label ? `${DEFS[key].label}: ${label}` : DEFS[key].label;
  };

  // zero is the one count printed as a digit (Figma: "Query · 0 talents match"); 1-4 read "<5"
  const resultText = `Query · ${result.status === 'zero' ? '0' : formatCount(result.count)} talents match`;

  const actionClass = (enabled) =>
    classNames(
      '-my-[4px] min-h-[24px] cursor-pointer bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      enabled ? 'text-[#387440]' : 'cursor-not-allowed text-[#b5b5b5]'
    );

  const regionChip = (
    <div className="relative max-md:static">
      <FilterChip
        label={regionLabel}
        active={filters.region.length > 0}
        open={regionOpen}
        controls={`${uid}-region`}
        buttonRef={(el) => {
          chipRefs.current.region = el;
        }}
        onClick={() => {
          setOpenKey(null);
          if (regionOpen) actions.closeMenu();
          else actions.openMenu('region');
        }}
        onClear={() => actions.setRegions([])}
        clearLabel="Clear Region filter"
      />
      {regionOpen ? (
        <QueryChoiceMenu
          id={`${uid}-region`}
          label="Region"
          searchLabel="Search regions"
          className="max-md:right-0 max-md:left-0 max-md:w-auto"
          options={REGION_OPTIONS}
          value={filters.region}
          onApply={actions.setRegions}
          onClose={closeRegion}
        />
      ) : null}
    </div>
  );

  return (
    <div ref={rootRef} className="relative font-sans">
      <div className="flex min-h-[61px] flex-wrap items-center gap-x-[16px] gap-y-[8px] rounded-[16px] border border-solid border-[#e7e7e7] bg-white px-[16px] py-[12px] xl:flex-nowrap">
        <div
          role="group"
          aria-label="Query filters"
          className="flex flex-wrap items-center gap-[8px] xl:flex-nowrap"
        >
          <PublicIconFilterBar className="size-[18px] shrink-0 text-[#70706e]" />
          <span className="text-[14px] leading-[17px] font-semibold text-[#595959]">Filter</span>
          {regionChip}
          {hasExtras
            ? extraEntries.slice(0, 3).map(([id, values]) => {
                const field = fieldById(id);
                return (
                  <FilterChip
                    key={id}
                    label={`${EXTRA_CHIP[id]?.chip ?? field?.label}: ${values.map((v) => optionLabel(field, v)).join(', ')}`}
                    active
                    popup="dialog"
                    onClick={onMore}
                    onClear={() => actions.setExtra(id, [])}
                    clearLabel={`Clear ${EXTRA_CHIP[id]?.summary ?? field?.label} filter`}
                  />
                );
              })
            : SINGLE_KEYS.map((key) => {
                const menuId = `${uid}-${key}`;
                return (
                  <div key={key} className="relative max-md:static">
                    <FilterChip
                      label={singleLabel(key)}
                      active={Boolean(filters[key])}
                      open={openKey === key}
                      controls={menuId}
                      buttonRef={(el) => {
                        chipRefs.current[key] = el;
                      }}
                      onClick={() => {
                        if (regionOpen) actions.closeMenu();
                        setOpenKey((k) => (k === key ? null : key));
                      }}
                      onClear={() => actions.setFilter(key, null)}
                      clearLabel={`Clear ${DEFS[key].label} filter`}
                    />
                    {openKey === key ? (
                      <FilterMenu
                        id={menuId}
                        label={DEFS[key].label}
                        options={DEFS[key].options}
                        value={filters[key] || null}
                        allLabel={DEFS[key].allLabel}
                        className="max-md:right-0 max-md:left-0 max-md:w-auto max-md:max-w-none"
                        onSelect={(id) => actions.setFilter(key, id)}
                        onClose={closeSingle}
                      />
                    ) : null}
                  </div>
                );
              })}
          <FilterChip
            label={hasExtras ? `+ More filters · ${total}` : '+ More filters'}
            active={hasExtras}
            popup="dialog"
            buttonRef={(el) => {
              chipRefs.current.more = el;
            }}
            onClick={onMore}
            onClear={actions.clearExtras}
            clearLabel="Clear the extra filters"
          />
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-x-[16px] gap-y-[6px]">
          <div
            role="status"
            aria-live="polite"
            className="text-[14px] leading-[17px] font-semibold text-[#1c2a21]"
          >
            {resultText}
          </div>
          <button
            type="button"
            disabled={!anyActive}
            onClick={actions.clearAll}
            className={actionClass(anyActive)}
          >
            Clear all
          </button>
          <button
            type="button"
            disabled={!anyActive}
            onClick={onSave}
            className={actionClass(anyActive)}
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueryFilterBar;
