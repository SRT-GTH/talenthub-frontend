import { debug } from '../../../../../utils/debug.js';
import careerFair from '../../../../../assets/admin/site-copy/media/career-fair-2026.png';
import classroom from '../../../../../assets/admin/site-copy/media/classroom.png';
import graduationDay from '../../../../../assets/admin/site-copy/media/graduation-day.png';
import homeHero from '../../../../../assets/admin/site-copy/media/home-hero-original.png';
import libraryCorner from '../../../../../assets/admin/site-copy/media/library-corner.png';
import marketStall from '../../../../../assets/admin/site-copy/media/market-stall.png';
import mentoringSession from '../../../../../assets/admin/site-copy/media/mentoring-session.png';
import partnerLogo from '../../../../../assets/admin/site-copy/media/partner-logo-northern-skills.png';
import partnerLogoReplacement from '../../../../../assets/admin/site-copy/media/partner-logo-replacement.png';
import schoolVisit from '../../../../../assets/admin/site-copy/media/school-visit-tamale.png';
import seedling from '../../../../../assets/admin/site-copy/media/seedling.png';
import smallBanner from '../../../../../assets/admin/site-copy/media/small-banner.png';
import studentsOnPhones from '../../../../../assets/admin/site-copy/media/students-on-phones.png';
import teamPhoto from '../../../../../assets/admin/site-copy/media/team-photo.png';

const log = debug('mediaLibraryData');

/*
 * mediaLibraryData — the mock "server" content of the Media library (Platform Admin 7.8.9, Figma frames 7.8.9a-n). Shaped like a future API payload:
 *   { id: 'm-<slug>', title, alt, kind: 'image' | 'video' | 'document', format, src, width, height, bytes, pages (documents), people, consent,
 *     decorative, usedIn: [{ sectionId, label }], archived, addedAt (ISO date), addedBy, history: [{ v, kind: 'uploaded' | 'replaced', by, at, note }] }
 * The list lives in useCopyKv('media.assets') so the image / video FIELD components (7.8.10) read the same assets: they import MEDIA_ASSETS as
 * the seed and `useCopyKv('media.assets', MEDIA_ASSETS)` for the live list.
 *
 * Drawn in Figma (verbatim): the 12 library cards of 7.8.9a (+ Team photo, Library corner of 7.8.9h, the documents of 7.8.9j / 7.8.9m), the three
 * sections of "Partner logo · Northern Skills", its two history lines, "Public site › Home › Hero" for Home hero · original.
 * ⚠️ ASSUMPTION: every other `usedIn` section label / id (portal › page › section) is invented so each card can show its drawn "Used on N sections"
 * count and link to an editor section; section ids follow the brief's `<portal>.<page>.<section>` convention. `addedBy` / dates of the assets that
 * have no drawn history are invented (Ama Owusu / Nana Adjei, Sep-Oct 2026). `width x height`, size and page counts are the drawn captions.
 * ⚠️ ASSUMPTION: the library header says "64 images · 9 documents" but Figma only draws ~16 of them; MEDIA_EXTRAS is the count of files that exist
 * but are not itemised here (51 images, 4 documents) so the totals match the drawn header while filters / search work on the itemised ones.
 * Figma inconsistency kept: 7.8.9h draws "Library corner" as Unused while 7.8.9l lists only 4 unused files without it: the card wins (5 unused).
 */

export const MEDIA_MAX_IMAGE_BYTES = 8_000_000;
export const MEDIA_MAX_DOCUMENT_BYTES = 10_000_000;
export const MEDIA_EXTRAS = { images: 51, documents: 4 };
/** ⚠️ ASSUMPTION: an image narrower than this is "Too small for hero sections" (the drawn 800 × 400 banner is, the 1200 × 600 logo is not). */
export const HERO_MIN_WIDTH = 1200;

const NAMES = { ama: 'Ama Owusu', nana: 'Nana Adjei' };
const up = (by, at) => [{ v: 1, kind: 'uploaded', by, at }];

const section = (sectionId, label) => ({ sectionId, label });
const SECTIONS = {
  homeHero: section('public.home.hero', 'Public site › Home › Hero'),
  madeForGhana: section('public.home.made-for-ghana', 'Public site › Home › Made for Ghana'),
  partnerLogos: section('public.for-partners.logos', 'Public site › For partners › Logos'),
  scholarshipsHero: section('talent.scholarships.hero', 'Talent › Scholarships › Hero'),
};

const image = (id, title, src, width, height, bytes, extra = {}) => ({
  id,
  title,
  alt: '',
  kind: 'image',
  format: 'JPG',
  src,
  width,
  height,
  bytes,
  people: false,
  consent: false,
  decorative: false,
  usedIn: [],
  archived: false,
  addedAt: '2026-09-14',
  addedBy: NAMES.ama,
  history: up(NAMES.ama, '2026-09-14'),
  ...extra,
});

const doc = (id, title, pages, bytes, usedIn) => ({
  id,
  title,
  alt: '',
  kind: 'document',
  format: 'PDF',
  src: null,
  width: null,
  height: null,
  bytes,
  pages,
  people: false,
  consent: false,
  decorative: false,
  usedIn,
  archived: false,
  addedAt: '2026-09-20',
  addedBy: NAMES.ama,
  history: up(NAMES.ama, '2026-09-20'),
});

export const MEDIA_ASSETS = [
  image('m-career-fair-2026', 'Career fair 2026', careerFair, 2400, 1600, 3_000_000, {
    alt: 'Students talking to recruiters at a career fair',
    usedIn: [section('public.home.events', 'Public site › Home › Events')],
  }),
  image('m-hero-students', 'Home hero · original', homeHero, 1920, 1280, 412_000, {
    alt: 'Four young people laughing together over a book in a library',
    people: true,
    consent: true,
    usedIn: [SECTIONS.homeHero],
  }),
  image('m-students-on-phones', 'Students on phones', studentsOnPhones, 1600, 1600, 380_000, {
    alt: 'A student at a desk looking at her phone in a classroom',
    people: true,
    consent: true,
    usedIn: [
      section('public.home.how-it-works', 'Public site › Home › How it works'),
      section('public.for-talent.hero', 'Public site › For talent › Hero'),
      section('talent.dashboard.welcome-banner', 'Talent › Dashboard › Welcome banner'),
    ],
  }),
  image('m-partner-logo', 'Partner logo · Northern Skills', partnerLogo, 1200, 600, 96_000, {
    alt: 'Northern Skills Foundation logo',
    format: 'PNG',
    usedIn: [SECTIONS.partnerLogos, SECTIONS.madeForGhana, SECTIONS.scholarshipsHero],
    addedAt: '2026-09-01',
    history: [
      { v: 2, kind: 'replaced', by: NAMES.ama, at: '2026-10-12', note: 'new brand colours' },
      { v: 1, kind: 'uploaded', by: NAMES.nana, at: '2026-09-01' },
    ],
  }),
  doc('m-scholarship-guide-2026', 'Scholarship guide 2026', 12, 2_100_000, [
    section('talent.scholarships.guide', 'Talent › Scholarships › Guide download'),
  ]),
  image('m-graduation-day', 'Graduation day', graduationDay, 2000, 1333, 520_000, {
    alt: 'A graduate in a yellow dress standing in front of a school building',
    people: true,
    consent: true,
    usedIn: [
      section('public.about.story', 'Public site › About › Our story'),
      section('parent.home.welcome', 'Parent › Home › Welcome'),
    ],
  }),
  image('m-school-visit-tamale', 'School visit, Tamale', schoolVisit, 1800, 1200, 440_000, {
    alt: 'Pupils at laptops in a classroom in Tamale',
    people: true,
    consent: true,
  }),
  image('m-mentoring-session', 'Mentoring session', mentoringSession, 1800, 1200, 470_000, {
    alt: 'A mentor helping a student at a computer',
    people: true,
    consent: true,
    usedIn: [section('recruiter.home.hero', 'Recruiter › Home › Hero')],
  }),
  image('m-classroom', 'Classroom', classroom, 1600, 900, 310_000, {
    usedIn: [section('institution.home.hero', 'Institution › Home › Hero')],
  }),
  image('m-market-stall', 'Market stall', marketStall, 1600, 900, 290_000, {
    alt: 'A woman holding a cup in front of a brick wall',
    people: true,
    consent: false,
  }),
  image('m-small-banner', 'Small banner', smallBanner, 800, 400, 64_000, {
    alt: 'Friends sharing a laptop at a table',
    people: true,
    consent: true,
    usedIn: [section('public.shared.footer', 'Public site › Footer')],
  }),
  image('m-seedling', 'Seedling', seedling, 1400, 1400, 260_000, {
    alt: 'A young green seedling growing from soil',
  }),
  image('m-team-photo', 'Team photo', teamPhoto, 1600, 1000, 300_000, {
    usedIn: [section('public.about.team', 'Public site › About › Team')],
  }),
  image('m-library-corner', 'Library corner', libraryCorner, 1400, 900, 250_000),
  doc('m-parent-consent-guide', 'Parent consent guide', 4, 640_000, [
    section('parent.onboarding.consent', 'Parent › Onboarding › Consent'),
    section('parent.home.resources', 'Parent › Home › Resources'),
  ]),
  doc('m-interview-tips', 'Interview tips for talents', 8, 1_200_000, [
    section('talent.dashboard.tips', 'Talent › Dashboard › Interview tips'),
  ]),
  doc('m-partner-onboarding-pack', 'Partner onboarding pack', 16, 3_400_000, []),
  doc('m-career-guide-parents', 'Career guide for parents', 6, 900_000, [
    section('parent.home.guide', 'Parent › Home › Guide'),
  ]),
];

/** The new file offered in the "Replace" dialog until the editor picks one (7.8.9f "new" thumbnail). ⚠️ ASSUMPTION: sample until a file is chosen. */
export const MEDIA_REPLACEMENT_SAMPLE = {
  src: partnerLogoReplacement,
  width: 1200,
  height: 900,
  bytes: 95_000,
  format: 'PNG',
};

/** The in-progress upload drawn in 7.8.9b and the file described in 7.8.9c (used by ?modal=upload / details URLs). */
export const MEDIA_DEMO_UPLOAD = {
  name: 'career-fair-2026.jpg',
  bytes: 3_000_000,
  progress: 64,
  title: 'Career fair 2026',
  alt: 'Students talking to recruiters at a career fair',
  src: careerFair,
  width: 2400,
  height: 1600,
  format: 'JPG',
  kind: 'image',
};

/** The two refused files drawn in 7.8.9d. */
export const MEDIA_DEMO_REFUSED = [
  {
    name: 'partner-logo.svg',
    message: 'SVG files aren’t accepted. Use JPEG, PNG, WebP, AVIF, GIF or PDF.',
  },
  {
    name: 'invoice.png',
    message: 'This file isn’t really an image. Use JPEG, PNG, WebP, AVIF, GIF or PDF.',
  },
];

log('seed', MEDIA_ASSETS.length, 'assets');
