import { useEffect, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import {
  MAKOLA_HAGGLE,
  ROUNDS,
  WALK_MOVE,
  submitMove,
  summarise,
} from '../makolaHaggle/makolaHaggleData.js';
import MakolaMoveCard from '../makolaHaggle/MakolaMoveCard.jsx';
import MakolaStage from '../makolaHaggle/MakolaStage.jsx';
import GameV2Shell from '../GameV2Shell.jsx';
import { useGameV2Params } from '../gamesV2State.js';
import {
  ServerArrowDownIcon,
  ServerCheckCircleIcon,
  ServerClockIcon,
  ServerLayerTwoIcon,
  ServerLogOutIcon,
} from '../serverGame/ServerGameIcons.jsx';
import ServerGameHead from '../serverGame/ServerGameHead.jsx';
import { useServerMove } from '../serverGame/useServerMove.js';

const log = debug('MakolaHaggle');

/*
 * Makola Haggle (Games v2, "server" game, play style — no score) — Figma MH-01 Your move (Playful 9623:65939 / Focused 9623:68066)
 * and MH-02 Move picked (9623:66661 / 9623:68653). Route `/skills-lab/play/makola-haggle[?f=MH-01|MH-02]`.
 * Loop: read Auntie's line, pick one of four moves (click or A–D / 1–4; the footer "Walk away" is move C) → the mock server checks
 * it ("Checking…") → "Your pick" + footer "Next round" → … after round 4 "See my play style" calls g.finish({ score: 0, playStyle }).
 * A failed check opens `?modal=offline` and is re-sent on Retry. There is no clock. `?f=MH-01` boots round 2 unpicked,
 * `?f=MH-02` round 2 with move A picked.
 */
const LETTERS = ['A', 'B', 'C', 'D'];
const MOVE_ICONS = [
  ServerArrowDownIcon,
  ServerLayerTwoIcon,
  ServerLogOutIcon,
  ServerCheckCircleIcon,
];
const STAT_ICONS = [ServerClockIcon, ServerCheckCircleIcon];

const seedFor = (frame) => {
  if (frame === 'MH-01') return { round: 1, pick: null, phase: 'play', picks: [0] };
  if (frame === 'MH-02') return { round: 1, pick: 0, phase: 'picked', picks: [0] };
  return null;
};

const MakolaHaggle = ({ frame }) => {
  const g = useGameV2Params();
  const seed = seedFor(frame);
  const [round, setRound] = useState(seed?.round ?? 0);
  const [pick, setPick] = useState(seed?.pick ?? null);
  const [phase, setPhase] = useState(seed?.phase ?? 'play');
  const [picks, setPicks] = useState(seed?.picks ?? []);
  const [live, setLive] = useState('');

  const data = ROUNDS[round];
  const last = round === MAKOLA_HAGGLE.total - 1;

  useEffect(() => {
    log('mount', { frame, mode: g.mode, level: g.level, round: round + 1, phase });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { busy, send } = useServerMove({
    call: submitMove,
    onResult: (res) => {
      log('move accepted', res.kind);
      setPhase('picked');
      setLive(`Move picked: ${data.moves[res.move].title}.`);
    },
  });

  const locked = phase !== 'play' || busy;
  const choose = (move) => {
    if (locked) return;
    log('pick', LETTERS[move], data.moves[move].title);
    setPick(move);
    send({ round, move });
  };

  // A–D / 1–4 pick a move.
  useEffect(() => {
    const onKey = (event) => {
      if (locked || event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName)) return;
      const key = event.key.toUpperCase();
      const at = LETTERS.indexOf(key) >= 0 ? LETTERS.indexOf(key) : Number(key) - 1;
      if (at >= 0 && at < LETTERS.length) choose(at);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const next = () => {
    const nextPicks = [...picks, pick];
    if (last) {
      const result = summarise(nextPicks);
      log('finish', result.playStyle);
      g.finish(result);
      return;
    }
    log('next round', round + 2);
    setPicks(nextPicks);
    setRound(round + 1);
    setPick(null);
    setPhase('play');
  };

  let footer;
  if (phase === 'picked') {
    footer = {
      note: '',
      action: { label: last ? 'See my play style' : 'Next round', onClick: next },
    };
  } else if (busy) {
    footer = { note: '', action: { label: 'Checking…', disabled: true } };
  } else {
    footer = {
      note: '',
      link: { label: 'Walk away', size: 'lg', onClick: () => choose(WALK_MOVE) },
    };
  }

  return (
    <GameV2Shell
      name={MAKOLA_HAGGLE.name}
      subtitleLead={MAKOLA_HAGGLE.subtitle}
      subtitle={MAKOLA_HAGGLE.subtitle}
      sticker={MAKOLA_HAGGLE.sticker}
      progress={{
        countLabel: `Round ${round + 1} of ${MAKOLA_HAGGLE.total}`,
        summary: MAKOLA_HAGGLE.note,
        dots: Array.from({ length: MAKOLA_HAGGLE.total }, (_, i) => ({
          state: i < round ? 'ok' : i === round ? 'now' : 'todo',
          label: String(i + 1),
        })),
      }}
      footer={footer}
    >
      <ServerGameHead
        eyebrow={data.eyebrow}
        title={data.title}
        body={data.body}
        stats={MAKOLA_HAGGLE.stats.map((label, i) => ({ icon: STAT_ICONS[i], label }))}
        readLabel="Shows"
        reads={MAKOLA_HAGGLE.reads}
      />
      <MakolaStage round={data} />
      <div role="radiogroup" aria-label="Your move" className="grid gap-[16px] md:grid-cols-2">
        {data.moves.map((move, i) => (
          <MakolaMoveCard
            key={`${round}-${LETTERS[i]}`}
            letter={LETTERS[i]}
            move={move}
            icon={MOVE_ICONS[i]}
            picked={pick === i}
            locked={locked}
            onPick={() => choose(i)}
          />
        ))}
      </div>
      <span className="sr-only" aria-live="polite" role="status">
        {live}
      </span>
    </GameV2Shell>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2 = { 'makola-haggle': MakolaHaggle };

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2_META = {
  'makola-haggle': {
    name: MAKOLA_HAGGLE.name,
    subtitleLead: MAKOLA_HAGGLE.subtitle,
    // GV-12 (Figma): sticker EARLY READ, no ranked suffix, strip "4 of 4 rounds" / "Done", no pass mark.
    resultSubtitle: 'Play style · 4 rounds · an early read, not a score',
    resultSticker: 'EARLY READ',
    resultProgress: {
      countLabel: `${MAKOLA_HAGGLE.total} of ${MAKOLA_HAGGLE.total} rounds`,
      summary: 'Done',
      dots: Array.from({ length: MAKOLA_HAGGLE.total }, (_, i) => ({
        state: 'ok',
        label: String(i + 1),
      })),
    },
  },
};

export default MakolaHaggle;
