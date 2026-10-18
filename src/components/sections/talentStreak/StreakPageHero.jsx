import { useEffect } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';
import { STREAK_PAGE_COPY } from './talentStreakData.js';
import heroMarkPlayful from '../../../assets/talent-streak/page/hero-mark-playful.svg';
import heroMarkPlayful15 from '../../../assets/talent-streak/page/hero-mark-playful-15.svg';
import heroFlameFocused from '../../../assets/talent-streak/page/hero-flame-focused.svg';
import heroFlameFocused15 from '../../../assets/talent-streak/page/hero-flame-focused-15.svg';
import heroSparkle from '../../../assets/talent-streak/page/hero-sparkle.svg';
import flameSm from '../../../assets/talent-streak/page/flame-sm.svg';
import shield from '../../../assets/talent-streak/page/shield.svg';

const log = debug('StreakPageHero');

/*
 * Streak hero card + stat tiles (Figma "Streak hero" 7534:1374 / Focused 8110:24763).
 * Playful: ink border 1.5 + hard shelf shadow, mascot, Bricolage numerals, yellow sticker, sparkle doodle.
 * Focused: hairline border (ink 10%) + soft shadow, plain flame (gold + green dot once On Fire unlocked),
 * SF Pro Rounded numerals, flat mint sticker. The "Freezes" count is Bricolage in BOTH frames (as drawn).
 * Props: { summary } — the `summary` block of the streak payload.
 */
const Tile = ({ children, label, className }) => (
  <div
    className={classNames(
      'flex min-w-[76px] flex-1 flex-col items-center justify-center gap-[2px] rounded-[16px] border-[1.2px] border-solid border-[#1c2a21] bg-white px-[16px] py-[12px] sm:flex-none',
      className
    )}
  >
    {children}
    <span className="whitespace-nowrap font-sans text-[11.5px] font-semibold leading-[14px] text-[#737373] max-lg:text-[12px]">
      {label}
    </span>
  </div>
);

const NUM =
  'font-sans text-[23px] font-semibold leading-[29px] text-[#1c2a21] playful:font-heading';

const StreakPageHero = (props) => {
  const summary = props.summary;
  const current = summary.current;
  const { uiStyle } = useUiStyle();
  const playful = uiStyle === 'playful';
  const unlocked = current >= 15;
  useEffect(() => {
    log('mount', { current, unlocked });
  }, [current, unlocked]);

  const playfulMark = unlocked ? heroMarkPlayful15 : heroMarkPlayful;
  const focusedMark = unlocked ? heroFlameFocused15 : heroFlameFocused;

  return (
    <section
      aria-label={STREAK_PAGE_COPY.title}
      className={classNames(
        'relative flex flex-wrap items-center gap-x-[24px] gap-y-[18px] rounded-[26px] border border-solid border-[rgba(28,42,33,0.1)] bg-[#faf4e8] py-[22px] pl-[22px] pr-[26px] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] max-sm:p-[16px]',
        'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]'
      )}
    >
      <img
        src={playful ? playfulMark : focusedMark}
        alt=""
        aria-hidden="true"
        className="size-[clamp(64px,5vw,80px)] shrink-0"
      />
      <img
        src={heroSparkle}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-[170px] top-[20px] hidden size-[18px] playful:block max-sm:!hidden"
      />
      <div className="flex min-w-0 flex-col gap-[2px]">
        <p className="m-0 flex items-end gap-[8px]">
          <span className="font-sans text-[clamp(56px,4.7vw,81px)] font-semibold leading-[1.1] text-[#1c2a21] playful:font-heading">
            {summary.current}
          </span>
          <span className="pb-[10px] font-sans text-[18px] font-semibold leading-[21px] text-[#1c2a21]">
            {STREAK_PAGE_COPY.heroUnit}
          </span>
        </p>
        <span
          className={classNames(
            'inline-flex w-fit items-center gap-[4px] rounded-full bg-[#ebf1ec] px-[10px] py-[4px] font-sans text-[12px] font-bold leading-[14px] text-[#1f4d26]',
            'playful:border-[1.2px] playful:border-solid playful:border-[#1c2a21] playful:bg-[#ffd86b] playful:text-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21] playful:py-[6px] playful:leading-[20px]'
          )}
        >
          {summary.heroSticker}
          <img
            src={flameSm}
            alt=""
            aria-hidden="true"
            className="size-[14px] playful:size-[15px]"
          />
        </span>
      </div>
      <div className="hidden min-w-[24px] flex-1 xl:block" aria-hidden="true" />
      <div className="flex w-full flex-wrap gap-[10px] sm:w-auto xl:flex-nowrap">
        <Tile label={STREAK_PAGE_COPY.statLabels.longest}>
          <span className={NUM}>{summary.longest}</span>
        </Tile>
        <Tile label={STREAK_PAGE_COPY.statLabels.totalDays}>
          <span className={NUM}>{summary.totalDays}</span>
        </Tile>
        <Tile label={STREAK_PAGE_COPY.statLabels.freezes}>
          <span className="flex items-center gap-[5px]">
            <span className="font-heading text-[23px] font-semibold leading-[29px] text-[#1c2a21]">
              {summary.freezes}
            </span>
            <img src={shield} alt="" aria-hidden="true" className="-mx-[3px] size-[30px]" />
          </span>
        </Tile>
        <Tile
          label={
            playful ? STREAK_PAGE_COPY.pointsLabel.playful : STREAK_PAGE_COPY.pointsLabel.focused
          }
        >
          <span className={NUM}>{summary.points}</span>
        </Tile>
      </div>
    </section>
  );
};

export default StreakPageHero;
