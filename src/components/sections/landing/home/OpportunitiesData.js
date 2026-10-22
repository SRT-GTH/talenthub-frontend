/* S5 Opportunities copy — verbatim from Figma 7797:13091 (desktop) / 7815:269668 (tablet) / 7815:277485 (mobile). */

export const OPPORTUNITIES_HEAD = {
  chip: 'Live opportunities',
  title: 'Opportunities that know your worth.',
  sub: 'Your assessment, your skills and your goals are checked against every live role, so the best fits come to you first.',
};

/* Card fan: 3 cards on a 1400x347 artboard. x/y = wrapper position (incl. the 10px top inset) in artboard px, tilt in deg (rad * 57.3). */
export const OPPORTUNITY_CARDS = [
  {
    id: 'analyst',
    x: 72,
    y: 40,
    tilt: -5.73,
    title: 'Analyst Trainee',
    company: 'Ecobank Ghana · Accra',
    match: '78%',
    tile: 'light',
    chips: [
      { label: 'GH₵ 2,400–3,200/mo', tone: 'green' },
      { label: 'On-site', tone: 'plain' },
    ],
    skills: [
      { label: 'Analytical', ok: true },
      { label: 'Finance', ok: true },
      { label: 'Excel', ok: false },
    ],
    cta: { label: 'View role', primary: false },
  },
  {
    id: 'data',
    x: 500,
    y: 0,
    tilt: 0,
    title: 'Data Analyst Intern',
    company: 'MTN Ghana · Accra',
    match: '94%',
    tile: 'solid',
    chips: [
      { label: 'Paid internship', tone: 'green' },
      { label: 'Hybrid', tone: 'plain' },
    ],
    skills: [
      { label: 'Analytical', ok: true },
      { label: 'Python', ok: true },
      { label: 'Goal-driven', ok: true },
    ],
    cta: { label: 'Quick apply', primary: true },
    sticker: 'BEST MATCH',
  },
  {
    id: 'marketing',
    x: 924,
    y: 62,
    tilt: 5.73,
    title: 'Marketing Graduate',
    company: 'Unilever Ghana · Tema',
    match: '86%',
    tile: 'light',
    chips: [
      { label: 'GH₵ 3,800–5,200/mo', tone: 'green' },
      { label: 'In person', tone: 'plain' },
    ],
    skills: [
      { label: 'Leadership', ok: true },
      { label: 'Comms', ok: true },
      { label: 'Sales', ok: true },
    ],
    cta: { label: 'View role', primary: false },
  },
];

export const OPPORTUNITY_STATS = [
  { value: '1,580+', label: 'active opportunities' },
  { value: '48h', label: 'average recruiter reply' },
  { value: '94%', label: 'match accuracy' },
];

export const OPPORTUNITIES_CTA = 'Browse all opportunities';

/* Fan artboard (Figma "Card fan" 1400x347). */
export const FAN_W = 1400;
export const FAN_H = 347;
