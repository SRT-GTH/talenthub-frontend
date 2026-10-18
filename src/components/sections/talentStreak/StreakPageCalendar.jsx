import { useEffect, useMemo } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';
import { STREAK_PAGE_COPY } from './talentStreakData.js';
import { buildStreakMonth } from './streakCalendarUtils.js';
import flameSm from '../../../assets/talent-streak/page/flame-sm.svg';
import goalPlayful from '../../../assets/talent-streak/page/goal-mark-playful.svg';
import goalFocused from '../../../assets/talent-streak/page/goal-mark-focused.svg';
import todayPlayful from '../../../assets/talent-streak/page/today-mark-playful.svg';
import todayFocused from '../../../assets/talent-streak/page/today-mark-focused.svg';

const log = debug('StreakPageCalendar');
const LABELS = STREAK_PAGE_COPY.cellLabels;

/*
 * Month calendar (Figma "Calendar" 7534:1400 / Focused 8110:24792): Monday-first grid built by real month
 * math (buildStreakMonth) from the payload's `month` { year, month, today, litDates, goalDate }.
 * Cells are 40px tall, r12: lit = yellow + ink 1px with a flame over the day; missed / today / goal /
 * today-goal carry the labels drawn in Figma. Playful card: ink 1.5 border + shelf shadow, r20, Bricolage
 * title; Focused: #e1eae2 hairline, r22, no shadow. The goal cell is cream + amber in Playful, #fff8e1 + gold
 * in Focused. Labels ("missed", "today", "On Fire") hide below sm where 33px cells cannot hold them (the
 * status stays in the cell's accessible name).
 * Props: { month } — payload `month`.
 */
const NUM_MUTED = 'font-sans text-[13px] font-medium leading-[16px] text-[#737373]';
const NUM_LIT = 'font-sans text-[10px] font-bold leading-[12px] text-[#1c2a21] max-lg:text-[12px]';

const Cell = (props) => {
  const { cell, monthName, playful } = props;
  if (cell.status === 'pad') return <div aria-hidden="true" className="h-[40px] max-sm:h-[44px]" />;
  const base =
    'relative flex h-[40px] min-w-0 flex-col items-center justify-center rounded-[12px] max-sm:h-[44px]';
  const name = `${monthName} ${cell.day}`;
  const label = {
    lit: `${name}, lit`,
    todayGoal: `${name}, ${LABELS.todayGoal}`,
    today: `${name}, ${LABELS.today}`,
    goal: `${name}, ${LABELS.goal}`,
    missed: `${name}, ${LABELS.missed}`,
    future: name,
  }[cell.status];

  if (cell.status === 'lit') {
    return (
      <div
        role="listitem"
        aria-label={label}
        className={classNames(base, 'border border-solid border-[#1c2a21] bg-[#ffd86b]')}
      >
        <img src={flameSm} alt="" aria-hidden="true" className="size-[15px] shrink-0" />
        <span className={NUM_LIT}>{cell.day}</span>
      </div>
    );
  }
  if (cell.status === 'todayGoal') {
    return (
      <div
        role="listitem"
        aria-label={label}
        className={classNames(
          base,
          'gap-[3px] border-[1.5px] border-solid border-[#1c2a21] bg-[#ffd86b] playful:bg-[#faf4e8]'
        )}
      >
        <span className="flex items-center gap-[4px]">
          <img
            src={playful ? todayPlayful : todayFocused}
            alt=""
            aria-hidden="true"
            className="size-[16px] shrink-0"
          />
          <span className={NUM_LIT}>{cell.day}</span>
        </span>
        <span className="whitespace-nowrap font-sans text-[10px] font-semibold leading-[12px] text-[#387440] max-lg:text-[12px] max-sm:hidden">
          {LABELS.todayGoal}
        </span>
      </div>
    );
  }
  if (cell.status === 'today') {
    return (
      <div
        role="listitem"
        aria-label={label}
        aria-current="date"
        className={classNames(base, 'border-2 border-dashed border-[#1c2a21] bg-white')}
      >
        <span className="font-sans text-[13px] font-bold leading-[16px] text-[#1c2a21]">
          {cell.day}
        </span>
        <span className="font-sans text-[9px] font-semibold leading-[11px] text-[#2d5d33] max-lg:text-[12px] max-lg:leading-[12px] max-sm:hidden">
          {LABELS.today}
        </span>
      </div>
    );
  }
  if (cell.status === 'goal') {
    const goalMark = playful ? goalPlayful : goalFocused;
    return (
      <div
        role="listitem"
        aria-label={label}
        className={classNames(
          base,
          'gap-[1px] border-[1.5px] border-solid border-[#ffd86b] bg-[#fff8e1]',
          'playful:border-[#c8951a] playful:bg-[#faf4e8]'
        )}
      >
        <span className={NUM_MUTED}>{cell.day}</span>
        <span className="flex items-center gap-[3px] max-sm:hidden">
          <img
            src={goalMark}
            alt=""
            aria-hidden="true"
            className="size-[14px] shrink-0 opacity-[0.85]"
          />
          <span className="font-sans text-[10px] font-medium leading-[12px] text-[#a0700a] max-lg:text-[12px]">
            {LABELS.goal}
          </span>
        </span>
        <img
          src={goalMark}
          alt=""
          aria-hidden="true"
          className="hidden size-[14px] shrink-0 max-sm:block"
        />
      </div>
    );
  }
  if (cell.status === 'missed') {
    return (
      <div
        role="listitem"
        aria-label={label}
        className={classNames(base, 'gap-[1px] bg-[#f8f8f4]')}
      >
        <span className="font-sans text-[13px] font-medium leading-[16px] text-[#bfbfbf]">
          {cell.day}
        </span>
        <span className="font-sans text-[10px] font-medium leading-[12px] text-[#969696] max-lg:text-[12px] max-sm:hidden">
          {LABELS.missed}
        </span>
      </div>
    );
  }
  return (
    <div role="listitem" aria-label={label} className={classNames(base, 'bg-[#f8f8f4]')}>
      <span className={NUM_MUTED}>{cell.day}</span>
    </div>
  );
};

const StreakPageCalendar = (props) => {
  const month = props.month;
  const { uiStyle } = useUiStyle();
  const playful = uiStyle === 'playful';
  const built = useMemo(() => buildStreakMonth(month), [month]);
  useEffect(() => {
    log('mount', { title: built.title, lit: built.litCount, missed: built.missedCount });
  }, [built.title, built.litCount, built.missedCount]);

  return (
    <section
      aria-label={built.title}
      className={classNames(
        'flex flex-col gap-[12px] rounded-[22px] border border-solid border-[#e1eae2] bg-white p-[20px] max-sm:p-[14px]',
        'playful:rounded-[20px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]'
      )}
    >
      <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[4px]">
        <h2 className="m-0 min-w-0 flex-1 font-sans text-[21px] font-semibold leading-[26px] text-[#1c2a21] playful:font-heading">
          {built.title}
        </h2>
        <img src={flameSm} alt="" aria-hidden="true" className="size-[14px]" />
        <span className="font-sans text-[12.5px] font-semibold leading-[15px] text-[#595959] max-lg:text-[13px]">
          {`${built.litCount} days lit · ${built.missedCount} missed`}
        </span>
      </div>
      <div className="flex flex-col gap-[6px]">
        <div className="grid grid-cols-7 gap-[6px]" aria-hidden="true">
          {STREAK_PAGE_COPY.weekdays.map((d) => (
            <span
              key={d}
              className="text-center font-sans text-[11.5px] font-semibold leading-[14px] text-[#737373] max-lg:text-[12px]"
            >
              {d}
            </span>
          ))}
        </div>
        <div role="list" className="flex flex-col gap-[6px]">
          {built.weeks.map((week) => (
            <div key={week[0].id} className="grid grid-cols-7 gap-[6px]">
              {week.map((cell) => (
                <Cell key={cell.id} cell={cell} monthName={built.monthName} playful={playful} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StreakPageCalendar;
