import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { formatCount, isSuppressed } from '../agencyFormat.js';
import { FILTER_DEFINITIONS, filterOptionLabel } from '../../publicData/ui/data/uiData.js';
import FilterChip from '../../publicData/ui/FilterChip.jsx';
import FilterMenu from '../../publicData/ui/FilterMenu.jsx';
import { PublicIconFilterBar } from '../../publicData/ui/publicUiIcons.jsx';
import SuppressedValue from '../../publicData/ui/SuppressedValue.jsx';
import { GRANULARITY } from './data/nationalData.js';

const log = debug('AgencyFilterRow');

/*
 * AgencyFilterRow — the agency "filter bar" (Figma 8596:389746, 1329x61: white, 1px #e7e7e7, r16, p 12/16, gap 8): Filter · five chips · "+ More filters"
 * · result text · Clear all · Save as query · "Show by" Daily|Weekly|Monthly (segmented, #efefea r10 p3). With filters active the bar wraps as 11.4.2f draws.
 * Props: filters, onChange(key,id), onClearAll, onSaveQuery, onMore (opens ?modal=filters), moreActive, result {count|state}, granularity, onGranularity.
 */

const RESULT = 'text-[14px] leading-[17px] font-semibold text-[#1c2a21]';

const AgencyFilterRow = ({
  filters = {},
  onChange,
  onClearAll,
  onSaveQuery,
  onMore,
  moreActive = false,
  result,
  granularity = 'monthly',
  onGranularity,
  className,
}) => {
  const [openKey, setOpenKey] = useState(null);
  const uid = useId();
  const rootRef = useRef(null);
  const chipRefs = useRef({});
  const activeKeys = FILTER_DEFINITIONS.filter((d) => filters[d.key]).map((d) => d.key);

  const closeMenu = useCallback(
    (reason) => {
      const key = openKey;
      setOpenKey(null);
      if (key && reason !== 'tab') chipRefs.current[key]?.focus();
    },
    [openKey]
  );

  useEffect(() => {
    if (!openKey) return undefined;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpenKey(null);
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
  if (state === 'loading') resultNode = <span>Counting talents…</span>;
  else if (state === 'zero') resultNode = <span>0 talents match these filters</span>;
  else if (state === 'suppressed')
    resultNode = (
      <>
        <SuppressedValue />
        <span>&lt;5 talents · not enough data to show safely</span>
      </>
    );
  else if (typeof result?.count === 'number')
    resultNode = (
      <span>
        {formatCount(result.count)} talents
        {activeKeys.length === 1 ? ' match' : activeKeys.length > 1 ? ' match these filters' : ''}
      </span>
    );

  const idle = !activeKeys.length && state === 'count';
  const enabled = activeKeys.length > 0 || state === 'zero' || state === 'suppressed';
  const action = (on) =>
    classNames(
      '-my-[4px] min-h-[24px] bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      on ? 'cursor-pointer text-[#387440]' : 'cursor-not-allowed text-[#b5b5b5]'
    );

  return (
    <div
      ref={rootRef}
      className={classNames(
        'flex min-h-[61px] flex-wrap items-center gap-x-[16px] gap-y-[8px] rounded-[16px] border border-solid border-[#e7e7e7] bg-white px-[16px] py-[12px] font-sans',
        idle && 'xl:flex-nowrap',
        className
      )}
    >
      <div
        role="group"
        aria-label="Filters"
        className={classNames(
          'no-scrollbar flex max-w-full min-w-0 items-center gap-[8px] max-md:overflow-x-auto md:flex-wrap',
          idle && 'xl:shrink-0 xl:flex-nowrap'
        )}
      >
        <PublicIconFilterBar className="size-[18px] shrink-0 text-[#70706e]" />
        <span className="text-[14px] leading-[17px] font-semibold text-[#595959]">Filter</span>
        {FILTER_DEFINITIONS.map((d) => {
          const id = filters[d.key];
          const optionLabel = id ? filterOptionLabel(d.key, id) : null;
          const menuId = `${uid}-${d.key}`;
          return (
            <div key={d.key} className="relative">
              <FilterChip
                label={optionLabel ? `${d.label}: ${optionLabel}` : d.label}
                active={Boolean(id)}
                open={openKey === d.key}
                controls={menuId}
                buttonRef={(el) => {
                  chipRefs.current[d.key] = el;
                }}
                onClick={() => setOpenKey((k) => (k === d.key ? null : d.key))}
                onClear={() => onChange?.(d.key, null)}
                clearLabel={`Clear ${d.label} filter`}
              />
              {openKey === d.key && (
                <FilterMenu
                  id={menuId}
                  label={d.label}
                  options={d.options}
                  value={id ?? null}
                  allLabel={d.allLabel}
                  onSelect={(v) => onChange?.(d.key, v)}
                  onClose={closeMenu}
                />
              )}
            </div>
          );
        })}
        <FilterChip
          label="+ More filters"
          active={moreActive}
          popup="dialog"
          onClick={() => {
            log('open more filters');
            onMore?.();
          }}
          onClear={() => onMore?.()}
          clearLabel="Open more filters"
        />
      </div>
      <div
        className={classNames(
          'flex flex-wrap items-center gap-x-[16px] gap-y-[6px] md:ml-auto',
          idle && 'xl:flex-nowrap'
        )}
      >
        <div
          role="status"
          aria-live="polite"
          className={classNames('flex items-center gap-[10px] whitespace-nowrap', RESULT)}
        >
          {resultNode}
        </div>
        <button type="button" disabled={!enabled} onClick={onClearAll} className={action(enabled)}>
          Clear all
        </button>
        <button type="button" disabled={!enabled} onClick={onSaveQuery} className={action(enabled)}>
          Save as query
        </button>
      </div>
      <div
        className={classNames(
          'flex items-center gap-[8px]',
          activeKeys.length || state !== 'count' ? 'basis-full md:basis-auto' : ''
        )}
      >
        <span
          id={`${uid}-by`}
          className="text-[13px] leading-[16px] whitespace-nowrap text-[#575755]"
        >
          Show by
        </span>
        <div
          role="radiogroup"
          aria-labelledby={`${uid}-by`}
          className="flex gap-[2px] rounded-[10px] bg-[#efefea] p-[3px]"
        >
          {GRANULARITY.map((g) => (
            <button
              key={g.id}
              type="button"
              role="radio"
              aria-checked={granularity === g.id}
              onClick={() => onGranularity?.(g.id)}
              className={classNames(
                'min-h-[28px] cursor-pointer rounded-[8px] px-[12px] py-[6px] text-[13px] leading-[16px] focus-visible:outline-2 focus-visible:outline-[#387440]',
                granularity === g.id
                  ? 'bg-white font-semibold text-[#1c2a21] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                  : 'bg-transparent font-medium text-[#575755]'
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgencyFilterRow;
