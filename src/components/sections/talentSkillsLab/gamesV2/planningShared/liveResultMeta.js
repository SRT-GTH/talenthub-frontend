/*
 * liveResultMeta — helpers for a game's GAMES_V2_META when the run was played against the server (/api/games).
 * GameV2Page draws `subtitleLead` and `resultProgress` above the result card; in live mode they must come from the stored
 * result (cardToResult(card), sessionStorage 'gth:gv2-result', `live: true`), never from the mock numbers.
 *   isMockGamesUrl()        true for the Figma frames (`?f=`) and `?demo=1` (the drawn values stay)
 *   readLiveResult(gameId)  the stored live result of this game, or null
 *   liveBestMark(stored)    "Best before: N" for a ranked run with an earlier best, else undefined
 */
export const isMockGamesUrl = () => {
  try {
    const p = new URLSearchParams(window.location.search);
    return Boolean(p.get('f')) || p.get('demo') === '1';
  } catch {
    return true;
  }
};

export const readLiveResult = (gameId) => {
  try {
    if (isMockGamesUrl()) return null;
    const raw = JSON.parse(window.sessionStorage.getItem('gth:gv2-result') || 'null');
    return raw && raw.live && raw.gameId === gameId ? raw : null;
  } catch {
    return null;
  }
};

export const liveBestMark = (stored) =>
  stored?.mode === 'ranked' && Number.isFinite(stored?.previousBest)
    ? `Best before: ${stored.previousBest}`
    : undefined;
