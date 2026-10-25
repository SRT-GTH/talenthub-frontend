/*
 * recordsData.js — MOCK data of the Theme 11 record verification screens (Figma 11.2.3a-f, canvas 8520:10; shaped like the future
 * GET /institution/records?status=pending|approved|rejected|all and GET /institution/records/:id responses).
 * All names are sample data from the frames. Counts in aggregates go through formatCount() in the views.
 */

/* ---- queue header numbers (Figma 11.2.3a: "23 to verify", tabs 1,486 / 12 / 23 / 1,521, chips All 23 · Results 14 · Certificates 9) ---- */
export const QUEUE_COUNTS = {
  approved: 1486,
  rejected: 12,
  pending: 23,
  all: 1521,
  results: 14,
  certificates: 9,
};

/* Figma 11.2.3f "All caught up": the 23 pending are decided → Approved 1,509 (= 1,486 + 23). */
export const CAUGHT_UP_AVERAGE_DAYS = '2.4';

export const WAITING_LONG_COUNT = 5;

/* ---- "kind" chips and the filter chips ---- */
export const KIND_LABELS = {
  results: 'Results',
  award: 'Award',
  certificate: 'Certificate',
  letter: 'Letter',
};

/* Which filter chip a record kind counts under (Figma: Results 14 · Certificates 9; ⚠️ ASSUMPTION: awards and letters count as certificates). */
export const KIND_FILTER = {
  results: 'results',
  award: 'certificates',
  certificate: 'certificates',
  letter: 'certificates',
};

export const FILTER_CHIPS = [
  { id: 'all', label: 'All' },
  { id: 'results', label: 'Results' },
  { id: 'certificates', label: 'Certificates' },
];

export const SORT_OPTIONS = [
  { id: 'oldest', label: 'Oldest first' },
  { id: 'newest', label: 'Newest first' },
];

/* ---- the queue rows (Figma 11.2.3a). status: pending | needs-info | approved | rejected. waitingDays drives the "Waiting n days" pill. ---- */
export const RECORDS = [
  {
    id: 'rec-1',
    student: 'Abena Mahama',
    initials: 'AM',
    status: 'pending',
    kind: 'results',
    summary: 'WASSCE mock results · Form 3 · submitted 2 Oct',
    title: 'WASSCE mock results',
    submittedOn: '2 Oct',
    waitingDays: 16,
    possessive: 'Abena’s',
    pronoun: 'She',
    pronounLower: 'she',
    pronounPossessive: 'her',
  },
  {
    id: 'rec-2',
    student: 'Akosua Sarpong',
    initials: 'AS',
    status: 'pending',
    kind: 'award',
    summary: 'Debate champion award · 2026 · submitted 6 Oct',
    title: 'Debate champion award',
    submittedOn: '6 Oct',
    waitingDays: 12,
    possessive: 'Akosua’s',
    pronoun: 'She',
    pronounLower: 'she',
    pronounPossessive: 'her',
  },
  {
    id: 'rec-3',
    student: 'Ibrahim Yakubu',
    initials: 'IY',
    status: 'pending',
    kind: 'certificate',
    summary: 'Robotics club certificate · submitted 9 Oct',
    title: 'Robotics club certificate',
    submittedOn: '9 Oct',
    waitingDays: 9,
    possessive: 'Ibrahim’s',
    pronoun: 'He',
    pronounLower: 'he',
    pronounPossessive: 'his',
  },
  {
    id: 'rec-4',
    student: 'Esi Quaye',
    initials: 'EQ',
    status: 'pending',
    kind: 'results',
    summary: 'Term 2 report card · submitted 11 Oct',
    title: 'Term 2 report card',
    submittedOn: '11 Oct',
    waitingDays: 7,
    possessive: 'Esi’s',
    pronoun: 'She',
    pronounLower: 'she',
    pronounPossessive: 'her',
  },
  {
    id: 'rec-5',
    student: 'Kofi Danso',
    initials: 'KD',
    status: 'pending',
    kind: 'results',
    summary: 'WASSCE mock results · submitted 14 Oct',
    title: 'WASSCE mock results',
    submittedOn: '14 Oct',
    waitingDays: 4,
    possessive: 'Kofi’s',
    pronoun: 'He',
    pronounLower: 'he',
    pronounPossessive: 'his',
  },
  {
    id: 'rec-6',
    student: 'Yaw Adomako',
    initials: 'YA',
    status: 'needs-info',
    kind: 'letter',
    summary: 'Sports prefect letter · you asked for a signed copy',
    title: 'Sports prefect letter',
    askedOn: '9 Oct',
    possessive: 'Yaw’s',
    pronoun: 'He',
    pronounLower: 'he',
    pronounPossessive: 'his',
  },
];

/*
 * ⚠️ ASSUMPTION: the Approved / Rejected tabs are not drawn. They list a few sample, already decided records in the same row layout
 * (the tab counts stay the Figma numbers; only records decided in this session change them).
 */
export const DECIDED_SAMPLES = [
  {
    id: 'rec-7',
    student: 'Efua Boateng',
    initials: 'EB',
    status: 'approved',
    kind: 'results',
    summary: 'WASSCE mock results · Form 3 · submitted 21 Sep',
    title: 'WASSCE mock results',
    possessive: 'Efua’s',
    pronoun: 'She',
    pronounLower: 'she',
    pronounPossessive: 'her',
  },
  {
    id: 'rec-8',
    student: 'Nana Owusu',
    initials: 'NO',
    status: 'approved',
    kind: 'certificate',
    summary: 'First aid certificate · submitted 18 Sep',
    title: 'First aid certificate',
    possessive: 'Nana’s',
    pronoun: 'He',
    pronounLower: 'he',
    pronounPossessive: 'his',
  },
  {
    id: 'rec-9',
    student: 'Selina Tetteh',
    initials: 'ST',
    status: 'rejected',
    kind: 'results',
    summary: 'Term 1 report card · submitted 12 Sep',
    title: 'Term 1 report card',
    possessive: 'Selina’s',
    pronoun: 'She',
    pronounLower: 'she',
    pronounPossessive: 'her',
  },
];

/* ---- record detail (Figma 11.2.3b "Record detail", 8593:575). Only Abena’s profile is drawn: ⚠️ ASSUMPTION the other records show the same sample profile body. ---- */
export const RECORD_DETAIL = {
  heading: 'Open to scholarships',
  tagline: 'she/her · joined Sep 2024',
  location: 'Form 3 · General Science · Savannah Hills SHS · Tamale',
  chips: [
    { id: 'goal', label: 'Scholarships · University', icon: 'target', tone: 'green' },
    { id: 'place', label: 'Tamale · Northern', icon: 'pin' },
    { id: 'lang', label: 'English · Twi', icon: 'voice' },
  ],
  stats: [
    { id: 'skills', value: '5', label: 'verified skills' },
    { id: 'endorsements', value: '24', label: 'endorsements' },
    { id: 'active', value: 'Oct 2026', label: 'last active' },
  ],
  tabs: [
    { id: 'overview', label: 'Overview' },
    { id: 'skills', label: 'Skills', count: '7' },
    { id: 'experience', label: 'Experience', count: '2' },
    { id: 'portfolio', label: 'Portfolio', count: '3' },
    { id: 'certs', label: 'Certs', count: '2' },
    { id: 'about', label: 'About me' },
  ],
  about:
    'Form 3 science student who wants to study medicine. I lead the science club, tutor Form 1s in maths and I’m saving my results here for scholarship applications.',
  vibe: [
    { id: 'analytical', label: 'Analytical', icon: 'bulb' },
    { id: 'calm', label: 'Calm under pressure', icon: 'health' },
    { id: 'team', label: 'Team player', icon: 'users' },
    { id: 'football', label: 'Football · Afrobeats', icon: 'heart' },
  ],
  skills: [
    {
      id: 'biology',
      name: 'Biology',
      icon: 'chartbar',
      badge: 'Assessed',
      strong: true,
      fill: 258,
      note: 'A1 · mock',
    },
    {
      id: 'maths',
      name: 'Mathematics',
      icon: 'dns',
      badge: 'Skills Lab',
      strong: false,
      fill: 234,
      note: 'A1 · mock',
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      icon: 'func',
      badge: 'Assessed',
      strong: true,
      fill: 186,
      note: 'B2 · mock',
    },
    {
      id: 'communication',
      name: 'Communication',
      icon: 'voice',
      badge: 'Endorsed',
      strong: false,
      fill: 210,
      note: '8 endorsements',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      icon: 'trend',
      tone: 'blue',
      role: 'Science club secretary',
      meta: 'Savannah Hills SHS · Tamale  ·  Sep 2025 – now',
      body: 'Run weekly club meetings and organised the 2026 inter-school science fair.',
      tags: ['Mathematics', 'Leadership', 'Events'],
    },
    {
      id: 'exp-2',
      icon: 'grad',
      tone: 'cream',
      role: 'Peer maths tutor',
      meta: 'Savannah Hills SHS  ·  Jan 2025 – now',
      body: 'Help 15 Form 1 students with core maths every Saturday.',
      tags: ['Tutoring', 'Public speaking'],
    },
  ],
  portfolio: [
    { id: 'p-1', cover: 'bars', title: 'Malaria survey, Tamale', meta: 'Science fair · 2026' },
    { id: 'p-2', cover: 'line', title: 'Clean water at home', meta: 'Biology · 2025' },
    { id: 'p-3', cover: 'dots', title: 'Why I want to study medicine', meta: 'English · 2026' },
  ],
  badges: [
    { id: 'b-1', label: 'Science fair', icon: 'trophy', tone: 'cream' },
    { id: 'b-2', label: 'Club lead', icon: 'check', tone: 'green' },
    { id: 'b-3', label: 'Quiz Ace', icon: 'bulb', tone: 'blue' },
  ],
  checks: [
    { id: 'name', label: 'Name matches your roster', icon: null },
    { id: 'index', label: 'Index number matches', icon: 'target' },
    { id: 'grades', label: 'Grades match your mark sheet', icon: 'file' },
    { id: 'issued', label: 'Issued by your school', icon: 'voice' },
    { id: 'edits', label: 'No edits to the file', icon: 'phone' },
    { id: 'dates', label: 'Dates line up', icon: 'wallet' },
  ],
  summaryTitle: 'WASSCE mock · Term 1, 2026',
  summaryBody:
    'Maths A1 · English B2 · Physics B3 · Chemistry B2 · Biology A1 · Elective Maths B3. Uploaded by Abena as a PDF.',
};

/* ---- reject dialog (Figma 11.2.3d). ⚠️ ASSUMPTION: only the drawn reason exists; the other options are not drawn. ---- */
export const REJECT_REASONS = [{ id: 'grades', label: 'Grades don’t match our mark sheet' }];
export const REJECT_NOTE_SAMPLE = 'Chemistry is C4 on our sheet, not B2.';
