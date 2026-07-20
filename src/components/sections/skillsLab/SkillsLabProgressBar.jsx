import { debug } from '../../../utils/debug.js';
import { SLChevronLeftIcon } from '../../shared/assets.jsx';

const log = debug('SkillsLabProgressBar');

export default function SkillsLabProgressBar({
  currentIndex,
  total,
  progress,
  icon,
  IconComponent,
  iconBg,
  lives,
  streak,
  xp,
}) {
  log('rendering progress:', currentIndex + 1, '/', total, 'progress:', progress + '%');

  return (
    <div className="flex items-center justify-between bg-white border-b border-[rgba(0,0,0,0.07)] h-[clamp(60px,5.7vw,82px)] px-[clamp(24px,3.9vw,56px)]">
      <div className="flex items-center gap-[clamp(8px,1.1vw,16px)] flex-1">
        <button className="size-[31px] rounded-[6px] bg-white border border-[#e8e8e4] flex items-center justify-center rotate-0 cursor-pointer shrink-0">
          <SLChevronLeftIcon />
        </button>

        <div className="flex flex-col gap-[4px] flex-1 max-w-[clamp(400px,52vw,760px)]">
          <div className="relative h-[16px] rounded-[8px] bg-[#f8f8f4] border-2 border-[#fef1e7] overflow-visible">
            <div
              className="absolute inset-y-[1px] left-[calc(0.15%-2px)] rounded-[6px]"
              style={{
                width: `${Math.max(progress, 2)}%`,
                backgroundImage: 'linear-gradient(to right, #18a44d, #387440)',
              }}
            >
              <div className="absolute h-[4px] left-[4px] right-[4px] top-[2px] rounded-[3px] bg-[rgba(255,255,255,0.25)]" />
              <div className="absolute -right-[4px] top-1/2 -translate-y-1/2 translate-x-full">
                {IconComponent ? (
                  <div
                    className={`size-[28px] rounded-full ${iconBg || ''} flex items-center justify-center border border-[#e8e8e4]`}
                  >
                    <IconComponent className="size-[16px]" />
                  </div>
                ) : (
                  <span className="text-[24px] leading-none">{icon}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-[#387440] text-[12px] font-sans font-semibold leading-normal">
              Challenge {currentIndex + 1} of {total}
            </span>
            <span className="text-[#387440] text-[12px] font-sans font-semibold leading-normal">
              {progress}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-[13px] text-[16px] whitespace-nowrap ml-[clamp(16px,2.2vw,32px)]">
        <span className="font-sans font-black text-[#c0392b] leading-normal">❤️ {lives}</span>
        <span className="font-sans font-bold text-[#c8951a] leading-normal">🔥 {streak}</span>
        <span className="font-sans font-bold text-[#387440] leading-normal">⭐ {xp}</span>
      </div>
    </div>
  );
}
