/*
 * gridLines — where the thick lines of a board go (a line = { at, from, to } in squares: `at` is the grid edge, from..to its span).
 */
/** Thick lines for the boxes of a Sudoku board. */
export const boxLines = (size, boxRows, boxCols) => {
  const vertical = [];
  const horizontal = [];
  for (let c = boxCols; c < size; c += boxCols) vertical.push({ at: c, from: 0, to: size });
  for (let r = boxRows; r < size; r += boxRows) horizontal.push({ at: r, from: 0, to: size });
  return { vertical, horizontal };
};

/** Thick lines wherever two neighbouring squares belong to different cages. */
export const cageLines = (cageOf, size) => {
  const vertical = [];
  const horizontal = [];
  for (let r = 0; r < size; r += 1) {
    for (let c = 1; c < size; c += 1) {
      if (cageOf[r * size + c] !== cageOf[r * size + c - 1]) {
        vertical.push({ at: c, from: r, to: r + 1 });
      }
    }
  }
  for (let r = 1; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      if (cageOf[r * size + c] !== cageOf[(r - 1) * size + c]) {
        horizontal.push({ at: r, from: c, to: c + 1 });
      }
    }
  }
  return { vertical, horizontal };
};
