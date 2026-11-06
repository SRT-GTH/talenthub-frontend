import { useEffect } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import SiteCopyChip from './SiteCopyChip.jsx';

const log = debug('SiteCopyPortalTabs');

/*
 * SiteCopyPortalTabs — the portal switch of the Site copy list (Figma "portal tabs": #f8f8f4, r14, p4, gap 4; tab px16 py9 r11 14/500 #575755; the open tab is
 * white with a 1px #e7e7e7 border and 14/600 #1c2a21). `counts` ({ [portalId]: n }, optional) draws the small draft count chip inside a tab (7.8.1b / 7.8.1f);
 * the 32 px chip makes the tab taller, as drawn. Below lg the strip scrolls inside itself (no scrollbar, soft right fade).
 * Props: portals [{ id, label }], active, onSelect(id), counts.
 */
const SiteCopyPortalTabs = ({ portals, active, onSelect, counts }) => {
  useEffect(() => {
    log('render', {
      active,
      counts: counts ? Object.keys(counts).filter((k) => counts[k] > 0) : [],
    });
  }, [active, counts]);
  return (
    <div
      role="tablist"
      aria-label="Portals"
      className="flex max-w-full items-center gap-[4px] overflow-x-auto rounded-[14px] bg-[#f8f8f4] p-[4px] [scrollbar-width:none] max-lg:[mask-image:linear-gradient(to_right,#000_calc(100%-28px),transparent)] lg:overflow-visible [&::-webkit-scrollbar]:hidden"
    >
      {portals.map((p) => {
        const on = p.id === active;
        const n = counts?.[p.id] ?? 0;
        return (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onSelect(p.id)}
            className={classNames(
              'inline-flex min-h-[35px] shrink-0 cursor-pointer items-center gap-[6px] rounded-[11px] border border-solid px-[16px] py-[9px] font-sans text-[14px] leading-[17px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#387440]',
              on
                ? 'border-[#e7e7e7] bg-white font-semibold text-[#1c2a21]'
                : 'border-transparent bg-transparent font-medium text-[#575755] hover:text-[#1c2a21]'
            )}
          >
            {p.label}
            {n > 0 ? <SiteCopyChip kind="count" count={n} className="-my-[9px]" /> : null}
          </button>
        );
      })}
    </div>
  );
};

export default SiteCopyPortalTabs;
