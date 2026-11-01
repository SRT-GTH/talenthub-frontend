import { useEffect, useState } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import {
  PieceBlackKing,
  PieceBlackPawn,
  PieceBlackRook,
  PieceWhiteKing,
  PieceWhitePawn,
  PieceWhiteRook,
} from './ChessArt.jsx';

const log = debug('ChessBoard');

/*
 * ChessBoard — the Figma board card (CT-01 "Board" 463 x 476: #fffefc, r20.6, padding 17.2) holding the dark green frame (427 x 440,
 * 135deg #142916 → #2a5730), the 420 x 415 board (squares #e6cb85 / #2f5d37, a8 light), rank numbers outside on the left, file
 * letters in the dark band under the board (DM Mono 10.3), the selected square (#ffd86b @ .75) and legal-move dots (14px, #0b1a0f @ .28).
 * Pieces are the six Figma drawings (king / rook / pawn), sized from the 52px square. Captures show a ring instead of a dot
 * (⚠️ ASSUMPTION: only quiet-move dots are drawn).
 * Props: board (chess.js board()), flipped, selected, targets [{ square, capture }], onSquare(square), disabled.
 * Keyboard: the grid is a roving-tabindex set of square buttons; arrows move, Enter / Space press.
 */
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ART = {
  wk: [PieceWhiteKing, 'w-[61.5%]', 'white king'],
  wr: [PieceWhiteRook, 'w-[59.6%] -translate-y-[2%]', 'white rook'],
  wp: [PieceWhitePawn, 'w-[51.9%] translate-y-[3%]', 'white pawn'],
  bk: [PieceBlackKing, 'w-[61.5%]', 'black king'],
  br: [PieceBlackRook, 'w-[59.6%] -translate-y-[2%]', 'black rook'],
  bp: [PieceBlackPawn, 'w-[51.9%] translate-y-[3%]', 'black pawn'],
};
const SHADOW =
  '[filter:drop-shadow(0_2.6px_2.15px_rgba(0,0,0,0.55))_drop-shadow(0_0.9px_0.86px_rgba(0,0,0,0.35))]';

const ChessBoard = ({ board, flipped = false, selected, targets = [], onSquare, disabled }) => {
  const [cursor, setCursor] = useState('e1');
  const rows = flipped ? [...board].reverse() : board;
  const files = flipped ? [...FILES].reverse() : FILES;
  const rankNumbers = flipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];
  const targetMap = new Map(targets.map((t) => [t.square, t]));

  useEffect(() => {
    log('board', { selected, targets: targets.length, flipped, disabled });
  }, [selected, targets.length, flipped, disabled]);

  const move = (square, df, dr) => {
    const f = FILES.indexOf(square[0]) + (flipped ? -df : df);
    const r = Number(square[1]) + (flipped ? -dr : dr);
    return f < 0 || f > 7 || r < 1 || r > 8 ? square : `${FILES[f]}${r}`;
  };
  const onKey = (e, square) => {
    const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[
      e.key
    ];
    if (!d) return;
    e.preventDefault();
    const next = move(square, d[0], d[1]);
    setCursor(next);
    window.requestAnimationFrame(() =>
      e.currentTarget.parentElement?.querySelector(`[data-square="${next}"]`)?.focus()
    );
  };

  return (
    <div className="w-full max-w-[463px] rounded-[20.64px] border-[0.86px] border-solid border-[rgba(28,42,33,0.12)] bg-[#fffefc] p-[clamp(10px,3.7vw,17.2px)]">
      <div className="relative aspect-[427/440] w-full rounded-[2.58px] bg-[linear-gradient(135deg,#142916_0%,#2a5730_100%)] shadow-[inset_0_-0.86px_2.58px_rgba(0,0,0,0.4),inset_0_1.72px_6.88px_rgba(0,0,0,0.6)]">
        <div
          aria-hidden="true"
          className="absolute top-[0.91%] -left-[9px] flex h-[94.32%] flex-col max-lg:-left-[8px]"
        >
          {rankNumbers.map((n) => (
            <span
              key={n}
              className="flex flex-1 items-center justify-center font-mono text-[10.3px] leading-[13px] font-medium text-[#595959] max-lg:text-[12px]"
            >
              {n}
            </span>
          ))}
        </div>
        <div
          role="group"
          aria-label="Chess board"
          className="absolute top-[0.91%] left-[0.94%] grid h-[94.32%] w-[98.36%] grid-cols-8 grid-rows-8 border-[0.86px] border-solid border-[rgba(28,42,33,0.6)]"
        >
          {rows.map((rank, ri) =>
            (flipped ? [...rank].reverse() : rank).map((piece, fi) => {
              const square = `${files[fi]}${rankNumbers[ri]}`;
              const light = (FILES.indexOf(square[0]) + (8 - Number(square[1]))) % 2 === 0;
              const target = targetMap.get(square);
              const art = piece ? ART[`${piece.color}${piece.type}`] : null;
              const Art = art?.[0];
              return (
                <button
                  key={square}
                  type="button"
                  data-square={square}
                  disabled={disabled}
                  tabIndex={square === cursor ? 0 : -1}
                  onFocus={() => setCursor(square)}
                  onKeyDown={(e) => onKey(e, square)}
                  onClick={() => onSquare(square)}
                  aria-label={`${square}${art ? `, ${art[2]}` : ', empty'}${
                    target ? ', legal move' : ''
                  }${selected === square ? ', selected' : ''}`}
                  className={classNames(
                    'relative m-0 flex cursor-pointer items-center justify-center border-0 p-0 focus-visible:z-[1] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ffd86b] disabled:cursor-default',
                    light ? 'bg-[#e6cb85]' : 'bg-[#2f5d37]'
                  )}
                >
                  {selected === square ? (
                    <span aria-hidden="true" className="absolute inset-0 bg-[#ffd86b]/75" />
                  ) : null}
                  {target ? (
                    <span
                      aria-hidden="true"
                      className={classNames(
                        'absolute rounded-full',
                        target.capture
                          ? 'aspect-square w-[84%] border-[3px] border-solid border-[rgba(11,26,15,0.28)]'
                          : 'aspect-square w-[27%] bg-[#0b1a0f]/[0.28]'
                      )}
                    />
                  ) : null}
                  {Art ? <Art className={classNames('relative h-auto', art[1], SHADOW)} /> : null}
                </button>
              );
            })
          )}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1.72px_rgba(255,255,255,0.04),inset_0_0_34px_rgba(0,0,0,0.15)]"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute top-[95.9%] left-[0.94%] grid w-[98.36%] grid-cols-8"
        >
          {files.map((f) => (
            <span
              key={f}
              className="text-center font-mono text-[10.3px] leading-[13px] font-medium text-[#fef1e7] max-lg:text-[12px]"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
