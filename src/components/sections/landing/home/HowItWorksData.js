/* Copy + structure for landing S3 · How it works (Figma 7797:9190, tablet 7815:265767, mobile 7815:273584) — verbatim from Figma. */

export const HOW_CHIP = 'How it works';
/* Heading: Bricolage 54/40/32, "three moves." in brand green (character style overrides on 7797:11067). */
export const HOW_HEADING = ['From sign up to hired in ', 'three moves.'];
export const HOW_SUB =
  'Nine short stages build a profile recruiters trust. Every three stages unlock something new.';
export const HOW_STICKER = '20 MIN TOTAL';

/* Step photos: imageRefs b6cf7f79 / c8a8433f / 330b0c6b = features-preview-photo / page-hero-how-it-works / page-hero-opportunities. */
export const HOW_STEPS = [
  {
    n: '01',
    title: 'Build your profile',
    body: 'Avatar, interests, personality, skills and work. Each stage takes a few minutes and saves itself.',
    chip: 'Unlocks: Discoverable at 3 of 9',
    accent: '#ffd86b',
    image: 'features-preview-photo',
  },
  {
    n: '02',
    title: 'Prove what you can do',
    body: 'Skills Lab challenges and assessments turn “I can” into verified evidence recruiters believe.',
    chip: 'Unlocks: Top 20% at 6 of 9',
    accent: '#84cc16',
    image: 'page-hero-how-it-works',
  },
  {
    n: '03',
    title: 'Get matched and hired',
    body: 'Roles come to you with a fit score. Apply in one tap and track every stage.',
    chip: 'Unlocks: Top Talent at 9 of 9',
    accent: '#f9c9b6',
    image: 'page-hero-opportunities',
  },
];

/* Desktop journey panel ("Journey panel · Road across Ghana", 7797→8079:530). kind: done | active | todo | milestone. */
export const JOURNEY_STAGES = [
  { id: 's1', label: 'Avatar', sub: 'Done', kind: 'done', icon: 'user' },
  { id: 's2', label: 'Interests', sub: 'In progress · ~2 min left', kind: 'active', icon: 'heart' },
  { id: 's3', label: 'Personality', sub: 'Stage 3 · ~6 min', kind: 'todo', icon: 'bulb' },
  {
    id: 'm1',
    label: 'Discoverable',
    sub: 'Milestone 1 · at 3 stages',
    kind: 'milestone',
    icon: 'eye',
  },
  { id: 's4', label: 'Skills', sub: 'Stage 4 · ~6 min', kind: 'todo', icon: 'bolt' },
  { id: 's5', label: 'Work', sub: 'Stage 5 · ~5 min', kind: 'todo', icon: 'work' },
  { id: 's6', label: 'Portfolio', sub: 'Stage 6 · ~8 min', kind: 'todo', icon: 'folder' },
  {
    id: 'm2',
    label: 'Top 20%',
    sub: 'Milestone 2 · at 6 stages',
    kind: 'milestone',
    icon: 'trophy',
  },
  { id: 's7', label: 'Certs', sub: 'Stage 7 · ~4 min', kind: 'todo', icon: 'mortarboard' },
  { id: 's8', label: 'Goals', sub: 'Stage 8 · ~3 min', kind: 'todo', icon: 'target' },
  { id: 's9', label: 'Pitch', sub: 'Stage 9 · ~6 min', kind: 'todo', icon: 'video' },
  {
    id: 'm3',
    label: 'Top Talent',
    sub: 'Milestone 3 · at 9 stages',
    kind: 'milestone',
    icon: 'diamond',
  },
];

/* Region pills along the top of the journey panel (x = left offset in the 1536 panel). Note text keeps Figma's double space. */
export const JOURNEY_REGIONS = [
  { name: 'TAMALE', note: '·  Your identity', count: '1/3', x: 40 },
  { name: 'KUMASI', note: '·  Your skills', count: '0/3', x: 515 },
  { name: 'ACCRA', note: '·  Your story', count: '0/3', x: 990 },
];

export const JOURNEY_PING = 'Esi from Bolgatanga just reached Kumasi';
export const JOURNEY_CTA = 'Start your road';

/* Tablet / mobile "Journey rail" — nine stage chips; stages 3, 6 and 9 (the milestones) are the gold chips. */
export const JOURNEY_RAIL = [
  'Avatar',
  'Interests',
  'Personality',
  'Skills',
  'Work',
  'Portfolio',
  'Certs',
  'Goals',
  'Pitch',
];
