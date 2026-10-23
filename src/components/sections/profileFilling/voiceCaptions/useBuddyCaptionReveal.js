import { useEffect, useMemo, useState } from 'react';
import { BUDDY_VOICE_RATE, BUDDY_WORDS_PER_SECOND, splitWords } from './voiceCaptionData.js';

/**
 * Reveals Buddy's reply word by word while it is spoken. Returns { words, index }: words before `index`
 * are spoken (solid), `index` is the word being spoken (green, bold), the rest is still grey.
 *
 * ⚠️ ASSUMPTION: the speech helper (browser speech synthesis) exposes no word boundaries to this layer, so
 * the reveal is timed to the reply length at an average speaking pace scaled by the voice rate.
 * `paused` freezes it (Buddy was interrupted); it carries on from the same word when it resumes.
 */
export default function useBuddyCaptionReveal({
  text,
  active,
  paused = false,
  voiceId = 'tali',
  startAt = null,
}) {
  const words = useMemo(() => splitWords(text), [text]);
  const [index, setIndex] = useState(startAt ?? 0);

  useEffect(() => {
    if (startAt == null) setIndex(0);
  }, [text, active, startAt]);

  useEffect(() => {
    if (!active || paused || startAt != null) return undefined;
    const perWord = 1000 / (BUDDY_WORDS_PER_SECOND * (BUDDY_VOICE_RATE[voiceId] ?? 1));
    const id = setInterval(() => {
      setIndex((i) => Math.min(i + 1, words.length));
    }, perWord);
    return () => clearInterval(id);
  }, [active, paused, voiceId, words.length, startAt]);

  return { words, index: startAt ?? index };
}
