import { useEffect, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import sceneEscape from '../../../../assets/talent-skills-lab/play/escape-room-scene.webp';
import GameCompleteDialog from './personality/PersonalityDialog.jsx';
import GameShell from './personality/PersonalityChrome.jsx';
import {
  PgEyeIcon,
  PgFileIcon,
  PgFolderIcon,
  PgKeyIcon,
  PgLockIcon,
  PgTimeClockIcon,
} from './personality/PersonalityIcons.jsx';
import { GameIntro } from './personality/PersonalityParts.jsx';
import { optionCardClass } from './personality/personalityStyles.js';
import { ESCAPE } from './personality/escapeRoomData.js';
import { fmtClock, useCountdown } from './personality/useCountdown.js';
import { usePersonalityRun } from './personality/usePersonalityRun.js';

const log = debug('EscapeRoom');

/*
 * The Escape Room — personality game "Strategy" (Figma SL-GP05 Room 1, Playful 7943:9837 / Focused 8110:497323).
 * Route `/skills-lab/games/escape-room?f=GP05`. Props `{ frame }`: GP05 = room 1 with spot B (Desk) picked; none = room 1, nothing picked.
 * Loop: tap a glowing spot in the picture or a choice under it (A–D / 1–4), "Check it" (Enter) -> next room; the clock
 * starts on the first pick (⚠️ ASSUMPTION) and ends the game at 0; after room 4 the play-style dialog opens.
 */
const CHOICE_ICONS = { folder: PgFolderIcon, file: PgFileIcon, lock: PgLockIcon, eye: PgEyeIcon };
const SEEDS = { GP05: { index: 0, pick: 1 } };

const Spot = ({ spot, selected, onPick }) => (
  <button
    type="button"
    aria-label={`${spot.key}. ${spot.name}`}
    aria-pressed={selected}
    onClick={onPick}
    className="absolute z-[1] cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    style={{ left: `${(spot.x / 1040) * 100}%`, top: `${(spot.y / 528) * 100}%` }}
  >
    <span
      aria-hidden="true"
      className="absolute top-[19.5px] left-[20.5px] size-[57px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.88px] border-solid border-[rgba(255,255,255,0.7)] max-md:hidden"
    />
    <span
      className={classNames(
        'relative inline-flex items-center gap-[7.5px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] py-[7.5px] pr-[9.4px] pl-[9.4px] font-sans text-[13.19px] leading-[16px] font-bold whitespace-nowrap max-md:text-[12px]',
        selected ? 'bg-[#387440] text-white' : 'bg-[#ffd86b] text-[#1c2a21]'
      )}
    >
      <span
        aria-hidden="true"
        data-count={spot.key}
        className="inline-flex size-[23px] items-center justify-center rounded-full bg-[#1c2a21] text-[11.3px] leading-[13px] text-white after:content-[attr(data-count)] max-lg:text-[12px]"
      />
      <span className="max-sm:sr-only">{spot.name}</span>
    </span>
  </button>
);

const EscapeRoom = ({ frame }) => {
  const run = usePersonalityRun({
    total: ESCAPE.rooms.length,
    seed: SEEDS[frame],
    gameId: 'escape-room',
  });
  const room = ESCAPE.rooms[run.index];
  const [touched, setTouched] = useState(false); // the Figma frame is a still: the clock starts on the first pick
  const choose = (i) => {
    setTouched(true);
    run.select(i);
  };
  const [seconds] = useCountdown({
    from: ESCAPE.startSeconds,
    running: touched && !run.finished,
    onEnd: run.finish,
  });

  useEffect(() => {
    log('mount', { frame });
  }, [frame]);

  useEffect(() => {
    const onKey = (event) => {
      if (run.finished || event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName)) return;
      const k = event.key.toUpperCase();
      const at = 'ABCD'.indexOf(k) >= 0 ? 'ABCD'.indexOf(k) : Number(k) - 1;
      if (at >= 0 && at < 4) choose(at);
      else if (event.key === 'Enter' && event.target?.tagName !== 'BUTTON') run.confirm();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const done = run.finished;
  return (
    <GameShell
      title={ESCAPE.title}
      subtitle={done ? ESCAPE.doneSubtitle : ESCAPE.subtitle}
      sticker={done ? ESCAPE.complete.sticker : room.sticker}
      xp={done ? ESCAPE.doneXp : ESCAPE.xp}
      progress={{
        label: `Room ${done ? run.total : run.round} of ${run.total}`,
        segments: run.segments,
        note: done ? ESCAPE.doneNote : ESCAPE.progressNote,
      }}
      footer={
        done
          ? {
              info: ESCAPE.doneInfo,
              link: { label: 'Replay', onClick: run.restart },
              secondary: { label: 'Back to Arcade', onClick: run.goArcade },
              action: { label: 'Play next game', onClick: run.goNext },
            }
          : {
              info: ESCAPE.info,
              // ⚠️ ASSUMPTION: "Pause" saves and leaves for the Arcade.
              link: { label: 'Pause', onClick: run.goArcade },
              action: { label: 'Check it', onClick: run.confirm, disabled: run.pick === null },
            }
      }
      overlay={
        done ? (
          <GameCompleteDialog
            result={ESCAPE.complete}
            onClose={run.goArcade}
            onSecondary={run.goArcade}
            onPrimary={run.goNext}
            onNext={run.goNext}
          />
        ) : null
      }
    >
      <GameIntro
        eyebrow={room.eyebrow}
        title={room.title}
        body={room.body}
        stats={[
          { icon: PgTimeClockIcon, label: `${fmtClock(seconds, 2)} left` },
          { icon: PgKeyIcon, label: room.clues },
        ]}
        reads={ESCAPE.reads}
      />
      <div className="relative aspect-[1040/528] overflow-hidden rounded-[22.6px] border border-solid border-[rgba(28,42,33,0.12)] bg-white max-md:aspect-[4/3]">
        <img
          src={sceneEscape}
          alt="A locked cellar room with a cabinet, a desk lit by a lamp and a locked door"
          draggable="false"
          className="absolute top-0 left-0 w-full max-md:h-full max-md:object-cover md:mt-[-5.48%]"
        />
        {ESCAPE.spots.map((spot, i) => (
          <Spot key={spot.key} spot={spot} selected={run.pick === i} onPick={() => choose(i)} />
        ))}
      </div>
      <div
        role="radiogroup"
        aria-label="What do you check"
        className="grid grid-cols-1 gap-[12px] min-[560px]:grid-cols-2 lg:grid-cols-4"
      >
        {ESCAPE.spots.map((spot, i) => {
          const Glyph = CHOICE_ICONS[spot.icon];
          const selected = run.pick === i;
          return (
            <button
              key={spot.key}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={done}
              onClick={() => choose(i)}
              className={classNames(
                'flex min-h-[48px] cursor-pointer items-center gap-[10px] rounded-[16px] px-[16px] py-[14px] font-sans text-[14.5px] leading-[17px] font-semibold text-[#1c2a21] disabled:cursor-default',
                optionCardClass(selected),
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]'
              )}
            >
              <Glyph className="size-[18px] shrink-0 text-[#1c2a21]" />
              {spot.key}. {spot.choice}
            </button>
          );
        })}
      </div>
    </GameShell>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES = { 'escape-room': EscapeRoom };

export default EscapeRoom;
