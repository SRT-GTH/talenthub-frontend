import { useRef } from 'react';
import { classNames } from '../../../../utils/classNames.js';

/*
 * SegmentedControl — the range switch of the outcomes / trends pages (Figma "segmented" 8496:98: #f2f2ee r12 p4 gap 2; options
 * "Last 90 days" · "Last 12 months" · "All time", each r9 p 8/14, 14/17; selected = white + shadow 0 1px 3px, 600 #1c2a21; idle 500 #595959).
 * Extra primitive (not in the P0 list) added because outcomes and trends both draw it.
 * Props
 *   options   [{ id, label }]
 *   value     string       selected id
 *   onChange  fn(id)
 *   ariaLabel string       "Time range"
 *   className
 * Keyboard: radiogroup pattern — ArrowLeft/Right move and select, one tab stop (roving tabindex).
 */

const SegmentedControl = ({ options, value, onChange, ariaLabel, className }) => {
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
    onChange?.(options[next].id);
  };
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={classNames(
        'inline-flex gap-[2px] rounded-[12px] bg-[#f2f2ee] p-[4px] font-sans',
        className
      )}
    >
      {options.map((o, i) => {
        const selected = o.id === value;
        return (
          <button
            key={o.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={i === index ? 0 : -1}
            onClick={() => onChange?.(o.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={classNames(
              'min-h-[33px] cursor-pointer rounded-[9px] px-[14px] py-[8px] text-[14px] leading-[17px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
              selected
                ? 'bg-white font-semibold text-[#1c2a21] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                : 'bg-transparent font-medium text-[#595959]'
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
