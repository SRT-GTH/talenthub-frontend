import { useEffect } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { isMockUrl, liveStrip, readLiveResult } from '../chess/gameLiveResult.js';
import { MAKOLA_HAGGLE } from '../makolaHaggle/makolaHaggleData.js';
import MakolaMoveCard from '../makolaHaggle/MakolaMoveCard.jsx';
import MakolaStage from '../makolaHaggle/MakolaStage.jsx';
import { useMakolaHaggle } from '../makolaHaggle/useMakolaHaggle.js';
import { useMakolaHaggleLive } from '../makolaHaggle/useMakolaHaggleLive.js';
import GameV2Shell from '../GameV2Shell.jsx';
import { useGameV2Params } from '../gamesV2State.js';
import GameV2LiveGate from '../live/GameV2LiveGate.jsx';
import { isLiveGames } from '../live/gameKeys.js';
import { useGameRun } from '../live/useGameRun.js';
import ServerGameHead from '../serverGame/ServerGameHead.jsx';

const log = debug('MakolaHaggle');

/*
 * Makola Haggle (Games v2, "server" game, play style — no score) — Figma MH-01 Your move (Playful 9623:65939 / Focused 9623:68066)
 * and MH-02 Move picked (9623:66661 / 9623:68653). Route `/skills-lab/play/makola-haggle[?f=MH-01|MH-02]`.
 * Loop: read Auntie's line, pick one of four moves (click or A–D / 1–4; the footer "Walk away" picks the walk-away move) → the
 * server records it ("Checking…") → "Your pick" + footer "Next round" → … after the last round the play-style result opens.
 *   live (default): makolaHaggle/useMakolaHaggleLive.js — the server's trait pack; the result card (provisional traits) opens
 *                   by itself after the last pick (useGameRun).
 *   `?f=MH-01|MH-02` / `?demo=1`: makolaHaggle/useMakolaHaggle.js — the local mock (makolaHaggleData.js).
 */
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const GAME_ID = 'makola-haggle';

const MakolaHaggleBoard = ({ m }) => {
  const { locked, choose, moves } = m;
  // A–D / 1–4 pick a move.
  useEffect(() => {
    const onKey = (event) => {
      if (locked || event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName)) return;
      const key = event.key.toUpperCase();
      const at = LETTERS.indexOf(key) >= 0 ? LETTERS.indexOf(key) : Number(key) - 1;
      if (at >= 0 && at < moves.length) {
        log('key pick', key);
        choose(at);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [locked, choose, moves.length]);

  return (
    <GameV2Shell
      name={MAKOLA_HAGGLE.name}
      subtitleLead={m.subtitle}
      subtitle={m.subtitle}
      sticker={MAKOLA_HAGGLE.sticker}
      progress={m.progress}
      footer={m.footer}
    >
      <ServerGameHead
        eyebrow={m.head.eyebrow}
        title={m.head.title}
        body={m.head.body}
        stats={m.head.stats}
        readLabel="Shows"
        reads={m.reads}
      />
      <MakolaStage round={m.stage} />
      <div role="radiogroup" aria-label="Your move" className="grid gap-[16px] md:grid-cols-2">
        {moves.map((move, i) => (
          <MakolaMoveCard
            key={`${m.roundKey}-${LETTERS[i] ?? i}`}
            letter={LETTERS[i] ?? String(i + 1)}
            move={move}
            icon={move.icon}
            picked={m.pick === i}
            locked={locked}
            onPick={() => choose(i)}
          />
        ))}
      </div>
      <span className="sr-only" aria-live="polite" role="status">
        {m.live}
      </span>
    </GameV2Shell>
  );
};

/* the drawn Figma frames (`?f=`) and `?demo=1`: the local mock run */
const MockMakolaHaggle = ({ frame }) => <MakolaHaggleBoard m={useMakolaHaggle(frame)} />;

/* live: the server's scenario engine records each move and reads the play style */
const LiveMakolaHaggle = () => {
  const run = useGameRun({ finishDelayMs: 1500 });
  const m = useMakolaHaggleLive(run);
  if (run.status !== 'ready' && run.status !== 'finished') {
    return <GameV2LiveGate run={run} name={MAKOLA_HAGGLE.name} subtitleLead="Play style" />;
  }
  return <MakolaHaggleBoard m={m} />;
};

const MakolaHaggle = ({ frame }) => {
  const g = useGameV2Params();
  const key = `${g.level}-${g.mode}-${frame ?? ''}`;
  return isLiveGames() ? (
    <LiveMakolaHaggle key={key} />
  ) : (
    <MockMakolaHaggle key={key} frame={frame} />
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2 = { [GAME_ID]: MakolaHaggle };

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2_META = {
  [GAME_ID]: {
    name: MAKOLA_HAGGLE.name,
    get subtitleLead() {
      return isMockUrl()
        ? MAKOLA_HAGGLE.subtitle
        : 'Play style · an early read, never shown to recruiters';
    },
    /* getters: GameV2Page reads them on every render; live results show only what the server's card says */
    get resultSubtitle() {
      const stored = readLiveResult(GAME_ID);
      const total = stored?.total || MAKOLA_HAGGLE.total;
      return `Play style · ${total} rounds · an early read, not a score`;
    },
    resultSticker: 'EARLY READ',
    get resultProgress() {
      const stored = readLiveResult(GAME_ID);
      if (stored) return liveStrip(stored, { noun: 'rounds', summary: 'Done' });
      if (!isMockUrl()) return null;
      // GV-12 (Figma): sticker EARLY READ, no ranked suffix, strip "4 of 4 rounds" / "Done", no pass mark.
      return {
        countLabel: `${MAKOLA_HAGGLE.total} of ${MAKOLA_HAGGLE.total} rounds`,
        summary: 'Done',
        dots: Array.from({ length: MAKOLA_HAGGLE.total }, (_, i) => ({
          state: 'ok',
          label: String(i + 1),
        })),
      };
    },
  },
};

export default MakolaHaggle;
