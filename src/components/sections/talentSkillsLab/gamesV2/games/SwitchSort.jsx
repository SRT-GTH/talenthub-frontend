import { useEffect } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useGameV2Params } from '../gamesV2State.js';
import GameV2Shell from '../GameV2Shell.jsx';
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

const log = debug('SwitchSort');

/*
 * Switch Sort — `/skills-lab/play/switch-sort` (Figma "Games v2 · Switch Sort": SS-01 … SS-04, Playful + Focused).
 * Cards arrive one at a time; sort each into the left (Red · Circle) or right (Blue · Square) basket with a tap or ← / →. The rule —
 * sort by colour or by shape — flips without warning; a sign says which (hidden at Expert, where the tick / cross is the only clue).
 * `?f=SS-01…04` boots the exact frame, frozen (no timers, no input).
 */
const MEASURES = ['Cognitive flexibility', 'Attention to detail', 'Processing speed'];
const fixed1 = (ms) => (ms / 1000).toFixed(1);

export const SwitchSort = ({ frame }) => {
  const g = useGameV2Params();
  const game = useSwitchSortGame({
    level: g.level,
    frame,
    paused: Boolean(g.modal),
    onDone: g.finish,
  });
  const { cfg, deck, answers, phase, feedback, shown, frozen, pick } = game;
  const seed = SS_SEEDS[frame] ?? null;
  const expert = !cfg.sign;
  const total = deck.length;
  const dotSize = useDotWindowSize();
  const answered = answers.length;
  const right = answers.filter((a) => a.correct).length;

  useEffect(() => {
    log('mount', { level: game.level, total, perCardMs: cfg.perCardMs, frame, frozen });
  }, [game.level, total, cfg.perCardMs, frame, frozen]);

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

  const avgMs = answered ? answers.reduce((s, a) => s + a.ms, 0) / answered : 0;
  const summary = seed?.summary ?? `${right} right · avg ${fixed1(avgMs)} s`;
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
    passMark: SS_COPY.best,
  };

  const basketState = (side) => {
    if (phase !== 'feedback' || !feedback || feedback.side !== side) return 'idle';
    return feedback.correct ? 'correct' : 'wrong';
  };
  const barRatio =
    phase === 'card'
      ? game.remainingMs / cfg.perCardMs
      : feedback?.correct
        ? feedback.remainingAtPick / cfg.perCardMs
        : game.holdMs / cfg.perCardMs;
  const caption =
    seed?.overrides?.caption ??
    (phase === 'card'
      ? `${fixed1(game.remainingMs)} s for this card`
      : feedback?.correct
        ? `Sorted in ${fixed1(feedback.tookMs)} s`
        : `Next card in ${fixed1(game.holdMs)} s`);
  const timeLeft =
    seed?.overrides?.statLeft ??
    `${fixed1(phase === 'card' ? game.remainingMs : cfg.perCardMs)} s left`;
  const tally = seed?.overrides?.statRight ?? `${right} of ${answered} right`;

  const finishNow = () => g.finish(scoreRun({ answers, total, perCardMs: cfg.perCardMs }));

  return (
    <GameV2Shell
      name="Switch Sort"
      subtitleLead={`Adaptability · ${total} cards`}
      progress={progress}
      footer={{ note: SS_COPY.footerNote }}
      timeUp={{ summary: `You sorted ${right} of ${answered} cards correctly.` }}
      onSeeResult={finishNow}
    >
      <SwitchSortHead
        eyebrow={`${game.level.toUpperCase()} · ${ssPerCardLabel(cfg.perCardMs)} S PER CARD`}
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

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2 = { 'switch-sort': SwitchSort };

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2_META = {
  'switch-sort': {
    name: 'Switch Sort',
    subtitleLead: `Adaptability · ${SS_LEVELS.intermediate.total} cards`,
    resultProgress: {
      countLabel: `Card ${SS_LEVELS.intermediate.total} of ${SS_LEVELS.intermediate.total}`,
      summary: '10 right · avg 1.4 s',
      dots: Array.from({ length: SS_LEVELS.intermediate.total }, (_, i) => ({
        state: 'ok',
        label: String(i + 1),
      })),
      passMark: SS_COPY.best,
    },
  },
};
