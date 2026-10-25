import { useId, useRef } from 'react';
import { classNames } from '../../../../utils/classNames.js';

/*
 * DemandSegmented — "GTH-DASH · Segmented" (Figma 8710:421032 Show by, 8710:421095 Period / Source): #efefea r10 p3 gap 2; option r8 px12 py6 13/16,
 * selected white + 0 1px 3px rgba(0,0,0,.1) 600 #1c2a21, idle 500 #575755. The same look as AgencyFilterRow's "Show by".
 * Props: label (visible lead-in, e.g. "Period"), options [{id,label}], value, onChange(id), ariaLabel, className. Radiogroup: Arrow keys move + select.
 */

const DemandSegmented = ({ label, options, value, onChange, ariaLabel, className }) => {
  const uid = useId();
  const refs = useRef([]);
  const index = Math.max(
    0,
    options.findIndex((o) => o.id === value)
  );
  const onKeyDown = (e, i) => {
    const dir =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? 1
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? -1
          : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + options.length) % options.length;
    refs.current[next]?.focus();
    onChange(options[next].id);
  };
  return (
    <div className={classNames('flex min-w-0 items-center gap-[8px] font-sans', className)}>
      {label ? (
        <span id={`${uid}-l`} className="shrink-0 text-[13px] leading-[16px] text-[#575755]">
          {label}
        </span>
      ) : null}
      <div
        role="radiogroup"
        aria-labelledby={label ? `${uid}-l` : undefined}
        aria-label={label ? undefined : ariaLabel}
        className="no-scrollbar flex min-w-0 gap-[2px] overflow-x-auto rounded-[10px] bg-[#efefea] p-[3px]"
      >
        {options.map((o, i) => (
          <button
            key={o.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={o.id === value}
            tabIndex={i === index ? 0 : -1}
            onClick={() => onChange(o.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={classNames(
              'min-h-[28px] shrink-0 cursor-pointer rounded-[8px] px-[12px] py-[6px] text-[13px] leading-[16px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#387440]',
              o.id === value
                ? 'bg-white font-semibold text-[#1c2a21] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                : 'bg-transparent font-medium text-[#575755]'
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DemandSegmented;
