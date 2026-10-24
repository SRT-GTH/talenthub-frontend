import { formatCount } from '../publicDataFormat.js';
import { signedPct } from './regionsFormat.js';

/*
 * compareMetrics.js — the five metrics of the compare screens (Figma 8495:2021 "Headline numbers", phone cards 8516:184 …): label, the number the bar is
 * drawn from, and the printed text. Talent counts go through formatCount (<5 rule); organisation counts and percentages print as drawn.
 * The phone frames draw four of them (Talents · 30-day growth · Assessment completion · Placements): `phone: true`.
 */

export const COMPARE_METRICS = [
  {
    key: 'talents',
    label: 'Talents',
    phone: true,
    get: (r) => r.talents,
    text: (r) => formatCount(r.talents),
  },
  {
    key: 'growth',
    label: '30-day growth',
    phone: true,
    get: (r) => r.trendPct,
    text: (r) => signedPct(r.trendPct),
  },
  {
    key: 'assessment',
    label: 'Assessment completion',
    phone: true,
    get: (r) => r.assessmentPct,
    text: (r) => `${r.assessmentPct}%`,
  },
  {
    key: 'placements',
    label: 'Placements made',
    phone: true,
    get: (r) => r.placements,
    text: (r) => formatCount(r.placements),
  },
  {
    key: 'partners',
    label: 'Active partners',
    phone: false,
    get: (r) => r.partners,
    text: (r) => String(r.partners),
  },
];
