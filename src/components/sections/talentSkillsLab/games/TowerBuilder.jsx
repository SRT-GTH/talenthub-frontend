import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import GameCompleteDialog from './personality/PersonalityDialog.jsx';
import GameShell from './personality/PersonalityChrome.jsx';
import { PgMouseIcon, PgRepeatIcon, PgTrendUpIcon } from './personality/PersonalityIcons.jsx';
import { GameIntro } from './personality/PersonalityParts.jsx';
import { PLAY_ORDER } from './personality/personalityData.js';
import {
  COLORS,
  TOWER,
  TRAY,
  UNIT,
  landingRow,
  touchesSame,
  towerHeight,
} from './personality/towerBuilderData.js';

const log = debug('TowerBuilder');

/*
 * Tower Builder — personality game "Logic" (Figma SL-GP10 New rule, Playful 7943:10911 / Focused 8110:497813).
 * Route `/skills-lab/games/tower-builder?f=GP10`. Props `{ frame }`: GP10 = level 2, the drawn 5-row tower, a blue block being
 * dragged over the ghost slot (Height 6 of 10, 7 moves left); none = level 1, empty board.
 * Loop: pick up a tray block (drag it, or click it then click / arrow-key the board), "Place block" (Enter) drops it
 * on whatever is below; the level rule (e.g. no two yellow blocks touching) rejects a bad drop; "Undo" is free; the level
 * ends at the target height or when moves run out; after level 3 the play-style dialog opens.
 * ⚠️ ASSUMPTION: levels 1 and 3, the placement model and the dialog (see towerBuilderData.js).
 * Narrow screens: the board keeps a 720px minimum width inside its own horizontal scroller.
 */
const cq = (px) => `${((px * 100) / 1040).toFixed(3)}cqw`;
const MAX_UNITS = 1040 / UNIT;
const INK = '#1c2a21';

const Block = ({ block, ghost, style }) => (
  <span
    aria-hidden="true"
    className={classNames('absolute box-border rounded-[5.65px]', ghost ? 'border-dashed' : '')}
    style={{
      left: `calc(${block.x} * ${cq(UNIT)})`,
      bottom: `calc(${cq(57)} + ${block.row} * ${cq(UNIT)})`,
      width: `calc(${block.w} * ${cq(UNIT)})`,
      height: cq(UNIT),
      background: COLORS[block.color],
      border: `1.88px ${ghost ? 'dashed' : 'solid'} ${INK}`,
      ...style,
    }}
  />
);

const TowerBuilder = ({ frame }) => {
  const navigate = useNavigate();
  const seeded = frame === 'GP10';
  const [level, setLevel] = useState(seeded ? 1 : 0);
  const spec = TOWER.levels[level];
  const [blocks, setBlocks] = useState(seeded ? TOWER.levels[1].tower : []);
  const [history, setHistory] = useState([]);
  const [moves, setMoves] = useState(spec.moves);
  const [held, setHeld] = useState(seeded ? 2 : null); // tray index
  const [ghostX, setGhostX] = useState(seeded ? 9 : null);
  const [drag, setDrag] = useState(seeded ? { x: 669, y: 193 } : null);
  const [rejected, setRejected] = useState(false);
  const [finished, setFinished] = useState(false);
  const boardRef = useRef(null);
  const total = TOWER.levels.length;

  useEffect(() => {
    log('mount', { frame });
  }, [frame]);

  const heldItem = held === null ? null : TRAY[held];
  const ghostRow = heldItem && ghostX !== null ? landingRow(blocks, ghostX, heldItem.w) : null;
  const heightShown = Math.max(towerHeight(blocks), ghostRow === null ? 0 : ghostRow + 1);

  const toBoard = (event) => {
    const r = boardRef.current.getBoundingClientRect();
    return {
      x: ((event.clientX - r.left) / r.width) * 1040,
      y: ((event.clientY - r.top) / r.height) * 603,
    };
  };
  const clampX = (px, w) =>
    Math.min(MAX_UNITS - w, Math.max(0, Math.round((px / UNIT - w / 2) * 2) / 2));

  const nextLevel = () => {
    if (level + 1 >= total) {
      setFinished(true);
      return;
    }
    const n = level + 1;
    setLevel(n);
    setBlocks(TOWER.levels[n].tower);
    setHistory([]);
    setMoves(TOWER.levels[n].moves);
    setHeld(null);
    setGhostX(null);
  };

  const place = () => {
    if (!heldItem || ghostX === null) return;
    const block = { color: heldItem.color, x: ghostX, w: heldItem.w, row: ghostRow };
    if (spec.rule.color && touchesSame(blocks, block) && block.color === spec.rule.color) {
      log('rule broken', block);
      setRejected(true);
      setTimeout(() => setRejected(false), 1400);
      setHeld(null);
      setGhostX(null);
      return;
    }
    const nextBlocks = [...blocks, block];
    log('place', block);
    setHistory((h) => [...h, blocks]);
    setBlocks(nextBlocks);
    setHeld(null);
    setGhostX(null);
    setDrag(null);
    const left = moves - 1;
    setMoves(left);
    if (towerHeight(nextBlocks) >= spec.target || left <= 0) nextLevel();
  };

  const undo = () => {
    if (held !== null || ghostX !== null) {
      setHeld(null);
      setGhostX(null);
      setDrag(null);
      return;
    }
    if (!history.length) return;
    setBlocks(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
    setMoves((m) => m + 1);
  };

  const onTrayDown = (index) => (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    setHeld(index);
    setDrag(toBoard(event));
    const w = TRAY[index].w;
    const onMove = (e) => {
      const p = toBoard(e);
      setDrag(p);
      setGhostX(clampX(p.x, w));
    };
    const onUp = (e) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      const p = toBoard(e);
      setDrag(null);
      if (p.x < 0 || p.x > 1040 || p.y < 0 || p.y > 603) setGhostX((g) => g);
      else setGhostX(clampX(p.x, w));
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  const onBoardClick = (event) => {
    if (!heldItem) return;
    setGhostX(clampX(toBoard(event).x, heldItem.w));
  };

  const onBoardKey = (event) => {
    if (!heldItem) return;
    const step = event.key === 'ArrowLeft' ? -0.5 : event.key === 'ArrowRight' ? 0.5 : 0;
    if (step) {
      event.preventDefault();
      setGhostX((g) => Math.min(MAX_UNITS - heldItem.w, Math.max(0, (g ?? 9) + step)));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      place();
    }
  };

  const restart = () => {
    setLevel(0);
    setBlocks([]);
    setHistory([]);
    setMoves(TOWER.levels[0].moves);
    setHeld(null);
    setGhostX(null);
    setFinished(false);
  };
  const next = () =>
    navigate(
      `/skills-lab/games/${PLAY_ORDER[(PLAY_ORDER.indexOf(TOWER.gameId) + 1) % PLAY_ORDER.length]}`
    );
  const arcade = () => navigate('/skills-lab?tab=games');
  const done = finished;
  const segments = TOWER.levels.map((_, i) =>
    done || i < level ? 'done' : i === level ? 'now' : 'todo'
  );
  const targetBottom = 57 + spec.target * UNIT; // px from the board bottom

  return (
    <GameShell
      title={TOWER.title}
      subtitle={done ? TOWER.doneSubtitle : TOWER.subtitle}
      sticker={done ? TOWER.complete.sticker : spec.sticker}
      xp={done ? TOWER.doneXp : TOWER.xp}
      progress={{
        label: `Level ${done ? total : level + 1} of ${total}`,
        segments,
        note: done ? TOWER.doneNote : TOWER.progressNote,
      }}
      footer={
        done
          ? {
              info: TOWER.doneInfo,
              link: { label: 'Replay', onClick: restart },
              secondary: { label: 'Back to Arcade', onClick: arcade },
              action: { label: 'Play next game', onClick: next },
            }
          : {
              info: TOWER.info,
              link: { label: 'Undo', onClick: undo },
              action: {
                label: 'Place block',
                onClick: place,
                disabled: !heldItem || ghostX === null,
              },
            }
      }
      overlay={
        done ? (
          <GameCompleteDialog
            result={TOWER.complete}
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
          { icon: PgRepeatIcon, label: `${moves} moves left` },
          { icon: PgTrendUpIcon, label: `Height ${heightShown} of ${spec.target}` },
        ]}
        reads={TOWER.reads}
      />
      <div className="overflow-x-auto rounded-[22.6px] max-md:border max-md:border-solid max-md:border-[rgba(28,42,33,0.12)]">
        <div
          ref={boardRef}
          role="application"
          tabIndex={0}
          aria-label="Tower board. Pick a block, then use the left and right arrow keys to line it up and Enter to place it."
          onClick={onBoardClick}
          onKeyDown={onBoardKey}
          className="@container relative aspect-[1040/603] min-w-[720px] touch-none overflow-hidden rounded-[22.6px] border border-solid border-[rgba(28,42,33,0.12)] bg-[#fffefc] max-md:border-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          style={{ containerType: 'inline-size' }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(28,42,33,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(28,42,33,0.06) 1px, transparent 1px)',
              backgroundSize: `${cq(UNIT)} ${cq(UNIT)}`,
            }}
          />
          <span
            aria-hidden="true"
            className="absolute right-0 bottom-0 left-0 bg-[#387440]"
            style={{ height: cq(57) }}
          />
          {blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
          {heldItem && ghostX !== null ? (
            <Block ghost block={{ color: 'green', x: ghostX, w: heldItem.w, row: ghostRow }} />
          ) : null}
          {drag && heldItem ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute z-[2] rotate-[8deg] rounded-[5.65px]"
              style={{
                left: cq(drag.x - (heldItem.w * UNIT) / 2),
                top: cq(drag.y - UNIT / 2),
                width: cq(heldItem.w * UNIT),
                height: cq(UNIT),
                background: COLORS[heldItem.color],
                border: `1.88px solid ${INK}`,
              }}
            />
          ) : null}
          {drag ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute z-[2] inline-flex items-center gap-[3.77px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-white px-[7.5px] py-[4.7px] font-sans text-[11.3px] leading-[13px] font-bold whitespace-nowrap text-[#1c2a21] max-lg:text-[12px] playful:border-[1.13px] playful:border-[#1c2a21]"
              style={{ left: cq(drag.x + 100), top: cq(drag.y - 55) }}
            >
              <PgMouseIcon className="size-[13px]" />
              Dragging
            </span>
          ) : null}

          <span
            aria-hidden="true"
            className="absolute right-0 left-0 h-[2px] bg-[#bf382b]"
            style={{ bottom: cq(targetBottom) }}
          />
          <span
            aria-hidden="true"
            className="absolute inline-flex items-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#f9ebea] px-[11.3px] py-[2.83px] font-sans text-[11.3px] leading-[13px] font-semibold whitespace-nowrap text-[#902b20] max-lg:text-[12px] playful:border-[1.41px] playful:border-[#1c2a21]"
            style={{ right: cq(101), bottom: `calc(${cq(targetBottom)} - 22px)` }}
          >
            Target height
          </span>

          <div
            className="absolute flex flex-col items-center gap-[5.65px] rounded-[15px] border border-solid border-[rgba(28,42,33,0.12)] bg-white p-[11.3px] font-sans playful:border-[1.41px] playful:border-[#1c2a21]"
            style={{ left: cq(38), top: cq(38), width: cq(63) }}
          >
            <span className="text-[10.36px] leading-[12px] font-bold text-[#595959] max-lg:text-[12px]">
              HEIGHT
            </span>
            <span className="font-sans text-[32px] leading-[38px] font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading">
              {heightShown}
            </span>
            <span className="text-[12.25px] leading-[15px] font-semibold text-[#595959]">
              of {spec.target}
            </span>
          </div>

          <div
            className={classNames(
              '-rotate-[3deg] absolute flex flex-col gap-[5.65px] rounded-[17px] border border-solid border-[rgba(28,42,33,0.12)] bg-[#ffd86b] px-[17px] py-[13px] font-sans',
              rejected ? 'ring-2 ring-[#bf382b]' : ''
            )}
            style={{ left: cq(735), top: cq(324), width: cq(287) }}
          >
            <span className="text-[10.36px] leading-[12px] font-bold text-[#1c2a21] max-lg:text-[12px]">
              NEW RULE
            </span>
            <span className="text-[16.96px] leading-[21px] font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading">
              {spec.rule.text}
            </span>
          </div>

          <div
            className="absolute flex items-center gap-[13px] rounded-[17px] border border-solid border-[rgba(28,42,33,0.12)] bg-white px-[15px] py-[11px] font-sans"
            style={{ left: cq(38), bottom: cq(60) }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[12.25px] leading-[15px] font-bold text-[#595959] max-lg:text-[12px]">
              Tray
            </span>
            {TRAY.map((item, i) => (
              <button
                key={item.color}
                type="button"
                aria-label={`${item.color} block, ${item.w} wide`}
                aria-pressed={held === i}
                onPointerDown={onTrayDown(i)}
                onClick={() => {
                  setHeld(i);
                  setDrag(null);
                  setGhostX((g) => g ?? 9);
                }}
                className={classNames(
                  'block cursor-grab rounded-[3.77px] border border-solid border-[rgba(28,42,33,0.12)] p-0 playful:border-[1.41px] playful:border-[#1c2a21]',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]'
                )}
                style={{ width: item.w * 28.3, height: 28.3, background: COLORS[item.color] }}
              />
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES = { 'tower-builder': TowerBuilder };

export default TowerBuilder;
