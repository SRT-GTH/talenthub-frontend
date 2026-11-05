import { classNames } from '../../../../../utils/classNames.js';
import {
  MediaChevronIcon,
  MediaChipCloseIcon,
  MediaClose18Icon,
  MediaSearchIcon,
} from './MediaIcons.jsx';
import { MEDIA_FILTERS } from './mediaLibraryModel.js';

/*
 * MediaToolbar — the filter chips + search of the library (Figma "toolbar" 7.8.9a): chips 35 high, r100, 1px #e7e7e7, px 14/12, gap 6, label 14/500;
 * the selected chip is #387440 with a white label and a close X (clears the filter); the others show a chevron. "All" is selected when no filter is
 * on. Search: 360 wide, 44 high, r12, 1px #e7e7e7, search icon #387440, 14px text, X to clear (7.8.9m).
 * ⚠️ ASSUMPTION: the chevrons are drawn but no menu is: a chip applies its filter directly; one filter at a time (the URL key ?filter=).
 * Chips and the search sit on one row on desktop, the chips scroll inside their own strip on phones (no scrollbar).
 */
const Chip = ({ label, selected, onClick }) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onClick}
    className={classNames(
      'inline-flex min-h-[35px] shrink-0 cursor-pointer items-center gap-[6px] rounded-full border border-solid py-[8px] pr-[12px] pl-[14px] font-sans text-[14px] leading-[17px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      selected
        ? 'border-[#387440] bg-[#387440] text-white'
        : 'border-[#e7e7e7] bg-white text-[#1c2a21]'
    )}
  >
    {label}
    {selected ? (
      <MediaChipCloseIcon className="size-[14px]" />
    ) : (
      <MediaChevronIcon className="size-[16px] text-[#595959]" />
    )}
  </button>
);

const MediaToolbar = ({ filter, q, onFilter, onSearch }) => (
  <div className="flex flex-col gap-[12px] lg:flex-row lg:items-center">
    <div
      role="group"
      aria-label="Filters"
      className="-mx-[16px] flex min-w-0 gap-[8px] overflow-x-auto px-[16px] py-[2px] [scrollbar-width:none] lg:mx-0 lg:flex-1 lg:flex-wrap lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
    >
      <Chip label="All" selected={!filter} onClick={() => onFilter(null)} />
      {MEDIA_FILTERS.map((f) => (
        <Chip
          key={f.id}
          label={f.label}
          selected={filter === f.id}
          onClick={() => onFilter(filter === f.id ? null : f.id)}
        />
      ))}
    </div>
    <label className="flex min-h-[44px] w-full items-center gap-[10px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[14px] py-[11px] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440] lg:w-[360px] lg:shrink-0">
      <span className="sr-only">Search the media library</span>
      <MediaSearchIcon className="h-[19px] w-[18px] shrink-0 text-[#387440]" />
      <input
        type="search"
        value={q}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search pages, sections or words"
        autoComplete="off"
        className="min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21] outline-none placeholder:font-normal placeholder:text-[#575755] [&::-webkit-search-cancel-button]:hidden"
      />
      {q ? (
        <button
          type="button"
          aria-label="Clear the search"
          onClick={() => onSearch('')}
          className="grid size-[24px] shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-[#575755] focus-visible:outline-2 focus-visible:outline-[#387440]"
        >
          <MediaClose18Icon className="size-[18px]" />
        </button>
      ) : null}
    </label>
  </div>
);

export default MediaToolbar;
