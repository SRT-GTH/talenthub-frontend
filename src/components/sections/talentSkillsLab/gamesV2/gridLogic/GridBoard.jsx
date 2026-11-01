import { useEffect, useRef } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';

const log = debug('GridBoard');

/*
 * GridBoard — the square board of Grid Logic and Sum Grid (Figma "board": 428/424px, 3px ink border r18 + 0/5 hard shadow in
 * Playful; 2px ink@.85 border r14, no shadow in Focused; the squares sit 4px inside).
 *
 * Square fills (Figma layer names): plain/user #ffffff · given #f2f5f4 · band (same row/col as the selected square) #f3f8f4,
 * given+band #ecf1ed · selected #e2f1e4 + 3px #387440 ring (a selected GIVEN square keeps its given+band fill, no ring: GL-03 / GL-04) ·
 * bad #fcebe8 · ok (Solved) #e2f1e4.  Digits: given #1c2a21, the player's #27522e, bad #c73326.
 * Thick lines: Grid Logic = the box borders (3px #1c2a21); Sum Grid = the cage borders ("group line" rects).
 * Sizes scale with the board through container-query units, so every size of grid stays in proportion (digit = 45.1/N cqw in
 * Playful, 41.2/N in Focused — the Figma 6x6, 9x9 and 4x4 frames all follow it).
 *
 *   cells[i] = { value, notes (bit mask, bit d = digit d), given, selected, band, bad, ok, label?, labelBad? }
 *   lines    = { vertical: [col…], horizontal: [row…] } edges that get a thick line, each as `{ at, from, to }` in squares
 */
const LINE = 'pointer-events-none absolute bg-[#1c2a21]';

const fillOf = (c) => {
  if (c.bad) return 'bg-[#fcebe8]';
  if (c.ok) return 'bg-[#e2f1e4]';
  if (c.selected && !c.given) return 'bg-[#e2f1e4]';
  if (c.band || c.selected) return c.given ? 'bg-[#ecf1ed]' : 'bg-[#f3f8f4]';
  return c.given ? 'bg-[#f2f5f4]' : 'bg-white';
};

const digitColor = (c) => {
  if (c.bad) return 'text-[#c73326]';
  return c.given ? 'text-[#1c2a21]' : 'text-[#27522e]';
};

const NoteMarks = ({ notes, size, hasLabel }) => {
  const cols = size > 4 ? 3 : 2;
  return (
    <span
      aria-hidden="true"
      className={classNames(
        'pointer-events-none absolute inset-x-[8%] bottom-[5%] grid font-sans text-[max(12px,2.6cqw)] leading-[10px] font-semibold text-[#6b6b6b]',
        hasLabel ? 'top-[30%]' : 'top-[6%]'
      )}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: size }, (_, i) => i + 1).map((d) => (
        <span key={d} className="text-center">
          {notes & (1 << d) ? d : ''}
        </span>
      ))}
    </span>
  );
};

const GridBoard = ({
  size,
  cells,
  lines,
  focusIndex,
  onSelect,
  onKeyDown,
  disabled = false,
  focusedWeight = 'font-bold',
  ariaLabel,
  describe,
}) => {
  log('render', { size, selected: cells.findIndex((c) => c.selected) });
  const groupRef = useRef(null);
  useEffect(() => {
    // arrow keys move the selection: carry DOM focus along while the player is working inside the board
    const el = groupRef.current;
    if (el && focusIndex !== null && el.contains(document.activeElement)) {
      el.querySelector(`[data-grid-cell="${focusIndex}"]`)?.focus();
    }
  }, [focusIndex]);
  const digitStyle = {
    '--digit-p': `${45.1 / size}cqw`,
    '--digit-f': `${41.2 / size}cqw`,
    '--label': `${16.7 / size}cqw`,
  };

  return (
    <div
      ref={groupRef}
      role="group"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className="relative aspect-square w-full max-w-[432px] [container-type:inline-size] rounded-[14px] border-2 border-solid border-[rgba(28,42,33,0.85)] bg-white playful:rounded-[18px] playful:border-[3px] playful:border-[#1c2a21] playful:shadow-[0_5px_0_rgba(28,42,33,0.45)]"
      style={digitStyle}
    >
      <div className="absolute inset-[2px] playful:inset-[1px]">
        <div
          className="grid size-full"
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
          }}
        >
          {cells.map((cell, i) => (
            <button
              key={i}
              type="button"
              disabled={disabled}
              tabIndex={i === focusIndex ? 0 : -1}
              aria-label={describe(i, cell)}
              aria-current={cell.selected ? 'true' : undefined}
              data-grid-cell={i}
              onClick={() => onSelect(i)}
              className={classNames(
                'relative m-0 flex min-w-0 cursor-pointer items-center justify-center border-0 p-0 font-sans leading-none transition-colors duration-150 outline-none motion-reduce:transition-none',
                'shadow-[inset_0_0_0_0.5px_rgba(28,42,33,0.14)] focus-visible:z-[3] focus-visible:shadow-[inset_0_0_0_3px_#387440]',
                'disabled:cursor-default',
                fillOf(cell),
                digitColor(cell),
                focusedWeight,
                'text-[length:var(--digit-f)] playful:font-heading playful:text-[length:var(--digit-p)] playful:font-semibold',
                cell.selected && !cell.given && 'z-[2] shadow-[inset_0_0_0_3px_#387440]',
                cell.label ? 'pt-[8%]' : ''
              )}
            >
              {cell.label ? (
                <span
                  className={classNames(
                    'pointer-events-none absolute top-[1.4cqw] left-[1.65cqw] font-sans text-[length:max(12px,var(--label))] leading-[1.2] font-bold',
                    cell.labelBad ? 'text-[#c73326]' : 'text-[#1c2a21]'
                  )}
                >
                  {cell.label}
                </span>
              ) : null}
              {cell.value || null}
              {!cell.value && cell.notes ? (
                <NoteMarks notes={cell.notes} size={size} hasLabel={Boolean(cell.label)} />
              ) : null}
            </button>
          ))}
        </div>
        {lines.vertical.map(({ at, from, to }) => (
          <span
            key={`v${at}-${from}`}
            aria-hidden="true"
            className={classNames(LINE, 'z-[2] w-[3px] -translate-x-1/2')}
            style={{
              left: `${(at / size) * 100}%`,
              top: `calc(${(from / size) * 100}% - 1.5px)`,
              height: `calc(${((to - from) / size) * 100}% + 3px)`,
            }}
          />
        ))}
        {lines.horizontal.map(({ at, from, to }) => (
          <span
            key={`h${at}-${from}`}
            aria-hidden="true"
            className={classNames(LINE, 'z-[2] h-[3px] -translate-y-1/2')}
            style={{
              top: `${(at / size) * 100}%`,
              left: `calc(${(from / size) * 100}% - 1.5px)`,
              width: `calc(${((to - from) / size) * 100}% + 3px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GridBoard;
