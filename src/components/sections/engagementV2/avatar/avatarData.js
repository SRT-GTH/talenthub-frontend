/*
 * Avatar selection (engagement revamp) — static data. Copy is VERBATIM from the Figma nodes (Focused 8285:3264 / Playful 3218:2745).
 * Selection ids are the ones the app-root AvatarSelectionProvider already uses (skinTone, hairStyle, eyewear, apparel …), so the
 * layered AvatarPreview and Career Buddy keep working. Tile art = the existing layered-avatar part assets (src/assets/engagement).
 * Tile `art: [w, h]` = the Figma "SVG" node size of that tile (design px).
 */
import avatar1 from '../../../../assets/engagement/firstavatar.svg';
import avatar2 from '../../../../assets/engagement/secondavatar.svg';
import avatar3 from '../../../../assets/engagement/thirdavatar.svg';
import avatar4 from '../../../../assets/engagement/fourthavatar.svg';
import avatar5 from '../../../../assets/engagement/fifthavatar.svg';
import avatar6 from '../../../../assets/engagement/sixthavatar.svg';
import avatar7 from '../../../../assets/engagement/seventhavatar.svg';
import avatar8 from '../../../../assets/engagement/eigthavatar.svg';
import avatar9 from '../../../../assets/engagement/ninethavatar.svg';
import avatar10 from '../../../../assets/engagement/tenthavatar.svg';
import hair1 from '../../../../assets/engagement/firsthairstyle.svg';
import hair2 from '../../../../assets/engagement/secondhairstyle.svg';
import hair3 from '../../../../assets/engagement/thirdhairstyle.svg';
import hair4 from '../../../../assets/engagement/fourthhairstyle.svg';
import hair5 from '../../../../assets/engagement/fifthhairstyle.svg';
import hair6 from '../../../../assets/engagement/sixthhairstyle.svg';
import hair7 from '../../../../assets/engagement/seventhhairstyle.svg';
import hair8 from '../../../../assets/engagement/eighthhairstyle.svg';
import hair9 from '../../../../assets/engagement/ninethhairstyle.svg';
import hair10 from '../../../../assets/engagement/tenthhairstyle.svg';
import hair11 from '../../../../assets/engagement/eleventhhairstyle.svg';
import hair12 from '../../../../assets/engagement/twelvethhairstyle.svg';
import extra2 from '../../../../assets/engagement/secondextra.svg';
import extra3 from '../../../../assets/engagement/thirdextra.svg';
import extra4 from '../../../../assets/engagement/fourthextra.svg';
import extra6 from '../../../../assets/engagement/sixthextra (2).svg';
import extra7 from '../../../../assets/engagement/seventhextra (2).svg';
import extra8 from '../../../../assets/engagement/eigthextra (2).svg';
import extra10 from '../../../../assets/engagement/tenthextra.svg';
import extra11 from '../../../../assets/engagement/eleventhextra.svg';
import extra12 from '../../../../assets/engagement/twelvethextra.svg';
import extra13 from '../../../../assets/engagement/thirteenthextra.svg';
import extra14 from '../../../../assets/engagement/fourteenthextra.svg';
import extra15 from '../../../../assets/engagement/fifteenthextra.svg';
import extra16 from '../../../../assets/engagement/sixteenthextra.svg';
import extra17 from '../../../../assets/engagement/seventeenthextra.svg';
import outfit1 from '../../../../assets/engagement/firstoutfit.svg';
import outfit2 from '../../../../assets/engagement/secondoutfit.svg';
import outfit3 from '../../../../assets/engagement/thirdoutfit.svg';
import outfit4 from '../../../../assets/engagement/fourthoutfit.svg';
import outfit5 from '../../../../assets/engagement/fifthoutfit.svg';
import outfit6 from '../../../../assets/engagement/sixthoutfit.svg';
import outfit7 from '../../../../assets/engagement/seventhoutfit.svg';
import outfit8 from '../../../../assets/engagement/eigthoutfit.svg';
import outfit9 from '../../../../assets/engagement/ninethoutfit.svg';
import outfit10 from '../../../../assets/engagement/tenthoutfit.svg';
import outfit11 from '../../../../assets/engagement/eleventhoutfit.svg';
import weatherDaylight from '../../../../assets/engagement-v2/avatar/weather-daylight.svg';
import studioLight from '../../../../assets/engagement-v2/avatar/studio-light.svg';
import goldenHour from '../../../../assets/engagement-v2/avatar/golden-hour.svg';

export const AVATAR_ROUTES = {
  style: '/profile/engagement/avatar',
  skin: '/profile/engagement/avatar/skin',
  hair: '/profile/engagement/avatar/hair',
  extras: '/profile/engagement/avatar/extras',
  outfit: '/profile/engagement/avatar/outfit',
};

export const AVATAR_TABS = [
  { id: 'style', label: 'Style' },
  { id: 'skin', label: 'Skin' },
  { id: 'hair', label: 'Hair' },
  { id: 'extras', label: 'Extras' },
  { id: 'outfit', label: 'Outfit' },
];

/* Stat pills under the panel heading (the Style frame says "10 styles · 12 skin tones · 12 hairstyles · 14 extras"; the Switch Modes frame's
   page behind the overlay says "24 styles · 12 Skin Tones · 18 Hairstyles · 14 Extras"). */
export const STAT_PILLS = [
  { n: '10', label: 'styles' },
  { n: '12', label: 'skin tones' },
  { n: '12', label: 'hairstyles' },
  { n: '14', label: 'extras' },
];

/* Per-step page copy + measured layout (design px from the node data; hero/panel positions are relative to the stage's top). */
export const STEP_META = {
  style: {
    tag: 'Avatar · Style',
    heading: 'Pick your vibe.',
    headingSize: 44,
    headingLine: 53,
    headingTracking: '-0.88px',
    headingW: 315,
    nowrap: true,
    title: 'Customise your look',
    subtitle: 'Pick a base. The preview updates as you tap.',
    sticker: { text: 'STEP 1 · +50 XP', x: 387 },
    back: 'Go back',
    next: 'Looks good, next',
    saved: 'Auto-saved · changes carry to all tabs',
    sparkleBottom: 756,
    panelTop: 25,
    panelMin: 894,
    cardH: 150,
  },
  skin: {
    tag: 'Avatar · Skin Tone',
    heading: 'Your shade, your way.',
    headingSize: 37,
    headingLine: 44,
    headingTracking: '-0.74px',
    headingW: 322,
    title: 'Pick your skin tone',
    subtitle: '12 shades plus fine-tune. Your avatar updates live.',
    sticker: { text: 'NO DEFAULTS', x: 387 },
    back: 'Go back',
    next: 'Save tone, next',
    saved: 'Auto-saved · changes carry to all tabs',
    sparkleBottom: 630,
    panelTop: 36,
    panelMin: 894,
    cardH: 138,
  },
  hair: {
    tag: 'Avatar · Hair',
    heading: 'Crown Energy',
    headingSize: 37,
    headingLine: 44,
    headingTracking: '-0.74px',
    headingW: 221,
    nowrap: true,
    title: 'Choose your hairstyle',
    subtitle: '12 styles, every texture. The preview updates as you tap.',
    sticker: { text: 'ALL TEXTURES', x: 256 },
    back: 'Go back',
    next: 'Save tone, next',
    saved: 'Auto-saved · hair colour pairs with any skin tone',
    sparkleBottom: 614,
    panelTop: 47,
    panelMin: 877,
    cardH: 138,
  },
  extras: {
    tag: 'Avatar · Extras',
    heading: 'Little extras, big energy.',
    headingSize: 37,
    headingLine: 44,
    headingTracking: '-0.74px',
    headingW: 367,
    nowrap: true,
    title: 'Add your extras',
    subtitle: 'Glasses, facial hair, earrings and details. Mix what fits.',
    sticker: { text: 'MIX IT', x: 360 },
    back: 'Go back',
    next: 'Save extras, next ',
    saved: 'Auto-saved · extras show on your card and profile',
    sparkleBottom: 756,
    panelTop: 38,
    panelMin: 1014,
    cardH: 138,
  },
  outfit: {
    tag: 'Avatar · Outfit · Last one!',
    heading: ['Dress how you', 'show up.'],
    headingSize: 37,
    headingLine: 44,
    headingTracking: '-0.74px',
    headingW: 322,
    title: 'Pick your fit',
    subtitle: 'Start from a career preset or build it piece by piece.',
    sticker: { text: 'LAST ONE', x: 257 },
    back: 'Go back',
    next: 'Save outfit ,  finish avatar',
    saved: 'Auto-saved · last step, then your avatar is done',
    sparkleBottom: 756,
    panelTop: 54,
    panelMin: 877,
    cardH: 138,
  },
};

export const STYLE_TILES = [
  { id: 'style-1', label: 'Style 1', image: avatar1 },
  { id: 'style-2', label: 'Style 2', image: avatar2 },
  { id: 'style-3', label: 'Style 3', image: avatar3 },
  { id: 'style-4', label: 'Style 4', image: avatar4 },
  { id: 'style-5', label: 'Style 5', image: avatar5 },
  { id: 'style-6', label: 'Style 6', image: avatar6 },
  { id: 'style-7', label: 'Style 7', image: avatar7 },
  { id: 'style-8', label: 'Style 8', image: avatar8 },
  { id: 'style-9', label: 'Style 9', image: avatar9 },
  { id: 'style-10', label: 'Style 10', image: avatar10 },
];

/* Each base style pre-fills the other steps (existing behaviour of the previous Style panel; kept so presets still reach the preview). */
export const STYLE_PRESETS = {
  'style-1': {
    skinTone: 'cocoa',
    lightness: 0,
    hairStyle: 'hair-1',
    hairColor: 'black',
    apparel: 'outfit-tee',
    apparelColor: 'brand-green',
    fit: 'regular',
    eyewear: 'eyewear-none',
    facialHair: 'facial-none',
    earring: 'earring-none',
    details: null,
  },
  'style-2': {
    skinTone: 'mahogany',
    lightness: 0,
    hairStyle: 'hair-2',
    hairColor: 'dark-brown',
    apparel: 'outfit-hoodie',
    apparelColor: 'rose',
    fit: 'relaxed',
    eyewear: 'eyewear-none',
    facialHair: 'facial-7',
    earring: 'earring-none',
    details: null,
  },
  'style-3': {
    skinTone: 'cocoa-light',
    lightness: 0,
    hairStyle: 'hair-3',
    hairColor: 'black',
    apparel: 'outfit-polo',
    apparelColor: 'violet',
    fit: 'regular',
    eyewear: 'eyewear-2',
    facialHair: 'facial-none',
    earring: 'earring-none',
    details: null,
  },
  'style-4': {
    skinTone: 'bronze',
    lightness: 0,
    hairStyle: 'hair-4',
    hairColor: 'black',
    apparel: 'outfit-suit',
    apparelColor: 'brand-green',
    fit: 'slim',
    eyewear: 'eyewear-none',
    facialHair: 'facial-8',
    earring: 'earring-none',
    details: null,
  },
  'style-5': {
    skinTone: 'caramel',
    lightness: 0,
    hairStyle: 'hair-5',
    hairColor: 'auburn',
    apparel: 'outfit-button-down',
    apparelColor: 'kente-gold',
    fit: 'regular',
    eyewear: 'eyewear-3',
    facialHair: 'facial-6',
    earring: 'earring-none',
    details: null,
  },
  'style-6': {
    skinTone: 'cocoa',
    lightness: 0,
    hairStyle: 'hair-6',
    hairColor: 'chestnut',
    apparel: 'outfit-kente-top',
    apparelColor: 'kente-gold',
    fit: 'regular',
    eyewear: 'eyewear-none',
    facialHair: 'facial-none',
    earring: 'earring-10',
    details: 'detail-13',
  },
  'style-7': {
    skinTone: 'mahogany',
    lightness: 0,
    hairStyle: 'hair-7',
    hairColor: 'black',
    apparel: 'outfit-dashiki',
    apparelColor: 'rose',
    fit: 'relaxed',
    eyewear: 'eyewear-none',
    facialHair: 'facial-none',
    earring: 'earring-12',
    details: null,
  },
  'style-8': {
    skinTone: 'cocoa',
    lightness: 0,
    hairStyle: 'hair-8',
    hairColor: 'black',
    apparel: 'outfit-hijab-fit',
    apparelColor: 'violet',
    fit: 'regular',
    eyewear: 'eyewear-none',
    facialHair: 'facial-none',
    earring: 'earring-none',
    details: 'detail-15',
  },
  'style-9': {
    skinTone: 'bronze',
    lightness: 0,
    hairStyle: 'hair-10',
    hairColor: 'brown',
    apparel: 'outfit-lab-coat',
    apparelColor: 'red',
    fit: 'regular',
    eyewear: 'eyewear-2',
    facialHair: 'facial-none',
    earring: 'earring-none',
    details: null,
  },
  'style-10': {
    skinTone: 'cocoa',
    lightness: 0,
    hairStyle: 'hair-12',
    hairColor: 'black',
    apparel: 'outfit-athletic',
    apparelColor: 'ocean',
    fit: 'regular',
    eyewear: 'eyewear-none',
    facialHair: 'facial-none',
    earring: 'earring-11',
    details: 'detail-16',
  },
};

/* Quick-pick skin tones on the Style step (Figma 8285:4258, 8 swatches) — ids = the first 8 skin ids; colours as drawn. */
export const QUICK_SKIN = [
  { id: 'soft-almond', color: '#f5d0a9', label: 'Soft Almond' },
  { id: 'warm-sand', color: '#e0aa7a', label: 'Warm Sand' },
  { id: 'honey', color: '#b9825a', label: 'Honey' },
  { id: 'caramel', color: '#8b5a3c', label: 'Caramel' },
  { id: 'bronze', color: '#6b4226', label: 'Bronze' },
  { id: 'cocoa-light', color: '#4e2c18', label: 'Cocoa Light' },
  { id: 'cocoa', color: '#3a1f10', label: 'Cocoa' },
  { id: 'mahogany', color: '#2a1508', label: 'Mahogany' },
];

/* 12 shades (Figma 8285:6385). Colours as drawn; the layered preview paints with its own skin table keyed by the same id. */
export const SKIN_SHADES = [
  { id: 'soft-almond', color: '#f5d0a9', label: 'Soft Almond' },
  { id: 'warm-sand', color: '#ebc18a', label: 'Warm Sand' },
  { id: 'honey', color: '#e0aa7a', label: 'Honey' },
  { id: 'caramel', color: '#c9966a', label: 'Caramel' },
  { id: 'bronze', color: '#b9825a', label: 'Bronze' },
  { id: 'cocoa-light', color: '#a06b4a', label: 'Cocoa Light' },
  { id: 'cocoa', color: '#8b5a3c', label: 'Cocoa' },
  { id: 'mahogany', color: '#6b4226', label: 'Mahogany' },
  { id: 'chestnut', color: '#5a3320', label: 'Chestnut' },
  { id: 'espresso', color: '#4e2c18', label: 'Espresso' },
  { id: 'deep-cocoa', color: '#3a1f10', label: 'Deep Cocoa' },
  { id: 'onyx', color: '#2a1508', label: 'Onyx' },
];

export const LIGHTING = [
  { id: 'daylight', label: 'Daylight', sub: 'Default', icon: weatherDaylight, iconSize: 24 },
  { id: 'studio', label: 'Studio', sub: 'Soft warm', icon: studioLight, iconSize: 20 },
  { id: 'golden-hour', label: 'Golden hour', sub: 'Cinematic', icon: goldenHour, iconSize: 24 },
];

export const HAIRSTYLES = [
  { id: 'hair-1', label: 'Box Braids', image: hair1, art: [52, 40] },
  { id: 'hair-2', label: 'Cornrows', image: hair2, art: [54, 42] },
  { id: 'hair-3', label: 'Afro', image: hair3, art: [59, 47] },
  { id: 'hair-4', label: 'Buzz Cut', image: hair4, art: [47, 36] },
  { id: 'hair-5', label: 'Fade', image: hair5, art: [50, 35] },
  { id: 'hair-6', label: 'Twists', image: hair6, art: [48, 37] },
  { id: 'hair-7', label: 'Locs', image: hair7, art: [63, 49] },
  { id: 'hair-8', label: 'Hijab', image: hair8, art: [47, 37] },
  { id: 'hair-9', label: 'Kente Wrap', image: hair9, art: [60, 47] },
  { id: 'hair-10', label: 'Long Curly', image: hair10, art: [47, 37] },
  { id: 'hair-11', label: 'Bald', image: hair11, art: [47, 37] },
  { id: 'hair-12', label: 'Bantu Knots', image: hair12, art: [55, 44] },
];

/* 9 hair colours (Figma 8285:7546); the last three carry a small dyed-colour badge (gradient #ec4899 -> #7c3aed). Ids = the existing hairColor ids. */
export const HAIR_COLORS = [
  { id: 'black', color: '#1e1b1b', label: 'Black' },
  { id: 'dark-brown', color: '#2e1a10', label: 'Dark Brown' },
  { id: 'brown', color: '#5d4037', label: 'Brown' },
  { id: 'auburn', color: '#8b5a3c', label: 'Auburn' },
  { id: 'chestnut', color: '#c9966a', label: 'Chestnut' },
  { id: 'honey', color: '#e8b86e', label: 'Honey' },
  { id: 'blue-tone', color: '#7c3aed', label: 'Violet', dyed: true },
  { id: 'pink-tone', color: '#ec4899', label: 'Pink', dyed: true },
  { id: 'green-tone', color: '#387440', label: 'Green', dyed: true },
];

export const EYEWEAR = [
  { id: 'eyewear-none', label: 'None', sub: 'No glasses' },
  { id: 'eyewear-2', label: 'Round', image: extra2, art: [57, 42] },
  { id: 'eyewear-3', label: 'Square', image: extra3, art: [53, 47] },
  { id: 'eyewear-4', label: 'Cat-eye', image: extra4, art: [54, 48] },
];
export const FACIAL_HAIR = [
  { id: 'facial-none', label: 'None', sub: 'Clean' },
  { id: 'facial-6', label: 'Goatee', image: extra6, art: [62, 56] },
  { id: 'facial-7', label: 'Stubble', image: extra7, art: [55, 48] },
  { id: 'facial-8', label: 'Full Beard', image: extra8, art: [58, 52] },
];
export const EARRINGS = [
  { id: 'earring-none', label: 'None', sub: 'No Earring' },
  { id: 'earring-10', label: 'Stud', image: extra10, art: [7, 7] },
  { id: 'earring-11', label: 'Hoop', image: extra11, art: [26, 26] },
  { id: 'earring-12', label: 'Drop', image: extra12, art: [53, 48] },
];
/* Details (multi-select). Figma shows 5 tiles in this order; art is mapped by position onto the existing detail-13..17 layers. */
export const DETAILS = [
  { id: 'detail-13', label: 'Freckles', image: extra13, art: [54, 48] },
  { id: 'detail-14', label: 'Adinkra mark', image: extra14, art: [54, 48] },
  { id: 'detail-15', label: 'Bold brows', image: extra15, art: [54, 48] },
  { id: 'detail-16', label: 'Beauty mark', image: extra16, art: [54, 48] },
  { id: 'detail-17', label: 'Blush', image: extra17, art: [21, 38] },
];
/* Accessory colour swatches (Figma 8285:8702, same 9 as the hair colours). Ids = the tint ids the preview knows (black, brown, gold, rose-gold);
   the others are stored but the preview has no tint for them. */
export const TINT_SWATCHES = [
  { id: 'black', color: '#1e1b1b', label: 'Black' },
  { id: 'dark-brown', color: '#2e1a10', label: 'Dark Brown' },
  { id: 'brown', color: '#5d4037', label: 'Brown' },
  { id: 'auburn', color: '#8b5a3c', label: 'Auburn' },
  { id: 'rose-gold', color: '#c9966a', label: 'Rose Gold' },
  { id: 'gold', color: '#e8b86e', label: 'Gold' },
  { id: 'violet', color: '#7c3aed', label: 'Violet', dyed: true },
  { id: 'pink', color: '#ec4899', label: 'Pink', dyed: true },
  { id: 'green', color: '#387440', label: 'Green', dyed: true },
];

export const CAREER_PRESETS = [
  { id: 'designer', label: 'Designer fit' },
  { id: 'engineer', label: 'Engineer fit' },
  { id: 'healthcare', label: 'Healthcare fit' },
  { id: 'educator', label: 'Educator fit' },
];
export const OUTFITS = [
  { id: 'outfit-tee', label: 'Tee', image: outfit1, art: [49, 48] },
  { id: 'outfit-hoodie', label: 'Hoodie', image: outfit2, art: [62, 54] },
  { id: 'outfit-polo', label: 'Polo', image: outfit3, art: [40, 32] },
  { id: 'outfit-button-down', label: 'Button-down', image: outfit4, art: [50, 50] },
  { id: 'outfit-kente-top', label: 'Kente Top', image: outfit5, art: [57, 56] },
  { id: 'outfit-suit', label: 'Suit', image: outfit6, art: [45, 38] },
  { id: 'outfit-hijab-fit', label: 'Hijab fit', image: outfit7, art: [48, 47] },
  { id: 'outfit-dashiki', label: 'Dashiki', image: outfit8, art: [51, 51] },
  { id: 'outfit-lab-coat', label: 'Lab coat', image: outfit9, art: [47, 47] },
  { id: 'outfit-chef-whites', label: 'Chef whites', image: outfit10, art: [49, 49] },
  { id: 'outfit-athletic', label: 'Athletic', image: outfit11, art: [67, 66] },
];
export const FITS = [
  { id: 'slim', label: 'Slim' },
  { id: 'regular', label: 'Regular' },
  { id: 'relaxed', label: 'Relaxed' },
];
/* 8 colour swatches (Figma 8285:9801). The first is the multi-colour "designer colours" swatch = no recolour (apparelColor null). */
export const APPAREL_SWATCHES = [
  { id: null, label: 'Original colours' },
  { id: 'violet', color: '#7c3aed', label: 'Violet' },
  { id: 'charcoal', color: '#0f172a', label: 'Charcoal' },
  { id: 'cream', color: '#ffffff', label: 'White' },
  { id: 'red', color: '#dc2626', label: 'Red' },
  { id: 'ocean', color: '#0ea5e9', label: 'Sky' },
  { id: 'brand-green', color: '#10b981', label: 'Green' },
  { id: 'kente-gold', color: '#fbbf24', label: 'Yellow' },
];

/* "Switch Modes" dialog (Figma 8285:5370) — copy verbatim. */
export const MODE_DIALOG = {
  caption: 'Switch any time',
  title: 'How would you like to add your details',
  lede: "Three ways to do this — pick whatever feels right today. You can switch anytime, mix-and-match, or come back later. Nothing's locked in.",
  footnote:
    "Don't worry you can mix and match. Upload a CV, then add freelance gigs by chat, then edit a date manually.",
  options: [
    {
      id: 'manual',
      meta: '~3 min ',
      title: 'Fill it in myself',
      body: 'Enter each role one at a time. Full control, no surprises.',
      action: 'Start Typing',
    },
    {
      id: 'chat',
      meta: '~5 min · feels like a chat',
      title: 'Chat with Career Buddy',
      body: 'Career Buddy asks, you answer, she fills the form.',
      action: 'Say Hi to Career Buddy',
      badge: 'Most popular',
    },
    {
      id: 'cv',
      meta: '~30 sec to confirm',
      title: 'Upload my CV',
      body: "Drop your CV; we'll extract roles, dates, education, and skills for your review.",
      action: 'Drop File',
    },
  ],
};

/* "✓ n selected" chip counts. */
export const extrasSelectedCount = (s) =>
  (s.eyewear && s.eyewear !== 'eyewear-none' ? 1 : 0) +
  (s.facialHair && s.facialHair !== 'facial-none' ? 1 : 0) +
  (s.earring && s.earring !== 'earring-none' ? 1 : 0) +
  (s.details ? 1 : 0);

export const outfitSelectedCount = (s) =>
  (s.apparel ? 1 : 0) + (s.careerPreset ? 1 : 0) + (s.fit ? 1 : 0) + 1;

/* Font stacks for the numerals / labels Figma sets in Space Grotesk and Inter. */
export const FONT_SPACE = { fontFamily: "'Space Grotesk', var(--font-ui)" };
export const FONT_INTER = { fontFamily: "'Inter', var(--font-sans)" };
