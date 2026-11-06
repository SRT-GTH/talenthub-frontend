import { debug } from '../../../../../utils/debug.js';
import { isMockUrl, liveStrip, readLiveResult } from '../chess/gameLiveResult.js';
import CrisisRoomMessage from '../crisisRoom/CrisisRoomMessage.jsx';
import CrisisRoomPerson from '../crisisRoom/CrisisRoomPerson.jsx';
import CrisisRoomWhy from '../crisisRoom/CrisisRoomWhy.jsx';
import { CRISIS_ROOM } from '../crisisRoom/crisisRoomData.js';
import { useCrisisRoom } from '../crisisRoom/useCrisisRoom.js';
import { useCrisisRoomLive } from '../crisisRoom/useCrisisRoomLive.js';
import GameV2Shell from '../GameV2Shell.jsx';
import { useGameV2Params } from '../gamesV2State.js';
import GameV2LiveGate from '../live/GameV2LiveGate.jsx';
import { isLiveGames } from '../live/gameKeys.js';
import { useGameRun } from '../live/useGameRun.js';
import ServerGameHead from '../serverGame/ServerGameHead.jsx';

const log = debug('CrisisRoom');

/*
 * Crisis Room (Games v2, "server" game) — Figma CR-01 Order and choose (Playful 9623:64964 / Focused 9623:67359) and CR-02 Why this
 * order, after the round (9623:65408 / 9623:67669). Route `/skills-lab/play/crisis-room[?f=CR-01|CR-02]`.
 * Loop: per alarm put the people in call order (tap to add / remove, ↑ ↓ or ArrowUp / ArrowDown to reorder), pick the first
 * message, "Lock in my plan" → the server checks it ("Checking…") → the "Why this order" view → "Next alarm".
 *   live (default): crisisRoom/useCrisisRoomLive.js — the server's scenario engine holds the alarms, the answer key and the score;
 *                   the result card opens by itself after the last alarm (useGameRun).
 *   `?f=CR-01|CR-02` / `?demo=1`: crisisRoom/useCrisisRoom.js — the local mock (crisisRoomData.js, serverGame/mockServer.js).
 */
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const GAME_ID = 'crisis-room';
/* the live result card has the server's own pass verdict (`passed`), not the drawn pass mark */
const LIVE_FINISH_DELAY_MS = 4000; // the last alarm's "Why this order" stays readable before the result opens

const CrisisRoomBoard = ({ m }) => (
  <GameV2Shell
    name={CRISIS_ROOM.name}
    subtitleLead={m.subtitle}
    subtitle={m.subtitle}
    progress={m.progress}
    footer={m.footer}
    timeUp={{ summary: m.timeUpSummary }}
    onSeeResult={m.onSeeResult}
  >
    <ServerGameHead
      eyebrow={m.head.eyebrow}
      title={m.head.title}
      body={m.head.body}
      stats={m.head.stats}
      readLabel="Measures"
      reads={m.reads}
    />
    {m.scoredNote ? (
      <p
        role="note"
        className="m-0 rounded-[16px] border border-solid border-[rgba(28,42,33,0.12)] bg-white px-[16px] py-[12px] font-sans text-[14px] leading-[21px] text-[#1c2a21]"
      >
        {m.scoredNote}
      </p>
    ) : null}
    {m.verdict ? <CrisisRoomWhy pill={m.verdict.pill} explain={m.verdict.explain ?? ''} /> : null}
    <div className="grid gap-[20px] lg:grid-cols-2">
      <section aria-label="Who do you call first?" className="flex min-w-0 flex-col gap-[20px]">
        <h3 className="m-0 font-sans text-[11.5px] leading-[14px] font-bold tracking-[0.69px] text-[#387440] uppercase max-lg:text-[12px]">
          Who do you call first? Drag to order
        </h3>
        <ul className="m-0 flex list-none flex-col gap-[20px] p-0">
          {m.rows.map(({ person, position, last }) => (
            <CrisisRoomPerson
              key={person.id}
              person={person}
              position={position}
              last={last}
              locked={m.orderLocked}
              onToggle={m.toggle}
              onMove={m.move}
            />
          ))}
        </ul>
      </section>
      <section
        aria-label="Your first message to the team"
        className="flex min-w-0 flex-col gap-[20px] lg:self-center"
      >
        <h3 className="m-0 font-sans text-[11.5px] leading-[14px] font-bold tracking-[0.69px] text-[#387440] uppercase max-lg:text-[12px]">
          Your first message to the team
        </h3>
        <div role="radiogroup" aria-label="Your first message" className="flex flex-col gap-[20px]">
          {m.messages.map((text, i) => (
            <CrisisRoomMessage
              key={LETTERS[i] ?? i}
              letter={LETTERS[i] ?? String(i + 1)}
              text={text}
              picked={m.message === i}
              locked={m.messageLocked}
              onPick={() => {
                log('message', LETTERS[i] ?? i);
                m.pickMessage(i);
              }}
            />
          ))}
        </div>
      </section>
    </div>
    <span className="sr-only" aria-live="polite" role="status">
      {m.live}
    </span>
  </GameV2Shell>
);

/* the drawn Figma frames (`?f=`) and `?demo=1`: the local mock run */
const MockCrisisRoom = ({ frame }) => <CrisisRoomBoard m={useCrisisRoom(frame)} />;

/* live: the server's scenario engine (/api/games) holds the alarms and scores the plan */
const LiveCrisisRoom = () => {
  const run = useGameRun({ finishDelayMs: LIVE_FINISH_DELAY_MS });
  const m = useCrisisRoomLive(run);
  if (run.status !== 'ready' && run.status !== 'finished') {
    return <GameV2LiveGate run={run} name={CRISIS_ROOM.name} subtitleLead={CRISIS_ROOM.skill} />;
  }
  return <CrisisRoomBoard m={m} />;
};

const CrisisRoom = ({ frame }) => {
  const g = useGameV2Params();
  const key = `${g.level}-${g.mode}-${frame ?? ''}`;
  return isLiveGames() ? <LiveCrisisRoom key={key} /> : <MockCrisisRoom key={key} frame={frame} />;
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2 = { [GAME_ID]: CrisisRoom };

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2_META = {
  [GAME_ID]: {
    name: CRISIS_ROOM.name,
    /* getters: GameV2Page reads them on every render; live results show only what the server's card says */
    get subtitleLead() {
      if (isMockUrl()) return CRISIS_ROOM.subtitle;
      const stored = readLiveResult(GAME_ID);
      return stored?.total ? `${CRISIS_ROOM.skill} · ${stored.total} alarms` : CRISIS_ROOM.skill;
    },
    get resultProgress() {
      const stored = readLiveResult(GAME_ID);
      if (stored) {
        const strip = liveStrip(stored, {
          noun: 'alarms',
          summary: `${stored.correct ?? 0} handled well`,
        });
        if (stored.passed === true) strip.passMark = 'Pass mark reached';
        else if (stored.passed === false) strip.passMark = 'Below the pass mark';
        return strip;
      }
      if (!isMockUrl()) return null;
      // ⚠️ ASSUMPTION: the strip above the result card shows the last alarm, all dots done.
      return {
        countLabel: `Alarm ${CRISIS_ROOM.total} of ${CRISIS_ROOM.total}`,
        summary: 'All alarms checked',
        dots: Array.from({ length: CRISIS_ROOM.total }, (_, i) => ({
          state: 'ok',
          label: String(i + 1),
        })),
        passMark: `Pass mark: ${CRISIS_ROOM.passMark} of ${CRISIS_ROOM.total}`,
      };
    },
  },
};

export default CrisisRoom;
