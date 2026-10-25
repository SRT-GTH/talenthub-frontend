import { useEffect, useId, useRef } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('ViewByMenu');

/*
 * ViewByMenu — the "View by <value> ▾" dropdown of the Breakdown card (Figma 8710:421174: 180x32, white, 1px #e7e7e7, r10, p 7/10/7/12, gap 6;
 * "View by" 13/16 400 #575755 + value 13/16 600 #1c2a21 + chevron 16). The open list (11.4.6d, 8707:422622) is a listbox under the button.
 * Props: label (accessible name), options [{id,label}], value, open, onOpenChange(bool), onSelect(id), className.
 * Keyboard: Enter/Space/ArrowDown opens, ArrowUp/Down move, Enter selects, Esc closes and returns focus to the button.
 */

const Chevron = ({ open }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    className={classNames(
      'size-[16px] shrink-0 text-[#595959] transition-transform',
      open && 'rotate-180'
    )}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m4 6 4 4 4-4" />
  </svg>
);

const ViewByMenu = ({
  label = 'View by',
  options,
  value,
  open,
  onOpenChange,
  onSelect,
  className,
}) => {
  const uid = useId();
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const itemRefs = useRef([]);
  const current = options.find((o) => o.id === value) ?? options[0];

  useEffect(() => {
    if (!open) return undefined;
    log('open');
    const idx = Math.max(
      0,
      options.findIndex((o) => o.id === current.id)
    );
    itemRefs.current[idx]?.focus();
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) onOpenChange(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open, options, current.id, onOpenChange]);

  const onKey = (e) => {
    const i = itemRefs.current.findIndex((el) => el === document.activeElement);
    if (e.key === 'Escape') {
      e.preventDefault();
      onOpenChange(false);
      buttonRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      itemRefs.current[(i + 1) % options.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      itemRefs.current[(i - 1 + options.length) % options.length]?.focus();
    } else if (e.key === 'Tab') {
      onOpenChange(false);
    }
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
        onClick={() => onOpenChange(!open)}
        className="flex min-h-[32px] cursor-pointer items-center gap-[6px] rounded-[10px] border border-solid border-[#e7e7e7] bg-white py-[7px] pr-[10px] pl-[12px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <span className="text-[13px] leading-[16px] text-[#575755]">{label}</span>
        <span className="text-[13px] leading-[16px] font-semibold whitespace-nowrap text-[#1c2a21]">
          {current.label}
        </span>
        <Chevron open={open} />
      </button>
      {open && (
        <ul
          id={uid}
          role="listbox"
          aria-label={label}
          onKeyDown={onKey}
          className="absolute top-[calc(100%+6px)] right-0 z-20 m-0 flex max-h-[60dvh] w-[260px] max-w-[calc(100vw-48px)] list-none flex-col gap-[2px] overflow-y-auto rounded-[14px] border border-solid border-[#e7e7e7] bg-white p-[8px] shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        >
          <li
            role="presentation"
            className="px-[10px] pt-[4px] pb-[2px] text-[11px] leading-[13px] font-semibold tracking-[0.66px] text-[#575755] uppercase"
          >
            View by
          </li>
          {options.map((o, i) => (
            <li key={o.id} role="presentation">
              <button
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="option"
                aria-selected={o.id === current.id}
                aria-disabled={o.locked || undefined}
                onClick={() => {
                  if (o.locked) return;
                  log('select', o.id);
                  onSelect(o.id);
                  onOpenChange(false);
                  buttonRef.current?.focus();
                }}
                className={classNames(
                  'flex min-h-[32px] w-full flex-col items-start justify-center rounded-[8px] px-[10px] py-[6px] text-left text-[14px] leading-[17px] focus-visible:outline-2 focus-visible:outline-[#387440]',
                  o.locked ? 'cursor-not-allowed' : 'cursor-pointer',
                  o.id === current.id
                    ? 'bg-[#ebf1ec] font-semibold text-[#387440]'
                    : classNames(
                        'bg-transparent font-medium hover:bg-[#f8f8f4]',
                        o.locked ? 'text-[#575755]' : 'text-[#1c2a21]'
                      )
                )}
              >
                {o.label}
                {o.note ? (
                  <span
                    className={classNames(
                      'text-[12px] leading-[15px] font-normal',
                      o.locked ? 'text-[#387440]' : 'text-[#575755]'
                    )}
                  >
                    {o.note}
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewByMenu;
