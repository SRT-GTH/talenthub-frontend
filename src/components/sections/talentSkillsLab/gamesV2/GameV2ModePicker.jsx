import { classNames } from '../../../../utils/classNames.js';
import { FOCUS_RING } from '../skillsLabDialogUtils.js';
import { GvLockIcon, GvRepeatIcon, GvShieldIcon } from './GamesV2Icons.jsx';
import { GAME_V2_DETAILS_COPY as COPY } from './gamesV2Data.js';
import { radioKeyTarget } from './gamesV2Radio.js';

/*
 * GameV2ModePicker — "HOW DO YOU WANT TO PLAY?": two radio cards, Ranked (shield) and Practice (repeat). The picked card is
 * green-tinted with a 2px green border and a thick green ring radio. On cooldown (GV-03) Ranked is disabled: grey tint, hairline,
 * lock icon and the "You’ve used this week’s ranked play. Next one opens …" line, and Practice is picked.
 * Arrow keys move + select between the enabled options.
 */
const Radio = ({ on, muted }) => (
  <span
    aria-hidden="true"
    className={classNames(
      'box-border size-[18px] shrink-0 rounded-full border-solid bg-white',
      on ? 'border-[5px] border-[#387440]' : 'border-[1.5px] border-[#6b706e]',
      muted && !on && 'bg-[#f2f5f4]'
    )}
  />
);

const Option = ({ id, title, note, on, disabled, icon, onPick }) => (
  <button
    type="button"
    role="radio"
    aria-checked={on}
    disabled={disabled}
    data-mode={id}
    tabIndex={on ? 0 : -1}
    onClick={() => onPick(id)}
    className={classNames(
      'flex min-h-[24px] min-w-0 cursor-pointer flex-col gap-[6px] rounded-[12px] border border-solid text-left font-sans disabled:cursor-not-allowed playful:rounded-[16px]',
      on
        ? 'border-2 border-[#387440] bg-[#e2f1e4] p-[12px]'
        : disabled
          ? 'border-[#dee5e0] bg-[#f2f5f4] p-[13px]'
          : 'border-[#dee5e0] bg-white p-[13px] playful:border-[rgba(28,42,33,0.35)]',
      FOCUS_RING
    )}
  >
    <span className="flex items-center gap-[8px]">
      <Radio on={on} muted={disabled} />
      <span
        className={classNames(
          'text-[15px] font-bold leading-[18px]',
          disabled ? 'text-[#6b6b6b]' : 'text-[#1c2a21]'
        )}
      >
        {title}
      </span>
      <span className="min-w-0 flex-1" />
      {icon}
    </span>
    <span className="text-[12.5px] leading-[18px] text-[#6b6b6b]">{note}</span>
  </button>
);

const GameV2ModePicker = ({ mode, onChange, cooldown, opensAt }) => (
  <div
    role="radiogroup"
    aria-label="How do you want to play?"
    onKeyDown={(e) => {
      const target = radioKeyTarget(e, e.currentTarget);
      if (!target) return;
      e.preventDefault();
      target.focus();
      onChange(target.dataset.mode);
    }}
    className="grid grid-cols-1 items-start gap-[12px] min-[480px]:grid-cols-2"
  >
    <Option
      id="ranked"
      title={COPY.ranked}
      note={
        cooldown
          ? `You’ve used this week’s ranked play. Next one opens ${opensAt}.`
          : COPY.rankedNote
      }
      on={mode === 'ranked'}
      disabled={cooldown}
      onPick={onChange}
      icon={
        cooldown ? (
          <GvLockIcon className="size-[16px] shrink-0 text-[#27522e]" />
        ) : (
          <GvShieldIcon className="size-[16px] shrink-0 text-[#27522e]" />
        )
      }
    />
    <Option
      id="practice"
      title={COPY.practice}
      note={COPY.practiceNote}
      on={mode === 'practice'}
      onPick={onChange}
      icon={<GvRepeatIcon className="size-[16px] shrink-0 text-[#6b706e]" />}
    />
  </div>
);

export default GameV2ModePicker;
