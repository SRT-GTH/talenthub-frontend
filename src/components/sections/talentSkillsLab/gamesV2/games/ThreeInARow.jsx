import { useEffect } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useGameV2Params } from '../gamesV2State.js';
import GameV2Shell from '../GameV2Shell.jsx';
import ThreeInARowBoard from '../threeInARow/ThreeInARowBoard.jsx';
import ThreeInARowFeedback from '../threeInARow/ThreeInARowFeedback.jsx';
import ThreeInARowHead from '../threeInARow/ThreeInARowHead.jsx';
import ThreeInARowMatchPanel from '../threeInARow/ThreeInARowMatchPanel.jsx';
import { RESULT_TEXT, scoreMatch, TR_COPY, TR_GAMES } from '../threeInARow/threeInARowData.js';
import { useThreeInARowMatch } from '../threeInARow/useThreeInARowMatch.js';

const log = debug('ThreeInARow');

/*
 * Three in a Row — `/skills-lab/play/three-in-a-row` (Figma "Games v2 · Three in a Row": TR-01 … TR-04, Playful + Focused).
 * Best of three games against Kwaku on a 3×3 board: you are X and start every game. Kwaku answers after ~0.8 s ("Kwaku is thinking");
 * tapping an occupied square shows "That square is taken" and costs nothing. `?f=TR-01…04` boots the exact frame, frozen.
 */
const GAME_LEVEL_LABEL = (level) => level.toUpperCase();

export const ThreeInARow = ({ frame }) => {
  const g = useGameV2Params();
  const m = useThreeInARowMatch({ level: g.level, frame, paused: Boolean(g.modal) });
  const lastGame = m.gameIndex >= TR_GAMES - 1;
  const wins = m.results.filter((r) => r === 'you').length;
  const losses = m.results.filter((r) => r === 'kwaku').length;
  const draws = m.results.filter((r) => r === 'draw').length;

  useEffect(() => {
    log('mount', { level: g.level, frame, frozen: m.frozen });
  }, [g.level, frame, m.frozen]);

  let headline = TR_COPY.yourMove;
  let feedback = null;
  if (m.over) {
    const n = m.gameIndex + 1;
    if (m.outcome === 'you') {
      headline = TR_COPY.won;
      feedback = { tone: 'success', message: `Three in a row. You win game ${n}.` };
    } else if (m.outcome === 'kwaku') {
      // ⚠️ ASSUMPTION: only the win is drawn; the lose / draw / resign copy below is invented in the same voice.
      headline = 'Kwaku got three in a row.';
      feedback = { tone: 'info', message: `Three in a row for Kwaku. He wins game ${n}.` };
    } else if (m.outcome === 'draw') {
      headline = 'No squares left. It’s a draw.';
      feedback = { tone: 'info', message: `The board is full. Game ${n} is a draw.` };
    } else {
      headline = 'You resigned this game.';
      feedback = { tone: 'info', message: `You resigned game ${n}.` };
    }
  } else if (m.thinking) {
    headline = TR_COPY.thinking;
  } else if (m.notice !== null) {
    feedback = { tone: 'info', message: TR_COPY.taken };
  }

  let status = TR_COPY.statusYou;
  let statusTone = 'good';
  if (m.over) {
    status = lastGame ? 'Match over' : `Game ${m.gameIndex + 2} starts with you`; // ⚠️ ASSUMPTION: "Match over"
  } else if (m.thinking) {
    status = TR_COPY.statusKwaku;
    statusTone = 'muted';
  } else if (m.notice !== null) {
    status = TR_COPY.statusTaken;
  }
  log('render', { game: m.gameIndex + 1, turn: m.turn, over: m.over, outcome: m.outcome, status });

  const nowIndex = m.results.findIndex((r) => r === null);
  const progress = {
    countLabel: `Game ${m.gameIndex + 1} of ${TR_GAMES}`,
    summary: `You ${wins} · Kwaku ${losses}`,
    dots: m.results.map((r, i) => ({
      state: r ? (r === 'kwaku' ? 'bad' : 'ok') : i === nowIndex ? 'now' : 'todo',
      label: String(i + 1),
    })),
    passMark: TR_COPY.playsLevel[g.level] ?? TR_COPY.playsLevel.intermediate,
  };
  const chips = m.results.map((r, i) => {
    if (r) return `Game ${i + 1} · ${RESULT_TEXT[r]}`;
    return `Game ${i + 1} · ${i === m.gameIndex && !m.over ? 'Playing' : 'To play'}`;
  });

  const finishMatch = () => g.finish(scoreMatch(m.results));
  const footer = {
    note: '',
    ...(m.over
      ? {
          action: {
            label: lastGame ? TR_COPY.seeResult : TR_COPY.next,
            onClick: lastGame ? finishMatch : m.next,
          },
        }
      : { link: { label: TR_COPY.resign, size: 'lg', onClick: m.resign } }),
  };

  return (
    <GameV2Shell
      name="Three in a Row"
      subtitleLead="Strategic thinking · 3 games against Kwaku"
      progress={progress}
      footer={footer}
      timeUp={{ summary: `You have won ${wins} of ${TR_GAMES} games against Kwaku so far.` }}
      onSeeResult={finishMatch}
    >
      <ThreeInARowHead
        eyebrow={`GAME ${m.gameIndex + 1} · ${GAME_LEVEL_LABEL(g.level)}`}
        headline={headline}
        sentence={TR_COPY.sub}
        skills={['Strategic thinking']}
      />
      <div className="flex flex-col items-center gap-[24px] lg:flex-row lg:justify-center lg:gap-[48px] lg:pt-[8px]">
        <div className="flex w-full flex-col items-center lg:w-[460px] lg:shrink-0">
          <ThreeInARowBoard
            board={m.board}
            taken={m.notice}
            win={m.win}
            hover={m.hover}
            interactive={!m.frozen && !m.over && m.turn === 'you'}
            onPlay={m.play}
          />
          <ThreeInARowFeedback tone={feedback?.tone} message={feedback?.message} />
        </div>
        <ThreeInARowMatchPanel
          quote={m.quote}
          thinking={m.thinking}
          animateDots={!m.frozen}
          score={[
            { label: 'You', value: wins },
            { label: 'Draws', value: draws },
            { label: 'Kwaku', value: losses },
          ]}
          chips={chips}
          status={status}
          statusTone={statusTone}
        />
      </div>
    </GameV2Shell>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2 = { 'three-in-a-row': ThreeInARow };

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2_META = {
  'three-in-a-row': {
    name: 'Three in a Row',
    subtitleLead: 'Strategic thinking · 3 games against Kwaku',
    resultProgress: {
      countLabel: 'Game 3 of 3',
      summary: 'You 2 · Kwaku 0',
      dots: [1, 2, 3].map((n) => ({ state: 'ok', label: String(n) })),
      passMark: TR_COPY.playsLevel.intermediate,
    },
  },
};
