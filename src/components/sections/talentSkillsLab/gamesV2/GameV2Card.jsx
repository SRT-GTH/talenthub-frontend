import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import GameV2Button from './GameV2Button.jsx';
import GameV2CategoryChip from './GameV2CategoryChip.jsx';
import GameV2Tile from './GameV2Tile.jsx';
import GameV2VerifiesChip from './GameV2VerifiesChip.jsx';
import {
  GvArrowIcon,
  GvCalendarIcon,
  GvClockIcon,
  GvHourglassIcon,
  GvPlayIcon,
  GvRefreshIcon,
  GvTargetIcon,
  GvTrophyIcon,
} from './GamesV2Icons.jsx';
import { GAMES_V2_COPY, measuresLine } from './gamesV2Data.js';

const log = debug('GameV2Card');

/*
 * GameV2Card — one "Skill games" card (Figma `Game card · …`, 427px wide in the 1329 column). Playful = 1.5px ink@.55 border,
 * r24, hard 4px shadow + soft lift; Focused = 1px #dee5e0 hairline, r16, one soft shadow (0 4 16 @ .06).
 * Status block by `game.status.kind`: ranked-open (best score + "Ranked play open now") · in-progress (hourglass, progress bar,
 * saved note) · cooldown (calendar, gold tint) · new (none). The action row follows the status:
 *   ranked-open → Play ranked / Practice · in-progress → Resume / Restart · cooldown → Practise now · else → Play.
 * Handlers: onPlay(game, mode) opens the details dialog, onResume(game) the "Pick up where you left off?" dialog.
 */
/*
 * Layout: cards stretch to the row height and spread their blocks (Figma: space-between with ~0 minimum gap — the tallest card of a
 * row is packed, shorter ones get the slack split between their blocks). Below lg a 10px minimum gap keeps wrapped cards airy.
 */
const CARD =
  'flex min-w-0 flex-col justify-between gap-[10px] rounded-[16px] border border-solid border-[#dee5e0] bg-white p-[20px] lg:gap-0 playful:p-[20.5px] shadow-[0_4px_16px_rgba(31,51,36,0.06)] ' +
  'playful:rounded-[24px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

const BestRow = ({ best }) => (
  <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[6px]">
    <GvTrophyIcon className="size-[16px] shrink-0 text-[#8a6100]" />
    <span className="font-sans text-[13px] font-medium leading-[16px] text-[#6b6b6b]">
      Your best
    </span>
    <span className="font-sans text-[15px] font-bold leading-[18px] text-[#1c2a21]">
      {best.score}
    </span>
    <span className="font-sans text-[13px] font-medium leading-[16px] text-[#6b6b6b]">
      /100 · {best.level}
    </span>
    <span className="min-w-0 flex-1" />
    <span className="inline-flex items-center rounded-full bg-[#e2f1e4] px-[10px] py-[4px] font-sans text-[12px] font-semibold leading-[14px] text-[#27522e]">
      Top {best.topPercent}%
    </span>
  </div>
);

const Status = ({ status }) => {
  if (status.kind === 'ranked-open') {
    return (
      <div className="flex flex-col gap-[8px] rounded-[14px] bg-[#f2f5f4] p-[12px]">
        <BestRow best={status.best} />
        <div className="flex items-center gap-[6px] font-sans text-[12.5px] font-semibold leading-[15px] text-[#27522e]">
          <span aria-hidden="true" className="size-[8px] shrink-0 rounded-full bg-[#387440]" />
          Ranked play open now
        </div>
      </div>
    );
  }
  if (status.kind === 'in-progress') {
    const pct = Math.round((status.done / status.total) * 100);
    return (
      <div className="flex flex-col gap-[8px] rounded-[14px] bg-[#f2f5f4] p-[12px]">
        <div className="flex flex-wrap items-center gap-x-[6px] gap-y-[2px]">
          <GvHourglassIcon className="size-[15px] shrink-0 text-[#27522e]" />
          <span className="font-sans text-[13px] font-semibold leading-[16px] text-[#1c2a21]">
            In progress · Ranked
          </span>
          <span className="min-w-0 flex-1" />
          <span className="font-sans text-[12.5px] font-medium leading-[15px] text-[#6b6b6b]">
            {status.done} of {status.total} {status.unit}
          </span>
        </div>
        <div
          role="progressbar"
          aria-label={`Saved game: ${status.done} of ${status.total} ${status.unit}`}
          aria-valuemin={0}
          aria-valuemax={status.total}
          aria-valuenow={status.done}
          className="h-[8px] overflow-hidden rounded-[4px] bg-[#dee5e0]"
        >
          <div className="h-full rounded-[4px] bg-[#387440]" style={{ width: `${pct}%` }} />
        </div>
        <p className="m-0 font-sans text-[12px] leading-[17px] text-[#6b6b6b]">
          {GAMES_V2_COPY.savedNote}
        </p>
      </div>
    );
  }
  if (status.kind === 'cooldown') {
    return (
      <div className="flex flex-col gap-[8px] rounded-[14px] bg-[#fef8ec] p-[12px]">
        <div className="flex items-start gap-[8px] font-sans text-[13px] font-semibold leading-[16px] text-[#8a6100]">
          <GvCalendarIcon className="size-[16px] shrink-0" />
          Next ranked play opens {status.opensOn}
        </div>
        <p className="m-0 font-sans text-[12px] leading-[17px] text-[#6b6b6b]">
          {GAMES_V2_COPY.cooldownNote}
        </p>
      </div>
    );
  }
  return null;
};

const Actions = ({ game, onPlay, onResume }) => {
  const { status } = game;
  if (status.kind === 'ranked-open') {
    return (
      <div className="flex flex-wrap items-center gap-[10px]">
        <GameV2Button
          grow
          className="max-sm:basis-full"
          aria-label={`Play ranked: ${game.title}`}
          trailing={<GvArrowIcon className="size-[18px] shrink-0" />}
          onClick={() => onPlay(game, 'ranked')}
        >
          Play ranked
        </GameV2Button>
        <GameV2Button
          variant="secondary"
          aria-label={`Practice: ${game.title}`}
          onClick={() => onPlay(game, 'practice')}
        >
          Practice
        </GameV2Button>
      </div>
    );
  }
  if (status.kind === 'in-progress') {
    return (
      <div className="flex flex-wrap items-center gap-[10px]">
        <GameV2Button
          grow
          aria-label={`Resume: ${game.title}`}
          icon={<GvPlayIcon className="size-[18px] shrink-0" />}
          onClick={() => onResume(game)}
        >
          Resume
        </GameV2Button>
        <GameV2Button
          variant="secondary"
          aria-label={`Restart: ${game.title}`}
          icon={<GvRefreshIcon className="size-[18px] shrink-0" />}
          onClick={() => onResume(game)}
        >
          Restart
        </GameV2Button>
      </div>
    );
  }
  if (status.kind === 'cooldown') {
    return (
      <div className="flex">
        <GameV2Button
          grow
          variant="secondary"
          aria-label={`Practise now: ${game.title}`}
          trailing={<GvArrowIcon className="size-[18px] shrink-0" />}
          onClick={() => onPlay(game, 'practice')}
        >
          Practise now
        </GameV2Button>
      </div>
    );
  }
  return (
    <div className="flex">
      <GameV2Button
        grow
        aria-label={`Play: ${game.title}`}
        trailing={<GvArrowIcon className="size-[18px] shrink-0" />}
        onClick={() => onPlay(game, 'ranked')}
      >
        Play
      </GameV2Button>
    </div>
  );
};

const GameV2Card = ({ game, onPlay, onResume }) => {
  useEffect(() => {
    log('card', game.id, game.status.kind);
  }, [game.id, game.status.kind]);
  const playStyle = game.kind === 'playstyle';
  return (
    <article data-game={game.id} data-status={game.status.kind} className={CARD}>
      <div className="flex flex-wrap items-center gap-[10px]">
        <GameV2Tile game={game} />
        <GameV2CategoryChip category={game.category} />
        <span className="min-w-0 flex-1" />
        <GameV2VerifiesChip
          label={playStyle ? GAMES_V2_COPY.playStyleChip : GAMES_V2_COPY.verifies}
          playStyle={playStyle}
        />
      </div>
      <div className="flex flex-col gap-[8px]">
        <h3 className="m-0 font-sans text-[19px] font-semibold leading-[23px] text-[#1c2a21]">
          {game.title}
        </h3>
        <div className="flex items-center gap-[6px] font-sans text-[13px] font-medium leading-[16px] text-[#6b706e]">
          <GvClockIcon className="size-[14px] shrink-0" />
          {game.meta}
        </div>
        <p className="m-0 font-sans text-[13px] leading-[19px] text-[#6b6b6b]">
          {game.description}
        </p>
        <div className="flex items-start gap-[6px] font-sans text-[12.5px] font-semibold leading-[15px] text-[#27522e]">
          <GvTargetIcon className="size-[14px] shrink-0" />
          <span className="min-w-0">{measuresLine(game)}</span>
        </div>
      </div>
      <Status status={game.status} />
      <Actions game={game} onPlay={onPlay} onResume={onResume} />
    </article>
  );
};

export default GameV2Card;
