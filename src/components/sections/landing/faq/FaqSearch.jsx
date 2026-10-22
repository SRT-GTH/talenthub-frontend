import { useState } from 'react';
import { FaqSearchIcon } from './FaqIcons.jsx';
import { FAQ_HERO } from './FaqData.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('FaqSearch');

/*
 * FaqSearch — hero "Search" field (Figma 7797:31728, 760x56, r24, white, 1.4px ink border + hard 5px shadow, pad 14/14/14/22, gap 10):
 * 20px search icon #595959, placeholder 16/400 #595959, "⌘K" hint chip (45x26, #f7f8f4, 1px #e7e7e7).
 * ⚠️ Figma draws only the field, no results state: typing is logged, nothing is filtered.
 */
const FaqSearch = () => {
  const [value, setValue] = useState('');
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        log('search submitted (inert: no results state in Figma)', { length: value.length });
      }}
      className="mt-[18px] flex h-14 w-full max-w-[760px] items-center gap-[10px] rounded-[24px] border-[1.4px] border-[#1c2a21]/[.32] bg-white py-[14px] pl-[22px] pr-[14px] shadow-[5px_5px_0_rgba(28,42,33,0.2),0_10px_24px_rgba(28,42,33,0.06)]"
    >
      <FaqSearchIcon className="shrink-0 text-[#595959]" />
      <input
        type="search"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          log('search input', { length: e.target.value.length });
        }}
        placeholder={FAQ_HERO.searchPlaceholder}
        aria-label="Search help"
        className="w-0 flex-1 border-0 bg-transparent p-0 text-left font-sans text-[16px] leading-[19px] text-[#1c2a21] outline-none placeholder:text-[#595959]"
      />
      <kbd className="hidden shrink-0 rounded-full border border-[#e7e7e7] bg-[#f7f8f4] px-3 py-[5px] font-sans text-[12px] font-semibold leading-[14.3px] text-[#1c2a21] md:inline-block">
        {FAQ_HERO.searchHint}
      </kbd>
    </form>
  );
};

export default FaqSearch;
