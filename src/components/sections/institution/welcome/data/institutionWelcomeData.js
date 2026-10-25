/*
 * institutionWelcomeData.js — MOCK copy of the welcome modal and the 3-step tour (Figma 11.1.3a 8744:428914, 11.1.3b-d 8744:429486 / 430003 / 430559).
 * Copy is verbatim from the frames (curly quotes, middle dots). Sample content only.
 */

export const WELCOME = {
  title: ['Akwaaba, {first}. Let’s get ', 'your students seen.'],
  body: '{institution} is verified. Here’s a quick tour of what your school can do on GTH.',
  milestones: [
    { id: 'add', icon: 'eye', title: 'Add', text: 'CSV or one at a time' },
    { id: 'verify', icon: 'trendUp', title: 'Verify', text: 'Check records, issue credentials' },
    { id: 'track', icon: 'trophy', title: 'Track', text: 'See where your students go next' },
  ],
  primary: 'Take the 30-second tour',
  secondary: 'Look around first',
  extras: [
    { id: 'video', icon: 'play', label: 'Watch a 2-minute video' },
    { id: 'language', icon: 'globe', label: 'English (Ghana) · change' },
    { id: 'contrast', icon: 'eye', label: 'Larger text or high contrast' },
  ],
};

// target: the element the spotlight wraps (resolved at runtime, see InstitutionTour).
export const TOUR_STEPS = [
  {
    id: 1,
    target: 'quick-students',
    title: 'Start with your students',
    text: 'Add your roster by CSV or one at a time. Every Ghana Card is checked and duplicates are flagged first.',
    next: 'Next',
  },
  {
    id: 2,
    target: 'rail-nav',
    title: 'Everything lives here',
    text: 'Students, records, credentials, programmes and progress. Staff, roles and settings sit under your name, top right.',
    next: 'Next',
  },
  {
    id: 3,
    target: 'checklist',
    title: 'Four steps to get going',
    text: 'Upload your roster, invite your staff and post a programme. Each step switches on something new.',
    next: 'Finish tour',
  },
];
