import { useCallback, useEffect } from 'react';
import { debug } from '../../../../../utils/debug.js';
import GameV2Shell from '../GameV2Shell.jsx';
import { useGameV2Params } from '../gamesV2State.js';
import GameV2LiveGate from '../live/GameV2LiveGate.jsx';
import { isLiveGames } from '../live/gameKeys.js';
import { useGameRun } from '../live/useGameRun.js';
import { isLivePage, liveResultProgress, readLiveResult } from '../numbersWords/liveResultStrip.js';
import NumbersWordsFeedback from '../numbersWords/NumbersWordsFeedback.jsx';
import NumbersWordsHead from '../numbersWords/NumbersWordsHead.jsx';
import { NwStatCheckIcon, NwStatClockIcon } from '../numbersWords/NumbersWordsIcons.jsx';
import WordAnswerRow from '../wordShuffle/WordAnswerRow.jsx';
import WordClueChips from '../wordShuffle/WordClueChips.jsx';
import WordLetterTray from '../wordShuffle/WordLetterTray.jsx';
import WordToolsRow from '../wordShuffle/WordToolsRow.jsx';
import {
  WORD_SHUFFLE_BEST_SO_FAR,
  WORD_SHUFFLE_WORDS_PER_RUN,
  titleCase,
} from '../wordShuffle/wordShuffleData.js';
import { useWordShuffleGame } from '../wordShuffle/useWordShuffleGame.js';
import { useWordShuffleLive } from '../wordShuffle/useWordShuffleLive.js';

const log = debug('WordShuffle');

/*
 * WordShuffle — Games v2 "Word Shuffle" (Figma "Games v2 · 5": WS-01 Building the word, WS-02 Wrong guess · one more try, WS-03 Hint
 * used · first letter locked, WS-04 Correct; Playful + Focused). Route /skills-lab/play/word-shuffle[?mode=…&level=…&f=WS-0x].
 * Six job titles; tap tiles (or type), Backspace / Clear, Shuffle, hints (lock the next letter), one wrong guess allowed.
 * Live (default): the server engine (word_scramble) holds the words, the per-word clock and the score — see
 * wordShuffle/useWordShuffleLive.js. The `?f=` frames and `?demo=1` keep the local mock (one run clock, wordShuffleData.js).
 */
const LEVEL_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};
const MEASURES = ['Verbal reasoning', 'Processing speed'];
const SUB = 'The field is your clue. You get one wrong guess per word.';
const MISSED = ['failed', 'skipped', 'timeout'];

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;

const WordShuffleBoard = ({ game }) => {
  const g = useGameV2Params();
  const paused = Boolean(g.modal);
  const { status, resolved, tiles, order, answer, lockedIds, n } = game;
  const title = game.word ? titleCase(game.word) : '';
  const correct = status === 'correct';

  useEffect(() => {
    log('mount', { level: game.levelKey, word: game.wordIndex + 1, status, mode: g.mode });
  }, [game.levelKey, game.wordIndex, status, g.mode]);

  /* the answer row: filled tiles, then dashed empty slots; a resolved word shows the right word */
  const slots = Array.from({ length: n }, (_, i) => {
    if (resolved && game.word) return { letter: game.word[i] ?? '', tone: 'ok' };
    const id = answer[i];
    if (id === undefined || !tiles[id]) return { letter: '', tone: 'empty' };
    const letter = tiles[id].letter;
    const isLocked = lockedIds.includes(id);
    let tone = 'normal';
    if (correct) tone = 'ok';
    else if (status === 'wrong') tone = 'bad';
    else if (isLocked) tone = 'hint';
    return {
      letter,
      tone,
      onClick: resolved || isLocked ? undefined : () => game.removeAt(i),
      label: `Take back ${letter}`,
    };
  });

  const traySlots = order
    .filter((id) => tiles[id])
    .map((id) => ({
      id,
      letter: tiles[id].letter,
      used: resolved || answer.includes(id),
      onClick: () => game.addTile(id),
    }));

  let heading = 'Unscramble the job title.';
  if (status === 'wrong') heading = 'Close. Have another look.';
  if (correct) heading = `${title}. That’s it.`;
  if (status === 'failed') heading = `Not this time. It was ${title}.`;
  if (status === 'skipped') heading = `Skipped. It was ${title}.`;
  if (status === 'timeout') heading = `Time’s up. It was ${title}.`;

  let feedback = { tone: null, message: '' };
  if (game.hintMessage) feedback = { tone: 'info', message: game.hintMessage };
  if (game.notice) feedback = { tone: 'info', message: game.notice };
  if (status === 'wrong') feedback = { tone: 'bad', message: 'Not quite. You have one more try.' };
  if (status === 'failed') feedback = { tone: 'bad', message: `Not quite. The word was ${title}.` };
  if (status === 'skipped') feedback = { tone: 'info', message: `The word was ${title}.` };
  if (status === 'timeout')
    feedback = { tone: 'bad', message: `Out of time. The word was ${title}.` };
  if (correct) feedback = { tone: 'ok', message: `${title}. Well done.` };

  const progress = {
    countLabel: `Word ${game.wordIndex + 1} of ${game.totalWords}`,
    summary: `${game.solvedCount} solved · ${plural(game.hintCount, 'hint', 'hints')} used`,
    dots: game.dots,
    passMark: game.bestSoFar === null ? undefined : `Best so far: ${game.bestSoFar}`,
  };

  const footer = resolved
    ? {
        note: game.nextHint ?? '',
        action: { label: game.isLast ? 'See my result' : 'Next word', onClick: game.next },
      }
    : {
        note: '',
        link: { label: 'Skip word', onClick: game.skip },
        action: { label: 'Check word', onClick: game.check },
      };

  const triesLabel = MISSED.includes(status) ? 'No tries left' : '1 tries left';

  log('render', { status, answer: answer.join(','), locked: lockedIds.join(',') });

  return (
    <GameV2Shell
      name="Word Shuffle"
      subtitleLead={`Verbal reasoning · ${game.totalWords} job titles`}
      progress={progress}
      footer={footer}
      timeUp={{
        summary: `You unscrambled ${game.solvedCount} of ${game.totalWords} job titles before time ran out.`,
      }}
      onSeeResult={game.finishNow}
    >
      <NumbersWordsHead
        eyebrow={`WORD ${game.wordIndex + 1} · ${(LEVEL_LABELS[game.levelKey] ?? game.levelKey ?? '').toUpperCase()}`}
        title={heading}
        sub={SUB}
        stats={[
          { icon: NwStatClockIcon, label: `${game.clockLabel} left` },
          { icon: NwStatCheckIcon, label: `${game.solvedCount} of ${game.attempted} solved` },
        ]}
        measures={MEASURES}
      />
      <div className="flex flex-col items-stretch pt-[clamp(8px,4.2vw,62px)]">
        <WordClueChips
          field={game.field}
          letterCount={n}
          lastTry={game.wrongs === 1}
          triesLabel={triesLabel}
        />
        <div className="mt-[28px]">
          <WordAnswerRow slots={slots} />
        </div>
        <NumbersWordsFeedback tone={feedback.tone} message={feedback.message} />
        <WordLetterTray slots={traySlots} disabled={paused} />
        <div className="mt-[20px]">
          <WordToolsRow
            hintUsed={game.hintDisabled}
            hintLabel={game.hintLabel}
            resolved={resolved}
            onShuffle={game.shuffle}
            onClear={game.clear}
            onHint={game.takeHint}
          />
        </div>
      </div>
    </GameV2Shell>
  );
};

/* the drawn Figma frames (`?f=`) and `?demo=1`: the local mock run */
const MockWordShuffle = ({ frame }) => {
  const g = useGameV2Params();
  const { openModal } = g;
  const onTimeUp = useCallback(() => {
    log('run clock hit 0 → time up');
    openModal('timeup');
  }, [openModal]);
  const game = useWordShuffleGame({
    frame,
    level: g.level,
    paused: Boolean(g.modal),
    onFinish: g.finish,
    onTimeUp,
  });
  const { current, resolved } = game;
  const view = {
    ...game,
    field: current.field,
    word: current.word,
    lockedIds: game.locked === null ? [] : [game.locked],
    hintMessage: game.hintUsed && !resolved ? `Hint: it starts with ${current.word[0]}.` : null,
    hintLabel: game.hintUsed
      ? 'Hint used · this word is now worth ¾'
      : 'Hint · costs ¼ of this word',
    hintDisabled: resolved || game.hintUsed,
    dots: Array.from({ length: WORD_SHUFFLE_WORDS_PER_RUN }, (_, i) => {
      const label = String(i + 1);
      if (i < game.results.length) {
        return { state: game.results[i].result === 'solved' ? 'ok' : 'bad', label };
      }
      return { state: i === game.results.length ? 'now' : 'todo', label };
    }),
    nextHint: null,
    bestSoFar: WORD_SHUFFLE_BEST_SO_FAR,
  };
  return <WordShuffleBoard game={view} />;
};

/* live: the server engine (/api/games, word_scramble) holds the words and scores the run */
const LiveWordShuffle = () => {
  const run = useGameRun();
  const game = useWordShuffleLive(run);
  if ((run.status !== 'ready' && run.status !== 'finished') || !game) {
    return <GameV2LiveGate run={run} name="Word Shuffle" subtitleLead="Verbal reasoning" />;
  }
  return <WordShuffleBoard game={game} />;
};

const WordShuffle = ({ frame }) => {
  const g = useGameV2Params();
  /* a new run (level / mode / frame changed) starts from scratch */
  const key = `${g.level}-${g.mode}-${frame ?? ''}`;
  return isLiveGames() ? (
    <LiveWordShuffle key={key} />
  ) : (
    <MockWordShuffle key={key} frame={frame} />
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2 = { 'word-shuffle': WordShuffle };

const mockResultProgress = {
  countLabel: `Word ${WORD_SHUFFLE_WORDS_PER_RUN} of ${WORD_SHUFFLE_WORDS_PER_RUN}`,
  summary: 'All words played',
  dots: Array.from({ length: WORD_SHUFFLE_WORDS_PER_RUN }, (_, i) => ({
    state: 'ok',
    label: String(i + 1),
  })),
  passMark: `Best so far: ${WORD_SHUFFLE_BEST_SO_FAR}`,
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2_META = {
  'word-shuffle': {
    name: 'Word Shuffle',
    /* getters: GameV2Page reads them on every render, so a live result header follows the server's card, never the mock numbers */
    get subtitleLead() {
      const stored = readLiveResult('word-shuffle');
      if (stored?.total) return `Verbal reasoning · ${stored.total} job titles`;
      return isLivePage()
        ? 'Verbal reasoning'
        : `Verbal reasoning · ${WORD_SHUFFLE_WORDS_PER_RUN} job titles`;
    },
    get resultProgress() {
      const stored = readLiveResult('word-shuffle');
      if (stored) {
        const total = stored.total || 0;
        return liveResultProgress(stored, {
          countLabel: `Word ${total} of ${total}`,
          summary: `${stored.correct ?? 0} of ${total} solved`,
        });
      }
      return isLivePage() ? null : mockResultProgress;
    },
  },
};

export default WordShuffle;
