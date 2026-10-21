/*
 * Interests (stage 2) mock data, API-shaped. Copy verbatim from Figma IN-01..IN-05 (Playful 7706:*, Focused 8285:*).
 * Swap for the API later and keep the shapes.
 */
export const MAX_AREAS = 6;
export const MIN_AREAS = 2;
export const UNLOCK_SPECIFICS = 6;

/* id, label, icon key (interestsIcons), short name used in the stage-complete sentence */
export const AREAS = [
  { id: 'technology', label: 'Technology & Engineering', icon: 'Function', short: 'Technology' },
  { id: 'business', label: 'Business & Finance', icon: 'Wallet', short: 'Business' },
  { id: 'creative', label: 'Creative Arts & Design', icon: 'Image', short: 'Creative Arts' },
  { id: 'health', label: 'Health Sciences', icon: 'Heart', short: 'Health' },
  { id: 'education', label: 'Education', icon: 'Mortar', short: 'Education' },
  { id: 'agriculture', label: 'Agriculture & Environment', icon: 'Globe', short: 'Agriculture' },
  { id: 'law', label: 'Law & Policy', icon: 'Shield', short: 'Law' },
  { id: 'media', label: 'Media & Communication', icon: 'Mic', short: 'Media' },
  { id: 'development', label: 'Development & NGOs', icon: 'Users', short: 'Development' },
];
export const AREA_BY_ID = Object.fromEntries(AREAS.map((a) => [a.id, a]));

/* Draft as drawn in IN-02..IN-05: 3 areas, 5 specifics (Technology is Primary). */
export const SEED_DRAFT = {
  areas: [
    {
      id: 'technology',
      specifics: ['Software development', 'Data science', 'AI and machine learning'],
    },
    { id: 'creative', specifics: ['UI/UX design', 'Brand design'] },
    { id: 'business', specifics: [] },
  ],
};
export const EMPTY_DRAFT = { areas: [] };

/* "Suggested for you" is drawn for Technology only (IN-03). */
export const SUGGESTIONS = {
  technology: [
    'Mobile development',
    'Cloud and infrastructure',
    'Cybersecurity',
    'UI engineering',
    'Fintech',
  ],
};

export const HERO_DEFINITIONS = [
  { icon: 'Heart', text: 'Things you’d do without pay' },
  { icon: 'Book', text: 'Topics you read about for fun' },
  { icon: 'Bolt', text: 'Skills you’re building on the side' },
  { icon: 'Company', text: 'Industries you want to work in' },
];

export const WHY_RAIL = [
  {
    icon: 'Target',
    title: 'Role matches from day one',
    body: 'You’re matched to roles before anything else is filled in.',
  },
  {
    icon: 'Users',
    title: 'Mentor suggestions',
    body: 'Specifics connect you with people in the same niche.',
  },
  { icon: 'Chat', title: 'Communities', body: 'We suggest groups that share your interests.' },
];

export const SWEET_SPOT_RAIL = [
  { icon: 'Target', title: '3–5 areas', body: 'Enough range without diluting your matches.' },
  {
    icon: 'Label',
    title: '6–10 specifics',
    body: 'Specific beats vague: “UI/UX design” over “design”.',
  },
];

export const POPULAR_RAIL = [
  {
    icon: 'TrendUp',
    title: 'Tech, Business and Creative',
    body: 'The top three areas on GTH right now.',
  },
  { icon: 'Heart', title: 'Health and Education', body: 'Growing fastest this year.' },
];

export const ROLE_MATCHES = [
  { id: 'r1', title: 'Data Scientist', company: 'Zeepay · Accra', match: '94%' },
  { id: 'r2', title: 'Product Designer', company: 'mPharma · Accra', match: '88%' },
  { id: 'r3', title: 'Growth Analyst', company: 'Farmerline · Kumasi', match: '82%' },
];
export const ROLE_MATCH_TOTAL = 142;

export const STAGE_DONE_XP = 30;
/* Stage bar behind every frame (incl. IN-05) is drawn "1 of 9 done"; the dialog stats read 2/9 and 22%. */
export const PAGE_DONE_IDS = ['avatar'];
export const COMPLETE_DONE_COUNT = 2;

/* Stage-complete sentence. The drawn string reads "6 specifics" for the 3-area / 5-specific mock (a Figma inconsistency kept as drawn). */
export const completeSummary = (areas, specificsCount) => {
  const live = areas.filter((a) => a.specifics.length > 0).map((a) => AREA_BY_ID[a.id].short);
  const names = live.length ? live.join(' and ') : null;
  const drawn = areas.length === 3 && specificsCount === 5;
  const n = drawn ? 6 : specificsCount;
  return `${areas.length} areas and ${n} specifics. You’re already matched to roles${
    names ? `, and mentor matching is live for ${names}` : ''
  }.`;
};
