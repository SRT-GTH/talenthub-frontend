import { useState } from 'react';
import { debug } from '../../../../../utils/debug.js';

const log = debug('FilterChips');

/*
 * FilterChips — filter row of the Activity / Crew tabs (Figma "filters" 10049:1713 / 10105:2989): h32 r999 px14 chips, gap 8, 13/600.
 * Selected = #1c2a21 fill + white label; others white, border #e1eae2, label #595959.
 * Props: items (labels), label (aria-label).
 * ⚠️ ASSUMPTION: Figma draws only the "All" state; selecting a chip only changes the look (rows are not filtered).
 */
const FilterChips = ({ items, label }) => {
  const [active, setActive] = useState(items[0]);
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-[8px]">
      {items.map((item) => {
        const on = item === active;
        return (
          <button
            key={item}
            type="button"
            aria-pressed={on}
            onClick={() => {
              log('filter:', item);
              setActive(item);
            }}
            className={`inline-flex h-[32px] cursor-pointer items-center rounded-full border border-solid px-[14px] font-sans text-[13px] leading-normal font-semibold whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] ${
              on
                ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
                : 'border-[#e1eae2] bg-white text-[#595959]'
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
};

export default FilterChips;
