import { useEffect } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useGameV2Params } from '../gamesV2State.js';
import GameV2Shell from '../GameV2Shell.jsx';
import GameV2LiveGate from '../live/GameV2LiveGate.jsx';
import { isLiveGames } from '../live/gameKeys.js';
import { useGameRun } from '../live/useGameRun.js';
import { isLivePage, liveResultProgress, readLiveResult } from '../numbersWords/liveResultStrip.js';
import SwitchSortBasket from '../switchSort/SwitchSortBasket.jsx';
import SwitchSortCard from '../switchSort/SwitchSortCard.jsx';
import SwitchSortHead from '../switchSort/SwitchSortHead.jsx';
import SwitchSortRuleSign from '../switchSort/SwitchSortRuleSign.jsx';
import {
  scoreRun,
  SS_COPY,
  SS_LEVELS,
  SS_MAX_DOTS,
  SS_SEEDS,
  ssPerCardLabel,
} from '../switchSort/switchSortData.js';
import { useDotWindowSize, windowDots } from '../switchSort/useDotWindow.js';
import { useSwitchSortGame } from '../switchSort/useSwitchSortGame.js';
import { useSwitchSortLive } from '../switchSort/useSwitchSortLive.js';

const log = debug('SwitchSort');

/*
 * Switch Sort — `/skills-lab/play/switch-sort` (Figma "Games v2 · Switch Sort": SS-01 … SS-04, Playful + Focused).
 * Cards arrive one at a time; sort each into the left (Red · Circle) or right (Blue · Square) basket with a tap or ← / →. The rule —
 * sort by colour or by shape — flips without warning; a sign says which (hidden at Expert, where the tick / cross is the only clue).
 * Live (default): the server engine (rule_switch) deals the cards, judges each sort and scores the run — see
 * switchSort/useSwitchSortLive.js. `?f=SS-01…04` boots the exact frame, frozen (no timers, no input); `?demo=1` plays the mock.
 */
const MEASURES = ['Cognitive flexibility', 'Attention to detail', 'Processing speed'];
const fixed1 = (ms) => (ms / 1000).toFixed(1);

const SwitchSortBoard = ({ game }) => {
  const g = useGameV2Params();
  const { perCardMs, answers, phase, feedback, shown, frozen, pick, total } = game;
  const expert = !game.sign;
  const dotSize = useDotWindowSize();
  const answered = answers.length;
  const right = answers.filter((a) => a.correct).length;
  const overrides = game.overrides ?? null;

  useEffect(() => {
    log('mount', { level: game.level, total, perCardMs, frozen });
  }, [game.level, total, perCardMs, frozen]);

  useEffect(() => {
    if (frozen || g.modal) return undefined;
    const onKey = (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      log('key', e.key);
      pick(e.key === 'ArrowLeft' ? 'left' : 'right');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [frozen, g.modal, pick]);

  const signMode = expert ? 'hidden' : shown.switched ? 'changed' : 'rule';
  const sentence = expert
    ? SS_COPY.subExpert
    : shown.switched
      ? shown.rule === 'shape'
        ? SS_COPY.changedShape
        : SS_COPY.changedColour
      : SS_COPY.sub;
  log('render', { phase, answered, rule: shown.rule, switched: shown.switched, signMode });

  const summary = game.summary ?? `${right} right · avg ${fixed1(game.avgMs)} s`;
  const progress = {
    countLabel: `Card ${Math.min(answered + 1, total)} of ${total}`,
    summary,
    dots:
      total <= SS_MAX_DOTS
        ? windowDots(
            Array.from({ length: total }, (_, i) => ({
              state:
                i < answered
                  ? answers[i].correct
                    ? 'ok'
                    : 'bad'
                  : i === answered
                    ? 'now'
                    : 'todo',
              label: String(i + 1),
            })),
            Math.min(answered, total - 1),
            dotSize
          )
        : [],
    passMark: game.bestSoFar ?? undefined,
  };

  const basketState = (side) => {
    if (phase !== 'feedback' || !feedback || feedback.side !== side) return 'idle';
    return feedback.correct ? 'correct' : 'wrong';
  };
  const barRatio =
    phase === 'card'
      ? game.remainingMs / perCardMs
      : feedback?.correct
        ? feedback.remainingAtPick / perCardMs
        : game.holdMs / perCardMs;
  let caption;
  if (overrides?.caption) caption = overrides.caption;
  else if (phase === 'card') caption = `${fixed1(game.remainingMs)} s for this card`;
  else if (feedback?.correct) caption = `Sorted in ${fixed1(feedback.tookMs)} s`;
  else if (game.live && feedback && feedback.side === null)
    caption = 'Too slow · this one counts as missed';
  else caption = `Next card in ${fixed1(game.holdMs)} s`;
  const timeLeft =
    overrides?.statLeft ?? `${fixed1(phase === 'card' ? game.remainingMs : perCardMs)} s left`;
  const tally = overrides?.statRight ?? `${right} of ${answered} right`;

  return (
    <GameV2Shell
      name="Switch Sort"
      subtitleLead={`Adaptability · ${total} cards`}
      progress={progress}
      footer={{ note: SS_COPY.footerNote }}
      timeUp={{ summary: `You sorted ${right} of ${answered} cards correctly.` }}
      onSeeResult={game.finishNow}
    >
      <SwitchSortHead
        eyebrow={`${(game.level ?? '').toUpperCase()} · ${ssPerCardLabel(perCardMs)} S PER CARD`}
        headline={expert ? SS_COPY.headlineExpert : SS_COPY.headline}
        sentence={sentence}
        timeLeft={timeLeft}
        tally={tally}
        skills={MEASURES}
      />
      <div className="flex flex-col items-center gap-[24px] max-lg:pt-[4px] lg:pt-[56px]">
        <SwitchSortRuleSign mode={signMode} rule={shown.rule} />
        <div className="grid w-full grid-cols-2 gap-x-[12px] gap-y-[20px] lg:w-auto lg:grid-cols-[300px_220px_300px] lg:items-center lg:gap-[48px]">
          <div className="order-first col-span-2 flex justify-center lg:order-none lg:col-span-1 lg:col-start-2 lg:row-start-1">
            <SwitchSortCard
              card={shown}
              cardKey={game.shownIndex}
              fade={phase === 'feedback' && Boolean(feedback?.correct)}
              barTone={phase === 'feedback' && !feedback?.correct ? 'bad' : 'ok'}
              barRatio={barRatio}
              caption={caption}
              animate={!frozen}
            />
          </div>
          <div className="lg:col-start-1 lg:row-start-1">
            <SwitchSortBasket side="left" state={basketState('left')} onPick={pick} />
          </div>
          <div className="lg:col-start-3 lg:row-start-1">
            <SwitchSortBasket side="right" state={basketState('right')} onPick={pick} />
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {phase === 'feedback' && feedback ? (feedback.correct ? 'Correct' : 'Wrong') : ''}
        </p>
      </div>
    </GameV2Shell>
  );
};

/* the drawn Figma frames (`?f=`) and `?demo=1`: the local mock run */
const MockSwitchSort = ({ frame }) => {
  const g = useGameV2Params();
  const game = useSwitchSortGame({
    level: g.level,
    frame,
    paused: Boolean(g.modal),
    onDone: g.finish,
  });
  const seed = SS_SEEDS[frame] ?? null;
  const { cfg, deck, answers } = game;
  const answered = answers.length;
  const view = {
    ...game,
    perCardMs: cfg.perCardMs,
    sign: cfg.sign,
    total: deck.length,
    avgMs: answered ? answers.reduce((s, a) => s + a.ms, 0) / answered : 0,
    overrides: seed?.overrides ?? null,
    summary: seed?.summary ?? null,
    bestSoFar: SS_COPY.best,
    finishNow: () => g.finish(scoreRun({ answers, total: deck.length, perCardMs: cfg.perCardMs })),
  };
  return <SwitchSortBoard game={view} />;
};

/* live: the server engine (/api/games, rule_switch) deals the cards and scores the run */
const LiveSwitchSort = () => {
  const run = useGameRun();
  const game = useSwitchSortLive(run);
  if ((run.status !== 'ready' && run.status !== 'finished') || !game) {
    return <GameV2LiveGate run={run} name="Switch Sort" subtitleLead="Adaptability" />;
  }
  return <SwitchSortBoard game={game} />;
};

export const SwitchSort = ({ frame }) => {
  const g = useGameV2Params();
  /* a new run (level / mode / frame changed) starts from scratch */
  const key = `${g.level}-${g.mode}-${frame ?? ''}`;
  return isLiveGames() ? <LiveSwitchSort key={key} /> : <MockSwitchSort key={key} frame={frame} />;
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2 = { 'switch-sort': SwitchSort };

const mockResultProgress = {
  countLabel: `Card ${SS_LEVELS.intermediate.total} of ${SS_LEVELS.intermediate.total}`,
  summary: '10 right · avg 1.4 s',
  dots: Array.from({ length: SS_LEVELS.intermediate.total }, (_, i) => ({
    state: 'ok',
    label: String(i + 1),
  })),
  passMark: SS_COPY.best,
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2_META = {
  'switch-sort': {
    name: 'Switch Sort',
    /* getters: GameV2Page reads them on every render, so a live result header follows the server's card, never the mock numbers */
    get subtitleLead() {
      const stored = readLiveResult('switch-sort');
      if (stored?.total) return `Adaptability · ${stored.total} cards`;
      return isLivePage() ? 'Adaptability' : `Adaptability · ${SS_LEVELS.intermediate.total} cards`;
    },
    get resultProgress() {
      const stored = readLiveResult('switch-sort');
      if (stored) {
        const total = stored.total || 0;
        return liveResultProgress(stored, {
          countLabel: `Card ${total} of ${total}`,
          summary: `${stored.correct ?? 0} of ${total} right`,
        });
      }
      return isLivePage() ? null : mockResultProgress;
    },
  },
};
