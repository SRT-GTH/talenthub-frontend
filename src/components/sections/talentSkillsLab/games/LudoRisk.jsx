import { useEffect } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import sceneLudo from '../../../../assets/talent-skills-lab/play/ludo-risk-scene.webp';
import GameCompleteDialog from './personality/PersonalityDialog.jsx';
import GameShell from './personality/PersonalityChrome.jsx';
import {
  PgArrowRightInkIcon,
  PgHomeIcon,
  PgPlusIcon,
  PgTargetIcon,
  PgUsersIcon,
} from './personality/PersonalityIcons.jsx';
import { GameIntro, KeyTile } from './personality/PersonalityParts.jsx';
import { LUDO, MOVES, TURNS } from './personality/ludoRiskData.js';
import { optionCardClass } from './personality/personalityStyles.js';
import { usePersonalityRun } from './personality/usePersonalityRun.js';

const log = debug('LudoRisk');

/*
 * Ludo Risk — personality game "Strategy" (Figma SL-GP12 Your roll, Playful 7943:11350 / Focused 8110:498010).
 * Route `/skills-lab/games/ludo-risk?f=GP12`. Props `{ frame }`: GP12 = turn 5 (rolled a 6) with move B picked; none = turn 1.
 * Loop: look at the roll, pick Safe / Medium / Bold (click or A–C / 1–3), "Play this move" (Enter) -> next turn; after
 * turn 8 the play-style dialog opens. ⚠️ ASSUMPTION: turns other than 5 and the result copy (see ludoRiskData.js).
 */
const STAT_ICONS = { home: PgHomeIcon, users: PgUsersIcon };
const MOVE_ICONS = { plus: PgPlusIcon, arrow: PgArrowRightInkIcon, target: PgTargetIcon };
const SEEDS = { GP12: { index: 4, pick: 1 } };

const Dice = ({ roll }) => (
  <div className="absolute top-[8%] left-[2.1%] flex rotate-[3deg] items-center gap-[9.42px] rounded-[17px] border border-solid border-[rgba(28,42,33,0.12)] bg-white px-[15px] py-[11.3px] font-sans max-md:top-[12px] max-md:left-[12px]">
    <span className="inline-flex size-[51px] shrink-0 items-center justify-center rounded-[11.3px] bg-[#1c2a21] font-sans text-[26.4px] leading-[32px] font-semibold tracking-[-0.01em] text-[#ffd86b] playful:font-heading">
      {roll}
    </span>
    <span className="flex flex-col">
      <span className="font-sans text-[18.84px] leading-[24px] font-semibold tracking-[-0.01em] whitespace-nowrap text-[#1c2a21] playful:font-heading">
        You rolled a {roll}!
      </span>
      <span className="font-sans text-[12.7px] leading-[15px] font-normal whitespace-nowrap text-[#595959] max-lg:text-[12.7px]">
        {LUDO.dice.sub}
      </span>
    </span>
  </div>
);

const Move = ({ move, roll, selected, locked, onPick }) => {
  const Glyph = MOVE_ICONS[move.icon];
  const body = typeof move.body === 'function' ? move.body(roll) : move.body;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={locked}
      onClick={onPick}
      className={classNames(
        'flex min-w-0 cursor-pointer flex-col gap-[12px] rounded-[20px] px-[20px] py-[18px] font-sans disabled:cursor-default',
        optionCardClass(selected),
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]'
      )}
    >
      <span className="flex items-center gap-[10px]">
        <KeyTile letter={move.key} selected={selected} />
        <span className="min-w-0 flex-1 font-sans text-[18px] leading-[22px] font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading">
          {move.title}
        </span>
        <Glyph className="size-[20px] shrink-0 text-[#1c2a21]" />
      </span>
      <span className="text-[14px] leading-[20px] font-normal text-[#1c2a21]">{body}</span>
      <span className="mt-auto flex flex-col gap-[6px]">
        <span className="flex items-center justify-between text-[13px] leading-[16px] font-semibold max-lg:text-[13px]">
          <span className="text-[#1c2a21]">Risk</span>
          <span className="text-[#595959]">{move.risk.label}</span>
        </span>
        <span
          aria-hidden="true"
          className="block h-[10px] overflow-hidden rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#ebebe3] playful:border-[1.2px] playful:border-[#1c2a21]"
        >
          <span
            className="block h-full rounded-full"
            style={{ width: `${move.risk.pct}%`, background: move.risk.color }}
          />
        </span>
      </span>
    </button>
  );
};

const LudoRisk = ({ frame }) => {
  const run = usePersonalityRun({ total: TURNS.length, seed: SEEDS[frame], gameId: 'ludo-risk' });
  const turn = TURNS[run.index];

  useEffect(() => {
    log('mount', { frame });
  }, [frame]);

  useEffect(() => {
    const onKey = (event) => {
      if (run.finished || event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName)) return;
      const k = event.key.toUpperCase();
      const at = 'ABC'.indexOf(k) >= 0 ? 'ABC'.indexOf(k) : Number(k) - 1;
      if (at >= 0 && at < MOVES.length) run.select(at);
      else if (event.key === 'Enter' && event.target?.tagName !== 'BUTTON') run.confirm();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const done = run.finished;
  const eyebrow = `TURN ${run.round} · STRATEGY`;
  const body = `Ama is ${turn.behind} squares behind your lead token. Kwesi already has 2 tokens home.`;
  return (
    <GameShell
      title={LUDO.title}
      subtitle={done ? LUDO.doneSubtitle : LUDO.subtitle}
      sticker={done ? LUDO.complete.sticker : `YOU ROLLED ${turn.roll}`}
      xp={done ? LUDO.doneXp : LUDO.xp}
      progress={{
        label: `Turn ${done ? run.total : run.round} of ${run.total}`,
        segments: run.segments,
        note: done ? LUDO.doneNote : LUDO.progressNote,
        segmentWidth: 123,
      }}
      footer={
        done
          ? {
              info: LUDO.doneInfo,
              link: { label: 'Replay', onClick: run.restart },
              secondary: { label: 'Back to Arcade', onClick: run.goArcade },
              action: { label: 'Play next game', onClick: run.goNext },
            }
          : {
              info: LUDO.info,
              // ⚠️ ASSUMPTION: "Pause" saves and leaves for the Arcade.
              link: { label: 'Pause', onClick: run.goArcade },
              action: {
                label: 'Play this move',
                onClick: run.confirm,
                disabled: run.pick === null,
              },
            }
      }
      overlay={
        done ? (
          <GameCompleteDialog
            result={LUDO.complete}
            onClose={run.goArcade}
            onSecondary={run.goArcade}
            onPrimary={run.restart}
            onNext={run.goNext}
          />
        ) : null
      }
    >
      <GameIntro
        eyebrow={eyebrow}
        title={[`You rolled a ${turn.roll}. `, 'Safe or bold?']}
        body={body}
        stats={LUDO.stats.map((s) => ({ icon: STAT_ICONS[s.icon], label: s.label }))}
        reads={LUDO.reads}
      />
      <div className="relative aspect-[1040/320] overflow-hidden rounded-[22.6px] border border-solid border-[rgba(28,42,33,0.12)] bg-white max-md:aspect-[4/3]">
        <img
          src={sceneLudo}
          alt="Friends laughing around a Ludo board, one of them rolling the dice"
          draggable="false"
          className="absolute top-0 left-0 w-full max-md:h-full max-md:object-cover md:mt-[-18.08%]"
        />
        <Dice roll={turn.roll} />
      </div>
      <div role="radiogroup" aria-label="Your move" className="grid gap-[16px] lg:grid-cols-3">
        {MOVES.map((move, i) => (
          <Move
            key={move.key}
            move={move}
            roll={turn.roll}
            selected={run.pick === i}
            locked={done}
            onPick={() => run.select(i)}
          />
        ))}
      </div>
    </GameShell>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES = { 'ludo-risk': LudoRisk };

export default LudoRisk;
