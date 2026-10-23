import { useEffect, useState } from 'react';
import { SETTLE_MS, splitWords } from './voiceCaptionData.js';

/**
 * Splits the live transcript into settled words (solid) and words that may still change (grey).
 *
 * ⚠️ ASSUMPTION: useVoiceCapture hands over one concatenated string, with no isFinal flag per word. A word
 * is treated as settled once it (and every word before it) stopped changing for SETTLE_MS.
 */
export default function useSettledWords(transcript, active = true) {
  const [snap, setSnap] = useState({ words: [], stamps: [] });
  const [clock, setClock] = useState(0);

  useEffect(() => {
    const next = splitWords(transcript);
    const t = Date.now();
    setSnap((prev) => {
      let same = 0;
      while (same < next.length && same < prev.words.length && next[same] === prev.words[same]) {
        same += 1;
      }
      return { words: next, stamps: next.map((_, i) => (i < same ? prev.stamps[i] : t)) };
    });
    setClock(t);
  }, [transcript]);

  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => setClock(Date.now()), 250);
    return () => clearInterval(id);
  }, [active]);

  let settled = 0;
  while (settled < snap.words.length && clock - snap.stamps[settled] >= SETTLE_MS) settled += 1;
  return { words: snap.words, settledCount: settled };
}
