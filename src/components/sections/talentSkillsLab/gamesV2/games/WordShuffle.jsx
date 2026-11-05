import { useCallback, useEffect } from 'react';
import { debug } from '../../../../../utils/debug.js';
import GameV2Shell from '../GameV2Shell.jsx';
import { useGameV2Params } from '../gamesV2State.js';
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

const log = debug('WordShuffle');

/*
 * WordShuffle — Games v2 "Word Shuffle" (Figma "Games v2 · 5": WS-01 Building the word, WS-02 Wrong guess · one more try, WS-03 Hint
 * used · first letter locked, WS-04 Correct; Playful + Focused). Route /skills-lab/play/word-shuffle[?mode=…&level=…&f=WS-0x].
 * Six job titles against one run clock; tap tiles (or type), Backspace / Clear, Shuffle, one hint (locks the first letter), one wrong
 * guess allowed. Content beyond the drawn word is ⚠️ ASSUMPTION — see wordShuffle/wordShuffleData.js.
 */
const LEVEL_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};
const MEASURES = ['Verbal reasoning', 'Processing speed'];
const SUB = 'The field is your clue. You get one wrong guess per word.';

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;

const WordShuffle = ({ frame }) => {
  const g = useGameV2Params();
  const paused = Boolean(g.modal);
  const { openModal } = g;
  const onTimeUp = useCallback(() => {
    log('run clock hit 0 → time up');
    openModal('timeup');
  }, [openModal]);
  const game = useWordShuffleGame({ frame, level: g.level, paused, onFinish: g.finish, onTimeUp });
  const { current, status, resolved, tiles, order, answer, locked, n } = game;
  const title = titleCase(current.word);
  const correct = status === 'correct';

  useEffect(() => {
    log('mount', { level: game.levelKey, word: game.wordIndex + 1, status, frame, mode: g.mode });
  }, [game.levelKey, game.wordIndex, status, frame, g.mode]);

  /* the answer row: filled tiles, then dashed empty slots; resolved misses show the right word */
  const slots = Array.from({ length: n }, (_, i) => {
    if (resolved && !correct) return { letter: current.word[i], tone: 'ok' };
    const id = answer[i];
    if (id === undefined) return { letter: '', tone: 'empty' };
    const letter = tiles[id].letter;
    let tone = 'normal';
    if (correct) tone = 'ok';
    else if (status === 'wrong') tone = 'bad';
    else if (id === locked) tone = 'hint';
    return {
      letter,
      tone,
      onClick: resolved || id === locked ? undefined : () => game.removeAt(i),
      label: `Take back ${letter}`,
    };
  });

  const traySlots = order.map((id) => ({
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

  let feedback = { tone: null, message: '' };
  if (game.hintUsed && !resolved)
    feedback = { tone: 'info', message: `Hint: it starts with ${current.word[0]}.` };
  if (game.notice) feedback = { tone: 'info', message: game.notice };
  if (status === 'wrong') feedback = { tone: 'bad', message: 'Not quite. You have one more try.' };
  if (status === 'failed') feedback = { tone: 'bad', message: `Not quite. The word was ${title}.` };
  if (status === 'skipped') feedback = { tone: 'info', message: `The word was ${title}.` };
  if (correct) feedback = { tone: 'ok', message: `${title}. Well done.` };

  const dots = Array.from({ length: WORD_SHUFFLE_WORDS_PER_RUN }, (_, i) => {
    const label = String(i + 1);
    if (i < game.results.length) {
      return { state: game.results[i].result === 'solved' ? 'ok' : 'bad', label };
    }
    return { state: i === game.results.length ? 'now' : 'todo', label };
  });
  const progress = {
    countLabel: `Word ${game.wordIndex + 1} of ${game.totalWords}`,
    summary: `${game.solvedCount} solved · ${plural(game.hintCount, 'hint', 'hints')} used`,
    dots,
    passMark: `Best so far: ${WORD_SHUFFLE_BEST_SO_FAR}`,
  };

  const footer = resolved
    ? {
        note: '',
        action: { label: game.isLast ? 'See my result' : 'Next word', onClick: game.next },
      }
    : {
        note: '',
        link: { label: 'Skip word', onClick: game.skip },
        action: { label: 'Check word', onClick: game.check },
      };

  const hintLabel = game.hintUsed
    ? 'Hint used · this word is now worth ¾'
    : 'Hint · costs ¼ of this word';
  const triesLabel = status === 'failed' || status === 'skipped' ? 'No tries left' : '1 tries left';

  log('render', { word: current.word, status, answer: answer.join(','), locked });

  return (
    <GameV2Shell
      name="Word Shuffle"
      subtitleLead={`Verbal reasoning · ${WORD_SHUFFLE_WORDS_PER_RUN} job titles`}
      progress={progress}
      footer={footer}
      timeUp={{
        summary: `You unscrambled ${game.solvedCount} of ${WORD_SHUFFLE_WORDS_PER_RUN} job titles before time ran out.`,
      }}
      onSeeResult={game.finishNow}
    >
      <NumbersWordsHead
        eyebrow={`WORD ${game.wordIndex + 1} · ${LEVEL_LABELS[game.levelKey].toUpperCase()}`}
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
          field={current.field}
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
            hintUsed={game.hintUsed}
            hintLabel={hintLabel}
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

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2 = { 'word-shuffle': WordShuffle };

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2_META = {
  'word-shuffle': {
    name: 'Word Shuffle',
    subtitleLead: `Verbal reasoning · ${WORD_SHUFFLE_WORDS_PER_RUN} job titles`,
    resultProgress: {
      countLabel: `Word ${WORD_SHUFFLE_WORDS_PER_RUN} of ${WORD_SHUFFLE_WORDS_PER_RUN}`,
      summary: 'All words played',
      dots: Array.from({ length: WORD_SHUFFLE_WORDS_PER_RUN }, (_, i) => ({
        state: 'ok',
        label: String(i + 1),
      })),
      passMark: `Best so far: ${WORD_SHUFFLE_BEST_SO_FAR}`,
    },
  },
};

export default WordShuffle;
