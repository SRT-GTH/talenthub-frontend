import { useCallback, useEffect, useMemo, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useGameV2Params } from '../gamesV2State.js';
import { useRoundShown } from '../live/useRoundShown.js';

const log = debug('useSwitchSortLive');

/* How long the tick / cross stays before the next card. The server starts a card's clock when it is told the card is drawn
 * (round_shown), and by itself 1 s + a short grace after the previous sort, so keep this short. */
const LIVE_HOLD_MS = 500;
const TICK_MS = 100;

/*
 * useSwitchSortLive — Switch Sort against the server engine (backend utils/gameEngines/engines/ruleSwitch.js).
 * Same shape as the mock adapter in games/SwitchSort.jsx, so SwitchSortBoard draws both.
 *   view.card { index, total, colour, shape, rule (null at Expert: no sign), responseMs, timeLeftMs } · view.baskets · view.results
 *   action    { type: 'sort', side: 'left' | 'right', clientMs } · { type: 'timeout', round, clientMs }  →  result { correct, timedOut, finished }
 *             { type: 'round_shown', round } (quiet) → { roundShown, round, timeLeftMs }
 * Which basket is right is never known here: the tick / cross comes from the result. \"Rule changed\" is shown when the sign's rule
 * differs from the previous card's sign. The card's time is the server's responseMs, counted from when the card is drawn: the hook
 * sends { type: 'round_shown', round } then, which starts the server's clock for that card. A card left until its time runs out is
 * sent as { type: 'timeout', round, clientMs }: the server records a miss and the board shows it as \"too slow\" (no basket lit).
 */
export const useSwitchSortLive = (run) => {
  const g = useGameV2Params();
  const paused = Boolean(g.modal);
  const v = run.view;
  const live = v?.card ?? null;
  const [phase, setPhase] = useState('card'); // card | feedback
  const [feedback, setFeedback] = useState(null); // { side, correct, tookMs, remainingAtPick }
  const [snapshot, setSnapshot] = useState(null); // the card that was just sorted (the server has moved on)
  const [lastRule, setLastRule] = useState(null); // the sign of the card before the one on show
  const [sending, setSending] = useState(false);
  const [times, setTimes] = useState([]); // ms per sorted card (the \"avg\" label only)
  const [clock, setClock] = useState(null); // { index, at }
  const [holdUntil, setHoldUntil] = useState(0);
  const [now, setNow] = useState(0);

  const liveIndex = phase === 'card' && live ? live.index : null;
  useEffect(() => {
    if (liveIndex === null) return;
    const at = Date.now();
    log('card drawn', liveIndex + 1);
    setClock({ index: liveIndex, at });
    setNow(at);
  }, [liveIndex]);

  // start the server's clock for the card now drawn; if the server's clock had already started (it starts by itself after a short
  // grace), count from its start instead
  useRoundShown(run, liveIndex, (r) => {
    const responseMs = live?.responseMs;
    if (!Number.isFinite(r.timeLeftMs) || !Number.isFinite(responseMs)) return;
    const serverAt = Date.now() - (responseMs - r.timeLeftMs);
    setClock((c) =>
      c && c.index === r.round && serverAt < c.at ? { index: c.index, at: serverAt } : c
    );
  });

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  const perCardMs = live?.responseMs ?? snapshot?.responseMs ?? 3000;
  // the clock of the card on show (a just-arrived card has no clock until its effect has run)
  const cardClock = clock && live && clock.index === live.index ? clock : null;
  const remainingMs =
    phase === 'card' && cardClock
      ? Math.max(0, perCardMs - (now - cardClock.at))
      : (feedback?.remainingAtPick ?? perCardMs);
  const holdMs = phase === 'feedback' ? Math.max(0, holdUntil - now) : 0;

  const sort = useCallback(
    async (side, timedOut) => {
      if (phase !== 'card' || sending || !live || !cardClock || run.busy) return;
      const card = live;
      const tookMs = Math.max(0, Date.now() - cardClock.at);
      log('sort', { card: card.index + 1, side, tookMs, timedOut });
      setSending(true);
      const res = await run.act(
        timedOut
          ? { type: 'timeout', round: card.index, clientMs: tookMs }
          : { type: 'sort', side, clientMs: tookMs }
      );
      setSending(false);
      if (!res || res.error) {
        if (res?.error) log('refused', res.code);
        return;
      }
      const r = res.result || {};
      if (r.ignored) return; // a timeout for a card the server had already moved past
      setTimes((t) => [...t, tookMs]);
      setSnapshot(card);
      setFeedback({
        side: timedOut ? null : side,
        correct: Boolean(r.correct),
        tookMs,
        remainingAtPick: Math.max(0, card.responseMs - tookMs),
      });
      setHoldUntil(Date.now() + LIVE_HOLD_MS);
      setPhase('feedback');
    },
    [phase, sending, live, cardClock, run]
  );

  const pick = useCallback(
    (side) => {
      if (!paused) sort(side, false);
    },
    [paused, sort]
  );

  /* the card's time ran out */
  useEffect(() => {
    if (phase === 'card' && cardClock && !paused && !sending && remainingMs <= 0) {
      log('card time ran out');
      sort(null, true);
    }
  }, [phase, cardClock, paused, sending, remainingMs, sort]);

  /* after the hold, the next card (none once the run is finished: useGameRun opens the result) */
  useEffect(() => {
    if (phase !== 'feedback' || holdMs > 0 || !live) return;
    setLastRule(snapshot?.rule ?? null);
    setSnapshot(null);
    setFeedback(null);
    setPhase('card');
  }, [phase, holdMs, live, snapshot]);

  const results = useMemo(() => v?.results ?? [], [v]);
  const shownCard = phase === 'feedback' ? snapshot : live;

  if (!shownCard) return null;
  const sign = shownCard.rule !== null && shownCard.rule !== undefined;
  const switched = sign && Boolean(lastRule) && shownCard.rule !== lastRule;
  const answers = results.map((r, i) => ({ correct: r === 'correct', ms: times[i] ?? 0 }));

  return {
    live: true,
    level: run.difficulty || g.level,
    perCardMs,
    sign,
    total: shownCard.total,
    answers,
    avgMs: times.length ? times.reduce((s, ms) => s + ms, 0) / times.length : 0,
    phase,
    feedback,
    shown: {
      colour: shownCard.colour,
      shape: shownCard.shape,
      rule: shownCard.rule ?? 'colour',
      switched,
    },
    shownIndex: shownCard.index,
    frozen: false,
    pick,
    remainingMs,
    holdMs,
    overrides: null,
    summary: null,
    bestSoFar: null,
    finishNow: run.submit,
  };
};
