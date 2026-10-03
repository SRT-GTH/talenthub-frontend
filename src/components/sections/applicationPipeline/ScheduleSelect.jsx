import { useEffect, useId, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { SelectArrowIcon } from './scheduleInterviewIcons.jsx';

const log = debug('ScheduleSelect');

/*
 * ScheduleSelect — the listbox behind the three GTHInput selects in the
 * Schedule Interview modal: Assessment Type (7249:80400), and the Month / Year
 * chips beside "Available Slots".
 *
 * Trigger: 51x? / 36px, r10, 1px #cccccc with a 2.5px #bfbfbf shelf, 13/20
 * Instrument Sans 500 — placeholder #9a988f (content-helper), value #595959.
 *
 * Figma draws NO open state for these fields, so the panel borrows the file's
 * own dropdown surface (Job Postings menu, 7249:76889): white, r12, 0.7px
 * #e5e5e5, shadow 0 1.5 6.1 rgba(64,64,64,.25), 4px padding, rows with a
 * #f6f6f6 hover. The option values themselves are supplied by the caller.
 *
 * Keyboard: Enter/Space/ArrowDown opens, arrows move, Enter picks, Escape
 * closes ONLY the list — it stops the event so the modal's own Escape
 * (cancel confirmation) doesn't also fire.
 */
const ScheduleSelect = ({
  label,
  options,
  value,
  placeholder,
  onChange,
  size = 'field',
  className,
}) => {
  const listboxId = useId();
  const wrapperRef = useRef(null);
  const listRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedIndex = options.findIndex((option) => option === value);
  const isChip = size === 'chip';

  const openList = () => {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
    log('open', { label, value });
  };

  const choose = (option) => {
    log('branch', { label, picked: option });
    onChange(option);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  // Keep the keyboard-active row in view.
  useEffect(() => {
    if (!open) return;
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  const onKeyDown = (event) => {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) return openList();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((i) => (i + step + options.length) % options.length);
      return undefined;
    }
    if ((event.key === 'Enter' || event.key === ' ') && open) {
      event.preventDefault();
      choose(options[activeIndex]);
    }
    return undefined;
  };

  return (
    <div ref={wrapperRef} className={classNames('relative', className)} onKeyDown={onKeyDown}>
      <button
        type="button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => (open ? setOpen(false) : openList())}
        className={classNames(
          'flex w-full items-center justify-between gap-[8px] rounded-[10px] border bg-white text-left',
          'transition-all duration-300 ease-in',
          isChip ? 'h-[36px] px-[16px]' : 'h-[51px] px-[16px]',
          open
            ? 'border-brand-green shadow-[0_2.5px_0_0_rgba(34,70,38,0.8)]'
            : 'border-[#cccccc] shadow-[0_2.5px_0_0_rgba(191,191,191,0.8)]'
        )}
      >
        <span
          className={classNames(
            'truncate font-sans text-[13px] font-medium leading-5 tracking-[0.2px]',
            // Figma: a chosen field value reads #595959; the Month / Year chips
            // and any placeholder stay content-helper grey.
            value && !isChip ? 'text-[#595959]' : 'text-content-helper'
          )}
        >
          {value ?? placeholder}
        </span>
        <SelectArrowIcon
          className={classNames(
            'size-[20px] shrink-0 text-content-helper transition-transform duration-300 ease-in',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="no-scrollbar absolute left-0 top-[calc(100%+8px)] z-30 max-h-[216px] w-full min-w-[160px] overflow-y-auto rounded-[12px] border-[0.7px] border-[#e5e5e5] bg-white py-[4px] shadow-[0_1.5px_6.1px_0_rgba(64,64,64,0.25)]"
        >
          {options.map((option, index) => {
            const isSelected = option === value;
            return (
              <li
                key={option}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(option)}
                className={classNames(
                  'flex h-[40px] cursor-pointer items-center justify-between gap-[8px] px-[16px]',
                  'font-sans text-[14px] leading-[24px] tracking-[0.24px] transition-colors',
                  index === activeIndex && 'bg-[#f6f6f6]',
                  'active:bg-[#ededed]',
                  isSelected ? 'font-medium text-brand-green' : 'text-content-helper'
                )}
              >
                {option}
                {isSelected && (
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="size-[14px] shrink-0"
                  >
                    <path
                      d="m3 8.5 3.2 3L13 4.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ScheduleSelect;
