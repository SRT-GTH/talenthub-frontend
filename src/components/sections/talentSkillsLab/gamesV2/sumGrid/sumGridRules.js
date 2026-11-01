import { findClashes } from '../gridLogic/gridRules.js';

/*
 * sumGridRules — cage maths for Sum Grid. A cage is { op, target, cells: [index…], label }; `op` '' = one square.
 *   +  sum   ×  product   −  larger minus smaller (two squares)   ÷  larger over smaller (two squares)
 */
export const buildCages = (rawCages, size) =>
  rawCages.map((cage) => ({
    op: cage.op,
    target: cage.target,
    label: `${cage.target}${cage.op}`,
    cells: cage.cells.map(([row, col]) => (row - 1) * size + (col - 1)),
  }));

/** cageOf[index] → the cage's position in the list. */
export const cageIndexByCell = (cages, size) => {
  const out = new Array(size * size).fill(-1);
  cages.forEach((cage, i) => cage.cells.forEach((cell) => (out[cell] = i)));
  return out;
};

/** What the filled squares of a cage make (null while a square is empty). */
export const cageMakes = (cage, values) => {
  const nums = cage.cells.map((i) => values[i]);
  if (nums.some((n) => !n)) return null;
  if (cage.op === '+') return nums.reduce((a, b) => a + b, 0);
  if (cage.op === '×') return nums.reduce((a, b) => a * b, 1);
  if (cage.op === '−') return Math.max(...nums) - Math.min(...nums);
  if (cage.op === '÷') return Math.max(...nums) / Math.min(...nums);
  return nums[0];
};

/** 'open' (a square is empty) | 'ok' | 'wrong'. */
export const cageStatus = (cage, values) => {
  const made = cageMakes(cage, values);
  if (made === null) return 'open';
  return made === cage.target ? 'ok' : 'wrong';
};

export const cageMessage = (cage, values) => {
  const made = cageMakes(cage, values);
  const shown = Number.isInteger(made) ? made : Number(made.toFixed(1));
  return `This cage makes ${shown}. It needs ${cage.label}.`;
};

/** Row / column repeats (Sum Grid has no boxes). */
export const findRowColClashes = (values, size) => findClashes(values, size, null);

/** Solved = every square filled, no repeat in a row or column, every cage on target. */
export const isSumGridSolved = (values, cages, size) =>
  values.every(Boolean) &&
  findRowColClashes(values, size).length === 0 &&
  cages.every((cage) => cageStatus(cage, values) === 'ok');
