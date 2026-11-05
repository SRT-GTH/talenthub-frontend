import { MEMORY_BEST_SO_FAR, MEMORY_DRAWN_RESULT } from './memoryMatchData.js';

/* Result strip above the result card (GV-10 / GV-11 draw "8 of 8 pairs" · "14 turns · 2:31" · all dots ok, Best so far: 82).
 * It reads the finished run from the stored result when there is one (see GameV2Result), else the drawn numbers. */
const formatSeconds = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const readRun = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('f')) return null;
    const raw = JSON.parse(window.sessionStorage.getItem('gth:gv2-result') || 'null');
    return raw && raw.gameId === 'memory-match' && raw.run ? raw : null;
  } catch {
    return null;
  }
};
export const memoryMatchResultProgress = () => {
  const stored = readRun();
  const run = stored?.run;
  const found = run ? run.found : MEMORY_DRAWN_RESULT.found;
  const total = run ? run.pairs : MEMORY_DRAWN_RESULT.pairs;
  const dotCount = Math.min(total, 8);
  return {
    countLabel: `${found} of ${total} pairs`,
    summary: run
      ? `${run.turns} turns · ${formatSeconds(run.seconds)}`
      : `${MEMORY_DRAWN_RESULT.turns} turns · ${MEMORY_DRAWN_RESULT.time}`,
    dots: Array.from({ length: dotCount }, (_, i) => ({
      state: !run || found >= Math.ceil(((i + 1) * total) / dotCount) ? 'ok' : 'todo',
      label: String(i + 1),
    })),
    passMark:
      !stored || stored.mode === 'ranked' ? `Best so far: ${MEMORY_BEST_SO_FAR}` : undefined,
  };
};
