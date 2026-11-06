import { useCallback, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useGameV2Params } from '../gamesV2State.js';
import { ServerClockIcon, ServerUsersIcon } from '../serverGame/ServerGameIcons.jsx';
import { fmtClock, useServerCountdown } from '../chess/chessLive.js';
import { ALARMS, CRISIS_ROOM } from './crisisRoomData.js';
import { useCallOrder } from './useCallOrder.js';

const log = debug('useCrisisRoomLive');

/* Avatar colours only (presentation): the drawn people by id; anyone new gets a colour from the palette. */
const STYLE_BY_ID = Object.fromEntries(
  ALARMS.flatMap((a) => a.people).map((p) => [p.id, { color: p.color, ink: p.ink }])
);
const PALETTE = ['#387440', '#3062d4', '#c8951a', '#6d28d9', '#b4532a'];
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const SCORED_NOTE = 'An alarm counts when both your call order and your first message are right.';

const personOf = (item, i) => {
  const style = STYLE_BY_ID[item.id] ?? { color: PALETTE[i % PALETTE.length], ink: false };
  const name = item.name ?? String(item.id);
  return {
    id: item.id,
    name,
    role: item.role ?? '',
    color: style.color,
    ink: Boolean(style.ink),
    initial: name[0] ?? '?',
  };
};

const verdictOf = ({ orderRes, msgRes, people, round }) => {
  const orderOk = orderRes ? orderRes.correct === true : true;
  const msgOk = msgRes ? msgRes.correct === true : true;
  const handled = msgRes?.roundCorrect ?? orderRes?.roundCorrect ?? false;
  const names = Array.isArray(orderRes?.answer)
    ? orderRes.answer.map((id) => people.find((p) => p.id === id)?.name ?? id).join(' · ')
    : null;
  const letter = Number.isInteger(msgRes?.answer) ? LETTERS[msgRes.answer] : null;
  let pill;
  if (orderOk && msgOk)
    pill = handled
      ? 'Your order and your first message both work.'
      : 'Right plan, but this alarm ran out of time.';
  else if (orderOk)
    pill = `Your order works, but the first message sets the tone.${letter ? ` Message ${letter} was the one to send.` : ''}`;
  else if (msgOk) pill = `Good first message. The order that works: ${names ?? 'see below'}.`;
  else
    pill = `Not quite. The order that works: ${names ?? 'see below'}${letter ? `, then message ${letter}` : ''}.`;
  return {
    title: handled ? 'Handled well.' : 'Not this time.',
    pill,
    explain: msgRes?.explain ?? orderRes?.explain ?? null,
    round,
  };
};

/*
 * useCrisisRoomLive — Crisis Room against the server's scenario engine (backend engines/scenario.js + data/scenarios/crisisRoom.json).
 * Same return shape as useCrisisRoom (the mock), so CrisisRoomBoard draws both.
 *   view.round  { index, total, part, parts: [{ kind: 'order', label, calls, items [{ id, name, role }] },
 *                 { kind: 'choice', label, options [text] }], content { title, prompt }, hintAvailable, timeLeftSec, timeLimitSec }
 *   view.results ['correct' | 'missed', …]
 *   actions      { type: 'answer', value: [ids…] } for the order part, then { type: 'answer', value: <shown option index> }
 *   result       { part, correct, answer } per part; the last part adds { roundCorrect, explain }. The server moves on to the next
 *                alarm at once, so the answered alarm is kept here for the "Why this order" view until "Next alarm".
 * The per-alarm clock is the server's `timeLeftSec`, ticked locally (an alarm answered after it counts as missed on the server).
 */
export const useCrisisRoomLive = (run) => {
  const g = useGameV2Params();
  const v = run.view;
  const [review, setReview] = useState(null); // verdict + the answered round
  const [message, setMessage] = useState(null);
  const [live, setLive] = useState('');
  const [showScored, setShowScored] = useState(false);
  const [sending, setSending] = useState(false);

  const r = review?.round ?? v?.round ?? null;
  const parts = r?.parts ?? [];
  const orderAt = parts.findIndex((p) => p.kind === 'order');
  const choiceAt = parts.findIndex((p) => p.kind === 'choice');
  const orderPart = orderAt >= 0 ? parts[orderAt] : null;
  const choicePart = choiceAt >= 0 ? parts[choiceAt] : null;
  const people = (orderPart?.items ?? []).map(personOf);
  const calls = orderPart?.calls ?? 0;
  const orderSent = orderAt >= 0 && (r?.part ?? 0) > orderAt && !review;

  const phase = review ? 'review' : 'play';
  const busy = sending || run.busy;
  const locked = phase !== 'play' || busy || Boolean(g.modal) || !v?.round;
  const { order, setOrder, toggle, move, rows } = useCallOrder({
    calls,
    people,
    locked: locked || orderSent,
    say: setLive,
  });

  // a new alarm from the server: clear the plan
  const [roundIdx, setRoundIdx] = useState(v?.round?.index ?? -1);
  if (!review && !sending && v?.round && v.round.index !== roundIdx) {
    setRoundIdx(v.round.index);
    setOrder([]);
    setMessage(null);
    setShowScored(false);
  }

  const left = useServerCountdown(
    v?.round?.timeLeftSec,
    run.view,
    phase === 'play' && !g.modal && Boolean(v?.round)
  );

  const results = v?.results ?? [];
  const total = r?.total ?? results.length;
  const handledCount = results.filter((x) => x === 'correct').length;
  const ready =
    phase === 'play' &&
    !busy &&
    (orderSent || !orderPart || order.length === calls) &&
    (!choicePart || message !== null);

  const lockIn = useCallback(async () => {
    if (!ready || !v?.round) return;
    const round = v.round;
    log('lock in', { alarm: round.index + 1, order, message, from: round.part });
    setSending(true);
    let orderRes = null;
    let msgRes = null;
    try {
      for (let i = round.part ?? 0; i < round.parts.length; i += 1) {
        const kind = round.parts[i].kind;
        const value = kind === 'order' ? order : message;
        const res = await run.act({ type: 'answer', value });
        if (!res) return; // offline (the hook re-sends after Try again) or the run ended
        if (res.error) {
          setLive(res.error);
          return;
        }
        if (kind === 'order') orderRes = res.result;
        else msgRes = res.result;
      }
    } finally {
      setSending(false);
    }
    const verdict = verdictOf({ orderRes, msgRes, people, round });
    setReview(verdict);
    setLive(verdict.title);
  }, [ready, v, order, message, run, people]);

  const nextAlarm = useCallback(() => {
    log('next alarm');
    setReview(null);
  }, []);

  const lastAlarm = Boolean(v?.finished);
  let footer;
  if (phase === 'review') {
    footer = lastAlarm
      ? { note: '', action: { label: 'Opening your result…', onClick: () => {}, disabled: true } }
      : { note: '', action: { label: 'Next alarm', onClick: nextAlarm } };
  } else {
    footer = {
      note: '',
      link: { label: 'How it’s scored', size: 'lg', onClick: () => setShowScored((x) => !x) },
      action: { label: busy ? 'Checking…' : 'Lock in my plan', onClick: lockIn, disabled: !ready },
    };
  }

  const index = r?.index ?? 0;
  const dots = Array.from({ length: total }, (_, i) => {
    const label = String(i + 1);
    if (i < results.length) return { state: results[i] === 'correct' ? 'ok' : 'bad', label };
    if (i === results.length && !lastAlarm) return { state: 'now', label };
    return { state: 'todo', label };
  });

  let clockLabel = null;
  if (left !== null) clockLabel = left > 0 ? `${fmtClock(left)} left` : 'Time is up for this alarm';

  return {
    g,
    subtitle: `${CRISIS_ROOM.skill} · ${total} alarms`,
    progress: {
      countLabel: `Alarm ${Math.min(index + 1, total)} of ${total}`,
      summary: `${handledCount} handled well`,
      dots,
      passMark: undefined, // the pass mark is not in the run view
    },
    footer,
    timeUpSummary: `You handled ${handledCount} of ${total} alarms.`,
    onSeeResult: run.submit,
    head: {
      eyebrow: `ALARM ${index + 1} · ${CRISIS_ROOM.skill.toUpperCase()}`,
      title: review ? review.title : (r?.content?.title ?? ''),
      body: r?.content?.prompt ?? '',
      stats: [
        ...(clockLabel && phase === 'play' ? [{ icon: ServerClockIcon, label: clockLabel }] : []),
        { icon: ServerUsersIcon, label: `${handledCount} of ${results.length} handled` },
      ],
    },
    reads: CRISIS_ROOM.checks,
    scoredNote: showScored && phase === 'play' ? SCORED_NOTE : null,
    verdict: review ? { pill: review.pill, explain: review.explain } : null,
    rows,
    orderLocked: locked || orderSent,
    messageLocked: locked,
    toggle,
    move,
    messages: choicePart?.options ?? [],
    message,
    pickMessage: (i) => {
      if (!locked) setMessage(i);
    },
    live,
  };
};
