import { useEffect } from 'react';
import { debug } from '../../../../../utils/debug.js';
import GameV2Shell from '../GameV2Shell.jsx';
import { useGameV2Params } from '../gamesV2State.js';
import NumbersWordsFeedback from '../numbersWords/NumbersWordsFeedback.jsx';
import NumbersWordsHead from '../numbersWords/NumbersWordsHead.jsx';
import { NwStatCheckIcon } from '../numbersWords/NumbersWordsIcons.jsx';
import PatternAnswerChoices from '../patternPulse/PatternAnswerChoices.jsx';
import PatternPulseBoard from '../patternPulse/PatternPulseBoard.jsx';
import {
  PATTERN_PULSE_BEST_SO_FAR,
  PATTERN_PULSE_ROUNDS_PER_RUN,
} from '../patternPulse/patternPulseData.js';
import { usePatternPulseGame } from '../patternPulse/usePatternPulseGame.js';

const log = debug('PatternPulse');

/*
 * PatternPulse — Games v2 "Pattern Pulse" (Figma "Games v2 · 4": PP-01 Thinking, PP-02 Answer sent, PP-03 Correct · rule revealed,
 * PP-04 Wrong · answer shown, PP-05 Time almost up, PP-06 Expert · two patterns take turns; Playful + Focused).
 * Route /skills-lab/play/pattern-pulse[?mode=ranked|practice&level=…&f=PP-0x]. Eight rounds; every round has its own countdown ring
 * on the "?" bead; keys 1-4 (or a click) answer; the rule is revealed after each round and the next one starts after 3 s.
 * Content beyond the drawn rounds is ⚠️ ASSUMPTION — see patternPulse/patternPulseData.js.
 */
const LEVEL_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};
const MEASURES = ['Pattern recognition', 'Numerical reasoning', 'Processing speed'];
const HINT_ASK = 'Press 1–4 on your keyboard, or click an answer.';
const HINT_SENDING = 'Checking your answer. This takes a moment.';
const SKIP_NOTE = 'A skip counts as missed.';

const dotsFor = (history) =>
  Array.from({ length: PATTERN_PULSE_ROUNDS_PER_RUN }, (_, i) => {
    const label = String(i + 1);
    if (i < history.length) return { state: history[i].result === 'ok' ? 'ok' : 'bad', label };
    return { state: i === history.length ? 'now' : 'todo', label };
  });

const PatternPulse = ({ frame }) => {
  const g = useGameV2Params();
  const paused = Boolean(g.modal);
  const game = usePatternPulseGame({
    frame,
    level: g.level,
    paused,
    onFinish: g.finish,
    resume: g.resume,
  });
  const { phase, round, spec, choices, correctIndex, picked, miss, history } = game;
  const revealed = phase === 'revealed';
  const sending = phase === 'sending';
  const correct = revealed && picked === correctIndex && !miss;
  const twoPatterns = Boolean(spec.a);

  useEffect(() => {
    log('mount', { level: game.levelKey, round: game.roundNumber, phase, frame, mode: g.mode });
  }, [game.levelKey, game.roundNumber, phase, frame, g.mode]);

  /* keys 1-4 answer ("Press 1–4 on your keyboard") */
  useEffect(() => {
    if (phase !== 'thinking' || paused) return undefined;
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (
        event.target instanceof HTMLElement &&
        /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)
      )
        return;
      const n = Number(event.key);
      if (n >= 1 && n <= choices.length) {
        log('key', n);
        game.pick(n - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, paused, choices.length, game]);

  let title = spec.title ?? 'What number comes next?';
  let sub = spec.clue;
  if (sending) sub = 'Checking your answer…';
  if (revealed) {
    sub = 'Here’s the rule, so you can use it next time.';
    if (correct) title = `Spot on. It’s ${round.answer}.`;
    else if (miss === 'skip') title = `Skipped. It was ${round.answer}.`;
    else if (miss === 'timeout') title = `Time’s up. It was ${round.answer}.`;
    else title = `Not this time. It was ${round.answer}.`;
  }

  const tones = choices.map((_, i) => {
    if (phase === 'thinking') return 'idle';
    if (sending) return i === picked ? 'sending' : 'dim';
    if (i === picked) return i === correctIndex ? 'correct' : 'wrong';
    if (i === correctIndex) return 'reveal';
    return 'dim';
  });

  const timer = { fraction: game.ring, urgent: game.urgent, label: `${game.seconds} s` };
  const beads = round.beads;
  const answerBead = revealed
    ? { value: round.answer, color: round.target.color, mark: correct }
    : null;

  const summary = game.rightCount
    ? `${game.rightCount} right · avg ${game.avgSeconds} s`
    : `${game.rightCount} right`;
  const progress = {
    countLabel: `Round ${game.roundNumber} of ${game.totalRounds}`,
    summary,
    dots: dotsFor(history),
    passMark: `Best so far: ${PATTERN_PULSE_BEST_SO_FAR}`,
  };

  let footer = { note: SKIP_NOTE, link: { label: 'Skip this one', onClick: game.skip } };
  if (sending) footer = { note: SKIP_NOTE };
  if (revealed) {
    footer = {
      note: '',
      action: { label: game.isLast ? 'See my result' : 'Next round', onClick: game.next },
    };
  }

  let hint = HINT_ASK;
  if (sending) hint = HINT_SENDING;
  if (revealed) hint = game.isLast ? '' : `Next round starts in ${game.revealLeft} s.`;

  log('render', { phase, miss, correct, tones: tones.join(','), ring: game.ring });

  return (
    <GameV2Shell
      name="Pattern Pulse"
      subtitleLead={`Pattern recognition · ${PATTERN_PULSE_ROUNDS_PER_RUN} rounds`}
      progress={progress}
      footer={footer}
      timeUp={{
        summary: `You got ${game.rightCount} of ${history.length} rounds right before time ran out.`,
      }}
      onSeeResult={game.finishNow}
    >
      <NumbersWordsHead
        eyebrow={`ROUND ${game.roundNumber} · ${LEVEL_LABELS[game.levelKey].toUpperCase()}`}
        title={title}
        sub={sub}
        stats={[{ icon: NwStatCheckIcon, label: `${game.rightCount} of ${history.length} right` }]}
        measures={MEASURES}
      />
      <div className="flex flex-col pt-[clamp(8px,2vw,30px)]">
        <PatternPulseBoard
          beads={beads}
          slot={revealed ? null : { timer }}
          answer={answerBead}
          jumps={revealed ? round.jumps : null}
          twoPatterns={twoPatterns}
        />
        <NumbersWordsFeedback
          tone={revealed ? (correct ? 'ok' : 'info') : null}
          message={spec.ruleText}
        />
        <PatternAnswerChoices
          choices={choices}
          tones={tones}
          disabled={phase !== 'thinking' || paused}
          onPick={game.pick}
        />
        <p className="mt-[18px] mb-0 min-h-[16px] text-center font-sans text-[13px] leading-[16px] font-normal text-[#6b706e] max-lg:text-[12px]">
          {hint}
        </p>
      </div>
    </GameV2Shell>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2 = { 'pattern-pulse': PatternPulse };

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2_META = {
  'pattern-pulse': {
    name: 'Pattern Pulse',
    subtitleLead: `Pattern recognition · ${PATTERN_PULSE_ROUNDS_PER_RUN} rounds`,
    resultProgress: {
      countLabel: `Round ${PATTERN_PULSE_ROUNDS_PER_RUN} of ${PATTERN_PULSE_ROUNDS_PER_RUN}`,
      summary: 'All rounds played',
      dots: Array.from({ length: PATTERN_PULSE_ROUNDS_PER_RUN }, (_, i) => ({
        state: 'ok',
        label: String(i + 1),
      })),
      passMark: `Best so far: ${PATTERN_PULSE_BEST_SO_FAR}`,
    },
  },
};

export default PatternPulse;
