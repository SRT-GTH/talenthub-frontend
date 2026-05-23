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

// Extras SVG icons — positions 1 / 5 / 9 are text-only "None" tiles
// (no SVG), so the imports skip those slots. Strict positional order:
//   eyewear:    [None, 2, 3, 4]
//   facialHair: [None, 6, 7, 8]
//   earrings:   [None, 10, 11, 12]
//   details:    [13, 14, 15, 16, 17]
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

const log = debug('AvatarExtrasPanel');

/*
 * AvatarExtrasPanel — the right-side panel on the Extras step.
 * Source: Figma frame (Avatar — Extras).
 *
 * Extras are grouped into 4 sections:
 *   - Eyewear     — pick one of {None, 3 SVG options}
 *   - Facial hair — pick one of {None, 3 SVG options}
 *   - Earrings    — pick one of {None, 3 SVG options}
 *   - Details     — multi-select from 5 SVG options
 *
 * In the Figma asset export, every group's first option ("None") is a
 * text-only tile with a sub-label ("No glasses", "Clean", "No Earring") —
 * those positions have no SVG and we render the text directly inside
 * the tile body.
 *
 * Selections live in AvatarSelectionProvider.
 */

// ---------------------------------------------------------------------------
// Pick-one groups
// ---------------------------------------------------------------------------

const EYEWEAR_OPTIONS = [
  { id: 'eyewear-none', label: 'None', sub: 'No glasses', noneTile: true },
  { id: 'eyewear-2', label: 'Locs', image: extra2 },
  { id: 'eyewear-3', label: 'Kente Wrap', image: extra3 },
  { id: 'eyewear-4', label: 'Long Curly', image: extra4 },
];

const FACIAL_HAIR_OPTIONS = [
  { id: 'facial-none', label: 'None', sub: 'Clean', noneTile: true },
  { id: 'facial-6', label: 'Goatee', image: extra6 },
  { id: 'facial-7', label: 'Stubble', image: extra7 },
  { id: 'facial-8', label: 'Full Beard', image: extra8 },
];

// Earring tile sizes — Stud and Hoop render extra-small (designer
// intent: studs/hoops read smaller than chunkier earrings). Stud (10th)
// is smaller than Hoop (11th); Drop (12th) keeps the default size.
const EARRING_OPTIONS = [
  { id: 'earring-none', label: 'None', sub: 'No Earring', noneTile: true },
  { id: 'earring-10', label: 'Stud', image: extra10, imageSizeClass: 'size-5' },
  { id: 'earring-11', label: 'Hoop', image: extra11, imageSizeClass: 'size-7' },
  { id: 'earring-12', label: 'Drop', image: extra12 },
];

// ---------------------------------------------------------------------------
// Multi-select group
// ---------------------------------------------------------------------------

const DETAIL_OPTIONS = [
  { id: 'detail-13', label: 'Freckles', image: extra13 },
  { id: 'detail-14', label: 'Adinkra mark', image: extra14 },
  { id: 'detail-15', label: 'Beauty mark', image: extra15 },
  { id: 'detail-16', label: 'Blush', image: extra16 },
  { id: 'detail-17', label: 'Glow', image: extra17 },
];

// ---------------------------------------------------------------------------
// Tint swatches (used by earrings + glasses where applicable)
// ---------------------------------------------------------------------------

const TINT_COLORS = [
  { id: 'black', color: '#0F0F0F', label: 'Black' },
  { id: 'gold', color: '#D4A23F', label: 'Gold' },
  { id: 'silver', color: '#C7C7C7', label: 'Silver' },
  { id: 'rose-gold', color: '#D9846F', label: 'Rose Gold' },
  { id: 'brown', color: '#6B3F23', label: 'Brown' },
  { id: 'clear', color: '#E9F0F3', label: 'Clear' },
];

// ---------------------------------------------------------------------------
// Tile bodies
// ---------------------------------------------------------------------------

// "None" tile body — bold "None" label centred, with a smaller sub-label
// underneath ("No glasses" / "Clean" / "No Earring"). Used for the first
// tile in each pick-one group.
const NoneTileBody = ({ sub }) => (
  <span
    aria-hidden="true"
    className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 px-1 text-center"
  >
    <span className="font-sans font-semibold text-[12px] leading-4 tracking-[0.1px] text-content-primary">
      None
    </span>
    <span className="font-sans text-[10px] leading-[12px] tracking-[0.2px] text-neutral-dark-hover">
      {sub}
    </span>
  </span>
);

// Standard SVG tile body — fixed visible size (default size-10 = 40px)
// so most extras icons render at the same on-screen size regardless of
// the source SVG's intrinsic dimensions. Specific tiles can override
// via `imageSizeClass` (e.g. Stud / Hoop use smaller sizes by design).
const ExtraVisual = ({ image, alt, imageSizeClass = 'size-10' }) => (
  <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
    <img
      src={image}
      alt={alt}
      className={classNames('block object-contain', imageSizeClass)}
      draggable="false"
    />
  </span>
);

// One pick-one group (Eyewear / Facial hair / Earrings). Each tile
// surfaces its label below the icon. "None" tiles bake the label and
// sub-label into the body, so the AvatarOptionTile caption is omitted
// for those (the body already carries both lines).
const PickOneGroup = ({ title, options, value, onChange }) => (
  <section className="flex flex-col gap-3">
    <AvatarSectionHeader title={title} meta="Pick one" />
    <div className="grid grid-cols-4 gap-2">
      {options.map((opt) => (
        <AvatarOptionTile
          key={opt.id}
          selected={value === opt.id}
          onClick={() => onChange(opt.id)}
          ariaLabel={opt.noneTile ? `${opt.label} — ${opt.sub}` : opt.label}
          label={opt.noneTile ? undefined : opt.label}
        >
          {opt.noneTile ? (
            <NoneTileBody sub={opt.sub} />
          ) : (
            <ExtraVisual image={opt.image} alt={opt.label} imageSizeClass={opt.imageSizeClass} />
          )}
        </AvatarOptionTile>
      ))}
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

const AvatarExtrasPanel = ({ activeTab = 'extras', onTabSelect, className }) => {
  log('render');
  const { selection, setField, toggleMulti } = useAvatarSelection();

  // Count how many extras are currently picked (excluding the "None"
  // sentinels). Echoes the "3 SELECTED" pill on the Figma reference.
  const selectedCount = [
    selection.eyewear && !selection.eyewear.endsWith('-none') ? 1 : 0,
    selection.facialHair && !selection.facialHair.endsWith('-none') ? 1 : 0,
    selection.earring && !selection.earring.endsWith('-none') ? 1 : 0,
    selection.details?.length ?? 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className={classNames('flex flex-col gap-6', className)}>
      {/* Header */}
      <header>
        <h2 className="font-display text-[clamp(22px,2.2vw,28px)] leading-[1.1] tracking-[-0.2px] text-content-primary">
          Add your extras
        </h2>
        <p className="mt-1 font-sans text-[13px] leading-5 tracking-[0.2px] text-neutral-darker">
          Eyewear, facial hair, earrings, and finishing details — go light or stack a few.
        </p>
      </header>

      {/* Stat pills */}
      <div className="flex flex-wrap items-center gap-2">
        <AvatarStatPill count="24" label="styles" />
        <AvatarStatPill count="12" label="Skin Tones" />
        <AvatarStatPill count="18" label="Hairstyles" />
        <AvatarStatPill count={String(selectedCount)} label="Selected" />
      </div>

      {/* Category tabs — shared 5-pill row. */}
      <AvatarCategoryTabs activeTab={activeTab} onTabSelect={onTabSelect} />

      {/* Pick-one groups */}
      <PickOneGroup
        title="Eyewear"
        options={EYEWEAR_OPTIONS}
        value={selection.eyewear}
        onChange={(id) => setField('eyewear', id)}
      />
      <PickOneGroup
        title="Facial hair"
        options={FACIAL_HAIR_OPTIONS}
        value={selection.facialHair}
        onChange={(id) => setField('facialHair', id)}
      />
      <PickOneGroup
        title="Earrings"
        options={EARRING_OPTIONS}
        value={selection.earring}
        onChange={(id) => setField('earring', id)}
      />

      {/* Multi-select details */}
      <section className="flex flex-col gap-3">
        <AvatarSectionHeader title="Details · multi-select" meta="Pick any" />
        <div className="grid grid-cols-5 gap-2">
          {DETAIL_OPTIONS.map((opt) => (
            <AvatarOptionTile
              key={opt.id}
              selected={selection.details?.includes(opt.id)}
              onClick={() => toggleMulti('details', opt.id)}
              ariaLabel={opt.label}
              label={opt.label}
            >
              <ExtraVisual image={opt.image} alt={opt.label} />
            </AvatarOptionTile>
          ))}
        </div>
      </section>

      {/* Tint colour swatches */}
      <section className="flex flex-col gap-3">
        <AvatarSectionHeader title="Tint" meta="Earrings, glasses tint" />
        <div className="flex flex-wrap items-center gap-2.5">
          {TINT_COLORS.map((shade) => (
            <AvatarColorSwatch
              key={shade.id}
              color={shade.color}
              selected={selection.tintColor === shade.id}
              onClick={() => setField('tintColor', shade.id)}
              ariaLabel={shade.label}
            />
          ))}
        </div>
      </section>

      {/* Helper tip */}
      <AvatarHelperTip>
        <span className="font-semibold">Tip:</span> Recruiters glance for two seconds. Pick the
        details that signal your archetype, not your wardrobe.
      </AvatarHelperTip>
    </div>
  );
};

export default AvatarExtrasPanel;
