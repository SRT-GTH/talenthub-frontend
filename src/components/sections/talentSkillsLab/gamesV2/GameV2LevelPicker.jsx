import { classNames } from '../../../../utils/classNames.js';
import { FOCUS_RING } from '../skillsLabDialogUtils.js';
import { radioKeyTarget } from './gamesV2Radio.js';

/*
 * GameV2LevelPicker — "CHOOSE A LEVEL": Beginner / Intermediate / Advanced / Expert with the game's size line ("4×4 cards").
 * Figma `level picker`: #f2f5f4 tray (Playful 1px ink@.20 outline, r16 / Focused r12) with 5px padding and 6px gaps; the picked
 * level is a white tile (Playful 1.5px ink@.55 + 2px hard shadow, Focused hairline) with a bold label and a green size line.
 * Radio semantics: arrow keys move + select (one tab stop).
 */
const GameV2LevelPicker = ({ levels, value, onChange }) => (
  <div
    role="radiogroup"
    aria-label="Choose a level"
    onKeyDown={(e) => {
      const target = radioKeyTarget(e, e.currentTarget);
      if (!target) return;
      e.preventDefault();
      target.focus();
      onChange(target.dataset.level);
    }}
    className="grid grid-cols-2 gap-[6px] rounded-[12px] bg-[#f2f5f4] p-[5px] min-[480px]:grid-cols-4 playful:rounded-[16px] playful:border playful:border-solid playful:border-[rgba(28,42,33,0.2)]"
  >
    {levels.map((level) => {
      const on = level.id === value;
      return (
        <button
          key={level.id}
          type="button"
          role="radio"
          aria-checked={on}
          data-level={level.id}
          tabIndex={on ? 0 : -1}
          onClick={() => onChange(level.id)}
          className={classNames(
            'flex min-h-[24px] min-w-0 cursor-pointer flex-col items-center gap-[2px] rounded-[9px] border border-solid px-[8px] py-[10px] font-sans playful:rounded-[12px]',
            on
              ? 'border-[#dee5e0] bg-white playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_2px_0_rgba(28,42,33,0.35)]'
              : 'border-transparent bg-transparent',
            FOCUS_RING
          )}
        >
          <span
            className={classNames(
              'text-[14px] leading-[17px]',
              on ? 'font-bold text-[#1c2a21]' : 'font-semibold text-[#6b6b6b]'
            )}
          >
            {level.label}
          </span>
          <span
            className={classNames(
              'text-[12px] font-medium leading-[14px]',
              on ? 'text-[#27522e]' : 'text-[#6b706e]'
            )}
          >
            {level.size}
          </span>
        </button>
      );
    })}
  </div>
);

export default GameV2LevelPicker;
