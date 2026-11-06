import { useEffect, useState } from 'react';

/*
 * useAccessCountdown(end) — the live countdown of an approved request's access window (`accessEndsAt` from the API).
 * Returns { ms, days, label, ended }: label is "6 days left" · "1 day left" · "5 h 12 min left" (under a day) · "Ended".
 */

const MINUTE = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;

export const useAccessCountdown = (end) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!end) return { ms: 0, days: 0, label: '', ended: false };
  const ms = new Date(end).getTime() - now;
  if (ms <= 0) return { ms: 0, days: 0, label: 'Ended', ended: true };
  const days = Math.floor(ms / DAY);
  if (days >= 1) {
    return { ms, days, label: `${days} ${days === 1 ? 'day' : 'days'} left`, ended: false };
  }
  const hours = Math.floor(ms / HOUR);
  const minutes = Math.floor((ms % HOUR) / MINUTE);
  return { ms, days, label: `${hours} h ${minutes} min left`, ended: false };
};
