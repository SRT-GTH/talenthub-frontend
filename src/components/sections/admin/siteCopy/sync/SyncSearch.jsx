import { SearchIcon } from './SyncIcons.jsx';
import { SYNC_COPY } from './releaseSyncData.js';

/*
 * SyncSearch — "Search pages, sections or words" of the Site copy toolbar (Figma "search": 380 x 44, white, 1px #e7e7e7, r12, 14 padding, 10 gap,
 * search glyph #387440, 14/400 text). Filters the page tree as you type.
 * Props: value, onChange(text).
 */
const SyncSearch = ({ value, onChange }) => (
  <label className="flex min-h-[44px] w-full items-center gap-[10px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[14px] py-[11px] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440] lg:w-[380px]">
    <SearchIcon className="size-[18px] shrink-0 text-[#387440]" />
    <span className="sr-only">{SYNC_COPY.searchPlaceholder}</span>
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={SYNC_COPY.searchPlaceholder}
      className="min-h-[24px] min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] text-[#1c2a21] outline-none placeholder:text-[#575755]"
    />
  </label>
);

export default SyncSearch;
