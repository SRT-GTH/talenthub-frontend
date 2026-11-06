/*
 * talentSearchFilterData.js — verbatim content and mock rules for the talent-search menus and states, frames TS-02 … TS-10 of Figma file
 * OHG2xsfCCskT8xEn356njv page 10102 ("Recruiter - Talent Search"). Every string is the node's `characters` value from the REST API.
 * The shapes mirror what the future search / facets API would return (counts, ids, labels); today they are fixed mock data.
 *
 * FIGMA NOTES (kept as drawn):
 *  - TS-09's chips read Skills "React, Python, AWS" while its first suggestion says Remove "Rust" (no Rust chip is drawn).
 *  - TS-06's "Show 9 talents" is a fixed count in the frame; here it stays 9 whatever the drawer holds.
 *  - TS-02 draws the Ask Hiring Assistant row for the text "react nat" only.
 */

/* ------------------------------------------------------------------ search suggestions (TS-02, node 10102:36674) */
export const SEARCH_SUGGESTIONS = {
  assistant: {
    // ⚠️ ASSUMPTION: Figma draws the assistant prompt for the typed text "react nat" only; other text is echoed back in the same sentence shape.
    promptFor: (typed) =>
      /^react nat/i.test(typed.trim())
        ? 'React Native developers in Accra for Senior Product Engineer'
        : `${typed.trim()} in Accra for Senior Product Engineer`,
    label: 'Ask Hiring Assistant: ',
    hint: 'Get a ranked answer with reasons',
  },
  groups: [
    {
      id: 'skills',
      label: 'SKILLS',
      kind: 'skill',
      items: [
        { id: 'react-native', label: 'React Native', meta: '312 talents · 41 open to work' },
        { id: 'react', label: 'React', meta: '1,240 talents' },
      ],
    },
    {
      id: 'roles',
      label: 'ROLES',
      kind: 'role',
      items: [
        { id: 'react-native-developer', label: 'React Native Developer', meta: '86 talents' },
      ],
    },
  ],
  recentLabel: 'RECENT',
  recent: [
    { id: 'recent-senior-product-engineer', label: 'Senior Product Engineer · Accra' },
    { id: 'recent-product-designer-fintech', label: 'Product designer with fintech experience' },
  ],
};

/* ------------------------------------------------------------------ skills filter (TS-03, node 10102:37457) */
export const SKILLS_FILTER = {
  placeholder: 'Add a skill...',
  mustHaveLabel: 'MUST HAVE',
  suggestedLabel: 'SUGGESTED FOR THIS ROLE',
  clearLabel: 'Clear skills',
  defaultSkills: ['React', 'Python', 'AWS'],
  suggested: [
    { id: 'TypeScript', label: 'TypeScript', meta: 'In 74% of top matches' },
    { id: 'Kubernetes', label: 'Kubernetes', meta: 'In 41% of top matches' },
  ],
};

/* ------------------------------------------------------------------ experience filter (TS-04, node 10102:38243) */
export const EXPERIENCE_FILTER = {
  label: 'EXPERIENCE',
  defaultId: '5-plus',
  options: [
    { id: '0-2', label: '0–2 years', chip: '0–2 Years' },
    { id: '2-5', label: '2–5 years', chip: '2–5 Years' },
    { id: '5-plus', label: '5+ years', chip: '5+ Years' },
    { id: '10-plus', label: '10+ years', chip: '10+ Years' },
  ],
};

/* ------------------------------------------------------------------ location filter (TS-05, node 10102:39005) */
export const LOCATION_FILTER = {
  placeholder: 'Search a city or region',
  defaultId: 'accra',
  options: [
    { id: 'accra', label: 'Accra, Greater Accra', chip: 'Accra, GH' },
    { id: 'kumasi', label: 'Kumasi, Ashanti', chip: 'Kumasi, GH' }, // ⚠️ ASSUMPTION: chip text (only Accra, GH is drawn)
    { id: 'tema', label: 'Tema, Greater Accra', chip: 'Tema, GH' }, // ⚠️ ASSUMPTION
    { id: 'takoradi', label: 'Takoradi, Western', chip: 'Takoradi, GH' }, // ⚠️ ASSUMPTION
  ],
  toggles: [
    {
      id: 'remote',
      label: 'Include remote talent',
      description: 'Anywhere in Ghana',
      defaultOn: true,
    },
    { id: 'radius', label: 'Within 50 km', description: 'Distance from Accra', defaultOn: false },
  ],
};

/* ------------------------------------------------------------------ chips (TS-01 / TS-09) */
export const FILTER_CHIP_LABELS = { skills: 'Skills:', exp: 'Exp:', location: 'Location:' };
// ⚠️ ASSUMPTION: what a chip reads once its filter was cleared with the x (Figma never draws a cleared chip).
export const FILTER_CHIP_EMPTY_VALUE = 'Any';

/* ------------------------------------------------------------------ sort (TS-07, node 10102:39790) */
export const SORT_MENU = {
  triggerPrefix: 'Sort: ',
  defaultId: 'best-match',
  options: [
    { id: 'best-match', label: 'Best match', description: 'Skills, experience and location' },
    { id: 'recently-active', label: 'Recently active' },
    { id: 'assessment-score', label: 'Assessment score' },
    { id: 'available-soonest', label: 'Available soonest' },
    { id: 'open-to-work-first', label: 'Open to work first' },
  ],
};

/* ------------------------------------------------------------------ More filters drawer (TS-06, node 10102:40554) */
export const MORE_FILTERS = {
  title: 'More filters',
  closeLabel: 'Close more filters',
  availabilityLabel: 'Availability',
  availability: [
    { id: 'open-to-work', label: 'Open to work' },
    { id: 'available-now', label: 'Available now' },
    { id: 'within-1-month', label: 'Within 1 month' },
    { id: 'notice-period', label: 'Notice period' },
  ],
  defaultAvailability: ['open-to-work', 'within-1-month'],
  workSetupLabel: 'Work setup',
  workSetup: [
    { id: 'on-site', label: 'On-site' },
    { id: 'hybrid', label: 'Hybrid' },
    { id: 'remote', label: 'Remote' },
  ],
  defaultWorkSetup: ['hybrid', 'remote'],
  // ⚠️ ASSUMPTION: only the selected values ("Bachelor’s or higher", "Any score", "Up to GHS 15,000") are drawn; the other options are invented.
  education: {
    label: 'Education',
    defaultId: 'bachelors',
    options: [
      { value: 'any', label: 'Any education' },
      { value: 'diploma', label: 'Diploma or higher' },
      { value: 'bachelors', label: 'Bachelor’s or higher' },
      { value: 'masters', label: 'Master’s or higher' },
    ],
  },
  minScore: {
    label: 'Minimum GTH assessment score',
    defaultId: 'any',
    options: [
      { value: 'any', label: 'Any score' },
      { value: '60', label: '60 or higher' },
      { value: '75', label: '75 or higher' },
      { value: '90', label: '90 or higher' },
    ],
  },
  pay: {
    label: 'Expected pay (per month)',
    defaultId: 'up-to-15000',
    options: [
      { value: 'up-to-5000', label: 'Up to GHS 5,000' },
      { value: 'up-to-10000', label: 'Up to GHS 10,000' },
      { value: 'up-to-15000', label: 'Up to GHS 15,000' },
      { value: 'up-to-25000', label: 'Up to GHS 25,000' },
    ],
  },
  checkboxes: [
    {
      id: 'verified',
      label: 'Verified skills only',
      description: 'Skills backed by a GTH assessment',
      defaultOn: true,
    },
    {
      id: 'adult',
      label: 'Show talent 18+ only',
      description: 'Always on for full-time roles',
      defaultOn: true,
    },
    { id: 'hide-pipeline', label: 'Hide talent already in my pipelines', defaultOn: false },
  ],
  clearAll: 'Clear all',
  showResults: (count) => `Show ${count} talents`,
  resultCount: 9,
};

/* ------------------------------------------------------------------ states (TS-08 / TS-09 / TS-10) */
export const LOADING_SUBTITLE = 'Finding matches for Senior Product Engineer…'; // TS-08, node 10102:40637
export const LOADING_SKELETON_COUNT = 6;

export const NO_RESULTS = {
  // TS-09, node 10102:40976
  subtitle: 'No matches for these filters',
  title: 'No talent matches all your filters',
  body: 'Try removing one of these. We’ll show how many talents each change would bring back.',
  clearAll: 'Clear all filters',
  askAssistant: 'Ask Hiring Assistant',
  applyLabel: 'Apply',
  suggestions: [
    // ⚠️ ASSUMPTION: what Apply changes in the URL (Figma draws only the rows).
    // ⚠️ ASSUMPTION: no Rust chip is drawn, so Apply on this row just lifts the empty state the same way "Include remote talent" does.
    { id: 'remove-rust', label: 'Remove “Rust”', gain: '+7 talents', apply: { remote: null } },
    {
      id: 'experience-5-plus',
      label: 'Experience 5+ years instead of 10+',
      gain: '+11 talents',
      apply: { exp: '5-plus' },
    },
    {
      id: 'include-remote',
      label: 'Include remote talent',
      gain: '+24 talents',
      apply: { remote: null },
    },
  ],
};

export const FIRST_VISIT = {
  // TS-10, node 10102:41213
  title: { lead: 'Talent Search', accent: '' },
  subtitle: 'Search 18,400 verified talents across Ghana by skill, role or school.',
  exploreFilters: 'Explore Filters',
  rolesHeading: 'Start from one of your open roles',
  seeMatches: 'See matches',
  // ⚠️ ASSUMPTION: role ids / titles used for the ?job= key.
  roles: [
    {
      id: 'senior-ux-designer',
      title: 'Senior UX Designer',
      meta: 'Figma · Design systems · 5+ yrs',
      matches: '62 strong matches',
    },
    {
      id: 'product-designer',
      title: 'Product Designer',
      meta: 'Figma · Prototyping · Accra',
      matches: '62 strong matches',
    },
    {
      id: 'data-analyst',
      title: 'Data Analyst',
      meta: 'Excel · PowerBI · Accra',
      matches: '62 strong matches',
    },
  ],
  popularHeading: 'Popular searches',
  popular: [
    'React developers in Accra',
    'Data analysts, open to work',
    'NSS graduates · accounting',
    'Product designers with fintech',
    'KNUST computer science 2026',
  ],
};

/* ------------------------------------------------------------------ mock ranking fields (⚠️ ASSUMPTION: none of these are drawn; they back the sort menu) */
export const SORT_FIELDS = {
  'kofi-amankwah': {
    lastActiveDaysAgo: 1,
    assessmentScore: 95,
    availableInDays: 0,
    openToWork: true,
    experienceYears: 7,
  },
  'ama-boateng': {
    lastActiveDaysAgo: 0,
    assessmentScore: 88,
    availableInDays: 0,
    openToWork: true,
    experienceYears: 6,
  },
  'godfred-ansah': {
    lastActiveDaysAgo: 5,
    assessmentScore: 71,
    availableInDays: null,
    openToWork: false,
    experienceYears: 2,
  },
};
