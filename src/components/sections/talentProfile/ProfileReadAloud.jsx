import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  ProfileAxCheckIcon,
  ProfileAxCloseIcon,
  ProfileAxLockIcon,
  ProfileAxPauseIcon,
  ProfileAxPlayIcon,
  ProfileAxSkipIcon,
} from './AxAnnotationIcons.jsx';
import { AX_ALOUD } from './ProfileAxData.js';
import { mainRect, useAxMeasure } from './ProfileAxUtils.js';
import { DISPLAY } from '../talentHome/TabsParts.jsx';

const log = debug('ProfileReadAloud');

/* Shared overlay shell shadow: Focused soft, Playful "shelf" (Figma fx of `read-aloud player` / `reading order`). */
const SURFACE =
  'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

/* Waveform bars: [height, tone]. Figma `waveform`: 18 bars of 3px, gap 3px; played = green, rest = #595959.
   Playful alternates the first nine (green / pale) — Focused draws all nine green. */
const BARS = [
  [8, 'g'],
  [14, 'p'],
  [20, 'p'],
  [12, 'g'],
  [18, 'p'],
  [24, 'p'],
  [10, 'g'],
  [16, 'p'],
  [22, 'p'],
  [12, 'r'],
  [8, 'r'],
  [14, 'r'],
  [18, 'r'],
  [10, 'r'],
  [6, 'r'],
  [12, 'r'],
  [16, 'r'],
  [8, 'r'],
];
const BAR_TONE = {
  g: 'bg-[#387440]',
  p: 'bg-[#387440] playful:bg-[#ebf1ec]',
  r: 'bg-[#595959]',
};

const Waveform = () => (
  <span aria-hidden="true" className="flex h-[24px] shrink-0 items-center gap-[3px] max-sm:hidden">
    {BARS.map(([h, tone], i) => (
      <span
        key={i}
        className={classNames('w-[3px] rounded-[2px]', BAR_TONE[tone])}
        style={{ height: h }}
      />
    ))}
  </span>
);

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd86b]';

const OrderItem = ({ item }) => {
  if (item.state === 'now') {
    return (
      <li
        aria-current="true"
        className="flex items-center gap-[8px] rounded-[8px] bg-[#ebf1ec] px-[8px] py-[4px]"
      >
        <ProfileAxPlayIcon className="size-[14px] shrink-0" />
        <span className="text-[13px] leading-[16px] font-semibold text-[#1c2a21]">
          {item.label}
        </span>
      </li>
    );
  }
  return (
    <li className="flex items-center gap-[8px]">
      {item.state === 'done' ? <ProfileAxCheckIcon className="size-[14px] shrink-0" /> : null}
      {item.state === 'private' ? <ProfileAxLockIcon className="size-[14px] shrink-0" /> : null}
      {item.state === 'todo' ? (
        <span
          aria-hidden="true"
          className="w-[12px] shrink-0 text-[12px] leading-[14px] font-bold text-[#737373]"
        >
          ○
        </span>
      ) : null}
      <span
        className={classNames(
          'text-[13px] leading-[16px]',
          item.state === 'done' ? 'text-[#1c2a21]' : 'text-[#595959]'
        )}
      >
        {item.label}
      </span>
    </li>
  );
};

/*
 * ProfileReadAloud — AX-04 "Read my profile aloud (playing)" (Figma Playful 7591:2279 / Focused 8110:391845).
 * The page itself marks the About card (`ProfileOverviewTab` -> AboutCard `reading`); this renders the
 * "Reading order" pop-over and the bottom player bar. Frontend-only: no speech — the controls log (no backend).
 */
const ProfileReadAloud = ({ profile }) => {
  const [playing, setPlaying] = useState(true);
  const main = useAxMeasure(mainRect);

  useEffect(() => {
    log('mount', { ax: profile?.ax });
  }, [profile?.ax]);

  const o = AX_ALOUD.order;
  // The player is centred on the content column (Figma: 902px bar centred on the 1329px canvas).
  const centre = main ? main.x + main.w / 2 : '50%';

  const toggle = () => {
    log('pause/play ->', playing ? 'paused' : 'playing');
    setPlaying((p) => !p);
  };

  return createPortal(
    <div data-pf-portal="">
      <div
        role="region"
        aria-label={o.title}
        className={classNames(
          'fixed right-[clamp(12px,3.24vw,56px)] bottom-[108px] z-[90] flex w-[300px] max-w-[calc(100vw-24px)] flex-col gap-[8px] rounded-[18px] border border-[rgba(28,42,33,0.1)] bg-white p-[18px] leading-[normal] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)]',
          SURFACE
        )}
      >
        <h2
          className={classNames(
            DISPLAY,
            'm-0 text-[17px] leading-[21px] font-semibold text-[#1c2a21]'
          )}
        >
          {o.title}
        </h2>
        <ol className="m-0 flex list-none flex-col gap-[8px] p-0">
          {o.items.map((item) => (
            <OrderItem key={item.key} item={item} />
          ))}
        </ol>
        <p className="m-0 text-[11px] leading-[13px] font-medium text-[#737373] max-lg:text-[12px] max-lg:leading-[14px]">
          {o.hint}
        </p>
      </div>

      <div
        role="group"
        aria-label={AX_ALOUD.now}
        className={classNames(
          'fixed bottom-[24px] z-[90] flex h-[65px] w-[902px] max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-[12px] rounded-full bg-[#1c2a21] py-[8px] pr-[16px] pl-[8px] leading-[normal]',
          SURFACE
        )}
        style={{ left: centre }}
      >
        <button
          type="button"
          aria-label={playing ? 'Pause' : 'Play'}
          aria-pressed={!playing}
          onClick={toggle}
          className={classNames(
            'flex size-[36px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-[rgba(28,42,33,0.12)] bg-[#eedeb8] p-0 playful:border-[1.2px] playful:border-[#1c2a21]',
            FOCUS
          )}
        >
          {playing ? (
            <ProfileAxPauseIcon className="size-[16px]" />
          ) : (
            <ProfileAxPlayIcon className="size-[16px]" />
          )}
        </button>
        <div className="flex min-w-0 flex-col gap-[2px] max-sm:flex-1 sm:w-[271px] sm:shrink-0">
          <span className="truncate text-[13.5px] sm:overflow-visible sm:text-clip leading-[16px] font-semibold text-white">
            {AX_ALOUD.now}
          </span>
          <span className="truncate text-[12px] leading-[14px] whitespace-nowrap text-[#c1d4c4] sm:overflow-visible sm:text-clip">
            {AX_ALOUD.quote}
          </span>
        </div>
        <Waveform />
        <span aria-hidden="true" className="h-px min-w-0 flex-1 max-sm:hidden" />
        <button
          type="button"
          onClick={() => log('speed clicked (no backend)')}
          className={classNames(
            'shrink-0 cursor-pointer rounded-full border border-[rgba(255,255,255,0.4)] bg-transparent px-[10px] py-[4px] text-[12.5px] leading-[15px] font-bold text-white',
            FOCUS
          )}
        >
          {AX_ALOUD.speed}
        </button>
        <button
          type="button"
          aria-label="Next section"
          onClick={() => log('next section clicked (no backend)')}
          className={classNames(
            'flex size-[16px] shrink-0 cursor-pointer items-center justify-center bg-transparent p-0',
            FOCUS
          )}
        >
          <ProfileAxSkipIcon className="size-[16px]" />
        </button>
        <button
          type="button"
          aria-label="Close"
          onClick={() => {
            log('close -> ax=null');
            profile?.update?.({ ax: null });
          }}
          className={classNames(
            'flex size-[16px] shrink-0 cursor-pointer items-center justify-center bg-transparent p-0',
            FOCUS
          )}
        >
          <ProfileAxCloseIcon className="size-[16px]" />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default ProfileReadAloud;
