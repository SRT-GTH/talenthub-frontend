import { useEffect, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useGameV2Params } from '../gamesV2State.js';
import {
  ServerArrowDownIcon,
  ServerCheckCircleIcon,
  ServerClockIcon,
  ServerLayerTwoIcon,
  ServerLogOutIcon,
} from '../serverGame/ServerGameIcons.jsx';
import { useServerMove } from '../serverGame/useServerMove.js';
import { MAKOLA_HAGGLE, ROUNDS, WALK_MOVE, submitMove, summarise } from './makolaHaggleData.js';

const log = debug('useMakolaHaggle');

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

/*
 * useMakolaHaggle — the local (mock server) Makola Haggle for the drawn frames (`?f=MH-01|MH-02`) and `?demo=1`: rounds and the
 * play-style read come from makolaHaggleData.js. Same return shape as useMakolaHaggleLive (MakolaHaggleBoard).
 */
export const useMakolaHaggle = (frame) => {
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
    log('pick', move, data.moves[move].title);
    setPick(move);
    send({ round, move });
  };

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

  return {
    g,
    subtitle: MAKOLA_HAGGLE.subtitle,
    progress: {
      countLabel: `Round ${round + 1} of ${MAKOLA_HAGGLE.total}`,
      summary: MAKOLA_HAGGLE.note,
      dots: Array.from({ length: MAKOLA_HAGGLE.total }, (_, i) => ({
        state: i < round ? 'ok' : i === round ? 'now' : 'todo',
        label: String(i + 1),
      })),
    },
    footer,
    head: {
      eyebrow: data.eyebrow,
      title: data.title,
      body: data.body,
      stats: MAKOLA_HAGGLE.stats.map((label, i) => ({ icon: STAT_ICONS[i], label })),
    },
    reads: MAKOLA_HAGGLE.reads,
    stage: data,
    roundKey: String(round),
    moves: data.moves.map((m, i) => ({ ...m, icon: MOVE_ICONS[i] ?? null })),
    pick,
    locked,
    choose,
    live,
  };
};
