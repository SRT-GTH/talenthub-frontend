import { useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { formatCount, isSuppressed } from '../agencyFormat.js';
import DemandCard from './DemandCard.jsx';
import SuppressedValue from '../../publicData/ui/SuppressedValue.jsx';
import CardHint from './CardHint.jsx';
import DemandNote from './DemandNote.jsx';

/*
 * TopSkillsCard — "Top 10 skills" (Figma 8702:102, 497 wide): rows 14/17, label 190 | track 169 (#efefea r4, #387440 fill, 14 high) | value 64, gap 12, rows gap 10, then
 * the info note. A row is a button: click filters the whole page to that skill (click again clears), the dark "Chart tooltip" (8710:421528: #1c2a21 r12 p 10/12,
 * 13/600 name + 12/400 lines) shows on hover / focus and stays on the selected row; with a selection the other rows fade (11.4.5b).
 * Below lg only six rows show with a "Show all 10" toggle (11.4.5o/p); rows may carry `short` ("Software dev."). Rows under 5 (region drill-down 11.4.5c) print the "<5" chip and draw no bar. Props: rows [{ id, name, count, share, growth }], selectedId, onSelect(id|null),
 * note, hint, interactive. Counts via formatCount / SuppressedValue.
 */

const growthText = (g) => (typeof g === 'number' ? `${g >= 0 ? '▲ +' : '▼ '}${g}%` : null);

const TopSkillsCard = ({
  rows,
  selectedId = null,
  onSelect,
  note,
  hint = 'Opportunities · click a bar to filter',
  interactive = true,
}) => {
  const [hot, setHot] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const max = Math.max(1, ...rows.map((r) => r.count));
  const selected = rows.find((r) => r.id === selectedId);
  const tipRow = hot ? rows.find((r) => r.id === hot) : selected;
  return (
    <DemandCard
      id="top-skills"
      title="Top 10 skills"
      headerExtra={<CardHint full={hint} compact="Tap a bar to filter" />}
      bodyClassName="relative flex flex-1 flex-col gap-[12px] px-[24px] pt-[12px] pb-[24px] lg:pt-0 lg:pb-[24px] lg:gap-[10px]"
      className="flex h-full flex-col"
    >
      <ul
        aria-label="Top 10 skills by opportunities"
        className="m-0 flex list-none flex-col gap-[5px] p-0 lg:gap-[10px]"
      >
        {rows.map((r, i) => {
          const low = isSuppressed(r.count);
          const dim = selectedId && r.id !== selectedId;
          const tipOn = tipRow?.id !== undefined && tipRow.id === r.id && !low;
          const spoken = low ? 'fewer than 5' : formatCount(r.count);
          const hintText = interactive
            ? r.id === selectedId
              ? ', selected, press to clear'
              : ', press to filter'
            : '';
          return (
            <li
              key={r.id ?? r.name}
              className={classNames(
                'relative',
                i >= 6 && !expanded && 'max-lg:hidden',
                i === (expanded ? rows.length - 1 : 5) && 'max-lg:-mb-[7px]'
              )}
            >
              <button
                type="button"
                disabled={!interactive}
                aria-pressed={interactive ? r.id === selectedId : undefined}
                aria-label={`${r.name}, ${spoken} opportunities${hintText}`}
                onClick={() => onSelect?.(r.id === selectedId ? null : r.id)}
                onPointerEnter={() => setHot(r.id)}
                onPointerLeave={() => setHot(null)}
                onFocus={() => setHot(r.id)}
                onBlur={() => setHot(null)}
                className={classNames(
                  'grid min-h-[24px] w-full grid-cols-[minmax(0,1fr)_minmax(0,88px)_44px] items-center gap-[12px] bg-transparent p-0 text-left font-sans focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] sm:grid-cols-[minmax(0,190px)_minmax(0,1fr)_64px]',
                  interactive ? 'cursor-pointer' : 'cursor-default',
                  dim && 'opacity-60'
                )}
              >
                <span
                  className={classNames(
                    'truncate text-[14px] leading-[17px] text-[#1c2a21]',
                    r.id === selectedId ? 'font-bold' : 'font-medium'
                  )}
                >
                  {r.short ? (
                    <>
                      <span className="lg:hidden">{r.short}</span>
                      <span className="max-lg:hidden">{r.name}</span>
                    </>
                  ) : (
                    r.name
                  )}
                </span>
                <span aria-hidden="true" className="h-[14px] rounded-[4px] bg-[#efefea]">
                  {low ? null : (
                    <span
                      className="block h-full rounded-[4px] bg-[#387440]"
                      style={{ width: `${(r.count / max) * 100}%` }}
                    />
                  )}
                </span>
                <span className="text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                  {low ? <SuppressedValue value={r.count} /> : formatCount(r.count)}
                </span>
              </button>
              {tipOn ? (
                <div
                  role="tooltip"
                  className={classNames(
                    'pointer-events-none absolute right-0 z-10 flex w-max max-w-[233px] flex-col gap-[4px] rounded-[12px] bg-[#1c2a21] px-[12px] py-[10px] font-sans text-white',
                    i >= rows.length - 3 ? 'bottom-[calc(100%+4px)]' : 'top-[calc(100%+4px)]'
                  )}
                >
                  <span className="text-[13px] leading-[16px] font-semibold">{r.name}</span>
                  <span className="text-[12px] leading-[14px]">
                    {`${formatCount(r.count)} opportunities${r.share ? ` · ${r.share}% share` : ''}${growthText(r.growth) ? ` · ${growthText(r.growth)}` : ''}`}
                  </span>
                  {r.id === selectedId ? (
                    <span className="text-[12px] leading-[14px]">
                      Selected · click again to clear
                    </span>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
      {rows.length > 6 ? (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="-mb-[4px] min-h-[24px] w-fit underline cursor-pointer bg-transparent p-0 text-left font-sans text-[13px] leading-[16px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] lg:hidden"
        >
          {expanded ? 'Show fewer' : `Show all ${rows.length}`}
        </button>
      ) : null}
      {note ? <DemandNote className="mt-auto pt-[4px] max-lg:hidden">{note}</DemandNote> : null}
    </DemandCard>
  );
};

export default TopSkillsCard;
