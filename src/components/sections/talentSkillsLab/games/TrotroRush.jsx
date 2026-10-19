import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import GameCompleteDialog from './personality/PersonalityDialog.jsx';
import GameShell from './personality/PersonalityChrome.jsx';
import {
  PgAlarmClockIcon,
  PgCheckCircleIcon,
  PgCompassIcon,
  PgDragDropVerticalIcon,
  PgWalletIcon,
  PgWarningIcon,
} from './personality/PersonalityIcons.jsx';
import { GameIntro } from './personality/PersonalityParts.jsx';
import { PLAY_ORDER } from './personality/personalityData.js';
import {
  BLOCKS,
  MAP,
  PLACES,
  ROADS,
  TRAFFIC,
  TROTRO,
  clockLabel,
  edgeKey,
  planRoute,
} from './personality/trotroRushData.js';

const log = debug('TrotroRush');

/*
 * Trotro Rush — personality game "Planning" (Figma SL-GP07 Plan your route, Playful 7943:10219 / Focused 8110:497519).
 * Route `/skills-lab/games/trotro-rush?f=GP07`. Props `{ frame }`: GP07 (and no code) = morning 1 in the drawn order.
 * Loop: drag the errand chips (pointer / touch, or Space then arrow keys) -> the green route, "Arrive" time and fare on
 * the map update live; "Start the day" -> morning 2 -> play-style dialog. "Reset route" restores the first order.
 * ⚠️ ASSUMPTION: the route / time / fare model, morning 2 and the dialog copy (see trotroRushData.js).
 * Narrow screens: the map keeps a 720px minimum width inside its own horizontal scroller so the 12px labels stay legible.
 */
const WHITE = '#ffffff';
const INK = '#1c2a21';

const Pill = ({ place, index, style }) => {
  const numbered = index !== undefined;
  return (
    <span
      className={classNames(
        'absolute inline-flex items-center gap-[5.65px] rounded-full border border-solid px-[9.42px] font-sans text-[12.25px] leading-[15px] font-bold whitespace-nowrap',
        'border-[rgba(28,42,33,0.12)] playful:border-[1.41px] playful:border-[#1c2a21]',
        numbered ? 'bg-[#387440] py-[6.5px] text-white' : 'bg-white py-[5.65px] text-[#1c2a21]'
      )}
      style={style}
    >
      {numbered ? (
        <span className="inline-flex size-[19px] items-center justify-center rounded-full bg-[#1c2a21] text-[10.36px] leading-[12px] text-[#c1d4c4] max-lg:text-[12px]">
          {index + 1}
        </span>
      ) : null}
      {place.name}
    </span>
  );
};

const RouteMap = ({ plan }) => {
  const pct = (x, y) => ({ left: `${(x / MAP.w) * 100}%`, top: `${(y / MAP.h) * 100}%` });
  const stop = (id) => PLACES[id];
  return (
    <div className="overflow-x-auto rounded-[22.6px] max-md:border max-md:border-solid max-md:border-[rgba(28,42,33,0.12)]">
      <div
        className="relative aspect-[1040/603] min-w-[720px] overflow-hidden rounded-[22.6px] border border-solid border-[rgba(28,42,33,0.12)] bg-[#fffefc] max-md:border-0"
        role="img"
        aria-label="Map of Accra with your five errands and the route between them"
      >
        <svg
          viewBox={`0 0 ${MAP.w} ${MAP.h}`}
          className="absolute inset-0 size-full"
          aria-hidden="true"
        >
          {BLOCKS.map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="9.42" fill="#edebdb" />
          ))}
          <rect x="0" y={MAP.seaTop} width={MAP.w} height={MAP.h - MAP.seaTop} fill="#d1ebf2" />
          {ROADS.map(([a, b]) => (
            <line
              key={`c${a}${b}`}
              x1={stop(a).x}
              y1={stop(a).y}
              x2={stop(b).x}
              y2={stop(b).y}
              stroke={INK}
              strokeWidth="16.96"
              strokeLinecap="round"
            />
          ))}
          {ROADS.map(([a, b]) => (
            <line
              key={`w${a}${b}`}
              x1={stop(a).x}
              y1={stop(a).y}
              x2={stop(b).x}
              y2={stop(b).y}
              stroke={WHITE}
              strokeWidth="12.25"
              strokeLinecap="round"
            />
          ))}
          {ROADS.filter(([a, b]) => plan.edges.has(edgeKey(a, b))).map(([a, b]) => (
            <line
              key={`g${a}${b}`}
              x1={stop(a).x}
              y1={stop(a).y}
              x2={stop(b).x}
              y2={stop(b).y}
              stroke="#387440"
              strokeWidth="9.42"
              strokeLinecap="round"
            />
          ))}
          <line
            x1={stop(TRAFFIC.road[0]).x}
            y1={stop(TRAFFIC.road[0]).y}
            x2={stop(TRAFFIC.road[1]).x}
            y2={stop(TRAFFIC.road[1]).y}
            stroke="#bf382b"
            strokeWidth="3.77"
            strokeLinecap="round"
            strokeDasharray="1.88 9.42"
          />
          {Object.entries(PLACES).map(([id, p]) => (
            <circle
              key={id}
              cx={p.x}
              cy={p.y}
              r="10.6"
              fill={p.start || p.end ? INK : WHITE}
              stroke={INK}
              strokeWidth="2.83"
            />
          ))}
        </svg>

        {Object.entries(PLACES).map(([id, p]) => (
          <Pill key={id} place={p} index={plan.firstIndex[id]} style={pct(...p.label)} />
        ))}

        <span
          className="absolute inline-flex rotate-[3deg] items-center gap-[5.65px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#f9ebea] px-[11.3px] py-[6.6px] font-sans text-[12.25px] leading-[15px] font-bold whitespace-nowrap text-[#902b20] playful:border-[1.41px] playful:border-[#1c2a21]"
          style={pct(403, 240)}
        >
          <PgWarningIcon className="size-[16px] shrink-0" />
          Traffic at Circle +15 min
        </span>
        <span
          className="absolute inline-flex items-center gap-[5.65px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-white px-[9.42px] py-[5.65px] font-sans text-[11.3px] leading-[13px] font-semibold whitespace-nowrap text-[#1c2a21] max-lg:text-[12px] playful:border-[1.13px] playful:border-[#1c2a21]"
          style={pct(19, 19)}
        >
          <PgCompassIcon className="size-[15px]" />
          Not to scale
        </span>
      </div>
    </div>
  );
};

const Chip = ({
  errand,
  n,
  time,
  place,
  grabbed,
  dragging,
  onGrab,
  onKey,
  refCb,
  onPointerDown,
}) => (
  <li ref={refCb} className="list-none">
    <button
      type="button"
      aria-pressed={grabbed}
      aria-label={`${n}. ${errand.title}${place ? `, ${place.name}` : ''}, done by ${time}. ${grabbed ? 'Grabbed: use the arrow keys to move, Space to drop.' : 'Press Space to move it.'}`}
      onClick={onGrab}
      onKeyDown={onKey}
      onPointerDown={onPointerDown}
      className={classNames(
        'inline-flex min-h-[30px] touch-none cursor-grab items-center gap-[6px] rounded-full border border-solid bg-white px-[12px] py-[6px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap text-[#1c2a21] max-lg:text-[12px]',
        grabbed || dragging
          ? 'border-[#387440] shadow-[0_4px_11px_rgba(56,116,64,0.08)] playful:shadow-[0_6px_16px_rgba(56,116,64,0.16)]'
          : 'border-[rgba(28,42,33,0.12)]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]'
      )}
    >
      <PgDragDropVerticalIcon className="size-[14px] shrink-0 text-[#1c2a21]" />
      <span>
        {n}&nbsp; {errand.title}
        {place ? ` · ${place.short}` : ''} · {time}
      </span>
    </button>
  </li>
);

const TrotroRush = ({ frame }) => {
  const navigate = useNavigate();
  const [morning, setMorning] = useState(0);
  const [order, setOrder] = useState(() => TROTRO.mornings[0].errands.map((e) => e.id));
  const [grabbed, setGrabbed] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [finished, setFinished] = useState(false);
  const itemRefs = useRef({});
  const spec = TROTRO.mornings[morning];
  const errands = order.map((id) => spec.errands.find((e) => e.id === id));
  const plan = planRoute(errands);

  useEffect(() => {
    log('mount', { frame });
  }, [frame]);

  const move = (id, to) =>
    setOrder((list) => {
      const from = list.indexOf(id);
      if (from < 0 || to < 0 || to >= list.length || from === to) return list;
      const next = [...list];
      next.splice(from, 1);
      next.splice(to, 0, id);
      log('reorder', next);
      return next;
    });

  const onKey = (id) => (event) => {
    const at = order.indexOf(id);
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      setGrabbed((g) => (g === id ? null : id));
    } else if (grabbed === id && (event.key === 'ArrowLeft' || event.key === 'ArrowUp')) {
      event.preventDefault();
      move(id, at - 1);
    } else if (grabbed === id && (event.key === 'ArrowRight' || event.key === 'ArrowDown')) {
      event.preventDefault();
      move(id, at + 1);
    } else if (event.key === 'Escape') setGrabbed(null);
  };

  // Pointer drag (mouse and touch): the chip under the pointer decides the new slot.
  const onPointerDown = (id) => (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    setDragging(id);
    const onMove = (e) => {
      const hit = Object.entries(itemRefs.current).find(([, el]) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return (
          e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
        );
      });
      if (hit && hit[0] !== id)
        setOrder((list) => {
          const from = list.indexOf(id);
          const to = list.indexOf(hit[0]);
          if (from < 0 || to < 0) return list;
          const next = [...list];
          next.splice(from, 1);
          next.splice(to, 0, id);
          return next;
        });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      setDragging(null);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  const reset = () => {
    log('reset route');
    setOrder(spec.errands.map((e) => e.id));
    setGrabbed(null);
  };

  const start = () => {
    log('start the day', { morning, order });
    setGrabbed(null);
    if (morning + 1 >= TROTRO.mornings.length) {
      setFinished(true);
      return;
    }
    setMorning(morning + 1);
    setOrder(TROTRO.mornings[morning + 1].errands.map((e) => e.id));
  };

  const restart = () => {
    setMorning(0);
    setOrder(TROTRO.mornings[0].errands.map((e) => e.id));
    setFinished(false);
  };
  const next = () =>
    navigate(
      `/skills-lab/games/${PLAY_ORDER[(PLAY_ORDER.indexOf(TROTRO.gameId) + 1) % PLAY_ORDER.length]}`
    );
  const arcade = () => navigate('/skills-lab?tab=games');

  const total = TROTRO.mornings.length;
  const segments = TROTRO.mornings.map((_, i) =>
    finished || i < morning ? 'done' : i === morning ? 'now' : 'todo'
  );
  const done = finished;

  return (
    <GameShell
      title={TROTRO.title}
      subtitle={done ? TROTRO.doneSubtitle : TROTRO.subtitle}
      sticker={done ? TROTRO.complete.sticker : TROTRO.sticker}
      xp={done ? TROTRO.doneXp : TROTRO.xp}
      progress={{
        label: `Morning ${done ? total : morning + 1} of ${total}`,
        segments,
        note: done ? TROTRO.doneNote : TROTRO.progressNote,
      }}
      footer={
        done
          ? {
              info: TROTRO.doneInfo,
              link: { label: 'Replay', onClick: restart },
              secondary: { label: 'Back to Arcade', onClick: arcade },
              action: { label: 'Play next game', onClick: next },
            }
          : {
              info: TROTRO.info,
              link: { label: 'Reset route', onClick: reset },
              action: { label: 'Start the day', onClick: start },
            }
      }
      overlay={
        done ? (
          <GameCompleteDialog
            result={TROTRO.complete}
            onClose={arcade}
            onSecondary={arcade}
            onPrimary={next}
            onNext={next}
          />
        ) : null
      }
    >
      <GameIntro
        eyebrow={spec.eyebrow}
        title={spec.title}
        body={spec.body}
        stats={[
          { icon: PgAlarmClockIcon, label: '6:45 AM' },
          { icon: PgCheckCircleIcon, label: `Arrive ${clockLabel(plan.arrive)}` },
          { icon: PgWalletIcon, label: `Fare GH₵ ${plan.fare}` },
        ]}
        reads={TROTRO.reads}
      />
      <RouteMap plan={plan} />
      <ol
        aria-label="Errands, in the order you will do them"
        className="m-0 flex flex-wrap gap-[8px] p-0"
      >
        {errands.map((errand, i) => (
          <Chip
            key={errand.id}
            errand={errand}
            n={i + 1}
            time={clockLabel(plan.done[i])}
            place={errand.place ? PLACES[errand.place] : null}
            grabbed={grabbed === errand.id}
            dragging={dragging === errand.id}
            onGrab={() => setGrabbed((g) => (g === errand.id ? null : errand.id))}
            onKey={onKey(errand.id)}
            onPointerDown={onPointerDown(errand.id)}
            refCb={(el) => {
              itemRefs.current[errand.id] = el;
            }}
          />
        ))}
      </ol>
    </GameShell>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES = { 'trotro-rush': TrotroRush };

export default TrotroRush;
