import { useState } from 'react';
import ClampText from '../../ui/ClampText.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('LeadershipInsight');

export default function LeadershipInsight({ text }) {
  const [dismissed, setDismissed] = useState(false);

  log('rendering insight, dismissed:', dismissed);

  if (dismissed || !text) return null;

  return (
    <div className="relative border border-[#c8951a] rounded-[8px] bg-[#faf4e8] px-[14px] py-[12px] pr-[32px] max-lg:pr-12">
      <span className="text-[#a07715] text-[12px] font-sans font-bold leading-normal block mb-[4px]">
        Leadership Insight
      </span>
      <ClampText
        lines={3}
        className="text-[#575755] text-[12px] max-lg:text-[14px] font-sans leading-[18px] max-lg:leading-5 m-0"
      >
        {text}
      </ClampText>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute top-[10px] right-[10px] max-lg:top-0 max-lg:right-0 max-lg:inline-flex max-lg:size-11 max-lg:items-center max-lg:justify-center text-[#c8951a] bg-transparent border-none cursor-pointer text-[14px] leading-none p-0"
        aria-label="Dismiss insight"
      >
        ✕
      </button>
    </div>
  );
}
