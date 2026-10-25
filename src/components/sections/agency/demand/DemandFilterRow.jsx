import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import FilterChip from '../../publicData/ui/FilterChip.jsx';
import FilterMenu from '../../publicData/ui/FilterMenu.jsx';
import { PublicIconFilterBar } from '../../publicData/ui/publicUiIcons.jsx';

const log = debug('DemandFilterRow');

/*
 * DemandFilterRow — the filter bar of the Demand & outcomes screens (Figma 8702:50, 1329x61: white, 1px #e7e7e7, r16, p 12/16, gap 8): Filter · chips ·
 * "+ More filters" · result text · Clear all · Save as query · optional right slot ("Show by" on Trends). Same chrome as national/AgencyFilterRow, but the
 * chips are data: Region · District · Skill category | Skill · Last quarter (skills), Region · District · Programme · Last quarter (success).
 * Below lg (frames 11.4.5o/p) it is only the chips in one scrolling row, "+ More filters ✕" first and green.
 * Props: chips [{ key, label, value, options, allLabel, plain }] (value = option id; plain = a period chip that never turns green; desktopOnly = not drawn on phone / tablet, e.g. District), onChange(key, id|null),
 *   onMore(), moreActive, result (string), canClear, onClearAll, onSaveQuery, right (node).
 */

const action = (on) =>
  classNames(
    '-my-[4px] min-h-[24px] bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
    on ? 'cursor-pointer text-[#387440]' : 'cursor-not-allowed text-[#b5b5b5]'
  );

const DemandFilterRow = ({
  chips,
  onChange,
  onMore,
  moreActive = false,
  result,
  canClear = false,
  onClearAll,
  onSaveQuery,
  right,
  className,
}) => {
  const uid = useId();
  const rootRef = useRef(null);
  const chipRefs = useRef({});
  const [openKey, setOpenKey] = useState(null);

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

  const moreChip = (extra) => (
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
      className={extra}
    />
  );

  const chipNodes = chips.map((c) => {
    const menuId = `${uid}-${c.key}`;
    const selected = c.options.find((o) => o.id === c.value);
    return (
      <div
        key={c.key}
        className={classNames('relative shrink-0', c.desktopOnly && 'max-lg:hidden')}
      >
        <FilterChip
          label={
            c.plain
              ? (selected?.label ?? c.label)
              : selected
                ? `${c.label}: ${selected.label}`
                : c.label
          }
          active={!c.plain && Boolean(c.value)}
          open={openKey === c.key}
          controls={menuId}
          buttonRef={(el) => {
            chipRefs.current[c.key] = el;
          }}
          onClick={() => setOpenKey((k) => (k === c.key ? null : c.key))}
          onClear={() => onChange(c.key, null)}
          clearLabel={`Clear ${c.label} filter`}
        />
        {openKey === c.key && (
          <FilterMenu
            id={menuId}
            label={c.label}
            options={c.options}
            value={c.value ?? null}
            allLabel={c.plain ? undefined : c.allLabel}
            onSelect={(v) => onChange(c.key, v)}
            onClose={closeMenu}
            className="max-h-[320px] overflow-y-auto"
          />
        )}
      </div>
    );
  });

  return (
    <div
      ref={rootRef}
      className={classNames(
        'flex flex-col gap-[8px] font-sans lg:min-h-[61px] lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-[16px] lg:gap-y-[8px] lg:rounded-[16px] lg:border lg:border-solid lg:border-[#e7e7e7] lg:bg-white lg:px-[16px] lg:py-[12px]',
        className
      )}
    >
      <div
        role="group"
        aria-label="Filters"
        className="no-scrollbar flex max-w-full min-w-0 items-center gap-[8px] overflow-x-auto pb-[2px] lg:flex-wrap lg:overflow-visible lg:pb-0"
      >
        <PublicIconFilterBar className="hidden size-[18px] shrink-0 text-[#70706e] lg:block" />
        <span className="hidden text-[14px] leading-[17px] font-semibold text-[#595959] lg:inline">
          Filter
        </span>
        <div className="shrink-0 lg:hidden">
          <FilterChip
            label="+ More filters"
            active
            popup="dialog"
            onClick={() => onMore?.()}
            onClear={() => onMore?.()}
            clearLabel="Open more filters"
          />
        </div>
        {chipNodes}
        <div className="hidden shrink-0 lg:block">{moreChip()}</div>
      </div>
      <div className="hidden flex-wrap items-center gap-x-[16px] gap-y-[6px] lg:ml-auto lg:flex">
        <div
          role="status"
          aria-live="polite"
          className="text-[14px] leading-[17px] font-semibold text-[#1c2a21]"
        >
          {result}
        </div>
        <button
          type="button"
          disabled={!canClear}
          onClick={onClearAll}
          className={action(canClear)}
        >
          Clear all
        </button>
        <button
          type="button"
          disabled={!canClear}
          onClick={onSaveQuery}
          className={action(canClear)}
        >
          Save as query
        </button>
      </div>
      {right ? <div className="hidden lg:block">{right}</div> : null}
    </div>
  );
};

export default DemandFilterRow;
