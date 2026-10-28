/*
 * Copy of the space switcher of the "Parent who is also a talent" flow (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 12 Parent who is also a talent" 10057:67476, persona Emma Mensah).
 * Verbatim from the Figma `characters` (curly quotes included).
 */
export const SWITCH_MENU = {
  heading: 'SWITCH SPACE',
  parent: { title: 'Parent view', line: 'Abena and Elliot · 2 wards linked' },
  career: { title: 'My career', line: 'Discoverable · 5 of 9 · 18 matches', chip: '2 new' },
  note: 'Each space keeps its own data. Your wards never see your career profile, and recruiters don’t see your wards.',
};

// PD-04 — the sidebar switch card while there is no career profile yet.
export const NO_CAREER = {
  pill: 'Parent view',
  cardTitle: 'Your own career',
  cardLine: 'Learn, get verified and get matched',
  cardCta: 'Build my profile',
};

// PD-04 — "Build your own career profile" (modal 10037:6574).
export const CAREER_DIALOG = {
  title: 'Build your own career profile',
  body: 'GTH works for you too. Learn new skills, get them verified and get matched to roles. It’s a separate space, so your wards never see it.',
  points: [
    'Career Buddy guides you · about 10 minutes',
    'Parent view stays exactly as it is',
    'Switch spaces any time from your profile card',
  ],
  later: 'Not now',
  start: 'Start with Career Buddy',
};

// PN-02 — the bell panel with both spaces (Figma 10037:4551, panel 10037:5199): filter chips and the two My career rows (the five Parent rows are the PN-01 ones).
export const SPACES_PANEL = {
  filters: [
    { id: 'all', label: 'All · 7' },
    { id: 'parent', label: 'Parent · 5' },
    { id: 'career', label: 'My career · 2' },
  ],
  chips: { parent: 'Parent', career: 'My career' },
  careerRows: [
    {
      id: 'match',
      title: 'New match: Junior Data Analyst',
      sub: 'Ecobank · Accra · 3 h',
      to: '/home?as=emma',
    },
    {
      id: 'recruiters',
      title: '2 recruiters found you',
      sub: 'Ecobank and mPharma · 1 h',
      to: '/home?as=emma',
    },
  ],
};
