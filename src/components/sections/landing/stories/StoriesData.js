import avatarA from '../../../../assets/landing/student-avatar-a.webp';
import avatarB from '../../../../assets/landing/student-avatar-b.webp';
import avatarC from '../../../../assets/landing/student-avatar-c.webp';
import avatarD from '../../../../assets/landing/student-avatar-d.webp';
import avatarE from '../../../../assets/landing/student-avatar-e.webp';
import avatarF from '../../../../assets/landing/student-avatar-f.webp';
import avatarG from '../../../../assets/landing/student-avatar-g.webp';

/* P-05 Stories copy — verbatim from Figma 7797:30021 (curly quotes kept). */

/*
 * The P-05 / P-06 page hero is centred (breadcrumb, chip, heading, sub all centred, no photo) and starts 50px lower than the shared
 * PageHero default (Hero body pad-top 50). Overrides applied to the shared PageHero through its className hook.
 * Heading 80 / 50 / 34 (desktop / tablet / mobile frames) with -0.02em tracking.
 */
export const CENTERED_HERO_CLASS =
  'pb-[8px] md:pb-[22px] xl:pb-[10px] [&_.min-w-0]:w-full [&_.min-w-0]:max-w-none [&_.min-w-0]:items-center [&_nav]:leading-[17px] [&_h1]:text-center  [&_p]:text-center [&_p]:text-[17px] [&_p]:leading-[30px] md:[&_p]:text-[20px]';

export const HERO_NOTE =
  'Sample stories for layout. Replace with real, consented quotes before launch.';

export const STORIES_HERO = {
  crumb: 'Stories',
  chipLabel: 'Stories',
  title: 'Real people. Real paths.',
  subtitle:
    'Students, graduates and early-career talents from every region, and the moments GTH helped them get seen.',
};

export const FEATURED_STORY = {
  sticker: 'STORY OF THE MONTH',
  region: 'Tamale, Northern Region',
  quote:
    '“I’m from a small school in the North. Before GTH I had no way to show big companies what I can do. Six weeks after I became Discoverable, three recruiters had viewed my profile, and one called me for an interview.”',
  name: 'Abena K.',
  role: 'Science · SHS3 → Data Analyst Intern',
  avatar: avatarB,
  timeline: [
    { label: 'Joined · Week 1', bg: '#f7f8f4' },
    { label: 'Discoverable · Week 1', bg: '#ffd86b' },
    { label: '3 recruiter views · Week 5', bg: '#84cc16' },
    { label: 'Interview · Week 6', bg: '#f9c9b6' },
  ],
};

export const MORE_STORIES = {
  chip: 'More stories',
  title: 'Every region has a star.',
};

/* rotate = card tilt (deg); stickerRight = desktop right offset of the corner sticker (px, per Figma position). */
export const STORIES = [
  {
    id: 'kwame',
    quote:
      'I finished my profile in an evening. Three weeks later I had a graduate-scheme interview.',
    name: 'Kwame A.',
    role: 'Computer Science · KNUST',
    region: 'Kumasi',
    avatar: avatarE,
    sticker: { label: 'GOT THE INTERVIEW', bg: '#ffd86b' },
    rotate: 1.5,
    stickerRight: 29,
  },
  {
    id: 'efua',
    quote: 'The personality quiz named things I do every day. Recruiters finally saw them too.',
    name: 'Efua M.',
    role: 'Business · UCC',
    region: 'Cape Coast',
    avatar: avatarA,
    sticker: { label: 'THE ARCHITECT', bg: '#84cc16' },
    rotate: -1,
    stickerRight: 58,
  },
  {
    id: 'yaw',
    quote: 'Career Buddy helped me practise. I walked into my interview calm for once.',
    name: 'Yaw D.',
    role: 'HND Marketing · Takoradi TU',
    region: 'Takoradi',
    avatar: avatarD,
    sticker: { label: 'HIRED', bg: '#f9c9b6' },
    rotate: 0.5,
    stickerRight: 112,
  },
  {
    id: 'akosua',
    quote: 'My mum gets the notifications and we decide together. It feels safe.',
    name: 'Akosua B.',
    role: 'SHS2 · Ho',
    region: 'Ho',
    avatar: avatarC,
    sticker: { label: 'UNDER-18', bg: '#ffd86b' },
    rotate: -1.2,
    stickerRight: 95,
  },
  {
    id: 'ibrahim',
    quote: 'A Farmerline field role matched my goals at 91%. I applied in one tap.',
    name: 'Ibrahim S.',
    role: 'Agric Science · UDS',
    region: 'Tamale',
    avatar: avatarF,
    sticker: { label: '91% MATCH', bg: '#84cc16' },
    rotate: 1,
    stickerRight: 78,
  },
  {
    id: 'nana',
    quote: 'No degree, but my portfolio and Skills Lab scores got me shortlisted.',
    name: 'Nana O.',
    role: 'Graphic Design · self-taught',
    region: 'Accra',
    avatar: avatarG,
    sticker: { label: 'NO DEGREE NEEDED', bg: '#f9c9b6' },
    rotate: -0.8,
    stickerRight: 35,
  },
];

export const STORY_NUMBERS = {
  chip: 'By the numbers',
  title: 'Small steps, big results.',
  items: [
    { value: '12,000+', label: 'early sign-ups' },
    { value: '16', label: 'regions represented' },
    { value: '48h', label: 'average recruiter reply' },
    { value: '94%', label: 'match accuracy' },
  ],
};

export const SHARE_STORY = {
  title: 'Got a GTH story?',
  body: 'Tell us how GTH helped and we may feature you, with your permission, on this page and in schools across Ghana.',
  cta: 'Share my story',
  note: 'Takes 3 minutes · you can opt out at any time',
  sticker: '+100 XP',
};
