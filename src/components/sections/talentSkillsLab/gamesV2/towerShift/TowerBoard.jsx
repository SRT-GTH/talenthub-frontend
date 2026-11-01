import { useEffect } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import { FOCUS_RING } from '../../labPlayStyles.js';
import { GameFlagDuoIcon } from '../planningShared/PlanningChessIcons.jsx';
import { TOWER_DISC_COLORS, TOWER_GOAL_PEG, TOWER_PEG_NAMES } from './towerShiftData.js';
import { towerCanDrop } from './towerShiftEngine.js';

const log = debug('TowerBoard');

/*
 * TowerBoard — the Figma "pegs" frame (1000 x 330): wooden base (26 high, r13), three 16 x 230 pegs at x 170 / 500 / 830,
 * pill labels 36 from the top, 34-high discs stacked from the base, a lifted disc floating at y -6, a dashed "drop ghost" on the
 * Goal peg. Sizes use two CSS units so the board shrinks with its column:
 *   --u = 1/1000 of the board width (horizontal)   --v = 1/34 of the disc height (vertical, disc never under 16px)
 * Props: discs, stacks, lifted {disc, from} | null, cursor (0-2), blocked (illegal drop flagged on the cursor peg), onTap(peg).
 */
const CENTERS = [170, 500, 830];
const ux = (n) => `calc(${n} * var(--u))`;
const vy = (n) => `calc(${n} * var(--v))`;

// Discs 1-4 are drawn at 112 / 154 / 196 / 238. 5+ discs: smallest 112, biggest 238, even steps (⚠️ ASSUMPTION).
const discWidth = (disc, discs) =>
  discs <= 4 ? 112 + 42 * (disc - 1) : 112 + ((238 - 112) * (disc - 1)) / (discs - 1);
const discPx = (disc, discs) => `max(${ux(discWidth(disc, discs))}, 24px)`;

const Disc = ({ disc, discs, x, bottom, state }) => {
  const stroke =
    state === 'blocked'
      ? 'border-[3px] border-[#c73326]'
      : state === 'lifted'
        ? 'border-[3px] border-[#387440]'
        : 'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.6)]';
  return (
    <span
      aria-hidden="true"
      data-disc={disc}
      className={classNames(
        'pointer-events-none absolute flex items-center justify-center overflow-hidden rounded-full border-solid transition-[left,bottom] duration-150 motion-reduce:transition-none',
        'shadow-[0_2px_6px_rgba(28,42,33,0.08)] playful:shadow-[0_3px_0_rgba(28,42,33,0.4),inset_0_3px_0_rgba(255,255,255,0.35)]',
        stroke
      )}
      style={{
        width: discPx(disc, discs),
        height: 'var(--dh)',
        left: `calc(${ux(x)} - ${discPx(disc, discs)} / 2)`,
        bottom,
        background: TOWER_DISC_COLORS[disc - 1],
      }}
    >
      <span className="flex h-full w-[24px] gap-[3px]">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-full w-[6px] bg-white/[0.28]" />
        ))}
      </span>
    </span>
  );
};

const LABEL_TONES = {
  plain: 'bg-white text-[#6b6b6b]',
  goal: 'bg-[#e2f1e4] text-[#27522e]',
  goalHot: 'border-2 border-solid border-[#387440] bg-[#e2f1e4] text-[#27522e]',
  blocked: 'border-2 border-solid border-[#c73326] bg-white text-[#c73326]',
};

const PegLabel = ({ name, tone, x }) => (
  <span
    className={classNames(
      'absolute z-[1] inline-flex -translate-x-1/2 items-center gap-[6px] rounded-full px-[10px] py-[5px] font-sans text-[12.5px] leading-[15px] font-bold whitespace-nowrap max-lg:text-[12px]',
      LABEL_TONES[tone]
    )}
    style={{ left: ux(x), top: vy(tone === 'goalHot' || tone === 'blocked' ? 34 : 36) }}
  >
    {tone === 'goal' || tone === 'goalHot' ? <GameFlagDuoIcon className="size-[14px]" /> : null}
    {name}
  </span>
);

const TowerBoard = ({ discs, stacks, lifted, cursor, blocked, onTap }) => {
  const goalLegal = lifted ? towerCanDrop(stacks, lifted.disc, TOWER_GOAL_PEG) : false;
  const goalHot = Boolean(lifted) && goalLegal && !blocked;
  useEffect(() => {
    log('board', { discs, cursor, lifted: lifted?.disc ?? null, blocked, goalHot });
  }, [discs, cursor, lifted, blocked, goalHot]);

  // One flat list with stable keys so a disc keeps its DOM node (and animates) when it changes peg.
  const discItems = stacks
    .flatMap((stack, peg) =>
      stack.map((disc, i) => ({ disc, x: CENTERS[peg], bottom: vy(32 + 34 * i), state: 'rest' }))
    )
    .concat(
      lifted
        ? [
            {
              disc: lifted.disc,
              x: CENTERS[cursor],
              bottom: vy(302),
              state: blocked ? 'blocked' : 'lifted',
            },
          ]
        : []
    );

  const labelTone = (peg) => {
    if (blocked && peg === cursor) return 'blocked';
    if (peg === TOWER_GOAL_PEG) return goalHot ? 'goalHot' : 'goal';
    return 'plain';
  };
  const labelText = (peg) => {
    if (blocked && peg === cursor) return `${TOWER_PEG_NAMES[peg]} · not allowed`;
    if (peg === TOWER_GOAL_PEG && goalHot) return 'Goal · drop here';
    return TOWER_PEG_NAMES[peg];
  };
  const pegColor = (peg) => {
    if (blocked && peg === cursor) return '#c73326';
    if (peg === TOWER_GOAL_PEG && goalHot) return '#387440';
    return '#8a6a3b';
  };

  return (
    <div className="mx-auto w-full max-w-[1000px] [container-type:inline-size]">
      <div
        role="group"
        aria-label="Tower of Hanoi board: Start, Middle and Goal pegs"
        className="relative w-full select-none"
        style={{
          '--u': 'calc(100cqw / 1000)',
          '--dh': 'max(calc(34 * 100cqw / 1000), 16px)',
          '--v': 'calc(var(--dh) / 34)',
          height: vy(330),
        }}
      >
        <span
          aria-hidden="true"
          className="absolute right-0 left-0 rounded-[13px] bg-[#b98a4b] playful:border-[1.5px] playful:border-solid playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_5px_0_#7a5a2e]"
          style={{ bottom: vy(4), height: vy(26) }}
        />
        {CENTERS.map((cx, peg) => (
          <span key={`peg-${peg}`}>
            <span
              aria-hidden="true"
              className="absolute rounded-[8px] playful:border-[1.2px] playful:border-solid playful:border-[rgba(28,42,33,0.5)]"
              style={{
                left: `calc(${ux(cx)} - max(${ux(16)}, 6px) / 2)`,
                width: `max(${ux(16)}, 6px)`,
                bottom: vy(28),
                height: vy(230),
                background: pegColor(peg),
              }}
            />
            <PegLabel name={labelText(peg)} tone={labelTone(peg)} x={cx} />
          </span>
        ))}
        {discItems.map((item) => (
          <Disc key={`d-${item.disc}`} discs={discs} {...item} />
        ))}
        {lifted && goalHot ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full border-2 border-dashed border-[#387440]"
            style={{
              width: discPx(lifted.disc, discs),
              height: 'var(--dh)',
              left: `calc(${ux(CENTERS[TOWER_GOAL_PEG])} - ${discPx(lifted.disc, discs)} / 2)`,
              bottom: vy(32 + 34 * stacks[TOWER_GOAL_PEG].length),
            }}
          />
        ) : null}
        <div className="absolute inset-0 z-[2] flex">
          {CENTERS.map((cx, peg) => (
            <button
              key={`hit-${peg}`}
              type="button"
              onClick={() => onTap(peg)}
              aria-label={`${TOWER_PEG_NAMES[peg]} peg, ${stacks[peg].length} disc${stacks[peg].length === 1 ? '' : 's'}${
                lifted
                  ? '. Drop the lifted disc here'
                  : stacks[peg].length
                    ? '. Lift the top disc'
                    : ''
              }`}
              className={classNames(
                'm-0 h-full flex-1 cursor-pointer rounded-[12px] border-0 bg-transparent p-0',
                FOCUS_RING
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TowerBoard;
