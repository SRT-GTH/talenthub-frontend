import { useEffect, useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';

const log = debug('useGameClock');

/*
 * useGameClock — the one timer every Games v2 game shares (countdown "1:52 left" or count-up "7:40 so far").
 *   const clock = useGameClock({ start: 112, direction: 'down', running: !paused, onEnd })
 *   clock.seconds   whole seconds now          clock.label   "1:52"  ("0:07", "12:05")
 *   clock.reset(s)  jump to s seconds          clock.ended   true once a countdown reaches 0 (onEnd fires once)
 * `running` false freezes it (Connection lost, dialogs, finished boards). A seeded Figma frame passes the drawn value as `start`
 * and `running: false` so the screenshot stays put. The caller decides the copy ("left", "so far", "Paused").
 */
export const formatClock = (total) => {
  const s = Math.max(0, Math.round(total));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export const useGameClock = ({ start = 0, direction = 'down', running = true, onEnd } = {}) => {
  const [seconds, setSeconds] = useState(start);
  const endRef = useRef(onEnd);
  const firedRef = useRef(false);
  useEffect(() => {
    endRef.current = onEnd;
  }, [onEnd]);

  useEffect(() => {
    if (!running) return undefined;
    const id = window.setInterval(() => {
      setSeconds((s) => (direction === 'down' ? Math.max(0, s - 1) : s + 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, direction]);

  const ended = direction === 'down' && seconds <= 0;
  useEffect(() => {
    if (ended && !firedRef.current) {
      firedRef.current = true;
      log('ended');
      endRef.current?.();
    }
    if (!ended) firedRef.current = false;
  }, [ended]);

  return {
    seconds,
    label: formatClock(seconds),
    ended,
    reset: (s = start) => setSeconds(s),
  };
};
