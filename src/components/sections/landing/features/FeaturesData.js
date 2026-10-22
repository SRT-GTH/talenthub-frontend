import { CareerBuddyDeepDiveIcon } from './FeaturesIcons.jsx';
import {
  Fi20Bulb,
  Fi20Search,
  Fi20Shield,
  Fi20Target,
  FiFire,
  FiGame,
} from '../../../shared/assets.jsx';

/* P-02 Features — copy verbatim from Figma 7797:26426 (desktop) / 7815:261355 (tablet) / 7815:262836 (mobile). */

/* `mock` keys map to components in FeatureMockups.jsx. `flip` = visual on the left at desktop (rows 2, 4, 6, 8). */
export const FEATURES = [
  {
    key: 'career-buddy',
    mock: 'careerBuddy',
    flip: false,
    tint: 'bg-[#84cc16]/35',
    tile: 'bg-[#84cc16]',
    Icon: CareerBuddyDeepDiveIcon,
    eyebrow: 'YOUR AI CAREER GUIDE',
    title: 'Advice that knows you, \nany time.',
    text: 'Ask about roles, pay, interview prep or what to do next. It knows your profile, so the answers fit you.',
    bullets: [
      'Mock interviews for the exact role',
      'Replies in your language where it can',
      'Chats saved to History',
    ],
  },
  {
    key: 'job-readiness',
    mock: 'jobReadiness',
    flip: true,
    tint: 'bg-[#ffd86b]/35',
    tile: 'bg-[#ffd86b]',
    Icon: Fi20Target,
    eyebrow: 'READINESS SCORE',
    title: 'Know how ready you are.',
    text: 'One clear score and the single skill gap to close next, refreshed within a minute of any change.',
    bullets: ['Score unlocks at Top 20%', 'Shows how you compare', 'Points to the fastest fix'],
  },
  {
    key: 'skills-lab',
    mock: 'skillsLab',
    flip: false,
    tint: 'bg-[#f9c9b6]/35',
    tile: 'bg-[#f9c9b6]',
    Icon: FiGame,
    eyebrow: 'SKILLS LAB',
    title: 'Prove it by playing.',
    text: 'Short challenges in React, Python, data, design and leadership turn skills into evidence.',
    bullets: ['10 to 20 minute challenges', 'Scores with top-% ranks', 'Retake any time'],
  },
  {
    key: 'my-assessment',
    mock: 'myAssessment',
    flip: true,
    tint: 'bg-[#84cc16]/35',
    tile: 'bg-[#84cc16]',
    Icon: Fi20Bulb,
    eyebrow: 'MYASSESSMENT',
    title: 'Know your real strengths.',
    text: '15 scenarios from Ghanaian workplaces give you one of 9 archetypes and six trait scores.',
    bullets: [
      'No right or wrong answers',
      'Recruiters see traits, never answers',
      'Retake every 90 days',
    ],
  },
  {
    key: 'verified-skills',
    mock: 'verifiedSkills',
    flip: false,
    tint: 'bg-[#ffd86b]/35',
    tile: 'bg-[#ffd86b]',
    Icon: Fi20Shield,
    eyebrow: 'VERIFIED SKILLS',
    title: 'More than a CV.',
    text: 'Every skill shows how it was proven, from self-reported up to assessment-evidenced.',
    bullets: [
      'Four clear evidence labels',
      'Recruiters see the same labels',
      'Upgrade a skill in one challenge',
    ],
  },
  {
    key: 'streaks',
    mock: 'streaks',
    flip: true,
    tint: 'bg-[#f59638]/35',
    tile: 'bg-[#f59638]',
    Icon: FiFire,
    eyebrow: 'STREAKS, XP AND QUESTS',
    title: 'Small wins, every day.',
    text: 'Keep a streak, finish weekly quests and level up. Missing a day? Use your weekly freeze.',
    bullets: [
      'Any real action counts',
      'Weekly quests with XP',
      'Levels from Starter to Trailblazer',
    ],
  },
  {
    key: 'smart-matching',
    mock: 'smartMatching',
    flip: false,
    tint: 'bg-[#84cc16]/35',
    tile: 'bg-[#84cc16]',
    Icon: Fi20Search,
    eyebrow: 'SMART MATCHING',
    title: 'Opportunities find you.',
    text: 'A fit score on every role, with the reasons. No keyword games, no guesswork.',
    bullets: ['Fit score and reasons', 'Apply in one tap', 'Track every stage'],
  },
];

export const ACCESS = {
  eyebrow: 'ACCESS FOR EVERYONE',
  title: 'Your language, your way.',
  text: 'Use GTH in English (Ghana) today, with Twi, Ga, Ewe, Dagbani and Hausa in beta. Accessibility mode adds high contrast, bigger text, reduced motion and underlined links.',
  languages: [
    { name: 'English (Ghana)', native: 'Default', active: true },
    { name: 'Twi', native: 'Akan kasa' },
    { name: 'Ga', native: 'Gã wiemɔ' },
    { name: 'Ewe', native: 'Eʋegbe' },
    { name: 'Dagbani', native: 'Dagbanli' },
    { name: 'Hausa', native: 'Harshen Hausa' },
  ],
  toggles: [
    { label: 'High contrast', on: true },
    { label: 'Bigger text', on: true },
    { label: 'Reduce motion', on: false },
    { label: 'Underline links', on: true },
  ],
};

export const WEEK_DAYS = [
  { d: 'M', done: true },
  { d: 'T', done: true },
  { d: 'W', done: true },
  { d: 'T', done: true },
  { d: 'F', done: true },
  { d: 'S', done: true },
  { d: 'S', done: false },
];

export const TRAITS = [
  { label: 'Conscientiousness', pct: 88 },
  { label: 'Decisiveness', pct: 79 },
  { label: 'Openness', pct: 72 },
];

export const GAMES = [
  { name: 'React Speedrun', rank: 'Top 11%' },
  { name: 'Python Lab', rank: 'Top 23%' },
  { name: 'Chess', rank: 'Top 38%' },
];
