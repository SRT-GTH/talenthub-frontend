import { useId } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { SORTS } from './data/rosterData.js';
import { formatRosterCount } from './rosterFormat.js';
import { RosterArrowheadDownIcon, RosterGridIcon, RosterListIcon } from './rosterIcons.jsx';

const log = debug('InstitutionRosterToolbar');

/*
 * InstitutionRosterToolbar — the filter row under the class tabs (Figma "toolbar" 8590:383369, 1329 x 34, gap 8):
 *   chips "All 247" · "Linked 231" · "Not linked 16" (32 high, px 14, r999, 13/16 600: current #1c2a21 / white, others white, 1px #e1eae2, #595959)
 *   · search · cards / list toggle (78 x 34, p 3, 1px #e1eae2, r10; current segment #1c2a21 r7) · sort pill (126 x 34) · "Add students" shelf button (107 x 34).
 * ⚠️ ASSUMPTION: the search field fills the empty spacer of the Figma toolbar. Figma only draws its (hidden, 0 % opacity) placeholder text, "Search students"
 * or "Search 16 students" with the Not linked filter; the field is a visible white pill with the same type size. The sort pill is a native <select>
 * (Surname A–Z is drawn; "Surname Z–A" and "Profile % high to low" are mine).
 * Props: counts ({ all, linked, notLinked }), filter ('all' | 'linked' | 'not-linked'), onFilter, view ('list' | 'cards'), onView, sort, onSort, q, onQ, onAdd.
 */

const LAYOUTS = [
  { id: 'cards', label: 'Cards', Icon: RosterGridIcon },
  { id: 'list', label: 'List', Icon: RosterListIcon },
];

const InstitutionRosterToolbar = ({
  counts,
  filter,
  onFilter,
  view,
  onView,
  sort,
  onSort,
  q,
  onQ,
  onAdd,
  className,
}) => {
  const searchId = useId();
  const chips = [
    { id: 'all', label: `All ${formatRosterCount(counts.all)}` },
    { id: 'linked', label: `Linked ${formatRosterCount(counts.linked)}` },
    { id: 'not-linked', label: `Not linked ${formatRosterCount(counts.notLinked)}` },
  ];
  const placeholder =
    filter === 'not-linked'
      ? `Search ${formatRosterCount(counts.notLinked)} students`
      : 'Search students';
  return (
    <div
      role="toolbar"
      aria-label="Filter the roster"
      className={classNames('flex flex-wrap items-center gap-[8px]', className)}
    >
      <div role="group" aria-label="Show" className="flex flex-wrap gap-[8px]">
        {chips.map((c) => {
          const on = filter === c.id;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => {
                log('filter', c.id);
                onFilter(c.id);
              }}
              className={classNames(
                'inline-flex h-[32px] cursor-pointer items-center rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[16px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                on
                  ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
                  : 'border-[#e1eae2] bg-white text-[#595959] hover:border-[#c1d4c4]'
              )}
            >
              {c.label}
            </button>
          );
        })}
      </div>
      <div className="min-w-[8px] flex-1" />
      <label htmlFor={searchId} className="sr-only">
        {placeholder}
      </label>
      <input
        id={searchId}
        type="search"
        value={q}
        onChange={(e) => onQ(e.target.value)}
        placeholder={placeholder}
        className="h-[34px] w-[min(100%,240px)] rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] font-sans text-[13px] leading-[16px] text-[#1c2a21] outline-none placeholder:text-[#595959] focus-visible:border-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      />
      <div
        role="group"
        aria-label="Layout"
        className="flex h-[34px] items-center gap-[2px] rounded-[10px] border border-solid border-[#e1eae2] bg-white p-[3px]"
      >
        {LAYOUTS.map((l) => {
          const Icon = l.Icon;
          return (
            <button
              key={l.id}
              type="button"
              aria-label={l.label}
              aria-pressed={view === l.id}
              onClick={() => onView(l.id)}
              className={classNames(
                'grid h-[26px] w-[34px] cursor-pointer place-items-center rounded-[7px] border-0 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#387440]',
                view === l.id ? 'bg-[#1c2a21] text-white' : 'bg-transparent text-[#737373]'
              )}
            >
              <Icon className="size-[16px]" />
            </button>
          );
        })}
      </div>
      <div className="relative inline-flex h-[34px] items-center">
        <select
          aria-label="Sort"
          value={sort}
          onChange={(e) => onSort(e.target.value)}
          className="h-[34px] cursor-pointer appearance-none rounded-full border border-solid border-[#e1eae2] bg-white pr-[32px] pl-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <RosterArrowheadDownIcon className="pointer-events-none absolute right-[12px] size-[14px] text-[#595959]" />
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex h-[34px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[12px] font-sans text-[13px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] transition-[transform,box-shadow] duration-100 hover:shadow-[0_5px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] active:translate-y-[3px] active:shadow-[0_1px_0_rgba(17,17,17,0.25)]"
      >
        Add students
      </button>
    </div>
  );
};

export default InstitutionRosterToolbar;
