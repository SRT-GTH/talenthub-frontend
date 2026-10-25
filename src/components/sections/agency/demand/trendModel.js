import { DATE_RANGE, FRAME_SERIES, GRANULARITY_BY_RANGE, TREND_RANGES } from './data/demandData.js';

/*
 * trendModel.js — turns (range, by, from, to) of the URL into the series the Trends charts draw. Figma draws two combinations in full (Last 12 months by month,
 * Last quarter by week); every other combination slices or interpolates those two. ⚠️ ASSUMPTION: sample content, a real API returns each combination.
 */

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_MS = 86400000;
const TODAY = new Date(`${DATE_RANGE.today}T00:00:00`);

const iso = (d) => d.toISOString().slice(0, 10);
export const parseIso = (s) => {
  const d = new Date(`${s}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
};
export const fmtDay = (d, year = false) =>
  `${d.getDate()} ${MON[d.getMonth()]}${year ? ` ${d.getFullYear()}` : ''}`;
export const daysBetween = (a, b) => Math.round((b - a) / DAY_MS) + 1;

/** Start / end of the period a range id (+ custom from / to) covers. */
export const rangeBounds = ({ range, from, to }) => {
  const end = range === 'custom' || range === 'long' ? (parseIso(to) ?? TODAY) : TODAY;
  let start;
  if (range === '30d') start = new Date(end - 29 * DAY_MS);
  else if (range === 'quarter') start = new Date(end - 90 * DAY_MS);
  else if (range === 'ytd') start = new Date(end.getFullYear(), 0, 1);
  else if (range === '12m') start = new Date(end.getFullYear(), end.getMonth() - 11, 1);
  else start = parseIso(from) ?? new Date(`${DATE_RANGE.defaultFrom}T00:00:00`);
  return { start, end, days: daysBetween(start, end) };
};

/** Text of the filter bar result and of the period bar. */
export const rangeText = ({ range, from, to }, by) => {
  const { start, end, days } = rangeBounds({ range, from, to });
  const unit = by === 'week' && range === 'quarter' ? 'weeks' : null;
  let result;
  if (unit) result = '13 weeks · compared with the 13 before';
  else if (range === '12m') result = '12 months · compared with the 12 before';
  else if (range === 'ytd') {
    const m = end.getMonth() + 1;
    result = `${m} months · compared with the ${m} before`;
  } else result = `${days} days · compared with the ${days} before`;
  const fullYearStart = range === '12m' || range === 'custom' || range === 'long';
  const prev = range === 'quarter' ? 'previous quarter' : 'previous period';
  const span = `${fmtDay(start, fullYearStart)} – ${fmtDay(end, true)}`;
  return { result, bar: `${span} · ${prev} shown as a faint line`, start, end, days, span };
};

const cumulative = (reg, end) => {
  const total = reg.reduce((a, b) => a + b, 0);
  let run = end - total;
  return reg.map((v) => {
    run += v;
    return Math.round(run * 10) / 10;
  });
};

const sliceLast = (arr, n) => arr.slice(Math.max(0, arr.length - n));

const sliceSeries = (s, n) => ({
  ...s,
  labels: sliceLast(s.labels, n),
  registrations: sliceLast(s.registrations, n),
  previous: sliceLast(s.previous, n),
  recruiter: sliceLast(s.recruiter, n),
  programmes: sliceLast(s.programmes, n),
  assessments: sliceLast(s.assessments, n),
  score: sliceLast(s.score, n),
  skills: Object.fromEntries(Object.entries(s.skills).map(([k, v]) => [k, sliceLast(v, n)])),
});

/** More than 12 months: earlier months are extrapolated backwards (x0.96 per month) and labels carry the year ("Nov 25"). */
const extendMonths = (s, n, end) => {
  if (n <= 12) return sliceSeries(s, n);
  const extra = n - 12;
  const back = (arr) => [
    ...Array.from(
      { length: extra },
      (_, k) => Math.round(arr[0] * 0.96 ** (extra - k) * 100) / 100
    ),
    ...arr,
  ];
  const labels = Array.from({ length: n }, (_, i) => {
    const d = new Date(end.getFullYear(), end.getMonth() - (n - 1 - i), 1);
    return `${MON[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
  });
  return {
    ...s,
    labels,
    registrations: back(s.registrations),
    previous: back(s.previous),
    recruiter: back(s.recruiter).map(Math.round),
    programmes: back(s.programmes).map(Math.round),
    assessments: back(s.assessments),
    score: back(s.score).map(Math.round),
    skills: Object.fromEntries(Object.entries(s.skills).map(([k, v]) => [k, back(v)])),
  };
};

const interpolate = (arr, n, factor = 1) =>
  Array.from({ length: n }, (_, i) => {
    const pos = (i / (n - 1)) * (arr.length - 1);
    const a = arr[Math.floor(pos)];
    const b = arr[Math.min(arr.length - 1, Math.ceil(pos))];
    const wiggle = 1 + Math.sin(i * 1.7) * 0.04;
    return Math.round((a + (b - a) * (pos % 1)) * factor * wiggle * 100) / 100;
  });

const dailySeries = (n, end) => {
  const w = FRAME_SERIES.week;
  const labels = Array.from({ length: n }, (_, i) => fmtDay(new Date(end - (n - 1 - i) * DAY_MS)));
  const mk = (arr, f) => interpolate(arr.slice(0, -1), n, f);
  return {
    ...w,
    labels,
    registrations: mk(w.registrations, 1 / 7),
    previous: mk(w.previous, 1 / 7),
    recruiter: mk(w.recruiter, 1 / 7).map(Math.round),
    programmes: mk(w.programmes, 1 / 7).map(Math.round),
    assessments: mk(w.assessments, 1 / 7),
    score: interpolate(w.score.slice(0, -1), n),
    skills: Object.fromEntries(
      Object.entries(w.skills).map(([k, v]) => [k, interpolate(v.slice(0, -1), n)])
    ),
  };
};

/** The series for the URL: always {labels, ticks, ...} + yAxis config and headline totals. */
export const trendSeries = ({ range, by, from, to }) => {
  const g = by ?? GRANULARITY_BY_RANGE[range] ?? 'month';
  const { days, end } = rangeBounds({ range, from, to });
  let s;
  if (g === 'week') {
    const n = Math.min(13, Math.max(2, Math.ceil(days / 7)));
    s = sliceSeries(FRAME_SERIES.week, n);
  } else if (g === 'day') {
    s = dailySeries(Math.min(days, 90), end);
  } else {
    const n =
      range === 'ytd' ? end.getMonth() + 1 : Math.min(24, Math.max(2, Math.ceil(days / 30)));
    s = extendMonths(FRAME_SERIES.month, n, end);
  }
  const ticksFor = (labels) => {
    const step =
      labels.length > 14 ? Math.ceil(labels.length / 7) : labels.length > 8 && g === 'week' ? 2 : 1;
    return labels.filter((_, i) => i % step === 0);
  };
  const cum = cumulative(s.registrations, FRAME_SERIES.month.cumulativeEnd);
  const unit = g === 'day' ? 'day' : g === 'week' ? 'week' : 'month';
  return {
    ...s,
    unit,
    ticks: ticksFor(s.labels),
    cumulative: cum,
    cumulativeTicks: ticksFor(s.labels),
    regYMax: Math.max(
      g === 'week' ? 8 : 0,
      Math.ceil(Math.max(...s.registrations, ...s.previous) / (g === 'month' ? 5 : 2)) *
        (g === 'month' ? 5 : 2)
    ),
    oppYMax: Math.max(
      g === 'week' ? 400 : 0,
      Math.ceil(Math.max(...s.recruiter, ...s.programmes) / (g === 'month' ? 500 : 100)) *
        (g === 'month' ? 500 : 100)
    ),
    asYMax:
      Math.ceil(Math.max(...s.assessments) / (g === 'month' ? 2.5 : 0.5)) *
      (g === 'month' ? 2.5 : 0.5),
    totals:
      range === '12m' && g === 'month'
        ? FRAME_SERIES.month.totals
        : range === 'quarter' && g === 'week'
          ? FRAME_SERIES.week.totals
          : {
              ...FRAME_SERIES.month.totals,
              registrations: Math.round(s.registrations.reduce((a, b) => a + b, 0) * 1000),
              opportunities: Math.round(
                s.recruiter.reduce((a, b) => a + b, 0) + s.programmes.reduce((a, b) => a + b, 0)
              ),
              assessments: Math.round(s.assessments.reduce((a, b) => a + b, 0) * 1000),
            },
  };
};

export const defaultCustomBounds = () => ({
  from: DATE_RANGE.defaultFrom,
  to: DATE_RANGE.defaultTo,
});
export const isoOf = iso;
export const RANGE_IDS = TREND_RANGES.map((r) => r.id);
