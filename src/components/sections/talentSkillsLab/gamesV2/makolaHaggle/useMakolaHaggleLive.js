import { useCallback, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useGameV2Params } from '../gamesV2State.js';
import {
  ServerArrowDownIcon,
  ServerCheckCircleIcon,
  ServerLayerTwoIcon,
  ServerLogOutIcon,
} from '../serverGame/ServerGameIcons.jsx';
import { MAKOLA_HAGGLE } from './makolaHaggleData.js';

const log = debug('useMakolaHaggleLive');

/*
 * Icons by the move's own words (presentation only). The server shuffles the options per run and sends only { title, sub },
 * so the icon cannot come from the position; an unknown move gets no icon.
 */
const ICON_RULES = [
  [/^counter/i, ServerArrowDownIcon],
  [/^(bundle|ask for)/i, ServerLayerTwoIcon],
  [/^walk away/i, ServerLogOutIcon],
  [/^pay/i, ServerCheckCircleIcon],
];
const iconFor = (title) => ICON_RULES.find(([re]) => re.test(title ?? ''))?.[1] ?? null;
const optionOf = (o) =>
  typeof o === 'string' ? { title: o, sub: '' } : { title: o?.title ?? '', sub: o?.sub ?? '' };

/*
 * useMakolaHaggleLive — Makola Haggle against the server's scenario engine (backend engines/scenario.js +
 * data/scenarios/makolaHaggle.json, a provisional trait pack). Same return shape as useMakolaHaggle (the mock).
 *   view.round  { index, total, parts: [{ kind: 'choice', label, options [{ title, sub }] }], content { title, body, auntie,
 *                 auntieLine } } · view.results ['done', …]
 *   action      { type: 'answer', value: <shown option index> } → result { part, correct: null, roundCorrect: null, finished }
 * There are no right answers, so nothing is judged here. The server moves on at once; the picked round stays on screen with
 * "YOUR PICK" until "Next round". After the last pick the result card (traits, provisional) opens by itself (useGameRun).
 * Not in the view, so not shown live: the "You said" bubble, the item tag and the "Auntie: Warm" / budget pills.
 */
export const useMakolaHaggleLive = (run) => {
  const g = useGameV2Params();
  const v = run.view;
  const [picked, setPicked] = useState(null); // { round, pick }
  const [live, setLive] = useState('');

  const r = picked?.round ?? v?.round ?? null;
  const part = (r?.parts ?? []).find((p) => p.kind === 'choice') ?? null;
  const moves = (part?.options ?? []).map(optionOf).map((m) => ({ ...m, icon: iconFor(m.title) }));
  const index = r?.index ?? 0;
  const total = r?.total ?? MAKOLA_HAGGLE.total;
  const results = v?.results ?? [];
  const finished = Boolean(v?.finished);
  const locked = Boolean(picked) || run.busy || Boolean(g.modal) || !v?.round;

  const choose = useCallback(
    async (i) => {
      if (locked || !v?.round || !moves[i]) return;
      const round = v.round;
      log('pick', round.index + 1, i);
      setPicked({ round, pick: i });
      const res = await run.act({ type: 'answer', value: i });
      if (!res || res.error) {
        if (res?.error) setLive(res.error);
        setPicked(null);
        return;
      }
      setLive(`Move picked: ${moves[i].title}.`);
    },
    [locked, v, moves, run]
  );

  const next = useCallback(() => setPicked(null), []);

  const walk = moves.findIndex((m) => /^walk away/i.test(m.title));
  let footer;
  if (picked && run.busy) footer = { note: '', action: { label: 'Checking…', disabled: true } };
  else if (picked && finished)
    footer = {
      note: '',
      action: { label: 'Opening your play style…', onClick: () => {}, disabled: true },
    };
  else if (picked) footer = { note: '', action: { label: 'Next round', onClick: next } };
  else if (walk >= 0)
    footer = { note: '', link: { label: 'Walk away', size: 'lg', onClick: () => choose(walk) } };
  else footer = { note: '' };

  const c = r?.content ?? {};
  return {
    g,
    subtitle: `Play style · ${total} rounds · an early read, never shown to recruiters`,
    progress: {
      countLabel: `Round ${Math.min(index + 1, total)} of ${total}`,
      summary: MAKOLA_HAGGLE.note,
      dots: Array.from({ length: total }, (_, i) => ({
        state: i < results.length ? 'ok' : i === index ? 'now' : 'todo',
        label: String(i + 1),
      })),
    },
    footer,
    head: {
      eyebrow: `ROUND ${index + 1} · MAKOLA MARKET`,
      title: c.title ?? '',
      body: c.body ?? '',
      stats: [],
    },
    reads: MAKOLA_HAGGLE.reads,
    stage: { auntie: c.auntieLine ?? '', auntieName: c.auntie ?? undefined },
    roundKey: String(index),
    moves,
    pick: picked?.pick ?? null,
    locked,
    choose,
    live,
  };
};
