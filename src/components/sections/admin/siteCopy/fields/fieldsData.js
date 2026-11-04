import careerFair from '../../../../../assets/admin/site-copy/fields/career-fair.webp';
import classroom from '../../../../../assets/admin/site-copy/fields/classroom.webp';
import graduationDay from '../../../../../assets/admin/site-copy/fields/graduation-day.webp';
import heroOriginal from '../../../../../assets/admin/site-copy/fields/hero-original.webp';
import mentoringSession from '../../../../../assets/admin/site-copy/fields/mentoring-session.webp';
import schoolVisit from '../../../../../assets/admin/site-copy/fields/school-visit.webp';
import smallBanner from '../../../../../assets/admin/site-copy/fields/small-banner.webp';
import studentsOnPhones from '../../../../../assets/admin/site-copy/fields/students-on-phones.webp';
import videoPoster from '../../../../../assets/admin/site-copy/fields/video-poster.webp';

/*
 * fieldsData — mock data + helpers of the Site copy image and video fields (Platform Admin 7.8.10a-h; Figma file iErYj7O3ft6WAG2FBT6aEw).
 * Text is copied from the Figma node characters. Shapes follow the media library asset (builder F, `media/mediaLibraryData.js`):
 *   { id, title, alt, kind, src, width, height, bytes, people, consent, usedIn, archived, addedAt }
 * ⚠️ ASSUMPTION: no backend yet, every asset / field here is mock; the descriptions (alt) of the assets the frames do not read
 *   (Graduation day, School visit, Mentoring session, Students on phones) are invented in the voice of the drawn ones, `people` / `consent` /
 *   `usedIn` / `addedAt` are invented (the fields never show them).
 */

const KB = 1024;
const MB = 1024 * 1024;

/** ⚠️ ASSUMPTION: the field's own seed list, used when the media library data file of builder F is not there (and for the ids it lacks). */
export const FIELD_ASSET_SEED = [
  {
    id: 'm-career-fair-2026',
    title: 'Career fair 2026',
    alt: 'Students talking to recruiters at a career fair',
    kind: 'image',
    src: careerFair,
    width: 2400,
    height: 1600,
    bytes: 3 * MB,
    optimisedKb: 140,
    people: true,
    consent: true,
    usedIn: [],
    archived: false,
    addedAt: '2026-10-28',
  },
  {
    id: 'm-home-hero-original',
    title: 'Home hero · original',
    alt: 'Young people working together on laptops',
    kind: 'image',
    src: heroOriginal,
    width: 1920,
    height: 1280,
    bytes: 0,
    fromDesign: true,
    people: true,
    consent: true,
    usedIn: ['public.home.hero'],
    archived: false,
    addedAt: '2026-09-01',
  },
  {
    id: 'm-graduation-day',
    title: 'Graduation day',
    alt: 'A graduate standing outside a school in the green hills',
    kind: 'image',
    src: graduationDay,
    width: 2000,
    height: 1333,
    bytes: 2.4 * MB,
    people: true,
    consent: true,
    usedIn: [],
    archived: false,
    addedAt: '2026-10-12',
  },
  {
    id: 'm-school-visit-tamale',
    title: 'School visit, Tamale',
    alt: 'Students in green uniforms at their desks while a visitor talks with them',
    kind: 'image',
    src: schoolVisit,
    width: 1800,
    height: 1200,
    bytes: 1.9 * MB,
    people: true,
    consent: true,
    usedIn: [],
    archived: false,
    addedAt: '2026-10-05',
  },
  {
    id: 'm-mentoring-session',
    title: 'Mentoring session',
    alt: 'A mentor and young people around a table with laptops',
    kind: 'image',
    src: mentoringSession,
    width: 1800,
    height: 1200,
    bytes: 1.7 * MB,
    people: true,
    consent: true,
    usedIn: [],
    archived: false,
    addedAt: '2026-09-22',
  },
  {
    id: 'm-students-on-phones',
    title: 'Students on phones',
    alt: 'A student looking at her phone in a classroom',
    kind: 'image',
    src: studentsOnPhones,
    width: 1600,
    height: 1600,
    bytes: 1.4 * MB,
    people: true,
    consent: true,
    usedIn: [],
    archived: false,
    addedAt: '2026-09-15',
  },
  {
    id: 'm-small-banner',
    title: 'Small banner',
    alt: 'Students at a workshop',
    kind: 'image',
    src: smallBanner,
    width: 800,
    height: 400,
    bytes: 64 * KB,
    people: true,
    consent: true,
    usedIn: [],
    archived: false,
    addedAt: '2026-08-30',
  },
  {
    id: 'm-classroom',
    title: 'Classroom',
    alt: '',
    kind: 'image',
    src: classroom,
    width: 1600,
    height: 900,
    bytes: 310 * KB,
    people: false,
    consent: true,
    usedIn: [],
    archived: false,
    addedAt: '2026-08-14',
  },
];

/** The image field of Home › Hero (frames 7.8.10a-e, h). Text from the nodes of 7.8.10a / 10d / 10b / 10e / 10h. */
export const HERO_IMAGE_FIELD = {
  id: 'public.home.hero.image',
  label: 'Hero image',
  noun: 'hero',
  crumb: 'Home › Hero',
  aspectLabel: '16:9',
  aspectRatio: 16 / 9,
  minWidth: 1200,
  cropLabel: '16:9 crop',
  original: 'm-home-hero-original',
  originalTitle: 'Home hero · original',
  note: 'Hero images load fast under 150 KB · we optimise automatically and serve WebP or AVIF sized for each device.',
};

/** Layout crops of the "How it looks on each screen" dialog (7.8.10c): label, width / height ratio of the drawn crop (380x214, 250x188, 160x200). */
export const CROP_LAYOUTS = [
  { id: 'desktop', label: 'Desktop', ratio: 380 / 214, maxWidth: 380 },
  { id: 'tablet', label: 'Tablet', ratio: 250 / 188, maxWidth: 250 },
  { id: 'phone', label: 'Phone', ratio: 160 / 200, maxWidth: 160 },
];

/** The video field of Home › How it works (frames 7.8.10f, g). */
export const SECTION_VIDEO_FIELD = {
  id: 'public.home.how-it-works.video',
  label: 'Video',
  hint: 'YouTube or Vimeo links only',
  refused:
    'Only YouTube or Vimeo links work here. To share a file, upload it to the media library.',
  previewNote: 'Preview of how the video shows on the page.',
  sampleUrl: 'https://www.youtube.com/watch?v=gth-how-it-works',
  // ⚠️ ASSUMPTION: the page cannot read a real thumbnail or length from a link without a backend; the one link the frame draws has its poster + 1:42,
  // every other valid link shows the same poster and only the provider name.
  samplePoster: videoPoster,
  sampleDuration: '1:42',
};

export const SECTION_TITLE_FIELD = {
  id: 'public.home.how-it-works.title',
  label: 'Section title',
  maxLength: 40,
  initial: 'How it works',
};

/** "2400 × 1600" */
export const sizeLabel = (asset) => `${asset.width} × ${asset.height}`;

/** 64 KB / 310 KB / 3.0 MB (the frames print "64 KB", "310 KB" and "3.0 MB"). */
export const formatBytes = (bytes) => {
  if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`;
  return `${Math.round(bytes / KB)} KB`;
};

/** The meta line under an asset title in the field: "1920 × 1280 · from the design", "800 × 400 · 64 KB", "2400 × 1600 · 3.0 MB · optimised to 140 KB". */
export const metaLine = (asset, { fresh = false } = {}) => {
  if (asset.fromDesign) return `${sizeLabel(asset)} · from the design`;
  const base = `${sizeLabel(asset)} · ${formatBytes(asset.bytes)}`;
  return fresh && asset.optimisedKb ? `${base} · optimised to ${asset.optimisedKb} KB` : base;
};

/** The description line: `Description: “…”` or "No description yet". */
export const descriptionLine = (asset) =>
  asset.alt?.trim() ? `Description: “${asset.alt.trim()}”` : 'No description yet';

/** Does the asset fit the field (wide enough)? The picker's "only show images that fit" filter uses it too. */
export const fitsField = (asset, field) => asset.width >= field.minWidth;

export const needsDescription = (asset) => !asset?.alt?.trim();

/** The filter caption of the picker: "Only show images that fit this space (16:9, 1200 px or wider)". */
export const fitFilterLabel = (field) =>
  `Only show images that fit this space (${field.aspectLabel}, ${field.minWidth} px or wider)`;

/** Looks an asset up in the library list, falling back to the field's own seed. */
export const findAsset = (list, id) =>
  list?.find((a) => a.id === id) ?? FIELD_ASSET_SEED.find((a) => a.id === id) ?? null;

const YT_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
];
const ID = /^[\w-]{3,64}$/;

/**
 * Reads a pasted video link: { provider: 'youtube' | 'vimeo', id } for https links to YouTube (watch?v=, /embed/, /shorts/, youtu.be/) or
 * Vimeo (vimeo.com/<digits>, player.vimeo.com/video/<digits>), otherwise null (a file link, another site, plain text).
 */
export const parseVideoUrl = (raw) => {
  const text = String(raw ?? '').trim();
  if (!text) return null;
  let url;
  try {
    url = new URL(text);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  const host = url.hostname.toLowerCase();
  const parts = url.pathname.split('/').filter(Boolean);
  if (host === 'youtu.be') {
    return parts[0] && ID.test(parts[0]) ? { provider: 'youtube', id: parts[0] } : null;
  }
  if (YT_HOSTS.includes(host)) {
    if (parts[0] === 'watch') {
      const v = url.searchParams.get('v');
      return v && ID.test(v) ? { provider: 'youtube', id: v } : null;
    }
    if ((parts[0] === 'embed' || parts[0] === 'shorts') && parts[1] && ID.test(parts[1])) {
      return { provider: 'youtube', id: parts[1] };
    }
    return null;
  }
  if (host === 'vimeo.com' || host === 'www.vimeo.com') {
    return parts[0] && /^\d+$/.test(parts[0]) ? { provider: 'vimeo', id: parts[0] } : null;
  }
  if (host === 'player.vimeo.com' && parts[0] === 'video' && /^\d+$/.test(parts[1] ?? '')) {
    return { provider: 'vimeo', id: parts[1] };
  }
  return null;
};
