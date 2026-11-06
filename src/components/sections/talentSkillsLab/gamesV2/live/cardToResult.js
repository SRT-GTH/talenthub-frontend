/*
 * The server's result card (POST /games/session/:runId/submit, or `card` on the move that ended the game) → the `finish()`
 * payload GameV2Result draws. Everything here comes from the server; nothing is computed in the browser.
 *   score       points (0–100)              skills    measures → [{ label, value }]
 *   summary     the engine's one-line summary    verifies  labels of skills that are Game-evidenced after this run
 *   xp          XP earned (ranked, finished)      percentileLine / minorLine / comparedLine  the chip and footnote
 *   tags/read   play-style games (traits)
 */
const topLine = (percentile) => {
  const top = Math.max(1, 100 - percentile);
  return `Top ${top}% at this level`;
};

export const cardToResult = (card) => {
  if (!card) return null;
  const evidenced = (card.skillsStrengthened ?? []).filter((s) => !s.failed).map((s) => s.skill);
  const fresh = (card.skillsStrengthened ?? []).filter((s) => s.new).map((s) => s.skill);
  const score = Number.isFinite(card.points) ? card.points : 0;
  let minorLine = null;
  if (card.minor) {
    if (card.previousBest === null || card.previousBest === undefined)
      minorLine = 'Your first score at this level';
    else if (score > card.previousBest)
      minorLine = `Your best yet · up ${score - card.previousBest} from your best`;
    else minorLine = `Your best so far is ${card.previousBest}`;
  }
  return {
    live: true,
    runId: card.runId,
    sessionId: card.sessionId,
    mode: card.mode,
    level: card.difficulty,
    score,
    completed: card.completed,
    correct: card.correct,
    total: card.total,
    skills: (card.measures ?? []).map((m) => ({ label: m.label, value: m.score })),
    summary: card.summary,
    verifies: evidenced.length
      ? evidenced.length === 1
        ? evidenced[0]
        : `${evidenced.slice(0, -1).join(', ')} and ${evidenced[evidenced.length - 1]}`
      : null,
    newlyVerified: fresh,
    xp: card.xp ?? 0,
    percentile: card.percentile,
    percentileLine: Number.isFinite(card.percentile) ? topLine(card.percentile) : null,
    percentileNote: card.percentileNote ?? null,
    comparedLine:
      Number.isFinite(card.cohortSize) && card.cohortSize > 0 && Number.isFinite(card.percentile)
        ? `Compared with ${card.cohortSize.toLocaleString('en-GB')} earlier ranked results at this level.`
        : null,
    minor: Boolean(card.minor),
    minorLine,
    previousBest: card.previousBest ?? null,
    provisional: Boolean(card.provisional),
    passed: card.passed,
    tags: card.traits ? card.traits.filter((t) => t.score >= 60).map((t) => t.label) : null,
    traits: card.traits ?? null,
    nextRankedAt: card.nextRankedAt ?? null,
  };
};
