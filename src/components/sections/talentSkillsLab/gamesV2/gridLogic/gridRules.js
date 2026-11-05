/*
 * gridRules — pure rules shared by Grid Logic (Sudoku) and Sum Grid (cage sums). A board is a flat array of `size * size`
 * numbers, 0 = empty, row-major (index = row * size + col). Rows / columns are 0-based here; the Figma names are 1-based.
 */

const COUNT_WORDS = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
export const countWord = (n) => COUNT_WORDS[n] ?? String(n);

/** "1..4.6/.5..2./…" → flat numbers. `.` and `0` are empty. */
export const parseRows = (rows) =>
  rows
    .join('')
    .split('')
    .map((ch) => (ch === '.' ? 0 : Number(ch)));

export const rowOf = (index, size) => Math.floor(index / size);
export const colOf = (index, size) => index % size;

export const filledCount = (values) => values.filter(Boolean).length;

/** Box shape per board size: 4 → 2×2, 6 → 2 rows × 3 cols (Figma GL-01), 9 → 3×3 (Figma GL-04). */
export const boxShape = (size) => {
  if (size === 4) return { boxRows: 2, boxCols: 2 };
  if (size === 6) return { boxRows: 2, boxCols: 3 };
  return { boxRows: 3, boxCols: 3 };
};

const boxIndexOf = (index, size, boxRows, boxCols) =>
  Math.floor(rowOf(index, size) / boxRows) * Math.ceil(size / boxCols) +
  Math.floor(colOf(index, size) / boxCols);

/** Cells that share a row, column (and optionally box) with `index`, itself excluded. */
export const peersOf = (index, size, shape = null) => {
  const out = [];
  const r = rowOf(index, size);
  const c = colOf(index, size);
  for (let i = 0; i < size * size; i += 1) {
    if (i === index) continue;
    const sameRow = rowOf(i, size) === r;
    const sameCol = colOf(i, size) === c;
    const sameBox =
      shape &&
      boxIndexOf(i, size, shape.boxRows, shape.boxCols) ===
        boxIndexOf(index, size, shape.boxRows, shape.boxCols);
    if (sameRow || sameCol || sameBox) out.push(i);
  }
  return out;
};

/** The units (arrays of indices) a digit may not repeat in. */
export const unitsOf = (size, shape = null) => {
  const units = [];
  for (let r = 0; r < size; r += 1) {
    units.push({
      kind: 'row',
      cells: Array.from({ length: size }, (_, c) => r * size + c),
    });
  }
  for (let c = 0; c < size; c += 1) {
    units.push({
      kind: 'column',
      cells: Array.from({ length: size }, (_, r) => r * size + c),
    });
  }
  if (shape) {
    const perRow = Math.ceil(size / shape.boxCols);
    const boxCount = perRow * Math.ceil(size / shape.boxRows);
    for (let b = 0; b < boxCount; b += 1) {
      const cells = [];
      for (let i = 0; i < size * size; i += 1) {
        if (boxIndexOf(i, size, shape.boxRows, shape.boxCols) === b) cells.push(i);
      }
      units.push({ kind: 'box', cells });
    }
  }
  return units;
};

/**
 * Every repeated digit: [{ kind: 'row'|'column'|'box', value, cells: [index…] }] (only the cells holding the repeat).
 */
export const findClashes = (values, size, shape = null) => {
  const out = [];
  unitsOf(size, shape).forEach((unit) => {
    const seen = new Map();
    unit.cells.forEach((i) => {
      const v = values[i];
      if (!v) return;
      seen.set(v, [...(seen.get(v) ?? []), i]);
    });
    seen.forEach((cells, value) => {
      if (cells.length > 1) out.push({ kind: unit.kind, value, cells });
    });
  });
  return out;
};

export const clashCells = (clashes) => new Set(clashes.flatMap((c) => c.cells));

/** "Two 4s in this row. Change one of them." — the Figma copy for a row; column / box follow the same voice (⚠️ ASSUMPTION). */
export const clashMessage = (clash, { changeHint = true } = {}) => {
  const head = `${countWord(clash.cells.length)} ${clash.value}s in this ${clash.kind}.`;
  return changeHint ? `${head} Change one of them.` : head;
};

/** The clash to talk about: one that involves `preferred` (the cell just edited) first, row → column → box. */
export const pickClash = (clashes, preferred = -1) => {
  if (!clashes.length) return null;
  const order = { row: 0, column: 1, box: 2 };
  const sorted = [...clashes].sort((a, b) => order[a.kind] - order[b.kind]);
  return sorted.find((c) => c.cells.includes(preferred)) ?? sorted[0];
};

export const formatClockLabel = (seconds) => {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/**
 * Mock scoring shared by both games (⚠️ ASSUMPTION — no scoring is drawn in Figma; a real API scores server-side).
 * Starts at 100; each wrong submit costs 6, each clash made 2, each 30 s past the par time 2; never below 40.
 */
export const scoreRun = ({ seconds, parSeconds, wrongSubmits, clashesMade }) => {
  const late = Math.floor(Math.max(0, seconds - parSeconds) / 30);
  const score = Math.max(40, 100 - wrongSubmits * 6 - clashesMade * 2 - late * 2);
  const care = Math.max(0, 100 - clashesMade * 10 - wrongSubmits * 10);
  const speed = Math.max(0, Math.min(100, 100 - late * 6));
  return { score, care, speed, late };
};
