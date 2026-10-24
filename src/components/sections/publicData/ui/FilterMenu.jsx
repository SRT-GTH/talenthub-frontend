import { useCallback, useEffect, useMemo, useRef } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('FilterMenu');

/*
 * FilterMenu — the popover list under a FilterChip (Region · Education level · Interest · Age range · Gender).
 * ⚠️ ASSUMPTION: Figma draws NO open desktop menu (only the closed / active chips and the mobile bottom sheet 8515:498). The menu reuses the
 * chrome of the map hover card (8485:60: white, 1px #e7e7e7, radius 14, shadow 0 8px 24px rgba(0,0,0,.12)) and the sheet's option text
 * (13/16 500). Single selection, matching the URL contract (one value per key).
 * Props
 *   id          string    DOM id (the chip's aria-controls)
 *   label       string    accessible name ("Region")
 *   options     [{ id, label }]
 *   value       string | null   selected option id
 *   allLabel    string    first row that clears the filter ("All regions"); omit to hide it
 *   onSelect    fn(id | null)   called on click / Enter / Space; null = the clear row
 *   onClose     fn(reason)      'escape' | 'tab' | 'select' — the owner returns focus to the chip button
 * Keyboard (listbox pattern): ArrowDown/ArrowUp move, Home/End jump, Enter/Space select, Esc closes, Tab closes. Focus enters the
 * selected option (or the first) on mount.
 */

const FilterMenu = ({ id, label, options, value, allLabel, onSelect, onClose, className }) => {
  const rows = useMemo(
    () => [...(allLabel ? [{ id: null, label: allLabel }] : []), ...options],
    [allLabel, options]
  );
  const refs = useRef([]);
  const startIndex = Math.max(
    0,
    rows.findIndex((r) => r.id === value)
  );

  useEffect(() => {
    log('open', label);
    refs.current[startIndex]?.focus();
  }, [label, startIndex]);

  const move = useCallback(
    (from, delta) => {
      const next = Math.min(rows.length - 1, Math.max(0, from + delta));
      refs.current[next]?.focus();
    },
    [rows.length]
  );

  const onKeyDown = (e, index) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        move(index, 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        move(index, -1);
        break;
      case 'Home':
        e.preventDefault();
        refs.current[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        refs.current[rows.length - 1]?.focus();
        break;
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        onClose?.('escape');
        break;
      case 'Tab':
        onClose?.('tab');
        break;
      default:
    }
  };

  return (
    <div
      className={classNames(
        'absolute top-full left-0 z-30 mt-[8px] w-max min-w-[200px] max-w-[min(320px,calc(100vw-32px))] rounded-[14px] border border-solid border-[#e7e7e7] bg-white p-[6px] font-sans shadow-[0_8px_24px_rgba(0,0,0,0.12)]',
        className
      )}
    >
      <ul
        id={id}
        role="listbox"
        aria-label={label}
        className="m-0 max-h-[320px] list-none overflow-y-auto p-0 [scrollbar-width:thin]"
      >
        {rows.map((row, i) => {
          const selected = (row.id ?? null) === (value ?? null);
          return (
            <li key={row.id ?? 'all'} role="presentation">
              <button
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="option"
                aria-selected={selected}
                tabIndex={i === startIndex ? 0 : -1}
                onClick={() => {
                  onSelect?.(row.id);
                  onClose?.('select');
                }}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={classNames(
                  'flex min-h-[36px] w-full cursor-pointer items-center justify-between gap-[16px] rounded-[10px] bg-transparent px-[12px] py-[8px] text-left text-[14px] leading-[17px] text-[#1c2a21]',
                  'hover:bg-[#ebf1ec] focus-visible:bg-[#ebf1ec] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#387440]',
                  selected ? 'font-semibold' : 'font-medium'
                )}
              >
                <span>{row.label}</span>
                {selected && (
                  <span aria-hidden="true" className="text-[#387440]">
                    ✓
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FilterMenu;
