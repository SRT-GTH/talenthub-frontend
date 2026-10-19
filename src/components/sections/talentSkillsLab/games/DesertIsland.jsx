import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import GameCompleteDialog from './personality/PersonalityDialog.jsx';
import GameShell from './personality/PersonalityChrome.jsx';
import {
  PgAnchorIcon,
  PgBatteryFullIcon,
  PgBoltIcon,
  PgBulbIcon,
  PgCheckCircleIcon,
  PgHealthIcon,
  PgHeartIcon,
  PgLayerTwoIcon,
  PgLinkIcon,
  PgMapIcon,
  PgSettingsIcon,
  PgShoppingCartIcon,
  PgTimeClockIcon,
  PgUsersIcon,
  PgVoiceIcon,
} from './personality/PersonalityIcons.jsx';
import { GameIntro } from './personality/PersonalityParts.jsx';
import { optionCardClass } from './personality/personalityStyles.js';
import { ISLAND } from './personality/desertIslandData.js';
import { PLAY_ORDER } from './personality/personalityData.js';
import { fmtClock, useCountdown } from './personality/useCountdown.js';

const log = debug('DesertIsland');

/*
 * Desert Island — personality game "Decisions" (Figma SL-GP06 Pack your bag, Playful 7943:10013 / Focused 8110:497421).
 * Route `/skills-lab/games/desert-island?f=GP06`. Props `{ frame }`: GP06 = part 1 with 3 of 5 things picked
 * (water, radio, first aid kit); none = part 1, nothing picked.
 * Loop: tap items to add / remove (the badge shows pick order — "your first pick counts most"), "Lock my 5" enables at
 * exactly 5 -> part 2 (who to save) -> part 3 (give one thing back) -> play-style dialog. ⚠️ ASSUMPTION: parts 2–3,
 * the clock (starts on the first pick, ends the game at 0) and the result copy.
 */
const ICONS = {
  health: PgHealthIcon,
  voice: PgVoiceIcon,
  heart: PgHeartIcon,
  link: PgLinkIcon,
  battery: PgBatteryFullIcon,
  map: PgMapIcon,
  settings: PgSettingsIcon,
  bolt: PgBoltIcon,
  layers: PgLayerTwoIcon,
  anchor: PgAnchorIcon,
  cart: PgShoppingCartIcon,
  bulb: PgBulbIcon,
  users: PgUsersIcon,
};
const SEEDS = { GP06: { part: 0, picked: ['water', 'radio', 'firstaid'] } };

const Tile = ({ item, rank, selected, onToggle, disabled }) => {
  const Glyph = ICONS[item.icon];
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={selected ? `${item.label}, pick ${rank}` : item.label}
      disabled={disabled}
      onClick={onToggle}
      className={classNames(
        'relative flex min-h-[118px] cursor-pointer flex-col items-center gap-[10px] rounded-[18px] p-[16px] max-sm:px-[6px] font-sans disabled:cursor-default',
        optionCardClass(selected),
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]'
      )}
    >
      <span
        aria-hidden="true"
        className={classNames(
          'inline-flex size-[56px] items-center justify-center rounded-[17px] border border-solid border-[rgba(28,42,33,0.12)] playful:border-[1.2px] playful:border-[#1c2a21]',
          selected ? 'bg-white' : 'bg-[#f8f8f4]'
        )}
      >
        <Glyph className="size-[27px] text-[#1c2a21]" />
      </span>
      <span className="text-center text-[15px] leading-[18px] font-semibold text-[#1c2a21] max-sm:text-[13px] max-sm:whitespace-nowrap">
        {item.label}
      </span>
      {selected ? (
        <span
          aria-hidden="true"
          data-count={rank}
          className="absolute top-[12px] -right-[4px] inline-flex size-[28px] items-center justify-center rounded-full bg-[#1c2a21] text-[13px] leading-[16px] font-bold text-[#c1d4c4] after:content-[attr(data-count)]"
        />
      ) : null}
    </button>
  );
};

const DesertIsland = ({ frame }) => {
  const navigate = useNavigate();
  const seed = SEEDS[frame];
  const [part, setPart] = useState(seed?.part ?? 0);
  const [picked, setPicked] = useState(seed?.picked ?? []);
  const [kept, setKept] = useState([]);
  const [finished, setFinished] = useState(false);
  const [touched, setTouched] = useState(false); // the Figma frame is a still: the clock starts on the first tap
  const spec = ISLAND.parts[part];
  const total = ISLAND.parts.length;

  const finish = useCallback(() => setFinished(true), []);
  const [seconds, setSeconds] = useCountdown({
    from: ISLAND.startSeconds,
    running: touched && !finished,
    onEnd: finish,
  });

  useEffect(() => {
    log('mount', { frame });
  }, [frame]);

  const pool =
    spec.pool === 'items'
      ? ISLAND.items
      : spec.pool === 'people'
        ? ISLAND.people
        : ISLAND.items.filter((item) => kept.includes(item.id));

  const toggle = (id) => {
    setTouched(true);
    setPicked((list) => {
      if (list.includes(id)) return list.filter((x) => x !== id);
      // a single-pick part swaps the choice; a multi-pick part stops at its limit
      if (spec.need === 1) return [id];
      return list.length >= spec.need ? list : [...list, id];
    });
  };

  const lock = () => {
    if (picked.length !== spec.need) return;
    log('lock', { part, picked });
    if (part === 0) setKept(picked);
    if (part + 1 >= total) {
      setFinished(true);
      return;
    }
    setPart(part + 1);
    setPicked([]);
    setSeconds(ISLAND.startSeconds);
  };

  const restart = () => {
    setPart(0);
    setPicked([]);
    setKept([]);
    setFinished(false);
    setSeconds(ISLAND.startSeconds);
  };

  const next = () =>
    navigate(
      `/skills-lab/games/${PLAY_ORDER[(PLAY_ORDER.indexOf(ISLAND.gameId) + 1) % PLAY_ORDER.length]}`
    );
  const arcade = () => navigate('/skills-lab?tab=games');

  const segments = ISLAND.parts.map((_, i) =>
    finished || i < part ? 'done' : i === part ? 'now' : 'todo'
  );
  const done = finished;
  const ready = picked.length === spec.need;

  return (
    <GameShell
      title={ISLAND.title}
      subtitle={done ? ISLAND.doneSubtitle : ISLAND.subtitle}
      sticker={done ? ISLAND.complete.sticker : spec.sticker(picked.length)}
      xp={done ? ISLAND.doneXp : ISLAND.xp}
      progress={{
        label: `Part ${done ? total : part + 1} of ${total}`,
        segments,
        note: done ? ISLAND.doneNote : ISLAND.progressNote,
      }}
      footer={
        done
          ? {
              info: ISLAND.doneInfo,
              link: { label: 'Replay', onClick: restart },
              secondary: { label: 'Back to Arcade', onClick: arcade },
              action: { label: 'Play next game', onClick: next },
            }
          : {
              info: spec.info,
              // ⚠️ ASSUMPTION: "Pause" saves and leaves for the Arcade.
              link: { label: 'Pause', onClick: arcade },
              action: { label: spec.action, onClick: lock, disabled: !ready },
            }
      }
      overlay={
        done ? (
          <GameCompleteDialog
            result={ISLAND.complete}
            onClose={arcade}
            onSecondary={arcade}
            onPrimary={next}
            onNext={next}
          />
        ) : null
      }
    >
      <GameIntro
        eyebrow={spec.eyebrow}
        title={spec.title}
        body={spec.body}
        stats={[
          { icon: PgCheckCircleIcon, label: spec.stat(picked.length) },
          { icon: PgTimeClockIcon, label: `${fmtClock(seconds, 2)} left` },
        ]}
        reads={ISLAND.reads}
      />
      <div
        role="group"
        aria-label={spec.eyebrow}
        className="grid grid-cols-2 gap-x-[14px] gap-y-[24px] min-[560px]:grid-cols-3 lg:grid-cols-4"
      >
        {pool.map((item) => {
          const at = picked.indexOf(item.id);
          return (
            <Tile
              key={item.id}
              item={item}
              rank={at + 1}
              selected={at >= 0}
              disabled={done}
              onToggle={() => toggle(item.id)}
            />
          );
        })}
      </div>
    </GameShell>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES = { 'desert-island': DesertIsland };

export default DesertIsland;
