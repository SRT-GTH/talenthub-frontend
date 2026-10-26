import { useEffect, useId, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { JobChevronIcon } from '../../shared/assets.jsx';

/*
 * JobsMenu — a chip-shaped button that opens a single-choice list (job filters and sort on /job-postings).
 * Props: label (shown on the chip), value, options [{ id, label, note? }], onChange(id), active (filled look when a filter
 * is applied), shape 'chip' | 'sort', hint (text under the options), align 'left' | 'right'.
 * Closes on choice, Escape or a click outside; arrow keys move between options.
 */

const JobsMenu = ({
  label,
  value,
  options,
  onChange,
  active = false,
  shape = 'chip',
  hint,
  align = 'left',
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    ref.current?.querySelector('[role=menuitemradio][aria-checked=true]')?.focus();
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const onListKey = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const items = [...ref.current.querySelectorAll('[role=menuitemradio]')];
    const i = items.indexOf(document.activeElement);
    items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus();
  };

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => setOpen((v) => !v)}
        className={classNames(
          'inline-flex shrink-0 cursor-pointer items-center gap-[4px] rounded-full border border-solid font-sans whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
          shape === 'sort'
            ? 'h-[34px] border-[rgba(28,42,33,0.12)] bg-white pr-[10px] pl-[14px] text-[12.5px] font-medium text-[#595959] max-lg:text-[12px]'
            : active
              ? 'h-[28px] border-[#1c2a21] bg-[#1c2a21] pr-[8px] pl-[12px] text-[12.5px] font-semibold text-white max-lg:text-[12px]'
              : 'h-[28px] border-[rgba(28,42,33,0.2)] bg-white pr-[8px] pl-[12px] text-[12.5px] font-semibold text-[#1c2a21] max-lg:text-[12px]'
        )}
      >
        {label}
        <JobChevronIcon className={classNames('size-[14px]', open && 'rotate-180')} />
      </button>
      {open ? (
        <div
          id={listId}
          role="menu"
          aria-label={label}
          onKeyDown={onListKey}
          className={classNames(
            'absolute top-[calc(100%+6px)] z-30 flex w-max max-w-[280px] min-w-[180px] flex-col gap-[2px] rounded-[12px] border border-solid border-[#e5e5e5] bg-white p-[6px] shadow-[0_2px_4px_rgba(15,15,10,0.06),0_12px_28px_-6px_rgba(15,15,10,0.12)]',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              role="menuitemradio"
              aria-checked={value === o.id}
              disabled={o.disabled}
              onClick={() => {
                onChange(o.id);
                setOpen(false);
              }}
              className={classNames(
                'flex w-full cursor-pointer flex-col items-start rounded-[8px] border-0 px-[10px] py-[8px] text-left font-sans text-[13.5px] leading-[18px] hover:bg-[#f3f8f4] focus-visible:outline-2 focus-visible:outline-[#387440] disabled:cursor-not-allowed disabled:opacity-50',
                value === o.id
                  ? 'bg-[#ebf1ec] font-semibold text-[#1c2a21]'
                  : 'bg-transparent text-[#3b3b3b]'
              )}
            >
              {o.label}
              {o.note ? (
                <span className="text-[12px] font-normal text-[#737373]">{o.note}</span>
              ) : null}
            </button>
          ))}
          {hint ? (
            <p className="m-0 px-[10px] pt-[4px] pb-[2px] font-sans text-[12px] leading-[16px] text-[#737373]">
              {hint}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default JobsMenu;
