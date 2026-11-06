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
import { TACTICS_BEST_SO_FAR } from '../chess/chessData.js';
import { isMockUrl, liveStrip, readLiveResult } from '../chess/gameLiveResult.js';
import { TACTICS_TOTAL, useChessTacticsMock } from '../chess/useChessTacticsMock.js';
import { useChessTacticsLive } from '../chess/useChessTacticsLive.js';
import GameV2FeedbackChip from '../planningShared/GameV2FeedbackChip.jsx';
import GameV2Head from '../planningShared/GameV2Head.jsx';

const log = debug('ChessTactics');
const GAME_ID = 'chess-tactics';

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2_META = {
  [GAME_ID]: {
    name: 'Chess Tactics',
    /* getters: GameV2Page reads them on every render; live results show only what the server's card says */
    get subtitleLead() {
      if (isMockUrl()) return `Strategic thinking · ${TACTICS_TOTAL} puzzles`;
      const stored = readLiveResult(GAME_ID);
      return stored?.total ? `Strategic thinking · ${stored.total} puzzles` : 'Strategic thinking';
    },
    get resultProgress() {
      const stored = readLiveResult(GAME_ID);
      if (stored)
        return liveStrip(stored, { noun: 'puzzles', summary: `${stored.correct ?? 0} solved` });
      if (!isMockUrl()) return null;
      return {
        countLabel: `Puzzle ${TACTICS_TOTAL} of ${TACTICS_TOTAL}`,
        summary: 'All puzzles played',
        dots: Array.from({ length: TACTICS_TOTAL }, (_, i) => ({ state: 'ok', label: i + 1 })),
        passMark: `Best so far: ${TACTICS_BEST_SO_FAR}`,
      };
    },
  },
};

/* The board: draws whatever the hook (mock or live) returns. */
const ChessTacticsBoard = ({ m }) => {
  useEffect(() => {
    log('render', { count: m.progress.countLabel, chip: m.chip?.tone ?? null });
  }, [m.progress.countLabel, m.chip]);
  return (
    <GameV2Shell
      name="Chess Tactics"
      subtitleLead={m.subtitleLead}
      progress={m.progress}
      footer={m.footer}
      timeUp={{ summary: m.timeUpSummary }}
      onSeeResult={m.onSeeResult}
    >
      <GameV2Head {...m.head} />
      <section
        aria-label="Chess Tactics"
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

/* the drawn Figma frames (`?f=`) and `?demo=1`: the local mock run */
const MockChessTactics = ({ frame }) => <ChessTacticsBoard m={useChessTacticsMock(frame)} />;

/* live: the server engine (/api/games) holds the puzzles and checks every move */
const LiveChessTactics = () => {
  const run = useGameRun();
  const m = useChessTacticsLive(run);
  if (run.status !== 'ready' && run.status !== 'finished') {
    return <GameV2LiveGate run={run} name="Chess Tactics" subtitleLead="Strategic thinking" />;
  }
  return <ChessTacticsBoard m={m} />;
};

const ChessTactics = ({ frame }) => {
  const g = useGameV2Params();
  const key = `${g.level}-${g.mode}-${frame ?? ''}`;
  return isLiveGames() ? (
    <LiveChessTactics key={key} />
  ) : (
    <MockChessTactics key={key} frame={frame} />
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2 = { [GAME_ID]: ChessTactics };

export default ChessTactics;
