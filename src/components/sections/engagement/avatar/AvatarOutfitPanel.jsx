import { classNames } from '../../../../utils/classNames.js';
import {
  AvatarOptionTile,
  AvatarColorSwatch,
  AvatarStatPill,
  AvatarSectionHeader,
  AvatarHelperTip,
} from './avatarPrimitives.jsx';
import AvatarCategoryTabs from './AvatarCategoryTabs.jsx';
import { useAvatarSelection } from '../../../../hooks/useAvatarSelection.js';
import { debug } from '../../../../utils/debug.js';

// 11 outfit tiles — Figma export order (firstoutfit → eleventhoutfit).
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

const log = debug('AvatarOutfitPanel');

/*
 * AvatarOutfitPanel — the right-side panel on the Outfit step (final
 * avatar step). Source: Figma frame ("Dress how you show up.").
 *
 * Layout:
 *   ├─ header  "Dress how you show up." + helper line
 *   ├─ stat pills row
 *   ├─ category tabs (Outfit active)
 *   ├─ Career presets    — 4 pill chips (Designer/Engineer/Healthcare/Educator)
 *   ├─ Apparel           — 6×2 grid (11 outfit tiles with labels)
 *   ├─ Fit               — 3-pill row (Slim/Regular/Relaxed)
 *   └─ Colour            — 8 round swatches
 *
 * The Outfit step is the last in the customiser flow; the parent page
 * relabels the primary CTA to "Save outfit, finish avatar →".
 */

// Career presets — 4 quick-start chips above the apparel grid. Picking
// one is a shortcut that (in Phase 2) will pre-fill apparel + fit + colour
// to a sensible default for that career. Stored as `careerPreset` in the
// selection context.
const CAREER_PRESETS = [
  { id: 'designer', label: 'Designer fit' },
  { id: 'engineer', label: 'Engineer fit' },
  { id: 'healthcare', label: 'Healthcare fit' },
  { id: 'educator', label: 'Educator fit' },
];

// 11 apparel options in strict positional order. Labels match the Figma
// reference (Tee → Athletic).
const OUTFITS = [
  { id: 'outfit-tee', label: 'Tee', image: outfit1 },
  { id: 'outfit-hoodie', label: 'Hoodie', image: outfit2 },
  { id: 'outfit-polo', label: 'Polo', image: outfit3 },
  { id: 'outfit-button-down', label: 'Button-Down', image: outfit4 },
  { id: 'outfit-kente-top', label: 'Kente Top', image: outfit5 },
  { id: 'outfit-suit', label: 'Suit', image: outfit6 },
  { id: 'outfit-hijab-fit', label: 'Hijab fit', image: outfit7 },
  { id: 'outfit-dashiki', label: 'Dashiki', image: outfit8 },
  { id: 'outfit-lab-coat', label: 'Lab coat', image: outfit9 },
  { id: 'outfit-chef-whites', label: 'Chef whites', image: outfit10 },
  { id: 'outfit-athletic', label: 'Athletic', image: outfit11 },
];

// 3 fit options.
const FIT_OPTIONS = [
  { id: 'slim', label: 'Slim' },
  { id: 'regular', label: 'Regular' },
  { id: 'relaxed', label: 'Relaxed' },
];

// 8 apparel colours.
const APPAREL_COLORS = [
  { id: 'brand-green', color: '#387440', label: 'Brand Green' },
  { id: 'kente-gold', color: '#D4A23F', label: 'Kente Gold' },
  { id: 'sunset-orange', color: '#E58B3A', label: 'Sunset Orange' },
  { id: 'rose', color: '#C95E7C', label: 'Rose' },
  { id: 'violet', color: '#6B4D9E', label: 'Violet' },
  { id: 'ocean', color: '#2F6B8C', label: 'Ocean' },
  { id: 'charcoal', color: '#2A2A2A', label: 'Charcoal' },
  { id: 'cream', color: '#EDE3CC', label: 'Cream' },
];

// Tile body: render the designer outfit SVG centred at a fixed visible
// size (size-10 = 40px). This normalises the on-screen size across all
// outfit tiles — without it, SVGs with different intrinsic dimensions
// would each render at their own size and the grid would look uneven.
const OutfitVisual = ({ image, alt }) => (
  <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
    <img src={image} alt={alt} className="block size-10 object-contain" draggable="false" />
  </span>
);

// Generic small pill — used for both Career presets and Fit selectors.
const ChoicePill = ({ active, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={classNames(
      'inline-flex items-center justify-center rounded-pill px-4 py-1.5',
      'font-sans font-semibold text-[13px] leading-5 tracking-[0.1px]',
      'border transition-[background-color,border-color,color] duration-150',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      active
        ? 'bg-brand-green border-brand-green text-white'
        : 'bg-white border-border-default text-content-primary hover:border-brand-green-light-active'
    )}
  >
    {label}
  </button>
);

const AvatarOutfitPanel = ({ activeTab = 'outfit', onTabSelect, className }) => {
  log('render');
  const { selection, setField } = useAvatarSelection();

  return (
    <div className={classNames('flex flex-col gap-6', className)}>
      {/* Header */}
      <header>
        <h2 className="font-display text-[clamp(22px,2.2vw,28px)] leading-[1.1] tracking-[-0.2px] text-content-primary">
          Dress how you show up.
        </h2>
        <p className="mt-1 font-sans text-[13px] leading-5 tracking-[0.2px] text-neutral-darker">
          Last one! Pick an outfit and finalise your avatar.
        </p>
      </header>

      {/* Stat pills */}
      <div className="flex flex-wrap items-center gap-2">
        <AvatarStatPill count="24" label="styles" />
        <AvatarStatPill count="12" label="Skin Tones" />
        <AvatarStatPill count="18" label="Hairstyles" />
        <AvatarStatPill count="14" label="Extras" />
      </div>

      {/* Category tabs — shared 5-pill row. */}
      <AvatarCategoryTabs activeTab={activeTab} onTabSelect={onTabSelect} />

      {/* Career presets — 4 quick-pick chips */}
      <section className="flex flex-col gap-3">
        <AvatarSectionHeader title="Career presets" meta="12 fits · pick one" />
        <div className="flex flex-wrap items-center gap-2">
          {CAREER_PRESETS.map((preset) => (
            <ChoicePill
              key={preset.id}
              label={preset.label}
              active={selection.careerPreset === preset.id}
              onClick={() => setField('careerPreset', preset.id)}
            />
          ))}
        </div>
      </section>

      {/* Apparel grid — 6 columns × 2 rows (last row has 5) */}
      <section className="flex flex-col gap-3">
        <AvatarSectionHeader title="Apparel" meta="Pick one" />
        <div className="grid grid-cols-6 gap-2">
          {OUTFITS.map((outfit) => (
            <AvatarOptionTile
              key={outfit.id}
              selected={selection.apparel === outfit.id}
              onClick={() => setField('apparel', outfit.id)}
              ariaLabel={outfit.label}
              label={outfit.label}
            >
              <OutfitVisual image={outfit.image} alt={outfit.label} />
            </AvatarOptionTile>
          ))}
        </div>
      </section>

      {/* Fit selector — right-aligned 3-pill row */}
      <section className="flex flex-col gap-3">
        <AvatarSectionHeader title="Fit" meta="Pick one" />
        <div className="flex flex-wrap items-center justify-end gap-2">
          {FIT_OPTIONS.map((fit) => (
            <ChoicePill
              key={fit.id}
              label={fit.label}
              active={selection.fit === fit.id}
              onClick={() => setField('fit', fit.id)}
            />
          ))}
        </div>
      </section>

      {/* Colour swatches */}
      <section className="flex flex-col gap-3">
        <AvatarSectionHeader title="Colour" meta="Solid + traditional" />
        <div className="flex flex-wrap items-center gap-2.5">
          {APPAREL_COLORS.map((shade) => (
            <AvatarColorSwatch
              key={shade.id}
              color={shade.color}
              selected={selection.apparelColor === shade.id}
              onClick={() => setField('apparelColor', shade.id)}
              ariaLabel={shade.label}
            />
          ))}
        </div>
      </section>

      {/* Helper tip */}
      <AvatarHelperTip>
        <span className="font-semibold">Heads up:</span> Recruiters see your avatar before they see
        your name — pick the fit that reflects how you want to be remembered, not what feels safest.
      </AvatarHelperTip>
    </div>
  );
};

export default AvatarOutfitPanel;
