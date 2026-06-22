import { classNames } from '../../../../utils/classNames.js';
import {
  AvatarOptionTile,
  AvatarColorSwatch,
  AvatarStatPill,
  AvatarSectionHeader,
} from './avatarPrimitives.jsx';
import AvatarCategoryTabs from './AvatarCategoryTabs.jsx';
import { useAvatarSelection } from '../../../../hooks/useAvatarSelection.js';
import { debug } from '../../../../utils/debug.js';

// 10 base-style character SVGs (Figma export names: firstavatar.svg
// through tenthavatar.svg, in design order).
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

const log = debug('AvatarStylePanel');

/*
 * AvatarStylePanel — the right-side panel on the Style step.
 * Source: Figma frame (Avatar — Customise your look).
 *
 * Layout:
 *   ├─ header  "Customise your look" + helper line
 *   ├─ stat pills row (24 styles · 12 Skin Tones · 18 Hairstyles · 14 Extras)
 *   ├─ category tabs (Style active · Skin · Hair · Extras · Outfit)
 *   ├─ "Choose a base style" + "10 Options"  → 10 tiles in a 5x2 grid
 *   └─ "Skin tone" + "Quick Pick"            → 8 round swatches
 *
 * Tiles use designer-provided character SVGs (one per base style) and the
 * category tabs use designer PNG icons. Selections live in the
 * AvatarSelectionProvider so they persist across step pages.
 */

// 10 base style options. Order matches the Figma export order
// (firstavatar → tenthavatar). Labels are generic for now — tile body is
// the avatar SVG itself; the label only shows in aria-label / tooltip.
const BASE_STYLES = [
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

// Each base style is a quick-pick PRESET — clicking a tile pre-fills
// every other panel with a coherent look (skin tone, hair, outfit,
// extras, colours). Users can then tweak from there. This is what the
// 10 Style tiles do now in the layered avatar world; previously they
// only set `baseStyle` and the live preview ignored them.
//
// Combinations are designed to span the variation space — different
// hair shapes, different outfits, different skin tones, different
// colour palettes — so there's a tile that lands close to "you" for
// most users to start from.
const STYLE_PRESETS = {
  'style-1': {
    skinTone: 'cocoa',
    lightness: 0,
    hairStyle: 'hair-1',
    hairColor: 'black',
    apparel: 'outfit-tee',
    apparelColor: 'brand-green', // matches the green Tee in the Style 1 tile
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
    apparelColor: 'rose', // pink hoodie + dreads tile
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
    apparelColor: 'violet', // purple hijab in the Style 3 tile
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
    apparelColor: 'brand-green', // light-green outfit in the Style 4 tile
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
    apparelColor: 'kente-gold', // yellow outfit
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
    apparelColor: 'kente-gold', // kente-pattern shirt
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
    apparelColor: 'rose', // pink outfit
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
    apparelColor: 'violet', // purple
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
    apparelColor: 'red', // red outfit in the Style 9 tile
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
    apparelColor: 'ocean', // blue outfit
    fit: 'regular',
    eyewear: 'eyewear-none',
    facialHair: 'facial-none',
    earring: 'earring-11',
    details: 'detail-16',
  },
};

// 8 skin tones — round swatches under the style grid.
const SKIN_TONES = [
  { id: 'soft-almond', color: '#F2D7B6', label: 'Soft Almond' },
  { id: 'warm-sand', color: '#E8C098', label: 'Warm Sand' },
  { id: 'honey', color: '#C58F66', label: 'Honey' },
  { id: 'caramel', color: '#A77244', label: 'Caramel' },
  { id: 'bronze', color: '#8C5E40', label: 'Bronze' },
  { id: 'cocoa-light', color: '#7E4F38', label: 'Cocoa Light' },
  { id: 'cocoa', color: '#6B4530', label: 'Cocoa' },
  { id: 'mahogany', color: '#54392A', label: 'Mahogany' },
];

// Tile body: render the designer character SVG centred inside the tile.
// Image scales with viewport so it stays proportional to the tile (which
// is itself clamped 56–97px). At 1728-wide design frame the image is
// ~80px (~82% of a 97-tile); on smaller viewports both shrink together.
// `object-contain` preserves aspect ratio.
const StyleCharacter = ({ image, alt }) => (
  <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
    <img
      src={image}
      alt={alt}
      className="block w-[clamp(40px,4.6vw,80px)] h-[clamp(40px,4.6vw,80px)] object-contain"
      draggable="false"
    />
  </span>
);

const AvatarStylePanel = ({ activeTab = 'style', onTabSelect, className }) => {
  log('render');
  const { selection, setField } = useAvatarSelection();

  // Apply a preset — sets baseStyle plus every field defined for that
  // style. Subsequent clicks on other panels override individual fields.
  const applyPreset = (styleId) => {
    log('apply preset', styleId);
    setField('baseStyle', styleId);
    const preset = STYLE_PRESETS[styleId];
    if (!preset) return;
    Object.entries(preset).forEach(([key, value]) => {
      setField(key, value);
    });
  };

  return (
    // gap shrinks with viewport so the panel fits non-scrollably on
    // smaller laptops. 24px at the 1728-wide design frame; floor 12px.
    <div className={classNames('flex flex-col gap-[clamp(12px,1.5vw,24px)]', className)}>
      {/* Header */}
      <header>
        <h2 className="font-display text-[clamp(22px,2.2vw,28px)] leading-[1.1] tracking-[-0.2px] text-content-primary">
          Customise your look
        </h2>
        <p className="mt-1 font-sans text-[13px] leading-5 tracking-[0.2px] text-neutral-darker">
          Select a style tile — preview updates instantly on the left.
        </p>
      </header>

      {/* Stat pills */}
      <div className="flex flex-wrap items-center gap-2">
        <AvatarStatPill count="24" label="styles" />
        <AvatarStatPill count="12" label="Skin Tones" />
        <AvatarStatPill count="18" label="Hairstyles" />
        <AvatarStatPill count="14" label="Extras" />
      </div>

      {/* Category tabs — shared 5-pill row (Style / Skin / Hair / Extras
        / Outfit). Active pill is solid brand-green. */}
      <AvatarCategoryTabs activeTab={activeTab} onTabSelect={onTabSelect} />

      {/* Base style grid */}
      <section className="flex flex-col gap-3">
        <AvatarSectionHeader title="Choose a base style" meta="10 Options" />
        <div className="grid grid-cols-5 gap-2">
          {BASE_STYLES.map((style) => (
            <AvatarOptionTile
              key={style.id}
              selected={selection.baseStyle === style.id}
              onClick={() => applyPreset(style.id)}
              ariaLabel={style.label}
            >
              <StyleCharacter image={style.image} alt={style.label} />
            </AvatarOptionTile>
          ))}
        </div>
      </section>

      {/* Skin tone swatch row */}
      <section className="flex flex-col gap-3">
        <AvatarSectionHeader title="Skin tone" meta="Quick Pick" />
        <div className="flex flex-wrap items-center gap-2.5">
          {SKIN_TONES.map((tone) => (
            <AvatarColorSwatch
              key={tone.id}
              color={tone.color}
              selected={selection.skinTone === tone.id}
              onClick={() => setField('skinTone', tone.id)}
              ariaLabel={tone.label}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AvatarStylePanel;
