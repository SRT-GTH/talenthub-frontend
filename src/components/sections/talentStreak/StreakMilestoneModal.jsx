import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';
import { STREAK_MILESTONE_MODAL } from './talentStreakData.js';
import modalMark from '../../../assets/talent-streak/page/modal-mark.svg';
import modalTitleMark from '../../../assets/talent-streak/page/modal-title-mark.svg';
import modalFlameFocused from '../../../assets/talent-streak/page/modal-flame-focused.svg';
import modalTitleFlameFocused from '../../../assets/talent-streak/page/modal-title-flame-focused.svg';
import shieldSm from '../../../assets/talent-streak/page/shield-sm.svg';

const log = debug('StreakMilestoneModal');
const COPY = STREAK_MILESTONE_MODAL;

/* Confetti chips as drawn (Figma rotation is counter-clockwise, CSS is clockwise: signs flipped). */
const CONFETTI = [
  { x: '8%', y: '10%', w: 17, h: 12, rot: 20, fill: '#ffffff' },
  { x: '84%', y: '16%', w: 17, h: 14, rot: -30, fill: '#ffd86b' },
  { x: '12%', y: '61%', w: 17, h: 16, rot: 40, fill: '#ffd86b' },
  { x: '87%', y: '69%', w: 17, h: 11, rot: -15, fill: '#ffffff' },
];

const REWARD_TONE = {
  gold: 'bg-[#ffd86b]',
  blue: 'bg-[#eaeffb]',
  mint: 'bg-[#ebf1ec]',
};

/*
 * 15-day milestone modal (Figma S-08 "Milestone modal" Playful 7534:2220 / Focused 8110:25717), shown over the
 * streak page at `/streak?milestone=15` (scrim #1c2a21 @ 45%). Playful: 520px, ink 1.5 border + shelf shadow,
 * orange celebration band with a tilted yellow badge (mascot + "15"), confetti chips, white sticker, "+50 XP".
 * Focused: ink 10% hairline + soft shadow, 150px badge with a gold flame, flat mint sticker, "+50 pts".
 * Portaled to <body>; Esc, the scrim and both buttons close it. Focus moves to "Keep going" and returns on close.
 * Props: { onClose } — called with no args (the page removes `milestone` from the URL).
 */
const StreakMilestoneModal = (props) => {
  const onClose = props.onClose;
  const { uiStyle } = useUiStyle();
  const playful = uiStyle === 'playful';
  const keepRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    log('open', { uiStyle });
    const previous = document.activeElement;
    keepRef.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') {
        log('close: Escape');
        onClose?.();
        return;
      }
      if (event.key !== 'Tab') return;
      // keep Tab inside the dialog
      const focusables = dialogRef.current?.querySelectorAll('button');
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (previous && typeof previous.focus === 'function') previous.focus();
    };
  }, [onClose, uiStyle]);

  const share = async () => {
    log('share it');
    try {
      if (navigator.share) await navigator.share({ title: COPY.title, text: COPY.body });
    } catch (error) {
      log('share cancelled', error?.name);
    }
  };

  const modal = (
    <div className="fixed inset-0 z-[300] flex items-center justify-center overflow-y-auto p-[16px]">
      <button
        type="button"
        aria-label={COPY.keepGoing}
        tabIndex={-1}
        onClick={() => {
          log('close: scrim');
          onClose?.();
        }}
        className="fixed inset-0 cursor-default border-0 bg-[rgba(28,42,33,0.45)] p-0"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="streak-milestone-title"
        className={classNames(
          'relative my-auto w-full max-w-[520px] overflow-hidden rounded-[28px] border border-solid border-[rgba(28,42,33,0.1)] bg-[#fffefc] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)]',
          'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]'
        )}
      >
        <div className="relative flex flex-col items-center gap-[10px] bg-[#f59638] px-[30px] pb-[24px] pt-[28px]">
          <div
            className={classNames(
              'relative flex size-[150px] flex-col items-center justify-center rounded-[40px] border border-solid border-[rgba(28,42,33,0.1)] bg-[#ffd86b] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)]',
              'playful:size-[165px] playful:rotate-[-6deg] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]'
            )}
          >
            <img
              src={playful ? modalMark : modalFlameFocused}
              alt=""
              aria-hidden="true"
              className="size-[34px] playful:size-[37px]"
            />
            <span className="font-sans text-[31px] font-semibold leading-[37px] text-[#1c2a21] playful:font-heading">
              {COPY.badgeDays}
            </span>
          </div>
          <span
            className={classNames(
              'inline-flex items-center rounded-full bg-[#ebf1ec] px-[10px] py-[4px] font-sans text-[12.5px] font-bold leading-[15px] text-[#1f4d26]',
              'playful:border-[1.2px] playful:border-solid playful:border-[#1c2a21] playful:bg-white playful:text-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]'
            )}
          >
            {COPY.sticker}
          </span>
          {CONFETTI.map((c) => (
            <span
              key={`${c.x}-${c.y}`}
              aria-hidden="true"
              className="absolute rounded-[2px] border border-solid border-[rgba(28,42,33,0.12)] playful:border-[#1c2a21] max-sm:hidden"
              style={{
                left: c.x,
                top: c.y,
                width: c.w,
                height: c.h,
                background: c.fill,
                transform: `rotate(${c.rot}deg)`,
              }}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-[20px] px-[28px] pb-[24px] pt-[22px] max-sm:px-[18px]">
          <div className="flex items-center justify-center gap-[5px]">
            <h2
              id="streak-milestone-title"
              className="m-0 font-heading text-[clamp(26px,2vw,34px)] font-semibold leading-[1.2] text-[#1c2a21]"
            >
              {COPY.title}
            </h2>
            <img
              src={playful ? modalTitleMark : modalTitleFlameFocused}
              alt=""
              aria-hidden="true"
              className="size-[44px] shrink-0 playful:size-[48px] max-sm:size-[36px]"
            />
          </div>
          <p className="m-0 max-w-[461px] text-center font-sans text-[14.5px] leading-[22px] text-[#595959]">
            {COPY.body}
          </p>
          <ul className="m-0 flex list-none flex-wrap justify-center gap-[8px] p-0">
            {COPY.rewards.map((r) => (
              <li
                key={r.id}
                className={classNames(
                  'inline-flex items-center gap-[5px] rounded-full border-[1.2px] border-solid border-[rgba(28,42,33,0.12)] px-[12px] py-[6px] font-sans text-[12.5px] font-bold leading-[15px] text-[#1c2a21] playful:border-[#1c2a21]',
                  REWARD_TONE[r.tone]
                )}
              >
                {playful ? r.label.playful : r.label.focused}
                {r.shield ? (
                  <img src={shieldSm} alt="" aria-hidden="true" className="size-[14px]" />
                ) : null}
              </li>
            ))}
          </ul>
          <div className="flex w-full gap-[10px] pt-[6px] max-sm:flex-col">
            <button
              type="button"
              onClick={share}
              className="flex h-[56px] flex-1 cursor-pointer items-center justify-center rounded-[14px] border-2 border-solid border-[rgba(28,42,33,0.3)] bg-white px-[34px] font-sans text-[16px] font-bold leading-[24px] tracking-[0.1px] text-[#1c2a21] shadow-[0_4px_0_rgba(18,18,18,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {COPY.share}
            </button>
            <button
              ref={keepRef}
              type="button"
              onClick={() => {
                log('close: keep going');
                onClose?.();
              }}
              className="flex h-[56px] flex-1 cursor-pointer items-center justify-center rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[34px] font-sans text-[16px] font-bold leading-[24px] tracking-[0.1px] text-white shadow-[0_4px_0_#224626] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {COPY.keepGoing}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default StreakMilestoneModal;
