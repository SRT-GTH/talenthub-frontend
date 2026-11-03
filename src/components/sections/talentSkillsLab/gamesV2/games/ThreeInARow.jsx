import { useEffect } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useGameV2Params } from '../gamesV2State.js';
import GameV2Shell from '../GameV2Shell.jsx';
import GameV2LiveGate from '../live/GameV2LiveGate.jsx';
import { isLiveGames } from '../live/gameKeys.js';
import { useGameRun } from '../live/useGameRun.js';
import { isLivePage, liveResultProgress, readLiveResult } from '../numbersWords/liveResultStrip.js';
import ThreeInARowBoard from '../threeInARow/ThreeInARowBoard.jsx';
import ThreeInARowFeedback from '../threeInARow/ThreeInARowFeedback.jsx';
import ThreeInARowHead from '../threeInARow/ThreeInARowHead.jsx';
import ThreeInARowMatchPanel from '../threeInARow/ThreeInARowMatchPanel.jsx';
import { RESULT_TEXT, scoreMatch, TR_COPY, TR_GAMES } from '../threeInARow/threeInARowData.js';
import { useThreeInARowLive } from '../threeInARow/useThreeInARowLive.js';
import { useThreeInARowMatch } from '../threeInARow/useThreeInARowMatch.js';

const log = debug('ThreeInARow');

/*
 * Three in a Row — `/skills-lab/play/three-in-a-row` (Figma "Games v2 · Three in a Row": TR-01 … TR-04, Playful + Focused).
 * Three games against Kwaku on a 3×3 board: you are X. Kwaku answers after ~0.8 s ("Kwaku is thinking"); tapping an occupied square
 * shows "That square is taken" and costs nothing. Live (default): the server engine (tic_tac_toe) plays Kwaku, grades every move and
 * scores the match — see threeInARow/useThreeInARowLive.js (Kwaku starts game 2 there). `?f=TR-01…04` boots the exact frame, frozen;
 * `?demo=1` plays the local mock (you start every game).
 */
const GAME_LEVEL_LABEL = (level) => (level ?? '').toUpperCase();

const ThreeInARowView = ({ m }) => {
  const g = useGameV2Params();
  const total = m.total;
  const lastGame = m.lastGame;
  const wins = m.results.filter((r) => r === 'you').length;
  const losses = m.results.filter((r) => r === 'kwaku').length;
  const draws = m.results.filter((r) => r === 'draw').length;

  useEffect(() => {
    log('mount', { level: g.level, frozen: m.frozen });
  }, [g.level, m.frozen]);

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
    status = lastGame ? 'Match over' : m.nextStatus; // ⚠️ ASSUMPTION: "Match over"
  } else if (m.thinking) {
    status = TR_COPY.statusKwaku;
    statusTone = 'muted';
  } else if (m.notice !== null) {
    status = TR_COPY.statusTaken;
  }
  log('render', { game: m.gameIndex + 1, turn: m.turn, over: m.over, outcome: m.outcome, status });

  const nowIndex = m.results.findIndex((r) => r === null);
  const progress = {
    countLabel: `Game ${m.gameIndex + 1} of ${total}`,
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

  let footer = { note: '' };
  if (m.over) {
    footer = {
      note: '',
      action: {
        label: lastGame ? TR_COPY.seeResult : TR_COPY.next,
        onClick: lastGame ? m.finishNow : m.next,
      },
    };
  } else if (m.resign) {
    footer = { note: '', link: { label: TR_COPY.resign, size: 'lg', onClick: m.resign } };
  }

  return (
    <GameV2Shell
      name="Three in a Row"
      subtitleLead={`Strategic thinking · ${total} games against Kwaku`}
      progress={progress}
      footer={footer}
      timeUp={{ summary: `You have won ${wins} of ${total} games against Kwaku so far.` }}
      onSeeResult={m.finishNow}
    >
      <ThreeInARowHead
        eyebrow={`GAME ${m.gameIndex + 1} · ${GAME_LEVEL_LABEL(m.level ?? g.level)}`}
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
            interactive={m.interactive}
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

/* the drawn Figma frames (`?f=`) and `?demo=1`: the local mock match */
const MockThreeInARow = ({ frame }) => {
  const g = useGameV2Params();
  const m = useThreeInARowMatch({ level: g.level, frame, paused: Boolean(g.modal) });
  const view = {
    ...m,
    total: TR_GAMES,
    lastGame: m.gameIndex >= TR_GAMES - 1,
    interactive: !m.frozen && !m.over && m.turn === 'you',
    nextStatus: `Game ${m.gameIndex + 2} starts with you`,
    finishNow: () => g.finish(scoreMatch(m.results)),
  };
  return <ThreeInARowView m={view} />;
};

/* live: the server engine (/api/games, tic_tac_toe) plays Kwaku and scores the match */
const LiveThreeInARow = () => {
  const run = useGameRun();
  const m = useThreeInARowLive(run);
  if ((run.status !== 'ready' && run.status !== 'finished') || !m) {
    return <GameV2LiveGate run={run} name="Three in a Row" subtitleLead="Strategic thinking" />;
  }
  return <ThreeInARowView m={{ ...m, level: run.difficulty }} />;
};

export const ThreeInARow = ({ frame }) => {
  const g = useGameV2Params();
  /* a new run (level / mode / frame changed) starts from scratch */
  const key = `${g.level}-${g.mode}-${frame ?? ''}`;
  return isLiveGames() ? (
    <LiveThreeInARow key={key} />
  ) : (
    <MockThreeInARow key={key} frame={frame} />
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2 = { 'three-in-a-row': ThreeInARow };

const mockResultProgress = {
  countLabel: 'Game 3 of 3',
  summary: 'You 2 · Kwaku 0',
  dots: [1, 2, 3].map((n) => ({ state: 'ok', label: String(n) })),
  passMark: TR_COPY.playsLevel.intermediate,
};

/* the live card counts moves (correct = strongest moves); the games are in its summary: "3 won, 0 drawn, 0 lost; …" */
const matchFromSummary = (summary) => {
  const m = /(\d+) won, (\d+) drawn, (\d+) lost/.exec(summary || '');
  return m ? { won: Number(m[1]), drawn: Number(m[2]), lost: Number(m[3]) } : null;
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2_META = {
  'three-in-a-row': {
    name: 'Three in a Row',
    subtitleLead: `Strategic thinking · ${TR_GAMES} games against Kwaku`,
    /* a getter: GameV2Page reads it on every render, so a live result header follows the server's card, never the mock numbers */
    get resultProgress() {
      const stored = readLiveResult('three-in-a-row');
      if (stored) {
        const match = matchFromSummary(stored.summary);
        const played = match ? match.won + match.drawn + match.lost : TR_GAMES;
        return liveResultProgress(stored, {
          countLabel: `Game ${played} of ${played}`,
          summary: match ? `You ${match.won} · Kwaku ${match.lost}` : '',
        });
      }
      return isLivePage() ? null : mockResultProgress;
    },
  },
};
