import { HERO_MIN_WIDTH, MEDIA_EXTRAS } from './mediaLibraryData.js';

/*
 * mediaLibraryModel — pure helpers of the Media library (Platform Admin 7.8.9): captions, warnings, filters, header copy, wording. No React.
 * Header copy is verbatim from the frames: "64 images · 9 documents · 3 need attention" (7.8.9a), "3 items need attention before they can be published"
 * (7.8.9h), "9 documents · PDF up to 10 MB" (7.8.9j), "4 files aren’t on any page · you can archive them" (7.8.9l), "2 results for “career”" (7.8.9m),
 * "0 images · 0 documents" (7.8.9i). ⚠️ ASSUMPTION: the singular forms and the "Images" filter line are not drawn; they follow the same pattern.
 */

export const MEDIA_FILTERS = [
  { id: 'images', label: 'Images' },
  { id: 'documents', label: 'Documents' },
  { id: 'unused', label: 'Unused' },
  { id: 'alt', label: 'Needs alt text' },
];

export const formatBytes = (bytes) => {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1000))} KB`;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** '2026-10-12' → '12 Oct' (the history lines of 7.8.9e). */
export const formatShortDate = (iso) => {
  const d = new Date(`${String(iso).slice(0, 10)}T00:00:00`);
  return Number.isNaN(d.getTime()) ? String(iso) : `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

/** '2400 × 1600 · 3.0 MB' for images, 'PDF · 12 pages · 2.1 MB' for documents (card caption). */
export const assetCaption = (a) =>
  a.kind === 'document'
    ? `PDF · ${a.pages} pages · ${formatBytes(a.bytes)}`
    : `${a.width} × ${a.height} · ${formatBytes(a.bytes)}`;

export const usedCount = (a) => a.usedIn?.length ?? 0;
export const usedLabel = (a) => {
  const n = usedCount(a);
  return n === 0 ? 'Unused' : `Used on ${n} ${n === 1 ? 'section' : 'sections'}`;
};

export const needsAlt = (a) => a.kind === 'image' && !a.decorative && !String(a.alt ?? '').trim();
export const needsConsent = (a) => Boolean(a.people) && !a.consent;
export const tooSmallForHero = (a) => a.kind === 'image' && a.width < HERO_MIN_WIDTH;

/** The one warning chip of a card (7.8.9a): alt text first, then consent, then size, then "Unused". Returns { id, label, tone } or null. */
export const assetWarning = (a) => {
  if (needsAlt(a)) return { id: 'alt', label: 'Needs alt text', tone: 'red' };
  if (needsConsent(a)) return { id: 'consent', label: 'Consent not confirmed', tone: 'amber' };
  if (tooSmallForHero(a))
    return { id: 'small', label: 'Too small for hero sections', tone: 'amber' };
  if (usedCount(a) === 0) return { id: 'unused', label: 'Unused', tone: 'grey' };
  return null;
};

/** 'Public site › Home › Hero' → 'Hero' (the "Open the Hero section" button). */
export const lastPart = (label) => String(label).split('›').pop().trim();

/** 'Partner logo · Northern Skills' → 'Partner logo' (the "Replace Partner logo?" title). ⚠️ ASSUMPTION: the part before the first "·". */
export const shortTitle = (a) => String(a.title).split('·')[0].trim() || a.title;
/** 'logo' for titles with "logo", 'file' for documents, else 'image' (the sentence "This logo is used on 3 sections"). ⚠️ ASSUMPTION. */
export const assetNoun = (a) =>
  a.kind === 'document' ? 'file' : /logo/i.test(a.title) ? 'logo' : 'image';

export const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'file';

export const uniqueId = (title, assets) => {
  const base = `m-${slugify(title)}`;
  const taken = new Set(assets.map((a) => a.id));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
};

export const liveAssets = (assets) => assets.filter((a) => !a.archived);

/** Counts for the header: itemised assets plus the files that exist but are not itemised (MEDIA_EXTRAS). */
export const mediaCounts = (assets) => {
  const live = liveAssets(assets);
  const images = live.filter((a) => a.kind !== 'document').length + MEDIA_EXTRAS.images;
  const documents = live.filter((a) => a.kind === 'document').length + MEDIA_EXTRAS.documents;
  return {
    images,
    documents,
    attention: live.filter(needsAlt).length,
    unused: live.filter((a) => usedCount(a) === 0).length,
  };
};

const haystack = (a) =>
  [a.title, a.alt, a.format, ...(a.usedIn ?? []).map((u) => u.label)].join(' ').toLowerCase();

export const filterAssets = (assets, { filter, q }) => {
  let list = liveAssets(assets);
  if (filter === 'images') list = list.filter((a) => a.kind !== 'document');
  if (filter === 'documents') list = list.filter((a) => a.kind === 'document');
  if (filter === 'unused') list = list.filter((a) => usedCount(a) === 0);
  if (filter === 'alt') list = list.filter(needsAlt);
  const needle = String(q ?? '')
    .trim()
    .toLowerCase();
  if (needle) list = list.filter((a) => haystack(a).includes(needle));
  return list;
};

const plural = (n, one, many) => (n === 1 ? one : many);

export const headerLine = ({ assets, filter, q, results, empty }) => {
  const c = mediaCounts(empty ? [] : assets);
  if (empty) return '0 images · 0 documents';
  const needle = String(q ?? '').trim();
  if (needle) return `${results} ${plural(results, 'result', 'results')} for “${needle}”`;
  if (filter === 'alt')
    return results === 1
      ? '1 item needs attention before it can be published'
      : `${results} items need attention before they can be published`;
  if (filter === 'documents') return `${c.documents} documents · PDF up to 10 MB`;
  if (filter === 'unused')
    return `${results} ${plural(results, 'file isn’t', 'files aren’t')} on any page · you can archive ${plural(results, 'it', 'them')}`;
  if (filter === 'images') return `${c.images} images`;
  return `${c.images} images · ${c.documents} documents · ${c.attention} need attention`;
};

/** Type + size validation of a picked file (7.8.9d). Returns { ok: true, kind } or { ok: false, message }. */
const ACCEPTED = {
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  webp: 'image',
  avif: 'image',
  gif: 'image',
  pdf: 'document',
};
export const ACCEPT_ATTR =
  '.jpg,.jpeg,.png,.webp,.avif,.gif,.pdf,image/jpeg,image/png,image/webp,image/avif,image/gif,application/pdf';
const REFUSED_TAIL = 'Use JPEG, PNG, WebP, AVIF, GIF or PDF.';
export const refusedByName = (name) => {
  const ext = (String(name).split('.').pop() || '').toLowerCase();
  if (!ACCEPTED[ext])
    return `${ext && ext !== String(name).toLowerCase() ? ext.toUpperCase() : 'This type of'} files aren’t accepted. ${REFUSED_TAIL}`;
  return null;
};
export const kindOfName = (name) =>
  ACCEPTED[(String(name).split('.').pop() || '').toLowerCase()] ?? null;
export const FAKE_IMAGE_MESSAGE = `This file isn’t really an image. ${REFUSED_TAIL}`;
/** ⚠️ ASSUMPTION (size limits are drawn in the dropzone caption, the refusal wording is not). */
export const tooLargeMessage = (kind) =>
  kind === 'document'
    ? 'This PDF is over 10 MB. PDFs can be up to 10 MB.'
    : 'This image is over 8 MB. Images can be up to 8 MB.';
