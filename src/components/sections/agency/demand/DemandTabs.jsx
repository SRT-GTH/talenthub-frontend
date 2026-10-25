import { useRef } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { DEMAND_VIEWS } from './data/demandData.js';

const log = debug('DemandTabs');

/*
 * DemandTabs — "GTH-DASH · Page tabs" (Figma 8710:420742, 1329x32): Skill demand · Trends · Success rates. Gap 28; label 15/18, active 600 #387440 with a
 * 3px #387440 r2 underline, idle 500 #575755. Phone / tablet (11.4.5o/p) draw the same tabs at 360 / 834, gap 28 on every width.
 * Props: value (view id), onChange(id), panelId. Tablist pattern: ArrowLeft/Right move and select, one tab stop (roving tabindex).
 */

const DemandTabs = ({ value, onChange, panelId }) => {
  const refs = useRef([]);
  const onKeyDown = (e, i) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + DEMAND_VIEWS.length) % DEMAND_VIEWS.length;
    refs.current[next]?.focus();
    log('arrow', DEMAND_VIEWS[next].id);
    onChange(DEMAND_VIEWS[next].id);
  };
  return (
    <div
      role="tablist"
      aria-label="Demand and outcomes views"
      className="no-scrollbar flex gap-[28px] overflow-x-auto border-b border-solid border-[#e7e7e7] font-sans"
    >
      {DEMAND_VIEWS.map((v, i) => {
        const on = v.id === value;
        return (
          <button
            key={v.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={`demand-tab-${v.id}`}
            type="button"
            role="tab"
            aria-selected={on}
            aria-controls={panelId}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(v.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={classNames(
              'relative -mb-px min-h-[32px] shrink-0 cursor-pointer bg-transparent px-[2px] pb-[10px] text-[15px] leading-[18px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
              on ? 'font-semibold text-[#387440]' : 'font-medium text-[#575755]'
            )}
          >
            {v.label}
            <span
              aria-hidden="true"
              className={classNames(
                'absolute inset-x-0 bottom-0 h-[3px] rounded-[2px]',
                on ? 'bg-[#387440]' : 'bg-transparent'
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

export default DemandTabs;
