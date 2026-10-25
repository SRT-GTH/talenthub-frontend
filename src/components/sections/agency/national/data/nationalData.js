/*
 * nationalData.js — API-shaped mock data of the agency "National data" screens (Figma 11.4.2a-j, 11.4.6a-g). SAMPLE CONTENT ONLY.
 * The numbers come from Theme 8's getOverview(filters) (GET /public/overview); this module adds the agency extras.
 */

/* ===== BLOCK 1 · copy of the agency header (Figma 11.4.2a) ===== */
export const NATIONAL_SUBTITLE =
  'The public national picture plus the categories in your MoU: readiness, programme outcomes and district detail. Data as of 18 Oct 2026, 09:00. Groups under 5 are hidden.';

export const MOU_VIEW = {
  eyebrow: 'Your MoU view',
  title: '3 data categories · access until Oct 2027',
  body: 'Skills, readiness and programme outcomes for all 16 regions, down to district level. Ages 14–17 show as totals only. Every view is logged.',
};

/* ===== BLOCK 2 · "Show by" granularity ===== */
export const GRANULARITY = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
];

/* ===== BLOCK 3 · Breakdown "View by" options (11.4.6d, list drawn in 8707:422622) ===== */
export const BREAKDOWN_VIEWS = [
  { id: 'interest', label: 'Career interest' },
  { id: 'education', label: 'Education level' },
  { id: 'personality', label: 'Personality type', note: 'Broad groups only' },
  { id: 'goal', label: 'Career goal' },
  { id: 'skills', label: 'Skills held' },
  { id: 'experience', label: 'Work experience' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'age', label: 'Age range', note: '14–17 shown as one total' },
  { id: 'readiness', label: 'Readiness level' },
  {
    id: 'disability',
    label: 'Disability status',
    locked: true,
    note: 'Not in your MoU · request access',
  },
];

/** Personality is shown in five broad groups only (Figma 11.4.6e 8707:423161). */
export const PERSONALITY_ROWS = [
  { key: 'builders', label: 'Builders', count: 61240 },
  { key: 'helpers', label: 'Helpers', count: 52870 },
  { key: 'thinkers', label: 'Thinkers', count: 44310 },
  { key: 'creators', label: 'Creators', count: 35920 },
  { key: 'organisers', label: 'Organisers', count: 25088 },
];
export const PERSONALITY_NOTE =
  'Personality is only shown in five broad groups, never individual results or scores.';

/** ⚠️ ASSUMPTION: the frames draw only the Career interest and Personality lists; these are sample rows for the other views. */
export const SAMPLE_VIEW_ROWS = {
  goal: [
    ['Get a job', 71200],
    ['Further study', 52100],
    ['Start a business', 34800],
    ['Internship', 29400],
    ['Scholarship', 18900],
  ],
  skills: [
    ['Communication', 64300],
    ['Microsoft Office', 51700],
    ['Data analysis', 22400],
    ['Customer service', 19800],
    ['Digital marketing', 15600],
  ],
  experience: [
    ['None yet', 98400],
    ['Under 1 year', 61200],
    ['1–2 years', 34100],
    ['3+ years', 25728],
  ],
  certifications: [
    ['None', 142300],
    ['Short course', 41200],
    ['TVET certificate', 21400],
    ['Professional', 14528],
  ],
  readiness: [
    ['Building', 88100],
    ['Almost ready', 77300],
    ['Ready now', 54028],
  ],
};

export const PLACEMENTS_SUB =
  '23.4% success rate · ▲ +2.1 pts. Talents matched into jobs, internships and training.';
