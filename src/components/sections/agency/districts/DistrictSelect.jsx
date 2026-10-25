import { useEffect, useId, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { DistrictsArrowheadIcon } from './districtsIcons.jsx';

const log = debug('DistrictSelect');

/*
 * DistrictSelect — "GTH · Select" pill of the Districts toolbar (Figma 9396:542379 "All regions" 108x34, 9396:542384 "Sort: Most talents" 150x34):
 * white, 1px #e1eae2, r999, pl14 pr12, gap 6, label 13/16 600 #595959 + arrowhead 14.
 * ⚠️ ASSUMPTION: the open list is not drawn; it reuses the chrome of the agency "View by" menu (white, 1px #e7e7e7, r14, shadow) and a listbox.
 * Props: label (accessible name, "Region" / "Sort"), prefix (text before the selected label, "Sort: "), options [{id,label}], value, onChange(id),
 * className. Keyboard: Enter/Space/ArrowDown open · Arrow keys move · Home/End · Enter selects · Esc closes (focus back on the pill) · Tab closes.
 */

const DistrictSelect = ({ label, prefix = '', options, value, onChange, className }) => {
  const [open, setOpen] = useState(false);
  const uid = useId();
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const itemRefs = useRef([]);
  const current = options.find((o) => o.id === value) ?? options[0];

  useEffect(() => {
    if (!open) return undefined;
    const idx = Math.max(
      0,
      options.findIndex((o) => o.id === current.id)
    );
    itemRefs.current[idx]?.focus();
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open, options, current.id]);

  const close = (refocus) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  };
  const onKey = (e) => {
    const i = itemRefs.current.findIndex((el) => el === document.activeElement);
    const go = (n) => {
      e.preventDefault();
      itemRefs.current[(n + options.length) % options.length]?.focus();
    };
    if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
    } else if (e.key === 'ArrowDown') go(i + 1);
    else if (e.key === 'ArrowUp') go(i - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(options.length - 1);
    else if (e.key === 'Tab') close(false);
  };

  return (
    <div ref={rootRef} className={classNames('relative font-sans', className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? uid : undefined}
        aria-label={`${label}: ${current.label}`}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="flex h-[34px] min-h-[34px] cursor-pointer items-center gap-[6px] rounded-full border border-solid border-[#e1eae2] bg-white pr-[12px] pl-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <span className="text-[13px] leading-[16px] font-semibold whitespace-nowrap text-[#595959]">
          {prefix}
          {current.label}
        </span>
        <DistrictsArrowheadIcon
          className={classNames(
            'size-[14px] shrink-0 text-[#595959] transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>
      {open ? (
        <ul
          id={uid}
          role="listbox"
          aria-label={label}
          onKeyDown={onKey}
          className="absolute top-[calc(100%+6px)] left-0 z-30 m-0 flex max-h-[min(60dvh,360px)] w-[220px] max-w-[calc(100vw-32px)] list-none flex-col gap-[2px] overflow-y-auto rounded-[14px] border border-solid border-[#e7e7e7] bg-white p-[6px] shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        >
          {options.map((o, i) => (
            <li key={o.id ?? 'all'} role="presentation">
              <button
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="option"
                aria-selected={o.id === current.id}
                onClick={() => {
                  log('select', label, o.id);
                  onChange(o.id);
                  close(true);
                }}
                className={classNames(
                  'flex min-h-[32px] w-full cursor-pointer items-center rounded-[8px] px-[10px] py-[6px] text-left text-[14px] leading-[17px] focus-visible:outline-2 focus-visible:outline-[#387440]',
                  o.id === current.id
                    ? 'bg-[#ebf1ec] font-semibold text-[#387440]'
                    : 'bg-transparent font-medium text-[#1c2a21] hover:bg-[#f8f8f4]'
                )}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default DistrictSelect;
