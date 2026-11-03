import { useCallback, useEffect, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useGameV2Params } from '../gamesV2State.js';
import { useGameClock } from '../useGameClock.js';
import { ServerClockIcon, ServerUsersIcon } from '../serverGame/ServerGameIcons.jsx';
import { useServerMove } from '../serverGame/useServerMove.js';
import { ALARMS, CRISIS_ROOM, judgeAlarm, submitAlarm, summarise } from './crisisRoomData.js';
import { useCallOrder } from './useCallOrder.js';

const log = debug('useCrisisRoom');

const DRAWN_ORDER = ['kwabena', 'efua', 'boateng'];
const HANDLED_BEFORE = { handled: true, orderOk: true, messageOk: true };

const seedFor = (frame) => {
  if (frame === 'CR-01') {
    return {
      alarm: 1,
      results: [HANDLED_BEFORE],
      order: DRAWN_ORDER,
      message: 0,
      phase: 'play',
      seconds: 252,
    };
  }
  if (frame === 'CR-02') {
    return {
      alarm: 1,
      results: [HANDLED_BEFORE, judgeAlarm({ alarm: 1, order: DRAWN_ORDER, message: 0 })],
      order: DRAWN_ORDER,
      message: 0,
      phase: 'review',
      seconds: 200,
    };
  }
  return null;
};

const dotsFor = (results, alarm, phase) =>
  Array.from({ length: CRISIS_ROOM.total }, (_, i) => {
    const label = String(i + 1);
    if (i < results.length) return { state: results[i].handled ? 'ok' : 'bad', label };
    if (i === (phase === 'review' ? results.length : alarm)) return { state: 'now', label };
    return { state: 'todo', label };
  });

/*
 * useCrisisRoom — the local (mock server) Crisis Room for the drawn frames (`?f=CR-01|CR-02`) and `?demo=1`. The answers and the
 * verdict come from crisisRoomData.js. Same return shape as useCrisisRoomLive (CrisisRoomBoard).
 */
export const useCrisisRoom = (frame) => {
  const g = useGameV2Params();
  const seed = seedFor(frame);
  const [alarm, setAlarm] = useState(seed?.alarm ?? 0);
  const [results, setResults] = useState(seed?.results ?? []);
  const [message, setMessage] = useState(seed?.message ?? null);
  const [phase, setPhase] = useState(seed?.phase ?? 'play');
  const [showScored, setShowScored] = useState(false);
  const [live, setLive] = useState('');

  const data = ALARMS[alarm];
  const perAlarm = CRISIS_ROOM.seconds[g.level];
  const frozen = Boolean(seed);

  useEffect(() => {
    log('mount', { frame, level: g.level, mode: g.mode, alarm: alarm + 1, perAlarm, phase });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { busy, send } = useServerMove({
    call: submitAlarm,
    onResult: (verdict) => {
      log('verdict', verdict.handled ? 'handled' : 'not handled');
      setResults((prev) => [...prev, verdict]);
      setPhase('review');
      setLive(verdict.title);
    },
  });

  const timedOut = useCallback(() => {
    log('clock reached 0 → time up');
    g.openModal('timeup');
  }, [g]);
  const clock = useGameClock({
    start: seed?.seconds ?? perAlarm,
    direction: 'down',
    running: !frozen && phase === 'play' && !busy && !g.modal,
    onEnd: timedOut,
  });

  const locked = phase !== 'play' || busy;
  const calls = data.calls;
  const { order, setOrder, toggle, move, rows } = useCallOrder({
    initial: seed?.order ?? [],
    calls,
    people: data.people,
    locked,
    say: setLive,
  });

  const handledCount = results.filter((r) => r.handled).length;
  const ready = order.length === calls && message !== null && phase === 'play' && !busy;

  const lockIn = () => {
    if (!ready) return;
    log('lock in', { alarm: alarm + 1, order, message });
    send({ alarm, order, message });
  };

  const last = alarm === CRISIS_ROOM.total - 1;
  const finishRun = (finalResults) => {
    const summary = summarise(finalResults);
    log('finish', summary.score);
    g.finish(summary);
  };
  const nextAlarm = () => {
    if (last) {
      finishRun(results);
      return;
    }
    log('next alarm', alarm + 2);
    setAlarm(alarm + 1);
    setOrder([]);
    setMessage(null);
    setPhase('play');
    setShowScored(false);
    clock.reset(perAlarm);
  };

  // Out of time: the unplayed alarms (this one included) count as not handled.
  const padded = [
    ...results,
    ...Array.from({ length: CRISIS_ROOM.total - results.length }, () => ({
      handled: false,
      orderOk: false,
      messageOk: false,
    })),
  ];
  const verdict = phase === 'review' ? results[results.length - 1] : null;

  const footer =
    phase === 'review'
      ? { note: '', action: { label: last ? 'See my result' : 'Next alarm', onClick: nextAlarm } }
      : {
          note: '',
          link: { label: 'How it’s scored', size: 'lg', onClick: () => setShowScored((v) => !v) },
          action: {
            label: busy ? 'Checking…' : 'Lock in my plan',
            onClick: lockIn,
            disabled: !ready,
          },
        };

  return {
    g,
    subtitle: CRISIS_ROOM.subtitle,
    progress: {
      countLabel: `Alarm ${alarm + 1} of ${CRISIS_ROOM.total}`,
      summary: `${handledCount} handled well`,
      dots: dotsFor(results, alarm, phase),
      passMark: `Pass mark: ${CRISIS_ROOM.passMark} of ${CRISIS_ROOM.total}`,
    },
    footer,
    timeUpSummary: `You handled ${handledCount} of ${CRISIS_ROOM.total} alarms before time ran out.`,
    onSeeResult: () => finishRun(padded),
    head: {
      eyebrow: data.eyebrow,
      title: verdict ? verdict.title : data.title,
      body: data.prompt,
      stats: [
        { icon: ServerClockIcon, label: `${clock.label} left` },
        { icon: ServerUsersIcon, label: `${handledCount} of ${results.length} handled` },
      ],
    },
    reads: CRISIS_ROOM.checks,
    scoredNote: showScored && phase === 'play' ? CRISIS_ROOM.scoredNote : null,
    verdict: verdict ? { pill: verdict.pill, explain: verdict.explain } : null,
    rows,
    orderLocked: locked,
    messageLocked: locked,
    toggle,
    move,
    messages: data.messages,
    message,
    pickMessage: (i) => {
      if (!locked) setMessage(i);
    },
    live,
  };
};
