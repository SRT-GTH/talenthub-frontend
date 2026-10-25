import { useEffect, useId, useState } from 'react';
import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';
import { useUiStyle } from '../../hooks/useUiStyle.js';
import robot from '../../assets/talent-home/career-buddy-robot.png';

const log = debug('AskBuddyFabButton');

/*
 * AskBuddyFabButton — "GTH · Ask Buddy FAB" (Figma component set 9412:550912, Playful 7862:59664, Focused 9412:550908). The Ask Buddy launcher is an icon now, not a pill with a label:
 * a 72 round button holding the Buddy robot head (62 image), a 84 charge ring behind it, and the nudge ("Buddy wakes up", styles/askBuddyFab.css).
 *   Playful: 2px #1c2a21 border, shadow 0 10 22 rgba(41,71,46,.25) + a 0 4 0 #1c2a21 shelf; nudge = charge ring spins, squash, 360deg flip-jump, dust puffs + kente sparks, buzz lines,
 *            a waving hand and the bubble "Psst! Need a hand?".
 *   Focused: 1px #dee5e0 border, shadow 0 8 20 rgba(41,71,46,.22); nudge = charge ring, a 6px lift and the bubble "Ask Buddy".
 * Nudge rules (Figma component note): first nudge 4 s after load, at most one every 30 s, at most 3 per session, none once Buddy has been opened, none under reduced motion.
 * Counters live in sessionStorage so they hold across pages. Position is the caller's (`className` must set fixed / absolute / relative + offsets); phones draw it at 56.
 * Props: onClick, look ('playful' | 'focused', default: the user's UI style), className, nudge (false turns the nudge off), loop (showcase only: replay it back to back), label (accessible name).
 */

const FIRST_MS = 4000;
const GAP_MS = 30000;
const MAX_NUDGES = 3;
const LENGTH_MS = { playful: 4200, focused: 3400 };
const KEY_COUNT = 'gth:buddy-nudges';
const KEY_LAST = 'gth:buddy-nudge-at';
const KEY_OPENED = 'gth:buddy-opened';

const read = (k) => {
  try {
    return Number(window.sessionStorage.getItem(k)) || 0;
  } catch {
    return 0;
  }
};
const write = (k, v) => {
  try {
    window.sessionStorage.setItem(k, String(v));
  } catch {
    // storage blocked: the nudge just falls back to the in-memory timers
  }
};

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// True while the nudge plays. One timer per mount: wait out the 4 s / 30 s rule, play, then ask again until the session cap.
const useBuddyNudge = (enabled, look, loop) => {
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!enabled || reducedMotion()) return undefined;
    if (loop) {
      // Design-system showcase: replay the nudge back to back, ignoring the session rules.
      let t;
      const play = () => {
        setPlaying(true);
        t = window.setTimeout(() => {
          setPlaying(false);
          t = window.setTimeout(play, 1500);
        }, LENGTH_MS[look]);
      };
      t = window.setTimeout(play, 600);
      return () => {
        window.clearTimeout(t);
        setPlaying(false);
      };
    }
    let timer;
    let off;
    const schedule = () => {
      if (read(KEY_OPENED) || read(KEY_COUNT) >= MAX_NUDGES) return;
      const sinceLast = Date.now() - read(KEY_LAST);
      const wait = read(KEY_LAST) ? Math.max(GAP_MS - sinceLast, 0) : FIRST_MS;
      timer = window.setTimeout(() => {
        if (document.hidden || read(KEY_OPENED)) {
          schedule();
          return;
        }
        write(KEY_COUNT, read(KEY_COUNT) + 1);
        write(KEY_LAST, Date.now());
        log('nudge', { n: read(KEY_COUNT), look });
        setPlaying(true);
        off = window.setTimeout(() => {
          setPlaying(false);
          schedule();
        }, LENGTH_MS[look]);
      }, wait);
    };
    schedule();
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(off);
      setPlaying(false);
    };
  }, [enabled, look, loop]);
  return playing;
};

// A 4-point sparkle (Figma "Star"): `n` is its drawn size (14 or 10), a 2px #1c2a21 stroke kept inside the shape.
const Sparkle = ({ n, fill }) => {
  const id = useId();
  const c = n / 2;
  const o = c * 0.28284; // the inner points sit 0.28 of the radius off the centre (Figma 14: 5.0201 / 8.9799, 10: 3.5858 / 6.4142)
  const d = `M${c} 0L${c + o} ${c - o}L${n} ${c}L${c + o} ${c + o}L${c} ${n}L${c - o} ${c + o}L0 ${c}L${c - o} ${c - o}Z`;
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className="block size-full overflow-visible" aria-hidden="true">
      <clipPath id={id}>
        <path d={d} />
      </clipPath>
      <path d={d} fill={fill} />
      <path d={d} fill="none" stroke="#1c2a21" strokeWidth="2" clipPath={`url(#${id})`} />
    </svg>
  );
};

const RED = '#d64534';
const GOLD = '#f5b724';
const GREEN = '#387440';
// Eight sparks from the centre (Figma: 4 x 14 and 4 x 10, all centred), one per 45deg.
const SPARKS = [
  { n: 14, fill: RED, a: -90 },
  { n: 10, fill: GOLD, a: -45 },
  { n: 14, fill: GREEN, a: 0 },
  { n: 10, fill: GOLD, a: 45 },
  { n: 14, fill: RED, a: 90 },
  { n: 10, fill: GREEN, a: 135 },
  { n: 14, fill: GOLD, a: 180 },
  { n: 10, fill: GREEN, a: -135 },
];
// Dust puffs on the ground line (Figma: 12 / 8 / 12 / 8 at x 20 / 16 / 40 / 48, top 6 of a 72 x 20 strip); the left pair drifts left, the right pair right.
const DUST = [
  { x: 20, s: 12, dx: -16 },
  { x: 16, s: 8, dx: -26 },
  { x: 40, s: 12, dx: 16 },
  { x: 48, s: 8, dx: 26 },
];

const Ring = () => (
  <svg viewBox="0 0 84 84" className="block size-full" aria-hidden="true">
    <path
      fill="#387440"
      d="M42 0C49.7457 0 57.3406 2.14198 63.9449 6.18911C70.5493 10.2362 75.9058 16.0309 79.4223 22.9324C82.9388 29.8339 84.4782 37.5734 83.8705 45.2953C83.2628 53.0171 80.5315 60.4205 75.9787 66.687C71.4259 72.9534 65.2288 77.8388 58.0727 80.8029C50.9166 83.7671 43.0801 84.6946 35.4298 83.4829C27.7794 82.2712 20.6131 78.9675 14.7232 73.937C8.83328 68.9066 4.44919 62.3454 2.05563 54.9787L6.05007 53.6808C8.20427 60.3108 12.15 66.2159 17.4509 70.7433C22.7518 75.2708 29.2014 78.2441 36.0868 79.3346C42.9721 80.4251 50.0249 79.5904 56.4654 76.9226C62.906 74.2549 68.4833 69.8581 72.5808 64.2183C76.6784 58.5785 79.1365 51.9154 79.6835 44.9658C80.2304 38.0161 78.8449 31.0505 75.68 24.8392C72.5152 18.6278 67.6943 13.4126 61.7504 9.7702C55.8065 6.12778 48.9712 4.2 42 4.2V0Z"
    />
  </svg>
);

const Buzz = () => (
  <svg
    viewBox="0 0 114.5 38.5"
    preserveAspectRatio="none"
    className="block size-full"
    aria-hidden="true"
  >
    <g fill="none" stroke="#1c2a21" strokeWidth="2.5" strokeLinecap="round">
      <path d="M11.25 5.25L3.25 1.25M9.25 19.25H1.25M11.25 33.25L3.25 37.25" />
      <path d="M103.25 5.25L111.25 1.25M105.25 19.25H113.25M103.25 33.25L111.25 37.25" />
    </g>
  </svg>
);

const Hand = () => (
  <svg
    viewBox="0 0 32 32"
    preserveAspectRatio="none"
    className="block size-full overflow-visible"
    aria-hidden="true"
  >
    <path
      d="M9 32C4 30 3 24 4 18V9C4 6.5 8 6.5 8 9V15V5C8 2.5 12 2.5 12 5V14V3.5C12 1 16 1 16 3.5V14V5.5C16 3 20 3 20 5.5V17L22 13C23.5 10.5 27 12 25.5 15L21 25C19 30 15 33 9 32Z"
      fill="#e8f2ed"
      stroke="#1c2a21"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const AskBuddyFabButton = ({
  onClick,
  look,
  className,
  nudge = true,
  loop = false,
  label = 'Ask Buddy',
}) => {
  const { uiStyle } = useUiStyle();
  const mode = look || (uiStyle === 'playful' ? 'playful' : 'focused');
  const playful = mode === 'playful';
  const playing = useBuddyNudge(nudge, mode, loop);

  const handle = (e) => {
    write(KEY_OPENED, 1);
    onClick?.(e);
  };

  return (
    <button
      type="button"
      onClick={handle}
      aria-label={label}
      title={label}
      data-ask-buddy-fab={mode}
      className={classNames(
        'abf size-[72px] shrink-0 cursor-pointer rounded-[99px] border-0 bg-transparent p-0 max-md:size-[56px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#387440]',
        className
      )}
      data-look={mode}
      data-nudge={playing ? '' : undefined}
    >
      {/* Everything is drawn on the 72 box and scaled as one on phones, so the nudge keeps its proportions. */}
      <span className="pointer-events-none absolute top-0 left-0 block size-[72px] origin-top-left max-md:scale-[0.7778]">
        {playful ? (
          <>
            <span className="absolute inset-0 block" aria-hidden="true">
              {SPARKS.map((s) => {
                const r = 54;
                const dx = Math.round(Math.cos((s.a * Math.PI) / 180) * r);
                const dy = Math.round(Math.sin((s.a * Math.PI) / 180) * r);
                return (
                  <span
                    key={s.a}
                    className="abf-spark absolute"
                    style={{
                      left: s.n === 14 ? 29 : 31,
                      top: s.n === 14 ? 29 : 31,
                      width: s.n,
                      height: s.n,
                      '--dx': `${dx}px`,
                      '--dy': `${dy}px`,
                    }}
                  >
                    <Sparkle n={s.n} fill={s.fill} />
                  </span>
                );
              })}
            </span>
            <span className="absolute top-[62px] left-0 block h-[20px] w-[72px]" aria-hidden="true">
              {DUST.map((d) => (
                <span
                  key={d.x}
                  className="abf-dust absolute top-[6px] rounded-full border border-solid border-[#1c2a21] bg-[#d9e0d6]"
                  style={{ left: d.x, width: d.s, height: d.s, '--dx': `${d.dx}px` }}
                />
              ))}
            </span>
          </>
        ) : null}
        <span
          className="abf-ring absolute top-[-6px] left-[-6px] block size-[84px]"
          aria-hidden="true"
        >
          <Ring />
        </span>
        <span
          className={classNames(
            'abf-pill absolute top-0 left-0 flex size-[72px] items-center justify-center overflow-hidden rounded-[999px] bg-white',
            playful
              ? 'border-2 border-solid border-[#1c2a21] shadow-[0_10px_22px_rgba(41,71,46,0.25),0_4px_0_#1c2a21]'
              : 'border border-solid border-[#dee5e0] shadow-[0_8px_20px_rgba(41,71,46,0.22)]'
          )}
        >
          <span className="relative block size-[62px] shrink-0 overflow-hidden">
            <img
              src={robot}
              alt=""
              aria-hidden="true"
              draggable="false"
              className="absolute top-[-12.75%] left-[-9.93%] h-[117.89%] w-[129.76%] max-w-none"
            />
          </span>
        </span>
        <span
          className={classNames(
            'abf-bubble absolute top-[2px] right-[calc(100%+14px)] flex items-start overflow-hidden rounded-tl-[16px] rounded-tr-[16px] rounded-br-[4px] rounded-bl-[16px] bg-white px-[14px] py-[9px] font-sans text-[14px] leading-[normal] font-semibold whitespace-nowrap text-[#1c2a21]',
            playful
              ? 'border-[1.5px] border-solid border-[#1c2a21] shadow-[0_2px_0_#1c2a21]'
              : 'border border-solid border-[#dee5e0] shadow-[0_4px_12px_rgba(0,0,0,0.08)]'
          )}
          aria-hidden="true"
        >
          {playful ? 'Psst! Need a hand?' : 'Ask Buddy'}
        </span>
        {playful ? (
          <>
            <span
              className="abf-buzz absolute top-0 left-[-20px] block h-[72px] w-[112px]"
              aria-hidden="true"
            >
              <span className="absolute inset-x-0 top-1/4 bottom-1/4 block">
                <Buzz />
              </span>
            </span>
            <span
              className="abf-hand absolute top-[-18px] left-[62px] block h-[34px] w-[30px]"
              aria-hidden="true"
            >
              <Hand />
            </span>
          </>
        ) : null}
      </span>
    </button>
  );
};

export default AskBuddyFabButton;
