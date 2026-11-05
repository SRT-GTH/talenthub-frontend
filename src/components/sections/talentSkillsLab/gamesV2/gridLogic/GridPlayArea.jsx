/*
 * GridPlayArea — "play area" of the Grid Logic / Sum Grid frames: the board column (board + 52px feedback slot) and the number pad,
 * 44px apart, centred in the 1040px column (Figma: 772 / 755 / 728 px wide). The pad is vertically centred on the board column the
 * way Figma centres its clipped 43px card (see GridPad); below lg the pad stacks under the board.
 * The whole area is centred in Figma's 493px "play" band (lg and up).
 *   boardPx   the board's desktop size: 428 (GL 6x6), 431 (GL 9x9), 424 (SG 4x4)
 */
const GridPlayArea = ({ boardPx, board, feedback, pad, onKeyDown }) => (
  <div
    onKeyDown={onKeyDown}
    className="mx-auto flex w-full flex-col items-center gap-[10px] lg:min-h-[493px] lg:flex-row lg:items-start lg:justify-center lg:gap-[44px] lg:pt-[var(--centre-pt)]"
    style={{
      '--board-px': `${boardPx}px`,
      '--pad-top': `${(boardPx + 52 - 43) / 2}px`,
      '--centre-pt': `${(493 - (boardPx + 52)) / 2}px`,
    }}
  >
    <div className="flex w-full max-w-[428px] flex-col items-center lg:w-[var(--board-px)] lg:max-w-none lg:shrink-0">
      {board}
      {feedback}
    </div>
    <div className="flex w-full justify-center lg:mt-[var(--pad-top)] lg:w-auto lg:justify-start">
      {pad}
    </div>
  </div>
);

export default GridPlayArea;
