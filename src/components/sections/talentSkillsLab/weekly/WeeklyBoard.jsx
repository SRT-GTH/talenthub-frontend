import { classNames } from '../../../../utils/classNames.js';
import { HubToggle } from '../HubParts.jsx';

/*
 * The weekly challenge board as SL-M4 draws it (Playful 7854:13342 / Focused 8110:490918): a soft panel with the board
 * title + "N playing", then rank · name · score rows, the talent's own row highlighted. Shared by the WeeklyDialog and
 * the weekly result view. `board` = { title, playing?, rows: [{ rank, name, score, you? }], notice? } (weeklyFormat.js
 * boardView, or the drawn SKILLS_LAB_WEEKLY.board). A hidden board (fewer than 5 who joined) shows its notice above
 * the talent's own row.
 */
export const WeeklyBoard = ({ board }) => (
  <div className="flex flex-col gap-[6px] rounded-[16px] bg-[#f8f8f4] p-[16px]">
    <div className="flex items-center justify-between gap-[8px]">
      <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
        {board.title}
      </span>
      {board.playing ? (
        <span className="font-sans text-[13px] leading-[16px] text-[#595959]">{board.playing}</span>
      ) : null}
    </div>
    {board.notice ? (
      <p className="m-0 px-[10px] py-[4px] font-sans text-[13px] leading-[18px] text-[#595959]">
        {board.notice}
      </p>
    ) : null}
    {board.rows.map((row) => (
      <div
        key={`${row.rank}:${row.name}`}
        className={classNames(
          'flex items-center gap-[12px] rounded-[10px] px-[10px] py-[8px]',
          row.you && 'bg-[#ffd86b]'
        )}
      >
        <span className="w-[24px] shrink-0 font-sans text-[14px] font-bold leading-[17px] text-[#1c2a21]">
          {row.rank}
        </span>
        <span
          className={classNames(
            'min-w-0 flex-1 font-sans text-[14px] leading-[17px] text-[#1c2a21]',
            row.you ? 'font-bold' : 'font-medium'
          )}
        >
          {row.name}
        </span>
        <span className="shrink-0 font-sans text-[13px] font-medium leading-[16px] text-[#1c2a21]">
          {row.score}
        </span>
      </div>
    ))}
  </div>
);

/*
 * Opt-in switch for the board. ⚠️ ASSUMPTION: SL-M4 draws no control for joining (only the "opt-in" privacy line), so
 * this is the smallest addition: one switch row under the privacy line, the same HubToggle as "Show scores on your
 * profile". Not drawn for minors (they are never listed).
 */
export const WeeklyOptIn = ({ on, onChange }) => (
  <div className="flex items-center justify-between gap-[12px]">
    <span className="font-sans text-[14px] font-medium leading-[17px] text-[#1c2a21]">
      Show me on the board
    </span>
    <HubToggle on={on} onChange={onChange} label="Show me on the weekly board" />
  </div>
);
