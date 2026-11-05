/*
 * Watched stretches for GTH's YouTube player (learning path iteration 4).
 *
 * The player is polled about once a second while it plays. Consecutive positions about a second
 * apart extend the open stretch; a jump (seek, skip) closes it and opens a new one. `take()` hands
 * over everything watched since the last flush; the server keeps the union, so overlaps are
 * harmless and seeking ahead never counts as watched.
 */
export const createStretchTracker = ({ maxStep = 2.5 } = {}) => {
  let open = null; // [start, end]
  let done = [];
  return {
    tick(t) {
      if (!Number.isFinite(t) || t < 0) return;
      if (open && t >= open[1] && t - open[1] <= maxStep) {
        open[1] = t;
        return;
      }
      if (open && open[1] > open[0]) done.push(open);
      open = [t, t];
    },
    /** Stop the open stretch (pause, end, seek). */
    close() {
      if (open && open[1] > open[0]) done.push(open);
      open = null;
    },
    /** Stretches to send now; the open one continues from where it was cut. */
    take() {
      const out = done.map(([a, b]) => [Math.round(a * 10) / 10, Math.round(b * 10) / 10]);
      done = [];
      if (open && open[1] > open[0]) {
        out.push([Math.round(open[0] * 10) / 10, Math.round(open[1] * 10) / 10]);
        open = [open[1], open[1]];
      }
      return out;
    },
  };
};
