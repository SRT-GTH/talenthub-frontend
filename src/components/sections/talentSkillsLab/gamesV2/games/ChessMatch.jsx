import { useEffect } from 'react';
import { debug } from '../../../../../utils/debug.js';
import GameV2Shell from '../GameV2Shell.jsx';
import { useGameV2Params } from '../gamesV2State.js';
import GameV2LiveGate from '../live/GameV2LiveGate.jsx';
import { isLiveGames } from '../live/gameKeys.js';
import { useGameRun } from '../live/useGameRun.js';
import ChessBoard from '../chess/ChessBoard.jsx';
import ChessClockCards from '../chess/ChessClockCards.jsx';
import ChessMoveList from '../chess/ChessMoveList.jsx';
import ChessTipCard from '../chess/ChessTipCard.jsx';
import { MATCH_COPY, MATCH_MOVES } from '../chess/chessData.js';
import { isMockUrl, readLiveResult } from '../chess/gameLiveResult.js';
import { useChessMatchLive } from '../chess/useChessMatchLive.js';
import { useChessMatchMock } from '../chess/useChessMatchMock.js';
import GameV2FeedbackChip from '../planningShared/GameV2FeedbackChip.jsx';
import GameV2Head from '../planningShared/GameV2Head.jsx';

const log = debug('ChessMatch');
const GAME_ID = 'chess-match';

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2_META = {
  [GAME_ID]: {
    name: 'Chess Match',
    /* getters: GameV2Page reads them on every render; live results show only what the server's card says */
    get subtitleLead() {
      return isMockUrl()
        ? `Strategic thinking · full game against Kwaku · ${MATCH_MOVES} moves`
        : 'Strategic thinking · full game against Kwaku';
    },
    get resultProgress() {
      const stored = readLiveResult(GAME_ID);
      if (stored) {
        // the card counts the player's moves (total) and the good-or-best ones (correct)
        return {
          countLabel: `${stored.total ?? 0} moves played`,
          summary: `${stored.correct ?? 0} good or best`,
          dots: [],
          passMark:
            stored.mode === 'ranked' && Number.isFinite(stored.previousBest)
              ? `Best before: ${stored.previousBest}`
              : undefined,
        };
      }
      if (!isMockUrl()) return null;
      return {
        countLabel: `Move ${MATCH_MOVES} of ${MATCH_MOVES}`,
        summary: 'Game finished',
        dots: [],
        passMark: MATCH_COPY.plays,
      };
    },
  },
};

/* The board: draws whatever the hook (mock or live) returns. */
const ChessMatchBoard = ({ m }) => {
  useEffect(() => {
    log('render', { count: m.progress.countLabel, chip: m.chip?.tone ?? null });
  }, [m.progress.countLabel, m.chip]);
  return (
    <GameV2Shell
      name="Chess Match"
      subtitleLead={m.subtitleLead}
      progress={m.progress}
      footer={m.footer}
      timeUp={{ summary: m.timeUpSummary }}
      onSeeResult={m.onSeeResult}
    >
      <GameV2Head {...m.head} />
      <section
        aria-label="Chess Match"
        className="flex flex-wrap items-center gap-[32px] lg:min-h-[476px]"
      >
        <ChessBoard {...m.board} />
        <div className="flex w-full min-w-[min(100%,300px)] max-w-[470px] flex-1 flex-col gap-[16px]">
          <ChessClockCards dark={m.clocks.dark} light={m.clocks.light} />
          <ChessMoveList {...m.moves} />
          {m.tip ? <ChessTipCard>{m.tip}</ChessTipCard> : null}
          {m.chip ? (
            <GameV2FeedbackChip tone={m.chip.tone}>{m.chip.text}</GameV2FeedbackChip>
          ) : null}
        </div>
      </section>
    </GameV2Shell>
  );
};

/* the drawn Figma frames (`?f=`) and `?demo=1`: the local mock game */
const MockChessMatch = ({ frame }) => <ChessMatchBoard m={useChessMatchMock(frame)} />;

/* live: the server engine (/api/games) plays Kwaku and grades every move */
const LiveChessMatch = () => {
  const run = useGameRun();
  const m = useChessMatchLive(run);
  if (run.status !== 'ready' && run.status !== 'finished') {
    return <GameV2LiveGate run={run} name="Chess Match" subtitleLead="Strategic thinking" />;
  }
  return <ChessMatchBoard m={m} />;
};

const ChessMatch = ({ frame }) => {
  const g = useGameV2Params();
  const key = `${g.level}-${g.mode}-${frame ?? ''}`;
  return isLiveGames() ? <LiveChessMatch key={key} /> : <MockChessMatch key={key} frame={frame} />;
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2 = { [GAME_ID]: ChessMatch };

export default ChessMatch;
