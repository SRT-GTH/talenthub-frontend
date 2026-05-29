import { classNames } from '../../../../utils/classNames.js';
import { useAvatarSelection } from '../../../../hooks/useAvatarSelection.js';
import { debug } from '../../../../utils/debug.js';

// ---------------------------------------------------------------------------
// Recolourable layers — imported as raw SVG text so we can find/replace the
// primary fill colour in code, then re-encode as a data URL for the <img>.
// This is what makes "skin tone", "hair colour", and "outfit colour"
// actually repaint the avatar live.
// ---------------------------------------------------------------------------

import bodyBaseRaw from '../../../../assets/engagement/body-base.svg?raw';

// Normal hairstyles (recolourable). Wrap-around hairstyles (Afro, Hijab,
// Kente Wrap) are NOT recoloured — they keep their designed colours
// because they're really cloth/halo shapes, not "hair fibres."
import hair1Raw from '../../../../assets/engagement/first-hairstyle.svg?raw';
import hair2Raw from '../../../../assets/engagement/second-hairstyle.svg?raw';
import hair4Raw from '../../../../assets/engagement/fourth-hairstyle.svg?raw';
import hair5Raw from '../../../../assets/engagement/fifth-hairstyle.svg?raw';
import hair6Raw from '../../../../assets/engagement/sixth-hairstyle.svg?raw';
import hair7Raw from '../../../../assets/engagement/seventh-hairstyle.svg?raw';
import hair10Raw from '../../../../assets/engagement/tenth-hairstyle.svg?raw';
import hair12Raw from '../../../../assets/engagement/twelveth-hairstyle.svg?raw';

// Wrap-around hairstyles render BEHIND body-base; their colours are
// designed (purple hijab, orange kente, etc.) so we keep static URLs.
import hair3 from '../../../../assets/engagement/third-hairstyle.svg';
import hair8 from '../../../../assets/engagement/eigth-hairstyle.svg';
import hair9 from '../../../../assets/engagement/nineth-hairstyle.svg';

// Outfit (chest) layers — recolourable so the apparel-colour swatches
// actually change the chest colour.
import outfitTeeRaw from '../../../../assets/engagement/first-outfit.svg?raw';
import outfitHoodieRaw from '../../../../assets/engagement/second-outfit.svg?raw';
import outfitPoloRaw from '../../../../assets/engagement/third-outfit.svg?raw';
import outfitButtonDownRaw from '../../../../assets/engagement/fourth-outfit.svg?raw';
import outfitKenteTopRaw from '../../../../assets/engagement/fifth-outfit.svg?raw';
import outfitSuitRaw from '../../../../assets/engagement/sixth-outfit.svg?raw';
import outfitHijabFitRaw from '../../../../assets/engagement/seventh-outfit.svg?raw';
import outfitDashikiRaw from '../../../../assets/engagement/eigth-outfit.svg?raw';
import outfitLabCoatRaw from '../../../../assets/engagement/nineth-outfit.svg?raw';
import outfitChefWhitesRaw from '../../../../assets/engagement/tenth-outfit.svg?raw';
import outfitAthleticRaw from '../../../../assets/engagement/eleventh-outfit.svg?raw';

// Extras — not recolourable, keep their designed colours.
import eyewear2 from '../../../../assets/engagement/second-extras.svg';
import eyewear3 from '../../../../assets/engagement/third-extras.svg';
import eyewear4 from '../../../../assets/engagement/fourth-extras.svg';
import facial6 from '../../../../assets/engagement/sixth-extras.svg';
import facial7 from '../../../../assets/engagement/seventh-extras.svg';
import facial8 from '../../../../assets/engagement/eigth-extras.svg';
import earring10 from '../../../../assets/engagement/tenth-extras.svg';
import earring11 from '../../../../assets/engagement/eleventh-extras.svg';
import earring12 from '../../../../assets/engagement/twelveth-extras.svg';
import detail13 from '../../../../assets/engagement/thirteenth-extras.svg';
import detail14 from '../../../../assets/engagement/fourteenth-extras.svg';
import detail15 from '../../../../assets/engagement/fifteenth-extras.svg';
import detail16 from '../../../../assets/engagement/sixteenth-extras.svg';
import detail17 from '../../../../assets/engagement/seventeenth-extras.svg';

const log = debug('AvatarPreview');

// ---------------------------------------------------------------------------
// Recolouring helpers
// ---------------------------------------------------------------------------

/*
 * findPrimaryFill — guesses the main recolourable colour of an SVG.
 * Strategy: return the fill attribute of the first <path> element. Figma
 * exports the largest/topmost shape first, which for our layers is the
 * shape we want to recolour (hair body, outfit blob, body skin, etc.).
 * If nothing's found, returns null and the layer renders un-recoloured.
 */
const findPrimaryFill = (svgText) => {
  const match = svgText.match(/<path[^>]*fill="(#[0-9A-Fa-f]+|[a-z]+)"/i);
  if (!match) return null;
  const fill = match[1];
  if (fill === 'none' || fill === 'transparent') return null;
  return fill;
};

/*
 * recolor — case-insensitive global replace of one hex colour with
 * another in an SVG text. Matches both `fill="…"` and `stroke="…"` usages
 * because the source colour may appear in both contexts.
 */
const recolor = (svgText, fromHex, toHex) => {
  if (!fromHex || !toHex || fromHex.toLowerCase() === toHex.toLowerCase()) {
    return svgText;
  }
  // Escape regex special chars in the hex (it's all hex chars + `#` so safe)
  return svgText.replace(new RegExp(fromHex, 'gi'), toHex);
};

/*
 * adjustLightness — shift a hex colour brighter or darker. Used by the
 * "Lightness" slider on the Skin panel.
 *   lightness > 0  → blend toward white
 *   lightness < 0  → blend toward black
 *   lightness = 0  → unchanged
 * Range -100 … +100 maps to "fully black" … "fully white" in the extreme.
 */
const adjustLightness = (hex, lightness) => {
  if (!hex || lightness === 0) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  let nr;
  let ng;
  let nb;
  if (lightness > 0) {
    const t = lightness / 100;
    nr = Math.round(r + (255 - r) * t);
    ng = Math.round(g + (255 - g) * t);
    nb = Math.round(b + (255 - b) * t);
  } else {
    const t = 1 + lightness / 100;
    nr = Math.round(r * t);
    ng = Math.round(g * t);
    nb = Math.round(b * t);
  }
  const clamp = (v) => Math.min(255, Math.max(0, v));
  const toHex2 = (v) => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex2(nr)}${toHex2(ng)}${toHex2(nb)}`;
};

/* Convert an inline SVG string to a data URL so it can be used as <img src>. */
const svgToDataUrl = (svgText) => `data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`;

// ---------------------------------------------------------------------------
// Colour palettes — these mirror the swatch arrays in the panels. Keys
// must match the IDs the panels store in the selection.
// ---------------------------------------------------------------------------

const SKIN_TONE_HEX = {
  'soft-almond': '#F4D8B7',
  'warm-sand': '#E8C19A',
  honey: '#C4855E',
  caramel: '#A4683F',
  bronze: '#8B5638',
  'cocoa-light': '#7B4A30',
  cocoa: '#6B3F29',
  mahogany: '#583322',
  chestnut: '#48291B',
  espresso: '#3B2117',
  'deep-cocoa': '#2E1A11',
  onyx: '#1B0D08',
};

const HAIR_COLOR_HEX = {
  black: '#0F0F0F',
  'dark-brown': '#3B2417',
  brown: '#6B3F23',
  auburn: '#8C4A2A',
  chestnut: '#A66332',
  honey: '#C99066',
  // Fashion tones (the image-based swatches) get assigned hex equivalents
  // so they still recolour the hair when picked.
  'blue-tone': '#3B82F6',
  'pink-tone': '#EC4899',
  'green-tone': '#10B981',
};

const APPAREL_COLOR_HEX = {
  'brand-green': '#387440',
  'kente-gold': '#D4A23F',
  'sunset-orange': '#E58B3A',
  rose: '#C95E7C',
  violet: '#6B4D9E',
  ocean: '#2F6B8C',
  charcoal: '#2A2A2A',
  cream: '#EDE3CC',
};

// ---------------------------------------------------------------------------
// Layer registries
// ---------------------------------------------------------------------------

const HAIR_RAW_LAYERS = {
  'hair-1': hair1Raw, // Box Braids
  'hair-2': hair2Raw, // Cornrows
  'hair-4': hair4Raw, // Buzz Cut
  'hair-5': hair5Raw, // Fade
  'hair-6': hair6Raw, // Twists
  'hair-7': hair7Raw, // Locs
  'hair-10': hair10Raw, // Long Curly
  'hair-12': hair12Raw, // Onyx
};

const HAIR_STATIC_LAYERS = {
  'hair-3': hair3, // Afro (wrap-around)
  'hair-8': hair8, // Hijab (wrap-around)
  'hair-9': hair9, // Kente Wrap (wrap-around)
};

const OUTFIT_RAW_LAYERS = {
  'outfit-tee': outfitTeeRaw,
  'outfit-hoodie': outfitHoodieRaw,
  'outfit-polo': outfitPoloRaw,
  'outfit-button-down': outfitButtonDownRaw,
  'outfit-kente-top': outfitKenteTopRaw,
  'outfit-suit': outfitSuitRaw,
  'outfit-hijab-fit': outfitHijabFitRaw,
  'outfit-dashiki': outfitDashikiRaw,
  'outfit-lab-coat': outfitLabCoatRaw,
  'outfit-chef-whites': outfitChefWhitesRaw,
  'outfit-athletic': outfitAthleticRaw,
};

const EYEWEAR_LAYERS = {
  'eyewear-2': eyewear2,
  'eyewear-3': eyewear3,
  'eyewear-4': eyewear4,
};

const FACIAL_HAIR_LAYERS = {
  'facial-6': facial6,
  'facial-7': facial7,
  'facial-8': facial8,
};

const EARRING_LAYERS = {
  'earring-10': earring10,
  'earring-11': earring11,
  'earring-12': earring12,
};

const DETAIL_LAYERS = {
  'detail-13': detail13,
  'detail-14': detail14,
  'detail-15': detail15,
  'detail-16': detail16,
  'detail-17': detail17,
};

// Wrap-around hairstyles render BEHIND body-base so the head + face
// appear ON TOP of the cloth/halo shape.
const WRAP_AROUND_HAIR = new Set(['hair-3', 'hair-8', 'hair-9']);

// ---------------------------------------------------------------------------
// Pre-computed primary colours (run once at module load) — auto-detected
// from each raw SVG so we know what colour to find-and-replace at runtime.
// ---------------------------------------------------------------------------

// body-base.svg uses *five* brown shades for different skin regions —
// the head, the dark inside-neck, the lighter outer-neck/shoulder, and
// two lip shades. They all need to track the picked skin tone, otherwise
// the neck stays dark while the head goes pale. Each shade carries a
// fixed lightness offset from the head colour so they keep their
// relative relationship when the head colour changes.
const BODY_BASE_SKIN_HEX = '#8B5A3C'; // head — the main reference
const BODY_BASE_SKIN_OFFSETS = {
  '#8B5A3C': 0, // head (main)
  '#5B2F14': -50, // inner neck (deep shadow)
  '#986546': 12, // outer neck / shoulder (lighter)
  '#824B25': -20, // lip dark
  '#B38164': 45, // lip highlight
};

const HAIR_RAW_PRIMARY = Object.fromEntries(
  Object.entries(HAIR_RAW_LAYERS).map(([id, raw]) => [id, findPrimaryFill(raw)])
);
const OUTFIT_RAW_PRIMARY = Object.fromEntries(
  Object.entries(OUTFIT_RAW_LAYERS).map(([id, raw]) => [id, findPrimaryFill(raw)])
);

// ---------------------------------------------------------------------------
// Layer rendering helper
// ---------------------------------------------------------------------------

const Layer = ({ src, alt = '' }) => (
  <img
    src={src}
    alt={alt}
    aria-hidden={alt ? undefined : 'true'}
    draggable="false"
    className="absolute inset-0 h-full w-full select-none"
  />
);

// ---------------------------------------------------------------------------
// AvatarPreview
// ---------------------------------------------------------------------------

/*
 * AvatarPreview — live avatar render assembled from layered SVGs.
 * Phase 2 of the avatar customiser plan.
 *
 * Recolours body-base / hair / outfit live based on the user's swatch
 * picks (skinTone, hairColor, apparelColor) plus the Lightness slider.
 * Extras keep their designed colours. Wrap-around hair (Afro, Hijab,
 * Kente Wrap) renders BEHIND body-base and is not recoloured (it's cloth,
 * not hair fibres).
 *
 * Layer order (back → front):
 *   1. Wrap-around hair (Afro, Hijab, Kente Wrap)
 *   2. body-base (head + face + neck, recoloured to skinTone × lightness)
 *   3. Outfit (chest blob, recoloured to apparelColor)
 *   4. Facial hair
 *   5. Details (single-select)
 *   6. Earrings
 *   7. Normal hair (recoloured to hairColor)
 *   8. Eyewear (always on top)
 */

const AvatarPreview = ({ className }) => {
  const { selection, reset } = useAvatarSelection();
  log('render', {
    skinTone: selection.skinTone,
    lightness: selection.lightness,
    hairStyle: selection.hairStyle,
    hairColor: selection.hairColor,
    apparel: selection.apparel,
    apparelColor: selection.apparelColor,
  });

  // ── body-base: skin tone + lightness ────────────────────────────────
  // Apply the picked skin tone (+ lightness slider) to the main head
  // colour, then propagate the same shift to every other skin shade
  // (neck, lips) using each shade's relative-offset from the head. This
  // is what keeps the neck the same colour as the face when the user
  // changes skin tone.
  const skinHex = SKIN_TONE_HEX[selection.skinTone] || BODY_BASE_SKIN_HEX;
  const adjustedSkin = adjustLightness(skinHex, selection.lightness || 0);
  let recoloredBody = bodyBaseRaw;
  for (const [originalHex, offset] of Object.entries(BODY_BASE_SKIN_OFFSETS)) {
    const newHex = adjustLightness(adjustedSkin, offset);
    recoloredBody = recolor(recoloredBody, originalHex, newHex);
  }
  const bodySrc = svgToDataUrl(recoloredBody);

  // ── hair: pick layer (raw or static) and recolour if applicable ─────
  const hairId = selection.hairStyle;
  const isWrapAround = hairId ? WRAP_AROUND_HAIR.has(hairId) : false;
  let hairSrc = null;
  if (hairId && HAIR_RAW_LAYERS[hairId]) {
    const hairHex = HAIR_COLOR_HEX[selection.hairColor];
    const original = HAIR_RAW_PRIMARY[hairId];
    const raw = HAIR_RAW_LAYERS[hairId];
    hairSrc = svgToDataUrl(hairHex ? recolor(raw, original, hairHex) : raw);
  } else if (hairId && HAIR_STATIC_LAYERS[hairId]) {
    hairSrc = HAIR_STATIC_LAYERS[hairId];
  }

  // ── outfit: pick layer and recolour ─────────────────────────────────
  let outfitSrc = null;
  if (selection.apparel && OUTFIT_RAW_LAYERS[selection.apparel]) {
    const outfitHex = APPAREL_COLOR_HEX[selection.apparelColor];
    const original = OUTFIT_RAW_PRIMARY[selection.apparel];
    const raw = OUTFIT_RAW_LAYERS[selection.apparel];
    outfitSrc = svgToDataUrl(outfitHex ? recolor(raw, original, outfitHex) : raw);
  }

  // ── extras: no recolouring ──────────────────────────────────────────
  const eyewearSrc = selection.eyewear ? EYEWEAR_LAYERS[selection.eyewear] : null;
  const facialHairSrc = selection.facialHair ? FACIAL_HAIR_LAYERS[selection.facialHair] : null;
  const earringSrc = selection.earring ? EARRING_LAYERS[selection.earring] : null;
  const detailSrc = selection.details ? DETAIL_LAYERS[selection.details] : null;

  return (
    // OUTER wrapper carries the explicit width — w-full fills its grid
    // cell, max-w caps at min(85vh, 880px) so the avatar's BIG (dominates
    // the green stage) without running off-screen on short viewports.
    // mx-auto centres it within the cell.
    //
    // Earlier iteration used `flex flex-col items-center` here without
    // an explicit width, which made the wrapper shrink to the Reset
    // button's width and the avatar rendered tiny. Setting width on the
    // outer wrapper instead of relying on `w-full` on the inner stack
    // fixes that.
    <div className={classNames('w-full max-w-[min(85vh,880px)] mx-auto', className)}>
      <div
        className={classNames(
          // The actual layer stack — square, fills the wrapper's width.
          'relative aspect-square w-full'
        )}
      >
        {/* Layer 1: wrap-around hair (Afro, Hijab, Kente Wrap) — BEHIND body */}
        {hairSrc && isWrapAround && <Layer src={hairSrc} />}

        {/* Layer 2: body base — head + face + neck */}
        <Layer src={bodySrc} alt="Avatar preview" />

        {/* Layer 3: outfit (chest blob) */}
        {outfitSrc && <Layer src={outfitSrc} />}

        {/* Layer 4: facial hair */}
        {facialHairSrc && <Layer src={facialHairSrc} />}

        {/* Layer 5: details (single-select) */}
        {detailSrc && <Layer src={detailSrc} />}

        {/* Layer 6: earrings */}
        {earringSrc && <Layer src={earringSrc} />}

        {/* Layer 7: normal hair — ON TOP of head */}
        {hairSrc && !isWrapAround && <Layer src={hairSrc} />}

        {/* Layer 8: eyewear — always on top */}
        {eyewearSrc && <Layer src={eyewearSrc} />}
      </div>

      {/* Reset avatar — small pill button beneath the preview, centred.
        Restores every selection field to its default. */}
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={reset}
          className={classNames(
            'inline-flex items-center gap-1 rounded-pill px-3 py-1.5',
            'font-sans text-[12px] leading-4 tracking-[0.2px] font-medium',
            'bg-white/70 border border-border-default text-content-primary',
            'transition-colors duration-150 hover:border-brand-green hover:text-brand-green',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green'
          )}
        >
          ↺ Reset avatar
        </button>
      </div>
    </div>
  );
};

export default AvatarPreview;
