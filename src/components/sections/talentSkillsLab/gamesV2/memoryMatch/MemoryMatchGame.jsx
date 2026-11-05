import { useEffect, useRef, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import GameV2Shell from '../GameV2Shell.jsx';
import { useGameV2Params } from '../gamesV2State.js';
import MemoryMatchCard from './MemoryMatchCard.jsx';
import MemoryMatchFeedback from './MemoryMatchFeedback.jsx';
import MemoryMatchHead from './MemoryMatchHead.jsx';
import { MEMORY_BEST_SO_FAR, MEMORY_COPY, MEMORY_DRAWN_RESULT } from './memoryMatchData.js';
import { useMemoryMatch } from './useMemoryMatch.js';

const log = debug('MemoryMatch');

/*
 * MemoryMatch — Games v2 "Memory Match" (Figma GV-04 Correct, GV-05 Wrong; GV-06 / GV-07 / GV-08 are the shell's dialogs over this
 * board). Really playable: levels (Beginner 3×4 · Intermediate 4×4 · Advanced 4×5 · Expert 5×6), turn counter, pair dots, a
 * countdown (2:00 at Intermediate), feedback pill, flip animation, arrow-key navigation. URL: /skills-lab/play/memory-match
 * [?mode=ranked|practice][&level=…][&f=GV-04|GV-05|GV-06|GV-07|GV-08][&modal=quit|timeup|offline].
 * ⚠️ ASSUMPTION list lives in memoryMatch/memoryMatchData.js (other levels' clocks, extra card faces, scoring).
 */
const CARD = 96; // Figma card edge
const GAP = 12;

/* The strip shows at most 8 dots (the Intermediate board; more would not fit a 320px phone) — ⚠️ ASSUMPTION for Advanced / Expert. */
const stripDots = (found, pairs, done) => {
  const count = Math.min(pairs, 8);
  const dots = Array.from({ length: count }, (_, i) => {
    const need = Math.ceil(((i + 1) * pairs) / count);
    return { state: found >= need ? 'ok' : 'todo', label: String(i + 1) };
  });
  const now = dots.findIndex((d) => d.state === 'todo');
  if (now >= 0 && !done) dots[now] = { ...dots[now], state: 'now' };
  return dots;
};

const MemoryMatchBoard = ({ frame }) => {
  const m = useMemoryMatch(frame);
  const { g, level, cards, found, pairs, turns } = m;
  const [active, setActive] = useState(0);
  const refs = useRef([]);
  const cols = level.cols;

  useEffect(() => {
    log('render state', { cols, rows: level.rows, found, pairs, turns, feedback: m.feedback });
  }, [cols, level.rows, found, pairs, turns, m.feedback]);

  const onKeyDown = (e, id) => {
    const rows = level.rows;
    const r = Math.floor(id / cols);
    const c = id % cols;
    let next = null;
    if (e.key === 'ArrowRight') next = r * cols + Math.min(cols - 1, c + 1);
    else if (e.key === 'ArrowLeft') next = r * cols + Math.max(0, c - 1);
    else if (e.key === 'ArrowDown') next = Math.min(rows - 1, r + 1) * cols + c;
    else if (e.key === 'ArrowUp') next = Math.max(0, r - 1) * cols + c;
    else if (e.key === 'Home') next = r * cols;
    else if (e.key === 'End') next = r * cols + cols - 1;
    if (next === null) return;
    e.preventDefault();
    log('arrow focus', { from: id, to: next });
    setActive(next);
    refs.current[next]?.focus();
  };

  const progress = {
    countLabel: `${found} of ${pairs} pairs`,
    summary: `${turns} turn${turns === 1 ? '' : 's'} so far`,
    dots: stripDots(found, pairs, m.done),
    passMark: g.ranked ? `Best so far: ${MEMORY_BEST_SO_FAR}` : undefined,
  };

  /* Footer as drawn: GV-04/05 note + "How to play"; GV-06 only the link; GV-07 / GV-08 empty. */
  const footer =
    g.modal === 'timeup' || g.modal === 'offline'
      ? { note: '' }
      : g.modal === 'quit'
        ? { note: '', link: { label: 'How to play', onClick: () => g.update({ help: '1' }) } }
        : { link: { label: 'How to play', onClick: () => g.update({ help: '1' }) } };

  return (
    <GameV2Shell
      name={MEMORY_COPY.name}
      subtitleLead={`Working memory · ${level.cards} cards`}
      progress={progress}
      footer={footer}
      timeUp={{ summary: `You found ${found} of ${pairs} pairs in ${turns} turns.` }}
      onSeeResult={m.seeResult}
    >
      <MemoryMatchHead
        kicker={`${level.label.toUpperCase()} · ${level.cards} CARDS`}
        timeLabel={m.timeLabel}
        pairsLabel={`${found} of ${pairs} pairs`}
      />
      <div
        className={`mx-auto mt-[2px] flex w-full flex-col items-center transition-opacity ${m.paused ? 'opacity-45' : ''}`}
      >
        <div
          role="group"
          aria-label={`Memory cards, ${cols} by ${level.rows}`}
          className="grid w-full gap-[clamp(6px,2.4vw,12px)]"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            maxWidth: `${cols * CARD + (cols - 1) * GAP}px`,
          }}
        >
          {cards.map((card) => (
            <MemoryMatchCard
              key={card.id}
              ref={(el) => {
                refs.current[card.id] = el;
              }}
              card={card}
              row={Math.floor(card.id / cols) + 1}
              col={(card.id % cols) + 1}
              tabbable={card.id === active}
              dimmed={m.paused || m.done}
              onFlip={(id) => {
                setActive(id);
                m.flip(id);
              }}
              onKeyDown={onKeyDown}
            />
          ))}
        </div>
        <MemoryMatchFeedback kind={m.feedback} />
      </div>
    </GameV2Shell>
  );
};

const MemoryMatchGame = ({ frame }) => {
  const g = useGameV2Params();
  /* a new run (level / mode / seed changed) starts from scratch */
  return <MemoryMatchBoard key={`${g.level}-${g.mode}-${frame ?? ''}`} frame={frame} />;
};

export default MemoryMatchGame;
