import { debug } from '../../../utils/debug.js';

const log = debug('AnswerDots');

export default function AnswerDots({ answers, currentIndex, total }) {
  log('rendering dots, answered:', answers.length, 'current:', currentIndex);

  return (
    <div className="flex items-center gap-[12px]">
      {Array.from({ length: total }, (_, i) => {
        const answer = answers[i];
        const isActive = i === currentIndex && !answer;

        if (answer === 'correct') {
          return (
            <div
              key={i}
              className="size-[28px] rounded-[14px] border-2 border-[#387440] flex items-center justify-center"
              style={{
                backgroundImage: 'linear-gradient(216deg, #FEF1E7 0%, #E8F2ED 20.19%)',
              }}
            >
              <span className="text-[12px] font-sans font-black text-[#1d7c4d] leading-none">
                ✓
              </span>
            </div>
          );
        }

        if (answer === 'wrong') {
          return (
            <div
              key={i}
              className="size-[28px] rounded-[14px] border-2 border-[#387440] flex items-center justify-center"
              style={{
                backgroundImage: 'linear-gradient(216deg, #FEF1E7 0%, #E8F2ED 20.19%)',
              }}
            >
              <span className="text-[12px] font-sans font-black text-[#c0392b] leading-none">
                ✕
              </span>
            </div>
          );
        }

        if (isActive) {
          return (
            <div
              key={i}
              className="size-[28px] rounded-[14px] border-2 border-[#c8951a] bg-[#eedeb8] flex items-center justify-center"
            >
              <span className="text-[12px] font-sans font-bold text-[#c8951a] leading-none">●</span>
            </div>
          );
        }

        return (
          <div
            key={i}
            className="size-[28px] rounded-[14px] border-2 border-[#e6e6e6] bg-[#fdfdfc]"
          />
        );
      })}
    </div>
  );
}
