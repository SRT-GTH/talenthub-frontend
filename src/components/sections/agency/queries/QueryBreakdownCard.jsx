import { useEffect, useId, useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { VIEW_BY, breakdownRows } from '../data/queriesData.js';
import BarList from '../../publicData/ui/BarList.jsx';
import BarRow from '../../publicData/ui/BarRow.jsx';
import FilterMenu from '../../publicData/ui/FilterMenu.jsx';
import PublicCard from '../../publicData/ui/PublicCard.jsx';
import { QueriesIconChevronDown, QueriesIconInfoCircle } from './queriesIcons.jsx';

const log = debug('QueryBreakdownCard');

/*
 * QueryBreakdownCard — "Breakdown · Top 10 · talents" with the "View by" dropdown (Figma 8597:391034, header 8706:420679: 495 x 57, p 12/24;
 * dropdown 180 x 32, 1px #e7e7e7, r10, "View by" 13/400 #575755 + the value 13/600). Rows are Theme 8 BarRows (label · bar · count, "<5" and an
 * empty bar under 5). With extra filters the card ends with the note "Only the groups in your filters appear. <5 means fewer than 5 talents."
 * (Figma 8707:421593, 12/400 #575755). The dropdown is a single-select listbox (Theme 8 FilterMenu), Esc closes and returns focus.
 * Props: result (runQuery), view (VIEW_BY id), onView(id), showNote.
 */

const QueryBreakdownCard = ({ result, view, onView, showNote = false }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const rootRef = useRef(null);
  const uid = useId();
  const rows = breakdownRows(view, result);
  const max = Math.max(1, ...rows.map((r) => r.count ?? 0));
  const current = VIEW_BY.find((v) => v.id === view) ?? VIEW_BY[0];

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  return (
    <PublicCard
      id="query-breakdown"
      bodyClassName="flex flex-1 flex-col px-[16px] pb-[16px] md:px-[24px] md:pb-[24px]"
      className="flex flex-col"
    >
      <div className="-mx-[16px] flex flex-wrap items-center justify-between gap-x-[12px] gap-y-[8px] px-[16px] pt-[16px] pb-[12px] md:-mx-[24px] md:px-[24px]">
        <div className="flex items-center gap-[10px]">
          <h2 className="m-0 font-sans text-[16px] leading-[19px] font-semibold text-[#1c2a21] md:text-[18px] md:leading-[21px]">
            Breakdown
          </h2>
          <span className="font-sans text-[12px] leading-[14px] font-medium text-[#595959]">
            Top 10 · talents
          </span>
        </div>
        <div ref={rootRef} className="relative">
          <button
            ref={buttonRef}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? `${uid}-view` : undefined}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-[32px] min-w-[24px] cursor-pointer items-center gap-[6px] rounded-[10px] border border-solid border-[#e7e7e7] bg-white py-[7px] pr-[10px] pl-[12px] font-sans text-[13px] leading-[16px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <span className="font-normal text-[#575755]">View by</span>
            <span className="font-semibold text-[#1c2a21]">{current.label}</span>
            <QueriesIconChevronDown className="size-[16px] text-[#575755]" />
          </button>
          {open ? (
            <FilterMenu
              id={`${uid}-view`}
              label="View by"
              options={VIEW_BY}
              value={view}
              className="!right-0 !left-auto"
              onSelect={(id) => {
                log('view by', id);
                if (id) onView(id);
              }}
              onClose={(reason) => {
                setOpen(false);
                if (reason !== 'tab') buttonRef.current?.focus();
              }}
            />
          ) : null}
        </div>
      </div>
      <BarList
        label={`Breakdown by ${current.label}, top 10 by talents`}
        gap={12}
        className="flex-1 md:justify-between md:gap-[10px]"
      >
        {rows.map((r) => (
          <BarRow
            key={r.key}
            label={r.label}
            count={r.count}
            ratio={(r.count ?? 0) / max}
            layout="inline"
          />
        ))}
      </BarList>
      {showNote ? (
        <p className="m-0 mt-[12px] flex items-center gap-[8px] font-sans text-[12px] leading-[14px] text-[#575755]">
          <QueriesIconInfoCircle className="size-[16px] shrink-0" />
          Only the groups in your filters appear. &lt;5 means fewer than 5 talents.
        </p>
      ) : null}
    </PublicCard>
  );
};

export default QueryBreakdownCard;
