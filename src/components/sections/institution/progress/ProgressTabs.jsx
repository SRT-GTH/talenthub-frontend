import { useRef } from 'react';
import { classNames } from '../../../../utils/classNames.js';

/*
 * ProgressTabs — the form tabs of 11.3.2a ("tabs" 8595:111): label 15 + count chip (11.5/700), the selected tab = 600 #1c2a21, 1px underline and an amber
 * (#c8951a, white) count; the others 500 #737373 with a #ebf1ec chip. Roving tabindex + arrow keys.
 * Props: tabs [{id,label,count}], value, onChange(id), label (aria-label of the tablist), panelId.
 */

const ProgressTabs = ({ tabs, value, onChange, label, panelId }) => {
  const refs = useRef({});
  const onKeyDown = (event, index) => {
    const last = tabs.length - 1;
    let next = null;
    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = last;
    if (next === null) return;
    event.preventDefault();
    onChange(tabs[next].id);
    refs.current[tabs[next].id]?.focus();
  };
  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex items-end gap-[4px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {tabs.map((tab, index) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[tab.id] = el;
            }}
            type="button"
            role="tab"
            id={`progress-tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={panelId}
            aria-label={`${tab.label}, ${tab.count}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={classNames(
              'flex shrink-0 cursor-pointer items-center gap-[8px] border-0 border-b border-solid bg-transparent px-[14px] pt-[10px] pb-[12px] font-sans text-[15px] leading-[18px] whitespace-nowrap focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#387440]',
              selected
                ? 'border-[#1c2a21] font-semibold text-[#1c2a21]'
                : 'border-transparent font-medium text-[#737373] hover:text-[#1c2a21]'
            )}
          >
            {tab.label}
            <span
              aria-hidden="true"
              className={classNames(
                'rounded-full px-[7px] py-px font-sans text-[11.5px] max-lg:text-[12px] leading-[14px] font-bold',
                selected ? 'bg-[#c8951a] text-white' : 'bg-[#ebf1ec] text-[#2d5d33]'
              )}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ProgressTabs;
