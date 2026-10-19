import { useEffect } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { useLabText } from '../labFormat.js';
import sceneMakola from '../../../../assets/talent-skills-lab/play/makola-haggle-scene.webp';
import GameCompleteDialog from './personality/PersonalityDialog.jsx';
import GameShell from './personality/PersonalityChrome.jsx';
import {
  PgArrowDownIcon,
  PgCheckCircleIcon,
  PgEmojiSmileIcon,
  PgHeartIcon,
  PgLayerTwoIcon,
  PgLogOutIcon,
  PgTagIcon,
  PgWalletIcon,
} from './personality/PersonalityIcons.jsx';
import { GameIntro, KeyTile, PickSticker } from './personality/PersonalityParts.jsx';
import { optionCardClass } from './personality/personalityStyles.js';
import { MAKOLA } from './personality/makolaHaggleData.js';
import { usePersonalityRun } from './personality/usePersonalityRun.js';

const log = debug('MakolaHaggle');

/*
 * Makola Haggle — personality game "Social" (Figma SL-GP03 Round 2 7943:9243 / 8110:496930, GP03b Move picked
 * 7943:9436 / 8110:497028, GP04 Game complete 7943:9631 / 8110:497126). Route `/skills-lab/games/makola-haggle?f=<code>`.
 * Props: `{ frame }` = the `?f=` code (GP03 round 2, GP03b round 2 with move A picked, GP04 completion dialog; none = round 1).
 * Loop: read Auntie's line, pick one of four moves (click or A–D / 1–4), "Make my move" (Enter) -> next round; after round 4
 * the play-style dialog opens. ⚠️ ASSUMPTION: rounds 1, 3, 4 and the result copy (see makolaHaggleData.js).
 */
const STAT_ICONS = { smile: PgEmojiSmileIcon, wallet: PgWalletIcon, heart: PgHeartIcon };
const MOVE_ICONS = {
  down: PgArrowDownIcon,
  bundle: PgLayerTwoIcon,
  walk: PgLogOutIcon,
  pay: PgCheckCircleIcon,
};
const LETTERS = ['A', 'B', 'C', 'D'];

const SEEDS = {
  GP03: { index: 1, pick: null },
  GP03b: { index: 1, pick: 0 },
  GP04: { index: 1, pick: 0, finished: true },
};

const Stage = ({ round }) => (
  <div
    className={classNames(
      'relative flex flex-col gap-[12px] overflow-hidden rounded-[22.6px] border border-solid border-[rgba(28,42,33,0.12)] bg-white p-[14px]',
      'min-h-[340px] md:block md:aspect-[1040/377] md:min-h-0 md:p-0'
    )}
  >
    <img
      src={sceneMakola}
      alt="Auntie Akos at her kente stall in Makola market, talking to you"
      draggable="false"
      className="absolute inset-0 size-full object-cover"
    />
    <div className="relative max-w-[396px] rounded-[18.84px_18.84px_18.84px_3.77px] border border-solid border-[rgba(28,42,33,0.12)] bg-white px-[18.84px] py-[15.07px] md:absolute md:top-[6.9%] md:left-[2.5%] md:w-[38.1%]">
      <p className="m-0 font-sans text-[10.83px] leading-[13px] font-bold text-[#387440] max-lg:text-[12px]">
        {round.auntie}
      </p>
      <p className="mt-[5.65px] mb-0 font-sans text-[16px] leading-[23px] font-medium text-[#1c2a21]">
        {round.auntieLine}
      </p>
    </div>
    <p className="relative m-0 self-end rounded-[15.07px_3.77px_15.07px_15.07px] border-[1.41px] border-solid border-[#1c2a21] bg-[#387440] px-[15.07px] py-[9.42px] font-sans text-[13.19px] leading-[16px] font-semibold text-white max-lg:text-[13.19px] md:absolute md:top-[9%] md:right-[3.3%] md:self-auto">
      {round.youLine}
    </p>
    <div className="relative mt-auto flex w-fit max-w-full -rotate-[3deg] items-center gap-[9.42px] self-end rounded-[15.07px] border border-solid border-[rgba(28,42,33,0.12)] bg-[#ffd86b] px-[15.07px] py-[11.3px] md:absolute md:right-[3.1%] md:bottom-[8%] md:mt-0">
      <PgTagIcon className="size-[20px] shrink-0 text-[#1c2a21]" />
      <span className="flex min-w-0 flex-col font-sans text-[#1c2a21]">
        <span className="text-[13.19px] leading-[16px] font-semibold whitespace-nowrap">
          {round.tag.title}
        </span>
        <span className="text-[12.25px] leading-[15px] font-normal whitespace-nowrap">
          {round.tag.sub}
        </span>
      </span>
    </div>
  </div>
);

const Moves = ({ round, run, locked }) => (
  <div role="radiogroup" aria-label="Your move" className="grid gap-[16px] md:grid-cols-2">
    {round.moves.map((move, i) => {
      const selected = run.pick === i;
      const Glyph = MOVE_ICONS[MAKOLA.icons[i]];
      return (
        <button
          key={move.title}
          type="button"
          role="radio"
          aria-checked={selected}
          disabled={locked}
          onClick={() => run.select(i)}
          className={classNames(
            'relative flex min-h-[71px] cursor-pointer items-center gap-[14px] rounded-[18px] px-[18px] py-[16px] font-sans disabled:cursor-default',
            optionCardClass(selected),
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]'
          )}
        >
          <KeyTile letter={LETTERS[i]} selected={selected} />
          <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <span className="text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
              {move.title}
            </span>
            <span
              className={classNames(
                'text-[13.5px] leading-[16px] font-normal max-lg:text-[13.5px]',
                selected ? 'text-[#1c2a21]' : 'text-[#595959]'
              )}
            >
              {move.sub}
            </span>
          </span>
          <Glyph className="size-[20px] shrink-0 text-[#1c2a21]" />
          {selected ? (
            <PickSticker className="-top-[21px] max-md:right-[6px] md:-right-[22px]">
              YOUR PICK
            </PickSticker>
          ) : null}
        </button>
      );
    })}
  </div>
);

const MakolaHaggle = ({ frame }) => {
  const run = usePersonalityRun({
    total: MAKOLA.rounds.length,
    seed: SEEDS[frame],
    gameId: 'makola-haggle',
  });
  const { t } = useLabText();
  const round = MAKOLA.rounds[run.index];

  useEffect(() => {
    log('mount', { frame });
  }, [frame]);

  // A–D / 1–4 pick a move, Enter plays it.
  useEffect(() => {
    const onKey = (event) => {
      if (run.finished || event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName)) return;
      const k = event.key.toUpperCase();
      const at = LETTERS.indexOf(k) >= 0 ? LETTERS.indexOf(k) : Number(k) - 1;
      if (at >= 0 && at < LETTERS.length) run.select(at);
      else if (event.key === 'Enter' && event.target?.tagName !== 'BUTTON') run.confirm();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const done = run.finished;
  return (
    <GameShell
      title={MAKOLA.title}
      subtitle={done ? MAKOLA.doneSubtitle : MAKOLA.subtitle}
      sticker={done ? MAKOLA.complete.sticker : round.sticker}
      xp={done ? MAKOLA.doneXp : MAKOLA.xp}
      hud="gold"
      progress={{
        label: `Round ${done ? run.total : run.round} of ${run.total}`,
        segments: run.segments,
        note: done ? MAKOLA.doneNote : MAKOLA.progressNote,
      }}
      footer={
        done
          ? {
              info: MAKOLA.doneInfo,
              link: { label: 'Replay', onClick: run.restart },
              secondary: { label: 'Back to Arcade', onClick: run.goArcade },
              action: { label: 'Play next game', onClick: run.goNext },
            }
          : {
              info: MAKOLA.info,
              // ⚠️ ASSUMPTION: "Pause game" saves and leaves for the Arcade (progress is saved after every round).
              link: { label: 'Pause game', onClick: run.goArcade },
              action: { label: 'Make my move', onClick: run.confirm, disabled: run.pick === null },
            }
      }
      overlay={
        done ? (
          <GameCompleteDialog
            result={MAKOLA.complete}
            onClose={run.goArcade}
            onSecondary={run.goArcade}
            onPrimary={run.goNext}
            onNext={run.goNext}
          />
        ) : null
      }
    >
      <GameIntro
        eyebrow={round.eyebrow}
        title={round.title}
        body={round.body}
        stats={round.stats.map((s) => ({ icon: STAT_ICONS[s.icon], label: s.label }))}
        reads={MAKOLA.reads}
      />
      <Stage round={round} />
      <Moves round={round} run={run} locked={done} />
      <span className="sr-only" aria-live="polite">
        {done ? t(MAKOLA.complete.title) : ''}
      </span>
    </GameShell>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES = { 'makola-haggle': MakolaHaggle };

export default MakolaHaggle;
