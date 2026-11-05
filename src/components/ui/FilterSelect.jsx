import { useEffect, useId, useRef, useState } from 'react';
import { classNames } from '../../utils/classNames.js';
import chevronDown from '../../assets/recruiter-dashboard/chevron-down.svg';
import checkMark from '../../assets/recruiter-dashboard/check-active.svg';

/*
 * FilterSelect — the compact filter dropdown of the dashboard widgets (Figma "Select · …" 8158:2218 as drawn in 10049:58737 / 10084:77697).
 * Trigger: 36px, 10px radius, #fffefc face, 1px #dbded9 border, optional leading glyph, 12/500 label, chevron.
 * Menu: white card under the trigger, an uppercase group label ("SORT JOBS BY"), rows with a glyph, a 13/500 label, a 11px description and a check on the selected row.
 *
 * Controlled or not: pass `open` + `onOpenChange` to drive it from the URL (the Figma "dropdown open" frames), otherwise it keeps its own state.
 * Props: label (the trigger text), icon (src), options [{ value, label, description, icon, tag }, or { kind: 'label', label } for a group heading], value, onChange(value), menuLabel, align ('left' | 'right'),
 * width (menu px, default 220), ariaLabel, open, onOpenChange, className, triggerClassName.
 */
const FilterSelect = ({
  label,
  icon,
  options = [],
  value,
  onChange,
  menuLabel,
  align = 'right',
  width = 220,
  ariaLabel,
  open: openProp,
  onOpenChange,
  className,
  triggerClassName,
}) => {
  const [openState, setOpenState] = useState(false);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : openState;
  const rootRef = useRef(null);
  const menuId = useId();

  const setOpen = (next) => {
    if (!controlled) setOpenState(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
    // setOpen closes over props that do not change identity per render in a way that matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div ref={rootRef} className={classNames('relative', className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={ariaLabel}
        onClick={() => setOpen(!open)}
        className={classNames(
          'inline-flex h-[36px] cursor-pointer items-center gap-[6px] rounded-[10px] border border-solid border-[#dbded9] bg-[#fffefc] py-[7px] pr-[10px] pl-[12px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] whitespace-nowrap text-[#111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
          open && 'border-[#387440]',
          triggerClassName
        )}
      >
        {icon ? (
          <img src={icon} alt="" aria-hidden="true" className="size-[14px] shrink-0" />
        ) : null}
        <span>{label}</span>
        <img src={chevronDown} alt="" aria-hidden="true" className="size-[14px] shrink-0" />
      </button>

      {open ? (
        <div
          id={menuId}
          role="listbox"
          aria-label={menuLabel || ariaLabel}
          style={{ width }}
          className={classNames(
            'absolute top-[calc(100%+6px)] z-30 flex max-w-[calc(100vw-32px)] flex-col gap-[2px] rounded-[12px] border border-solid border-[#e5e8e3] bg-white p-[6px] shadow-[0_12px_32px_-8px_rgba(15,15,10,0.18),0_2px_6px_rgba(15,15,10,0.06)]',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {menuLabel ? (
            <div className="px-[10px] pt-[8px] pb-[6px] font-sans text-[10px] leading-[14px] font-semibold tracking-[0.6px] text-[#575755] uppercase">
              {menuLabel}
            </div>
          ) : null}
          {options.map((option) => {
            if (option.kind === 'label') {
              return (
                <div
                  key={`label-${option.label}`}
                  className="px-[10px] pt-[8px] pb-[4px] font-sans text-[10px] leading-[14px] font-semibold tracking-[0.6px] text-[#575755] uppercase"
                >
                  {option.label}
                </div>
              );
            }
            const selected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange?.(option.value);
                  setOpen(false);
                }}
                className={classNames(
                  'flex w-full cursor-pointer items-center gap-[10px] rounded-[8px] px-[10px] py-[8px] text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-green',
                  selected ? 'bg-[#ebf1ec]' : 'hover:bg-[#f8f8f4]'
                )}
              >
                {option.icon ? (
                  <img
                    src={option.icon}
                    alt=""
                    aria-hidden="true"
                    className="size-[16px] shrink-0"
                  />
                ) : null}
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="font-sans text-[13px] leading-[18px] font-medium text-[#111]">
                    {option.label}
                  </span>
                  {option.description ? (
                    <span className="font-sans text-[11px] leading-[16px] text-[#575755]">
                      {option.description}
                    </span>
                  ) : null}
                </span>
                {option.tag ? (
                  <span className="shrink-0 font-sans text-[12px] leading-[16px] font-medium text-[#575755]">
                    {option.tag}
                  </span>
                ) : null}
                {selected ? (
                  <img src={checkMark} alt="" aria-hidden="true" className="size-[14px] shrink-0" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default FilterSelect;
