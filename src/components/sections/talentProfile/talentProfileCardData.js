/*
 * Share-card builder data (Figma SC-01..SC-08). Every string is verbatim from the Figma `characters`
 * of Focused 8110:398249… / Playful 7608:6178… (copy is identical in both styles; only the look
 * differs). Mock profile is shaped so an API can replace it.
 */

export const CARD_PROFILE = {
  firstName: 'Kofi',
  lastName: 'Agyekum',
  name: 'Kofi Agyekum',
  headline: 'Aspiring Data Analyst · Accra',
  highlight: 'Top 10% in Data analytics',
  bannerTitle: 'Data Analyst in the making',
  badge: 'Rising Talent · Lvl 4',
  skills: ['Data analytics · Top 10%', 'SQL · Level 4', 'Python'],
  bannerSkills: ['Data analytics', 'SQL', 'Python'],
  link: 'gth.com/kofi-agyekum',
  caption: 'Levelled up my profile on Ghana Talent Hub Hiring a data analyst? Let’s talk',
};

export const HEADLINE_MAX = 40;

export const BUDDY_SUGGESTIONS = [
  'Data Analyst in the making',
  'I make numbers make sense',
  'SQL · Python · Power BI',
];

/* Looks. `bg` = card fill, `name` = name colour, `dot` = swatch dot, `tag` = pick-step tag. */
export const CARD_LOOKS = [
  {
    id: 'forest',
    label: 'Forest',
    bg: '#387440',
    name: '#ffffff',
    swatchBorder: '#1c2a21',
    dot: '#ffd86b',
    tag: 'Most shared',
  },
  {
    id: 'sunshine',
    label: 'Sunshine',
    bg: '#ffd86b',
    name: '#1c2a21',
    swatchBorder: '#e6e6e6',
    dot: '#1c2a21',
  },
  {
    id: 'midnight',
    label: 'Midnight',
    bg: '#1c2a21',
    name: '#ffffff',
    swatchBorder: '#e6e6e6',
    dot: '#387440',
    // Playful swatch dot differs (Figma 7608:9537 swatch) — near-white.
    playfulDot: '#f8f8f4',
    tag: 'High contrast',
  },
  {
    id: 'kente',
    label: 'Kente',
    bg: '#c8951a',
    name: '#1c2a21',
    swatchBorder: '#e6e6e6',
    dot: '#387440',
  },
];

/* Sizes. `route` = the `?card=` value that shows it (SC-02 / SC-04 / SC-05). */
export const CARD_SIZES = [
  { id: 'story', label: 'Story 9:16', route: 'customise', dims: 'Story · 1080 × 1920 px' },
  { id: 'post', label: 'Post 1:1', route: 'post', dims: 'Post · 1080 × 1080 px' },
  {
    id: 'banner',
    label: 'LinkedIn banner',
    route: 'banner',
    dims: 'LinkedIn banner · 1584 × 396 px',
  },
];

export const SIZE_BY_ROUTE = Object.fromEntries(CARD_SIZES.map((s) => [s.route, s]));

/* Show-on-card toggles (order = Figma 2-column reading order). */
export const SHOW_OPTIONS = [
  { id: 'skills', label: 'Top 3 verified skills' },
  { id: 'openToWork', label: 'Open to work' },
  { id: 'qr', label: 'QR code + link' },
  { id: 'pitch', label: '“Watch my pitch” link' },
  { id: 'headline', label: 'Headline' },
  { id: 'badges', label: 'Badges' },
];

export const DEFAULT_SHOW = {
  skills: true,
  openToWork: true,
  qr: true,
  pitch: false,
  headline: true,
  badges: false,
};

/* Step copy (title + subtitle per `?card=` value). */
export const STEP_COPY = {
  pick: {
    title: 'Create a share card',
    sub: 'Pick a look. You can change everything on the next step.',
  },
  customise: {
    title: 'Customise your card',
    sub: 'Change the look, size and what shows. The preview updates as you go.',
  },
  text: {
    title: 'Edit text on card',
    sub: 'Short and punchy works best. Your name comes from your profile.',
  },
  post: {
    title: 'Customise your card',
    sub: 'Square post for Instagram, Facebook or your LinkedIn feed.',
  },
  banner: { title: 'Customise your card', sub: 'A banner for the top of your LinkedIn profile.' },
  making: {
    title: 'Making your card…',
    sub: 'This takes a few seconds. You can keep this open or close it, we’ll keep going.',
  },
  ready: {
    title: 'Your card is ready',
    sub: 'Saved to Profile › Share cards. Share it now or download it for later.',
  },
  error: {
    title: 'We couldn’t make your card',
    sub: 'Nothing is lost. Your look, size and text are saved.',
  },
};

export const STEPPER = ['Pick a look', 'Customise', 'Share'];

export const MAKING_STEPS = [
  { id: 'layout', label: 'Layout and colours', at: 25 },
  { id: 'skills', label: 'Verified skills', at: 45 },
  { id: 'qr', label: 'QR code linked to gth.com/kofi-agyekum', at: 60 },
  { id: 'export', label: 'Exporting a 1080 × 1920 PNG', at: 90 },
  { id: 'caption', label: 'Copying your caption', at: 100 },
];

export const SHARE_TARGETS = [
  {
    id: 'whatsapp',
    title: 'WhatsApp Status',
    sub: 'Opens WhatsApp with the image and your caption',
  },
  { id: 'instagram', title: 'Instagram Story', sub: 'Opens Instagram stories with the image' },
  { id: 'linkedin', title: 'LinkedIn post', sub: 'Image and caption go into a new post' },
  { id: 'download', title: 'Download PNG', sub: '1080 × 1920 · 420 KB' },
  { id: 'copy', title: 'Copy caption', sub: '“Levelled up my profile on Ghana Talent Hub…”' },
];

export const TOAST_COPY = {
  focused: 'First share card made · +10 pts',
  playful: 'First share card made · +10 XP',
};

/*
 * QR modules (25 × 25), read from the Figma QR rectangles (Playful 7608:9610: 2.08px modules; the
 * Focused card uses the same pattern at 1.29px). '#' = dark module.
 */
export const QR_MATRIX = [
  '#######.#.....##..#######',
  '#.....###...#.#...#.....#',
  '#.###.###..#..##..#.###.#',
  '#.###.##.....#...##.###.#',
  '#.###.#.#..#.##...#.###.#',
  '#.....#...###....##.....#',
  '#######....#..###########',
  '####.....##.#..#..#.##..#',
  '#...####.#.....##........',
  '.#...#......#.#.###...#..',
  '...#...#...##.##.##..###.',
  '###..###.##..##...##.#...',
  '..#....#.#.##.#...##.....',
  '....#.##......##.....#..#',
  '##.##....###....####.#.##',
  '#..##..##..#....###.#..#.',
  '.....###........#.##.....',
  '.#....###..######..#.#..#',
  '########.##.........#....',
  '#.....#.......#..##.#..#.',
  '#.###.##..#....##.#..#...',
  '#.###.#..#......#.##.###.',
  '#.###.#..###..#.###.#....',
  '#.....#...##..#.##.#...##',
  '########....#...##......#',
];

/* Card art design size (Figma preview frames): Story 300×533, Post 360×360, Banner 352×88. */
export const ART_SIZE = {
  story: { w: 300, h: 533 },
  post: { w: 360, h: 360 },
  banner: { w: 352, h: 88 },
};
