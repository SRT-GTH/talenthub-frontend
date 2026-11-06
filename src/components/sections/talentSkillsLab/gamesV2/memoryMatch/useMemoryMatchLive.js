import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useGameV2Params } from '../gamesV2State.js';
import { MEMORY_SYMBOLS } from './memoryMatchData.js';

const log = debug('useMemoryMatchLive');

const PAIR_SETTLE_MS = 900; // as the mock: a matched pair stays white before it turns light green
const WRONG_HOLD_MS = 1100; // a miss stays red before both cards turn back

const LEVEL_LABEL = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

/*
 * useMemoryMatchLive — Memory Match against the server engine (backend utils/gameEngines/engines/memoryMatch.js).
 * Same return shape as useMemoryMatch (the mock), so MemoryMatchBoard draws both.
 *   The server keeps the layout; a card's symbol is known only once it is turned (`view.cards[i].symbol` for open / matched cards,
 *   `result.symbol` for the card just turned). A miss is reset at once on the server, so the red "wrong" moment is drawn from the
 *   move's result for WRONG_HOLD_MS.
 *   Server symbols (kente, drum, cocoa_pod …) get the board's drawn faces in the order they first appear in the run (≤ 15 per run),
 *   so two symbols never share a face.
 *   Score, XP and evidence come from the server's result card (useGameRun → GameV2Result).
 */
export const useMemoryMatchLive = (run) => {
  const g = useGameV2Params();
  const faces = useRef(new Map());
  const [flash, setFlash] = useState(null); // { cards: { [index]: { state, sym } }, feedback }
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);
  const later = (fn, ms) => timers.current.push(window.setTimeout(fn, ms));

  const faceFor = useCallback((symbol) => {
    if (!symbol) return null;
    if (!faces.current.has(symbol)) {
      faces.current.set(symbol, MEMORY_SYMBOLS[faces.current.size % MEMORY_SYMBOLS.length]);
    }
    return faces.current.get(symbol);
  }, []);

  const v = run.view;
  const rows = v?.rows ?? 4;
  const cols = v?.cols ?? 4;
  const pairs = v?.pairs ?? (rows * cols) / 2;
  const levelId = run.difficulty || g.level;
  const level = {
    label: LEVEL_LABEL[levelId] ?? levelId,
    rows,
    cols,
    cards: `${cols}×${rows}`,
    pairs,
  };

  const cards = useMemo(() => {
    const list = (v?.cards ?? []).map((c) => {
      const over = flash?.cards?.[c.index];
      if (over)
        return {
          id: c.index,
          sym: faceFor(over.symbol),
          state: over.state,
          symbolName: over.symbol,
        };
      if (c.state === 'matched')
        return { id: c.index, sym: faceFor(c.symbol), state: 'found', symbolName: c.symbol };
      if (c.state === 'open')
        return { id: c.index, sym: faceFor(c.symbol), state: 'up', symbolName: c.symbol };
      return { id: c.index, sym: null, state: 'down' };
    });
    return list;
  }, [v, flash, faceFor]);

  const found = v?.matchedPairs ?? 0;
  const done = Boolean(v?.finished);

  const flip = useCallback(
    async (id) => {
      if (done || g.modal || run.busy) return;
      const c = (v?.cards ?? [])[id];
      if (!c || c.state !== 'hidden' || flash?.lock) return;
      log('flip', id);
      const res = await run.act({ type: 'flip', index: id });
      if (!res || res.error) {
        if (res?.error) log('refused', res.code);
        return;
      }
      const r = res.result || {};
      if (r.waitingForSecond) {
        setFlash({ feedback: null, cards: {} });
        return;
      }
      const first = { symbol: r.match ? r.symbol : null };
      // the first card's symbol: the earlier view had it open (or it is matched now)
      const prevOpen = (v?.cards ?? []).find((x) => x.index === r.pairWith);
      first.symbol = prevOpen?.symbol ?? r.symbol;
      if (r.match) {
        setFlash({
          feedback: 'pair',
          cards: {
            [r.index]: { state: 'pair', symbol: r.symbol },
            [r.pairWith]: { state: 'pair', symbol: r.symbol },
          },
        });
        later(() => setFlash(null), PAIR_SETTLE_MS);
      } else {
        setFlash({
          lock: true,
          feedback: 'wrong',
          cards: {
            [r.index]: { state: 'wrong', symbol: r.symbol },
            [r.pairWith]: { state: 'wrong', symbol: first.symbol },
          },
        });
        later(() => setFlash((f) => (f ? { feedback: 'wrong', cards: {} } : f)), WRONG_HOLD_MS);
      }
    },
    [done, g.modal, run, v, flash]
  );

  const timeLabel = useMemo(() => {
    if (g.modal === 'offline') return 'Paused';
    if (g.modal === 'timeup') return '0:00 left';
    return run.timeLabel ? `${run.timeLabel} left` : '';
  }, [g.modal, run.timeLabel]);

  return {
    g,
    level,
    levelId,
    cards,
    turns: v?.turns ?? 0,
    feedback: flash?.feedback ?? null,
    found,
    pairs,
    timeLabel,
    done,
    flip,
    seeResult: run.submit,
    paused: g.modal === 'offline',
  };
};
