import { classNames } from '../../../../utils/classNames.js';
import {
  AvatarOptionTile,
  AvatarColorSwatch,
  AvatarStatPill,
  AvatarSectionHeader,
} from './avatarPrimitives.jsx';
import { useAvatarSelection } from '../../../../hooks/useAvatarSelection.js';
import { debug } from '../../../../utils/debug.js';

// Category tab icons — designer-exported icon PNGs (no labels baked in).
// The text label is rendered next to each icon in code so we can also
// switch background + text color when the tab is active.
import styleIcon from '../../../../assets/engagement/light_styler.png';
import skinIcon from '../../../../assets/engagement/dark-skin-tone.png';
import hairIcon from '../../../../assets/engagement/Vector.png';
import extrasIcon from '../../../../assets/engagement/glasses-linear.png';
import outfitIcon from '../../../../assets/engagement/clothes-hanger.png';

// 10 base-style character SVGs, in the exact order requested.
import greenBoy from '../../../../assets/engagement/greenboy character.svg';
import pinkBoyDreads from '../../../../assets/engagement/pinkboy with dreads.svg';
import hatchback from '../../../../assets/engagement/hatchback.svg';
import lightGreenBoy from '../../../../assets/engagement/lightgreenboy.svg';
import yellowBoy from '../../../../assets/engagement/yellowboy.svg';
import lightBlue from '../../../../assets/engagement/lightblue.svg';
import pinkBoy from '../../../../assets/engagement/pinkboy.svg';
import purpleBoy from '../../../../assets/engagement/purpleboy.svg';
import redBoy from '../../../../assets/engagement/redboy.svg';
import blueBoy from '../../../../assets/engagement/blueboy.svg';

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

// 10 base style options. Order matches the user-supplied asset list.
const BASE_STYLES = [
  { id: 'style-greenboy', label: 'Green Sweater', image: greenBoy },
  { id: 'style-pinkboy-dreads', label: 'Pink + Dreads', image: pinkBoyDreads },
  { id: 'style-hatchback', label: 'Hatchback', image: hatchback },
  { id: 'style-lightgreenboy', label: 'Light Green', image: lightGreenBoy },
  { id: 'style-yellowboy', label: 'Yellow', image: yellowBoy },
  { id: 'style-lightblue', label: 'Light Blue', image: lightBlue },
  { id: 'style-pinkboy', label: 'Pink', image: pinkBoy },
  { id: 'style-purpleboy', label: 'Purple', image: purpleBoy },
  { id: 'style-redboy', label: 'Red', image: redBoy },
  { id: 'style-blueboy', label: 'Blue', image: blueBoy },
];

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

// Each category tab is rendered as a single image — the PNGs from the
// designer already contain the icon + label baked in. Clicking the
// image wraps it in a button so it's keyboard-accessible.
const CATEGORY_TABS = [
  { id: 'style', label: 'Style', image: styleIcon },
  { id: 'skin', label: 'Skin', image: skinIcon },
  { id: 'hair', label: 'Hair', image: hairIcon },
  { id: 'extras', label: 'Extras', image: extrasIcon },
  { id: 'outfit', label: 'Outfit', image: outfitIcon },
];

// Tab pill: small icon (designer PNG) + text label, rendered in code so we
// can flip the pill colour on active. Active = solid brand-green pill with
// white icon + label; inactive = white pill with border + dark text. We
// apply `invert` on the icon when active so the dark line-art reads as
// white on the green background.
const CategoryTabButton = ({ image, label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    aria-label={label}
    className={classNames(
      'inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5',
      'font-sans font-semibold text-[13px] leading-5 tracking-[0.1px]',
      'border transition-[background-color,border-color,color] duration-150',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      active
        ? 'bg-brand-green border-brand-green text-white'
        : 'bg-white border-border-default text-content-primary hover:border-brand-green-light-active'
    )}
  >
    <img
      src={image}
      alt=""
      aria-hidden="true"
      draggable="false"
      className={classNames(
        'block size-4 select-none',
        // Flip the dark line-art to white when the pill is green.
        active ? 'invert brightness-0' : ''
      )}
    />
    <span>{label}</span>
  </button>
);

// Tile body: render the designer character SVG centred inside the tile
// with a little breathing room. `object-contain` preserves the figure's
// aspect so heads don't get cropped at the top.
const StyleCharacter = ({ image, alt }) => (
  <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center p-1">
    <img src={image} alt={alt} className="block size-full object-contain" draggable="false" />
  </span>
);

const AvatarStylePanel = ({ activeTab = 'style', onTabSelect, className }) => {
  log('render');
  const { selection, setField } = useAvatarSelection();

  return (
    <div className={classNames('flex flex-col gap-6', className)}>
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

      {/* Category tabs — each tab is the designer-provided PNG, no
        additional border / text added in code. */}
      <nav aria-label="Customisation categories" className="flex flex-wrap items-center gap-2">
        {CATEGORY_TABS.map((tab) => (
          <CategoryTabButton
            key={tab.id}
            image={tab.image}
            label={tab.label}
            active={tab.id === activeTab}
            onClick={() => onTabSelect?.(tab.id)}
          />
        ))}
      </nav>

      {/* Base style grid */}
      <section className="flex flex-col gap-3">
        <AvatarSectionHeader title="Choose a base style" meta="10 Options" />
        <div className="grid grid-cols-5 gap-2">
          {BASE_STYLES.map((style) => (
            <AvatarOptionTile
              key={style.id}
              selected={selection.baseStyle === style.id}
              onClick={() => setField('baseStyle', style.id)}
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
