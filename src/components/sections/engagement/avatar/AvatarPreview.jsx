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

// Eyewear + earrings — imported as raw so they can be recoloured by the
// Tint colour swatch on the Extras panel (changes glasses/earring metal
// to gold / silver / rose-gold / etc).
import eyewear2Raw from '../../../../assets/engagement/second-extras.svg?raw';
import eyewear3Raw from '../../../../assets/engagement/third-extras.svg?raw';
import eyewear4Raw from '../../../../assets/engagement/fourth-extras.svg?raw';
import earring10Raw from '../../../../assets/engagement/tenth-extras.svg?raw';
import earring11Raw from '../../../../assets/engagement/eleventh-extras.svg?raw';
import earring12Raw from '../../../../assets/engagement/twelveth-extras.svg?raw';

// Facial hair + details — keep their designed colours, no recolouring.
import facial6 from '../../../../assets/engagement/sixth-extras.svg';
import facial7 from '../../../../assets/engagement/seventh-extras.svg';
import facial8 from '../../../../assets/engagement/eigth-extras.svg';
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
 * Strategy: look at the FIRST <path> element. Figma exports the
 * largest/topmost shape first, which for our layers is the shape we
 * want to recolour (hair body, outfit blob, body skin, etc.). Try its
 * `fill=` attribute first; fall back to `stroke=` for line-based icons
 * (e.g. glasses outlines, hoop earrings) that have no fill at all.
 * If neither is found or both are `none`, returns null and the layer
 * renders un-recoloured.
 */
const findPrimaryFill = (svgText) => {
  const fillMatch = svgText.match(/<path[^>]*\bfill="(#[0-9A-Fa-f]+|[a-z]+)"/i);
  if (fillMatch) {
    const fill = fillMatch[1];
    if (fill !== 'none' && fill !== 'transparent') return fill;
  }
  const strokeMatch = svgText.match(/<path[^>]*\bstroke="(#[0-9A-Fa-f]+|[a-z]+)"/i);
  if (strokeMatch) {
    const stroke = strokeMatch[1];
    if (stroke !== 'none' && stroke !== 'transparent') return stroke;
  }
  return null;
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

// Tint colours — applied to eyewear + earring layers when the user
// picks a swatch in the Extras panel's Tint row.
const TINT_COLOR_HEX = {
  black: '#0F0F0F',
  gold: '#D4A23F',
  silver: '#C7C7C7',
  'rose-gold': '#D9846F',
  brown: '#6B3F23',
  clear: '#E9F0F3',
};

const APPAREL_COLOR_HEX = {
  'brand-green': '#387440',
  'kente-gold': '#D4A23F',
  'sunset-orange': '#E58B3A',
  red: '#DC2626',
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

// Eyewear + earring layers are raw SVG text so they can be tinted by
// the user's Tint colour choice on the Extras panel.
const EYEWEAR_RAW_LAYERS = {
  'eyewear-2': eyewear2Raw,
  'eyewear-3': eyewear3Raw,
  'eyewear-4': eyewear4Raw,
};

const EARRING_RAW_LAYERS = {
  'earring-10': earring10Raw,
  'earring-11': earring11Raw,
  'earring-12': earring12Raw,
};

const FACIAL_HAIR_LAYERS = {
  'facial-6': facial6,
  'facial-7': facial7,
  'facial-8': facial8,
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

// body-base.svg uses brown shades for different skin regions — the head,
// the dark inside-neck, and the lighter outer-neck/shoulder. They all
// need to track the picked skin tone, otherwise the neck stays dark
// while the head goes pale. Each shade carries a fixed lightness offset
// from the head colour so they keep their relative relationship when
// the head colour changes.
//
// IMPORTANT: we deliberately do NOT recolour the NOSE shades (#824B25
// and #B38164, which sit at y≈341–352 between the eyes and mouth). On
// dark skin tones they'd shift to nearly the same shade as the head and
// the nose would disappear — which was the "no face on Style 2 (mahogany)"
// bug. Keeping them at their drawn brown lets the nose read on every
// skin tone (slightly darker than light skin, slightly lighter than
// very dark skin — visible either way).
//
// Auto-detect the head colour from the actual SVG file at module load
// (it's the fill on the first <path>, which is the head ellipse). This
// way if Figma re-exports the head with a different hex, the recolour
// still works without a code change. If detection fails for any reason
// we fall back to the known-good hex.
const detectHeadFill = (svgText) => {
  const match = svgText.match(/<path[^>]*fill="(#[0-9A-Fa-f]+)"/i);
  return match ? match[1] : '#8B5A3C';
};
const BODY_BASE_SKIN_HEX = detectHeadFill(bodyBaseRaw);
const BODY_BASE_SKIN_OFFSETS = {
  [BODY_BASE_SKIN_HEX]: 0, // head (main) — auto-detected from the SVG
  '#5B2F14': -50, // inner neck (deep shadow)
  '#986546': 12, // outer neck / shoulder (lighter)
};

const HAIR_RAW_PRIMARY = Object.fromEntries(
  Object.entries(HAIR_RAW_LAYERS).map(([id, raw]) => [id, findPrimaryFill(raw)])
);
const OUTFIT_RAW_PRIMARY = Object.fromEntries(
  Object.entries(OUTFIT_RAW_LAYERS).map(([id, raw]) => [id, findPrimaryFill(raw)])
);
const EYEWEAR_RAW_PRIMARY = Object.fromEntries(
  Object.entries(EYEWEAR_RAW_LAYERS).map(([id, raw]) => [id, findPrimaryFill(raw)])
);
// Each earring SVG starts with two ear-shape paths in skin colour
// (#8B5A3C) before the actual earring metal/accent shapes. Without
// this override, findPrimaryFill would pick up the SKIN colour and
// the tint would recolour the ears, not the earrings. The hex values
// below are the actual earring colour in each SVG (extracted by
// reading the source).
const EARRING_RAW_PRIMARY_OVERRIDE = {
  'earring-10': '#F59E0B', // Stud — small gold dot
  'earring-11': '#FBBF24', // Hoop — gold ring (stroke)
  'earring-12': '#FBBF24', // Drop — gold connecting line + top stud
};
const EARRING_RAW_PRIMARY = Object.fromEntries(
  Object.entries(EARRING_RAW_LAYERS).map(([id, raw]) => [
    id,
    EARRING_RAW_PRIMARY_OVERRIDE[id] || findPrimaryFill(raw),
  ])
);

// ---------------------------------------------------------------------------
// Layer rendering helper
// ---------------------------------------------------------------------------

// Each layer becomes an <image> element inside the wrapper SVG below.
// The wrapper's viewBox crops every layer's full 1024×1024 canvas down
// to the character area (LAYER_VIEWBOX). All layers share the same
// coordinate space so they automatically register/align.
//
// Tightened viewBox from 400×400 → 340×340 (centred on the avatar's
// natural centre at x≈550, y≈390). The smaller viewBox means the
// rendered avatar fills MORE of the wrapper — visible head+body
// scale up by ~17.6% without growing the ring around them. Top of
// head and outfit bottom both go a few units outside the viewBox,
// but the translateY shift below brings the head into view and the
// disc clip naturally trims the outfit's bottom edge.
const LAYER_VIEWBOX = '380 220 340 340';

// `key={src}` forces React to unmount + remount the <image> element
// whenever the data URL changes. Without this, some browsers don't
// reliably reload an SVG <image> when only its `href` attribute is
// patched in place — the recoloured SVG would be in the prop tree but
// the rendered DOM would still show the previous version.
const Layer = ({ src }) => <image key={src} href={src} x="0" y="0" width="1024" height="1024" />;

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
  const { selection } = useAvatarSelection();

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

  // Full debug snapshot — useful when diagnosing "why didn't this colour
  // change?". Logs the selection state plus the resolved hexes that get
  // applied to the body-base. Cleared in prod by debug().
  log('render', {
    skinTone: selection.skinTone,
    lightness: selection.lightness,
    skinHex,
    adjustedSkin,
    headDetectedAs: BODY_BASE_SKIN_HEX,
    hairStyle: selection.hairStyle,
    hairColor: selection.hairColor,
    apparel: selection.apparel,
    apparelColor: selection.apparelColor,
  });

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
  // Eyewear + earring layers each get their OWN tint colour so the user
  // can have, e.g., gold glasses + silver earrings. If a tint is null
  // the layer renders in its designed Figma colour.
  const eyewearTintHex = TINT_COLOR_HEX[selection.eyewearTintColor];
  const earringTintHex = TINT_COLOR_HEX[selection.earringTintColor];
  let eyewearSrc = null;
  if (selection.eyewear && EYEWEAR_RAW_LAYERS[selection.eyewear]) {
    const raw = EYEWEAR_RAW_LAYERS[selection.eyewear];
    const original = EYEWEAR_RAW_PRIMARY[selection.eyewear];
    eyewearSrc = svgToDataUrl(eyewearTintHex ? recolor(raw, original, eyewearTintHex) : raw);
  }
  let earringSrc = null;
  if (selection.earring && EARRING_RAW_LAYERS[selection.earring]) {
    const raw = EARRING_RAW_LAYERS[selection.earring];
    const original = EARRING_RAW_PRIMARY[selection.earring];
    earringSrc = svgToDataUrl(earringTintHex ? recolor(raw, original, earringTintHex) : raw);
  }
  const facialHairSrc = selection.facialHair ? FACIAL_HAIR_LAYERS[selection.facialHair] : null;
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
    <div className={classNames('w-full max-w-[min(62vh,620px)] mx-auto', className)}>
      {/* clip-path: circle frames the avatar inside the white inner
        disc that sits behind it. Radius bumped to 50% so the disc
        spans the FULL wrapper — clamped to the avatar's bounding box,
        with the outfit-bottom landing on the disc's bottom curve when
        a preset is selected. Anything outside the disc is clipped. */}
      <div
        className="relative aspect-square w-full"
        style={{
          clipPath: 'circle(50% at 50% 50%)',
          // Faint white tint on top of the green stage. Alpha lowered
          // from 0.55 → 0.22 — the disc reads as a subtle lift over
          // the background instead of an over-bright white wash.
          backgroundColor: 'rgba(255, 255, 255, 0.22)',
        }}
      >
        {/* INNER GREEN DISC behind the head.
          • Size: 48.72% (1.5% bigger than the original 48%).
          • Top: 47% → 50% — another small downward nudge so the disc
            centre lands closer to the head's mid-face area instead
            of riding up over the forehead.
          Colour stays at the soft #b8d3ad halo green. */}
        <div
          aria-hidden="true"
          className="absolute rounded-full"
          style={{
            left: '50%',
            top: '50%',
            width: '48.72%',
            height: '48.72%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#b8d3ad',
          }}
        />
        {/* Single wrapper SVG with a tight viewBox that crops every layer
          to the character area. Replaces the earlier CSS-scale approach:
          • Cropping via viewBox keeps the character centred horizontally
            (no more rightward drift from a non-centre transform-origin).
          • The crop dimensions (LAYER_VIEWBOX = "350 180 400 400") cover
            the full character — hair top, face, neck, and outfit bottom
            — so nothing gets truncated at the canvas edges.
          • All layers ride on the same coordinate space (0–1024 source,
            same viewBox crop) so they register perfectly without per-layer
            alignment. */}
        <svg
          viewBox={LAYER_VIEWBOX}
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Avatar preview"
          className="absolute inset-0 h-full w-full"
          // Avatar shifted UP — translateY dropped 24% → 6% — so the
          // outfit isn't pushed past the disc's bottom curve and
          // hidden by the clip. At 6% the head sits cleanly inside
          // the disc and the outfit reads as a full, visible band
          // rather than a thin sliver at the bottom.
          style={{ transform: 'translateY(6%)' }}
        >
          {/*
            HEAD-AREA SCALE TRANSFORM
            Every face-area layer (body-base, hair, glasses, facial hair,
            earrings, details) is wrapped in <g transform="…"> so they
            all shrink together at the same scale (0.85× ≈ 15% smaller)
            without distortion.

            Fixed point chosen so the head's BOTTOM (originally y=423)
            lands at y=443 after scaling — exactly where outfit
            necklines start. This eliminates the visible neck gap that
            appeared when the head was shrunk while the (full-size)
            outfit stayed put.

            Resulting transform: translate(82.95 83.45) scale(0.85).
            The outfit layer is OUTSIDE this <g> so the chest stays
            full-size.
          */}

          {/* Layer 1: wrap-around hair (Afro, Hijab, Kente Wrap) — BEHIND body */}
          {hairSrc && isWrapAround && (
            <g transform="translate(82.95 83.45) scale(0.85)">
              <Layer src={hairSrc} />
            </g>
          )}

          {/* Layer 2: body base — head + face + neck (scaled) */}
          <g transform="translate(82.95 83.45) scale(0.85)">
            <Layer src={bodySrc} />
          </g>

          {/* Layer 3: outfit (chest blob).
            Wrapped in a matrix transform that:
              • scales X to 0.85 (slimmer),
              • scales Y to 0.85 (taller — bumped from 0.78 so the
                outfit body reads as a full top instead of cropped),
              • SHIFTS RIGHT (tx 66.8 → 82.95) so the outfit's centre
                lands at x'=518.15 — exactly the same x as the
                head's centre after the head-area transform. Outfit
                now sits directly under the neck instead of drifting
                left of it.
            Math: x' = 0.85·x + 82.95  → x=512 → 518.15 (head centre);
                  y' = 0.85·y + 66.45  → fixes y=443 → 443 (neck).
            matrix(a b c d e f) = (0.85, 0, 0, 0.85, 82.95, 66.45). */}
          {outfitSrc && (
            <g transform="matrix(0.85 0 0 0.85 82.95 66.45)">
              <Layer src={outfitSrc} />
            </g>
          )}

          {/* Layers 4–8: face decorations (all share the head scale) */}
          <g transform="translate(82.95 83.45) scale(0.85)">
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
          </g>
        </svg>
      </div>

      {/* Undo lives on the stage overlay bar (rendered by
        AvatarStepLayout), not here — keeps the layout matching the
        Figma reference where undo/username/shuffle share one row. */}
    </div>
  );
};

export default AvatarPreview;
