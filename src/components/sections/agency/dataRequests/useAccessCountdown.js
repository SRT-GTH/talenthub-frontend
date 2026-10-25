import { useEffect, useState } from 'react';
import { ACCESS_END, MOCK_NOW } from './data/dataRequestsData.js';

/*
 * useAccessCountdown — the live countdown of an approved request's access window (Figma 11.4.3a "Access ends in 6 days", 11.4.3d "6 days left").
 * ⚠️ ASSUMPTION: the mock clock starts at MOCK_NOW (18 Oct 2026, 09:00 — the "data as of" of the agency pages) and ticks in real time from page load,
 * so the frames' "6 days" is what a fresh page shows; the real value comes from the request's `accessEndsAt` once there is an API.
 * Returns { ms, days, label, ended }: label is "6 days left" · "1 day left" · "5 h 12 min left" (under a day) · "Ended".
 */

const MINUTE = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;

export const useAccessCountdown = (end = ACCESS_END) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const started = Date.now();
    const timer = window.setInterval(() => setElapsed(Date.now() - started), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const ms = end - (MOCK_NOW + elapsed);
  if (ms <= 0) return { ms: 0, days: 0, label: 'Ended', ended: true };
  const days = Math.floor(ms / DAY);
  if (days >= 1) {
    return { ms, days, label: `${days} ${days === 1 ? 'day' : 'days'} left`, ended: false };
  }
  const hours = Math.floor(ms / HOUR);
  const minutes = Math.floor((ms % HOUR) / MINUTE);
  return { ms, days, label: `${hours} h ${minutes} min left`, ended: false };
};
