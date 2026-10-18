import { useSyncExternalStore } from 'react';
import face1 from '../../../assets/notifications/avatars/face-1.png';
import face2 from '../../../assets/notifications/avatars/face-2.png';
import face3 from '../../../assets/notifications/avatars/face-3.png';
import face4 from '../../../assets/notifications/avatars/face-4.png';

/*
 * Talent My Learning · hub — mock data (frontend-only; swap for an API later, keep the shapes).
 * Every string is verbatim from the Figma frames ML-01 / ML-06 / ML-07 / ML-08 / SV-01..SV-03
 * (file Bin8roWL8sloyc36IgFMuT; ids in wiki/talent-my-learning.md). "pts" (Focused) vs "XP" (Playful)
 * is rendered by <Unit /> in the components, never stored here.
 */

export const HEADER = {
  title: 'My Learning',
  subtitle: 'Short courses that close your skill gaps and get you matched faster.',
  streak: '12-day streak',
  newHere: 'new here?',
  // "GTH · Messages header art" (Playful only). Figma kept the instance's layer names but the
  // overridden texts below are what the frames show.
  art: {
    faces: [face1, face2, face3, face4],
    inbox: '3 courses in progress',
    sticker: '15 min a day is enough',
    xp: '+120 XP this week',
  },
};

export const TABS = [
  { key: 'progress', label: 'In progress' },
  { key: 'recommended', label: 'Recommended' },
  { key: 'saved', label: 'Saved' },
  { key: 'completed', label: 'Completed' },
  { key: 'certificates', label: 'Certificates' },
];

export const SAVED_TOTAL = 3;
const BASE_COUNTS = { progress: 3, recommended: 8, saved: 2, completed: 4, certificates: 4 };

// ML-07 (nothing started) zeroes progress / completed / certificates; SV-02 shows 3 saved, SV-03 zero.
// `removedCount` = courses un-saved this session (savedStore) so the tab count follows the list.
export const tabCounts = ({ empty, activeTab, savedEmpty, removedCount = 0 }) => {
  const counts = { ...BASE_COUNTS };
  if (empty && activeTab !== 'saved') {
    counts.progress = 0;
    counts.completed = 0;
    counts.certificates = 0;
  }
  counts.saved = Math.max(0, BASE_COUNTS.saved - removedCount);
  if (activeTab === 'saved') {
    counts.saved = savedEmpty ? 0 : Math.max(0, SAVED_TOTAL - removedCount);
  }
  return counts;
};

export const COURSES = {
  powerBi: {
    id: 'power-bi-basics',
    title: 'Power BI Basics',
    cover: 'powerBi',
    metaShort: '2h · Free · Certificate',
    metaFull: '2h · 6 modules · Free · Certificate',
    metaPick: '2h · Free',
    chip: { kind: 'gap', text: '+6% on Data Analyst · Accra Tech', pick: '+6% on Data Analyst' },
    tags: { certificate: true, matches: true },
  },
  figma: {
    id: 'figma-for-beginners',
    title: 'Figma for Beginners',
    cover: 'figma',
    metaShort: '3h · Free · Certificate',
    metaFull: '3h · 8 modules · Free · Certificate',
    chip: { kind: 'gap', text: '+5% on Junior Product Analyst' },
    tags: { certificate: true, matches: true },
  },
  statistics: {
    id: 'statistics-refresher',
    title: 'Statistics Refresher',
    cover: 'statistics',
    metaShort: '1h 30m · Free',
    metaFull: '1h 30m · 4 modules · Free',
    metaPick: '1h 30m · Free',
    chip: { kind: 'gap', text: '+3% on 2 matched roles', pick: '+3% on 2 roles' },
    tags: { underTwoHours: true, matches: true },
  },
  interview: {
    id: 'interview-confidence',
    title: 'Interview Confidence',
    cover: 'interview',
    metaFull: '45 min · 3 modules · Free',
    chip: { kind: 'social', text: '2,300 Ghanaian talents took this' },
    tags: { underTwoHours: true, popular: true },
  },
  python: {
    id: 'python-for-data',
    title: 'Python for Data',
    cover: 'python',
    metaFull: '4h · 10 modules · Free · Certificate',
    chip: { kind: 'gap', text: '+4% on Junior Data Engineer · Zeepay' },
    tags: { certificate: true, matches: true },
  },
  excel: {
    id: 'excel-pivot-tables',
    title: 'Excel: Pivot Tables',
    cover: 'excel',
    metaFull: '1h · 3 modules · Free',
    chip: { kind: 'social', text: 'Popular in Accra this week' },
    tags: { underTwoHours: true, popular: true },
  },
};

// ---- ML-01 In progress ------------------------------------------------------------------
export const CONTINUE = {
  label: 'PICK UP WHERE YOU LEFT OFF',
  left: '18 min left',
  title: 'SQL for Data Analysis',
  meta: 'Module 4 of 7 · Window functions · GTH Academy',
  pct: 57,
  cover: 'sql',
  resume: 'Resume module 4',
  overview: 'Course overview',
};

export const ALSO_IN_PROGRESS = {
  heading: 'Also in progress',
  resume: 'Resume',
  items: [
    {
      id: 'frontend-interview-prep',
      title: 'Frontend Interview Prep',
      meta: 'Module 2 of 5 · 35 min left',
      pct: 40,
      cover: 'frontend',
    },
    {
      id: 'excel-for-business',
      title: 'Excel for Business',
      meta: 'Module 1 of 6 · 1h 10m left',
      pct: 20,
      cover: 'excel',
    },
  ],
};

export const SKILL_GAPS = {
  heading: 'Close your skill gaps',
  sticker: 'picked for your matches',
  seeAll: 'See all 8 →',
  start: 'Start course',
  items: ['powerBi', 'figma', 'statistics'],
};

export const WEEKLY = {
  label: 'THIS WEEK',
  ring: '3/5',
  done: 'lessons done',
  more: '2 more to hit your goal',
  progress: 3 / 5,
  // M T W T F S S — `on` = a lesson that day; `today` = ringed.
  days: [
    { d: 'M', on: true },
    { d: 'T', on: true },
    { d: 'W', on: false },
    { d: 'T', on: true },
    { d: 'F', on: true, today: true },
    { d: 'S', on: false },
    { d: 'S', on: false },
  ],
};

export const LEVEL = {
  title: 'Level 4 · Data Explorer',
  have: '620 / 800',
  next: 'to Level 5',
  pct: 77, // Figma bar 232.5 / 302 px
};

export const CERTS = {
  title: '4 certificates',
  viewAll: 'View all →',
  latest: 'Latest: Intro to Product Thinking · 12 May',
  skills: ['SQL Basics', 'Product thinking', 'Excel'],
};

// ---- ML-06 Recommended -------------------------------------------------------------------
export const RECOMMENDED = {
  filters: [
    { key: 'matches', label: 'For my matches' },
    { key: 'free', label: 'Free' },
    { key: 'short', label: 'Under 2 hours' },
    { key: 'certificate', label: 'With certificate' },
    { key: 'popular', label: 'Popular in Ghana' },
  ],
  search: 'Search courses',
  banner: 'Picked from the skills your 6 matched roles ask for, plus your readiness gaps.',
  start: 'Start course',
  items: ['powerBi', 'figma', 'statistics', 'interview', 'python', 'excel'],
};

// Every Figma course is free; the others are real flags (see COURSES[*].tags).
export const matchesFilter = (course, filter) => {
  if (filter === 'free') return true;
  if (filter === 'short') return Boolean(course.tags.underTwoHours);
  if (filter === 'certificate') return Boolean(course.tags.certificate);
  if (filter === 'popular') return Boolean(course.tags.popular);
  return true; // "For my matches" = the full ranked list in Figma
};

// ---- ML-07 empty --------------------------------------------------------------------------
export const EMPTY = {
  title: 'Nothing in progress yet',
  body: 'Start with a short course. These two close the gaps your matched roles care about most.',
  picks: ['powerBi', 'statistics'],
  explore: 'Explore courses',
  buddy: 'Ask Career Buddy what to learn',
};

// ---- ML-08 loading ------------------------------------------------------------------------
export const LOADING = { note: 'Loading your courses…' };

// ---- SV-01 toast / SV-02 saved / SV-03 saved empty ---------------------------------------------
export const SAVED_TOAST = {
  title: 'Saved for later',
  body: 'Find it in My Learning › Saved. We’ll nudge you Saturday.',
  view: 'View',
  undo: 'Undo',
};

export const SAVED = {
  banner:
    'Saved courses wait here. If you haven’t started one, we’ll nudge you on Saturday morning.',
  count: (n) => `${n} saved`,
  start: 'Start course',
  items: [
    { course: 'powerBi', when: 'Saved just now' },
    { course: 'interview', when: 'Saved 2 days ago' },
    { course: 'python', when: 'Saved last week' },
  ],
};

export const SAVED_EMPTY = {
  title: 'Nothing saved yet',
  body: 'Tap Save for later on any course and it waits here, ready when you are.',
  explore: 'Explore courses',
  recommended: 'See recommended',
};

// ---- session-only "saved" store (mock; an API call replaces it) ----------------------------------
// Lets the Saved tab's unsave button keep the tab count in LearningHub in sync.
let removed = [];
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

export const savedStore = {
  getRemoved: () => removed,
  remove: (course) => {
    if (removed.includes(course)) return;
    removed = [...removed, course];
    emit();
  },
  subscribe: (l) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export const useRemovedSaved = () =>
  useSyncExternalStore(savedStore.subscribe, savedStore.getRemoved, savedStore.getRemoved);
