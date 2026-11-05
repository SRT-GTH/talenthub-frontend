import { useCallback, useEffect, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import CrisisRoomMessage from '../crisisRoom/CrisisRoomMessage.jsx';
import CrisisRoomPerson from '../crisisRoom/CrisisRoomPerson.jsx';
import CrisisRoomWhy from '../crisisRoom/CrisisRoomWhy.jsx';
import {
  ALARMS,
  CRISIS_ROOM,
  judgeAlarm,
  submitAlarm,
  summarise,
} from '../crisisRoom/crisisRoomData.js';
import GameV2Shell from '../GameV2Shell.jsx';
import { useGameV2Params } from '../gamesV2State.js';
import { useGameClock } from '../useGameClock.js';
import { ServerClockIcon, ServerUsersIcon } from '../serverGame/ServerGameIcons.jsx';
import ServerGameHead from '../serverGame/ServerGameHead.jsx';
import { useServerMove } from '../serverGame/useServerMove.js';

const log = debug('CrisisRoom');

/*
 * Crisis Room (Games v2, "server" game) — Figma CR-01 Order and choose (Playful 9623:64964 / Focused 9623:67359) and CR-02 Why this
 * order, after the round (9623:65408 / 9623:67669). Route `/skills-lab/play/crisis-room[?f=CR-01|CR-02]`.
 * Loop: per alarm put the people in call order (tap to add / remove, ↑ ↓ or ArrowUp / ArrowDown to reorder), pick the first
 * message, "Lock in my plan" → the mock server checks it ("Checking…") → the "Why this order" view → "Next alarm". After alarm 4
 * "See my result" calls g.finish(). The clock counts down per alarm; at 0:00 `?modal=timeup` opens. A failed check opens
 * `?modal=offline` and is re-sent on Retry (see serverGame/useServerMove.js).
 * `?f=CR-01` boots alarm 2 with the drawn plan (clock 4:12 frozen); `?f=CR-02` boots the explanation (3:20 frozen).
 */
const LETTERS = ['A', 'B', 'C'];
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

const CrisisRoom = ({ frame }) => {
  const g = useGameV2Params();
  const seed = seedFor(frame);
  const [alarm, setAlarm] = useState(seed?.alarm ?? 0);
  const [results, setResults] = useState(seed?.results ?? []);
  const [order, setOrder] = useState(seed?.order ?? []);
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
      log('verdict', verdict.handled ? 'handled' : 'not handled', {
        orderOk: verdict.orderOk,
        messageOk: verdict.messageOk,
      });
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

  const handledCount = results.filter((r) => r.handled).length;
  const calls = data.calls;
  const ready = order.length === calls && message !== null && phase === 'play' && !busy;
  const locked = phase !== 'play' || busy;

  const toggle = (id) => {
    if (locked) return;
    setOrder((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= calls) {
        log('order full', { calls });
        setLive(`You can call ${calls} people. Take one out first.`);
        return prev;
      }
      return [...prev, id];
    });
  };
  const move = (id, dir) => {
    if (locked) return;
    setOrder((prev) => {
      const at = prev.indexOf(id);
      const to = at + dir;
      if (at < 0 || to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      [next[at], next[to]] = [next[to], next[at]];
      log('reorder', next);
      setLive(`${data.people.find((p) => p.id === id).name} is now number ${to + 1}.`);
      return next;
    });
  };

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

  const rows = [
    ...order.map((id) => data.people.find((p) => p.id === id)),
    ...data.people.filter((p) => !order.includes(p.id)),
  ];

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

  return (
    <GameV2Shell
      name={CRISIS_ROOM.name}
      subtitleLead={CRISIS_ROOM.subtitle}
      subtitle={CRISIS_ROOM.subtitle}
      progress={{
        countLabel: `Alarm ${alarm + 1} of ${CRISIS_ROOM.total}`,
        summary: `${handledCount} handled well`,
        dots: dotsFor(results, alarm, phase),
        passMark: `Pass mark: ${CRISIS_ROOM.passMark} of ${CRISIS_ROOM.total}`,
      }}
      footer={footer}
      timeUp={{
        summary: `You handled ${handledCount} of ${CRISIS_ROOM.total} alarms before time ran out.`,
      }}
      onSeeResult={() => finishRun(padded)}
    >
      <ServerGameHead
        eyebrow={data.eyebrow}
        title={verdict ? verdict.title : data.title}
        body={data.prompt}
        stats={[
          { icon: ServerClockIcon, label: `${clock.label} left` },
          {
            icon: ServerUsersIcon,
            label: `${handledCount} of ${results.length} handled`,
          },
        ]}
        readLabel="Measures"
        reads={CRISIS_ROOM.checks}
      />
      {showScored && phase === 'play' ? (
        <p
          role="note"
          className="m-0 rounded-[16px] border border-solid border-[rgba(28,42,33,0.12)] bg-white px-[16px] py-[12px] font-sans text-[14px] leading-[21px] text-[#1c2a21]"
        >
          {CRISIS_ROOM.scoredNote}
        </p>
      ) : null}
      {verdict ? <CrisisRoomWhy pill={verdict.pill} explain={verdict.explain} /> : null}
      <div className="grid gap-[20px] lg:grid-cols-2">
        <section aria-label="Who do you call first?" className="flex min-w-0 flex-col gap-[20px]">
          <h3 className="m-0 font-sans text-[11.5px] leading-[14px] font-bold tracking-[0.69px] text-[#387440] uppercase max-lg:text-[12px]">
            Who do you call first? Drag to order
          </h3>
          <ul className="m-0 flex list-none flex-col gap-[20px] p-0">
            {rows.map((person) => {
              const position = order.indexOf(person.id);
              return (
                <CrisisRoomPerson
                  key={person.id}
                  person={person}
                  position={position}
                  last={position === order.length - 1}
                  locked={locked}
                  onToggle={toggle}
                  onMove={move}
                />
              );
            })}
          </ul>
        </section>
        <section
          aria-label="Your first message to the team"
          className="flex min-w-0 flex-col gap-[20px] lg:self-center"
        >
          <h3 className="m-0 font-sans text-[11.5px] leading-[14px] font-bold tracking-[0.69px] text-[#387440] uppercase max-lg:text-[12px]">
            Your first message to the team
          </h3>
          <div
            role="radiogroup"
            aria-label="Your first message"
            className="flex flex-col gap-[20px]"
          >
            {data.messages.map((text, i) => (
              <CrisisRoomMessage
                key={LETTERS[i]}
                letter={LETTERS[i]}
                text={text}
                picked={message === i}
                locked={locked}
                onPick={() => {
                  log('message', LETTERS[i]);
                  if (!locked) setMessage(i);
                }}
              />
            ))}
          </div>
        </section>
      </div>
      <span className="sr-only" aria-live="polite" role="status">
        {live}
      </span>
    </GameV2Shell>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2 = { 'crisis-room': CrisisRoom };

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES_V2_META = {
  'crisis-room': {
    name: CRISIS_ROOM.name,
    subtitleLead: CRISIS_ROOM.subtitle,
    // ⚠️ ASSUMPTION: the strip above the result card shows the last alarm, all dots done.
    resultProgress: {
      countLabel: `Alarm ${CRISIS_ROOM.total} of ${CRISIS_ROOM.total}`,
      summary: 'All alarms checked',
      dots: Array.from({ length: CRISIS_ROOM.total }, (_, i) => ({
        state: 'ok',
        label: String(i + 1),
      })),
      passMark: `Pass mark: ${CRISIS_ROOM.passMark} of ${CRISIS_ROOM.total}`,
    },
  },
};

export default CrisisRoom;
