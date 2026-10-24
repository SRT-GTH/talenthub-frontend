import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { PublicIconSearch } from '../publicDataIcons.jsx';
import FilterChip from '../ui/FilterChip.jsx';
import FilterMenu from '../ui/FilterMenu.jsx';
import { labelOf } from './data/directoryData.js';

const log = debug('DirectoryControls');

/*
 * DirectoryControls — the "controls" row of both directories (Figma 8498:87 / 8498:349062, 1360x44, gap 12):
 *   [search 380|340 x44: white, 1px #e7e7e7, r12, p 12/16, icon 18 #70706e, 15/18 #595959] [filter chips Type ▾ · Region ▾ · …]      "185 partners"
 * Phone (8508:378 / 8508:384): the search is full width on its own row, the chips (short labels) sit below it and WRAP (the Figma row
 * scrolls; wrapping keeps the open menu un-clipped), no count (the subtitle carries it).
 * The chips are the shared FilterChip + FilterMenu. An active chip reads "Type: NGO ✕" (Figma 8498:324). The search writes `q`.
 * ⚠️ ASSUMPTION: the open menus are not drawn (see FilterMenu); on phones they open under the chip like on desktop.
 * Props
 *   searchLabel   string   placeholder + accessible name ("Search partners by name or focus")
 *   searchShort   string   phone placeholder ("Search partners")
 *   searchWidth   string   Tailwind width class of the desktop field ("md:w-[380px]")
 *   q, onQ(text)
 *   definitions   [{ key, label, shortLabel, options:[{id,label}], allLabel }]
 *   values        { [key]: id | null }
 *   onFilter(key, id | null)
 *   resultText    string   "185 partners" / "3 partners match" (an aria-live status)
 */

const useIsWide = () => {
  const [wide, setWide] = useState(() =>
    typeof window === 'undefined' ? true : window.matchMedia('(min-width: 768px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
};

const DirectoryControls = ({
  searchLabel,
  searchShort,
  searchWidth = 'md:w-[380px]',
  q,
  onQ,
  definitions,
  values,
  onFilter,
  resultText,
  className,
}) => {
  const [openKey, setOpenKey] = useState(null);
  const wide = useIsWide();
  const uid = useId();
  const rootRef = useRef(null);
  const chipRefs = useRef({});

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
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        log('outside click', openKey);
        setOpenKey(null);
      }
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [openKey]);

  return (
    <div
      ref={rootRef}
      className={classNames(
        'flex flex-col gap-[16px] md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-[12px] md:gap-y-[12px]',
        className
      )}
    >
      <div className="flex flex-col gap-[16px] md:flex-row md:flex-wrap md:items-center md:gap-[10px]">
        <label
          className={classNames(
            'flex h-[44px] w-full items-center gap-[10px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[14px] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440] md:px-[16px]',
            searchWidth
          )}
        >
          <PublicIconSearch className="size-[18px] shrink-0 text-[#70706e]" />
          <input
            type="search"
            value={q}
            onChange={(e) => onQ?.(e.target.value)}
            placeholder={wide ? searchLabel : (searchShort ?? searchLabel)}
            aria-label={searchLabel}
            className="min-w-0 flex-1 bg-transparent font-sans text-[15px] leading-[18px] text-[#1c2a21] outline-none placeholder:text-[#595959] [&::-webkit-search-cancel-button]:hidden"
          />
        </label>
        <div
          role="group"
          aria-label="Filters"
          className="flex flex-wrap items-center gap-[8px] md:gap-[10px]"
        >
          {definitions.map((d) => {
            const id = values?.[d.key] ?? null;
            const chosen = id ? labelOf(d.options, id) : null;
            const menuId = `${uid}-${d.key}`;
            return (
              <div key={d.key} className={classNames('relative', d.desktopOnly && 'max-md:hidden')}>
                <FilterChip
                  label={
                    chosen ? `${d.label}: ${chosen}` : wide ? d.label : (d.shortLabel ?? d.label)
                  }
                  active={Boolean(chosen)}
                  open={openKey === d.key}
                  controls={menuId}
                  buttonRef={(el) => {
                    chipRefs.current[d.key] = el;
                  }}
                  onClick={() => setOpenKey((k) => (k === d.key ? null : d.key))}
                  onClear={() => onFilter?.(d.key, null)}
                  clearLabel={`Clear ${d.label} filter`}
                />
                {openKey === d.key && (
                  <FilterMenu
                    id={menuId}
                    label={d.label}
                    options={d.options}
                    value={id}
                    allLabel={d.allLabel}
                    onSelect={(next) => onFilter?.(d.key, next)}
                    onClose={closeMenu}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <p
        role="status"
        aria-live="polite"
        className="m-0 hidden font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21] md:block"
      >
        {resultText}
      </p>
    </div>
  );
};

export default DirectoryControls;
