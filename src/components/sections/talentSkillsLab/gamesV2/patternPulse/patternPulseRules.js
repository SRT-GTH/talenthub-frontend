/*
 * patternPulseRules — pure helpers that turn a round spec (patternPulseData.js) into what the board draws, and verify it.
 * A rule is one of:
 *   { kind: 'arithmetic', start, step }            4, 7, 10, 13 …                 jump label "+3" / "−6"
 *   { kind: 'growing',    start, step, grow }      2, 3, 5, 8, 12 … (step 1, +1)  jump label "+1", "+2", …
 *   { kind: 'geometric',  start, ratio }           2, 4, 8, 16 …                  jump label "×2"
 *   { kind: 'fibonacci',  a, b }                   1, 2, 3, 5, 8 …                jump label "+n" (the term added)
 *   { kind: 'power',      from, exp }              1, 4, 9, 16 (exp 2) …          jump label "+3", "+5", …
 * and a round is `{ rule, shown }` (one pattern) or `{ a: rule, b: rule, shown }` (two patterns take turns: a, b, a, b …).
 */
export const BEAD_COLORS = [
  { fill: '#f2b731', ink: '#1c2a21' },
  { fill: '#387440', ink: '#ffffff' },
  { fill: '#c4502e', ink: '#ffffff' },
  { fill: '#2f5e9e', ink: '#ffffff' },
];
export const PATTERN_A_COLOR = BEAD_COLORS[1]; // "Green beads follow one rule"
export const PATTERN_B_COLOR = BEAD_COLORS[0]; // "gold beads another"

export const termAt = (rule, i) => {
  switch (rule.kind) {
    case 'arithmetic':
      return rule.start + rule.step * i;
    case 'growing':
      return rule.start + rule.step * i + (rule.grow * i * (i - 1)) / 2;
    case 'geometric':
      return rule.start * rule.ratio ** i;
    case 'fibonacci': {
      let [x, y] = [rule.a, rule.b];
      for (let k = 0; k < i; k += 1) [x, y] = [y, x + y];
      return x;
    }
    case 'power':
      return (rule.from + i) ** rule.exp;
    default:
      throw new Error(`unknown rule ${rule.kind}`);
  }
};

const signed = (n) => (n < 0 ? `−${Math.abs(n)}` : `+${n}`);

/* label drawn on the arc between term i and term i + 1 of one pattern */
export const jumpLabel = (rule, i) => {
  if (rule.kind === 'geometric') return `×${rule.ratio}`;
  return signed(termAt(rule, i + 1) - termAt(rule, i));
};

/* every term of the whole sequence (pattern a/b interleaved when the round has two) */
export const sequenceOf = (round, count) =>
  Array.from({ length: count }, (_, i) => {
    if (!round.a) return { value: termAt(round.rule, i), pattern: 'single', index: i, position: i };
    const pattern = i % 2 === 0 ? 'a' : 'b';
    const index = Math.floor(i / 2);
    return { value: termAt(round[pattern], index), pattern, index, position: i };
  });

/*
 * buildRound(spec) → what the screen needs:
 *   beads[]   shown terms {value, pattern, index, position, color}
 *   answer    the next term       slot { pattern, color } of the "?" bead
 *   jumps[]   arcs {from, to, label, pattern} between bead positions (the answer bead is position beads.length)
 */
export const buildRound = (spec) => {
  const total = spec.shown + 1;
  const seq = sequenceOf(spec, total);
  const colorFor = (item) => {
    if (item.pattern === 'a') return PATTERN_A_COLOR;
    if (item.pattern === 'b') return PATTERN_B_COLOR;
    return BEAD_COLORS[item.position % BEAD_COLORS.length];
  };
  const withColor = seq.map((item) => ({ ...item, color: colorFor(item) }));
  const beads = withColor.slice(0, spec.shown);
  const target = withColor[spec.shown];
  const jumps = [];
  for (let p = 0; p < total; p += 1) {
    const item = withColor[p];
    if (spec.a) {
      const next = withColor.find((o) => o.pattern === item.pattern && o.index === item.index + 1);
      if (next)
        jumps.push({
          from: p,
          to: next.position,
          label: jumpLabel(spec[item.pattern], item.index),
          pattern: item.pattern,
        });
    } else if (p < total - 1) {
      jumps.push({ from: p, to: p + 1, label: jumpLabel(spec.rule, p), pattern: 'single' });
    }
  }
  return { beads, target, answer: target.value, jumps, total };
};

/* programmatic validation — used by the verification script and cheap enough to run in dev */
export const validateSpec = (spec) => {
  const problems = [];
  const { beads, answer } = buildRound(spec);
  const choices = [answer, ...spec.wrong];
  if (new Set(choices).size !== choices.length) problems.push('choices are not unique');
  if (choices.length !== 4) problems.push('needs 3 wrong choices');
  if (choices.some((c) => !Number.isInteger(c))) problems.push('non-integer choice');
  if (beads.length !== spec.shown) problems.push('shown mismatch');
  if (spec.shown + 1 > 7) problems.push('too many beads for the board');
  if (!spec.ruleText || !spec.clue) problems.push('missing copy');
  if (spec.a) {
    const other = buildRound({ ...spec, shown: spec.shown + 1 }).target.value;
    if (!choices.includes(other))
      problems.push('expected the other pattern’s next term as a wrong choice');
  }
  return problems;
};
