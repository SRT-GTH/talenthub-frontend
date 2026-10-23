import { useEffect, useRef } from 'react';
import { debug } from '../utils/debug.js';

const log = debug('useUtteranceSender');

/** Default silence before a spoken turn is sent. */
export const DEFAULT_PAUSE_MS = 1500;
/**
 * 2026-10-23 (voice latency): when the recogniser has already finalised the words (it does that
 * at a natural pause), a short extra wait is enough. Not for interviews (longer pauseMs): people
 * pause mid-answer there.
 */
export const FINAL_PAUSE_MS = 600;

/**
 * Live voice call (2026-10-16, shared by the Focused and Playful call UIs on
 * 2026-10-17): once the talent stops talking for `pauseMs`, hand the
 * transcript to `onUtterance` (the caller sends it as a turn and speaks the
 * reply). `paused` (Career Buddy thinking or speaking) and `muted` hold it.
 *
 * Practice / mock interviews pass a longer pauseMs - people stop to think
 * mid-answer, and a 1.5 s cut would split one answer into two.
 */
export default function useUtteranceSender({
  live,
  open,
  paused,
  muted,
  transcript,
  final = false,
  onUtterance,
  pauseMs = DEFAULT_PAUSE_MS,
}) {
  const sentRef = useRef('');

  useEffect(() => {
    if (!live || !open || paused || muted) return undefined;
    const text = (transcript || '').trim();
    if (!text || text === sentRef.current) return undefined;
    const wait = final && pauseMs <= DEFAULT_PAUSE_MS ? FINAL_PAUSE_MS : pauseMs;
    const timer = setTimeout(() => {
      sentRef.current = text;
      log('branch', { utterance: text.length, wait, final });
      onUtterance(text);
    }, wait);
    return () => clearTimeout(timer);
  }, [live, open, paused, muted, transcript, final, onUtterance, pauseMs]);

  useEffect(() => {
    if (paused) sentRef.current = '';
  }, [paused]);
}
