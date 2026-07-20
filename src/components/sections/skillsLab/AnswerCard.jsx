import { debug } from '../../../utils/debug.js';

const log = debug('AnswerCard');

const LETTERS = ['A', 'B', 'C', 'D'];

export default function AnswerCard({ index, text, state = 'default', onClick }) {
  log('rendering card', LETTERS[index], 'state:', state);

  const letter = LETTERS[index];

  const styles = {
    default: {
      card: 'bg-white border-2 border-[#f8f8f4] shadow-[0px_4px_0px_#e8e8e4]',
      badge: 'bg-[#f8f8f4] border-2 border-[#e8e8e4] text-[#70706e]',
      text: 'text-[#111]',
    },
    selected: {
      card: 'bg-white border-2 border-[#387440] shadow-[0px_4px_0px_#c1d4c4]',
      badge: 'bg-[#387440] border-2 border-[#2a5730] text-white',
      text: 'text-[#111]',
    },
    correct: {
      card: 'bg-[rgba(235,241,236,0.3)] border-2 border-[#387440] shadow-[0px_4px_0px_#c1d4c4]',
      badge: 'bg-[#387440] border-2 border-[#2a5730] text-white',
      text: 'text-[#387440]',
    },
    wrong: {
      card: 'bg-[rgba(249,235,234,0.3)] border-2 border-[#c0392b] shadow-[0px_4px_0px_#ebc2bd]',
      badge: 'bg-[#c0392b] border-2 border-[#a5311f] text-white',
      text: 'text-[#c0392b]',
    },
  };

  const s = styles[state] || styles.default;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${s.card} rounded-[16px] h-[clamp(56px,5.4vw,78px)] w-full flex items-center gap-[clamp(12px,1.4vw,20px)] px-[clamp(14px,1.5vw,21px)] cursor-pointer transition-all duration-150`}
    >
      <div
        className={`${s.badge} size-[36px] rounded-[18px] flex items-center justify-center shrink-0`}
      >
        <span className="text-[13px] font-sans font-bold leading-none">{letter}</span>
      </div>
      <span
        className={`${s.text} font-sans font-medium text-[14px] tracking-[0.28px] leading-[19.6px]`}
      >
        {text}
      </span>
    </button>
  );
}
