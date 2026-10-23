import { useEffect, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { CIRCLE_COPY as COPY } from './circleData.js';
import { CircleSearchIcon } from './circleIcons.jsx';

/*
 * CircleSearch — Figma `Search people` (300x40, white, 1px #e7e7e7, r12, 13px placeholder #9a9a98). Controlled by the `q` query
 * param: typing filters the lists on the page (debounce-free, local state mirrors the URL). Props: value, onChange(text), className.
 */
const CircleSearch = ({ value, onChange, className }) => {
  const [text, setText] = useState(value);
  useEffect(() => {
    setText(value);
  }, [value]);
  return (
    <label
      className={classNames(
        'flex h-[40px] w-[300px] max-w-full items-center gap-[8px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white py-[10px] pl-[12px] pr-[14px] focus-within:border-[#387440] max-lg:w-full max-lg:min-h-[44px]',
        className
      )}
    >
      <CircleSearchIcon className="size-[16px] text-[#737373]" />
      <input
        type="search"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={COPY.searchPlaceholder}
        aria-label={COPY.searchPlaceholder}
        className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[13px] leading-[16px] text-[#1c2a21] outline-none placeholder:text-[#9a9a98] max-lg:text-[14px]"
      />
    </label>
  );
};

export default CircleSearch;
