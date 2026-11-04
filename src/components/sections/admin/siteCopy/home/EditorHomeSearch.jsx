import { useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { BrowseSearchIcon } from '../browse/SiteCopyBrowseIcons.jsx';
import { SEARCH_TRIES } from './editorHomeData.js';

const log = debug('EditorHomeSearch');

/*
 * EditorHomeSearch — the "Search pages, sections or words" field of the Content Editor home (7.8.0a: 640 x 44, r12, 1px #e7e7e7) with "Try “Join now” or “footer”"
 * beside it (13/400 #575755). Enter (or choosing a suggestion) opens the Site copy search with that text: `onSearch(text)`; fewer than 2 characters only says so
 * (⚠️ ASSUMPTION: the same "Type at least 2 characters" line as the Site copy search, 7.8.1e). The two suggestions are real buttons inside the drawn sentence.
 * Props: onSearch(text).
 */
const EditorHomeSearch = ({ onSearch }) => {
  const [value, setValue] = useState('');
  const [short, setShort] = useState(false);

  const submit = (text) => {
    const t = text.trim();
    log('submit', { len: t.length });
    if (t.length < 2) {
      setShort(true);
      return;
    }
    setShort(false);
    onSearch(t);
  };

  return (
    <div className="flex flex-col gap-[6px]">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
        className="flex flex-col gap-[8px] font-sans lg:flex-row lg:items-center lg:gap-[12px]"
      >
        <label className="flex h-[44px] w-full items-center gap-[10px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[14px] py-[11px] focus-within:border-[#387440] focus-within:ring-1 focus-within:ring-[#387440] focus-within:ring-inset lg:w-[640px] lg:max-w-[60%]">
          <span className="flex size-[18px] shrink-0 items-start text-[#387440]">
            <BrowseSearchIcon className="size-[14px]" />
          </span>
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (short) setShort(false);
            }}
            placeholder="Search pages, sections or words"
            aria-label="Search pages, sections or words"
            autoComplete="off"
            className="min-h-[24px] min-w-0 flex-1 border-0 bg-transparent p-0 text-[14px] leading-[17px] font-normal text-[#1c2a21] outline-none placeholder:text-[#575755]"
          />
        </label>
        <p className="m-0 flex flex-wrap items-center text-[13px] leading-[16px] text-[#575755]">
          Try “
          <button
            type="button"
            onClick={() => submit(SEARCH_TRIES[0])}
            className="inline-flex min-h-[24px] cursor-pointer items-center px-[1px] border-0 bg-transparent p-0 font-[inherit] text-[length:inherit] text-[#575755] hover:text-[#1c2a21] hover:underline focus-visible:outline-2 focus-visible:outline-[#387440]"
          >
            {SEARCH_TRIES[0]}
          </button>
          ” or “
          <button
            type="button"
            onClick={() => submit(SEARCH_TRIES[1])}
            className="inline-flex min-h-[24px] cursor-pointer items-center px-[1px] border-0 bg-transparent p-0 font-[inherit] text-[length:inherit] text-[#575755] hover:text-[#1c2a21] hover:underline focus-visible:outline-2 focus-visible:outline-[#387440]"
          >
            {SEARCH_TRIES[1]}
          </button>
          ”
        </p>
      </form>
      {short ? (
        <p
          role="status"
          className="m-0 font-sans text-[13px] leading-[16px] font-medium text-[#575755]"
        >
          Type at least 2 characters to search
        </p>
      ) : null}
    </div>
  );
};

export default EditorHomeSearch;
