import {
  FigmaAfterProfileLastIcon,
  FigmaCertificatesIcon,
  FigmaGoalsIcon,
  FigmaTrophyIcon,
  FigmaWorkIcon,
} from './HowItWorksFigmaIcons.jsx';
import {
  AiGlyph,
  BoltGlyph,
  BulbGlyph,
  EyeGlyph,
  FolderGlyph,
  HeartGlyph,
  SearchGlyph,
  ShieldGlyph,
  SuitcaseGlyph,
  TargetGlyph,
  TrendUpGlyph,
  TrophyGlyph,
  UserGlyph,
  VideoGlyph,
} from './HowItWorksIcons.jsx';

/* P-01 How it works — copy verbatim from Figma 7797:19953 (desktop) / 7815:280356 (tablet) / 7815:286952 (mobile). */

/* Pop-card chrome used across the landing set: 1.4px ink border + hard 5px offset shadow + soft lift. */
export const POP_SHADOW = 'shadow-[5px_5px_0_rgba(28,42,33,.2),0_10px_24px_rgba(28,42,33,.06)]';

export const HERO_MILESTONES = [
  {
    key: 'discoverable',
    bg: 'bg-[#ffd86b]',
    Icon: EyeGlyph,
    title: 'Discoverable',
    text: '3 of 9 · recruiters can find you',
  },
  {
    key: 'top20',
    bg: 'bg-[#84cc16]',
    Icon: TrendUpGlyph,
    title: 'Top 20%',
    text: '6 of 9 · fit scores on every role',
  },
  {
    key: 'toptalent',
    bg: 'bg-[#f9c9b6]',
    Icon: FigmaTrophyIcon,
    title: 'Top Talent',
    text: '9 of 9 · recruiters can message you',
  },
];

export const STAGE_GROUPS = [
  {
    key: 'discoverable',
    sticker: 'STAGES 1–3',
    accent: 'bg-[#ffd86b]',
    stages: [
      {
        n: 1,
        Icon: UserGlyph,
        title: 'Avatar',
        text: 'Pick a look that feels like you.',
        time: '1 min',
        xp: '+50 XP',
      },
      {
        n: 2,
        Icon: HeartGlyph,
        title: 'Interests',
        text: 'Choose the areas and industries you care about.',
        time: '2 min',
        xp: '+50 XP',
      },
      {
        n: 3,
        Icon: BulbGlyph,
        title: 'Personality',
        text: '15 short scenarios from Ghanaian workplaces. You get 1 of 9 archetypes.',
        time: '8 min',
        xp: '+100 XP',
      },
    ],
    unlock: {
      Icon: EyeGlyph,
      title: 'Milestone unlocked: Discoverable',
      text: 'Recruiters can find you in search, and you can apply.',
    },
  },
  {
    key: 'top20',
    sticker: 'STAGES 4–6',
    accent: 'bg-[#84cc16]',
    stages: [
      {
        n: 4,
        Icon: BoltGlyph,
        title: 'Skills',
        text: 'Add your skills, then prove them in the Skills Lab.',
        time: '2 min',
        xp: '+100 XP',
      },
      {
        n: 5,
        Icon: FigmaWorkIcon,
        title: 'Work',
        text: 'Jobs, internships, NSS and volunteering.',
        time: '2 min',
        xp: '+50 XP',
      },
      {
        n: 6,
        Icon: FolderGlyph,
        title: 'Portfolio',
        text: 'Projects with links, photos or files as proof.',
        time: '2 min',
        xp: '+100 XP',
      },
    ],
    unlock: {
      Icon: TrendUpGlyph,
      title: 'Milestone unlocked: Top 20%',
      text: 'Fit scores on every role and your job readiness score.',
    },
  },
  {
    key: 'toptalent',
    sticker: 'STAGES 7–9',
    accent: 'bg-[#f9c9b6]',
    stages: [
      {
        n: 7,
        Icon: FigmaCertificatesIcon,
        title: 'Certificates',
        text: 'Upload certificates; we read the details for you.',
        time: '1 min',
        xp: '+50 XP',
      },
      {
        n: 8,
        Icon: FigmaGoalsIcon,
        title: 'Goals',
        text: 'The role, place and pay you’re aiming for.',
        time: '1 min',
        xp: '+50 XP',
      },
      {
        n: 9,
        Icon: VideoGlyph,
        title: 'Pitch',
        text: 'A 60-second video or four written sentences.',
        time: '2 min',
        xp: '+150 XP',
      },
    ],
    unlock: {
      Icon: FigmaTrophyIcon,
      title: 'Milestone unlocked: Top Talent',
      text: 'Recruiters can message you. Your profile shows first.',
    },
  },
];

export const AFTER_PROFILE_CARDS = [
  {
    key: 'match',
    bg: 'bg-[#ffd86b]',
    Icon: SearchGlyph,
    title: 'Get matched',
    text: 'Roles arrive with a fit score and the reasons behind it.',
  },
  {
    key: 'apply',
    bg: 'bg-[#84cc16]',
    Icon: BoltGlyph,
    title: 'Apply in one tap',
    text: 'Your profile is the application. No cover letter needed.',
  },
  {
    key: 'track',
    bg: 'bg-[#f9c9b6]',
    Icon: FigmaWorkIcon,
    title: 'Track every stage',
    text: 'Applied, review, interview, offer, all in one place.',
  },
  {
    key: 'buddy',
    bg: 'bg-[#ffd86b]',
    Icon: FigmaAfterProfileLastIcon,
    title: 'Prep with Career Buddy',
    text: 'Mock interviews and tips for the exact role.',
  },
];

export const PRIVACY_BULLETS = [
  'Only verified recruiters see your profile',
  'Hide from your current employer with one switch',
  'Parents informed · opt out any time',
  'Download or delete your data any time',
];
