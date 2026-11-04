import * as HERO from '../components/sections/landing/home/HeroData.js';
import * as HOW from '../components/sections/landing/home/HowItWorksData.js';
import * as FEAT from '../components/sections/landing/home/FeaturesData.js';
import * as MFG from '../components/sections/landing/home/MadeForGhanaData.js';
import * as FAQ from '../components/sections/landing/home/FaqData.js';
import { copySection } from './copySections.js';

/*
 * landingHomeCopy — the editable text of the public Home page (pages/landing/LandingHomePage.jsx), section by section.
 * Defaults are the page's own data files, so Site copy shows and edits exactly what visitors see. Headings drawn in two colours
 * are two fields ("… start" + "… coloured end"). Decorative stickers, sample cards and numbers stay as designed.
 */

export const HOME_HERO_COPY = copySection({
  id: 'public.home.hero',
  label: 'Hero',
  data: {
    HERO_PILL: HERO.HERO_PILL,
    HERO_HEADING: [...HERO.HERO_HEADING],
    HERO_SUB: HERO.HERO_SUB,
    HERO_PRIMARY_CTA: HERO.HERO_PRIMARY_CTA,
    HERO_RECRUITER_LINK: HERO.HERO_RECRUITER_LINK,
    HERO_TRUST: HERO.HERO_TRUST,
    HERO_STATS: HERO.HERO_STATS.map((s) => ({ ...s })),
  },
  fields: [
    ['pill', 'Top pill', ['HERO_PILL']],
    ['heading-1', 'Headline, first line', ['HERO_HEADING', 0], { kind: 'headline' }],
    ['heading-2', 'Headline, second line (gold)', ['HERO_HEADING', 1], { kind: 'headline' }],
    ['sub', 'Supporting line', ['HERO_SUB']],
    ['primary-cta', 'Main button text', ['HERO_PRIMARY_CTA']],
    ['recruiter-link', 'Recruiter link text', ['HERO_RECRUITER_LINK']],
    ['trust', 'Line under the avatars', ['HERO_TRUST']],
    ...HERO.HERO_STATS.map((s, i) => [
      `stat-${i + 1}-label`,
      `Stat ${i + 1} label (${s.value})`,
      ['HERO_STATS', i, 'label'],
    ]),
  ],
});

export const HOME_HOW_COPY = copySection({
  id: 'public.home.how-it-works',
  label: 'How it works',
  data: {
    HOW_CHIP: HOW.HOW_CHIP,
    HOW_HEADING: [...HOW.HOW_HEADING],
    HOW_SUB: HOW.HOW_SUB,
    HOW_STICKER: HOW.HOW_STICKER,
    HOW_STEPS: HOW.HOW_STEPS.map((s) => ({ ...s })),
  },
  fields: [
    ['chip', 'Small label', ['HOW_CHIP']],
    ['heading-lead', 'Heading', ['HOW_HEADING', 0], { kind: 'headline' }],
    ['heading-accent', 'Heading, green end', ['HOW_HEADING', 1], { kind: 'headline' }],
    ['sub', 'Supporting line', ['HOW_SUB']],
    ['sticker', 'Sticker', ['HOW_STICKER']],
    ...HOW.HOW_STEPS.flatMap((s, i) => [
      [`step-${i + 1}-title`, `Step ${i + 1} title`, ['HOW_STEPS', i, 'title']],
      [`step-${i + 1}-body`, `Step ${i + 1} text`, ['HOW_STEPS', i, 'body']],
      [`step-${i + 1}-chip`, `Step ${i + 1} unlock chip`, ['HOW_STEPS', i, 'chip']],
    ]),
  ],
});

const FEATURE_CARDS = [
  ['BUDDY_CARD', 'Career Buddy card'],
  ['READINESS_CARD', 'Job readiness card'],
  ['SKILLS_LAB_CARD', 'Skills Lab card'],
  ['ASSESSMENT_CARD', 'MyAssessment card'],
  ['VERIFIED_CARD', 'Verified skills card'],
  ['STREAK_CARD', 'Streaks card'],
  ['MATCHING_CARD', 'Smart matching card'],
];

export const HOME_FEATURES_COPY = copySection({
  id: 'public.home.features',
  label: 'Features',
  data: {
    FEATURES_CHIP: FEAT.FEATURES_CHIP,
    FEATURES_HEADING: [...FEAT.FEATURES_HEADING],
    FEATURES_SUB: FEAT.FEATURES_SUB,
    ...Object.fromEntries(FEATURE_CARDS.map(([name]) => [name, structuredClone(FEAT[name])])),
  },
  fields: [
    ['chip', 'Small label', ['FEATURES_CHIP']],
    ['heading-lead', 'Heading', ['FEATURES_HEADING', 0], { kind: 'headline' }],
    ['heading-accent', 'Heading, gold end', ['FEATURES_HEADING', 1], { kind: 'headline' }],
    ['sub', 'Supporting line', ['FEATURES_SUB']],
    ...FEATURE_CARDS.flatMap(([name, label]) => {
      const slug = name
        .toLowerCase()
        .replace(/_card$/, '')
        .replace(/_/g, '-');
      return [
        [`${slug}-kicker`, `${label}: small label`, [name, 'kicker']],
        [`${slug}-title`, `${label}: title`, [name, 'title']],
        [`${slug}-body`, `${label}: text`, [name, 'body']],
      ];
    }),
  ],
});

export const HOME_MADE_FOR_GHANA_COPY = copySection({
  id: 'public.home.made-for-ghana',
  label: 'Made for Ghana',
  data: {
    MADE_FOR_GHANA_HEAD: { ...MFG.MADE_FOR_GHANA_HEAD },
    TITLE: { lead: 'Made for Ghana.', accent: 'Made for everyone.' },
    GHANA_FEATURES: MFG.GHANA_FEATURES.map((f) => ({ ...f })),
  },
  fields: [
    ['chip', 'Small label', ['MADE_FOR_GHANA_HEAD', 'chip']],
    ['title-lead', 'Heading', ['TITLE', 'lead'], { kind: 'headline' }],
    ['title-accent', 'Heading, coloured end', ['TITLE', 'accent'], { kind: 'headline' }],
    ...MFG.GHANA_FEATURES.flatMap((f, i) => [
      [`${f.id}-title`, `Tile ${i + 1} title`, ['GHANA_FEATURES', i, 'title']],
      [`${f.id}-body`, `Tile ${i + 1} text`, ['GHANA_FEATURES', i, 'body']],
    ]),
  ],
});

export const HOME_FAQ_COPY = copySection({
  id: 'public.home.faq',
  label: 'FAQ',
  data: {
    FAQ_HEAD: { ...FAQ.FAQ_HEAD },
    TITLE: { lead: 'Questions? We’ve', accent: 'got you.' },
    FAQ_ITEMS: FAQ.FAQ_ITEMS.map((x) => ({ ...x })),
    FAQ_HELP: { ...FAQ.FAQ_HELP },
  },
  fields: [
    ['chip', 'Small label', ['FAQ_HEAD', 'chip']],
    ['title-lead', 'Heading', ['TITLE', 'lead'], { kind: 'headline' }],
    ['title-accent', 'Heading, green end', ['TITLE', 'accent'], { kind: 'headline' }],
    ...FAQ.FAQ_ITEMS.flatMap((x, i) => [
      [`${x.id}-question`, `Question ${i + 1}`, ['FAQ_ITEMS', i, 'question']],
      [`${x.id}-answer`, `Answer ${i + 1}`, ['FAQ_ITEMS', i, 'answer']],
    ]),
    ['help-lead', 'Help line', ['FAQ_HELP', 'lead']],
    ['help-link', 'Help link text', ['FAQ_HELP', 'link']],
  ],
});

/** Every editable section of the public site, by section id (the Site copy screens' ids). */
export const PUBLIC_COPY_SECTIONS = Object.fromEntries(
  [HOME_HERO_COPY, HOME_HOW_COPY, HOME_FEATURES_COPY, HOME_MADE_FOR_GHANA_COPY, HOME_FAQ_COPY].map(
    (s) => [s.id, s]
  )
);
