/*
 * liveResultStrip — the result header of a LIVE run for the batch-A games (Pattern Pulse, Word Shuffle, Switch Sort, Three in a Row).
 * GameV2Page draws GAMES_V2_META[id].subtitleLead / resultProgress above the result card; in live mode they must come from the
 * server's card (stored by GameV2Result as cardToResult(card) under 'gth:gv2-result', `live: true`), never from the mock numbers.
 * The card gives counts only (correct / total / summary), not which round went how, so the live strip draws no dots.
 */
export const readLiveResult = (gameId) => {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('f') || params.get('demo') === '1') return null;
    const raw = JSON.parse(window.sessionStorage.getItem('gth:gv2-result') || 'null');
    return raw && raw.live && raw.gameId === gameId ? raw : null;
  } catch {
    return null;
  }
};

/** true when the page is not a drawn Figma frame / demo (live games) */
export const isLivePage = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    return !params.get('f') && params.get('demo') !== '1';
  } catch {
    return false;
  }
};

/** { countLabel, summary, dots: [], passMark } from the stored live result */
export const liveResultProgress = (stored, { countLabel, summary }) => ({
  countLabel,
  summary,
  dots: [],
  passMark:
    stored.mode === 'ranked' && Number.isFinite(stored.previousBest)
      ? `Best before: ${stored.previousBest}`
      : undefined,
});
