import { STREAK_PAGE_COPY } from './talentStreakData.js';

/*
 * Real month math for the streak calendar: Monday-first weeks, padding days from the neighbouring
 * months, and per-day status derived from the API payload (`litDates`, `today`, `goalDate`).
 *
 *   pad      day of the previous/next month (blank cell)
 *   lit      a day with a qualifying action
 *   todayGoal today, already lit, and the day a milestone lands (S-08: "today · On Fire!")
 *   today    today, not lit yet
 *   goal     a future day where the next milestone lands ("On Fire")
 *   missed   a past day with no action
 *   future   any other upcoming day
 */
const pad2 = (n) => String(n).padStart(2, '0');
export const toIso = (year, month, day) => `${year}-${pad2(month)}-${pad2(day)}`;

// `since` (live data): the talent's first streak day — earlier days are not counted as missed.
export const buildStreakMonth = ({
  year,
  month,
  today,
  litDates = [],
  goalDate = null,
  since = null,
}) => {
  const lit = new Set(litDates);
  const daysInMonth = new Date(year, month, 0).getDate();
  // getDay(): 0 = Sunday … 6 = Saturday; Monday-first offset.
  const lead = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  const cells = [];
  for (let i = 0; i < lead; i += 1) cells.push({ id: `lead-${i}`, status: 'pad' });
  let litCount = 0;
  let missedCount = 0;
  for (let day = 1; day <= daysInMonth; day += 1) {
    const iso = toIso(year, month, day);
    const isToday = iso === today;
    const isLit = lit.has(iso);
    const isGoal = iso === goalDate;
    let status;
    if (isLit && isToday && isGoal) status = 'todayGoal';
    else if (isLit) status = 'lit';
    else if (isToday) status = 'today';
    else if (isGoal && iso > today) status = 'goal';
    else if (iso < today && (!since || iso >= since)) status = 'missed';
    else if (iso < today) status = 'future';
    else status = 'future';
    if (isLit) litCount += 1;
    if (status === 'missed') missedCount += 1;
    cells.push({ id: iso, iso, day, status });
  }
  while (cells.length % 7 !== 0) cells.push({ id: `trail-${cells.length}`, status: 'pad' });
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return {
    title: `${STREAK_PAGE_COPY.monthNames[month - 1]} ${year}`,
    monthName: STREAK_PAGE_COPY.monthNames[month - 1],
    weeks,
    litCount,
    missedCount,
  };
};
