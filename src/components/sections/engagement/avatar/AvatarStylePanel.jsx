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

// Tile body: render the designer character SVG centred inside the tile
// at a fixed visible size (size-12 = 48px square) so every tile shows
// the character at the same on-screen size regardless of the source
// SVG's intrinsic dimensions. `object-contain` preserves aspect.
const StyleCharacter = ({ image, alt }) => (
  <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
    <img src={image} alt={alt} className="block size-12 object-contain" draggable="false" />
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
