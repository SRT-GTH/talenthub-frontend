/*
 * gameLiveResult — helpers for the result strip / header that GameV2Page draws above the result card (GAMES_V2_META getters) of
 * Chess Tactics, Chess Match, Crisis Room and Makola Haggle. In live mode the strip is built ONLY from the stored server result
 * (sessionStorage 'gth:gv2-result' = cardToResult(card): correct, total, summary, mode, previousBest, completed, passed …); the
 * drawn Figma numbers are kept for the `?f=` frames and `?demo=1`.
 */
export const isMockUrl = () => {
  try {
    const p = new URLSearchParams(window.location.search);
    return Boolean(p.get('f')) || p.get('demo') === '1';
  } catch {
    return true;
  }
};

/** The stored live result of `gameId`, or null (frames / demo / nothing stored). */
export const readLiveResult = (gameId) => {
  if (isMockUrl()) return null;
  try {
    const raw = JSON.parse(window.sessionStorage.getItem('gth:gv2-result') || 'null');
    return raw && raw.live && (!raw.gameId || raw.gameId === gameId) ? raw : null;
  } catch {
    return null;
  }
};

/**
 * A strip from the server's counts: `correct` of `total` dots. The card does not say WHICH items were missed, so the dots are
 * filled in order (as Memory Match does); the rest are 'bad' when the run was completed, else 'todo'.
 */
export const liveStrip = (stored, { noun, summary }) => {
  const total = Number.isFinite(stored.total) ? stored.total : 0;
  const correct = Number.isFinite(stored.correct) ? stored.correct : 0;
  const count = Math.min(total, 10);
  return {
    countLabel: `${correct} of ${total} ${noun}`,
    summary: summary ?? '',
    dots: Array.from({ length: count }, (_, i) => ({
      state: i < correct ? 'ok' : stored.completed ? 'bad' : 'todo',
      label: String(i + 1),
    })),
    passMark:
      stored.mode === 'ranked' && Number.isFinite(stored.previousBest)
        ? `Best before: ${stored.previousBest}`
        : undefined,
  };
};
