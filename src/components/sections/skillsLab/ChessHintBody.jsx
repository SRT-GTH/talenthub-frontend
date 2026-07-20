import { debug } from '../../../utils/debug.js';
import ChessBoardMini from './ChessBoardMini.jsx';

const log = debug('ChessHintBody');

export default function ChessHintBody({ hint, challenge }) {
  log('rendering chess hint body for:', challenge?.topic);

  const legends = [];
  if (hint.highlightedSquares) {
    for (const [square, color] of Object.entries(hint.highlightedSquares)) {
      if (color === '#779952') {
        legends.push({ color, label: `${square.toUpperCase()} (piece)` });
      } else if (color === '#ff6b6b') {
        legends.push({ color, label: `Target square ${square}` });
      }
    }
  }

  return (
    <div className="px-[28px] pt-[12px]">
      {/* Mini board with highlights */}
      <div className="flex justify-center mb-[16px]">
        <ChessBoardMini
          fen={challenge.fen}
          highlightedSquares={hint.highlightedSquares || {}}
          legends={legends}
        />
      </div>

      {/* Numbered steps */}
      <div className="flex flex-col">
        {hint.steps.map((step, i) => {
          const isHighlighted = i === 1;
          return (
            <div
              key={i}
              className={`flex items-start gap-[12px] py-[12px] ${
                isHighlighted
                  ? 'bg-[rgba(56,116,64,0.06)] border-l-[3px] border-[#387440] pl-[12px] -ml-[15px] rounded-r-[8px]'
                  : 'border-b border-[#ebf1ec]'
              }`}
            >
              <div
                className={`size-[26px] rounded-full flex items-center justify-center shrink-0 ${
                  isHighlighted ? 'bg-[#387440]' : 'bg-[#387440]'
                }`}
              >
                <span className="text-white text-[11px] font-sans font-bold leading-none">
                  {i + 1}
                </span>
              </div>
              <div className="flex flex-col gap-[5px] flex-1 min-w-0">
                <span className="text-[#142916] text-[12px] font-sans font-semibold leading-normal">
                  {step.title}
                </span>
                <p className="text-[#70706e] text-[12px] font-sans leading-[18.6px] m-0">
                  {step.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {hint.keyInsight && (
        <div className="bg-[#faf4e8] border border-[#eedeb8] rounded-[10px] px-[14px] py-[12px] my-[12px]">
          <p className="text-[#a07715] text-[12px] font-sans leading-[19.2px] m-0">
            <span className="font-bold">Key insight: </span>
            {hint.keyInsight}
          </p>
        </div>
      )}
    </div>
  );
}
