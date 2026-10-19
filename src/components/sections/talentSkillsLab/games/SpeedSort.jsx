import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import GameCompleteDialog from './personality/PersonalityDialog.jsx';
import GameShell from './personality/PersonalityChrome.jsx';
import {
  PgArrowDownIcon,
  PgArrowLeftIcon,
  PgArrowRightInkIcon,
  PgBoltIcon,
  PgBulbIcon,
  PgCalendarIcon,
  PgCheckCircleIcon,
  PgTimeClockIcon,
  PgUsersIcon,
} from './personality/PersonalityIcons.jsx';
import { GameIntro } from './personality/PersonalityParts.jsx';
import { PLAY_ORDER } from './personality/personalityData.js';
import { BASKETS, CARDS, SPEED } from './personality/speedSortData.js';

const log = debug('SpeedSort');

/*
 * Speed Sort — personality game "Speed" (Figma SL-GP09 In play, Playful 7943:10684 / Focused 8110:497715).
 * Route `/skills-lab/games/speed-sort?f=GP09`. Props `{ frame }`: GP09 = wave 2, card 19, counts 6/8/4, x4 combo, 0:23 left,
 * the Tasks basket highlighted; none = wave 1 from zero.
 * Loop: a card sits in the arena; ← People, ↓ Tasks, → Ideas (or tap a basket) sorts it, "Skip card" passes. Counts, combo
 * and the 3 "up next" cards update. The wave clock starts on the first action and moves on to the next wave at 0:00; after
 * wave 3 the play-style dialog opens. ⚠️ ASSUMPTION: baskets per card, card pool, 45s waves, combo reset, dialog (see speedSortData.js).
 */
const BASKET_ICONS = { users: PgUsersIcon, check: PgCheckCircleIcon, bulb: PgBulbIcon };
const ARROWS = { left: PgArrowLeftIcon, down: PgArrowDownIcon, right: PgArrowRightInkIcon };
const KEY_TO_BASKET = { ArrowLeft: 'people', ArrowDown: 'tasks', ArrowRight: 'ideas' };
const SEEDS = {
  GP09: {
    wave: 1,
    counts: { people: 6, tasks: 8, ideas: 4 },
    combo: 4,
    seconds: 23,
    target: 'tasks',
  },
};
const clock = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

const Basket = ({ basket, count, target, onSort, onTarget }) => {
  const Glyph = BASKET_ICONS[basket.icon];
  const Arrow = ARROWS[basket.arrow];
  const active = target === basket.id;
  const pill = classNames(
    'inline-flex items-center gap-[5.65px] rounded-full px-[11.3px] py-[2.83px] font-sans text-[11.3px] leading-[13px] font-semibold text-[#1c2a21] max-lg:text-[12px]',
    active ? 'bg-white' : 'bg-[#f8f8f4]'
  );
  return (
    <button
      type="button"
      onClick={() => onSort(basket.id)}
      onPointerEnter={() => onTarget(basket.id)}
      onFocus={() => onTarget(basket.id)}
      aria-label={`${basket.label}, ${count} sorted. ${basket.key}.`}
      className={classNames(
        'relative flex min-w-0 cursor-pointer flex-col items-center gap-[7.5px] rounded-[20.7px] border border-solid px-[8px] py-[17px] font-sans sm:px-[19px]',
        active
          ? 'border-[#387440] bg-[#ebf1ec] shadow-[0_4px_11px_rgba(56,116,64,0.08)] playful:border-[1.5px] playful:shadow-[0_6px_16px_rgba(56,116,64,0.16)]'
          : 'border-[rgba(28,42,33,0.12)] bg-white',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]'
      )}
    >
      <span className="inline-flex items-center gap-[9.4px]">
        <Glyph className="size-[21px] shrink-0 text-[#1c2a21]" />
        <span className="font-sans text-[clamp(17px,1.2vw,20.7px)] leading-[1.25] font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading">
          {basket.label}
        </span>
      </span>
      <span aria-hidden="true" className="flex flex-wrap items-center justify-center gap-[7.5px]">
        <span className={pill}>
          <span data-count={`${count} sorted`} className="after:content-[attr(data-count)]" />
        </span>
        <span className={classNames(pill, 'max-sm:hidden')}>
          <Arrow className="size-[13px]" />
          <span data-count={basket.key} className="after:content-[attr(data-count)]" />
        </span>
      </span>
      {active ? (
        <span
          aria-hidden="true"
          data-sticker=""
          data-count="DROP HERE"
          className="pointer-events-none absolute -top-[13px] right-[23px] hidden rotate-[4deg] rounded-full border-[1.41px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[10.4px] py-[4.7px] font-sans text-[10.36px] leading-[12px] font-bold whitespace-nowrap text-[#1c2a21] after:content-[attr(data-count)] max-lg:text-[12px] playful:inline-block"
        />
      ) : null}
    </button>
  );
};

const SpeedSort = ({ frame }) => {
  const navigate = useNavigate();
  const seed = SEEDS[frame];
  const [wave, setWave] = useState(seed?.wave ?? 0);
  const [counts, setCounts] = useState(seed?.counts ?? { people: 0, tasks: 0, ideas: 0 });
  const [combo, setCombo] = useState(seed?.combo ?? 0);
  const [seconds, setSeconds] = useState(seed?.seconds ?? SPEED.waveSeconds);
  const [target, setTarget] = useState(seed?.target ?? null);
  const [cardAt, setCardAt] = useState(0);
  const [touched, setTouched] = useState(false);
  const [finished, setFinished] = useState(false);
  const total = SPEED.waves.length;
  const sorted = counts.people + counts.tasks + counts.ideas;
  const card = CARDS[cardAt % CARDS.length];
  const upNext = [1, 2, 3].map((n) => CARDS[(cardAt + n) % CARDS.length]);

  useEffect(() => {
    log('mount', { frame });
  }, [frame]);

  // wave clock: starts on the first action, rolls into the next wave at 0:00
  useEffect(() => {
    if (!touched || finished) return undefined;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [touched, finished]);
  useEffect(() => {
    if (seconds > 0) return;
    log('wave over', wave);
    if (wave + 1 >= total) setFinished(true);
    else {
      setWave(wave + 1);
      setSeconds(SPEED.waveSeconds);
    }
  }, [seconds, wave, total]);

  const advance = () => setCardAt((n) => n + 1);
  const sort = (basketId) => {
    if (finished) return;
    setTouched(true);
    setTarget(basketId);
    const ok = card.basket === basketId;
    log('sort', { card: card.id, basketId, ok });
    setCounts((c) => ({ ...c, [basketId]: c[basketId] + 1 }));
    setCombo((n) => (ok ? n + 1 : 0));
    advance();
  };
  const skip = () => {
    setTouched(true);
    advance();
  };

  useEffect(() => {
    const onKey = (event) => {
      if (finished || event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(event.target?.tagName) && event.key === 'Enter')
        return;
      const id = KEY_TO_BASKET[event.key];
      if (id) {
        event.preventDefault();
        sort(id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const restart = () => {
    setWave(0);
    setCounts({ people: 0, tasks: 0, ideas: 0 });
    setCombo(0);
    setSeconds(SPEED.waveSeconds);
    setTarget(null);
    setCardAt(0);
    setTouched(false);
    setFinished(false);
  };
  const next = () =>
    navigate(
      `/skills-lab/games/${PLAY_ORDER[(PLAY_ORDER.indexOf(SPEED.gameId) + 1) % PLAY_ORDER.length]}`
    );
  const arcade = () => navigate('/skills-lab?tab=games');
  const done = finished;
  const segments = SPEED.waves.map((_, i) =>
    done || i < wave ? 'done' : i === wave ? 'now' : 'todo'
  );

  return (
    <GameShell
      title={SPEED.title}
      subtitle={done ? SPEED.doneSubtitle : SPEED.subtitle}
      sticker={done ? SPEED.complete.sticker : `X${combo} COMBO`}
      xp={done ? SPEED.doneXp : SPEED.xp}
      progress={{
        label: `Wave ${done ? total : wave + 1} of ${total}`,
        segments,
        note: done ? SPEED.doneNote : SPEED.progressNote,
      }}
      footer={
        done
          ? {
              info: SPEED.doneInfo,
              link: { label: 'Replay', onClick: restart },
              secondary: { label: 'Back to Arcade', onClick: arcade },
              action: { label: 'Play next game', onClick: next },
            }
          : {
              info: SPEED.info,
              // ⚠️ ASSUMPTION: "Pause" saves and leaves for the Arcade.
              link: { label: 'Pause', onClick: arcade },
              secondary: { label: 'Skip card', onClick: skip },
            }
      }
      overlay={
        done ? (
          <GameCompleteDialog
            result={SPEED.complete}
            onClose={arcade}
            onSecondary={arcade}
            onPrimary={next}
            onNext={next}
          />
        ) : null
      }
    >
      <GameIntro
        eyebrow={SPEED.waves[Math.min(wave, total - 1)].eyebrow}
        title={SPEED.title2}
        body={SPEED.body}
        stats={[
          { icon: PgTimeClockIcon, label: `${clock(Math.max(seconds, 0))} left` },
          { icon: PgCheckCircleIcon, label: `${sorted} sorted` },
          { icon: PgBoltIcon, label: `x${combo} combo` },
        ]}
        reads={SPEED.reads}
      />
      <div className="relative flex min-h-[603px] flex-col overflow-hidden rounded-[22.6px] border border-solid border-[rgba(28,42,33,0.12)] bg-[#fffefc]">
        <span
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(28,42,33,0.08) 2.5px, transparent 3px)',
            backgroundSize: 'calc(100% / 10) 56.4px',
            backgroundPosition: '0 16.5px',
          }}
        />
        <div className="relative flex flex-wrap items-center justify-end gap-[7.5px] px-[28px] pt-[19px] pr-[19px]">
          <span className="font-sans text-[10.36px] leading-[12px] font-bold text-[#595959] max-lg:text-[12px]">
            {SPEED.upNext ?? 'UP NEXT'}
          </span>
          {upNext.map((c) => (
            <span
              key={c.id}
              className="rounded-[9.4px] border border-solid border-[rgba(28,42,33,0.12)] bg-white px-[9.4px] py-[5.65px] font-sans text-[11.78px] leading-[14px] font-semibold text-[#1c2a21] max-lg:text-[12px] playful:border-[0.94px] playful:border-[#1c2a21]"
            >
              {c.title}
            </span>
          ))}
        </div>

        <div className="relative my-[24px] flex flex-1 items-center justify-center md:block md:my-0 md:min-h-[300px]">
          {[
            [311, 198, 113, 0.25],
            [301, 219, 94, 0.2],
            [292, 239, 75, 0.15],
            [283, 260, 57, 0.1],
          ].map(([x, y, w, a]) => (
            <span
              key={y}
              aria-hidden="true"
              className="absolute hidden h-[5px] rounded-[2.8px] bg-[#1c2a21] md:block"
              style={{ left: `${(x / 1040) * 100}%`, top: y - 507 + 19, width: w, opacity: a }}
            />
          ))}
          <div
            key={card.id + cardAt}
            aria-live="polite"
            className="relative flex w-[min(350px,86%)] rotate-[6deg] flex-col gap-[9.42px] rounded-[18.84px] border border-solid border-[rgba(28,42,33,0.12)] bg-white px-[22.6px] py-[18.84px] md:absolute md:top-[calc(160px-27px)] md:left-[41.3%]"
          >
            <span className="inline-flex items-center gap-[7.5px] font-sans text-[10.36px] leading-[12px] font-bold text-[#595959] max-lg:text-[12px]">
              <PgCalendarIcon className="size-[19px] text-[#1c2a21]" />
              CARD {sorted + 1}
            </span>
            <span className="font-sans text-[clamp(20px,1.7vw,24.5px)] leading-[1.19] font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading">
              {card.title}
            </span>
            <span className="font-sans text-[13.19px] leading-[16px] text-[#595959] max-lg:text-[13.19px]">
              {card.line}
            </span>
          </div>
        </div>

        <div className="relative grid grid-cols-3 gap-[clamp(6px,1.8vw,18.84px)] px-[clamp(10px,4.7%,49px)] pb-[30px]">
          {BASKETS.map((basket) => (
            <Basket
              key={basket.id}
              basket={basket}
              count={counts[basket.id]}
              target={target}
              onSort={sort}
              onTarget={setTarget}
            />
          ))}
        </div>
      </div>
    </GameShell>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES = { 'speed-sort': SpeedSort };

export default SpeedSort;
