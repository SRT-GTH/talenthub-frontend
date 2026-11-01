import { useRef, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { FOCUS_RING } from '../../labPlayStyles.js';
import { ThreeInARowO, ThreeInARowX } from './ThreeInARowPieces.jsx';

const log = debug('ThreeInARowBoard');

/*
 * ThreeInARowBoard — the 3×3 board (Figma "board" 9619:62640: 413×413 Playful / 410 Focused, padding 16, gap 12; cell 118, radius 20 / 16).
 * Cells are buttons: tap, or arrow keys to move and Enter / Space to play (roving tab stop).
 *   `taken`  the occupied cell the player just tapped (red tint, 2.5px red border)
 *   `win`    the three winning cells (filled green for X, gold for O; piece turns white)
 *   `hover`  forces the hover look (empty cell: green 2.5px border + 30 % ghost X) — TR-01 draws it on the last cell
 */
const CELL =
  'group relative flex aspect-square min-w-0 cursor-pointer items-center justify-center rounded-[16px] border border-solid p-0 playful:rounded-[20px]';
const CELL_IDLE =
  'border-[#dee5e0] bg-white playful:border-[rgba(28,42,33,0.35)] playful:shadow-[inset_0_4px_0_rgba(28,42,33,0.12)]';
const GHOST = 'opacity-0 group-hover:opacity-30 group-focus-visible:opacity-30';

const ThreeInARowBoard = ({ board, taken, win, hover, interactive, onPlay }) => {
  const refs = useRef([]);
  const [roving, setRoving] = useState(4);

  const onKeyDown = (e, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const move = {
      ArrowLeft: [row, (col + 2) % 3],
      ArrowRight: [row, (col + 1) % 3],
      ArrowUp: [(row + 2) % 3, col],
      ArrowDown: [(row + 1) % 3, col],
    }[e.key];
    if (!move) return;
    e.preventDefault();
    const target = move[0] * 3 + move[1];
    log('arrow', e.key, index, '→', target);
    setRoving(target);
    refs.current[target]?.focus();
  };

  return (
    <div
      role="group"
      aria-label="Three in a Row board"
      className="grid w-[min(410px,100%)] grid-cols-3 gap-[clamp(6px,2.4vw,12px)] rounded-[22px] bg-[#f2f5f4] p-[clamp(10px,3vw,16px)] playful:w-[min(413px,100%)] playful:rounded-[28px] playful:border-[1.5px] playful:border-solid playful:border-[rgba(28,42,33,0.55)] playful:bg-[#e9d9b8] playful:shadow-[0_6px_0_#7a5a2e]"
    >
      {board.map((mark, i) => {
        const inWin = Boolean(win?.includes(i));
        const isTaken = taken === i;
        const empty = !mark;
        const forced = hover === i && empty;
        let tone = CELL_IDLE;
        if (inWin)
          tone = `border-[rgba(28,42,33,0.35)] ${mark === 'X' ? 'bg-[#387440]' : 'bg-[#e0a526]'}`;
        else if (isTaken) tone = 'border-[2.5px] border-[#c73326] bg-[#fcebe8]';
        else if (forced) tone = 'border-[2.5px] border-[#387440] bg-white';
        else if (empty && interactive)
          tone = `${CELL_IDLE} hover:border-[2.5px] hover:border-[#387440] focus-visible:border-[2.5px] focus-visible:border-[#387440]`;
        const label = `Square ${i + 1}, ${mark === 'X' ? 'your X' : mark === 'O' ? "Kwaku's O" : 'empty'}${
          isTaken ? ', taken' : ''
        }`;
        return (
          <button
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            tabIndex={roving === i ? 0 : -1}
            aria-label={label}
            data-cell={i}
            data-mark={mark ?? ''}
            onFocus={() => setRoving(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            onClick={() => onPlay(i)}
            className={`${CELL} ${tone} ${FOCUS_RING}`}
          >
            {mark === 'X' ? (
              <ThreeInARowX fill={inWin ? '#ffffff' : '#387440'} className="w-[68.6%]" />
            ) : null}
            {mark === 'O' ? (
              <ThreeInARowO fill={inWin ? '#ffffff' : '#e0a526'} className="w-[68.6%]" />
            ) : null}
            {empty ? (
              <ThreeInARowX
                className={`w-[68.6%] ${forced ? 'opacity-30' : interactive ? GHOST : 'opacity-0'}`}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
};

export default ThreeInARowBoard;
