import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { debug } from '../../../utils/debug.js';

const log = debug('MessagesA11yPrefs');

/*
 * Messages-only accessibility preferences (Figma A-01…A-04, panel "In Messages" tab).
 *   Calm chat / Read aloud / Explain it simply / Chat text size "large"  -> the Messages URL (messagesState.js:
 *     calm, read, explain, large) so every frame state is reachable by URL AND by clicking.
 *   Chat text size small | medium, "Enter adds a new line" and the panel scope tab -> small in-memory store below
 *     (survives while the page is open). Only `large` (the 17px drawn in A-02/A-03/A-04) changes the text: Figma gives no
 *     size for small or medium, so they leave it unchanged.
 * Contract with the thread (package A): bubble text carries `data-msg-text`, decorative stickers / reactions /
 * motion carry `data-msg-deco`; the className returned by `useMessagesA11yClasses` (applied on the Messages root)
 * scales the first and hides the second.
 */
const DEFAULTS = { size: 'medium', enterNewLine: true, scope: 'messages' };
let state = { ...DEFAULTS };
const listeners = new Set();
const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const getSnapshot = () => state;

const setStore = (patch) => {
  state = { ...state, ...patch };
  log('store', state);
  listeners.forEach((fn) => fn());
};

export const useMessagesA11yStore = () => {
  const snap = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULTS);
  return [snap, setStore];
};

/** "Enter adds a new line" (on = Enter inserts a line break, ⌘/Ctrl+Enter sends). The composer reads this. */
export const useEnterAddsNewLine = () => useMessagesA11yStore()[0].enterNewLine;

export const BUBBLE_TEXT_SIZES = {
  large: '[&_[data-msg-text]]:text-[17px]! [&_[data-msg-text]]:leading-[23px]!',
};

/** className for the Messages page root: Large text scales chat bubbles, Calm chat hides deco and stops motion. */
export const useMessagesA11yClasses = (messages) => {
  const [snap] = useMessagesA11yStore();
  const size = messages?.large ? 'large' : snap.size;
  const calm = Boolean(messages?.calm);
  const parts = [];
  if (BUBBLE_TEXT_SIZES[size]) parts.push(BUBBLE_TEXT_SIZES[size]);
  if (calm) {
    parts.push(
      '[&_*]:animate-none! [&_*]:transition-none! [&_*]:[animation-duration:0s]! [&_[data-msg-deco]]:hidden!'
    );
  }
  return parts.join(' ');
};

const synth = () => (typeof window !== 'undefined' && window.speechSynthesis) || null;

/** Read aloud through the Web Speech API; graceful when it is missing (the bar still shows, nothing is spoken). */
export const useReadAloud = ({ onEnd } = {}) => {
  const [rate, setRate] = useState(1);
  const onEndRef = useRef(onEnd);
  useEffect(() => {
    onEndRef.current = onEnd;
  });
  const supported = Boolean(synth());

  const stop = useCallback(() => {
    try {
      synth()?.cancel();
    } catch {
      log('cancel failed');
    }
  }, []);

  const speak = useCallback(
    (text, nextRate = 1) => {
      const s = synth();
      if (!s || !text) {
        log('speech unavailable or empty text', { supported: Boolean(s) });
        return;
      }
      stop();
      const u = new window.SpeechSynthesisUtterance(text);
      u.rate = nextRate;
      u.onend = () => onEndRef.current?.();
      // An engine error (no voices installed, headless browsers) must NOT end the "playing" state: the URL frame
      // ?read=playing stays on screen and the user can still press stop. Only a real end of speech closes the bar.
      u.onerror = (e) => log('speech error (kept playing)', e?.error);
      log('speak', { chars: text.length, rate: nextRate });
      s.speak(u);
    },
    [stop]
  );

  useEffect(() => stop, [stop]);
  return { speak, stop, supported, rate, setRate };
};

/** Quoted start of a message for the read-aloud bar, cut at a word boundary with an ellipsis. */
export const excerpt = (text, max = 42) => {
  if (!text || text.length <= max) return text || '';
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
};
