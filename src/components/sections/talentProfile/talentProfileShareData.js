/*
 * Talent profile · Share — mock data + verbatim Figma copy (SH-01 … SH-05, SH-03b-f).
 * Frame ids (Playful / Focused) are listed in wiki/talent-profile.md. Every string below is the Figma
 * `characters` value — including the frame's own typos ("Pay hope", "Try one of these:" with no full stop
 * before it) — so do not "fix" them here. Shaped so an API can replace the mock constants later.
 */

export const PROFILE_SLUG = 'kofi-agyekum';
export const PROFILE_HOST = 'gth.com/';
export const PROFILE_URL = `${PROFILE_HOST}${PROFILE_SLUG}`;

/* ---------------------------------------------------------------- SH-01 / SH-02 */
export const SHARE_MAIN = {
  title: 'Share your profile',
  sticker: 'Get seen',
  subtitle:
    'Anyone with the link sees your public profile. Pay hope, goals and views stay private.',
  linkLabel: 'Your profile link',
  linkHint: 'Short and easy to put on a CV',
  copiedHint: 'Copied to clipboard',
  copyLabel: 'Copy link',
  copiedLabel: 'Copied',
  customise: 'Customise your link',
  shareTo: 'Share to',
  channels: [
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'status', label: 'Status / Story' },
    { id: 'x', label: 'X' },
    { id: 'email', label: 'Email' },
    { id: 'more', label: 'More' },
  ],
  card: {
    title: 'Make a share card',
    body: 'For WhatsApp status, IG story or LinkedIn',
    cta: 'Create card →',
  },
  qr: {
    title: 'QR code',
    body: 'For career fairs, CVs and your business card',
    cta: 'Download PNG ↓',
  },
  whoCanOpen: 'Who can open this link',
  audience: 'Anyone with the link',
  google: 'Let Google find my profile',
  googleHint: 'Off by default. Turn on to show up in search results.',
  opened: 'Your link was opened 12 times this week',
  pdf: 'Download PDF / CV',
  toast: {
    title: 'Link copied!',
    body: 'Paste it in your CV, LinkedIn bio or WhatsApp status.',
    sticker: '+5 pts · first share',
  },
};

/* ---------------------------------------------------------------- SH-04 / SH-04b */
export const SHARE_LINK = {
  title: 'Customise your link',
  subtitle: 'Make it short, real and easy to say out loud at a career fair.',
  inputLabel: 'Your link',
  inputHint: '3–30 letters, numbers or -',
  taken: 'Taken. Someone got there first Try one of these:',
  available: 'Available. Nice one.',
  suggestions: ['kofi-agyekum', 'kofi-data', 'kofi-analyst', 'kofi-a-accra'],
  note: 'Your old link (gth.com/kofi-agyekum) keeps working for 90 days, so links already on your CV won’t break.',
  cancel: 'Cancel',
  save: 'Save link',
  /* Frame values: SH-04 types "kofi" (taken), SH-04b types "kofi-data" (available). */
  takenExample: 'kofi',
  availableExample: 'kofi-data',
};

/* Mock availability check. "kofi" is the one slug the frames show as taken. */
const TAKEN_SLUGS = ['kofi'];
export const SLUG_PATTERN = /^[a-z0-9-]{3,30}$/i;
export const checkSlug = (slug) => {
  const value = String(slug || '').trim();
  if (!value) return 'empty';
  if (!SLUG_PATTERN.test(value)) return 'invalid';
  if (TAKEN_SLUGS.includes(value.toLowerCase())) return 'taken';
  return 'available';
};

/* ---------------------------------------------------------------- SH-05 */
export const SHARE_PDF = {
  title: 'Download your profile',
  subtitle: 'Pick a format. Your phone and email only go on the file, never on your public link.',
  formats: [
    {
      id: 'profile-pdf',
      title: 'Profile PDF',
      body: '1–2 pages, looks like your GTH profile. Great for emailing.',
    },
    {
      id: 'ats-cv',
      title: 'ATS-friendly CV',
      body: 'Plain layout that job portals and HR software can read.',
      badge: 'Recommended',
    },
  ],
  includeLabel: 'Include',
  include: [
    { id: 'about', label: 'About', on: true },
    { id: 'skills', label: 'Skills (verified first)', on: true },
    { id: 'experience', label: 'Experience', on: true },
    { id: 'education', label: 'Education', on: true },
    { id: 'portfolio', label: 'Portfolio links', on: true },
    { id: 'certs', label: 'Certifications', on: true },
    { id: 'photo', label: 'Photo', on: false },
    { id: 'qr', label: 'Pitch QR code', on: false },
  ],
  contactTitle: 'Add contact details to the file',
  contactHint: 'Recruiters need a way to reach you if the CV gets forwarded.',
  phoneLabel: 'Phone (WhatsApp)',
  phoneCode: '+233',
  phone: '24 533 4521',
  emailLabel: 'Email',
  email: 'kofi.agyekum@gmail.com',
  fileNote: 'PDF · about 180 KB · updated with today’s profile',
  cancel: 'Cancel',
  download: 'Download CV (PDF)',
};

/* ---------------------------------------------------------------- SH-03 … SH-03e */
export const SHARE_CARD = {
  title: 'Make a share card',
  subtitle:
    'A ready-to-post card for your WhatsApp status, IG story or LinkedIn. Only public info goes on it.',
  styleLabel: 'Style',
  sizeLabel: 'Size',
  showLabel: 'Show on card',
  captionLabel: 'Caption (copied when you share)',
  caption: 'Levelled up my profile on Ghana Talent Hub Hiring a data analyst? Let’s talk',
  safety: 'No phone number, school year or exact location goes on the card. Ever.',
  downloadPng: 'Download PNG',
  styles: [
    { id: 'forest', label: 'Forest' },
    { id: 'sunshine', label: 'Sunshine' },
    { id: 'midnight', label: 'Midnight' },
    { id: 'kente', label: 'Kente' },
  ],
  sizes: [
    { id: 'story', label: 'Story 9:16', note: 'Story · 1080 × 1920 px', file: '1080 × 1920' },
    { id: 'post', label: 'Post 1:1', note: 'Post · 1080 × 1080 px', file: '1080 × 1080' },
    {
      id: 'banner',
      label: 'LinkedIn banner',
      note: 'LinkedIn banner · 1584 × 396 px',
      file: '1584 × 396',
    },
  ],
  show: [
    { id: 'skills', label: 'Top 3 verified skills', on: true },
    { id: 'open', label: 'Open to work', on: true },
    { id: 'qr', label: 'QR code + link', on: true },
    { id: 'pitch', label: '“Watch my pitch” link', on: false },
    { id: 'headline', label: 'Headline', on: true },
    { id: 'badges', label: 'Badges', on: false },
  ],
  primary: {
    story: 'Share to WhatsApp status',
    post: 'Share to WhatsApp status',
    banner: 'Open LinkedIn to upload',
  },
  preparing: 'Preparing…',
  liveNote: 'Making your card',
  making: {
    title: 'Making your card…',
    meta: '1080 × 1920 · about 2 seconds',
  },
  saved: {
    title: 'Card saved',
    body: 'kofi-agyekum-story.png is in your Downloads. The QR and link on it track opens, so you’ll see how many people came from this card.',
    nowPost: 'Now post it',
    actions: [
      {
        id: 'whatsapp',
        title: 'Post to WhatsApp Status',
        body: 'Send it to your phone, then post',
      },
      { id: 'linkedin', title: 'Add to LinkedIn', body: 'Post or set as your banner' },
      {
        id: 'caption',
        title: 'Copy caption',
        body: '“Levelled up my profile on Ghana Talent Hub…”',
      },
      { id: 'download', title: 'Download again', body: 'PNG · 1080 × 1920' },
    ],
    makeAnother: 'Make another',
    done: 'Done',
    xp: '+10 pts · first share card',
  },
  note: {
    safeZone: 'We keep the left side clear so your LinkedIn photo doesn’t cover your name.',
  },
};

/* The share card art (Story / Post / Banner), public info only. */
export const CARD_PERSON = {
  firstName: 'Kofi',
  lastName: 'Agyekum',
  fullName: 'Kofi Agyekum',
  headline: 'Aspiring Data Analyst · Accra',
  bannerHeadline: 'Data Analyst · SQL · Power BI · Python',
  skills: ['Data analytics · Top 10%', 'SQL · Level 4', 'Python'],
  openToWork: 'Open to work',
  findMe: 'Find me on',
  brand: 'Ghana Talent Hub',
  url: PROFILE_URL,
  photoHere: 'your LinkedIn photo sits here',
};

/* Card palettes — Figma swatch fills (Forest / Sunshine / Midnight / Kente). */
export const CARD_STYLE_TOKENS = {
  forest: { bg: '#387440', dot: '#ffd86b' },
  sunshine: { bg: '#ffd86b', dot: '#1c2a21' },
  midnight: { bg: '#1c2a21', dot: '#387440' },
  kente: { bg: '#c8951a', dot: '#387440' },
};

/* ---------------------------------------------------------------- SH-03f */
export const SHARE_WHATSAPP = {
  title: 'Post it from your phone',
  subtitle:
    'WhatsApp Status only works on your phone. Scan this and the card opens there, ready to post.',
  expires: 'Expires in 10 min',
  steps: [
    'Open your phone camera and scan',
    'Tap “Share to WhatsApp”',
    'Pick Status, add the caption, post',
  ],
  email: 'Or email it to kofi…@gmail.com',
  captionCopied: 'Caption copied. Paste it when you post.',
  downloadInstead: 'Download instead',
  done: 'Done',
};

/* Frame URL state for each combination of card style + size that has its own frame. */
export const CARD_PRESETS = {
  card: { style: 'forest', size: 'story' },
  'card-midnight': { style: 'midnight', size: 'post' },
  'card-sunshine': { style: 'sunshine', size: 'banner' },
  'card-making': { style: 'forest', size: 'story' },
  'card-saved': { style: 'forest', size: 'story' },
};
export const presetStateFor = (style, size) =>
  Object.entries(CARD_PRESETS).find(
    ([key, preset]) =>
      (key === 'card' || key === 'card-midnight' || key === 'card-sunshine') &&
      preset.style === style &&
      preset.size === size
  )?.[0] ?? null;

/* ---------------------------------------------------------------- QR (Figma "QR code" art) */
/* The same 25 × 25 module matrix is drawn in every frame (rows of lit columns). */
export const QR_SIZE = 25;
export const QR_ROWS = [
  [0, 1, 2, 3, 4, 5, 6, 8, 14, 15, 18, 19, 20, 21, 22, 23, 24],
  [0, 6, 7, 8, 12, 14, 18, 24],
  [0, 2, 3, 4, 6, 7, 8, 11, 14, 15, 18, 20, 21, 22, 24],
  [0, 2, 3, 4, 6, 7, 13, 17, 18, 20, 21, 22, 24],
  [0, 2, 3, 4, 6, 8, 11, 13, 14, 18, 20, 21, 22, 24],
  [0, 6, 10, 11, 12, 17, 18, 24],
  [0, 1, 2, 3, 4, 5, 6, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  [0, 1, 2, 3, 9, 10, 12, 15, 18, 20, 21, 24],
  [0, 4, 5, 6, 7, 9, 15, 16],
  [1, 5, 12, 14, 16, 17, 18, 22],
  [3, 7, 11, 12, 14, 15, 17, 18, 21, 22, 23],
  [0, 1, 2, 5, 6, 7, 9, 10, 13, 14, 18, 19, 21],
  [2, 7, 9, 11, 12, 14, 18, 19],
  [4, 6, 7, 14, 15, 21, 24],
  [0, 1, 3, 4, 9, 10, 11, 16, 17, 18, 19, 21, 23, 24],
  [0, 3, 4, 7, 8, 11, 16, 17, 18, 20, 23],
  [5, 6, 7, 16, 18, 19],
  [1, 6, 7, 8, 11, 12, 13, 14, 15, 16, 19, 21, 24],
  [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 20],
  [0, 6, 14, 17, 18, 20, 23],
  [0, 2, 3, 4, 6, 7, 10, 15, 16, 18, 21],
  [0, 2, 3, 4, 6, 9, 16, 18, 19, 21, 22, 23],
  [0, 2, 3, 4, 6, 9, 10, 11, 14, 16, 17, 18, 20],
  [0, 6, 10, 11, 14, 16, 17, 19, 23, 24],
  [0, 1, 2, 3, 4, 5, 6, 7, 12, 16, 17, 24],
];
