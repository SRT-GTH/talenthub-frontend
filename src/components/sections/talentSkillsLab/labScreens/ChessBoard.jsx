import { classNames } from '../../../../utils/classNames.js';
import {
  BlackKing,
  BlackPawn,
  BlackRook,
  WhiteKing,
  WhitePawn,
  WhiteRook,
} from './ChessPieces.jsx';

/*
 * ChessBoard — the green board of the Strategic thinking lab (Figma SL-L18a 7851:13428, 496x512: dark green gradient frame, 8x8
 * squares of 60px starting 5px in, coordinate letters under it; the rank numbers sit outside the clipped frame in Figma, so they
 * are not drawn). Everything is positioned in % of the 496x512 frame so the board scales fluidly.
 *   pieces   [{ sq, c, t }]       selected  'e1'          dots  ['e2', …] legal-move dots
 *   marks    [{ sq, color }]      arrow     { from, to }   onSquare(sq) when interactive
 */
const FILES = 'abcdefgh';
const W = 496;
const H = 512;
const center = (sq) => {
  const col = FILES.indexOf(sq[0]);
  const row = 8 - Number(sq[1]);
  return { x: 5 + 60 * col + 30, y: 5 + 60 * row + 30 };
};
const boxStyle = (sq) => {
  const col = FILES.indexOf(sq[0]);
  const row = 8 - Number(sq[1]);
  return {
    left: `${((5 + 60 * col) / W) * 100}%`,
    top: `${((5 + 60 * row) / H) * 100}%`,
    width: `${(60 / W) * 100}%`,
    height: `${(60 / H) * 100}%`,
  };
};

const ART = {
  wk: WhiteKing,
  wr: WhiteRook,
  wp: WhitePawn,
  bk: BlackKing,
  br: BlackRook,
  bp: BlackPawn,
};
const NAMES = { k: 'king', r: 'rook', p: 'pawn' };
// Black king art is the raw 37x44 group in Figma; the others sit in 56x56 frames.
const PIECE_W = { bk: 37 };

const Arrow = ({ from, to }) => {
  const a = center(from);
  const b = center(to);
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const ux = (b.x - a.x) / len;
  const uy = (b.y - a.y) / len;
  // Figma "Hint arrow": 8px amber line, open 45° heads at both ends, 85% opacity.
  const head = (tip, dir) => {
    const hx = tip.x - ux * dir * 23;
    const hy = tip.y - uy * dir * 23;
    return `M${hx - uy * 23} ${hy + ux * 23} L${tip.x} ${tip.y} L${hx + uy * 23} ${hy - ux * 23}`;
  };
  const pad = 4;
  const start = { x: a.x + ux * pad, y: a.y + uy * pad };
  const end = { x: b.x - ux * pad, y: b.y - uy * pad };
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full"
    >
      <g
        fill="none"
        stroke="#c8951a"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      >
        <path d={`M${start.x} ${start.y} L${end.x} ${end.y}`} />
        <path d={head(end, 1)} />
        <path d={head(start, -1)} />
      </g>
    </svg>
  );
};

const ChessBoard = ({ pieces, selected, dots = [], marks = [], arrow, onSquare, interactive }) => {
  const squares = [];
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const sq = `${FILES[col]}${8 - row}`;
      squares.push({ sq, light: (row + col) % 2 === 0 });
    }
  }
  return (
    <div
      role="group"
      aria-label="Chess board"
      className="relative aspect-[496/512] w-full max-w-[496px] rounded-[3px] bg-[linear-gradient(135deg,#142916_0%,#2a5730_100%)] shadow-[inset_0_-1px_3px_rgba(0,0,0,0.4),inset_0_2px_8px_rgba(0,0,0,0.6)]"
    >
      <span
        aria-hidden="true"
        className="absolute border border-solid border-[rgba(28,42,33,0.6)] shadow-[inset_0_0_0_2px_rgba(255,255,255,0.04),inset_0_0_40px_1px_rgba(0,0,0,0.15)]"
        style={{
          left: `${(4 / W) * 100}%`,
          top: `${(4 / H) * 100}%`,
          width: `${(488 / W) * 100}%`,
          height: `${(482 / H) * 100}%`,
        }}
      />
      {squares.map(({ sq, light }) => {
        const piece = pieces.find((p) => p.sq === sq);
        const label = `${sq}${piece ? `, ${piece.c === 'w' ? 'white' : 'black'} ${NAMES[piece.t]}` : ''}`;
        const Tag = interactive ? 'button' : 'div';
        return (
          <Tag
            key={sq}
            {...(interactive
              ? { type: 'button', onClick: () => onSquare?.(sq), 'aria-label': label }
              : {})}
            className={classNames(
              'absolute m-0 border-0 p-0',
              light ? 'bg-[#e6cb85]' : 'bg-[#2f5d37]',
              interactive
                ? 'cursor-pointer focus-visible:z-[5] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white'
                : ''
            )}
            style={boxStyle(sq)}
            data-sq={sq}
          />
        );
      })}
      {selected ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bg-[#ffd86b]/75"
          style={boxStyle(selected)}
        />
      ) : null}
      {marks.map((m) => (
        <span
          key={`${m.sq}-${m.color}`}
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ ...boxStyle(m.sq), background: m.color }}
        />
      ))}
      {pieces.map((p) => {
        const key = `${p.c}${p.t}`;
        const Art = ART[key];
        const w = PIECE_W[key] ?? 56;
        const c = center(p.sq);
        return (
          <span
            key={`${key}-${p.sq}`}
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{
              left: `${((c.x - w / 2) / W) * 100}%`,
              top: `${((c.y - (key === 'bk' ? 22 : 28)) / H) * 100}%`,
              width: `${(w / W) * 100}%`,
            }}
          >
            <Art className="block h-auto w-full" />
          </span>
        );
      })}
      {dots.map((sq) => {
        const c = center(sq);
        return (
          <span
            key={`dot-${sq}`}
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full bg-[rgba(11,26,15,0.28)]"
            style={{
              left: `${((c.x - 8) / W) * 100}%`,
              top: `${((c.y - 8) / H) * 100}%`,
              width: `${(16 / W) * 100}%`,
              height: `${(16 / H) * 100}%`,
            }}
          />
        );
      })}
      {arrow ? <Arrow from={arrow.from} to={arrow.to} /> : null}
      {FILES.split('').map((f, i) => (
        <span
          key={f}
          aria-hidden="true"
          className="pointer-events-none absolute text-[11px] text-[#fef1e7] max-lg:text-[12px]"
          style={{
            left: `${((35 + 60 * i) / W) * 100}%`,
            top: `${(492 / H) * 100}%`,
            fontFamily: "'DM Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
            fontWeight: 500,
            lineHeight: '14px',
          }}
        >
          {f}
        </span>
      ))}
    </div>
  );
};

export default ChessBoard;
