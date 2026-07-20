import { debug } from '../../../utils/debug.js';
import { GameControllerIcon } from '../../shared/assets.jsx';

const log = debug('SkillsLabHeader');

export default function SkillsLabHeader({ title, subtitle, score, total, remaining }) {
  log('rendering header:', title, 'score:', score, '/', total);

  return (
    <div
      className="flex items-center justify-between px-[clamp(24px,3.9vw,57px)] h-[clamp(64px,5.9vw,86px)] border-b border-[rgba(0,0,0,0.2)]"
      style={{
        backgroundImage: 'linear-gradient(177deg, #142916 0%, #2a5730 100%)',
      }}
    >
      <div className="flex items-center gap-[clamp(12px,1.6vw,16px)]">
        <GameControllerIcon className="text-white" />
        <div className="flex flex-col gap-[2px]">
          <span
            className="text-white text-[clamp(16px,1.5vw,22px)] tracking-[-0.4px] leading-normal"
            style={{ fontFamily: 'Instrument Serif, serif' }}
          >
            {title}
          </span>
          <span className="text-[rgba(255,255,255,0.9)] text-[clamp(10px,0.83vw,12px)] font-sans leading-normal">
            {subtitle}
          </span>
        </div>
      </div>

      <div className="flex items-center h-[40px] px-[14px] rounded-full bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.25)]">
        <span className="text-white text-[12px] font-sans font-bold leading-normal whitespace-pre">
          {` ${score}/${total} correct  ·  ${remaining} remaining`}
        </span>
      </div>
    </div>
  );
}
