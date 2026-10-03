/*
 * jobScreeningData.js — verbatim content for the Recruiter Job Screening
 * screen. Source: Figma Bin8roWL8sloyc36IgFMuT, frame 7249:78066
 * ("RECRUITER - JOB SCREENING / Screening Criteria"), canvas 7249:78213.
 *
 * The section's second frame (7249:78533 "Dropdown Menu Item Hover") is the
 * same screen with the "Applying to" select open, i.e. a state of this one.
 */

export const PAGE_HEADING = { lead: 'Job ', accent: 'Screening' };
export const PAGE_SUBHEADING =
  "Automatically filter out applicants who don't meet your requirements.";

export const APPLYING_TO = {
  label: 'Applying to',
  required: '*',
  value: 'Senior UX Designer — London, UK',
};

export const CORE_REQUIREMENTS = {
  sectionLabel: 'CORE REQUIREMENTS',
  badge: 'AUTOMATED',
  items: [
    {
      id: 'experience',
      icon: 'experience',
      title: 'Minimum Experience',
      description: 'Filter candidates based on total years in a relevant strategic role.',
      value: '10+ Years',
      // Figma 7249:78785 — the only dropdown this frame set opens. 115x174,
      // white, 0.7px #e5e5e5, r10, 4px vertical padding; 41px rows separated
      // by 0.6px #e5e5e5 rules, hovered row #f6f6f6, labels 14/400 #737373.
      options: ['0 - 2', '2 - 5', '5 - 10', '10+'],
      meta: 'Weight',
    },
    {
      id: 'skills',
      icon: 'skills',
      title: 'Required Skills Match',
      description: 'Mandatory match for primary skills: Strategy, Financial Modeling, SQL.',
      tags: ['Strategy', 'Modeling', 'Leadership'],
      addLabel: '+ Add Skill',
    },
    {
      id: 'education',
      icon: 'education',
      title: 'Education Level',
      description: 'Verified degree from institutional partners or accredited universities.',
      value: 'Master’s Degree',
    },
  ],
};

export const TALENT_FUNNEL = {
  title: 'Talent Funnel Preview',
  // Figma 7249:78327 — a 401x7 #e6e6e6 track with a 48.1px #387440 fill,
  // i.e. qualified / total expressed as 12%.
  progressPercent: (48.104 / 401) * 100,
  stats: [
    { label: 'Total Applicants', value: '1,420' },
    { label: 'Qualified Matches', value: '172', accent: true },
  ],
  qualityLabel: 'Estimated Quality',
  qualityValue: '4.8',
  // Figma 7249:78339 — five 20x19 stars, four #eab308 and one #d6d1c2.
  qualityStars: 4,
  qualityStarTotal: 5,
  qualityNote:
    'With current criteria, you are targeting the\ntop 5% of our institutional talent pool.',
  primaryAction: 'Apply & Filter Pool',
  secondaryAction: 'Save as Template',
};

export const PERFORMANCE_CONTEXT = [
  {
    id: 'assessment',
    icon: 'gauge',
    title: 'Assessment Score',
    description: 'Minimum GTH threshold score.',
    badge: 'MIN THRESHOLD',
    value: '85%',
    // Figma 7249:78379 — 254x8 #f0eee8 track, 218.16px #387440 fill.
    progressPercent: (218.16 / 254) * 100,
  },
  {
    id: 'location',
    icon: 'location',
    title: 'Location Match',
    description: 'Proximity to regional hub.',
    value: 'Remote / London Hub',
    meta: 'Hybrid: 2 days mandatory',
  },
];

export const MARKET_INSIGHTS = {
  sectionLabel: 'MARKET INSIGHTS',
  cards: [
    {
      id: 'salary',
      title: 'Salary Benchmark',
      value: '₵1.5K - ₵2.5k',
      note: 'Based on candidates matching these criteria in London.',
    },
    {
      id: 'velocity',
      title: 'Candidate Velocity',
      value: 'Fast',
      note: 'Expect high response rates for these requirements.',
    },
    {
      id: 'diversity',
      title: 'Diversity Index',
      value: 'High',
      note: 'Current filters ensure an inclusive talent acquisition flow.',
    },
  ],
};
