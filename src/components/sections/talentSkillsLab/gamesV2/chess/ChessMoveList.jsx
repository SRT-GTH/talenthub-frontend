import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import {
  GameCheckIcon,
  GameInfoIcon,
  GameStarDuoIcon,
  GameWarningIcon,
} from '../planningShared/PlanningChessIcons.jsx';
import { GRADE_LABEL } from './chessData.js';

/*
 * ChessMoveList — "MOVES SO FAR" / "MOVES" / "LAST MOVES" heading (11.5/14 700 ls .69 #387440) and the rows (gap 8, r12, padding
 * 10/12, gap 10): "1." number · SAN 15/18 700 · grade chip (22px) · "Kwaku: Rxe8" 13.5/16 500 #6b6b6b on the right. The current
 * row has the #e2f1e4 fill and a 2px #387440 border: "2." "Your move…".
 * Props: heading, rows [{ n, san, grade, reply }], currentNumber (shows the "Your move…" row, or null).
 */
const CHIPS = {
  best: { box: 'bg-[#e2f1e4] text-[#27522e]', icon: GameStarDuoIcon },
  good: { box: 'bg-[#f2f5f4] text-[#1c2a21]', icon: GameCheckIcon },
  inaccuracy: { box: 'bg-[#fef8ec] text-[#8a6100]', icon: GameInfoIcon },
  blunder: { box: 'bg-[#fcebe8] text-[#c73326]', icon: GameWarningIcon },
};

export const GradeChip = ({ grade }) => {
  const chip = CHIPS[grade];
  if (!chip) return null;
  const Glyph = chip.icon;
  return (
    <span
      className={classNames(
        'inline-flex min-h-[22px] items-center gap-[5px] rounded-full px-[10px] py-[4px] font-sans text-[12px] leading-[14px] font-semibold',
        chip.box
      )}
    >
      <Glyph className="size-[13px]" />
      {GRADE_LABEL[grade]}
    </span>
  );
};

const log = debug('ChessMoveList');

const ChessMoveList = ({ heading, rows, currentNumber }) => {
  log('render', { heading, rows: rows.length, currentNumber });
  return (
    <div className="flex flex-col gap-[14px]">
      <h2 className="m-0 font-sans text-[11.5px] leading-[14px] font-bold tracking-[0.69px] text-[#387440] max-lg:text-[12px]">
        {heading}
      </h2>
      <ol className="m-0 flex list-none flex-col gap-[8px] p-0" aria-live="polite">
        {rows.map((row) => (
          <li
            key={`${row.n}-${row.san}`}
            className="flex min-h-[44px] flex-wrap items-center gap-x-[10px] gap-y-[4px] rounded-[12px] border border-solid border-[#dee5e0] bg-white px-[12px] py-[10px]"
          >
            <span className="font-sans text-[13px] leading-[16px] font-bold text-[#6b706e]">
              {row.n}.
            </span>
            <span className="font-sans text-[15px] leading-[18px] font-bold text-[#1c2a21]">
              {row.san}
            </span>
            <GradeChip grade={row.grade} />
            {row.reply ? (
              <span className="ml-auto font-sans text-[13.5px] leading-[16px] font-medium text-[#6b6b6b]">
                Kwaku: {row.reply}
              </span>
            ) : null}
          </li>
        ))}
        {currentNumber ? (
          <li
            aria-current="step"
            className="flex min-h-[42px] items-center gap-[10px] rounded-[12px] border-2 border-solid border-[#387440] bg-[#e2f1e4] px-[12px] py-[10px]"
          >
            <span className="font-sans text-[13px] leading-[16px] font-bold text-[#6b706e]">
              {currentNumber}.
            </span>
            <span className="font-sans text-[15px] leading-[18px] font-bold text-[#1c2a21]">
              Your move…
            </span>
          </li>
        ) : null}
      </ol>
    </div>
  );
};

export default ChessMoveList;
