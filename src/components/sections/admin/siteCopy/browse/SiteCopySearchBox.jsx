import { classNames } from '../../../../../utils/classNames.js';
import { BrowseClearIcon, BrowseSearchIcon } from './SiteCopyBrowseIcons.jsx';

/*
 * SiteCopySearchBox — the "Search pages, sections or words" field (Figma "search": 380 x 44, r12, p11/14, gap 10, 1px #e7e7e7). While it holds text it is drawn
 * with a 2px #387440 border and a 14/500 #1c2a21 value, with a clear (x) button on the right (7.8.1c-e). The search icon is the 18 px box with the 14 px glyph.
 * Props: value, onChange(text), onClear, className, inputRef, id.
 */
const SiteCopySearchBox = ({
  value,
  onChange,
  onClear,
  className,
  inputRef,
  id = 'site-copy-search',
}) => {
  const filled = value.length > 0;
  return (
    <div
      className={classNames(
        'flex h-[44px] w-full items-center gap-[10px] rounded-[12px] border border-solid bg-white px-[14px] py-[11px] focus-within:border-[#387440] focus-within:ring-1 focus-within:ring-[#387440] focus-within:ring-inset',
        filled ? 'border-[#387440] ring-1 ring-[#387440] ring-inset' : 'border-[#e7e7e7]',
        className
      )}
    >
      <span className="flex size-[18px] shrink-0 items-start text-[#387440]">
        <BrowseSearchIcon className="size-[14px]" />
      </span>
      <input
        id={id}
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search pages, sections or words"
        aria-label="Search pages, sections or words"
        autoComplete="off"
        className={classNames(
          'min-h-[24px] min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] text-[#1c2a21] outline-none placeholder:text-[#575755]',
          filled ? 'font-medium' : 'font-normal'
        )}
      />
      {filled ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="-mr-[5px] flex size-[26px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-[#5f6b63] hover:text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-[#387440]"
        >
          <BrowseClearIcon className="size-[16px]" />
        </button>
      ) : null}
    </div>
  );
};

export default SiteCopySearchBox;
