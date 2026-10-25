import { useEffect, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { AgencySearchIcon } from '../agencyIcons.jsx';
import DemandSegmented from '../demand/DemandSegmented.jsx';
import { CHIP_REGION_IDS, SORTS, VIEWS } from './data/districtsData.js';
import DistrictSelect from './DistrictSelect.jsx';

const log = debug('DistrictsToolbar');

/*
 * DistrictsToolbar — "toolbar" (Figma 9394:19735, 1329x48, gap 12) + "region chips" (9394:19749, 1329x32, gap 8).
 *   search field 420x48 (white, 1px #dfdfdc, r8, inner shadow, green search icon, 14/20 placeholder #bfbfbf) · "All regions" select · "Sort: Most talents"
 *   select · Table | Map segmented (pushed right) · chips "All · 261", "Greater Accra · 29" …: 32 high, r999, 13/16 600; active #1c2a21 / white, idle white
 *   with 1px #e1eae2 / #595959. Figma draws ten region chips; the other six regions are reachable from the select only.
 * Props: q, region (id | null), sort, view, regions [{id,name,districts}], total, onQuery(text), onRegion(id|null), onSort(id), onView(id).
 * The search is debounced 200 ms into the URL; Esc clears it. Below md everything stacks; the chips scroll sideways inside their row.
 */

const DistrictsToolbar = ({
  q,
  region,
  sort,
  view,
  regions,
  total,
  onQuery,
  onRegion,
  onSort,
  onView,
}) => {
  const [text, setText] = useState(q);
  useEffect(() => setText(q), [q]);
  useEffect(() => {
    if (text === q) return undefined;
    const t = setTimeout(() => {
      log('search', text);
      onQuery(text);
    }, 200);
    return () => clearTimeout(t);
  }, [text, q, onQuery]);

  const regionOptions = [
    { id: null, label: 'All regions' },
    ...regions.map((r) => ({ id: r.id, label: r.name })),
  ];
  const chips = [
    { id: null, label: `All · ${total}` },
    ...CHIP_REGION_IDS.map((id) => {
      const r = regions.find((x) => x.id === id);
      return { id, label: `${r.name} · ${r.districts}` };
    }),
  ];

  return (
    <div className="flex min-w-0 flex-col gap-[30px] max-lg:gap-[16px]">
      <div className="flex flex-wrap items-center gap-[12px]">
        <label className="flex h-[48px] w-[420px] max-w-full min-w-0 items-center gap-[12px] rounded-[8px] border border-solid border-[#dfdfdc] bg-white py-[10px] pr-[12px] pl-[14px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] max-md:w-full focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440]">
          <span className="sr-only">Search districts</span>
          <span className="flex size-[28px] shrink-0 items-center justify-center">
            <AgencySearchIcon className="size-[20px] text-[#387440]" />
          </span>
          <input
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && text) {
                e.preventDefault();
                setText('');
              }
            }}
            placeholder="Search a district, e.g. Ho, Tamale, Tema…"
            className="min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#1c2a21] outline-none placeholder:text-[#bfbfbf] max-lg:text-[16px]"
          />
        </label>
        <DistrictSelect label="Region" options={regionOptions} value={region} onChange={onRegion} />
        <DistrictSelect
          label="Sort"
          prefix="Sort: "
          options={SORTS}
          value={sort}
          onChange={onSort}
        />
        <DemandSegmented
          ariaLabel="View"
          options={VIEWS}
          value={view}
          onChange={onView}
          className="md:ml-auto"
        />
      </div>
      <div
        role="group"
        aria-label="Filter by region"
        className="no-scrollbar -mx-[16px] flex max-w-[100vw] gap-[8px] overflow-x-auto px-[16px] py-[2px] -my-[2px] lg:mx-0 lg:max-w-none lg:flex-wrap lg:overflow-visible lg:px-0"
      >
        {chips.map((c) => {
          const on = (region ?? null) === c.id;
          return (
            <button
              key={c.id ?? 'all'}
              type="button"
              aria-pressed={on}
              onClick={() => onRegion(c.id)}
              className={classNames(
                'h-[32px] shrink-0 cursor-pointer rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap max-lg:text-[12px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                on
                  ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
                  : 'border-[#e1eae2] bg-white text-[#595959] hover:bg-[#f8f8f4]'
              )}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DistrictsToolbar;
