import { debug } from '../../../utils/debug.js';

const log = debug('PlayerLabel');

export default function PlayerLabel({ name, role, isComputer = false, isActive = false }) {
  log('rendering:', name, 'role:', role, 'active:', isActive);

  return (
    <div className="flex items-center gap-[10px] px-[12px] py-[8px] rounded-[10px] bg-[#f8f8f4] border border-[#e8e8e4]">
      <div
        className="size-[32px] rounded-full flex items-center justify-center shrink-0"
        style={{
          backgroundImage: isComputer
            ? 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)'
            : 'linear-gradient(135deg, #142916 0%, #2a5730 100%)',
        }}
      >
        {isComputer ? (
          <span className="text-white text-[14px] leading-none">🤖</span>
        ) : (
          <span className="text-white text-[11px] font-bold font-sans leading-none">
            {name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-[1px]">
        <span className="text-[#111] text-[13px] font-sans font-semibold leading-normal">
          {name}
        </span>
        <span className="text-[#959592] text-[11px] font-sans leading-normal">
          {role}
          {isActive && <span className="text-[#387440] font-semibold"> · Your turn</span>}
        </span>
      </div>
    </div>
  );
}
