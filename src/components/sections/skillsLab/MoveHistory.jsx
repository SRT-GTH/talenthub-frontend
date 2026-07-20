import { debug } from '../../../utils/debug.js';

const log = debug('MoveHistory');

export default function MoveHistory({ moves = [] }) {
  log('rendering move history, moves:', moves.length);

  const pairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push({
      num: Math.floor(i / 2) + 1,
      white: moves[i] || '',
      black: moves[i + 1] || '',
    });
  }

  return (
    <div className="flex flex-col gap-[8px]">
      <span className="text-[#575755] text-[12px] font-sans font-semibold leading-normal">
        Move History
      </span>
      <div className="border border-[#e8e8e4] rounded-[8px] bg-white min-h-[60px] max-h-[140px] overflow-y-auto p-[12px]">
        {moves.length === 0 ? (
          <span
            className="text-[#959592] text-[13px] leading-normal italic"
            style={{ fontFamily: 'monospace' }}
          >
            Make your first move to begin.
          </span>
        ) : (
          <div className="flex flex-col gap-[4px]" style={{ fontFamily: 'monospace' }}>
            {pairs.map((pair) => (
              <div
                key={pair.num}
                className="flex items-center gap-[12px] text-[13px] text-[#575755]"
              >
                <span className="text-[#959592] w-[20px]">{pair.num}.</span>
                <span className="w-[60px]">{pair.white}</span>
                <span className="w-[60px]">{pair.black}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
