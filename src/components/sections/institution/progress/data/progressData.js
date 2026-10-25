import storyTamale from '../../../../../assets/public-data/outcomes/story-data-internship-tamale.jpg';
import storyVolta from '../../../../../assets/public-data/outcomes/story-nursing-scholarship-volta.jpg';
import storyAshanti from '../../../../../assets/public-data/outcomes/story-solar-apprenticeship-ashanti.jpg';

/*
 * progressData.js — MOCK data of the institution "Progress" screens (Figma 11.3.2a-e: students list 8595:92, student detail 8595:653, flag 8595:1413,
 * class outcomes 8745:47, download 8745:822). Shaped like the future API: GET /institution/progress/students?form=&status=, GET
 * /institution/progress/students/:id, POST /institution/progress/students/:id/coaching-flags, GET /institution/progress/class-outcomes,
 * POST /institution/progress/outcomes-reports. Texts verbatim from the frames. Student rows are the institution's own roster data, drawn as in
 * Figma; the aggregates of the class outcomes page are printed through the Theme 8 components (formatCount).
 */

/* ---- BLOCK 1 · list page ---- */
export const PROGRESS_COPY = {
  title: 'Progress',
  chip: 'Form 3 · term 1',
  subtitle:
    'How your students are doing on GTH: profiles, skills, results and programmes. Under-18 data stays inside your school.',
  banner:
    '33 students haven’t opened GTH in 30 days. Flag them for a coaching chat with their form teacher.',
  exportLabel: 'Export report',
};

export const PROGRESS_FORMS = [
  { id: 'form-1', label: 'Form 1', count: '298' },
  { id: 'form-2', label: 'Form 2', count: '302' },
  { id: 'form-3', label: 'Form 3', count: '247' },
  { id: 'graduates', label: 'Graduates', count: '1,204' },
];

export const PROGRESS_FILTERS = [
  { id: 'all', label: 'All 247' },
  { id: 'on-track', label: 'On track 198' },
  { id: 'needs-support', label: 'Needs support 33' },
];

/* ⚠️ ASSUMPTION: Figma draws "Lowest first" only; the other two options are the obvious opposites. */
export const PROGRESS_SORTS = [
  { id: 'lowest', label: 'Lowest first' },
  { id: 'highest', label: 'Highest first' },
  { id: 'name', label: 'Name A–Z' },
];

/* status: on-track | support | flagged */
export const PROGRESS_STUDENTS = [
  {
    id: 'abena-mahama',
    name: 'Abena Mahama',
    initials: 'AM',
    status: 'on-track',
    stream: 'General Science',
    results: 4,
    programmes: 2,
    meta: 'General Science · 4 verified results · 2 programmes',
    activity: 'Active today',
    skills: '6 skills',
    profile: 91,
  },
  {
    id: 'akosua-sarpong',
    name: 'Akosua Sarpong',
    initials: 'AS',
    status: 'on-track',
    stream: 'General Arts',
    results: 3,
    programmes: 1,
    meta: 'General Arts · 3 verified results · 1 programme',
    activity: 'Active 2d ago',
    skills: '4 skills',
    profile: 78,
  },
  {
    id: 'ibrahim-yakubu',
    name: 'Ibrahim Yakubu',
    initials: 'IY',
    status: 'on-track',
    stream: 'Technical',
    results: 2,
    programmes: 1,
    meta: 'Technical · 2 verified results · 1 programme',
    activity: 'Active 5d ago',
    skills: '5 skills',
    profile: 88,
  },
  {
    id: 'esi-quaye',
    name: 'Esi Quaye',
    initials: 'EQ',
    status: 'on-track',
    stream: 'Home Economics',
    results: 2,
    programmes: 0,
    meta: 'Home Economics · 2 verified results',
    activity: 'Active 9d ago',
    skills: '3 skills',
    profile: 67,
  },
  {
    id: 'kofi-danso',
    name: 'Kofi Danso',
    initials: 'KD',
    status: 'support',
    stream: 'Business',
    results: 1,
    programmes: 0,
    meta: 'Business · 1 verified result · no programmes',
    activity: 'No activity 34 days',
    skills: '1 skill',
    profile: 42,
  },
  {
    id: 'yaw-adomako',
    name: 'Yaw Adomako',
    initials: 'YA',
    status: 'flagged',
    stream: 'Visual Arts',
    results: 0,
    programmes: 0,
    meta: 'Visual Arts · coaching with Mr Owusu on 22 Oct',
    teacher: 'Form teacher',
    booked: 'Coaching booked',
    profile: 0,
  },
];

/*
 * ⚠️ ASSUMPTION: only the Form 3 list is drawn. Form 1, Form 2 and Graduates show a short SAMPLE list of the same row shape (invented sample
 * names, no real people) so the tabs work; the counts on the tabs stay as drawn.
 */
export const PROGRESS_OTHER_FORMS = {
  'form-1': [
    {
      id: 'sample-adwoa-boateng',
      name: 'Adwoa Boateng',
      initials: 'AB',
      status: 'on-track',
      stream: 'General Science',
      results: 1,
      programmes: 0,
      meta: 'General Science · 1 verified result · no programmes',
      activity: 'Active today',
      skills: '2 skills',
      profile: 72,
    },
    {
      id: 'sample-yaa-frimpong',
      name: 'Yaa Frimpong',
      initials: 'YF',
      status: 'support',
      stream: 'General Arts',
      results: 0,
      programmes: 0,
      meta: 'General Arts · no verified results · no programmes',
      activity: 'No activity 41 days',
      skills: '1 skill',
      profile: 35,
    },
  ],
  'form-2': [
    {
      id: 'sample-nana-osei',
      name: 'Nana Osei',
      initials: 'NO',
      status: 'on-track',
      stream: 'Business',
      results: 2,
      programmes: 1,
      meta: 'Business · 2 verified results · 1 programme',
      activity: 'Active 3d ago',
      skills: '3 skills',
      profile: 80,
    },
    {
      id: 'sample-selina-tetteh',
      name: 'Selina Tetteh',
      initials: 'ST',
      status: 'support',
      stream: 'Technical',
      results: 1,
      programmes: 0,
      meta: 'Technical · 1 verified result · no programmes',
      activity: 'No activity 36 days',
      skills: '1 skill',
      profile: 44,
    },
  ],
  graduates: [
    {
      id: 'sample-kwame-asante',
      name: 'Kwame Asante',
      initials: 'KA',
      status: 'on-track',
      stream: 'Class of 2025',
      results: 3,
      programmes: 1,
      meta: 'Class of 2025 · 3 verified results · 1 programme',
      activity: 'Active 1d ago',
      skills: '6 skills',
      profile: 94,
    },
  ],
};

/* ---- BLOCK 2 · student detail (Kofi Danso, 8595:653) ---- */
export const KOFI_DETAIL = {
  id: 'kofi-danso',
  name: 'Kofi Danso',
  first: 'Kofi',
  sticker: 'Open to scholarships',
  verified: 'Verified',
  handle: 'he/him · joined Sep 2024',
  headline: 'Form 3 · Business · Savannah Hills SHS · Tamale',
  chips: [
    { label: 'Scholarships · University', icon: 'target', tone: 'green' },
    { label: 'Tamale · Northern', icon: 'pin', tone: 'white' },
    { label: 'English · Twi', icon: 'lang', tone: 'white' },
  ],
  stats: [
    { value: '1', label: 'verified skills' },
    { value: '2', label: 'endorsements' },
    { value: '14 Sep', label: 'last active' },
  ],
  bar: {
    title: 'Kofi Danso · progress',
    sub: 'No activity for 34 days. Profile 42% complete. Only you and his form teacher see this view.',
  },
  about: {
    text: 'Form 3 business student. Interested in accounting and running a small business.',
    vibe: [
      { label: 'Analytical', icon: 'analytical' },
      { label: 'Calm under pressure', icon: 'calm' },
      { label: 'Team player', icon: 'team' },
      { label: 'Football · Afrobeats', icon: 'heart' },
    ],
  },
  skills: [
    {
      key: 'accounting',
      icon: 'bar',
      name: 'Accounting',
      chip: { label: 'Assessed', tone: 'green' },
      pct: 86,
      note: 'B3 · mock',
    },
    {
      key: 'economics',
      icon: 'dns',
      name: 'Economics',
      chip: { label: 'Skills Lab', tone: 'white' },
      pct: 78,
      note: 'B3 · mock',
    },
    {
      key: 'maths',
      icon: 'func',
      name: 'Maths',
      chip: { label: 'Assessed', tone: 'green' },
      pct: 62,
      note: 'C4 · mock',
    },
    {
      key: 'communication',
      icon: 'voice',
      name: 'Communication',
      chip: { label: 'Endorsed', tone: 'white' },
      pct: 70,
      note: '8 endorsements',
    },
  ],
  experience: [
    {
      key: 'treasurer',
      icon: 'trend',
      iconBg: '#eaeffb',
      title: 'Class treasurer',
      meta: 'Savannah Hills SHS · Tamale  ·  Sep 2025 – now',
      text: 'Keeps the class fund records for Form 3B.',
      tags: ['Economics', 'Leadership', 'Events'],
    },
    {
      key: 'shop',
      icon: 'grad',
      iconBg: '#faf4e8',
      title: 'Weekend shop assistant',
      meta: 'Savannah Hills SHS  ·  Jan 2025 – now',
      text: 'Helps at the family provisions shop on Saturdays.',
      tags: ['Tutoring', 'Public speaking'],
    },
  ],
  portfolio: [
    {
      key: 'sales',
      cover: 'bars',
      tag: 'Project',
      title: 'Shop sales tracker',
      meta: 'Personal · 2026',
    },
    { key: 'budget', cover: 'line', tag: 'Poster', title: 'Budget plan', meta: 'Personal · 2026' },
    {
      key: 'essay',
      cover: 'dots',
      tag: 'Essay',
      title: 'Why I want to study accounting',
      meta: 'English · 2026',
    },
  ],
  rail: {
    sticker: 'Term 1 progress',
    title: '42% · needs support',
    text: '1 verified result, 1 skill, no programmes yet. Last opened GTH on 14 Sep.',
    termTitle: 'This term',
    rows: [
      { icon: 'video', text: 'Profile 42% · class average 76%' },
      { icon: 'target', text: '1 verified result' },
      { icon: 'file', text: '1 skill assessed' },
      { icon: 'voice', text: '0 programmes joined' },
      { icon: 'phone', text: 'Last active 14 Sep' },
      { icon: 'wallet', text: 'No coaching yet' },
    ],
    termLink: 'How progress is counted →',
  },
};

export const BADGES_COPY = {
  title: 'Badges',
  link: 'All 9 →',
  items: [
    { key: 'steps', label: 'First steps', bg: '#faf4e8', icon: 'trophy' },
    { key: 'profile', label: 'Profile started', bg: '#ebf1ec', icon: 'checkc' },
    { key: 'quiz', label: 'Quiz Ace', bg: '#eaeffb', icon: 'bulb' },
  ],
};

export const FLAG_COPY = {
  title: (first) => `Flag ${first} for coaching?`,
  body: (first) =>
    `Mr Owusu, his form teacher, gets a task to book a chat this week. ${first} isn’t told he was flagged, only invited to the chat.`,
  confirm: 'Flag for coaching',
  cancel: 'Cancel',
};

/* ---- BLOCK 3 · class outcomes (8745:47) ---- */
export const OUTCOMES_PAGE = {
  title: 'Class outcomes',
  subtitle:
    'Where Savannah Hills students and graduates go next. Only your students are counted, and groups under 5 are hidden.',
  download: 'Download report',
  kpis: {
    placements: {
      count: 401,
      sub: 'Students and alumni since 2024 · ▲ 12% on last year. Jobs, internships and training.',
    },
    scholarships: { valueText: 'GHS 184K', sub: 'Matched to 41 eligible students.' },
    skills: { shareText: '38%', sub: 'of talents have at least one validated skill.' },
    organisations: { count: 27, sub: '9 universities · 11 employers · 7 others.' },
  },
  /* Figma column heights (plot 214px = 50 placements) → placements per month; October is the current month */
  placementsOverTime: [
    ['Nov', 21],
    ['Dec', 19],
    ['Jan', 29],
    ['Feb', 30],
    ['Mar', 32],
    ['Apr', 33],
    ['May', 34],
    ['Jun', 37],
    ['Jul', 39],
    ['Aug', 40],
    ['Sep', 43],
    ['Oct', 44],
  ].map(([label, value]) => ({ key: label, label, value })),
  /* ratio = the bar drawn in Figma over its track (the Figma bars are not proportional to the counts: kept as drawn, capped at the track) */
  placementsByType: [
    { key: 'jobs', label: 'Jobs', count: 82, ratio: 1 },
    { key: 'internships', label: 'Internships', count: 206, ratio: 1 },
    { key: 'training', label: 'Training', count: 88, ratio: 0.63 },
    { key: 'apprenticeships', label: 'Apprenticeships', count: 25, ratio: 0.26 },
  ],
  averageTimeNote: 'Average time from leaving school to placement: 3.1 months',
  skills: {
    count: 483,
    caption: 'students with ≥1 validated skill · 57% of roster',
    sourcesTitle: 'Where the evidence comes from',
    sources: [
      { key: 'assessments', label: 'Assessments', count: 61, tone: 'green' },
      { key: 'games', label: 'Skills Lab games', count: 27, tone: 'orange' },
      { key: 'certificates', label: 'Verified certificates', count: 12, tone: 'blue' },
    ],
  },
  partners: {
    hint: '27 organisations',
    items: [
      { key: 'universities', label: 'Universities', count: 9, ratio: 1 },
      { key: 'employers', label: 'Employers', count: 11, ratio: 0.43 },
      { key: 'training', label: 'Training providers', count: 3, ratio: 0.28 },
      { key: 'ngos', label: 'NGOs', count: 4, ratio: 0.15 },
    ],
  },
  storiesTitle: 'Stories from your alumni',
  storiesSub: 'Shared with each student’s written consent.',
  storiesLink: 'All stories →',
  stories: [
    {
      id: 'ama-k',
      kicker: 'Class of 2025 · Data & analytics',
      title: 'From Tamale to a data internship',
      summary: 'Completed 4 Skills Lab games, matched with a telecom internship in 6 weeks.',
      photo: storyTamale,
    },
    {
      id: 'volta-nursing',
      kicker: 'Class of 2025 · Health',
      title: 'A scholarship for nursing school',
      summary: 'Matched to a GHS 12,000 scholarship through a partner NGO.',
      photo: storyVolta,
    },
    {
      id: 'ashanti-solar',
      kicker: 'Class of 2024 · Entrepreneurship',
      title: 'Apprenticeship to own business',
      summary: 'Placed in a solar-installation apprenticeship, now runs a 3-person team.',
      photo: storyAshanti,
    },
  ],
};

/* ---- BLOCK 4 · download dialog (8745:822) ---- */
export const DOWNLOAD_COPY = {
  chip: 'Outcomes report',
  title: 'Download the class outcomes report',
  body: 'A dated PDF for your board, PTA or GES district office. Groups under 5 stay hidden and the download is logged with your name.',
  options: [
    {
      id: 'snapshot',
      label: 'Class snapshot',
      detail: 'Placements, scholarships and verified skills',
      on: true,
    },
    {
      id: 'readiness',
      label: 'Readiness by form and programme',
      detail: 'Form 1 to Form 3, with class averages',
      on: true,
    },
    {
      id: 'stories',
      label: 'Alumni stories',
      detail: 'Only stories with written consent',
      on: true,
    },
    {
      id: 'names',
      label: 'Student names',
      detail: 'Off by default. Turn on only for internal use.',
      on: false,
    },
  ],
  periodLabel: 'Period',
  periods: [
    { id: 'term', label: 'This term' },
    { id: 'year', label: 'This year' },
    { id: 'class', label: 'Class of 2026' },
    { id: 'custom', label: 'Custom' },
  ],
  note: 'Prepared for: Board of Governors · 24 Oct 2026. This line prints on the cover.',
  cancel: 'Cancel',
  submit: 'Download PDF',
};

/** Mock PDF job (POST /institution/progress/outcomes-reports). ⚠️ ASSUMPTION: a real PDF needs the backend; the report page prints instead. */
export const requestOutcomesReport = (payload) =>
  new Promise((resolve) => {
    window.setTimeout(() => resolve({ id: 'R-2026-1030-SHS', payload }), 1200);
  });
