import { useState } from 'react';
import { debug } from '../../../utils/debug.js';

const log = debug('LeadershipInsight');

export default function LeadershipInsight({ text }) {
  const [dismissed, setDismissed] = useState(false);

  log('rendering insight, dismissed:', dismissed);

  if (dismissed || !text) return null;

  return (
    <div className="relative border border-[#c8951a] rounded-[8px] bg-[#faf4e8] px-[14px] py-[12px] pr-[32px]">
      <span className="text-[#a07715] text-[12px] font-sans font-bold leading-normal block mb-[4px]">
        Leadership Insight
      </span>
      <p className="text-[#575755] text-[12px] font-sans leading-[18px] m-0">{text}</p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute top-[10px] right-[10px] text-[#c8951a] bg-transparent border-none cursor-pointer text-[14px] leading-none p-0"
        aria-label="Dismiss insight"
      >
        ✕
      </button>
    </div>
  );
}
