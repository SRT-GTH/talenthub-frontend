import { useEffect, useState } from 'react';

/*
 * Helpers shared by the live chess / scenario hooks. Nothing here judges a move: legal moves, clocks and grades come from the
 * server view (`run.view`); chess.js is used by the hooks only to draw the FEN.
 */

/** Dots for the selected piece from the server's `legalMoves` [{ from, to, promotion }]. `chess` (chess.js) only says whether the target square is occupied (ring vs dot). */
export const targetsFrom = (legal, selected, chess) => {
  if (!selected || !Array.isArray(legal)) return [];
  const seen = new Set();
  return legal
    .filter((m) => m.from === selected && !seen.has(m.to) && seen.add(m.to))
    .map((m) => {
      let capture = false;
      try {
        capture = Boolean(chess?.get(m.to));
      } catch {
        capture = false;
      }
      return { square: m.to, capture };
    });
};

/** The server move for from → to (a promotion is sent as a queen; the board has no picker). */
export const findLegal = (legal, from, to) => {
  const list = (legal ?? []).filter((m) => m.from === from && m.to === to);
  if (!list.length) return null;
  return list.find((m) => m.promotion === 'q') ?? list[0];
};

export const fmtClock = (sec) => {
  const s = Math.max(0, Math.floor(sec ?? 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/**
 * A per-round / per-puzzle countdown that starts from the server's `timeLeftSec` and ticks locally until the next view.
 * `syncKey` changes whenever the server sends a fresh value (new view). Returns the seconds left, or null when the server gave none.
 */
export const useServerCountdown = (serverSec, syncKey, running) => {
  const [left, setLeft] = useState(Number.isFinite(serverSec) ? serverSec : null);
  const [key, setKey] = useState(syncKey);
  if (key !== syncKey) {
    setKey(syncKey);
    setLeft(Number.isFinite(serverSec) ? serverSec : null);
  }
  useEffect(() => {
    if (!running || left === null || left <= 0) return undefined;
    const id = window.setTimeout(() => setLeft((t) => (t === null ? t : t - 1)), 1000);
    return () => window.clearTimeout(id);
  }, [running, left]);
  return left;
};

/** "back_rank" → "Back rank" */
export const humanise = (s) =>
  typeof s === 'string' && s ? `${s[0].toUpperCase()}${s.slice(1).replace(/_/g, ' ')}` : '';
