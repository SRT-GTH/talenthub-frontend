import { useEffect, useState } from 'react';

/*
 * useCountdown — a whole-second clock for the timed personality games (Escape Room 03:47 left, Desert Island 01:12 left,
 * Speed Sort 0:23 left, The Pitch 0:42 of 1:00). It only ticks while `running`; the Figma frames show a frozen
 * reading, so a game starts the clock on the player's first action (⚠️ ASSUMPTION).
 *   const seconds = useCountdown({ from: 227, running, onEnd })   // counts down to 0
 *   const seconds = useCountdown({ from: 42, to: 60, running })   // counts up to `to`
 */
export const useCountdown = ({ from, to = 0, running, onEnd }) => {
  const [seconds, setSeconds] = useState(from);
  const up = to > from;
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setSeconds((s) => {
        const next = up ? s + 1 : s - 1;
        if ((up && next >= to) || (!up && next <= to)) {
          clearInterval(id);
          onEnd?.();
          return to;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, up, to, onEnd]);
  return [seconds, setSeconds];
};

/* fmtClock(227) -> "3:47"; fmtClock(227, 2) -> "03:47" */
export const fmtClock = (total, minuteDigits = 1) => {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(minuteDigits, '0')}:${String(s).padStart(2, '0')}`;
};
