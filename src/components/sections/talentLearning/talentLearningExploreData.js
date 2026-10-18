import face1 from '../../../assets/notifications/avatars/face-1.png';
import face2 from '../../../assets/notifications/avatars/face-2.png';
import face3 from '../../../assets/notifications/avatars/face-3.png';
import face4 from '../../../assets/notifications/avatars/face-4.png';

/*
 * Explore courses — mock data, every string verbatim from Figma EX-01..EX-04
 * (Focused 8110:19619 / 20029 / 20429 / 20769, Playful 7538:1631 / 2064 / 2488 / 2872).
 * `cover` picks the cover art (ExploreCover* in shared/assets.jsx); `chip.tone` is 'match' (green,
 * target icon in Focused) or 'social' (amber, users icon in Focused; neutral white pill in Playful).
 */

export const EXPLORE_HEADER = {
  title: 'Explore courses',
  count: '142 free',
  subtitle:
    '142 free courses picked for young Ghanaian talent. Learn anything, 15 minutes at a time.',
  faces: [face1, face2, face3, face4],
  inProgress: '3 courses in progress',
  sticker: '15 min a day is enough',
  xp: '+120 XP this week',
};

export const SEARCH_PLACEHOLDER = 'Search courses, skills or tools… e.g. Excel, interviews, Figma';
export const CLEAR_SEARCH_LABEL = 'Clear search';

export const CATEGORIES = [
  { id: 'data', label: 'Data & analytics', count: '32', icon: 'chart', tint: '#ebf1ec' },
  { id: 'software', label: 'Software & tech', count: '41', icon: 'code', tint: '#eaeffb' },
  { id: 'design', label: 'Design', count: '18', icon: 'pen', tint: '#f5f3ff' },
  { id: 'business', label: 'Business & sales', count: '22', icon: 'briefcase', tint: '#faf4e8' },
  { id: 'soft', label: 'Soft skills', count: '15', icon: 'heart', tint: '#f9ebea' },
  { id: 'interview', label: 'Interview prep', count: '9', icon: 'mic', tint: '#fef5eb' },
  { id: 'agri', label: 'Agribusiness', count: '5', icon: 'leaf', tint: '#e8f2ed' },
];

export const MATCHES_ROW = {
  title: 'For your matches',
  sticker: 'closes your gaps',
  seeAll: 'See all →',
  courses: [
    {
      id: 'power-bi-basics',
      title: 'Power BI Basics',
      meta: '2h · Free · Certificate',
      cover: 'PowerBi',
      chip: { tone: 'match', label: '+6% on Data Analyst · Accra Tech' },
    },
    {
      id: 'figma-for-beginners',
      title: 'Figma for Beginners',
      meta: '3h · Free · Certificate',
      cover: 'Figma',
      chip: { tone: 'match', label: '+5% on Junior Product Analyst' },
    },
    {
      id: 'python-for-data',
      title: 'Python for Data',
      meta: '4h · Free · Certificate',
      cover: 'Python',
      chip: { tone: 'match', label: '+4% on Junior Data Engineer' },
    },
  ],
};

export const POPULAR_ROW = {
  title: 'Popular in Ghana this week',
  seeAll: 'See all →',
  courses: [
    {
      id: 'interview-confidence',
      title: 'Interview Confidence',
      meta: '45 min · Free',
      cover: 'Interview',
      chip: { tone: 'social', label: '2,300 talents took this' },
    },
    {
      id: 'agribusiness-101',
      title: 'Agribusiness 101',
      meta: '1h 20m · Free',
      cover: 'Agribusiness',
      chip: { tone: 'social', label: 'Trending in Tamale & Kumasi' },
    },
    {
      id: 'speak-up-at-work',
      title: 'Speak Up at Work',
      meta: '30 min · Free',
      cover: 'Speaker',
      chip: { tone: 'social', label: '1,100 talents this month' },
    },
  ],
};

export const CATEGORY_VIEW = {
  title: 'Data & analytics',
  count: '32 courses',
  subtitle: '32 courses · from your first spreadsheet to real dashboards.',
  filtersTitle: 'Filters',
  matchLabel: '12 courses match your filters',
  sort: 'Best for my matches',
  groups: [
    {
      id: 'level',
      label: 'LEVEL',
      options: [
        { id: 'beginner', label: 'Beginner', checked: true },
        { id: 'intermediate', label: 'Intermediate' },
        { id: 'advanced', label: 'Advanced' },
      ],
    },
    {
      id: 'length',
      label: 'LENGTH',
      options: [
        { id: 'under-1h', label: 'Under 1 hour' },
        { id: '1-3h', label: '1–3 hours', checked: true },
        { id: '3h-plus', label: '3+ hours' },
      ],
    },
    {
      id: 'extras',
      label: 'EXTRAS',
      options: [
        { id: 'free', label: 'Free only', checked: true },
        { id: 'certificate', label: 'With certificate', checked: true },
        { id: 'project', label: 'Has a project' },
      ],
    },
    {
      id: 'language',
      label: 'LANGUAGE',
      options: [
        { id: 'english', label: 'English', checked: true },
        { id: 'twi', label: 'Twi · coming soon' },
      ],
    },
  ],
  courses: [
    {
      id: 'power-bi-basics',
      title: 'Power BI Basics',
      meta: '2h · Beginner · Certificate',
      cover: 'PowerBi',
      chip: { tone: 'match', label: '+6% on 2 matched roles' },
    },
    {
      id: 'sql-for-data-analysis',
      title: 'SQL for Data Analysis',
      meta: '3h · Beginner · Certificate',
      cover: 'Sql',
      chip: { tone: 'match', label: 'In progress · 57%' },
    },
    {
      id: 'excel-pivot-tables',
      title: 'Excel: Pivot Tables',
      meta: '1h · Beginner · Free',
      cover: 'Excel',
      chip: { tone: 'social', label: 'Popular in Accra' },
    },
    {
      id: 'statistics-refresher',
      title: 'Statistics Refresher',
      meta: '1h 30m · Beginner',
      cover: 'Statistics',
      chip: { tone: 'match', label: '+3% on 2 matched roles' },
    },
    {
      id: 'python-for-data',
      title: 'Python for Data',
      meta: '4h · Beginner · Certificate',
      cover: 'Python',
      chip: { tone: 'match', label: '+4% on Junior Data Engineer' },
    },
    {
      id: 'farm-data-with-sheets',
      title: 'Farm Data with Sheets',
      meta: '1h 10m · Beginner',
      cover: 'Agribusiness',
      chip: { tone: 'social', label: 'New this week' },
    },
  ],
};

export const SEARCH_VIEW = {
  relatedLabel: 'Related:',
  related: ['Dashboards', 'Data visualisation', 'Excel', 'DAX'],
  viewCourse: 'View course',
  bestMatch: 'best match',
  // `keywords` feed the demo search (the frames only show the query "power bi").
  results: [
    {
      id: 'power-bi-basics',
      title: 'Power BI Basics',
      meta: '2h · 6 modules · Beginner · Free · Certificate',
      cover: 'PowerBi',
      best: true,
      chip: { tone: 'match', label: '+6% on Data Analyst · Accra Tech' },
      keywords: ['power bi', 'dashboards', 'data visualisation'],
    },
    {
      id: 'power-bi-dax',
      title: 'Power BI: DAX in Practice',
      meta: '2h 30m · Intermediate · Free',
      cover: 'PowerBi',
      chip: { tone: 'social', label: 'Next step after Basics' },
      keywords: ['power bi', 'dax', 'dashboards'],
    },
    {
      id: 'excel-to-power-bi',
      title: 'From Excel to Power BI',
      meta: '50 min · Beginner · Free',
      cover: 'Excel',
      chip: { tone: 'social', label: 'Great if you know Excel' },
      keywords: ['power bi', 'excel'],
    },
    {
      id: 'dashboards-story',
      title: 'Dashboards That Tell a Story',
      meta: '1h · Beginner · Free',
      cover: 'Statistics',
      chip: { tone: 'social', label: 'Works with Power BI or Sheets' },
      keywords: ['power bi', 'dashboards', 'data visualisation', 'sheets'],
    },
  ],
};

export const NO_RESULTS = {
  title: 'No course for that… yet',
  body: 'Tell us you want it. When enough talents ask, we build it, and you’ll be the first to know.',
  request: 'Request this course',
  askBuddy: 'Ask Career Buddy',
  closestLabel: 'Closest we have:',
  closest: ['Agribusiness 101', 'Farm Data with Sheets', 'Intro to Fintech'],
};

// The queries shown in the frames (used to seed the ?ex=search / ?ex=none URL states).
export const DEMO_QUERY_SEARCH = 'power bi';
export const DEMO_QUERY_NONE = 'blockchain for farmers';

export const searchCourses = (query) => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return SEARCH_VIEW.results.filter(
    (c) => c.title.toLowerCase().includes(q) || c.keywords.some((k) => k.includes(q))
  );
};

export const resultsHeading = (count, query) =>
  `${count} ${count === 1 ? 'course' : 'courses'} for “${query.trim()}”`;
