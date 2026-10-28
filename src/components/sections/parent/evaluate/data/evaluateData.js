/*
 * evaluateData — copy for the parent "Evaluate my child" flow, section A · Start (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 07 Evaluate my child" 10057:66837).
 * Mock only. Frames: PE-07 10042:3861 (no ward to evaluate yet), PE-01 10034:147583 (choose ward and type), PE-01b 10042:3332 (continue where you left off).
 */
import abena from '../../../../../assets/parent/abena.webp';
import elliot from '../../../../../assets/parent/elliot.webp';

export const EVALUATE_TITLE = 'Evaluate my child';
export const EVALUATE_SUB =
  'Add a parent’s view to your ward’s profile. They review it before it shows.';

export const EMPTY = {
  title: 'Link a ward to evaluate them',
  body: 'Parent evaluations are for wards under 18 who are linked to you. Once your child accepts your link request, you can start.',
  primary: 'Link a ward',
  secondary: 'How evaluations work',
};

export const EVAL_WARDS = [
  { id: 'abena', name: 'Abena', age: 16, photo: abena },
  { id: 'elliot', name: 'Elliot', age: 15, photo: elliot },
];

export const EVAL_TYPES = [
  {
    id: 'general',
    title: 'General evaluation',
    body: 'A rounded picture · 20 questions · about 10 min',
  },
  { id: 'academic', title: 'Academic strengths', body: 'Subjects, study habits · 15 questions' },
  {
    id: 'character',
    title: 'Character & social skills',
    body: 'How they work with others · 15 questions',
  },
  { id: 'career', title: 'Career interests', body: 'What lights them up · 12 questions' },
];

export const RESUME = {
  eyebrow: 'Continue where you left off',
  ward: abena,
  title: 'General evaluation · Abena',
  progress: '6 of 20 answered · saved automatically 2 days ago',
  done: 6,
  total: 20,
  note: 'You can have one evaluation going per ward. Finish or discard this one to start a new one for Abena.',
};
