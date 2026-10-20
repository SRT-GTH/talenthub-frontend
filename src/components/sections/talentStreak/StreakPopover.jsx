import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { DISPLAY } from '../talentHome/TabsParts.jsx';
import {
  STREAK_POPOVER_COPY,
  STREAK_POPOVER_PARAM_TO_KIND,
  STREAK_POPOVER_STATES,
} from './talentStreakData.js';
import { startFreshStreak } from '../../../services/streak.api.js';
import mascotActive from '../../../assets/talent-streak/popover/mascot-active.svg';
import mascotDone from '../../../assets/talent-streak/popover/mascot-done.svg';
import mascotRisk from '../../../assets/talent-streak/popover/mascot-risk.svg';
import mascotFreeze from '../../../assets/talent-streak/popover/mascot-freeze.svg';
import mascotLost from '../../../assets/talent-streak/popover/mascot-lost.svg';
import mascotNew from '../../../assets/talent-streak/popover/mascot-new.svg';
import flameActive from '../../../assets/talent-streak/popover/f-mark-active.svg';
import flameDone from '../../../assets/talent-streak/popover/f-mark-done.svg';
import flameRisk from '../../../assets/talent-streak/popover/f-mark-risk.svg';
import flameFreeze from '../../../assets/talent-streak/popover/f-mark-freeze.svg';
import flameLost from '../../../assets/talent-streak/popover/f-mark-lost.svg';
import flameNew from '../../../assets/talent-streak/popover/f-mark-new.svg';
import dayFlame from '../../../assets/talent-streak/popover/day-flame.svg';
import dayFreeze from '../../../assets/talent-streak/popover/day-freeze.svg';
import dayLost from '../../../assets/talent-streak/popover/day-lost.svg';
import dayTodayMascot from '../../../assets/talent-streak/popover/day-today-mascot.svg';
import dayTodayFlame from '../../../assets/talent-streak/popover/f-day-today.svg';
import flameInline from '../../../assets/talent-streak/popover/flame-inline.svg';
import sparkle from '../../../assets/talent-streak/popover/sparkle.svg';
import shieldSm from '../../../assets/talent-streak/popover/shield-sm.svg';
import shieldMd from '../../../assets/talent-streak/popover/shield-md.svg';
import closeMd from '../../../assets/talent-streak/popover/close-md.svg';

const log = debug('StreakPopover');

/*
 * StreakPopover — Figma component set "GTH · Streak pop-up" 7532:317 (Focused twin 8256:90621), S-01..S-06
 * (Playful 7533:28 … 7533:3347, Focused 8110:21906 … 8110:24270). 380px card, r24, hangs under the nav streak
 * pill: top = nav bottom − 12, a 16×10 ink caret 45px from the card's left edge (Figma caret 7533:696 over the
 * pill centre). Six states from `?streak=open|done|risk|freeze|lost|new` (see STREAK_POPOVER_STATES).
 *
 * Playful = ink hairlines + hard shelf shadows, Bricolage count, mascot art, sparkle doodle, tilted stickers.
 * Focused (default) = hairline rgba(28,42,33,.12) borders, soft shadow, SF Pro Rounded count, plain flame art
 * (the Focused frames swap the mascot for a flame and drop the sparkle; the S-frame instances carry these
 * overrides, the Focused component sheet 8256:90621 predates them).
 *
 * Live: `live` = useLiveStreak() result. With live data, `?streak=open` (the nav pill) shows the talent's real card
 * (GET /streak → popover); the other `?streak=` values stay the drawn Figma states. "Start fresh" posts /streak/fresh.
 * Props: home (useTalentHomeState object: reads `home.streak`, closes with `home.update({ streak: null })`),
 *        anchorRef (optional; the nav streak pill. Without it the pill is found as `header [aria-label^="Streak,"]`).
 */
const TODAY_INDEX = 4;

const MARKS = {
  active: { playful: mascotActive, focused: flameActive },
  done: { playful: mascotDone, focused: flameDone },
  risk: { playful: mascotRisk, focused: flameRisk },
  freeze: { playful: mascotFreeze, focused: flameFreeze },
  lost: { playful: mascotLost, focused: flameLost },
  new: { playful: mascotNew, focused: flameNew },
};

const HEADER_TONES = {
  cream: 'bg-[#faf4e8]',
  peach: 'bg-[#fef5eb]',
  ice: 'bg-[#eaeffb]',
  grey: 'bg-[#f8f8f4]',
};

const STICKER_TONES = {
  white: 'bg-white',
  gold: 'bg-[#ffd86b]',
  orange: 'bg-[#f59638]',
};

const DAY_FLAMES = { lit: dayFlame, 'lit-freeze': dayFreeze, 'lit-lost': dayLost };

/* Dashed ring (Figma dash [4,3] on the pending "today" dot, [3,3] on the missed dot): CSS cannot dash a circle. */
const DashedRing = ({ stroke, width, dash, className }) => (
  <svg
    viewBox="0 0 36 36"
    aria-hidden="true"
    className={classNames('pointer-events-none absolute inset-0 size-full', className)}
  >
    <circle
      cx="18"
      cy="18"
      r={18 - width / 2}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeDasharray={dash}
    />
  </svg>
);

const DayDot = ({ kind, today }) => {
  const base =
    'relative flex size-[36px] shrink-0 items-center justify-center rounded-full border border-solid max-[340px]:size-[32px]';
  const lit =
    'border-[rgba(28,42,33,0.12)] bg-[#ffd86b] playful:border-[1.2px] playful:border-[#1c2a21]';

  if (DAY_FLAMES[kind]) {
    return (
      <span
        className={classNames(
          base,
          lit,
          // Playful draws the freeze-saved Friday with the hard shelf
          kind === 'lit-freeze' && today && 'playful:shadow-[2px_2px_0_#1c2a21]'
        )}
      >
        <img src={DAY_FLAMES[kind]} alt="" aria-hidden="true" className="size-[26px]" />
      </span>
    );
  }
  if (kind === 'today-done') {
    return (
      <span
        className={classNames(
          base,
          'border-[rgba(28,42,33,0.12)] bg-[#ffd86b]',
          'playful:border-[1.5px] playful:border-[#1c2a21] playful:bg-[#faf4e8] playful:shadow-[2px_2px_0_#1c2a21]'
        )}
      >
        <img src={dayTodayFlame} alt="" aria-hidden="true" className="size-[28px] playful:hidden" />
        <img
          src={dayTodayMascot}
          alt=""
          aria-hidden="true"
          className="hidden size-[28px] playful:block"
        />
      </span>
    );
  }
  if (kind === 'freeze') {
    return (
      <span className={classNames(base, 'border-[1.2px] border-[#244a9f] bg-[#eaeffb]')}>
        <img src={shieldMd} alt="" aria-hidden="true" className="size-[17px]" />
      </span>
    );
  }
  if (kind === 'missed') {
    return (
      <span className={classNames(base, 'border-0 bg-[#f9ebea]')}>
        <DashedRing stroke="#c0392b" width={1.2} dash="3 3" />
        <img src={closeMd} alt="" aria-hidden="true" className="size-[15px]" />
      </span>
    );
  }
  if (kind === 'today-pending') {
    return (
      <span className={classNames(base, 'border-0 bg-white')}>
        <DashedRing stroke="rgba(28,42,33,0.12)" width={1} dash="4 3" className="playful:hidden" />
        <DashedRing stroke="#1c2a21" width={2} dash="4 3" className="hidden playful:block" />
      </span>
    );
  }
  // future / empty
  return <span className={classNames(base, 'border-[#e1eae2] bg-[#f8f8f4]')} />;
};

const PopButton = ({ tone, onClick, children }) => {
  const primary = tone === 'primary';
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'inline-flex h-[48px] min-w-0 flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-[10px] border-b-2 border-l-2 border-r-2 border-t border-solid px-[18px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] transition-transform active:translate-y-[2px]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
        primary
          ? 'border-[#2a5730] bg-[#387440] shadow-[0_4px_0_#224626]'
          : 'border-[rgba(28,42,33,0.3)] bg-white text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)]'
      )}
    >
      {primary ? (
        <span
          style={{
            backgroundImage:
              'linear-gradient(188.377deg, rgb(254, 241, 231) 0%, rgb(232, 242, 237) 20.192%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

const StreakPopover = ({ home, anchorRef, live = null }) => {
  const param = home?.streak;
  const livePopover = param === 'open' && live?.data?.popover ? live.data.popover : null;
  const kind = livePopover ? livePopover.kind : STREAK_POPOVER_PARAM_TO_KIND[param];
  const state = livePopover ?? (kind ? STREAK_POPOVER_STATES[kind] : null);
  const open = Boolean(state);
  const navigate = useNavigate();
  const ref = useRef(null);
  const [pos, setPos] = useState({ top: 74, left: 12, caret: 45 });

  const close = () => {
    log('close');
    home.update({ streak: null });
  };

  const findPill = () =>
    anchorRef?.current ?? document.querySelector('header [aria-label^="Streak,"]');

  // Hang under the streak pill (Figma S-01: card top = nav bottom − 12, caret 45px in, pill centre = caret centre).
  useLayoutEffect(() => {
    if (!open) return undefined;
    const place = () => {
      const pill = findPill()?.getBoundingClientRect();
      const bar = findPill()?.closest('header')?.getBoundingClientRect();
      const width = Math.min(380, window.innerWidth - 24);
      if (!pill || !bar) return;
      const centre = pill.left + pill.width / 2;
      const left = Math.max(12, Math.min(centre - 53, window.innerWidth - width - 12));
      const next = {
        top: bar.bottom - 12,
        left,
        caret: Math.max(24, Math.min(centre - left - 8, width - 40)),
      };
      log('position', next);
      setPos(next);
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return undefined;
    log('mount', { param, kind });
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    const onDown = (e) => {
      const inside = ref.current?.contains(e.target);
      const onPill = findPill()?.contains(e.target);
      if (!inside && !onPill) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    ref.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, param]);

  if (!open) return null;

  const mark = MARKS[kind];
  const sticker = state.sticker;

  const runAction = (action) => {
    log('action', action.id, action.intent);
    close();
    // ⚠️ ASSUMPTION (not drawn): "Repair my streak" also goes to My Learning (2 lessons today repair it, server side);
    // "Start fresh" tells the server to drop the repair offer.
    if (action.intent === 'learn' || action.intent === 'repair') navigate('/learning');
    if (action.intent === 'fresh' && live) {
      startFreshStreak()
        .then(() => live.reload())
        .catch((err) => log('start fresh failed', err?.response?.status || err?.message));
    }
  };
  const openDetails = () => {
    log('see streak details');
    close();
    navigate('/streak');
  };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={STREAK_POPOVER_COPY.dialogLabel}
      tabIndex={-1}
      className="fixed z-50 w-[380px] max-w-[calc(100vw-24px)] outline-none"
      style={{ top: pos.top, left: pos.left }}
    >
      <div
        className={classNames(
          'flex flex-col gap-[8px] overflow-hidden rounded-[24px] border border-solid border-[#387440] bg-[#fffefc]',
          'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)]',
          'playful:border-[1.5px] playful:shadow-[4px_4px_0_rgba(56,116,64,0.4),0_10px_24px_rgba(56,116,64,0.15)]'
        )}
      >
        <div
          className={classNames(
            'relative flex items-center gap-[14px] pb-[16px] pl-[18px] pr-[20px] pt-[18px]',
            HEADER_TONES[state.header]
          )}
        >
          <img
            src={mark.focused}
            alt=""
            aria-hidden="true"
            className="size-[68px] shrink-0 playful:hidden"
          />
          <img
            src={mark.playful}
            alt=""
            aria-hidden="true"
            className="hidden size-[68px] shrink-0 playful:block"
          />
          <div className="flex min-w-0 flex-col items-start">
            <div
              className={classNames(
                'flex items-baseline gap-[6px]',
                state.muted ? 'text-[#737373]' : 'text-[#1c2a21]'
              )}
            >
              <span
                className={classNames(
                  'font-sans text-[44px] leading-[48px] font-semibold',
                  DISPLAY
                )}
              >
                {state.count}
              </span>
              <span className="font-sans text-[15px] leading-[18px] font-semibold">
                {STREAK_POPOVER_COPY.unit}
              </span>
            </div>
            {/* Figma lays the 4°-tilted sticker out by its bounding box: ~3px of slack above and below. */}
            <div className="py-[3px]">
              <span
                className={classNames(
                  'inline-flex rotate-[4deg] items-center gap-[4px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] px-[10px] py-[4px] font-sans text-[11.5px] leading-[14px] font-bold text-[#1c2a21] max-lg:text-[12px]',
                  'playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]',
                  STICKER_TONES[sticker.tone]
                )}
              >
                {sticker.label}
                {sticker.icon === 'shield' && (
                  <img src={shieldSm} alt="" aria-hidden="true" className="size-[14px]" />
                )}
              </span>
            </div>
          </div>
          <img
            src={sparkle}
            alt=""
            aria-hidden="true"
            className="absolute right-[23px] top-[14px] hidden size-[14px] playful:block"
          />
        </div>

        <div className="flex justify-between px-[18px] pb-[4px] pt-[14px]">
          {state.week.map((day, i) => {
            // Live weeks put "today" on the real weekday; the drawn frames always have it on Friday.
            const todayAt = state.week.findIndex((d) => String(d.kind).startsWith('today'));
            const today = i === (todayAt >= 0 ? todayAt : TODAY_INDEX);
            return (
              <div key={i} className="flex flex-col items-center gap-[4px]">
                <DayDot kind={day.kind} today={today} />
                <span
                  className={classNames(
                    'font-sans text-[11.5px] leading-[14px] max-lg:text-[12px]',
                    today ? 'font-bold text-[#1c2a21]' : 'font-semibold text-[#737373]'
                  )}
                >
                  {day.letter}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-[12px] px-[20px] pb-[20px] pt-[12px]">
          <div className="flex items-center gap-[5px]">
            <p className="m-0 min-w-0 flex-1 font-sans text-[14.5px] leading-[20px] font-medium text-[#1c2a21]">
              {state.message}
            </p>
            {state.flame && (
              <img src={flameInline} alt="" aria-hidden="true" className="size-[17px] shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-[8px] rounded-[12px] bg-[#f8f8f4] px-[12px] py-[8px]">
            <span className="font-sans text-[12.5px] leading-[15px] font-semibold text-[#595959]">
              {state.info}
            </span>
          </div>
          <div className="flex items-center gap-[8px] py-[6px]">
            {state.actions.map((action) => (
              <PopButton
                key={action.id}
                tone={action.id === 'primary' ? 'primary' : 'secondary'}
                onClick={() => runAction(action)}
              >
                {action.label}
              </PopButton>
            ))}
          </div>
          <button
            type="button"
            onClick={openDetails}
            className="w-fit cursor-pointer border-0 bg-transparent p-0 text-left font-sans text-[13px] leading-[16px] font-semibold text-[#2d5d33] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            {STREAK_POPOVER_COPY.link}
          </button>
        </div>
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-[8px] h-[10px] w-[16px] bg-[#1c2a21]"
        style={{ left: pos.caret, clipPath: 'polygon(50% 0, 0 100%, 100% 100%)' }}
      />
    </div>
  );
};

export default StreakPopover;
