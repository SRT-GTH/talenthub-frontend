/*
 * editorTime — the saved-status line of the section editor (frames 7.8.2b / 2c / 2g / 2i):
 *   < 5 s  "Saved as draft just now · only staff can see it"   < 1 min  "Saved as draft 4 s ago"   later  "Last change saved 2 min ago"
 * ⚠️ ASSUMPTION: the three wordings are one line that ages (the frames draw each at a different moment).
 */
export const savedLabel = (savedAt, now = Date.now()) => {
  if (!savedAt) return '';
  const ms = Math.max(0, now - savedAt);
  if (ms < 5000) return 'Saved as draft just now · only staff can see it';
  if (ms < 60000) return `Saved as draft ${Math.floor(ms / 1000)} s ago`;
  return `Last change saved ${Math.floor(ms / 60000)} min ago`;
};
