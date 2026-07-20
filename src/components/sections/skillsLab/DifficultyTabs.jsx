import { debug } from '../../../utils/debug.js';

const log = debug('DifficultyTabs');

const TABS = ['Random', 'Easy', 'Medium', 'Hard'];

export default function DifficultyTabs() {
  log('rendering difficulty tabs (visual-only)');

  return (
    <div className="flex flex-col gap-[8px]">
      <span className="text-[#575755] text-[12px] font-sans font-semibold leading-normal">
        Computer Difficulty
      </span>
      <div className="flex items-center gap-[8px]">
        {TABS.map((tab) => (
          <div
            key={tab}
            className={`px-[16px] py-[6px] rounded-[6px] text-[12px] font-sans font-semibold leading-normal cursor-default ${
              tab === 'Random'
                ? 'bg-[#387440] text-white border border-[#387440]'
                : 'bg-white text-[#575755] border border-[#e8e8e4]'
            }`}
          >
            {tab}
          </div>
        ))}
      </div>
    </div>
  );
}
