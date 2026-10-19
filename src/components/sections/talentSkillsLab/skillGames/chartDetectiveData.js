/*
 * Chart Detective mock data — Figma SL-GS05 "Case 3" (Playful 7943:7482 / Focused 8110:496031). Shaped like
 * `GET /skills-lab/games/chart-detective` (cases) + `POST …/cases/:n/answer`.
 *
 * DRAWN: case 3 (both charts' ticks, bar heights, the "Starts at 9,300?" note, the five reasons, copy, header).
 * ⚠️ ASSUMPTION: cases 1, 2, 4, 5, 6 (data, prompt, which chart lies — always the cut-axis trick), the 60 s limit, the
 * feedback copy, scoring (+20 XP per case, +20 pass bonus, solved = right chart AND right reason) and what "Zoom in" does
 * (stacks the two charts full width).
 */
export const CHART_DETECTIVE = {
  gameId: 'chart-detective',
  title: 'Skills Lab · Chart Detective',
  label: 'Chart Detective',
  subtitle: 'Data analysis · 6 cases · Pass 5 to earn Verified',
  skill: 'Data analysis',
  total: 6,
  passMark: 5,
  baseXp: 240,
  streakDays: 7,
  caseXp: 20,
  passBonusXp: 20,
  seconds: 60,
  bonusUnder: 45,
  checks: ['Reading charts', 'Spotting bias'],
  reasons: [
    'Y-axis does not start at zero',
    'Months were cherry-picked',
    'Wrong units on the axis',
    'Bars are 3D and distorted',
    'Nothing, both are fine',
  ],
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
};

// Bar heights are in px inside the 260 px plot (baseline at 230, 5 gridlines every 50 px, drawn values).
const cut = (ticks, heights, note) => ({ ticks, heights, note });
const zero = (ticks, heights) => ({ ticks, heights });

export const CHART_CASES = [
  {
    // ⚠️ ASSUMPTION
    topic: 'Reading charts',
    title: 'MoMo agent float, Jan to Jun 2026',
    prompt:
      'Agent float went from 41,000 to 44,000 in six months. That is about 7%. Does either chart make it look like more?',
    A: zero(['0', '12,500', '25,000', '37,500', '50,000'], [164, 168, 172, 176, 180, 176]),
    B: cut(
      ['40,000', '41,500', '43,000', '44,500', '46,000'],
      [34, 52, 78, 104, 130, 156],
      'Starts at 40,000?'
    ),
    lying: 'B',
    reason: 0,
    explain:
      'Chart B starts at 40,000, so a 7% rise looks like the bars tripled. Chart A starts at zero.',
  },
  {
    // ⚠️ ASSUMPTION
    topic: 'Spotting bias',
    title: 'Market stall visits, Jan to Jun 2026',
    prompt:
      'Visits rose from 2,100 to 2,300. That is about 10%. Does either chart make it look like more?',
    A: cut(
      ['2,050', '2,125', '2,200', '2,275', '2,350'],
      [40, 76, 104, 140, 168, 196],
      'Starts at 2,050?'
    ),
    B: zero(['0', '600', '1,200', '1,800', '2,400'], [175, 180, 185, 190, 192, 192]),
    lying: 'A',
    reason: 0,
    explain: 'Chart A starts at 2,050, which stretches a 10% change into a steep climb.',
  },
  {
    // DRAWN (case 3, Figma SL-GS05)
    topic: 'Reading charts',
    title: 'MoMo wallet sign-ups, Jan to Jun 2026',
    prompt:
      'Sign-ups grew from 9,400 to 10,150 in six months. That is about 8%. Does either chart make it look like more?',
    A: cut(
      ['9,300', '9,530', '9,750', '9,980', '10,200'],
      [22, 56, 71, 113, 133, 189],
      'Starts at 9,300?'
    ),
    B: zero(['0', '2,550', '5,100', '7,650', '10,200'], [184, 187, 189, 192, 194, 199]),
    lying: 'A',
    reason: 0,
    explain:
      'Chart A starts at 9,300, so a gain of about 8% looks like the bars are nearly doubling. Chart B starts at zero and shows the real size.',
  },
  {
    // ⚠️ ASSUMPTION
    topic: 'Spotting bias',
    title: 'Trotro fares collected, Jan to Jun 2026',
    prompt:
      'Fares went from 8,000 to 8,600. That is about 7%. Does either chart make it look like more?',
    A: zero(['0', '2,500', '5,000', '7,500', '10,000'], [160, 163, 166, 169, 171, 172]),
    B: cut(
      ['7,900', '8,100', '8,300', '8,500', '8,700'],
      [20, 46, 84, 120, 150, 176],
      'Starts at 7,900?'
    ),
    lying: 'B',
    reason: 0,
    explain: 'Chart B starts at 7,900, which makes a small rise look dramatic.',
  },
  {
    // ⚠️ ASSUMPTION
    topic: 'Reading charts',
    title: 'Cocoa deliveries, Jan to Jun 2026',
    prompt:
      'Deliveries moved from 5,200 to 5,500. That is under 6%. Does either chart make it look like more?',
    A: cut(
      ['5,100', '5,250', '5,400', '5,550', '5,700'],
      [30, 60, 96, 126, 150, 180],
      'Starts at 5,100?'
    ),
    B: zero(['0', '1,500', '3,000', '4,500', '6,000'], [172, 175, 178, 181, 183, 184]),
    lying: 'A',
    reason: 0,
    explain:
      'Chart A starts at 5,100, so the bars climb steeply. Chart B starts at zero and is honest.',
  },
  {
    // ⚠️ ASSUMPTION
    topic: 'Spotting bias',
    title: 'Library members, Jan to Jun 2026',
    prompt:
      'Members rose from 640 to 700. That is under 10%. Does either chart make it look like more?',
    A: zero(['0', '200', '400', '600', '800'], [160, 164, 168, 172, 175, 175]),
    B: cut(['620', '650', '680', '710', '740'], [20, 44, 70, 110, 140, 168], 'Starts at 620?'),
    lying: 'B',
    reason: 0,
    explain: 'Chart B starts at 620, which makes a small rise look dramatic.',
  },
];

export const CHART_FRAMES = {
  GS05: { index: 2, results: ['ok', 'ok'], pick: 'A', reason: 0, seconds: 33 },
};
