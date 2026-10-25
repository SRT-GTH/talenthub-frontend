/*
 * trendsData.js — API-shaped mock of GET /agency/trends?months=24 (Figma 11.4.2c, 8596:391034). SAMPLE CONTENT ONLY. Same chart shape as Theme 8's
 * getTrends (publicData/outcomes/data/outcomesData.js) so TrendsView / TrendCard draw it; `labelIndexes` marks the x labels the frame prints
 * (Nov ’24 · Mar ’25 · Jul ’25 · Nov ’25 · Mar ’26 · Jul ’26 · Oct ’26). Values are read off the frame's bars / lines (⚠️ approximate).
 * Figma inconsistency kept: the New sign-ups headline says 19,840 while its last (current-month) bar is drawn near 12k.
 */

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const LABELS = Array.from({ length: 24 }, (_, i) => {
  const m = (10 + i) % 12;
  const y = 24 + Math.floor((10 + i) / 12);
  return `${MONTH_NAMES[m]} ’${y}`;
});
const pts = (values) => LABELS.map((label, i) => ({ label, value: values[i] }));
const LABEL_INDEXES = [0, 4, 8, 12, 16, 20, 23];

/* ⚠️ the frame draws the line from about 150k to 219,428 (not 68k, which "+151,300 in 24 months" implies): the picture wins here. */
const TOTAL = Array.from({ length: 24 }, (_, i) =>
  Math.round(150000 + (219428 - 150000) * ((i / 23) * 0.85 + (i / 23) ** 2 * 0.15))
);
TOTAL[23] = 219428;

export const AGENCY_TRENDS_24M = {
  range: '24m',
  subtitle: 'Month by month over the last 24 months.',
  charts: [
    {
      id: 'total',
      title: 'Total talents',
      kind: 'line',
      aside: 'Cumulative',
      headline: '219,428',
      delta: '▲ +151,300 in 24 months',
      yMax: 240000,
      yStep: 60000,
      labelIndexes: LABEL_INDEXES,
      showEndLabel: false,
      series: pts(TOTAL),
    },
    {
      id: 'signups',
      title: 'New sign-ups',
      kind: 'column',
      aside: 'Per month',
      headline: '19,840',
      delta: 'this month · ▲ 12%',
      yMax: 20000,
      yStep: 5000,
      current: true,
      labelIndexes: LABEL_INDEXES,
      showEndLabel: false,
      series: pts([
        10400, 11300, 10700, 12100, 11700, 12700, 11500, 13100, 11800, 13900, 11600, 13200, 11900,
        13900, 11700, 13800, 14000, 12900, 14200, 15700, 17900, 12800, 17600, 12400,
      ]),
    },
    {
      id: 'assessments',
      title: 'Assessments completed',
      kind: 'line',
      aside: 'Per month',
      headline: '34,210',
      delta: 'this month · ▲ 6%',
      yMax: 40000,
      yStep: 10000,
      labelIndexes: LABEL_INDEXES,
      showEndLabel: false,
      hoverIndex: 21,
      series: pts([
        24200, 25100, 24800, 26900, 27800, 26700, 28300, 29200, 28100, 30400, 29800, 31200, 29600,
        30800, 28900, 31500, 30200, 29700, 30900, 31000, 30400, 31600, 33800, 34210,
      ]),
    },
    {
      id: 'placements',
      title: 'Placements',
      kind: 'line',
      aside: 'Per month',
      headline: '418',
      delta: 'this month · ▲ 9%',
      yMax: 400,
      yStep: 100,
      labelIndexes: LABEL_INDEXES,
      showEndLabel: false,
      series: pts([
        235, 245, 228, 262, 270, 283, 262, 288, 305, 298, 310, 287, 301, 318, 305, 330, 322, 340,
        333, 342, 318, 330, 340, 345,
      ]),
    },
  ],
};
